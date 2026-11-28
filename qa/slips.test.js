/* Feedback that names the likely slip (game/slips.js, shown by game/app.js after a wrong check).
   Run: node qa/slips.test.js
   What it guarantees:
     - each slip in the brief is named when it fits: opposite sign, double or half, ten or a hundred times too big or
       too small, two answers swapped, the right number for a different box, rounded too early or to too few places,
       one too many or too few (whole numbers), a fraction turned upside down
     - a right field is right, by the mission's own tolerance; a wanted 0 never gets a sign or size slip
     - when nothing fits, the line is the kinder general one, never "Try this one again"
     - no sentence contains a digit, so none can give the answer away
     - for every mission of every pack, the authored answer is all right, and each slip made from it is named
       (or, where two slips give the same number, a slip is still named), with no per-mission data
     - app.js shows the sentence next to each wrong field and in the feedback line, through the page stand-in of
       qa/harness.js, and keeps the old wording on a page without slips.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const game = path.resolve(__dirname, '../game');
const S = require('../game/slips.js');

let count = 0;
function test(name, fn) { try { fn(); count++; console.log('ok   ' + name); } catch (e) { console.error('FAIL ' + name); throw e; } }
const kinds = (typed, wanted, tol) => S.check(typed, wanted, tol).map(r => r.ok ? 'ok' : r.kind);

test('each slip is named when it fits', () => {
  assert.deepEqual(kinds([-7], [7]), ['sign']);
  assert.deepEqual(kinds([2.5], [-2.5]), ['sign']);
  assert.deepEqual(kinds([24], [12]), ['double']);
  assert.deepEqual(kinds([6], [12]), ['half']);
  assert.deepEqual(kinds([120], [12]), ['scale10']);
  assert.deepEqual(kinds([1.2], [12]), ['scale10']);
  assert.deepEqual(kinds([1200], [12]), ['scale100']);
  assert.deepEqual(kinds([0.35], [35]), ['scale100']);
  assert.deepEqual(kinds([4, 3], [3, 4]), ['swap', 'swap']);
  assert.deepEqual(kinds([5, 5], [2, 5]), ['box', 'ok']);
  assert.deepEqual(kinds([3.1], [3.14159], 0.001), ['round']);
  assert.deepEqual(kinds([3.14], [3.14159], 0.001), ['round']);
  assert.deepEqual(kinds([0.33], [1 / 3], 0.001), ['round']);
  assert.deepEqual(kinds([13], [12]), ['off1']);
  assert.deepEqual(kinds([11], [12]), ['off1']);
  assert.deepEqual(kinds([4], [0.25]), ['flip']);
  assert.deepEqual(kinds([1.5], [2 / 3]), ['flip']);
});

test('the sentences are plain, name the slip, and contain no digit', () => {
  const all = [S.GENERAL, ...Object.values(S.TEXT)];
  for (const t of all) {
    assert.ok(!/\d/.test(t), 'no digit: ' + t);
    assert.ok(t.length < 120 && /^[A-Z]/.test(t) && /\.$/.test(t), 'one or two short sentences: ' + t);
    assert.ok(!/try this one again/i.test(t), 'kinder than the old line');
  }
  assert.match(S.check([-7], [7])[0].text, /sign/);
  assert.match(S.check([24], [12])[0].text, /twice/);
  assert.match(S.check([6], [12])[0].text, /half/);
  assert.match(S.check([120], [12])[0].text, /ten times too big/);
  assert.match(S.check([1.2], [12])[0].text, /ten times too small/);
  assert.match(S.check([1200], [12])[0].text, /hundred times too big/);
  assert.match(S.check([4, 3], [3, 4])[0].text, /swapped/);
  assert.match(S.check([5, 5], [2, 5])[0].text, /different box/);
  assert.match(S.check([3.1], [3.14159], 0.001)[0].text, /rounding/);
  assert.match(S.check([13], [12])[0].text, /one too many or one too few/);
  assert.match(S.check([4], [0.25])[0].text, /upside down/);
});

test('right is right, a wanted 0 has no sign or size slip, and nothing fits gives the general line', () => {
  assert.deepEqual(kinds([12.004], [12]), ['ok']);
  assert.deepEqual(kinds([12.004], [12], 0.001), ['round']);
  assert.deepEqual(kinds([3, 4], [3, 4]), ['ok', 'ok']);
  assert.deepEqual(kinds([0], [12]), ['general']);
  assert.deepEqual(kinds([5], [0]), ['general']);
  assert.deepEqual(kinds([-0.004], [0]), ['ok']);
  assert.deepEqual(kinds([57], [12]), ['general']);
  assert.equal(S.check([57], [12])[0].text, S.GENERAL);
  assert.deepEqual(kinds([NaN], [12]), ['general'], 'a field that is not a number gets the general line, never a throw');
  assert.equal(S.summary(S.check([3, 4], [3, 4])), '');
  assert.equal(S.summary(S.check([57], [12])), '', 'no named slip, no summary');
  assert.equal(S.summary(S.check([3, 8], [3, 4])), S.TEXT.double, 'the summary names the slip of the first wrong field that has one');
});

/* Every mission of every pack, with its authored numbers. */
const packsWindow = {}; vm.runInNewContext(fs.readFileSync(path.join(game, 'realms/packs.js'), 'utf8'), { window: packsWindow });
function missions(id) {
  const w = { VG_SEED: 0 };
  for (const f of packsWindow.VG_PACKS[id].scripts) { if (f === 'handson.js') continue; try { vm.runInNewContext(fs.readFileSync(path.join(game, f), 'utf8'), { window: w, Math }); } catch (e) { /* a page-only module; the missions are already loaded */ } }
  return w.QUESTS || [];
}
test('every mission of every pack: the answer is right, and each slip made from it is named', () => {
  let n = 0, named = 0, tried = 0;
  for (const id of Object.keys(packsWindow.VG_PACKS)) {
    for (const q of missions(id)) {
      const t = q.answer.map(Number), tol = q.tolerance ?? 0.01;
      assert.ok(S.check(t, t, tol).every(r => r.ok), id + ' ' + q.id + ': the answer itself is right');
      n++;
      for (const f of [x => -x, x => 2 * x, x => x / 2, x => 10 * x, x => x / 10, x => 100 * x]) {
        const typed = t.map((x, i) => i === 0 ? f(x) : x), r = S.check(typed, t, tol)[0];
        if (r.ok) continue; // the slip gives the same number (a 0)
        tried++; if (r.kind !== 'general') named++;
        assert.ok(typeof r.text === 'string' && r.text && !/\d/.test(r.text), id + ' ' + q.id);
      }
      if (t.length >= 2 && Math.abs(t[0] - t[1]) > 2 * tol) assert.deepEqual(kinds([t[1], t[0], ...t.slice(2)], t, tol).slice(0, 2), ['swap', 'swap'], id + ' ' + q.id + ': swapped boxes');
    }
  }
  assert.ok(n > 1800, 'all packs were read: ' + n + ' missions');
  assert.ok(named / tried > 0.97, `a slip made from the answer is named almost always (${named} of ${tried})`);
});

/* The page: app.js through the stand-in of qa/harness.js, with slips.js on the page window. */
function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}
const H = harness('found');
test('the page shows the slip beside the field and in the feedback line, and keeps the old line without slips.js', () => {
  const q = H.quests.find(x => !x.parent && Math.abs(Number(x.answer[0])) > 1 && x.answer.every(a => Math.abs(Number(a) + Number(x.answer[0])) > 1));
  assert.ok(q, 'a learn mission');
  const open = p => p.qa.setState({ solved: H.quests.map(x => x.id).filter(id => id !== q.id) });
  const p = H.boot(new Map(), { VGSlips: S }); open(p);
  p.qa.mission(q.id); p.el('#ready').onclick();
  p.qa.getMain().forEach((x, i) => x.value = String(i ? q.answer[i] : -Number(q.answer[0]))); p.el('#submit-answer').onclick();
  assert.equal(p.el('#answer-status-0').textContent, S.TEXT.sign, 'the field says what slipped');
  assert.match(p.el('.feedback').textContent, /^Good start\. The size is right, but the sign is not\./, 'and so does the feedback line');
  p.qa.getMain()[0].value = '0'; p.el('#submit-answer').onclick();
  assert.equal(p.el('#answer-status-0').textContent, S.GENERAL, 'nothing fits: the kinder general line');
  assert.match(p.el('.feedback').textContent, /break it down together/, 'the second miss still offers the guided steps');
  const old = H.boot(); open(old);
  old.qa.mission(q.id); old.el('#ready').onclick();
  old.qa.getMain().forEach((x, i) => x.value = String(i ? q.answer[i] : -Number(q.answer[0]))); old.el('#submit-answer').onclick();
  assert.equal(old.el('#answer-status-0').textContent, 'Try this one again', 'a page without slips.js keeps the old line');
});

test('realm.html loads slips.js before the pack', () => {
  const html = fs.readFileSync(path.join(game, 'realm.html'), 'utf8');
  assert.ok(html.includes('<script src="slips.js"></script>') && html.indexOf('src="slips.js"') < html.indexOf('shared.before'));
});

console.log(`slips: ${count} checks passed`);
