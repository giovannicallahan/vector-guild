/* Mechanics: motion and force mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
/* "a" or "an" before a number as it is read aloud: an 8, an 80, an 11, an 18, an 18000; a 7, a 110. cap gives "A"/"An". */
const aN = (x, cap) => { const d = String(Math.round(Math.abs(x))), v = d[0] === '8' || ((d.startsWith('11') || d.startsWith('18')) && d.length % 3 === 2); return (cap ? 'A' : 'a') + (v ? 'n' : ''); };
const G = window.Gen, { n, plus, par } = G;
const g = 9.8;
/* Rounding to 2 decimal places (or dp places), and "=" or "≈" before a rounded value. */
const rd = (x, dp = 2) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const exact = (x, dp = 2) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-6;
const eq = (x, dp = 2) => exact(x, dp) ? '=' : '≈';
/* Away from a rounding tie in the place after the last kept one (no 3.125 to round to 2 decimals). */
const offTie = (x, dp = 2) => { const s = Math.abs(x) * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(c => c === '-' ? '⁻' : SUP[Number(c)]).join('');
/* An angle num·π/den in radians, written π/6, 2π/3, π/2. */
const piText = (a, b) => `${a === 1 ? '' : n(a)}π/${n(b)}`;
/* Velocity of module B in q33, in words. */
const bText = v => v === 0 ? 'is at rest' : v < 0 ? `is coming the other way at ${n(-v)} m/s (a velocity of ${n(v)} m/s)` : `is drifting ahead of it in the same direction at ${n(v)} m/s`;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Sled from rest down a frictionless ramp of height h, across a rough strip (length d, μ), into a buffer spring k.
    m and d are whole numbers and μ is one of 0.1, 0.15, 0.2, 0.25, 0.3, so every energy has at most 2 decimals.
    Friction takes at most 70% of the energy. The worked example (10 kg) is below the drawn masses. */
 q31: {
  canonical: { m: 30, h: 4, d: 3, mu: 0.2, k: 3000 },
  draw: R => tryDraw(R, R => ({ m: R.int(15, 60), h: R.int(4, 12) / 2, d: R.int(2, 6), mu: R.pick([0.1, 0.15, 0.2, 0.25, 0.3]), k: 500 * R.int(3, 12) }),
   p => p.mu * p.d <= 0.7 * p.h && offTie(Math.sqrt(2 * g * p.h)) && offTie(Math.sqrt(2 * (p.m * g * p.h - p.mu * p.m * g * p.d) / p.k)), { m: 30, h: 4, d: 3, mu: 0.2, k: 3000 }),
  build: ({ m, h, d, mu, k }) => { const E0 = m * g * h, v1 = Math.sqrt(2 * g * h), Wf = mu * m * g * d, E1 = E0 - Wf, x = Math.sqrt(2 * E1 / k); return {
   prompt: `A cargo sled of mass ${n(m)} kg starts from rest at the top of the Docking Ring’s loading ramp, ${n(h)} m above the floor. The ramp is frictionless. At the bottom the sled crosses a rough strip of floor ${n(d)} m long, where the coefficient of kinetic friction is μ = ${n(mu)}: there the friction force is μmg, μ times the sled’s weight. Past the strip the floor is frictionless again, and the sled runs into a buffer spring with spring constant k = ${n(k)} N/m. Take g = 9.8 m/s². Enter the sled’s speed at the bottom of the ramp in metres per second, then the greatest compression of the spring in metres, both to 2 decimal places.`,
   answer: [rd(v1), rd(x)],
   hints: ['On the frictionless ramp mechanical energy is kept: the potential energy mgh at the top becomes the kinetic energy ½mv² at the bottom.', 'On the rough strip friction takes away energy equal to the size of its work, μmg × distance. What is left is stored in the spring as ½kx² at the moment the sled stops.'],
   solution: `At the top U = mgh = ${n(m)} × 9.8 × ${n(h)} = ${n(E0)} J and K = 0. At the bottom of the ramp all of it is kinetic: ½ × ${n(m)} × v² = ${n(E0)}, so v = √(2 × 9.8 × ${n(h)}) ${eq(v1)} ${n(rd(v1))} m/s. On the strip friction does −μmgd = −${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = −${n(Wf)} J of work, leaving ${n(E0)} − ${n(Wf)} = ${n(E1)} J of mechanical energy. At the greatest compression the sled is still, so ½ × ${n(k)} × x² = ${n(E1)}, giving x = √(2 × ${n(E1)} ÷ ${n(k)}) ${eq(x)} ${n(rd(x))} m.`,
   guidance: [
    { prompt: `What is the sled’s potential energy at the top of the ramp, U = mgh, in joules?`, answer: [E0], explanation: `U = ${n(m)} × 9.8 × ${n(h)} = ${n(E0)} J. The sled starts from rest, so this is all its mechanical energy.` },
    { prompt: `On the frictionless ramp all of that becomes kinetic energy. What is the speed at the bottom, in m/s to 2 decimal places?`, answer: [rd(v1)], explanation: `½mv² = mgh, and the mass cancels: v = √(2gh) = √(2 × 9.8 × ${n(h)}) ${eq(v1)} ${n(rd(v1))} m/s.` },
    { prompt: `How much energy, in joules, does friction take on the ${n(d)} m strip (μmg × distance)?`, answer: [Wf], explanation: `${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = ${n(Wf)} J. Friction is not a conservative force: this energy leaves as heat and does not come back.` },
    { prompt: `The ${n(E1)} J that is left is stored in the spring when it is squeezed furthest. What is the compression x, in metres to 2 decimal places?`, answer: [rd(x)], explanation: `½kx² = ${n(E1)}, so x = √(2 × ${n(E1)} ÷ ${n(k)}) ${eq(x)} ${n(rd(x))} m.` }
   ] }; }
 },
 /* A module of m kg at v1 m/s bounces off a buffer at v2 m/s after a contact time dt. Towards the buffer is positive.
    m is a multiple of 10 and the speeds are halves, so every momentum is a multiple of 5 and the force has at most
    2 decimals. Not the worked example (80 kg, 2 m/s, 1 m/s, 0.5 s). */
 q32: {
  canonical: { m: 120, v1: 3, v2: 1.5, dt: 0.4 },
  draw: R => tryDraw(R, R => ({ m: 10 * R.int(5, 40), v1: R.int(2, 12) / 2, v2: R.int(1, 6) / 2, dt: R.pick([0.2, 0.25, 0.4, 0.5, 0.8]) }),
   p => p.v2 < p.v1 && !(p.m === 80 && p.v1 === 2 && p.v2 === 1 && p.dt === 0.5), { m: 120, v1: 3, v2: 1.5, dt: 0.4 }),
  build: ({ m, v1, v2, dt }) => { const p1 = m * v1, pf = -m * v2, J = pf - p1, F = J / dt; return {
   prompt: `${aN(m, true)} ${n(m)} kg cargo module drifts towards the docking buffer at ${n(v1)} m/s, presses into it for ${n(dt)} s and bounces straight back at ${n(v2)} m/s. The module floats in the ring, so during the contact only the buffer pushes on it along its line of motion. Take the direction towards the buffer as positive, so the velocity after the bounce is ${n(-v2)} m/s. Enter the module’s momentum before it touches the buffer in kilogram metres per second (kg·m/s), then the impulse the buffer gives it in newton seconds (N·s), then the average force of the buffer on it in newtons (N). Signs matter; type the numbers without commas.`,
   answer: [p1, J, F],
   hints: ['Momentum is mass times velocity, p = mv. The velocity after the bounce is negative, so that momentum is negative too.', 'The impulse equals the change in momentum, final minus initial. The average force is the impulse divided by the contact time.'],
   solution: `Before: p = ${n(m)} × ${n(v1)} = ${n(p1)} kg·m/s. After: p = ${n(m)} × ${par(-v2)} = ${n(pf)} kg·m/s. The impulse is the change in momentum: ${n(pf)} − ${n(p1)} = ${n(J)} N·s. The average force is impulse ÷ contact time = ${n(J)} ÷ ${n(dt)} = ${n(F)} N. The minus sign says the buffer pushes in the negative direction, back the way the load came.`,
   guidance: [
    { prompt: `What is the module’s momentum before it touches the buffer, ${n(m)} × ${n(v1)}, in kg·m/s?`, answer: [p1], explanation: `p = mv = ${n(m)} × ${n(v1)} = ${n(p1)} kg·m/s, positive because the module moves towards the buffer.` },
    { prompt: `What is its momentum after the bounce, with velocity ${n(-v2)} m/s, in kg·m/s?`, answer: [pf], explanation: `p = ${n(m)} × ${par(-v2)} = ${n(pf)} kg·m/s. It is negative because the module now moves away from the buffer.` },
    { prompt: `The impulse is the change in momentum, final minus initial. What is it, in N·s?`, answer: [J], explanation: `${n(pf)} − ${n(p1)} = ${n(J)} N·s. A bounce changes the momentum by more than a plain stop would.` },
    { prompt: `Divide the impulse by the contact time of ${n(dt)} s. What is the average force, in N?`, answer: [F], explanation: `${n(J)} ÷ ${n(dt)} = ${n(F)} N. A shorter contact time would mean a larger force for the same impulse.` }
   ] }; }
 },
 /* Module A (m1, v1 > 0) runs into module B (m2, v2 < v1, possibly at rest or moving the other way); they latch.
    Masses are hundreds of kg and speeds halves; the common velocity has at most 2 decimals and is never 0.
    Not the worked example (300 kg at 2 m/s into 100 kg at rest). */
 q33: {
  canonical: { m1: 400, v1: 3, m2: 200, v2: -1.5 },
  draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), v1: R.int(2, 8) / 2, m2: 100 * R.int(1, 8), v2: R.int(-4, 4) / 2 }),
   p => p.v2 < p.v1 && p.m1 * p.v1 + p.m2 * p.v2 !== 0 && exact((p.m1 * p.v1 + p.m2 * p.v2) / (p.m1 + p.m2)) && !(p.m1 === 300 && p.v1 === 2 && p.m2 === 100 && p.v2 === 0), { m1: 400, v1: 3, m2: 200, v2: -1.5 }),
  build: ({ m1, v1, m2, v2 }) => { const P = m1 * v1 + m2 * v2, M = m1 + m2, vf = P / M, Ki = m1 * v1 * v1 / 2 + m2 * v2 * v2 / 2, Kf = M * vf * vf / 2, loss = Ki - Kf; return {
   prompt: `Module A (${n(m1)} kg) glides along the docking track at ${n(v1)} m/s towards module B (${n(m2)} kg), which ${bText(v2)}. Take A’s direction of motion as positive. The two latch together and move off as one, and no outside force acts along the track. Enter their common velocity just after latching in metres per second, then the kinetic energy lost in the collision in joules (type the numbers without commas).`,
   answer: [vf, loss],
   hints: ['The total momentum before, m₁v₁ + m₂v₂, equals the total momentum after, (m₁ + m₂)v. Keep the sign of each velocity.', 'The kinetic energy lost is the total ½mv² of the two modules before, minus ½(m₁ + m₂)v² after.'],
   solution: `Momentum before: ${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s. After latching the mass is ${n(M)} kg, so v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s. Kinetic energy before: ½ × ${n(m1)} × ${n(v1)}² + ½ × ${n(m2)} × ${par(v2)}² = ${n(Ki)} J. After: ½ × ${n(M)} × ${par(vf)}² = ${n(Kf)} J. Lost: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J. Latching makes the collision perfectly inelastic, so kinetic energy is lost; in an elastic collision none would be.`,
   guidance: [
    { prompt: `What is the total momentum of A and B before the collision, in kg·m/s?`, answer: [P], explanation: `${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s. Momentum is kept, so the latched pair has this momentum too.` },
    { prompt: `Divide by the joined mass of ${n(M)} kg. What is the common velocity, in m/s?`, answer: [vf], explanation: `v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s.` },
    { prompt: `What is the total kinetic energy of the two modules before the collision, in joules?`, answer: [Ki], explanation: `½ × ${n(m1)} × ${n(v1)}² + ½ × ${n(m2)} × ${par(v2)}² = ${n(Ki)} J.` },
    { prompt: `The latched pair has kinetic energy ½ × ${n(M)} × ${par(vf)}². How much kinetic energy, in joules, was lost?`, answer: [loss], explanation: `After: ½ × ${n(M)} × ${par(vf)}² = ${n(Kf)} J. Lost: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J, turned into heat and sound in the latches.` }
   ] }; }
 },
 /* Three point masses (hundreds of kg) at whole-number places from −8 to 8 m; the centre of mass to 2 decimals, off
    rounding ties. The three places differ, and the x and y answers are not equal. Not the worked example (two masses). */
 q34: {
  canonical: { m1: 300, x1: 2, y1: 5, m2: 500, x2: -4, y2: 1, m3: 200, x3: 6, y3: -3 },
  draw: R => tryDraw(R, R => ({ m1: 100 * R.int(2, 9), x1: R.int(-8, 8), y1: R.int(-8, 8), m2: 100 * R.int(2, 9), x2: R.int(-8, 8), y2: R.int(-8, 8), m3: 100 * R.int(2, 9), x3: R.int(-8, 8), y3: R.int(-8, 8) }),
   p => { const M = p.m1 + p.m2 + p.m3, X = (p.m1 * p.x1 + p.m2 * p.x2 + p.m3 * p.x3) / M, Y = (p.m1 * p.y1 + p.m2 * p.y2 + p.m3 * p.y3) / M, key = (a, b) => a + ',' + b;
    return new Set([key(p.x1, p.y1), key(p.x2, p.y2), key(p.x3, p.y3)]).size === 3 && new Set([p.x1, p.x2, p.x3]).size > 1 && new Set([p.y1, p.y2, p.y3]).size > 1 && offTie(X) && offTie(Y) && rd(X) !== rd(Y); },
   { m1: 300, x1: 2, y1: 5, m2: 500, x2: -4, y2: 1, m3: 200, x3: 6, y3: -3 }),
  build: ({ m1, x1, y1, m2, x2, y2, m3, x3, y3 }) => { const M = m1 + m2 + m3, Sx = m1 * x1 + m2 * x2 + m3 * x3, Sy = m1 * y1 + m2 * y2 + m3 * y3, X = Sx / M, Y = Sy / M; return {
   prompt: `Three cargo modules are parked on the Docking Ring floor, which is marked with an x axis and a y axis in metres. Module A has mass ${n(m1)} kg and sits at (${n(x1)}, ${n(y1)}), module B has mass ${n(m2)} kg at (${n(x2)}, ${n(y2)}), and module C has mass ${n(m3)} kg at (${n(x3)}, ${n(y3)}). Treat each module as a point at its position. Enter the x coordinate of the centre of mass, then its y coordinate, both in metres to 2 decimal places.`,
   answer: [rd(X), rd(Y)],
   hints: ['The centre of mass is a mass-weighted average: multiply each position by its mass, add the products, and divide by the total mass.', 'Work out x and y separately, and keep the signs of negative coordinates.'],
   solution: `Total mass M = ${n(m1)} + ${n(m2)} + ${n(m3)} = ${n(M)} kg. Σmx = ${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)} + ${n(m3)} × ${par(x3)} = ${n(Sx)} kg·m, so x = ${n(Sx)} ÷ ${n(M)} ${eq(X)} ${n(rd(X))} m. Σmy = ${n(m1)} × ${par(y1)} + ${n(m2)} × ${par(y2)} + ${n(m3)} × ${par(y3)} = ${n(Sy)} kg·m, so y = ${n(Sy)} ÷ ${n(M)} ${eq(Y)} ${n(rd(Y))} m. The centre of mass is at ${exact(X) && exact(Y) ? '' : 'about '}(${n(rd(X))}, ${n(rd(Y))}).`,
   guidance: [
    { prompt: `What is the total mass of the three modules, in kg?`, answer: [M], explanation: `${n(m1)} + ${n(m2)} + ${n(m3)} = ${n(M)} kg.` },
    { prompt: `Multiply each module’s x coordinate by its mass and add. What is Σmx, in kg·m?`, answer: [Sx], explanation: `${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)} + ${n(m3)} × ${par(x3)} = ${n(Sx)} kg·m.` },
    { prompt: `Divide Σmx by the total mass. What is the x coordinate of the centre of mass, in metres to 2 decimal places?`, answer: [rd(X)], explanation: `${n(Sx)} ÷ ${n(M)} ${eq(X)} ${n(rd(X))} m.` },
    { prompt: `Do the same with the y coordinates. What is the y coordinate of the centre of mass, in metres to 2 decimal places?`, answer: [rd(Y)], explanation: `Σmy = ${n(Sy)} kg·m, and ${n(Sy)} ÷ ${n(M)} ${eq(Y)} ${n(rd(Y))} m.` }
   ] }; }
 },
 /* A flywheel at N rpm (a multiple of 30 from 60 to 600), rim radius r, for t seconds with a whole number of turns.
    ω = Nπ/30 is printed as a multiple of π. Not the worked example (120 rpm, 0.5 m, 10 s). */
 q35: {
  canonical: { N: 150, r: 0.4, t: 12 },
  draw: R => tryDraw(R, R => ({ N: 30 * R.int(2, 20), r: R.int(2, 15) / 10, t: R.int(2, 30) }),
   p => (p.N * p.t) % 60 === 0 && offTie(p.N * Math.PI / 30) && offTie(p.N * Math.PI / 30 * p.r) && !(p.N === 120 && p.r === 0.5 && p.t === 10), { N: 150, r: 0.4, t: 12 }),
  build: ({ N, r, t }) => { const k = N / 30, w = k * Math.PI, v = w * r, perS = N / 60, turns = perS * t; return {
   prompt: `A flywheel in the vault spins at a steady ${n(N)} revolutions per minute (rpm). A point on its rim is ${n(r)} m from the axle. Enter the flywheel’s angular velocity ω in radians per second, then the speed of the rim point in metres per second, both to 2 decimal places (use the unrounded ω for the speed), then the number of turns the flywheel makes in ${n(t)} seconds.`,
   answer: [rd(w), rd(v), turns],
   hints: ['One turn is 2π radians and one minute is 60 seconds, so multiply the rpm by 2π and divide by 60 to get radians per second.', 'A point at distance r from the axle moves at v = ωr. The number of turns is the turns per second times the time.'],
   solution: `ω = ${n(N)} × 2π ÷ 60 = ${n(k)}π ≈ ${n(rd(w))} rad/s. The rim speed is v = ωr = ${n(k)}π × ${n(r)} ≈ ${n(rd(v))} m/s. The flywheel makes ${n(N)} ÷ 60 = ${n(perS)} turns each second, so in ${n(t)} s it makes ${n(perS)} × ${n(t)} = ${n(turns)} turns, and its angular position changes by ${n(2 * turns)}π radians.`,
   guidance: [
    { prompt: `Turn ${n(N)} rpm into radians per second: multiply by 2π and divide by 60. What is ω, to 2 decimal places?`, answer: [rd(w)], explanation: `${n(N)} × 2π ÷ 60 = ${n(k)}π ≈ ${n(rd(w))} rad/s.` },
    { prompt: `The rim point is ${n(r)} m from the axle. What is its speed v = ωr, in m/s to 2 decimal places?`, answer: [rd(v)], explanation: `v = ${n(k)}π × ${n(r)} ≈ ${n(rd(v))} m/s. Points nearer the axle have the same ω but move more slowly.` },
    { prompt: `The flywheel makes ${n(N)} ÷ 60 turns each second. How many turns does it make in ${n(t)} s?`, answer: [turns], explanation: `${n(perS)} × ${n(t)} = ${n(turns)} turns.` }
   ] }; }
 },
 /* Three point masses (2–12 kg) at radii 0.2–1.5 m on a light frame, spinning at an even ω (so ½ω² is whole and K has
    at most 2 decimals). The radii differ. Not the worked example (two masses). */
 q36: {
  canonical: { m1: 4, r1: 0.5, m2: 6, r2: 0.8, m3: 3, r3: 1.2, w: 10 },
  draw: R => tryDraw(R, R => ({ m1: R.int(2, 12), r1: R.int(2, 15) / 10, m2: R.int(2, 12), r2: R.int(2, 15) / 10, m3: R.int(2, 12), r3: R.int(2, 15) / 10, w: 2 * R.int(1, 6) }),
   p => new Set([p.r1, p.r2, p.r3]).size === 3, { m1: 4, r1: 0.5, m2: 6, r2: 0.8, m3: 3, r3: 1.2, w: 10 }),
  build: ({ m1, r1, m2, r2, m3, r3, w }) => { const a = m1 * r1 * r1, b = m2 * r2 * r2, c = m3 * r3 * r3, I = a + b + c, K = I * w * w / 2; return {
   prompt: `To store energy, three steel weights are bolted to a light spoke frame that turns on the flywheel axle: ${n(m1)} kg at ${n(r1)} m from the axle, ${n(m2)} kg at ${n(r2)} m and ${n(m3)} kg at ${n(r3)} m. Treat each weight as a point and ignore the frame’s own mass. The frame spins at ${n(w)} rad/s. Enter the moment of inertia about the axle in kilogram square metres (kg·m²), then the rotational kinetic energy in joules (type the numbers without commas).`,
   answer: [I, K],
   hints: ['The moment of inertia of point masses is I = Σmr²: square each distance from the axle before multiplying by its mass.', 'The rotational kinetic energy is K = ½Iω², with ω in radians per second.'],
   solution: `I = ${n(m1)} × ${n(r1)}² + ${n(m2)} × ${n(r2)}² + ${n(m3)} × ${n(r3)}² = ${n(a)} + ${n(b)} + ${n(c)} = ${n(I)} kg·m². K = ½ × ${n(I)} × ${n(w)}² = ${n(K)} J.`,
   guidance: [
    { prompt: `What does the first weight add to the moment of inertia, ${n(m1)} × ${n(r1)}², in kg·m²?`, answer: [a], explanation: `${n(r1)}² = ${n(r1 * r1)}, and ${n(m1)} × ${n(r1 * r1)} = ${n(a)} kg·m².` },
    { prompt: `Add the three terms mr². What is the moment of inertia I, in kg·m²?`, answer: [I], explanation: `${n(a)} + ${n(b)} + ${n(c)} = ${n(I)} kg·m².` },
    { prompt: `What is the rotational kinetic energy ½Iω² at ${n(w)} rad/s, in joules?`, answer: [K], explanation: `½ × ${n(I)} × ${n(w * w)} = ${n(K)} J.` }
   ] }; }
 },
 /* A pull of F newtons on a spanner r metres from the axle, at an angle aπ/b to the spanner, turning a flywheel of
    moment of inertia I. The lever arm, torque and α are rounded to 2 decimals, off ties.
    Not the worked example (50 N, 0.4 m, π/2, 5 kg·m²). */
 q37: {
  canonical: { F: 80, r: 0.5, a: 1, b: 3, I: 8 },
  draw: R => tryDraw(R, R => { const [a, b] = R.pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6]]); return { F: 10 * R.int(2, 20), r: R.int(2, 10) / 10, a, b, I: R.int(2, 30) }; },
   p => { const s = Math.sin(p.a * Math.PI / p.b), tau = p.r * p.F * s; return offTie(p.r * s) && offTie(tau) && offTie(tau / p.I) && !(p.F === 50 && p.r === 0.4 && p.a === 1 && p.b === 2 && p.I === 5); },
   { F: 80, r: 0.5, a: 1, b: 3, I: 8 }),
  build: ({ F, r, a, b, I }) => { const ang = piText(a, b), s = Math.sin(a * Math.PI / b), arm = r * s, tau = r * F * s, al = tau / I; return {
   prompt: `A technician turns a flywheel by pulling on a spanner clamped to its hub. She pulls with a force of ${n(F)} N at a point on the spanner ${n(r)} m from the axle, and the angle between the spanner and her pull is ${ang} radians. The flywheel’s moment of inertia about the axle is ${n(I)} kg·m², and no other torque acts on it. Enter the torque about the axle in newton metres (N·m), then the flywheel’s angular acceleration in radians per second squared (rad/s²), both to 2 decimal places (use the unrounded torque for the second).`,
   answer: [rd(tau), rd(al)],
   hints: ['Torque is τ = rF sin θ, where θ is the angle between the line from the axle and the force. Only the part of the pull at right angles to the spanner turns it.', 'Newton’s second law for rotation is τ = Iα, so α = τ ÷ I.'],
   solution: `The lever arm is r sin θ = ${n(r)} × sin(${ang}) ${eq(arm)} ${n(rd(arm))} m. The torque is τ = rF sin θ = ${n(r)} × ${n(F)} × sin(${ang}) ${eq(tau)} ${n(rd(tau))} N·m. Then α = τ ÷ I = τ ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².`,
   guidance: [
    { prompt: `What is the lever arm r sin θ, the distance from the axle to the line of the pull, in metres to 2 decimal places?`, answer: [rd(arm)], explanation: `${n(r)} × sin(${ang}) ${eq(arm)} ${n(rd(arm))} m.` },
    { prompt: `Multiply the unrounded lever arm, r sin θ (not the 2-decimal value), by the force. What is the torque, in N·m to 2 decimal places?`, answer: [rd(tau)], explanation: `τ = ${n(r)} × ${n(F)} × sin(${ang}) ${eq(tau)} ${n(rd(tau))} N·m.` },
    { prompt: `Divide the torque by the moment of inertia, ${n(I)} kg·m². What is the angular acceleration, in rad/s² to 2 decimal places?`, answer: [rd(al)], explanation: `α = τ ÷ I = τ ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².` }
   ] }; }
 },
 /* Flywheel A (IA, w1) and a resting wheel B (IB) lock together on one axle. The common ω and the energy lost are
    rounded to 2 decimals, off ties. Not the worked example (10, 20, 10). */
 q38: {
  canonical: { IA: 15, w1: 40, IB: 7 },
  draw: R => tryDraw(R, R => ({ IA: R.int(4, 40), w1: R.int(5, 60), IB: R.int(2, 30) }),
   p => { const I2 = p.IA + p.IB, w2 = p.IA * p.w1 / I2, lost = p.IA * p.w1 * p.w1 / 2 - I2 * w2 * w2 / 2; return offTie(w2) && offTie(lost) && offTie(I2 * w2 * w2 / 2) && !(p.IA === 10 && p.w1 === 20 && p.IB === 10); },
   { IA: 15, w1: 40, IB: 7 }),
  build: ({ IA, w1, IB }) => { const L = IA * w1, I2 = IA + IB, w2 = L / I2, K1 = IA * w1 * w1 / 2, K2 = L * L / (2 * I2), lost = K1 - K2; return {
   prompt: `Flywheel A, with moment of inertia ${n(IA)} kg·m², spins freely at ${n(w1)} rad/s. Wheel B, with moment of inertia ${n(IB)} kg·m² and not turning, is dropped onto the same axle. Friction between the two makes them lock together and spin as one, and no outside torque acts about the axle. Enter the angular momentum of A before the drop in kg·m²/s, then the common angular velocity afterwards in rad/s, then the rotational kinetic energy lost in joules; give the last two to 2 decimal places (use the unrounded angular velocity for the energy) and type the numbers without commas.`,
   answer: [L, rd(w2), rd(lost)],
   hints: ['Angular momentum is L = Iω. With no outside torque, the total angular momentum before equals the total after.', 'Locked together, the two wheels have a moment of inertia equal to the sum of theirs. Compare ½Iω² before and after for the energy.'],
   solution: `L = ${n(IA)} × ${n(w1)} = ${n(L)} kg·m²/s, and B has none. Locked together, I = ${n(IA)} + ${n(IB)} = ${n(I2)} kg·m², so ω = ${n(L)} ÷ ${n(I2)} ${eq(w2)} ${n(rd(w2))} rad/s. Kinetic energy before: ½ × ${n(IA)} × ${n(w1)}² = ${n(K1)} J. After: ½ × ${n(I2)} × ω² = ${n(L)}² ÷ (2 × ${n(I2)}) ${eq(K2)} ${n(rd(K2))} J. Lost: ${n(K1)} − ${n(rd(K2))} = ${n(rd(lost))} J, turned into heat by the friction between the wheels.`,
   guidance: [
    { prompt: `What is the angular momentum of flywheel A before the drop, in kg·m²/s?`, answer: [L], explanation: `L = Iω = ${n(IA)} × ${n(w1)} = ${n(L)} kg·m²/s.` },
    { prompt: `What is the moment of inertia of the two wheels locked together, in kg·m²?`, answer: [I2], explanation: `${n(IA)} + ${n(IB)} = ${n(I2)} kg·m².` },
    { prompt: `Angular momentum is kept. What is the common angular velocity, in rad/s to 2 decimal places?`, answer: [rd(w2)], explanation: `ω = ${n(L)} ÷ ${n(I2)} ${eq(w2)} ${n(rd(w2))} rad/s.` },
    { prompt: `Rotational kinetic energy before is ½ × ${n(IA)} × ${n(w1)}². How much is lost, in joules to 2 decimal places?`, answer: [rd(lost)], explanation: `${n(K1)} J before and ${n(L)}² ÷ (2 × ${n(I2)}) ${eq(K2)} ${n(rd(K2))} J after, so about ${n(rd(lost))} J is lost.` }
   ] }; }
 },
 /* A circular orbit at height h km above a planet of radius R km and mass mant × 10^ex kg. Speed to the nearest m/s
    and period to 2 decimal places of a minute, both off ties. */
 q39: {
  canonical: { mant: 6, ex: 24, R: 6400, h: 400 },
  draw: R => tryDraw(R, R => ({ mant: R.int(10, 99) / 10, ex: R.pick([23, 24]), R: 100 * R.int(20, 70), h: 50 * R.int(2, 20) }),
   p => { const r = (p.R + p.h) * 1000, v = Math.sqrt(6.67e-11 * p.mant * Math.pow(10, p.ex) / r), T = 2 * Math.PI * r / v / 60; return offTie(v, 0) && offTie(T); },
   { mant: 6, ex: 24, R: 6400, h: 400 }),
  build: ({ mant, ex, R, h }) => { const rk = R + h, r = rk * 1000, gm = 6.67 * mant, GM = 6.67e-11 * mant * Math.pow(10, ex), v = Math.sqrt(GM / r), Ts = 2 * Math.PI * r / v, T = Ts / 60; return {
   prompt: `A survey satellite circles the outpost’s planet in a circular orbit. The planet has mass ${n(mant)} × 10${sup(ex)} kg and radius ${n(R)} km, and the satellite flies ${n(h)} km above the surface. Take G = 6.67 × 10⁻¹¹ N·m²/kg², and measure the orbit’s radius r from the planet’s centre. Enter the orbital speed in metres per second, to the nearest whole number, then the orbital period in minutes, to 2 decimal places (use the unrounded speed for the period; type the numbers without commas).`,
   answer: [rd(v, 0), rd(T)],
   hints: ['Gravity, GMm ÷ r², supplies the centripetal force mv² ÷ r, so v = √(GM ÷ r), with r in metres.', 'The period is the time for one lap of the circle: T = 2πr ÷ v in seconds; divide by 60 for minutes.'],
   solution: `r = ${n(R)} km + ${n(h)} km = ${n(rk)} km = ${n(rk)} × 1000 m. GM = 6.67 × 10⁻¹¹ × ${n(mant)} × 10${sup(ex)} = ${n(gm)} × 10${sup(ex - 11)} m³/s². v = √(GM ÷ r) ≈ ${n(rd(v, 1))} m/s, which is ${n(rd(v, 0))} m/s to the nearest whole number. T = 2πr ÷ v ≈ ${n(rd(Ts, 1))} s, and dividing by 60 gives about ${n(rd(T))} minutes.`,
   guidance: [
    { prompt: `The orbit’s radius is measured from the planet’s centre. What is r, in kilometres?`, answer: [rk], explanation: `r = ${n(R)} + ${n(h)} = ${n(rk)} km, which is ${n(rk)} × 1000 m for the formula.` },
    { prompt: `Gravity supplies the centripetal force, so v = √(GM ÷ r) with r in metres. What is the orbital speed, in m/s to the nearest whole number?`, answer: [rd(v, 0)], explanation: `GM = ${n(gm)} × 10${sup(ex - 11)} m³/s², and √(GM ÷ r) ≈ ${n(rd(v, 1))}, so v ≈ ${n(rd(v, 0))} m/s.` },
    { prompt: `One lap is 2πr long. What is the period T = 2πr ÷ v, in minutes to 2 decimal places?`, answer: [rd(T)], explanation: `2πr ÷ v ≈ ${n(rd(Ts, 1))} s, and ÷ 60 gives about ${n(rd(T))} minutes.` }
   ] }; }
 },
 /* A (m1, east at v1) and B (m2, north at v2) latch; the pair coasts up a frictionless ramp. The velocity components
    have at most 2 decimals; the speed and the height are rounded to 2 decimals, off ties. */
 q40: {
  canonical: { m1: 400, v1: 3, m2: 100, v2: 6 },
  draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), v1: R.int(2, 12) / 2, m2: 100 * R.int(1, 8), v2: R.int(2, 12) / 2 }),
   p => { const M = p.m1 + p.m2, vx = p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M, s2 = vx * vx + vy * vy; return exact(vx) && exact(vy) && vx !== vy && offTie(Math.sqrt(s2)) && offTie(s2 / (2 * g)); },
   { m1: 400, v1: 3, m2: 100, v2: 6 }),
  build: ({ m1, v1, m2, v2 }) => { const M = m1 + m2, px = m1 * v1, py = m2 * v2, vx = px / M, vy = py / M, s2 = vx * vx + vy * vy, s = Math.sqrt(s2), hh = s2 / (2 * g); return {
   prompt: `On the docking floor, module A (${n(m1)} kg) slides east at ${n(v1)} m/s and module B (${n(m2)} kg) slides north at ${n(v2)} m/s. Take east as the x direction and north as the y direction. They meet, latch together and slide on as one, with no outside force along the floor. The pair then coasts up a frictionless ramp until it stops. Take g = 9.8 m/s². Enter the speed of the pair just after latching in metres per second, then the height it climbs in metres, both to 2 decimal places (use the unrounded speed for the height).`,
   answer: [rd(s), rd(hh)],
   hints: ['Momentum is kept in each direction separately: the x momentum of A alone becomes the x momentum of the pair, and the y momentum of B alone becomes its y momentum.', 'The speed is √(vx² + vy²). On the frictionless ramp all the kinetic energy becomes potential energy, so ½Mv² = Mgh.'],
   solution: `In x: ${n(m1)} × ${n(v1)} = ${n(px)} kg·m/s, so vx = ${n(px)} ÷ ${n(M)} = ${n(vx)} m/s. In y: ${n(m2)} × ${n(v2)} = ${n(py)} kg·m/s, so vy = ${n(py)} ÷ ${n(M)} = ${n(vy)} m/s. The speed is √(${n(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s. On the ramp ½Mv² = Mgh, so h = v² ÷ (2 × 9.8) = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m.`,
   guidance: [
    { prompt: `Only A moves in the x direction before the collision. What is the pair’s velocity component vx just after latching, in m/s?`, answer: [vx], explanation: `vx = ${n(m1)} × ${n(v1)} ÷ ${n(M)} = ${n(px)} ÷ ${n(M)} = ${n(vx)} m/s.` },
    { prompt: `Only B moves in the y direction. What is the pair’s velocity component vy, in m/s?`, answer: [vy], explanation: `vy = ${n(m2)} × ${n(v2)} ÷ ${n(M)} = ${n(py)} ÷ ${n(M)} = ${n(vy)} m/s.` },
    { prompt: `Combine the two components. What is the speed of the pair, in m/s to 2 decimal places?`, answer: [rd(s)], explanation: `√(${n(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s.` },
    { prompt: `All of the pair’s kinetic energy becomes potential energy on the frictionless ramp. What height does it climb, in metres to 2 decimal places?`, answer: [rd(hh)], explanation: `½Mv² = Mgh, so h = v² ÷ 19.6 = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m.` }
   ] }; }
 }
});
})();
