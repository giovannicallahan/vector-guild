/* Independent oracles for Calculus 3: many variables practice missions, file 3 of 8: q11b–q15d (game/realms/calc3/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Positive root of an increasing function g on t > 0 with g(0) < 0: bisection. */
const posRoot = g => { let lo = 0, hi = 1; while (g(hi) < 0) hi *= 2; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (g(mid) < 0) lo = mid; else hi = mid; } return (lo + hi) / 2; };
/* Speed of a path r(t) = [x, y, z] at time t: central difference of every component, then the length. */
const speedAt = (r, t) => { const h = 1e-5, a = r(t + h), b = r(t - h); return Math.hypot(...a.map((v, i) => (v - b[i]) / (2 * h))); };
/* First partial derivatives (fourth-order central difference) and second ones (Richardson on central differences). */
const d1 = (f, x, y, dir) => { const h = 1e-3, e = dir === 'x' ? [1, 0] : [0, 1], F = k => f(x + k * h * e[0], y + k * h * e[1]); return (F(-2) - 8 * F(-1) + 8 * F(1) - F(2)) / (12 * h); };
const d2 = (f, x, y, dir) => { const e = dir === 'x' ? [1, 0] : [0, 1], D = h => (f(x + h * e[0], y + h * e[1]) - 2 * f(x, y) + f(x - h * e[0], y - h * e[1])) / (h * h); return (4 * D(0.005) - D(0.01)) / 3; };
const dxy = (f, x, y) => { const D = h => (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h); return (4 * D(0.005) - D(0.01)) / 3; };
/* Limit of g(x) as x -> 0, from both sides. */
const limAt0 = g => r6((g(1e-5) + g(-1e-5)) / 2);
/* Slopes tried (plus the vertical line x = 0) to decide whether a limit at (0, 0) is the same from every direction. */
const SLOPES = []; for (let k = -12; k <= 12; k++) SLOPES.push(k * 0.73 + 0.11);
const agrees = f => {
  const vals = [];
  for (const m of SLOPES) for (const x of [1e-7, -1e-7]) { const v = f(x, m * x); if (isFinite(v)) vals.push(v); }
  for (const y of [1e-7, -1e-7]) { const v = f(0, y); if (isFinite(v)) vals.push(v); }
  return Math.max(...vals) - Math.min(...vals) < 1e-4;
};
Object.assign(window.ORACLE, {
  /* q11b: r(t) = <a t, t², b t> in the plane p x + y + q z = N, with N the plane constant printed in the prompt
     (= its value at the intended arrival time T). Bisection for the positive time, then the speed by differences. */
  q11b: p => {
    const r = t => [p.a * t, t * t, p.b * t], N = p.p * p.a * p.T + p.T * p.T + p.q * p.b * p.T;
    const t = posRoot(u => { const v = r(u); return p.p * v[0] + v[1] + p.q * v[2] - N; });
    return [r6(t), r6(speedAt(r, t))];
  },
  /* q11c: r(t) = <t², a t, b t> in the plane x + p y + q z = N, mass m: time, speed, kinetic energy ½ m v². */
  q11c: p => {
    const r = t => [t * t, p.a * t, p.b * t], N = p.T * p.T + p.p * p.a * p.T + p.q * p.b * p.T;
    const t = posRoot(u => { const v = r(u); return v[0] + p.p * v[1] + p.q * v[2] - N; });
    const v = speedAt(r, t);
    return [r6(t), r6(v), r6(0.5 * p.m * v * v)];
  },
  /* q11d: s is only a layout index: 0 = <t², a t, b t> in x + 2y + 2z, 1 = <a t, t², b t> in 2x + y + 2z,
     2 = <a t, b t, t²> in 2x + 2y + z. Time of arrival, distance from the plane at t0, speed on arrival. */
  q11d: p => {
    const r = [t => [t * t, p.a * t, p.b * t], t => [p.a * t, t * t, p.b * t], t => [p.a * t, p.b * t, t * t]][p.s];
    const n = [[1, 2, 2], [2, 1, 2], [2, 2, 1]][p.s], dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const N = dot(n, r(p.T));
    const t = posRoot(u => dot(n, r(u)) - N);
    const dist = Math.abs(dot(n, r(p.t0)) - N) / Math.hypot(...n);
    return [r6(t), r6(dist), r6(speedAt(r, t))];
  },
  /* q12b: T(x, y) = k + p x² + q y². Level at the probe (a, b), then the positive y on x = 0 with T(0, y) = c. */
  q12b: p => {
    const T = (x, y) => p.k + p.p * x * x + p.q * y * y, c = T(p.a, p.b);
    const y = posRoot(u => T(0, u) - c);
    return [r6(c), r6(y)];
  },
  /* q12c: T(x, y) = K - p x² - q y² where K is the printed constant: the alarm level L plus p s² (s is the x where the
     alarm line meets the x-axis). Sensor at (a, b): reading, margin over L, then the positive x on y = 0 with T = L. */
  q12c: p => {
    const K = p.L + p.p * p.s * p.s, T = (x, y) => K - p.p * x * x - p.q * y * y, read = T(p.a, p.b);
    const x = posRoot(u => -(T(u, 0) - p.L));
    return [r6(read), r6(read - p.L), r6(x)];
  },
  /* q12d: h(x, y) = k - p x² - q y². Beacons A (x1, y1) and B (x2, y2) are points (x, y, h) in space. */
  q12d: p => {
    const h = (x, y) => p.k - p.p * x * x - p.q * y * y;
    const A = [p.x1, p.y1, h(p.x1, p.y1)], B = [p.x2, p.y2, h(p.x2, p.y2)];
    return [r6(A[2]), r6(B[2]), r6(Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]))];
  },
  /* q13b: kind 0 is f = A x² ÷ (x² + B y²); kind 1 is f = (x³ + A³ y³) ÷ (x + A y) (B unused). Limits along y = m1 x and
     y = m2 x by getting close to the origin on each line, then 1 or 0 for "same value along every direction". */
  q13b: p => {
    const f = p.kind === 0 ? (x, y) => p.A * x * x / (x * x + p.B * y * y) : (x, y) => (x ** 3 + p.A ** 3 * y ** 3) / (x + p.A * y);
    return [limAt0(x => f(x, p.m1 * x)), limAt0(x => f(x, p.m2 * x)), agrees(f) ? 1 : 0];
  },
  /* q13c: f = A x y ÷ (x² + B y²). Limits along y = m1 x and y = m2 x, then larger minus smaller. */
  q13c: p => {
    const f = (x, y) => p.A * x * y / (x * x + p.B * y * y);
    const l1 = limAt0(x => f(x, p.m1 * x)), l2 = limAt0(x => f(x, p.m2 * x));
    return [l1, l2, r6(Math.max(l1, l2) - Math.min(l1, l2))];
  },
  /* q13d: kind 0 is f = A x y ÷ (x² + B y²); kind 1 is f = (x² - A² y²) ÷ (x + A y) + B. Limits along the three lines,
     then 1 or 0 for "same value along every direction". */
  q13d: p => {
    const f = p.kind === 0 ? (x, y) => p.A * x * y / (x * x + p.B * y * y) : (x, y) => (x * x - p.A * p.A * y * y) / (x + p.A * y) + p.B;
    return [p.m1, p.m2, p.m3].map(m => limAt0(x => f(x, m * x))).concat(agrees(f) ? 1 : 0);
  },
  /* q14b: P = a x y² + b x² + c e^(2x - y) at (p, 2p): both first partial derivatives by central differences. */
  q14b: p => {
    const P = (x, y) => p.a * x * y * y + p.b * x * x + p.c * Math.exp(2 * x - y);
    return [r6(d1(P, p.p, 2 * p.p, 'x')), r6(d1(P, p.p, 2 * p.p, 'y'))];
  },
  /* q14c: h = a x² y + b y³ + c e^(x + y) at (p, -p): slopes east and north, then east slope × speed v. */
  q14c: p => {
    const h = (x, y) => p.a * x * x * y + p.b * y ** 3 + p.c * Math.exp(x + y);
    const hx = d1(h, p.p, -p.p, 'x');
    return [r6(hx), r6(d1(h, p.p, -p.p, 'y')), r6(hx * p.v)];
  },
  /* q14d: h = a x² y e^(x - y) at (p, p): height, then both first partial derivatives. */
  q14d: p => {
    const h = (x, y) => p.a * x * x * y * Math.exp(x - y);
    return [r6(h(p.p, p.p)), r6(d1(h, p.p, p.p, 'x')), r6(d1(h, p.p, p.p, 'y'))];
  },
  /* q15b: P = a x³ y + b x y³ + c x² y² at (x, y): P_xx, P_yy, P_xy. */
  q15b: p => {
    const P = (x, y) => p.a * x ** 3 * y + p.b * x * y ** 3 + p.c * x * x * y * y;
    return [r6(d2(P, p.x, p.y, 'x')), r6(d2(P, p.x, p.y, 'y')), r6(dxy(P, p.x, p.y))];
  },
  /* q15c: h = a x² y² + b x³ + c y³ at (x, y): h_x, h_xx, then h_xx × d metres of driving. */
  q15c: p => {
    const h = (x, y) => p.a * x * x * y * y + p.b * x ** 3 + p.c * y ** 3;
    const hxx = d2(h, p.x, p.y, 'x');
    return [r6(d1(h, p.x, p.y, 'x')), r6(hxx), r6(hxx * p.d)];
  },
  /* q15d: G = a x³ y² + b e^(2x - y) at (p, 2p): G_x, G_xx, G_yy, G_xy. */
  q15d: p => {
    const G = (x, y) => p.a * x ** 3 * y * y + p.b * Math.exp(2 * x - y);
    return [r6(d1(G, p.p, 2 * p.p, 'x')), r6(d2(G, p.p, 2 * p.p, 'x')), r6(d2(G, p.p, 2 * p.p, 'y')), r6(dxy(G, p.p, 2 * p.p))];
  },
});
})();
