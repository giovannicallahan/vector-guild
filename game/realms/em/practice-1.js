/* Electricity and magnetism: fields practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p1.js. */
(function(){
'use strict';
const G = window.Gen;
/* n and par as in Gen, but a negative number is written as a minus sign and the same text as its positive, so 28.09375 and −28.09375 round alike. */
const n = x => x < 0 ? '−' + G.n(-x) : G.n(x);
const par = x => x < 0 ? `(${n(x)})` : n(x);
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };
/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* Rounding to 2 decimal places (half away from zero), and draws that sit on or next to a rounding tie. */
const r2 = x => (x < 0 ? -1 : 1) * Math.round(Math.abs(x) * 100 + 1e-9) / 100;
const tie = x => { const f = (Math.abs(x) * 100) % 1; return Math.abs(f - 0.5) < 2e-3; };
/* "= 0.5394" when the 4-decimal text is exact, "≈ 0.6992" when it is not. */
const eq = x => Math.abs(x - Math.round(x * 1e4) / 1e4) < 1e-9 ? '=' : '≈';
/* A number shown with exactly 2 decimals. */
const f2 = x => r2(x).toFixed(2).replace('-', '−');
/* ", which is 0.70 N to 2 decimal places" only when rounding changes the value. */
const rnd = (x, u) => Math.abs(r2(x) - x) < 1e-9 ? '' : `, which is ${f2(x)} ${u} to 2 decimal places`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const pick = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* A signed sum as worked: sm(5, −2) is '5 − 2'. */
const sm = (a, b) => `${n(a)} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))}`;
const K = 'k = 8.99 × 10⁹ N·m²/C²';
/* The unit rule used whenever charges are in nC and distances in cm. */
const U_MICRO = '8.99 × 10⁹ × 10⁻¹⁸ ÷ 10⁻⁴ = 8.99 × 10⁻⁵ N = 89.9 μN';
const push = (a, b) => a * b > 0 ? 'repels' : 'attracts';

/* ---- q01 Electric charge comes in whole numbers of e [5.1] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The glass insulator on the cable run',
 brief: 'A glass insulator on the cable run has been rubbed with a cloth, and the crew must know how many electrons it lost and what handing some back does.',
 labels: ['electrons short', 'new charge (× 10⁻¹⁷ C)'], tolerance: 0.005,
 gl: [['electrons short'], ['more protons than electrons'], ['new charge (× 10⁻¹⁷ C)']]
}, {
 /* N electrons missing (a multiple of 5, so the charge N × 0.016 × 10⁻¹⁷ C has at most 2 decimals); m returned. m may exceed N
    (about one draw in four), leaving the insulator negative; m never equals N. Never the q01 worked numbers (300 and 120). */
 canonical: { N: 200, m: 80 },
 draw: R => pick(() => { const N = 5 * R.int(12, 100), flip = R.int(0, 3) === 0; return { N, m: flip ? N + 5 * R.int(1, 40) : 5 * R.int(1, N / 5 - 1) }; },
  p => p.m !== p.N && !(p.N === 300 && p.m === 120), { N: 200, m: 80 }),
 build: ({ N, m }) => { const q = Math.round(N * 1.6) / 100, left = N - m, nq = Math.round(left * 1.6) / 100; return {
  prompt: `A glass insulator on a cable run was rubbed with a cloth and now carries a net charge of +${n(q)} × 10⁻¹⁷ C (coulombs). It lost electrons, so it has more protons than electrons. Charge comes only in whole numbers of the elementary charge e = 1.60 × 10⁻¹⁹ C: each electron carries −e and each proton +e. Enter how many electrons the insulator is short of (how many more protons than electrons it has). The cloth then gives ${n(m)} electrons back to the insulator. Enter the insulator’s new charge as the number that multiplies 10⁻¹⁷ C (negative if it ends up with more electrons than protons).`,
  answer: [N, nq],
  hints: ['The number of missing electrons is the size of the charge divided by e. Dividing 10⁻¹⁷ by 10⁻¹⁹ gives 10², which is 100.', 'Each electron handed back cancels one proton’s +e. Find how many more protons than electrons are left (negative if electrons now outnumber protons), then multiply that count by +e.'],
  solution: `The number of missing electrons is (${n(q)} × 10⁻¹⁷ C) ÷ (1.60 × 10⁻¹⁹ C) = (${n(q)} ÷ 1.6) × 100 = ${n(N / 100)} × 100 = ${n(N)}. ${left > 0 ? `Giving back ${n(m)} electrons leaves it short of ${n(left)}, so the new charge is +${n(left)} × 1.60 × 10⁻¹⁹ C = +${n(nq)} × 10⁻¹⁷ C. The insulator is still positive.` : `Giving back ${n(m)} electrons fills all ${n(N)} gaps and leaves ${n(-left)} extra electrons, so the new charge is −${n(-left)} × 1.60 × 10⁻¹⁹ C = ${n(nq)} × 10⁻¹⁷ C. The insulator is now negative.`}`,
  guidance: [
   { prompt: `How many times does e = 1.60 × 10⁻¹⁹ C go into ${n(q)} × 10⁻¹⁷ C? That is the number of electrons the insulator is short of.`, answer: [N], explanation: `(${n(q)} ÷ 1.6) × 10⁻¹⁷ ÷ 10⁻¹⁹ = ${n(N / 100)} × 100 = ${n(N)} electrons.` },
   { prompt: `The insulator was short of ${n(N)} electrons and gets ${n(m)} electrons back. How many more protons than electrons does it have now? (Enter a negative number if electrons now outnumber protons.)`, answer: [left], explanation: `${n(N)} − ${n(m)} = ${n(left)}. Only the electron count changes: the protons stay where they are.` },
   { prompt: 'Multiply that count by +1.60 × 10⁻¹⁹ C (a negative count gives a negative charge). What is the new charge, as the number that multiplies 10⁻¹⁷ C?', answer: [nq], explanation: `${n(left)} × 1.60 × 10⁻¹⁹ C = ${n(nq)} × 10⁻¹⁷ C.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Two grains share their charge',
 brief: 'Two metal grains drift together in the filter bay and touch, and Mira wants to know what each one is left holding.',
 labels: ['extra electrons on each', 'charge on each (× 10⁻¹⁷ C)'], tolerance: 0.005,
 gl: [['combined extra electrons'], ['extra electrons on each'], ['charge on each (× 10⁻¹⁷ C)']]
}, {
 /* Grain A has 10a extra electrons and grain B is short of 10b. Together 10(a − b) extra; shared equally, each has 5(a − b), and
    the charge on each is −5(a − b) × 0.016 × 10⁻¹⁷ C = −0.08(a − b) (exact, 2 decimals). a ≠ b, both orders occur. */
 canonical: { a: 18, b: 6 },
 draw: R => pick(() => ({ a: R.int(3, 60), b: R.int(3, 60) }), p => Math.abs(p.a - p.b) >= 2, { a: 18, b: 6 }),
 build: ({ a, b }) => { const nA = 10 * a, nB = 10 * b, tot = nA - nB, each = tot / 2, ch = Math.round(-each * 1.6) / 100; return {
  prompt: `Two identical metal dust grains drift together in the filter bay. Grain A has ${n(nA)} more electrons than protons. Grain B has ${n(nB)} more protons than electrons. When two identical metal grains touch, their combined charge ends up shared equally between them, and charge is conserved. The grains touch and then drift apart. Each electron carries −e and each proton +e, where e = 1.60 × 10⁻¹⁹ C. Enter how many more electrons than protons each grain has afterwards (a negative number if protons now outnumber electrons). Then enter the charge on each grain as the number that multiplies 10⁻¹⁷ C (negative for a negative charge).`,
  answer: [each, ch],
  hints: ['Count an extra electron as +1 and a missing electron (an extra proton) as −1. Charge is conserved, so the combined count stays the same when the grains touch, and equal sharing splits it into two equal halves.', 'Each extra electron carries −e, so a count of extra electrons turns into charge by multiplying by −e. A negative count means the grain ends up positive.'],
  solution: `Counting extra electrons as positive and missing ones as negative, the two grains hold ${n(nA)} − ${n(nB)} = ${n(tot)} extra electrons between them, and charge is conserved. Shared equally, each grain gets ${n(tot)} ÷ 2 = ${n(each)} extra electrons. Each extra electron carries −1.60 × 10⁻¹⁹ C, so the charge on each grain is ${n(each)} × (−1.60 × 10⁻¹⁹ C) = ${n(ch)} × 10⁻¹⁷ C.`,
  guidance: [
   { prompt: 'Count an extra electron as +1 and a missing electron as −1. What is the combined count for the two grains together?', answer: [tot], explanation: `${n(nA)} − ${n(nB)} = ${n(tot)}. Charge is conserved, so touching does not change this total.` },
   { prompt: 'The combined charge is shared equally, so the count is too. How many more electrons than protons does each grain have? (Enter a negative number if protons outnumber electrons.)', answer: [each], explanation: `${n(tot)} ÷ 2 = ${n(each)} on each grain.` },
   { prompt: 'Each extra electron carries −1.60 × 10⁻¹⁹ C. What is the charge on each grain, as the number that multiplies 10⁻¹⁷ C?', answer: [ch], explanation: `${n(each)} × (−1.60 × 10⁻¹⁹ C) = ${n(ch)} × 10⁻¹⁷ C.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The plate on the comms mast',
 brief: 'A metal plate on the comms mast has built up charge measured in nanocoulombs, and a grounding strap is about to drain part of it.',
 labels: ['extra electrons (billions)', 'new charge (nC)'], tolerance: 0.005,
 gl: [['extra electrons (billions)'], ['extra electrons left (billions)'], ['new charge (nC)']]
}, {
 /* Plate charge −0.8t nC holds 5t billion extra electrons (one billion electrons carry 0.16 nC). m billion are drained; m may exceed 5t
    (the plate then ends positive) but never equals it. The new charge −0.16(5t − m) nC has at most 2 decimals. */
 canonical: { t: 7, m: 15 },
 draw: R => pick(() => ({ t: R.int(2, 40), m: R.int(1, 260) }), p => p.m !== 5 * p.t && p.m <= 5 * p.t + 40 && !(p.t === 7 && p.m === 15), { t: 7, m: 15 }),
 build: ({ t, m }) => { const Q = Math.round(8 * t) / 10, N = 5 * t, left = N - m, nq = Math.round(-left * 16) / 100; return {
  prompt: `A small metal plate on the comms mast has built up a net charge of −${n(Q)} nC (1 nC = 10⁻⁹ C, a nanocoulomb). Charge comes only in whole numbers of the elementary charge e = 1.60 × 10⁻¹⁹ C, and each electron carries −e. Enter how many extra electrons the plate holds, in billions (the number that multiplies 10⁹ electrons). A grounding strap then drains ${n(m)} billion electrons from the plate. Enter the plate’s new charge in nC, to 2 decimal places (negative for a negative charge).`,
  answer: [N, nq],
  hints: ['One billion electrons carry 10⁹ × 1.60 × 10⁻¹⁹ C. Write that in nC, then divide the size of the plate’s charge by it to count the extra electrons in billions.', 'Draining electrons takes charge −e away for each one, so subtract the drained count from the extra count (negative if protons now outnumber electrons) and convert that count back to nC with the same figure for one billion.'],
  solution: `One billion electrons carry 10⁹ × 1.60 × 10⁻¹⁹ C = 0.16 × 10⁻⁹ C = 0.16 nC. The plate’s charge is ${n(Q)} nC in size, so it holds ${n(Q)} ÷ 0.16 = ${n(N)} billion extra electrons. Draining ${n(m)} billion leaves ${n(N)} − ${n(m)} = ${n(left)} billion extra electrons${left < 0 ? ' (a negative count: protons now outnumber electrons)' : ''}, so the new charge is ${n(left)} × (−0.16 nC) = ${n(nq)} nC.`,
  guidance: [
   { prompt: 'One billion electrons carry 0.16 nC. How many billions of extra electrons give a charge of that size on the plate?', answer: [N], explanation: `${n(Q)} nC ÷ 0.16 nC per billion = ${n(N)} billion.` },
   { prompt: `The strap drains ${n(m)} billion electrons. How many billions of extra electrons are left? (Enter a negative number if protons now outnumber electrons.)`, answer: [left], explanation: `${n(N)} − ${n(m)} = ${n(left)} billion.` },
   { prompt: 'Each billion extra electrons carries −0.16 nC. What is the plate’s new charge in nC, to 2 decimal places?', answer: [nq], explanation: `${n(left)} × (−0.16 nC) = ${n(nq)} nC.` }
  ] }; }
});

/* ---- q02 Coulomb's law: force between two point charges [5.3] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Spacing the sensor beads',
 brief: 'Two charged beads sit on the sensor rail a few centimetres apart, and the rail log needs the force between them in micronewtons.',
 labels: ['force (μN)', 'repel 1, attract −1'], tolerance: 0.005,
 gl: [['|q₁q₂| (nC²)'], ['force (μN)'], ['repel 1, attract −1']]
}, {
 /* Charges a, b in nC (non-zero, −9 to 9) and a separation of d cm. F = 89.9|ab| ÷ d² micronewtons exactly. F between 0.1 and 900,
    off rounding ties, not the canonical numbers; both signs of ab occur, so the second box is 1 or −1. */
 canonical: { a: 4, b: -6, d: 3 },
 draw: R => pick(() => ({ a: R.nz(-9, 9), b: R.nz(-9, 9), d: R.int(2, 9) }), p => { const F = 89.9 * Math.abs(p.a * p.b) / (p.d * p.d); return F >= 0.1 && F < 900 && !tie(F) && !(p.a === 4 && p.b === -6 && p.d === 3); }, { a: 4, b: -6, d: 3 }),
 build: ({ a, b, d }) => { const P = Math.abs(a * b), F = 89.9 * P / (d * d), s = a * b > 0 ? 1 : -1; return {
  prompt: `Two small charged beads sit on a sensor rail with their centres ${n(d)} cm apart. One has charge q₁ = ${n(a)} nC and the other q₂ = ${n(b)} nC, where 1 nC (nanocoulomb) is 10⁻⁹ C. Use Coulomb’s law with ${K}. Enter the size of the force each bead exerts on the other in micronewtons (μN, 10⁻⁶ N), rounded to 2 decimal places. Then enter 1 if the beads repel each other or −1 if they attract.`,
  answer: [r2(F), s],
  hints: [`Coulomb’s law: F = k|q₁q₂| ÷ r². With charges in nC and the distance d in cm it comes to F = 89.9 × |q₁q₂| ÷ d² micronewtons, because ${U_MICRO}.`, 'Like charges (both positive or both negative) repel; unlike charges attract.'],
  solution: `F = k|q₁q₂| ÷ r² = 8.99 × 10⁹ × ${n(P)} × 10⁻¹⁸ ÷ (${n(d)} × 10⁻² m)² = ${n(8.99 * P)} × 10⁻⁹ ÷ (${n(d * d)} × 10⁻⁴) N ${eq(F)} ${n(F)} × 10⁻⁶ N, so F ${eq(F)} ${n(F)} μN${rnd(F, 'μN')}. The charges have ${s > 0 ? 'the same sign, so the beads repel' : 'opposite signs, so the beads attract'}: enter ${n(s)}.`,
  guidance: [
   { prompt: 'Multiply the sizes of the two charges: what is |q₁q₂| in nC²?', answer: [P], explanation: `${n(Math.abs(a))} nC × ${n(Math.abs(b))} nC = ${n(P)} nC².` },
   { prompt: `For charges in nC and a distance in cm, F = 89.9 × |q₁q₂| ÷ d² micronewtons. With d = ${n(d)} cm, what is F in μN, to 2 decimal places?`, answer: [r2(F)], explanation: `89.9 × ${n(P)} ÷ ${n(d * d)} ${eq(F)} ${n(F)}, so F is ${f2(F)} μN.` },
   { prompt: `q₁ = ${n(a)} nC and q₂ = ${n(b)} nC. Enter 1 if they repel or −1 if they attract.`, answer: [s], explanation: s > 0 ? 'The two charges have the same sign, and like charges repel.' : 'The two charges have opposite signs, and unlike charges attract.' }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Force between two counted beads',
 brief: 'Two dust beads hang in the filter bay with counted surpluses of electrons and protons, and Mira needs the force between them.',
 labels: ['force (μN)', 'repel 1, attract −1'], tolerance: 0.005,
 gl: [['|q₁q₂| (nC²)'], ['force (μN)'], ['repel 1, attract −1']]
}, {
 /* Bead 1 holds M1 × 10¹⁰ extra electrons (charge −1.6·M1 nC); bead 2 holds M2 × 10¹⁰ extra electrons (s2 = 1) or extra protons (s2 = −1).
    |q1q2| = 2.56·M1·M2 nC² (exact), F = 89.9 × 2.56·M1·M2 ÷ d² μN. F between 0.5 and 900, off ties. Repel when bead 2 is also negative. */
 canonical: { M1: 3, M2: 5, d: 4, s2: -1 },
 draw: R => pick(() => ({ M1: R.int(1, 9), M2: R.int(1, 9), d: R.int(3, 9), s2: R.bool() ? 1 : -1 }), p => { const F = 89.9 * 2.56 * p.M1 * p.M2 / (p.d * p.d); return F >= 0.5 && F < 900 && !tie(F) && !(p.M1 === 3 && p.M2 === 5 && p.d === 4 && p.s2 === -1); }, { M1: 3, M2: 5, d: 4, s2: -1 }),
 build: ({ M1, M2, d, s2 }) => { const P = Math.round(256 * M1 * M2) / 100, F = 89.9 * P / (d * d), s = s2 > 0 ? 1 : -1, c1 = Math.round(16 * M1) / 10, c2 = Math.round(16 * M2) / 10; return {
  prompt: `Two identical dust beads hang ${n(d)} cm apart in the filter bay. Bead 1 has ${n(M1)} × 10¹⁰ more electrons than protons. Bead 2 has ${n(M2)} × 10¹⁰ more ${s2 > 0 ? 'electrons than protons' : 'protons than electrons'}. Each electron carries −e and each proton +e, where e = 1.60 × 10⁻¹⁹ C. Use Coulomb’s law with ${K}. Enter the size of the force each bead exerts on the other in micronewtons (μN, 10⁻⁶ N), rounded to 2 decimal places. Then enter 1 if the beads repel each other or −1 if they attract.`,
  answer: [r2(F), s],
  hints: ['Each bead’s charge is its count of extra electrons or protons times e. For a count of 10¹⁰, that is 10¹⁰ × 1.60 × 10⁻¹⁹ C = 1.6 × 10⁻⁹ C = 1.6 nC. Work out each charge’s size in nC first.', `Coulomb’s law: F = k|q₁q₂| ÷ r². With charges in nC and the distance d in cm it comes to F = 89.9 × |q₁q₂| ÷ d² micronewtons, because ${U_MICRO}. Work out from the signs whether they repel or attract.`],
  solution: `Each 10¹⁰ of charge carriers is 10¹⁰ × 1.60 × 10⁻¹⁹ C = 1.6 nC, so bead 1 has size ${n(M1)} × 1.6 = ${n(c1)} nC and bead 2 has size ${n(M2)} × 1.6 = ${n(c2)} nC. Then |q₁q₂| = ${n(c1)} × ${n(c2)} = ${n(P)} nC² and F = 89.9 × ${n(P)} ÷ ${n(d * d)} ${eq(F)} ${n(F)} μN${rnd(F, 'μN')}. Bead 1 is negative and bead 2 is ${s2 > 0 ? 'negative' : 'positive'}, so the beads ${s > 0 ? 'repel' : 'attract'}: enter ${n(s)}.`,
  guidance: [
   { prompt: 'Each 10¹⁰ electrons or protons carry 1.6 nC. What is |q₁q₂|, the product of the two charges’ sizes, in nC²?', answer: [P], explanation: `The sizes are ${n(M1)} × 1.6 = ${n(c1)} nC and ${n(M2)} × 1.6 = ${n(c2)} nC, and ${n(c1)} × ${n(c2)} = ${n(P)} nC².` },
   { prompt: `For charges in nC and a distance in cm, F = 89.9 × |q₁q₂| ÷ d² micronewtons. With d = ${n(d)} cm, what is F in μN, to 2 decimal places?`, answer: [r2(F)], explanation: `89.9 × ${n(P)} ÷ ${n(d * d)} ${eq(F)} ${n(F)}, so F is ${f2(F)} μN.` },
   { prompt: `Bead 1 has extra electrons and bead 2 has extra ${s2 > 0 ? 'electrons' : 'protons'}. Enter 1 if the beads repel or −1 if they attract.`, answer: [s], explanation: s > 0 ? 'Both beads are negative, and like charges repel.' : 'Bead 1 is negative and bead 2 is positive, and unlike charges attract.' }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The bead that hovers',
 brief: 'A light bead floats above a fixed sphere on the test rig, held up by repulsion alone, and Mira wants the gap it settles at.',
 labels: ['weight (mN)', 'distance (m)'], tolerance: 0.005,
 gl: [['weight (mN)'], ['r² (m²)'], ['distance (m)']]
}, {
 /* The bead of m grams weighs 9.8·m mN and hovers where k|ab| ÷ r² equals that weight: r² = 8.99·|ab| ÷ W (W in mN, |ab| in μC²).
    The charges have the same sign (both drawn with sign s). r between 0.5 and 3 m, off ties; r² rounded to 2 decimals gives the same r to 2. */
 canonical: { m: 20, a: 4, b: 5, s: 1 },
 draw: R => pick(() => ({ m: R.pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 50]), a: R.int(2, 9), b: R.int(2, 9), s: R.bool() ? 1 : -1 }), p => {
   const W = 9.8 * p.m, r2v = 8.99 * p.a * p.b / W, r = Math.sqrt(r2v);
   return r >= 0.5 && r < 3 && !tie(r) && !tie(r2v) && Math.abs(r2(Math.sqrt(r2(r2v))) - r2(r)) < 1e-9 && !(p.m === 20 && p.a === 4 && p.b === 5); }, { m: 20, a: 4, b: 5, s: 1 }),
 build: ({ m, a, b, s }) => { const W = Math.round(98 * m) / 10, P = a * b, rr = 8.99 * P / W, r = Math.sqrt(rr); return {
  prompt: `A tiny bead of mass ${n(m)} g hangs motionless in the air directly above a fixed sphere on the test rig, held up by the electric repulsion between them alone. The fixed sphere has charge ${n(s * a)} μC and the bead has charge ${n(s * b)} μC (1 μC = 10⁻⁶ C; 1 g = 10⁻³ kg). Use ${K}, and take the bead’s weight as its mass times 9.8 N/kg. Enter the bead’s weight in millinewtons (mN, 10⁻³ N). Then enter the distance between the two centres in metres, rounded to 2 decimal places.`,
  answer: [W, r2(r)],
  hints: ['The bead hangs still, so the upward electric force equals its weight. Convert the mass to kilograms, multiply by 9.8, and give the weight in mN.', 'Coulomb’s law: F = k|q₁q₂| ÷ r². Set F equal to the weight, turn the equation around to get r², then take the square root. With charges in μC and the weight in mN, k|q₁q₂| is 8.99 × |q₁q₂| mN·m² (8.99 × 10⁹ × 10⁻¹² N·m² = 8.99 × 10⁻³ N·m²).'],
  solution: `The weight is ${n(m)} g × 9.8 N/kg = ${n(m)} × 10⁻³ kg × 9.8 N/kg = ${n(W)} × 10⁻³ N = ${n(W)} mN. The bead hangs still, so the repulsion equals that: k|q₁q₂| ÷ r² = ${n(W)} mN. Here k|q₁q₂| = 8.99 × 10⁹ × ${n(P)} × 10⁻¹² = ${n(8.99 * P)} × 10⁻³ N·m² = ${n(8.99 * P)} mN·m², so r² = ${n(8.99 * P)} ÷ ${n(W)} ${eq(rr)} ${n(rr)} m² and r = √${n(rr)} ${eq(r)} ${n(r)} m, which is ${f2(r)} m to 2 decimal places.`,
  guidance: [
   { prompt: `The bead has mass ${n(m)} g, which is ${n(m / 1000)} kg. What is its weight (mass × 9.8 N/kg), in millinewtons?`, answer: [W], explanation: `${n(m / 1000)} kg × 9.8 N/kg = ${n(W / 1000)} N = ${n(W)} mN.` },
   { prompt: `The repulsion equals the weight: ${n(8.99 * P)} mN·m² ÷ r² = ${n(W)} mN, where ${n(8.99 * P)} mN·m² is k|q₁q₂|. What is r² in m², to 2 decimal places?`, answer: [r2(rr)], explanation: `r² = ${n(8.99 * P)} ÷ ${n(W)} ${eq(rr)} ${n(rr)} m², which is ${f2(rr)} m² to 2 decimal places. Use the unrounded value for the next step.` },
   { prompt: 'Take the square root of the unrounded r². What is r in metres, to 2 decimal places?', answer: [r2(r)], explanation: `r = √${n(rr)} ${eq(r)} ${n(r)} m, so ${f2(r)} m.` }
  ] }; }
});

/* ---- q03 Superposition: net force from several charges on a line [5.3] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Two posts on one side of the bead',
 brief: 'Two charged posts stand on the same side of a free bead on the cable rail, and the rail log needs the push they make together.',
 labels: ['net force, x component (μN)'], tolerance: 0.005,
 gl: [['force from the first post (μN)'], ['force from the second post (μN)'], ['net force, x component (μN)']]
}, {
 /* Test bead q (nC) at x = 0; posts q1 at x = s·d1 cm and q2 at x = s·d2 cm, both on the same side (s = ±1), d1 ≠ d2. A post on the +x side
    pushes the bead towards −x when q·qi > 0, so Fi = −s·89.9·q·qi ÷ di² μN. Each force at least 0.5 μN, the net at least 0.5 and under 900,
    off ties, and the rounded forces add to the rounded net. */
 canonical: { s: 1, q: 3, q1: -4, d1: 2, q2: 6, d2: 5 },
 draw: R => pick(() => ({ s: R.bool() ? 1 : -1, q: R.nz(-6, 6), q1: R.nz(-9, 9), d1: R.int(2, 8), q2: R.nz(-9, 9), d2: R.int(2, 9) }), p => {
   const F1 = -p.s * 89.9 * p.q * p.q1 / (p.d1 * p.d1), F2 = -p.s * 89.9 * p.q * p.q2 / (p.d2 * p.d2), F = F1 + F2;
   return p.d1 !== p.d2 && Math.abs(F1) >= 0.5 && Math.abs(F2) >= 0.5 && Math.abs(F1) < 900 && Math.abs(F2) < 900 && Math.abs(F) >= 0.5 && Math.abs(F) < 900 && !tie(F1) && !tie(F2) && !tie(F) && Math.abs(r2(F1) + r2(F2) - r2(F)) < 1e-9
    && !(p.s === 1 && p.q === 3 && p.q1 === -4 && p.d1 === 2); }, { s: 1, q: 3, q1: -4, d1: 2, q2: 6, d2: 5 }),
 build: ({ s, q, q1, d1, q2, d2 }) => { const F1 = -s * 89.9 * q * q1 / (d1 * d1), F2 = -s * 89.9 * q * q2 / (d2 * d2), F = F1 + F2, x1 = s * d1, x2 = s * d2,
  P1 = Math.abs(q * q1), P2 = Math.abs(q * q2), dir = f => f > 0 ? '+x' : '−x'; return {
  prompt: `The cable rail is an x-axis marked in centimetres. A free test bead with charge q = ${n(q)} nC sits at x = 0. Two fixed posts stand on the ${s > 0 ? '+x' : '−x'} side of it: a post with charge ${n(q1)} nC at x = ${n(x1)} cm and a post with charge ${n(q2)} nC at x = ${n(x2)} cm (1 nC = 10⁻⁹ C). Use ${K}. Enter the x component of the net electric force on the test bead in micronewtons (μN, 10⁻⁶ N), rounded to 2 decimal places: positive if it points towards +x, negative if towards −x.`,
  answer: [r2(F)],
  hints: [`Find the size of each force alone with Coulomb’s law. With charges in nC and the distance d in cm it comes to F = 89.9 × |q₁q₂| ÷ d² micronewtons, because ${U_MICRO}.`, 'Give each force a sign from its direction: a repelling force points away from the post and an attracting force points towards it. Both posts are on the same side of the bead, so work out which way “away” and “towards” point. The net force is the sum of the two signed components: round only at the end.'],
  solution: `The post at x = ${n(x1)} cm ${push(q, q1)} the bead: F₁ = 89.9 × ${n(P1)} ÷ ${n(d1 * d1)} ${eq(F1)} ${n(Math.abs(F1))} μN, pointing towards ${dir(F1)}, so F₁ₓ ${eq(F1)} ${n(F1)} μN. The post at x = ${n(x2)} cm ${push(q, q2)} the bead: F₂ = 89.9 × ${n(P2)} ÷ ${n(d2 * d2)} ${eq(F2)} ${n(Math.abs(F2))} μN, pointing towards ${dir(F2)}, so F₂ₓ ${eq(F2)} ${n(F2)} μN. By superposition the net x component is ${sm(F1, F2)} ${eq(F)} ${n(F)} μN${rnd(F, 'μN')}.`,
  guidance: [
   { prompt: `Take the post at x = ${n(x1)} cm alone. What is the x component of its force on the test bead, in μN to 2 decimal places (signed)?`, answer: [r2(F1)], explanation: `Size 89.9 × ${n(P1)} ÷ ${n(d1 * d1)} ${eq(F1)} ${n(Math.abs(F1))} μN. It ${push(q, q1)} the bead and the post is on the ${s > 0 ? '+x' : '−x'} side, so the force points towards ${dir(F1)}: ${f2(F1)} μN.` },
   { prompt: `Now the post at x = ${n(x2)} cm alone. What is the x component of its force on the test bead, in μN to 2 decimal places (signed)?`, answer: [r2(F2)], explanation: `Size 89.9 × ${n(P2)} ÷ ${n(d2 * d2)} ${eq(F2)} ${n(Math.abs(F2))} μN. It ${push(q, q2)} the bead and the post is on the ${s > 0 ? '+x' : '−x'} side, so the force points towards ${dir(F2)}: ${f2(F2)} μN.` },
   { prompt: 'Add the two signed x components. What is the net x component of the force, in μN to 2 decimal places?', answer: [r2(F)], explanation: `${sm(F1, F2)} ${eq(F)} ${n(F)} μN, so ${f2(F)} μN.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The bead between two fixed posts',
 brief: 'A light free bead sits between two fixed posts on the sensor rail, and Mira wants to know how fast the posts start it moving.',
 labels: ['net force, x component (μN)', 'acceleration, x component (m/s²)'], tolerance: 0.005,
 gl: [['net force, x component (μN)'], ['acceleration, x component (m/s²)']]
}, {
 /* Free bead q (nC), mass m mg, at x = 0; fixed posts q1 at x = −d1 cm and q2 at x = +d2 cm. F1x = +89.9·q·q1 ÷ d1², F2x = −89.9·q·q2 ÷ d2² (μN).
    a = F ÷ m in m/s² (μN ÷ mg), from the unrounded force. Forces at least 0.5 μN, net at least 0.5 and under 900, off ties; rounding the force first
    must not change the rounded acceleration. */
 canonical: { q: 2, q1: 5, d1: 4, q2: -3, d2: 6, m: 10 },
 draw: R => pick(() => ({ q: R.nz(-6, 6), q1: R.nz(-9, 9), d1: R.int(2, 8), q2: R.nz(-9, 9), d2: R.int(2, 9), m: R.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]) }), p => {
   const F1 = 89.9 * p.q * p.q1 / (p.d1 * p.d1), F2 = -89.9 * p.q * p.q2 / (p.d2 * p.d2), F = F1 + F2, a = F / p.m;
   return Math.abs(F1) >= 0.5 && Math.abs(F2) >= 0.5 && Math.abs(F) >= 0.5 && Math.abs(F) < 900 && Math.abs(a) >= 0.05 && !tie(F) && !tie(a) && Math.abs(r2(F) / p.m - a) < 0.0049 && r2(r2(F) / p.m) === r2(a)
    && !(p.q === 2 && p.q1 === 5 && p.d1 === 4 && p.q2 === -3 && p.d2 === 6); }, { q: 2, q1: 5, d1: 4, q2: -3, d2: 6, m: 10 }),
 build: ({ q, q1, d1, q2, d2, m }) => { const F1 = 89.9 * q * q1 / (d1 * d1), F2 = -89.9 * q * q2 / (d2 * d2), F = F1 + F2, a = F / m,
  P1 = Math.abs(q * q1), P2 = Math.abs(q * q2), dir = f => f > 0 ? '+x' : '−x'; return {
  prompt: `The sensor rail is an x-axis marked in centimetres. A free bead of mass ${n(m)} mg and charge q = ${n(q)} nC sits at rest at x = 0, between two fixed posts: a post with charge ${n(q1)} nC at x = −${n(d1)} cm and a post with charge ${n(q2)} nC at x = ${n(d2)} cm (1 mg = 10⁻⁶ kg, 1 nC = 10⁻⁹ C). Use ${K}. Ignore gravity. Enter the x component of the net electric force on the bead in micronewtons (μN), then the x component of the bead’s acceleration at the moment it is released, in m/s² (use the unrounded force, a = F ÷ m). Round both to 2 decimal places: positive if towards +x, negative if towards −x.`,
  answer: [r2(F), r2(a)],
  hints: [`Find each post’s force alone with Coulomb’s law. With charges in nC and the distance d in cm it comes to F = 89.9 × |q₁q₂| ÷ d² micronewtons, because ${U_MICRO}. A repelling force points away from the post and an attracting one towards it. Add the two signed components.`, 'Newton’s second law gives a = F ÷ m. A force in μN (10⁻⁶ N) divided by a mass in mg (10⁻⁶ kg) gives an acceleration in m/s² directly, because the two factors of 10⁻⁶ cancel.'],
  solution: `The post at x = −${n(d1)} cm ${push(q, q1)} the bead: 89.9 × ${n(P1)} ÷ ${n(d1 * d1)} ${eq(F1)} ${n(Math.abs(F1))} μN, pointing towards ${dir(F1)}, so F₁ₓ ${eq(F1)} ${n(F1)} μN. The post at x = ${n(d2)} cm ${push(q, q2)} the bead: 89.9 × ${n(P2)} ÷ ${n(d2 * d2)} ${eq(F2)} ${n(Math.abs(F2))} μN, pointing towards ${dir(F2)}, so F₂ₓ ${eq(F2)} ${n(F2)} μN. The net force is ${sm(F1, F2)} ${eq(F)} ${n(F)} μN${rnd(F, 'μN')}. Then a = F ÷ m = ${n(F)} μN ÷ ${n(m)} mg ${eq(a)} ${n(a)} m/s²${rnd(a, 'm/s²')}.`,
  guidance: [
   { prompt: 'Find the signed x component of each post’s force on the bead (repelling points away from the post, attracting towards it) and add them. What is the net x component, in μN to 2 decimal places?', answer: [r2(F)], explanation: `The post at x = −${n(d1)} cm gives ${n(F1)} μN and the post at x = ${n(d2)} cm gives ${n(F2)} μN, so the net is ${sm(F1, F2)} ${eq(F)} ${n(F)} μN, which is ${f2(F)} μN.` },
   { prompt: `Newton’s second law: a = F ÷ m. The mass is ${n(m)} mg, and μN ÷ mg is m/s². What is the x component of the acceleration, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(F)} ÷ ${n(m)} ${eq(a)} ${n(a)} m/s², so ${f2(a)} m/s².` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'The balance point between two posts',
 brief: 'Two posts with like charges stand on the cable rail, and Mira wants the spot between them where a free bead feels no net force.',
 labels: ['balance point (cm)', 'net force at the middle (μN)'], tolerance: 0.005,
 gl: [['√|Q₁| + √|Q₂| (√nC)'], ['balance point (cm)'], ['net force at the middle (μN)']]
}, {
 /* Posts with charges s·a² nC at x = 0 and s·b² nC at x = L = (a + b)·u cm, the same sign s. The forces on a bead balance where x ÷ (L − x) = a ÷ b,
    that is x = u·a. At the middle Fx = 89.9·q·(Q1 − Q2) ÷ (L/2)² = 359.6·q·s·(a² − b²) ÷ L². Force at least 0.5 and under 900, off ties. */
 canonical: { a: 3, b: 2, s: 1, u: 4, q: 2 },
 draw: R => pick(() => ({ a: R.int(1, 5), b: R.int(1, 5), s: R.bool() ? 1 : -1, u: R.int(2, 6), q: R.nz(-6, 6) }), p => {
   const L = (p.a + p.b) * p.u, F = 359.6 * p.q * p.s * (p.a * p.a - p.b * p.b) / (L * L);
   return p.a !== p.b && Math.abs(F) >= 0.5 && Math.abs(F) < 900 && !tie(F) && !(p.a === 3 && p.b === 2 && p.u === 4 && p.s === 1); }, { a: 3, b: 2, s: 1, u: 4, q: 2 }),
 build: ({ a, b, s, u, q }) => { const Q1 = s * a * a, Q2 = s * b * b, L = (a + b) * u, x = u * a, D = Q1 - Q2, F = 359.6 * q * D / (L * L), h = L / 2; return {
  prompt: `Two fixed posts stand on the cable rail, an x-axis marked in centimetres: a post with charge ${n(Q1)} nC at x = 0 and a post with charge ${n(Q2)} nC at x = ${n(L)} cm (1 nC = 10⁻⁹ C); the two charges have the same sign. Use ${K}. A free test bead with charge q = ${n(q)} nC is placed on the rail between the posts. Enter the position x, in centimetres from the first post, where the net electric force on the bead is zero. Then the bead is moved to the middle of the rail, at x = ${n(h)} cm: enter the x component of the net electric force on it there, in micronewtons (μN, 10⁻⁶ N), rounded to 2 decimal places (positive towards +x).`,
  answer: [x, r2(F)],
  hints: ['The two posts have the same sign, so between them they push the bead in opposite directions. The forces cancel where they have equal size: k|q Q₁| ÷ x² = k|q Q₂| ÷ (g − x)², where g is the gap between the two posts. The factors k and |q| cancel. Take the square root of both sides to get x ÷ (g − x) = √|Q₁| ÷ √|Q₂|, then solve for x.', `With charges in nC and distances in cm, a force is 89.9 × (charge product) ÷ d² micronewtons, because ${U_MICRO}. At the middle both posts are the same distance away. A post at x = 0 pushes the bead towards +x when q Q₁ is positive (they repel), and the post at the far end pushes it towards −x when q Q₂ is positive.`],
  solution: `The forces on the bead have equal size where ${n(Math.abs(Q1))} ÷ x² = ${n(Math.abs(Q2))} ÷ (${n(L)} − x)², since k and the bead’s charge cancel. Taking square roots, x ÷ (${n(L)} − x) = √${n(Math.abs(Q1))} ÷ √${n(Math.abs(Q2))} = ${n(a)} ÷ ${n(b)}. So x takes ${n(a)} of ${n(a + b)} equal parts of the ${n(L)} cm: x = ${n(L)} × ${n(a)} ÷ ${n(a + b)} = ${n(x)} cm. At the middle the bead is ${n(h)} cm from each post. The post at x = 0 contributes 89.9 × ${par(q)} × ${par(Q1)} ÷ ${n(h * h)} and the post at x = ${n(L)} cm contributes −89.9 × ${par(q)} × ${par(Q2)} ÷ ${n(h * h)} (positive means towards +x), so Fₓ = 89.9 × ${par(q)} × (${n(Q1)} − ${par(Q2)}) ÷ ${n(h * h)} = 89.9 × ${par(q)} × ${par(D)} ÷ ${n(h * h)} ${eq(F)} ${n(F)} μN${rnd(F, 'μN')}.`,
  guidance: [
   { prompt: `The balance point divides the ${n(L)} cm in the ratio √|Q₁| : √|Q₂|. Take the square root of each charge’s size, √${n(Math.abs(Q1))} and √${n(Math.abs(Q2))} (in √nC). What is their sum?`, answer: [a + b], explanation: `√${n(Math.abs(Q1))} = ${n(a)} and √${n(Math.abs(Q2))} = ${n(b)}, so the sum is ${n(a + b)}.` },
   { prompt: `The point is ${n(a)} of those ${n(a + b)} parts from the first post. What is x, in centimetres from the first post?`, answer: [x], explanation: `x = ${n(L)} × ${n(a)} ÷ ${n(a + b)} = ${n(x)} cm. Check: ${n(x)} ÷ ${n(L - x)} = ${n(a)} ÷ ${n(b)}.` },
   { prompt: `At the middle, x = ${n(h)} cm, the post at x = 0 contributes +89.9 q Q₁ ÷ d² and the post at x = ${n(L)} cm contributes −89.9 q Q₂ ÷ d² (positive means towards +x), where d = ${n(h)} cm and q, Q₁ and Q₂ keep their signs. What is the net x component, in μN to 2 decimal places?`, answer: [r2(F)], explanation: `89.9 × ${par(q)} × (${par(Q1)} − ${par(Q2)}) ÷ ${n(h * h)} = 89.9 × ${par(q)} × ${par(D)} ÷ ${n(h * h)} ${eq(F)} ${n(F)} μN, so ${f2(F)} μN.` }
  ] }; }
});

/* ---- q04 The electric field of a point charge, and the force it gives [5.4] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'Field on either side of the beacon',
 brief: 'A charged beacon on the cable rail makes a field that the crew must read on one side of it, along with the push on a dust grain placed there.',
 labels: ['field Eₓ (kN/C)', 'force Fₓ (mN)'], tolerance: 0.005,
 gl: [['size of the field (kN/C)'], ['field Eₓ (kN/C)'], ['force Fₓ (mN)']]
}, {
 /* Source q nC at the origin, point P at x = s·d cm, test charge Q μC. Eₓ = 89.9·q·s ÷ d² kN/C, Fₓ = Q·Eₓ mN (unrounded field).
    |E| between 0.2 and 900, |F| under 900, off ties, and rounding the field first leaves the rounded force unchanged. */
 canonical: { q: 5, d: 4, s: -1, Q: -3 },
 draw: R => pick(() => ({ q: R.nz(-9, 9), d: R.int(2, 9), s: R.bool() ? 1 : -1, Q: R.nz(-5, 5) }), p => {
   const E = 89.9 * p.q * p.s / (p.d * p.d), F = p.Q * E;
   return Math.abs(E) >= 0.2 && Math.abs(E) < 900 && Math.abs(F) < 900 && !tie(E) && !tie(F) && r2(p.Q * r2(E)) === r2(F) && !(p.q === 5 && p.d === 4 && p.s === -1); }, { q: 5, d: 4, s: -1, Q: -3 }),
 build: ({ q, d, s, Q }) => { const E = 89.9 * q * s / (d * d), F = Q * E, Es = Math.abs(E); return {
  prompt: `A charged beacon with charge q = ${n(q)} nC sits at the origin of the cable rail, an x-axis marked in centimetres (1 nC = 10⁻⁹ C). The point P is at x = ${n(s * d)} cm. Use ${K}. Enter the x component of the electric field at P in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places: positive if it points towards +x. Then a dust grain with charge Q = ${n(Q)} μC is placed at P (1 μC = 10⁻⁶ C). Enter the x component of the force on it in millinewtons (mN, 10⁻³ N), using the unrounded field and rounding to 2 decimal places.`,
  answer: [r2(E), r2(F)],
  hints: [`The field of a point charge has size E = k|q| ÷ r². With q in nC and the distance d in cm it comes to 89.9 × |q| ÷ d² kN/C, because 8.99 × 10⁹ × 10⁻⁹ ÷ 10⁻⁴ = 8.99 × 10⁴ N/C = 89.9 kN/C. The field points away from a positive charge and towards a negative one, so its direction depends on which side of the beacon P is.`, 'The force on a charge Q placed in a field is F = QE. A charge in μC times a field in kN/C gives a force in mN, and a negative Q turns the force against the field.'],
  solution: `E = k|q| ÷ r² = 89.9 × ${n(Math.abs(q))} ÷ ${n(d * d)} ${eq(Es)} ${n(Es)} kN/C. P is on the ${s > 0 ? '+x' : '−x'} side of the beacon and the beacon is ${q > 0 ? 'positive, so the field points away from it, towards' : 'negative, so the field points towards it, towards'} ${E > 0 ? '+x' : '−x'}: Eₓ ${eq(E)} ${n(E)} kN/C, which is ${f2(E)} kN/C to 2 decimal places. The force on the grain is Fₓ = QEₓ = ${par(Q)} μC × ${par(E)} kN/C ${eq(F)} ${n(F)} mN${rnd(F, 'mN')}.`,
  guidance: [
   { prompt: `What is the size of the field at P, 89.9 × |q| ÷ d² with d = ${n(d)} cm, in kN/C to 2 decimal places?`, answer: [r2(Es)], explanation: `89.9 × ${n(Math.abs(q))} ÷ ${n(d * d)} ${eq(Es)} ${n(Es)} kN/C.` },
   { prompt: `The beacon’s charge is ${n(q)} nC and P is on the ${s > 0 ? '+x' : '−x'} side of it. Give the field’s x component at P a sign: what is Eₓ in kN/C, to 2 decimal places?`, answer: [r2(E)], explanation: `A ${q > 0 ? 'positive' : 'negative'} charge’s field points ${q > 0 ? 'away from' : 'towards'} it. P lies towards ${s > 0 ? '+x' : '−x'} of the beacon, so Eₓ is ${E > 0 ? 'positive' : 'negative'}: ${f2(E)} kN/C.` },
   { prompt: `Multiply by the dust grain’s charge: Fₓ = QEₓ with Q = ${n(Q)} μC. What is Fₓ in mN, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(Q)} × ${par(E)} ${eq(F)} ${n(F)}, so Fₓ is ${f2(F)} mN.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Weighing a hidden charge by its pull',
 brief: 'Something buried in the outer wall holds a charge, and Mira has measured how hard it tugs on a dust grain to find out how big it is.',
 labels: ['field size (N/C)', 'source charge (nC)'], tolerance: 0.005,
 gl: [['field size (N/C)'], ['size of the source charge (nC)'], ['source charge (nC)']]
}, {
 /* Source charge of size q0 nC (1 to 9), grain of size |Q| μC at d tenths of a metre, so the force is F = 899·q0·|Q| ÷ d² μN, printed exactly
    (at most 2 decimals, between 0.5 and 900). The grain's sign sQ and attract/repel are drawn; the source's sign is −sQ when attracting and sQ when repelling. */
 canonical: { q0: 3, d: 5, Q: 4, sQ: 1, att: true },
 draw: R => pick(() => ({ q0: R.int(1, 9), d: R.int(1, 6), Q: R.int(1, 5), sQ: R.bool() ? 1 : -1, att: R.bool() }), p => {
   const F = 899 * p.q0 * p.Q / (p.d * p.d), E = F / p.Q; return Math.abs(F * 100 - Math.round(F * 100)) < 1e-6 && F >= 0.5 && F < 900 && !tie(E) && !(p.q0 === 3 && p.d === 5 && p.Q === 4); }, { q0: 3, d: 5, Q: 4, sQ: 1, att: true }),
 build: ({ q0, d, Q, sQ, att }) => { const F = Math.round(899 * q0 * Q * 100 / (d * d)) / 100, r = d / 10, E = F / Q, qs = (att ? -sQ : sQ) * q0; return {
  prompt: `Something buried in the outer wall holds a charge, and Mira tests it with a dust grain. The source is small enough to treat as a point charge. A grain with charge Q = ${sQ > 0 ? '+' : '−'}${n(Q)} μC (1 μC = 10⁻⁶ C) is placed ${n(r)} m from the source, and it feels a force of ${n(F)} μN ${att ? 'towards' : 'away from'} the source (1 μN = 10⁻⁶ N). Use ${K}. Enter the size of the electric field at the grain in N/C, rounded to 2 decimal places. Then enter the source’s charge in nC (1 nC = 10⁻⁹ C), with its sign: a whole number of nC.`,
  answer: [r2(E), qs],
  hints: ['The field is the force per coulomb on a charge placed there: the size of the field is E = F ÷ |Q|. A force in μN on a charge in μC gives the field directly in N/C.', 'Turn E = k|q| ÷ r² around: |q| = E r² ÷ k. Written in nC this is E r² ÷ 8.99, because 10⁹ ÷ (8.99 × 10⁹) = 1 ÷ 8.99. Like charges repel and unlike charges attract, so the pull or push on the grain tells you the sign of the source.'],
  solution: `The size of the field is E = F ÷ |Q| = ${n(F)} μN ÷ ${n(Q)} μC ${eq(E)} ${n(E)} N/C${rnd(E, 'N/C')}. From E = k|q| ÷ r², |q| = E r² ÷ k = ${n(E)} × ${n(r * r)} ÷ (8.99 × 10⁹) C = ${n(E * r * r / 8.99)} × 10⁻⁹ C, which is ${n(q0)} nC. The grain is ${sQ > 0 ? 'positive' : 'negative'} and is ${att ? 'pulled towards' : 'pushed away from'} the source, so the charges ${att ? 'attract: they have opposite signs' : 'repel: they have the same sign'}. The source charge is ${n(qs)} nC.`,
  guidance: [
   { prompt: `The size of the field is the force per coulomb: E = F ÷ |Q| with F = ${n(F)} μN and |Q| = ${n(Q)} μC. What is E in N/C, to 2 decimal places?`, answer: [r2(E)], explanation: `${n(F)} ÷ ${n(Q)} ${eq(E)} ${n(E)} N/C.` },
   { prompt: `Use |q| = E r² ÷ 8.99 for the size of the source charge in nC, with r = ${n(r)} m and the unrounded E. What is |q| in nC?`, answer: [q0], explanation: `${n(E)} × ${n(r * r)} ÷ 8.99 = ${n(q0)} nC.` },
   { prompt: `The grain is ${sQ > 0 ? 'positive' : 'negative'} and is ${att ? 'pulled towards' : 'pushed away from'} the source. Like charges repel and unlike charges attract. What is the source’s charge in nC, with its sign?`, answer: [qs], explanation: `${att ? 'A pull means opposite signs' : 'A push means the same sign'}, so the source is ${qs > 0 ? 'positive' : 'negative'}: ${n(qs)} nC.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'Field between two beacons',
 brief: 'Two charged beacons stand either side of a check point on the cable rail, and the crew needs the field there and the push on a grain placed on it.',
 labels: ['net field Eₓ (kN/C)', 'force Fₓ (mN)'], tolerance: 0.005,
 gl: [['field from the first beacon (kN/C)'], ['field from the second beacon (kN/C)'], ['net field Eₓ (kN/C)'], ['force Fₓ (mN)']]
}, {
 /* Beacon q1 (nC) at x = −d1 cm and q2 (nC) at x = +d2 cm, test charge Q (μC) at the origin. Ex = 89.9·(q1 ÷ d1² − q2 ÷ d2²) kN/C
    (a positive q1 on the left pushes towards +x, a positive q2 on the right towards −x), Fx = Q·Ex mN from the unrounded field.
    Each field at least 0.2 kN/C, the net at least 0.2, everything under 900, off ties, the rounded fields add to the rounded net, and rounding
    the net first leaves the rounded force unchanged. */
 canonical: { q1: 6, d1: 3, q2: -4, d2: 5, Q: 2 },
 draw: R => pick(() => ({ q1: R.nz(-9, 9), d1: R.int(2, 8), q2: R.nz(-9, 9), d2: R.int(2, 9), Q: R.nz(-5, 5) }), p => {
   const E1 = 89.9 * p.q1 / (p.d1 * p.d1), E2 = -89.9 * p.q2 / (p.d2 * p.d2), E = E1 + E2, F = p.Q * E;
   return Math.abs(E1) >= 0.2 && Math.abs(E2) >= 0.2 && Math.abs(E) >= 0.2 && Math.abs(E1) < 900 && Math.abs(E2) < 900 && Math.abs(F) < 900 && !tie(E1) && !tie(E2) && !tie(E) && !tie(F)
    && Math.abs(r2(E1) + r2(E2) - r2(E)) < 1e-9 && r2(p.Q * r2(E)) === r2(F) && !(p.q1 === 6 && p.d1 === 3 && p.q2 === -4 && p.d2 === 5); }, { q1: 6, d1: 3, q2: -4, d2: 5, Q: 2 }),
 build: ({ q1, d1, q2, d2, Q }) => { const E1 = 89.9 * q1 / (d1 * d1), E2 = -89.9 * q2 / (d2 * d2), E = E1 + E2, F = Q * E, dir = f => f > 0 ? '+x' : '−x'; return {
  prompt: `Two charged beacons stand on the cable rail, an x-axis marked in centimetres: a beacon with charge ${n(q1)} nC at x = −${n(d1)} cm and a beacon with charge ${n(q2)} nC at x = ${n(d2)} cm (1 nC = 10⁻⁹ C). Use ${K}. Enter the x component of the net electric field at the origin in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places: positive if it points towards +x. Then a dust grain with charge Q = ${n(Q)} μC is placed at the origin (1 μC = 10⁻⁶ C). Enter the x component of the force on it in millinewtons (mN, 10⁻³ N), using the unrounded field and rounding to 2 decimal places.`,
  answer: [r2(E), r2(F)],
  hints: ['Each beacon makes its own field, and the fields add as signed components (superposition). The field of a point charge has size k|q| ÷ r². With q in nC and the distance d in cm that is 89.9 × |q| ÷ d² kN/C, because 8.99 × 10⁹ × 10⁻⁹ ÷ 10⁻⁴ = 8.99 × 10⁴ N/C = 89.9 kN/C. It points away from a positive charge and towards a negative one.', 'The force on a charge Q placed in a field is F = QE. A charge in μC times a field in kN/C gives a force in mN.'],
  solution: `The beacon at x = −${n(d1)} cm is ${q1 > 0 ? 'positive, so its field at the origin points away from it, towards +x' : 'negative, so its field at the origin points towards it, towards −x'}: E₁ₓ = ${q1 > 0 ? '' : '−'}89.9 × ${n(Math.abs(q1))} ÷ ${n(d1 * d1)} ${eq(E1)} ${n(E1)} kN/C. The beacon at x = ${n(d2)} cm is ${q2 > 0 ? 'positive, so its field points away from it, towards −x' : 'negative, so its field points towards it, towards +x'}: E₂ₓ = ${q2 > 0 ? '−' : ''}89.9 × ${n(Math.abs(q2))} ÷ ${n(d2 * d2)} ${eq(E2)} ${n(E2)} kN/C. By superposition Eₓ = ${sm(E1, E2)} ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}. The force is Fₓ = QEₓ = ${par(Q)} μC × ${par(E)} kN/C ${eq(F)} ${n(F)} mN${rnd(F, 'mN')}.`,
  guidance: [
   { prompt: `Take the beacon at x = −${n(d1)} cm alone. What is the x component of its field at the origin, in kN/C to 2 decimal places (signed)?`, answer: [r2(E1)], explanation: `Size 89.9 × ${n(Math.abs(q1))} ÷ ${n(d1 * d1)} ${eq(E1)} ${n(Math.abs(E1))} kN/C. The beacon is ${q1 > 0 ? 'positive, so the field points away from it, towards +x' : 'negative, so the field points towards it, towards −x'}: ${f2(E1)} kN/C.` },
   { prompt: `Now the beacon at x = ${n(d2)} cm alone. What is the x component of its field at the origin, in kN/C to 2 decimal places (signed)?`, answer: [r2(E2)], explanation: `Size 89.9 × ${n(Math.abs(q2))} ÷ ${n(d2 * d2)} ${eq(E2)} ${n(Math.abs(E2))} kN/C. The beacon is ${q2 > 0 ? 'positive, so the field points away from it, towards −x' : 'negative, so the field points towards it, towards +x'}: ${f2(E2)} kN/C.` },
   { prompt: 'Add the two signed components. What is the net Eₓ in kN/C, to 2 decimal places?', answer: [r2(E)], explanation: `${sm(E1, E2)} ${eq(E)} ${n(E)} kN/C, so ${f2(E)} kN/C.` },
   { prompt: `Multiply by the grain’s charge: Fₓ = QEₓ with Q = ${n(Q)} μC, using the unrounded net field. What is Fₓ in mN, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(Q)} × ${par(E)} ${eq(F)} ${n(F)}, so Fₓ is ${f2(F)} mN.` }
  ] }; }
});

/* ---- q05 Field of a charged rod or ring by integration [5.5] ---- */

/* Rod ends, in centimetres, whose reciprocals in 1/m have at most 2 decimals. */
const ENDS = [5, 8, 10, 16, 20, 25, 40, 50, 80];

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'The guard cable along the dome wall',
 brief: 'A charged guard cable runs along the dome wall to one side of a sensor, and the crew needs its total charge and the push of its field at the sensor.',
 labels: ['total charge (nC)', 'field Eₓ (kN/C)'], tolerance: 0.005,
 gl: [['total charge (nC)'], ['1 ÷ a − 1 ÷ b (1/m)'], ['field Eₓ (kN/C)']]
}, {
 /* A rod on the x-axis between a and b centimetres from the origin, on the +x side (s = 1) or the −x side (s = −1), with linear charge density
    λ = t·lam nC/m (t = ±1). Total charge λ(b − a) ÷ 100 nC; the field at the origin has size k|λ|(1 ÷ a − 1 ÷ b), points away from a positive rod,
    so Eₓ = −s·t·8.99·lam·D ÷ 1000 kN/C with D = 100 ÷ a − 100 ÷ b. |Eₓ| between 0.5 and 99, off ties. */
 canonical: { lam: 30, a: 20, b: 80, s: -1, t: -1 },
 draw: R => pick(() => { const i = R.int(0, 7), j = R.int(i + 1, 8); return { lam: R.int(4, 60), a: ENDS[i], b: ENDS[j], s: R.bool() ? 1 : -1, t: R.bool() ? 1 : -1 }; },
  p => { const E = 8.99 * p.lam * (100 / p.a - 100 / p.b) / 1000; return E >= 0.5 && E < 99 && !tie(E) && !(p.lam === 30 && p.a === 20 && p.b === 80); }, { lam: 30, a: 20, b: 80, s: -1, t: -1 }),
 build: ({ lam, a, b, s, t }) => { const la = t * lam, L = b - a, Q = Math.round(la * L) / 100, ia = 100 / a, ib = 100 / b, D = ia - ib, Es = 8.99 * lam * D / 1000, E = -s * t * Es;
  const x1 = s > 0 ? a / 100 : -b / 100, x2 = s > 0 ? b / 100 : -a / 100; return {
  prompt: `A charged guard cable lies along the x-axis of the cable run from x = ${n(x1)} m to x = ${n(x2)} m. Its charge is spread evenly, with linear charge density λ = ${n(la)} nC/m (nanocoulombs per metre; 1 nC = 10⁻⁹ C). Enter the cable’s total charge in nC (negative if λ is negative). Then enter the x component of the electric field the cable makes at the origin, x = 0, in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places: positive if it points towards +x. Use ${K}.`,
  answer: [Q, r2(E)],
  hints: ['The total charge is the charge per metre times the length of the cable, and it has the sign of λ.', 'Cut the cable into pieces of length dx at distance x from the origin. Each holds dq = λ dx and makes a field of size k|λ| dx ÷ x², all pointing the same way along the axis, so the sizes add up in an integral from the near end’s distance to the far end’s distance. The field points away from a positive charge and towards a negative one: decide its direction from the sign of λ and the side of the origin the cable is on.'],
  solution: `The cable is ${n(L / 100)} m long, so its charge is ${n(la)} nC/m × ${n(L / 100)} m = ${n(Q)} nC. Its ends are ${n(a / 100)} m and ${n(b / 100)} m from the origin. A piece dx at distance x makes a field of size k|λ| dx ÷ x² along the axis, and every piece’s field points the same way, so the size of the field is ∫ k|λ| ÷ x² dx from ${n(a / 100)} to ${n(b / 100)} = k|λ|(1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}) = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ × ${n(D)} ${eq(Es * 1000)} ${n(Es * 1000)} N/C, which is ${n(Es)} kN/C. The cable is on the ${s > 0 ? '+x' : '−x'} side of the origin and its charge is ${t > 0 ? 'positive, so its field points away from it, towards' : 'negative, so its field points towards it, towards'} ${E > 0 ? '+x' : '−x'}: Eₓ ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}.`,
  guidance: [
   { prompt: `The cable runs from ${n(x1)} m to ${n(x2)} m and holds ${n(la)} nC per metre. What is its total charge in nC (with its sign)?`, answer: [Q], explanation: `Its length is ${n(L / 100)} m, and ${n(la)} × ${n(L / 100)} = ${n(Q)} nC.` },
   { prompt: `The near end is ${n(a / 100)} m from the origin and the far end ${n(b / 100)} m. The integral of 1 ÷ x² between those distances is 1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}. What is that number, in 1/m?`, answer: [D], explanation: `An antiderivative of 1 ÷ x² is −1 ÷ x, so the integral is ${n(ia)} − ${n(ib)} = ${n(D)} per metre.` },
   { prompt: `Multiply by k|λ| = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ N·m/C, then give the field its direction: it points ${t > 0 ? 'away from' : 'towards'} the cable, which is on the ${s > 0 ? '+x' : '−x'} side of the origin. What is Eₓ in kN/C, to 2 decimal places?`, answer: [r2(E)], explanation: `k|λ| = ${n(8.99 * lam)} N·m/C and ${n(8.99 * lam)} × ${n(D)} ${eq(Es * 1000)} ${n(Es * 1000)} N/C, which is ${n(Es)} kN/C in size. The field points towards ${E > 0 ? '+x' : '−x'}, so Eₓ ${eq(E)} ${n(E)} kN/C, which is ${f2(E)} kN/C.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The push of the shield rail on a grain',
 brief: 'A charged shield rail runs along the solar field, and Mira wants the field at the near post and the force it puts on a dust grain parked there.',
 labels: ['field Eₓ (kN/C)', 'force Fₓ (mN)'], tolerance: 0.005,
 gl: [['1 ÷ a − 1 ÷ b (1/m)'], ['field Eₓ (kN/C)'], ['force Fₓ (mN)']]
}, {
 /* A positively charged rod from a to b cm on the +x side of the origin, density lam nC/m; a grain of charge Q μC at the origin.
    Eₓ = −8.99·lam·D ÷ 1000 kN/C (away from the rod, towards −x), Fₓ = Q·Eₓ mN from the unrounded field. |E| between 0.5 and 99,
    |F| under 900, off ties, and rounding the field first leaves the rounded force unchanged. */
 canonical: { lam: 10, a: 10, b: 50, Q: 3 },
 draw: R => pick(() => { const i = R.int(0, 7), j = R.int(i + 1, 8); return { lam: R.int(4, 60), a: ENDS[i], b: ENDS[j], Q: R.nz(-6, 6) }; },
  p => { const E = -8.99 * p.lam * (100 / p.a - 100 / p.b) / 1000, F = p.Q * E; return Math.abs(E) >= 0.5 && Math.abs(E) < 99 && Math.abs(F) < 900 && !tie(E) && !tie(F) && r2(p.Q * r2(E)) === r2(F) && !(p.lam === 10 && p.a === 10 && p.b === 50); }, { lam: 10, a: 10, b: 50, Q: 3 }),
 build: ({ lam, a, b, Q }) => { const ia = 100 / a, ib = 100 / b, D = ia - ib, Es = 8.99 * lam * D / 1000, E = -Es, F = Q * E; return {
  prompt: `A charged shield rail lies along the x-axis of the solar field from x = ${n(a / 100)} m to x = ${n(b / 100)} m. Its charge is positive and spread evenly, with linear charge density λ = ${n(lam)} nC/m (nanocoulombs per metre; 1 nC = 10⁻⁹ C). A dust grain with charge Q = ${n(Q)} μC (1 μC = 10⁻⁶ C) is parked at the origin, x = 0. Enter the x component of the electric field the rail makes at the origin in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places: positive if it points towards +x. Then enter the x component of the force on the grain in millinewtons (mN, 10⁻³ N), using the unrounded field and rounding to 2 decimal places. Use ${K}.`,
  answer: [r2(E), r2(F)],
  hints: ['Cut the rail into pieces of length dx at distance x from the origin. Each holds dq = λ dx and makes a field of size kλ dx ÷ x², all pointing the same way along the axis, so the sizes add in an integral from the near end to the far end. The field points away from a positive charge, so work out which way that is for a rail on the +x side.', 'The force on a charge Q placed in a field is F = QE. A charge in μC times a field in kN/C gives a force in mN, and a negative Q turns the force against the field.'],
  solution: `A piece dx at distance x makes a field of size kλ dx ÷ x² along the axis, and every piece’s field points the same way, so the size of the field is ∫ kλ ÷ x² dx from ${n(a / 100)} to ${n(b / 100)} = kλ(1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}) = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ × ${n(D)} ${eq(Es * 1000)} ${n(Es * 1000)} N/C, which is ${n(Es)} kN/C. The rail is positive and on the +x side of the origin, so its field points away from it, towards −x: Eₓ ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}. The force on the grain is Fₓ = QEₓ = ${par(Q)} μC × ${par(E)} kN/C ${eq(F)} ${n(F)} mN${rnd(F, 'mN')}.`,
  guidance: [
   { prompt: `The integral of 1 ÷ x² from ${n(a / 100)} m to ${n(b / 100)} m is 1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}. What is that number, in 1/m?`, answer: [D], explanation: `An antiderivative of 1 ÷ x² is −1 ÷ x, so the integral is ${n(ia)} − ${n(ib)} = ${n(D)} per metre.` },
   { prompt: `Multiply by kλ = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ N·m/C, and give the field its direction (away from the positive rail, which is on the +x side). What is Eₓ in kN/C, to 2 decimal places?`, answer: [r2(E)], explanation: `kλ = ${n(8.99 * lam)} N·m/C and ${n(8.99 * lam)} × ${n(D)} ${eq(Es * 1000)} ${n(Es * 1000)} N/C, which is ${n(Es)} kN/C in size. The field points towards −x, so Eₓ ${eq(E)} ${n(E)} kN/C, which is ${f2(E)} kN/C.` },
   { prompt: `Multiply by the grain’s charge: Fₓ = QEₓ with Q = ${n(Q)} μC, using the unrounded field. What is Fₓ in mN, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(Q)} × ${par(E)} ${eq(F)} ${n(F)}, so Fₓ is ${f2(F)} mN.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q03', title: 'Two rails either side of the sensor',
 brief: 'Two charged rails run along the x-axis, one each side of a sensor, and the crew needs their combined charge and the field they make at the sensor.',
 labels: ['total charge (nC)', 'net field Eₓ (kN/C)'], tolerance: 0.005,
 gl: [['total charge (nC)'], ['field of the left rail (kN/C)'], ['field of the right rail (kN/C)'], ['net field Eₓ (kN/C)']]
}, {
 /* Rail A on the −x side between a1 and b1 cm from the origin with density t1·lam1 nC/m, rail B on the +x side between a2 and b2 cm with t2·lam2.
    EA = +k·λ1·D1 (a positive rail on the left pushes towards +x), EB = −k·λ2·D2 (a positive rail on the right towards −x), in kN/C.
    Total charge ≠ 0; each field at least 0.3; net between 0.2 and 99; off ties; the rounded fields add to the rounded net. */
 canonical: { l1: 20, a1: 10, b1: 40, t1: 1, l2: 15, a2: 25, b2: 80, t2: 1 },
 draw: R => pick(() => { const i = R.int(0, 7), j = R.int(i + 1, 8), k = R.int(0, 7), m = R.int(k + 1, 8);
   return { l1: R.int(4, 40), a1: ENDS[i], b1: ENDS[j], t1: R.bool() ? 1 : -1, l2: R.int(4, 40), a2: ENDS[k], b2: ENDS[m], t2: R.bool() ? 1 : -1 }; },
  p => { const D1 = 100 / p.a1 - 100 / p.b1, D2 = 100 / p.a2 - 100 / p.b2, EA = 8.99 * p.t1 * p.l1 * D1 / 1000, EB = -8.99 * p.t2 * p.l2 * D2 / 1000, E = EA + EB,
    Q = (p.t1 * p.l1 * (p.b1 - p.a1) + p.t2 * p.l2 * (p.b2 - p.a2)) / 100;
   return Math.abs(EA) >= 0.3 && Math.abs(EB) >= 0.3 && Math.abs(E) >= 0.2 && Math.abs(E) < 99 && Math.abs(EA) < 99 && Math.abs(EB) < 99 && Math.abs(Q) >= 0.05 && !tie(EA) && !tie(EB) && !tie(E) && Math.abs(r2(EA) + r2(EB) - r2(E)) < 1e-9
    && !(p.l1 === 20 && p.a1 === 10 && p.b1 === 40 && p.l2 === 15); }, { l1: 20, a1: 10, b1: 40, t1: 1, l2: 15, a2: 25, b2: 80, t2: 1 }),
 build: ({ l1, a1, b1, t1, l2, a2, b2, t2 }) => { const la1 = t1 * l1, la2 = t2 * l2, D1 = 100 / a1 - 100 / b1, D2 = 100 / a2 - 100 / b2,
  EA = 8.99 * la1 * D1 / 1000, EB = -8.99 * la2 * D2 / 1000, E = EA + EB, QA = Math.round(la1 * (b1 - a1)) / 100, QB = Math.round(la2 * (b2 - a2)) / 100, Q = QA + QB;
  return {
  prompt: `Two charged rails lie along the x-axis of the solar field, one on each side of a sensor at the origin. The left rail runs from x = ${n(-b1 / 100)} m to x = ${n(-a1 / 100)} m with linear charge density λ = ${n(la1)} nC/m. The right rail runs from x = ${n(a2 / 100)} m to x = ${n(b2 / 100)} m with λ = ${n(la2)} nC/m (nanocoulombs per metre; 1 nC = 10⁻⁹ C). Each rail’s charge is spread evenly. Enter the total charge on the two rails together in nC (with its sign). Then enter the x component of the net electric field at the origin in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places: positive if it points towards +x. Use ${K}.`,
  answer: [Q, r2(E)],
  hints: ['A rail’s charge is its density times its length, and it has the sign of its density. Add the two rails’ charges, signs included.', 'For each rail, cut it into pieces dx at distance x from the origin: the field has size k|λ| ÷ x² per metre, all along the axis, so its size is k|λ|(1 ÷ near − 1 ÷ far) with near and far the distances of its ends from the origin. A positive rail’s field points away from it and a negative rail’s towards it. Add the two rails’ signed x components (superposition).'],
  solution: `Left rail: length ${n((b1 - a1) / 100)} m, charge ${n(la1)} × ${n((b1 - a1) / 100)} = ${n(QA)} nC. Right rail: length ${n((b2 - a2) / 100)} m, charge ${n(la2)} × ${n((b2 - a2) / 100)} = ${n(QB)} nC. Together they hold ${sm(QA, QB)} = ${n(Q)} nC. The left rail’s field has size k|λ|(1 ÷ ${n(a1 / 100)} − 1 ÷ ${n(b1 / 100)}) = 8.99 × 10⁹ × ${n(l1)} × 10⁻⁹ × ${n(D1)} ${eq(Math.abs(EA) * 1000)} ${n(Math.abs(EA) * 1000)} N/C. That rail is on the −x side and ${t1 > 0 ? 'positive, so its field points away from it, towards +x' : 'negative, so its field points towards it, towards −x'}: E_left ${eq(EA)} ${n(EA)} kN/C. The right rail’s field has size 8.99 × 10⁹ × ${n(l2)} × 10⁻⁹ × ${n(D2)} ${eq(Math.abs(EB) * 1000)} ${n(Math.abs(EB) * 1000)} N/C. That rail is on the +x side and ${t2 > 0 ? 'positive, so its field points away from it, towards −x' : 'negative, so its field points towards it, towards +x'}: E_right ${eq(EB)} ${n(EB)} kN/C. By superposition Eₓ = ${sm(EA, EB)} ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}.`,
  guidance: [
   { prompt: `Each rail’s charge is its density times its length. What is the total charge of the two rails together, in nC (with its sign)?`, answer: [Q], explanation: `Left: ${n(la1)} × ${n((b1 - a1) / 100)} = ${n(QA)} nC. Right: ${n(la2)} × ${n((b2 - a2) / 100)} = ${n(QB)} nC. Together ${sm(QA, QB)} = ${n(Q)} nC.` },
   { prompt: `Take the left rail alone: its ends are ${n(a1 / 100)} m and ${n(b1 / 100)} m from the origin and λ = ${n(la1)} nC/m. What is the x component of its field at the origin, in kN/C to 2 decimal places (signed)?`, answer: [r2(EA)], explanation: `1 ÷ ${n(a1 / 100)} − 1 ÷ ${n(b1 / 100)} = ${n(D1)} per metre, so the size is 8.99 × ${n(l1)} × ${n(D1)} ${eq(Math.abs(EA) * 1000)} ${n(Math.abs(EA) * 1000)} N/C = ${n(Math.abs(EA))} kN/C. The rail is on the −x side and ${t1 > 0 ? 'positive, so the field points towards +x' : 'negative, so the field points towards −x'}: ${f2(EA)} kN/C.` },
   { prompt: `Now the right rail alone: its ends are ${n(a2 / 100)} m and ${n(b2 / 100)} m from the origin and λ = ${n(la2)} nC/m. What is the x component of its field at the origin, in kN/C to 2 decimal places (signed)?`, answer: [r2(EB)], explanation: `1 ÷ ${n(a2 / 100)} − 1 ÷ ${n(b2 / 100)} = ${n(D2)} per metre, so the size is 8.99 × ${n(l2)} × ${n(D2)} ${eq(Math.abs(EB) * 1000)} ${n(Math.abs(EB) * 1000)} N/C = ${n(Math.abs(EB))} kN/C. The rail is on the +x side and ${t2 > 0 ? 'positive, so the field points towards −x' : 'negative, so the field points towards +x'}: ${f2(EB)} kN/C.` },
   { prompt: 'Add the two rails’ signed x components. What is the net Eₓ in kN/C, to 2 decimal places?', answer: [r2(E)], explanation: `${sm(EA, EB)} ${eq(E)} ${n(E)} kN/C, which is ${f2(E)} kN/C.` }
  ] }; }
});

})();
