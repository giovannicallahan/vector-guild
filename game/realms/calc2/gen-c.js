/* Calculus 2: accumulation mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding for answers that the prompt asks for to 2, 3 or 4 decimal places. */
const r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000, r4 = x => Math.round(x * 10000) / 10000;
/* True when x sits within 0.05 of a step of a rounding tie at d places, so a slightly different calculator path could round it the other way. */
const edge = (x, d) => { const s = Math.abs(x) * Math.pow(10, d), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* Subscript and superscript digits: sub(10) is '₁₀', sup(2) is '²'. */
const sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
/* A coefficient in front of a letter: co(1, 'x') is 'x', co(5, 'x') is '5x'. */
const co = (v, x) => v === 1 ? x : `${n(v)}${x}`;
/* A multiple of a logarithm: lnOf(1, 'x + 2') is 'ln|x + 2|', lnOf(3, 'x + 2') is '3 ln|x + 2|'. */
const lnOf = (v, inside) => v === 1 ? `ln|${inside}|` : `${n(v)} ln|${inside}|`;
/* "144.6667, which is 144.667 to 3 decimal places", or just "143" when the value is already exact. */
const to3 = (x, unit = '') => Math.abs(x - r3(x)) < 1e-9 ? `${n(x)}${unit}` : `${n(x)}${unit}, which is ${r3(x).toFixed(3)} to 3 decimal places`;
/* '= 2.5' when the value is exact to 4 places, otherwise '≈ 2.8261'; say3 adds the rounding to 3 places when it matters. */
const ap = x => `${Math.abs(x - r4(x)) < 1e-9 ? '=' : '≈'} ${n(x)}`;
const say3 = x => Math.abs(x - r3(x)) < 1e-9 ? `= ${n(x)}` : n(x) === n(r3(x)) ? `≈ ${n(x)}` : `≈ ${n(x)}, which is ${r3(x).toFixed(3)} to 3 decimal places`;
/* e to a whole power: ePow(1) 'e', ePow(2) 'e²'. */
const ePow = c => c === 1 ? 'e' : `e${sup(c)}`;
/* e^(−kt) written with the rate k: k = 1 gives e^(−t). */
/* A number in front of e: 1 is left unwritten. */
const ce = v => v === 1 ? '' : n(v);
const eNeg = (k, v) => `e^(−${k === 1 ? '' : n(k)}${v})`;
/* q24, q25, q29: the power of t on the bottom of a fraction. */
const powT = (p, v) => p === 0.5 ? `√${v}` : p === 1 ? v : `${v}${sup(p)}`;
/* q28, q29: the geometric series a, ar, ar², … with r = p/q and a = q²(q − p)j, so the terms and the sum q³j are whole. */
const geo = ({ p, q, j }) => { const a = q * q * (q - p) * j; return { a, a1: a * p / q, a2: a * p * p / (q * q), r: p / q, S: q * q * q * j, S3: a + a * p / q + a * p * p / (q * q), frac: `${p}/${q}`, oneMinus: `${q - p}/${q}` }; };
const PAIRS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]];
const drawGeo = R => { const [p, q] = R.pick(PAIRS); return { p, q, j: R.int(1, Math.min(6, Math.floor(999 / (q * q * q)))) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* (c1x + c0) ÷ ((x + a)(x + b)) = A ÷ (x + a) + B ÷ (x + b), with c1 = A + B and c0 = Ab + Ba, integrated from L to U.
    A and B are 1 to 6, so c1 is at least 2 (no written coefficient 1) and every factor is positive on the interval.
    Not the worked example ((3x + 5) ÷ ((x + 1)(x + 3)) from 0 to 1). */
 q21: {
  canonical: { A: 2, B: 3, a: 1, b: 2, L: 0, U: 2 },
  draw: R => { let p; do { const a = R.int(1, 4), L = R.int(0, 2); p = { A: R.int(1, 6), B: R.int(1, 6), a, b: a + R.int(1, 3), L, U: L + R.int(1, 3) }; } while (p.a === 1 && p.b === 3 && p.A === 1 && p.B === 2); return p; },
  build: ({ A, B, a, b, L, U }) => { const c1 = A + B, c0 = A * b + B * a, nA = A * (b - a), nB = B * (a - b),
   pA = A * Math.log((U + a) / (L + a)), pB = B * Math.log((U + b) / (L + b)), I = r3(pA + pB),
   f = `(${co(c1, 'x')} + ${n(c0)}) ÷ ((x + ${n(a)})(x + ${n(b)}))`, split = `${co(c1, 'x')} + ${n(c0)} = A(x + ${n(b)}) + B(x + ${n(a)})`,
   logs = `${n(A)} × (ln ${n(U + a)} − ln ${n(L + a)}) + ${n(B)} × (ln ${n(U + b)} − ln ${n(L + b)})`; return {
   prompt: `The Computing Core’s heat model needs ∫ from ${n(L)} to ${n(U)} of ${f} dx. Split the fraction into partial fractions, A ÷ (x + ${n(a)}) + B ÷ (x + ${n(b)}). Enter A, then B, then the value of the integral to 3 decimal places.`,
   answer: [A, B, I],
   hints: [`Multiply both sides by (x + ${n(a)})(x + ${n(b)}): ${split}. Put x = −${n(a)} to make the B part vanish, then x = −${n(b)} to make the A part vanish.`,
    `Each partial fraction gives a logarithm: ∫ A ÷ (x + ${n(a)}) dx = A ln|x + ${n(a)}|. Work out both logarithms at x = ${n(U)} and at x = ${n(L)}, and subtract.`],
   solution: `Multiply both sides by (x + ${n(a)})(x + ${n(b)}): ${split}. With x = −${n(a)}: ${n(c1)} × (−${n(a)}) + ${n(c0)} = ${n(nA)}, and the right side is A × ${n(b - a)}, so A = ${n(nA)} ÷ ${n(b - a)} = ${n(A)}. With x = −${n(b)}: ${n(c1)} × (−${n(b)}) + ${n(c0)} = ${n(nB)}, and the right side is B × (${n(a - b)}), so B = ${n(nB)} ÷ (${n(a - b)}) = ${n(B)}. The integrand is ${n(A)} ÷ (x + ${n(a)}) + ${n(B)} ÷ (x + ${n(b)}), with antiderivative ${lnOf(A, `x + ${n(a)}`)} + ${lnOf(B, `x + ${n(b)}`)}. From x = ${n(L)} to x = ${n(U)} that is ${logs} ≈ ${n(pA)} + ${n(pB)}, which is ${(I).toFixed(3)} to 3 decimal places.`,
   guidance: [
    { prompt: `Put x = −${n(a)} into ${split}. The B part becomes 0. What is A?`, answer: [A], explanation: `The left side is ${n(c1)} × (−${n(a)}) + ${n(c0)} = ${n(nA)}. The right side is A × (−${n(a)} + ${n(b)}) = A × ${n(b - a)}. So A = ${n(nA)} ÷ ${n(b - a)} = ${n(A)}.` },
    { prompt: `Now put x = −${n(b)}. The A part becomes 0. What is B?`, answer: [B], explanation: `The left side is ${n(c1)} × (−${n(b)}) + ${n(c0)} = ${n(nB)}. The right side is B × (−${n(b)} + ${n(a)}) = B × (${n(a - b)}). So B = ${n(nB)} ÷ (${n(a - b)}) = ${n(B)}.` },
    { prompt: `Integrate ${n(A)} ÷ (x + ${n(a)}) + ${n(B)} ÷ (x + ${n(b)}) from x = ${n(L)} to x = ${n(U)}. What is the value to 3 decimal places?`, answer: [I], explanation: `The antiderivative is ${lnOf(A, `x + ${n(a)}`)} + ${lnOf(B, `x + ${n(b)}`)}. Top limit minus bottom limit: ${logs} ≈ ${n(pA)} + ${n(pB)}, which is ${(I).toFixed(3)} to 3 decimal places.` }
   ] }; }
 },
 /* Readings y₀ … yₙ every h minutes (h = 2 or 3, n = 4 or 6 strips, so Simpson's rule applies). Totals stay below 1000.
    Not the worked example (10, 16, 20, 18, 12 every 3 minutes). */
 q22: {
  canonical: { h: 2, y: [12, 18, 21, 19, 15] },
  draw: R => { let p; do { const k = R.pick([4, 6]); p = { h: R.pick([2, 3]), y: Array.from({ length: k + 1 }, () => R.int(6, 40)) }; } while (p.y.join() === '10,16,20,18,12'); return p; },
  build: ({ h, y }) => { const k = y.length - 1, end = k * h, last = y[k],
   wT = y.map((v, i) => i === 0 || i === k ? 1 : 2), wS = y.map((v, i) => i === 0 || i === k ? 1 : i % 2 ? 4 : 2),
   sT = y.reduce((s, v, i) => s + wT[i] * v, 0), sS = y.reduce((s, v, i) => s + wS[i] * v, 0), T = h / 2 * sT, S = h / 3 * sS,
   show = w => y.map((v, i) => w[i] === 1 ? n(v) : `${w[i]} × ${n(v)}`).join(' + '); return {
   prompt: `The Computing Core logs its coolant flow in litres per minute every ${n(h)} minutes, from t = 0 to t = ${n(end)}: ${y.map(n).join(', ')}. Estimate how many litres flowed in those ${n(end)} minutes with the trapezoidal rule, then with Simpson’s rule. Enter both to 3 decimal places.`,
   answer: [r3(T), r3(S)],
   hints: [`The readings are h = ${n(h)} minutes apart, so there are ${n(k)} strips. Trapezoidal rule: (h ÷ 2) × (first reading + 2 × each middle reading + last reading).`,
    `Simpson’s rule: (h ÷ 3) × (first reading + 4, 2, 4, …, 2, 4 times the middle readings in turn + last reading). It needs an even number of strips, and ${n(k)} is even.`],
   solution: `The readings are h = ${n(h)} minutes apart, which makes ${n(k)} strips. Trapezoidal rule: (${n(h)} ÷ 2) × (${show(wT)}) = ${n(h / 2)} × ${n(sT)} = ${to3(T, ' litres')}. Simpson’s rule: (${n(h)} ÷ 3) × (${show(wS)}) = (${n(h)} ÷ 3) × ${n(sS)} = ${to3(S, ' litres')}.`,
   guidance: [
    { prompt: `For the trapezoidal rule, weight the readings 1, 2, 2, …, 2, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 2) times it?`, answer: [sT, r3(T)], explanation: `${show(wT)} = ${n(sT)}. Each strip is a trapezium of width ${n(h)}, so the estimate is (${n(h)} ÷ 2) × ${n(sT)} = ${to3(T)}.` },
    { prompt: `For Simpson’s rule, weight them 1, 4, 2, 4, …, 4, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 3) times it, to 3 decimal places?`, answer: [sS, r3(S)], explanation: `${show(wS)} = ${n(sS)}. Then (${n(h)} ÷ 3) × ${n(sS)} = ${to3(S)}. Simpson’s rule fits a parabola over each pair of strips, so it follows the bend in the readings.` }
   ] }; }
 },
 /* One integrand from one of four families; the solver picks the technique.
    fam 1 substitution:   2k·x ÷ (x² + m) from 0 to c      = k ln((c² + m) ÷ m)
    fam 2 by parts:       k·x·eˣ from 0 to c                = k((c − 1)eᶜ + 1)
    fam 3 partial frac.:  d(b − a) ÷ ((x + a)(x + b)), L..U = d(ln((U + a) ÷ (L + a)) − ln((U + b) ÷ (L + b)))
    fam 4 divide first:   (x² + k) ÷ x from 1 to c          = (c² − 1) ÷ 2 + k ln c */
 q23: {
  canonical: { fam: 2, k: 3, c: 2 },
  draw: R => { const fam = R.int(1, 4);
   if (fam === 1) return { fam, k: R.int(1, 4), m: R.int(1, 6), c: R.int(1, 3) };
   if (fam === 2) return { fam, k: R.int(1, 4), c: R.int(1, 3) };
   if (fam === 3) { const a = R.int(1, 3), L = R.int(0, 1); return { fam, d: R.int(1, 4), a, b: a + R.int(1, 3), L, U: L + R.int(1, 4) }; }
   return { fam, k: R.int(2, 9), c: R.int(2, 4) }; },
  build: p => { const { fam } = p; let f, lo, hi, F, Fx, hint1, hint2, why, steps;
   if (fam === 1) { const { k, m, c } = p; lo = 0; hi = c; f = `${co(2 * k, 'x')} ÷ (x² + ${n(m)})`; Fx = x => k * Math.log(x * x + m); F = `${lnOf(k, `x² + ${n(m)}`)}`;
    why = `The top, ${co(2 * k, 'x')}, is ${k === 1 ? '' : n(k) + ' times '}the derivative of the bottom, x² + ${n(m)}, so substitution fits: technique 1.`;
    hint1 = `Compare the top, ${co(2 * k, 'x')}, with the derivative of the bottom, x² + ${n(m)}.`; hint2 = `With u = x² + ${n(m)}, du = 2x dx, and the integral becomes the integral of ${k === 1 ? '1' : n(k)} ÷ u.`;
    steps = `With u = x² + ${n(m)} and du = 2x dx the antiderivative is ${F}.`; }
   else if (fam === 2) { const { k, c } = p; lo = 0; hi = c; f = `${co(k, 'x')}·eˣ`; Fx = x => k * (x - 1) * Math.exp(x); F = `${k === 1 ? '' : n(k)}(x − 1)eˣ`;
    why = `The integrand is x times eˣ, a product where differentiating x makes it simpler, so integration by parts fits: technique 2.`;
    hint1 = 'The integrand is a product of x and eˣ. Which factor becomes simpler when you differentiate it?';
    hint2 = `Take u = x and dv = eˣ dx: the integral of x·eˣ is x·eˣ minus the integral of eˣ, which is (x − 1)eˣ.`;
    steps = `With u = x and dv = eˣ dx, the integral of x·eˣ is x·eˣ − eˣ = (x − 1)eˣ, so the antiderivative is ${F}.`; }
   else if (fam === 3) { const { d, a, b, L, U } = p; lo = L; hi = U; f = `${n(d * (b - a))} ÷ ((x + ${n(a)})(x + ${n(b)}))`; Fx = x => d * (Math.log(x + a) - Math.log(x + b));
    F = `${lnOf(d, `x + ${n(a)}`)} − ${lnOf(d, `x + ${n(b)}`)}`;
    why = `The bottom is a product of two different linear factors and the top is a constant, so partial fractions fit: technique 3.`;
    hint1 = 'Look at the bottom: it is a product of two different linear factors.';
    hint2 = `Split it as A ÷ (x + ${n(a)}) + B ÷ (x + ${n(b)}) and find A and B by putting x = −${n(a)}, then x = −${n(b)}.`;
    steps = `${f} = ${n(d)} ÷ (x + ${n(a)}) − ${n(d)} ÷ (x + ${n(b)}), so the antiderivative is ${F}.`; }
   else { const { k, c } = p; lo = 1; hi = c; f = `(x² + ${n(k)}) ÷ x`; Fx = x => x * x / 2 + k * Math.log(x); F = `x² ÷ 2 + ${n(k)} ln x`;
    why = `The top has a higher power than the bottom, and the bottom is just x, so dividing it out first fits: technique 4.`;
    hint1 = 'The bottom is a single x. What do you get if you divide each part of the top by x?';
    hint2 = `(x² + ${n(k)}) ÷ x = x + ${n(k)} ÷ x, and both parts have basic antiderivatives.`;
    steps = `(x² + ${n(k)}) ÷ x = x + ${n(k)} ÷ x, so the antiderivative is ${F}.`; }
   const top = Fx(hi), bot = Fx(lo), V = r3(top - bot), cue = fam === 2 && p.c > 1 ? ` (${ePow(p.c)} ≈ ${n(Math.exp(p.c))})` : ''; return {
   prompt: `The Computing Core’s solver is stuck on ∫ from ${n(lo)} to ${n(hi)} of ${f} dx. It knows four techniques: 1 substitution, 2 integration by parts, 3 partial fractions, 4 dividing the fraction out first and then using the basic rules. Enter the number of the technique that fits, then the value of the integral to 3 decimal places.`,
   answer: [fam, V],
   hints: [hint1, hint2],
   solution: `${why} ${steps} F(${n(hi)}) ${ap(top)}${cue} and F(${n(lo)}) ${ap(bot)}, so the integral is ${n(top)} − ${par(bot)} ${say3(top - bot)}.`,
   guidance: [
    { prompt: `Look at the shape of ${f}. Which technique fits? Enter its number, 1 to 4.`, answer: [fam], explanation: why },
    { prompt: `The antiderivative is F(x) = ${F}. What are F(${n(hi)}) and F(${n(lo)}), to 3 decimal places?`, answer: [r3(top), r3(bot)], explanation: `${steps} F(${n(hi)}) ${ap(top)} and F(${n(lo)}) ${ap(bot)}.` },
    { prompt: `Subtract, using the unrounded values: what is F(${n(hi)}) − F(${n(lo)}), to 3 decimal places?`, answer: [V], explanation: `${n(top)} − ${par(bot)} ${say3(top - bot)}.` }
   ] }; }
 },
 /* An echo's power: C ÷ tᵖ from t = 1 (p = ½, 1, 2, 3), or C·e^(−kt) from t = 0 (k = ½, 1, 2, 4). The integral to t = 10,
    then whether the integral to ∞ converges, then its value (0 when it diverges). C ÷ tᵖ converges only for p > 1. */
 q24: {
  canonical: { fam: 'p', C: 6, p: 2 },
  draw: R => R.int(1, 3) === 1 ? { fam: 'e', C: R.int(2, 9), k: R.pick([0.5, 1, 2, 4]) } : { fam: 'p', C: R.int(2, 9), p: R.pick([0.5, 1, 2, 3]) },
  build: P => { const { fam, C } = P; let f, lo, F, Fv, conv, val, inB, settle;
   if (fam === 'e') { const { k } = P; lo = 0; Fv = t => -C / k * Math.exp(-k * t); f = `${n(C)}${eNeg(k, 't')}`; F = `−${ce(C / k)}${eNeg(k, 't')}`; conv = 1; val = C / k;
    inB = `${n(C / k)} − ${ce(C / k)}${eNeg(k, 'b')}`; settle = `${eNeg(k, 'b')} shrinks to 0, so the integral settles on ${n(val)}`; }
   else { const { p } = P; lo = 1; f = `${n(C)} ÷ ${powT(p, 't')}`;
    if (p === 0.5) { F = `${n(2 * C)}√t`; Fv = t => 2 * C * Math.sqrt(t); conv = 0; val = 0; inB = `${n(2 * C)}√b − ${n(2 * C)}`; settle = '√b grows without bound, so the integral grows without bound too'; }
    else if (p === 1) { F = `${n(C)} ln t`; Fv = t => C * Math.log(t); conv = 0; val = 0; inB = `${n(C)} ln b`; settle = 'ln b grows without bound, slowly but for ever, so the integral grows without bound too'; }
    else if (p === 2) { F = `−${n(C)} ÷ t`; Fv = t => -C / t; conv = 1; val = C; inB = `${n(C)} − ${n(C)} ÷ b`; settle = `${n(C)} ÷ b shrinks to 0, so the integral settles on ${n(val)}`; }
    else { F = `−${n(C / 2)} ÷ t²`; Fv = t => -C / 2 / (t * t); conv = 1; val = C / 2; inB = `${n(C / 2)} − ${n(C / 2)} ÷ b²`; settle = `${n(C / 2)} ÷ b² shrinks to 0, so the integral settles on ${n(val)}`; } }
   const part = Fv(10) - Fv(lo), I = r3(part), sums = `F(10) − F(${n(lo)}) = ${n(Fv(10))} − ${par(Fv(lo))} ${say3(part)}`,
    verdict = conv ? `It converges: enter 1, then ${n(val)}.` : 'It diverges: enter 0, and 0 for the value.'; return {
   prompt: `A fading echo reaches the Deep Signal Array with power ${f} units at time t seconds, for t ≥ ${n(lo)}. Its total energy is the improper integral ∫ from ${n(lo)} to ∞ of ${f} dt. First enter ∫ from ${n(lo)} to 10 of ${f} dt, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
   answer: [I, conv, val],
   hints: [`An antiderivative of ${f} is ${F}. Work it out at the top limit and at the bottom limit, and subtract.`,
    'For the improper integral, put a letter b in place of the top limit, then let b grow without bound (b → ∞). If the result settles on a number, the integral converges to it; if it grows without bound, the integral diverges.'],
   solution: `An antiderivative is F(t) = ${F}. From ${n(lo)} to 10 the integral is ${sums}. With top limit b the integral is ${inB}. As b → ∞, ${settle}. ${verdict}`,
   guidance: [
    { prompt: `An antiderivative of ${f} is ${F}. What is the integral from ${n(lo)} to 10, to 3 decimal places?`, answer: [I], explanation: `Top limit minus bottom limit: ${sums}.` },
    { prompt: `With top limit b, the integral is ${inB}. As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv], explanation: `As b → ∞, ${settle}.` },
    { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [val], explanation: conv ? `The integral converges to ${n(val)}: the energy is finite even though the echo never stops.` : 'It diverges, so there is no value: enter 0. The echo fades, but not fast enough for its total to stay finite.' }
   ] }; }
 },
 /* Power C ÷ (t − a)ᵖ for a < t ≤ a + L, blowing up at t = a. p = ½ converges (to 2C√L, L a square); p = 1 and 2 diverge.
    First the integral from a + 0.01, then 1 or 0, then the value (0 when it diverges). */
 q25: {
  canonical: { C: 3, p: 0.5, a: 0, L: 4 },
  draw: R => { const p = R.pick([0.5, 0.5, 1, 2]); return { C: R.int(2, 9), p, a: R.int(0, 3), L: p === 0.5 ? R.pick([4, 9, 16]) : R.int(2, 6) }; },
  build: ({ C, p, a, L }) => { const s = v => a === 0 ? v : `(${v} − ${n(a)})`, root = v => a === 0 ? `√${v}` : `√(${v} − ${n(a)})`,
   end = a + L, start = a + 0.01; let f, F, Fv, conv, val, inC, settle;
   if (p === 0.5) { f = `${n(C)} ÷ ${root('t')}`; F = `${n(2 * C)}${root('t')}`; Fv = t => 2 * C * Math.sqrt(t - a); conv = 1; val = 2 * C * Math.sqrt(L);
    inC = `${n(val)} − ${n(2 * C)}${root('c')}`; settle = `${root('c')} shrinks to 0, so the integral settles on ${n(val)}`; }
   else if (p === 1) { f = `${n(C)} ÷ ${s('t')}`; F = `${n(C)} ln${a === 0 ? ' t' : s('t')}`; Fv = t => C * Math.log(t - a); conv = 0; val = 0;
    inC = `${n(C)} ln ${n(L)} − ${n(C)} ln${a === 0 ? ' c' : s('c')}`; settle = `ln${a === 0 ? ' c' : s('c')} heads down without bound, so the integral grows without bound`; }
   else { f = `${n(C)} ÷ ${a === 0 ? 't²' : s('t') + '²'}`; F = `−${n(C)} ÷ ${s('t')}`; Fv = t => -C / (t - a); conv = 0; val = 0;
    inC = `${n(C)} ÷ ${s('c')} − ${n(C)} ÷ ${n(L)}`; settle = `${n(C)} ÷ ${s('c')} grows without bound, so the integral grows without bound`; }
   const part = Fv(end) - Fv(start), I = r3(part), sums = `F(${n(end)}) − F(${n(start)}) = ${n(Fv(end))} − ${par(Fv(start))} ${say3(part)}`,
    verdict = conv ? `It converges: enter 1, then ${n(val)}.` : 'It diverges: enter 0, and 0 for the value.'; return {
   prompt: `The Deep Signal Array’s receiver switches on at time t = ${n(a)}, in seconds, and its input power is P(t) = ${f} units for ${n(a)} < t ≤ ${n(end)}: it grows without bound just after t = ${n(a)}. The energy received is ∫ from ${n(a)} to ${n(end)} of P(t) dt, an improper integral because P blows up at t = ${n(a)}. First enter the integral from t = ${n(start)} to t = ${n(end)}, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
   answer: [I, conv, val],
   hints: [`An antiderivative of ${f} is ${F}. Work it out at t = ${n(end)} and at t = ${n(start)}, and subtract.`,
    `For the improper integral, put a letter c in place of the bottom limit ${n(a)}, then let c come down to ${n(a)} from above. If the result settles on a number, the integral converges to it; if it grows without bound, it diverges.`],
   solution: `An antiderivative is F(t) = ${F}. From t = ${n(start)} to t = ${n(end)} the integral is ${sums}. With bottom limit c the integral is ${inC}. As c comes down to ${n(a)}, ${settle}. ${verdict}`,
   guidance: [
    { prompt: `An antiderivative of ${f} is ${F}. What is the integral from t = ${n(start)} to t = ${n(end)}, to 3 decimal places?`, answer: [I], explanation: `Top limit minus bottom limit: ${sums}.` },
    { prompt: `With bottom limit c, the integral is ${inC}. As c comes down to ${n(a)}, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv], explanation: `As c comes down to ${n(a)}, ${settle}.` },
    { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [val], explanation: conv ? `The integral converges to ${n(val)}: the power is endless at the start, but the energy is finite.` : 'It diverges, so there is no value: enter 0. The power blows up too fast near the start for the energy to be finite.' }
   ] }; }
 },
 /* Half-life T days, y0 kg now, y1 kg left: k = ln 2 ÷ T to 4 places, t = ln(y0 ÷ y1) ÷ k to 2 places.
    y0 ÷ y1 is never a power of 2, so the time is not a whole number of half-lives. */
 q26: {
  canonical: { T: 12, y0: 80, y1: 25 },
  draw: R => { let p; do { const y0 = 10 * R.int(4, 20); p = { T: R.int(4, 40), y0, y1: R.int(Math.ceil(y0 / 10), Math.floor(0.9 * y0)) }; } while (Number.isInteger(Math.log2(p.y0 / p.y1)) || (p.T === 30 && p.y0 === 50 && p.y1 === 20) || edge(Math.LN2 / p.T, 4) || edge(Math.log(p.y0 / p.y1) * p.T / Math.LN2, 2)); return p; },
  build: ({ T, y0, y1 }) => { const k = Math.LN2 / T, lr = Math.log(y0 / y1), t = lr / k; return {
   prompt: `The Deep Signal Array’s power cells run on an isotope fuel with a half-life of ${n(T)} days: every ${n(T)} days, half of what is left decays. The store holds ${n(y0)} kg now, so the amount after t days is y(t) = ${n(y0)}e^(−kt) kg. Enter the rate constant k, per day, to 4 decimal places, then the number of days until only ${n(y1)} kg is left, to 2 decimal places (work with the unrounded k).`,
   answer: [r4(k), r2(t)],
   hints: [`After one half-life the amount has halved: ${n(y0)}e^(−${n(T)}k) = ${n(y0 / 2)}, so e^(−${n(T)}k) = 1/2. Take ln of both sides.`,
    `Then solve ${n(y0)}e^(−kt) = ${n(y1)}: divide by ${n(y0)}, take ln of both sides, and divide by −k.`],
   solution: `e^(−${n(T)}k) = 1/2 gives −${n(T)}k = ln(1/2) = −ln 2, so k = ln 2 ÷ ${n(T)} ≈ ${r4(k).toFixed(4)} to 4 decimal places. Then ${n(y0)}e^(−kt) = ${n(y1)} gives e^(−kt) = ${n(y1)} ÷ ${n(y0)}, so kt = ln(${n(y0)} ÷ ${n(y1)}) = ${n(lr)} and t = ${n(lr)} ÷ k ≈ ${n(t)}, dividing by the unrounded k, which is ${r2(t).toFixed(2)} days to 2 decimal places.`,
   guidance: [
    { prompt: `One half-life halves the fuel: e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)}. What is k to 4 decimal places?`, answer: [r4(k)], explanation: `ln 2 ≈ 0.6931, and ln 2 ÷ ${n(T)} ≈ ${r4(k).toFixed(4)} to 4 decimal places. Keep the full value of k for the next steps.` },
    { prompt: `To reach ${n(y1)} kg, e^(−kt) = ${n(y1)} ÷ ${n(y0)}, so kt = ln(${n(y0)} ÷ ${n(y1)}). What is ln(${n(y0)} ÷ ${n(y1)}) to 4 decimal places?`, answer: [r4(lr)], explanation: `${n(y0)} ÷ ${n(y1)} ${ap(y0 / y1)}, and its natural logarithm is ${(r4(lr)).toFixed(4)} to 4 decimal places.` },
    { prompt: `Divide by the unrounded k: t = ln(${n(y0)} ÷ ${n(y1)}) ÷ k. How many days is that, to 2 decimal places?`, answer: [r2(t)], explanation: `${n(lr)} ÷ k ≈ ${n(t)} with the unrounded k, which is ${r2(t).toFixed(2)} days. That is about ${n(r2(t / T))} half-lives.` }
   ] }; }
 },
 /* aₙ = (p·G + q) ÷ (r·G + s) with G = n (g 'n') or G = 2ⁿ (g '2'). The term a_m to 3 places, then the limit p ÷ r,
    which is a short decimal because r is 1, 2, 4 or 5. p·s ≠ q·r, so the sequence is not constant. */
 q27: {
  canonical: { g: 'n', p: 6, q: 5, r: 2, s: 3, m: 10 },
  draw: R => { let P; do { const g = R.pick(['n', '2']); P = { g, p: R.int(1, 9), q: R.int(1, 9), r: R.pick([1, 2, 4, 5]), s: R.int(1, 9), m: g === 'n' ? R.pick([10, 20, 50, 100]) : R.int(3, 8) }; } while (P.p * P.s === P.q * P.r || (P.g === 'n' && P.p === 3 && P.q === 1 && P.r === 1 && P.s === 4)); return P; },
  build: ({ g, p, q, r, s, m }) => { const Gm = g === 'n' ? m : Math.pow(2, m), Gt = g === 'n' ? 'n' : '2ⁿ',
   lead = v => g === 'n' ? co(v, 'n') : v === 1 ? '2ⁿ' : `${n(v)} × 2ⁿ`, f = `(${lead(p)} + ${n(q)}) ÷ (${lead(r)} + ${n(s)})`,
   top = p * Gm + q, bot = r * Gm + s, am = r3(top / bot), L = p / r, Gshow = g === 'n' ? `n = ${n(m)}` : `n = ${n(m)}, where 2${sup(m)} = ${n(Gm)}`; return {
   prompt: `The Deep Signal Array sweeps the sky again and again, and its noise reading after sweep n is aₙ = ${f}. The readings a₁, a₂, a₃, … form a sequence. Enter a${sub(m)}, the reading after sweep ${n(m)}, to 3 decimal places, then the limit of the sequence as n → ∞.`,
   answer: [am, L],
   hints: [`Put n = ${n(m)} into the formula${g === '2' ? ` (2${sup(m)} = ${n(Gm)})` : ''}, work out the top and the bottom, then divide.`,
    `For the limit, divide the top and the bottom by ${Gt}. The parts ${n(q)} ÷ ${Gt} and ${n(s)} ÷ ${Gt} shrink to 0 as n grows.`],
   solution: `With ${Gshow}, the top is ${n(p)} × ${n(Gm)} + ${n(q)} = ${n(top)} and the bottom is ${n(r)} × ${n(Gm)} + ${n(s)} = ${n(bot)}, so a${sub(m)} = ${n(top)} ÷ ${n(bot)} ${say3(top / bot)}. Dividing the top and the bottom by ${Gt} gives aₙ = (${n(p)} + ${n(q)} ÷ ${Gt}) ÷ (${n(r)} + ${n(s)} ÷ ${Gt}). As n → ∞ the parts divided by ${Gt} approach 0, so aₙ approaches ${n(p)} ÷ ${n(r)} = ${n(L)}. The limit is ${n(L)}.`,
   guidance: [
    { prompt: `Put n = ${n(m)} into aₙ = ${f}. What is a${sub(m)} to 3 decimal places?`, answer: [am], explanation: `The top is ${n(p)} × ${n(Gm)} + ${n(q)} = ${n(top)} and the bottom is ${n(r)} × ${n(Gm)} + ${n(s)} = ${n(bot)}. ${n(top)} ÷ ${n(bot)} ${say3(top / bot)}.` },
    { prompt: `Divide the top and the bottom by ${Gt}: aₙ = (${n(p)} + ${n(q)} ÷ ${Gt}) ÷ (${n(r)} + ${n(s)} ÷ ${Gt}). As n → ∞, what do the top and the bottom approach?`, answer: [p, r], explanation: `${n(q)} ÷ ${Gt} and ${n(s)} ÷ ${Gt} shrink to 0, so the top approaches ${n(p)} and the bottom approaches ${n(r)}.` },
    { prompt: `So what is the limit of the sequence?`, answer: [L], explanation: `${n(p)} ÷ ${n(r)} = ${n(L)}. The readings settle on ${n(L)}, the ratio of the two leading coefficients.` }
   ] }; }
 },
 /* Echo strengths a, ar, ar², … with r = p/q (one of PAIRS) and a = q²(q − p)j, so every number shown is whole and the
    sum a ÷ (1 − r) = q³j is below 1000. Not the worked example (54, 18, 6, …). */
 q28: {
  canonical: { p: 2, q: 3, j: 4 },
  /* p/q = 1/3 with j = 3 would be 54, 18, 6, …, the worked example. */
  draw: R => { let P; do { P = drawGeo(R); } while (P.p === 1 && P.q === 3 && P.j === 3); return P; },
  build: P => { const { a, a1, a2, r, S, S3, frac, oneMinus } = geo(P); return {
   prompt: `Each echo the Deep Signal Array hears from a far mirror is weaker than the one before by the same factor. The echo strengths are ${n(a)}, ${n(a1)}, ${n(a2)}, … and so on for ever. Enter the common ratio r (a fraction such as 1/2 is fine), then the sum of the whole series of echoes.`,
   answer: [r, S],
   hints: [`The common ratio is any term divided by the one before it, such as ${n(a1)} ÷ ${n(a)}.`, 'The ratio is between −1 and 1, so the geometric series converges, and its sum is a ÷ (1 − r), where a is the first term.'],
   solution: `r = ${n(a1)} ÷ ${n(a)} = ${frac}, and ${n(a2)} ÷ ${n(a1)} gives ${frac} again. The partial sum of the first three terms is S₃ = ${n(a)} + ${n(a1)} + ${n(a2)} = ${n(S3)}. Because ${frac} is between −1 and 1, the series converges, to a ÷ (1 − r) = ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${P.q - P.p === 1 ? n(P.q) : P.q + '/' + (P.q - P.p)} = ${n(S)}.`,
   guidance: [
    { prompt: `Divide the second echo by the first: what is ${n(a1)} ÷ ${n(a)}? (A fraction is fine.)`, answer: [r], explanation: `${n(a1)} ÷ ${n(a)} = ${frac}. The third echo divided by the second gives the same, ${n(a2)} ÷ ${n(a1)} = ${frac}, so the common ratio is ${frac}.` },
    { prompt: 'Add the first three echoes. What is the partial sum S₃?', answer: [S3], explanation: `S₃ = ${n(a)} + ${n(a1)} + ${n(a2)} = ${n(S3)}. Each further partial sum adds a smaller piece.` },
    { prompt: `Use a ÷ (1 − r) with a = ${n(a)} and r = ${frac}. What is the sum of the whole series?`, answer: [S], explanation: `1 − ${frac} = ${oneMinus}, and ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${P.q - P.p === 1 ? n(P.q) : P.q + '/' + (P.q - P.p)} = ${n(S)}. The partial sums climb towards ${n(S)} and never pass it.` }
   ] }; }
 },
 /* A tone that fades (C·e^(−kt) from 0, or C ÷ tᵖ from 1 with p = 2 or 3) plus geometric pulses as in q28.
    Asked: the tone's energy (the improper integral, always convergent here), then the sum of the pulses. */
 q29: {
  canonical: { fam: 'e', C: 8, k: 0.5, p: 2, q: 5, j: 1 },
  draw: R => { const g = drawGeo(R); return R.bool() ? { fam: 'e', C: R.int(2, 9), k: R.pick([0.5, 2, 4]), ...g } : { fam: 't', C: R.int(2, 9), pw: R.pick([2, 3]), ...g }; },
  build: P => { const { fam, C } = P, { a, a1, a2, r, S, frac, oneMinus } = geo(P); let f, lo, F, I, inB;
   if (fam === 'e') { const { k } = P; lo = 0; f = `${n(C)}${eNeg(k, 't')}`; F = `−${ce(C / k)}${eNeg(k, 't')}`; I = C / k; inB = `${n(I)} − ${ce(I)}${eNeg(k, 'b')}`; }
   else { const { pw } = P; lo = 1; f = `${n(C)} ÷ t${sup(pw)}`; I = C / (pw - 1); F = pw === 2 ? `−${n(C)} ÷ t` : `−${n(I)} ÷ t²`; inB = pw === 2 ? `${n(C)} − ${n(C)} ÷ b` : `${n(I)} − ${n(I)} ÷ b²`; }
   return {
   prompt: `The Long-range Dish tracks a beacon that sends two things. Its tone fades, with power ${f} units at time t seconds, so the tone’s total energy is the improper integral ∫ from ${n(lo)} to ∞ of ${f} dt. It also sends pulses carrying ${n(a)}, ${n(a1)}, ${n(a2)}, … units, each the same fraction of the one before, for ever. Enter the energy of the tone, then the total energy of all the pulses.`,
   answer: [I, S],
   hints: [`An antiderivative of ${f} is ${F}. Integrate from ${n(lo)} up to a top limit b, then let b → ∞.`, `For the pulses, the common ratio is ${n(a1)} ÷ ${n(a)}, and a geometric series with ratio between −1 and 1 adds up to a ÷ (1 − r).`],
   solution: `Tone: from ${n(lo)} to b the integral is ${inB}. As b → ∞ the part with b shrinks to 0, so the improper integral converges to ${n(I)}. Pulses: r = ${n(a1)} ÷ ${n(a)} = ${frac}, so the series converges to ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(S)}.`,
   guidance: [
    { prompt: `With top limit b, the tone’s integral is ${inB}. What does it approach as b → ∞?`, answer: [I], explanation: `The part with b shrinks to 0 as b grows, so the improper integral converges to ${n(I)}.` },
    { prompt: `What is the common ratio of the pulses, ${n(a1)} ÷ ${n(a)}? (A fraction is fine.)`, answer: [r], explanation: `${n(a1)} ÷ ${n(a)} = ${frac}, and ${n(a2)} ÷ ${n(a1)} gives ${frac} too.` },
    { prompt: `What is the sum of the pulses, a ÷ (1 − r)?`, answer: [S], explanation: `${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(S)}.` }
   ] }; }
 },
 /* aₙ = d + c ÷ (n(n + k)), k = 1 or 2, c a multiple of k. c ÷ (n(n + k)) = (c ÷ k)(1 ÷ n − 1 ÷ (n + k)) telescopes.
    d = 0: the series converges to (c ÷ k)(1 + … + 1 ÷ k). d > 0: the terms approach d, so it diverges (enter 0). */
 q30: {
  canonical: { c: 12, k: 2, d: 0 },
  draw: R => { let P; do { const k = R.pick([1, 2]); P = { c: k * R.int(2, 12), k, d: R.bool() ? 0 : R.int(1, 5) }; } while (P.c === 6 && P.k === 1 && P.d === 0); return P; },
  build: ({ c, k, d }) => { const h = c / k, head = k === 1 ? '1' : '1 + 1/2', tail = k === 1 ? '1/11' : '1/11 − 1/12',
   fade = `${n(c)} ÷ (n(n + ${n(k)}))`, f = d ? `${n(d)} + ${fade}` : fade,
   tele = h * (k === 1 ? 1 - 1 / 11 : 1.5 - 1 / 11 - 1 / 12), S10 = 10 * d + tele, sum = d ? 0 : h * (k === 1 ? 1 : 1.5),
   split = `${fade} = ${n(h)} × (1 ÷ n − 1 ÷ (n + ${n(k)}))`,
   cancel = `In S₁₀ each −1 ÷ (n + ${n(k)}) cancels the 1 ÷ n of a later term, leaving ${n(h)} × (${head} − ${tail})`; return {
   prompt: `Relay pulses in the Signal Lab carry energies a₁, a₂, a₃, … with aₙ = ${f}. The total of them all is the series a₁ + a₂ + a₃ + …, written Σ aₙ. Enter the partial sum S₁₀ = a₁ + a₂ + … + a₁₀ to 3 decimal places, then the sum of the whole series, or 0 if the series diverges.`,
   answer: [r3(S10), sum],
   hints: [`Split the fading part: ${split}. Write out the first few terms and watch them cancel.`,
    'Before adding for ever, look at the terms: if aₙ does not approach 0 as n → ∞, the divergence test says the series diverges.'],
   solution: d
    ? `The terms approach ${n(d)} + 0 = ${n(d)}, not 0, so by the divergence test the series diverges: enter 0 for the sum. The partial sum is still a finite number. ${split}. ${cancel} ${ap(tele)}, and the ten copies of ${n(d)} add ${n(10 * d)}, so S₁₀ ${say3(S10)}.`
    : `${split}. ${cancel} ${say3(tele)}. For the partial sum of N terms the same cancelling leaves ${n(h)} × (${head}) minus pieces that shrink to 0 as N → ∞, so the series converges to ${n(h)} × (${head}) = ${n(sum)}.`,
   guidance: [
    { prompt: `As n → ∞, what does aₙ = ${f} approach?`, answer: [d], explanation: d ? `The fraction shrinks to 0, so aₙ approaches ${n(d)}. That is not 0, so the divergence test already says the series diverges.` : 'The bottom grows without bound, so aₙ approaches 0. The divergence test then says nothing, and we have to look at the partial sums.' },
    { prompt: `Use ${split}. What is S₁₀ to 3 decimal places?`, answer: [r3(S10)], explanation: d ? `${cancel} ${ap(tele)}. Adding 10 × ${n(d)} = ${n(10 * d)} gives S₁₀ ${ap(S10)}.` : `${cancel} ${ap(tele)}.` },
    { prompt: 'What is the sum of the whole series? Enter 0 if it diverges.', answer: [sum], explanation: d ? `The partial sums grow by about ${n(d)} with every term, without bound, so the series diverges: enter 0.` : `As N → ∞ the leftover pieces at the end of the partial sums shrink to 0, so the partial sums approach ${n(h)} × (${head}) = ${n(sum)}.` }
   ] }; }
 },
});
})();
