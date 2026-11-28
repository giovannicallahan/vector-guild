/* Independent oracles for Real analysis practice missions, file 3 of 8: q11b–q15d (game/realms/real/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Tolerances such as 0.025 are held as whole units of 1e-4, so that every "below" test is an exact integer test. */
const ten4 = e => Math.round(e * 1e4);
/* A far-away index, used to read off limits (error about 1e-9 times a small number, then rounded to 6 places). */
const FAR = 1e9;
/* Sum of f(1..n) by adding one term at a time. */
const sumTo = (f, n) => { let s = 0; for (let k = 1; k <= n; k++) s += f(k); return s; };
/* Sum of a geometric-type series (every term below 1e-300 after 2000 terms for ratio at most 1/2). */
const infSum = f => sumTo(f, 2000);
/* Smallest N >= 1 for which ok(n) holds for every n >= N: scan up to a far bound and take one after the last failure. */
const firstFrom = (ok, far) => { let last = 0; for (let n = 1; n <= far; n++) if (!ok(n)) last = n; return last + 1; };
Object.assign(window.ORACLE, {
  /* q11b: p(n) = (L c n + b) ÷ (c n + d), so |p - L| = |b - L d| ÷ (c n + d); q(n) = C + r(-1)^n - s ÷ n.
     L is read at a far index; N is found by scanning; liminf is the lower of the two parity subsequences far out. */
  q11b: p => {
    const pn = n => (p.L * p.c * n + p.b) / (p.c * n + p.d);
    const L = r6(pn(FAR));
    const E = ten4(p.e), N = firstFrom(n => Math.abs(p.b - p.L * p.d) * 1e4 < E * (p.c * n + p.d), 200000);
    const q = n => p.C + p.r * Math.pow(-1, n) - p.s / n;
    return [L, N, r6(Math.min(q(FAR), q(FAR + 1)))];
  },
  /* q11c: r(n) = L - k ÷ (n + d), read every h minutes; the discarded readings are those before the N-th. */
  q11c: p => {
    const r = n => p.L - p.k / (n + p.d);
    const E = ten4(p.e), N = firstFrom(n => p.k * 1e4 < E * (n + p.d), 2000000);
    let wasted = 0; for (let n = 1; n < N; n++) wasted += p.h;
    return [r6(r(FAR)), N, wasted];
  },
  /* q11d: lower bound L - a ÷ n, upper bound L + b ÷ n; the gap from L is at most max(a, b) ÷ n.
     z(n) = base + s ÷ n with base U, V, W by n mod 3 = 1, 2, 0: sup and inf of far-out terms. */
  q11d: p => {
    const w = (n, off) => (p.L * n + off) / n;
    const E = ten4(p.e), big = Math.max(p.a, p.b);
    const N = firstFrom(n => big * 1e4 < E * n, 2000000);
    const base = n => (n % 3 === 1 ? p.U : n % 3 === 2 ? p.V : p.W);
    const z = []; for (let n = 3 * 1e8 + 1; n <= 3 * 1e8 + 3; n++) z.push(base(n) + p.s / n);
    return [r6(w(FAR, -p.a)), N, r6(Math.max(...z)), r6(Math.min(...z))];
  },
  /* q12b: v(n) = c - k ÷ (n + d). U and V are the values of n + d in the gap |v(U-d) - v(V-d)| (the prompt prints
     the two indices n). For m, n >= N the gap |v(m) - v(n)| stays below k ÷ (N + d) but gets as close to it as we like,
     so "below e for all m, n >= N" holds exactly when k ÷ (N + d) <= e. */
  q12b: p => {
    const v = n => p.c - p.k / (n + p.d);
    const E = ten4(p.e), N = firstFrom(n => p.k * 1e4 <= E * (n + p.d), 2000000);
    return [r6(Math.abs(v(p.U - p.d) - v(p.V - p.d))), N];
  },
  /* q12c: x(n) = c + k ÷ n; tolerance t millivolts = t ÷ 1000 volts; same "gap approaches k ÷ N" rule as q12b;
     blocks of B readings: count full and partly filled blocks by walking along the readings. */
  q12c: p => {
    const N = firstFrom(n => p.k * 1000 <= p.t * n, 2000000);
    let blocks = 0, left = 0;
    for (let n = 1; n <= N; n++) { if (left === 0) { blocks++; left = p.B; } left--; }
    return [r6(p.t / 1000), N, blocks];
  },
  /* q12d: y(n) = c + k ÷ (n + d); U and V are the values of n + d at the two printed indices; limit test is
     k ÷ (N + d) < e1 (strict, the distance is reached); Cauchy test as in q12b with e2. */
  q12d: p => {
    const y = n => p.c + p.k / (n + p.d);
    const E1 = ten4(p.e1), E2 = ten4(p.e2);
    return [r6(Math.abs(y(p.U - p.d) - y(p.V - p.d))),
      firstFrom(n => p.k * 1e4 < E1 * (n + p.d), 2000000),
      firstFrom(n => p.k * 1e4 <= E2 * (n + p.d), 2000000)];
  },
  /* q13b: terms a(n) = A1 (-1/q)^(n-1) with first term A1 = m (q + 1) q^(N-1) (read off the printed first terms);
     partial sum by adding terms, tail = all later terms added until they vanish. */
  q13b: p => {
    const A1 = p.m * (p.q + 1) * Math.pow(p.q, p.N - 1);
    const a = n => A1 * Math.pow(-1 / p.q, n - 1);
    const s = sumTo(a, p.N);
    let tail = 0; for (let n = p.N + 1; n <= 2000; n++) tail += a(n);
    return [r6(s), r6(tail)];
  },
  /* q13c: the n-th term is K ÷ ((n + d)(n + d + 1)) with K = m (d + 1) (printed numerator). Telescoping: the first
     N terms add to K (1 ÷ (d + 1) - 1 ÷ (N + d + 1)), so the tail after N terms is K ÷ (N + d + 1). */
  q13c: p => {
    const K = p.m * (p.d + 1);
    const total = K * (1 / (p.d + 1) - 1 / (FAR + p.d + 1));
    const E = ten4(p.e), N = firstFrom(n => K * 1e4 < E * (n + p.d + 1), 2000000);
    return [r6(total), N];
  },
  /* q13d: positive terms a(n) = A1 q^-(n-1), A1 = m (q - 1) q^(Ns + x - 1), sum S = m q^(Ns + x).
     The threshold printed is eps = (tail after Ns terms) + ex. For m, n >= N the gap s(m) - s(n) is below the tail
     after N terms and gets as close as we like, so the Cauchy test holds exactly when that tail is <= eps. */
  q13d: p => {
    const A1 = p.m * (p.q - 1) * Math.pow(p.q, p.Ns + p.x - 1), a = n => A1 * Math.pow(p.q, -(n - 1));
    const S = infSum(a), tailAfter = N => S - sumTo(a, N);
    const eps = Math.round(tailAfter(p.Ns)) + p.ex;
    let N = 1; while (!(tailAfter(N) <= eps + 1e-9)) N++;
    return [r6(S), N, r6(sumTo(a, N))];
  },
  /* q14b: a(n) = (-1)^n c ÷ n^p; absolute convergence is the p-series rule (p > 1). */
  q14b: p => [p.p > 1 ? 1 : 0, r6(sumTo(n => Math.pow(-1, n) * p.c / Math.pow(n, p.p), p.N))],
  /* q14c: a(n) = (-1)^(n+1) c ÷ n^p; net is the signed sum, travel the sum of sizes. */
  q14c: p => [p.p > 1 ? 1 : 0,
    r6(sumTo(n => Math.pow(-1, n + 1) * p.c / Math.pow(n, p.p), p.N)),
    r6(sumTo(n => p.c / Math.pow(n, p.p), p.N))],
  /* q14d: a(n) = (-1)^(n+1) cA ÷ n^pA, b(n) = (-1)^n cB ÷ n^pB, with cA = mA 6^pA and cB = mB 6^pB (printed numerators). */
  q14d: p => {
    const cA = p.mA * Math.pow(6, p.pA), cB = p.mB * Math.pow(6, p.pB);
    return [p.pA > 1 ? 1 : 0, p.pB > 1 ? 1 : 0,
      r6(sumTo(n => Math.pow(-1, n + 1) * cA / Math.pow(n, p.pA) + Math.pow(-1, n) * cB / Math.pow(n, p.pB), 3))];
  },
  /* q15b: a(n) = C ÷ (n q^n), b(n) = C ÷ q^n, C = 2 m (q - 1) q² (printed numerator). Whole comparison series by adding
     terms; sharper bound = a1 + a2 + sum of b(n) from n = 3. */
  q15b: p => {
    const C = 2 * p.m * (p.q - 1) * p.q * p.q, a = n => C / (n * Math.pow(p.q, n)), b = n => C / Math.pow(p.q, n);
    let late = 0; for (let n = 3; n <= 2000; n++) late += b(n);
    return [r6(infSum(b)), r6(a(1) + a(2) + late)];
  },
  /* q15c: loop A numerator A = m1 (q - 1) (printed), b(n) = A ÷ q^n added term by term; loop B bound sum of
     k2 ÷ (n(n + 1)) telescopes to k2 (1 - 1 ÷ (M + 1)) for M terms, taken far out. c1 and c2 only fix the printed
     denominators; allowance T minus the two bounds. */
  q15c: p => {
    const A = p.m1 * (p.q - 1), bA = infSum(n => A / Math.pow(p.q, n)), bB = p.k2 * (1 - 1 / (FAR + 1));
    return [r6(bA), r6(bB), r6(p.T - bA - bB)];
  },
  /* q15d: b(n) = C ÷ q^n with C = m (q - 1) q^(Ns + x) (printed numerator); the tail of b after N terms is added up term by
     term. The printed threshold is (tail of b after Ns terms) + ex; N0 is the printed number of terms for the tail
     question (c is only the printed 'c n' in the denominator of a(n)). */
  q15d: p => {
    const C = p.m * (p.q - 1) * Math.pow(p.q, p.Ns + p.x), b = n => C / Math.pow(p.q, n);
    const S = infSum(b), tail = N => S - sumTo(b, N);
    const thr = Math.round(tail(p.Ns)) + p.ex;
    let N = 0; while (!(tail(N) < thr - 1e-9)) N++;
    return [r6(S), r6(tail(p.N0)), N];
  },
});
})();
