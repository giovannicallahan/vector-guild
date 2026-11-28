/* Independent oracles for Calculus 3: many variables practice missions, file 8 of 8: q36b–q40d (game/realms/calc3/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const PI = Math.PI;
/* Composite Simpson's rule in one variable, and over a rectangle. No antiderivatives are used anywhere below. */
const simpson = (f, a, b, n = 200) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
const simpson2 = (f, a, b, c, d, n = 40) => simpson(x => simpson(y => f(x, y), c, d, n), a, b, n);
/* Trapezoid rule over one full period (a whole turn): exact for the low trig powers used here. */
const turn = (f, n = 96) => { let s = 0; for (let i = 0; i < n; i++) s += f(2 * PI * i / n); return s * 2 * PI / n; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = a => Math.sqrt(dot(a, a));
/* Partial derivative of a vector-valued function of two parameters, by a central difference. */
const d1 = (r, s, t) => { const h = 1e-5, a = r(s + h, t), b = r(s - h, t); return a.map((v, i) => (v - b[i]) / (2 * h)); };
const d2 = (r, s, t) => { const h = 1e-5, a = r(s, t + h), b = r(s, t - h); return a.map((v, i) => (v - b[i]) / (2 * h)); };
/* Partial derivatives of a vector field F at a point: J[i][j] = ∂F_i/∂x_j. */
const jac = (F, x, y, z) => { const h = 1e-4, P = [x, y, z], J = [[], [], []];
  for (let j = 0; j < 3; j++) { const u = P.slice(), w = P.slice(); u[j] += h; w[j] -= h; const a = F(...u), b = F(...w); for (let i = 0; i < 3; i++) J[i][j] = (a[i] - b[i]) / (2 * h); }
  return J; };
const div = (F, x, y, z) => { const J = jac(F, x, y, z); return J[0][0] + J[1][1] + J[2][2]; };
const curl = (F, x, y, z) => { const J = jac(F, x, y, z); return [J[2][1] - J[1][2], J[0][2] - J[2][0], J[1][0] - J[0][1]]; };
/* Outward flux of G through the upper half of the sphere of radius R about the origin (the open shell, no floor):
   a surface integral over the polar angle φ in [0, π/2] and the turn θ, with n = position ÷ R and dS = R² sin φ dφ dθ. */
const shellFlux = (G, R) => simpson(ph => turn(th => {
  const x = R * Math.sin(ph) * Math.cos(th), y = R * Math.sin(ph) * Math.sin(th), z = R * Math.cos(ph);
  return dot(G(x, y, z), [x / R, y / R, z / R]) * R * R * Math.sin(ph);
}), 0, PI / 2, 120);
/* Flux of F out of the box [0,L]×[0,W]×[0,H], added up face by face (six surface integrals). */
const boxFaces = (F, L, W, H) => {
  const f = { xHi: simpson2((y, z) => F(L, y, z)[0], 0, W, 0, H), xLo: -simpson2((y, z) => F(0, y, z)[0], 0, W, 0, H),
    yHi: simpson2((x, z) => F(x, W, z)[1], 0, L, 0, H), yLo: -simpson2((x, z) => F(x, 0, z)[1], 0, L, 0, H),
    zHi: simpson2((x, y) => F(x, y, H)[2], 0, L, 0, W), zLo: -simpson2((x, y) => F(x, y, 0)[2], 0, L, 0, W) };
  f.total = f.xHi + f.xLo + f.yHi + f.yLo + f.zHi + f.zLo; return f;
};
Object.assign(window.ORACLE, {
  /* q36b: r = ⟨u, v, A sa u + B sb v + c0⟩; the index i only picks (A, B) from the list (2,2), (4,8), (8,4)
     (the three coefficient pairs with A² + B² + 1 a perfect square). */
  q36b: p => {
    const [A, B] = [[2, 2], [4, 8], [8, 4]][p.i];
    const r = (u, v) => [u, v, p.sa * A * u + p.sb * B * v + p.c0];
    const stretch = (u, v) => len(cross(d1(r, u, v), d2(r, u, v)));
    return [r6(stretch(0.3 * p.L, 0.6 * p.W)), r6(simpson2(stretch, 0, p.L, 0, p.W, 8))];
  },
  /* q36c: the index ti picks the sweep of θ from the list π/2, π, 3π/2, 2π; k and K are the area and the cost divided by π. */
  q36c: p => {
    const th = [PI / 2, PI, 3 * PI / 2, 2 * PI][p.ti];
    const r = (t, z) => [p.R * Math.cos(t), p.R * Math.sin(t), z];
    const stretch = (t, z) => len(cross(d1(r, t, z), d2(r, t, z)));
    const area = simpson2(stretch, 0, th, 0, p.H, 24);
    return [r6(stretch(0.4, 0.5)), r6(area / PI), r6(p.price * area / PI)];
  },
  /* q36d: the cone r = ⟨p u cos θ, p u sin θ, h u⟩ with p² + h² = 25 (p = 3 gives h = 4, p = 4 gives h = 3); θ sweeps t·π. */
  q36d: p => {
    const h = Math.sqrt(25 - p.p * p.p);
    const r = (u, t) => [p.p * u * Math.cos(t), p.p * u * Math.sin(t), h * u];
    const stretch = (u, t) => len(cross(d1(r, u, t), d2(r, u, t)));
    return [r6(stretch(2, 0.8)), r6(simpson2(stretch, 0, p.L, 0, p.t * PI, 24) / PI)];
  },
  /* q37b: z = p x + q y + r on 0 ≤ x ≤ A, 0 ≤ y ≤ B; F = ⟨a, b, −e z⟩; N = r_y × r_x, as the prompt says. */
  q37b: p => {
    const r = (x, y) => [x, y, p.p * x + p.q * y + p.r];
    const N = (x, y) => cross(d2(r, x, y), d1(r, x, y));
    const F = pt => [p.a, p.b, -p.e * pt[2]];
    const n = N(0.5, 0.5);
    return [r6(n[0]), r6(n[1]), r6(n[2]), r6(simpson2((x, y) => dot(F(r(x, y)), N(x, y)), 0, p.A, 0, p.B, 8))];
  },
  /* q37c: x = p y + q z + r on 0 ≤ y ≤ A, 0 ≤ z ≤ B; F = ⟨e x, b, c⟩; N = r_y × r_z; one minute is 60 seconds. */
  q37c: p => {
    const r = (y, z) => [p.p * y + p.q * z + p.r, y, z];
    const N = (y, z) => cross(d1(r, y, z), d2(r, y, z));
    const F = pt => [p.e * pt[0], p.b, p.c];
    const n = N(0.5, 0.5), flux = simpson2((y, z) => dot(F(r(y, z)), N(y, z)), 0, p.A, 0, p.B, 8);
    return [r6(n[0]), r6(n[1]), r6(n[2]), r6(flux), r6(flux * 60)];
  },
  /* q37d: wall of radius R and height H; F = ⟨a x, b y, c⟩; N = r_θ × r_z; k = flux ÷ π. */
  q37d: p => {
    const r = (t, z) => [p.R * Math.cos(t), p.R * Math.sin(t), z];
    const FN = (t, z) => { const pt = r(t, z); return dot([p.a * pt[0], p.b * pt[1], p.c], cross(d1(r, t, z), d2(r, t, z))); };
    return [r6(FN(0, 0.5)), r6(FN(PI / 2, 0.5)), r6(simpson(z => turn(t => FN(t, z)), 0, p.H, 8) / PI)];
  },
  /* q38b: F = ⟨a y + b z, −c x + d z², e x y⟩ round the circle of radius R at z = h, clockwise from above
     (x, y) = (R cos t, −R sin t); worked as a line integral of F · dr, k = circulation ÷ π. */
  q38b: p => {
    const F = (x, y, z) => [p.a * y + p.b * z, -p.c * x + p.d * z * z, p.e * x * y];
    const line = turn(t => dot(F(p.R * Math.cos(t), -p.R * Math.sin(t), p.h), [-p.R * Math.sin(t), -p.R * Math.cos(t), 0]));
    return [r6(curl(F, 0.3, 0.2, p.h)[2]), r6(line / PI)];
  },
  /* q38c: F = ⟨a y + b x², c x + d y z, e z⟩ round x² + y² = R² on z = 0. The direction is not a parameter: the prompt says
     anticlockwise or clockwise, and the generator words it so that the work is positive, i.e. clockwise when c < a. */
  q38c: p => {
    const F = (x, y, z) => [p.a * y + p.b * x * x, p.c * x + p.d * y * z, p.e * z];
    const s = p.c >= p.a ? 1 : -1;
    const one = turn(t => dot(F(p.R * Math.cos(t), s * p.R * Math.sin(t), 0), [-p.R * Math.sin(t), s * p.R * Math.cos(t), 0]));
    return [r6(curl(F, 0.3, 0.2, 0)[2]), r6(one / PI), r6(p.m * one / PI)];
  },
  /* q38d: F = ⟨a z + b y², e x z, −c x + d y z⟩ round x² + z² = R² in y = 0, right-hand rule about s·(+y):
     going (x, z) = (R sin(s t), R cos(s t)) is anticlockwise about +y for s = 1 (z × x = y). Line integral of P dx + R dz. */
  q38d: p => {
    const F = (x, y, z) => [p.a * z + p.b * y * y, p.e * x * z, -p.c * x + p.d * y * z], s = p.s;
    const line = turn(t => { const x = p.R * Math.sin(s * t), z = p.R * Math.cos(s * t);
      return dot(F(x, 0, z), [p.R * s * Math.cos(s * t), 0, -p.R * s * Math.sin(s * t)]); });
    return [r6(curl(F, 0.3, 0.2, 0.1)[1]), r6(line / PI)];
  },
  /* q39b: F = ⟨a x² + z, b y + x, c z + y⟩ on the box L × W × H: div at the far corner, and the six faces added up. */
  q39b: p => {
    const F = (x, y, z) => [p.a * x * x + z, p.b * y + x, p.c * z + y];
    return [r6(div(F, p.L, p.W, p.H)), r6(boxFaces(F, p.L, p.W, p.H).total)];
  },
  /* q39c: F = ⟨a x + e y, b y + f z, c z⟩ on the box L × W × H: div, the six faces added up, and the roof face alone. */
  q39c: p => {
    const F = (x, y, z) => [p.a * x + p.e * y, p.b * y + p.f * z, p.c * z];
    const f = boxFaces(F, p.L, p.W, p.H);
    return [r6(div(F, 0.5, 0.5, 0.5)), r6(f.total), r6(f.zHi)];
  },
  /* q39d: F = ⟨a x, b y, c + e z⟩ on the cylinder of radius R from z = 0 to H, outward normals, each flux ÷ π:
     top and floor discs by polar integration of F · (0, 0, ±1), the wall as the integral of F · (cos t, sin t, 0) R dt dz. */
  q39d: p => {
    const Fz = z => p.c + p.e * z, disc = c => simpson(rho => rho * turn(() => c), 0, p.R, 20);
    const top = disc(Fz(p.H)), floor = disc(-Fz(0));
    const wall = simpson(() => turn(t => (p.a * p.R * Math.cos(t) * Math.cos(t) + p.b * p.R * Math.sin(t) * Math.sin(t)) * p.R), 0, p.H, 2);
    return [r6((top + floor + wall) / PI), r6(top / PI), r6(floor / PI), r6(wall / PI)];
  },
  /* q40b: F = ⟨a x + g y, (g + w) x + b y, c z⟩ (read off the prompt), T = p x y + q z²; the index i picks u from the list
     ⟨1,2,2⟩ ⟨2,1,2⟩ ⟨2,2,1⟩ ⟨2,−1,2⟩ ⟨−1,2,2⟩ ⟨2,2,−1⟩ (each ÷ 3). The shell is half a sphere; its flux is worked as a surface integral. */
  q40b: p => {
    const F = (x, y, z) => [p.a * x + p.g * y, (p.g + p.w) * x + p.b * y, p.c * z];
    const u = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, -1, 2], [-1, 2, 2], [2, 2, -1]][p.i].map(v => v / 3);
    const T = (x, y, z) => p.p * x * y + p.q * z * z, h = 1e-5;
    const grad = [(T(p.x0 + h, p.y0, p.z0) - T(p.x0 - h, p.y0, p.z0)) / (2 * h), (T(p.x0, p.y0 + h, p.z0) - T(p.x0, p.y0 - h, p.z0)) / (2 * h), (T(p.x0, p.y0, p.z0 + h) - T(p.x0, p.y0, p.z0 - h)) / (2 * h)];
    return [r6(shellFlux(F, p.R) / PI), r6(shellFlux((x, y, z) => curl(F, x, y, z), p.R) / PI), r6(dot(grad, u))];
  },
  /* q40c: F = ⟨a x, b y, c z + g⟩; the floor disc has outward normal ⟨0, 0, −1⟩ and F_z = g there (area π R²). */
  q40c: p => {
    const F = (x, y, z) => [p.a * x, p.b * y, p.c * z + p.g];
    const shell = shellFlux(F, p.R), floor = -p.g * PI * p.R * p.R;
    return [r6(div(F, 0.4, 0.3, 0.2)), r6((shell + floor) / PI), r6(shell / PI)];
  },
  /* q40d: T = sa·cx·x + cy·y² + sc·cz·z, where the index t picks (cx, cy, cz) from the table below, at the point (x0, 1, z0);
     F = ⟨f x − e y + m z, e x + b2 y + n2 z², c2 z + g⟩. */
  q40d: p => {
    const [cx, cy, cz] = [[1, 1, 2], [2, 3, 3], [6, 1, 3], [3, 1, 6], [4, 2, 7], [4, 4, 1], [8, 2, 1], [1, 2, 8], [6, 3, 7]][p.t];
    const T = (x, y, z) => p.sa * cx * x + cy * y * y + p.sc * cz * z, h = 1e-5, y0 = 1;
    const g = [(T(p.x0 + h, y0, p.z0) - T(p.x0 - h, y0, p.z0)) / (2 * h), (T(p.x0, y0 + h, p.z0) - T(p.x0, y0 - h, p.z0)) / (2 * h), (T(p.x0, y0, p.z0 + h) - T(p.x0, y0, p.z0 - h)) / (2 * h)];
    const F = (x, y, z) => [p.f * x - p.e * y + p.m * z, p.e * x + p.b2 * y + p.n2 * z * z, p.c2 * z + p.g];
    return [r6(len(g)), r6(shellFlux((x, y, z) => curl(F, x, y, z), p.R) / PI), r6(shellFlux(F, p.R) / PI)];
  },
});
})();
