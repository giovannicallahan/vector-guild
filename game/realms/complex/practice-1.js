/* Complex analysis: the plane of numbers practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p1.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (the label of each guided step, one box each), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4': a complex number written the usual way. */
const cx = (a, b) => { if (b === 0) return n(a); const im = (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; if (a === 0) return (b < 0 ? '−' : '') + im; return `${n(a)} ${b < 0 ? '−' : '+'} ${im}`; };
/* k i² written out: 'i²', '−i²', '6i²'. */
const i2 = k => (k === 1 ? '' : k === -1 ? '−' : n(k)) + 'i²';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* piT(5, 6) is '5π ÷ 6', piT(2, 4) is 'π ÷ 2', piT(−8, 4) is '−2π'. */
const piT = (p, q) => { if (p === 0) return '0'; const g = gcd(p, q); p /= g; q /= g; const top = p === 1 ? 'π' : p === -1 ? '−π' : n(p) + 'π'; return q === 1 ? top : `${top} ÷ ${n(q)}`; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).replace('-', '⁻').replace(/\d/g, d => SUP[d]);
const r2 = x => { const r = Math.round(x * 100) / 100; return r === 0 ? 0 : r; };
const d2 = x => r2(x).toFixed(2).replace('-', '−');
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
/* Near a rounding tie at the second decimal: such draws are skipped. */
const nearTie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-3;
const rd = x => exact2(x) ? `= ${n(x)}` : `≈ ${n(x)}, which is ${d2(x)} to 2 decimal places`;
/* Exact cos and sin of a multiple of π ÷ 6 or π ÷ 4, as text. */
const exactText = v => { const s = v < 0 ? '−' : '', a = Math.abs(v); if (a < 1e-9) return '0'; if (Math.abs(a - 1) < 1e-9) return s + '1';
 if (Math.abs(a - 0.5) < 1e-9) return s + '1 ÷ 2'; if (Math.abs(a - Math.SQRT1_2) < 1e-9) return s + '√2 ÷ 2'; return s + '√3 ÷ 2'; };
/* A bounded search for a draw that passes ok(); after 1000 tries the canonical parameters. */
const pick = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const sgn = R => R.bool() ? 1 : -1;
const mul = (a, b, c, d) => [a * c - b * d, a * d + b * c];
/* The four products of (a + bi)(c + di) as worked, and the sum of the real terms and of the i terms. */
const prodText = (a, b, c, d) => `four products: ${n(a)} × ${par(c)} = ${n(a * c)}; ${n(a)} × (${cx(0, d)}) = ${cx(0, a * d)}; (${cx(0, b)}) × ${par(c)} = ${cx(0, b * c)}; and (${cx(0, b)}) × (${cx(0, d)}) = ${i2(b * d)}, which is ${n(-b * d)} because i² = −1`;
const prodSum = (a, b, c, d) => { const [re, im] = mul(a, b, c, d); return `The real terms give ${n(a * c)} + ${par(-b * d)} = ${n(re)}, and the i terms give ${n(a * d)} + ${par(b * c)} = ${n(im)}, so the product is ${cx(re, im)}`; };
/* The principal argument of a + bi (both non-zero) worked through its reference angle. */
const argWork = (a, b) => { const ref = Math.atan(Math.abs(b) / Math.abs(a)), arg = Math.atan2(b, a);
 const place = a > 0 && b > 0 ? 'above the real axis and to the right of the imaginary axis (quadrant 1)'
  : a < 0 && b > 0 ? 'above the real axis and to the left of the imaginary axis (quadrant 2)'
  : a < 0 ? 'below the real axis and to the left of the imaginary axis (quadrant 3)' : 'below the real axis and to the right of the imaginary axis (quadrant 4)';
 const rule = a > 0 && b > 0 ? 'Arg z is the angle itself' : a < 0 && b > 0 ? 'Arg z = π − angle' : a < 0 ? 'Arg z = −(π − angle)' : 'Arg z = −angle';
 return { ref, arg, place, rule }; };
/* Skips draws where rounding the reference angle first would change the second decimal of Arg z, or an answer sits near a tie. */
const argOk = (a, b) => { const w = argWork(a, b), rr = r2(w.ref), alt = a > 0 ? (b > 0 ? rr : -rr) : (b > 0 ? Math.PI - rr : -(Math.PI - rr));
 return !nearTie(w.ref) && !nearTie(w.arg) && r2(alt) === r2(w.arg); };
const PYTH = [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15], [15, 8], [7, 24], [24, 7], [9, 12], [12, 9]];
/* Divisors w = c + di with c² + d² one of 2, 5, 10, 20, 25, 50, so every part of a quotient is an exact decimal with at most 2 places. */
const WDIV = [[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 4], [4, 2], [3, 4], [4, 3], [1, 7], [7, 1], [5, 5]];


/* ---- q01 The number i: adding and multiplying [1.3] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'Mixer and phase shifter',
 brief: 'Two cables on the mast carry readings into a mixer and a phase shifter, and the log needs what each one puts out.',
 labels: ['Re(z − w)', 'Im(z − w)', 'Re(zw)', 'Im(zw)'], tolerance: 0.01,
 gl: [['Re(z − w)'], ['Im(z − w)'], ['Re(zw)'], ['Im(zw)']]
}, {
 /* z = a + bi, w = c + di, every part a non-zero whole number from −9 to 9. Not the worked example (2 + i, 1 + 3i) nor the parent's 3 + 2i and 5 − i. */
 canonical: { a: 4, b: -3, c: 2, d: 5 },
 draw: R => pick(() => ({ a: R.nz(-9, 9), b: R.nz(-9, 9), c: R.nz(-9, 9), d: R.nz(-9, 9) }),
  p => !(p.a === 2 && p.b === 1 && p.c === 1 && p.d === 3) && !(p.a === 3 && p.b === 2 && p.c === 5 && p.d === -1), { a: 4, b: -3, c: 2, d: 5 }),
 build: ({ a, b, c, d }) => { const [re, im] = mul(a, b, c, d); return {
  prompt: `Two feed cables on the antenna mast carry the readings z = ${cx(a, b)} and w = ${cx(c, d)}. The mixer subtracts w from z: subtract the real parts and subtract the imaginary parts, just as you add them. The phase shifter multiplies z by w. Enter the real part and the imaginary part of z − w, then the real part and the imaginary part of zw.`,
  answer: [a - c, b - d, re, im],
  hints: ['To subtract, subtract the real parts and subtract the imaginary parts.', 'To multiply, multiply every part of z by every part of w, as with two brackets, then replace i² by −1 and collect the real terms and the i terms.'],
  solution: `Subtracting part by part, z − w = ${cx(a - c, b - d)}, so its real part is ${n(a - c)} and its imaginary part is ${n(b - d)}. Multiplying every part of z by every part of w gives ${prodText(a, b, c, d)}. ${prodSum(a, b, c, d)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `Subtract the real parts of z and w: ${n(a)} − ${par(c)}. What is the real part of z − w?`, answer: [a - c], explanation: `${n(a)} − ${par(c)} = ${n(a - c)}.` },
   { prompt: `Subtract the imaginary parts of z and w: ${n(b)} − ${par(d)}. What is the imaginary part of z − w?`, answer: [b - d], explanation: `${n(b)} − ${par(d)} = ${n(b - d)}. The imaginary part is the plain number in front of i.` },
   { prompt: `The real part of zw comes from two products: ${n(a)} × ${par(c)}, and (${cx(0, b)}) × (${cx(0, d)}), which is real because i² = −1. What is the real part of zw?`, answer: [re], explanation: `${n(a)} × ${par(c)} = ${n(a * c)}, and (${cx(0, b)}) × (${cx(0, d)}) = ${i2(b * d)} = ${n(-b * d)}. Together they make ${n(a * c)} + ${par(-b * d)} = ${n(re)}.` },
   { prompt: `The imaginary part of zw comes from the two cross products, ${n(a)} × (${cx(0, d)}) and (${cx(0, b)}) × ${par(c)}. What is the imaginary part of zw?`, answer: [im], explanation: `${n(a)} × (${cx(0, d)}) = ${cx(0, a * d)} and (${cx(0, b)}) × ${par(c)} = ${cx(0, b * c)}. Together they make ${n(a * d)} + ${par(b * c)} = ${n(im)}, the number in front of i.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Two passes through the booster',
 brief: 'A weak signal is sent through the same booster twice in a row, and Mira needs to know what comes out of the second pass.',
 labels: ['Re of the final signal', 'Im of the final signal'], tolerance: 0.01,
 gl: [['Re(w × w)'], ['Im(w × w)'], ['Re of the final signal']]
}, {
 /* z = a + bi with parts from −6 to 6 and w = c + di with parts from −4 to 4, all non-zero, and c² ≠ d² so that w × w has a real part and an
    imaginary part that are both non-zero. */
 canonical: { a: 2, b: -3, c: 1, d: 2 },
 draw: R => pick(() => ({ a: R.nz(-6, 6), b: R.nz(-6, 6), c: R.nz(-4, 4), d: R.nz(-4, 4) }), p => Math.abs(p.c) !== Math.abs(p.d), { a: 2, b: -3, c: 1, d: 2 }),
 build: ({ a, b, c, d }) => { const [wr, wi] = mul(c, d, c, d), [re, im] = mul(a, b, wr, wi); return {
  prompt: `A weak signal z = ${cx(a, b)} leaves the antenna and goes through the booster, which multiplies it by w = ${cx(c, d)}. The booster output is fed through the same booster once more, so the final signal is z × w × w. Work out w × w first, then multiply z by it. Enter the real part and the imaginary part of the final signal.`,
  answer: [re, im],
  hints: ['Multiplying by w twice is the same as multiplying once by w × w. Work out w × w first, as two brackets, with i² = −1.', 'Then multiply z by the number you found, again multiplying every part by every part, replacing i² by −1 and collecting the real terms and the i terms.'],
  solution: `First w × w = (${cx(c, d)})(${cx(c, d)}). The four products are ${n(c)} × ${par(c)} = ${n(c * c)}; ${n(c)} × (${cx(0, d)}) = ${cx(0, c * d)}; (${cx(0, d)}) × ${par(c)} = ${cx(0, c * d)}; and (${cx(0, d)}) × (${cx(0, d)}) = ${i2(d * d)}, which is ${n(-d * d)}. So w × w = ${cx(wr, wi)}. Now multiply z by that: ${prodText(a, b, wr, wi)}. ${prodSum(a, b, wr, wi)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `Work out w × w = (${cx(c, d)})(${cx(c, d)}). The real terms are ${n(c)} × ${par(c)} and (${cx(0, d)}) × (${cx(0, d)}). What is the real part of w × w?`, answer: [wr], explanation: `${n(c)} × ${par(c)} = ${n(c * c)}, and (${cx(0, d)}) × (${cx(0, d)}) = ${i2(d * d)} = ${n(-d * d)}. Together they make ${n(c * c)} + ${par(-d * d)} = ${n(wr)}.` },
   { prompt: `The imaginary part of w × w comes from the two cross products, ${n(c)} × (${cx(0, d)}) and (${cx(0, d)}) × ${par(c)}. What is the imaginary part of w × w?`, answer: [wi], explanation: `Each cross product is ${cx(0, c * d)}, so together they make ${n(2 * c * d)}. So w × w = ${cx(wr, wi)}.` },
   { prompt: `Now multiply z = ${cx(a, b)} by w × w = ${cx(wr, wi)}. What is the real part of the final signal?`, answer: [re], explanation: `The real terms are ${n(a)} × ${par(wr)} = ${n(a * wr)} and (${cx(0, b)}) × (${cx(0, wi)}) = ${i2(b * wi)} = ${n(-b * wi)}, together ${n(re)}. The i terms work the same way and give an imaginary part of ${n(im)}.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The three-stage relay',
 brief: 'A test pulse crosses three relay stages in a row at the end of the mast, and the log needs the pulse that comes out of the last one.',
 labels: ['Re of the final signal', 'Im of the final signal'], tolerance: 0.01,
 gl: [['Re(zu)'], ['Im(zu)'], ['Re of the final signal'], ['Im of the final signal']]
}, {
 /* z, u and v have non-zero parts from −7 to 7, and z × u has two non-zero parts. The final parts can reach 1000, so the prompt says "without commas". */
 canonical: { a: 2, b: 3, c: 4, d: -5, e: -3, f: 1 },
 draw: R => pick(() => ({ a: R.nz(-7, 7), b: R.nz(-7, 7), c: R.nz(-7, 7), d: R.nz(-7, 7), e: R.nz(-7, 7), f: R.nz(-7, 7) }), p => { const [x, y] = mul(p.a, p.b, p.c, p.d); return x !== 0 && y !== 0; }, { a: 2, b: 3, c: 4, d: -5, e: -3, f: 1 }),
 build: ({ a, b, c, d, e, f }) => { const [pr, pi] = mul(a, b, c, d), [re, im] = mul(pr, pi, e, f); return {
  prompt: `A test pulse z = ${cx(a, b)} crosses three relay stages in turn. Stage one multiplies it by u = ${cx(c, d)}, and stage two multiplies the result by v = ${cx(e, f)}. The pulse that comes out is z × u × v, and it does not matter which two you multiply first. Enter the real part and the imaginary part of the final signal (type them without commas).`,
  answer: [re, im],
  hints: ['Do the multiplications one at a time: first z × u, then multiply that result by v. Each time, multiply every part by every part and replace i² by −1.', 'After each product, collect the real terms into one number and the i terms into another before you start the next product.'],
  solution: `First z × u: ${prodText(a, b, c, d)}. ${prodSum(a, b, c, d)}. Now multiply that by v: ${prodText(pr, pi, e, f)}. ${prodSum(pr, pi, e, f)}. So the final signal is ${cx(re, im)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `Start with z × u = (${cx(a, b)})(${cx(c, d)}). The real terms are ${n(a)} × ${par(c)} and (${cx(0, b)}) × (${cx(0, d)}). What is the real part of z × u?`, answer: [pr], explanation: `${n(a)} × ${par(c)} = ${n(a * c)}, and (${cx(0, b)}) × (${cx(0, d)}) = ${i2(b * d)} = ${n(-b * d)}. Together they make ${n(a * c)} + ${par(-b * d)} = ${n(pr)}.` },
   { prompt: `The imaginary part of z × u comes from the two cross products, ${n(a)} × (${cx(0, d)}) and (${cx(0, b)}) × ${par(c)}. What is the imaginary part of z × u?`, answer: [pi], explanation: `${n(a)} × (${cx(0, d)}) = ${cx(0, a * d)} and (${cx(0, b)}) × ${par(c)} = ${cx(0, b * c)}. Together they make ${n(a * d)} + ${par(b * c)} = ${n(pi)}, so z × u = ${cx(pr, pi)}.` },
   { prompt: `Now multiply z × u = ${cx(pr, pi)} by v = ${cx(e, f)}. What is the real part of the final signal?`, answer: [re], explanation: `The real terms are ${n(pr)} × ${par(e)} = ${n(pr * e)} and (${cx(0, pi)}) × (${cx(0, f)}) = ${i2(pi * f)} = ${n(-pi * f)}. Together they make ${n(pr * e)} + ${par(-pi * f)} = ${n(re)}.` },
   { prompt: `With the same two numbers, what is the imaginary part of the final signal? The cross products are ${n(pr)} × (${cx(0, f)}) and (${cx(0, pi)}) × ${par(e)}.`, answer: [im], explanation: `${n(pr)} × (${cx(0, f)}) = ${cx(0, pr * f)} and (${cx(0, pi)}) × ${par(e)} = ${cx(0, pi * e)}. Together they make ${n(pr * f)} + ${par(pi * e)} = ${n(im)}, so the final signal is ${cx(re, im)}.` }
  ] }; }
});

/* ---- q02 Conjugates and division [1.3] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The tuning filter',
 brief: 'A tuning filter has scaled and turned a reading, and the crew wants the signal that went into it.',
 labels: ['w w̄', 'Re(z ÷ w)', 'Im(z ÷ w)'], tolerance: 0.005,
 gl: [['w w̄'], ['Re(z ÷ w)'], ['Im(z ÷ w)']]
}, {
 /* z = a + bi with non-zero parts from −9 to 9; w = c + di from WDIV with either sign, so every answer is an exact decimal with at most 2 places.
    Not the worked example ((5 + 5i) ÷ (2 − i)) nor the parent's 4 + 7i over 1 + 2i. */
 canonical: { a: 7, b: 9, c: 2, d: 1 },
 draw: R => pick(() => { const [c, d] = R.pick(WDIV); return { a: R.nz(-9, 9), b: R.nz(-9, 9), c: sgn(R) * c, d: sgn(R) * d }; },
  p => !(p.a === 5 && p.b === 5 && p.c === 2 && p.d === -1) && !(p.a === 4 && p.b === 7 && p.c === 1 && p.d === 2), { a: 7, b: 9, c: 2, d: 1 }),
 build: ({ a, b, c, d }) => { const D = c * c + d * d, nr = a * c + b * d, ni = b * c - a * d, re = nr / D, im = ni / D; return {
  prompt: `A tuning filter in the Antenna Field scales and turns every signal that passes through it by the factor w = ${cx(c, d)}. The reading after the filter is z = ${cx(a, b)}, and the crew wants the signal that went in, which is z ÷ w. Enter w w̄ (w times its conjugate), then the real part and the imaginary part of z ÷ w. Each answer is an exact decimal with at most 2 decimal places.`,
  answer: [D, re, im],
  hints: ['The conjugate of c + di is c − di, and (c + di)(c − di) = c² + d², a real number.', 'Multiply the top and the bottom of z ÷ w by w̄. The bottom becomes the real number w w̄; multiply out the top, then divide each part of it by w w̄.'],
  solution: `w̄ = ${cx(c, -d)}, so w w̄ = ${par(c)}² + ${par(d)}² = ${n(c * c)} + ${n(d * d)} = ${n(D)}. The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Dividing each part by ${n(D)}: the real part of z ÷ w is ${n(nr)} ÷ ${n(D)} = ${n(re)} and the imaginary part is ${n(ni)} ÷ ${n(D)} = ${n(im)}, so z ÷ w = ${cx(re, im)}.`,
  guidance: [
   { prompt: `Find w w̄ = (${cx(c, d)})(${cx(c, -d)}). What real number is it?`, answer: [D], explanation: `w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}. The i terms cancel, so the product is real.` },
   { prompt: `The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Divide its real part by w w̄ = ${n(D)}. What is the real part of z ÷ w?`, answer: [re], explanation: `Multiplying out, the real terms of z w̄ are ${n(a)} × ${par(c)} = ${n(a * c)} and (${cx(0, b)}) × (${cx(0, -d)}) = ${n(b * d)}, together ${n(nr)}. Then ${n(nr)} ÷ ${n(D)} = ${n(re)}.` },
   { prompt: `Now divide the imaginary part of the top, ${n(ni)}, by ${n(D)}. What is the imaginary part of z ÷ w?`, answer: [im], explanation: `${n(ni)} ÷ ${n(D)} = ${n(im)}. Check: (${cx(re, im)}) × (${cx(c, d)}) gives back ${cx(a, b)}.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Undoing the feed line',
 brief: 'The feed line is built from two sections in series, and Mira needs the original signal back from the reading at the far end.',
 labels: ['Re(z ÷ w)', 'Im(z ÷ w)'], tolerance: 0.005,
 gl: [['w w̄'], ['Re(z ÷ w)'], ['Im(z ÷ w)']]
}, {
 /* w = c + di from WDIV with either sign; the two sections are s = (p, q) and t = w − s, with non-zero parts. z has non-zero parts from −9 to 9. */
 canonical: { a: 6, b: -5, c: 2, d: 4, p: 5, q: -1 },
 draw: R => pick(() => { const [c, d] = R.pick(WDIV); return { a: R.nz(-9, 9), b: R.nz(-9, 9), c: sgn(R) * c, d: sgn(R) * d, p: R.nz(-6, 6), q: R.nz(-6, 6) }; },
  x => x.c !== x.p && x.d !== x.q, { a: 6, b: -5, c: 2, d: 4, p: 5, q: -1 }),
 build: ({ a, b, c, d, p, q }) => { const tr = c - p, ti = d - q, D = c * c + d * d, nr = a * c + b * d, ni = b * c - a * d, re = nr / D, im = ni / D; return {
  prompt: `The feed line to the antenna has two sections in series. In a line like this, the factor of the whole line is the sum of the factors of its sections: w = s + t, where section one has s = ${cx(p, q)} and section two has t = ${cx(tr, ti)}. The receiver at the far end reads z = ${cx(a, b)}, and to undo the line the crew divides z ÷ w. Enter the real part and the imaginary part of z ÷ w. Each answer is an exact decimal with at most 2 decimal places.`,
  answer: [re, im],
  hints: ['First add the factors of the two sections, real part to real part and imaginary part to imaginary part, to get w.', 'Then divide: multiply the top and the bottom of z ÷ w by the conjugate w̄. The bottom becomes the real number w w̄, and each part of the new top is divided by it.'],
  solution: `Adding the sections, w = s + t = (${cx(p, q)}) + (${cx(tr, ti)}) = ${cx(c, d)}. Then w̄ = ${cx(c, -d)} and w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}. The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Dividing each part by ${n(D)}: the real part of z ÷ w is ${n(nr)} ÷ ${n(D)} = ${n(re)} and the imaginary part is ${n(ni)} ÷ ${n(D)} = ${n(im)}, so z ÷ w = ${cx(re, im)}.`,
  guidance: [
   { prompt: `Adding the sections gives w = ${cx(c, d)}. Multiply it by its conjugate: w w̄ = (${cx(c, d)})(${cx(c, -d)}). What real number is it?`, answer: [D], explanation: `w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}.` },
   { prompt: `The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Divide its real part by w w̄ = ${n(D)}. What is the real part of z ÷ w?`, answer: [re], explanation: `Multiplying out, the real terms of z w̄ are ${n(a)} × ${par(c)} = ${n(a * c)} and (${cx(0, b)}) × (${cx(0, -d)}) = ${n(b * d)}, together ${n(nr)}. Then ${n(nr)} ÷ ${n(D)} = ${n(re)}.` },
   { prompt: `Now divide the imaginary part of the top, ${n(ni)}, by ${n(D)}. What is the imaginary part of z ÷ w?`, answer: [im], explanation: `${n(ni)} ÷ ${n(D)} = ${n(im)}. Check: (${cx(re, im)}) × (${cx(c, d)}) gives back ${cx(a, b)}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'Boost first, then undo the cable',
 brief: 'A signal is boosted at the mast and then has to be divided by the cable factor to recover what the antenna saw.',
 labels: ['Re of the result', 'Im of the result'], tolerance: 0.005,
 gl: [['Re(z × p)'], ['Im(z × p)'], ['Re of the result'], ['Im of the result']]
}, {
 /* z = a + bi and the booster p = e + fi have non-zero parts from −6 to 6; w = c + di is from WDIV, so the quotient is an exact decimal with at most 2 places. */
 canonical: { a: 3, b: -4, e: 2, f: 5, c: 3, d: 1 },
 draw: R => pick(() => { const [c, d] = R.pick(WDIV); return { a: R.nz(-6, 6), b: R.nz(-6, 6), e: R.nz(-6, 6), f: R.nz(-6, 6), c: sgn(R) * c, d: sgn(R) * d }; },
  x => !(x.c === 5 && x.d === 5 && x.a === 5), { a: 3, b: -4, e: 2, f: 5, c: 3, d: 1 }),
 build: ({ a, b, e, f, c, d }) => { const [pr, pi] = mul(a, b, e, f), D = c * c + d * d, nr = pr * c + pi * d, ni = pi * c - pr * d, re = nr / D, im = ni / D; return {
  prompt: `A signal z = ${cx(a, b)} is boosted at the mast: the booster multiplies it by p = ${cx(e, f)}. The boosted signal then runs down a cable that scaled and turned it by the factor w = ${cx(c, d)}, so the crew divides to undo the cable and finds (z × p) ÷ w. Enter the real part and the imaginary part of (z × p) ÷ w. Each answer is an exact decimal with at most 2 decimal places.`,
  answer: [re, im],
  hints: ['Do the product first: multiply every part of z by every part of p, replacing i² by −1, to get one complex number.', 'Then divide that number by w: multiply its top and bottom by the conjugate w̄, so the bottom becomes the real number c² + d², and divide each part of the new top by it.'],
  solution: `First z × p = (${cx(a, b)})(${cx(e, f)}): ${prodText(a, b, e, f)}. ${prodSum(a, b, e, f)}. Now divide by w: w̄ = ${cx(c, -d)} and w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}. The top becomes (${cx(pr, pi)})(${cx(c, -d)}) = ${cx(nr, ni)}. Dividing each part by ${n(D)}: the real part is ${n(nr)} ÷ ${n(D)} = ${n(re)} and the imaginary part is ${n(ni)} ÷ ${n(D)} = ${n(im)}.`,
  guidance: [
   { prompt: `First multiply z × p = (${cx(a, b)})(${cx(e, f)}). The real terms are ${n(a)} × ${par(e)} and (${cx(0, b)}) × (${cx(0, f)}). What is the real part of z × p?`, answer: [pr], explanation: `${n(a)} × ${par(e)} = ${n(a * e)}, and (${cx(0, b)}) × (${cx(0, f)}) = ${i2(b * f)} = ${n(-b * f)}. Together they make ${n(a * e)} + ${par(-b * f)} = ${n(pr)}.` },
   { prompt: `The imaginary part of z × p comes from the two cross products, ${n(a)} × (${cx(0, f)}) and (${cx(0, b)}) × ${par(e)}. What is the imaginary part of z × p?`, answer: [pi], explanation: `${n(a)} × (${cx(0, f)}) = ${cx(0, a * f)} and (${cx(0, b)}) × ${par(e)} = ${cx(0, b * e)}. Together they make ${n(a * f)} + ${par(b * e)} = ${n(pi)}, so z × p = ${cx(pr, pi)}.` },
   { prompt: `Now divide z × p = ${cx(pr, pi)} by w = ${cx(c, d)}: the bottom becomes w w̄ = ${n(D)}, and the top becomes (${cx(pr, pi)})(${cx(c, -d)}) = ${cx(nr, ni)}. What is the real part of the result?`, answer: [re], explanation: `The real terms of the top are ${n(pr)} × ${par(c)} = ${n(pr * c)} and (${cx(0, pi)}) × (${cx(0, -d)}) = ${n(pi * d)}, together ${n(nr)}. Then ${n(nr)} ÷ ${n(D)} = ${n(re)}.` },
   { prompt: `Divide the imaginary part of the top, ${n(ni)}, by ${n(D)}. What is the imaginary part of the result?`, answer: [im], explanation: `${n(ni)} ÷ ${n(D)} = ${n(im)}, so (z × p) ÷ w = ${cx(re, im)}.` }
  ] }; }
});

/* ---- q03 Modulus and argument [1.4, 1.5] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The survey drone',
 brief: 'A survey drone hovers over the Antenna Field, and the crew wants its distance from the mast and the direction it lies in.',
 labels: ['|z|', 'Arg z'], tolerance: 0.005,
 gl: [['|z|'], ['angle with the real axis'], ['Arg z']]
}, {
 /* z = a + bi with |z| from a Pythagorean triple, in any quadrant. Skips draws near a rounding tie or where rounding the reference angle first would change Arg z.
    Not the worked example (−3 − 4i) nor the parent's −8 + 6i. */
 canonical: { a: -5, b: -12 },
 draw: R => pick(() => { const [x, y] = R.pick(PYTH); return { a: sgn(R) * x, b: sgn(R) * y }; }, p => !(p.a === -3 && p.b === -4) && !(p.a === -8 && p.b === 6) && argOk(p.a, p.b), { a: -5, b: -12 }),
 build: ({ a, b }) => { const r = Math.round(Math.hypot(a, b)), w = argWork(a, b); return {
  prompt: `A survey drone hovers over the Antenna Field. Take the mast as the point 0 of the complex plane, with east along the real axis and north along the imaginary axis, in metres, and measure angles anticlockwise from east. The drone is at z = ${cx(a, b)}. Enter its distance |z| from the mast in metres, then its principal argument Arg z in radians (between −π and π), to 2 decimal places.`,
  answer: [r, r2(w.arg)],
  hints: ['The distance from 0 to z is the modulus: |x + yi| = √(x² + y²).', 'First find the angle arctan(|y| ÷ |x|) between z and the real axis. If z is left of the imaginary axis, take π minus that angle; if z is below the real axis, make the result negative.'],
  solution: `|z| = √(${par(a)}² + ${par(b)}²) = √${n(a * a + b * b)} = ${n(r)} metres. The angle between z and the real axis is arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)} radians. z lies ${w.place}, so ${w.rule}. With the unrounded angle, Arg z ${rd(w.arg)}.`,
  guidance: [
   { prompt: `How far is z = ${cx(a, b)} from 0? Enter |z|.`, answer: [r], explanation: `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(a * a + b * b)} = ${n(r)}.` },
   { prompt: `What is the angle arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) between z and the real axis, in radians, to 2 decimal places?`, answer: [r2(w.ref)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ${rd(w.ref)}. Keep the unrounded value for the next step.` },
   { prompt: `z lies ${w.place}. What is Arg z, in radians, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `In this quadrant ${w.rule}. Using the unrounded angle ${n(w.ref)}, Arg z ${rd(w.arg)}.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Moving the relay mast',
 brief: 'The relay mast has to be moved across the Antenna Field, and Mira wants the length and the direction of the move.',
 labels: ['length of the move', 'Arg of the move'], tolerance: 0.005,
 gl: [['Re(z2 − z1)'], ['Im(z2 − z1)'], ['Arg of the move']]
}, {
 /* The move d = dx + dy i comes from a Pythagorean pair with either signs; the old position z1 has non-zero parts from −9 to 9 and z2 = z1 + d. */
 canonical: { x1: -4, y1: 7, dx: 12, dy: -5 },
 draw: R => pick(() => { const [x, y] = R.pick(PYTH); return { x1: R.nz(-9, 9), y1: R.nz(-9, 9), dx: sgn(R) * x, dy: sgn(R) * y }; }, p => argOk(p.dx, p.dy), { x1: -4, y1: 7, dx: 12, dy: -5 }),
 build: ({ x1, y1, dx, dy }) => { const x2 = x1 + dx, y2 = y1 + dy, r = Math.round(Math.hypot(dx, dy)), w = argWork(dx, dy); return {
  prompt: `The relay mast stands at z1 = ${cx(x1, y1)} on the complex plane of the Antenna Field (east along the real axis, north along the imaginary axis, in metres). The crew moves it to z2 = ${cx(x2, y2)}. The move itself is the number z2 − z1: subtract the real parts and subtract the imaginary parts. Enter the length of the move |z2 − z1| in metres, then the direction of the move, its principal argument in radians (between −π and π), to 2 decimal places.`,
  answer: [r, r2(w.arg)],
  hints: ['Subtract part by part to get the move as one complex number. Its length is the modulus, √(x² + y²).', 'The direction is the principal argument of the move. Find the angle arctan(|y| ÷ |x|) with the real axis, then use the quadrant: π minus it on the left of the imaginary axis, and a minus sign below the real axis.'],
  solution: `The move is z2 − z1 = (${cx(x2, y2)}) − (${cx(x1, y1)}) = ${cx(dx, dy)}. Its length is √(${par(dx)}² + ${par(dy)}²) = √${n(dx * dx + dy * dy)} = ${n(r)} metres. The angle between the move and the real axis is arctan(${n(Math.abs(dy))} ÷ ${n(Math.abs(dx))}) ≈ ${n(w.ref)} radians. The move lies ${w.place}, so ${w.rule.replace('Arg z', 'its argument')}. With the unrounded angle, the argument ${rd(w.arg)}.`,
  guidance: [
   { prompt: `Subtract the real parts: ${n(x2)} − ${par(x1)}. What is the real part of z2 − z1?`, answer: [dx], explanation: `${n(x2)} − ${par(x1)} = ${n(dx)}.` },
   { prompt: `Subtract the imaginary parts: ${n(y2)} − ${par(y1)}. What is the imaginary part of z2 − z1?`, answer: [dy], explanation: `${n(y2)} − ${par(y1)} = ${n(dy)}, so the move is ${cx(dx, dy)} and its length is ${n(r)}.` },
   { prompt: `The move ${cx(dx, dy)} lies ${w.place}. What is its principal argument, in radians, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `The angle with the real axis is arctan(${n(Math.abs(dy))} ÷ ${n(Math.abs(dx))}) ≈ ${n(w.ref)}. In this quadrant ${w.rule.replace('Arg z', 'the argument')}, and the unrounded value ${rd(w.arg)}.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'Undo the cable, then read the signal',
 brief: 'A cable has scaled and turned a signal, and the crew wants the true signal described by its strength and direction.',
 labels: ['|z ÷ w|', 'Arg(z ÷ w)'], tolerance: 0.005,
 gl: [['Re(z ÷ w)'], ['Im(z ÷ w)'], ['|z ÷ w|'], ['Arg(z ÷ w)']]
}, {
 /* The true signal u = x + yi comes from a Pythagorean pair with either signs, the cable factor w = c + di has parts from 1 to 3 with either signs,
    and the reading is z = u × w, so the quotient z ÷ w is the whole-number pair u. */
 canonical: { x: 5, y: -12, c: 3, d: 1 },
 draw: R => pick(() => { const [x, y] = R.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]); return { x: sgn(R) * x, y: sgn(R) * y, c: sgn(R) * R.int(1, 3), d: sgn(R) * R.int(1, 3) }; },
  p => argOk(p.x, p.y) && !(p.x === -3 && p.y === -4), { x: 5, y: -12, c: 3, d: 1 }),
 build: ({ x, y, c, d }) => { const [zr, zi] = mul(x, y, c, d), D = c * c + d * d, r = Math.round(Math.hypot(x, y)), w = argWork(x, y); return {
  prompt: `The receiver reads the signal z = ${cx(zr, zi)}, but a cable has scaled and turned the true signal by the factor w = ${cx(c, d)}, so the true signal is z ÷ w. Both parts of z ÷ w are whole numbers. Enter the strength |z ÷ w| of the true signal, then its principal argument Arg(z ÷ w) in radians (between −π and π), to 2 decimal places.`,
  answer: [r, r2(w.arg)],
  hints: ['Divide first: multiply the top and the bottom of z ÷ w by the conjugate w̄, so that the bottom becomes the real number c² + d².', 'Then treat the quotient as a point of the plane: its modulus is √(x² + y²), and its principal argument comes from the angle arctan(|y| ÷ |x|) with the real axis and the quadrant.'],
  solution: `Divide first. w̄ = ${cx(c, -d)} and w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}. The top becomes z w̄ = (${cx(zr, zi)})(${cx(c, -d)}) = ${cx(x * D, y * D)}. Dividing each part by ${n(D)} gives z ÷ w = ${cx(x, y)}. Its modulus is √(${par(x)}² + ${par(y)}²) = √${n(x * x + y * y)} = ${n(r)}. The angle between it and the real axis is arctan(${n(Math.abs(y))} ÷ ${n(Math.abs(x))}) ≈ ${n(w.ref)} radians. It lies ${w.place}, so ${w.rule.replace('Arg z', 'its argument')}. With the unrounded angle, the argument ${rd(w.arg)}.`,
  guidance: [
   { prompt: `Multiply the top and the bottom of z ÷ w by w̄ = ${cx(c, -d)}. The bottom becomes ${n(D)}, and the top becomes (${cx(zr, zi)})(${cx(c, -d)}) = ${cx(x * D, y * D)}. What is the real part of z ÷ w?`, answer: [x], explanation: `${n(x * D)} ÷ ${n(D)} = ${n(x)}.` },
   { prompt: `Divide the imaginary part of the top, ${n(y * D)}, by ${n(D)}. What is the imaginary part of z ÷ w?`, answer: [y], explanation: `${n(y * D)} ÷ ${n(D)} = ${n(y)}, so z ÷ w = ${cx(x, y)}.` },
   { prompt: `How far is ${cx(x, y)} from 0? Enter |z ÷ w|.`, answer: [r], explanation: `|z ÷ w| = √(${n(x * x)} + ${n(y * y)}) = √${n(x * x + y * y)} = ${n(r)}.` },
   { prompt: `${cx(x, y)} lies ${w.place}. What is its principal argument, in radians, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `The angle with the real axis is arctan(${n(Math.abs(y))} ÷ ${n(Math.abs(x))}) ≈ ${n(w.ref)}. In this quadrant ${w.rule.replace('Arg z', 'the argument')}, and the unrounded value ${rd(w.arg)}.` }
  ] }; }
});

/* ---- q04 Euler's formula and polar form [1.6] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The boom tip',
 brief: 'A signal boom swings out from the mast at a set length and angle, and the crew needs the position of its tip as two numbers.',
 labels: ['Re z', 'Im z'], tolerance: 0.005,
 gl: [['quadrant'], ['Re z'], ['Im z']]
}, {
 /* z = r e^(iθ), r from 3 to 12, θ = kπ ÷ q with q 6 or 4, off the axes, in (0, 2π). Not the worked example (2, π ÷ 3) nor the parent's (6, 5π ÷ 6). */
 canonical: { r: 8, k: 7, q: 4 },
 draw: R => pick(() => { const q = R.pick([6, 4]); return { r: R.int(3, 12), k: q === 6 ? R.pick([1, 2, 4, 5, 7, 8, 10, 11]) : R.pick([1, 3, 5, 7]), q }; },
  p => { const t = p.k * Math.PI / p.q; return !(p.r === 2 && p.k === 2 && p.q === 6) && !(p.r === 6 && p.k === 5 && p.q === 6) && !nearTie(p.r * Math.cos(t)) && !nearTie(p.r * Math.sin(t)); }, { r: 8, k: 7, q: 4 }),
 build: ({ r, k, q }) => { const t = k * Math.PI / q, c = Math.cos(t), s = Math.sin(t), re = r * c, im = r * s, th = piT(k, q), quad = c > 0 ? (s > 0 ? 1 : 4) : (s > 0 ? 2 : 3); return {
  prompt: `A signal boom on the mast is ${n(r)} metres long. It swings out until it makes the angle θ = ${th} radians with the positive real axis of the complex plane, measured anticlockwise, with the mast at 0. Its tip is the point z = ${n(r)}e^(iθ). Enter the real part and the imaginary part of z in metres, each to 2 decimal places.`,
  answer: [r2(re), r2(im)],
  hints: ['Euler\'s formula: e^(iθ) = cos θ + i sin θ, so r e^(iθ) = r cos θ + i r sin θ.', 'Find the quadrant the angle points into: it gives the signs of cos θ and sin θ. Their sizes come from the angle that θ makes with the real axis.'],
  solution: `By Euler's formula, z = ${n(r)}(cos θ + i sin θ). The angle ${th} points into quadrant ${quad}, where cos(${th}) = ${exactText(c)} and sin(${th}) = ${exactText(s)}. So the real part is ${n(r)} × (${exactText(c)}) ${rd(re)}, and the imaginary part is ${n(r)} × (${exactText(s)}) ${rd(im)}.`,
  guidance: [
   { prompt: `Into which quadrant does the angle θ = ${th} point? Enter 1, 2, 3 or 4 (quadrant 1 is the upper right, and they are numbered anticlockwise).`, answer: [quad], explanation: `Measured anticlockwise from the positive real axis, ${th} lies in quadrant ${quad}, so cos θ is ${c > 0 ? 'positive' : 'negative'} and sin θ is ${s > 0 ? 'positive' : 'negative'}.` },
   { prompt: `The real part is ${n(r)} cos(${th}). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${th}) = ${exactText(c)}, so ${n(r)} × (${exactText(c)}) ${rd(re)}.` },
   { prompt: `The imaginary part is ${n(r)} sin(${th}). What is it, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${th}) = ${exactText(s)}, so ${n(r)} × (${exactText(s)}) ${rd(im)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The rotor arm from a moving hub',
 brief: 'A rotor arm is mounted on a hub that is not at the centre, and Mira wants the position of the arm tip.',
 labels: ['Re of the tip', 'Im of the tip'], tolerance: 0.005,
 gl: [['Re of the arm'], ['Im of the arm']]
}, {
 /* The hub h = a + bi has non-zero whole parts from −9 to 9; the arm is r e^(iθ) with r from 2 to 9 and θ = kπ ÷ q as in q04. The tip is h plus the arm,
    so each answer is a whole number plus a 2-place value and never depends on rounding an intermediate value. */
 canonical: { a: 3, b: -2, r: 6, k: 3, q: 4 },
 draw: R => pick(() => { const q = R.pick([6, 4]); return { a: R.nz(-9, 9), b: R.nz(-9, 9), r: R.int(2, 9), k: q === 6 ? R.pick([1, 2, 4, 5, 7, 8, 10, 11]) : R.pick([1, 3, 5, 7]), q }; },
  p => { const t = p.k * Math.PI / p.q; return !nearTie(p.r * Math.cos(t)) && !nearTie(p.r * Math.sin(t)); }, { a: 3, b: -2, r: 6, k: 3, q: 4 }),
 build: ({ a, b, r, k, q }) => { const t = k * Math.PI / q, c = Math.cos(t), s = Math.sin(t), re = r * c, im = r * s, th = piT(k, q), quad = c > 0 ? (s > 0 ? 1 : 4) : (s > 0 ? 2 : 3);
  const tr = a + r2(re), ti = b + r2(im); return {
  prompt: `A rotor on the mast has its hub at the point h = ${cx(a, b)} of the complex plane. Its arm is ${n(r)} metres long and is turned through the angle θ = ${th} radians from the positive real axis, so the arm itself is the number ${n(r)}e^(iθ). The tip of the arm is the hub plus the arm: h + ${n(r)}e^(iθ). Enter the real part and the imaginary part of the tip, each to 2 decimal places.`,
  answer: [tr, ti],
  hints: ['Turn the arm into parts with Euler\'s formula: r e^(iθ) = r cos θ + i r sin θ. The quadrant of θ gives the signs.', 'Then add the hub to the arm: the real parts add and the imaginary parts add.'],
  solution: `By Euler's formula the arm is ${n(r)}(cos θ + i sin θ). The angle ${th} points into quadrant ${quad}, where cos(${th}) = ${exactText(c)} and sin(${th}) = ${exactText(s)}. So the arm has real part ${n(r)} × (${exactText(c)}) ${rd(re)}, and imaginary part ${n(r)} × (${exactText(s)}) ${rd(im)}. Adding the hub ${cx(a, b)}, the tip has real part ${n(a)} + ${par(r2(re))} = ${n(tr)} and imaginary part ${n(b)} + ${par(r2(im))} = ${n(ti)}.`,
  guidance: [
   { prompt: `The real part of the arm is ${n(r)} cos(${th}). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `The angle ${th} points into quadrant ${quad}, where cos(${th}) = ${exactText(c)}. So ${n(r)} × (${exactText(c)}) ${rd(re)}.` },
   { prompt: `The imaginary part of the arm is ${n(r)} sin(${th}). What is it, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${th}) = ${exactText(s)}, so ${n(r)} × (${exactText(s)}) ${rd(im)}. Now add the hub ${cx(a, b)}: the tip is ${cx(tr, ti)}.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'The wound-up arm',
 brief: 'A scanning arm has turned through more than a whole turn, and the log needs its direction and its tip position.',
 labels: ['Arg z', 'Re z', 'Im z'], tolerance: 0.005,
 gl: [['Arg z'], ['Re z'], ['Im z']]
}, {
 /* The principal argument is bπ ÷ q with b off the axes (q 6 or 4); the arm has turned t whole turns more, t from −2 to 2 and not 0, so θ = (b + 2qt)π ÷ q lies outside −π to π.
    Not the worked example (r = 2, π ÷ 3). */
 canonical: { r: 5, kb: 5, q: 6, t: 1 },
 draw: R => pick(() => { const q = R.pick([6, 4]), kb = q === 6 ? R.pick([-5, -4, -2, -1, 1, 2, 4, 5]) : R.pick([-3, -1, 1, 3]); return { r: R.int(2, 9), kb, q, t: R.pick([-2, -1, 1, 2]) }; },
  p => { const a = p.kb * Math.PI / p.q; return !nearTie(a) && !nearTie(p.r * Math.cos(a)) && !nearTie(p.r * Math.sin(a)); }, { r: 5, kb: 5, q: 6, t: 1 }),
 build: ({ r, kb, q, t }) => { const k = kb + 2 * q * t, a = kb * Math.PI / q, c = Math.cos(a), s = Math.sin(a), re = r * c, im = r * s, th = piT(k, q), pa = piT(kb, q), quad = c > 0 ? (s > 0 ? 1 : 4) : (s > 0 ? 2 : 3);
  const turns = t > 0 ? `take away ${t === 1 ? 'one whole turn' : 'two whole turns'} of 2π` : `add ${t === -1 ? 'one whole turn' : 'two whole turns'} of 2π`; return {
  prompt: `A scanning arm of length ${n(r)} starts along the positive real axis and is turned through the angle θ = ${th} radians. Angles are measured anticlockwise, an angle with a minus sign turns clockwise, and a whole extra turn of 2π leaves the arm pointing the same way. The tip of the arm is z = ${n(r)}e^(iθ). Enter the principal argument Arg z of the tip (between −π and π), then the real part and the imaginary part of z, each to 2 decimal places.`,
  answer: [r2(a), r2(re), r2(im)],
  hints: ['The principal argument is the angle between −π and π that points the same way. Add or take away whole turns of 2π from θ until it lies in that range.', 'Euler\'s formula: r e^(iθ) = r cos θ + i r sin θ. Use the angle you found, or θ itself: both point the same way and give the same parts.'],
  solution: `The angle ${th} is outside the range from −π to π, so ${turns} to get the principal argument: Arg z = ${pa} ${rd(a)}. By Euler's formula, z = ${n(r)}(cos θ + i sin θ), and the angle ${pa} points into quadrant ${quad}, where cos = ${exactText(c)} and sin = ${exactText(s)}. So the real part is ${n(r)} × (${exactText(c)}) ${rd(re)}, and the imaginary part is ${n(r)} × (${exactText(s)}) ${rd(im)}.`,
  guidance: [
   { prompt: `Add or take away whole turns of 2π from θ = ${th} until the angle lies between −π and π. What is that angle, in radians, to 2 decimal places?`, answer: [r2(a)], explanation: `${turns.replace(/^./, ch => ch.toUpperCase())}: ${th} becomes ${pa}, which is ${d2(a)} to 2 decimal places. This is Arg z.` },
   { prompt: `The real part is ${n(r)} cos(${pa}). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `The angle ${pa} points into quadrant ${quad}, where cos = ${exactText(c)}. So ${n(r)} × (${exactText(c)}) ${rd(re)}.` },
   { prompt: `The imaginary part is ${n(r)} sin(${pa}). What is it, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${pa}) = ${exactText(s)}, so ${n(r)} × (${exactText(s)}) ${rd(im)}.` }
  ] }; }
});

/* ---- q05 Powers: de Moivre's formula [1.13, 1.6] ---- */

/* z = a + bi with a and b of the same size and either sign: its angle is mπ ÷ 4 with m = 1, 3, 5 or 7 (from 0 to 2π). */
const quarter = (a, b) => a > 0 ? (b > 0 ? 1 : 7) : (b > 0 ? 3 : 5);
/* z to the power p by repeated multiplication. */
const power = (a, b, p) => { let re = 1, im = 0; for (let i = 0; i < p; i++) [re, im] = mul(re, im, a, b); return [re, im]; };

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'The amplifier chain',
 brief: 'Identical amplifier stages are chained along the feed, and the crew needs the signal that leaves the last stage.',
 labels: ['Re(zⁿ)', 'Im(zⁿ)'], tolerance: 0.01,
 gl: [['k'], ['j'], ['Re(zⁿ)'], ['Im(zⁿ)']]
}, {
 /* z = c(±1 ± i) with c from 2 to 5: modulus c√2, angle mπ ÷ 4 with m odd. The pairs (c, n) keep every part of zⁿ below 1000: c = 2 with n from 3 to 6,
    c = 3 with n from 3 to 5, and c = 4 or 5 with n = 3. Not the worked example ((1 + i)⁴) nor the parent's (−1 + i)⁵. */
 canonical: { c: 2, a: 1, b: 1, p: 5 },
 draw: R => { const CP = [[2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], [4, 3], [5, 3]], [c, p] = R.pick(CP); return { c, a: sgn(R), b: sgn(R), p }; },
 build: ({ c, a, b, p }) => { const m = quarter(a, b), M = (m * p) % 8, [re, im] = power(c * a, c * b, p), e = sup(p), big = Math.pow(c, p) * Math.pow(2, Math.floor(p / 2)),
   size = p % 2 === 0 ? n(big) : `${n(big)}√2`; return {
  prompt: `Each stage of the amplifier chain on the antenna feed scales and turns a signal by the factor z = ${cx(c * a, c * b)}. A signal that goes through ${n(p)} stages in a row has been multiplied by z${e}. Enter the real part and the imaginary part of z${e}.`,
  answer: [re, im],
  hints: ['Write z in polar form r e^(iθ) first. Its modulus is √(x² + y²), and because its two parts are equal in size, its angle is an odd multiple of π ÷ 4.', 'De Moivre\'s formula: (r e^(iθ))ⁿ = rⁿ e^(inθ). Multiply the angle by n, take away whole turns of 2π, then use cos and sin of what is left.'],
  solution: `|z| = ${n(c)}√2 and z points at the angle θ = ${piT(m, 4)}, so z = ${n(c)}√2 e^(iθ). By de Moivre's formula, z${e} = (${n(c)}√2)${e} e^(i × ${n(p)}θ). The angle ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}; taking away whole turns of 2π leaves ${piT(M, 4)}. The size is (${n(c)}√2)${e} = ${size}. So z${e} = ${size}(cos(${piT(M, 4)}) + i sin(${piT(M, 4)})) = ${cx(re, im)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `Write the angle of z = ${cx(c * a, c * b)}, between 0 and 2π, as kπ ÷ 4. What is k?`, answer: [m], explanation: `z sits on the diagonal of quadrant ${a > 0 ? (b > 0 ? 1 : 4) : (b > 0 ? 2 : 3)}, at the angle ${piT(m, 4)}, so k = ${n(m)}.` },
   { prompt: `De Moivre's formula multiplies the angle by ${n(p)}: ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}. Take away whole turns of 2π (each turn is 8 steps of π ÷ 4). The angle left is jπ ÷ 4 with j from 0 to 7: what is j?`, answer: [M], explanation: `${n(m * p)} steps of π ÷ 4, less whole turns of 8 steps, leaves ${M === 1 ? '1 step' : n(M) + ' steps'}, so the angle of z${e} is ${piT(M, 4)}.` },
   { prompt: `The size of z${e} is (${n(c)}√2)${e} = ${size}, and its angle is ${piT(M, 4)}. What is the real part of z${e}?`, answer: [re], explanation: `${size} × cos(${piT(M, 4)}) = ${n(re)}.` },
   { prompt: `With the same size and angle, what is the imaginary part of z${e}?`, answer: [im], explanation: `${size} × sin(${piT(M, 4)}) = ${n(im)}, so z${e} = ${cx(re, im)}.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'A test pulse down the chain',
 brief: 'A test pulse is sent down a chain of identical stages, and Mira needs the pulse that arrives at the end.',
 labels: ['Re of the output', 'Im of the output'], tolerance: 0.01,
 gl: [['Re(zⁿ)'], ['Im(zⁿ)'], ['Re of the output']]
}, {
 /* z = ±1 ± i with n from 3 to 9, so zⁿ has whole parts of size at most 16; the pulse s = c + di has non-zero parts from −6 to 6.
    Not the worked example ((1 + i)⁴) nor the parent's (−1 + i)⁵. */
 canonical: { a: 1, b: -1, p: 6, c: 3, d: -2 },
 draw: R => pick(() => ({ a: sgn(R), b: sgn(R), p: R.int(3, 9), c: R.nz(-6, 6), d: R.nz(-6, 6) }), x => !(x.a === 1 && x.b === 1 && x.p === 4) && !(x.a === -1 && x.b === 1 && x.p === 5), { a: 1, b: -1, p: 6, c: 3, d: -2 }),
 build: ({ a, b, p, c, d }) => { const m = quarter(a, b), M = (m * p) % 8, [zr, zi] = power(a, b, p), [re, im] = mul(c, d, zr, zi), e = sup(p),
   size = p % 2 === 0 ? n(Math.pow(2, p / 2)) : `${n(Math.pow(2, (p - 1) / 2))}√2`; return {
  prompt: `A test pulse s = ${cx(c, d)} is sent down a chain of ${n(p)} identical stages, and each stage multiplies the signal by z = ${cx(a, b)}. After the last stage the pulse has been multiplied by z${e}, so the pulse that arrives is s × z${e}. Enter the real part and the imaginary part of the pulse that arrives.`,
  answer: [re, im],
  hints: ['Work out z' + 'ⁿ' + ' first with de Moivre\'s formula: write z as r e^(iθ), raise r to the power, multiply the angle by n and take away whole turns of 2π.', 'Then multiply s by the number you found, as two brackets, replacing i² by −1 and collecting the real terms and the i terms.'],
  solution: `|z| = √2 and z points at the angle θ = ${piT(m, 4)}, so z = √2 e^(iθ). By de Moivre's formula, z${e} = (√2)${e} e^(i × ${n(p)}θ). The angle ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}, and taking away whole turns of 2π leaves ${piT(M, 4)}. The size is (√2)${e} = ${size}, so z${e} = ${size}(cos(${piT(M, 4)}) + i sin(${piT(M, 4)})) = ${cx(zr, zi)}. Now multiply s by it: ${prodText(c, d, zr, zi)}. ${prodSum(c, d, zr, zi)}.`,
  guidance: [
   { prompt: `Use de Moivre's formula: z = √2 e^(iθ) with θ = ${piT(m, 4)}, so z${e} has size (√2)${e} = ${size} and angle ${piT(m * p, 4)}, which is the same direction as ${piT(M, 4)}. What is the real part of z${e}?`, answer: [zr], explanation: `${size} × cos(${piT(M, 4)}) = ${n(zr)}.` },
   { prompt: `With the same size and angle, what is the imaginary part of z${e}?`, answer: [zi], explanation: `${size} × sin(${piT(M, 4)}) = ${n(zi)}, so z${e} = ${cx(zr, zi)}.` },
   { prompt: `Now multiply s = ${cx(c, d)} by z${e} = ${cx(zr, zi)}. What is the real part of the pulse that arrives?`, answer: [re], explanation: `The real terms are ${n(c)} × ${par(zr)} = ${n(c * zr)} and (${cx(0, d)}) × (${cx(0, zi)}) = ${i2(d * zi)} = ${n(-d * zi)}, together ${n(re)}. The i terms work the same way and give an imaginary part of ${n(im)}.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'Seventeen passes in polar form',
 brief: 'A rotor stage is described by its strength and angle, and the crew needs the signal after a long run of passes.',
 labels: ['Re(zⁿ)', 'Im(zⁿ)'], tolerance: 0.01,
 gl: [['j'], ['Re(zⁿ)'], ['Im(zⁿ)']]
}, {
 /* z = √2 e^(iθ) with θ = mπ ÷ 4 and m odd, n from 13 to 24. Every part of zⁿ is a whole number of size up to 4096, so the prompt says "without commas". */
 canonical: { m: 3, p: 17 },
 draw: R => ({ m: R.pick([1, 3, 5, 7]), p: R.int(13, 24) }),
 build: ({ m, p }) => { const a = m === 1 || m === 7 ? 1 : -1, b = m <= 3 ? 1 : -1, [re, im] = power(a, b, p), M = (m * p) % 8, e = sup(p),
   size = p % 2 === 0 ? n(Math.pow(2, p / 2)) : `${n(Math.pow(2, (p - 1) / 2))}√2`; return {
  prompt: `A rotor stage scales and turns every signal by the factor z = √2e^(iθ) with θ = ${piT(m, 4)} radians. A signal that has gone through the stage ${n(p)} times has been multiplied by z${e}. Enter the real part and the imaginary part of z${e}. Both are whole numbers (type them without commas).`,
  answer: [re, im],
  hints: ['De Moivre\'s formula: (r e^(iθ))ⁿ = rⁿ e^(inθ). Raise the modulus to the power n, and multiply the angle by n.', 'Take away whole turns of 2π from the new angle, counting in steps of π ÷ 4 (a whole turn is 8 steps), then use Euler\'s formula to get the real part r cos and the imaginary part r sin.'],
  solution: `By de Moivre's formula, z${e} = (√2)${e} e^(i × ${n(p)}θ). The angle ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}; taking away whole turns of 2π leaves ${piT(M, 4)}. The size is (√2)${e} = ${size}. So z${e} = ${size}(cos(${piT(M, 4)}) + i sin(${piT(M, 4)})) = ${cx(re, im)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `De Moivre's formula multiplies the angle by ${n(p)}: ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}. Take away whole turns of 2π (each turn is 8 steps of π ÷ 4). The angle left is jπ ÷ 4 with j from 0 to 7: what is j?`, answer: [M], explanation: `${n(m * p)} steps of π ÷ 4, less whole turns of 8 steps, leaves ${M === 1 ? '1 step' : n(M) + ' steps'}, so the angle of z${e} is ${piT(M, 4)}.` },
   { prompt: `The size of z${e} is (√2)${e} = ${size}, and its angle is ${piT(M, 4)}. By Euler's formula the real part is the size times cos of the angle. What is the real part of z${e}?`, answer: [re], explanation: `${size} × cos(${piT(M, 4)}) = ${n(re)}.` },
   { prompt: `With the same size and angle, the imaginary part is the size times sin of the angle. What is the imaginary part of z${e}?`, answer: [im], explanation: `${size} × sin(${piT(M, 4)}) = ${n(im)}, so z${e} = ${cx(re, im)}.` }
  ] }; }
});

})();
