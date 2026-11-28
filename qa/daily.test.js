/* Tests for the daily review (docs/COLLECTION.md, "Daily review"): game/daily.js, the award entry points
   VGCollection.onDailyDone and finishDaily (one step across tabs) in game/collection/core.js, and meta.daily in game/save-store.js.
   Plain Node, no dependencies. Usage: node qa/daily.test.js
   The date is always injected (VGDaily.setClock / window.VG_DAILY_NOW); no test reads the real clock.
   The card itself is driven through a very small stand-in for the DOM, with the real Foundations pack loaded,
   so the problems, the number reading and the check are the ones the player gets. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');
const read = f => fs.readFileSync(path.join(game, f), 'utf8');
const SRC = { store: read('save-store.js'), registry: read('realms/registry.js'), ach: read('collection/achievements.js'), core: read('collection/core.js'), daily: read('daily.js') };
const V2 = 'vector-guild-save-v2';
const plain = o => JSON.parse(JSON.stringify(o));
const packsWindow = {}; vm.runInNewContext(read('realms/packs.js'), { window: packsWindow });
const PACKS = packsWindow.VG_PACKS, SHARED = packsWindow.VG_REALM_SHARED;

let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const slice = (solved, more = {}) => ({ solved, xp: 0, points: 0, tools: [], clean: [], revealed: [], landmarks: [], contracts: [], reviews: {}, errors: {}, rolls: {}, ...more });
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
/* Noon on a local calendar date; the day number the game uses for it. */
const at = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

/* A page without a document: the save, the collection core and daily.js (logic only), over a shared storage Map. */
function page(storage = new Map(), extra = {}) {
  const ls = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const window = { localStorage: ls, VG_SEED: 1, VG_FIGURES: [], ...extra };
  const ctx = { window, Math, JSON };
  for (const k of ['store', 'registry', 'ach', 'core', 'daily']) vm.runInNewContext(SRC[k], ctx);
  return { C: window.VGCollection, S: window.VGSave, D: window.VGDaily, L: window.VGDaily.logic, window, storage };
}
const DAY0 = page().L.dayOf(at(2026, 11, 21));

test('the day is the local calendar day, and the date source can be injected', () => {
  const { D, L } = page();
  assert.equal(L.dayOf(at(2026, 11, 21, 0, 1)), L.dayOf(at(2026, 11, 21, 23, 59)), 'one calendar day is one day number');
  assert.equal(L.dayOf(at(2026, 11, 22, 0, 1)) - L.dayOf(at(2026, 11, 21, 23, 59)), 1, 'midnight starts the next day');
  assert.equal(L.dayOf(at(2027, 1, 1)) - L.dayOf(at(2026, 12, 31)), 1); assert.equal(L.dayOf(at(2026, 3, 1)) - L.dayOf(at(2026, 2, 28)), 1);
  D.setClock(() => at(2026, 11, 25)); assert.equal(D.today(), DAY0 + 4);
  D.setClock(null);
  const viaWindow = page(new Map(), { VG_DAILY_NOW: () => at(2026, 11, 30) }); assert.equal(viaWindow.D.today(), DAY0 + 9);
});

test('daily.js loads where there is no document, as qa/harness.js loads it', () => {
  const window = {}; vm.runInNewContext(SRC.daily, { window, Math });
  assert.equal(typeof window.VGDaily.logic.pick, 'function'); assert.equal(typeof window.VGDaily.mount, 'function');
  window.VGDaily.mount(null); window.VGDaily.refresh();
});

test('one finished review pays 15 stardust once per day: not on reload, in a second tab, or when asked again', () => {
  const storage = new Map(), a = page(storage); a.S.load();
  assert.deepEqual(plain(a.C.DAILY), { dust: 15, problems: 3, unlock: 3, restEvery: 7, milestones: [[3, 20], [7, 40], [14, 80], [30, 150]] });
  const first = plain(a.C.onDailyDone(DAY0));
  assert.deepEqual(first, [{ type: 'daily', day: DAY0, streak: 1, dust: 15 }]);
  assert.equal(a.C.dust(), 15); assert.equal(a.C.earned(), 15);
  assert.deepEqual(plain(a.C.onDailyDone(DAY0)), [], 'the same day again');
  const reloaded = page(storage); reloaded.S.load(); assert.deepEqual(plain(reloaded.C.onDailyDone(DAY0)), [], 'after a reload');
  const tab = page(storage); assert.deepEqual(plain(tab.C.onDailyDone(DAY0)), [], 'a second tab'); assert.equal(tab.C.dust(), 15);
  assert.deepEqual(plain(a.S.meta().daily), { day: DAY0, streak: 1, best: 1, paid: [], seen: {} });
  for (const bad of [undefined, null, -1, 1.5, '5', NaN]) assert.deepEqual(plain(a.C.onDailyDone(bad)), [], 'not a day: ' + bad);
  assert.equal(a.C.dust(), 15);
});

test('two tabs finishing at the same moment: the save pays once and only one tab reports it', () => {
  /* Tab B has read the save (day not paid) when tab A reads, pays and writes. B must not write its older copy. */
  const storage = new Map(), a = page(storage), b = page(storage); a.S.load();
  a.C.onDrillDone(); const start = a.C.dust();
  const realMeta = b.S.meta; let reads = 0, fromA = null, drillA = null;
  b.S.meta = () => { const m = realMeta(); if (reads++ === 0) { fromA = plain(a.C.onDailyDone(DAY0)); drillA = a.C.onDrillDone(); } return m; };
  const fromB = plain(b.C.onDailyDone(DAY0));
  assert.deepEqual(fromA, [{ type: 'daily', day: DAY0, streak: 1, dust: 15 }]);
  assert.deepEqual(fromB, [], 'the second tab reports nothing');
  assert.equal(a.C.dust(), start + 15 + drillA[0].dust, 'paid once, and the other tab\'s later change is still there');
  assert.equal(a.S.meta().drills, 2); assert.equal(a.S.meta().daily.streak, 1);
  /* A save that keeps changing cannot make it spin: it gives up and pays nothing. */
  const c = page(new Map()); c.S.load(); const metaC = c.S.meta; let n = 0;
  c.S.meta = () => { const m = metaC(); m.pulls = ++n; return m; };
  assert.deepEqual(plain(c.C.onDailyDone(DAY0)), []); assert.ok(n <= 12, 'a bounded number of tries');

  /* finishDaily: the same step under the browser's cross-tab lock. Nothing is paid or reported before the lock is held. */
  const shared = new Map(), queue = [], timers = [];
  const locks = { request(name, fn) { assert.equal(name, 'mathcosmos-save'); queue.push(fn); return new Promise(() => {}); } };
  const tab = () => { const p = page(shared, { navigator: { locks }, setTimeout: fn => { timers.push(fn); } }); p.got = []; return p; };
  const one = tab(), two = tab(); one.S.load();
  one.C.finishDaily(DAY0, e => one.got.push(plain(e))); two.C.finishDaily(DAY0, e => two.got.push(plain(e)));
  assert.deepEqual([one.got, two.got], [[], []]); assert.equal(one.C.dust(), 0);
  queue.shift()(); queue.shift()();   /* the browser gives the lock to one tab, then the other */
  assert.deepEqual(one.got, [[{ type: 'daily', day: DAY0, streak: 1, dust: 15 }]]); assert.deepEqual(two.got, [[]], 'the other tab is told nothing was paid');
  assert.equal(two.C.dust(), 15);
  timers.splice(0).forEach(fn => fn()); assert.equal(one.got.length, 1, 'reported once'); assert.equal(two.got.length, 1);
  /* The lock never comes: after a moment the step runs anyway, once. No locks at all (file://): at once. */
  const late = tab(); late.C.finishDaily(DAY0 + 1, e => late.got.push(plain(e)));
  assert.equal(late.got.length, 0); timers.splice(0).forEach(fn => fn()); assert.equal(late.got[0][0].streak, 2); queue.splice(0).forEach(fn => fn()); assert.equal(late.got.length, 1);
  const bare = page(shared); let now = null; bare.C.finishDaily(DAY0 + 2, e => { now = plain(e); }); assert.equal(now[0].type, 'daily');
  const broken = page(shared, { navigator: { locks: { request() { throw new Error('no'); } } }, setTimeout() {} }); now = null;
  broken.C.finishDaily(DAY0 + 3, e => { now = plain(e); }); assert.equal(now[0].streak, 4);
  assert.equal(bare.C.dust(), 15 * 4 + 20);
});

test('the streak grows one day at a time, and its milestones at 3, 7, 14 and 30 days pay 20, 40, 80 and 150 once each', () => {
  const { C, S } = page(); S.load();
  const bonus = {}; let total = 0;
  for (let i = 0; i < 31; i++) {
    const events = plain(C.onDailyDone(DAY0 + i)); assert.equal(events[0].type, 'daily'); assert.equal(events[0].streak, i + 1);
    for (const e of events) { total += e.dust; if (e.type === 'streak') bonus[e.days] = e.dust; }
  }
  assert.deepEqual(bonus, { 3: 20, 7: 40, 14: 80, 30: 150 });
  assert.equal(total, 31 * 15 + 290); assert.equal(C.dust(), total);
  assert.deepEqual(plain(S.meta().daily), { day: DAY0 + 30, streak: 31, best: 31, paid: [3, 7, 14, 30], seen: {} });
});

test('one missed day is a rest day: the streak carries on over it, at most once in seven days', () => {
  const { C, S, L } = page(); S.load();
  for (let i = 0; i < 3; i++) C.onDailyDone(DAY0 + i);
  assert.equal(C.dust(), 3 * 15 + 20);
  /* Day DAY0+3 is missed: on DAY0+4 the streak is resting, not lost. */
  const rest = L.status(S.meta().daily, DAY0 + 4, 10);
  assert.equal(rest.state, 'ready'); assert.equal(rest.streak, 3); assert.equal(rest.resting, true); assert.equal(rest.lapsed, false);
  assert.equal(C.dust(), 65, 'looking at the card changes nothing'); assert.equal('rests' in S.meta().daily, false);
  assert.deepEqual(plain(C.onDailyDone(DAY0 + 4)), [{ type: 'daily', day: DAY0 + 4, streak: 4, dust: 15 }]);
  assert.deepEqual(plain(S.meta().daily.rests), [DAY0 + 3], 'the rest day is remembered');
  assert.equal(L.status(S.meta().daily, DAY0 + 5, 10).resting, false, 'a normal next day is not a rest');
  /* A second missed day within seven days of the first one is not forgiven. */
  C.onDailyDone(DAY0 + 5);
  const again = L.status(S.meta().daily, DAY0 + 7, 10);
  assert.equal(again.streak, 0); assert.equal(again.lapsed, true); assert.equal(again.resting, false); assert.equal(again.best, 5);
  assert.deepEqual(plain(C.onDailyDone(DAY0 + 7)), [{ type: 'daily', day: DAY0 + 7, streak: 1, dust: 15 }]);
  assert.equal(S.meta().daily.best, 5, 'the best streak stands');
  /* Seven days after the first rest, a rest is free again: DAY0+10 is the missed day, 7 days after DAY0+3. */
  C.onDailyDone(DAY0 + 8); C.onDailyDone(DAY0 + 9);
  assert.equal(L.status(S.meta().daily, DAY0 + 11, 10).resting, true);
  assert.equal(plain(C.onDailyDone(DAY0 + 11))[0].streak, 4);
  assert.deepEqual(plain(S.meta().daily.rests), [DAY0 + 3, DAY0 + 10]);
  /* Two missed days in a row start a new streak; nothing is taken away, and a milestone is never paid twice. */
  const dust = C.dust();
  assert.equal(L.status(S.meta().daily, DAY0 + 14, 10).lapsed, true);
  C.onDailyDone(DAY0 + 14); C.onDailyDone(DAY0 + 15);
  assert.deepEqual(plain(C.onDailyDone(DAY0 + 16)), [{ type: 'daily', day: DAY0 + 16, streak: 3, dust: 15 }], 'the 3-day bonus was already paid');
  assert.equal(C.dust(), dust + 45); assert.deepEqual(plain(S.meta().daily.paid), [3]);
});

test('the rest rule in daily.js and in the collection agree', () => {
  const { C, L } = page();
  const rng = mulberry(11);
  for (let i = 0; i < 400; i++) {
    const last = DAY0 + Math.floor(rng() * 30), d = { day: last, streak: 1 + Math.floor(rng() * 9), rests: Array.from({ length: Math.floor(rng() * 3) }, () => last - Math.floor(rng() * 12)) };
    const day = last + 1 + Math.floor(rng() * 3);
    assert.deepEqual(plain(L.streakOn(d, day)), plain(C.streakOn(d, day)), JSON.stringify([d, day]));
  }
  assert.deepEqual(plain(L.streakOn(null, DAY0)), { streak: 1, rest: null });
  /* The missed day is DAY0+1: a rest six days before it is too close, seven days before is fine. */
  assert.deepEqual(plain(L.streakOn({ day: DAY0, streak: 4, rests: [DAY0 - 5] }, DAY0 + 2)), { streak: 1, rest: null }, 'a rest six days before');
  assert.deepEqual(plain(L.streakOn({ day: DAY0, streak: 4, rests: [DAY0 - 5, 'x'] }, DAY0 + 2)), { streak: 1, rest: null });
  assert.deepEqual(plain(L.streakOn({ day: DAY0, streak: 4, rests: [DAY0 - 6] }, DAY0 + 2)), { streak: 5, rest: DAY0 + 1 }, 'a rest seven days before');
  assert.deepEqual(plain(L.streakOn({ day: DAY0, streak: 4 }, DAY0 + 3)), { streak: 1, rest: null }, 'two missed days');
});

test('days played this week: Monday to Sunday, from solves, drills, daily reviews and runs', () => {
  const { C, S, L, D } = page(); S.load();
  /* 2026-11-23 is a Monday. */
  const mon = L.dayOf(at(2026, 11, 23));
  const w = L.week([mon - 1, mon, mon + 2, mon + 5], null, mon + 2);
  assert.deepEqual(plain(w.days.map(x => x.name.slice(0, 3))), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  assert.deepEqual(plain(w.days.map(x => x.played)), [true, false, true, false, false, false, false], 'a later day never counts, nor last Sunday');
  assert.equal(w.count, 2); assert.equal(w.days[2].today, true); assert.equal(w.days[3].later, true);
  assert.equal(L.week([], { day: mon + 6 }, mon + 6).count, 1, 'an older save counts its last daily review');
  assert.equal(L.week('junk', null, mon).count, 0);
  for (let k = 0; k < 7; k++) assert.equal(L.week([], null, mon + k).days[0].day, mon, 'every day of the week starts on its Monday');
  /* The collection records the days: a drill today, a daily review, and only the last 14 days are kept. */
  D.setClock(() => at(2026, 11, 25));
  C.onDrillDone(); assert.deepEqual(plain(S.meta().played), [mon + 2]);
  C.onDrillDone(); assert.deepEqual(plain(S.meta().played), [mon + 2], 'once per day');
  C.onDailyDone(mon + 3); assert.deepEqual(plain(S.meta().played), [mon + 2, mon + 3]);
  const m = { played: [mon - 30, mon - 13, 'x'] }; C.markPlayed(m, mon); assert.deepEqual(plain(m.played), [mon - 13, mon]);
  /* A clock set back: Friday was played, then the date goes back to Thursday and a drill is done. Friday is kept, and the
     week shows it again once the clock is back on Friday. The 14 days are counted from the newest day stored. */
  const back = { played: [mon + 4] }; C.markPlayed(back, mon + 3); assert.deepEqual(plain(back.played), [mon + 3, mon + 4], 'a later day is kept');
  assert.equal(L.week(back.played, null, mon + 3).count, 1, 'the week never shows a day after today');
  assert.equal(L.week(back.played, null, mon + 3).days[4].played, false);
  assert.equal(L.week(back.played, null, mon + 4).count, 2, 'and shows it again when that day comes');
  const far = { played: [mon - 30, mon, mon + 40] }; C.markPlayed(far, mon + 1); assert.deepEqual(plain(far.played), [mon + 40], 'pruned against the newest day');
  D.setClock(() => at(2026, 11, 28)); S.putMeta(Object.assign(S.meta(), { played: [mon + 5] }));
  D.setClock(() => at(2026, 11, 27)); C.onDrillDone(); assert.deepEqual(plain(S.meta().played).slice(-2), [mon + 4, mon + 5], 'a drill on an earlier date keeps the later day');
  D.setClock(null);
});

test('setting the device clock back never pays twice', () => {
  const { C, S, L } = page(); S.load();
  C.onDailyDone(DAY0); C.onDailyDone(DAY0 + 1);
  for (const earlier of [DAY0 + 1, DAY0, DAY0 - 1, DAY0 - 400, 0]) assert.deepEqual(plain(C.onDailyDone(earlier)), [], 'day ' + earlier);
  assert.equal(C.dust(), 30); assert.deepEqual(plain(S.meta().daily), { day: DAY0 + 1, streak: 2, best: 2, paid: [], seen: {} });
  assert.equal(L.status(S.meta().daily, DAY0, 10).state, 'clock'); assert.equal(L.status(S.meta().daily, DAY0 + 1, 10).state, 'done');
  /* The clock goes forward again: the streak carries on from the last paid day. */
  assert.equal(plain(C.onDailyDone(DAY0 + 2))[0].streak, 3);
});

test('status: locked under three solves, ready, in progress, done, and the next milestone', () => {
  const { L } = page();
  const none = L.status(undefined, DAY0, 2);
  assert.equal(none.state, 'locked'); assert.equal(none.need, 1); assert.equal(none.streak, 0); assert.equal(none.lapsed, false);
  assert.equal(L.status(null, DAY0, 0).need, 3);
  const ready = L.status(null, DAY0, 3); assert.equal(ready.state, 'ready'); assert.deepEqual(plain(ready.next), { days: 3, dust: 20, left: 3 });
  const going = L.status({ day: DAY0 - 1, streak: 5, best: 9, paid: [3], at: { day: DAY0, n: 2 } }, DAY0, 12);
  assert.equal(going.state, 'ready'); assert.equal(going.streak, 5); assert.equal(going.best, 9); assert.equal(going.progress, 2); assert.equal(going.lapsed, false);
  assert.deepEqual(plain(going.next), { days: 7, dust: 40, left: 2 });
  assert.equal(L.status({ day: DAY0 - 1, streak: 5, best: 9, paid: [3], at: { day: DAY0 - 1, n: 2 } }, DAY0, 12).progress, 0, 'yesterday\'s unfinished review does not count today');
  const done = L.status({ day: DAY0, streak: 30, best: 30, paid: [3, 7, 14, 30] }, DAY0, 1);
  assert.equal(done.state, 'done', 'done wins over locked'); assert.equal(done.next, null);
});

test('old saves load unchanged, and export and import carry the daily state without a second payment', () => {
  /* A 2.1 save: a collection with no daily review. */
  const old = { v: 2, seed: 7, intro: true, realms: { la: slice(ids(4)) }, meta: { v: 1, dust: 40, earned: 40, owned: {}, equipped: null, ach: [], pulls: 0, sinceRare: 0, sinceLegend: 0, paid: { la: { solved: ids(4), clean: [], chapters: [] } }, drills: 0, looks: {} } };
  const storage = new Map([[V2, JSON.stringify(old)]]), a = page(storage);
  assert.deepEqual(plain(a.S.load()), old); assert.equal('daily' in a.S.meta(), false, 'no daily field is added by loading');
  /* A 2.0 save has no collection at all, and a 1.x save migrates: neither gains one. */
  const two = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, intro: false, realms: {} })]])); two.S.load(); assert.equal('meta' in two.S.exportAll(), false);
  const one = page(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01'], tools: [], xp: 100 })]])); one.S.load(); assert.equal('meta' in one.S.exportAll(), false);
  a.C.settle(); const settled = a.C.dust();   /* what the save already earns elsewhere (achievements for the four solves) */
  a.C.onDailyDone(DAY0); a.C.onDailyDone(DAY0 + 1);
  const backup = plain(a.S.exportAll()), dust = settled + 30;
  assert.deepEqual(backup.meta.daily, { day: DAY0 + 1, streak: 2, best: 2, paid: [], seen: {} }); assert.equal(backup.meta.dust, dust);
  /* Restored on another device, and restored again over itself: today is already paid there too. */
  const b = page(); b.S.load(); assert.equal(b.S.importAny(backup).ok, true);
  assert.deepEqual(plain(b.S.meta().daily), backup.meta.daily); assert.deepEqual(plain(b.C.onDailyDone(DAY0 + 1)), []); assert.equal(b.C.dust(), dust);
  assert.equal(a.S.importAny(backup).ok, true); assert.deepEqual(plain(a.C.onDailyDone(DAY0 + 1)), []); assert.equal(a.C.dust(), dust);
  assert.equal(plain(a.C.onDailyDone(DAY0 + 2))[0].streak, 3, 'the streak goes on after a restore');
  /* A 1.x backup and a realm reset leave the daily state alone; a full reset clears it. */
  assert.equal(a.S.importAny({ solved: ['q01'], tools: [] }).ok, true); a.S.reset('la'); assert.equal(a.S.meta().daily.day, DAY0 + 2);
  a.S.resetAll(); assert.equal('daily' in a.S.meta(), false);
});

test('a damaged daily record is made safe', () => {
  const junk = { day: DAY0, streak: -4, best: 'x', paid: [7, 7, 3, 0, -1, 'a', 2.5], at: { day: DAY0 - 3, n: 2 }, seen: { 'la:q01': DAY0, 'la:q02': -1, 'found:q03': 'x' }, later: 1 };
  Object.defineProperty(junk.seen, '__proto__', { value: 5, enumerable: true });
  const a = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: {}, meta: { dust: 5, daily: junk } })]]));
  assert.deepEqual(plain(a.S.meta().daily), { day: DAY0, streak: 1, best: 1, paid: [3, 7], seen: { 'la:q01': DAY0 }, later: 1 });
  for (const bad of ['x', 5, [], null]) { const p = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: {}, meta: { dust: 5, daily: bad } })]])); assert.equal('daily' in p.S.meta(), false); assert.equal(p.S.meta().dust, 5); }
  const noDay = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: {}, meta: { daily: { day: 'soon', streak: 9, best: 4, at: { day: DAY0, n: 1 } } } })]]));
  assert.deepEqual(plain(noDay.S.meta().daily), { day: null, streak: 0, best: 4, paid: [], seen: {}, at: { day: DAY0, n: 1 } });
  assert.equal(plain(noDay.C.onDailyDone(DAY0))[0].streak, 1); assert.equal('at' in noDay.S.meta().daily, false, 'a finished day drops its progress mark');
});

test('typed numbers are read as in a review drill', () => {
  const { L } = page();
  assert.equal(L.parseNumber('1,5'), 1.5); assert.equal(L.parseNumber('7/6'), 7 / 6); assert.equal(L.parseNumber('−3/4'), -0.75); assert.equal(L.parseNumber('1 1/2'), 1.5);
  assert.equal(L.parseNumber('−12'), -12); assert.ok(Number.isNaN(L.parseNumber(''))); assert.ok(Number.isNaN(L.parseNumber('two'))); assert.ok(Number.isNaN(L.parseNumber('1/0')));
  assert.equal(L.readNumber('1,432', x => x === 1432), 1432); assert.equal(L.readNumber('1,432', x => Math.abs(x - 1.432) < 1e-9), 1.432);
  /* The same source text as app.js, so the two cannot drift apart unnoticed. */
  const app = read('app.js'), body = s => s.replace(/\s+/g, '');
  assert.ok(app.includes("const GROUPED=/^[-+]?\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?$/;") && SRC.daily.includes("var GROUPED = /^[-+]?\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?$/;"));
  assert.ok(body(app).includes("/^([-+]?)(?:(\\d+))?(\\d+)?\\/?(\\d+)$/") && body(SRC.daily).includes("/^([-+]?)(?:(\\d+))?(\\d+)?\\/?(\\d+)$/"), 'the fraction pattern is the one app.js uses');
});

test('the pool: one entry per solved concept with a problem model; practice missions count for their concept', () => {
  const { L } = page();
  const quests = { q01: { id: 'q01', title: 'Place value', topic: 'Place value' }, q02: { id: 'q02', title: 'Adding', topic: 'Addition' }, q02b: { id: 'q02b', parent: 'q02', title: 'Adding again' }, q03: { id: 'q03', title: 'No model' } };
  const lib = { has: id => id === 'q01' || id === 'q02' || id === 'q09', quest: id => quests[id] || null };
  const now = at(2026, 11, 21).getTime(), DAYMS = 86400000;
  const s = slice(['q02b', 'q01', 'q02', 'q03', 'q09c', 'q01', 7], { reviews: { q01: { n: 2, last: now - 10 * DAYMS }, q02: { n: 0, last: now - 2 * DAYMS } }, errors: { q02: { n: 3, last: now - 2 * DAYMS, pit: {} }, q01: { n: 1, last: now - 20 * DAYMS, pit: {} } } });
  const pool = L.pool('found', s, lib, { seen: { 'found:q01': DAY0 - 4, 'la:q02': DAY0 } }, DAY0);
  assert.deepEqual(plain(pool), [
    { realm: 'found', id: 'q02', key: 'found:q02', title: 'Adding', topic: 'Addition', stale: 2, misses: 3 },
    { realm: 'found', id: 'q01', key: 'found:q01', title: 'Place value', topic: 'Place value', stale: 4, misses: 0 },
    { realm: 'found', id: 'q09', key: 'found:q09', title: 'Q09', topic: '', stale: 60, misses: 0 }]);
  assert.equal(L.conceptId('q12d'), 'q12'); assert.equal(L.conceptId('q12'), 'q12');
  assert.equal(L.weight(pool[0]), 1 + 2 + 30 + 15); assert.equal(L.weight(pool[1]), 5); assert.equal(L.weight(pool[2]), 61);
  assert.deepEqual(plain(L.pool('found', slice([]), lib, null, DAY0)), []); assert.deepEqual(plain(L.pool('found', { solved: 'x' }, lib, null, DAY0)), []);
});

test('the draw: three different concepts, weighted to the least recently practised and to notebook misses', () => {
  const { L } = page();
  const entry = (id, stale, misses = 0) => ({ realm: 'found', id, key: 'found:' + id, title: id, topic: id, stale, misses });
  const list = [entry('fresh1', 0), entry('fresh2', 0), entry('fresh3', 1), entry('old', 45), entry('missed', 1, 2), entry('fresh4', 0), entry('fresh5', 2)];
  const rng = mulberry(7), seen = {}; let runs = 2000;
  for (let i = 0; i < runs; i++) {
    const got = L.pick(list, 3, rng); assert.equal(got.length, 3); assert.equal(new Set(got.map(e => e.id)).size, 3, 'no concept twice');
    for (const e of got) seen[e.id] = (seen[e.id] || 0) + 1;
  }
  assert.ok(seen.old > 0.85 * runs && seen.missed > 0.85 * runs, 'the stale concept and the missed concept are nearly always asked: ' + JSON.stringify(seen));
  assert.ok(seen.fresh1 < 0.35 * runs && seen.fresh1 > 0, 'a concept practised today is asked rarely, but can be');
  /* Fewer than three concepts: they come round again. None: nothing. A bad random source cannot break it. */
  assert.deepEqual(Array.from(L.pick(list.slice(0, 2), 3, () => 0), e => e.id), ['fresh1', 'fresh2', 'fresh1']);
  assert.deepEqual(Array.from(L.pick(list.slice(0, 1), 3, () => 0.99), e => e.id), ['fresh1', 'fresh1', 'fresh1']);
  assert.equal(L.pick([], 3, rng).length, 0); assert.equal(L.pick(list, 3, () => NaN).length, 3); assert.equal(L.pick(list, 3, () => 1).length, 3);
  assert.equal(list.length, 7, 'the list given is not changed');
});

test('the reward line names what was paid', () => {
  const { L } = page();
  assert.equal(L.rewardLine([{ type: 'daily', dust: 15 }]), '+15 stardust · daily review done');
  assert.equal(L.rewardLine([{ type: 'daily', dust: 15 }, { type: 'streak', days: 7, dust: 40 }]), '+55 stardust · daily review done, 7-day streak');
  assert.equal(L.rewardLine([]), ''); assert.equal(L.rewardLine(null), '');
});

/* ---------- the card, on a realm page with the real Foundations pack ---------- */
function node(tag) {
  const n = { tagName: String(tag).toUpperCase(), children: [], parentNode: null, attrs: {}, listeners: {}, className: '', hidden: false, value: '', disabled: false, _text: '',
    classList: { add(c) { if (!n.className.split(' ').includes(c)) n.className = (n.className + ' ' + c).trim(); } },
    setAttribute(k, v) { n.attrs[k] = String(v); }, getAttribute(k) { return k in n.attrs ? n.attrs[k] : null; },
    appendChild(c) { if (c.parentNode) c.parentNode.children.splice(c.parentNode.children.indexOf(c), 1); c.parentNode = n; n.children.push(c); return c; },
    insertBefore(c, ref) { c.parentNode = n; const i = ref ? n.children.indexOf(ref) : -1; if (i < 0) n.children.push(c); else n.children.splice(i, 0, c); return c; },
    contains(c) { for (let x = c; x; x = x.parentNode) if (x === n) return true; return false; },
    addEventListener(type, fn) { (n.listeners[type] = n.listeners[type] || []).push(fn); },
    click() { if (!n.disabled) (n.listeners.click || []).forEach(fn => fn({ preventDefault() {} })); }, focus() { n.focused = true; } };
  Object.defineProperty(n, 'textContent', { get() { return n._text + n.children.map(c => c.textContent).join(''); }, set(v) { n.children.forEach(c => { c.parentNode = null; }); n.children = []; n._text = String(v); } });
  return n;
}
const all = (n, test, out = []) => { if (test(n)) out.push(n); n.children.forEach(c => all(c, test, out)); return out; };
const byClass = (n, cls) => all(n, x => x.className.split(' ').includes(cls));
/* A realm page for the Foundations pack: every shared and pack script except the two that need a real browser. */
function realmPage(storage, clock) {
  const ls = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const toasts = [], body = node('body');
  const document = { createElement: node, createTextNode: t => { const n = node('#text'); n._text = String(t); return n; }, getElementById: () => null, addEventListener() {}, hidden: false, body };
  const window = { localStorage: ls, VG_SEED: 1, VG_FIGURES: [], VG_PACK_ID: 'found', VG_DAILY_NOW: clock, addEventListener() {}, VGCollectionUI: { toast: t => { toasts.push(t); return true; } } };
  const ctx = { window, document, Math, JSON, setTimeout };
  vm.runInNewContext(SRC.store, ctx);
  for (const file of [...SHARED.before, ...PACKS.found.scripts, ...SHARED.after]) { if (file === 'collection/ui.js' || file === 'handson.js') continue; vm.runInNewContext(read(file), ctx); }
  return { window, D: window.VGDaily, C: window.VGCollection, S: window.VGSave, V: window.Variants, toasts, host: node('div') };
}
const foundSave = (solved, meta) => new Map([[V2, JSON.stringify({ v: 2, seed: 1, intro: true, realms: { found: slice(solved) }, ...(meta ? { meta } : {}) })]]);

test('the pack is wired in: daily.js and daily.css on the home page and on every realm page', () => {
  assert.ok(SHARED.after.includes('daily.js') && SHARED.after.indexOf('daily.js') > SHARED.after.indexOf('collection/ui.js'), 'realm pages: after the collection interface, before app.js');
  assert.ok(SHARED.styles.includes('daily.css'));
  const index = read('index.html'), scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  assert.equal(scripts.filter(f => f === 'daily.js').length, 1); assert.equal((index.match(/href="daily\.css"/g) || []).length, 1);
  assert.ok(scripts.indexOf('daily.js') > scripts.indexOf('collection/ui.js') && scripts.indexOf('daily.js') < scripts.indexOf('shell/home.js'), 'home page: after the collection, before home.js');
  const home = read('shell/home.js');
  assert.match(home, /root\.VGDaily\.mount\(S\.daily,\{scope:'home',heading:'h2'\}\)/); assert.match(home, /root\.VGDaily\.refresh\(\)/);
  assert.ok(!/\bfetch\(|\bimport\s|type="module"|\bexport\s/.test(SRC.daily), 'a classic script: no modules, no network');
  assert.ok(!/localStorage|sessionStorage/.test(SRC.daily), 'all state goes through VGSave');
});

test('the card: locked until three missions are solved in this realm', () => {
  const p = realmPage(foundSave(['q01', 'q02']), () => at(2026, 11, 21));
  p.D.mount(p.host, { scope: 'realm', heading: 'h3' });
  const card = byClass(p.host, 'vgd')[0];
  assert.equal(card.attrs['data-state'], 'locked'); assert.equal(byClass(p.host, 'vgd-btn').length, 0);
  assert.match(p.host.textContent, /Daily review/); assert.match(p.host.textContent, /unlocks after three solved missions in this realm/); assert.match(p.host.textContent, /Solve 1 more mission to unlock it\./);
  assert.equal(byClass(p.host, 'vgd-title')[0].tagName, 'H3');
});

test('the card: three problems answered in place, 15 stardust once, then done for the day', () => {
  const storage = foundSave(ids(6));
  let nowIs = at(2026, 11, 21, 9);
  const p = realmPage(storage, () => nowIs);
  p.D.mount(p.host, { scope: 'realm', heading: 'h3' });
  assert.equal(byClass(p.host, 'vgd')[0].attrs['data-state'], 'ready'); assert.match(p.host.textContent, /Finish all three for 15 stardust\./); assert.match(p.host.textContent, /Day streak: 0/);
  p.C.settle();   /* as app.js does on load: pays the six solves and their achievements, so only the review is counted below */
  const dustBefore = p.C.dust();
  /* Each problem is the realm's own review-drill model: read the wanted value by making the same variant check. */
  const answer = () => {
    const input = byClass(p.host, 'vgd-input')[0], label = byClass(p.host, 'vgd-label')[0]; assert.ok(input && label, 'an answer field with a label');
    assert.equal(label.htmlFor, input.id); assert.equal(input.attrs.inputmode, 'decimal');
    return { input, check: byClass(p.host, 'vgd-btn')[0], feedback: byClass(p.host, 'vgd-feedback')[0] };
  };
  const made = []; const realMake = p.V.make; p.V.make = id => { const v = realMake(id); made.push(v); return v; };
  byClass(p.host, 'vgd-btn')[0].click();
  assert.match(p.host.textContent, /Problem 1 of 3 · Foundations · /);
  /* Problem 1: nothing typed, then a miss, then new numbers and a pass. */
  let a = answer(); a.check.click(); assert.equal(a.feedback.textContent, 'Enter a number first.');
  a.input.value = String(made[0].target + 1000); a.check.click();
  assert.match(a.feedback.textContent, /^Not quite: .* Try it once more with new numbers\.$/); assert.equal(a.feedback.attrs['data-ok'], 'no'); assert.equal(a.check.disabled, true);
  byClass(p.host, 'vgd-btn').find(b => b.textContent === 'Try new numbers').click();
  assert.equal(made.length, 2); assert.equal(made[1].id, made[0].id, 'the same concept'); assert.notEqual(made[1].t, made[0].t, 'with new numbers');
  a = answer(); a.input.value = String(made[1].target).replace('-', '−'); a.check.click();
  assert.match(a.feedback.textContent, /^Correct\. /); assert.equal(a.feedback.attrs['data-ok'], 'yes');
  assert.equal(p.C.dust(), dustBefore, 'nothing is paid before all three are done');
  byClass(p.host, 'vgd-btn').find(b => b.textContent === 'Next problem').click();
  assert.deepEqual(plain(p.S.meta().daily.at), { day: DAY0, n: 1 }, 'progress is kept for a reload');
  /* A reload in the middle: the card offers to continue, from problem 2. */
  const again = realmPage(storage, () => nowIs); again.D.mount(again.host, { scope: 'realm' });
  assert.equal(byClass(again.host, 'vgd-btn')[0].textContent, 'Continue: 1 of 3 done');
  /* Problem 2: missed twice. It moves on kindly and still counts as done. */
  assert.match(p.host.textContent, /Problem 2 of 3/);
  a = answer(); a.input.value = String(made[2].target + 1000); a.check.click();
  byClass(p.host, 'vgd-btn').find(b => b.textContent === 'Try new numbers').click();
  a = answer(); a.input.value = String(made[3].target + 1000); a.check.click();
  assert.match(a.feedback.textContent, /That is fine\. This one will come back another day\.$/);
  byClass(p.host, 'vgd-btn').find(b => b.textContent === 'Next problem').click();
  /* Problem 3: passed first time. */
  assert.match(p.host.textContent, /Problem 3 of 3/);
  a = answer(); a.input.value = String(made[4].target); a.check.click();
  byClass(p.host, 'vgd-btn').find(b => b.textContent === 'Finish').click();
  assert.equal(new Set([made[0].id, made[2].id, made[4].id]).size, 3, 'three different concepts');
  assert.equal(p.C.dust(), dustBefore + 15); assert.deepEqual(p.toasts, ['+15 stardust · daily review done']);
  assert.match(p.host.textContent, /All three done\. \+15 stardust\./); assert.match(p.host.textContent, /Day streak: 1\./);
  const daily = plain(p.S.meta().daily);
  assert.equal(daily.day, DAY0); assert.equal(daily.streak, 1); assert.equal('at' in daily, false);
  assert.deepEqual(Object.keys(daily.seen).sort(), ['found:' + made[0].id, 'found:' + made[4].id].sort(), 'the missed concept is not marked as practised');
  /* The realm's own slice was not touched. */
  assert.deepEqual(plain(p.S.realm('found')), plain(slice(ids(6))));
  /* Later the same day, here and on a fresh page: done, no button, nothing more paid. */
  nowIs = at(2026, 11, 21, 23, 50); p.D.refresh();
  assert.equal(byClass(p.host, 'vgd')[0].attrs['data-state'], 'done'); assert.equal(byClass(p.host, 'vgd-btn').length, 0); assert.match(p.host.textContent, /Done for today\./);
  again.D.refresh(); assert.equal(byClass(again.host, 'vgd')[0].attrs['data-state'], 'done');
  assert.equal(p.C.dust(), dustBefore + 15);
  /* The next morning there is a new review, and the streak is still alive. */
  nowIs = at(2026, 11, 22, 7); p.D.refresh();
  assert.equal(byClass(p.host, 'vgd')[0].attrs['data-state'], 'ready'); assert.match(p.host.textContent, /Day streak: 1/); assert.equal(byClass(p.host, 'vgd-btn')[0].textContent, 'Start today’s review');
  /* One missed day: the streak is resting, and the card says so without blame. */
  nowIs = at(2026, 11, 23, 7); p.D.refresh();
  assert.match(p.host.textContent, /Day streak: 1/); assert.match(p.host.textContent, /Yesterday was a rest day, and your streak of 1 day is still here\./);
  /* Three days on: a new streak, and the card says nothing was taken away. */
  nowIs = at(2026, 11, 25, 7); p.D.refresh();
  assert.match(p.host.textContent, /Day streak: 0 · best 1/); assert.match(p.host.textContent, /Welcome back\. A new streak starts today\. Your stardust is safe/);
  assert.doesNotMatch(p.host.textContent, /missed|lost|broke|fail/i, 'no blame');
  assert.equal(byClass(p.host, 'vgd-dot').length, 0, 'the week dots are on the home page only');
  /* The home card shows the week as seven dots, with the count in words. */
  const home = realmPage(storage, () => nowIs); home.D.mount(home.host, { scope: 'home' });
  /* Wednesday 25 November: the last review was on Saturday the 21st, last week. */
  assert.equal(byClass(home.host, 'vgd-dot').length, 7); assert.match(home.host.textContent, /Days played this week: 0 of 7\. Any solved mission counts\./);
  nowIs = at(2026, 11, 26, 7); home.D.refresh();
  const m = home.S.meta(); m.played = [home.D.logic.dayOf(at(2026, 11, 23)), home.D.logic.dayOf(at(2026, 11, 25))]; home.S.putMeta(m); home.D.refresh();
  assert.match(home.host.textContent, /Days played this week: 2 of 7$|Days played this week: 2 of 7[^.]/);
  /* The clock set back before the last review: no review, no payment. */
  nowIs = at(2026, 11, 19, 7); p.D.refresh();
  assert.equal(byClass(p.host, 'vgd')[0].attrs['data-state'], 'clock'); assert.equal(byClass(p.host, 'vgd-btn').length, 0); assert.equal(p.C.dust(), dustBefore + 15);
});

test('the card: a review finished in another tab first is not paid again here', () => {
  const storage = foundSave(ids(5)), clock = () => at(2026, 11, 21);
  const p = realmPage(storage, clock), other = realmPage(storage, clock);
  p.D.mount(p.host, { scope: 'realm' });
  const made = []; const realMake = p.V.make; p.V.make = id => { const v = realMake(id); made.push(v); return v; };
  byClass(p.host, 'vgd-btn')[0].click();
  other.C.settle(); assert.equal(other.C.onDailyDone(DAY0).length, 1); const dust = other.C.dust();
  for (let i = 0; i < 3; i++) {
    byClass(p.host, 'vgd-input')[0].value = String(made[made.length - 1].target); byClass(p.host, 'vgd-btn')[0].click();
    byClass(p.host, 'vgd-btn').find(b => /Next problem|Finish/.test(b.textContent)).click();
  }
  assert.equal(p.C.dust(), dust); assert.deepEqual(p.toasts, []); assert.match(p.host.textContent, /Today’s stardust was already paid/);
});

test('the card: the reward is shown only once the save holds it, and a second press on Finish does nothing', () => {
  const storage = foundSave(ids(5)), p = realmPage(storage, () => at(2026, 11, 21)), queue = [];
  p.window.navigator = { locks: { request(name, fn) { queue.push(fn); return new Promise(() => {}); } } }; p.window.setTimeout = () => {};
  p.C.settle(); const dust = p.C.dust();
  p.D.mount(p.host, { scope: 'realm' });
  const made = []; const realMake = p.V.make; p.V.make = id => { const v = realMake(id); made.push(v); return v; };
  byClass(p.host, 'vgd-btn')[0].click();
  let finish = null;
  for (let i = 0; i < 3; i++) {
    byClass(p.host, 'vgd-input')[0].value = String(made[made.length - 1].target); byClass(p.host, 'vgd-btn')[0].click();
    finish = byClass(p.host, 'vgd-btn').find(b => /Next problem|Finish/.test(b.textContent)); finish.click();
  }
  finish.click(); finish.click();
  assert.equal(queue.length, 1, 'one request for the save, however often Finish is pressed');
  assert.equal(p.C.dust(), dust); assert.deepEqual(p.toasts, []); assert.ok(!/All three done/.test(p.host.textContent), 'nothing is claimed while the save is not written');
  queue[0]();
  assert.equal(p.C.dust(), dust + 15); assert.deepEqual(p.toasts, ['+15 stardust · daily review done']); assert.match(p.host.textContent, /All three done\. \+15 stardust\./);
  queue[0](); assert.equal(p.C.dust(), dust + 15); assert.equal(p.toasts.length, 1);
});

/* Every pack in game/realms/packs.js (qa/pack-list.js) once all its declared learn missions are written. */
test('every solved concept of every written pack gives a problem the check accepts', () => {
  for (const realm of require('./pack-list.js').ids()) {
    const window = { VG_SEED: 0 }, ctx = { window, Math, JSON };
    for (const file of PACKS[realm].scripts) { if (file === 'handson.js') continue; vm.runInNewContext(read(file), ctx); }
    if (Array.isArray(window.REALM.chapters) && !window.REALM.chapters.every(c => c.ids.every(id => window.QUESTS.some(q => q.id === id)))) { console.log(`NOTE: ${realm} is left out until all its learn missions are written.`); continue; }
    vm.runInNewContext(SRC.daily, ctx);
    const L = window.VGDaily.logic, V = window.Variants, by = new Map(window.QUESTS.map(q => [q.id, q]));
    const lib = { has: id => V.has(id), quest: id => by.get(id) || null };
    const solved = window.QUESTS.map(q => q.id), learn = window.QUESTS.filter(q => !q.parent);
    const pool = L.pool(realm, slice(solved), lib, null, DAY0);
    assert.equal(pool.length, learn.filter(q => V.has(q.id)).length, realm + ': one entry per concept with a model'); assert.ok(pool.length >= 40, realm + ': ' + pool.length + ' concepts');
    assert.ok(pool.every(e => e.title && e.topic && !/[a-z]$/.test(e.id)), 'titles and topics come from the learn mission');
    for (const e of pool) { const v = V.make(e.id); assert.ok(v && Number.isFinite(v.target) && v.prompt && v.label, realm + ' ' + e.id); assert.equal(V.check(v, v.target), true); assert.equal(V.check(v, v.target + 1000), false); }
  }
});

test('daily.css: readable text, large controls, no one-sided accent border, reduced motion honoured', () => {
  const css = read('daily.css').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/font-size:(\d+(?:\.\d+)?)px/g)) assert.ok(Number(m[1]) >= 12, 'font-size ' + m[1]);
  for (const sel of ['.vgd-btn', '.vgd-input']) { const rule = css.match(new RegExp(sel.replace('.', '\\.') + '\\{([^}]*)\\}')); assert.ok(rule, sel); assert.ok(Number(rule[1].match(/min-height:(\d+)px/)[1]) >= 44, sel + ' is at least 44px tall'); }
  assert.ok(!/border-(left|right|top|bottom)(-width)?:/.test(css), 'no one-sided borders'); assert.ok(!/background-clip:text|text-fill-color/.test(css), 'no gradient text');
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\.vgd-btn:active\{transform:none\}\}/);
  assert.ok(!/animation|transition/.test(css), 'nothing moves by itself');
  assert.ok(!/width:\d{3,}px/.test(css.replace(/max-width:\d+px/g, '')), 'no fixed width that could overflow a 375px screen');
});

console.log(`PASS: ${count} daily review tests.`);
