/* Tests for small surprises (game/finds.js): the seeded chance, never on the first solve of a session, never on two
   solves in a row, each find once, the hook in the collection's settle(), and that a find changes nothing else.
   Plain Node, no dependencies. Usage: node qa/finds.test.js */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const game = path.resolve(__dirname, '../game');
const read = f => fs.readFileSync(path.join(game, f), 'utf8');
const V2 = 'vector-guild-save-v2';
const plain = o => JSON.parse(JSON.stringify(o));
let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
const slice = solved => ({ solved, xp: 0, points: 0, tools: [], clean: [], revealed: [], landmarks: [], contracts: [], reviews: {}, errors: {}, rolls: {} });
const ids = n => Array.from({ length: n }, (_, i) => 'q' + String(i + 1).padStart(2, '0'));
function finds() { const window = {}; vm.runInNewContext(read('finds.js'), { window, Math }); return window.VGFinds; }
function page(storage, withFinds = true) {
  const ls = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const window = { localStorage: ls, VG_SEED: 1, VG_FIGURES: [] }, ctx = { window, Math, JSON };
  for (const f of ['save-store.js', 'realms/registry.js', 'collection/achievements.js', 'collection/core.js', ...(withFinds ? ['finds.js'] : [])]) vm.runInNewContext(read(f), ctx);
  return { window, C: window.VGCollection, S: window.VGSave, F: window.VGFinds };
}

test('the draw is seeded: the same save and solve number always give the same answer, about 12% of solves', () => {
  const F = finds();
  assert.equal(F.draw(7, 12), F.draw(7, 12)); assert.notEqual(F.draw(7, 12), F.draw(8, 12)); assert.notEqual(F.draw(7, 12), F.draw(7, 13));
  let hits = 0; for (let n = 2; n < 20002; n++) { const x = F.draw(12345, n); assert.ok(x >= 0 && x < 1); if (x < F.CHANCE) hits++; }
  assert.ok(hits > 0.10 * 20000 && hits < 0.14 * 20000, 'about 12%: ' + hits);
  assert.equal(F.CHANCE, 0.12); assert.ok(F.LIST.length >= 12); assert.equal(new Set(F.LIST.map(f => f.id)).size, F.LIST.length);
  assert.ok(F.LIST.some(f => f.kind === 'artifact') && F.LIST.some(f => f.kind === 'outpost'));
});

test('never on the first solve of a session, never two in a row, each find once, and none when all are found', () => {
  const F = finds();
  const hitAt = []; for (let n = 2; hitAt.length < 30; n++) if (F.draw(99, n) < F.CHANCE) hitAt.push(n);
  const n = hitAt[0];
  assert.ok(F.decide(null, 99, n, false)); assert.equal(F.decide(null, 99, n, true), null, 'first solve of the session');
  assert.equal(F.decide({ got: [], last: n - 1 }, 99, n, false), null, 'the solve before found something');
  assert.ok(F.decide({ got: [], last: n - 2 }, 99, n, false));
  assert.equal(F.decide({ got: F.LIST.map(f => f.id) }, 99, n, false), null, 'everything found');
  const got = []; let last = null;
  for (let k = 1; k < 4000 && got.length < F.LIST.length; k++) { const id = F.decide({ got, last }, 99, k, false); if (id) { assert.ok(!got.includes(id), 'once each'); assert.ok(last === null || k - last > 1); got.push(id); last = k; } }
  assert.equal(got.length, F.LIST.length, 'every find can turn up');
  assert.equal(F.decide(null, 99, 0, false), null); assert.equal(F.decide('junk', 99, NaN, false), null);
  /* A session: the first call never finds, whatever the draw. */
  const m = {}; F._newSession(); assert.deepEqual(plain(F.onSolve(m, n)), []); assert.equal(m.finds, undefined);
});

test('the hook: a solve made on the page can turn up a find; it pays nothing and changes nothing else', () => {
  /* Find a solve number where the draw (seed 1) hits, then solve up to it. */
  const F0 = finds(); let target = 3; while (!(F0.draw(1, target) < F0.CHANCE && F0.draw(1, target - 1) >= F0.CHANCE)) target++;
  const storage = new Map([[V2, JSON.stringify({ v: 2, seed: 1, intro: true, realms: { found: slice(ids(target - 2)) } })]]);
  const p = page(storage); p.S.load(); p.C.settle();
  /* Solve number target-1: the first solve of the session, never a find. */
  p.S.putRealm('found', slice(ids(target - 1))); let ev = plain(p.C.settle(undefined, { perks: true }));
  assert.equal(ev.filter(e => e.type === 'find').length, 0);
  const before = plain(p.S.meta());
  p.S.putRealm('found', slice(ids(target))); ev = plain(p.C.settle(undefined, { perks: true }));
  const fe = ev.filter(e => e.type === 'find'); assert.equal(fe.length, 1); assert.equal(fe[0].dust, 0);
  const after = plain(p.S.meta());
  assert.deepEqual(after.finds.got, [fe[0].id]); assert.equal(after.finds.last, target);
  const solveDust = ev.filter(e => e.type !== 'find').reduce((t, e) => t + e.dust, 0);
  assert.equal(after.dust, before.dust + solveDust, 'a find pays no stardust');
  assert.match(p.C.describe(ev), /found: /);
  /* A settle that is not a solve (page load, import) never rolls. */
  const q = page(storage); q.S.load(); assert.equal(plain(q.C.settle()).filter(e => e.type === 'find').length, 0);
  /* Without finds.js the collection works as before. */
  const r = page(new Map([[V2, JSON.stringify({ v: 2, seed: 1, realms: { found: slice(ids(3)) } })]]), false); r.S.load();
  assert.ok(Array.isArray(r.C.settle(undefined, { perks: true })));
});

test('wiring: realm pages and the home page load finds.js, the Figures tab lists the finds, an old save is unchanged', () => {
  const realm = read('realm.html'), index = read('index.html'), ui = read('collection/ui.js');
  assert.match(realm, /<script src="finds\.js"><\/script>/); assert.match(index, /<script src="finds\.js"><\/script>/);
  assert.match(ui, /root\.VGFinds\.drawInto\(paneEl, /);
  assert.ok(read('sw.js').includes('"finds.js"'), 'in the precache');
  const old = { v: 2, seed: 3, intro: true, realms: {}, meta: { v: 1, dust: 4, earned: 4, owned: {}, equipped: null, ach: [], pulls: 0, sinceRare: 0, sinceLegend: 0, paid: {}, drills: 0, looks: {} } };
  const p = page(new Map([[V2, JSON.stringify(old)]])); assert.deepEqual(plain(p.S.load()), old); assert.equal(p.F.owned(p.S.meta()).length, 0);
  assert.deepEqual(plain(p.F.owned({ finds: { got: ['vane', 'nope', 'vane', 3] } }).map(f => f.id)), ['vane']);
});

console.log('PASS: ' + count + ' small surprise tests.');
