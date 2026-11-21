/* Content checks for the Foundations pack that the generic generator and oracle checks cannot see.
   This file registers no oracle. qa/generators.js loads every qa/realms/found/oracle-*.js after the whole pack, so
   the checks below run with `node qa/generators.js --realm found`; any failure throws, which fails that command.
   Each check names the defect it guards against. Draws use their own seed, apart from the generator checks. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN, EXPERIMENTS, Variants, REALM } = window;
const problems = [];
/* At most three reports per mission, so one defect does not hide the others. */
const seen = {};
const fail = text => { const id = text.slice(0, 3); seen[id] = (seen[id] || 0) + 1; if (seen[id] <= 3 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
/* "1" followed by a plural counting noun; not after a digit, a point or a slash ("21 tiles"), and not the end of a letter expression ("x + 1 dollars"). */
const ONE_PLURAL = /(?<![\d.,\/]|[a-z)] [+−] )\b1 (?:ones|tens|hundreds|thousands|degrees|pieces|blocks|squares|metres|minutes|hours|days|weeks|years|parts|units|steps|litres|tiles|seeds|stages|copies|rows|notes|bars|cups|packs|boxes|stacks|pallets|panels|gates|calls|circuits|dollars|grams)\b/;
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
    /* 3a. "1" with a plural noun ("1 blocks", "1 minutes are left over", "1 tens"). Units that do not change (km) and
           a letter expression ending in 1 ("x + 1 dollars") are not counted. */
    for (const text of texts(m)) { const slip = text.match(ONE_PLURAL); if (slip) fail(`${where}: "${slip[0]}" in "${text}"`); }
    /* 3b. An answer of 1000 or more needs the "without commas" note in the prompt: the answer boxes read a comma as a
           decimal point, so "1,347" is taken as 1.347 and marked wrong. */
    if (m.answer.some(a => Math.abs(a) >= 1000) && !/without commas/.test(m.prompt)) fail(`${where}: an answer reaches 1000 or more but the prompt does not say "without commas"`);
    if (!roll) {
      /* Canonical numbers must not repeat what the lesson above the mission already works out. */
      const p0 = m.params;
      if (q.id === 'q01b' && p0.a === 4 && p0.b === 0 && p0.c === 6) fail(`${where}: the authored numbers shadow the q01 worked example (4061)`);
      if (q.id === 'q09d' && p0.a === 1 && p0.c === 1 && p0.b * p0.d === 6) fail(`${where}: the authored sum is the one the q09 mission asks for`);
      continue;
    }
    /* Mission-specific rules. */
    const p = m.params;
    /* Arithmetic no earlier mission teaches. q04 divides numbers up to about 300 by 3 to 9; q03 multiplies by one digit. */
    if (q.id === 'q07c') for (const d of [p.d1, p.d2]) if (d > 10 || p.pay % (10 * d) || p.pay / 10 / d > 30) fail(`${where}: ${p.pay} ÷ ${d} is beyond the division taught so far`);
    if (q.id === 'q07c' && !/ tens/.test(m.hints[0] + m.solution)) fail(`${where}: the division of the pay is not shown through its tens`);
    if (q.id === 'q09d') { const D = m.answer[1]; if (D > 10 || p.price % (10 * D) || p.price / 10 / D > 30) fail(`${where}: ${p.price} ÷ ${D} is beyond the division taught so far`); }
    if (q.id === 'q09d' && !/ tens/.test(m.solution)) fail(`${where}: the division of the price is not shown through its tens`);
    if (q.id === 'q08d' && p.r > 10) fail(`${where}: ${p.r} × ${p.c} is a two-digit number times a two-digit number, which q03 does not teach`);
    if (q.id === 'q08d' && !/Split|tens/.test(m.solution)) fail(`${where}: the solution states ${p.r} × ${p.c} without the working`);
    /* Numbers a lesson or an earlier mission already works out. */
    if (q.id === 'q01b' && p.a === 4 && p.b === 0 && p.c === 6) fail(`${where}: repeats the q01 worked example (4061)`);
    if (q.id === 'q09d' && p.a === 1 && p.c === 1 && p.b * p.d === 6) fail(`${where}: 1/2 + 1/3 is the sum the q09 mission asks for`);
    if (q.id === 'q39d' && [[2, 3, 4], [2, 4, 5], [3, 2, 3]].some(([b, e, f]) => p.b === b && Math.min(p.e1, p.e2) === e && Math.max(p.e1, p.e2) === f)) fail(`${where}: the q30 lesson already works out this product of powers`);
    if (q.id === 'q40d') { const legs = [p.k * p.o, p.k * p.d].sort((x, y) => x - y).join(',');
      if (['3,4', '6,8', '9,12', '18,24'].includes(legs)) fail(`${where}: the triangle ${legs} is already worked out in q20, q20b or q40`); }
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

/* 7. Wording and pack rules that one mission got wrong. */
{
  const byId = id => QUESTS.find(q => q.id === id);
  /* q34d: the pattern is x² − (number)x, so the box wants 12 where the coefficient is −12; "number before x" invited −12. */
  const q34d = byId('q34d');
  if (q34d) {
    if ([...q34d.labels, ...q34d.guidance.flatMap(g => g.labels || [])].some(label => /before x/.test(label))) fail('q34d: an answer label says "number before x", which reads as the signed coefficient');
    if (!/without it/.test(q34d.prompt)) fail('q34d: the prompt does not say that the minus sign is already written');
  }
  /* q30b: half of the generated versions ask about a gigabyte, and the brief is not rebuilt. */
  const q30b = byId('q30b');
  if (q30b && /megabyte|gigabyte/.test(q30b.brief) && MISSION_GEN.q30b) fail('q30b: the brief names one unit, but the generator asks about a megabyte or a gigabyte');
  /* q26d: a bracket with a take-away and −py + qy are not taught before it, so the prompt and the solution must say how. */
  const q26d = byId('q26d');
  if (q26d && !(/take-away stays/.test(q26d.prompt) && /take-away stays/.test(q26d.solution) && /leaves \d+y more/.test(q26d.solution))) fail('q26d: multiplying out a bracket with a take-away, or combining the y terms, is used without being explained');
  /* Ranks: a 2.1 save with every concept learned held the 2.1 top rank, and must still hold it. */
  const learnCount = QUESTS.filter(q => !q.parent).length, ranks = (REALM && REALM.ranks) || [];
  if (QUESTS.some(q => q.parent) && !ranks.some(r => r.title === 'GUILD CANDIDATE' && !r.top && r.learnAt === learnCount)) fail(`ranks: ${learnCount} concepts learned must still hold GUILD CANDIDATE, the top rank of 2.1 (give it learnAt: ${learnCount})`);
}

if (problems.length) throw new Error(`Foundations pack checks failed (qa/realms/found/oracle-pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
