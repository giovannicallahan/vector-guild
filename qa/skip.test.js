/* The skip-ahead check (game/skip.js, drawn and applied by game/app.js).
   Run: node qa/skip.test.js
   For each pack (linear algebra, Foundations) it plays app.js in Node through the page stand-in of qa/harness.js.
   What it guarantees:
     - a chapter that is not complete offers the check; a chapter whose earlier chapters are not done does not yet
     - the check is one fresh problem from every learn mission of the chapter: new numbers, no hints, no guided steps
     - passing marks the chapter's learn missions solved, with each mission's XP and skill point and no first-try star,
       pays the normal first-solve stardust once through the collection's settle call, and opens practice and the next chapter
     - a skipped mission is stored exactly like a solved one; the save gains no field
     - failing changes nothing but one small record; a new try needs a listed lesson opened, or a new day, and has new numbers
     - saves without the record load as before; a damaged record is dropped
     - typed answers are not thrown away by a stray tap: the dimmed area does nothing, Close, Escape and Back ask first
     - progress on missions the page does not know (a pack script that failed to load) is written back unchanged */
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const KEY = 'vector-guild-save-v2', DAY = 86400000;
const plain = x => JSON.parse(JSON.stringify(x)); // out of the vm realm, so deepEqual compares values
const same = (a, b, message) => assert.deepEqual(plain(a), plain(b), message);

function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}

let checks = 0;
function suite(realm) {
  const H = harness(realm), { quests, chapters, REALM } = H, sid = REALM.saveId || REALM.id, W = H.curriculumWindow, S = W.VGSkip;
  const test = (name, fn) => { try { fn(); checks++; } catch (e) { e.message = `[${realm}] ${name}: ${e.message}`; throw e; } };
  const save = slice => new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: slice ? { [sid]: slice } : {} })]]);
  const slice = p => JSON.parse(p.storage.get(KEY)).realms[sid];
  function page(storage) {
    const toasts = [], T = {};
    const p = H.boot(storage, { VG_FIGURES: [], VG_ACHIEVEMENTS: [], VG_TEST: T, VGCollectionUI: { toast: e => toasts.push(plain(e)), chip() {}, open() {} } });
    p.skip = T.skip; p.events = () => toasts.flat(); p.clear = () => { toasts.length = 0; };
    return p;
  }
  const byId = new Map(quests.map(q => [q.id, q])), learnOf = i => Array.from(chapters[i].ids), xpOf = ids => ids.reduce((n, id) => n + byId.get(id).xp, 0);
  const rightRows = items => items.map(it => Array.from(it.answer)), wrongAt = (items, ks) => items.map((it, k) => ks.includes(k) ? it.answer.map(x => x + 7) : Array.from(it.answer));
  const one = learnOf(0), two = learnOf(1);
  assert.ok(S && one.length > 1 && two.length > 0, 'skip.js is loaded with the pack, and the pack has at least two chapters');

  test('the rules: when a check is open, and when a new try is allowed', () => {
    const done = new Set();
    assert.equal(S.status(chapters[0], byId, done), 'open');
    assert.equal(S.status(chapters[1], byId, done), 'early', 'chapter 2 waits for chapter 1');
    assert.equal(S.status(chapters[0], byId, new Set(one)), 'done');
    assert.equal(S.status(chapters[1], byId, new Set(one)), 'open');
    assert.equal(S.status({ ids: [] }, byId, done), 'done', 'an empty chapter has no check');
    const noon = new Date(2026, 10, 21, 12).getTime(), rec = S.failRecord(null, [one[0]], noon);
    same(plain(rec), { last: noon, miss: [one[0]], seen: false, n: 1 });
    assert.equal(S.canRetry(null, noon), true); assert.equal(S.canRetry(rec, noon + 3600000), false, 'not the same day');
    assert.equal(S.canRetry({ ...rec, seen: true }, noon + 1000), true, 'after a listed lesson was opened');
    assert.equal(S.canRetry(rec, new Date(2026, 10, 22, 0, 1).getTime()), true, 'or on the next calendar day');
    assert.equal(S.failRecord(rec, [one[1]], noon).n, 2);
  });

  test('a new player is offered the check for the first chapter only', () => {
    const p = page();
    assert.equal(p.skip.state(0), 'open'); assert.equal(p.skip.state(1), 'early');
    const html = p.qa.show('campaign');
    assert.match(html, /class="secondary skip-start" data-skip="0">Already know this\? Take the check ↗<\/button>/);
    assert.ok(!/data-skip="1"/.test(html), 'no button for a chapter that cannot be checked yet');
    assert.match(p.skip.offer(1), /opens when the chapters before it are learned or checked/);
    assert.match(p.skip.offer(0), new RegExp(`each of the ${one.length} lessons`));
  });

  test('the check has one fresh problem per learn mission, without hints or steps', () => {
    const p = page(), items = p.skip.build(0);
    same(items.map(it => it.id), one, 'every learn mission of the chapter, in order, and no practice mission');
    for (const it of items) {
      const base = byId.get(it.id);
      assert.notEqual(it.prompt, base.prompt, `${it.id}: not the authored numbers`);
      assert.notEqual(it.prompt, W.Gen.instance(base, 0, 0).prompt, `${it.id}: not the numbers the player's mission shows`);
      assert.ok(it.answer.length === base.answer.length && it.answer.every(Number.isFinite) && it.labels.length === it.answer.length);
      same(Object.keys(it).sort(), ['answer', 'id', 'labels', 'prompt', 'title', 'tolerance', 'topic'], 'no hints, no guided steps, no solution');
      assert.ok(!/(?<![A-Za-z])-(?=\d)/.test(it.prompt), 'minus signs are typographic');
    }
    const again = p.skip.build(0);
    assert.ok(again.every((it, k) => it.prompt !== items[k].prompt), 'a second check on the same page has other numbers');
    assert.equal(S.grade(items, rightRows(items)).passed, true);
    const g = S.grade(items, wrongAt(items, [1]));
    assert.equal(g.passed, false); same(plain(g.missed), [one[1]]);
    assert.equal(S.grade(items, items.map(() => [NaN])).passed, false, 'empty answers are wrong answers');
    assert.equal(S.grade(items, []).right.some(Boolean), false);
  });

  test('passing marks the chapter learned: XP and points, no stars, stardust once', () => {
    const p = page(), items = p.skip.build(0);
    p.skip.check(0);
    assert.match(p.dc.innerHTML, /CHAPTER 1 CHECK/); assert.ok(!/Request hint|Guide me|Reveal solution/.test(p.dc.innerHTML), 'the check offers no help');
    const res = p.skip.finish(0, items, rightRows(items)), st = p.qa.getState();
    assert.equal(res.passed, true);
    same(st.solved, one); assert.equal(st.xp, xpOf(one)); assert.equal(st.points, one.length);
    same(st.clean, [], 'no first-try stars'); assert.ok(!('skips' in st));
    const ev = p.events();
    same(ev.filter(e => e.type === 'solve').map(e => e.qid), one); assert.ok(ev.filter(e => e.type === 'solve').every(e => e.dust === 10));
    assert.equal(ev.filter(e => e.type === 'star').length, 0, 'no star stardust');
    same(ev.filter(e => e.type === 'chapter').map(e => [e.chapter, e.dust]), [[0, 25]]);
    assert.equal(p.collection.dust(), 10 * one.length + 25);
    assert.match(p.el('#skip-result')._html || p.el('#skip-result').innerHTML, /is marked as learned/);
    assert.equal(p.skip.state(0), 'done'); assert.equal(p.skip.state(1), 'open', 'the next chapter can now be checked');
    assert.equal(p.qa.available(two[0]), true, 'the next chapter is unlocked');
    for (const id of chapters[0].practice || []) assert.equal(p.qa.available(id), true, `practice ${id} is unlocked`);
    assert.equal(p.skip.finish(0, items, rightRows(items)), null, 'handing in twice does nothing');
    same(plain(p.collection.settle()), [], 'settling again pays nothing');
    assert.equal(p.qa.getState().xp, xpOf(one)); assert.equal(p.collection.dust(), 10 * one.length + 25);
    const again = page(p.storage);
    same(again.events(), [], 'a reload pays nothing'); assert.equal(again.collection.dust(), 10 * one.length + 25);
    same(again.qa.getState().solved, one); assert.ok(!/data-skip="0"/.test(again.qa.show('campaign')), 'a complete chapter has no offer');
  });

  test('a skipped mission is stored exactly like a solved one, minus the star', () => {
    const p = page(), items = p.skip.build(0); p.skip.finish(0, items, rightRows(items));
    const typed = page(save({ solved: one, tools: [] }));
    same(p.qa.getState(), typed.qa.getState(), 'the same progress as a save where every mission was solved with help');
    same(Object.keys(slice(p)).sort(), Object.keys(page().qa.getState()).filter(k => k !== 'seed').sort(), 'the stored slice has the fields it always had');
    assert.ok(!('skips' in slice(p)));
    /* replaying a skipped mission is practice, like any solved mission */
    p.clear(); p.qa.mission(one[0]); p.el('#ready').onclick();
    p.qa.getMain().forEach((x, i) => x.value = String(p.qa.current().answer[i])); p.el('#submit-answer').onclick();
    assert.match(p.el('.feedback').textContent, /Practice complete/); same(p.events(), []); assert.equal(p.qa.getState().xp, xpOf(one));
  });

  test('missions already solved keep their stars and are not paid again', () => {
    const p = page(); p.qa.mission(one[0]); p.el('#ready').onclick();
    p.qa.getMain().forEach((x, i) => x.value = String(p.qa.current().answer[i])); p.el('#submit-answer').onclick();
    same(p.qa.getState().clean, [one[0]]); assert.equal(p.collection.dust(), 15); p.clear();
    const items = p.skip.build(0); assert.equal(items.length, one.length, 'the check still covers every learn mission');
    p.skip.finish(0, items, rightRows(items));
    const st = p.qa.getState();
    same(st.solved, one); same(st.clean, [one[0]]); assert.equal(st.xp, xpOf(one)); assert.equal(st.points, one.length);
    same(p.events().filter(e => e.type === 'solve').map(e => e.qid), one.slice(1));
    assert.equal(p.collection.dust(), 15 + 10 * (one.length - 1) + 25);
  });

  test('failing loses nothing and lists the lessons; a new try needs a lesson opened', () => {
    const p = page(), items = p.skip.build(0); p.skip.check(0);
    const res = p.skip.finish(0, items, wrongAt(items, [0, 1])), st = p.qa.getState();
    assert.equal(res.passed, false); same(plain(res.missed), one.slice(0, 2));
    same(st.solved, []); assert.equal(st.xp, 0); assert.equal(st.points, 0); same(st.clean, []); same(st.errors, {}, 'nothing goes to the error notebook');
    same(p.events(), []); assert.equal(p.collection.dust(), 0);
    same(Object.keys(st.skips), ['0']); same(st.skips[0].miss, one.slice(0, 2)); assert.equal(st.skips[0].seen, false); assert.equal(st.skips[0].n, 1);
    const result = p.el('#skip-result')._html || p.el('#skip-result').innerHTML;
    assert.match(result, new RegExp(`${one.length - 2} of ${one.length} right · 2 to learn`)); assert.match(result, new RegExp(`data-skip-lesson="${one[0]}"`)); assert.match(result, /Nothing is lost/);
    assert.equal(p.skip.state(0), 'wait');
    const offer = p.skip.offer(0);
    assert.match(offer, /data-skip="0" disabled>Take the check again/); assert.match(offer, new RegExp(`data-quest="${one[1]}"`));
    assert.equal(p.skip.finish(0, items, rightRows(items)), null, 'the same check cannot be handed in again');
    same(p.qa.getState().solved, []);
    /* the record survives a reload; a lesson that was not listed does not unlock the new try */
    const back = page(p.storage); assert.equal(back.skip.state(0), 'wait'); same(back.qa.getState().skips, st.skips);
    back.qa.mission(one[2]); assert.equal(back.skip.state(0), 'wait');
    back.qa.mission(one[1]); assert.equal(back.skip.state(0), 'retry', 'opening a listed lesson allows a new try');
    assert.equal(slice(back).skips[0].seen, true);
    assert.match(back.skip.offer(0), /data-skip="0">Take the check again/);
    const next = back.skip.build(0);
    assert.ok(next.every((it, k) => it.prompt !== items[k].prompt), 'the new try has new numbers');
    back.skip.finish(0, next, wrongAt(next, [2])); assert.equal(back.qa.getState().skips[0].n, 2); same(back.qa.getState().skips[0].miss, [one[2]]);
    back.qa.mission(one[2]);
    const last = back.skip.build(0); assert.equal(back.skip.finish(0, last, rightRows(last)).passed, true);
    assert.ok(!('skips' in back.qa.getState()) && !('skips' in slice(back)), 'the record goes when the chapter is complete');
    same(back.qa.getState().solved, one); assert.equal(back.collection.dust(), 10 * one.length + 25);
  });

  test('a fail from an earlier day can be retried; old and damaged saves load', () => {
    const rec = { last: Date.now() - 2 * DAY, miss: [one[0]], seen: false, n: 1 };
    const p = page(save({ solved: [], tools: [], skips: { 0: rec } }));
    assert.equal(p.skip.state(0), 'retry'); same(p.qa.getState().skips, { 0: rec });
    const old = page(save({ solved: [one[0]], tools: [] }));
    assert.ok(!('skips' in old.qa.getState()), 'a save without the record gets none'); assert.equal(old.skip.state(0), 'open');
    const junk = page(save({ solved: one, tools: [], skips: { 0: rec, 1: { last: 'x', miss: ['nope', two[0], two[0]], seen: 1 }, 99: rec, x: 4, 2: { miss: [] } } }));
    same(junk.qa.getState().skips, { 1: { last: 0, miss: [two[0]], seen: false, n: 1 } }, 'only a real record of a chapter that is not complete is kept');
    for (const bad of [null, 7, 'x', [], { 0: null }]) assert.ok(!('skips' in page(save({ solved: [], tools: [], skips: bad })).qa.getState()));
    assert.equal(S.tidy({ __proto__: rec }, chapters, new Set()), null);
  });

  test('typed answers are not lost to a stray tap; Close, Escape and Back ask first', () => {
    const p = page(), items = p.skip.build(0), dialog = p.el('#dialog');
    let asked = 0, answer = false, closes = 0;
    p.window.confirm = msg => { asked++; assert.match(msg, /Leave the check\? The answers you typed will be cleared\./); return answer; };
    dialog.close = () => { closes++; }; dialog.open = true;
    const fields = [{ value: '' }, { value: '' }], all = p.dc.querySelectorAll;
    p.dc.querySelectorAll = sel => sel === '#skip-list input' ? fields : all(sel);
    assert.equal(p.skip.mayClose('backdrop'), true, 'no check open: a dialog closes as before');
    p.skip.check(0);
    assert.equal(p.skip.mayClose('backdrop'), true, 'nothing typed yet'); assert.equal(p.skip.mayClose(), true);
    fields[1].value = '   '; assert.equal(p.skip.mayClose(), true, 'spaces are not an answer');
    fields[1].value = '7/6';
    assert.equal(p.skip.mayClose('backdrop'), false, 'a tap on the dimmed area is ignored'); assert.equal(asked, 0, 'without a question');
    assert.equal(p.skip.mayClose(), false); assert.equal(asked, 1, 'Close and Escape ask');
    p.el('dialog close').onclick(); assert.equal(asked, 2); assert.equal(closes, 0, 'the answer was "stay": the dialog stays open');
    assert.equal(p.skip.back(), true); assert.equal(asked, 3); assert.equal(closes, 0, 'Android Back asks too and is handled');
    answer = true; p.el('dialog close').onclick(); assert.equal(closes, 1, 'the answer was "leave"');
    /* handed in: there is nothing left to lose */
    p.skip.check(0); asked = 0; assert.equal(p.skip.mayClose('backdrop'), false);
    p.skip.finish(0, items, wrongAt(items, [0]));
    assert.equal(p.skip.mayClose('backdrop'), true); assert.equal(p.skip.mayClose(), true); assert.equal(asked, 0);
    /* another dialog, or a closed one, is never held */
    p.skip.check(0); p.qa.mission(one[0]); assert.equal(p.skip.mayClose('backdrop'), true);
    const app = fs.readFileSync(path.join(__dirname, '..', 'game', 'app.js'), 'utf8');
    assert.ok(/addEventListener\('click',e=>\{if\(e\.target===dialog&&mayClose\('backdrop'\)\)dialog\.close\(\)\}\)/.test(app) && /addEventListener\('cancel',/.test(app), 'the dimmed area and Escape go through the same question');
  });

  test('progress on missions this page does not know is written back unchanged', () => {
    /* q98z stands for a practice mission whose script did not load (or one from a newer release). */
    const stored = { solved: [...one, 'q98z', 'zz-later'], tools: [], clean: [one[0], 'q98z'], reviews: { q98z: { n: 2, last: 5 } }, errors: { q98z: { n: 1, last: 1, pit: {} } }, rolls: { q98z: 3 } };
    const p = page(save(stored)), st = p.qa.getState();
    same(st.solved, one, 'the page plays with the missions it knows'); assert.equal(st.xp, xpOf(one)); same(st.clean, [one[0]]);
    const items = p.skip.build(1); p.skip.finish(1, items, wrongAt(items, [0]));   /* any save */
    const kept = slice(p);
    same(kept.solved, [...one, 'q98z', 'zz-later']); same(kept.clean, [one[0], 'q98z']);
    same(kept.reviews, stored.reviews); same(kept.errors, stored.errors); same(kept.rolls, stored.rolls);
    assert.ok(kept.skips && kept.skips[1], 'and this page\'s own change is stored with it');
    const again = page(p.storage); same(again.qa.getState().solved, one);
    const next = again.skip.build(1); again.skip.finish(1, next, wrongAt(next, [0]));
    same(slice(again).solved, [...one, 'q98z', 'zz-later'], 'still there after a reload and another save');
    /* a save without such entries is stored exactly as before */
    const plainSave = page(save({ solved: one, tools: [] })), its = plainSave.skip.build(1); plainSave.skip.finish(1, its, wrongAt(its, [0]));
    same(slice(plainSave).solved, one); same(slice(plainSave).reviews, {});
  });
}

for (const realm of ['la', 'found']) suite(realm);
const packs = fs.readFileSync(path.join(__dirname, '..', 'game', 'realms', 'packs.js'), 'utf8'), src = fs.readFileSync(path.join(__dirname, '..', 'game', 'skip.js'), 'utf8');
assert.equal((packs.match(/'skip\.js'/g) || []).length, 2, 'both packs load skip.js');
assert.ok(!/\bfetch\(|\bimport\s|localStorage|document\./.test(src), 'skip.js is a classic script with no page or storage code');
checks++;
console.log(`PASS: skip-ahead check, ${checks} checks (linear algebra and Foundations): offer, fresh problems, pass, fail, retry, saves.`);
