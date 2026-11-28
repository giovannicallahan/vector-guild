/* Independent oracles for Calculus 3: many variables practice missions, file 7 of 8: q31b–q35d (game/realms/calc3/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r4 = x => { const v = Math.round(x * 1e4) / 1e4; return v === 0 ? 0 : v; };
/* Integral of g from a to b by composite Simpson's rule (no antiderivative used). */
const area = (g, a, b) => {
  const n = 400, h = (b - a) / n; let s = g(a) + g(b);
  for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Work of F along the path r (with velocity v) from t = t0 to t1, by Simpson on F(r(t)) . r'(t). */
const work = (F, r, v, t0, t1) => area(t => { const f = F(...r(t)), w = v(t); return f.reduce((s, c, i) => s + c * w[i], 0); }, t0, t1);
/* Straight leg from point A to point B (any dimension): work of F along it. */
const leg = (F, A, B) => work(F, t => A.map((a, i) => a + t * (B[i] - a)), () => B.map((b, i) => b - A[i]), 0, 1);
/* Central-difference partial derivative of g (a function of a point array) in coordinate i. */
const D = (g, pt, i, h = 1e-2) => { const u = pt.slice(), d = pt.slice(); u[i] += h; d[i] -= h; return (g(u) - g(d)) / (2 * h); };
/* Rope directions: p.dir is only an index into this list of (end - start) vectors; q31b and q31c read the same list. */
const DIRS = [[1,2,2],[2,1,2],[2,2,1],[2,3,6],[3,2,6],[6,2,3],[4,4,7],[1,4,8],[4,1,8],[8,4,1]];
/* Spiral pairs: p.pair is only an index into [radius, climb per unit t]; the speed is sqrt(radius² + climb²). */
const PAIRS = [[3,4],[4,3],[5,12],[12,5],[6,8],[8,6]];
/* Mass of a straight rope P0 + t d (t in 0..1) with density rho(point): Simpson on rho * |d|. */
const ropeMass = (P0, d, rho) => { const sp = Math.hypot(...d); return area(t => rho(P0.map((c, i) => c + t * d[i])) * sp, 0, 1); };
Object.assign(window.ORACLE, {
  /* q31b: F = <a x + b z, c y z, d x y> at the foot; rope density m + k x along the rope (dir indexes DIRS). */
  q31b: p => {
    const d = DIRS[p.dir], P0 = [p.x0, p.y0, p.z0];
    const F = [p.a * p.x0 + p.b * p.z0, p.c * p.y0 * p.z0, p.d * p.x0 * p.y0];
    return [...F, r4(ropeMass(P0, d, q => p.m + p.k * q[0]))];
  },
  /* q31c: density m + k times x, y or z (p.iv = 0, 1, 2 picks the coordinate); weight = 10 times the mass. */
  q31c: p => {
    const d = DIRS[p.dir], P0 = [p.x0, p.y0, p.z0];
    const M = r4(ropeMass(P0, d, q => p.m + p.k * q[p.iv]));
    return [M, r4(10 * M)];
  },
  /* q31d: helix <R cos t, R sin t, c t> (p.pair indexes PAIRS), density m + k z, t from 0 to T. */
  q31d: p => {
    const [R, c] = PAIRS[p.pair];
    const sp = t => Math.hypot(-R * Math.sin(t), R * Math.cos(t), c);
    return [r4(sp(0.7)), r4(area(t => (p.m + p.k * c * t) * sp(t), 0, p.T))];
  },
  /* q32b: F = <a y, b x - c> along <t^2, t>, t from 0 to T. */
  q32b: p => [r4(work((x, y) => [p.a * y, p.b * x - p.c], t => [t * t, t], t => [2 * t, 1], 0, p.T))],
  /* q32c: F = <p x + s, q y> along <a t, b t>; average power = work / T. */
  q32c: p => {
    const W = work((x, y) => [p.p * x + p.s, p.q * y], t => [p.a * t, p.b * t], () => [p.a, p.b], 0, p.T);
    return [r4(W), r4(W / p.T)];
  },
  /* q32d: F = <-a y, b x> round a circle of radius R, t from 0 to j*pi/2 (p.j is 1 or 2); answer is work / pi. */
  q32d: p => [r4(work((x, y) => [-p.a * y, p.b * x], t => [p.R * Math.cos(t), p.R * Math.sin(t)],
    t => [-p.R * Math.sin(t), p.R * Math.cos(t)], 0, p.j * Math.PI / 2) / Math.PI)],
  /* q33b: F = <a x + k y, b x + c y>; conservative needs dP/dy = dQ/dx, so k = b. Work along one straight leg (path independent). */
  q33b: p => {
    const F = (x, y) => [p.a * x + p.b * y, p.b * x + p.c * y];
    return [p.b, r4(leg(F, [p.x1, p.y1], [p.x2, p.y2]))];
  },
  /* q33c: F = <2a x y + b, a x^2 + c>; work on A to B and on B to C, each by a straight leg. */
  q33c: p => {
    const F = (x, y) => [2 * p.a * x * y + p.b, p.a * x * x + p.c];
    return [r4(leg(F, [p.xa, p.ya], [p.xb, p.yb])), r4(leg(F, [p.xb, p.yb], [p.xc, p.yc]))];
  },
  /* q33d: F = <2a x y + c z, a x^2 + b z, b y + c x>; work A to B, then B to the origin, each by a straight leg. */
  q33d: p => {
    const F = (x, y, z) => [2 * p.a * x * y + p.c * z, p.a * x * x + p.b * z, p.b * y + p.c * x];
    return [r4(leg(F, p.A, p.B)), r4(leg(F, p.B, [0, 0, 0]))];
  },
  /* q34b: F = <c x - a y, b x + d y^2> round a circle of radius R anticlockwise. First answer dQ/dx - dP/dy by
     differences; second is the line integral round the circle, divided by pi. */
  q34b: p => {
    const P = (x, y) => p.c * x - p.a * y, Q = (x, y) => p.b * x + p.d * y * y;
    const curl = D(u => Q(u[0], u[1]), [0.7, 0.4], 0) - D(u => P(u[0], u[1]), [0.7, 0.4], 1);
    const W = work((x, y) => [P(x, y), Q(x, y)], t => [p.R * Math.cos(t), p.R * Math.sin(t)],
      t => [-p.R * Math.sin(t), p.R * Math.cos(t)], 0, 2 * Math.PI);
    return [r4(curl), r4(W / Math.PI)];
  },
  /* q34c: F = <p x^2 + a x y, r x y + c x> round the rectangle from (x0,y0), width W, height H, by four straight edges;
     nl clockwise laps give minus nl times one anticlockwise lap. */
  q34c: p => {
    const F = (x, y) => [p.p * x * x + p.a * x * y, p.r * x * y + p.c * x];
    const X = p.x0, Y = p.y0, x2 = X + p.W, y2 = Y + p.H;
    const lap = leg(F, [X, Y], [x2, Y]) + leg(F, [x2, Y], [x2, y2]) + leg(F, [x2, y2], [X, y2]) + leg(F, [X, y2], [X, Y]);
    return [r4(lap), r4(-p.nl * lap)];
  },
  /* q34d: F = <-a y^2 + b x, r x y + c x> round the triangle (0,0), (w,0), (0,h) anticlockwise, by three straight edges. */
  q34d: p => {
    const F = (x, y) => [-p.a * y * y + p.b * x, p.r * x * y + p.c * x];
    const lap = leg(F, [0, 0], [p.w, 0]) + leg(F, [p.w, 0], [0, p.h]) + leg(F, [0, p.h], [0, 0]);
    return [p.w * p.h / 2, r4(lap)];
  },
  /* q35b: F = <p x^2 y + q z, r y z^2 + s x, t x y z>; div and curl at the point by central differences. */
  q35b: p => {
    const F = u => [p.p * u[0] * u[0] * u[1] + p.q * u[2], p.r * u[1] * u[2] * u[2] + p.s * u[0], p.t * u[0] * u[1] * u[2]];
    const pt = [p.x0, p.y0, p.z0], d = (c, i) => D(u => F(u)[c], pt, i);
    return [r4(d(0, 0) + d(1, 1) + d(2, 2)), r4(d(2, 1) - d(1, 2)), r4(d(0, 2) - d(2, 0)), r4(d(1, 0) - d(0, 1))];
  },
  /* q35c: F = <a x z + b y, c y^2 + d x, e z^2 + f x y>; div by central differences; outflow = div * V. */
  q35c: p => {
    const F = u => [p.a * u[0] * u[2] + p.b * u[1], p.c * u[1] * u[1] + p.d * u[0], p.e * u[2] * u[2] + p.f * u[0] * u[1]];
    const pt = [p.x0, p.y0, p.z0];
    const dv = [0, 1, 2].reduce((s, i) => s + D(u => F(u)[i], pt, i), 0);
    return [r4(dv), r4(dv * p.V)];
  },
  /* q35d: phi = a x^2 y + b y z^2 + c x z; F = grad phi (by differences) plus the fan's spin <-k y, k x, 0>; then div F and |curl F| by differences of F. */
  q35d: p => {
    const phi = u => p.a * u[0] * u[0] * u[1] + p.b * u[1] * u[2] * u[2] + p.c * u[0] * u[2];
    const F = u => [0, 1, 2].map(i => D(phi, u, i) + [-p.k * u[1], p.k * u[0], 0][i]);
    const pt = [p.x0, p.y0, p.z0], d = (c, i) => D(u => F(u)[c], pt, i);
    const dv = d(0, 0) + d(1, 1) + d(2, 2);
    const cl = Math.hypot(d(2, 1) - d(1, 2), d(0, 2) - d(2, 0), d(1, 0) - d(0, 1));
    return [...F(pt).map(r4), r4(dv), r4(cl)];
  },
});
})();
