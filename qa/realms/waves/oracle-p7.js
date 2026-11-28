/* Independent oracles for Waves: sound and light practice missions, file 7 of 8: q31b–q35d (game/realms/waves/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const NM = 1e-9, UM = 1e-6, MM = 1e-3, C = 3.00e8;
/* Reflection from a film (index nf) on a base (index nb), air (index 1) above.
   Top reflection always shifts (1 < nf); the bottom shifts only if nb > nf. Search the thickness list t = k lam/(4 nf), k = 1,2,3...
   2t = k (lam/nf)/2: with one shift, bright for odd k and dark for even k; with two shifts, bright for even k and dark for odd k. */
const filmSearch = (lam, nf, nb, wantBright) => {
  const shifts = 1 + (nb > nf ? 1 : 0);
  for (let k = 1; k < 20; k++) {
    const bright = (shifts === 1) ? (k % 2 === 1) : (k % 2 === 0);
    if (bright === wantBright) return { shifts, t: k * lam / (4 * nf) };
  }
  return null;
};
/* sinc-squared intensity ratio at slit width a (m), wavelength lam (m), sine s. */
const sinc2 = (a, lam, s) => { const b = Math.PI * a * s / lam; return { b, r: Math.pow(Math.sin(b) / b, 2) }; };
Object.assign(window.ORACLE, {
  /* spacing = y / m (mm); d = lam D / spacing, shown in mm. */
  q31b: p => {
    const s = p.y / p.m;
    return [rd(s, 2), rd(1e3 * p.lam * NM * p.D / (s * MM), 3)];
  },
  /* spacing = y / m; lam = spacing d / D in nm; new spacing = spacing D2 / D (unrounded). */
  q31c: p => {
    const s = p.y / p.m;
    return [rd(s, 2), rd(s * MM * p.d * MM / p.D / NM, 0), rd(s * p.D2 / p.D, 2)];
  },
  /* Spacing of a line = lam D / d. Line 1 bright at m spacings; gap = m (s2 - s1); dark fringe of order j at (j + 1/2) s1.
     (m and j are orders; they are printed in the prompt.) */
  q31d: p => {
    const s1 = 1e3 * p.l1 * NM * p.D / (p.d * MM), s2 = 1e3 * p.l2 * NM * p.D / (p.d * MM);
    return [rd(p.m * s1, 2), rd(p.m * (s2 - s1), 2), rd((p.j + 0.5) * s1, 2)];
  },
  /* Count shifts from the index ordering; thickness by the search above (smallest k > 0). Both answers in nm. */
  q32b: p => {
    const b = filmSearch(p.lam, p.nf, p.nb, true), d = filmSearch(p.lam, p.nf, p.nb, false);
    return [b.shifts, rd(b.t, 1), rd(d.t, 1)];
  },
  /* p.bright is 1 when the prompt asks for bright and 0 for dark. Time = thickness / rate. */
  q32c: p => {
    const r = filmSearch(p.lam, p.nf, p.nb, !!p.bright);
    return [r.shifts, rd(r.t, 1), rd(r.t / p.rate, 1)];
  },
  /* n = c / v (v is given in 1e8 m/s); p.bright is 1 for bright and 0 for dark; nb = 1 means air below the film. */
  q32d: p => {
    const n = C / (p.v * 1e8), r = filmSearch(p.lam, n, p.nb, !!p.bright);
    return [rd(n, 3), r.shifts, rd(r.t, 1)];
  },
  /* move = x2 - x1; one fringe per lam/2 of move, so fringes = 2 move / lam. */
  q33b: p => {
    const mv = p.x2 - p.x1;
    return [rd(mv, 3), Math.round(2 * mv * UM / (p.lam * NM))];
  },
  /* growth = N lam / 2 (um); per degree = growth / dT; fringes for dT2 = N dT2 / dT. */
  q33c: p => {
    const g = p.N * p.lam * NM / 2 / UM;
    return [rd(g, 3), rd(g / p.dT, 3), Math.round(p.N * p.dT2 / p.dT)];
  },
  /* lam in oil = lam / n; 2 x = N lam_oil, so x = N lam_oil / 2. */
  q33d: p => {
    const lo = p.lam / p.nIdx;
    return [rd(lo, 1), rd(p.N * lo * NM / 2 / UM, 3)];
  },
  /* band w = 2 D lam / a, so a = 2 D lam / w (shown in um); dark fringe sin(theta) = m lam / a with the unrounded a. */
  q34b: p => {
    const a = 2 * p.D * p.lam * NM / (p.w * MM);
    return [rd(a / UM, 2), rd(Math.asin(p.m * p.lam * NM / a), 4)];
  },
  /* y1 = D lam / a; band 2 y1; count the orders m >= 1 with m y1 < H (none lies on the end). */
  q34c: p => {
    const y1 = 1e3 * p.D * p.lam * NM / (p.a * UM);
    let n = 0; while ((n + 1) * y1 < p.H) n++;
    return [rd(y1, 2), rd(2 * y1, 2), n];
  },
  /* f in GHz; lam = c / f in cm; sin theta = m lam / a; band = 2 D tan(asin(lam / a)). */
  q34d: p => {
    const lam = C / (p.f * 1e9), a = p.a * 1e-2;
    return [rd(lam * 100, 2), rd(Math.asin(p.m * lam / a), 4), rd(2 * p.D * Math.tan(Math.asin(lam / a)), 3)];
  },
  /* beta = pi a sin(theta) / lam; reading = I0 (sin beta / beta)^2. */
  q35b: p => {
    const r = sinc2(p.a * UM, p.lam * NM, Math.sin(p.th));
    return [rd(r.b, 3), rd(p.I0 * r.r, 1)];
  },
  /* Ratios at the two angles from the full formula; difference of the unrounded ratios. */
  q35c: p => {
    const A = sinc2(p.a * UM, p.lam * NM, Math.sin(p.thA)), B = sinc2(p.a * UM, p.lam * NM, Math.sin(p.thB));
    return [rd(A.r, 3), rd(B.r, 3), rd(A.r - B.r, 3)];
  },
  /* First dark fringe y1 = D lam / a (mm); at the detector sin theta ~ y / D; I / I0 = (sin beta / beta)^2. */
  q35d: p => {
    const y1 = 1e3 * p.D * p.lam * NM / (p.a * UM), r = sinc2(p.a * UM, p.lam * NM, p.y / (p.D * 1e3));
    return [rd(y1, 2), rd(r.b, 3), rd(r.r, 3)];
  }
});
})();
