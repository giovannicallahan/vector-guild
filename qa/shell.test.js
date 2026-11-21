/* Shell logic: soft locks, progress text, card model, 3D/flat choice, Android Back, star-map label placement
   and a few source checks (shader smoothstep order, list overlay guards, the hand-over to the home view).
   Mission counts are read from the registry, never written here. Also the collection interface
   (game/collection/ui.js): its pure helpers, how the shell loads and wires it, and its style rules.
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
/* How many missions each ready part has: whatever the registry says today. */
const count = id => { for (const r of REALMS) for (const p of r.parts) if (p.id === id) return p.missions; throw new Error('no part ' + id); };
const FOUND = count('found'), LA = count('la');
assert.ok(FOUND > 1 && LA > 1, 'both ready parts have missions');
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
  /* Differential equations needs Calculus (Calculus 1 ready, unfinished) and Algebra (linear algebra ready, unfinished). */
  const diff = L.softLock(node('diff'), REALMS, empty);
  assert.deepEqual(diff.missing, ['calc', 'alg']);
  assert.equal(diff.goHref, 'realm.html?realm=calc1');
}, 'soft lock with no progress');

check(() => {
  /* Foundations has optional practice missions (ids ending in a letter): the lock follows its learn missions alone. */
  const LEARN = REALMS.find(r => r.node === 'found').parts[0].learn || FOUND;
  const practice = ids(LEARN - 1).map(id => id + 'b');
  const partway = saveWith({ found: { solved: ids(LEARN - 1).concat(practice), xp: 500 } });
  assert.equal(L.softLock(node('alg'), REALMS, partway).locked, true, 'one concept short is not finished, however much practice is solved');
  const learned = saveWith({ found: { solved: ids(LEARN), xp: 500 } });
  assert.equal(L.softLock(node('alg'), REALMS, learned).locked, false, 'every concept learned unlocks Algebra without any practice');
  const LA_LEARN = REALMS.find(r => r.node === 'alg').parts[0].learn || LA;
  assert.equal(L.softLock(node('diff'), REALMS, saveWith({ la: { solved: ids(LA_LEARN - 1) } })).locked, true, 'one linear algebra concept short is not finished');
  const done = saveWith({ found: { solved: ids(FOUND), xp: 520 } });
  assert.equal(L.softLock(node('alg'), REALMS, done).locked, false, 'finished Foundations unlocks Algebra');
  /* Differential equations needs Algebra and Calculus: linear algebra and Calculus 1, the ready parts of each. */
  const both = saveWith({ found: { solved: ids(FOUND) }, la: { solved: ids(LA) } });
  assert.deepEqual(L.softLock(node('diff'), REALMS, both).missing, ['calc']);
  const three = saveWith({ found: { solved: ids(FOUND) }, la: { solved: ids(LA) }, calc1: { solved: ids(count('calc1')) } });
  assert.equal(L.softLock(node('diff'), REALMS, three).locked, false);
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
  assert.equal(found.parts[0].text, '0 / ' + FOUND + ' solved');
  assert.equal(found.parts[0].total, FOUND, 'the count comes from the registry');
  assert.equal(found.lock.locked, false);
  const foundLater = L.cardModel(node('found'), REALMS, saveWith({ la: { solved: ['q01'], xp: 10 } }));
  assert.equal(foundLater.startHere, false, 'Start here is only for a player with no progress');
  assert.equal(foundLater.tag, 'Realm');

  const alg = L.cardModel(node('alg'), REALMS, saveWith({ la: { solved: ids(12) } }));
  assert.equal(alg.single, false);
  assert.equal(alg.enterLabel, 'Enter anyway');
  assert.deepEqual(alg.parts.map(p => [p.id, p.ready, p.text, p.href]), [
    ['la', true, '12 / ' + LA + ' solved', 'realm.html?realm=la'],
    ['abstract', false, 'Not built yet', null]]);
  assert.equal(alg.started, true);

  /* Calculus: Calculus 1 is a pack; Calculus 2 and 3 are not built yet. It builds on Foundations. */
  const calc = L.cardModel(node('calc'), REALMS, empty);
  assert.equal(calc.ready, true);
  assert.deepEqual(calc.parts.map(p => [p.id, p.ready, p.text, p.href]), [
    ['calc1', true, '0 / ' + count('calc1') + ' solved', 'realm.html?realm=calc1'],
    ['calc2', false, 'Not built yet', null], ['calc3', false, 'Not built yet', null]]);
  assert.equal(calc.lock.locked, true, 'Foundations is not learned yet, so the card says so');
  assert.equal(calc.lock.goHref, 'realm.html?realm=found');
  /* A node with no ready part has nothing to enter, so its card has no soft-lock sentence or Go button. */
  const stat = L.cardModel(node('stat'), REALMS, empty);
  assert.equal(stat.ready, false);
  assert.ok(stat.parts.every(p => p.text === 'Not built yet' && p.href === null), 'coming parts have no Enter link');
  assert.equal(stat.lock.locked, false, 'nothing to enter, so no soft-lock sentence or Go button');
  assert.equal(L.softLock(node('stat'), REALMS, empty).locked, true, 'softLock itself still sees the unfinished need');
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
  /* Home view: collection overlay, then the backup dialog, then the details panel, then leave. */
  assert.equal(L.backAction({ homePanelOpen: true }), 'home');
  assert.equal(L.backAction({ homePanelOpen: true, dialogOpen: true }), 'dialog');
  assert.equal(L.backAction({ homePanelOpen: true, dialogOpen: true, collectionOpen: true }), 'collection');
  const home = s => L.backAction(L.overlayState({ homeOn: true, ...s }));
  assert.equal(home({}), null, 'home view with nothing open: Back leaves the app');
  assert.equal(home({ homePanelOpen: true }), 'home');
  assert.equal(home({ homePanelOpen: true, collectionOpen: true }), 'collection');
  assert.equal(home({ cardOpen: true, listOverlay: true }), null, 'the star map\'s card and list do not exist under the home view');
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

/* ---------- Home view: what the wormhole leads into (docs/HOME-HOOKUP.md) ---------- */
const indexHtml = fs.readFileSync(game + '/index.html', 'utf8');
const homeSrc = fs.readFileSync(game + '/shell/home.js', 'utf8');

check(() => {
  /* Loaded as a classic script after three.js and before shell.js, with its styles and its host element. */
  const scripts = [...indexHtml.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  assert.ok(scripts.indexOf('shell/home.js') > scripts.indexOf('shell/vendor/three.min.js'));
  assert.ok(scripts.indexOf('shell/home.js') < scripts.indexOf('shell/shell.js'));
  assert.ok(scripts.indexOf('collection/ui.js') < scripts.indexOf('shell/shell.js'));
  assert.match(indexHtml, /<link rel="stylesheet" href="shell\/shell\.css"><link rel="stylesheet" href="shell\/home\.css">/);
  assert.match(indexHtml, /<div id="vg-home"><\/div>/);
  /* Every way out of the tunnel goes through startMap, which hands over to the home view first. */
  assert.match(shellSrc, /function startMap\(flashIn\)\{\s*if\(showHome\(flashIn\)\)\{[^}]*phase='home';stop\(\);[^}]*stage\.hidden=true/);
  /* Focus goes to the home heading when the stage held it, or when the tunnel ended by itself with nothing focused;
     the active element is read before the stage is hidden. The condition is run here with stand-in elements. */
  {
    const m = /var a=document\.activeElement,move=([^;]+);\s*phase='home';stop\(\);[^;]*;stage\.hidden=true;\s*if\(move\)\{var h1=document\.getElementById\('vgh-title'\);if\(h1\)h1\.focus\(\{preventScroll:true\}\)\}/.exec(shellSrc);
    assert.ok(m, 'startMap reads focus before hiding the stage and moves it to #vgh-title');
    const skip = { id: 'skip' }, inStage = { id: 'collection' }, outside = { id: 'dialog' }, body = { id: 'body' };
    const move = (a, flashIn) => !!new Function('a', 'flashIn', '$', 'stage', 'document', 'return ' + m[1])(
      a, flashIn, () => skip, { contains: x => x === skip || x === inStage }, { body });
    assert.equal(move(skip, false), true, 'Skip intro had focus');
    assert.equal(move(inStage, true), true, 'a stage button had focus when the tunnel ended');
    assert.equal(move(inStage, false), true, 'a stage button had focus on a skip');
    assert.equal(move(body, true), true, 'tunnel ended by itself, nothing focused');
    assert.equal(move(null, true), true, 'tunnel ended by itself, no active element');
    assert.equal(move(body, false), false, 'a direct start leaves focus alone');
    assert.equal(move(outside, true), false, 'focus outside the stage is left alone');
    assert.equal(move(outside, false), false);
  }
  assert.match(shellSrc, /if\(choice\.mode==='flat'\)\{\s*document\.body\.classList\.add\('vg-flat'\);\s*if\(showHome\(false\)\)\{document\.body\.classList\.remove\('vg-booting'\);return\}/, 'no WebGL: the home view with its flat icons');
  assert.match(shellSrc, /if\(!root\.VGHome\|\|typeof root\.VGHome\.mount!=='function'\|\|!homeHost\)return false/, 'home.js missing: the star map and list still work');
  assert.match(shellSrc, /catch\(e\)\{try\{root\.VGHome\.unmount\(\)\}catch\(err\)\{\}replayBtn=null;return false\}/, 'a home view that throws falls back too');
  /* The stopped stage stays stopped, and a lost context does not open the list over the home view. */
  assert.match(shellSrc, /function start\(\)\{if\(running\|\|contextLost\|\|listOverlay\|\|homeOn\|\|document\.hidden\)return/);
  assert.match(shellSrc, /'webglcontextlost',function\(e\)\{[^}]*if\(!homeOn&&phase==='tunnel'\)startMap\(false\);if\(homeOn\)return;/);
  assert.match(shellSrc, /'webglcontextrestored',function\(\)\{[^}]*if\(homeOn\)return;/);
  /* Actions: Collection opens the overlay (a button drawn by the collection chip, not a link), Replay intro, backup. */
  assert.match(shellSrc, /\{label:'Collection',place:'top',className:'vg-coll',setup:function\(b\)\{CollUI\.chip\(b,\{label:'Collection'\}\)\}\}/);
  assert.doesNotMatch(shellSrc, /label:'Collection'[^}]*href/, 'Collection is not a link to a page');
  assert.match(homeSrc, /if\(typeof a\.setup==='function'\)/);
  assert.match(require(game + '/collection/ui.js') && fs.readFileSync(game + '/collection/ui.js', 'utf8'), /if \(c\.press\) node\.addEventListener\('click', function \(e\) \{[^}]*open\(\); \}\)/, 'pressing a chip button opens the overlay');
  assert.match(shellSrc, /label:'Replay intro',onClick:replayIntro/);
  assert.match(shellSrc, /label:'Back up or restore save',onClick:openBackup/);
  assert.match(shellSrc, /function canReplay\(\)\{return !!renderer&&!reduced&&!contextLost\}/, 'no replay under reduced motion or without WebGL');
  /* Back: the panel after the collection and the dialog. Progress: read again on return from a realm. */
  assert.match(shellSrc, /if\(a==='home'\)return !!root\.VGHome\.back\(\);/);
  assert.match(shellSrc, /function refresh\(\)\{[^}]*if\(homeOn\)root\.VGHome\.refresh\(\);settleAwards\(\)\}/);
  assert.match(shellSrc, /addEventListener\('pageshow',function\(e\)\{if\(e\.persisted\)refresh\(\)\}\)/);
  assert.match(shellSrc, /addEventListener\('storage',/);
  assert.match(shellSrc, /addEventListener\('visibilitychange',function\(\)\{if\(!document\.hidden\)refresh\(\)\}\)/);
  /* Nothing in the shell knows how many missions a realm has. */
  for (const [name, src] of [['index.html', indexHtml], ['shell.js', shellSrc], ['home.js', homeSrc]]) {
    assert.doesNotMatch(src, new RegExp('\\b(' + [FOUND, LA, FOUND + LA, 40, 108].join('|') + ')\\b[^;\\n]{0,12}(missions|solved)'), name + ' has no hard-coded mission count');
    assert.doesNotMatch(src, /missions\s*[:=]\s*\d/, name + ' sets no mission count');
  }
}, 'home view: loaded, wired, falls back, counts from the registry');

/* ---------- Collection: button, overlay wiring and the interface helpers (docs/COLLECTION.md) ---------- */
const uiSrc = fs.readFileSync(game + '/collection/ui.js', 'utf8');
const uiCss = fs.readFileSync(game + '/collection/collection.css', 'utf8');
const U = require(game + '/collection/ui.js'); /* no window: only the pure helpers load */

check(() => {
  assert.equal(L.backAction({ collectionOpen: true, dialogOpen: true, cardOpen: true, listOpen: true }), 'collection', 'the collection closes first');
  assert.equal(L.backAction(L.overlayState({ collectionOpen: true, listOverlay: true, contextLost: true })), 'collection');
  assert.equal(L.backAction(L.overlayState({ collectionOpen: false, cardOpen: true })), 'card');
  assert.match(shellSrc, /if\(a==='collection'\)\{CollUI\.back\(\);return true\}/, 'Android Back goes to the overlay');
  assert.match(shellSrc, /e\.key!=='Escape'\|\|\(dlg&&dlg\.open\)\|\|collOpen\(\)/, 'Escape does not close the card under the overlay');
  assert.match(shellSrc, /buildModels\(\);showXp\(\);settleAwards\(\);/, 'awards settle when the shell loads');
  assert.match(shellSrc, /function refresh\(\)\{[^}]*settleAwards\(\)\}/, 'and after a restore or a change in another tab');
  assert.match(shellSrc, /!Save\.fallback/, 'no collection button on the read-only stand-in store');
  assert.equal(U.backStep({ open: false, detail: 'euclid' }), null);
  assert.equal(U.backStep({ open: true, detail: 'euclid' }), 'detail', 'a figure card goes back to the grid first');
  assert.equal(U.backStep({ open: true, detail: null }), 'overlay');
  assert.match(uiSrc, /root\.VectorGuildBack = w/, 'the overlay puts itself in front of the page\'s own Back handler');
}, 'collection: Back and Escape close the overlay first');

check(() => {
  /* Classic scripts in dependency order, all before shell.js; the Android app loads this page from file://. */
  const scripts = [...indexHtml.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  const at = f => { const i = scripts.indexOf(f); assert.ok(i >= 0, f + ' is loaded'); return i; };
  for (const f of ['save-store.js', 'realms/registry.js', 'collection/figures.js', 'collection/achievements.js', 'collection/core.js']) assert.ok(at(f) < at('collection/ui.js'), f + ' loads before the interface');
  assert.ok(at('collection/ui.js') < at('shell/shell.js'));
  assert.doesNotMatch(indexHtml, /type="module"/);
  assert.match(indexHtml, /<link rel="stylesheet" href="collection\/collection\.css">/);
  assert.equal((indexHtml.match(/<button class="vg-ghost vg-coll" data-collection type="button" hidden>Collection<\/button>/g) || []).length, 2, 'one Collection button in the map header and one in the list header');
  assert.match(shellSrc, /querySelectorAll\('\[data-collection\]'\)[\s\S]{0,80}CollUI\.chip\(b,\{label:'Collection'\}\)/, 'the button shows the stardust count');
  for (const src of [uiSrc, fs.readFileSync(game + '/collection/core.js', 'utf8')]) {
    assert.doesNotMatch(src, /\bfetch\s*\(|XMLHttpRequest|^\s*(import|export)\s/m, 'no network and no modules');
  }
  for (const name of ['open', 'close', 'toast', 'chip']) assert.match(uiSrc, new RegExp('root\\.VGCollectionUI = \\{[^}]*\\b' + name + ': ' + name + '\\b'), 'VGCollectionUI.' + name);
}, 'collection: loaded and wired into the shell');

check(() => {
  assert.equal(U.pickTab('figures'), 'figures');
  assert.equal(U.pickTab('shop'), 'summon');
  assert.equal(U.pickTab(), 'summon');
  assert.equal(U.summonLabel(0), 'Summon for free');
  assert.equal(U.summonLabel(60), 'Summon for 60 stardust');
  assert.equal(U.summonNote(0, 0, 48), 'Your first summon is free.');
  assert.equal(U.summonNote(60, 145, 48), 'You have 145 stardust. One summon uses 60.');
  assert.equal(U.summonNote(60, 45, 48), 'You need 15 more stardust. Solve missions to earn it.');
  assert.match(U.summonNote(60, 500, 0), /did not load/);
  assert.equal(U.percent(0.7), '70%');
  assert.equal(U.percent(0.06), '6%');
  assert.deepEqual(U.guaranteeLines({ rareEvery: 5, legendEvery: 20, rareIn: 1, legendIn: 14 }), [
    'At least one rare or legendary figure in every 5 summons. Your next summon is one for sure.',
    'At least one legendary figure in every 20 summons. One is certain within your next 14 summons.']);
  assert.equal(U.pullText({ ok: true, duplicate: false }), 'New figure found.');
  assert.equal(U.pullText({ ok: true, duplicate: true, refund: 35, count: 3, stars: 3 }), 'You have this one. It is now at 3 of 5 stars. 35 stardust came back.');
  assert.equal(U.pullText({ ok: true, duplicate: true, refund: 20, count: 6, stars: 5 }), 'You have this one at 5 stars already. 20 stardust came back.');
  assert.equal(U.pullText({ ok: false, reason: 'dust' }), '');
  for (const r of ['dust', 'empty', 'storage', 'not-owned', 'anything']) assert.ok(U.failText(r).length > 10);
  assert.equal(U.chipLabel('Collection', 120, ''), 'Collection: 120 stardust');
  assert.equal(U.chipLabel('', 5, 'Emmy Noether'), 'Collection: 5 stardust, Emmy Noether equipped');
  assert.equal(U.years({ born: '1731', died: '1806' }), '1731 to 1806');
  assert.equal(U.years({ born: 'c. 287 BCE', died: 'c. 212 BCE' }), 'c. 287 BCE to c. 212 BCE');
  assert.equal(U.years({ born: '1977', died: '' }), 'Born 1977');
  assert.equal(U.years({}), '');
  /* Player-facing words: stardust is earned by playing, never bought. */
  const words = [U.summonLabel(60), U.summonNote(60, 10, 48), U.summonNote(60, 100, 48), ...U.guaranteeLines({ rareEvery: 5, legendEvery: 20, rareIn: 2, legendIn: 2 })].join(' ') +
    ' ' + [...uiSrc.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map(m => m[1]).filter(t => / /.test(t)).join(' ');
  assert.doesNotMatch(words, /\b(buy|bought|purchase|price|pay|paid|shop|store credit|coins?|cash|money|gacha|loot)\b|[$€£]/i, 'no real-money wording');
}, 'collection: plain words for summon, stars and the chip');

check(() => {
  /* Source links leave the app the same way the reading links in app.js do: a plain https link with
     rel="noopener noreferrer". MainActivity.shouldOverrideUrlLoading hands an https link to the phone's browser. */
  assert.equal(U.safeUrl('https://en.wikipedia.org/wiki/Emmy_Noether'), 'https://en.wikipedia.org/wiki/Emmy_Noether');
  for (const bad of ['http://example.org/', 'javascript:alert(1)', 'file:///etc/passwd', '//example.org', 'https://a.b/" onclick="x', 'https://a.b/ c', '', null, 7]) assert.equal(U.safeUrl(bad), null, String(bad));
  assert.equal(U.sourceLabel('https://en.wikipedia.org/wiki/X'), 'Wikipedia');
  assert.equal(U.sourceLabel('https://www.nasa.gov/people/x'), 'NASA');
  assert.equal(U.sourceLabel('https://www.example.org/a?b'), 'example.org', 'an unknown site shows its address');
  assert.match(uiSrc, /a\.rel = 'noopener noreferrer'/);
  assert.match(uiSrc, /\.map\(safeUrl\)\.filter\(Boolean\)/, 'only checked links are drawn');
  assert.match(fs.readFileSync(game + '/app.js', 'utf8'), /rel="noopener noreferrer"/, 'same as the reading links');
  /* Emblems are drawn from markup: nothing that could run code or load a file. */
  assert.equal(U.emblemOk('<g fill="none"><circle cx="32" cy="32" r="20"/><path d="M1 2L3 4"/><animate attributeName="r"/></g>'), true);
  for (const bad of ['<script>x</script>', '<circle onload="x()"/>', '<a href="https://x.y"><circle/></a>', '<image href="x.png"/>', '<use href="#a"/>', '<foreignObject></foreignObject>', '', null]) assert.equal(U.emblemOk(bad), false, String(bad));
  const figs = {}; let loaded = false;
  try { vm.runInNewContext(fs.readFileSync(game + '/collection/figures.js', 'utf8'), { window: figs }); loaded = Array.isArray(figs.VG_FIGURES); } catch (e) { loaded = false; }
  if (loaded) for (const f of figs.VG_FIGURES) {
    assert.ok(U.emblemOk(f.emblem), f.id + ': emblem can be drawn');
    assert.ok(f.sources.every(u => U.safeUrl(u) && U.sourceLabel(u)), f.id + ': every source link can be shown');
    assert.ok(U.years(f), f.id + ': years');
  }
}, 'collection: source links and emblems');

check(() => {
  /* Text is 12px or more (body 16px), controls are 44px or more, motion can be switched off, and the page cannot scroll sideways. */
  const sizes = [...uiCss.matchAll(/font(?:-size)?:[^;}]*?(\d+(?:\.\d+)?)px/g)].map(m => +m[1]);
  assert.ok(sizes.length > 20, 'found the font sizes');
  assert.ok(Math.min(...sizes) >= 12, 'smallest text is ' + Math.min(...sizes) + 'px');
  assert.match(uiCss, /\.vgc-root\{[^}]*font:16px\/1\.5 var\(--vgc-body\)/, 'body text is 16px');
  /* Rarity colour tints the whole tile, card and reveal; no thick line on one side of anything. */
  /* (The tab underline and the drop-down's drawn arrow are the two places a 2px or 3px side line is meant.) */
  for (const rule of uiCss.split('}')) {
    if (/^\s*\.vgc-root \.vgc-tab\{|summary::before\{/.test(rule)) continue;
    assert.doesNotMatch(rule, /border-(top|left|right|bottom):\s*[2-9]/, 'no one-sided accent border: ' + rule.trim().slice(0, 60));
  }
  for (const sel of ['.vgc-tile', '.vgc-reveal', '.vgc-card-top']) assert.match(uiCss, new RegExp('\\.vgc-root \\' + sel + '\\{[^}]*border:1px solid var\\(--vgc-e\\)[^}]*var\\(--vgc-t\\)'), sel + ' is tinted by rarity');
  for (const r of ['common', 'rare', 'legendary']) assert.match(uiCss, new RegExp('\\.vgc-root \\.is-' + r + '\\{--vgc-r:[^;]+;--vgc-t:[^;]+;--vgc-e:[^}]+\\}'));
  /* The reveal: lines draw in, a burst in the rarity colour; none of it under reduced motion. */
  assert.match(uiSrc, /function drawIn\(box\) \{[\s\S]{0,200}if \(!svg \|\| still\(\)\) return;/, 'no draw-in under reduced motion');
  assert.match(uiSrc, /sh\.style\.strokeDasharray = ''; sh\.style\.strokeDashoffset = ''; sh\.style\.animation = '';/, 'the emblem is left as it was written');
  assert.match(uiCss, /\.vgc-root \.vgc-burst i\{[^}]*opacity:0\}/, 'sparks are invisible unless animated');
  assert.match(uiCss, /@keyframes vgc-draw\{to\{stroke-dashoffset:0\}\}/);
  /* Coloured progress bars; long lists fold into drop-downs. */
  assert.match(uiCss, /\.vgc-root \.vgc-ach-side \.vgc-bar span\{background:linear-gradient\(90deg,var\(--vgc-amber\),var\(--vgc-cyan\) 55%,var\(--vgc-lime\)\)/);
  assert.match(uiSrc, /dropDown\('', 'Not found yet \(' \+ missing \+ '\)'/);
  assert.match(uiSrc, /dropDown\('is-earned', 'Earned \(' \+ earned \+ '\)'/);
  assert.match(uiCss, /\.vgc-root \.vgc-more>summary\{[^}]*min-height:(4[4-9]|[5-9]\d)px/);
  for (const sel of ['.vgc-primary,.vgc-root .vgc-secondary', '.vgc-tab', '.vgc-back', '.vgc-link']) {
    const rule = uiCss.split('\n').find(l => l.startsWith('.vgc-root ' + sel + '{'));
    assert.ok(rule && /min-height:(4[4-9]|[5-9]\d)px/.test(rule), sel + ' is at least 44px high');
  }
  assert.match(uiCss, /\.vgc-root \.vgc-close\{[^}]*width:44px;height:44px/);
  assert.match(uiCss, /:where\(\.vgc-chip\)\{[^}]*min-height:44px/);
  assert.match(uiCss, /\.vgc-root \.vgc-tile\{[^}]*min-height:1\d\dpx/);
  assert.match(uiCss, /@media\(prefers-reduced-motion:reduce\)\{\.vgc-root,\.vgc-root \*[^}]*animation:none!important/);
  assert.match(uiCss, /\.vgc-root \.vgc-pane\{[^}]*overflow-x:hidden/);
  /* Every rule is scoped, so the realm page's own styles are left alone. */
  const loose = uiCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*\s*\}/g, '').replace(/@media[^{]+\{/g, '').split('}')
    .map(r => r.split('{')[0].trim()).filter(Boolean).flatMap(s => s.split(',')).map(s => s.trim()).filter(s => !/vgc-/.test(s));
  assert.deepEqual(loose, [], 'selectors without a vgc- class');
  /* Dialog semantics and focus. */
  assert.match(uiSrc, /showModal\(\)/);
  assert.match(uiSrc, /setAttribute\('role', 'dialog'\)[\s\S]{0,60}setAttribute\('aria-modal', 'true'\)/, 'the plain fallback is still a dialog');
  assert.match(uiSrc, /setAttribute\('aria-labelledby', 'vgc-title'\)/);
  assert.match(uiSrc, /returnTo = document\.activeElement/);
  assert.match(uiSrc, /focusOn\(back\)/, 'focus goes back to where it was');
  assert.match(uiSrc, /n\.tabIndex >= 0/, 'Tab only stops on things that take Tab');
  assert.match(uiSrc, /setAttribute\('role', 'tablist'\)/);
}, 'collection: sizes, motion, scoping and dialog semantics');

console.log('shell logic: ' + checks + ' checks passed');
