/* Electricity and magnetism: fields mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
/* 'a' or 'an' before a number as it is read aloud (an 8, an 11, an 18, an 80, an 11000). */
const aan = s => (/^8/.test(s) || /^1[18](\d{3})?$/.test(String(s).split('.')[0])) ? 'an' : 'a';
const G = window.Gen, { n, plus, par } = G;
/* Round to 2 decimal places (answers that the prompt says to round). */
const r2 = x => Math.round(x * 100) / 100;
/* '=' when x is shown exactly by n() (at most 4 decimals), '≈' otherwise. */
const ap = x => Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6 ? '=' : '≈';
/* The result of a rounded answer: '= 2.7 N' when exact to 2 decimals, else '≈ 4.6669 N, which is 4.67 N to 2 decimal places'. */
const res = (x, u) => Math.abs(x - r2(x)) < 1e-9 ? `= ${n(r2(x))} ${u}` : `≈ ${n(x)} ${u}, which is ${r2(x).toFixed(2).replace('-', '−')} ${u} to 2 decimal places`;
/* True when x is safely away from a rounding tie at 2 decimal places (…5 in the third place, or float noise near it). */
const safe = x => { const s = Math.abs(x) * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
const allSafe = list => list.every(safe);
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const TWO_PI = 2 * Math.PI;
/* q31: the two ore particles. m in kg, z = charge in units of e. */
const PARTICLE = {
 proton: { name: 'proton', m: 1.67e-27, ms: '1.67 × 10⁻²⁷ kg', z: 1, qs: 'e = 1.60 × 10⁻¹⁹ C' },
 alpha: { name: 'helium nucleus (an alpha particle)', m: 6.64e-27, ms: '6.64 × 10⁻²⁷ kg', z: 2, qs: '2e = 3.20 × 10⁻¹⁹ C' }
};
const E_CHARGE = 1.6e-19;
/* q32: angles between the current and the field, in radians (never π/2, so the two forces always differ). */
const ANGLE = [['π/6', Math.PI / 6], ['π/4', Math.PI / 4], ['π/3', Math.PI / 3], ['2π/3', 2 * Math.PI / 3], ['3π/4', 3 * Math.PI / 4], ['5π/6', 5 * Math.PI / 6]];
/* q35: the times over which the field changes, in seconds (an index into this list is a parameter). */
const DT = [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2];
/* q38, q39: supply frequencies in hertz. */
const FREQ = [50, 60, 100, 200, 400, 500, 1000];
/* q40: inductances in microhenries. */
const LMU = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* r = mv/(qB) and T = 2πm/(qB) for a proton or an alpha particle; v = k × 10⁵ m/s, B = b/100 T.
    The worked example is an electron, which no draw uses. */
 q31: {
  canonical: { p: 'proton', k: 3, b: 20 },
  draw: R => retry(R, R => ({ p: R.pick(['proton', 'alpha']), k: R.int(1, 9), b: 5 * R.int(1, 10) }), p => {
   const P = PARTICLE[p.p], q = P.z * E_CHARGE, B = p.b / 100, r = P.m * p.k * 1e5 / (q * B) * 1000;
   return allSafe([r, TWO_PI * r, TWO_PI * P.m / (q * B) * 1e9]) && !(p.p === 'proton' && p.k === 3 && p.b === 20); }, { p: 'proton', k: 3, b: 20 }),
  build: ({ p, k, b }) => { const P = PARTICLE[p], q = P.z * E_CHARGE, B = b / 100, rmm = P.m * k * 1e5 / (q * B) * 1000, circ = TWO_PI * rmm,
   Tns = TWO_PI * P.m / (q * B) * 1e9, qv = P.z === 1 ? '1.60 × 10⁻¹⁹' : '3.20 × 10⁻¹⁹'; return {
   prompt: `The ore sorter fires ionised ore fragments into a magnet box. One fragment is a ${P.name}, with mass ${P.ms} and charge ${P.qs}. It enters at ${n(k)} × 10⁵ m/s, at right angles to a uniform magnetic field of ${n(B)} T, and the magnetic force bends its path into a circle. Enter the radius of the circle in millimetres (mm), then the time for one full circle, the cyclotron period, in nanoseconds (ns, 1 ns = 10⁻⁹ s). Give each to 2 decimal places and type numbers without commas.`,
   answer: [r2(rmm), r2(Tns)],
   hints: ['The magnetic force qvB is the centripetal force mv²/r that keeps the particle on its circle. Solve qvB = mv²/r for the radius r.', 'The period is the circumference 2πr divided by the speed v. That gives T = 2πm/(qB): the speed cancels out.'],
   solution: `The velocity is at right angles to the field, so the magnetic force has size qvB, and it supplies the centripetal force: qvB = mv²/r, so r = mv/(qB) = (${P.ms.replace(' kg', '')} × ${n(k)} × 10⁵) ÷ (${qv} × ${n(B)}) m ${res(rmm, 'mm')}. One circle is 2πr ${ap(circ)} ${n(circ)} mm long, and the particle covers it at ${n(k)} × 10⁵ m/s, so the cyclotron period is T = 2πr/v = 2πm/(qB) ${res(Tns, 'ns')}.`,
   guidance: [
    { prompt: `Set the magnetic force qvB equal to the centripetal force mv²/r and solve for r. For the ${P.name} at ${n(k)} × 10⁵ m/s in ${n(B)} T, what is the radius in millimetres, to 2 decimal places?`, answer: [r2(rmm)], explanation: `r = mv/(qB) = (${P.ms.replace(' kg', '')} × ${n(k)} × 10⁵) ÷ (${qv} × ${n(B)}) m ${ap(rmm)} ${n(rmm)} mm.` },
    { prompt: 'One trip round the circle is its circumference, 2πr. Using the unrounded radius, how long is it, in millimetres, to 2 decimal places?', answer: [r2(circ)], explanation: `2π × ${n(rmm)} mm ${ap(circ)} ${n(circ)} mm.` },
    { prompt: `The particle covers that distance at ${n(k)} × 10⁵ m/s. What is the cyclotron period in nanoseconds, to 2 decimal places?`, answer: [r2(Tns)], explanation: `T = 2πr/v ${ap(Tns)} ${n(Tns)} ns. The same comes from T = 2πm/(qB), which has no v in it: a faster particle runs a bigger circle in the same time.` }
   ] }; }
 },
 /* I = V/R, F = ILB sin θ and the force at right angles, ILB. L = l/2 m, B = b/100 T, a = index into ANGLE.
    The worked example (5 A, 2 m, 0.1 T, at right angles) has no supply voltage. */
 q32: {
  canonical: { V: 24, R: 4, l: 3, b: 30, a: 0 },
  draw: R => retry(R, R => { const i = R.int(2, 12), Rr = R.int(2, 10); return { V: i * Rr, R: Rr, l: R.int(1, 6), b: 5 * R.int(1, 12), a: R.int(0, ANGLE.length - 1) }; }, p => {
   const F0 = p.V / p.R * p.l / 2 * p.b / 100; return allSafe([F0, F0 * Math.sin(ANGLE[p.a][1])]) && r2(F0 * Math.sin(ANGLE[p.a][1])) > 0; }, { V: 24, R: 4, l: 3, b: 30, a: 0 }),
  build: ({ V, R, l, b, a }) => { const i = V / R, L = l / 2, B = b / 100, [th, ang] = ANGLE[a], s = Math.sin(ang), F0 = i * L * B, F = F0 * s; return {
   prompt: `A straight copper bar in the ore sorter's lifting magnet is ${n(L)} m long. ${aan(n(V)) === 'an' ? 'An' : 'A'} ${n(V)} V supply drives a current through it, and the bar's circuit has a total resistance of ${n(R)} Ω. The bar lies in a uniform magnetic field of ${n(B)} T, with an angle of ${th} radians between the current and the field. Enter the current in amperes (A), then the size of the magnetic force on the bar in newtons (N), then the size of the force in newtons if the bar were turned to lie at right angles to the field. Give the forces to 2 decimal places.`,
   answer: [i, r2(F), r2(F0)],
   hints: ['Ohm\'s law gives the current: I = V/R.', 'The force on a straight wire in a uniform field has size F = ILB sin θ, where θ is the angle between the current and the field. At right angles sin θ = 1, which gives the largest force.'],
   solution: `Ohm's law: I = V/R = ${n(V)} ÷ ${n(R)} = ${n(i)} A. The force has size F = ILB sin θ = ${n(i)} × ${n(L)} × ${n(B)} × sin(${th}) = ${n(F0)} × sin(${th}) ${res(F, 'N')}. At right angles sin θ = 1, so the force would be ILB = ${n(F0)} N.`,
   guidance: [
    { prompt: `The supply is ${n(V)} V and the resistance ${n(R)} Ω. What current flows, in amperes?`, answer: [i], explanation: `I = V/R = ${n(V)} ÷ ${n(R)} = ${n(i)} A.` },
    { prompt: `Use F = ILB sin θ with θ = ${th}. What is the size of the force on the bar, in newtons, to 2 decimal places?`, answer: [r2(F)], explanation: `sin(${th}) ${ap(s)} ${n(s)}, so F = ${n(i)} × ${n(L)} × ${n(B)} × sin(${th}) ${ap(F)} ${n(F)} N.` },
    { prompt: 'Now the bar lies at right angles to the field, so θ = π/2. What is the force, in newtons, to 2 decimal places?', answer: [r2(F0)], explanation: `sin(π/2) = 1, so F = ILB = ${n(i)} × ${n(L)} × ${n(B)} = ${n(F0)} N, the largest force this bar can feel in this field.` }
   ] }; }
 },
 /* B = μ₀I₁/(2πd) = 20 I₁/d μT with d in cm; force per metre I₂B in μN/m; 1 for attraction (same direction), −1 for repulsion.
    The worked example (10 A at 2 cm, then a 5 A wire) uses a 2 cm gap and a 5 A second current together, which no draw has with I₁ = 10. */
 q33: {
  canonical: { i1: 30, i2: 20, d: 8, same: false },
  draw: R => retry(R, R => ({ i1: 5 * R.int(1, 12), i2: 5 * R.int(1, 10), d: R.int(2, 20), same: R.bool() }), p => {
   const B = 20 * p.i1 / p.d; return allSafe([B, p.i2 * B]) && !(p.i1 === 10 && p.i2 === 5 && p.d === 2); }, { i1: 30, i2: 20, d: 8, same: false }),
  build: ({ i1, i2, d, same }) => { const B = 20 * i1 / d, F = i2 * B, dm = d / 100, dir = same ? 1 : -1; return {
   prompt: `Two long, straight cables feed the ore sorter's coils. They run parallel, ${n(d)} cm apart. The first carries ${n(i1)} A and the second ${n(i2)} A, ${same ? 'in the same direction' : 'in opposite directions'}. Take μ₀ = 4π × 10⁻⁷ T·m/A. Enter the size of the magnetic field the first cable makes at the second, in microtesla (μT, 1 μT = 10⁻⁶ T); then the size of the force on each metre of the second cable, in micronewtons per metre (μN/m, 1 μN = 10⁻⁶ N); then 1 if the cables pull towards each other or −1 if they push apart. Round the field and the force to 2 decimal places and type numbers without commas.`,
   answer: [r2(B), r2(F), dir],
   hints: ['A long straight wire carrying a current I makes a field of size B = μ₀I/(2πr) at a distance r from it. With μ₀ = 4π × 10⁻⁷ T·m/A, μ₀/(2π) = 2 × 10⁻⁷ T·m/A.', 'The second cable\'s current is at right angles to that field, so a length L of it feels F = I₂LB, and the force per metre is F/L = I₂B. Parallel currents in the same direction attract; in opposite directions they repel.'],
   solution: `The gap is ${n(d)} cm = ${n(dm)} m. The first cable's field there is B = μ₀I₁/(2πr) = 2 × 10⁻⁷ × ${n(i1)} ÷ ${n(dm)} T ${res(B, 'μT')}. Each metre of the second cable feels F/L = I₂B = ${n(i2)} × ${n(B)} μN/m ${res(F, 'μN/m')}. The currents run ${same ? 'the same way, so the cables attract: 1' : 'opposite ways, so the cables repel: −1'}.`,
   guidance: [
    { prompt: `Use B = μ₀I/(2πr) with I = ${n(i1)} A and r = ${n(dm)} m. What is the field at the second cable, in μT, to 2 decimal places?`, answer: [r2(B)], explanation: `B = 2 × 10⁻⁷ × ${n(i1)} ÷ ${n(dm)} T ${ap(B)} ${n(B)} × 10⁻⁶ T, that is ${n(B)} μT.` },
    { prompt: `The second cable carries ${n(i2)} A at right angles to that field. What force acts on each metre of it, in μN/m, to 2 decimal places?`, answer: [r2(F)], explanation: `F/L = I₂B = ${n(i2)} × ${n(B)} μN/m ${ap(F)} ${n(F)} μN/m.` },
    { prompt: 'The currents run ' + (same ? 'the same way' : 'opposite ways') + '. Enter 1 if the cables attract or −1 if they repel.', answer: [dir], explanation: same ? 'Currents in the same direction attract, so the answer is 1.' : 'Currents in opposite directions repel, so the answer is −1.' }
   ] }; }
 },
 /* Solenoid: N turns (printed) along c cm from the list, so n = N ÷ (c/100) turns per metre (a multiple of 100); current I A (a multiple of 0.5).
    B = μ₀nI in mT; the Ampère loop has a 10 cm side inside, enclosing n/10 turns. The worked example has n = 1000 and 1 A. */
 q34: {
  canonical: { N: 600, c: 30, I: 2.5 },
  draw: R => retry(R, R => { const c = R.pick([20, 25, 30, 40, 50]); return { N: R.int(5, 50) * c, c, I: R.int(1, 20) / 2 }; }, p => {
   const nn = p.N * 100 / p.c, B = 4 * Math.PI * 1e-4 * nn * p.I; return safe(B) && r2(B) >= 0.1 && !(nn === 1000 && p.I === 1); }, { N: 600, c: 30, I: 2.5 }),
  build: ({ N, c, I }) => { const nn = Math.round(N * 100 / c), B = 4 * Math.PI * 1e-4 * nn * I, inside = nn / 10, enc = inside * I; return {
   prompt: `The ore sorter's coil gate is a long solenoid: one wire wound into a tight coil of ${n(N)} turns spread evenly along ${n(c)} cm. It carries a current of ${n(I)} A. Take μ₀ = 4π × 10⁻⁷ T·m/A. Enter the number of turns per metre, n, then the size of the magnetic field inside the solenoid in millitesla (mT, 1 mT = 10⁻³ T), to 2 decimal places. Type numbers without commas.`,
   answer: [nn, r2(B)],
   hints: ['The number of turns per metre is the number of turns divided by the length in metres.', 'Ampère\'s law round a rectangle with one side of length l inside the coil, along its axis, gives Bl = μ₀ × (the current through the rectangle) = μ₀ × nl × I, so B = μ₀nI.'],
   solution: `The coil is ${n(c)} cm = ${n(c / 100)} m long, so n = ${n(N)} ÷ ${n(c / 100)} = ${n(nn)} turns per metre. Take a rectangle with a 0.1 m side inside the coil along its axis and the opposite side outside, where the field is close to zero. Only the inside side adds to the line integral, which is B × 0.1 m. That side has ${n(inside)} turns beside it, each carrying ${n(I)} A through the rectangle, so ${n(enc)} A passes through. Ampère's law gives B × 0.1 = μ₀ × ${n(enc)}, so B = μ₀nI = 4π × 10⁻⁷ × ${n(nn)} × ${n(I)} T ${res(B, 'mT')}.`,
   guidance: [
    { prompt: `${n(N)} turns are spread along ${n(c)} cm. How many turns are there per metre?`, answer: [nn], explanation: `${n(c)} cm = ${n(c / 100)} m, and ${n(N)} ÷ ${n(c / 100)} = ${n(nn)} turns per metre.` },
    { prompt: `Draw a rectangle with one 0.1 m side inside the coil along its axis and the opposite side outside. How much current passes through the rectangle, in amperes?`, answer: [enc], explanation: `The inside side has ${n(nn)} × 0.1 = ${n(inside)} turns beside it. Each carries ${n(I)} A through the rectangle, so ${n(inside)} × ${n(I)} = ${n(enc)} A passes through.` },
    { prompt: `Only the inside side adds to the line integral, so ∮B·dl = B × 0.1 m. Ampère's law sets this equal to μ₀ × ${n(enc)} A. What is B, in mT, to 2 decimal places?`, answer: [r2(B)], explanation: `B = 4π × 10⁻⁷ × ${n(enc)} ÷ 0.1 T ${ap(B)} ${n(B)} × 10⁻³ T, that is ${n(B)} mT. It is the same as μ₀nI.` }
   ] }; }
 },
 /* Faraday's law for a flat coil of N turns, area a/100 m², field up through it changing from b1 to b2 mT over dt s (printed), resistance R. b1 never equals b2.
    ΔΦ per turn in mWb; emf in mV; current in mA; 1 (clockwise seen from above) when the upward field grows, −1 when it shrinks.
    The worked example (10 turns, 0.1 m², 0 to 50 mT in 0.5 s) has 10 turns, which no draw has. */
 q35: {
  canonical: { N: 50, a: 4, b1: 20, b2: 80, dt: 0.4, R: 6 },
  draw: R => retry(R, R => ({ N: 10 * R.int(2, 20), a: R.int(2, 20), b1: 10 * R.int(0, 20), b2: 10 * R.int(0, 20), dt: R.pick(DT), R: R.int(2, 20) }), p => {
   if (p.b1 === p.b2) return false; const emf = p.N * p.a / 100 * Math.abs(p.b2 - p.b1) / p.dt; return emf >= 10 && emf < 90000 && allSafe([emf, emf / p.R]); },
   { N: 50, a: 4, b1: 20, b2: 80, dt: 0.4, R: 6 }),
  build: ({ N, a, b1, b2, dt, R }) => { const A = a / 100, dB = Math.abs(b2 - b1), dPhi = A * dB, emf = N * dPhi / dt, I = emf / R, up = b2 > b1, dir = up ? 1 : -1; return {
   prompt: `A flat pick-up coil lies on the test bench in the Generator Station. It has ${n(N)} turns, each enclosing ${n(A)} m². A magnetic field points straight up through it, at right angles to the coil, and over ${n(dt)} s its strength changes steadily from ${n(b1)} mT to ${n(b2)} mT. The coil's ends are joined, and its total resistance is ${n(R)} Ω. Enter the size of the induced emf in millivolts (mV), then the size of the current in milliamperes (mA), each to 2 decimal places. Then enter the direction of the current seen from above: 1 for clockwise, −1 for anticlockwise. Type numbers without commas.`,
   answer: [r2(emf), r2(I), dir],
   hints: ['The magnetic flux through one turn is Φ = BA when the field is at right angles to the coil. Faraday\'s law: the size of the emf is N times the change in flux through one turn, divided by the time the change takes.', 'Lenz\'s law: the induced current makes a field of its own that opposes the change in flux. Curl the fingers of your right hand along the current: your thumb shows the direction of its field inside the loop.'],
   solution: `The flux through one turn changes by ΔΦ = A × ΔB = ${n(A)} × ${n(dB)} mT = ${n(dPhi)} mWb (1 Wb = 1 T·m²). Faraday's law gives an emf of size N × ΔΦ/Δt = ${n(N)} × ${n(dPhi)} ÷ ${n(dt)} ${res(emf, 'mV')}. Ohm's law gives the current: ${n(emf)} ÷ ${n(R)} ${res(I, 'mA')}. The upward flux is ${up ? 'growing, so by Lenz\'s law the current makes a downward field inside the coil. With your right thumb pointing down, your fingers curl clockwise seen from above: 1' : 'shrinking, so by Lenz\'s law the current makes an upward field inside the coil to make up for it. With your right thumb pointing up, your fingers curl anticlockwise seen from above: −1'}.`,
   guidance: [
    { prompt: `The field changes from ${n(b1)} mT to ${n(b2)} mT through ${n(A)} m². By how much does the flux through one turn change, in milliwebers (mWb)? Enter the size.`, answer: [dPhi], explanation: `ΔΦ = A × ΔB = ${n(A)} × ${n(dB)} mT = ${n(dPhi)} mWb.` },
    { prompt: `Faraday's law: emf = N × ΔΦ/Δt for ${n(N)} turns over ${n(dt)} s. What is the size of the emf, in mV, to 2 decimal places?`, answer: [r2(emf)], explanation: `${n(N)} × ${n(dPhi)} ÷ ${n(dt)} ${ap(emf)} ${n(emf)} mV.` },
    { prompt: `The coil's resistance is ${n(R)} Ω. What current flows, in mA, to 2 decimal places?`, answer: [r2(I)], explanation: `I = emf/R ${ap(emf)} ${n(emf)} ÷ ${n(R)} ${ap(I)} ${n(I)} mA.` },
    { prompt: `The upward flux is ${up ? 'growing' : 'shrinking'}. Which way does the current run, seen from above? Enter 1 for clockwise, −1 for anticlockwise.`, answer: [dir], explanation: up ? 'The current must make a downward field to oppose the growth. A downward thumb means fingers curling clockwise seen from above.' : 'The current must make an upward field to oppose the loss. An upward thumb means fingers curling anticlockwise seen from above.' }
   ] }; }
 },
 /* Motional emf Blv (rod l/10 m, v m/s, field br/100 T) and generator peak NBAω (N turns, a/100 m², bg/100 T, ω rad/s).
    The worked example (0.5 m at 10 m/s in 0.2 T; 100 turns of 0.02 m² in 0.5 T at 50 rad/s) is not drawn. */
 q36: {
  canonical: { l: 12, v: 5, br: 40, N: 200, a: 5, bg: 30, w: 40 },
  draw: R => retry(R, R => ({ l: R.int(2, 20), v: R.int(2, 25), br: 5 * R.int(1, 16), N: 10 * R.int(2, 50), a: R.int(1, 20), bg: 5 * R.int(2, 12), w: 5 * R.int(2, 24) }), p => {
   const e1 = p.br / 100 * p.l / 10 * p.v, e2 = p.N * p.bg / 100 * p.a / 100 * p.w; return allSafe([e1, e2]) && r2(e1) >= 0.1 && e2 < 90000 && !(p.l === 5 && p.v === 10 && p.br === 20); },
   { l: 12, v: 5, br: 40, N: 200, a: 5, bg: 30, w: 40 }),
  build: ({ l, v, br, N, a, bg, w }) => { const L = l / 10, Br = br / 100, A = a / 100, Bg = bg / 100, sweep = L * v, e1 = Br * sweep, e2 = N * Bg * A * w; return {
   prompt: `Two checks on the wind generator. First, a test rod ${n(L)} m long lies across two metal rails, at right angles to them, and slides along them at a steady ${n(v)} m/s. A uniform magnetic field of ${n(Br)} T is at right angles to the rod, the rails and its motion. Second, the generator's coil has ${n(N)} turns, each of area ${n(A)} m², and spins at ${n(w)} rad/s in a uniform field of ${n(Bg)} T, about an axis at right angles to the field. Enter the motional emf across the rod in volts (V), then the peak emf of the generator in volts, each to 2 decimal places. Type numbers without commas.`,
   answer: [r2(e1), r2(e2)],
   hints: ['Each second the rod sweeps out an area of l × v, so the flux of the circuit it closes changes at the rate Blv. By Faraday\'s law that rate is the emf.', 'A coil of N turns of area A spinning at angular speed ω in a field B has flux BA cos ωt through each turn, timing t from a moment when the field points straight through the coil. Its rate of change gives the emf NBAω sin ωt, whose peak is NBAω.'],
   solution: `The rod sweeps out ${n(L)} × ${n(v)} = ${n(sweep)} m² each second, so the flux changes at the rate Blv = ${n(Br)} × ${n(sweep)} ${res(e1, 'V')}. The generator's emf is NBAω sin ωt, so its peak is NBAω = ${n(N)} × ${n(Bg)} × ${n(A)} × ${n(w)} ${res(e2, 'V')}.`,
   guidance: [
    { prompt: `The rod is ${n(L)} m long and moves at ${n(v)} m/s. What area does it sweep out each second, in square metres?`, answer: [sweep], explanation: `${n(L)} × ${n(v)} = ${n(sweep)} m² each second.` },
    { prompt: `The flux changes by B times that area each second. What is the motional emf, in volts, to 2 decimal places?`, answer: [r2(e1)], explanation: `ε = Blv = ${n(Br)} × ${n(sweep)} ${ap(e1)} ${n(e1)} V.` },
    { prompt: `The coil's emf is NBAω sin ωt. What is its peak, in volts, to 2 decimal places?`, answer: [r2(e2)], explanation: `sin ωt is at most 1, so the peak is NBAω = ${n(N)} × ${n(Bg)} × ${n(A)} × ${n(w)} ${ap(e2)} ${n(e2)} V.` }
   ] }; }
 },
 /* RL circuit: L in mH, R in Ω, settled current i/2 A (emf = iR/2 V), time t in ms. τ = L/R ms (whole or 2 decimals), energy ½LI² mJ,
    I(t) = (ε/R)(1 − e^(−t/τ)). The worked example (100 mH, 10 Ω, 12 V) is not drawn. */
 q37: {
  canonical: { L: 200, R: 8, i: 6, t: 20 },
  draw: R => retry(R, R => { const p = { L: 10 * R.int(2, 50), R: R.int(2, 20), i: R.int(1, 12) }; p.t = R.int(1, Math.max(2, Math.ceil(3 * p.L / p.R))); return p; }, p => {
   const tau = p.L / p.R, I = p.i / 2, U = p.L * I * I / 2, It = I * (1 - Math.exp(-p.t / tau));
   return (p.L * 100) % p.R === 0 && p.t !== tau && allSafe([U, It, I]) && r2(It) > 0 && !(p.L === 100 && p.R === 10); }, { L: 200, R: 8, i: 6, t: 20 }),
  build: ({ L, R, i, t }) => { const tau = L / R, I = i / 2, eps = I * R, U = L * I * I / 2, x = t / tau, It = I * (1 - Math.exp(-x)); return {
   prompt: `The wind generator's field coil is an inductor with inductance ${n(L)} mH (1 mH = 10⁻³ H) and resistance ${n(R)} Ω. At t = 0 it is switched onto a steady ${n(eps)} V supply. Enter the time constant τ = L/R in milliseconds (ms); then the energy stored in the coil once the current has settled, in millijoules (mJ); then the current ${n(t)} ms after the switch closes, in amperes (A). Give the energy and the current to 2 decimal places and type numbers without commas.`,
   answer: [r2(tau), r2(U), r2(It)],
   hints: ['τ = L/R comes out in seconds with L in henries and R in ohms, so with L in millihenries it comes out in milliseconds.', 'The settled current is ε/R, and an inductor carrying a current I stores energy ½LI². While the current grows, I(t) = (ε/R)(1 − e^(−t/τ)).'],
   solution: `τ = L/R = ${n(L)} mH ÷ ${n(R)} Ω = ${n(tau)} ms. Once the current settles, the coil's emf is zero and the current is ε/R = ${n(eps)} ÷ ${n(R)} = ${n(I)} A. The stored energy is ½LI² = ½ × ${n(L)} × 10⁻³ × ${n(I)}² J ${res(U, 'mJ')}. At t = ${n(t)} ms, t/τ ${ap(x)} ${n(x)}, so I = ${n(I)} × (1 − e^(−${n(x)})) ${res(It, 'A')}.`,
   guidance: [
    { prompt: `What is the time constant τ = L/R, in milliseconds?`, answer: [r2(tau)], explanation: `${n(L)} mH ÷ ${n(R)} Ω = ${n(tau)} ms.` },
    { prompt: `Once the current has settled, the coil's emf is zero. What is the current then, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `Only the resistance limits it: ε/R = ${n(eps)} ÷ ${n(R)} = ${n(I)} A.` },
    { prompt: `What energy does the coil store at that current, in millijoules, to 2 decimal places?`, answer: [r2(U)], explanation: `½LI² = ½ × ${n(L)} × 10⁻³ H × (${n(I)} A)² ${ap(U)} ${n(U)} × 10⁻³ J, that is ${n(U)} mJ.` },
    { prompt: `Use I(t) = (ε/R)(1 − e^(−t/τ)) at t = ${n(t)} ms. What is the current, in amperes, to 2 decimal places?`, answer: [r2(It)], explanation: `t/τ ${ap(x)} ${n(x)}, and ${n(I)} × (1 − e^(−${n(x)})) ${ap(It)} ${n(It)} A.` }
   ] }; }
 },
 /* An ac supply of peak V0 at f Hz (printed, one of FREQ) across an inductor (val mH) or a capacitor (val μF) alone.
    V_rms = V0/√2, X = ωL or 1/(ωC), I_rms = V_rms/X. The worked example (20 V, 50 Hz, 100 μF) is not drawn. */
 q38: {
  canonical: { V0: 170, f: 60, ind: true, val: 150 },
  draw: R => retry(R, R => { const ind = R.bool(); return { V0: 5 * R.int(2, 68), f: R.pick(FREQ), ind, val: ind ? 10 * R.int(1, 50) : R.int(1, 100) }; }, p => {
   const w = TWO_PI * p.f, X = p.ind ? w * p.val / 1000 : 1 / (w * p.val * 1e-6), Vr = p.V0 / Math.SQRT2, I = Vr / X;
   return X < 90000 && I >= 0.05 && I < 1000 && allSafe([w, Vr, X, I]) && !(p.V0 === 20 && !p.ind && p.val === 100); }, { V0: 170, f: 60, ind: true, val: 150 }),
  build: ({ V0, f, ind, val }) => { const fr = f, w = TWO_PI * fr, X = ind ? w * val / 1000 : 1 / (w * val * 1e-6), Vr = V0 / Math.SQRT2, I = Vr / X,
   part = ind ? 'inductor' : 'capacitor'; return {
   prompt: `A ${n(fr)} Hz alternating supply in the Generator Station has a peak voltage of ${n(V0)} V. It is connected across ${ind ? `an inductor of ${n(val)} mH (1 mH = 10⁻³ H)` : `a capacitor of ${n(val)} μF (1 μF = 10⁻⁶ F)`} and nothing else; take the resistance of the wires as zero. Enter the rms voltage in volts (V), the reactance of the ${part} in ohms (Ω), then the rms current in amperes (A), each to 2 decimal places. Type numbers without commas.`,
   answer: [r2(Vr), r2(X), r2(I)],
   hints: ['The rms value of a sine-wave voltage is its peak divided by √2.', 'With ω = 2πf, an inductor\'s reactance is X_L = ωL and a capacitor\'s is X_C = 1/(ωC). The rms current is the rms voltage divided by the reactance, as in Ohm\'s law.'],
   solution: `V_rms = ${n(V0)} ÷ √2 ${res(Vr, 'V')}. The angular frequency is ω = 2π × ${n(fr)} ${ap(w)} ${n(w)} rad/s, so the ${part}'s reactance is ${ind ? `X_L = ωL ${ap(w)} ${n(w)} × ${n(val / 1000)}` : `X_C = 1/(ωC) ≈ 1 ÷ (${n(w)} × ${n(val)} × 10⁻⁶)`} ${res(X, 'Ω')}. The rms current is V_rms/X ${ap(Vr)} ${n(Vr)} ÷ ${n(X)} ${res(I, 'A')}.`,
   guidance: [
    { prompt: `What is the angular frequency ω = 2πf of ${aan(n(fr))} ${n(fr)} Hz supply, in radians per second, to 2 decimal places?`, answer: [r2(w)], explanation: `2π × ${n(fr)} ${ap(w)} ${n(w)} rad/s.` },
    { prompt: `The peak voltage is ${n(V0)} V. What is the rms voltage, in volts, to 2 decimal places?`, answer: [r2(Vr)], explanation: `${n(V0)} ÷ √2 ${ap(Vr)} ${n(Vr)} V.` },
    { prompt: `What is the ${part}'s reactance, in ohms, to 2 decimal places?`, answer: [r2(X)], explanation: ind ? `X_L = ωL ${ap(w)} ${n(w)} × ${n(val / 1000)} H ${ap(X)} ${n(X)} Ω.` : `X_C = 1/(ωC) ≈ 1 ÷ (${n(w)} × ${n(val)} × 10⁻⁶ F) ${ap(X)} ${n(X)} Ω.` },
    { prompt: `What is the rms current, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `I_rms = V_rms/X ${ap(Vr)} ${n(Vr)} ÷ ${n(X)} ${ap(I)} ${n(I)} A.` }
   ] }; }
 },
 /* Series RLC: R Ω, L mH, C μF, f Hz (printed, one of FREQ), peak V0. X_L = ωL, X_C = 1/(ωC), Z = √(R² + (X_L − X_C)²), I0 = V0/Z, f0 = 1/(2π√(LC)).
    The supply frequency stays more than 15% away from f0. The worked example (30 Ω, 50 mH, 50 μF) is not drawn. */
 q39: {
  canonical: { R: 40, L: 100, C: 20, f: 60, V0: 50 },
  draw: R => retry(R, R => ({ R: 5 * R.int(2, 20), L: 10 * R.int(1, 20), C: R.int(1, 50), f: R.pick(FREQ), V0: 5 * R.int(2, 20) }), p => {
   const fr = p.f, w = TWO_PI * fr, XL = w * p.L / 1000, XC = 1 / (w * p.C * 1e-6), Z = Math.hypot(p.R, XL - XC), I0 = p.V0 / Z, f0 = 1 / (TWO_PI * Math.sqrt(p.L * 1e-3 * p.C * 1e-6));
   return Math.abs(fr - f0) / f0 > 0.15 && Z < 90000 && I0 >= 0.05 && allSafe([XL, XC, Z, I0, f0]) && !(p.R === 30 && p.L === 50 && p.C === 50); }, { R: 40, L: 100, C: 20, f: 60, V0: 50 }),
  build: ({ R, L, C, f, V0 }) => { const fr = f, w = TWO_PI * fr, XL = w * L / 1000, XC = 1 / (w * C * 1e-6), d = XL - XC, Z = Math.hypot(R, d), I0 = V0 / Z,
   f0 = 1 / (TWO_PI * Math.sqrt(L * 1e-3 * C * 1e-6)); return {
   prompt: `The comms mast's tuning circuit has a resistor of ${n(R)} Ω, an inductor of ${n(L)} mH (1 mH = 10⁻³ H) and a capacitor of ${n(C)} μF (1 μF = 10⁻⁶ F) in series. A ${n(fr)} Hz supply with a peak voltage of ${n(V0)} V drives it. Enter the impedance of the circuit in ohms (Ω), then the peak current in amperes (A), then the circuit's resonant frequency in hertz (Hz), each to 2 decimal places. Type numbers without commas.`,
   answer: [r2(Z), r2(I0), r2(f0)],
   hints: ['Work out X_L = ωL and X_C = 1/(ωC) with ω = 2πf. The impedance of the series circuit is Z = √(R² + (X_L − X_C)²), and the peak current is V₀/Z.', 'At resonance X_L = X_C, which happens at the angular frequency ω₀ = 1/√(LC). The resonant frequency is f₀ = ω₀/(2π) = 1/(2π√(LC)).'],
   solution: `ω = 2π × ${n(fr)} ${ap(w)} ${n(w)} rad/s. X_L = ωL ${ap(w)} ${n(w)} × ${n(L / 1000)} ${ap(XL)} ${n(XL)} Ω and X_C = 1/(ωC) ≈ 1 ÷ (${n(w)} × ${n(C)} × 10⁻⁶) ${ap(XC)} ${n(XC)} Ω. Z = √(${n(R)}² + (${n(XL)} − ${n(XC)})²) ${res(Z, 'Ω')}. The peak current is V₀/Z ≈ ${n(V0)} ÷ ${n(Z)} ${res(I0, 'A')}. The resonant frequency is f₀ = 1/(2π√(LC)) = 1 ÷ (2π√(${n(L / 1000)} × ${n(C)} × 10⁻⁶)) ${res(f0, 'Hz')}.`,
   guidance: [
    { prompt: `With ω = 2π × ${n(fr)} rad/s, what is the inductor's reactance X_L = ωL, in ohms, to 2 decimal places?`, answer: [r2(XL)], explanation: `X_L ${ap(w)} ${n(w)} × ${n(L / 1000)} H ${ap(XL)} ${n(XL)} Ω.` },
    { prompt: 'What is the capacitor\'s reactance X_C = 1/(ωC), in ohms, to 2 decimal places?', answer: [r2(XC)], explanation: `X_C ≈ 1 ÷ (${n(w)} × ${n(C)} × 10⁻⁶ F) ${ap(XC)} ${n(XC)} Ω.` },
    { prompt: 'Using the unrounded reactances, what is the impedance Z = √(R² + (X_L − X_C)²), in ohms, to 2 decimal places?', answer: [r2(Z)], explanation: `X_L − X_C ${ap(d)} ${n(d)} Ω, so Z ≈ √(${n(R * R)} + ${n(d * d)}) ${ap(Z)} ${n(Z)} Ω.` },
    { prompt: 'What is the resonant frequency f₀ = 1/(2π√(LC)), in hertz, to 2 decimal places?', answer: [r2(f0)], explanation: `√(LC) = √(${n(L / 1000)} × ${n(C)} × 10⁻⁶) s, and 1 ÷ (2π√(LC)) ${ap(f0)} ${n(f0)} Hz. ${fr < f0 ? 'The supply runs below it, so X_C is larger than X_L.' : 'The supply runs above it, so X_L is larger than X_C.'}` }
   ] }; }
 },
 /* The mast's resonant circuit: L μH (printed, one of LMU), C = c pF, field amplitude e/10 V/m. f in MHz, λ = c/f in m, B = E/c in nT.
    The worked example (100 MHz, 6 V/m) is given as a frequency, not a circuit. */
 q40: {
  canonical: { L: 2, c: 50, e: 12 },
  draw: R => retry(R, R => ({ L: R.pick(LMU), c: 5 * R.int(1, 20), e: R.int(5, 300) }), p => {
   const s = Math.sqrt(p.L * 1e-6 * p.c * 1e-12), f = 1 / (TWO_PI * s) / 1e6, lam = 3e8 * TWO_PI * s; return allSafe([f, lam, p.e / 3]); }, { L: 2, c: 50, e: 12 }),
  build: ({ L, c, e }) => { const E = e / 10, s = Math.sqrt(L * 1e-6 * c * 1e-12), fM = 1 / (TWO_PI * s) / 1e6, lam = 3e8 / (fM * 1e6), B = E / 3e8 * 1e9; return {
   prompt: `The comms mast sends its signal home as an electromagnetic wave. The transmitter is tuned to the resonant frequency of an inductor of ${n(L)} μH (1 μH = 10⁻⁶ H) in series with a capacitor of ${n(c)} pF (1 pF = 10⁻¹² F), and the wave has that frequency. Near the mast the wave's electric field has an amplitude of ${n(E)} V/m. Take c = 3.00 × 10⁸ m/s. Enter the frequency in megahertz (MHz, 1 MHz = 10⁶ Hz), the wavelength in metres (m), then the amplitude of the wave's magnetic field in nanotesla (nT, 1 nT = 10⁻⁹ T), each to 2 decimal places.`,
   answer: [r2(fM), r2(lam), r2(B)],
   hints: ['The resonant frequency of an inductor and a capacitor in series is f = 1/(2π√(LC)). Every electromagnetic wave travels at c, so its wavelength is λ = c/f.', 'In an electromagnetic wave the field amplitudes are tied together by E = cB, so B = E/c.'],
   solution: `√(LC) = √(${n(L)} × 10⁻⁶ × ${n(c)} × 10⁻¹²) s, so f = 1/(2π√(LC)) ${res(fM, 'MHz')}. The wavelength is λ = c/f = 3.00 × 10⁸ ÷ (${n(fM)} × 10⁶) ${res(lam, 'm')}: longer than about 0.1 m, so these are radio waves. The magnetic field amplitude is B = E/c = ${n(E)} ÷ (3.00 × 10⁸) T ${res(B, 'nT')}.`,
   guidance: [
    { prompt: 'Use f = 1/(2π√(LC)). What is the frequency, in MHz, to 2 decimal places?', answer: [r2(fM)], explanation: `√(LC) = √(${n(L)} × 10⁻⁶ × ${n(c)} × 10⁻¹²) s, and 1 ÷ (2π√(LC)) ${ap(fM)} ${n(fM)} × 10⁶ Hz.` },
    { prompt: 'Using the unrounded frequency, what is the wavelength λ = c/f, in metres, to 2 decimal places?', answer: [r2(lam)], explanation: `3.00 × 10⁸ ÷ (${n(fM)} × 10⁶) ${ap(lam)} ${n(lam)} m.` },
    { prompt: `The electric field amplitude is ${n(E)} V/m. What is the magnetic field amplitude B = E/c, in nT, to 2 decimal places?`, answer: [r2(B)], explanation: `${n(E)} ÷ (3.00 × 10⁸) T ${ap(B)} ${n(B)} × 10⁻⁹ T, that is ${n(B)} nT.` }
   ] }; }
 }
});
})();
