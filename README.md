<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mobrien118/MyDashLight/main/custom_components/mydashlight/brand/dark_logo@2x.png" />
    <img src="https://raw.githubusercontent.com/mobrien118/MyDashLight/main/custom_components/mydashlight/brand/logo@2x.png" alt="MyDashLight" height="64" />
  </picture>
</h1>

A kitchen touchscreen family hub, like Skylight but built around how our family actually runs:
rides, chores, lunches and the calendar, shown so you only see what needs attention now.

Home Assistant runs the backend. Google Calendar is where the family's data lives, so there is no
separate database or server to look after.

## What's here

`custom_components/mydashlight` is a custom Home Assistant integration. It signs in to Google,
reads the family's shared Google calendar every minute, sorts each event to the people its title
names, and plans the week's
rides, with drive times from Google Routes. The `mydashlight.get_plan` action returns the plan,
the other actions change who drives (saving it in the events' notes), and the kitchen app
subscribes to the plan over Home Assistant's WebSocket API. Before each drive, the driver and the
kids in the car get a reminder on their phones, and the drive's first drop-off gets a reminder in
Google Calendar. Chores live in Google Tasks: MyDashLight keeps each kid's chore list filled from
the chore templates. See [Chores](#chores).

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
| `location.py` | Checks a driver is on their way: straight-line distances from their phone's location, and what to tell them. |
| `alerts.py` | Sends the reminders through each person's notifier, checks the driver's location, and saves the Google Calendar reminders. |
| `frontend.py` | Serves the kitchen app: the Rides sidebar item and the kitchen page. |
| `pairing.py` | Pairs a kitchen screen: the code it shows, an admin's approval, and the sign-in it collects. |
| `chore_rules.py` | Reads and writes chore templates and chores in Google Tasks notes, and works out the days each template makes a chore for. |
| `chores.py` | The chore engine: what to make, fix, remove, mark missed or close out on the kids' lists, and what the board shows. |
| `tasks_api.py` | A small Google Tasks client: task lists and the tasks on them. |
| `chore_coordinator.py` | Reads the templates and the kids' lists every minute and keeps the lists filled. |
| `chore_services.py` | The chore actions: get the chores, check one off, and save or remove a template. |

`planner.py`, `board.py`, `notes.py`, `google.py`, `changes.py`, `week.py`, `payload.py`,
`routes.py`, `travel.py`, `reminders.py`, `location.py`, `settings.py`, `chore_rules.py`, `chores.py` and
`tasks_api.py` don't import Home Assistant, so they can be tested and reused on
their own.

## Calendars

Everything lives in one shared family calendar. Setup asks which of your Google calendars it is,
and for the kids' names. Each event's title starts with who it's for:

- **One name**: "Ava Piano" is Ava's, shown in her column as "Piano". Parents count too: "Robin
  Dentist" is Robin's own event.
- **Several names**, joined by `&`, `,` or `+`: "Ben & Cleo Dentist" shows in both kids' columns.
  It's one event, so its ride details are shared, and kids at the same event with the same driver
  go in one car. Possessives and a dash or colon after the names are fine ("Ava's Recital",
  "Robin - Dr Appt").
- **Other names**: under **Configure > Names and planner timing**, each parent and kid can have
  other names, such as Mom and Dad, and there's a box for shortcuts that mean every kid. The kids'
  initials always work for all of them, so with Ava, Ben and Cleo, "AB&C Pictures" and "A, B & C
  Pictures" are everyone's.
- **NO in front** means they aren't going: "NO Ava Golf" is struck through and needs no rides.
- **A parent named with kids**, as in "Sam, Ben & Cleo Donuts", means that parent takes them: Sam
  drives both ways and stays, unless the notes name someone else.

All-day events go in a thin row right under the date of each day they cover, and stay pinned with
the date while you scroll through that day, such as "Trash Day" or a
week of "Winter Break". They aren't assigned to anyone and never stop anyone driving; a name in
the title just colours the chip. A trip that should keep a parent from driving needs times: "Robin
Indianapolis" from 7 AM Tuesday to 7 PM Friday is one event in Robin's column.

An event with times whose title doesn't start with a known name, like "Garage floor bid" or
"Happy Hour Robin", is flagged in Needs attention as "Who is this for?" and shown in the top row.
So is a name MyDashLight doesn't know, as in "Ava & Zoe Sleepover", which still shows in Ava's
column. Tap the flag on the board to pick who it's for: that's saved as a `For:` line in the
event's notes (see below), so the title stays as it is. A `For:` line wins over the names in
the title, and an event's ride editor has a Change button for it. Declined events and events
marked Free don't count as busy.

A parent's own event at a set time and a real address, such as a dentist visit or a soccer game,
gets a ride too: that parent drives there, stays, and drives back, and the drive counts as busy
time. Kids or the other parent can go along (see Take along below). The same event on both
parents ("Robin & Sam Dinner") is one trip, with the second parent along. Online events, events at home,
all-day events and ones running past 6 AM the next day are just busy time, as before. A trip
alone to your own event gets no leave reminder, since you know your own day; one with someone
along reminds the driver and tells each rider when they leave.

An errand is a parent's own event with a `Takes` line, such as `Takes: 10 min` on "Pick up the
jersey" from 2:30 to 5:30 PM. The event's start and end are the window, and the planner picks
when to go, stopping on the way to or from another trip when that fits. The card then says when
("Stop at 4:40"), and the driver gets the usual leave reminder. An errand counts even when the
event is marked Free, and it takes nobody along.

**Coming from 0.18 or earlier**, when each kid had a calendar of their own: after the update the
board says to pick the family calendar. Under **Configure > Calendars**, pick it and the lunch
calendar, and check the kids' names. Each kid keeps their notifier, lunch default, menu feed and
chore list. The old kid and parent calendars are no longer read and nothing on them is changed,
so ride details saved there need entering again on the family calendar's events.

No other calendar is read for the rides. An event that ends by 6 AM the next day stays on the
day it starts. A longer one, such as a weekend trip, is planned as a drop-off on its first day and
a pick-up on its last. Change the calendars later under the integration's **Configure** button.

Where an event is decides whether it needs a ride:

- **At home**: the location is `Home`, or the same street address as the **Home address** setting
  (the integration's **Configure** button, then **Names and planner timing**). Only the part
  before the first comma counts, and "Street" matches "St", so `12 Oak Street` matches
  `12 Oak St, Springfield, IL`. It needs no ride, whatever its notes say, and the board shows it
  as "At home". If a kid's ride home from something else runs into it, the board shows a clash.
- **Anywhere**: no location, or an online one such as a Zoom or Meet link, or `Online`. A call or
  an online class can happen anywhere, even in the car, so it needs no ride. Naming a driver in
  its notes plans it after all, using the "Drive time with no address" setting.
- **Anywhere else**: a place to drive to.

To see the plan, run the **MyDashLight: Get ride plan** action in Developer tools > Actions.

## Drive times

With a Google Routes API key (the integration's **Configure** button, then **Drive times**),
each trip's drive time is looked up with the usual traffic for the hour it's driven on that
weekday, starting from your home location in Home Assistant. A trip to an activity counts as
leaving half an hour before it starts, and a trip home as leaving when it ends.

- Only the trips the plan actually uses are looked up, today's first.
- Each drive time is kept for 30 days, so a weekly activity costs about one lookup a month.
- Each lookup also says where the trip's ends are on the map, at no extra cost. Those points are
  kept for 90 days, for checking a driver is on their way (see Reminders).
- Lookups stop for the day at the daily limit (150 by default, which stays under 5,000 a month).
  Trips over the limit are estimated and looked up the next day.
- A Travel line in an event's notes always wins for trips to that event.
- Without a key, every drive counts as the "Drive time with no address" setting (15 minutes).
  So does a drive to an event with no location whose notes name a driver.

`get_plan` says where the drive times came from under `drive_times`.

## Ride details in event notes

Each kid's activity is an event on the family calendar. Ride details go in a block at the
end of the event's notes, after a `--- Rides ---` line:

```
Bring shin guards. Field 3.

--- Rides ---
For: Ava & Ben
Drop-off: Sam, Ben
Pick-up: the Parkers
Arrive by: 5:15 PM
Leave by: 6:30 PM
Travel: 25 min
```

| Line | Values | Without the line |
| --- | --- | --- |
| For | Who the event is for, by name, joined the same way as in titles: `Ava & Ben`, `Robin, Cleo`. Only read inside the Rides block, since copied event details often say things like "For: ages 6 to 10" | The names at the start of the title |
| Drop-off, Pick-up | The driver first: a parent's name or another name they go by, Not needed, or anyone else's name (a carpool driver). Then anyone riding along, by name, such as `Drop-off: Sam, Ben, Robin`. `TBD` holds the driver's place when riders are named but nobody is driving yet | Nobody is driving yet, which shows as a problem |
| Stay | yes | The driver drops off and comes back. Stay only applies when one parent drives both ways |
| Take along | Kids' names, and on a parent's own event the other parent | Nobody else rides along. On a parent's own event, everyone named goes there and back with that parent. On a kid's event, an older line still counts as riders on the drop-off |
| Arrive by | A time, such as 5:15 PM, or 15 min early, when the kid has to be there before the event starts | They have to be there at the start. Either way, the driver aims to get there a margin early for traffic. It grows smoothly with the drive from home, 3 + 14 × ln(1 + drive ÷ 50) minutes: 3 with no drive, 5 for 10 minutes, 10 for 35, 14 for an hour, 20 for two. Pick-ups get the same margin, so the kid isn't left waiting |
| Leave by | A time, such as 1:15 PM, when the kid has to leave before the event ends, like leaving a party early for a game | They leave at the end. With it, the pick-up is at that time, and a driver who stays leaves then. When one kid's events overlap, the warning offers leaving the first one early as a one-tap fix, in time to drive straight to the next |
| Travel | Minutes, such as 25 min | Use the computed drive time |
| Attending | no, when the kid isn't going this time | They're going |
| Takes | Minutes, such as 10 min, on a parent's own event | A set time. With it, the event is an errand: that long, any time between its start and end |

Riders on the Drop-off line leave home in the same car, so the driver can go on to their own
drop-offs without coming home for them. Riders on the Pick-up line come along to fetch the kid. A
parent named as a rider is busy for that trip. With `Stay: yes`, everyone stays, so riders go
both ways. If the two lines name different riders then, the plan flags it to fix, and counts
everyone named on either line as riding both ways.

An event the kid isn't going to stays on the board, marked "Not attending", but needs no rides,
raises no problems or reminders, and never clashes with anything. Besides `Attending: no`, the old
habit of starting the title with a capital `NO` (`NO Soccer`, `NO - Soccer`, `NO: Soccer`) counts
too, and the board shows the title without it.

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
| `mydashlight.set_ride` | Who drops off, picks up, or both: `mom` or `dad` (the first or second parent, or their name), `none` when no ride is needed, a carpool driver's name, or empty for nobody yet. A parent always drives to their own event, so this and `set_stay` turn it down |
| `mydashlight.set_stay` | Whether the driver stays for the event |
| `mydashlight.set_attending` | Whether the kid is going (`attending`). Going again also takes an old `NO` off the start of the title |
| `mydashlight.set_arrive_by` | When the kid needs to be there, if it's before the start. The traffic margin still comes off it. No time means they need to be there at the start |
| `mydashlight.set_leave_by` | When the kid has to leave, if it's before the end. The pick-up is then at that time. No time means they leave at the end |
| `mydashlight.set_take_along` | Who rides along (`kids`, by name: other kids or the other parent) on the `side` you pick, `drop`, `pick` or `both`. When the driver stays, riders go both ways. On a parent's own event, they go there and back. Empty takes nobody along |
| `mydashlight.set_takes` | How long a parent's errand takes (`minutes`). The errand then fits in any time between the event's start and end. No minutes makes it a set-time event again. Kids' events turn it down |
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

## The rides board

The kitchen app's first screen is everyone's week of rides: a column for each kid, then one for
each parent. A kid's column holds their activities and their time in a car; a parent's column
holds their trips out of the house, with dots for who's in the car, and their busy times. A tinted band links a kid's car time to whoever is driving. Two views, switched at
the top:

- **Compact**, the default, drops the time scale: everything sits in start order, with each trip's
  stops listed.
- **Timeline** spaces everything by the clock, so overlaps and tight handoffs are easy to see.

What's over drops off, so more of the week fits on screen. An activity stays until it has ended
and the drive home is done; a trip, a car ride or a busy time goes once it ends. In Timeline, today
starts just before now, and anything already under way runs in from the top with an open (dashed)
top edge. Today's heading counts what's left ("2 activities left", or "All done for today"), days
before today go altogether, and all-day events stay until their day is over. Nothing that's over
asks for attention any more. Add `?past=show` to the address to keep everything on the board.

There's no row of day buttons taking up the top of the screen: the board is one long scroll
through the week, with each day's heading pinned at the top as you go. Swipe (or drag, or use the
mouse wheel) to move through the days. While the board is moving, the week's days slide out at its
right edge, each with dots for what's on and a red count for what needs sorting out; tap one to go
straight there. They tuck away a moment later, leaving a small tab beside the board to pull them
out again. Tapping a day's date also goes to that day and brings out the others. Once you've moved
off today (or, in Timeline, well away from now), a **Today** button appears at the bottom to jump
back. Add `?daypicker=off` to the address to leave out the days at the edge.

A **Rides | Chores** switch at the top flips between this board and the chores board (see
[Chores on the board](#chores-on-the-board)).

The **Needs attention** list shows chores that are overdue or due today, then ride problems in the next 48 hours (no driver, late, a kid
waiting, a parent still at work, a kid double-booked) with the suggested fixes, plus heads-ups
for today and tomorrow. Problems later in the week show in red on their day's heading ("1 to sort
out") and as a red count on that day at the board's edge. Tap any activity, car or trip to change who drives each way, whether the driver
stays, who's taken along, and the arrive-by time. A repeating activity asks whether to change just
that day or every time. If a kid is skipping one, tap **Not attending**: it stays on the board,
crossed out, with no rides planned, and it no longer counts as a clash. When a kid is
double-booked, each event's name in the Needs attention card opens that event, so the one being
skipped is a tap away. Each change is saved in the event's notes on Google straight away.

There are two ways to open it, both signed in to Home Assistant:

- **Rides** in Home Assistant's sidebar. This works in the Home Assistant app on a phone too.
- `<your Home Assistant URL>/mydashlight-kitchen`, a full-screen page for the kitchen screen. After
  three minutes without a touch it closes anything open and scrolls back to now. To set up a
  Raspberry Pi as the kitchen screen, see [kiosk/README.md](kiosk/README.md).

### Pairing the kitchen screen

A kitchen screen has no keyboard, so instead of a password it pairs:

1. The kitchen page shows a code, like `KQ7M-4TXP`, and a QR code.
2. On your phone, scan the QR code (or open `<your Home Assistant URL>/mydashlight?pair` and type
   the code), check the code matches, and press **Allow**. You need to be a Home Assistant admin.
3. The screen is signed in to Home Assistant as you, and opens the board.

Home Assistant keeps the screen signed in as long as it's used, and drops the sign-in after 90 days
unused. To sign the screen out, open your Home Assistant profile, go to **Security**, and delete
the refresh token for `<your Home Assistant URL>/mydashlight-kitchen`; the screen shows a new code.
Only the screen that showed the code can collect the sign-in, so seeing the code isn't enough. A
browser already signed in to Home Assistant at the same address skips pairing, and the pairing page
also offers **Sign in with a password instead**.

### On-screen keyboard

The kitchen page brings its own keyboard: it slides up when a text box is clicked or tapped, the
same with a mouse or a touchscreen. For a screen with a real keyboard, add `?keyboard=off` to the
address.

The mouse pointer hides after 3 seconds without movement and comes back when the mouse moves.
Add `?cursor=show` to keep it on screen.

### Screen settings

Either address can pick the view it opens in, so each screen can have its own:

| Add to the address | Opens in |
| --- | --- |
| `?view=timeline` (or `?view=full`) | Timeline |
| `?view=compact` | Compact |
| `?page=chores` | The chores board instead of rides |
| `?page=lunch` | The Lunch tab instead of rides |
| `?past=show` | Keeps activities and trips that are over on the board, for checking what happened |
| `?daypicker=off` | Leaves out the week's days that slide out at the board's edge while scrolling |

For example, `<your Home Assistant URL>/mydashlight-kitchen?view=compact`, or
`?page=chores&view=compact` for both. You can still switch by tapping; the kitchen screen goes back
to its page and view after three minutes without a touch. Without a `view`, the board opens in
whichever view was last picked in that browser, or Compact if none was; without a `page`, it opens
on rides.

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

## Chores

Chores live in Google Tasks, under the Google account MyDashLight signs in with. MyDashLight makes
these lists the first time it runs:

- **Chore seeds**, the one list every chore grows from. Each task on it is a chore's seed (its
  template): its title is the chore, and its notes say who, how often and the rest. A School days
  chore comes only on the kid's school days (see [Lunch](#lunch)).
- **Chores: \<kid\>**, one per kid. These are the real chores, each due on its day.
  MyDashLight fills them from the seeds, 7 days ahead (**Configure > Names and planner timing
  > Chore days ahead**). Tasks added to a kid's list by hand are one-off chores: they show, and
  can be checked off, but MyDashLight leaves them alone.

Before 0.18, seeds were on four lists (**Chore templates: Daily**, **Weekly**, **Monthly** and
**School days**). MyDashLight moves them onto Chore seeds as they are, with their history, and
removes each old list once it's empty.

A seed's notes end in a Chore block, which the `save_chore_template` action writes:

```
Bins at the curb by 7 PM.

--- Chore ---
Id: 3f9a1c22b7
Repeats: Every 2 weeks
Who: Ava, Ben
Take turns: yes
Days: Thu
Starts: 2026-11-04
Ends: 2027-06-05
Points: 1
```

| Line | Meaning |
| --- | --- |
| Repeats | How often, one of four kinds, each counted in its own unit: `Every day` (or `Every 3 days`), `Every week` (or `Every 2 weeks`), `Every month` (or `Every 3 months`, `Quarterly`), or `School days`. Left out, Days decides: weekdays make it weekly, dates monthly, none daily. |
| Who | The kids who do it, by name, or Everyone. Each gets their own, unless they take turns. |
| Take turns | The kids in Who take turns, one each time, in order from Starts. |
| Days | Weekly: weekdays such as `Mon, Thu` or `Mon-Fri`, or `Any` for sometime that week (shows from Monday, due Sunday). Monthly: a date such as `15` or `last`, a day such as `1st Sat`, or `Any` for sometime that month. School days: which weekdays (none for every school day). Daily chores have no Days: picking days makes a chore weekly, so "every 2 days, on Mondays" can't happen. Several are separated by commas. |
| Starts, Ends | The first and last days. Starts is the day the template was made if left out. |
| Points | Saved on each chore for later. Nothing uses it yet. |
| When | School days only: `Night before` makes it due the day before each school day (Sunday for Monday); the board shows it from 1 PM that day. Left out, it's due that morning. |
| Only | School days only: `Bring lunch days` makes it only on days the kid brings lunch, for chores like packing it. |

Text above the block is the chore's details, shown when it's tapped. A leading emoji in the title
is its icon. Checking a seed off in Google pauses it. A seed typed into Google by hand works too;
MyDashLight adds its Id, Repeats and Starts lines the first time it reads it. One it can't read (an
unknown kid, say) makes no chores, and `get_chores` lists what's wrong with it.

Each chore on a kid's list has the template's title and details, and a Chore block with `From`
(the template's Id) and `For` (the day it was made for). From then on:

- **Checked off** on the board, on a phone or in the Google Tasks app: Google records when. Done
  after its due day counts as late. Checked off through MyDashLight, it also records who did it
  with a `Done by: <name>` line: the kid it's for, or anyone else picked, parents included.
  Opening it again takes that line out.
- **Still open after its due day:** MyDashLight adds `Missed: <day>` to its notes, once for each
  day it missed. When the next one of that chore shows (or its template is paused), the missed one
  is checked off with `Closed: missed`, so the board shows one, not a pile, and the miss stays
  counted.
- **Template changed:** chores coming up that aren't done yet follow it (new title, day or kid).
  Done chores and chores whose day has passed never change, so the history stays true.

The actions: `mydashlight.get_chores` returns the chores the board shows (each kid's open and
overdue chores, those coming up, and those done today) and the templates;
`mydashlight.set_chore_done` checks one off (with `by` for someone other than the kid it's for)
or opens it again; `mydashlight.save_chore_template`
adds or changes a template; `mydashlight.remove_chore_template` removes one. The app subscribes
to `{"type": "mydashlight/chores/subscribe"}` for the same chores as they change.

### Chores on the board

Tap **Chores** at the top of the kitchen app for a column per kid, in the kids' colors:

- **Missed**: overdue chores, with how many times they've been missed.
- **To do**: today's chores, and this week's or month's that are showing ("By Sun").
- **Done**: checked off today, or ahead of their day, with when.
- Then the days ahead, each under the day it shows, faded until then.

Tap a chore to check it off: the panel asks who did it, with the kid it's for as the big button
and **Someone else did** for anyone else, parents included (saved as `Done by` in its notes). Tap a
done chore to undo it. Each change is saved to Google Tasks straight away and shows on every board
(the kitchen screen, a PC, a phone) at once. A change made in the Google Tasks app instead shows
within a minute, when MyDashLight next reads the lists.

**Add a chore** and **Manage chores**, above the columns, open the chore editor in the panel, like a
ride's: its name and picture, who does it (each one, or taking turns), how often (some days of the
week, weekly or monthly), which days, how many weeks or months apart, and notes. A chore can be
paused or removed there too. A task typed straight into the Chore seeds list in Google Tasks
shows at the top of the Chores board under **needs setting up**; tap it to pick who does it and
when.
The **Needs attention** list starts with a Chores section: every kid's overdue chores and the ones
due today, with the kid's name, and they can be checked off right there. A chore done sometime this
week or month joins that list only on its last day, so the list stays short. With no chores yet,
the Chores board says how to add the first one.

## Lunch

Lunches live on a calendar of their own, so they stay out of the family calendar. Make one in
Google Calendar (such as "MyDashLight Lunches"; it doesn't need sharing with anyone) and pick it
under **Configure > Calendars**. There's nothing to keep in Home Assistant:

- An all-day event on the family calendar with **No School** in its title (such as "No School –
  Thanksgiving Break") means no school those days: for the kids it names, or for every kid when it
  names nobody. Every other weekday is a school day.
- Each day's lunch is one all-day event on the lunch calendar, starting with the kid's name.
  Titled **Ava Lunch: Pizza, side salad**, it says what Ava's school serves that day, and its notes
  can hold the rest of the menu (other choices, sides). Titled just **Ava Lunch**, the dish is the
  first line of its notes, or the menu isn't known yet. Each kid has their own, so kids at
  different schools get different menus.
- The kid's pick goes in a short block at the end of that event's notes:

  ```
  --- Lunch ---
  Pick: Bring
  ```

  A school day with no pick gets the kid's default: Buy, unless the kid is picked under
  **Configure > Lunch** as bringing by default. A pick on a day with no menu yet goes on a plain
  **Lunch** event, which the menu fills in later. (Before 0.16, picks were their own **Bring
  Lunch** and **Buy Lunch** events. Those are still read, and MyDashLight moves them onto the day's
  lunch event when it starts.)
- A month of menus can be imported into the lunch calendar from a `.ics` file (Google Calendar:
  **Settings > Import & export**), or added on the Lunch tab.
- **Menu feeds.** Many schools publish their menu as a calendar to subscribe to (look for an
  ICAL or Subscribe button on the menu page). Paste its address for each kid under **Configure >
  Lunch**. Every 6 hours MyDashLight reads it and adds each day's lunch from today on to the lunch
  calendar as an `Ava Lunch: …` event (or fills in that day's plain **Lunch** event, keeping the
  pick): the first item is the dish, the rest goes in the notes.
  Breakfast (`B: …`) and `No School` entries are skipped. These events carry a private mark, so
  only they follow later changes to the feed; a menu typed by hand, imported, or changed on the
  Lunch tab is left alone.

Tap **Lunch** at the top of the kitchen app for this month and next, a card per kid with Monday to
Friday like the printed menu. Tap a day to switch it between Buy and Bring, or tap a weekday's name
to make every one left that month Bring (or Buy, when they all are already). Each tap adds, changes or removes the kid's event that day on
the lunch calendar. Days off are drawn hatched with their name underneath. Each day shows its menu; tap
**Edit menus** to add or change one, for one kid or several at once. Each kid's column on
the rides and chores boards shows a small Buy or Bring chip: today's until 1 PM, then the next
school day's, so in the evening it says what to pack.

The School days chores list uses the same school days: a chore there is made only on a kid's
school days, and its turns count school days, so a day off doesn't change whose turn it is. When
the calendars can't be read, School days chores are left as they are until they can.

The actions: `mydashlight.get_lunches` returns each kid's school days off, picks and default from
the 1st of this month to the end of next month; `mydashlight.set_lunch` sets a kid's lunch on one
or more dates to `bring`, `buy` or `default` (removes the pick); `mydashlight.set_lunch_menu`
sets the menu on a date for some kids (an empty `menu` removes it). The app subscribes to
`{"type": "mydashlight/lunch/subscribe"}`.

## Reminders

Under **Settings > Devices & services > MyDashLight > Configure > Reminders**, pick a notifier for
each parent and each kid who should get reminders. A notifier is a `notify` action, such as the one
the Home Assistant app adds for each phone. Anyone left on **No reminders** gets none.

- **Before each drive.** Leave time is worked back from when the kid has to be there (Arrive by,
  or else the start), less the traffic margin, and the drive time. The reminder goes off 15 minutes before
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
- **Rides with no driver.** A drop-off or pick-up coming up with nobody driving yet is sent once to
  both parents' notifiers, several at a time when there are several. It goes six hours before the
  ride, or whatever **Warn about rides with no driver this far ahead** says.
- **Is the driver on their way?** Pick each parent's person under **Where the first parent is**
  and **Where the second parent is**, and their phone's location (from the Home Assistant app) is
  checked for the drives they're on. Only the driver is told, never the other parent.
  - At the leave reminder, a driver who isn't at the drive's starting point, and is farther from the
    first stop than it, gets a reminder that says when to leave from where they really are.
  - Five minutes after leave time, a driver still at the starting point gets "Time to go". One who
    has left but is farther from the first stop than the starting point is told if they'll now be
    late.
  - Distances are straight lines on the map, so they cost nothing. A drive time from where the
    driver is gets looked up only when the straight lines say they're somewhere unexpected, and it
    counts toward the daily limit. Locations are only read, never saved anywhere.

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
   the **Google Calendar API** and the **Google Tasks API**.
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

MyDashLight asks Google for three permissions: to see your list of calendars, to see and edit
events (for writing who drives into an event's notes), and to see and edit your tasks (for
chores). If you signed in before chores were added, Home Assistant asks you to sign in again;
rides keep working until you do.

## License

MIT. See [LICENSE](LICENSE).
