/* Real analysis mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Round to 3 decimal places (half away from zero is never needed: draws that land near a tie are filtered). */
const r3 = x => Math.round(x * 1000) / 1000;
/* Bounded retry: at most 1000 tries, then the canonical parameters (wave 2 rule). */
const tryDraw = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
/* Has at most `d` decimal places (exactly, for numbers built from small integers). */
const places = (x, d) => Math.abs(Math.round(x * Math.pow(10, d)) - x * Math.pow(10, d)) < 1e-9;
/* "(x − 2)" / "(x + 3)" / "x" for a centre x0. */
const shift = x0 => x0 === 0 ? 'x' : `(x ${x0 > 0 ? '−' : '+'} ${n(Math.abs(x0))})`;
const dist = x0 => x0 === 0 ? '|x|' : `|x ${x0 > 0 ? '−' : '+'} ${n(Math.abs(x0))}|`;
/* q31: the three flow models, all monotone on [a, b] with 0 ≤ a. */
const Q31F = [
 { text: 'x²', f: x => x * x, up: true },
 { text: 'x³', f: x => x * x * x, up: true },
 { text: '20 − x²', f: x => 20 - x * x, up: false }
];
/* q32: f(t) = (t − h)² + k written out as t² − 2ht + (h² + k); its integral from s to e is ((e − h)³ − (s − h)³) ÷ 3 + k(e − s). */
const q32int = (h, k, s, e) => (Math.pow(e - h, 3) - Math.pow(s - h, 3)) / 3 + k * (e - s);
const q32f = (h, k, t) => (t - h) * (t - h) + k;
/* q34: partial sum of c ÷ nᵖ for n = 1 … N, and the tail integral of c ÷ xᵖ from N + 1 to infinity. */
const q34parts = ({ c, p, N }) => { let s = 0; for (let k = 1; k <= N; k++) s += c / Math.pow(k, p);
 const I = c / ((p - 1) * Math.pow(N + 1, p - 1)), next = c / Math.pow(N + 1, p); return { s, I, next, lo: s + I, hi: s + next + I }; };
/* A quotient for the working: exact when it has at most 4 decimals, else “about” with 2. */
const approx = x => places(x, 4) ? n(x) : `about ${n(Math.round(x * 100) / 100)}`;
const nearTie = x => Math.abs(Math.abs(x * 1000 - Math.floor(x * 1000)) - 0.5) < 1e-6;
/* q35, q36: x-values and tolerances printed as short decimals. */
const Q35X = [[1, 2], [1, 4], [1, 5], [1, 10], [2, 1], [3, 1], [3, 2]];
const Q35W = [2, 5, 10, 20, 50, 100];
/* q39: the four metrics. */
const Q39M = ['euclidean metric', 'taxicab metric', 'maximum metric', 'discrete metric'];
const q39d = (kind, dx, dy) => kind === 0 ? Math.sqrt(dx * dx + dy * dy) : kind === 1 ? Math.abs(dx) + Math.abs(dy) : kind === 2 ? Math.max(Math.abs(dx), Math.abs(dy)) : (dx || dy ? 1 : 0);
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* f monotone on [a, b], n equal pieces: U − L = |f(b) − f(a)| × (b − a) ÷ n, because the sums telescope.
    ε = m ÷ 100, so the smallest n with U − L < ε is floor(100D ÷ m) + 1 with D = |f(b) − f(a)|(b − a), in integers.
    The worked example is x² on [0, 2]; draws never use it. */
 q31: {
  canonical: { kind: 0, a: 1, b: 3, n0: 10, m: 3 },
  draw: R => tryDraw(() => { const kind = R.int(0, 2), a = R.int(0, 3); return { kind, a, b: a + R.int(1, kind === 1 ? 2 : 3), n0: R.pick([4, 5, 8, 10, 20, 25]), m: R.int(1, 9) }; },
   p => !(p.kind === 0 && p.a === 0 && p.b === 2) && (p.kind !== 1 || p.b <= 4), { kind: 0, a: 1, b: 3, n0: 10, m: 3 }),
  build: ({ kind, a, b, n0, m }) => { const F = Q31F[kind], fa = F.f(a), fb = F.f(b), gap = Math.abs(fb - fa), len = b - a, D = gap * len,
   w = len / n0, diff = D / n0, eps = m / 100, N = Math.floor(100 * D / m) + 1, exact = (100 * D) % m === 0,
   dir = F.up ? 'increasing' : 'decreasing', top = F.up ? 'right' : 'left', bot = F.up ? 'left' : 'right'; return {
   prompt: `A fuel line at the audit delivers fuel at the rate f(x) = ${F.text} litres per hour over the hours x from ${n(a)} to ${n(b)}. Split [${n(a)}, ${n(b)}] into n equal pieces and compare the lower sum L and the upper sum U of f for that partition. Enter U − L for ${n(n0)} equal pieces, then the smallest number n of equal pieces for which U − L < ${n(eps)} (type it without commas).`,
   answer: [diff, N],
   hints: ['f is monotone, so on each piece its smallest and largest values sit at the two ends. Add up (largest − smallest) × width: the inside values cancel, leaving (difference of the end values) × (width of one piece).', 'U − L for n equal pieces is a fixed number divided by n. Solve “that number ÷ n < the tolerance” for n; the inequality is strict, so when the division comes out whole, the smallest n is one more.'],
   solution: `f(x) = ${F.text} is ${dir} on [${n(a)}, ${n(b)}], so on each piece the largest value is at the ${top} end and the smallest at the ${bot} end. In U − L every inside value appears once with a plus sign and once with a minus sign, so only the end values survive: U − L = |f(${n(b)}) − f(${n(a)})| × (${n(b)} − ${n(a)}) ÷ n = ${n(gap)} × ${n(len)} ÷ n = ${n(D)} ÷ n. For ${n(n0)} pieces of width ${n(w)}, U − L = ${n(gap)} × ${n(w)} = ${n(diff)}. U − L < ${n(eps)} means n > ${n(D)} ÷ ${n(eps)} = ${approx(100 * D / m)}${exact ? ', and n must be strictly larger' : ''}, so the smallest n is ${n(N)}.`,
   guidance: [
    { prompt: `f(x) = ${F.text} is ${dir} on [${n(a)}, ${n(b)}]. After the inside values cancel, U − L is |f(${n(b)}) − f(${n(a)})| times the width of one piece. What is |f(${n(b)}) − f(${n(a)})|?`, answer: [gap], explanation: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}, so the difference of the end values is ${n(gap)}.` },
    { prompt: `With ${n(n0)} equal pieces each piece has width (${n(b)} − ${n(a)}) ÷ ${n(n0)} = ${n(w)}. What is U − L?`, answer: [diff], explanation: `U − L = ${n(gap)} × ${n(w)} = ${n(diff)}.` },
    { prompt: `For n equal pieces U − L = ${n(D)} ÷ n. What is the smallest n with ${n(D)} ÷ n < ${n(eps)}?`, answer: [N], explanation: `${n(D)} ÷ n < ${n(eps)} means n > ${n(D)} ÷ ${n(eps)} = ${approx(100 * D / m)}. The smallest whole number strictly above it is ${n(N)}.` }
   ] }; }
 },
 /* f(t) = (t − h)² + k on [0, c] with b and c − b multiples of 3, so every integral is a whole number. m and M are the
    smallest and largest values of f on [b, c]: k when the lowest point t = h lies in [b, c], else the nearer end. */
 q32: {
  canonical: { h: 4, k: 2, b: 3, c: 6 },
  draw: R => tryDraw(() => { const b = 3 * R.int(1, 2); return { h: R.int(1, 7), k: R.int(1, 9), b, c: b + 3 * R.int(1, b === 3 ? 2 : 1) }; },
   p => !(p.h === 1 && p.k === 2), { h: 4, k: 2, b: 3, c: 6 }),
  build: ({ h, k, b, c }) => { const tot = q32int(h, k, 0, c), first = q32int(h, k, 0, b), piece = tot - first, fb = q32f(h, k, b), fc = q32f(h, k, c),
   inside = h >= b && h <= c, mm = inside ? k : Math.min(fb, fc), MM = Math.max(fb, fc), len = c - b, lo = mm * len, hi = MM * len,
   ftext = `t² − ${n(2 * h)}t + ${n(h * h + k)}`; return {
   prompt: `A pump at the fuel audit draws fuel at the rate f(t) = ${ftext} litres per hour, t hours into a shift. The meter certifies that the integral of f from 0 to ${n(c)} is ${n(tot)} litres and the integral of f from 0 to ${n(b)} is ${n(first)} litres. Enter the integral of f from ${n(b)} to ${n(c)}, then the lower bound m × (${n(c)} − ${n(b)}) and the upper bound M × (${n(c)} − ${n(b)}), where m and M are the smallest and largest values of f on [${n(b)}, ${n(c)}].`,
   answer: [piece, lo, hi],
   hints: ['Additivity: the integral over a whole interval is the integral over its first part plus the integral over the rest.', 'Write f as (t − h)² plus a constant. Its lowest point is t = h; on an interval that misses h, the smallest value is at the end nearer h, and the largest value is always at an end.'],
   solution: `By additivity, the integral from 0 to ${n(c)} is the integral from 0 to ${n(b)} plus the integral from ${n(b)} to ${n(c)}, so the piece is ${n(tot)} − ${n(first)} = ${n(piece)} litres. f(t) = (t − ${n(h)})² + ${n(k)}, so f(${n(b)}) = ${n(fb)} and f(${n(c)}) = ${n(fc)}. ${inside ? `The lowest point t = ${n(h)} lies in [${n(b)}, ${n(c)}], so m = ${n(k)}` : `The lowest point t = ${n(h)} is outside [${n(b)}, ${n(c)}], so m is the smaller end value, ${n(mm)}`}, and M = ${n(MM)}. Since m ≤ f(t) ≤ M on the piece, monotonicity of the integral gives ${n(mm)} × ${n(len)} = ${n(lo)} ≤ ${n(piece)} ≤ ${n(MM)} × ${n(len)} = ${n(hi)}, and the certified piece passes the check.`,
   guidance: [
    { prompt: `The integral from 0 to ${n(c)} is ${n(tot)} and the integral from 0 to ${n(b)} is ${n(first)}. By additivity, what is the integral from ${n(b)} to ${n(c)}?`, answer: [piece], explanation: `The whole is the first part plus the rest, so the rest is ${n(tot)} − ${n(first)} = ${n(piece)} litres.` },
    { prompt: `f(t) = (t − ${n(h)})² + ${n(k)}. What is the smallest value m of f on [${n(b)}, ${n(c)}]?`, answer: [mm], explanation: inside ? `The square is 0 at t = ${n(h)}, which lies in the interval, so m = ${n(k)}.` : `t = ${n(h)} lies outside the interval, so the smallest value is at an end: f(${n(b)}) = ${n(fb)} and f(${n(c)}) = ${n(fc)}, so m = ${n(mm)}.` },
    { prompt: `What is the largest value M of f on [${n(b)}, ${n(c)}]?`, answer: [MM], explanation: `The square grows away from t = ${n(h)}, so the largest value is at an end: f(${n(b)}) = ${n(fb)} and f(${n(c)}) = ${n(fc)}, so M = ${n(MM)}.` },
    { prompt: `The piece has length ${n(len)}. What are m × ${n(len)} and M × ${n(len)}?`, answer: [lo, hi], labels: ['lower bound (litres)', 'upper bound (litres)'], explanation: `${n(mm)} × ${n(len)} = ${n(lo)} and ${n(MM)} × ${n(len)} = ${n(hi)}. The piece, ${n(piece)} litres, lies between them.` }
   ] }; }
 },
 /* Step rate: p before s, a single reading r at s, q after s. F(x) = ps for x = s, ps + q(x − s) after.
    F is differentiable at s exactly when p = q (code 1); a third of the draws have p = q. r differs from p and q. */
 q33: {
  canonical: { p: 4, q: 7, r: 9, s: 3, x1: 5 },
  draw: R => tryDraw(() => { const p = R.int(2, 9), q = R.int(0, 2) === 0 ? p : R.except(2, 9, [p]), s = R.int(2, 5); return { p, q, r: R.except(1, 12, [p, q]), s, x1: s + R.int(1, 4) }; },
   p => !(p.p === 3 && p.q === 5 && p.s === 2), { p: 4, q: 7, r: 9, s: 3, x1: 5 }),
  build: ({ p, q, r, s, x1 }) => { const Fs = p * s, F1 = Fs + q * (x1 - s), code = p === q ? 1 : 0; return {
   prompt: `A valve’s fuel flow is logged as f(t) = ${n(p)} litres per hour for 0 ≤ t < ${n(s)}, a single reading f(${n(s)}) = ${n(r)} at the instant t = ${n(s)}, and f(t) = ${n(q)} for ${n(s)} < t ≤ ${n(s + 4)}. The running total is F(x) = the integral of f from 0 to x. Enter F(${n(s)}), then F(${n(x1)}), then 1 if F is differentiable at x = ${n(s)}, 0 if not.`,
   answer: [Fs, F1, code],
   hints: ['The value of f at one single instant does not change any integral, so the integral of a step rate is rate × time, piece by piece.', 'F is differentiable at the switch exactly when its slope from the left equals its slope from the right; those slopes are the rates on the two sides.'],
   solution: `Up to t = ${n(s)} the rate is ${n(p)}, so F(${n(s)}) = ${n(p)} × ${n(s)} = ${n(Fs)}; the single reading at t = ${n(s)} adds nothing. After that the rate is ${n(q)}, so F(${n(x1)}) = ${n(Fs)} + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(F1)}. Near x = ${n(s)}, F rises with slope ${n(p)} on the left and slope ${n(q)} on the right, so the difference quotients of F at ${n(s)} approach ${n(p)} from the left and ${n(q)} from the right. ${code ? `They agree, so F is differentiable at ${n(s)} with F′(${n(s)}) = ${n(p)}, even though f(${n(s)}) = ${n(r)} and f is not continuous there. The answer is 1.` : `They differ, so F has a corner and is not differentiable at ${n(s)}, although it is continuous there. The answer is 0.`}`,
   guidance: [
    { prompt: `From t = 0 to t = ${n(s)} the rate is ${n(p)} litres per hour (one reading at a single instant changes no integral). What is F(${n(s)})?`, answer: [Fs], explanation: `F(${n(s)}) = ${n(p)} × ${n(s)} = ${n(Fs)} litres.` },
    { prompt: `After t = ${n(s)} the rate is ${n(q)}. What is F(${n(x1)})?`, answer: [F1], explanation: `F(${n(x1)}) = F(${n(s)}) + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(Fs)} + ${n(q * (x1 - s))} = ${n(F1)} litres.` },
    { prompt: `For a small h > 0, (F(${n(s)} + h) − F(${n(s)})) ÷ h is the average rate just after t = ${n(s)}. What number do these difference quotients approach as h shrinks?`, answer: [q], explanation: `Just after t = ${n(s)} the rate is ${n(q)}, so F(${n(s)} + h) − F(${n(s)}) = ${n(q)}h and the quotient is ${n(q)} for every small h.` },
    { prompt: `From the left the quotients approach ${n(p)}, and from the right ${n(q)}. Enter 1 if F is differentiable at ${n(s)}, 0 if not.`, answer: [code], explanation: code ? `Both sides give ${n(p)}, so F′(${n(s)}) = ${n(p)} exists, although f itself jumps to ${n(r)} for one instant.` : `${n(p)} and ${n(q)} differ, so the two one-sided limits disagree and F′(${n(s)}) does not exist.` }
   ] }; }
 },
 /* S = sum of c ÷ nᵖ from n = 1. Lower bound: partial sum to N plus the integral of c ÷ xᵖ from N + 1 to infinity;
    upper bound: partial sum to N + 1 plus the same integral (the integral test with the tail starting at N + 1).
    Draws whose bounds sit within 1e−6 of a rounding tie, or round to the same value, are skipped. Lebl's own example
    (1 ÷ n² with 9 terms) and the worked example (1 ÷ n² with 3 terms) are never drawn. */
 q34: {
  canonical: { c: 1, p: 3, N: 4 },
  draw: R => tryDraw(() => { const p = R.int(2, 4); return { c: R.int(1, 3), p, N: R.int(2, p === 2 ? 10 : p === 3 ? 8 : 5) }; },
   p => { const x = q34parts(p); return !(p.c === 1 && p.p === 2 && (p.N === 9 || p.N === 3)) && !nearTie(x.lo) && !nearTie(x.hi) && !nearTie(x.I) && !nearTie(x.s) && r3(x.lo) !== r3(x.hi); }, { c: 1, p: 3, N: 4 }),
  build: ({ c, p, N }) => { const x = q34parts({ c, p, N }), pw = p === 2 ? '²' : p === 3 ? '³' : '⁴', term = `${n(c)} ÷ n${pw}`, xt = `${n(c)} ÷ x${pw}`, lo = r3(x.lo), hi = r3(x.hi); return {
   prompt: `A relay’s correction log adds up the endless sum S of ${term} for n = 1, 2, 3, … . Using the first ${n(N)} terms and the improper integral of ${xt} from ${n(N + 1)} to infinity, enter a lower bound and an upper bound for S, each rounded to 3 decimal places (keep full precision until the last step).`,
   answer: [lo, hi],
   hints: ['The improper integral of c ÷ xᵖ from K to infinity is c ÷ ((p − 1) × Kᵖ⁻¹) when p > 1.', 'For a decreasing positive f, the tail f(K) + f(K + 1) + … lies between the integral of f from K to infinity and f(K) plus that integral. Take K one past the terms you added.'],
   solution: `The first ${n(N)} terms add to ${n(r3(x.s))} (to 3 decimal places). The improper integral of ${xt} from ${n(N + 1)} to infinity is ${n(c)} ÷ (${n(p - 1)} × ${n(N + 1)}${p === 2 ? '' : (p === 3 ? '²' : '³')}) = ${n(r3(x.I))} (to 3 decimal places). The tail from n = ${n(N + 1)} on is at least that integral and at most the term ${n(c)} ÷ ${n(N + 1)}${pw} = ${n(r3(x.next))} plus it. So S ≥ ${n(r3(x.s))} + ${n(r3(x.I))} and S ≤ ${n(r3(x.s))} + ${n(r3(x.next))} + ${n(r3(x.I))}; with full precision the bounds are ${n(lo)} and ${n(hi)}.`,
   guidance: [
    { prompt: `Add the first ${n(N)} terms. What is their sum, to 3 decimal places?`, answer: [r3(x.s)], labels: ['partial sum'], explanation: `${Array.from({ length: N }, (_, i) => `${n(c)} ÷ ${n(i + 1)}${pw}`).join(' + ')} = ${n(r3(x.s))} to 3 decimal places.` },
    { prompt: `What is the improper integral of ${xt} from ${n(N + 1)} to infinity, to 3 decimal places?`, answer: [r3(x.I)], labels: ['tail integral'], explanation: `It is ${n(c)} ÷ (${n(p - 1)} × ${n(N + 1)}${p === 2 ? '' : (p === 3 ? '²' : '³')}) = ${n(r3(x.I))} to 3 decimal places.` },
    { prompt: `The tail from n = ${n(N + 1)} on is at least that integral. What is the lower bound for S, to 3 decimal places?`, answer: [lo], labels: ['lower bound'], explanation: `Partial sum plus tail integral, with full precision, is ${n(lo)} to 3 decimal places.` },
    { prompt: `The tail is at most the term ${n(c)} ÷ ${n(N + 1)}${pw} plus the same integral. What is the upper bound for S, to 3 decimal places?`, answer: [hi], labels: ['upper bound'], explanation: `Adding the term ${n(r3(x.next))} to the lower bound's working gives ${n(hi)} to 3 decimal places.` }
   ] }; }
 },
 /* fₙ(x) = (B + Knx) ÷ (1 + nx) on x ≥ 0: fₙ(0) = B for every n, and fₙ(x) → K for x > 0.
    |fₙ(x₁) − K| = D ÷ (1 + nx₁) with D = |B − K|; with ε = 1 ÷ w and x₁ = u ÷ v the smallest n with this below ε is
    floor(v(Dw − 1) ÷ u) + 1, in integers. The gap shrinks as n grows, so it stays below ε from then on. */
 q35: {
  canonical: { B: 2, K: 8, xi: 0, wi: 2 },
  draw: R => tryDraw(() => { const B = R.int(0, 9); return { B, K: R.except(2, 9, [B]), xi: R.int(0, Q35X.length - 1), wi: R.int(0, Q35W.length - 1) }; },
   p => !(p.B === 1 && p.K === 5), { B: 2, K: 8, xi: 0, wi: 2 }),
  build: ({ B, K, xi, wi }) => { const [u, v] = Q35X[xi], w = Q35W[wi], x1 = u / v, eps = 1 / w, D = Math.abs(B - K), Q = D * w,
   N = Math.floor(v * (Q - 1) / u) + 1, bound = v * (Q - 1) / u, exact = (v * (Q - 1)) % u === 0, ftext = `(${n(B)} + ${n(K)}nx) ÷ (1 + nx)`.replace('(0 + ', '('); return {
   prompt: `A simulated gauge’s n-th model gives the reading fₙ(x) = ${ftext} at load x ≥ 0. Enter the pointwise limit f(0), then the pointwise limit f(${n(x1)}), then the smallest N for which |fₙ(${n(x1)}) − f(${n(x1)})| < ${n(eps)} holds for every n ≥ N (type it without commas).`,
   answer: [B, K, N],
   hints: ['Fix x first, then let n grow. At x = 0 every model gives the same number; for x > 0 divide the top and the bottom by n.', 'For x > 0, write fₙ(x) − f(x) over the common bottom 1 + nx: the terms with nx cancel, leaving a constant ÷ (1 + nx), which shrinks as n grows. Solve “that < the tolerance” for n; the inequality is strict.'],
   solution: `At x = 0, fₙ(0) = ${n(B)} ÷ 1 = ${n(B)} for every n, so f(0) = ${n(B)}. For x > 0, dividing the top and the bottom by n gives (${n(B)} ÷ n + ${n(K)}x) ÷ (1 ÷ n + x), which approaches ${n(K)}x ÷ x = ${n(K)}; so f(${n(x1)}) = ${n(K)}. The gap is |fₙ(${n(x1)}) − ${n(K)}| = ${n(D)} ÷ (1 + ${n(x1)}n). It is below ${n(eps)} when 1 + ${n(x1)}n > ${n(Q)}, that is n > ${n(Q - 1)} ÷ ${n(x1)} = ${approx(bound)}${exact ? ' (strictly)' : ''}. The gap only shrinks as n grows, so the smallest N is ${n(N)}.`,
   guidance: [
    { prompt: `Put x = 0 into fₙ(x). What number does every model give there, and so what is f(0)?`, answer: [B], explanation: `fₙ(0) = ${n(B)} ÷ 1 = ${n(B)} for every n, and a sequence that never changes converges to that value.` },
    { prompt: `Fix x = ${n(x1)} and let n grow. What is the limit f(${n(x1)})?`, answer: [K], explanation: `Divide the top and the bottom by n: (${n(B)} ÷ n + ${n(K * x1)}) ÷ (1 ÷ n + ${n(x1)}) approaches ${n(K * x1)} ÷ ${n(x1)} = ${n(K)}.` },
    { prompt: `The gap at x = ${n(x1)} is ${n(D)} ÷ (1 + ${n(x1)}n). What is the smallest N with this below ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `${n(D)} ÷ (1 + ${n(x1)}n) < ${n(eps)} means 1 + ${n(x1)}n > ${n(Q)}, so n > ${approx(bound)}. The smallest whole number strictly above it is ${n(N)}, and larger n only make the gap smaller.` }
   ] }; }
 },
 /* fₙ(x) = Ax ÷ (1 + nx²) on x ≥ 0 converges to 0. Its largest value is at x = 1 ÷ √n, where it is A ÷ (2√n).
    n₀ is a perfect square, so the norm is a short decimal. ε = e ÷ 100: the smallest N with A ÷ (2√N) < ε is
    floor(2500A² ÷ e²) + 1, in integers, kept below 100000. */
 q36: {
  canonical: { A: 3, n0: 25, e: 5 },
  draw: R => tryDraw(() => ({ A: R.int(2, 9), n0: R.pick([4, 16, 25, 100]), e: R.pick([2, 4, 5, 8, 10, 20, 25]) }),
   p => 2500 * p.A * p.A / (p.e * p.e) < 99000 && !(p.A === 4 && p.n0 === 4 && p.e === 10), { A: 3, n0: 25, e: 5 }),
  build: ({ A, n0, e }) => { const rt = Math.sqrt(n0), xm = 1 / rt, norm = A / (2 * rt), eps = e / 100, big = 2500 * A * A, N = Math.floor(big / (e * e)) + 1,
   exact = big % (e * e) === 0, bound = big / (e * e); return {
   prompt: `The simulation core’s n-th correction is fₙ(x) = ${n(A)}x ÷ (1 + nx²) for x ≥ 0, and fₙ(x) → 0 for every x. Enter the uniform norm ‖fₙ − 0‖_u for n = ${n(n0)}, then the smallest N for which ‖fₙ − 0‖_u < ${n(eps)} holds for every n ≥ N (type it without commas).`,
   answer: [norm, N],
   hints: ['The uniform norm is the supremum of |fₙ(x)| over all x ≥ 0. Find where the derivative of fₙ is 0.', 'For a coefficient a, the largest value of ax ÷ (1 + nx²) is at x = 1 ÷ √n and equals a ÷ (2√n). Solve “that < the tolerance” for n; the inequality is strict.'],
   solution: `The derivative of ${n(A)}x ÷ (1 + nx²) is ${n(A)}(1 − nx²) ÷ (1 + nx²)², which is 0 at x = 1 ÷ √n; fₙ rises before that point and falls after it, and fₙ(0) = 0. So ‖fₙ − 0‖_u = fₙ(1 ÷ √n) = ${n(A)} ÷ (2√n). For n = ${n(n0)}, x = ${n(xm)} and the norm is ${n(A)} ÷ ${n(2 * rt)} = ${n(norm)}. The norm is below ${n(eps)} when √n > ${n(A)} ÷ ${n(2 * eps)}, that is n > ${approx(bound)}${exact ? ' (strictly)' : ''}. The norm only shrinks as n grows, so the smallest N is ${n(N)}, and one N works for every x at once.`,
   guidance: [
    { prompt: `For n = ${n(n0)}, where is the derivative ${n(A)}(1 − ${n(n0)}x²) ÷ (1 + ${n(n0)}x²)² equal to 0 (with x > 0)?`, answer: [xm], labels: ['x of the peak'], explanation: `1 − ${n(n0)}x² = 0 gives x² = 1 ÷ ${n(n0)}, so x = ${n(xm)}.` },
    { prompt: `What is f at x = ${n(xm)} for n = ${n(n0)}, which is the uniform norm?`, answer: [norm], labels: ['uniform norm'], explanation: `${n(A)} × ${n(xm)} ÷ (1 + ${n(n0)} × ${n(xm * xm)}) = ${n(A * xm)} ÷ 2 = ${n(norm)}. Every other x gives less.` },
    { prompt: `In general the norm is ${n(A)} ÷ (2√n). What is the smallest N with this below ${n(eps)} for every n ≥ N?`, answer: [N], labels: ['N'], explanation: `${n(A)} ÷ (2√n) < ${n(eps)} means √n > ${n(A / (2 * eps))}, so n > ${approx(bound)}. The smallest whole number strictly above it is ${n(N)}.` }
   ] }; }
 },
 /* g(x) = A + sum over k ≥ 1 of c cos(2πkx) ÷ bᵏ with c = (b − 1)m. Mₖ = c ÷ bᵏ, so the sum of the Mₖ is m and the tail
    after N terms is m ÷ bᴺ (3 decimal places at most for these b and N). Every cos(2πkx) integrates to 0 over
    [0, L] when L is a multiple of 1/2, and uniform convergence lets the sum be integrated term by term: A × L. */
 q37: {
  canonical: { A: 4, m: 3, b: 2, N: 3, L2: 3 },
  draw: R => tryDraw(() => ({ A: R.int(2, 9), m: R.int(2, 9), b: R.pick([2, 5, 10]), N: R.int(2, 3), L2: R.int(1, 5) }),
   p => p.b !== 7, { A: 4, m: 3, b: 2, N: 3, L2: 3 }),
  build: ({ A, m, b, N, L2 }) => { const c = (b - 1) * m, L = L2 / 2, tail = m / Math.pow(b, N), I = A * L, bN = Math.pow(b, N); return {
   prompt: `The simulation core runs g(x) = ${n(A)} + the endless sum, for k = 1, 2, 3, …, of ${n(c)} cos(2πkx) ÷ ${n(b)}ᵏ. Enter the Weierstrass M-test bound Mₖ summed over all k (a bound on |g(x) − ${n(A)}| for every x), then the uniform bound on the error after the first ${n(N)} terms, then the integral of g from 0 to ${n(L)}.`,
   answer: [m, tail, I],
   hints: ['|cos| is never more than 1, so each term is at most Mₖ = c ÷ bᵏ in size for every x. The Mₖ form a geometric series.', 'Uniform convergence lets you integrate the sum term by term. The integral of cos(2πkx) from 0 to L is sin(2πkL) ÷ (2πk), which is 0 when L is a multiple of 1/2.'],
   solution: `For every x, |${n(c)} cos(2πkx) ÷ ${n(b)}ᵏ| ≤ Mₖ = ${n(c)} ÷ ${n(b)}ᵏ. The Mₖ form a geometric series with first term ${n(c / b)} and ratio 1/${n(b)}, so their sum is ${n(c / b)} ÷ (1 − 1/${n(b)}) = ${n(m)}. By the M-test the sum converges uniformly, and |g(x) − ${n(A)}| ≤ ${n(m)} for every x. After the first ${n(N)} terms the rest is at most the tail of the Mₖ: ${n(m)} ÷ ${n(b)}${N === 2 ? '²' : '³'} = ${n(tail)}, the same for every x. Because the partial sums converge uniformly, the integral of g is the sum of the integrals of its terms. The integral of cos(2πkx) from 0 to ${n(L)} is sin(2πk × ${n(L)}) ÷ (2πk) = 0, since 2πk × ${n(L)} is a whole multiple of π. Only the constant is left: ${n(A)} × ${n(L)} = ${n(I)}.`,
   guidance: [
    { prompt: `The k-th term is at most Mₖ = ${n(c)} ÷ ${n(b)}ᵏ in size for every x. What is the sum of all the Mₖ?`, answer: [m], labels: ['sum of the Mₖ'], explanation: `A geometric series with first term ${n(c / b)} and ratio 1/${n(b)}: ${n(c / b)} ÷ (1 − 1/${n(b)}) = ${n(m)}.` },
    { prompt: `The error after ${n(N)} terms is at most M${N === 2 ? '₃' : '₄'} + M${N === 2 ? '₄' : '₅'} + … . What is that tail?`, answer: [tail], labels: ['uniform error bound'], explanation: `The tail of a geometric series with ratio 1/${n(b)} after ${n(N)} terms is the whole sum divided by ${n(b)}${N === 2 ? '²' : '³'} = ${n(bN)}: ${n(m)} ÷ ${n(bN)} = ${n(tail)}.` },
    { prompt: `Integrate term by term. Each cos(2πkx) integrates to 0 from 0 to ${n(L)}. What is the integral of g from 0 to ${n(L)}?`, answer: [I], labels: ['integral of g'], explanation: `Only the constant ${n(A)} contributes: ${n(A)} × ${n(L)} = ${n(I)}.` }
   ] }; }
 },
 /* Sum over k ≥ 0 of c (x − x₀)ᵏ ÷ bᵏ: the ratio test gives |x − x₀| ÷ b, so the radius is b. On [x₀ − r, x₀ + r] with
    r < b, Mₖ = c(r ÷ b)ᵏ and the sum of the Mₖ is cb ÷ (b − r), kept to 2 decimal places. */
 q38: {
  canonical: { c: 6, b: 4, r: 2, x0: 1 },
  draw: R => tryDraw(() => { const b = R.int(2, 9); return { c: R.int(2, 9), b, r: R.int(1, b - 1), x0: R.int(-3, 3) }; },
   p => places(p.c * p.b / (p.b - p.r), 2) && places(p.r / p.b, 2) && !(p.c === 2 && p.b === 3 && p.x0 === 0), { c: 6, b: 4, r: 2, x0: 1 }),
  build: ({ c, b, r, x0 }) => { const S = c * b / (b - r), q = r / b, lo = x0 - r, hi = x0 + r; return {
   prompt: `A simulation uses the power series that adds up ${n(c)}${shift(x0)}ᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, … . Enter its radius of convergence, then the Weierstrass M-test bound (the sum of the Mₖ) that certifies uniform convergence on [${n(lo)}, ${n(hi)}].`,
   answer: [b, S],
   hints: ['Ratio test: divide the (k + 1)-th term by the k-th and take the size. The series converges where that ratio is below 1.', 'On a closed interval strictly inside the radius, |x − x₀| is at most the half-width r, so each term is at most c(r ÷ b)ᵏ. Those bounds form a geometric series.'],
   solution: `The ratio of the (k + 1)-th term to the k-th is ${shift(x0)} ÷ ${n(b)}, of size ${dist(x0)} ÷ ${n(b)}. It is below 1 when the distance from ${n(x0)} is below ${n(b)}, so the radius of convergence is ${n(b)}. On [${n(lo)}, ${n(hi)}] the distance from ${n(x0)} is at most ${n(r)}, so each term is at most Mₖ = ${n(c)} × (${n(r)}/${n(b)})ᵏ. These form a geometric series with ratio ${n(q)} < 1, whose sum is ${n(c)} ÷ (1 − ${n(q)}) = ${n(S)}. By the M-test the series converges uniformly on the interval, and its size there is never more than ${n(S)}.`,
   guidance: [
    { prompt: `The ratio of consecutive terms has size ${dist(x0)} ÷ ${n(b)}. Below what distance from ${n(x0)} does the series converge?`, answer: [b], labels: ['radius of convergence'], explanation: `The ratio is below 1 exactly when ${dist(x0)} < ${n(b)}, so the radius is ${n(b)}.` },
    { prompt: `On [${n(lo)}, ${n(hi)}] the distance from ${n(x0)} is at most ${n(r)}. What is the ratio r ÷ b of the bounding geometric series?`, answer: [q], labels: ['ratio'], explanation: `${n(r)} ÷ ${n(b)} = ${n(q)}, which is below 1 because the interval sits strictly inside the radius.` },
    { prompt: `Mₖ = ${n(c)} × ${n(q)}ᵏ. What is the sum of all the Mₖ?`, answer: [S], labels: ['sum of the Mₖ'], explanation: `${n(c)} ÷ (1 − ${n(q)}) = ${n(c)} ÷ ${n(1 - q)} = ${n(S)}.` }
   ] }; }
 },
 /* Two points of the plane, one of four metrics, and an open ball B(P, ρ) = points at distance < ρ from P.
    Euclidean draws use 3-4-5, 6-8-10 and 5-12-13 steps, so every distance is whole. ρ is the distance itself in a
    quarter of the draws (the boundary is not in an open ball). Discrete: ρ is 1 (out) or 2 (in). */
 q39: {
  canonical: { kind: 1, p1: 2, p2: -1, dx: -5, dy: 4, rho: 9 },
  draw: R => tryDraw(() => { const kind = R.int(0, 3), p1 = R.int(-5, 5), p2 = R.int(-5, 5); let dx, dy;
   if (kind === 0) { const t = R.pick(TRIPLES); dx = R.bool() ? t[0] : -t[0]; dy = R.bool() ? t[1] : -t[1]; } else { dx = R.nz(-7, 7); dy = R.nz(-7, 7); }
   const d = q39d(kind, dx, dy), rho = kind === 3 ? R.pick([1, 2]) : d + R.pick([-2, -1, 0, 1, 2, 3]); return { kind, p1, p2, dx, dy, rho };
  }, p => p.rho >= 1 && !(p.kind === 0 && p.dx === 3 && p.dy === 4), { kind: 1, p1: 2, p2: -1, dx: -5, dy: 4, rho: 9 }),
  build: ({ kind, p1, p2, dx, dy, rho }) => { const q1 = p1 + dx, q2 = p2 + dy, ax = Math.abs(dx), ay = Math.abs(dy), d = q39d(kind, dx, dy), code = d < rho ? 1 : 0,
   P = `(${n(p1)}, ${n(p2)})`, Q = `(${n(q1)}, ${n(q2)})`, how = kind === 0 ? `√(${n(ax)}² + ${n(ay)}²) = √${n(ax * ax + ay * ay)} = ${n(d)}` : kind === 1 ? `${n(ax)} + ${n(ay)} = ${n(d)}` : kind === 2 ? `the larger of ${n(ax)} and ${n(ay)}, which is ${n(d)}` : `1, because the points are different`; return {
   prompt: `Two states of a simulated relay are the points P = ${P} and Q = ${Q} of the plane. The certificate measures distance with the ${Q39M[kind]}. Enter d(P, Q), then 1 if Q lies in the open ball B(P, ${n(rho)}), 0 if not.`,
   answer: [d, code],
   hints: ['Start from the two coordinate gaps |x₁ − x₂| and |y₁ − y₂|. Euclidean: square, add, take the root. Taxicab: add them. Maximum: take the larger. Discrete: 0 for the same point, 1 for different points.', 'The open ball B(P, ρ) holds the points at distance strictly less than ρ from P; a point at distance exactly ρ is not in it.'],
   solution: `The coordinate gaps are |${n(p1)} − ${par(q1)}| = ${n(ax)} and |${n(p2)} − ${par(q2)}| = ${n(ay)}. In the ${Q39M[kind]}, d(P, Q) = ${how}. Q is in B(P, ${n(rho)}) exactly when d(P, Q) < ${n(rho)}. ${code ? `${n(d)} < ${n(rho)}, so Q is inside: the answer is 1.` : d === rho ? `The distance equals ${n(rho)}, so Q is on the edge, which an open ball leaves out: the answer is 0.` : `${n(d)} > ${n(rho)}, so Q is outside: the answer is 0.`}`,
   guidance: [
    { prompt: `What is the gap |${n(p1)} − ${par(q1)}| between the first coordinates?`, answer: [ax], labels: ['first gap'], explanation: `${n(p1)} − ${par(q1)} = ${n(p1 - q1)}, whose size is ${n(ax)}.` },
    { prompt: `What is the gap |${n(p2)} − ${par(q2)}| between the second coordinates?`, answer: [ay], labels: ['second gap'], explanation: `${n(p2)} − ${par(q2)} = ${n(p2 - q2)}, whose size is ${n(ay)}.` },
    { prompt: `Combine the gaps as the ${Q39M[kind]} does. What is d(P, Q)?`, answer: [d], labels: ['d(P, Q)'], explanation: `d(P, Q) = ${how}.` },
    { prompt: `Is d(P, Q) = ${n(d)} strictly less than ${n(rho)}? Enter 1 if Q is in B(P, ${n(rho)}), 0 if not.`, answer: [code], labels: ['in the ball (1 or 0)'], explanation: code ? `${n(d)} < ${n(rho)}, so Q is in the open ball.` : `${n(d)} is not less than ${n(rho)}, so Q is not in the open ball.` }
   ] }; }
 },
 /* Review: sum over k ≥ 0 of c(−1)ᵏxᵏ ÷ bᵏ has radius b (the sign does not change the size of a term); on [−r, r]
    the M-test bound is cb ÷ (b − r), kept to 2 decimal places. The plane point (u, v) has a whole euclidean distance
    from the origin (3-4-5, 6-8-10, 5-12-13 steps). */
 q40: {
  canonical: { c: 5, b: 6, r: 2, ti: 0, su: 1, sv: -1 },
  draw: R => tryDraw(() => { const b = R.int(3, 9); return { c: R.int(2, 9), b, r: R.int(1, b - 1), ti: R.int(0, TRIPLES.length - 1), su: R.pick([1, -1]), sv: R.pick([1, -1]) }; },
   p => places(p.c * p.b / (p.b - p.r), 2) && places(p.r / p.b, 2) && !(p.c === 4 && p.b === 5 && p.r === 1), { c: 5, b: 6, r: 2, ti: 0, su: 1, sv: -1 }),
  build: ({ c, b, r, ti, su, sv }) => { const S = c * b / (b - r), q = r / b, u = su * TRIPLES[ti][0], v = sv * TRIPLES[ti][1], d = Math.sqrt(u * u + v * v), inside = d < b; return {
   prompt: `For the final certificate the simulation core sums ${n(c)}(−1)ᵏxᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, … . Enter its radius of convergence, then the Weierstrass M-test bound on [−${n(r)}, ${n(r)}], then the euclidean distance from the origin to the point (${n(u)}, ${n(v)}) of the plane, where complex analysis will next evaluate such series.`,
   answer: [b, S, d],
   hints: ['The sign (−1)ᵏ never changes the size of a term, so the ratio test sees |x| ÷ b.', 'On [−r, r] each term is at most c(r ÷ b)ᵏ in size; sum that geometric series. The euclidean distance from the origin is the square root of the sum of the squared coordinates.'],
   solution: `The size of the ratio of consecutive terms is |x| ÷ ${n(b)}, below 1 exactly when |x| < ${n(b)}: the radius is ${n(b)}. On [−${n(r)}, ${n(r)}] each term is at most Mₖ = ${n(c)} × (${n(r)}/${n(b)})ᵏ, and these sum to ${n(c)} ÷ (1 − ${n(q)}) = ${n(S)}, which certifies uniform convergence there. The point (${n(u)}, ${n(v)}) is at distance √(${n(u * u)} + ${n(v * v)}) = √${n(d * d)} = ${n(d)} from the origin. In complex analysis the same series is summed at points of the plane, and it converges in the open ball of radius ${n(b)} about the origin, so this point lies ${inside ? 'inside' : d === b ? 'on the edge of' : 'outside'} that disc.`,
   guidance: [
    { prompt: `The ratio of consecutive terms has size |x| ÷ ${n(b)}. What is the radius of convergence?`, answer: [b], labels: ['radius of convergence'], explanation: `|x| ÷ ${n(b)} < 1 exactly when |x| < ${n(b)}, so the radius is ${n(b)}.` },
    { prompt: `On [−${n(r)}, ${n(r)}], Mₖ = ${n(c)} × ${n(q)}ᵏ. What is the sum of the Mₖ?`, answer: [S], labels: ['M-test bound'], explanation: `${n(c)} ÷ (1 − ${n(q)}) = ${n(c)} ÷ ${n(1 - q)} = ${n(S)}.` },
    { prompt: `What is the euclidean distance from (0, 0) to (${n(u)}, ${n(v)})?`, answer: [d], labels: ['distance'], explanation: `√(${par(u)}² + ${par(v)}²) = √${n(d * d)} = ${n(d)}.` }
   ] }; }
 }
});
})();
