# MyDashLight

A kitchen touchscreen family hub, like Skylight but built around how our family actually runs:
rides, chores, lunches and the calendar, shown so you only see what needs attention now.

Home Assistant runs the backend. Google Calendar is where the family's data lives, so there is no
separate database or server to look after.

## What's here

`custom_components/mydashlight` is a custom Home Assistant integration. It signs in to Google,
reads each kid's calendar and each parent's own calendars every minute, and plans the week's
rides. The `mydashlight.get_plan` action returns the plan. Travel times from Google Routes,
writing who drives back to the events, the kitchen app, and reminders come next. Until travel
times are in, every drive counts as the "Drive time with no address" setting (15 minutes) unless
an event's notes give a Travel time.

| Module | Job |
| --- | --- |
| `planner.py` | Works out each parent's driving for a day: the route, leave-by times, problems (late, kid waiting, clashes with a parent's calendar, no driver) and the best fixes for each. |
| `board.py` | Everything the ride board shows for a day: who is in which car, double-bookings, each driver's outings as a list of stops, and the ride line on each activity card. |
| `notes.py` | Reads and writes ride details in a Google Calendar event's notes. |
| `google.py` | A small Google Calendar client: the calendar list and the events in a time span. |
| `week.py` | Sorts a week of calendar events into each day's activities and busy times. |
| `payload.py` | Plans each day and writes the result as plain data for the app. |
| `settings.py` | Turns the integration's options into planner, notes and calendar settings. |
| `config_flow.py` | Google sign-in and the setup and options screens. |
| `coordinator.py` | Reads the calendars every minute and replans. |
| `services.py` | The `mydashlight.get_plan` action. |

`planner.py`, `board.py`, `notes.py`, `google.py`, `week.py`, `payload.py` and `settings.py` don't
import Home Assistant, so they can be tested and reused on their own.

## Calendars

Setup asks which of your Google calendars to use:

- **Kids' calendars**: one per kid, holding the activities that need rides. Setup suggests each
  kid's name from the calendar's name, so a calendar called `Kid-Ava` suggests Ava.
- **Each parent's busy calendars** (optional): their events mean that parent can't drive then.
  Events marked Free and events they declined don't count. All-day events count only when marked
  Busy, which Google doesn't do by default.

Calendars you don't pick are never read. An event that ends by 6 AM the next day stays on the day
it starts. A longer one, such as a weekend trip, is planned as a drop-off on its first day and a
pick-up on its last. Change the calendars later under the integration's **Configure** button.

To see the plan, run the **MyDashLight: Get ride plan** action in Developer tools > Actions.

## Ride details in event notes

Each kid's activity is an event on their own Google calendar. Ride details go in a block at the
end of the event's notes, after a `--- Rides ---` line:

```
Bring shin guards. Field 3.

--- Rides ---
Drop-off: Sam
Pick-up: the Parkers
Stay: yes
Arrive by: 5:15 PM
Travel: 25 min
```

| Line | Values | Without the line |
| --- | --- | --- |
| Drop-off, Pick-up | A parent's name or another name they go by, Not needed, or anyone else's name (a carpool driver) | Nobody is driving yet, which shows as a problem |
| Stay | yes | The driver drops off and comes back. Stay only applies when one parent drives both ways |
| Arrive by | A time, such as 5:15 PM, or 15 min early | Arrive 5 minutes before the start |
| Travel | Minutes, such as 25 min | Use the computed drive time |

Labels ignore case, spaces and hyphens, so `Drop off`, `Dropoff` and `Pickup` all work. Only lines
inside the block count, so a note like "Pick-up: bring cleats" higher up is never read as a driver.
If the notes have no block yet, ride lines anywhere count, so a quick line typed on a phone works,
and the app moves them into a block the next time it changes the ride. The app only ever changes
the block. Everything else in the notes stays as it was, in plain text or in the HTML Google uses
once someone edits notes on the web.

## Development

Needs Python 3.13 or 3.14 (Home Assistant OS runs 3.14) and, for the reference checks, Node 22.

```sh
python3.13 -m venv .venv && . .venv/bin/activate
pip install -r requirements_dev.txt
pytest
ruff check . && ruff format --check . && mypy
```

The planner is a port of the one in the ride board mockup. `tests/rides_reference` holds that
original, golden results for ten days, and a script that runs it; see the README there.

## Installing in Home Assistant

With [HACS](https://hacs.xyz): open HACS, choose **Custom repositories** from the menu, add
`https://github.com/mobrien118/MyDashLight` as an **Integration**, then download **MyDashLight**.

By hand: copy `custom_components/mydashlight` into the `custom_components` folder of your Home
Assistant config.

Then restart Home Assistant and add **MyDashLight** under Settings > Devices & services.

### Google sign-in

MyDashLight signs in with your own Google Cloud OAuth client, so your calendars only ever go
between Google and your Home Assistant.

1. In the [Google Cloud console](https://console.cloud.google.com/), make a project and turn on
   the **Google Calendar API**.
2. Set up the [sign-in screen](https://console.cloud.google.com/auth/overview) as an **External**
   app and publish it, so the sign-in doesn't expire after 7 days.
3. [Create an OAuth client](https://console.cloud.google.com/auth/clients) of type **Web
   application**. Under **Authorized redirect URIs** add
   `https://my.home-assistant.io/redirect/oauth`, which Home Assistant uses whenever the My Home
   Assistant integration is loaded (it is part of `default_config`), and
   `<your Home Assistant URL>/auth/external/callback`, which it uses otherwise.
4. Add **MyDashLight**. Home Assistant asks for the client ID and secret the first time, then
   sends you to Google to sign in.

MyDashLight asks Google for two permissions: to see your list of calendars, and to see and edit
events. It only reads events for now; editing is for writing who drives into an event's notes.

## License

MIT. See [LICENSE](LICENSE).
