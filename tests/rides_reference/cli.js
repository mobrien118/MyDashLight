#!/usr/bin/env node
// Runs the reference planner (planner-reference.js, from the ride board mockup) for the Python tests.
//
//   node tests/rides_reference/cli.js scenarios > tests/rides_reference/scenarios.json
//       Rebuilds the golden scenarios: each day of the example week, plus three Thursday variants.
//   node tests/rides_reference/cli.js board < days.json
//       Reads [{events, along, busy}, ...] and prints everything the planner and buildDay
//       produce for each day. tests/test_planner_vs_reference.py feeds it random days.
'use strict';
var P = require('./planner-reference.js');

function fmt12(m) {
  m = Math.round(m);
  var h = Math.floor(m / 60);
  return P.fmt(m) + (h % 24 >= 12 ? ' PM' : ' AM');
}

function segment(g) {
  var o = { type: g.type, start: fmt12(g.start), end: fmt12(g.end) };
  if (g.type === 'drive') { o.from = g.from; o.to = g.to; }
  if (g.type === 'wait' || g.type === 'stay') o.loc = g.loc;
  if (g.type !== 'home') { o.kids = g.kids; o.serves = g.anchor && g.anchor.e ? g.anchor.e.id : null; }
  if (g.bad) o.overlaps_busy = true;
  return o;
}

function driver(p) {
  return { first_leave: p.leave == null ? null : fmt12(p.leave), drive_min: p.drive, segments: p.segs.map(segment) };
}

function issue(x) {
  var o = { kind: x.kind };
  if (x.d) o.driver = x.d;
  if (x.e) o.event = x.e.id;
  if (x.end) o.side = x.end;
  if (x.min != null && x.kind !== 'unassigned') o.min = x.min;
  return o;
}

function clash(c) {
  return { kid: c.kid, a: c.a.e ? c.a.e.id : null, b: c.b.type === 'act' ? c.b.e.id : 'ride' };
}

function expected(evs, along, busy, plan, clashes) {
  var ex = {
    mom: driver(plan.mom), dad: driver(plan.dad),
    issues: plan.hard.map(issue), heads_ups: plan.soft.map(issue),
    suggestions: plan.hard.map(function (x) {
      return {
        for: P.issueKey(x),
        options: P.suggestionsFor(x, evs, along, plan, busy).map(function (c) { return { label: c.label, change: c.change, note: c.note }; })
      };
    }).filter(function (s) { return s.options.length; })
  };
  if (clashes.length) ex.double_booked = clashes.map(clash);
  return ex;
}

// buildDay reads busy times from BUSY_BY_DAY, so a day's busy times go in slot 0.
function buildDay(evs, along, busy) {
  P.BUSY_BY_DAY[0] = busy;
  return P.buildDay(0, evs, along);
}

function scenario(name, day, evs, along) {
  var busy = P.BUSY_BY_DAY[day] || {};
  var plan = P.planAll(evs, along, busy);
  var bd = P.buildDay(day, evs, along);
  return { name: name, day: day, input: { events: evs, along: along, busy: busy }, expected: expected(evs, along, busy, plan, bd.clashes) };
}

function scenarios() {
  var noAlong = { mom: false, dad: false };
  var day = function (i) { return P.cloneEvents().filter(function (e) { return e.day === i; }); };
  var out = P.DAYS.map(function (d, i) { return scenario(d.label + ' (example week)', i, day(i), noAlong); });
  out.push(scenario('Thursday with Sam taking kids along', 0, day(0), { mom: false, dad: true }));
  var t2 = day(0);
  t2.forEach(function (e) { if (e.id === 'soccer') e.drop = 'mom'; });
  out.push(scenario("Thursday with Robin doing Cleo's drop-off", 0, t2, noAlong));
  var t3 = day(0);
  t3.forEach(function (e) { if (e.id === 'volley') { e.start = 960; e.end = 1050; } });
  out.push(scenario('Thursday with volleyball moved on top of piano (double-booked)', 0, t3, noAlong));
  return {
    note: "Expected planner output for the reference data in planner-reference.js. Times use the event day's local time. Travel times come from the DRIVE table there.",
    scenarios: out
  };
}

var TONE = { '#8A5A00': 'pending', '#3D434B': 'normal', '#B42318': 'problem', '#6B717A': 'muted' };

function cardLine(l) { return l ? { text: l.text, tone: TONE[l.ink] } : null; }

function board(day) {
  var evs = day.events, along = day.along, busy = day.busy;
  var bd = buildDay(evs, along, busy);
  var plan = bd.plan;
  var lines = {};
  Object.keys(bd.lines).forEach(function (id) { lines[id] = { drop: cardLine(bd.lines[id].drop), pick: cardLine(bd.lines[id].pick) }; });
  var outings = {};
  ['mom', 'dad'].forEach(function (d) {
    outings[d] = bd.outings[d].map(function (o) {
      return { start: o.s, end: o.en, lead: o.lead, lines: o.lines, kids: o.kids, warn: o.warn, target: o.target ? o.target.id : null };
    });
  });
  var issueTexts = plan.hard.concat(plan.soft).map(function (x) {
    var t = P.issueText(x);
    return { key: P.issueKey(x), title: t.title, body: t.body, note: t.note || null };
  });
  return {
    expected: expected(evs, along, busy, plan, bd.clashes),
    score: plan.score,
    issue_texts: issueTexts,
    rides: bd.rideList.map(function (r) { return { kid: r.kid, driver: r.d, start: r.s, end: r.en, own: r.own, legs: r.legs.length }; }),
    outings: outings,
    lines: lines
  };
}

function readStdin() {
  return require('fs').readFileSync(0, 'utf8');
}

var cmd = process.argv[2];
if (cmd === 'scenarios') process.stdout.write(JSON.stringify(scenarios(), null, 2));
else if (cmd === 'board') process.stdout.write(JSON.stringify(JSON.parse(readStdin()).map(board)));
else {
  process.stderr.write('usage: cli.js scenarios | cli.js board < days.json\n');
  process.exit(2);
}
