/* Independent oracles for Calculus 2: accumulation practice missions, file 6 of 8: q26b–q30d (game/realms/calc2/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
/* Bisection: the x in [lo, hi] where the monotone function g crosses 0. */
const solve = (g, lo, hi) => {
  const up = g(hi) > g(lo);
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if ((g(mid) > 0) === up) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
};
/* Composite Simpson rule for the area under f from a to b. */
const area = (f, a, b, n) => {
  n = n || 4000; const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* The pack's chain missions: first term j(q - p)q², each later term p/q of the one before. Added one term at a time. */
const chain = (p, q, j, count) => {
  let term = j * (q - p) * q * q, terms = [];
  for (let i = 0; i < count; i++) { terms.push(term); term = term * p / q; }
  return terms;
};
const addUp = xs => { let s = 0; for (const x of xs) s += x; return s; };
/* Sum of C ÷ (n (n + k)) style terms: add n = 1..N one at a time. */
const partial = (term, N) => { let s = 0; for (let n = 1; n <= N; n++) s += term(n); return s; };
/* Whole series of a term that falls like 1 ÷ n²: add a million terms, then the tail by the midpoint area. */
const wholeSeries = (term, tailFn) => partial(term, 1000000) + tailFn(1000000);

Object.assign(window.ORACLE, {
  /* q26b: find k so that the mass is double after D hours, then the time to reach f times the start. */
  q26b: p => {
    const k = solve(k => p.y0 * Math.exp(k * p.D) - 2 * p.y0, 0, 5);
    const t = solve(t => p.y0 * Math.exp(k * t) - p.f * p.y0, 0, 1e4);
    return [rd(k, 4), rd(t, 2)];
  },
  /* q26c: find k from the reading, then the time at which the strength is half the start. */
  q26c: p => {
    const k = solve(k => p.y0 * Math.exp(-k * p.t1) - p.y1, 0, 5);
    const T = solve(t => p.y0 * Math.exp(-k * t) - p.y0 / 2, 0, 1e4);
    return [rd(k, 4), rd(T, 2)];
  },
  /* q26d: find k from the half-life, then the area under the heat flow c y0 e^(-kt) from 0 to D. */
  q26d: p => {
    const k = solve(k => p.y0 * Math.exp(-k * p.T) - p.y0 / 2, 0, 5);
    return [rd(k, 4), rd(area(t => p.c * p.y0 * Math.exp(-k * t), 0, p.D), 2)];
  },
  /* q27b: the term by substitution, the limit by taking n enormous. */
  q27b: p => {
    const a = n => (p.p * n * n + p.q * n) / (p.r * n * n + p.s);
    return [rd(a(p.m), 3), a(1e9)];
  },
  /* q27c: the term by substitution, the limit by taking n = 60 (2^60 is enormous), the gap as a positive distance. */
  q27c: p => {
    const a = n => (p.p * Math.pow(2, n) + p.q) / (p.r * Math.pow(2, n) + p.s);
    const lim = a(60);
    return [rd(a(p.m), 3), rd(lim, 6), rd(Math.abs(lim - a(p.m)), 3)];
  },
  /* q27d: the running total as the area under the curve (Simpson), the limit as the area out to a far end. */
  q27d: p => {
    if (p.fam === 'e') {
      const f = t => p.C * Math.exp(-p.k * t);
      return [rd(area(f, 0, p.m), 3), area(f, 0, 80 / p.k, 20000)];
    }
    /* C ÷ t^pw from 1: the substitution u = 1 ÷ t turns the area from 1 to infinity into C u^(pw-2) from 0 to 1. */
    const g = t => p.C / Math.pow(t, p.pw), h = u => p.C * Math.pow(u, p.pw - 2);
    return [rd(area(g, 1, p.m), 3), area(h, 0, 1)];
  },
  /* q28b: list the hops one at a time; add a long run of them. */
  q28b: p => {
    const hops = chain(p.p, p.q, p.j, 400);
    return [hops[2], addUp(hops)];
  },
  /* q28c: list the echoes; all of them, the first three, and what is left. */
  q28c: p => {
    const e = chain(p.p, p.q, p.j, 400), all = addUp(e), three = e[0] + e[1] + e[2];
    return [all, three, addUp(e.slice(3))];
  },
  /* q28d: simulate the store: top up, then let the half-life act over the gap, top-up after top-up. */
  q28d: p => {
    const topUp = (Math.pow(2, p.j) - 1) * p.u;
    let left = 1; for (let i = 0; i < p.j; i++) left /= 2;
    let store = 0; for (let i = 0; i < 2000; i++) store = store * left + topUp;
    return [left, store];
  },
  /* q29b: the surge by the substitution u = √t (so 5 ÷ √t dt = 2C du), and the relay chain term by term. */
  q29b: p => {
    const surge = area(u => 2 * p.C, 0, Math.sqrt(p.U), 10);
    return [surge, addUp(chain(p.p, p.q, p.j, 400))];
  },
  /* q29c: the interference by u = 1 ÷ t, then the pulses term by term, then both added. */
  q29c: p => {
    const interference = area(u => p.C * Math.pow(u, p.pw - 2), 0, 1);
    const pulses = addUp(chain(p.p, p.q, p.j, 400));
    return [interference, pulses, interference + pulses];
  },
  /* q29d: k from the half-life, the tone's energy as the area out to a far end, the pulses term by term. */
  q29d: p => {
    const k = solve(k => Math.exp(-k * p.T) - 0.5, 0, 5);
    const tone = area(t => p.P0 * Math.exp(-k * t), 0, 80 / k, 20000);
    return [rd(tone, 2), addUp(chain(p.p, p.q, p.j, 400))];
  },
  /* q30b: pulse n = d + u(s+1) ÷ ((n+s)(n+s+1)); partial sum by adding ten terms. If a far-out term is not near 0 the
     divergence test applies and the sum is entered as 0; otherwise the whole series by a million terms plus the tail. */
  q30b: p => {
    const d = p.d || 0, num = p.u * (p.s + 1), term = n => d + num / ((n + p.s) * (n + p.s + 1));
    const tail = N => num * Math.log((N + 0.5 + p.s + 1) / (N + 0.5 + p.s));
    return [rd(partial(term, 10), 3), Math.abs(term(1e9)) > 1e-6 ? 0 : wholeSeries(term, tail)];
  },
  /* q30c: pulse n = k h ÷ (n (n + k)); S_N by adding, the whole series by a million terms plus the tail, then the difference. */
  q30c: p => {
    const term = n => p.k * p.h / (n * (n + p.k));
    const tail = N => p.k * p.h * Math.log((N + 0.5 + p.k) / (N + 0.5)) / p.k;
    const sN = partial(term, p.N), total = wholeSeries(term, tail);
    return [rd(sN, 3), total, rd(total - sN, 3)];
  },
  /* q30d: A and B from two sample values of the pulse (a 2 by 2 solve), then S10 by adding, the whole series as in q30c. */
  q30d: p => {
    const term = n => p.k * p.h / (n * (n + p.k));
    /* term(n) = A/n + B/(n+k): at n = 1 and n = 2 two equations in A and B. */
    const a11 = 1, a12 = 1 / (1 + p.k), a21 = 1 / 2, a22 = 1 / (2 + p.k), b1 = term(1), b2 = term(2);
    const det = a11 * a22 - a12 * a21;
    const A = (b1 * a22 - a12 * b2) / det, B = (a11 * b2 - a21 * b1) / det;
    const tail = N => p.k * p.h * Math.log((N + 0.5 + p.k) / (N + 0.5)) / p.k;
    return [rd(A, 6), rd(B, 6), rd(partial(term, 10), 3), wholeSeries(term, tail)];
  },
});
})();
