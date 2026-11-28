/* Complex analysis: the plane of numbers practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p2.js. */
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
/* cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4'. */
const cx = (a, b) => { if (b === 0) return n(a); const im = (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; if (a === 0) return (b < 0 ? '−' : '') + im; return `${n(a)} ${b < 0 ? '−' : '+'} ${im}`; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* piT(5, 6) is '5π ÷ 6', piT(2, 4) is 'π ÷ 2', piT(−8, 4) is '−2π', piT(0, 4) is '0'. */
const piT = (p, q) => { if (p === 0) return '0'; const g = gcd(p, q); p /= g; q /= g; const top = p === 1 ? 'π' : p === -1 ? '−π' : n(p) + 'π'; return q === 1 ? top : `${top} ÷ ${n(q)}`; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).replace('-', '⁻').replace(/\d/g, d => SUP[d]);
const r2 = x => { const r = Math.round(x * 100) / 100; return r === 0 ? 0 : r; };
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const d2 = x => r2(x).toFixed(2).replace('-', '−');
/* Near a rounding tie at the second decimal: such draws are skipped. */
const nearTie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-3;
const rd = x => exact2(x) ? `= ${n(x)}` : `≈ ${n(x)}, which is ${d2(x)} to 2 decimal places`;
const exactText = v => { const s = v < 0 ? '−' : '', a = Math.abs(v); if (a < 1e-9) return '0'; if (Math.abs(a - 1) < 1e-9) return s + '1';
 if (Math.abs(a - 0.5) < 1e-9) return s + '1 ÷ 2'; if (Math.abs(a - Math.SQRT1_2) < 1e-9) return s + '√2 ÷ 2'; return s + '√3 ÷ 2'; };
const rootName = k => ({ 2: 'square', 3: 'cube', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth' })[k] + ' roots';
const sg = k => `${k < 0 ? '−' : '+'} ${n(Math.abs(k))}`;
const co = x => x === 1 ? '' : x === -1 ? '−' : n(x);
const pick = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const sgn = R => R.bool() ? 1 : -1;
const stepsText = k => k === 1 ? '1 step' : `${n(k)} steps`;
const turnsText = j => j === 1 ? 'one whole turn' : `${n(j)} whole turns`;
/* The principal argument of a + bi (both non-zero) worked through its reference angle. */
const argWork = (a, b) => { const ref = Math.atan(Math.abs(b) / Math.abs(a)), arg = Math.atan2(b, a);
 const place = a > 0 && b > 0 ? 'above the real axis and to the right of the imaginary axis (quadrant 1)'
  : a < 0 && b > 0 ? 'above the real axis and to the left of the imaginary axis (quadrant 2)'
  : a < 0 ? 'below the real axis and to the left of the imaginary axis (quadrant 3)' : 'below the real axis and to the right of the imaginary axis (quadrant 4)';
 const rule = a > 0 && b > 0 ? 'Arg z is the angle itself' : a < 0 && b > 0 ? 'Arg z = π − angle' : a < 0 ? 'Arg z = −(π − angle)' : 'Arg z = −angle';
 return { ref, arg, place, rule }; };
/* Skips draws where rounding the reference angle first would change the second decimal of Arg. */
const argOk = (a, b) => { const w = argWork(a, b), rr = r2(w.ref), alt = a > 0 ? (b > 0 ? rr : -rr) : (b > 0 ? Math.PI - rr : -(Math.PI - rr));
 return !nearTie(w.ref) && !nearTie(w.arg) && r2(alt) === r2(w.arg); };
/* The roots of zᵖ = w for w = ρᵖ times 1, i, −1 or −i (dir 0, 1, 2, 3): arguments (h + 4k)π ÷ (2p) where hπ ÷ 2 is Arg w. */
const rootsOf = (p, rho, dir) => { const W = Math.pow(rho, p), h = [0, 1, 2, -1][dir], w = [cx(W, 0), cx(0, W), cx(-W, 0), cx(0, -W)][dir];
 const nums = []; for (let k = 0; k < p; k++) nums.push(h + 4 * k); const best = Math.min(...nums.filter(v => v > 0));
 return { W, h, w, best, list: nums.map(v => piT(v, 2 * p)).join(', '), ang: best * Math.PI / (2 * p) }; };

/* ---- q06 nth roots and roots of unity [1.6] ---- */

mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The ring of dishes',
 brief: 'A ring of dishes is to stand round the mast, one at each solution of an equation, and the crew needs its radius and spacing.',
 labels: ['radius of the ring', 'angle between neighbouring dishes', 'imaginary part'], tolerance: 0.005,
 gl: [['radius of the ring'], ['angle between neighbouring dishes'], ['imaginary part']]
}, {
 /* w = ρᵖ times 1, i, −1 or −i with p from 3 to 7 and ρ 2 or 3. Not the parent's worked example (4th roots of 1) or its mission (cube roots of −8).
    The imaginary part is not 0 and no answer is near a rounding tie. */
 canonical: { p: 5, rho: 2, dir: 1 },
 draw: R => pick(() => ({ p: R.int(3, 7), rho: R.int(2, 3), dir: R.int(0, 3) }),
  x => { const t = rootsOf(x.p, x.rho, x.dir), im = x.rho * Math.sin(t.ang); return !(x.p === 3 && x.rho === 2 && x.dir === 2) && Math.abs(im) > 0.05 && !nearTie(im) && !nearTie(2 * Math.PI / x.p); }, { p: 5, rho: 2, dir: 1 }),
 build: ({ p, rho, dir }) => { const t = rootsOf(p, rho, dir), gap = 2 * Math.PI / p, im = rho * Math.sin(t.ang), name = rootName(p), bp = piT(t.best, 2 * p); return {
  prompt: `A ring of ${n(p)} dishes is to stand round the mast at 0 in the Antenna Field, one dish at each solution of z${sup(p)} = w, where w = ${t.w}: the dishes sit at the ${name} of w. Enter the radius of the ring (the common modulus of the roots), the angle in radians between neighbouring dishes, and the imaginary part of the dish with the smallest positive argument, each to 2 decimal places.`,
  answer: [rho, r2(gap), r2(im)],
  hints: ['All the nth roots of w have the same modulus r, the positive real number with rⁿ = |w|. That is the radius of the ring.', 'The roots split a full turn of 2π into n equal steps, so neighbouring dishes are one step apart. If Arg w = φ, their arguments are (φ + 2πk) ÷ n for k = 0, 1, …, n − 1. Take the smallest that is greater than 0; its imaginary part is r sin(argument).'],
  solution: `w = ${t.w} has modulus ${n(t.W)} and argument φ = ${piT(t.h, 2)}. Every root has modulus ${n(rho)}, because ${n(rho)}${sup(p)} = ${n(t.W)}, so the ring has radius ${n(rho)}. The ${n(p)} dishes split a full turn of 2π into ${n(p)} equal steps, so neighbouring dishes are 2π ÷ ${n(p)} radians apart, and 2π ÷ ${n(p)} ${rd(gap)}. The arguments are ${t.list}; the smallest positive one is ${bp}, so that dish has imaginary part ${n(rho)} × sin(${bp}) ${rd(im)}.`,
  guidance: [
   { prompt: `|w| = ${n(t.W)}. Which positive real number r has r${sup(p)} = ${n(t.W)}? That is the radius of the ring.`, answer: [rho], explanation: `${n(rho)}${sup(p)} = ${n(t.W)}, so every root has modulus ${n(rho)}.` },
   { prompt: `The ${n(p)} dishes share one full turn of 2π equally. What is the angle between neighbouring dishes, 2π ÷ ${n(p)}, to 2 decimal places?`, answer: [r2(gap)], explanation: `2π ÷ ${n(p)} ${rd(gap)}.` },
   { prompt: `The arguments of the dishes are ${t.list}. Take the smallest one greater than 0. What is the imaginary part of that dish, to 2 decimal places?`, answer: [r2(im)], explanation: `The smallest positive argument is ${bp}, so the imaginary part is ${n(rho)} × sin(${bp}) ${rd(im)}.` }
  ] }; }
});

mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The relay mast cable',
 brief: 'A relay mast has equal arms at the roots of a number, and a cable must be cut to join two of the arm tips.',
 labels: ['arm length', 'real part of the tip', 'cable length'], tolerance: 0.005,
 gl: [['arm length'], ['real part of the tip'], ['cable length']]
}, {
 /* w = ρᵖ is positive, so arm 0 ends at ρ. p from 5 to 9, ρ 2 to 6 (ρᵖ at most 20000), and m < p ÷ 2 so the tip is above the real axis.
    Draws are skipped when rounding the tip's parts before finding the distance changes the last digit. */
 canonical: { p: 6, rho: 3, m: 2 },
 draw: R => pick(() => ({ p: R.int(5, 9), rho: R.int(2, 6), m: R.int(1, 4) }),
  x => { if (2 * x.m >= x.p || Math.pow(x.rho, x.p) > 20000) return false; const a = 2 * Math.PI * x.m / x.p, re = x.rho * Math.cos(a), im = x.rho * Math.sin(a), len = Math.hypot(re - x.rho, im);
   return !nearTie(re) && !nearTie(len) && r2(Math.hypot(r2(re) - x.rho, r2(im))) === r2(len); }, { p: 6, rho: 3, m: 2 }),
 build: ({ p, rho, m }) => { const W = Math.pow(rho, p), a = 2 * Math.PI * m / p, re = rho * Math.cos(a), im = rho * Math.sin(a), len = Math.hypot(re - rho, im), name = rootName(p), ang = piT(2 * m, p),
  cv = exactText(Math.cos(a)); return {
  prompt: `A relay mast in the Antenna Field carries ${n(p)} equal arms, and the arm tips sit at the ${name} of w = ${n(W)}, one tip at each solution of z${sup(p)} = w. Arm 0 ends on the positive real axis, and the other arms are numbered 1, 2, … going anticlockwise round the mast at 0. A cable joins the tip of arm 0 to the tip of arm ${n(m)}. Enter the length of an arm, the real part of the tip of arm ${n(m)}, and the length of the cable, each to 2 decimal places. The length of the cable is the distance between the two tips, and the distance between a and b is |a − b|. Work with unrounded values.`,
  answer: [rho, r2(re), r2(len)],
  hints: ['The nth roots of a positive real number R all have modulus r, where rⁿ = R, and one of them is r itself on the positive real axis. Neighbouring roots are 2π ÷ n apart, so going anticlockwise, the root numbered k from that one has argument 2πk ÷ n.', 'A root with modulus r and argument α is r(cos α + i sin α). The distance between two points is the modulus of their difference: |a − b| = √((Re a − Re b)² + (Im a − Im b)²).'],
  solution: `w = ${n(W)} is positive, so every root has modulus ${n(rho)}, because ${n(rho)}${sup(p)} = ${n(W)}: each arm is ${n(rho)} long, and arm 0 ends at ${n(rho)}. Neighbouring arms are 2π ÷ ${n(p)} apart, so arm ${n(m)} has argument 2π × ${n(m)} ÷ ${n(p)} = ${ang}. Its tip is ${n(rho)}(cos(${ang}) + i sin(${ang})) = ${cx(re, im)}, so its real part is ${n(rho)} × (${cv}) ${rd(re)}. The cable is |tip of arm ${n(m)} − ${n(rho)}| = √((${n(re)} − ${n(rho)})² + (${n(im)})²) ${rd(len)}.`,
  guidance: [
   { prompt: `|w| = ${n(W)}. Which positive real number r has r${sup(p)} = ${n(W)}? That is the length of every arm.`, answer: [rho], explanation: `${n(rho)}${sup(p)} = ${n(W)}, so each arm is ${n(rho)} long.` },
   { prompt: `Neighbouring arms are 2π ÷ ${n(p)} apart, so the tip of arm ${n(m)} is at the angle 2π × ${n(m)} ÷ ${n(p)} = ${ang}. The real part of that tip is ${n(rho)} cos(${ang}). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${ang}) = ${cv}, so the real part is ${n(rho)} × (${cv}) ${rd(re)}.` },
   { prompt: `The tip of arm 0 is at ${n(rho)}, and the tip of arm ${n(m)} is at about ${cx(re, im)} (keep the unrounded values in your calculator). What is the distance between the two tips, to 2 decimal places?`, answer: [r2(len)], explanation: `The distance is √((${n(re)} − ${n(rho)})² + (${n(im)})²) ${rd(len)}.` }
  ] }; }
});

mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q05', title: 'Roots of a repeated stage',
 brief: 'A test signal has passed through several identical stages, and the array must find every signal that matches it after fewer stages.',
 labels: ['common modulus', 'smallest positive argument', 'real part'], tolerance: 0.005,
 gl: [['t (angle of w in steps of π ÷ 4)'], ['common modulus'], ['smallest positive argument'], ['real part']]
}, {
 /* z0 = ±1 ± i (modulus √2, angle mπ ÷ 4 with m odd), w = z0ˢ with s from 5 to 11, and p from 3 to 6.
    t = s·m mod 8 is the angle of w in steps of π ÷ 4; t is not 0, and cos is not 0 so the real part is not 0. */
 canonical: { a: -1, b: 1, s: 7, p: 3 },
 draw: R => pick(() => ({ a: sgn(R), b: sgn(R), s: R.int(5, 11), p: R.int(3, 6) }),
  x => { const m = x.a > 0 ? (x.b > 0 ? 1 : 7) : (x.b > 0 ? 3 : 5), t = (x.s * m) % 8; if (t === 0) return false;
   const Rm = Math.pow(2, x.s / (2 * x.p)), ar = t * Math.PI / (4 * x.p), re = Rm * Math.cos(ar);
   return !nearTie(Rm) && !nearTie(ar) && !nearTie(re) && Math.abs(re) > 0.05 && r2(r2(Rm) * Math.cos(r2(ar))) === r2(re); }, { a: -1, b: 1, s: 7, p: 3 }),
 build: ({ a, b, s, p }) => { const m = a > 0 ? (b > 0 ? 1 : 7) : (b > 0 ? 3 : 5), t = (s * m) % 8, Rm = Math.pow(2, s / (2 * p)), ar = t * Math.PI / (4 * p), re = Rm * Math.cos(ar), name = rootName(p),
  e = `2^(${n(s)} ÷ ${n(2 * p)})`; return {
  prompt: `A test signal in the Antenna Field passes through ${n(s)} identical stages, and each stage multiplies it by z0 = ${cx(a, b)}. Starting from 1, it ends as w = z0${sup(s)}. The array must now find every signal z with z${sup(p)} = w, the ${name} of w. Enter the common modulus of these roots, the smallest positive argument among them in radians, and the real part of the root with that argument, each to 2 decimal places. Work with unrounded values.`,
  answer: [r2(Rm), r2(ar), r2(re)],
  hints: ['z0 = ±1 ± i has modulus √2 and an argument that is an odd multiple of π ÷ 4. By de Moivre\'s formula z0ˢ has modulus (√2)ˢ and an argument s times as large; take away whole turns of 2π to see where w points.', 'The roots of w have modulus |w|^(1 ÷ p) and arguments (φ + 2πk) ÷ p, so neighbouring roots are 2π ÷ p apart. If φ is between 0 and 2π, the root from k = 0 lies between 0 and 2π ÷ p, and it is the smallest positive one.'],
  solution: `z0 = ${cx(a, b)} has modulus √2 and argument ${piT(m, 4)}. By de Moivre's formula w = z0${sup(s)} has modulus (√2)${sup(s)} = 2^(${n(s)} ÷ 2) and argument ${n(s)} × ${piT(m, 4)} = ${piT(s * m, 4)}; taking away whole turns of 2π leaves ${piT(t, 4)}, which is ${stepsText(t)} of π ÷ 4. The roots have modulus (2^(${n(s)} ÷ 2))^(1 ÷ ${n(p)}) = ${e} ${rd(Rm)}. Their arguments are (${piT(t, 4)} + 2πk) ÷ ${n(p)}, ${n(p)} directions 2π ÷ ${n(p)} apart. The one from k = 0 is ${piT(t, 4 * p)} ${rd(ar)}, between 0 and 2π ÷ ${n(p)}, so it is the smallest positive one. Its real part is ${e} × cos(${piT(t, 4 * p)}) ${rd(re)}.`,
  guidance: [
   { prompt: `z0 = ${cx(a, b)} has modulus √2 and argument ${piT(m, 4)}. By de Moivre's formula w has argument ${n(s)} × ${piT(m, 4)} = ${piT(s * m, 4)}. Take away whole turns of 2π (each is 8 steps of π ÷ 4). The angle left is tπ ÷ 4 with t from 1 to 7: what is t?`, answer: [t], explanation: `${n(s * m)} steps of π ÷ 4, less whole turns of 8 steps, leaves ${stepsText(t)}, so w points at ${piT(t, 4)}.` },
   { prompt: `|w| = (√2)${sup(s)} = 2^(${n(s)} ÷ 2). Every root has modulus |w|^(1 ÷ ${n(p)}) = ${e}. What is it, to 2 decimal places?`, answer: [r2(Rm)], explanation: `${e} ${rd(Rm)}.` },
   { prompt: `The roots have arguments (${piT(t, 4)} + 2πk) ÷ ${n(p)}. The one from k = 0, which is ${n(t)}π ÷ ${n(4 * p)}, lies between 0 and 2π ÷ ${n(p)}, so it is the smallest positive one. What is it, to 2 decimal places?`, answer: [r2(ar)], explanation: `${piT(t, 4 * p)} ${rd(ar)}.` },
   { prompt: `The root with that argument has modulus ${n(r2(Rm))} (to 2 places; keep the unrounded value) and argument ${n(r2(ar))} (likewise). What is its real part, to 2 decimal places?`, answer: [r2(re)], explanation: `${e} × cos(${piT(t, 4 * p)}) ${rd(re)}.` }
  ] }; }
});

/* ---- q07 Functions as maps [1.8] ---- */

mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The sweep lens',
 brief: 'The rotor hall has a sweep lens that bends every reading, and the crew needs the parts of what it shows at two readings.',
 labels: ['u', 'v', 'Im f at the second reading'], tolerance: 0.01,
 gl: [['u'], ['v'], ['Im f']]
}, {
 /* f(z) = z² + kz with k a real whole number, |k| from 2 to 5: u = x² − y² + kx and v = 2xy + ky. The parent's map is z² + c with c complex. */
 canonical: { k: 3, x1: 2, y1: -1, x2: -1, y2: 3 },
 draw: R => pick(() => ({ k: R.nz(-5, 5), x1: R.nz(-4, 4), y1: R.nz(-4, 4), x2: R.nz(-4, 4), y2: R.nz(-4, 4) }),
  x => Math.abs(x.k) >= 2 && !(x.x1 === x.x2 && x.y1 === x.y2), { k: 3, x1: 2, y1: -1, x2: -1, y2: 3 }),
 build: ({ k, x1, y1, x2, y2 }) => { const u = x1 * x1 - y1 * y1 + k * x1, v = 2 * x1 * y1 + k * y1, V = 2 * x2 * y2 + k * y2; return {
  prompt: `The sweep lens in the Rotor Hall bends each reading z into an output w = f(z) = z² + kz, where k = ${n(k)} is a real number. Writing z = x + yi and w = u + vi, the output has a real part u(x, y) and an imaginary part v(x, y). Enter u and v for the reading z = ${cx(x1, y1)}, then the imaginary part of f(z) for a second reading z = ${cx(x2, y2)}.`,
  answer: [u, v, V],
  hints: ['Expand (x + yi)² = x² − y² + 2xyi. Since k is a real number, kz = kx + kyi: k multiplies both parts of z.', 'Add the real terms for u(x, y) and the terms in front of i for v(x, y). Put in the x and the y of each reading.'],
  solution: `With z = x + yi, z² = x² − y² + 2xyi and kz = ${n(k)}x ${sg(k)}yi, so u(x, y) = x² − y² ${sg(k)}x and v(x, y) = 2xy ${sg(k)}y. At z = ${cx(x1, y1)}: u = ${par(x1)}² − ${par(y1)}² ${sg(k)} × ${par(x1)} = ${n(x1 * x1)} − ${n(y1 * y1)} ${sg(k * x1)} = ${n(u)} and v = 2 × ${par(x1)} × ${par(y1)} ${sg(k)} × ${par(y1)} = ${n(2 * x1 * y1)} ${sg(k * y1)} = ${n(v)}. At z = ${cx(x2, y2)}: v = 2 × ${par(x2)} × ${par(y2)} ${sg(k)} × ${par(y2)} = ${n(2 * x2 * y2)} ${sg(k * y2)} = ${n(V)}, so the imaginary part of f(z) there is ${n(V)}.`,
  guidance: [
   { prompt: `With k = ${n(k)}, u(x, y) = x² − y² ${sg(k)}x. What is u at z = ${cx(x1, y1)}?`, answer: [u], explanation: `x = ${n(x1)} and y = ${n(y1)}: u = ${n(x1 * x1)} − ${n(y1 * y1)} ${sg(k * x1)} = ${n(u)}.` },
   { prompt: `v(x, y) = 2xy ${sg(k)}y. What is v at z = ${cx(x1, y1)}?`, answer: [v], explanation: `v = 2 × ${par(x1)} × ${par(y1)} ${sg(k)} × ${par(y1)} = ${n(2 * x1 * y1)} ${sg(k * y1)} = ${n(v)}.` },
   { prompt: `Use the same v(x, y) at the second reading z = ${cx(x2, y2)}. What is the imaginary part of f(z) there?`, answer: [V], explanation: `x = ${n(x2)} and y = ${n(y2)}: v = ${n(2 * x2 * y2)} ${sg(k * y2)} = ${n(V)}.` }
  ] }; }
});

mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Two stages in the rotor hall',
 brief: 'A reading passes through two stages in a row, and the crew needs the parts of the final output.',
 labels: ['real part of the output', 'imaginary part of the output'], tolerance: 0.01,
 gl: [['u'], ['v'], ['real part of the output']]
}, {
 /* Stage 1: w = z² + c. Stage 2: multiply by g = g1 + g2 i. Final = g·w. All parts are non-zero whole numbers. */
 canonical: { p: 1, q: -2, x: 2, y: 1, g1: 2, g2: -1 },
 draw: R => pick(() => ({ p: R.nz(-4, 4), q: R.nz(-4, 4), x: R.nz(-3, 3), y: R.nz(-3, 3), g1: R.nz(-3, 3), g2: R.nz(-3, 3) }), () => true, { p: 1, q: -2, x: 2, y: 1, g1: 2, g2: -1 }),
 build: ({ p, q, x, y, g1, g2 }) => { const u = x * x - y * y + p, v = 2 * x * y + q, re = g1 * u - g2 * v, im = g1 * v + g2 * u, sq = k => `${k < 0 ? '−' : '+'} ${n(Math.abs(k))}`; return {
  prompt: `In the Rotor Hall a reading z = ${cx(x, y)} first goes through a stage that maps it to w = z² + c, with c = ${cx(p, q)}. A second stage then multiplies w by the constant g = ${cx(g1, g2)}, so the final output is gw. Write w = u + vi. Enter the real part and the imaginary part of the final output gw.`,
  answer: [re, im],
  hints: ['Stage 1: with z = x + yi, z² = x² − y² + 2xyi, so u = x² − y² + Re c and v = 2xy + Im c.', 'Stage 2 is multiplication of two complex numbers: multiply every part of g by every part of w, replace i² by −1, and collect the real terms and the i terms.'],
  solution: `Stage 1: z² = x² − y² + 2xyi, so u = ${par(x)}² − ${par(y)}² ${sq(p)} = ${n(u)} and v = 2 × ${par(x)} × ${par(y)} ${sq(q)} = ${n(v)}, and w = ${cx(u, v)}. Stage 2: gw = (${cx(g1, g2)})(${cx(u, v)}). The real terms are ${n(g1)} × ${par(u)} = ${n(g1 * u)} and (${cx(0, g2)})(${cx(0, v)}) = ${n(-g2 * v)}, because i² = −1, so the real part is ${n(re)}. The i terms are ${n(g1)} × (${cx(0, v)}) = ${cx(0, g1 * v)} and (${cx(0, g2)}) × ${par(u)} = ${cx(0, g2 * u)}, so the imaginary part is ${n(im)}.`,
  guidance: [
   { prompt: `Stage 1: u(x, y) = x² − y² ${sq(p)}. What is u at z = ${cx(x, y)}?`, answer: [u], explanation: `x = ${n(x)} and y = ${n(y)}: u = ${n(x * x)} − ${n(y * y)} ${sq(p)} = ${n(u)}.` },
   { prompt: `v(x, y) = 2xy ${sq(q)}. What is v at z = ${cx(x, y)}?`, answer: [v], explanation: `v = 2 × ${par(x)} × ${par(y)} ${sq(q)} = ${n(2 * x * y)} ${sq(q)} = ${n(v)}, so w = ${cx(u, v)}.` },
   { prompt: `Stage 2: gw = (${cx(g1, g2)})(${cx(u, v)}). Its real part comes from ${n(g1)} × ${par(u)} and from (${cx(0, g2)})(${cx(0, v)}), which is real because i² = −1. What is the real part of gw?`, answer: [re], explanation: `${n(g1)} × ${par(u)} = ${n(g1 * u)} and (${cx(0, g2)})(${cx(0, v)}) = ${n(-g2 * v)}, so the real part is ${n(g1 * u)} ${sq(-g2 * v)} = ${n(re)}. The imaginary part is ${n(g1 * v)} ${sq(g2 * u)} = ${n(im)}.` }
  ] }; }
});

mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q02', title: 'The inverting lens',
 brief: 'The outer lens of the rotor hall turns each reading inside out, and the crew needs the parts of its output.',
 labels: ['u', 'v', 'Im f at the second setting'], tolerance: 0.005,
 gl: [['u'], ['v'], ['Im f']]
}, {
 /* f(z) = 1 ÷ z + c. The settings have x² + y² equal to 2, 5, 8, 10, 20, 25 or 50, so 1 ÷ z has at most 2 decimal places:
    u = x ÷ s + Re c and v = −y ÷ s + Im c, with s = x² + y². */
 canonical: { p: 1, q: -2, x1: 1, y1: 2, x2: -3, y2: 4 },
 draw: R => { const pts = [[1, 1], [1, 2], [2, 1], [2, 2], [1, 3], [3, 1], [2, 4], [4, 2], [3, 4], [4, 3], [1, 7], [7, 1], [5, 5]];
  return pick(() => { const a = R.pick(pts), b = R.pick(pts); return { p: R.nz(-3, 3), q: R.nz(-3, 3), x1: a[0] * sgn(R), y1: a[1] * sgn(R), x2: b[0] * sgn(R), y2: b[1] * sgn(R) }; },
   x => !(x.x1 === x.x2 && x.y1 === x.y2), { p: 1, q: -2, x1: 1, y1: 2, x2: -3, y2: 4 }); },
 build: ({ p, q, x1, y1, x2, y2 }) => { const s1 = x1 * x1 + y1 * y1, s2 = x2 * x2 + y2 * y2, u = r2(x1 / s1 + p), v = r2(-y1 / s1 + q), V = r2(-y2 / s2 + q); return {
  prompt: `The outer lens of the Rotor Hall turns each setting z inside out: it maps z to w = f(z) = 1 ÷ z + c, with c = ${cx(p, q)}. Writing w = u + vi, enter u and v at the setting z = ${cx(x1, y1)}, then the imaginary part of f(z) at the setting z = ${cx(x2, y2)}. Every answer is a decimal with at most 2 places.`,
  answer: [u, v, V],
  hints: ['To write 1 ÷ (x + yi) with its parts separated, multiply the top and the bottom by the conjugate x − yi. The bottom becomes the real number x² + y².', 'So 1 ÷ (x + yi) = (x − yi) ÷ (x² + y²): u(x, y) = x ÷ (x² + y²) + Re c and v(x, y) = −y ÷ (x² + y²) + Im c.'],
  solution: `Multiplying top and bottom by the conjugate, 1 ÷ (x + yi) = (x − yi) ÷ (x² + y²), so u(x, y) = x ÷ (x² + y²) ${sg(p)} and v(x, y) = −y ÷ (x² + y²) ${sg(q)}. At z = ${cx(x1, y1)}: x² + y² = ${n(s1)}, so u = ${n(x1)} ÷ ${n(s1)} ${sg(p)} = ${n(u)} and v = ${n(-y1)} ÷ ${n(s1)} ${sg(q)} = ${n(v)}. At z = ${cx(x2, y2)}: x² + y² = ${n(s2)}, so the imaginary part is ${n(-y2)} ÷ ${n(s2)} ${sg(q)} = ${n(V)}.`,
  guidance: [
   { prompt: `For z = ${cx(x1, y1)}, x² + y² = ${n(s1)}. Then 1 ÷ z = (${cx(x1, -y1)}) ÷ ${n(s1)}. What is u, the real part of 1 ÷ z plus ${n(p)}?`, answer: [u], explanation: `${n(x1)} ÷ ${n(s1)} ${sg(p)} = ${n(u)}.` },
   { prompt: `The imaginary part of 1 ÷ z is ${n(-y1)} ÷ ${n(s1)}. Adding Im c = ${n(q)}, what is v?`, answer: [v], explanation: `${n(-y1)} ÷ ${n(s1)} ${sg(q)} = ${n(v)}.` },
   { prompt: `For z = ${cx(x2, y2)}, x² + y² = ${n(s2)}. What is the imaginary part of f(z), which is −y ÷ ${n(s2)} plus ${n(q)}?`, answer: [V], explanation: `${n(-y2)} ÷ ${n(s2)} ${sg(q)} = ${n(V)}.` }
  ] }; }
});

/* ---- q08 The complex exponential [1.7] ---- */

mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The phase meter',
 brief: 'The rotor hall phase meter shows a signal as a size and an angle, and the crew needs both and the imaginary part.',
 labels: ['|e^z|', 'phase', 'Im e^z'], tolerance: 0.005,
 gl: [['|e^z|'], ['phase'], ['Im e^z']]
}, {
 /* y = Kπ ÷ 4 with K from −30 to 30, shown as the phase Kp π ÷ 4 in (−π, π], with Kp from −3 to 4. Kp is not 0 or 4 (sin would be 0) and K ≠ Kp. */
 canonical: { x: -1.5, K: 11 },
 draw: R => pick(() => ({ x: R.pick([-1.5, -1, -0.5, 0.5, 1, 1.5, 2]), K: R.int(-30, 30) }),
  p => { const Kp = (((p.K + 3) % 8) + 8) % 8 - 3; if (Kp === 0 || Kp === 4 || Kp === p.K) return false; const ex = Math.exp(p.x), im = ex * Math.sin(Kp * Math.PI / 4), ph = Kp * Math.PI / 4; return !nearTie(ex) && !nearTie(im) && !nearTie(ph); }, { x: -1.5, K: 11 }),
 build: ({ x, K }) => { const Kp = (((K + 3) % 8) + 8) % 8 - 3, j = (K - Kp) / 8, ph = Kp * Math.PI / 4, ex = Math.exp(x), im = ex * Math.sin(ph), ext = x === 1 ? 'e' : `e^(${n(x)})`, s = exactText(Math.sin(ph)); return {
  prompt: `The phase meter in the Rotor Hall records a signal as e^z with z = x + yi, where x = ${n(x)} and y = ${piT(K, 4)} radians. The meter shows the phase of e^z as an angle greater than −π and at most π. Enter |e^z|, the phase the meter shows, and the imaginary part of e^z, each to 2 decimal places.`,
  answer: [r2(ex), r2(ph), r2(im)],
  hints: ['e^(x + yi) = e^x(cos y + i sin y). Its modulus is e^x, and its imaginary part is e^x sin y.', 'Adding or taking away 2π does not change cos y or sin y, so e^z repeats. Add or take away whole turns of 2π until the angle is greater than −π and at most π.'],
  solution: `e^z = e^x(cos y + i sin y), so |e^z| = ${ext} ${rd(ex)}. ${j > 0 ? 'Taking away' : 'Adding'} ${turnsText(Math.abs(j))} of 2π ${j > 0 ? 'from' : 'to'} y = ${piT(K, 4)} leaves the phase ${piT(Kp, 4)} ${rd(ph)}. sin y = sin(${piT(Kp, 4)}) = ${s}, so the imaginary part of e^z is ${ext} × (${s}) ${rd(im)}.`,
  guidance: [
   { prompt: `The modulus of e^z depends only on x. What is |e^z| = ${ext}, to 2 decimal places?`, answer: [r2(ex)], explanation: `|e^z| = e^x = ${ext} ${rd(ex)}.` },
   { prompt: `Add or take away whole turns of 2π (each is 8 steps of π ÷ 4) from y = ${piT(K, 4)} until the angle is greater than −π and at most π. What angle is left, to 2 decimal places?`, answer: [r2(ph)], explanation: `${piT(K, 4)} ${j > 0 ? '−' : '+'} ${piT(8 * Math.abs(j), 4)} = ${piT(Kp, 4)} ${rd(ph)}.` },
   { prompt: `The imaginary part of e^z is e^x sin y, and sin y = sin(${piT(Kp, 4)}). What is the imaginary part of e^z, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${piT(Kp, 4)}) = ${s}, so the imaginary part is ${ext} × (${s}) ${rd(im)}.` }
  ] }; }
});

mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The steadily growing exponent',
 brief: 'A rotor is tracked by an exponent that grows steadily, and the crew needs its size, its turns and its real part after some seconds.',
 labels: ['|e^z|', 'whole turns taken away', 'Re e^z'], tolerance: 0.005,
 gl: [['|e^z|'], ['whole turns taken away'], ['Re e^z']]
}, {
 /* After T seconds x = rx·T and y = (m·T)π ÷ 6 with m·T = K. Kp = K reduced into 1..12 and j = (K − Kp) ÷ 12 whole turns, at least 1. |x| ≤ 2, and Kp is not a multiple of 3 so the real part is not 0. */
 canonical: { rx: 0.25, m: 5, T: 8 },
 draw: R => pick(() => ({ rx: R.pick([-0.5, -0.25, 0.25, 0.5, 0.75]), m: R.pick([5, 7, 11, 13]), T: R.int(3, 10) }),
  p => { const x = p.rx * p.T, K = p.m * p.T, Kp = (K - 1) % 12 + 1, ex = Math.exp(x), re = ex * Math.cos(Kp * Math.PI / 6); return Math.abs(x) <= 2 && K > 12 && Kp % 3 !== 0 && !nearTie(ex) && !nearTie(re); }, { rx: 0.25, m: 5, T: 8 }),
 build: ({ rx, m, T }) => { const x = rx * T, K = m * T, Kp = (K - 1) % 12 + 1, j = (K - Kp) / 12, ex = Math.exp(x), c = Math.cos(Kp * Math.PI / 6), re = ex * c, ext = x === 1 ? 'e' : `e^(${n(x)})`; return {
  prompt: `A rotor in the Rotor Hall is tracked by the number e^z, where z = x + yi starts at 0 and then changes steadily: every second x changes by ${n(rx)} and y grows by ${n(m)}π ÷ 6 radians. After ${n(T)} seconds, enter |e^z|; then how many whole turns of 2π must be taken away from y to leave an angle greater than 0 and at most 2π; then the real part of e^z. Give |e^z| and the real part to 2 decimal places.`,
  answer: [r2(ex), j, r2(re)],
  hints: ['The size of e^(x + yi) is e^x, because cos y + i sin y has modulus 1, and its real part is e^x cos y.', 'cos and sin repeat every 2π, so e^z does not change when y changes by a whole turn. Take away whole turns of 2π until the angle is greater than 0 and at most 2π, and count them.'],
  solution: `After ${n(T)} seconds x = ${n(rx)} × ${n(T)} = ${n(x)} and y = ${n(m)} × ${n(T)} × π ÷ 6 = ${piT(K, 6)}. So |e^z| = ${ext} ${rd(ex)}. Each whole turn of 2π is 12 steps of π ÷ 6, and ${n(K)} steps less ${n(j)} whole turns leaves ${stepsText(Kp)}, so ${j === 1 ? 'one whole turn is' : n(j) + ' whole turns are'} taken away and the angle left is ${piT(Kp, 6)}. cos(${piT(Kp, 6)}) = ${exactText(c)}, so the real part of e^z is ${ext} × (${exactText(c)}) ${rd(re)}.`,
  guidance: [
   { prompt: `After ${n(T)} seconds, x = ${n(rx)} × ${n(T)} = ${n(x)}. What is |e^z| = ${ext}, to 2 decimal places?`, answer: [r2(ex)], explanation: `|e^z| = e^x = ${ext} ${rd(ex)}.` },
   { prompt: `After ${n(T)} seconds y = ${n(m)} × ${n(T)} steps of π ÷ 6, which is ${piT(K, 6)}. Each whole turn of 2π is 12 steps. How many whole turns must be taken away to leave an angle greater than 0 and at most 2π?`, answer: [j], explanation: `${n(K)} steps less ${n(12 * j)} steps (${turnsText(j)}) leaves ${stepsText(Kp)}, the angle ${piT(Kp, 6)}.` },
   { prompt: `The real part of e^z is e^x cos y, and cos y = cos(${piT(Kp, 6)}). What is the real part of e^z, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${piT(Kp, 6)}) = ${exactText(c)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}.` }
  ] }; }
});

mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q05', title: 'Stages stacked on a rotor',
 brief: 'Several identical rotor stages are stacked, their readings multiply, and the crew needs the size and angle of the total.',
 labels: ['modulus', 'angle', 'real part'], tolerance: 0.005,
 gl: [['modulus'], ['angle'], ['real part']]
}, {
 /* (e^z)ᴺ = e^(Nz): modulus e^(Nx), angle N·Kπ ÷ 6 reduced into (0, 2π] as Kp π ÷ 6. N·K > 12, Kp not a multiple of 3, and −2 ≤ Nx ≤ 4. */
 canonical: { x: 0.5, K: 5, N: 5 },
 draw: R => pick(() => ({ x: R.pick([-1, -0.75, -0.5, -0.25, 0.25, 0.5, 0.75, 1]), K: R.int(1, 11), N: R.int(3, 9) }),
  p => { const NK = p.N * p.K, Kp = (NK - 1) % 12 + 1, Nx = p.N * p.x, ex = Math.exp(Nx), ar = Kp * Math.PI / 6, re = ex * Math.cos(ar);
   return NK > 12 && Kp % 3 !== 0 && Nx >= -2 && Nx <= 4 && !nearTie(ex) && !nearTie(ar) && !nearTie(re) && r2(r2(ex) * Math.cos(r2(ar))) === r2(re); }, { x: 0.5, K: 5, N: 5 }),
 build: ({ x, K, N }) => { const NK = N * K, Kp = (NK - 1) % 12 + 1, j = (NK - Kp) / 12, Nx = N * x, ex = Math.exp(Nx), ar = Kp * Math.PI / 6, c = Math.cos(ar), re = ex * c, ext = Nx === 1 ? 'e' : `e^(${n(Nx)})`; return {
  prompt: `${n(N)} identical stages in the Rotor Hall each give the reading e^z, with z = x + yi, where x = ${n(x)} and y = ${piT(K, 6)} radians. The readings of the stages multiply, so the combined reading is (e^z)${sup(N)}. Enter the modulus of (e^z)${sup(N)}, then its angle that is greater than 0 and at most 2π, then its real part, each to 2 decimal places. Work with unrounded values.`,
  answer: [r2(ex), r2(ar), r2(re)],
  hints: ['e^z = e^x e^(iy) has modulus e^x and angle y. By de Moivre\'s formula, (r e^(iθ))ⁿ = rⁿ e^(inθ): the modulus is raised to the power n and the angle is multiplied by n.', 'Take away whole turns of 2π from the new angle until it is greater than 0 and at most 2π. The real part is the modulus times the cosine of that angle.'],
  solution: `e^z has modulus e^${n(x)} and angle ${piT(K, 6)}. By de Moivre's formula, (e^z)${sup(N)} has modulus (e^${n(x)})${sup(N)} = ${ext} ${rd(ex)} and angle ${n(N)} × ${piT(K, 6)} = ${piT(NK, 6)}. Taking away ${turnsText(j)} of 2π leaves ${piT(Kp, 6)} ${rd(ar)}. cos(${piT(Kp, 6)}) = ${exactText(c)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}.`,
  guidance: [
   { prompt: `The modulus of e^z is e^${n(x)}, so the modulus of (e^z)${sup(N)} is e^(${n(N)} × ${par(x)}) = ${ext}. What is it, to 2 decimal places?`, answer: [r2(ex)], explanation: `${ext} ${rd(ex)}.` },
   { prompt: `The angle of (e^z)${sup(N)} is ${n(N)} × ${piT(K, 6)} = ${piT(NK, 6)}. Take away whole turns of 2π (each is 12 steps of π ÷ 6) until the angle is greater than 0 and at most 2π. What angle is left, to 2 decimal places?`, answer: [r2(ar)], explanation: `${n(NK)} steps of π ÷ 6, less ${turnsText(j)}, leaves ${stepsText(Kp)}: ${piT(Kp, 6)} ${rd(ar)}.` },
   { prompt: `The modulus is ${n(r2(ex))} (to 2 places; keep the unrounded value) and the angle is ${piT(Kp, 6)}. What is the real part, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${piT(Kp, 6)}) = ${exactText(c)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}.` }
  ] }; }
});

/* ---- q09 The complex logarithm [1.11] ---- */

mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The mirror probes',
 brief: 'Two probes on opposite sides of the rotor read a number and its mirror image, and the crew needs the log gauge value of each.',
 labels: ['Re Log z', 'Im Log z', 'Im Log of the conjugate'], tolerance: 0.005,
 gl: [['Re Log z'], ['Im Log z'], ['Im Log of the conjugate']]
}, {
 /* z = a + bi with a non-zero and b negative, from −9 to 9, so z is below the real axis and its conjugate above it. */
 canonical: { a: -5, b: -12 },
 draw: R => pick(() => ({ a: R.nz(-9, 9), b: R.int(-9, -1) }), p => argOk(p.a, p.b) && argOk(p.a, -p.b) && !nearTie(Math.log(p.a * p.a + p.b * p.b) / 2), { a: -5, b: -12 }),
 build: ({ a, b }) => { const S = a * a + b * b, L = Math.log(S) / 2, w = argWork(a, b), w2 = argWork(a, -b); return {
  prompt: `The rotor log gauge in the Rotor Hall shows the complex logarithm of a reading. A probe on the lower side of the rotor reads z = ${cx(a, b)}, and its mirror probe on the upper side reads the conjugate z̄ = ${cx(a, -b)}. Enter the real part and the imaginary part of the principal value Log z, then the imaginary part of the principal value Log z̄, each to 2 decimal places.`,
  answer: [r2(L), r2(w.arg), r2(w2.arg)],
  hints: ['Log z = ln |z| + i Arg z, where ln is the natural logarithm and Arg z is the principal argument, between −π and π. A point below the real axis has a negative principal argument.', 'The conjugate z̄ has the same modulus as z, and it is z reflected in the real axis. Find its principal argument the same way, from the quadrant it lies in.'],
  solution: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}, so the real part of Log z is ln |z| = ½ ln ${n(S)} ${rd(L)}. The angle between z and the real axis is arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}. z lies ${w.place}, so ${w.rule}, and the imaginary part of Log z is ${rd(w.arg)}. The conjugate z̄ = ${cx(a, -b)} has the same modulus and the same reference angle, and it lies ${w2.place}, so ${w2.rule}, and the imaginary part of Log z̄ is ${rd(w2.arg)}.`,
  guidance: [
   { prompt: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}. ln |z| is half of ln ${n(S)}. What is the real part of Log z, to 2 decimal places?`, answer: [r2(L)], explanation: `½ ln ${n(S)} ${rd(L)}.` },
   { prompt: `z lies ${w.place}. What is the imaginary part of Log z, which is Arg z, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}, and ${w.rule}, so Arg z ${rd(w.arg)}.` },
   { prompt: `The conjugate z̄ = ${cx(a, -b)} lies ${w2.place}. What is the imaginary part of Log z̄, which is Arg z̄, to 2 decimal places?`, answer: [r2(w2.arg)], explanation: `The reference angle is the same, ≈ ${n(w2.ref)}, and ${w2.rule.replace('Arg z', 'Arg z̄')}, so Arg z̄ ${rd(w2.arg)}.` }
  ] }; }
});

mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The gauge that never jumps',
 brief: 'The rotor log gauge keeps counting turns instead of jumping back, and the crew needs its reading after some turns.',
 labels: ['real part of the gauge', 'imaginary part of the gauge'], tolerance: 0.005,
 gl: [['real part of the gauge'], ['Arg z'], ['imaginary part of the gauge']]
}, {
 /* log z = ln |z| + i(Arg z + 2πk) with k from −2 to 3, not 0. Draws are skipped when rounding Arg z or 2πk before adding changes the last digit. */
 canonical: { a: 6, b: 8, k: 2 },
 draw: R => pick(() => ({ a: R.nz(-9, 9), b: R.nz(-9, 9), k: R.pick([-2, -1, 1, 2, 3]) }),
  p => { const w = argWork(p.a, p.b), t = w.arg + 2 * Math.PI * p.k; return argOk(p.a, p.b) && !nearTie(Math.log(p.a * p.a + p.b * p.b) / 2) && !nearTie(t) && r2(r2(w.arg) + 2 * Math.PI * p.k) === r2(t) && r2(r2(w.arg) + r2(2 * Math.PI * p.k)) === r2(t); }, { a: 6, b: 8, k: 2 }),
 build: ({ a, b, k }) => { const S = a * a + b * b, L = Math.log(S) / 2, w = argWork(a, b), t = w.arg + 2 * Math.PI * k; return {
  prompt: `The rotor log gauge in the Rotor Hall does not jump back when the rotor passes the negative real axis: it keeps counting turns. For a reading z that the rotor has turned through k extra whole turns anticlockwise (k is negative for clockwise turns), the gauge shows log z = ln |z| + i(Arg z + 2πk), where Arg z is the principal argument. The rotor reads z = ${cx(a, b)} and k = ${n(k)}. Enter the real part and the imaginary part of the gauge reading, each to 2 decimal places. Work with unrounded values.`,
  answer: [r2(L), r2(t)],
  hints: ['The real part is ln |z|, with |z| = √(x² + y²), so ln |z| is half of ln(x² + y²). It does not depend on k.', 'Find Arg z, between −π and π, from the quadrant z lies in. Then the imaginary part of the gauge is Arg z + 2πk: each extra turn adds 2π, and each turn the other way takes away 2π.'],
  solution: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}, so the real part is ln |z| = ½ ln ${n(S)} ${rd(L)}. The angle between z and the real axis is arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}. z lies ${w.place}, so ${w.rule}, which is ${n(w.arg)}. The imaginary part is Arg z + 2π × ${par(k)} ≈ ${n(w.arg)} ${sg(2 * Math.PI * k)} ${rd(t)}.`,
  guidance: [
   { prompt: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}. ln |z| is half of ln ${n(S)}. What is the real part of the gauge reading, to 2 decimal places?`, answer: [r2(L)], explanation: `½ ln ${n(S)} ${rd(L)}.` },
   { prompt: `z lies ${w.place}. What is Arg z, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}, and ${w.rule}, so Arg z ${rd(w.arg)}.` },
   { prompt: `The imaginary part of the gauge is Arg z + 2πk with k = ${n(k)}. Using the unrounded Arg z, what is it, to 2 decimal places?`, answer: [r2(t)], explanation: `${n(w.arg)} + 2π × ${par(k)} ${rd(t)}.` }
  ] }; }
});

mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q08', title: 'Recovering a lost reading',
 brief: 'The gauge still shows the logarithm of a reading the crew has lost, and they need the reading back.',
 labels: ['|z|', 'real part of z', 'imaginary part of z'], tolerance: 0.005,
 gl: [['|z|'], ['real part of z'], ['imaginary part of z']]
}, {
 /* Log z = ℓ + θi with θ = Kπ ÷ 6, K from −5 to 5 and not 0, 3 or −3, so neither part of z is 0. Then z = e^ℓ(cos θ + i sin θ). */
 canonical: { l: 0.5, K: 5 },
 draw: R => pick(() => ({ l: R.pick([-1, -0.5, 0.5, 1, 1.5, 2]), K: R.int(-5, 5) }),
  p => { if (p.K === 0 || Math.abs(p.K) === 3) return false; const ex = Math.exp(p.l), a = p.K * Math.PI / 6; return !nearTie(ex) && !nearTie(ex * Math.cos(a)) && !nearTie(ex * Math.sin(a)); }, { l: 0.5, K: 5 }),
 build: ({ l, K }) => { const a = K * Math.PI / 6, ex = Math.exp(l), c = Math.cos(a), s = Math.sin(a), re = ex * c, im = ex * s, ext = `e^(${n(l)})`, th = piT(K, 6), ths = piT(Math.abs(K), 6); return {
  prompt: `The rotor log gauge in the Rotor Hall still shows the principal value Log z = ${n(l)} ${K < 0 ? '−' : '+'} (${ths})i of a reading z that the crew has lost, where the imaginary part lies between −π and π. A logarithm of z is a number w with e^w = z. Enter |z|, the real part of z and the imaginary part of z, each to 2 decimal places.`,
  answer: [r2(ex), r2(re), r2(im)],
  hints: ['A logarithm of z is a number w with e^w = z. So z = e^(Log z): put the logarithm back into the exponential.', 'e^(u + vi) = e^u(cos v + i sin v), so the modulus is e^u, the real part is e^u cos v and the imaginary part is e^u sin v.'],
  solution: `Since e^(Log z) = z, z = e^(${n(l)} ${K < 0 ? '−' : '+'} (${ths})i) = ${ext}(cos(${th}) + i sin(${th})). Its modulus is ${ext} ${rd(ex)}. cos(${th}) = ${exactText(c)} and sin(${th}) = ${exactText(s)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}, and the imaginary part is ${ext} × (${exactText(s)}) ${rd(im)}.`,
  guidance: [
   { prompt: `z = e^(Log z), and e^(u + vi) has modulus e^u. Here u = ${n(l)}. What is |z| = ${ext}, to 2 decimal places?`, answer: [r2(ex)], explanation: `|z| = ${ext} ${rd(ex)}.` },
   { prompt: `The angle of z is v = ${th}, and the real part is e^u cos v. What is the real part of z, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${th}) = ${exactText(c)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}.` },
   { prompt: `The imaginary part of z is e^u sin v, with v = ${th}. What is it, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${th}) = ${exactText(s)}, so the imaginary part is ${ext} × (${exactText(s)}) ${rd(im)}.` }
  ] }; }
});

/* ---- q10 Complex powers [1.11] ---- */

mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The damper dials',
 brief: 'The damper stages in the rotor hall are set by complex powers, and the crew needs two principal values and the spacing of a root stage.',
 labels: ['principal value', 'real part', 'angle between neighbouring values'], tolerance: 0.005,
 gl: [['principal value'], ['real part'], ['angle between neighbouring values']]
}, {
 /* (−1)^(ci) = e^(−cπ) with c ≠ 1; (−s)^(r ÷ q) has real part s^(r ÷ q) cos(rπ ÷ q), with q = 3, 4 or 6 so cos is exact and not 0; v^(1 ÷ m) has neighbouring values 2π ÷ m apart. */
 canonical: { c: -0.5, s: 5, r: 2, q: 3, m: 7 },
 draw: R => { const ex = [[1, 3], [2, 3], [4, 3], [5, 3], [1, 4], [3, 4], [5, 4], [7, 4], [1, 6], [5, 6], [7, 6]];
  return pick(() => { const e = R.pick(ex); return { c: R.pick([-1, -0.5, -0.25, 0.25, 0.5]), s: R.int(2, 9), r: e[0], q: e[1], m: R.int(3, 8) }; },
   p => { const G = Math.exp(-p.c * Math.PI), re = Math.pow(p.s, p.r / p.q) * Math.cos(p.r * Math.PI / p.q); return !nearTie(G) && !nearTie(re) && !nearTie(2 * Math.PI / p.m); }, { c: -0.5, s: 5, r: 2, q: 3, m: 7 }); },
 build: ({ c, s, r, q, m }) => { const G = Math.exp(-c * Math.PI), ci = `${co(c)}i`, a = r / q, cv = Math.cos(r * Math.PI / q), re = Math.pow(s, a) * cv, gap = 2 * Math.PI / m, ang = piT(r, q), pw = `(−1)^(${ci})`, sa = `${n(s)}^(${n(r)} ÷ ${n(q)})`; return {
  prompt: `A damper stage in the Rotor Hall is set by complex powers, z^a = e^(a log z), whose principal value uses Log z. Enter the principal value of ${pw}, which is a real number; then the real part of the principal value of (−${n(s)})^(${n(r)} ÷ ${n(q)}); then the angle in radians between neighbouring values of v^(1 ÷ ${n(m)}), when every branch of the logarithm is counted. Give each to 2 decimal places.`,
  answer: [r2(G), r2(re), r2(gap)],
  hints: ['Log(−1) = iπ, because |−1| = 1 and Arg(−1) = π. A power of the form bi then gives e^(bi × iπ), and i × i = −1 makes the exponent real.', 'For a real power a, the principal value is z^a = |z|^a e^(ia Arg z), with real part |z|^a cos(a Arg z). A negative real number has Arg = π. The other branches add 2πki to Log v, which turns v^(1 ÷ m) by 2πk ÷ m.'],
  solution: `Log(−1) = iπ, so ${pw} = e^(${ci} × iπ) = e^(${co(-c)}π) ${rd(G)}. For −${n(s)}, |−${n(s)}| = ${n(s)} and Arg = π, so the principal value of (−${n(s)})^(${n(r)} ÷ ${n(q)}) is ${sa} e^(i × ${n(r)} ÷ ${n(q)} × π), with angle ${ang}. cos(${ang}) = ${exactText(cv)}, so its real part is ${sa} × (${exactText(cv)}) ${rd(re)}. Each branch k of the logarithm turns v^(1 ÷ ${n(m)}) by 2πk ÷ ${n(m)}, so neighbouring values are 2π ÷ ${n(m)} radians apart, and 2π ÷ ${n(m)} ${rd(gap)}.`,
  guidance: [
   { prompt: `Log(−1) = iπ, so ${pw} = e^(${ci} × iπ). What is it, to 2 decimal places?`, answer: [r2(G)], explanation: `i × i = −1, so the exponent is ${co(-c)}π and ${pw} = e^(${co(-c)}π) ${rd(G)}.` },
   { prompt: `For −${n(s)}, |z| = ${n(s)} and Arg z = π. The real part of z^(${n(r)} ÷ ${n(q)}) is |z|^(${n(r)} ÷ ${n(q)}) cos(${n(r)} ÷ ${n(q)} × π). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `The angle is ${ang}, cos(${ang}) = ${exactText(cv)}, so the real part is ${sa} × (${exactText(cv)}) ${rd(re)}.` },
   { prompt: `Branch k turns v^(1 ÷ ${n(m)}) by 2πk ÷ ${n(m)}. What is the angle between neighbouring values, which is 2π ÷ ${n(m)}, to 2 decimal places?`, answer: [r2(gap)], explanation: `2π ÷ ${n(m)} ${rd(gap)}.` }
  ] }; }
});

mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Gain stages in a row',
 brief: 'A chain of gain stages multiplies a signal by a complex power each time, and the crew needs the gain, the final strength and the length of chain needed.',
 labels: ['G', 'strength after the stages', 'stages needed'], tolerance: 0.005,
 gl: [['G'], ['strength after the stages'], ['stages needed']]
}, {
 /* G = principal value of i^(ci) = e^(−cπ ÷ 2) with c negative, so G > 1. The strength after p stages is S0·Gᵖ, from the unrounded G.
    N is the smallest whole number of stages with S0·Gᴺ ≥ L; N is more than p, and ln(L ÷ S0) ÷ ln G is not within 0.02 of a whole number. */
 canonical: { c: -1, p: 2, S0: 3, L: 1000 },
 draw: R => pick(() => ({ c: R.pick([-0.5, -1, -1.5]), p: R.int(2, 3), S0: R.int(2, 5), L: R.pick([500, 1000, 2000, 5000, 10000]) }),
  x => { const G = Math.exp(-x.c * Math.PI / 2), t = Math.log(x.L / x.S0) / Math.log(G), f = t - Math.floor(t), st = x.S0 * Math.pow(G, x.p); return t > x.p + 0.5 && f > 0.02 && f < 0.98 && !nearTie(G) && !nearTie(st); }, { c: -1, p: 2, S0: 3, L: 1000 }),
 build: ({ c, p, S0, L }) => { const G = Math.exp(-c * Math.PI / 2), st = S0 * Math.pow(G, p), t = Math.log(L / S0) / Math.log(G), N = Math.ceil(t), e = x => `${n(x)}`, ci = `${co(c)}i`; return {
  prompt: `A gain stage in the Rotor Hall multiplies a signal's strength by G, the principal value of i^(${ci}); G is a real number. A signal of strength ${n(S0)} goes through ${n(p)} of these stages one after another, so its strength after the stages is ${n(S0)} × G${sup(p)}. Enter G; then the strength after the ${n(p)} stages, worked from the unrounded G; then the smallest whole number of stages, counted from the start, after which the strength is at least ${n(L)}. Give G and the strength to 2 decimal places, and type numbers without commas.`,
  answer: [r2(G), r2(st), N],
  hints: ['Log i = iπ ÷ 2, because |i| = 1 and Arg i = π ÷ 2. A power of the form bi then gives e^(bi × iπ ÷ 2), and i × i = −1 makes the exponent real.', 'After N stages the strength is S0 × G^N. Try N = 1, 2, 3, … with the unrounded G, or solve S0 × G^N ≥ L with logarithms: N ≥ ln(L ÷ S0) ÷ ln G, rounded up.'],
  solution: `Log i = iπ ÷ 2, so G = i^(${ci}) = e^(${ci} × iπ ÷ 2) = e^(${piT(-2 * c, 4)}) ${rd(G)}. The strength after ${n(p)} stages is ${n(S0)} × G${sup(p)} = ${n(S0)} × e^(${piT(-2 * c * p, 4)}) ${rd(st)}. After N stages the strength is ${n(S0)} × G^N, which reaches ${n(L)} when N ≥ ln(${n(L)} ÷ ${n(S0)}) ÷ ln G ≈ ${n(t)}. The smallest whole number of stages is ${n(N)}.`,
  guidance: [
   { prompt: `Log i = iπ ÷ 2, so G = e^(${ci} × iπ ÷ 2). What is G, to 2 decimal places?`, answer: [r2(G)], explanation: `i × i = −1, so the exponent is ${piT(-2 * c, 4)} and G = e^(${piT(-2 * c, 4)}) ${rd(G)}.` },
   { prompt: `The strength after ${n(p)} stages is ${n(S0)} × G${sup(p)}. Using the unrounded G, what is it, to 2 decimal places?`, answer: [r2(st)], explanation: `${n(S0)} × e^(${piT(-2 * c * p, 4)}) ${rd(st)}.` },
   { prompt: `After N stages the strength is ${n(S0)} × G^N. What is the smallest whole number N for which it is at least ${n(L)}? (Try N = 1, 2, 3, … or use N ≥ ln(${n(L)} ÷ ${n(S0)}) ÷ ln G.)`, answer: [N], explanation: `ln(${n(L)} ÷ ${n(S0)}) ÷ ln G ≈ ${n(t)}, so ${n(N)} stages are the least that reach ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'A turned power',
 brief: 'A tuning stage raises a complex reading to an imaginary power, and the crew needs the size and both parts of the result.',
 labels: ['modulus', 'real part', 'imaginary part'], tolerance: 0.005,
 gl: [['Arg z'], ['modulus'], ['angle c ln |z|'], ['real part']]
}, {
 /* z^(ci) = e^(ci(L + iθ)) = e^(−cθ)(cos(cL) + i sin(cL)) with L = ln |z| and θ = Arg z. The modulus is between 0.15 and 12; draws are skipped
    when working from L and θ rounded to 2 places changes any 2-place answer. */
 canonical: { a: 1, b: 1, c: 1 },
 draw: R => pick(() => ({ a: R.nz(-5, 5), b: R.nz(-5, 5), c: R.pick([-1, -0.5, 0.5, 1]) }),
  p => { if (!argOk(p.a, p.b)) return false; const L = Math.log(p.a * p.a + p.b * p.b) / 2, th = Math.atan2(p.b, p.a), md = Math.exp(-p.c * th), ag = p.c * L, re = md * Math.cos(ag), im = md * Math.sin(ag),
    md2 = Math.exp(-p.c * r2(th)), ag2 = p.c * r2(L); return md > 0.15 && md < 12 && !nearTie(md) && !nearTie(ag) && !nearTie(re) && !nearTie(im) && r2(md2) === r2(md) && r2(md2 * Math.cos(ag2)) === r2(re) && r2(md2 * Math.sin(ag2)) === r2(im); }, { a: 1, b: 1, c: 1 }),
 build: ({ a, b, c }) => { const S = a * a + b * b, L = Math.log(S) / 2, w = argWork(a, b), th = w.arg, md = Math.exp(-c * th), ag = c * L, re = md * Math.cos(ag), im = md * Math.sin(ag), ci = `${co(c)}i`; return {
  prompt: `A tuning stage in the Rotor Hall is set by the complex power z^(${ci}), where z = ${cx(a, b)} and c = ${n(c)}. A complex power is z^w = e^(w Log z), and e^(p + qi) = e^p(cos q + i sin q). Enter the modulus, the real part and the imaginary part of the principal value of z^(${ci}), each to 2 decimal places. Work with unrounded values.`,
  answer: [r2(md), r2(re), r2(im)],
  hints: ['Write Log z = L + iθ, with L = ln |z| (half of ln(x² + y²)) and θ = Arg z. Then the exponent is ci × Log z = −cθ + i(cL), because i × i = −1.', 'So the principal value is e^(−cθ)(cos(cL) + i sin(cL)): its modulus is e^(−cθ), its real part is e^(−cθ) cos(cL) and its imaginary part is e^(−cθ) sin(cL).'],
  solution: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}, so L = ln |z| = ½ ln ${n(S)} ${rd(L)}. z lies ${w.place}, so ${w.rule}, and θ = Arg z ${rd(th)}. The exponent is ${ci} × Log z = −cθ + i(cL) = ${cx(-c * th, ag)}, so z^(${ci}) = e^(−cθ)(cos(cL) + i sin(cL)). Its modulus is e^(${n(-c * th)}) ${rd(md)}. The angle is cL = ${n(c)} × ${n(L)} ${rd(ag)}, so the real part is ${n(md)} × cos(${n(ag)}) ${rd(re)}, and the imaginary part is ${n(md)} × sin(${n(ag)}) ${rd(im)}.`,
  guidance: [
   { prompt: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}, and z lies ${w.place}. What is θ = Arg z, to 2 decimal places?`, answer: [r2(th)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}, and ${w.rule}, so θ ${rd(th)}.` },
   { prompt: `The modulus of z^(${ci}) is e^(−cθ), with c = ${n(c)} and the unrounded θ. What is it, to 2 decimal places?`, answer: [r2(md)], explanation: `e^(${n(-c * th)}) ${rd(md)}.` },
   { prompt: `The angle of z^(${ci}) is cL, where L = ln |z| is half of ln ${n(S)}. What is cL, to 2 decimal places?`, answer: [r2(ag)], explanation: `L = ½ ln ${n(S)} ≈ ${n(L)}, so cL = ${n(c)} × ${n(L)} ${rd(ag)}.` },
   { prompt: `The modulus is about ${n(md)} and the angle is about ${n(ag)} (keep the unrounded values in your calculator). What is the real part of z^(${ci}), to 2 decimal places?`, answer: [r2(re)], explanation: `${n(md)} × cos(${n(ag)}) ${rd(re)}. The imaginary part is ${n(md)} × sin(${n(ag)}) ${rd(im)}.` }
  ] }; }
});

})();
