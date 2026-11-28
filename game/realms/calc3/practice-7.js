/* Calculus 3: many variables practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A coefficient written in front of a product, left out when it is 1: times1(3) → '3 × ', times1(1) → ''. */
const times1 = c => c === 1 ? '' : `${n(c)} × `;
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
/* A sum of terms written the usual way: poly([[2, 'x'], [−1, 'y'], [3, '']]) is '2x − y + 3'. Zero terms are dropped,
   a coefficient 1 is not written, and an empty sum is '0'. */
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, m], i) => { const a = Math.abs(c), body = m ? (a === 1 ? m : n(a) + m) : n(a); return i === 0 ? (c < 0 ? '−' + body : body) : (c < 0 ? ' − ' : ' + ') + body; }).join(''); };
const ang = list => '⟨' + list.map(n).join(', ') + '⟩';
const pt = list => '(' + list.map(n).join(', ') + ')';
/* A coefficient written before a word: '' for 1, '4 ' otherwise. */
const co = x => x === 1 ? '' : n(x) + ' ';
const cub = x => x * x * x;
/* Straight cable directions with a whole length. */
const DIRS = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, 3, 6], [3, 2, 6], [6, 2, 3], [4, 4, 7], [1, 4, 8], [4, 1, 8], [8, 4, 1]];
const WHERE = ['the distance east of the yard gate', 'the distance north of the yard gate', 'the height above the ground'];
const TURN = { 1: 'π/2', 2: 'π', 3: '3π/2', 4: '2π' };
/* Spiral shapes (a, c, √(a² + c²)) with a whole speed. */
const SPIR = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]];

/* ---- q31 Vector fields; line integrals of a function [6.1, 6.2] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The mast guy rope',
 brief: 'A guy rope will steady the crane mast against the wind, and the riggers need the gust at its foot and the weight of the rope.',
 labels: ['wind, x-component (m/s)', 'wind, y-component (m/s)', 'wind, z-component (m/s)', 'mass (kg)'], tolerance: 0.01,
 gl: [['wind x-part (m/s)', 'wind y-part (m/s)', 'wind z-part (m/s)'], ['‖r′(t)‖'], ['A (kg/m)', 'B (kg/m)'], ['mass (kg)']]
}, {
 /* Wind F = ⟨ax + bz, cyz, dxy⟩ at the rope's foot; a straight rope with a whole length; density m + kx, with k × (the x-part of the
    direction) even so the mass is whole. The q31 worked example (field ⟨z, 2x, y⟩, cable from the origin) has another form. */
 canonical: { a: 3, b: 2, c: 2, d: 4, x0: 2, y0: 3, z0: 1, dir: 4, m: 3, k: 2 },
 draw: R => { let p; do { p = { a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 3), d: R.int(1, 3), x0: R.int(1, 4), y0: R.int(1, 4), z0: R.int(1, 3), dir: R.int(0, DIRS.length - 1), m: R.int(1, 5), k: R.int(1, 3) }; }
  while ((p.k * DIRS[p.dir][0]) % 2 !== 0); return p; },
 build: ({ a, b, c, d, x0, y0, z0, dir, m, k }) => { const v = DIRS[dir], S = v[0] * v[0] + v[1] * v[1] + v[2] * v[2], L = Math.round(Math.sqrt(S)),
  end = [x0 + v[0], y0 + v[1], z0 + v[2]], F = [a * x0 + b * z0, c * y0 * z0, d * x0 * y0], A = m + k * x0, B = k * v[0], mid = A + B / 2, mass = L * mid,
  Ft = `⟨${poly([[a, 'x'], [b, 'z']])}, ${poly([[c, 'yz']])}, ${poly([[d, 'xy']])}⟩`, rho = poly([[m, ''], [k, 'x']]),
  rt = `⟨${poly([[x0, ''], [v[0], 't']])}, ${poly([[y0, ''], [v[1], 't']])}, ${poly([[z0, ''], [v[2], 't']])}⟩`, xt = poly([[x0, ''], [v[0], 't']]), rhot = poly([[A, ''], [B, 't']]); return {
  prompt: `The wind over the cable yard is the vector field F(x, y, z) = ${Ft} metres per second, with x, y and z in metres. A straight guy rope runs from its foot at ${pt([x0, y0, z0])} to the top of the mast at ${pt(end)}. Its density is ρ = ${rho} kilograms per metre, where x is the distance east of the yard gate, so the rope is heavier further east. Enter the three components of the wind F at the rope’s foot, then the mass of the rope in kilograms.`,
  answer: [...F, mass],
  hints: ['The wind at a point comes from putting that point’s x, y and z into each of the three components of F.', 'Write the rope as r(t) = start + t × (end − start) for t from 0 to 1. Then ds = ‖r′(t)‖ dt, and the mass is the integral of ρ(r(t)) × ‖r′(t)‖ from t = 0 to t = 1.'],
  solution: `F${pt([x0, y0, z0])} = ⟨${times1(a)}${n(x0)} + ${times1(b)}${n(z0)}, ${times1(c)}${n(y0)} × ${n(z0)}, ${times1(d)}${n(x0)} × ${n(y0)}⟩ = ${ang(F)}. The rope is r(t) = ${rt} for t from 0 to 1, so r′(t) = ${ang(v)} and ‖r′(t)‖ = √(${n(v[0] * v[0])} + ${n(v[1] * v[1])} + ${n(v[2] * v[2])}) = √${n(S)} = ${n(L)}. Along the rope x = ${xt}, so ρ(r(t)) = ${rhot}. The mass is the integral from t = 0 to t = 1 of (${rhot}) × ${n(L)}, which is ${n(L)} × (${n(A)} + ${n(B)} ÷ 2) = ${n(L)} × ${n(mid)} = ${n(mass)} kilograms.`,
  guidance: [
   { prompt: `Put x = ${n(x0)}, y = ${n(y0)} and z = ${n(z0)} into F(x, y, z) = ${Ft}. What are its three components?`, answer: F, explanation: `${times1(a)}${n(x0)} + ${times1(b)}${n(z0)} = ${n(F[0])}, ${times1(c)}${n(y0)} × ${n(z0)} = ${n(F[1])} and ${times1(d)}${n(x0)} × ${n(y0)} = ${n(F[2])}.` },
   { prompt: `The rope is r(t) = ${rt} for t from 0 to 1. What is its speed ‖r′(t)‖, the length of r′(t) = ${ang(v)}?`, answer: [L], explanation: `‖r′(t)‖ = √(${n(v[0] * v[0])} + ${n(v[1] * v[1])} + ${n(v[2] * v[2])}) = √${n(S)} = ${n(L)}, the same for every t.` },
   { prompt: `Along the rope x = ${xt}. Write the density there as ρ(r(t)) = A + Bt. What are A and B?`, answer: [A, B], explanation: `ρ = ${rho} with x = ${xt} gives ${rhot}, so A = ${n(A)} and B = ${n(B)}.` },
   { prompt: `The mass is ${n(L)} × (the integral of ${rhot} from t = 0 to t = 1). What is it, in kilograms?`, answer: [mass], explanation: `The integral of A + Bt from 0 to 1 is A + B ÷ 2 = ${n(A)} + ${n(B / 2)} = ${n(mid)}. Times ${n(L)}, the mass is ${n(mass)} kilograms.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The cable on the hook',
 brief: 'The crane is about to lift a cable that gets heavier along its length, and the lifting beam must be rated for the full load.',
 labels: ['mass (kg)', 'weight (N)'], tolerance: 0.01,
 gl: [['‖r′(t)‖'], ['mass (kg)'], ['weight (N)']]
}, {
 /* A straight cable with a whole length and density m + k × (one coordinate: x, y or z); k × (that part of the direction) is even so the
    mass is whole. The weight is 10 × the mass. */
 canonical: { x0: 1, y0: 2, z0: 0, dir: 7, iv: 1, m: 3, k: 1 },
 draw: R => { let p; do { p = { x0: R.int(0, 4), y0: R.int(0, 4), z0: R.int(0, 3), dir: R.int(0, DIRS.length - 1), iv: R.int(0, 2), m: R.int(1, 5), k: R.int(1, 3) }; }
  while ((p.k * DIRS[p.dir][p.iv]) % 2 !== 0); return p; },
 build: ({ x0, y0, z0, dir, iv, m, k }) => { const v = DIRS[dir], S = v[0] * v[0] + v[1] * v[1] + v[2] * v[2], L = Math.round(Math.sqrt(S)), P0 = [x0, y0, z0],
  end = [x0 + v[0], y0 + v[1], z0 + v[2]], s0 = P0[iv], A = m + k * s0, B = k * v[iv], mid = A + B / 2, mass = L * mid, wt = 10 * mass, vn = 'xyz'[iv],
  rho = poly([[m, ''], [k, vn]]), st = poly([[s0, ''], [v[iv], 't']]), rhot = poly([[A, ''], [B, 't']]); return {
  prompt: `The crane at the cable yard must lift a straight steel cable that runs from ${pt(P0)} to ${pt(end)}, all in metres. Its density is ρ = ${rho} kilograms per metre, where ${vn} is ${WHERE[iv]}, so the density changes along the cable. Enter the mass of the cable in kilograms, then the weight the lifting beam must carry in newtons (type it without commas), taking each kilogram to weigh 10 newtons.`,
  answer: [mass, wt],
  hints: ['Write the cable as r(t) = start + t × (end − start) for t from 0 to 1. Then ds = ‖r′(t)‖ dt, and the mass is the integral of ρ(r(t)) × ‖r′(t)‖ from t = 0 to t = 1.', 'Put the path into the density first, so that ρ(r(t)) is a formula in t alone. The weight is then 10 times the mass.'],
  solution: `The cable is r(t) = start + t × (end − start) for t from 0 to 1, so r′(t) = ${ang(v)} and ‖r′(t)‖ = √${n(S)} = ${n(L)}. Along the cable ${vn} = ${st}, so ρ(r(t)) = ${rhot}. The mass is the integral from t = 0 to t = 1 of (${rhot}) × ${n(L)}, which is ${n(L)} × (${n(A)} + ${n(B)} ÷ 2) = ${n(L)} × ${n(mid)} = ${n(mass)} kilograms. The weight is 10 × ${n(mass)} = ${n(wt)} newtons.`,
  guidance: [
   { prompt: `The cable is r(t) = start + t × (end − start) with r′(t) = ${ang(v)}. What is its speed ‖r′(t)‖?`, answer: [L], explanation: `‖r′(t)‖ = √(${n(v[0] * v[0])} + ${n(v[1] * v[1])} + ${n(v[2] * v[2])}) = √${n(S)} = ${n(L)}, the same for every t.` },
   { prompt: `Along the cable ${vn} = ${st}, so ρ(r(t)) = ${rhot}. The mass is ${n(L)} × (the integral of that from t = 0 to t = 1). What is it, in kilograms?`, answer: [mass], explanation: `The integral of A + Bt from 0 to 1 is A + B ÷ 2 = ${n(A)} + ${n(B / 2)} = ${n(mid)}. Times ${n(L)}, the mass is ${n(mass)} kilograms.` },
   { prompt: `Each kilogram weighs 10 newtons. What is the weight of the cable, in newtons?`, answer: [wt], explanation: `10 × ${n(mass)} = ${n(wt)} newtons.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q10', title: 'The spiral cable on the pylon',
 brief: 'A cable winds in a spiral up a pylon, and the crew need to know how fast the path runs and what the whole length weighs.',
 labels: ['‖r′(t)‖ (m per unit t)', 'mass (kg)'], tolerance: 0.01,
 gl: [['‖r′(t)‖'], ['A (kg/m)', 'B (kg/m)'], ['mass (kg)']]
}, {
 /* A spiral r(t) = ⟨a cos t, a sin t, ct⟩, t from 0 to T, with (a, c) from a whole-length pair so that ‖r′(t)‖ = √(a² + c²) is whole.
    Density m + kz = m + kct, so the mass is S(mT + kcT² ÷ 2), kept whole. The q31 worked example is a straight cable. */
 canonical: { pair: 0, T: 2, m: 2, k: 1 },
 draw: R => { let p; do { p = { pair: R.int(0, 5), T: R.int(1, 3), m: R.int(1, 5), k: R.int(1, 3) }; } while ((p.k * SPIR[p.pair][1] * p.T * p.T) % 2 !== 0); return p; },
 build: ({ pair, T, m, k }) => { const [a, c, S] = SPIR[pair], B = k * c, mass = S * (m * T + B * T * T / 2), rho = poly([[m, ''], [k, 'z']]), rhot = poly([[m, ''], [B, 't']]), inner = m * T + B * T * T / 2; return {
  prompt: `A steel cable winds up a pylon in a spiral: r(t) = ⟨${n(a)} cos t, ${n(a)} sin t, ${n(c)}t⟩ metres for t from 0 to ${n(T)}, with t in radians. Its density is ρ = ${rho} kilograms per metre, where z is the height. Enter the speed ‖r′(t)‖ of the path, which is the same for every t, then the mass of the cable in kilograms (type it without commas).`,
  answer: [S, mass],
  hints: ['Differentiate each component: the derivative of cos t is −sin t and the derivative of sin t is cos t. Then ‖r′(t)‖ is the square root of the sum of the three squares, and sin²t + cos²t = 1 removes t.', 'The mass is the integral of ρ(r(t)) × ‖r′(t)‖ from t = 0 to the end value. Put the height of the path into the density first, so everything is in t.'],
  solution: `r′(t) = ⟨−${n(a)} sin t, ${n(a)} cos t, ${n(c)}⟩, so ‖r′(t)‖² = ${n(a * a)} sin²t + ${n(a * a)} cos²t + ${n(c * c)} = ${n(a * a)} + ${n(c * c)} = ${n(S * S)} and ‖r′(t)‖ = ${n(S)}. The height is z = ${n(c)}t, so ρ(r(t)) = ${rhot}. The mass is ${n(S)} × (the integral from t = 0 to t = ${n(T)} of ${rhot}) = ${n(S)} × (${n(m)} × ${n(T)} + ${n(B)} × ${n(T)}² ÷ 2) = ${n(S)} × ${n(inner)} = ${n(mass)} kilograms.`,
  guidance: [
   { prompt: `Differentiate to get r′(t) = ⟨−${n(a)} sin t, ${n(a)} cos t, ${n(c)}⟩. What is its length ‖r′(t)‖?`, answer: [S], explanation: `‖r′(t)‖² = ${n(a * a)} sin²t + ${n(a * a)} cos²t + ${n(c * c)} = ${n(a * a)} + ${n(c * c)} = ${n(S * S)}, so ‖r′(t)‖ = ${n(S)}.` },
   { prompt: `The height along the cable is z = ${n(c)}t. Write the density there as ρ(r(t)) = A + Bt. What are A and B?`, answer: [m, B], explanation: `ρ = ${rho} with z = ${n(c)}t gives ${rhot}, so A = ${n(m)} and B = ${n(B)}.` },
   { prompt: `The mass is ${n(S)} × (the integral of ${rhot} from t = 0 to t = ${n(T)}). What is it, in kilograms?`, answer: [mass], explanation: `The integral of A + Bt from 0 to ${n(T)} is ${n(m)} × ${n(T)} + ${n(B)} × ${n(T)}² ÷ 2 = ${n(inner)}. Times ${n(S)}, the mass is ${n(mass)} kilograms.` }
  ] }; }
});

/* ---- q32 Work along a path: line integrals of a field [6.2] ---- */

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The trolley on the curved rail',
 brief: 'An inspection trolley rides a curved rail while the wind and its brake push on it, and the power crew want the net energy of one run.',
 labels: ['work (J)'], tolerance: 0.01,
 gl: [['F, x-part (N)', 'F, y-part (N)'], ['A', 'B'], ['work (J)']]
}, {
 /* F = ⟨ay, bx − c⟩ along r(t) = ⟨t², t⟩, t from 0 to T: F(r) · r′ = (2a + b)t² − c, work (2a + b)T³ ÷ 3 − cT, kept whole and sometimes negative.
    The q32 worked example (⟨y, 2x⟩ along ⟨t, 2t⟩) has another form. */
 canonical: { a: 2, b: 1, c: 5, T: 3 },
 draw: R => { let p; do { p = { a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 12), T: R.int(2, 3) }; } while (p.T === 2 && (2 * p.a + p.b) % 3 !== 0); return p; },
 build: ({ a, b, c, T }) => { const A = 2 * a + b, W = A * cub(T) / 3 - c * T, Fend = [a * T, b * T * T - c], Ft = `⟨${poly([[a, 'y']])}, ${poly([[b, 'x'], [-c, '']])}⟩`,
  Fx = poly([[a, 't']]), Fy = poly([[b, 't²'], [-c, '']]), dot = poly([[A, 't²'], [-c, '']]); return {
  prompt: `An inspection trolley rolls along a curved rail in the cable yard. The wind and the brake together push on it with the force field F(x, y) = ${Ft} newtons, with x and y in metres, and the trolley follows the rail r(t) = ⟨t², t⟩ from t = 0 to t = ${n(T)} seconds. Enter the work the force does on the trolley over the whole rail, in joules. A negative answer means the force worked against the motion overall.`,
  answer: [W],
  hints: ['Work along a path is the line integral of F(r(t)) · r′(t) dt: put the path into the force, then take the dot product with the velocity r′(t).', 'The dot product comes out as a polynomial in t, with a constant term that may be negative. Integrate it term by term from t = 0 to the end time.'],
  solution: `On the rail x = t² and y = t, so F(r(t)) = ⟨${Fx}, ${Fy}⟩ and r′(t) = ⟨2t, 1⟩. Their dot product is (${Fx}) × 2t + (${Fy}) × 1 = ${dot}. The work is the integral of ${dot} from t = 0 to t = ${n(T)}: ${n(A)} × ${n(T)}³ ÷ 3 − ${n(c)} × ${n(T)} = ${n(A * cub(T) / 3)} − ${n(c * T)} = ${n(W)} joules.`,
  guidance: [
   { prompt: `The rail ends at r(${n(T)}) = ${pt([T * T, T])}. What are the two components of the force F there?`, answer: Fend, explanation: `F${pt([T * T, T])} = ⟨${n(a)} × ${n(T)}, ${n(b)} × ${n(T * T)} − ${n(c)}⟩ = ${ang(Fend)}.` },
   { prompt: `Put the rail into F and take the dot product with r′(t) = ⟨2t, 1⟩. Written as At² + B, what are A and B?`, answer: [A, -c], explanation: `F(r(t)) = ⟨${Fx}, ${Fy}⟩, and the dot product is (${Fx}) × 2t + (${Fy}) × 1 = ${dot}, so A = ${n(A)} and B = ${n(-c)}.` },
   { prompt: `Integrate ${dot} from t = 0 to t = ${n(T)}. What is the work, in joules?`, answer: [W], explanation: `${n(A)} × ${n(T)}³ ÷ 3 − ${n(c)} × ${n(T)} = ${n(A * cub(T) / 3)} − ${n(c * T)} = ${n(W)} joules.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Hauling the sled up the ramp',
 brief: 'The tractor hauls a sled along a straight ramp for a fixed number of seconds, and the power crew want the energy and the average power.',
 labels: ['work (J)', 'average power (W)'], tolerance: 0.01,
 gl: [['A (W)', 'B (W/s)'], ['work (J)'], ['average power (W)']]
}, {
 /* F = ⟨px + s, qy⟩ along the straight track r(t) = ⟨at, bt⟩, t from 0 to T seconds: F(r) · r′ = as + (pa² + qb²)t. Work = asT + BT² ÷ 2, power = work ÷ T = as + BT ÷ 2, both whole. */
 canonical: { p: 2, q: 1, s: 3, a: 2, b: 1, T: 4 },
 draw: R => { let x; do { x = { p: R.int(1, 3), q: R.int(1, 3), s: R.int(1, 6), a: R.int(1, 3), b: R.int(1, 3), T: R.int(2, 5) }; } while (((x.p * x.a * x.a + x.q * x.b * x.b) * x.T) % 2 !== 0); return x; },
 build: ({ p, q, s, a, b, T }) => { const A = a * s, B = p * a * a + q * b * b, W = A * T + B * T * T / 2, P = W / T, Ft = `⟨${poly([[p, 'x'], [s, '']])}, ${poly([[q, 'y']])}⟩`,
  Fx = poly([[p * a, 't'], [s, '']]), Fy = poly([[q * b, 't']]), dot = poly([[A, ''], [B, 't']]); return {
  prompt: `A tractor hauls a sled up a straight ramp in the cable yard. The force on the sled is F(x, y) = ${Ft} newtons, with x and y in metres, and the sled follows r(t) = ⟨${poly([[a, 't']])}, ${poly([[b, 't']])}⟩ for t from 0 to ${n(T)} seconds. Enter the work the force does on the sled over the ${n(T)} seconds, in joules, then the average power, which is that work divided by the time, in watts.`,
  answer: [W, P],
  hints: ['Work along a path is the line integral of F(r(t)) · r′(t) dt. For a straight track r′(t) is a constant vector, so the dot product is a formula of the form A + Bt.', 'Integrate A + Bt from 0 to the end time to get the work. Average power is the work divided by the time it took.'],
  solution: `On the ramp x = ${poly([[a, 't']])} and y = ${poly([[b, 't']])}, so F(r(t)) = ⟨${Fx}, ${Fy}⟩ and r′(t) = ${ang([a, b])}. Their dot product is ${n(a)} × (${Fx}) + ${n(b)} × ${Fy} = ${dot}. The work is the integral of ${dot} from t = 0 to t = ${n(T)}: ${n(A)} × ${n(T)} + ${n(B)} × ${n(T)}² ÷ 2 = ${n(A * T)} + ${n(B * T * T / 2)} = ${n(W)} joules. The average power is ${n(W)} ÷ ${n(T)} = ${n(P)} watts.`,
  guidance: [
   { prompt: `Put the ramp into F and take the dot product with r′(t) = ${ang([a, b])}. Written as A + Bt, what are A and B?`, answer: [A, B], explanation: `F(r(t)) = ⟨${Fx}, ${Fy}⟩, and the dot product is ${n(a)} × (${Fx}) + ${n(b)} × ${Fy} = ${dot}, so A = ${n(A)} and B = ${n(B)}.` },
   { prompt: `Integrate ${dot} from t = 0 to t = ${n(T)}. What is the work, in joules?`, answer: [W], explanation: `${n(A)} × ${n(T)} + ${n(B)} × ${n(T)}² ÷ 2 = ${n(A * T)} + ${n(B * T * T / 2)} = ${n(W)} joules.` },
   { prompt: `Average power is work divided by time. What is it for ${n(W)} joules in ${n(T)} seconds, in watts?`, answer: [P], explanation: `${n(W)} ÷ ${n(T)} = ${n(P)} watts.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q10', title: 'Swinging the cart round the turntable',
 brief: 'A cart is swung round part of a circular turntable by a swirling force, and the crew need the work in terms of π.',
 labels: ['k in k·π (J)'], tolerance: 0.01,
 gl: [['A', 'B'], ['c'], ['k in k·π (J)']]
}, {
 /* F = ⟨−ay, bx⟩ along the arc r(t) = ⟨R cos t, R sin t⟩, t from 0 to jπ ÷ 2: F(r) · r′ = aR² sin²t + bR² cos²t, and each of sin²t and cos²t integrates to (j ÷ 4)π,
    so the work is (aR² + bR²)(j ÷ 4)π, with k a multiple of 0.5. The q32 worked example is a straight track. */
 canonical: { a: 2, b: 3, R: 2, j: 2 },
 draw: R => { let p; do { p = { a: R.int(1, 4), b: R.int(1, 4), R: R.int(1, 3), j: R.int(1, 4) }; } while (p.a === p.b || ((p.a + p.b) * p.R * p.R * p.j) % 2 !== 0); return p; },
 build: ({ a, b, R, j }) => { const A = a * R * R, B = b * R * R, c = j, k = (A + B) * c / 4, Ft = `⟨${poly([[-a, 'y']])}, ${poly([[b, 'x']])}⟩`, dot = `${co(A)}sin² t + ${co(B)}cos² t`; return {
  prompt: `A cart is swung round part of a circular turntable of radius ${n(R)} ${R === 1 ? 'metre' : 'metres'} in the cable yard: it follows r(t) = ⟨${co(R)}cos t, ${co(R)}sin t⟩ from t = 0 to t = ${TURN[j]}, with t in radians. The swirling force on it is F(x, y) = ${Ft} newtons, with x and y in metres. The work is k·π joules. Enter k (it may be a decimal such as 4.5: enter it exactly).`,
  answer: [k],
  hints: ['Work along a path is the line integral of F(r(t)) · r′(t) dt. Put x = R cos t and y = R sin t into F, then take the dot product with r′(t).', 'Use sin²t = (1 − cos 2t) ÷ 2 and cos²t = (1 + cos 2t) ÷ 2. Over a range from 0 to a multiple of π ÷ 2 the cos 2t parts add up to 0, so each of sin²t and cos²t integrates to half the range.'],
  solution: `On the arc x = ${co(R)}cos t and y = ${co(R)}sin t, so F(r(t)) = ⟨−${n(a * R)} sin t, ${n(b * R)} cos t⟩ and r′(t) = ⟨−${co(R)}sin t, ${co(R)}cos t⟩. Their dot product is ${dot}. Each of the integrals of sin²t and cos²t from 0 to ${TURN[j]} is half the range, (${n(c)} ÷ 4)π, so the work is (${n(A)} + ${n(B)}) × ${n(c)} ÷ 4 × π = ${n(k)}π joules.`,
  guidance: [
   { prompt: `Put the arc into F and take the dot product with r′(t). Written as A sin²t + B cos²t, what are A and B?`, answer: [A, B], explanation: `F(r(t)) · r′(t) = (−${n(a * R)} sin t)(−${co(R)}sin t) + (${n(b * R)} cos t)(${co(R)}cos t) = ${dot}, so A = ${n(A)} and B = ${n(B)}.` },
   { prompt: `The integral of sin²t from 0 to ${TURN[j]} is (c ÷ 4)π, and so is the integral of cos²t. What is c?`, answer: [c], explanation: `Each is half the range, and half of ${TURN[j]} is ${n(c)}π ÷ 4, so c = ${n(c)}.` },
   { prompt: `The work is (A + B) × (c ÷ 4)π. What is k, with the work equal to k·π joules?`, answer: [k], explanation: `(${n(A)} + ${n(B)}) × ${n(c)} ÷ 4 = ${n(k)}, so the work is ${n(k)}π joules.` }
  ] }; }
});

/* ---- q33 Conservative fields and potential functions [6.3] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The magnet cart and the missing constant',
 brief: 'A magnet cart’s force field has one constant smudged on the plan, and Mira says it must be the value that makes the field conservative.',
 labels: ['k', 'work (J)'], tolerance: 0.01,
 gl: [['∂Q/∂x'], ['α', 'β', 'γ'], ['work (J)']]
}, {
 /* F = ⟨ax + ky, bx + cy⟩ with a and c even: conservative exactly when k = b, then φ = (a ÷ 2)x² + bxy + (c ÷ 2)y². The q33 worked example is ⟨2x + y, x⟩. */
 canonical: { a: 4, b: 2, c: 6, x1: 0, y1: 1, x2: 2, y2: 3 },
 draw: R => { let p, phi; do { p = { a: R.pick([2, 4, 6]), b: R.nz(-4, 4), c: R.pick([2, 4, 6]), x1: R.int(-2, 2), y1: R.int(-2, 2), x2: R.int(-2, 3), y2: R.int(-2, 3) };
   phi = (x, y) => p.a / 2 * x * x + p.b * x * y + p.c / 2 * y * y; } while (phi(p.x2, p.y2) === phi(p.x1, p.y1)); return p; },
 build: ({ a, b, c, x1, y1, x2, y2 }) => { const al = a / 2, ga = c / 2, phi = (x, y) => al * x * x + b * x * y + ga * y * y, e = phi(x2, y2), s = phi(x1, y1), W = e - s,
  Ft = `⟨${poly([[a, 'x'], [1, 'ky']])}, ${poly([[b, 'x'], [c, 'y']])}⟩`, phiT = poly([[al, 'x²'], [b, 'xy'], [ga, 'y²']]); return {
  prompt: `A magnet cart in the cable yard feels the force field F(x, y) = ${Ft} newtons, with x and y in metres. The constant k is smudged on the plan, but the crew know F is conservative. Enter the value of k that makes F conservative. Then, with that k, enter the work F does on the cart as it is hauled along a winding rail from ${pt([x1, y1])} to ${pt([x2, y2])}, in joules. The rail’s winding shape does not matter here: the work done by a conservative field depends only on where the path starts and ends.`,
  answer: [b, W],
  hints: ['A field ⟨P, Q⟩ in the plane is conservative when ∂P/∂y = ∂Q/∂x everywhere. Work out both for this field and make them equal.', 'With k known, find a potential function φ with ∂φ/∂x = P and ∂φ/∂y = Q. The work from one point to another along any path is φ at the end minus φ at the start.'],
  solution: `Here ∂P/∂y = k and ∂Q/∂x = ${n(b)}. For F to be conservative they must be equal, so k = ${n(b)}. A potential function is φ(x, y) = ${phiT}: its partial derivatives are ${poly([[a, 'x'], [b, 'y']])} and ${poly([[b, 'x'], [c, 'y']])}. Then φ${pt([x2, y2])} = ${n(e)} and φ${pt([x1, y1])} = ${n(s)}, so the work is ${n(e)} − ${par(s)} = ${n(W)} joules, whatever shape the rail has.`,
  guidance: [
   { prompt: `For F(x, y) = ${Ft}, ∂P/∂y is k. What is ∂Q/∂x, the x-rate of the second component? It is the value k must take.`, answer: [b], explanation: `Q = ${poly([[b, 'x'], [c, 'y']])}, so ∂Q/∂x = ${n(b)}. Setting ∂P/∂y = k equal to it gives k = ${n(b)}.` },
   { prompt: `With k = ${n(b)}, F has a potential function of the form φ(x, y) = αx² + βxy + γy². What are α, β and γ?`, answer: [al, b, ga], explanation: `∂φ/∂x = 2αx + βy must be ${poly([[a, 'x'], [b, 'y']])} and ∂φ/∂y = βx + 2γy must be ${poly([[b, 'x'], [c, 'y']])}, so α = ${n(al)}, β = ${n(b)} and γ = ${n(ga)}.` },
   { prompt: `With φ(x, y) = ${phiT}, what is the work φ${pt([x2, y2])} − φ${pt([x1, y1])}, in joules?`, answer: [W], explanation: `φ${pt([x2, y2])} = ${n(e)} and φ${pt([x1, y1])} = ${n(s)}, so the work is ${n(e)} − ${par(s)} = ${n(W)} joules.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Two rails, two hauls',
 brief: 'A cart is hauled to a junction on one winding rail and on to a store on another, and Mira wants the work for each leg without tracking either rail.',
 labels: ['first leg work (J)', 'second leg work (J)'], tolerance: 0.01,
 gl: [['α', 'β', 'γ'], ['φ at the start', 'φ at the junction', 'φ at the store'], ['first leg work (J)', 'second leg work (J)']]
}, {
 /* F = ⟨2axy + b, ax² + c⟩ = ∇(ax²y + bx + cy), stated conservative. Three points A, B, C; the work of each leg is a difference of φ and neither is 0. */
 canonical: { a: 2, b: 3, c: 1, xa: 0, ya: 1, xb: 1, yb: 2, xc: 2, yc: 0 },
 draw: R => { let p, phi; do { p = { a: R.int(1, 3), b: R.nz(-3, 4), c: R.int(1, 4), xa: R.int(-2, 2), ya: R.int(-2, 2), xb: R.int(-2, 3), yb: R.int(-2, 3), xc: R.int(-2, 3), yc: R.int(-2, 3) };
   phi = (x, y) => p.a * x * x * y + p.b * x + p.c * y; } while (phi(p.xb, p.yb) === phi(p.xa, p.ya) || phi(p.xc, p.yc) === phi(p.xb, p.yb)); return p; },
 build: ({ a, b, c, xa, ya, xb, yb, xc, yc }) => { const phi = (x, y) => a * x * x * y + b * x + c * y, pa = phi(xa, ya), pb = phi(xb, yb), pc = phi(xc, yc), W1 = pb - pa, W2 = pc - pb,
  Ft = `⟨${poly([[2 * a, 'xy'], [b, '']])}, ${poly([[a, 'x²'], [c, '']])}⟩`, phiT = poly([[a, 'x²y'], [b, 'x'], [c, 'y']]), A = pt([xa, ya]), B = pt([xb, yb]), C = pt([xc, yc]); return {
  prompt: `A cart in the cable yard is hauled from the start ${A} along a winding rail to a junction ${B}, then along a different winding rail to the store ${C}, with x and y in metres. The force on it is F(x, y) = ${Ft} newtons. Mira has checked that F is conservative. Enter the work F does on the first leg, then on the second leg, in joules.`,
  answer: [W1, W2],
  hints: ['A conservative field is the gradient of a potential function φ: ∂φ/∂x is the first component and ∂φ/∂y the second. Find φ by integrating the first component in x and then fixing the part that depends on y alone.', 'The work along any path is φ at the end minus φ at the start, so each leg only needs the values of φ at its two ends. The shape of the rail does not matter.'],
  solution: `A potential function is φ(x, y) = ${phiT}: its partial derivatives are ${poly([[2 * a, 'xy'], [b, '']])} and ${poly([[a, 'x²'], [c, '']])}. Then φ${A} = ${n(pa)}, φ${B} = ${n(pb)} and φ${C} = ${n(pc)}. The first leg does ${n(pb)} − ${par(pa)} = ${n(W1)} joules and the second does ${n(pc)} − ${par(pb)} = ${n(W2)} joules.`,
  guidance: [
   { prompt: `F has a potential function of the form φ(x, y) = αx²y + βx + γy. What are α, β and γ?`, answer: [a, b, c], explanation: `∂φ/∂x = 2αxy + β must be ${poly([[2 * a, 'xy'], [b, '']])} and ∂φ/∂y = αx² + γ must be ${poly([[a, 'x²'], [c, '']])}, so α = ${n(a)}, β = ${n(b)} and γ = ${n(c)}.` },
   { prompt: `With φ(x, y) = ${phiT}, what are φ${A}, φ${B} and φ${C}?`, answer: [pa, pb, pc], explanation: `φ${A} = ${n(pa)}, φ${B} = ${n(pb)} and φ${C} = ${n(pc)}.` },
   { prompt: `Each leg does the work φ at its end minus φ at its start. What are the work on the first leg and on the second leg, in joules?`, answer: [W1, W2], explanation: `${n(pb)} − ${par(pa)} = ${n(W1)} and ${n(pc)} − ${par(pb)} = ${n(W2)} joules.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q19', title: 'A potential for the crane yard in space',
 brief: 'The crane yard field acts in three dimensions, and Mira wants the work for two hauls read off a single potential function.',
 labels: ['first haul work (J)', 'second haul work (J)'], tolerance: 0.01,
 gl: [['α', 'β', 'γ'], ['φ at A', 'φ at B'], ['first haul work (J)', 'second haul work (J)']]
}, {
 /* F = ⟨2axy + cz, ax² + bz, by + cx⟩ = ∇(ax²y + byz + cxz) in space, φ(0, 0, 0) = 0. Haul 1: A to B, haul 2: B to the origin O, so the work is φ(B) − φ(A) and −φ(B). */
 canonical: { a: 1, b: 2, c: 3, A: [1, 0, 2], B: [2, 1, 1] },
 draw: R => { let p, phi; do { p = { a: R.int(1, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), A: [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)], B: [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)] };
   phi = q => p.a * q[0] * q[0] * q[1] + p.b * q[1] * q[2] + p.c * q[0] * q[2]; } while (phi(p.B) === 0 || phi(p.B) === phi(p.A)); return p; },
 build: ({ a, b, c, A, B }) => { const phi = q => a * q[0] * q[0] * q[1] + b * q[1] * q[2] + c * q[0] * q[2], pa = phi(A), pb = phi(B), W1 = pb - pa, W2 = -pb,
  Ft = `⟨${poly([[2 * a, 'xy'], [c, 'z']])}, ${poly([[a, 'x²'], [b, 'z']])}, ${poly([[b, 'y'], [c, 'x']])}⟩`, phiT = poly([[a, 'x²y'], [b, 'yz'], [c, 'xz']]); return {
  prompt: `A force field acts through the crane yard in space: F(x, y, z) = ${Ft} newtons, with x, y and z in metres. It is conservative, which means it is the gradient ∇φ of a potential function φ(x, y, z), just as in the plane. A cart is hauled along a winding rail from A = ${pt(A)} to B = ${pt(B)}, and then straight back to the yard origin (0, 0, 0). Enter the work F does on the first haul, then on the second, in joules.`,
  answer: [W1, W2],
  hints: ['F = ∇φ means ∂φ/∂x is the first component, ∂φ/∂y the second and ∂φ/∂z the third. Integrate the first component in x, then add the terms the other two components still need.', 'The work along any path is φ at the end minus φ at the start. The potential is 0 at the origin, because every term of φ has a factor x, y or z.'],
  solution: `A potential function is φ(x, y, z) = ${phiT}: its partial derivatives are ${poly([[2 * a, 'xy'], [c, 'z']])}, ${poly([[a, 'x²'], [b, 'z']])} and ${poly([[b, 'y'], [c, 'x']])}. Then φ${pt(A)} = ${n(pa)} and φ${pt(B)} = ${n(pb)}, and φ(0, 0, 0) = 0. The first haul does ${n(pb)} − ${par(pa)} = ${n(W1)} joules and the second does 0 − ${par(pb)} = ${n(W2)} joules.`,
  guidance: [
   { prompt: `F has a potential function of the form φ(x, y, z) = αx²y + βyz + γxz. What are α, β and γ?`, answer: [a, b, c], explanation: `∂φ/∂x = 2αxy + γz must be ${poly([[2 * a, 'xy'], [c, 'z']])}, ∂φ/∂y = αx² + βz must be ${poly([[a, 'x²'], [b, 'z']])} and ∂φ/∂z = βy + γx must be ${poly([[b, 'y'], [c, 'x']])}, so α = ${n(a)}, β = ${n(b)} and γ = ${n(c)}.` },
   { prompt: `With φ(x, y, z) = ${phiT}, what are φ at A = ${pt(A)} and φ at B = ${pt(B)}?`, answer: [pa, pb], explanation: `φ${pt(A)} = ${n(pa)} and φ${pt(B)} = ${n(pb)}.` },
   { prompt: `The work on each haul is φ at its end minus φ at its start, and φ(0, 0, 0) = 0. What are the work from A to B and the work from B to the origin, in joules?`, answer: [W1, W2], explanation: `${n(pb)} − ${par(pa)} = ${n(W1)} and 0 − ${par(pb)} = ${n(W2)} joules.` }
  ] }; }
});

/* ---- q34 Green's theorem [6.4] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'Once round the landing pad',
 brief: 'A survey cart is about to run once round the circular landing pad, and Mira wants its net work without tracking the whole curve.',
 labels: ['∂Q/∂x − ∂P/∂y', 'k in k·π (J)'], tolerance: 0.01,
 gl: [['∂Q/∂x', '∂P/∂y'], ['∂Q/∂x − ∂P/∂y'], ['k in k·π (J)']]
}, {
 /* F = ⟨cx − ay, bx + dy²⟩: ∂Q/∂x − ∂P/∂y = a + b, constant, so the circulation round the disc of radius R about the origin is (a + b)πR², anticlockwise.
    a + b is never 0. The q34 worked example is a rectangle. */
 canonical: { a: 2, b: 3, c: 1, d: 2, R: 3 },
 draw: R => { let p; do { p = { a: R.int(1, 5), b: R.nz(-3, 5), c: R.int(1, 4), d: R.int(1, 3), R: R.int(1, 6) }; } while (p.a + p.b === 0); return p; },
 build: ({ a, b, c, d, R }) => { const cu = a + b, k = cu * R * R, P = poly([[c, 'x'], [-a, 'y']]), Q = poly([[b, 'x'], [d, 'y²']]); return {
  prompt: `A survey cart runs once round the rim of the circular landing pad in the cable yard, anticlockwise. The pad has radius ${n(R)} ${R === 1 ? 'metre' : 'metres'} and its centre is the origin. The force on the cart is F(x, y) = ⟨${P}, ${Q}⟩ newtons, with x and y in metres. Use Green’s theorem. Enter the value of ∂Q/∂x − ∂P/∂y, which is the same everywhere here, then the circulation of F round the rim as k·π joules: enter k.`,
  answer: [cu, k],
  hints: ['Green’s theorem: for F = ⟨P, Q⟩ round a closed curve travelled anticlockwise, the circulation equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside.', 'When ∂Q/∂x − ∂P/∂y is a constant, the double integral is that constant times the area of the region. The area of a disc of radius r is πr².'],
  solution: `Here P = ${P} and Q = ${Q}. ∂Q/∂x = ${n(b)} and ∂P/∂y = ${n(-a)}, so ∂Q/∂x − ∂P/∂y = ${n(b)} − ${par(-a)} = ${n(cu)}. Green’s theorem turns the lap into the double integral of the constant ${n(cu)} over the pad, whose area is π × ${n(R)}² = ${n(R * R)}π. The circulation is ${n(cu)} × ${n(R * R)}π = ${n(k)}π joules, so k = ${n(k)}.`,
  guidance: [
   { prompt: `Work out ∂Q/∂x for Q = ${Q} and ∂P/∂y for P = ${P}.`, answer: [b, -a], explanation: `∂Q/∂x = ${n(b)} (the y² term has no x) and ∂P/∂y = ${n(-a)} (the ${poly([[c, 'x']])} term has no y).` },
   { prompt: `What is ∂Q/∂x − ∂P/∂y?`, answer: [cu], explanation: `${n(b)} − ${par(-a)} = ${n(cu)}, the same at every point of the pad.` },
   { prompt: `The pad has area π × ${n(R)}² = ${n(R * R)}π. The circulation is ${cu === 1 ? 'equal to that area' : cu === -1 ? 'minus that area' : `${n(cu)} times that area`}, k·π joules. What is k?`, answer: [k], explanation: `${n(cu)} × ${n(R * R)} = ${n(k)}, so the circulation is ${n(k)}π joules.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Night laps of the fenced yard',
 brief: 'The inspection cart runs laps of a fenced yard, and Mira needs the energy of one lap and of a whole shift run the other way.',
 labels: ['one lap, anticlockwise (J)', 'laps run clockwise (J)'], tolerance: 0.01,
 gl: [['coefficient of x', 'coefficient of y', 'constant'], ['one lap (J)'], ['laps run clockwise (J)']]
}, {
 /* F = ⟨px² + axy, rxy + cx⟩: ∂Q/∂x − ∂P/∂y = ry + c − ax. Over the rectangle [x0, x1] × [y0, y1] the lap is −aH(x1² − x0²) ÷ 2 + rW(y1² − y0²) ÷ 2 + cWH,
    kept whole. n laps run clockwise give −n times the lap. */
 canonical: { p: 2, a: 2, r: 3, c: 1, x0: 1, y0: 0, W: 2, H: 2, nl: 3 },
 draw: R => { let x; do { x = { p: R.int(1, 3), a: R.int(1, 4), r: R.int(1, 4), c: R.int(1, 4), x0: R.int(0, 2), y0: R.int(0, 2), W: R.int(1, 3), H: R.int(1, 3), nl: R.int(2, 4) };
   const x1 = x.x0 + x.W, y1 = x.y0 + x.H, lap = -x.a * x.H * (x1 * x1 - x.x0 * x.x0) / 2 + x.r * x.W * (y1 * y1 - x.y0 * x.y0) / 2 + x.c * x.W * x.H;
   x.ok = (x.a * x.H * (x1 * x1 - x.x0 * x.x0)) % 2 === 0 && (x.r * x.W * (y1 * y1 - x.y0 * x.y0)) % 2 === 0 && lap !== 0; } while (!x.ok); delete x.ok; return x; },
 build: ({ p, a, r, c, x0, y0, W, H, nl }) => { const x1 = x0 + W, y1 = y0 + H, cx = -a, cy = r, X = -a * H * (x1 * x1 - x0 * x0) / 2, Y = r * W * (y1 * y1 - y0 * y0) / 2, K = c * W * H, lap = X + Y + K, tot = -nl * lap,
  P = poly([[p, 'x²'], [a, 'xy']]), Q = poly([[r, 'xy'], [c, 'x']]), curl = poly([[cx, 'x'], [cy, 'y'], [c, '']]); return {
  prompt: `The inspection cart runs laps of the fenced yard with corners ${pt([x0, y0])}, ${pt([x1, y0])}, ${pt([x1, y1])} and ${pt([x0, y1])}, in that order, which is anticlockwise. The force on it is F(x, y) = ⟨${P}, ${Q}⟩ newtons, with x and y in metres. Use Green’s theorem to find the work F does on one anticlockwise lap. Then the cart runs ${n(nl)} laps the other way, clockwise, each the same lap round the same fence. Enter the work for one anticlockwise lap, then the total work over the ${n(nl)} clockwise laps, in joules.`,
  answer: [lap, tot],
  hints: ['Green’s theorem: for F = ⟨P, Q⟩ round a closed curve travelled anticlockwise, the circulation equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside. Terms of F that do not change in the other variable drop out of it.', 'Integrate each term of ∂Q/∂x − ∂P/∂y over the rectangle in turn. Going round the same lap clockwise gives the negative of the anticlockwise value, and each lap counts again.'],
  solution: `Here P = ${P} and Q = ${Q}. ∂Q/∂x = ${poly([[r, 'y'], [c, '']])} and ∂P/∂y = ${poly([[a, 'x']])}, so ∂Q/∂x − ∂P/∂y = ${curl}. Over the yard, ${n(W)} m by ${n(H)} m with area ${n(W * H)}: the constant ${n(c)} gives ${n(K)}, the term ${poly([[cx, 'x']])} gives ${par(cx)} × ${n(H)} × (${n(x1)}² − ${n(x0)}²) ÷ 2 = ${n(X)}, and the term ${poly([[cy, 'y']])} gives ${n(cy)} × ${n(W)} × (${n(y1)}² − ${n(y0)}²) ÷ 2 = ${n(Y)}. One anticlockwise lap is ${n(K)} + ${par(X)} + ${par(Y)} = ${n(lap)} joules. Clockwise reverses the sign, so ${n(nl)} laps give −${n(nl)} × ${par(lap)} = ${n(tot)} joules.`,
  guidance: [
   { prompt: `Work out ∂Q/∂x − ∂P/∂y for P = ${P} and Q = ${Q}. Written as Ax + By + k, what are A, B and k?`, answer: [cx, cy, c], explanation: `∂Q/∂x = ${poly([[r, 'y'], [c, '']])} and ∂P/∂y = ${poly([[a, 'x']])}. Subtracting gives ${curl}, so A = ${n(cx)}, B = ${n(cy)} and k = ${n(c)}.` },
   { prompt: `The yard runs from x = ${n(x0)} to ${n(x1)} and from y = ${n(y0)} to ${n(y1)}. What is the integral of ${curl} over it, which is the work for one anticlockwise lap, in joules?`, answer: [lap], explanation: `The constant gives ${n(K)}, the x term gives ${n(X)} and the y term gives ${n(Y)}, so one lap is ${n(lap)} joules.` },
   { prompt: `Clockwise reverses the sign of the circulation. What is the total work over ${n(nl)} clockwise laps, in joules?`, answer: [tot], explanation: `−${n(nl)} × ${par(lap)} = ${n(tot)} joules.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q25', title: 'The triangular fence',
 brief: 'A three-sided fence is staked out on the yard corner, and Mira wants the work of one lap round it from the area inside.',
 labels: ['area (m²)', 'circulation (J)'], tolerance: 0.01,
 gl: [['m', 'k'], ['area (m²)', 'integral of y over the triangle'], ['circulation (J)']]
}, {
 /* F = ⟨−ay² + bx, rxy + cx⟩: ∂Q/∂x − ∂P/∂y = (r + 2a)y + c = my + c. Over the triangle (0,0), (w,0), (0,h), area wh ÷ 2 and the integral of y is wh² ÷ 6,
    so the circulation is mwh² ÷ 6 + cwh ÷ 2; both parts whole. The q34 worked example is a rectangle. */
 canonical: { a: 1, b: 2, r: 2, c: 3, w: 3, h: 2 },
 draw: R => { let x; do { x = { a: R.int(1, 3), b: R.int(1, 4), r: R.int(1, 3), c: R.nz(-3, 4), w: R.int(2, 6), h: R.int(2, 6) }; const m = x.r + 2 * x.a;
   x.ok = (x.w * x.h * x.h) % 6 === 0 && (x.c * x.w * x.h) % 2 === 0; } while (!x.ok); delete x.ok; return x; },
 build: ({ a, b, r, c, w, h }) => { const m = r + 2 * a, area = w * h / 2, iy = w * h * h / 6, circ = m * iy + c * area, P = poly([[-a, 'y²'], [b, 'x']]), Q = poly([[r, 'xy'], [c, 'x']]), curl = poly([[m, 'y'], [c, '']]); return {
  prompt: `A three-sided fence is staked out in the corner of the cable yard, with corners (0, 0), (${n(w)}, 0) and (0, ${n(h)}), in that order, which is anticlockwise. The force on a cart is F(x, y) = ⟨${P}, ${Q}⟩ newtons, with x and y in metres. Enter the area inside the fence, then use Green’s theorem to find the work F does on the cart over one anticlockwise lap of the fence, in joules.`,
  answer: [area, circ],
  hints: ['Green’s theorem: for F = ⟨P, Q⟩ round a closed curve travelled anticlockwise, the circulation equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside. The result is a formula in y, so slice the triangle by height.', 'At height y the triangle is the full width times (1 − y ÷ height) wide. Integrate y times that width from y = 0 up to the height to get the integral of y, and use the area for the constant part.'],
  solution: `Here P = ${P} and Q = ${Q}. ∂Q/∂x = ${poly([[r, 'y'], [c, '']])} and ∂P/∂y = ${poly([[-2 * a, 'y']])}, so ∂Q/∂x − ∂P/∂y = ${curl}. The triangle has area ${n(w)} × ${n(h)} ÷ 2 = ${n(area)}. At height y it is ${n(w)} × (1 − y ÷ ${n(h)}) wide, so the integral of y over it is ${n(w)} × ${n(h)}² ÷ 6 = ${n(iy)}. The circulation is ${par(m)} × ${n(iy)} + ${par(c)} × ${n(area)} = ${n(m * iy)} + ${par(c * area)} = ${n(circ)} joules.`,
  guidance: [
   { prompt: `Work out ∂Q/∂x − ∂P/∂y for P = ${P} and Q = ${Q}. Written as my + k, what are m and k?`, answer: [m, c], explanation: `∂Q/∂x = ${poly([[r, 'y'], [c, '']])} and ∂P/∂y = ${poly([[-2 * a, 'y']])}. Subtracting gives ${curl}, so m = ${n(m)} and k = ${n(c)}.` },
   { prompt: `What is the area of the triangle, and what is the integral of y over it? (At height y it is ${n(w)} × (1 − y ÷ ${n(h)}) wide.)`, answer: [area, iy], explanation: `The area is ${n(w)} × ${n(h)} ÷ 2 = ${n(area)}. The integral of y is the integral of y × ${n(w)} × (1 − y ÷ ${n(h)}) from 0 to ${n(h)}, which is ${n(w)} × ${n(h)}² ÷ 6 = ${n(iy)}.` },
   { prompt: `The circulation is m × (the integral of y) + k × (the area). What is it, in joules?`, answer: [circ], explanation: `${par(m)} × ${n(iy)} + ${par(c)} × ${n(area)} = ${n(m * iy)} + ${par(c * area)} = ${n(circ)} joules.` }
  ] }; }
});

/* ---- q35 Divergence and curl [6.5] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The exhaust duct probe',
 brief: 'A probe in the exhaust duct reads the air’s motion at one spot, and the plant engineers want both its spreading and its swirl.',
 labels: ['div F (1/s)', 'curl F, x-component (1/s)', 'curl F, y-component (1/s)', 'curl F, z-component (1/s)'], tolerance: 0.01,
 gl: [['∂P/∂x', '∂Q/∂y', '∂R/∂z'], ['div F (1/s)'], ['∂R/∂y', '∂Q/∂z'], ['curl x', 'curl y', 'curl z']]
}, {
 /* F = ⟨px²y + qz, ryz² + sx, txyz⟩: div = (2p + t)xy + rz², curl = ⟨txz − 2ryz, q − tyz, s − px²⟩. The q35 worked example is ⟨xz, yz, xy⟩. */
 canonical: { p: 2, q: 3, r: 1, s: 4, t: 2, x0: 1, y0: 2, z0: 3 },
 draw: R => ({ p: R.int(1, 3), q: R.int(1, 4), r: R.int(1, 3), s: R.int(1, 4), t: R.int(1, 3), x0: R.nz(-2, 3), y0: R.nz(-2, 3), z0: R.nz(-2, 3) }),
 build: ({ p, q, r, s, t, x0, y0, z0 }) => { const Px = 2 * p * x0 * y0, Qy = r * z0 * z0, Rz = t * x0 * y0, div = Px + Qy + Rz, Ry = t * x0 * z0, Qz = 2 * r * y0 * z0, Pz = q, Rx = t * y0 * z0, Qx = s, Py = p * x0 * x0,
  curl = [Ry - Qz, Pz - Rx, Qx - Py], P = poly([[p, 'x²y'], [q, 'z']]), Q = poly([[r, 'yz²'], [s, 'x']]), Rr = poly([[t, 'xyz']]), at = pt([x0, y0, z0]); return {
  prompt: `A probe in the exhaust duct reads the air’s velocity field F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second, with x, y and z in metres. Enter div F at the point ${at}, then the three components of curl F there.`,
  answer: [div, ...curl],
  hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. For each, differentiate in that letter and treat the other two letters as fixed numbers.', 'curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. Work out each partial derivative as a formula first, then put in the point.'],
  solution: `∂P/∂x = ${poly([[2 * p, 'xy']])}, ∂Q/∂y = ${poly([[r, 'z²']])} and ∂R/∂z = ${poly([[t, 'xy']])}, so at ${at} the divergence is ${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}. For the curl: ∂R/∂y = ${poly([[t, 'xz']])}, ∂Q/∂z = ${poly([[2 * r, 'yz']])}, ∂P/∂z = ${n(q)}, ∂R/∂x = ${poly([[t, 'yz']])}, ∂Q/∂x = ${n(s)} and ∂P/∂y = ${poly([[p, 'x²']])}. At the point, curl F = ⟨${n(Ry)} − ${par(Qz)}, ${n(Pz)} − ${par(Rx)}, ${n(Qx)} − ${par(Py)}⟩ = ${ang(curl)}.`,
  guidance: [
   { prompt: `At ${at}, what are ∂P/∂x, ∂Q/∂y and ∂R/∂z?`, answer: [Px, Qy, Rz], explanation: `∂P/∂x = ${poly([[2 * p, 'xy']])} = ${n(Px)}, ∂Q/∂y = ${poly([[r, 'z²']])} = ${n(Qy)} and ∂R/∂z = ${poly([[t, 'xy']])} = ${n(Rz)}.` },
   { prompt: `Add them. What is div F at ${at}?`, answer: [div], explanation: `${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}.` },
   { prompt: `For the first component of the curl you need ∂R/∂y and ∂Q/∂z. What are they at ${at}?`, answer: [Ry, Qz], explanation: `∂R/∂y = ${poly([[t, 'xz']])} = ${n(Ry)} and ∂Q/∂z = ${poly([[2 * r, 'yz']])} = ${n(Qz)}.` },
   { prompt: `What are the three components of curl F at ${at}?`, answer: curl, explanation: `⟨${n(Ry)} − ${par(Qz)}, ${n(Pz)} − ${par(Rx)}, ${n(Qx)} − ${par(Py)}⟩ = ${ang(curl)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Air through the sensor cell',
 brief: 'A small sensor cell sits in the vent flow, and Mira wants to know whether it is taking in or giving out air.',
 labels: ['div F (1/s)', 'net outflow (m³/s)'], tolerance: 0.01,
 gl: [['∂P/∂x', '∂Q/∂y', '∂R/∂z'], ['div F (1/s)'], ['net outflow (m³/s)']]
}, {
 /* F = ⟨axz + by, cy² + dx, ez² + fxy⟩: div = (a + 2e)z + 2cy. The cell volume V is 0.5, 2 or 4 m³, and the net outflow is div × V. */
 canonical: { a: 2, b: 3, c: 1, d: 2, e: 1, f: 2, x0: 1, y0: 2, z0: 1, V: 2 },
 draw: R => ({ a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 3), d: R.int(1, 4), e: R.int(1, 3), f: R.int(1, 4), x0: R.nz(-2, 3), y0: R.nz(-2, 3), z0: R.nz(-2, 3), V: R.pick([0.5, 2, 4]) }),
 build: ({ a, b, c, d, e, f, x0, y0, z0, V }) => { const Px = a * z0, Qy = 2 * c * y0, Rz = 2 * e * z0, div = Px + Qy + Rz, out = div * V, P = poly([[a, 'xz'], [b, 'y']]), Q = poly([[c, 'y²'], [d, 'x']]), Rr = poly([[e, 'z²'], [f, 'xy']]), at = pt([x0, y0, z0]); return {
  prompt: `Air moves through a vent with velocity field F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second, with x, y and z in metres. A small sensor cell of volume ${n(V)} cubic metres sits at ${at}. For a cell this small, the net rate at which air leaves it is about div F times its volume. Enter div F at ${at}, then the net outflow from the cell in cubic metres per second (a decimal is fine). A negative outflow means air is flowing in.`,
  answer: [div, out],
  hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. For each, differentiate in that letter and treat the other two letters as fixed numbers, then put in the point.', 'The net outflow is the divergence multiplied by the volume of the cell. Keep the sign: negative means air crowds into the cell.'],
  solution: `∂P/∂x = ${poly([[a, 'z']])}, ∂Q/∂y = ${poly([[2 * c, 'y']])} and ∂R/∂z = ${poly([[2 * e, 'z']])}, so at ${at} the divergence is ${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}. The net outflow is about ${par(div)} × ${n(V)} = ${n(out)} cubic metres per second.`,
  guidance: [
   { prompt: `At ${at}, what are ∂P/∂x, ∂Q/∂y and ∂R/∂z?`, answer: [Px, Qy, Rz], explanation: `∂P/∂x = ${poly([[a, 'z']])} = ${n(Px)}, ∂Q/∂y = ${poly([[2 * c, 'y']])} = ${n(Qy)} and ∂R/∂z = ${poly([[2 * e, 'z']])} = ${n(Rz)}.` },
   { prompt: `Add them. What is div F at ${at}?`, answer: [div], explanation: `${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}.` },
   { prompt: `The cell has volume ${n(V)} cubic metres. What is the net outflow, div F times the volume?`, answer: [out], explanation: `${par(div)} × ${n(V)} = ${n(out)} cubic metres per second.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q19', title: 'The pressure field and its swirl',
 brief: 'The air in a duct is driven by a pressure landscape and stirred by a fan, and Mira suspects only the fan can make it swirl.',
 labels: ['F, x-component (m/s)', 'F, y-component (m/s)', 'F, z-component (m/s)', 'div F (1/s)', 'length of curl F (1/s)'], tolerance: 0.01,
 gl: [['F x-part', 'F y-part', 'F z-part'], ['∂P/∂x', '∂Q/∂y', '∂R/∂z'], ['div F (1/s)'], ['length of curl F (1/s)']]
}, {
 /* φ = ax²y + byz² + cxz plus the fan's spin ⟨−ky, kx, 0⟩: F = ⟨2axy + cz − ky, ax² + bz² + kx, 2byz + cx⟩, div = 2(a + b)y
    and curl F = ⟨0, 0, 2k⟩ whatever the point: the gradient part never swirls. */
 canonical: { a: 2, b: 1, c: 3, k: 2, x0: 1, y0: 2, z0: -1 },
 draw: R => ({ a: R.int(1, 3), b: R.int(1, 3), c: R.nz(-3, 3), k: R.int(1, 4), x0: R.nz(-2, 3), y0: R.nz(-2, 3), z0: R.nz(-2, 3) }),
 build: ({ a, b, c, k, x0, y0, z0 }) => { const F = [2 * a * x0 * y0 + c * z0 - k * y0, a * x0 * x0 + b * z0 * z0 + k * x0, 2 * b * y0 * z0 + c * x0], Px = 2 * a * y0, Qy = 0, Rz = 2 * b * y0, div = Px + Qy + Rz,
  phi = poly([[a, 'x²y'], [b, 'yz²'], [c, 'xz']]), Pf = poly([[2 * a, 'xy'], [c, 'z'], [-k, 'y']]), Qf = poly([[a, 'x²'], [b, 'z²'], [k, 'x']]), Rf = poly([[2 * b, 'yz'], [c, 'x']]), at = pt([x0, y0, z0]),
  spin = `⟨${poly([[-k, 'y']])}, ${poly([[k, 'x']])}, 0⟩`, Gx = poly([[2 * a, 'xy'], [c, 'z']]), Gy = poly([[a, 'x²'], [b, 'z²']]); return {
  prompt: `The air in a duct is driven by a pressure landscape and stirred by a fan. Its velocity field is F = ∇φ + ${spin}, where ∇φ is the gradient of φ(x, y, z) = ${phi} and ${spin} is the fan’s spin, with x, y and z in metres and F in metres per second. Enter the three components of F at ${at}, then div F there, then the length of curl F there.`,
  answer: [...F, div, 2 * k],
  hints: ['The gradient is ∇φ = ⟨∂φ/∂x, ∂φ/∂y, ∂φ/∂z⟩: three partial derivatives of φ. Add the fan’s spin component by component, then put in the point.', 'For div F, differentiate each component of F again: its own letter only. For curl F, work out all six partial derivatives from the curl recipe and compare them in pairs: the gradient part gives equal pairs, so only the spin can leave anything over.'],
  solution: `∂φ/∂x = ${Gx}, ∂φ/∂y = ${Gy} and ∂φ/∂z = ${Rf}. Adding the spin, F = ⟨${Pf}, ${Qf}, ${Rf}⟩, so F${at} = ${ang(F)}. For the divergence, ∂P/∂x = ${poly([[2 * a, 'y']])} = ${n(Px)}, ∂Q/∂y = 0 and ∂R/∂z = ${poly([[2 * b, 'y']])} = ${n(Rz)}, so div F = ${n(Px)} + 0 + ${par(Rz)} = ${n(div)}. For the curl, ∂R/∂y = ${poly([[2 * b, 'z']])} equals ∂Q/∂z = ${poly([[2 * b, 'z']])}, and ∂P/∂z = ${n(c)} equals ∂R/∂x = ${n(c)}, so the first two components are 0. The third is ∂Q/∂x − ∂P/∂y = (${poly([[2 * a, 'x'], [k, '']])}) − (${poly([[2 * a, 'x'], [-k, '']])}) = ${n(2 * k)}. So curl F = ⟨0, 0, ${n(2 * k)}⟩ and its length is ${n(2 * k)}: the pressure part, a gradient, does not swirl, and all the swirl comes from the fan.`,
  guidance: [
   { prompt: `Work out ∂φ/∂x, ∂φ/∂y and ∂φ/∂z for φ = ${phi}, add the spin ${spin}, then put in ${at}. What are the three components of F?`, answer: F, explanation: `F = ⟨${Pf}, ${Qf}, ${Rf}⟩, which at ${at} is ${ang(F)}.` },
   { prompt: `For F = ⟨${Pf}, ${Qf}, ${Rf}⟩, what are ∂P/∂x, ∂Q/∂y and ∂R/∂z at ${at}?`, answer: [Px, Qy, Rz], explanation: `∂P/∂x = ${poly([[2 * a, 'y']])} = ${n(Px)}, ∂Q/∂y = 0 and ∂R/∂z = ${poly([[2 * b, 'y']])} = ${n(Rz)}.` },
   { prompt: `Add them. What is div F at ${at}?`, answer: [div], explanation: `${n(Px)} + 0 + ${par(Rz)} = ${n(div)}.` },
   { prompt: `Work out the three components of curl F. What is the length of that vector?`, answer: [2 * k], explanation: `∂R/∂y − ∂Q/∂z = ${poly([[2 * b, 'z']])} − ${poly([[2 * b, 'z']])} = 0, ∂P/∂z − ∂R/∂x = ${n(c)} − ${par(c)} = 0 and ∂Q/∂x − ∂P/∂y = (${poly([[2 * a, 'x'], [k, '']])}) − (${poly([[2 * a, 'x'], [-k, '']])}) = ${n(2 * k)}. The curl is ⟨0, 0, ${n(2 * k)}⟩, so its length is ${n(2 * k)}.` }
  ] }; }
});

/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
