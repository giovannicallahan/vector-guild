/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 8 of 8: q36b–q40d (game/realms/number/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
  /* helpers local to this file */
  const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
  /* Float value of [c0; c1, ..., ck], folded from the tail. */
  const cfFloat = c => { let v = c[c.length - 1]; for (let i = c.length - 2; i >= 0; i--) v = c[i] + 1 / v; return v; };
  /* Exact fraction [n, d] of [c0; c1, ...] by folding with exact integer pairs from the tail. */
  const cfFrac = c => { let n = c[c.length - 1], d = 1; for (let i = c.length - 2; i >= 0; i--) { const t = n; n = c[i] * n + d; d = t; } return [n, d]; };
  /* Partial quotients of n/d by repeated division. */
  const quotients = (n, d) => { const q = []; while (d) { q.push(Math.floor(n / d)); const r = n % d; n = d; d = r; } return q; };
  /* Convergent after the first k partial quotients, as a lowest-terms pair, by rebuilding the fraction. */
  const convergent = (q, k) => { const [n, d] = cfFrac(q.slice(0, k)); const g = gcd(n, d); return [n / g, d / g]; };
  /* Smallest denominator d <= maxD with some n such that n/d rounds to X / scale (nearest). Returns [n, d]. */
  const findFraction = (X, scale, maxD) => { for (let d = 1; d <= maxD; d++) { const n = Math.round(X * d / scale); if (2 * Math.abs(scale * n - X * d) <= d) return [n, d]; } return null; };
  const pw = (b, e, m) => { let r = 1 % m; for (let i = 0; i < e; i++) r = (r * b) % m; return r; };
  /* Number of pairs a < b <= N with a dividing b (a >= from). */
  const links = (N, from) => { let c = 0; for (let a = from; a <= N; a++) for (let b = a + 1; b <= N; b++) if (b % a === 0) c++; return c; };
  const nDiv = n => { let c = 0; for (let k = 1; k <= n; k++) if (n % k === 0) c++; return c; };
  /* Unlock exponent: search 1..phi-1 for e*d = 1 (mod phi). */
  const unlock = (e, phi) => { for (let d = 1; d < phi; d++) if ((e * d) % phi === 1) return d; return -1; };

Object.assign(window.ORACLE, {
  /* q36 */
  /* a0..a3 are the partial quotients of the ratio; the prompt shows only the fraction N/D, so rebuild N/D, run Euclid, keep a0..a2. */
  q36b: p => { const c = [p.a0, p.a1, p.a2, p.a3]; const [n, d] = cfFrac(c); const q = quotients(n, d); return convergent(q, 4); },
  q36c: p => { const [n, d] = cfFrac([p.a0, p.a1, p.a2, p.a3]); const q = quotients(n, d); return convergent(q, 3); },
  q36d: p => { const [n, d] = cfFrac([p.a0, p.a1, p.a2, p.a3, p.a4]); const N = n * p.g, D = d * p.g; let a = N, b = D; while (b) { const t = a % b; a = b; b = t; } const q = quotients(N, D); return [a].concat(convergent(q, 4)); },

  /* q37 */
  /* a1.. are the partial quotients of the true fraction [0; a1, a2, ...]; the prompt shows only the rounded reading X. */
  q37b: p => { const X = Math.round(1e6 * cfFloat([0, p.a1, p.a2, p.a3])); return findFraction(X, 1e6, 99); },
  q37c: p => { const X = Math.round(1e6 * cfFloat([0, p.a1, p.a2, p.a3])); const [n, d] = findFraction(X, 1e6, 99); let turns = 0, acc = 0; for (let i = 0; i < p.T; i++) { acc += n; while (acc >= d) { acc -= d; turns++; } } return [n, d, turns]; },
  q37d: p => { const X = Math.round(1e9 * cfFloat([0, p.a1, p.a2, p.a3, p.a4])); return findFraction(X, 1e9, 999); },

  /* q38 */
  q38b: p => [p.p * p.q, pw(p.m, p.e, p.p * p.q)],
  q38c: p => { const n = p.p * p.q, phi = (p.p - 1) * (p.q - 1); let e = 0; for (const x of [3, 5, 7, 11]) { if (e) break; let ok = true; for (let k = 2; k <= x; k++) if (x % k === 0 && phi % k === 0) ok = false; if (ok) e = x; } return [n, e, pw(p.m, e, n)]; },
  q38d: p => { const n = p.p * p.q; const c1 = pw(p.m, p.e1, n); return [n, c1, pw(c1, p.e2, n)]; },

  /* q39 */
  /* m, m1, m2 are the hidden messages: the prompt shows only the ciphertexts c = m^e mod n, so lock them first. */
  q39b: p => { const n = p.p * p.q, phi = (p.p - 1) * (p.q - 1); const c = pw(p.m, p.e, n); const d = unlock(p.e, phi); return [phi, d, pw(c, d, n)]; },
  q39c: p => { const n = p.p * p.q, phi = (p.p - 1) * (p.q - 1); const c1 = pw(p.m1, p.e, n), c2 = pw(p.m2, p.e, n); const d = unlock(p.e, phi); return [d, pw(c1, d, n), pw(c2, d, n)]; },
  q39d: p => { const n = p.p * p.q, phi = (p.p - 1) * (p.q - 1); const c = pw(p.m, p.e, n); const d = unlock(p.e, phi); const m = pw(c, d, n); return [d, m, pw(m, p.e2, n)]; },

  /* q40 */
  q40b: p => { let g = 1; for (let k = 1; k <= Math.min(p.x, p.y); k++) if (p.x % k === 0 && p.y % k === 0) g = k; return [links(p.N, 1), g]; },
  q40c: p => { let l = 1; while (l % p.x !== 0 || l % p.y !== 0) l++; return [links(p.N, 2), l]; },
  q40d: p => [links(p.N, 1), nDiv(p.b) - 1],
});
})();
