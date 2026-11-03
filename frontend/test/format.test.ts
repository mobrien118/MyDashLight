import assert from "node:assert/strict";
import { test } from "node:test";
import { ago, clock, clockAmPm, dayLabel, duration, hourLabel, nowIn, rangeLabel, timeField } from "../src/format.ts";

test("clock times", () => {
  assert.equal(clock(945), "3:45");
  assert.equal(clock(0), "12:00");
  assert.equal(clock(720), "12:00");
  assert.equal(clock(65), "1:05");
  // A pick-up after midnight runs past 1440.
  assert.equal(clock(1470), "12:30");
  assert.equal(clockAmPm(1035), "5:15 PM");
  assert.equal(clockAmPm(465), "7:45 AM");
  assert.equal(hourLabel(900), "3 PM");
  assert.equal(hourLabel(0), "12 AM");
});

test("durations", () => {
  assert.equal(duration(0), "0 min");
  assert.equal(duration(45), "45 min");
  assert.equal(duration(120), "2 hr");
  assert.equal(duration(344), "5 hr 44 min");
});

test("time fields for Home Assistant", () => {
  assert.equal(timeField(1035), "17:15:00");
  assert.equal(timeField(5), "00:05:00");
});

test("dates", () => {
  assert.equal(dayLabel("2026-11-05"), "Thursday, November 5");
  assert.equal(rangeLabel("2026-11-05", "2026-11-11"), "Thursday, November 5 to Wednesday, November 11");
});

test("now in the plan's time zone", () => {
  const at = new Date("2026-11-04T03:30:00Z"); // 9:30 PM the day before in Chicago
  assert.deepEqual(nowIn("America/Chicago", at), { date: "2026-11-03", minutes: 21 * 60 + 30 });
  assert.deepEqual(nowIn("Not/AZone", at), { date: "2026-11-04", minutes: 210 });
});

test("how long ago", () => {
  const now = new Date("2026-11-04T00:00:00Z");
  assert.equal(ago(new Date("2026-11-03T23:59:40Z"), now, "America/Chicago"), "just now");
  assert.equal(ago(new Date("2026-11-03T23:45:00Z"), now, "America/Chicago"), "15 min ago");
  assert.equal(ago(new Date("2026-11-03T22:00:00Z"), now, "America/Chicago"), "at 4:00 PM");
});
