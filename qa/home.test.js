/* Home view logic: which realms are ready, the start/continue button, card status text, soft-lock wording,
   and a few source checks (one renderer, capped pixel ratio, fallbacks, dialog and Back handling).
   Loads game/shell/home.js without a window (the page part returns early) and game/realms/registry.js in a vm.
   Run: node qa/home.test.js (VERBOSE=1 lists each group). */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');

const H = require(game + '/shell/home.js');
for (const name of ['solvedCount', 'progressText', 'enterHref', 'partInfo', 'softLock', 'hasProgress', 'cardModel', 'isReady', 'splitRealms', 'moreTitle', 'shortLine', 'nodeProgress', 'cardStatus', 'continueTarget']) assert.equal(typeof H[name], 'function', name + ' is exported');

const homeSrc = fs.readFileSync(game + '/shell/home.js', 'utf8');
const homeCss = fs.readFileSync(game + '/shell/home.css', 'utf8');
const win = {};
vm.runInNewContext(fs.readFileSync(game + '/realms/registry.js', 'utf8'), { window: win });
const REALMS = JSON.parse(JSON.stringify(win.VG_REALMS || null));
assert.ok(Array.isArray(REALMS) && REALMS.length > 0, 'registry loads');
const node = id => REALMS.find(r => r.node === id);
const saveWith = slices => id => slices[id] || null;
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
const model = (id, slices) => H.cardModel(node(id), REALMS, saveWith(slices || {}));
let checks = 0;
const check = (fn, label) => { fn(); checks++; if (process.env.VERBOSE) console.log('ok -', label); };

check(() => {
  const s = H.splitRealms(REALMS);
  assert.deepEqual(s.ready.map(r => r.node), ['found', 'alg'], 'realms with a ready part, in registry order');
  assert.equal(s.ready.length + s.coming.length, REALMS.length, 'every realm is in exactly one group');
  assert.ok(s.coming.every(r => !H.isReady(r)));
  assert.equal(H.moreTitle(s.coming.length), 'More realms on the way (9)');
  assert.equal(H.isReady({ parts: [{ status: 'ready' }] }), false, 'a ready part needs a pack id');
  assert.equal(H.isReady({}), false);
  assert.equal(H.isReady(null), false);
  assert.deepEqual(H.splitRealms(null), { ready: [], coming: [] });
}, 'ready and coming realms');

check(() => {
  assert.equal(H.cardStatus(model('found')), 'Start here');
  assert.equal(H.cardStatus(model('alg')), '0 / 68 solved');
  assert.equal(H.cardStatus(model('calc')), 'Not built yet');
  assert.equal(H.cardStatus(model('found', { found: { solved: ids(12) } })), '12 / 40 solved');
  assert.equal(H.cardStatus(model('found', { found: { solved: ids(40) } })), '40 / 40 solved · complete');
  /* Progress anywhere removes "Start here" from Foundations, as on the star map. */
  assert.equal(H.cardStatus(model('found', { la: { solved: ids(3) } })), '0 / 40 solved');
  assert.deepEqual(H.nodeProgress(model('alg', { la: { solved: ids(5) } })), { solved: 5, total: 68, text: '5 / 68 solved' });
  /* Only ready parts count: Algebra's unbuilt part adds nothing. */
  assert.equal(H.nodeProgress(model('calc')).total, 0);
}, 'card status text');

check(() => {
  const t = H.continueTarget(REALMS, saveWith({}));
  assert.equal(t.kind, 'start');
  assert.equal(t.label, 'Start here: Foundations');
  assert.equal(t.href, 'realm.html?realm=found');
  const a = H.continueTarget(REALMS, saveWith({ found: { solved: ids(12) } }));
  assert.equal(a.label, 'Continue: Foundations');
  assert.equal(a.progress, '12 / 40 solved');
  /* Most missions solved wins among unfinished parts. */
  const b = H.continueTarget(REALMS, saveWith({ found: { solved: ids(12) }, la: { solved: ids(30) } }));
  assert.equal(b.label, 'Continue: Linear algebra');
  assert.equal(b.href, 'realm.html?realm=la');
  assert.equal(b.node, 'alg');
  /* A tie keeps registry order. */
  assert.equal(H.continueTarget(REALMS, saveWith({ found: { solved: ids(5) }, la: { solved: ids(5) } })).id, 'found');
  /* A finished part is never the target while another is unfinished. */
  assert.equal(H.continueTarget(REALMS, saveWith({ found: { solved: ids(40) }, la: { solved: ids(2) } })).id, 'la');
  assert.equal(H.continueTarget(REALMS, saveWith({ found: { solved: ids(40) } })).label, 'Continue: Linear algebra', 'next unfinished part');
  /* Everything finished: still a button, on the part with most solved. */
  assert.equal(H.continueTarget(REALMS, saveWith({ found: { solved: ids(40) }, la: { solved: ids(68) } })).id, 'la');
  /* XP without a solved mission counts as started. */
  assert.equal(H.continueTarget(REALMS, saveWith({ la: { solved: [], xp: 10 } })).label, 'Continue: Linear algebra');
  /* Nothing playable, or a store that throws. */
  assert.equal(H.continueTarget([node('calc')], saveWith({})), null);
  assert.equal(H.continueTarget([], saveWith({})), null);
  assert.equal(H.continueTarget(REALMS, id => { throw new Error('storage ' + id); }).label, 'Start here: Foundations');
  /* With no realm that builds on nothing, the first ready part is the start. */
  assert.equal(H.continueTarget([node('alg')], saveWith({})).label, 'Start here: Linear algebra');
}, 'start / continue button');

check(() => {
  const alg = model('alg');
  assert.equal(alg.lock.locked, true);
  assert.equal(alg.lock.sentence, 'Algebra builds on Foundations, which you have not finished yet, but you can go in now.');
  assert.equal(alg.lock.goName, 'Foundations');
  assert.equal(alg.lock.goHref, 'realm.html?realm=found');
  assert.equal(alg.enterLabel, 'Enter anyway');
  assert.deepEqual(alg.parts.map(p => [p.name, p.ready, p.text]), [['Linear algebra', true, '0 / 68 solved'], ['Abstract algebra', false, 'Not built yet']]);
  assert.equal(alg.parts[0].href, 'realm.html?realm=la');
  assert.equal(alg.parts[1].href, null);
  const open = model('alg', { found: { solved: ids(40) } });
  assert.equal(open.lock.locked, false);
  assert.equal(open.enterLabel, 'Enter realm');
  assert.equal(model('found').lock.locked, false);
  /* A realm with nothing built carries no soft-lock sentence. */
  assert.equal(model('diff').lock.locked, false);
}, 'soft lock and parts in the details panel');

check(() => {
  /* home.js copies these from shell.js: both must give the same card model for every realm and save. */
  const L = require(game + '/shell/shell.js');
  const saves = [{}, { found: { solved: ids(12), xp: 100 } }, { found: { solved: ids(40) } }, { found: { solved: ids(40) }, la: { solved: ids(68) } }, { la: { solved: ['a', 'a', 7] } }];
  for (const s of saves) for (const r of REALMS) assert.deepEqual(H.cardModel(r, REALMS, saveWith(s)), L.cardModel(r, REALMS, saveWith(s)), r.node);
  assert.equal(H.progressText(3, 0), L.progressText(3, 0));
  assert.equal(H.enterHref('a b&c'), L.enterHref('a b&c'));
}, 'same card model as the star map');

check(() => {
  for (const r of REALMS) {
    const s = H.shortLine(r);
    assert.ok(s.length > 0 && s.length <= 44, r.node + ' has a short line: ' + s);
    assert.ok(!/[.:]$/.test(s), 'no trailing punctuation: ' + s);
  }
  assert.equal(H.shortLine({ node: 'x', short: 'Own line', learn: 'Ignored.' }), 'Own line');
  assert.equal(H.shortLine({ node: 'x', learn: 'Sets and maps: the rest.' }), 'Sets and maps');
  assert.ok(H.shortLine({ node: 'x', learn: 'A very long opening clause that keeps going well past what fits on a small card' }).length <= 44);
  assert.equal(H.shortLine({ node: 'constructor' }), '', 'odd ids do not reach Object.prototype');
}, 'short card lines');

check(() => {
  /* One renderer and one canvas; scissor rectangles per icon; pixel ratio capped at 2. */
  assert.equal((homeSrc.match(/new T\.WebGLRenderer\(/g) || []).length, 1, 'one WebGL renderer');
  assert.match(homeSrc, /setScissorTest\(true\)/);
  assert.match(homeSrc, /r\.setViewport\(x,y,b\.width,b\.height\);r\.setScissor\(x,y,b\.width,b\.height\)/);
  assert.match(homeSrc, /Math\.min\(root\.devicePixelRatio\|\|1,2\)/);
  /* Paused when hidden, still under reduced motion, SVG glyphs when the context is lost. */
  assert.match(homeSrc, /function start\(\)\{if\(!S\|\|!S\.renderer\|\|S\.lost\|\|document\.hidden\|\|S\.reduced\|\|S\.running\)return/);
  assert.match(homeSrc, /if\(!S\.reduced\)ic\.spin\+=/);
  assert.match(homeSrc, /'webglcontextlost',function\(e\)\{e\.preventDefault\(\);S\.lost=true;S\.root\.classList\.remove\('vgh-3d'\)/);
  assert.match(homeCss, /\.vgh-3d \.vgh-icon \.vgh-glyph\{visibility:hidden\}/);
  /* Every registry realm has its own 3D shape and its own flat glyph. */
  for (const r of REALMS) {
    assert.match(homeSrc, new RegExp('\\n   ' + r.node + ':function\\(c\\)'), '3D shape for ' + r.node);
    assert.match(homeSrc, new RegExp('\\n ' + r.node + ":'<"), 'glyph for ' + r.node);
  }
  /* No modules, no network. */
  assert.doesNotMatch(homeSrc, /\bimport\s|\bexport\s|fetch\(|XMLHttpRequest/);
}, 'icon rendering source checks');

check(() => {
  assert.match(homeSrc, /setAttribute\('role','dialog'\)/);
  assert.match(homeSrc, /setAttribute\('aria-modal','true'\)/);
  assert.match(homeSrc, /function back\(\)\{if\(!S\|\|!S\.open\)return false;closePanel\(\);return true\}/);
  assert.match(homeSrc, /e\.key!=='Escape'/);
  assert.match(homeSrc, /S\.lastCard\.focus\(/, 'focus returns to the card');
  assert.match(homeSrc, /el\('details','vgh-more'\)/, 'unbuilt realms sit in a real drop-down');
  /* Sizes: two columns with a 16px gap on a phone, cards at least 150px tall, summary at least 44px. */
  assert.match(homeCss, /\.vgh-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\);gap:16px\}/);
  const minH = +homeCss.match(/\.vgh-card\{[^}]*min-height:(\d+)px/)[1];
  assert.ok(minH >= 150, 'card min-height ' + minH);
  assert.ok(+homeCss.match(/\.vgh-more>summary\{[^}]*min-height:(\d+)px/)[1] >= 44);
  /* No text under 12px, and no thick one-sided accent border on a card. */
  for (const m of homeCss.matchAll(/font(?:-size)?:[^;}]*?(\d+(?:\.\d+)?)px/g)) assert.ok(+m[1] >= 12, 'font size ' + m[0]);
  assert.doesNotMatch(homeCss, /\.vgh-card[^{]*\{[^}]*border-(top|left|right|bottom):\s*[2-9]/);
  /* Motion stops under reduced motion. */
  assert.match(homeCss, /@media\(prefers-reduced-motion:reduce\)\{\s*\.vgh:before,\.vgh:after,\.vgh \.vgh-cta,\.vgh \.vg-bar span,\.vgh-sheet\{animation:none\}/);
}, 'panel, Back and sizing source checks');

console.log('home logic: ' + checks + ' checks passed');
