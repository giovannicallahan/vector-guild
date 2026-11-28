/* Independent oracles for Calculus 3: many variables learn missions, file d: q31–q40 (game/realms/calc3/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r = (x, n) => { const f = Math.pow(10, n); return Math.round(x * f) / f; };
const clean = x => r(x, 6) + 0; // adds 0 so that −0 prints as 0
/* Five-point numerical derivative of a one-variable function at x. */
const D = (f, x) => { const h = 1e-3; return (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h); };
/* Composite Simpson rule for g on [a, b] with n (even) steps. */
const simpson = (g, a, b, n = 400) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
const simpson2 = (g, a, b, c, d, n = 60) => simpson(u => simpson(v => g(u, v), c, d, n), a, b, n);
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
/* Numerical partial derivative of a vector-valued map S(args) with respect to argument number i. */
const partial = (S, args, i) => { const at = e => S(...args.map((a, k) => k === i ? a + e : a)); const h = 1e-3;
  const f = [-2, -1, 1, 2].map(m => at(m * h)); return f[0].map((_, c) => (-f[3][c] + 8 * f[2][c] - 8 * f[1][c] + f[0][c]) / (12 * h)); };
/* Divergence and curl of a field F(x, y, z) = [Fx, Fy, Fz] at a point, from numerical partials. */
const jac = (F, P) => [0, 1, 2].map(i => partial(F, P, i)); // jac[i][c] = ∂F_c/∂x_i
const divF = (F, P) => { const J = jac(F, P); return J[0][0] + J[1][1] + J[2][2]; };
const curlF = (F, P) => { const J = jac(F, P); return [J[1][2] - J[2][1], J[2][0] - J[0][2], J[0][1] - J[1][0]]; };
/* Line integral of F · dr along a path r(t) from t0 to t1. */
const work = (F, path, t0, t1) => simpson(t => dot(F(...path(t)), partial(path, [t], 0)), t0, t1);
Object.assign(window.ORACLE, {
  /* F = ⟨a y, x + b z, c x y⟩; ρ = m + k z. d is only an index into the list of whole-number cable directions
     (end − start), read off the prompts for d = 0…9. Mass = ∫ ρ ds along the segment by Simpson's rule. */
  q31: p => {
    const dirs = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, 3, 6], [3, 2, 6], [6, 2, 3], [4, 4, 7], [1, 4, 8], [4, 1, 8], [8, 4, 1]];
    const s = [p.x0, p.y0, p.z0], v = dirs[p.d];
    const F = (x, y, z) => [p.a * y, x + p.b * z, p.c * x * y];
    const seg = t => s.map((c, i) => c + t * v[i]);
    const speed = Math.hypot(...v);
    const mass = simpson(t => (p.m + p.k * seg(t)[2]) * speed, 0, 1);
    return [...F(...s).map(clean), clean(mass)];
  },
  /* F = ⟨p y + s, q x⟩ along r(t) = ⟨t, c t²⟩ (curved) or ⟨t, c t⟩ (straight), t from 0 to T. Work = ∫ F · r′ dt. */
  q32: p => {
    const F = (x, y) => [p.p * y + p.s, p.q * x, 0];
    const path = t => [t, p.curved ? p.c * t * t : p.c * t, 0];
    return [clean(work(F, path, 0, p.T))];
  },
  /* The conservative field is ⟨2a x + b y, b x + 2c y⟩; the other is ⟨2f x + g y, d x + 2h y⟩ (g ≠ d). Each field is
     tested by comparing ∂Fx/∂y with ∂Fy/∂x at several points. The conservative one's work is found along the straight
     line between the end points, which gives the same answer on any path. consFirst says whether F is the conservative one. */
  q33: p => {
    const cons = (x, y) => [2 * p.a * x + p.b * y, p.b * x + 2 * p.c * y, 0];
    const non = (x, y) => [2 * p.f * x + p.g * y, p.d * x + 2 * p.h * y, 0];
    const isCons = Fn => [[0, 0], [1, 2], [-3, 1], [2, -2]].every(([x, y]) => Math.abs(D(s => Fn(x, s)[0], y) - D(s => Fn(s, y)[1], x)) < 1e-6);
    const F = p.consFirst ? cons : non, G = p.consFirst ? non : cons;
    const keep = isCons(F) ? F : G;
    const line = t => [p.x1 + t * (p.x2 - p.x1), p.y1 + t * (p.y2 - p.y1), 0];
    return [isCons(F) ? 1 : 0, isCons(G) ? 1 : 0, clean(work(keep, line, 0, 1))];
  },
  /* F = ⟨p x y − a y, r x² + c x⟩. Walk the four sides of the rectangle anticlockwise and add the line integrals
     (no Green's theorem). */
  q34: p => {
    const F = (x, y) => [p.p * x * y - p.a * y, p.r * x * x + p.c * x, 0];
    const { x0, y0, x1, y1 } = p;
    const side = (A, B) => work(F, t => [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1]), 0], 0, 1);
    const P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    return [clean(P.reduce((s, A, i) => s + side(A, P[(i + 1) % 4]), 0))];
  },
  /* F = ⟨a x y + b z, c y² + d x z, e x z + f y⟩ at (x0, y0, z0): divergence and curl from numerical partials. */
  q35: p => {
    const F = (x, y, z) => [p.a * x * y + p.b * z, p.c * y * y + p.d * x * z, p.e * x * z + p.f * y];
    const P = [p.x0, p.y0, p.z0];
    return [clean(divF(F, P)), ...curlF(F, P).map(clean)];
  },
  /* r(θ, z) = ⟨R cos θ, R sin θ, z⟩, z from 0 to H. j is only an index: the angle runs from 0 to j·π/2 (j = 1…4).
     First answer: |r_θ × r_z| from numerical partials. Second: area = ∬ |r_θ × r_z| dθ dz, divided by π. */
  q36: p => {
    const S = (th, z) => [p.R * Math.cos(th), p.R * Math.sin(th), z];
    const speed = (th, z) => Math.hypot(...cross(partial(S, [th, z], 0), partial(S, [th, z], 1)));
    const area = simpson2(speed, 0, p.j * Math.PI / 2, 0, p.H);
    return [clean(speed(0.7, 1)), clean(area / Math.PI)];
  },
  /* Surface z = p x + q y + h over [0, A] × [0, B], F = ⟨a, b, c z⟩. Upward: N = r_x × r_y; otherwise N = r_y × r_x.
     Flux = ∬ F(r) · N dx dy by a two-dimensional Simpson rule. */
  q37: p => {
    const S = (x, y) => [x, y, p.p * x + p.q * y + p.h];
    const N = (x, y) => { const a = partial(S, [x, y], 0), b = partial(S, [x, y], 1); return p.up ? cross(a, b) : cross(b, a); };
    const flux = simpson2((x, y) => dot([p.a, p.b, p.c * S(x, y)[2]], N(x, y)), 0, p.A, 0, p.B);
    return [...N(0, 0).map(clean), clean(flux)];
  },
  /* F = ⟨−a y + b z, c x + d z², e x y⟩. The rim is z = 0, x² + y² = R². Walk it round with x = R cos φ, y = R sin φ
     (anticlockwise: φ increasing; clockwise: φ decreasing) and add F · dr; the answer is divided by π. */
  q38: p => {
    const F = (x, y, z) => [-p.a * y + p.b * z, p.c * x + p.d * z * z, p.e * x * y];
    const sign = p.anti ? 1 : -1;
    const rim = t => [p.R * Math.cos(sign * t), p.R * Math.sin(sign * t), 0];
    const circ = work(F, rim, 0, 2 * Math.PI);
    return [clean(curlF(F, [0.3, -0.2, 0.9])[2]), clean(circ / Math.PI)];
  },
  /* F = ⟨a x + y², b y + x z, c z²⟩ on the box [0, L] × [0, W] × [0, H]. div F is taken at the top corner by numerical
     partials. The flux is the sum of F · n over the six faces (outward normals), each by a two-dimensional Simpson rule. */
  q39: p => {
    const F = (x, y, z) => [p.a * x + y * y, p.b * y + x * z, p.c * z * z];
    const { L, W, H } = p;
    const f1 = simpson2((y, z) => F(L, y, z)[0], 0, W, 0, H), f2 = simpson2((y, z) => -F(0, y, z)[0], 0, W, 0, H);
    const f3 = simpson2((x, z) => F(x, W, z)[1], 0, L, 0, H), f4 = simpson2((x, z) => -F(x, 0, z)[1], 0, L, 0, H);
    const f5 = simpson2((x, y) => F(x, y, H)[2], 0, L, 0, W), f6 = simpson2((x, y) => -F(x, y, 0)[2], 0, L, 0, W);
    return [clean(divF(F, [L, W, H])), clean(f1 + f2 + f3 + f4 + f5 + f6)];
  },
  /* T = p x² + q y + s z; u is only an index into the list of unit directions (read off the prompts for u = 0…5).
     F = ⟨a x − e y, e x + b y, c z⟩; the dome is the half-ball shell of radius R, z ≥ 0. The shell is walked with
     r(θ, φ) = R⟨sin θ cos φ, sin θ sin φ, cos θ⟩, θ from 0 to π/2, and the outward normal r_θ × r_φ. Both fluxes are
     surface integrals over the shell (curl F and F itself), divided by π. */
  q40: p => {
    const us = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, -1, 2], [-1, 2, 2], [2, 2, -1]].map(v => v.map(c => c / 3));
    const T = (x, y, z) => [p.p * x * x + p.q * y + p.s * z];
    const grad = [0, 1, 2].map(i => partial(T, [p.x0, p.y0, p.z0], i)[0]);
    const F = (x, y, z) => [p.a * x - p.e * y, p.e * x + p.b * y, p.c * z];
    const S = (th, ph) => [p.R * Math.sin(th) * Math.cos(ph), p.R * Math.sin(th) * Math.sin(ph), p.R * Math.cos(th)];
    const N = (th, ph) => cross(partial(S, [th, ph], 0), partial(S, [th, ph], 1));
    const flux = G => simpson2((th, ph) => dot(G(...S(th, ph)), N(th, ph)), 0, Math.PI / 2, 0, 2 * Math.PI, 40);
    return [clean(dot(grad, us[p.u])), clean(flux((x, y, z) => curlF(F, [x, y, z])) / Math.PI), clean(flux(F) / Math.PI)];
  },
});
})();
