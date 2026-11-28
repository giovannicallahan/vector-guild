/* Independent oracles for Waves: sound and light practice missions, file 6 of 8: q26b–q30d (game/realms/waves/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const C8 = 3.00;                       /* c in units of 1e8 m/s */
/* Thin lens / mirror: image distance from 1/f = 1/do + 1/di, solved by a small root-find on g(di) = 1/f - 1/do - 1/di
   (bisection on the side of the answer: di > 0 when do > f, di < 0 otherwise) rather than the closed form. */
const imageDist = (f, d) => {
  const t = 1 / f - 1 / d;             /* 1/di */
  let lo, hi;
  if (t > 0) { lo = 1e-6; hi = 1e7; } else { lo = -1e7; hi = -1e-6; }
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2, g = (1 / mid) - t;
    /* 1/mid is decreasing in mid on each side, so g > 0 means mid is too small on the positive side, too large on the negative side */
    if (t > 0) { if (g > 0) lo = mid; else hi = mid; } else { if (g > 0) lo = mid; else hi = mid; }
  }
  return (lo + hi) / 2;
};
/* A ray inside the denser material at angle x from the normal is totally reflected when sin x > n_out / n_in. */
const trapped = (x, nin, nout) => (Math.sin(x) > nout / nin ? 1 : 0);
/* Highest bright order on one side: the largest whole m with m lambda < d (sin theta < 1), both in nm. */
const topOrder = (dnm, lam) => Math.ceil(dnm / lam - 1e-12) - 1;
Object.assign(window.ORACLE, {
  /* Critical angle sin = n2/n1 (n1 the block). Count the two rays whose sine of angle exceeds that ratio. */
  q26b: p => [rd(Math.asin(p.n2 / p.n1), 3), trapped(p.a, p.n1, p.n2) + trapped(p.b, p.n1, p.n2)],
  /* sin a = n sin(th2), so th2 = asin(sin a / n); wall angle pi/2 - th2. Trapped when sin(wall) = cos(th2) > 1/n,
     i.e. 1 - sin^2 a / n^2 > 1 / n^2, i.e. n^2 - 1 > sin^2 a (no arcsin needed). */
  q26c: p => {
    const th2 = Math.asin(Math.sin(p.a) / p.nn);
    return [rd(th2, 3), rd(Math.PI / 2 - th2, 3), (p.nn * p.nn - 1 > Math.pow(Math.sin(p.a), 2)) ? 1 : 0];
  },
  /* n = c / v with v in 1e8 m/s. Critical angle sin = n2/n1 = v1/v2 (the c cancels). */
  q26d: p => {
    const n1 = C8 / p.v1, n2 = C8 / p.v2;
    return [rd(n1, 3), rd(n2, 3), rd(Math.asin(p.v1 / p.v2), 3), Math.sin(p.a) > p.v1 / p.v2 ? 1 : 0];
  },
  /* Malus: I after a filter = I before x cos^2 of the angle between the beam's polarisation and the axis.
     B is turned b from A, so the second factor uses b, not a + b. */
  q27b: p => { const A = p.I0 * Math.pow(Math.cos(p.a), 2); return [rd(A, 2), rd(A * Math.pow(Math.cos(p.b), 2), 2)]; },
  /* Unpolarised: filter 1 passes half. Second filter must pass T / (I0/2) = cos^2 theta. tan^2 = 1/f - 1, so theta = atan(sqrt(1/f - 1)). */
  q27c: p => {
    const h = p.I0 / 2, f = p.T / h;
    return [rd(h, 2), rd(f, 3), rd(Math.atan(Math.sqrt(1 / f - 1)), 3)];
  },
  /* I = P / (4 pi r^2). Unpolarised light loses half at filter 1, then cos^2 a, then cos^2 b. Fraction is relative to I. */
  q27d: p => {
    const I = p.P / (4 * Math.PI * p.r * p.r);
    const out = I * 0.5 * Math.pow(Math.cos(p.a), 2) * Math.pow(Math.cos(p.b), 2);
    return [rd(I, 2), rd(out, 2), rd(out / I, 3)];
  },
  /* Mirror: 1/f = 1/d + 1/di (root-found); hi = -(di/d) h. */
  q28b: p => { const di = imageDist(p.f, p.d); return [rd(di, 1), rd(-di / p.d * p.h, 2)]; },
  /* Wall W metres = 100 W cm = di. f from 1/f = 1/d + 1/di; m = -di/d; picture height m h. */
  q28c: p => {
    const di = 100 * p.W, f = 1 / (1 / p.d + 1 / di), m = -di / p.d;
    return [rd(f, 1), rd(m, 2), rd(m * p.h, 1)];
  },
  /* Lens 1 image at di1; object for lens 2 is L - di1 in front of it; total m = m1 m2. */
  q28d: p => {
    const i1 = imageDist(p.f1, p.d), d2 = p.L - i1, i2 = imageDist(p.f2, d2);
    return [rd(i1, 1), rd(i2, 1), rd((-i1 / p.d) * (-i2 / d2), 2)];
  },
  /* Diverging lens f = -fm (fm is the magnitude printed with a minus sign). Image virtual. Back face glass->out medium: sin crit = out/nn. */
  q29b: p => {
    const di = imageDist(-p.fm, p.d);
    return [rd(di, 1), rd(-di / p.d * p.h, 2), trapped(p.a, p.nn, p.out)];
  },
  /* Object distance from 1/d0 = 1/f - 1/di; image height = -(di/d0) h; critical angle against air asin(1/n). */
  q29c: p => {
    const d0 = 1 / (1 / p.f - 1 / p.di);
    return [rd(d0, 1), rd(-p.di / d0 * p.h, 2), rd(Math.asin(1 / p.nn), 3)];
  },
  /* v = c / n; wavelength inside = vacuum wavelength / n (frequency unchanged). Back face against air: sin crit = 1/n. */
  q29d: p => {
    const di = imageDist(p.f, p.d);
    return [rd(di, 1), rd(C8 / p.nn, 3), rd(p.lam / p.nn, 1), trapped(p.a, p.nn, 1)];
  },
  /* d in um = 1000 d nm. sin theta = m lambda / d. Bright fringes on one side: orders 0 < m with m lambda < d, so 2M + 1 in all. */
  q30b: p => {
    const dn = 1000 * p.d, M = topOrder(dn, p.lam);
    return [rd(Math.asin(p.m * p.lam / dn), 4), rd(Math.asin((p.m + 1) * p.lam / dn), 4), 2 * M + 1];
  },
  /* Path difference = d sin a (nm); lambda = that / m; highest order from the unrounded lambda. */
  q30c: p => {
    const pd = 1000 * p.d * Math.sin(p.a), lam = pd / p.m;
    return [rd(pd, 1), rd(lam, 1), topOrder(1000 * p.d, lam)];
  },
  /* Wavelength in the liquid = lam0 / n. Angles: asin(m lambda / d) with vacuum then liquid wavelength. */
  q30d: p => {
    const dn = 1000 * p.d, ll = p.lam0 / p.nl;
    return [rd(ll, 1), rd(Math.asin(p.m * p.lam0 / dn), 4), rd(Math.asin(p.m * ll / dn), 4), topOrder(dn, ll)];
  }
});
})();
