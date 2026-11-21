/* Independent oracles for Calculus 1 practice missions, file 6 of 8: q26b–q30d (game/realms/calc1/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here.
   Method used here: the polynomial in the prompt is rebuilt as a coefficient array (roots multiplied out, then integrated
   from its value at 0), and critical points are found by scanning the derivative for sign changes and bisecting, never by
   the factored form the generator uses. Slopes of the square-root missions are small symmetric differences. */
(function(){ 'use strict';
/* ---- coefficient arrays, lowest power first ---- */
const mul = (a, b) => { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
const fromRoots = (lead, roots) => roots.reduce((acc, r) => mul(acc, [-r, 1]), [lead]);
const integ = (a, c) => [c].concat(a.map((v, i) => v / (i + 1)));
const der = a => a.slice(1).map((v, i) => v * (i + 1));
const ev = (a, x) => a.reduceRight((s, v) => s * x + v, 0);
/* Scan (lo, hi) for sign changes of the polynomial d, bisect each, and report the sign before and after. */
const crossings = (d, lo, hi, N) => {
  N = N || 6000; const step = (hi - lo) / N, out = [];
  for (let i = 0; i < N; i++) {
    let a = lo + (i + 0.4137) * step, b = a + step; const fa = ev(d, a), fb = ev(d, b);
    if (fa * fb < 0) { for (let k = 0; k < 100; k++) { const m = (a + b) / 2; if (ev(d, a) * ev(d, m) <= 0) b = m; else a = m; }
      out.push({ x: (a + b) / 2, before: Math.sign(fa), after: Math.sign(fb) }); }
  }
  return out;
};
/* Total length of (0, hi) on which the polynomial d has the given sign. */
const lengthWhere = (d, sign, hi) => {
  const cuts = [0].concat(crossings(d, 0, hi).map(c => c.x), [hi]); let total = 0;
  for (let i = 0; i + 1 < cuts.length; i++) if (Math.sign(ev(d, (cuts[i] + cuts[i + 1]) / 2)) === sign) total += cuts[i + 1] - cuts[i];
  return total;
};
const ternaryMax = (g, lo, hi) => { for (let k = 0; k < 300; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (g(m1) < g(m2)) lo = m1; else hi = m2; } return (lo + hi) / 2; };
/* An exact whole-number square root found by counting up. */
const rootByCounting = n => { let r = 0; while (r * r < n) r++; return r; };
const centralSlope = (f, x) => { const h = 1e-4; return (f(x + h) - f(x - h)) / (2 * h); };
Object.assign(window.ORACLE, {
  /* T = 2√L: slope by a small symmetric difference, the change from slope × (change in length), the period itself by
     counting up to the whole-number root. */
  q26b: p => {
    const T = L => 2 * Math.sqrt(L), slope = centralSlope(T, p.L), dT = slope * p.dx;
    return [slope, dT, 2 * rootByCounting(p.L) + dT];
  },
  /* V = s³: slope by a symmetric difference, the error as slope × ds, the percentage against the block's own volume. */
  q26c: p => {
    const V = s => s * s * s, slope = centralSlope(V, p.s), dV = slope * p.ds;
    return [slope, dV, dV / (p.s * p.s * p.s) * 100];
  },
  /* L = √(x² + h²): the length by counting up to the root, the slope by a symmetric difference, then the tangent-line estimate. */
  q26d: p => {
    const L = x => Math.sqrt(x * x + p.h * p.h), len = rootByCounting(p.x * p.x + p.h * p.h), slope = centralSlope(L, p.x);
    return [len, slope, len + slope * p.dx];
  },
  /* T′ = −3(t − r1)(t − r2) multiplied out and integrated from T(0) = c; the minimum is where the scanned derivative
     goes from − to +; the rising time is the total length where the derivative is positive. */
  q27b: p => {
    const d = fromRoots(-3, [p.r1, p.r2]), T = integ(d, p.c), min = crossings(d, 0, 60).filter(c => c.before < 0 && c.after > 0);
    if (min.length !== 1) throw new Error('q27b: expected one local minimum');
    return [min[0].x, ev(T, min[0].x), lengthWhere(d, 1, 60)];
  },
  /* V′ = 6(t − r1)(t − r2): the time the derivative is negative, then V where it stops being negative. */
  q27c: p => {
    const d = fromRoots(6, [p.r1, p.r2]), V = integ(d, p.c), stop = crossings(d, 0, 60).filter(c => c.before < 0 && c.after > 0);
    if (stop.length !== 1) throw new Error('q27c: expected one stopping point');
    return [lengthWhere(d, -1, 60), ev(V, stop[0].x)];
  },
  /* Q = c·t·(a − t)² on 0 ≤ t ≤ a: ternary search for the peak, the value there, the slope at 0 by a symmetric difference. */
  q27d: p => {
    const Q = t => p.c * t * (p.a - t) * (p.a - t), tp = ternaryMax(Q, 0, p.a);
    return [tp, Q(tp), centralSlope(Q, 0)];
  },
  /* L′ = 3(t − r1)(t − r2) integrated from L(0) = c. L″ is the derivative array evaluated at t = r2; the minimum comes from
     the scanned sign change; the fastest fall is where L″ crosses zero. */
  q28b: p => {
    const d = fromRoots(3, [p.r1, p.r2]), L = integ(d, p.c), dd = der(d), min = crossings(d, 0, 60).filter(c => c.before < 0 && c.after > 0), infl = crossings(dd, 0, 60);
    if (min.length !== 1 || infl.length !== 1) throw new Error('q28b: unexpected shape');
    return [ev(dd, p.r2), ev(L, min[0].x), infl[0].x];
  },
  /* A′ = −6(t − r1)(t − r2) integrated from A(0) = c; the bottom of the dip is the scanned − to + change. */
  q28c: p => {
    const d = fromRoots(-6, [p.r1, p.r2]), A = integ(d, p.c), min = crossings(d, 0, 60).filter(c => c.before < 0 && c.after > 0);
    if (min.length !== 1) throw new Error('q28c: expected one dip');
    const alt = ev(A, min[0].x);
    return [alt, alt - p.H];
  },
  /* s′ = −3(t − r1)(t − r2) integrated from s(0) = c; the top of the climb is the scanned + to − change; the greatest
     velocity during the climb is a ternary-search maximum of s′ between the two critical points. */
  q28d: p => {
    const v = fromRoots(-3, [p.r1, p.r2]), s = integ(v, p.c), a = der(v), cr = crossings(v, 0, 60), top = cr.filter(c => c.before > 0 && c.after < 0), bot = cr.filter(c => c.before < 0 && c.after > 0);
    if (top.length !== 1 || bot.length !== 1) throw new Error('q28d: unexpected shape');
    const tv = ternaryMax(t => ev(v, t), bot[0].x, top[0].x);
    return [ev(a, top[0].x), ev(s, top[0].x), ev(v, tv)];
  },
  /* f′ = 12x(x − a)(x − b) multiplied out and integrated from f(0) = c; dips and the crest are read from the scanned signs. */
  q29b: p => {
    const d = fromRoots(12, [0, p.a, p.b]), f = integ(d, p.c), cr = crossings(d, -30, 30, 12000),
      dips = cr.filter(c => c.before < 0 && c.after > 0), crest = cr.filter(c => c.before > 0 && c.after < 0);
    if (dips.length !== 2 || crest.length !== 1) throw new Error('q29b: unexpected shape');
    const h = dips.map(c => ev(f, c.x));
    if (Math.abs(h[0] - h[1]) < 1e-9) throw new Error('q29b: the two dips are equally deep');
    const deep = h[0] < h[1] ? dips[0] : dips[1];
    return [deep.x, ev(f, deep.x), ev(der(d), crest[0].x)];
  },
  /* f′ = 12x(x − a)(x − b) integrated from f(0) = c; the lowest point is the lowest of the valleys (the − to + changes). */
  q29c: p => {
    const d = fromRoots(12, [0, p.a, p.b]), f = integ(d, p.c), valleys = crossings(d, -30, 30, 12000).filter(c => c.before < 0 && c.after > 0);
    if (valleys.length !== 2) throw new Error('q29c: expected two valleys');
    const h = valleys.map(c => ev(f, c.x));
    if (Math.abs(h[0] - h[1]) < 1e-9) throw new Error('q29c: the two valleys are equally low');
    const low = h[0] < h[1] ? valleys[0] : valleys[1];
    return [low.x, ev(f, low.x)];
  },
  /* f′ = 4(x − p)(x − q)(x − r) integrated from f(0) = c; the hill is the + to − change, the valleys the − to + changes. */
  q29d: p => {
    const d = fromRoots(4, [p.p, p.q, p.r]), f = integ(d, p.c), cr = crossings(d, -30, 30, 12000),
      hill = cr.filter(c => c.before > 0 && c.after < 0), valleys = cr.filter(c => c.before < 0 && c.after > 0);
    if (hill.length !== 1 || valleys.length !== 2) throw new Error('q29d: unexpected shape');
    return [hill[0].x, ev(f, hill[0].x), Math.min(...valleys.map(c => ev(f, c.x)))];
  },
  /* F = −x³ + 3s²x + c on [0, e]: candidates are the scanned zeros of F′ inside the range and the two ends. */
  q30b: p => {
    const F = integ(fromRoots(-3, [-p.s, p.s]), p.c), cand = [0, p.e].concat(crossings(der(F), 0, p.e).map(c => c.x)).map(x => ({ x, v: ev(F, x) }));
    const best = cand.reduce((a, b) => (b.v > a.v ? b : a)), worst = cand.reduce((a, b) => (b.v < a.v ? b : a));
    if (cand.some(c => c !== best && Math.abs(c.v - best.v) < 1e-9)) throw new Error('q30b: the largest airflow occurs at two pitches');
    return [best.v, best.x, worst.v];
  },
  /* T′ = 6(x − r1)(x − r2) integrated from T(0) = c on [0, e]: the hottest of the two ends and the scanned critical points. */
  q30c: p => {
    const T = integ(fromRoots(6, [p.r1, p.r2]), p.c), xs = [0, p.e].concat(crossings(der(T), 0, p.e).map(c => c.x)), hot = Math.max(...xs.map(x => ev(T, x)));
    return [hot, p.lim - hot];
  },
  /* H = A·x ÷ (x² + k²) on [L, R]: the peak by ternary search, the least heat by scanning a fine grid. */
  q30d: p => {
    const H = x => p.A * x / (x * x + p.k * p.k), xm = ternaryMax(H, p.L, p.R); let least = Infinity;
    for (let i = 0; i <= 20000; i++) least = Math.min(least, H(p.L + (p.R - p.L) * i / 20000));
    return [xm, H(xm), least];
  },
});
})();
