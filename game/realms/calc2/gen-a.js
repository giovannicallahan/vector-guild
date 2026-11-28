/* Calculus 2: accumulation mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
/* A polynomial from its coefficients, highest power first: poly([3, 0, −2], 't') is '3t² − 2'. A coefficient 1 is not
   written out and a zero term is left out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Signed sum of numbers as worked: sum([8, −8, 10]) is '8 − 8 + 10'. */
const sum = list => list.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('');
/* A factor (v − r): '(x + 2)', '(x − 3)', or 'x' when r is 0; facs puts a bare x first. */
const fac = (r, v) => r === 0 ? v : r < 0 ? `(${v} + ${n(-r)})` : `(${v} − ${n(r)})`;
const facs = (a, r, s, v) => { const f = [fac(r, v), fac(s, v)].sort((p, q) => (q === v) - (p === v)).join(''); return (a === 1 ? '' : n(a)) + f; };
const r3 = x => Math.round(x * 1000) / 1000, r2 = x => Math.round(x * 100) / 100;
/* A rounded answer as text with all its places: f3(1.19) is '1.190', f2(2.6) is '2.60'. */
const f3 = x => x.toFixed(3).replace('-', '−'), f2 = x => x.toFixed(2).replace('-', '−');
/* A fraction p/q in lowest terms, as text: frac(64, 15) is '64/15', frac(8, 2) is '4'. */
const gcd = (p, q) => q ? gcd(q, p % q) : Math.abs(p);
const frac = (p, q) => { const g = gcd(p, q), a = p / g, b = q / g; return b === 1 ? n(a) : `${n(a)}/${n(b)}`; };
/* k·π as text: '(64/15)π', or '27π' for a whole k. */
const kpi = ks => ks.includes('/') ? `(${ks})π` : `${ks}π`;
const cub = x => x * x * x;
/* q03: c² = (average − d) ÷ k may be a long decimal. A draw is kept only when c is clear of a rounding edge at 2 places
   and rounding c² to 2 or 3 places first still gives the same c, so a player who rounds early is not marked wrong. */
const shaky = ({ a, b }) => { const c2 = (a * a + a * b + b * b) / 3, c = Math.sqrt(c2), f = c * 100 - Math.floor(c * 100);
 return Math.abs(f - 0.5) < 0.05 || r2(Math.sqrt(r2(c2))) !== r2(c) || r2(Math.sqrt(r3(c2))) !== r2(c); };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* r(t) = pt² + qt with p in {3, 6} and q even, so F(t) = (p ÷ 3)t³ + (q ÷ 2)t² has whole coefficients. The tank ends
    below 1000 litres. Not the worked example (6t² + 2t from 0 to 3, 40 litres). */
 q01: {
  canonical: { p: 3, q: 4, t1: 1, t2: 4, S: 150 },
  draw: R => { let p; do { p = { p: R.pick([3, 6]), q: R.pick([2, 4, 6, 8, 10]), t1: R.int(0, 3), S: 10 * R.int(5, 30) }; p.t2 = p.t1 + R.int(2, 4); }
   while ((p.p / 3) * cub(p.t2) + (p.q / 2) * p.t2 * p.t2 - (p.p / 3) * cub(p.t1) - (p.q / 2) * p.t1 * p.t1 + p.S >= 1000 || (p.p === 6 && p.q === 2 && p.t1 === 0 && p.t2 === 3)); return p; },
  build: ({ p, q, t1, t2, S }) => { const A = p / 3, B = q / 2, F = t => A * cub(t) + B * t * t, F1 = F(t1), F2 = F(t2), net = F2 - F1, fin = S + net,
   r = poly([p, q, 0], 't'), Ft = poly([A, B, 0, 0], 't'), ev = t => `${n(A)} × ${n(cub(t))} + ${n(B)} × ${n(t * t)} = ${n(F(t))}`; return {
   prompt: `A feed pipe fills the settling tank at r(t) = ${r} litres per minute, where t is the number of minutes since the pump started. At t = ${n(t1)} the tank holds ${n(S)} litres. Enter the net change in the amount of water from t = ${n(t1)} to t = ${n(t2)}, then the amount in the tank at t = ${n(t2)}, both in litres.`,
   answer: [net, fin],
   hints: ['The net change is the definite integral of the rate over the interval. Find an antiderivative of r(t) by reversing the power rule on each term, with constant 0.', `By the Fundamental Theorem of Calculus the net change is F(${n(t2)}) − F(${n(t1)}). The amount at the end is the amount at the start plus the net change.`],
   solution: `An antiderivative of r(t) = ${r} is F(t) = ${Ft}. F(${n(t2)}) = ${ev(t2)} and F(${n(t1)}) = ${ev(t1)}, so the net change is ∫ from ${n(t1)} to ${n(t2)} of r(t) dt = ${n(F2)} − ${n(F1)} = ${n(net)} litres. By the Net Change Theorem the tank then holds ${n(S)} + ${n(net)} = ${n(fin)} litres.`,
   guidance: [
    { prompt: `Reverse the power rule: an antiderivative of ${r} has the form F(t) = At³ + Bt². What are A and B?`, answer: [A, B], explanation: `The derivative of At³ + Bt² is 3At² + 2Bt, so 3A = ${n(p)} and 2B = ${n(q)}: A = ${n(A)} and B = ${n(B)}.` },
    { prompt: `With F(t) = ${Ft}, what are F(${n(t1)}) and F(${n(t2)})?`, answer: [F1, F2], explanation: `F(${n(t1)}) = ${ev(t1)} and F(${n(t2)}) = ${ev(t2)}.` },
    { prompt: `What is the net change F(${n(t2)}) − F(${n(t1)}), and how much water is in the tank at t = ${n(t2)}?`, answer: [net, fin], explanation: `The net change is ${n(F2)} − ${n(F1)} = ${n(net)} litres. Added to the ${n(S)} litres at the start, it leaves ${n(fin)} litres in the tank.` }
   ] }; }
 },
 /* f(t) = 3t² + 2ct + d with c² < 3d, so the inflow is always positive. G(t) = t³ + ct² + dt; F(b) = G(b) − G(a) and
    F′(b) = f(b), which are never equal. a >= 1 keeps G(a) from being a row of zeros. */
 q02: {
  canonical: { c: -2, d: 5, a: 1, b: 4 },
  draw: R => { let p; do { p = { c: R.nz(-4, 4), d: R.int(1, 12), a: R.int(1, 3) }; p.b = p.a + R.int(2, 4); }
   while (p.c * p.c >= 3 * p.d || (cub(p.b) + p.c * p.b * p.b + p.d * p.b) - (cub(p.a) + p.c * p.a * p.a + p.d * p.a) === 3 * p.b * p.b + 2 * p.c * p.b + p.d); return p; },
  build: ({ c, d, a, b }) => { const Gt = t => cub(t) + c * t * t + d * t, Ga = Gt(a), Gb = Gt(b), Fb = Gb - Ga, fb = 3 * b * b + 2 * c * b + d,
   f = poly([3, 2 * c, d], 't'), Gs = poly([1, c, d, 0], 't'), gev = t => `${sum([cub(t), c * t * t, d * t])} = ${n(Gt(t))}`; return {
   prompt: `The reservoir log keeps a running total F(x) = ∫ from ${n(a)} to x of f(t) dt: the kilolitres gained between hour ${n(a)} and hour x, where f(t) = ${f} kilolitres per hour is the inflow rate. Enter F(${n(b)}), then F′(${n(b)}), the rate at which the running total is growing at x = ${n(b)}, in kilolitres per hour.`,
   answer: [Fb, fb],
   hints: ['F at a number is an ordinary definite integral: find an antiderivative of the integrand and subtract its value at the bottom end from its value at the top end.', 'You do not need to differentiate anything for F′: the derivative of an accumulation function is its integrand, read at the top end.'],
   solution: `An antiderivative of the integrand is G(t) = ${Gs}. G(${n(b)}) = ${gev(b)} and G(${n(a)}) = ${gev(a)}, so F(${n(b)}) = ${n(Gb)} − ${n(Ga)} = ${n(Fb)} kilolitres. The Fundamental Theorem of Calculus says F′(x) = f(x), so F′(${n(b)}) = f(${n(b)}) = ${sum([3 * b * b, 2 * c * b, d])} = ${n(fb)} kilolitres per hour.`,
   guidance: [
    { prompt: `An antiderivative of the integrand ${f} has the form G(t) = t³ + Bt² + Ct. What are B and C?`, answer: [c, d], explanation: `The derivative of t³ + Bt² + Ct is 3t² + 2Bt + C, so 2B = ${n(2 * c)} and C = ${n(d)}: B = ${n(c)} and C = ${n(d)}.` },
    { prompt: `With G(t) = ${Gs}, what are G(${n(a)}) and G(${n(b)}), and F(${n(b)}) = G(${n(b)}) − G(${n(a)})?`, answer: [Ga, Gb, Fb], explanation: `G(${n(a)}) = ${gev(a)} and G(${n(b)}) = ${gev(b)}, so F(${n(b)}) = ${n(Gb)} − ${n(Ga)} = ${n(Fb)} kilolitres.` },
    { prompt: `The derivative of an accumulation function is its integrand at the top end: F′(x) = f(x). What is F′(${n(b)})?`, answer: [fb], explanation: `F′(${n(b)}) = f(${n(b)}) = ${sum([3 * b * b, 2 * c * b, d])} = ${n(fb)} kilolitres per hour: at hour ${n(b)} the total grows exactly as fast as the water flows in.` }
   ] }; }
 },
 /* r(t) = kt² + d with k in {3, 6, 9}, so H(t) = (k ÷ 3)t³ + dt has whole coefficients and the average is a whole
    number. r(c) = average gives c² = (a² + ab + b²) ÷ 3, which lies between a² and b². Not the example (3x² on 0 to 2). */
 q03: {
  canonical: { k: 3, d: 4, a: 1, b: 4 },
  draw: R => { let p; do { p = { k: R.pick([3, 6, 9]), d: R.int(2, 20), a: R.int(0, 3) }; p.b = p.a + R.int(2, 4); }
   while (p.k * (p.a * p.a + p.a * p.b + p.b * p.b) / 3 + p.d >= 1000 || shaky(p)); return p; },
  build: ({ k, d, a, b }) => { const A = k / 3, H = t => A * cub(t) + d * t, I = H(b) - H(a), len = b - a, avg = I / len, c = r2(Math.sqrt((avg - d) / k)),
   r = poly([k, 0, d], 't'), Hs = poly([A, 0, d, 0], 't'), hev = t => `${n(A)} × ${n(cub(t))} + ${n(d)} × ${n(t)} = ${n(H(t))}`; return {
   prompt: `The intake valve passes water at r(t) = ${r} litres per second, t seconds into a flushing cycle. Enter the average value of r(t) from t = ${n(a)} to t = ${n(b)}, in litres per second, then the time c in that interval at which r(c) equals that average, in seconds to 2 decimal places.`,
   answer: [avg, c],
   hints: ['The average value of a function on an interval is its definite integral over the interval divided by the length of the interval.', `For the time, set ${poly([k, 0, d], 'c')} equal to the average and solve for c. Of the two solutions, keep the one between ${n(a)} and ${n(b)}.`],
   solution: `An antiderivative of r(t) is H(t) = ${Hs}. H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so ∫ from ${n(a)} to ${n(b)} of r(t) dt = ${n(H(b))} − ${n(H(a))} = ${n(I)} litres. The interval lasts ${n(b)} − ${n(a)} = ${n(len)} seconds, so the average value is ${n(I)} ÷ ${n(len)} = ${n(avg)} litres per second. Then ${poly([k, 0, d], 'c')} = ${n(avg)} gives ${n(k)}c² = ${n(avg - d)}, so c² = ${n(avg - d)} ÷ ${n(k)} and c ≈ ${f2(c)} seconds, which lies between ${n(a)} and ${n(b)}.`,
   guidance: [
    { prompt: `An antiderivative of ${r} is H(t) = ${Hs}. What is ∫ from ${n(a)} to ${n(b)} of r(t) dt, in litres?`, answer: [I], explanation: `H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so the integral is ${n(H(b))} − ${n(H(a))} = ${n(I)} litres.` },
    { prompt: `Divide the integral by the length of the interval, ${n(b)} − ${n(a)} = ${n(len)} seconds. What is the average value?`, answer: [avg], explanation: `${n(I)} ÷ ${n(len)} = ${n(avg)} litres per second. A steady flow at this rate would pass the same water in the same time.` },
    { prompt: `Solve ${poly([k, 0, d], 'c')} = ${n(avg)} for the c between ${n(a)} and ${n(b)}, to 2 decimal places.`, answer: [c], explanation: `${n(k)}c² = ${n(avg)} − ${n(d)} = ${n(avg - d)}, so c² = ${n(avg - d)} ÷ ${n(k)} and the positive square root is c ≈ ${f2(c)} seconds.` }
   ] }; }
 },
 /* r(t) = 2(m + 1) · t(t² + c)ᵐ with u = t² + c: the integral is ∫ (m + 1)uᵐ du = u^(m+1) between the new limits. */
 q04: {
  canonical: { c: 1, m: 2, a: 0, b: 2 },
  draw: R => { let p; do { p = { c: R.int(1, 6), m: R.pick([2, 3, 4]), a: R.int(0, 2) }; p.b = p.a + R.int(1, 2); }
   while (Math.pow(p.b * p.b + p.c, p.m + 1) >= 100000); return p; },
  build: ({ c, m, a, b }) => { const K = 2 * (m + 1), ua = a * a + c, ub = b * b + c, P = m + 1, Pa = Math.pow(ua, P), Pb = Math.pow(ub, P), val = Pb - Pa,
   inner = `t² + ${n(c)}`, r = `${n(K)}t(${inner})${SUP[m]}`, uu = `${n(P)}u${SUP[m]}`; return {
   prompt: `A mixing tank is fed at r(t) = ${r} litres per minute, t minutes after the valve opens. Find the water added from t = ${n(a)} to t = ${n(b)}, ∫ from ${n(a)} to ${n(b)} of r(t) dt, with the substitution u = ${inner}. Enter the new lower limit and the new upper limit in u, then the value of the integral in litres (type it without commas).`,
   answer: [ua, ub, val],
   hints: [`With u = ${inner}, du = 2t dt, so the factor ${n(K)}t dt in the integral is ${n(P)} du.`, `Change the limits with the substitution too: put each end value of t into u = ${inner}. Then the integral is in u alone and you never go back to t.`],
   solution: `Let u = ${inner}. Then du = 2t dt, so ${n(K)}t dt = ${n(P)} du. At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}; at t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. The integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du. An antiderivative of ${uu} is u${SUP[P]}, so the value is ${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]} = ${n(Pb)} − ${n(Pa)} = ${n(val)} litres.`,
   guidance: [
    { prompt: `With u = ${inner}, what is u at t = ${n(a)}, and what is u at t = ${n(b)}?`, answer: [ua, ub], explanation: `At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}. At t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. These are the new limits.` },
    { prompt: `du = 2t dt. The integral has ${n(K)}t dt in it, which is k du for which number k?`, answer: [P], explanation: `${n(K)}t dt = ${n(P)} × 2t dt = ${n(P)} du, so the integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du.` },
    { prompt: `An antiderivative of ${uu} is u${SUP[P]}. What is ∫ from ${n(ua)} to ${n(ub)} of ${uu} du?`, answer: [val], explanation: `${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]} = ${n(Pb)} − ${n(Pa)} = ${n(val)} litres.` }
   ] }; }
 },
 /* Line A: k ÷ (t + c), giving k ln((T + c) ÷ c); line B: m·e^(−t), giving m(1 − e^(−T)). Both rounded to 3 places. */
 q05: {
  canonical: { k: 5, c: 2, m: 8, T: 4 },
  /* k = 3, c = 2, T = 4 would be 3 ln 3, the first integral of the worked example. */
  draw: R => { let p; do { p = { k: R.int(2, 12), c: R.int(1, 5), m: R.int(2, 12), T: R.int(2, 6) }; } while (p.k === 3 && p.c === 2 && p.T === 4); return p; },
  build: ({ k, c, m, T }) => { const A = r3(k * Math.log((T + c) / c)), B = r3(m * (1 - Math.exp(-T))); return {
   prompt: `Two feed lines fill the settling tank. Line A delivers ${n(k)} ÷ (t + ${n(c)}) litres per minute and line B delivers ${n(m)}e^(−t) litres per minute, t minutes after the valves open. Enter the litres delivered by line A from t = 0 to t = ${n(T)}, then the litres delivered by line B over the same time, both to 3 decimal places.`,
   answer: [A, B],
   hints: [`An antiderivative of 1 ÷ (t + ${n(c)}) is ln|t + ${n(c)}|: by the chain rule its derivative is 1 ÷ (t + ${n(c)}).`, 'An antiderivative of e^(−t) is −e^(−t), because the chain rule makes the derivative of −e^(−t) equal to e^(−t). Keep every digit on the calculator and round only at the end.'],
   solution: `Line A: an antiderivative of ${n(k)} ÷ (t + ${n(c)}) is ${n(k)} ln|t + ${n(c)}|, so the litres delivered are ${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)} = ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) ≈ ${f3(A)}. Line B: an antiderivative of ${n(m)}e^(−t) is −${n(m)}e^(−t), so the litres delivered are −${n(m)}e^(−${n(T)}) − (−${n(m)}e⁰) = ${n(m)} − ${n(m)}e^(−${n(T)}) ≈ ${f3(B)}.`,
   guidance: [
    { prompt: `Line A: ∫ from 0 to ${n(T)} of ${n(k)} ÷ (t + ${n(c)}) dt = ${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)}. What is that to 3 decimal places?`, answer: [A], explanation: `${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)} = ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) ≈ ${f3(A)} litres.` },
    { prompt: `Line B: an antiderivative of ${n(m)}e^(−t) is −${n(m)}e^(−t). What is its value at t = 0?`, answer: [-m], explanation: `e⁰ = 1, so −${n(m)}e⁰ = −${n(m)}.` },
    { prompt: `Subtract: −${n(m)}e^(−${n(T)}) − (−${n(m)}). What is that to 3 decimal places?`, answer: [B], explanation: `−${n(m)}e^(−${n(T)}) + ${n(m)} = ${n(m)}(1 − e^(−${n(T)})) ≈ ${f3(B)} litres.` }
   ] }; }
 },
 /* Camera a metres from the channel: angle rate a ÷ (a² + t²), turned angle arctan(T ÷ a) with T ÷ a = rho a short decimal.
    Calibration ∫ from 0 to b of 1 ÷ √(s² − x²) dx = arcsin(b ÷ s), b ÷ s at most three decimals. */
 q06: {
  canonical: { a: 4, rho: 1.5, s: 5, b: 3 },
  draw: R => { let p; do { p = { a: R.pick([2, 4, 6, 8]), rho: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), s: R.pick([2, 4, 5, 8, 10]) }; p.b = R.int(1, p.s - 1); }
   while (p.a * p.rho !== Math.round(p.a * p.rho)); return p; },
  build: ({ a, rho, s, b }) => { const T = a * rho, A = r3(Math.atan(rho)), B = r3(Math.asin(b / s)), q = b / s, rate = `${n(a)} ÷ (${n(a * a)} + t²)`; return {
   prompt: `A camera on the reservoir bank sits ${n(a)} metres from a straight channel and follows a float that drifts along the channel at 1 metre per second, starting level with the camera. The camera turns at ${rate} radians per second, t seconds later. Enter the angle it turns through from t = 0 to t = ${n(T)}, in radians. Its calibration also needs ∫ from 0 to ${n(b)} of 1 ÷ √(${n(s * s)} − x²) dx: enter that value next. Give both to 3 decimal places.`,
   answer: [A, B],
   hints: [`Write ${n(a * a)} + t² as ${n(a * a)}(1 + (t ÷ ${n(a)})²) and substitute u = t ÷ ${n(a)}. An antiderivative of 1 ÷ (1 + u²) is arctan u.`, `An antiderivative of 1 ÷ √(${n(s * s)} − x²) is arcsin(x ÷ ${n(s)}). Set your calculator to radians.`],
   solution: `With u = t ÷ ${n(a)}, du = dt ÷ ${n(a)} and ${rate} dt = du ÷ (1 + u²). The limits become u = 0 and u = ${n(T)} ÷ ${n(a)} = ${n(rho)}, so the angle is arctan ${n(rho)} − arctan 0 = arctan ${n(rho)} ≈ ${f3(A)} radians. For the calibration, an antiderivative of 1 ÷ √(${n(s * s)} − x²) is arcsin(x ÷ ${n(s)}), so the value is arcsin(${n(b)} ÷ ${n(s)}) − arcsin 0 = arcsin ${n(q)} ≈ ${f3(B)} radians.`,
   guidance: [
    { prompt: `Substitute u = t ÷ ${n(a)}. What is the new upper limit of the integral in u?`, answer: [rho], explanation: `At t = ${n(T)}, u = ${n(T)} ÷ ${n(a)} = ${n(rho)}. The integral becomes ∫ from 0 to ${n(rho)} of 1 ÷ (1 + u²) du.` },
    { prompt: `An antiderivative of 1 ÷ (1 + u²) is arctan u. What is arctan ${n(rho)} − arctan 0, in radians to 3 decimal places?`, answer: [A], explanation: `arctan 0 = 0, so the angle is arctan ${n(rho)} ≈ ${f3(A)} radians.` },
    { prompt: `An antiderivative of 1 ÷ √(${n(s * s)} − x²) is arcsin(x ÷ ${n(s)}). What is arcsin(${n(b)} ÷ ${n(s)}) − arcsin 0, to 3 decimal places?`, answer: [B], explanation: `${n(b)} ÷ ${n(s)} = ${n(q)} and arcsin 0 = 0, so the value is arcsin ${n(q)} ≈ ${f3(B)} radians.` }
   ] }; }
 },
 /* Curve y = ax² + bx + c and edge y = mx + k meeting at x = r and x = s: edge − curve = −a(x − r)(x − s). a = 6, or
    a = 3 with r + s even, keeps the antiderivative's coefficients whole; the area is a(s − r)³ ÷ 6. */
 q07: {
  canonical: { a: 3, b: -2, c: 1, r: -1, s: 3 },
  draw: R => { let p; do { const a = R.pick([3, 6]), r = R.int(-3, 2); p = { a, b: R.int(-5, 5), c: R.int(-5, 5), r, s: r + (a === 3 ? R.pick([2, 4]) : R.int(2, 4)) }; }
   while (p.a === 3 && (p.r + p.s) % 2 !== 0); return p; },
  build: ({ a, b, c, r, s }) => { const m = b + a * (r + s), k = c - a * r * s, B = a * (r + s), C = -a * r * s, P = x => -(a / 3) * cub(x) + (B / 2) * x * x + C * x,
   Pr = P(r), Ps = P(s), area = Ps - Pr, line = poly([m, k], 'x'), curve = poly([a, b, c], 'x'), D = poly([-a, B, C], 'x'), Pt = poly([-a / 3, B / 2, C, 0], 'x'); return {
   prompt: `The hull foundry cuts a plate between the straight edge y = ${line} and the curve y = ${curve}, with x and y in metres. Enter the two x-values where the edge meets the curve, smaller first, then the area of the plate in square metres.`,
   answer: [r, s, area],
   hints: ['Set the two formulas equal and move every term to one side. The quadratic you get factorises.', 'Between the crossing points the edge is above the curve. The area is the integral of (top − bottom), the edge minus the curve, from the smaller crossing to the larger.'],
   solution: `Setting ${line} = ${curve} and moving every term to one side gives ${poly([a, b - m, c - k], 'x')} = 0, which is ${facs(a, r, s, 'x')} = 0, so the edge meets the curve at x = ${n(r)} and x = ${n(s)}. Between them the edge is on top, and edge minus curve is ${D}. An antiderivative is P(x) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.`,
   guidance: [
    { prompt: `Solve ${line} = ${curve}. At which two x-values do the edge and the curve meet? Smaller first.`, answer: [r, s], explanation: `Moving every term to one side gives ${poly([a, b - m, c - k], 'x')} = 0, which factorises as ${facs(a, r, s, 'x')} = 0: x = ${n(r)} or x = ${n(s)}.` },
    { prompt: `Edge minus curve is ${D}, and an antiderivative is P(x) = ${Pt}. What are P(${n(r)}) and P(${n(s)})?`, answer: [Pr, Ps], explanation: `Putting the two crossings into P(x) gives P(${n(r)}) = ${n(Pr)} and P(${n(s)}) = ${n(Ps)}.` },
    { prompt: `What is the area of the plate, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `${n(Ps)} − ${par(Pr)} = ${n(area)} square metres. It is positive because the edge stays above the curve between the crossings.` }
   ] }; }
 },
 /* Curve x = ay² and edge x = my + k meeting at y = r and y = s, so edge − curve = −a(y − r)(y − s); same whole-number
    rule as q07. The fin's lower boundary in vertical strips swaps from one branch of the curve to the edge. */
 q08: {
  canonical: { a: 6, r: -2, s: 1 },
  draw: R => { let p; do { const a = R.pick([3, 6]), r = R.int(-5, 2); p = { a, r, s: r + (a === 3 ? R.pick([2, 4]) : R.int(2, 4)) }; }
   while ((p.a === 3 && (p.r + p.s) % 2 !== 0) || (p.r === -1 && p.s === 2)); return p; },
  build: ({ a, r, s }) => { const m = a * (r + s), k = -a * r * s, P = y => -(a / 3) * cub(y) + (m / 2) * y * y + k * y, Pr = P(r), Ps = P(s), area = Ps - Pr,
   line = poly([m, k], 'y'), curve = `${n(a)}y²`, D = poly([-a, m, k], 'y'), Pt = poly([-a / 3, m / 2, k, 0], 'y'); return {
   prompt: `The foundry cuts a cooling fin from the flat region between the curve x = ${curve} and the straight edge x = ${line}, in metres. Slice it along y into horizontal strips and enter the area of the fin in square metres.`,
   answer: [area],
   hints: ['Each horizontal strip runs from the curve on the left to the edge on the right, so its length is (right − left), the edge minus the curve, written in y.', `Set ${curve} equal to ${line} to find the y-values where the strips start and stop, then integrate the strip length between them with respect to y.`],
   solution: `Setting ${curve} = ${line} gives ${poly([a, -m, -k], 'y')} = 0, which is ${facs(a, r, s, 'y')} = 0, so the curve and the edge meet at y = ${n(r)} and y = ${n(s)}. Each horizontal strip between them runs from x = ${curve} on the left to x = ${line} on the right, so its length is ${D}. An antiderivative is P(y) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.`,
   guidance: [
    { prompt: `Solve ${curve} = ${line}. At which two y-values do the curve and the edge meet? Lower first.`, answer: [r, s], explanation: `${poly([a, -m, -k], 'y')} = 0 factorises as ${facs(a, r, s, 'y')} = 0, so y = ${n(r)} or y = ${n(s)}.` },
    { prompt: `A strip at height y runs from x = ${curve} to x = ${line}, so its length is ${D}, with antiderivative P(y) = ${Pt}. What are P(${n(r)}) and P(${n(s)})?`, answer: [Pr, Ps], explanation: `Putting the two heights into P(y) gives P(${n(r)}) = ${n(Pr)} and P(${n(s)}) = ${n(Ps)}.` },
    { prompt: `What is the area of the fin, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.` }
   ] }; }
 },
 /* Base under y = k√x from 0 to L; slices across the base are squares (area k²x) or triangles as tall as they are wide
    (area k²x ÷ 2). Volumes k²L² ÷ 2 or k²L² ÷ 4. */
 q09: {
  canonical: { k: 2, L: 5, shape: 'square' },
  draw: R => ({ k: R.int(1, 3), L: R.int(2, 8), shape: R.pick(['square', 'triangle']) }),
  build: ({ k, L, shape }) => { const sq = shape === 'square', c = sq ? k * k : k * k / 2, AL = c * L, V = c * L * L / 2, w = k === 1 ? '√x' : `${n(k)}√x`,
   Ax = poly([c, 0], 'x'), slice = sq ? 'a square standing on the floor, with one side running across the base' : 'a triangle standing on the floor, with its base running across the base of the casting and its height equal to that base',
   area = sq ? `(${w})² = ${Ax}` : `½ × (${w})² = ${Ax}`; return {
   prompt: `A casting for a hull rib stands on the floor region bounded by the x-axis, the line x = ${n(L)} and the curve y = ${w}, in metres. Every cross-section perpendicular to the x-axis is ${slice}. Enter the area of the cross-section at x = ${n(L)} in square metres, then the volume of the casting in cubic metres.`,
   answer: [AL, V],
   hints: ['At position x, the side across the base runs from the x-axis up to the curve, so its length is the height of the curve there.', sq ? 'The slice is a square, so its area A(x) is that length squared. The volume is the integral of A(x) from 0 to the end of the base.' : 'The slice is a triangle with base and height both equal to that length, so its area A(x) is half the length squared. The volume is the integral of A(x) from 0 to the end of the base.'],
   solution: `At position x the base is ${w} metres across, so the cross-section has area A(x) = ${area} square metres. At x = ${n(L)} that is ${n(c)} × ${n(L)} = ${n(AL)} square metres. The volume is ∫ from 0 to ${n(L)} of ${Ax} dx = ${n(c / 2)} × ${n(L)}² − 0 = ${n(c / 2)} × ${n(L * L)} = ${n(V)} cubic metres.`,
   guidance: [
    { prompt: `The cross-section at position x has area A(x) = cx. What is c?`, answer: [c], explanation: `The side across the base is ${w}, so A(x) = ${area}: c = ${n(c)}.` },
    { prompt: `What is the area of the cross-section at x = ${n(L)}?`, answer: [AL], explanation: `A(${n(L)}) = ${n(c)} × ${n(L)} = ${n(AL)} square metres.` },
    { prompt: `The volume is ∫ from 0 to ${n(L)} of ${Ax} dx. What is it, in cubic metres?`, answer: [V], explanation: `An antiderivative of ${Ax} is ${poly([c / 2, 0, 0], 'x')}, so the volume is ${n(c / 2)} × ${n(L * L)} = ${n(V)} cubic metres.` }
   ] }; }
 },
 /* Region between y = mx and y = ax², which meet at x = m ÷ a. About the x-axis: washers π(m²x² − a²x⁴), k = 2m⁵ ÷ 15a³.
    About the y-axis: washers π(y ÷ a − y² ÷ m²) up to y = m² ÷ a, k = m⁴ ÷ 6a³. */
 q10: {
  canonical: { m: 2, a: 1, axis: 'x' },
  /* a divides 2m, so the crossing x = m ÷ a is a whole number or a half; k stays below 1000. */
  draw: R => { let p; do { p = R.pick([{ m: R.int(2, 6), a: R.int(1, 2) }, { m: R.pick([3, 6]), a: 3 }, { m: R.pick([4, 8]), a: 4 }]); p.axis = R.pick(['x', 'y']); }
   while (p.axis === 'x' && 2 * Math.pow(p.m, 5) / (15 * p.a * p.a * p.a) >= 1000); return p; },
  build: ({ m, a, axis }) => { const a3 = a * a * a, m4 = m * m * m * m, m5 = m4 * m, line = poly([m, 0], 'x'), curve = poly([a, 0, 0], 'x');
   if (axis === 'x') { const X = m / a, I1 = frac(m5, 3 * a3), I2 = frac(m5, 5 * a3), k = 2 * m5 / (15 * a3), ks = frac(2 * m5, 15 * a3),
    washer = `π(${poly([m * m, 0, 0], 'x')} − ${poly([a * a, 0, 0, 0, 0], 'x')})`, inner = `${poly([m * m, 0, 0], 'x')} − ${poly([a * a, 0, 0, 0, 0], 'x')}`; return {
    prompt: `The foundry spins the flat region between the line y = ${line} and the curve y = ${curve} (in metres) about the x-axis to make a nozzle. Enter the x-value where the line and the curve meet away from the origin, then the volume of the nozzle as k·π cubic metres: enter k (a fraction such as 7/15 is fine, or a decimal to 4 places).`,
    answer: [X, k],
    hints: ['A slice across the x-axis is a washer: a disc of radius R with a disc of radius r cut out of its middle, so its area is π(R² − r²).', `Between the crossings the line is higher, so R = ${line} and r = ${curve}. Integrate π(R² − r²) from 0 to the crossing.`],
    solution: `${line} = ${curve} at x = 0 and x = ${frac(m, a)}. On that interval the outer radius is R = ${line} and the inner radius is r = ${curve}, so each washer has area ${washer}. The volume is π ∫ from 0 to ${frac(m, a)} of (${inner}) dx = π(${I1} − ${I2}) = ${kpi(ks)} cubic metres, so k = ${ks}.`,
    guidance: [
     { prompt: `Solve ${line} = ${curve}. What is the solution other than x = 0?`, answer: [X], explanation: `${curve} − ${line} = ${a === 1 ? '' : n(a)}x(x − ${frac(m, a)}) is 0 at x = 0 and x = ${frac(m, a)}.` },
     { prompt: `The washer area is ${washer}. What is ∫ from 0 to ${frac(m, a)} of ${poly([m * m, 0, 0], 'x')} dx? A fraction is fine.`, answer: [m5 / (3 * a3)], explanation: `An antiderivative is ${n(m * m)}x³ ÷ 3, which at x = ${frac(m, a)} is ${I1}.` },
     { prompt: `∫ from 0 to ${frac(m, a)} of ${poly([a * a, 0, 0, 0, 0], 'x')} dx = ${I2}. What is k, the number in front of π in the volume?`, answer: [k], explanation: `k = ${I1} − ${I2} = ${ks}.` }
    ] }; }
   const Y = m * m / a, k = m4 / (6 * a3), ks = frac(m4, 6 * a3), I1 = frac(m4, 2 * a3), I2 = frac(m4, 3 * a3), Ys = frac(m * m, a),
    outer = a === 1 ? 'x = √y' : `x = √(y ÷ ${n(a)})`, innerx = `x = y ÷ ${n(m)}`, R2 = a === 1 ? 'y' : `y ÷ ${n(a)}`, r2s = `y² ÷ ${n(m * m)}`; return {
    prompt: `The foundry spins the flat region between the line y = ${line} and the curve y = ${curve} (in metres) about the y-axis to make a nozzle. Enter the height y where the line and the curve meet away from the origin, then the volume of the nozzle as k·π cubic metres: enter k (a fraction such as 7/15 is fine, or a decimal to 4 places).`,
    answer: [Y, k],
    hints: ['A slice across the y-axis is a washer: a disc of radius R with a disc of radius r cut out of its middle, so its area is π(R² − r²). The radii are distances sideways from the y-axis.', `Write both boundaries as x in terms of y: the curve gives ${outer} (the outer radius) and the line gives ${innerx} (the inner radius). Integrate from y = 0 to the height of the crossing.`],
    solution: `${line} = ${curve} at x = 0 and x = ${frac(m, a)}, which is the height y = ${n(m)} × ${frac(m, a)} = ${Ys}. At height y the curve is at ${outer} and the line at ${innerx}, so each washer has area π(${R2} − ${r2s}). The volume is π ∫ from 0 to ${Ys} of (${R2} − ${r2s}) dy = π(${I1} − ${I2}) = ${kpi(ks)} cubic metres, so k = ${ks}.`,
    guidance: [
     { prompt: `The line and the curve meet at x = 0 and x = ${frac(m, a)}. At what height y is the second crossing?`, answer: [Y], explanation: `On the line, y = ${n(m)} × ${frac(m, a)} = ${Ys}.` },
     { prompt: `The washer area is π(${R2} − ${r2s}). What is ∫ from 0 to ${Ys} of ${R2} dy? A fraction is fine.`, answer: [m4 / (2 * a3)], explanation: `An antiderivative is ${a === 1 ? 'y² ÷ 2' : `y² ÷ ${n(2 * a)}`}, which at y = ${Ys} is ${I1}.` },
     { prompt: `∫ from 0 to ${Ys} of ${r2s} dy = ${I2}. What is k, the number in front of π in the volume?`, answer: [k], explanation: `k = ${I1} − ${I2} = ${ks}.` }
    ] }; }
 },
});
})();
