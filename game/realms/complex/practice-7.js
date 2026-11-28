/* Complex analysis: the plane of numbers practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p7.js. */
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
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
/* sup(3) is '³', sup(1) is '' (no written power 1); supAll(1) is '¹'. */
const sup = k => k === 1 ? '' : String(k).split('').map(ch => SUP[ch]).join('');
const supAll = k => String(k).split('').map(ch => SUP[ch]).join('');
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const lead = (v, x) => `${v < 0 ? '−' : ''}${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
/* poly([[1, 3], [−2, 2], [5, 1], [1, 0]]) is 'z³ − 2z² + 5z + 1'; zero terms are left out. */
const zp = k => k === 0 ? '' : k === 1 ? 'z' : `z${sup(k)}`;
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, k], i) => k === 0 ? (i ? cst(c) : n(c)) : (i ? trm(c, zp(k)) : lead(c, zp(k)))).join(' '); };
const imag = y => y === 1 ? 'i' : y === -1 ? '−i' : `${n(y)}i`;
const cx = ([x, y]) => y === 0 ? n(x) : x === 0 ? imag(y) : `${n(x)} ${sgn(y)} ${Math.abs(y) === 1 ? '' : n(Math.abs(y))}i`;
const mod = ([x, y]) => Math.sqrt(x * x + y * y);
/* fac(2) is 'z − 2', fac(−3) is 'z + 3', fac(0) is 'z'. pw(2, 3) is '(z − 2)³', pw(0, 2) is 'z²', pw(2, 1) is '(z − 2)'. */
const fac = x => x === 0 ? 'z' : `z ${x > 0 ? '−' : '+'} ${n(Math.abs(x))}`;
const pw = (x, k) => x === 0 ? `z${sup(k)}` : `(${fac(x)})${sup(k)}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const ordN = k => { const t = k % 100; return `${k}${t >= 11 && t <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] || 'th'}`; };
const ex = v => v === 1 ? 'z' : v === -1 ? '−z' : `${n(v)}z`;
const nk = k => k === 1 ? 'n' : `n${sup(k)}`;
/* Bounded retry: at most 1000 tries of make(), then the canonical parameters. */
const tries = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return canon; };
/* Test points with whole-number moduli 1 to 12 (and the points 3 + 4i, 6 + 8i, 5 + 12i and their reflections). */
const TEST = [];
for (let m = 1; m <= 12; m++) TEST.push([m, 0], [-m, 0], [0, m], [0, -m]);
for (const [x, y] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]) TEST.push([x, y], [-x, y], [x, -y], [-x, -y]);

/* ---- q31 Power series and radius of convergence [8.2] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The ringing dish',
 brief: 'A dish in the archive keeps ringing after each pulse, and the crew must find which test points still give a readable signal.',
 labels: ['radius R', 'converges at z₁ (1 or 0)', 'converges at z₂ (1 or 0)'], tolerance: 0.01,
 gl: [['radius R'], ['converges at z₁ (1 or 0)'], ['converges at z₂ (1 or 0)']]
}, {
 /* aₙ = (n + 1)ᵏ ÷ bⁿ from n = 0, so R = b. z₁ = x on the real line and z₂ = yi on the imaginary axis; neither is on the circle |z| = b.
    Not the parent's worked example (n ÷ 3ⁿ at 2i). */
 canonical: { k: 2, b: 5, x: -7, y: 4 },
 draw: R => tries(() => ({ k: R.int(1, 3), b: R.int(2, 9), x: R.nz(-12, 12), y: R.nz(-12, 12) }),
  p => Math.abs(p.x) !== p.b && Math.abs(p.y) !== p.b, { k: 2, b: 5, x: -7, y: 4 }),
 build: ({ k, b, x, y }) => { const c1 = Math.abs(x) < b ? 1 : 0, c2 = Math.abs(y) < b ? 1 : 0, z1 = cx([x, 0]), z2 = cx([0, y]),
  ratio = k === 1 ? '(n + 2) ÷ (n + 1)' : `((n + 2) ÷ (n + 1))${sup(k)}`, co = k === 1 ? '(n + 1)' : `(n + 1)${sup(k)}`; return {
  prompt: `A dish in the signal archive keeps ringing after each pulse, and the ringing is stored as the power series Σ aₙzⁿ, summed over n = 0, 1, 2, … without end, with coefficients aₙ = ${co} ÷ ${n(b)}ⁿ. Use the ratio test to find its radius of convergence R, and enter it. Then, for each of the test points z₁ = ${z1} and z₂ = ${z2}, enter 1 if the series converges there or 0 if it diverges there. Neither test point lies exactly on the circle |z| = R.`,
  answer: [b, c1, c2],
  hints: ['Divide the size of term n + 1 by the size of term n, |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ|, and let n grow. The series converges where that limit is less than 1 and diverges where it is more than 1.',
   'The modulus of a point is its distance from 0: for a point on the real axis it is the number without its sign, and for a point such as 6i it is 6. Compare each modulus with R.'],
  solution: `The sizes of neighbouring terms have the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × |z| ÷ ${n(b)}. As n grows, (n + 2) ÷ (n + 1) tends to 1, so the ratio tends to |z| ÷ ${n(b)}. That is less than 1 exactly when |z| < ${n(b)}, so the radius of convergence is R = ${n(b)}. For z₁ = ${z1}, |z₁| = ${n(Math.abs(x))}, which is ${c1 ? 'less' : 'more'} than ${n(b)}, so the series ${c1 ? 'converges' : 'diverges'} there: enter ${c1}. For z₂ = ${z2}, |z₂| = ${n(Math.abs(y))}, which is ${c2 ? 'less' : 'more'} than ${n(b)}, so the series ${c2 ? 'converges' : 'diverges'} there: enter ${c2}.`,
  guidance: [
   { prompt: `As n grows, the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × |z| ÷ ${n(b)} tends to |z| ÷ ${n(b)}. The series converges where this limit is less than 1. What is the radius of convergence R?`, answer: [b], explanation: `|z| ÷ ${n(b)} < 1 exactly when |z| < ${n(b)}, so R = ${n(b)}.` },
   { prompt: `The test point z₁ = ${z1} has modulus ${n(Math.abs(x))}. Compare it with R = ${n(b)}. Enter 1 if the series converges at z₁, 0 if it diverges there.`, answer: [c1], explanation: `${n(Math.abs(x))} is ${c1 ? 'less' : 'more'} than ${n(b)}, so z₁ is ${c1 ? 'inside' : 'outside'} the disc of convergence and the series ${c1 ? 'converges' : 'diverges'} there.` },
   { prompt: `The test point z₂ = ${z2} has modulus ${n(Math.abs(y))}. Compare it with R = ${n(b)}. Enter 1 if the series converges at z₂, 0 if it diverges there.`, answer: [c2], explanation: `${n(Math.abs(y))} is ${c2 ? 'less' : 'more'} than ${n(b)}, so z₂ is ${c2 ? 'inside' : 'outside'} the disc of convergence and the series ${c2 ? 'converges' : 'diverges'} there.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Siting the relay mast',
 brief: 'A relay mast is going up near the transmitter, and the crew must know how much margin it has before the stored signal stops being readable there.',
 labels: ['radius R (km)', '|z₀| (km)', 'distance from the edge (km)'], tolerance: 0.001,
 gl: [['radius R (km)'], ['|z₀| (km)'], ['distance from the edge (km)']]
}, {
 /* aₙ = nᵏ sⁿ ÷ bⁿ: the ratio tends to s|z| ÷ b, so R = b ÷ s (s = 2, 4 or 5, so R is a short decimal). The mast has a whole-number
    distance m that is never R. Answers R, m and |R − m|. */
 canonical: { k: 2, s: 4, b: 10, x: 6, y: 8 },
 draw: R => tries(() => { const z = R.pick(TEST); return { k: R.int(1, 3), s: R.pick([2, 4, 5]), b: R.int(3, 17), x: z[0], y: z[1] }; },
  p => Math.abs(p.b / p.s - mod([p.x, p.y])) > 0.05, { k: 2, s: 4, b: 10, x: 6, y: 8 }),
 build: ({ k, s, b, x, y }) => { const Rr = b / s, m = mod([x, y]), d = Math.abs(Rr - m), z0 = cx([x, y]),
  modT = x === 0 || y === 0 ? `|${z0}| = ${n(m)}` : `√(${par(x)}² + ${par(y)}²) = √${n(m * m)} = ${n(m)}`,
  ratio = k === 1 ? '(n + 1) ÷ n' : `((n + 1) ÷ n)${sup(k)}`; return {
  prompt: `The archive stores a transmitter’s signal as the power series Σ aₙzⁿ, summed over n = 1, 2, 3, … without end, where z = x + yi is a position in the plane measured in kilometres from the transmitter. The coefficients are aₙ = (${nk(k)} × ${n(s)}ⁿ) ÷ ${n(b)}ⁿ. The signal can be read at a position only where the series converges. Use the ratio test to find the radius of convergence R in kilometres, and enter it (it need not be a whole number). A relay mast is to stand at z₀ = ${z0}. Enter its distance |z₀| from the transmitter, then enter how far the mast is from the edge of the disc of convergence, the circle |z| = R, as a positive number of kilometres.`,
  answer: [Rr, m, d],
  hints: ['Divide the size of term n + 1 by the size of term n and let n grow. Here the number multiplying |z| in the limit is not 1 ÷ b alone: the top and the bottom both have a power to the n. The series converges where the limit is less than 1, and R is the value of |z| where the limit reaches 1.',
   'The distance of a point from 0 is its modulus √(x² + y²). The edge of the disc is the circle of radius R round 0, so a point at distance m from 0 is |R − m| from that circle, measured along the line through 0.'],
  solution: `The sizes of neighbouring terms have the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × ${n(s)} × |z| ÷ ${n(b)}. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to ${n(s)}|z| ÷ ${n(b)}. That is less than 1 exactly when |z| < ${n(b)} ÷ ${n(s)}, so R = ${n(b)} ÷ ${n(s)} = ${n(Rr)} km. The mast has |z₀| = ${modT} km. Its distance from the edge of the disc is |${n(Rr)} − ${n(m)}| = ${n(d)} km.`,
  guidance: [
   { prompt: `As n grows, the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × ${n(s)} × |z| ÷ ${n(b)} tends to ${n(s)}|z| ÷ ${n(b)}. The series converges where this limit is less than 1. What is the radius of convergence R, in kilometres?`, answer: [Rr], explanation: `${n(s)}|z| ÷ ${n(b)} < 1 exactly when |z| < ${n(b)} ÷ ${n(s)} = ${n(Rr)}, so R = ${n(Rr)} km.` },
   { prompt: `What is the distance |z₀| of the mast at z₀ = ${z0} from the transmitter?`, answer: [m], explanation: `|z₀| = ${modT} km.` },
   { prompt: `The edge of the disc is at distance R = ${n(Rr)} km from the transmitter and the mast is ${n(m)} km from it. How far apart are they, as a positive number of kilometres?`, answer: [d], explanation: `The difference of ${n(Rr)} and ${n(m)} without its sign is ${n(d)} km. The mast is ${m < Rr ? 'inside' : 'outside'} the disc of convergence.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', title: 'The even-power filter',
 brief: 'A filter in the archive keeps only the even powers of z, so the crew must adapt the ratio test before they can say where it still reads.',
 labels: ['radius R', '|z₀|', 'converges at z₀ (1 or 0)'], tolerance: 0.01,
 gl: [['radius R'], ['|z₀|'], ['converges at z₀ (1 or 0)']]
}, {
 /* tₙ = nᵏ z²ⁿ ÷ B ⁿ with B = r², so |tₙ₊₁| ÷ |tₙ| tends to |z|² ÷ r² and R = r. z₀ has a whole-number modulus other than r. */
 canonical: { k: 2, r: 4, x: 0, y: 7 },
 draw: R => tries(() => { const z = R.pick(TEST); return { k: R.int(1, 3), r: R.int(2, 8), x: z[0], y: z[1] }; },
  p => mod([p.x, p.y]) !== p.r, { k: 2, r: 4, x: 0, y: 7 }),
 build: ({ k, r, x, y }) => { const B = r * r, m = mod([x, y]), conv = m < r ? 1 : 0, z0 = cx([x, y]),
  modT = x === 0 || y === 0 ? `|${z0}| = ${n(m)}` : `√(${par(x)}² + ${par(y)}²) = √${n(m * m)} = ${n(m)}`,
  ratio = k === 1 ? '(n + 1) ÷ n' : `((n + 1) ÷ n)${sup(k)}`; return {
  prompt: `An even-power filter in the signal archive stores a signal as the series with terms tₙ = (${nk(k)} × z²ⁿ) ÷ ${n(B)}ⁿ, summed over n = 1, 2, 3, … without end. Only even powers of z appear, so there is no coefficient of every power. Apply the ratio test to the terms themselves: the series converges where |tₙ₊₁| ÷ |tₙ| tends to a limit below 1 and diverges where it tends to a limit above 1. Find the radius of convergence R, the number for which the series converges when |z| < R and diverges when |z| > R, and enter it. Then enter the modulus |z₀| of the test point z₀ = ${z0}, and enter 1 if the series converges at z₀ or 0 if it diverges there.`,
  answer: [r, m, conv],
  hints: ['Write out |tₙ₊₁| ÷ |tₙ|. The powers of z give |z²ⁿ⁺²| ÷ |z²ⁿ| = |z|², not |z|. Let n grow and find where the limit is below 1.',
   'The limit is |z|² divided by the number under the power n. It is below 1 when |z|² is below that number, so R is the square root of that number.'],
  solution: `The ratio of neighbouring terms is |tₙ₊₁| ÷ |tₙ| = ${ratio} × |z|² ÷ ${n(B)}. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to |z|² ÷ ${n(B)}. That is less than 1 exactly when |z|² < ${n(B)}, that is when |z| < ${n(r)}, so the radius of convergence is R = ${n(r)}. The test point has |z₀| = ${modT}. ${conv ? `${n(m)} is less than ${n(r)}, so z₀ lies inside the disc of convergence and the series converges there: enter 1.` : `${n(m)} is more than ${n(r)}, so z₀ lies outside the disc of convergence and the series diverges there: enter 0.`}`,
  guidance: [
   { prompt: `The ratio |tₙ₊₁| ÷ |tₙ| = ${ratio} × |z|² ÷ ${n(B)} tends to |z|² ÷ ${n(B)}. The series converges where this is less than 1, that is where |z|² < ${n(B)}. What is the radius of convergence R?`, answer: [r], explanation: `|z|² < ${n(B)} exactly when |z| < ${n(r)}, so R = ${n(r)}.` },
   { prompt: `What is the modulus of the test point z₀ = ${z0}?`, answer: [m], explanation: `|z₀| = ${modT}, its distance from 0.` },
   { prompt: `Compare |z₀| = ${n(m)} with R = ${n(r)}. Enter 1 if the series converges at z₀, 0 if it diverges there.`, answer: [conv], explanation: conv ? `${n(m)} < ${n(r)}: z₀ is inside the disc of convergence, so the series converges there.` : `${n(m)} > ${n(r)}: z₀ is outside the disc of convergence, so the series diverges there.` }
  ] }; }
});

/* ---- q32 Taylor coefficients [8.3] ---- */

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The damped pulse',
 brief: 'A pulse and its damper are stored as simple formulas, and the crew needs one coefficient of each stored series.',
 labels: ['numerator', 'denominator', 'coefficient in h'], tolerance: 0.01,
 gl: [['kth derivative at 0'], ['k!'], ['coefficient in h']]
}, {
 /* f = e^(az): coefficient aᵏ ÷ k! (denominator above 1 in lowest terms). h = 1 ÷ (1 + bz) = Σ (−b)ⁿzⁿ, coefficient (−b)ᵐ, below 1000 in size.
    Not the parent's worked example (e^(2z) with z³). */
 canonical: { a: -3, k: 4, b: 3, m: 3 },
 draw: R => tries(() => ({ a: R.pick([2, 3, 4, 5, -2, -3, -4, -5]), k: R.int(2, 5), b: R.int(2, 5), m: R.int(2, 4) }),
  p => { const top = Math.pow(p.a, p.k), bot = fact(p.k); return bot / gcd(top, bot) > 1 && !(p.a === 2 && p.k === 3); },
  { a: -3, k: 4, b: 3, m: 3 }),
 build: ({ a, k, b, m }) => { const top = Math.pow(a, k), bot = fact(k), g = gcd(top, bot), num = top / g, den = bot / g, bm = Math.pow(-b, m),
  hText = `1 ÷ (1 + ${n(b)}z)`; return {
  prompt: `A pulse in the signal archive is stored as f(z) = e^(${n(a)}z), and its damper as h(z) = ${hText}. Each is written as its Taylor series about z = 0. Enter the Taylor coefficient of z${sup(k)} in f as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z${sup(m)} in h. Type numbers without commas.`,
  answer: [num, den, bm],
  hints: ['The Taylor coefficient of zⁿ about 0 is f⁽ⁿ⁾(0) ÷ n!. Each derivative of e^(az) brings down one more factor a.',
   'Write 1 + bz as 1 − w with w = −bz, and use 1 ÷ (1 − w) = 1 + w + w² + …; the coefficient of zⁿ is then (−b)ⁿ.'],
  solution: `Each derivative of e^(${n(a)}z) brings down another factor ${par(a)}, so f⁽ⁿ⁾(0) = ${par(a)}ⁿ and the coefficient of zⁿ is ${par(a)}ⁿ ÷ n!. For n = ${n(k)} it is ${par(a)}${sup(k)} ÷ ${n(k)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : `, already in lowest terms`}. For h, write ${hText} as 1 ÷ (1 − w) with w = −${n(b)}z. The geometric series 1 + w + w² + … gives h(z) = Σ (−${n(b)})ⁿzⁿ = Σ ${par(-b)}ⁿzⁿ for |z| < 1 ÷ ${n(b)}, so the coefficient of z${sup(m)} is ${par(-b)}${sup(m)} = ${n(bm)}.`,
  guidance: [
   { prompt: `What is the ${ordN(k)} derivative of f(z) = e^(${n(a)}z), at z = 0?`, answer: [top], explanation: `Each derivative multiplies by ${par(a)}, so the ${ordN(k)} derivative is ${par(a)}${sup(k)}e^(${n(a)}z), which is ${n(top)} at z = 0.` },
   { prompt: `The Taylor coefficient divides that derivative by ${n(k)}!. What is ${n(k)}!?`, answer: [bot], explanation: `${n(k)}! = ${Array.from({ length: k }, (_, i) => i + 1).join(' × ')} = ${n(bot)}, so the coefficient is ${n(top)} ÷ ${n(bot)}${g > 1 ? ` = ${n(num)} ÷ ${n(den)}` : ''}.` },
   { prompt: `With w = −${n(b)}z, h(z) = 1 ÷ (1 − w) = 1 + w + w² + …. What is the coefficient of z${sup(m)} in h?`, answer: [bm], explanation: `The term w${sup(m)} is (−${n(b)}z)${sup(m)} = ${par(-b)}${sup(m)}z${sup(m)}, so the coefficient is ${n(bm)}.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Two streams, one series',
 brief: 'Two data streams are added in the archive, and the crew needs one coefficient of the combined signal.',
 labels: ['numerator', 'denominator'], tolerance: 0.01,
 gl: [['aᵏ'], ['coefficient in g'], ['numerator over k!']]
}, {
 /* f = e^(az) and g = 1 ÷ (1 − bz): the coefficient of zᵏ in f + g is aᵏ ÷ k! + bᵏ = (aᵏ + bᵏ k!) ÷ k!, reduced, with denominator above 1. */
 canonical: { a: 4, k: 3, b: -3 },
 draw: R => tries(() => ({ a: R.pick([2, 3, 4, 5, -2, -3, -4, -5]), k: R.int(2, 4), b: R.pick([2, 3, 4, -2, -3, -4]) }),
  p => { const S = Math.pow(p.a, p.k) + Math.pow(p.b, p.k) * fact(p.k); return S !== 0 && fact(p.k) / gcd(S, fact(p.k)) > 1; },
  { a: 4, k: 3, b: -3 }),
 build: ({ a, k, b }) => { const top = Math.pow(a, k), bot = fact(k), bk = Math.pow(b, k), S = top + bk * bot, g = gcd(S, bot), num = S / g, den = bot / g,
  gText = `1 ÷ (1 ${b > 0 ? '−' : '+'} ${n(Math.abs(b))}z)`; return {
  prompt: `The archive adds two data streams. Stream F is f(z) = e^(${n(a)}z) and stream G is g(z) = ${gText}. When two functions are added, their Taylor series add term by term, so the coefficient of each power of z in f + g is the sum of the two coefficients. Enter the Taylor coefficient of z${sup(k)} in f + g about z = 0 as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Type numbers without commas.`,
  answer: [num, den],
  hints: ['The Taylor coefficient of zⁿ about 0 is f⁽ⁿ⁾(0) ÷ n!, and each derivative of e^(az) brings down one more factor a. For 1 ÷ (1 − w), the geometric series 1 + w + w² + … gives the coefficients.',
   'To add a fraction and a whole number, write the whole number over the same denominator, then add the tops and reduce.'],
  solution: `For f, each derivative brings down another factor ${par(a)}, so the coefficient of z${sup(k)} is ${par(a)}${sup(k)} ÷ ${n(k)}! = ${n(top)} ÷ ${n(bot)}. For g, write ${gText} as 1 ÷ (1 − w) with w = ${n(b)}z; the geometric series gives g(z) = Σ ${par(b)}ⁿzⁿ, so the coefficient of z${sup(k)} is ${par(b)}${sup(k)} = ${n(bk)}. The sum is ${n(top)} ÷ ${n(bot)} + ${par(bk)} = (${n(top)} + ${par(bk)} × ${n(bot)}) ÷ ${n(bot)} = ${n(S)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : `, already in lowest terms`}.`,
  guidance: [
   { prompt: `The coefficient of z${sup(k)} in f is ${par(a)}${sup(k)} ÷ ${n(k)}!. What is ${par(a)}${sup(k)}?`, answer: [top], explanation: `${par(a)}${sup(k)} = ${n(top)}, so the coefficient in f is ${n(top)} ÷ ${n(bot)}.` },
   { prompt: `In g(z) = ${gText} = 1 + w + w² + … with w = ${n(b)}z, what is the coefficient of z${sup(k)}?`, answer: [bk], explanation: `The term w${sup(k)} is (${n(b)}z)${sup(k)} = ${par(b)}${sup(k)}z${sup(k)}, so the coefficient is ${n(bk)}.` },
   { prompt: `Write the whole number ${par(bk)} over ${n(bot)}: it is ${par(bk)} × ${n(bot)} ÷ ${n(bot)}. Add it to ${n(top)} ÷ ${n(bot)}. What is the numerator of the sum over ${n(bot)}, before it is reduced?`, answer: [S], explanation: `${n(top)} + ${par(bk)} × ${n(bot)} = ${n(S)}, so the sum is ${n(S)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : ''}.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q31', title: 'A chained filter and its reach',
 brief: 'Two exponential stages are chained and a third stage is a geometric one, and the crew needs a coefficient of each and how far the third stage’s series reaches.',
 labels: ['numerator', 'denominator', 'coefficient in g', 'radius R'], tolerance: 0.001,
 gl: [['p + q'], ['aᵏ'], ['coefficient in g'], ['radius R']]
}, {
 /* f = e^(pz) e^(qz) = e^(az) with a = p + q, 2 ≤ |a| ≤ 6; coefficient aᵏ ÷ k! in lowest terms with denominator above 1.
    g = 1 ÷ (1 − bz): coefficient bᵐ below 1000 in size; ratio test gives R = 1 ÷ |b| (0.5, 0.25 or 0.2). */
 canonical: { p: 3, q: -1, k: 4, b: -4, m: 3 },
 draw: R => tries(() => ({ p: R.nz(-4, 4), q: R.nz(-4, 4), k: R.int(3, 5), b: R.pick([2, 4, 5, -2, -4, -5]), m: R.int(2, 3) }),
  p => { const a = p.p + p.q, top = Math.pow(a, p.k), bot = fact(p.k); return Math.abs(a) >= 2 && bot / gcd(top, bot) > 1 && Math.abs(Math.pow(p.b, p.m)) < 1000; },
  { p: 3, q: -1, k: 4, b: -4, m: 3 }),
 build: ({ p, q, k, b, m }) => { const a = p + q, top = Math.pow(a, k), bot = fact(k), g = gcd(top, bot), num = top / g, den = bot / g, bm = Math.pow(b, m), Rr = 1 / Math.abs(b),
  gText = `1 ÷ (1 ${b > 0 ? '−' : '+'} ${n(Math.abs(b))}z)`; return {
  prompt: `Two stages of a filter in the archive are chained, so their formulas multiply: f(z) = e^(${ex(p)}) × e^(${ex(q)}). For the exponential, e^(pz) × e^(qz) = e^((p + q)z). A third stage is g(z) = ${gText}. Each is written as its Taylor series about z = 0. Enter the Taylor coefficient of z${sup(k)} in f as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z${sup(m)} in g, typing numbers without commas. Finally use the ratio test on the series of g to find its radius of convergence R, and enter it as a decimal.`,
  answer: [num, den, bm, Rr],
  hints: ['Add the two numbers multiplying z in the exponents first, so that f is one exponential e^(az). Then the Taylor coefficient of zⁿ is aⁿ ÷ n!.',
   'Write the denominator as 1 − w with w = bz; the coefficient of zⁿ in 1 ÷ (1 − w) = 1 + w + w² + … is bⁿ. For the radius, divide the size of term n + 1 by the size of term n and find where the limit is less than 1.'],
  solution: `Adding the numbers in the exponents, f(z) = e^((${n(p)} ${plus(q)})z) = e^(${n(a)}z). Each derivative brings down another factor ${par(a)}, so the coefficient of z${sup(k)} is ${par(a)}${sup(k)} ÷ ${n(k)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : `, already in lowest terms`}. For g, write ${gText} as 1 ÷ (1 − w) with w = ${n(b)}z. The geometric series gives g(z) = Σ ${par(b)}ⁿzⁿ, so the coefficient of z${sup(m)} is ${par(b)}${sup(m)} = ${n(bm)}. The sizes of neighbouring terms of Σ ${par(b)}ⁿzⁿ have the ratio ${n(Math.abs(b))}|z|, which is less than 1 exactly when |z| < 1 ÷ ${n(Math.abs(b))}, so R = ${n(Rr)}.`,
  guidance: [
   { prompt: `Add the numbers multiplying z in the exponents: e^(${ex(p)}) × e^(${ex(q)}) = e^(az). What is a = ${n(p)} ${plus(q)}?`, answer: [a], explanation: `${n(p)} ${plus(q)} = ${n(a)}, so f(z) = e^(${n(a)}z).` },
   { prompt: `The coefficient of z${sup(k)} in e^(${n(a)}z) is ${par(a)}${sup(k)} ÷ ${n(k)}!. What is ${par(a)}${sup(k)}?`, answer: [top], explanation: `${par(a)}${sup(k)} = ${n(top)} and ${n(k)}! = ${n(bot)}, so the coefficient is ${n(top)} ÷ ${n(bot)}${g > 1 ? ` = ${n(num)} ÷ ${n(den)}` : ''}.` },
   { prompt: `In g(z) = ${gText} = 1 + w + w² + … with w = ${n(b)}z, what is the coefficient of z${sup(m)}?`, answer: [bm], explanation: `The term w${sup(m)} is (${n(b)}z)${sup(m)} = ${par(b)}${sup(m)}z${sup(m)}, so the coefficient is ${n(bm)}.` },
   { prompt: `The ratio of the sizes of neighbouring terms of g’s series is ${n(Math.abs(b))}|z|. It is less than 1 when |z| < 1 ÷ ${n(Math.abs(b))}. What is R, as a decimal?`, answer: [Rr], explanation: `1 ÷ ${n(Math.abs(b))} = ${n(Rr)}, so R = ${n(Rr)}.` }
  ] }; }
});

/* ---- q33 Laurent series [8.7] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The echo in the cable',
 brief: 'Two echoes in a cable blow up at the same point, and the crew needs the strength of each at 0.',
 labels: ['numerator', 'denominator', 'coefficient of z⁻¹ in g', 'coefficient of z⁰ in g'], tolerance: 0.01,
 gl: [['n'], ['coefficient of z⁻¹ in g'], ['coefficient of z⁰ in g']]
}, {
 /* h = zᵐ e^(a ÷ z): z⁻¹ coefficient a^(m+1) ÷ (m+1)! in lowest terms, denominator above 1. g = K ÷ (z(z + c)) with K = jc², c > 0 on 0 < |z| < c:
    1 ÷ (z + c) = (1 ÷ c)(1 − z ÷ c + …), so the z⁻¹ coefficient is K ÷ c = jc and the z⁰ coefficient is −K ÷ c² = −j. */
 canonical: { m: 2, a: -2, c: 3, j: 2 },
 draw: R => tries(() => ({ m: R.int(1, 3), a: R.pick([2, 3, 4, -2, -3, -4]), c: R.int(2, 5), j: R.pick([1, 2, 3, -1, -2, -3]) }),
  p => { const top = Math.pow(p.a, p.m + 1), bot = fact(p.m + 1); return bot / gcd(top, bot) > 1 && !(p.m === 1 && p.a === 3); },
  { m: 2, a: -2, c: 3, j: 2 }),
 build: ({ m, a, c, j }) => { const N = m + 1, top = Math.pow(a, N), bot = fact(N), g = gcd(top, bot), num = top / g, den = bot / g, K = j * c * c, r1 = j * c, r0 = -j,
  h = `${m === 1 ? 'z' : `z${sup(m)}`} e^(${n(a)} ÷ z)`, gz = `${n(K)} ÷ (z(${fac(-c)}))`; return {
  prompt: `Two echoes in a cable blow up at z = 0. Echo H is h(z) = ${h}, for every z ≠ 0. Echo G is g(z) = ${gz}, on the annulus 0 < |z| < ${n(c)}. Enter the coefficient of z⁻¹ in the Laurent series of h as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z⁻¹ and the coefficient of z⁰ in the Laurent series of g on that annulus. Type numbers without commas.`,
  answer: [num, den, r1, r0],
  hints: ['In eʷ = 1 + w + w² ÷ 2! + w³ ÷ 3! + …, put w = a ÷ z, then multiply every term by the power of z in front. Pick the term that ends up as z⁻¹.',
   'On 0 < |z| < c, write 1 ÷ (z + c) = (1 ÷ c) × 1 ÷ (1 + z ÷ c), expand that as a geometric series in −z ÷ c with alternating signs, and then multiply every term by the factor in front.'],
  solution: `Putting w = ${n(a)} ÷ z in the series of eʷ gives e^(${n(a)} ÷ z) = Σ ${par(a)}ⁿz⁻ⁿ ÷ n!, summed over n = 0, 1, 2, … Multiplying by z${sup(m)} raises every power by ${n(m)}, so the z⁻¹ term comes from n = ${n(N)}: its coefficient is ${par(a)}${sup(N)} ÷ ${n(N)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : ''}. For g, |z| < ${n(c)} means |z ÷ ${n(c)}| < 1, so 1 ÷ (z + ${n(c)}) = (1 ÷ ${n(c)})(1 − z ÷ ${n(c)} + z² ÷ ${n(c * c)} − …). Multiplying by ${n(K)} ÷ z gives g(z) = (${n(K)} ÷ ${n(c)})z⁻¹ − ${par(K)} ÷ ${n(c * c)} + … The z⁻¹ coefficient is ${par(K)} ÷ ${n(c)} = ${n(r1)} and the z⁰ coefficient is −${par(K)} ÷ ${n(c * c)} = ${n(r0)}.`,
  guidance: [
   { prompt: `The series of e^(${n(a)} ÷ z) has terms ${par(a)}ⁿz⁻ⁿ ÷ n!. Which n gives the term that becomes z⁻¹ once it is multiplied by z${sup(m)}?`, answer: [N], explanation: `z${sup(m)} × z⁻ⁿ = z to the power ${n(m)} − n, which is z⁻¹ when n = ${n(N)}.` },
   { prompt: `On 0 < |z| < ${n(c)}, g(z) = ${n(K)} ÷ z × 1 ÷ (z + ${n(c)}) and 1 ÷ (z + ${n(c)}) = (1 ÷ ${n(c)})(1 − z ÷ ${n(c)} + …). What is the coefficient of z⁻¹ in g?`, answer: [r1], explanation: `The first term is ${n(K)} ÷ z × (1 ÷ ${n(c)}), so the z⁻¹ coefficient is ${par(K)} ÷ ${n(c)} = ${n(r1)}.` },
   { prompt: `What is the coefficient of z⁰ in g, the constant term?`, answer: [r0], explanation: `The next term is ${n(K)} ÷ z × (1 ÷ ${n(c)}) × (−z ÷ ${n(c)}), a constant: −${par(K)} ÷ ${n(c * c)} = ${n(r0)}.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'The combined echo',
 brief: 'Two echo signals are added in the archive, and the crew needs the two leading coefficients of the combined signal at 0.',
 labels: ['coefficient of z⁻¹ in s', 'coefficient of z⁰ in s'], tolerance: 0.01,
 gl: [['coefficient of z⁻¹ in the first part'], ['coefficient of z⁻¹ in s'], ['coefficient of z⁰ in s']]
}, {
 /* s(z) = A zᵐ e^(a ÷ z) + K ÷ (z(z − c)) on 0 < |z| < |c|, A = t(m+1)!, K = jc². First part: z⁻¹ coefficient t a^(m+1), z⁰ coefficient t(m+1)aᵐ.
    Second part: z⁻¹ coefficient −K ÷ c = −jc, z⁰ coefficient −K ÷ c² = −j. Neither total is 0. */
 canonical: { m: 2, a: 2, t: -1, c: 3, j: 2 },
 draw: R => tries(() => ({ m: R.int(1, 3), a: R.pick([2, 3, -2, -3]), t: R.pick([1, 2, -1, -2]), c: R.pick([2, 3, 4, -2, -3, -4]), j: R.pick([1, 2, 3, -1, -2, -3]) }),
  p => { const N = p.m + 1; return p.t * Math.pow(p.a, N) - p.j * p.c !== 0 && p.t * N * Math.pow(p.a, p.m) - p.j !== 0 && !(p.m === 1 && p.a === 3 && p.t === 1); },
  { m: 2, a: 2, t: -1, c: 3, j: 2 }),
 build: ({ m, a, t, c, j }) => { const N = m + 1, A = t * fact(N), K = j * c * c, h1 = t * Math.pow(a, N), g1 = -j * c, tot1 = h1 + g1, h0 = t * N * Math.pow(a, m), g0 = -j, tot0 = h0 + g0, C = Math.abs(c),
  zm = m === 1 ? 'z' : `z${sup(m)}`, gz = `${n(K)} ÷ (z(${fac(c)}))`; return {
  prompt: `The archive adds two echo signals into one: s(z) = ${n(A)}${zm} e^(${n(a)} ÷ z) ${sgn(K)} ${n(Math.abs(K))} ÷ (z(${fac(c)})), on the annulus 0 < |z| < ${n(C)}. Laurent series add term by term, so each coefficient of s is the sum of the same coefficients of the two parts. Enter the coefficient of z⁻¹ in the Laurent series of s on that annulus, then the coefficient of z⁰. Type numbers without commas.`,
  answer: [tot1, tot0],
  hints: ['In eʷ = 1 + w + w² ÷ 2! + w³ ÷ 3! + …, put w = a ÷ z and multiply every term by the number and the power of z in front. Find which terms end up as z⁻¹ and as z⁰.',
   'For the second part, on 0 < |z| < |c| write 1 ÷ (z − c) = −(1 ÷ c) × 1 ÷ (1 − z ÷ c), expand as a geometric series in z ÷ c, and multiply every term by the factor in front.'],
  solution: `First part: e^(${n(a)} ÷ z) = Σ ${par(a)}ⁿz⁻ⁿ ÷ n!. Multiplying by ${n(A)}${zm}, the z⁻¹ term comes from n = ${n(N)} and the z⁰ term from n = ${n(m)}. The z⁻¹ coefficient is ${par(A)} × ${par(a)}${sup(N)} ÷ ${n(N)}! = ${n(h1)} and the z⁰ coefficient is ${par(A)} × ${par(a)}${sup(m)} ÷ ${n(m)}! = ${n(h0)}. Second part: |z| < ${n(C)} means |z ÷ ${par(c)}| < 1, so 1 ÷ (z − ${par(c)}) = −(1 ÷ ${par(c)})(1 + z ÷ ${par(c)} + …). Multiplying by ${n(K)} ÷ z gives −(${n(K)} ÷ ${par(c)})z⁻¹ − ${par(K)} ÷ ${n(c * c)} − …, so its z⁻¹ coefficient is ${n(g1)} and its z⁰ coefficient is ${n(g0)}. Adding: the z⁻¹ coefficient of s is ${n(h1)} ${plus(g1)} = ${n(tot1)} and the z⁰ coefficient is ${n(h0)} ${plus(g0)} = ${n(tot0)}.`,
  guidance: [
   { prompt: `In ${n(A)}${zm} e^(${n(a)} ÷ z), the z⁻¹ term comes from n = ${n(N)} in the series ${par(a)}ⁿz⁻ⁿ ÷ n!. What is the coefficient of z⁻¹ in this first part, that is ${par(A)} × ${par(a)}${sup(N)} ÷ ${n(N)}!?`, answer: [h1], explanation: `${par(a)}${sup(N)} = ${n(Math.pow(a, N))} and ${n(N)}! = ${n(fact(N))}, so ${par(A)} × ${n(Math.pow(a, N))} ÷ ${n(fact(N))} = ${n(h1)}.` },
   { prompt: `As in the Laurent lesson, the second part ${gz} has z⁻¹ coefficient −${par(K)} ÷ ${par(c)} on this annulus. Add it to the first part’s ${n(h1)}. What is the coefficient of z⁻¹ in s?`, answer: [tot1], explanation: `−${par(K)} ÷ ${par(c)} = ${n(g1)}, so the total is ${n(h1)} ${plus(g1)} = ${n(tot1)}.` },
   { prompt: `The z⁰ term of the first part comes from n = ${n(m)}: it is ${par(A)} × ${par(a)}${sup(m)} ÷ ${n(m)}!. The z⁰ term of the second part is −${par(K)} ÷ ${n(c * c)}. What is the coefficient of z⁰ in s?`, answer: [tot0], explanation: `The first part gives ${n(h0)} and the second gives ${n(g0)}, so the total is ${n(tot0)}.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q32', title: 'Dividing by a power of z',
 brief: 'Two signals are a smooth series divided by a power of z, and the crew needs the z⁻¹ coefficient of each.',
 labels: ['numerator', 'denominator', 'coefficient of z⁻¹ in g'], tolerance: 0.01,
 gl: [['n'], ['aⁿ'], ['coefficient of z⁻¹ in g']]
}, {
 /* f = e^(az) ÷ zᵏ: the z⁻¹ coefficient is a^(k−1) ÷ (k−1)!, lowest terms with denominator above 1. g = 1 ÷ (zᵐ(1 − bz)) on 0 < |z| < 1 ÷ |b|:
    z⁻¹ coefficient b^(m−1). */
 canonical: { a: -3, k: 4, b: 2, m: 3 },
 draw: R => tries(() => ({ a: R.pick([2, 3, 4, -2, -3, -4]), k: R.int(3, 5), b: R.pick([2, 3, 4, 5, -2, -3, -4, -5]), m: R.int(2, 4) }),
  p => { const top = Math.pow(p.a, p.k - 1), bot = fact(p.k - 1); return bot / gcd(top, bot) > 1; },
  { a: -3, k: 4, b: 2, m: 3 }),
 build: ({ a, k, b, m }) => { const N = k - 1, top = Math.pow(a, N), bot = fact(N), g = gcd(top, bot), num = top / g, den = bot / g, bc = Math.pow(b, m - 1), B = Math.abs(b),
  gText = `${m === 1 ? 'z' : `z${sup(m)}`}(1 ${b > 0 ? '−' : '+'} ${n(B)}z)`; return {
  prompt: `Two archive signals blow up at z = 0. Signal F is f(z) = e^(${n(a)}z) ÷ z${sup(k)}, for every z ≠ 0. Signal G is g(z) = 1 ÷ (${gText}), on the annulus 0 < |z| < 1 ÷ ${n(B)}. Use the Taylor series of e^(az) about 0, whose coefficient of zⁿ is aⁿ ÷ n!, and the geometric series 1 ÷ (1 − w) = 1 + w + w² + …, then divide by the power of z in front. Enter the coefficient of z⁻¹ in the Laurent series of f as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z⁻¹ in the Laurent series of g on that annulus. Type numbers without commas.`,
  answer: [num, den, bc],
  hints: ['Dividing a series by zᵏ lowers every power by k. A term zⁿ in the series becomes zⁿ⁻ᵏ, so find the n for which n − k = −1.',
   'Write 1 − bz as 1 − w with w = bz. The series of 1 ÷ (1 − w) in powers of z has coefficients bⁿ, and the factor in front moves every power down by its exponent.'],
  solution: `The Taylor series of e^(${n(a)}z) is Σ ${par(a)}ⁿzⁿ ÷ n!. Dividing by z${sup(k)} turns zⁿ into z to the power n − ${n(k)}, which is z⁻¹ when n = ${n(N)}. The coefficient is ${par(a)}${sup(N)} ÷ ${n(N)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : ''}. For g, 1 ÷ (${gText}) = (1 ÷ z${sup(m)}) × 1 ÷ (1 − w) with w = ${n(b)}z. For |z| < 1 ÷ ${n(B)} the geometric series gives 1 ÷ (1 − w) = Σ ${par(b)}ⁿzⁿ. Dividing by z${sup(m)} turns zⁿ into z to the power n − ${n(m)}, which is z⁻¹ when n = ${n(m - 1)}. The coefficient is ${par(b)}${sup(m - 1)} = ${n(bc)}.`,
  guidance: [
   { prompt: `Dividing by z${sup(k)} lowers every power of z by ${n(k)}. Which n gives the term zⁿ that becomes z⁻¹ in the series of e^(${n(a)}z) ÷ z${sup(k)}?`, answer: [N], explanation: `zⁿ ÷ z${sup(k)} = z to the power n − ${n(k)}, which is −1 when n = ${n(N)}.` },
   { prompt: `The coefficient of z${sup(N)} in e^(${n(a)}z) is ${par(a)}${sup(N)} ÷ ${n(N)}!. What is ${par(a)}${sup(N)}?`, answer: [top], explanation: `${par(a)}${sup(N)} = ${n(top)} and ${n(N)}! = ${n(bot)}, so the coefficient of z⁻¹ in f is ${n(top)} ÷ ${n(bot)}${g > 1 ? ` = ${n(num)} ÷ ${n(den)}` : ''}.` },
   { prompt: `In g, 1 ÷ (1 ${b > 0 ? '−' : '+'} ${n(B)}z) = 1 + w + w² + … with w = ${n(b)}z, and the factor 1 ÷ z${sup(m)} lowers every power by ${n(m)}. What is the coefficient of z⁻¹ in g?`, answer: [bc], explanation: `The z⁻¹ term comes from w${sup(m - 1)} = (${n(b)}z)${sup(m - 1)}, so the coefficient is ${par(b)}${sup(m - 1)} = ${n(bc)}.` }
  ] }; }
});

/* ---- q34 Poles and their order [8.9] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'Resonances in the antenna feed',
 brief: 'An antenna feed has two trouble points and a sensor reading with a pole at 0, and the crew must sort each by how badly it blows up.',
 labels: ['order of the pole at a', 'order of the pole at c', 'order of the pole at 0'], tolerance: 0.01,
 gl: [['order at a'], ['order at c'], ['lowest power of z']]
}, {
 /* f = (z − c)ʳ ÷ ((z − a)ᵐ (z − c)ˢ) with 1 ≤ r < s: pole of order m at a and of order s − r at c. t(z) = (z sin z) ÷ zᵖ = z^(2−p) − …: order p − 2. */
 canonical: { a: 3, m: 2, c: -2, r: 1, s: 3, p: 5 },
 draw: R => tries(() => { const a = R.int(-5, 5), c = R.except(-5, 5, [a]), r = R.int(1, 2); return { a, m: R.int(1, 4), c, r, s: r + R.int(1, 3), p: R.int(3, 6) }; },
  p => p.a !== p.c, { a: 3, m: 2, c: -2, r: 1, s: 3, p: 5 }),
 build: ({ a, m, c, r, s, p }) => { const left = s - r, lowest = 2 - p, f = `${pw(c, r)} ÷ (${pw(a, m)}${pw(c, s)})`; return {
  prompt: `An antenna feed has the transfer function f(z) = ${f}. Enter the order of its pole at z = ${n(a)}, then the order of its pole at z = ${n(c)}. A sensor on the feed reads t(z) = (z sin z) ÷ z${sup(p)}: enter the order of its pole at z = 0.`,
  answer: [m, left, p - 2],
  hints: ['The order of a pole at a is the power of (z − a) left on the bottom once any factor that also appears on the top has cancelled. If a factor is on the top r times and on the bottom s times, then s − r copies stay on the bottom.',
   'Expand sin z as z − z³ ÷ 3! + z⁵ ÷ 5! − …, multiply by z, and divide each term by the power of z on the bottom. The most negative power left gives the order.'],
  solution: `Near z = ${n(a)}, the rest of f, ${pw(c, r)} ÷ ${pw(c, s)}, is analytic and not 0, so f is a non-zero analytic function divided by ${pw(a, m)}: a pole of order ${n(m)}. At z = ${n(c)}, the top has the factor ${fac(c)} ${n(r)} ${r === 1 ? 'time' : 'times'} and the bottom has it ${n(s)} times, so ${n(r)} cancel and ${n(left)} ${left === 1 ? 'stays' : 'stay'} on the bottom: f(z) = 1 ÷ (${pw(a, m)}${pw(c, left)}) for z ≠ ${n(c)}, a pole of order ${n(left)}. For t, z sin z = z² − z⁴ ÷ 3! + z⁶ ÷ 5! − …, so dividing by z${sup(p)} gives t(z) = z${supAll(lowest)} − z${supAll(4 - p)} ÷ 6 + … The most negative power is z${supAll(lowest)}, so t has a pole of order ${n(p - 2)} at 0.`,
  guidance: [
   { prompt: `What power of ${fac(a)} is on the bottom of f, with nothing on the top to cancel it?`, answer: [m], explanation: `The bottom has ${pw(a, m)} and the top is not 0 at z = ${n(a)}, so the pole at ${n(a)} has order ${n(m)}.` },
   { prompt: `The factor ${fac(c)} is on the top ${n(r)} ${r === 1 ? 'time' : 'times'} and on the bottom ${n(s)} times. How many copies stay on the bottom once they cancel?`, answer: [left], explanation: `${n(s)} − ${n(r)} = ${n(left)}, so the pole at ${n(c)} has order ${n(left)}.` },
   { prompt: `In the series of t(z) = (z sin z) ÷ z${sup(p)}, the first term of z sin z is z². What is the lowest power of z in t? Enter its exponent.`, answer: [lowest], explanation: `z² ÷ z${sup(p)} = z${supAll(lowest)}. So the lowest power is ${n(lowest)}, and the pole has order ${n(p - 2)}.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Two filters in a chain',
 brief: 'Two filters are chained on one signal line, and the crew must say how the pole of the first one changes once the second one is added.',
 labels: ['order of the pole of f at a', 'power of (z − a) on top of g', 'order of the pole of fg at a'], tolerance: 0.01,
 gl: [['order of the pole of f'], ['power of (z − a) on top of g'], ['order of the pole of fg']]
}, {
 /* f = (z − b) ÷ ((z − a)ᵐ (z − c)), g = (z − a)ʳ ÷ (z − e) with 1 ≤ r < m, b, c, e all different from a. The chain fg has order m − r at a. */
 canonical: { a: 2, m: 4, b: -1, c: 3, r: 1, e: -3 },
 draw: R => tries(() => { const a = R.int(-5, 5), m = R.int(2, 5); return { a, m, b: R.except(-5, 5, [a]), c: R.except(-5, 5, [a]), r: R.int(1, m - 1), e: R.except(-5, 5, [a]) }; },
  p => p.b !== p.a && p.c !== p.a && p.e !== p.a, { a: 2, m: 4, b: -1, c: 3, r: 1, e: -3 }),
 build: ({ a, m, b, c, r, e }) => { const left = m - r, gT = `${pw(a, r)} ÷ ${pw(e, 1)}`,
  fTop = b === 0 ? 'z' : `(${fac(b)})`, fText = `${fTop} ÷ (${pw(a, m)}${pw(c, 1)})`; return {
  prompt: `Two filters are chained on one signal line, so the line’s formula is the product f(z) × g(z). Filter f is f(z) = ${fText} and filter g is g(z) = ${gT}. Enter the order of the pole of f at z = ${n(a)}. Then enter how many times the factor ${fac(a)} is on the top of g. Then enter the order of the pole of the product f(z)g(z) at z = ${n(a)}. In the product, everything except the factors ${fac(a)} is analytic and not 0 at z = ${n(a)}.`,
  answer: [m, r, left],
  hints: ['The order of a pole at a is the power of (z − a) left on the bottom once any factor that also appears on the top has cancelled.',
   'In a product, the top of g and the bottom of f are multiplied together as one fraction, so copies of the same factor on the top and on the bottom cancel in pairs; count what is left on the bottom.'],
  solution: `Near z = ${n(a)}, the rest of f, ${fTop} ÷ ${pw(c, 1)}, is analytic and not 0, so f has a pole of order ${n(m)} there. The top of g is ${pw(a, r)}, so the factor ${fac(a)} is on the top ${n(r)} ${r === 1 ? 'time' : 'times'}. In the product, ${n(r)} of the ${n(m)} copies of ${fac(a)} on the bottom cancel with the ${n(r)} on the top, so ${n(left)} ${left === 1 ? 'copy stays' : 'copies stay'} on the bottom and the rest is analytic and not 0: the product has a pole of order ${n(m)} − ${n(r)} = ${n(left)} at ${n(a)}.`,
  guidance: [
   { prompt: `What power of ${fac(a)} is on the bottom of f, with nothing on the top of f to cancel it?`, answer: [m], explanation: `The bottom of f has ${pw(a, m)} and the top ${fTop} is not 0 at z = ${n(a)}, so f has a pole of order ${n(m)} there.` },
   { prompt: `The top of g is ${pw(a, r)}. How many times does the factor ${fac(a)} appear on the top of g?`, answer: [r], explanation: `${pw(a, r)} is the factor ${fac(a)} ${n(r)} ${r === 1 ? 'time' : 'times'}.` },
   { prompt: `In the product, ${n(m)} copies of ${fac(a)} are on the bottom and ${n(r)} on the top. How many stay on the bottom after they cancel? That is the order of the pole of the product.`, answer: [left], explanation: `${n(m)} − ${n(r)} = ${n(left)}, so the product has a pole of order ${n(left)} at ${n(a)}.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', title: 'Three trouble points on one line',
 brief: 'A long feed line has three trouble points of different strength, and the crew must grade each one, calling a point harmless where it can be removed.',
 labels: ['order at a', 'order at c', 'order at e'], tolerance: 0.01,
 gl: [['order at a'], ['order at c'], ['order at e']]
}, {
 /* f = (z − c)ʳ ÷ ((z − a)ᵐ (z − c)ˢ (z − e)ᵗ) with 1 ≤ r ≤ s ≤ r + 2: order m at a, s − r at c (0 = removable when s = r), t at e. */
 canonical: { a: 1, m: 3, c: -2, r: 2, s: 3, e: 4, t: 2 },
 draw: R => tries(() => { const a = R.int(-4, 4), c = R.except(-4, 4, [a]), e = R.except(-4, 4, [a, c]), r = R.int(1, 3); return { a, m: R.int(1, 4), c, r, s: r + R.int(0, 2), e, t: R.int(1, 2) }; },
  p => p.a !== p.c && p.a !== p.e && p.c !== p.e, { a: 1, m: 3, c: -2, r: 2, s: 3, e: 4, t: 2 }),
 build: ({ a, m, c, r, s, e, t }) => { const left = s - r, f = `${pw(c, r)} ÷ (${pw(a, m)}${pw(c, s)}${pw(e, t)})`; return {
  prompt: `A long feed line has the transfer function f(z) = ${f}. It has trouble points at z = ${n(a)}, z = ${n(c)} and z = ${n(e)}. At each, find the order of the pole. Where the singularity is removable, so that there is no pole at all, enter 0. Enter the order at z = ${n(a)}, then at z = ${n(c)}, then at z = ${n(e)}.`,
  answer: [m, left, t],
  hints: ['At each point, count how many copies of its factor are on the top and how many on the bottom. The copies on the top cancel the same number of copies on the bottom; what stays on the bottom is the order of the pole.',
   'If no copy stays on the bottom, the singularity is removable and the answer for that point is 0.'],
  solution: `At z = ${n(a)} the top does not have the factor ${fac(a)} and the rest is analytic and not 0 there, so the bottom’s ${pw(a, m)} gives a pole of order ${n(m)}. At z = ${n(c)} the factor ${fac(c)} is on the top ${n(r)} ${r === 1 ? 'time' : 'times'} and on the bottom ${n(s)} ${s === 1 ? 'time' : 'times'}: ${n(s)} − ${n(r)} = ${n(left)}, ${left === 0 ? 'so nothing stays on the bottom and the singularity at ' + n(c) + ' is removable: enter 0' : `so ${n(left)} ${left === 1 ? 'copy stays' : 'copies stay'} on the bottom and the pole has order ${n(left)}`}. At z = ${n(e)} the top does not have the factor ${fac(e)}, so the bottom’s ${pw(e, t)} gives a pole of order ${n(t)}.`,
  guidance: [
   { prompt: `What power of ${fac(a)} is on the bottom, with nothing on the top to cancel it?`, answer: [m], explanation: `The bottom has ${pw(a, m)} and the top is not 0 at z = ${n(a)}, so the pole at ${n(a)} has order ${n(m)}.` },
   { prompt: `The factor ${fac(c)} is on the top ${n(r)} ${r === 1 ? 'time' : 'times'} and on the bottom ${n(s)} ${s === 1 ? 'time' : 'times'}. How many copies stay on the bottom (enter 0 if none)?`, answer: [left], explanation: `${n(s)} − ${n(r)} = ${n(left)}${left === 0 ? ', so the singularity at ' + n(c) + ' is removable' : `, so the pole at ${n(c)} has order ${n(left)}`}.` },
   { prompt: `What power of ${fac(e)} is on the bottom, with nothing on the top to cancel it?`, answer: [t], explanation: `The bottom has ${pw(e, t)} and the top is not 0 at z = ${n(e)}, so the pole at ${n(e)} has order ${n(t)}.` }
  ] }; }
});

/* ---- q35 Residues at simple poles [9.4] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The mirror-pole filter',
 brief: 'A filter in the control room has two poles that mirror each other about 0, and the crew needs the residue at each.',
 labels: ['residue at d', 'residue at −d'], tolerance: 0.01,
 gl: [['q′ at d'], ['residue at d'], ['residue at −d']]
}, {
 /* f = ((A + B)z + d(A − B)) ÷ (z² − d²): residue A at d and B at −d (A, B whole and not 0). */
 canonical: { d: 3, A: -2, B: 4 },
 draw: R => ({ d: R.int(1, 5), A: R.nz(-6, 6), B: R.nz(-6, 6) }),
 build: ({ d, A, B }) => { const al = A + B, be = d * (A - B), top = poly([[al, 1], [be, 0]]), topP = al !== 0 && be !== 0 ? `(${top})` : top, q = `z² − ${n(d * d)}`,
  pd = al * d + be, pnd = -al * d + be; return {
  prompt: `A filter in the control room has the transfer function f(z) = ${topP} ÷ (${q}). Its bottom is 0 at z = ${n(d)} and at z = −${n(d)}, and both are simple poles (the top is not 0 at either). Enter the residue of f at z = ${n(d)}, then the residue of f at z = −${n(d)}.`,
  answer: [A, B],
  hints: ['At a simple pole a of p(z) ÷ q(z), where p(a) is not 0, the residue is p(a) ÷ q′(a).',
   'Differentiate the bottom first: the derivative of z² − k is 2z. Then put each pole into the top and into q′.'],
  solution: `Here p(z) = ${top} and q(z) = ${q}, so q′(z) = 2z. At z = ${n(d)}: p(${n(d)}) = ${n(pd)} and q′(${n(d)}) = ${n(2 * d)}, so the residue is ${n(pd)} ÷ ${n(2 * d)} = ${n(A)}. At z = −${n(d)}: p(−${n(d)}) = ${n(pnd)} and q′(−${n(d)}) = ${n(-2 * d)}, so the residue is ${n(pnd)} ÷ ${par(-2 * d)} = ${n(B)}.`,
  guidance: [
   { prompt: `The bottom is q(z) = ${q}, so q′(z) = 2z. What is q′ at z = ${n(d)}?`, answer: [2 * d], explanation: `q′(${n(d)}) = 2 × ${n(d)} = ${n(2 * d)}.` },
   { prompt: `The top is p(z) = ${top}. Put in z = ${n(d)} and divide by q′(${n(d)}) = ${n(2 * d)}. What is the residue at z = ${n(d)}?`, answer: [A], explanation: `p(${n(d)}) = ${n(pd)}, and ${n(pd)} ÷ ${n(2 * d)} = ${n(A)}.` },
   { prompt: `Now the pole at z = −${n(d)}. What is the residue of f there?`, answer: [B], explanation: `p(−${n(d)}) = ${n(pnd)} and q′(−${n(d)}) = ${n(-2 * d)}, so the residue is ${n(pnd)} ÷ ${par(-2 * d)} = ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Finding the resonances first',
 brief: 'A transfer function is given with its bottom multiplied out, so the crew must find the poles before they can read the residues.',
 labels: ['larger pole', 'residue at the larger pole', 'residue at the smaller pole'], tolerance: 0.01,
 gl: [['larger pole'], ['residue at the larger pole'], ['residue at the smaller pole']]
}, {
 /* f = ((A + B)z − (As + Br)) ÷ (z² − (r + s)z + rs) with whole-number poles r > s: residue A at r and B at s (both not 0). */
 canonical: { r: 3, s: -2, A: 4, B: -3 },
 draw: R => tries(() => { const r = R.int(-6, 6); return { r, s: R.int(-6, 6), A: R.nz(-6, 6), B: R.nz(-6, 6) }; },
  p => p.r > p.s && p.r - p.s <= 9, { r: 3, s: -2, A: 4, B: -3 }),
 build: ({ r, s, A, B }) => { const al = A + B, be = -(A * s + B * r), top = poly([[al, 1], [be, 0]]), topP = al !== 0 && be !== 0 ? `(${top})` : top,
  S = r + s, P = r * s, q = poly([[1, 2], [-S, 1], [P, 0]]), dq = poly([[2, 1], [-S, 0]]), pr = al * r + be, ps = al * s + be; return {
  prompt: `A resonance filter in the control room has the transfer function f(z) = ${topP} ÷ (${q}). Its bottom is 0 at two different integers (whole numbers that may be negative or 0), and both are simple poles. Find them, then enter the larger one. Then enter the residue of f at the larger pole, and the residue of f at the smaller pole.`,
  answer: [r, A, B],
  hints: ['A bottom z² + Bz + C is 0 at two numbers whose sum is −B and whose product is C. Find the pair, then use the rule for a simple pole: the residue at a is p(a) ÷ q′(a), where p(a) is not 0.',
   'Differentiate the bottom first: the derivative of z² + Bz + C is 2z + B. Then put each pole into the top and into q′.'],
  solution: `The bottom ${q} must factor as (z − ${par(r)})(z − ${par(s)}) with sum of the zeros ${n(S)} and product ${n(P)}: the zeros are ${n(r)} and ${n(s)}, and the larger is ${n(r)}. Here p(z) = ${top} and q′(z) = ${dq}. At z = ${n(r)}: p(${n(r)}) = ${n(pr)} and q′(${n(r)}) = ${n(r - s)}, so the residue is ${n(pr)} ÷ ${par(r - s)} = ${n(A)}. At z = ${n(s)}: p(${n(s)}) = ${n(ps)} and q′(${n(s)}) = ${n(s - r)}, so the residue is ${n(ps)} ÷ ${par(s - r)} = ${n(B)}.`,
  guidance: [
   { prompt: `The bottom ${q} has zeros whose sum is ${n(S)} and whose product is ${n(P)}. What is the larger zero?`, answer: [r], explanation: `The numbers ${n(r)} and ${n(s)} add to ${n(S)} and multiply to ${n(P)}, so the larger zero is ${n(r)}.` },
   { prompt: `With p(z) = ${top} and q′(z) = ${dq}, what is the residue of f at the larger pole z = ${n(r)}?`, answer: [A], explanation: `p(${n(r)}) = ${n(pr)} and q′(${n(r)}) = ${n(r - s)}, so the residue is ${n(pr)} ÷ ${par(r - s)} = ${n(A)}.` },
   { prompt: `What is the residue of f at the smaller pole z = ${n(s)}?`, answer: [B], explanation: `p(${n(s)}) = ${n(ps)} and q′(${n(s)}) = ${n(s - r)}, so the residue is ${n(ps)} ÷ ${par(s - r)} = ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q34', title: 'Three poles, one of them false',
 brief: 'A feed-line transfer function has three possible trouble points, and the crew must find the residue at each, noting any that turn out to be harmless.',
 labels: ['residue at 0', 'residue at d', 'residue at −d'], tolerance: 0.01,
 gl: [['residue at 0'], ['p(d)'], ['residue at −d']]
}, {
 /* f = ((A0 + A1 + A2)z² + d(A1 − A2)z − A0 d²) ÷ (z³ − d²z): residues A0 at 0, A1 at d, A2 at −d. A0 is not 0; A1 or A2 is 0 in about half of the draws
    (then the top is 0 at that point, the singularity is removable and the residue is 0). */
 canonical: { d: 2, A0: 3, A1: 0, A2: -2 },
 draw: R => { const w = R.int(0, 3), z = w === 1 ? 1 : w === 2 ? 2 : 0; return { d: R.int(1, 4), A0: R.nz(-5, 5), A1: z === 1 ? 0 : R.nz(-5, 5), A2: z === 2 ? 0 : R.nz(-5, 5) }; },
 build: ({ d, A0, A1, A2 }) => { const al = A0 + A1 + A2, be = d * (A1 - A2), ga = -A0 * d * d, top = poly([[al, 2], [be, 1], [ga, 0]]), q = `z³ − ${d === 1 ? '' : n(d * d)}z`,
  p0 = ga, pd = al * d * d + be * d + ga, pnd = al * d * d - be * d + ga; return {
  prompt: `A feed line has the transfer function f(z) = (${top}) ÷ (${q}). The bottom is z(z − ${n(d)})(z + ${n(d)}), so it is 0 at z = 0, z = ${n(d)} and z = −${n(d)}. At each of these points f has either a simple pole or a removable singularity (where the top is also 0). Enter the residue of f at z = 0, then at z = ${n(d)}, then at z = −${n(d)}. Where the singularity is removable, the residue is 0.`,
  answer: [A0, A1, A2],
  hints: ['At a simple zero a of the bottom q, the residue is p(a) ÷ q′(a). If p(a) is also 0, the singularity is removable and the residue is 0.',
   'Differentiate the bottom: the derivative of z³ − kz is 3z² − k. Put each of the three points into the top and into q′.'],
  solution: `Here p(z) = ${top} and q(z) = ${q}, so q′(z) = 3z² − ${n(d * d)}. At z = 0: p(0) = ${n(p0)} and q′(0) = ${n(-d * d)}, so the residue is ${n(p0)} ÷ ${par(-d * d)} = ${n(A0)}. At z = ${n(d)}: p(${n(d)}) = ${n(pd)} and q′(${n(d)}) = ${n(2 * d * d)}, so the residue is ${n(pd)} ÷ ${n(2 * d * d)} = ${n(A1)}${A1 === 0 ? ' (the top is 0 there, so the singularity is removable)' : ''}. At z = −${n(d)}: p(−${n(d)}) = ${n(pnd)} and q′(−${n(d)}) = ${n(2 * d * d)}, so the residue is ${n(pnd)} ÷ ${n(2 * d * d)} = ${n(A2)}${A2 === 0 ? ' (the top is 0 there, so the singularity is removable)' : ''}.`,
  guidance: [
   { prompt: `With q′(z) = 3z² − ${n(d * d)}, q′(0) = ${n(-d * d)}. Put z = 0 in the top and divide. What is the residue of f at z = 0?`, answer: [A0], explanation: `p(0) = ${n(p0)}, and ${n(p0)} ÷ ${par(-d * d)} = ${n(A0)}.` },
   { prompt: `What is the top p(z) at z = ${n(d)}? (If it is 0, the singularity there is removable.)`, answer: [pd], explanation: `p(${n(d)}) = ${n(pd)}, and q′(${n(d)}) = ${n(2 * d * d)}, so the residue at ${n(d)} is ${n(A1)}${A1 === 0 ? ': the singularity is removable' : ''}.` },
   { prompt: `What is the residue of f at z = −${n(d)}?`, answer: [A2], explanation: `p(−${n(d)}) = ${n(pnd)} and q′(−${n(d)}) = ${n(2 * d * d)}, so the residue is ${n(pnd)} ÷ ${n(2 * d * d)} = ${n(A2)}${A2 === 0 ? ': the singularity is removable' : ''}.` }
  ] }; }
});

})();
