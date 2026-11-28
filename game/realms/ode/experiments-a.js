/* Differential equations concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const r6 = x => Math.round(x * 1e6) / 1e6, D = ['y', 'y′', 'y″', 'y‴'];
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 2y′ = ty tried with y = Ce^(kt): k = t ÷ 2. */
 q01: t => { t = T(t);
  return E('Predict the k that makes y = Ce^(kt) a solution.', `Put y = Ce^(kt) and y′ = kCe^(kt) in: 2kCe^(kt) = ${n(t)}Ce^(kt). Dividing by Ce^(kt) gives 2k = ${n(t)}, so k = ${n(t / 2)}.`, [['k', t / 2], ['Coefficient of y', t]]); },
 /* An equation whose highest derivative has order 1, 2 or 3, squared in every other slider value. */
 q02: t => { t = T(t); const o = 1 + (t + 10) % 3, sq = (t + 10) % 2 === 1, d = D[o];
  return E('Predict the order of the equation.', `The highest derivative is ${d}, so the order is ${o}. ${sq ? `The term (${d})² squares a derivative, so the equation is nonlinear.` : 'Every term is y or a derivative times a number, or a function of t, so the equation is linear.'}`, [['Order', o], ['Linear (1) or nonlinear (0)', sq ? 0 : 1]]); },
 /* y′ = 6x² − 2x + 4 with y(1) = 20, so y = 2x³ − x² + 4x + 15, asked at x from 2 to 6. */
 q03: t => { t = T(t); const x = 2 + (t + 10) % 5, F = 2 * x * x * x - x * x + 4 * x;
  return E('Predict y at the later x.', `The general solution is y = 2x³ − x² + 4x + C, and y(1) = 20 gives 5 + C = 20, so C = 15. At x = ${n(x)}: ${n(F)} + 15 = ${n(F + 15)}.`, [['y at the later x', F + 15], ['C', 15]]); },
 /* y′ = (x + 1)(2y − 8) at the point (2, t): the slope is 3(2t − 8). */
 q04: t => { t = T(t); const v = 2 * t - 8;
  return E('Predict the slope of the field at the point.', `At (2, ${n(t)}): (2 + 1)(2 × ${par(t)} − 8) = 3 × ${par(v)} = ${n(3 * v)}. The equilibrium solution is y = 4, where 2y − 8 = 0.`, [['Slope', 3 * v], ['Equilibrium y', 4]]); },
 /* Two steps of Euler's method with h = 0.1 for y′ = x + 2y from y(0) = t. */
 q05: t => { t = T(t); const s0 = 2 * t, y1 = r6(t + 0.1 * s0), s1 = r6(0.1 + 2 * y1), y2 = r6(y1 + 0.1 * s1);
  return E('Predict the estimate of y(0.2) after 2 steps of Euler\'s method.', `Slope at (0, ${n(t)}): ${n(s0)}, so y₁ = ${n(t)} + 0.1 × ${par(s0)} = ${n(y1)}. Slope at (0.1, ${n(y1)}): 0.1 + 2 × ${par(y1)} = ${n(s1)}, so y₂ = ${n(y1)} + 0.1 × ${par(s1)} = ${n(y2)}.`, [['Estimate of y(0.2)', y2], ['y after one step', y1]]); },
 /* y′ = 0.1t·y (k = 0.1 × slider), y(0) = 5, asked at time 2 to 3 decimal places. */
 q06: t => { t = T(t); const k = t / 10, e = 2 * k, v = Math.round(5 * Math.exp(e) * 1000) / 1000;
  return Object.assign(E('Predict y at time 2, to 3 decimal places.', `Separating gives ln y = ${n(k)}t + c, so y = 5e^(${n(k)}t). At time 2 the exponent is ${n(e)}, and 5e^(${n(e)}) = ${n(v)} to 3 decimal places.`, [['y at time 2', v], ['Exponent', e]]), { tolerance: 0.0005 }); },
 /* 2y′ + 6y = 30 with y(0) = t: y = 5 + (t − 5)e^(−3t), asked at time 1 to 3 decimal places. */
 q07: t => { t = T(t); const D = t - 5, v = Math.round((5 + D * Math.exp(-3)) * 1000) / 1000;
  return Object.assign(E('Predict y(1), to 3 decimal places.', `Dividing by 2 gives y′ + 3y = 15, with integrating factor e^(3t). The solution is y = 5 + De^(−3t), and y(0) = ${n(t)} gives D = ${n(D)}. So y(1) = 5 + ${par(D)} × e^(−3) = ${n(v)} to 3 decimal places.`, [['y(1)', v], ['D', D]]), { tolerance: 0.0005 }); },
 /* A 200 litre tank, 4 litres per minute of brine at 0.25 kg per litre, starting with 2(t + 10) kg of salt. */
 q08: t => { t = T(t); const x0 = 2 * (t + 10), D = x0 - 50, v = Math.round((50 + D * Math.exp(-0.6)) * 1000) / 1000;
  return Object.assign(E('Predict the salt after 30 minutes, in kg to 3 decimal places.', `x′ = 1 − 0.02x, so x = 50 + Ce^(−0.02t) with C = ${n(x0)} − 50 = ${n(D)}. After 30 minutes x = 50 + ${par(D)} × e^(−0.6) = ${n(v)} kg to 3 decimal places.`, [['Salt after 30 minutes (kg)', v], ['Long-run salt (kg)', 50]]), { tolerance: 0.0005 }); },
 /* y′ = (y − 1)(c − y) with c = t: the larger root is the stable equilibrium (a double root when c = 1). */
 q09: t => { t = T(t); const s = Math.max(1, t), u = Math.min(1, t);
  return E('Predict the stable equilibrium.', t === 1 ? 'The two roots meet at y = 1, a double root: y′ = −(y − 1)² is never positive, so y falls towards 1 from above and away from it below.' : `The equilibria are ${n(u)} and ${n(s)}. Between them y′ is positive, and above ${n(s)} it is negative, so y = ${n(s)} is stable and y = ${n(u)} is unstable.`, [['Stable equilibrium', s], ['Unstable equilibrium', u]]); },
 /* P′ = 0.4P − 0.0005P², P(0) = 100: K = 800, A = 7, and the time to reach L = 100 + 30(t + 10) to 2 decimal places. */
 q10: t => { t = T(t); const L = 100 + 30 * (t + 10), m = 7 * L / (800 - L), v = Math.round(Math.log(m) / 0.4 * 100) / 100;
  return Object.assign(E('Predict the time to reach the level, in days to 2 decimal places.', `K = 0.4 ÷ 0.0005 = 800 and A = (800 − 100) ÷ 100 = 7. Then e^(0.4t) = 7 × ${n(L)} ÷ ${n(800 - L)} = ${n(m)}, so t = ln ${n(m)} ÷ 0.4 = ${n(v)} days.`, [['Time (days)', v], ['Carrying capacity', 800]]), { tolerance: 0.005 }); },
});
})();
