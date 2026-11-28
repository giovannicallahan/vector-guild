/* Independent oracles for Waves: sound and light learn missions, file d: q31–q40 (game/realms/waves/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6). Do not import game files. Answers are rounded to the
   places each prompt states, from the unrounded working, except where a prompt says to use a rounded value. */
(function(){ 'use strict';
const rnd = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-12) * f) / f; };
const NM = 1e-9, UM = 1e-6, MM = 1e-3;
Object.assign(window.ORACLE, {
  /* lam in nm, d in mm, D in m, m = order. Small angle: y = D tan θ with tan θ = mλ/d. Work in metres, answer in mm. */
  q31: p => {
    const step = (p.lam * NM) * p.D / (p.d * MM);
    return [rnd(p.m * step / MM, 2), rnd(step / MM, 2)];
  },
  /* lam nm, nf film index, nb base index, bright 1 = bright reflection wanted, 0 = dark. Air above (n = 1).
     A shift occurs at each reflection off a higher index. Search the thicknesses t = x·λf/2 (x = 1, 2, 3, …) for the
     first one whose phase difference gives the wanted result. */
  q32: p => {
    const shifts = (p.nf > 1 ? 1 : 0) + (p.nb > p.nf ? 1 : 0);
    const lf = p.lam / p.nf;
    let t = 0;
    for (let x = 1; x < 50; x++) {
      /* extra path 2t = x·λf/2 → x half-wavelengths; one shift adds one more half-wavelength to the phase. */
      const halves = x + (shifts === 1 ? 1 : 0);
      const isBright = halves % 2 === 0; /* whole number of wavelengths in phase */
      if (isBright === !!p.bright) { t = x * lf / 4; break; }
    }
    return [shifts, rnd(lf, 1), rnd(t, 1)];
  },
  /* lam nm, N fringes → move = N·λ/2 (nm) in μm. k is the number of fringes in the return move (the prompt's printed
     distance is k·λ/2 in μm; fringes = distance ÷ (λ/2)). */
  q33: p => [rnd(p.N * p.lam / 2 / 1000, 3), p.k],
  /* a in μm, lam nm, m order, D in m. Dark: sin θ = mλ/a, θ by arcsin. Central band: 2·D·tan θ1, small-angle, mm. */
  q34: p => {
    const th = Math.asin(p.m * p.lam * NM / (p.a * UM));
    const s1 = p.lam * NM / (p.a * UM);
    return [rnd(th, 4), rnd(2 * p.D * s1 / MM, 2)];
  },
  /* a μm, lam nm, th rad. β = π a sin θ / λ; I/I0 = (sin β/β)². */
  q35: p => {
    const b = Math.PI * (p.a * UM) * Math.sin(p.th) / (p.lam * NM);
    return [rnd(b, 3), rnd(Math.pow(Math.sin(b) / b, 2), 3)];
  },
  /* a = slit width, k = d/a (centres k·a apart, whole), lam nm. First single-slit dark: a sin θ = λ.
     Missing order: smallest m ≥ 1 with m·λ/d landing on a single-slit minimum, i.e. m·a/d whole. Bright orders in the
     central peak: |m|·λ/d < λ/a, i.e. |m|·a < d (the order that meets the edge is missing). */
  q36: p => {
    const d = p.k * p.a;
    const th = Math.asin(p.lam * NM / (p.a * UM));
    let miss = 0;
    for (let m = 1; m < 100; m++) if ((m * p.a) % d === 0) { miss = m; break; }
    let count = 0;
    for (let m = -100; m <= 100; m++) if (Math.abs(m) * p.a < d) count++;
    return [rnd(th, 4), miss, count];
  },
  /* N lines per mm → d = 1e6/N nm. Order m at lam: sin θ = mλ/d. Second lamp first order: λ = d sin θ2. */
  q37: p => {
    const d = 1e6 / p.N;
    return [rnd(d, 0), rnd(Math.asin(p.m * p.lam / d), 3), rnd(d * Math.sin(p.th2), 1)];
  },
  /* lam nm, Dc cm aperture, L km distance. θ = 1.22 λ/D; separation = L·θ (small angle). */
  q38: p => {
    const th = 1.22 * (p.lam * NM) / (p.Dc * 0.01);
    return [rnd(th * 1e6, 2), rnd(p.L * th, 2)];
  },
  /* lam nm, th rad from planes, m order, m2 second order. mλ = 2d sin θ. */
  q39: p => {
    const d = p.m * p.lam / (2 * Math.sin(p.th));
    return [rnd(d, 3), rnd(Math.asin(p.m2 * p.lam / (2 * d)), 3)];
  },
  /* N lines per mm, D screen distance m, y first-order position in cm. tan θ = y/D, then λ = d sin θ.
     Second order uses the whole-number wavelength: sin θ2 = 2λ/d, y2 = D tan θ2 in cm. */
  q40: p => {
    const d = 1e6 / p.N;
    const lam = Math.round(d * Math.sin(Math.atan(p.y / 100 / p.D)));
    const th2 = Math.asin(2 * lam / d);
    return [lam, rnd(p.D * Math.tan(th2) * 100, 1)];
  },
});
})();
