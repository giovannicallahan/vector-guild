/* Independent oracles for Calculus 1 learn missions, file a: q01–q10 (game/realms/calc1/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build(): a table of values, a numerical limit or difference quotient with a small
   step, a numerical integral, a search or a general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  /* h(t) = at² + bt from t1 to t2. Walk the interval one second at a time: in the second that starts at k the
     height rises by a(2k + 1) + b. The rises add up to the change in height, and their mean is the average rate. */
  q01: p => {
    const rises = [];
    for (let k = p.t1; k < p.t2; k++) rises.push(p.a * (2 * k + 1) + p.b);
    const total = rises.reduce((s, x) => s + x, 0);
    return [total, total / rises.length];
  },
  /* d(t) = at² + bt, point t = c. Average rates are taken straight from tabulated distances; the instantaneous rate
     is the symmetric difference quotient with a tiny step, rounded to the whole number the prompt promises. */
  q02: p => {
    const d = t => p.a * t * t + p.b * t;
    const avg = (t, h) => (d(t + h) - d(t)) / h;
    const inst = Math.round((d(p.c + 1e-4) - d(p.c - 1e-4)) / 2e-4);
    return [avg(p.c, 1), avg(p.c, 0.1), inst];
  },
  /* f(x) = (x³ − c³) ÷ (x − c). Evaluate at c ∓ 0.1; the limit is the mean of f just either side of c, rounded. */
  q03: p => {
    const f = x => (x * x * x - p.c * p.c * p.c) / (x - p.c);
    return [f(p.c - 0.1), f(p.c + 0.1), Math.round((f(p.c - 1e-5) + f(p.c + 1e-5)) / 2)];
  },
  /* S(x) = (ax² + p) ÷ (x + q) as x → c. Top, bottom and quotient are each sampled either side of c and rounded. */
  q04: p => {
    const top = x => p.a * x * x + p.p, bot = x => x + p.q, S = x => top(x) / bot(x);
    const near = fn => Math.round((fn(p.c - 1e-6) + fn(p.c + 1e-6)) / 2 * 1e4) / 1e4;
    return [near(top), near(bot), near(S)];
  },
  /* g(x) = (x² + (e − r)x − re) ÷ (x − r). Find k by testing integers until (x − r)(x + k) matches the top at three
     points; the limit is g sampled either side of r. */
  q05: p => {
    const top = x => x * x + (p.e - p.r) * x - p.r * p.e;
    let k = null;
    for (let t = -60; t <= 60 && k === null; t++) if ([0, 1, 7].every(x => top(x) === (x - p.r) * (x + t))) k = t;
    const g = x => top(x) / (x - p.r);
    return [k, Math.round((g(p.r - 1e-6) + g(p.r + 1e-6)) / 2 * 1e4) / 1e4];
  },
  /* Left piece (t² + (e − c)t − ce) ÷ (t − c) sampled just below c; right piece m t + k sampled just above c. */
  q06: p => {
    const left = t => (t * t + (p.e - p.c) * t - p.c * p.e) / (t - p.c);
    const right = t => p.m * t + p.k;
    const L = Math.round(left(p.c - 1e-6) * 1e4) / 1e4, R = Math.round(right(p.c + 1e-6) * 1e4) / 1e4;
    return [L, R, R - L];
  },
  /* F(t) = at + b below c, t² + k from c. Left limit from a value just below c; k found by searching integers for
     the one whose second piece meets the first at c. */
  q07: p => {
    const L = Math.round((p.a * (p.c - 1e-6) + p.b) * 1e4) / 1e4;
    let k = null;
    for (let t = -200; t <= 200; t++) if (Math.abs(p.c * p.c + t - L) < 1e-9) { k = t; break; }
    return [L, k];
  },
  /* c(t) = (pt + b) ÷ (qt + d). c(0) from the table; the limit by evaluating at an enormous t. */
  q08: p => {
    const c = t => (p.p * t + p.b) / (p.q * t + p.d);
    return [c(0), Math.round(c(1e12) * 1e6) / 1e6];
  },
  /* P(x) = (ax + b) ÷ (x − c). Scan for the integer setting where P blows up on both sides, then read P at ±0.01. */
  q09: p => {
    const P = x => (p.a * x + p.b) / (x - p.c);
    let v = null;
    for (let x = -100; x <= 100; x++) if (Math.abs(P(x + 1e-7)) > 1e5 && Math.abs(P(x - 1e-7)) > 1e5) { v = x; break; }
    return [v, Math.round(P(v + 0.01) * 1e6) / 1e6, Math.round(P(v - 0.01) * 1e6) / 1e6];
  },
  /* f(x) = x³ + cx − d on [k, k + 1]. Three halvings give eighths: sample f at the nine grid points and take the
     eighth whose ends differ in sign. */
  q10: p => {
    const f = x => x * x * x + p.c * x - p.d;
    for (let j = 0; j < 8; j++) {
      const lo = p.k + j / 8, hi = p.k + (j + 1) / 8;
      if (f(lo) < 0 && f(hi) > 0) return [lo, hi];
    }
    return [NaN, NaN];
  },
});
})();
