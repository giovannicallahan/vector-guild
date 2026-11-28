/* Complex analysis: the plane of numbers mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const SUP = { 1: '¹', 2: '²', 3: '³', 4: '⁴' };
/* A complex number with whole parts as text: cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4'. */
const cx = (re, im) => { if (im === 0) return n(re); const body = (Math.abs(im) === 1 ? '' : n(Math.abs(im))) + 'i';
 if (re === 0) return (im < 0 ? '−' : '') + body; return `${n(re)} ${im < 0 ? '−' : '+'} ${body}`; };
/* z − a for a complex a: 'z − 3', 'z + 2', 'z − 2i', 'z − (1 + 2i)', or 'z' when a is 0. */
const zm = (re, im = 0) => { if (re === 0 && im === 0) return 'z';
 if (im === 0) return re > 0 ? `z − ${n(re)}` : `z + ${n(-re)}`;
 if (re === 0) return `z ${im > 0 ? '−' : '+'} ${cx(0, Math.abs(im))}`;
 return `z − (${cx(re, im)})`; };
/* The same in brackets, ready to divide by or to raise to a power: '(z − 3)', or a bare 'z'. */
const zp = (re, im = 0) => (re === 0 && im === 0) ? 'z' : `(${zm(re, im)})`;
/* The circle |z − c| = r for a real centre c. */
const circ = (c, r) => `|${zm(c)}| = ${n(r)}`;
/* A polynomial from its coefficients, highest power first: poly([2, −3, 5], 'z') is '2z² − 3z + 5'. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Terms [coefficient, letters] as a sum: terms([[1, 'x²'], [−1, 'y²'], [3, 'xy']]) is 'x² − y² + 3xy'. */
const terms = list => { let out = ''; for (const [c, v] of list) { if (c === 0) continue; const a = Math.abs(c), body = v ? (a === 1 ? '' : n(a)) + v : n(a);
 out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return out || '0'; };
/* Signed sum of numbers as worked, zeros left out: sum([8, −6, 5]) is '8 − 6 + 5'. */
const sum = list => { const l = list.filter(v => v !== 0); return l.length ? l.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('') : '0'; };
/* A worked value: '8 − 6 + 5 = 7', or just '3' when there is one term. */
const eq = (list, v) => { const t = sum(list); return t === n(v) ? t : `${t} = ${n(v)}`; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const gcd = (p, q) => q ? gcd(q, p % q) : Math.abs(p);
/* k πi as text: '12πi', '−10πi', or '0' when k is 0. */
const kpi = k => k === 0 ? '0' : `${n(k)}πi`;
/* The derivative symbol for n = 1, 2, 3: f′, f′′, f⁽³⁾. */
const der = (k, f = 'f') => k === 1 ? f + '′' : k === 2 ? f + '′′' : f + '⁽' + k + '⁾';
/* q21, q22: a = p + qi is inside |z| = R exactly when wanted, and |a|² is at least 2 away from R², so a is never on the circle. */
const fits = (x, inside) => { const d2 = x.p * x.p + x.q * x.q, R2 = x.R * x.R; return (d2 < R2) === inside && Math.abs(d2 - R2) >= 2; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
/* Repeat a draw until ok(p) holds, at most 1000 times, then fall back to the canonical parameters. */
const retry = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return canonical; };
/* q26, q29: a bound M whose Cauchy bound n! M ÷ Rⁿ is a whole number: M is a multiple of Rⁿ ÷ gcd(Rⁿ, n!). */
const boundM = (R, k, lo, hi, pick) => { const Rn = Math.pow(R, k), unit = Rn / gcd(Rn, fact(k)), tlo = Math.ceil(lo / unit), thi = Math.floor(hi / unit);
 return thi >= tlo ? unit * pick(tlo, thi) : 0; };
/* q30: every z = (a + bi) ÷ d with |z| < 1, b ≠ 0, a, b, d with no common factor, whose sum 1 ÷ (1 − z) has real and
   imaginary parts with at most two decimals. Neither i ÷ 2 (the authored mission) nor (1 + i) ÷ 2 (the worked example). */
const two = x => Math.abs(Math.round(x * 100) - x * 100) < 1e-7;
const GEO = []; for (let d = 2; d <= 10; d++) for (let a = 1 - d; a < d; a++) for (let b = 1 - d; b < d; b++) {
 if (b === 0 || a * a + b * b >= d * d || gcd(gcd(a, b), d) !== 1) continue;
 const den = (d - a) * (d - a) + b * b; if (!two(d * (d - a) / den) || !two(d * b / den)) continue;
 if ((a === 0 && b === 1 && d === 2) || (a === 1 && b === 1 && d === 2)) continue; GEO.push({ a, b, d }); }
const CLAIMS = [ /* q26: s is only an index into these claims; each is [text, 1 if true, why]. */
 ['Every entire function f with |f(z)| ≤ 7 at every point of the plane is constant.', 1, 'That is Liouville’s theorem: an entire function that is bounded is constant, so the claim is true (1).'],
 ['The entire function z² + 1 is bounded: one number M has |z² + 1| ≤ M at every point z.', 0, 'z² + 1 is not constant, so by Liouville’s theorem it cannot be bounded: at z = 100 it is already 10001. The claim is false (0).'],
 ['An entire function with |f(z)| ≤ 50 at every point has f′(z) = 0 at every point.', 1, 'By Liouville’s theorem the function is constant, so its derivative is 0 everywhere. The claim is true (1).'],
 ['Some polynomial of degree 1 or more is an entire function that is bounded on the whole plane.', 0, 'A bounded entire function is constant by Liouville’s theorem, and a polynomial of degree 1 or more is not constant. The claim is false (0).'],
 ['If f is an entire function and |f(z)| ≤ 3 at every point, then f(5) = f(0).', 1, 'By Liouville’s theorem f is constant, so it takes the same value at 5 and at 0. The claim is true (1).']
];

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* q21: ∮ C ÷ (z − a) dz round |z| = R (2C inside, 0 outside), and ∮ z² ÷ (z − b) dz with b real and outside (0). */
 q21: {
  canonical: { p: 1, q: 2, R: 3, b: -5, C: 3 },
  /* a is never on the circle (|a|² and R² at least 2 apart); about half the draws put a inside. Never the worked example's points. */
  draw: R => { const inside = R.bool(); return retry(() => { const r = R.int(2, 6), p = R.int(-6, 6), q = R.nz(-6, 6);
    return { p, q, R: r, b: (R.bool() ? 1 : -1) * (r + R.int(1, 4)), C: R.pick([-1, 1]) * R.int(2, 6) }; },
   x => fits(x, inside) && !(x.p === 1 && x.q === 2 && x.R === 3) && !(x.p === 1 && (x.q === 3 || x.q === -1)), { p: 1, q: 2, R: 3, b: -5, C: 3 }); },
  build: ({ p, q, R, b, C }) => { const A = cx(p, q), d2 = p * p + q * q, R2 = R * R, inside = d2 < R2, k = inside ? 2 * C : 0, F = `${n(C)} ÷ ${zp(p, q)}`; return {
   prompt: `The ring road follows the circle |z| = ${n(R)}, driven once anticlockwise. A field source sits at the point a = ${A}, and the field it makes along the road is ${F}. Enter k in ∮ ${F} dz = kπi round the road. A second field, z² ÷ ${zp(b)}, is analytic everywhere except at z = ${n(b)}: enter k in ∮ z² ÷ ${zp(b)} dz = kπi round the same road.`,
   answer: [k, 0],
   hints: ['A point a is inside the circle |z| = R when its distance from 0 is less than R, that is when (Re a)² + (Im a)² < R². Compare the squares, so no square root is needed.',
    'Cauchy’s theorem: if a function is analytic at every point on and inside the loop, its integral round the loop is 0. If the one bad point of 1 ÷ (z − a) is inside, shrink the loop to a small circle centred on a, which does not change the integral; round that circle ∮ dz ÷ (z − a) is 2πi. A number on top multiplies the whole integral.'],
   solution: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)} and R² = ${n(R2)}. ${inside ? `${n(d2)} is less than ${n(R2)}, so a is inside the road. ${F} is analytic everywhere except at a, so the road can be shrunk to a small circle round a without changing the integral. Round that circle ∮ dz ÷ ${zp(p, q)} = 2πi, and the ${n(C)} on top multiplies it: ${n(C)} × 2πi = ${n(k)}πi, so k = ${n(k)}.` : `${n(d2)} is more than ${n(R2)}, so a is outside the road. ${F} is analytic at every point on and inside the road, so by Cauchy’s theorem the integral is 0: k = 0.`} The only bad point of z² ÷ ${zp(b)} is z = ${n(b)}, at distance ${n(Math.abs(b))} from 0, more than ${n(R)}, so it is outside the road. That function is analytic on and inside the road, so by Cauchy’s theorem its integral is 0: k = 0.`,
   guidance: [
    { prompt: `How far is a = ${A} from 0, squared? Work out |a|² = (Re a)² + (Im a)².`, answer: [d2], explanation: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}.` },
    { prompt: `The road has radius ${n(R)}, so R² = ${n(R2)}. Is a inside the road? Enter 1 for inside, 0 for outside.`, answer: [inside ? 1 : 0], explanation: `${n(d2)} is ${inside ? 'less' : 'more'} than ${n(R2)}, so a is ${inside ? 'inside' : 'outside'} the road.` },
    { prompt: `What is k in ∮ ${F} dz = kπi?`, answer: [k], explanation: inside ? `The bad point is inside, so the road can be shrunk to a small circle round a, where ∮ dz ÷ ${zp(p, q)} = 2πi. Times ${n(C)} that is ${n(k)}πi: k = ${n(k)}.` : 'The function is analytic on and inside the road, so Cauchy’s theorem gives 0: k = 0.' },
    { prompt: `z² ÷ ${zp(b)} fails to be analytic only at z = ${n(b)}, which is ${n(Math.abs(b))} from 0. What is k for its integral round the road?`, answer: [0], explanation: `${n(Math.abs(b))} is more than the radius ${n(R)}, so the bad point is outside and Cauchy’s theorem gives 0.` }
   ] }; }
 },
 /* q22: a path round |z| = R that winds m times (negative m: clockwise); the winding number round a and ∮ c ÷ (z − a) dz = 2πi c w. */
 q22: {
  canonical: { m: 2, R: 4, p: 1, q: -2, c: 3 },
  /* a is inside in about three draws in four, and never on the circle. Never the worked example (once clockwise round 2i, c = 5). */
  draw: R => { const inside = R.next() < 0.75; return retry(() => { const r = R.int(2, 6), p = R.int(-6, 6), q = R.nz(-6, 6);
    return { m: R.pick([-3, -2, -1, 1, 2, 3]), R: r, p, q, c: R.int(2, 5) }; },
   x => fits(x, inside) && !(x.m === 2 && x.R === 4 && x.p === 1 && x.q === -2) && !(x.m === -1 && x.p === 0 && x.q === 2 && x.c === 5), { m: 2, R: 4, p: 1, q: -2, c: 3 }); },
  build: ({ m, R, p, q, c }) => { const A = cx(p, q), d2 = p * p + q * q, R2 = R * R, inside = d2 < R2, w = inside ? m : 0, k = 2 * c * w,
   dir = (Math.abs(m) === 1 ? 'once' : Math.abs(m) === 2 ? 'twice' : `${n(Math.abs(m))} times`) + (m > 0 ? ' anticlockwise' : ' clockwise'); return {
   prompt: `A test cart drives round the ring road, the circle |z| = ${n(R)}, ${dir}, without stopping, and comes back to where it started. A field source sits at a = ${A}. Enter the winding number of the cart’s path round a, then k in ∮ ${n(c)} ÷ ${zp(p, q)} dz = kπi along the whole path.`,
   answer: [w, k],
   hints: ['The winding number counts the turns round a: each anticlockwise turn counts +1 and each clockwise turn −1. A point outside the circle is never turned round, so its winding number is 0.',
    'Every anticlockwise turn round a adds 2πi to ∮ dz ÷ (z − a), and a number on top of the fraction multiplies the whole integral: ∮ c ÷ (z − a) dz = 2πi × c × (winding number).'],
   solution: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, which is ${inside ? 'less' : 'more'} than R² = ${n(R2)}, so a is ${inside ? 'inside' : 'outside'} the circle. ${inside ? `The path goes round a ${dir}, so its winding number round a is ${n(m)}.` : 'The path never goes round a, so its winding number round a is 0.'} The integral is 2πi × ${n(c)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.`,
   guidance: [
    { prompt: `Is a = ${A} inside the circle |z| = ${n(R)}? Work out |a|² = (Re a)² + (Im a)² to compare with R² = ${n(R2)}.`, answer: [d2], explanation: `|a|² = ${par(p)}² + ${par(q)}² = ${n(d2)}, ${inside ? 'less' : 'more'} than ${n(R2)}, so a is ${inside ? 'inside' : 'outside'}.` },
    { prompt: `The cart goes round the circle ${dir}. What is the winding number of its path round a?`, answer: [w], explanation: inside ? `Each turn goes round a, and ${m > 0 ? 'anticlockwise turns count +1' : 'clockwise turns count −1'}, so the winding number is ${n(m)}.` : 'The path never goes round a point outside the circle, so the winding number is 0.' },
    { prompt: `What is k in ∮ ${n(c)} ÷ ${zp(p, q)} dz = kπi?`, answer: [k], explanation: `2πi × ${n(c)} × ${par(w)} = ${kpi(k)}, so k = ${n(k)}.` }
   ] }; }
 },
 /* q23: round |z| = R, A ÷ (z − a) + B ÷ (z − b) with exactly one of a, b inside; round |z − c| = r, D(z − c)⁻² + E(z − c)⁻¹ + F(z − c). */
 q23: {
  canonical: { R: 3, a: 1, A: 4, b: 5, B: 7, c: 2, r: 1, D: 3, E: -5, F: 6 },
  draw: R => retry(() => ({ R: R.int(2, 5), a: R.int(-7, 7), A: R.int(2, 9), b: R.int(-7, 7), B: R.pick([-1, 1]) * R.int(2, 9), c: R.int(-4, 4), r: R.int(1, 3), D: R.int(2, 9), E: R.pick([-1, 1]) * R.int(2, 9), F: R.pick([-1, 1]) * R.int(2, 9) }),
   p => p.a !== p.b && p.a !== 0 && p.b !== 0 && Math.abs(p.a) !== p.R && Math.abs(p.b) !== p.R && (Math.abs(p.a) < p.R) !== (Math.abs(p.b) < p.R) && !(p.a === 1 && p.A === 4 && p.b === 5), { R: 3, a: 1, A: 4, b: 5, B: 7, c: 2, r: 1, D: 3, E: -5, F: 6 }),
  build: ({ R, a, A, b, B, c, r, D, E, F }) => { const aIn = Math.abs(a) < R, inPt = aIn ? a : b, outPt = aIn ? b : a, inK = aIn ? A : B, k1 = 2 * inK, k2 = 2 * E,
   I1 = `${n(A)} ÷ ${zp(a)}${B < 0 ? ' − ' : ' + '}${n(Math.abs(B))} ÷ ${zp(b)}`,
   I2 = `${n(D)} ÷ ${zp(c)}²${E < 0 ? ' − ' : ' + '}${n(Math.abs(E))} ÷ ${zp(c)}${F < 0 ? ' − ' : ' + '}${n(Math.abs(F))}${zp(c)}`; return {
   prompt: `Two readings for the ring road log. First, round the circle |z| = ${n(R)}, once anticlockwise, enter k in ∮ (${I1}) dz = kπi. Second, round the small loop ${circ(c, r)}, once anticlockwise, enter k in ∮ (${I2}) dz = kπi.`,
   answer: [k1, k2],
   hints: ['Split each integral into its terms. A term A ÷ (z − a) gives 2πi × A when a is inside the loop, and 0 when a is outside, by Cauchy’s theorem.',
    'Round a circle centred on c, (z − c)ⁿ integrates to 2πi when n = −1 and to 0 for every other whole number n, positive or negative.'],
   solution: `First reading: the bad points are ${n(a)} and ${n(b)}. ${n(inPt)} is ${n(Math.abs(inPt))} from 0, less than ${n(R)}, so it is inside; ${n(outPt)} is ${n(Math.abs(outPt))} from 0, more than ${n(R)}, so it is outside and its term gives 0. The inside term gives 2πi × ${par(inK)} = ${kpi(k1)}, so k = ${n(k1)}. Second reading: the loop is centred on ${n(c)}, so ${n(D)} ÷ ${zp(c)}² and ${n(F)}${zp(c)} give 0 and only ${n(E)} ÷ ${zp(c)} counts: 2πi × ${par(E)} = ${kpi(k2)}, so k = ${n(k2)}.`,
   guidance: [
    { prompt: `Of the two bad points ${n(a)} and ${n(b)} in the first reading, which one is inside the circle |z| = ${n(R)}?`, answer: [inPt], explanation: `${n(inPt)} is ${n(Math.abs(inPt))} from 0, less than the radius ${n(R)}; ${n(outPt)} is ${n(Math.abs(outPt))} from 0, more than ${n(R)}.` },
    { prompt: `Only the term with the bad point ${n(inPt)} counts. What is k for the first reading?`, answer: [k1], explanation: `That term gives 2πi × ${par(inK)} = ${kpi(k1)}, and the other gives 0, so k = ${n(k1)}.` },
    { prompt: `Round ${circ(c, r)} only the power −1 of ${zp(c)} counts. What is k for the second reading?`, answer: [k2], explanation: `The ${zp(c)}⁻² and ${zp(c)} terms give 0. ${n(E)} ÷ ${zp(c)} gives 2πi × ${par(E)} = ${kpi(k2)}, so k = ${n(k2)}.` }
   ] }; }
 },
 /* q24: ∮ f(z) ÷ (z − a) dz round |z − c| = r with a inside, f(z) = αz² + βz + γ; k = 2f(a). */
 q24: {
  canonical: { al: 2, be: -3, ga: 5, a: 2, c: 1, r: 3 },
  /* f(a) is never 0; never the worked example (z² + 4, a = −1, |z| = 2). */
  draw: R => retry(() => ({ al: R.pick([-3, -2, -1, 1, 2, 3]), be: R.int(-5, 5), ga: R.int(-6, 6), a: R.int(-3, 3), c: R.int(-2, 2), r: R.int(2, 5) }),
   p => Math.abs(p.a - p.c) < p.r && p.al * p.a * p.a + p.be * p.a + p.ga !== 0 && !same(p, { al: 2, be: -3, ga: 5, a: 2 }) && !same(p, { al: 1, be: 0, ga: 4, a: -1 }), { al: 2, be: -3, ga: 5, a: 2, c: 1, r: 3 }),
  build: ({ al, be, ga, a, c, r }) => { const f = poly([al, be, ga], 'z'), fa = al * a * a + be * a + ga, k = 2 * fa, dist = Math.abs(a - c); return {
   prompt: `In the field lab a coil follows the circle ${circ(c, r)}, once anticlockwise. The field along it is f(z) ÷ (z − a) with a = ${n(a)} and f(z) = ${f}. Enter f(${n(a)}), then k in ∮ (${f}) ÷ ${zp(a)} dz = kπi.`,
   answer: [fa, k],
   hints: ['Cauchy’s integral formula: if f is analytic on and inside the loop and a is inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a).',
    'Check first that a is inside: a real point a is inside the circle |z − c| = r when its distance from the centre, |a − c|, is less than r. A polynomial is analytic everywhere.'],
   solution: `${n(a)} is ${n(dist)} from the centre ${n(c)}, less than the radius ${n(r)}, so a is inside the coil, and f is a polynomial, analytic everywhere. f(${n(a)}) = ${eq([al * a * a, be * a, ga], fa)}. By Cauchy’s integral formula the integral is 2πi × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.`,
   guidance: [
    { prompt: `How far is a = ${n(a)} from the centre ${n(c)} of the coil? Its radius is ${n(r)}.`, answer: [dist], explanation: `|${n(a)} − ${par(c)}| = ${n(dist)}, less than ${n(r)}, so a is inside and Cauchy’s integral formula applies.` },
    { prompt: `Put z = ${n(a)} into f(z) = ${f}. What is f(${n(a)})?`, answer: [fa], explanation: `f(${n(a)}) = ${eq([al * a * a, be * a, ga], fa)}.` },
    { prompt: `The integral is 2πi f(a). What is k?`, answer: [k], explanation: `2πi × ${par(fa)} = ${kpi(k)}, so k = ${n(k)}.` }
   ] }; }
 },
 /* q25: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz round |z| = R for a cubic f and n = 1 or 2; k = 2f⁽ⁿ⁾(a) ÷ n!. */
 q25: {
  canonical: { c3: 1, c2: 2, c1: -4, c0: 1, a: 2, n: 1, R: 3 },
  /* The derivative at a is never 0; never the worked example (z³ − 5z at a = 1 with n = 2). */
  draw: R => retry(() => ({ c3: R.pick([-2, -1, 1, 2]), c2: R.int(-4, 4), c1: R.int(-6, 6), c0: R.int(-6, 6), a: R.int(-2, 2), n: R.int(1, 2), R: R.int(3, 5) }),
   p => (p.n === 1 ? 3 * p.c3 * p.a * p.a + 2 * p.c2 * p.a + p.c1 : 6 * p.c3 * p.a + 2 * p.c2) !== 0 && !same(p, { c3: 1, c2: 2, c1: -4, a: 2, n: 1 }) && !same(p, { c3: 1, c2: 0, c1: -5, a: 1, n: 2 }), { c3: 1, c2: 2, c1: -4, c0: 1, a: 2, n: 1, R: 3 }),
  build: ({ c3, c2, c1, c0, a, n: k, R }) => { const f = poly([c3, c2, c1, c0], 'z'), d1 = poly([3 * c3, 2 * c2, c1], 'z'), d2 = poly([6 * c3, 2 * c2], 'z'),
   fn = k === 1 ? 3 * c3 * a * a + 2 * c2 * a + c1 : 6 * c3 * a + 2 * c2, K = 2 * fn / fact(k),
   work = k === 1 ? `f′(z) = ${d1}, so f′(${n(a)}) = ${eq([3 * c3 * a * a, 2 * c2 * a, c1], fn)}.` : `f′(z) = ${d1} and f′′(z) = ${d2}, so f′′(${n(a)}) = ${eq([6 * c3 * a, 2 * c2], fn)}.`; return {
   prompt: `A second coil follows the circle |z| = ${n(R)}, once anticlockwise. Its field is (${f}) ÷ ${zp(a)}${SUP[k + 1]}. Enter n, the order of the derivative that Cauchy’s formula for derivatives uses here, then that derivative of f(z) = ${f} at z = ${n(a)}, then k in ∮ (${f}) ÷ ${zp(a)}${SUP[k + 1]} dz = kπi.`,
   answer: [k, fn, K],
   hints: ['Cauchy’s formula for derivatives: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!, where f⁽ⁿ⁾ is f differentiated n times and n! = 1 × 2 × … × n.',
    'Read n from the power on the bottom, which is n + 1: a square on the bottom means the first derivative, and a cube means the second. Then check that a is inside the circle.'],
   solution: `The power on the bottom is ${n(k + 1)}, so n = ${n(k)}. ${work} a = ${n(a)} is inside |z| = ${n(R)}, since |${n(a)}| < ${n(R)}, and f is a polynomial, analytic everywhere. The integral is 2πi × ${par(fn)} ÷ ${n(k)}! = ${kpi(K)}, so k = ${n(K)}.`,
   guidance: [
    { prompt: `The bottom is ${zp(a)}${SUP[k + 1]}, and in the formula the power is n + 1. What is n?`, answer: [k], explanation: `n + 1 = ${n(k + 1)}, so n = ${n(k)}.` },
    { prompt: `Differentiate f(z) = ${f} ${k === 1 ? 'once' : 'twice'} and put in z = ${n(a)}. What is ${der(k)}(${n(a)})?`, answer: [fn], explanation: work },
    { prompt: `The integral is 2πi × ${der(k)}(${n(a)}) ÷ ${n(k)}!. What is k?`, answer: [K], explanation: `2πi × ${par(fn)} ÷ ${n(fact(k))} = ${kpi(K)}, so k = ${n(K)}.` }
   ] }; }
 },
 /* q26: Cauchy's bound n! M ÷ Rⁿ on |f⁽ⁿ⁾(2)| for a circle of radius R round 2, and a Liouville claim (s indexes CLAIMS). */
 q26: {
  canonical: { n: 2, R: 3, M: 45, s: 0 },
  /* M is a multiple of Rⁿ ÷ gcd(Rⁿ, n!) between 10 and 999, so the bound is a whole number. Never the worked example (n = 1, R = 4, M = 20). */
  draw: R => retry(() => { const k = R.int(1, 3), r = R.int(2, 5); return { n: k, R: r, M: boundM(r, k, 10, 999, R.int), s: R.int(0, 4) }; },
   p => p.M > 0 && !(p.n === 2 && p.R === 3 && p.M === 45) && !(p.n === 1 && p.R === 4 && p.M === 20), { n: 2, R: 3, M: 45, s: 0 }),
  build: ({ n: k, R, M, s }) => { const Rk = Math.pow(R, k), bound = fact(k) * M / Rk, [claim, truth, why] = CLAIMS[s]; return {
   prompt: `A field-lab probe reads a signal f that is analytic on and inside the circle |z − 2| = ${n(R)}, and on that circle |f(z)| is never more than ${n(M)}. Enter the largest value Cauchy’s inequality allows for |${der(k)}(2)|. Then judge this claim: “${claim}” Enter 1 if it is true, 0 if it is false.`,
   answer: [bound, truth],
   hints: ['Cauchy’s inequality: if f is analytic on and inside the circle |z − a| = R and |f| ≤ M on that circle, then |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ.',
    'Liouville’s theorem: an entire function (one that is analytic at every point of the plane) that is bounded is constant. A polynomial of degree 1 or more grows without limit far from 0, so it is not bounded.'],
   solution: `Here n = ${n(k)}, M = ${n(M)} and R = ${n(R)}, so the bound is ${n(k)}! × ${n(M)} ÷ ${n(R)}${SUP[k]} = ${n(fact(k))} × ${n(M)} ÷ ${n(Rk)} = ${n(bound)}. ${why}`,
   guidance: [
    { prompt: `The derivative asked for is ${der(k)}, so n = ${n(k)}. What is Rⁿ = ${n(R)}${SUP[k]}?`, answer: [Rk], explanation: `${n(R)}${SUP[k]} = ${n(Rk)}.` },
    { prompt: `What is the bound n! M ÷ Rⁿ = ${n(fact(k))} × ${n(M)} ÷ ${n(Rk)}?`, answer: [bound], explanation: `${n(fact(k))} × ${n(M)} = ${n(fact(k) * M)}, and ${n(fact(k) * M)} ÷ ${n(Rk)} = ${n(bound)}.` },
    { prompt: `“${claim}” Enter 1 if it is true, 0 if it is false.`, answer: [truth], explanation: why }
   ] }; }
 },
 /* q27: harmonic u = A(x² − y²) + Bxy + Cx + Dy + E; u at the point (p + r, q) of the ring, and the average round the ring, u(p, q). */
 q27: {
  canonical: { A: 1, B: 3, C: -2, D: 4, E: 1, p: 2, q: 1, r: 3 },
  /* The point on the ring never has the centre's value; never the worked example (u = x² − y² + 6, centre (3, −1)). */
  draw: R => retry(() => ({ A: R.pick([-2, -1, 1, 2]), B: R.int(-4, 4), C: R.int(-5, 5), D: R.int(-5, 5), E: R.int(-9, 9), p: R.int(-3, 3), q: R.int(-3, 3), r: R.int(1, 4) }),
   p => { const U = (x, y) => p.A * (x * x - y * y) + p.B * x * y + p.C * x + p.D * y + p.E; return U(p.p + p.r, p.q) !== U(p.p, p.q) && !same(p, { A: 1, B: 3, C: -2, D: 4, p: 2, q: 1 }) && !(p.p === 3 && p.q === -1); },
   { A: 1, B: 3, C: -2, D: 4, E: 1, p: 2, q: 1, r: 3 }),
  build: ({ A, B, C, D, E, p, q, r }) => { const u = terms([[A, 'x²'], [-A, 'y²'], [B, 'xy'], [C, 'x'], [D, 'y'], [E, '']]),
   parts = (x, y) => [A * x * x, -A * y * y, B * x * y, C * x, D * y, E], U = (x, y) => parts(x, y).reduce((s, v) => s + v, 0), xe = p + r, edge = U(xe, q), mid = U(p, q); return {
   prompt: `The field lab maps a potential u(x, y) = ${u} across a flat sheet. A sensor ring is the circle of radius ${n(r)} centred at (${n(p)}, ${n(q)}). Enter u at the point (${n(xe)}, ${n(q)}) on the ring, then the average of u over the whole ring.`,
   answer: [edge, mid],
   hints: ['Check that u is harmonic: ∂²u/∂x² + ∂²u/∂y² = 0. The mean value property then says that the average of u round a circle equals the value of u at its centre.',
    'The first answer is u at one point of the ring, found by putting in its x and y. The average is u at the centre of the ring, not at a point on it.'],
   solution: `u(${n(xe)}, ${n(q)}) = ${eq(parts(xe, q), edge)}. ∂²u/∂x² = ${n(2 * A)} and ∂²u/∂y² = ${n(-2 * A)}, which add to 0, so u is harmonic everywhere. By the mean value property its average round the ring is its value at the centre: u(${n(p)}, ${n(q)}) = ${eq(parts(p, q), mid)}.`,
   guidance: [
    { prompt: `Put x = ${n(xe)} and y = ${n(q)} into u. What is u(${n(xe)}, ${n(q)})?`, answer: [edge], explanation: `u(${n(xe)}, ${n(q)}) = ${eq(parts(xe, q), edge)}.` },
    { prompt: 'Is u harmonic? Work out ∂²u/∂x² + ∂²u/∂y².', answer: [0], explanation: `∂²u/∂x² = ${n(2 * A)} and ∂²u/∂y² = ${n(-2 * A)}: they add to 0, so u is harmonic and the mean value property applies.` },
    { prompt: `The average round the ring is u at its centre. What is u(${n(p)}, ${n(q)})?`, answer: [mid], explanation: `u(${n(p)}, ${n(q)}) = ${eq(parts(p, q), mid)}.` }
   ] }; }
 },
 /* q28: f(z) = zⁿ + c (c real, |c| < Rⁿ) on |z| ≤ R: the largest |f| on the disc, Rⁿ + |c|, and the smallest on the edge, Rⁿ − |c|. */
 q28: {
  canonical: { n: 3, R: 2, c: -5 },
  /* Never the worked example (z² + 3 on |z| ≤ 2). */
  draw: R => retry(() => { const k = R.int(2, 4), r = R.int(2, 3), Rk = Math.pow(r, k); return { n: k, R: r, c: R.pick([-1, 1]) * R.int(1, Math.min(Rk - 1, 30)) }; },
   p => !same(p, { n: 3, R: 2, c: -5 }) && !same(p, { n: 2, R: 2, c: 3 }), { n: 3, R: 2, c: -5 }),
  build: ({ n: k, R, c }) => { const Rk = Math.pow(R, k), ac = Math.abs(c), top = Rk + ac, low = Rk - ac, zk = 'z' + SUP[k], f = `${zk} ${c < 0 ? '−' : '+'} ${n(ac)}`,
   hi = c > 0 ? Rk : -Rk; return {
   prompt: `A field coil’s strength over the disc |z| ≤ ${n(R)} is |f(z)|, with f(z) = ${f}. Enter the largest value of |f(z)| on the whole disc, then the smallest value of |f(z)| on its edge, the circle |z| = ${n(R)}.`,
   answer: [top, low],
   hints: ['Maximum modulus principle: for a function that is analytic on a disc and not constant, the largest |f| over the disc is reached on its edge and nowhere inside.',
    'On the edge |zⁿ| = Rⁿ. The triangle inequality puts |w + c| between |w| − |c| and |w| + |c|, and as z goes once round the edge, zⁿ goes all the way round the circle of radius Rⁿ, so both ends are reached.'],
   solution: `On the edge |${zk}| = ${n(R)}${SUP[k]} = ${n(Rk)}. As z goes round the edge, ${zk} passes through ${n(Rk)} and ${n(-Rk)}. |${f}| is largest where ${zk} = ${n(hi)}, which points the same way as ${n(c)}: ${n(Rk)} + ${n(ac)} = ${n(top)}. It is smallest where ${zk} = ${n(-hi)}: ${n(Rk)} − ${n(ac)} = ${n(low)}. By the maximum modulus principle no point inside the disc beats the edge, so the largest value on the whole disc is ${n(top)}.`,
   guidance: [
    { prompt: `On the edge |z| = ${n(R)}. What is |${zk}| there?`, answer: [Rk], explanation: `The modulus of a product is the product of the moduli, so |${zk}| = ${n(R)}${SUP[k]} = ${n(Rk)}.` },
    { prompt: `What is the largest value of |f(z)| on the disc?`, answer: [top], explanation: `It is on the edge, where ${zk} = ${n(hi)} lines up with ${n(c)}: ${n(Rk)} + ${n(ac)} = ${n(top)}.` },
    { prompt: `What is the smallest value of |f(z)| on the edge?`, answer: [low], explanation: `Where ${zk} = ${n(-hi)} points against ${n(c)}: ${n(Rk)} − ${n(ac)} = ${n(low)}.` }
   ] }; }
 },
 /* q29: round |z| = R, ∮ f ÷ (z − a) dz (k = 2f(a)) and ∮ f ÷ (z − a)² dz (k = 2f′(a)); and Cauchy's bound m! M ÷ ρᵐ for g on |z − 1| = ρ. */
 q29: {
  canonical: { al: 3, be: -1, ga: 2, a: -1, R: 2, m: 2, rho: 2, M: 12 },
  draw: R => retry(() => { const m = R.int(1, 2), rho = R.int(2, 4); return { al: R.pick([-3, -2, -1, 1, 2, 3]), be: R.int(-5, 5), ga: R.int(-6, 6), a: R.int(-2, 2), R: R.int(2, 5), m, rho, M: boundM(rho, m, 6, 200, R.int) }; },
   p => Math.abs(p.a) < p.R && p.M > 0 && p.al * p.a * p.a + p.be * p.a + p.ga !== 0 && 2 * p.al * p.a + p.be !== 0 && !same(p, { al: 3, be: -1, ga: 2, a: -1 }), { al: 3, be: -1, ga: 2, a: -1, R: 2, m: 2, rho: 2, M: 12 }),
  build: ({ al, be, ga, a, R, m, rho, M }) => { const f = poly([al, be, ga], 'z'), fa = al * a * a + be * a + ga, d = 2 * al * a + be, k1 = 2 * fa, k2 = 2 * d,
   rm = Math.pow(rho, m), bound = fact(m) * M / rm; return {
   prompt: `Three readings from the field coil. The coil is the circle |z| = ${n(R)}, driven once anticlockwise, and f(z) = ${f}. Enter k in ∮ f(z) ÷ ${zp(a)} dz = kπi, then k in ∮ f(z) ÷ ${zp(a)}² dz = kπi. A second signal g is analytic on and inside the circle |z − 1| = ${n(rho)}, with |g(z)| ≤ ${n(M)} on that circle: enter the largest value Cauchy’s inequality allows for |${der(m, 'g')}(1)|.`,
   answer: [k1, k2, bound],
   hints: ['When a is inside the loop, Cauchy’s integral formula gives 2πi f(a) for f(z) ÷ (z − a), and the formula for derivatives gives 2πi f′(a) ÷ 1! for f(z) ÷ (z − a)².',
    'Cauchy’s inequality: |g⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ for a circle of radius R centred on a, with |g| ≤ M on it.'],
   solution: `a = ${n(a)} is inside |z| = ${n(R)}, and f is a polynomial. f(${n(a)}) = ${eq([al * a * a, be * a, ga], fa)}, so the first integral is 2πi × ${par(fa)} = ${kpi(k1)}: k = ${n(k1)}. f′(z) = ${poly([2 * al, be], 'z')}, so f′(${n(a)}) = ${n(d)} and the second integral is 2πi × ${par(d)} = ${kpi(k2)}: k = ${n(k2)}. For g, n = ${n(m)}: the bound is ${n(m)}! × ${n(M)} ÷ ${n(rho)}${SUP[m]} = ${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.`,
   guidance: [
    { prompt: `f(${n(a)}) = ${n(fa)}. What is k for ∮ f(z) ÷ ${zp(a)} dz?`, answer: [k1], explanation: `Cauchy’s integral formula: 2πi × ${par(fa)} = ${kpi(k1)}, so k = ${n(k1)}.` },
    { prompt: `f′(z) = ${poly([2 * al, be], 'z')}. What is k for ∮ f(z) ÷ ${zp(a)}² dz?`, answer: [k2], explanation: `f′(${n(a)}) = ${n(d)}, and the formula for derivatives with n = 1 gives 2πi × ${par(d)} = ${kpi(k2)}, so k = ${n(k2)}.` },
    { prompt: `What is the bound ${n(m)}! × ${n(M)} ÷ ${n(rm)} on |${der(m, 'g')}(1)|?`, answer: [bound], explanation: `${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.` }
   ] }; }
 },
 /* q30: 1 + z + z² + … = 1 ÷ (1 − z) for z = (a + bi) ÷ d with |z| < 1; real and imaginary parts (short decimals: see GEO). */
 q30: {
  canonical: { a: 0, b: 1, d: 2 },
  draw: R => R.pick(GEO),
  build: ({ a, b, d }) => { const zt = a === 0 ? `${cx(0, b)} ÷ ${n(d)}` : `(${cx(a, b)}) ÷ ${n(d)}`, den = (d - a) * (d - a) + b * b,
   re = d * (d - a) / den, im = d * b / den, top = cx(d * (d - a), d * b); return {
   prompt: `The signal archive stores a signal as the endless sum 1 + z + z² + z³ + … of every power of z = ${zt}. Enter the real part, then the imaginary part, of the sum, as exact decimals.`,
   answer: [re, im],
   hints: ['A geometric series 1 + z + z² + … adds up to 1 ÷ (1 − z) when |z| < 1, for a complex z just as for a real number.',
    'To divide by a complex number, multiply the top and the bottom by the conjugate of the bottom; the bottom becomes (Re)² + (Im)², a real number.'],
   solution: `|z|² = ${n(a * a + b * b)} ÷ ${n(d * d)}, less than 1, so the series adds up to 1 ÷ (1 − z). 1 − z = (${cx(d - a, -b)}) ÷ ${n(d)}, so 1 ÷ (1 − z) = ${n(d)} ÷ (${cx(d - a, -b)}). Multiply the top and the bottom by the conjugate ${cx(d - a, b)}: the bottom becomes ${par(d - a)}² + ${par(b)}² = ${n(den)} and the top ${top}. The sum is (${top}) ÷ ${n(den)}: real part ${n(re)}, imaginary part ${n(im)}.`,
   guidance: [
    { prompt: `1 ÷ (1 − z) = ${n(d)} ÷ (${cx(d - a, -b)}). Multiply the top and the bottom by the conjugate ${cx(d - a, b)}. What real number is the new bottom?`, answer: [den], explanation: `(${cx(d - a, -b)})(${cx(d - a, b)}) = ${par(d - a)}² + ${par(b)}² = ${n(den)}.` },
    { prompt: `The new top is ${n(d)}(${cx(d - a, b)}) = ${top}. What is the real part of the sum?`, answer: [re], explanation: `${n(d * (d - a))} ÷ ${n(den)} = ${n(re)}.` },
    { prompt: 'And the imaginary part?', answer: [im], explanation: `${n(d * b)} ÷ ${n(den)} = ${n(im)}.` }
   ] }; }
 }
});
})();
