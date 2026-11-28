/* Content checks for the Probability pack that only this pack needs. This file registers no oracle.
   The rules every pack after Foundations shares (tolerance against the answer's precision, "+ 0", a written-out
   coefficient 1, "1 seconds", "without commas", hints that state an answer, drills that accept a neighbour, ranks)
   are in qa/pack-checks.js, which qa/generators.js runs for this pack as well. Add a rule here when a review finds a
   defect in one mission that the shared rules cannot see; name the defect. Any failure throws, which fails
   `node qa/generators.js --realm prob`. */
(function(){ 'use strict';
const { Gen, QUESTS, MISSION_GEN } = window;
const problems = [], fail = text => { if (problems.length < 20 && !problems.includes(text)) problems.push(text); };
const SEED = 4242, DRAWS = 300;
for (const q of QUESTS) {
  if (!MISSION_GEN[q.id]) continue;
  for (let roll = 1; roll <= DRAWS; roll++) {
    const m = Gen.instance(q, SEED, roll); if (m === q) continue;
    const p = m.params, where = `${q.id} params ${JSON.stringify(p)}`;
    /* Impossible records: P(A and B) below P(A) + P(B) − 1 makes P(A or B) more than 1 (review, q09 draw with 0.7, 0.9, 0.57). */
    if (q.id === 'q09' && p.g <= 100 * p.a + 50 * p.b - 1000) fail(`${where}: P(morning and damp) is too small for P(morning or damp) to stay below 1`);
    /* Two prize groups of the same size read as one prize asked for twice (review, q17 "10 credits each" twice). */
    if (q.id === 'q17' && p.B <= p.C) fail(`${where}: the second prize is not larger than the third`);
    /* "2 envelopes hold 60 credits" reads as 60 shared between them: a group prize must say "each". */
    if ((q.id === 'q17b' || q.id === 'q17c') && p.a > 1 && !new RegExp(`${p.A} credits each`).test(m.prompt)) fail(`${where}: the first prize group does not say "each"`);
    /* An expected count exactly halfway at 1 decimal place (100 × 0.3125 = 31.25) has two honest roundings. */
    if (q.id === 'q20c') { const t = p.T * m.answer[0] * 10, f = t - Math.floor(t); if (Math.abs(f - 0.5) < 1e-6) fail(`${where}: ${p.T} × ${m.answer[0]} is halfway at 1 decimal place`); }
    /* A Poisson answer must be what the printed 4-place e^(−λ) gives (review: λ = 3, k = 4 gives 0.1681 from 0.0498, 0.1680 exactly). */
    if (['q24', 'q24b', 'q24c', 'q24d'].includes(q.id)) { const lam = q.id === 'q24c' ? Math.round(p.r * p.t * 1e9) / 1e9 : p.lam, r4 = x => Math.round(x * 1e4) / 1e4;
      let f = 1; for (let i = 2; i <= p.k; i++) f *= i; const pk = m.answer[1];
      if (r4(Math.pow(lam, p.k) * r4(Math.exp(-lam)) / f) !== r4(pk)) fail(`${where}: the printed e^(−${lam}) does not give the answer ${pk}`); }
    /* A sample proportion k ÷ n must print exactly (review: k ÷ 96 repeats, so the z-score depended on how p̂ was rounded). */
    if ((q.id === 'q40' && p.kind === 2 || q.id === 'q40b') && p.nn !== 100 && p.nn !== 400) fail(`${where}: k ÷ ${p.nn} does not print exactly`);
    /* The binomial step "failures in the outcome" asks for the power of q, n − k (review, q23b). */
    if (q.id === 'q23b' && p.kind === 1 && m.guidance[1].answer[0] !== p.n - p.k) fail(`${where}: guided step 2 does not ask for n − k`);
    /* A guided step must not print the answer it asks for (review, q40d: "if the row for 1.90 gives …" in the step that asks for z). */
    if (q.id === 'q40d') m.guidance.forEach((g, i) => { if (g.answer.length === 1 && Math.abs(g.answer[0]) < 4 && g.prompt.includes(`row for ${Math.abs(g.answer[0]).toFixed(2)}`)) fail(`${where}: guided step ${i + 1} prints its own answer`); });
    /* Each half of the q18c pattern is printed as an exact product (review: "0.05 × 0.95 × 0.95 = 0.0451", truly 0.045125). */
    if (q.id === 'q18c') [[p.p1, p.s1, 0], [p.p2, p.s2, 1]].forEach(([pr, seq, i]) => { const x = seq.split('').reduce((v, c) => v * (c === 'S' ? pr : 1 - pr), 1);
      if (Math.abs(x - m.guidance[i].answer[0]) > 1e-9) fail(`${where}: guided step ${i + 1} prints ${m.guidance[i].answer[0]} for the product ${x}`); });
  }
}
if (problems.length) throw new Error(`Probability pack checks failed (qa/realms/prob/oracle-pack-checks.js):\n  - ${problems.join('\n  - ')}`);
})();
