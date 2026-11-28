/* Differential equations practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
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
const r3 = x => Math.round(x * 1000) / 1000, f3 = x => x.toFixed(3).replace('-', '−');
/* A coefficient in front of a letter, never a written-out 1: co(1, 'C') 'C', co(3, 'C') '3C', co(−1, 'C') '−C'. */
const co = (v, s) => v === 1 ? s : v === -1 ? '−' + s : n(v) + s;
/* A sum of terms [coefficient, symbol]; symbol '' is a plain number. Zero terms are left out, a coefficient 1 is not written. */
const ex = terms => { let out = '';
 terms.forEach(([c, s]) => { if (c === 0) return; const a = Math.abs(c), body = s === '' ? n(a) : a === 1 ? s.trimStart() : n(a) + s;
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* a·b·c ... as a sum of plain numbers: nums([4, −6, 3]) is '4 − 6 + 3'. */
const nums = list => ex(list.map(v => [v, '']));
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const same = (p, q) => Object.keys(q).every(key => p[key] === q[key]);
/* True when x is not within 0.03 of a rounding tie at 3 decimal places. */
const nt = x => { const f = Math.abs(x) * 1000 % 1; return Math.abs(f - 0.5) > 0.03; };
const wt = w => w === 1 ? 't' : `${n(w)}t`;
const E = k => k === 1 ? 'e^t' : k === -1 ? 'e^(−t)' : `e^(${n(k)}t)`;
/* mx″ + cx′ + kx, or with y. */
const eq2 = (m, c, k, v) => `${co(m, v + '″')} + ${co(c, v + '′')} + ${co(k, v)}`;
const DAMP = 'Enter a code for the damping: 1 for overdamped, 2 for critically damped, 3 for underdamped.';
const kindOf = (c, m, k) => c * c > 4 * m * k ? 1 : c * c === 4 * m * k ? 2 : 3;
const KW = { 1: 'overdamped', 2: 'critically damped', 3: 'underdamped' };
/* A damper constant for the wanted kind, given the critical value cc = 2mw. */
const cFor = (R, kind, cc) => kind === 1 ? cc + R.int(1, cc) : kind === 2 ? cc : R.int(1, cc - 1);

/* ---- q16 Mechanical vibrations: frequency and damping [2.4] ---- */

/* k = m·w², ω₀ = w, period 2π ÷ w, kind from c against 2mw. Not the worked example (m = 2, k = 50, c = 12) nor the parent (4, 36, 30). */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The airlock hatch closer',
 brief: 'The airlock hatch swings shut on a spring with a damper, and Mira wants to know how fast it would swing and whether it slams.',
 labels: ['ω₀ (rad/s)', 'natural period (s, 3 d.p.)', 'damping code'], tolerance: 0.0005,
 gl: [['ω₀ (rad/s)'], ['natural period (s, 3 d.p.)'], ['c² − 4mk'], ['damping code']]
}, {
 canonical: { m: 6, w: 4, c: 20 },
 draw: R => tries(() => { const m = R.int(2, 9), w = R.int(2, 7); return { m, w, c: cFor(R, R.int(1, 3), 2 * m * w) }; },
  p => nt(2 * Math.PI / p.w) && !same(p, { m: 4, w: 3, c: 30 }) && !(p.m === 2 && p.w === 5 && p.c === 12), { m: 6, w: 4, c: 20 }),
 build: ({ m, w, c }) => { const k = m * w * w, T = r3(2 * Math.PI / w), d = c * c - 4 * m * k, kd = kindOf(c, m, k); return {
  prompt: `The airlock hatch is closed by a spring with a damper. Treat it as a mass m = ${n(m)} kg on a spring of stiffness k = ${n(k)} N/m with a damper of c = ${n(c)} N·s/m, so mx″ + cx′ + kx = 0 becomes ${eq2(m, c, k, 'x')} = 0 (x in metres, t in seconds). Enter the natural angular frequency ω₀ = √(k ÷ m) in rad/s, then the natural period 2π ÷ ω₀ in seconds to 3 decimal places, then a code for the damping: 1 for overdamped, 2 for critically damped, 3 for underdamped.`,
  answer: [w, T, kd],
  hints: ['The natural angular frequency is the square root of the stiffness divided by the mass. The natural period is how long one full swing takes if the damper were taken away: 2π divided by the angular frequency.', 'Work out c² and 4mk and compare them: c² bigger means overdamped, equal means critically damped, smaller means underdamped.'],
  solution: `ω₀ = √(${n(k)} ÷ ${n(m)}) = √${n(w * w)} = ${n(w)} rad/s, and the natural period is 2π ÷ ${n(w)} = ${(2 * Math.PI / w).toFixed(4)}…, which is ${f3(T)} s to 3 decimal places. For the damping, c² = ${n(c * c)} and 4mk = 4 × ${n(m)} × ${n(k)} = ${n(4 * m * k)}, so c² − 4mk = ${n(d)}. ${d > 0 ? 'c² is bigger than 4mk' : d === 0 ? 'c² equals 4mk' : 'c² is smaller than 4mk'}, so the closer is ${KW[kd]}: code ${kd}.`,
  guidance: [
   { prompt: `What is ω₀ = √(k ÷ m) = √(${n(k)} ÷ ${n(m)}), in rad/s?`, answer: [w], explanation: `${n(k)} ÷ ${n(m)} = ${n(w * w)}, and √${n(w * w)} = ${n(w)} rad/s.` },
   { prompt: `What is the natural period 2π ÷ ${n(w)}, in seconds to 3 decimal places?`, answer: [T], explanation: `2π ÷ ${n(w)} = ${(2 * Math.PI / w).toFixed(4)}…, which is ${f3(T)} s.` },
   { prompt: `What is c² − 4mk = ${n(c)}² − 4 × ${n(m)} × ${n(k)}?`, answer: [d], explanation: `${n(c * c)} − ${n(4 * m * k)} = ${n(d)}. This is the number under the square root when the characteristic equation is solved.` },
   { prompt: 'Which code fits: 1 overdamped (positive), 2 critically damped (zero), 3 underdamped (negative)?', answer: [kd], explanation: `c² − 4mk = ${n(d)} is ${d > 0 ? 'positive' : d === 0 ? 'zero' : 'negative'}, so the closer is ${KW[kd]}: code ${kd}.` }
  ] }; }
});

/* Cart of empty mass M0 plus a load p: m = M0 + p, k = m·w². The kind comes from c against 2mw. */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'The loaded sample cart',
 brief: 'The sample cart rides on a spring and damper, and Mira wants to know how it swings once the rock is loaded on.',
 labels: ['ω₀ (rad/s)', 'damping code'], tolerance: 0.0005,
 gl: [['total mass (kg)'], ['ω₀ (rad/s)'], ['damping code']]
}, {
 canonical: { M0: 6, p: 2, w: 3, c: 40 },
 draw: R => tries(() => { const M0 = R.int(2, 10), p = R.int(1, 8), w = R.int(2, 6); return { M0, p, w, c: cFor(R, R.int(1, 3), 2 * (M0 + p) * w) }; },
  p => !same(p, { M0: 6, p: 2, w: 3, c: 40 }), { M0: 6, p: 2, w: 3, c: 40 }),
 build: ({ M0, p, w, c }) => { const m = M0 + p, k = m * w * w, d = c * c - 4 * m * k, kd = kindOf(c, m, k); return {
  prompt: `A rover’s sample cart weighs ${n(M0)} kg empty and carries ${n(p)} kg of rock. Its suspension is a spring of stiffness k = ${n(k)} N/m with a damper of c = ${n(c)} N·s/m. The whole cart with its load is the mass m in mx″ + cx′ + kx = 0 (x in metres, t in seconds). Enter the natural angular frequency ω₀ = √(k ÷ m) in rad/s for the loaded cart, then a code for its damping: 1 for overdamped, 2 for critically damped, 3 for underdamped.`,
  answer: [w, kd],
  hints: ['The mass in the equation is everything that moves: the cart and its load together.', 'Find ω₀ from k and the total mass, then compare c² with 4mk (using the total mass): bigger is overdamped, equal is critically damped, smaller is underdamped.'],
  solution: `The mass that moves is ${n(M0)} + ${n(p)} = ${n(m)} kg. So ω₀ = √(${n(k)} ÷ ${n(m)}) = √${n(w * w)} = ${n(w)} rad/s. For the damping, c² = ${n(c * c)} and 4mk = 4 × ${n(m)} × ${n(k)} = ${n(4 * m * k)}, so c² − 4mk = ${n(d)}. ${d > 0 ? 'c² is bigger than 4mk' : d === 0 ? 'c² equals 4mk' : 'c² is smaller than 4mk'}, so the loaded cart is ${KW[kd]}: code ${kd}.`,
  guidance: [
   { prompt: `What is the total mass m of the cart and its load, in kg?`, answer: [m], explanation: `${n(M0)} + ${n(p)} = ${n(m)} kg.` },
   { prompt: `What is ω₀ = √(${n(k)} ÷ ${n(m)}), in rad/s?`, answer: [w], explanation: `${n(k)} ÷ ${n(m)} = ${n(w * w)}, and √${n(w * w)} = ${n(w)} rad/s.` },
   { prompt: `With m = ${n(m)}, c² − 4mk = ${n(c * c)} − ${n(4 * m * k)} = ${n(d)}. Which code fits: 1 overdamped (positive), 2 critically damped (zero), 3 underdamped (negative)?`, answer: [kd], explanation: `${n(d)} is ${d > 0 ? 'positive' : d === 0 ? 'zero' : 'negative'}, so the loaded cart is ${KW[kd]}: code ${kd}.` }
  ] }; }
});

/* Underdamped mx″ + cx′ + kx = 0: roots a ± bi with a = −c ÷ (2m), b = √(4mk − c²) ÷ (2m); damped period 2π ÷ b. */
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q15', title: 'The swinging camera mast',
 brief: 'The camera mast on the rover swings and slowly settles, and Mira wants the rate it settles at and the time of one swing.',
 labels: ['real part a (1/s)', 'b (rad/s, 3 d.p.)', 'damped period (s, 3 d.p.)'], tolerance: 0.0005,
 gl: [['real part a (1/s)'], ['b (rad/s, 3 d.p.)'], ['damped period (s, 3 d.p.)']]
}, {
 canonical: { m: 2, k: 26, c: 4 },
 draw: R => tries(() => { const m = R.pick([1, 2, 4, 5]), k = R.int(8, 60); return { m, k, c: R.int(1, Math.floor(Math.sqrt(4 * m * k)) - 1) }; },
  p => { const b = Math.sqrt(4 * p.m * p.k - p.c * p.c) / (2 * p.m); return p.c * p.c < 4 * p.m * p.k && nt(b) && nt(2 * Math.PI / b) && !same(p, { m: 4, k: 36, c: 30 }); }, { m: 2, k: 26, c: 4 }),
 build: ({ m, k, c }) => { const disc = 4 * m * k - c * c, a = -c / (2 * m), bb = Math.sqrt(disc) / (2 * m), B = r3(bb), T = r3(2 * Math.PI / bb); return {
  prompt: `The rover’s camera mast is a mass m = ${n(m)} kg on a spring of stiffness k = ${n(k)} N/m with a damper of c = ${n(c)} N·s/m, so mx″ + cx′ + kx = 0 becomes ${eq2(m, c, k, 'x')} = 0 (x in metres, t in seconds). It is underdamped, so the characteristic equation has complex roots a ± bi with b > 0. By the quadratic formula a = −c ÷ (2m) and b = √(4mk − c²) ÷ (2m). The mast swings as cos bt and sin bt, and one full swing takes 2π ÷ b seconds. Enter a exactly, then b in rad/s to 3 decimal places, then the time of one full swing 2π ÷ b in seconds to 3 decimal places (work it out from the unrounded b).`,
  answer: [a, B, T],
  hints: ['The real part a is −c divided by 2m. For b, first work out 4mk − c², which is positive when the mast is underdamped, then take its square root and divide by 2m.', 'The time of one full swing is 2π divided by b. Use the unrounded b, and round only at the end.'],
  solution: `a = −${n(c)} ÷ (2 × ${n(m)}) = ${n(a)}. For b, 4mk − c² = 4 × ${n(m)} × ${n(k)} − ${n(c)}² = ${n(4 * m * k)} − ${n(c * c)} = ${n(disc)}, so b = √${n(disc)} ÷ ${n(2 * m)} = ${bb.toFixed(4)}…, which is ${f3(B)} rad/s to 3 decimal places. One full swing takes 2π ÷ b = ${(2 * Math.PI / bb).toFixed(4)}…, which is ${f3(T)} s to 3 decimal places.`,
  guidance: [
   { prompt: `What is a = −c ÷ (2m) = −${n(c)} ÷ ${n(2 * m)}?`, answer: [a], explanation: `a = ${n(a)}. It is negative, so the swings shrink: they sit inside the envelope e^(at).` },
   { prompt: `What is b = √(4mk − c²) ÷ (2m) = √(${n(4 * m * k)} − ${n(c * c)}) ÷ ${n(2 * m)}, to 3 decimal places?`, answer: [B], explanation: `√${n(disc)} = ${Math.sqrt(disc).toFixed(4)}…, and dividing by ${n(2 * m)} gives ${bb.toFixed(4)}…, which is ${f3(B)} rad/s.` },
   { prompt: `What is the time of one full swing 2π ÷ b, using the unrounded b, to 3 decimal places?`, answer: [T], explanation: `2π ÷ ${bb.toFixed(4)}… = ${(2 * Math.PI / bb).toFixed(4)}…, which is ${f3(T)} s.` }
  ] }; }
});

/* ---- q17 Chapter review: tuning a suspension [2.2, 2.4] ---- */

/* k = m·w², critical c = 2mw, r = −w, C₁ = x0, C₂ = v0 + w·x0, x(t) = (x0 + C₂t)e^(−wt). Not the worked example (m = 1, k = 16) nor the parent (3, 12). */
const x17 = p => (p.x0 + (p.v0 + p.w * p.x0) * p.t) * Math.exp(-p.w * p.t);
mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The telescope mount isolator',
 brief: 'The telescope mount in the Signal Tower sits on a spring and damper, and it must settle without a bounce after every knock.',
 labels: ['critical damping c (N·s/m)', 'x at the time (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['critical damping c (N·s/m)'], ['repeated root r'], ['C₂'], ['x (cm, 3 d.p.)']]
}, {
 canonical: { m: 5, w: 3, x0: 8, v0: -2, t: 1.5 },
 draw: R => tries(() => ({ m: R.int(1, 8), w: R.int(2, 5), x0: R.int(3, 12), v0: R.int(-12, 12), t: R.pick([0.5, 1, 1.5]) }),
  p => Math.abs(x17(p)) > 0.05 && nt(x17(p)) && !same(p, { m: 3, w: 2, x0: 6, v0: -4, t: 1 }) && !(p.m === 1 && p.w === 4 && p.x0 === 2 && p.v0 === 0), { m: 5, w: 3, x0: 8, v0: -2, t: 1.5 }),
 build: p => { const { m, w, x0, v0, t } = p, k = m * w * w, c = 2 * m * w, C2 = v0 + w * x0, X = r3(x17(p)), A = x0 + C2 * t; return {
  prompt: `The telescope mount in the Signal Tower has mass m = ${n(m)} kg and sits on a spring of stiffness k = ${n(k)} N/m. Its isolator must be critically damped, so the mount settles with no bounce and as quickly as it can. Enter the damping constant c in N·s/m that makes mx″ + cx′ + kx = 0 critically damped. Then, with that damper, a knock moves the mount to x(0) = ${n(x0)} cm and it is released with x′(0) = ${n(v0)} cm/s (t in seconds): enter x(${n(t)}) in cm, to 3 decimal places.`,
  answer: [c, X],
  hints: ['Critical damping is the boundary case c² = 4mk, so c is twice the square root of mk.', 'With critical damping the one repeated root is r = −c ÷ (2m), and x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁.'],
  solution: `Critical damping needs c² = 4mk = 4 × ${n(m)} × ${n(k)} = ${n(c * c)}, so c = ${n(c)} N·s/m. The characteristic equation ${co(m, 'r²')} + ${n(c)}r + ${n(k)} = 0 then has the repeated root r = −${n(c)} ÷ ${n(2 * m)} = ${n(-w)}, so x = (C₁ + C₂t)e^(${n(-w)}t). C₁ = x(0) = ${n(x0)}, and C₂ = x′(0) − rC₁ = ${n(v0)} − (${n(-w)}) × ${n(x0)} = ${n(C2)}. So x(${n(t)}) = (${n(x0)} + ${par(C2)} × ${n(t)})e^(${n(-w * t)}) = ${n(A)}e^(${n(-w * t)}) = ${f3(X)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `Critical damping needs c² = 4mk. What is c = 2√(${n(m)} × ${n(k)}), in N·s/m?`, answer: [c], explanation: `${n(m)} × ${n(k)} = ${n(m * k)}, √${n(m * k)} = ${n(m * w)}, so c = ${n(c)} N·s/m.` },
   { prompt: `With c = ${n(c)}, the repeated root is r = −c ÷ (2m). What is r?`, answer: [-w], explanation: `r = −${n(c)} ÷ ${n(2 * m)} = ${n(-w)}.` },
   { prompt: `With x = (C₁ + C₂t)e^(${n(-w)}t), C₁ = x(0) = ${n(x0)} and C₂ = x′(0) − rC₁. What is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} − (${n(-w)}) × ${n(x0)} = ${n(C2)}.` },
   { prompt: `So x = (${ex([[x0, ''], [C2, 't']])})e^(${n(-w)}t). What is x(${n(t)}), to 3 decimal places?`, answer: [X], explanation: `x(${n(t)}) = ${n(A)}e^(${n(-w * t)}) = ${f3(X)} cm.` }
  ] }; }
});

/* The damper c and spring k are given: the critical mass is c² ÷ (4k) = m (whole). Then r = −w and x(t) as above. */
mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'The last damper on the shelf',
 brief: 'The garage has one damper left on the shelf, and Mira has to choose the load that makes the corner settle without a bounce.',
 labels: ['mass m (kg)', 'x at the time (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['mass m (kg)'], ['repeated root r'], ['x (cm, 3 d.p.)']]
}, {
 canonical: { m: 4, w: 5, x0: 7, v0: -3, t: 0.5 },
 draw: R => tries(() => ({ m: R.int(1, 8), w: R.int(2, 5), x0: R.int(3, 12), v0: R.int(-12, 12), t: R.pick([0.5, 1, 1.5]) }),
  p => Math.abs(x17(p)) > 0.05 && nt(x17(p)) && !same(p, { m: 3, w: 2, x0: 6, v0: -4, t: 1 }), { m: 4, w: 5, x0: 7, v0: -3, t: 0.5 }),
 build: p => { const { m, w, x0, v0, t } = p, k = m * w * w, c = 2 * m * w, C2 = v0 + w * x0, X = r3(x17(p)), A = x0 + C2 * t; return {
  prompt: `The garage has one damper left on the shelf, with c = ${n(c)} N·s/m, and a spring of stiffness k = ${n(k)} N/m. Mira will ballast the rover’s corner until its mass m makes mx″ + cx′ + kx = 0 critically damped, which means c² = 4mk. Enter that mass m in kg. Then, with that mass, a bump moves the corner to x(0) = ${n(x0)} cm and it is released with x′(0) = ${n(v0)} cm/s (t in seconds): enter x(${n(t)}) in cm, to 3 decimal places.`,
  answer: [m, X],
  hints: ['Critical damping is the boundary case c² = 4mk. Here c and k are known, so solve for m.', 'With the mass found, the one repeated root is r = −c ÷ (2m), and x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁.'],
  solution: `Critical damping needs c² = 4mk, so m = c² ÷ (4k) = ${n(c * c)} ÷ ${n(4 * k)} = ${n(m)} kg. The repeated root is r = −c ÷ (2m) = −${n(c)} ÷ ${n(2 * m)} = ${n(-w)}, so x = (C₁ + C₂t)e^(${n(-w)}t). C₁ = x(0) = ${n(x0)}, and C₂ = x′(0) − rC₁ = ${n(v0)} − (${n(-w)}) × ${n(x0)} = ${n(C2)}. So x(${n(t)}) = (${n(x0)} + ${par(C2)} × ${n(t)})e^(${n(-w * t)}) = ${n(A)}e^(${n(-w * t)}) = ${f3(X)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `Solve c² = 4mk for m. What is m = c² ÷ (4k) = ${n(c * c)} ÷ ${n(4 * k)}, in kg?`, answer: [m], explanation: `${n(c * c)} ÷ ${n(4 * k)} = ${n(m)} kg.` },
   { prompt: `With that mass, what is the repeated root r = −c ÷ (2m)?`, answer: [-w], explanation: `r = −${n(c)} ÷ ${n(2 * m)} = ${n(-w)}. With C₁ = ${n(x0)} and C₂ = x′(0) − rC₁ = ${n(C2)}, x = (${ex([[x0, ''], [C2, 't']])})e^(${n(-w)}t).` },
   { prompt: `What is x(${n(t)}) = (${n(x0)} + ${par(C2)} × ${n(t)})e^(${n(-w)} × ${n(t)}), to 3 decimal places?`, answer: [X], explanation: `${n(A)}e^(${n(-w * t)}) = ${f3(X)} cm.` }
  ] }; }
});

/* Critical damping with C₂ = −d < 0, so C₁ + C₂t = 0 at t = x0 ÷ d: the corner crosses its rest position once. */
mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'The overshooting corner',
 brief: 'Mira flicks the rear corner towards its rest position, and wants to know the moment it passes through, and the damper that allows it to settle.',
 labels: ['critical damping c (N·s/m)', 'C₂ (cm/s)', 'time at rest position (s, 3 d.p.)'], tolerance: 0.0005,
 gl: [['critical damping c (N·s/m)'], ['C₂ (cm/s)'], ['time at rest position (s, 3 d.p.)']]
}, {
 canonical: { m: 2, w: 3, x0: 6, d: 4 },
 draw: R => tries(() => ({ m: R.int(1, 6), w: R.int(2, 5), x0: R.int(3, 12), d: R.int(1, 9) }),
  p => nt(p.x0 / p.d) && !(p.m === 3 && p.w === 2 && p.x0 === 6), { m: 2, w: 3, x0: 6, d: 4 }),
 build: ({ m, w, x0, d }) => { const k = m * w * w, c = 2 * m * w, v0 = -(w * x0 + d), C2 = -d, T = r3(x0 / d); return {
  prompt: `The rover’s rear corner has mass m = ${n(m)} kg and a spring of stiffness k = ${n(k)} N/m, and its damper is set to critical damping. Here x = 0 is the rest position. Mira pulls the corner to x(0) = ${n(x0)} cm and flicks it back towards rest with x′(0) = ${n(v0)} cm/s (t in seconds). The motion is x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁. Enter the critical damping constant c in N·s/m, then C₂ in cm/s, then the time in seconds, to 3 decimal places, at which the corner passes through x = 0. It passes through exactly once for t > 0.`,
  answer: [c, C2, T],
  hints: ['Critical damping is c² = 4mk, and then the repeated root is r = −c ÷ (2m).', 'The factor e^(rt) is never 0, so x = 0 exactly when C₁ + C₂t = 0. Solve that for t.'],
  solution: `Critical damping needs c² = 4mk = 4 × ${n(m)} × ${n(k)} = ${n(c * c)}, so c = ${n(c)} N·s/m, and r = −${n(c)} ÷ ${n(2 * m)} = ${n(-w)}. Then C₁ = ${n(x0)} and C₂ = x′(0) − rC₁ = ${n(v0)} − (${n(-w)}) × ${n(x0)} = ${n(C2)} cm/s. Since e^(rt) is never 0, x = 0 when ${ex([[x0, ''], [-d, 't']])} = 0, so t = ${n(x0)} ÷ ${n(d)} = ${f3(T)} s to 3 decimal places.`,
  guidance: [
   { prompt: `Critical damping needs c² = 4mk. What is c = 2√(${n(m)} × ${n(k)}), in N·s/m?`, answer: [c], explanation: `${n(m)} × ${n(k)} = ${n(m * k)}, √${n(m * k)} = ${n(m * w)}, so c = ${n(c)} N·s/m, and r = −c ÷ (2m) = ${n(-w)}.` },
   { prompt: `What is C₂ = x′(0) − rC₁ = ${n(v0)} − (${n(-w)}) × ${n(x0)}?`, answer: [C2], explanation: `${n(v0)} + ${n(w * x0)} = ${n(C2)} cm/s.` },
   { prompt: `x = (${ex([[x0, ''], [-d, 't']])})e^(${n(-w)}t) is 0 when ${ex([[x0, ''], [-d, 't']])} = 0. What is t, to 3 decimal places?`, answer: [T], explanation: `t = ${n(x0)} ÷ ${n(d)} = ${f3(T)} s.` }
  ] }; }
});

/* ---- q18 Undetermined coefficients: polynomial and exponential forcing [2.5] ---- */

/* y″ + py′ + qy = f. fam 'poly': f = At + B with A = qC, B = pC + qD, guess Ct + D.
   fam 'exp': f = Ke^(kt) + qD with K = (k² + pk + q)C, guess Ce^(kt) + D; k is not a root. Not the worked example (y″ + y′ + 2y = 4t + 6) nor the parent. */
const q18 = p => { const { fam, p: pp, q, k, C, D } = p, K = k * k + pp * k + q;
 return fam === 'poly' ? { A: q * C, B: pp * C + q * D, K } : { A: K * C, B: q * D, K }; };
const q18ok = p => { const v = q18(p);
 return p.fam === 'poly' ? v.B !== 0 && !(p.p === 1 && p.q === 2 && p.C === 2 && p.D === 2) : v.K !== 0; };
const q18draw = (R, T, FB) => tries(() => ({ fam: R.pick(['poly', 'exp']), p: R.int(1, 6), q: R.int(1, 9), k: R.pick([-3, -2, -1, 1, 2, 3]), C: R.nz(-5, 5), D: R.nz(-4, 4), ...(T ? { T: R.pick([1, 2]) } : {}) }),
 p => q18ok(p) && !(p.fam === 'exp' && p.p === 4 && p.q === 3 && p.k === 2 && p.C === 3 && p.D === -2) && (!T || p.fam === 'poly' || (nt(p.C * Math.exp(p.k * p.T) + p.D) && Math.abs(p.C * Math.exp(p.k * p.T) + p.D) < 500)), FB);
/* The parts shared by q18b and q18c: the equation, the push, the guess and the two matching steps. */
const q18txt = p => { const { fam, p: pp, q, k, C, D } = p, v = q18(p), lhs = eq2(1, pp, q, 'y'), kk = k * k, pk = pp * k;
 const push = fam === 'poly' ? ex([[v.A, 't'], [v.B, '']]) : ex([[v.A, E(k)], [v.B, '']]);
 const guess = fam === 'poly' ? 'Ct + D' : `C${E(k)} + D`;
 const intro = fam === 'poly' ? 'a push that grows steadily with time t' : `a push that changes exponentially with time t, and the number ${n(k)} is not a root of the characteristic equation r² + ${co(pp, 'r')} + ${n(q)} = 0`;
 const sol = fam === 'poly'
  ? `For yₚ = Ct + D, yₚ′ = C and yₚ″ = 0. The left-hand side is ${co(pp, 'C')} + ${co(q, '(Ct + D)')} = ${co(q, 'C')}t + (${co(pp, 'C')} + ${co(q, 'D')}). Matching the t terms: ${co(q, 'C')} = ${n(v.A)}, so C = ${n(C)}. Matching the constants: ${co(pp, 'C')} + ${co(q, 'D')} = ${n(v.B)}, so ${n(pp * C)} + ${co(q, 'D')} = ${n(v.B)} and D = ${n(D)}. So yₚ = ${ex([[C, 't'], [D, '']])}.`
  : `For yₚ = C${E(k)} + D, yₚ′ = ${co(k, 'C')}${E(k)} and yₚ″ = ${co(kk, 'C')}${E(k)}. The left-hand side is (${nums([kk, pk, q])})C${E(k)} + ${co(q, 'D')} = ${co(v.K, 'C')}${E(k)} + ${co(q, 'D')}. Matching the exponential terms: ${co(v.K, 'C')} = ${n(v.A)}, so C = ${n(C)}. Matching the constants: ${co(q, 'D')} = ${n(v.B)}, so D = ${n(D)}. So yₚ = ${ex([[C, E(k)], [D, '']])}.`;
 const g1 = fam === 'poly'
  ? { prompt: `With yₚ = Ct + D, the left-hand side is ${co(q, 'C')}t + (${co(pp, 'C')} + ${co(q, 'D')}). Match the t terms with the right-hand side ${push}. What is C?`, explanation: `The t terms give ${co(q, 'C')} = ${n(v.A)}, so C = ${n(v.A)} ÷ ${n(q)} = ${n(C)}.` }
  : { prompt: `With yₚ = C${E(k)} + D, the left-hand side is (${nums([kk, pk, q])})C${E(k)} + ${co(q, 'D')} = ${co(v.K, 'C')}${E(k)} + ${co(q, 'D')}. Match the exponential terms with the right-hand side ${push}. What is C?`, explanation: `${co(v.K, 'C')} = ${n(v.A)}, so C = ${n(v.A)} ÷ ${n(v.K)} = ${n(C)}.` };
 const g2 = fam === 'poly'
  ? { prompt: `Now match the constant terms: ${co(pp, 'C')} + ${co(q, 'D')} = ${n(v.B)}, with C = ${n(C)}. What is D?`, explanation: `${n(pp * C)} + ${co(q, 'D')} = ${n(v.B)}, so ${co(q, 'D')} = ${n(v.B - pp * C)} and D = ${n(D)}.` }
  : { prompt: `Now match the constant terms: ${co(q, 'D')} = ${n(v.B)}. What is D?`, explanation: `The constant D has zero derivatives, so only ${co(q, 'D')} is left: D = ${n(v.B)} ÷ ${n(q)} = ${n(D)}.` };
 return { v, lhs, push, guess, intro, sol, g1, g2 }; };
const q18hints = ['Put the guess into the left-hand side: differentiate it twice, then collect the terms that match each part of the right-hand side.', 'Match coefficients: the terms of the same kind on both sides must agree, whether they are exponentials, terms with t, or constants. Solve for C first, then D.'];

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The heat-pump frame',
 brief: 'The heat pump shakes its frame while it spins up, and Mira wants the part of the frame’s motion that the push itself causes.',
 labels: ['C', 'D'], tolerance: 0.01,
 gl: [['C'], ['D']]
}, {
 canonical: { fam: 'poly', p: 3, q: 5, k: -1, C: 2, D: -1 },
 draw: R => q18draw(R, false, { fam: 'poly', p: 3, q: 5, k: -1, C: 2, D: -1 }),
 build: p => { const t = q18txt(p); return {
  prompt: `The heat pump’s frame has an offset y(t) that obeys ${t.lhs} = ${t.push}, where the right-hand side is ${t.intro}. By the method of undetermined coefficients, the particular solution has the same form as the push: yₚ = ${t.guess}. Enter C, then D.`,
  answer: [p.C, p.D], hints: q18hints, solution: t.sol,
  guidance: [{ prompt: t.g1.prompt, answer: [p.C], explanation: t.g1.explanation }, { prompt: t.g2.prompt, answer: [p.D], explanation: t.g2.explanation }] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'The warm-up push',
 brief: 'While the engine warms up it pushes on its mount, and Mira wants the offset that the push alone has caused at a given moment.',
 labels: ['C', 'D', 'yₚ at the time (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['C'], ['D'], ['yₚ at the time (cm, 3 d.p.)']]
}, {
 canonical: { fam: 'exp', p: 5, q: 4, k: -2, C: 3, D: 2, T: 1 },
 draw: R => q18draw(R, true, { fam: 'exp', p: 5, q: 4, k: -2, C: 3, D: 2, T: 1 }),
 build: p => { const t = q18txt(p), { T } = p, val = p.fam === 'poly' ? p.C * T + p.D : p.C * Math.exp(p.k * T) + p.D, V = r3(val), yp = p.fam === 'poly' ? ex([[p.C, 't'], [p.D, '']]) : ex([[p.C, E(p.k)], [p.D, '']]);
  const ev = p.fam === 'poly' ? `${n(p.C)} × ${n(T)} ${p.D < 0 ? '−' : '+'} ${n(Math.abs(p.D))}` : ex([[p.C, `e^(${n(p.k * T)})`], [p.D, '']]); return {
  prompt: `While the engine warms up, its mount’s offset y(t), in centimetres, obeys ${t.lhs} = ${t.push}, where the right-hand side is ${t.intro}. By the method of undetermined coefficients, the particular solution, the offset that the push alone causes, has the same form as the push: yₚ = ${t.guess}. Enter C, then D, then the value of yₚ at t = ${n(T)} s in centimetres, to 3 decimal places.`,
  answer: [p.C, p.D, V], hints: [...q18hints, 'Once C and D are known, put t into yₚ and round only at the end.'], solution: `${t.sol} At t = ${n(T)}, yₚ = ${ev} = ${f3(V)} cm to 3 decimal places.`,
  guidance: [{ prompt: t.g1.prompt, answer: [p.C], explanation: t.g1.explanation }, { prompt: t.g2.prompt, answer: [p.D], explanation: t.g2.explanation },
   { prompt: `So yₚ = ${yp}. What is yₚ at t = ${n(T)}, in cm to 3 decimal places?`, answer: [V], explanation: `${ev} = ${f3(V)} cm.` }] }; }
});

/* y″ + py′ + qy = Ke^(kt) + Bt + E, guess Ce^(kt) + Dt + F: K = (k² + pk + q)C, B = qD, E = pD + qF. */
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q13', title: 'The two-part push',
 brief: 'The engine pushes its mount in two ways at once, a steady climb and a fading kick, and Mira wants the offset each one causes.',
 labels: ['C', 'D', 'F'], tolerance: 0.01,
 gl: [['C'], ['D'], ['F']]
}, {
 canonical: { p: 3, q: 4, k: 1, C: 2, D: -3, F: 1 },
 draw: R => tries(() => ({ p: R.int(1, 6), q: R.int(1, 9), k: R.pick([-3, -2, -1, 1, 2, 3]), C: R.nz(-4, 4), D: R.nz(-4, 4), F: R.nz(-4, 4) }),
  p => p.k * p.k + p.p * p.k + p.q !== 0 && p.p * p.D + p.q * p.F !== 0, { p: 3, q: 4, k: 1, C: 2, D: -3, F: 1 }),
 build: ({ p, q, k, C, D, F }) => { const K = k * k + p * k + q, A = K * C, B = q * D, Ec = p * D + q * F, push = ex([[A, E(k)], [B, 't'], [Ec, '']]), kk = k * k, pk = p * k; return {
  prompt: `An engine mount’s offset y(t) obeys ${eq2(1, p, q, 'y')} = ${push}. The right-hand side has two kinds of part: an exponential and a straight line in t. The number ${n(k)} is not a root of the characteristic equation r² + ${co(p, 'r')} + ${n(q)} = 0. When a push has several kinds of part, the guess is the sum of the guess for each kind, so the particular solution is yₚ = C${E(k)} + Dt + F. Enter C, then D, then F.`,
  answer: [C, D, F],
  hints: ['Differentiate the guess twice and put it into the left-hand side. The exponential terms, the terms with t and the constants must each match the right-hand side separately.', 'Start with the exponential terms (they give C), then the terms with t (they give D), and last the constants, which use both D and F.'],
  solution: `For yₚ = C${E(k)} + Dt + F, yₚ′ = ${co(k, 'C')}${E(k)} + D and yₚ″ = ${co(kk, 'C')}${E(k)}. The left-hand side is (${nums([kk, pk, q])})C${E(k)} + ${co(q, 'D')}t + (${co(p, 'D')} + ${co(q, 'F')}) = ${co(K, 'C')}${E(k)} + ${co(q, 'D')}t + (${co(p, 'D')} + ${co(q, 'F')}). Exponential terms: ${co(K, 'C')} = ${n(A)}, so C = ${n(C)}. Terms with t: ${co(q, 'D')} = ${n(B)}, so D = ${n(D)}. Constants: ${co(p, 'D')} + ${co(q, 'F')} = ${n(Ec)}, so ${n(p * D)} + ${co(q, 'F')} = ${n(Ec)} and F = ${n(F)}.`,
  guidance: [
   { prompt: `The left-hand side is ${co(K, 'C')}${E(k)} + ${co(q, 'D')}t + (${co(p, 'D')} + ${co(q, 'F')}). Match the exponential terms with ${push}. What is C?`, answer: [C], explanation: `${co(K, 'C')} = ${n(A)}, so C = ${n(A)} ÷ ${n(K)} = ${n(C)}.` },
   { prompt: `Match the terms with t: ${co(q, 'D')} = ${n(B)}. What is D?`, answer: [D], explanation: `D = ${n(B)} ÷ ${n(q)} = ${n(D)}.` },
   { prompt: `Match the constants: ${co(p, 'D')} + ${co(q, 'F')} = ${n(Ec)}, with D = ${n(D)}. What is F?`, answer: [F], explanation: `${n(p * D)} + ${co(q, 'F')} = ${n(Ec)}, so ${co(q, 'F')} = ${n(Ec - p * D)} and F = ${n(F)}.` }
  ] }; }
});

/* ---- q19 Undetermined coefficients: sine and cosine forcing [2.5] ---- */

/* y″ + py′ + qy = F cos ωt + G sin ωt, guess A cos ωt + B sin ωt: with d = q − ω², s = pω the cos terms give dA + sB = F and the sin terms −sA + dB = G. */
const dd = p => { const d = p.q - p.w * p.w, s = p.p * p.w; return { d, s, N: d * d + s * s }; };
/* Pure cosine push F cos ωt (G = 0): A = Fd ÷ N, B = Fs ÷ N. Not the worked example (p = 2, q = 2, ω = 1) nor the parent (2, 13, 3). */
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The pump casing',
 brief: 'The coolant pump shakes its casing with a push that is a pure cosine, and Mira still needs both parts of the swing it settles into.',
 labels: ['A (3 d.p.)', 'B (3 d.p.)'], tolerance: 0.0005,
 gl: [['q − ω²'], ['pω'], ['A (3 d.p.)'], ['B (3 d.p.)']]
}, {
 canonical: { p: 3, q: 7, w: 2, F: 10 },
 draw: R => tries(() => ({ p: R.int(1, 5), q: R.int(1, 14), w: R.int(1, 4), F: R.nz(-14, 14) }),
  p => { const v = dd(p); return v.d !== 0 && nt(p.F * v.d / v.N) && nt(p.F * v.s / v.N) && !(p.p === 2 && p.q === 13 && p.w === 3) && !(p.p === 2 && p.q === 2 && p.w === 1); }, { p: 3, q: 7, w: 2, F: 10 }),
 build: p => { const { p: pp, q, w, F } = p, { d, s, N } = dd(p), A = r3(F * d / N), B = r3(F * s / N), push = ex([[F, ' cos ' + wt(w)]]); return {
  prompt: `The coolant pump shakes its casing with a push that turns at ${n(w)} rad/s. The casing’s offset y(t) obeys ${eq2(1, pp, q, 'y')} = ${push}, with t in seconds and angles in radians. The push is only a cosine, but by undetermined coefficients the particular solution still needs both parts: yₚ = A cos ${wt(w)} + B sin ${wt(w)}. Enter A, then B, each to 3 decimal places.`,
  answer: [A, B],
  hints: ['Differentiate the guess twice: the derivative of cos ωt is −ω sin ωt, and of sin ωt is ω cos ωt. Put the three pieces into the left-hand side.', 'Collect the cos terms and the sin terms separately and match each with the right-hand side. The sin part of this push is 0. That gives two equations for A and B. Round only at the end.'],
  solution: `yₚ′ = ${co(-w, 'A')} sin ${wt(w)} + ${co(w, 'B')} cos ${wt(w)} and yₚ″ = ${co(-w * w, 'A')} cos ${wt(w)} − ${co(w * w, 'B')} sin ${wt(w)}. In the left-hand side the cos terms add up to (${n(q)} − ${n(w * w)})A + ${n(pp)} × ${n(w)}B = ${ex([[d, 'A'], [s, 'B']])}, and the sin terms to ${ex([[-s, 'A'], [d, 'B']])}. Matching the right-hand side: ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} and ${ex([[-s, 'A'], [d, 'B']])} = 0. Solving the pair, A = ${n(F)} × ${par(d)} ÷ ${n(N)} = ${f3(A)} and B = ${n(F)} × ${n(s)} ÷ ${n(N)} = ${f3(B)}.`,
  guidance: [
   { prompt: `In the left-hand side, the cos terms add up to (q − ω²)A + pωB with q = ${n(q)}, ω = ${n(w)} and p = ${n(pp)}. What is q − ω²?`, answer: [d], explanation: `q − ω² = ${n(q)} − ${n(w * w)} = ${n(d)}. The −ω²A comes from yₚ″ and the pωB from yₚ′.` },
   { prompt: `What is pω = ${n(pp)} × ${n(w)}?`, answer: [s], explanation: `pω = ${n(s)}. The sin terms are −pωA + (q − ω²)B.` },
   { prompt: `Matching gives ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} (cos terms) and ${ex([[-s, 'A'], [d, 'B']])} = 0 (sin terms). What is A, to 3 decimal places?`, answer: [A], explanation: `From the second equation B = ${n(s)}A ÷ ${par(d)}. Putting that into the first gives (${n(d * d)} + ${n(s * s)})A ÷ ${par(d)} = ${n(F)}, so A = ${n(F)} × ${par(d)} ÷ ${n(N)} = ${f3(A)}.` },
   { prompt: `And what is B, to 3 decimal places?`, answer: [B], explanation: `B = ${n(s)}A ÷ ${par(d)} = ${n(F)} × ${n(s)} ÷ ${n(N)} = ${f3(B)}.` }
  ] }; }
});

/* A, B whole, F = dA + sB, G = −sA + dB; the largest offset √(A² + B²). */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The unbalanced fan',
 brief: 'An unbalanced fan shakes the vent housing, and Mira needs the swing it settles into and how far it throws the housing.',
 labels: ['A', 'B', 'largest offset (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['A'], ['B'], ['largest offset (cm, 3 d.p.)']]
}, {
 canonical: { p: 3, q: 10, w: 2, A: -2, B: 3 },
 draw: R => tries(() => ({ p: R.int(1, 5), q: R.int(1, 14), w: R.int(1, 4), A: R.nz(-5, 5), B: R.nz(-5, 5) }),
  p => nt(Math.hypot(p.A, p.B)) && !(p.p === 2 && p.q === 13 && p.w === 3 && p.A === 2 && p.B === -1), { p: 3, q: 10, w: 2, A: -2, B: 3 }),
 build: p => { const { p: pp, q, w, A, B } = p, { d, s, N } = dd(p), F = d * A + s * B, G = -s * A + d * B, H = Math.hypot(A, B), Hr = r3(H), push = ex([[F, ' cos ' + wt(w)], [G, ' sin ' + wt(w)]]); return {
  prompt: `An unbalanced fan shakes the vent housing with a push that turns at ${n(w)} rad/s. The housing’s offset y(t), in centimetres, obeys ${eq2(1, pp, q, 'y')} = ${push}, with t in seconds and angles in radians. By undetermined coefficients, the particular solution has the form yₚ = A cos ${wt(w)} + B sin ${wt(w)}. A swing A cos ωt + B sin ωt reaches a largest offset of √(A² + B²) on either side of rest. Enter A, then B, then that largest offset in centimetres, to 3 decimal places.`,
  answer: [A, B, Hr],
  hints: ['Differentiate the guess twice and put the three pieces into the left-hand side. Collect the cos terms and the sin terms separately and match each with the right-hand side. That gives two equations for A and B.', 'Once A and B are known, the largest offset is the square root of A² + B². Round only at the end.'],
  solution: `yₚ′ = ${co(-w, 'A')} sin ${wt(w)} + ${co(w, 'B')} cos ${wt(w)} and yₚ″ = ${co(-w * w, 'A')} cos ${wt(w)} − ${co(w * w, 'B')} sin ${wt(w)}. The cos terms add up to (${n(q)} − ${n(w * w)})A + ${n(pp)} × ${n(w)}B = ${ex([[d, 'A'], [s, 'B']])}, and the sin terms to ${ex([[-s, 'A'], [d, 'B']])}. Matching: ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} and ${ex([[-s, 'A'], [d, 'B']])} = ${n(G)}. Solving the pair, A = (${par(d)} × ${par(F)} − ${n(s)} × ${par(G)}) ÷ ${n(N)} = ${n(A)} and B = (${n(s)} × ${par(F)} + ${par(d)} × ${par(G)}) ÷ ${n(N)} = ${n(B)}. The largest offset is √(${n(A * A)} + ${n(B * B)}) = √${n(A * A + B * B)} = ${f3(Hr)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `The cos terms give ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} and the sin terms give ${ex([[-s, 'A'], [d, 'B']])} = ${n(G)}. What is A?`, answer: [A], explanation: `Solving the pair gives A = (${par(d)} × ${par(F)} − ${n(s)} × ${par(G)}) ÷ ${n(N)} = ${n(A)}.` },
   { prompt: `And what is B?`, answer: [B], explanation: `B = (${n(s)} × ${par(F)} + ${par(d)} × ${par(G)}) ÷ ${n(N)} = ${n(B)}.` },
   { prompt: `What is the largest offset √(A² + B²) = √(${n(A * A)} + ${n(B * B)}), in cm to 3 decimal places?`, answer: [Hr], explanation: `√${n(A * A + B * B)} = ${f3(Hr)} cm.` }
  ] }; }
});

/* Push = (qC)t + (pC + qD) + F cos ωt + G sin ωt, guess Ct + D + A cos ωt + B sin ωt. */
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'The ramp and the shake',
 brief: 'The engine mount is pushed by a rising load and a turning flywheel at the same time, and Mira wants the offset each one causes.',
 labels: ['C', 'D', 'A', 'B'], tolerance: 0.01,
 gl: [['C'], ['D'], ['A'], ['B']]
}, {
 canonical: { p: 2, q: 5, w: 3, C: 1, D: -2, A: 1, B: 2 },
 draw: R => tries(() => ({ p: R.int(1, 5), q: R.int(1, 12), w: R.int(1, 4), C: R.nz(-4, 4), D: R.nz(-4, 4), A: R.nz(-4, 4), B: R.nz(-4, 4) }),
  p => p.p * p.C + p.q * p.D !== 0 && !(p.p === 2 && p.q === 13 && p.w === 3), { p: 2, q: 5, w: 3, C: 1, D: -2, A: 1, B: 2 }),
 build: p => { const { p: pp, q, w, C, D, A, B } = p, { d, s, N } = dd(p), L1 = q * C, L0 = pp * C + q * D, F = d * A + s * B, G = -s * A + d * B, push = ex([[L1, 't'], [L0, ''], [F, ' cos ' + wt(w)], [G, ' sin ' + wt(w)]]); return {
  prompt: `The engine mount’s offset y(t) obeys ${eq2(1, pp, q, 'y')} = ${push}, with t in seconds and angles in radians. The push has a straight-line part and a turning part. When a push has several kinds of part, the guess is the sum of the guess for each kind, so the particular solution is yₚ = Ct + D + A cos ${wt(w)} + B sin ${wt(w)}. Enter C, then D, then A, then B.`,
  answer: [C, D, A, B],
  hints: ['Differentiate the guess twice and put it into the left-hand side. The terms with t, the constants, the cos terms and the sin terms must each match the right-hand side separately.', 'The straight-line part of the guess gives C and D on its own: the t terms first, then the constants. The cos and sin terms then give two equations for A and B.'],
  solution: `yₚ′ = C − ${co(w, 'A')} sin ${wt(w)} + ${co(w, 'B')} cos ${wt(w)}, and yₚ″ = −${co(w * w, 'A')} cos ${wt(w)} − ${co(w * w, 'B')} sin ${wt(w)}. The terms with t give ${co(q, 'C')} = ${n(L1)}, so C = ${n(C)}. The constants give ${co(pp, 'C')} + ${co(q, 'D')} = ${n(L0)}, so ${n(pp * C)} + ${co(q, 'D')} = ${n(L0)} and D = ${n(D)}. The cos terms give ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} and the sin terms ${ex([[-s, 'A'], [d, 'B']])} = ${n(G)}. Solving the pair, A = (${par(d)} × ${par(F)} − ${n(s)} × ${par(G)}) ÷ ${n(N)} = ${n(A)} and B = (${n(s)} × ${par(F)} + ${par(d)} × ${par(G)}) ÷ ${n(N)} = ${n(B)}.`,
  guidance: [
   { prompt: `The left-hand side has the terms ${co(q, 'C')}t + (${co(pp, 'C')} + ${co(q, 'D')}). Match the terms with t: ${co(q, 'C')} = ${n(L1)}. What is C?`, answer: [C], explanation: `C = ${n(L1)} ÷ ${n(q)} = ${n(C)}.` },
   { prompt: `Match the constants: ${co(pp, 'C')} + ${co(q, 'D')} = ${n(L0)}, with C = ${n(C)}. What is D?`, answer: [D], explanation: `${n(pp * C)} + ${co(q, 'D')} = ${n(L0)}, so ${co(q, 'D')} = ${n(L0 - pp * C)} and D = ${n(D)}.` },
   { prompt: `The cos terms give ${ex([[d, 'A'], [s, 'B']])} = ${n(F)} and the sin terms give ${ex([[-s, 'A'], [d, 'B']])} = ${n(G)}. What is A?`, answer: [A], explanation: `A = (${par(d)} × ${par(F)} − ${n(s)} × ${par(G)}) ÷ ${n(N)} = ${n(A)}.` },
   { prompt: 'And what is B?', answer: [B], explanation: `B = (${n(s)} × ${par(F)} + ${par(d)} × ${par(G)}) ÷ ${n(N)} = ${n(B)}.` }
  ] }; }
});

/* ---- q20 Forced oscillations: the steady amplitude [2.6] ---- */

/* mx″ + cx′ + kx = F cos or sin ωt: amplitude F ÷ √((k − mω²)² + (cω)²). Not the worked example (1, 2, 7, 10, 2) nor the parent (2, 3, 40, 12, 4). */
const s20 = p => { const d = p.k - p.m * p.w * p.w, s = p.c * p.w, S = d * d + s * s; return { d, s, S, C: p.F / Math.sqrt(S) }; };
const b20 = p => !(p.m === 1 && p.c === 2 && p.k === 7 && p.F === 10 && p.w === 2) && !(p.m === 2 && p.c === 3 && p.k === 40 && p.F === 12 && p.w === 4);
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'The pump bracket',
 brief: 'The water pump’s bracket shakes in a steady rhythm once the pump is running, and Mira needs to know how far it swings.',
 labels: ['amplitude C (m, 3 d.p.)'], tolerance: 0.0005,
 gl: [['k − mω²'], ['cω'], ['sum of squares'], ['amplitude C (m, 3 d.p.)']]
}, {
 canonical: { m: 3, c: 5, k: 50, F: 15, w: 4 },
 draw: R => tries(() => ({ m: R.int(1, 6), c: R.int(1, 9), k: R.int(10, 90), F: R.int(2, 30), w: R.int(1, 7) }),
  p => { const v = s20(p); return b20(p) && nt(v.C) && v.C > 0.005; }, { m: 3, c: 5, k: 50, F: 15, w: 4 }),
 build: p => { const { m, c, k, F, w } = p, { d, s, S, C } = s20(p), Cr = r3(C); return {
  prompt: `A water pump’s bracket has mass m = ${n(m)} kg and sits on a spring of stiffness k = ${n(k)} N/m with damping c = ${n(c)} N·s/m. The pump pushes it with a force of ${n(F)} sin ${wt(w)} newtons, so ${eq2(m, c, k, 'x')} = ${n(F)} sin ${wt(w)} (x in metres, t in seconds, angles in radians). Once the start-up wobble has died away, the bracket follows the steady periodic solution. A push of F₀ sin ωt gives the same steady amplitude as a push of F₀ cos ωt: only the timing of the swing is shifted. Enter the amplitude C of the steady swing in metres, to 3 decimal places.`,
  answer: [Cr],
  hints: ['The steady periodic solution is the particular solution A cos ωt + B sin ωt from undetermined coefficients, and its amplitude is C = √(A² + B²).', 'Worked out in general, that amplitude is C = F₀ ÷ √((k − mω²)² + (cω)²). Square each part before adding.'],
  solution: `Here F₀ = ${n(F)} and ω = ${n(w)}. k − mω² = ${n(k)} − ${n(m)} × ${n(w * w)} = ${n(d)} and cω = ${n(c)} × ${n(w)} = ${n(s)}. So (k − mω²)² + (cω)² = ${n(d * d)} + ${n(s * s)} = ${n(S)}, and C = ${n(F)} ÷ √${n(S)} = ${C.toFixed(4)}…, which is ${f3(Cr)} m to 3 decimal places.`,
  guidance: [
   { prompt: `What is k − mω² = ${n(k)} − ${n(m)} × ${n(w)}²?`, answer: [d], explanation: `${n(m)} × ${n(w * w)} = ${n(m * w * w)}, so k − mω² = ${n(d)}.` },
   { prompt: `What is cω = ${n(c)} × ${n(w)}?`, answer: [s], explanation: `cω = ${n(s)}. This is the damper’s share, and it keeps the amplitude finite.` },
   { prompt: 'What is (k − mω²)² + (cω)²?', answer: [S], explanation: `${n(d)}² + ${n(s)}² = ${n(d * d)} + ${n(s * s)} = ${n(S)}.` },
   { prompt: `What is the amplitude C = ${n(F)} ÷ √${n(S)}, to 3 decimal places?`, answer: [Cr], explanation: `√${n(S)} = ${Math.sqrt(S).toFixed(4)}…, and ${n(F)} ÷ √${n(S)} = ${C.toFixed(4)}…, which is ${f3(Cr)} m.` }
  ] }; }
});

/* The steady amplitude is proportional to F₀: C = F ÷ √S, and the largest force that keeps C within L is L·√S. */
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'The sensor limit',
 brief: 'A delicate sensor sits on the engine mount and fails if the mount swings too far, so Mira needs the swing and the biggest push it can take.',
 labels: ['amplitude C (m, 3 d.p.)', 'largest force (N, 3 d.p.)'], tolerance: 0.0005,
 gl: [['sum of squares'], ['amplitude C (m, 3 d.p.)'], ['largest force (N, 3 d.p.)']]
}, {
 canonical: { m: 2, c: 6, k: 60, F: 20, w: 5, L: 0.25 },
 draw: R => tries(() => ({ m: R.int(1, 6), c: R.int(1, 9), k: R.int(10, 90), F: R.int(2, 30), w: R.int(1, 7), L: R.pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5]) }),
  p => { const v = s20(p); return b20(p) && nt(v.C) && v.C > 0.005 && nt(p.L * Math.sqrt(v.S)); }, { m: 2, c: 6, k: 60, F: 20, w: 5, L: 0.25 }),
 build: p => { const { m, c, k, F, w, L } = p, { d, s, S, C } = s20(p), Cr = r3(C), Fm = L * Math.sqrt(S), Fr = r3(Fm); return {
  prompt: `A sensor sits on an engine mount of mass m = ${n(m)} kg, on a spring of stiffness k = ${n(k)} N/m with damping c = ${n(c)} N·s/m. The engine pushes the mount with a force of ${n(F)} cos ${wt(w)} newtons, so ${eq2(m, c, k, 'x')} = ${n(F)} cos ${wt(w)} (x in metres, t in seconds, angles in radians). Once the start-up wobble has died away, the steady amplitude C is proportional to the size F₀ of the push: twice the force gives twice the amplitude. The sensor fails if the mount swings further than ${n(L)} m from rest. Enter the steady amplitude C in metres, then the largest force size F₀ in newtons that keeps the amplitude at ${n(L)} m or less (the same ω), each to 3 decimal places.`,
  answer: [Cr, Fr],
  hints: ['The steady amplitude is C = F₀ ÷ √((k − mω²)² + (cω)²). Square each part before adding.', 'Because C is proportional to F₀, the largest allowed force is the allowed amplitude times √((k − mω²)² + (cω)²). Round only at the end.'],
  solution: `k − mω² = ${n(k)} − ${n(m)} × ${n(w * w)} = ${n(d)} and cω = ${n(c)} × ${n(w)} = ${n(s)}, so (k − mω²)² + (cω)² = ${n(d * d)} + ${n(s * s)} = ${n(S)}. The amplitude is C = ${n(F)} ÷ √${n(S)} = ${C.toFixed(4)}…, which is ${f3(Cr)} m. Since C = F₀ ÷ √${n(S)}, the force that gives C = ${n(L)} is F₀ = ${n(L)} × √${n(S)} = ${Fm.toFixed(4)}…, which is ${f3(Fr)} N to 3 decimal places.`,
  guidance: [
   { prompt: `What is (k − mω²)² + (cω)² = (${n(k)} − ${n(m)} × ${n(w)}²)² + (${n(c)} × ${n(w)})²?`, answer: [S], explanation: `k − mω² = ${n(d)} and cω = ${n(s)}, so the sum is ${n(d * d)} + ${n(s * s)} = ${n(S)}.` },
   { prompt: `What is the amplitude C = ${n(F)} ÷ √${n(S)}, in metres to 3 decimal places?`, answer: [Cr], explanation: `√${n(S)} = ${Math.sqrt(S).toFixed(4)}…, and ${n(F)} ÷ √${n(S)} = ${C.toFixed(4)}…, which is ${f3(Cr)} m.` },
   { prompt: `C = F₀ ÷ √${n(S)}. What force F₀ gives C = ${n(L)}, in newtons to 3 decimal places?`, answer: [Fr], explanation: `F₀ = ${n(L)} × √${n(S)} = ${Fm.toFixed(4)}…, which is ${f3(Fr)} N.` }
  ] }; }
});

/* k = m·w0², so k − mω² = 0 at ω = w0 and the amplitude is F ÷ (c·w0); at ω₁ = a·w0 it is F ÷ √((m·w0²(1 − a²))² + (c·ω₁)²). */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q16', title: 'Running at the natural rate',
 brief: 'Mira wants to know what happens when the engine runs exactly at the mount’s own natural rate, and at a different speed.',
 labels: ['ω₀ (rad/s)', 'amplitude at ω₀ (m, 3 d.p.)', 'amplitude at the other speed (m, 3 d.p.)'], tolerance: 0.0005,
 gl: [['ω₀ (rad/s)'], ['amplitude at ω₀ (m, 3 d.p.)'], ['k − mω² at the other speed'], ['amplitude at the other speed (m, 3 d.p.)']]
}, {
 canonical: { m: 2, w0: 4, c: 3, F: 24, a: 2 },
 draw: R => tries(() => ({ m: R.int(1, 5), w0: R.int(2, 6), c: R.int(1, 8), F: R.int(2, 30), a: R.pick([0.5, 2]) }),
  p => { const k = p.m * p.w0 * p.w0, w1 = p.a * p.w0, C0 = p.F / (p.c * p.w0), C1 = p.F / Math.sqrt(Math.pow(k - p.m * w1 * w1, 2) + Math.pow(p.c * w1, 2)); return nt(C0) && nt(C1) && !(p.m === 2 && k === 40 && p.c === 3); }, { m: 2, w0: 4, c: 3, F: 24, a: 2 }),
 build: ({ m, w0, c, F, a }) => { const k = m * w0 * w0, w1 = a * w0, C0 = F / (c * w0), C0r = r3(C0), d1 = k - m * w1 * w1, s1 = c * w1, S1 = d1 * d1 + s1 * s1, C1 = F / Math.sqrt(S1), C1r = r3(C1); return {
  prompt: `An engine mount of mass m = ${n(m)} kg sits on a spring of stiffness k = ${n(k)} N/m with damping c = ${n(c)} N·s/m. The engine pushes it with a force of ${n(F)} cos ωt newtons, so ${eq2(m, c, k, 'x')} = ${n(F)} cos ωt (x in metres, t in seconds, angles in radians). Once the start-up wobble has died away, the mount follows the steady periodic solution. Enter the natural angular frequency ω₀ = √(k ÷ m) in rad/s, then the steady amplitude in metres when the engine runs at ω = ω₀, then the steady amplitude in metres when it runs at ω = ${n(w1)} rad/s, each of the amplitudes to 3 decimal places.`,
  answer: [w0, C0r, C1r],
  hints: ['The natural angular frequency is √(k ÷ m). The steady amplitude is C = F₀ ÷ √((k − mω²)² + (cω)²), and k − mω² is 0 when ω is the natural angular frequency.', 'For the second speed, work out k − mω² and cω with the new ω, square each, add, and divide F₀ by the square root. Round only at the end.'],
  solution: `ω₀ = √(${n(k)} ÷ ${n(m)}) = √${n(w0 * w0)} = ${n(w0)} rad/s. At ω = ω₀, k − mω² = 0, so C = F₀ ÷ (cω) = ${n(F)} ÷ (${n(c)} × ${n(w0)}) = ${C0.toFixed(4)}…, which is ${f3(C0r)} m. At ω = ${n(w1)}, k − mω² = ${n(k)} − ${n(m)} × ${n(w1 * w1)} = ${n(d1)} and cω = ${n(c)} × ${n(w1)} = ${n(s1)}, so the sum of squares is ${n(d1 * d1)} + ${n(s1 * s1)} = ${n(S1)} and C = ${n(F)} ÷ √${n(S1)} = ${C1.toFixed(4)}…, which is ${f3(C1r)} m.`,
  guidance: [
   { prompt: `What is ω₀ = √(k ÷ m) = √(${n(k)} ÷ ${n(m)}), in rad/s?`, answer: [w0], explanation: `${n(k)} ÷ ${n(m)} = ${n(w0 * w0)}, and √${n(w0 * w0)} = ${n(w0)} rad/s.` },
   { prompt: `At ω = ω₀ the term k − mω² is 0, so C = F₀ ÷ (cω). What is C = ${n(F)} ÷ (${n(c)} × ${n(w0)}), in metres to 3 decimal places?`, answer: [C0r], explanation: `${n(c)} × ${n(w0)} = ${n(c * w0)}, and ${n(F)} ÷ ${n(c * w0)} = ${C0.toFixed(4)}…, which is ${f3(C0r)} m.` },
   { prompt: `At ω = ${n(w1)} rad/s, what is k − mω² = ${n(k)} − ${n(m)} × ${n(w1)}²?`, answer: [d1], explanation: `${n(m)} × ${n(w1 * w1)} = ${n(m * w1 * w1)}, so k − mω² = ${n(d1)}.` },
   { prompt: `With cω = ${n(c)} × ${n(w1)} = ${n(s1)}, what is the amplitude C = ${n(F)} ÷ √(${n(d1)}² + ${n(s1)}²), in metres to 3 decimal places?`, answer: [C1r], explanation: `${n(d1 * d1)} + ${n(s1 * s1)} = ${n(S1)}, and ${n(F)} ÷ √${n(S1)} = ${C1.toFixed(4)}…, which is ${f3(C1r)} m.` }
  ] }; }
});

})();
