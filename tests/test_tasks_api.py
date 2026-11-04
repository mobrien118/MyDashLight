"""The Google Tasks client: reading tasks and telling errors apart."""

from __future__ import annotations

from datetime import UTC, date, datetime

import pytest

from custom_components.mydashlight.google import GoogleApiDisabled, GoogleAuthError, GoogleError
from custom_components.mydashlight.tasks_api import TasksNeedSignIn, TasksNotFound, _error_for, parse_task

from .common import google_error


def test_parse_task() -> None:
    task = parse_task(
        {
            "id": "t1",
            "title": "  Feed\n the cat ",
            "notes": "Two scoops",
            "status": "completed",
            "due": "2026-11-04T00:00:00.000Z",
            "completed": "2026-11-04T15:30:00.000Z",
            "position": "00000001",
        }
    )
    assert task is not None
    assert (task.title, task.notes, task.due, task.position) == (
        "Feed the cat",
        "Two scoops",
        date(2026, 11, 4),
        "00000001",
    )
    assert task.completed == datetime(2026, 11, 4, 15, 30, tzinfo=UTC)
    open_task = parse_task({"id": "t2", "status": "needsAction"})
    assert open_task is not None
    assert (open_task.due, open_task.completed) == (None, None)
    assert parse_task({"id": "t3", "deleted": True}) is None
    assert parse_task({"title": "no id"}) is None


@pytest.mark.parametrize(
    ("status", "reason", "error"),
    [
        (401, "authError", GoogleAuthError),
        (403, "insufficientPermissions", TasksNeedSignIn),
        (403, "ACCESS_TOKEN_SCOPE_INSUFFICIENT", TasksNeedSignIn),
        (403, "accessNotConfigured", GoogleApiDisabled),
        (429, "rateLimitExceeded", GoogleError),
        (404, "notFound", TasksNotFound),
        (500, "backendError", GoogleError),
    ],
)
def test_errors(status: int, reason: str, error: type[GoogleError]) -> None:
    code, body = google_error(status, reason)
    assert type(_error_for(code, body, "/lists/x/tasks")) is error
