/* Waves: sound and light concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* A model whose target is rounded to k places accepts only that rounding: half a step either way. */
const R = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
const Ek = (k, prompt, formula, values) => ({ ...E(prompt, formula, values), tolerance: Math.pow(10, -k) / 2 });
const idx = (t, size) => (T(t) + 10) % size;
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 500 nm, slits 0.25 mm apart, screen D = 1, 1.5 … 3 m; the 3rd bright fringe is at 6D mm, the spacing 2D mm. */
 q31: t => { const D = 1 + 0.5 * idx(t, 5), s = 2 * D, y = 3 * s;
  return E('Predict how far the 3rd bright fringe is from the centre, in millimetres.', `Spacing λD ÷ d = 500 × 10⁻⁹ × ${n(D)} ÷ (0.25 × 10⁻³) m = ${n(s)} mm. The 3rd bright fringe is 3 spacings out: 3 × ${n(s)} = ${n(y)} mm.`, [['3rd bright fringe (mm)', y], ['fringe spacing (mm)', s]]); },
 /* Film n = 1.25 on glass n = 1.52 (two shifts), dark reflection: t = λ ÷ (4 × 1.25) = λ ÷ 5, λ = 400 … 600 nm. */
 q32: t => { const lam = 400 + 20 * idx(t, 11), ln = lam / 1.25, th = ln / 4;
  return E('Predict the smallest thickness above zero that makes the reflection dark, in nanometres.', `Both surfaces reflect into a higher index, so there are two shifts and they cancel. λn = ${n(lam)} ÷ 1.25 = ${n(ln)} nm. Dark needs 2t = λn ÷ 2, so t = ${n(ln)} ÷ 4 = ${n(th)} nm.`, [['thickness (nm)', th], ['wavelength in film (nm)', ln]]); },
 /* 500 nm light, N = 10 … 210 fringes: the mirror moves N × 250 nm = N ÷ 4 μm. */
 q33: t => { const N = 10 * (T(t) + 11), um = N / 4;
  return Ek(3, 'Predict how far the mirror moved, in micrometres to 3 decimal places.', `One fringe is a move of λ ÷ 2 = 250 nm. ${n(N)} fringes: ${n(N)} × 250 = ${n(N * 250)} nm = ${n(um)} μm.`, [['mirror shift (μm)', um], ['fringes', N]]); },
 /* Slit 50 μm, 500 nm, screen D = 1 … 3 m: central peak 2Dλ ÷ a = 20D mm. */
 q34: t => { const D = 1 + 0.5 * idx(t, 5), w = 20 * D;
  return E('Predict the width of the central peak on the screen, in millimetres.', `The first dark fringe is at sin θ = λ ÷ a = 500 ÷ 50000 = 0.01. On the screen it is Dλ ÷ a = ${n(D)} × 0.01 m = ${n(w / 2)} mm from the centre, so the central peak is 2 × ${n(w / 2)} = ${n(w)} mm wide.`, [['central peak width (mm)', w], ['distance to first dark fringe (mm)', w / 2]]); },
 /* Slit 10 μm, 500 nm, detector at θ = 0.004 … 0.036 rad: β = 20π sin θ, I ÷ I₀ = (sin β ÷ β)². */
 q35: t => { const th = 0.004 * (1 + idx(t, 9)), b = 20 * Math.PI * Math.sin(th), I = Math.pow(Math.sin(b) / b, 2);
  return Ek(3, 'Predict the intensity at the detector as a fraction of the centre, I ÷ I₀, to 3 decimal places.', `β = π × 10000 × sin(${n(th)}) ÷ 500 ≈ ${n(R(b, 4))} rad. sin β ÷ β ≈ ${n(R(Math.sin(b) / b, 4))}, so I ÷ I₀ ≈ ${n(R(I, 4))}, which is ${R(I, 3).toFixed(3)} to 3 decimal places.`, [['I ÷ I₀', R(I, 3)], ['β (rad)', R(b, 3)]]); },
 /* Slits 10 μm wide, centres 10k μm apart with k = 2 … 7: order k missing, 2k − 1 bright fringes in the central peak. */
 q36: t => { const k = 2 + idx(t, 6), c = 2 * k - 1;
  return E('Predict how many bright fringes are inside the central peak.', `The first missing order is m = d ÷ a = ${n(10 * k)} ÷ 10 = ${n(k)}. Inside the central peak are orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} + ${n(k - 1)} + 1 = ${n(c)}.`, [['bright fringes in central peak', c], ['first missing order', k]]); },
 /* 500 lines per mm (d = 2000 nm), first order, λ = 400 … 650 nm: θ = arcsin(λ ÷ 2000). */
 q37: t => { const lam = 400 + 25 * idx(t, 11), s = lam / 2000, th = Math.asin(s);
  return Ek(3, 'Predict the angle of the first-order line, in radians to 3 decimal places.', `d = 1000000 ÷ 500 = 2000 nm. sin θ = ${n(lam)} ÷ 2000 = ${n(s)}, so θ = arcsin(${n(s)}) ≈ ${n(R(th, 4))} rad, which is ${R(th, 3).toFixed(3)} to 3 decimal places.`, [['angle (rad)', R(th, 3)], ['sin θ', s]]); },
 /* 500 nm, opening D = 5 … 40 cm: θ = 1.22 × 500 × 10⁻⁹ ÷ D = 61 ÷ D microradians (D in cm). */
 q38: t => { const Dc = 5 * (1 + idx(t, 8)), th = 61 / Dc;
  return Ek(2, 'Predict the smallest angle the telescope can resolve, in microradians to 2 decimal places.', `θ = 1.22 × 500 × 10⁻⁹ ÷ ${n(Dc / 100)} rad ≈ ${n(R(th, 4))} μrad, which is ${R(th, 2).toFixed(2)} to 2 decimal places.`, [['smallest angle (μrad)', R(th, 2)], ['opening (cm)', Dc]]); },
 /* 0.1 nm X-rays, first order at θ = 0.1 … 0.28 rad from the planes: d = 0.1 ÷ (2 sin θ). */
 q39: t => { const th = 0.1 + 0.02 * idx(t, 10), d = 0.1 / (2 * Math.sin(th));
  return Ek(3, 'Predict the spacing of the crystal planes, in nanometres to 3 decimal places.', `d = mλ ÷ (2 sin θ) = 0.1 ÷ (2 × sin(${n(th)})) ≈ ${n(R(d, 4))} nm, which is ${R(d, 3).toFixed(3)} to 3 decimal places.`, [['plane spacing (nm)', R(d, 3)], ['sin θ', R(Math.sin(th), 4)]]); },
 /* 500 lines per mm, first-order line at θ = 0.2 … 0.3 rad: λ = 2000 sin θ, to the nearest nanometre. */
 q40: t => { const th = 0.2 + 0.01 * idx(t, 11), lam = 2000 * Math.sin(th);
  return E('Predict the lamp’s wavelength, in nanometres to the nearest nanometre.', `d = 1000000 ÷ 500 = 2000 nm, and λ = d sin θ = 2000 × sin(${n(th)}) ≈ ${n(R(lam, 2))} nm, which is ${n(Math.round(lam))} nm to the nearest nanometre.`, [['wavelength (nm)', Math.round(lam)], ['sin θ', R(Math.sin(th), 4)]]); }
});
})();
