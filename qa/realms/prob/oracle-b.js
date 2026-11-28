/* Independent oracles for Probability learn missions, file b: q11–q20 (game/realms/prob/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r = (x, d) => Math.round(x * Math.pow(10, d) + 1e-9) / Math.pow(10, d);
Object.assign(window.ORACLE, {
  /* Table a, b (Northway sound, cracked), c, d (Ridgeline sound, cracked). Label each of the 200 crates and count. */
  q11: p => {
    const crates = [];
    const add = (n, sup, cr) => { for (let i = 0; i < n; i++) crates.push({ sup, cr }); };
    add(p.a, 'N', false); add(p.b, 'N', true); add(p.c, 'R', false); add(p.d, 'R', true);
    const ridge = crates.filter(x => x.sup === 'R');
    const given = ridge.filter(x => x.cr).length / ridge.length;
    const either = crates.filter(x => x.sup === 'R' || x.cr).length / crates.length;
    return [r(given, 3), r(either, 3)];
  },
  /* Screen 10000 crew one at a time by position in the list: first b*100 are carriers, and so on. */
  q12: p => {
    const N = 10000, carriers = p.b * 100;
    let pos = 0, posCarrier = 0;
    for (let i = 0; i < N; i++) {
      const isCarrier = i < carriers;
      const idx = isCarrier ? i : i - carriers, group = isCarrier ? carriers : N - carriers;
      const rate = isCarrier ? p.h : p.f;
      if (idx * 100 < rate * group) { pos++; if (isCarrier) posCarrier++; }
    }
    return [r(posCarrier / pos, 3)];
  },
  /* P(catch) = x%. Odds against = (100 − x) : x, reduced by trying every divisor downwards; odds a : b for → a/(a+b). */
  q13: p => {
    let u = 100 - p.x, v = p.x;
    for (let g = Math.min(u, v); g >= 1; g--) if (u % g === 0 && v % g === 0) { u /= g; v /= g; break; }
    return [u, v, r(p.a / (p.a + p.b), 6)];
  },
  /* p holds the five probabilities in hundredths, entry m being the missing one (shown as ?). Work in hundredths. */
  q14: p => {
    let known = 0;
    p.p.forEach((v, i) => { if (i !== p.m) known += v; });
    const missing = 100 - known;
    let tail = 0;
    for (let i = p.k; i < p.p.length; i++) tail += i === p.m ? missing : p.p[i];
    return [missing / 100, tail / 100];
  },
  /* p in hundredths for X = 0, 1, 2, ...; D days. Mean from 100 imaginary days' worth of hundredths. */
  q15: p => {
    let tot = 0;
    p.p.forEach((v, x) => { tot += v * x; });
    const e = tot / 100;
    return [e, r(e * p.D, 6)];
  },
  /* Variance by the squared deviations from the mean, in hundredths. */
  q16: p => {
    const mean = p.p.reduce((s, v, x) => s + v * x, 0) / 100;
    const v = p.p.reduce((s, w, x) => s + w * (x - mean) * (x - mean), 0) / 100;
    return [r(v, 6), r(Math.sqrt(v), 2)];
  },
  /* 1000 tickets: list every ticket's prize, average it, subtract the price. Fair price = mean prize. */
  q17: p => {
    const prizes = [p.A];
    for (let i = 0; i < p.m2; i++) prizes.push(p.B);
    for (let i = 0; i < p.m3; i++) prizes.push(p.C);
    while (prizes.length < 1000) prizes.push(0);
    const mean = prizes.reduce((s, x) => s + x, 0) / 1000;
    return [r(mean - p.c, 6), r(mean, 6)];
  },
  /* Walk the pattern string, multiplying p for S and 1 − p for F. */
  q18: p => {
    let prob = 1;
    for (const ch of p.seq) prob *= ch === 'S' ? p.p : 1 - p.p;
    return [r(prob, 4)];
  },
  /* Enumerate every n-bit pattern with exactly k sprouts (bit set) and count by last seed. */
  q19: p => {
    let last1 = 0, last0 = 0, all = 0;
    for (let m = 0; m < (1 << p.n); m++) {
      let bits = 0;
      for (let i = 0; i < p.n; i++) if (m & (1 << i)) bits++;
      if (bits !== p.k) continue;
      all++;
      if (m & (1 << (p.n - 1))) last1++; else last0++;
    }
    return [last1, last0, all];
  },
  /* Sum the probabilities of every pattern of n seeds with exactly k sprouts. */
  q20: p => {
    let tot = 0;
    for (let m = 0; m < (1 << p.n); m++) {
      let bits = 0, pr = 1;
      for (let i = 0; i < p.n; i++) { const s = (m >> i) & 1; bits += s; pr *= s ? p.p : 1 - p.p; }
      if (bits === p.k) tot += pr;
    }
    return [r(tot, 4)];
  },
});
})();
