/* Independent oracles for Discrete mathematics learn missions, file a: q01–q10 (game/realms/disc/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  /* Sets by membership tests: |A| counts the distinct codes of the list; |B| walks every integer from a to b and
     keeps those divisible by k. */
  q01: p => {
    const seen = [];
    for (const x of p.list) if (!seen.includes(x)) seen.push(x);
    let nb = 0;
    for (let x = p.a; x <= p.b; x++) if (x % p.k === 0) nb++;
    return [seen.length, nb];
  },
  /* A ⊆ B by element-by-element membership (1 or 0); then the crates of B that do not appear on list A. */
  q02: p => {
    const sub = p.A.every(x => p.B.includes(x)) ? 1 : 0;
    return [sub, p.B.filter(x => !p.A.includes(x)).length];
  },
  /* Pool the two lists, then count each distinct number once; the shared crates are those in both lists. */
  q03: p => {
    const all = new Set([...p.A, ...p.B]);
    return [all.size, p.A.filter(x => p.B.includes(x)).length];
  },
  /* Number each of the U crates 1..U and give crate i the labels it would have: the first AB crates are both, the
     next A − AB fragile only, the next B − AB heavy only, and the rest neither. Then count each kind. */
  q04: p => {
    let neither = 0, fragileOnly = 0;
    for (let i = 0; i < p.U; i++) {
      const f = i < p.A, h = i < p.AB || (i >= p.A && i < p.A + p.B - p.AB);
      if (!f && !h) neither++;
      if (f && !h) fragileOnly++;
    }
    return [neither, fragileOnly];
  },
  /* Rebuild the prompt's totals from the eight regions, then use inclusion–exclusion on the totals alone:
     |F ∪ C ∪ H| = F + C + H − (pairs) + triple; exactly one = F + C + H − 2(pairs) + 3(triple). */
  q05: p => {
    const F = p.oF + p.FC + p.FH + p.FCH, C = p.oC + p.FC + p.CH + p.FCH, H = p.oH + p.FH + p.CH + p.FCH;
    const fc = p.FC + p.FCH, fh = p.FH + p.FCH, ch = p.CH + p.FCH, t = p.FCH;
    const U = p.oF + p.oC + p.oH + p.FC + p.FH + p.CH + p.FCH + p.none;
    const union = F + C + H - fc - fh - ch + t;
    return [F + C + H - 2 * (fc + fh + ch) + 3 * t, U - union];
  },
  /* List every ordered pair (a, b) and test it. */
  q06: p => {
    let n = 0, hit = 0;
    for (const a of p.A) for (const b of p.B) { n++; if (a + b === p.T) hit++; }
    return [n, hit];
  },
  /* Read the table: the image of x is f[x − 1]; the range is the set of distinct images. */
  q07: p => [p.f[p.a - 1], p.f[p.b - 1], new Set(p.f).size],
  /* Compare every pair of crates for a clash; count the tags 1..k that no crate received. */
  q08: p => {
    let clash = false;
    for (let i = 0; i < p.f.length; i++) for (let j = i + 1; j < p.f.length; j++) if (p.f[i] === p.f[j]) clash = true;
    let unused = 0;
    for (let t = 1; t <= p.k; t++) if (!p.f.includes(t)) unused++;
    return [clash ? 0 : 1, unused];
  },
  /* Parts: filters + valves + seals (disjoint). Hoses: label every hose and count those rated cold or heat, the
     f hoses rated for both being the first f of each group. */
  q09: p => {
    const hoses = [];
    for (let i = 0; i < p.d; i++) hoses.push({ cold: true, heat: i < p.f });
    for (let i = 0; i < p.e - p.f; i++) hoses.push({ cold: false, heat: true });
    return [p.a + p.b + p.c, hoses.filter(h => h.cold || h.heat).length];
  },
  /* Enumerate every code: a letter index and two digits. Rules: 0 first digit not 0 and digits differ; 1 last digit
     even and digits differ; 2 first digit odd and last digit not 0; 3 neither digit 0 and digits differ. */
  q10: p => {
    let all = 0, ok = 0;
    for (let l = 0; l < p.L; l++) for (let d1 = 0; d1 <= 9; d1++) for (let d2 = 0; d2 <= 9; d2++) {
      all++;
      const good = [
        d1 !== 0 && d1 !== d2,
        d2 % 2 === 0 && d1 !== d2,
        d1 % 2 === 1 && d2 !== 0,
        d1 !== 0 && d2 !== 0 && d1 !== d2
      ][p.rule];
      if (good) ok++;
    }
    return [all, ok];
  }
});
})();
