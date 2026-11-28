/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 8 of 8: q36b–q40d (game/realms/complex/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Complex numbers as [re, im]. */
const mul = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]];
const div = (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; };
const sub = (u, v) => [u[0] - v[0], u[1] - v[1]];
const add = (u, v) => [u[0] + v[0], u[1] + v[1]];
const scale = (s, u) => [s * u[0], s * u[1]];
const ipow = (u, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = mul(r, u); return r; };
const poly = (cs, z) => { let r = [0, 0]; for (const c of cs) r = add(mul(r, z), [c, 0]); return r; }; // cs from highest power down
/* Contour integral of f round a circle (centre c, radius rho) once anticlockwise, by the trapezoid rule on the parameter. */
const circle = (f, c, rho, N = 6000) => {
  let s = [0, 0];
  for (let j = 0; j < N; j++) {
    const th = 2 * Math.PI * j / N, e = [Math.cos(th), Math.sin(th)];
    s = add(s, mul(f(add(c, scale(rho, e))), scale(rho, mul([0, 1], e))));
  }
  return scale(2 * Math.PI / N, s);
};
/* Residue at a: the integral round a small circle, divided by 2 pi i. */
const residue = (f, a, rho) => { const I = circle(f, a, rho, 4000); return I[1] / (2 * Math.PI); };
/* Number of anticlockwise turns of f(z) round 0 as z goes once round the circle (centre c, radius R), by adding up small angle steps. */
const turns = (f, c, R, dir = 1, N = 8000) => {
  let tot = 0, prev = null;
  for (let j = 0; j <= N; j++) {
    const th = dir * 2 * Math.PI * j / N, v = f(add(c, [R * Math.cos(th), R * Math.sin(th)]));
    if (prev) { const q = mul(v, [prev[0], -prev[1]]); tot += Math.atan2(q[1], q[0]); }
    prev = v;
  }
  return Math.round(tot / (2 * Math.PI) * 1e6) / 1e6;
};
/* Midpoint rule on the whole real line, with x = tan t. */
const wholeLine = (f, N = 20000) => {
  let s = 0; const h = Math.PI / N;
  for (let j = 0; j < N; j++) { const t = -Math.PI / 2 + (j + 0.5) * h, x = Math.tan(t); s += f(x) / (Math.cos(t) * Math.cos(t)); }
  return s * h;
};
/* Midpoint rule from 0 to 2 pi. */
const turn = (f, N = 20000) => { let s = 0; const h = 2 * Math.PI / N; for (let j = 0; j < N; j++) s += f((j + 0.5) * h); return s * h; };
const dist = (z, c) => Math.hypot(z[0] - c[0], z[1] - c[1]);
/* q39 tables: t is only an index into a list of (a, b) pairs with a² − b² a perfect square (read off the printed prompts). */
const TAB_BC = [[5,3],[5,4],[10,6],[10,8],[13,5],[13,12],[17,8],[17,15],[25,7],[25,24],[15,9],[15,12],[20,12],[20,16]];
const TAB_D  = [[13,5],[13,12],[17,8],[17,15],[25,7],[25,24],[26,10],[29,20],[29,21],[34,16],[37,12],[41,9],[41,40],[37,35]];
Object.assign(window.ORACLE, {
  /* q36b: g(z) = z³ + p z² + q z + r over (z − a)²; j(z) = u z³ + t z² + v z + w over (z − b)³; residues by a small circle round each pole. */
  q36b: p => {
    const f = z => div(poly([1, p.p, p.q, p.r], z), ipow(sub(z, [p.a, 0]), 2));
    const h = z => div(poly([p.u, p.t, p.v, p.w], z), ipow(sub(z, [p.b, 0]), 3));
    return [r6(residue(f, [p.a, 0], 0.5)), r6(residue(h, [p.b, 0], 0.5))];
  },
  /* q36c: f = w1 g/(z − a) + w2 g/(z − a)² + w3 g/(z − a)³ with g = z³ + p z² + q z + r; residue of the third term, then of the sum. */
  q36c: p => {
    const g = z => poly([1, p.p, p.q, p.r], z), A = [p.a, 0];
    const t3 = z => scale(p.w3, div(g(z), ipow(sub(z, A), 3)));
    const f = z => add(add(scale(p.w1, div(g(z), sub(z, A))), scale(p.w2, div(g(z), ipow(sub(z, A), 2)))), t3(z));
    return [r6(residue(t3, A, 0.5)), r6(residue(f, A, 0.5))];
  },
  /* q36d: f = g/((z − a)²(z − b)), g = p z² + q z + r, simple pole at b = a − d (d is ±1). */
  q36d: p => {
    const a = p.a, b = p.a - p.d;
    const f = z => div(poly([p.p, p.q, p.r], z), mul(ipow(sub(z, [a, 0]), 2), sub(z, [b, 0])));
    return [r6(residue(f, [a, 0], 0.4)), r6(residue(f, [b, 0], 0.4))];
  },
  /* q37b: f = A/(z − a) + B/(z − b) + C/(z − d); count poles with distance from c below r, then the integral round the circle in units of pi i. */
  q37b: p => {
    const poles = [p.a, p.b, p.d], C0 = [p.c, 0];
    const f = z => add(add(div([p.A, 0], sub(z, [p.a, 0])), div([p.B, 0], sub(z, [p.b, 0]))), div([p.C, 0], sub(z, [p.d, 0])));
    const inside = poles.filter(x => Math.abs(x - p.c) < p.r).length;
    return [inside, r6(circle(f, C0, p.r)[1] / Math.PI)];
  },
  /* q37c: f = g/(z − a)² + A/(z − b), g = p z² + q z + r, round |z| = R once anticlockwise. */
  q37c: p => {
    const f = z => add(div(poly([p.p, p.q, p.r], z), ipow(sub(z, [p.a, 0]), 2)), div([p.A, 0], sub(z, [p.b, 0])));
    const rho = Math.min(0.5, Math.abs(p.a - p.b) / 2);
    return [r6(residue(f, [p.a, 0], rho)), r6(circle(f, [0, 0], p.R, 8000)[1] / Math.PI)];
  },
  /* q37d: f = A/(z − P1) + B/(z − P2) + (D z + E)/(z − P3)², loop goes m times round |z| = R. Sum of residues inside = (one lap) ÷ 2 pi i. */
  q37d: p => {
    const P1 = [p.x1, p.y1], P2 = [p.x2, p.y2], P3 = [p.x3, p.y3];
    const f = z => add(add(div([p.A, 0], sub(z, P1)), div([p.B, 0], sub(z, P2))), div(add(scale(p.D, z), [p.E, 0]), ipow(sub(z, P3), 2)));
    const lap = circle(f, [0, 0], p.R, 8000), sum = lap[1] / (2 * Math.PI);
    return [r6(sum), r6(p.m * lap[1] / Math.PI)];
  },
  /* q38b: I1 = ∫ j a dx ÷ ((x − h)² + a²) (numerator 4 = 2 × 2 in the prompt); I2 = ∫ J (p + q) x² dx ÷ ((x² + p²)(x² + q²)); both in units of pi. */
  q38b: p => [
    r6(wholeLine(x => p.j * p.a / ((x - p.h) * (x - p.h) + p.a * p.a)) / Math.PI),
    r6(wholeLine(x => p.J * (p.p + p.q) * x * x / ((x * x + p.p * p.p) * (x * x + p.q * p.q))) / Math.PI)
  ],
  /* q38c: line 1 = H1 a1² ÷ (x² + a1²), line 2 = H2 a2² ÷ (x² + a2²), as the prompt's 12 ÷ (x² + 4) = 3 × 4 ÷ (x² + 4). */
  q38c: p => {
    const l1 = x => p.H1 * p.a1 * p.a1 / (x * x + p.a1 * p.a1), l2 = x => p.H2 * p.a2 * p.a2 / (x * x + p.a2 * p.a2);
    return [r6(wholeLine(l1) / Math.PI), r6(wholeLine(x => l1(x) + l2(x)) / Math.PI)];
  },
  /* q38d: I1 = ∫ 2a³ J1 dx ÷ (x² + a²)² (48 = 2 × 8 × 3 when a = 2, J1 = 3); I2 = ∫ 2a J2 x² dx ÷ (x² + a²)² (4 = 2 × 2 × 1). */
  q38d: p => [
    r6(wholeLine(x => 2 * p.a * p.a * p.a * p.J1 / Math.pow(x * x + p.a * p.a, 2)) / Math.PI),
    r6(wholeLine(x => 2 * p.a * p.J2 * x * x / Math.pow(x * x + p.a * p.a, 2)) / Math.PI)
  ],
  /* q39b: c ÷ (a ∓ b sin θ), c = k √(a² − b²) ÷ 2 (prompt: c = 8 for 5, 3, k = 4). t indexes the (a, b) list; neg = 1 means minus. */
  q39b: p => {
    const [a, b] = TAB_BC[p.t], s = Math.sqrt(a * a - b * b), c = p.k * s / 2, sg = p.neg ? -1 : 1;
    return [s, r6(turn(th => c / (a + sg * b * Math.sin(th))) / Math.PI)];
  },
  /* q39c: P = c ÷ (a ∓ b cos θ), same c rule; answers k and the mean reading I ÷ 2 pi. */
  q39c: p => {
    const [a, b] = TAB_BC[p.t], s = Math.sqrt(a * a - b * b), c = p.k * s / 2, sg = p.neg ? -1 : 1;
    const I = turn(th => c / (a + sg * b * Math.cos(th)));
    return [r6(I / Math.PI), r6(I / (2 * Math.PI))];
  },
  /* q39d: c ÷ (a ± b cos θ); after z = e^(iθ) the bottom is a multiple of B z² + 2a z + B, B = ±b; the root inside the unit circle (2 places). */
  q39d: p => {
    const [a, b] = TAB_D[p.t], s = Math.sqrt(a * a - b * b), c = p.k * s / 2, B = p.neg ? -b : b;
    const roots = [(-2 * a + Math.sqrt(4 * a * a - 4 * B * B)) / (2 * B), (-2 * a - Math.sqrt(4 * a * a - 4 * B * B)) / (2 * B)];
    const inside = Math.min(Math.abs(roots[0]), Math.abs(roots[1]));
    return [s, Math.round(inside * 100) / 100, r6(turn(th => c / (a + (p.neg ? -b : b) * Math.cos(th))) / Math.PI)];
  },
  /* q40b: f = (z − x1)^m1 (z − x2)^m2 (z − x3)^m3 ÷ (z − w)^n on |z − c| = r; Z, P by distance, k = 2 × (turns of f round 0). */
  q40b: p => {
    const f = z => div(mul(mul(ipow(sub(z, [p.x1, 0]), p.m1), ipow(sub(z, [p.x2, 0]), p.m2)), ipow(sub(z, [p.x3, 0]), p.m3)), ipow(sub(z, [p.w, 0]), p.n));
    const C0 = [p.c, 0], zs = [[p.x1, p.m1], [p.x2, p.m2], [p.x3, p.m3]];
    let Z = 0; for (const [x, m] of zs) if (Math.abs(x - p.c) < p.r) Z += m;
    const P = Math.abs(p.w - p.c) < p.r ? p.n : 0;
    return [Z, P, r6(2 * turns(f, C0, p.r))];
  },
  /* q40c: F = (z − z1)^m1 ÷ (z − w1)^n1, H = (z − z2)^m2 ÷ (z − w2)^n2, round |z| = R once anticlockwise; turns of H and of F H round 0. */
  q40c: p => {
    const F = z => div(ipow(sub(z, [p.z1x, p.z1y]), p.m1), ipow(sub(z, [p.w1x, p.w1y]), p.n1));
    const H = z => div(ipow(sub(z, [p.z2x, p.z2y]), p.m2), ipow(sub(z, [p.w2x, p.w2y]), p.n2));
    return [r6(turns(H, [0, 0], p.R)), r6(turns(z => mul(F(z), H(z)), [0, 0], p.R))];
  },
  /* q40d: zeros z1 + i z1y (m1), z2 + i z2y (m2), poles w1 + i w1y (n1), w2 + i w2y (n2), on |z| = R traced once clockwise (dir −1). */
  q40d: p => {
    const Zs = [[[p.z1, p.z1y], p.m1], [[p.z2, p.z2y], p.m2]], Ps = [[[p.w1, p.w1y], p.n1], [[p.w2, p.w2y], p.n2]];
    const f = z => { let r = [1, 0]; for (const [x, m] of Zs) r = mul(r, ipow(sub(z, x), m)); for (const [x, n] of Ps) r = div(r, ipow(sub(z, x), n)); return r; };
    let Z = 0, P = 0;
    for (const [x, m] of Zs) if (Math.hypot(x[0], x[1]) < p.R) Z += m;
    for (const [x, n] of Ps) if (Math.hypot(x[0], x[1]) < p.R) P += n;
    return [Z, P, r6(turns(f, [0, 0], p.R, -1))];
  }
});
})();
