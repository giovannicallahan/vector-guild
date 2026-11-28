/* Electricity and magnetism: fields practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p6.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const t6 = x => Math.round(x * 1e6) / 1e6;
const mk = (meta, gen0) => {
 /* Answers are cleaned of float noise (3.6000000000000014 is 3.6). */
 const gen = { ...gen0, build: p => { const b = gen0.build(p); return { ...b, answer: b.answer.map(t6), guidance: b.guidance.map(g => ({ ...g, answer: g.answer.map(t6) })) }; } };
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* fits(x, d): x has at most d decimal places (float noise ignored). r2: x rounded to 2 decimal places. */
const fits = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-7; };
const r2 = x => Math.round(x * 100 + 1e-9) / 100, f2 = x => r2(x).toFixed(2).replace('-', '−');
/* A value that is rounded to 2 places in the answer: far from a rounding tie, and not already a 2-place number
   (so "x, which rounds to y" never prints the same number twice). */
const roundable = x => { const s = x * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.08 && f > 0.05 && f < 0.95; };
/* At most 1000 tries, then the canonical parameters. */
const drawWith = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
/* Two resistors in parallel. */
const pp = (a, b) => a * b / (a + b);
/* Kirchhoff network of the circuits chapter: junctions A (top) and B (bottom); left branch emf E1 with R1, middle branch
   R2, right branch emf E2 with R3 (a negative E2 means its + terminal faces B). Loops: E1 = (R1 + R2)I1 + R2·I3 and
   E2 = R2·I1 + (R2 + R3)I3; the junction rule gives I2 = I1 + I3. */
const kirch = (E1, E2, R1, R2, R3) => { const a = R1 + R2, c = R2 + R3, det = a * c - R2 * R2,
 n1 = E1 * c - R2 * E2, n3 = a * E2 - R2 * E1, I1 = n1 / det, I3 = n3 / det; return { a, c, det, n1, n3, I1, I3, I2: I1 + I3 }; };
/* A charge written as a multiple of e: +e, −e, +2e, −3e. */
const qtxt = z => Math.abs(z) === 1 ? (z > 0 ? '+e' : '−e') : `${plus(z)}e`;

/* ---- q26 Resistors in series and parallel [10.2] ---- */

/* Two lamps in series (Ra, Rb) form one branch, in parallel with a heater Rc, across an ideal supply E. The parent's
   network is a cable in series with two parallel heaters, so this one is a different shape. */
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Lamps and a heater in the sled shed',
 brief: 'The sled shed has a string of lamps and a heater on the same supply, and the crew must know what the supply has to deliver.',
 labels: ['equivalent resistance (Ω)', 'current from the supply (A)'], tolerance: 0.005,
 gl: [['lamp branch (Ω)'], ['equivalent resistance (Ω)'], ['current from the supply (A)']]
}, {
 canonical: { Ra: 5, Rb: 7, Rc: 6, E: 30 },
 draw: R => drawWith(() => ({ Ra: R.int(1, 20), Rb: R.int(1, 20), Rc: R.int(2, 40), E: R.pick([6, 9, 12, 18, 24, 30, 36, 48, 60, 120]) }),
  p => { const S = p.Ra + p.Rb, Rq = pp(S, p.Rc), I = p.E / Rq; return fits(Rq, 2) && fits(I, 2) && I >= 0.1 && I < 200 && !(p.Ra + p.Rb === 18 && p.Rc === 6); },
  { Ra: 5, Rb: 7, Rc: 6, E: 30 }),
 build: ({ Ra, Rb, Rc, E }) => { const S = Ra + Rb, Rq = pp(S, Rc), I = E / Rq; return {
  prompt: `The sled shed in the Cable Works has an ideal supply of emf ε = ${n(E)} V. It feeds two branches that start and end at the same two points. One branch is a string of two lamps, ${n(Ra)} Ω and ${n(Rb)} Ω, joined one after the other. The other branch is a single heater of ${n(Rc)} Ω. The connecting wires have no resistance. Enter the equivalent resistance of the whole shed in ohms, then the current from the supply in amperes. Both are exact decimals.`,
  answer: [Rq, I],
  hints: ['Resistors one after another in a single branch add. Two branches side by side then combine by reciprocals: 1 ÷ R = 1 ÷ R₁ + 1 ÷ R₂, which for two of them is R₁R₂ ÷ (R₁ + R₂).', 'The supply sees one equivalent resistor for the whole shed, so the current it gives is I = ε ÷ R.'],
  solution: `The two lamps in series: ${n(Ra)} + ${n(Rb)} = ${n(S)} Ω. That branch is in parallel with the ${n(Rc)} Ω heater: ${n(S)} × ${n(Rc)} ÷ (${n(S)} + ${n(Rc)}) = ${n(S * Rc)} ÷ ${n(S + Rc)} = ${n(Rq)} Ω. The current from the supply is I = ε ÷ R = ${n(E)} ÷ ${n(Rq)} = ${n(I)} A.`,
  guidance: [
   { prompt: `The lamps of ${n(Ra)} Ω and ${n(Rb)} Ω are one after the other in the same branch. What is the resistance of that branch (Ω)?`, answer: [S], explanation: `In series the resistances add: ${n(Ra)} + ${n(Rb)} = ${n(S)} Ω.` },
   { prompt: `A branch of ${n(S)} Ω and a heater of ${n(Rc)} Ω sit side by side across the supply. What single resistance replaces them (Ω)?`, answer: [Rq], explanation: `R = R₁R₂ ÷ (R₁ + R₂) = ${n(S * Rc)} ÷ ${n(S + Rc)} = ${n(Rq)} Ω. It is less than either branch: the current has two paths.` },
   { prompt: `The ${n(E)} V supply drives current through ${n(Rq)} Ω. What current does it give (A)?`, answer: [I], explanation: `I = ε ÷ R = ${n(E)} ÷ ${n(Rq)} = ${n(I)} A.` }
  ] }; }
});

/* A feed cable R1 in series with N identical heaters Rh in parallel, ideal supply E. */
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'A row of heaters on one cable',
 brief: 'The dome ring is switching on a whole row of identical heaters at once, and the crew wants to know how much voltage reaches them.',
 labels: ['current from the supply (A)', 'voltage across the heaters (V)'], tolerance: 0.005,
 gl: [['row of heaters (Ω)'], ['current from the supply (A)'], ['voltage across the heaters (V)']]
}, {
 canonical: { E: 30, R1: 3, Rh: 12, N: 4 },
 draw: R => drawWith(() => ({ E: R.pick([12, 18, 24, 30, 36, 48, 60, 120]), R1: R.int(1, 10), Rh: R.int(2, 40), N: R.int(2, 6) }),
  p => { const Rg = p.Rh / p.N, Rt = p.R1 + Rg, I = p.E / Rt, V = I * Rg; return fits(Rg, 2) && fits(I, 2) && fits(V, 2) && I >= 0.2 && I < 200; },
  { E: 30, R1: 3, Rh: 12, N: 4 }),
 build: ({ E, R1, Rh, N }) => { const Rg = Rh / N, Rt = R1 + Rg, I = E / Rt, V = I * Rg; return {
  prompt: `The ring main in the Cable Works has an ideal supply of emf ε = ${n(E)} V. A feed cable of ${n(R1)} Ω leads to a row of ${n(N)} identical heaters, each of ${n(Rh)} Ω, all connected in parallel with one another. The current returns to the supply along wires with no resistance. With every heater switched on, enter the current from the supply in amperes, then the voltage across the heaters in volts. Both are exact decimals.`,
  answer: [I, V],
  hints: ['Identical resistors in parallel: adding the reciprocals of N equal resistors gives 1 ÷ R = N ÷ R_heater, so the row behaves like one resistor of R_heater ÷ N. The feed cable is in series with that resistor.', 'The supply gives I = ε ÷ R_total. All of that current passes through the row, and the heaters share the voltage across it, which is the current times the row’s resistance (V = IR).'],
  solution: `${n(N)} identical heaters in parallel behave like one resistor of ${n(Rh)} ÷ ${n(N)} = ${n(Rg)} Ω. In series with the feed cable: ${n(R1)} + ${n(Rg)} = ${n(Rt)} Ω. The current from the supply is I = ε ÷ R = ${n(E)} ÷ ${n(Rt)} = ${n(I)} A. The heaters share the voltage V = I × ${n(Rg)} = ${n(I)} × ${n(Rg)} = ${n(V)} V; the feed cable takes the rest of the ${n(E)} V.`,
  guidance: [
   { prompt: `${n(N)} identical heaters of ${n(Rh)} Ω are in parallel. What single resistance replaces the whole row (Ω)?`, answer: [Rg], explanation: `The reciprocals add: ${n(N)} ÷ ${n(Rh)}, so R = ${n(Rh)} ÷ ${n(N)} = ${n(Rg)} Ω. A row of ${n(N)} equal heaters is ${n(N)} times easier to push current through than one.` },
   { prompt: `The ${n(R1)} Ω feed cable is in series with that ${n(Rg)} Ω row. What current does the ${n(E)} V supply give (A)?`, answer: [I], explanation: `The total is ${n(R1)} + ${n(Rg)} = ${n(Rt)} Ω, so I = ε ÷ R = ${n(E)} ÷ ${n(Rt)} = ${n(I)} A.` },
   { prompt: `A current of ${n(I)} A flows through the ${n(Rg)} Ω row of heaters. What voltage is across the row (V)?`, answer: [V], explanation: `V = IR = ${n(I)} × ${n(Rg)} = ${n(V)} V, the same across every heater.` }
  ] }; }
});

/* A feed cable R1 in series with three heaters Ra, Rb, Rc in parallel. Asks the equivalent R and the power in the
   cable, I²R1 (q25). The sum of reciprocals is shown over the lcm so every printed step is exact. */
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q25', title: 'Three heaters on the dome feed',
 brief: 'A dome feed carries three heaters at once, and the crew wants to know how much of the supply’s power the cable itself wastes as heat.',
 labels: ['equivalent resistance (Ω)', 'power lost in the feed cable (W)'], tolerance: 0.005,
 gl: [['three heaters in parallel (Ω)'], ['equivalent resistance (Ω)'], ['current from the supply (A)'], ['power in the feed cable (W)']]
}, {
 canonical: { E: 40, R1: 5, Ra: 10, Rb: 15, Rc: 30 },
 draw: R => drawWith(() => ({ E: R.pick([12, 18, 24, 30, 36, 40, 48, 60, 120]), R1: R.int(1, 12), Ra: R.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60]), Rb: R.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60]), Rc: R.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60]) }),
  p => { const L = lcm(lcm(p.Ra, p.Rb), p.Rc), s = L / p.Ra + L / p.Rb + L / p.Rc, Rp = L / s, Rt = p.R1 + Rp, I = p.E / Rt, P = I * I * p.R1; return fits(Rp, 2) && fits(I, 2) && fits(P, 2) && I >= 0.2 && P < 1000 && P >= 0.1 && !(p.Ra === p.Rb && p.Rb === p.Rc); },
  { E: 40, R1: 5, Ra: 10, Rb: 15, Rc: 30 }),
 build: ({ E, R1, Ra, Rb, Rc }) => { const L = lcm(lcm(Ra, Rb), Rc), ka = L / Ra, kb = L / Rb, kc = L / Rc, s = ka + kb + kc, Rp = L / s, Rt = R1 + Rp, I = E / Rt, P = I * I * R1; return {
  prompt: `A supply with emf ε = ${n(E)} V feeds a dome through a feed cable of ${n(R1)} Ω. At the dome the current splits three ways, through heaters of ${n(Ra)} Ω, ${n(Rb)} Ω and ${n(Rc)} Ω connected in parallel with one another, and returns to the supply along wires with no resistance. Treat the supply as ideal. Enter the equivalent resistance of the whole circuit in ohms, then the power turned into heat in the feed cable alone in watts. The power in a resistor is P = I²R, with I the current through it. Both are exact decimals.`,
  answer: [Rt, P],
  hints: ['Resistors in parallel: the reciprocals add, whatever the number of them, 1 ÷ R = 1 ÷ R₁ + 1 ÷ R₂ + 1 ÷ R₃. Add them, then turn the sum over. The feed cable is in series with the result.', 'All of the supply’s current passes through the feed cable. Find I = ε ÷ R_total first, then use P = I²R with the cable’s own resistance.'],
  solution: `The heaters in parallel: 1 ÷ R = 1 ÷ ${n(Ra)} + 1 ÷ ${n(Rb)} + 1 ÷ ${n(Rc)} = (${n(ka)} + ${n(kb)} + ${n(kc)}) ÷ ${n(L)} = ${n(s)} ÷ ${n(L)}, so R = ${n(L)} ÷ ${n(s)} = ${n(Rp)} Ω. In series with the feed cable: ${n(R1)} + ${n(Rp)} = ${n(Rt)} Ω. The current is I = ε ÷ R = ${n(E)} ÷ ${n(Rt)} = ${n(I)} A, and all of it passes through the cable, so the cable turns I²R = ${n(I)}² × ${n(R1)} = ${n(P)} W into heat.`,
  guidance: [
   { prompt: `The three heaters of ${n(Ra)} Ω, ${n(Rb)} Ω and ${n(Rc)} Ω are in parallel. What single resistance replaces them (Ω)?`, answer: [Rp], explanation: `1 ÷ R = ${n(ka)} ÷ ${n(L)} + ${n(kb)} ÷ ${n(L)} + ${n(kc)} ÷ ${n(L)} = ${n(s)} ÷ ${n(L)}, so R = ${n(L)} ÷ ${n(s)} = ${n(Rp)} Ω.` },
   { prompt: `The ${n(R1)} Ω feed cable is in series with that ${n(Rp)} Ω group. What is the equivalent resistance of the whole circuit (Ω)?`, answer: [Rt], explanation: `In series the resistances add: ${n(R1)} + ${n(Rp)} = ${n(Rt)} Ω.` },
   { prompt: `The ${n(E)} V supply drives current through ${n(Rt)} Ω. What current does it give (A)?`, answer: [I], explanation: `I = ε ÷ R = ${n(E)} ÷ ${n(Rt)} = ${n(I)} A.` },
   { prompt: `The whole ${n(I)} A passes through the ${n(R1)} Ω feed cable. What power does the cable turn into heat (W)?`, answer: [P], explanation: `P = I²R = ${n(I * I)} × ${n(R1)} = ${n(P)} W.` }
  ] }; }
});

/* ---- q27 Kirchhoff's junction and loop rules [10.3] ---- */

/* The parent's network with the spare battery's polarity drawn (s2 = 1: + towards A, −1: + towards B); asks I1, I3 and
   the voltage across the lamp, I2·R2. Lamp current I2 is positive in every draw. */
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'Rover battery and spare',
 brief: 'A rover’s main battery and a spare share one cabin lamp, and the crew needs to know how hard each of them is working.',
 labels: ['I₁ (A)', 'I₃ (A)', 'lamp voltage (V)'], tolerance: 0.005,
 gl: [['I₁ (A)'], ['I₃ (A)'], ['lamp voltage (V)']]
}, {
 canonical: { E1: 6, E2: 8, s2: -1, R1: 1, R2: 2, R3: 6 },
 draw: R => drawWith(() => ({ E1: R.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), E2: R.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), s2: R.pick([1, -1]), R1: R.int(1, 10), R2: R.int(1, 10), R3: R.int(1, 10) }),
  p => { const k = kirch(p.E1, p.s2 * p.E2, p.R1, p.R2, p.R3); return [k.I1, k.I2, k.I3].every(x => fits(x, 2) && Math.abs(x) > 0.004) && k.I2 > 0 && fits(k.I2 * p.R2, 2) && !same(p, { E1: 12, E2: 6, s2: 1, R1: 2, R2: 4, R3: 2 }) && !same(p, { E1: 9, E2: 3, s2: 1, R1: 1, R2: 2, R3: 1 }); },
  { E1: 6, E2: 8, s2: -1, R1: 1, R2: 2, R3: 6 }),
 build: ({ E1, E2, s2, R1, R2, R3 }) => { const e2 = s2 * E2, k = kirch(E1, e2, R1, R2, R3), V = k.I2 * R2, neg = [['I₁', k.I1], ['I₃', k.I3]].filter(x => x[1] < 0).map(x => x[0]); return {
  prompt: `A rover in the Cable Works runs its cabin lamp from two batteries. Two junctions, A at the top and B at the bottom, are joined by three branches. Left branch: the main battery, emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with a lead of ${n(R1)} Ω. Middle branch: the cabin lamp, ${n(R2)} Ω alone. Right branch: the spare battery, emf ε₂ = ${n(E2)} V with its positive terminal towards ${s2 > 0 ? 'A' : 'B'}, in series with a lead of ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. Call I₁ the current up the left branch towards A, I₂ the current down the lamp from A to B, and I₃ the current up the right branch towards A. Enter I₁ and I₃ in amperes, then the voltage across the lamp in volts. A negative current really flows the other way. Each is an exact decimal with at most 2 places.`,
  answer: [k.I1, k.I3, V],
  hints: ['Junction rule at A: the current flowing in equals the current flowing out. I₁ and I₃ arrive at A and I₂ leaves.', 'Loop rule: going through a battery from its − terminal to its + terminal gains its emf, so walking up a branch whose battery has its + terminal towards B loses its emf instead. Going through a resistor along its current arrow loses I × R. Write the left loop and the right loop, put in the junction rule and solve them together. The voltage across the lamp is then I₂ × R₂ (Ohm’s law).'],
  solution: `Junction A: I₂ = I₁ + I₃. Left loop (up the left branch, down the lamp): ${n(E1)} − ${n(R1)} × I₁ − ${n(R2)} × I₂ = 0. Right loop (up the right branch, down the lamp): the spare battery has its positive terminal towards ${s2 > 0 ? 'A' : 'B'}, so walking up its branch ${s2 > 0 ? 'gains' : 'loses'} ${n(E2)} V and the loop reads ${n(e2)} − ${n(R3)} × I₃ − ${n(R2)} × I₂ = 0. Putting in I₂ = I₁ + I₃ gives ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(e2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Eliminating I₃: I₁ = (${n(E1)} × ${n(k.c)} − ${n(R2)} × ${par(e2)}) ÷ (${n(k.a)} × ${n(k.c)} − ${n(R2)}²) = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A. In the same way I₃ = (${n(k.a)} × ${par(e2)} − ${n(R2)} × ${n(E1)}) ÷ ${n(k.det)} = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, and I₂ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A. The lamp voltage is ${n(k.I2)} × ${n(R2)} = ${n(V)} V.${neg.length ? ` The minus sign on ${neg.join(' and ')} means that current flows down its branch, against the arrow chosen.` : ''}`,
  guidance: [
   { prompt: `Put I₂ = I₁ + I₃ into both loop equations: ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(e2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Eliminate I₃: multiply the first equation by ${n(k.c)}, the second by ${n(R2)}, and subtract. What is I₁ (A)?`, answer: [k.I1], explanation: `${n(E1 * k.c)} − ${par(R2 * e2)} = (${n(k.a * k.c)} − ${n(R2 * R2)}) × I₁, so I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A.` },
   { prompt: `Put I₁ = ${n(k.I1)} into ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃. What is I₃ (A)?`, answer: [k.I3], explanation: `${n(R2)} × I₃ = ${n(E1)} − ${n(k.a)} × ${par(k.I1)} = ${n(E1 - k.a * k.I1)}, so I₃ = ${n(k.I3)} A.` },
   { prompt: `The junction rule gives I₂ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A down the lamp of ${n(R2)} Ω. What voltage is across the lamp (V)?`, answer: [V], explanation: `V = IR = ${n(k.I2)} × ${n(R2)} = ${n(V)} V.` }
  ] }; }
});

/* The spare battery carries no current: I3 = 0, so I2 = E1/(R1 + R2) and E2 = I2·R2. R3 is printed but plays no part
   (no current, so no drop across it). */
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'Balancing the spare battery',
 brief: 'The crew wants to trim a spare battery so that it neither charges nor drains, and needs to know what emf makes that happen.',
 labels: ['lamp current (A)', 'spare battery emf (V)'], tolerance: 0.005,
 gl: [['lamp current (A)'], ['spare battery emf (V)']]
}, {
 canonical: { E1: 20, R1: 5, R2: 15, R3: 4 },
 draw: R => drawWith(() => ({ E1: R.pick([6, 9, 12, 15, 18, 20, 24, 30, 36, 48]), R1: R.int(1, 12), R2: R.int(1, 20), R3: R.int(1, 10) }),
  p => { const I = p.E1 / (p.R1 + p.R2), E2 = I * p.R2; return fits(I, 2) && fits(E2, 2) && I >= 0.1 && Math.abs(I - E2) > 0.004 && !(p.E1 === 12 && p.R1 === 2 && p.R2 === 4); },
  { E1: 20, R1: 5, R2: 15, R3: 4 }),
 build: ({ E1, R1, R2, R3 }) => { const I = E1 / (R1 + R2), E2 = I * R2; return {
  prompt: `A spare battery is being trimmed on the junction board in the Cable Works. Junctions A (top) and B (bottom) are joined by three branches. Left branch: the main battery, emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with R₁ = ${n(R1)} Ω. Middle branch: a test lamp of R₂ = ${n(R2)} Ω alone. Right branch: the spare battery, with its positive terminal towards A, in series with R₃ = ${n(R3)} Ω. The crew adjusts the spare battery’s emf until no current at all flows in the right branch. The main battery is ideal and the wires have no resistance. Enter the current in the lamp from A to B in amperes, then the emf the spare battery has at that moment in volts. Both are exact decimals.`,
  answer: [I, E2],
  hints: ['If no current flows in the right branch, the junction rule at A says the lamp carries all of the left branch’s current. With no current in R₃ there is no voltage lost across R₃ either (I × R = 0).', 'Left loop: the main battery’s emf is shared by R₁ and R₂, which now carry the same current in series. Right loop: going up the right branch and down the lamp, the spare battery’s emf must equal the voltage across the lamp.'],
  solution: `With I₃ = 0 the junction rule gives I₂ = I₁, so the main battery drives one current through R₁ and R₂ in series: ${n(E1)} − ${n(R1)} × I₂ − ${n(R2)} × I₂ = 0, so I₂ = ${n(E1)} ÷ ${n(R1 + R2)} = ${n(I)} A. In the right loop no current crosses R₃, so ε₂ − 0 − ${n(R2)} × I₂ = 0 and ε₂ = ${n(R2)} × ${n(I)} = ${n(E2)} V. R₃ does not matter at this balance.`,
  guidance: [
   { prompt: `With nothing flowing in the right branch, the main battery’s ${n(E1)} V drives one current through R₁ = ${n(R1)} Ω and the lamp R₂ = ${n(R2)} Ω in series. What is the lamp current (A)?`, answer: [I], explanation: `I = ε₁ ÷ (R₁ + R₂) = ${n(E1)} ÷ ${n(R1 + R2)} = ${n(I)} A.` },
   { prompt: `No current crosses R₃, so the spare battery’s emf must equal the voltage across the lamp, which carries ${n(I)} A. What is ε₂ (V)?`, answer: [E2], explanation: `ε₂ = I × R₂ = ${n(I)} × ${n(R2)} = ${n(E2)} V.` }
  ] }; }
});

/* Three branches, each a battery (+ towards A) in series with a resistor. Built from V, I1, I2 so every step is exact;
   V = (ΣE/R) ÷ (Σ1/R) is shown over the lcm of the resistors. */
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', title: 'Three batteries on one junction',
 brief: 'Three batteries now feed the same pair of junctions, and the crew must know which of them are delivering current and which are being charged.',
 labels: ['I₁ (A)', 'I₂ (A)', 'I₃ (A)'], tolerance: 0.005,
 gl: [['voltage of A above B (V)'], ['I₁ (A)'], ['I₂ (A)'], ['I₃ (A)']]
}, {
 canonical: { E1: 14, E2: 8, E3: 2.5, R1: 2, R2: 4, R3: 5 },
 draw: R => drawWith(() => { const Rs = [R.pick([1, 2, 4, 5, 10]), R.pick([1, 2, 4, 5, 10]), R.pick([1, 2, 4, 5, 10])], V = R.int(4, 20),
   I1 = R.int(-8, 8) / 2, I2 = R.int(-8, 8) / 2, I3 = -(I1 + I2); return { E1: V + Rs[0] * I1, E2: V + Rs[1] * I2, E3: V + Rs[2] * I3, R1: Rs[0], R2: Rs[1], R3: Rs[2] }; },
  p => { const L = lcm(lcm(p.R1, p.R2), p.R3), den = L / p.R1 + L / p.R2 + L / p.R3, num = p.E1 * L / p.R1 + p.E2 * L / p.R2 + p.E3 * L / p.R3, V = num / den,
   Is = [(p.E1 - V) / p.R1, (p.E2 - V) / p.R2, (p.E3 - V) / p.R3]; return [p.E1, p.E2, p.E3].every(e => e > 0.4 && e <= 60 && fits(e, 2)) && Is.every(x => fits(x, 2) && Math.abs(x) > 0.004) && fits(V, 2); },
  { E1: 14, E2: 8, E3: 2.5, R1: 2, R2: 4, R3: 5 }),
 build: ({ E1, E2, E3, R1, R2, R3 }) => { const L = lcm(lcm(R1, R2), R3), k1 = L / R1, k2 = L / R2, k3 = L / R3, den = k1 + k2 + k3, num = E1 * k1 + E2 * k2 + E3 * k3, V = num / den,
  I1 = (E1 - V) / R1, I2 = (E2 - V) / R2, I3 = (E3 - V) / R3, neg = [['I₁', I1], ['I₂', I2], ['I₃', I3]].filter(x => x[1] < 0).map(x => x[0]); return {
  prompt: `Three batteries share one pair of junctions in the Cable Works, A at the top and B at the bottom, joined by three branches. Branch 1: a battery of emf ε₁ = ${n(E1)} V in series with R₁ = ${n(R1)} Ω. Branch 2: a battery of emf ε₂ = ${n(E2)} V in series with R₂ = ${n(R2)} Ω. Branch 3: a battery of emf ε₃ = ${n(E3)} V in series with R₃ = ${n(R3)} Ω. In every branch the battery’s positive terminal is towards A. The batteries are ideal, the wires have no resistance, and nothing else is connected at A or B. Call I₁, I₂ and I₃ the currents up branches 1, 2 and 3 towards A. Enter I₁, I₂ and I₃ in amperes; a negative value means that current really flows the other way. Each is an exact decimal with at most 2 places.`,
  answer: [I1, I2, I3],
  hints: ['Call V the voltage of A above B. Walking up any branch from B to A you gain its emf and lose I × R, so V = ε − I × R in every branch, which gives each current as (ε − V) ÷ R.', 'Nothing else is connected at A, so by the junction rule the three currents arriving at A add up to zero. Put the three expressions (ε − V) ÷ R into that sum and solve for V first; multiplying every term by a number that all three resistances divide clears the fractions.'],
  solution: `Let V be the voltage of A above B. Up branch k, V = ε_k − I_k R_k, so I_k = (ε_k − V) ÷ R_k. The junction rule at A is I₁ + I₂ + I₃ = 0, that is (${n(E1)} − V) ÷ ${n(R1)} + (${n(E2)} − V) ÷ ${n(R2)} + (${n(E3)} − V) ÷ ${n(R3)} = 0. Multiplying every term by ${n(L)}: ${n(k1)} × (${n(E1)} − V) + ${n(k2)} × (${n(E2)} − V) + ${n(k3)} × (${n(E3)} − V) = 0, so ${n(num)} = ${n(den)} × V and V = ${n(V)} V. Then I₁ = (${n(E1)} − ${n(V)}) ÷ ${n(R1)} = ${n(I1)} A, I₂ = (${n(E2)} − ${n(V)}) ÷ ${n(R2)} = ${n(I2)} A and I₃ = (${n(E3)} − ${n(V)}) ÷ ${n(R3)} = ${n(I3)} A. Check: ${n(I1)} + ${par(I2)} + ${par(I3)} = 0.${neg.length ? ` ${neg.length > 1 ? `The minus signs on ${neg.join(' and ')} mean that those currents flow down their branches, so those batteries are being charged by the other one.` : `The minus sign on ${neg[0]} means that current flows down its branch, so that battery is being charged by the others.`}` : ''}`,
  guidance: [
   { prompt: `Multiply (${n(E1)} − V) ÷ ${n(R1)} + (${n(E2)} − V) ÷ ${n(R2)} + (${n(E3)} − V) ÷ ${n(R3)} = 0 through by ${n(L)} and solve for V. What is the voltage of A above B (V)?`, answer: [V], explanation: `${n(k1)} × (${n(E1)} − V) + ${n(k2)} × (${n(E2)} − V) + ${n(k3)} × (${n(E3)} − V) = 0 gives ${n(num)} = ${n(den)} × V, so V = ${n(V)} V.` },
   { prompt: `With V = ${n(V)} V, what is I₁ = (ε₁ − V) ÷ R₁ (A)?`, answer: [I1], explanation: `(${n(E1)} − ${n(V)}) ÷ ${n(R1)} = ${n(E1 - V)} ÷ ${n(R1)} = ${n(I1)} A.` },
   { prompt: `With V = ${n(V)} V, what is I₂ = (ε₂ − V) ÷ R₂ (A)?`, answer: [I2], explanation: `(${n(E2)} − ${n(V)}) ÷ ${n(R2)} = ${n(E2 - V)} ÷ ${n(R2)} = ${n(I2)} A.` },
   { prompt: `With V = ${n(V)} V, what is I₃ = (ε₃ − V) ÷ R₃ (A)? It must also make the three currents add to zero.`, answer: [I3], explanation: `(${n(E3)} − ${n(V)}) ÷ ${n(R3)} = ${n(E3 - V)} ÷ ${n(R3)} = ${n(I3)} A, and ${n(I1)} + ${par(I2)} + ${par(I3)} = 0.` }
  ] }; }
});

/* ---- q28 Charging a capacitor: RC time constant [10.5] ---- */

/* R in megaohms and C in microfarads (MΩ × μF = s). Time constant, and the charging current at t = m·τ in μA. The
   current at t is rounded to 2 places away from ties. Not the parent's units (kΩ). */
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Timing the greenhouse door',
 brief: 'The greenhouse door is held shut by a timer circuit, and the crew needs to know how long it counts and how much current it draws while it does.',
 labels: ['time constant (s)', 'charging current (μA)'], tolerance: 0.005,
 gl: [['time constant (s)'], ['current at the start (μA)'], ['charging current (μA)']]
}, {
 canonical: { E: 15, R: 2, C: 5, m: 1.5 },
 draw: R => drawWith(() => ({ E: R.pick([5, 6, 9, 10, 12, 15, 18, 20, 24]), R: R.pick([1, 2, 2.5, 4, 5, 8, 10]), C: R.pick([2, 4, 5, 10, 20, 25, 50]), m: R.pick([0.5, 1, 1.5, 2, 2.5, 3]) }),
  p => { const tau = p.R * p.C, t = p.m * tau, I = p.E / p.R * Math.exp(-p.m); return tau <= 100 && fits(t, 2) && fits(p.E / p.R, 2) && roundable(I) && I >= 0.05 && !(p.E === 9 && p.R === 0.1); },
  { E: 15, R: 2, C: 5, m: 1.5 }),
 build: ({ E, R, C, m }) => { const tau = R * C, t = m * tau, I0 = E / R, I = I0 * Math.exp(-m); return {
  prompt: `A timer that holds the greenhouse door shut uses an empty capacitor of ${n(C)} μF charged through a resistor of ${n(R)} MΩ from an ideal supply of emf ${n(E)} V; the switch closes at t = 0. A megaohm (MΩ) is 10⁶ Ω. Enter the time constant of the circuit in seconds, then the current through the resistor ${n(t)} s after the switch closes, in microamperes (μA, 10⁻⁶ A), rounded to 2 decimal places.`,
  answer: [tau, r2(I)],
  hints: ['The time constant is τ = RC with R in ohms and C in farads. A megaohm is 10⁶ Ω and a microfarad is 10⁻⁶ F, so MΩ × μF gives seconds directly.', 'The instant the switch closes the capacitor has no voltage, so all of ε is across the resistor and the current is ε ÷ R; volts divided by megaohms give microamperes. It then falls as I = (ε ÷ R)e^(−t/τ).'],
  solution: `τ = RC = ${n(R)} × 10⁶ Ω × ${n(C)} × 10⁻⁶ F = ${n(tau)} s. The current at the start is ε ÷ R = ${n(E)} ÷ ${n(R)} = ${n(I0)} μA. At t = ${n(t)} s, t ÷ τ = ${n(m)}, so I = ${n(I0)} × e^(−${n(m)}) ≈ ${n(I0)} × ${n(Math.exp(-m))} ≈ ${n(I)} μA, which rounds to ${f2(I)} μA.`,
  guidance: [
   { prompt: `R = ${n(R)} MΩ and C = ${n(C)} μF. What is the time constant τ = RC (s)?`, answer: [tau], explanation: `${n(R)} × 10⁶ × ${n(C)} × 10⁻⁶ = ${n(R)} × ${n(C)} = ${n(tau)} s.` },
   { prompt: `At the instant the switch closes the whole ${n(E)} V is across the ${n(R)} MΩ resistor. What current flows then, ε ÷ R (μA)?`, answer: [I0], explanation: `${n(E)} ÷ ${n(R)} = ${n(I0)} μA: volts divided by megaohms give microamperes.` },
   { prompt: `At t = ${n(t)} s, which is ${n(m)} time constants, the current has fallen to ${n(I0)} × e^(−${n(m)}). What is it (μA), to 2 decimal places?`, answer: [r2(I)], explanation: `e^(−${n(m)}) ≈ ${n(Math.exp(-m))}, so I ≈ ${n(I0)} × ${n(Math.exp(-m))} ≈ ${n(I)} μA, which rounds to ${f2(I)} μA.` }
  ] }; }
});

/* A latch releases when the capacitor voltage reaches Vt. t = τ ln(E/(E − Vt)) rounded to 2 places away from ties;
   the energy ½CV² at that voltage is exact (mJ). */
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'The fire-door latch',
 brief: 'A fire-door latch lets go when a capacitor has charged to a set voltage, and the crew must know how long that takes and how much energy the capacitor holds then.',
 labels: ['release time (s)', 'energy stored (mJ)'], tolerance: 0.005,
 gl: [['time constant (s)'], ['release time (s)'], ['energy stored (mJ)']]
}, {
 canonical: { E: 15, R: 40, C: 250, Vt: 8 },
 draw: R => drawWith(() => ({ E: R.pick([6, 9, 12, 15, 18, 24, 30, 48]), R: R.pick([10, 20, 25, 40, 50, 100]), C: R.pick([100, 200, 250, 400, 500, 1000]), Vt: R.int(2, 40) / 2 }),
  p => { if (p.Vt >= p.E - 1) return false; const tau = p.R * p.C / 1000, t = tau * Math.log(p.E / (p.E - p.Vt)), U = p.C * p.Vt * p.Vt / 2000; return tau <= 100 && roundable(t) && t >= 0.1 && fits(U, 2) && U >= 0.05 && U < 1000 && !(p.E === 12 && p.R === 20 && p.C === 250); },
  { E: 15, R: 40, C: 250, Vt: 8 }),
 build: ({ E, R, C, Vt }) => { const tau = R * C / 1000, ratio = E / (E - Vt), t = tau * Math.log(ratio), U = C * Vt * Vt / 2000; return {
  prompt: `A fire-door latch in the Cable Works lets go when the voltage across an empty capacitor reaches ${n(Vt)} V. The capacitor of ${n(C)} μF is charged through a resistor of ${n(R)} kΩ from an ideal supply of emf ${n(E)} V, and the switch closes at t = 0. Solving V = ε(1 − e^(−t/τ)) for t gives t = τ ln(ε ÷ (ε − V)), where ln is the natural logarithm: the ln button on a calculator, which undoes e^x. Enter how many seconds after the switch closes the latch lets go, rounded to 2 decimal places, then the energy stored in the capacitor at that moment in millijoules (1 mJ = 1000 μJ).`,
  answer: [r2(t), U],
  hints: ['The time constant is τ = RC with R in ohms and C in farads: kΩ × μF gives 10⁻³ s. Then put the release voltage and the emf into t = τ ln(ε ÷ (ε − V)).', 'A capacitor of C at a voltage V stores U = ½CV². A capacitance in μF times a voltage squared in V² gives microjoules.'],
  solution: `τ = RC = ${n(R)} × 10³ Ω × ${n(C)} × 10⁻⁶ F = ${n(tau)} s. Then t = τ ln(ε ÷ (ε − V)) = ${n(tau)} × ln(${n(E)} ÷ ${n(E - Vt)}) ≈ ${n(tau)} × ${n(Math.log(ratio))} ≈ ${n(t)} s, which rounds to ${f2(t)} s. At that moment the capacitor is at ${n(Vt)} V, so U = ½CV² = ½ × ${n(C)} × ${n(Vt * Vt)} = ${n(C * Vt * Vt / 2)} μJ = ${n(U)} mJ.`,
  guidance: [
   { prompt: `R = ${n(R)} kΩ and C = ${n(C)} μF. What is the time constant τ = RC (s)?`, answer: [tau], explanation: `${n(R)} × 10³ × ${n(C)} × 10⁻⁶ = ${n(R * C)} × 10⁻³ = ${n(tau)} s.` },
   { prompt: `Put τ = ${n(tau)} s, ε = ${n(E)} V and V = ${n(Vt)} V into t = τ ln(ε ÷ (ε − V)). What is t (s), to 2 decimal places?`, answer: [r2(t)], explanation: `ε − V = ${n(E - Vt)}, so t = ${n(tau)} × ln(${n(E)} ÷ ${n(E - Vt)}) ≈ ${n(tau)} × ${n(Math.log(ratio))} ≈ ${n(t)} s, which rounds to ${f2(t)} s.` },
   { prompt: `At the release the capacitor of ${n(C)} μF is at ${n(Vt)} V. What energy does it store, U = ½CV² (mJ)?`, answer: [U], explanation: `½ × ${n(C)} × ${n(Vt * Vt)} = ${n(C * Vt * Vt / 2)} μJ, which is ${n(U)} mJ.` }
  ] }; }
});

/* The capacitor is a bank of two capacitors, in parallel (w = 0) or in series (w = 1) (q19); τ = R·Ceq/1000 s and the
   voltage at t = m·τ rounded to 2 places away from ties. */
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q19', title: 'A two-capacitor backup bank',
 brief: 'The backup bank is two capacitors wired together, and the crew needs to know how fast it charges before the next load comes on.',
 labels: ['equivalent capacitance (μF)', 'time constant (s)', 'bank voltage (V)'], tolerance: 0.005,
 gl: [['equivalent capacitance (μF)'], ['time constant (s)'], ['time constants passed'], ['bank voltage (V)']]
}, {
 canonical: { C1: 300, C2: 600, w: 1, R: 25, E: 24, m: 2 },
 draw: R => drawWith(() => ({ C1: R.pick([100, 150, 200, 300, 400, 500, 600, 800, 1000]), C2: R.pick([100, 150, 200, 300, 400, 500, 600, 800, 1000]), w: R.int(0, 1), R: R.pick([10, 20, 25, 40, 50, 100]), E: R.pick([6, 9, 12, 15, 18, 24, 30, 48]), m: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]) }),
  p => { const C = p.w ? pp(p.C1, p.C2) : p.C1 + p.C2, tau = p.R * C / 1000, t = p.m * tau, V = p.E * (1 - Math.exp(-p.m)); return fits(C, 2) && fits(tau, 2) && tau <= 100 && fits(t, 2) && roundable(V); },
  { C1: 300, C2: 600, w: 1, R: 25, E: 24, m: 2 }),
 build: ({ C1, C2, w, R, E, m }) => { const C = w ? pp(C1, C2) : C1 + C2, tau = R * C / 1000, t = m * tau, V = E * (1 - Math.exp(-m)); return {
  prompt: `The backup bank in the Battery Vault is two empty capacitors, ${n(C1)} μF and ${n(C2)} μF, ${w ? 'joined one after the other (in series)' : 'joined side by side (in parallel)'}. The bank is charged through a resistor of ${n(R)} kΩ from an ideal supply of emf ${n(E)} V, and the switch closes at t = 0. ${w ? 'For two capacitors in series 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂, which is C₁C₂ ÷ (C₁ + C₂).' : 'For capacitors in parallel the capacitances add, C = C₁ + C₂.'} Treat the bank as a single capacitor. Enter its equivalent capacitance in μF (type it without commas), then the time constant of the circuit in seconds, then the voltage across the bank ${n(t)} s after the switch closes, in volts, rounded to 2 decimal places.`,
  answer: [C, tau, r2(V)],
  hints: [w ? 'Two capacitors in series: C = C₁C₂ ÷ (C₁ + C₂), always less than either one. The bank then charges like one capacitor of that size.' : 'Two capacitors in parallel: C = C₁ + C₂, more than either one. The bank then charges like one capacitor of that size.', 'The time constant is τ = RC with R in ohms and C in farads, so kΩ × μF gives 10⁻³ s. The bank voltage at time t is V = ε(1 − e^(−t/τ)).'],
  solution: `${w ? `In series: C = ${n(C1)} × ${n(C2)} ÷ (${n(C1)} + ${n(C2)}) = ${n(C1 * C2)} ÷ ${n(C1 + C2)} = ${n(C)} μF` : `In parallel: C = ${n(C1)} + ${n(C2)} = ${n(C)} μF`}. Then τ = RC = ${n(R)} × 10³ Ω × ${n(C)} × 10⁻⁶ F = ${n(tau)} s. At t = ${n(t)} s, t ÷ τ = ${n(m)}, so V = ${n(E)} × (1 − e^(−${n(m)})) ≈ ${n(E)} × ${n(1 - Math.exp(-m))} ≈ ${n(V)} V, which rounds to ${f2(V)} V.`,
  guidance: [
   { prompt: w ? `The capacitors of ${n(C1)} μF and ${n(C2)} μF are in series. What single capacitance replaces them (μF)?` : `The capacitors of ${n(C1)} μF and ${n(C2)} μF are in parallel. What single capacitance replaces them (μF)?`, answer: [C], explanation: w ? `C = C₁C₂ ÷ (C₁ + C₂) = ${n(C1 * C2)} ÷ ${n(C1 + C2)} = ${n(C)} μF.` : `The capacitances add: ${n(C1)} + ${n(C2)} = ${n(C)} μF.` },
   { prompt: `R = ${n(R)} kΩ and the bank is ${n(C)} μF. What is the time constant τ = RC (s)?`, answer: [tau], explanation: `${n(R)} × 10³ × ${n(C)} × 10⁻⁶ = ${n(R * C)} × 10⁻³ = ${n(tau)} s.` },
   { prompt: `How many time constants have passed at t = ${n(t)} s? Enter t ÷ τ.`, answer: [m], explanation: `${n(t)} ÷ ${n(tau)} = ${n(m)}.` },
   { prompt: `What is V = ${n(E)} × (1 − e^(−${n(m)})) in volts, to 2 decimal places?`, answer: [r2(V)], explanation: `e^(−${n(m)}) ≈ ${n(Math.exp(-m))}, so V ≈ ${n(E)} × ${n(1 - Math.exp(-m))} ≈ ${n(V)} V, which rounds to ${f2(V)} V.` }
  ] }; }
});

/* ---- q29 Chapter review: a full circuit [10.2, 10.3] ---- */

/* The parent's network with the parallel pair (Ra, Rb) moved to the LEFT branch, behind the lead R1. The left current
   is positive in every draw so the pair's currents are too. Asks I2 and the current in the Ra coil. */
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Coils on the pump-house lead',
 brief: 'Two heating coils sit on one battery’s lead in the pump house, and the crew needs to know how much current reaches the pump and each coil.',
 labels: ['middle current (A)', 'current in the first coil (A)'], tolerance: 0.005,
 gl: [['pair of coils (Ω)'], ['middle current (A)'], ['current in the first coil (A)']]
}, {
 canonical: { E1: 24, E2: 24, R1: 2, Ra: 4, Rb: 12, R2: 2, R3: 2 },
 draw: R => drawWith(() => ({ E1: R.pick([6, 9, 12, 15, 18, 24, 30, 36]), E2: R.pick([3, 6, 9, 12, 15, 18, 24]), R1: R.pick([1, 2, 3, 4, 6, 8]), Ra: R.pick([2, 3, 4, 6, 8, 12]), Rb: R.pick([2, 3, 4, 6, 8, 12]), R2: R.pick([1, 2, 3, 4, 5, 6, 8, 10]), R3: R.pick([1, 2, 3, 4, 6, 8]) }),
  p => { if (p.Ra === p.Rb) return false; const Rab = pp(p.Ra, p.Rb), k = kirch(p.E1, p.E2, p.R1 + Rab, p.R2, p.R3), Vp = k.I1 * Rab, Ia = Vp / p.Ra;
   return fits(Rab, 2) && [k.I1, k.I2, k.I3].every(x => fits(x, 2) && Math.abs(x) > 0.004) && k.I1 > 0 && fits(Vp, 2) && fits(Ia, 2) && Math.abs(k.I2 - Ia) > 0.004; },
  { E1: 24, E2: 24, R1: 2, Ra: 4, Rb: 12, R2: 2, R3: 2 }),
 build: ({ E1, E2, R1, Ra, Rb, R2, R3 }) => { const Rab = pp(Ra, Rb), Rl = R1 + Rab, k = kirch(E1, E2, Rl, R2, R3), Vp = k.I1 * Rab, Ia = Vp / Ra; return {
  prompt: `The pump house in the Cable Works is wired between junction A at the top and junction B at the bottom, with three branches. Left branch: a battery of emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with a lead of ${n(R1)} Ω and then two heating coils of ${n(Ra)} Ω and ${n(Rb)} Ω connected in parallel with each other. Middle branch: the pump, ${n(R2)} Ω alone. Right branch: a battery of emf ε₂ = ${n(E2)} V with its positive terminal towards A, in series with ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. Enter the current down the middle branch from A to B in amperes, then the current through the ${n(Ra)} Ω coil in amperes. Both are exact decimals.`,
  answer: [k.I2, Ia],
  hints: ['Replace the two coils by one equivalent resistor (their product divided by their sum) and add the lead’s resistance in series: the left branch then has a single resistance, and the junction and loop rules work as for three single branches.', 'The two coils share one voltage: the left branch current times their equivalent resistance. The current in each coil is that voltage divided by the coil’s own resistance.'],
  solution: `The two coils in parallel: ${n(Ra)} × ${n(Rb)} ÷ ${n(Ra + Rb)} = ${n(Rab)} Ω. With the lead, the left branch has ${n(R1)} + ${n(Rab)} = ${n(Rl)} Ω in all. With I₁ up the left branch, I₂ down the middle and I₃ up the right branch, the junction rule gives I₂ = I₁ + I₃ and the two loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Solving: I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A and I₃ = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, so I₂ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A. The coils share the voltage ${n(k.I1)} × ${n(Rab)} = ${n(Vp)} V, so the ${n(Ra)} Ω coil carries ${n(Vp)} ÷ ${n(Ra)} = ${n(Ia)} A.`,
  guidance: [
   { prompt: `The two coils of ${n(Ra)} Ω and ${n(Rb)} Ω are in parallel. What single resistance replaces them (Ω)?`, answer: [Rab], explanation: `R = ${n(Ra * Rb)} ÷ ${n(Ra + Rb)} = ${n(Rab)} Ω.` },
   { prompt: `With the lead the left branch has ${n(Rl)} Ω, so the loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃, where I₁ and I₃ flow up the side branches towards A. Solve them and use the junction rule. What is the current down the middle branch (A)?`, answer: [k.I2], explanation: `I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A and I₃ = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, so I₂ = I₁ + I₃ = ${n(k.I2)} A.` },
   { prompt: `The left branch current of ${n(k.I1)} A flows through the ${n(Rab)} Ω pair of coils and divides between them. What current flows in the ${n(Ra)} Ω coil (A)?`, answer: [Ia], explanation: `The voltage across the pair is ${n(k.I1)} × ${n(Rab)} = ${n(Vp)} V, so the ${n(Ra)} Ω coil carries ${n(Vp)} ÷ ${n(Ra)} = ${n(Ia)} A.` }
  ] }; }
});

/* The parent's network. Heater Rb burns out, so the middle branch changes from Ra ∥ Rb to Ra alone. Asks the power in
   the Ra heater before and after. All the printed intermediate steps are exact decimals. */
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'When a heater burns out',
 brief: 'One of two heaters may burn out in the storm, and the crew wants to know how much harder the survivor will be driven.',
 labels: ['power before (W)', 'power after (W)'], tolerance: 0.005,
 gl: [['voltage across the middle branch (V)'], ['power in the heater before (W)'], ['power in the heater after (W)']]
}, {
 canonical: { E1: 18, E2: 15, R1: 3, Ra: 2, Rb: 6, R3: 4 },
 draw: R => drawWith(() => ({ E1: R.pick([6, 9, 12, 15, 18, 24, 30, 36]), E2: R.pick([3, 6, 9, 12, 15, 18, 24]), R1: R.pick([1, 2, 3, 4, 6, 8]), Ra: R.pick([2, 3, 4, 6, 8, 12]), Rb: R.pick([2, 3, 4, 6, 8, 12]), R3: R.pick([1, 2, 3, 4, 6, 8]) }),
  p => { if (p.Ra === p.Rb) return false; const Rab = pp(p.Ra, p.Rb), k = kirch(p.E1, p.E2, p.R1, Rab, p.R3), k2 = kirch(p.E1, p.E2, p.R1, p.Ra, p.R3), Vm = k.I2 * Rab, Pb = Vm * Vm / p.Ra, Pa = k2.I2 * k2.I2 * p.Ra;
   return fits(Rab, 2) && [k.I1, k.I2, k.I3, k2.I1, k2.I2, k2.I3].every(x => fits(x, 2)) && k.I2 > 0.004 && k2.I2 > 0.004 && fits(Vm, 2) && fits(Pb, 2) && fits(Pa, 2) && Pb < 1000 && Pa < 1000 && Math.abs(Pb - Pa) > 0.004 && !same(p, { E1: 18, E2: 9, R1: 3, Ra: 3, Rb: 6, R3: 6 }); },
  { E1: 18, E2: 15, R1: 3, Ra: 2, Rb: 6, R3: 4 }),
 build: ({ E1, E2, R1, Ra, Rb, R3 }) => { const Rab = pp(Ra, Rb), k = kirch(E1, E2, R1, Rab, R3), k2 = kirch(E1, E2, R1, Ra, R3), Vm = k.I2 * Rab, Pb = Vm * Vm / Ra, Pa = k2.I2 * k2.I2 * Ra; return {
  prompt: `The charging posts in the Cable Works are fed by two batteries. Junction A at the top and junction B at the bottom are joined by three branches. Left branch: a battery of emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with R₁ = ${n(R1)} Ω. Middle branch: two heaters of ${n(Ra)} Ω and ${n(Rb)} Ω connected in parallel between A and B. Right branch: a battery of emf ε₂ = ${n(E2)} V with its positive terminal towards A, in series with R₃ = ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. In a storm the ${n(Rb)} Ω heater burns out: it becomes a break that carries no current, and the ${n(Ra)} Ω heater is left alone in the middle branch. Enter the power turned into heat in the ${n(Ra)} Ω heater before the failure in watts, then the power in the same heater after it, in watts. Both are exact decimals.`,
  answer: [Pb, Pa],
  hints: ['Before the failure, replace the two heaters by one equivalent resistor (their product divided by their sum) and solve the junction and loop rules for the middle current; both heaters share the voltage the middle current drives across that equivalent resistor. After the failure the middle branch is the single heater: solve the rules again.', 'The power in one heater is V² ÷ R with its own voltage, or I²R with its own current. A heater that is alone in its branch carries the whole middle current.'],
  solution: `Before: the heaters in parallel make ${n(Ra)} × ${n(Rb)} ÷ ${n(Ra + Rb)} = ${n(Rab)} Ω. With I₁ up the left branch, I₂ down the middle and I₃ up the right branch, I₂ = I₁ + I₃ and the loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(Rab)} × I₃ and ${n(E2)} = ${n(Rab)} × I₁ + ${n(k.c)} × I₃. Solving: I₁ = ${n(k.I1)} A, I₃ = ${n(k.I3)} A and I₂ = ${n(k.I2)} A. The voltage across the middle branch is ${n(k.I2)} × ${n(Rab)} = ${n(Vm)} V, so the ${n(Ra)} Ω heater turns ${n(Vm)}² ÷ ${n(Ra)} = ${n(Pb)} W into heat. After: the middle branch is ${n(Ra)} Ω alone, and the loops give ${n(E1)} = ${n(k2.a)} × I₁ + ${n(Ra)} × I₃ and ${n(E2)} = ${n(Ra)} × I₁ + ${n(k2.c)} × I₃. Solving: I₁ = ${n(k2.I1)} A, I₃ = ${n(k2.I3)} A and I₂ = ${n(k2.I2)} A, all of it through the ${n(Ra)} Ω heater, which now turns I²R = ${n(k2.I2)}² × ${n(Ra)} = ${n(Pa)} W into heat.`,
  guidance: [
   { prompt: `Before the failure the two heaters make ${n(Rab)} Ω in parallel, and the junction and loop rules give ${n(k.I2)} A down the middle branch. What voltage is across the middle branch (V)?`, answer: [Vm], explanation: `V = IR = ${n(k.I2)} × ${n(Rab)} = ${n(Vm)} V, the same across each heater.` },
   { prompt: `The ${n(Ra)} Ω heater has ${n(Vm)} V across it. What power does it turn into heat before the failure (W)?`, answer: [Pb], explanation: `P = V² ÷ R = ${n(Vm * Vm)} ÷ ${n(Ra)} = ${n(Pb)} W.` },
   { prompt: `After the failure the middle branch is the ${n(Ra)} Ω heater alone. The loops give ${n(E1)} = ${n(k2.a)} × I₁ + ${n(Ra)} × I₃ and ${n(E2)} = ${n(Ra)} × I₁ + ${n(k2.c)} × I₃, where I₁ and I₃ flow up the side branches towards A. Solving them and using the junction rule gives ${n(k2.I2)} A through the heater. What power does it turn into heat now (W)?`, answer: [Pa], explanation: `P = I²R = ${n(k2.I2 * k2.I2)} × ${n(Ra)} = ${n(Pa)} W.` }
  ] }; }
});

/* The parent's network. Power a battery supplies is ε × (current leaving its + terminal) (q25); asks the power
   supplied by battery 2 (negative when it is being charged) and the total heat in all the resistors. */
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q25', title: 'Where the batteries’ power goes',
 brief: 'The crew wants a power account for the charging posts: what each battery puts in, and how much of it ends up as heat.',
 labels: ['power from battery 2 (W)', 'total heat in the resistors (W)'], tolerance: 0.005,
 gl: [['pair of heaters (Ω)'], ['power from battery 2 (W)'], ['total heat in the resistors (W)']]
}, {
 canonical: { E1: 36, E2: 6, R1: 4, Ra: 12, Rb: 6, R3: 6 },
 draw: R => drawWith(() => ({ E1: R.pick([6, 9, 12, 15, 18, 24, 30, 36]), E2: R.pick([3, 6, 9, 12, 15, 18, 24]), R1: R.pick([1, 2, 3, 4, 6, 8]), Ra: R.pick([2, 3, 4, 6, 8, 12]), Rb: R.pick([2, 3, 4, 6, 8, 12]), R3: R.pick([1, 2, 3, 4, 6, 8]) }),
  p => { if (p.Ra === p.Rb) return false; const Rab = pp(p.Ra, p.Rb), k = kirch(p.E1, p.E2, p.R1, Rab, p.R3), P2 = p.E2 * k.I3, H = k.I1 * k.I1 * p.R1 + k.I3 * k.I3 * p.R3 + k.I2 * k.I2 * Rab;
   return fits(Rab, 2) && [k.I1, k.I2, k.I3].every(x => fits(x, 2) && Math.abs(x) > 0.004) && fits(P2, 2) && Math.abs(P2) > 0.004 && fits(H, 2) && H < 2000 && Math.abs(P2 - H) > 0.004 && !same(p, { E1: 18, E2: 9, R1: 3, Ra: 3, Rb: 6, R3: 6 }); },
  { E1: 36, E2: 6, R1: 4, Ra: 12, Rb: 6, R3: 6 }),
 build: ({ E1, E2, R1, Ra, Rb, R3 }) => { const Rab = pp(Ra, Rb), k = kirch(E1, E2, R1, Rab, R3), P2 = E2 * k.I3, H1 = k.I1 * k.I1 * R1, H3 = k.I3 * k.I3 * R3, H2 = k.I2 * k.I2 * Rab, H = H1 + H3 + H2, P1 = E1 * k.I1; return {
  prompt: `The charging posts in the Cable Works are fed by two batteries. Junction A at the top and junction B at the bottom are joined by three branches. Left branch: battery 1, emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with R₁ = ${n(R1)} Ω. Middle branch: two heaters of ${n(Ra)} Ω and ${n(Rb)} Ω connected in parallel between A and B. Right branch: battery 2, emf ε₂ = ${n(E2)} V with its positive terminal towards A, in series with R₃ = ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. The power a battery supplies is its emf times the current leaving its positive terminal through the circuit (P = εI, as in the Ohm’s law mission); it is negative when the other battery is charging it. Enter the power supplied by battery 2 in watts (negative if it is being charged), then the total power turned into heat in all four resistors together (R₁, R₃ and the two heaters) in watts. Both are exact decimals.`,
  answer: [P2, H],
  hints: ['Replace the two heaters by one equivalent resistor (their product divided by their sum), then use the junction and loop rules for the three branch currents. Battery 2 supplies its emf times I₃, the current up the right branch, whose sign decides whether it delivers or absorbs power.', 'The heat in a resistor is I²R with its own current; the pair of heaters together turns I₂² times their equivalent resistance into heat. Add the heat in R₁, in R₃ and in the pair. As a check, the batteries’ powers add up to the same total.'],
  solution: `The heaters in parallel: ${n(Ra)} × ${n(Rb)} ÷ ${n(Ra + Rb)} = ${n(Rab)} Ω. With I₁ up the left branch, I₂ down the middle and I₃ up the right branch, I₂ = I₁ + I₃ and the loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(Rab)} × I₃ and ${n(E2)} = ${n(Rab)} × I₁ + ${n(k.c)} × I₃. Solving: I₁ = ${n(k.I1)} A, I₃ = ${n(k.I3)} A and I₂ = ${n(k.I2)} A. Battery 2 supplies ε₂I₃ = ${n(E2)} × ${par(k.I3)} = ${n(P2)} W. The heat: R₁ takes ${par(k.I1)}² × ${n(R1)} = ${n(H1)} W, R₃ takes ${par(k.I3)}² × ${n(R3)} = ${n(H3)} W and the pair of heaters takes ${par(k.I2)}² × ${n(Rab)} = ${n(H2)} W, in all ${n(H)} W. Check: battery 1 supplies ${n(E1)} × ${n(k.I1)} = ${n(P1)} W, and ${n(P1)} + ${par(P2)} = ${n(P1 + P2)} W, the same total.`,
  guidance: [
   { prompt: `The two heaters of ${n(Ra)} Ω and ${n(Rb)} Ω are in parallel. What single resistance replaces them (Ω)?`, answer: [Rab], explanation: `R = ${n(Ra * Rb)} ÷ ${n(Ra + Rb)} = ${n(Rab)} Ω.` },
   { prompt: `With the pair as ${n(Rab)} Ω the loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(Rab)} × I₃ and ${n(E2)} = ${n(Rab)} × I₁ + ${n(k.c)} × I₃, where I₁ and I₃ flow up the side branches towards A. Solving them gives I₁ = ${n(k.I1)} A and I₃ = ${n(k.I3)} A. What power does battery 2 supply, ε₂ × I₃ (W)?`, answer: [P2], explanation: `P = ε₂I₃ = ${n(E2)} × ${par(k.I3)} = ${n(P2)} W.` },
   { prompt: `The currents are I₁ = ${n(k.I1)} A through R₁ = ${n(R1)} Ω, I₃ = ${n(k.I3)} A through R₃ = ${n(R3)} Ω and I₂ = ${n(k.I2)} A through the ${n(Rab)} Ω pair of heaters. What is the total power turned into heat in all four resistors (W)?`, answer: [H], explanation: `I²R for each: ${n(H1)} + ${n(H3)} + ${n(H2)} = ${n(H)} W.` }
  ] }; }
});

/* ---- q30 Magnetic force on a moving charge, F = qvB sin θ [11.2] ---- */

/* As the parent, but the field may be turned towards −y (up = 0) as well as +y, and the charge may be negative.
   |q|vB is exact with at most 2 decimals; F is rounded to 2 places away from ties. */
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Sorting grains in the cleaning chute',
 brief: 'Charged grains fall down the ore sorter’s cleaning chute, and the crew needs the push on each one from the magnet beside it.',
 labels: ['force (units of 10⁻¹⁵ N)', 'direction (1 for +z, −1 for −z)'], tolerance: 0.005,
 gl: [['charge (units of 10⁻¹⁹ C)'], ['|q|vB (units of 10⁻¹⁵ N)'], ['force (units of 10⁻¹⁵ N)'], ['direction (1 or −1)']]
}, {
 canonical: { z: -3, V: 250, b: 40, th: 1.2, up: 0 },
 draw: R => drawWith(() => ({ z: R.pick([-3, -2, -1, 1, 2, 3]), V: 50 * R.int(2, 18), b: 5 * R.int(2, 20), th: R.int(3, 28) / 10, up: R.int(0, 1) }),
  p => { const F0 = 1.6 * Math.abs(p.z) * p.V * p.b / 10000, F = F0 * Math.sin(p.th); return fits(F0, 2) && roundable(F) && F >= 0.1 && !same(p, { z: 2, V: 400, b: 50, th: 0.9, up: 1 }) && !same(p, { z: 1, V: 300, b: 40, th: 0.5, up: 1 }); },
  { z: -3, V: 250, b: 40, th: 1.2, up: 0 }),
 build: ({ z, V, b, th, up }) => { const q = 1.6 * Math.abs(z), F0 = q * V * b / 10000, F = F0 * Math.sin(th), dir = (z > 0 ? 1 : -1) * (up ? 1 : -1), side = up ? '+y' : '−y', thumb = up ? '+z' : '−z'; return {
  prompt: `A charged grain in the ore sorter’s cleaning chute carries charge ${qtxt(z)} (e = 1.60 × 10⁻¹⁹ C) and moves at ${n(V)} km/s in the +x direction. The magnet beside the chute gives a field of strength ${n(b)} mT in the x–y plane, at θ = ${n(th)} rad from the +x direction, turned towards ${side}. Take x to the right, y up the page and +z out of the page. Enter the size of the magnetic force on the grain in units of 10⁻¹⁵ N, rounded to 2 decimal places, then its direction: 1 if it points along +z, −1 if along −z.`,
  answer: [r2(F), dir],
  hints: ['The size of the force is F = |q|vB sin θ, with q in C, v in m/s and B in T: 1 km/s = 1000 m/s and 1 mT = 0.001 T.', 'Right-hand rule: point the fingers of your right hand along v and curl them towards B through the smaller angle; your thumb gives the force on a positive charge. Turning the field the other way round the +x axis reverses the thumb, and a negative charge feels the force the opposite way again.'],
  solution: `|q| = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ = ${n(q)} × 10⁻¹⁹ C, v = ${n(V)} × 10³ m/s and B = ${n(b)} × 10⁻³ T, so |q|vB = ${n(q)} × ${n(V)} × ${n(b)} × 10⁻¹⁹ N = ${n(F0)} × 10⁻¹⁵ N. Then F = |q|vB sin θ = ${n(F0)} × sin ${n(th)} ≈ ${n(F0)} × ${n(Math.sin(th))} ≈ ${n(F)} × 10⁻¹⁵ N, which rounds to ${f2(F)}. Fingers along +x curled towards ${side} leave the thumb along ${thumb}, the force on a positive charge. ${z > 0 ? `The grain is positive, so the force points along ${thumb}: enter ${n(dir)}.` : `The grain is negative, so the force is reversed and points along ${up ? '−z' : '+z'}: enter ${n(dir)}.`}`,
  guidance: [
   { prompt: `The grain carries ${qtxt(z)}. What is the size of its charge in units of 10⁻¹⁹ C?`, answer: [q], explanation: `${n(Math.abs(z))} × 1.60 = ${n(q)}, so |q| = ${n(q)} × 10⁻¹⁹ C.` },
   { prompt: `Multiply |q| = ${n(q)} × 10⁻¹⁹ C, v = ${n(V)} × 10³ m/s and B = ${n(b)} × 10⁻³ T. What is |q|vB in units of 10⁻¹⁵ N?`, answer: [F0], explanation: `${n(q)} × ${n(V)} × ${n(b)} = ${n(q * V * b)}, times 10⁻¹⁹ N, which is ${n(F0)} × 10⁻¹⁵ N.` },
   { prompt: `The angle between v and B is ${n(th)} rad. What is F = |q|vB sin θ in units of 10⁻¹⁵ N, to 2 decimal places?`, answer: [r2(F)], explanation: `sin ${n(th)} ≈ ${n(Math.sin(th))}, so F ≈ ${n(F0)} × ${n(Math.sin(th))} ≈ ${n(F)}, which rounds to ${f2(F)}.` },
   { prompt: `For a positive charge here, fingers along +x curled towards ${side} give a thumb along ${thumb}. Which way is the force on this grain? Enter 1 for +z, −1 for −z.`, answer: [dir], explanation: z > 0 ? `The grain is positive, so the force is along ${thumb}: ${n(dir)}.` : `The grain is negative, so the force is reversed, along ${up ? '−z' : '+z'}: ${n(dir)}.` }
  ] }; }
});

/* The force the sorter must give (Ft, units 10⁻¹⁵ N) is the target; B in mT is found from F = |q|vB sin θ (rounded to
   2 places, and the same when K is first rounded to 2 places), then the acceleration a = F ÷ m in units of 10¹¹ m/s²
   for an ion of mass m (units 10⁻²⁶ kg). The sign of the charge does not matter. */
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Tuning the sorter magnet',
 brief: 'The sorter magnet must push each ion aside with a set force, so the crew needs to know how strong to make the field and how fast the ion will swerve.',
 labels: ['field strength (mT)', 'acceleration (units of 10¹¹ m/s²)'], tolerance: 0.005,
 gl: [['|q|v sin θ (units of 10⁻¹⁶ N/T)'], ['field strength (mT)'], ['acceleration (units of 10¹¹ m/s²)']]
}, {
 canonical: { z: 3, V: 300, th: 1.1, Ft: 7.5, m: 5 },
 draw: R => drawWith(() => ({ z: R.pick([-3, -2, -1, 1, 2, 3]), V: 50 * R.int(2, 18), th: R.int(3, 28) / 10, Ft: R.int(2, 40) / 2, m: R.int(10, 80) / 10 }),
  p => { const K = 1.6 * Math.abs(p.z) * p.V * Math.sin(p.th), B = 10000 * p.Ft / K, a = p.Ft / p.m; return roundable(B) && B >= 1 && B < 1000 && fits(a, 2) && roundable(K) && r2(10000 * p.Ft / r2(K)) === r2(B) && !same(p, { z: 1, V: 300, th: 0.5, Ft: 0.92, m: 1 }); },
  { z: 3, V: 300, th: 1.1, Ft: 7.5, m: 5 }),
 build: ({ z, V, th, Ft, m }) => { const K = 1.6 * Math.abs(z) * V * Math.sin(th), B = 10000 * Ft / K, a = Ft / m; return {
  prompt: `The ore sorter must push each ion sideways with a force of ${n(Ft)} × 10⁻¹⁵ N. The ions carry charge ${qtxt(z)} (e = 1.60 × 10⁻¹⁹ C), have a mass of ${n(m)} × 10⁻²⁶ kg and move at ${n(V)} km/s along +x. The magnet’s field lies in the x–y plane at θ = ${n(th)} rad from the +x direction. Enter the field strength needed in mT, rounded to 2 decimal places, then the sideways acceleration this force gives an ion, in units of 10¹¹ m/s² (acceleration = force ÷ mass).`,
  answer: [r2(B), a],
  hints: ['Solve F = |q|vB sin θ for the field: B = F ÷ (|q|v sin θ), with F in N, q in C, v in m/s and B in T. Then 1 T = 1000 mT.', 'The acceleration is a = F ÷ m, with F in N and m in kg. With the force in units of 10⁻¹⁵ N and the mass in units of 10⁻²⁶ kg, the quotient is in units of 10¹¹ m/s².'],
  solution: `|q|v sin θ = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ × ${n(V)} × 10³ × sin ${n(th)} ≈ ${n(K)} × 10⁻¹⁶ N/T. Then B = F ÷ (|q|v sin θ) ≈ ${n(Ft)} × 10⁻¹⁵ ÷ (${n(K)} × 10⁻¹⁶) ≈ ${n(B / 1000)} T = ${n(B)} mT, which rounds to ${f2(B)} mT. The acceleration is a = F ÷ m = ${n(Ft)} × 10⁻¹⁵ ÷ (${n(m)} × 10⁻²⁶) = ${n(a)} × 10¹¹ m/s².`,
  guidance: [
   { prompt: `Multiply |q| = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ C, v = ${n(V)} × 10³ m/s and sin θ = sin ${n(th)}. What is |q|v sin θ in units of 10⁻¹⁶ N/T, to 2 decimal places?`, answer: [r2(K)], explanation: `|q|v = ${n(Math.abs(z) * 1.6)} × ${n(V)} × 10⁻¹⁶ = ${n(Math.abs(z) * 1.6 * V)} × 10⁻¹⁶, and sin ${n(th)} ≈ ${n(Math.sin(th))}, so |q|v sin θ ≈ ${n(K)} × 10⁻¹⁶ N/T, which rounds to ${f2(K)}.` },
   { prompt: `The force is ${n(Ft)} × 10⁻¹⁵ N and |q|v sin θ is about ${f2(K)} × 10⁻¹⁶ N/T. What field strength B = F ÷ (|q|v sin θ) is needed, in mT, to 2 decimal places?`, answer: [r2(B)], explanation: `B ≈ ${n(Ft)} × 10⁻¹⁵ ÷ (${f2(K)} × 10⁻¹⁶) ≈ ${n(B / 1000)} T = ${n(B)} mT, which rounds to ${f2(B)} mT.` },
   { prompt: `The ion’s mass is ${n(m)} × 10⁻²⁶ kg and the force on it is ${n(Ft)} × 10⁻¹⁵ N. What acceleration a = F ÷ m does it get, in units of 10¹¹ m/s²?`, answer: [a], explanation: `${n(Ft)} × 10⁻¹⁵ ÷ (${n(m)} × 10⁻²⁶) = ${n(a)} × 10¹¹ m/s².` }
  ] }; }
});

/* Velocity selector (q04: the electric force on a charge is |q|E). The electric field points along ±z and the magnetic
   force along ∓z, so an undeflected ion has |q|E = |q|vB sin θ, so v = E ÷ (B sin θ). Asks v in km/s (2 places,
   away from ties) and the size of each force in units of 10⁻¹⁵ N (exact). */
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q04', title: 'The ion speed selector',
 brief: 'The ore sorter passes only ions of one chosen speed straight on, and the crew needs to know which speed that is and how big the balancing forces are.',
 labels: ['selected speed (km/s)', 'size of each force (units of 10⁻¹⁵ N)'], tolerance: 0.005,
 gl: [['electric force (units of 10⁻¹⁵ N)'], ['selected speed (km/s)']]
}, {
 canonical: { z: -3, E: 20, b: 45, th: 1.5 },
 draw: R => drawWith(() => ({ z: R.pick([-3, -2, -1, 1, 2, 3]), E: R.pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60]), b: 5 * R.int(3, 24), th: R.int(6, 28) / 10 }),
  p => { const v = 1000 * p.E / (p.b * Math.sin(p.th)), F = 0.16 * Math.abs(p.z) * p.E; return roundable(v) && v < 5000 && v >= 5 && fits(F, 2) && !same(p, { z: 1, E: 20, b: 40, th: 0.5 }); },
  { z: -3, E: 20, b: 45, th: 1.5 }),
 build: ({ z, E, b, th }) => { const v = 1000 * E / (b * Math.sin(th)), F = 0.16 * Math.abs(z) * E; return {
  prompt: `A velocity selector in the ore sorter lets only ions of one speed through undeflected. An ion of charge ${qtxt(z)} (e = 1.60 × 10⁻¹⁹ C) moves along +x through a region with a uniform electric field of strength ${n(E)} kV/m (1 kV/m = 1000 N/C) and a uniform magnetic field of strength ${n(b)} mT lying in the x–y plane at θ = ${n(th)} rad from the +x direction. The electric field points along the z axis, in the sense that makes its force on the ion exactly opposite to the magnetic force on it. The ion passes straight through, so the two forces have the same size. Enter the speed of the ion in km/s, rounded to 2 decimal places (type it without commas), then the size of each of the two forces in units of 10⁻¹⁵ N.`,
  answer: [r2(v), F],
  hints: ['An electric field E pushes on a charge q with a force of size |q|E. The magnetic force has size |q|vB sin θ. With no deflection the two are equal, and the charge cancels from the equation, which leaves v in terms of E, B and θ.', 'Use SI units: 1 kV/m = 1000 N/C and 1 mT = 0.001 T, and give the speed in km/s at the end (1 km/s = 1000 m/s).'],
  solution: `|q| = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ = ${n(Math.abs(z) * 1.6)} × 10⁻¹⁹ C and E = ${n(E)} × 10³ N/C, so the electric force is |q|E = ${n(Math.abs(z) * 1.6)} × ${n(E)} × 10⁻¹⁶ N = ${n(F)} × 10⁻¹⁵ N. The magnetic force is the same size: |q|vB sin θ = |q|E, so v = E ÷ (B sin θ) = ${n(E)} × 10³ ÷ (${n(b)} × 10⁻³ × sin ${n(th)}) = ${n(E * 1000)} ÷ (${n(b / 1000)} × sin ${n(th)}) ≈ ${n(v * 1000)} m/s = ${n(v)} km/s, which rounds to ${f2(v)} km/s.`,
  guidance: [
   { prompt: `The electric force on the ion is |q|E, with |q| = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ C and E = ${n(E)} × 10³ N/C. What is its size in units of 10⁻¹⁵ N?`, answer: [F], explanation: `${n(Math.abs(z) * 1.6)} × ${n(E)} = ${n(Math.abs(z) * 1.6 * E)}, times 10⁻¹⁹ × 10³ = 10⁻¹⁶ N, which is ${n(F)} × 10⁻¹⁵ N. The magnetic force has the same size.` },
   { prompt: `Setting |q|vB sin θ = |q|E gives v = E ÷ (B sin θ), with E = ${n(E)} × 10³ N/C, B = ${n(b)} × 10⁻³ T and θ = ${n(th)} rad. What is v in km/s, to 2 decimal places?`, answer: [r2(v)], explanation: `sin ${n(th)} ≈ ${n(Math.sin(th))}, and v = ${n(E * 1000)} ÷ (${n(b / 1000)} × sin ${n(th)}) ≈ ${n(v * 1000)} m/s = ${n(v)} km/s, which rounds to ${f2(v)} km/s.` }
  ] }; }
});

})();
