/* Independent oracles for Calculus 2: accumulation practice missions, file 5 of 8: q21b–q25d (game/realms/calc2/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round to 3 places; the tiny nudge keeps an exact half (such as 899.4375) from slipping down on numerical noise. */
const r3 = x => { const v = Math.round(x * 1000 + 1e-6) / 1000; return v === 0 ? 0 : v; };
/* Composite Simpson's rule with n (even) steps: a numerical integral of any smooth f. */
const integ = (f, a, b, n = 20000) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Partial fractions by cover-up: top(t) ÷ ((t + a)(t + b)) = A ÷ (t + a) + B ÷ (t + b), A = top(-a) ÷ (b - a), B = top(-b) ÷ (a - b). */
const cover = (top, a, b) => [top(-a) / (b - a), top(-b) / (a - b)];
/* The top the prompt shows: A(t + b) + B(t + a), built from the stated split. */
const topOf = p => t => p.A * (t + p.b) + p.B * (t + p.a);
/* The integral of k ÷ u^e from u = lo to u = hi, with u = e^s (smooth in s). */
const powInt = (k, e, lo, hi) => integ(s => k * Math.exp((1 - e) * s), Math.log(lo), Math.log(hi), 40000);
/* A limit from three values of a sequence that closes in geometrically (each step's change a fixed fraction of the last):
   Infinity if the changes do not shrink (the integral diverges). */
const settle = (v1, v2, v3) => {
  const d1 = v2 - v1, d2 = v3 - v2;
  if (!(Math.abs(d2) < 0.5 * Math.abs(d1))) return Infinity;
  const q = d2 / d1; return v3 + d2 * q / (1 - q);
};
/* The whole improper integral of k ÷ u^e from 0 to w: the piece from a tiny lo up, for lo = 1e-6, 1e-10, 1e-14. */
const toZero = (k, e, w) => settle(powInt(k, e, 1e-6, w), powInt(k, e, 1e-10, w), powInt(k, e, 1e-14, w));
/* The whole improper integral of k ÷ u^e from a out to infinity: the piece to a·1e4, a·1e8, a·1e12. */
const toInf = (k, e, a) => settle(powInt(k, e, a, a * 1e4), powInt(k, e, a, a * 1e8), powInt(k, e, a, a * 1e12));
/* Trapezoidal and Simpson estimates from a table of readings r every h. */
const trap = (r, h) => { let s = 0; for (let i = 0; i + 1 < r.length; i++) s += (r[i] + r[i + 1]) / 2 * h; return s; };
const simp = (r, h) => { let s = 0; for (let i = 0; i + 2 < r.length; i += 2) s += h / 3 * (r[i] + 4 * r[i + 1] + r[i + 2]); return s; };
Object.assign(window.ORACLE, {
  /* q21b: split by cover-up, then integrate (t + b... top) ÷ ((t + a)(t + b)) numerically from p to q. */
  q21b: p => {
    const top = topOf(p), [A, B] = cover(top, p.a, p.b);
    return [r3(A), r3(B), r3(integ(t => top(t) / ((t + p.a) * (t + p.b)), p.p, p.q))];
  },
  /* q21c: V0 plus the numerical integral of the rate from t = p to t = q (p is 0 in the prompt). */
  q21c: p => {
    const top = topOf(p), [A, B] = cover(top, p.a, p.b);
    return [r3(A), r3(B), r3(p.V0 + integ(t => top(t) / ((t + p.a) * (t + p.b)), p.p, p.q))];
  },
  /* q21d: average value = integral ÷ width over the stated interval. */
  q21d: p => {
    const top = topOf(p), [A, B] = cover(top, p.a, p.b);
    return [r3(A), r3(B), r3(integ(x => top(x) / ((x + p.a) * (x + p.b)), p.p, p.q) / (p.q - p.p))];
  },
  /* q22b: both rules on the table of readings. */
  q22b: p => [r3(trap(p.r, p.h)), r3(simp(p.r, p.h))],
  /* q22c: Simpson estimate taken from the starting volume. */
  q22c: p => { const e = simp(p.r, p.h); return [r3(e), r3(p.V0 - e)]; },
  /* q22d: both rules, then Simpson ÷ the length of the log. */
  q22d: p => { const e = simp(p.r, p.h); return [r3(trap(p.r, p.h)), r3(e), r3(e / (p.h * (p.r.length - 1)))]; },
  /* q23b: ∫ from 0 to L of k x ÷ (x² + m) dx, numerically; technique 1 (the top is the derivative of the bottom, up to a constant). */
  q23b: p => [1, r3(integ(x => p.k * x / (x * x + p.m), 0, p.L))],
  /* q23c: (c t² + m) ÷ t from 1 to L, technique 4 (divide out first); the volume adds the starting amount. */
  q23c: p => { const v = integ(t => (p.c * t * t + p.m) / t, 1, p.L); return [4, r3(v), r3(p.V0 + v)]; },
  /* q23d: technique 3; A and B by cover-up from the top, the integral numerically from p to q. */
  q23d: p => {
    const top = topOf(p), [A, B] = cover(top, p.a, p.b);
    return [3, r3(A), r3(B), r3(integ(x => top(x) / ((x + p.a) * (x + p.b)), p.p, p.q))];
  },
  /* q24b: k ÷ t^p from a: the piece to T, then the whole integral by pushing the top out until it settles. */
  q24b: p => {
    const part = r3(powInt(p.k, p.p, p.a, p.T)), whole = toInf(p.k, p.p, p.a);
    return Number.isFinite(whole) ? [part, 1, r3(whole)] : [part, 0, 0];
  },
  /* q24c: k e^(-m t): the piece to T, the whole (top pushed far out), and what is left after T. */
  q24c: p => {
    const f = t => p.k * Math.exp(-p.m * t), part = integ(f, 0, p.T), whole = integ(f, 0, 60 / p.m);
    return [r3(part), r3(whole), r3(whole - part)];
  },
  /* q24d: k ÷ t^e from sa² to sT² (the prompt shows 16 and 100 for sa = 4, sT = 10); the prompt shows e = 1.5 when it converges (conv = 1) and 0.5 when it does not (√t). */
  q24d: p => {
    const e = p.conv ? 1.5 : 0.5, part = r3(powInt(p.k, e, p.sa * p.sa, p.sT * p.sT));
    return p.conv ? [part, 1, r3(toInf(p.k, e, p.sa * p.sa))] : [part, 0, 0];
  },
  /* q25b: k ÷ (t - a)^p, u = t - a from 0.01 to w; the whole from u = 0 if it settles as the start shrinks. */
  q25b: p => {
    const part = r3(powInt(p.k, p.p, 0.01, p.w)), whole = toZero(p.k, p.p, p.w);
    return Number.isFinite(whole) ? [part, 1, r3(whole)] : [part, 0, 0];
  },
  /* q25c: k ÷ √t: from 0.01 to L, the whole from 0, and the tank = starting volume + the whole. */
  q25c: p => { const whole = toZero(p.k, 0.5, p.L); return [r3(powInt(p.k, 0.5, 0.01, p.L)), r3(whole), r3(p.V0 + whole)]; },
  /* q25d: k ÷ (L - t)^p from 0 to L - 0.01, u = L - t from 0.01 to L; the whole from u = 0 if it settles. */
  q25d: p => {
    const part = r3(powInt(p.k, p.p, 0.01, p.L)), whole = toZero(p.k, p.p, p.L);
    return Number.isFinite(whole) ? [part, 1, r3(whole)] : [part, 0, 0];
  },
});
})();
