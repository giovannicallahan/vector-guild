/* Shell logic: soft locks, progress text, card model, 3D/flat choice, Android Back, star-map label placement
   and a few source checks (shader smoothstep order, list overlay guards).
   Loads game/shell/shell.js without a window (the page part returns early) and game/realms/registry.js in a vm.
   Run: node qa/shell.test.js (VERBOSE=1 lists each group). */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');

/* require() runs shell.js as a CommonJS module with no window, so only the pure helpers load. */
const L = require(game + '/shell/shell.js');
for (const name of ['solvedCount', 'progressText', 'enterHref', 'softLock', 'hasProgress', 'cardModel', 'chooseMode', 'backAction', 'overlayState', 'backupMessage', 'placeLabels']) assert.equal(typeof L[name], 'function', name + ' is exported');

const shellSrc = fs.readFileSync(game + '/shell/shell.js', 'utf8');
const shellCss = fs.readFileSync(game + '/shell/shell.css', 'utf8');
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
  /* Back and Escape share overlayState: a card cannot be open under the list, and a list shown because the
     WebGL context is lost has no map behind it, so Back leaves the app instead of showing a dead map. */
  const act = s => L.backAction(L.overlayState(s));
  assert.equal(act({}), null);
  assert.equal(act({ cardOpen: true }), 'card');
  assert.equal(act({ listOverlay: true }), 'list');
  assert.equal(act({ listOverlay: true, cardOpen: true }), 'list', 'a card under the list is never the thing Back closes');
  assert.equal(act({ listOverlay: true, contextLost: true }), null, 'context lost: the list cannot be closed');
  assert.equal(act({ listOverlay: true, contextLost: true, dialogOpen: true }), 'dialog');
  assert.equal(act({ contextLost: true, cardOpen: true }), 'card');
}, 'Back with the list open and with the context lost');

check(() => {
  assert.equal(L.backupMessage(false), 'Backup file made: mathcosmos-save.json.');
  const viaPicker = L.backupMessage(true);
  assert.doesNotMatch(viaPicker, /made|saved|\.json/i, 'Android: no success claim and no file name before the picker is confirmed');
  assert.match(viaPicker, /Choose where/);
  assert.match(shellSrc, /backupMessage\(!!root\.AndroidSave\)/, 'the export handler asks whether the Android bridge is present');
}, 'backup message');

check(() => {
  const hit = (a, b) => a.x < b.x + b.w - 1e-6 && b.x < a.x + a.w - 1e-6 && a.y < b.y + b.h - 1e-6 && b.y < a.y + a.h - 1e-6;
  const rects = (items, ys) => items.map((it, i) => ({ x: it.x, y: ys[i], w: it.w, h: it.h }));
  const clear = (items, ys, top, bottom, label) => {
    const r = rects(items, ys);
    for (let i = 0; i < r.length; i++) {
      assert.ok(r[i].y >= top - 1e-6 && r[i].y + r[i].h <= bottom + 1e-6, label + ': label ' + i + ' stays on the stage');
      for (let j = i + 1; j < r.length; j++) assert.ok(!hit(r[i], r[j]), label + ': labels ' + i + ' and ' + j + ' overlap');
    }
  };
  /* Nothing in the way: nothing moves. */
  const apart = [{ x: 0, y: 100, w: 80, h: 36, depth: 1 }, { x: 200, y: 100, w: 80, h: 36, depth: 0 }];
  assert.deepEqual(L.placeLabels(apart, 0, 800), [100, 100]);
  /* Two on the same spot: the nearer one keeps its place, the other moves by one row. */
  const same = [{ x: 10, y: 300, w: 120, h: 36, depth: -5 }, { x: 40, y: 300, w: 120, h: 36, depth: 5 }];
  const ys = L.placeLabels(same, 0, 800);
  assert.equal(ys[1], 300, 'the nearer label is not moved');
  assert.equal(Math.abs(ys[0] - 300), 36);
  assert.equal(L.placeLabels(same.map((it, i) => i ? it : { ...it, y: 302, prev: -10 }), 0, 800)[0], 264, 'a label keeps the side it was on');
  assert.equal(L.placeLabels(same, 290, 800)[0], 336, 'no room above: it goes below');
  /* The measured failure: 11 nowrap pills (70-215px wide) in a 375px-wide portrait stage, all in one narrow band. */
  let seed = 12345;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const widths = [118, 84, 92, 215, 70, 132, 198, 196, 208, 96, 86];
  for (let run = 0; run < 400; run++) {
    const W = 375, top = 150, bottom = 800;
    const items = widths.map(w => ({ x: Math.max(4, Math.min(W - w - 4, rnd() * W - w / 2)), y: 350 + rnd() * 180, w: w + 6, h: 36, depth: rnd() * 40 - 20, prev: rnd() * 80 - 40 }));
    clear(items, L.placeLabels(items, top, bottom), top, bottom, 'portrait run ' + run);
  }
  /* Labels crowded against the top or the bottom edge still clear each other. */
  for (let run = 0; run < 200; run++) {
    const items = widths.map(w => ({ x: rnd() * 150, y: run % 2 ? rnd() * 60 : 760 + rnd() * 60, w: w + 6, h: 36, depth: rnd() }));
    clear(items, L.placeLabels(items, 100, 800), 100, 800, 'edge run ' + run);
  }
  /* More labels than fit: still returns a place for each, inside the stage. */
  const many = Array.from({ length: 30 }, (_, i) => ({ x: 0, y: 50, w: 100, h: 36, depth: i }));
  const out = L.placeLabels(many, 0, 200);
  assert.equal(out.length, 30);
  assert.ok(out.every(y => y >= 0 && y <= 164));
  /* Only the pill takes taps, and it keeps a 44px touch area. */
  assert.match(shellCss, /\.vg-node\{[^}]*pointer-events:none/, '.vg-node box must not take taps');
  assert.match(shellCss, /\.vg-pill\{[^}]*pointer-events:auto/);
  assert.match(shellCss, /\.vg-pill::before\{[^}]*height:44px/);
  assert.match(shellSrc, /placeLabels\(items,/, 'mapFrame runs the de-overlap pass');
}, 'star-map labels never overlap');

check(() => {
  /* GLSL ES: smoothstep(edge0, edge1, x) is undefined unless edge0 < edge1. Edges here are numbers or uDepth*number. */
  const calls = [...shellSrc.matchAll(/smoothstep\(([^,()]+),([^,()]+),/g)];
  assert.ok(calls.length >= 3, 'found the shader smoothstep calls');
  const val = e => { assert.match(e, /^(uDepth\*)?\d+(\.\d+)?$/, 'edge is a number or uDepth*number: ' + e); return e.startsWith('uDepth*') ? 300 * +e.slice(7) : +e; };
  for (const c of calls) assert.ok(val(c[1]) < val(c[2]), 'smoothstep edges must ascend: ' + c[0]);
}, 'shader smoothstep edges ascend');

check(() => {
  /* The list overlay takes the stage out of the Tab order, and a context-lost list cannot be closed. */
  assert.match(shellSrc, /function openList\(auto\)\{[\s\S]*?setStageInert\(true\)/);
  assert.match(shellSrc, /closeList=function\(\)\{\s*if\(!listOverlay\|\|contextLost\)return;[\s\S]*?setStageInert\(false\)/);
  assert.match(shellSrc, /listBack\.hidden=contextLost/);
}, 'list overlay guards');

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
