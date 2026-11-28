#!/usr/bin/env node
/* Scaffolds a new realm pack from one JSON spec (docs/PACK-SPEC.md):
     node tools/new-pack.js tools/packs/<id>.json             create every file of the pack and register it
     node tools/new-pack.js --print tools/packs/<id>.json     print the pack.js the spec gives, write nothing
     node tools/new-pack.js --remove tools/packs/<id>.json    undo a scaffold whose files are all still stubs
   Option: --root <dir>  the repository to write into (default: the one this file is in).
   What it writes, all from the spec:
     game/realms/<id>/pack.js                     window.REALM, in the shape of game/realms/calc1/pack.js
     game/realms/<id>/missions-a.js … -d.js, gen-a.js … gen-d.js, experiments-a.js … -d.js, variants-a.js … -d.js,
       practice-1.js … practice-8.js, glossary.js   stubs with their registration boilerplate
     qa/realms/<id>/oracle-a.js … -d.js, oracle-p1.js … oracle-p8.js, oracle-pack-checks.js   oracle stubs
     game/realms/packs.js                         the pack's VG_PACKS entry (its scripts in load order)
     game/realms/registry.js                      its star-map part: status 'ready', missions 160, learn 40, and
                                                  `ach`, the names of its two achievements
   It is idempotent: a file that is missing or empty is written; a file that already holds exactly what the spec
   gives is left as it is; a file with any other content is never overwritten (it is listed as kept, and the run
   ends with exit code 1 only for the two shared files, whose entries must match: when either clashes, nothing at
   all is written). Run it again after a change to
   the spec to add what is missing; to rewrite pack.js, look at --print and change the file by hand with the
   engine owner. No dependencies; Node 18 or later. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { GLYPHS, DEFAULTS } = require('./pack-glyphs.js');

/* ---------- the fixed shape every new pack has (docs/PACK-SPEC.md, "What is fixed") ---------- */
const SIZES = [6, 5, 6, 6, 6, 5, 6];
const TIERS = ['Basic', 'Basic', 'Intermediate', 'Intermediate', 'Intermediate', 'Advanced', 'Advanced'];
const TIER_XP = { Basic: 100, Intermediate: 150, Advanced: 200 };
const RANK_AT = [0, 8, 24, 44, 68, 96, 128, 144, 160], RANK_LEARN = [null, 4, 10, 16, 22, 28, 34, 40, null];
const LANDMARK_AT = [[45, 150], [120, 142], [215, 135], [279, 98], [335, 136], [440, 151], [488, 129]];
const LETTERS = ['a', 'b', 'c', 'd'], PRACTICE_FILES = 8, LEARN = 40;
const RESERVED = ['la', 'found', 'calc1'];
const COPY_KEYS = ['sceneLabel', 'homeEyebrow', 'homeTitle', 'firstVisit', 'allDone', 'beginFirst', 'missionNoun', 'chaptersNote', 'guideNoun'];
const PANEL_KEYS = ['skills', 'visual'];
const qid = i => 'q' + String(i).padStart(2, '0');

class SpecError extends Error {}
const need = (ok, message) => { if (!ok) throw new SpecError(message); };
const isText = v => typeof v === 'string' && v.trim() !== '';
const unsafe = html => /<\s*script|\son[a-z]+\s*=|javascript:|<\s*iframe|<\s*object/i.test(html);

/* ---------- the spec ---------- */
function normalize(raw) {
  need(raw && typeof raw === 'object' && !Array.isArray(raw), 'the spec is a JSON object');
  const s = JSON.parse(JSON.stringify(raw));
  need(typeof s.id === 'string' && /^[a-z][a-z0-9]{1,11}$/.test(s.id), 'id: 2 to 12 lowercase letters and digits, starting with a letter (it is the save key and the URL, and never changes)');
  for (const k of ['name', 'short', 'description']) need(isText(s[k]), k + ': required text');
  s.saveId = s.saveId === undefined ? s.id : s.saveId;
  need(typeof s.saveId === 'string' && /^[a-z][a-z0-9]{1,11}$/.test(s.saveId), 'saveId: like id (default: the id); it never changes once players have saves');
  s.pageTitle = s.pageTitle === undefined ? 'MathCosmos — ' + s.name : s.pageTitle;
  need(isText(s.pageTitle), 'pageTitle: text');
  s.about = s.about === undefined ? null : s.about;
  need(s.about === null || isText(s.about), 'about: text for the comment at the top of pack.js');
  /* chapters */
  need(Array.isArray(s.chapters) && s.chapters.length === SIZES.length, `chapters: exactly ${SIZES.length} chapters`);
  let next = 1;
  s.chapters = s.chapters.map((c, i) => {
    const where = `chapters[${i}]`;
    need(c && isText(c.name) && isText(c.blurb), where + ': name and blurb');
    const tier = c.tier === undefined ? TIERS[i] : c.tier;
    need(Object.prototype.hasOwnProperty.call(TIER_XP, tier), where + '.tier: Basic, Intermediate or Advanced');
    let ids = c.ids;
    if (ids === undefined) { const size = c.size === undefined ? SIZES[i] : c.size; need(Number.isInteger(size) && size >= 5 && size <= 6, where + '.size: 5 or 6'); ids = Array.from({ length: size }, (_, k) => qid(next + k)); }
    need(Array.isArray(ids) && ids.length >= 5 && ids.length <= 6, where + '.ids: five or six learn ids');
    ids.forEach((id, k) => need(id === qid(next + k), `${where}.ids: the learn ids run in order from q01 (expected ${qid(next + k)}, found ${id})`));
    next += ids.length;
    const sector = c.sector || {};
    need(isText(sector.name) && isText(sector.purpose), where + '.sector: name and purpose (the purpose completes "we have to …")');
    const lm = c.landmark || {};
    need(isText(lm.name), where + '.landmark.name: text');
    const glyph = lm.art !== undefined ? null : (lm.glyph === undefined ? DEFAULTS[i] : lm.glyph);
    need(glyph === null || Object.prototype.hasOwnProperty.call(GLYPHS, glyph), `${where}.landmark.glyph: one of ${Object.keys(GLYPHS).join(', ')}`);
    const art = lm.art !== undefined ? lm.art : GLYPHS[glyph];
    need(isText(art) && !unsafe(art) && !/<\s*text|\sid\s*=/.test(art), where + '.landmark.art: SVG shapes only (no script, handler, text or id)');
    const at = lm.at === undefined ? LANDMARK_AT[i] : lm.at;
    need(Array.isArray(at) && at.length === 2 && at.every(Number.isFinite), where + '.landmark.at: [x, y]');
    return { name: c.name, blurb: c.blurb, tier, ids, sector: { name: sector.name, purpose: sector.purpose }, landmark: { name: lm.name, at, art, glyph } };
  });
  need(next - 1 === LEARN, `chapters: ${LEARN} learn missions in all (found ${next - 1})`);
  need(new Set(s.chapters.map(c => c.sector.name)).size === s.chapters.length, 'chapters: every sector has its own name');
  need(s.chapters.every((c, i) => i === 0 || Object.keys(TIER_XP).indexOf(c.tier) >= Object.keys(TIER_XP).indexOf(s.chapters[i - 1].tier)), 'chapters: tiers never go down');
  /* concepts: optional topic notes for the stubs */
  s.concepts = s.concepts || {};
  need(typeof s.concepts === 'object' && !Array.isArray(s.concepts) && Object.entries(s.concepts).every(([k, v]) => /^q\d{2}$/.test(k) && Number(k.slice(1)) >= 1 && Number(k.slice(1)) <= LEARN && isText(v)), 'concepts: { "q01": "topic", … } for q01–q40');
  s.landmarkCost = s.landmarkCost === undefined ? 4 : s.landmarkCost;
  need(Number.isInteger(s.landmarkCost) && s.landmarkCost > 0, 'landmarkCost: a positive whole number');
  need(Array.isArray(s.ranks) && s.ranks.length === RANK_AT.length && s.ranks.every(isText) && new Set(s.ranks).size === s.ranks.length, `ranks: ${RANK_AT.length} different titles, lowest first`);
  /* source rule */
  const src = s.source || {};
  need(isText(src.pattern) && isText(src.label), 'source: pattern and label (for example "OpenStax", or "Judson" with label "Judson, Abstract Algebra")');
  src.flags = src.flags === undefined ? '' : src.flags;
  need(/^[imsu]*$/.test(src.flags), 'source.flags: any of i, m, s, u');
  try { new RegExp(src.pattern, src.flags); } catch (e) { throw new SpecError('source.pattern: not a regular expression: ' + e.message); }
  for (const k of ['book', 'url', 'example']) need(src[k] === undefined || isText(src[k]), 'source.' + k + ': text');
  need(src.example === undefined || new RegExp(src.pattern, src.flags).test(src.example), 'source.example: a source title that the pattern matches');
  s.source = src;
  /* mentor */
  const m = s.mentor || {};
  for (const k of ['name', 'role', 'cardEyebrow', 'opening', 'closing']) need(isText(m[k]), 'mentor.' + k + ': text');
  const unknown = (m.opening.match(/\{[^}]*\}/g) || []).filter(p => !['{purpose}', '{title}', '{brief}', '{topic}', '{topic.lower}'].includes(p));
  need(!unknown.length, 'mentor.opening: unknown placeholder ' + unknown.join(' ') + ' (use {purpose}, {title}, {brief}, {topic}, {topic.lower})');
  /* copy */
  const copy = s.copy || {};
  for (const k of COPY_KEYS) need(isText(copy[k]) && !unsafe(copy[k]), 'copy.' + k + ': text');
  for (const k of PANEL_KEYS) for (const f of ['eyebrow', 'title', 'text']) need(isText(copy[k] && copy[k][f]), `copy.${k}.${f}: text`);
  /* help: full HTML, or the standard help built from a few lines */
  if (s.help === undefined || typeof s.help === 'object') {
    const h = s.help || {};
    for (const k of ['eyebrow', 'title', 'intro']) need(isText(h[k]), 'help.' + k + ': text (or give help as the whole HTML string)');
    need(h.answers === undefined || isText(h.answers), 'help.answers: text');
    s.help = standardHelp(h);
  }
  need(isText(s.help) && !unsafe(s.help), 'help: HTML without scripts or handlers');
  /* the two achievements */
  const a = s.achievements || {};
  need(isText(a.done) && isText(a.master) && a.done.length <= 28 && a.master.length <= 28, 'achievements: done and master, names of at most 28 characters');
  a.doneReward = a.doneReward === undefined ? 150 : a.doneReward;
  need(Number.isInteger(a.doneReward) && a.doneReward >= 15 && a.doneReward <= 150, 'achievements.doneReward: 15 to 150');
  need(('Solve every mission in ' + s.short + ', practice included.').length <= 60, 'short: at most 17 characters, so "Solve every mission in <short>, practice included." fits on the card');
  s.achievements = a;
  /* glossary: optional starting list of the words the pack must define */
  s.glossaryRequired = s.glossaryRequired || [];
  need(Array.isArray(s.glossaryRequired) && s.glossaryRequired.every(isText), 'glossaryRequired: a list of terms');
  /* registry: which star-map part this pack is */
  if (s.registry === false) s.registry = null;
  else {
    const r = s.registry || {};
    s.registry = { part: r.part === undefined ? s.id : r.part, node: r.node === undefined ? null : r.node };
    need(s.registry.part === s.id, 'registry.part: the part id is the pack id');
    need(s.registry.node === null || isText(s.registry.node), 'registry.node: a node id, only to add a part the registry does not have yet');
  }
  /* Spec text also goes into comments of the generated files. */
  need(!JSON.stringify(raw).includes('*/'), 'the spec contains "*/", which would end a comment in the generated files');
  return s;
}
function standardHelp(h) {
  return `<div class="eyebrow">${h.eyebrow}</div><h2>${h.title}</h2><p>${h.intro}</p><div class="mission-panel"><h3>HOW THE OUTPOST WORKS</h3><p>01 / Read the lesson and the worked example, then choose “I’m ready to try.” You can open the lesson again at any time.<br>02 / Answers are numbers, never formulas. Type them without commas or spaces (1250, not 1,250). Decimals such as 2.5 and fractions such as 7/6 or 1 1/2 work. When an answer must be rounded, the mission says how.${h.answers ? ' ' + h.answers : ''}<br>03 / Hints and guided steps are free and still earn the full reward. Your first solve of a mission earns XP and one skill point; every 300 XP is a level. A solve on the first check with no help also earns a ★.<br>04 / Missions open when the missions they build on are done. A chapter is complete when every concept in it is learned; that unlocks a landmark for the outpost, bought with skill points.<br>05 / Review drills ask a solved idea again with new numbers, spaced further apart each time you pass. Misses go into the error notebook at the top of the field guide.<br>06 / Each concept has one learn mission and up to three practice missions, marked B, C and D: the same skill in a new setting, a word problem with two or three steps, and a challenge. Practice opens when you solve the learn mission. It is optional, and it earns XP, skill points and stardust like any mission.</p></div><p>Progress is saved in this browser only. Use settings to export a backup or import it on another device.</p>`;
}

/* ---------- writing JavaScript ---------- */
const str = v => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
const tpl = v => String(v).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const list = xs => '[' + xs.map(str).join(', ') + ']';
/* A compact literal in the style of game/realms/registry.js: unquoted keys, single-quoted strings. */
function lit(v) {
  if (Array.isArray(v)) return '[' + v.map(lit).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : str(k)) + ':' + lit(x)).join(',') + '}';
  return typeof v === 'string' ? str(v) : String(v);
}
const regexLiteral = (pattern, flags) => '/' + pattern.replace(/(^|[^\\])\//g, '$1\\/') + '/' + flags;
function opening(text) {
  return '`' + tpl(text).replace(/\{purpose\}/g, '${purpose}').replace(/\{title\}/g, '${q.title}').replace(/\{brief\}/g, '${q.brief}').replace(/\{topic\.lower\}/g, '${q.topic.toLowerCase()}').replace(/\{topic\}/g, '${q.topic}') + '`';
}
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => qid(from + i));
/* File a covers q01–q10, b q11–q20, c q21–q30, d q31–q40; practice file N covers q(5N−4)–q(5N). */
const letterIds = k => range(10 * k + 1, 10 * k + 10);
const practiceIds = N => range(5 * N - 4, 5 * N);
const chapterOf = (s, id) => s.chapters.findIndex(c => c.ids.includes(id));

function renderPack(s) {
  const tiersLine = (() => { const by = {}; s.chapters.forEach((c, i) => { (by[c.tier] = by[c.tier] || []).push(i + 1); }); return Object.entries(by).map(([t, ch], i) => `${i ? '' : ch.length > 1 ? 'chapters ' : 'chapter '}${ch.length > 1 ? ch[0] + '–' + ch[ch.length - 1] : ch[0]} ${t} (${TIER_XP[t]} XP)`).join(', '); })();
  const ranks = s.ranks.map((title, i) => `{ at: ${RANK_AT[i]}, ${RANK_LEARN[i] !== null ? `learnAt: ${RANK_LEARN[i]}, ` : ''}title: ${str(title)}${i === s.ranks.length - 1 ? ', top: true' : ''} }`);
  const c = s.copy;
  const about = s.about ? s.about.trim().split('\n').map((l, i) => (i ? '   ' : '/* ') + l).join('\n') + '\n   ' : '/* ';
  return `${about}${s.name} realm (pack "${s.id}"). Written by tools/new-pack.js from tools/packs/${s.id}.json; fields: docs/PACK-FORMAT.md §9.
   Learn missions use local ids q01–q40, one per concept; the chapters below fix which id teaches what.
   Each concept also has practice missions q01b, q01c, q01d ... (docs/PACK-FORMAT.md, "Practice missions").
   Content authors do not edit this file, except to correct a chapter's mission list with the engine owner. */
window.REALM = {
 id: ${str(s.id)},
 name: ${str(s.name)},
 saveId: ${str(s.saveId)},
 pageTitle: ${str(s.pageTitle)},
 description: ${str(s.description)},
 /* Declared chapters, in campaign order. Tiers: ${tiersLine}. */
 chapters: [
${s.chapters.map(ch => `  { name: ${str(ch.name)}, tier: ${str(ch.tier)}, blurb: ${str(ch.blurb)}, ids: ${list(ch.ids)} }`).join(',\n')}
 ],
 /* Practice missions: the letter that follows the learn id, and the kind of practice it is. Every concept is
    planned to have one of each, so the full pack is 40 learn + 120 practice = 160 missions. Practice is optional:
    a chapter is complete when its learn missions are solved, and mastered when its practice is solved as well. */
 practice: { kinds: { b: 'setting', c: 'applied', d: 'challenge' } },
 /* Sector i is the place in the outpost where chapter i's missions happen; a mission's \`sector\` is one of these names. */
 sectors: [
${s.chapters.map(ch => `  { name: ${str(ch.sector.name)}, purpose: ${str(ch.sector.purpose)} }`).join(',\n')}
 ],
 landmarks: [
${s.chapters.map(ch => `  { name: ${str(ch.landmark.name)}, at: [${ch.landmark.at.join(', ')}], art: ${str(ch.landmark.art)} }`).join(',\n')}
 ],
 landmarkCost: ${s.landmarkCost},
 /* Ranks count every solved mission, learn and practice; the top rank needs all 160. While some missions are still
    unwritten, the engine scales these steps down to the missions that exist (app.js, "ranks"). learnAt is a number of
    concepts learned that also holds the rank, so learn missions alone climb the ladder (the same steps as
    Foundations). The top rank has no learnAt: it needs every mission. */
 ranks: [
  ${ranks.slice(0, 4).join(', ')},
  ${ranks.slice(4, 7).join(', ')},
  ${ranks.slice(7).join(', ')}
 ],
 tiers: ['Basic', 'Intermediate', 'Advanced'],
 /* Every mission's xp is fixed by its tier (checked by qa/harness.js). */
 tierXp: { Basic: 100, Intermediate: 150, Advanced: 200 },
 /* Every mission cites at least one source whose title matches publisherPattern${s.source.book ? ` (${s.source.book.replace(/\*\//g, '* /')})` : ''}; qa/harness.js checks it. */
 sourceRule: { publisherPattern: ${regexLiteral(s.source.pattern, s.source.flags)}, label: ${str(s.source.label)} },
 features: { workshop: false, contracts: false, board: false, docking: false, handson: false, labs: ['concept'] },
 mentor: {
  name: ${str(s.mentor.name)}, role: ${str(s.mentor.role)}, cardEyebrow: ${str(s.mentor.cardEyebrow)},
  opening: (q, purpose) => ${opening(s.mentor.opening)},
  closing: ${str(s.mentor.closing)}
 },
 copy: {
${COPY_KEYS.slice(0, 8).map(k => `  ${k}: ${str(c[k])},`).join('\n')}
  skills: { eyebrow: ${str(c.skills.eyebrow)}, title: ${str(c.skills.title)}, text: ${str(c.skills.text)} },
  guideNoun: ${str(c.guideNoun)},
  /* The celebration after a first solve. Mission titles here are scenes, not parts, so nothing is "installed". */
  heading: q => \`You learned: \${q.topic} ✦\`,
  consequence: (q, purpose) => \`That is right. \${q.solution} \${q.sector} has a new part now, so we can \${purpose}.\`,
  visual: { eyebrow: ${str(c.visual.eyebrow)}, title: ${str(c.visual.title)}, text: ${str(c.visual.text)} }
 },
 help: ${str(s.help)}
};
`;
}

/* ---------- the stubs ---------- */
function topicLines(s, ids, indent) {
  return ids.map(id => { const ch = chapterOf(s, id), c = s.chapters[ch]; return `${indent}${id}  ch ${ch + 1} ${c.name} · ${c.tier}, ${TIER_XP[c.tier]} XP · sector '${c.sector.name}'${s.concepts[id] ? ' · ' + s.concepts[id] : ''}`; }).join('\n');
}
function stubs(s) {
  const out = {}, g = `game/realms/${s.id}/`, qa = `qa/realms/${s.id}/`, N = s.name;
  const book = s.source.book || s.source.label, example = s.source.example ? `\n   A title reads like: ${s.source.example}` : '';
  const url = s.source.url ? `\n   Link to the section page itself: ${s.source.url}` : '';
  LETTERS.forEach((L, k) => {
    const ids = letterIds(k), span = `${ids[0]}–${ids[ids.length - 1]}`;
    out[g + `missions-${L}.js`] = `/* ${N} missions, file ${L}: ${span}. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-${L}.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-${L}.js; drill statements: variants-${L}.js; oracles:
   ${qa}oracle-${L}.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
${topicLines(s, ids, '     ')} */
(function(){
'use strict';
/* ${book} sections, one entry per section the missions below cite. Open each page before you set \`verified\` to the
   date you saw it. Every mission needs at least one source whose title matches ${regexLiteral(s.source.pattern, s.source.flags)} (${s.source.label}).${example}${url} */
const source = {
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
);
})();
`;
    out[g + `gen-${L}.js`] = `/* ${N} mission generators, file ${L}: ${span}. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-${L}.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
});
})();
`;
    out[g + `experiments-${L}.js`] = `/* ${N} concept-bench experiments, file ${L}: ${span}. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-${L}.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-${L}.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
});
})();
`;
    out[g + `variants-${L}.js`] = `/* ${N} review-drill statements, file ${L}: ${span}. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-${L}.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
`;
    out[qa + `oracle-${L}.js`] = `/* Independent oracles for ${N} learn missions, file ${L}: ${span} (game/realms/${s.id}/missions-${L}.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
});
})();
`;
  });
  for (let N2 = 1; N2 <= PRACTICE_FILES; N2++) {
    const ids = practiceIds(N2), all = ids.flatMap(id => ['b', 'c', 'd'].map(l => id + l));
    out[g + `practice-${N2}.js`] = `/* ${N} practice missions, file ${N2} of ${PRACTICE_FILES}: concepts ${ids[0]}–${ids[ids.length - 1]}, three practice missions each
   (${all.join(' ')}).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional \`uses: 'qNN'\`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and \`uses\` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: ${qa}oracle-p${N2}.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

${ids.map(id => `/* ---- ${id}${s.concepts[id] ? ' ' + s.concepts[id].replace(/\*\//g, '* /') : ''} ---- */\n`).join('\n')}
})();
`;
    out[qa + `oracle-p${N2}.js`] = `/* Independent oracles for ${N} practice missions, file ${N2} of ${PRACTICE_FILES}: ${all[0]}–${all[all.length - 1]} (game/realms/${s.id}/practice-${N2}.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
});
})();
`;
  }
  out[qa + 'oracle-pack-checks.js'] = `/* Content checks for the ${N} pack that only this pack needs. This file registers no oracle.
   The rules every pack after Foundations shares (tolerance against the answer's precision, "+ 0", a written-out
   coefficient 1, "1 seconds", "without commas", hints that state an answer, drills that accept a neighbour, ranks)
   are in qa/pack-checks.js, which qa/generators.js runs for this pack as well. Add a rule here when a review finds a
   defect in one mission that the shared rules cannot see; name the defect. Any failure throws, which fails
   \`node qa/generators.js --realm ${s.id}\`. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN } = window;
const problems = [], fail = text => { if (problems.length < 20 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
for (const q of QUESTS) {
  if (!MISSION_GEN[q.id]) continue;
  for (let roll = 1; roll <= DRAWS; roll++) {
    const m = Gen.instance(q, SEED, roll); if (m === q) continue;
    /* const p = m.params, where = \`\${q.id} params \${JSON.stringify(p)}\`;
       if (q.id === 'q01' && <defect>) fail(\`\${where}: <what is wrong>\`); */
  }
}
if (problems.length) throw new Error(\`${N.replace(/[`\\$]/g, '')} pack checks failed (qa/realms/${s.id}/oracle-pack-checks.js):\\n  - \${problems.join('\\n  - ')}\`);
})();
`;
  out[g + 'glossary.js'] = `/* ${N} glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P[${str(s.id)}] = {
 required: ${list(s.glossaryRequired)},
 terms: [
  /* q01–q10 (missions-a.js) */
  /* q11–q20 (missions-b.js) */
  /* q21–q30 (missions-c.js) */
  /* q31–q40 (missions-d.js) */
 ]
};
})();
`;
  /* pack.js last, so it is in the order the pack loads */
  return Object.assign({ [g + 'pack.js']: renderPack(s) }, out);
}

/* ---------- the shared files ---------- */
function packEntry(s) {
  const g = `realms/${s.id}/`;
  return [g + 'pack.js', ...LETTERS.map(L => g + `missions-${L}.js`), 'gen-core.js', ...LETTERS.map(L => g + `gen-${L}.js`), 'gameplay.js',
    ...LETTERS.map(L => g + `experiments-${L}.js`), ...LETTERS.map(L => g + `variants-${L}.js`), ...Array.from({ length: PRACTICE_FILES }, (_, i) => g + `practice-${i + 1}.js`),
    'variants.js', 'concept-lab.js', 'chapters.js', 'skip.js', g + 'glossary.js', 'glossary.js'];
}
const packBlock = s => ` ${s.id}: {\n  title: ${str(s.name)},\n  styles: ['styles.css', 'update.css'],\n  scripts: ${list(packEntry(s))}\n }`;
const part = s => ({ id: s.id, name: s.name, status: 'ready', missions: 160, learn: 40, ach: Object.assign({ short: s.short, done: s.achievements.done, master: s.achievements.master }, s.achievements.doneReward !== 150 ? { doneReward: s.achievements.doneReward } : {}) });
const evalPacks = text => { const w = {}; vm.runInNewContext(text, { window: w }); return JSON.parse(JSON.stringify(w.VG_PACKS)); };
const evalRegistry = text => { const w = {}; vm.runInNewContext(text, { window: w }); return JSON.parse(JSON.stringify(w.VG_REALMS)); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/* The literal of one part inside registry.js: {id:'<id>', … } (parts hold no nested arrays; ach is one flat object). */
const partRe = id => new RegExp(`\\{id:'${id}',(?:[^{}]|\\{[^{}]*\\})*\\}`);

function addPackEntry(text, s) {
  const packs = evalPacks(text), want = { title: s.name, styles: ['styles.css', 'update.css'], scripts: packEntry(s) };
  if (Object.prototype.hasOwnProperty.call(packs, s.id)) return same(packs[s.id], want) ? { text, state: 'unchanged' } : { text, state: 'conflict', why: `VG_PACKS.${s.id} exists with other scripts or title` };
  for (const [id, p] of Object.entries(packs)) if ((p.scripts || []).includes(`realms/${s.id}/pack.js`)) return { text, state: 'conflict', why: `VG_PACKS.${id} already loads realms/${s.id}/` };
  const start = text.indexOf('window.VG_PACKS = {'), end = text.indexOf('\n};', start);
  if (start < 0 || end < 0 || !/\n \}$/.test(text.slice(0, end))) return { text, state: 'conflict', why: 'game/realms/packs.js does not end its VG_PACKS block the usual way (" }" then "};")' };
  const out = text.slice(0, end) + ',\n' + packBlock(s) + text.slice(end);
  if (!same(evalPacks(out)[s.id], want)) return { text, state: 'conflict', why: 'the new VG_PACKS entry did not read back' };
  return { text: out, state: 'written' };
}
function removePackEntry(text, s) {
  const block = ',\n' + packBlock(s);
  if (!text.includes(block)) return Object.prototype.hasOwnProperty.call(evalPacks(text), s.id) ? { text, state: 'conflict', why: `VG_PACKS.${s.id} is not the entry this spec gives` } : { text, state: 'unchanged' };
  return { text: text.replace(block, ''), state: 'removed' };
}
function setPart(text, s) {
  if (!s.registry) return { text, state: 'skipped' };
  const realms = evalRegistry(text), want = part(s);
  let found = null; for (const node of realms) for (const p of node.parts || []) if (p.id === s.id) found = { node, p };
  if (found && found.p.status === 'ready') return same(found.p, want) ? { text, state: 'unchanged' } : { text, state: 'conflict', why: `the registry part ${s.id} is already ready with other data` };
  let out;
  if (found) out = text.replace(partRe(s.id), lit(want));
  else {
    if (!s.registry.node) return { text, state: 'conflict', why: `the registry has no part ${s.id}; name the node to add it to in registry.node` };
    if (!realms.some(r => r.node === s.registry.node)) return { text, state: 'conflict', why: `the registry has no node ${s.registry.node}` };
    const at = text.indexOf(`{node:'${s.registry.node}',`), open = text.indexOf('parts:[', at), close = text.indexOf(']', open);
    if (at < 0 || open < 0 || close < 0) return { text, state: 'conflict', why: `node ${s.registry.node} is not written the usual way in registry.js` };
    out = text.slice(0, close) + (close > open + 7 ? ',' : '') + lit(want) + text.slice(close);
  }
  const back = evalRegistry(out); let got = null; for (const node of back) for (const p of node.parts || []) if (p.id === s.id) got = p;
  if (!same(got, want) || back.length !== realms.length) return { text, state: 'conflict', why: 'the registry part did not read back' };
  if (found && found.p.name !== s.name) console.log(`note: the registry part ${s.id} was named "${found.p.name}"; it is now "${s.name}", the spec's name`);
  return { text: out, state: 'written' };
}
function unsetPart(text, s) {
  if (!s.registry) return { text, state: 'skipped' };
  const want = part(s), m = text.match(partRe(s.id));
  if (!m) return { text, state: 'unchanged' };
  if (m[0] !== lit(want)) return /status:'ready'/.test(m[0]) ? { text, state: 'conflict', why: `the registry part ${s.id} is not the one this spec gives` } : { text, state: 'unchanged' };
  if (s.registry.node) { const i = text.indexOf(m[0]), before = text[i - 1] === ',' ? i - 1 : i, after = text[i - 1] === ',' ? i + m[0].length : i + m[0].length + (text[i + m[0].length] === ',' ? 1 : 0); return { text: text.slice(0, before) + text.slice(after), state: 'removed' }; }
  return { text: text.replace(m[0], lit({ id: s.id, name: s.name, status: 'coming' })), state: 'removed' };
}

/* ---------- running it ---------- */
const empty = f => !fs.existsSync(f) || fs.readFileSync(f, 'utf8').trim() === '';
function scaffold(spec, root, log = console.log) {
  const s = normalize(spec), files = stubs(s), report = { written: [], unchanged: [], kept: [], conflicts: [] };
  const packsFile = path.join(root, 'game/realms/packs.js'), regFile = path.join(root, 'game/realms/registry.js');
  for (const [p, other] of Object.entries(evalPacks(fs.readFileSync(packsFile, 'utf8')))) if (p !== s.id && ((other.scripts || []).length) && evalSaveId(root, p) === s.saveId) report.conflicts.push(`saveId ${s.saveId} is already used by the pack ${p}`);
  if (RESERVED.includes(s.id)) report.conflicts.push(`${s.id} is one of the three 2.5 packs; use --print to compare its spec`);
  if (report.conflicts.length) return report;
  /* The two shared files are worked out first: if either clashes, nothing at all is written. */
  const shared = [[packsFile, addPackEntry, 'game/realms/packs.js'], [regFile, setPart, 'game/realms/registry.js']].map(([file, step, rel]) => [file, step(fs.readFileSync(file, 'utf8'), s), rel]);
  for (const [, r, rel] of shared) if (r.state === 'conflict') report.conflicts.push(rel + ': ' + r.why);
  if (report.conflicts.length) return report;
  for (const [rel, text] of Object.entries(files)) {
    const f = path.join(root, rel);
    if (empty(f)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); report.written.push(rel); }
    else if (fs.readFileSync(f, 'utf8') === text) report.unchanged.push(rel);
    else report.kept.push(rel);
  }
  for (const [file, r, rel] of shared) {
    if (r.state === 'written') { fs.writeFileSync(file, r.text); report.written.push(rel); }
    else if (r.state === 'unchanged') report.unchanged.push(rel);
  }
  return report;
}
function evalSaveId(root, id) {
  const f = path.join(root, 'game/realms', id, 'pack.js');
  if (!fs.existsSync(f)) return id;
  try { const w = {}; vm.runInNewContext(fs.readFileSync(f, 'utf8'), { window: w }); return (w.REALM && (w.REALM.saveId || w.REALM.id)) || id; } catch (e) { return id; }
}
function remove(spec, root) {
  const s = normalize(spec), files = stubs(s), report = { removed: [], unchanged: [], kept: [], conflicts: [] };
  for (const [rel, text] of Object.entries(files)) { const f = path.join(root, rel); if (fs.existsSync(f) && fs.readFileSync(f, 'utf8') !== text && fs.readFileSync(f, 'utf8').trim() !== '') report.kept.push(rel); }
  for (const dir of [`game/realms/${s.id}`, `qa/realms/${s.id}`]) { const d = path.join(root, dir); if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (!Object.prototype.hasOwnProperty.call(files, dir + '/' + f)) report.kept.push(dir + '/' + f); }
  if (report.kept.length) { report.conflicts.push('these files hold work that is not a stub, so nothing was removed: ' + report.kept.join(', ')); return report; }
  const packsFile = path.join(root, 'game/realms/packs.js'), regFile = path.join(root, 'game/realms/registry.js');
  const steps = [[packsFile, removePackEntry, 'game/realms/packs.js'], [regFile, unsetPart, 'game/realms/registry.js']].map(([file, step, rel]) => [file, step(fs.readFileSync(file, 'utf8'), s), rel]);
  for (const [, r, rel] of steps) if (r.state === 'conflict') report.conflicts.push(rel + ': ' + r.why);
  if (report.conflicts.length) return report;
  for (const [file, r, rel] of steps) if (r.state === 'removed') { fs.writeFileSync(file, r.text); report.removed.push(rel); }
  for (const rel of Object.keys(files)) { const f = path.join(root, rel); if (fs.existsSync(f)) { fs.unlinkSync(f); report.removed.push(rel); } }
  for (const dir of [`game/realms/${s.id}`, `qa/realms/${s.id}`]) { const d = path.join(root, dir); if (fs.existsSync(d) && !fs.readdirSync(d).length) fs.rmdirSync(d); }
  return report;
}
module.exports = { normalize, renderPack, stubs, packEntry, part, scaffold, remove, SpecError, GLYPHS, RANK_AT, RANK_LEARN };

if (require.main === module) {
  const args = process.argv.slice(2), flag = f => { const i = args.indexOf(f); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const rootAt = args.indexOf('--root'); let root = path.resolve(__dirname, '..');
  if (rootAt >= 0) { root = path.resolve(args[rootAt + 1]); args.splice(rootAt, 2); }
  const print = flag('--print'), undo = flag('--remove');
  if (args.length !== 1) { console.error('usage: node tools/new-pack.js [--print | --remove] [--root <dir>] tools/packs/<id>.json'); process.exit(2); }
  let spec;
  try { spec = JSON.parse(fs.readFileSync(args[0], 'utf8')); } catch (e) { console.error('FAIL: cannot read the spec ' + args[0] + ': ' + e.message); process.exit(2); }
  try {
    if (print) { process.stdout.write(renderPack(normalize(spec))); process.exit(0); }
    const r = undo ? remove(spec, root) : scaffold(spec, root);
    for (const k of ['written', 'removed', 'unchanged', 'kept']) if (r[k] && r[k].length) console.log(`${k} (${r[k].length}): ${r[k].join(' ')}`);
    if (r.kept && r.kept.length && !undo) console.log('kept files already hold other content and were not overwritten.');
    if (r.conflicts.length) { console.log('FAIL:\n  - ' + r.conflicts.join('\n  - ')); process.exit(1); }
    const id = spec.id;
    if (!undo) console.log(`OK: pack ${id} is scaffolded. Next: node qa/harness.js --realm ${id} (unwritten missions are NOTEs), then node tools/build-sw.js.`);
    else console.log(`OK: pack ${id} is removed. Run node tools/build-sw.js.`);
  } catch (e) { if (e instanceof SpecError) { console.error('FAIL: spec ' + args[0] + ': ' + e.message); process.exit(2); } throw e; }
}
