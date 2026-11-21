/* The collection on the realm page (docs/COLLECTION.md): game/app.js with game/collection/core.js.
   Run: node qa/realm-collection.test.js
   For each pack (linear algebra, Foundations) it plays app.js in Node through the page stand-in of qa/harness.js
   and checks what the realm page must guarantee:
     - a first solve pays 10 stardust, +5 with the first-try star, once; replaying and reloading pay nothing more
     - a 2.0 save (and a 1.4.1 save) with past solves is paid on its first load, once, and is otherwise unchanged
     - a passed review drill pays once; a missed one pays nothing; a bought landmark is settled
     - second look keeps the first-try star for one wrong first check per mission, and says so
     - no perk and no award changes XP, skill points, answers or what counts as solved
     - a page without the collection scripts plays exactly as before
   The figures here are a small fixture, so this test does not depend on game/collection/figures.js. */
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const KEY = 'vector-guild-save-v2';
const FIGURES = [
  { id: 'fx-look', name: 'Fixture look', rarity: 'common', field: 'Fixture', perk: 'secondlook' },
  { id: 'fx-dust', name: 'Fixture dust', rarity: 'common', field: 'Fixture', perk: 'stardust' },
  { id: 'fx-xp', name: 'Fixture legacy', rarity: 'rare', field: 'Fixture', perk: 'xp' },
  { id: 'fx-drill', name: 'Fixture drill', rarity: 'legendary', field: 'Fixture', perk: 'drill' }
];
const plain = x => JSON.parse(JSON.stringify(x)); // out of the vm realm, so deepEqual compares values

/* qa/harness.js checks one pack per run and exports its page stand-in. Load it once for each pack. */
function harness(realm) {
  const file = path.resolve(__dirname, 'harness.js'), argv = process.argv, log = console.log;
  delete require.cache[file];
  process.argv = [argv[0], file, '--realm', realm]; console.log = () => {};
  try { return require(file); } finally { process.argv = argv; console.log = log; }
}

let checks = 0;
function suite(realm) {
  const H = harness(realm), { quests, chapters, REALM } = H, sid = REALM.saveId || REALM.id;
  const real = H.curriculumWindow.VG_ACHIEVEMENTS;
  const test = (name, fn) => { try { fn(); checks++; } catch (e) { e.message = `[${realm}] ${name}: ${e.message}`; throw e; } };
  const meta = (equipped, more = {}) => ({ v: 1, dust: 0, earned: 0, owned: equipped ? { [equipped]: 1 } : {}, equipped: equipped || null, ach: [], pulls: equipped ? 1 : 0, sinceRare: 0, sinceLegend: 0, paid: {}, drills: 0, looks: {}, ...more });
  const save = (slice, m) => new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: slice ? { [sid]: slice } : {}, ...(m ? { meta: m } : {}) })]]);
  const stored = p => JSON.parse(p.storage.get(KEY));
  /* One page load with a stand-in interface that records every toast and chip refresh. */
  function page(storage, { achievements = [], ui = true } = {}) {
    const seen = { toasts: [], chips: 0, opened: 0 };
    const VGCollectionUI = { toast: events => seen.toasts.push(plain(events)), chip: () => { seen.chips++; }, open: () => { seen.opened++; } };
    const p = H.boot(storage, { VG_FIGURES: FIGURES, VG_ACHIEVEMENTS: achievements, ...(ui ? { VGCollectionUI } : {}) });
    p.seen = seen; p.events = () => seen.toasts.flat(); p.clear = () => { seen.toasts.length = 0; };
    return p;
  }
  const open = (p, id) => { p.qa.mission(id); p.el('#ready').onclick(); };
  const check = (p, values) => { const inputs = p.qa.getMain(); assert.equal(inputs.length, values.length); inputs.forEach((x, i) => x.value = String(values[i])); p.el('#submit-answer').onclick(); return p.el('.feedback').textContent; };
  const right = p => check(p, Array.from(p.qa.current().answer));
  const wrong = p => check(p, Array.from(p.qa.current().answer).map(x => x + 7));
  const types = events => events.map(e => e.type + ':' + e.dust);
  const first = quests[0], second = quests.find(q => q.id !== first.id && (q.prereqs || []).every(id => id === first.id));
  const chapterOne = Array.from(chapters[0].ids), xpOf = ids => ids.reduce((n, id) => n + H.byId[id].xp, 0);
  assert.ok(first && (first.prereqs || []).length === 0 && second, 'the pack has a first mission and one that follows it');

  test('a first-try solve pays 10 + 5 once; replay and reload pay nothing', () => {
    const p = page();
    assert.deepEqual(p.events(), [], 'a new player is paid nothing on load'); assert.equal(p.collection.dust(), 0);
    assert.equal(p.el('#collection-chip').hidden, false, 'the chip is shown'); assert.ok(p.seen.chips >= 1, 'and drawn by the interface');
    open(p, first.id); assert.match(right(p), /Mission complete/);
    assert.deepEqual(plain(p.events()), [{ type: 'solve', realm: sid, qid: first.id, dust: 10 }, { type: 'star', realm: sid, qid: first.id, dust: 5 }]);
    assert.equal(p.seen.toasts.length, 1, 'one toast for the solve');
    assert.equal(p.collection.dust(), 15); assert.equal(p.collection.earned(), 15);
    assert.match(p.el('.feedback')._html, /\+1 skill point · \+15 stardust</, 'the pay-off names the stardust');
    assert.equal(p.qa.getState().xp, first.xp, 'XP is the mission\'s XP'); assert.equal(p.qa.getState().points, 1);
    assert.deepEqual(plain(stored(p).meta.paid), { [sid]: { solved: [first.id], clean: [first.id], chapters: [] } });
    const chipsAfterSolve = p.seen.chips; p.clear();
    open(p, first.id); assert.match(right(p), /Practice complete/);
    assert.deepEqual(p.events(), [], 'a replay pays nothing'); assert.equal(p.collection.dust(), 15);
    assert.deepEqual(plain(p.collection.settle()), [], 'settling again pays nothing');
    const again = page(p.storage);
    assert.deepEqual(again.events(), [], 'a reload pays nothing'); assert.equal(again.collection.dust(), 15);
    assert.equal(again.qa.getState().xp, first.xp);
    assert.ok(chipsAfterSolve >= 2, 'the chip is redrawn after a solve');
  });

  test('a solve with help pays 10 and no star', () => {
    const p = page(); open(p, first.id); p.el('#hint-btn').onclick(); right(p);
    assert.deepEqual(types(p.events()), ['solve:10']); assert.equal(p.collection.dust(), 10);
    assert.deepEqual(plain(p.qa.getState().clean), []);
  });

  test('achievements are paid with the solve, and XP is the same with or without them', () => {
    const p = page(new Map(), { achievements: real }); open(p, first.id); right(p);
    const events = p.events();
    assert.deepEqual(types(events.filter(e => e.type !== 'achievement')), ['solve:10', 'star:5']);
    assert.deepEqual(events.filter(e => e.type === 'achievement').map(e => e.id), ['solve-1', 'star-1']);
    assert.equal(p.collection.dust(), events.reduce((n, e) => n + e.dust, 0));
    assert.equal(p.qa.getState().xp, first.xp); assert.equal(p.qa.getState().points, 1);
  });

  test('a 2.0 save with past solves is paid on its first load, once, and is otherwise unchanged', () => {
    const slice = { solved: chapterOne, xp: xpOf(chapterOne), points: chapterOne.length, tools: [], clean: [chapterOne[0], chapterOne[2]], revealed: [], landmarks: [], contracts: [], reviews: {}, errors: {}, rolls: {} };
    const storage = save(slice), before = JSON.parse(storage.get(KEY));
    assert.equal(before.meta, undefined, 'a 2.0 save has no collection');
    const p = page(storage), events = p.events();
    assert.equal(p.seen.toasts.length, 1, 'one summary for all past work');
    assert.deepEqual(types(events), [...chapterOne.flatMap((id, i) => i === 0 || i === 2 ? ['solve:10', 'star:5'] : ['solve:10']), 'chapter:25']);
    assert.equal(events[events.length - 1].name, chapters[0].name);
    const total = 10 * chapterOne.length + 2 * 5 + 25;
    assert.equal(p.collection.dust(), total); assert.equal(p.collection.earned(), total);
    const after = stored(p);
    assert.deepEqual(after.realms, before.realms, 'the realm progress is exactly as it was'); assert.equal(after.seed, before.seed);
    assert.equal(p.qa.getState().xp, xpOf(chapterOne)); assert.equal(p.qa.getState().points, chapterOne.length);
    const again = page(storage);
    assert.deepEqual(again.events(), [], 'the second load pays nothing'); assert.equal(again.collection.dust(), total);
    /* The star map (no realm on the page) has nothing left to pay either. */
    assert.deepEqual(plain(again.collection.settle({ id: 'other', chapters: [] })), []);
  });

  if (realm === 'la') test('a 1.4.1 save is paid on its first load, once', () => {
    const storage = new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01', 'q02'], tools: [], clean: ['q01'], seed: 777 })]]);
    const p = page(storage);
    assert.deepEqual(types(p.events()), ['solve:10', 'star:5', 'solve:10']); assert.equal(p.collection.dust(), 25);
    assert.equal(p.qa.getState().seed, 777, 'the save keeps its numbers');
    assert.deepEqual(page(storage).events(), []);
    assert.ok(storage.get('vector-guild-save-v1').includes('"seed":777'), 'the 1.x entry is never rewritten');
  });

  test('past work is paid at the base rates on load, whatever figure is equipped (perks count only for a solve made now)', () => {
    /* The Android order for a 2.0 player: the star map pays the solves, a figure is found and equipped there,
       then the realm opens and its finished chapter is still unpaid. It pays 25, not 40. */
    const slice = { solved: chapterOne, tools: [], clean: [chapterOne[0]] };
    const paidOnMap = { [sid]: { solved: chapterOne, clean: [chapterOne[0]], chapters: [] } };
    const p = page(save(slice, meta('fx-xp', { paid: paidOnMap })));
    assert.equal(p.collection.perk(), 'chapter'); assert.deepEqual(types(p.events()), ['chapter:25']);
    /* Nothing paid yet at all (a backup restored on a device where a figure is already equipped). */
    assert.deepEqual(types(page(save(slice, meta('fx-xp'))).events()), [...chapterOne.flatMap((id, i) => i === 0 ? ['solve:10', 'star:5'] : ['solve:10']), 'chapter:25']);
    assert.deepEqual(types(page(save(slice, meta('fx-dust'))).events()), [...chapterOne.flatMap((id, i) => i === 0 ? ['solve:10', 'star:5'] : ['solve:10']), 'chapter:25']);
  });

  test('finishing a chapter pays 25 with the last solve; the legacy "xp" perk is the chapter perk (+15) and changes no XP', () => {
    const last = chapterOne[chapterOne.length - 1], rest = chapterOne.slice(0, -1);
    for (const [equipped, bonus] of [[null, 0], ['fx-xp', 15]]) {
      const p = page(save({ solved: rest, tools: [] }, meta(equipped)));
      assert.equal(p.collection.perk(), equipped ? 'chapter' : null);
      assert.equal(p.collection.dust(), 10 * rest.length); p.clear();
      open(p, last); assert.match(right(p), /Mission complete.*Chapter 1 complete/);
      assert.deepEqual(types(p.events()), ['solve:10', 'star:5', 'chapter:' + (25 + bonus)]);
      assert.equal(p.qa.getState().xp, xpOf(chapterOne), 'XP is the sum of the missions\' XP'); assert.equal(p.qa.getState().points, chapterOne.length);
      p.clear(); assert.deepEqual(page(p.storage).events(), [], 'the chapter is not paid again');
    }
  });

  test('the stardust perk adds 10% (rounded up) to mission stardust and nothing to XP', () => {
    const p = page(save(null, meta('fx-dust'))); open(p, first.id); right(p);
    assert.deepEqual(types(p.events()), ['solve:11', 'star:6']);
    assert.equal(p.qa.getState().xp, first.xp); assert.equal(p.qa.getState().points, 1);
  });

  test('a review drill passed on its first check pays once; a miss pays nothing; drills give no XP', () => {
    const solved = chapterOne.slice(0, 3);
    for (const [equipped, pay] of [[null, 2], ['fx-drill', 4]]) {
      const p = page(save({ solved, tools: [] }, meta(equipped))), xp = p.qa.getState().xp, base = p.collection.dust();
      assert.equal(base, 30); p.clear();
      p.qa.review(); p.el('#review-answer').value = String(p.qa.variant().target + 50); p.el('#review-check').onclick();
      assert.match(p.el('#review-feedback').textContent, /^Not quite/); assert.doesNotMatch(p.el('#review-feedback').textContent, /stardust/);
      assert.deepEqual(p.events(), [], 'a missed drill pays nothing'); assert.equal(p.collection.state().drills, 0);
      p.qa.review(); p.el('#review-answer').value = String(p.qa.variant().target); p.el('#review-check').onclick();
      assert.match(p.el('#review-feedback').textContent, new RegExp('^Correct.* \\+' + pay + ' stardust\\.$'));
      assert.deepEqual(types(p.events()), ['drill:' + pay]);
      p.el('#review-check').onclick();
      assert.deepEqual(types(p.events()), ['drill:' + pay], 'checking the same drill again pays nothing');
      assert.equal(p.collection.state().drills, 1); assert.equal(p.collection.dust(), base + pay);
      assert.equal(p.qa.getState().xp, xp, 'drills pay no XP');
      /* A drill that was missed first and then answered correctly is still a miss. */
      p.clear(); p.qa.review(); p.el('#review-answer').value = String(p.qa.variant().target + 50); p.el('#review-check').onclick();
      p.el('#review-answer').value = String(p.qa.variant().target); p.el('#review-check').onclick();
      assert.deepEqual(p.events(), []); assert.equal(p.collection.state().drills, 1);
    }
  });

  test('a bought landmark is settled and costs only its skill points', () => {
    const p = page(save({ solved: chapterOne, tools: [] }), { achievements: real }), button = { dataset: { landmark: '0' } };
    assert.ok(chapterOne.length >= REALM.landmarkCost, 'chapter one pays for its landmark');
    p.clear(); p.el('#content').querySelectorAll = sel => sel === '.build-landmark' ? [button] : [];
    p.qa.render(); const dust = p.collection.dust(), xp = p.qa.getState().xp; button.onclick();
    assert.deepEqual(plain(p.qa.getState().landmarks), [0]); assert.equal(p.qa.getState().points, chapterOne.length - REALM.landmarkCost);
    assert.deepEqual(p.events().map(e => e.id), ['landmark-1'], 'the landmark achievement is paid at once');
    assert.equal(p.collection.dust(), dust + p.events()[0].dust); assert.equal(p.qa.getState().xp, xp);
    p.clear(); button.onclick(); assert.deepEqual(p.events(), [], 'and only once');
  });

  test('second look keeps the first-try star for one wrong first check, exactly once per mission, and says so', () => {
    const p = page(save(null, meta('fx-look')));
    assert.equal(p.collection.perk(), 'secondlook');
    open(p, first.id);
    assert.match(p.stage._html, /Second look is ready: one wrong first check will not cost the ★\./);
    const said = wrong(p);
    assert.match(said, /^Good start\./, 'the usual feedback is still shown');
    assert.match(said, /Second look used: this miss does not cost your first-try star\. It works once in each mission\.$/);
    assert.deepEqual(plain(p.collection.state().looks), { [sid]: [first.id] }, 'the use is saved');
    assert.equal(p.qa.getState().errors[first.id].n, 1, 'the miss is still logged in the notebook');
    assert.equal(p.qa.getState().xp, 0); assert.deepEqual(plain(p.qa.getState().solved), [], 'a wrong answer is still wrong');
    assert.match(right(p), /Mission complete.*★ First-try solve/);
    assert.deepEqual(plain(p.qa.getState().clean), [first.id], 'the star is kept');
    assert.deepEqual(types(p.events()), ['solve:10', 'star:5']);
    assert.equal(p.qa.getState().xp, first.xp, 'XP is the same as without the perk');
    /* The next mission: the first wrong check is covered, the second is not. */
    open(p, second.id);
    assert.match(wrong(p), /Second look used/); assert.doesNotMatch(wrong(p), /Second look/);
    assert.match(right(p), /Mission complete/);
    assert.deepEqual(plain(p.qa.getState().clean), [first.id], 'two wrong checks cost the star');
    assert.deepEqual(plain(p.collection.state().looks), { [sid]: [first.id, second.id] });
  });

  test('second look is not given twice for a mission: not after reopening it, and not after a reload', () => {
    const p = page(save(null, meta('fx-look')));
    open(p, first.id); assert.match(wrong(p), /Second look used/);
    open(p, first.id);
    assert.doesNotMatch(p.stage._html, /Second look is ready/);
    assert.doesNotMatch(wrong(p), /Second look/);
    const later = page(p.storage); open(later, first.id);
    assert.doesNotMatch(later.stage._html, /Second look is ready/);
    assert.doesNotMatch(wrong(later), /Second look/);
    right(later);
    assert.deepEqual(plain(later.qa.getState().clean), [], 'the second wrong first check costs the star');
    assert.deepEqual(types(later.events()), ['solve:10']);
    assert.deepEqual(plain(later.collection.state().looks), { [sid]: [first.id] });
  });

  test('second look is only spent where a star is at stake', () => {
    /* Help was used first: the star is already gone. */
    const helped = page(save(null, meta('fx-look'))); open(helped, first.id); helped.el('#hint-btn').onclick();
    assert.doesNotMatch(wrong(helped), /Second look/); assert.deepEqual(plain(helped.collection.state().looks), {});
    /* The solution was revealed: the attempt is practice. */
    const revealed = page(save(null, meta('fx-look'))); open(revealed, first.id); revealed.el('#solution-btn').onclick();
    assert.doesNotMatch(wrong(revealed), /Second look/); assert.deepEqual(plain(revealed.collection.state().looks), {});
    /* The mission is already solved: practice mode. */
    const practice = page(save({ solved: [first.id], tools: [] }, meta('fx-look'))); open(practice, first.id);
    assert.doesNotMatch(practice.stage._html, /Second look is ready/);
    assert.doesNotMatch(wrong(practice), /Second look/); assert.deepEqual(plain(practice.collection.state().looks), {});
    /* Another perk, or no figure: a wrong first check costs the star as it always did. */
    for (const equipped of ['fx-dust', null]) {
      const p = page(save(null, meta(equipped))); open(p, first.id);
      assert.doesNotMatch(p.stage._html, /Second look/); assert.doesNotMatch(wrong(p), /Second look/); right(p);
      assert.deepEqual(plain(p.qa.getState().clean), []); assert.deepEqual(plain(p.collection.state().looks), {});
    }
  });

  test('the same play gives the same XP, skill points, stars and solved list with every perk and with no collection', () => {
    function play(pageOptions) {
      const p = pageOptions.bare ? H.boot(pageOptions.storage, { VGCollection: null }) : page(pageOptions.storage);
      open(p, first.id); right(p);                       // first try
      open(p, second.id); p.el('#hint-btn').onclick(); right(p); // with a hint
      const s = p.qa.getState();
      return plain({ solved: s.solved, xp: s.xp, points: s.points, clean: s.clean, slice: stored(p).realms[sid] });
    }
    const bare = play({ bare: true, storage: save(null) });
    assert.equal(bare.xp, first.xp + second.xp); assert.deepEqual(bare.clean, [first.id]);
    for (const equipped of [null, 'fx-look', 'fx-dust', 'fx-xp', 'fx-drill']) assert.deepEqual(play({ storage: save(null, meta(equipped)) }), bare, `equipped ${equipped}`);
  });

  test('a page without the collection scripts plays as before and writes no collection', () => {
    const p = H.boot(new Map(), { VGCollection: null });
    open(p, first.id); assert.match(right(p), /Mission complete/);
    assert.equal(p.qa.getState().xp, first.xp); assert.doesNotMatch(p.el('.feedback')._html, /stardust/);
    assert.equal(stored(p).meta, undefined); assert.notEqual(p.el('#collection-chip').hidden, false, 'the chip stays hidden');
    p.qa.review(first.id); p.el('#review-answer').value = String(p.qa.variant().target); p.el('#review-check').onclick();
    assert.match(p.el('#review-feedback').textContent, /^Correct/); assert.doesNotMatch(p.el('#review-feedback').textContent, /stardust/);
  });

  test('without collection/ui.js the chip shows the stardust count and awards are still paid', () => {
    const p = page(new Map(), { ui: false }); open(p, first.id); right(p);
    assert.equal(p.collection.dust(), 15); assert.equal(p.el('#collection-chip').hidden, false);
    assert.match(p.el('#collection-chip').innerHTML, /<b>15<\/b><span class="collection-chip-word"> stardust<\/span>/);
    assert.equal(p.el('#collection-chip').disabled, true, 'with nothing to open, the chip is not a live button');
  });

  test('a device that cannot store the collection pays nothing and breaks nothing', () => {
    const p = page(); p.store.putMeta = () => false;
    open(p, first.id); assert.match(right(p), /Mission complete/);
    assert.deepEqual(p.events(), []); assert.equal(p.qa.getState().xp, first.xp); assert.doesNotMatch(p.el('.feedback')._html, /stardust/);
    const broken = page(); broken.window.VGCollection = { settle() { throw Error('boom'); }, onDrillDone() { throw Error('boom'); }, useSecondLook() { throw Error('boom'); }, secondLookAvailable() { throw Error('boom'); }, dust() { throw Error('boom'); } };
    open(broken, first.id); wrong(broken); assert.match(right(broken), /Mission complete/, 'a failing collection never blocks a solve');
    assert.equal(broken.qa.getState().xp, first.xp);
  });
}

for (const realm of ['la', 'found']) suite(realm);

/* Wiring that only the files can show. */
const app = fs.readFileSync(path.resolve(__dirname, '../game/app.js'), 'utf8');
assert.equal((app.match(/window\.VGCollection\b(?!UI)/g) || []).length, 1, 'app.js reaches the core through one guarded lookup');
assert.equal((app.match(/window\.VGCollectionUI\b/g) || []).length, 1, 'and the interface through one guarded lookup');
assert.doesNotMatch(app.replace(/const coll=.*\n/, ''), /\bVGCollection(UI)?\./, 'no unguarded call');
assert.match(app, /wrong\+\+;.*const kept=wrong===1&&!assisted&&!solved\(q\)&&useLook\(\);if\(!kept\)assisted=true;/, 'second look sits where a wrong check sets "assisted"');
assert.equal((app.match(/state\.xp\s*[-+]?=/g) || []).length, 1, 'XP is changed in one place only: the first solve');
assert.match(app, /state\.xp\+=Number\(q\.xp\)\|\|0;/);
/* Perks are asked for in one place only: the settle that follows a first solve. Load, import, reset and a landmark are plain. */
assert.equal((app.match(/settleDust\(true\)/g) || []).length, 1, 'one settle with perks');
assert.match(app, /function award\(\)\{[^\n]*?state\.solved\.push\(q\.id\);[^\n]*?save\(\);const stardust=dustIn\(settleDust\(true\)\);/, 'and it is the one in award(), after the save');
assert.match(app, /settle\(undefined,\{perks:perks===true\}\)/, 'settleDust passes the perk switch to the core');
assert.equal((app.match(/settleDust\(\)/g) || []).length, 5, 'load, import (two ways out), reset and landmark settle without perks');
/* After an import or a reset the settings dialog closes first, so the stardust message is not left inside a closed dialog. */
assert.match(app, /dialog\.close\(\);settleDust\(\)\}\}catch\(err\)/, 'import: close, then settle');
assert.match(app, /store\.reset\(realmId\);state=fresh\(\);save\(\);render\(\);dialog\.close\(\);settleDust\(\)/, 'reset: close, then settle');
assert.doesNotMatch(app, /settleDust\(\);dialog\.close\(\)/, 'never settle just before closing the dialog');
/* The chip carries a visible word on wide screens and a spoken name. */
assert.match(app, /collUI\(\)\.chip\(el,\{label:'Stardust',name:'Collection'\}\)/, 'the realm chip is labelled');
const css = fs.readFileSync(path.resolve(__dirname, '../game/update.css'), 'utf8');
assert.match(css, /\.collection-chip\{[^}]*min-height:44px;min-width:44px/, 'the chip is a 44 px target');
assert.match(css, /\.collection-chip\[hidden\]\{display:none\}/, 'and stays hidden until it is drawn');
console.log(`realm collection: ${checks} checks passed for linear algebra and Foundations, plus wiring.`);
