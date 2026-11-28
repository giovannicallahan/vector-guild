/* Independent oracles for Waves: sound and light practice missions, file 5 of 8: q21b–q25d (game/realms/waves/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (Doppler pairs solved as a ratio, Snell's law,
   path difference in half-wavelengths, unit conversions).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const C = 343;
const vT = T => 331 * Math.sqrt(1 + T / 273);
/* Source moving at v past a still listener: approaching fa = f c/(c-v), receding fr = f c/(c+v).
   The ratio fa/fr = (c+v)/(c-v) gives v = c (fa-fr)/(fa+fr); the own frequency is the harmonic mean 2 fa fr/(fa+fr). */
const dopV = (c, fa, fr) => c * (fa - fr) / (fa + fr);
const dopF = (fa, fr) => 2 * fa * fr / (fa + fr);
Object.assign(window.ORACLE, {
  /* c: speed of sound; vs: sled speed. M = vs/c; sin(theta) = c/vs. */
  q21b: p => [rd(p.vs / p.c, 2), rd(Math.asin(p.c / p.vs), 3)],
  /* th: half-angle (rad); D: distance (m). sin(th) = 343/vs. */
  q21c: p => { const v = C / Math.sin(p.th); return [rd(v, 1), rd(v / C, 2), rd(p.D / v, 1)]; },
  /* Approaching siren: fh = fs c/(c-v) so v = c (1 - fs/fh). After the boost speed is k v; sin(theta) = c/(k v). (k is the printed multiple.) */
  q21d: p => {
    const v = C * (1 - p.fs / p.fh), M = p.k * v / C;
    return [rd(v, 1), rd(M, 2), rd(Math.asin(1 / M), 3)];
  },
  /* near: nearer distance. The far distance is near + (k/2) wavelengths (k is a count of half-wavelengths; the far distance
     in the prompt is that sum, to 2 decimal places, so the printed gap can differ slightly from the exact one). Loud when the path difference is a whole number of wavelengths, i.e. k even. */
  /* near, far: the two printed distances (m). Loud when the difference is a whole number of wavelengths. */
  q22b: p => { const lam = C / p.f, d = Math.abs(p.far - p.near), w = d / lam; return [rd(lam, 3), rd(d, 3), Math.abs(w - Math.round(w)) < 1e-6 ? 1 : 0]; },
  /* Path difference (m + 1/2) wavelengths (the printed multiple); distance from B = r1 + difference. */
  q22c: p => { const lam = C / p.f, d = (p.m + 0.5) * lam; return [rd(lam, 3), rd(d, 3), rd(p.r1 + d, 3)]; },
  /* v from the printed formula; wavelength = v/f; distance from B = r1 + w wavelengths. */
  q22d: p => { const v = vT(p.T), lam = v / p.f; return [rd(v, 2), rd(lam, 3), rd(p.r1 + p.w * lam, 3)]; },
  /* fa heard approaching, fr receding. */
  q23b: p => {
    const v = dopV(C, p.fa, p.fr), f = dopF(p.fa, p.fr);
    return [rd(v, 1), rd(f, 1), rd(f - p.fr, 1)];
  },
  /* fa = fs c/(c-v) => v = c (1 - fs/fa); receding frequency fs c/(c+v); time = D / v. */
  q23c: p => { const v = C * (1 - p.fs / p.fa); return [rd(v, 1), rd(p.fs * C / (C + v), 1), rd(p.D / v, 1)]; },
  /* Speed of sound from the printed formula, then the ratio method. */
  q23d: p => { const c = vT(p.T); return [rd(c, 2), rd(dopV(c, p.fa, p.fr), 1), rd(dopF(p.fa, p.fr), 1)]; },
  /* v in units of 1e8 m/s; n = 3.00/v; lambda inside = lam/n. */
  q24b: p => { const n = 3 / p.v; return [rd(n, 3), rd(p.lam / n, 1)]; },
  /* Speed in units of 1e8 m/s = 3/nn; 1 unit covers 0.1 m per ns, so time = d / (0.1 speed); vacuum time = d / 0.3. */
  q24c: p => {
    const s = 3 / p.nn, t = p.d / (0.1 * s);
    return [rd(s, 3), rd(t, 3), rd(t - p.d / 0.3, 3)];
  },
  /* f in 1e14 Hz: vacuum wavelength = 3e8 / (f 1e14) m = 3000/f nm; inside = that / n; speed = f lambda_in / 1000. */
  q24d: p => { const l0 = 3000 / p.f, li = l0 / p.nn; return [rd(l0, 1), rd(li, 1), rd(p.f * li / 1000, 3)]; },
  /* a is measured from the surface, so the angle from the normal is pi/2 - a. Snell: n1 sin i = n2 sin r. */
  q25b: p => {
    const i = Math.PI / 2 - p.a;
    return [rd(i, 3), rd(Math.asin(p.n1 * Math.sin(i) / p.n2), 3)];
  },
  /* Air (1.00) -> sheet n2 -> block n3; the sheet angle is the same at the lower face. Turn = |r3 - a|. */
  q25c: p => {
    const r2 = Math.asin(Math.sin(p.a) / p.n2), r3 = Math.asin(p.n2 * Math.sin(r2) / p.n3);
    return [rd(r2, 3), rd(r3, 3), rd(Math.abs(r3 - p.a), 3)];
  },
  /* n = 3.00 / v (v in 1e8 m/s); sin r = sin a / n; lambda inside = lam / n. */
  q25d: p => { const n = 3 / p.v; return [rd(n, 3), rd(Math.asin(Math.sin(p.a) / n), 3), rd(p.lam / n, 1)]; }
});
})();
