/* Real analysis practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p7.js. */
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
const SUP = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
const r3 = x => Math.round(x * 1000) / 1000;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
/* Has at most d decimal places. */
const places = (x, d) => Math.abs(Math.round(x * Math.pow(10, d)) - x * Math.pow(10, d)) < 1e-9;
/* A quotient for the working: exact when it has at most 4 decimals, else "about" with 2. */
const approx = x => places(x, 4) ? n(x) : `about ${n(Math.round(x * 100) / 100)}`;
/* True when x·1000 is within 1e−6 of a rounding tie at 3 decimal places. */
const nearTie = x => Math.abs(Math.abs(x * 1000 - Math.floor(x * 1000)) - 0.5) < 1e-6;
/* A coefficient written in front of a letter: '' for 1. */
const co = x => x === 1 ? '' : n(x);
/* A signed term for a sum: sg(8) is ' + 8', sg(−3) is ' − 3'. */
const sg = x => x < 0 ? ` − ${n(-x)}` : ` + ${n(x)}`;
/* Sum of a list of products as written: ['1 × 2', '3 × 4'] gives '1 × 2 + 3 × 4'. */
const addUp = list => list.join(' + ');
/* The smallest whole n ≥ 1 for which test(n) holds, searching at most 5000 values (BigInt tests, so no rounding). */
const firstN = test => { for (let i = 1; i <= 5000; i++) if (test(BigInt(i))) return i; return 5000; };

/* ---- q31 Refining until the sums meet [5.1] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The ramping sump pump',
 brief: 'A sump pump in the fuel bay ramps its rate in a straight line, and the auditors want its total pinned as tightly as they ask.',
 labels: ['U − L', 'smallest n'], tolerance: 0.0005,
 gl: [['|f(b) − f(a)|'], ['U − L'], ['smallest n']]
}, {
 /* f is a straight line of slope m, rising from k at hour a (up = 1) or falling to k at hour b (up = 0), so it is monotone and
    |f(b) − f(a)| = m × len. U − L = m × len² ÷ n. ε = e ÷ 100, so the smallest n with U − L < ε is floor(100D ÷ e) + 1, in integers. */
 canonical: { up: 1, k: 2, m: 3, a: 1, len: 3, n0: 8, e: 6 },
 draw: R => ({ up: R.int(0, 1), k: R.int(1, 9), m: R.int(1, 6), a: R.int(0, 4), len: R.int(2, 5), n0: R.pick([4, 5, 8, 10, 20, 25]), e: R.pick([2, 3, 4, 5, 6, 8, 12, 15, 24]) }),
 build: ({ up, k, m, a, len, n0, e }) => { const b = a + len, K = m * b + k, f = x => up ? k + m * x : K - m * x, fa = f(a), fb = f(b), gap = Math.abs(fb - fa),
  D = gap * len, w = len / n0, diff = D / n0, eps = e / 100, N = Math.floor(100 * D / e) + 1, exact = (100 * D) % e === 0,
  expr = up ? `${n(k)} + ${co(m)}x` : `${n(K)} − ${co(m)}x`, dir = up ? 'increasing' : 'decreasing', top = up ? 'right' : 'left', bot = up ? 'left' : 'right'; return {
  prompt: `A sump pump in the fuel bay ${up ? 'speeds up' : 'slows down'} steadily: at hour x it moves f(x) = ${expr} litres per hour, for the hours x from ${n(a)} to ${n(b)}. Split [${n(a)}, ${n(b)}] into n equal pieces and let L and U be the lower and upper sums of f for that partition. Enter U − L for ${n(n0)} equal pieces, then the smallest number n of equal pieces for which U − L < ${n(eps)} (type it without commas).`,
  answer: [diff, N],
  hints: ['A straight line that only rises or only falls is monotone, so on each piece its smallest and largest values sit at the two ends. The inside values cancel in U − L, leaving (difference of the end values) × (width of one piece).', 'U − L for n equal pieces is a fixed number divided by n. Solve “that number ÷ n < the tolerance” for n; the inequality is strict, so when the division comes out whole, the smallest n is one more.'],
  solution: `f(x) = ${expr} is ${dir} on [${n(a)}, ${n(b)}], so on each piece the largest value is at the ${top} end and the smallest at the ${bot} end. Only the end values survive in U − L: U − L = |f(${n(b)}) − f(${n(a)})| × (${n(b)} − ${n(a)}) ÷ n = ${n(gap)} × ${n(len)} ÷ n = ${n(D)} ÷ n. For ${n(n0)} pieces of width ${n(w)}, U − L = ${n(gap)} × ${n(w)} = ${n(diff)}. U − L < ${n(eps)} means n > ${n(D)} ÷ ${n(eps)} = ${approx(100 * D / e)}${exact ? ', and n must be strictly larger' : ''}, so the smallest n is ${n(N)}.`,
  guidance: [
   { prompt: `f(x) = ${expr} is ${dir} on [${n(a)}, ${n(b)}]. After the inside values cancel, U − L is |f(${n(b)}) − f(${n(a)})| times the width of one piece. What is |f(${n(b)}) − f(${n(a)})|?`, answer: [gap], explanation: `f(${n(a)}) = ${n(fa)} and f(${n(b)}) = ${n(fb)}, so the difference of the end values is ${n(gap)}.` },
   { prompt: `With ${n(n0)} equal pieces each piece has width (${n(b)} − ${n(a)}) ÷ ${n(n0)} = ${n(w)}. What is U − L?`, answer: [diff], explanation: `U − L = ${n(gap)} × ${n(w)} = ${n(diff)}.` },
   { prompt: `For n equal pieces U − L = ${n(D)} ÷ n. What is the smallest n with ${n(D)} ÷ n < ${n(eps)}?`, answer: [N], explanation: `${n(D)} ÷ n < ${n(eps)} means n > ${n(D)} ÷ ${n(eps)} = ${approx(100 * D / e)}. The smallest whole number strictly above it is ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Two readings and a tolerance',
 brief: 'A transfer pump was certified at only two moments, and the auditors need to know how finely the shift must be cut and read to meet their tolerance.',
 labels: ['U − L for one piece', 'smallest n', 'partition points'], tolerance: 0.0005,
 gl: [['U − L for one piece'], ['smallest n'], ['partition points']]
}, {
 /* A monotone rate with end readings ra and rb = ra ± d over [a, a + len]. One piece: U − L = d × len = G. n pieces: G ÷ n.
    ε = e ÷ 100, smallest n = floor(100G ÷ e) + 1. n equal pieces have n + 1 partition points. */
 canonical: { dir: 1, ra: 12, d: 7, a: 2, len: 4, e: 8 },
 draw: R => { const d = R.int(3, 14); return { dir: R.int(0, 1), ra: d + R.int(2, 20), d, a: R.int(0, 5), len: R.int(2, 6), e: R.pick([4, 5, 8, 10, 20, 25]) }; },
 build: ({ dir, ra, d, a, len, e }) => { const b = a + len, rb = dir ? ra + d : ra - d, G1 = d * len, eps = e / 100, N = Math.floor(100 * G1 / e) + 1, exact = (100 * G1) % e === 0; return {
  prompt: `The audit has only two certified rate readings for a transfer pump: ${n(ra)} litres per hour at hour ${n(a)} and ${n(rb)} litres per hour at hour ${n(b)}. The crew confirms that the rate never ${dir ? 'falls' : 'rises'} in between, so it is monotone on [${n(a)}, ${n(b)}]. The auditors will sign only when U − L < ${n(eps)}, where L and U are the lower and upper sums of the rate for equal pieces. Enter U − L when the whole interval is a single piece, then the smallest number n of equal pieces for which U − L < ${n(eps)} (type it without commas), then the number of partition points the crew must read the meter at for that n (the points where a piece starts or ends, counting both ends of the interval).`,
  answer: [G1, N, N + 1],
  hints: ['On each piece of a monotone function the smallest and largest values sit at the ends, so for n equal pieces U − L = |f(b) − f(a)| × (b − a) ÷ n. A single piece is the case n = 1.', 'Solve “U − L < tolerance” for n; the inequality is strict. A partition into n pieces has one more point than pieces: every piece has a start and an end, and neighbouring pieces share a point.'],
  solution: `Only the end readings matter for a monotone rate: U − L = |f(${n(b)}) − f(${n(a)})| × (${n(b)} − ${n(a)}) ÷ n = ${n(d)} × ${n(len)} ÷ n = ${n(G1)} ÷ n. For a single piece, n = 1, U − L = ${n(G1)}. U − L < ${n(eps)} means n > ${n(G1)} ÷ ${n(eps)} = ${approx(100 * G1 / e)}${exact ? ', and n must be strictly larger' : ''}, so the smallest n is ${n(N)}. Cutting [${n(a)}, ${n(b)}] into ${n(N)} pieces needs ${n(N)} + 1 = ${n(N + 1)} partition points.`,
  guidance: [
   { prompt: `The readings are ${n(ra)} at hour ${n(a)} and ${n(rb)} at hour ${n(b)}, and the rate is monotone. For a single piece, U − L is the difference of the readings times the length of the interval. What is U − L for one piece?`, answer: [G1], explanation: `|${n(rb)} − ${n(ra)}| = ${n(d)} and the length is ${n(b)} − ${n(a)} = ${n(len)}, so U − L = ${n(d)} × ${n(len)} = ${n(G1)}.` },
   { prompt: `For n equal pieces U − L = ${n(G1)} ÷ n. What is the smallest n with ${n(G1)} ÷ n < ${n(eps)}?`, answer: [N], explanation: `${n(G1)} ÷ n < ${n(eps)} means n > ${n(G1)} ÷ ${n(eps)} = ${approx(100 * G1 / e)}. The smallest whole number strictly above it is ${n(N)}.` },
   { prompt: `The interval is cut into ${n(N)} equal pieces. How many partition points are there, counting both ends?`, answer: [N + 1], explanation: `${n(N)} pieces have ${n(N)} + 1 = ${n(N + 1)} partition points: one at the start, and one at the end of each piece.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'Beating the crew’s own partition',
 brief: 'The crew cut the interval by hand into uneven pieces, and the auditors want to know how many equal pieces would do far better.',
 labels: ['L(P, f)', 'U(P, f)', 'smallest n'], tolerance: 0.01,
 gl: [['L(P, f)'], ['U(P, f)'], ['smallest n']]
}, {
 /* P = {x0, x1, x2, x3} with whole-number widths 1–3. L and U add (end value) × width piece by piece, as in q30.
    The equal-pieces gap is D ÷ n with D = |f(b) − f(a)|(b − a); it is below g ÷ q (g = U − L of P) when n > qD ÷ g, so the smallest n is floor(qD ÷ g) + 1, in integers. */
 canonical: { kind: 0, a: 1, w1: 1, w2: 2, w3: 2, q: 5 },
 draw: R => ({ kind: R.int(0, 2), a: R.int(0, 3), w1: R.int(1, 3), w2: R.int(1, 3), w3: R.int(1, 3), q: R.pick([2, 4, 5, 10]) }),
 build: ({ kind, a, w1, w2, w3, q }) => { const F = [{ t: 'x²', f: x => x * x, up: true }, { t: 'x³', f: x => x * x * x, up: true }, { t: '100 − x²', f: x => 100 - x * x, up: false }][kind],
  pts = [a, a + w1, a + w1 + w2, a + w1 + w2 + w3], ws = [w1, w2, w3], b = pts[3], dir = F.up ? 'increasing' : 'decreasing',
  lows = [0, 1, 2].map(i => F.f(pts[F.up ? i : i + 1])), highs = [0, 1, 2].map(i => F.f(pts[F.up ? i + 1 : i])),
  L = lows.reduce((s, v, i) => s + v * ws[i], 0), U = highs.reduce((s, v, i) => s + v * ws[i], 0), g = U - L,
  D = Math.abs(F.f(b) - F.f(a)) * (b - a), N = Math.floor(q * D / g) + 1, exact = (q * D) % g === 0,
  frac = { 2: 'a half', 4: 'a quarter', 5: 'a fifth', 10: 'a tenth' }[q], set = `{${pts.map(n).join(', ')}}`,
  lt = lows.map((v, i) => `${n(v)} × ${n(ws[i])}`), ut = highs.map((v, i) => `${n(v)} × ${n(ws[i])}`); return {
  prompt: `The crew cut the hours from ${n(a)} to ${n(b)} by hand into the partition P = ${set} and measured the fuel rate f(x) = ${F.t} litres per hour, which is ${dir} there. Enter the lower sum L(P, f), then the upper sum U(P, f). Then enter the smallest number n of equal pieces for which U − L is less than ${frac} of the crew’s own gap U(P, f) − L(P, f) (type it without commas).`,
  answer: [L, U, N],
  hints: ['The partition has three pieces with the lengths of the gaps between its points. f is monotone, so on each piece the smallest and largest values are at the two ends: decide which end gives which. L adds smallest × length and U adds largest × length.', 'For n equal pieces U − L = |f(b) − f(a)| × (b − a) ÷ n. Write “that < (the crew’s gap) ÷ the fraction asked for” and solve for n. The inequality is strict.'],
  solution: `f(x) = ${F.t} is ${dir}, so on each piece the smallest value is at the ${F.up ? 'left' : 'right'} end and the largest at the ${F.up ? 'right' : 'left'} end. L(P, f) = ${addUp(lt)} = ${n(L)} and U(P, f) = ${addUp(ut)} = ${n(U)}, so the crew’s gap is ${n(U)} − ${n(L)} = ${n(g)}. For n equal pieces U − L = |f(${n(b)}) − f(${n(a)})| × (${n(b)} − ${n(a)}) ÷ n = ${n(D)} ÷ n. We need ${n(D)} ÷ n < ${n(g)} ÷ ${n(q)}, that is n > ${n(q)} × ${n(D)} ÷ ${n(g)} = ${approx(q * D / g)}${exact ? ', strictly' : ''}, so the smallest n is ${n(N)}.`,
  guidance: [
   { prompt: `The pieces of P = ${set} have lengths ${n(w1)}, ${n(w2)} and ${n(w3)}. On each piece take the ${F.up ? 'left' : 'right'} end value (the smallest) times the length and add. What is L(P, f)?`, answer: [L], explanation: `L(P, f) = ${addUp(lt)} = ${n(L)}.` },
   { prompt: `Now take the ${F.up ? 'right' : 'left'} end value (the largest) times the length on each piece and add. What is U(P, f)?`, answer: [U], explanation: `U(P, f) = ${addUp(ut)} = ${n(U)}.` },
   { prompt: `The crew’s gap is ${n(U)} − ${n(L)} = ${n(g)}, and for n equal pieces U − L = ${n(D)} ÷ n. What is the smallest n with ${n(D)} ÷ n < ${n(g)} ÷ ${n(q)}?`, answer: [N], explanation: `${n(D)} ÷ n < ${n(g)} ÷ ${n(q)} means n > ${n(q)} × ${n(D)} ÷ ${n(g)} = ${approx(q * D / g)}. The smallest whole number strictly above it is ${n(N)}.` }
  ] }; }
});

/* ---- q32 Properties of the integral: additivity and bounds [5.2] ---- */

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The surging recirculation pump',
 brief: 'The cooling loop’s recirculation pump surges and eases, and the audit needs one certified stretch checked against hard bounds.',
 labels: ['integral over the stretch (litres)', 'lower bound (litres)', 'upper bound (litres)'], tolerance: 0.01,
 gl: [['integral of the piece (litres)'], ['m'], ['M'], ['lower bound (litres)', 'upper bound (litres)']]
}, {
 /* f(t) = k − (t − h)², a downward parabola, written out as −t² + 2ht + (k − h²). b and c are multiples of 3, so every integral
    k x − ((x − h)³ + h³) ÷ 3 from 0 to x is a whole number (x³ ≡ x mod 3). k exceeds the larger of h² and (c − h)², so f is positive on [0, c].
    On [b, c]: m is the smaller end value (a downward parabola is lowest at an end), M is k when t = h lies in [b, c], else the larger end value. */
 canonical: { h: 5, k: 30, b: 3, c: 6 },
 draw: R => { const b = 3 * R.int(1, 2), c = b + 3 * R.int(1, b === 3 ? 2 : 1), h = R.int(1, 8); return { h, k: Math.max(h * h, (c - h) * (c - h)) + R.int(1, 9), b, c }; },
 build: ({ h, k, b, c }) => { const I = x => k * x - (Math.pow(x - h, 3) + h * h * h) / 3, f = t => k - (t - h) * (t - h), tot = I(c), first = I(b), piece = tot - first, fb = f(b), fc = f(c),
  inside = h >= b && h <= c, mm = Math.min(fb, fc), MM = inside ? k : Math.max(fb, fc), len = c - b, lo = mm * len, hi = MM * len, c0 = k - h * h,
  ftext = `−t²${sg(2 * h)}t${c0 === 0 ? '' : sg(c0)}`; return {
  prompt: `The cooling loop’s recirculation pump surges and eases: its flow is f(t) = ${ftext} litres per minute, t minutes into a cycle. The loop’s meter certifies that the integral of f from 0 to ${n(c)} is ${n(tot)} litres and the integral of f from 0 to ${n(b)} is ${n(first)} litres. Enter the integral of f from ${n(b)} to ${n(c)}, then the lower bound m × (${n(c)} − ${n(b)}) and the upper bound M × (${n(c)} − ${n(b)}), where m and M are the smallest and largest values of f on [${n(b)}, ${n(c)}].`,
  answer: [piece, lo, hi],
  hints: ['Additivity: the integral over a whole interval is the integral over its first part plus the integral over the rest.', 'Write f as k − (t − h)² for a number h and a number k. Its graph opens downward, so its highest point is at t = h; if that point lies inside the interval the largest value is k, otherwise the largest value is at the end nearer h. The smallest value of such a curve on an interval is always at one of the two ends.'],
  solution: `By additivity, the integral from 0 to ${n(c)} is the integral from 0 to ${n(b)} plus the integral from ${n(b)} to ${n(c)}, so the piece is ${n(tot)} − ${n(first)} = ${n(piece)} litres. f(t) = ${n(k)} − (t − ${n(h)})², so f(${n(b)}) = ${n(fb)} and f(${n(c)}) = ${n(fc)}. The curve opens downward, so its smallest value on the interval is at an end: m = ${n(mm)}. ${inside ? `The highest point t = ${n(h)} lies in [${n(b)}, ${n(c)}], so M = ${n(k)}` : `The highest point t = ${n(h)} is outside [${n(b)}, ${n(c)}], so M is the larger end value, ${n(MM)}`}. Since m ≤ f(t) ≤ M on the piece, monotonicity of the integral gives ${n(mm)} × ${n(len)} = ${n(lo)} ≤ ${n(piece)} ≤ ${n(MM)} × ${n(len)} = ${n(hi)}, and the certified piece passes the check.`,
  guidance: [
   { prompt: `The integral from 0 to ${n(c)} is ${n(tot)} and the integral from 0 to ${n(b)} is ${n(first)}. By additivity, what is the integral from ${n(b)} to ${n(c)}?`, answer: [piece], explanation: `The whole is the first part plus the rest, so the rest is ${n(tot)} − ${n(first)} = ${n(piece)} litres.` },
   { prompt: `f(t) = ${n(k)} − (t − ${n(h)})² opens downward. What is its smallest value m on [${n(b)}, ${n(c)}]? Compare the two end values.`, answer: [mm], explanation: `f(${n(b)}) = ${n(fb)} and f(${n(c)}) = ${n(fc)}. A downward curve is lowest at an end of the interval, so m = ${n(mm)}.` },
   { prompt: `What is the largest value M of f on [${n(b)}, ${n(c)}]?`, answer: [MM], explanation: inside ? `The highest point t = ${n(h)} lies in the interval, where f = ${n(k)}, so M = ${n(k)}.` : `The highest point t = ${n(h)} lies outside the interval, so f is monotone on it and the largest value is at the end nearer ${n(h)}: M = ${n(MM)}.` },
   { prompt: `The piece has length ${n(len)}. What are m × ${n(len)} and M × ${n(len)}?`, answer: [lo, hi], labels: ['lower bound (litres)', 'upper bound (litres)'], explanation: `${n(mm)} × ${n(len)} = ${n(lo)} and ${n(MM)} × ${n(len)} = ${n(hi)}. The piece, ${n(piece)} litres, lies between them.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Is the middle stretch believable?',
 brief: 'Three certified totals leave one stretch of the shift unmeasured, and the crew’s note about it has to be checked against the totals.',
 labels: ['integral over the stretch (litres)', 'average rate (litres per hour)', 'consistent (1 or 0)'], tolerance: 0.01,
 gl: [['integral over the stretch (litres)'], ['average rate (litres per hour)'], ['consistent (1 or 0)']]
}, {
 /* The shift [0, c] is cut at s and e = s + len. The meter certifies the integral over [0, c], over [0, s] and over [e, c].
    The piece is avg0 × len with avg0 a whole number, so the average is a whole number. Consistent draws have m < avg0 < M with margin 1;
    inconsistent draws put avg0 outside [m, M] by at least 1. Code 1 when m ≤ average ≤ M. */
 canonical: { s: 2, len: 3, tail: 2, P1: 34, P3: 21, m: 4, M: 9, avg0: 12 },
 draw: R => { const m = R.int(3, 12), M = m + R.int(3, 8), mode = R.int(0, 2), avg0 = mode === 0 ? R.int(m + 1, M - 1) : mode === 1 ? M + R.int(1, 4) : m - R.int(1, m - 2);
  return { s: R.int(2, 5), len: R.int(2, 4), tail: R.int(1, 3), P1: R.int(10, 60), P3: R.int(10, 60), m, M, avg0 }; },
 build: ({ s, len, tail, P1, P3, m, M, avg0 }) => { const e = s + len, c = e + tail, piece = avg0 * len, T = P1 + piece + P3, code = avg0 >= m && avg0 <= M ? 1 : 0; return {
  prompt: `A transfer pump’s log for a ${n(c)}-hour shift is certified by the meter: the integral of its rate f from 0 to ${n(c)} is ${n(T)} litres, the integral from 0 to ${n(s)} is ${n(P1)} litres, and the integral from ${n(e)} to ${n(c)} is ${n(P3)} litres. The crew’s note says that between hour ${n(s)} and hour ${n(e)} the rate stayed between ${n(m)} and ${n(M)} litres per hour. If that is true, the integral over the stretch lies between m × length and M × length, so the average rate over it (the integral ÷ the length) lies between ${n(m)} and ${n(M)}. Enter the integral of f from ${n(s)} to ${n(e)}, then the average rate over that stretch, then 1 if the average lies between ${n(m)} and ${n(M)} (the note is consistent with the meter) and 0 if not.`,
  answer: [piece, avg0, code],
  hints: ['Additivity works for any number of cuts: the whole integral is the sum of the integrals over the pieces, so the middle piece is the whole minus the other two.', 'The average rate over a stretch is its integral divided by its length. Compare it with the two rates the note names: the note can only be true if the average lies between them.'],
  solution: `By additivity the integral from 0 to ${n(c)} is the sum of the three pieces, so the integral from ${n(s)} to ${n(e)} is ${n(T)} − ${n(P1)} − ${n(P3)} = ${n(piece)} litres. The stretch is ${n(e)} − ${n(s)} = ${n(len)} hours long, so the average rate is ${n(piece)} ÷ ${n(len)} = ${n(avg0)} litres per hour. ${code ? `${n(m)} ≤ ${n(avg0)} ≤ ${n(M)}, so the note is consistent with the meter: the answer is 1.` : `${n(avg0)} is ${avg0 > M ? `above ${n(M)}` : `below ${n(m)}`}, so no rate that stays between ${n(m)} and ${n(M)} could give that integral: the note contradicts the meter and the answer is 0.`}`,
  guidance: [
   { prompt: `The whole integral is ${n(T)}, the first part is ${n(P1)} and the last part is ${n(P3)}. By additivity, what is the integral from ${n(s)} to ${n(e)}?`, answer: [piece], explanation: `The whole is the sum of its three pieces, so the middle one is ${n(T)} − ${n(P1)} − ${n(P3)} = ${n(piece)} litres.` },
   { prompt: `The stretch from hour ${n(s)} to hour ${n(e)} is ${n(len)} hours long. What is the average rate over it, in litres per hour?`, answer: [avg0], explanation: `${n(piece)} ÷ ${n(len)} = ${n(avg0)} litres per hour.` },
   { prompt: `The note says the rate stayed between ${n(m)} and ${n(M)}. Enter 1 if an average of ${n(avg0)} is possible for such a rate, and 0 if not.`, answer: [code], explanation: code ? `${n(m)} ≤ ${n(avg0)} ≤ ${n(M)}, so the note can be true.` : `${n(avg0)} is outside the range from ${n(m)} to ${n(M)}, so the note cannot be true.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q21', title: 'The booster pump’s hills and valleys',
 brief: 'The booster pump’s flow rises, dips and rises again, so the stretch’s hard bounds depend on where the turning points fall.',
 labels: ['integral over the stretch (litres)', 'lower bound (litres)', 'upper bound (litres)'], tolerance: 0.005,
 gl: [['integral of the piece (litres)'], ['m'], ['M'], ['lower bound (litres)', 'upper bound (litres)']]
}, {
 /* f(t) = t³ − 6t² + 9t + k = t(t − 3)² + k, with f′(t) = 3(t − 1)(t − 3): a local peak 4 + k at t = 1 and a local valley k at t = 3.
    The integral from 0 to x is x⁴ ÷ 4 − 2x³ + 4.5x² + kx, a multiple of 0.25. On [s, e] the extremes are the end values and, when inside, f(1) and f(3):
    the extreme value theorem for a continuous f on a closed interval. 1 ≤ s, e − s ≥ 2, e ≤ 6. */
 canonical: { k: 3, s: 2, e: 6 },
 draw: R => { const s = R.int(1, 4), e = s + R.int(2, 6 - s); return { k: R.int(1, 9), s, e }; },
 build: ({ k, s, e }) => { const f = t => t * t * t - 6 * t * t + 9 * t + k, I = x => x * x * x * x / 4 - 2 * x * x * x + 4.5 * x * x + k * x, tot = I(e), first = I(s), piece = tot - first, len = e - s,
  cand = [[s, f(s)], [e, f(e)]].concat(s <= 1 && e >= 1 ? [[1, f(1)]] : [], s <= 3 && e >= 3 ? [[3, f(3)]] : []), mm = Math.min(...cand.map(c => c[1])), MM = Math.max(...cand.map(c => c[1])),
  at = v => cand.filter(c => c[1] === v).map(c => c[0])[0], lo = mm * len, hi = MM * len, turns = cand.slice(2).map(c => `f(${n(c[0])}) = ${n(c[1])}`),
  list = `f(${n(s)}) = ${n(f(s))}, f(${n(e)}) = ${n(f(e))}${turns.length ? `, ${turns.join(', ')}` : ''}`; return {
  prompt: `A booster pump’s flow is f(t) = t³ − 6t² + 9t + ${n(k)} litres per hour, t hours into a cycle, for 0 ≤ t ≤ 6. Its flow rises until t = 1, falls from t = 1 to t = 3, and rises again after t = 3. The meter certifies that the integral of f from 0 to ${n(e)} is ${n(tot)} litres and the integral of f from 0 to ${n(s)} is ${n(first)} litres. Enter the integral of f from ${n(s)} to ${n(e)}, then the lower bound m × (${n(e)} − ${n(s)}) and the upper bound M × (${n(e)} − ${n(s)}), where m and M are the smallest and largest values of f on [${n(s)}, ${n(e)}].`,
  answer: [piece, lo, hi],
  hints: ['Additivity: the integral over a whole interval is the integral over its first part plus the integral over the rest.', 'A continuous function on a closed interval reaches its smallest and largest values either at an end of the interval or at a point where it turns round. Here the turning points are t = 1 and t = 3: include one only when it lies inside the interval, then compare all the values you have listed.'],
  solution: `By additivity the integral from ${n(s)} to ${n(e)} is ${n(tot)} − ${n(first)} = ${n(piece)} litres. The values that can be extreme on [${n(s)}, ${n(e)}] are the two ends and any turning point inside it: ${list}. The smallest is m = ${n(mm)} and the largest is M = ${n(MM)}. Since m ≤ f(t) ≤ M on the piece, ${n(mm)} × ${n(len)} = ${n(lo)} ≤ ${n(piece)} ≤ ${n(MM)} × ${n(len)} = ${n(hi)}, and the certified piece passes the check.`,
  guidance: [
   { prompt: `The integral from 0 to ${n(e)} is ${n(tot)} and the integral from 0 to ${n(s)} is ${n(first)}. By additivity, what is the integral from ${n(s)} to ${n(e)}?`, answer: [piece], explanation: `The whole is the first part plus the rest, so the rest is ${n(tot)} − ${n(first)} = ${n(piece)} litres.` },
   { prompt: `The interval is [${n(s)}, ${n(e)}]. The turning points t = 1 and t = 3 count only when they lie inside it. Compare f at both ends and at every turning point inside. What is the smallest value m?`, answer: [mm], explanation: `${list}. The smallest is m = ${n(mm)}, reached at t = ${n(at(mm))}.` },
   { prompt: `From the same list of values, what is the largest value M?`, answer: [MM], explanation: `The largest value in the list ${list} is M = ${n(MM)}, reached at t = ${n(at(MM))}.` },
   { prompt: `The piece has length ${n(len)}. What are m × ${n(len)} and M × ${n(len)}?`, answer: [lo, hi], labels: ['lower bound (litres)', 'upper bound (litres)'], explanation: `${n(mm)} × ${n(len)} = ${n(lo)} and ${n(MM)} × ${n(len)} = ${n(hi)}. The piece, ${n(piece)} litres, lies between them.` }
  ] }; }
});

/* ---- q33 The fundamental theorem made precise [5.3] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The hose tally that starts late',
 brief: 'A refuelling hose was tallied from the hour it first ran, and the audit wants two tally readings and a straight answer about its slope at a rate change.',
 labels: ['tally before the switch (litres)', 'tally after the switch (litres)', 'differentiable (1 or 0)'], tolerance: 0.01,
 gl: [['tally before the switch (litres)'], ['tally after the switch (litres)'], ['slope from the right'], ['differentiable (1 or 0)']]
}, {
 /* Tally from hour a: rate p on [a, s), a single reading r at s, rate q on (s, s + 4]. F(x) = ∫ₐˣ f. x0 is between a and s, x1 is after s.
    F(x0) = p(x0 − a), F(x1) = p(s − a) + q(x1 − s). Differentiable at s exactly when p = q (code 1); a third of the draws have p = q. q may be 0. */
 canonical: { a: 2, p: 5, q: 3, r: 8, s: 5, x0: 4, x1: 7 },
 draw: R => { const a = R.int(1, 3), s = a + R.int(2, 4), p = R.int(2, 9), q = R.int(0, 2) === 0 ? p : R.except(0, 9, [p, 1]); return { a, p, q, r: R.except(1, 12, [p, q]), s, x0: a + R.int(1, s - a - 1), x1: s + R.int(1, 4) }; },
 build: ({ a, p, q, r, s, x0, x1 }) => { const F0 = p * (x0 - a), Fs = p * (s - a), F1 = Fs + q * (x1 - s), code = p === q ? 1 : 0; return {
  prompt: `A refuelling hose is tallied from hour ${n(a)}. Its flow is f(t) = ${n(p)} litres per hour for ${n(a)} ≤ t < ${n(s)}, one stray reading f(${n(s)}) = ${n(r)} at the instant t = ${n(s)}, and f(t) = ${n(q)} litres per hour for ${n(s)} < t ≤ ${n(s + 4)}. The tally is F(x) = the integral of f from ${n(a)} to x. Enter F(${n(x0)}), then F(${n(x1)}), then 1 if F is differentiable at x = ${n(s)}, 0 if not.`,
  answer: [F0, F1, code],
  hints: ['The tally starts at the first hour given, so F there is 0. A single stray reading changes no integral, so each stretch adds rate × time.', 'F is differentiable at the switch exactly when the slope of F from the left equals the slope from the right; those slopes are the rates just before and just after the switch.'],
  solution: `The tally starts at hour ${n(a)}. Up to ${n(x0)} the rate is ${n(p)}, so F(${n(x0)}) = ${n(p)} × (${n(x0)} − ${n(a)}) = ${n(F0)}. At the switch F(${n(s)}) = ${n(p)} × (${n(s)} − ${n(a)}) = ${n(Fs)}; the stray reading at t = ${n(s)} adds nothing. After that the rate is ${n(q)}, so F(${n(x1)}) = ${n(Fs)} + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(F1)}. The difference quotients of F at ${n(s)} approach ${n(p)} from the left and ${n(q)} from the right. ${code ? `They agree, so F is differentiable at ${n(s)} with F′(${n(s)}) = ${n(p)}, even though f(${n(s)}) = ${n(r)} and f is not continuous there. The answer is 1.` : `They differ, so F has a corner and is not differentiable at ${n(s)}. The answer is 0.`}`,
  guidance: [
   { prompt: `From hour ${n(a)} to hour ${n(x0)} the rate is ${n(p)} litres per hour. What is F(${n(x0)})?`, answer: [F0], explanation: `F(${n(x0)}) = ${n(p)} × (${n(x0)} − ${n(a)}) = ${n(F0)} litres.` },
   { prompt: `F(${n(s)}) = ${n(Fs)}, and after hour ${n(s)} the rate is ${n(q)}. What is F(${n(x1)})?`, answer: [F1], explanation: `F(${n(x1)}) = ${n(Fs)} + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(F1)} litres.` },
   { prompt: `For a small h > 0, (F(${n(s)} + h) − F(${n(s)})) ÷ h is the average rate just after t = ${n(s)}. What number do these quotients approach as h shrinks?`, answer: [q], explanation: `Just after t = ${n(s)} the rate is ${n(q)}, so F(${n(s)} + h) − F(${n(s)}) = ${n(q)}h and the quotient is ${n(q)} for every small h.` },
   { prompt: `From the left the quotients approach ${n(p)}, and from the right ${n(q)}. Enter 1 if F is differentiable at ${n(s)}, 0 if not.`, answer: [code], explanation: code ? `Both sides give ${n(p)}, so F′(${n(s)}) = ${n(p)} exists, although f itself is ${n(r)} for one instant.` : `${n(p)} and ${n(q)} differ, so the two one-sided limits disagree and F′(${n(s)}) does not exist.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'A two-stage burn schedule',
 brief: 'The hangar’s burn schedule switches rate twice, and the audit needs the running total and a count of the switches where the total is smooth.',
 labels: ['total at the second switch (litres)', 'total later (litres)', 'smooth switches (0, 1 or 2)'], tolerance: 0.01,
 gl: [['total at the second switch (litres)'], ['total later (litres)'], ['smooth switches (0, 1 or 2)']]
}, {
 /* Rate p on [0, s1), q on (s1, s2), w on (s2, x1 + 1], with a stray reading at each switch instant. F(s2) = p s1 + q (s2 − s1),
    F(x1) = F(s2) + w (x1 − s2). F is differentiable at s1 exactly when p = q and at s2 exactly when q = w. Count = (p = q) + (q = w); the three rates are never all equal. */
 canonical: { p: 4, q: 6, w: 6, s1: 2, s2: 5, x1: 7 },
 draw: R => tryDraw(() => { const p = R.int(2, 9), q = R.int(0, 2) === 0 ? p : R.except(2, 9, [p]), w = R.int(0, 2) === 0 ? q : R.except(2, 9, [q]), s1 = R.int(1, 3), s2 = s1 + R.int(1, 3); return { p, q, w, s1, s2, x1: s2 + R.int(1, 3) }; },
  p => !(p.p === p.q && p.q === p.w), { p: 4, q: 6, w: 6, s1: 2, s2: 5, x1: 7 }),
 build: ({ p, q, w, s1, s2, x1 }) => { const Fs1 = p * s1, Fs2 = Fs1 + q * (s2 - s1), F1 = Fs2 + w * (x1 - s2), cnt = (p === q ? 1 : 0) + (q === w ? 1 : 0); return {
  prompt: `The hangar’s burn schedule gives an engine fuel at f(t) = ${n(p)} litres per hour for 0 ≤ t < ${n(s1)}, then ${n(q)} litres per hour for ${n(s1)} < t < ${n(s2)}, then ${n(w)} litres per hour for ${n(s2)} < t ≤ ${n(x1 + 1)}. The log also holds one stray reading at each of the two switch instants t = ${n(s1)} and t = ${n(s2)}. The running total is F(x) = the integral of f from 0 to x. Enter F(${n(s2)}), then F(${n(x1)}), then how many of the two switch times F is differentiable at (0, 1 or 2).`,
  answer: [Fs2, F1, cnt],
  hints: ['A single stray reading changes no integral, so the running total adds rate × time for each stretch, one stretch after another.', 'At each switch compare the rate just before with the rate just after: F is differentiable there exactly when they are equal. Count the switches where they are.'],
  solution: `Up to t = ${n(s1)} the rate is ${n(p)}, so F(${n(s1)}) = ${n(p)} × ${n(s1)} = ${n(Fs1)}. Then the rate is ${n(q)} until t = ${n(s2)}, so F(${n(s2)}) = ${n(Fs1)} + ${n(q)} × (${n(s2)} − ${n(s1)}) = ${n(Fs2)}. After that the rate is ${n(w)}, so F(${n(x1)}) = ${n(Fs2)} + ${n(w)} × (${n(x1)} − ${n(s2)}) = ${n(F1)}. At t = ${n(s1)} the slopes of F are ${n(p)} on the left and ${n(q)} on the right: ${p === q ? 'equal, so F is differentiable there' : 'different, so F has a corner there'}. At t = ${n(s2)} they are ${n(q)} and ${n(w)}: ${q === w ? 'equal, so F is differentiable there' : 'different, so F has a corner there'}. So F is differentiable at ${n(cnt)} of the two switch times.`,
  guidance: [
   { prompt: `The rate is ${n(p)} until t = ${n(s1)} and then ${n(q)} until t = ${n(s2)}. What is F(${n(s2)})?`, answer: [Fs2], explanation: `F(${n(s2)}) = ${n(p)} × ${n(s1)} + ${n(q)} × (${n(s2)} − ${n(s1)}) = ${n(Fs1)} + ${n(q * (s2 - s1))} = ${n(Fs2)} litres.` },
   { prompt: `After t = ${n(s2)} the rate is ${n(w)}. What is F(${n(x1)})?`, answer: [F1], explanation: `F(${n(x1)}) = ${n(Fs2)} + ${n(w)} × (${n(x1)} − ${n(s2)}) = ${n(F1)} litres.` },
   { prompt: `The slopes of F are ${n(p)} before t = ${n(s1)}, ${n(q)} between the switches and ${n(w)} after t = ${n(s2)}. At how many of the two switch times is F differentiable (the slope from the left equals the slope from the right)?`, answer: [cnt], explanation: `At t = ${n(s1)} the slopes ${n(p)} and ${n(q)} ${p === q ? 'agree' : 'differ'}; at t = ${n(s2)} the slopes ${n(q)} and ${n(w)} ${q === w ? 'agree' : 'differ'}. That gives ${n(cnt)}.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q24', title: 'The throttle that ramps, then holds',
 brief: 'A throttle opens smoothly and then holds steady, and the audit wants to know whether the running total stays smooth where the two phases meet.',
 labels: ['total at the change (litres)', 'total later (litres)', 'differentiable (1 or 0)'], tolerance: 0.01,
 gl: [['total at the change (litres)'], ['total later (litres)'], ['slope from the left'], ['differentiable (1 or 0)']]
}, {
 /* f(t) = a t for 0 ≤ t < s, f(t) = q for s ≤ t ≤ s + 4. F(s) = a s² ÷ 2 (the area of a triangle), F(x1) = F(s) + q(x1 − s).
    The slope of F from the left at s is the limit of a t, which is a s; from the right it is q. Differentiable exactly when q = a s (f continuous at s).
    About half the draws have q = a s. */
 canonical: { a: 2, s: 3, q: 6, x1: 5 },
 draw: R => tryDraw(() => { const a = R.int(1, 4), s = R.int(2, 5), as = a * s; return { a, s, q: R.int(0, 1) ? as : as + R.pick([-1, 1]) * R.int(1, Math.min(5, as - 1)), x1: s + R.int(1, 4) }; }, p => p.q >= 2, { a: 2, s: 3, q: 6, x1: 5 }),
 build: ({ a, s, q, x1 }) => { const as = a * s, Fs = a * s * s / 2, F1 = Fs + q * (x1 - s), code = q === as ? 1 : 0; return {
  prompt: `A throttle opens smoothly and then holds: the fuel flow is f(t) = ${co(a)}t litres per hour for 0 ≤ t < ${n(s)}, and f(t) = ${n(q)} litres per hour for ${n(s)} ≤ t ≤ ${n(s + 4)}. The running total is F(x) = the integral of f from 0 to x. (The integral of ${co(a)}t from 0 to x is the area of a triangle, ${a === 1 ? '' : n(a) + ' × '}x² ÷ 2.) Enter F(${n(s)}), then F(${n(x1)}), then 1 if F is differentiable at x = ${n(s)}, 0 if not.`,
  answer: [Fs, F1, code],
  hints: ['Up to the change use the triangle area given in the prompt; after it, add rate × time. F is continuous, so the total at the change is the same from either side.', 'The slope of F from the left at the change is the limit of the rate as t approaches it from below, and from the right it is the steady rate. F is differentiable there exactly when the two slopes are equal, which is when f is continuous at the change.'],
  solution: `Up to t = ${n(s)}, F(${n(s)}) = ${n(a)} × ${n(s)}² ÷ 2 = ${n(Fs)}. After that the rate is ${n(q)}, so F(${n(x1)}) = ${n(Fs)} + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(F1)}. Just before t = ${n(s)} the rate ${co(a)}t is close to ${n(a)} × ${n(s)} = ${n(as)}, so the difference quotients of F approach ${n(as)} from the left. From the right they equal ${n(q)}. ${code ? `They agree, f is continuous at ${n(s)}, and F′(${n(s)}) = ${n(q)} exists. The answer is 1.` : `They differ, so F has a corner at ${n(s)} and is not differentiable there. The answer is 0.`}`,
  guidance: [
   { prompt: `The integral of ${co(a)}t from 0 to ${n(s)} is ${n(a)} × ${n(s)}² ÷ 2. What is F(${n(s)})?`, answer: [Fs], explanation: `${n(a)} × ${n(s * s)} ÷ 2 = ${n(Fs)} litres.` },
   { prompt: `After t = ${n(s)} the rate is ${n(q)}. What is F(${n(x1)})?`, answer: [F1], explanation: `F(${n(x1)}) = ${n(Fs)} + ${n(q)} × (${n(x1)} − ${n(s)}) = ${n(F1)} litres.` },
   { prompt: `Just before t = ${n(s)} the rate ${co(a)}t is close to its value at t = ${n(s)}. What number do the difference quotients of F at ${n(s)} approach from the left?`, answer: [as], explanation: `The rate just before t = ${n(s)} is close to ${n(a)} × ${n(s)} = ${n(as)}, so the left quotients approach ${n(as)}.` },
   { prompt: `From the left the quotients approach ${n(as)}, and from the right ${n(q)}. Enter 1 if F is differentiable at ${n(s)}, 0 if not.`, answer: [code], explanation: code ? `Both sides give ${n(as)}, so F′(${n(s)}) = ${n(as)} exists.` : `${n(as)} and ${n(q)} differ, so the two one-sided limits disagree and F′(${n(s)}) does not exist.` }
  ] }; }
});

/* ---- q34 Improper integrals and integral-test bounds [5.5] ---- */

/* c ÷ nᵖ summed from n = 1 to N (s), the integral of c ÷ xᵖ from K = N + 1 to infinity (I), and the next term c ÷ Kᵖ (next).
   The tail from n = K on lies between I and I + next. */
const q34p = ({ c, p, N }) => { let s = 0; for (let k = 1; k <= N; k++) s += c / Math.pow(k, p);
 const K = N + 1, I = c / ((p - 1) * Math.pow(K, p - 1)), next = c / Math.pow(K, p); return { s, K, I, next }; };
/* Smallest N with c ÷ (N + 1)ᵖ < e ÷ 1000, in integers (the loop stops at K = 10000). */
const q34n = ({ c, p, e }) => { for (let K = 2; K < 10000; K++) if (c * 1000 < e * Math.pow(K, p)) return K - 1; return 1; };
/* The sum of the first N terms of c ÷ (nᵖ + 1) (s), with the tail pieces of q34p and the ceiling t = c ÷ Kᵖ + I for all later terms. */
const q34a = ({ c, p, N }) => { const x = q34p({ c, p, N }); let s = 0; for (let k = 1; k <= N; k++) s += c / (Math.pow(k, p) + 1); return { s, K: x.K, I: x.I, next: x.next, t: x.next + x.I }; };
/* "K" or "K²" or "K³" for the power K^(p − 1) in the integral's bottom line. */
const kpow = (K, e) => n(K) + SUP[e];

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The unchecked tail of the drift log',
 brief: 'The first entries of a drift log were checked by hand, and the audit needs the whole unchecked remainder pinned between two bounds.',
 labels: ['lower bound', 'upper bound'], tolerance: 0.0005,
 gl: [['lower bound'], ['next entry'], ['upper bound']]
}, {
 /* T = the sum of c ÷ nᵖ for n = K, K + 1, … with K = N + 1. Lower bound I, upper bound I + c ÷ Kᵖ, each rounded to 3 decimal places.
    c is 5–40 so the bounds are not tiny; draws within 1e−6 of a rounding tie, or whose bounds round to the same value, are skipped.
    The learn mission's own examples (1 ÷ n³ with 4 terms, 1 ÷ n² with 3 terms) cannot be drawn: c is at least 5. */
 canonical: { c: 12, p: 3, N: 4 },
 draw: R => tryDraw(() => { const p = R.int(2, 4); return { c: R.int(5, 40), p, N: R.int(3, p === 2 ? 12 : p === 3 ? 8 : 5) }; },
  q => { const x = q34p(q); return !nearTie(x.I) && !nearTie(x.I + x.next) && r3(x.I) !== r3(x.I + x.next); }, { c: 12, p: 3, N: 4 }),
 build: ({ c, p, N }) => { const x = q34p({ c, p, N }), K = x.K, pw = SUP[p], term = `${n(c)} ÷ n${pw}`, xt = `${n(c)} ÷ x${pw}`, lo = r3(x.I), hi = r3(x.I + x.next); return {
  prompt: `A drift log lists entries of ${term} litres for n = 1, 2, 3, … . The first ${n(N)} entries have been checked by hand. Let T be the total of all the later entries, n = ${n(K)}, ${n(K + 1)}, ${n(K + 2)}, … . Using the improper integral of ${xt} from ${n(K)} to infinity, enter a lower bound and an upper bound for T, each rounded to 3 decimal places (keep full precision until the last step).`,
  answer: [lo, hi],
  hints: ['The improper integral of c ÷ xᵖ from K to infinity is c ÷ ((p − 1) × Kᵖ⁻¹) when p > 1. The entries are positive and shrink as n grows.', 'For a decreasing positive f, the tail f(K) + f(K + 1) + … lies between the integral of f from K to infinity and f(K) plus that integral. Here K is the number of the first unchecked entry.'],
  solution: `The entries are positive and shrink, and T starts at n = ${n(K)}. The improper integral of ${xt} from ${n(K)} to infinity is ${n(c)} ÷ (${n(p - 1)} × ${kpow(K, p - 1)}) = ${n(lo)} (to 3 decimal places), so T ≥ ${n(lo)}. The first term of T is ${n(c)} ÷ ${n(K)}${pw} = ${n(r3(x.next))} (to 3 decimal places), so T ≤ ${n(r3(x.next))} + ${n(lo)}; with full precision the bounds are ${n(lo)} and ${n(hi)}.`,
  guidance: [
   { prompt: `What is the improper integral of ${xt} from ${n(K)} to infinity, to 3 decimal places? It is also the lower bound for T.`, answer: [lo], explanation: `It is ${n(c)} ÷ (${n(p - 1)} × ${kpow(K, p - 1)}) = ${n(lo)} to 3 decimal places.` },
   { prompt: `What is the first entry of T, ${n(c)} ÷ ${n(K)}${pw}, to 3 decimal places?`, answer: [r3(x.next)], explanation: `${n(c)} ÷ ${n(Math.pow(K, p))} = ${n(r3(x.next))} to 3 decimal places.` },
   { prompt: `T is at most the first entry plus the integral. What is the upper bound for T, to 3 decimal places?`, answer: [hi], explanation: `Adding the first entry to the integral, with full precision, gives ${n(hi)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'How many entries by hand?',
 brief: 'The auditors will accept bounds on an endless log only if they are close enough, so Mira needs to know how many entries to add by hand first.',
 labels: ['entries to add by hand', 'lower bound', 'upper bound'], tolerance: 0.0005,
 gl: [['entries to add by hand'], ['lower bound'], ['upper bound']]
}, {
 /* S = the sum of c ÷ nᵖ from n = 1. With N terms added exactly the bounds are s + I and s + next + I, which are next = c ÷ (N + 1)ᵖ apart.
    The audit needs next < ε = e ÷ 1000, so the smallest N makes c × 1000 < e × (N + 1)ᵖ, found in integers. The three answers N, lower, upper;
    draws near a rounding tie, or with equal rounded bounds, are skipped. */
 canonical: { c: 3, p: 3, e: 20 },
 draw: R => tryDraw(() => { const p = R.pick([3, 3, 4, 4, 2]); return { c: p === 2 ? R.int(1, 2) : R.int(1, 8), p, e: p === 2 ? R.pick([50, 20]) : p === 3 ? R.pick([50, 40, 25, 20, 10]) : R.pick([50, 40, 25, 20, 10, 5]) }; },
  q => { const N = q34n(q), x = q34p({ c: q.c, p: q.p, N }); return N >= 2 && !(q.c === 1 && q.p === 3 && N === 4) && !(q.c === 1 && q.p === 2 && N === 3) && !nearTie(x.s) && !nearTie(x.I) && !nearTie(x.s + x.I) && !nearTie(x.s + x.I + x.next) && r3(x.s + x.I) !== r3(x.s + x.I + x.next) && r3(x.s) + r3(x.I) === r3(x.s + x.I); }, { c: 3, p: 3, e: 20 }),
 build: ({ c, p, e }) => { const N = q34n({ c, p, e }), x = q34p({ c, p, N }), K = x.K, pw = SUP[p], term = `${n(c)} ÷ n${pw}`, xt = `${n(c)} ÷ x${pw}`, eps = e / 1000, lo = r3(x.s + x.I), hi = r3(x.s + x.I + x.next); return {
  prompt: `A relay’s correction log adds up the endless sum S of ${term} for n = 1, 2, 3, … . The auditors will sign only if the upper bound and the lower bound for S are less than ${n(eps)} apart. The crew adds the first N terms exactly and then uses the improper integral of ${xt} from N + 1 to infinity for the rest; the upper bound is the lower bound plus the term ${n(c)} ÷ (N + 1)${pw}. Enter the smallest N that meets the audit, then the lower bound and the upper bound for S with that N, each rounded to 3 decimal places (keep full precision until the last step).`,
  answer: [N, lo, hi],
  hints: ['The two bounds differ by exactly the first term of the tail, c ÷ Kᵖ with K = N + 1. Find the smallest whole K for which that term is below the tolerance (the inequality is strict), then N = K − 1.', 'The improper integral of c ÷ xᵖ from K to infinity is c ÷ ((p − 1) × Kᵖ⁻¹) when p > 1. The lower bound is the first N terms plus that integral; the upper bound adds the term c ÷ Kᵖ as well. Round only at the end.'],
  solution: `The bounds are ${n(c)} ÷ K${pw} apart, where K = N + 1, and we need ${n(c)} ÷ K${pw} < ${n(eps)}. K = ${n(K - 1)} gives ${n(c)} ÷ ${n(Math.pow(K - 1, p))} = ${n(r3(c / Math.pow(K - 1, p)))}, which is too big, and K = ${n(K)} gives ${n(c)} ÷ ${n(Math.pow(K, p))} = ${n(r3(x.next))}, which is small enough. So K = ${n(K)} and N = ${n(N)}. The first ${n(N)} terms add to ${n(r3(x.s))} (to 3 decimal places) and the improper integral of ${xt} from ${n(K)} to infinity is ${n(c)} ÷ (${n(p - 1)} × ${kpow(K, p - 1)}) = ${n(r3(x.I))} (to 3 decimal places). With full precision the lower bound is ${n(lo)}, and adding the term ${n(r3(x.next))} gives the upper bound ${n(hi)}.`,
  guidance: [
   { prompt: `The bounds are ${n(c)} ÷ K${pw} apart, where K = N + 1. What is the smallest N for which ${n(c)} ÷ (N + 1)${pw} < ${n(eps)}?`, answer: [N], explanation: `K = ${n(K - 1)} gives ${n(c)} ÷ ${n(Math.pow(K - 1, p))} = ${n(r3(c / Math.pow(K - 1, p)))}, not below ${n(eps)}; K = ${n(K)} gives ${n(r3(x.next))}, which is. So N = ${n(K)} − 1 = ${n(N)}.` },
   { prompt: `Add the first ${n(N)} terms and the improper integral of ${xt} from ${n(K)} to infinity. What is the lower bound for S, to 3 decimal places?`, answer: [lo], explanation: `The first ${n(N)} terms add to ${n(r3(x.s))} and the integral is ${n(r3(x.I))} (each to 3 decimal places); with full precision the lower bound is ${n(lo)}.` },
   { prompt: `The upper bound adds the term ${n(c)} ÷ ${n(K)}${pw} to the lower bound. What is the upper bound for S, to 3 decimal places?`, answer: [hi], explanation: `The term is ${n(r3(x.next))}, so with full precision the upper bound is ${n(hi)}.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q15', title: 'A ceiling by comparison and the integral',
 brief: 'A correction log has awkward terms that cannot be integrated, so the audit bounds them by tidier terms and then by an improper integral.',
 labels: ['first terms added', 'ceiling on the rest', 'upper bound'], tolerance: 0.0005,
 gl: [['first terms added'], ['ceiling on the rest'], ['upper bound']]
}, {
 /* aₙ = c ÷ (nᵖ + 1) < c ÷ nᵖ (the comparison of q15). The first N terms are added exactly (s). The rest, from n = K = N + 1, is at most the sum of c ÷ nᵖ
    from K, which is at most c ÷ Kᵖ + the integral of c ÷ xᵖ from K to infinity (t). Upper bound s + t. Draws are skipped when any answer is near a rounding tie
    or the rounded parts do not add up to the rounded total. */
 canonical: { c: 6, p: 3, N: 3 },
 draw: R => tryDraw(() => { const p = R.int(2, 4); return { c: R.int(2, 9), p, N: R.int(2, p === 2 ? 6 : 5) }; },
  q => { const x = q34a(q); return !nearTie(x.s) && !nearTie(x.t) && !nearTie(x.s + x.t) && r3(x.s) + r3(x.t) === r3(x.s + x.t); }, { c: 6, p: 3, N: 3 }),
 build: ({ c, p, N }) => { const x = q34a({ c, p, N }), K = N + 1, pw = SUP[p], xt = `${n(c)} ÷ x${pw}`, s3 = r3(x.s), t3 = r3(x.t), u3 = r3(x.s + x.t), terms = Array.from({ length: N }, (_, i) => `${n(c)} ÷ (${n(i + 1)}${pw} + 1)`).join(' + '); return {
  prompt: `A relay’s correction log adds up the endless sum S of ${n(c)} ÷ (n${pw} + 1) for n = 1, 2, 3, … . These terms cannot be integrated easily, but each is smaller than ${n(c)} ÷ n${pw}. The audit adds the first ${n(N)} terms of S exactly, bounds all the later terms n = ${n(K)}, ${n(K + 1)}, … by the tail of the sum of ${n(c)} ÷ n${pw} (which is at most its first term ${n(c)} ÷ ${n(K)}${pw} plus the improper integral of ${xt} from ${n(K)} to infinity), and adds the two. Enter the sum of the first ${n(N)} terms of S, then that ceiling for the later terms, then the resulting upper bound for S, each rounded to 3 decimal places (keep full precision until the last step).`,
  answer: [s3, t3, u3],
  hints: ['The first terms use the true terms, with the +1 in the bottom. Only the later terms are replaced by the bigger, tidier terms c ÷ nᵖ.', 'The improper integral of c ÷ xᵖ from K to infinity is c ÷ ((p − 1) × Kᵖ⁻¹). The ceiling for the later terms is the first tidy term c ÷ Kᵖ plus that integral; the upper bound for S is the exact first terms plus that ceiling.'],
  solution: `The first ${n(N)} terms of S add to ${n(s3)} (to 3 decimal places). Each later term is smaller than ${n(c)} ÷ n${pw}, so the later terms add to at most the tail of the sum of ${n(c)} ÷ n${pw} from n = ${n(K)}, which is at most ${n(c)} ÷ ${n(K)}${pw} + the integral of ${xt} from ${n(K)} to infinity = ${n(r3(x.next))} + ${n(c)} ÷ (${n(p - 1)} × ${kpow(K, p - 1)}) = ${n(r3(x.next))} + ${n(r3(x.I))}, which is ${n(t3)} with full precision. So S ≤ ${n(s3)} + ${n(t3)} = ${n(u3)}.`,
  guidance: [
   { prompt: `Add the first ${n(N)} terms of S, ${terms}. What is their sum, to 3 decimal places?`, answer: [s3], explanation: `The sum is ${n(s3)} to 3 decimal places.` },
   { prompt: `The later terms are at most ${n(c)} ÷ ${n(K)}${pw} plus the improper integral of ${xt} from ${n(K)} to infinity. What is that ceiling, to 3 decimal places?`, answer: [t3], explanation: `The first tidy term is ${n(r3(x.next))} and the integral is ${n(c)} ÷ (${n(p - 1)} × ${kpow(K, p - 1)}) = ${n(r3(x.I))}; with full precision they add to ${n(t3)}.` },
   { prompt: `Add the exact first terms and the ceiling for the later ones. What is the upper bound for S, to 3 decimal places?`, answer: [u3], explanation: `${n(s3)} + ${n(t3)} = ${n(u3)}, and S cannot be larger.` }
  ] }; }
});

/* ---- q35 Pointwise convergence [6.1] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The relief valve that settles by powers',
 brief: 'A relief valve’s successive models settle on each load by repeated powers, and the hall wants the limits and how fast one load settles.',
 labels: ['f at the first load', 'f(1)', 'N'], tolerance: 0.01,
 gl: [['f at the first load'], ['f(1)'], ['N']]
}, {
 /* fₙ(x) = A + B xⁿ on [0, 1]. For 0 ≤ x < 1, xⁿ → 0, so f(x) = A; at x = 1, 1ⁿ = 1, so f(1) = A + B. With x₀ = u ÷ v and ε = 1 ÷ w the gap
    |B| x₀ⁿ is below ε when |B| uⁿ w < vⁿ, searched in whole numbers (BigInt) from n = 1. The gap shrinks as n grows, so it stays below ε. */
 canonical: { A: 3, B: 4, xi: 2, wi: 1 },
 draw: R => ({ A: R.int(1, 9), B: R.nz(-6, 6), xi: R.int(0, 7), wi: R.int(0, 4) }),
 build: ({ A, B, xi, wi }) => { const X = [[1, 2], [1, 4], [3, 4], [3, 5], [4, 5], [1, 5], [7, 10], [3, 10]], W = [10, 20, 50, 100, 1000], [u, v] = X[xi], w = W[wi], x0 = u / v, eps = 1 / w, aB = Math.abs(B), end = A + B,
   N = firstN(i => BigInt(aB) * BigInt(u) ** i * BigInt(w) < BigInt(v) ** i), gapN = aB * Math.pow(x0, N), gapP = aB * Math.pow(x0, N - 1),
   ftext = `${n(A)} ${B < 0 ? '−' : '+'} ${aB === 1 ? '' : n(aB)}xⁿ`; return {
  prompt: `A relief valve’s n-th model reads fₙ(x) = ${ftext} at load x, for 0 ≤ x ≤ 1. (For 0 ≤ x < 1 the powers xⁿ shrink towards 0 as n grows, and 1ⁿ = 1 for every n.) Enter the pointwise limit f(${n(x0)}), then the pointwise limit f(1), then the smallest N for which |fₙ(${n(x0)}) − f(${n(x0)})| < ${n(eps)} holds for every n ≥ N (type it without commas).`,
  answer: [A, end, N],
  hints: ['Fix x first, then let n grow. For a load below 1 the power term shrinks to 0; at x = 1 every power is 1, so the model does not change with n.', 'The gap at one load is the size of the power term, which shrinks as n grows. Try n = 1, 2, 3, … (a calculator helps) until the gap first drops below the tolerance, and check that the step before it was not already below.'],
  solution: `For 0 ≤ x < 1, xⁿ → 0, so f(${n(x0)}) = ${n(A)}. At x = 1, fₙ(1) = ${n(A)} ${B < 0 ? '−' : '+'} ${aB === 1 ? '' : n(aB) + ' × '}1 = ${n(end)} for every n, so f(1) = ${n(end)}. The gap at x = ${n(x0)} is ${aB === 1 ? '' : n(aB) + ' × '}${n(x0)}ⁿ. For n = ${n(N - 1)} it is about ${n(Math.round(gapP * 100000) / 100000)}, not below ${n(eps)}, and for n = ${n(N)} it is about ${n(Math.round(gapN * 100000) / 100000)}, below ${n(eps)}. The gap only shrinks as n grows, so the smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `Take a load below 1, such as x = ${n(x0)}. As n grows, xⁿ shrinks to 0. What is f(${n(x0)})?`, answer: [A], explanation: `The power term vanishes in the limit, leaving f(${n(x0)}) = ${n(A)}.` },
   { prompt: `At x = 1, every power 1ⁿ is 1. What is f(1)?`, answer: [end], explanation: `fₙ(1) = ${n(A)} ${B < 0 ? '−' : '+'} ${aB === 1 ? '' : n(aB) + ' × '}1 = ${n(end)} for every n, so the limit is ${n(end)}.` },
   { prompt: `The gap at x = ${n(x0)} is ${aB === 1 ? '' : n(aB) + ' × '}${n(x0)}ⁿ. What is the smallest N for which this is below ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `Trying n = ${n(N - 1)} gives about ${n(Math.round(gapP * 100000) / 100000)}, which is not below ${n(eps)}, and n = ${n(N)} gives about ${n(Math.round(gapN * 100000) / 100000)}, which is. The gap only shrinks, so N = ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Which load settles slowest?',
 brief: 'Every load settles eventually, but the audit suspects that heavier loads take more models to settle, and wants the numbers.',
 labels: ['f at the lighter load', 'N at the lighter load', 'N at the heavier load'], tolerance: 0.005,
 gl: [['f at the lighter load'], ['N at the lighter load'], ['N at the heavier load']]
}, {
 /* fₙ(x) = x² + k x ÷ n, so f(x) = x² and the gap is k x ÷ n. With x = u ÷ v and ε = 1 ÷ w it is below ε when n > k u w ÷ v:
    the smallest N is floor(k u w ÷ v) + 1, in integers. Loads are two different entries of a list, the lighter first. */
 canonical: { k: 3, i: 0, j: 3, wi: 1 },
 draw: R => { const i = R.int(0, 4); return { k: R.int(2, 9), i, j: R.int(i + 1, 5), wi: R.int(0, 3) }; },
 build: ({ k, i, j, wi }) => { const X = [[1, 2], [1, 1], [3, 2], [2, 1], [5, 2], [3, 1]], W = [10, 20, 50, 100], [u1, v1] = X[i], [u2, v2] = X[j], w = W[wi], x1 = u1 / v1, x2 = u2 / v2, eps = 1 / w,
   lim = x1 * x1, b1 = k * u1 * w / v1, b2 = k * u2 * w / v2, N1 = Math.floor(k * u1 * w / v1) + 1, N2 = Math.floor(k * u2 * w / v2) + 1, e1 = (k * u1 * w) % v1 === 0, e2 = (k * u2 * w) % v2 === 0; return {
  prompt: `A load model reads fₙ(x) = x² + ${co(k)}x ÷ n at load x ≥ 0, and fₙ(x) → x² for every x. Enter the pointwise limit f(${n(x1)}), then the smallest N for which |fₙ(${n(x1)}) − f(${n(x1)})| < ${n(eps)} holds for every n ≥ N, then the smallest N that does the same at the heavier load x = ${n(x2)} (type each N without commas).`,
  answer: [lim, N1, N2],
  hints: ['Fix the load first, then let n grow: the term with ÷ n shrinks to 0, so the limit is what is left. The gap is the size of that term.', 'The gap at one load is a fixed number ÷ n. Solve “that < the tolerance” for n; the inequality is strict, so a whole-number answer needs one more. The heavier load gives a bigger fixed number.'],
  solution: `As n grows, ${co(k)}x ÷ n → 0, so f(x) = x² and f(${n(x1)}) = ${n(lim)}. The gap at x = ${n(x1)} is ${co(k)}${n(x1)} ÷ n = ${n(k * x1)} ÷ n. It is below ${n(eps)} when n > ${n(k * x1)} ÷ ${n(eps)} = ${approx(b1)}${e1 ? ' (strictly)' : ''}, so N = ${n(N1)}. At x = ${n(x2)} the gap is ${n(k * x2)} ÷ n, below ${n(eps)} when n > ${n(k * x2)} ÷ ${n(eps)} = ${approx(b2)}${e2 ? ' (strictly)' : ''}, so N = ${n(N2)}. The heavier load needs a larger N: no single N is fixed by the model alone, it depends on the load.`,
  guidance: [
   { prompt: `As n grows the term ${co(k)}x ÷ n shrinks to 0. What is f(${n(x1)})?`, answer: [lim], explanation: `What is left is x², so f(${n(x1)}) = ${n(x1)}² = ${n(lim)}.` },
   { prompt: `At x = ${n(x1)} the gap is ${n(k * x1)} ÷ n. What is the smallest N with this below ${n(eps)} for every n ≥ N?`, answer: [N1], explanation: `${n(k * x1)} ÷ n < ${n(eps)} means n > ${approx(b1)}. The smallest whole number strictly above it is ${n(N1)}.` },
   { prompt: `At x = ${n(x2)} the gap is ${n(k * x2)} ÷ n. What is the smallest N with this below ${n(eps)} for every n ≥ N?`, answer: [N2], explanation: `${n(k * x2)} ÷ n < ${n(eps)} means n > ${approx(b2)}. The smallest whole number strictly above it is ${n(N2)}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q07', title: 'The sensor that jumps at one load',
 brief: 'A saturating sensor’s models are smooth at every load, yet they settle on a limit with a jump, and the hall wants its two sides and a speed at one load.',
 labels: ['f(1)', 'f at the second load', 'N'], tolerance: 0.01,
 gl: [['f(1)'], ['f at the second load'], ['N']]
}, {
 /* fₙ(x) = A xⁿ ÷ (1 + xⁿ) on x ≥ 0. For x < 1 the limit is 0, at x = 1 it is A ÷ 2, and for x > 1 it is A (divide top and bottom by xⁿ). At x₀ = u ÷ v < 1 the gap is
    A uⁿ ÷ (uⁿ + vⁿ), below ε = 1 ÷ w exactly when (A w − 1) uⁿ < vⁿ, searched in whole numbers (BigInt). The gap shrinks as n grows. */
 canonical: { A: 4, xai: 2, xbi: 1, wi: 1 },
 draw: R => ({ A: R.int(2, 9), xai: R.int(0, 7), xbi: R.int(0, 4), wi: R.int(0, 3) }),
 build: ({ A, xai, xbi, wi }) => { const X = [[1, 2], [1, 4], [3, 4], [3, 5], [4, 5], [1, 5], [7, 10], [3, 10]], XB = [1.2, 1.5, 2, 3, 4], W = [10, 20, 50, 100], [u, v] = X[xai], xb = XB[xbi], w = W[wi], xa = u / v, eps = 1 / w,
   N = firstN(i => BigInt(A * w - 1) * BigInt(u) ** i < BigInt(v) ** i), gap = i => A * Math.pow(u, i) / (Math.pow(u, i) + Math.pow(v, i)), half = A / 2; return {
  prompt: `A saturating sensor’s n-th model reads fₙ(x) = ${n(A)}xⁿ ÷ (1 + xⁿ) at load x ≥ 0, and each fₙ is continuous. (For 0 ≤ x < 1 the powers xⁿ shrink towards 0, for x > 1 they grow without bound, and 1ⁿ = 1.) Enter the pointwise limit f(1), then the pointwise limit f(${n(xb)}), then the smallest N for which |fₙ(${n(xa)}) − f(${n(xa)})| < ${n(eps)} holds for every n ≥ N (type it without commas). You may use that the gap at ${n(xa)} gets smaller as n grows.`,
  answer: [half, A, N],
  hints: ['Fix the load first. At x = 1 every model gives the same number. For x > 1 divide the top and the bottom by xⁿ, so that the powers that remain shrink to 0. For x < 1 the top shrinks to 0 while the bottom tends to 1.', 'The gap at a load below 1 is fₙ itself, because the limit there is 0. Write it as a fraction of powers, set it below the tolerance, and clear the fractions. Then try n = 1, 2, 3, … (a calculator helps) until it first holds.'],
  solution: `At x = 1, fₙ(1) = ${n(A)} × 1 ÷ (1 + 1) = ${n(half)} for every n, so f(1) = ${n(half)}. For x = ${n(xb)} > 1, dividing the top and the bottom by xⁿ gives ${n(A)} ÷ (1 ÷ xⁿ + 1), and 1 ÷ xⁿ → 0, so f(${n(xb)}) = ${n(A)}. For x = ${n(xa)} < 1 the limit is 0, so the gap is fₙ(${n(xa)}) = ${n(A)} × ${n(xa)}ⁿ ÷ (1 + ${n(xa)}ⁿ). Trying n = ${n(N - 1)} gives about ${n(Math.round(gap(N - 1) * 100000) / 100000)}, which is not below ${n(eps)}, and n = ${n(N)} gives about ${n(Math.round(gap(N) * 100000) / 100000)}, which is. The gap only shrinks as n grows, so the smallest N is ${n(N)}. Each fₙ is continuous, yet the limit jumps: 0 below 1, ${n(half)} at 1, ${n(A)} above.`,
  guidance: [
   { prompt: `At x = 1 every power 1ⁿ is 1. What is f(1)?`, answer: [half], explanation: `fₙ(1) = ${n(A)} ÷ 2 = ${n(half)} for every n, so f(1) = ${n(half)}.` },
   { prompt: `For x = ${n(xb)} divide the top and the bottom by xⁿ: fₙ(${n(xb)}) = ${n(A)} ÷ (1 ÷ ${n(xb)}ⁿ + 1). What is f(${n(xb)})?`, answer: [A], explanation: `Since ${n(xb)} > 1, 1 ÷ ${n(xb)}ⁿ shrinks to 0, leaving ${n(A)} ÷ 1 = ${n(A)}.` },
   { prompt: `At x = ${n(xa)} the limit is 0, so the gap is fₙ(${n(xa)}) = ${n(A)} × ${n(xa)}ⁿ ÷ (1 + ${n(xa)}ⁿ). Try n = 1, 2, 3, … What is the smallest N for which the gap is below ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `For n = ${n(N - 1)} the gap is about ${n(Math.round(gap(N - 1) * 100000) / 100000)}, not below ${n(eps)}; for n = ${n(N)} it is about ${n(Math.round(gap(N) * 100000) / 100000)}, below ${n(eps)}. It only shrinks after that, so N = ${n(N)}.` }
  ] }; }
});

})();
