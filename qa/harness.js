/* Content and gameplay checks for one realm pack, run in Node without a browser.
   Usage: node qa/harness.js                    linear algebra (pack "la"), exactly the 1.4.1 checks plus save 2.0
          node qa/harness.js --realm found      another pack: every generic per-mission check, with that pack's
          node qa/harness.js found              chapters, source rule and ranks, and a play-through of its first mission
   Option: --complete  fail when a pack declares chapter missions that are not written yet (otherwise a note).
           --complete-practice  fail when a planned practice mission is not written yet (otherwise a note).
   Practice missions (docs/PACK-FORMAT.md, "Practice missions") are checked wherever a pack has them: schema, parent,
   kind, what they inherit, hints, prompts, unlocking, the straight-to-the-problem dialog and the drop-down menus.
   The pack's scripts are read from game/realms/packs.js in the order realm.html loads them, with the scripts every
   realm page shares (VG_REALM_SHARED: the collection) around them. Every page load below has the collection running,
   so the linear algebra checks also prove that it changes no XP, answer or unlock.
   Required from another test (qa/realm-collection.test.js), this file runs its checks and exports boot(). */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '../game');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const args = process.argv.slice(2);
const packsWindow = {};
vm.runInNewContext(read('realms/packs.js'), { window: packsWindow });
const PACKS = packsWindow.VG_PACKS, SHARED = packsWindow.VG_REALM_SHARED;
const realmAt = args.indexOf('--realm');
const realm = realmAt >= 0 ? args[realmAt + 1] : (args.find(a => !a.startsWith('--') && Object.prototype.hasOwnProperty.call(PACKS, a)) || 'la');
const complete = args.includes('--complete'), completePractice = args.includes('--complete-practice');
if (!Object.prototype.hasOwnProperty.call(PACKS, realm)) { console.error(`FAIL: unknown realm "${realm}"; packs in game/realms/packs.js: ${Object.keys(PACKS).join(', ')}`); process.exit(1); }
const pack = PACKS[realm], isLA = realm === 'la';
const byId = {};
/* Scripts that need a real browser page are left to the Playwright checks (qa/handson-browser.js). */
const browserOnly = new Set(['handson.js', 'collection/ui.js']);
/* The collection is loaded on every realm page: data and logic before the pack, page code just before app.js. */
assert.deepEqual(Array.from(SHARED.before), ['realms/registry.js', 'collection/figures.js', 'collection/achievements.js', 'collection/core.js'], 'the collection data and core load before the pack');
assert.deepEqual(Array.from(SHARED.after), ['collection/ui.js'], 'the collection interface loads after the pack, before app.js');
assert.deepEqual(Array.from(SHARED.styles), ['collection/collection.css']);
{
  const page = read('realm.html');
  assert.ok(page.includes("pack.styles.concat((window.VG_REALM_SHARED||{}).styles||[])") && page.includes("(shared.before||[]).concat(pack.scripts,shared.after||[],'app.js')"), 'realm.html writes the shared files around every pack, app.js last');
  assert.ok(page.indexOf('src="save-store.js"') > 0 && page.indexOf('src="save-store.js"') < page.indexOf('shared.before'), 'save-store.js loads before the collection');
  assert.match(page, /<div class="top-stats">.*id="points".*<button type="button" id="collection-chip" class="collection-chip" hidden><\/button>.*id="help"/, 'the top bar has the collection chip after XP and SP');
  assert.ok(!/type="module"|\bfetch\(|\bimport\s/.test(page), 'classic scripts only');
}
const curriculumWindow = { VG_SEED: 0 }; // seed 0 = authored numbers, so the scripted answers below stay valid
let authoredOrder = null;
for (const file of [...SHARED.before, ...pack.scripts, ...SHARED.after]) {
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
/* Learn missions (one per concept) and practice missions (those with a parent). Linear algebra has only learn missions. */
const learn = quests.filter(q => !q.parent), practice = quests.filter(q => q.parent);
if (isLA) assert.equal(practice.length, 0, 'linear algebra has no practice missions: its 68 missions are unchanged');

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
assert.ok(learn.every(q => typeof curriculumWindow.EXPERIMENTS[q.id] === 'function'), 'every learn mission has a topic-specific experiment model');
assert.ok(practice.every(q => typeof curriculumWindow.EXPERIMENTS[q.parent] === 'function' && curriculumWindow.EXPERIMENTS[q.id] === undefined), 'a practice mission uses its parent\'s experiment and registers none of its own');
for (const q of learn) for (let t = -10; t <= 10; t++) {
  const model = curriculumWindow.EXPERIMENTS[q.id](t);
  assert.ok(model.prompt && model.formula && model.values?.length >= 2, `${q.id}@${t}: experiment completeness`);
  assert.ok(model.values.every(([,v]) => Number.isFinite(v)), `${q.id}@${t}: numeric outputs finite`);
  assert.equal(model.target, model.values[0][1], `${q.id}@${t}: target matches displayed output`);
}
/* Mission fields the engine shows. */
const sectorNames = REALM.sectors.map(s => s.name);
for (const q of quests) {
  for (const key of ['id', 'title', 'topic', 'tier', 'sector', 'brief', 'lesson', 'prompt', 'solution']) assert.ok(typeof q[key] === 'string' && q[key].trim(), `${q.id}: ${key} text`);
  assert.ok((q.parent ? /^q\d{2}[a-z]$/ : /^q\d{2}$/).test(q.id), `${q.id}: local id of the form q01 (learn) or q01b (practice)`);
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
const appSource = fs.readFileSync(root + '/app.js', 'utf8'), storeSource = read('save-store.js'), coreSource = read('collection/core.js');
assert.ok(curriculumWindow.VGCollection && Array.isArray(curriculumWindow.VG_ACHIEVEMENTS) && Array.isArray(curriculumWindow.VG_REALMS), 'the collection core, achievements and registry load on the realm page');
if (!Array.isArray(curriculumWindow.VG_FIGURES)) curriculumWindow.VG_FIGURES = []; // the figure list is written separately; the page works without it

/* One page load: a fresh save store over `storage` (a Map standing for localStorage), then app.js. */
/* page: extra window properties for this page load only (a stand-in VGCollectionUI, a figure list for a test). */
function boot(storage = new Map(), page = {}) {
  const localStorage = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  const storeWindow = { VG_SEED: curriculumWindow.VG_SEED, localStorage };
  vm.runInNewContext(storeSource, { window: storeWindow, Math, JSON });
  curriculumWindow.VGSave = storeWindow.VGSave; // app.js keeps the store it finds when it starts
  /* Each page load has its own window over the shared pack modules, and its own collection core over its own
     store: the core looks up window.VGSave on every call, so a shared one would follow the latest page load. */
  const pageWindow = Object.assign(Object.create(curriculumWindow), page, { VGSave: storeWindow.VGSave });
  if (!('VGCollection' in page)) vm.runInNewContext(coreSource, { window: pageWindow, Math, JSON }); // page.VGCollection = null: a page without the collection
  /* Window listeners and reloads of this page load, so a test can fire pageshow or storage and count reloads. */
  const listeners = {}, pageInfo = { reloads: 0 };
  curriculumWindow.addEventListener = (type, fn) => { listeners[type] = fn; };
  curriculumWindow.location = { href: '', reload() { pageInfo.reloads++; } };
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
  /* The drop-down buttons of the page as drawn: enough of a button for render() to wire and for a test to press.
     Pressing one (toggles().find(...).onclick()) is a player opening or closing that drop-down. */
  let ddButtons = [];
  const content = element('#content'); content.querySelectorAll = sel => {
    if (sel !== '.dd-toggle') return [];
    ddButtons = [...String(content.innerHTML || '').matchAll(/class="dd-toggle" id="([^"]+)" data-dd="([^"]+)" aria-expanded="(true|false)" aria-controls="([^"]+)"/g)].map(m => {
      let open = m[3] === 'true';
      return { id: m[1], dataset: { dd: m[2] }, onclick: null, getAttribute: n => n === 'aria-expanded' ? String(open) : n === 'aria-controls' ? m[4] : null, setAttribute(n, v) { if (n === 'aria-expanded') open = v === 'true'; } };
    });
    return ddButtons;
  };
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
    const id = (html.match(/OPERATION \/ (Q\d+[A-Z]?)/) || [])[1]?.toLowerCase();
    if (id) { activeId = id; mainInputs = []; guidedInputs = []; stage._html = html; guided._html = ''; }
  }});
  /* The dialog keeps its listeners, so a test can close it as the browser would (closeDialog fires "close"). */
  const dialogListeners = {};
  const dialog = element('#dialog'); dialog.showModal = () => {}; dialog.close = () => {}; dialog.addEventListener = (type, fn) => { dialogListeners[type] = fn; };
  const document = {
    querySelector: s => s === '#content' ? content : s === '#dialog' ? dialog : s === '#dialog-content' ? dc :
      s === '#mission-stage' ? stage : s === '#guided' ? guided : element(s),
    querySelectorAll: () => [], createElement: () => element('created'),
    getElementById: id => ddButtons.find(b => b.id === id) || { hidden: false },
    activeElement: null,
  };
  const context = {
    window: pageWindow, Outpost: curriculumWindow.Outpost,
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
  const instrumented = appSource.replace(/\}\)\(\);\s*$/, 'globalThis.__qa={normalize,mission,available:(id)=>available(quests.find(q=>q.id===id)),getState:()=>JSON.parse(JSON.stringify(state)),getMain:()=>__getMain(),getGuided:()=>__getGuided(),activeId:()=>activeId,variant:()=>activeVariant,rank,review,next:()=>next()?.id||null,show:(v)=>{view=v;render();return content.innerHTML},parseNumber,toolResult,level,current:()=>currentMission,reviewDue,pickReview,render,setState:(patch)=>Object.assign(state,patch),readNumber,nextRoll:(id,shown)=>nextRoll(byId.get(id),shown),roll:(id)=>state.rolls[id]||0};})();');
  vm.runInNewContext(instrumented, context);
  /* focusOn(id, key): the player's focus is on mission id's card, inside the drop-down with that key. */
  const focusOn = (questId, key) => { document.activeElement = questId ? { dataset: { quest: questId }, closest: sel => sel === '.dd-panel' && key ? { getAttribute: n => n === 'aria-labelledby' ? (ddButtons.find(b => b.dataset.dd === key) || {}).id : null } : null } : null; };
  return { toggles: () => ddButtons, closeDialog: () => dialogListeners.close && dialogListeners.close(), focusOn, qa: context.__qa, el: element, dc, stage, guided, storage, curriculum: curriculumWindow.QUESTS, fire: (type, event) => listeners[type] && listeners[type](event), page: pageInfo, store: storeWindow.VGSave, window: pageWindow, collection: pageWindow.VGCollection };
}
/* A second page's view of the same storage (the star map, another tab): its own VGSave over the same Map. */
boot.storeOver = storage => {
  const w = { VG_SEED: 0, localStorage: { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) } };
  vm.runInNewContext(storeSource, { window: w, Math, JSON }); return w.VGSave;
};
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
  /* Each answer field says whether it is right, in words that fit any pack (not "component"). */
  assert.equal(el('#answer-status-0').textContent, '✓ This one is right');
  /* Numbers as typed. A comma is a decimal point ("1,5"), and also a thousands separator when that is what fits. */
  assert.equal(qa.parseNumber('1,5'), 1.5); assert.equal(qa.readNumber('1,5', x => Math.abs(x - 1.5) <= .01), 1.5);
  assert.equal(qa.readNumber('1,432', x => Math.abs(x - 1432) <= .01), 1432, 'a correct whole number with a thousands comma is read as that number');
  assert.equal(qa.readNumber('1,432', x => Math.abs(x - 1.432) <= .01), 1.432, 'a decimal comma still wins when it fits');
  assert.equal(qa.readNumber('1,432', x => Math.abs(x - 7) <= .01), 1.432, 'a wrong answer keeps the decimal reading');
  assert.equal(qa.readNumber('−12,345,678'), -12345678); assert.equal(qa.readNumber('1,234.5', x => x === 1234.5), 1234.5);
  assert.ok(Number.isNaN(qa.readNumber('1,43,2')) && Number.isNaN(qa.readNumber('1 432')) && qa.readNumber('12,34') === 12.34 && qa.readNumber('7/6') === 7 / 6);
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
  assert.ok(learn.every(q => declared.some(c => c.ids.includes(q.id))), 'every learn mission belongs to a declared chapter');
  for (const q of quests) assert.equal(q.sector, REALM.sectors[q.chapter].name, `${q.id}: sector matches its chapter (${REALM.sectors[q.chapter].name})`);
  for (const [i, c] of declared.entries()) if (c.tier) for (const id of chapters[i].ids) assert.equal(byId[id].tier, c.tier, `${id}: chapter ${i + 1} missions are ${c.tier}`);
}
assert.deepEqual(Array.from(learn.map(q => q.id)), Array.from(chapters.flatMap(c => c.ids)), 'campaign order follows the chapters');
/* A concept's practice missions follow its learn mission, in id order; a chapter lists them apart from its learn missions. */
assert.deepEqual(Array.from(quests.map(q => q.id)), Array.from(learn.flatMap(q => [q.id, ...practice.filter(p => p.parent === q.id).map(p => p.id).sort()])), 'practice missions follow their learn mission');
for (const c of chapters) assert.deepEqual(Array.from(c.practice), Array.from(practice.filter(p => c.ids.includes(p.parent)).map(p => p.id)), `${c.name}: chapter.practice lists the practice missions of its concepts`);

// Variants: every mission has a problem statement without float noise or doubled signs, and
// generated questions have finite targets that actually vary.
const variants = curriculumWindow.Variants;
assert.ok(practice.every(q => !variants.has(q.id) && variants.has(q.parent)), 'a practice mission uses its parent\'s review drill and registers none of its own');
for (const q of learn) {
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
  /* How close a drill answer must be. Linear algebra: exactly the 1.4.1 rule (2% of the target, at least 0.02).
     Other packs: a neighbouring whole number, or a neighbouring value in the target's last decimal place, is a
     wrong answer (3570 for 3507, 5.15 for 5.05), so it must be rejected. The rule is checked here against the
     model's raw target, independently of the drill generator. */
  for (let t = -10; t <= 10; t++) {
    const model = curriculumWindow.EXPERIMENTS[q.id](t), target = Number(model.target), tol = variants.tolerance(target, model), rule = variants.accept(target, model);
    const drill = { target, tolerance: tol };
    assert.ok(tol > 0 && variants.check(drill, target), `${q.id}@${t}: the target itself is accepted`);
    if (isLA) { assert.equal(tol, Math.max(.02, Math.abs(target) * .02), `${q.id}@${t}: linear algebra keeps the 1.4.1 drill tolerance`); assert.equal(rule.exact, false); assert.equal(rule.note, 'Answers within 2% are accepted.'); continue; }
    if (model.tolerance !== undefined) { assert.ok(Number.isFinite(model.tolerance) && model.tolerance > 0, `${q.id}@${t}: a model's own tolerance is a positive number`); assert.equal(tol, model.tolerance); continue; }
    const places = [0, 1, 2, 3].find(d => Math.abs(target * 10 ** d - Math.round(target * 10 ** d)) < 1e-7);
    if (places === undefined) { assert.equal(rule.exact, false, `${q.id}@${t}: an untidy target (${target}) keeps the 2% rule`); continue; }
    const step = 10 ** -places;
    assert.equal(rule.exact, true); assert.doesNotMatch(rule.note, /2%/, `${q.id}@${t}: the drill does not promise a 2% margin`);
    for (const wrong of [target + step, target - step, target + 10 * step, target - 10 * step, target + .001, target - .001]) assert.equal(variants.check(drill, wrong), false, `${q.id}@${t}: ${wrong} is not accepted for ${target}`);
    assert.ok(variants.check(drill, Number(target.toFixed(places))), `${q.id}@${t}: ${target.toFixed(places)} typed as shown is accepted`);
  }
  for (let i = 0; i < 20; i++) { const v = variants.make(q.id), rule = variants.accept(v.target, curriculumWindow.EXPERIMENTS[q.id](v.t)); assert.equal(v.tolerance, rule.tolerance, `${q.id}: a drill uses the shared tolerance rule`); assert.equal(v.note, rule.note); assert.equal(v.exact, rule.exact); }
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
let missing = [], missingPractice = [], plannedPractice = [];
if (!isLA) {
  const ids = declared.flatMap(c => c.ids);
  missing = ids.filter(id => !byId[id]);
  // Copy out of the vm realm: strict deepEqual compares Array prototypes, so a vm-made [] never equals [].
  if (complete) assert.deepEqual(Array.from(missing), [], 'every declared mission is written');
  /* Planned practice: one mission per declared concept and per letter of REALM.practice.kinds. */
  plannedPractice = ids.flatMap(id => Object.keys(REALM.practice?.kinds || {}).sort().map(letter => id + letter));
  missingPractice = plannedPractice.filter(id => !byId[id]);
  if (completePractice) assert.deepEqual(Array.from(missingPractice), [], 'every planned practice mission is written');
  assert.equal(ranks[ranks.length - 1].at, ids.length + plannedPractice.length, 'the top rank needs every declared mission, learn and practice');
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

/* ---------- Practice missions (docs/PACK-FORMAT.md, "Practice missions") ---------- */
{
  const raw = Array.from(curriculumWindow.PRACTICE || []), kinds = REALM.practice?.kinds || null, Gen = curriculumWindow.Gen;
  const OWN = ['id', 'parent', 'kind', 'title', 'brief', 'prompt', 'answer', 'labels', 'tolerance', 'hints', 'solution', 'guidance'], OPTIONAL = ['uses'];
  const INHERITED = ['topic', 'tier', 'sector', 'lesson', 'teaching', 'sources', 'xp', 'chapter'];
  assert.ok(!raw.length || kinds, 'a pack with practice missions declares REALM.practice.kinds');
  if (kinds) for (const [letter, kind] of Object.entries(kinds)) assert.ok(/^[a-z]$/.test(letter) && ['setting', 'applied', 'challenge'].includes(kind), `REALM.practice.kinds.${letter}: a lowercase letter and one of setting, applied, challenge`);
  assert.equal(practice.length, raw.length, `every entry of window.PRACTICE became a mission; these have no learn mission as parent, or reuse an id: ${raw.filter(p => !byId[p?.id]?.parent).map(p => p?.id).join(' ') || 'none'}`);
  assert.equal(new Set(raw.map(p => p.id)).size, raw.length, 'practice ids are unique');
  const position = new Map(quests.map((q, i) => [q.id, i])), noDigits = text => String(text).replace(/[\d.,−-]+/g, '#').replace(/\s+/g, ' ').trim();
  const reEsc = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), token = a => new RegExp(`(?<![\\d.−])${reEsc(Gen.n(a))}(?![\\d/]|\\.\\d)`);
  const titles = new Map(); for (const q of quests) { assert.ok(!titles.has(q.title), `${q.id}: the title "${q.title}" is already used by ${titles.get(q.title)}`); titles.set(q.title, q.id); }
  for (const p of raw) {
    const q = byId[p.id], parent = byId[p.parent], letter = String(p.id).slice(-1);
    /* Schema: its own fields and nothing else. */
    assert.ok(/^q\d{2}[a-z]$/.test(p.id), `${p.id}: a practice id is its parent's id and one lowercase letter (q01b)`);
    assert.ok(parent && !parent.parent, `${p.id}: parent "${p.parent}" is a learn mission of this pack`);
    assert.equal(p.id.slice(0, -1), p.parent, `${p.id}: the id starts with the parent's id`);
    assert.ok(Object.prototype.hasOwnProperty.call(kinds, letter), `${p.id}: letter "${letter}" is one of ${Object.keys(kinds).join(', ')}`);
    assert.equal(p.kind, kinds[letter], `${p.id}: kind is "${kinds[letter]}" for letter ${letter}`);
    for (const key of OWN) assert.ok(key in p, `${p.id}: supplies ${key}`);
    for (const key of Object.keys(p)) assert.ok(OWN.includes(key) || OPTIONAL.includes(key), `${p.id}: "${key}" is not a practice field (${INHERITED.includes(key) || ['prereqs', 'artifact'].includes(key) ? 'it comes from the parent' : 'unknown'})`);
    for (const key of ['title', 'brief', 'prompt', 'solution']) assert.ok(typeof p[key] === 'string' && p[key].trim(), `${p.id}: ${key} text`);
    /* Inheritance: teaching, sources, tier, XP, sector and chapter are the parent's own; it unlocks on the parent alone. */
    for (const key of INHERITED) assert.equal(q[key], parent[key], `${p.id}: ${key} is inherited from ${parent.id}`);
    assert.deepEqual(Array.from(q.prereqs), [parent.id], `${p.id}: unlocks when ${parent.id} is solved`);
    assert.equal(q.artifact, undefined, `${p.id}: practice missions carry no artifact`);
    assert.ok(!learn.some(l => (l.prereqs || []).includes(p.id)), `${p.id}: no learn mission depends on a practice mission`);
    /* Its own problem: a new title, brief and prompt, not the parent's problem with other numbers. */
    assert.notEqual(p.brief, parent.brief, `${p.id}: its own brief`);
    assert.notEqual(noDigits(p.prompt), noDigits(parent.prompt), `${p.id}: the prompt differs from the parent's prompt by more than its numbers`);
    for (const other of raw) if (other !== p && other.parent === p.parent) assert.notEqual(noDigits(other.prompt), noDigits(p.prompt), `${p.id}: the prompt differs from ${other.id}'s prompt by more than its numbers`);
    if (p.kind === 'applied') assert.ok(p.guidance.length >= 2 && p.guidance.length <= 3, `${p.id}: an applied problem has two or three guided steps`);
    if (p.uses !== undefined) { assert.equal(p.kind, 'challenge', `${p.id}: only a challenge names an earlier concept in "uses"`); assert.ok(byId[p.uses] && !byId[p.uses].parent && position.get(p.uses) < position.get(parent.id), `${p.id}: uses "${p.uses}" is a learn mission earlier than ${parent.id}`); }
    /* Its own generator, and hints that leave the answering to the player. A number the prompt states does not count;
       a chance match in one build does not either, so the rule is about most builds. */
    assert.ok(Gen.has(p.id), `${p.id}: has its own generator in window.MISSION_GEN`);
    let builds = 0, leaks = 0;
    for (let roll = 0; roll <= 40; roll++) {
      const m = roll ? Gen.instance(q, 777, roll) : Gen.instance(q, 0, 0);
      if (m === q && roll) continue; // a failed build is reported by qa/generators.js
      builds++;
      const asked = m.answer.filter(a => !token(a).test(m.prompt));
      if (asked.length && asked.every(a => m.hints.some(h => token(a).test(h)))) leaks++;
    }
    assert.ok(leaks <= builds / 2, `${p.id}: the hints contain every answer in ${leaks} of ${builds} builds`);
  }
  if (practice.length) {
    /* Play-through. A practice mission is locked until its parent is solved, then goes straight to the problem with
       the parent's lesson behind "Review the lesson"; it pays XP by tier, a skill point and stardust like any mission. */
    const KEY = 'vector-guild-save-v2', sid = REALM.saveId || REALM.id, p0 = practice[0], parent = byId[p0.parent];
    const saved = ids => new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [sid]: { solved: ids, tools: [] } } })]]);
    const upTo = learn.slice(0, learn.indexOf(parent) + 1).map(q => q.id), xpOf = ids => ids.reduce((n, id) => n + byId[id].xp, 0);
    const fill = (inputs, values) => { assert.equal(inputs.length, values.length); inputs.forEach((x, i) => x.value = String(values[i])); };
    const locked = boot(saved(upTo.slice(0, -1)));
    assert.equal(locked.qa.available(p0.id), false, `${p0.id} is locked until ${parent.id} is solved`);
    locked.qa.mission(p0.id); assert.equal(locked.qa.getMain().length, 0, 'a locked practice mission shows no answer boxes'); assert.match(locked.stage._html, /Locked\. Complete /);
    const lockedHome = locked.el('#content').innerHTML;
    assert.match(lockedHome, new RegExp(`class="practice-chip locked" data-quest="${p0.id}"[^>]*aria-label="[^"]*Locked[^"]*"[^>]*>.*?◇ LOCKED`), 'a locked practice chip says so in text and to a screen reader');
    assert.equal(boot(saved([p0.id])).qa.getState().solved.length, 0, 'a save that claims a practice mission without its parent loses the claim');
    const run = boot(saved(upTo)), after = learn[learn.indexOf(parent) + 1];
    assert.deepEqual(Array.from(run.qa.getState().solved), Array.from(upTo), 'a save with learn missions only loads unchanged');
    assert.equal(run.qa.available(p0.id), true); if (after) { assert.equal(run.qa.available(after.id), (after.prereqs || []).every(id => upTo.includes(id)), 'the next concept depends only on its own prerequisites'); assert.equal(run.qa.next(), learn.find(q => !upTo.includes(q.id) && (q.prereqs || []).every(id => upTo.includes(id))).id, 'the next mission on the main path is a learn mission, not practice'); }
    assert.match(run.el('#content').innerHTML, new RegExp(`class="practice-chip ready" data-quest="${p0.id}"`));
    run.qa.mission(p0.id);
    assert.equal(run.qa.getMain().length, p0.answer.length, 'a practice mission opens on the problem, with no "I\'m ready" step');
    assert.match(run.stage._html, /<details class="lesson-review"><summary>Review the lesson<\/summary>/, 'the parent\'s lesson is collapsed behind "Review the lesson"');
    assert.ok(run.stage._html.includes(parent.teaching.example.answer.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')), 'and it is the parent\'s worked example');
    assert.doesNotMatch(run.stage._html, /01 \/ LEARN/); assert.match(run.dc._html, new RegExp(`PRACTICE OPERATION / ${p0.id.toUpperCase()}<`));
    fill(run.qa.getMain(), p0.answer.map(x => x + 7)); run.el('#submit-answer').onclick();
    assert.equal(run.qa.getState().errors[parent.id]?.n, 1, 'a miss on a practice mission is logged under its concept'); assert.equal(run.qa.getState().errors[p0.id], undefined);
    fill(run.qa.getMain(), p0.answer); run.el('#submit-answer').onclick();
    assert.match(run.el('.feedback').textContent, /Mission complete/); assert.match(run.el('.feedback')._html, /PRACTICE COMPLETE/);
    assert.equal(run.qa.getState().xp, xpOf(upTo) + REALM.tierXp[parent.tier], 'a practice mission pays the XP of its tier'); assert.equal(run.qa.getState().points, upTo.length + 1);
    assert.deepEqual(Array.from(run.qa.getState().clean), [], 'a solve after a miss earns no first-try star');
    assert.ok(JSON.parse(run.storage.get(KEY)).realms[sid].solved.includes(p0.id), 'the practice id is saved in the realm\'s slice');
    assert.ok(JSON.parse(run.storage.get(KEY)).meta.paid[sid].solved.includes(p0.id), 'stardust is paid for a practice solve like any first solve');
    assert.deepEqual(Array.from(boot(run.storage).qa.getState().solved), [...upTo, p0.id], 'practice progress survives a reload');
    const starred = boot(saved(upTo)); starred.qa.mission(p0.id); fill(starred.qa.getMain(), p0.answer); starred.el('#submit-answer').onclick();
    assert.deepEqual(Array.from(starred.qa.getState().clean), [p0.id], 'a first-check solve of a practice mission earns the star'); assert.ok(JSON.parse(starred.storage.get(KEY)).meta.paid[sid].clean.includes(p0.id), 'and the star is paid');
    /* Chapters are complete on their learn missions alone; mastered needs the practice too. Ranks need everything. */
    const learned = boot(saved(learn.map(q => q.id)));
    const built = learned.qa.normalize({ solved: learn.map(q => q.id), tools: [], landmarks: chapters.map((_, i) => i) });
    assert.equal(built.landmarks.length, Math.min(chapters.length, Math.floor(learn.length / REALM.landmarkCost)), 'every chapter is complete, so its landmark can be built, with no practice mission solved');
    assert.equal((learned.el('#content').innerHTML.match(/✦ COMPLETE/g) || []).length, chapters.length); assert.doesNotMatch(learned.el('#content').innerHTML, /★ MASTERED/);
    assert.equal(learned.qa.next(), practice[0].id, 'with every concept learned, practice is what comes next');
    assert.notEqual(learned.qa.rank(), ranks[ranks.length - 1].title, 'the top rank needs the practice missions too');
    /* learnAt: a rank is also held by that many concepts learned alone, so a save from before practice existed keeps its rank. */
    const byLearn = ranks.filter(r => r.learnAt !== undefined);
    assert.ok(byLearn.every((r, i) => !r.top && Number.isInteger(r.learnAt) && r.learnAt > 0 && r.learnAt <= r.at && r.learnAt <= learn.length && (i === 0 || r.learnAt > byLearn[i - 1].learnAt)), 'learnAt rises, never asks more than `at`, and is not on the top rank');
    for (const r of byLearn) {
      assert.equal(boot(saved(learn.slice(0, r.learnAt).map(q => q.id))).qa.rank(), r.title, `${r.learnAt} concepts learned hold the rank ${r.title}`);
      assert.notEqual(boot(saved(learn.slice(0, r.learnAt - 1).map(q => q.id))).qa.rank(), r.title, `${r.learnAt - 1} concepts do not reach ${r.title}`);
    }
    if (byLearn.length) {
      const some = boot(saved(learn.slice(0, byLearn[0].learnAt - 1).map(q => q.id)));
      assert.match(some.el('#content').innerHTML, new RegExp('>1 NEW CONCEPT TO ' + byLearn[0].title + ' ·'), 'the strip counts the fewest steps to the next rank and says they are concepts');
      /* The strip names what it counts. Practice does not move a count of concepts, so a count labelled MISSIONS must go
         down with every practice mission solved, and a count labelled NEW CONCEPTS must be the concepts still to learn. */
      const at = Math.min(2, byLearn.length - 1), r1 = byLearn[at], held = learn.slice(0, at ? byLearn[at - 1].learnAt : 0).map(q => q.id), drills = practice.filter(p => held.includes(p.parent)).map(p => p.id);
      const gap = ids => { const m = boot(saved(ids)).el('#content').innerHTML.match(/<small>(\d+) (MISSIONS?|NEW CONCEPTS?) TO ([^<]*?) · \d+ XP TO NEXT LEVEL<\/small>/); assert.ok(m, 'the strip states the gap to the next rank'); return { n: Number(m[1]), unit: m[2], title: m[3] }; };
      let before = null, sawMissions = 0, sawConcepts = 0;
      for (let p = 0; p <= drills.length; p++) {
        const g = gap(held.concat(drills.slice(0, p)));
        assert.equal(/S$/.test(g.unit), g.n !== 1, 'singular for one, plural otherwise: ' + g.n + ' ' + g.unit);
        if (g.title !== r1.title) break; // promoted by missions solved
        if (/CONCEPT/.test(g.unit)) { sawConcepts++; assert.equal(g.n, r1.learnAt - held.length, 'a count of concepts is the concepts still to learn'); }
        else { sawMissions++; if (before && /MISSION/.test(before.unit)) assert.equal(g.n, before.n - 1, 'solving a practice mission lowers a count of MISSIONS by one'); assert.equal(g.n, r1.at - held.length - p); }
        if (before && before.n === g.n) assert.match(before.unit, /CONCEPT/, 'a count that practice leaves unchanged was never labelled MISSIONS');
        before = g;
      }
      assert.ok(sawConcepts > 1 && sawMissions > 1, 'both ways of counting were seen (' + sawConcepts + ' concept counts, ' + sawMissions + ' mission counts)');
    }
    const everything = boot(saved(quests.map(q => q.id)));
    assert.equal(everything.qa.rank(), ranks[ranks.length - 1].title, 'every mission solved reaches the top rank');
    assert.equal(everything.qa.getState().xp, xpOf(quests.map(q => q.id)));
    const full = chapters.filter(c => c.practice.length).length;
    assert.equal((everything.el('#content').innerHTML.match(/★ MASTERED/g) || []).length, full, 'a chapter with all its practice solved shows as mastered');
    /* Review drills are per concept: a practice mission never enters the pool. */
    assert.ok(!practice.some(q => everything.qa.pickReview().id === q.id));
  }
}

/* ---------- Drop-down menus: one per chapter in the campaign, the skill tree, the field guide and the artifacts ---------- */
{
  const KEY = 'vector-guild-save-v2', sid = REALM.saveId || REALM.id;
  const toggles = html => [...html.matchAll(/<button type="button" class="dd-toggle" id="([^"]+)" data-dd="([^"]+)" aria-expanded="(true|false)" aria-controls="([^"]+)">/g)].map(m => ({ id: m[1], key: m[2], open: m[3] === 'true', panel: m[4] }));
  const wellFormed = (html, view) => {
    const list = toggles(html);
    for (const t of list) {
      const panel = html.match(new RegExp(`<div class="dd-panel" id="${t.panel}" role="region" aria-labelledby="${t.id}"( hidden)?>`));
      assert.ok(panel, `${view}: drop-down ${t.key} controls a labelled panel`);
      assert.equal(!panel[1], t.open, `${view}: ${t.key} is ${t.open ? 'shown' : 'hidden'} exactly when aria-expanded says so`);
    }
    assert.equal(new Set(list.map(t => t.id)).size, list.length, `${view}: drop-down ids are unique`);
    assert.doesNotMatch(html, /<details class="sector chapter"/, `${view}: chapters are button drop-downs`);
    return list;
  };
  const fresh = boot(), home = wellFormed(fresh.el('#content').innerHTML, 'campaign');
  assert.equal(home.length, chapters.length, 'the campaign has one drop-down per chapter');
  assert.deepEqual(home.filter(t => t.open).map(t => t.key), ['campaign:0'], 'a new player sees only the first chapter open');
  for (const q of learn) assert.ok(fresh.el('#content').innerHTML.includes(`data-quest="${q.id}"`), `${q.id} is in the campaign list`);
  /* Only the chapter with the next unsolved learn mission starts open, whatever practice is left behind it. */
  const firstTwo = chapters[0].ids.concat(chapters[1].ids.slice(0, 1));
  const later = boot(new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [sid]: { solved: firstTwo, tools: [] } } })]]));
  const laterHome = later.el('#content').innerHTML;
  assert.deepEqual(wellFormed(laterHome, 'campaign').filter(t => t.open).map(t => t.key), ['campaign:1']);
  const c0 = chapters[0], count = laterHome.match(/data-dd="campaign:0".*?<span class="dd-count">(.*?)<\/span><span class="dd-bar/)[1];
  assert.ok(count.startsWith(`${c0.ids.length} / ${c0.ids.length} ${isLA ? 'complete' : 'learned'}${c0.practice.length ? ` · 0 / ${c0.practice.length} practice` : ''}`), `chapter 1 count reads "${count}"`);
  assert.match(laterHome, /data-dd="campaign:0".*?<span class="dd-bar dd-bar-learn" aria-hidden="true"><i style="width:100%"><\/i><\/span>/, 'a progress bar shows the learn share');
  for (const view of ['skills', 'guide', 'artifacts']) {
    const html = later.qa.show(view), list = wellFormed(html, view).filter(t => t.key.startsWith(view + ':'));
    if (view !== 'artifacts') assert.equal(list.length, chapters.length, `${view}: one drop-down per chapter`);
    else assert.equal(list.length, chapters.filter(c => c.ids.some(id => byId[id].artifact)).length, 'artifacts: one drop-down per chapter that has artifacts');
    assert.ok(list.filter(t => t.open).length <= 1, `${view}: at most one drop-down starts open`);
    if (view === 'skills') for (const q of learn) assert.ok(html.includes(`<button class="tree-node `) && html.includes(`data-quest="${q.id}"`), `${q.id} is in the skill tree`);
    if (view === 'guide') { assert.equal((html.match(/<span class="guide-id">/g) || []).length, learn.length, 'the field guide lists each concept once'); }
    if (view === 'artifacts') assert.equal((html.match(/<article class="card">/g) || []).length, quests.filter(q => q.artifact).length);
  }
  later.qa.show('campaign');
  if (chapters.length > 1 && chapters[0].ids.length > 1) {
    /* Finishing a chapter. The player looked into chapter 2 and closed it, then solved the last learn mission of
       chapter 1 from its open drop-down. When the dialog closes: chapter 2 is now the current chapter and opens
       (a remembered "closed" does not hide it), and chapter 1 stays open, so focus returns to the mission's card
       and the practice it unlocked is in view. */
    const last = chapters[0].ids[chapters[0].ids.length - 1], most = chapters[0].ids.slice(0, -1);
    const open = h => toggles(h.el('#content').innerHTML).filter(t => t.open).map(t => t.key), press = (h, key) => h.toggles().find(b => b.dataset.dd === key).onclick();
    const solveLast = h => { h.qa.mission(last); if (!h.qa.getMain().length) h.el('#ready').onclick(); h.qa.getMain().forEach((x, i) => x.value = String(byId[last].answer[i])); h.el('#submit-answer').onclick(); assert.ok(h.qa.getState().solved.includes(last), last + ' is solved'); h.closeDialog(); };
    const start = () => boot(new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [sid]: { solved: most, tools: [] } } })]]));
    const a = start(); assert.deepEqual(open(a), ['campaign:0']);
    press(a, 'campaign:1'); press(a, 'campaign:1'); a.qa.render(); assert.deepEqual(open(a), ['campaign:0'], 'chapter 2 was opened and closed again');
    a.focusOn(last, 'campaign:0'); solveLast(a);
    assert.deepEqual(wellFormed(a.el('#content').innerHTML, 'campaign').filter(t => t.open).map(t => t.key), ['campaign:0', 'campaign:1'], 'the finished chapter stays open and the new current chapter opens');
    press(a, 'campaign:1'); a.qa.render(); assert.deepEqual(open(a), ['campaign:0'], 'the player can still close the current chapter afterwards');
    press(a, 'campaign:0'); a.qa.render(); assert.deepEqual(open(a), [], 'and the finished one');
    /* Opened from somewhere that is not a drop-down (the next-mission button): only the default applies. */
    const b = start(); press(b, 'campaign:1'); press(b, 'campaign:1'); b.focusOn(null); solveLast(b);
    assert.deepEqual(open(b), ['campaign:1'], 'the chapter that becomes current opens even if it was closed by hand earlier');
    /* A chapter that was not just made current keeps what the player chose. */
    const c = start(); press(c, 'campaign:0'); c.qa.render(); assert.deepEqual(open(c), [], 'closing the current chapter is remembered');
  }
}

{
  /* A page that is still open (another tab, or restored from the back/forward cache) must not write its old
     copy over a save that was replaced meanwhile: it reloads instead. Its own saves and other realms' saves
     do not reload it. */
  const KEY = 'vector-guild-save-v2', id = REALM.saveId || REALM.id, other = id === 'la' ? 'found' : 'la';
  const firstId = quests[0].id, secondId = quests[1].id;
  const tab = boot(new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [id]: { solved: [firstId], tools: [] } } })]]));
  assert.equal(typeof tab.fire, 'function');
  tab.fire('pageshow', { persisted: false }); tab.fire('pageshow', { persisted: true }); tab.fire('storage', { key: KEY }); tab.fire('storage', { key: 'unrelated' });
  assert.equal(tab.page.reloads, 0, 'nothing changed in storage: no reload');
  const elsewhere = () => boot.storeOver(tab.storage);
  elsewhere().putRealm(other, { solved: ['q01'], tools: [] });
  tab.fire('storage', { key: KEY }); assert.equal(tab.page.reloads, 0, 'another realm\'s save does not reload this page');
  assert.equal(elsewhere().importAny({ v: 2, seed: 0, realms: { [id]: { solved: [firstId, secondId], tools: [] } } }).ok, true);
  tab.fire('storage', { key: 'unrelated' }); assert.equal(tab.page.reloads, 0);
  tab.fire('storage', { key: KEY }); assert.equal(tab.page.reloads, 1, 'a restored backup reloads the open realm page (storage event)');
  tab.fire('pageshow', { persisted: true }); assert.equal(tab.page.reloads, 2, 'and a page restored from the back/forward cache');
  tab.fire('storage', { key: null }); assert.equal(tab.page.reloads, 3, 'storage.clear() reports a null key');
  assert.deepEqual(Array.from(JSON.parse(tab.storage.get(KEY)).realms[id].solved), [firstId, secondId], 'the restored slice is still in storage');
  /* A changed seed alone also counts: the page's numbers would no longer match the save. */
  const seeded = boot(new Map([[KEY, JSON.stringify({ v: 2, seed: 0, intro: true, realms: { [id]: { solved: [], tools: [] } } })]]));
  const raw = JSON.parse(seeded.storage.get(KEY)); raw.seed = 12345; seeded.storage.set(KEY, JSON.stringify(raw));
  seeded.fire('pageshow', { persisted: true }); assert.equal(seeded.page.reloads, 1);
  /* A realm's own seed (a 1.x backup imported into an existing save) wins over the global seed, for that realm only. */
  const own = boot(new Map([[KEY, JSON.stringify({ v: 2, seed: 5, seeds: { la: 777 }, intro: true, realms: { [id]: { solved: [], tools: [] } } })]]));
  assert.equal(own.qa.getState().seed, id === 'la' ? 777 : 5, 'the realm page uses its own seed when the save has one');
  const gen = quests.find(q => curriculumWindow.Gen?.has(q.id) && (q.prereqs || []).length === 0);
  if (gen) { own.qa.mission(gen.id); assert.equal(own.qa.current().prompt, curriculumWindow.Gen.instance(gen, id === 'la' ? 777 : 5, 0).prompt, 'and its missions are built from that seed'); }
  assert.equal(JSON.parse(own.storage.get(KEY)).seeds.la, 777, 'saving progress keeps the seed override');
}

if (!isLA) {
  /* First solve of the first mission, with its answers typed the way a beginner might: thousands commas where they fit.
     No miss is logged, the first-try star is kept, and the celebration reads as a sentence (titles here are scenes,
     not parts: nothing is a "module" and nothing is "installed"). */
  const first = learn[0], run = boot();
  run.qa.mission(first.id); run.el('#ready').onclick();
  const grouped = x => Number.isInteger(x) && Math.abs(x) >= 1000 ? String(x).replace(/\B(?=(\d{3})+$)/g, ',') : String(x);
  assert.ok(first.answer.some(x => grouped(x).includes(',')), first.id + ' has an answer of 1000 or more, so this check types a comma');
  run.qa.getMain().forEach((x, i) => x.value = grouped(first.answer[i])); run.el('#submit-answer').onclick();
  assert.match(run.el('.feedback').textContent, /Mission complete/, 'a correct answer typed with a thousands comma is accepted');
  assert.equal(run.qa.getState().errors[first.id], undefined, 'and logs no miss'); assert.deepEqual(Array.from(run.qa.getState().clean), [first.id], 'and keeps the first-try star');
  const payoff = run.el('.feedback')._html.split('<svg')[0];
  assert.ok(payoff.includes('<h3>You learned: ' + first.topic + ' ✦</h3>'), 'the celebration heading names the concept');
  assert.doesNotMatch(payoff, /module|installed ✦|Design verified/, 'no linear algebra wording in the celebration');
  assert.ok(payoff.includes('That is right. ') && payoff.includes(first.sector + ' has a new part now, so we can '), 'the mentor line is a plain sentence');
  for (const q of learn) { const line = curriculumWindow.Outpost.consequence(q), head = curriculumWindow.Outpost.heading(q); assert.ok(!/module|undefined/.test(line + head) && line.includes(q.solution) && head.includes(q.topic), q.id + ': celebration text'); assert.ok(!line.includes(q.title.toLowerCase()) || q.solution.includes(q.title.toLowerCase()), q.id + ': the title is not lower-cased into the sentence'); }
  /* A wrong answer is still a miss, comma or not, and the field text has no jargon. */
  const miss = boot(); miss.qa.mission(first.id); miss.el('#ready').onclick();
  miss.qa.getMain().forEach(x => x.value = '9,999'); miss.el('#submit-answer').onclick();
  assert.equal(miss.qa.getState().errors[first.id]?.n, 1); assert.equal(miss.el('#answer-status-0').textContent, 'Try this one again');
  /* A review drill and the reward check after "Reveal solution" reject a neighbouring whole number. */
  const all = { v: 2, seed: 0, intro: false, realms: { [REALM.saveId]: { solved: quests.map(q => q.id), tools: [] } } };
  let wholeDrills = 0;
  for (const q of quests) {
    if (!curriculumWindow.Variants.has(q.id)) continue;
    const drill = boot(new Map([['vector-guild-save-v2', JSON.stringify(all)]]));
    drill.qa.review(q.id); const v = drill.qa.variant();
    if (!Number.isInteger(v.target)) continue;
    wholeDrills++;
    assert.doesNotMatch(drill.dc._html, /within 2%/, `${q.id}: a whole-number drill does not promise a 2% margin`); assert.match(drill.dc._html, /exact whole number/);
    drill.el('#review-answer').value = String(v.target + 1); drill.el('#review-check').onclick();
    assert.match(drill.el('#review-feedback').textContent, /^Not quite/, `${q.id}: ${v.target + 1} is not accepted for ${v.target}`);
    const slice = JSON.parse(drill.storage.get('vector-guild-save-v2')).realms[REALM.saveId];
    assert.ok(slice.errors?.[q.id], `${q.id}: the miss is logged in the notebook`);
  }
  assert.ok(wholeDrills > 0, 'the pack has whole-number drills to check');
}

{
  /* After "Reveal solution" the mission must come back as a different problem: two rolls can draw the same numbers,
     and the answer has just been shown. For every generated mission and many seeds, the roll chosen after a reveal
     never repeats the prompt, and repeats the answers only where the mission has few different answers. */
  const Gen = curriculumWindow.Gen, page = boot(), same = (a, b) => JSON.stringify(a.answer) === JSON.stringify(b.answer);
  const cases = []; for (const q of quests) if (Gen.has(q.id)) for (let seed = 1; seed <= 120; seed++) cases.push([q, seed]);
  if (!isLA) cases.push([byId.q08b, 4], [byId.q40d, 2], [byId.q40b, 18]); // identical consecutive rolls found in review
  let repeats = 0, plainNext = 0;
  for (const [q, seed] of cases) {
    const shown = Gen.instance(q, seed, 0); if (shown === q) continue;
    if (Gen.instance(q, seed, 1).prompt === shown.prompt) plainNext++;
    page.qa.setState({ seed, rolls: {} }); page.qa.nextRoll(q.id, shown);
    const roll = page.qa.roll(q.id), next = Gen.instance(q, seed, roll);
    assert.ok(Number.isInteger(roll) && roll >= 1 && roll <= 24, q.id + ' seed ' + seed + ': the roll moves on, within bounds');
    assert.notEqual(next.prompt, shown.prompt, q.id + ' seed ' + seed + ': the mission after a reveal is a different problem');
    if (same(next, shown)) { repeats++; let distinct = new Set(); for (let r = 1; r <= 24; r++) distinct.add(JSON.stringify(Gen.instance(q, seed, r).answer)); assert.ok(distinct.size < 5, q.id + ' seed ' + seed + ': the revealed answers come back although the mission has ' + distinct.size + ' different answers'); }
  }
  if (!isLA) assert.ok(plainNext >= 3, 'the plain next roll would have repeated the problem in the review cases');
  /* Through the page: reveal, reopen, and the problem on screen has changed; the save keeps one integer per mission. */
  const g = quests.find(q => Gen.has(q.id) && !(q.prereqs || []).length), ui = boot();
  ui.qa.setState({ seed: 4 }); ui.qa.mission(g.id); ui.el('#ready').onclick(); const shownPrompt = ui.qa.current().prompt;
  ui.el('#solution-btn').onclick(); assert.ok(ui.qa.roll(g.id) >= 1);
  ui.qa.mission(g.id); assert.notEqual(ui.qa.current().prompt, shownPrompt, 'reopening after a reveal gives a new problem');
  assert.ok(Number.isInteger(JSON.parse(ui.storage.get('vector-guild-save-v2')).realms[REALM.saveId || REALM.id].rolls[g.id]));
}

if (isLA) {
  // Review drill: a correct fresh-numbers answer is recorded once and pays no XP.
  const drill = boot(new Map([['vector-guild-save-v1', JSON.stringify({ solved: ['q01','q02','q03'], tools: [] })]]));
  const xpBefore = drill.qa.getState().xp; drill.qa.review();
  assert.match(drill.dc._html, /REVIEW DRILL/);
  console.log(`PASS: ${questCount}-mission teaching/guidance/schema/reachability audit; chapters, variants, contract board, economy and ranks; 68 interactive experiments and 3D/2D formulas; sourced lessons; outpost mentor; guided help; rewards/payoff; old and new save persistence/unlocks; import normalization.`);
  console.log(`NOTE: offline imports cannot authenticate an entirely forged closed completion list (${forged.solved.length}/${questCount} accepted; XP recomputed).`);
} else {
  console.log(`PASS: ${REALM.name} (${realm}): ${questCount}-mission teaching/guidance/schema/reachability audit (${learn.length} learn + ${practice.length} practice); declared chapters, sectors, tiers and ranks; ${REALM.sourceRule.label} sources; experiments and variants; narration; first-mission play-through with its own save slice; practice missions and drop-down menus.`);
  if (missing.length) console.log(`NOTE: ${missing.length} of ${declared.flatMap(c => c.ids).length} declared missions are not written yet: ${missing.join(' ')}. Run with --complete to require them.`);
  if (missingPractice.length) { const concepts = [...new Set(missingPractice.map(id => id.slice(0, 3)))]; console.log(`NOTE: ${missingPractice.length} of ${plannedPractice.length} planned practice missions are not written yet (${concepts.length} concepts: ${concepts[0]}${concepts.length > 1 ? '–' + concepts[concepts.length - 1] : ''}). Run with --complete-practice to require them.`); }
}
module.exports = { boot, realm, REALM, quests, byId, chapters, curriculumWindow };
