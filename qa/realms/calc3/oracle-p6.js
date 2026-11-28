/* Independent oracles for Calculus 3: many variables practice missions, file 6 of 8: q26b–q30d (game/realms/calc3/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Composite Simpson rule on [a, b] with n (even) strips: exact for cubics, and accurate to ~1e-12 for the smooth integrands here. */
const simpson = (f, a, b, n = 200) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Nested Simpson for a two-variable and a three-variable integrand (small n: the integrands are low-degree polynomials). */
const simpson2 = (f, a1, b1, a2, b2, n = 8) => simpson(x => simpson(y => f(x, y), a2, b2, n), a1, b1, n);
const simpson3 = (f, a1, b1, a2, b2, a3, b3, n = 6) => simpson(x => simpson2((y, z) => f(x, y, z), a2, b2, a3, b3, n), a1, b1, n);
/* The angle ranges and the sphere's φ ranges, as [from, to] in units of π. The parameter `ang` / `phi` is only an index into these lists
   (read off the prompt wording: 0 to π/2, 0 to π, π/2 to π, 0 to 2π, π/4 to 3π/4, π to 2π, 0 to 3π/2; and 0 to π/3, 0 to π/2, 0 to π). */
const ANGLES = [[0, 1 / 2], [0, 1], [1 / 2, 1], [0, 2], [1 / 4, 3 / 4], [1, 2], [0, 3 / 2]];
const PHIS = [[0, 1 / 3], [0, 1 / 2], [0, 1]];
/* Width of an angle range (in units of π), measured by integrating dθ numerically. */
const widthPi = ([lo, hi]) => simpson(() => 1, lo, hi, 4);
Object.assign(window.ORACLE, {
  /* q26b: wedge of radius rad, density c r² (in polar form), mass = ∫∫ c r² · r dr dθ; k is mass ÷ π, θ in units of π. */
  q26b: p => {
    const inner = simpson(r => p.c * r * r * r, 0, p.rad), w = widthPi(ANGLES[p.ang]);
    return [r6(inner), r6(w), r6(inner * w)];
  },
  /* q26c: tile disc of radius a at weight c per m², gravel ring a to b at weight r²; each mass ÷ π over a full turn (2π). */
  q26c: p => {
    const tile = simpson(r => p.c * r, 0, p.a) * 2, gravel = simpson(r => r * r * r, p.a, p.b) * 2;
    return [r6(tile), r6(gravel), r6(tile + gravel)];
  },
  /* q26d: patch r1 to r2, density c (x² + y²)² = c r⁴, angle range from the table. Area k = ∫ r dr × width; mass k = ∫ c r⁵ dr × width. */
  q26d: p => {
    const w = widthPi(ANGLES[p.ang]);
    const area = simpson(r => r, p.r1, p.r2) * w, inner = simpson(r => p.c * r * r * r * r * r, p.r1, p.r2);
    return [r6(area), r6(inner), r6(inner * w)];
  },
  /* q27b: wedge x 0..a, y 0..b, z 0..s y; density c + x. Volume and mass by nested Simpson over the box of (x, y, z). */
  q27b: p => {
    const vol = simpson2((x, y) => p.s * y, 0, p.a, 0, p.b);
    const mass = simpson2((x, y) => (p.c + x) * p.s * y, 0, p.a, 0, p.b);
    return [r6(vol), r6(mass)];
  },
  /* q27c: box a × b × h, density c + d z. Average density = mass ÷ volume. */
  q27c: p => {
    const vol = simpson3(() => 1, 0, p.a, 0, p.b, 0, p.h, 2), mass = simpson3((x, y, z) => p.c + p.d * z, 0, p.a, 0, p.b, 0, p.h, 2);
    return [r6(vol), r6(mass), r6(mass / vol)];
  },
  /* q27d: footprint 0 ≤ y ≤ x ≤ a, height h, density c + y. Integrate the height out, then y from 0 to x, then x from 0 to a. */
  q27d: p => {
    const col = f => simpson(x => simpson(y => f(x, y), 0, x, 6), 0, p.a, 6);
    return [r6(col((x, y) => p.h)), r6(col((x, y) => p.h * (p.c + y)))];
  },
  /* q28b: ρ from r1 to r2, φ range from the table (units of π), θ full turn. Volume = (∫ρ² dρ)(∫ sin φ dφ)(2π); k = volume ÷ π. */
  q28b: p => {
    const radial = simpson(s => s * s, p.r1, p.r2), [lo, hi] = PHIS[p.phi];
    const sine = simpson(f => Math.sin(f), lo * Math.PI, hi * Math.PI, 400);
    return [r6(radial), r6(sine), r6(radial * sine * 2)];
  },
  /* q28c: cylinder of radius rad and height h; dome = half a ball of radius rad (volume of ball from spherical coordinates, halved). */
  q28c: p => {
    const cyl = simpson(r => r, 0, p.rad) * p.h * 2;
    const dome = simpson(s => s * s, 0, p.rad) * simpson(f => Math.sin(f), 0, Math.PI / 2, 400) * 2;
    return [r6(cyl), r6(dome), r6(cyl + dome)];
  },
  /* q28d: drum r1 to r2, height h, density c r². Radial integral of δ r; mass = radial × 2π × h, so k = 2 h × radial. */
  q28d: p => {
    const radial = simpson(r => p.c * r * r * r, p.r1, p.r2);
    return [r6(radial), r6(2 * p.h * radial)];
  },
  /* q29b: upper half of a shell a to b (φ 0 to π/2, θ full turn), density ρ ÷ c. k = volume ÷ π and mass ÷ π. */
  q29b: p => {
    const sine = simpson(f => Math.sin(f), 0, Math.PI / 2, 400);
    const vol = simpson(s => s * s, p.a, p.b) * sine * 2, mass = simpson(s => s * s * s / p.c, p.a, p.b) * sine * 2;
    return [r6(vol), r6(mass)];
  },
  /* q29c: two upper-half shells (a to b at c1, b to d at c2), mass = density × volume; k = mass ÷ π. */
  q29c: p => {
    const sine = simpson(f => Math.sin(f), 0, Math.PI / 2, 400);
    const inner = p.c1 * simpson(s => s * s, p.a, p.b) * sine * 2, outer = p.c2 * simpson(s => s * s, p.b, p.d) * sine * 2;
    return [r6(inner), r6(outer), r6(inner + outer)];
  },
  /* q29d: shell a to b, φ 0 to π/2, θ 0 to π, density c z = c ρ cos φ. Volume k = (∫ρ² dρ)(1)(π) ÷ π; the φ integral of sin φ cos φ is found numerically. */
  q29d: p => {
    const vol = simpson(s => s * s, p.a, p.b) * simpson(f => Math.sin(f), 0, Math.PI / 2, 400);
    const radial = simpson(s => p.c * s * s * s, p.a, p.b), sc = simpson(f => Math.sin(f) * Math.cos(f), 0, Math.PI / 2, 400);
    return [r6(vol), r6(radial), r6(radial * sc)];
  },
  /* q30b: u = a x + b y, v = c x + d y, rectangle u1..u2 by v1..v2. Solve for (x, y) at each (u, v) and integrate f = v with |J|. */
  q30b: p => {
    const det = p.a * p.d - p.b * p.c, J = 1 / det;
    const xy = (u, v) => [(p.d * u - p.b * v) * J, (-p.c * u + p.a * v) * J];
    const f = (u, v) => { const [x, y] = xy(u, v); return p.c * x + p.d * y; };
    const area = Math.abs(J) * simpson2(() => 1, p.u1, p.u2, p.v1, p.v2, 2);
    const power = Math.abs(J) * simpson2(f, p.u1, p.u2, p.v1, p.v2, 4);
    return [r6(J), r6(area), r6(power)];
  },
  /* q30c: ∂(u, v)/∂(x, y) = a d − b c with u = a x + b y, v = c x + d y; area = (Δu Δv) ÷ |that|; sealant = k × area. */
  q30c: p => {
    const det = p.a * p.d - p.b * p.c;
    const area = simpson2(() => 1, p.u1, p.u2, p.v1, p.v2, 2) / Math.abs(det);
    return [det, r6(area), r6(p.k * area)];
  },
  /* q30d: ∂(u, v)/∂(x, y) = a d − b c; the load is the integral of u v over the rectangle times |1 ÷ that|. */
  q30d: p => {
    const det = p.a * p.d - p.b * p.c;
    const iuv = simpson2((u, v) => u * v, p.u1, p.u2, p.v1, p.v2, 4);
    return [det, r6(iuv), r6(iuv / Math.abs(det))];
  },
});
})();
