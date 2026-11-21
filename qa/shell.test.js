/* Shell logic: soft locks, progress text, card model, 3D/flat choice and Android Back.
   Loads game/shell/shell.js without a window (the page part returns early) and game/realms/registry.js in a vm.
   Run: node qa/shell.test.js (VERBOSE=1 lists each group). */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');

/* require() runs shell.js as a CommonJS module with no window, so only the pure helpers load. */
const L = require(game + '/shell/shell.js');
for (const name of ['solvedCount', 'progressText', 'enterHref', 'softLock', 'hasProgress', 'cardModel', 'chooseMode', 'backAction']) assert.equal(typeof L[name], 'function', name + ' is exported');

const win = {};
vm.runInNewContext(fs.readFileSync(game + '/realms/registry.js', 'utf8'), { window: win });
const REALMS = JSON.parse(JSON.stringify(win.VG_REALMS || null)); /* copy into this realm so deepEqual sees plain arrays */
assert.ok(Array.isArray(REALMS) && REALMS.length > 0, 'registry loads');
const node = id => REALMS.find(r => r.node === id);
const saveWith = slices => id => slices[id] || null;
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
let checks = 0;
const check = (fn, label) => { fn(); checks++; if (process.env.VERBOSE) console.log('ok -', label); };

check(() => {
  assert.equal(L.solvedCount(null, 40), 0);
  assert.equal(L.solvedCount({ solved: 'q01' }, 40), 0);
  assert.equal(L.solvedCount({ solved: ['q01', 'q01', 'q02', 7, null] }, 40), 2);
  assert.equal(L.solvedCount({ solved: ids(50) }, 40), 40, 'capped at the mission count');
  assert.equal(L.solvedCount({ solved: ids(50) }, 0), 50, 'uncapped when the count is unknown');
  assert.equal(L.solvedCount({ solved: ['__proto__', 'constructor'] }, 40), 2, 'odd ids still count once');
}, 'solved count');

check(() => {
  assert.equal(L.progressText(0, 40), '0 / 40 solved');
  assert.equal(L.progressText(12, 68), '12 / 68 solved');
  assert.equal(L.progressText(40, 40), '40 / 40 solved · complete');
  assert.equal(L.progressText(3, 0), '3 solved');
  assert.equal(L.enterHref('la'), 'realm.html?realm=la');
  assert.equal(L.enterHref('a b&c'), 'realm.html?realm=a%20b%26c');
}, 'progress text and links');

check(() => {
  const empty = saveWith({});
  const alg = L.softLock(node('alg'), REALMS, empty);
  assert.equal(alg.locked, true);
  assert.deepEqual(alg.missing, ['found']);
  assert.match(alg.sentence, /^Algebra builds on Foundations, /);
  assert.equal(alg.sentence.split(/[.!?](\s|$)/).filter(s => s && s.trim()).length, 1, 'one sentence');
  assert.equal(alg.goName, 'Foundations');
  assert.equal(alg.goHref, 'realm.html?realm=found');
  assert.equal(L.softLock(node('found'), REALMS, empty).locked, false, 'Foundations builds on nothing');
  /* Discrete math has no ready part yet, so Number & graph theory is not held back by it. */
  assert.equal(L.softLock(node('num'), REALMS, empty).locked, false);
  /* Differential equations needs Calculus (nothing ready) and Algebra (linear algebra ready, unfinished). */
  const diff = L.softLock(node('diff'), REALMS, empty);
  assert.deepEqual(diff.missing, ['alg']);
  assert.equal(diff.goHref, 'realm.html?realm=la');
}, 'soft lock with no progress');

check(() => {
  const partway = saveWith({ found: { solved: ids(39), xp: 500 } });
  assert.equal(L.softLock(node('alg'), REALMS, partway).locked, true, '39 of 40 is not finished');
  const done = saveWith({ found: { solved: ids(40), xp: 520 } });
  assert.equal(L.softLock(node('alg'), REALMS, done).locked, false, 'finished Foundations unlocks Algebra');
  const both = saveWith({ found: { solved: ids(40) }, la: { solved: ids(68) } });
  assert.equal(L.softLock(node('diff'), REALMS, both).locked, false);
  const broken = id => { throw new Error('storage ' + id); };
  assert.equal(L.softLock(node('alg'), REALMS, broken).locked, true, 'a throwing save reads as no progress');
  const custom = [{ node: 'a', name: 'A', needs: [], parts: [{ id: 'pa', status: 'ready', missions: 2 }] },
    { node: 'b', name: 'B', needs: [], parts: [{ id: 'pb', status: 'ready', missions: 2 }] },
    { node: 'c', name: 'C', needs: ['a', 'b', 'zz'], parts: [] }];
  const two = L.softLock(custom[2], custom, saveWith({}));
  assert.equal(two.sentence, 'C builds on A and B, which you have not finished yet, but you can go in now.');
  assert.equal(L.joinNames(['A', 'B', 'C']), 'A, B and C');
}, 'soft lock with progress');

check(() => {
  const empty = saveWith({});
  assert.equal(L.hasProgress(REALMS, empty), false);
  assert.equal(L.hasProgress(REALMS, saveWith({ la: { solved: [], xp: 15 } })), true, 'XP alone counts');
  assert.equal(L.hasProgress(REALMS, saveWith({ found: { solved: ['q01'], xp: 0 } })), true);
  assert.equal(L.hasProgress(REALMS, saveWith({ abstract: { solved: ['q01'] } })), false, 'slices for parts that are not ready are ignored');

  const found = L.cardModel(node('found'), REALMS, empty);
  assert.equal(found.tag, 'Start here');
  assert.equal(found.startHere, true);
  assert.equal(found.single, true);
  assert.equal(found.parts[0].href, 'realm.html?realm=found');
  assert.equal(found.parts[0].text, '0 / 40 solved');
  assert.equal(found.lock.locked, false);
  const foundLater = L.cardModel(node('found'), REALMS, saveWith({ la: { solved: ['q01'], xp: 10 } }));
  assert.equal(foundLater.startHere, false, 'Start here is only for a player with no progress');
  assert.equal(foundLater.tag, 'Realm');

  const alg = L.cardModel(node('alg'), REALMS, saveWith({ la: { solved: ids(12) } }));
  assert.equal(alg.single, false);
  assert.equal(alg.enterLabel, 'Enter anyway');
  assert.deepEqual(alg.parts.map(p => [p.id, p.ready, p.text, p.href]), [
    ['la', true, '12 / 68 solved', 'realm.html?realm=la'],
    ['abstract', false, 'Not built yet', null]]);
  assert.equal(alg.started, true);

  const calc = L.cardModel(node('calc'), REALMS, empty);
  assert.equal(calc.ready, false);
  assert.ok(calc.parts.every(p => p.text === 'Not built yet' && p.href === null), 'coming parts have no Enter link');
  assert.equal(calc.lock.locked, false, 'nothing to enter, so no soft-lock sentence or Go button');
  assert.equal(L.softLock(node('calc'), REALMS, empty).locked, true, 'softLock itself still sees the unfinished need');
}, 'card model');

check(() => {
  assert.deepEqual(L.chooseMode({ three: true, webgl: true, introSeen: false, reducedMotion: false }), { mode: '3d', intro: true });
  assert.deepEqual(L.chooseMode({ three: true, webgl: true, introSeen: true, reducedMotion: false }), { mode: '3d', intro: false });
  assert.deepEqual(L.chooseMode({ three: true, webgl: true, introSeen: false, reducedMotion: true }), { mode: '3d', intro: false });
  assert.deepEqual(L.chooseMode({ three: false, webgl: true, introSeen: false }), { mode: 'flat', intro: false }, 'three.js failed to load');
  assert.deepEqual(L.chooseMode({ three: true, webgl: false, introSeen: false }), { mode: 'flat', intro: false }, 'no WebGL');
  assert.deepEqual(L.chooseMode({ three: true, webgl: true, forceFlat: true }), { mode: 'flat', intro: false });
  assert.deepEqual(L.chooseMode(), { mode: 'flat', intro: false });
}, 'mode choice');

check(() => {
  assert.equal(L.backAction({}), null, 'nothing open: Back leaves the app');
  assert.equal(L.backAction({ cardOpen: true }), 'card');
  assert.equal(L.backAction({ cardOpen: true, dialogOpen: true }), 'dialog');
  assert.equal(L.backAction({ listOpen: true }), 'list');
}, 'Android Back');

check(() => {
  /* Every registry node gets a card; every ready part links to realm.html with its own id. */
  for (const r of REALMS) {
    const m = L.cardModel(r, REALMS, saveWith({}));
    assert.equal(m.name, r.name);
    for (const p of m.parts) if (p.ready) assert.equal(p.href, 'realm.html?realm=' + p.id);
    for (const n of r.needs) assert.ok(node(n), r.node + ' needs a known node: ' + n);
  }
}, 'registry coverage');

console.log('shell logic: ' + checks + ' checks passed');
