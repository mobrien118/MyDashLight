// Times and durations the way the board writes them: "4:35", "3 PM", "1 hr 20 min".

/** "4:35". Minutes past midnight, on a 12-hour clock with no AM or PM, like the backend's text. */
export function clock(m: number): string {
  const r = Math.round(m);
  const h = Math.floor(r / 60);
  const mm = ((r % 60) + 60) % 60;
  return `${((((h + 11) % 12) + 12) % 12) + 1}:${mm < 10 ? "0" : ""}${mm}`;
}

/** "4:35 PM", for places where the time stands alone. */
export function clockAmPm(m: number): string {
  const h = Math.floor(Math.round(m) / 60) % 24;
  return `${clock(m)} ${h < 12 ? "AM" : "PM"}`;
}

/** "3 PM": an hour mark on the timeline. */
export function hourLabel(m: number): string {
  const h = Math.floor(m / 60) % 24;
  return `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;
}

/** "1 hr 20 min", "45 min", "2 hr". */
export function duration(m: number): string {
  const total = Math.max(0, Math.round(m));
  const h = Math.floor(total / 60);
  const mm = total % 60;
  if (!h) return `${mm} min`;
  return mm ? `${h} hr ${mm} min` : `${h} hr`;
}

/** "HH:MM:SS", as Home Assistant's time fields take it. */
export function timeField(m: number): string {
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
}

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" });
const SHORT_WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });

function asUtc(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`);
}

/** "Thursday, November 5". */
export function dayLabel(isoDate: string): string {
  const d = asUtc(isoDate);
  return `${WEEKDAY.format(d)}, ${MONTH_DAY.format(d)}`;
}

/** "Thu". */
export function shortDay(isoDate: string): string {
  return SHORT_WEEKDAY.format(asUtc(isoDate));
}

/** "Thursday, November 5 to Wednesday, November 11". */
export function rangeLabel(first: string, last: string): string {
  return first === last ? dayLabel(first) : `${dayLabel(first)} to ${dayLabel(last)}`;
}

/** The days between two ISO dates (b minus a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((asUtc(b).getTime() - asUtc(a).getTime()) / 86_400_000);
}

/** Today's date and the minutes past midnight right now, in the plan's time zone. */
export function nowIn(timeZone: string, at: Date = new Date()): { date: string; minutes: number } {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(at);
  } catch {
    return nowIn("UTC", at);
  }
  const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? "0";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** "just now", "3 min ago", "at 4:35 PM". */
export function ago(then: Date, now: Date, timeZone: string): string {
  const mins = Math.floor((now.getTime() - then.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const t = nowIn(timeZone, then);
  const today = nowIn(timeZone, now).date;
  return t.date === today ? `at ${clockAmPm(t.minutes)}` : `on ${shortDay(t.date)} at ${clockAmPm(t.minutes)}`;
}
