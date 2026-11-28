/* Independent oracles for Mechanics: motion and force learn missions, file c: q21–q30 (game/realms/mech/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
const G = 9.8;
/* sin and cos from their Taylor series (no Math.sin / Math.cos); angles here are below 1.6 radians. */
const sc = th => { let c = 0, s = 0, tc = 1, ts = th; for (let k = 0; k < 40; k++) { c += tc; s += ts; tc *= -th * th / ((2 * k + 1) * (2 * k + 2)); ts *= -th * th / ((2 * k + 2) * (2 * k + 3)); } return { s, c }; };
/* Square root by bisection. */
const root = x => { let lo = 0, hi = Math.max(1, x); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (m * m < x) lo = m; else hi = m; } return (lo + hi) / 2; };
/* Composite Simpson's rule (exact for cubics) of f on [a, b]. */
const simpson = (f, a, b) => { const n = 2000, h = (b - a) / n; let t = f(a) + f(b); for (let i = 1; i < n; i++) t += f(a + i * h) * (i % 2 ? 4 : 2); return t * h / 3; };
Object.assign(window.ORACLE, {
  /* Weight resolved on the ramp: the along-ramp part is w sin th, the normal force equals the into-ramp part w cos th. */
  q21: p => { const w = p.m * G, t = sc(p.th); return [rd(w * t.s, 2), rd(w * t.c, 2)]; },
  /* The crate is at rest: it stays put if the pull along the ramp does not exceed the greatest static friction; then
     friction = the pull and a = 0. Otherwise it slides: friction = uk N, a = (pull - friction) / m. */
  q22: p => {
    const t = sc(p.th), N = p.m * G * t.c, pull = p.m * G * t.s;
    if (pull <= p.us * N) return [rd(pull, 2), 0];
    const f = p.uk * N;
    return [rd(f, 2), rd((pull - f) / p.m, 2)];
  },
  /* Two bodies, one acceleration. Solve the two equations (crate: T - pull - fr = m1 a; weight: m2 g - T = m2 a) by
     eliminating T with Cramer's rule on the pair of unknowns (a, T). */
  q23: p => {
    const t = sc(p.th), pull = p.m1 * G * t.s, fr = p.uk * p.m1 * G * t.c, w2 = p.m2 * G;
    /*  m1 a - T = -(pull + fr)     m2 a + T = w2   */
    const det = p.m1 * 1 - (-1) * p.m2;
    const a = ((-(pull + fr)) * 1 - (-1) * w2) / det;
    const T = (p.m1 * w2 - p.m2 * (-(pull + fr))) / det;
    return [rd(a, 2), rd(T, 2)];
  },
  /* Needed force m v^2 / r; greatest speed from mu g r = v^2 (root by bisection). */
  q24: p => [rd(p.m * p.v * p.v / p.r, 2), rd(root(p.us * G * p.r), 2)],
  /* Drag b v^2; a = g - D/m; terminal speed where the drag equals the weight (bisection on b v^2 - m g). */
  q25: p => {
    const D = p.b * p.v * p.v, a = G - D / p.m;
    let lo = 0, hi = 1000; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (p.b * m * m < p.m * G) lo = m; else hi = m; }
    return [rd(D, 2), rd(a, 2), rd((lo + hi) / 2, 2)];
  },
  /* Winch: F d cos th. Ram: integral of c x^2 + k x from x1 to x2 by Simpson's rule. */
  q26: p => [rd(p.F * p.d * sc(p.th).c, 2), clean(simpson(x => p.c * x * x + p.k * x, p.x1, p.x2))],
  /* KE before 1/2 m v0^2; after = before + W; speed from the energy after. */
  q27: p => { const k0 = 0.5 * p.m * p.v0 * p.v0, k1 = k0 + p.W; return [clean(k0), clean(k1), rd(root(2 * k1 / p.m), 2)]; },
  /* Work = m g h; power = work / t; time at P2 kW = work / (1000 P2). */
  q28: p => { const W = p.m * G * p.h; return [clean(W), rd(W / p.t, 2), rd(W / (p.P2 * 1000), 2)]; },
  /* The pull F is printed (one decimal) but is not a parameter: it is the force that takes the sled from rest to vf
     over d against kinetic friction, F = uk m g + m vf^2 / (2 d), rounded to the printed 1 decimal. Then winch work F d,
     friction work -uk m g d, speed from the net work by the work-energy rule, power F v. */
  q29: p => {
    const F = rd(p.uk * p.m * G + p.m * p.vf * p.vf / (2 * p.d), 1), fr = p.uk * p.m * G;
    const v = root(2 * (F - fr) * p.d / p.m);
    return [clean(F * p.d), -clean(fr * p.d), rd(v, 2), rd(F * v, 2)];
  },
  /* h1 = shelf height, h2 = platform height. PE = m g h1; spring 1/2 k x^2; gravity's work lowering = m g (h1 - h2). */
  q30: p => [clean(p.m * G * p.h1), clean(0.5 * p.k * p.x * p.x), clean(p.m * G * (p.h1 - p.h2))],
});
})();
