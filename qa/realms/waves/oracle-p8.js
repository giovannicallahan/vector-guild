/* Independent oracles for Waves: sound and light practice missions, file 8 of 8: q36b–q40d (game/realms/waves/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* Largest whole order m with m x lam < d (strict), found by counting up. */
const topOrder = (lam, d) => { let m = 0; while ((m + 1) * lam < d - 1e-9) m++; return m; };
Object.assign(window.ORACLE, {
  /* D m, lambda nm, d um: D lam / d is in mm directly. Missing order m = d / a; central peak holds orders -(m-1)..(m-1). */
  q36b: p => { const m = p.d / p.a; return [rd(p.D * p.lam / p.d, 2), m, 2 * (m - 1) + 1]; },
  /* a = d / k (k = first missing order); sin theta = lam / a; orders strictly between -k and k. */
  q36c: p => { const a = p.d / p.k; return [rd(a, 6), rd(Math.asin(p.lam / (a * 1000)), 4), 2 * (p.k - 1) + 1]; },
  /* d/a = P/Q in lowest terms; dark fringe j lands on m = j P / Q, first whole number is j = Q, m = P.
     Orders strictly inside +-d/a: count integers with |m| < d/a. y = m lam D / d in mm (lam nm, d um, D m). */
  q36d: p => {
    const g = gcd(p.d, p.a), P = p.d / g, r = p.d / p.a;
    let n = 0; for (let m = -50; m <= 50; m++) if (Math.abs(m) < r) n++;
    return [P, n, rd(P * p.lam * p.D / p.d, 2)];
  },
  /* d = 1e6 / N nm; orders with m lam < d; sin theta = m lam / d. */
  q37b: p => { const d = 1e6 / p.N, m = topOrder(p.lam, d); return [rd(d, 6), m, rd(Math.asin(m * p.lam / d), 3)]; },
  /* Angles from unrounded arcsines; gap = red - blue. */
  q37c: p => {
    const d = 1e6 / p.N, tb = Math.asin(p.m * p.lb / d), tr = Math.asin(p.m * p.lr / d);
    return [rd(d, 6), rd(tb, 3), rd(tr - tb, 3)];
  },
  /* ma la = mb l2 (same angle, same d). */
  q37d: p => {
    const d = 1e6 / p.N, l2 = p.ma * p.la / p.mb;
    return [rd(l2, 1), rd(Math.asin(p.ma * p.la / d), 3), topOrder(l2, d)];
  },
  /* s m, H km. Angle in microradians = s / (H 1000) x 1e6. D = 1.22 lam / theta, metres to cm. */
  q38b: p => {
    const th = p.s / (p.H * 1000);
    return [rd(th * 1e6, 2), rd(100 * 1.22 * p.lam * 1e-9 / th, 2)];
  },
  /* Dc cm. theta = 1.22 lam / D; greatest distance = s / theta; yes if L <= that. */
  q38c: p => {
    const th = 1.22 * p.lam * 1e-9 / (p.Dc / 100), far = p.s / th / 1000;
    return [rd(th * 1e6, 2), rd(far, 2), p.L <= far ? 1 : 0];
  },
  /* Dc cm is both the slit width and the round diameter; L km; separation = L theta. */
  q38d: p => {
    const w = p.Dc / 100, ts = p.lam * 1e-9 / w, tr = 1.22 * p.lam * 1e-9 / w;
    return [rd(ts * 1e6, 2), rd(tr * 1e6, 2), rd(p.L * (tr - ts), 2)];
  },
  /* lam = 2 d sin(theta) / m with theta in radians; orders with m lam < 2 d. */
  q39b: p => { const lam = 2 * p.d * Math.sin(p.th) / p.m; return [rd(lam, 3), topOrder(lam, 2 * p.d)]; },
  /* sin theta = m lam / (2 d); arm at 2 theta. */
  q39c: p => { const s = p.m * p.lam / (2 * p.d), t = Math.asin(s); return [rd(s, 3), rd(t, 3), rd(2 * t, 3)]; },
  /* theta = alpha / 2 each time; d = m lam / (2 sin theta); lam2 = 2 d sin(theta2) / m2. */
  q39d: p => {
    const d = p.m * p.lam / (2 * Math.sin(p.al / 2));
    return [rd(d, 3), rd(2 * d * Math.sin(p.al2 / 2) / p.m2, 3)];
  },
  /* y (mm) = D lam / d2 so lam nm = y d2 / D; then whole-number lam on the grating (d = 1e6/N nm). */
  q40b: p => {
    const lam = Math.round(p.dy * p.d2 / p.D + 1e-9), d = 1e6 / p.N;
    return [lam, rd(100 * p.D * Math.tan(Math.asin(lam / d)), 1)];
  },
  /* Calibration: sin theta from tan theta = y / D; d = lc / sin theta; N whole; unknown lam = d sin theta. */
  q40c: p => {
    const sinOf = y => { const t = y / 100 / p.D; return t / Math.sqrt(1 + t * t); };
    const N = Math.round(1e6 / (p.lc / sinOf(p.yc))), d = 1e6 / N;
    return [N, Math.round(d * sinOf(p.yu) + 1e-9)];
  },
  /* Each first-order line: lam = d sin(atan(y / D)); then second-order positions of the whole-number wavelengths. */
  q40d: p => {
    const d = 1e6 / p.N, lam = y => Math.round(d * Math.sin(Math.atan(y / 100 / p.D)));
    const a = lam(p.y1), b = lam(p.y2), pos = l => 100 * p.D * Math.tan(Math.asin(2 * l / d));
    return [a, b, rd(pos(b) - pos(a), 1)];
  }
});
})();
