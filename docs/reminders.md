# Reminders

Under **Settings > Devices & services > MyDashLight > Configure > Reminders**, pick a notifier for
each parent and each kid who should get reminders. A notifier is a `notify` action, such as the one
the Home Assistant app adds for each phone. Anyone left on **No reminders** gets none.

- **Before each drive.** Leave time is worked back from when the kid has to be there (Arrive,
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
