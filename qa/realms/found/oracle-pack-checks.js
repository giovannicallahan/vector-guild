/* Content checks for the Foundations pack that the generic generator and oracle checks cannot see.
   This file registers no oracle. qa/generators.js loads every qa/realms/found/oracle-*.js after the whole pack, so
   the checks below run with `node qa/generators.js --realm found`; any failure throws, which fails that command.
   Each check names the defect it guards against. Draws use their own seed, apart from the generator checks. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN, EXPERIMENTS, Variants } = window;
const problems = [];
/* At most three reports per mission, so one defect does not hide the others. */
const seen = {};
const fail = text => { const id = text.slice(0, 3); seen[id] = (seen[id] || 0) + 1; if (seen[id] <= 3 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
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
          (q10 accepted 4.84 for 4.83 with tolerance 0.01, depending on float noise). */
    for (const a of [...m.answer, ...m.guidance.flatMap(g => g.answer)])
      if (q.tolerance > unitOf(a) / 2) fail(`${where}: tolerance ${q.tolerance} accepts a neighbour of the answer ${a} (one step is ${unitOf(a)})`);
    /* 2. Text that reads as a slip to a beginner: "+ 0" (y = 3x + 0), a coefficient 1 written out (1x). */
    for (const text of texts(m)) {
      if (/[a-z] \+ 0(?![\d.])/.test(text)) fail(`${where}: adds 0 to a letter term in "${text}"`);
      if (/(?<![\d.])1[a-z]\b/.test(text)) fail(`${where}: coefficient 1 written out in "${text}"`);
    }
    /* 3. A unit abbreviation needs its name in the same prompt (dm was used without ever being explained). */
    if (texts(m).some(text => /\bdm\b|dm³/.test(text)) && !/tenths? of a metre/.test(m.prompt)) fail(`${where}: "dm" is used but the prompt does not say what a decimetre is`);
    const given = a => new RegExp(`(?<![\\d.−])${esc(Gen.n(a))}(?![\\d/]|\\.\\d)`).test(m.prompt);    // a number the prompt already states
    m.hints.forEach((hint, i) => { if (m.answer.some(a => !given(a) && states(hint, a))) leaks[i]++; });
    if (!roll) continue;
    /* Mission-specific rules. */
    const p = m.params;
    if (q.id === 'q25' && p.m1 - p.m2 < 2) fail(`${where}: the rates differ by 1, so hint 2 and the first guided prompt read "x = answer" and the solution divides by 1`);
    if (q.id === 'q33' && (m.hints[1].match(/ and /g) || []).length < 2) fail(`${where}: hint 2 lists only the answer pair`);
    if (q.id === 'q39') {
      if (p.b ** p.n === p.b * p.n) fail(`${where}: base × exponent gives the accepted strength`);
      if ((p.T / p.S) / p.b === p.k) fail(`${where}: factor ÷ base gives the accepted stage count`);
    }
    if (q.id === 'q21' && /every hour/.test(m.solution) && !/steady rate/.test(m.prompt)) fail(`${where}: the solution claims a rate for every hour, but the prompt does not say the rate is steady`);
    if (q.id === 'q09' && m.answer[0] >= m.answer[1]) fail(`${where}: the sum is a whole or more, which is not taught`);
  }
  /* 4. A hint must not hand over an answer. The first hint is also shown automatically after a first wrong check.
        A number the prompt states is not counted. An answer can equal a number in a hint by chance (at most 9% of
        draws, q39), so only a frequent match fails; the defects this caught matched in 15% to 95% of draws. */
  leaks.forEach((count, i) => { if (count > 0.12 * (DRAWS + 1)) fail(`${q.id}: hint ${i + 1} states one of the answers in ${count} of ${DRAWS + 1} builds`); });
}

/* 5. Concept bench and review drills (experiments-*.js with variants-*.js), for every slider value. */
const value = (model, row) => model.values[row][1];
for (const q of QUESTS) {
  const model = EXPERIMENTS && EXPERIMENTS[q.id];
  if (typeof model !== 'function') continue;
  for (let t = -10; t <= 10; t++) {
    const m = model(t), where = `${q.id} bench t=${t}`;
    if (/\b0 more\b|\b0 degrees down\b|\(x [−+] 0\)/.test(m.formula)) fail(`${where}: degenerate working "${m.formula}"`);
    if (q.id === 'q05') {
      const bracket = value(m, 1);
      if (5 + 3 * bracket === (5 + 3) * bracket) fail(`${where}: working left to right gives the same value`);
      if (!m.setup.includes(`(${bracket + 6} − 6)`)) fail(`${where}: statement and model use different numbers`);
    }
    if (q.id === 'q06' && value(m, 0) !== 5 - value(m, 2)) fail(`${where}: wrong night reading`);
    if (q.id === 'q09') {
      if (m.target >= 12) fail(`${where}: the sum ${m.target}/12 is a whole or more, which is not taught`);
      if (!m.setup.includes(` ${value(m, 2)}/12 `)) fail(`${where}: statement and model use different numbers`);
    }
    if (q.id === 'q34') {
      const r = value(m, 1), s = value(m, 2);
      if (!(r > 0 && s > r)) fail(`${where}: roots ${r} and ${s} are not two different positive numbers, the only case taught`);
      if (m.target !== (r + s) / 2 || value(m, 3) !== -(((s - r) / 2) ** 2)) fail(`${where}: wrong vertex`);
      const curve = text => (text.match(/y = (x²[^=.]*?)(?= =|\.)/) || [])[1];
      if (!curve(m.setup) || curve(m.setup) !== curve(m.formula)) fail(`${where}: statement and working show different curves`);
      if (!m.setup.includes(`${s - r} apart`)) fail(`${where}: the statement gives the wrong gap between the roots`);
    }
  }
  /* 6. A drill must reject a slip of one step in the last place, and a slip of ten steps (3517 or 3570 for 3507,
        5.15 for 5.25): the 2% window accepted them. */
  if (Variants && Variants.has(q.id)) for (let i = 0; i < 40; i++) {
    const v = Variants.make(q.id), unit = unitOf(v.target);
    if (!Variants.check(v, v.target)) fail(`${q.id} drill t=${v.t}: the target ${v.target} itself is rejected`);
    for (const slip of [unit, -unit, 10 * unit, -10 * unit])
      if (Variants.check(v, v.target + slip)) fail(`${q.id} drill t=${v.t}: ${Gen.n(v.target + slip)} is accepted for ${v.target} (tolerance ${v.tolerance})`);
  }
}

if (problems.length) throw new Error(`Foundations pack checks failed (qa/realms/found/oracle-pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
