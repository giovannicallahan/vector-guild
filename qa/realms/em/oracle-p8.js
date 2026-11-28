/* Independent oracles for Electricity and magnetism: fields practice missions, file 8 of 8: q36b–q40d (game/realms/em/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 1e2) / 1e2;
const TAU = 2 * Math.PI, C0 = 3e8;
/* Reactances and impedance by complex arithmetic: [re, im]. */
const cmod = z => Math.hypot(z[0], z[1]);
const seriesZ = (R, L, C, w) => [R, w * L - 1 / (w * C)];

Object.assign(window.ORACLE, {
  /* q36b: spar length is lh/2 m, coil area is a/1000 m², field bc/100 T (the generator keeps these as whole-number codes). Spar emf Blv in mV; coil peak N B A (2π fr). */
  q36b: p => {
    const l = p.lh / 2, A = p.a / 1000, B = p.bc / 100;
    return [r2(p.b * 1e-6 * l * p.v * 1e3), r2(p.N * B * A * TAU * p.fr)];
  },
  /* q36c: area a/100 m², field bg/100 T; k is the fraction 1/k of a revolution, so the phase is 2π/k. */
  q36c: p => {
    const w = p.rpm / 60 * TAU, peak = p.N * (p.bg / 100) * (p.a / 100) * w;
    return [r2(w), r2(peak), r2(peak * Math.sin(TAU / p.k))];
  },
  /* q36d: rod length lh/10 m, field br/100 T. emf, current, braking force ILB, power F v. */
  q36d: p => {
    const l = p.lh / 10, B = p.br / 100, emf = B * l * p.v, I = emf / p.Rc, F = I * l * B;
    return [r2(emf), r2(I), r2(F), r2(F * p.v)];
  },
  /* q37b: inductance lh/20 H; t in ms. tau in ms; current at t from the first-order response; final energy ½ L I² in mJ. */
  q37b: p => {
    const L = p.lh / 20, tau = L / p.R * 1e3, If = p.eps / p.R;
    return [r2(tau), r2(If * (1 - Math.exp(-p.t / tau))), r2(0.5 * L * If * If * 1e3)];
  },
  /* q37c: W in mJ, L in mH. Find I by ½ L I² = W, then V = I R, tau = L/R in ms. */
  q37c: p => {
    const L = p.L / 1e3, I = Math.sqrt(2 * (p.W / 1e3) / L);
    return [r2(I), r2(I * p.R), r2(L / p.R * 1e3)];
  },
  /* q37d: Rt in kΩ, Ct in μF, L in mH. tau = Rt Ct ms; R = L/tau; energy ½ L (eps/R)² in mJ. */
  q37d: p => {
    const tau = p.Rt * p.Ct, L = p.L / 1e3, R = L / (tau / 1e3), I = p.eps / R;
    return [r2(tau), r2(R), r2(0.5 * L * I * I * 1e3)];
  },
  /* q38b: ind true = coil of val mH, false = capacitor of val μF. Reactance, rms current V/X, peak √2 times that. */
  q38b: p => {
    const w = TAU * p.f, X = p.ind ? w * p.val * 1e-3 : 1 / (w * p.val * 1e-6), I = p.Vr / X;
    return [r2(X), r2(I), r2(I * Math.SQRT2)];
  },
  /* q38c: i is the rms current in tenths of an ampere. X = V/I, C from X = 1/(2π f C), current rises with frequency m times. */
  q38c: p => {
    const I = p.i / 10, X = p.Vr / I, C = 1 / (TAU * p.f * X);
    return [r2(X), r2(C * 1e6), r2(p.Vr / (1 / (TAU * p.m * p.f * C)))];
  },
  /* q38d: X = 2π f L, I0 = V0 / X, E = ½ L I0² in mJ. */
  q38d: p => {
    const L = p.L / 1e3, X = TAU * p.f * L, I0 = p.V0 / X;
    return [r2(X), r2(I0), r2(0.5 * L * I0 * I0 * 1e3)];
  },
  /* q39b: R ohm, L mH, C nF, f kHz. Impedance modulus of the series sum, peak current in mA, resonant frequency in kHz. */
  q39b: p => {
    const L = p.L * 1e-3, C = p.C * 1e-9, Z = cmod(seriesZ(p.R, L, C, TAU * p.f * 1e3));
    return [r2(Z), r2(p.V0 / Z * 1e3), r2(1 / (TAU * Math.sqrt(L * C)) / 1e3)];
  },
  /* q39c: L mH. C from ω² L C = 1 at f0; at resonance Z = R; coil voltage I ω L. */
  q39c: p => {
    const L = p.L * 1e-3, w = TAU * p.f0, C = 1 / (w * w * L), I = p.V0 / p.R;
    return [r2(C * 1e6), r2(I), r2(I * w * L)];
  },
  /* q39d: L mH, C μF. Resonant frequency; Z = R there (check by impedance); coil energy ½ L I² in mJ. */
  q39d: p => {
    const L = p.L * 1e-3, C = p.C * 1e-6, f = 1 / (TAU * Math.sqrt(L * C));
    const Z = cmod(seriesZ(p.R, L, C, TAU * f)), I = p.V0 / Z;
    return [r2(f), r2(I), r2(0.5 * L * I * I * 1e3)];
  },
  /* q40b: lam in metres, e is the amplitude in tenths of V/m, d in km. f = c/λ in MHz, B = E/c in nT, time d/c in ms. */
  q40b: p => [r2(C0 / p.lam / 1e6), r2(p.e / 10 / C0 * 1e9), r2(p.d * 1e3 / C0 * 1e3)],
  /* q40c: lam in nm, E in V/m, d in μm. f in THz, B = E/c in nT, gap ÷ wavelength. */
  q40c: p => [r2(C0 / (p.lam * 1e-9) / 1e12), r2(p.E / C0 * 1e9), r2(p.d * 1e-6 / (p.lam * 1e-9))],
  /* q40d: lam in metres, L in μH. f = c/λ in MHz; resonance gives C = 1/(ω² L), in pF; coil reactance ω L. */
  q40d: p => {
    const f = C0 / p.lam, w = TAU * f, L = p.L * 1e-6;
    return [r2(f / 1e6), r2(1 / (w * w * L) * 1e12), r2(w * L)];
  },
});
})();
