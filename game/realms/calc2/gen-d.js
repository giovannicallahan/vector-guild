/* Calculus 2: accumulation mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Superscript digits: sup(3) is '³'; sup(1) is '' (a power of 1 is not written). */
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => k === 1 ? '' : String(k).split('').map(d => SUP[d]).join('');
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
/* A fraction num/den in lowest terms, sign on the numerator: { num, den, v }. ft() writes it: '−1/64', '3'. */
const fr = (num, den) => { const g = gcd(num, den) || 1, s = den < 0 ? -1 : 1; return { num: s * num / g, den: s * den / g, v: num / den }; };
const ft = f => f.den === 1 ? n(f.num) : `${f.num < 0 ? '−' : ''}${Math.abs(f.num)}/${f.den}`;
/* n to the power k with a coefficient c that is not written when it is 1: mono(3, 2) is '3n²', mono(1, 1) is 'n'. */
const mono = (c, k, v = 'n') => `${c === 1 ? '' : n(c)}${v}${sup(k)}`;
/* A value rounded to 4 decimal places; tie() is true when the 5th decimal makes the rounding a coin toss. */
const r4 = x => Math.round(x * 1e4) / 1e4;
/* A value shown cut after 4 decimals, with the 5th decimal named: '2.0493… (the next decimal is 7)'. Exact short values are shown as they are. */
const four = x => { const a = Math.abs(x), s = x < 0 ? '−' : ''; if (Math.abs(a * 1e4 - Math.round(a * 1e4)) < 1e-7) return s + String(Math.round(a * 1e4) / 1e4);
 return `${s}${(Math.floor(a * 1e4 + 1e-9) / 1e4).toFixed(4)}… (the next decimal is ${Math.floor(a * 1e5 + 1e-9) % 10})`; };
/* A small positive bound b written as 'about 1 ÷ K'. */
const oneOver = b => `about 1 ÷ ${Math.round(1 / b)}`;
const tie = x => Math.abs(Math.abs(x * 1e4) % 1 - 0.5) < 1e-6;
/* q39: true when x is within 0.15 of a step of a 4-place rounding tie, so adding terms rounded to 5 places could round the other way. */
const near4 = x => Math.abs(Math.abs(x * 1e4) % 1 - 0.5) < 0.15;

/* q31: two p-series. pd (1/2 or 1) diverges, pc (2, 3 or 5) converges; swap puts the convergent one first (echo A). */
const pTerm = p => p === 0.5 ? '1 ÷ √n' : `1 ÷ n${sup(p)}`;
const pName = p => p === 0.5 ? '1/2' : n(p);
const pAnti = p => p === 2 ? '−1 ÷ x' : `−1 ÷ (${n(p - 1)}x${sup(p - 1)})`;
const pTail = (p, N) => p === 2 ? `1 ÷ ${n(N)}` : `1 ÷ (${n(p - 1)} × ${n(Math.pow(N, p - 1))})`;
const TAILS = [[2, 4], [2, 5], [2, 8], [2, 10], [2, 20], [2, 25], [3, 5], [3, 10], [5, 5]];

/* q33: the first few pulses of Σ (−1)ⁿ⁺¹ ÷ nᵖ, and m^p written as a power. */
const altStart = p => [1, 2, 3, 4].map(k => k === 1 ? '1' : `1/${Math.pow(k, p)}`).reduce((s, t, i) => i ? `${s} ${i % 2 ? '−' : '+'} ${t}` : t, '') + ' + …';
const pw = (m, p) => p === 1 ? n(m) : `${n(m)}${sup(p)}`;

/* q34: three families. fact: (2n)! ÷ ((n!)² × bⁿ), L = 4/b. pow: nᵏ × aⁿ ÷ bⁿ, L = a/b. root: ((an + 1) ÷ (bn + 2))ⁿ, L = a/b. */
const q34L = p => p.fam === 'fact' ? fr(4, p.b) : fr(p.a, p.b);
const q34Term = p => p.fam === 'fact' ? `(2n)! ÷ ((n!)² × ${n(p.b)}ⁿ)` : p.fam === 'pow' ? `${mono(1, p.k)} × ${n(p.a)}ⁿ ÷ ${n(p.b)}ⁿ` : `((${n(p.a)}n + 1) ÷ (${n(p.b)}n + 2))ⁿ`;

/* q35: (x − c) written with the sign of c; c = 0 gives x. */
const xc = c => c === 0 ? 'x' : `(x ${c < 0 ? '+' : '−'} ${n(Math.abs(c))})`;
const absxc = c => c === 0 ? '|x|' : `|x ${c < 0 ? '+' : '−'} ${n(Math.abs(c))}|`;

/* q36: f(a), f′(a), f″(a), f‴(a) as fractions for √x about a = s², 1 ÷ x about a, and ln x about 1. */
const q36Data = ({ f, a }) => {
 if (f === 'sqrt') { const s = Math.round(Math.sqrt(a)); return { name: '√x', d: [fr(s, 1), fr(1, 2 * s), fr(-1, 4 * s * s * s), fr(3, 8 * Math.pow(s, 5))],
  dtext: ['f′(x) = 1 ÷ (2√x)', 'f″(x) = −1 ÷ (4x√x)', 'f‴(x) = 3 ÷ (8x²√x)'] }; }
 if (f === 'inv') return { name: '1 ÷ x', d: [fr(1, a), fr(-1, a * a), fr(2, a * a * a), fr(-6, Math.pow(a, 4))], dtext: ['f′(x) = −1 ÷ x²', 'f″(x) = 2 ÷ x³', 'f‴(x) = −6 ÷ x⁴'] };
 return { name: 'ln x', d: [fr(0, 1), fr(1, 1), fr(-1, 1), fr(2, 1)], dtext: ['f′(x) = 1 ÷ x', 'f″(x) = −1 ÷ x²', 'f‴(x) = 2 ÷ x³'] };
};
const PRIME = ['f', 'f′', 'f″', 'f‴'];
/* The Taylor polynomial written out: '2 + (x − 4) ÷ 4 − (x − 4)² ÷ 64'. */
const polyText = (cs, a) => { const xa = `(x − ${n(a)})`; let s = cs[0].num === 0 ? '' : ft(cs[0]);
 for (let k = 1; k < cs.length; k++) { const c = cs[k], mag = Math.abs(c.num), body = `${mag === 1 ? '' : n(mag)}${xa}${sup(k)}${c.den === 1 ? '' : ` ÷ ${n(c.den)}`}`;
  s = s === '' ? (c.num < 0 ? `−${body}` : body) : `${s} ${c.num < 0 ? '−' : '+'} ${body}`; }
 return s; };

/* q37: the series each function comes from, and the function written with its scale k. */
const q37Fn = ({ f, k }) => { const u = k === 1 ? 'x' : k === -1 ? '−x' : `${n(k)}x`;
 if (f === 'exp') return k === 1 ? 'eˣ' : `e^(${u})`;
 if (f === 'geo') return k === 1 ? '1 ÷ (1 − x)' : k < 0 ? `1 ÷ (1 + ${k === -1 ? 'x' : `${n(-k)}x`})` : `1 ÷ (1 − ${u})`;
 return k === 1 ? `${f} x` : `${f}(${u})`; };
const q37Series = { exp: 'eᵘ = 1 + u + u²/2! + u³/3! + u⁴/4! + …', sin: 'sin u = u − u³/3! + u⁵/5! − u⁷/7! + …', cos: 'cos u = 1 − u²/2! + u⁴/4! − u⁶/6! + …', geo: '1 ÷ (1 − u) = 1 + u + u² + u³ + …' };
const q37Coef = ({ f, k, m }) => { const km = Math.pow(k, m); if (f === 'geo') return { km, sign: 1, den: 1, c: fr(km, 1) };
 const sign = f === 'sin' ? ((m - 1) / 2 % 2 ? -1 : 1) : f === 'cos' ? (m / 2 % 2 ? -1 : 1) : 1; return { km, sign, den: fact(m), c: fr(sign * km, fact(m)) }; };

/* q38: the bound M|x|ⁿ⁺¹ ÷ (n + 1)! for degree n, and the smallest degree that brings it below eps. */
const q38M = f => f === 'exp' ? 3 : 1;
const q38Bound = (f, x, d) => q38M(f) * Math.pow(x, d + 1) / fact(d + 1);
const q38Deg = ({ f, x0, eps }) => { let d = 0; while (q38Bound(f, x0, d) >= eps) d++; return d; };
const q38Fn = ({ f, x0 }) => f === 'exp' ? `e^(${n(x0)})` : `${f}(${n(x0)})`;
const q38Line = (f, x, d) => `${q38M(f) === 3 ? '3 × ' : ''}${n(x)}${sup(d + 1)} ÷ ${n(d + 1)}! = ${q38M(f) === 3 ? '3 × ' : ''}${n(x)}${sup(d + 1)} ÷ ${n(fact(d + 1))}, ${oneOver(q38Bound(f, x, d))}`;

/* q39: the j-th term of the integrated series is (−1)ʲ bᵈ ÷ D with d = 2j + 1: D = d × j! (e^(−x²)) or d × d! (sin(x) ÷ x). */
const q39Den = (f, j) => f === 'gauss' ? (2 * j + 1) * fact(j) : (2 * j + 1) * fact(2 * j + 1);
const q39Terms = ({ f, b, k }) => Array.from({ length: k + 1 }, (_, j) => (j % 2 ? -1 : 1) * Math.pow(b, 2 * j + 1) / q39Den(f, j));
const q39Text = ({ f, b, k }) => Array.from({ length: k }, (_, j) => { const body = j === 0 ? n(b) : `${n(b)}${sup(2 * j + 1)}/${n(q39Den(f, j))}`; return j === 0 ? body : `${j % 2 ? '−' : '+'} ${body}`; }).join(' ');
const q39Series = { gauss: 'e^(−x²) = 1 − x² + x⁴/2! − x⁶/3! + …', sinc: 'sin(x) ÷ x = 1 − x²/3! + x⁴/5! − x⁶/7! + …' };
const q39Fn = f => f === 'gauss' ? 'e^(−x²)' : 'sin(x) ÷ x';

/* q40: x(t) = 3ct² + p, y(t) = c(t³ − 3t) + q. dx/dt = 6ct, dy/dt = 3c(t² − 1), speed 3c(t² + 1). */
const q40X = ({ c, p }) => `${n(3 * c)}t²${p ? ` ${p < 0 ? '−' : '+'} ${n(Math.abs(p))}` : ''}`;
const q40Y = ({ c, q }) => `${c === 1 ? '' : n(c)}t³ − ${n(3 * c)}t${q ? ` ${q < 0 ? '−' : '+'} ${n(Math.abs(q))}` : ''}`;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Not the worked example (Σ 1 ÷ n², tail after 4 terms). The tail bound always has at most 4 decimals. */
 q31: {
  canonical: { pd: 1, pc: 3, N: 10, swap: false },
  draw: R => { let p; do { const [pc, N] = R.pick(TAILS); p = { pd: R.pick([0.5, 1]), pc, N, swap: R.bool() }; } while (p.pc === 2 && p.N === 4); return p; },
  build: ({ pd, pc, N, swap }) => { const pA = swap ? pc : pd, pB = swap ? pd : pc, cA = swap ? 1 : 0, cB = swap ? 0 : 1, int1 = 1 / (pc - 1), tail = 1 / ((pc - 1) * Math.pow(N, pc - 1)),
   name = swap ? 'A' : 'B', other = swap ? 'B' : 'A',
   divWhy = pd === 1 ? 'the integral of 1 ÷ x from 1 to b is ln b, which grows without bound' : 'the integral of 1 ÷ √x from 1 to b is 2√b − 2, which grows without bound'; return {
   prompt: `The signal lab adds up the echoes of two test pings. Echo A returns pulses of strength aₙ = ${pTerm(pA)} and echo B pulses of strength bₙ = ${pTerm(pB)}, for n = 1, 2, 3, … without end. Use the integral test: enter 1 if the series of echo A converges and 0 if it diverges, then the same for echo B. Then, for the echo whose series converges, enter the integral bound on its tail after the first ${n(N)} pulses: the integral of its formula from x = ${n(N)} to ∞.`,
   answer: [cA, cB, tail],
   hints: ['Both are p-series, Σ 1 ÷ nᵖ. By the integral test each one does what the integral of 1 ÷ xᵖ from 1 to ∞ does, and that integral is finite only when p > 1.', `The tail after ${n(N)} terms is smaller than the integral of the same formula from x = ${n(N)} to ∞. An antiderivative of 1 ÷ xᵖ is x^(1 − p) ÷ (1 − p).`],
   solution: `Echo A is the p-series with p = ${pName(pA)} and echo B the one with p = ${pName(pB)}. Their terms are positive and shrink, so the integral test applies: Σ 1 ÷ nᵖ converges exactly when the integral of 1 ÷ xᵖ from 1 to ∞ is finite, which is when p > 1. For echo ${other}, ${divWhy}, so its series diverges. Echo ${name} has p = ${n(pc)} > 1, so its series converges. So the answers are ${cA} for echo A and ${cB} for echo B. The tail of echo ${name} after ${n(N)} terms is less than the integral of 1 ÷ x${sup(pc)} from ${n(N)} to ∞: [${pAnti(pc)}] from ${n(N)} to ∞ = 0 + ${pTail(pc, N)} = ${n(tail)}.`,
   guidance: [
    { prompt: `Echo A has p = ${pName(pA)} and echo B has p = ${pName(pB)}. A p-series converges when p > 1 and diverges otherwise. Enter 1 or 0 for echo A, then for echo B.`, answer: [cA, cB], explanation: `p = ${n(pc)} is greater than 1, so echo ${name} converges; p = ${pName(pd)} is not, so echo ${other} diverges.` },
    { prompt: `For the convergent echo, work out the integral of 1 ÷ x${sup(pc)} from x = 1 to ∞. An antiderivative is ${pAnti(pc)}.`, answer: [int1], explanation: `[${pAnti(pc)}] from 1 to ∞ is 0 − (${pc === 2 ? '−1' : `−1 ÷ ${n(pc - 1)}`}) = ${n(int1)}. The integral is finite, which is what the integral test needs.` },
    { prompt: `Now take the same integral from x = ${n(N)} to ∞. It bounds everything after the first ${n(N)} terms.`, answer: [tail], explanation: `[${pAnti(pc)}] from ${n(N)} to ∞ = 0 + ${pTail(pc, N)} = ${n(tail)}. Adding the first ${n(N)} terms leaves less than ${n(tail)} still to come.` }
   ] }; }
 },
 /* aₙ = (Anʲ + B) ÷ (Cnʲ⁺ᵈ + D) against bₙ = 1 ÷ nᵈ: the limit is A ÷ C (C chosen so it ends within 3 decimals); d >= 2 converges. */
 q32: {
  canonical: { A: 3, B: 2, C: 4, D: 5, j: 1, d: 2 },
  draw: R => { let p; do { p = { A: R.int(2, 9), B: R.int(1, 9), C: R.pick([2, 4, 5, 8]), D: R.int(1, 9), j: R.int(1, 2), d: R.int(1, 3) }; } while (p.A === 2 && p.C === 5 && p.j === 1 && p.d === 1); return p; },
  build: ({ A, B, C, D, j, d }) => { const L = A / C, conv = d >= 2 ? 1 : 0, top = j + d, bn = `1 ÷ ${mono(1, d)}`; return {
   prompt: `A relay in the signal lab loses power in steps: step n costs aₙ = (${mono(A, j)} + ${n(B)}) ÷ (${mono(C, top)} + ${n(D)}) watts, for n = 1, 2, 3, … without end. Mira compares it with the p-series bₙ = ${bn}. Enter the limit of aₙ ÷ bₙ as n → ∞, then 1 if Σ aₙ converges and 0 if it diverges.`,
   answer: [L, conv],
   hints: [`Dividing by bₙ = ${bn} is the same as multiplying by ${mono(1, d)}. Then divide the top and the bottom by the highest power of n, ${mono(1, top)}.`, 'If the limit is a positive, finite number, the two series both converge or both diverge. A p-series Σ 1 ÷ nᵖ converges only when p > 1.'],
   solution: `aₙ ÷ bₙ = (${mono(A, j)} + ${n(B)}) × ${mono(1, d)} ÷ (${mono(C, top)} + ${n(D)}) = (${mono(A, top)} + ${mono(B, d)}) ÷ (${mono(C, top)} + ${n(D)}). Dividing the top and the bottom by ${mono(1, top)} gives (${n(A)} + ${n(B)} ÷ ${mono(1, j)}) ÷ (${n(C)} + ${n(D)} ÷ ${mono(1, top)}), which approaches ${n(A)} ÷ ${n(C)} = ${n(L)} as n → ∞. The limit is positive and finite, so by the limit comparison test Σ aₙ does what Σ ${bn} does. ${d === 1 ? 'That is the harmonic series, the p-series with p = 1, which diverges: enter 0.' : `That is a p-series with p = ${n(d)} > 1, which converges: enter 1.`}`,
   guidance: [
    { prompt: `Multiply aₙ by ${mono(1, d)} to get (${mono(A, top)} + ${mono(B, d)}) ÷ (${mono(C, top)} + ${n(D)}), then divide the top and the bottom by ${mono(1, top)}. What does it approach as n → ∞?`, answer: [L], explanation: `After dividing, every term except ${n(A)} on top and ${n(C)} below has a power of n underneath it and shrinks to 0, so the limit is ${n(A)} ÷ ${n(C)} = ${n(L)}.` },
    { prompt: `The limit ${n(L)} is positive and finite, so Σ aₙ behaves like Σ ${bn}. Enter 1 if that p-series converges, 0 if it diverges.`, answer: [conv], explanation: d === 1 ? 'Σ 1 ÷ n is the harmonic series (p = 1), which diverges, so Σ aₙ diverges too.' : `Σ ${bn} has p = ${n(d)} > 1, so it converges, and so does Σ aₙ.` }
   ] }; }
 },
 /* Σ (−1)ⁿ⁺¹ ÷ nᵖ. First answer: the bound after k terms, 1 ÷ (k + 1)ᵖ (at most 4 decimals). Second: the smallest N with (N + 1)ᵖ > M, where the error must be below 1 ÷ M. */
 q33: {
  canonical: { p: 2, k: 4, M: 1000 },
  draw: R => { let q; do { const p = R.pick([1, 2, 2, 3]);
   q = { p, k: R.pick(p === 1 ? [3, 4, 7, 9, 15, 19] : p === 2 ? [3, 4, 9] : [4, 9]), M: R.pick(p === 1 ? [10, 20, 50, 100, 200, 500] : [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000]) };
   } while (q.p === 1 && q.k === 3 && q.M === 100); return q; },
  build: ({ p, k, M }) => { const eps = 1 / M, bound = 1 / Math.pow(k + 1, p); let m = 1; while (Math.pow(m, p) <= M) m++; const N = m - 1, nt = p === 1 ? 'n' : `n${sup(p)}`; return {
   prompt: `A fading signal arrives as pulses that alternate in sign: ${altStart(p)}, the nth pulse being (−1)ⁿ⁺¹ ÷ ${nt}. The lab estimates the total with a partial sum. Enter the alternating series bound on the error after ${n(k)} terms, then the smallest number of terms N for which that bound is itself below ${n(eps)}.`,
   answer: [bound, N],
   hints: ['The terms alternate in sign and shrink towards 0, so the error of a partial sum is less than the size of the first term left out.', `With N terms the first term left out is 1 ÷ ${p === 1 ? '(N + 1)' : `(N + 1)${sup(p)}`}. It is below ${n(eps)} exactly when ${p === 1 ? 'N + 1' : `(N + 1)${sup(p)}`} > ${n(M)}.`],
   solution: `The pulses 1 ÷ ${nt} shrink towards 0 and alternate in sign, so by the alternating series test the series converges, and the remainder after a partial sum is smaller than the first term left out. After ${n(k)} terms that is term ${n(k + 1)}: 1 ÷ ${pw(k + 1, p)}${p === 1 ? '' : ` = 1 ÷ ${n(Math.pow(k + 1, p))}`} = ${n(bound)}. For the bound to be below ${n(eps)} we need 1 ÷ ${p === 1 ? '(N + 1)' : `(N + 1)${sup(p)}`} < ${n(eps)}, that is ${p === 1 ? 'N + 1' : `(N + 1)${sup(p)}`} > ${n(M)}. ${p === 1 ? `The smallest whole number above ${n(M)} is ${n(m)}` : `${pw(m - 1, p)} = ${n(Math.pow(m - 1, p))} is not enough and ${pw(m, p)} = ${n(Math.pow(m, p))} is`}, so N + 1 = ${n(m)} and N = ${n(N)} terms.`,
   guidance: [
    { prompt: `After ${n(k)} terms, the first term left out is term ${n(k + 1)}. What is its size, 1 ÷ ${pw(k + 1, p)}?`, answer: [bound], explanation: `1 ÷ ${pw(k + 1, p)}${p === 1 ? '' : ` = 1 ÷ ${n(Math.pow(k + 1, p))}`} = ${n(bound)}, so the partial sum of ${n(k)} terms is within ${n(bound)} of the total.` },
    { prompt: `With N terms the bound is 1 ÷ ${p === 1 ? '(N + 1)' : `(N + 1)${sup(p)}`}. For it to be below ${n(eps)}, ${p === 1 ? 'N + 1' : `(N + 1)${sup(p)}`} must be above 1 ÷ ${n(eps)} = ${n(M)}. What is the smallest whole number m with ${p === 1 ? 'm' : `m${sup(p)}`} > ${n(M)}?`, answer: [m], explanation: p === 1 ? `The smallest whole number above ${n(M)} is ${n(m)}.` : `${pw(m - 1, p)} = ${n(Math.pow(m - 1, p))} is not above ${n(M)}, but ${pw(m, p)} = ${n(Math.pow(m, p))} is, so m = ${n(m)}.` },
    { prompt: `That m is N + 1, the position of the first term left out. How many terms N must be added?`, answer: [N], explanation: `N = ${n(m)} − 1 = ${n(N)}. With ${n(N)} terms the first term left out is 1 ÷ ${pw(m, p)}, which is below ${n(eps)}.` }
   ] }; }
 },
 /* Ratio or root test. L is a fraction other than 1, entered in lowest terms; 1 when L < 1. */
 q34: {
  canonical: { fam: 'fact', b: 5 },
  draw: R => { const fam = R.pick(['fact', 'pow', 'root']);
   if (fam === 'fact') return { fam, b: R.pick([2, 3, 5, 6, 7, 8, 9]) };
   let a, b; do { a = R.int(2, 9); b = R.int(2, 9); } while (a === b || gcd(a, b) !== 1 || (fam === 'pow' && a === 3 && b === 2));
   return fam === 'pow' ? { fam, k: R.int(1, 3), a, b } : { fam, a, b }; },
  build: p => { const L = q34L(p), conv = L.v < 1 ? 1 : 0, test = p.fam === 'root' ? 'root' : 'ratio', verdict = conv ? `L = ${ft(L)} < 1, so the series converges: enter 1.` : `L = ${ft(L)} > 1, so the terms grow and the series diverges: enter 0.`;
   const work = p.fam === 'fact' ? `aₙ₊₁ ÷ aₙ = (2n + 2)! ÷ (2n)! × (n!)² ÷ ((n + 1)!)² ÷ ${n(p.b)} = (2n + 2)(2n + 1) ÷ ((n + 1)² × ${n(p.b)}) = 2(2n + 1) ÷ (${n(p.b)}(n + 1)) = (4n + 2) ÷ (${n(p.b)}n + ${n(p.b)}). Dividing the top and the bottom by n, this approaches 4 ÷ ${n(p.b)}`
    : p.fam === 'pow' ? `aₙ₊₁ ÷ aₙ = ${p.k === 1 ? '((n + 1) ÷ n)' : `((n + 1) ÷ n)${sup(p.k)}`} × ${n(p.a)} ÷ ${n(p.b)}, because one more factor of ${n(p.a)} ÷ ${n(p.b)} appears. As n → ∞, (n + 1) ÷ n = 1 + 1 ÷ n approaches 1, so the ratio approaches ${n(p.a)} ÷ ${n(p.b)}`
    : `The nth root of aₙ is (${n(p.a)}n + 1) ÷ (${n(p.b)}n + 2), because the power n undoes the root. Dividing the top and the bottom by n gives (${n(p.a)} + 1 ÷ n) ÷ (${n(p.b)} + 2 ÷ n), which approaches ${n(p.a)} ÷ ${n(p.b)}`;
   const hint1 = p.fam === 'fact' ? '(n + 1)! = (n + 1) × n! and (2n + 2)! = (2n + 2)(2n + 1) × (2n)!, so most of the factorials cancel in aₙ₊₁ ÷ aₙ.'
    : p.fam === 'pow' ? 'In aₙ₊₁ ÷ aₙ the powers aⁿ⁺¹ ÷ aⁿ leave one factor of the base, and (n + 1) ÷ n approaches 1.'
    : 'The nth root of (something)ⁿ is the something itself. Then divide its top and bottom by n.';
   return {
   prompt: `A relay tower’s error-correcting code adds up the terms aₙ = ${q34Term(p)} for n = 1, 2, 3, … without end. Use the ${test} test. Enter the limit L ${p.fam === 'root' ? 'of the nth root of aₙ' : 'of aₙ₊₁ ÷ aₙ'} as n → ∞ as a fraction in lowest terms, its numerator and then its denominator (a whole number has denominator 1), then 1 if the series converges and 0 if it diverges.`,
   answer: [L.num, L.den, conv],
   hints: [hint1, `The ${test} test: L < 1 means the series converges, L > 1 means it diverges, and L = 1 tells you nothing.`],
   solution: `${work} = ${ft(L)}. ${verdict}`,
   guidance: [
    { prompt: p.fam === 'fact' ? `Cancel the factorials: aₙ₊₁ ÷ aₙ = (2n + 2)(2n + 1) ÷ ((n + 1)² × ${n(p.b)}) = (4n + 2) ÷ (${n(p.b)}n + ${n(p.b)}). What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`
      : p.fam === 'pow' ? `aₙ₊₁ ÷ aₙ = ${p.k === 1 ? '((n + 1) ÷ n)' : `((n + 1) ÷ n)${sup(p.k)}`} × ${n(p.a)} ÷ ${n(p.b)}. What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`
      : `The nth root of aₙ is (${n(p.a)}n + 1) ÷ (${n(p.b)}n + 2). What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`,
     answer: [L.num, L.den], explanation: `${p.fam === 'fact' ? `Divide the top and the bottom by n: (4 + 2 ÷ n) ÷ (${n(p.b)} + ${n(p.b)} ÷ n) approaches 4 ÷ ${n(p.b)}` : p.fam === 'pow' ? `(n + 1) ÷ n approaches 1, so the ratio approaches ${n(p.a)} ÷ ${n(p.b)}` : `Divide the top and the bottom by n: (${n(p.a)} + 1 ÷ n) ÷ (${n(p.b)} + 2 ÷ n) approaches ${n(p.a)} ÷ ${n(p.b)}`}, which in lowest terms is ${ft(L)}.` },
    { prompt: `L = ${ft(L)}. Enter 1 if the ${test} test says the series converges, 0 if it says it diverges.`, answer: [conv], explanation: conv ? `${ft(L)} is less than 1, so the terms shrink at least as fast as a geometric series with ratio below 1: the series converges.` : `${ft(L)} is greater than 1, so in the long run each term is bigger than the one before: the series diverges.` }
   ] }; }
 },
 /* Σ (x − c)ⁿ ÷ (n × kⁿ) from n = 1: centre c, radius k, interval from c − k to c + k. */
 q35: {
  canonical: { c: 3, k: 4 },
  draw: R => { let p; do { p = { c: R.int(-5, 5), k: R.int(2, 6) }; } while (p.c === 0 || (p.c === -1 && p.k === 2)); return p; },
  build: ({ c, k }) => { const lo = c - k, hi = c + k; return {
   prompt: `The star compass corrects its heading with the power series Σ ${xc(c)}ⁿ ÷ (n × ${n(k)}ⁿ), summed from n = 1. Enter the centre of the series, then its radius of convergence, then the left end and the right end of its interval of convergence.`,
   answer: [c, k, lo, hi],
   hints: [`A power series in powers of (x − a) is centred at a. Write ${xc(c)} in the form (x − a) to read off a.`, 'Use the ratio test on the terms: divide one term by the one before and let n grow, remembering that a factor such as n ÷ (n + 1) approaches 1. The series converges where the size of that limit is below 1, and how far x may then be from the centre is the radius.'],
   solution: `${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `The series is written in powers of ${xc(c)}`}, so it is centred at ${n(c)}. The ratio of one term to the one before is ${xc(c)} × n ÷ (${n(k)}(n + 1)), whose size approaches ${absxc(c)} ÷ ${n(k)}. The ratio test needs ${absxc(c)} ÷ ${n(k)} < 1, that is ${absxc(c)} < ${n(k)}, so the radius of convergence is ${n(k)}. The interval runs from ${n(c)} − ${n(k)} = ${n(lo)} to ${n(c)} + ${n(k)} = ${n(hi)}. At its ends the ratio test says nothing: at x = ${n(hi)} the series is Σ 1 ÷ n, the harmonic series, which diverges, and at x = ${n(lo)} it is Σ (−1)ⁿ ÷ n, an alternating series that converges.`,
   guidance: [
    { prompt: `Write ${xc(c)} in the form (x − a). What is the centre a?`, answer: [c], explanation: `${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `${xc(c)} is already in that form`}, so the series is centred at ${n(c)}.` },
    { prompt: `The ratio test gives the limit ${absxc(c)} ÷ ${n(k)}, and the series converges when it is below 1. How far from the centre can x be?`, answer: [k], explanation: `${absxc(c)} ÷ ${n(k)} < 1 means ${absxc(c)} < ${n(k)}: x may be up to ${n(k)} away from the centre. That distance is the radius of convergence.` },
    { prompt: `The interval of convergence runs one radius either side of the centre ${n(c)}. What are its left and right ends?`, answer: [lo, hi], explanation: `${n(c)} − ${n(k)} = ${n(lo)} and ${n(c)} + ${n(k)} = ${n(hi)}.` }
   ] }; }
 },
 /* Taylor polynomial of degree 2 or 3 of √x (about 4 or 9), 1 ÷ x (about 2, 4 or 5) or ln x (about 1), at x = a + h. */
 q36: {
  canonical: { f: 'sqrt', a: 4, deg: 2, h: 0.2 },
  draw: R => { let p; do { const f = R.pick(['sqrt', 'inv', 'ln']), deg = R.int(2, 3);
   const a = f === 'ln' ? 1 : f === 'sqrt' ? (deg === 3 ? 4 : R.pick([4, 9])) : (deg === 3 ? 2 : R.pick([2, 4, 5]));
   p = { f, a, deg, h: R.pick([0.1, 0.2, 0.3, 0.4, -0.1, -0.2]) };
   } while ((p.f === 'ln' && p.deg === 2 && p.h === 0.1) || tie(q36Data(p).d.slice(0, p.deg + 1).reduce((s, d, k) => s + d.v / fact(k) * Math.pow(p.h, k), 0))); return p; },
  build: p => { const { f, a, deg, h } = p, D = q36Data(p), x0 = a + h, cs = D.d.slice(0, deg + 1).map((d, k) => fr(d.num, d.den * fact(k))),
   P = cs.reduce((s, c, k) => s + c.v * Math.pow(h, k), 0), Pr = r4(P), top = D.d[deg], c = cs[deg], poly = polyText(cs, a);
   const vals = D.d.slice(0, deg + 1).map((d, k) => `${PRIME[k]}(${n(a)}) = ${ft(d)}`).join(', ');
   return {
   prompt: `The star compass cannot take ${f === 'sqrt' ? 'square roots' : f === 'inv' ? 'reciprocals' : 'logarithms'} directly, so it uses the Taylor polynomial of degree ${deg} of f(x) = ${D.name} about x = ${n(a)}. Enter the coefficient of (x − ${n(a)})${sup(deg)} in that polynomial (a fraction such as −1/8 is fine), then the polynomial’s value at x = ${n(x0)}, rounded to 4 decimal places.`,
   answer: [c.v, Pr],
   hints: [`The coefficient of (x − a)ᵏ in a Taylor polynomial is the kth derivative at a divided by k!. Here you need ${D.dtext.slice(0, deg).join(' and ')}.`, `Put x = ${n(x0)} into the polynomial, so that x − ${n(a)} = ${n(h)}, and keep every decimal until the final rounding.`],
   solution: `For f(x) = ${D.name}: ${D.dtext.slice(0, deg).join(', ')}. At x = ${n(a)}: ${vals}. Dividing the kth derivative by k! gives the coefficients, so P(x) = ${poly}, and the coefficient of (x − ${n(a)})${sup(deg)} is ${ft(top)} ÷ ${n(deg)}! = ${ft(c)}. At x = ${n(x0)}, x − ${n(a)} = ${n(h)}, and P(${n(x0)}) = ${four(P)}, which rounds to ${n(Pr)}.`,
   guidance: [
    { prompt: `Start with f(x) = ${D.name} at x = ${n(a)}. What are ${PRIME[0]}(${n(a)}) and ${PRIME[1]}(${n(a)})? Fractions are fine.`, answer: [D.d[0].v, D.d[1].v], explanation: `${PRIME[0]}(${n(a)}) = ${ft(D.d[0])}, and ${D.dtext[0]} gives ${PRIME[1]}(${n(a)}) = ${ft(D.d[1])}.` },
    { prompt: `${D.dtext[deg - 1]}. What is ${PRIME[deg]}(${n(a)})?`, answer: [top.v], explanation: `${D.dtext.slice(1, deg).map(t => t.replace(/^(\S+)\(x\).*/, '$1')).map((t, i) => `${t}(${n(a)}) = ${ft(D.d[i + 2])}`).join(' and ')}.` },
    { prompt: `The coefficient of (x − ${n(a)})${sup(deg)} is ${PRIME[deg]}(${n(a)}) ÷ ${n(deg)}!. What is it?`, answer: [c.v], explanation: `${ft(top)} ÷ ${n(fact(deg))} = ${ft(c)}.` },
    { prompt: `The polynomial is P(x) = ${poly}. Put in x = ${n(x0)}. What is P(${n(x0)}), rounded to 4 decimal places?`, answer: [Pr], explanation: `With x − ${n(a)} = ${n(h)}, P(${n(x0)}) = ${four(P)}, which rounds to ${n(Pr)}.` }
   ] }; }
 },
 /* The coefficient of xᵐ in the Maclaurin series of e^(kx), sin(kx), cos(kx) or 1 ÷ (1 − kx), in lowest terms. */
 q37: {
  canonical: { f: 'sin', k: 2, m: 5 },
  draw: R => { let p; do { const f = R.pick(['exp', 'sin', 'cos', 'geo']);
   p = { f, k: R.pick([-3, -2, -1, 2, 3]), m: f === 'sin' ? R.pick([3, 5, 7]) : f === 'cos' ? R.pick([2, 4, 6]) : R.int(2, 6) };
   } while (Math.abs(p.k) === 3 && p.m === 7 || (p.f === 'exp' && p.k === 3 && p.m === 2)); return p; },
  build: p => { const { f, k, m } = p, C = q37Coef(p), fn = q37Fn(p), kx = k === 1 ? 'x' : k === -1 ? '−x' : `${n(k)}x`, cx = v => v === 1 ? '' : v === -1 ? '−' : n(v), factorial = f !== 'geo', sgn = C.sign < 0, S = C.sign * C.km, g = gcd(C.km, C.den);
   return {
   prompt: `The navigation room computes ${fn} from its Maclaurin series. Enter the coefficient of x${sup(m)} in that series as a fraction in lowest terms: its numerator (with a minus sign if the coefficient is negative), then its denominator (1 for a whole number). Type the numbers without commas.`,
   answer: [C.c.num, C.c.den],
   hints: [`Start from the known series ${q37Series[f]}.`, `Put u = ${kx}. The term with u${sup(m)} becomes ${factorial ? `${sgn ? '−' : ''}(${kx})${sup(m)} ÷ ${n(m)}!` : `(${kx})${sup(m)}`}, and (${kx})${sup(m)} = ${par(k)}${sup(m)}x${sup(m)}.`],
   solution: `The Maclaurin series ${q37Series[f]} holds for every u${f === 'geo' ? ' with |u| < 1' : ''}. Put u = ${kx}: the term with x${sup(m)} comes from ${factorial ? `${sgn ? '−' : '+'}u${sup(m)} ÷ ${n(m)}!` : `u${sup(m)}`}, which becomes ${factorial ? `${sgn ? '−' : ''}${par(k)}${sup(m)}x${sup(m)} ÷ ${n(m)}! = ${cx(S)}x${sup(m)} ÷ ${n(C.den)}` : `${par(k)}${sup(m)}x${sup(m)} = ${cx(C.km)}x${sup(m)}`}. So the coefficient is ${ft(C.c)}${C.c.den === 1 ? '' : ' in lowest terms'}: numerator ${n(C.c.num)}, denominator ${n(C.c.den)}.`,
   guidance: [
    { prompt: `In ${fn} the series variable is u = ${kx}, so u${sup(m)} = ${par(k)}${sup(m)}x${sup(m)}. What is ${par(k)}${sup(m)}?`, answer: [C.km], explanation: `${par(k)}${sup(m)} = ${n(C.km)}.` },
    { prompt: factorial ? `The u${sup(m)} term of the series is ${sgn ? '−' : '+'}u${sup(m)} ÷ ${n(m)}!, and ${n(m)}! = ${n(C.den)}. So the coefficient of x${sup(m)} is ${n(S)} ÷ ${n(C.den)}. Write it in lowest terms: numerator, then denominator.` : `In 1 ÷ (1 − u) every power of u has coefficient 1. Write the coefficient of x${sup(m)} as a fraction: numerator, then denominator.`,
     answer: [C.c.num, C.c.den], explanation: factorial ? (g === 1 ? `${n(S)} ÷ ${n(C.den)} = ${ft(C.c)}, already in lowest terms.` : `${n(S)} ÷ ${n(C.den)} = ${ft(C.c)} after dividing the top and the bottom by ${n(g)}.`) : `The coefficient is ${n(C.km)}, a whole number, so the fraction is ${n(C.km)}/1.` }
   ] }; }
 },
 /* Smallest degree n with M|x|ⁿ⁺¹ ÷ (n + 1)! < eps; the answer is at least 3, and the deciding bounds are well clear of eps. */
 q38: {
  canonical: { f: 'cos', x0: 0.5, eps: 0.0001 },
  draw: R => { let p; do { const f = R.pick(['sin', 'cos', 'exp']);
   p = { f, x0: f === 'exp' ? R.pick([0.2, 0.5, 1]) : R.pick([0.2, 0.5, 1, 2]), eps: R.pick([0.01, 0.005, 0.001, 0.0005, 0.0001]) };
   } while (!(() => { const d = q38Deg(p), lo = q38Bound(p.f, p.x0, d), hi = q38Bound(p.f, p.x0, d - 1); return d >= 3 && lo >= 1.5e-6 && lo < p.eps * 0.999 && hi > p.eps * 1.001; })() || (p.f === 'sin' && p.x0 === 1 && p.eps === 0.001)); return p; },
  build: p => { const { f, x0, eps } = p, d = q38Deg(p), M = q38M(f), fn = q38Fn(p),
   mWhy = f === 'exp' ? 'M = 3, because every derivative of eˣ is eˣ itself, which stays below 3 for x between 0 and 1' : `M = 1, because every derivative of ${f} x is ± sin x or ± cos x, which never exceeds 1 in size`;
   return {
   prompt: `The star compass works out ${fn} with a Maclaurin polynomial of degree n: a Taylor polynomial about 0, built from powers of x up to xⁿ. Taylor’s theorem bounds the error by M × |x|ⁿ⁺¹ ÷ (n + 1)!, with x = ${n(x0)} and ${mWhy}. Enter the smallest degree n for which this bound is below ${n(eps)}.`,
   answer: [d],
   hints: ['Work out the bound for n = 1, 2, 3, … in turn. Each step multiplies the previous bound by |x| ÷ (n + 1), so it soon shrinks fast.', `Stop at the first degree whose bound is below ${n(eps)}; the degree before it must still give a bound of ${n(eps)} or more.`],
   solution: `The Taylor remainder after the degree-n polynomial is at most M × |x|ⁿ⁺¹ ÷ (n + 1)! with M = ${n(M)}. For n = ${n(d - 1)} the bound is ${q38Line(f, x0, d - 1)}, which is not below ${n(eps)} = 1 ÷ ${n(Math.round(1 / eps))}. For n = ${n(d)} it is ${q38Line(f, x0, d)}, which is. So the smallest degree is ${n(d)}.`,
   guidance: [
    { prompt: `Try n = ${n(d - 1)}: the bound is ${M === 3 ? '3 × ' : ''}${n(x0)}${sup(d)} ÷ ${n(d)}!. Is it below ${n(eps)}? Enter 1 for yes, 0 for no.`, answer: [0], explanation: `${q38Line(f, x0, d - 1)}, which is not below ${n(eps)}.` },
    { prompt: `Try n = ${n(d)}: the bound is ${M === 3 ? '3 × ' : ''}${n(x0)}${sup(d + 1)} ÷ ${n(d + 1)}!. Is it below ${n(eps)}? Enter 1 for yes, 0 for no.`, answer: [1], explanation: `${q38Line(f, x0, d)}, which is below ${n(eps)}.` },
    { prompt: 'Lower degrees give bigger bounds. What is the smallest degree n whose bound is below the target?', answer: [d], explanation: `Degree ${n(d - 1)} is not enough and degree ${n(d)} is, so the answer is ${n(d)}.` }
   ] }; }
 },
 /* ∫ from 0 to b of e^(−x²) or sin(x) ÷ x, from the first k terms of the integrated Maclaurin series; every used term is at least 0.000005. */
 q39: {
  canonical: { f: 'gauss', b: 0.5, k: 3 },
  draw: R => { let p; do { const b = R.pick([0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]); p = { f: R.pick(['gauss', 'sinc']), b, k: b >= 0.7 ? R.int(3, 4) : 3 };
   } while (near4(q39Terms(p).slice(0, p.k).reduce((s, t) => s + t, 0)) || Math.abs(q39Terms(p)[p.k - 1]) < 5e-6); return p; },
  build: p => { const { f, b, k } = p, T = q39Terms(p), est = T.slice(0, k).reduce((s, t) => s + t, 0), Er = r4(est), next = Math.abs(T[k]), d3 = q39Den(f, 2);
   return {
   prompt: `The navigation room needs the integral of ${q39Fn(f)} from x = 0 to x = ${n(b)}, but ${q39Fn(f)} has no antiderivative made of the usual functions. Replace ${q39Fn(f)} by its Maclaurin series, integrate term by term, and add the first ${n(k)} terms of the result. Enter the estimate rounded to 4 decimal places.`,
   answer: [Er],
   hints: [`Start from ${q39Series[f]}. Integrating xᵐ from 0 to b gives bᵐ⁺¹ ÷ (m + 1).`, 'Keep every decimal while you add the terms, and round only the final sum.'],
   solution: `The series is ${q39Series[f]}. Integrating each term from 0 to ${n(b)} gives ${q39Text(p)} ${k % 2 ? '−' : '+'} …. Adding the first ${n(k)} terms with every decimal kept gives ${four(est)}, which rounds to ${n(Er)}. The integrated series alternates, so the estimate is within the first term left out, which is less than ${n(Math.max(0.0001, Math.ceil(next * 1e4) / 1e4))}, of the true value.`,
   guidance: [
    { prompt: `The third term of the series of ${q39Fn(f)} is ${f === 'gauss' ? 'x⁴/2!' : 'x⁴/5!'}. Integrated from 0 to b it becomes b⁵ ÷ D. What is D?`, answer: [d3], explanation: `The integral of x⁴ from 0 to b is b⁵ ÷ 5, and it is still divided by ${f === 'gauss' ? '2! = 2' : '5! = 120'}, so D = 5 × ${f === 'gauss' ? '2' : '120'} = ${n(d3)}.` },
    { prompt: `The integrated series is ${q39Text(p)} ${k % 2 ? '−' : '+'} …. Add these ${n(k)} terms. What is the estimate, rounded to 4 decimal places?`, answer: [Er], explanation: `Work out each term, keep every decimal and add them with their signs: the sum is ${four(est)}, which rounds to ${n(Er)}.` }
   ] }; }
 },
 /* x(t) = 3ct² + p, y(t) = c(t³ − 3t) + q: slope (t² − 1) ÷ (2t) at t0, length c((t2³ − t1³) + 3(t2 − t1)). */
 q40: {
  canonical: { c: 1, p: 2, q: 1, t0: 2, t1: 0, t2: 3 },
  draw: R => { let p; do { const t1 = R.int(0, 1); p = { c: R.int(1, 2), p: R.int(-5, 5), q: R.int(-5, 5), t0: R.pick([2, 4, 5]), t1, t2: R.int(t1 + 2, 4) }; } while (p.c === 1 && p.t1 === 0 && p.t2 === 2 && p.t0 === 2); return p; },
  build: P => { const { c, t0, t1, t2 } = P, dx = 6 * c * t0, dy = 3 * c * (t0 * t0 - 1), slope = dy / dx, speed = 3 * c * (t0 * t0 + 1),
   L = c * ((t2 ** 3 - t1 ** 3) + 3 * (t2 - t1)), k = 3 * c, sq = 9 * c * c, anti = c === 1 ? 't³ + 3t' : `${n(c)}t³ + ${n(3 * c)}t`, F = t => c * (t ** 3 + 3 * t);
   return {
   prompt: `A survey drone leaves the navigation room on a path given by two functions of time: x(t) = ${q40X(P)} and y(t) = ${q40Y(P)}, in metres, t seconds after launch. Enter the slope dy/dx of its path at t = ${n(t0)}, then the length of the path in metres from t = ${n(t1)} to t = ${n(t2)}.`,
   answer: [slope, L],
   hints: ['The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt): how fast y changes divided by how fast x changes.', `The length is the integral of √((dx/dt)² + (dy/dt)²) dt. Here (dx/dt)² + (dy/dt)² works out to ${n(sq)}(t² + 1)², a perfect square.`],
   solution: `dx/dt = ${n(6 * c)}t and dy/dt = ${n(3 * c)}t² − ${n(3 * c)}. At t = ${n(t0)}: dx/dt = ${n(dx)} and dy/dt = ${n(dy)}, so dy/dx = ${n(dy)} ÷ ${n(dx)} = ${n(slope)}. For the length, (${n(6 * c)}t)² + (${n(3 * c)}t² − ${n(3 * c)})² = ${n(sq)}(t⁴ + 2t² + 1) = ${n(sq)}(t² + 1)², so the speed is √(…) = ${n(k)}(t² + 1) = ${n(k)}t² + ${n(k)}. Its integral from ${n(t1)} to ${n(t2)} is [${anti}] from ${n(t1)} to ${n(t2)} = ${n(F(t2))} − ${n(F(t1))} = ${n(L)} metres.`,
   guidance: [
    { prompt: `dx/dt = ${n(6 * c)}t and dy/dt = ${n(3 * c)}t² − ${n(3 * c)}. What are they at t = ${n(t0)}?`, answer: [dx, dy], explanation: `dx/dt = ${n(6 * c)} × ${n(t0)} = ${n(dx)} and dy/dt = ${n(3 * c)} × ${n(t0 * t0)} − ${n(3 * c)} = ${n(dy)}.` },
    { prompt: `The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt). What is it at t = ${n(t0)}?`, answer: [slope], explanation: `${n(dy)} ÷ ${n(dx)} = ${n(slope)}.` },
    { prompt: `The speed along the path is √((dx/dt)² + (dy/dt)²). What is it at t = ${n(t0)}?`, answer: [speed], explanation: `√(${n(dx)}² + ${n(dy)}²) = √${n(dx * dx + dy * dy)} = ${n(speed)}, which matches ${n(k)}(t² + 1) at t = ${n(t0)}.` },
    { prompt: `The speed is ${n(k)}(t² + 1) = ${n(k)}t² + ${n(k)} at every time. Integrate it from t = ${n(t1)} to t = ${n(t2)}. What is the length of the path?`, answer: [L], explanation: `An antiderivative is ${anti}, so the length is ${n(F(t2))} − ${n(F(t1))} = ${n(L)} metres.` }
   ] }; }
 }
});
})();
