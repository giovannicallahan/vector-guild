/* Independent oracles for Electromagnetism: learn missions, file d: q31–q40 (game/realms/em/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from the mission text by a
   different method from build() (docs/PACK-FORMAT.md §6): numerical integration, bisection, series, unit counting.
   Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const bisect = (g, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
/* sin by Taylor series (no Math.sin). */
const sinS = th => { let s = 0, t = th; for (let k = 0; k < 40; k++) { s += t; t *= -th * th / ((2 * k + 2) * (2 * k + 3)); } return s; };
const MU0 = 4 * Math.PI * 1e-7;
Object.assign(window.ORACLE, {
  /* p: "proton" (m 1.67e-27 kg, q 1.60e-19 C) or "alpha" (m 6.64e-27 kg, q 3.20e-19 C), as printed. k = speed in
     units of 10^5 m/s, b = field in hundredths of a tesla. Radius from qvB = mv²/r; period = circumference ÷ speed. */
  q31: p => {
    const m = p.p === 'alpha' ? 6.64e-27 : 1.67e-27, q = p.p === 'alpha' ? 3.20e-19 : 1.60e-19;
    const v = p.k * 1e5, B = p.b / 100;
    const r = m * v / (q * B);
    const T = 2 * Math.PI * r / v;
    return [rd(r * 1e3, 2), rd(T * 1e9, 2)];
  },
  /* i = current (A), R ohms, l = length in half-metres, b = field in hundredths of a tesla, a = index into the angle
     list [π/6, π/4, π/3, 2π/3, 3π/4, 5π/6] (only a label index). Force = B I L sin θ; at right angles sin = 1. */
  q32: p => {
    const volts = p.i * p.R, cur = volts / p.R;
    const ang = [[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6]][p.a];
    const th = Math.PI * ang[0] / ang[1];
    const L = p.l / 2, B = p.b / 100;
    return [cur, rd(B * cur * L * sinS(th), 2), rd(B * cur * L, 2)];
  },
  /* i1, i2 in A, d in cm; same = true when currents run the same way. B = μ0 i1 / (2π d); force per metre = B i2. */
  q33: p => {
    const d = p.d / 100;
    const B = MU0 * p.i1 / (2 * Math.PI * d) * 1e6;   // μT
    const f = B * p.i2;                                 // μT × A = μN per metre
    return [rd(B, 2), rd(f, 2), p.same ? 1 : -1];
  },
  /* nn = turns per metre (printed turns ÷ length), c = length in cm, h = current in half-amperes. B = μ0 n I. */
  q34: p => {
    const I = p.h / 2;
    const turns = p.nn * (p.c / 100);
    const n = turns / (p.c / 100);
    return [n, rd(MU0 * n * I * 1e3, 2)];
  },
  /* N turns, a = area in hundredths of m², b1 b2 in mT, t = index into [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2] s.
     emf = N A |ΔB| / Δt; current = emf ÷ R. Field up and growing: the current makes a field down, so clockwise seen from
     above (1); field shrinking: anticlockwise (−1). */
  q35: p => {
    const T = [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2][p.t];
    const A = p.a / 100;
    const emf = p.N * A * Math.abs(p.b2 - p.b1) / T;   // mT·m²/s = mV
    return [rd(emf, 2), rd(emf / p.R, 2), p.b2 > p.b1 ? 1 : -1];
  },
  /* l = rod length in tenths of a metre, v m/s, br = field in hundredths of a tesla (rod), N turns, a = area in hundredths
     of m², bg = generator field in hundredths of a tesla, w rad/s. Rod emf = B l v; peak emf = N B A ω. */
  q36: p => [rd((p.br / 100) * (p.l / 10) * p.v, 2), rd(p.N * (p.bg / 100) * (p.a / 100) * p.w, 2)],
  /* L mH, R ohms, i = final current in half-amperes (supply volts = R × final current), t ms. τ = L/R; energy ½LI²;
     current from stepping dI/dt = (V − R I)/L with RK4. */
  q37: p => {
    const Ifin = p.i / 2, V = Ifin * p.R, L = p.L / 1000;
    const tau = p.L / p.R;
    const E = 0.5 * p.L * Ifin * Ifin;   // mH × A² = mJ
    const N = 20000, h = (p.t / 1000) / N;
    const f = I => (V - p.R * I) / L;
    let I = 0;
    for (let k = 0; k < N; k++) {
      const k1 = f(I), k2 = f(I + h * k1 / 2), k3 = f(I + h * k2 / 2), k4 = f(I + h * k3);
      I += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    }
    return [tau, rd(E, 2), rd(I, 2)];
  },
  /* V0 peak volts, f = index into [50, 60, 100, 200, 400, 500, 1000] Hz, ind = true for an inductor (val in mH) and false
     for a capacitor (val in μF). rms = peak ÷ √2; reactance X = ωL or 1/(ωC); rms current = rms voltage ÷ X. */
  q38: p => {
    const f = [50, 60, 100, 200, 400, 500, 1000][p.f], w = 2 * Math.PI * f;
    const vr = p.V0 / Math.sqrt(2);
    const X = p.ind ? w * p.val * 1e-3 : 1 / (w * p.val * 1e-6);
    return [rd(vr, 2), rd(X, 2), rd(vr / X, 2)];
  },
  /* R ohms, L mH, C μF, f = index into [50, 60, 100, 200, 400, 500, 1000] Hz, V0 peak volts. Impedance from the series
     resistance and net reactance; peak current V0 ÷ Z; resonance where the two reactances cancel (bisection). */
  q39: p => {
    const f = [50, 60, 100, 200, 400, 500, 1000][p.f], w = 2 * Math.PI * f;
    const L = p.L * 1e-3, C = p.C * 1e-6;
    const X = w * L - 1 / (w * C);
    const Z = Math.sqrt(p.R * p.R + X * X);
    const net = fr => 2 * Math.PI * fr * L - 1 / (2 * Math.PI * fr * C);
    const f0 = bisect(net, 1e-3, 1e9);
    return [rd(Z, 2), rd(p.V0 / Z, 2), rd(f0, 2)];
  },
  /* l = index into the inductance list [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] μH, c pF, e = electric amplitude in
     tenths of V/m. Resonance where ωL = 1/(ωC) (bisection); λ = c ÷ f; B amplitude = E amplitude ÷ c. */
  q40: p => {
    const L = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10][p.l] * 1e-6, C = p.c * 1e-12;
    const net = fr => 2 * Math.PI * fr * L - 1 / (2 * Math.PI * fr * C);
    const f = bisect(net, 1, 1e12);
    const c = 3.00e8;
    return [rd(f / 1e6, 2), rd(c / f, 2), rd((p.e / 10) / c * 1e9, 2)];
  },
});
})();
