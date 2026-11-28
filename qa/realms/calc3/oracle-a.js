/* Independent oracles for Calculus 3 learn missions, file a: q01–q10 (game/realms/calc3/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build(): Levi-Civita sums, orthogonality checks, a numerical derivative, a search for
   the time on a line, the Lagrange identity. Do not import game files. */
(function(){ 'use strict';
const r = (x, n) => { const f = Math.pow(10, n); return Math.round(x * f) / f; };
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const len = v => Math.sqrt(dot(v, v));
/* Cross product by the Levi-Civita sum: (u × v)_i = Σ ε_ijk u_j v_k over the six permutations of 0,1,2. */
const cross = (u, v) => {
  const out = [0, 0, 0];
  [[0, 1, 2, 1], [1, 2, 0, 1], [2, 0, 1, 1], [0, 2, 1, -1], [1, 0, 2, -1], [2, 1, 0, -1]]
    .forEach(([i, j, k, s]) => { out[i] += s * u[j] * v[k]; });
  return out;
};
Object.assign(window.ORACLE, {
  /* Beacon A at p.a, B at A + p.d (p.d is the stated change B − A). Distance: walk to the smallest L, in steps of
     1/1000, whose square reaches the sum of squares, then round to the nearest 1/1000 of the true root. */
  q01: p => {
    const B = p.a.map((x, i) => x + p.d[i]);
    const s = B.reduce((t, x, i) => t + (x - p.a[i]) * (x - p.a[i]), 0);
    let L = 0;
    while (L * L < s - 1e-9) L += 0.001;
    return [r(L, 3)];
  },
  /* Arrows u, v; the combination is p.a·u + p.b·v (the prompt's "2u − v" has a = 2, b = −1). */
  q02: p => [0, 1, 2].map(i => p.a * p.u[i] + p.b * p.v[i]),
  /* Magnitude by search for the number whose square is the sum of squares; unit vector components divide by it. */
  q03: p => {
    const s = dot(p.v, p.v);
    let m = 0;
    while (m * m < s - 1e-9) m += 0.001;
    m = r(m, 3);
    return [m, ...p.v.map(x => x / m)];
  },
  /* Dot product, then the angle from cos θ = u·v ÷ (‖u‖‖v‖), found by scanning θ in [0, π] for that cosine and
     refining by bisection; rounded to 3 decimals. */
  q04: p => {
    const d = dot(p.u, p.v), c = d / (len(p.u) * len(p.v));
    let lo = 0, hi = Math.PI;
    for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (Math.cos(m) > c) lo = m; else hi = m; }
    return [d, r((lo + hi) / 2, 3)];
  },
  /* Work = F·d. The scalar projection is the length of the part of F along d, found as F·(d/‖d‖) using the unit
     direction. */
  q05: p => {
    const w = dot(p.F, p.d), dl = len(p.d);
    return [r(dot(p.F, p.d.map(x => x / dl)), 9), w];
  },
  /* Cross product by Levi-Civita sums. Area from the Lagrange identity: area² = ‖u‖²‖v‖² − (u·v)². */
  q06: p => {
    const n = cross(p.u, p.v);
    const area = Math.sqrt(dot(p.u, p.u) * dot(p.v, p.v) - dot(p.u, p.v) ** 2);
    return [...n, r(area, 9)];
  },
  /* Line starts at (p.p[0], p.p[1], z0) and moves by ⟨dx, dy, dz⟩ each second. The start height z0 is not stored;
     it is h − dz·T, because the line is built to reach height h at time T (T is only the intended time).
     Step t forward in whole seconds until z reaches h, then read x and y at that t. */
  q07: p => {
    const z0 = p.h - p.dz * p.T;
    let t = 0;
    for (; t < 1000 && z0 + p.dz * t !== p.h; t++);
    return [t, p.p[0] + p.dx * t, p.p[1] + p.dy * t];
  },
  /* Q = P + p.a and R = P + p.b (p.a, p.b are the arrows PQ and PR). Normal from Levi-Civita sums; d = n · P. */
  q08: p => {
    const Q = p.P.map((x, i) => x + p.a[i]), R = p.P.map((x, i) => x + p.b[i]);
    const n = cross(Q.map((x, i) => x - p.P[i]), R.map((x, i) => x - p.P[i]));
    return [...n, dot(n, p.P)];
  },
  /* Plane c·x = d. Value at the drone is c·X − d. Distance: move the drone along the unit normal until the plane
     value reaches 0 (the plane value changes by ‖c‖ per metre), found by bisection on the signed step s. */
  q09: p => {
    const val = dot(p.c, p.X) - p.d;
    const nl = len(p.c), u = p.c.map(x => x / nl);
    const f = s => dot(p.c, p.X.map((x, i) => x - s * u[i])) - p.d;
    let lo = -1000, hi = 1000;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
    return [val, r(Math.abs((lo + hi) / 2), 2)];
  },
  /* r(t) = ⟨a t² + b t, (c/π) sin(πt), e t³⟩, evaluated at t = T. Velocity by a five-point numerical derivative of
     each component; speed from the three rounded velocities; z acceleration by a central second difference of z(t). */
  q10: p => {
    const comp = [t => p.a * t * t + p.b * t, t => (p.c / Math.PI) * Math.sin(Math.PI * t), t => p.e * t * t * t];
    const h = 1e-3;
    const v = comp.map(f => r((-f(p.T + 2 * h) + 8 * f(p.T + h) - 8 * f(p.T - h) + f(p.T - 2 * h)) / (12 * h), 6));
    const z = comp[2], az = r((z(p.T + h) - 2 * z(p.T) + z(p.T - h)) / (h * h), 3);
    return [...v, r(len(v), 2), az];
  },
});
})();
