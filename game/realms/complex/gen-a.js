/* Complex analysis: the plane of numbers mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4': a complex number written the usual way. */
const cx = (a, b) => { if (b === 0) return n(a); const im = (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; if (a === 0) return (b < 0 ? '−' : '') + im; return `${n(a)} ${b < 0 ? '−' : '+'} ${im}`; };
/* k i² written out: 'i²', '−i²', '6i²'. */
const i2 = k => (k === 1 ? '' : k === -1 ? '−' : n(k)) + 'i²';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* piT(5, 6) is '5π ÷ 6', piT(2, 4) is 'π ÷ 2', piT(−8, 4) is '−2π', piT(0, 4) is '0'. */
const piT = (p, q) => { if (p === 0) return '0'; const g = gcd(p, q); p /= g; q /= g; const top = p === 1 ? 'π' : p === -1 ? '−π' : n(p) + 'π'; return q === 1 ? top : `${top} ÷ ${n(q)}`; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).replace('-', '⁻').replace(/\d/g, d => SUP[d]);
const r2 = x => { const r = Math.round(x * 100) / 100; return r === 0 ? 0 : r; };
const d2 = x => r2(x).toFixed(2).replace('-', '−');
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
/* Near a rounding tie at the second decimal, or within reach of one: such draws are skipped. */
const nearTie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-3;
const rd = x => exact2(x) ? `= ${n(x)}` : `≈ ${n(x)}, which is ${d2(x)} to 2 decimal places`;
/* Exact cos and sin of a multiple of π ÷ 12 that is a multiple of π ÷ 6 or π ÷ 4. */
const exactText = v => { const s = v < 0 ? '−' : '', a = Math.abs(v); if (a < 1e-9) return '0'; if (Math.abs(a - 1) < 1e-9) return s + '1';
 if (Math.abs(a - 0.5) < 1e-9) return s + '1 ÷ 2'; if (Math.abs(a - Math.SQRT1_2) < 1e-9) return s + '√2 ÷ 2'; return s + '√3 ÷ 2'; };
const rootName = k => ({ 2: 'square', 3: 'cube', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth' })[k] + ' roots';
const pick = (R, make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
/* The principal argument of a + bi (both non-zero) worked through its reference angle. */
const argWork = (a, b) => { const ref = Math.atan(Math.abs(b) / Math.abs(a)), arg = Math.atan2(b, a);
 const place = a > 0 && b > 0 ? 'above the real axis and to the right of the imaginary axis (quadrant 1)'
  : a < 0 && b > 0 ? 'above the real axis and to the left of the imaginary axis (quadrant 2)'
  : a < 0 ? 'below the real axis and to the left of the imaginary axis (quadrant 3)' : 'below the real axis and to the right of the imaginary axis (quadrant 4)';
 const rule = a > 0 && b > 0 ? 'Arg z is the angle itself' : a < 0 && b > 0 ? 'Arg z = π − angle' : a < 0 ? 'Arg z = −(π − angle)' : 'Arg z = −angle';
 return { ref, arg, place, rule }; };
/* q03 and q09 skip draws where rounding the reference angle first would change the second decimal of Arg z. */
const argOk = (a, b) => { const w = argWork(a, b), rr = r2(w.ref), alt = a > 0 ? (b > 0 ? rr : -rr) : (b > 0 ? Math.PI - rr : -(Math.PI - rr));
 return !nearTie(w.ref) && !nearTie(w.arg) && r2(alt) === r2(w.arg); };
const PYTH = [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15], [15, 8], [7, 24], [24, 7], [9, 12], [12, 9]];
const sgn = R => R.bool() ? 1 : -1;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* z = a + bi, w = c + di, every part a non-zero whole number from −9 to 9. Not the worked example (2 + i and 1 + 3i). */
 q01: {
  canonical: { a: 3, b: 2, c: 5, d: -1 },
  draw: R => pick(R, () => ({ a: R.nz(-9, 9), b: R.nz(-9, 9), c: R.nz(-9, 9), d: R.nz(-9, 9) }), p => !(p.a === 2 && p.b === 1 && p.c === 1 && p.d === 3), { a: 3, b: 2, c: 5, d: -1 }),
  build: ({ a, b, c, d }) => { const ac = a * c, ad = a * d, bc = b * c, bd = b * d, re = ac - bd, im = ad + bc; return {
   prompt: `Two antenna readings arrive as the complex numbers z = ${cx(a, b)} and w = ${cx(c, d)}. Combining the two signals adds them, and passing z through an amplifier set to w multiplies them. Enter the real part of z + w, the imaginary part of z + w, then the real part of zw and the imaginary part of zw.`,
   answer: [a + c, b + d, re, im],
   hints: ['To add, add the real parts together and add the imaginary parts together.', 'To multiply, multiply every part of z by every part of w, as with two brackets, then replace i² by −1 and collect the real terms and the i terms.'],
   solution: `Adding part by part, z + w = ${cx(a + c, b + d)}, so its real part is ${n(a + c)} and its imaginary part is ${n(b + d)}. Multiplying every part of z by every part of w gives four products: ${n(a)} × ${par(c)} = ${n(ac)}; ${n(a)} × (${cx(0, d)}) = ${cx(0, ad)}; (${cx(0, b)}) × ${par(c)} = ${cx(0, bc)}; and (${cx(0, b)}) × (${cx(0, d)}) = ${i2(bd)}, which is ${n(-bd)} because i² = −1. The real terms give ${n(ac)} + ${par(-bd)} = ${n(re)}, and the i terms give ${n(ad)} + ${par(bc)} = ${n(im)}. So zw = ${cx(re, im)}: real part ${n(re)}, imaginary part ${n(im)}.`,
   guidance: [
    { prompt: `Add the real parts of z and w, ${n(a)} and ${n(c)}. What is the real part of z + w?`, answer: [a + c], explanation: `${n(a)} + ${par(c)} = ${n(a + c)}.` },
    { prompt: `Add the imaginary parts of z and w, ${n(b)} and ${n(d)}. What is the imaginary part of z + w?`, answer: [b + d], explanation: `${n(b)} + ${par(d)} = ${n(b + d)}. The imaginary part is the plain number in front of i.` },
    { prompt: `The real part of zw comes from two products: ${n(a)} × ${par(c)}, and (${cx(0, b)}) × (${cx(0, d)}), which is real because i² = −1. What is the real part of zw?`, answer: [re], explanation: `${n(a)} × ${par(c)} = ${n(ac)}, and (${cx(0, b)}) × (${cx(0, d)}) = ${i2(bd)} = ${n(-bd)}. Together they make ${n(ac)} + ${par(-bd)} = ${n(re)}.` },
    { prompt: `The imaginary part of zw comes from the two cross products, ${n(a)} × (${cx(0, d)}) and (${cx(0, b)}) × ${par(c)}. What is the imaginary part of zw?`, answer: [im], explanation: `${n(a)} × (${cx(0, d)}) = ${cx(0, ad)} and (${cx(0, b)}) × ${par(c)} = ${cx(0, bc)}. Together they make ${n(ad)} + ${par(bc)} = ${n(im)}, the number in front of i.` }
   ] }; }
 },
 /* z = a + bi with non-zero parts from −9 to 9; w = c + di with c² + d² one of 2, 5, 10, 20, 25, 50, so every part of z ÷ w
    is an exact decimal with at most 2 places. Not the worked example ((5 + 5i) ÷ (2 − i)). */
 q02: {
  canonical: { a: 4, b: 7, c: 1, d: 2 },
  draw: R => { const W = [[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 4], [4, 2], [3, 4], [4, 3], [1, 7], [7, 1], [5, 5]];
   return pick(R, () => { const [c, d] = R.pick(W); return { a: R.nz(-9, 9), b: R.nz(-9, 9), c: sgn(R) * c, d: sgn(R) * d }; }, p => !(p.a === 5 && p.b === 5 && p.c === 2 && p.d === -1), { a: 4, b: 7, c: 1, d: 2 }); },
  build: ({ a, b, c, d }) => { const zz = a * a + b * b, D = c * c + d * d, nr = a * c + b * d, ni = b * c - a * d, re = nr / D, im = ni / D; return {
   prompt: `A receiver measures the signal z = ${cx(a, b)}, and the cable it came through scaled and turned every signal by the factor w = ${cx(c, d)}. To undo the cable the crew divides: z ÷ w. Enter z z̄ (z times its conjugate), then the real part and the imaginary part of z ÷ w. Each answer is an exact decimal or fraction.`,
   answer: [zz, re, im],
   hints: ['The conjugate of x + yi is x − yi, and (x + yi)(x − yi) = x² + y², a real number.', 'Multiply the top and the bottom of z ÷ w by w̄, the conjugate of w. The bottom becomes the real number w w̄; then divide each part of the top by it.'],
   solution: `z̄ = ${cx(a, -b)}, so z z̄ = ${par(a)}² + ${par(b)}² = ${n(a * a)} + ${n(b * b)} = ${n(zz)}. For the division, w̄ = ${cx(c, -d)} and w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}. The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Dividing each part by ${n(D)}: the real part of z ÷ w is ${n(nr)} ÷ ${n(D)} = ${n(re)} and the imaginary part is ${n(ni)} ÷ ${n(D)} = ${n(im)}, so z ÷ w = ${cx(re, im)}.`,
   guidance: [
    { prompt: `The conjugate of z is z̄ = ${cx(a, -b)}. What is z z̄?`, answer: [zz], explanation: `(${cx(a, b)})(${cx(a, -b)}) = ${par(a)}² + ${par(b)}² = ${n(zz)}. The i terms cancel, so the product is real.` },
    { prompt: `Multiply the bottom of z ÷ w by its conjugate: w w̄ = (${cx(c, d)})(${cx(c, -d)}). What real number is it?`, answer: [D], explanation: `w w̄ = ${par(c)}² + ${par(d)}² = ${n(D)}.` },
    { prompt: `The top becomes z w̄ = (${cx(a, b)})(${cx(c, -d)}) = ${cx(nr, ni)}. Divide its real part by w w̄ = ${n(D)}. What is the real part of z ÷ w?`, answer: [re], explanation: `Multiplying out, the real terms of z w̄ are ${n(a)} × ${par(c)} = ${n(a * c)} and (${cx(0, b)}) × (${cx(0, -d)}) = ${n(b * d)}, together ${n(nr)}. Then ${n(nr)} ÷ ${n(D)} = ${n(re)}.` },
    { prompt: `Now divide the imaginary part of the top, ${n(ni)}, by ${n(D)}. What is the imaginary part of z ÷ w?`, answer: [im], explanation: `${n(ni)} ÷ ${n(D)} = ${n(im)}. Check: (${cx(re, im)}) × (${cx(c, d)}) gives back ${cx(a, b)}.` }
   ] }; }
 },
 /* z = a + bi with |z| from a Pythagorean triple, in any quadrant. Skips draws where the angle sits near a rounding tie
    or where rounding the reference angle first would change Arg z. Never the direction of the worked example (−3 − 4i). */
 q03: {
  canonical: { a: -8, b: 6 },
  draw: R => pick(R, () => { const [x, y] = R.pick(PYTH); return { a: sgn(R) * x, b: sgn(R) * y }; }, p => !(p.a < 0 && 4 * p.a === 3 * p.b) && !(p.a === -8 && p.b === 6) && argOk(p.a, p.b), { a: -8, b: 6 }),
  build: ({ a, b }) => { const r = Math.round(Math.hypot(a, b)), w = argWork(a, b); return {
   prompt: `An antenna picks up a signal at the point z = ${cx(a, b)} of the complex plane. Enter its modulus |z|, then its principal argument Arg z in radians (between −π and π), to 2 decimal places.`,
   answer: [r, r2(w.arg)],
   hints: ['The modulus is the distance from 0 to z: |x + yi| = √(x² + y²).', 'First find the angle arctan(|y| ÷ |x|) between z and the real axis. If z is left of the imaginary axis, take π minus that angle; if z is below the real axis, make the result negative.'],
   solution: `|z| = √(${par(a)}² + ${par(b)}²) = √${n(a * a + b * b)} = ${n(r)}. The angle between z and the real axis is arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)} radians. z lies ${w.place}, so ${w.rule}. With the unrounded angle, Arg z ${rd(w.arg)}.`,
   guidance: [
    { prompt: `How far is z = ${cx(a, b)} from 0? Enter |z|.`, answer: [r], explanation: `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(a * a + b * b)} = ${n(r)}.` },
    { prompt: `What is the angle arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) between z and the real axis, in radians, to 2 decimal places?`, answer: [r2(w.ref)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ${rd(w.ref)}. Keep the unrounded value for the next step.` },
    { prompt: `z lies ${w.place}. What is Arg z, in radians, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `In this quadrant ${w.rule}. Using the unrounded angle ${n(w.ref)}, Arg z ${rd(w.arg)}.` }
   ] }; }
 },
 /* z = r e^(iθ), r from 2 to 9, θ a multiple of π ÷ 6 or π ÷ 4 off the axes, in (0, 2π). Not the worked example (2, π ÷ 3). */
 q04: {
  canonical: { r: 6, k: 5, q: 6 },
  draw: R => pick(R, () => { const q = R.pick([6, 4]); return { r: R.int(2, 9), k: q === 6 ? R.pick([1, 2, 4, 5, 7, 8, 10, 11]) : R.pick([1, 3, 5, 7]), q }; },
   p => { const t = p.k * Math.PI / p.q; return !(p.r === 2 && p.k === 2 && p.q === 6) && !(p.r === 6 && p.k === 5 && p.q === 6) && !nearTie(p.r * Math.cos(t)) && !nearTie(p.r * Math.sin(t)); }, { r: 6, k: 5, q: 6 }),
  build: ({ r, k, q }) => { const t = k * Math.PI / q, c = Math.cos(t), s = Math.sin(t), re = r * c, im = r * s, th = piT(k, q),
   quad = c > 0 ? (s > 0 ? 1 : 4) : (s > 0 ? 2 : 3); return {
   prompt: `An antenna array sends out a signal of strength ${n(r)}, turned through the angle θ = ${th} radians, so the signal is z = ${n(r)}e^(iθ). Enter the real part and the imaginary part of z, each to 2 decimal places.`,
   answer: [r2(re), r2(im)],
   hints: ['Euler\'s formula: e^(iθ) = cos θ + i sin θ, so r e^(iθ) = r cos θ + i r sin θ.', 'Find the quadrant the angle points into: it gives the signs of cos θ and sin θ. Their sizes come from the angle that θ makes with the real axis.'],
   solution: `By Euler's formula, z = ${n(r)}(cos θ + i sin θ). The angle ${th} points into quadrant ${quad}, where cos(${th}) = ${exactText(c)} and sin(${th}) = ${exactText(s)}. So the real part is ${n(r)} × (${exactText(c)}) ${rd(re)}, and the imaginary part is ${n(r)} × (${exactText(s)}) ${rd(im)}.`,
   guidance: [
    { prompt: `Into which quadrant does the angle θ = ${th} point? Enter 1, 2, 3 or 4 (quadrant 1 is the upper right, and they are numbered anticlockwise).`, answer: [quad], explanation: `Measured anticlockwise from the positive real axis, ${th} lies in quadrant ${quad}, so cos θ is ${c > 0 ? 'positive' : 'negative'} and sin θ is ${s > 0 ? 'positive' : 'negative'}.` },
    { prompt: `The real part is ${n(r)} cos(${th}). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${th}) = ${exactText(c)}, so ${n(r)} × (${exactText(c)}) ${rd(re)}.` },
    { prompt: `The imaginary part is ${n(r)} sin(${th}). What is it, to 2 decimal places?`, answer: [r2(im)], explanation: `sin(${th}) = ${exactText(s)}, so ${n(r)} × (${exactText(s)}) ${rd(im)}.` }
   ] }; }
 },
 /* zⁿ for z = ±1 ± i (modulus √2, angle mπ ÷ 4 with m odd) and n from 3 to 12; the answers are whole numbers.
    m is the angle of z in quarter-π steps, from 0 to 2π. Not the worked example ((1 + i)⁴). */
 q05: {
  canonical: { a: -1, b: 1, p: 5 },
  draw: R => pick(R, () => ({ a: sgn(R), b: sgn(R), p: R.int(3, 12) }), x => !(x.a === 1 && x.b === 1 && x.p === 4) && !(x.a === -1 && x.b === 1 && x.p === 5), { a: -1, b: 1, p: 5 }),
  build: ({ a, b, p }) => { const m = a > 0 ? (b > 0 ? 1 : 7) : (b > 0 ? 3 : 5), M = (m * p) % 8;
   let re = 1, im = 0; for (let i = 0; i < p; i++) [re, im] = [re * a - im * b, re * b + im * a];
   const size = p % 2 === 0 ? n(Math.pow(2, p / 2)) : `${n(Math.pow(2, (p - 1) / 2))}√2`, e = sup(p); return {
   prompt: `A rotor stage turns and scales a signal by the factor z = ${cx(a, b)} each time the signal passes through it. After ${n(p)} passes the signal has been multiplied by z${e}. Enter the real part and the imaginary part of z${e}.`,
   answer: [re, im],
   hints: ['Write z in polar form r e^(iθ) first. Its modulus is √(x² + y²), and its angle is an odd multiple of π ÷ 4.', 'De Moivre\'s formula: (r e^(iθ))ⁿ = rⁿ e^(inθ). Multiply the angle by n, take away whole turns of 2π, then use cos and sin of what is left.'],
   solution: `|z| = √2 and z points at the angle θ = ${piT(m, 4)}, so z = √2 e^(iθ). By de Moivre's formula, z${e} = (√2)${e} e^(i × ${n(p)}θ). The angle ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}; taking away whole turns of 2π leaves ${piT(M, 4)}. The size is (√2)${e} = ${size}. So z${e} = ${size}(cos(${piT(M, 4)}) + i sin(${piT(M, 4)})) = ${cx(re, im)}: real part ${n(re)}, imaginary part ${n(im)}.`,
   guidance: [
    { prompt: `Write the angle of z = ${cx(a, b)}, between 0 and 2π, as kπ ÷ 4. What is k?`, answer: [m], explanation: `z sits on the diagonal of quadrant ${a > 0 ? (b > 0 ? 1 : 4) : (b > 0 ? 2 : 3)}, at the angle ${piT(m, 4)}, so k = ${n(m)}.` },
    { prompt: `De Moivre's formula multiplies the angle by ${n(p)}: ${n(p)} × ${piT(m, 4)} = ${piT(m * p, 4)}. Take away whole turns of 2π (each turn is 8 steps of π ÷ 4). The angle left is jπ ÷ 4 with j from 0 to 7: what is j?`, answer: [M], explanation: `${n(m * p)} steps of π ÷ 4, less whole turns of 8 steps, leaves ${M === 1 ? '1 step' : n(M) + ' steps'}, so the angle of z${e} is ${piT(M, 4)}.` },
    { prompt: `The size of z${e} is (√2)${e} = ${size}, and its angle is ${piT(M, 4)}. What is the real part of z${e}?`, answer: [re], explanation: `${size} × cos(${piT(M, 4)}) = ${n(re)}.` },
    { prompt: `With the same size and angle, what is the imaginary part of z${e}?`, answer: [im], explanation: `${size} × sin(${piT(M, 4)}) = ${n(im)}, so z${e} = ${cx(re, im)}.` }
   ] }; }
 },
 /* The roots of zᵖ = w for w = ρᵖ times 1, i, −1 or −i (dir 0, 1, 2, 3), p from 2 to 6 and ρ from 1 to 3.
    The arguments of the roots are (h + 4k)π ÷ (2p), where hπ ÷ 2 is Arg w. Not the worked example (4th roots of 1). */
 q06: {
  canonical: { p: 3, rho: 2, dir: 2 },
  draw: R => pick(R, () => ({ p: R.int(2, 6), rho: R.int(1, 3), dir: R.int(0, 3) }), x => !(x.p === 4 && x.rho === 1 && x.dir === 0) && !(x.p === 3 && x.rho === 2 && x.dir === 2), { p: 3, rho: 2, dir: 2 }),
  build: ({ p, rho, dir }) => { const W = Math.pow(rho, p), h = [0, 1, 2, -1][dir], w = [cx(W, 0), cx(0, W), cx(-W, 0), cx(0, -W)][dir];
   const nums = []; for (let k = 0; k < p; k++) nums.push(h + 4 * k); const best = Math.min(...nums.filter(v => v > 0));
   const list = nums.map(v => piT(v, 2 * p)).join(', '), ang = best * Math.PI / (2 * p), re = rho * Math.cos(ang), name = rootName(p), gap = 2 * Math.PI / p; return {
   prompt: `The antenna array needs every signal z with z${sup(p)} = w, where w = ${w}: these are the ${name} of w. Enter the angle in radians between two neighbouring roots, then their common modulus, then the real part of the root with the smallest positive argument. Give the angle and the real part to 2 decimal places.`,
   answer: [r2(gap), rho, r2(re)],
   hints: ['A non-zero number w has exactly n different nth roots, spaced equally round a circle centred at 0. If |w| = R, every one of them has modulus r, the positive real number with rⁿ = R.', 'If Arg w = φ, the roots have the arguments (φ + 2πk) ÷ n for k = 0, 1, …, n − 1, spaced equally round a circle. Pick the smallest of them that is greater than 0.'],
   solution: `w = ${w} has modulus ${n(W)} and argument φ = ${piT(h, 2)}. It has ${n(p)} ${name}, all with modulus ${n(rho)}, because ${n(rho)}${sup(p)} = ${n(W)}. They split a full turn into ${n(p)} equal steps, so neighbouring roots are ${piT(2, p)} apart: ${piT(2, p)} ${rd(gap)}. Their arguments are (φ + 2πk) ÷ ${n(p)} for k = 0 to ${n(p - 1)}: ${list}. The smallest positive one is ${piT(best, 2 * p)}, so that root has real part ${n(rho)} × cos(${piT(best, 2 * p)}) ${rd(re)}.`,
   guidance: [
    { prompt: `The non-zero number w = ${w} has ${n(p)} different ${name}, spaced equally round a circle. What angle, in radians, separates two neighbouring roots, to 2 decimal places?`, answer: [r2(gap)], explanation: `The ${n(p)} roots split a full turn of 2π into ${n(p)} equal steps, so neighbouring roots are ${piT(2, p)} apart: ${piT(2, p)} ${rd(gap)}.` },
    { prompt: `|w| = ${n(W)}. Which positive real number r has r${sup(p)} = ${n(W)}?`, answer: [rho], explanation: `${n(rho)}${sup(p)} = ${n(W)}, so every root has modulus ${n(rho)}.` },
    { prompt: `The arguments of the roots are ${list}. Take the smallest one greater than 0. What is the real part of that root, to 2 decimal places?`, answer: [r2(re)], explanation: `The smallest positive argument is ${piT(best, 2 * p)}, so the real part is ${n(rho)} × cos(${piT(best, 2 * p)}) ${rd(re)}.` }
   ] }; }
 },
 /* f(z) = z² + c with c = p + qi; u and v at z₁ = x1 + y1 i, Re f at z₂ = x2 + y2 i. Parts are non-zero whole numbers.
    Not the worked example (c = 1 + i at 2 + i). */
 q07: {
  canonical: { p: 2, q: -3, x1: 1, y1: 2, x2: 3, y2: -1 },
  draw: R => pick(R, () => ({ p: R.nz(-6, 6), q: R.nz(-6, 6), x1: R.nz(-4, 4), y1: R.nz(-4, 4), x2: R.nz(-4, 4), y2: R.nz(-4, 4) }),
   x => !(x.x1 === x.x2 && x.y1 === x.y2) && !(x.p === 1 && x.q === 1 && x.x1 === 2 && x.y1 === 1), { p: 2, q: -3, x1: 1, y1: 2, x2: 3, y2: -1 }),
  build: ({ p, q, x1, y1, x2, y2 }) => { const u = x1 * x1 - y1 * y1 + p, v = 2 * x1 * y1 + q, U = x2 * x2 - y2 * y2 + p, sg = k => `${k < 0 ? '−' : '+'} ${n(Math.abs(k))}`; return {
   prompt: `The rotor controller maps each setting z to an output w = f(z) = z² + c, with c = ${cx(p, q)}. Writing z = x + yi and w = u + vi, the output has a real part u(x, y) and an imaginary part v(x, y). Enter u and v at the setting z = ${cx(x1, y1)}, then the real part of f(z) at a second setting z = ${cx(x2, y2)}.`,
   answer: [u, v, U],
   hints: ['Expand (x + yi)² = x² − y² + 2xyi, then add the real part of c to the real part and the imaginary part of c to the imaginary part.', 'So u(x, y) = x² − y² + Re c and v(x, y) = 2xy + Im c. Put in the x and the y of each setting.'],
   solution: `With z = x + yi, z² = x² − y² + 2xyi, so u(x, y) = x² − y² ${sg(p)} and v(x, y) = 2xy ${sg(q)}. At z = ${cx(x1, y1)}: u = ${par(x1)}² − ${par(y1)}² ${sg(p)} = ${n(u)} and v = 2 × ${par(x1)} × ${par(y1)} ${sg(q)} = ${n(v)}. At z = ${cx(x2, y2)}: u = ${par(x2)}² − ${par(y2)}² ${sg(p)} = ${n(U)}, so the real part of f(z) there is ${n(U)}.`,
   guidance: [
    { prompt: `With z = x + yi, z² = x² − y² + 2xyi, so u(x, y) = x² − y² ${sg(p)}. What is u at z = ${cx(x1, y1)}?`, answer: [u], explanation: `x = ${n(x1)} and y = ${n(y1)}: u = ${par(x1)}² − ${par(y1)}² ${sg(p)} = ${n(x1 * x1)} − ${n(y1 * y1)} ${sg(p)} = ${n(u)}.` },
    { prompt: `v(x, y) = 2xy ${sg(q)}. What is v at z = ${cx(x1, y1)}?`, answer: [v], explanation: `v = 2 × ${par(x1)} × ${par(y1)} ${sg(q)} = ${n(2 * x1 * y1)} ${sg(q)} = ${n(v)}.` },
    { prompt: `Use the same u(x, y) at the second setting z = ${cx(x2, y2)}. What is the real part of f(z) there?`, answer: [U], explanation: `x = ${n(x2)} and y = ${n(y2)}: u = ${n(x2 * x2)} − ${n(y2 * y2)} ${sg(p)} = ${n(U)}.` }
   ] }; }
 },
 /* e^z for z = x + yi with y = Kπ ÷ 6, K = k + 12j: k from 1 to 12 off the imaginary axis, j a non-zero number of whole turns.
    Not the worked example (x = 2, y = 3π). */
 q08: {
  canonical: { x: 1, k: 5, j: 1 },
  draw: R => pick(R, () => ({ x: R.pick([-1, -0.5, 0.5, 1, 1.5, 2]), k: R.pick([1, 2, 4, 5, 6, 7, 8, 10, 11, 12]), j: R.pick([-2, -1, 1, 2, 3]) }),
   p => { const ex = Math.exp(p.x), y0 = p.k * Math.PI / 6; return !(p.x === 2 && p.k === 6 && p.j === 1) && !(p.x === 1 && p.k === 5 && p.j === 1) && !nearTie(ex) && !nearTie(y0) && !nearTie(ex * Math.cos(y0)); }, { x: 1, k: 5, j: 1 }),
  build: ({ x, k, j }) => { const K = k + 12 * j, ex = Math.exp(x), y0 = k * Math.PI / 6, c = Math.cos(y0), re = ex * c,
   turns = Math.abs(j) === 1 ? 'one whole turn' : `${n(Math.abs(j))} whole turns`, ext = x === 1 ? 'e' : `e^(${n(x)})`; return {
   prompt: `A rotor’s position is recorded as e^z with z = x + yi, where x = ${n(x)} and y = ${piT(K, 6)} radians. Enter |e^z|, then the real part of e^z, then the angle y′ greater than 0 and at most 2π that gives the same value of e^z. Give all three to 2 decimal places.`,
   answer: [r2(ex), r2(re), r2(y0)],
   hints: ['e^(x + yi) = e^x(cos y + i sin y). Its modulus is e^x, because cos y + i sin y has modulus 1.', 'Adding or taking away 2π does not change cos y or sin y, so e^z repeats. Add or take away whole turns of 2π until the angle is greater than 0 and at most 2π.'],
   solution: `e^z = e^x(cos y + i sin y), so |e^z| = ${ext} ${rd(ex)}. ${j > 0 ? 'Taking' : 'Adding'} ${turns} of 2π ${j > 0 ? 'away from' : 'to'} y = ${piT(K, 6)} leaves y′ = ${piT(k, 6)} ${rd(y0)}. cos y = cos y′ = ${exactText(c)}, so the real part of e^z is ${ext} × (${exactText(c)}) ${rd(re)}.`,
   guidance: [
    { prompt: `The modulus of e^z depends only on x. What is |e^z| = ${ext}, to 2 decimal places?`, answer: [r2(ex)], explanation: `|e^z| = e^x = ${ext} ${rd(ex)}.` },
    { prompt: `Add or take away whole turns of 2π from y = ${piT(K, 6)} until the angle is greater than 0 and at most 2π. What is that angle y′, to 2 decimal places?`, answer: [r2(y0)], explanation: `${piT(K, 6)} ${j > 0 ? '−' : '+'} ${piT(12 * Math.abs(j), 6)} = ${piT(k, 6)} ${rd(y0)}.` },
    { prompt: `The real part of e^z is e^x cos y, and cos y = cos y′ with y′ = ${piT(k, 6)}. What is the real part of e^z, to 2 decimal places?`, answer: [r2(re)], explanation: `cos(${piT(k, 6)}) = ${exactText(c)}, so the real part is ${ext} × (${exactText(c)}) ${rd(re)}.` }
   ] }; }
 },
 /* Log z for z = a + bi with non-zero parts from −9 to 9, skipping rounding ties. Not the worked example (1 + i). */
 q09: {
  canonical: { a: -3, b: 4 },
  draw: R => pick(R, () => ({ a: R.nz(-9, 9), b: R.nz(-9, 9) }), p => !(p.a === 1 && p.b === 1) && !(p.a === -3 && p.b === 4) && argOk(p.a, p.b) && !nearTie(Math.log(p.a * p.a + p.b * p.b) / 2), { a: -3, b: 4 }),
  build: ({ a, b }) => { const S = a * a + b * b, L = Math.log(S) / 2, w = argWork(a, b); return {
   prompt: `The rotor log stores each turn z by its complex logarithm. For z = ${cx(a, b)}, enter the real part and the imaginary part of the principal value Log z, each to 2 decimal places.`,
   answer: [r2(L), r2(w.arg)],
   hints: ['Log z = ln |z| + i Arg z, where ln is the natural logarithm and Arg z is the principal argument, between −π and π.', 'ln |z| = ln √(x² + y²), which is half of ln(x² + y²). For Arg z, find arctan(|y| ÷ |x|) and then use the quadrant z lies in.'],
   solution: `|z|² = ${par(a)}² + ${par(b)}² = ${n(S)}, so the real part of Log z is ln |z| = ½ ln ${n(S)} ${rd(L)}. The angle between z and the real axis is arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}. z lies ${w.place}, so ${w.rule}, and the imaginary part of Log z is Arg z ${rd(w.arg)}.`,
   guidance: [
    { prompt: `What is |z|² = ${par(a)}² + ${par(b)}²?`, answer: [S], explanation: `${n(a * a)} + ${n(b * b)} = ${n(S)}.` },
    { prompt: `ln |z| is half of ln ${n(S)}. What is the real part of Log z, to 2 decimal places?`, answer: [r2(L)], explanation: `½ ln ${n(S)} ${rd(L)}.` },
    { prompt: `z lies ${w.place}. What is the imaginary part of Log z, which is Arg z, to 2 decimal places?`, answer: [r2(w.arg)], explanation: `arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(w.ref)}, and ${w.rule}, so Arg z ${rd(w.arg)}.` }
   ] }; }
 },
 /* i^(ci) = e^(−cπ ÷ 2); z = s·i or −s·i (dir 1 or −1) raised to a = h ÷ 2 with h odd; and the modulus |v|^(1 ÷ m) shared by every value of v^(1 ÷ m), v = e + fi.
    Not the worked example ((−1)^i and (9i)^0.5). */
 q10: {
  canonical: { c: 1, s: 4, dir: 1, h: 3, m: 3, e: -8, f: 0 },
  draw: R => pick(R, () => ({ c: R.pick([-2, -1, -0.5, 0.5, 1]), s: R.int(2, 5), dir: sgn(R), h: R.pick([1, 3, 5]), m: R.int(2, 6), e: R.nz(-9, 9), f: R.nz(-9, 9) }),
   p => { const v = Math.exp(-p.c * Math.PI / 2), re = Math.pow(p.s, p.h / 2) * Math.cos(p.h * p.dir * Math.PI / 4); return !(p.c === 1 && p.s === 4 && p.dir === 1 && p.h === 3) && !nearTie(v) && !nearTie(re) && !nearTie(Math.pow(p.e * p.e + p.f * p.f, 1 / (2 * p.m))); },
   { c: 1, s: 4, dir: 1, h: 3, m: 3, e: -8, f: 0 }),
  build: ({ c, s, dir, h, m, e, f }) => { const a = h / 2, pw = c === 1 ? 'i^i' : c === -1 ? 'i^(−i)' : `i^(${n(c)}i)`, val = Math.exp(-c * Math.PI / 2),
   z = cx(0, dir * s), A = piT(dir, 2), Ap = dir < 0 ? `(${A})` : A, kl = m <= 4 ? Array.from({ length: m }, (_, k) => n(k)).join(', ') : `0, 1, …, ${n(m - 1)}`, ang = piT(h * dir, 4), size = Math.pow(s, a), re = size * Math.cos(h * dir * Math.PI / 4),
    S = e * e + f * f, md = Math.pow(S, 1 / (2 * m)), mt = f === 0 ? `|v| = ${n(Math.abs(e))}, so every value has modulus ${n(Math.abs(e))}^(1 ÷ ${n(m)}) ${rd(md)}` : `|v|² = ${par(e)}² + ${par(f)}² = ${n(S)}, so |v| = √${n(S)} and every value has modulus (√${n(S)})^(1 ÷ ${n(m)}) = ${n(S)}^(1 ÷ ${n(2 * m)}) ${rd(md)}`; return {
   prompt: `The rotor hall works with complex powers, z^a = e^(a log z), whose principal value uses Log z. Enter the principal value of ${pw}, which is a real number, to 2 decimal places; then the real part of the principal value of (${z})^${n(a)}, to 2 decimal places; then the modulus that all the values of v^(1 ÷ ${n(m)}) share, for v = ${cx(e, f)} and every branch of the logarithm, to 2 decimal places.`,
   answer: [r2(val), r2(re), r2(md)],
   hints: ['Log i = iπ ÷ 2, because |i| = 1 and Arg i = π ÷ 2. Then i to a power bi is e^(bi × iπ ÷ 2), and i × i = −1 makes the exponent real.', 'For a real power a, the principal value is z^a = |z|^a e^(ia Arg z), so its real part is |z|^a cos(a Arg z). The other branches add 2πki to Log z; with a = 1 ÷ m they turn the value by 2πk ÷ m and leave its modulus, |z|^(1 ÷ m), unchanged.'],
   solution: `Log i = iπ ÷ 2, so ${pw} = e^(${c === 1 ? '' : c === -1 ? '−' : n(c)}i × iπ ÷ 2) = e^(${piT(-2 * c, 4)}) ${rd(val)}. For z = ${z}, |z| = ${n(s)} and Arg z = ${A}, so the principal value is z^${n(a)} = ${n(s)}^${n(a)} e^(i × ${n(a)} × ${Ap}), with angle ${ang}. Its real part is ${n(s)}^${n(a)} × cos(${ang}) ${rd(re)}. Each branch of the logarithm adds 2πki to Log v, which turns v^(1 ÷ ${n(m)}) by 2πk ÷ ${n(m)} but does not change its modulus, |v|^(1 ÷ ${n(m)}). ${mt}.`,
   guidance: [
    { prompt: `Log i = iπ ÷ 2, so ${pw} = e^(${c === 1 ? '' : c === -1 ? '−' : n(c)}i × iπ ÷ 2). What is it, to 2 decimal places?`, answer: [r2(val)], explanation: `i × i = −1, so the exponent is ${piT(-2 * c, 4)} and ${pw} = e^(${piT(-2 * c, 4)}) ${rd(val)}.` },
    { prompt: `For z = ${z}, |z| = ${n(s)} and Arg z = ${A}. The real part of z^${n(a)} is |z|^${n(a)} cos(${n(a)} Arg z). What is it, to 2 decimal places?`, answer: [r2(re)], explanation: `${n(a)} × ${Ap} = ${ang}, so the real part is ${n(s)}^${n(a)} × cos(${ang}) ${rd(re)}.` },
    { prompt: `Each branch of the logarithm adds 2πki to Log v, which turns v^(1 ÷ ${n(m)}) by 2πk ÷ ${n(m)} but keeps its modulus |v|^(1 ÷ ${n(m)}). For v = ${cx(e, f)}, what is that modulus, to 2 decimal places?`, answer: [r2(md)], explanation: `${mt}. The branches k = ${kl} turn the value but keep that modulus.` }
   ] }; }
 },
});
})();
