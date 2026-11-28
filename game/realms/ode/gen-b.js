/* Differential equations mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed sums of letter terms: lin([[1, 'y″'], [3, 'y′'], [2, 'y']]) is 'y″ + 3y′ + 2y'. A coefficient 1 is not written
   (except on a bare number, symbol ''), a coefficient 0 drops the term, and a symbol that starts with a space
   (' cos 2t') keeps that space after a written coefficient. */
const sgn = v => v < 0 ? '−' : '+';
const body = (v, s) => { const a = Math.abs(v); if (!s) return n(a); if (a === 1) return s.trim(); return n(a) + s; };
const lin = terms => { const t = terms.filter(([v]) => v !== 0); if (!t.length) return '0';
 return t.map(([v, s], i) => i === 0 ? (v < 0 ? '−' : '') + body(v, s) : ` ${sgn(v)} ${body(v, s)}`).join(''); };
/* e to a multiple of t: ex(1) 'e^(t)', ex(−2) 'e^(−2t)'; ex(−0.6, '') 'e^(−0.6)' for a plain number. */
const ex = (a, v = 't') => v ? `e^(${a === 1 ? '' : a === -1 ? '−' : n(a)}${v})` : `e^(${n(a)})`;
/* The argument of a sine or cosine: wt(1) 't', wt(3) '3t'. */
const wt = w => w === 1 ? 't' : `${n(w)}t`;
/* Rounding to k places, the same value as text with its trailing zeros, and a guard against rounding ties. */
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => rd(x, k).toFixed(k).replace('-', '−');
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* A coefficient in front of a letter, never a written-out 1: co(1, 'C') 'C', co(3, 'C') '3C', co(−1, 'C') '−C'. */
const co = (v, s) => v === 1 ? s : v === -1 ? '−' + s : n(v) + s;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const same = (p, q) => Object.keys(q).every(key => p[key] === q[key]);

/* q11 values: the equilibrium E, the constant D of the solution and the value at time t. */
const m11 = p => {
 if (p.fam === 'tank') { const E = rd(p.c * p.V, 6), k = rd(p.r / p.V, 6), rc = rd(p.r * p.c, 6), D = p.x0 - E; return { E, k, rc, D, v: E + D * Math.exp(-k * p.t) }; }
 if (p.fam === 'log') { const D = rd((p.K - p.P0) / p.P0, 6); return { E: p.K, D, v: p.K / (1 + D * Math.exp(-p.r * p.t)) }; }
 const D = p.T0 - p.Ta; return { E: p.Ta, D, v: p.Ta + D * Math.exp(-p.k * p.t) };
};
/* q12: the starting values from the constants. */
const m12 = p => p.fam === 'exp' ? { y0: p.C1 + p.C2, v0: p.a * p.C1 + p.b * p.C2 } : { y0: p.C1, v0: p.w * p.C2 };
const v13 = p => p.C1 * Math.exp(p.r1 * p.t) + p.C2 * Math.exp(p.r2 * p.t);
const v15 = p => Math.exp(p.a * p.t) * (p.C1 * Math.cos(p.b * p.t) + p.C2 * Math.sin(p.b * p.t));
const v17 = p => (p.x0 + (p.v0 + p.w * p.x0) * p.t) * Math.exp(-p.w * p.t);
const m19 = p => { const d = p.q - p.w * p.w, s = p.p * p.w; return { d, s, F: d * p.A + s * p.B, Gs: -s * p.A + d * p.B, det: d * d + s * s }; };
const m20 = p => { const d = p.k - p.m * p.w * p.w, s = p.c * p.w, D2 = d * d + s * s; return { d, s, D2, amp: p.F / Math.sqrt(D2) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Three first-order models: a stirred tank x′ = rc − (r ÷ V)x, logistic growth P′ = rP(1 − P ÷ K) with K = P₀(D + 1)
    so D is whole, and cooling T′ = −k(T − Tₐ). The value is asked to 3 decimal places; draws whose value sits near a
    rounding tie are skipped. The worked example (a 50 L tank) uses a volume no draw has. */
 q11: {
  canonical: { fam: 'tank', V: 200, r: 4, c: 0.3, x0: 10, t: 30 },
  draw: R => tries(() => { const fam = R.pick(['tank', 'log', 'cool']);
    if (fam === 'tank') { const V = R.pick([100, 200, 500]), k = R.pick([0.02, 0.04, 0.05, 0.1]), c = R.pick([0.1, 0.2, 0.3, 0.4, 0.5]), E = Math.round(c * V);
     let x0 = R.int(0, 2 * E); if (x0 === E) x0 = 0; return { fam, V, r: Math.round(k * V), c, x0, t: R.pick([10, 15, 20, 25, 30, 40]) }; }
    if (fam === 'log') { const P0 = R.int(5, 60), D = R.int(2, 14); return { fam, r: R.pick([0.2, 0.3, 0.4, 0.5]), K: P0 * (D + 1), P0, t: R.int(2, 12) }; }
    return { fam, k: R.pick([0.04, 0.05, 0.1, 0.2]), Ta: R.int(15, 30), T0: R.int(50, 95), t: R.pick([5, 10, 15, 20]) }; },
   p => !edge(m11(p).v, 3) && (p.fam !== 'log' || p.K <= 900) && (p.fam !== 'tank' || p.x0 !== Math.round(p.c * p.V)), { fam: 'tank', V: 200, r: 4, c: 0.3, x0: 10, t: 30 }),
  build: p => { const M = m11(p), val = rd(M.v, 3), F = fx(M.v, 4), V3 = fx(M.v, 3), gapText = `${n(M.E)} ${sgn(M.D)} ${Math.abs(M.D) === 1 ? '' : n(Math.abs(M.D))}`;
   const hints = ['Set the right-hand side of the equation equal to 0 and solve: the constant that does this is the equilibrium. For the logistic equation, take the one that is not 0.'];
   if (p.fam === 'tank') { const kt = rd(M.k * p.t, 6); hints.push('The equation is linear with a constant rate, so its solution is the equilibrium plus a gap that shrinks: x(t) = equilibrium + De^(−kt), with D fixed by the starting amount.'); return {
    prompt: `A coolant mixing tank holds ${n(p.V)} L of brine and is kept well stirred. Brine with ${n(p.c)} kg of salt per litre flows in at ${n(p.r)} L/min, and the mixed brine flows out at the same rate, so the volume stays ${n(p.V)} L. At t = 0 the tank holds ${n(p.x0)} kg of salt. The salt x(t) in kg after t minutes obeys x′ = ${n(p.r)} × ${n(p.c)} − (${n(p.r)} ÷ ${n(p.V)})x, that is x′ = ${n(M.rc)} − ${n(M.k)}x. Enter the salt in the tank after ${n(p.t)} minutes in kg, to 3 decimal places, then the equilibrium amount of salt in kg: the constant solution the tank settles towards.`,
    answer: [val, M.E], hints,
    solution: `Setting x′ = 0 gives ${n(M.k)}x = ${n(M.rc)}, so the equilibrium is x = ${n(M.rc)} ÷ ${n(M.k)} = ${n(M.E)} kg. The solution is x(t) = ${n(M.E)} + De^(−${n(M.k)}t), and x(0) = ${n(p.x0)} gives D = ${n(p.x0)} − ${n(M.E)} = ${n(M.D)}, so x(t) = ${gapText}e^(−${n(M.k)}t). At t = ${n(p.t)}: x = ${gapText}${ex(-kt, '')} = ${F}…, which is ${V3} kg to 3 decimal places. As t grows the exponential shrinks to 0, so the salt settles at ${n(M.E)} kg.`,
    guidance: [
     { prompt: `Set x′ = 0 in x′ = ${n(M.rc)} − ${n(M.k)}x. Which constant x makes the right-hand side 0?`, answer: [M.E], explanation: `${n(M.rc)} − ${n(M.k)}x = 0 gives x = ${n(M.rc)} ÷ ${n(M.k)} = ${n(M.E)}. That is the equilibrium: the salt per litre then matches the incoming brine.` },
     { prompt: `The solution has the form x(t) = ${n(M.E)} + De^(−${n(M.k)}t). Which D gives x(0) = ${n(p.x0)}?`, answer: [M.D], explanation: `At t = 0 the exponential is 1, so x(0) = ${n(M.E)} + D. Then D = ${n(p.x0)} − ${n(M.E)} = ${n(M.D)}.` },
     { prompt: `Put t = ${n(p.t)} into x(t) = ${gapText}e^(−${n(M.k)}t). How much salt is there, to 3 decimal places?`, answer: [val], explanation: `${n(M.k)} × ${n(p.t)} = ${n(kt)}, so x = ${gapText}${ex(-kt, '')} = ${F}…, which is ${V3} kg to 3 decimal places.` }
    ] }; }
   if (p.fam === 'log') { const rt = rd(p.r * p.t, 6), den = `1 + ${n(M.D)}e^(−${n(p.r)}t)`; hints.push('The solution of the logistic equation is P(t) = K ÷ (1 + De^(−rt)), where K is the carrying capacity and the constant D is fixed by the starting value.'); return {
    prompt: `Algae grow in the filter of the coolant loop. Their population P, in thousands of cells, follows the logistic equation P′ = ${n(p.r)}P(1 − P ÷ ${n(p.K)}), with t in hours. At t = 0 there are ${n(p.P0)} thousand cells. Enter P after ${n(p.t)} hours, in thousands of cells to 3 decimal places, then the nonzero equilibrium of the equation (the carrying capacity), in thousands of cells.`,
    answer: [val, M.E], hints,
    solution: `P′ = 0 when P = 0 or when 1 − P ÷ ${n(p.K)} = 0, so the nonzero equilibrium is P = ${n(p.K)}: the carrying capacity. The solution is P(t) = ${n(p.K)} ÷ (1 + De^(−${n(p.r)}t)), and P(0) = ${n(p.K)} ÷ (1 + D) = ${n(p.P0)} gives 1 + D = ${n(p.K / p.P0)}, so D = ${n(M.D)}. At t = ${n(p.t)}: P = ${n(p.K)} ÷ (1 + ${n(M.D)}${ex(-rt, '')}) = ${F}…, which is ${V3} thousand cells to 3 decimal places.`,
    guidance: [
     { prompt: `Set P′ = 0 in P′ = ${n(p.r)}P(1 − P ÷ ${n(p.K)}). Apart from P = 0, which constant P makes it 0?`, answer: [M.E], explanation: `The bracket 1 − P ÷ ${n(p.K)} is 0 when P = ${n(p.K)}. That equilibrium is the carrying capacity: the population the filter can hold.` },
     { prompt: `The solution has the form P(t) = ${n(p.K)} ÷ (1 + De^(−${n(p.r)}t)). Which D gives P(0) = ${n(p.P0)}?`, answer: [M.D], explanation: `At t = 0 the exponential is 1, so ${n(p.K)} ÷ (1 + D) = ${n(p.P0)}. Then 1 + D = ${n(p.K)} ÷ ${n(p.P0)} = ${n(p.K / p.P0)}, so D = ${n(M.D)}.` },
     { prompt: `Put t = ${n(p.t)} into P(t) = ${n(p.K)} ÷ (${den}). What is P, to 3 decimal places?`, answer: [val], explanation: `${n(p.r)} × ${n(p.t)} = ${n(rt)}, so P = ${n(p.K)} ÷ (1 + ${n(M.D)}${ex(-rt, '')}) = ${F}…, which is ${V3} thousand cells to 3 decimal places.` }
    ] }; }
   const kt = rd(p.k * p.t, 6); hints.push('The equation is linear with a constant rate, so its solution is the equilibrium plus a gap that shrinks: T(t) = equilibrium + De^(−kt), with D fixed by the starting temperature.'); return {
    prompt: `A coolant line is switched off and its fluid cools towards the temperature of the room. Its temperature T in °C obeys T′ = −${n(p.k)}(T − ${n(p.Ta)}), with t in minutes, and T = ${n(p.T0)} °C at t = 0. Enter the temperature after ${n(p.t)} minutes in °C, to 3 decimal places, then the equilibrium temperature the line settles towards, in °C.`,
    answer: [val, M.E], hints,
    solution: `T′ = 0 when T − ${n(p.Ta)} = 0, so the equilibrium is T = ${n(p.Ta)} °C. The solution is T(t) = ${n(p.Ta)} + De^(−${n(p.k)}t), and T(0) = ${n(p.T0)} gives D = ${n(p.T0)} − ${n(p.Ta)} = ${n(M.D)}, so T(t) = ${gapText}e^(−${n(p.k)}t). At t = ${n(p.t)}: T = ${gapText}${ex(-kt, '')} = ${F}…, which is ${V3} °C to 3 decimal places.`,
    guidance: [
     { prompt: `Set T′ = 0. Which constant T makes −${n(p.k)}(T − ${n(p.Ta)}) equal to 0?`, answer: [M.E], explanation: `The product is 0 when T − ${n(p.Ta)} = 0, so the equilibrium is T = ${n(p.Ta)} °C, the temperature of the room.` },
     { prompt: `The solution has the form T(t) = ${n(p.Ta)} + De^(−${n(p.k)}t). Which D gives T(0) = ${n(p.T0)}?`, answer: [M.D], explanation: `At t = 0 the exponential is 1, so T(0) = ${n(p.Ta)} + D. Then D = ${n(p.T0)} − ${n(p.Ta)} = ${n(M.D)}.` },
     { prompt: `Put t = ${n(p.t)} into T(t) = ${gapText}e^(−${n(p.k)}t). What is the temperature, to 3 decimal places?`, answer: [val], explanation: `${n(p.k)} × ${n(p.t)} = ${n(kt)}, so T = ${gapText}${ex(-kt, '')} = ${F}…, which is ${V3} °C to 3 decimal places.` }
    ] }; }
 },
 /* Given basis solutions: two exponentials e^(at), e^(bt) of y″ − (a + b)y′ + aby = 0, or cos ωt and sin ωt of
    y″ + ω²y = 0. The constants are drawn whole and the starting values built from them. Not the worked example
    (e^(−t) and e^(2t) with C₁ = −1, C₂ = 2). */
 q12: {
  canonical: { fam: 'exp', a: -3, b: 1, C1: 2, C2: 4 },
  draw: R => tries(() => { const C1 = R.nz(-5, 5), C2 = R.nz(-5, 5);
    if (R.next() < 0.6) { const a = R.nz(-4, 3); let b = R.nz(-4, 3); if (b === a) b = a === 3 ? -4 : a + 1; if (b === 0) b = 1; const lo = Math.min(a, b), hi = Math.max(a, b); return { fam: 'exp', a: lo, b: hi, C1, C2 }; }
    return { fam: 'trig', w: R.int(2, 5), C1, C2 }; },
   p => p.fam === 'trig' || (p.a !== p.b && !(p.a === -1 && p.b === 2 && p.C1 === -1 && p.C2 === 2)), { fam: 'exp', a: -3, b: 1, C1: 2, C2: 4 }),
  build: p => { const { y0, v0 } = m12(p);
   const hints = ['Put t = 0 into y and into y′. Every exponential is 1 at t = 0, cos 0 = 1 and sin 0 = 0, so you get two plain equations for C₁ and C₂.', 'Differentiate each basis solution before you put t = 0 in: the derivative of e^(rt) is re^(rt), of cos ωt is −ω sin ωt and of sin ωt is ω cos ωt.'];
   if (p.fam === 'exp') { const P = -(p.a + p.b), Q = p.a * p.b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), y1 = ex(p.a), y2 = ex(p.b), rhs = v0 - p.a * y0, dv = lin([[p.a, 'C₁'], [p.b, 'C₂']]); return {
    prompt: `Mira tests a rover’s shock rig with the equation ${eq} = 0, where y(t) is the arm’s height in cm and t is in seconds. Both y₁ = ${y1} and y₂ = ${y2} are solutions, so by superposition y = C₁${y1} + C₂${y2} is a solution for any constants C₁ and C₂. The test starts with y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter C₁, then C₂.`,
    answer: [p.C1, p.C2], hints,
    solution: `At t = 0 both exponentials are 1, so y(0) = C₁ + C₂ = ${n(y0)}. Differentiating, y′ = ${lin([[p.a, 'C₁' + y1], [p.b, 'C₂' + y2]])}, so y′(0) = ${dv} = ${n(v0)}. Subtract ${par(p.a)} times the first equation from the second: ${co(p.b - p.a, 'C₂')} = ${n(v0)} − ${par(p.a)} × ${par(y0)} = ${n(rhs)}${p.b - p.a === 1 ? '' : `, so C₂ = ${n(p.C2)}`}. Then C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}, and y = ${lin([[p.C1, y1], [p.C2, y2]])}.`,
    guidance: [
     { prompt: `The starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. Take ${par(p.a)} times the first equation away from the second to remove C₁. What is C₂?`, answer: [p.C2], explanation: `The difference is ${co(p.b - p.a, 'C₂')} = ${n(v0)} − ${par(p.a)} × ${par(y0)} = ${n(rhs)}, ${p.b - p.a === 1 ? '' : `, so C₂ = ${n(rhs)} ÷ ${n(p.b - p.a)} = ${n(p.C2)}`}.` },
     { prompt: `With C₂ = ${n(p.C2)}, what is C₁?`, answer: [p.C1], explanation: `C₁ + C₂ = ${n(y0)}, so C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}. Check: ${par(p.a)} × ${par(p.C1)} + ${par(p.b)} × ${par(p.C2)} = ${n(v0)}.` }
    ] }; }
   const w2 = p.w * p.w, c1 = `cos ${wt(p.w)}`, s1 = `sin ${wt(p.w)}`; return {
    prompt: `Mira tests a rover’s shock rig with the equation y″ + ${n(w2)}y = 0, where y(t) is the arm’s height in cm and t is in seconds (angles in radians). Both y₁ = ${c1} and y₂ = ${s1} are solutions, so by superposition y = C₁ ${c1} + C₂ ${s1} is a solution for any constants C₁ and C₂. The test starts with y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter C₁, then C₂.`,
    answer: [p.C1, p.C2], hints,
    solution: `At t = 0, cos 0 = 1 and sin 0 = 0, so y(0) = C₁ = ${n(y0)}. Differentiating, y′ = −${n(p.w)}C₁ sin ${wt(p.w)} + ${n(p.w)}C₂ cos ${wt(p.w)}, so y′(0) = ${n(p.w)}C₂ = ${n(v0)} and C₂ = ${n(v0)} ÷ ${n(p.w)} = ${n(p.C2)}. So y = ${lin([[p.C1, ' ' + c1], [p.C2, ' ' + s1]])}.`,
    guidance: [
     { prompt: `Differentiate: y′ = −${n(p.w)}C₁ sin ${wt(p.w)} + ${n(p.w)}C₂ cos ${wt(p.w)}. At t = 0 this is ${n(p.w)}C₂, and it must equal ${n(v0)}. What is C₂?`, answer: [p.C2], explanation: `sin 0 = 0 and cos 0 = 1, so y′(0) = ${n(p.w)}C₂ = ${n(v0)} and C₂ = ${n(v0)} ÷ ${n(p.w)} = ${n(p.C2)}.` },
     { prompt: `At t = 0, y = C₁ cos 0 + C₂ sin 0. What is C₁?`, answer: [p.C1], explanation: `cos 0 = 1 and sin 0 = 0, so y(0) = C₁, and y(0) = ${n(y0)} gives C₁ = ${n(p.C1)}.` }
    ] }; }
 },
 /* y″ + py′ + qy = 0 with whole roots r₁ < r₂ (both nonzero) and whole constants; y at t = 0.5 or 1 to 3 decimal
    places, skipping rounding ties. Not the worked example (roots −2 and −1, C₁ = −1, C₂ = 2). */
 q13: {
  canonical: { r1: -3, r2: -1, C1: -2, C2: 5, t: 1 },
  draw: R => tries(() => { const r1 = R.int(-6, -1); let r2 = R.int(-6, -1); return { r1: Math.min(r1, r2), r2: Math.max(r1, r2), C1: R.nz(-4, 4), C2: R.nz(-4, 4), t: R.pick([0.5, 1]) }; },
   p => p.r1 !== p.r2 && !edge(v13(p), 3) && Math.abs(v13(p)) >= 0.05 && !(p.r1 === -2 && p.r2 === -1 && p.C1 === -1 && p.C2 === 2), { r1: -3, r2: -1, C1: -2, C2: 5, t: 1 }),
  build: p => { const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]),
   y0 = p.C1 + p.C2, v0 = p.r1 * p.C1 + p.r2 * p.C2, rhs = v0 - p.r1 * y0, v = v13(p), val = rd(v, 3), e1 = ex(p.r1), e2 = ex(p.r2),
   sol = lin([[p.C1, e1], [p.C2, e2]]), at = lin([[p.C1, ex(rd(p.r1 * p.t, 6), '')], [p.C2, ex(rd(p.r2 * p.t, 6), '')]]), dv = lin([[p.r1, 'C₁'], [p.r2, 'C₂']]),
   fac = `(r ${sgn(-p.r1)} ${n(Math.abs(p.r1))})(r ${sgn(-p.r2)} ${n(Math.abs(p.r2))})`; return {
   prompt: `Mira tests a rover’s rear shock with ${eq} = 0, where y(t) is the wheel’s height above its rest position in cm and t is in seconds. It starts at y(0) = ${n(y0)} cm with y′(0) = ${n(v0)} cm/s. Enter the two roots of the characteristic equation, smaller first, then y(${n(p.t)}) in cm to 3 decimal places.`,
   answer: [p.r1, p.r2, val],
   hints: ['Try y = e^(rt). It turns the differential equation into the characteristic equation r² + pr + q = 0, with the same coefficients. Factor it to find the roots.', 'With roots r₁ and r₂, y = C₁e^(r₁t) + C₂e^(r₂t). Use y(0) and y′(0) to find the constants, then put the time in.'],
   solution: `The characteristic equation is ${ch} = 0, which factors as ${fac} = 0, so the roots are ${n(p.r1)} and ${n(p.r2)}. So y = C₁${e1} + C₂${e2}. Then y(0) = C₁ + C₂ = ${n(y0)} and y′(0) = ${dv} = ${n(v0)}. Taking ${par(p.r1)} times the first from the second gives ${co(p.r2 - p.r1, 'C₂')} = ${n(rhs)}${p.r2 - p.r1 === 1 ? '' : `, so C₂ = ${n(p.C2)}`}, and then C₁ = ${n(p.C1)}: y = ${sol}. At t = ${n(p.t)}: y = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
   guidance: [
    { prompt: `Putting y = e^(rt) into the equation gives the characteristic equation ${ch} = 0. What is its smaller root?`, answer: [p.r1], explanation: `${ch} = ${fac}, so the roots are ${n(p.r1)} and ${n(p.r2)}. The smaller is ${n(p.r1)}.` },
    { prompt: 'And what is its larger root?', answer: [p.r2], explanation: `The other factor gives r = ${n(p.r2)}. Each root r gives a solution e^(rt).` },
    { prompt: `With y = C₁${e1} + C₂${e2}, the starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. What is C₂?`, answer: [p.C2], explanation: `Take ${par(p.r1)} times the first equation from the second: ${co(p.r2 - p.r1, 'C₂')} = ${n(rhs)}${p.r2 - p.r1 === 1 ? '' : `, so C₂ = ${n(p.C2)}`}. Then C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}.` },
    { prompt: `So y = ${sol}. What is y(${n(p.t)}), to 3 decimal places?`, answer: [val], explanation: `y(${n(p.t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
   ] }; }
 },
 /* y″ − 2ry′ + r²y = 0, one repeated root r; C₁ = y(0) and C₂ = y′(0) − rC₁, both nonzero. Not the worked example
    (r = −2, y(0) = 3, y′(0) = −1). */
 q14: {
  canonical: { r: -3, y0: 4, v0: -7 },
  draw: R => tries(() => ({ r: R.int(-5, -1), y0: R.nz(-6, 8), v0: R.int(-12, 12) }), p => p.v0 - p.r * p.y0 !== 0 && !(p.r === -2 && p.y0 === 3 && p.v0 === -1), { r: -3, y0: 4, v0: -7 }),
  build: ({ r, y0, v0 }) => { const P = -2 * r, Q = r * r, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), C2 = v0 - r * y0, sq = `(r ${sgn(-r)} ${n(Math.abs(r))})²`; return {
   prompt: `A rover’s front spring is tested with ${eq} = 0, where y(t) is the wheel’s height in cm and t is in seconds. It starts at y(0) = ${n(y0)} cm with y′(0) = ${n(v0)} cm/s. Its characteristic equation has one repeated root r, so the solution has the form y = (C₁ + C₂t)e^(rt). Enter r, then C₁, then C₂.`,
   answer: [r, y0, C2],
   hints: ['The characteristic equation is a perfect square, (r − r₀)² = 0, so its only root is r₀.', 'At t = 0, y = C₁. Differentiate y = (C₁ + C₂t)e^(rt) with the product rule: y′(0) = rC₁ + C₂.'],
   solution: `The characteristic equation is ${ch} = 0, which is ${sq} = 0, so the repeated root is r = ${n(r)}. So y = (C₁ + C₂t)${ex(r)}. At t = 0, y = C₁, so C₁ = ${n(y0)}. The product rule gives y′ = C₂${ex(r)} ${sgn(r)} ${Math.abs(r) === 1 ? '' : n(Math.abs(r))}(C₁ + C₂t)${ex(r)}, so y′(0) = C₂ ${sgn(r)} ${co(Math.abs(r), 'C₁')} = ${n(v0)}. Then C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}.`,
   guidance: [
    { prompt: `The characteristic equation is ${ch} = 0. What is its repeated root?`, answer: [r], explanation: `${ch} = ${sq}, which is 0 only at r = ${n(r)}. One root gives only one exponential, ${ex(r)}, so the second solution is t${ex(r)}.` },
    { prompt: `With y = (C₁ + C₂t)${ex(r)}, what is C₁?`, answer: [y0], explanation: `At t = 0 the bracket is C₁ and the exponential is 1, so y(0) = C₁ = ${n(y0)}.` },
    { prompt: `By the product rule, y′(0) = ${co(r, 'C₁')} + C₂, and y′(0) = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}.` }
   ] }; }
 },
 /* y″ + py′ + qy = 0 with roots a ± bi (p = −2a, q = a² + b²), a from −3 to 0, b from 1 to 4; C₁ = y(0) and
    y′(0) = aC₁ + bC₂ with whole constants. y at a time to 3 decimal places, ties skipped. Not the worked example
    (−1 ± 2i with C₁ = C₂ = 1). */
 q15: {
  canonical: { a: -2, b: 3, C1: 2, C2: -1, t: 0.5 },
  draw: R => tries(() => ({ a: R.int(-3, 0), b: R.int(1, 4), C1: R.nz(-4, 4), C2: R.nz(-4, 4), t: R.pick([0.5, 1, 1.5]) }),
   p => !edge(v15(p), 3) && Math.abs(v15(p)) >= 0.05 && !(p.a === -1 && p.b === 2 && p.C1 === 1 && p.C2 === 1), { a: -2, b: 3, C1: 2, C2: -1, t: 0.5 }),
  build: p => { const { a, b, C1, C2, t } = p, P = -2 * a, Q = a * a + b * b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]),
   y0 = C1, v0 = a * C1 + b * C2, disc = P * P - 4 * Q, v = v15(p), val = rd(v, 3), bt = rd(b * t, 6),
   pre = a === 0 ? '' : ex(a), preAt = a === 0 ? '' : ex(rd(a * t, 6), ''),
   inner = lin([[C1, ` cos ${wt(b)}`], [C2, ` sin ${wt(b)}`]]), innerAt = lin([[C1, ` cos ${n(bt)}`], [C2, ` sin ${n(bt)}`]]),
   sol = a === 0 ? inner : `${pre}(${inner})`, solAt = a === 0 ? innerAt : `${preAt}(${innerAt})`,
   root = a === 0 ? `±${co(b, 'i')}` : `${n(a)} ± ${co(b, 'i')}`, dvt = lin([[a, 'C₁'], [b, 'C₂']]); return {
   prompt: `A rover’s seat spring is modelled by ${eq} = 0, where y(t) is the seat’s height in cm, t is in seconds and angles are in radians. It starts at y(0) = ${n(y0)} cm with y′(0) = ${n(v0)} cm/s. The characteristic equation has complex roots a ± bi with b > 0. Enter the real part a, then b, then y(${n(t)}) in cm to 3 decimal places.`,
   answer: [a, b, val],
   hints: ['Use the quadratic formula on the characteristic equation r² + pr + q = 0. The number under the square root is negative; write √(−d) as i√d, so the roots are a ± bi.', 'By Euler’s formula the real solutions are e^(at) cos bt and e^(at) sin bt. So y = e^(at)(C₁ cos bt + C₂ sin bt), with y(0) = C₁ and y′(0) = aC₁ + bC₂.'],
   solution: `The characteristic equation is ${ch} = 0. The quadratic formula gives r = (${n(-P)} ± √(${n(disc)})) ÷ 2 = ${root}, since √(${n(disc)}) = ${co(2 * b, 'i')}. So a = ${n(a)} and b = ${n(b)}, and y = ${a === 0 ? '' : pre + '('}C₁ cos ${wt(b)} + C₂ sin ${wt(b)}${a === 0 ? '' : ')'}. Then y(0) = C₁ = ${n(y0)}, and y′(0) = ${dvt} = ${n(v0)} gives C₂ = ${n(C2)}. So y = ${sol}, and y(${n(t)}) = ${solAt} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
   guidance: [
    { prompt: `The characteristic equation is ${ch} = 0. Its roots are (${n(-P)} ± √(${n(disc)})) ÷ 2. What is their real part a?`, answer: [a], explanation: a === 0 ? 'The real part is 0 ÷ 2 = 0. The real part sets whether the swings grow or shrink; here they do neither.' : `The real part is ${n(-P)} ÷ 2 = ${n(a)}. It sets how fast the swings shrink: ${ex(a)} gets smaller as t grows.` },
    { prompt: `√(${n(disc)}) = i√${n(-disc)}. What is b, the positive imaginary part of the roots?`, answer: [b], explanation: `√${n(-disc)} = ${n(2 * b)}, so the roots are ${root} and b = ${n(2 * b)} ÷ 2 = ${n(b)}. It is the angular frequency of the swing.` },
    { prompt: `With y = ${a === 0 ? '' : pre + '('}C₁ cos ${wt(b)} + C₂ sin ${wt(b)}${a === 0 ? '' : ')'}, y(0) = C₁ = ${n(y0)} and y′(0) = ${dvt} = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `${co(b, 'C₂')} = ${n(v0)} − ${par(a)} × ${par(y0)} = ${n(v0 - a * y0)}, so C₂ = ${n(C2)}.` },
    { prompt: `So y = ${sol}. What is y(${n(t)}), to 3 decimal places?`, answer: [val], explanation: `With angles in radians, y(${n(t)}) = ${solAt} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
   ] }; }
 },
 /* m x″ + c x′ + k x = 0 with k = mω₀² (whole ω₀ from 2 to 6). The three damping cases are drawn equally often:
    critical c = 2mω₀, under below it, over above it. Not the worked example (m = 2, k = 50, c = 12). */
 q16: {
  canonical: { m: 4, w: 3, c: 30 },
  draw: R => tries(() => { const m = R.int(1, 5), w = R.int(2, 6), cc = 2 * m * w, kind = R.int(1, 3);
    return { m, w, c: kind === 2 ? cc : kind === 3 ? R.int(1, cc - 1) : R.int(cc + 1, cc + 12) }; }, p => !(p.m === 2 && p.w === 5 && p.c === 12), { m: 4, w: 3, c: 30 }),
  build: ({ m, w, c }) => { const k = m * w * w, T = 2 * Math.PI / w, per = rd(T, 3), D = c * c - 4 * m * k, code = D > 0 ? 1 : D === 0 ? 2 : 3,
   eq = lin([[m, 'x″'], [c, 'x′'], [k, 'x']]), word = ['', 'overdamped', 'critically damped', 'underdamped'][code],
   cmp = D > 0 ? 'bigger than' : D === 0 ? 'equal to' : 'smaller than'; return {
   prompt: `A rover’s suspension corner is a mass m = ${n(m)} kg on a spring of stiffness k = ${n(k)} N/m with a damper of c = ${n(c)} N·s/m, so mx″ + cx′ + kx = 0 becomes ${eq} = 0 (x in metres, t in seconds). Enter the natural angular frequency ω₀ = √(k ÷ m) in rad/s, then the natural period 2π ÷ ω₀ in seconds to 3 decimal places, then a code for the damping: 1 for overdamped, 2 for critically damped, 3 for underdamped.`,
   answer: [w, per, code],
   hints: ['ω₀ = √(k ÷ m), and the natural period 2π ÷ ω₀ is the time one full swing would take with the damper removed.', 'Compare c² with 4mk, the two parts of the number under the square root in the characteristic equation: c² bigger means overdamped, equal means critically damped, smaller means underdamped.'],
   solution: `ω₀ = √(${n(k)} ÷ ${n(m)}) = √${n(w * w)} = ${n(w)} rad/s, and the natural period is 2π ÷ ${n(w)} = ${fx(T, 4)}…, which is ${fx(T, 3)} s to 3 decimal places. For the damping, c² = ${n(c * c)} and 4mk = 4 × ${n(m)} × ${n(k)} = ${n(4 * m * k)}, so c² − 4mk = ${n(D)}. c² is ${cmp} 4mk, so the corner is ${word}: code ${code}.`,
   guidance: [
    { prompt: `What is ω₀ = √(k ÷ m) = √(${n(k)} ÷ ${n(m)}), in rad/s?`, answer: [w], explanation: `${n(k)} ÷ ${n(m)} = ${n(w * w)}, and √${n(w * w)} = ${n(w)} rad/s.` },
    { prompt: `What is the natural period 2π ÷ ${n(w)}, in seconds to 3 decimal places?`, answer: [per], explanation: `2π ÷ ${n(w)} = ${fx(T, 4)}…, which is ${fx(T, 3)} s. One radian per second is 1 ÷ (2π) of a full turn per second, so a full turn takes 2π ÷ ω₀ seconds.` },
    { prompt: `What is c² − 4mk = ${n(c)}² − 4 × ${n(m)} × ${n(k)}?`, answer: [D], explanation: `${n(c * c)} − ${n(4 * m * k)} = ${n(D)}. This is the number under the square root when the characteristic equation ${lin([[m, 'r²'], [c, 'r'], [k, '']])} = 0 is solved.` },
    { prompt: 'Which code fits: 1 overdamped (positive), 2 critically damped (zero), 3 underdamped (negative)?', answer: [code], explanation: `c² − 4mk = ${n(D)} is ${D > 0 ? 'positive' : D === 0 ? 'zero' : 'negative'}, so the corner is ${word}: code ${code}.` }
   ] }; }
 },
 /* m, k with k = mω₀²: critical damping c = 2mω₀, repeated root −ω₀, x = (x₀ + (v₀ + ω₀x₀)t)e^(−ω₀t). x at t = 0.5
    or 1 to 3 decimal places, ties skipped. Not the worked example (m = 1, k = 16, x(0) = 2, x′(0) = 0). */
 q17: {
  canonical: { m: 3, w: 2, x0: 6, v0: -4, t: 1 },
  draw: R => tries(() => ({ m: R.int(1, 6), w: R.int(2, 5), x0: R.int(3, 10), v0: R.int(-10, 10), t: R.pick([0.5, 1]) }),
   p => !edge(v17(p), 3) && Math.abs(v17(p)) >= 0.05 && !(p.m === 1 && p.w === 4 && p.x0 === 2 && p.v0 === 0), { m: 3, w: 2, x0: 6, v0: -4, t: 1 }),
  build: p => { const { m, w, x0, v0, t } = p, k = m * w * w, c = 2 * m * w, C2 = v0 + w * x0, v = v17(p), val = rd(v, 3), wtt = rd(w * t, 6),
   br = lin([[x0, ''], [C2, 't']]), brAt = n(rd(x0 + C2 * t, 6)); return {
   prompt: `Mira wants the rover’s rear corner critically damped: no bounce, and the quickest settling. The corner has mass m = ${n(m)} kg and spring stiffness k = ${n(k)} N/m. Enter the damping constant c in N·s/m that makes mx″ + cx′ + kx = 0 critically damped. Then, with that damper, the corner is pushed to x(0) = ${n(x0)} cm and released with x′(0) = ${n(v0)} cm/s (t in seconds): enter x(${n(t)}) in cm, to 3 decimal places.`,
   answer: [c, val],
   hints: ['Critical damping is the boundary case c² = 4mk, so c = 2√(mk).', 'With critical damping the characteristic equation has one repeated root r = −c ÷ (2m), so x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁.'],
   solution: `Critical damping needs c² = 4mk = 4 × ${n(m)} × ${n(k)} = ${n(c * c)}, so c = ${n(c)} N·s/m. The characteristic equation ${lin([[m, 'r²'], [c, 'r'], [k, '']])} = 0 then has the repeated root r = −${n(c)} ÷ ${n(2 * m)} = −${n(w)}, so x = (C₁ + C₂t)e^(−${n(w)}t). C₁ = x(0) = ${n(x0)}, and C₂ = x′(0) − rC₁ = ${n(v0)} + ${n(w)} × ${n(x0)} = ${n(C2)}. So x = (${br})e^(−${n(w)}t), and x(${n(t)}) = ${brAt}${ex(-wtt, '')} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
   guidance: [
    { prompt: `Critical damping needs c² = 4mk. What is c = 2√(${n(m)} × ${n(k)}), in N·s/m?`, answer: [c], explanation: `${n(m)} × ${n(k)} = ${n(m * k)}, √${n(m * k)} = ${n(m * w)}, so c = 2 × ${n(m * w)} = ${n(c)} N·s/m.` },
    { prompt: `With c = ${n(c)}, the characteristic equation ${lin([[m, 'r²'], [c, 'r'], [k, '']])} = 0 has one repeated root r = −c ÷ (2m). What is r?`, answer: [-w], explanation: `r = −${n(c)} ÷ ${n(2 * m)} = −${n(w)}. It is −ω₀ = −√(k ÷ m): critical damping settles at the spring’s own rate.` },
    { prompt: `With x = (C₁ + C₂t)e^(−${n(w)}t), C₁ = x(0) = ${n(x0)} and C₂ = x′(0) − rC₁. What is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} − ${par(-w)} × ${n(x0)} = ${n(v0)} + ${n(w * x0)} = ${n(C2)}.` },
    { prompt: `So x = (${br})e^(−${n(w)}t). What is x(${n(t)}), to 3 decimal places?`, answer: [val], explanation: `x(${n(t)}) = ${brAt}${ex(-wtt, '')} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
   ] }; }
 },
 /* y″ + py′ + qy = f with f = At + B (guess Ct + D) or f = Ae^(kt) + B (guess Ce^(kt) + D, k not a root of
    r² + pr + q). C and D are drawn whole and f is built from them. Not the worked example (y″ + y′ + 2y = 4t + 6). */
 q18: {
  canonical: { fam: 'exp', p: 4, q: 3, k: 2, C: 3, D: -2 },
  draw: R => tries(() => ({ fam: R.pick(['poly', 'exp']), p: R.int(1, 6), q: R.int(1, 9), k: R.pick([-2, -1, 1, 2, 3]), C: R.nz(-4, 5), D: R.int(-4, 4) }),
   x => (x.fam === 'poly' || x.k * x.k + x.p * x.k + x.q !== 0) && !(x.fam === 'poly' && x.p === 1 && x.q === 2 && x.C === 2 && x.D === 2), { fam: 'exp', p: 4, q: 3, k: 2, C: 3, D: -2 }),
  build: x => { const { p, q, C, D } = x, lhs = lin([[1, 'y″'], [p, 'y′'], [q, 'y']]), Bc = q * D;
   const hints = ['Put the guess into the left-hand side: differentiate it twice, then collect the terms that match each part of the right-hand side.', 'Match coefficients: the parts with t (or with the exponential) must agree on both sides, and so must the constant parts. Solve for C first, then D.'];
   if (x.fam === 'poly') { const A = q * C, B = p * C + q * D, f = lin([[A, 't'], [B, '']]); return {
    prompt: `An engine mount’s offset y(t) obeys ${lhs} = ${f}, where the right-hand side is a push from the engine that grows steadily with time t. The method of undetermined coefficients guesses a particular solution of the same form as the push: yₚ = Ct + D. Enter C, then D.`,
    answer: [C, D], hints,
    solution: `For yₚ = Ct + D, yₚ′ = C and yₚ″ = 0. The left-hand side is ${co(p, 'C')} + ${q === 1 ? '' : n(q)}(Ct + D) = ${co(q, 'Ct')} + (${co(p, 'C')} + ${co(q, 'D')}). Matching the t terms: ${co(q, 'C')} = ${n(A)}${q === 1 ? '' : `, so C = ${n(C)}`}. Matching the constants: ${n(p)} × ${par(C)} + ${co(q, 'D')} = ${n(B)}, so ${co(q, 'D')} = ${n(B - p * C)}${q === 1 ? '' : ` and D = ${n(D)}`}. So yₚ = ${lin([[C, 't'], [D, '']])}.`,
    guidance: [
     { prompt: `With yₚ = Ct + D, the left-hand side is ${co(q, 'Ct')} + (${co(p, 'C')} + ${co(q, 'D')}). Match the t terms with ${f}. What is C?`, answer: [C], explanation: `The t terms give ${co(q, 'C')} = ${n(A)}${q === 1 ? '' : `, so C = ${n(A)} ÷ ${n(q)} = ${n(C)}`}.` },
     { prompt: `Now match the constant terms: ${n(p)} × ${par(C)} + ${co(q, 'D')} = ${n(B)}. What is D?`, answer: [D], explanation: `${co(q, 'D')} = ${n(B)} − ${par(p * C)} = ${n(B - p * C)}${q === 1 ? '' : `, so D = ${n(D)}`}.` }
    ] }; }
   const { k } = x, Pk = k * k + p * k + q, A = C * Pk, f = lin([[A, ex(k)], [Bc, '']]), pk = `${n(k * k)} ${sgn(p * k)} ${n(Math.abs(p * k))} + ${n(q)}`; return {
    prompt: `An engine mount’s offset y(t) obeys ${lhs} = ${f}, where the right-hand side is a push from the engine that changes exponentially with time t. The number ${n(k)} is not a root of the characteristic equation, so the method of undetermined coefficients guesses a particular solution of the same form as the push: yₚ = C${ex(k)} + D. Enter C, then D.`,
    answer: [C, D], hints,
    solution: `For yₚ = C${ex(k)} + D, yₚ′ = ${co(k, 'C')}${ex(k)} and yₚ″ = ${co(k * k, 'C')}${ex(k)}. The left-hand side is (${pk})C${ex(k)} + ${co(q, 'D')} = ${co(Pk, 'C')}${ex(k)} + ${co(q, 'D')}. Matching the exponential terms: ${co(Pk, 'C')} = ${n(A)}, so C = ${n(C)}. Matching the constants: ${co(q, 'D')} = ${n(Bc)}${q === 1 ? '' : `, so D = ${n(D)}`}. So yₚ = ${lin([[C, ex(k)], [D, '']])}.`,
    guidance: [
     { prompt: `With yₚ = C${ex(k)} + D, the left-hand side is (k² + pk + q)C${ex(k)} + ${co(q, 'D')} with k = ${n(k)}. Match the exponential terms with ${f}. What is C?`, answer: [C], explanation: `k² + pk + q = ${pk} = ${n(Pk)}, so ${co(Pk, 'C')} = ${n(A)} and C = ${n(A)} ÷ ${par(Pk)} = ${n(C)}.` },
     { prompt: `Now match the constant terms: ${co(q, 'D')} = ${n(Bc)}. What is D?`, answer: [D], explanation: `The constant D has zero derivatives, so only ${co(q, 'D')} is left on the left-hand side${q === 1 ? '' : `: D = ${n(Bc)} ÷ ${n(q)} = ${n(D)}`}.` }
    ] }; }
 },
 /* y″ + py′ + qy = F cos ωt + G sin ωt with yₚ = A cos ωt + B sin ωt. With d = q − ω² and s = pω: dA + sB = F and
    −sA + dB = G. A and B are drawn whole (not both 0) and F, G built from them; p ≥ 1, so d² + s² > 0, and d ≠ 0 keeps the working free of 0 × terms. Not the worked
    example (y″ + 2y′ + 2y = 3 cos t − sin t). */
 q19: {
  canonical: { p: 2, q: 13, w: 3, A: 2, B: -1 },
  draw: R => tries(() => ({ p: R.int(1, 5), q: R.int(1, 12), w: R.int(1, 4), A: R.int(-4, 4), B: R.int(-4, 4) }),
   x => (x.A !== 0 || x.B !== 0) && x.q !== x.w * x.w && !(x.p === 2 && x.q === 2 && x.w === 1 && x.A === 1 && x.B === 1), { p: 2, q: 13, w: 3, A: 2, B: -1 }),
  build: x => { const { p, q, w, A, B } = x, { d, s, F, Gs, det } = m19(x), lhs = lin([[1, 'y″'], [p, 'y′'], [q, 'y']]),
   cs = ` cos ${wt(w)}`, sn = ` sin ${wt(w)}`, f = lin([[F, cs], [Gs, sn]]), w2 = w * w,
   eqC = lin([[d, 'A'], [s, 'B']]), eqS = lin([[-s, 'A'], [d, 'B']]); return {
   prompt: `The flywheel shakes its engine mount with a push that turns at ${n(w)} rad/s. The mount’s offset y(t) obeys ${lhs} = ${f}, with t in seconds and angles in radians. By undetermined coefficients, the particular solution has the form yₚ = A cos ${wt(w)} + B sin ${wt(w)}. Enter A, then B.`,
   answer: [A, B],
   hints: ['Differentiate the guess twice: the derivative of cos ωt is −ω sin ωt, and of sin ωt is ω cos ωt. Put the three pieces into the left-hand side.', 'Collect the cos terms and the sin terms separately and match each with the right-hand side. That gives two equations for A and B.'],
   solution: `yₚ′ = ${co(-w, 'A')} sin ${wt(w)} + ${co(w, 'B')} cos ${wt(w)} and yₚ″ = ${co(-w2, 'A')} cos ${wt(w)} ${co(-w2, 'B').replace('−', '− ')} sin ${wt(w)}. In the left-hand side the cos terms add up to (${n(q)} − ${n(w2)})A + ${n(p)} × ${n(w)}B = ${eqC}, and the sin terms to ${eqS}. Matching the right-hand side: ${eqC} = ${n(F)} and ${eqS} = ${n(Gs)}. Solving the pair, A = (${par(d)} × ${par(F)} − ${par(s)} × ${par(Gs)}) ÷ (${par(d)}² + ${n(s)}²) = ${n(d * F - s * Gs)} ÷ ${n(det)} = ${n(A)} and B = (${n(s)} × ${par(F)} + ${par(d)} × ${par(Gs)}) ÷ ${n(det)} = ${n(s * F + d * Gs)} ÷ ${n(det)} = ${n(B)}.`,
   guidance: [
    { prompt: `In the left-hand side, the cos terms add up to (q − ω²)A + pωB with q = ${n(q)}, ω = ${n(w)} and p = ${n(p)}. What is q − ω²?`, answer: [d], explanation: `q − ω² = ${n(q)} − ${n(w2)} = ${n(d)}. The −ω²A comes from yₚ″ and the pωB from yₚ′.` },
    { prompt: `Matching gives ${eqC} = ${n(F)} (cos terms) and ${eqS} = ${n(Gs)} (sin terms). What is A?`, answer: [A], explanation: `Multiply the first by ${par(d)} and the second by ${par(s)} and subtract to remove B: ${n(det)}A = ${n(d * F - s * Gs)}, so A = ${n(A)}.` },
    { prompt: `And what is B?`, answer: [B], explanation: `Multiply the first by ${par(s)} and the second by ${par(d)} and add to remove A: ${n(det)}B = ${n(s * F + d * Gs)}, so B = ${n(B)}.` }
   ] }; }
 },
 /* m x″ + c x′ + k x = F₀ cos ωt with c ≥ 1: amplitude F₀ ÷ √((k − mω²)² + (cω)²) to 3 decimal places, between 0.05
    and 50, ties skipped. Not the worked example (m = 1, c = 2, k = 7, F₀ = 10, ω = 2). */
 q20: {
  canonical: { m: 2, c: 3, k: 40, F: 12, w: 4 },
  draw: R => tries(() => ({ m: R.int(1, 4), c: R.int(1, 6), k: R.int(10, 60), F: R.int(2, 20), w: R.int(1, 6) }),
   x => { const a = m20(x).amp; return a >= 0.05 && a <= 50 && !edge(a, 3) && !(x.m === 1 && x.c === 2 && x.k === 7 && x.F === 10 && x.w === 2); }, { m: 2, c: 3, k: 40, F: 12, w: 4 }),
  build: x => { const { m, c, k, F, w } = x, { d, s, D2, amp } = m20(x), val = rd(amp, 3), lhs = lin([[m, 'x″'], [c, 'x′'], [k, 'x']]), mw2 = m * w * w; return {
   prompt: `An engine mount of mass m = ${n(m)} kg sits on a spring of stiffness k = ${n(k)} N/m with damping c = ${n(c)} N·s/m. The engine pushes it with a force of ${n(F)} cos ${wt(w)} newtons, so ${lhs} = ${n(F)} cos ${wt(w)} (x in metres, t in seconds, angles in radians). Once the start-up wobble has died away, the mount follows the steady periodic solution x = C cos(${wt(w)} − γ). Enter its amplitude C in metres, to 3 decimal places.`,
   answer: [val],
   hints: ['The steady periodic solution is the particular solution A cos ωt + B sin ωt from undetermined coefficients, and its amplitude is C = √(A² + B²).', 'Worked out in general, that amplitude is C = F₀ ÷ √((k − mω²)² + (cω)²).'],
   solution: `Here F₀ = ${n(F)} and ω = ${n(w)}. k − mω² = ${n(k)} − ${n(m)} × ${n(w * w)} = ${n(d)} and cω = ${n(c)} × ${n(w)} = ${n(s)}. So (k − mω²)² + (cω)² = ${n(d * d)} + ${n(s * s)} = ${n(D2)}, and C = ${n(F)} ÷ √${n(D2)} = ${fx(amp, 4)}…, which is ${fx(amp, 3)} m to 3 decimal places.`,
   guidance: [
    { prompt: `What is k − mω² = ${n(k)} − ${n(m)} × ${n(w)}²?`, answer: [d], explanation: `${n(m)} × ${n(w * w)} = ${n(mw2)}, so k − mω² = ${n(k)} − ${n(mw2)} = ${n(d)}. It compares the spring with the push: it is 0 when ω is the natural angular frequency.` },
    { prompt: `What is cω = ${n(c)} × ${n(w)}?`, answer: [s], explanation: `cω = ${n(s)}. This is the damper’s share, and it keeps the amplitude finite.` },
    { prompt: `What is (k − mω²)² + (cω)²?`, answer: [D2], explanation: `${par(d)}² + ${n(s)}² = ${n(d * d)} + ${n(s * s)} = ${n(D2)}.` },
    { prompt: `What is the amplitude C = ${n(F)} ÷ √${n(D2)}, to 3 decimal places?`, answer: [val], explanation: `√${n(D2)} = ${fx(Math.sqrt(D2), 4)}…, and ${n(F)} ÷ √${n(D2)} = ${fx(amp, 4)}…, which is ${fx(amp, 3)} m to 3 decimal places.` }
   ] }; }
 }
});
})();
