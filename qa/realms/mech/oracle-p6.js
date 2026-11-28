/* Independent oracles for Mechanics: practice missions, file 6 of 8: q26b–q30d (game/realms/mech/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states (work = force × distance × cos θ, work = ∫F dx, work–energy theorem, P = W/t, U = mgy, U = ½kx²).
   Unrounded values are carried to the end; the last step is rounded as the prompt says. */
(function(){ 'use strict'; /* stub helpers: independent of the generator */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const r6 = x => Math.round(x * 1e6) / 1e6;
const g = 9.8;
/* Work of a force a·x^n + c from x1 to x2: antiderivative a x^(n+1)/(n+1) + c x. */
const integ = (a, n, c, x1, x2) => a * (Math.pow(x2, n + 1) - Math.pow(x1, n + 1)) / (n + 1) + c * (x2 - x1);
Object.assign(window.ORACLE, {
  /* q26b: tow W = F d cos θ (θ rad, printed); press W = ∫(p x² + q) dx from x1 to x2. */
  q26b: p => [rd(p.F * p.d * Math.cos(p.th), 2), r6(integ(p.p, 2, p.q, p.x1, p.x2))],
  /* q26c: total = F d cos θ + ∫ a x³ dx; mean force = ram work ÷ (x2 − x1). */
  q26c: p => {
    const ram = integ(p.a, 3, 0, p.x1, p.x2);
    return [rd(p.F * p.d * Math.cos(p.th) + ram, 2), rd(ram / (p.x2 - p.x1), 2)];
  },
  /* q26d: W = F·(end − start) for each leg; A to C directly. */
  q26d: p => [
    p.fx * (p.bx - p.ax) + p.fy * (p.by - p.ay),
    p.fx * (p.cx - p.bx) + p.fy * (p.cy - p.by),
    p.fx * (p.cx - p.ax) + p.fy * (p.cy - p.ay)],
  /* q27b: KE = ½mv²; net work = KE out − KE in. */
  q27b: p => [0.5 * p.m * p.v0 * p.v0, 0.5 * p.m * p.v1 * p.v1, 0.5 * p.m * (p.v1 * p.v1 - p.v0 * p.v0)],
  /* q27c: W = ∫(a x + b) dx; ½mv² = ½mv0² + W. */
  q27c: p => {
    const W = integ(p.a, 1, p.b, p.x1, p.x2);
    return [r6(W), rd(Math.sqrt(p.v0 * p.v0 + 2 * W / p.m), 2)];
  },
  /* q27d: cable W = F d1 cos θ; friction W = −f d2; net is the sum; v² = v0² + 2 net/m. */
  q27d: p => {
    const w1 = p.F * p.d1 * Math.cos(p.th), net = w1 - p.f * p.d2;
    return [rd(w1, 2), rd(net, 2), rd(Math.sqrt(p.v0 * p.v0 + 2 * net / p.m), 2)];
  },
  /* q28b: W = mgh; P = W/t; heaviest mass for P2 kW: m = P2·1000·t / (g h). */
  q28b: p => [r6(p.m * g * p.h), rd(p.m * g * p.h / p.t, 2), rd(p.P2 * 1000 * p.t / (g * p.h), 2)],
  /* q28c: W = F v t (t in minutes → ×60 s), in kJ; new speed v = P2·1000 / F. */
  q28c: p => [r6(p.F * p.v * p.tm * 60 / 1000), rd(p.P2 * 1000 / p.F, 2)],
  /* q28d: KE = ½mv²; t = KE / P (P kW printed); F = P/v. */
  q28d: p => {
    const ke = 0.5 * p.m * p.v * p.v, P = p.P * 1000;
    return [r6(ke), rd(ke / P, 2), rd(P / p.v, 2)];
  },
  /* q29b: tug W = F d; friction W = −μ m g d; ½mv² = ½m v0² + net; power uses the unrounded speed. */
  q29b: p => {
    const wt = p.F * p.d, wf = -p.uk * p.m * g * p.d;
    const v = Math.sqrt(p.v0 * p.v0 + 2 * (wt + wf) / p.m);
    return [r6(wt), r6(wf), rd(v, 2), rd(p.F * v, 2)];
  },
  /* q29c: pull W = ∫(a x + b) dx over 0..d; friction −μ m g d; from rest; power at x = d with F(d) = a d + b. */
  q29c: p => {
    const net = integ(p.a, 1, p.b, 0, p.d) - p.uk * p.m * g * p.d;
    const v = Math.sqrt(2 * net / p.m);
    return [rd(net, 2), rd(v, 2), rd((p.a * p.d + p.b) * v, 2)];
  },
  /* q29d: winch F d; gravity −m g sin θ d; friction −μ m g cos θ d; from rest. */
  q29d: p => {
    const wf = p.F * p.d, wg = -p.m * g * Math.sin(p.th) * p.d, wr = -p.uk * p.m * g * Math.cos(p.th) * p.d;
    return [rd(wf, 2), rd(wg, 2), rd(wr, 2), rd(Math.sqrt(2 * (wf + wg + wr) / p.m), 2)];
  },
  /* q30b: U = m g y with y = −d; gravity's work = m g (h1 + d) going down; spring U = ½kx². */
  q30b: p => [r6(-p.m * g * p.d), r6(p.m * g * (p.h1 + p.d)), r6(0.5 * p.k * p.x * p.x)],
  /* q30c: E = ½kx²; m g y = E. */
  q30c: p => { const E = 0.5 * p.k * p.x * p.x; return [r6(E), rd(E / (p.m * g), 2)]; },
  /* q30d: E = ∫(k x + c x³) dx 0..X = kX²/2 + cX⁴/4; ½k0 s² = E. */
  q30d: p => {
    const E = p.k * p.X * p.X / 2 + p.c * Math.pow(p.X, 4) / 4;
    return [rd(E, 2), rd(Math.sqrt(2 * E / p.k0), 2)];
  },
});
})();
