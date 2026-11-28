/* Mechanics: motion and force mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signs and coefficients for printed expressions: coef(1) is '' so no "1t" is ever written. */
const sgn = v => v < 0 ? '−' : '+';
const coef = v => Math.abs(v) === 1 ? '' : n(Math.abs(v));
/* A vector written with unit vectors: vIJ(7, −2) is "7î − 2ĵ"; vIJ(−1, 3) is "−î + 3ĵ". */
const vIJ = (x, y) => `${x < 0 ? '−' : ''}${coef(x)}î ${sgn(y)} ${coef(y)}ĵ`;
/* Rounding to 2 or 3 decimal places, and a test for values too near a rounding tie to round safely. */
const r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
/* A rounded value printed with all its decimal places: fx(3.9, 2) is "3.90". */
const fx = (x, dp) => x.toFixed(dp).replace('-', '−');
const tie = (x, dp) => { const s = Math.abs(x) * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.03; };
/* Superscript exponents: sup(−5) is "⁻⁵". */
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = e => String(e).split('').map(c => SUP[c]).join('');
/* Every retry loop is bounded: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* q03: where the angle puts the marker. */
const quadrant = th => th < Math.PI / 2 ? `The angle ${n(th)} is between 0 and π/2 ≈ 1.57, so the marker is north-east of the mast and both components are positive.`
 : th < Math.PI ? `The angle ${n(th)} is between π/2 ≈ 1.57 and π ≈ 3.14, so the marker is north-west of the mast: the x component is negative and the y component positive.`
 : th < 3 * Math.PI / 2 ? `The angle ${n(th)} is between π ≈ 3.14 and 3π/2 ≈ 4.71, so the marker is south-west of the mast and both components are negative.`
 : `The angle ${n(th)} is between 3π/2 ≈ 4.71 and 2π ≈ 6.28, so the marker is south-east of the mast: the x component is positive and the y component negative.`;
const Q01 = { V: 54, M: 4 }, Q02 = { a1: 35, e1: -4, a2: 48, e2: -2, a3: 27, e3: 8 }, Q03 = { M: 40, th10: 21 }, Q04 = { ax: 7, ay: -2, bx: -3, by: 8 },
 Q05 = { ax: 4, ay: 3, bx: 2, by: -5 }, Q06 = { x0: 12, x1: 40, x2: -8, t1: 6, t2: 10 }, Q07 = { a: 1, b: 3, c: 4, d: 10, t1: 1, t2: 3 },
 Q08 = { p: 2, q: -3, r: 5, t1: 1, t2: 4 }, Q09 = { a2: 5, t: 8 }, Q10 = { v0: 14, h: 20 };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* V km/h is a multiple of 9, so V ÷ 3.6 is a multiple of 2.5 m/s; M minutes from 2 to 15. Never 72 km/h, the worked example. */
 q01: {
  canonical: Q01,
  draw: R => ({ V: 9 * R.except(2, 10, [8]), M: R.int(2, 15) }),
  build: ({ V, M }) => { const mh = V * 1000, ms = V / 3.6, s = 60 * M, d = ms * s; return {
   prompt: `The survey rover’s dashboard shows its speed as ${n(V)} kilometres per hour (km/h). It keeps that speed for ${n(M)} minutes. Enter its speed in metres per second (m/s), then the driving time in seconds (s), then the distance it covers in metres (m), typed without commas.`,
   answer: [ms, s, d],
   hints: ['A kilometre is 1000 metres and an hour is 3600 seconds. Multiply by the conversion factors (1000 m ÷ 1 km) and (1 h ÷ 3600 s), so that km and h cancel.', 'A minute is 60 seconds. At a steady speed the distance is the speed times the time, with the speed in m/s and the time in s.'],
   solution: `${n(V)} km/h × (1000 m ÷ 1 km) × (1 h ÷ 3600 s) = ${n(mh)} m ÷ 3600 s = ${n(ms)} m/s. The time is ${n(M)} min × (60 s ÷ 1 min) = ${n(s)} s. The distance is ${n(ms)} m/s × ${n(s)} s = ${n(d)} m.`,
   guidance: [
    { prompt: `How many metres are there in ${n(V)} kilometres?`, answer: [mh], explanation: `Each kilometre is 1000 metres, so ${n(V)} km × (1000 m ÷ 1 km) = ${n(mh)} m. The rover covers ${n(mh)} m every hour.` },
    { prompt: `An hour is 3600 seconds. What is ${n(mh)} metres per hour in metres per second?`, answer: [ms], explanation: `${n(mh)} m ÷ 3600 s = ${n(ms)} m/s: the hours cancel and seconds are left underneath.` },
    { prompt: `How many seconds are there in ${n(M)} minutes, and how far does the rover go at ${n(ms)} m/s in that time?`, answer: [s, d], explanation: `${n(M)} × 60 = ${n(s)} s, and ${n(ms)} m/s × ${n(s)} s = ${n(d)} m. The seconds cancel and metres are left.` }
   ] }; }
 },
 /* Mantissas a ÷ 10 from 1.2 to 9.9 (never a whole number); each exponent is drawn from two values, so each answer is
    the mantissa's digits or ten times them. */
 q02: {
  canonical: Q02,
  draw: R => { const m = () => R.int(12, 99); return retry(() => ({ a1: m(), e1: R.pick([-5, -4]), a2: m(), e2: R.pick([-2, -1]), a3: m(), e3: R.pick([7, 8]) }), p => p.a1 % 10 && p.a2 % 10 && p.a3 % 10, Q02); },
  build: ({ a1, e1, a2, e2, a3, e3 }) => { const m1 = a1 / 10, m2 = a2 / 10, m3 = a3 / 10, us = a1 * Math.pow(10, e1 + 5), mm = a2 * Math.pow(10, e2 + 2), MJ = a3 * Math.pow(10, e3 - 7); return {
   prompt: `The Survey Office logs three readings in powers of ten. A timing-gate pulse lasts ${n(m1)} × 10${sup(e1)} s, a gap in the sled rail is ${n(m2)} × 10${sup(e2)} m wide, and a battery bank stores ${n(m3)} × 10${sup(e3)} J of energy (J is the joule, the SI unit of energy). Enter the pulse in microseconds (μs), the gap in millimetres (mm), then the energy in megajoules (MJ).`,
   answer: [us, mm, MJ],
   hints: ['micro- stands for 10⁻⁶, milli- for 10⁻³ and mega- for 10⁶. To write a value in a prefixed unit, divide it by the prefix’s power of ten.', 'Dividing powers of ten subtracts the exponents: 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ. Then 10¹ moves the decimal point one place to the right, and 10⁰ = 1 leaves it where it is.'],
   solution: `Pulse: ${n(m1)} × 10${sup(e1)} s ÷ 10⁻⁶ = ${n(m1)} × 10${sup(e1 + 6)} = ${n(us)} μs. Gap: ${n(m2)} × 10${sup(e2)} m ÷ 10⁻³ = ${n(m2)} × 10${sup(e2 + 3)} = ${n(mm)} mm. Energy: ${n(m3)} × 10${sup(e3)} J ÷ 10⁶ = ${n(m3)} × 10${sup(e3 - 6)} = ${n(MJ)} MJ.`,
   guidance: [
    { prompt: `One microsecond is 10⁻⁶ s. What is ${n(m1)} × 10${sup(e1)} s ÷ 10⁻⁶, the pulse in microseconds?`, answer: [us], explanation: `The exponents subtract: ${n(e1)} − (−6) = ${n(e1 + 6)}, so the pulse is ${n(m1)} × 10${sup(e1 + 6)} = ${n(us)} μs.` },
    { prompt: `One millimetre is 10⁻³ m. What is the gap, ${n(m2)} × 10${sup(e2)} m, in millimetres?`, answer: [mm], explanation: `${n(e2)} − (−3) = ${n(e2 + 3)}, so the gap is ${n(m2)} × 10${sup(e2 + 3)} = ${n(mm)} mm.` },
    { prompt: `One megajoule is 10⁶ J. What is the stored energy, ${n(m3)} × 10${sup(e3)} J, in megajoules?`, answer: [MJ], explanation: `${n(e3)} − 6 = ${n(e3 - 6)}, so the energy is ${n(m3)} × 10${sup(e3 - 6)} = ${n(MJ)} MJ.` }
   ] }; }
 },
 /* Magnitude 5 to 60 m, angle 0.1 to 6.2 rad in tenths, kept away from the axes (|cos| and |sin| at least 0.15) and
    from rounding ties. Never the worked example (10 m at 0.5 rad). */
 q03: {
  canonical: Q03,
  draw: R => retry(() => ({ M: R.int(5, 60), th10: R.int(1, 62) }), ({ M, th10 }) => { const c = Math.cos(th10 / 10), s = Math.sin(th10 / 10);
   return Math.abs(c) >= 0.15 && Math.abs(s) >= 0.15 && !tie(M * c, 2) && !tie(M * s, 2) && th10 !== 10 && !(M === 10 && th10 === 5); }, Q03),
  build: ({ M, th10 }) => { const th = th10 / 10, c = Math.cos(th), s = Math.sin(th), x = M * c, y = M * s, X = r2(x), Y = r2(y); return {
   prompt: `A survey marker stands ${n(M)} m from the survey mast. Take the mast as the origin, with the x-axis pointing east and the y-axis pointing north. The line from the mast to the marker makes an angle of ${n(th)} radians with the positive x-axis, measured anticlockwise (from east towards north). Enter the x component, then the y component, of the vector from the mast to the marker, in metres, each to 2 decimal places. A negative component points west or south.`,
   answer: [X, Y],
   hints: ['The x component is the magnitude times the cosine of the angle, and the y component is the magnitude times the sine: Ax = A cos θ and Ay = A sin θ. Work in radians.', 'Round only at the end. Between π/2 and π the cosine is negative; between π and 3π/2 the cosine and the sine are both negative; between 3π/2 and 2π the sine is negative.'],
   solution: `${quadrant(th)} cos ${n(th)} ≈ ${n(c)} and sin ${n(th)} ≈ ${n(s)}. The x component is ${n(M)} × cos ${n(th)} ≈ ${n(x)} m, which is ${fx(X, 2)} m to 2 decimal places. The y component is ${n(M)} × sin ${n(th)} ≈ ${n(y)} m, which is ${fx(Y, 2)} m to 2 decimal places.`,
   guidance: [
    { prompt: `What is the x component, ${n(M)} × cos ${n(th)}, in metres to 2 decimal places?`, answer: [X], explanation: `cos ${n(th)} ≈ ${n(c)}, and ${n(M)} × cos ${n(th)} ≈ ${n(x)}, so the x component is ${fx(X, 2)} m.` },
    { prompt: `What is the y component, ${n(M)} × sin ${n(th)}, in metres to 2 decimal places?`, answer: [Y], explanation: `sin ${n(th)} ≈ ${n(s)}, and ${n(M)} × sin ${n(th)} ≈ ${n(y)}, so the y component is ${fx(Y, 2)} m.` }
   ] }; }
 },
 /* Two moves with whole-number components from −12 to 12 (none 0, at least one negative) whose resultant has both
    components positive, so the angle is tan⁻¹(Ry ÷ Rx). Magnitude and angle kept off rounding ties. */
 q04: {
  canonical: Q04,
  draw: R => retry(() => ({ ax: R.nz(-12, 12), ay: R.nz(-12, 12), bx: R.nz(-12, 12), by: R.nz(-12, 12) }), ({ ax, ay, bx, by }) => { const x = ax + bx, y = ay + by;
   return x >= 1 && y >= 1 && Math.min(ax, ay, bx, by) < 0 && !tie(Math.hypot(x, y), 2) && !tie(Math.atan(y / x), 2) && r2(Math.atan(y / x)) !== 1 && x !== y; }, Q04),
  build: ({ ax, ay, bx, by }) => { const x = ax + bx, y = ay + by, m = Math.hypot(x, y), th = Math.atan(y / x), M = r2(m), TH = r2(th); return {
   prompt: `A survey drone flies two straight legs from the mast. Its first move is the vector A = ${vIJ(ax, ay)} metres and its second is B = ${vIJ(bx, by)} metres, where î is the unit vector pointing east and ĵ the unit vector pointing north. Enter the x component, then the y component, of the resultant R = A + B in metres, then its magnitude in metres to 2 decimal places, then its direction: the angle from the positive x-axis, anticlockwise, in radians to 2 decimal places. Both components of R are positive here, so that angle lies between 0 and π/2.`,
   answer: [x, y, M, TH],
   hints: ['Add matching components: Rx = Ax + Bx and Ry = Ay + By.', 'The magnitude is √(Rx² + Ry²). When both components are positive, the angle is tan⁻¹(Ry ÷ Rx), in radians.'],
   solution: `Rx = ${n(ax)} + ${par(bx)} = ${n(x)} m and Ry = ${n(ay)} + ${par(by)} = ${n(y)} m, so R = ${vIJ(x, y)} metres. Its magnitude is √(${n(x)}² + ${n(y)}²) = √${n(x * x + y * y)} ≈ ${n(m)}, which is ${fx(M, 2)} m to 2 decimal places. Its angle is tan⁻¹(${n(y)} ÷ ${n(x)}) ≈ ${n(th)}, which is ${fx(TH, 2)} radians to 2 decimal places.`,
   guidance: [
    { prompt: `Add the x components and then the y components of A and B. What are Rx and Ry?`, answer: [x, y], explanation: `Rx = ${n(ax)} + ${par(bx)} = ${n(x)} and Ry = ${n(ay)} + ${par(by)} = ${n(y)}, both in metres.` },
    { prompt: `What is the magnitude √(${n(x)}² + ${n(y)}²), in metres to 2 decimal places?`, answer: [M], explanation: `${n(x)}² + ${n(y)}² = ${n(x * x)} + ${n(y * y)} = ${n(x * x + y * y)}, and √${n(x * x + y * y)} ≈ ${n(m)}, so the magnitude is ${fx(M, 2)} m.` },
    { prompt: `What is the angle tan⁻¹(${n(y)} ÷ ${n(x)}), in radians to 2 decimal places?`, answer: [TH], explanation: `${n(y)} ÷ ${n(x)} ≈ ${n(y / x)}, and tan⁻¹ of that is about ${n(th)} radians, which rounds to ${fx(TH, 2)}.` }
   ] }; }
 },
 /* Two sight lines with whole-number components from −9 to 9 (none 0), not nearly parallel (|cos φ| at most 0.98);
    the magnitudes and the angle are kept off rounding ties at 3 decimal places. */
 q05: {
  canonical: Q05,
  draw: R => retry(() => ({ ax: R.nz(-9, 9), ay: R.nz(-9, 9), bx: R.nz(-9, 9), by: R.nz(-9, 9) }), ({ ax, ay, bx, by }) => { const A = Math.hypot(ax, ay), B = Math.hypot(bx, by), d = ax * bx + ay * by;
   return Math.abs(d / (A * B)) <= 0.98 && !tie(A, 3) && !tie(B, 3) && !tie(Math.acos(d / (A * B)), 3) && !(ax === 1 && ay === 2 && bx === 3 && by === 1); }, Q05),
  build: ({ ax, ay, bx, by }) => { const d = ax * bx + ay * by, A = Math.hypot(ax, ay), B = Math.hypot(bx, by), c = d / (A * B), ph = Math.acos(c), A3 = r3(A), B3 = r3(B), PH = r3(ph); return {
   prompt: `Two sight lines leave the survey mast along the vectors A = ${vIJ(ax, ay)} and B = ${vIJ(bx, by)}, in metres (î points east, ĵ north). Enter the dot product A · B in square metres (m²), then the angle between the two sight lines in radians to 3 decimal places.`,
   answer: [d, PH],
   hints: ['Multiply matching components and add: A · B = AxBx + AyBy.', 'The dot product also equals |A| |B| cos φ, so cos φ = A · B ÷ (|A| |B|), and φ is the inverse cosine of that, between 0 and π.'],
   solution: `A · B = ${par(ax)} × ${par(bx)} + ${par(ay)} × ${par(by)} = ${n(ax * bx)} + ${par(ay * by)} = ${n(d)} m². The magnitudes are |A| = √${n(ax * ax + ay * ay)} ≈ ${n(A)} m and |B| = √${n(bx * bx + by * by)} ≈ ${n(B)} m. So cos φ = ${n(d)} ÷ (${n(A)} × ${n(B)}) ≈ ${n(c)}, and φ = cos⁻¹(${n(c)}) ≈ ${n(ph)}, which is ${fx(PH, 3)} radians to 3 decimal places.`,
   guidance: [
    { prompt: `What is A · B = ${par(ax)} × ${par(bx)} + ${par(ay)} × ${par(by)}, in square metres?`, answer: [d], explanation: `${n(ax * bx)} + ${par(ay * by)} = ${n(d)} m².` },
    { prompt: `What are the magnitudes |A| = √(${par(ax)}² + ${par(ay)}²) and |B| = √(${par(bx)}² + ${par(by)}²), in metres to 3 decimal places?`, answer: [A3, B3], explanation: `|A| = √${n(ax * ax + ay * ay)} ≈ ${n(A)} and |B| = √${n(bx * bx + by * by)} ≈ ${n(B)}. Keep the unrounded values for the next step.` },
    { prompt: `cos φ = A · B ÷ (|A| |B|). What is the angle φ, in radians to 3 decimal places?`, answer: [PH], explanation: `cos φ = ${n(d)} ÷ (${n(A)} × ${n(B)}) ≈ ${n(c)}, and cos⁻¹(${n(c)}) ≈ ${n(ph)}, so φ ≈ ${fx(PH, 3)} radians.` }
   ] }; }
 },
 /* The sled turns round once: either it runs past its final position and comes back, or it first goes the other way.
    The average velocity is a multiple of 0.5 m/s, never 0, over an even whole time of 6 to 20 seconds. */
 q06: {
  canonical: Q06,
  draw: R => retry(() => { const t2 = 2 * R.int(3, 10), t1 = R.int(2, t2 - 2), v = R.except(-8, 8, [0]) / 2, x0 = R.int(-30, 30), x2 = x0 + v * t2, s = Math.sign(v), x1 = R.bool() ? x2 + s * R.int(5, 30) : x0 - s * R.int(5, 30);
   return { x0, x1, x2, t1, t2 }; }, p => !(p.x0 === 5 && p.x2 === 9), Q06),
  build: ({ x0, x1, x2, t1, t2 }) => { const D = x2 - x0, l1 = Math.abs(x1 - x0), l2 = Math.abs(x2 - x1), d = l1 + l2, v = D / t2; return {
   prompt: `On the sled run, positions are measured in metres from a marker post, with uphill as the positive direction. A sled starts at x = ${n(x0)} m at t = 0 s. At t = ${n(t1)} s it is at x = ${n(x1)} m, where it turns round, and at t = ${n(t2)} s it stops at x = ${n(x2)} m; between those moments it keeps going one way. Enter its displacement over the whole trip in metres, then the distance it travelled in metres, then its average velocity over the whole trip in metres per second (a negative value means downhill).`,
   answer: [D, d, v],
   hints: ['The displacement is the final position minus the starting position, Δx = x(final) − x(start). The turn does not change it.', 'The distance adds the lengths of the two legs, each counted as positive. The average velocity is the displacement divided by the whole time, Δx ÷ Δt.'],
   solution: `Displacement: Δx = ${n(x2)} − ${par(x0)} = ${n(D)} m. The first leg is from ${n(x0)} m to ${n(x1)} m, a length of ${n(l1)} m; the second is from ${n(x1)} m to ${n(x2)} m, a length of ${n(l2)} m. The distance is ${n(l1)} + ${n(l2)} = ${n(d)} m. The average velocity is ${n(D)} m ÷ ${n(t2)} s = ${n(v)} m/s.`,
   guidance: [
    { prompt: `What is the displacement, the final position ${n(x2)} m minus the starting position ${n(x0)} m?`, answer: [D], explanation: `Δx = ${n(x2)} − ${par(x0)} = ${n(D)} m. Only the two ends count.` },
    { prompt: `How long is each leg of the trip: from ${n(x0)} m to ${n(x1)} m, then from ${n(x1)} m to ${n(x2)} m?`, answer: [l1, l2], explanation: `The legs are ${n(l1)} m and ${n(l2)} m long. A length is never negative, whichever way the sled went.` },
    { prompt: `What is the total distance, and what is the average velocity, the displacement divided by the ${n(t2)} s of the trip?`, answer: [d, v], explanation: `The distance is ${n(l1)} + ${n(l2)} = ${n(d)} m. The average velocity is ${n(D)} ÷ ${n(t2)} = ${n(v)} m/s.` }
   ] }; }
 },
 /* x(t) = d + ct + bt² − at³: the velocity is positive at t1 and negative at t2, at most 60 m/s in size. */
 q07: {
  canonical: Q07,
  draw: R => retry(() => { const t1 = R.int(1, 3); return { a: R.int(1, 3), b: R.int(1, 6), c: R.int(1, 12), d: R.int(2, 20), t1, t2: t1 + R.int(1, 3) }; }, ({ a, b, c, t1, t2 }) => {
   const v = t => c + 2 * b * t - 3 * a * t * t; return v(t1) > 0 && v(t2) < 0 && v(t2) >= -60; }, Q07),
  build: ({ a, b, c, d, t1, t2 }) => { const v = t => c + 2 * b * t - 3 * a * t * t, v1 = v(t1), v2 = v(t2), B = 2 * b, A = 3 * a, x = `${n(d)} + ${coef(c)}t + ${coef(b)}t² − ${coef(a)}t³`, vx = `${n(c)} + ${n(B)}t − ${n(A)}t²`; return {
   prompt: `A winch drags a sled up the run and then lets it slip back. Its position is x(t) = ${x} metres, t seconds after the start, with uphill as positive. Enter its velocity at t = ${n(t1)} s, then its velocity at t = ${n(t2)} s, both in metres per second, then its speed at t = ${n(t2)} s in metres per second.`,
   answer: [v1, v2, -v2],
   hints: ['The velocity is the derivative of the position, v(t) = dx/dt. Differentiate term by term with the power rule.', 'Speed is the size of the velocity, with its sign dropped: it is never negative.'],
   solution: `v(t) = dx/dt = ${vx}. At t = ${n(t1)}: v = ${n(c)} + ${n(B)} × ${n(t1)} − ${n(A)} × ${n(t1 * t1)} = ${n(v1)} m/s, so the sled is moving uphill. At t = ${n(t2)}: v = ${n(c)} + ${n(B)} × ${n(t2)} − ${n(A)} × ${n(t2 * t2)} = ${n(v2)} m/s, so it is sliding downhill, and its speed is ${n(-v2)} m/s.`,
   guidance: [
    { prompt: `Differentiate x(t) = ${x}. In v(t), what are the constant term, the number in front of t and the number in front of t²?`, answer: [c, B, -A], explanation: `The constant ${n(d)} has derivative 0, ${coef(c)}t gives ${n(c)}, ${coef(b)}t² gives ${n(B)}t and −${coef(a)}t³ gives −${n(A)}t², so v(t) = ${vx}.` },
    { prompt: `What is v(${n(t1)}), the velocity at t = ${n(t1)} s, in metres per second?`, answer: [v1], explanation: `${n(c)} + ${n(B)} × ${n(t1)} − ${n(A)} × ${n(t1 * t1)} = ${n(v1)} m/s. It is positive, so the sled is going uphill.` },
    { prompt: `What are the velocity and the speed at t = ${n(t2)} s, in metres per second?`, answer: [v2, -v2], explanation: `${n(c)} + ${n(B)} × ${n(t2)} − ${n(A)} × ${n(t2 * t2)} = ${n(v2)} m/s. The minus sign says downhill; the speed drops the sign: ${n(-v2)} m/s.` }
   ] }; }
 },
 /* v(t) = pt² + qt + r; the average acceleration from t1 to t2 is p(t1 + t2) + q and the instantaneous one at t2 is
    2pt2 + q, which differ because p is not 0. r >= 2, so never the worked example (t² + 4t). */
 q08: {
  canonical: Q08,
  draw: R => { const t1 = R.int(0, 3); return { p: R.pick([-2, -1, 1, 2, 3]), q: R.nz(-6, 6), r: R.int(2, 20), t1, t2: t1 + R.int(2, 5) }; },
  build: ({ p, q, r, t1, t2 }) => { const v = t => p * t * t + q * t + r, v1 = v(t1), v2 = v(t2), avg = (v2 - v1) / (t2 - t1), inst = 2 * p * t2 + q,
   vx = `${p < 0 ? '−' : ''}${coef(p)}t² ${sgn(q)} ${coef(q)}t + ${n(r)}`, ax = `${n(2 * p)}t ${sgn(q)} ${n(Math.abs(q))}`; return {
   prompt: `A sled’s velocity on the run is v(t) = ${vx} metres per second, t seconds after it is released, with uphill as positive. Enter its average acceleration from t = ${n(t1)} s to t = ${n(t2)} s, then its instantaneous acceleration at t = ${n(t2)} s, both in metres per second squared (m/s²).`,
   answer: [avg, inst],
   hints: ['The average acceleration is the change in velocity divided by the change in time, Δv ÷ Δt.', 'The instantaneous acceleration is the derivative of the velocity, a(t) = dv/dt.'],
   solution: `v(${n(t1)}) = ${n(v1)} m/s and v(${n(t2)}) = ${n(v2)} m/s, so the average acceleration is (${n(v2)} − ${par(v1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(v2 - v1)} ÷ ${n(t2 - t1)} = ${n(avg)} m/s². The derivative is a(t) = ${ax}, so at t = ${n(t2)} the acceleration is ${n(2 * p)} × ${n(t2)} ${sgn(q)} ${n(Math.abs(q))} = ${n(inst)} m/s².`,
   guidance: [
    { prompt: `What are the velocities v(${n(t1)}) and v(${n(t2)}), in metres per second?`, answer: [v1, v2], explanation: `Put each time into v(t) = ${vx}: v(${n(t1)}) = ${n(v1)} and v(${n(t2)}) = ${n(v2)}, both in m/s.` },
    { prompt: `What is the average acceleration, (v(${n(t2)}) − v(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}), in m/s²?`, answer: [avg], explanation: `${n(v2 - v1)} m/s of change in ${n(t2 - t1)} s gives ${n(avg)} m/s².` },
    { prompt: `Differentiate: a(t) = ${ax}. What is a(${n(t2)}), in m/s²?`, answer: [inst], explanation: `${n(2 * p)} × ${n(t2)} ${sgn(q)} ${n(Math.abs(q))} = ${n(inst)} m/s². It is not the average, because the acceleration changes during the interval.` }
   ] }; }
 },
 /* Deceleration a2 ÷ 2 from 1.5 to 6 m/s², stopping time 3 to 12 s, start speed at most 40 m/s. Not the worked example
    (12 m/s at 3 m/s²). The distance v₀t ÷ 2 has at most 2 decimal places. */
 q09: {
  canonical: Q09,
  draw: R => retry(() => ({ a2: R.int(3, 12), t: R.int(3, 12) }), ({ a2, t }) => a2 * t / 2 <= 40 && !(a2 === 6 && t === 4), Q09),
  build: ({ a2, t }) => { const a = a2 / 2, v0 = a * t, v02 = v0 * v0, d = v0 * t / 2; return {
   prompt: `A cargo sled is moving along the flat run at ${n(v0)} m/s when its brakes come on. They slow it with a constant deceleration of ${n(a)} m/s², so, taking its direction of motion as positive, its acceleration is −${n(a)} m/s². Enter the time it takes to stop in seconds, then the distance it slides while braking in metres.`,
   answer: [t, d],
   hints: ['Use v = v₀ + at with the final velocity v = 0, and solve for t.', 'Use v² = v₀² + 2a(x − x₀) with v = 0: the stopping distance x − x₀ is v₀² ÷ (2 × the deceleration).'],
   solution: `From v = v₀ + at: 0 = ${n(v0)} − ${n(a)}t, so t = ${n(v0)} ÷ ${n(a)} = ${n(t)} s. From v² = v₀² + 2a(x − x₀): 0 = ${n(v02)} − 2 × ${n(a)} × (x − x₀), so x − x₀ = ${n(v02)} ÷ ${n(2 * a)} = ${n(d)} m.`,
   guidance: [
    { prompt: `The sled stops when v = 0. Solve 0 = ${n(v0)} − ${n(a)}t. What is t, in seconds?`, answer: [t], explanation: `${n(a)}t = ${n(v0)}, so t = ${n(v0)} ÷ ${n(a)} = ${n(t)} s.` },
    { prompt: `The third equation needs v₀². What is ${n(v0)}², in square metres per second squared?`, answer: [v02], explanation: `${n(v0)} × ${n(v0)} = ${n(v02)}.` },
    { prompt: `Solve 0 = ${n(v02)} − 2 × ${n(a)} × (x − x₀). What is the stopping distance x − x₀, in metres?`, answer: [d], explanation: `2 × ${n(a)} = ${n(2 * a)}, and ${n(v02)} ÷ ${n(2 * a)} = ${n(d)} m. Check: the average speed while braking is ${n(v0 / 2)} m/s, and ${n(v0 / 2)} × ${n(t)} = ${n(d)} m.` }
   ] }; }
 },
 /* Thrown up at 5 to 25 m/s from a tower 5 to 60 m high; the three rounded answers are kept off rounding ties. */
 q10: {
  canonical: Q10,
  draw: R => retry(() => ({ v0: R.int(5, 25), h: R.int(5, 60) }), ({ v0, h }) => { const tt = v0 / 9.8, H = h + v0 * v0 / 19.6, tg = (v0 + Math.sqrt(v0 * v0 + 19.6 * h)) / 9.8;
   return !tie(tt, 2) && !tie(H, 2) && !tie(tg, 2); }, Q10),
  build: ({ v0, h }) => { const tt = v0 / 9.8, rise = v0 * v0 / 19.6, H = h + rise, disc = v0 * v0 + 19.6 * h, root = Math.sqrt(disc), tg = (v0 + root) / 9.8; return {
   prompt: `A crew member on the lookout tower at the top of the sled run throws a marker pod straight up at ${n(v0)} m/s. The pod leaves her hand ${n(h)} m above the ground and is then in free fall: take g = 9.8 m/s², upwards as positive, and ignore air resistance. Enter the time it takes to reach its highest point in seconds, then its greatest height above the ground in metres, then the time from the throw until it hits the ground in seconds, each to 2 decimal places.`,
   answer: [r2(tt), r2(H), r2(tg)],
   hints: ['At the highest point the velocity is 0 for an instant: solve 0 = v₀ − gt for t.', 'The pod lands when its height y = h + v₀t − ½gt² is 0. Solve that quadratic with the quadratic formula and keep the positive root.'],
   solution: `Top: 0 = ${n(v0)} − 9.8t gives t = ${n(v0)} ÷ 9.8 ≈ ${n(tt)}, which is ${fx(r2(tt), 2)} s. From v² = v₀² − 2g(y − y₀), the rise above the hand is ${n(v0 * v0)} ÷ 19.6 ≈ ${n(rise)} m, so the greatest height is ${n(h)} + ${n(rise)} ≈ ${n(H)}, which is ${fx(r2(H), 2)} m. Landing: 4.9t² − ${n(v0)}t − ${n(h)} = 0, so t = (${n(v0)} + √(${n(v0 * v0)} + 19.6 × ${n(h)})) ÷ 9.8 = (${n(v0)} + √${n(disc)}) ÷ 9.8 ≈ ${n(tg)}, which is ${fx(r2(tg), 2)} s.`,
   guidance: [
    { prompt: `At the top the velocity is 0. Solve 0 = ${n(v0)} − 9.8t: what is t, in seconds to 2 decimal places?`, answer: [r2(tt)], explanation: `t = ${n(v0)} ÷ 9.8 ≈ ${n(tt)} s, which rounds to ${fx(r2(tt), 2)} s.` },
    { prompt: `The pod rises v₀² ÷ (2g) above the hand. What is its greatest height above the ground, in metres to 2 decimal places?`, answer: [r2(H)], explanation: `${n(v0 * v0)} ÷ 19.6 ≈ ${n(rise)} m above the hand, and ${n(h)} + ${n(rise)} ≈ ${n(H)} m above the ground, which rounds to ${fx(r2(H), 2)} m.` },
    { prompt: `Landing means ${n(h)} + ${n(v0)}t − 4.9t² = 0. What is the positive root, in seconds to 2 decimal places?`, answer: [r2(tg)], explanation: `Rewritten as 4.9t² − ${n(v0)}t − ${n(h)} = 0, the quadratic formula gives t = (${n(v0)} ± √${n(disc)}) ÷ 9.8. The root with + is about ${n(tg)}, which rounds to ${fx(r2(tg), 2)} s; the other root is negative, before the throw.` }
   ] }; }
 }
});
})();
