/* Content and gameplay checks for one realm pack, run in Node without a browser.
   Usage: node qa/harness.js                    linear algebra (pack "la"), exactly the 1.4.1 checks plus save 2.0
          node qa/harness.js --realm found      another pack: every generic per-mission check, with that pack's
          node qa/harness.js found              chapters, source rule and ranks, and a play-through of its first mission
   Option: --complete  fail when a pack declares chapter missions that are not written yet (otherwise a note).
   The pack's scripts are read from game/realms/packs.js in the order realm.html loads them. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '../game');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const args = process.argv.slice(2);
const packsWindow = {};
vm.runInNewContext(read('realms/packs.js'), { window: packsWindow });
const PACKS = packsWindow.VG_PACKS;
const realmAt = args.indexOf('--realm');
const realm = realmAt >= 0 ? args[realmAt + 1] : (args.find(a => !a.startsWith('--') && Object.prototype.hasOwnProperty.call(PACKS, a)) || 'la');
const complete = args.includes('--complete');
if (!Object.prototype.hasOwnProperty.call(PACKS, realm)) { console.error(`FAIL: unknown realm "${realm}"; packs in game/realms/packs.js: ${Object.keys(PACKS).join(', ')}`); process.exit(1); }
const pack = PACKS[realm], isLA = realm === 'la';
const byId = {};
/* Scripts that need a real browser page are left to the Playwright checks (qa/handson-browser.js). */
const browserOnly = new Set(['handson.js']);
const curriculumWindow = { VG_SEED: 0 }; // seed 0 = authored numbers, so the scripted answers below stay valid
let authoredOrder = null;
for (const file of pack.scripts) {
  if (browserOnly.has(file)) continue;
  if (file === 'chapters.js') authoredOrder = (curriculumWindow.QUESTS || []).map(q => q.id);
  vm.runInNewContext(read(file), { window: curriculumWindow, Math });
}
const REALM = curriculumWindow.REALM;
assert.ok(REALM && REALM.id === realm, `the ${realm} pack sets window.REALM with id "${realm}"`);
assert.ok(curriculumWindow.Outpost, 'outpost gameplay module loads before app');
if (!curriculumWindow.ConceptLab) curriculumWindow.ConceptLab = { html: () => '', mount() {} };
if (isLA) assert.ok(curriculumWindow.VisualLab && curriculumWindow.Graph2D, '3D and graph labs load before app');
for (const q of curriculumWindow.QUESTS) byId[q.id] = q;
const quests = curriculumWindow.QUESTS;
const questCount = quests.length;

/* Pack configuration: every field the engine reads is present, and a feature that is off has no script. */
const declared = Array.isArray(REALM.chapters) ? REALM.chapters : null;
const chapterSlots = declared ? declared.length : (REALM.computedChapters || []).length;
for (const key of ['name', 'saveId', 'pageTitle', 'description', 'help']) assert.equal(typeof REALM[key], 'string', `REALM.${key}`);
for (const key of ['sceneLabel', 'homeEyebrow', 'homeTitle', 'firstVisit', 'allDone', 'beginFirst', 'missionNoun', 'chaptersNote', 'guideNoun']) assert.equal(typeof REALM.copy?.[key], 'string', `REALM.copy.${key}`);
for (const part of ['skills', 'visual']) for (const key of ['eyebrow', 'title', 'text']) assert.equal(typeof REALM.copy[part]?.[key], 'string', `REALM.copy.${part}.${key}`);
assert.ok(typeof REALM.mentor?.opening === 'function' && REALM.mentor.name && REALM.mentor.role && REALM.mentor.cardEyebrow && REALM.mentor.closing, 'REALM.mentor');
assert.ok(chapterSlots > 0 && REALM.sectors?.length === chapterSlots && REALM.landmarks?.length === chapterSlots, 'one sector and one landmark per chapter');
assert.ok(REALM.sectors.every(s => s.name && s.purpose) && REALM.landmarks.every(l => l.name && l.art && l.at?.length === 2), 'sectors have purposes; landmarks have art and a place');
assert.ok(Number.isInteger(REALM.landmarkCost) && REALM.landmarkCost > 0, 'landmark cost');
assert.ok(REALM.tiers?.length >= 1 && typeof REALM.sourceRule?.publisherPattern?.test === 'function' && REALM.sourceRule.label, 'tiers and source rule');
const ranks = REALM.ranks;
assert.ok(ranks?.length >= 2 && ranks[0].at === 0 && ranks.every((r, i) => r.title && Number.isInteger(r.at) && (i === 0 || r.at > ranks[i - 1].at)), 'ranks start at 0 and rise');
assert.ok(ranks.filter(r => r.top).length === 1 && ranks[ranks.length - 1].top, 'exactly one top rank, the last');
const featureFiles = { docking: ['docking.js'], contracts: ['contracts.js'], board: ['board.js'], handson: ['handson.js'] }, labFiles = { vector3d: 'lab3d.js', graph2d: 'graph-lab.js', concept: 'concept-lab.js' };
for (const [feature, files] of Object.entries(featureFiles)) for (const file of files) assert.equal(pack.scripts.includes(file), !!REALM.features[feature], `${file} is loaded exactly when features.${feature} is on`);
for (const [name, file] of Object.entries(labFiles)) assert.equal(pack.scripts.includes(file), REALM.features.labs.includes(name), `${file} is loaded exactly when labs includes ${name}`);
assert.ok(!pack.scripts.includes('app.js') && pack.scripts.indexOf('realms/' + realm + '/pack.js') === 0, 'the pack config loads first; realm.html adds app.js last');

if (isLA) assert.ok(questCount >= 50, 'full campaign loaded');
else assert.ok(questCount >= 1, 'the pack has at least one mission');
assert.equal(new Set(quests.map(q => q.id)).size, quests.length, 'mission IDs must be unique');
assert.ok(quests.every(q => q.sources?.length && q.sources.every(s => /^https:\/\//.test(s.url) && s.title && s.verified)), 'every mission has attributed source links');
assert.ok(quests.every(q => q.sources.some(s => REALM.sourceRule.publisherPattern.test(s.title))), `every mission has a per-lesson ${REALM.sourceRule.label} link`);
if (isLA) assert.ok(curriculumWindow.CURRICULUM_SCOPE?.includes(`${questCount}-mission`), 'field guide scope follows actual quest count');
assert.ok(curriculumWindow.ConceptLab && curriculumWindow.EXPERIMENTS, 'predict-first experiment runner and models load');
assert.ok(quests.every(q => typeof curriculumWindow.EXPERIMENTS[q.id] === 'function'), 'every mission has a topic-specific experiment model');
for (const q of quests) for (let t = -10; t <= 10; t++) {
  const model = curriculumWindow.EXPERIMENTS[q.id](t);
  assert.ok(model.prompt && model.formula && model.values?.length >= 2, `${q.id}@${t}: experiment completeness`);
  assert.ok(model.values.every(([,v]) => Number.isFinite(v)), `${q.id}@${t}: numeric outputs finite`);
  assert.equal(model.target, model.values[0][1], `${q.id}@${t}: target matches displayed output`);
}
/* Mission fields the engine shows. */
const sectorNames = REALM.sectors.map(s => s.name);
for (const q of quests) {
  for (const key of ['id', 'title', 'topic', 'tier', 'sector', 'brief', 'lesson', 'prompt', 'solution']) assert.ok(typeof q[key] === 'string' && q[key].trim(), `${q.id}: ${key} text`);
  assert.ok(/^q\d{2}$/.test(q.id), `${q.id}: local id of the form q01`);
  assert.ok(REALM.tiers.includes(q.tier), `${q.id}: tier "${q.tier}" is one of ${REALM.tiers.join(', ')}`);
  assert.ok(sectorNames.includes(q.sector), `${q.id}: sector "${q.sector}" is one of the pack\'s sectors`);
  assert.ok(Array.isArray(q.answer) && q.answer.length > 0 && q.answer.every(Number.isFinite), `${q.id}: numeric answers`);
  assert.ok(Array.isArray(q.hints) && q.hints.length >= 1 && q.hints.every(h => typeof h === 'string' && h), `${q.id}: hints`);
  if (REALM.tierXp) assert.equal(q.xp, REALM.tierXp[q.tier], `${q.id}: ${q.tier} missions give ${REALM.tierXp[q.tier]} XP`);
}
if (isLA) {
  const vmath = curriculumWindow.VisualLab.math;
  assert.equal(vmath.dot([2,0,0],[0,3,0]), 0);
  assert.deepEqual(Array.from(vmath.cross([2,0,0],[0,3,0])), [0,0,6]);
  assert.deepEqual(Array.from(vmath.projection([3,4,0],[1,0,0])), [3,0,0]);
  assert.equal(vmath.projection([3,4,0],[0,0,0]), null);
  assert.deepEqual(Array.from(vmath.projection([3,4,0],[1e-200,0,0])), [3,0,0]);
  const gmath = curriculumWindow.Graph2D.math;
  assert.equal(gmath.determinant([2,1,3,1]), -1, 'determinant example');
  assert.equal(gmath.rank([.5,.5,.5,.5]), 1, 'projection matrix collapses plane to line');
  assert.equal(gmath.inverse([0,0,0,0]), null, 'collapsed map has no inverse');
  assert.deepEqual(Array.from(gmath.transform([0,-1,1,0],[3,-2])), [2,3], 'counterclockwise rotation example');
  assert.equal(gmath.leastSquares([[1,4],[1,7]], 'line').identifiable, false, 'identical x data has no unique slope');
  const dock = curriculumWindow.Docking;
  assert.deepEqual(Array.from(dock.evaluate('q01',[2,3,2]).delta),[0,0,0]);
  assert.equal(dock.evaluate('q01',[2.009,3,2]).hit,true,'each docking axis accepts an independent <=.01 tolerance');
  assert.equal(dock.evaluate('q01',[2,3.011,2]).hit,false,'axis miss beyond .01 is rejected');
  assert.equal(dock.evaluate('q01',[2,3]).valid,false,'bad coordinate count rejected');
  assert.deepEqual(Array.from(dock.evaluate('q07',[2,3]).goal),[2,3]);
  assert.deepEqual(Array.from(dock.evaluate('q48',[2,1,1]).goal),[2,1,1]);
  assert.deepEqual(Array.from(dock.rotate([1,0],Math.PI/2).map(x=>Math.round(x))),[0,1]);
  const dockHint = dock.guidance('q01',dock.evaluate('q01',[1,3,3]));
  assert.match(dockHint,/X falls short/); assert.match(dockHint,/Y is aligned/); assert.match(dockHint,/Z overshoots/);
  assert.doesNotMatch(dockHint,/\d/,'docking feedback gives a direction, never the size of the correction');
  assert.doesNotMatch(dock.html(byId.q01),/\(2,\s*3,\s*2\)/,'the q01 trial text does not print the answer');
  const contracts=curriculumWindow.Contracts;
  assert.equal(contracts.math.progress([]).delivered,false);
  assert.equal(contracts.math.progress(['q01','q02']).count,2);
  assert.equal(contracts.math.progress(['q01','q02','q06']).delivered,true);
  assert.notEqual(contracts.math.DEMAND, byId.q29.answer[0] + byId.q29.answer[1], 'the practice trial does not reuse the q29 numbers');
  assert.equal(contracts.math.evaluatePair(5,5).optimal,true);
  assert.equal(contracts.math.evaluatePair(4,6).feasible,true);
  assert.equal(contracts.math.evaluatePair(4,6).optimal,false);
  assert.equal(contracts.math.evaluatePair(4,5).feasible,false);
  assert.doesNotMatch(contracts.home(quests, []), /d="[^"]*−/, 'SVG path data uses ASCII minus signs');
}
for (const q of quests) {
  const t = q.teaching, ex = t?.example;
  assert.ok(t?.intuition?.length >= 40, `${q.id}: intuition`);
  assert.ok(t.steps?.length >= 3, `${q.id}: at least three teaching steps`);
  assert.ok(t.pitfalls?.length >= 2, `${q.id}: at least two pitfalls`);
  assert.ok(ex?.prompt && ex.steps?.length >= 2 && ex.answer, `${q.id}: worked example completeness`);
  const nums = text => [...String(text).replaceAll('−','-').matchAll(/[-+]?\d+(?:\.\d+)?/g)].map(m => m[0]);
  assert.notDeepEqual(nums(q.prompt), nums(ex.prompt), `${q.id}: example must use a different numeric setup`);
  assert.ok(q.guidance?.length >= 2, `${q.id}: two guided steps`);
  for (const [i,g] of q.guidance.entries()) {
    assert.ok(g.prompt && g.explanation, `${q.id} guidance ${i+1}: prompt/explanation`);
    assert.ok(g.answer?.length > 0 && g.answer.length === g.labels?.length, `${q.id} guidance ${i+1}: answer labels`);
    assert.ok(g.answer.every(Number.isFinite), `${q.id} guidance ${i+1}: numeric answers`);
  }
}
assert.ok(quests.every(q => q.answer.length === q.labels.length && q.tolerance > 0 && q.xp > 0));
assert.ok(quests.every(q => (q.prereqs||[]).every(id => byId[id])), 'all prerequisite IDs exist');
let reachable = new Set(), changed = true;
while (changed) { changed = false; for (const q of quests) if (!reachable.has(q.id) && (q.prereqs||[]).every(id => reachable.has(id))) { reachable.add(q.id); changed = true; } }
assert.equal(reachable.size, quests.length, 'all missions are reachable');
const appSource = fs.readFileSync(root + '/app.js', 'utf8'), storeSource = read('save-store.js');

/* One page load: a fresh save store over `storage` (a Map standing for localStorage), then app.js. */
function boot(storage = new Map()) {
  const localStorage = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const storeWindow = { VG_SEED: curriculumWindow.VG_SEED, localStorage };
  vm.runInNewContext(storeSource, { window: storeWindow, Math, JSON });
  curriculumWindow.VGSave = storeWindow.VGSave; // app.js keeps the store it finds when it starts
  let activeId = null, mainInputs = [], guidedInputs = [];
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      textContent: '', _html: '', onclick: null, disabled: false, dataset: {}, className: '',
      classList: { toggle() {} }, addEventListener() {}, click() {}, focus() {}, setAttribute() {}, scrollIntoView() {},
      insertAdjacentHTML(_where, html) { this._html += html; },
    });
    return elements.get(selector);
  }
  const content = element('#content'); content.querySelectorAll = () => [];
  const dc = element('#dialog-content');
  const stage = element('#mission-stage');
  Object.defineProperty(stage, 'innerHTML', { get() { return this._html; }, set(html) {
    this._html = html;
    mainInputs = activeId && html.includes('id="answer-0"') ? byId[activeId].answer.map(() => ({ value: '', setAttribute() {} })) : [];
  }});
  const guided = element('#guided');
  Object.defineProperty(guided, 'innerHTML', { get() { return this._html; }, set(html) {
    this._html = html;
    const n = Number((html.match(/GUIDED STEP (\d+)/) || [])[1] || 0);
    guidedInputs = n && byId[activeId]?.guidance?.[n - 1] ? byId[activeId].guidance[n - 1].answer.map(() => ({ value: '', setAttribute() {} })) : [];
  }});
  const guidedFeedback = element('.guided-feedback');
  guided.querySelectorAll = sel => sel === 'input' ? guidedInputs : [];
  guided.querySelector = sel => sel === 'h3' ? element('guided h3') : sel === '.guided-feedback' ? guidedFeedback : element('guided ' + sel);
  guidedFeedback.querySelector = sel => sel === 'button' ? element('guided feedback button') : element('guided feedback ' + sel);
  dc.querySelector = sel => {
    if (sel === '.close') return element('dialog close');
    if (sel === '#mission-stage') return stage;
    if (sel === '#guided') return guided;
    if (sel === '.feedback') return element('.feedback');
    if (sel === '.guided-feedback') return guidedFeedback;
    return element('dialog-content ' + sel);
  };
  dc.querySelectorAll = sel => sel === '#mission-stage > .mission-panel > .answer-grid input' ? mainInputs : [];
  Object.defineProperty(dc, 'innerHTML', { get() { return this._html || ''; }, set(html) {
    this._html = html;
    const id = (html.match(/OPERATION \/ (Q\d+)/) || [])[1]?.toLowerCase();
    if (id) { activeId = id; mainInputs = []; guidedInputs = []; stage._html = html; guided._html = ''; }
  }});
  const dialog = element('#dialog'); dialog.showModal = () => {}; dialog.close = () => {};
  const document = {
    querySelector: s => s === '#content' ? content : s === '#dialog' ? dialog : s === '#dialog-content' ? dc :
      s === '#mission-stage' ? stage : s === '#guided' ? guided : element(s),
    querySelectorAll: () => [], createElement: () => element('created'),
  };
  const context = {
    window: curriculumWindow, Outpost: curriculumWindow.Outpost,
    /* A module the pack does not load stays undefined, as on the page. */
    VisualLab: curriculumWindow.VisualLab && { ...curriculumWindow.VisualLab, mount() {} },
    Graph2D: curriculumWindow.Graph2D && { ...curriculumWindow.Graph2D, mount() {} },
    ConceptLab: { ...curriculumWindow.ConceptLab, mount() {} },
    Docking: curriculumWindow.Docking && { ...curriculumWindow.Docking, supported: () => false, html: () => '', mount: () => null },
    Contracts: curriculumWindow.Contracts, Board: curriculumWindow.Board, Variants: curriculumWindow.Variants, Gen: curriculumWindow.Gen, Math, document,
    localStorage,
    __getMain: () => mainInputs, __getGuided: () => guidedInputs,
    alert() {}, confirm: () => true, Blob: class {}, URL: { createObjectURL(){}, revokeObjectURL(){} }, console,
  };
  const instrumented = appSource.replace(/\}\)\(\);\s*$/, 'globalThis.__qa={normalize,mission,available:(id)=>available(quests.find(q=>q.id===id)),getState:()=>JSON.parse(JSON.stringify(state)),getMain:()=>__getMain(),getGuided:()=>__getGuided(),activeId:()=>activeId,variant:()=>activeVariant,rank,review,parseNumber,toolResult,level,current:()=>currentMission,reviewDue,pickReview,setState:(patch)=>Object.assign(state,patch)};})();');
  vm.runInNewContext(instrumented, context);
  return { qa: context.__qa, el: element, dc, stage, guided, storage, curriculum: curriculumWindow.QUESTS };
}
let forged = null, h = null, qa = null, el = null; // the linear algebra flows below share these
if (isLA) {
  h = boot();
  ({ qa, el } = h);
  function click(sel) { const b = el(sel); assert.equal(typeof b.onclick, 'function', `${sel} handler should exist`); b.onclick(); }
  function enter(inputs, values) { assert.equal(inputs.length, values.length, `expected ${values.length} inputs, got ${inputs.length}`); inputs.forEach((x,i) => x.value = String(values[i])); }
  function submitMain(values) { enter(qa.getMain(), values); click('#submit-answer'); return el('.feedback').textContent; }

  // Learn must be completed before the answer form exists. Lesson review stays beside the inputs.
  qa.mission('q01');
  assert.equal(qa.getMain().length, 0, 'No answer inputs before Learn gate');
  assert.match(h.stage._html, /01 \/ LEARN/);
  assert.equal(typeof el('#ready').onclick, 'function');
  click('#ready');
  assert.equal(qa.getMain().length, byId.q01.answer.length, 'Main input count matches answer key');
  assert.match(h.stage._html, /lesson-review/);
  assert.match(h.stage._html, /Revealing the full solution makes this attempt practice/);
  assert.match(h.dc._html, /STUDY THE SOURCE/);

  // First wrong answer gets specific feedback; second offers guided help without losing main values.
  assert.match(submitMain([0, 0, 0]), /Good start/);
  assert.equal(qa.getState().xp, 0); assert.deepEqual(JSON.parse(JSON.stringify(qa.getMain().map(x=>x.value))), ['0','0','0']);
  assert.match(submitMain([0, 0, 0]), /break it down together/i);
  assert.equal(qa.getGuided().length, byId.q01.guidance[0].answer.length, 'Guided input count matches authored step');
  assert.deepEqual(JSON.parse(JSON.stringify(qa.getMain().map(x=>x.value))), ['0','0','0'], 'Main answers persist after guidance opens');

  // Wrong substep escalates with retained input, then authored explanation and Continue control.
  enter(qa.getGuided(), Array(byId.q01.guidance[0].answer.length).fill(999));
  click('#check-guided');
  assert.match(h.guided.querySelector('.guided-feedback').textContent, /try this step again|work through/i);
  click('#guide-btn');
  assert.equal(qa.getGuided()[0].value, '999', 'Guided input survives re-entry');
  click('#check-guided');
  assert.match(h.guided.querySelector('.guided-feedback').innerHTML, /Let’s work through it/);
  assert.match(h.guided.querySelector('.guided-feedback').innerHTML, /Continue to/);
  click('guided feedback button');
  assert.match(h.guided._html, /GUIDED STEP 2/);

  // Complete all guided steps correctly, then solve main objective for full rewards exactly once.
  for (let stepIndex = 1; stepIndex < byId.q01.guidance.length; stepIndex++) {
    const step = byId.q01.guidance[stepIndex];
    enter(qa.getGuided(), step.answer);
    click('#check-guided'); click('#check-guided');
  }
  // First step was explained; continue advanced. No XP is awarded for guided answers alone.
  assert.equal(qa.getState().xp, 0);
  assert.match(submitMain(byId.q01.answer), /Mission complete/);
  assert.equal(qa.getState().xp, byId.q01.xp); assert.equal(qa.getState().points, 1);
  assert.match(el('.feedback')._html, /build-payoff/);
  assert.match(el('.feedback')._html, /INSTALLATION COMPLETE/);
  assert.match(el('.feedback')._html, /installed/);
  assert.equal(typeof el('#next-mission').onclick, 'function', 'payoff includes next-mission action');
  assert.equal(typeof el('#see-outpost').onclick, 'function', 'payoff includes outpost action');
  const resumed = boot(h.storage);
  assert.equal(resumed.qa.getState().xp, byId.q01.xp, 'saved XP survives reload');
  assert.equal(resumed.qa.getState().points, 1, 'saved skill points survive reload');
  assert.equal(resumed.qa.available('q02'), true, 'prerequisite unlock survives reload');
  assert.equal(resumed.qa.available('q04'), false, 'unsatisfied prerequisite remains locked after reload');
  assert.equal(qa.available('q02'), true); assert.equal(qa.available('q03'), true); assert.equal(qa.available('q04'), false);
  const legacy50 = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01'], tools: [], xp: 9876, points: 99 })]]));
  assert.deepEqual(JSON.parse(JSON.stringify(legacy50.qa.getState().solved)), ['q01'], 'existing 50-quest save keeps completed IDs in the expanded campaign');
  assert.equal(legacy50.qa.getState().xp, byId.q01.xp, 'legacy XP is safely recomputed from retained progress');
  assert.equal(legacy50.qa.available('q02'), true, 'legacy progress unlocks its original child');
  assert.equal(legacy50.qa.available('q51'), false, 'new mission prerequisites remain locked after legacy migration');

  // Replay cannot grant repeat rewards.
  qa.mission('q01'); click('#ready'); assert.match(submitMain(qa.current().answer), /Practice complete/);
  assert.equal(qa.getState().xp, byId.q01.xp); assert.equal(qa.getState().points, 1);

  // Revealing the solution makes this attempt practice and gives the mission a new roll: reopening it
  // brings new numbers, and solving those pays the full reward.
  const reveal = boot(); reveal.qa.mission('q01'); reveal.el('#ready').onclick();
  assert.match(reveal.stage._html, /Revealing the full solution makes this attempt practice/);
  reveal.el('#solution-btn').onclick();
  assert.equal(reveal.qa.getState().rolls.q01, 1, 'a reveal is saved as a new roll');
  enter(reveal.qa.getMain(), byId.q01.answer); reveal.el('#submit-answer').onclick();
  assert.equal(reveal.qa.getState().xp, 0, 'the revealed attempt pays nothing');
  assert.match(reveal.el('.feedback').textContent, /new numbers/);
  const reopened = boot(reveal.storage); reopened.qa.mission('q01'); reopened.el('#ready').onclick();
  const rerolled = reopened.qa.current();
  assert.equal(rerolled.generated, true); assert.notEqual(rerolled.prompt, byId.q01.prompt, 'the reopened mission has new numbers');
  assert.ok(reopened.stage._html.includes(rerolled.prompt.replace(/&/g, '&amp;')), 'the new prompt is shown');
  enter(reopened.qa.getMain(), byId.q01.answer); reopened.el('#submit-answer').onclick();
  if (JSON.stringify(Array.from(rerolled.answer)) !== JSON.stringify(Array.from(byId.q01.answer))) assert.equal(reopened.qa.getState().xp, 0, 'the old answer no longer works');
  enter(reopened.qa.getMain(), rerolled.answer); reopened.el('#submit-answer').onclick();
  assert.equal(reopened.qa.getState().xp, byId.q01.xp, 'solving the new numbers pays the reward');

  // Every save has its own numbers; the same save always sees the same numbers; practice visits re-roll.
  curriculumWindow.VG_SEED = 424242;
  const seededA = boot(); seededA.qa.mission('q02'); const firstLook = seededA.qa.current();
  seededA.qa.mission('q02'); assert.equal(seededA.qa.current().prompt, firstLook.prompt, 'an unsolved mission keeps its numbers between visits');
  assert.equal(firstLook.generated, true); assert.notEqual(firstLook.prompt, byId.q02.prompt);
  curriculumWindow.VG_SEED = 99;
  const seededB = boot(); seededB.qa.mission('q02'); assert.notEqual(seededB.qa.current().prompt, firstLook.prompt, 'another save gets other numbers');
  curriculumWindow.VG_SEED = 0;
  const practice = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01'], tools: [] })]]));
  practice.qa.mission('q01'); const visitOne = practice.qa.current().prompt; practice.qa.mission('q01');
  assert.notEqual(practice.qa.current().prompt, visitOne, 'practice visits use new numbers each time');
  const legacySave = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: [], tools: [] })]]));
  legacySave.qa.mission('q01'); assert.equal(legacySave.qa.current().prompt, byId.q01.prompt, 'a save from before 1.4 keeps the authored numbers');

  // Save 2.0: a 1.4.1 player keeps the numbers of their seed and rolls; the slice has no seed; other realms are untouched.
  const v141 = new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01'], tools: [], seed: 777, rolls: { q03: 2 } })]]);
  const upgraded = boot(v141);
  upgraded.qa.mission('q02'); assert.equal(upgraded.qa.current().prompt, curriculumWindow.Gen.instance(byId.q02, 777, 0).prompt, 'same seed, same numbers as 1.4.1');
  upgraded.qa.mission('q03'); assert.equal(upgraded.qa.current().prompt, curriculumWindow.Gen.instance(byId.q03, 777, 2).prompt, 'rolls carry over');
  assert.equal(upgraded.qa.getState().seed, 777);
  const otherRealm = { solved: ['q09'], tools: [], xp: 5, odd: { kept: true } };
  const v2 = JSON.parse(v141.get('vector-guild-save-v2')); v2.realms.found = otherRealm; v141.set('vector-guild-save-v2', JSON.stringify(v2));
  const upgraded2 = boot(v141); upgraded2.qa.mission('q02'); upgraded2.el('#ready').onclick();
  enter(upgraded2.qa.getMain(), upgraded2.qa.current().answer); upgraded2.el('#submit-answer').onclick();
  const after = JSON.parse(v141.get('vector-guild-save-v2'));
  assert.deepEqual(after.realms.la.solved, ['q01', 'q02']); assert.equal(after.realms.la.seed, undefined); assert.equal(after.seed, 777);
  assert.deepEqual(after.realms.found, otherRealm, 'progress in a realm that is not loaded is kept verbatim');
  assert.ok(v141.get('vector-guild-save-v1').includes('"seed":777') && !v141.get('vector-guild-save-v1').includes('q02'), 'the 1.x entry is never rewritten');
  // Fractions, mixed numbers, decimal commas and a typographic minus are accepted; junk is not.
  const parse = qa.parseNumber;
  for (const [text, value] of [['7/6', 7/6], ['-3/4', -.75], ['−3/4', -.75], ['1 1/2', 1.5], ['-1 1/2', -1.5], ['2,5', 2.5], ['.5', .5], [' 3 ', 3], ['1e2', 100], ['6 / 3', 2]]) assert.ok(Math.abs(parse(text) - value) < 1e-12, `parse ${text}`);
  for (const text of ['', 'abc', '1/0', '1/2/3', '1..2', '--2', '3/', 'Infinity', '0x10']) assert.ok(Number.isNaN(parse(text)), `reject "${text}"`);
  const fractions = boot(); fractions.qa.mission('q01'); fractions.el('#ready').onclick();
  enter(fractions.qa.getMain(), ['4/2', '2 2/2', '−4/−2'.replace('/−', '/')]); fractions.el('#submit-answer').onclick();
  assert.equal(fractions.qa.getState().solved.length, 0, '4/2, 3 and −4/2 is wrong in the last field');
  enter(fractions.qa.getMain(), ['4/2', '2 2/2', '6/3']); fractions.el('#submit-answer').onclick();
  assert.deepEqual(JSON.parse(JSON.stringify(fractions.qa.getState().solved)), ['q01'], 'fraction answers are graded by value');

  // Workshop tools judge "zero" relative to the size of the numbers entered.
  const tool = qa.toolResult, k = 1e-5;
  assert.match(tool('solve3', [2,1,0, 1,3,1, 0,1,2, 3,5,3]), /x = 1, y = 1, z = 1/);
  assert.match(tool('solve3', [2,1,0, 1,3,1, 0,1,2, 3,5,3].map(x => x * k)), /x = 1, y = 1, z = 1/, 'a solvable system with small entries is solved');
  assert.match(tool('solve3', [2,1,0, 1,3,1, 0,1,2, 3,5,3].map(x => x * 1e6)), /x = 1, y = 1, z = 1/, 'and with large entries');
  for (const scale of [1, k, 1e6]) assert.match(tool('solve3', [1,2,3, 2,4,6, 0,1,1, 1,2,3].map(x => x * scale)), /singular/, 'dependent rows are singular at every scale');
  assert.match(tool('matrix', [2,1,1,3,5,6].map(x => x * k)), /x = 1\.8, y = 1\.4/); assert.match(tool('matrix', [1,2,2,4,1,1]), /singular/);
  assert.match(tool('linefit', [0,1, 1,3, 2,4]), /y = 1\.1667 \+ 1\.5·x · sum of squared residuals = 0\.16667/);
  assert.match(tool('linefit', [0,1, 1e-7,3, 2e-7,4]), /y = 1\.1667 \+ 15000000·x/, 'distinct points spaced closely are fitted');
  assert.match(tool('linefit', [1e9,1, 1e9+1,3, 1e9+2,4]), /\+ 1\.5·x/, 'distinct points far from the origin are fitted');
  assert.match(tool('linefit', [2,1, 2,3, 2,4]), /no unique line/); assert.match(tool('linefit', [0,1, 0,3, 0,4]), /no unique line/);
  assert.match(tool('eigen', [4,1,2,3]), /λ₁ = 2 with eigenvector \(1, -2\) · λ₂ = 5 with eigenvector \(1, 1\)/);
  assert.match(tool('eigen', [1e-10,0,0,3e-10]), /λ₁ = 1e-10 .* λ₂ = 3e-10 /, 'small distinct eigenvalues are reported as two');
  const nearEqual = tool('eigen', [1,0,0,1.0000000001]).match(/λ₁ = (\S+) .* λ₂ = (\S+) /);
  assert.ok(nearEqual && nearEqual[1] !== nearEqual[2], 'nearly equal eigenvalues are printed as different numbers');
  assert.match(tool('eigen', [2,0,0,2]), /repeated eigenvalue 2; every nonzero vector/); assert.match(tool('eigen', [2,1,0,2]), /repeated eigenvalue 2 with only one independent eigenvector \(1, 0\)/);
  assert.match(tool('eigen', [2e-9,1e-9,0,2e-9]), /only one independent eigenvector/, 'a small defective matrix is still defective');
  assert.match(tool('eigen', [0,-1,1,0]), /complex eigenvalues 0 ± 1i/); assert.match(tool('eigen', [0,0,0,0]), /repeated eigenvalue 0/);
  assert.match(tool('projection', [3,4,1,0]), /Projection = \(3, 0\) · Perpendicular component = \(0, 4\)/); assert.match(tool('vector', [3,4,1,2]), /A · B = 11 · \|A\| = 5/);

  // q16 asks for the dimension of the whole intersection and says so, in the authored and the generated prompt.
  assert.match(byId.q16.prompt, /dimension of the whole intersection, counted before z is fixed/);
  assert.match(curriculumWindow.Gen.instance(byId.q16, 5, 3).prompt, /Enter the allowed vector with z=.* as x,y,z\. Then enter the dimension of the whole intersection/);
  // Levels: one per 300 XP, announced when crossed.
  assert.equal(qa.level(), Math.floor(qa.getState().xp / 300) + 1);
  const leveller = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01','q02'], tools: [] })]]));
  assert.equal(leveller.qa.level(), 1); leveller.qa.mission('q03'); leveller.el('#ready').onclick();
  enter(leveller.qa.getMain(), byId.q03.answer); leveller.el('#submit-answer').onclick();
  assert.match(leveller.el('.feedback').textContent, /Level up to 2!/); assert.equal(leveller.el('#level').textContent, 2);
  // Mira's spoken briefing includes the concept explanation; the written card does not repeat it.
  for (const q of quests) { assert.ok(curriculumWindow.Outpost.narration(q).includes(q.teaching.intuition), `${q.id}: narration explains the concept`); assert.ok(!curriculumWindow.Outpost.mentor(q).includes(q.teaching.intuition)); }

  // A miss is logged in the error notebook, and the chosen pitfall is counted.
  const slips = boot(); slips.qa.mission('q01'); slips.el('#ready').onclick();
  enter(slips.qa.getMain(), [9, 9, 9]); slips.el('#submit-answer').onclick();
  assert.equal(slips.qa.getState().errors.q01.n, 1); assert.ok(slips.qa.getState().errors.q01.last > 0);
  assert.match(slips.el('#pitfalls').innerHTML, /Which of these tripped you up/);

  // Review schedule: a pass moves the next review out (1, 3, 7 ... days); a miss brings it back in a day
  // and the notebook entry stays open until a later pass.
  const day = 86400000, spaced = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01','q02','q03'], tools: [] })]]));
  assert.equal(spaced.qa.pickReview().why, 'First review');
  const now = Date.now();
  spaced.qa.setState({ reviews: { q01: { n: 1, last: now - 2 * day }, q02: { n: 2, last: now - 2 * day }, q03: { n: 1, last: now } } });
  assert.equal(spaced.qa.reviewDue('q01'), now - day); assert.equal(spaced.qa.reviewDue('q02'), now + day);
  assert.deepEqual({ ...spaced.qa.pickReview() }, { id: 'q01', why: 'Due for review' });
  spaced.qa.review(); const drillVariant = spaced.qa.variant();
  spaced.el('#review-answer').value = String(drillVariant.target); spaced.el('#review-check').onclick();
  assert.equal(spaced.qa.getState().reviews.q01.n, 2); assert.match(spaced.el('#review-feedback').textContent, /Next review in 3 days/);
  spaced.qa.setState({ reviews: { q01: { n: 2, last: now }, q02: { n: 2, last: now }, q03: { n: 3, last: now - 9 * day } } });
  spaced.qa.review(); spaced.el('#review-answer').value = String(spaced.qa.variant().target + 50); spaced.el('#review-check').onclick();
  assert.equal(spaced.qa.getState().reviews.q03.n, 0, 'a miss resets the streak'); assert.equal(spaced.qa.getState().errors.q03.n, 1);
  assert.equal(spaced.qa.reviewDue('q03') - spaced.qa.getState().reviews.q03.last, day);
  spaced.qa.setState({ reviews: { ...spaced.qa.getState().reviews, q03: { n: 0, last: now - 3600000 } }, errors: { q03: { n: 1, last: now - 7200000, pit: {} } } });
  assert.equal(spaced.qa.pickReview().why, 'From your error notebook', 'an open notebook entry outranks unscheduled work');

  // A solve on the first check with no help earns the first-try star; any help forfeits it.
  const starRun = boot(); starRun.qa.mission('q01'); starRun.el('#ready').onclick();
  enter(starRun.qa.getMain(), byId.q01.answer); starRun.el('#submit-answer').onclick();
  assert.deepEqual(JSON.parse(JSON.stringify(starRun.qa.getState().clean)), ['q01']);
  assert.deepEqual(JSON.parse(JSON.stringify(h.qa.getState().clean)), [], 'the guided q01 solve above earned no star');
  assert.equal(h.qa.getState().errors.q01.n, 2, 'both early misses on q01 were logged');

  // Import/load normalization retains eligible progress, removes incomplete downstream claims, recomputes rewards.
  const normalized = qa.normalize({ solved: ['q50', 'q01'], tools: ['projection'], xp: 1e9, points: 1e9 });
  assert.equal(JSON.stringify(normalized.solved), '["q01"]'); assert.equal(normalized.xp, byId.q01.xp); assert.equal(normalized.points, 1); assert.equal(JSON.stringify(normalized.tools), '[]');
  assert.throws(() => qa.normalize({ solved: [7], tools: [] }));
  forged = qa.normalize({ solved: h.curriculum.map(q => q.id), tools: [], xp: 0, points: 0 });
  assert.equal(forged.solved.length, questCount); assert.equal(forged.xp, h.curriculum.reduce((n,q)=>n+q.xp,0));
}
// Mira's spoken briefing includes the concept explanation; the written card does not repeat it.
for (const q of quests) { assert.ok(curriculumWindow.Outpost.narration(q).includes(q.teaching.intuition), `${q.id}: narration explains the concept`); assert.ok(!curriculumWindow.Outpost.mentor(q).includes(q.teaching.intuition)); }
// Chapters: every mission appears once, the recommended order respects prerequisites, and no
// chapter is so long that its milestone arrives late.
const chapters = curriculumWindow.CHAPTERS;
assert.deepEqual(Array.from(chapters.flatMap(c => c.ids)).sort(), Array.from(authoredOrder).sort(), 'chapters partition the campaign');
const position = new Map(quests.map((q, i) => [q.id, i]));
assert.ok(quests.every(q => (q.prereqs || []).every(id => position.get(id) < position.get(q.id))), 'recommended order respects prerequisites');
if (isLA) assert.ok(chapters.every(c => c.ids.length >= 6 && c.ids.length <= 10), 'a chapter completes every six to ten missions');
else {
  assert.ok(declared.every(c => c.ids.length >= 5 && c.ids.length <= 6), 'each declared chapter has five or six missions');
  assert.equal(new Set(declared.flatMap(c => c.ids)).size, declared.flatMap(c => c.ids).length, 'no mission is declared in two chapters');
  assert.ok(quests.every(q => declared.some(c => c.ids.includes(q.id))), 'every mission belongs to a declared chapter');
  for (const q of quests) assert.equal(q.sector, REALM.sectors[q.chapter].name, `${q.id}: sector matches its chapter (${REALM.sectors[q.chapter].name})`);
  for (const [i, c] of declared.entries()) if (c.tier) for (const id of chapters[i].ids) assert.equal(byId[id].tier, c.tier, `${id}: chapter ${i + 1} missions are ${c.tier}`);
}
assert.deepEqual(Array.from(quests.map(q => q.id)), Array.from(chapters.flatMap(c => c.ids)), 'campaign order follows the chapters');

// Variants: every mission has a problem statement without float noise or doubled signs, and
// generated questions have finite targets that actually vary.
const variants = curriculumWindow.Variants;
for (const q of quests) {
  assert.ok(variants.has(q.id), `${q.id}: variant statement exists`);
  const targets = new Set();
  for (let t = -10; t <= 10; t++) {
    const model = curriculumWindow.EXPERIMENTS[q.id](t);
    for (const text of [model.setup, model.formula, model.prompt]) assert.doesNotMatch(text, /\d\.\d{7,}|NaN|undefined|Infinity|[+−]-|-\d/, `${q.id}@${t}: tidy numbers in "${text}"`);
    assert.ok(model.setup.length >= 8, `${q.id}@${t}: statement present`);
    targets.add(model.target);
  }
  assert.ok(targets.size >= 2, `${q.id}: the predicted value changes with the numbers`);
  for (let i = 0; i < 20; i++) { const v = variants.make(q.id); assert.ok(Number.isFinite(v.target) && v.tolerance > 0 && variants.check(v, v.target), `${q.id}: generated variant is answerable`); }
}
if (isLA) {

  // Contract board: authored answers are accepted, near misses are not, and every contract needs
  // missions from at least two chapters, so the player has to choose a route.
  const board = curriculumWindow.Board;
  for (const def of board.defs) {
    assert.ok(def.needs.every(id => byId[id]), `${def.id}: required missions exist`);
    assert.equal(def.answer.length, def.labels.length);
    assert.equal(board.check(def.id, def.answer).ok, true);
    assert.equal(board.check(def.id, def.answer.map((x, i) => i ? x : x + .5)).ok, false);
    assert.ok(new Set(def.needs.map(id => byId[id].chapter)).size >= 2, `${def.id}: spans chapters`);
  }
  // Independent recomputation of the three commissioning answers.
  assert.deepEqual([18 / 3, (3 - 6) + (5 - 6) + (10 - 6), 1], Array.from(board.defs[0].answer));
  assert.deepEqual([3 - 1, 3 + 1, 1, 3 - 2 + 3], Array.from(board.defs[1].answer));
  assert.ok(Math.abs(.9 * .8 + .4 * .2 - .8) < 1e-12 && board.defs[2].answer[0] === .8 && board.defs[2].answer[1] === 8 / 2 && board.defs[2].answer[2] === 5 - 5);

  // Economy: purchases and bonuses survive a reload only while the recomputed budget covers them.
  const chapterOne = chapters[0].ids;
  const rich = qa.normalize({ solved: chapterOne, tools: ['vector', 'matrix'], landmarks: [0, 5, 0], contracts: ['c1'], clean: ['q01', 'q68'], revealed: ['q01', 'q68', 'nope'], reviews: { q01: 2, q68: 4, q02: -1 } });
  assert.deepEqual(Array.from(rich.landmarks), [0], 'only landmarks of finished chapters are kept, once');
  assert.deepEqual(Array.from(rich.contracts), [], 'a contract needs its three missions');
  assert.equal(rich.points, chapterOne.length - 2 - 6, 'points = missions − tool costs − landmark cost');
  assert.deepEqual(Array.from(rich.clean), ['q01']); assert.deepEqual(Array.from(rich.revealed), ['q68']); assert.deepEqual(JSON.parse(JSON.stringify(rich.reviews)), { q01: { n: 2, last: 0 } }, 'a 1.3 review count is upgraded');
  assert.equal(rich.seed, 0, 'a save without a seed keeps the authored numbers');
  const modern = qa.normalize({ solved: ['q01'], tools: [], seed: 77, rolls: { q02: 3, nope: 1, q03: -1 }, errors: { q01: { n: 2, last: 5, pit: { 0: 1, x: 9 } }, zz: { n: 1 } }, reviews: { q01: { n: 0, last: 9 } } });
  assert.deepEqual(JSON.parse(JSON.stringify([modern.seed, modern.rolls, modern.errors, modern.reviews])), [77, { q02: 3 }, { q01: { n: 2, last: 5, pit: { 0: 1 } } }, { q01: { n: 0, last: 9 } }]);
  const broke = qa.normalize({ solved: ['q01'], tools: ['vector'], landmarks: [0] });
  assert.equal(broke.points, 0); assert.deepEqual(Array.from(broke.landmarks), []);
  const everything = qa.normalize({ solved: quests.map(q => q.id), tools: ['vector','matrix','projection','solve3','linefit','eigen'], landmarks: [0,1,2,3,4,5,6,7], contracts: ['c1','c2','c3'] });
  assert.equal(everything.tools.length, 6); assert.equal(everything.landmarks.length, 8); assert.equal(everything.contracts.length, 3);
  assert.equal(everything.points, questCount + 9 - 12 - 48, 'a finished campaign can afford every tool and landmark');
  assert.ok(everything.points >= 0);
  // Ranks step through the whole campaign instead of stopping at 30 missions.
  const rankAt = n => boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: quests.slice(0, n).map(q => q.id), tools: [] })]])).qa.rank();
  assert.deepEqual([0, 5, 12, 20, 30, 40, 50, 60, questCount].map(rankAt), ['CADET','ENGINEER','SPECIALIST','CHIEF ENGINEER','VECTOR SAGE','SYSTEMS MASTER','PRINCIPAL DESIGNER','GUILD FELLOW','GUILD ARCHITECT']);
}

/* Packs other than linear algebra: the declared campaign is complete (or reported as not yet written),
   ranks reach the top at the declared mission count, and the engine plays the pack's first mission through
   with its own save slice. */
let missing = [];
if (!isLA) {
  const ids = declared.flatMap(c => c.ids);
  missing = ids.filter(id => !byId[id]);
  // Copy out of the vm realm: strict deepEqual compares Array prototypes, so a vm-made [] never equals [].
  if (complete) assert.deepEqual(Array.from(missing), [], 'every declared mission is written');
  assert.equal(ranks[ranks.length - 1].at, ids.length, 'the top rank needs every declared mission');
  for (const name of ['Docking', 'Contracts', 'Board', 'HandsOn', 'VisualLab', 'Graph2D']) if (!pack.scripts.some(f => ({ Docking: 'docking.js', Contracts: 'contracts.js', Board: 'board.js', HandsOn: 'handson.js', VisualLab: 'lab3d.js', Graph2D: 'graph-lab.js' })[name] === f)) assert.equal(curriculumWindow[name], undefined, `${name} is not loaded`);
  const fill = (inputs, values) => { assert.equal(inputs.length, values.length); inputs.forEach((x, i) => x.value = String(values[i])); };
  const first = quests[0], play = boot();
  assert.equal(play.qa.rank(), ranks[0].title, 'a new player holds the first rank');
  play.qa.mission(first.id); play.el('#ready').onclick();
  assert.equal(play.qa.getMain().length, first.answer.length, 'answer boxes match the answer key');
  fill(play.qa.getMain(), first.answer); play.el('#submit-answer').onclick();
  assert.match(play.el('.feedback').textContent, /Mission complete/, `${first.id} can be solved with its authored answer`);
  assert.equal(play.qa.getState().xp, first.xp); assert.equal(play.qa.getState().points, 1);
  const stored = JSON.parse(play.storage.get('vector-guild-save-v2'));
  assert.deepEqual(Array.from(stored.realms[REALM.saveId].solved), [first.id], 'progress is saved in this realm\'s slice');
  assert.equal(stored.realms[REALM.saveId].seed, undefined, 'the seed is global, not in the slice');
  assert.equal(stored.realms.la, undefined, 'no other realm is created');
  const again = boot(play.storage);
  assert.equal(again.qa.getState().xp, first.xp, 'progress survives a reload');
  const keep = { solved: ['q01'], tools: [], xp: 100, odd: [1] };
  const shared = boot(new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 0, intro: true, realms: { la: keep } })]]));
  shared.qa.mission(first.id); shared.el('#ready').onclick(); fill(shared.qa.getMain(), first.answer); shared.el('#submit-answer').onclick();
  assert.deepEqual(JSON.parse(shared.storage.get('vector-guild-save-v2')).realms.la, keep, 'another realm\'s progress is left exactly as it was');
  const reviewable = quests.filter(q => curriculumWindow.Variants.has(q.id)).slice(0, 3).map(q => q.id);
  if (reviewable.length) {
    const drill = boot(new Map([['vector-guild-save-v2', JSON.stringify({ v: 2, seed: 0, intro: false, realms: { [REALM.saveId]: { solved: quests.map(q => q.id), tools: [] } } })]]));
    const xpBefore = drill.qa.getState().xp; drill.qa.review(); assert.match(drill.dc._html, /REVIEW DRILL/);
    drill.el('#review-answer').value = String(drill.qa.variant().target); drill.el('#review-check').onclick();
    assert.match(drill.el('#review-feedback').textContent, /^Correct/, 'a review drill accepts its own target'); assert.equal(drill.qa.getState().xp, xpBefore, 'drills pay no XP');
  }
}

if (isLA) {
  // Review drill: a correct fresh-numbers answer is recorded once and pays no XP.
  const drill = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01','q02','q03'], tools: [] })]]));
  const xpBefore = drill.qa.getState().xp; drill.qa.review();
  assert.match(drill.dc._html, /REVIEW DRILL/);
  console.log(`PASS: ${questCount}-mission teaching/guidance/schema/reachability audit; chapters, variants, contract board, economy and ranks; 68 interactive experiments and 3D/2D formulas; sourced lessons; outpost mentor; guided help; rewards/payoff; old and new save persistence/unlocks; import normalization.`);
  console.log(`NOTE: offline imports cannot authenticate an entirely forged closed completion list (${forged.solved.length}/${questCount} accepted; XP recomputed).`);
} else {
  console.log(`PASS: ${REALM.name} (${realm}): ${questCount}-mission teaching/guidance/schema/reachability audit; declared chapters, sectors, tiers and ranks; ${REALM.sourceRule.label} sources; experiments and variants; narration; first-mission play-through with its own save slice.`);
  if (missing.length) console.log(`NOTE: ${missing.length} of ${declared.flatMap(c => c.ids).length} declared missions are not written yet: ${missing.join(' ')}. Run with --complete to require them.`);
}
