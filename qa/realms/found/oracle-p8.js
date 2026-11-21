/* Independent oracles for Foundations practice missions, file 8 of 8: q36b–q40d (game/realms/found/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers: tables, counting and search, never the closed formula. */
/* A rule "start at `fixed`, add `rate` for each unit": its value after `units` whole units, by adding one unit at a time. */
const climb = (rate, fixed, units) => { let v = fixed; for (let i = 0; i < units; i++) v += rate; return v; };
/* The table of such a rule over the whole inputs lo..hi: [[input, output], ...]. */
const table = (rate, fixed, lo, hi) => { const rows = []; for (let x = lo; x <= hi; x++) rows.push([x, climb(rate, fixed, x)]); return rows; };
const least = rows => rows.reduce((m, r) => (r[1] < m ? r[1] : m), Infinity);
const most = rows => rows.reduce((m, r) => (r[1] > m ? r[1] : m), -Infinity);
/* Run a rule backwards by trying whole inputs until the output matches. */
const findInput = (rule, target, from, to) => { for (let x = from; x <= to; x++) if (Math.abs(rule(x) - target) < 1e-9) return x; return NaN; };
/* How many times `start` must be multiplied by `factor` to reach `target` (counted, no logarithm). */
const growSteps = (start, factor, target) => { let v = start, n = 0; while (v < target && n < 200) { v *= factor; n++; } return v === target ? n : NaN; };
/* `start` multiplied by `factor`, `times` times over. */
const grow = (start, factor, times) => { let v = start; for (let i = 0; i < times; i++) v *= factor; return v; };
/* Whole-number side c of a right triangle with legs a and b, by search. */
const hypotenuse = (a, b) => { for (let c = 1; c <= a + b; c++) if (c * c === a * a + b * b) return c; return NaN; };

Object.assign(window.ORACLE, {
  /* Tabulate the cost for every allowed day count; read the asked row and the extremes of the column. */
  q36b: p => {
    const rows = table(p.m, p.c, p.lo, p.hi);
    return [rows.find(r => r[0] === p.a)[1], least(rows), most(rows)];
  },
  /* a and b are read off the sentence; the times come from the table for 1..hi kilograms. */
  q36c: p => {
    const rows = table(p.a, p.b, 1, p.hi);
    return [p.a, p.b, rows.find(r => r[0] === p.w)[1], most(rows)];
  },
  /* Fare table for 1..H km; the paid trip is the row whose fare is y. */
  q36d: p => {
    const rows = table(p.m, p.c, 1, p.H);
    const paid = rows.find(r => r[1] === p.y);
    return [rows.find(r => r[0] === p.a)[1], most(rows), paid ? paid[0] : NaN];
  },
  /* Old pay by adding the hourly rate hour by hour, lift it, then add the lifted pay k times. */
  q37b: p => {
    const lifted = climb(p.m, p.c, p.a) + p.r;
    return [lifted, climb(lifted, 0, p.k)];
  },
  /* Compose the two rules as functions, in both orders. */
  q37c: p => {
    const c = x => x - p.k, h = x => x / 2;
    const couponFirst = h(c(p.x)), halfFirst = c(h(p.x));
    return [couponFirst, halfFirst, couponFirst - halfFirst];
  },
  /* Build p as a function of f; find its lowest point by scanning x in steps of one half. */
  q37d: p => {
    const f = x => x * x - p.B * x + p.C;
    const moved = x => f(x - p.h) + p.k;
    let bestX = 0, bestY = Infinity;
    for (let i = -80; i <= 160; i++) { const x = i / 2, y = moved(x); if (y < bestY) { bestY = y; bestX = x; } }
    return [moved(p.a), bestX, bestY];
  },
  /* Find the gigabytes by search, then recover a and b from the inverse's shape: b is the input that costs
     nothing extra, a is the charge for one gigabyte beyond it. */
  q38b: p => {
    const C = g => p.m * (g - p.f);
    const used = findInput(C, p.y, p.f, p.f + 500);
    const b = findInput(C, 0, 0, 500);
    const a = C(b + 1) - C(b);
    return [a, b, used];
  },
  /* Count visits one at a time until the money is spent. */
  q38c: p => {
    const visits = (m, c) => findInput(n => climb(m, c, n), p.y, 0, 400);
    const A = visits(p.m1, p.c1), B = visits(p.m2, p.c2);
    return [A, B, A > B ? A - B : B - A];
  },
  /* Search for the pre-final points whose k-fold is the board, then the lengths that earn those points. */
  q38d: p => {
    const points = findInput(q => climb(q, 0, p.k), p.y, 0, 1000);
    const lengths = findInput(n => climb(p.m, p.c, n), points, 0, 400);
    return [points, lengths];
  },
  /* The multiplier is the ratio of the first two listed counts; counts and hours by repeated multiplying. */
  q39b: p => {
    const first = p.S, second = p.S * p.b;
    return [second / first, grow(p.S, p.b, p.e), growSteps(p.S, p.b, p.T)];
  },
  /* Step forward one doubling period at a time. */
  q39c: p => {
    let value = p.S; for (let year = p.P; year <= p.Y; year += p.P) value += value;
    let years = 0, v = p.S; while (v < p.T && years < 5000) { v += v; years += p.P; }
    return [value, v === p.T ? years : NaN];
  },
  /* Pass the signal through every stage of both banks, counting stages; then keep adding stages to reach T. */
  q39d: p => {
    let stages = 0, strength = p.S;
    for (let i = 0; i < p.e1; i++) { strength *= p.b; stages++; }
    for (let i = 0; i < p.e2; i++) { strength *= p.b; stages++; }
    return [stages, strength, growSteps(strength, p.b, p.T)];
  },
  /* Ratios from the sides the prompt shows; the second escalator is a scaled copy (similar triangles). */
  q40b: p => {
    const len = p.k * p.h, rise = p.k * p.o, floor = p.k * p.d;
    const scale = p.arm / len;
    return [rise / len, floor / len, floor * scale];
  },
  /* The whole cable is so many copies of the sign's stretch. */
  q40c: p => {
    const cable = p.k * p.h, up = p.k * p.o, along = p.k * p.d;
    const copies = p.total / cable;
    return [up / cable, up * copies, along * copies];
  },
  /* Rafter by searching for the whole number whose square is rise² + run². */
  q40d: p => {
    const rise = p.k * p.o, run = p.k * p.d;
    const rafter = hypotenuse(rise, run);
    return [rafter, rise / rafter, run / rafter];
  },
});
})();
