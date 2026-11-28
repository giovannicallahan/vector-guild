/* Independent oracles for Calculus 3: many variables practice missions, file 2 of 8: q06b–q10d (game/realms/calc3/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const rd = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
/* Cross product by the permutation (Levi-Civita) sum, not by writing out the three components. */
const eps = (i, j, k) => (i - j) * (j - k) * (k - i) / 2;
const cross = (u, v) => [0, 1, 2].map(i => { let s = 0; for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) s += eps(i, j, k) * u[j] * v[k]; return s; });
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const len = u => Math.hypot(...u);
const sub = (u, v) => u.map((x, i) => x - v[i]);
const add = (u, v) => u.map((x, i) => x + v[i]);
/* 3 × 3 determinant, Sarrus (the scalar triple product). */
const det3 = (a, b, c) => a[0] * b[1] * c[2] + b[0] * c[1] * a[2] + c[0] * a[1] * b[2] - c[0] * b[1] * a[2] - a[0] * c[1] * b[2] - b[0] * a[1] * c[2];
/* Signed value of n·x − d at X, and the shortest distance: foot of the perpendicular, then the straight length from X to it. */
const footDistance = (n, d, X) => { const t = (dot(n, X) - d) / dot(n, n); const foot = X.map((x, i) => x - t * n[i]); return len(sub(X, foot)); };
/* Derivatives by central differences: first with a very small step, second likewise. */
const D1 = (f, t) => { const h = 1e-5, a = f(t + h), b = f(t - h); return a.map((x, i) => r6((x - b[i]) / (2 * h))); };
const D2 = (f, t) => { const h = 1e-3, a = f(t + h), c = f(t), b = f(t - h); return a.map((x, i) => r6((x - 2 * c[i] + b[i]) / (h * h))); };
Object.assign(window.ORACLE, {
  /* q06b: torque r × F (permutation sum), then its length. */
  q06b: p => { const T = cross(p.r, p.F); return [...T, r6(len(T))]; },
  /* q06c: triangle area by Heron's formula from the three side lengths (not half the cross product), then mass. */
  q06c: p => {
    const a = len(p.u), b = len(p.v), c = len(sub(p.u, p.v)), s = (a + b + c) / 2;
    const area = r6(Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c))));
    return [area, r6(area * p.rho)];
  },
  /* q06d: u × v, then the volume as the size of the determinant with rows u, v, w (Sarrus). */
  q06d: p => [...cross(p.u, p.v), Math.abs(det3(p.u, p.v, p.w))],
  /* q07b: z = s_z + v_z t; the target height is the height reached after T seconds (T is the intended time, so it only fixes the printed height);
     step second by second until the height is reached, then read x and y. */
  q07b: p => {
    const H = p.s[2] + p.v[2] * p.T;
    let t = 0; while (p.s[2] + p.v[2] * t !== H) { t++; if (t > 1000) return [NaN, NaN, NaN]; }
    return [t, p.s[0] + p.v[0] * t, p.s[1] + p.v[1] * t];
  },
  /* q07c: p is only the (x, y) of A; A's height is h − T·v_z so that the ring height h is met at time T (T and v fix the printed A).
     B = A + 2v is what the prompt prints, so rebuild the steady rate from the two radar fixes (÷ 2 s), then step until z = h. */
  q07c: p => {
    const A = [p.p[0], p.p[1], p.h - p.T * p.v[2]], B = add(A, p.v.map(x => 2 * x));
    const rate = B.map((x, i) => (x - A[i]) / 2);
    let t = 0; while (Math.abs(A[2] + rate[2] * t - p.h) > 1e-9) { t++; if (t > 1000) return [NaN, NaN, NaN]; }
    return [t, A[0] + rate[0] * t, A[1] + rate[1] * t];
  },
  /* q07d: find the moment by solving each coordinate equation A0 + dA t = B0 + dB t and requiring all three to agree; then the path length. */
  q07d: p => {
    let t = null;
    for (let i = 0; i < 3; i++) if (p.dA[i] !== p.dB[i]) { t = (p.B0[i] - p.A0[i]) / (p.dA[i] - p.dB[i]); break; }
    const at = (o, d) => o.map((x, i) => x + d[i] * t), a = at(p.A0, p.dA), b = at(p.B0, p.dB);
    if (a.some((x, i) => Math.abs(x - b[i]) > 1e-9)) return [NaN];
    return [t, ...a, r6(t * len(p.dA))];
  },
  /* q08b: Q = P + a and R = P + b are the printed pegs (a and b are the two edge vectors from P); n = PQ × PR, d = n·P. */
  q08b: p => { const P = p.P, Q = add(P, p.a), R = add(P, p.b), n = cross(sub(Q, P), sub(R, P)); return [...n, dot(n, P)]; },
  /* q08c: same plane, then n·S − d at the fourth hole S. */
  q08c: p => { const P = p.P, Q = add(P, p.a), R = add(P, p.b), n = cross(sub(Q, P), sub(R, P)), d = dot(n, P); return [d, dot(n, p.S) - d]; },
  /* q08d: n1 from the bolts; the angle by atan2(|n1 × n2|, n1·n2), rounded to 3 places (n2 = m; e is only the right-hand side of the printed plane). */
  q08d: p => {
    const P = p.P, n1 = cross(sub(add(P, p.a), P), sub(add(P, p.b), P));
    return [...n1, rd(Math.atan2(len(cross(n1, p.m)), dot(n1, p.m)), 3)];
  },
  /* q09b: plane c·x + e = 0; value at X, then the distance by the foot of the perpendicular, to 2 places. */
  q09b: p => [dot(p.c, p.X) + p.e, rd(footDistance(p.c, -p.e, p.X), 2)],
  /* q09c: the drone sits side·m units from the plane (side is its side of the plane, m the distance), so the plane is c·x = c·X − side·m·|c|
     (the printed value at the drone is therefore side·m·|c|; L is |c| and is not used). Then distance by the foot of the perpendicular, and time = distance ÷ speed. */
  q09c: p => {
    const d = dot(p.c, p.X) - p.side * p.m * len(p.c), dist = footDistance(p.c, d, p.X);
    return [dot(p.c, p.X) - d, r6(dist), r6(dist / p.v)];
  },
  /* q09d: plane through the three bolts, value at the drone, distance to 2 places. */
  q09d: p => {
    const P = p.P, n = cross(sub(add(P, p.a), P), sub(add(P, p.b), P)), d = dot(n, P);
    return [d, dot(n, p.X) - d, rd(footDistance(n, d, p.X), 2)];
  },
  /* q10b: r(t) = ⟨a t² + b t, (c ÷ π) cos(π t), e t²⟩; velocity by a central difference, speed to 2 places. */
  q10b: p => {
    const f = t => [p.a * t * t + p.b * t, (p.c / Math.PI) * Math.cos(Math.PI * t), p.e * t * t], v = D1(f, p.T);
    return [...v, rd(len(v), 2)];
  },
  /* q10c: r(t) = ⟨p t³ + u t, q t² + w t, s t³⟩; acceleration by a second difference, thrust = m |a| to 2 places. */
  q10c: p => {
    const f = t => [p.p * t ** 3 + p.u * t, p.q * t * t + p.w * t, p.s * t ** 3], a = D2(f, p.T);
    return [...a, rd(p.m * len(a), 2)];
  },
  /* q10d: r(t) = ⟨p t² + u t, (c ÷ 2π) sin(2π t), s t³⟩; forecast = r(T) + 0.5 v(T), v by a central difference. */
  q10d: p => {
    const f = t => [p.p * t * t + p.u * t, (p.c / (2 * Math.PI)) * Math.sin(2 * Math.PI * t), p.s * t ** 3], v = D1(f, p.T), r = f(p.T);
    return r.map((x, i) => r6(x + 0.5 * v[i]));
  },
});
})();
