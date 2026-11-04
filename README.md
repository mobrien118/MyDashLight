# MyDashLight

A kitchen touchscreen family hub, like Skylight but built around how our family actually runs:
rides, chores, lunches and the calendar, shown so you only see what needs attention now.

Home Assistant runs the backend. Google Calendar is where the family's data lives, so there is no
separate database or server to look after.

## What's here

`custom_components/mydashlight` is a custom Home Assistant integration. It signs in to Google,
reads each kid's calendar and each parent's own calendars every minute, and plans the week's
rides, with drive times from Google Routes. The `mydashlight.get_plan` action returns the plan,
the other actions change who drives (saving it in the events' notes), and the kitchen app
subscribes to the plan over Home Assistant's WebSocket API. Before each drive, the driver and the
kids in the car get a reminder on their phones, and the drive's first drop-off gets a reminder in
Google Calendar.

`frontend` is the kitchen app, which the integration serves from Home Assistant. See
[The rides board](#the-rides-board).

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
| `websocket.py` | The app's live plan, `mydashlight/rides/subscribe`. |
| `reminders.py` | Works out the reminders from the plan: when each drive's reminder goes off, the Google Calendar reminder for each drop-off, and the rides with no driver. |
| `alerts.py` | Sends the reminders through each person's notifier, and saves the Google Calendar reminders. |
| `frontend.py` | Serves the kitchen app: the Rides sidebar item and the kitchen page. |

`planner.py`, `board.py`, `notes.py`, `google.py`, `changes.py`, `week.py`, `payload.py`,
`routes.py`, `travel.py`, `reminders.py` and `settings.py` don't import Home Assistant, so they can be tested and reused on
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
| Arrive by | A time, such as 5:15 PM, or 15 min early | Arrive early by a margin that grows with the drive from home: 5 minutes for a 5-minute drive, 10 for 30, 15 for an hour, never more than 20 (set under Planner timing) |
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
| `mydashlight.set_arrive_by` | When the kid needs to be there. No time goes back to the usual margin before the start |
| `mydashlight.set_take_along` | Which kids ride along on this drop-off (`kids`, by name), so the driver can go on to their own drop-offs without coming home for them. No kids takes nobody along |
| `mydashlight.apply_suggestion` | Makes the change a suggested fix in the plan describes, by its `id` |

The event actions take the event's `id` from `get_plan`. For a repeating event, `scope: this`
changes just that one (Google keeps it as a changed occurrence) and `scope: series` changes every
one. Occurrences someone already changed by themselves keep their own notes in Google, so the ones
in the next 7 days get the change too.

Each change reads the event fresh and saves it only if nobody changed it in the meantime. If
someone did, say on a phone at the same moment, the change is applied again on top of their edit.
Nobody gets an update email.

## The rides board

The kitchen app's first screen is everyone's week of rides: a column for each kid, then one for
each parent. A kid's column holds their activities and their time in a car; a parent's column
holds their trips out of the house, with dots for who's in the car, and the busy times from their
own calendar. A tinted band links a kid's car time to whoever is driving. Two views, switched at
the top:

- **Timeline** spaces everything by the clock, so overlaps and tight handoffs are easy to see.
- **Compact** drops the time scale: everything sits in start order, with each trip's stops listed.

The **Needs attention** list shows problems across the week (no driver, late, a kid waiting, a
parent still at work, a kid double-booked) with the suggested fixes, plus heads-ups for today
and tomorrow. Tap any activity, car or trip to change who drives each way, whether the driver
stays, who's taken along, and the arrive-by time. A repeating activity asks whether to change just
that day or every time. Each change is saved in the event's notes on Google straight away.

There are two ways to open it, both signed in with your Home Assistant login:

- **Rides** in Home Assistant's sidebar. This works in the Home Assistant app on a phone too.
- `<your Home Assistant URL>/mydashlight-kitchen`, a full-screen page for the kitchen screen. It
  uses the sign-in Home Assistant already keeps in that browser, or asks once. After three minutes
  without a touch it closes anything open and scrolls back to now.

Either address can pick the view it opens in, so each screen can have its own:

| Add to the address | Opens in |
| --- | --- |
| `?view=timeline` (or `?view=full`) | Timeline |
| `?view=compact` | Compact |

For example, `<your Home Assistant URL>/mydashlight-kitchen?view=compact`. You can still switch
views by tapping; the kitchen screen goes back to its view after three minutes without a touch.
Without a `view`, the board opens in whichever view was last picked in that browser.

The app is built from `frontend/` into `custom_components/mydashlight/frontend`, so a HACS update
brings it along.

## Live plan for the app

The kitchen app sends `{"type": "mydashlight/rides/subscribe"}` over Home Assistant's WebSocket
API. It gets the week's plan straight away as an event, `{"plan": ...}`, and again whenever the
plan changes, including right after one of the actions above. The plan is what `get_plan` returns
for all seven days, plus:

- `people`: the two drivers (`mom` and `dad`, with their names), the kids in order (each kid's
  `id` is their calendar's id, as in each event's `kid`), and the carpool names, for the app's
  pickers.
- `status`: `ok` is false, with the `error`, when the last read of the calendars failed. The plan
  is then the last one that worked.

`{"plan": null}` means MyDashLight isn't running at the moment, for example while Home Assistant
restarts. A plan follows when it's back.

## Reminders

Under **Settings > Devices & services > MyDashLight > Configure > Reminders**, pick a notifier for
each parent and each kid who should get reminders. A notifier is a `notify` action, such as the one
the Home Assistant app adds for each phone. Anyone left on **No reminders** gets none.

- **Before each drive.** Leave time is worked back from when the kid has to be there (Arrive by,
  or the usual margin before the start) and the drive time. The reminder goes off 15 minutes before
  that, or whatever **Remind before leaving** says. The driver's says where to go, stop by stop.
  Each kid in the car with a notifier gets one saying when they leave, or when they'll be picked up
  and where. If the plan changes so a drive leaves at least 5 minutes earlier than it was
  reminded for, it's reminded again. A reminder that came due while Home Assistant was off is still
  sent if the drive hasn't left yet.
- **In Google Calendar.** The same reminder is saved on the kid's event for each drive's first
  drop-off, as a pop-up that many minutes before the event starts. It moves when leave time does,
  and comes off if the drive goes away. MyDashLight marks the reminders it sets, so it never
  touches a reminder someone else set on an event that no longer needs one. Two limits, both
  Google's: a reminder belongs to the account MyDashLight signs in with, so it pops up for that
  person only; and Google only reminds before an event starts, so pick-ups get the phone
  reminder only. Turn off **Also save drop-off reminders in Google Calendar** to skip this.
- **Rides with no driver.** A drop-off or pick-up in the next six hours with nobody driving yet is
  sent once to both parents' notifiers, several at a time when there are several.

What has been sent is kept in Home Assistant, so a restart doesn't send it again.

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
