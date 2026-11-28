/* Electricity and magnetism: fields mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* fits(x, d): x has at most d decimal places (float noise ignored). r2: x rounded to 2 decimal places. */
const fits = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-7; };
const r2 = x => Math.round(x * 100 + 1e-9) / 100, f2 = x => r2(x).toFixed(2);
/* A value that is rounded to 2 places in the answer: far from a rounding tie, and not already a 2-place number
   (so "x, which rounds to y" never prints the same number twice). */
const roundable = x => { const s = x * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.05 && f > 0.05 && f < 0.95; };
/* At most 1000 tries, then the canonical parameters. */
const drawWith = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
/* Kirchhoff network of q27 and q29: junctions A (top) and B (bottom); left branch ε1 with R1, middle branch R2, right branch
   ε2 with R3, both batteries + towards A. Loops: ε1 = (R1 + R2)I1 + R2·I3 and ε2 = R2·I1 + (R2 + R3)I3; I2 = I1 + I3. */
const kirch = (E1, E2, R1, R2, R3) => { const a = R1 + R2, c = R2 + R3, det = a * c - R2 * R2,
 n1 = E1 * c - R2 * E2, n3 = a * E2 - R2 * E1, I1 = n1 / det, I3 = n3 / det; return { a, c, det, n1, n3, I1, I3, I2: I1 + I3 }; };
/* q24: the resistivities of Table 9.1 in OpenStax 9.3, in units of 10⁻⁸ Ω·m. The parameter r is the printed value itself; the name is looked up from it. */
const METAL = { 1.59: 'silver', 1.68: 'copper', 2.44: 'gold', 2.65: 'aluminium', 9.71: 'iron' };
/* q30: a charge written as a multiple of e: +e, −e, +2e, −3e. */
const qtxt = z => Math.abs(z) === 1 ? (z > 0 ? '+e' : '−e') : `${plus(z)}e`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Capacitance C0 (μF) charged to V0 volts; a slab of dielectric constant k fills the gap with the supply disconnected
    (kept = 0: the charge is fixed) or still connected (kept = 1: the voltage is fixed). The energy is an exact decimal
    with at most 2 places and below 1000 mJ. Not the worked example (5 μF, 100 V, κ = 2, connected). */
 q21: {
  canonical: { C0: 8, V0: 50, k: 4, kept: 0 },
  draw: R => drawWith(() => ({ C0: R.int(2, 20), V0: R.pick([10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200]), k: R.pick([2, 2.5, 3, 4, 5, 6, 8]), kept: R.int(0, 1) }),
   p => { const U0 = p.C0 * p.V0 * p.V0 / 2000, U = p.kept ? U0 * p.k : U0 / p.k; return fits(U, 2) && (p.kept || fits(p.V0 / p.k, 2)) && U >= 0.05 && U < 1000 && !same(p, { C0: 5, V0: 100, k: 2, kept: 1 }); },
   { C0: 8, V0: 50, k: 4, kept: 0 }),
  build: ({ C0, V0, k, kept }) => { const C = k * C0, Q0 = C0 * V0, U0 = C0 * V0 * V0 / 2000, Q = kept ? k * Q0 : Q0, V = kept ? V0 : V0 / k, U = kept ? k * U0 : U0 / k, uJ = U * 1000; return {
   prompt: `A capacitor in the Battery Vault has a capacitance of ${n(C0)} μF with only air between its plates, and it is charged from the ${n(V0)} V supply. ${kept ? `The supply stays connected, so it holds the voltage across the plates at ${n(V0)} V` : 'The supply is then disconnected, so no charge can reach or leave the plates'}. Next a slab with dielectric constant κ = ${n(k)} is slid in so that it fills the gap. Treat air as κ = 1. Enter the new capacitance in μF, then the energy now stored in the capacitor in mJ (1 mJ = 1000 μJ). Both are exact decimals.`,
   answer: [C, U],
   hints: ['A slab that fills the gap multiplies the capacitance by its dielectric constant: C = κC₀.', 'Decide what stays fixed. With the supply disconnected the charge Q stays the same, so use U = Q² ÷ (2C); with the supply connected the voltage V stays the same, so use U = ½CV².'],
   solution: kept
    ? `The new capacitance is C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF. The supply holds the voltage at ${n(V0)} V, so the charge grows to Q = CV = ${n(C)} × ${n(V0)} = ${n(Q)} μC. The energy is U = ½CV² = ½ × ${n(C)} × ${n(V0 * V0)} = ${n(uJ)} μJ = ${n(U)} mJ, which is κ = ${n(k)} times the ${n(U0)} mJ stored before: the supply pushed in the extra charge and the energy with it.`
    : `The new capacitance is C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF. The charge cannot change, so it stays Q = C₀V = ${n(C0)} × ${n(V0)} = ${n(Q)} μC, and the voltage falls to Q ÷ C = ${n(V)} V. The energy is U = Q² ÷ (2C) = ${n(Q * Q)} ÷ ${n(2 * C)} = ${n(uJ)} μJ = ${n(U)} mJ, which is the ${n(U0)} mJ stored before divided by κ = ${n(k)}: the field pulled the slab in, and the energy went into that work.`,
   guidance: [
    { prompt: `The slab has κ = ${n(k)} and fills the gap of the ${n(C0)} μF capacitor. What is the new capacitance (μF)?`, answer: [C], explanation: `C = κC₀ = ${n(k)} × ${n(C0)} = ${n(C)} μF.` },
    kept
     ? { prompt: `The supply holds the voltage at ${n(V0)} V, so the charge grows to Q = CV with the new capacitance. What is the charge on the plates now (μC)?`, answer: [Q], explanation: `Q = CV = ${n(C)} × ${n(V0)} = ${n(Q)} μC: microfarads times volts give microcoulombs.` }
     : { prompt: `The supply was disconnected before the slab went in, so the charge keeps the value it had: Q = C₀V. What is the charge on the plates now (μC)?`, answer: [Q], explanation: `Q = C₀V = ${n(C0)} × ${n(V0)} = ${n(Q)} μC, and it cannot change: there is no path for charge to leave.` },
    kept
     ? { prompt: `The voltage is still ${n(V0)} V and the capacitance is ${n(C)} μF. What is the stored energy U = ½CV² (mJ)?`, answer: [U], explanation: `U = ½ × ${n(C)} × ${n(V0 * V0)} = ${n(uJ)} μJ, which is ${n(U)} mJ.` }
     : { prompt: `The charge is ${n(Q)} μC and the capacitance is ${n(C)} μF. What is the stored energy U = Q² ÷ (2C) (mJ)?`, answer: [U], explanation: `U = ${n(Q * Q)} ÷ ${n(2 * C)} = ${n(uJ)} μJ, which is ${n(U)} mJ.` }
   ] }; }
 },
 /* I(t) = a + bt amperes for T seconds: Q = aT + bT²/2 is a whole number (bT² even), so the electron count 6.25Q in
    units of 10¹⁸ has at most 2 decimals. b >= 2 (no coefficient 1 written out), T >= 2. Not the worked example 1 + 4t over 2 s. */
 q22: {
  canonical: { a: 3, b: 2, T: 5 },
  draw: R => drawWith(() => ({ a: R.int(1, 9), b: R.int(2, 6), T: R.int(2, 10) }), p => (p.b * p.T * p.T) % 2 === 0 && !same(p, { a: 1, b: 4, T: 2 }), { a: 3, b: 2, T: 5 }),
  build: ({ a, b, T }) => { const Q1 = a * T, Q2 = b * T * T / 2, Q = Q1 + Q2, N = 6.25 * Q; return {
   prompt: `When the vault’s charger starts, the current in its charging cable ramps up as I(t) = ${n(a)} + ${n(b)}t amperes, t seconds after switch-on. Enter the charge that passes along the cable in the first ${n(T)} s, in coulombs, then the number of electrons that carry it, in units of 10¹⁸ (enter N for N × 10¹⁸ electrons; type it without commas). Each electron carries a charge of size e = 1.60 × 10⁻¹⁹ C.`,
   answer: [Q, N],
   hints: ['Current is charge per second, so the charge is the integral of the current over the time: Q is the integral of I(t) from t = 0 to the end time.', 'Each electron carries 1.60 × 10⁻¹⁹ C, so the number of electrons is Q ÷ (1.60 × 10⁻¹⁹), which is Q × 6.25 × 10¹⁸.'],
   solution: `Q is the integral of ${n(a)} + ${n(b)}t from t = 0 to t = ${n(T)}. An antiderivative is ${a === 1 ? '' : n(a)}t + ${n(b)}t² ÷ 2, so Q = ${n(a)} × ${n(T)} + ${n(b)} × ${n(T * T)} ÷ 2 = ${n(Q1)} + ${n(Q2)} = ${n(Q)} C. The number of electrons is ${n(Q)} ÷ (1.60 × 10⁻¹⁹) = ${n(Q)} × 6.25 × 10¹⁸ = ${n(N)} × 10¹⁸.`,
   guidance: [
    { prompt: `The steady part of the current, ${n(a)} A, flows for the whole ${n(T)} s. How much charge does that part carry (C)?`, answer: [Q1], explanation: `A steady current carries current × time: ${n(a)} × ${n(T)} = ${n(Q1)} C.` },
    { prompt: `The growing part, ${n(b)}t amperes, carries the integral of ${n(b)}t from t = 0 to t = ${n(T)}, which is ${n(b)} × ${n(T)}² ÷ 2. What is that charge (C)?`, answer: [Q2], explanation: `${n(b)} × ${n(T * T)} ÷ 2 = ${n(Q2)} C. On a graph of I against t it is the triangle under the rising line.` },
    { prompt: `The total charge is ${n(Q1)} + ${n(Q2)} = ${n(Q)} C. How many electrons is that, in units of 10¹⁸?`, answer: [N], explanation: `${n(Q)} ÷ (1.60 × 10⁻¹⁹) = ${n(Q)} × 6.25 × 10¹⁸ = ${n(N)} × 10¹⁸ electrons.` }
   ] }; }
 },
 /* Bank: lay 0 is A in series with (B parallel to C); lay 1 is A in parallel with (B in series with C). C is filled with a slab
    of dielectric constant k. Every step and both answers are exact with at most 2 decimals. Not the worked example
    (lay 1, 3, 6, 1 μF, κ = 3, 10 V). */
 q23: {
  canonical: { C1: 6, C2: 4, C3: 2, k: 4, V: 30, lay: 0 },
  draw: R => drawWith(() => ({ C1: R.int(1, 12), C2: R.int(1, 12), C3: R.int(1, 6), k: R.pick([2, 3, 4, 5]), V: R.pick([6, 9, 10, 12, 15, 18, 20, 24, 30, 40, 50]), lay: R.int(0, 1) }),
   p => { const D = p.k * p.C3, inner = p.lay ? p.C2 * D / (p.C2 + D) : p.C2 + D, Ceq = p.lay ? p.C1 + inner : p.C1 * inner / (p.C1 + inner), Q = Ceq * p.V, U = Q * p.V / 2000;
    return fits(inner, 2) && fits(Ceq, 2) && fits(Q, 2) && fits(U, 2) && U >= 0.05 && Q < 100000 && !same(p, { C1: 3, C2: 6, C3: 1, k: 3, V: 10, lay: 1 }); },
   { C1: 6, C2: 4, C3: 2, k: 4, V: 30, lay: 0 }),
  build: ({ C1, C2, C3, k, V, lay }) => { const D = k * C3, inner = lay ? C2 * D / (C2 + D) : C2 + D, Ceq = lay ? C1 + inner : C1 * inner / (C1 + inner), Q = Ceq * V, uJ = Ceq * V * V / 2, U = uJ / 1000; return {
   prompt: `A capacitor bank for the night shift is wired like this: capacitors B (${n(C2)} μF) and C (${n(C3)} μF when empty) are ${lay ? 'in series with each other, and that pair is in parallel with' : 'side by side in parallel, and that pair is in series with'} capacitor A (${n(C1)} μF). Capacitor C is filled with a slab of dielectric constant κ = ${n(k)}. The whole bank is connected across a ${n(V)} V supply. Enter the total charge the supply puts on the bank in μC (type it without commas), then the total energy stored in the bank in mJ. Both are exact decimals.`,
   answer: [Q, U],
   hints: ['First give capacitor C its new value, κ times the empty one. Then reduce the bank one step at a time: capacitors in parallel add, C = C₁ + C₂, and for capacitors in series the reciprocals add, 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂.', 'The supply sees one equivalent capacitor: the total charge is Q = CV and the total energy is U = ½CV², which is also QV ÷ 2.'],
   solution: `With the slab, C has κ × ${n(C3)} = ${n(k)} × ${n(C3)} = ${n(D)} μF. ${lay ? `B and C in series: ${n(C2)} × ${n(D)} ÷ (${n(C2)} + ${n(D)}) = ${n(inner)} μF. In parallel with A: ${n(C1)} + ${n(inner)} = ${n(Ceq)} μF.` : `B and C in parallel: ${n(C2)} + ${n(D)} = ${n(inner)} μF. In series with A: ${n(C1)} × ${n(inner)} ÷ (${n(C1)} + ${n(inner)}) = ${n(Ceq)} μF.`} The total charge is Q = CV = ${n(Ceq)} × ${n(V)} = ${n(Q)} μC, and the energy is U = ½CV² = ½ × ${n(Ceq)} × ${n(V * V)} = ${n(uJ)} μJ = ${n(U)} mJ.`,
   guidance: [
    { prompt: `Capacitor C is ${n(C3)} μF when empty and is filled with a slab of κ = ${n(k)}. What is its capacitance now (μF)?`, answer: [D], explanation: `C = κC₀ = ${n(k)} × ${n(C3)} = ${n(D)} μF.` },
    lay
     ? { prompt: `B (${n(C2)} μF) and C (${n(D)} μF) are in series. What is their equivalent capacitance (μF)?`, answer: [inner], explanation: `For two in series, C = C₁C₂ ÷ (C₁ + C₂) = ${n(C2 * D)} ÷ ${n(C2 + D)} = ${n(inner)} μF.` }
     : { prompt: `B (${n(C2)} μF) and C (${n(D)} μF) are in parallel. What is their equivalent capacitance (μF)?`, answer: [inner], explanation: `In parallel the capacitances add: ${n(C2)} + ${n(D)} = ${n(inner)} μF.` },
    lay
     ? { prompt: `That ${n(inner)} μF pair is in parallel with A (${n(C1)} μF). What is the capacitance of the whole bank (μF)?`, answer: [Ceq], explanation: `In parallel they add: ${n(C1)} + ${n(inner)} = ${n(Ceq)} μF.` }
     : { prompt: `That ${n(inner)} μF pair is in series with A (${n(C1)} μF). What is the capacitance of the whole bank (μF)?`, answer: [Ceq], explanation: `In series, C = C₁C₂ ÷ (C₁ + C₂) = ${n(C1 * inner)} ÷ ${n(C1 + inner)} = ${n(Ceq)} μF.` },
    { prompt: `The bank acts as one ${n(Ceq)} μF capacitor across ${n(V)} V. What total charge does the supply put on it (μC)?`, answer: [Q], explanation: `Q = CV = ${n(Ceq)} × ${n(V)} = ${n(Q)} μC.` }
   ] }; }
 },
 /* Round wire of diameter d mm and length L m, resistivity r × 10⁻⁸ Ω·m from Table 9.1. Area and resistance are rounded to
    2 places, away from ties; resistance from 0.1 to 100 Ω. Not the worked example (aluminium, 100 m, 1 mm). */
 q24: {
  canonical: { r: 1.68, L: 250, d: 2 },
  draw: R => drawWith(() => ({ r: R.pick([1.59, 1.68, 2.44, 2.65, 9.71]), L: 10 * R.int(2, 80), d: R.pick([1, 1.2, 1.5, 1.6, 2, 2.4, 2.5, 3, 4, 5]) }),
   p => { const A = Math.PI * p.d * p.d / 4, Rv = p.r * p.L / (100 * A); return roundable(A) && roundable(Rv) && Rv >= 0.1 && Rv < 100 && !same(p, { r: 2.65, L: 100, d: 1 }); },
   { r: 1.68, L: 250, d: 2 }),
  build: ({ r, L, d }) => { const name = METAL[r], rad = d / 2, A = Math.PI * rad * rad, Rv = r * L / (100 * A); return {
   prompt: `A ${name} cable runs ${n(L)} m from the Cable Works to a dome. Its conductor is one solid round wire ${n(d)} mm across, and ${name} has resistivity ρ = ${n(r)} × 10⁻⁸ Ω·m. Enter the cross-sectional area of the wire in mm², then the resistance of the cable in ohms (Ω), both rounded to 2 decimal places. Work out the resistance from the unrounded area.`,
   answer: [r2(A), r2(Rv)],
   hints: ['The cross-section is a circle whose radius is half the diameter, so A = πr². To change mm² to m², multiply by 10⁻⁶.', 'Resistance grows with length and falls with area: R = ρL ÷ A, with ρ in Ω·m, L in m and A in m².'],
   solution: `The radius is ${n(d)} ÷ 2 = ${n(rad)} mm, so A = π × ${n(rad)}² ≈ ${n(A)} mm², which is ${f2(A)} mm² to 2 decimal places, or ${n(A)} × 10⁻⁶ m². Then R = ρL ÷ A = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${n(A)} × 10⁻⁶) ≈ ${n(Rv)} Ω, which rounds to ${f2((Rv))} Ω.`,
   guidance: [
    { prompt: `The wire is ${n(d)} mm across. What is its radius (mm)?`, answer: [rad], explanation: `The radius is half the diameter: ${n(d)} ÷ 2 = ${n(rad)} mm.` },
    { prompt: `What is the area of the circular cross-section, π × ${n(rad)}², in mm², to 2 decimal places?`, answer: [r2(A)], explanation: `π × ${n(rad * rad)} ≈ ${n(A)} mm², which rounds to ${f2((A))} mm².` },
    { prompt: `With ρ = ${n(r)} × 10⁻⁸ Ω·m, L = ${n(L)} m and A = ${n(A)} × 10⁻⁶ m², what is R = ρL ÷ A in ohms, to 2 decimal places?`, answer: [r2(Rv)], explanation: `R = (${n(r)} × 10⁻⁸ × ${n(L)}) ÷ (${n(A)} × 10⁻⁶) ≈ ${n(Rv)} Ω, which rounds to ${f2((Rv))} Ω.` }
   ] }; }
 },
 /* A heater of R ohms across V = IR volts (a whole number up to 400). Not the worked example (24 V across 8 Ω). */
 q25: {
  canonical: { I: 2.5, R: 48 },
  draw: R => drawWith(() => ({ I: R.pick([0.5, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10]), R: R.int(2, 80) }), p => fits(p.I * p.R, 0) && p.I * p.R <= 400 && !(p.I === 3 && p.R === 8), { I: 2.5, R: 48 }),
  build: ({ I, R }) => { const V = I * R, P = I * V; return {
   prompt: `A heater panel in a dome has a resistance of ${n(R)} Ω and is connected across the dome’s ${n(V)} V supply. Enter the current through the panel in amperes, then the power it turns into heat in watts (type it without commas).`,
   answer: [I, P],
   hints: ['Ohm’s law: the current is the voltage divided by the resistance, I = V ÷ R.', 'Electrical power is current times voltage, P = IV. For a resistor it is also I²R and V² ÷ R.'],
   solution: `By Ohm’s law, I = V ÷ R = ${n(V)} ÷ ${n(R)} = ${n(I)} A. The power is P = IV = ${n(I)} × ${n(V)} = ${n(P)} W. Check: I²R = ${n(I * I)} × ${n(R)} = ${n(P)} W as well.`,
   guidance: [
    { prompt: `The panel has ${n(V)} V across it and a resistance of ${n(R)} Ω. What current flows through it (A)?`, answer: [I], explanation: `I = V ÷ R = ${n(V)} ÷ ${n(R)} = ${n(I)} A.` },
    { prompt: `A current of ${n(I)} A flows with ${n(V)} V across the panel. What power does it turn into heat (W)?`, answer: [P], explanation: `P = IV = ${n(I)} × ${n(V)} = ${n(P)} W: each coulomb gives up ${n(V)} J, and ${n(I)} coulombs pass every second.` }
   ] }; }
 },
 /* R1 in series with (R2 parallel to R3), ideal source of emf E. Pair, total and current exact with at most 2 decimals.
    Not the worked example (2 Ω with 10 Ω ∥ 10 Ω, 14 V). */
 q26: {
  canonical: { R1: 4, R2: 6, R3: 12, E: 24 },
  draw: R => drawWith(() => ({ R1: R.int(1, 30), R2: R.int(2, 60), R3: R.int(2, 60), E: R.pick([6, 9, 12, 18, 24, 36, 48, 60, 120]) }),
   p => { const P = p.R2 * p.R3 / (p.R2 + p.R3), Rq = p.R1 + P, I = p.E / Rq; return fits(P, 2) && fits(I, 2) && I >= 0.1 && !same(p, { R1: 2, R2: 10, R3: 10, E: 14 }); },
   { R1: 4, R2: 6, R3: 12, E: 24 }),
  build: ({ R1, R2, R3, E }) => { const P = R2 * R3 / (R2 + R3), Rq = R1 + P, I = E / Rq; return {
   prompt: `A supply with emf ε = ${n(E)} V feeds a cable run. The current goes through a feed cable of ${n(R1)} Ω, then splits between two heaters of ${n(R2)} Ω and ${n(R3)} Ω connected in parallel, which join again and lead back to the supply. Treat the supply as ideal (no resistance inside it) and the connecting wires as having no resistance. Enter the equivalent resistance of the whole run in ohms, then the current from the supply in amperes. Both are exact decimals.`,
   answer: [Rq, I],
   hints: ['Two resistors in parallel combine by adding reciprocals, 1 ÷ R = 1 ÷ R₁ + 1 ÷ R₂, which for two of them is R₁R₂ ÷ (R₁ + R₂). Resistors in series simply add.', 'The supply sees one equivalent resistor, so the current it gives is I = ε ÷ R.'],
   solution: `The heaters in parallel: ${n(R2)} × ${n(R3)} ÷ (${n(R2)} + ${n(R3)}) = ${n(R2 * R3)} ÷ ${n(R2 + R3)} = ${n(P)} Ω. In series with the feed cable: ${n(R1)} + ${n(P)} = ${n(Rq)} Ω. The current from the supply is I = ε ÷ R = ${n(E)} ÷ ${n(Rq)} = ${n(I)} A.`,
   guidance: [
    { prompt: `The heaters of ${n(R2)} Ω and ${n(R3)} Ω are in parallel. What single resistance can replace the pair (Ω)?`, answer: [P], explanation: `R = R₁R₂ ÷ (R₁ + R₂) = ${n(R2 * R3)} ÷ ${n(R2 + R3)} = ${n(P)} Ω. It is less than either heater: the current has two paths.` },
    { prompt: `The feed cable of ${n(R1)} Ω is in series with that ${n(P)} Ω pair. What is the equivalent resistance of the whole run (Ω)?`, answer: [Rq], explanation: `In series the resistances add: ${n(R1)} + ${n(P)} = ${n(Rq)} Ω.` },
    { prompt: `The ${n(E)} V supply drives current through ${n(Rq)} Ω. What current does it give (A)?`, answer: [I], explanation: `I = ε ÷ R = ${n(E)} ÷ ${n(Rq)} = ${n(I)} A.` }
   ] }; }
 },
 /* Two batteries and three resistors (kirch above). Every current is non-zero and exact with at most 2 decimals; many
    draws have a negative current. Not the worked example (9 V, 3 V, 1 Ω, 2 Ω, 1 Ω). */
 q27: {
  canonical: { E1: 12, E2: 6, R1: 2, R2: 4, R3: 2 },
  draw: R => drawWith(() => ({ E1: R.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), E2: R.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), R1: R.int(1, 10), R2: R.int(1, 10), R3: R.int(1, 10) }),
   p => { const k = kirch(p.E1, p.E2, p.R1, p.R2, p.R3); return [k.I1, k.I2, k.I3].every(x => fits(x, 2) && Math.abs(x) > 0.004) && !same(p, { E1: 9, E2: 3, R1: 1, R2: 2, R3: 1 }); },
   { E1: 12, E2: 6, R1: 2, R2: 4, R3: 2 }),
  build: ({ E1, E2, R1, R2, R3 }) => { const k = kirch(E1, E2, R1, R2, R3), neg = [['I₁', k.I1], ['I₃', k.I3]].filter(x => x[1] < 0).map(x => x[0]); return {
   prompt: `Two junctions in the Cable Works, A at the top and B at the bottom, are joined by three branches. Left branch: a battery of emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with a resistor R₁ = ${n(R1)} Ω. Middle branch: a resistor R₂ = ${n(R2)} Ω alone. Right branch: a battery of emf ε₂ = ${n(E2)} V with its positive terminal towards A, in series with a resistor R₃ = ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. Call I₁ the current up the left branch towards A, I₂ the current down the middle branch from A to B, and I₃ the current up the right branch towards A. Enter I₁, I₂ and I₃ in amperes; a negative value means that current really flows the other way. Each is an exact decimal with at most 2 places.`,
   answer: [k.I1, k.I2, k.I3],
   hints: ['Junction rule at A: the current flowing in equals the current flowing out, so I₂ = I₁ + I₃.', 'Loop rule: around any closed loop the voltage changes add up to zero. Going through a battery from − to + gains its emf; going through a resistor in the direction of its current loses I × R. Write one equation for the left loop and one for the right loop, then solve them together.'],
   solution: `Junction A: I₂ = I₁ + I₃. Left loop (up the left branch, down the middle): ${n(E1)} − ${n(R1)} × I₁ − ${n(R2)} × I₂ = 0. Right loop (up the right branch, down the middle): ${n(E2)} − ${n(R3)} × I₃ − ${n(R2)} × I₂ = 0. Putting in I₂ = I₁ + I₃ gives ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Eliminating I₃: I₁ = (${n(E1)} × ${n(k.c)} − ${n(R2)} × ${n(E2)}) ÷ (${n(k.a)} × ${n(k.c)} − ${n(R2)}²) = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A. In the same way I₃ = (${n(k.a)} × ${n(E2)} − ${n(R2)} × ${n(E1)}) ÷ ${n(k.det)} = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, and I₂ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A.${neg.length ? ` The minus sign on ${neg.join(' and ')} means that current flows down its branch, against the arrow chosen.` : ''}`,
   guidance: [
    { prompt: `Put I₂ = I₁ + I₃ into both loop equations: ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Eliminate I₃: multiply the first equation by ${n(k.c)}, the second by ${n(R2)}, and subtract. What is I₁ (A)?`, answer: [k.I1], explanation: `${n(E1 * k.c)} − ${n(R2 * E2)} = (${n(k.a * k.c)} − ${n(R2 * R2)}) × I₁, so I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A.` },
    { prompt: `Put I₁ = ${n(k.I1)} into ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃. What is I₃ (A)?`, answer: [k.I3], explanation: `${n(R2)} × I₃ = ${n(E1)} − ${n(k.a)} × ${par(k.I1)} = ${n(E1 - k.a * k.I1)}, so I₃ = ${n(k.I3)} A.` },
    { prompt: `Use the junction rule at A. What is I₂ (A)?`, answer: [k.I2], explanation: `I₂ = I₁ + I₃ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A.` }
   ] }; }
 },
 /* Charging through R kΩ into C μF from emf E: τ = RC/1000 s, read at t = m·τ. V is rounded to 2 places, away from ties.
    Not the worked example (9 V, 100 kΩ, 100 μF, t = τ). */
 q28: {
  canonical: { E: 12, R: 20, C: 250, m: 2 },
  draw: R => drawWith(() => ({ E: R.pick([5, 6, 9, 10, 12, 15, 18, 20, 24, 48]), R: R.pick([10, 20, 25, 40, 50, 100, 200]), C: R.pick([100, 200, 250, 400, 500, 1000]), m: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]) }),
   p => { const tau = p.R * p.C / 1000, t = p.m * tau, V = p.E * (1 - Math.exp(-p.m)); return tau <= 100 && fits(t, 2) && roundable(V) && !same(p, { E: 9, R: 100, C: 100, m: 1 }); },
   { E: 12, R: 20, C: 250, m: 2 }),
  build: ({ E, R, C, m }) => { const tau = R * C / 1000, t = m * tau, V = E * (1 - Math.exp(-m)); return {
   prompt: `A capacitor of ${n(C)} μF, empty to begin with, is charged through a resistor of ${n(R)} kΩ from an ideal supply of emf ${n(E)} V. Enter the time constant of the circuit in seconds, then the voltage across the capacitor ${n(t)} s after the switch closes, in volts, rounded to 2 decimal places.`,
   answer: [tau, r2(V)],
   hints: ['The time constant is τ = RC with R in ohms and C in farads. A kilohm is 10³ Ω and a microfarad is 10⁻⁶ F, so kΩ × μF gives 10⁻³ s.', 'While it charges, the capacitor voltage is V = ε(1 − e^(−t/τ)). Here e ≈ 2.718 is the base of natural exponentials, not the charge of an electron.'],
   solution: `τ = RC = ${n(R)} × 10³ Ω × ${n(C)} × 10⁻⁶ F = ${n(tau)} s. At t = ${n(t)} s, t ÷ τ = ${n(m)}, so V = ${n(E)} × (1 − e^(−${n(m)})) ≈ ${n(E)} × ${n(1 - Math.exp(-m))} ≈ ${n(V)} V, which rounds to ${f2((V))} V.`,
   guidance: [
    { prompt: `R = ${n(R)} kΩ and C = ${n(C)} μF. What is the time constant τ = RC (s)?`, answer: [tau], explanation: `${n(R)} × 10³ × ${n(C)} × 10⁻⁶ = ${n(R * C)} × 10⁻³ = ${n(tau)} s.` },
    { prompt: `How many time constants have passed at t = ${n(t)} s? Enter t ÷ τ.`, answer: [m], explanation: `${n(t)} ÷ ${n(tau)} = ${n(m)}.` },
    { prompt: `What is V = ${n(E)} × (1 − e^(−${n(m)})) in volts, to 2 decimal places?`, answer: [r2(V)], explanation: `e^(−${n(m)}) ≈ ${n(Math.exp(-m))}, so V ≈ ${n(E)} × ${n(1 - Math.exp(-m))} ≈ ${n(V)} V, which rounds to ${f2((V))} V.` }
   ] }; }
 },
 /* The q27 network with the middle resistor replaced by two heaters Ra ∥ Rb. w picks the heater whose power is asked
    (0: Ra, 1: Rb). Every printed step is exact with at most 2 decimals; power below 1000 W. */
 q29: {
  canonical: { E1: 18, E2: 9, R1: 3, Ra: 3, Rb: 6, R3: 6, w: 0 },
  draw: R => drawWith(() => ({ E1: R.pick([6, 9, 12, 15, 18, 24, 30, 36]), E2: R.pick([3, 6, 9, 12, 15, 18, 24]), R1: R.int(1, 10), Ra: R.int(2, 12), Rb: R.int(2, 12), R3: R.int(1, 10), w: R.int(0, 1) }),
   p => { if (p.Ra === p.Rb) return false; const R2 = p.Ra * p.Rb / (p.Ra + p.Rb), k = kirch(p.E1, p.E2, p.R1, R2, p.R3), Vm = k.I2 * R2, P = Vm * Vm / (p.w ? p.Rb : p.Ra);
    return fits(R2, 2) && [k.I1, k.I2, k.I3].every(x => fits(x, 2) && Math.abs(x) > 0.004) && fits(Vm, 2) && fits(P, 2) && P < 1000; },
   { E1: 18, E2: 9, R1: 3, Ra: 3, Rb: 6, R3: 6, w: 0 }),
  build: ({ E1, E2, R1, Ra, Rb, R3, w }) => { const R2 = Ra * Rb / (Ra + Rb), k = kirch(E1, E2, R1, R2, R3), Vm = k.I2 * R2, Rx = w ? Rb : Ra, P = Vm * Vm / Rx; return {
   prompt: `A repair crew rewires two charging posts. Junction A at the top and junction B at the bottom are joined by three branches. Left branch: a battery of emf ε₁ = ${n(E1)} V with its positive terminal towards A, in series with R₁ = ${n(R1)} Ω. Middle branch: two heaters of ${n(Ra)} Ω and ${n(Rb)} Ω connected in parallel between A and B. Right branch: a battery of emf ε₂ = ${n(E2)} V with its positive terminal towards A, in series with R₃ = ${n(R3)} Ω. The batteries are ideal and the wires have no resistance. Enter the total current down the middle branch from A to B in amperes, then the power turned into heat in the ${n(Rx)} Ω heater in watts. Both are exact decimals.`,
   answer: [k.I2, P],
   hints: ['Replace the two heaters by one equivalent resistor R₂: for two resistors in parallel it is their product divided by their sum. Then the circuit has three branches between A and B, and Kirchhoff’s junction and loop rules give the currents.', 'Both heaters have the same voltage across them, the middle current times R₂. The power in one heater is that voltage squared divided by its resistance, P = V² ÷ R.'],
   solution: `The heaters in parallel make R₂ = ${n(Ra)} × ${n(Rb)} ÷ ${n(Ra + Rb)} = ${n(R2)} Ω. With I₁ up the left branch, I₂ down the middle and I₃ up the right branch, the junction rule gives I₂ = I₁ + I₃ and the two loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃. Solving: I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A and I₃ = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, so I₂ = ${n(k.I1)} + ${par(k.I3)} = ${n(k.I2)} A. The voltage across the middle branch is ${n(k.I2)} × ${n(R2)} = ${n(Vm)} V, so the ${n(Rx)} Ω heater turns ${n(Vm)}² ÷ ${n(Rx)} = ${n(P)} W into heat.`,
   guidance: [
    { prompt: `The two heaters of ${n(Ra)} Ω and ${n(Rb)} Ω are in parallel. What single resistance R₂ replaces them (Ω)?`, answer: [R2], explanation: `R₂ = ${n(Ra * Rb)} ÷ ${n(Ra + Rb)} = ${n(R2)} Ω.` },
    { prompt: `With R₂ = ${n(R2)} Ω the loops give ${n(E1)} = ${n(k.a)} × I₁ + ${n(R2)} × I₃ and ${n(E2)} = ${n(R2)} × I₁ + ${n(k.c)} × I₃, where I₁ and I₃ flow up the side branches towards A. Solve them and use the junction rule. What is the current down the middle branch (A)?`, answer: [k.I2], explanation: `I₁ = ${n(k.n1)} ÷ ${n(k.det)} = ${n(k.I1)} A and I₃ = ${n(k.n3)} ÷ ${n(k.det)} = ${n(k.I3)} A, so I₂ = I₁ + I₃ = ${n(k.I2)} A.` },
    { prompt: `A current of ${n(k.I2)} A flows through the ${n(R2)} Ω pair. What voltage is across the middle branch (V)?`, answer: [Vm], explanation: `V = IR = ${n(k.I2)} × ${n(R2)} = ${n(Vm)} V, the same across each heater.` },
    { prompt: `The ${n(Rx)} Ω heater has ${n(Vm)} V across it. What power does it turn into heat (W)?`, answer: [P], explanation: `P = V² ÷ R = ${n(Vm * Vm)} ÷ ${n(Rx)} = ${n(P)} W.` }
   ] }; }
 },
 /* Charge z·e at V km/s along +x; field b mT in the x–y plane at th radians from +x towards +y, so v × B points along +z
    and the force along sign(z)·z. |q|vB is exact with at most 2 decimals; F is rounded to 2 places away from ties.
    Not the worked example (+e, 300 km/s, 40 mT, 0.5 rad). */
 q30: {
  canonical: { z: 2, V: 400, b: 50, th: 0.9 },
  draw: R => drawWith(() => ({ z: R.pick([-3, -2, -1, 1, 2, 3]), V: 50 * R.int(2, 18), b: 5 * R.int(2, 20), th: R.int(3, 28) / 10 }),
   p => { const F0 = 1.6 * Math.abs(p.z) * p.V * p.b / 10000, F = F0 * Math.sin(p.th); return fits(F0, 2) && roundable(F) && F >= 0.1 && !same(p, { z: 1, V: 300, b: 40, th: 0.5 }); },
   { z: 2, V: 400, b: 50, th: 0.9 }),
  build: ({ z, V, b, th }) => { const q = 1.6 * Math.abs(z), F0 = q * V * b / 10000, F = F0 * Math.sin(th), dir = z > 0 ? 1 : -1; return {
   prompt: `In the ore sorter a dust ion of charge ${qtxt(z)} (e = 1.60 × 10⁻¹⁹ C) moves at ${n(V)} km/s in the +x direction. The magnetic field there has strength ${n(b)} mT and points in the x–y plane at θ = ${n(th)} rad from the +x direction, turned towards +y. Take x to the right, y up the page and +z out of the page. Enter the size of the magnetic force on the ion in units of 10⁻¹⁵ N, rounded to 2 decimal places, then its direction: 1 if it points along +z, −1 if along −z.`,
   answer: [r2(F), dir],
   hints: ['The size of the force is F = |q|vB sin θ, with q in C, v in m/s and B in T: 1 km/s = 1000 m/s and 1 mT = 0.001 T.', 'Right-hand rule: point the fingers of your right hand along v and curl them towards B; your thumb gives the force on a positive charge. A negative charge feels the force the opposite way.'],
   solution: `|q| = ${n(Math.abs(z))} × 1.60 × 10⁻¹⁹ = ${n(q)} × 10⁻¹⁹ C, v = ${n(V)} × 10³ m/s and B = ${n(b)} × 10⁻³ T, so |q|vB = ${n(q)} × ${n(V)} × ${n(b)} × 10⁻¹⁹ N = ${n(F0)} × 10⁻¹⁵ N. Then F = |q|vB sin θ = ${n(F0)} × sin ${n(th)} ≈ ${n(F0)} × ${n(Math.sin(th))} ≈ ${n(F)} × 10⁻¹⁵ N, which rounds to ${f2((F))}. Fingers along +x curled towards the field (turned from +x towards +y) leave the thumb along +z, the force on a positive charge. ${z > 0 ? 'The ion is positive, so the force points along +z: enter 1.' : 'The ion is negative, so the force is reversed and points along −z: enter −1.'}`,
   guidance: [
    { prompt: `The ion carries ${qtxt(z)}. What is the size of its charge in units of 10⁻¹⁹ C?`, answer: [q], explanation: `${n(Math.abs(z))} × 1.60 = ${n(q)}, so |q| = ${n(q)} × 10⁻¹⁹ C.` },
    { prompt: `Multiply |q| = ${n(q)} × 10⁻¹⁹ C, v = ${n(V)} × 10³ m/s and B = ${n(b)} × 10⁻³ T. What is |q|vB in units of 10⁻¹⁵ N?`, answer: [F0], explanation: `${n(q)} × ${n(V)} × ${n(b)} = ${n(q * V * b)}, times 10⁻¹⁹ N, which is ${n(F0)} × 10⁻¹⁵ N.` },
    { prompt: `The angle between v and B is ${n(th)} rad. What is F = |q|vB sin θ in units of 10⁻¹⁵ N, to 2 decimal places?`, answer: [r2(F)], explanation: `sin ${n(th)} ≈ ${n(Math.sin(th))}, so F ≈ ${n(F0)} × ${n(Math.sin(th))} ≈ ${n(F)}, which rounds to ${f2((F))}.` },
    { prompt: `The right-hand rule gives +z for a positive charge here. Which way is the force on this ion? Enter 1 for +z, −1 for −z.`, answer: [dir], explanation: z > 0 ? 'The ion is positive, so the force is along +z: 1.' : 'The ion is negative, so the force is reversed, along −z: −1.' }
   ] }; }
 },
});
})();
