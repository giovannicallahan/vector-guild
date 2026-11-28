/* Real analysis mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed pieces of a letter expression: poly([[1, 'x³'], [−3, 'x²'], [0, 'x'], [4, '']]) is 'x³ − 3x² + 4'. A coefficient
   of size 1 is not written, a 0 term is left out, and an expression with no terms is '0'. */
const poly = terms => { const out = [];
 for (const [v, x] of terms) { if (!v) continue; const a = Math.abs(v), body = x ? `${a === 1 ? '' : n(a)}${x}` : n(a);
  out.push(out.length ? `${v < 0 ? '−' : '+'} ${body}` : `${v < 0 ? '−' : ''}${body}`); }
 return out.length ? out.join(' ') : '0'; };
/* ' + 3h' / ' − h' to follow another term; '' for 0. */
const tail = (v, x) => v ? ` ${v < 0 ? '−' : '+'} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}` : '';
/* '= 0.25' when n(v) is exact, '≈ 0.0156' when it is rounded. */
const approx = v => (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-7 ? '= ' : '≈ ') + n(v);
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const sign = v => v < 0 ? 'negative' : 'positive';

/* q21: bisection on f(x) = xᵖ − c over [a, a + L]. Midpoints are dyadic, and c is not a p-th power, so f is never 0 at one. */
const EPS21 = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
const bisect = ({ p, c, a, L }) => { const f = x => Math.pow(x, p) - c, st = []; let lo = a, hi = a + L;
 for (let i = 0; i < 2; i++) { const m = (lo + hi) / 2, v = f(m); if (v < 0) lo = m; else hi = m; st.push({ m, v, lo, hi }); }
 return st; };
const halvings = (L, e) => { let k = 0; while (L / Math.pow(2, k) >= e) k++; return k; };

/* q22, q23: f(x) = x² + px on [a, b]. f(x) − f(y) = (x − y)(x + y + p), and x + y + p sweeps the open interval between
   2a + p and 2b + p, so the smallest Lipschitz constant is the larger of |2a + p| and |2b + p|. */
const lipK = (p, a, b) => Math.max(Math.abs(2 * a + p), Math.abs(2 * b + p));
const DELTA = [0.01, 0.02, 0.05, 0.002, 0.005, 0.001];
const r6 = x => Math.round(x * 1e6) / 1e6;

/* q25: (p, a, b, c) with exactly one point c strictly inside (a, b) where 3c² + 2pc + q equals the average slope of
   x³ + px² + qx (q does not move c), c a whole number. Found once by search; the worked example's x³ on [−1, 2] is left out. */
const MVT = (() => { const out = [];
 for (let p = -6; p <= 6; p++) for (let a = -6; a <= 4; a++) for (let b = a + 2; b <= a + 8; b++) {
  const T = a * a + a * b + b * b + p * (a + b), D = 4 * p * p + 12 * T; if (D < 0) continue;
  const s = Math.sqrt(D), rs = [(-2 * p + s) / 6, (-2 * p - s) / 6].filter(c => c > a + 1e-9 && c < b - 1e-9);
  if (rs.length !== 1 || Math.abs(rs[0] - Math.round(rs[0])) > 1e-9) continue;
  if (p === 0 && a === -1 && b === 2) continue;
  out.push({ p, a, b }); }
 return out; })();

/* q27, q29: the Lagrange remainder bound M·xᵏ ÷ k! with k = n + 1, for eˣ (x = 1, M = 3 because e < 3), sin x and cos x
   (x = 1 or 2, M = 1). ε has a whole-number reciprocal, so "bound < ε" is the whole-number test k! > M·xᵏ·(1/ε). */
const EPS27 = [0.01, 0.005, 0.001, 0.0005, 0.0001];
const FN = { exp: 'eˣ', sin: 'sin x', cos: 'cos x' };
const taylor = ({ fn, x, n0, e }) => { const M = fn === 'exp' ? 3 : 1, inv = Math.round(1 / e);
 const raw = M * Math.pow(x, n0 + 1), den0 = fact(n0 + 1), g = gcd(raw, den0);
 let N = 0; while (!(fact(N + 1) > M * Math.pow(x, N + 1) * inv)) N++;
 return { M, inv, raw, den0, num: raw / g, den: den0 / g, N,
  prodBefore: M * Math.pow(x, N) * inv, factBefore: fact(N), prodAt: M * Math.pow(x, N + 1) * inv, factAt: fact(N + 1) }; };
/* The sentence that states the remainder bound for the function, in the prompt. */
const taylorSetup = (fn, x) => fn === 'exp'
 ? `Every derivative of eˣ is eˣ, and eᶜ < 3 for every c between 0 and 1, so the error at x = 1 is at most 3 ÷ (n + 1)!`
 : `Every derivative of ${FN[fn]} is ±sin x or ±cos x, which is never bigger than 1 in size, so the error at x = ${n(x)} is at most ${x === 1 ? '1' : n(x) + 'ⁿ⁺¹'} ÷ (n + 1)!`;
const taylorDraw = (R, avoid) => { for (let i = 0; i < 1000; i++) { const fn = R.pick(['exp', 'sin', 'cos']), x = fn === 'exp' ? 1 : R.pick([1, 2]);
 const p = { fn, x, n0: R.int(3, 6), e: R.pick(EPS27) }; if (!avoid(p)) return p; } return null; };
/* The working for the smallest degree, shared by q27 and q29. */
const degreeWork = (t, x, e) => `The bound for degree n is below ${n(e)} exactly when (n + 1)! is bigger than ${x !== 1 ? `${n(x)}ⁿ⁺¹ × ${n(t.inv)}` : t.M === 1 ? n(t.inv) : `${n(t.M)} × ${n(t.inv)} = ${n(t.M * t.inv)}`}. For degree ${n(t.N - 1)}: ${n(t.N)}! = ${n(t.factBefore)}, which is not bigger than ${n(t.prodBefore)}. For degree ${n(t.N)}: ${n(t.N + 1)}! = ${n(t.factAt)}, which is bigger than ${n(t.prodAt)}. So the smallest degree is ${n(t.N)}.`;

/* q30: f on a partition with whole-number points. kind: 'sq+' x² + k, 'sq−' k − x², 'lin+' sx + k, 'lin−' k − sx. */
const f30 = ({ kind, s, k }) => kind === 'sq+' ? x => x * x + k : kind === 'sq−' ? x => k - x * x : kind === 'lin+' ? x => s * x + k : x => k - s * x;
const fx30 = ({ kind, s, k }) => kind === 'sq+' ? poly([[1, 'x²'], [k, '']]) : kind === 'sq−' ? `${n(k)} − x²` : kind === 'lin+' ? poly([[s, 'x'], [k, '']]) : `${n(k)} − ${s === 1 ? '' : n(s)}x`;
const sums30 = p => { const f = f30(p), up = p.kind.endsWith('+'), pts = p.pts, pieces = [];
 for (let i = 1; i < pts.length; i++) { const l = pts[i - 1], r = pts[i], len = r - l, lo = up ? l : r, hi = up ? r : l;
  pieces.push({ l, r, len, lo, hi, inf: f(lo), sup: f(hi) }); }
 return { up, pieces, L: pieces.reduce((s, q) => s + q.inf * q.len, 0), U: pieces.reduce((s, q) => s + q.sup * q.len, 0), mesh: Math.max(...pieces.map(q => q.len)) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Bisection: k is the first whole number with L ÷ 2ᵏ < ε (no ε in the list is a power of 2 over L, so no tie), then two
    halvings. Not the worked example (x² − 3 on [1, 2] with ε = 0.05). */
 q21: {
  canonical: { p: 3, c: 20, a: 2, L: 1, e: 0.01 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = R.pick([2, 3]), a = R.int(1, p === 2 ? 5 : 3), L = R.pick([1, 2, 4]), e = R.pick(EPS21);
   const c = R.int(Math.pow(a, p) + 1, Math.pow(a + L, p) - 1); if (Math.pow(Math.round(Math.pow(c, 1 / p)), p) === c) continue;
   if (p === 2 && c === 3 && a === 1 && L === 1 && e === 0.05) continue; return { p, c, a, L, e }; } return { p: 3, c: 20, a: 2, L: 1, e: 0.01 }; },
  build: ({ p, c, a, L, e }) => { const b = a + L, P = p === 2 ? '²' : '³', f = x => Math.pow(x, p) - c, st = bisect({ p, c, a, L }), k = halvings(L, e);
   const [s1, s2] = st, before = L / Math.pow(2, k - 1), at = L / Math.pow(2, k); return {
   prompt: `A thermostat’s heater curve is f(x) = x${P} − ${n(c)}. It is continuous, f(${n(a)}) = ${n(f(a))} is negative and f(${n(b)}) = ${n(f(b))} is positive, so by the intermediate value theorem f has a root between ${n(a)} and ${n(b)}. Bisection halves the interval [${n(a)}, ${n(b)}] again and again, each time keeping the half at whose ends f has opposite signs. Mira wants the root trapped in an interval shorter than ε = ${n(e)}, so that every point of it is within ${n(e)} of the root. Enter the smallest number of halvings that guarantees this, then the left end and the right end of the interval left after two halvings.`,
   answer: [k, s2.lo, s2.hi],
   hints: ['Each halving cuts the length in half, so after k halvings an interval of length L has length L ÷ 2ᵏ. Find the first k that makes this shorter than ε.', 'For the interval after two halvings: work out f at the midpoint, keep the half whose ends give f opposite signs, then do the same once more.'],
   solution: `After ${n(k - 1)} halvings the length is ${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(before)}, which is not below ${n(e)}; after ${n(k)} it is ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(at)}, which is. So ${n(k)} halvings are needed. First halving: the midpoint is ${n(s1.m)} and f(${n(s1.m)}) ${approx(s1.v)} is ${sign(s1.v)}, so the root lies in [${n(s1.lo)}, ${n(s1.hi)}]. Second halving: the midpoint is ${n(s2.m)} and f(${n(s2.m)}) ${approx(s2.v)} is ${sign(s2.v)}, so after two halvings the root is trapped in [${n(s2.lo)}, ${n(s2.hi)}].`,
   guidance: [
    { prompt: `Start the bisection. What is the midpoint of [${n(a)}, ${n(b)}]?`, answer: [s1.m], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(s1.m)}. f(${n(s1.m)}) ${approx(s1.v)} is ${sign(s1.v)}, and f is ${s1.v < 0 ? 'positive at the right end' : 'negative at the left end'}, so the root lies in [${n(s1.lo)}, ${n(s1.hi)}].` },
    { prompt: `The root lies in [${n(s1.lo)}, ${n(s1.hi)}]. What is the midpoint of this half?`, answer: [s2.m], explanation: `(${n(s1.lo)} + ${n(s1.hi)}) ÷ 2 = ${n(s2.m)}. f(${n(s2.m)}) ${approx(s2.v)} is ${sign(s2.v)}, so the half to keep is [${n(s2.lo)}, ${n(s2.hi)}].` },
    { prompt: `After k halvings the interval has length ${n(L)} ÷ 2ᵏ. What is the smallest k that makes this shorter than ${n(e)}?`, answer: [k], explanation: `${n(L)} ÷ ${n(Math.pow(2, k - 1))} ${approx(before)} is still at least ${n(e)}, while ${n(L)} ÷ ${n(Math.pow(2, k))} ${approx(at)} is below it, so ${n(k)} halvings are needed.` }
   ] }; }
 },
 /* f(x) = x² + px on [a, b]: K = max(|2a + p|, |2b + p|) and δ = ε ÷ K with ε = Kδ. p is never ±1 (no written
    coefficient 1). Not the worked example (x² on [0, 5] with δ = 0.005). */
 q22: {
  canonical: { p: 3, a: 1, b: 4, d: 0.01 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = R.except(-6, 6, [-1, 1]), a = R.int(-6, 3), b = a + R.int(2, 6), d = R.pick(DELTA);
   if (lipK(p, a, b) < 2 || (p === 0 && a === 0 && b === 5 && d === 0.005)) continue; return { p, a, b, d }; } return { p: 3, a: 1, b: 4, d: 0.01 }; },
  build: ({ p, a, b, d }) => { const K = lipK(p, a, b), e = r6(K * d), fx = poly([[1, 'x²'], [p, 'x']]), s = `x + y${tail(p, '')}`; return {
   prompt: `A thermostat turns a dial setting x, anywhere in [${n(a)}, ${n(b)}], into a heater power f(x) = ${fx}. Mira wants one δ that works at every setting at once. Enter the smallest Lipschitz constant of f on [${n(a)}, ${n(b)}], that is the smallest K with |f(x) − f(y)| ≤ K|x − y| for all x and y in the interval, then the δ = ε ÷ K that this constant gives for ε = ${n(e)}.`,
   answer: [K, d],
   hints: ['Factor the difference with x² − y² = (x + y)(x − y): f(x) − f(y) is (x − y) times a sum of x, y and a number. The smallest K is the supremum of the size of that sum over the interval.', 'If |x − y| < ε ÷ K, then |f(x) − f(y)| ≤ K|x − y| < ε, wherever x and y lie in the interval. One δ for every point is what uniformly continuous means.'],
   solution: `f(x) − f(y) = (x − y)(${s}). For x ≠ y in [${n(a)}, ${n(b)}], ${s} lies strictly between ${n(2 * a + p)} and ${n(2 * b + p)} and comes as close as you like to both, so the supremum of |${s}| is ${n(K)}. So |f(x) − f(y)| ≤ ${n(K)}|x − y|, and no smaller constant works: the smallest Lipschitz constant is ${n(K)}. With ε = ${n(e)}, δ = ${n(e)} ÷ ${n(K)} = ${n(d)}: whenever |x − y| < ${n(d)}, |f(x) − f(y)| ≤ ${n(K)}|x − y| < ${n(e)} at every setting at once, so f is uniformly continuous on [${n(a)}, ${n(b)}].`,
   guidance: [
    { prompt: `f(x) − f(y) = (x − y)(${s}). As x and y range over [${n(a)}, ${n(b)}], ${s} comes as close as you like to ${n(2 * a + p)} and to ${n(2 * b + p)}. What is the supremum of its size |${s}|, the smallest Lipschitz constant?`, answer: [K], explanation: `The sizes at the two ends are ${n(Math.abs(2 * a + p))} and ${n(Math.abs(2 * b + p))}, and the sum lies between them, so the supremum of its size is the larger one, ${n(K)}.` },
    { prompt: `With K = ${n(K)}, what is δ = ε ÷ K for ε = ${n(e)}?`, answer: [d], explanation: `${n(e)} ÷ ${n(K)} = ${n(d)}. Then |x − y| < ${n(d)} gives |f(x) − f(y)| < ${n(K)} × ${n(d)} = ${n(e)}, wherever x and y are.` }
   ] }; }
 },
 /* Three checks: δ = ε ÷ |m| for T(x) = mx + t0; the code of g at s (0 continuous, 1 removable, 2 jump; kind is the code);
    the Lipschitz constant of x² + px on [a, b] as in q22. */
 q23: {
  canonical: { m: 4, t0: 15, d: 0.05, u: 1, s: 2, v: 3, kind: 1, j: 0, z: 7, p: -2, a: 1, b: 5 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.pick([2, 3, 4, 5, 8, -2, -4, -5]), t0 = R.int(5, 30), d = R.pick([0.1, 0.05, 0.02, 0.01]);
   const u = R.int(-3, 4), s = R.int(1, 3), v = R.pick([2, 3, 4, -2, -3]), kind = R.int(0, 2), left = s * s + u;
   const j = kind === 2 ? R.nz(-4, 4) : 0, z = kind === 1 ? left + R.nz(-3, 3) : left + j * R.int(0, 1);
   const p = R.except(-6, 6, [-1, 1]), a = R.int(-4, 3), b = a + R.int(2, 5);
   if (lipK(p, a, b) < 2 || (m === -5 && t0 === 9 && d === 0.1 && u === -1 && s === 3)) continue; return { m, t0, d, u, s, v, kind, j, z, p, a, b }; }
   return { m: 4, t0: 15, d: 0.05, u: 1, s: 2, v: 3, kind: 1, j: 0, z: 7, p: -2, a: 1, b: 5 }; },
  build: ({ m, t0, d, u, s, v, kind, j, z, p, a, b }) => { const e = r6(Math.abs(m) * d), left = s * s + u, w = left - v * s + j, right = v * s + w;
   const K = lipK(p, a, b), fx = poly([[1, 'x²'], [p, 'x']]), sm = `x + y${tail(p, '')}`, gl = poly([[1, 'x²'], [u, '']]), gr = poly([[v, 'x'], [w, '']]);
   const code = left !== right ? 2 : z !== left ? 1 : 0, verdict = ['g is continuous at x = ' + n(s) + ', code 0', 'the discontinuity is removable, code 1', 'the discontinuity is a jump, code 2'][code]; return {
   prompt: `Mira certifies a thermostat in three checks. First, its dial reads T(x) = ${poly([[m, 'x'], [t0, '']])}: enter the largest δ such that |x − x₀| < δ always gives |T(x) − T(x₀)| < ${n(e)}. Second, its switch-over curve is g(x) = ${gl} for x < ${n(s)}, g(${n(s)}) = ${n(z)}, and g(x) = ${gr} for x > ${n(s)}: enter 0 if g is continuous at x = ${n(s)}, 1 if it has a removable discontinuity there, or 2 if it has a jump discontinuity. Third, enter the smallest Lipschitz constant of h(x) = ${fx} on [${n(a)}, ${n(b)}].`,
   answer: [d, code, K],
   hints: ['A straight line changes by the size of its slope times the change in x, so δ is ε divided by the size of the slope.', 'Compare the left-hand limit, the right-hand limit and the value at the switch: different one-sided limits make a jump; equal limits with a different value make a removable discontinuity.', 'For x² + px, h(x) − h(y) = (x − y)(x + y + p), so the constant is the supremum of |x + y + p| over the interval.'],
   solution: `|T(x) − T(x₀)| = ${n(Math.abs(m))}|x − x₀|, which is below ${n(e)} exactly when |x − x₀| < ${n(e)} ÷ ${n(Math.abs(m))} = ${n(d)}, so the largest δ is ${n(d)}. For g, the left-hand limit at ${n(s)} is ${n(s * s)}${tail(u, '')} = ${n(left)}, the right-hand limit is ${n(v)} × ${n(s)}${tail(w, '')} = ${n(right)}, and g(${n(s)}) = ${n(z)}: ${verdict}. For h, h(x) − h(y) = (x − y)(${sm}), and on [${n(a)}, ${n(b)}] the sum comes as close as you like to ${n(2 * a + p)} and ${n(2 * b + p)}, so the smallest Lipschitz constant is ${n(K)}.`,
   guidance: [
    { prompt: `T(x) − T(x₀) = ${n(m)}(x − x₀). What is the largest δ that makes |T(x) − T(x₀)| < ${n(e)} whenever |x − x₀| < δ?`, answer: [d], explanation: `|T(x) − T(x₀)| = ${n(Math.abs(m))}|x − x₀| < ${n(e)} exactly when |x − x₀| < ${n(e)} ÷ ${n(Math.abs(m))} = ${n(d)}. Any larger δ lets in an x with an error of ${n(e)} or more.` },
    { prompt: `What does g(x) approach as x approaches ${n(s)} from the left?`, answer: [left], explanation: `For x < ${n(s)}, g(x) = ${gl}, which approaches ${n(s * s)}${tail(u, '')} = ${n(left)}.` },
    { prompt: `What does g(x) approach as x approaches ${n(s)} from the right?`, answer: [right], explanation: `For x > ${n(s)}, g(x) = ${gr}, which approaches ${n(v)} × ${n(s)}${tail(w, '')} = ${n(right)}.` },
    { prompt: `The one-sided limits are ${n(left)} and ${n(right)}, and g(${n(s)}) = ${n(z)}. Enter the code: 0 continuous, 1 removable, 2 jump.`, answer: [code], explanation: `${left !== right ? 'The one-sided limits differ, so the discontinuity is a jump' : z !== left ? 'The limit exists and equals ' + n(left) + ', but g(' + n(s) + ') is ' + n(z) + ', so the discontinuity is removable' : 'The limit exists and equals the value g(' + n(s) + '), so g is continuous there'}: code ${n(code)}.` },
    { prompt: `h(x) − h(y) = (x − y)(${sm}). On [${n(a)}, ${n(b)}], what is the supremum of |${sm}|?`, answer: [K], explanation: `The sum comes as close as you like to ${n(2 * a + p)} and ${n(2 * b + p)} and lies between them, so the supremum of its size is ${n(K)}.` }
   ] }; }
 },
 /* kind 'abs': f(x) = a|x − c| + bx + d0 (one-sided limits b − a and b + a, never differentiable, a ≥ 1). kind 'pw':
    x² + px + q left of c, mx + r from c on, with r chosen so the pieces meet (one-sided limits 2c + p and m). */
 q24: {
  canonical: { kind: 'pw', c: 2, p: -1, q: 3, m: 3, a: 0, b: 0, d0: 0 },
  draw: R => { for (let i = 0; i < 1000; i++) { const c = R.int(1, 4);
   if (R.int(0, 2) === 0) { const a = R.int(1, 4), b = R.int(-3, 3), d0 = R.int(0, 9); if (a === 3 && b === 2 && c === 1 && d0 === 0) continue; return { kind: 'abs', c, p: 0, q: 0, m: 0, a, b, d0 }; }
   const p = R.int(-4, 4), q = R.int(0, 6), L = 2 * c + p, m = R.bool() ? L : L + R.nz(-3, 3);
   if (m === 0) continue; return { kind: 'pw', c, p, q, m, a: 0, b: 0, d0: 0 }; }
   return { kind: 'pw', c: 2, p: -1, q: 3, m: 3, a: 0, b: 0, d0: 0 }; },
  build: ({ kind, c, p, q, m, a, b, d0 }) => { let fx, left, right, diff, quot, fc, hint1, work;
   if (kind === 'abs') { left = b - a; right = b + a; fc = b * c + d0;
    fx = `${a === 1 ? '' : n(a)}|x − ${n(c)}|${tail(b, 'x')}${tail(d0, '')}`;
    diff = `${a === 1 ? '' : n(a)}|h|${tail(b, 'h')}`; quot = `${a === 1 ? '' : n(a)}|h| ÷ h${tail(b, '')}`;
    hint1 = 'Write f(c + h) − f(c) with |h| in it. For h > 0, |h| = h; for h < 0, |h| = −h.';
    work = `f(${n(c)} + h) − f(${n(c)}) = ${diff}, so the quotient is ${quot}. For h < 0, |h| ÷ h = −1 and the quotient is ${n(left)}; for h > 0, |h| ÷ h = 1 and it is ${n(right)}.`;
   } else { const r = c * c + p * c + q - m * c, k = 2 * c + p; left = k; right = m; fc = m * c + r;
    fx = `${poly([[1, 'x²'], [p, 'x'], [q, '']])} for x < ${n(c)}, and f(x) = ${poly([[m, 'x'], [r, '']])} for x ≥ ${n(c)} (the two pieces meet at x = ${n(c)})`;
    hint1 = 'For h < 0 the point c + h is on the left piece, and for h > 0 on the right piece. f(c) itself comes from the piece for x ≥ c.';
    work = `f(${n(c)}) = ${n(fc)}. For h > 0, f(${n(c)} + h) − f(${n(c)}) = ${poly([[m, 'h']])}, so the quotient is ${n(m)}. For h < 0, f(${n(c)} + h) − f(${n(c)}) = h²${tail(k, 'h')}, so the quotient is h${tail(k, '')}, which approaches ${n(k)}.`; }
   const ok = left === right ? 1 : 0; return {
   prompt: `A pressure gauge in the workshop reads f(x) = ${fx}. At x = ${n(c)}, the difference quotient (f(${n(c)} + h) − f(${n(c)})) ÷ h compares the reading at a nearby setting with the reading at ${n(c)}. Enter its limit as h approaches 0 from the left (h < 0), then its limit as h approaches 0 from the right (h > 0), then 1 if f is differentiable at x = ${n(c)}, 0 if not.`,
   answer: [left, right, ok],
   hints: [hint1, 'f is differentiable at c exactly when the two one-sided limits are equal; the derivative is then their common value.'],
   solution: `${work} The one-sided limits are ${n(left)} and ${n(right)}. ${ok ? `They agree, so the difference quotient has the limit ${n(left)} and f is differentiable at x = ${n(c)} with f′(${n(c)}) = ${n(left)}: enter 1.` : `They differ, so the difference quotient has no limit as h approaches 0: f is not differentiable at x = ${n(c)}, and the answer is 0.`}`,
   guidance: [
    { prompt: `Take h < 0, so ${n(c)} + h is just left of ${n(c)}. What does (f(${n(c)} + h) − f(${n(c)})) ÷ h approach as h approaches 0?`, answer: [left], explanation: kind === 'abs' ? `For h < 0, f(${n(c)} + h) − f(${n(c)}) = ${diff} with |h| = −h, so the quotient is ${n(left)} for every such h.` : `For h < 0 the left piece applies: the difference is h²${tail(left, 'h')}, so the quotient is h${tail(left, '')}, which approaches ${n(left)}.` },
    { prompt: `Now take h > 0. What does the quotient approach?`, answer: [right], explanation: kind === 'abs' ? `For h > 0, |h| = h and the quotient is ${n(right)} for every such h.` : `For h > 0 the right piece applies: the difference is ${poly([[m, 'h']])}, so the quotient is ${n(m)}.` },
    { prompt: `The one-sided limits are ${n(left)} and ${n(right)}. Enter 1 if f is differentiable at x = ${n(c)}, 0 if not.`, answer: [ok], explanation: ok ? `Both sides give ${n(left)}, so the limit exists and f′(${n(c)}) = ${n(left)}.` : `The two sides disagree, so the quotient has no single limit and f has a corner at x = ${n(c)}: not differentiable.` }
   ] }; }
 },
 /* f(x) = x³ + px² + qx on [a, b] from the MVT table: the average slope S, and the one c in (a, b) with f′(c) = S. The
    other root of 3c² + 2pc + q = S is −2p ÷ 3 − c. Not the worked example (x³ on [−1, 2]). */
 q25: {
  canonical: { p: -3, q: 1, a: 0, b: 3 },
  draw: R => { const t = R.pick(MVT); return { p: t.p, q: R.int(-5, 5), a: t.a, b: t.b }; },
  build: ({ p, q, a, b }) => { const f = x => x * x * x + p * x * x + q * x, fa = f(a), fb = f(b), S = (fb - fa) / (b - a);
   const D = 4 * p * p - 12 * (q - S), r1 = (-2 * p + Math.sqrt(D)) / 6, r2 = (-2 * p - Math.sqrt(D)) / 6, c = r1 > a && r1 < b ? r1 : r2, o = r1 === c ? r2 : r1;
   const fx = poly([[1, 'x³'], [p, 'x²'], [q, 'x']]), dfx = poly([[3, 'x²'], [2 * p, 'x'], [q, '']]), eq = poly([[3, 'c²'], [2 * p, 'c'], [q, '']]); return {
   prompt: `A gauge needle sits at f(x) = ${fx} for settings x from ${n(a)} to ${n(b)}. f is a polynomial, so it is continuous on [${n(a)}, ${n(b)}] and differentiable between ${n(a)} and ${n(b)}. Enter the average slope (f(${n(b)}) − f(${n(a)})) ÷ (${n(b)} − ${par(a)}), then the point c strictly between ${n(a)} and ${n(b)} where f′(c) equals that slope, as the mean value theorem promises. Here there is exactly one such c.`,
   answer: [S, c],
   hints: ['Work out f at both ends, subtract, and divide by the length of the interval.', 'Differentiate, set f′(c) equal to the average slope, and solve the quadratic. Keep the solution that lies strictly between the two ends.'],
   solution: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}, so the average slope is (${n(fb)} − ${par(fa)}) ÷ ${n(b - a)} = ${n(S)}.${S === 0 ? ' Here f takes the same value at both ends, so this is Rolle’s theorem: some c has f′(c) = 0.' : ''} f′(x) = ${dfx}, so c must solve ${eq} = ${n(S)}. Its solutions are ${n(c)} and ${n(o).includes('.') ? 'about ' + n(Math.round(o * 100) / 100) : n(o)}; only ${n(c)} lies strictly between ${n(a)} and ${n(b)}, so c = ${n(c)}.`,
   guidance: [
    { prompt: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}. What is the average slope over [${n(a)}, ${n(b)}]?`, answer: [S], explanation: `(${n(fb)} − ${par(fa)}) ÷ (${n(b)} − ${par(a)}) = ${n(fb - fa)} ÷ ${n(b - a)} = ${n(S)}.` },
    { prompt: `f′(x) = ${dfx}. Solve ${eq} = ${n(S)}. Which solution lies strictly between ${n(a)} and ${n(b)}?`, answer: [c], explanation: `The solutions are ${n(c)} and ${n(o).includes('.') ? 'about ' + n(Math.round(o * 100) / 100) : n(o)}. Only ${n(c)} is inside the interval, and f′(${n(c)}) = ${n(S)}, the average slope.` }
   ] }; }
 },
 /* |f′| ≤ M on [a, b], f(a) = r0: the change is at most M(b − a), reached by r0 ± M(t − a). Prices in tenths. */
 q26: {
  canonical: { M: 4, a: 2, b: 7, r0: 35 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = { M: R.int(2, 25), a: R.int(0, 4), r0: R.int(20, 80) }; p.b = p.a + R.int(2, 9);
   if (p.M === 5 && p.a === 0 && p.b === 6) continue; if (p.r0 * 10 - p.M * (p.b - p.a) <= 0) continue; return p; } return { M: 4, a: 2, b: 7, r0: 35 }; },
  build: ({ M, a, b, r0 }) => { const m = M / 10, len = b - a, X = M * len / 10, lo = (r0 * 10 - M * len) / 10, hi = (r0 * 10 + M * len) / 10; return {
   prompt: `A pressure gauge drifts while it warms up. From t = ${n(a)} to t = ${n(b)} hours its reading f(t), in kilopascals, changes smoothly (f is differentiable), and the drift rate never exceeds ${n(m)} in size: |f′(t)| ≤ ${n(m)} kilopascals per hour. At t = ${n(a)} the gauge reads ${n(r0)}. Enter the largest possible change |f(${n(b)}) − f(${n(a)})|, then the lowest and the highest readings the gauge could show at t = ${n(b)}.`,
   answer: [X, lo, hi],
   hints: ['The mean value theorem writes the change as f′(c) × (the length of the time interval) for some c in between. Bound |f′(c)| by the drift limit.', 'From where it started, the reading can move down or up by at most that largest change.'],
   solution: `By the mean value theorem, f(${n(b)}) − f(${n(a)}) = f′(c) × (${n(b)} − ${n(a)}) for some c between ${n(a)} and ${n(b)}, so |f(${n(b)}) − f(${n(a)})| ≤ ${n(m)} × ${n(len)} = ${n(X)} kilopascals. The readings f(t) = ${n(r0)} + ${n(m)}(t − ${n(a)}) and f(t) = ${n(r0)} − ${n(m)}(t − ${n(a)}) obey the drift limit and change by exactly ${n(X)}, so no smaller bound is safe. At t = ${n(b)} the reading lies between ${n(r0)} − ${n(X)} = ${n(lo)} and ${n(r0)} + ${n(X)} = ${n(hi)}.`,
   guidance: [
    { prompt: `The time interval has length ${n(b)} − ${n(a)} = ${n(len)} hours, and |f′| ≤ ${n(m)}. What is the largest possible change |f(${n(b)}) − f(${n(a)})|?`, answer: [X], explanation: `The mean value theorem gives |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)}.` },
    { prompt: `The gauge started at ${n(r0)}. What is the lowest reading it could show at t = ${n(b)}?`, answer: [lo], explanation: `It can fall by at most ${n(X)}: ${n(r0)} − ${n(X)} = ${n(lo)}.` },
    { prompt: `And the highest reading at t = ${n(b)}?`, answer: [hi], explanation: `It can rise by at most ${n(X)}: ${n(r0)} + ${n(X)} = ${n(hi)}.` }
   ] }; }
 },
 /* Lagrange remainder bound for degree n0 in lowest terms, then the smallest degree with bound < ε. Not the worked
    example (sin x at x = 1, degree 3, ε = 0.01). */
 q27: {
  canonical: { fn: 'exp', x: 1, n0: 4, e: 0.0001 },
  draw: R => taylorDraw(R, p => p.fn === 'sin' && p.x === 1 && p.n0 === 3 && p.e === 0.01) || { fn: 'exp', x: 1, n0: 4, e: 0.0001 },
  build: ({ fn, x, n0, e }) => { const t = taylor({ fn, x, n0, e }), k = n0 + 1; return {
   prompt: `The gauge workshop approximates ${FN[fn]} at x = ${n(x)} by its Taylor polynomial of degree n about 0. By Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${taylorSetup(fn, x)}. Enter this bound for degree ${n(n0)} as a fraction in lowest terms, numerator then denominator (type them without commas), then the smallest degree n for which the bound is below ${n(e)}.`,
   answer: [t.num, t.den, t.N],
   hints: ['For degree n the bound has (n + 1)! underneath and the power n + 1 of x on top. Cancel common factors to reach lowest terms.', 'The bound shrinks as the degree grows. Try degrees one after another until it first drops below ε.'],
   solution: `For degree ${n(n0)}, k = n + 1 = ${n(k)}, so the bound is ${x === 1 ? n(t.M) : `${t.M === 1 ? '' : n(t.M) + ' × '}${n(x)}${sup(k)}`} ÷ ${n(k)}! = ${n(t.raw)} ÷ ${n(t.den0)} = ${n(t.num)}/${n(t.den)} in lowest terms. ${degreeWork(t, x, e)}`,
   guidance: [
    { prompt: `For degree ${n(n0)} the bound is ${n(t.raw)} ÷ ${n(k)}!, and ${n(k)}! = ${n(t.den0)}. In lowest terms, what is the numerator?`, answer: [t.num], explanation: `${n(t.raw)} and ${n(t.den0)} have highest common factor ${n(gcd(t.raw, t.den0))}, so ${n(t.raw)} ÷ ${n(t.den0)} = ${n(t.num)}/${n(t.den)}.` },
    { prompt: `And the denominator in lowest terms?`, answer: [t.den], explanation: `${n(t.den0)} ÷ ${n(gcd(t.raw, t.den0))} = ${n(t.den)}.` },
    { prompt: `What is the smallest degree n whose bound is below ${n(e)}?`, answer: [t.N], explanation: degreeWork(t, x, e) }
   ] }; }
 },
 /* f(x) = x³ + bx + c0 or x⁵ + bx + c0 with b ≥ 1, strictly increasing; x0 a whole number with f′(x0) ≥ 2. Not the worked
    example (x³ + x at y = 10). */
 q28: {
  canonical: { deg: 3, b: 2, c0: 1, x0: 2 },
  draw: R => { for (let i = 0; i < 1000; i++) { const deg = R.pick([3, 5]), p = { deg, b: R.int(1, deg === 3 ? 6 : 4), c0: R.int(-5, 5), x0: R.int(deg === 3 ? -3 : -2, deg === 3 ? 3 : 2) };
   const D = deg * Math.pow(p.x0, deg - 1) + p.b; if (D < 2 || (deg === 3 && p.b === 1 && p.c0 === 0 && p.x0 === 2)) continue; return p; } return { deg: 3, b: 2, c0: 1, x0: 2 }; },
  build: ({ deg, b, c0, x0 }) => { const P = deg === 3 ? '³' : '⁵', Q = deg === 3 ? '²' : '⁴', y = Math.pow(x0, deg) + b * x0 + c0, D = deg * Math.pow(x0, deg - 1) + b;
   const fx = poly([[1, 'x' + P], [b, 'x'], [c0, '']]), dfx = `${n(deg)}x${Q}${tail(b, '')}`; return {
   prompt: `A gauge turns a dial position x into a reading f(x) = ${fx}. Its derivative f′(x) = ${dfx} is positive, so f is strictly increasing and has an inverse function f⁻¹ that turns a reading back into a dial position. For the reading y = ${n(y)}, enter x₀ = f⁻¹(${n(y)}), then f′(x₀), then the derivative (f⁻¹)′(${n(y)}), as a fraction such as 1/7.`,
   answer: [x0, D, 1 / D],
   hints: ['Try small whole numbers for x until f(x) equals the reading; that x is the dial position f⁻¹ gives.', 'The inverse function theorem: (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀), provided f′(x₀) is not 0.'],
   solution: `f(${n(x0)}) = ${par(x0)}${P} + ${b === 1 ? '' : n(b) + ' × '}${par(x0)}${tail(c0, '')} = ${n(y)}, and f is strictly increasing, so no other x gives ${n(y)}: x₀ = ${n(x0)}. f′(${n(x0)}) = ${n(deg)} × ${par(x0)}${Q}${tail(b, '')} = ${n(D)}. By the inverse function theorem, (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)}) = 1/${n(D)}.`,
   guidance: [
    { prompt: `Which whole number x₀ gives f(x₀) = ${n(y)}?`, answer: [x0], explanation: `f(${n(x0)}) = ${n(y)}. Since f is strictly increasing, it is the only one.` },
    { prompt: `What is f′(${n(x0)})?`, answer: [D], explanation: `f′(${n(x0)}) = ${n(deg)} × ${par(x0)}${Q}${tail(b, '')} = ${n(D)}.` },
    { prompt: `What is (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)})? Enter it as a fraction.`, answer: [1 / D], explanation: `1 ÷ ${n(D)} = 1/${n(D)}. A small change in the reading moves the dial ${n(D)} times less.` }
   ] }; }
 },
 /* Review: an MVT bound M(b − a) (M in tenths) and the smallest Taylor degree for ε, as in q26 and q27. */
 q29: {
  canonical: { M: 3, a: 0, b: 8, fn: 'sin', x: 2, e: 0.001 },
  draw: R => { const t = taylorDraw(R, () => false) || { fn: 'sin', x: 2, e: 0.001 }; const a = R.int(0, 4);
   const p = { M: R.int(2, 25), a, b: a + R.int(2, 9), fn: t.fn, x: t.x, e: t.e };
   return p.M === 6 && p.a === 0 && p.b === 5 && p.fn === 'cos' && p.x === 1 && p.e === 0.001 ? { ...p, M: 7 } : p; },
  build: ({ M, a, b, fn, x, e }) => { const m = M / 10, len = b - a, X = M * len / 10, t = taylor({ fn, x, n0: 1, e }); return {
   prompt: `Mira signs off a drifting gauge in two parts. First, from t = ${n(a)} to t = ${n(b)} hours its reading f(t) is differentiable with |f′(t)| ≤ ${n(m)} kilopascals per hour: enter the largest possible change |f(${n(b)}) − f(${n(a)})|. Second, its converter replaces ${FN[fn]} at x = ${n(x)} by the Taylor polynomial of degree n about 0, and by Taylor’s theorem with the Lagrange form of the remainder the error is at most ${fn === 'exp' ? '3' : x === 1 ? '1' : n(x) + 'ⁿ⁺¹'} ÷ (n + 1)!${fn === 'exp' ? ' (every derivative of eˣ is eˣ, and eᶜ < 3 for c between 0 and 1)' : ' (every derivative is ±sin x or ±cos x, at most 1 in size)'}: enter the smallest degree n that makes this bound less than ${n(e)}.`,
   answer: [X, t.N],
   hints: ['The mean value theorem: the change is f′(c) times the length of the time interval, for some c in between.', 'The remainder bound shrinks as the degree grows; try degrees in turn until it first drops below ε.'],
   solution: `By the mean value theorem, |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)} kilopascals, and a reading that drifts at exactly ${n(m)} per hour reaches it. ${degreeWork(t, x, e)}`,
   guidance: [
    { prompt: `The interval is ${n(len)} hours long and |f′| ≤ ${n(m)}. What is the largest possible change?`, answer: [X], explanation: `${n(m)} × ${n(len)} = ${n(X)}.` },
    { prompt: `What is the smallest degree n whose remainder bound is below ${n(e)}?`, answer: [t.N], explanation: degreeWork(t, x, e) }
   ] }; }
 },
 /* L(P, f) and U(P, f) for a monotone f on a partition with whole-number points (3 or 4 pieces of length 1 to 2); both sums
    below 1000. Not the worked example (2x + 1 on {0, 1, 2, 4}). */
 q30: {
  canonical: { kind: 'sq+', s: 1, k: 1, pts: [0, 1, 3, 4] },
  draw: R => { for (let i = 0; i < 1000; i++) { const kind = R.pick(['sq+', 'sq−', 'lin+', 'lin−']), pts = [R.int(0, 2)], pieces = R.int(3, 4);
   for (let j = 0; j < pieces; j++) pts.push(pts[j] + R.int(1, 2)); const end = pts[pts.length - 1];
   const s = R.int(2, 4), k = kind === 'sq−' ? end * end + R.int(1, 10) : kind === 'lin−' ? s * end + R.int(1, 10) : R.int(0, 6);
   const p = { kind, s: kind.startsWith('lin') ? s : 1, k, pts }, z = sums30(p);
   if (z.U >= 1000 || (kind === 'lin+' && p.s === 2 && k === 1 && pts.join() === '0,1,2,4') || pts.every((v, j) => !j || v - pts[j - 1] === 1)) continue; return p; }
   return { kind: 'sq+', s: 1, k: 1, pts: [0, 1, 3, 4] }; },
  build: p => { const z = sums30(p), fx = fx30(p), a = p.pts[0], b = p.pts[p.pts.length - 1], f = z.pieces[0];
   const lw = z.pieces.map(q => `${n(q.inf)} × ${n(q.len)}`).join(' + '), uw = z.pieces.map(q => `${n(q.sup)} × ${n(q.len)}`).join(' + ');
   const each = z.pieces.map(q => `on [${n(q.l)}, ${n(q.r)}] the infimum is f(${n(q.lo)}) = ${n(q.inf)} and the supremum is f(${n(q.hi)}) = ${n(q.sup)}`).join('; '); return {
   prompt: `The fuel audit pins the fuel burned between two guaranteed totals. The burn rate is f(x) = ${fx} on [${n(a)}, ${n(b)}], where it is ${z.up ? 'increasing' : 'decreasing'}. Take the partition P = {${p.pts.map(n).join(', ')}}, which cuts the interval into ${n(z.pieces.length)} pieces; its mesh, the length of the longest piece, is ${n(z.mesh)}. Enter the lower sum L(P, f), then the upper sum U(P, f).`,
   answer: [z.L, z.U],
   hints: ['A monotone function takes its infimum and its supremum on each piece at the two ends of that piece. Decide which end gives which.', 'L(P, f) adds up infimum × length over the pieces; U(P, f) adds up supremum × length.'],
   solution: `f is ${z.up ? 'increasing, so on each piece the infimum is at the left end and the supremum at the right end' : 'decreasing, so on each piece the infimum is at the right end and the supremum at the left end'}: ${each}. L(P, f) = ${lw} = ${n(z.L)} and U(P, f) = ${uw} = ${n(z.U)}. Every lower sum is at most the true total and every upper sum at least it, so the fuel burned lies between ${n(z.L)} and ${n(z.U)}.`,
   guidance: [
    { prompt: `On the first piece, [${n(f.l)}, ${n(f.r)}], what is the infimum of f?`, answer: [f.inf], explanation: `f is ${z.up ? 'increasing, so its smallest value on the piece is at the left end' : 'decreasing, so its smallest value on the piece is at the right end'}: f(${n(f.lo)}) = ${n(f.inf)}.` },
    { prompt: 'Add infimum × length over all the pieces. What is L(P, f)?', answer: [z.L], explanation: `L(P, f) = ${lw} = ${n(z.L)}.` },
    { prompt: 'Add supremum × length over all the pieces. What is U(P, f)?', answer: [z.U], explanation: `U(P, f) = ${uw} = ${n(z.U)}.` }
   ] }; }
 }
});
})();
