/* Tests for the five-minute run (game/run.js): the mix, the once-a-day stardust, the end screen, the card driven
   through a small stand-in for the DOM with the real Foundations and Calculus 1 packs, and the wiring.
   Plain Node, no dependencies. Usage: node qa/run.test.js. The date is always injected (VG_DAILY_NOW). */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');
const read = f => fs.readFileSync(path.join(game, f), 'utf8');
const V2 = 'vector-guild-save-v2';
const plain = o => JSON.parse(JSON.stringify(o));
const packsWindow = {}; vm.runInNewContext(read('realms/packs.js'), { window: packsWindow });
const PACKS = packsWindow.VG_PACKS, SHARED = packsWindow.VG_REALM_SHARED;
let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const slice = solved => ({ solved, xp: 0, points: 0, tools: [], clean: [], revealed: [], landmarks: [], contracts: [], reviews: {}, errors: {}, rolls: {} });
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h);

function logicOnly() { const window = {}; vm.runInNewContext(read('daily.js'), { window, Math }); vm.runInNewContext(read('run.js'), { window, Math, JSON }); return window; }
const entry = (realm, id) => ({ realm, id, key: realm + ':' + id, title: id, topic: '', stale: 10, misses: 0 });

test('the mix: five problems from five concepts or more, three otherwise, and realms take turns', () => {
  const w = logicOnly(), L = w.VGRun.logic;
  assert.equal(L.size(0), 3); assert.equal(L.size(2), 3); assert.equal(L.size(4), 4); assert.equal(L.size(5), 5); assert.equal(L.size(40), 5);
  const many = [...ids(8).map(id => entry('found', id)), ...ids(3).map(id => entry('calc1', id)), entry('la', 'q01')];
  for (let s = 1; s < 60; s++) {
    const got = L.choose(many, mulberry(s));
    assert.equal(got.length, 5); assert.equal(new Set(got.map(e => e.key)).size, 5, 'no concept twice');
    assert.equal(new Set(got.slice(0, 3).map(e => e.realm)).size, 3, 'the first three come from three realms');
  }
  const two = L.choose([entry('found', 'q01'), entry('found', 'q02')], mulberry(1));
  assert.equal(two.length, 3); assert.deepEqual(plain(two.map(e => e.id)).sort().slice(0, 2).length, 2);
  assert.equal(L.choose([], mulberry(1)).length, 0); assert.equal(L.choose(null, Math.random).length, 0);
});

test('stardust once per day for the first finished run; runs are unlimited and counted; a clock set back pays nothing', () => {
  const L = logicOnly().VGRun.logic, day = 20780;
  assert.equal(L.RULES.dust, 10);
  let r = L.settle({ dust: 5, earned: 50 }, day);
  assert.deepEqual(plain(r.events), [{ type: 'run', day, dust: 10 }]); assert.equal(r.meta.dust, 15); assert.equal(r.meta.earned, 60); assert.deepEqual(plain(r.meta.run), { paid: day, runs: 1 });
  r = L.settle(r.meta, day); assert.deepEqual(plain(r.events), []); assert.equal(r.meta.dust, 15); assert.equal(r.meta.run.runs, 2);
  r = L.settle(r.meta, day - 3); assert.deepEqual(plain(r.events), [], 'an earlier day'); assert.equal(r.meta.run.paid, day);
  r = L.settle(r.meta, day + 1); assert.equal(r.events.length, 1); assert.equal(r.meta.dust, 25);
  const input = { dust: 1, run: { paid: 'x', runs: -2, later: true } }, out = L.settle(input, day);
  assert.deepEqual(plain(out.meta.run), { paid: day, runs: 1, later: true }, 'damage is mended; unknown fields are kept'); assert.equal(input.dust, 1, 'the input is not changed');
  assert.deepEqual(plain(L.status(undefined, day, 2)), { locked: true, need: 1, bonus: true, runs: 0 });
  assert.equal(L.status({ paid: day, runs: 3 }, day, 9).bonus, false); assert.equal(L.status({ paid: day, runs: 3 }, day + 1, 9).bonus, true);
});

test('the end screen: how many right, and each missed concept once', () => {
  const L = logicOnly().VGRun.logic;
  const s = L.summary([{ ok: true, key: 'a' }, { ok: false, key: 'b', title: 'B' }, { ok: false, key: 'b', title: 'B' }, { ok: true, key: 'c' }, { ok: false, key: 'd', title: 'D' }]);
  assert.equal(s.right, 2); assert.equal(s.total, 5); assert.deepEqual(plain(s.revisit.map(x => x.key)), ['b', 'd']);
  assert.equal(L.endLine(s), '2 of 5 right. Good work.'); assert.equal(L.endLine(L.summary([{ ok: true }, { ok: true }, { ok: true }])), 'All 3 right. A clean run.');
  assert.doesNotMatch(L.endLine(L.summary([{ ok: false, key: 'x' }, { ok: false, key: 'y' }, { ok: false, key: 'z' }])), /fail|wrong|bad/i);
  assert.equal(L.endLine(L.summary(null)), '');
});

/* ---------- the card, with the real Foundations pack ---------- */
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
const all = (n, t, out = []) => { if (t(n)) out.push(n); n.children.forEach(c => all(c, t, out)); return out; };
const byClass = (n, cls) => all(n, x => x.className.split(' ').includes(cls));
const btn = (host, text) => byClass(host, 'vgd-btn').find(b => b.textContent === text);
function pageWith(storage, clock) {
  const ls = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const toasts = [], body = node('body');
  const document = { createElement: node, createTextNode: t => { const n = node('#text'); n._text = String(t); return n; }, getElementById: () => null, addEventListener() {}, hidden: false, body };
  const window = { localStorage: ls, VG_SEED: 1, VG_FIGURES: [], VG_PACK_ID: 'found', VG_DAILY_NOW: clock, addEventListener() {}, VGCollectionUI: { toast: t => { toasts.push(t); return true; } } };
  const ctx = { window, document, Math, JSON, setTimeout };
  vm.runInNewContext(read('save-store.js'), ctx);
  for (const file of [...SHARED.before, ...PACKS.found.scripts, ...SHARED.after]) { if (file === 'collection/ui.js' || file === 'handson.js') continue; vm.runInNewContext(read(file), ctx); }
  vm.runInNewContext(read('run.js'), ctx);
  return { window, R: window.VGRun, C: window.VGCollection, S: window.VGSave, V: window.Variants, toasts, host: node('div') };
}

test('the card: locked under three solves, then five problems, one try each, an end screen, and 10 stardust once a day', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 1, intro: true, realms: { found: slice(ids(2)) } })]]);
  let nowIs = at(2026, 11, 26, 9);
  let p = pageWith(storage, () => nowIs); p.R.mount(p.host, { heading: 'h2' });
  assert.equal(byClass(p.host, 'vgr')[0].attrs['data-state'], 'locked'); assert.match(p.host.textContent, /Solve 1 more mission to open it\./); assert.equal(byClass(p.host, 'vgd-btn').length, 0);
  storage.set(V2, JSON.stringify({ v: 2, seed: 1, intro: true, realms: { found: slice(ids(8)) } }));
  p = pageWith(storage, () => nowIs); p.R.mount(p.host, { heading: 'h2' }); p.C.settle();
  const dust0 = p.C.dust();
  assert.match(p.host.textContent, /Five-minute run/); assert.match(p.host.textContent, /Your first run today gives 10 stardust\./);
  const made = []; const realMake = p.V.make; p.V.make = id => { const v = realMake(id); made.push(v); return v; };
  btn(p.host, 'Start a run').click();
  for (let i = 0; i < 5; i++) {
    assert.match(p.host.textContent, new RegExp('Problem ' + (i + 1) + ' of 5 · Foundations'));
    const input = byClass(p.host, 'vgd-input')[0], label = byClass(p.host, 'vgd-label')[0], fb = byClass(p.host, 'vgd-feedback')[0];
    assert.equal(label.htmlFor, input.id); assert.equal(fb.attrs['aria-live'], 'polite'); assert.equal(input.id, 'vgr-answer', 'its own ids, not the daily card\'s');
    if (i === 0) { btn(p.host, 'Check').click(); assert.equal(fb.textContent, 'Enter a number first.'); }
    if (i === 1) { input.value = String(made[i].target + 1000); btn(p.host, 'Check').click(); assert.match(fb.textContent, /^Not this time: /); }
    else if (i === 3) { btn(p.host, 'Show me').click(); assert.equal(fb.attrs['data-ok'], 'no'); }
    else { input.value = String(made[i].target); btn(p.host, 'Check').click(); assert.match(fb.textContent, /^Correct\. /); }
    assert.equal(byClass(p.host, 'vgd-btn').filter(b => !b.hidden && b.textContent === 'Check').length, 0, 'one try');
    btn(p.host, i === 4 ? 'See how it went' : 'Next problem').click();
  }
  assert.equal(made.length, 5); assert.equal(new Set(made.map(v => v.id)).size, 5, 'five different concepts');
  assert.match(p.host.textContent, /3 of 5 right\. Good work\./); assert.match(p.host.textContent, /\+10 stardust for today’s first run\./);
  assert.equal(byClass(p.host, 'vgr-list')[0].children.length, 2, 'two to revisit');
  assert.equal(p.C.dust(), dust0 + 10); assert.equal(p.S.meta().run.runs, 1); assert.deepEqual(plain(p.toasts), ['+10 stardust · five-minute run']);
  assert.ok(p.S.meta().played.includes(p.window.VGDaily.today()), 'a run counts as a day played');
  assert.equal(p.S.meta().daily, undefined, 'the daily review is untouched');
  /* Another run the same day: no more stardust, and the card says so kindly. */
  btn(p.host, 'Another run').click();
  for (let i = 0; i < 5; i++) { btn(p.host, 'Show me').click(); btn(p.host, i === 4 ? 'See how it went' : 'Next problem').click(); }
  assert.doesNotMatch(p.host.textContent, /\+10 stardust/); assert.equal(p.C.dust(), dust0 + 10); assert.equal(p.S.meta().run.runs, 2);
  btn(p.host, 'Done').click(); assert.match(p.host.textContent, /Today’s run stardust is already yours\. Runs are unlimited/);
  /* The next day pays again. */
  nowIs = at(2026, 11, 27, 9); p.R.refresh(); assert.match(p.host.textContent, /Your first run today gives 10 stardust\./);
});

test('the card: a run finished in another tab first is not paid twice', () => {
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 1, intro: true, realms: { found: slice(ids(5)) } })]]), clock = () => at(2026, 11, 26, 9);
  const a = pageWith(storage, clock), b = pageWith(storage, clock); a.C.settle(); const d0 = a.C.dust();
  const day = a.window.VGDaily.today();
  assert.equal(a.R._finish(day).length, 1); assert.equal(b.R._finish(day).length, 0); assert.equal(b.C.dust(), d0 + 10);
});

test('wiring: the home page loads run.js after daily.js and mounts it under the daily card; the realm pages do not', () => {
  const index = read('index.html'), home = read('shell/home.js'), scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  assert.ok(scripts.indexOf('run.js') > scripts.indexOf('daily.js') && scripts.indexOf('run.js') < scripts.indexOf('shell/home.js'));
  assert.match(home, /root\.VGRun\.mount\(S\.run,\{heading:'h2'\}\)/); assert.match(home, /root\.VGRun\.refresh\(\)/);
  assert.ok(!SHARED.after.includes('run.js'));
  assert.ok(read('sw.js').includes("'run.js'") || read('sw.js').includes('"run.js"'), 'run.js is in the precache');
  assert.match(read('daily.js'), /API\.lib = sandbox;/);
  const w = {}; vm.runInNewContext(read('run.js'), { window: w, Math, JSON }); w.VGRun.mount(null); w.VGRun.refresh();
});

console.log('PASS: ' + count + ' five-minute run tests.');
