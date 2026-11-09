"""Reads the chore templates and the kids' chore lists in Google Tasks every minute, and keeps
the lists filled from the templates. School-days chores follow the school days and lunches the
lunch coordinator reads from the lunch and family calendars.

Nothing about chores is kept in Home Assistant except which Google Tasks lists are the base
lists and the kids' lists, so a list renamed in Google is still found.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable, Mapping
from dataclasses import dataclass, field, replace
from datetime import date, datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .chore_rules import (
    REPEATS,
    Repeats,
    SchoolDays,
    Template,
    edit_block,
    parse_template,
    read_block,
    repeats_label,
    template_notes,
)
from .chores import Chore, Make, Remove, TaskItem, Update, board_items, plan_changes, read_chore, template_item
from .const import (
    CHORE_UPDATE_SECONDS,
    DOMAIN,
    KID_LIST_TITLE,
    OLD_TEMPLATE_LIST_TITLES,
    SEED_LIST_TITLE,
    TASKS_SCOPE,
)
from .google import GoogleApiDisabled, GoogleAuthError, GoogleError
from .settings import HubSettings
from .tasks_api import GoogleTasksApi, TaskList, TaskRecord, TasksNeedSignIn, TasksNotFound

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.chore_lists"
STORE_VERSION = 1
FILL_BATCHES = 5
DONE_HISTORY_DAYS = 62
"""How far back done chores are read: long enough to know a monthly chore was done."""


@dataclass(slots=True)
class ChoreData:
    updated: datetime
    today: date
    time_zone: str
    chores: list[Chore] = field(default_factory=list)
    templates: list[Template] = field(default_factory=list)
    seed_list: str = ""
    """The id of the list the templates ("seeds") are on."""
    kid_lists: dict[str, str] = field(default_factory=dict)
    needs: str | None = None
    """Why chores can't work right now: ``sign_in`` or ``tasks_api``."""


def tasks_granted(token: Mapping[str, Any]) -> bool:
    """Whether the Google sign-in includes Google Tasks. Sign-ins from before chores don't."""
    scope = token.get("scope")
    if isinstance(scope, list):
        scope = " ".join(str(s) for s in scope)
    return not isinstance(scope, str) or TASKS_SCOPE in scope.split()


class ChoreCoordinator(DataUpdateCoordinator[ChoreData]):
    config_entry: MyDashLightConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: MyDashLightConfigEntry,
        api: GoogleTasksApi,
        settings: HubSettings,
        write_lock: asyncio.Lock,
        school: Callable[[], SchoolDays | None] = lambda: None,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN}_chores",
            update_interval=timedelta(seconds=CHORE_UPDATE_SECONDS),
        )
        self.api = api
        self.settings = settings
        self.write_lock = write_lock
        self.school = school
        """School days and lunches for school-days chores, or None while they can't be read."""
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self._ids: dict[str, Any] | None = None
        self._asked_sign_in = False
        self._saves = 0
        """Counts changes saved from the board, so a read that started before one is done again."""

    @property
    def kids(self) -> dict[str, str]:
        """Each kid's name by kid id, in the kids' order."""
        return {k.calendar_id: k.name for k in self.settings.roles.kids}

    @property
    def parents(self) -> dict[str, str]:
        """Each parent's name by driver id (``mom``, ``dad``)."""
        return dict(self.settings.driver_names)

    @property
    def people(self) -> dict[str, str]:
        """Everyone who can check off a chore: the kids, then the parents."""
        return {**self.kids, **self.parents}

    async def _async_update_data(self) -> ChoreData:
        tz = dt_util.get_default_time_zone()
        now = dt_util.now(tz)
        today = now.date()
        empty = ChoreData(updated=dt_util.utcnow(), today=today, time_zone=str(tz))
        if not tasks_granted(self.config_entry.data.get("token") or {}):
            return self._needs_sign_in(empty)
        try:
            # A change saved from the board while this read was under way would be undone by
            # it until the next read, so read once more: every board shows the change at once.
            for _attempt in range(2):
                saves = self._saves
                data = await self._async_read_and_fill(replace(empty), now)
                if saves == self._saves:
                    break
            return data
        except TasksNeedSignIn:
            return self._needs_sign_in(empty)
        except GoogleApiDisabled:
            empty.needs = "tasks_api"
            return empty
        except GoogleAuthError as err:
            raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="auth_failed") from err
        except GoogleError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN, translation_key="tasks_error", translation_placeholders={"error": str(err)}
            ) from err

    def _needs_sign_in(self, data: ChoreData) -> ChoreData:
        if not self._asked_sign_in:
            self._asked_sign_in = True
            _LOGGER.warning("Sign in to Google again in MyDashLight so chores can use Google Tasks")
            self.config_entry.async_start_reauth(self.hass)
        data.needs = "sign_in"
        return data

    async def _async_read_and_fill(self, data: ChoreData, now: datetime) -> ChoreData:
        today = now.date()
        seed_list, old_lists, kid_lists = await self._async_lists()
        templates = await self._async_templates(seed_list, old_lists, today)
        chores = await self._async_chores(kid_lists, now)
        school = self.school()
        # A first fill can be more than one batch of changes; keep going, a few batches a read.
        for _batch in range(FILL_BATCHES):
            plan = plan_changes(templates, chores, kid_lists, today, self.settings.chore_days_ahead, school)
            if not plan.changes:
                break
            await self._async_apply(plan.changes)
            chores = await self._async_chores(kid_lists, now)
            if not plan.more:
                break
        data.chores = chores
        data.templates = templates
        data.seed_list = seed_list
        data.kid_lists = dict(kid_lists)
        return data

    async def _async_apply(self, changes: list[Make | Update | Remove]) -> None:
        async with self.write_lock:
            for change in changes:
                try:
                    if isinstance(change, Make):
                        await self.api.async_insert(change.list_id, change.title, change.notes, change.due)
                    elif isinstance(change, Update):
                        await self.api.async_update(
                            change.list_id,
                            change.task_id,
                            title=change.title,
                            notes=change.notes,
                            done=True if change.complete else None,
                        )
                    else:
                        await self.api.async_delete(change.list_id, change.task_id)
                except TasksNotFound:
                    _LOGGER.debug("A chore changed in Google while being saved: %s", change)

    async def _async_lists(self) -> tuple[str, dict[Repeats, str], dict[str, str]]:
        """The seed list and each kid's list, made when missing, and any of the old template
        lists still there. A kid's list is renamed when the kid is."""
        if self._ids is None:
            self._ids = await self._store.async_load() or {}
        ids = self._ids
        saved_old: dict[str, str] = dict(ids.get("templates") or {})
        saved_kids: dict[str, str] = dict(ids.get("kids") or {})
        lists = await self.api.async_lists()
        by_id = {tl.id: tl for tl in lists}
        changed = False

        def existing(saved: str | None, title: str) -> TaskList | None:
            found = by_id.get(saved or "")
            return found or next((tl for tl in lists if tl.title.casefold() == title.casefold()), None)

        async def find(saved: str | None, title: str, rename: bool) -> str:
            nonlocal changed
            found = existing(saved, title)
            if found is None:
                async with self.write_lock:
                    found = await self.api.async_create_list(title)
                lists.append(found)
                by_id[found.id] = found
            elif rename and found.title != title:
                async with self.write_lock:
                    await self.api.async_rename_list(found.id, title)
            if found.id != saved:
                changed = True
            return found.id

        seed_list = await find(ids.get("seeds"), SEED_LIST_TITLE, False)
        old_lists: dict[Repeats, str] = {}
        for repeats in REPEATS:
            if (old := existing(saved_old.get(repeats), OLD_TEMPLATE_LIST_TITLES[repeats])) is not None:
                old_lists[repeats] = old.id
        if set(old_lists.items()) != set(saved_old.items()):
            changed = True
        kid_lists: dict[str, str] = {}
        for kid, name in self.kids.items():
            kid_lists[kid] = await find(saved_kids.get(kid), KID_LIST_TITLE.format(name=name), True)
        if changed or set(saved_kids) != set(kid_lists):
            self._ids = {"seeds": seed_list, "templates": dict(old_lists), "kids": kid_lists}
            await self._store.async_save(self._ids)
        return seed_list, old_lists, kid_lists

    async def _async_templates(self, seed_list: str, old_lists: Mapping[Repeats, str], today: date) -> list[Template]:
        kids = self.kids
        tasks = await self.api.async_tasks(seed_list)
        if old_lists:
            tasks = [*tasks, *await self._async_move_old(seed_list, old_lists, tasks)]
        templates: list[Template] = []
        seen: set[str] = set()
        for task in tasks:
            template = parse_template(
                task.id,
                None,
                task.title,
                task.notes,
                completed=task.completed is not None,
                kids=kids,
                position=task.position,
            )
            template = await self._async_tidy(seed_list, task, template, seen, today)
            seen.add(template.id)
            templates.append(template)
        return templates

    async def _async_move_old(
        self, seed_list: str, old_lists: Mapping[Repeats, str], seeds: list[TaskRecord]
    ) -> list[TaskRecord]:
        """Move the templates on the old Daily, Weekly, Monthly and School days lists onto the
        seed list, as they are plus a Repeats line (and an Id, so their chores stay linked),
        then remove each old list once it's empty."""
        kids = self.kids
        have = {parse_template(t.id, None, t.title, t.notes, completed=False, kids=kids).id for t in seeds}
        moved: list[TaskRecord] = []
        async with self.write_lock:
            for repeats, list_id in old_lists.items():
                for task in await self.api.async_tasks(list_id):
                    old = parse_template(
                        task.id, repeats, task.title, task.notes, completed=task.completed is not None, kids=kids
                    )
                    if old.id not in have:
                        # Moved and checked off as it was, so a paused one stays paused.
                        add = [("Id", old.id), ("Repeats", repeats_label(old.repeats, old.every))]
                        notes = edit_block(task.notes, add, drop=("id", "repeats", "every"))
                        made = await self.api.async_insert(seed_list, task.title, notes)
                        if task.completed is not None:
                            made = await self.api.async_update(seed_list, made.id, done=True) or made
                        moved.append(made)
                        have.add(old.id)
                    await self.api.async_delete(list_id, task.id)
                if not await self.api.async_tasks(list_id):
                    await self.api.async_delete_list(list_id)
                    _LOGGER.info("Moved the chores on %s to %s", OLD_TEMPLATE_LIST_TITLES[repeats], SEED_LIST_TITLE)
        return moved

    async def _async_tidy(
        self, list_id: str, task: TaskRecord, template: Template, seen: set[str], today: date
    ) -> Template:
        """Give a template typed in by hand its Id, Repeats and Starts lines, and a copied one
        its own Id, so its chores stay linked to it and Every and turns count from a fixed day."""
        block = read_block(task.notes)
        copied = template.id in seen
        written = block.first("id") and block.first("starts") and block.first("repeats")
        if template.problems or (written and not block.first("every") and not copied):
            return template
        fixed = replace(
            template,
            id=task.id if copied or not block.first("id") else template.id,
            starts=template.starts or today,
        )
        async with self.write_lock:
            await self.api.async_update(list_id, task.id, notes=template_notes(fixed, self.kids))
        return fixed

    async def _async_chores(self, kid_lists: Mapping[str, str], now: datetime) -> list[Chore]:
        since = (now - timedelta(days=DONE_HISTORY_DAYS)).astimezone(dt_util.UTC)
        kids = list(kid_lists)
        reads = await asyncio.gather(
            *(
                call
                for kid in kids
                for call in (
                    self.api.async_tasks(kid_lists[kid], completed=False),
                    self.api.async_tasks(kid_lists[kid], completed=True, completed_min=since),
                )
            )
        )
        chores: list[Chore] = []
        for i, kid in enumerate(kids):
            tasks = {t.id: t for t in (*reads[2 * i], *reads[2 * i + 1])}
            for t in tasks.values():
                item = TaskItem(t.id, t.title, t.notes, t.due, t.completed, t.position)
                chores.append(read_chore(item, kid, kid_lists[kid]))
        return chores

    def async_saved_task(self, chore: Chore, task: TaskRecord | None) -> None:
        """Show a chore as Google saved it, on every board straight away, without waiting for
        the next read."""
        if self.data is None or task is None:
            return
        item = TaskItem(task.id, task.title, task.notes, task.due, task.completed, task.position or chore.task.position)
        saved = read_chore(item, chore.kid, chore.list_id)
        self._saves += 1
        chores = [saved if c.task.id == chore.task.id else c for c in self.data.chores]
        self.async_set_updated_data(replace(self.data, chores=chores, updated=dt_util.utcnow()))

    def async_saved_template(self, template: Template | None, *, removed: str | None = None) -> None:
        """Show a template as saved (or gone, by its id in ``removed``) straight away. Its chores
        follow on the read that comes next."""
        if self.data is None:
            return
        self._saves += 1
        gone = {removed, template.id if template else None} - {None}
        templates = [t for t in self.data.templates if t.id not in gone]
        if template is not None:
            old = next((i for i, t in enumerate(self.data.templates) if t.id == template.id), None)
            templates.insert(len(templates) if old is None else old, template)
        self.async_set_updated_data(replace(self.data, templates=templates, updated=dt_util.utcnow()))

    def find_chore(self, task_id: str) -> Chore | None:
        return next((c for c in (self.data.chores if self.data else []) if c.task.id == task_id), None)

    def find_template(self, template_id: str) -> Template | None:
        found = self.data.templates if self.data else []
        return next((t for t in found if template_id in (t.id, t.task_id)), None)

    def payload(self) -> dict[str, Any] | None:
        """The chores for the board and ``get_chores``."""
        data = self.data
        if data is None:
            return None
        tz = dt_util.get_time_zone(data.time_zone) or dt_util.get_default_time_zone()
        error = None if self.last_update_success or self.last_exception is None else str(self.last_exception)
        return {
            "updated": data.updated.isoformat(),
            "today": data.today.isoformat(),
            "time_zone": data.time_zone,
            "days_ahead": self.settings.chore_days_ahead,
            "kids": [{"id": kid, "name": name} for kid, name in self.kids.items()],
            "people": [
                *({"id": kid, "name": name, "role": "kid"} for kid, name in self.kids.items()),
                *({"id": pid, "name": name, "role": "parent"} for pid, name in self.parents.items()),
            ],
            "chores": board_items(
                data.chores,
                data.templates,
                list(self.kids),
                data.today,
                self.settings.chore_days_ahead,
                tz,
                self.people,
                self.school(),
            ),
            "templates": [template_item(t) for t in data.templates],
            "status": {"ok": self.last_update_success and data.needs is None, "error": error, "needs": data.needs},
        }
