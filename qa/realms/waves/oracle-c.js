/* Independent oracles for Waves: sound and light learn missions, file c: q21–q30 (game/realms/waves/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a search, a numerical method or a general solver.
   Do not import game files. Answers are rounded to the places each prompt states, from the unrounded working. */
(function(){ 'use strict';
const rnd = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-12) * f) / f; };
const V = 343; /* speed of sound in air, as every sound prompt states */
/* Bisection: x in [lo, hi] where the increasing function g(x) reaches target. */
const solveUp = (g, target, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
/* Angle in [0, π/2] whose sine is s, found by bisection on the rising sine. */
const arcsin = s => solveUp(Math.sin, s, 0, Math.PI / 2);
Object.assign(window.ORACLE, {
  /* Mach number vs/343; the cone half-angle is the angle in the right triangle with hypotenuse M and short side 1
     (sin θ = 1/M), found by bisection from the unrounded M. p.vs = source speed in m/s. */
  q21: p => { const M = p.vs / V; return [rnd(M, 2), rnd(arcsin(1 / M), 3)]; },
  /* p.f = tone (Hz), p.r1 = distance to A (m), p.r2 = distance to B (m), both printed.
     Loud when the path difference is a whole number of wavelengths, quiet when a whole number and a half. */
  q22: p => {
    const lam = V / p.f;
    const diff = Math.abs(p.r2 - p.r1);
    const nl = diff / lam;
    const loud = Math.abs(nl - Math.round(nl)) < 1e-6 ? 1 : 0;
    return [rnd(diff, 3), rnd(nl, 3), loud];
  },
  /* p.fa = pitch heard approaching, p.fr = pitch heard receding. Find the speed u whose two sirens agree: the own
     frequency from "approaching" (fa·(343−u)/343) equals that from "receding" (fr·(343+u)/343). Bisection on u. */
  q23: p => {
    const gap = u => p.fa * (V - u) / V - p.fr * (V + u) / V; /* falls as u rises */
    let lo = 0, hi = V;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (gap(m) > 0) lo = m; else hi = m; }
    const u = (lo + hi) / 2;
    const fs = p.fa * (V - u) / V;
    return [rnd(u, 1), rnd(fs, 1), rnd(Math.abs(p.fa - fs), 1)];
  },
  /* n = c/v so v = c/n (c = 3.00×10⁸); the frequency is fixed, so the wavelength shrinks by the same factor. */
  q24: p => { return [rnd(3 / p.nn, 3), rnd(p.lam / p.nn, 1)]; },
  /* Reflection: angle of reflection equals a, so with the surface it is π/2 − a. Refraction: n1 sin a = n2 sin b. */
  q25: p => [rnd(Math.PI / 2 - p.a, 3), rnd(arcsin(p.n1 * Math.sin(p.a) / p.n2), 3)],
  /* Critical angle: the incidence at which the refracted ray just grazes the surface (sin = n2/n1). Trapped when the
     ray's angle is bigger than that. */
  q26: p => { const c = arcsin(p.n2 / p.n1); return [rnd(c, 3), p.a > c ? 1 : 0]; },
  /* Unpolarised light loses half at the first filter, then Malus's law cos² of each turn. p.a, p.b = the two turns. */
  q27: p => {
    const c2 = t => { const c = Math.cos(t); return c * c; };
    const I1 = p.I0 / 2, I2 = I1 * c2(p.a), I3 = I2 * c2(p.b);
    return [rnd(I1, 2), rnd(I2, 2), rnd(I3, 2)];
  },
  /* Thin lens/mirror equation 1/f = 1/d + 1/di, solved for di; m = −di/d. (p.kind only picks the wording.) */
  q28: p => { const di = 1 / (1 / p.f - 1 / p.d); return [rnd(di, 1), rnd(-di / p.d, 2)]; },
  /* Lens equation as in q28; image height = m × object height; the ray is trapped when it is past the critical angle
     for glass-to-air, found by testing sin a against 1/n (p.nn = index). */
  q29: p => {
    const di = 1 / (1 / p.f - 1 / p.d), m = -di / p.d;
    const crit = arcsin(1 / p.nn);
    return [rnd(di, 1), rnd(m * p.h, 2), p.a > crit ? 1 : 0];
  },
  /* Slits d µm = d×1000 nm. Bright: d sin θ = mλ; dark: d sin θ = (m+½)λ. The highest bright order is the largest
     whole m with sin θ below 1, found by searching upwards. */
  q30: p => {
    const d = p.d * 1000;
    let top = 0; while ((top + 1) * p.lam < d) top++;
    return [rnd(arcsin(p.m * p.lam / d), 4), rnd(arcsin((p.m + 0.5) * p.lam / d), 4), top];
  }
});
})();
