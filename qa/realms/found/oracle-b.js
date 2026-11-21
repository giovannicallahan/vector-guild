/* Independent oracles for Foundations missions q13–q24 (game/realms/found/missions-b.js).
   Each oracle first rebuilds the numbers the prompt states from the generator's parameters, then answers
   the question from its meaning by a different method from build(): simulating the situation step by step,
   evaluating an expression at sample values, searching for the value that makes an equation or inequality true,
   exact fractions, bisection for a square root, and elimination for a line through two points. */
(function(){ 'use strict';
/* The whole number v in [lo, hi] with test(v), or NaN. */
const search = (lo, hi, test) => { for (let v = lo; v <= hi; v++) if (test(v)) return v; return NaN; };
/* Exact fractions [numerator, denominator] with a positive denominator, kept in lowest terms. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return [p / g, q / g]; };
const sub = (a, b) => frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => frac(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => frac(a[0] * b[1], a[1] * b[0]);
const val = a => a[0] / a[1];
const F = x => [x, 1];
/* Repeated addition: k lots of v (k a whole number of either sign). */
const times = (k, v) => { let t = 0; for (let i = 0; i < Math.abs(k); i++) t += v; return k < 0 ? -t : t; };
/* Square root by bisection, for a non-negative s. */
const root = s => { let lo = 0, hi = Math.max(1, s); for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (mid * mid < s) lo = mid; else hi = mid; } return (lo + hi) / 2; };
/* An expression linear in its letter is fixed by its values at 0 and 1: [number in front, number on its own]. */
const linear = f => [f(1) - f(0), f(0)];

Object.assign(window.ORACLE, {
  /* The pallet as a list of items: a sealed cans, one drum of d litres, then b more sealed cans. Total litres for can size c. */
  q13: p => {
    const items = [];
    for (let i = 0; i < p.a; i++) items.push('can');
    items.push('drum');
    for (let i = 0; i < p.b; i++) items.push('can');
    return linear(c => items.reduce((t, it) => t + (it === 'can' ? c : p.d), 0));
  },
  /* Burn r litres hour by hour from S, reading the gauge after h1 and after h2 hours. */
  q14: p => {
    const readings = {}; let tank = p.S;
    for (let hour = 1; hour <= Math.max(p.h1, p.h2); hour++) { tank -= p.r; readings[hour] = tank; }
    return [readings[p.h1], readings[p.h2]];
  },
  /* k kits of (one can + s L bottle) and m loose cans; evaluate the stated total at c = 0 and c = 1. */
  q15: p => linear(c => times(p.k, c + p.s) + times(p.m, c)),
  /* The prompt states x − a = (gauge reading) and k·y = (total); find the x and y that make them true. */
  q16: p => {
    const gauge = p.x - p.a, total = p.k * p.y;
    return [search(-2000, 2000, v => v - p.a === gauge), search(-2000, 2000, v => times(p.k, v) === total)];
  },
  /* k cans of (x + s) poured into a tank holding b; the gauge reads T. Search for x; the first answer is k lots of x. */
  q17: p => {
    const T = p.k * (p.x + p.s) + p.b;
    const x = search(-2000, 2000, v => { let tank = p.b; for (let i = 0; i < p.k; i++) tank += v + p.s; return tank === T; });
    return [times(p.k, x), x];
  },
  /* Cap = base + w·nmax + extra. Kilograms left = cap − base; add cans one at a time while the load stays within the cap. */
  q18: p => {
    const cap = p.base + p.w * p.nmax + p.extra;
    let cans = 0, load = p.base;
    while (load + p.w <= cap) { load += p.w; cans++; }
    return [cap - p.base, cans];
  },
  /* Walk on the grid: west is −x, north is +y. Read a point back into east and south distances. */
  q19: p => {
    const step = { east: [1, 0], west: [-1, 0], north: [0, 1], south: [0, -1] };
    const walk = moves => moves.reduce((at, [dir, km]) => [at[0] + km * step[dir][0], at[1] + km * step[dir][1]], [0, 0]);
    const c1 = walk([['west', p.a], ['north', p.b]]);
    const c2 = [p.p, -p.q];
    const east = c2[0] >= 0 ? c2[0] : NaN, south = c2[1] <= 0 ? -c2[1] : NaN;
    return [c1[0], c1[1], east, south];
  },
  /* Rebuild the two stated points, take the gaps as sizes, and the distance by bisection on Pythagoras. */
  q20: p => {
    const A = [p.x1, p.y1], B = [p.x1 + p.sx * p.dx, p.y1 + p.sy * p.dy];
    const gx = Math.abs(B[0] - A[0]), gy = Math.abs(B[1] - A[1]);
    return [gx, gy, root(gx * gx + gy * gy)];
  },
  /* Rebuild the two stated readings (the gauge changes by m every hour), then rise, run and slope in exact fractions. */
  q21: p => {
    let litres = p.y1; for (let h = 0; h < p.run; h++) litres += p.m;
    const A = [p.x1, p.y1], B = [p.x1 + p.run, litres];
    const rise = sub(F(B[1]), F(A[1])), run = sub(F(B[0]), F(A[0]));
    return [val(rise), val(run), val(div(rise, run))];
  },
  /* Evaluate the rule y = m·x + b: slope as the change from x = 0 to x = 1, start at x = 0, then step x1 hours. */
  q22: p => {
    const y = x => times(x, p.m) + p.b;
    let tank = y(0); for (let h = 0; h < p.x1; h++) tank += y(h + 1) - y(h);
    return [y(1) - y(0), y(0), tank];
  },
  /* Rebuild the two stated points, then solve [x1 1; x2 1][m; b] = [y1; y2] by elimination in exact fractions. */
  q23: p => {
    const x1 = p.x1, x2 = p.x1 + p.run, y1 = p.m * x1 + p.b, y2 = p.m * x2 + p.b;
    let r1 = [F(x1), F(1), F(y1)], r2 = [F(x2), F(1), F(y2)];
    if (r1[0][0] === 0) [r1, r2] = [r2, r1];             // pivot on a non-zero x
    const g = div(r2[0], r1[0]);
    r2 = r2.map((v, i) => sub(v, mul(g, r1[i])));      // r2 is now [0, coefficient of b, right side]
    const b = div(r2[2], r2[1]);
    const m = div(sub(r1[2], mul(r1[1], b)), r1[0]);
    return [val(m), val(b)];
  },
  /* Fly the drone one leg at a time, one unit step at a time in each direction. */
  q24: p => {
    const at = p.s.slice();
    for (const leg of [p.d1, p.d2]) for (let i = 0; i < 3; i++) { const dir = Math.sign(leg[i]); for (let k = 0; k < Math.abs(leg[i]); k++) at[i] += dir; }
    return at;
  },
});
})();
