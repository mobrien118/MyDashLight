// Rides planner: reference implementation, taken from the ride board mockup
// (https://claude.ai/artifact/Squf3yRDBPopx8jZTkohN1, "Option B" artboard, 2026-10-27).
// Port this to Python for the HA integration and check the port against scenarios.json.
//
// Times are minutes after midnight on the event's day. Drivers: 'mom' (Robin), 'dad' (Sam).
// Any other drop/pick value is a free-form carpool name; '' means unassigned, 'none' means not needed.
// The example data, place names and travel table below stand in for the Google calendars
// and the Routes API.
'use strict';

var K = {
  ava: { name: 'Ava', color: '#12877A', rgb: '18,135,122', ink: '#0B5E55' },
  ben: { name: 'Ben', color: '#2D5FC4', rgb: '45,95,196', ink: '#1E4594' },
  cleo: { name: 'Cleo', color: '#B83E8A', rgb: '184,62,138', ink: '#8A2A66' }
};
var PLACES = { home: 'Home', piano: 'Piano studio', soccer: 'Soccer fields', football: 'Football field', gym: 'Middle school gym', church: 'Church', party: 'Noah’s house', dance: 'Dance studio', nextdoor: 'Next door' };
var SHORT = { home: 'Home', piano: 'Piano', soccer: 'Soccer', football: 'Football', gym: 'Gym', church: 'Church', party: 'Noah’s', dance: 'Dance', nextdoor: 'Next door' };
var DRIVE = { 'home|piano': 10, 'home|soccer': 15, 'home|football': 20, 'home|gym': 8, 'piano|soccer': 12, 'piano|football': 18, 'piano|gym': 10, 'soccer|football': 10, 'soccer|gym': 14, 'football|gym': 16, 'home|church': 12, 'home|party': 9, 'home|dance': 11, 'dance|football': 14, 'dance|soccer': 9 };
// Drivers the planner routes. Anyone else is a free-form name ("Jordan", "the Parkers").
var PEOPLE = { mom: 'Robin', dad: 'Sam' };
var KNOWN_DRIVERS = ['the Lees', 'the Parkers', 'Jordan'];
var DAYS = [
  { label: 'Thursday, October 29', short: 'Thu', tag: 'Today' },
  { label: 'Friday, October 30', short: 'Fri', tag: 'Tomorrow' },
  { label: 'Saturday, October 31', short: 'Sat', tag: '' },
  { label: 'Sunday, November 1', short: 'Sun', tag: '' },
  { label: 'Monday, November 2', short: 'Mon', tag: '' },
  { label: 'Tuesday, November 3', short: 'Tue', tag: '' },
  { label: 'Wednesday, November 4', short: 'Wed', tag: '' }
];
// Each parent's own calendar, by day.
var BUSY_BY_DAY = [
  { dad: [{ start: 780, end: 1000, title: 'Work' }] },
  { dad: [{ start: 540, end: 960, title: 'Work' }] },
  {},
  {},
  { dad: [{ start: 540, end: 1020, title: 'Work' }] },
  { dad: [{ start: 540, end: 1020, title: 'Work' }] },
  { dad: [{ start: 540, end: 1020, title: 'Work' }] }
];
var NOW = 970;
var INITIAL = [
  { id: 'piano', day: 0, kid: 'ava', title: 'Piano', loc: 'piano', start: 945, end: 990, drop: 'mom', pick: 'mom', stay: true, arriveBy: null },
  { id: 'soccer', day: 0, kid: 'cleo', title: 'Soccer', loc: 'soccer', start: 1020, end: 1110, drop: 'dad', pick: 'mom', stay: false, arriveBy: null },
  { id: 'football', day: 0, kid: 'ben', title: 'Football', loc: 'football', start: 1050, end: 1140, drop: 'dad', pick: 'dad', stay: false, arriveBy: 1035 },
  { id: 'volley', day: 0, kid: 'ava', title: 'Volleyball', loc: 'gym', start: 1095, end: 1200, drop: 'the Lees', pick: '', stay: false, arriveBy: null },
  { id: 'fri-soccer', day: 1, kid: 'cleo', title: 'Soccer practice', loc: 'soccer', start: 1020, end: 1080, drop: 'mom', pick: 'mom', stay: false, arriveBy: null },
  { id: 'fri-party', day: 1, kid: 'ben', title: 'Birthday party', loc: 'party', start: 1080, end: 1230, drop: 'dad', pick: 'dad', stay: false, arriveBy: null },
  { id: 'fri-sit', day: 1, kid: 'ava', title: 'Babysitting', loc: 'nextdoor', start: 1110, end: 1290, drop: 'none', pick: 'none', stay: false, arriveBy: null },
  { id: 'sat-tourney', day: 2, kid: 'ava', title: 'Volleyball tournament', loc: 'gym', start: 480, end: 900, drop: 'the Parkers', pick: 'dad', stay: false, arriveBy: 465 },
  { id: 'sat-soccer', day: 2, kid: 'cleo', title: 'Soccer game', loc: 'soccer', start: 540, end: 615, drop: 'dad', pick: 'dad', stay: true, arriveBy: 525 },
  { id: 'sat-football', day: 2, kid: 'ben', title: 'Football game', loc: 'football', start: 660, end: 780, drop: 'mom', pick: 'mom', stay: true, arriveBy: 640 },
  { id: 'sun-youth', day: 3, kid: 'ava', title: 'Youth group', loc: 'church', start: 1080, end: 1170, drop: 'mom', pick: '', stay: false, arriveBy: null },
  { id: 'mon-piano', day: 4, kid: 'ava', title: 'Piano', loc: 'piano', start: 945, end: 990, drop: 'mom', pick: 'mom', stay: true, arriveBy: null },
  { id: 'mon-football', day: 4, kid: 'ben', title: 'Football', loc: 'football', start: 1050, end: 1140, drop: 'dad', pick: 'dad', stay: false, arriveBy: null },
  { id: 'tue-soccer', day: 5, kid: 'cleo', title: 'Soccer', loc: 'soccer', start: 1020, end: 1110, drop: 'mom', pick: 'dad', stay: false, arriveBy: null },
  { id: 'tue-volley', day: 5, kid: 'ava', title: 'Volleyball', loc: 'gym', start: 1095, end: 1200, drop: 'Jordan', pick: 'mom', stay: false, arriveBy: null },
  { id: 'wed-dance', day: 6, kid: 'cleo', title: 'Dance', loc: 'dance', start: 960, end: 1020, drop: 'mom', pick: 'mom', stay: false, arriveBy: null },
  { id: 'wed-football', day: 6, kid: 'ben', title: 'Football', loc: 'football', start: 1050, end: 1140, drop: 'dad', pick: 'dad', stay: false, arriveBy: null }
];
var isDriver = function (v) { return v === 'mom' || v === 'dad'; };
// When the driver aims to have the kid there: the Arrive by time if one is set, otherwise a few minutes before the start.
var arriveAt = function (e) { return e.arriveBy != null ? e.arriveBy : e.start - 5; };

function travel(a, b) {
  if (a === b) return 0;
  var v = DRIVE[a + '|' + b];
  if (v == null) v = DRIVE[b + '|' + a];
  return v == null ? 15 : v;
}
function fmt(m) {
  m = Math.round(m);
  var h = Math.floor(m / 60), mm = m % 60;
  return (((h + 11) % 12) + 1) + ':' + (mm < 10 ? '0' : '') + mm;
}

// One parent's day: string their drop-offs and pick-ups into a route and time it.
function planDriver(d, events, along, busy) {
  var tasks = [];
  events.forEach(function (e) {
    if (e.stay && e.drop === d && e.pick === d) tasks.push({ type: 'stay', e: e, t: arriveAt(e) });
    else {
      if (e.drop === d) tasks.push({ type: 'drop', e: e, t: arriveAt(e) });
      if (e.pick === d) tasks.push({ type: 'pick', e: e, t: e.end });
    }
  });
  tasks.sort(function (a, b) { return a.t - b.t; });
  var out = { d: d, segs: [], stops: [], issues: [], soft: [], overlaps: [], drive: 0, leave: null, trips: 0 };
  if (!tasks.length) return out;

  var stops = [{ loc: 'home', kind: 'start', car: [] }];
  var car = [];
  var cur = function () { return stops[stops.length - 1]; };
  tasks.forEach(function (k, i) {
    var kid = k.e.kid;
    if (k.type !== 'pick') {
      if (car.indexOf(kid) < 0) {
        if (cur().loc !== 'home') stops.push({ loc: 'home', kind: 'fetch', car: [] });
        car = [kid];
        if (along) tasks.slice(i + 1).forEach(function (o) {
          if (o.type !== 'pick' && o.t - k.t <= 45 && car.indexOf(o.e.kid) < 0) car.push(o.e.kid);
        });
        cur().car = car.slice();
      }
      car = car.filter(function (x) { return x !== kid; });
      var s = { loc: k.e.loc, kind: k.type, deadline: k.t, e: k.e };
      if (k.type === 'stay') { s.after = k.e.end; car.push(kid); }
      s.car = car.slice();
      stops.push(s);
    } else {
      car.push(kid);
      stops.push({ loc: k.e.loc, kind: 'pick', ready: k.e.end, e: k.e, car: car.slice() });
    }
  });
  if (cur().loc !== 'home') stops.push({ loc: 'home', kind: 'end', car: [] });

  // Backward pass: the latest arrival and departure at each stop that still make every deadline.
  var n = stops.length;
  var LA = stops.map(function (s) { return s.deadline != null ? s.deadline : Infinity; });
  var LD = stops.map(function () { return Infinity; });
  for (var i = n - 1; i >= 1; i--) {
    LD[i - 1] = Math.min(LD[i - 1], LA[i] - travel(stops[i - 1].loc, stops[i].loc));
    LA[i - 1] = Math.min(LA[i - 1], LD[i - 1]);
  }
  var target = function (j) {
    var v = LD[j], nx = stops[j + 1];
    if (nx && nx.ready != null) v = Math.min(v, nx.ready - travel(stops[j].loc, nx.loc));
    return v;
  };

  // Forward pass: leave each place as late as still works.
  var t = target(0);
  if (!isFinite(t)) t = (stops[1].ready != null ? stops[1].ready : 0) - travel('home', stops[1].loc);
  out.leave = t;
  // Each bit of driving or waiting is tied to the drop-off or pick-up it serves.
  var evAt = function (q, dir) { for (; q >= 0 && q < n; q += dir) if (stops[q].e) return stops[q]; return null; };
  var tag = function (g, st) { if (st) { g.anchor = st; (st.legs = st.legs || []).push(g); } out.segs.push(g); };
  var from = 'home', carNow = stops[0].car, droppedHome = [];
  for (var j = 1; j < n; j++) {
    var s2 = stops[j];
    var tr = travel(from, s2.loc);
    var arr = t + tr;
    if (tr > 0) {
      tag({ type: 'drive', from: from, to: s2.loc, start: t, end: arr, kids: carNow, fromHome: from === 'home' },
        s2.e ? s2 : (s2.kind === 'fetch' ? evAt(j + 1, 1) : evAt(j - 1, -1)));
      out.drive += tr;
      if (from === 'home') out.trips++;
    }
    s2.arr = arr;
    if (s2.deadline != null && arr > s2.deadline) out.issues.push({ kind: 'late', d: d, s: s2, e: s2.e, min: arr - s2.deadline });
    if (s2.kind === 'pick' && arr > s2.ready + 5) out.issues.push({ kind: 'waiting', d: d, s: s2, e: s2.e, min: arr - s2.ready });
    if (s2.kind === 'drop' && s2.deadline - arr > 15) out.soft.push({ kind: 'early', d: d, s: s2, e: s2.e, min: s2.e.start - arr });
    var ready = arr;
    if (s2.ready != null) ready = Math.max(ready, s2.ready);
    if (s2.after != null) ready = Math.max(ready, s2.after);
    if (s2.kind !== 'stay' && ready > arr) {
      if (s2.loc === 'home') out.segs.push({ type: 'home', start: arr, end: ready });
      else tag({ type: 'wait', loc: s2.loc, start: arr, end: ready, kids: carNow }, s2.e ? s2 : evAt(j + 1, 1));
    }
    var dep = ready;
    if (j < n - 1) {
      var tg = target(j);
      if (isFinite(tg)) {
        if ((s2.kind === 'stay' || s2.kind === 'pick') && tg - ready >= 0 && tg - ready < 3 && isFinite(LD[j])) out.soft.push({ kind: 'tight', d: d, s: s2, e: s2.e, at: ready });
        dep = Math.max(ready, tg);
      }
    }
    if (s2.kind === 'stay' && ready > arr) tag({ type: 'stay', loc: s2.loc, start: arr, end: ready, e: s2.e, kids: s2.car.filter(function (k) { return k !== s2.e.kid && droppedHome.indexOf(k) < 0; }) }, s2);
    if (s2.kind === 'fetch') droppedHome = [];
    carNow = s2.car.filter(function (k) { return droppedHome.indexOf(k) < 0; });
    from = s2.loc;
    var idle = dep - ready;
    if (idle > 0) {
      var nx = stops[j + 1];
      var back = travel(s2.loc, 'home'), out2 = nx ? travel('home', nx.loc) : 0, direct = nx ? travel(s2.loc, nx.loc) : 0;
      if (s2.loc !== 'home' && nx && idle + direct - back - out2 >= 15) {
        tag({ type: 'drive', from: s2.loc, to: 'home', start: ready, end: ready + back, kids: carNow, fromHome: false }, s2.e ? s2 : evAt(j - 1, -1));
        out.drive += back;
        var leaveHome = dep + direct - out2;
        out.segs.push({ type: 'home', start: ready + back, end: leaveHome });
        droppedHome = droppedHome.concat(carNow);
        t = leaveHome; from = 'home'; carNow = [];
        continue;
      }
      if (s2.loc === 'home') out.segs.push({ type: 'home', start: ready, end: dep });
      else tag({ type: 'wait', loc: s2.loc, start: ready, end: dep, kids: carNow }, evAt(j + 1, 1));
    }
    t = dep;
  }
  out.stops = stops;

  // The parent's own calendar: being on the road during a busy block is a conflict.
  (busy[d] || []).forEach(function (b) {
    var first = null;
    out.segs.forEach(function (g) {
      if (g.type === 'home' || g.start >= b.end || g.end <= b.start) return;
      out.overlaps.push({ start: Math.max(g.start, b.start), end: Math.min(g.end, b.end) });
      if (!first) first = g;
    });
    if (first) {
      first.bad = true;
      var nextStop = stops.filter(function (s) { return s.e && s.arr != null && s.arr >= first.end; })[0];
      out.issues.push({ kind: 'busy', d: d, b: b, seg: first, e: nextStop ? nextStop.e : null, min: Math.min(first.end, b.end) - Math.max(first.start, b.start) });
    } else if (out.leave - b.end >= 0 && out.leave - b.end < 3) {
      out.soft.push({ kind: 'tightBusy', d: d, b: b });
    }
  });
  return out;
}

function planAll(events, along, busy) {
  var mom = planDriver('mom', events, along.mom, busy), dad = planDriver('dad', events, along.dad, busy);
  var hard = mom.issues.concat(dad.issues);
  events.forEach(function (e) {
    if (e.drop === '') hard.push({ kind: 'unassigned', e: e, end: 'drop' });
    if (e.pick === '') hard.push({ kind: 'unassigned', e: e, end: 'pick' });
  });
  var soft = mom.soft.concat(dad.soft);
  var mins = hard.reduce(function (a, x) { return a + (x.min || 0); }, 0);
  return { mom: mom, dad: dad, hard: hard, soft: soft, score: hard.length * 1000 + mins * 10 + mom.drive + dad.drive };
}

function issueKey(x) {
  return [x.kind, x.d || '', x.e ? x.e.id : '', x.end || '', x.b ? x.b.title : ''].join('|');
}

function issueText(x) {
  var e = x.e, kid = e ? K[e.kid].name : '';
  var who = x.d ? PEOPLE[x.d] : '';
  if (x.kind === 'busy') return { title: who + ' is still at ' + x.b.title, body: 'Leaving at ' + fmt(x.seg.start) + (e ? ' for ' + kid + '’s ' + e.title.toLowerCase() : '') + ' overlaps ' + x.b.title + ' until ' + fmt(x.b.end) + '.' };
  if (x.kind === 'late') return { title: kid + ' will be late to ' + e.title, body: who + ' gets there at ' + fmt(x.s.arr) + ', ' + x.min + ' min after ' + (e.arriveBy != null ? 'the ' + fmt(e.arriveBy) + ' arrive-by time.' : 'the ' + fmt(x.s.deadline) + ' target.') };
  if (x.kind === 'waiting') return { title: kid + ' will be waiting', body: who + ' reaches ' + e.title + ' at ' + fmt(x.s.arr) + ', ' + x.min + ' min after it ends.' };
  if (x.kind === 'unassigned') return { title: 'No ' + (x.end === 'drop' ? 'drop-off' : 'pick-up') + ' for ' + kid, body: e.title + (x.end === 'drop' ? ' starts at ' + fmt(e.start) : ' ends at ' + fmt(e.end)) + ', ' + PLACES[e.loc] + '.' };
  if (x.kind === 'early') return { title: kid + ' waits ' + x.min + ' min', body: who + ' gets ' + kid + ' to ' + e.title + ' at ' + fmt(x.s.arr) + ', well before the ' + fmt(e.start) + ' start.', note: kid + ' waits ' + x.min + ' min at ' + e.title };
  if (x.kind === 'tight') return { title: 'No time to spare', body: who + ' has to leave ' + e.title + ' right at ' + fmt(x.at) + ' to make the next stop.', note: who + ' leaves ' + e.title + ' right at ' + fmt(x.at) };
  if (x.kind === 'tightBusy') return { title: 'No time to spare', body: who + ' has to leave right when ' + x.b.title + ' ends at ' + fmt(x.b.end) + '.', note: who + ' leaves right as ' + x.b.title + ' ends' };
  return { title: '', body: '' };
}

function applyChange(events, along, c) {
  var ev = events.map(function (e) {
    if (!c.id || e.id !== c.id) return e;
    var n = Object.assign({}, e);
    if (c.field) n[c.field] = c.value;
    if (c.arriveBy !== undefined) n.arriveBy = c.arriveBy;
    if (c.stay != null) n.stay = c.stay;
    if (n.drop !== n.pick || (n.drop !== 'mom' && n.drop !== 'dad')) n.stay = false;
    return n;
  });
  var al = Object.assign({}, along);
  if (c.along) al[c.along] = !al[c.along];
  return { events: ev, along: al };
}

// Fixes worth offering: single changes that clear this problem without adding a worse one.
function suggestionsFor(issue, events, along, base, busy) {
  var cands = [];
  if (issue.kind === 'unassigned') {
    ['mom', 'dad'].forEach(function (p) {
      cands.push({ label: PEOPLE[p] + (issue.end === 'drop' ? ' drops off' : ' picks up'), change: { id: issue.e.id, field: issue.end, value: p }, who: p });
    });
  } else if (issue.d) {
    var d = issue.d, o = d === 'mom' ? 'dad' : 'mom';
    events.forEach(function (e) {
      ['drop', 'pick'].forEach(function (f) {
        if (e[f] === d) cands.push({ label: PEOPLE[o] + ' does ' + K[e.kid].name + '’s ' + (f === 'drop' ? 'drop-off' : 'pick-up'), change: { id: e.id, field: f, value: o }, who: o });
      });
    });
    if (!along[d]) cands.push({ label: null, change: { along: d }, who: d });
  }
  var baseSoft = base.soft.map(issueKey);
  var key = issueKey(issue);
  var good = [];
  cands.forEach(function (c) {
    var next = applyChange(events, along, c.change);
    var p = planAll(next.events, next.along, busy);
    var keys = p.hard.map(issueKey);
    if (keys.indexOf(key) >= 0 || p.hard.length >= base.hard.length) return;
    if (c.label === null) {
      var multi = p[c.who].segs.filter(function (g) { return g.type === 'drive' && g.kids.length > 1; })[0];
      if (!multi) return;
      c.label = 'Take ' + multi.kids.slice(1).map(function (k) { return K[k].name; }).join(' and ') + ' along';
    }
    var extra = p.soft.filter(function (x) { return baseSoft.indexOf(issueKey(x)) < 0; });
    var delta = p[c.who].drive - base[c.who].drive;
    c.note = extra.length ? issueText(extra[0]).note : (delta > 0 ? '+' + delta + ' min of driving for ' + PEOPLE[c.who] : delta < 0 ? (-delta) + ' min less driving for ' + PEOPLE[c.who] : 'No new problems');
    c.score = p.score;
    good.push(c);
  });
  good.sort(function (a, b) { return a.score - b.score; });
  return good.slice(0, 2);
}

// Calendar-style packing: overlapping activities in one lane sit side by side.
function pack(items) {
  items.sort(function (a, b) { return a.s - b.s || b.en - a.en; });
  var cluster = [], colsEnd = [], clusterEnd = -Infinity;
  var flush = function () { var c = colsEnd.length; cluster.forEach(function (it) { it.cols = c; }); cluster = []; colsEnd = []; };
  items.forEach(function (it) {
    if (it.s >= clusterEnd) { flush(); clusterEnd = -Infinity; }
    var c = -1;
    for (var i = 0; i < colsEnd.length; i++) if (colsEnd[i] <= it.s) { c = i; break; }
    if (c < 0) { c = colsEnd.length; colsEnd.push(it.en); } else colsEnd[c] = it.en;
    it.col = c; cluster.push(it); clusterEnd = Math.max(clusterEnd, it.en);
  });
  flush();
}

function cloneEvents() { return INITIAL.map(function (e) { return Object.assign({}, e); }); }

// Two ways to read the week. Timeline keeps true spacing within each day.
// Compact has no time scale: everything in order, and a column only skips down to stay in order with the others.
var PPM = 3, PAD = 12, DAYHEAD = 36, GAP = 8;
var KIDS = ['ava', 'ben', 'cleo'];
var COLS = ['ava', 'ben', 'cleo', 'mom', 'dad'];

function dur(m) {
  var h = Math.floor(m / 60), mm = Math.round(m % 60);
  return (h ? h + ' hr' + (mm ? ' ' : '') : '') + (mm ? mm + ' min' : (h ? '' : '0 min'));
}
function whoName(v) { return isDriver(v) ? PEOPLE[v] : v; }

// Piecewise-linear map between absolute time (day * 1440 + minutes) and y, both directions.
function anchorMap(a) {
  var Y = function (t) {
    if (!a.length) return 0;
    if (t <= a[0].t) return a[0].y;
    for (var i = 0; i < a.length - 1; i++) if (t <= a[i + 1].t) return a[i + 1].t === a[i].t ? a[i].y : Math.round(a[i].y + (t - a[i].t) / (a[i + 1].t - a[i].t) * (a[i + 1].y - a[i].y));
    return a[a.length - 1].y;
  };
  var T = function (y) {
    if (!a.length) return 0;
    if (y <= a[0].y) return a[0].t;
    for (var i = 0; i < a.length - 1; i++) if (y <= a[i + 1].y) return a[i + 1].y === a[i].y ? a[i].t : a[i].t + (y - a[i].y) / (a[i + 1].y - a[i].y) * (a[i + 1].t - a[i].t);
    return a[a.length - 1].t;
  };
  return { Y: Y, T: T };
}

// Everything about one day that doesn't depend on the view: who's in which car, clashes, outings, ride lines.
function buildDay(i, evs, along) {
  var busy = BUSY_BY_DAY[i] || {};
  var plan = planAll(evs, along, busy);

  // Back-to-back legs in the same car are one ride, split where a kid stops riding along
  // for someone else's stop and starts heading to their own (or the other way round).
  var rideList = [];
  ['mom', 'dad'].forEach(function (d) {
    plan[d].segs.forEach(function (g) {
      if (g.type === 'home') return;
      (g.kids || []).forEach(function (k) {
        var prev = null;
        rideList.forEach(function (r) { if (r.kid === k && r.d === d && r.en === g.start) prev = r; });
        var own = g.anchor && g.anchor.e ? g.anchor.e.kid === k : (prev ? prev.own : true);
        if (prev && prev.own === own) { prev.en = g.end; prev.legs.push(g); }
        else rideList.push({ kid: k, d: d, s: g.start, en: g.end, legs: [g], own: own });
      });
    });
  });

  // Kid items: activities plus time in a car. A late arrival is trimmed at the start time: that's lateness, not a clash.
  var kidItems = {};
  KIDS.forEach(function (k) { kidItems[k] = []; });
  evs.forEach(function (e) { kidItems[e.kid].push({ type: 'act', e: e, s: e.start, en: e.end }); });
  rideList.forEach(function (r) {
    var s = r.s, en = r.en;
    r.legs.forEach(function (g) {
      var e = g.anchor && g.anchor.e;
      if (!e || e.kid !== r.kid) return;
      if (r.s < e.start && en > e.start) en = e.start;
      if (r.en > e.end && s < e.end) s = e.end;
    });
    if (en > s) kidItems[r.kid].push({ type: 'ride', r: r, s: s, en: en });
  });

  var clashes = [];
  KIDS.forEach(function (kid) {
    var it = kidItems[kid];
    for (var a = 0; a < it.length; a++) for (var b = a + 1; b < it.length; b++) {
      var x = it[a], y = it[b];
      if (x.s < y.en && y.s < x.en && (x.type === 'act' || y.type === 'act')) { x.clash = y.clash = true; clashes.push({ kid: kid, a: x.type === 'act' ? x : y, b: x.type === 'act' ? y : x }); }
    }
  });
  // One warning per clash: a car ride during an activity that already clashes with another adds nothing new.
  clashes = clashes.filter(function (c) {
    return c.b.type === 'act' || !clashes.some(function (o) { return o.b.type === 'act' && (o.a === c.a || o.b === c.a); });
  });

  // A driver's day as outings: leave home, every stop, back home.
  var outings = {}, drv = {};
  ['mom', 'dad'].forEach(function (d) {
    var p = plan[d], list = [], cur = null, tl = [], tcur = null;
    p.segs.forEach(function (g) {
      if (g.type === 'home') { cur = null; tcur = null; return; }
      if (cur && cur.en === g.start) { cur.en = g.end; cur.legs.push(g); }
      else { cur = { s: g.start, en: g.end, legs: [g] }; list.push(cur); }
      // Timeline draws a stay as its own box, so it breaks the trip there.
      if (g.type === 'stay') { tcur = null; tl.push({ type: 'stay', g: g, s: g.start, en: g.end }); return; }
      if (tcur && tcur.en === g.start) { tcur.en = g.end; tcur.legs.push(g); }
      else { tcur = { type: 'trip', s: g.start, en: g.end, legs: [g] }; tl.push(tcur); }
    });
    list.forEach(function (o) {
      var lines = [], kids = [];
      o.legs.forEach(function (g) { (g.kids || []).forEach(function (x) { if (kids.indexOf(x) < 0) kids.push(x); }); });
      p.stops.forEach(function (s, idx) {
        if (idx === 0 || s.arr == null || s.arr < o.s || s.arr > o.en) return;
        var at = fmt(s.arr), place = SHORT[s.loc], k = s.e ? K[s.e.kid].name : '';
        if (s.kind === 'drop') lines.push(at + '  ' + place + ', drop off ' + k);
        else if (s.kind === 'stay') lines.push(at + '  ' + place + ', stay with ' + k);
        else if (s.kind === 'pick') lines.push(fmt(Math.max(s.arr, s.ready)) + '  ' + place + ', pick up ' + k);
        else if (s.kind === 'fetch') lines.push(at + '  Home, get ' + s.car.map(function (x) { return K[x].name; }).join(' and '));
        else if (s.kind === 'end') lines.push(at + '  Home');
        if (s.kind === 'stay' && s.after != null && s.after < o.en) lines.push(fmt(s.after) + '  Leave ' + place);
      });
      var last = o.legs[o.legs.length - 1];
      if (last.type === 'drive' && last.to === 'home' && lines[lines.length - 1] !== fmt(o.en) + '  Home') lines.push(fmt(o.en) + '  Home');
      var warn = '';
      (busy[d] || []).forEach(function (b) { if (b.start < o.en && b.end > o.s) warn = 'Still at ' + b.title + ' until ' + fmt(b.end); });
      var first = o.legs[0];
      o.lead = first.type === 'drive' && first.from === 'home' ? 'Leave ' + fmt(o.s) : 'From ' + SHORT[first.from || first.loc] + ' ' + fmt(o.s);
      o.lines = lines; o.kids = kids; o.warn = warn;
      o.target = null;
      o.legs.forEach(function (g) { if (!o.target && g.anchor && g.anchor.e) o.target = g.anchor.e; });
    });
    outings[d] = list;
    drv[d] = tl;
  });

  // What each activity's card says about getting there and home.
  var lines = {};
  evs.forEach(function (e) {
    var there = null, back = null;
    rideList.forEach(function (r) {
      if (r.kid !== e.kid || !r.own) return;
      if (!r.legs.some(function (g) { return g.anchor && g.anchor.e && g.anchor.e.id === e.id; })) return;
      if (r.s < e.start) there = r; else back = r;
    });
    var line = function (f, r) {
      var v = e[f];
      if (v === 'none') return null;
      if (v === '') return { text: f === 'drop' ? 'No ride there yet' : 'No ride home yet', ink: '#8A5A00' };
      if (!isDriver(v)) return { text: (f === 'drop' ? 'Goes with ' : 'Home with ') + v, ink: '#3D434B' };
      var extra = '';
      plan.hard.forEach(function (x) {
        if (!x.e || x.e.id !== e.id || x.d !== v) return;
        if (f === 'drop' && x.kind === 'late') extra = ', ' + x.min + ' min late';
        if (f === 'pick' && x.kind === 'waiting') extra = ', waits ' + x.min + ' min';
      });
      var ink = extra ? '#B42318' : '#3D434B';
      if (!r) return { text: (f === 'drop' ? 'Drop-off: ' : 'Pick-up: ') + PEOPLE[v] + extra, ink: ink };
      if (f === 'drop') {
        var fromHome = r.legs[0].type === 'drive' && r.legs[0].from === 'home';
        if (e.stay) return { text: PEOPLE[v] + ' stays · leaves ' + fmt(r.s) + extra, ink: ink };
        return { text: (fromHome ? 'Leaves ' + fmt(r.s) + ' with ' : 'With ') + PEOPLE[v] + extra, ink: ink };
      }
      var last = r.legs[r.legs.length - 1];
      return { text: (last.type === 'drive' && last.to === 'home' ? 'Home ' + fmt(r.en) + ' with ' : 'Picked up ' + fmt(r.s) + ' by ') + PEOPLE[v] + extra, ink: ink };
    };
    if (e.drop === 'none' && e.pick === 'none') { lines[e.id] = { drop: { text: 'No ride needed', ink: '#6B717A' }, pick: null }; return; }
    lines[e.id] = { drop: line('drop', there), pick: e.stay && isDriver(e.drop) ? (back ? line('pick', back) : null) : line('pick', back) };
  });

  var lo = Infinity, hi = -Infinity;
  evs.forEach(function (e) { lo = Math.min(lo, e.start - 20); hi = Math.max(hi, e.end + 20); });
  ['mom', 'dad'].forEach(function (d) { outings[d].forEach(function (o) { lo = Math.min(lo, o.s); hi = Math.max(hi, o.en); }); });
  var r0 = isFinite(lo) ? Math.floor((lo - 5) / 30) * 30 : 900, r1 = isFinite(hi) ? Math.ceil((hi + 5) / 30) * 30 : 960;
  return { i: i, evs: evs, busy: busy, plan: plan, rideList: rideList, kidItems: kidItems, clashes: clashes, outings: outings, drv: drv, lines: lines, r0: r0, r1: r1 };
}


module.exports = { K, PLACES, SHORT, DRIVE, PEOPLE, DAYS, BUSY_BY_DAY, NOW, INITIAL, travel, fmt, arriveAt, isDriver,
  planDriver, planAll, issueKey, issueText, applyChange, suggestionsFor, pack, cloneEvents, buildDay };
