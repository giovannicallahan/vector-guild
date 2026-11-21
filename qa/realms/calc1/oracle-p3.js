/* Independent oracles for Calculus 1 practice missions, file 3 of 8: q11b–q15d (game/realms/calc1/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = v => Math.round(v * 1e6) / 1e6;
/* Numerical derivative by a small symmetric difference, rounded (every answer here is a tidy number). */
const slopeAt = (F, x, h = 1e-3) => r6((F(x + h) - F(x - h)) / (2 * h));
/* Numerical one-sided limit: evaluate close to the point on the stated side, then round to a whole number. */
const limitNear = (F, x, side, h = 1e-4) => Math.round(F(x + side * h));
const poly = (coef, x) => coef.reduce((s, c) => s * x + c, 0);   /* Horner, highest power first */
Object.assign(window.ORACLE, {
  /* Right piece is (x² + mx − k(k+m)) ÷ (x − k): evaluate just above k. Then the left piece c − jx must equal that at k. */
  q11b: p => {
    const right = x => (x * x + p.m * x - p.k * (p.k + p.m)) / (x - p.k);
    const L = limitNear(right, p.k, +1);
    let c = 0; while (c - p.j * p.k < L) c++;
    return [L, c];
  },
  /* Left piece (x³ − kx²) ÷ (x − k) evaluated just below k. The second piece is jx + C with C shown in the prompt; the
     jump e is the amount it overshoots, so the C shown is L − jk + e and the repaired C is the one that gives L. */
  q11c: p => {
    const left = x => (x * x * x - p.k * x * x) / (x - p.k);
    const L = limitNear(left, p.k, -1);
    const shown = L - p.j * p.k + p.e;
    const jump = p.j * p.k + shown - L;
    let C = shown - jump; while (p.j * p.k + C < L) C++; while (p.j * p.k + C > L) C--;
    return [jump, C];
  },
  /* Left piece a(x² − k²) ÷ (x − k) just below k; c from the right piece c − jx meeting it; then two function values. */
  q11d: p => {
    const left = x => p.a * (x * x - p.k * p.k) / (x - p.k);
    const L = limitNear(left, p.k, -1);
    let c = L; while (c - p.j * p.k > L) c--; while (c - p.j * p.k < L) c++;
    const f = x => (x < p.k ? left(x) : c - p.j * x);
    const x1 = p.k - p.d1, x2 = p.k + p.d2;
    return [c, r6((f(x2) - f(x1)) / (x2 - x1))];
  },
  /* s = bt − at²: the difference quotient with h = 0.1, and the symmetric-difference derivative. */
  q12b: p => {
    const s = t => p.b * t - p.a * t * t;
    return [r6((s(p.t0 + 0.1) - s(p.t0)) / 0.1), slopeAt(s, p.t0)];
  },
  /* Speed by symmetric difference; the gate's limit is e below the speed, so the excess is the speed minus that limit. */
  q12c: p => {
    const s = t => p.p * t * t + p.q * t + p.c;
    const v = slopeAt(s, p.t0), limit = v - p.e;
    return [v, v - limit];
  },
  /* s = pt² + qt: quotients straight from s for h = −0.1 and 0.1, derivative from a tiny symmetric difference. */
  q12d: p => {
    const s = t => p.p * t * t + p.q * t;
    const dq = h => (s(p.t0 + h) - s(p.t0)) / h;
    return [r6(dq(-0.1)), r6(dq(0.1)), slopeAt(s, p.t0)];
  },
  /* Hill y = −px² + qx + r: tangent slope by symmetric difference, intercept from the touching point. */
  q13b: p => {
    const f = x => -p.p * x * x + p.q * x + p.r;
    const m = slopeAt(f, p.a);
    return [m, r6(f(p.a) - m * p.a)];
  },
  /* Ramp y = px² + qx + r: slope at the lip by symmetric difference; walk the beam d across, one unit at a time. */
  q13c: p => {
    const f = x => p.p * x * x + p.q * x + p.r;
    const m = slopeAt(f, p.a);
    let y = f(p.a); for (let i = 0; i < p.d; i++) y += m;
    return [m, r6(y)];
  },
  /* Two tangent lines to y = px² + qx + r, then their meeting point by Cramer's rule on y − m1x = k1, y − m2x = k2. */
  q13d: p => {
    const f = x => p.p * x * x + p.q * x + p.r;
    const m1 = slopeAt(f, p.a1), m2 = slopeAt(f, p.a2);
    const k1 = f(p.a1) - m1 * p.a1, k2 = f(p.a2) - m2 * p.a2;
    const x = (k2 - k1) / (m1 - m2), y = m1 * x + k1;
    return [m1, m2, r6(x), r6(y)];
  },
  /* E = tᵏ. The number in front is E′(1); the power comes from how E′ scales when t doubles (E′(2a) ÷ E′(a) = 2^power). */
  q14b: p => {
    const E = t => Math.pow(t, p.k);
    const g = t => (E(t * (1 + 1e-6)) - E(t * (1 - 1e-6))) / (2e-6 * t);
    return [Math.round(g(1)), Math.round(Math.log2(g(2 * p.a) / g(p.a))), Math.round(g(p.a))];
  },
  /* Speed of d = tᵏ at time T gives the cut-off; scan whole seconds until the numerical speed reaches it. */
  q14c: p => {
    const d = t => Math.pow(t, p.k);
    const speed = t => (d(t * (1 + 1e-6)) - d(t * (1 - 1e-6))) / (2e-6 * t);
    const X = Math.round(speed(p.T));
    let t = 1; while (Math.round(speed(t)) < X) t++;
    return [t, d(t)];
  },
  /* Tangent to y = xᵏ at x = a: slope by symmetric difference at a relative step, intercept from the touching point. */
  q14d: p => {
    const f = x => Math.pow(x, p.k);
    const m = Math.round((f(p.a * (1 + 1e-6)) - f(p.a * (1 - 1e-6))) / (2e-6 * p.a));
    return [m, f(p.a) - m * p.a];
  },
  /* h(x) = ax³ + bx² + cx + d. Sample h′ by symmetric differences at −1, 0, 1 and fit Ax² + Bx + C through them. */
  q15b: p => {
    const h = x => poly([p.a, p.b, p.c, p.d], x);
    const g = x => slopeAt(h, x, 1e-4);
    const g0 = g(0), g1 = g(1), gm = g(-1);
    const C = g0, A = (g1 + gm - 2 * g0) / 2, B = (g1 - gm) / 2;
    return [Math.round(A), Math.round(B), Math.round(C), g(p.x0)];
  },
  /* V = V0 − bt − at² with V0 read off the prompt (the tank holds M minutes at the leak rate at t0). The leak rate is
     minus the symmetric-difference slope; the minutes are found by searching for the whole number that empties V(t0). */
  q15c: p => {
    const rateAt = (a, b, t0) => b + 2 * a * t0;
    const V0 = p.M * rateAt(p.a, p.b, p.t0) + p.b * p.t0 + p.a * p.t0 * p.t0;
    const V = t => V0 - p.b * t - p.a * t * t;
    const rate = -slopeAt(V, p.t0);
    let m = 0; while (m * rate < V(p.t0)) m++;
    return [rate, m];
  },
  /* T(t) = at³ + bt² + ct + d: T′ at the two times by symmetric difference; the average from the two temperatures. */
  q15d: p => {
    const T = t => poly([p.a, p.b, p.c, p.d], t);
    return [slopeAt(T, p.t1, 1e-4), slopeAt(T, p.t2, 1e-4), r6((T(p.t2) - T(p.t1)) / (p.t2 - p.t1))];
  },
});
})();
