/* Tests for visible mastery (game/mastery.js): the bronze, silver and gold rule, the counts from a pack's missions
   (realm page) and from a slice alone (home page), the mission-card badge, and the wiring into the pages.
   Plain Node, no dependencies. Usage: node qa/mastery.test.js */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');
const read = f => fs.readFileSync(path.join(game, f), 'utf8');
const plain = o => JSON.parse(JSON.stringify(o));
let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function load(extra = {}) { const window = { ...extra }; vm.runInNewContext(read('mastery.js'), { window }); return window.VGMastery; }
const packsWindow = {}; vm.runInNewContext(read('realms/packs.js'), { window: packsWindow });
const PACKS = packsWindow.VG_PACKS;
const regWindow = {}; vm.runInNewContext(read('realms/registry.js'), { window: regWindow });
/* A pack's missions, loaded the way realm.html loads them (data scripts only). */
function quests(id) {
  const window = {}, ctx = { window, Math, JSON, console: { log() {}, warn() {} } };
  for (const f of PACKS[id].scripts) { if (/handson|glossary|skip|lab|docking|board|life/.test(f)) continue; try { vm.runInNewContext(read(f), ctx); } catch (e) { /* page-only script */ } }
  return window.QUESTS;
}

test('the rule: learn only is bronze, two practice is silver, all three is gold, nothing without the learn mission', () => {
  const M = load();
  assert.equal(M.level(false, 3, 3), null, 'practice without the learn mission does not count');
  assert.equal(M.level(true, 0, 3), 'bronze'); assert.equal(M.level(true, 1, 3), 'bronze');
  assert.equal(M.level(true, 2, 3), 'silver'); assert.equal(M.level(true, 3, 3), 'gold'); assert.equal(M.level(true, 9, 3), 'gold');
  assert.equal(M.level(true, 0, 0), 'bronze', 'a concept with no practice stays bronze');
  assert.equal(M.level(true, 1, 2), 'silver'); assert.equal(M.level(true, 2, 2), 'gold'); assert.equal(M.level(true, 0, 1), 'bronze'); assert.equal(M.level(true, 1, 1), 'gold');
  assert.match(M.RULE_TEXT, /Bronze: the learn mission is solved\. Silver: two of its practice missions too\. Gold: all of its practice missions\./);
});

test('counts on the realm page come from the pack: every written pack has 40 or more concepts with three practice missions each', () => {
  const M = load();
  for (const id of Object.keys(PACKS).filter(k => PACKS[k].status !== 'coming')) {
    const qs = quests(id); if (!Array.isArray(qs)) continue;
    const learn = qs.filter(q => !q.parent), c0 = M.fromQuests(qs, []);
    assert.equal(c0.concepts, learn.length, id); assert.equal(c0.gold + c0.silver + c0.bronze, 0, id);
    const all = M.fromQuests(qs, qs.map(q => q.id)); assert.equal(all.gold, learn.filter(q => qs.some(p => p.parent === q.id)).length, id + ': everything solved is gold');
  }
  const qs = quests('found'), q1 = qs.find(q => !q.parent), kids = qs.filter(q => q.parent === q1.id).map(q => q.id);
  assert.equal(kids.length, 3);
  assert.equal(M.fromQuests(qs, [q1.id]).by[q1.id], 'bronze');
  assert.equal(M.fromQuests(qs, [q1.id, kids[0]]).by[q1.id], 'bronze');
  assert.equal(M.fromQuests(qs, [q1.id, kids[0], kids[2]]).by[q1.id], 'silver');
  assert.equal(M.fromQuests(qs, [q1.id, ...kids]).by[q1.id], 'gold');
  assert.equal(M.fromQuests(qs, kids).by[q1.id], null);
  assert.deepEqual(plain(M.fromQuests(null, null)), { gold: 0, silver: 0, bronze: 0, concepts: 0, by: {} });
});

test('counts on the home page come from the slice alone, and agree with the pack', () => {
  const M = load(), qs = quests('found'), rng = (() => { let a = 7; return () => (a = (a * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 50; i++) {
    const solved = qs.map(q => q.id).filter(() => rng() < 0.5), a = M.fromQuests(qs, solved), b = M.fromSlice({ solved }, 3);
    assert.deepEqual([b.gold, b.silver, b.bronze], [a.gold, a.silver, a.bronze]);
  }
  assert.deepEqual(plain(M.fromSlice({ solved: ['q01', 'q01b', 'q01c', 'q02', 'q03b', 'x', 7] }, 3)), { gold: 0, silver: 1, bronze: 1, concepts: 2, by: { q01: 'silver', q02: 'bronze' } });
  assert.equal(M.fromSlice(null).concepts, 0); assert.equal(M.fromSlice({ solved: 'q01' }).concepts, 0);
  const parts = regWindow.VG_REALMS.flatMap(n => n.parts || []).filter(p => p.status === 'ready');
  for (const p of parts) assert.equal(M.perConcept(p), 3, p.id);
  assert.equal(M.perConcept({}), 3); assert.equal(M.perConcept({ missions: 40, learn: 40 }), 0);
  assert.equal(M.countText({ gold: 2, silver: 1, bronze: 4 }), '2 gold · 1 silver · 4 bronze'); assert.equal(M.countText({ gold: 0, silver: 0, bronze: 0 }), ''); assert.equal(M.countText(null), '');
});

test('the mission-card badge: learn missions only, named in words, with the rule as its tooltip', () => {
  const M = load(), q = { id: 'q04', title: 'x' }, ps = [{ id: 'q04b' }, { id: 'q04c' }, { id: 'q04d' }];
  assert.equal(M.cardBadge(q, [], ps), '');
  assert.match(M.cardBadge(q, ['q04'], ps), /data-level="bronze"[^>]*>.*Bronze<span class="mastery-sr"> mastery<\/span>/);
  assert.match(M.cardBadge(q, ['q04', 'q04b', 'q04d'], ps), /Silver/); assert.match(M.cardBadge(q, ['q04', 'q04b', 'q04c', 'q04d'], ps), /Gold/);
  assert.equal(M.cardBadge({ id: 'q04b', parent: 'q04' }, ['q04', 'q04b'], []), '', 'practice cards have no badge');
  assert.match(M.cardBadge(q, ['q04'], ps), /title="Bronze: the learn mission is solved\./);
  assert.equal(M.badgeHtml('platinum'), '');
});

test('wiring: realm page and home page load it, the card asks it, and nothing is required of a pack', () => {
  const realm = read('realm.html'), index = read('index.html'), app = read('app.js'), home = read('shell/home.js');
  assert.match(realm, /<script src="realms\/packs\.js"><\/script><script src="mastery\.js"><\/script>/);
  assert.equal((realm.match(/href="mastery\.css"/g) || []).length, 1); assert.equal((index.match(/href="mastery\.css"/g) || []).length, 1);
  assert.equal((index.match(/<script src="mastery\.js"><\/script>/g) || []).length, 1);
  assert.match(app, /function questCard\(q\)\{[^\n]*window\.VGMastery\?\.cardBadge\?\.\(q,state\.solved,practiceOf\(q\.id\)\)\|\|''/);
  assert.match(home, /function masteryText\(r\)/); assert.match(home, /'Mastery: '\+medals/);
  for (const f of ['mastery.js', 'mastery.css']) assert.ok(read('sw.js').includes("'" + f + "'") || read('sw.js').includes('"' + f + '"'), f + ' is in the precache');
  const css = read('mastery.css'); assert.doesNotMatch(css, /font-size:(?:[0-9]|1[01])px/, 'text 12px or larger');
  /* Loads without a document, as Node does. */
  const w = {}; vm.runInNewContext(read('mastery.js'), { window: w }); assert.equal(typeof w.VGMastery.level, 'function');
});

console.log('PASS: ' + count + ' mastery tests.');
