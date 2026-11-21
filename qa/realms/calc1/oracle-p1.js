/* Independent oracles for Calculus 1 practice missions, file 1 of 8: q01b–q05d (game/realms/calc1/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Count on from `from` to `to`, one at a time: the number of single steps. */
const countUp = (from, to) => { let steps = 0; for (let x = from; x < to; x++) steps++; return steps; };
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Limit as x approaches c: average of the values just left and just right of c. */
const lim = (f, c) => r6((f(c - 1e-4) + f(c + 1e-4)) / 2);
/* Instantaneous rate by a small symmetric difference. */
const slope = (f, c) => r6((f(c + 1e-4) - f(c - 1e-4)) / 2e-4);
Object.assign(window.ORACLE, {
  /* Count the kilometres and the hours one at a time, then search for the steady speed (in tenths of a km per hour)
     that would carry the rover from the first reading to the second in that many hours. */
  q01b: p => {
    const km = countUp(p.d1, p.d2), hours = countUp(p.t1, p.t2);
    let tenths = 0;
    for (;;) { let reached = 0; for (let h = 0; h < hours; h++) reached += tenths; if (reached >= km * 10) break; tenths++; }
    return [km, tenths / 10];
  },
  /* q01c: secant slope of h(t) = a t² + b t, then the winch time by counting minutes one at a time. */
  q01c: p => {
    const h = t => p.a * t * t + p.b * t, rate = r6((h(p.t2) - h(p.t1)) / (p.t2 - p.t1));
    let minutes = 0, height = 0; while (height < p.H - 1e-9) { height += rate; minutes++; }
    return [rate, minutes];
  },
  /* q01d: secant slopes of h(t) = -t³ + p t² + q t over the three stretches. */
  q01d: p => {
    const h = t => -t * t * t + p.p * t * t + p.q * t, sec = (a, b) => r6((h(b) - h(a)) / (b - a));
    return [sec(p.t1, p.t2), sec(p.t2, p.t3), sec(p.t1, p.t3)];
  },
  /* q02b: F(t) = F0 - a t² at t = c: two secants from c, then a small symmetric difference. */
  q02b: p => {
    const F = t => p.F0 - p.a * t * t;
    return [r6((F(p.c + 1) - F(p.c)) / 1), r6((F(p.c + 0.1) - F(p.c)) / 0.1), slope(F, p.c)];
  },
  /* q02c: d(t) = a t² + b t, secant ending at c, symmetric difference at c, margin under L. */
  q02c: p => {
    const d = t => p.a * t * t + p.b * t, v = slope(d, p.c);
    return [r6((d(p.c) - d(p.c - 0.1)) / 0.1), v, r6(p.L - v)];
  },
  /* q02d: d(t) = t³ + b t at c. */
  q02d: p => {
    const d = t => t * t * t + p.b * t;
    return [r6((d(p.c + 1) - d(p.c)) / 1), r6((d(p.c + 0.1) - d(p.c)) / 0.1), slope(d, p.c)];
  },
  /* q03b: f(x) = (x³ - c² x) ÷ (x - c) evaluated at c ∓ 0.1 and very close to c. */
  q03b: p => {
    const f = x => (x * x * x - p.c * p.c * x) / (x - p.c);
    return [r6(f(p.c - 0.1)), r6(f(p.c + 0.1)), lim(f, p.c)];
  },
  /* q03c: P(x) = (x² + k x - (c² + k c)) ÷ (x - c) (the top is 0 at c, as the prompt says), then hours = E ÷ draw. */
  q03c: p => {
    const P = x => (x * x + p.k * x - (p.c * p.c + p.k * p.c)) / (x - p.c), w = lim(P, p.c);
    return [r6(P(p.c - 0.1)), r6(P(p.c + 0.1)), w, r6(p.E / w)];
  },
  /* q03d: Q(h) = (d(c + h) - d(c)) ÷ h for d = a t² + b t. */
  q03d: p => {
    const d = t => p.a * t * t + p.b * t, Q = h => (d(p.c + h) - d(p.c)) / h;
    return [r6(Q(-0.1)), r6(Q(0.1)), r6((Q(-1e-4) + Q(1e-4)) / 2)];
  },
  /* q04b: B(x) = (x³ + e) ÷ (a x - q) as x approaches c: the top and bottom values taken close to c. */
  q04b: p => {
    const top = x => x * x * x + p.e, bot = x => p.a * x - p.q;
    return [lim(top, p.c), lim(bot, p.c), lim(x => top(x) / bot(x), p.c)];
  },
  /* q04c: R(x) = (x² + p) ÷ (x - q) as x approaches c, then time = D ÷ rate. */
  q04c: p => {
    const rate = lim(x => (x * x + p.p) / (x - p.q), p.c);
    return [rate, r6(p.D / rate)];
  },
  /* q04d: S(x) = (a x² + b x + p) ÷ (x² + q) as x approaches c (negative). */
  q04d: p => [lim(x => x * x, p.c), lim(x => p.a * x * x + p.b * x + p.p, p.c),
    lim(x => (p.a * x * x + p.b * x + p.p) / (x * x + p.q), p.c)],
  /* q05b: x² + (r + m) x + r m over x + r: find m by search so the top has the factor (x + m), limit at -r. */
  q05b: p => {
    const B = p.r + p.m, C = p.r * p.m;
    let m = null; for (let k = -60; k <= 60; k++) if (k + p.r === B && k * p.r === C) m = k;
    return [m, lim(x => (x * x + B * x + C) / (x + p.r), -p.r)];
  },
  /* q05c: d(t) = t² + b t, A(t) = (t² + b t - (c² + b c)) ÷ (t - c): find k by search, speed = slope of d at c. */
  q05c: p => {
    const top = t => t * t + p.b * t - (p.c * p.c + p.b * p.c);
    let k = null; for (let j = -60; j <= 60; j++) if ([-3, 0.5, 7, 11].every(t => Math.abs(top(t) - (t - p.c) * (t + j)) < 1e-9)) k = j;
    const v = slope(t => t * t + p.b * t, p.c);
    return [k, v, r6(p.V - v)];
  },
  /* q05d: N(x) = (x² + (e - r) x - r e) ÷ (x² - r²) at x = r: find e by search, limit taken close to r. */
  q05d: p => {
    const top = x => x * x + (p.e - p.r) * x - p.r * p.e;
    let e = null; for (let j = -60; j <= 60; j++) if ([-3, 0.5, 7, 11].every(x => Math.abs(top(x) - (x - p.r) * (x + j)) < 1e-9)) e = j;
    return [e, lim(x => top(x) / (x * x - p.r * p.r), p.r)];
  },
});
})();
