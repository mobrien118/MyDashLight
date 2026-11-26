# Development

## How it fits together

MyDashLight is two parts in one repository:

- `custom_components/mydashlight`, a custom Home Assistant integration (Python). It signs in to
  Google, reads the family calendar, the lunch calendar and the chore lists every minute, plans the
  week's rides with drive times from Google Routes, and sends the reminders. Everything it knows
  about the family lives in Google Calendar and Google Tasks; Home Assistant keeps only the settings
  and a cache of drive times.
- `frontend`, the kitchen app (TypeScript with [Lit](https://lit.dev)). The integration serves it from
  Home Assistant and it talks to the integration over Home Assistant's WebSocket API.

| Module | Job |
| --- | --- |
| `who.py` | Who an event on the family calendar is for, read from the start of its title. |
| `shared.py` | Sorts the family calendar into each person's events. |
| `week.py` | Sorts a week of events into each day's activities and busy times. |
| `planner.py` | Works out each parent's driving for a day: the route, leave-by times, problems (late, kid waiting, clashes with a parent's calendar, no driver) and the best fixes for each. |
| `board.py` | Everything the ride board shows for a day: who is in which car, double-bookings, each driver's outings as a list of stops, and the ride line on each activity card. |
| `payload.py` | Plans each day and writes the result as plain data for the app. |
| `notes.py` | Reads and writes ride details in a Google Calendar event's notes. |
| `changes.py` | Saves a ride change into an event's notes without overwriting someone else's edit. |
| `google.py` | A small Google Calendar client: the calendar list, the events in a time span, saving one event's notes, and the lunch events. |
| `routes.py` | A small Google Routes client, and the cache of drive times by trip and hour of the week. |
| `travel.py` | Each day's drive times for the planner, and which trips still need looking up. |
| `lookups.py` | Looks up those trips within the daily limit and saves what it learns. |
| `settings.py` | Turns the integration's options into planner, notes and calendar settings. |
| `coordinator.py` | Reads the family calendar every minute and replans. |
| `services.py` | The ride actions: get the plan, change rides, and say who an event is for. |
| `websocket.py` | The app's live plan, chores and lunches. |
| `reminders.py` | Works out the reminders from the plan: when each drive's reminder goes off, the Google Calendar reminder for each drop-off, and the rides with no driver. |
| `location.py` | Checks a driver is on their way: straight-line distances from their phone's location, and what to tell them. |
| `alerts.py` | Sends the reminders through each person's notifier, checks the driver's location, and saves the Google Calendar reminders. |
| `chore_rules.py` | Reads and writes chore templates and chores in Google Tasks notes, and works out the days each template makes a chore for. |
| `chores.py` | The chore engine: what to make, fix, remove, mark missed or close out on the kids' lists, and what the board shows. |
| `chore_points.py` | What a check-off earns, and each person's score for the last 7 days. |
| `tasks_api.py` | A small Google Tasks client: task lists and the tasks on them. |
| `chore_coordinator.py` | Reads the templates and the kids' lists every minute and keeps the lists filled. |
| `chore_services.py` | The chore actions: get the chores, check one off, and save or remove a template. |
| `school.py` | School days and lunches, read from the No School events and the lunch calendar. |
| `menu_feed.py` | A school's lunch menu read from its calendar feed (iCal), copied onto the lunch calendar. |
| `lunch_coordinator.py` | Reads the lunches and days off, and saves picks and menus on the lunch calendar. |
| `lunch_services.py` | The lunch actions: get the lunches, and save picks and menus. |
| `frontend.py` | Serves the kitchen app: the Rides sidebar item and the kitchen page. |
| `pairing.py` | Pairs a kitchen screen: the code it shows, an admin's approval, and the sign-in it collects. |
| `config_flow.py` | Google sign-in and the setup and options screens. |
| `api.py`, `application_credentials.py` | Google sign-in through Home Assistant, with your own OAuth client. |
| `diagnostics.py` | What MyDashLight read and planned, for **Download diagnostics**, without the sign-in or anyone's names. |

The modules that do the thinking (`who.py`, `shared.py`, `week.py`, `planner.py`, `board.py`,
`payload.py`, `notes.py`, `changes.py`, `google.py`, `routes.py`, `travel.py`, `settings.py`,
`reminders.py`, `location.py`, `chore_rules.py`, `chores.py`, `chore_points.py`, `tasks_api.py`,
`school.py` and `menu_feed.py`) don't import Home Assistant, so they can be tested and reused on
their own.

## Actions

Every action is under **Developer tools > Actions** in Home Assistant, as **MyDashLight: ...**. To see
the week's plan, run **MyDashLight: Get ride plan**.

### Rides

These actions change a ride and replan straight away. Ride details are saved in the event's
notes on Google, so they show the same in the app, on phones and in Google Calendar.

| Action | What it changes |
| --- | --- |
| `mydashlight.set_ride` | Who drops off, picks up, or both: `mom` or `dad` (the first or second parent, or their name), `none` when no ride is needed, a carpool driver's name, or empty for nobody yet. A parent always drives to their own event, so this and `set_stay` turn it down |
| `mydashlight.set_stay` | Whether the driver stays for the event |
| `mydashlight.set_attending` | Whether the kid is going (`attending`). Going again also takes an old `NO` off the start of the title |
| `mydashlight.set_arrive_by` | When the kid gets there, before the start or after it. It's written as minutes early or late (`Arrive: 15 min early`). The traffic margin still comes off it. No time means they get there at the start |
| `mydashlight.set_leave_by` | When the kid is picked up, before the end or after it, written as minutes early or late (`Leave: 10 min late`). The pick-up is then at that time. No time means they leave at the end |
| `mydashlight.set_take_along` | Who rides along (`kids`, by name: other kids or the other parent) on the `side` you pick, `drop`, `pick` or `both`. When the driver stays, riders go both ways. On a parent's own event, they go there and back. Empty takes nobody along |
| `mydashlight.set_takes` | How long a parent's errand takes (`minutes`). The errand then fits in any time between the event's start and end. No minutes makes it a set-time event again. Kids' events turn it down |
| `mydashlight.set_people` | Who an event is for (`people`, by name), saved as a `For:` line in its notes so the title can stay as it is. Empty goes back to the names in the title |
| `mydashlight.apply_suggestion` | Makes the change a suggested fix in the plan describes, by its `id` |

The event actions take the event's `id` from `get_plan`. For a repeating event, `scope: this`
changes just that one (Google keeps it as a changed occurrence) and `scope: series` changes every
one. Occurrences someone already changed by themselves keep their own notes in Google, so the ones
in the next 7 days get the change too, except on a line set by hand for that one occurrence: a
one-off driver, say, stays. Times and dates are never changed, so a moved occurrence keeps its
time.

Each change reads the event fresh and saves it only if nobody changed it in the meantime. If
someone did, say on a phone at the same moment, the change is applied again on top of their edit.
Nobody gets an update email.

### Chores and lunch

The chore actions are in [Chores](chores.md) (`get_chores`, `set_chore_done`,
`save_chore_template`, `remove_chore_template`), and the lunch ones in [Lunch](lunch.md)
(`get_lunches`, `set_lunch`, `set_lunch_menu`).

## Live data for the app

The kitchen app sends `{"type": "mydashlight/rides/subscribe"}` over Home Assistant's WebSocket
API. It gets the week's plan straight away as an event, `{"plan": ...}`, and again whenever the
plan changes, including right after one of the actions above. The plan is what `get_plan` returns
for all seven days, plus:

- `people`: the two drivers (`mom` and `dad`, with their names), the kids in order (each kid's
  `id` is the one each event's `kid` uses), and the carpool names, for the app's
  pickers.
- `status`: `ok` is false, with the `error`, when the last read of the calendars failed. The plan
  is then the last one that worked.

`{"plan": null}` means MyDashLight isn't running at the moment, for example while Home Assistant
restarts. A plan follows when it's back.

Chores and lunches work the same way, with `mydashlight/chores/subscribe` and
`mydashlight/lunch/subscribe`.

## Building and testing

Needs Python 3.13 or 3.14 (Home Assistant OS runs 3.14) and, for the reference checks, Node 22.

```sh
python3.13 -m venv .venv && . .venv/bin/activate
pip install -r requirements_dev.txt
pytest
ruff check . && ruff format --check . && mypy
```

The planner is a port of the one in the ride board mockup. `tests/rides_reference` holds that
original, golden results for ten days, and a script that runs it; see the README there.

The kitchen app is TypeScript with [Lit](https://lit.dev), in `frontend/`. The built files in
`custom_components/mydashlight/frontend` are committed, and CI checks they match the source, so
run the build after any change:

```sh
cd frontend
npm ci
npm run check && npm test
npm run build
```

Its tests and the offline preview use a sample week that the real planner draws
(`frontend/scripts/sample_plan.py`, run with the Python environment above). Regenerate it with
`npm run sample` after a planner change. `node build.mjs --preview` writes `preview.html`, the
board on that sample week, which opens in any browser and saves nothing.

## Screenshots

The pictures in these docs come from the offline preview's sample family (Robin and Sam, and their
kids Ava, Ben and Cleo), with the clock fixed on a Monday afternoon. After a change to how the app
looks, render them again:

```sh
cd frontend
npm install --no-save playwright && npx playwright install chromium
npm run screenshots
```

They're written to `docs/images`.
