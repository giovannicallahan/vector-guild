/* Independent oracles for Data and inference practice missions, file 5 of 8: q21b–q25d (game/realms/stats/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round half up to d places (small nudge so 0.285 style values do not fall the wrong way). */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; };
/* Simpson's rule on [a, b] with n (even) steps. */
const simpson = (f, a, b, n) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Standard normal area to the left of z, by numerical integration of the bell curve from 0 to |z|. */
const phi = z => {
  const half = simpson(t => Math.exp(-t * t / 2) / Math.sqrt(2 * Math.PI), 0, Math.abs(z), 2000);
  return z >= 0 ? 0.5 + half : 0.5 - half;
};
/* The table row of the (already rounded) z: the left area to 4 decimal places, held as whole ten-thousandths. */
const row = z => Math.round(phi(z) * 1e4);
/* p-value in ten-thousandths from the table row; tail 1 left, 2 right, 3 two-tailed (double the smaller tail). */
const pv = (z, tail) => { const L = row(z); return tail === 1 ? L : tail === 2 ? 1e4 - L : 2 * Math.min(L, 1e4 - L); };
/* Reject H0 when the p-value is less than the level (compared in ten-thousandths). */
const rej = (pt, a) => (pt < Math.round(a * 1e4) ? 1 : 0);
const sq = Math.sqrt;
/* z for a mean with σ known. */
const zMean = (xb, m0, sg, n) => (xb - m0) / (sg / sq(n));
/* z for one proportion: x successes in n against the claimed share p0. */
const zProp = (x, n, p0) => (x / n - p0) / sq(p0 * (1 - p0) / n);
/* c only indexes the list of eleven (claimed share in percent, sample size) pairs used by q22b, q22c, q22d, q23c, q23d:
   0..4 are 50, 20, 10, 80, 90 per cent with n = 100; 5..9 are 20, 10, 50, 80, 90 per cent with n = 400; 10 is 50 per cent with n = 625. */
const CL = [[50, 100], [20, 100], [10, 100], [80, 100], [90, 100], [20, 400], [10, 400], [50, 400], [80, 400], [90, 400], [50, 625]];
/* i, j (q24b, q24c, q24d) only index the 22 (group size, standard deviation) pairs: 10 beds with s = 2,3,4,5,6,8;
   16 beds with s = 2,4,6,8; 20 beds with s = 2,3,4,5,6,8; 25 beds with s = 2,3,4,5,6,8. */
const NS = [[10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 8], [16, 2], [16, 4], [16, 6], [16, 8],
  [20, 2], [20, 3], [20, 4], [20, 5], [20, 6], [20, 8], [25, 2], [25, 3], [25, 4], [25, 5], [25, 6], [25, 8]];
/* Student t curve: area to the left of t, by numerical integration; the quantile is found by bisection. */
const lgam = x => { // Lanczos
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x -= 1; let a = 0.99999999999980993; const t = x + 7.5;
  for (let i = 0; i < 8; i++) a += g[i] / (x + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};
const tPdf = (t, v) => Math.exp(lgam((v + 1) / 2) - lgam(v / 2)) / sq(v * Math.PI) * Math.pow(1 + t * t / v, -(v + 1) / 2);
const tCdf = (t, v) => { const h = simpson(x => tPdf(x, v), 0, Math.abs(t), 1000); return t >= 0 ? 0.5 + h : 0.5 - h; };
const tq = {};
const tCrit = (df, area) => { // t* with `area` of the curve to its left
  const key = df + '/' + area; if (tq[key]) return tq[key];
  let lo = 0, hi = 20; for (let i = 0; i < 45; i++) { const mid = (lo + hi) / 2; if (tCdf(mid, df) < area) lo = mid; else hi = mid; }
  return (tq[key] = (lo + hi) / 2);
};
/* Two-sample t (separate variances): statistic, rounded-down df, and the decision against the table t*. */
const twoT = (x1, s1, n1, x2, s2, n2, tail) => {
  const a = s1 * s1 / n1, b = s2 * s2 / n2, t = (x1 - x2) / sq(a + b);
  const df = Math.floor((a + b) * (a + b) / (a * a / (n1 - 1) + b * b / (n2 - 1)));
  const area = tail === 3 ? 0.975 : 0.95, ts = tCrit(df, area);
  const reject = tail === 3 ? Math.abs(t) > ts : tail === 2 ? t > ts : t < -ts;
  return { t, df, reject: reject ? 1 : 0 };
};
/* Two proportions: pooled share and the z statistic first minus second. */
const twoP = (n1, x1, n2, x2) => {
  const pp = (x1 + x2) / (n1 + n2), z = (x1 / n1 - x2 / n2) / sq(pp * (1 - pp) * (1 / n1 + 1 / n2));
  return { pp, z };
};
Object.assign(window.ORACLE, {
  /* tail 1 "<" left, 2 ">" right, 3 "≠" two-tailed (tail only indexes the Hₐ wording); m is only the number in H₀. */
  q21b: p => { const z = p.z, pt = pv(rd(z, 2), p.tail); return [pt / 1e4, rej(pt, p.a)]; },
  /* Same p-value, then count the three levels 0.01, 0.05, 0.10 that exceed it. */
  q21c: p => { const pt = pv(rd(p.z, 2), p.tail); return [pt / 1e4, [0.01, 0.05, 0.1].filter(a => pt < Math.round(a * 1e4)).length]; },
  /* σ known: z = (x̄ − μ0) ÷ (σ ÷ √N), then the table row of the rounded z. */
  q21d: p => { const z = rd(zMean(p.xb, p.m0, p.sg, p.N), 2), pt = pv(z, p.tail); return [z, pt / 1e4, rej(pt, p.a)]; },
  /* One proportion; c indexes the (claim, n) list, x of n passed. */
  q22b: p => { const [pc, n] = CL[p.c], z = rd(zProp(p.x, n, pc / 100), 2); return [z, rej(pv(z, p.tail), p.a)]; },
  /* Three days pooled: b tested and f faulty per day; c indexes the claimed share. */
  q22c: p => {
    let n = 0, x = 0; for (let d = 0; d < p.b.length; d++) { n += p.b[d]; x += p.f[d]; }
    const z = rd(zProp(x, n, CL[p.c][0] / 100), 2);
    return [rd(x / n, 4), z, rej(pv(z, p.tail), p.a)];
  },
  /* z and decision as q22b, then the margin of error z* √(p̂(1 − p̂) ÷ n) with z* = 1.96. */
  q22d: p => {
    const [pc, n] = CL[p.c], z = rd(zProp(p.x, n, pc / 100), 2), ph = p.x / n;
    return [z, rej(pv(z, p.tail), p.a), rd(1.96 * sq(ph * (1 - ph) / n), 3)];
  },
  /* The tail is the one the supplier story asks for (tail only indexes the wording: 1 lower, 2 higher, 3 different). */
  q23b: p => { const z = rd(zMean(p.xb, p.m0, p.sg, p.N), 2); return [p.tail, z, rej(pv(z, p.tail), p.a)]; },
  /* The report gives p̂ as a percent of n; x is the count (x ÷ n is that percent). */
  q23c: p => { const [pc, n] = CL[p.c], z = rd(zProp(p.x, n, pc / 100), 2); return [p.tail, z, rej(pv(z, p.tail), p.a)]; },
  /* k = 1: a proportion test (c indexes claim and n, x failed); k = 0: a mean test with σ known. Then T tests, each with
     false-alarm chance α when H₀ is true: expected false alarms = T × α. */
  q23d: p => {
    const z = rd(p.k === 1 ? zProp(p.x, CL[p.c][1], CL[p.c][0] / 100) : zMean(p.xb, p.m0, p.sg, p.N), 2);
    return [p.tail, z, rej(pv(z, p.tail), p.a), rd(p.T * p.a, 4)];
  },
  /* i, j index the (size, s) lists of the drip and flood groups. */
  q24b: p => {
    const [n1, s1] = NS[p.i], [n2, s2] = NS[p.j], r = twoT(p.x1, s1, n1, p.x2, s2, n2, p.tail);
    return [rd(r.t, 2), r.reject];
  },
  /* Only totals are given: k1, k2 are the totals per 10 beds, so the prompt total is k × n ÷ 10 and the mean is total ÷ n = k ÷ 10. */
  q24c: p => {
    const [n1, s1] = NS[p.i], [n2, s2] = NS[p.j], r = twoT(p.k1 / 10, s1, n1, p.k2 / 10, s2, n2, p.tail);
    return [rd(r.t, 2), r.reject];
  },
  /* Two-sample test, then a 95% t interval for the first group alone: df n1 − 1, t* to 3 d.p. as the table prints it. */
  q24d: p => {
    const [n1, s1] = NS[p.i], [n2, s2] = NS[p.j], r = twoT(p.x1, s1, n1, p.x2, s2, n2, p.tail);
    const ts = rd(tCrit(n1 - 1, 0.975), 3), half = ts * s1 / sq(n1);
    return [rd(r.t, 2), r.reject, rd(p.x1 - half, 2), rd(p.x1 + half, 2)];
  },
  q25b: p => { const r = twoP(p.n1, p.x1, p.n2, p.x2); return [rd(r.pp, 3), rd(r.z, 2)]; },
  /* The log gives percents: successes = n × percent ÷ 100. */
  q25c: p => { const r = twoP(p.n1, p.n1 * p.y1 / 100, p.n2, p.n2 * p.y2 / 100); return [rd(r.pp, 3), rd(r.z, 2)]; },
  /* Two-tailed (Hₐ: p₁ ≠ p₂): p-value doubles the smaller table tail of the rounded z. */
  q25d: p => {
    const r = twoP(p.n1, p.x1, p.n2, p.x2), z = rd(r.z, 2), pt = pv(z, 3);
    return [rd(r.pp, 3), z, pt / 1e4, rej(pt, p.a)];
  },
});
})();
