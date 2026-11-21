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

/* ---- The collection (meta, since 2.1; docs/COLLECTION.md) ---- */
const EMPTY_META = { v: 1, dust: 0, earned: 0, owned: {}, equipped: null, ach: [], pulls: 0, sinceRare: 0, sinceLegend: 0, paid: {}, drills: 0, looks: {} };

test('meta: a 2.0 save has none, loads without loss, and reading the collection writes nothing', () => {
  const v20 = { v: 2, seed: 12, intro: true, realms: { la: { solved: ['q01'], tools: [], xp: 100 }, calc1: { future: 1 } } }, raw = JSON.stringify(v20);
  const { store, storage } = page(new Map([[V2, raw]]));
  assert.deepEqual(plain(store.load()), v20); assert.deepEqual(plain(store.meta()), EMPTY_META);
  assert.deepEqual(plain(store.exportAll()), v20, 'no meta appears until something is stored'); assert.equal(storage.get(V2), raw);
  store.putRealm('la', { solved: ['q01', 'q02'], tools: [], xp: 200 }); assert.equal('meta' in JSON.parse(storage.get(V2)), false);
  assert.deepEqual(plain(page().store.meta()), EMPTY_META, 'a fresh save too');
});

test('meta: putMeta stores the collection only; meta() returns a copy', () => {
  const { store, storage } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 12, seeds: { la: 4 }, intro: true, realms: { la: { solved: ['q01'], tools: [], xp: 100 } } })]]));
  const m = store.meta(); m.dust = 70; m.earned = 130; m.owned.euclid = 2; m.equipped = 'euclid'; m.ach.push('solve-1'); m.pulls = 3; m.sinceRare = 1; m.sinceLegend = 3; m.paid.la = { solved: ['q01'], clean: [], chapters: [0] }; m.drills = 4; m.looks.la = ['q01'];
  assert.equal(store.putMeta(m), true);
  const d = JSON.parse(storage.get(V2));
  assert.deepEqual(d.meta, plain(m)); assert.deepEqual(d.realms, { la: { solved: ['q01'], tools: [], xp: 100 } }); assert.equal(d.seed, 12); assert.deepEqual(d.seeds, { la: 4 }); assert.equal(d.intro, true);
  const copy = store.meta(); copy.owned.euclid = 99; copy.ach.push('x'); assert.deepEqual(plain(store.meta()), plain(m));
  assert.deepEqual(plain(page(storage).store.meta()), plain(m), 'the next page sees it');
  store.putRealm('found', { solved: [], tools: [] }); store.setIntroSeen(); assert.deepEqual(plain(store.meta()), plain(m), 'other writes leave it alone');
  assert.deepEqual(plain(store.exportAll().meta), plain(m)); assert.equal(store.totalXp(), 100);
});

test('meta: unsafe values are made safe; unknown figure ids, achievement ids and fields are kept', () => {
  const messy = { v: 7, dust: -5, earned: 2.5, owned: { euclid: 2, noether: 0, gauss: -1, x: 'many', future_figure: 1 }, equipped: 'noether', ach: ['a', 'a', 5, '', 'later-achievement'], pulls: '3', sinceRare: null, sinceLegend: 4,
    paid: { la: { solved: ['q01', 'q01', 3], clean: 'q01', chapters: [0, 0, -1, 1.5, 2] }, found: 'x', other: {} }, drills: 6, looks: { la: ['q01', 'q01'], found: [], odd: 3 }, later: { field: [1] } };
  const { store } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: {}, meta: messy })]]));
  const want = { v: 1, dust: 0, earned: 0, owned: { euclid: 2, future_figure: 1 }, equipped: null, ach: ['a', 'later-achievement'], pulls: 0, sinceRare: 0, sinceLegend: 4,
    paid: { la: { solved: ['q01'], clean: [], chapters: [0, 2] }, other: { solved: [], clean: [], chapters: [] } }, drills: 6, looks: { la: ['q01'] }, later: { field: [1] } };
  assert.deepEqual(plain(store.meta()), want);
  assert.equal(store.putMeta(messy), true); assert.deepEqual(plain(store.meta()), want, 'putMeta normalises as well');
  const m = store.meta(); m.equipped = 'future_figure'; store.putMeta(m); assert.equal(store.meta().equipped, 'future_figure', 'an owned figure this build does not know can stay equipped');
  for (const junk of [null, 7, 'text', [], undefined]) { store.putMeta(junk); assert.deepEqual(plain(store.meta()), EMPTY_META); }
  const odd = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: {}, meta: [1, 2] })]])).store;
  assert.deepEqual(plain(odd.meta()), EMPTY_META); assert.equal('meta' in odd.exportAll(), false);
});

test('meta: export and import carry it; a 2.0 backup keeps the collection on the device; a 1.x import and reset(realm) leave it alone; resetAll clears it', () => {
  const { store } = page(new Map(), { VG_SEED: 1 });
  store.putRealm('la', { solved: ['q01'], tools: [] });
  const m = store.meta(); m.dust = 45; m.earned = 45; m.owned.euclid = 1; m.ach = ['solve-1']; m.paid.la = { solved: ['q01'], clean: [], chapters: [] }; store.putMeta(m);
  const backup = store.exportAll(); assert.deepEqual(plain(backup.meta), plain(m));
  /* Another device: the backup's collection replaces whatever was there. */
  const other = page(new Map(), { VG_SEED: 3 }).store; const theirs = other.meta(); theirs.dust = 999; theirs.owned.gauss = 4; other.putMeta(theirs);
  assert.equal(other.importAny(backup).ok, true); assert.deepEqual(plain(other.meta()), plain(m)); assert.deepEqual(plain(other.exportAll()), plain(backup));
  /* A v2 backup without meta (made by 2.0): realms are replaced, the collection is kept. */
  assert.equal(other.importAny({ v: 2, seed: 8, intro: false, realms: { found: { solved: ['q01', 'q02'], tools: [] } } }).ok, true);
  assert.equal(other.realm('la'), null); assert.equal(other.seed(), 8); assert.deepEqual(plain(other.meta()), plain(m));
  /* A 1.x backup, a realm reset and a refused import leave it alone. */
  assert.equal(other.importAny({ solved: ['q01', 'q02'], tools: [], seed: 4 }).ok, true); assert.deepEqual(plain(other.meta()), plain(m));
  other.reset('la'); other.reset('found'); assert.deepEqual(plain(other.meta()), plain(m));
  assert.equal(other.importAny({ v: 2, seed: 1, realms: { la: { solved: 'x' } }, meta: { dust: 5000 } }).ok, false); assert.deepEqual(plain(other.meta()), plain(m));
  other.resetAll(); assert.deepEqual(plain(other.meta()), EMPTY_META); assert.equal('meta' in other.exportAll(), false);
  /* An imported collection is normalised like a stored one. */
  assert.equal(other.importAny({ v: 2, seed: 1, realms: {}, meta: { dust: 30, owned: { a: 1, b: 0 }, equipped: 'b', extra: 1 } }).ok, true);
  assert.deepEqual(plain(other.meta()), { ...EMPTY_META, dust: 30, owned: { a: 1 }, extra: 1 });
});

test('meta: a 1.x save migrates with no collection, and the v1 entry is untouched by putMeta', () => {
  const v1raw = JSON.stringify({ solved: ['q01'], tools: [], seed: 4 }), { store, storage } = page(new Map([[V1, v1raw]]));
  store.load(); assert.deepEqual(plain(store.meta()), EMPTY_META);
  const m = store.meta(); m.dust = 10; assert.equal(store.putMeta(m), true);
  assert.equal(storage.get(V1), v1raw); assert.equal(store.meta().dust, 10); assert.deepEqual(plain(store.realm('la').solved), ['q01']);
});

test('meta: putMeta reports when nothing could be stored, and nothing throws', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 5, realms: {}, meta: { dust: 20 } })]]);
  const window = { localStorage: { getItem: k => storage.has(k) ? storage.get(k) : null, setItem() { throw Error('QuotaExceeded'); }, removeItem() {} } };
  vm.runInNewContext(source, { window, Math, JSON });
  const m = window.VGSave.meta(); m.dust = 500;
  assert.equal(window.VGSave.putMeta(m), false); assert.equal(window.VGSave.meta().dust, 20, 'the stored collection is still the truth');
  /* Storage blocked altogether: kept in memory for this page, like realm progress. */
  const blocked = { VG_SEED: 3 }; Object.defineProperty(blocked, 'localStorage', { get() { throw Error('blocked'); } });
  vm.runInNewContext(source, { window: blocked, Math, JSON });
  assert.deepEqual(plain(blocked.VGSave.meta()), EMPTY_META); const b = blocked.VGSave.meta(); b.dust = 7;
  assert.equal(blocked.VGSave.putMeta(b), false); assert.equal(blocked.VGSave.meta().dust, 7);
  blocked.VGSave.resetAll(); assert.equal(blocked.VGSave.meta().dust, 0);
});

console.log(`PASS: ${count} save-store tests.`);
