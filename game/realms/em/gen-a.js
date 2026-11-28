/* Electricity and magnetism: fields mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding to 2 decimal places (half away from zero), and draws that sit on or next to a rounding tie. */
const r2 = x => (x < 0 ? -1 : 1) * Math.round(Math.abs(x) * 100 + 1e-9) / 100;
const tie = x => { const f = (Math.abs(x) * 100) % 1; return Math.abs(f - 0.5) < 2e-3; };
/* "= 0.5394" when the 4-decimal text is exact, "≈ 0.6992" when it is not. */
const eq = x => Math.abs(x - Math.round(x * 1e4) / 1e4) < 1e-9 ? '=' : '≈';
/* A number shown with exactly 2 decimals (0.70, −10.79). */
const f2 = x => r2(x).toFixed(2).replace('-', '−');
/* ", which is 0.70 N to 2 decimal places" only when rounding changes the value. */
const rnd = (x, u) => Math.abs(r2(x) - x) < 1e-9 ? '' : `, which is ${f2(x)} ${u} to 2 decimal places`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const pick = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* Angles kπ/6 in radians, as text. */
const ang = k => ({ 1: 'π/6', 2: 'π/3', 3: 'π/2', 4: '2π/3', 5: '5π/6' })[k];
/* A fraction of π, num·π/den, as text (π/4, 3π/4). */
const piText = (num, den) => `${num === 1 ? '' : num}π/${den}`;
const K = 'k = 8.99 × 10⁹ N·m²/C²', EPS = 'ε₀ = 8.85 × 10⁻¹² C²/(N·m²)';
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* N extra electrons (a multiple of 5, so the charge N × 0.016 × 10⁻¹⁷ C has at most 2 decimals); m electrons removed.
    m may exceed N, leaving the grain positive; m never equals N (a charge of 0 would hide the sign rule). */
 q01: {
  canonical: { N: 300, m: 120 },
  draw: R => pick(() => ({ N: 5 * R.int(12, 120), m: 5 * R.int(1, 160) }), p => p.m !== p.N && p.m <= p.N + 200 && p.N !== 50, { N: 300, m: 120 }),
  build: ({ N, m }) => { const q = N * 0.016, left = N - m, nq = Math.round(-left * 1.6) / 100; return {
   prompt: `A dust grain on a solar panel carries a net charge of −${n(q)} × 10⁻¹⁷ C (coulombs). Charge comes only in whole numbers of the elementary charge e = 1.60 × 10⁻¹⁹ C: each electron carries −e and each proton +e. Enter how many more electrons than protons the grain has. Mira’s brush then pulls ${n(m)} electrons off the grain. Enter the grain’s new charge as the number that multiplies 10⁻¹⁷ C (a negative number for a negative charge).`,
   answer: [N, nq],
   hints: ['The number of extra electrons is the size of the charge divided by e. Dividing 10⁻¹⁷ by 10⁻¹⁹ gives 10², which is 100.', 'Charge is conserved: each electron the brush takes away removes −e from the grain. Find how many extra electrons are left (negative if protons now outnumber electrons), then multiply that count by −e.'],
   solution: `The number of extra electrons is (${n(q)} × 10⁻¹⁷ C) ÷ (1.60 × 10⁻¹⁹ C) = (${n(q)} ÷ 1.6) × 100 = ${n(N / 100)} × 100 = ${n(N)}. ${left > 0 ? `Taking ${n(m)} electrons away leaves ${n(left)} extra electrons` : `Taking ${n(m)} electrons away leaves ${n(-left)} more protons than electrons`}, so the new charge is ${n(-left)} × 1.60 × 10⁻¹⁹ C = ${n(nq)} × 10⁻¹⁷ C. ${left > 0 ? 'The grain is still negative.' : 'The grain is now positive.'}`,
   guidance: [
    { prompt: `How many times does e = 1.60 × 10⁻¹⁹ C go into ${n(q)} × 10⁻¹⁷ C? That is the number of extra electrons.`, answer: [N], explanation: `(${n(q)} ÷ 1.6) × 10⁻¹⁷ ÷ 10⁻¹⁹ = ${n(N / 100)} × 100 = ${n(N)} electrons.` },
    { prompt: `The grain had ${n(N)} more electrons than protons and loses ${n(m)} electrons. How many more electrons than protons does it have now? (Enter a negative number if protons now outnumber electrons.)`, answer: [left], explanation: `${n(N)} − ${n(m)} = ${n(left)}. Protons are not moved, so only the electron count changes.` },
    { prompt: `Each extra electron carries −1.60 × 10⁻¹⁹ C. What is the new charge, as the number that multiplies 10⁻¹⁷ C?`, answer: [nq], explanation: `${n(left)} × (−1.60 × 10⁻¹⁹ C) = ${n(nq)} × 10⁻¹⁷ C.` }
   ] }; }
 },
 /* Charges a, b in μC (non-zero, −9 to 9) and a separation of d tenths of a metre. F = 0.899|ab| ÷ d² newtons exactly.
    F between 0.1 and 99, off rounding ties; both signs of ab occur, so the second box is 1 or −1. */
 q02: {
  canonical: { a: 3, b: -5, d: 5 },
  draw: R => pick(() => ({ a: R.nz(-9, 9), b: R.nz(-9, 9), d: R.int(1, 9) }), p => { const F = 0.899 * Math.abs(p.a * p.b) / (p.d * p.d); return F >= 0.1 && F < 99 && !tie(F) && !(p.a === 3 && p.b === -5 && p.d === 5) && !(p.a * p.b === 12 && p.d === 3); }, { a: 3, b: -5, d: 5 }),
  build: ({ a, b, d }) => { const P = Math.abs(a * b), r = d / 10, F = 0.899 * P / (d * d), s = a * b > 0 ? 1 : -1; return {
   prompt: `Two small charged spheres sit on the panel test rig with their centres ${n(r)} m apart. One has charge q₁ = ${n(a)} μC and the other q₂ = ${n(b)} μC, where 1 μC (microcoulomb) is 10⁻⁶ C. Use Coulomb’s law with ${K}. Enter the size of the force each sphere exerts on the other in newtons, rounded to 2 decimal places. Then enter 1 if the spheres repel each other or −1 if they attract.`,
   answer: [r2(F), s],
   hints: ['Coulomb’s law: F = k|q₁q₂| ÷ r². Write each charge in coulombs first, so that 1 μC × 1 μC is 10⁻¹² C².', 'Like charges (both positive or both negative) repel; unlike charges attract.'],
   solution: `F = k|q₁q₂| ÷ r² = 8.99 × 10⁹ × ${n(P)} × 10⁻¹² ÷ ${n(r)}² = ${n(8.99 * P)} × 10⁻³ ÷ ${n(r * r)} ${eq(F)} ${n(F)} N, which is ${f2(F)} N to 2 decimal places. The charges have ${s > 0 ? 'the same sign, so the spheres repel' : 'opposite signs, so the spheres attract'}: enter ${n(s)}.`,
   guidance: [
    { prompt: `Multiply the sizes of the two charges: what is |q₁q₂| as the number that multiplies 10⁻¹² C²?`, answer: [P], explanation: `${n(Math.abs(a))} μC × ${n(Math.abs(b))} μC = ${n(P)} × 10⁻⁶ × 10⁻⁶ C² = ${n(P)} × 10⁻¹² C².` },
    { prompt: `Now F = k|q₁q₂| ÷ r² with r = ${n(r)} m. What is F in newtons, to 2 decimal places?`, answer: [r2(F)], explanation: `8.99 × 10⁹ × ${n(P)} × 10⁻¹² = ${n(8.99 * P)} × 10⁻³, and dividing by ${n(r)}² = ${n(r * r)} gives ${n(F)} N, so ${f2(F)} N.` },
    { prompt: `q₁ = ${n(a)} μC and q₂ = ${n(b)} μC. Enter 1 if they repel or −1 if they attract.`, answer: [s], explanation: s > 0 ? 'The two charges have the same sign, and like charges repel.' : 'The two charges have opposite signs, and unlike charges attract.' }
   ] }; }
 },
 /* Test charge q (μC) at x = 0; q1 at x = −d1/10 m, q2 at x = +d2/10 m. F1x = +0.899 q q1 ÷ d1², F2x = −0.899 q q2 ÷ d2².
    Filtered so each force is at least 0.05 N, the net at least 0.05 N, nothing sits on a rounding tie, and the rounded
    forces add to the rounded net (so rounding the parts first gives the same answer). */
 q03: {
  canonical: { q: 2, q1: 5, d1: 3, q2: -4, d2: 2 },
  draw: R => pick(() => ({ q: R.nz(-6, 6), q1: R.nz(-9, 9), d1: R.int(1, 6), q2: R.nz(-9, 9), d2: R.int(1, 6) }), p => {
   const F1 = 0.899 * p.q * p.q1 / (p.d1 * p.d1), F2 = -0.899 * p.q * p.q2 / (p.d2 * p.d2), F = F1 + F2;
   return Math.abs(F1) >= 0.05 && Math.abs(F2) >= 0.05 && Math.abs(F) >= 0.05 && Math.abs(F) < 99 && !tie(F1) && !tie(F2) && !tie(F) && Math.abs(r2(F1) + r2(F2) - r2(F)) < 1e-9 && !(p.q === 1 && p.q1 === 3 && p.d1 === 1 && p.q2 === 3 && p.d2 === 3); }, { q: 2, q1: 5, d1: 3, q2: -4, d2: 2 }),
  build: ({ q, q1, d1, q2, d2 }) => { const F1 = 0.899 * q * q1 / (d1 * d1), F2 = -0.899 * q * q2 / (d2 * d2), F = F1 + F2, x1 = d1 / 10, x2 = d2 / 10;
   const push = (a, b) => a * b > 0 ? 'repels' : 'attracts';
   return {
   prompt: `The panel test rail is an x-axis marked in metres. A test sphere with charge q = ${n(q)} μC sits at x = 0. A sphere with charge ${n(q1)} μC sits at x = −${n(x1)} m and a sphere with charge ${n(q2)} μC sits at x = ${n(x2)} m (1 μC = 10⁻⁶ C). Use ${K}. Enter the x component of the net electric force on the test sphere in newtons, rounded to 2 decimal places: positive if it points towards +x, negative if towards −x.`,
   answer: [r2(F)],
   hints: ['Find the size of each force alone with Coulomb’s law, F = k|q₁q₂| ÷ r², then give it a sign from its direction: a repelling force points away from the other sphere, an attracting one towards it.', 'By superposition the net force is the sum of the two signed x components. Round only at the end.'],
   solution: `The sphere on the left ${push(q, q1)} the test sphere: F₁ = 8.99 × 10⁹ × ${n(Math.abs(q * q1))} × 10⁻¹² ÷ ${n(x1)}² ${eq(Math.abs(F1))} ${n(Math.abs(F1))} N, pointing towards ${F1 > 0 ? '+x' : '−x'}, so F₁ₓ ${eq(F1)} ${n(F1)} N. The sphere on the right ${push(q, q2)} it: F₂ = 8.99 × 10⁹ × ${n(Math.abs(q * q2))} × 10⁻¹² ÷ ${n(x2)}² ${eq(Math.abs(F2))} ${n(Math.abs(F2))} N, pointing towards ${F2 > 0 ? '+x' : '−x'}, so F₂ₓ ${eq(F2)} ${n(F2)} N. By superposition the net x component is ${n(F1)} ${plus(F2).replace(/^([+−])/, '$1 ')} ${eq(F)} ${n(F)} N, which is ${f2(F)} N to 2 decimal places.`,
   guidance: [
    { prompt: `Take the sphere at x = −${n(x1)} m alone. What is the x component of its force on the test sphere, in newtons to 2 decimal places (signed)?`, answer: [r2(F1)], explanation: `Size 8.99 × 10⁹ × ${n(Math.abs(q * q1))} × 10⁻¹² ÷ ${n(x1 * x1)} ${eq(Math.abs(F1))} ${n(Math.abs(F1))} N. It ${push(q, q1)}, and the sphere is on the left, so the force points towards ${F1 > 0 ? '+x' : '−x'}: ${f2(F1)} N.` },
    { prompt: `Now the sphere at x = ${n(x2)} m alone. What is the x component of its force on the test sphere, in newtons to 2 decimal places (signed)?`, answer: [r2(F2)], explanation: `Size 8.99 × 10⁹ × ${n(Math.abs(q * q2))} × 10⁻¹² ÷ ${n(x2 * x2)} ${eq(Math.abs(F2))} ${n(Math.abs(F2))} N. It ${push(q, q2)}, and the sphere is on the right, so the force points towards ${F2 > 0 ? '+x' : '−x'}: ${f2(F2)} N.` },
    { prompt: 'Add the two signed x components. What is the net x component of the force, in newtons to 2 decimal places?', answer: [r2(F)], explanation: `${n(F1)} ${plus(F2).replace(/^([+−])/, '$1 ')} ${eq(F)} ${n(F)} N, so ${f2(F)} N.` }
   ] }; }
 },
 /* Source charge q (nC) at the origin, the point P at x = d/10 m, a test charge Q (μC) placed at P.
    Ex = 8.99 q ÷ (d/10)² N/C; Fx = Q × Ex in μN, from the unrounded field. Both off rounding ties. */
 q04: {
  canonical: { q: 6, d: 3, Q: -2 },
  draw: R => pick(() => ({ q: R.nz(-9, 9), d: R.int(1, 6), Q: R.nz(-5, 5) }), p => { const E = 899 * p.q / (p.d * p.d), F = p.Q * E; return !tie(E) && !tie(F) && !(p.q === 6 && p.d === 3) && !(p.q === -4 && p.d === 2); }, { q: 6, d: 3, Q: -2 }),
  build: ({ q, d, Q }) => { const r = d / 10, E = 899 * q / (d * d), F = Q * E; return {
   prompt: `A charged sensor with charge q = ${n(q)} nC sits at the origin of the panel grid, where 1 nC (nanocoulomb) is 10⁻⁹ C. The point P is at x = ${n(r)} m on the x-axis. Use ${K}. Enter the x component of the electric field at P in newtons per coulomb (N/C), rounded to 2 decimal places: positive if it points towards +x. Then a test charge Q = ${n(Q)} μC is placed at P (1 μC = 10⁻⁶ C). Enter the x component of the force on it in micronewtons (μN, 10⁻⁶ N), using the unrounded field and rounding to 2 decimal places, without commas.`,
   answer: [r2(E), r2(F)],
   hints: ['The field of a point charge has size E = k|q| ÷ r². It points away from a positive charge and towards a negative one.', 'The force on a charge Q placed in a field is F = QE. A charge in μC times a field in N/C gives a force in μN, and a negative Q turns the force against the field.'],
   solution: `E = k|q| ÷ r² = 8.99 × 10⁹ × ${n(Math.abs(q))} × 10⁻⁹ ÷ ${n(r)}² = ${n(8.99 * Math.abs(q))} ÷ ${n(r * r)} ${eq(Math.abs(E))} ${n(Math.abs(E))} N/C. P is on the +x side of the sensor and the sensor is ${q > 0 ? 'positive, so the field points away from it, towards +x' : 'negative, so the field points towards it, towards −x'}: Eₓ ${eq(E)} ${n(E)} N/C, which is ${f2(E)} N/C to 2 decimal places. The force on the test charge is Fₓ = QEₓ = ${n(Q)} μC × ${par(E)} N/C ${eq(F)} ${n(F)} μN, which is ${f2(F)} μN.`,
   guidance: [
    { prompt: `What is the size of the field at P, k|q| ÷ r² with r = ${n(r)} m, in N/C to 2 decimal places?`, answer: [r2(Math.abs(E))], explanation: `8.99 × 10⁹ × ${n(Math.abs(q))} × 10⁻⁹ = ${n(8.99 * Math.abs(q))}, and ${n(8.99 * Math.abs(q))} ÷ ${n(r * r)} ${eq(Math.abs(E))} ${n(Math.abs(E))} N/C.` },
    { prompt: `The sensor’s charge is ${n(q)} nC. Give the field’s x component at P a sign: what is Eₓ in N/C, to 2 decimal places?`, answer: [r2(E)], explanation: q > 0 ? 'A positive charge’s field points away from it. P lies towards +x of the sensor, so Eₓ is positive.' : 'A negative charge’s field points towards it. P lies towards +x of the sensor, so the field points back towards −x and Eₓ is negative.' },
    { prompt: `Multiply by the test charge: Fₓ = QEₓ with Q = ${n(Q)} μC. What is Fₓ in μN, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(Q)} × ${par(E)} ${eq(F)} ${n(F)}, so Fₓ is ${f2(F)} μN.` }
   ] }; }
 },
 /* A rod on the x-axis from x = a to x = b centimetres (a, b from a list whose reciprocals in 1/m have at most 2 decimals),
    charge density lam nC/m. E = kλ(1/a − 1/b) at the origin; the answer is E in kN/C to 2 decimal places, off ties. */
 q05: {
  canonical: { lam: 15, a: 10, b: 50 },
  draw: R => pick(() => { const L = [5, 8, 10, 16, 20, 25, 40, 50, 80], i = R.int(0, 7), j = R.int(i + 1, 8); return { lam: R.int(4, 60), a: L[i], b: L[j] }; },
   p => { const E = 8.99 * p.lam * (100 / p.a - 100 / p.b) / 1000; return E >= 0.1 && E < 99 && !tie(E) && !(p.lam === 15 && p.a === 10 && p.b === 50) && !(p.a === 20 && p.b === 80); }, { lam: 15, a: 10, b: 50 }),
  build: ({ lam, a, b }) => { const L = b - a, Q = lam * L / 100, ia = 100 / a, ib = 100 / b, D = ia - ib, E = 8.99 * lam * D, Ek = E / 1000; return {
   prompt: `A charged guard rod lies along the x-axis of the panel grid from x = ${n(a / 100)} m to x = ${n(b / 100)} m. Its charge is spread evenly, with linear charge density λ = ${n(lam)} nC/m (nanocoulombs per metre; 1 nC = 10⁻⁹ C). Enter the rod’s total charge in nC. Then enter the size of the electric field the rod makes at the origin, x = 0, in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places. Use ${K}.`,
   answer: [Q, r2(Ek)],
   hints: ['The total charge is the charge per metre times the length of the rod.', 'Cut the rod into pieces of length dx at distance x from the origin. Each holds dq = λ dx and makes a field of size kλ dx ÷ x², all pointing the same way along the axis, so add them with an integral from the near end to the far end.'],
   solution: `The rod is ${n(b / 100)} − ${n(a / 100)} = ${n(L / 100)} m long, so its charge is ${n(lam)} nC/m × ${n(L / 100)} m = ${n(Q)} nC. A piece dx at distance x makes a field kλ dx ÷ x² along the axis, and every piece’s field points the same way, so E = ∫ kλ ÷ x² dx from ${n(a / 100)} to ${n(b / 100)} = kλ(1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}) = kλ × (${n(ia)} − ${n(ib)}) = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ × ${n(D)} ${eq(E)} ${n(E)} N/C. That is ${f2(Ek)} kN/C to 2 decimal places.`,
   guidance: [
    { prompt: `The rod runs from ${n(a / 100)} m to ${n(b / 100)} m and holds ${n(lam)} nC per metre. What is its total charge in nC?`, answer: [Q], explanation: `Its length is ${n(L / 100)} m, and ${n(lam)} × ${n(L / 100)} = ${n(Q)} nC.` },
    { prompt: `The integral of 1 ÷ x² from ${n(a / 100)} to ${n(b / 100)} is 1 ÷ ${n(a / 100)} − 1 ÷ ${n(b / 100)}. What is that number, in 1/m?`, answer: [D], explanation: `An antiderivative of 1 ÷ x² is −1 ÷ x, so the integral is ${n(ia)} − ${n(ib)} = ${n(D)} per metre.` },
    { prompt: `Multiply by kλ = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ N·m/C. What is E in kN/C, to 2 decimal places?`, answer: [r2(Ek)], explanation: `kλ = ${n(8.99 * lam)} N·m/C, and ${n(8.99 * lam)} × ${n(D)} ${eq(E)} ${n(E)} N/C, which is ${f2(Ek)} kN/C.` }
   ] }; }
 },
 /* Charges ±q nC, d cm apart, in a uniform field of E kN/C at an angle kπ/6 between p and E. p = qd/100 nC·m,
    the force on each charge qE μN, the torque pE sin θ μN·m (nC·m × kN/C = μN·m), to 2 decimal places, off ties. */
 q06: {
  canonical: { q: 5, d: 4, E: 30, k: 1 },
  draw: R => pick(() => ({ q: R.int(2, 9), d: R.int(1, 6), E: 5 * R.int(2, 16), k: R.int(1, 5) }), p => { const t = p.q * p.d / 100 * p.E * Math.sin(p.k * Math.PI / 6); return t >= 0.05 && !tie(t) && !(p.q === 5 && p.d === 4 && p.E === 30) && !(p.q === 3 && p.d === 5 && p.E === 20); }, { q: 5, d: 4, E: 30, k: 1 }),
  build: ({ q, d, E, k }) => { const p = q * d / 100, s = Math.sin(k * Math.PI / 6), tau = p * E * s, F = q * E; return {
   prompt: `A dust sensor holds charges +${n(q)} nC and −${n(q)} nC on the two ends of a rod ${n(d / 100)} m long (1 nC = 10⁻⁹ C). It sits in the uniform field of a panel guard, of strength ${n(E)} kN/C (1 kN/C = 1000 N/C), and the angle between the dipole moment and the field is θ = ${ang(k)} radians. Enter the size of the dipole moment p in nanocoulomb-metres (nC·m). Then enter the size of the torque on the sensor in micronewton-metres (μN·m, 10⁻⁶ N·m), rounded to 2 decimal places.`,
   answer: [p, r2(tau)],
   hints: ['The dipole moment is p = qd: one charge’s size times the distance between the charges.', 'Each charge feels a force qE, in opposite directions, each acting a distance d ÷ 2 from the centre. Their torques add to τ = qdE sin θ = pE sin θ. A charge in nC times a field in kN/C is a force in μN.'],
   solution: `p = qd = ${n(q)} nC × ${n(d / 100)} m = ${n(p)} nC·m. Each charge feels a force of size qE = ${n(q)} nC × ${n(E)} kN/C = ${n(F)} μN, the two in opposite directions, so the net force is zero but they turn the rod. Each acts ${n(d / 200)} m from the centre at angle θ, so the torque is 2 × ${n(F)} μN × ${n(d / 200)} m × sin(${ang(k)}) = pE sin θ = ${n(p)} × ${n(E)} × ${n(s)}${Math.abs(s - Math.round(s * 1e4) / 1e4) > 1e-9 ? '…' : ''} ${eq(tau)} ${n(tau)} μN·m${rnd(tau, 'μN·m')}.`,
   guidance: [
    { prompt: `What is the dipole moment p = qd, with q = ${n(q)} nC and d = ${n(d / 100)} m, in nC·m?`, answer: [p], explanation: `${n(q)} × ${n(d / 100)} = ${n(p)} nC·m.` },
    { prompt: `What is the size of the force on one of the charges, qE, in μN?`, answer: [F], explanation: `${n(q)} nC × ${n(E)} kN/C = ${n(q)} × 10⁻⁹ × ${n(E)} × 10³ N = ${n(F)} × 10⁻⁶ N = ${n(F)} μN.` },
    { prompt: `The torque is τ = pE sin θ with θ = ${ang(k)}. What is τ in μN·m, to 2 decimal places?`, answer: [r2(tau)], explanation: `sin(${ang(k)}) ${eq(s)} ${n(s)}, and ${n(p)} × ${n(E)} × ${n(s)} ${eq(tau)} ${n(tau)}, so τ is ${f2(tau)} μN·m.` }
   ] }; }
 },
 /* Uniform field E (N/C) through a flat panel of area A (m²), angle num·π/den between the field and the panel's normal;
    then a field Ex = c·x (N/C, x in metres) through a panel of width w and height h facing straight into it. */
 q07: {
  canonical: { E: 400, A: 3, num: 1, den: 3, c: 50, w: 2, h: 3 },
  draw: R => pick(() => { const [num, den] = R.pick([[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6]]); return { E: 50 * R.int(2, 18), A: R.int(2, 12), num, den, c: 10 * R.int(2, 20), w: R.int(2, 5), h: R.int(2, 4) }; },
   p => { const F = p.E * p.A * Math.cos(p.num * Math.PI / p.den); return !tie(F) && !(p.E === 400 && p.A === 3) && !(p.E === 600 && p.A === 2); }, { E: 400, A: 3, num: 1, den: 3, c: 50, w: 2, h: 3 }),
  build: ({ E, A, num, den, c, w, h }) => { const th = num * Math.PI / den, cs = Math.cos(th), F1 = E * A * cs, F2 = h * c * w * w / 2, at = piText(num, den); return {
   prompt: `A flat solar panel of area ${n(A)} m² sits in a uniform electric field of ${n(E)} N/C. The angle between the field and the panel’s normal (the direction straight out of its face) is ${at} radians. Enter the electric flux through the panel in N·m²/C, rounded to 2 decimal places and without commas (negative if the field passes in through the back). A second panel, ${n(w)} m wide and ${n(h)} m tall, faces straight into a field whose strength grows across its width: at distance x metres from its left edge the field is ${n(c)}x N/C, along the normal. Enter the flux through the second panel in N·m²/C, also without commas.`,
   answer: [r2(F1), F2],
   hints: ['For a uniform field and a flat surface the flux is Φ = EA cos θ, with θ the angle between the field and the normal.', 'When the field changes across the surface, cut it into thin strips where the field is nearly constant. A strip of width dx has area h dx and flux E(x) × h dx; the surface integral adds them: Φ = ∫ E(x) h dx across the width.'],
   solution: `First panel: Φ = EA cos θ = ${n(E)} × ${n(A)} × cos(${at}) = ${n(E * A)} × ${cs < 0 ? '(' : ''}${n(cs)}${Math.abs(cs - Math.round(cs * 1e4) / 1e4) > 1e-9 ? '…' : ''}${cs < 0 ? ')' : ''} ${eq(F1)} ${n(F1)} N·m²/C${rnd(F1, 'N·m²/C')}. Second panel: a strip at x of width dx has area ${n(h)} dx and flux ${n(c)}x × ${n(h)} dx, so Φ = ∫ ${n(c * h)}x dx from 0 to ${n(w)} = ${n(c * h)} × ${n(w)}² ÷ 2 = ${n(F2)} N·m²/C.`,
   guidance: [
    { prompt: `What is cos(${at}), to 2 decimal places? It tells you what share of the field goes straight through the first panel.`, answer: [r2(cs)], explanation: `cos(${at}) ${eq(cs)} ${n(cs)}${cs < 0 ? ', negative because the field meets the panel from behind' : ''}.` },
    { prompt: `Multiply EA by that cosine (unrounded). What is the flux through the first panel, in N·m²/C to 2 decimal places?`, answer: [r2(F1)], explanation: `${n(E)} × ${n(A)} = ${n(E * A)}, and ${n(E * A)} × cos(${at}) ${eq(F1)} ${n(F1)} N·m²/C.` },
    { prompt: `For the second panel, add up the strips: what is ∫ ${n(c)}x × ${n(h)} dx from x = 0 to x = ${n(w)}, in N·m²/C?`, answer: [F2], explanation: `An antiderivative of ${n(c * h)}x is ${n(c * h / 2)}x², and ${n(c * h / 2)} × ${n(w * w)} = ${n(F2)}.` }
   ] }; }
 },
 /* Charges q1, q2 (nC) inside a closed surface and q3 outside; the flux (q1 + q2) ÷ ε₀ to the nearest whole number.
    A second closed surface with flux 200m N·m²/C encloses 1.77m nC exactly. */
 q08: {
  canonical: { q1: 4, q2: -1, q3: 6, m: 5 },
  draw: R => pick(() => ({ q1: R.nz(-9, 9), q2: R.nz(-9, 9), q3: R.nz(-9, 9), m: R.nz(-12, 12) }), p => { const s = p.q1 + p.q2, F = s * 1000 / 8.85, f = Math.abs(F) % 1; return s !== 0 && Math.abs(f - 0.5) > 2e-3 && !(p.q1 === 4 && p.q2 === -1 && p.m === 5) && !(p.q1 === 7 && p.q2 === -2) && p.m !== 2; }, { q1: 4, q2: -1, q3: 6, m: 5 }),
  build: ({ q1, q2, q3, m }) => { const s = q1 + q2, F = s * 1000 / 8.85, Fr = Math.round(F), P = 200 * m, Q = Math.round(177 * m) / 100; return {
   prompt: `A closed test surface wraps one of the dome’s sensor racks. Inside it are charges of ${n(q1)} nC and ${n(q2)} nC; just outside it is a charge of ${n(q3)} nC (1 nC = 10⁻⁹ C). Use ${EPS}. Enter the net electric flux out of the closed surface in N·m²/C, rounded to the nearest whole number and without commas (negative if more flux goes in than out). A second closed surface, around a different rack, has a net outward flux of ${n(P)} N·m²/C. Enter the net charge inside it in nC, to 2 decimal places.`,
   answer: [Fr, Q],
   hints: ['Gauss’s law: the net flux out of a closed surface is the charge enclosed divided by ε₀. A charge outside sends as much flux in as out, so it adds nothing.', 'Run Gauss’s law backwards for the second surface: the enclosed charge is ε₀ times the flux.'],
   solution: `Only the charges inside count: q_enc = ${n(q1)} ${plus(q2).replace(/^([+−])/, '$1 ')} = ${n(s)} nC; the ${n(q3)} nC outside adds no net flux. Φ = q_enc ÷ ε₀ = ${n(s)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)} N·m²/C, which is ${n(Fr)} to the nearest whole number. For the second surface q_enc = ε₀Φ = 8.85 × 10⁻¹² × ${par(P)} = ${n(Q)} × 10⁻⁹ C = ${n(Q)} nC.`,
   guidance: [
    { prompt: 'What is the net charge enclosed by the first surface, in nC?', answer: [s], explanation: `${n(q1)} ${plus(q2).replace(/^([+−])/, '$1 ')} = ${n(s)} nC. The charge outside is not enclosed.` },
    { prompt: `Divide by ε₀: what is the net flux out of the first surface, in N·m²/C to the nearest whole number?`, answer: [Fr], explanation: `${n(s)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)}, which rounds to ${n(Fr)}.` },
    { prompt: `For the second surface, multiply: ε₀ × ${n(P)} N·m²/C. What is the enclosed charge in nC?`, answer: [Q], explanation: `8.85 × 10⁻¹² × ${par(P)} = ${n(Q)} × 10⁻⁹ C, which is ${n(Q)} nC.` }
   ] }; }
 },
 /* Two thin concentric spherical shells: radius R1 m with Q1 nC, radius R2 m with Q2 nC. The radial field
    (outward positive) at ra (between the shells) and at rb (outside both): 8.99 × enclosed ÷ r², to 2 decimal places. */
 q09: {
  canonical: { R1: 1, Q1: 20, R2: 4, Q2: -50, ra: 2, rb: 5 },
  draw: R => pick(() => { const R1 = R.int(1, 2), R2 = R.int(R1 + 2, 6); return { R1, Q1: R.nz(-90, 90), R2, Q2: R.nz(-90, 90), ra: R.int(R1 + 1, R2 - 1), rb: R.int(R2 + 1, R2 + 4) }; },
   p => { const s = p.Q1 + p.Q2, Ea = 8.99 * p.Q1 / (p.ra * p.ra), Eb = 8.99 * s / (p.rb * p.rb); return s !== 0 && Math.abs(Eb) >= 0.05 && !tie(Ea) && !tie(Eb) && !(p.Q1 === 20 && p.Q2 === -50) && !(p.Q1 === 30 && p.Q2 === 10); }, { R1: 1, Q1: 20, R2: 4, Q2: -50, ra: 2, rb: 5 }),
  build: ({ R1, Q1, R2, Q2, ra, rb }) => { const s = Q1 + Q2, Ea = 8.99 * Q1 / (ra * ra), Eb = 8.99 * s / (rb * rb); return {
   prompt: `The Shield Dome has two thin spherical shells with the same centre. The inner shell has radius ${n(R1)} m and carries ${n(Q1)} nC spread evenly over it; the outer shell has radius ${n(R2)} m and carries ${n(Q2)} nC (1 nC = 10⁻⁹ C). Use ${K}, which is 1 ÷ (4πε₀). Enter the radial component of the electric field ${n(ra)} m from the centre, then ${n(rb)} m from the centre, both in N/C rounded to 2 decimal places: positive if the field points outwards, negative if inwards.`,
   answer: [r2(Ea), r2(Eb)],
   hints: ['Use a Gaussian surface: a sphere through the point, with the same centre. By symmetry the field has the same size all over it and points straight out or in, so Gauss’s law gives E × 4πr² = q_enc ÷ ε₀, which is E = kq_enc ÷ r².', 'Only the charge inside the Gaussian sphere counts. A shell larger than the sphere encloses nothing and adds nothing to the field there.'],
   solution: `At ${n(ra)} m the Gaussian sphere encloses only the inner shell, ${n(Q1)} nC, so E = kq_enc ÷ r² = 8.99 × 10⁹ × ${par(Q1)} × 10⁻⁹ ÷ ${n(ra)}² ${eq(Ea)} ${n(Ea)} N/C${rnd(Ea, 'N/C')}. At ${n(rb)} m it encloses both shells, ${n(Q1)} ${plus(Q2).replace(/^([+−])/, '$1 ')} = ${n(s)} nC, so E = 8.99 × ${par(s)} ÷ ${n(rb * rb)} ${eq(Eb)} ${n(Eb)} N/C${rnd(Eb, 'N/C')}. Inside the inner shell a Gaussian sphere would enclose no charge at all, so the field there is 0.`,
   guidance: [
    { prompt: `A Gaussian sphere of radius ${n(ra)} m: how much charge does it enclose, in nC?`, answer: [Q1], explanation: `It lies outside the inner shell (${n(R1)} m) but inside the outer one (${n(R2)} m), so it encloses only ${n(Q1)} nC.` },
    { prompt: `What is the radial field at ${n(ra)} m, kq_enc ÷ r², in N/C to 2 decimal places?`, answer: [r2(Ea)], explanation: `8.99 × ${par(Q1)} ÷ ${n(ra * ra)} ${eq(Ea)} ${n(Ea)} N/C.` },
    { prompt: `A Gaussian sphere of radius ${n(rb)} m encloses both shells. What charge does it enclose, in nC?`, answer: [s], explanation: `${n(Q1)} ${plus(Q2).replace(/^([+−])/, '$1 ')} = ${n(s)} nC.` },
    { prompt: `What is the radial field at ${n(rb)} m, in N/C to 2 decimal places?`, answer: [r2(Eb)], explanation: `8.99 × ${par(s)} ÷ ${n(rb * rb)} ${eq(Eb)} ${n(Eb)} N/C.` }
   ] }; }
 },
 /* A long cable with λ nC/m at r = d/100 m: E = λ ÷ (2πε₀r); a large sheet with σ nC/m²: E = σ ÷ (2ε₀). Both in kN/C
    to 2 decimal places. Draws are off ties, and the cable's answer is the same whether 1 ÷ (2πε₀) or 2k is used. */
 q10: {
  canonical: { lam: 40, d: 20, sig: 120 },
  draw: R => pick(() => ({ lam: 5 * R.int(1, 30), d: 5 * R.int(1, 12), sig: 10 * R.int(1, 40) }), p => {
   const El = p.lam * 100 / (2 * Math.PI * 8.85 * p.d), E2 = 2 * 8.99 * p.lam / (10 * p.d), Es = p.sig / 17.7;
   return El >= 0.1 && El < 99 && !tie(El) && !tie(Es) && Math.abs(r2(El) - r2(E2)) < 1e-9 && !(p.lam === 40 && p.d === 20) && !(p.lam === 30 && p.d === 50) && p.sig !== 50; }, { lam: 40, d: 20, sig: 120 }),
  build: ({ lam, d, sig }) => { const r = d / 100, den = 2 * Math.PI * 8.85e-12 * r, El = lam * 100 / (2 * Math.PI * 8.85 * d), Es = sig / 17.7; return {
   prompt: `A long straight power cable runs past the Shield Dome carrying a fixed charge of λ = ${n(lam)} nC per metre along its length (1 nC = 10⁻⁹ C). Use ${EPS} and treat the cable as infinitely long. Enter the size of its electric field ${n(r)} m from the cable, in kN/C (1 kN/C = 1000 N/C) to 2 decimal places. A large flat dome panel carries σ = ${n(sig)} nC/m² spread evenly over it; treat it as an infinite sheet. Enter the size of its field near the panel, in kN/C to 2 decimal places.`,
   answer: [r2(El), r2(Es)],
   hints: ['For the cable, take a Gaussian cylinder of radius r and length L around it. Flux leaves only through the curved side, area 2πrL, so E × 2πrL = λL ÷ ε₀ and E = λ ÷ (2πε₀r).', 'For the sheet, take a Gaussian box that pokes through it, with faces of area A on both sides. Flux leaves through both faces, so E × 2A = σA ÷ ε₀ and E = σ ÷ (2ε₀), the same at any distance.'],
   solution: `Cable: E = λ ÷ (2πε₀r) = ${n(lam)} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(r)}) ${eq(El * 1000)} ${n(El * 1000)} N/C, which is ${f2(El)} kN/C. (2πε₀r ≈ ${n(den * 1e12)} × 10⁻¹² C²/(N·m).) Sheet: E = σ ÷ (2ε₀) = ${n(sig)} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ${eq(Es * 1000)} ${n(Es * 1000)} N/C, which is ${f2(Es)} kN/C, at any distance close to the panel.`,
   guidance: [
    { prompt: `What is the cable’s field λ ÷ (2πε₀r) at r = ${n(r)} m, in kN/C to 2 decimal places?`, answer: [r2(El)], explanation: `2π × 8.85 × 10⁻¹² × ${n(r)} ≈ ${n(den * 1e12)} × 10⁻¹², and ${n(lam)} × 10⁻⁹ divided by that ${eq(El * 1000)} ${n(El * 1000)} N/C, so ${f2(El)} kN/C.` },
    { prompt: `What is the sheet’s field σ ÷ (2ε₀), in kN/C to 2 decimal places?`, answer: [r2(Es)], explanation: `2ε₀ = 1.77 × 10⁻¹¹, and ${n(sig)} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ${eq(Es * 1000)} ${n(Es * 1000)} N/C, so ${f2(Es)} kN/C.` }
   ] }; }
 }
});
})();
