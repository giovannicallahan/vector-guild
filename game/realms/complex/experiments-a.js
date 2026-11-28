/* Complex analysis: the plane of numbers concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const cx = (a, b) => { if (b === 0) return n(a); const im = (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; if (a === 0) return (b < 0 ? '−' : '') + im; return `${n(a)} ${b < 0 ? '−' : '+'} ${im}`; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const piT = (p, q) => { if (p === 0) return '0'; const g = gcd(p, q); p /= g; q /= g; const top = p === 1 ? 'π' : p === -1 ? '−π' : n(p) + 'π'; return q === 1 ? top : `${top} ÷ ${n(q)}`; };
const r2 = x => { const r = Math.round(x * 100) / 100; return r === 0 ? 0 : r; };
const d2 = x => r2(x).toFixed(2).replace('-', '−');
const root = k => ({ 2: 'square', 3: 'cube', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth' })[k] + ' roots';
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* z = 3 + 2i times w = t + 4i: Re(zw) = 3t − 8. */
 q01: t => { t = T(t); const re = 3 * t - 8, im = 2 * t + 12;
  return E('Predict the real part of zw.', `For zw = (3 + 2i)(${cx(t, 4)}), the real part is 3 × ${par(t)} + (2i) × (4i) = ${n(3 * t)} − 8 = ${n(re)}, because i² = −1. The imaginary part is 3 × 4 + 2 × ${par(t)} = ${n(im)}.`, [['Re(zw)', re], ['Im(zw)', im], ['Re(z + w)', 3 + t]]); },
 /* (t + 5i) ÷ (1 + 2i) = ((t + 10) + (5 − 2t)i) ÷ 5. */
 q02: t => { t = T(t); const re = (t + 10) / 5, im = (5 - 2 * t) / 5;
  return E('Predict the real part of z ÷ w, as an exact decimal.', `Multiply the top and the bottom by w̄ = 1 − 2i. The bottom is 1 + 4 = 5 and the top is (${cx(t, 5)})(1 − 2i) = ${cx(t + 10, 5 - 2 * t)}. So the real part is ${n(t + 10)} ÷ 5 = ${n(re)}.`, [['Re(z ÷ w)', re], ['Im(z ÷ w)', im], ['w w̄', 5]]); },
 /* z = −4 + ti, left of the imaginary axis: Arg z = π − arctan(|t| ÷ 4), negative below the real axis. */
 q03: t => { t = T(t); const arg = Math.atan2(t, -4), mod = Math.hypot(4, t);
  return E('Predict the principal argument Arg z, in radians, to 2 decimal places.', t === 0 ? 'z = −4 lies on the negative real axis, so Arg z = π ≈ 3.14.' : `z = ${cx(-4, t)} lies left of the imaginary axis and ${t > 0 ? 'above' : 'below'} the real axis. The angle with the real axis is arctan(${n(Math.abs(t))} ÷ 4) ≈ ${n(Math.atan(Math.abs(t) / 4))}, so Arg z = ${t > 0 ? '' : '−'}(π − ${n(Math.atan(Math.abs(t) / 4))}) ≈ ${d2(arg)}.`, [['Arg z', r2(arg)], ['|z|', r2(mod)]]); },
 /* 4e^(iθ) with θ = tπ ÷ 6: real part 4 cos θ. */
 q04: t => { t = T(t); const th = t * Math.PI / 6, re = 4 * Math.cos(th), im = 4 * Math.sin(th);
  return E('Predict the real part of z, to 2 decimal places.', `By Euler's formula z = 4(cos θ + i sin θ), so the real part is 4 cos(${piT(t, 6)}) ≈ ${d2(re)}.`, [['Re z', r2(re)], ['Im z', r2(im)]]); },
 /* (1 + i)^p, p from 1 to 12: (√2)^p e^(ipπ ÷ 4). */
 q05: t => { t = T(t); const p = 1 + (t + 10) % 12; let re = 1, im = 0; for (let i = 0; i < p; i++) [re, im] = [re - im, re + im];
  return E('Predict the real part of the power.', `1 + i = √2 e^(iπ ÷ 4). By de Moivre's formula the power has size (√2) to the power ${n(p)} and angle ${piT(p, 4)}, which gives ${cx(re, im)}: real part ${n(re)}.`, [['Real part', re], ['Imaginary part', im]]); },
 /* The p roots of unity, p from 2 to 8: the one with the smallest positive argument is at 2π ÷ p. */
 q06: t => { t = T(t); const p = 2 + (t + 10) % 7, re = Math.cos(2 * Math.PI / p);
  return E('Predict the real part of the root with the smallest positive argument, to 2 decimal places.', `1 has modulus 1 and argument 0, so the roots have modulus 1 and arguments 2πk ÷ ${n(p)}. The smallest positive one is ${piT(2, p)}, and cos(${piT(2, p)}) ≈ ${d2(re)}.`, [['Real part', r2(re)], ['Number of roots', p]]); },
 /* f(z) = z² + 2 − 3i at z = t + 2i: u = t² − 4 + 2, v = 4t − 3. */
 q07: t => { t = T(t); const u = t * t - 2, v = 4 * t - 3;
  return E('Predict u, the real part of f(z).', `u(x, y) = x² − y² + 2 and v(x, y) = 2xy − 3. At x = ${n(t)}, y = 2: u = ${n(t * t)} − 4 + 2 = ${n(u)} and v = ${n(4 * t)} − 3 = ${n(v)}.`, [['u', u], ['v', v]]); },
 /* e^z for z = 1 + yi with y = tπ ÷ 6: real part e cos y. */
 q08: t => { t = T(t); const y = t * Math.PI / 6, re = Math.E * Math.cos(y);
  return E('Predict the real part of e^z, to 2 decimal places.', `e^z = e(cos y + i sin y), so the real part is e × cos(${piT(t, 6)}) ≈ ${d2(re)}. The modulus is e ≈ 2.72 whatever y is.`, [['Re e^z', r2(re)], ['|e^z|', 2.72]]); },
 /* Log(−2 + ti): real part ½ ln(4 + t²). */
 q09: t => { t = T(t); const S = 4 + t * t, L = Math.log(S) / 2, A = Math.atan2(t, -2);
  return E('Predict the real part of Log z, which is ln |z|, to 2 decimal places.', `|z|² = 4 + ${n(t * t)} = ${n(S)}, so ln |z| = ½ ln ${n(S)} ≈ ${d2(L)}.`, [['Re Log z', r2(L)], ['Im Log z', r2(A)]]); },
 /* i^(ci) with c = t ÷ 4: e^(ci × iπ ÷ 2) = e^(−cπ ÷ 2). */
 q10: t => { t = T(t); const c = t / 4, v = Math.exp(-c * Math.PI / 2);
  return E('Predict the principal value, to 2 decimal places.', `Log i = iπ ÷ 2, so the power is e^(${n(c)}i × iπ ÷ 2) = e^(${n(-c)}π ÷ 2) ≈ ${d2(v)}.`, [['Principal value', r2(v)], ['Exponent', r2(-c * Math.PI / 2)]]); },
});
})();
