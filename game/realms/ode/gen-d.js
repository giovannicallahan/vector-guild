/* Differential equations mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed terms: tail([[3, 'x'], [−1, 'y'], [4, '']]) is ' + 3x − y + 4' (zero terms dropped, coefficient 1 not written);
   expr(...) is the same without a leading '+' ('3x − y + 4', '−x + 2'). */
const sgn = v => v < 0 ? '−' : '+';
const one = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}`;
const tail = terms => terms.filter(([v]) => v !== 0).map(([v, x]) => ' ' + one(v, x)).join('');
const expr = terms => { const t = tail(terms).trim(); return t.startsWith('+ ') ? t.slice(2) : t.startsWith('− ') ? '−' + t.slice(2) : t; };
/* (s − 3), (s + 2); e^(3t), e^(−t), e^t. */
const fac = (r, v = 's') => r > 0 ? `(${v} − ${n(r)})` : `(${v} + ${n(-r)})`;
const ex = k => k === 1 ? 'e^t' : k === -1 ? 'e^(−t)' : `e^(${n(k)}t)`;
/* c e^(kt) as a term: 'e^(3t)', '−e^(3t)', '4e^(3t)'; with first = false a signed term ' + 4e^(3t)'. */
const eTerm = (c, k, first) => { const body = `${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${ex(k)}`; return first ? (c < 0 ? '−' : '') + body : ` ${sgn(c)} ${body}`; };
/* Fixed decimals with a real minus sign. */
const fx = (x, d) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
const r3 = x => Math.round(x * 1000) / 1000, r2 = x => Math.round(x * 100) / 100;
/* True when x sits close to a rounding tie at d decimals (so the last digit would hang on float noise). */
const nearTie = (x, d) => { const f = (Math.abs(x) * Math.pow(10, d)) % 1; return Math.abs(f - 0.5) < 0.02; };
/* At most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
const ord = k => { const m = k % 100; return k + (m >= 11 && m <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] || 'th'); };
/* π multiples: 'π²', '2.25π²'. */
const es = a => a === 1 ? 'e^(−s)' : `e^(−${n(a)}s)`;
const piSq = m => m === 1 ? 'π²' : `${n(m)}π²`;
const hasDec = (x, d) => Math.abs(Math.round(x * Math.pow(10, d)) - x * Math.pow(10, d)) < 1e-7;

const C31 = { a: 3, b: -2, A: 4, B: -1 };
const C32 = { r1: -2, r2: -3, A: 2, B: 1, T: 1 };
const C33 = { k: 2, m: 3, a: 3, d: 1 };
const C34 = { p: 2, q: 3, T: 4, k: 3, c: 5, a: 2, d: 0.5 };
const C35 = { b: 1, c: 3, a0: 8, a1: -3 };
const C36 = { c: 2, r1: -1, r2: 3 };
const C37 = { r1: -1, D: 5, c: 2, at: 1 };
const C38 = { a: 1, ys: 5, c: 0.5, xs: 10 };
const C39 = { L: 2, k: 3, B: 3, eig: 1, m: 4 };
const C40 = { L: 1.25, w: 90, a: 0.8, ys: 4, c: 0.6, xs: 12 };

/* q37: eigenvalues of [[0, 1], [j, −c]], from λ² + cλ − j = 0. Returns [larger real part, smaller real part, imaginary part ≥ 0]. */
const eig2 = (j, c) => { const disc = c * c + 4 * j;
 if (disc >= 0) { const s = Math.sqrt(disc); return [(-c + s) / 2, (-c - s) / 2, 0]; }
 return [-c / 2 + 0, -c / 2 + 0, Math.sqrt(-disc) / 2]; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* F(s) = (αs + β) ÷ ((s − a)(s − b)) built from A ÷ (s − a) + B ÷ (s − b): α = A + B, β = −(Ab + Ba). a > b, neither 0,
    A + B ≠ 0 so the top has an s term. Not the worked example ((5s − 1) ÷ ((s − 1)(s + 1)): A = 2, B = 3). */
 q31: {
  canonical: C31,
  draw: R => tries(() => ({ a: R.nz(-4, 5), b: R.nz(-5, 4), A: R.nz(-5, 5), B: R.nz(-5, 5) }),
   p => p.a > p.b && p.A + p.B !== 0 && !(p.a === 1 && p.b === -1 && p.A === 2 && p.B === 3) && !(p.a === 3 && p.b === -2 && p.A === 4 && p.B === -1), C31),
  build: ({ a, b, A, B }) => { const al = A + B, be = -(A * b + B * a), top = expr([[al, 's'], [be, '']]), F = `(${top}) ÷ (${fac(a)}${fac(b)})`,
   Na = al * a + be, Nb = al * b + be, f = `${eTerm(A, a, true)}${eTerm(B, b, false)}`; return {
   prompt: `In the signal shop, a relay’s output signal has Laplace transform F(s) = ${F}. Its inverse transform, the signal itself, has the form f(t) = A ${ex(a)} + B ${ex(b)}. Enter A, then B.`,
   answer: [A, B],
   hints: ['Split F(s) into partial fractions, one piece for each factor of the bottom: A ÷ (s − a) + B ÷ (s − b).',
    'To find A, cover up the factor (s − a) and put s = a into what is left; do the same with the other factor for B. Each piece A ÷ (s − a) is the transform of A e^(at).'],
   solution: `Write F(s) = A ÷ ${fac(a)} + B ÷ ${fac(b)}. Covering up ${fac(a)} and putting s = ${n(a)} into the rest gives A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}. Covering up ${fac(b)} and putting s = ${n(b)} into the rest gives B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}. Since ℒ{e^(at)} = 1 ÷ (s − a), the inverse transform is f(t) = ${f}.`,
   guidance: [
    { prompt: `Cover up the factor ${fac(a)} in F(s) = ${F} and put s = ${n(a)} into what is left. What is A?`, answer: [A], labels: ['A'], explanation: `What is left is (${top}) ÷ ${fac(b)}. At s = ${n(a)} the top is ${n(Na)} and the bottom is ${n(a - b)}, so A = ${par(Na)} ÷ ${par(a - b)} = ${n(A)}.` },
    { prompt: `Now cover up ${fac(b)} and put s = ${n(b)} into what is left. What is B?`, answer: [B], labels: ['B'], explanation: `What is left is (${top}) ÷ ${fac(a)}. At s = ${n(b)} the top is ${n(Nb)} and the bottom is ${n(b - a)}, so B = ${par(Nb)} ÷ ${par(b - a)} = ${n(B)}.` }
   ] }; }
 },
 /* y″ + py′ + qy = 0 with roots r1 > r2 (both non-zero), y = A e^(r1 t) + B e^(r2 t): y(0) = A + B, y′(0) = A r1 + B r2.
    |y(T)| at least 0.05 and not near a rounding tie at 3 decimals. Not the worked example (y″ + 3y′ + 2y = 0, y(0) = 2, y′(0) = −1). */
 q32: {
  canonical: C32,
  draw: R => tries(() => { const r1 = R.nz(-4, 2); return { r1, r2: R.int(-5, r1 - 1), A: R.nz(-4, 4), B: R.nz(-4, 4), T: R.pick([0.5, 1, 1.5]) }; },
   p => { if (p.r2 === 0) return false; const v = p.A * Math.exp(p.r1 * p.T) + p.B * Math.exp(p.r2 * p.T);
    return Math.abs(v) >= 0.05 && Math.abs(v) < 500 && !nearTie(v, 3) && !(p.r1 === -1 && p.r2 === -2 && p.A === 3 && p.B === -1) && !(p.r1 === -2 && p.r2 === -3 && p.A === 2 && p.B === 1 && p.T === 1); }, C32),
  build: ({ r1, r2, A, B, T }) => { const p = -(r1 + r2), q = r1 * r2, y0 = A + B, y1 = A * r1 + B * r2, cc = y1 + p * y0,
   eq = `${expr([[1, 'y″'], [p, 'y′'], [q, 'y']])} = 0`, bottom = expr([[1, 's²'], [p, 's'], [q, '']]), top = expr([[y0, 's'], [cc, '']]),
   N1 = y0 * r1 + cc, N2 = y0 * r2 + cc, e1 = Math.exp(r1 * T), e2 = Math.exp(r2 * T), v = A * e1 + B * e2; return {
   prompt: `A meter needle in the signal shop swings back to rest. Its deflection y, in millimetres, t seconds after release obeys ${eq}, with y(0) = ${n(y0)} and y′(0) = ${n(y1)}. Solve it with the Laplace transform. The transform Y(s) splits into partial fractions A ÷ (s − r₁) + B ÷ (s − r₂), where r₁ > r₂ are the two roots of its bottom. Enter A, then B, then y(${n(T)}) to 3 decimal places.`,
   answer: [A, B, r3(v)],
   hints: ['Use the transform of a derivative, twice for y″: ℒ{y′} = sY − y(0) and ℒ{y″} = s²Y − s·y(0) − y′(0). Collect the Y terms on one side and divide.',
    'The bottom of Y(s) is the characteristic polynomial. Factor it, split Y(s) into partial fractions by covering up one factor at a time, then turn each piece back into an exponential.'],
   solution: `Transforming term by term, ℒ{y″} = s²Y${tail([[-y0, 's'], [-y1, '']])}${p !== 0 ? ` and ℒ{y′} = sY${tail([[-y0, '']])}` : ''}. Collecting the Y terms gives (${bottom})Y = ${top}, so Y(s) = (${top}) ÷ (${fac(r1)}${fac(r2)}). Covering up ${fac(r1)} and putting s = ${n(r1)} gives A = ${par(N1)} ÷ ${par(r1 - r2)} = ${n(A)}; covering up ${fac(r2)} and putting s = ${n(r2)} gives B = ${par(N2)} ÷ ${par(r2 - r1)} = ${n(B)}. So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}, and y(${n(T)}) = ${n(A)} × e^(${n(r1 * T)}) ${sgn(B)} ${n(Math.abs(B))} × e^(${n(r2 * T)}) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
   guidance: [
    { prompt: `Transform ${eq} with y(0) = ${n(y0)} and y′(0) = ${n(y1)}, and collect the Y terms: (${bottom})Y = ${y0 !== 0 ? expr([[y0, 's']]) + ' + c' : 'c'}. What is the constant c?`, answer: [cc], labels: ['c'], explanation: `ℒ{y″} = s²Y${tail([[-y0, 's'], [-y1, '']])}${p !== 0 ? ` and ${n(p)} × ℒ{y′} = ${n(p)}(sY${tail([[-y0, '']])})` : ''}. Moving every term without Y to the right leaves ${top}, so c = ${n(cc)}.` },
    { prompt: `The bottom factors as ${fac(r1)}${fac(r2)}. Cover up ${fac(r1)} and put s = ${n(r1)} into what is left of Y(s). What is A?`, answer: [A], labels: ['A'], explanation: `At s = ${n(r1)} the top is ${n(N1)} and the other factor is ${n(r1 - r2)}, so A = ${par(N1)} ÷ ${par(r1 - r2)} = ${n(A)}.` },
    { prompt: `Cover up ${fac(r2)} and put s = ${n(r2)} into what is left. What is B?`, answer: [B], labels: ['B'], explanation: `At s = ${n(r2)} the top is ${n(N2)} and the other factor is ${n(r2 - r1)}, so B = ${par(N2)} ÷ ${par(r2 - r1)} = ${n(B)}.` },
    { prompt: `So y(t) = ${eTerm(A, r1, true)}${eTerm(B, r2, false)}. What is y(${n(T)}), to 3 decimal places?`, answer: [r3(v)], labels: [`y(${n(T)})`], explanation: `y(${n(T)}) = ${n(A)} × ${n(e1)} ${sgn(B)} ${n(Math.abs(B))} × ${n(e2)} ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
   ] }; }
 },
 /* v′ + kv = km·u(t − a), v(0) = 0: v = m(1 − e^(−k(t − a))) after the switch. The long-run voltage is m.
    Not the worked example (v′ + v = 4u(t − 2), v(5)). */
 q33: {
  canonical: C33,
  draw: R => tries(() => ({ k: R.int(1, 5), m: R.int(2, 9), a: R.int(1, 5), d: R.pick([0.5, 1, 1.5, 2]) }),
   p => !nearTie(p.m * (1 - Math.exp(-p.k * p.d)), 3) && !(p.k === 1 && p.m === 4 && p.a === 2) && !(p.k === 2 && p.m === 3 && p.a === 3 && p.d === 1), C33),
  build: ({ k, m, a, d }) => { const F = k * m, t1 = a + d, v = m * (1 - Math.exp(-k * d)), kk = k === 1 ? '' : n(k),
   eq = `v′ + ${kk}v = ${n(F)}u(t − ${n(a)})`, shape = `${n(m)}(1 − e^(−${kk}(t − ${n(a)})))`; return {
   prompt: `A charging line in the signal shop holds a voltage v, in volts, t seconds after the shop opens. It obeys ${eq} with v(0) = 0: the supply is switched on at t = ${n(a)}. Enter the voltage the line settles to in the long run, then v(${n(t1)}) to 3 decimal places.`,
   answer: [m, r3(v)],
   hints: ['ℒ{u(t − a)} = e^(−as) ÷ s. Transform both sides, then split the part without e^(−as) into partial fractions.',
    'The shift rule: if g(t) has transform G(s), then e^(−as)G(s) is the transform of g(t − a)u(t − a). So find g first, then replace t by t − a and switch it on at t = a.'],
   solution: `Transforming with v(0) = 0 gives (s + ${n(k)})V = ${n(F)}${es(a)} ÷ s, so V(s) = ${es(a)} × ${n(F)} ÷ (s(s + ${n(k)})). In partial fractions, ${n(F)} ÷ (s(s + ${n(k)})) = ${n(m)} ÷ s − ${n(m)} ÷ (s + ${n(k)}), the transform of g(t) = ${n(m)}(1 − e^(−${kk}t)). By the shift rule, v(t) = ${shape} × u(t − ${n(a)}): 0 before the switch, then rising towards ${n(m)} volts, the long-run value. At t = ${n(t1)}, v = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.`,
   guidance: [
    { prompt: `Without the switch, the part ${n(F)} ÷ (s(s + ${n(k)})) splits as P ÷ s − P ÷ (s + ${n(k)}). What is P?`, answer: [m], labels: ['P'], explanation: `Cover up s and put s = 0 into ${n(F)} ÷ (s + ${n(k)}): P = ${n(F)} ÷ ${n(k)} = ${n(m)}. So the part is the transform of ${n(m)}(1 − e^(−${kk}t)), which settles at ${n(m)} volts.` },
    { prompt: `By the shift rule, v(t) = ${shape} for t ≥ ${n(a)}. What is v(${n(t1)}), to 3 decimal places?`, answer: [r3(v)], labels: [`v(${n(t1)}) (V)`], explanation: `t − ${n(a)} = ${n(d)}, so v = ${n(m)}(1 − e^(−${n(k * d)})) ≈ ${fx(v, 4)}, which is ${fx(r3(v), 3)} to 3 decimal places.` }
   ] }; }
 },
 /* (f ∗ g)(T) for f(t) = pt and g(t) = q: ∫ from 0 to T of pτ·q dτ = pqT² ÷ 2, a whole number. Kick: y′ + ky = cδ(t − a), y(0) = 0,
    so y = c e^(−k(t − a)) after t = a. Not the worked example (f = t, g = 4 at T = 3; y′ + 2y = 3δ(t − 1) at t = 2). */
 q34: {
  canonical: C34,
  draw: R => tries(() => ({ p: R.int(1, 5), q: R.int(2, 6), T: R.int(2, 6), k: R.int(1, 4), c: R.int(2, 9), a: R.int(1, 4), d: R.pick([0.5, 1, 1.5, 2]) }),
   p => (p.p * p.q * p.T * p.T) % 2 === 0 && !nearTie(p.c * Math.exp(-p.k * p.d), 3) && p.c * Math.exp(-p.k * p.d) >= 0.05 && !(p.p === 1 && p.q === 4 && p.T === 3)
    && !(p.p === 2 && p.q === 3 && p.T === 4 && p.k === 3 && p.c === 5), C34),
  build: ({ p, q, T, k, c, a, d }) => { const conv = p * q * T * T / 2, t1 = a + d, y = c * Math.exp(-k * d), kk = k === 1 ? '' : n(k),
   ft = p === 1 ? 't' : `${n(p)}t`, ftau = p === 1 ? 'τ' : `${n(p)}τ`, pq = p * q; return {
   prompt: `Two jobs on the signal shop’s bench. First, a filter mixes the signals f(t) = ${ft} and g(t) = ${n(q)} by convolution: enter (f ∗ g)(${n(T)}). Second, the current y in a coil obeys y′ + ${kk}y = ${n(c)}δ(t − ${n(a)}) with y(0) = 0: an impulse, a sudden kick of size ${n(c)}, at t = ${n(a)}. Enter y(${n(t1)}) to 3 decimal places.`,
   answer: [conv, r3(y)],
   hints: ['The convolution is (f ∗ g)(t) = ∫ from 0 to t of f(τ)g(t − τ) dτ. Here g is the same number at every time, so g(t − τ) is that number.',
    'ℒ{δ(t − a)} = e^(−as). After transforming, the shift rule turns e^(−as) ÷ (s + k) into e^(−k(t − a)) switched on at t = a: the kick makes y jump by its size, and then y decays.'],
   solution: `(f ∗ g)(${n(T)}) = ∫ from 0 to ${n(T)} of ${ftau} × ${n(q)} dτ = ${n(pq)} × ${n(T)}² ÷ 2 = ${n(conv)}. For the coil, transforming with y(0) = 0 gives (s + ${n(k)})Y = ${n(c)}${es(a)}, so Y(s) = ${n(c)}${es(a)} ÷ (s + ${n(k)}). By the shift rule y(t) = ${n(c)}e^(−${kk}(t − ${n(a)})) × u(t − ${n(a)}): 0 before the kick, ${n(c)} just after it, then decaying. At t = ${n(t1)}, y = ${n(c)}e^(−${n(k * d)}) ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.`,
   guidance: [
    { prompt: `In the convolution, f(τ)g(${n(T)} − τ) = ${ftau} × ${n(q)} = ${n(pq)}τ. What is the integral of ${n(pq)}τ from 0 to ${n(T)}?`, answer: [conv], labels: ['(f ∗ g)(T)'], explanation: `An antiderivative of ${n(pq)}τ is ${n(pq)}τ² ÷ 2, so the integral is ${n(pq)} × ${n(T * T)} ÷ 2 = ${n(conv)}.` },
    { prompt: `The kick of size ${n(c)} at t = ${n(a)} makes y jump from 0. What is y just after t = ${n(a)}?`, answer: [c], labels: ['y just after the kick'], explanation: `Y(s) = ${n(c)}${es(a)} ÷ (s + ${n(k)}) is the transform of ${n(c)}e^(−${kk}(t − ${n(a)})) switched on at t = ${n(a)}, which is ${n(c)} at the moment of the kick.` },
    { prompt: `After the kick, y(t) = ${n(c)}e^(−${kk}(t − ${n(a)})). What is y(${n(t1)}), to 3 decimal places?`, answer: [r3(y)], labels: [`y(${n(t1)})`], explanation: `t − ${n(a)} = ${n(d)}, so y = ${n(c)}e^(−${n(k * d)}) ≈ ${fx(y, 4)}, which is ${fx(r3(y), 3)} to 3 decimal places.` }
   ] }; }
 },
 /* y″ + bxy′ + cy = 0 with y = Σ aₙxⁿ: (n + 2)(n + 1)aₙ₊₂ + (bn + c)aₙ = 0. a₂ = −c·a₀ ÷ 2, a₃ = −(b + c)a₁ ÷ 6,
    a₄ = −(2b + c)a₂ ÷ 12, all whole and non-zero. Not the worked example (y″ − xy′ + 3y = 0, a₀ = 8, a₁ = 3). */
 q35: {
  canonical: C35,
  draw: R => tries(() => ({ b: R.nz(-3, 3), c: R.nz(-4, 4), a0: R.nz(-12, 12), a1: R.nz(-12, 12) }),
   p => { const a2 = -p.c * p.a0 / 2, a3 = -(p.b + p.c) * p.a1 / 6, a4 = -(2 * p.b + p.c) * a2 / 12;
    return [a2, a3, a4].every(v => Number.isInteger(v) && v !== 0 && Math.abs(v) <= 99) && !(p.b === -1 && p.c === 3 && p.a0 === 8 && p.a1 === 3) && !(p.b === 1 && p.c === 3 && p.a0 === 8 && p.a1 === -3); }, C35),
  build: ({ b, c, a0, a1 }) => { const a2 = -c * a0 / 2, a3 = -(b + c) * a1 / 6, a4 = -(2 * b + c) * a2 / 12,
   eq = `${expr([[1, 'y″'], [b, 'xy′'], [c, 'y']])} = 0`; return {
   prompt: `In the ecology dome, the sag y of a long planting cable at distance x from its middle post obeys ${eq}, with y(0) = ${n(a0)} and y′(0) = ${n(a1)}. Look for a power series solution y = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + …, so a₀ = y(0) and a₁ = y′(0). Enter a₂, then a₃, then a₄.`,
   answer: [a2, a3, a4],
   hints: ['Put the series into the equation. The coefficient of xⁿ in y″ is (n + 2)(n + 1)aₙ₊₂, in xy′ it is n·aₙ, and in y it is aₙ.',
    'Every power of x must cancel separately, which gives a recurrence relation: aₙ₊₂ = −(bn + c)aₙ ÷ ((n + 2)(n + 1)) when the equation is y″ + bxy′ + cy = 0. Use n = 0, then 1, then 2.'],
   solution: `The coefficient of xⁿ gives (n + 2)(n + 1)aₙ₊₂${tail([[b, 'n·aₙ'], [c, 'aₙ']])} = 0, so the recurrence relation is aₙ₊₂ = −(${expr([[b, 'n'], [c, '']])})aₙ ÷ ((n + 2)(n + 1)). With n = 0: a₂ = −(${n(c)}) × ${par(a0)} ÷ 2 = ${n(a2)}. With n = 1: a₃ = −(${n(b + c)}) × ${par(a1)} ÷ 6 = ${n(a3)}. With n = 2: a₄ = −(${n(2 * b + c)}) × ${par(a2)} ÷ 12 = ${n(a4)}.`,
   guidance: [
    { prompt: `The recurrence relation for ${eq} is aₙ₊₂ = −(${expr([[b, 'n'], [c, '']])})aₙ ÷ ((n + 2)(n + 1)). Put n = 0 and a₀ = ${n(a0)}. What is a₂?`, answer: [a2], labels: ['a₂'], explanation: `a₂ = −(${n(c)}) × ${par(a0)} ÷ (2 × 1) = ${n(a2)}.` },
    { prompt: `Put n = 1 and a₁ = ${n(a1)}. What is a₃?`, answer: [a3], labels: ['a₃'], explanation: `a₃ = −(${n(b)} ${sgn(c)} ${n(Math.abs(c))}) × ${par(a1)} ÷ (3 × 2) = −(${n(b + c)}) × ${par(a1)} ÷ 6 = ${n(a3)}.` },
    { prompt: `Put n = 2 and a₂ = ${n(a2)}. What is a₄?`, answer: [a4], labels: ['a₄'], explanation: `a₄ = −(${n(2 * b)} ${sgn(c)} ${n(Math.abs(c))}) × ${par(a2)} ÷ (4 × 3) = −(${n(2 * b + c)}) × ${par(a2)} ÷ 12 = ${n(a4)}.` }
   ] }; }
 },
 /* x′ = xy − P, y′ = y − cx − d with P = −c·r1·r2 and d = −c(r1 + r2): critical points at x = r1 and x = r2 (r1 < r2, both
    non-zero), where y = cx + d. At (r2, −c·r1) the Jacobian is [[−c·r1, r2], [−c, 1]]. Not the worked example (c = 1, r1 = −1, r2 = 2). */
 q36: {
  canonical: C36,
  draw: R => tries(() => { const r1 = R.nz(-4, 3); return { c: R.int(1, 3), r1, r2: R.int(r1 + 1, 5) }; },
   p => p.r2 !== 0 && !(p.c === 1 && p.r1 === -1 && p.r2 === 2) && !(p.c === 2 && p.r1 === -1 && p.r2 === 3), C36),
  build: ({ c, r1, r2 }) => { const P = -c * r1 * r2, d = -c * (r1 + r2), xs = r2, ys = -c * r1,
   fx1 = `xy${tail([[-P, '']])}`, gx = `y${tail([[-c, 'x'], [-d, '']])}`, line = expr([[c, 'x'], [d, '']]),
   quad = expr([[c, 'x²'], [d, 'x'], [-P, '']]); return {
   prompt: `The dome’s air plant tracks two readings, x and y, that obey x′ = ${fx1} and y′ = ${gx}. Find the critical point with the larger x, and the Jacobian matrix of the system there. Enter x, then y, then the four entries of the Jacobian matrix row by row.`,
   answer: [xs, ys, ys, xs, -c, 1],
   hints: ['At a critical point both right-hand sides are 0. Solve the simpler equation for y and put it into the other one.',
    'The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y), where f and g are the two right-hand sides. For a partial derivative, treat the other letter as a fixed number.'],
   solution: `y′ = 0 gives y = ${line}. Putting this into xy${tail([[-P, '']])} = 0 gives ${quad} = 0, whose roots are x = ${n(r1)} and x = ${n(r2)}. The larger is x = ${n(xs)}, with y = ${n(ys)}. For f = ${fx1}: ∂f/∂x = y and ∂f/∂y = x. For g = ${gx}: ∂g/∂x = ${n(-c)} and ∂g/∂y = 1. At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[${n(ys)}, ${n(xs)}], [${n(-c)}, 1]], and the linearisation there is u′ = ${expr([[ys, 'u'], [xs, 'v']])}, v′ = ${expr([[-c, 'u'], [1, 'v']])}.`,
   guidance: [
    { prompt: `y′ = 0 gives y = ${line}. Put it into xy${tail([[-P, '']])} = 0 to get ${quad} = 0. What is its larger root?`, answer: [xs], labels: ['x'], explanation: `${quad} = ${c === 1 ? '' : n(c)}${fac(r1, 'x')}${fac(r2, 'x')}, so the roots are ${n(r1)} and ${n(r2)}; the larger is ${n(xs)}.` },
    { prompt: `What is y at that critical point?`, answer: [ys], labels: ['y'], explanation: `y = ${line} at x = ${n(xs)} is ${n(c)} × ${par(xs)}${tail([[d, '']])} = ${n(ys)}.` },
    { prompt: `For f = ${fx1}, treat y as a fixed number and differentiate in x. What is ∂f/∂x at the critical point?`, answer: [ys], labels: ['∂f/∂x'], explanation: `∂f/∂x = y, which is ${n(ys)} at (${n(xs)}, ${n(ys)}).` },
    { prompt: `Now treat x as fixed and differentiate f in y. What is ∂f/∂y at the critical point?`, answer: [xs], labels: ['∂f/∂y'], explanation: `∂f/∂y = x, which is ${n(xs)} there.` },
    { prompt: `For g = ${gx}, what is ∂g/∂x?`, answer: [-c], labels: ['∂g/∂x'], explanation: `Only the term ${one(-c, 'x').replace('− ', '−').replace('+ ', '')} depends on x, so ∂g/∂x = ${n(-c)}; and ∂g/∂y = 1, from the term y.` }
   ] }; }
 },
 /* x′ = y, y′ = −(x − r1)(x − r2) − cy with r2 = r1 + D. At (r1, 0) the Jacobian is [[0, 1], [D, −c]] (a saddle); at (r2, 0)
    it is [[0, 1], [−D, −c]]. Draws are made so the eigenvalues are whole numbers or a ± bi with whole a and b:
    kind 0 saddle (D = μ(μ + c)), 1 node (c = α + β, D = αβ, α ≠ β), 2 spiral (c = 2a, D = a² + b²), 3 centre (c = 0, D = b²).
    The kind only chooses the numbers; the answer comes from the Jacobian. Not the worked example (r1 = −1, D = 3, c = 2, at x = −1). */
 q37: {
  canonical: C37,
  draw: R => tries(() => { const kind = R.int(0, 3), r1 = R.int(-3, 2);
    if (kind === 0) { const mu = R.int(1, 3), c = R.int(0, 3); return { r1, D: mu * (mu + c), c, at: 0 }; }
    if (kind === 1) { const al = R.int(1, 3), be = al + R.int(1, 2); return { r1, D: al * be, c: al + be, at: 1 }; }
    if (kind === 2) { const a = R.int(1, 2), b = R.int(1, 3); return { r1, D: a * a + b * b, c: 2 * a, at: 1 }; }
    const b = R.int(1, 4); return { r1, D: b * b, c: 0, at: 1 }; },
   p => p.r1 + p.D <= 12 && p.r1 !== 0 && p.r1 + p.D !== 0 && !(p.r1 === -1 && p.D === 3 && p.c === 2 && p.at === 0) && !(p.r1 === -1 && p.D === 5 && p.c === 2 && p.at === 1), C37),
  build: ({ r1, D, c, at }) => { const r2 = r1 + D, S = r1 + r2, P = r1 * r2, xs = at ? r2 : r1, j = S - 2 * xs,
   g = `${expr([[-1, 'x²'], [S, 'x'], [-P, ''], [-c, 'y']])}`, [e1, e2, im] = eig2(j, c),
   code = im > 0 ? (e1 === 0 ? 4 : 3) : (e1 * e2 < 0 ? 2 : 1),
   names = { 1: 'a node', 2: 'a saddle', 3: 'a spiral', 4: 'a centre' }, charEq = `λ²${tail([[c, 'λ'], [-j, '']])} = 0`,
   eigText = im > 0 ? `λ = ${e1 === 0 ? '' : n(e1) + ' '}±${e1 === 0 ? '' : ' '}${im === 1 ? '' : n(im)}i` : `λ = ${n(e1)} and λ = ${n(e2)}`,
   why = code === 2 ? 'real with opposite signs' : code === 1 ? 'real with the same sign' : code === 3 ? 'complex with a non-zero real part' : 'purely imaginary'; return {
   prompt: `A seed-pod sorter in the ecology dome swings on a curved track. Its offset x and speed y obey x′ = y and y′ = ${g}. Classify the critical point (${n(xs)}, 0). Enter the real parts of the two eigenvalues of the Jacobian matrix there, larger first (the same number twice for a complex pair), then the size of their imaginary part (0 if they are real), then the code: 1 node, 2 saddle, 3 spiral, 4 centre.`,
   answer: [e1, e2, im, code],
   hints: ['The Jacobian matrix of x′ = y, y′ = g(x, y) is [[0, 1], [∂g/∂x, ∂g/∂y]]. Work out ∂g/∂x at the point.',
    'The eigenvalues solve λ² − (trace)λ + (determinant) = 0. Real with opposite signs is a saddle, real with the same sign a node, complex with a non-zero real part a spiral, purely imaginary a centre.'],
   solution: `∂g/∂x = −2x${tail([[S, '']])}, which is ${n(j)} at x = ${n(xs)}, and ∂g/∂y = ${n(-c)}. So the Jacobian matrix is [[0, 1], [${n(j)}, ${n(-c)}]], with trace ${n(-c)} and determinant ${n(-j)}. The eigenvalues solve ${charEq}, so ${eigText}. They are ${why}, so the point is ${names[code]}: code ${code}.${code === 4 ? ' A centre of the linearisation needs care in general; this system has no damping term, and its swings really do close up.' : ''}`,
   guidance: [
    { prompt: `g = ${g}. What is ∂g/∂x at x = ${n(xs)}?`, answer: [j], labels: ['∂g/∂x'], explanation: `∂g/∂x = −2x${tail([[S, '']])} = −2 × ${par(xs)}${tail([[S, '']])} = ${n(j)}.` },
    { prompt: `The Jacobian matrix is [[0, 1], [${n(j)}, ${n(-c)}]]. What is its determinant?`, answer: [-j], labels: ['determinant'], explanation: `0 × ${par(-c)} − 1 × ${par(j)} = ${n(-j)}. The trace is ${n(-c)}, so the eigenvalues solve ${charEq}.` },
    { prompt: `Solve ${charEq}. What is the real part of the larger eigenvalue (or of either one, for a complex pair)?`, answer: [e1], labels: ['real part'], explanation: `${eigText}. They are ${why}, so the point is ${names[code]}.` }
   ] }; }
 },
 /* x′ = ax − bxy (insects, hundreds), y′ = −cy + dxy (birds, tens), with b = a ÷ ys and d = c ÷ xs printed with at most 4 decimals.
    Linearised at (xs, ys) the eigenvalues are ±i√(ac), so small swings have period 2π ÷ √(ac). Not the worked example (a = 0.6, ys = 6, c = 0.4, xs = 5). */
 q38: {
  canonical: C38,
  draw: R => tries(() => ({ a: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), ys: R.pick([2, 3, 4, 5, 6, 8, 10]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), xs: R.pick([4, 5, 8, 10, 12, 15, 20]) }),
   p => p.a !== p.ys && hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && !nearTie(2 * Math.PI / Math.sqrt(p.a * p.c), 2) && !(p.a === 0.6 && p.ys === 6 && p.c === 0.4 && p.xs === 5) && !(p.a === 1 && p.ys === 5 && p.c === 0.5 && p.xs === 10), C38),
  build: ({ a, ys, c, xs }) => { const b = a / ys, d = c / xs, ac = Math.round(a * c * 100) / 100, T = 2 * Math.PI / Math.sqrt(a * c),
   A = a === 1 ? 'x' : `${n(a)}x`, C = c === 1 ? 'y' : `${n(c)}y`; return {
   prompt: `In the sealed dome, insects x (in hundreds) and the birds that eat them y (in tens) follow the predator–prey system x′ = ${A} − ${n(b)}xy and y′ = −${C} + ${n(d)}xy, with time in months. Enter the coexistence point, x then y, where both populations stay constant, then the period in months of small swings around it, to 2 decimal places.`,
   answer: [xs, ys, r2(T)],
   hints: ['Factor each right-hand side: x(a − by) and y(−c + dx). The coexistence point has x and y both non-zero, so each bracket is 0.',
    'At the coexistence point the Jacobian matrix has zeros on its diagonal, so its eigenvalues are ±iω with ω² equal to minus its determinant. Small swings then repeat every 2π ÷ ω.'],
   solution: `x′ = x(${n(a)} − ${n(b)}y) is 0 for y = ${n(a)} ÷ ${n(b)} = ${n(ys)}, and y′ = y(−${n(c)} + ${n(d)}x) is 0 for x = ${n(c)} ÷ ${n(d)} = ${n(xs)}. So the coexistence point is (${n(xs)}, ${n(ys)}): ${n(xs * 100)} insects and ${n(ys * 10)} birds. There the Jacobian matrix is [[0, −${n(b * xs)}], [${n(d * ys)}, 0]], with determinant ${n(b * xs)} × ${n(d * ys)} = ${n(ac)}. The eigenvalues are ±i√${n(ac)}, so the linearisation is a centre with ω = √${n(ac)} ≈ ${fx(Math.sqrt(a * c), 4)} per month, and the period is 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} months to 2 decimal places.`,
   guidance: [
    { prompt: `y′ = y(−${n(c)} + ${n(d)}x) is 0 with y non-zero when the bracket is 0. What is x at the coexistence point?`, answer: [xs], labels: ['x (hundreds)'], explanation: `${n(d)}x = ${n(c)}, so x = ${n(c)} ÷ ${n(d)} = ${n(xs)}.` },
    { prompt: `x′ = x(${n(a)} − ${n(b)}y) is 0 with x non-zero when the bracket is 0. What is y there?`, answer: [ys], labels: ['y (tens)'], explanation: `${n(b)}y = ${n(a)}, so y = ${n(a)} ÷ ${n(b)} = ${n(ys)}.` },
    { prompt: `At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[0, −${n(b * xs)}], [${n(d * ys)}, 0]]. What is its determinant, ω²?`, answer: [ac], labels: ['ω²'], explanation: `0 × 0 − (−${n(b * xs)}) × ${n(d * ys)} = ${n(ac)}, which is a × c. The eigenvalues are ±i√${n(ac)}.` },
    { prompt: `ω = √${n(ac)}. What is the period 2π ÷ ω, in months to 2 decimal places?`, answer: [r2(T)], labels: ['period (months)'], explanation: `ω ≈ ${fx(Math.sqrt(a * c), 4)}, and 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} to 2 decimal places.` }
   ] }; }
 },
 /* y″ + λy = 0, y(0) = y(L) = 0: allowed λ = (kπ ÷ L)², so the kth is k² ÷ L² times π². Second part: y(L) = B ≠ 0 with
    λ = μπ², where μ is m² ÷ L² (an allowed value: no solution, code 0) or m ÷ L² with m not a square (one solution, code 1).
    Not the worked example (L = 1, k = 2; λ = 2π²). */
 q39: {
  canonical: C39,
  draw: R => { const L = R.pick([0.5, 2, 5, 10]), eig = R.int(0, 1); return { L, k: R.int(2, 5), B: R.int(2, 9), eig, m: eig ? R.int(1, 6) : R.pick([2, 3, 5, 6, 7, 8]) }; },
  build: ({ L, k, B, eig, m }) => { const lk = k * k / (L * L), mu = eig ? m * m / (L * L) : m / (L * L), code = eig ? 0 : 1,
   rootMu = eig ? m : Math.sqrt(m); return {
   prompt: `A seed cable in the dome is pinned at both ends, x = 0 and x = ${n(L)} metres. Its shape y obeys y″ + λy = 0 with y(0) = 0 and y(${n(L)}) = 0, an eigenvalue problem. Enter the ${ord(k)} smallest positive λ that allows a solution other than y = 0, as a multiple of π² (for 5π² enter 5). Then take the boundary value problem y″ + ${piSq(mu)}y = 0 with y(0) = 0 and y(${n(L)}) = ${n(B)}: enter 1 if it has exactly one solution, 0 if it has none or many.`,
   answer: [lk, code],
   hints: ['For λ > 0 the solutions are y = A cos(√λ x) + C sin(√λ x). The condition at 0 removes the cosine, and the condition at the other end needs sin(√λ L) = 0, so √λ L must be a whole multiple of π. Zero or negative λ give only y = 0.',
    'If √λ L is a whole multiple of π, the sine is 0 at the far end and cannot reach a non-zero end value. Otherwise C is fixed by the end value, so there is exactly one solution.'],
   solution: `y(0) = 0 leaves y = C sin(√λ x). A solution other than 0 needs sin(√λ × ${n(L)}) = 0, so √λ × ${n(L)} = kπ and λ = (kπ ÷ ${n(L)})². The ${ord(k)} is k = ${n(k)}: λ = ${n(k * k)} ÷ ${n(L * L)} × π² = ${piSq(lk)}, so enter ${n(lk)}. For λ = ${piSq(mu)}, √λ × ${n(L)} = ${eig ? `${rootMu === 1 ? '' : n(rootMu)}π, a whole multiple of π, so sin(√λ × ${n(L)}) = 0 and C sin(√λ x) is 0 at x = ${n(L)} whatever C is: it cannot reach ${n(B)}, so there is no solution. Code 0.` : `√${n(m)} × π, not a whole multiple of π, so sin(√λ × ${n(L)}) is not 0 and C = ${n(B)} ÷ sin(√λ × ${n(L)}) is the only choice: exactly one solution. Code 1.`}`,
   guidance: [
    { prompt: `The allowed values have √λ × ${n(L)} = kπ. For k = ${n(k)}, what is √λ ÷ π?`, answer: [k / L], labels: ['√λ ÷ π'], explanation: `√λ = ${n(k)}π ÷ ${n(L)}, so √λ ÷ π = ${n(k / L)}.` },
    { prompt: `Square it: what is λ ÷ π² for the ${ord(k)} allowed value?`, answer: [lk], labels: ['λ ÷ π²'], explanation: `${n(k / L)}² = ${n(lk)}, so λ = ${piSq(lk)}.` },
    { prompt: `For λ = ${piSq(mu)}, is √λ × ${n(L)} a whole multiple of π? Enter 1 if the problem with y(${n(L)}) = ${n(B)} has exactly one solution, 0 if not.`, answer: [code], labels: ['one solution (1/0)'], explanation: eig ? `√λ × ${n(L)} = ${rootMu === 1 ? '' : n(rootMu)}π, a whole multiple, so the sine vanishes at the far end and no solution reaches ${n(B)}: 0.` : `√λ × ${n(L)} = √${n(m)} × π, not a whole multiple, so exactly one C works: 1.` }
   ] }; }
 },
 /* String: shape X″ + λX = 0, X(0) = X(L) = 0, lowest λ = (π ÷ L)², swinging at ω = w√λ = wπ ÷ L (the rule is given in the
    prompt). L has 1 ÷ L with at most 2 decimals. Dome: x′ = ax − bxy, y′ = −cy + dxy, coexistence birds y = a ÷ b. */
 q40: {
  canonical: C40,
  draw: R => tries(() => ({ L: R.pick([0.5, 0.8, 1.25, 2, 2.5]), w: R.pick([40, 60, 75, 90, 120, 150]), a: R.pick([0.5, 0.6, 0.8, 1.2, 1.5]), ys: R.pick([3, 4, 5, 6, 8, 10, 12]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1.2]), xs: R.pick([4, 5, 8, 10, 12, 16, 20]) }),
   p => hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && !nearTie(p.w * Math.PI / p.L, 2) && !(p.L === 1.25 && p.w === 90 && p.a === 0.8 && p.ys === 4), C40),
  build: ({ L, w, a, ys, c, xs }) => { const inv = 1 / L, om = w * Math.PI / L, b = a / ys, d = c / xs,
   A = a === 1 ? 'x' : `${n(a)}x`, C = c === 1 ? 'y' : `${n(c)}y`; return {
   prompt: `Two last readings before the outpost moves on to Waves. A wind-harp string in the dome is ${n(L)} metres long and fixed at both ends; its shape X obeys X″ + λX = 0 with X(0) = 0 and X(${n(L)}) = 0. In the Waves realm you will see why such a string swings with angular frequency ω = ${n(w)}√λ rad/s, where ${n(w)} m/s is its wave speed. Enter its lowest allowed angular frequency, the fundamental frequency, in rad/s to 2 decimal places. Then the dome’s insects x (hundreds) and birds y (tens) follow x′ = ${A} − ${n(b)}xy and y′ = −${C} + ${n(d)}xy: enter y at the coexistence point.`,
   answer: [r2(om), ys],
   hints: ['The allowed λ of the string are (kπ ÷ L)² for k = 1, 2, 3, …; the lowest frequency comes from k = 1.',
    'At the coexistence point both populations are non-zero, so the bracket of x′ = x(a − by) must be 0.'],
   solution: `The lowest allowed λ is (π ÷ ${n(L)})², so √λ = π ÷ ${n(L)} = ${n(inv)}π and ω = ${n(w)} × ${n(inv)}π = ${n(w * inv)}π ≈ ${fx(om, 4)}, which is ${fx(r2(om), 2)} rad/s to 2 decimal places. In the dome, x′ = x(${n(a)} − ${n(b)}y) is 0 with x non-zero when y = ${n(a)} ÷ ${n(b)} = ${n(ys)}, that is ${n(ys * 10)} birds; the insects sit at x = ${n(c)} ÷ ${n(d)} = ${n(xs)}.`,
   guidance: [
    { prompt: `The lowest allowed λ is (π ÷ ${n(L)})². What is √λ ÷ π?`, answer: [inv], labels: ['√λ ÷ π'], explanation: `√λ = π ÷ ${n(L)} = ${n(inv)}π.` },
    { prompt: `ω = ${n(w)}√λ = ${n(w)} × ${n(inv)}π. What is ω in rad/s, to 2 decimal places?`, answer: [r2(om)], labels: ['ω (rad/s)'], explanation: `${n(w * inv)}π ≈ ${fx(om, 4)}, which is ${fx(r2(om), 2)} to 2 decimal places.` },
    { prompt: `x′ = x(${n(a)} − ${n(b)}y). With x non-zero, what y makes it 0?`, answer: [ys], labels: ['y (tens)'], explanation: `${n(b)}y = ${n(a)}, so y = ${n(ys)}.` }
   ] }; }
 }
});
})();
