/* Try it first (game/try-first.js, wired in game/app.js).
   Run: node qa/try-first.test.js
   What it guarantees:
     - opening a learn mission offers "Try it first" (straight to the problem) and "Learn it first" (the lesson, then
       the problem, as before); a practice mission still goes straight to the problem; a locked one shows no choice
     - the choice is remembered in meta.tryFirst and drawn as the main button next time, also on another realm's page;
       a save without it opens on "Learn it first", and it travels with a backup
     - after a miss in try-first mode the lesson opens beside the problem, once, with one plain sentence; the learn-first
       path and the first-try star are unchanged
     - a page without try-first.js keeps the old markup */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const TF = require('../game/try-first.js');

let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}
const H = harness('found');
const first = H.quests.find(q => !q.parent && !(q.prereqs || []).length);
const page = (storage = new Map()) => H.boot(storage, { VGTryFirst: TF });
const wrong = p => { p.qa.getMain().forEach(x => x.value = '987654'); p.el('#submit-answer').onclick(); return p.el('.feedback').textContent; };
const order = html => { const a = html.indexOf('id="ready-top"'), b = html.indexOf('id="learn-first"'); return a < b ? 'try' : 'learn'; };

test('a learn mission offers the choice; Learn it first is the main button on a save that has never chosen', () => {
  const p = page();
  assert.equal(TF.get(p.store), 'learn');
  p.qa.mission(first.id);
  const html = p.stage._html;
  assert.match(html, /class="start-choice" role="group" aria-labelledby="start-choice-label"/);
  assert.match(html, /How do you want to start\?/);
  assert.match(html, /class="primary" id="learn-first"/); assert.match(html, /class="secondary" id="ready-top"/);
  assert.equal(order(html), 'learn');
  assert.match(html, /<h3 id="learn-heading" tabindex="-1">01 \/ LEARN/, 'the lesson heading can take focus');
  assert.match(html, /id="ready">I'm ready to try/, 'the learn-first flow still ends in the old button');
  assert.doesNotMatch(html, /I know this/);
  assert.equal(p.qa.getMain().length, 0, 'no answer fields before a choice');
  assert.equal(p.store.meta().tryFirst, undefined, 'only looking stores nothing');
});

test('Try it first opens the problem and is remembered; a miss then opens the lesson beside it, once', () => {
  const storage = new Map(), p = page(storage);
  p.qa.mission(first.id); p.el('#ready-top').onclick();
  assert.equal(p.qa.getMain().length, first.answer.length, 'straight to the problem');
  assert.equal(p.store.meta().tryFirst, 'try');
  const lesson = p.el('dialog-content .lesson-review'); lesson.open = false;
  const said = wrong(p);
  assert.match(said, /^Good start\./); assert.ok(said.includes(TF.MISS), 'the miss says the lesson is open');
  assert.equal(lesson.open, true, 'the lesson is opened');
  assert.ok(!wrong(p).includes(TF.MISS), 'said once: the lesson is already open');
  const again = page(storage); again.qa.mission(first.id);
  assert.equal(order(again.stage._html), 'try', 'next time Try it first comes first');
  assert.match(again.stage._html, /class="primary" id="ready-top"/);
  const other = harness('calc1').boot(storage, { VGTryFirst: TF });
  other.qa.mission(other.qa.next());
  assert.equal(order(other.stage._html), 'try', 'the choice holds on every realm');
});

test('Learn it first is remembered, keeps the lesson flow, and a miss there adds nothing', () => {
  const storage = new Map(), p = page(storage);
  TF.set(p.store, 'try');
  p.qa.mission(first.id); p.el('#learn-first').onclick();
  assert.equal(p.store.meta().tryFirst, 'learn');
  assert.equal(p.qa.getMain().length, 0, 'Learn it first stays on the lesson');
  p.el('#ready').onclick();
  const lesson = p.el('dialog-content .lesson-review'); lesson.open = false;
  assert.ok(!wrong(p).includes(TF.MISS)); assert.equal(lesson.open, false);
});

test('trying first keeps the first-try star and the full reward', () => {
  const p = page(); p.qa.mission(first.id); p.el('#ready-top').onclick();
  p.qa.getMain().forEach((x, i) => x.value = String(first.answer[i])); p.el('#submit-answer').onclick();
  assert.match(p.el('.feedback').textContent, /Mission complete!.*★ First-try solve/);
  assert.equal(p.qa.getState().xp, first.xp);
});

test('a practice mission and a locked mission show no choice; a page without try-first.js keeps the old link', () => {
  const p = page(new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 0, intro: true, realms: { found: { solved: [first.id], xp: 0, points: 0, tools: [] } } })]]));
  const pr = H.quests.find(q => q.parent === first.id);
  p.qa.mission(pr.id); assert.doesNotMatch(p.stage._html + p.dc._html, /start-choice/); assert.ok(p.qa.getMain().length > 0);
  const locked = H.quests.find(q => !q.parent && (q.prereqs || []).length && !q.prereqs.every(id => id === first.id));
  p.qa.mission(locked.id); assert.doesNotMatch(p.stage._html, /start-choice/);
  const old = H.boot(); old.qa.mission(first.id);
  assert.match(old.stage._html, /id="ready-top">I know this · skip to the problem ↓/); assert.doesNotMatch(old.stage._html, /start-choice/);
});

test('the stored choice is checked, kept in a backup, and an old save means learn first', () => {
  const p = page();
  assert.equal(TF.set(p.store, 'sideways'), false); assert.equal(TF.get(p.store), 'learn');
  assert.equal(TF.set(p.store, 'try'), true);
  const backup = p.store.exportAll(); assert.equal(backup.meta.tryFirst, 'try');
  const q = page(); assert.equal(q.store.importAny(JSON.parse(JSON.stringify(backup))).ok, true); assert.equal(TF.get(q.store), 'try');
  const bad = page(new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 1, intro: true, realms: {}, meta: { tryFirst: 7 } })]]));
  assert.equal(TF.get(bad.store), 'learn');
  assert.equal(TF.get(null), 'learn'); assert.equal(TF.set(null, 'try'), false);
});

test('realm.html loads try-first.js and engage.css; the wide-screen layout and phone layout are in engage.css', () => {
  const game = path.resolve(__dirname, '../game'), html = fs.readFileSync(path.join(game, 'realm.html'), 'utf8'), css = fs.readFileSync(path.join(game, 'engage.css'), 'utf8');
  assert.ok(html.includes('<script src="try-first.js"></script>') && html.indexOf('src="try-first.js"') < html.indexOf('shared.before'));
  assert.ok(html.includes('<link rel="stylesheet" href="engage.css"><link rel="stylesheet" href="life.css"></head>'));
  assert.match(css, /@media\(min-width:1000px\)\{[^]*#mission-stage\.try-beside\{display:grid/);
  assert.match(css, /\.start-choice-buttons\{display:flex;flex-wrap:wrap/);
});

console.log(`try-first: ${count} checks passed`);
