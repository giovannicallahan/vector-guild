/* Complex analysis: the plane of numbers mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Superscripts: sup(3) is '³', sup(−2) is '⁻²', sup(1) is '' (no written power 1). */
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = k => k === 1 ? '' : String(k).split('').map(ch => SUP[ch]).join('');
const supAll = k => String(k).split('').map(ch => SUP[ch]).join('');   // also writes ¹ and ⁰
const sgn = v => v < 0 ? '−' : '+';
/* A term with its sign for the middle of a sum: trm(−1, 'z') is '− z', trm(3, 'z²') is '+ 3z²'; cst(−4) is '− 4'. */
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* A leading term: lead(−1, 'z') is '−z', lead(3, 'z') is '3z'. */
const lead = (v, x) => `${v < 0 ? '−' : ''}${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
/* A sum of terms [[coefficient, power of z], …], highest first, zero terms left out: poly([[1, 3], [−2, 2], [5, 1], [1, 0]]) is 'z³ − 2z² + 5z + 1'. */
const zp = k => k === 0 ? '' : k === 1 ? 'z' : `z${sup(k)}`;
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, k], i) => k === 0 ? (i ? cst(c) : n(c)) : (i ? trm(c, zp(k)) : lead(c, zp(k)))).join(' '); };
/* Complex numbers as points [x, y]. cx([3, −4]) is '3 − 4i', cx([0, 1]) is 'i', cx([0, −2]) is '−2i'. */
const imag = y => y === 1 ? 'i' : y === -1 ? '−i' : `${n(y)}i`;
const cx = ([x, y]) => y === 0 ? n(x) : x === 0 ? imag(y) : `${n(x)} ${sgn(y)} ${Math.abs(y) === 1 ? '' : n(Math.abs(y))}i`;
const mod = ([x, y]) => Math.sqrt(x * x + y * y);
/* The factor z − p: fac([2, 0]) is 'z − 2', fac([0, −4]) is 'z + 4i', fac([3, 4]) is 'z − 3 − 4i', fac([0, 0]) is 'z'. */
const fac = p => { const [x, y] = p; if (x === 0 && y === 0) return 'z';
 if (y === 0) return `z ${x > 0 ? '−' : '+'} ${n(Math.abs(x))}`;
 if (x === 0) return `z ${y > 0 ? '−' : '+'} ${imag(Math.abs(y))}`;
 return `z ${x > 0 ? '−' : '+'} ${n(Math.abs(x))} ${y > 0 ? '−' : '+'} ${Math.abs(y) === 1 ? '' : n(Math.abs(y))}i`; };
/* (z − p) to the power k, ready to multiply: pw([2, 0], 3) is '(z − 2)³', pw([0, 0], 2) is 'z²', pw([1, 0], 1) is '(z − 1)'. */
const pw = (p, k) => p[0] === 0 && p[1] === 0 ? `z${sup(k)}` : `(${fac(p)})${sup(k)}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const ord = k => { const t = k % 100; return `${k}${t >= 11 && t <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] || 'th'}`; };
const same = (p, q) => p[0] === q[0] && p[1] === q[1];
/* Points with whole-number moduli for poles and zeros: ±m and ±mi for m = 1 … 6, and the four 3 ± 4i, −3 ± 4i (modulus 5). */
const POINTS = [];
for (let m = 1; m <= 6; m++) POINTS.push([m, 0], [-m, 0], [0, m], [0, -m]);
POINTS.push([3, 4], [3, -4], [-3, 4], [-3, -4]);
/* q31: test points with whole-number moduli 1 to 13. */
const TEST = [];
for (let m = 1; m <= 12; m++) TEST.push([m, 0], [-m, 0], [0, m], [0, -m]);
for (const [x, y] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]) TEST.push([x, y], [-x, y], [x, -y], [-x, -y]);
/* q39: a² − b² = s² with 0 < b < a. */
const TRIPLES = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [17, 15, 8], [25, 7, 24], [25, 24, 7], [15, 9, 12], [15, 12, 9], [20, 12, 16], [20, 16, 12]];
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const nk = k => k === 1 ? 'n' : `n${sup(k)}`;
const rootOf = v => `√${n(v)}`;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Σ aₙzⁿ with aₙ = nᵏ ÷ bⁿ: the ratio test gives R = b. The test point z₀ has a whole-number modulus that is never b,
    so it is strictly inside or strictly outside the disc. Not the worked example (n ÷ 3ⁿ at 2i). */
 q31: {
  canonical: { k: 2, b: 6, x: 3, y: 4 },
  draw: R => tries(() => { const z = R.pick(TEST); return { k: R.int(1, 3), b: R.int(2, 9), x: z[0], y: z[1] }; },
   p => mod([p.x, p.y]) !== p.b && !(p.k === 1 && p.b === 3 && p.x === 0 && p.y === 2), { k: 2, b: 6, x: 3, y: 4 }),
  build: ({ k, b, x, y }) => { const m = mod([x, y]), conv = m < b ? 1 : 0, z0 = cx([x, y]),
   ratio = k === 1 ? '(n + 1) ÷ n' : `((n + 1) ÷ n)${sup(k)}`,
   modT = x === 0 || y === 0 ? `|${z0}| = ${n(m)}` : `√(${par(x)}² + ${par(y)}²) = ${rootOf(m * m)} = ${n(m)}`; return {
   prompt: `The signal archive stores a signal as the power series Σ aₙzⁿ, summed over n = 1, 2, 3, … without end, with coefficients aₙ = ${nk(k)} ÷ ${n(b)}ⁿ. Use the ratio test to find its radius of convergence R, and enter it. Then enter the modulus |z₀| of the test point z₀ = ${z0}, and enter 1 if the series converges at z₀ or 0 if it diverges there.`,
   answer: [b, m, conv],
   hints: ['Divide the size of term n + 1 by the size of term n, |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ|, and let n grow. The series converges where that limit is less than 1 and diverges where it is more than 1.', 'The modulus of x + yi is √(x² + y²). A point closer to 0 than R lies inside the disc of convergence; a point farther away lies outside it.'],
   solution: `The sizes of neighbouring terms have the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × |z| ÷ ${n(b)}. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to |z| ÷ ${n(b)}. That is less than 1 exactly when |z| < ${n(b)}, so the radius of convergence is R = ${n(b)}. The test point has |z₀| = ${modT}. ${conv ? `${n(m)} is less than ${n(b)}, so z₀ lies inside the disc of convergence and the series converges there: enter 1.` : `${n(m)} is more than ${n(b)}, so z₀ lies outside the disc of convergence, the terms do not shrink to 0 and the series diverges there: enter 0.`}`,
   guidance: [
    { prompt: `As n grows, the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ${ratio} × |z| ÷ ${n(b)} tends to |z| ÷ ${n(b)}. The series converges where this limit is less than 1. What is the radius of convergence R?`, answer: [b], explanation: `|z| ÷ ${n(b)} < 1 exactly when |z| < ${n(b)}, so R = ${n(b)}: the series converges on the open disc |z| < ${n(b)} and diverges outside it.` },
    { prompt: `What is the modulus of the test point z₀ = ${z0}?`, answer: [m], explanation: `|z₀| = ${modT}, its distance from 0.` },
    { prompt: `Compare |z₀| = ${n(m)} with R = ${n(b)}. Enter 1 if the series converges at z₀, 0 if it diverges there.`, answer: [conv], explanation: conv ? `${n(m)} < ${n(b)}: z₀ is inside the disc of convergence, so the series converges there.` : `${n(m)} > ${n(b)}: z₀ is outside the disc of convergence, so the series diverges there.` }
   ] }; }
 },
 /* Coefficient of zᵏ in e^(az) is aᵏ ÷ k!, kept as a fraction with denominator above 1; coefficient of zᵐ in
    1 ÷ (1 − bz) is bᵐ, below 1000 in size. Not the worked example (e^(2z) with z³, 1 ÷ (1 − 3z) with z²). */
 q32: {
  canonical: { a: 3, k: 4, b: -2, m: 5 },
  draw: R => tries(() => ({ a: R.pick([2, 3, 4, -2, -3, -4]), k: R.int(2, 5), b: R.pick([2, 3, 4, 5, -2, -3, -4, -5]), m: R.int(2, 5) }),
   p => { const top = Math.pow(p.a, p.k), bot = fact(p.k), g = gcd(top, bot); return bot / g > 1 && Math.abs(Math.pow(p.b, p.m)) < 1000 && !(p.a === 2 && p.k === 3) && !(p.b === 3 && p.m === 2); },
   { a: 3, k: 4, b: -2, m: 5 }),
  build: ({ a, k, b, m }) => { const top = Math.pow(a, k), bot = fact(k), g = gcd(top, bot), num = top / g, den = bot / g, bm = Math.pow(b, m),
   gText = `1 ÷ (1 ${b > 0 ? '−' : '+'} ${n(Math.abs(b))}z)`; return {
   prompt: `The archive rebuilds two signals out of simple powers of z. Signal F is f(z) = e^(${n(a)}z) and signal G is g(z) = ${gText}, each written as its Taylor series about z = 0. Enter the Taylor coefficient of z${sup(k)} in f as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z${sup(m)} in g.`,
   answer: [num, den, bm],
   hints: ['The Taylor coefficient of zⁿ about 0 is f⁽ⁿ⁾(0) ÷ n!. Each derivative of e^(az) brings down one more factor a.', 'Put w = bz in the geometric series 1 ÷ (1 − w) = 1 + w + w² + …; the coefficient of zⁿ is then bⁿ.'],
   solution: `Each derivative of e^(${n(a)}z) brings down another factor ${par(a)}, so f⁽ⁿ⁾(0) = ${par(a)}ⁿ and the coefficient of zⁿ is ${par(a)}ⁿ ÷ n!. For n = ${n(k)} it is ${par(a)}${sup(k)} ÷ ${n(k)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : `, already in lowest terms`}. For g, write ${gText} as 1 ÷ (1 − w) with w = ${n(b)}z. The geometric series 1 + w + w² + … gives g(z) = Σ ${par(b)}ⁿzⁿ for |z| < 1 ÷ ${n(Math.abs(b))}, so the coefficient of z${sup(m)} is ${par(b)}${sup(m)} = ${n(bm)}.`,
   guidance: [
    { prompt: `What is the ${ord(k)} derivative of f(z) = e^(${n(a)}z), at z = 0?`, answer: [top], explanation: `Each derivative multiplies by ${par(a)}, so the ${ord(k)} derivative is ${par(a)}${sup(k)}e^(${n(a)}z), which is ${n(top)} at z = 0.` },
    { prompt: `The Taylor coefficient divides that derivative by ${n(k)}!. What is ${n(k)}!?`, answer: [bot], explanation: `${n(k)}! = ${Array.from({ length: k }, (_, i) => i + 1).join(' × ')} = ${n(bot)}, so the coefficient is ${n(top)} ÷ ${n(bot)}${g > 1 ? ` = ${n(num)} ÷ ${n(den)}` : ''}.` },
    { prompt: `In g(z) = ${gText} = 1 + w + w² + … with w = ${n(b)}z, what is the coefficient of z${sup(m)}?`, answer: [bm], explanation: `The term w${sup(m)} is (${n(b)}z)${sup(m)} = ${par(b)}${sup(m)}z${sup(m)}, so the coefficient is ${n(bm)}.` }
   ] }; }
 },
 /* h(z) = zᵐ e^(a ÷ z): the z⁻¹ term comes from n = m + 1, coefficient a^(m+1) ÷ (m + 1)!, kept with denominator above 1.
    g(z) = K ÷ (z(z − c)) with K = jc² on 0 < |z| < |c|: z⁻¹ coefficient −K ÷ c = −jc, z⁰ coefficient −K ÷ c² = −j.
    Not the worked example (z e^(3 ÷ z); 8 ÷ (z(z − 2))). */
 q33: {
  canonical: { m: 2, a: 2, c: -2, j: 3 },
  draw: R => tries(() => ({ m: R.int(1, 3), a: R.pick([2, 3, 4, -2, -3, -4]), c: R.pick([2, 3, 4, 5, -2, -3, -4, -5]), j: R.pick([1, 2, 3, -1, -2, -3]) }),
   p => { const top = Math.pow(p.a, p.m + 1), bot = fact(p.m + 1); return bot / gcd(top, bot) > 1 && !(p.m === 1 && p.a === 3) && !(p.c === 2 && p.j === 2); },
   { m: 2, a: 2, c: -2, j: 3 }),
  build: ({ m, a, c, j }) => { const N = m + 1, top = Math.pow(a, N), bot = fact(N), g = gcd(top, bot), num = top / g, den = bot / g,
   K = j * c * c, r1 = -j * c, r0 = -j, h = `${m === 1 ? 'z' : `z${sup(m)}`} e^(${n(a)} ÷ z)`, gz = `${n(K)} ÷ (z(${fac([c, 0])}))`, C = Math.abs(c); return {
   prompt: `Two archive signals blow up at z = 0. Signal H is h(z) = ${h}, for every z ≠ 0. Signal G is g(z) = ${gz}, on the annulus 0 < |z| < ${n(C)}. Enter the coefficient of z⁻¹ in the Laurent series of h as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z⁻¹ and the coefficient of z⁰ in the Laurent series of g on that annulus.`,
   answer: [num, den, r1, r0],
   hints: ['In eʷ = 1 + w + w² ÷ 2! + w³ ÷ 3! + …, put w = a ÷ z, then multiply every term by the power of z in front. Pick the term that ends up as z⁻¹.', 'On 0 < |z| < |c|, write 1 ÷ (z − c) = −(1 ÷ c) × 1 ÷ (1 − z ÷ c), expand that as a geometric series in z ÷ c, and then divide every term by z.'],
   solution: `Putting w = ${n(a)} ÷ z in the series of eʷ gives e^(${n(a)} ÷ z) = Σ ${par(a)}ⁿz⁻ⁿ ÷ n!, summed over n = 0, 1, 2, … Multiplying by z${sup(m)} raises every power by ${n(m)}, so the z⁻¹ term comes from n = ${n(N)}: its coefficient is ${par(a)}${sup(N)} ÷ ${n(N)}! = ${n(top)} ÷ ${n(bot)}${g > 1 ? `, which is ${n(num)} ÷ ${n(den)} in lowest terms` : ''}. For g, |z| < ${n(C)} means |z ÷ ${par(c)}| < 1, so 1 ÷ (z − c) = −(1 ÷ c)(1 + z ÷ c + z² ÷ c² + …) with c = ${n(c)}. Multiplying by ${n(K)} ÷ z gives g(z) = −(${n(K)} ÷ ${par(c)})z⁻¹ − ${par(K)} ÷ ${n(c * c)} − … The z⁻¹ coefficient is −${par(K)} ÷ ${par(c)} = ${n(r1)} and the z⁰ coefficient is −${par(K)} ÷ ${n(c * c)} = ${n(r0)}.`,
   guidance: [
    { prompt: `The series of e^(${n(a)} ÷ z) has terms ${par(a)}ⁿz⁻ⁿ ÷ n!. Which n gives the term that becomes z⁻¹ once it is multiplied by z${sup(m)}?`, answer: [N], explanation: `z${sup(m)} × z⁻ⁿ = z to the power ${n(m)} − n, which is z⁻¹ when n = ${n(N)}.` },
    { prompt: `On 0 < |z| < ${n(C)}, g(z) = ${n(K)} ÷ z × 1 ÷ (z − c) with c = ${n(c)}, and 1 ÷ (z − c) = −(1 ÷ c)(1 + z ÷ c + …). What is the coefficient of z⁻¹ in g?`, answer: [r1], explanation: `The first term is ${n(K)} ÷ z × (−1 ÷ ${par(c)}), so the z⁻¹ coefficient is −${par(K)} ÷ ${par(c)} = ${n(r1)}.` },
    { prompt: `What is the coefficient of z⁰ in g, the constant term?`, answer: [r0], explanation: `The next term is ${n(K)} ÷ z × (−1 ÷ ${par(c)}) × z ÷ ${par(c)}, a constant: −${par(K)} ÷ ${n(c * c)} = ${n(r0)}.` }
   ] }; }
 },
 /* f(z) = (z − b) ÷ ((z − a)ᵐ(z − c)) with a, c distinct and b ≠ a. About half the draws have b = c, where the top cancels
    the bottom's factor and c is removable. s(z) = sin z ÷ zᵖ has a pole of order p − 1 at 0. Not the worked example. */
 q34: {
  canonical: { a: 2, m: 3, b: -1, c: -1, p: 3 },
  draw: R => tries(() => { const a = R.int(-5, 5), c = R.except(-5, 5, [a]), rem = R.bool(); return { a, m: R.int(1, 4), b: rem ? c : R.except(-5, 5, [a, c]), c, p: R.int(2, 5) }; },
   p => p.a !== p.c && p.b !== p.a && !(p.a === -1 && p.m === 2 && p.b === 4 && p.c === 5 && p.p === 4), { a: 2, m: 3, b: -1, c: -1, p: 3 }),
  build: ({ a, m, b, c, p }) => { const rem = b === c ? 1 : 0, top = fac([b, 0]), topP = b === 0 ? 'z' : `(${top})`, lowest = 1 - p,
   f = `${topP} ÷ (${pw([a, 0], m)}${pw([c, 0], 1)})`, A = fac([a, 0]), Cf = fac([c, 0]); return {
   prompt: `Two archive filters have singularities. Filter F is f(z) = ${f}. Enter the order of the pole of f at z = ${n(a)}. Then enter 1 if the singularity of f at z = ${n(c)} is removable, or 0 if it is not. Filter S is s(z) = sin z ÷ z${sup(p)}: enter the order of its pole at z = 0.`,
   answer: [m, rem, p - 1],
   hints: ['The order of a pole at a is the power of (z − a) left on the bottom once any factor that also appears on the top has cancelled.', 'Expand sin z as z − z³ ÷ 3! + z⁵ ÷ 5! − … and divide each term by the power of z on the bottom. The most negative power left gives the order.'],
   solution: `Near z = ${n(a)}, the rest of f, ${topP} ÷ ${pw([c, 0], 1)}, is analytic and not 0, so f is a non-zero analytic function divided by ${pw([a, 0], m)}: a pole of order ${n(m)}. ${rem ? `At z = ${n(c)} the top ${topP} is the same factor as ${pw([c, 0], 1)} on the bottom, so they cancel: f(z) = 1 ÷ ${pw([a, 0], m)} for z ≠ ${n(c)}, which has a finite value at ${n(c)}. The singularity there is removable: enter 1.` : `At z = ${n(c)} the top is ${n(c)} ${b < 0 ? '+' : '−'} ${n(Math.abs(b))} = ${n(c - b)}, not 0, so nothing cancels ${pw([c, 0], 1)} and f has a pole of order 1 there, not a removable singularity: enter 0.`} For s, sin z = z − z³ ÷ 3! + z⁵ ÷ 5! − …, so dividing by z${sup(p)} gives s(z) = z${supAll(lowest)} − ${3 - p === 0 ? '1' : 3 - p === 1 ? 'z' : `z${supAll(3 - p)}`} ÷ 6 + … The most negative power is z${supAll(lowest)}, so s has a pole of order ${n(p - 1)} at 0.`,
   guidance: [
    { prompt: `What power of ${pw([a, 0], 1)} is on the bottom of f, with nothing on the top to cancel it?`, answer: [m], explanation: `The bottom has ${pw([a, 0], m)} and the top ${topP} is not 0 at z = ${n(a)}, so the pole at ${n(a)} has order ${n(m)}.` },
    { prompt: `What is the value of the top, ${b === 0 ? 'z' : top}, at z = ${n(c)}?`, answer: [c - b], explanation: rem ? `It is ${n(c)} − ${par(b)} = 0: the top has the same factor as the bottom, so they cancel and the singularity at ${n(c)} is removable.` : `It is ${n(c)} − ${par(b)} = ${n(c - b)}, not 0, so the factor ${pw([c, 0], 1)} stays on the bottom and z = ${n(c)} is a simple pole.` },
    { prompt: `In the series of s(z) = sin z ÷ z${sup(p)}, what is the lowest power of z? Enter its exponent.`, answer: [lowest], explanation: `The first term of sin z is z, and z ÷ z${sup(p)} = z${supAll(lowest)}. So the lowest power is ${n(lowest)}, and the pole has order ${n(p - 1)}.` }
   ] }; }
 },
 /* f = A ÷ (z − r) + B ÷ (z − s) written as one fraction ((A + B)z − (As + Br)) ÷ (z² − (r + s)z + rs): residues A and B. */
 q35: {
  canonical: { r: 1, s: -3, A: 2, B: -5 },
  draw: R => { const r = R.int(-5, 5); return { r, s: R.except(-5, 5, [r]), A: R.except(-6, 6, [0]), B: R.except(-6, 6, [0]) }; },
  build: ({ r, s, A, B }) => { const al = A + B, be = -(A * s + B * r), top = poly([[al, 1], [be, 0]]), topP = al !== 0 && be !== 0 ? `(${top})` : top,
   q = poly([[1, 2], [-(r + s), 1], [r * s, 0]]), dq = poly([[2, 1], [-(r + s), 0]]), pr = al * r + be, ps = al * s + be; return {
   prompt: `A control-room transfer function is f(z) = ${topP} ÷ (${q}). Its bottom is 0 at z = ${n(r)} and at z = ${n(s)}, and both are simple poles. Enter the residue of f at z = ${n(r)}, then the residue of f at z = ${n(s)}.`,
   answer: [A, B],
   hints: ['At a simple pole a of p(z) ÷ q(z), where p(a) is not 0, the residue is p(a) ÷ q′(a).', 'Differentiate the bottom first: the derivative of z² + Bz + C is 2z + B. Then put each pole into the top and into q′.'],
   solution: `Here p(z) = ${top} and q(z) = ${q}, so q′(z) = ${dq}. At z = ${n(r)}: p(${n(r)}) = ${n(pr)} and q′(${n(r)}) = ${n(r - s)}, so the residue is ${n(pr)} ÷ ${par(r - s)} = ${n(A)}. At z = ${n(s)}: p(${n(s)}) = ${n(ps)} and q′(${n(s)}) = ${n(s - r)}, so the residue is ${n(ps)} ÷ ${par(s - r)} = ${n(B)}.`,
   guidance: [
    { prompt: `The bottom is q(z) = ${q}. What is q′(z) at z = ${n(r)}?`, answer: [r - s], explanation: `q′(z) = ${dq}, so q′(${n(r)}) = ${n(r - s)}.` },
    { prompt: `What is the top, p(z) = ${top}, at z = ${n(r)}?`, answer: [pr], explanation: `p(${n(r)}) = ${n(pr)}, so the residue at ${n(r)} is ${n(pr)} ÷ ${par(r - s)} = ${n(A)}.` },
    { prompt: `Now the second pole. What is the residue of f at z = ${n(s)}?`, answer: [B], explanation: `p(${n(s)}) = ${n(ps)} and q′(${n(s)}) = ${n(s - r)}, so the residue is ${n(ps)} ÷ ${par(s - r)} = ${n(B)}.` }
   ] }; }
 },
 /* g(z) = z³ + pz² + qz + r with g(a) ≠ 0. g ÷ (z − a)² has residue g′(a); g ÷ (z − a)³ has residue g″(a) ÷ 2 = 3a + p.
    Not the worked example (z³ + z at 1). */
 q36: {
  canonical: { a: 2, p: -2, q: 5, r: 1 },
  draw: R => tries(() => ({ a: R.int(-3, 3), p: R.int(-5, 5), q: R.int(-5, 5), r: R.int(-5, 5) }),
   ({ a, p, q, r }) => a * a * a + p * a * a + q * a + r !== 0 && !(a === 1 && p === 0 && q === 1 && r === 0) && 3 * a + p !== 0 && 3 * a * a + 2 * p * a + q !== 0, { a: 2, p: -2, q: 5, r: 1 }),
  build: ({ a, p, q, r }) => { const g = poly([[1, 3], [p, 2], [q, 1], [r, 0]]), g1 = poly([[3, 2], [2 * p, 1], [q, 0]]), g2 = poly([[6, 1], [2 * p, 0]]),
   ga = a * a * a + p * a * a + q * a + r, R2 = 3 * a * a + 2 * p * a + q, g2a = 6 * a + 2 * p, R3 = g2a / 2; return {
   prompt: `Two control-room filters share the top g(z) = ${g}. Filter A is f(z) = g(z) ÷ ${pw([a, 0], 2)}, with a pole of order 2 at z = ${n(a)}, and filter B is h(z) = g(z) ÷ ${pw([a, 0], 3)}, with a pole of order 3 there. Enter the residue of f at z = ${n(a)}, then the residue of h at z = ${n(a)}.`,
   answer: [R2, R3],
   hints: ['At a pole of order k at a, write the function as g(z) ÷ (z − a)ᵏ with g analytic at a. The residue is the (k − 1)th derivative of g at a, divided by (k − 1)!.', 'For order 2 that is g′(a) ÷ 1!; for order 3 it is g″(a) ÷ 2!.'],
   solution: `g(${n(a)}) = ${n(ga)}, not 0, so the orders really are 2 and 3. g′(z) = ${g1} and g″(z) = ${g2}. For f, of order 2: the residue is g′(${n(a)}) ÷ 1! = ${n(R2)}. For h, of order 3: the residue is g″(${n(a)}) ÷ 2! = ${n(g2a)} ÷ 2 = ${n(R3)}.`,
   guidance: [
    { prompt: `What is g(${n(a)})? If it is not 0, the orders of the poles really are 2 and 3.`, answer: [ga], explanation: `g(${n(a)}) = ${n(ga)}, which is not 0.` },
    { prompt: `What is g′(${n(a)})?`, answer: [R2], explanation: `g′(z) = ${g1}, so g′(${n(a)}) = ${n(R2)}. For the pole of order 2 that is the residue, since 1! = 1.` },
    { prompt: `What is g″(${n(a)})?`, answer: [g2a], explanation: `g″(z) = ${g2}, so g″(${n(a)}) = ${n(g2a)}. Dividing by 2! = 2 gives the residue of h, ${n(R3)}.` }
   ] }; }
 },
 /* f = A ÷ (z − p₁) + B ÷ (z − p₂) + C ÷ (z − p₃)² round |z| = R anticlockwise. Residues A, B and 0; k = 2 × (sum inside).
    No pole on the circle; at least one pole inside and one outside. Not the worked example. */
 q37: {
  canonical: { A: 3, x1: 1, y1: 0, B: -2, x2: 0, y2: 4, C: 5, x3: -2, y3: 0, R: 3 },
  draw: R => tries(() => { const P = [R.pick(POINTS), R.pick(POINTS), R.pick(POINTS)]; return { A: R.except(-5, 5, [0]), x1: P[0][0], y1: P[0][1], B: R.except(-5, 5, [0]), x2: P[1][0], y2: P[1][1], C: R.except(-5, 5, [0]), x3: P[2][0], y3: P[2][1], R: R.int(2, 6) }; },
   p => { const P = [[p.x1, p.y1], [p.x2, p.y2], [p.x3, p.y3]], M = P.map(mod), inside = M.filter(v => v < p.R).length;
    return !same(P[0], P[1]) && !same(P[0], P[2]) && !same(P[1], P[2]) && M.every(v => v !== p.R) && inside >= 1 && inside <= 2; },
   { A: 3, x1: 1, y1: 0, B: -2, x2: 0, y2: 4, C: 5, x3: -2, y3: 0, R: 3 }),
  build: ({ A, x1, y1, B, x2, y2, C, x3, y3, R }) => { const P = [[x1, y1], [x2, y2], [x3, y3]], M = P.map(mod), ins = M.map(v => v < R),
   res = [A, B, 0], N = ins.filter(Boolean).length, S = res.reduce((s, v, i) => s + (ins[i] ? v : 0), 0), k = 2 * S,
   term = (c, body, i) => i === 0 ? `${n(c)} ÷ ${body}` : ` ${sgn(c)} ${n(Math.abs(c))} ÷ ${body}`,
   f = term(A, `(${fac(P[0])})`, 0) + term(B, `(${fac(P[1])})`, 1) + term(C, `(${fac(P[2])})²`, 2),
   where = i => `${cx(P[i])}, modulus ${n(M[i])}, ${ins[i] ? 'inside' : 'outside'}`,
   insideList = [0, 1, 2].filter(i => ins[i]).map(i => `${n(res[i])} at ${cx(P[i])}`).join(' and '),
   kpi = k === 0 ? '0' : `${n(k)}πi`; return {
   prompt: `The control room needs ∮ f(z) dz once anticlockwise round the circle |z| = ${n(R)}, where f(z) = ${f}. Enter how many poles of f lie inside the circle, then the number k with ∮ f(z) dz = kπi.`,
   answer: [N, k],
   hints: ['Once anticlockwise round a closed curve, ∮ f(z) dz is 2πi times the sum of the residues of f at the poles inside the curve. Poles outside do not count.', 'A term A ÷ (z − p) has residue A at p. A term C ÷ (z − p)² has residue 0 there, because it has no (z − p)⁻¹ part.'],
   solution: `The poles are at ${where(0)}; ${where(1)}; and ${where(2)}. So ${n(N)} of them lie inside |z| = ${n(R)}. The residues are ${n(A)} at ${cx(P[0])}, ${n(B)} at ${cx(P[1])} and 0 at ${cx(P[2])}, because ${n(C)} ÷ (${fac(P[2])})² has no (z − p)⁻¹ part. The residues inside are ${insideList}, with sum ${n(S)}. By the residue theorem, ∮ f(z) dz = 2πi × ${par(S)} = ${kpi}, so k = ${n(k)}.`,
   guidance: [
    { prompt: `What is the residue of f at its double pole, z = ${cx(P[2])}?`, answer: [0], explanation: `Near ${cx(P[2])} the term ${n(C)} ÷ (${fac(P[2])})² has no (z − p)⁻¹ part, and the other two terms are analytic there, so the residue is 0.` },
    { prompt: `A pole is inside |z| = ${n(R)} when its modulus is less than ${n(R)}. How many of the three poles are inside?`, answer: [N], explanation: `The moduli are ${n(M[0])}, ${n(M[1])} and ${n(M[2])}, so ${n(N)} of them are less than ${n(R)}.` },
    { prompt: `What is the sum of the residues at the poles inside the circle?`, answer: [S], explanation: `The residues inside are ${insideList}, so the sum is ${n(S)}, and ∮ f(z) dz = 2πi × ${par(S)} = ${kpi}.` }
   ] }; }
 },
 /* I₁ = ∫ aj dx ÷ (x² + a²) = jπ; I₂ = ∫ pq(p + q)J dx ÷ ((x² + p²)(x² + q²)) = Jπ, with p < q. Not the worked example. */
 q38: {
  canonical: { a: 3, j: 2, p: 1, q: 3, J: 3 },
  draw: R => tries(() => { const p = R.int(1, 4); return { a: R.int(1, 6), j: R.int(1, 5), p, q: R.int(p + 1, 5), J: R.int(1, 3) }; },
   v => !(v.a === 2 && v.j === 2), { a: 3, j: 2, p: 1, q: 3, J: 3 }),
  build: ({ a, j, p, q, J }) => { const c = a * j, prod = p * q * (p + q), C = prod * J, ai = imag(a), pi = imag(p), qi = imag(q), imRes = -j / 2; return {
   prompt: `The control room needs two improper integrals along the whole real line, from −∞ to ∞: I₁ = ∫ ${n(c)} dx ÷ (x² + ${n(a * a)}) and I₂ = ∫ ${n(C)} dx ÷ ((x² + ${n(p * p)})(x² + ${n(q * q)})). Each equals a whole number times π. Enter k₁ with I₁ = k₁π, then k₂ with I₂ = k₂π.`,
   answer: [j, J],
   hints: ['Close the real line with a large semicircle in the upper half-plane. When the integrand shrinks like 1 ÷ |z|² or faster, the arc adds nothing in the limit, so the integral is 2πi times the sum of the residues in the upper half-plane.', 'x² + a² = (x − ai)(x + ai), so of its two zeros only ai lies in the upper half-plane. At a simple pole, the residue is p(a) ÷ q′(a).'],
   solution: `Close the real line with a large semicircle in the upper half-plane. Both integrands shrink like 1 ÷ |z|² or faster, so the arc's integral tends to 0 and each real integral is 2πi times the sum of the residues in the upper half-plane. For I₁ the only pole there is z = ${ai}, where the residue of ${n(c)} ÷ (z² + ${n(a * a)}) is p ÷ q′ = ${n(c)} ÷ (2z) at z = ${ai}, which is ${n(c)} ÷ (${n(2 * a)}i). So I₁ = 2πi × ${n(c)} ÷ (${n(2 * a)}i) = ${n(c)}π ÷ ${n(a)} = ${n(j)}π. For I₂ the poles in the upper half-plane are ${pi} and ${qi}. The residues are ${n(C)} ÷ (${n(2 * p)}i × ${n(q * q - p * p)}) at ${pi} and ${n(C)} ÷ (${n(2 * q)}i × (${n(p * p - q * q)})) at ${qi}. Adding them and multiplying by 2πi gives I₂ = ${n(C)}π ÷ (${n(p)} × ${n(q)} × ${n(p + q)}) = ${n(C)}π ÷ ${n(prod)} = ${n(J)}π.`,
   guidance: [
    { prompt: `The residue of ${n(c)} ÷ (z² + ${n(a * a)}) at z = ${ai} is ${n(c)} ÷ (${n(2 * a)}i). Since 1 ÷ i = −i, what is its imaginary part?`, answer: [imRes], explanation: `${n(c)} ÷ (${n(2 * a)}i) = −(${n(c)} ÷ ${n(2 * a)})i, with imaginary part ${n(imRes)}. Multiplying by 2πi gives 2π × ${n(c / (2 * a))} = ${n(j)}π.` },
    { prompt: `The bottom of I₂ is 0 at ±${pi} and ±${qi}. How many of these poles lie in the upper half-plane?`, answer: [2], explanation: `${pi} and ${qi} have positive imaginary parts; their opposites are in the lower half-plane.` },
    { prompt: `Adding the two residues and multiplying by 2πi gives ${n(C)}π ÷ (p × q × (p + q)) with p = ${n(p)} and q = ${n(q)}. What is p × q × (p + q)?`, answer: [prod], explanation: `${n(p)} × ${n(q)} × ${n(p + q)} = ${n(prod)}, so I₂ = ${n(C)}π ÷ ${n(prod)} = ${n(J)}π.` }
   ] }; }
 },
 /* ∫ from 0 to 2π of c dθ ÷ (a + b cos θ) = 2πc ÷ s with s = √(a² − b²) from a Pythagorean table and c = ks ÷ 2 whole.
    Not the worked example (1 ÷ (5 + 4 cos θ)). */
 q39: {
  canonical: { t: 0, neg: 0, k: 3 },
  draw: R => tries(() => ({ t: R.int(0, TRIPLES.length - 1), neg: R.int(0, 1), k: R.int(1, 6) }),
   v => (v.k * TRIPLES[v.t][2]) % 2 === 0 && !(v.t === 0 && v.neg === 0 && v.k === 3), { t: 0, neg: 0, k: 3 }),
  /* t is only an index into TRIPLES; neg = 1 makes b negative. */
  build: ({ t, neg, k }) => { const [a, b0, s] = TRIPLES[t], b = neg ? -b0 : b0, c = k * s / 2,
   den = `${n(a)} ${b < 0 ? '−' : '+'} ${n(b0)} cos θ`, quad = poly([[b, 2], [2 * a, 1], [b, 0]]); return {
   prompt: `A rotor sensor's reading needs I = ∫ from 0 to 2π of ${n(c)} dθ ÷ (${den}), with θ in radians. Enter √(${n(a)}² − ${n(b0)}²), then the whole number k with I = kπ.`,
   answer: [s, k],
   hints: ['Put z = e^(iθ). Then θ from 0 to 2π takes z once anticlockwise round |z| = 1, cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz).', 'The new bottom is a quadratic in z whose two roots multiply to 1, so exactly one root lies inside the unit circle. Find the residue there and multiply by 2πi.'],
   solution: `Put z = e^(iθ), so cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz). Then ${den} = (${quad}) ÷ (2z), and I = ∮ ${n(2 * c)} dz ÷ (i(${quad})) round |z| = 1. The roots of ${quad} are z = (−${n(a)} ± s) ÷ ${par(b)} with s = √(${n(a)}² − ${n(b0)}²) = ${rootOf(s * s)} = ${n(s)}. They multiply to 1, so exactly one is inside the circle: z₀ = (${n(s)} − ${n(a)}) ÷ ${par(b)}. The derivative of the bottom there is i(${n(2 * b)}z₀ + ${n(2 * a)}) = ${n(2 * s)}i, so the residue is ${n(2 * c)} ÷ (${n(2 * s)}i), and I = 2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${n(k)}π.`,
   guidance: [
    { prompt: `What is √(${n(a)}² − ${n(b0)}²)?`, answer: [s], explanation: `${n(a * a)} − ${n(b0 * b0)} = ${n(s * s)}, and ${rootOf(s * s)} = ${n(s)}.` },
    { prompt: `After z = e^(iθ), the bottom is ${quad}, whose two roots multiply to 1. How many of them lie inside |z| = 1?`, answer: [1], explanation: `Two roots whose product is 1 and that are not on the circle: one has modulus less than 1 and the other more than 1. So one root is inside.` },
    { prompt: `The residue at the root inside is ${n(2 * c)} ÷ (${n(2 * s)}i). Multiply it by 2πi: what is k with I = kπ?`, answer: [k], explanation: `2πi × ${n(2 * c)} ÷ (${n(2 * s)}i) = ${n(2 * c)}π ÷ ${n(s)} = ${n(k)}π.` }
   ] }; }
 },
 /* f(z) = (z − z₁)^m₁(z − z₂)^m₂ ÷ ((z − w₁)^n₁(z − w₂)^n₂), four distinct points, none on |z| = R; at least one inside and
    one outside. Z and P count with multiplicity; the winding number of f round 0 is Z − P. Not the worked example. */
 q40: {
  canonical: { x1: 1, y1: 0, m1: 2, x2: 0, y2: -4, m2: 1, u1: -2, v1: 0, n1: 3, u2: 5, v2: 0, n2: 1, R: 3 },
  draw: Rr => tries(() => { const P = [0, 1, 2, 3].map(() => Rr.pick(POINTS)); return { x1: P[0][0], y1: P[0][1], m1: Rr.int(1, 3), x2: P[1][0], y2: P[1][1], m2: Rr.int(1, 2), u1: P[2][0], v1: P[2][1], n1: Rr.int(1, 3), u2: P[3][0], v2: P[3][1], n2: Rr.int(1, 2), R: Rr.int(2, 6) }; },
   p => { const P = [[p.x1, p.y1], [p.x2, p.y2], [p.u1, p.v1], [p.u2, p.v2]], M = P.map(mod), ins = M.filter(v => v < p.R).length;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (same(P[i], P[j])) return false;
    return M.every(v => v !== p.R) && ins >= 1 && ins <= 3; },
   { x1: 1, y1: 0, m1: 2, x2: 0, y2: -4, m2: 1, u1: -2, v1: 0, n1: 3, u2: 5, v2: 0, n2: 1, R: 3 }),
  build: ({ x1, y1, m1, x2, y2, m2, u1, v1, n1, u2, v2, n2, R }) => { const Zs = [[[x1, y1], m1], [[x2, y2], m2]], Ps = [[[u1, v1], n1], [[u2, v2], n2]],
   top = Zs.map(([p, k]) => pw(p, k)).join(''), bot = Ps.map(([p, k]) => pw(p, k)).join(''),
   inside = list => list.filter(([p]) => mod(p) < R).reduce((s, [, k]) => s + k, 0), Z = inside(Zs), P = inside(Ps), W = Z - P,
   say = ([p, k]) => `${cx(p)} (power ${n(k)}, modulus ${n(mod(p))}, ${mod(p) < R ? 'inside' : 'outside'})`; return {
   prompt: `To close the realm, the control room checks the filter f(z) = ${top} ÷ (${bot}) on the circle |z| = ${n(R)}, traced once anticlockwise. Count each zero and each pole as many times as the power of its factor. Enter the number Z of zeros of f inside the circle, then the number P of poles inside, then the winding number of the image curve f(z) round 0 as z goes once round the circle.`,
   answer: [Z, P, W],
   hints: ['A point is inside |z| = R when its modulus is less than R. A factor (z − a) raised to the power m counts m times.', 'The argument principle: (1 ÷ 2πi) ∮ f′(z) ÷ f(z) dz = Z − P, and this is also the number of times the image curve f(z) winds round 0.'],
   solution: `The zeros are at ${say(Zs[0])} and ${say(Zs[1])}, so Z = ${n(Z)}. The poles are at ${say(Ps[0])} and ${say(Ps[1])}, so P = ${n(P)}. By the argument principle, the winding number of the image curve round 0 is Z − P = ${n(Z)} − ${n(P)} = ${n(W)}${W < 0 ? '; a negative winding number means the image curve goes round 0 clockwise' : ''}.`,
   guidance: [
    { prompt: `Which zeros of f, ${cx(Zs[0][0])} and ${cx(Zs[1][0])}, have modulus less than ${n(R)}? Add up their powers: what is Z?`, answer: [Z], explanation: `The moduli are ${n(mod(Zs[0][0]))} and ${n(mod(Zs[1][0]))}, so Z = ${n(Z)}.` },
    { prompt: `Do the same for the poles, ${cx(Ps[0][0])} and ${cx(Ps[1][0])}: what is P?`, answer: [P], explanation: `The moduli are ${n(mod(Ps[0][0]))} and ${n(mod(Ps[1][0]))}, so P = ${n(P)}.` },
    { prompt: `By the argument principle and the residue theorem, ∮ f′(z) ÷ f(z) dz = 2πi(Z − P) = kπi. What is k?`, answer: [2 * W], explanation: `k = 2 × (${n(Z)} − ${n(P)}) = ${n(2 * W)}, and the winding number itself is Z − P = ${n(W)}.` }
   ] }; }
 },
});
})();
