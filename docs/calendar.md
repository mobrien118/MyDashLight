# The family calendar

MyDashLight reads one shared Google calendar. How you title and fill in events decides whose column
they go in and which ones need a ride. You don't need any of this to get started: an event titled
"Ava Piano" with an address is enough. The rest is for when you want more.

## Whose event it is

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
event's notes (see [Ride details in event notes](#ride-details-in-event-notes)), so the title stays as it is. A `For:` line wins over the names in
the title, and an event's ride editor has a Change button for it. Declined events and events
marked Free don't count as busy.

A parent's own event at a set time and a real address, such as a dentist visit or a soccer game,
gets a ride too: that parent drives there, stays, and drives back, and the drive counts as busy
time. Kids or the other parent can go along (see Take along in [Ride details](#ride-details-in-event-notes)). The same event on both
parents ("Robin & Sam Dinner") is one trip, with the second parent along. Online events, events at home,
all-day events and ones running past 6 AM the next day are just busy time, as before. A trip
alone to your own event gets no leave reminder, since you know your own day; one with someone
along reminds the driver and tells each rider when they leave.

An errand is a parent's own event with a `Takes` line, such as `Takes: 10 min` on "Pick up the
jersey" from 2:30 to 5:30 PM. The event's start and end are the window, and the planner picks
when to go, stopping on the way to or from another trip when that fits. The card then says when
("Stop at 4:40"), and the driver gets the usual leave reminder. An errand counts even when the
event is marked Free, and it takes nobody along.

A stay away from home makes the hotel home for the rides. Title it with names, then `Stay`
(or `Staying at`), then the place, as "Robin & Sam Stay Marriott Chicago", and put the hotel's
address in the location. It can be all day across the nights, or from check-in to check-out. On
every day it touches, the parents it names start and end their rides at the hotel, and pick up a
kid "from home" there. Their trips say the hotel's name where they'd say Home, and the leave
checks look for them at the hotel. A place given only by name, such as "Lifetime Fitness", is
looked up near the hotel for the people on the stay (or everyone, when both parents are away),
instead of near home. Name a kid too, as "Sam & Ava Stay Westin", to have her places looked up
near the hotel; her events back home still need marking not going. A stay shows in the row of
all-day events and never stops anyone driving. A kid's own stay ("Ava Stay at Noah's") is a
sleepover, a ride like any other.

**Coming from 0.18 or earlier**, when each kid had a calendar of their own: after the update the
board says to pick the family calendar. Under **Configure > Calendars**, pick it and the lunch
calendar, and check the kids' names. Each kid keeps their notifier, lunch default, menu feed and
chore list. The old kid and parent calendars are no longer read and nothing on them is changed,
so ride details saved there need entering again on the family calendar's events.

No other calendar is read for the rides. An event that ends by 6 AM the next day stays on the
day it starts. A longer one, such as a weekend trip, is planned as a drop-off on its first day and
a pick-up on its last. Change the calendars later under the integration's **Configure** button (see [Setup](setup.md#5-adjust-the-settings)).

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
- A place given by name only, with no street number or zip code (such as "Elm Elementary"), is
  looked up with the town and zip code from the home address, so Google picks the one nearby.
- If a drive to or from a place given by name only still comes back over 3 hours, Google matched
  the wrong place. The drive counts as the "Drive time with no address" setting instead, and the
  event says to add its full address.
- A trip with a drive of 2 hours or more in one go says how long it is, in red on the trip, so a
  wrong place on the map doesn't pass for a short drive that leaves hours early.
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
Arrive: 15 min early
Leave: 10 min late
Travel: 25 min
```

| Line | Values | Without the line |
| --- | --- | --- |
| For | Who the event is for, by name, joined the same way as in titles: `Ava & Ben`, `Robin, Cleo`. Only read inside the Rides block, since copied event details often say things like "For: ages 6 to 10" | The names at the start of the title |
| Drop-off, Pick-up | The driver first: a parent's name or another name they go by, Not needed, or anyone else's name (a carpool driver). Then anyone riding along, by name, such as `Drop-off: Sam, Ben, Robin`. `TBD` holds the driver's place when riders are named but nobody is driving yet | Nobody is driving yet, which shows as a problem |
| Stay | yes | The driver drops off and comes back. Stay only applies when one parent drives both ways |
| Take along | Kids' names, and on a parent's own event the other parent | Nobody else rides along. On a parent's own event, everyone named goes there and back with that parent. On a kid's event, an older line still counts as riders on the drop-off |
| Arrive | How early or late the kid gets there against the start: `15 min early`, `10 min late`, `1 hr early`. `-15` and `+10` work too, and so does a clock time (`Arrive by: 5:15 PM`, as MyDashLight wrote it before 0.25) | They get there at the start. Either way, the driver aims to get there a margin early for traffic. It grows smoothly with the drive from home, 3 + 14 × ln(1 + drive ÷ 50) minutes: 3 with no drive, 5 for 10 minutes, 10 for 35, 14 for an hour, 20 for two. Pick-ups get the same margin, so the kid isn't left waiting |
| Leave | How early or late the kid is picked up against the end, the same way: `30 min early` to leave a party for a game, `15 min late` when they stay on. A clock time works too (`Leave by: 1:15 PM`) | They're picked up at the end. With it, the pick-up is at that time, and a driver who stays leaves then. When one kid's events overlap, the warning offers leaving the first one early as a one-tap fix, in time to drive straight to the next |
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

Arrive and Leave are written against the event's own times, so they still hold when an event
moves, and the same line suits every week of a repeating event. `Arrive adjust` and `Pick-up
adjust` read the same as `Arrive` and `Leave`. An older `Arrive by` or `Leave by` clock time keeps
working as it is, and the editor writes it the new way the next time that time changes.

Labels ignore case, spaces and hyphens, so `Drop off`, `Dropoff` and `Pickup` all work. Only lines
inside the block count, so a note like "Pick-up: bring cleats" higher up is never read as a driver.
If the notes have no block yet, ride lines anywhere count, so a quick line typed on a phone works,
and the app moves them into a block the next time it changes the ride. The app only ever changes
the block. Everything else in the notes stays as it was, in plain text or in the HTML Google uses
once someone edits notes on the web.

To change rides from the board, see [The kitchen app](kitchen-app.md#needs-attention-and-changing-a-ride). The actions
behind it are in [Development](development.md#actions).
