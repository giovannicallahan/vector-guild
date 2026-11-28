/* Next up (game/next-up.js, drawn by game/app.js on the campaign page).
   Run: node qa/next-up.test.js
   What it guarantees:
     - up to three missions, every one unsolved with its prerequisites met
     - the first is the next step on the main path (the old continue button, still id="begin")
     - at least one learn and one practice mission whenever both kinds are open
     - practice for the concept solved last comes first; no two practice missions of one concept while another is open
     - for every pack, at every point of a play-through in pack order, the rules above hold
     - the campaign page shows the strip in place of the single button, each item opens its mission, and a page
       without next-up.js keeps the old button */
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const NU = require('../game/next-up.js');

let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}
const fs = require('node:fs'), vm = require('node:vm'), game = path.resolve(__dirname, '../game');
/* Every mission of a pack, as the page has them after chapters.js (prerequisites filled in), without the full harness. */
const packsWindow = {}; vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packsWindow });
function missions(id) {
  const w = { VG_SEED: 0 };
  for (const f of packsWindow.VG_PACKS[id].scripts) { if (f === 'handson.js') continue; try { vm.runInNewContext(fs.readFileSync(path.join(game, f), 'utf8'), { window: w, Math }); } catch (e) { /* a page-only module */ } }
  return w.QUESTS || [];
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* The rules, from the outside: o as for pick, list what it returned. */
function rules(o, list, where) {
  const done = new Set(o.solved), open = o.quests.filter(q => !done.has(q.id) && o.available(q));
  assert.ok(list.length <= 3 && list.length === Math.min(3, open.length), where + ': up to three, as many as are open');
  assert.equal(new Set(list).size, list.length, where + ': no repeats');
  for (const q of list) assert.ok(!done.has(q.id) && o.available(q), where + ': ' + q.id + ' can be started now');
  if (o.next) assert.equal(list[0], o.next, where + ': the main path comes first');
  if (open.some(q => q.parent) && open.some(q => !q.parent)) assert.ok(list.some(q => q.parent) && list.some(q => !q.parent), where + ': one learn and one practice');
  const ps = list.filter(q => q.parent), concepts = new Set(open.filter(q => q.parent).map(q => q.parent));
  if (concepts.size >= 2 && ps.length >= 2) assert.ok(new Set(ps.map(q => q.parent)).size >= 2, where + ': practice from two concepts when two are open');
}

test('a small pack: the main path first, then the other kind, then a second learn mission', () => {
  const qs = [{ id: 'q01', title: 'A', topic: 'a', sector: 'S' }, { id: 'q01b', parent: 'q01', title: 'Ab', topic: 'a', sector: 'S', kind: 'setting' }, { id: 'q01c', parent: 'q01', title: 'Ac', topic: 'a', sector: 'S' },
    { id: 'q02', prereqs: ['q01'], title: 'B', topic: 'b', sector: 'S' }, { id: 'q03', prereqs: ['q01'], title: 'C', topic: 'c', sector: 'T' }, { id: 'q04', prereqs: ['q02', 'q03'], title: 'D', topic: 'd', sector: 'T' }];
  const by = new Map(qs.map(q => [q.id, q]));
  const o = solved => ({ quests: qs, solved, available: q => (q.prereqs || []).every(id => solved.includes(id) || (by.get(id) && false)) && (!q.parent || solved.includes(q.parent)), next: qs.find(q => !q.parent && !solved.includes(q.id) && (q.prereqs || []).every(id => solved.includes(id))) || null });
  assert.deepEqual(NU.pick(o([])).map(q => q.id), ['q01'], 'a new player: only the first mission is open');
  assert.deepEqual(NU.pick(o(['q01'])).map(q => q.id), ['q02', 'q01b', 'q03']);
  assert.deepEqual(NU.pick(o(['q01', 'q02', 'q03', 'q04'])).map(q => q.id), ['q01b', 'q01c'], 'only practice left: up to three of it');
  assert.deepEqual(NU.pick(o(qs.map(q => q.id))), [], 'nothing open: nothing to show');
  const markup = NU.html(NU.pick(o(['q01'])), { esc, kind: q => q.kind === 'setting' ? 'New setting' : 'Practice' });
  assert.match(markup, /^<section class="next-up" aria-labelledby="next-up-title">/);
  assert.match(markup, /<button type="button" class="next-up-item is-main is-learn" id="begin"><span class="nu-kind">New concept · on your path<\/span><span class="nu-title">B<\/span>/);
  assert.match(markup, /data-quest="q01b"><span class="nu-kind">New setting<\/span>/);
  assert.match(markup, /These 3 missions are open now\. Pick any of them\./);
  assert.equal((markup.match(/id="begin"/g) || []).length, 1, 'one main button');
  assert.equal(NU.html([], { esc }), '');
});

test('every pack, all through a play-through in pack order: the rules hold', () => {
  let points = 0;
  for (const realm of Object.keys(packsWindow.VG_PACKS)) {
    const qs = missions(realm), solved = [];
    const available = q => (q.prereqs || []).every(id => solved.includes(id));
    const next = () => qs.find(q => !q.parent && !solved.includes(q.id) && available(q)) || qs.find(q => !solved.includes(q.id) && available(q)) || null;
    /* Learn missions first, practice of each concept after the next learn mission, the way a player might go. */
    const order = []; for (const q of qs.filter(q => !q.parent)) { order.push(q); } for (const q of qs.filter(q => q.parent)) order.push(q);
    for (let k = 0; k <= order.length; k++) {
      const o = { quests: qs, solved: solved.slice(), available, next: next() };
      if (k % 3 === 0 || k === order.length) { rules(o, NU.pick(o), realm + ' after ' + k); points++; }
      if (k < order.length && available(order[k])) solved.push(order[k].id);
    }
  }
  assert.ok(points > 500, points + ' points checked');
});

test('practice for the concept solved last comes first', () => {
  const qs = [{ id: 'a' }, { id: 'ab', parent: 'a' }, { id: 'b' }, { id: 'bb', parent: 'b' }, { id: 'c' }];
  const o = { quests: qs, solved: ['b', 'a'], available: () => true, next: qs[4] };
  assert.deepEqual(NU.pick(o).map(q => q.id), ['c', 'ab', 'bb']);
  assert.deepEqual(NU.pick({ ...o, solved: ['a', 'b'] }).map(q => q.id), ['c', 'bb', 'ab']);
});

const H = harness('found');
test('the campaign page shows the strip in place of the single button; each item opens its mission', () => {
  const learn = H.quests.filter(q => !q.parent), firstTwo = learn.slice(0, 2).map(q => q.id);
  const storage = new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 0, intro: true, realms: { found: { solved: firstTwo, xp: 0, points: 0, tools: [] } } })]]);
  const p = H.boot(storage, { VGNextUp: NU });
  const html = p.qa.show('campaign');
  assert.match(html, /<section class="next-up"/);
  assert.equal((html.match(/id="begin"/g) || []).length, 1, 'one #begin, the first item');
  assert.doesNotMatch(html, /<button class="primary" id="begin">/, 'the single button is gone');
  assert.ok(html.includes('id="how"'), 'How to play stays');
  const items = [...html.matchAll(/class="next-up-item[^"]*" (?:id="begin"|data-quest="([^"]+)")/g)];
  assert.equal(items.length, 3);
  assert.ok(html.includes(`id="begin"><span class="nu-kind">New concept · on your path</span><span class="nu-title">${esc(H.byId[p.qa.next()].title)}</span>`), 'the first item is the next mission on the path');
  assert.ok(items.slice(1).some(m => H.byId[m[1]].parent), 'a practice mission is offered');
  const old = H.boot(storage); assert.match(old.qa.show('campaign'), /<button class="primary" id="begin">▶ Next mission<\/button>/, 'without next-up.js: the old button');
  const all = H.boot(new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 0, intro: true, realms: { found: { solved: H.quests.map(q => q.id), xp: 0, points: 0, tools: [] } } })]]), { VGNextUp: NU });
  assert.match(all.qa.show('campaign'), /<button class="primary" id="begin">Revisit the first mission<\/button>/, 'everything solved: the old revisit button');
  assert.doesNotMatch(all.qa.show('campaign'), /class="next-up"/);
});

test('realm.html loads next-up.js; engage.css lays the strip out for a phone and a desktop', () => {
  const html = fs.readFileSync(path.join(game, 'realm.html'), 'utf8'), css = fs.readFileSync(path.join(game, 'engage.css'), 'utf8');
  assert.ok(html.includes('<script src="next-up.js"></script>') && html.indexOf('src="next-up.js"') < html.indexOf('shared.before'));
  assert.match(css, /\.next-up-list\{[^}]*display:grid/);
  assert.match(css, /\.next-up-item\{[^}]*min-height:44px/);
});

console.log(`next-up: ${count} checks passed`);
