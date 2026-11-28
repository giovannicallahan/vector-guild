/* Mechanics: motion and force mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const g = 9.8;
/* r2 rounds to 2 decimal places; f2 prints that; s4 prints a sine or cosine to 4 places for the working. */
const r2 = x => Math.round(x * 100) / 100, f2 = x => n(r2(x)), s4 = x => n(Math.round(x * 1e4) / 1e4);
/* A value is safe to ask to 2 decimal places when it is not near a rounding tie (…5 in the third place). */
const safe = (...xs) => xs.every(x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) > 0.02; });
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canonical }; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
const oneDec = x => Math.abs(x * 10 - Math.round(x * 10)) < 1e-7;

/* q21: weight w = mg split along a ramp at θ radians: w sin θ along, w cos θ across (balanced by N). */
const q21v = ({ m, th }) => { const w = G.tidy(m * g); return { w, along: w * Math.sin(th), normal: w * Math.cos(th) }; };
/* q22: crate set down at rest on a ramp; it holds when mg sin θ ≤ μs N, otherwise kinetic friction μk N acts. */
const q22v = ({ m, th, us, uk }) => { const w = G.tidy(m * g), N = w * Math.cos(th), along = w * Math.sin(th), fsMax = us * N, holds = along <= fsMax;
 const fr = holds ? along : uk * N, a = holds ? 0 : (along - uk * N) / m; return { w, N, along, fsMax, holds, fr, a }; };
/* q23: crate m1 up a ramp with kinetic friction, cable over a pulley to a hanging m2. Up the ramp is positive. */
const q23v = ({ m1, m2, th, uk }) => { const along = m1 * g * Math.sin(th), fk = uk * m1 * g * Math.cos(th), w2 = G.tidy(m2 * g), a = (w2 - along - fk) / (m1 + m2); return { along, fk, w2, a, T: m2 * (g - a) }; };
/* q24: flat curve, static friction gives the centripetal force: F = mv²/r, greatest speed √(μs g r). */
const q24v = ({ m, r, v, us }) => { const ac = v * v / r, F = m * ac, fmax = G.tidy(us * m * g), vmax = Math.sqrt(us * g * r); return { ac, F, fmax, vmax }; };
/* q25: drag D = bv²; acceleration g − D/m downward; terminal speed √(mg/b). */
const q25v = ({ m, b, v }) => { const w = G.tidy(m * g), D = b * v * v, a = g - D / m, vT = Math.sqrt(w / b); return { w, D, a, vT }; };
/* q26: W1 = Fd cos θ; W2 = ∫ (cx² + kx) dx from x1 to x2 = [cx³/3 + kx²/2]. */
const q26v = ({ F, d, th, c, k, x1, x2 }) => { const Fx = F * Math.cos(th), W1 = Fx * d, A = x => c * x * x * x / 3 + k * x * x / 2; return { Fx, W1, A2: A(x2), A1: A(x1), W2: A(x2) - A(x1) }; };
/* q27: K0 = ½mv0², Kf = K0 + W (work-energy theorem), vf = √(2Kf/m). */
const q27v = ({ m, v0, W }) => { const K0 = m * v0 * v0 / 2, Kf = K0 + W; return { K0, Kf, vf: Math.sqrt(2 * Kf / m) }; };
/* q28: steady lift: force mg, work mgh, average power mgh/t; a P2-kilowatt winch takes mgh/(1000 P2). */
const q28v = ({ m, h, t, P2 }) => { const w = G.tidy(m * g), W = G.tidy(w * h); return { w, W, P: W / t, t2: W / (1000 * P2) }; };
/* q29: F is built from the drawn end speed vf, so vf² = 2d(F − μk mg)/m exactly. */
const q29F = ({ m, d, vf, uk }) => G.tidy(m * vf * vf / (2 * d) + uk * m * g);
const q29v = p => { const F = q29F(p), Ww = G.tidy(F * p.d), fk = G.tidy(p.uk * p.m * g), Wf = G.tidy(-fk * p.d), Wn = G.tidy(Ww + Wf); return { F, Ww, fk, Wf, Wn, P: G.tidy(F * p.vf) }; };
/* q30: U = mgy with zero at the floor; spring U = ½kx²; work by gravity on the way down = −ΔU. */
const q30v = ({ m, h1, h2, k, x }) => { const U1 = G.tidy(m * g * h1), U2 = G.tidy(m * g * h2); return { U1, U2, Wg: G.tidy(U1 - U2), Us: G.tidy(k * x * x / 2) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 q21: {
  canonical: { m: 80, th: 0.4 },
  /* Mass 20 to 150 kg in fives, angle 0.2 to 0.9 rad. Not the worked example (50 kg, 0.3 rad); no rounding ties. */
  draw: R => tryDraw(() => ({ m: 5 * R.int(4, 30), th: R.int(4, 18) / 20 }), p => !same(p, { m: 50, th: 0.3 }) && (() => { const v = q21v(p); return safe(v.along, v.normal); })(), { m: 80, th: 0.4 }),
  build: p => { const { m, th } = p, { w, along, normal } = q21v(p), sn = Math.sin(th), cs = Math.cos(th); return {
   prompt: `A cargo sled of mass ${n(m)} kg sits on the loading ramp of the Crane Yard, which rises at ${n(th)} radians above the horizontal. A cable laid along the ramp holds it still. The only forces across the ramp are the sled’s weight and the normal force from the ramp. Take g = 9.8 m/s². Enter the part of the sled’s weight that points down along the ramp, then the normal force, both in newtons to 2 decimal places. Type the numbers without commas.`,
   answer: [r2(along), r2(normal)],
   hints: ['Turn your axes to match the inclined plane: one axis points down along the ramp, the other straight out of its surface. The angle between the weight and the line straight into the ramp is the ramp’s own angle.', 'The part of the weight along the ramp is w sin θ and the part pressing into the ramp is w cos θ. Nothing moves across the ramp, so the normal force is exactly as large as the part pressing in.'],
   solution: `The weight is w = mg = ${n(m)} × 9.8 = ${n(w)} N. With the ramp angle θ = ${n(th)} radians, sin θ ≈ ${s4(sn)} and cos θ ≈ ${s4(cs)}. Along the ramp: w sin θ = ${n(w)} × sin ${n(th)} ≈ ${f2(along)} N. Into the ramp: w cos θ = ${n(w)} × cos ${n(th)} ≈ ${f2(normal)} N. Nothing moves across the ramp, so the normal force balances that part: N ≈ ${f2(normal)} N.`,
   guidance: [
    { prompt: `First the whole weight. What is w = mg for the ${n(m)} kg sled, in newtons?`, answer: [w], explanation: `w = ${n(m)} × 9.8 = ${n(w)} N, pointing straight down.` },
    { prompt: `The ramp rises at θ = ${n(th)} radians. The part of the weight along the ramp is w sin θ. What is it, in newtons to 2 decimal places?`, answer: [r2(along)], explanation: `sin ${n(th)} ≈ ${s4(sn)}, so w sin θ = ${n(w)} × sin ${n(th)} ≈ ${f2(along)} N.` },
    { prompt: `The part pressing into the ramp is w cos θ, and the normal force balances it. What is the normal force, in newtons to 2 decimal places?`, answer: [r2(normal)], explanation: `cos ${n(th)} ≈ ${s4(cs)}, so N = w cos θ = ${n(w)} × cos ${n(th)} ≈ ${f2(normal)} N.` }
   ] }; }
 },
 q22: {
  canonical: { m: 60, th: 0.6, us: 0.6, uk: 0.45 },
  /* Mass 10 to 120 kg, angle 0.2 to 0.8 rad, μs 0.3 to 0.9, μk 0.1 to 0.3 below μs. tan θ is kept at least 0.03 from μs so the
     case is clear; both cases come up. Not the worked example (40 kg, 0.3 rad, 0.5, 0.3). */
  draw: R => tryDraw(() => { const us = R.int(3, 9) / 10; return { m: 5 * R.int(2, 24), th: R.int(4, 16) / 20, us, uk: G.tidy(Math.max(0.1, us - R.int(1, 3) / 10)) }; },
   p => { if (same(p, { m: 40, th: 0.3, us: 0.5, uk: 0.3 }) || p.uk >= p.us || Math.abs(Math.tan(p.th) - p.us) < 0.03) return false; const v = q22v(p); return safe(v.N, v.fsMax, v.along, v.fr, v.a); }, { m: 60, th: 0.6, us: 0.6, uk: 0.45 }),
  build: p => { const { m, th, us, uk } = p, v = q22v(p); return {
   prompt: `A crate of mass ${n(m)} kg is set down at rest on a steel ramp in the Crane Yard that rises at ${n(th)} radians. Between the crate and the ramp the coefficient of static friction is μs = ${n(us)} and the coefficient of kinetic friction is μk = ${n(uk)}. Only gravity, the normal force and friction act on the crate. Take g = 9.8 m/s². Enter the size of the friction force on the crate in newtons, then the crate’s acceleration down the ramp in m/s² (enter 0 if it stays at rest), both to 2 decimal places. Type the numbers without commas.`,
   answer: [r2(v.fr), r2(v.a)],
   hints: ['Find the normal force first, N = mg cos θ. Static friction can grip with any force up to μs N, and no more.', 'Compare the pull of gravity along the ramp, mg sin θ, with μs N. If the pull is smaller, static friction matches it exactly and the crate stays put. If it is larger, the crate slides, kinetic friction μk N acts up the ramp, and a = (mg sin θ − μk N) ÷ m. Keep full precision until the end.'],
   solution: `N = mg cos θ = ${n(v.w)} × cos ${n(th)} ≈ ${f2(v.N)} N. The greatest static friction is μs N ≈ ${n(us)} × ${f2(v.N)} ≈ ${f2(v.fsMax)} N. The pull along the ramp is mg sin θ = ${n(v.w)} × sin ${n(th)} ≈ ${f2(v.along)} N. ` + (v.holds
    ? `That is less than ${f2(v.fsMax)} N, so static friction holds the crate. It pushes up the ramp exactly as hard as gravity pulls down it: the friction force is ≈ ${f2(v.fr)} N, and the acceleration is 0 m/s².`
    : `That is more than ${f2(v.fsMax)} N, so the crate slides. Kinetic friction then acts up the ramp: μk N ≈ ${n(uk)} × ${f2(v.N)} ≈ ${f2(v.fr)} N. The net force down the ramp is ≈ ${f2(v.along - v.fr)} N, so a = net force ÷ m ≈ ${f2(v.along - v.fr)} ÷ ${n(m)} ≈ ${f2(v.a)} m/s².`),
   guidance: [
    { prompt: `What is the normal force N = mg cos θ on the crate, in newtons to 2 decimal places?`, answer: [r2(v.N)], explanation: `N = ${n(m)} × 9.8 × cos ${n(th)} ≈ ${f2(v.N)} N.` },
    { prompt: `What is the greatest force static friction can give, μs N, in newtons to 2 decimal places?`, answer: [r2(v.fsMax)], explanation: `μs N ≈ ${n(us)} × ${f2(v.N)} ≈ ${f2(v.fsMax)} N. Static friction can be anything up to this, never more.` },
    { prompt: `What is the pull of gravity along the ramp, mg sin θ, in newtons to 2 decimal places?`, answer: [r2(v.along)], explanation: `mg sin θ = ${n(v.w)} × sin ${n(th)} ≈ ${f2(v.along)} N. ` + (v.holds ? `That is less than ${f2(v.fsMax)} N, so static friction can hold the crate.` : `That is more than ${f2(v.fsMax)} N, so static friction cannot hold the crate and it slides.`) },
    { prompt: `So what is the size of the friction force on the crate, in newtons to 2 decimal places?`, answer: [r2(v.fr)], explanation: v.holds ? `The crate stays at rest, so static friction exactly balances the pull along the ramp: ≈ ${f2(v.fr)} N.` : `The crate slides, so kinetic friction acts: μk N ≈ ${n(uk)} × ${f2(v.N)} ≈ ${f2(v.fr)} N.` },
    { prompt: `What is the crate’s acceleration down the ramp, in m/s² to 2 decimal places?`, answer: [r2(v.a)], explanation: v.holds ? `The forces along the ramp balance, so the acceleration is 0 m/s².` : `a = (mg sin θ − μk N) ÷ m ≈ ${f2(v.along - v.fr)} ÷ ${n(m)} ≈ ${f2(v.a)} m/s².` }
   ] }; }
 },
 q23: {
  canonical: { m1: 40, m2: 35, th: 0.5, uk: 0.3 },
  /* Crate 20 to 100 kg, counterweight 10 to 80 kg, angle 0.1 to 0.6 rad, μk 0.1 to 0.5; acceleration between 0.3 and 6 m/s².
     Not the worked example (30 kg, 25 kg, 0.4 rad, 0.2). */
  draw: R => tryDraw(() => ({ m1: 5 * R.int(4, 20), m2: 5 * R.int(2, 16), th: R.int(2, 12) / 20, uk: R.int(1, 5) / 10 }),
   p => { if (same(p, { m1: 30, m2: 25, th: 0.4, uk: 0.2 })) return false; const v = q23v(p); return v.a >= 0.3 && v.a <= 6 && safe(v.along, v.fk, v.a, v.T); }, { m1: 40, m2: 35, th: 0.5, uk: 0.3 }),
  build: p => { const { m1, m2, th, uk } = p, v = q23v(p), net = v.w2 - v.along - v.fk; return {
   prompt: `In the Crane Yard a crate of mass ${n(m1)} kg sits on a ramp that rises at ${n(th)} radians. A cable runs from the crate up the ramp, over a pulley at the top, and straight down to a hanging counterweight of mass ${n(m2)} kg. The crate is already sliding up the ramp, and the coefficient of kinetic friction between the crate and the ramp is μk = ${n(uk)}. The cable has no mass and does not stretch, and the pulley turns without friction, so the tension is the same all along the cable and both bodies share one acceleration. Take g = 9.8 m/s² and take the crate’s motion up the ramp (and the counterweight’s motion down) as positive. Enter the acceleration in m/s², then the tension in the cable in newtons, both to 2 decimal places.`,
   answer: [r2(v.a), r2(v.T)],
   hints: ['Draw a free-body diagram for each body. Along the ramp the crate feels the tension up the slope, and both the pull of gravity along the ramp and kinetic friction down it, because it is moving up. The counterweight feels its weight down and the tension up.', 'Add Newton’s second law for the two bodies: the tension cancels, leaving (m2 g − m1 g sin θ − μk m1 g cos θ) = (m1 + m2) a. Then use the counterweight alone, m2 g − T = m2 a, to find T.'],
   solution: `Crate, along the ramp: gravity pulls down the slope with m1 g sin θ = ${n(m1)} × 9.8 × sin ${n(th)} ≈ ${f2(v.along)} N, and kinetic friction μk m1 g cos θ = ${n(uk)} × ${n(m1)} × 9.8 × cos ${n(th)} ≈ ${f2(v.fk)} N also acts down the slope. Counterweight: its weight is m2 g = ${n(v.w2)} N. Adding the two equations of Newton’s second law, the tension cancels: (m1 + m2) a = ${n(v.w2)} − ${f2(v.along)} − ${f2(v.fk)} ≈ ${f2(net)} N, so a ≈ ${f2(net)} ÷ ${n(m1 + m2)} ≈ ${f2(v.a)} m/s². For the counterweight, m2 g − T = m2 a, so T = m2 (g − a) ≈ ${n(m2)} × (9.8 − ${f2(v.a)}) ≈ ${f2(v.T)} N.`,
   guidance: [
    { prompt: `What is the pull of gravity on the crate along the ramp, m1 g sin θ, in newtons to 2 decimal places?`, answer: [r2(v.along)], explanation: `m1 g sin θ = ${n(m1)} × 9.8 × sin ${n(th)} ≈ ${f2(v.along)} N, down the slope.` },
    { prompt: `The crate moves up the ramp, so kinetic friction acts down it. What is μk m1 g cos θ, in newtons to 2 decimal places?`, answer: [r2(v.fk)], explanation: `The normal force is m1 g cos θ, so friction is ${n(uk)} × ${n(m1)} × 9.8 × cos ${n(th)} ≈ ${f2(v.fk)} N.` },
    { prompt: `What is the counterweight’s weight m2 g, in newtons?`, answer: [v.w2], explanation: `m2 g = ${n(m2)} × 9.8 = ${n(v.w2)} N.` },
    { prompt: `The net force on the pair is m2 g minus the two forces down the slope, and it moves the total mass m1 + m2. What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(v.a)], explanation: `a = (${n(v.w2)} − ${f2(v.along)} − ${f2(v.fk)}) ÷ ${n(m1 + m2)} ≈ ${f2(net)} ÷ ${n(m1 + m2)} ≈ ${f2(v.a)} m/s².` },
    { prompt: `For the counterweight alone, m2 g − T = m2 a. What is the tension T, in newtons to 2 decimal places?`, answer: [r2(v.T)], explanation: `T = m2 (g − a) ≈ ${n(m2)} × (9.8 − ${f2(v.a)}) ≈ ${f2(v.T)} N. It is less than the counterweight’s weight because the counterweight is speeding up on its way down.` }
   ] }; }
 },
 q24: {
  canonical: { m: 600, r: 40, v: 9, us: 0.5 },
  /* Rover 200 to 1200 kg, radius 20 to 150 m, μs 0.3 to 0.9, speed a whole number at least 4 m/s and at least 1 m/s below the
     greatest safe speed. Not the worked example (800 kg, 50 m, 10 m/s, 0.4). */
  draw: R => tryDraw(() => { const us = R.int(3, 9) / 10, r = 5 * R.int(4, 30), top = Math.floor(Math.sqrt(us * g * r) - 1); return { m: 50 * R.int(4, 24), r, v: R.int(4, Math.max(4, top)), us }; },
   p => { if (same(p, { m: 800, r: 50, v: 10, us: 0.4 })) return false; const v = q24v(p); return p.v <= v.vmax - 1 && safe(v.ac, v.F, v.vmax); }, { m: 600, r: 40, v: 9, us: 0.5 }),
  build: p => { const { m, r, v, us } = p, x = q24v(p); return {
   prompt: `A test rover of mass ${n(m)} kg drives at a steady ${n(v)} m/s round a flat circular track of radius ${n(r)} m beside the Engine Hall. Only static friction between the tyres and the track pulls the rover towards the centre of the circle, and the coefficient of static friction is μs = ${n(us)}. Take g = 9.8 m/s². Enter the centripetal force the rover needs at this speed, in newtons, then the greatest speed at which it can go round this track without skidding, in metres per second, both to 2 decimal places. Type the numbers without commas.`,
   answer: [r2(x.F), r2(x.vmax)],
   hints: ['A body moving on a circle at a steady speed needs a net force towards the centre of size F = mv² ÷ r: its mass times its centripetal acceleration.', 'On a flat track the most static friction can give is μs mg. The rover skids when mv² ÷ r would have to be more than that, so the greatest speed solves mv² ÷ r = μs mg. The mass cancels.'],
   solution: `The centripetal acceleration is v² ÷ r = ${n(v * v)} ÷ ${n(r)} ≈ ${f2(x.ac)} m/s², so the centripetal force is F = mv² ÷ r ≈ ${f2(x.F)} N. The most static friction can give is μs mg = ${n(us)} × ${n(m)} × 9.8 = ${n(x.fmax)} N. At the greatest speed mv² ÷ r = μs mg, so v² = μs g r = ${n(us)} × 9.8 × ${n(r)} = ${n(G.tidy(us * g * r))} and v = √${n(G.tidy(us * g * r))} ≈ ${f2(x.vmax)} m/s. The mass cancelled: a heavier rover needs more grip but also presses down harder.`,
   guidance: [
    { prompt: `What is the rover’s centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(x.ac)], explanation: `v² ÷ r = ${n(v * v)} ÷ ${n(r)} ≈ ${f2(x.ac)} m/s², pointing towards the centre.` },
    { prompt: `What centripetal force F = m × (v² ÷ r) does that need, in newtons to 2 decimal places?`, answer: [r2(x.F)], explanation: `F = ${n(m)} × ${n(v * v)} ÷ ${n(r)} ≈ ${f2(x.F)} N, all of it supplied by static friction.` },
    { prompt: `What is the most force static friction can give, μs mg, in newtons?`, answer: [x.fmax], explanation: `μs mg = ${n(us)} × ${n(m)} × 9.8 = ${n(x.fmax)} N. The rover needs less than this at ${n(v)} m/s, so it holds the curve.` },
    { prompt: `At the greatest speed, mv² ÷ r = μs mg, so v = √(μs g r). What is it, in m/s to 2 decimal places?`, answer: [r2(x.vmax)], explanation: `v = √(${n(us)} × 9.8 × ${n(r)}) = √${n(G.tidy(us * g * r))} ≈ ${f2(x.vmax)} m/s.` }
   ] }; }
 },
 q25: {
  canonical: { m: 90, b: 0.25, v: 30 },
  /* Pod 20 to 200 kg, drag constant 0.05 to 0.6 kg/m, a whole-number speed from 2 m/s up to 2 m/s below terminal speed.
     Not the worked example (60 kg, 0.2 kg/m, 20 m/s). */
  draw: R => tryDraw(() => { const m = 10 * R.int(2, 20), b = R.int(5, 60) / 100, top = Math.floor(Math.sqrt(m * g / b) - 2); return { m, b, v: R.int(2, Math.max(2, top)) }; },
   p => { if (same(p, { m: 60, b: 0.2, v: 20 })) return false; const x = q25v(p); return p.v <= x.vT - 2 && x.vT <= 120 && safe(x.D, x.a, x.vT); }, { m: 90, b: 0.25, v: 30 }),
  build: p => { const { m, b, v } = p, x = q25v(p); return {
   prompt: `A supply pod of mass ${n(m)} kg is dropped down the test shaft beside the Engine Hall. The air drags on it with a force of size D = bv², where v is its speed and the drag constant is b = ${n(b)} kg/m. Take g = 9.8 m/s². Enter the drag force on the pod when it is falling at ${n(v)} m/s, in newtons; then its acceleration at that moment, in m/s² with downward positive; then its terminal speed, in m/s. Give all three to 2 decimal places, and type them without commas.`,
   answer: [r2(x.D), r2(x.a), r2(x.vT)],
   hints: ['Drag points up, against the motion, and grows with the square of the speed. The net downward force is the weight mg minus the drag, and Newton’s second law turns it into an acceleration.', 'At terminal speed the drag has grown to equal the weight, so the net force and the acceleration are zero: bv² = mg, so v = √(mg ÷ b).'],
   solution: `At ${n(v)} m/s the drag is D = bv² = ${n(b)} × ${n(v * v)} = ${f2(x.D)} N, upward. The weight is mg = ${n(x.w)} N, downward. The net downward force is ${n(x.w)} − ${f2(x.D)} = ${f2(x.w - x.D)} N, so a = ${f2(x.w - x.D)} ÷ ${n(m)} ≈ ${f2(x.a)} m/s². At terminal speed bv² = mg, so v² = ${n(x.w)} ÷ ${n(b)} ≈ ${f2(x.w / b)} and v ≈ ${f2(x.vT)} m/s.`,
   guidance: [
    { prompt: `What is the pod’s weight mg, in newtons?`, answer: [x.w], explanation: `mg = ${n(m)} × 9.8 = ${n(x.w)} N.` },
    { prompt: `What is the drag D = bv² at ${n(v)} m/s, in newtons to 2 decimal places?`, answer: [r2(x.D)], explanation: `D = ${n(b)} × ${n(v)}² = ${n(b)} × ${n(v * v)} = ${f2(x.D)} N.` },
    { prompt: `The net downward force is mg − D. What is the acceleration (mg − D) ÷ m, in m/s² to 2 decimal places?`, answer: [r2(x.a)], explanation: `a = (${n(x.w)} − ${f2(x.D)}) ÷ ${n(m)} ≈ ${f2(x.a)} m/s², less than g because drag holds it back.` },
    { prompt: `At terminal speed bv² = mg. What is that speed, √(mg ÷ b), in m/s to 2 decimal places?`, answer: [r2(x.vT)], explanation: `v = √(${n(x.w)} ÷ ${n(b)}) ≈ √${f2(x.w / b)} ≈ ${f2(x.vT)} m/s.` }
   ] }; }
 },
 q26: {
  canonical: { F: 250, d: 12, th: 0.5, c: 6, k: 10, x1: 1, x2: 4 },
  /* Pull 50 to 400 N, distance 3 to 30 m, cable angle 0.1 to 1.2 rad but never 1 ("1 radians"); ram F(x) = cx² + kx with c a multiple of 3 and k even, so
     the ram's work is a whole number. Not the worked example (100 N, 5 m, 0.3 rad; 3x² + 2x from 0 to 2). */
  draw: R => tryDraw(() => { const x1 = R.int(0, 3); return { F: 10 * R.int(5, 40), d: R.int(3, 30), th: R.except(1, 12, [10]) / 10, c: 3 * R.int(1, 4), k: 2 * R.int(1, 10), x1, x2: x1 + R.int(1, 4) }; },
   p => { if (p.F === 100 && p.d === 5 && p.th === 0.3) return false; if (p.c === 3 && p.k === 2 && p.x1 === 0 && p.x2 === 2) return false; const v = q26v(p); return safe(v.Fx, v.W1); }, { F: 250, d: 12, th: 0.5, c: 6, k: 10, x1: 1, x2: 4 }),
  build: p => { const { F, d, th, c, k, x1, x2 } = p, v = q26v(p), c3 = c / 3, k2 = k / 2;
   const cx = coef => coef === 1 ? '' : n(coef);
   return {
   prompt: `Two machines in the Engine Hall. First, a winch drags a sled ${n(d)} m across the level floor with a constant pull of ${n(F)} N along its cable, and the cable makes an angle of ${n(th)} radians with the floor. Second, a hydraulic ram pushes a block along a straight track from x = ${n(x1)} m to x = ${n(x2)} m with a force along the track of F(x) = ${n(c)}x² + ${n(k)}x newtons. Enter the work done by the winch’s pull on the sled, in joules to 2 decimal places, then the work done by the ram on the block, in joules. Type the numbers without commas.`,
   answer: [r2(v.W1), G.tidy(v.W2)],
   hints: ['Only the part of a force along the motion does work. For a constant force at angle θ to the displacement, W = F · d = Fd cos θ.', 'For a force that changes with position, add up F dx along the path: the work is the definite integral of F(x) from the start to the end. Find an antiderivative and subtract its value at the start from its value at the end.'],
   solution: `Winch: the part of the pull along the floor is F cos θ = ${n(F)} × cos ${n(th)} ≈ ${f2(v.Fx)} N, so W = Fd cos θ = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J. Ram: W = ∫ (${n(c)}x² + ${n(k)}x) dx from ${n(x1)} to ${n(x2)}. An antiderivative is ${cx(c3)}x³ + ${cx(k2)}x². At x = ${n(x2)} it is ${n(G.tidy(v.A2))} and at x = ${n(x1)} it is ${n(G.tidy(v.A1))}, so W = ${n(G.tidy(v.A2))} − ${n(G.tidy(v.A1))} = ${n(G.tidy(v.W2))} J.`,
   guidance: [
    { prompt: `What is the part of the winch’s pull along the floor, F cos θ, in newtons to 2 decimal places?`, answer: [r2(v.Fx)], explanation: `F cos θ = ${n(F)} × cos ${n(th)} ≈ ${f2(v.Fx)} N. The rest of the pull lifts slightly on the sled and does no work along the floor.` },
    { prompt: `What work does the pull do over the ${n(d)} m, Fd cos θ, in joules to 2 decimal places?`, answer: [r2(v.W1)], explanation: `W = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J.` },
    { prompt: `An antiderivative of ${n(c)}x² + ${n(k)}x is ${cx(c3)}x³ + ${cx(k2)}x². What is its value at the end, x = ${n(x2)}, in joules?`, answer: [G.tidy(v.A2)], explanation: `${cx(c3) || '1'} × ${n(x2 * x2 * x2)} + ${cx(k2) || '1'} × ${n(x2 * x2)} = ${n(G.tidy(v.A2))}.` },
    { prompt: `What is its value at the start, x = ${n(x1)}, in joules?`, answer: [G.tidy(v.A1)], explanation: `${cx(c3) || '1'} × ${n(x1 * x1 * x1)} + ${cx(k2) || '1'} × ${n(x1 * x1)} = ${n(G.tidy(v.A1))}.` },
    { prompt: `The ram’s work is the end value minus the start value. What is it, in joules?`, answer: [G.tidy(v.W2)], explanation: `W = ${n(G.tidy(v.A2))} − ${n(G.tidy(v.A1))} = ${n(G.tidy(v.W2))} J.` }
   ] }; }
 },
 q27: {
  canonical: { m: 120, v0: 6, W: 3240 },
  /* Sled 20 to 200 kg, start speed 2 to 12 m/s, net work a non-zero multiple of 10 J from −80% to +300% of the starting kinetic
     energy, so the final kinetic energy stays positive. Not the worked example (50 kg, 4 m/s, 500 J). */
  draw: R => tryDraw(() => { const m = 10 * R.int(2, 20), v0 = R.int(2, 12), K0 = m * v0 * v0 / 2; return { m, v0, W: 10 * R.nz(Math.ceil(-0.08 * K0), Math.floor(0.3 * K0)) }; },
   p => { if (same(p, { m: 50, v0: 4, W: 500 })) return false; const x = q27v(p); return x.Kf > 0 && Math.abs(p.W) >= 20 && safe(x.vf); }, { m: 120, v0: 6, W: 3240 }),
  build: p => { const { m, v0, W } = p, x = q27v(p), up = W > 0; return {
   prompt: `A cargo sled of mass ${n(m)} kg glides along the level test track at ${n(v0)} m/s. Then ${up ? 'a booster engine pushes it' : 'a brake drags on it'} for a stretch, and the net work done on the sled over that stretch is ${n(W)} J (${up ? 'positive, because the net force points along the motion' : 'negative, because the net force points against the motion'}). Enter the sled’s kinetic energy before the stretch, then after it, both in joules, then its speed after the stretch in metres per second to 2 decimal places. Type the numbers without commas.`,
   answer: [x.K0, x.Kf, r2(x.vf)],
   hints: ['Kinetic energy is K = ½mv², in joules when the mass is in kilograms and the speed in metres per second.', 'The work-energy theorem says the net work equals the change in kinetic energy, so the kinetic energy after the stretch is the kinetic energy before it plus the net work. Then solve ½mv² = K for the speed: v = √(2K ÷ m).'],
   solution: `Before: K = ½mv² = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(x.K0)} J. By the work-energy theorem, K after = K before + net work = ${n(x.K0)} ${up ? '+' : '−'} ${n(Math.abs(W))} = ${n(x.Kf)} J. Then v = √(2K ÷ m) = √(${n(2 * x.Kf)} ÷ ${n(m)}) ≈ ${f2(x.vf)} m/s.`,
   guidance: [
    { prompt: `What is the sled’s kinetic energy ½mv² at ${n(v0)} m/s, in joules?`, answer: [x.K0], explanation: `K = ½ × ${n(m)} × ${n(v0)}² = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(x.K0)} J.` },
    { prompt: `The net work changes the kinetic energy by exactly its own amount. What is the kinetic energy after the stretch, in joules?`, answer: [x.Kf], explanation: `${n(x.K0)} ${up ? '+' : '−'} ${n(Math.abs(W))} = ${n(x.Kf)} J.` },
    { prompt: `Solve ½mv² = ${n(x.Kf)} for v. What is the speed, in m/s to 2 decimal places?`, answer: [r2(x.vf)], explanation: `v = √(2 × ${n(x.Kf)} ÷ ${n(m)}) = √${n(G.tidy(2 * x.Kf / m))} ≈ ${f2(x.vf)} m/s.` }
   ] }; }
 },
 q28: {
  canonical: { m: 150, h: 12, t: 20, P2: 4 },
  /* Crate 40 to 300 kg, height 3 to 25 m, time 5 to 60 s, winch 2 to 20 kW, so the work mgh is a whole number of joules.
     Not the worked example (100 kg, 10 m, 25 s, 5 kW). */
  draw: R => tryDraw(() => ({ m: 10 * R.int(4, 30), h: R.int(3, 25), t: R.int(5, 60), P2: R.int(2, 20) }),
   p => { if (same(p, { m: 100, h: 10, t: 25, P2: 5 })) return false; const x = q28v(p); return x.t2 >= 0.5 && safe(x.P, x.t2); }, { m: 150, h: 12, t: 20, P2: 4 }),
  build: p => { const { m, h, t, P2 } = p, x = q28v(p); return {
   prompt: `The Engine Hall crane lifts a crate of mass ${n(m)} kg straight up through ${n(h)} m at a steady speed, taking ${n(t)} s. Take g = 9.8 m/s². Enter the work the crane’s cable does on the crate, in joules; then the crane’s average power, in watts to 2 decimal places; then how long a ${n(P2)} kW winch would take to make the same lift, with all of its power going into the lift, in seconds to 2 decimal places. Type the numbers without commas.`,
   answer: [x.W, r2(x.P), r2(x.t2)],
   hints: ['At a steady speed the net force is zero, so the cable pulls up with a force equal to the weight mg, along the motion. The work is that force times the height.', 'Average power is work divided by time, P = W ÷ t, in watts (joules per second). A kilowatt is 1000 watts, so a winch of P kilowatts does 1000P joules each second, and the time is the work divided by that.'],
   solution: `The cable pulls up with mg = ${n(m)} × 9.8 = ${n(x.w)} N, so it does W = mgh = ${n(x.w)} × ${n(h)} = ${n(x.W)} J. The average power is ${n(x.W)} ÷ ${n(t)} ≈ ${f2(x.P)} W. (The same comes from P = Fv: the speed is ${n(h)} ÷ ${n(t)} m/s, and ${n(x.w)} × ${n(h)} ÷ ${n(t)} ≈ ${f2(x.P)} W.) A ${n(P2)} kW winch delivers ${n(1000 * P2)} J each second, so it needs ${n(x.W)} ÷ ${n(1000 * P2)} ≈ ${f2(x.t2)} s.`,
   guidance: [
    { prompt: `At a steady speed the cable’s pull equals the weight. What is mg, in newtons?`, answer: [x.w], explanation: `mg = ${n(m)} × 9.8 = ${n(x.w)} N.` },
    { prompt: `The pull acts along the ${n(h)} m of motion. What work does it do, in joules?`, answer: [x.W], explanation: `W = ${n(x.w)} × ${n(h)} = ${n(x.W)} J.` },
    { prompt: `What is the average power W ÷ t, in watts to 2 decimal places?`, answer: [r2(x.P)], explanation: `P = ${n(x.W)} ÷ ${n(t)} ≈ ${f2(x.P)} W.` },
    { prompt: `A ${n(P2)} kW winch does ${n(1000 * P2)} J per second. How long does it take to do the same work, in seconds to 2 decimal places?`, answer: [r2(x.t2)], explanation: `t = ${n(x.W)} ÷ ${n(1000 * P2)} ≈ ${f2(x.t2)} s.` }
   ] }; }
 },
 q29: {
  canonical: { m: 80, d: 16, vf: 6, uk: 0.25 },
  /* The end speed vf (2 to 12 m/s) is drawn and the pull F built from it, so every answer is exact. Sled 20 to 200 kg,
     distance 4 to 30 m, μk 0.1 to 0.6; F kept to one decimal place and below 3000 N. Not the worked example
     (50 kg, 10 m, 4 m/s, 0.2). */
  draw: R => tryDraw(() => ({ m: 10 * R.int(2, 20), d: R.int(4, 30), vf: R.int(2, 12), uk: R.int(1, 6) / 10 }),
   p => { if (same(p, { m: 50, d: 10, vf: 4, uk: 0.2 })) return false; const F = q29F(p); return oneDec(F) && F < 3000 && q29v(p).Ww < 100000; }, { m: 80, d: 16, vf: 6, uk: 0.25 }),
  build: p => { const { m, d, vf, uk } = p, x = q29v(p); return {
   prompt: `A winch in the Engine Hall pulls a sled of mass ${n(m)} kg from rest across the level floor with a constant horizontal pull of ${n(x.F)} N, along the direction it moves, for ${n(d)} m. The coefficient of kinetic friction between the sled and the floor is μk = ${n(uk)}. Take g = 9.8 m/s². Enter the work done by the winch on the sled in joules; then the work done by friction in joules, with its sign; then the sled’s speed at the end of the pull in m/s; then the winch’s power at that moment, P = Fv, in watts. Type the numbers without commas.`,
   answer: [x.Ww, x.Wf, vf, x.P],
   hints: ['The winch’s pull points along the motion, so its work is Fd. Kinetic friction μk mg points against the motion, so its work is −μk mg d. The weight and the normal force are at right angles to the motion and do no work.', 'The net work is the sum of the two works, and by the work-energy theorem it equals ½mv² at the end, because the sled starts from rest. Solve for v, then multiply by the pull for the power.'],
   solution: `Winch: W = Fd = ${n(x.F)} × ${n(d)} = ${n(x.Ww)} J. Friction: μk mg = ${n(uk)} × ${n(m)} × 9.8 = ${n(x.fk)} N against the motion, so W = −${n(x.fk)} × ${n(d)} = ${n(x.Wf)} J. Net work = ${n(x.Ww)} − ${n(-x.Wf)} = ${n(x.Wn)} J, which equals ½mv², so v² = 2 × ${n(x.Wn)} ÷ ${n(m)} = ${n(vf * vf)} and v = ${n(vf)} m/s. Power at the end: P = Fv = ${n(x.F)} × ${n(vf)} = ${n(x.P)} W.`,
   guidance: [
    { prompt: `What work does the winch’s pull do over the ${n(d)} m, in joules?`, answer: [x.Ww], explanation: `W = Fd = ${n(x.F)} × ${n(d)} = ${n(x.Ww)} J.` },
    { prompt: `Friction is μk mg against the motion. What work does it do, in joules, with its sign?`, answer: [x.Wf], explanation: `μk mg = ${n(x.fk)} N, so W = −${n(x.fk)} × ${n(d)} = ${n(x.Wf)} J.` },
    { prompt: `The net work equals the kinetic energy at the end, ½mv². What is the speed, in m/s?`, answer: [vf], explanation: `½ × ${n(m)} × v² = ${n(x.Wn)}, so v² = ${n(vf * vf)} and v = ${n(vf)} m/s.` },
    { prompt: `What is the winch’s power at that moment, P = Fv, in watts?`, answer: [x.P], explanation: `P = ${n(x.F)} × ${n(vf)} = ${n(x.P)} W.` }
   ] }; }
 },
 q30: {
  canonical: { m: 250, h1: 8, h2: 3, k: 1600, x: 0.25 },
  /* Module 50 to 500 kg, shelf 4 to 20 m, platform 1 m up to 2 m below the shelf; spring constant 400 to 4000 N/m in steps of
     200 and squeeze 0.1 to 0.5 m in steps of 0.05, so ½kx² has at most 2 decimals. Not the worked example
     (100 kg, 5 m, 2 m; 1000 N/m, 0.2 m). */
  draw: R => tryDraw(() => { const h1 = R.int(4, 20); return { m: 10 * R.int(5, 50), h1, h2: R.int(1, h1 - 2), k: 200 * R.int(2, 20), x: R.int(2, 10) / 20 }; },
   p => !(p.m === 100 && p.h1 === 5 && p.h2 === 2) && !(p.k === 1000 && p.x === 0.2), { m: 250, h1: 8, h2: 3, k: 1600, x: 0.25 }),
  build: p => { const { m, h1, h2, k, x } = p, v = q30v(p); return {
   prompt: `In the Docking Ring a crane lifts a cargo canister of mass ${n(m)} kg from the floor onto a shelf ${n(h1)} m up. Later it lowers the canister from the shelf to a platform ${n(h2)} m above the floor. Take the floor as the zero of gravitational potential energy, and g = 9.8 m/s². Beside it, a spring buffer with spring constant k = ${n(k)} N/m is squeezed ${n(x)} m shorter than its natural length. Enter the canister’s gravitational potential energy on the shelf, then the potential energy stored in the spring buffer, then the work gravity does on the canister as it is lowered from the shelf to the platform, all in joules. Type the numbers without commas.`,
   answer: [v.U1, v.Us, v.Wg],
   hints: ['Near the ground, gravitational potential energy is U = mgy, where y is the height above the level you chose as zero.', 'A spring squeezed or stretched by x stores U = ½kx². The work gravity does is minus the change in potential energy: start value minus end value.'],
   solution: `On the shelf: U = mgy = ${n(m)} × 9.8 × ${n(h1)} = ${n(v.U1)} J. Spring: U = ½kx² = ½ × ${n(k)} × ${n(x)}² = ½ × ${n(k)} × ${n(G.tidy(x * x))} = ${n(v.Us)} J. On the platform U = ${n(m)} × 9.8 × ${n(h2)} = ${n(v.U2)} J, so the change on the way down is ${n(v.U2)} − ${n(v.U1)} = ${n(-v.Wg)} J, and the work gravity does is minus that: ${n(v.Wg)} J. Gravity does positive work because the canister moves the way gravity pulls.`,
   guidance: [
    { prompt: `What is the canister’s gravitational potential energy mgy on the shelf, in joules?`, answer: [v.U1], explanation: `U = ${n(m)} × 9.8 × ${n(h1)} = ${n(v.U1)} J.` },
    { prompt: `What is its gravitational potential energy on the platform, in joules?`, answer: [v.U2], explanation: `U = ${n(m)} × 9.8 × ${n(h2)} = ${n(v.U2)} J.` },
    { prompt: `The work gravity does is minus the change in potential energy, shelf value minus platform value. What is it, in joules?`, answer: [v.Wg], explanation: `W = ${n(v.U1)} − ${n(v.U2)} = ${n(v.Wg)} J.` },
    { prompt: `What energy ½kx² is stored in the squeezed spring buffer, in joules?`, answer: [v.Us], explanation: `½ × ${n(k)} × ${n(x)}² = ½ × ${n(k)} × ${n(G.tidy(x * x))} = ${n(v.Us)} J.` }
   ] }; }
 }
});
})();
