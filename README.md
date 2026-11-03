# MyDashLight

A kitchen touchscreen family hub, like Skylight but built around how our family actually runs:
rides, chores, lunches and the calendar, shown so you only see what needs attention now.

Home Assistant runs the backend. Google Calendar is where the family's data lives, so there is no
separate database or server to look after.

## What's here

`custom_components/mydashlight` is a custom Home Assistant integration. It signs in to Google,
reads each kid's calendar and each parent's own calendars every minute, and plans the week's
rides, with drive times from Google Routes. The `mydashlight.get_plan` action returns the plan,
and the other actions change who drives, saving it in the events' notes. The kitchen app and
reminders come next.

| Module | Job |
| --- | --- |
| `planner.py` | Works out each parent's driving for a day: the route, leave-by times, problems (late, kid waiting, clashes with a parent's calendar, no driver) and the best fixes for each. |
| `board.py` | Everything the ride board shows for a day: who is in which car, double-bookings, each driver's outings as a list of stops, and the ride line on each activity card. |
| `notes.py` | Reads and writes ride details in a Google Calendar event's notes. |
| `google.py` | A small Google Calendar client: the calendar list, the events in a time span, and saving one event's notes. |
| `changes.py` | Saves a ride change into an event's notes without overwriting someone else's edit. |
| `week.py` | Sorts a week of calendar events into each day's activities and busy times. |
| `payload.py` | Plans each day and writes the result as plain data for the app. |
| `routes.py` | A small Google Routes client, and the cache of drive times by trip and hour of the week. |
| `travel.py` | Each day's drive times for the planner, and which trips still need looking up. |
| `lookups.py` | Looks up those trips within the daily limit and saves what it learns. |
| `settings.py` | Turns the integration's options into planner, notes and calendar settings. |
| `config_flow.py` | Google sign-in and the setup and options screens. |
| `coordinator.py` | Reads the calendars every minute and replans. |
| `services.py` | The `mydashlight` actions: get the plan, and change rides. |

`planner.py`, `board.py`, `notes.py`, `google.py`, `changes.py`, `week.py`, `payload.py`,
`routes.py`, `travel.py` and `settings.py` don't import Home Assistant, so they can be tested and reused on
their own.

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

## Drive times

With a Google Routes API key (the integration's **Configure** button, then **Drive times**),
each trip's drive time is looked up with the usual traffic for the hour it's driven on that
weekday, starting from your home location in Home Assistant. A trip to an activity counts as
leaving half an hour before it starts, and a trip home as leaving when it ends.

- Only the trips the plan actually uses are looked up, today's first.
- Each drive time is kept for 30 days, so a weekly activity costs about one lookup a month.
- Lookups stop for the day at the daily limit (150 by default, which stays under 5,000 a month).
  Trips over the limit are estimated and looked up the next day.
- A Travel line in an event's notes always wins for trips to that event.
- Without a key, or for an event with no location, every drive counts as the "Drive time with
  no address" setting (15 minutes).

`get_plan` says where the drive times came from under `drive_times`.

## Ride details in event notes

Each kid's activity is an event on their own Google calendar. Ride details go in a block at the
end of the event's notes, after a `--- Rides ---` line:

```
Bring shin guards. Field 3.

--- Rides ---
Drop-off: Sam
Pick-up: the Parkers
Stay: yes
Take along: Ben
Arrive by: 5:15 PM
Travel: 25 min
```

| Line | Values | Without the line |
| --- | --- | --- |
| Drop-off, Pick-up | A parent's name or another name they go by, Not needed, or anyone else's name (a carpool driver) | Nobody is driving yet, which shows as a problem |
| Stay | yes | The driver drops off and comes back. Stay only applies when one parent drives both ways |
| Take along | Kids' names, such as Ben, Cleo | Nobody else rides along. Kids named here leave home in the same car on this drop-off, so the driver can go on to their own drop-offs without coming home for them |
| Arrive by | A time, such as 5:15 PM, or 15 min early | Arrive 5 minutes before the start |
| Travel | Minutes, such as 25 min | Use the computed drive time |

Labels ignore case, spaces and hyphens, so `Drop off`, `Dropoff` and `Pickup` all work. Only lines
inside the block count, so a note like "Pick-up: bring cleats" higher up is never read as a driver.
If the notes have no block yet, ride lines anywhere count, so a quick line typed on a phone works,
and the app moves them into a block the next time it changes the ride. The app only ever changes
the block. Everything else in the notes stays as it was, in plain text or in the HTML Google uses
once someone edits notes on the web.

## Changing rides

These actions change a ride and replan straight away. Ride details are saved in the event's
notes on Google, so they show the same in the app, on phones and in Google Calendar.

| Action | What it changes |
| --- | --- |
| `mydashlight.set_ride` | Who drops off, picks up, or both: `mom` or `dad` (the first or second parent, or their name), `none` when no ride is needed, a carpool driver's name, or empty for nobody yet |
| `mydashlight.set_stay` | Whether the driver stays for the event |
| `mydashlight.set_arrive_by` | When the kid needs to be there. No time goes back to a few minutes before the start |
| `mydashlight.set_take_along` | Which kids ride along on this drop-off (`kids`, by name), so the driver can go on to their own drop-offs without coming home for them. No kids takes nobody along |
| `mydashlight.apply_suggestion` | Makes the change a suggested fix in the plan describes, by its `id` |

The event actions take the event's `id` from `get_plan`. For a repeating event, `scope: this`
changes just that one (Google keeps it as a changed occurrence) and `scope: series` changes every
one. Occurrences someone already changed by themselves keep their own notes in Google, so the ones
in the next 7 days get the change too.

Each change reads the event fresh and saves it only if nobody changed it in the meantime. If
someone did, say on a phone at the same moment, the change is applied again on top of their edit.
Nobody gets an update email.

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

For drive times, turn on the **Routes API** in the same project, create an API key limited to
the Routes API, and add it under **Configure** > **Drive times**.

MyDashLight asks Google for two permissions: to see your list of calendars, and to see and edit
events. It only reads events for now; editing is for writing who drives into an event's notes.

## License

MIT. See [LICENSE](LICENSE).
