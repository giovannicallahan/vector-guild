/* Independent oracles for Probability practice missions, file 7 of 8: q31b–q35d (game/realms/prob/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round half up, with a tiny nudge so values such as 1.005 do not fall the wrong way. */
const rd = (x, dp) => { const m = Math.pow(10, dp); return Math.floor(x * m + 0.5 + 1e-9) / m; };
/* Normal table: area to the left of z, by Simpson's rule on the bell curve from 0 to |z|, then rounded to 4 places. */
const memo = {};
const area = z => {
  const key = Math.round(z * 100);
  if (memo[key] !== undefined) return memo[key];
  const n = 400, a = Math.abs(z), h = a / n, f = t => Math.exp(-t * t / 2) / Math.sqrt(2 * Math.PI);
  let s = f(0) + f(a);
  for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
  const half = s * h / 3;
  return (memo[key] = rd(0.5 + (z < 0 ? -half : half), 4));
};
/* The table row (z in hundredths, searched from -4.00 to 4.00) whose area is closest to the target. */
const rowFor = target => {
  let best = 0, gap = 9;
  for (let k = -400; k <= 400; k++) { const g = Math.abs(area(k / 100) - target); if (g < gap - 1e-12) { gap = g; best = k; } }
  return best / 100;
};
Object.assign(window.ORACLE, {
  /* q31b: widths are mu + d1/100 and mu - d2/100 cm; sigma = sh/100 cm, so z = distance in hundredths ÷ sh. */
  q31b: p => [rd(p.d1 / p.sh, 2), rd(-p.d2 / p.sh, 2)],
  /* q31c: flag line z = ch/10; the bolt is e/100 mm over the limit mu + z sigma. */
  q31c: p => {
    const sigma = p.sh / 100, line = p.ch / 10, limit = p.mu + line * sigma, over = p.e / 100;
    return [rd((limit + over - p.mu) / sigma, 2), rd(limit, 2), over];
  },
  /* q31d: z = sg × k whole standard deviations; the empirical rule gives 68, 95, 99.7 inside, half the rest in one tail. */
  q31d: p => {
    const inside = { 1: 68, 2: 95, 3: 99.7 }[p.k];
    return [p.sg * p.k, rd((100 - inside) / 2, 2)];
  },
  /* q32b: z = h/100, x = mu + z sigma; area from the table. */
  q32b: p => { const z = p.h / 100; return [z, area(z)]; },
  /* q32c: z = h/100; one failure chance; expected failures = N × that 4-place probability. */
  q32c: p => { const z = p.h / 100, pr = area(z); return [z, pr, rd(p.N * pr, 6)]; },
  /* q32d: z = h/100; area to the left, then 1 minus it. */
  q32d: p => { const z = p.h / 100, left = area(z); return [z, left, rd(1 - left, 4)]; },
  /* q33b: the two z-scores are hl/100 and hu/100; accepted share = difference of the two table areas. */
  q33b: p => { const a = p.hl / 100, b = p.hu / 100; return [a, b, rd(area(b) - area(a), 4)]; },
  /* q33c: pass chance from the two areas; rejected = N × (1 - pass). */
  q33c: p => {
    const pass = rd(area(p.hb / 100) - area(p.ha / 100), 4);
    return [pass, rd(p.N * (1 - pass), 6)];
  },
  /* q33d: z-scores, inside the band, then the rest. */
  q33d: p => {
    const a = p.ha / 100, b = p.hb / 100, inside = rd(area(b) - area(a), 4);
    return [a, b, inside, rd(1 - inside, 4)];
  },
  /* q34b: k-th percentile: search the table for the closest area to k/100, then mu + z sigma to 1 place. */
  q34b: p => { const z = rowFor(p.k / 100); return [z, rd(p.mu + z * p.s, 1)]; },
  /* q34c: the gate is the (100 - t)th percentile; the longest t percent of N are recycled. */
  q34c: p => { const z = rowFor((100 - p.t) / 100); return [z, rd(p.mu + z * p.s, 1), rd(p.N * p.t / 100, 6)]; },
  /* q34d: upper cut-off is the (100 - t)th percentile, lower is the t-th; lengths to 1 place. */
  q34d: p => {
    const zu = rowFor((100 - p.t) / 100), zl = rowFor(p.t / 100);
    return [zu, rd(p.mu + zl * p.s, 1), rd(p.mu + zu * p.s, 1)];
  },
  /* q35b: means add over the instruments. */
  q35b: p => { let one = 0, all = 0; for (let k = 0; k < p.a; k++) { one += p.m1; all += p.m1; } for (let k = 0; k < p.b; k++) all += p.m2; return [one, all]; },
  /* q35c: payload = pods + packs; spare lift is the printed capacity L minus that. */
  q35c: p => { let t = 0; for (let k = 0; k < p.c; k++) t += p.mu; for (let k = 0; k < p.d; k++) t += p.w; return [t, p.L - t]; },
  /* q35d: E(X) from the printed masses and probabilities pr; pods add; frame added once. */
  q35d: p => {
    const pr = p.pr, e = rd(p.x1 * pr[0] + p.x2 * pr[1] + p.x3 * pr[2], 6);
    let pods = 0; for (let k = 0; k < p.c; k++) pods += e;
    return [e, rd(pods, 6), rd(pods + p.f, 6)];
  },
});
})();
