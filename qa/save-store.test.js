/* Tests for game/save-store.js (save format 2, docs/SAVE-V2.md). Plain Node, no dependencies.
   Usage: node qa/save-store.test.js */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.resolve(__dirname, '../game/save-store.js'), 'utf8');
const V1 = 'vector-guild-save-v1', V2 = 'vector-guild-save-v2';
const plain = o => JSON.parse(JSON.stringify(o));
/* A fresh page: its own window and localStorage, sharing the Map that stands for the browser's storage. */
function page(storage = new Map(), extra = {}) {
  const localStorage = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const window = { localStorage, ...extra };
  vm.runInNewContext(source, { window, Math, JSON });
  return { store: window.VGSave, storage };
}
let count = 0;
const test = (name, fn) => { fn(); count++; console.log('ok   ' + name); };

test('fresh save: random non-zero seed, no realms, intro not seen, written once', () => {
  const { store, storage } = page();
  const d = store.load();
  assert.equal(d.v, 2); assert.ok(Number.isInteger(d.seed) && d.seed > 0); assert.deepEqual(plain(d.realms), {}); assert.equal(d.intro, false);
  assert.equal(JSON.parse(storage.get(V2)).seed, d.seed, 'the seed is stored so the next page sees the same numbers');
  assert.equal(page(storage).store.seed(), d.seed);
  assert.equal(store.realm('la'), null); assert.equal(store.totalXp(), 0); assert.equal(storage.has(V1), false);
});

test('VG_SEED pins the seed of a new save (test hook)', () => {
  assert.equal(page(new Map(), { VG_SEED: 0 }).store.seed(), 0);
  assert.equal(page(new Map(), { VG_SEED: 4242 }).store.seed(), 4242);
  const s = new Map([[V2, JSON.stringify({ v: 2, seed: 7, intro: true, realms: {} })]]);
  assert.equal(page(s, { VG_SEED: 4242 }).store.seed(), 7, 'an existing save keeps its own seed');
});

test('v1 -> v2 migration keeps the slice, moves the seed, never touches the v1 entry', () => {
  const v1 = { solved: ['q01', 'q02'], xp: 200, points: 1, tools: ['vector'], clean: ['q01'], revealed: [], landmarks: [], contracts: ['c1'], reviews: { q01: { n: 2, last: 5 } }, errors: { q02: { n: 1, last: 9, pit: { 0: 1 } } }, rolls: { q03: 2 }, seed: 31337 };
  const raw = JSON.stringify(v1), storage = new Map([[V1, raw]]);
  const { store } = page(storage);
  const d = store.load();
  assert.equal(d.seed, 31337); assert.equal(d.intro, false);
  const { seed, ...rest } = v1;
  assert.deepEqual(plain(d.realms), { la: rest }, 'slice is the v1 object without its seed');
  assert.deepEqual(plain(store.realm('la').contracts), ['c1'], 'contracts survive');
  assert.equal(storage.get(V1), raw, 'v1 entry unchanged');
  assert.equal(store.totalXp(), 200);
});

test('migration: seed 0 stays 0; a missing seed becomes 0 (authored numbers)', () => {
  assert.equal(page(new Map([[V1, JSON.stringify({ solved: [], tools: [], seed: 0 })]])).store.seed(), 0);
  assert.equal(page(new Map([[V1, JSON.stringify({ solved: ['q01'], tools: [] })]]), { VG_SEED: 99 }).store.seed(), 0, 'VG_SEED does not override a migrated save');
  assert.equal(page(new Map([[V1, JSON.stringify({ solved: [], tools: [], seed: -4 })]])).store.seed(), 0, 'an invalid seed becomes 0');
});

test('migration: integer review counts (1.3) become {n, last: 0}; other entries are kept', () => {
  const { store } = page(new Map([[V1, JSON.stringify({ solved: ['q01', 'q02', 'q03'], tools: [], reviews: { q01: 2, q02: { n: 1, last: 8 }, q03: 0 } })]]));
  assert.deepEqual(plain(store.realm('la').reviews), { q01: { n: 2, last: 0 }, q02: { n: 1, last: 8 }, q03: 0 });
});

test('a v1 entry that is not a save is ignored: fresh save instead', () => {
  const { store } = page(new Map([[V1, '{"hello":1}']]), { VG_SEED: 5 });
  assert.deepEqual(plain(store.load()), { v: 2, seed: 5, intro: false, realms: {} });
  const broken = page(new Map([[V1, 'not json']]), { VG_SEED: 6 });
  assert.equal(broken.store.seed(), 6);
});

test('an existing v2 entry wins over a v1 entry', () => {
  const s = new Map([[V1, JSON.stringify({ solved: ['q01'], tools: [], seed: 3 })], [V2, JSON.stringify({ v: 2, seed: 8, intro: true, realms: { found: { solved: [], tools: [], xp: 0 } } })]]);
  const { store } = page(s);
  assert.equal(store.seed(), 8); assert.equal(store.realm('la'), null); assert.equal(store.introSeen(), true);
});

test('putRealm writes one slice and leaves the other realms untouched', () => {
  const other = { solved: ['q09'], tools: [], xp: 150, weird: { kept: [1, 2] } };
  const { store, storage } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 12, intro: true, realms: { found: other } })]]));
  assert.equal(store.putRealm('la', { solved: ['q01'], tools: [], xp: 100 }), true);
  const d = JSON.parse(storage.get(V2));
  assert.deepEqual(d.realms.found, other); assert.deepEqual(d.realms.la, { solved: ['q01'], tools: [], xp: 100 });
  assert.equal(d.seed, 12); assert.equal(d.intro, true); assert.equal(store.totalXp(), 250);
});

test('a slice for a pack that is not loaded survives load -> putRealm -> exportAll unchanged', () => {
  const unknown = { solved: ['z1', 'z2'], tools: [], xp: 777, points: -3, landmarks: [99], reviews: { z1: 4 }, future: 'field' };
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 2, intro: false, realms: { calc1: unknown, la: { solved: [], tools: [] } } })]]);
  const { store } = page(storage);
  store.load();
  store.putRealm('la', { solved: ['q01'], tools: [], xp: 100 });
  const out = store.exportAll();
  assert.deepEqual(plain(out.realms.calc1), unknown, 'not normalised, not recomputed, not dropped');
  assert.deepEqual(plain(page(storage).store.realm('calc1')), unknown, 'and still there for the next page');
});

test('slices are copies: changing a returned object does not change the save', () => {
  const { store } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('la', { solved: ['q01'], tools: [] });
  const s = store.realm('la'); s.solved.push('q02');
  assert.deepEqual(plain(store.realm('la').solved), ['q01']);
  const e = store.exportAll(); e.realms.la = null;
  assert.ok(store.realm('la'));
});

test('importAny: v2 replaces the whole save', () => {
  const { store } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('found', { solved: ['q01'], tools: [] });
  const backup = { v: 2, seed: 55, intro: true, realms: { la: { solved: ['q01'], tools: [], xp: 100 } } };
  assert.deepEqual(plain(store.importAny(backup)), { ok: true, error: null, kind: 2 });
  assert.deepEqual(plain(store.exportAll()), backup);
});

test('importAny: a 1.x backup becomes realms.la with its seed; other realms are kept', () => {
  const { store } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('found', { solved: ['q02'], tools: [] });
  const r = store.importAny({ solved: ['q01'], tools: [], xp: 100, reviews: { q01: 3 }, seed: 9 });
  assert.equal(r.ok, true); assert.equal(r.kind, 1);
  assert.equal(store.seed('la'), 9, 'linear algebra keeps the numbers the backup had');
  assert.equal(store.seed(), 1, 'the global seed is not changed'); assert.equal(store.seed('found'), 1, 'so Foundations keeps its numbers');
  assert.deepEqual(plain(store.realm('la')), { solved: ['q01'], tools: [], xp: 100, reviews: { q01: { n: 3, last: 0 } } });
  assert.deepEqual(plain(store.realm('found')), { solved: ['q02'], tools: [] });
});

test('importAny: a 1.x backup without a seed gives linear algebra the authored numbers and leaves other realms alone', () => {
  const { store, storage } = page(new Map(), { VG_SEED: 1840221182 });
  store.putRealm('found', { solved: ['q02'], tools: [], rolls: { q03: 1 } });
  assert.equal(store.importAny({ solved: ['q01'], tools: [], xp: 5 }).ok, true);
  assert.equal(store.seed('la'), 0); assert.equal(store.seed('found'), 1840221182); assert.equal(store.seed(), 1840221182);
  /* The override is part of the save: another page, an export and a v2 import all keep it. */
  assert.equal(page(storage).store.seed('la'), 0);
  const backup = store.exportAll(); assert.deepEqual(plain(backup.seeds), { la: 0 });
  const other = page(new Map(), { VG_SEED: 3 }).store; assert.equal(other.importAny(backup).ok, true);
  assert.equal(other.seed('la'), 0); assert.equal(other.seed('found'), 1840221182);
  /* A backup whose seed equals the global seed needs no override; resetting the realm drops one. */
  store.importAny({ solved: [], tools: [], seed: 1840221182 }); assert.equal(store.exportAll().seeds, undefined);
  store.importAny({ solved: [], tools: [], seed: 7 }); assert.equal(store.seed('la'), 7);
  store.reset('la'); assert.equal(store.seed('la'), 1840221182); assert.equal(store.exportAll().seeds, undefined);
  /* Invalid overrides in a stored or imported save are ignored. */
  const odd = page(new Map([[V2, JSON.stringify({ v: 2, seed: 4, seeds: { la: -1, found: 'x', other: 2.5, ok: 6 }, realms: {} })]])).store;
  assert.equal(odd.seed('la'), 4); assert.equal(odd.seed('found'), 4); assert.equal(odd.seed('ok'), 6); assert.deepEqual(plain(odd.exportAll().seeds), { ok: 6 });
});

test('importAny: a v2 backup with an unusable realm slice is refused and changes nothing', () => {
  const { store, storage } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('found', { solved: ['q01', 'q02'], tools: [] }); store.putRealm('la', { solved: ['q01'], tools: [] });
  const before = storage.get(V2);
  const ok = { solved: ['q01'], tools: [] };
  for (const realms of [{ found: {} }, { found: { solved: 'x', tools: [] } }, { found: { solved: [] } }, { found: { solved: [1, 2], tools: [] } }, { found: { solved: [], tools: [{}] } }, { la: ok, found: { tools: [] } }]) {
    const r = store.importAny({ v: 2, seed: 1, realms });
    assert.equal(r.ok, false, `refuses realms ${JSON.stringify(realms)}`); assert.match(r.error, /not a complete MathCosmos save/);
    assert.equal(storage.get(V2), before, 'the stored save is untouched');
  }
  assert.deepEqual(plain(store.realm('found').solved), ['q01', 'q02']);
  /* The stored save itself is still read leniently: a slice of a pack this build does not know is kept as it is. */
  const odd = new Map([[V2, JSON.stringify({ v: 2, seed: 2, realms: { future: { anything: 1 } } })]]);
  assert.deepEqual(plain(page(odd).store.realm('future')), { anything: 1 });
});

test('importAny: when the device cannot store the save, it says so and keeps the old progress', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 5, intro: false, realms: { la: { solved: ['q01'], tools: [], xp: 10 } } })]]);
  const window = { localStorage: { getItem: k => storage.has(k) ? storage.get(k) : null, setItem() { throw Error('QuotaExceeded'); }, removeItem() {} } };
  vm.runInNewContext(source, { window, Math, JSON });
  const store = window.VGSave, before = JSON.stringify(store.exportAll());
  const r2 = store.importAny({ v: 2, seed: 9, realms: { la: { solved: ['q01', 'q02'], tools: [], xp: 99 } } });
  assert.equal(r2.ok, false); assert.match(r2.error, /could not store/);
  const r1 = store.importAny({ solved: ['q01', 'q02', 'q03'], tools: [], xp: 999, seed: 3 });
  assert.equal(r1.ok, false); assert.match(r1.error, /could not store/);
  assert.equal(JSON.stringify(store.exportAll()), before); assert.equal(store.totalXp(), 10); assert.equal(store.seed('la'), 5);
});

test('importAny: garbage is refused and changes nothing', () => {
  const { store } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('la', { solved: ['q01'], tools: [] });
  const before = JSON.stringify(store.exportAll());
  for (const junk of [null, 7, 'text', [], {}, { v: 2 }, { v: 2, realms: [] }, { v: 2, realms: { la: 5 } }, { v: 3, realms: {} }, { solved: 'q01', tools: [] }, { solved: [] }]) {
    const r = store.importAny(junk);
    assert.equal(r.ok, false, `refuses ${JSON.stringify(junk)}`); assert.ok(r.error);
  }
  assert.equal(JSON.stringify(store.exportAll()), before);
});

test('reset(id) removes one realm; resetAll starts again; the v1 entry is never touched', () => {
  const v1raw = JSON.stringify({ solved: ['q01'], tools: [], seed: 4 });
  const { store, storage } = page(new Map([[V1, v1raw]]));
  store.load(); store.putRealm('found', { solved: [], tools: [] });
  store.reset('la');
  assert.equal(store.realm('la'), null); assert.ok(store.realm('found')); assert.equal(store.seed(), 4, 'reset keeps the seed');
  store.setIntroSeen(); assert.equal(store.introSeen(), true);
  store.resetAll();
  assert.deepEqual(plain(store.exportAll().realms), {}); assert.equal(store.introSeen(), false);
  assert.equal(storage.get(V1), v1raw);
  assert.equal(page(storage).store.realm('la'), null, 'a v2 entry exists, so the v1 save is not migrated again');
});

test('setIntroSeen persists', () => {
  const { store, storage } = page(new Map(), { VG_SEED: 1 });
  assert.equal(store.introSeen(), false); store.setIntroSeen();
  assert.equal(page(storage).store.introSeen(), true);
});

test('localStorage that throws: everything works in memory and nothing throws', () => {
  const thrower = { getItem() { throw Error('SecurityError'); }, setItem() { throw Error('QuotaExceeded'); }, removeItem() { throw Error('x'); } };
  const window = { localStorage: thrower, VG_SEED: 77 };
  vm.runInNewContext(source, { window, Math, JSON });
  const store = window.VGSave;
  const d = store.load(); assert.equal(d.seed, 77);
  assert.equal(store.putRealm('la', { solved: ['q01'], tools: [], xp: 100 }), false, 'reports that nothing was stored');
  assert.deepEqual(plain(store.realm('la')), { solved: ['q01'], tools: [], xp: 100 }, 'kept in memory for this page');
  assert.equal(store.totalXp(), 100); assert.equal(store.introSeen(), false); store.setIntroSeen(); assert.equal(store.introSeen(), true);
  const before = JSON.stringify(store.exportAll());
  assert.equal(store.importAny({ solved: [], tools: [] }).ok, false, 'an import that cannot be stored is not applied');
  assert.equal(JSON.stringify(store.exportAll()), before); store.reset('la'); store.resetAll();
  /* A window whose localStorage getter itself throws (blocked site data). */
  const blocked = { VG_SEED: 3 }; Object.defineProperty(blocked, 'localStorage', { get() { throw Error('blocked'); } });
  vm.runInNewContext(source, { window: blocked, Math, JSON });
  assert.equal(blocked.VGSave.seed(), 3); assert.equal(blocked.VGSave.putRealm('found', { solved: [], tools: [] }), false);
  assert.ok(blocked.VGSave.realm('found'));
});

test('an unreadable v2 entry is set aside, not silently lost', () => {
  const storage = new Map([[V2, '{broken'], [V1, JSON.stringify({ solved: ['q01'], tools: [], seed: 2 })]]);
  const { store } = page(storage);
  assert.equal(store.seed(), 2, 'falls back to migrating the v1 save');
  assert.equal(storage.get(V2 + '-unreadable'), '{broken');
});

console.log(`PASS: ${count} save-store tests.`);
