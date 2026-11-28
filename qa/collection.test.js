/* Tests for the collection core (docs/COLLECTION.md, docs/COLLECTION-API.md): game/collection/core.js and
   game/collection/achievements.js over game/save-store.js. Plain Node, no dependencies.
   Usage: node qa/collection.test.js
   The rules are tested with a figure list made here, so they do not depend on the real figure data.
   The last test also runs the real list (game/collection/figures.js) when that file exists. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = f => fs.readFileSync(path.resolve(__dirname, '..', f), 'utf8');
const SRC = { store: read('game/save-store.js'), registry: read('game/realms/registry.js'), ach: read('game/collection/achievements.js'), core: read('game/collection/core.js') };
const V2 = 'vector-guild-save-v2';
const plain = o => JSON.parse(JSON.stringify(o));

/* 36 figures: 3 fields of 12; 22 common, 10 rare, 4 legendary; every perk id, including the legacy "xp". */
const PERK_IDS = ['stardust', 'chapter', 'secondlook', 'drill', 'xp'];
const FIXTURE = Array.from({ length: 36 }, (_, i) => ({
  id: 'fig' + String(i + 1).padStart(2, '0'), name: 'Figure ' + (i + 1), born: 1700 + i, died: 1780 + i, place: 'Somewhere',
  field: ['Mathematics', 'Physics', 'Computing'][i % 3], knownFor: 'Something', bio: 'A short life.', idea: 'An idea.',
  rarity: i < 22 ? 'common' : i < 32 ? 'rare' : 'legendary', perk: PERK_IDS[i % PERK_IDS.length], sources: ['https://example.org/' + i], emblem: '<circle cx="32" cy="32" r="20"/>'
}));
const figWith = (perk, rarity = 'common') => FIXTURE.find(f => f.perk === perk && f.rarity === rarity);

/* A page: its own window, sharing the Map that stands for the browser's storage. */
function page(storage = new Map(), extra = {}, localStorage) {
  const ls = localStorage || { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const window = { localStorage: ls, VG_SEED: 1, VG_FIGURES: FIXTURE, ...extra };
  const ctx = { window, Math, JSON };
  for (const k of ['store', 'registry', 'ach', 'core']) vm.runInNewContext(SRC[k], ctx);
  return { C: window.VGCollection, S: window.VGSave, A: window.VG_ACHIEVEMENTS, window, storage };
}
/* Deterministic random numbers in [0, 1). */
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/* A random source that returns the given numbers in turn, then keeps returning the last one. */
const fixed = (...xs) => { let i = 0; return () => xs[Math.min(i++, xs.length - 1)]; };
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
const slice = (solved, clean = [], more = {}) => ({ solved, xp: 0, points: 0, tools: [], clean, revealed: [], landmarks: [], contracts: [], reviews: {}, errors: {}, rolls: {}, ...more });
/* What a realm page hands to settle(): n missions cut into equal chapters. */
function realmCtx(id, missions, chapters) { const all = ids(missions), size = Math.ceil(missions / chapters); return { id, missions, ids: all, chapters: Array.from({ length: chapters }, (_, i) => ({ index: i, name: 'Chapter ' + (i + 1), ids: all.slice(i * size, (i + 1) * size) })) }; }
const LA = realmCtx('la', 68, 8), FOUND = realmCtx('found', 40, 7), CALC1 = realmCtx('calc1', 40, 7);
/* Packs added after 2.5 (tools/new-pack.js): every ready registry part other than these three. Each has two
   achievements from its registry entry, and is played to the end below like the three. */
const LATER = require('./pack-list.js').readyParts().filter(p => !['la', 'found', 'calc1'].includes(p.id));
const total = events => events.reduce((n, e) => n + e.dust, 0);
const types = events => events.map(e => e.type === 'achievement' ? 'achievement:' + e.id : e.type);
const give = (S, dust) => { const m = S.meta(); m.dust = dust; S.putMeta(m); };
const own = (S, id, n = 1) => { const m = S.meta(); m.owned[id] = n; S.putMeta(m); };

/* Values made inside a page come from another JavaScript realm, so they are compared as plain data. */
const eq = (actual, expected, message) => assert.deepEqual(plain(actual), plain(expected), message);
let count = 0;
const test = (name, fn) => { fn(); count++; console.log('ok   ' + name); };

test('achievement list: about 30, unique ids, plain fields, rewards from 15 to 150', () => {
  const { A } = page();
  assert.ok(A.length - 2 * LATER.length >= 26 && A.length - 2 * LATER.length <= 34, 'about 30, and two for each pack added later: ' + A.length);
  /* The per-realm pairs come from the registry (game/realms/registry.js, `ach`); the 2.5 ones are exactly as shipped. */
  const pairs = A.filter(a => /-(done|master)$/.test(a.id)).map(a => [a.id, a.name, a.text, a.reward]);
  eq(pairs.slice(0, 6), [['found-done', 'Solid ground', 'Learn every concept in Foundations.', 120], ['found-master', 'Bedrock', 'Solve every mission in Foundations, practice included.', 150],
    ['la-done', 'Master of arrows', 'Learn every concept in Linear algebra.', 150], ['la-master', 'Full span', 'Solve every mission in Linear algebra, practice included.', 150],
    ['calc1-done', 'Rate of climb', 'Learn every concept in Calculus 1.', 150], ['calc1-master', 'Area under the curve', 'Solve every mission in Calculus 1, practice included.', 150]]);
  eq(A.slice(10, 18).map(a => a.id), ['chapter-3', 'found-done', 'found-master', 'la-done', 'la-master', 'calc1-done', 'calc1-master', LATER.length ? LATER[0].id + '-done' : 'two-realms'], 'in their 2.5 places, then the later packs in registry order');
  assert.equal(A[18 + 2 * LATER.length - (LATER.length ? 1 : 0)].id, LATER.length ? 'two-realms' : 'drill-1');
  eq(pairs.slice(6).map(p => p[0]), LATER.flatMap(p => [p.id + '-done', p.id + '-master']), 'one pair per later ready part');
  for (const p of LATER) assert.ok(p.ach && A.find(a => a.id === p.id + '-done').name === p.ach.done && A.find(a => a.id === p.id + '-master').name === p.ach.master, p.id + ': names from the registry');
  assert.equal(new Set(A.map(a => a.id)).size, A.length);
  for (const a of A) {
    assert.match(a.id, /^[a-z0-9-]+$/); assert.ok(a.name && a.text, a.id);
    assert.ok(Number.isInteger(a.reward) && a.reward >= 15 && a.reward <= 150, a.id + ' reward');
    assert.equal(typeof a.test, 'function'); assert.ok(a.name.length <= 28 && a.text.length <= 60, a.id + ' is short');
    assert.doesNotMatch(a.name + ' ' + a.text, /[$€£]|\b(buy|purchase|money|pay|gacha|xp)\b/i, a.id + ' wording');
  }
});

test('a new save has an empty collection, nothing earned, and settling pays nothing', () => {
  const { C, S, storage } = page();
  S.load(); const before = storage.get(V2);
  eq(C.settle(), []); assert.equal(C.dust(), 0); assert.equal(C.earned(), 0);
  assert.equal(storage.get(V2), before, 'nothing is written when nothing is earned');
  assert.ok(C.achievements().every(a => !a.earned)); eq(plain(C.owned()), []); assert.equal(C.equipped(), null); assert.equal(C.perk(), null);
  eq(plain(C.counts()), { owned: 0, total: 36, copies: 0, byRarity: { common: { owned: 0, total: 22 }, rare: { owned: 0, total: 10 }, legendary: { owned: 0, total: 4 } } });
});

test('a 2.0 save loads unchanged, and its past work is paid once on the star map', () => {
  const v20 = { v: 2, seed: 77, intro: true, realms: { la: slice(['q01', 'q02', 'q03'], ['q01'], { xp: 300, points: 3 }), found: slice(['q01', 'q02'], [], { xp: 200 }), future: { anything: [1, 2] } } };
  const storage = new Map([[V2, JSON.stringify(v20)]]);
  const { C, S } = page(storage);
  eq(plain(S.load()), v20, 'no field added, none lost'); assert.equal('meta' in S.exportAll(), false);
  const events = C.settle();
  eq(types(events).sort(), ['achievement:solve-1', 'achievement:solve-5', 'achievement:star-1', 'achievement:two-realms', 'solve', 'solve', 'solve', 'solve', 'solve', 'star'].sort());
  assert.equal(total(events), 5 * 10 + 5 + 15 + 20 + 15 + 30); assert.equal(C.dust(), 135); assert.equal(C.earned(), 135);
  eq(plain(events.find(e => e.type === 'star')), { type: 'star', realm: 'la', qid: 'q01', dust: 5 });
  eq(plain(S.exportAll().realms), v20.realms, 'realm slices, known or not, are untouched');
  eq(plain(S.meta().paid), { la: { solved: ['q01', 'q02', 'q03'], clean: ['q01'], chapters: [] }, found: { solved: ['q01', 'q02'], clean: [], chapters: [] } });
});

test('awards are idempotent: settling again, reloading, replaying after a reset and re-importing never pay twice', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 7, intro: true, realms: { la: slice(ids(9), ['q01', 'q02']) } })]]);
  const a = page(storage), first = a.C.settle(LA), dust = a.C.dust();
  assert.equal(first.filter(e => e.type === 'solve').length, 9); assert.equal(first.filter(e => e.type === 'chapter').length, 1);
  eq(a.C.settle(LA), []); eq(a.C.settle(), []);
  const b = page(storage); eq(b.C.settle(LA), []); assert.equal(b.C.dust(), dust, 'a reload pays nothing');
  /* Reset the realm and solve the same missions again. */
  const backup = b.S.exportAll(), played = b.S.realm('la');
  b.S.reset('la'); eq(b.C.settle(LA), []); b.S.putRealm('la', played);
  eq(b.C.settle(LA), []); assert.equal(b.C.dust(), dust, 'replaying pays nothing');
  /* Restore the same backup, twice. */
  assert.equal(b.S.importAny(backup).ok, true); eq(b.C.settle(LA), []);
  assert.equal(b.S.importAny(backup).ok, true); eq(b.C.settle(LA), []); assert.equal(b.C.dust(), dust);
  /* A backup made by 2.0 has no collection: the one on the device stays, so nothing is paid again. */
  const old = plain(backup); delete old.meta;
  assert.equal(b.S.importAny(old).ok, true); eq(b.C.settle(LA), []); assert.equal(b.C.dust(), dust);
  /* One more mission: exactly that one is paid. */
  b.S.putRealm('la', slice(ids(10), ['q01', 'q02', 'q10']));
  const more = b.C.settle(LA); eq(types(more), ['solve', 'star', 'achievement:solve-10']); assert.equal(total(more), 10 + 5 + 30);
});

test('chapters are paid on the realm page that knows them, once each', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 7, realms: { la: slice(ids(20)), found: slice(ids(6)) } })]]);
  const shell = page(storage), onMap = shell.C.settle();
  assert.equal(onMap.filter(e => e.type === 'chapter').length, 0, 'the star map does not know the chapters');
  const paidLa = shell.C.settle(LA).filter(e => e.type !== 'achievement');
  eq(plain(paidLa), [{ type: 'chapter', realm: 'la', chapter: 0, name: 'Chapter 1', dust: 25 }, { type: 'chapter', realm: 'la', chapter: 1, name: 'Chapter 2', dust: 25 }]);
  eq(plain(shell.S.meta().paid.found.chapters), [], 'another realm\'s chapters wait for that realm\'s page');
  assert.equal(shell.C.settle(FOUND).filter(e => e.type === 'chapter').length, 1);
  eq(shell.C.settle(FOUND), []);
  /* The realm page builds the same thing from REALM, CHAPTERS and QUESTS when settle() gets no argument. */
  const realmPage = page(new Map([[V2, JSON.stringify({ v: 2, seed: 7, realms: { la: slice(['q01', 'q02', 'zz9']) } })]]), { REALM: { id: 'la', saveId: 'la' }, QUESTS: [{ id: 'q01' }, { id: 'q02' }, { id: 'q03' }], CHAPTERS: [{ index: 0, name: 'One', ids: ['q01', 'q02'] }, { index: 1, name: 'Two', ids: ['q03'] }, { index: 2, name: 'Empty', ids: [] }] });
  const ev = realmPage.C.settle();
  eq(types(ev).filter(t => !t.startsWith('achievement')), ['solve', 'solve', 'chapter'], 'an id that is not a mission of this realm is not paid; an empty chapter is never complete');
  eq(plain(realmPage.C.pageRealm()), { id: 'la', missions: 3, learn: 3, ids: ['q01', 'q02', 'q03'], chapters: [{ index: 0, name: 'One', ids: ['q01', 'q02'] }, { index: 1, name: 'Two', ids: ['q03'] }, { index: 2, name: 'Empty', ids: [] }] });
});

test('a star is only paid for a solved mission, and lists with duplicates or junk pay once', () => {
  const { C } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: { solved: ['q01', 'q01', 5, null, 'q02'], tools: [], clean: ['q01', 'q01', 'q09', {}] }, odd: { solved: 'x' }, empty: {} } })]]));
  const ev = C.settle();
  eq(types(ev).filter(t => !t.startsWith('achievement')), ['solve', 'star', 'solve']);
});

test('summon: the first is free, later ones cost 60, and too little stardust is refused', () => {
  const { C, S } = page();
  assert.equal(C.cost(), 0); assert.equal(C.canPull(), true);
  eq(plain(C.odds()), { common: 0.7, rare: 0.24, legendary: 0.06 });
  eq(plain(C.guarantees()), { rareEvery: 5, legendEvery: 20, rareIn: 5, legendIn: 20 });
  const r = C.pull(fixed(0.99, 0));
  assert.equal(r.ok, true); assert.equal(r.free, true); assert.equal(r.cost, 0); assert.equal(r.rarity, 'common'); assert.equal(r.figure.id, 'fig01');
  assert.equal(r.duplicate, false); assert.equal(r.refund, 0); assert.equal(r.count, 1); assert.equal(r.stars, 1);
  eq(types(r.events), ['achievement:pull-1']); assert.equal(r.dust, 15); assert.equal(C.dust(), 15);
  assert.equal(C.cost(), 60); assert.equal(C.canPull(), false);
  eq(plain(C.pull(fixed(0.5))), { ok: false, reason: 'dust', cost: 60, dust: 15 }); assert.equal(S.meta().pulls, 1);
  give(S, 60); assert.equal(C.canPull(), true);
  const second = C.pull(fixed(0.99, 0.99)); assert.equal(second.free, false); assert.equal(second.cost, 60); assert.equal(second.figure.id, 'fig22'); assert.equal(C.dust(), 0);
  eq(plain(C.guarantees()), { rareEvery: 5, legendEvery: 20, rareIn: 3, legendIn: 18 });
});

test('summon: a duplicate raises the count and refunds 20 / 35 / 60', () => {
  const { C, S } = page(); give(S, 10000);
  C.pull(fixed(0.99, 0));
  const start = C.dust(), dup = C.pull(fixed(0.99, 0));
  assert.equal(dup.duplicate, true); assert.equal(dup.refund, 20); assert.equal(dup.count, 2); assert.equal(dup.stars, 2); assert.equal(C.dust(), start - 60 + 20);
  const rareAt = () => { const d = C.dust(), r = C.pull(fixed(0.1, 0)); return [r, C.dust() - d + 60 - total(r.events)]; };
  let [r, gain] = rareAt(); assert.equal(r.rarity, 'rare'); assert.equal(r.duplicate, false); assert.equal(gain, 0);
  [r, gain] = rareAt(); assert.equal(r.duplicate, true); assert.equal(r.refund, 35); assert.equal(gain, 35);
  const legend = () => { const d = C.dust(), x = C.pull(fixed(0.01, 0)); return [x, C.dust() - d + 60 - total(x.events)]; };
  [r, gain] = legend(); assert.equal(r.rarity, 'legendary'); assert.equal(gain, 0); assert.ok(types(r.events).includes('achievement:legendary'));
  [r, gain] = legend(); assert.equal(r.refund, 60); assert.equal(gain, 60);
  /* Stars stop at 5; the count and the refund go on. */
  const many = page(); own(many.S, 'fig01', 5); r = many.C.pull(fixed(0.99, 0));
  assert.equal(r.count, 6); assert.equal(r.stars, 5); assert.equal(r.refund, 20); assert.equal(many.C.owned()[0].stars, 5);
  assert.equal(C.earned(), S.meta().ach.reduce((n, id) => n + page().A.find(a => a.id === id).reward, 0), 'refunds are not lifetime stardust');
});

test('summon: a rare or better at least every 5th, a legendary at least every 20th', () => {
  const { C, S } = page(); give(S, 100000);
  const seq = []; for (let i = 0; i < 40; i++) seq.push(C.pull(fixed(0.999, 0.5)).rarity);
  seq.forEach((r, i) => assert.equal(r, (i + 1) % 20 === 0 ? 'legendary' : (i + 1) % 5 === 0 ? 'rare' : 'common', 'pull ' + (i + 1)));
  /* The 5th-pull guarantee can itself be a legendary, in the same 6 : 24 proportion. */
  assert.equal(C.rollRarity(0.19, 4, 0), 'legendary'); assert.equal(C.rollRarity(0.21, 4, 0), 'rare'); assert.equal(C.rollRarity(0.999, 0, 19), 'legendary');
});

test('summon rates over 100,000 seeded rolls: 70 / 24 / 6 within half a point', () => {
  const { C } = page(), rng = mulberry(20261121), n = { common: 0, rare: 0, legendary: 0 }, N = 100000;
  for (let i = 0; i < N; i++) n[C.rollRarity(rng(), 0, 0)]++;
  for (const [r, p] of [['common', 0.70], ['rare', 0.24], ['legendary', 0.06]]) assert.ok(Math.abs(n[r] / N - p) < 0.005, `${r}: ${n[r] / N}`);
});

test('100,000 seeded summons: guarantees always hold, rates sit at or above the base, figures are even within a rarity', () => {
  const { C, S } = page(); give(S, 60 * 100001);
  const rng = mulberry(8675309), N = 100000, n = { common: 0, rare: 0, legendary: 0 }, per = {};
  let commons = 0, noLegend = 0, worstCommons = 0, worstNoLegend = 0;
  for (let i = 0; i < N; i++) {
    const r = C.pull(rng); assert.equal(r.ok, true);
    n[r.rarity]++; per[r.figure.id] = (per[r.figure.id] || 0) + 1; assert.equal(r.figure.rarity, r.rarity);
    commons = r.rarity === 'common' ? commons + 1 : 0; noLegend = r.rarity === 'legendary' ? 0 : noLegend + 1;
    worstCommons = Math.max(worstCommons, commons); worstNoLegend = Math.max(worstNoLegend, noLegend);
  }
  assert.equal(worstCommons, 4, 'never 5 commons in a row'); assert.equal(worstNoLegend, 19, 'never 20 summons without a legendary');
  /* The guarantees move some commons up, so common is below 70% and the other two above their base. */
  assert.ok(n.common / N < 0.70 && n.common / N > 0.60, 'common ' + n.common / N);
  assert.ok(n.rare / N >= 0.24 && n.rare / N < 0.32, 'rare ' + n.rare / N); assert.ok(n.legendary / N >= 0.06 && n.legendary / N < 0.10, 'legendary ' + n.legendary / N);
  for (const f of FIXTURE) { const pool = FIXTURE.filter(x => x.rarity === f.rarity).length, expected = n[f.rarity] / pool; assert.ok(Math.abs(per[f.id] - expected) / expected < 0.08, `${f.id}: ${per[f.id]} of about ${Math.round(expected)}`); }
  assert.equal(S.meta().pulls, N); assert.equal(C.counts().copies, N);
});

test('summon: the default random source works, and a broken one cannot break a summon', () => {
  const { C, S } = page(new Map(), { crypto: { getRandomValues(a) { a[0] = 0xFFFFFFFF; return a; } } }); give(S, 1000);
  const viaCrypto = C.pull(); assert.equal(viaCrypto.ok, true); assert.equal(viaCrypto.figure.id, 'fig22', 'crypto.getRandomValues is used when present');
  const plainPage = page(); assert.equal(plainPage.C.pull().ok, true, 'falls back to Math.random');
  for (const bad of [() => NaN, () => 1, () => -3, () => 'x']) assert.equal(C.pull(bad).ok, true);
  eq(plain(page(new Map(), { VG_FIGURES: [] }).C.pull()), { ok: false, reason: 'empty' });
  assert.equal(page(new Map(), { VG_FIGURES: undefined }).C.canPull(), false);
  /* A list with no legendary still gives a figure when a legendary is rolled. */
  const few = page(new Map(), { VG_FIGURES: FIXTURE.filter(f => f.rarity !== 'legendary') }); assert.equal(few.C.pull(fixed(0.01, 0)).rarity, 'rare');
});

test('equip: only an owned figure; the perk follows the equipped figure; "xp" means "chapter"', () => {
  const { C, S } = page(), star = figWith('stardust'), legacy = figWith('xp');
  eq(plain(C.equip(star.id)), { ok: false, reason: 'not-owned', events: [] });
  eq(plain(C.equip('nobody')), { ok: false, reason: 'unknown', events: [] });
  own(S, star.id); own(S, legacy.id, 3);
  const r = C.equip(star.id); assert.equal(r.ok, true); eq(types(r.events), ['achievement:equipped']);
  assert.equal(C.perk(), 'stardust'); assert.equal(C.equipped().id, star.id); assert.equal(C.equipped().figure.name, star.name);
  eq(plain(C.equip(star.id)), { ok: true, events: [] });
  assert.equal(C.equip(legacy.id).ok, true); assert.equal(C.perk(), 'chapter'); assert.equal(C.equipped().perk.id, 'chapter'); assert.equal(C.equipped().stars, 3);
  eq(plain(C.perkInfo('xp')), plain(C.perkInfo('chapter'))); assert.equal(C.perkInfo('nonsense'), null);
  for (const id of ['stardust', 'chapter', 'secondlook', 'drill']) assert.ok(C.perkInfo(id).name && C.perkInfo(id).text);
  assert.equal(C.equip(null).ok, true); assert.equal(C.perk(), null); assert.equal(C.equipped(), null);
  eq(plain(C.owned().map(x => [x.id, x.count, x.equipped])), [[star.id, 1, false], [legacy.id, 3, false]]);
});

test('perk "stardust": a mission just solved gives 10% more, rounded up (11 and 6); chapters and drills do not', () => {
  const { C, S } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(8), ['q01']) } })]]));
  own(S, figWith('stardust').id); C.equip(figWith('stardust').id); C.settle(LA);
  S.putRealm('la', slice(ids(9), ['q01', 'q09']));
  const ev = C.settle(LA, { perks: true });
  eq(ev.filter(e => e.type !== 'achievement').map(e => [e.type, e.dust]), [['solve', 11], ['star', 6], ['chapter', 25]]);
  assert.equal(C.onDrillDone()[0].dust, 2);
});

test('perk "stardust": past work is paid at the base rates (10 and 5), whatever is equipped', () => {
  /* A backup with many solves is imported while the stardust figure is equipped: no bonus on any of them. */
  const { C, S } = page();
  own(S, figWith('stardust').id); C.equip(figWith('stardust').id);
  assert.equal(S.importAny({ v: 2, seed: 1, realms: { la: slice(ids(30), ids(4)) } }).ok, true);
  assert.equal(C.perk(), 'stardust');
  const ev = C.settle(LA);
  assert.equal(ev.filter(e => e.type === 'solve').length, 30); assert.ok(ev.filter(e => e.type === 'solve').every(e => e.dust === 10));
  assert.equal(ev.filter(e => e.type === 'star').length, 4); assert.ok(ev.filter(e => e.type === 'star').every(e => e.dust === 5));
  assert.ok(ev.filter(e => e.type === 'chapter').every(e => e.dust === 25));
  /* Only {perks: true} turns the perk on: anything else is a plain settle. */
  S.putRealm('la', slice(ids(31))); eq(C.settle(LA, { perks: 1 }).filter(e => e.type === 'solve').map(e => e.dust), [10]);
  S.putRealm('la', slice(ids(32))); eq(C.settle(LA, {}).filter(e => e.type === 'solve').map(e => e.dust), [10]);
  S.putRealm('la', slice(ids(33))); eq(C.settle(LA).filter(e => e.type === 'solve').map(e => e.dust), [10]);
});

test('perk "chapter" (and its legacy id "xp"): +15 for a chapter finished while equipped', () => {
  for (const perk of ['chapter', 'xp']) {
    const { C, S } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(8), ['q01']) } })]]));
    C.settle(LA); own(S, figWith(perk).id); C.equip(figWith(perk).id);
    S.putRealm('la', slice(ids(9), ['q01', 'q09']));
    const ev = C.settle(LA, { perks: true });
    eq(ev.filter(e => e.type !== 'achievement').map(e => [e.type, e.dust]), [['solve', 10], ['star', 5], ['chapter', 40]], perk);
  }
});

test('perk "chapter": chapters finished before the figure was equipped pay 25 (the 2.0 player on the star map)', () => {
  for (const perk of ['chapter', 'xp']) {
    /* The star map pays the solves and knows no chapters; then a figure is found and equipped; then the realm opens. */
    const { C, S } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(68)) } })]]));
    const onMap = C.settle(); assert.equal(onMap.filter(e => e.type === 'chapter').length, 0); assert.equal(onMap.filter(e => e.type === 'solve').length, 68);
    own(S, figWith(perk).id); assert.equal(C.equip(figWith(perk).id).ok, true); assert.equal(C.perk(), 'chapter');
    const dust = C.dust(), onLoad = C.settle(LA).filter(e => e.type === 'chapter');
    assert.equal(onLoad.length, 8, perk); assert.ok(onLoad.every(e => e.dust === 25), perk + ': past chapters pay the base 25');
    assert.ok(C.dust() - dust >= 8 * 25);
  }
  /* Even a settle that follows a solve gives the bonus only to the chapter that solve completes. */
  const { C, S } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(17)) } })]]));
  C.settle(); own(S, figWith('chapter').id); C.equip(figWith('chapter').id);
  S.putRealm('la', slice(ids(18)));
  eq(C.settle(LA, { perks: true }).filter(e => e.type === 'chapter').map(e => [e.chapter, e.dust]), [[0, 25], [1, 40]]);
  /* And never on a plain settle, even when the solve is new. */
  S.putRealm('la', slice(ids(27))); eq(C.settle(LA).filter(e => e.type === 'chapter').map(e => [e.chapter, e.dust]), [[2, 25]]);
});

test('a realm slice named like a built-in ("constructor", "__proto__", ...) never stops the stardust', () => {
  /* Only a damaged or hand-edited backup has such a slice. The import accepts it, and everything else must go on. */
  const names = ['constructor', 'toString', 'hasOwnProperty', 'valueOf', '__proto__'];
  for (const name of names) {
    const { C, S } = page();
    const file = JSON.parse('{"v":2,"seed":1,"realms":{' + JSON.stringify(name) + ':{"solved":["q01"],"tools":[],"clean":["q01"]},"la":' + JSON.stringify(slice(ids(9), ['q01'])) + '}}');
    assert.equal(S.importAny(file).ok, true, name);
    let ev; assert.doesNotThrow(() => { ev = C.settle(LA); }, name);
    eq(ev.filter(e => e.realm === 'la').map(e => e.type), [...Array(9).fill('solve').flatMap((t, i) => i ? [t] : [t, 'star']), 'chapter'], name + ': linear algebra is paid');
    assert.doesNotThrow(() => C.context(), name); assert.doesNotThrow(() => C.achievements(), name);
    eq(C.settle(LA), [], name + ': and paid once');
    const paid = S.meta().paid; assert.ok(Object.prototype.hasOwnProperty.call(paid, 'la'));
    assert.equal(Object.getPrototypeOf(JSON.parse(JSON.stringify(paid))), Object.prototype);
    assert.equal(typeof paid.solved, 'undefined', name + ': the record keeps its own shape');
    S.putRealm('la', slice(ids(10), ['q01'])); eq(types(C.settle(LA, { perks: true })).filter(t => t === 'solve'), ['solve'], name + ': later solves are still paid');
  }
  /* The same names inside a stored collection are harmless too. */
  const text = '{"v":2,"seed":1,"realms":{"la":' + JSON.stringify(slice(ids(2))) + '},"meta":{"v":1,"dust":5,"earned":5,"owned":{"__proto__":2},"paid":{"__proto__":{"solved":["q01"],"clean":[],"chapters":[]},"constructor":{"solved":["zz"],"clean":[],"chapters":[]}},"looks":{"__proto__":["q01"]}}}';
  const { C, S } = page(new Map([[V2, text]])), m = S.meta();
  eq(Object.keys(m.paid), ['constructor']); eq(Object.keys(m.owned), []); eq(Object.keys(m.looks), []);
  assert.equal(m.paid.solved, undefined); eq(C.settle(LA).filter(e => e.type === 'solve').map(e => e.qid), ['q01', 'q02']);
  /* Second look with such a realm name: no throw, and "__proto__" is refused. */
  own(S, figWith('secondlook').id); C.equip(figWith('secondlook').id);
  assert.equal(C.secondLookAvailable('constructor', 'q01'), true); assert.equal(C.useSecondLook('constructor', 'q01'), true); assert.equal(C.secondLookAvailable('constructor', 'q01'), false);
  assert.equal(C.secondLookAvailable('__proto__', 'q01'), false); assert.equal(C.useSecondLook('__proto__', 'q01'), false);
});

test('odds() are the chances of the next summon: the same numbers rollRarity() draws from', () => {
  const spread = (sinceRare, sinceLegend, C) => { const n = 1000, got = { common: 0, rare: 0, legendary: 0 }; for (let i = 0; i < n; i++) got[C.rollRarity((i + 0.5) / n, sinceRare, sinceLegend)]++; return Object.fromEntries(Object.entries(got).map(([k, v]) => [k, v / n])); };
  const near = (a, b, msg) => { for (const r of ['common', 'rare', 'legendary']) assert.ok(Math.abs(a[r] - b[r]) < 1e-9, msg + ' ' + r + ': ' + a[r] + ' vs ' + b[r]); };
  for (const [sinceRare, sinceLegend, want] of [[0, 0, { common: 0.7, rare: 0.24, legendary: 0.06 }], [3, 18, { common: 0.7, rare: 0.24, legendary: 0.06 }],
    [4, 4, { common: 0, rare: 0.8, legendary: 0.2 }], [4, 19, { common: 0, rare: 0, legendary: 1 }], [0, 19, { common: 0, rare: 0, legendary: 1 }], [9, 40, { common: 0, rare: 0, legendary: 1 }]]) {
    const { C, S } = page(), m = S.meta(); m.pulls = 20; m.sinceRare = sinceRare; m.sinceLegend = sinceLegend; S.putMeta(m);
    const shown = plain(C.odds()), label = sinceRare + '/' + sinceLegend;
    near(shown, want, 'shown at ' + label); near(shown, spread(sinceRare, sinceLegend, C), 'drawn at ' + label);
    assert.ok(Math.abs(shown.common + shown.rare + shown.legendary - 1) < 1e-9);
    eq(C.baseOdds(), { common: 0.7, rare: 0.24, legendary: 0.06 }, 'the usual chances do not move');
    assert.equal(C.guarantees().rareIn === 1 || C.guarantees().legendIn === 1, shown.common === 0, 'no common exactly when a guarantee is due');
  }
});

test('a summon with a quoted price takes nothing when the price has changed (another page used the free one)', () => {
  const storage = new Map(), a = page(storage), b = page(storage);
  give(a.S, 100); const quoted = a.C.cost(); assert.equal(quoted, 0, 'page A shows "Summon for free"');
  assert.equal(b.C.pull(fixed(0.99, 0)).free, true); const dust = a.C.dust(); assert.ok(dust >= 100);
  const before = storage.get(V2), r = a.C.pull(fixed(0.99, 0), { expect: quoted });
  eq(plain(r), { ok: false, reason: 'price', cost: 60, dust }); assert.equal(a.C.dust(), dust); assert.equal(storage.get(V2), before, 'nothing changed');
  const again = a.C.pull(fixed(0.99, 0), { expect: a.C.cost() }); assert.equal(again.ok, true); assert.equal(again.cost, 60); assert.equal(again.free, false);
  /* Without a quote the call works as before; a quote that matches the free summon is taken too. */
  assert.equal(typeof a.C.pull(fixed(0.99, 0)).ok, 'boolean'); const c = page(); assert.equal(c.C.pull(fixed(0.99, 0), { expect: 0 }).free, true);
});

test('drills: 2 stardust each, counted once per call; perk "drill" doubles it', () => {
  const { C, S } = page();
  const first = C.onDrillDone(); eq(types(first), ['drill', 'achievement:drill-1']); assert.equal(first[0].dust, 2);
  eq(plain(C.onDrillDone()), [{ type: 'drill', dust: 2 }]); assert.equal(S.meta().drills, 2); assert.equal(C.dust(), 2 + 15 + 2);
  own(S, figWith('drill').id); C.equip(figWith('drill').id);
  assert.equal(C.onDrillDone()[0].dust, 4); assert.equal(S.meta().drills, 3);
});

test('perk "secondlook": once per mission, kept across pages, only while that figure is equipped', () => {
  const storage = new Map(), { C, S } = page(storage), look = figWith('secondlook');
  assert.equal(C.secondLookAvailable('la', 'q01'), false); assert.equal(C.useSecondLook('la', 'q01'), false);
  own(S, look.id); own(S, figWith('drill').id); C.equip(look.id);
  assert.equal(C.secondLookAvailable('la', 'q01'), true); assert.equal(C.useSecondLook('la', 'q01'), true);
  assert.equal(C.secondLookAvailable('la', 'q01'), false); assert.equal(C.useSecondLook('la', 'q01'), false, 'once per mission');
  assert.equal(C.secondLookAvailable('la', 'q02'), true); assert.equal(C.secondLookAvailable('found', 'q01'), true, 'missions are counted per realm');
  assert.equal(page(storage).C.secondLookAvailable('la', 'q01'), false, 'still used after a reload');
  C.equip(figWith('drill').id); assert.equal(C.secondLookAvailable('la', 'q02'), false);
  assert.equal(C.secondLookAvailable('la'), false); assert.equal(C.useSecondLook(null, 'q01'), false);
  const dust = C.dust(); C.equip(look.id); C.useSecondLook('la', 'q02'); assert.equal(C.dust(), dust, 'no perk gives or takes stardust by itself');
});

test('every achievement is false on an empty save, can be reached, and is paid once', () => {
  const storage = new Map(), { C, S, A } = page(storage);
  S.load();
  const empty = C.context(); for (const a of A) { assert.equal(a.test(empty), false, a.id + ' on an empty save'); if (a.progress) assert.equal(a.progress(empty).have, 0, a.id); }
  /* Play everything: both realms finished with stars and every landmark, 25 drills, every figure, one at 5 stars. */
  /* Each realm with all its practice missions as well (ids ending in b, c, d): "Full span" needs all 272 linear algebra
     missions and "Bedrock" all 160 of Foundations. The registry's count stands even where the page knows fewer missions. */
  const everyMission = n => ids(n).concat(ids(n).flatMap(q => ['b', 'c', 'd'].map(l => q + l)));
  S.putRealm('la', slice(everyMission(68), ids(20), { landmarks: [0, 1, 2, 3, 4, 5, 6, 7] }));
  S.putRealm('found', slice(everyMission(40), ids(8), { landmarks: [0, 1, 2, 3, 4, 5, 6] }));
  S.putRealm('calc1', slice(everyMission(40), ids(8), { landmarks: [0, 1, 2, 3, 4, 5, 6] }));
  for (const p of LATER) { assert.equal(p.missions, 4 * p.learn, p.id + ': one learn and three practice missions per concept'); S.putRealm(p.id, slice(everyMission(p.learn), ids(8), { landmarks: [0, 1, 2, 3, 4, 5, 6] })); }
  const seen = [...C.settle(LA), ...C.settle(FOUND), ...C.settle(CALC1)];
  for (const p of LATER) seen.push(...C.settle(realmCtx(p.id, p.learn, 7)));
  for (let i = 0; i < 25; i++) seen.push(...C.onDrillDone());
  give(S, 1000000);
  const rng = mulberry(7); let pulls = 0;
  while ((C.counts().owned < FIXTURE.length || C.context().copiesMax < 5) && pulls++ < 5000) seen.push(...C.pull(rng).events);
  assert.equal(C.counts().owned, FIXTURE.length);
  seen.push(...C.equip('fig01').events);
  const got = seen.filter(e => e.type === 'achievement');
  eq(got.map(e => e.id).sort(), A.map(a => a.id).sort(), 'each achievement was announced exactly once');
  for (const e of got) { const a = A.find(x => x.id === e.id); eq(plain(e), { type: 'achievement', id: a.id, name: a.name, text: a.text, dust: a.reward }); }
  eq(plain(S.meta().ach).sort(), A.map(a => a.id).sort());
  const list = C.achievements(); assert.ok(list.every(a => a.earned)); assert.ok(list.filter(a => a.progress).every(a => a.progress.have === a.progress.need));
  /* Nothing is paid a second time, here or on another page. */
  const dust = C.dust();
  eq(C.settle(LA), []); eq(C.settle(FOUND), []); eq(page(storage).C.settle(), []); eq(plain(C.equip('fig02').events), []);
  assert.equal(C.dust(), dust);
});

test('achievement thresholds: one short is not enough; progress counts up and is listed earned first', () => {
  const { C, S, A } = page();
  const base = C.context(), at = (over) => Object.assign({}, base, over);
  const goals = { 'solve-5': ['solved', 5], 'solve-10': ['solved', 10], 'solve-25': ['solved', 25], 'solve-50': ['solved', 50], 'solve-100': ['solved', 100], 'star-10': ['stars', 10], 'star-25': ['stars', 25], 'chapter-3': ['chapters', 3],
    'two-realms': ['realmsWithSolves', 2], 'drill-10': ['drills', 10], 'drill-25': ['drills', 25], 'pull-10': ['pulls', 10], 'figures-5': ['figures', 5], 'figures-15': ['figures', 15], 'figures-30': ['figures', 30], 'five-star': ['copiesMax', 5] };
  for (const [id, [field, goal]] of Object.entries(goals)) {
    const a = A.find(x => x.id === id); assert.ok(a, id);
    assert.equal(a.test(at({ [field]: goal - 1 })), false, id + ' one short'); assert.equal(a.test(at({ [field]: goal })), true, id);
    eq(plain(a.progress(at({ [field]: goal - 1 }))), { have: goal - 1, need: goal }); eq(plain(a.progress(at({ [field]: goal + 50 }))), { have: goal, need: goal });
  }
  /* Finished realms need the mission count from the registry (or from the realm page). */
  /* Foundations: 40 learn missions (complete) and 160 missions with practice (finished). A practice id ends in a letter. */
  const withPractice = n => ids(40).concat(ids(40).flatMap(q => ['b', 'c', 'd'].map(l => q + l)).slice(0, n));
  S.putRealm('found', slice(ids(39).concat(['q01b', 'q01c']))); assert.equal(C.context().realms.found.complete, false, 'practice does not stand in for a concept'); assert.equal(C.context().practice, 2);
  assert.equal(C.context().realms.found.missions, 160); assert.equal(C.context().realms.found.learn, 40);
  S.putRealm('found', slice(ids(40))); assert.equal(C.context().realms.found.complete, true); assert.equal(C.context().realms.found.finished, false); assert.equal(C.context().realms.la, undefined);
  assert.equal(A.find(a => a.id === 'found-done').test(C.context()), true); assert.equal(A.find(a => a.id === 'found-master').test(C.context()), false);
  S.putRealm('found', slice(withPractice(119))); assert.equal(C.context().realms.found.finished, false);
  S.putRealm('found', slice(withPractice(120))); assert.equal(C.context().realms.found.finished, true); assert.equal(A.find(a => a.id === 'found-master').test(C.context()), true);
  S.putRealm('found', slice(ids(40)));
  /* Linear algebra: 68 learn missions (complete, "Master of arrows" as in 2.1) and 272 with practice (finished, "Full span"). */
  {
    const laWith = n => ids(68).concat(ids(68).flatMap(q => ['b', 'c', 'd'].map(l => q + l)).slice(0, n)), ach = id => A.find(a => a.id === id).test(C.context());
    S.putRealm('la', slice(ids(67).concat(['q01b', 'q01c', 'q01d']))); assert.equal(C.context().realms.la.complete, false, 'practice does not stand in for a concept'); assert.equal(ach('la-done'), false);
    assert.equal(C.context().realms.la.missions, 272); assert.equal(C.context().realms.la.learn, 68);
    S.putRealm('la', slice(ids(68))); assert.equal(C.context().realms.la.complete, true); assert.equal(C.context().realms.la.finished, false);
    assert.equal(ach('la-done'), true, 'the 68 learn missions earn "Master of arrows", as before practice existed'); assert.equal(ach('la-master'), false);
    S.putRealm('la', slice(laWith(203))); assert.equal(ach('la-master'), false);
    S.putRealm('la', slice(laWith(204))); assert.equal(C.context().realms.la.finished, true); assert.equal(ach('la-master'), true);
    /* On the realm page while practice is still being written (69 missions exist): the registry's 272 stands, so
       solving what exists is not "every mission". */
    const partial = Object.assign({}, LA, { missions: 69, learn: 68 });
    S.putRealm('la', slice(ids(68).concat(['q01b'])));
    const paidNow = C.settle(partial).filter(e => e.type === 'achievement').map(e => e.id);
    assert.ok(paidNow.includes('la-done'), 'the page pays "Master of arrows" for the 68 learn missions'); assert.ok(!paidNow.includes('la-master') && !S.meta().ach.includes('la-master'), 'a half-written pack is not finished early');
    S.reset('la');
  }
  S.putRealm('mystery', slice(ids(500))); assert.equal(C.context().realms.mystery.finished, false, 'a realm with no known mission count is never "finished"');
  /* Every landmark of a realm: the realm finished, its chapters paid, and as many landmarks as chapters. */
  S.putRealm('found', slice(ids(40), [], { landmarks: [0, 1, 2, 3, 4, 5] })); C.settle(FOUND); assert.equal(C.context().landmarkRealm, false); assert.equal(C.context().landmarks, 6);
  S.putRealm('found', slice(ids(40), [], { landmarks: [0, 1, 2, 3, 4, 5, 6] })); assert.equal(C.context().landmarkRealm, true);
  assert.ok(types(C.settle(FOUND)).includes('achievement:landmark-all'));
  /* A field set: every figure of one field. */
  const maths = FIXTURE.filter(f => f.field === 'Mathematics');
  maths.slice(0, 11).forEach(f => own(S, f.id)); own(S, FIXTURE.find(f => f.field === 'Physics').id);
  eq(plain(C.context().fieldBest), { have: 11, need: 12 }); assert.equal(C.context().fieldDone, false);
  own(S, maths[11].id); assert.equal(C.context().fieldDone, true); assert.ok(types(C.settle()).includes('achievement:field-set'));
  const list = C.achievements(), firstOpen = list.findIndex(a => !a.earned);
  assert.ok(firstOpen > 0 && list.slice(firstOpen).every(a => !a.earned), 'earned ones come first');
  eq(plain(list.find(a => a.id === 'solve-50')), { id: 'solve-50', name: 'Halfway to a hundred', text: 'Solve 50 missions.', reward: 80, earned: true, progress: { have: 50, need: 50 } });
  eq(plain(list.find(a => a.id === 'figures-15').progress), { have: 13, need: 15 });
  assert.equal(list.find(a => a.id === 'legendary').progress, null);
});

test('an achievement keeps being earned after its cause is gone, and a broken one cannot stop the others', () => {
  const { C, S, window } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(5)) } })]]));
  window.VG_ACHIEVEMENTS = [{ id: 'boom', name: 'Boom', text: 'Throws.', reward: 20, test() { throw Error('x'); }, progress() { throw Error('y'); } }, null, { id: 'no-test' }, ...window.VG_ACHIEVEMENTS];
  assert.ok(types(C.settle()).includes('achievement:solve-5'));
  S.reset('la'); eq(C.settle(), []);
  const list = C.achievements(); assert.equal(list.find(a => a.id === 'solve-5').earned, true); assert.equal(list.find(a => a.id === 'boom').earned, false); assert.equal(list.find(a => a.id === 'boom').progress, null);
});

test('export and import carry the collection; a 1.x import and a realm reset leave it alone; resetAll clears it', () => {
  const a = page(new Map([[V2, JSON.stringify({ v: 2, seed: 9, intro: true, realms: { la: slice(ids(12), ['q01']), found: slice(ids(3)) } })]]));
  a.C.settle(LA); a.C.pull(fixed(0.01, 0)); a.C.equip(a.C.owned()[0].id); a.C.onDrillDone(); a.C.useSecondLook('la', 'q01');
  const backup = a.S.exportAll(), meta = plain(a.S.meta());
  eq(plain(backup.meta), meta); assert.ok(meta.dust > 0 && meta.equipped && meta.ach.length && meta.pulls === 1 && meta.drills === 1);
  const b = page(new Map(), { VG_SEED: 3 });
  assert.equal(b.S.importAny(plain(backup)).ok, true);
  eq(plain(b.S.meta()), meta); eq(plain(b.S.exportAll()), plain(backup), 'round trip');
  eq(b.C.settle(LA), []); assert.equal(b.C.dust(), meta.dust); assert.equal(b.C.equipped().id, meta.equipped);
  /* A 1.x backup replaces linear algebra only. Its missions were already paid, so nothing new is paid. */
  assert.equal(b.S.importAny({ solved: ids(4), tools: [], xp: 400, seed: 5 }).ok, true);
  eq(plain(b.S.meta()), meta); eq(b.C.settle(LA), []);
  b.S.reset('found'); eq(plain(b.S.meta()), meta, 'reset(realm) leaves the collection');
  b.S.resetAll(); assert.equal('meta' in b.S.exportAll(), false); assert.equal(b.C.dust(), 0); eq(plain(b.C.owned()), []); assert.equal(b.C.cost(), 0);
});

test('figure and achievement ids this build does not know are kept', () => {
  const stored = { v: 2, seed: 1, realms: { la: slice(['q01']) }, meta: { v: 1, dust: 500, earned: 900, owned: { ghost: 2, fig01: 1 }, equipped: 'ghost', ach: ['retired-one'], pulls: 3, sinceRare: 1, sinceLegend: 3, paid: {}, drills: 0, later: { kept: true } } };
  const { C, S } = page(new Map([[V2, JSON.stringify(stored)]]));
  assert.equal(C.equipped(), null, 'an unknown figure shows as nothing equipped'); assert.equal(C.perk(), null);
  C.settle(); C.pull(fixed(0.99, 0)); C.onDrillDone();
  const m = S.meta();
  assert.equal(m.owned.ghost, 2); assert.equal(m.owned.fig01, 2); assert.equal(m.equipped, 'ghost'); assert.ok(m.ach.includes('retired-one')); eq(plain(m.later), { kept: true });
  assert.equal(C.counts().owned, 1, 'only known figures are listed'); assert.equal(C.context().figures, 2);
});

test('storage that cannot be written: nothing is paid or summoned, and nothing throws', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 5, realms: { la: slice(ids(9), ['q01']) }, meta: { v: 1, dust: 200, owned: { fig05: 1 }, pulls: 4 } })]]);
  const before = storage.get(V2);
  const { C, S } = page(storage, {}, { getItem: k => storage.has(k) ? storage.get(k) : null, setItem() { throw Error('QuotaExceeded'); }, removeItem() {} });
  eq(C.settle(LA), []); eq(C.onDrillDone(), []); assert.equal(C.stored(), false);
  eq(plain(C.pull(fixed(0.5, 0))), { ok: false, reason: 'storage' });
  eq(plain(C.equip('fig05')), { ok: false, reason: 'storage', events: [] }); assert.equal(C.useSecondLook('la', 'q01'), false);
  assert.equal(C.dust(), 200); assert.equal(S.meta().pulls, 4); assert.equal(C.equipped(), null); assert.equal(storage.get(V2), before);
  assert.equal(S.putMeta(S.meta()), false);
});

test('storage that is blocked altogether: the page keeps the collection in memory, as it does for progress', () => {
  const thrower = { getItem() { throw Error('SecurityError'); }, setItem() { throw Error('QuotaExceeded'); }, removeItem() { throw Error('x'); } };
  const { C, S } = page(new Map(), {}, thrower);
  S.putRealm('la', slice(ids(3), ['q01']));
  const ev = C.settle(); assert.equal(ev.filter(e => e.type === 'solve').length, 3); assert.equal(C.stored(), false);
  assert.equal(C.dust(), total(ev)); eq(C.settle(), []);
  const r = C.pull(fixed(0.99, 0)); assert.equal(r.ok, true); assert.equal(C.owned().length, 1); assert.equal(C.equip(r.figure.id).ok, true);
  /* No store at all. */
  const bare = { VG_FIGURES: FIXTURE }; vm.runInNewContext(SRC.ach, { window: bare, Math, JSON }); vm.runInNewContext(SRC.core, { window: bare, Math, JSON });
  eq(bare.VGCollection.settle(), []); eq(bare.VGCollection.onDrillDone(), []); assert.equal(bare.VGCollection.pull().ok, false); assert.equal(bare.VGCollection.dust(), 0); assert.equal(bare.VGCollection.achievements().length, bare.VG_ACHIEVEMENTS.length);
});

test('summary and describe turn a list of events into totals and one short line', () => {
  const { C } = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { la: slice(ids(9), ['q01', 'q02']) } })]]));
  const ev = C.settle(LA), s = C.summary(ev);
  assert.equal(s.solves, 9); assert.equal(s.stars, 2); assert.equal(s.chapters, 1); assert.equal(s.drills, 0); assert.equal(s.dust, total(ev)); eq(s.achievements.map(a => a.id), ['solve-1', 'solve-5', 'star-1', 'chapter-1']);
  assert.equal(C.describe(ev), '+' + total(ev) + ' stardust · 9 missions solved, 2 first-try stars, chapter finished, 4 achievements');
  assert.equal(C.describe([{ type: 'solve', realm: 'la', qid: 'q01', dust: 10 }]), '+10 stardust · mission solved');
  assert.equal(C.describe([{ type: 'achievement', id: 'x', name: 'First light', text: '', dust: 15 }]), '+15 stardust · achievement: First light');
  assert.equal(C.describe([]), ''); assert.equal(C.describe(null), ''); eq(plain(C.summary(undefined)), { dust: 0, solves: 0, stars: 0, chapters: 0, drills: 0, achievements: [], finds: [] });
});

test('the real figure list (when it exists) works with these rules', () => {
  const file = path.resolve(__dirname, '../game/collection/figures.js');
  if (!fs.existsSync(file)) { console.log('     (game/collection/figures.js is not there yet: skipped)'); return; }
  const w = {}; vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window: w });
  const real = w.VG_FIGURES; assert.ok(Array.isArray(real) && real.length >= 30, 'at least 30 figures, so "30 different figures" can be reached');
  const { C, S } = page(new Map(), { VG_FIGURES: real });
  for (const r of ['common', 'rare', 'legendary']) assert.ok(C.counts().byRarity[r].total > 0, 'has ' + r + ' figures');
  assert.equal(C.counts().total, real.length, 'every figure has an id');
  for (const f of real) { assert.ok(['common', 'rare', 'legendary'].includes(f.rarity), f.id + ' rarity'); assert.ok(C.perkInfo(f.perk), f.id + ' has a known perk: ' + f.perk); }
  for (const perk of ['stardust', 'chapter', 'secondlook', 'drill']) assert.ok(real.some(f => C.perkInfo(f.perk).id === perk), 'some figure has the perk ' + perk);
  give(S, 60 * 5000); const rng = mulberry(42); for (let i = 0; i < 5000; i++) assert.equal(C.pull(rng).ok, true);
  assert.equal(C.counts().owned, real.length, '5,000 summons find every figure'); assert.equal(C.context().fieldDone, true);
  assert.equal(C.equip(real[0].id).ok, true);
});

console.log(`PASS: ${count} collection tests.`);
