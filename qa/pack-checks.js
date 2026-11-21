/* Content checks that every new realm pack gets, beyond the generator and oracle checks of qa/generators.js.
   qa/generators.js loads this file after the pack and its oracles for every pack except linear algebra (which keeps
   its 1.4.1 checks) and Foundations (whose own qa/realms/found/oracle-pack-checks.js holds the same rules together
   with its mission-specific ones; these were taken from there). Any failure throws, which fails
   `node qa/generators.js --realm <id>`. A pack adds its own mission-specific rules in
   qa/realms/<id>/oracle-pack-checks.js. Each check names the defect it guards against. Draws use their own seed. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN, EXPERIMENTS, Variants, REALM } = window;
const problems = [];
/* At most three reports per mission, so one defect does not hide the others. */
const seen = {};
const fail = text => { const id = text.split(/[ :]/)[0]; seen[id] = (seen[id] || 0) + 1; if (seen[id] <= 3 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
/* "1" followed by a plural counting noun; not after a digit, a point or a slash ("21 tiles"), and not the end of a letter expression ("x + 1 dollars"). */
const ONE_PLURAL = /(?<![\d.,\/]|[a-z)] [+−] )\b1 (?:ones|tens|hundreds|thousands|degrees|pieces|blocks|squares|metres|kilometres|centimetres|seconds|minutes|hours|days|weeks|years|parts|units|steps|litres|tiles|seeds|stages|copies|rows|notes|bars|cups|packs|boxes|stacks|pallets|panels|gates|calls|circuits|dollars|grams|kilograms|radians|rectangles|intervals|strips|readings|points|terms|factors|roots|laps|pumps|tanks|rovers|shuttles)\b/;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* Size of one step in the last place the number is shown with (1 for 126, 0.01 for 5.25). */
const unitOf = x => { const text = Gen.n(Math.abs(x)), at = text.indexOf('.'); return at < 0 ? 1 : Math.pow(10, -(text.length - at - 1)); };
const texts = m => [m.prompt, ...m.hints, m.solution, ...m.guidance.flatMap(g => [g.prompt, g.explanation])];
/* A hint that ends a sentence with "= A." or "+ A." (a unit may follow A), where A is one of the mission's answers. */
const states = (hint, a) => new RegExp(`(?:=|\\+) ${esc(Gen.n(a))}(?![\\d/]|\\.\\d)(?: [A-Za-z°]+)?\\.(?: |$)`).test(hint);

for (const q of QUESTS) {
  if (!MISSION_GEN[q.id]) continue;
  const leaks = q.hints.map(() => 0);
  for (let roll = 0; roll <= DRAWS; roll++) {
    const m = roll ? Gen.instance(q, SEED, roll) : Gen.instance(q, 0, 0);
    if (m === q) continue;                                   // a failed build is reported by qa/generators.js
    const where = `${q.id} params ${JSON.stringify(m.params)}`;
    /* 1. Tolerance against the precision of the answers: the neighbour in the last shown place must be rejected
          (4.84 must not pass for 4.83). An answer shown with two decimals needs a tolerance of 0.005 or less. */
    for (const a of [...m.answer, ...m.guidance.flatMap(g => g.answer)])
      if (q.tolerance > unitOf(a) / 2) fail(`${where}: tolerance ${q.tolerance} accepts a neighbour of the answer ${a} (one step is ${unitOf(a)})`);
    /* 2. Text that reads as a slip: "+ 0" after a letter term (y = 3x + 0), a coefficient 1 written out (1x). */
    for (const text of texts(m)) {
      if (/[a-z²³] \+ 0(?![\d.])/.test(text)) fail(`${where}: adds 0 to a letter term in "${text}"`);
      if (/(?<![\d.])1[a-z]\b/.test(text)) fail(`${where}: coefficient 1 written out in "${text}"`);
    }
    const given = a => new RegExp(`(?<![\\d.−])${esc(Gen.n(a))}(?![\\d/]|\\.\\d)`).test(m.prompt);    // a number the prompt already states
    m.hints.forEach((hint, i) => { if (m.answer.some(a => !given(a) && states(hint, a))) leaks[i]++; });
    /* 3. "1" with a plural noun ("1 seconds", "1 metres"). Abbreviated units (km, m, s) are not counted. */
    for (const text of texts(m)) { const slip = text.match(ONE_PLURAL); if (slip) fail(`${where}: "${slip[0]}" in "${text}"`); }
    /* 4. An answer of 1000 or more needs the "without commas" note in the prompt: the answer boxes read a comma as a
          decimal point, so "1,347" is taken as 1.347. */
    if (m.answer.some(a => Math.abs(a) >= 1000) && !/without commas/.test(m.prompt)) fail(`${where}: an answer reaches 1000 or more but the prompt does not say "without commas"`);
  }
  /* 5. A hint must not hand over an answer. The first hint is also shown automatically after a first wrong check.
        A number the prompt states is not counted. An answer can equal a number in a hint by chance, so only a
        frequent match fails. */
  leaks.forEach((count, i) => { if (count > 0.12 * (DRAWS + 1)) fail(`${q.id}: hint ${i + 1} states one of the answers in ${count} of ${DRAWS + 1} builds`); });
}

/* 6. Concept bench and review drills (experiments-*.js with variants-*.js), for every slider value. */
for (const q of QUESTS) {
  const model = EXPERIMENTS && EXPERIMENTS[q.id];
  if (typeof model !== 'function') continue;
  for (let t = -10; t <= 10; t++) {
    const m = model(t), where = `${q.id} bench t=${t}`;
    if (/\b0 more\b|\(x [−+] 0\)|[a-z²³] \+ 0(?![\d.])|÷ 0(?![\d.])/.test(m.formula)) fail(`${where}: degenerate working "${m.formula}"`);
  }
  /* 7. A drill must reject a slip of one step in the last place, and a slip of ten steps (35 or 44 for 34). */
  if (Variants && Variants.has(q.id)) for (let i = 0; i < 40; i++) {
    const v = Variants.make(q.id), unit = unitOf(v.target);
    if (!Variants.check(v, v.target)) fail(`${q.id} drill t=${v.t}: the target ${v.target} itself is rejected`);
    for (const slip of [unit, -unit, 10 * unit, -10 * unit])
      if (Variants.check(v, v.target + slip)) fail(`${q.id} drill t=${v.t}: ${Gen.n(v.target + slip)} is accepted for ${v.target} (tolerance ${v.tolerance})`);
  }
}

/* 8. Ranks: learn missions alone must climb every rank below the top one, and the last of those needs every concept. */
{
  const ranks = (REALM && REALM.ranks) || [], planned = Array.isArray(REALM && REALM.chapters) ? REALM.chapters.reduce((s, c) => s + c.ids.length, 0) : QUESTS.filter(q => !q.parent).length;
  const below = ranks.filter(r => !r.top);
  if (REALM && REALM.practice && below.length > 1 && below[below.length - 1].learnAt !== planned) fail(`ranks: the last rank below the top must be held by all ${planned} concepts (give it learnAt: ${planned})`);
}

if (problems.length) throw new Error(`${(REALM && REALM.name) || 'Pack'} checks failed (qa/pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
