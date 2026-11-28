/* Real analysis practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p5.js. */
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
/* Signed pieces of a letter expression: poly([[1, 'x³'], [−3, 'x²'], [0, 'x'], [4, '']]) is 'x³ − 3x² + 4'. A coefficient
   of size 1 is not written, a 0 term is left out, and an expression with no terms is '0'. */
const poly = terms => { const out = [];
 for (const [v, x] of terms) { if (!v) continue; const a = Math.abs(v), body = x ? `${a === 1 ? '' : n(a)}${x}` : n(a);
  out.push(out.length ? `${v < 0 ? '−' : '+'} ${body}` : `${v < 0 ? '−' : ''}${body}`); }
 return out.length ? out.join(' ') : '0'; };
/* ' + 3t' / ' − t' to follow another term; '' for 0. */
const tail = (v, x) => v ? ` ${v < 0 ? '−' : '+'} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}` : '';
/* '+ 3' / '− 2': a sign and a size, for a number that is never 0. */
const sg = v => `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
/* '= 0.25' when n(v) is exact, '≈ 0.0156' when it is rounded. */
const approx = v => (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-7 ? '= ' : '≈ ') + n(v);
const r6 = x => Math.round(x * 1e6) / 1e6;
const sign = v => v < 0 ? 'negative' : 'positive';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
/* A factor (v − r), written (v + r′) when r is negative; a bare v when r is 0. */
const fac = (r, v) => r === 0 ? v : r < 0 ? `${v} + ${n(-r)}` : `${v} − ${n(r)}`;
/* Bisection on an increasing f (negative at lo, positive at hi): the first `steps` midpoints, the value there and the interval kept.
   Returns null if f is 0 at a midpoint, so that every draw has an unambiguous half to keep. */
const bis = (f, lo, hi, steps) => { const st = [];
 for (let i = 0; i < steps; i++) { const m = r6((lo + hi) / 2), v = r6(f(m)); if (Math.abs(v) < 1e-9) return null; if (v < 0) lo = m; else hi = m; st.push({ m, v, lo, hi }); }
 return st; };
/* The smallest k with L ÷ 2ᵏ < e. */
const halv = (L, e) => { let k = 0; while (L / Math.pow(2, k) >= e) k++; return k; };
/* Smallest Lipschitz constant of A x² + p x on [a, b]: the larger of |2Aa + p| and |2Ab + p|. */
const lipK = (A, p, a, b) => Math.max(Math.abs(2 * A * a + p), Math.abs(2 * A * b + p));

/* ---- q21 Extreme and intermediate value theorems; bisection [3.3] ---- */

/* f(x) = x² − c on [a, a + L], root trapped within e. The worked example is x² − 3 on [1, 2] with 0.05; the parent is x³ − 20 on [2, 3]. */
const E21 = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Setting the relief valve',
 brief: 'A relief valve opens where its response curve crosses zero, and the log needs that setting trapped to a stated tolerance.',
 labels: ['halvings', 'left end', 'right end'], tolerance: 0.005,
 gl: [['halvings'], ['first midpoint'], ['second midpoint']]
}, {
 canonical: { a: 4, L: 2, c: 30, e: 0.02 },
 draw: R => { for (let t = 0; t < 1000; t++) { const a = R.int(1, 6), L = R.pick([1, 2, 4]), p = { a, L, c: R.int(a * a + 1, (a + L) * (a + L) - 1), e: R.pick(E21) };
   if (bis(x => x * x - p.c, a, a + L, 2)) return p; } return { a: 4, L: 2, c: 30, e: 0.02 }; },
 build: ({ a, L, c, e }) => { const b = a + L, fa = a * a - c, fb = b * b - c, k = halv(L, e), st = bis(x => x * x - c, a, b, 2), [s1, s2] = st;
  const len = L / Math.pow(2, k), prev = L / Math.pow(2, k - 1); return {
  prompt: `A relief valve opens where its response curve f(x) = x² − ${n(c)} crosses zero. The curve is continuous, f(${n(a)}) = ${n(fa)} is negative and f(${n(b)}) = ${n(fb)} is positive, so by the intermediate value theorem f has a root between ${n(a)} and ${n(b)}. The engineer traps it by bisection on [${n(a)}, ${n(b)}]: halve the interval, keep the half at whose ends f has opposite signs, and repeat. The setting is certified only if the root is trapped in an interval shorter than ${n(e)}. Enter the smallest number of halvings that guarantees this, then the left end and the right end of the interval kept after two halvings.`,
  answer: [k, s2.lo, s2.hi],
  hints: ['After k halvings an interval of length L has length L ÷ 2ᵏ. Try k = 1, 2, 3 and so on until the length first drops below the tolerance.', 'At each midpoint work out the sign of f, then keep the half whose ends have opposite signs. Do this twice.'],
  solution: `After ${n(k - 1)} halvings the length is ${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(prev)}, which is not below ${n(e)}; after ${n(k)} it is ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(len)}, which is. So ${n(k)} halvings are needed. First halving: the midpoint is ${n(s1.m)} and f(${n(s1.m)}) ${approx(s1.v)} is ${sign(s1.v)}, so the root lies in [${n(s1.lo)}, ${n(s1.hi)}]. Second halving: the midpoint is ${n(s2.m)} and f(${n(s2.m)}) ${approx(s2.v)} is ${sign(s2.v)}, so after two halvings the root is trapped in [${n(s2.lo)}, ${n(s2.hi)}].`,
  guidance: [
   { prompt: `After k halvings the interval has length ${n(L)} ÷ 2ᵏ. What is the smallest k that makes this shorter than ${n(e)}?`, answer: [k], explanation: `${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(prev)} is still at least ${n(e)}, while ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(len)} is below it, so ${n(k)} halvings are needed.` },
   { prompt: `Start the bisection. What is the midpoint of [${n(a)}, ${n(b)}]?`, answer: [s1.m], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(s1.m)}. f(${n(s1.m)}) ${approx(s1.v)} is ${sign(s1.v)}, so the root lies in [${n(s1.lo)}, ${n(s1.hi)}].` },
   { prompt: `The root lies in [${n(s1.lo)}, ${n(s1.hi)}]. What is the midpoint of this half?`, answer: [s2.m], explanation: `(${n(s1.lo)} + ${n(s1.hi)}) ÷ 2 = ${n(s2.m)}. f(${n(s2.m)}) ${approx(s2.v)} is ${sign(s2.v)}, so the half to keep is [${n(s2.lo)}, ${n(s2.hi)}].` }
  ] }; }
});

/* f(x) = x³ + x − c on [a, a + L]: the number of halvings, the readings (2 at the ends + 1 per halving) and the minutes. */
mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'The kiln calibration run',
 brief: 'A kiln thermostat is calibrated by bisection, and the shift supervisor needs to know how many readings and how many minutes the run will take.',
 labels: ['halvings', 'readings', 'minutes'], tolerance: 0.01,
 gl: [['halvings'], ['readings'], ['minutes']]
}, {
 canonical: { a: 1, L: 2, c: 12, e: 0.05, m: 3 },
 draw: R => { for (let t = 0; t < 1000; t++) { const a = R.int(0, 3), L = R.pick([1, 2, 4]), b = a + L, c = R.int(a * a * a + a + 1, b * b * b + b - 1), e = R.pick(E21), m = R.int(2, 7);
   if (bis(x => x * x * x + x - c, a, b, halv(L, e))) return { a, L, c, e, m }; } return { a: 1, L: 2, c: 12, e: 0.05, m: 3 }; },
 build: ({ a, L, c, e, m }) => { const b = a + L, fa = a * a * a + a - c, fb = b * b * b + b - c, k = halv(L, e), rd = k + 2, tot = rd * m; return {
  prompt: `A kiln thermostat’s error at dial setting x is f(x) = x³ + x − ${n(c)}. It is continuous, f(${n(a)}) = ${n(fa)} is negative and f(${n(b)}) = ${n(fb)} is positive, so by the intermediate value theorem there is a setting between ${n(a)} and ${n(b)} where the error is exactly 0. A technician finds it by bisection: first one reading of f at each end of [${n(a)}, ${n(b)}], then one new reading at the midpoint for every halving. The setting counts as found when the root is trapped in an interval shorter than ${n(e)}. Each reading takes ${n(m)} minutes. Enter the smallest number of halvings that guarantees this, then the total number of readings, then the total time in minutes.`,
  answer: [k, rd, tot],
  hints: ['After k halvings an interval of length L has length L ÷ 2ᵏ. Find the first k that makes it shorter than the tolerance.', 'Count the two readings at the ends, add one reading for each halving, then multiply by the minutes per reading.'],
  solution: `After ${n(k - 1)} halvings the length is ${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(L / Math.pow(2, k - 1))}, which is not below ${n(e)}; after ${n(k)} it is ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(L / Math.pow(2, k))}, which is. So ${n(k)} halvings are needed. The readings are 2 at the ends and ${n(k)} at midpoints: ${n(rd)} readings. At ${n(m)} minutes each, that is ${n(rd)} × ${n(m)} = ${n(tot)} minutes.`,
  guidance: [
   { prompt: `After k halvings the interval has length ${n(L)} ÷ 2ᵏ. What is the smallest k that makes this shorter than ${n(e)}?`, answer: [k], explanation: `${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(L / Math.pow(2, k - 1))} is still at least ${n(e)}, while ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(L / Math.pow(2, k))} is below it, so ${n(k)} halvings are needed.` },
   { prompt: `There are 2 readings at the ends and one new reading for each of the ${n(k)} halvings. How many readings is that in all?`, answer: [rd], explanation: `2 + ${n(k)} = ${n(rd)} readings.` },
   { prompt: `${n(rd)} readings at ${n(m)} minutes each. How many minutes is that?`, answer: [tot], explanation: `${n(rd)} × ${n(m)} = ${n(tot)} minutes.` }
  ] }; }
});

/* f(x) = xᵖ − c on [a, a + L] with a and L in tenths; three halvings. Not the parent's x³ − 20 on [2, 3]. */
const E21D = [0.01, 0.005, 0.002, 0.001, 0.0005];
const SUP = { 2: '²', 3: '³' };
mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', title: 'The furnace probe, to three halvings',
 brief: 'A furnace probe’s zero lies in an awkward interval, and the certificate needs the halvings and the bracket after three of them.',
 labels: ['halvings', 'left end', 'right end'], tolerance: 0.0005,
 gl: [['halvings'], ['first midpoint'], ['second midpoint'], ['third midpoint']]
}, {
 canonical: { p: 3, a: 2.1, L: 1.6, c: 30, e: 0.005 },
 draw: R => { for (let t = 0; t < 1000; t++) { const p = R.pick([2, 3]), a = R.int(11, 40) / 10, L = R.pick([0.8, 1.6, 2.4]), b = r6(a + L), lo = Math.floor(r6(Math.pow(a, p))) + 1, hi = Math.ceil(r6(Math.pow(b, p))) - 1;
   if (lo > hi) continue; const c = R.int(lo, hi), e = R.pick(E21D), k = halv(L, e); if (Math.abs(L / Math.pow(2, k) - e) < 1e-9) continue;
   if (bis(x => Math.pow(x, p) - c, a, b, 3)) return { p, a, L, c, e }; } return { p: 3, a: 2.1, L: 1.6, c: 30, e: 0.005 }; },
 build: ({ p, a, L, c, e }) => { const b = r6(a + L), fa = r6(Math.pow(a, p) - c), fb = r6(Math.pow(b, p) - c), k = halv(L, e), st = bis(x => Math.pow(x, p) - c, a, b, 3), [s1, s2, s3] = st;
  const X = `x${SUP[p]}`; return {
  prompt: `A furnace probe’s error curve is f(x) = ${X} − ${n(c)}, in volts, at probe depth x centimetres. It is continuous, f(${n(a)}) = ${n(fa)} is negative and f(${n(b)}) = ${n(fb)} is positive, so by the intermediate value theorem f has a root between ${n(a)} and ${n(b)}. Bisection on [${n(a)}, ${n(b)}] halves the interval again and again, keeping the half at whose ends f has opposite signs. The depth is certified when the root is trapped in an interval shorter than ${n(e)} centimetres. Enter the smallest number of halvings that guarantees this, then the left end and the right end of the interval kept after three halvings.`,
  answer: [k, s3.lo, s3.hi],
  hints: ['After k halvings an interval of length L has length L ÷ 2ᵏ. Find the first k that makes it shorter than the tolerance; the answer is a count, so it is a whole number.', 'Do three rounds: midpoint, sign of f there, keep the half whose ends have opposite signs. The ends have one decimal place, so each midpoint has at most two.'],
  solution: `After ${n(k - 1)} halvings the length is ${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(L / Math.pow(2, k - 1))}, which is not below ${n(e)}; after ${n(k)} it is ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(L / Math.pow(2, k))}, which is. So ${n(k)} halvings are needed. First midpoint ${n(s1.m)}: f ${approx(s1.v)} is ${sign(s1.v)}, keep [${n(s1.lo)}, ${n(s1.hi)}]. Second midpoint ${n(s2.m)}: f ${approx(s2.v)} is ${sign(s2.v)}, keep [${n(s2.lo)}, ${n(s2.hi)}]. Third midpoint ${n(s3.m)}: f ${approx(s3.v)} is ${sign(s3.v)}, so after three halvings the root is trapped in [${n(s3.lo)}, ${n(s3.hi)}].`,
  guidance: [
   { prompt: `After k halvings the interval has length ${n(L)} ÷ 2ᵏ. What is the smallest k that makes this shorter than ${n(e)}?`, answer: [k], explanation: `${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(L / Math.pow(2, k - 1))} is still at least ${n(e)}, while ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(L / Math.pow(2, k))} is below it, so ${n(k)} halvings are needed.` },
   { prompt: `What is the midpoint of [${n(a)}, ${n(b)}]?`, answer: [s1.m], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(s1.m)}. f ${approx(s1.v)} is ${sign(s1.v)} there, so keep [${n(s1.lo)}, ${n(s1.hi)}].` },
   { prompt: `The root lies in [${n(s1.lo)}, ${n(s1.hi)}]. What is the midpoint of this half?`, answer: [s2.m], explanation: `(${n(s1.lo)} + ${n(s1.hi)}) ÷ 2 = ${n(s2.m)}. f ${approx(s2.v)} is ${sign(s2.v)} there, so keep [${n(s2.lo)}, ${n(s2.hi)}].` },
   { prompt: `The root lies in [${n(s2.lo)}, ${n(s2.hi)}]. What is the midpoint of this half?`, answer: [s3.m], explanation: `(${n(s2.lo)} + ${n(s2.hi)}) ÷ 2 = ${n(s3.m)}. f ${approx(s3.v)} is ${sign(s3.v)} there, so keep [${n(s3.lo)}, ${n(s3.hi)}].` }
  ] }; }
});

/* ---- q22 Uniform continuity and Lipschitz constants [3.4] ---- */

/* f(x) = x² + p x on [a, b]; ε = K·δ so that δ = ε ÷ K is a short decimal. The parent is x² + 3x on [1, 4]; the worked example is x² on [0, 5]. */
const D22 = [0.01, 0.02, 0.05, 0.002, 0.005, 0.025];
mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'One tolerance for the flow handle',
 brief: 'A flow handle is certified once for its whole travel, so Mira needs a single input tolerance for every handle position.',
 labels: ['smallest K', 'δ'], tolerance: 0.0001,
 gl: [['smallest K'], ['δ']]
}, {
 canonical: { p: -4, a: -1, b: 3, d: 0.005 },
 draw: R => { for (let t = 0; t < 1000; t++) { const p = R.nz(-8, 8), a = R.int(-4, 3), b = a + R.int(2, 6), K = lipK(1, p, a, b);
   if (K >= 2 && !(p === 3 && a === 1 && b === 4)) return { p, a, b, d: R.pick(D22) }; } return { p: -4, a: -1, b: 3, d: 0.005 }; },
 build: ({ p, a, b, d }) => { const K = lipK(1, p, a, b), eps = r6(K * d), u = 2 * a + p, w = 2 * b + p, F = poly([[1, 'x²'], [p, 'x']]); return {
  prompt: `A flow handle turns to a position x anywhere in [${n(a)}, ${n(b)}], and the flow it lets through is f(x) = ${F}. The certificate must give one input tolerance δ that works at every position at once. Enter the smallest Lipschitz constant K of f on [${n(a)}, ${n(b)}], that is the smallest K with |f(x) − f(y)| ≤ K|x − y| for all x and y in the interval, then the δ = ε ÷ K that this constant gives for ε = ${n(eps)}.`,
  answer: [K, d],
  hints: ['Factor the difference with x² − y² = (x + y)(x − y): f(x) − f(y) is (x − y) times a sum of x, y and a number. The smallest K is the supremum of the size of that sum over the interval.', 'If |x − y| < ε ÷ K, then |f(x) − f(y)| ≤ K|x − y| < ε, wherever x and y lie in the interval. Divide ε by K.'],
  solution: `f(x) − f(y) = (x − y)(x + y ${sg(p)}). For x ≠ y in [${n(a)}, ${n(b)}], x + y ${sg(p)} lies between ${n(u)} and ${n(w)} and comes as close as you like to both, so the supremum of its size is the larger of |${n(u)}| and |${n(w)}|, which is ${n(K)}. So |f(x) − f(y)| ≤ ${n(K)}|x − y|, and no smaller constant works: the smallest Lipschitz constant is ${n(K)}. With ε = ${n(eps)}, δ = ${n(eps)} ÷ ${n(K)} = ${n(d)}: whenever |x − y| < ${n(d)}, |f(x) − f(y)| < ${n(eps)} at every position at once.`,
  guidance: [
   { prompt: `f(x) − f(y) = (x − y)(x + y ${sg(p)}). As x and y range over [${n(a)}, ${n(b)}], x + y ${sg(p)} comes as close as you like to ${n(u)} and to ${n(w)}. What is the supremum of its size, the smallest Lipschitz constant?`, answer: [K], explanation: `The sizes at the two ends are ${n(Math.abs(u))} and ${n(Math.abs(w))}, and the sum lies between them, so the supremum of its size is the larger one, ${n(K)}.` },
   { prompt: `With K = ${n(K)}, what is δ = ε ÷ K for ε = ${n(eps)}?`, answer: [d], explanation: `${n(eps)} ÷ ${n(K)} = ${n(d)}. Then |x − y| < ${n(d)} gives |f(x) − f(y)| < ${n(K)} × ${n(d)} = ${n(eps)}, wherever x and y are.` }
  ] }; }
});

/* The same f, a dial cut into equal steps: m = the smallest number of equal steps of width below δ. d3 = δ in thousandths. */
const D22C = [10, 20, 25, 40, 50];
mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Stepping the fuel dial',
 brief: 'A fuel dial is to be cut into equal steps, and Mira needs steps small enough for one certificate to cover every neighbouring pair.',
 labels: ['smallest K', 'δ', 'equal steps'], tolerance: 0.0001,
 gl: [['smallest K'], ['δ'], ['equal steps']]
}, {
 canonical: { p: -6, a: 1, b: 5, d3: 25 },
 draw: R => { for (let t = 0; t < 1000; t++) { const p = R.nz(-9, 9), a = R.int(-3, 3), b = a + R.int(2, 6);
   if (lipK(1, p, a, b) >= 2) return { p, a, b, d3: R.pick(D22C) }; } return { p: -6, a: 1, b: 5, d3: 25 }; },
 build: ({ p, a, b, d3 }) => { const K = lipK(1, p, a, b), d = d3 / 1000, eps = r6(K * d), u = 2 * a + p, w = 2 * b + p, F = poly([[1, 'x²'], [p, 'x']]), len = b - a, m = Math.floor(len * 1000 / d3) + 1; return {
  prompt: `A fuel dial is turned to a position x between ${n(a)} and ${n(b)}, and the fuel flow is f(x) = ${F}. The dial will be cut into equal steps, and the flow at two settings no further apart than one step must differ by less than ε = ${n(eps)}. Enter the smallest Lipschitz constant K of f on [${n(a)}, ${n(b)}], then the δ = ε ÷ K it gives, then the smallest number of equal steps that cut the dial so that each step is strictly shorter than that δ.`,
  answer: [K, d, m],
  hints: ['Factor the difference with x² − y² = (x + y)(x − y). The smallest K is the supremum of the size of the second factor over the interval.', 'The dial has length b − a. With m equal steps each step is (b − a) ÷ m; you need that to be strictly below δ, so m must be strictly above (b − a) ÷ δ.'],
  solution: `f(x) − f(y) = (x − y)(x + y ${sg(p)}). On [${n(a)}, ${n(b)}] the factor x + y ${sg(p)} lies between ${n(u)} and ${n(w)} and comes as close as you like to both, so K = ${n(K)}. Then δ = ${n(eps)} ÷ ${n(K)} = ${n(d)}. The dial has length ${n(b)} − ${par(a)} = ${n(len)}. With m steps each is ${n(len)} ÷ m, and ${n(len)} ÷ m < ${n(d)} needs m > ${n(len)} ÷ ${n(d)} = ${n(r6(len / d))}, so the smallest whole number of steps is ${n(m)}.`,
  guidance: [
   { prompt: `f(x) − f(y) = (x − y)(x + y ${sg(p)}). As x and y range over [${n(a)}, ${n(b)}], x + y ${sg(p)} comes as close as you like to ${n(u)} and to ${n(w)}. What is the supremum of its size, the smallest Lipschitz constant?`, answer: [K], explanation: `The sizes at the two ends are ${n(Math.abs(u))} and ${n(Math.abs(w))}, and the sum lies between them, so the supremum of its size is ${n(K)}.` },
   { prompt: `With K = ${n(K)}, what is δ = ε ÷ K for ε = ${n(eps)}?`, answer: [d], explanation: `${n(eps)} ÷ ${n(K)} = ${n(d)}.` },
   { prompt: `The dial has length ${n(len)}. What is the smallest whole number m of equal steps so that ${n(len)} ÷ m is strictly below ${n(d)}?`, answer: [m], explanation: `You need m > ${n(len)} ÷ ${n(d)} = ${n(r6(len / d))}. The smallest whole number above that is ${n(m)}.` }
  ] }; }
});

/* f(x) = A x² + p x on [lo, hi]: f(x) − f(y) = (x − y)(A(x + y) + p), so K = the larger of |2A·lo + p| and |2A·hi + p|. */
const D22D = [0.01, 0.02, 0.05, 0.002, 0.005, 0.025], D22E = [0.003, 0.004, 0.006, 0.007, 0.015];
mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', title: 'The actuator with a steeper curve',
 brief: 'An actuator’s response is steeper than the dial curves before it, and the certificate must give its constant, its tolerance and a guaranteed error.',
 labels: ['smallest K', 'δ', 'largest error'], tolerance: 0.0001,
 gl: [['smallest K'], ['δ'], ['largest error']]
}, {
 canonical: { A: 3, p: -5, lo: -2, hi: 1, d: 0.005, d2: 0.004 },
 draw: R => { for (let t = 0; t < 1000; t++) { const A = R.pick([2, 3, 4, -2, -3]), p = R.nz(-9, 9), lo = R.int(-4, 2), hi = lo + R.int(2, 6), K = lipK(A, p, lo, hi);
   if (K >= 2 && K <= 60) return { A, p, lo, hi, d: R.pick(D22D), d2: R.pick(D22E) }; } return { A: 3, p: -5, lo: -2, hi: 1, d: 0.005, d2: 0.004 }; },
 build: ({ A, p, lo, hi, d, d2 }) => { const K = lipK(A, p, lo, hi), eps = r6(K * d), bound = r6(K * d2), u = 2 * A * lo + p, w = 2 * A * hi + p, F = poly([[A, 'x²'], [p, 'x']]), fa = `${n(A)}(x + y) ${sg(p)}`; return {
  prompt: `An actuator moves to a position x anywhere in [${n(lo)}, ${n(hi)}], and its output force is f(x) = ${F}. For this f, f(x) − f(y) = (x − y)(${fa}). Enter the smallest Lipschitz constant K of f on [${n(lo)}, ${n(hi)}], then the δ = ε ÷ K that it gives for ε = ${n(eps)}. Then enter the largest output difference |f(x) − f(y)| that K guarantees for two positions strictly less than ${n(d2)} apart (the bound K × ${n(d2)}).`,
  answer: [K, d, bound],
  hints: ['The smallest K is the supremum of |A(x + y) + p| over the interval. The expression changes in a straight line with x + y, so its largest size is at one of the two ends of the range of x + y.', 'Once you have K, δ = ε ÷ K. For the last answer, |f(x) − f(y)| ≤ K|x − y|, so the guaranteed bound is K times the gap between the positions.'],
  solution: `For x ≠ y in [${n(lo)}, ${n(hi)}], x + y lies between ${n(2 * lo)} and ${n(2 * hi)}, so ${fa} lies between ${n(u)} and ${n(w)} and comes as close as you like to both. The supremum of its size is the larger of |${n(u)}| and |${n(w)}|, so K = ${n(K)}. Then δ = ${n(eps)} ÷ ${n(K)} = ${n(d)}. Positions less than ${n(d2)} apart give |f(x) − f(y)| ≤ ${n(K)} × ${n(d2)} = ${n(bound)}.`,
  guidance: [
   { prompt: `As x and y range over [${n(lo)}, ${n(hi)}], ${fa} comes as close as you like to ${n(u)} and to ${n(w)}. What is the supremum of its size, the smallest Lipschitz constant?`, answer: [K], explanation: `The sizes at the two ends are ${n(Math.abs(u))} and ${n(Math.abs(w))}, and the expression lies between them, so the supremum of its size is ${n(K)}.` },
   { prompt: `With K = ${n(K)}, what is δ = ε ÷ K for ε = ${n(eps)}?`, answer: [d], explanation: `${n(eps)} ÷ ${n(K)} = ${n(d)}.` },
   { prompt: `For two positions less than ${n(d2)} apart, |f(x) − f(y)| ≤ K × (the gap). What is the bound K × ${n(d2)}?`, answer: [bound], explanation: `${n(K)} × ${n(d2)} = ${n(bound)}.` }
  ] }; }
});

/* ---- q23 Chapter review: certifying a thermostat [3.2–3.4] ---- */

/* A dial T(x) = m x + k with ε = |m|·δ; a two-piece curve g (x² + u left of c, s x + w right of c, value val at c; kind 0 continuous,
   1 removable, 2 jump); h(x) = x² + p x on [a, b]. The worked example is T = −5x + 9, g at 3 with 2x + 4, and x² + 4x on [−3, 2]. */
const pw = ({ c, u, s, kind, gap }) => { const L = c * c + u, R = L + (kind === 2 ? gap : 0), w = R - s * c; return { L, R, w }; };
const ptxt = v => v ? ` ${sg(v)}` : '';
const dm = [10, 20, 25, 40, 50, 60];
/* Shared text of the three-check missions: the δ, the code and K. T and the pieces are written in the prompt by the caller. */
const q23parts = P => { const { m, dd, c, u, s, kind, val, p, a, b } = P, d = dd / 1000, eps = r6(Math.abs(m) * d), { L, R, w } = pw(P), K = lipK(1, p, a, b), u1 = 2 * a + p, u2 = 2 * b + p;
 const verdict = kind === 0 ? `all three agree, so g is continuous at x = ${n(c)}: code 0.` : kind === 1 ? `the two limits agree but g(${n(c)}) = ${n(val)} is different: the discontinuity is removable, code 1.` : `the two limits differ, so no single value can repair g: it has a jump discontinuity, code 2.`;
 const left = `${par(c)}²${ptxt(u)}`, right = `${par(s)} × ${par(c)}${ptxt(w)}`;
 return { d, eps, L, R, w, K, u1, u2, verdict, left, right,
  sd: `|T(x) − T(x₀)| = ${n(Math.abs(m))}|x − x₀|, which is below ${n(eps)} exactly when |x − x₀| < ${n(eps)} ÷ ${n(Math.abs(m))} = ${n(d)}, so the largest δ is ${n(d)}.`,
  sg: `For g, the left-hand limit at ${n(c)} is ${left} = ${n(L)}, the right-hand limit is ${right} = ${n(R)}, and g(${n(c)}) = ${n(val)}: ${verdict}`,
  sk: `For h, h(x) − h(y) = (x − y)(x + y ${sg(p)}), and on [${n(a)}, ${n(b)}] the sum x + y ${sg(p)} comes as close as you like to ${n(u1)} and ${n(u2)}, so the smallest Lipschitz constant is ${n(K)}.` }; };
const draw23 = (R, fallback) => { for (let t = 0; t < 1000; t++) { const kind = R.int(0, 2), c = R.int(-3, 5), u = R.nz(-4, 6), s = R.nz(-4, 4), L = c * c + u, gap = R.nz(-5, 5),
   p = R.nz(-8, 8), a = R.int(-3, 3), b = a + R.int(2, 6), m = R.pick([-8, -6, -4, -3, 2, 3, 4, 5, 6, 8]), k = R.nz(-9, 9);
  const val = kind === 0 ? L : kind === 1 ? L + R.nz(-4, 4) : R.pick([L, L + gap, L + gap + 2]);
  if (lipK(1, p, a, b) >= 2 && !(m === -5 && k === 9) && !(p === 4 && a === -3 && b === 2)) return { m, k, dd: R.pick(dm), c, u, s, kind, gap, val, p, a, b }; } return fallback; };

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Certifying the flow meter',
 brief: 'Before the flow meter leaves the hall it needs three signatures: a tolerance for its dial, a verdict on its trip curve, and a constant for its valve.',
 labels: ['δ', 'code', 'smallest K'], tolerance: 0.0001,
 gl: [['δ'], ['left-hand limit'], ['right-hand limit'], ['code'], ['smallest K']]
}, {
 canonical: { m: -3, k: 7, dd: 60, c: 3, u: -2, s: 2, kind: 2, gap: 4, val: 7, p: -6, a: 1, b: 5 },
 draw: R => draw23(R, { m: -3, k: 7, dd: 60, c: 3, u: -2, s: 2, kind: 2, gap: 4, val: 7, p: -6, a: 1, b: 5 }),
 build: P => { const { m, k, c, u, s, kind, val, p, a, b } = P, q = q23parts(P); return {
  prompt: `Mira certifies a flow meter in three checks. First, its dial reads T(x) = ${poly([[m, 'x'], [k, '']])}: enter the largest δ such that |x − x₀| < δ always gives |T(x) − T(x₀)| < ${n(q.eps)}. Second, its trip curve is g(x) = ${poly([[1, 'x²'], [u, '']])} for x < ${n(c)}, g(${n(c)}) = ${n(val)}, and g(x) = ${poly([[s, 'x'], [q.w, '']])} for x > ${n(c)}: enter 0 if g is continuous at x = ${n(c)}, 1 if it has a removable discontinuity there, or 2 if it has a jump discontinuity. Third, its valve opening is h(x) = ${poly([[1, 'x²'], [p, 'x']])} for x in [${n(a)}, ${n(b)}]: enter the smallest Lipschitz constant of h on that interval.`,
  answer: [q.d, kind, q.K],
  hints: ['A straight line changes by the size of its slope times the change in x, so δ is ε divided by the size of the slope.', 'Compare the left-hand limit, the right-hand limit and the value at the switch: different one-sided limits make a jump; equal limits with a different value make a removable discontinuity.', 'For x² + px, h(x) − h(y) = (x − y)(x + y + p), so the constant is the supremum of |x + y + p| over the interval.'],
  solution: `${q.sd} ${q.sg} ${q.sk}`,
  guidance: [
   { prompt: `T(x) − T(x₀) = ${n(m)}(x − x₀). What is the largest δ that makes |T(x) − T(x₀)| < ${n(q.eps)} whenever |x − x₀| < δ?`, answer: [q.d], explanation: q.sd },
   { prompt: `What does g(x) approach as x approaches ${n(c)} from the left?`, answer: [q.L], explanation: `For x < ${n(c)}, g(x) = ${poly([[1, 'x²'], [u, '']])}, which approaches ${q.left} = ${n(q.L)}.` },
   { prompt: `What does g(x) approach as x approaches ${n(c)} from the right?`, answer: [q.R], explanation: `For x > ${n(c)}, g(x) = ${poly([[s, 'x'], [q.w, '']])}, which approaches ${q.right} = ${n(q.R)}.` },
   { prompt: `The one-sided limits are ${n(q.L)} and ${n(q.R)}, and g(${n(c)}) = ${n(val)}. Enter the code: 0 continuous, 1 removable, 2 jump.`, answer: [kind], explanation: `Here ${q.verdict}` },
   { prompt: `h(x) − h(y) = (x − y)(x + y ${sg(p)}). On [${n(a)}, ${n(b)}], what is the supremum of |x + y ${sg(p)}|?`, answer: [q.K], explanation: `The sum comes as close as you like to ${n(q.u1)} and ${n(q.u2)} and lies between them, so the supremum of its size is ${n(q.K)}.` }
  ] }; }
});

/* c: a dial and a heater fed from one setting; a single promise for both is the smaller of the two δ. */
mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'One dial, two outputs',
 brief: 'One dial feeds a sensor and a heater, and Mira needs a single input tolerance that keeps both outputs within the same ε.',
 labels: ['sensor δ', 'smallest K', 'common δ'], tolerance: 0.0001,
 gl: [['sensor δ'], ['smallest K'], ['common δ']]
}, {
 canonical: { m: 4, k: 3, p: 5, a: -4, b: 1, d0: 0.005 },
 draw: R => { for (let t = 0; t < 1000; t++) { const m = R.pick([-9, -6, -4, -3, 2, 3, 5, 6, 8]), p = R.nz(-8, 8), a = R.int(-4, 2), b = a + R.int(2, 5), K = lipK(1, p, a, b);
   if (K >= 2 && K !== Math.abs(m) && K <= 30) return { m, k: R.nz(-9, 9), p, a, b, d0: R.pick([0.001, 0.002, 0.005]) }; } return { m: 4, k: 3, p: 5, a: -4, b: 1, d0: 0.005 }; },
 build: ({ m, k, p, a, b, d0 }) => { const K = lipK(1, p, a, b), am = Math.abs(m), eps = r6(lcm(am, K) * d0), dT = r6(eps / am), dH = r6(eps / K), dc = Math.min(dT, dH), u1 = 2 * a + p, u2 = 2 * b + p; return {
  prompt: `One dial setting x feeds two parts of a thermostat. The sensor reads T(x) = ${poly([[m, 'x'], [k, '']])} at any setting, and the heater power is h(x) = ${poly([[1, 'x²'], [p, 'x']])} for settings in [${n(a)}, ${n(b)}]. Both outputs must stay within ε = ${n(eps)} of their values. Enter the largest δ such that |x − x₀| < δ always gives |T(x) − T(x₀)| < ${n(eps)}. Then enter the smallest Lipschitz constant K of h on [${n(a)}, ${n(b)}]. Finally enter the single tolerance Mira can promise for both parts: the smaller of the sensor’s δ and ε ÷ K.`,
  answer: [dT, K, dc],
  hints: ['A straight line changes by the size of its slope times the change in x, so the sensor’s δ is ε divided by the size of the slope.', 'For x² + px, h(x) − h(y) = (x − y)(x + y + p), so K is the supremum of |x + y + p| over the interval. Then compare the two tolerances and take the smaller.'],
  solution: `|T(x) − T(x₀)| = ${n(am)}|x − x₀|, which is below ${n(eps)} exactly when |x − x₀| < ${n(eps)} ÷ ${n(am)} = ${n(dT)}, so the sensor’s δ is ${n(dT)}. For h, h(x) − h(y) = (x − y)(x + y ${sg(p)}), and on [${n(a)}, ${n(b)}] the sum x + y ${sg(p)} comes as close as you like to ${n(u1)} and ${n(u2)}, so K = ${n(K)} and ε ÷ K = ${n(eps)} ÷ ${n(K)} = ${n(dH)}. The smaller of ${n(dT)} and ${n(dH)} is ${n(dc)}: a dial setting error below ${n(dc)} keeps both outputs within ${n(eps)}.`,
  guidance: [
   { prompt: `T(x) − T(x₀) = ${n(m)}(x − x₀). What is the largest δ that makes |T(x) − T(x₀)| < ${n(eps)} whenever |x − x₀| < δ?`, answer: [dT], explanation: `|T(x) − T(x₀)| = ${n(am)}|x − x₀| < ${n(eps)} exactly when |x − x₀| < ${n(eps)} ÷ ${n(am)} = ${n(dT)}.` },
   { prompt: `h(x) − h(y) = (x − y)(x + y ${sg(p)}). On [${n(a)}, ${n(b)}], what is the supremum of |x + y ${sg(p)}|?`, answer: [K], explanation: `The sum comes as close as you like to ${n(u1)} and ${n(u2)} and lies between them, so the supremum of its size is ${n(K)}.` },
   { prompt: `The sensor’s δ is ${n(dT)}, and the heater’s is ε ÷ K = ${n(eps)} ÷ ${n(K)}. What is the smaller of the two?`, answer: [dc], explanation: `ε ÷ K = ${n(dH)}, and the smaller of ${n(dT)} and ${n(dH)} is ${n(dc)}.` }
  ] }; }
});

/* d: harder numbers (a slope with a half, a left piece with its own linear term), plus the size of the gap between the one-sided limits. */
mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q20', title: 'The full thermostat audit',
 brief: 'The thermostat’s curves have sloping pieces and a wide dial range, and the audit needs the tolerance, the verdict, the gap and the constant.',
 labels: ['δ', 'code', 'size of gap', 'smallest K'], tolerance: 0.0001,
 gl: [['δ'], ['left-hand limit'], ['right-hand limit'], ['code'], ['size of gap'], ['smallest K']]
}, {
 canonical: { m: 2.5, k: 4, dd: 40, c: -2, v: 3, u: 1, s: -2, kind: 2, gap: -3, val: 5, p: 7, a: -6, b: 2 },
 draw: R => { for (let t = 0; t < 1000; t++) { const kind = R.int(0, 2), c = R.int(-4, 4), v = R.nz(-5, 5), u = R.nz(-6, 6), s = R.nz(-5, 5), L = c * c + v * c + u, gap = R.nz(-6, 6),
    p = R.nz(-9, 9), a = R.int(-7, 0), b = a + R.int(4, 9), m = R.pick([-3.5, -2.5, -1.5, 1.5, 2.5, 3.5, 4.5, 0.5, -0.5]), val = kind === 0 ? L : kind === 1 ? L + R.nz(-4, 4) : R.pick([L, L + gap, L + gap + 2]);
   if (lipK(1, p, a, b) >= 3) return { m, k: R.nz(-9, 9), dd: R.pick([4, 8, 20, 40, 60, 100]), c, v, u, s, kind, gap, val, p, a, b }; }
  return { m: 2.5, k: 4, dd: 40, c: -2, v: 3, u: 1, s: -2, kind: 2, gap: -3, val: 5, p: 7, a: -6, b: 2 }; },
 build: P => { const { m, k, dd, c, v, u, s, kind, gap, val, p, a, b } = P, d = dd / 1000, eps = r6(Math.abs(m) * d), L = c * c + v * c + u, R = L + (kind === 2 ? gap : 0), w = R - s * c, K = lipK(1, p, a, b), u1 = 2 * a + p, u2 = 2 * b + p, G = Math.abs(R - L);
  const lp = poly([[1, 'x²'], [v, 'x'], [u, '']]), rp = poly([[s, 'x'], [w, '']]), ltxt = `${par(c)}²${v < 0 ? ' −' : ' +'} ${n(Math.abs(v))} × ${par(c)}${ptxt(u)}`, rtxt = `${par(s)} × ${par(c)}${ptxt(w)}`;
  const verdict = kind === 0 ? `all three agree, so g is continuous at x = ${n(c)}: code 0.` : kind === 1 ? `the two limits agree but g(${n(c)}) = ${n(val)} is different: the discontinuity is removable, code 1.` : `the two limits differ, so no single value can repair g: it has a jump discontinuity, code 2.`;
  const sd = `|T(x) − T(x₀)| = ${n(Math.abs(m))}|x − x₀|, which is below ${n(eps)} exactly when |x − x₀| < ${n(eps)} ÷ ${n(Math.abs(m))} = ${n(d)}, so the largest δ is ${n(d)}.`; return {
  prompt: `Mira audits a thermostat in four checks. First, its dial reads T(x) = ${poly([[m, 'x'], [k, '']])}: enter the largest δ such that |x − x₀| < δ always gives |T(x) − T(x₀)| < ${n(eps)}. Second, its switch-over curve is g(x) = ${lp} for x < ${n(c)}, g(${n(c)}) = ${n(val)}, and g(x) = ${rp} for x > ${n(c)}: enter 0 if g is continuous at x = ${n(c)}, 1 if it has a removable discontinuity there, or 2 if it has a jump discontinuity. Third, enter the size of the gap between the left-hand and right-hand limits of g at x = ${n(c)} (0 if they are equal). Fourth, its heater is h(x) = ${poly([[1, 'x²'], [p, 'x']])} for x in [${n(a)}, ${n(b)}]: enter the smallest Lipschitz constant of h on that interval.`,
  answer: [d, kind, G, K],
  hints: ['A straight line changes by the size of its slope times the change in x, so δ is ε divided by the size of the slope. Slopes may be decimals.', 'Work out both one-sided limits by putting the switch value into each piece. Different limits make a jump, equal limits with a different value make a removable discontinuity, and the gap is how far apart the limits are.', 'For x² + px, h(x) − h(y) = (x − y)(x + y + p), so the constant is the supremum of |x + y + p| over the interval; compare the sizes at both ends.'],
  solution: `${sd} For g, the left-hand limit at ${n(c)} is ${ltxt} = ${n(L)}, the right-hand limit is ${rtxt} = ${n(R)}, and g(${n(c)}) = ${n(val)}: ${verdict} The gap between the limits is |${n(R)} − ${par(L)}| = ${n(G)}. For h, h(x) − h(y) = (x − y)(x + y ${sg(p)}), and on [${n(a)}, ${n(b)}] the sum x + y ${sg(p)} comes as close as you like to ${n(u1)} and ${n(u2)}, so the smallest Lipschitz constant is ${n(K)}.`,
  guidance: [
   { prompt: `T(x) − T(x₀) = ${n(m)}(x − x₀). What is the largest δ that makes |T(x) − T(x₀)| < ${n(eps)} whenever |x − x₀| < δ?`, answer: [d], explanation: sd },
   { prompt: `What does g(x) approach as x approaches ${n(c)} from the left?`, answer: [L], explanation: `For x < ${n(c)}, g(x) = ${lp}, which approaches ${ltxt} = ${n(L)}.` },
   { prompt: `What does g(x) approach as x approaches ${n(c)} from the right?`, answer: [R], explanation: `For x > ${n(c)}, g(x) = ${rp}, which approaches ${rtxt} = ${n(R)}.` },
   { prompt: `The one-sided limits are ${n(L)} and ${n(R)}, and g(${n(c)}) = ${n(val)}. Enter the code: 0 continuous, 1 removable, 2 jump.`, answer: [kind], explanation: `Here ${verdict}` },
   { prompt: `What is the size of the gap between the two one-sided limits ${n(L)} and ${n(R)}?`, answer: [G], explanation: `|${n(R)} − ${par(L)}| = ${n(G)}.` },
   { prompt: `h(x) − h(y) = (x − y)(x + y ${sg(p)}). On [${n(a)}, ${n(b)}], what is the supremum of |x + y ${sg(p)}|?`, answer: [K], explanation: `The sum comes as close as you like to ${n(u1)} and ${n(u2)} and lies between them, so the supremum of its size is ${n(K)}.` }
  ] }; }
});

/* ---- q24 The derivative as a limit; differentiability [4.1] ---- */

/* b: a line on the left, a parabola on the right (the pieces meet at x = c, f(c) comes from the right piece). left limit s, right limit 2c + p.
   The parent has the parabola on the left, with c = 2. */
mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The flow gauge’s join',
 brief: 'A flow gauge’s response is a straight line that hands over to a curve, and Mira needs to know if the hand-over is smooth.',
 labels: ['limit from the left', 'limit from the right', 'differentiable (1 or 0)'], tolerance: 0.01,
 gl: [['limit from the left'], ['limit from the right'], ['differentiable (1 or 0)']]
}, {
 canonical: { c: 1, p: 3, r: -2, s: -1 },
 draw: R => { for (let t = 0; t < 1000; t++) { const c = R.int(-3, 4), p = R.nz(-6, 6), r = R.nz(-5, 5), same = R.bool(), s = same ? 2 * c + p : 2 * c + p + R.nz(-4, 4);
   if (s !== 0 && !(c === 2 && p === -1 && r === 3)) return { c, p, r, s }; } return { c: 1, p: 3, r: -2, s: -1 }; },
 build: ({ c, p, r, s }) => { const fc = c * c + p * c + r, w = fc - s * c, R2 = 2 * c + p, flag = s === R2 ? 1 : 0; return {
  prompt: `A flow gauge in the workshop reads f(x) = ${poly([[s, 'x'], [w, '']])} for x < ${n(c)}, and f(x) = ${poly([[1, 'x²'], [p, 'x'], [r, '']])} for x ≥ ${n(c)} (the two pieces meet at x = ${n(c)}). At x = ${n(c)}, the difference quotient (f(${n(c)} + h) − f(${n(c)})) ÷ h compares the reading at a nearby setting with the reading at ${n(c)}. Enter its limit as h approaches 0 from the left (h < 0), then its limit as h approaches 0 from the right (h > 0), then 1 if f is differentiable at x = ${n(c)}, 0 if not.`,
  answer: [s, R2, flag],
  hints: ['For h < 0 the point c + h is on the left piece, and for h > 0 on the right piece. f(c) itself comes from the piece for x ≥ c.', 'Expand the right piece at c + h and subtract f(c); every term without h cancels. f is differentiable at c exactly when the two one-sided limits are equal.'],
  solution: `f(${n(c)}) = ${n(fc)}, from the right piece. For h < 0, f(${n(c)} + h) − f(${n(c)}) = ${poly([[s, 'h']])}, so the quotient is ${n(s)}. For h > 0, f(${n(c)} + h) − f(${n(c)}) = ${poly([[1, 'h²'], [R2, 'h']])}, so the quotient is ${poly([[1, 'h'], [R2, '']])}, which approaches ${n(R2)}. The one-sided limits are ${n(s)} and ${n(R2)}. ${flag ? `They agree, so the difference quotient has the limit ${n(s)} and f is differentiable at x = ${n(c)} with f′(${n(c)}) = ${n(s)}: enter 1.` : 'They differ, so the difference quotient has no limit and f is not differentiable at that point: enter 0.'}`,
  guidance: [
   { prompt: `Take h < 0, so ${n(c)} + h is just left of ${n(c)}. What does (f(${n(c)} + h) − f(${n(c)})) ÷ h approach as h approaches 0?`, answer: [s], explanation: `For h < 0 the left piece applies and f(${n(c)}) = ${n(fc)}: the difference is ${poly([[s, 'h']])}, so the quotient is ${n(s)}.` },
   { prompt: `Now take h > 0. What does the quotient approach?`, answer: [R2], explanation: `For h > 0 the right piece applies: the difference is ${poly([[1, 'h²'], [R2, 'h']])}, so the quotient is ${poly([[1, 'h'], [R2, '']])}, which approaches ${n(R2)}.` },
   { prompt: `The one-sided limits are ${n(s)} and ${n(R2)}. Enter 1 if f is differentiable at x = ${n(c)}, 0 if not.`, answer: [flag], explanation: flag ? `Both sides give ${n(s)}, so the limit exists and f′(${n(c)}) = ${n(s)}.` : `The two sides give ${n(s)} and ${n(R2)}, which differ, so there is no limit.` }
  ] }; }
});

/* c: a rail position a|t − c| + k t + r: speed from the left k − a, from the right k + a, jump 2a. The worked example is 3|x − 1| + 2x. */
mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'The cutting arm at its turning point',
 brief: 'A cutting arm reverses its sweep at one instant, and the log needs its speed on each side and the size of the change.',
 labels: ['speed from the left', 'speed from the right', 'size of the change'], tolerance: 0.01,
 gl: [['speed from the left'], ['speed from the right'], ['size of the change']]
}, {
 canonical: { a: 4, k: 1, r: 2, c: 3 },
 draw: R => { for (let t = 0; t < 1000; t++) { const a = R.int(2, 7), k = R.nz(-5, 5), r = R.nz(-6, 6), c = R.int(1, 6); if (!(a === 3 && k === 2 && c === 1)) return { a, k, r, c }; } return { a: 4, k: 1, r: 2, c: 3 }; },
 build: ({ a, k, r, c }) => { const f = `${n(a)}|t − ${n(c)}|${tail(k, 't')}${tail(r, '')}`, fc = k * c + r, Lf = k - a, Rt = k + a, gap = 2 * a; return {
  prompt: `A cutting arm slides along a rail. Its position, in centimetres from the start, is f(t) = ${f} at t seconds, where |t − ${n(c)}| is the distance of t from ${n(c)}. At t = ${n(c)} its speed would be the limit of the difference quotient (f(${n(c)} + h) − f(${n(c)})) ÷ h as h approaches 0. Enter that limit as h approaches 0 from the left (h < 0), then from the right (h > 0), then the size of the difference between the two (the sudden change in speed).`,
  answer: [Lf, Rt, gap],
  hints: ['Here f(c + h) − f(c) contains |h|. For h < 0, |h| = −h, so |h| ÷ h = −1; for h > 0, |h| = h, so |h| ÷ h = 1.', 'The other terms of f are straight lines, so the quotient of their change is just their slope. Add the two parts on each side, then subtract.'],
  solution: `f(${n(c)}) = ${n(fc)}, and f(${n(c)} + h) − f(${n(c)}) = ${n(a)}|h|${tail(k, 'h')}, so the quotient is ${n(a)} × (|h| ÷ h)${tail(k, '')}. For h < 0, |h| ÷ h = −1 and the limit is ${poly([[-a, ''], [k, '']])} = ${n(Lf)}. For h > 0, |h| ÷ h = 1 and the limit is ${poly([[a, ''], [k, '']])} = ${n(Rt)}. The difference is |${n(Rt)} − ${par(Lf)}| = ${n(gap)}, so the speed would change suddenly by ${n(gap)} centimetres per second, and f is not differentiable at t = ${n(c)}.`,
  guidance: [
   { prompt: `For h < 0, |h| ÷ h = −1. What does (f(${n(c)} + h) − f(${n(c)})) ÷ h approach as h approaches 0 from the left?`, answer: [Lf], explanation: `The quotient is ${n(a)} × (|h| ÷ h)${tail(k, '')}, and for h < 0 that is ${poly([[-a, ''], [k, '']])} = ${n(Lf)}.` },
   { prompt: `For h > 0, |h| ÷ h = 1. What does the quotient approach as h approaches 0 from the right?`, answer: [Rt], explanation: `For h > 0 the quotient is ${poly([[a, ''], [k, '']])} = ${n(Rt)}.` },
   { prompt: `The one-sided limits are ${n(Lf)} and ${n(Rt)}. What is the size of the difference between them?`, answer: [gap], explanation: `|${n(Rt)} − ${par(Lf)}| = ${n(gap)}.` }
  ] }; }
});

/* d: a cubic x³ + p x on the left, a line s x + w on the right (w makes the pieces meet at x = c, f(c) = c³ + p c). left limit 3c² + p, right limit s. */
mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q20', title: 'The load cell’s cubic join',
 brief: 'A load cell’s response is a cubic that hands over to a straight line, and Mira needs its value and slope on each side of the join.',
 labels: ['f(c)', 'limit from the left', 'limit from the right', 'differentiable (1 or 0)'], tolerance: 0.01,
 gl: [['f(c)'], ['limit from the left'], ['limit from the right'], ['differentiable (1 or 0)']]
}, {
 canonical: { c: -2, p: -5, s: 7 },
 draw: R => { for (let t = 0; t < 1000; t++) { const c = R.pick([-3, -2, -1, 1, 2, 3]), p = R.nz(-9, 9), same = R.bool(), s = same ? 3 * c * c + p : 3 * c * c + p + R.nz(-5, 5); if (s !== 0) return { c, p, s }; } return { c: -2, p: -5, s: 7 }; },
 build: ({ c, p, s }) => { const fc = c * c * c + p * c, w = fc - s * c, Lf = 3 * c * c + p, flag = s === Lf ? 1 : 0; return {
  prompt: `A load cell reads f(x) = ${poly([[1, 'x³'], [p, 'x']])} for x < ${n(c)}, and f(x) = ${poly([[s, 'x'], [w, '']])} for x ≥ ${n(c)} (the two pieces meet at x = ${n(c)}, so f is continuous there). Enter f(${n(c)}). Then, for the difference quotient (f(${n(c)} + h) − f(${n(c)})) ÷ h, enter its limit as h approaches 0 from the left (h < 0), then from the right (h > 0), then 1 if f is differentiable at x = ${n(c)}, 0 if not. You may use (a + h)³ = a³ + 3a²h + 3ah² + h³.`,
  answer: [fc, Lf, s, flag],
  hints: ['f(c) comes from the piece for x ≥ c. For h < 0 the point c + h is on the cubic piece, and the cubic’s difference has an h in every term, so divide through by h before letting h approach 0.', 'For h > 0 the line’s difference is its slope times h. f is differentiable at c exactly when the two one-sided limits are equal.'],
  solution: `f(${n(c)}) = ${par(s)} × ${par(c)}${ptxt(w)} = ${n(fc)}. For h < 0, f(${n(c)} + h) − f(${n(c)}) = (${n(c)} + h)³${tail(p, '')}(${n(c)} + h) − ${par(fc)} = ${poly([[1, 'h³'], [3 * c, 'h²'], [Lf, 'h']])}, so the quotient is ${poly([[1, 'h²'], [3 * c, 'h'], [Lf, '']])}, which approaches ${n(Lf)}. For h > 0, the difference is ${poly([[s, 'h']])}, so the quotient is ${n(s)}. The one-sided limits are ${n(Lf)} and ${n(s)}. ${flag ? `They agree, so f is differentiable at x = ${n(c)} with f′(${n(c)}) = ${n(s)}: enter 1.` : 'They differ, so f is not differentiable at that point: enter 0.'}`,
  guidance: [
   { prompt: `The right piece holds at x = ${n(c)}: f(x) = ${poly([[s, 'x'], [w, '']])}. What is f(${n(c)})?`, answer: [fc], explanation: `${par(s)} × ${par(c)}${ptxt(w)} = ${n(fc)}. The cubic piece gives the same value, ${n(fc)}, as it should.` },
   { prompt: `Take h < 0. Expanding the cubic, (f(${n(c)} + h) − f(${n(c)})) ÷ h = ${poly([[1, 'h²'], [3 * c, 'h'], [Lf, '']])}. What does it approach as h approaches 0?`, answer: [Lf], explanation: `Only the constant term survives as h approaches 0: ${n(Lf)}.` },
   { prompt: `Now take h > 0. What does the quotient approach?`, answer: [s], explanation: `For h > 0 the line applies: the difference is ${poly([[s, 'h']])}, so the quotient is ${n(s)}.` },
   { prompt: `The one-sided limits are ${n(Lf)} and ${n(s)}. Enter 1 if f is differentiable at x = ${n(c)}, 0 if not.`, answer: [flag], explanation: flag ? `Both sides give ${n(s)}, so the limit exists and f′(${n(c)}) = ${n(s)}.` : `The two sides give ${n(Lf)} and ${n(s)}, which differ, so there is no limit.` }
  ] }; }
});

/* ---- q25 Rolle's theorem and the mean value theorem [4.2] ---- */

/* The points c that the theorem promises, found once by search. Rolle: f(x) = x³ + p x² + q x + z with q fixed by f(a) = f(b), c a whole number,
   the only root of f′ strictly inside (a, b). MVT: A x³ + p x² + q x + z, where q and z do not move c; the root of 3A c² + 2p c = A(a² + ab + b²) + p(a + b). */
const ROLLE = [], MVT = [];
for (let p = -6; p <= 6; p++) for (let a = -5; a <= 3; a++) for (let b = a + 2; b <= a + 7; b++) {
 const q = -(a * a + a * b + b * b) - p * (a + b), D = 4 * p * p - 12 * q; if (D <= 0) continue;
 const sq = Math.sqrt(D); if (Math.abs(sq - Math.round(sq)) > 1e-9) continue;
 const ins = [(-2 * p + sq) / 6, (-2 * p - sq) / 6].filter(c => c > a + 1e-9 && c < b - 1e-9);
 if (ins.length === 1 && Number.isInteger(ins[0]) && Math.abs(q) <= 30) ROLLE.push({ p, q, a, b, c: ins[0] });
}
for (const A of [1, 2, 3]) for (let p = -6; p <= 6; p++) for (let a = -5; a <= 3; a++) for (let b = a + 2; b <= a + 7; b++) {
 const T = A * (a * a + a * b + b * b) + p * (a + b), D = 4 * p * p + 12 * A * T; if (D < 0) continue;
 const sq = Math.sqrt(D), ins = [(-2 * p + sq) / (6 * A), (-2 * p - sq) / (6 * A)].filter(c => c > a + 1e-9 && c < b - 1e-9);
 if (ins.length === 1 && Number.isInteger(ins[0]) && !(A === 1 && p === -3 && a === 0 && b === 3) && !(A === 1 && p === 0 && a === -1 && b === 2)) MVT.push({ A, p, a, b, c: ins[0] });
}
const cubic = (A, p, q, z) => poly([[A, 'x³'], [p, 'x²'], [q, 'x'], [z, '']]);
const cubicAt = (A, p, q, z, x) => A * x * x * x + p * x * x + q * x + z;
const ders = (A, p, q) => poly([[3 * A, 'x²'], [2 * p, 'x'], [q, '']]);
/* The two roots of 3A c² + 2p c − T = 0, and the one strictly inside (a, b). */
const croots = (A, p, T) => { const sq = Math.sqrt(4 * p * p + 12 * A * T); return [(-2 * p + sq) / (6 * A), (-2 * p - sq) / (6 * A)]; };
const rtxt = o => Number.isInteger(o) ? n(o) : `about ${n(o)}`;

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The needle that came back',
 brief: 'A strain needle ended its sweep where it began, and Mira wants the exact load at which it was momentarily still.',
 labels: ['common end value', 'c'], tolerance: 0.01,
 gl: [['common end value'], ['c']]
}, {
 canonical: { p: -4, a: -3, b: 2, z: 6 },
 draw: R => { const e = R.pick(ROLLE); return { p: e.p, a: e.a, b: e.b, z: R.int(-5, 6) }; },
 build: ({ p, a, b, z }) => { const q = -(a * a + a * b + b * b) - p * (a + b), fa = cubicAt(1, p, q, z, a), fb = cubicAt(1, p, q, z, b), rs = croots(1, p, -q), c = rs.find(x => x > a + 1e-9 && x < b - 1e-9), o = rs.find(x => x !== c);
  return {
  prompt: `A strain gauge needle reads f(x) = ${cubic(1, p, q, z)} at loads x from ${n(a)} to ${n(b)}, and it ends where it began: f(${n(a)}) = f(${n(b)}). f is a polynomial, so it is continuous on [${n(a)}, ${n(b)}] and differentiable between ${n(a)} and ${n(b)}. Enter the common value f(${n(a)}), then the load c strictly between ${n(a)} and ${n(b)} where f′(c) = 0, as Rolle’s theorem promises. Here there is exactly one such c.`,
  answer: [fa, c],
  hints: ['Put the left end into f to get the common value. Rolle’s theorem is the mean value theorem with average slope 0.', 'Differentiate, set f′(c) = 0, and solve the quadratic. Keep the solution that lies strictly between the two ends.'],
  solution: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}, so the common value is ${n(fa)}. f′(x) = ${ders(1, p, q)}, so c must solve ${ders(1, p, q).replace(/x/g, 'c')} = 0. Its solutions are ${n(c)} and ${rtxt(o)}; only ${n(c)} lies strictly between ${n(a)} and ${n(b)}, so c = ${n(c)}.`,
  guidance: [
   { prompt: `What is f(${n(a)}), the value at the left end (it equals f(${n(b)}))?`, answer: [fa], explanation: `f(${n(a)}) = ${n(fa)}, and f(${n(b)}) = ${n(fb)} is the same.` },
   { prompt: `f′(x) = ${ders(1, p, q)}. Solve f′(c) = 0. Which solution lies strictly between ${n(a)} and ${n(b)}?`, answer: [c], explanation: `The solutions are ${n(c)} and ${rtxt(o)}. Only ${n(c)} is inside the interval.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The proving ring’s matching load',
 brief: 'A proving ring was loaded steadily between two settings, and the log needs its average rate, the load that matched it and the reading there.',
 labels: ['average slope', 'c', 'f(c)'], tolerance: 0.01,
 gl: [['average slope'], ['c'], ['f(c)']]
}, {
 canonical: { p: -2, a: 1, b: 8, q: 3 },
 draw: R => { const e = R.pick(MVT.filter(x => x.A === 1)); return { p: e.p, a: e.a, b: e.b, q: R.int(-6, 6) }; },
 build: ({ p, a, b, q }) => { const f = x => cubicAt(1, p, q, 0, x), T0 = a * a + a * b + b * b + p * (a + b), avg = T0 + q, rs = croots(1, p, T0), c = rs.find(x => x > a + 1e-9 && x < b - 1e-9), o = rs.find(x => x !== c), fc = f(c);
  return {
  prompt: `A proving ring’s reading, in microstrains, is f(x) = ${cubic(1, p, q, 0)} at a load of x units, for loads from ${n(a)} to ${n(b)}. f is a polynomial, so it is continuous on [${n(a)}, ${n(b)}] and differentiable between ${n(a)} and ${n(b)}. Enter the average slope (f(${n(b)}) − f(${n(a)})) ÷ (${n(b)} − ${par(a)}). Then enter the load c strictly between ${n(a)} and ${n(b)} where f′(c) equals that slope, as the mean value theorem promises (exactly one such c exists here). Finally enter the reading f(c) at that load.`,
  answer: [avg, c, fc],
  hints: ['Work out f at both ends, subtract, and divide by the length of the interval.', 'Differentiate, set f′(c) equal to the average slope, and solve the quadratic. Keep the solution strictly between the two ends, then put it back into f.'],
  solution: `f(${n(a)}) = ${n(f(a))} and f(${n(b)}) = ${n(f(b))}, so the average slope is (${n(f(b))} − ${par(f(a))}) ÷ ${n(b - a)} = ${n(avg)}. f′(x) = ${ders(1, p, q)}, so c must solve ${ders(1, p, q).replace(/x/g, 'c')} = ${n(avg)}. Its solutions are ${n(c)} and ${rtxt(o)}; only ${n(c)} lies strictly between ${n(a)} and ${n(b)}. Then f(${n(c)}) = ${n(fc)}.`,
  guidance: [
   { prompt: `f(${n(a)}) = ${n(f(a))} and f(${n(b)}) = ${n(f(b))}. What is the average slope over [${n(a)}, ${n(b)}]?`, answer: [avg], explanation: `(${n(f(b))} − ${par(f(a))}) ÷ ${n(b - a)} = ${n(avg)}.` },
   { prompt: `f′(x) = ${ders(1, p, q)}. Solve f′(c) = ${n(avg)}. Which solution lies strictly between ${n(a)} and ${n(b)}?`, answer: [c], explanation: `The solutions are ${n(c)} and ${rtxt(o)}. Only ${n(c)} is inside the interval, and f′(${n(c)}) = ${n(avg)}.` },
   { prompt: `What is f(${n(c)}), the reading at that load?`, answer: [fc], explanation: `Putting ${par(c)} into f gives ${n(fc)}.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'The steeper needle',
 brief: 'A needle with a steeper curve was swept across a wide range of loads, and Mira wants its average slope, the matching load and the slope at the far end.',
 labels: ['average slope', 'c', 'slope at the right end'], tolerance: 0.01,
 gl: [['average slope'], ['c'], ['slope at the right end']]
}, {
 canonical: { A: 2, p: -4, a: 1, b: 8, q: -3, z: 5 },
 draw: R => { const e = R.pick(MVT.filter(x => x.A > 1)); return { A: e.A, p: e.p, a: e.a, b: e.b, q: R.int(-8, 8), z: R.int(-6, 6) }; },
 build: ({ A, p, a, b, q, z }) => { const f = x => cubicAt(A, p, q, z, x), T0 = A * (a * a + a * b + b * b) + p * (a + b), avg = T0 + q, rs = croots(A, p, T0), c = rs.find(x => x > a + 1e-9 && x < b - 1e-9), o = rs.find(x => x !== c), fb1 = 3 * A * b * b + 2 * p * b + q;
  return {
  prompt: `A calibration needle’s reading is f(x) = ${cubic(A, p, q, z)} at loads x from ${n(a)} to ${n(b)}. f is a polynomial, so it is continuous on [${n(a)}, ${n(b)}] and differentiable between ${n(a)} and ${n(b)}. Enter the average slope (f(${n(b)}) − f(${n(a)})) ÷ (${n(b)} − ${par(a)}). Then enter the load c strictly between ${n(a)} and ${n(b)} where f′(c) equals that slope, as the mean value theorem promises (exactly one such c exists here). Finally enter the instant slope f′(${n(b)}) at the right end.`,
  answer: [avg, c, fb1],
  hints: ['The constant term of f cancels in f(b) − f(a). Work out the two end values (or just the difference), and divide by the length of the interval.', 'Differentiate, set f′(c) equal to the average slope and solve the quadratic, keeping the solution strictly between the ends. For the last answer put the right end into f′.'],
  solution: `f(${n(a)}) = ${n(f(a))} and f(${n(b)}) = ${n(f(b))}, so the average slope is (${n(f(b))} − ${par(f(a))}) ÷ ${n(b - a)} = ${n(avg)}. f′(x) = ${ders(A, p, q)}, so c must solve ${ders(A, p, q).replace(/x/g, 'c')} = ${n(avg)}. Its solutions are ${n(c)} and ${rtxt(o)}; only ${n(c)} lies strictly between ${n(a)} and ${n(b)}. Finally f′(${n(b)}) = ${n(fb1)}.`,
  guidance: [
   { prompt: `f(${n(a)}) = ${n(f(a))} and f(${n(b)}) = ${n(f(b))}. What is the average slope over [${n(a)}, ${n(b)}]?`, answer: [avg], explanation: `(${n(f(b))} − ${par(f(a))}) ÷ ${n(b - a)} = ${n(avg)}.` },
   { prompt: `f′(x) = ${ders(A, p, q)}. Solve f′(c) = ${n(avg)}. Which solution lies strictly between ${n(a)} and ${n(b)}?`, answer: [c], explanation: `The solutions are ${n(c)} and ${rtxt(o)}. Only ${n(c)} is inside the interval.` },
   { prompt: `What is f′(${n(b)}), the instant slope at the right end?`, answer: [fb1], explanation: `Putting ${par(b)} into f′ gives ${n(fb1)}.` }
  ] }; }
});

})();
