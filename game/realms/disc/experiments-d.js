/* Discrete mathematics concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* aₙ = aₙ₋₁ + 2aₙ₋₂ (roots 2 and −1) with A from 1 to 3 and B from 1 to 7: a₁₀ = 1024A + B. */
 q31: t => { t = T(t); const k = t + 10, A = 1 + k % 3, B = 1 + Math.floor(k / 3), a0 = A + B, a1 = 2 * A - B, a10 = 1024 * A + B;
  return E('Predict a₁₀ with the characteristic root technique.', `x² = x + 2 gives (x − 2)(x + 1) = 0, roots 2 and −1, so aₙ = A × 2ⁿ + B × (−1)ⁿ. A + B = ${n(a0)} and 2A − B = ${n(a1)} give A = ${n(A)} and B = ${n(B)}. a₁₀ = ${n(A)} × 1024 + ${n(B)} × 1 = ${n(a10)}.`, [['a₁₀', a10], ['A', A], ['B', B]]); },
 /* Tilings of a strip 3 to 13 long with 1-long and 2-long tiles. */
 q32: t => { t = T(t); const len = 3 + (t + 10) % 11, c = [1, 1]; for (let i = 2; i <= len; i++) c.push(c[i - 1] + c[i - 2]);
  return E('Predict the number of tilings of the strip.', `tₙ = tₙ₋₁ + tₙ₋₂ with t₀ = 1 and t₁ = 1 gives ${c.join(', ')} for lengths 0 to ${n(len)}, so there are ${n(c[len])} tilings.`, [['Tilings', c[len]], ['Tilings one shorter', c[len - 1]], ['Tilings two shorter', c[len - 2]]]); },
 /* (1 + x + x² + x³ + x⁴)(1 + x² + x⁴ + x⁶)(1 + x⁵ + x¹⁰): the coefficient of xᵏ for k from 1 to 20. */
 q33: t => { t = T(t); const k = 1 + (t + 10) % 20, cnt = [0, 1, 2].map(f => { let c = 0; for (let w = 0; w <= 3; w++) { const o = k - 5 * f - 2 * w; if (o >= 0 && o <= 4) c++; } return c; }), coef = cnt[0] + cnt[1] + cnt[2];
  return E('Predict the coefficient of xᵏ: the number of ways to pay exactly k credits.', `With no five-credit token there are ${cnt[0]} ways, with one ${cnt[1]}, with two ${cnt[2]}: ${cnt[0]} + ${cnt[1]} + ${cnt[2]} = ${coef}.`, [['Coefficient', coef], ['Ways with no five', cnt[0]], ['Product at x = 1', 60]]); },
 /* Crews of 3 from 5 to 12 tilers, split on one named tiler. */
 q34: t => { t = T(t); const N = 5 + (t + 10) % 8, C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); }, w = C(N - 1, 2), wo = C(N - 1, 3);
  return E('Predict the number of crews of 3, counted directly as C(n, 3).', `With the named tiler: C(${n(N - 1)}, 2) = ${n(w)}. Without: C(${n(N - 1)}, 3) = ${n(wo)}. Together ${n(w)} + ${n(wo)} = ${n(w + wo)}, which is C(${n(N)}, 3).`, [['Crews of 3', w + wo], ['Crews with the named tiler', w], ['Crews without', wo]]); },
 /* −5 to −65 divided by 7. */
 q35: t => { t = T(t); const a = -5 - 3 * (t + 10), q = Math.floor(a / 7), r = a - 7 * q;
  return E('Predict the remainder: a whole number from 0 to 6.', `The first multiple of 7 at or below ${n(a)} is 7 × ${par(q)} = ${n(7 * q)}, so ${n(a)} = 7 × ${par(q)} + ${n(r)}.`, [['Remainder', r], ['Quotient', q]]); },
 /* A Wednesday (code 2) and 40 to 240 days on. */
 q36: t => { t = T(t); const N = 40 + 10 * (t + 10), Nr = N % 7, day = (2 + Nr) % 7;
  return E('Predict the code of the day, from 0 for Monday to 6 for Sunday.', `${n(N)} = 7 × ${n(Math.floor(N / 7))} + ${n(Nr)}, so the weekday moves on by ${n(Nr)}: 2 + ${n(Nr)} = ${n(2 + Nr)}${2 + Nr >= 7 ? `, and ${n(2 + Nr)} mod 7 = ${n(day)}` : ''}.`, [['Day code', day], ['Days mod 7', Nr]]); },
 /* v junctions, every one of degree k (a road map for each pair exists). */
 q37: t => { t = T(t); const pairs = [[4, 2], [4, 3], [5, 2], [5, 4], [6, 2], [6, 3], [6, 4], [6, 5], [7, 2], [7, 4], [7, 6], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]], [v, k] = pairs[(t + 10) % pairs.length];
  return E('Predict the number of roads.', `The degrees add up to ${n(v)} × ${n(k)} = ${n(v * k)}, which is twice the number of roads, so there are ${n(v * k)} ÷ 2 = ${n(v * k / 2)} roads.`, [['Roads', v * k / 2], ['Sum of degrees', v * k]]); },
 /* A connected network of v junctions and e roads, trimmed to a tree. */
 q38: t => { t = T(t); const v = 6 + (t + 10) % 10, e = v + 2 + (t + 10) % 4, keep = v - 1;
  return E('Predict the number of roads to close.', `A tree on ${n(v)} junctions keeps ${n(v)} − 1 = ${n(keep)} roads, so ${n(e)} − ${n(keep)} = ${n(e - keep)} must close.`, [['Roads to close', e - keep], ['Roads in the tree', keep]]); },
 /* Eight connected road maps, given by their degrees. */
 q39: t => { t = T(t); const maps = [[2, 2, 2, 2], [1, 2, 2, 1], [3, 3, 3, 3], [2, 2, 4, 2, 2], [3, 2, 3, 2], [3, 1, 1, 1], [2, 3, 3, 2, 2], [3, 3, 3, 3, 2, 2]], d = maps[(t + 10) % maps.length], odd = d.filter(x => x % 2).length, code = odd === 0 ? 2 : odd === 2 ? 1 : 0;
  return E('Predict the Euler code: 2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither.', `${odd === 0 ? 'No degree is odd' : `${odd} degrees are odd`}, so the code is ${code}.`, [['Euler code', code], ['Odd degrees', odd]]); },
 /* The final plan (degrees 2, 4, 3, 3, 2, 4 and 2: 10 roads, code 1) with 200 to 460 posts. */
 q40: t => { t = T(t); const N = 200 + 13 * (t + 10), q = Math.floor(N / 10), r = N % 10;
  return E('Predict the number of posts left over.', `The degrees add up to 20, so there are 10 roads. ${n(N)} = 10 × ${n(q)} + ${n(r)}, so ${n(r)} ${r === 1 ? 'post is' : 'posts are'} left over.`, [['Posts left over', r], ['Roads', 10], ['Posts per road', q]]); }
});
})();
