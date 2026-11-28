/* Independent oracles for Calculus 3: many variables practice missions, file 1 of 8: q01b–q05d (game/realms/calc3/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers: plain loops over coordinates, and angles from atan2(|cross|, dot) rather than acos(dot / lengths). */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = a => Math.sqrt(dot(a, a));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const comb = (a, u, b, v) => [a * u[0] + b * v[0], a * u[1] + b * v[1], a * u[2] + b * v[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const angle = (a, b) => Math.atan2(len(cross(a, b)), dot(a, b));
const r3 = x => Math.round(x * 1000) / 1000;
Object.assign(window.ORACLE, {
  /* q01b: a is A; d1 and d2 are the steps A to B and B to C (B = A + d1, C = B + d2). Two legs, added. */
  q01b: p => {
    const B = add(p.a, p.d1), C = add(B, p.d2);
    const l1 = len(sub(B, p.a)), l2 = len(sub(C, B));
    return [l1, l1 + l2];
  },
  /* q01c: p is the rim station's (x, y); dx, dy lead to the deck station; z1 is the rim height, dz the deck's extra height. */
  q01c: p => {
    const ground = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
    const cable = Math.sqrt(ground * ground + p.dz * p.dz);
    return [ground, cable];
  },
  /* q01d: a is A; dx, dy lead to B's x, y. The cable length L printed in the prompt is a whole number of metres that the
     parameters fix (it is rebuilt from them, dz included, and rounded to the whole metre the prompt shows). From then on
     only the stated facts are used: B = (A.x + dx, A.y + dy, z) with z above A's height, and |AB| = L. The height z is
     found by bisection on the distance, which grows with z above A; no Pythagoras step is solved for the rise. */
  q01d: p => {
    const L = Math.round(Math.sqrt(p.dx * p.dx + p.dy * p.dy + p.dz * p.dz));
    const B = z => [p.a[0] + p.dx, p.a[1] + p.dy, z], dist = z => len(sub(B(z), p.a));
    let lo = p.a[2], hi = p.a[2] + 1000;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (dist(m) < L) lo = m; else hi = m; }
    const z = Math.round((lo + hi) / 2 * 1e6) / 1e6;
    return [Math.round((z - p.a[2]) * 1e6) / 1e6, z];
  },
  /* q02b: u, v are the two moves; a, b the multipliers (the plan is a u + b v). */
  q02b: p => comb(p.a, p.u, p.b, p.v),
  /* q02c: start S, then a legs of u and b legs of v, one leg at a time. */
  q02c: p => {
    let pos = p.S.slice();
    for (let i = 0; i < p.a; i++) pos = add(pos, p.u);
    for (let i = 0; i < p.b; i++) pos = add(pos, p.v);
    return pos;
  },
  /* q02d: start S, plan a u + b v; then the distance from S to the end. */
  q02d: p => {
    const end = add(p.S, comb(p.a, p.u, p.b, p.v));
    return [end[0], end[1], end[2], len(sub(end, p.S))];
  },
  /* q03b: v is the arrow w; its length, then each component divided by the length. */
  q03b: p => { const L = len(p.v); return [L, p.v[0] / L, p.v[1] / L, p.v[2] / L]; },
  /* q03c: v is the arrow, s the distance along it; the flag arrow has length s in the direction of v. */
  q03c: p => { const L = len(p.v); return [L, p.v[0] * p.s / L, p.v[1] * p.s / L, p.v[2] * p.s / L]; },
  /* q03d: w = a u + b v, its magnitude, and w scaled to length 1. */
  q03d: p => { const w = comb(p.a, p.u, p.b, p.v), L = len(w); return [L, w[0] / L, w[1] / L, w[2] / L]; },
  /* q04b: dot product, then the angle from atan2 of the cross-product length and the dot product, 3 decimals. */
  q04b: p => [dot(p.u, p.v), r3(angle(p.u, p.v))],
  /* q04c: B is the junction; ba and bc are the arrows from B to A and to C. Dot product and angle between them. */
  q04c: p => [dot(p.ba, p.bc), r3(angle(p.ba, p.bc))],
  /* q04d: u = ⟨k, u₂, u₃⟩ with u₂, u₃ as printed and v as printed. Right angles means the angle between u and v is π/2:
     k is found by bisection on k ↦ (angle(u(k), v) − π/2), using the atan2 angle (no linear equation is solved), then
     rounded to the whole number the mission is built on. The length is the distance from the origin to the strut's tip
     by two Pythagoras steps (x and y first, then z). */
  q04d: p => {
    const u = k => [k, p.u[1], p.u[2]], g = k => angle(u(k), p.v) - Math.PI / 2;
    let lo = -1000, hi = 1000; const up = g(hi) > g(lo);
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if ((g(m) > 0) === up) hi = m; else lo = m; }
    const k = Math.round((lo + hi) / 2 * 1e6) / 1e6;
    return [k, Math.hypot(Math.hypot(k, p.u[1]), p.u[2])];
  },
  /* q05b: work = F . d; projection of F onto d = F . (d / |d|). */
  q05b: p => { const L = len(p.d); return [dot(p.F, p.d), dot(p.F, [p.d[0] / L, p.d[1] / L, p.d[2] / L])]; },
  /* q05c: work done on each leg, added; projection onto d1 + d2 is the total work over the overall length. */
  q05c: p => {
    const w = dot(p.F, p.d1) + dot(p.F, p.d2), D = add(p.d1, p.d2);
    return [w, w / len(D)];
  },
  /* q05d: F = ⟨a, b, f⟩ with a, b printed and f unknown; d printed. The gauge reading R in the prompt is rebuilt from the
     parameters (p.f is used only for that). The projection of F onto d is a straight-line function of f, so f is read off
     by the secant through f = 0 and f = 1 (no equation is rearranged). The work is then ‖F‖‖d‖cos θ with θ from atan2 of
     the cross-product length and the dot product. */
  q05d: p => {
    const L = len(p.d), proj = f => dot([p.a, p.b, f], p.d) / L, R = proj(p.f);
    const f = Math.round((R - proj(0)) / (proj(1) - proj(0)) * 1e6) / 1e6, F = [p.a, p.b, f];
    return [f, Math.round(len(F) * L * Math.cos(angle(F, p.d)) * 1e6) / 1e6];
  },
});
})();
