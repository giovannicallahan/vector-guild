/* Independent oracles for Abstract algebra: patterns of moves learn missions, file b: q11–q20 (game/realms/abstract/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* helpers: a permutation list q holds the image of socket k at q[k-1]. */
const cyclesOf = q => {
  const seen = new Set(), out = [];
  for (let s = 1; s <= q.length; s++) {
    if (seen.has(s)) continue;
    const c = []; let x = s;
    while (!seen.has(x)) { seen.add(x); c.push(x); x = q[x - 1]; }
    out.push(c);
  }
  return out;
};
Object.assign(window.ORACLE, {
  /* U(m): the stored number is multiplied by a each beat; count beats to the first return to 1, then search
     the whole group for the number b with a·b ≡ 1 (mod m). */
  q11: p => {
    let x = 1, k = 0;
    do { x = (x * p.a) % p.m; k++; } while (x !== 1 && k < 10000);
    let inv = null;
    for (let b = 1; b < p.m; b++) if ((p.a * b) % p.m === 1) { inv = b; break; }
    return [k, inv];
  },
  /* σ and τ are image lists (image of socket k at index k−1). Track one bolt through τ, then through σ. */
  q12: p => {
    const run = i => { let pos = i; pos = p.t[pos - 1]; pos = p.s[pos - 1]; return pos; };
    return [run(p.i), run(p.j)];
  },
  /* p is an image list. Number of cycles from tracing every socket; order by repeating the move until every
     bolt is home (not by the lcm of cycle lengths). */
  q13: p => {
    const n = p.p.length;
    const cyc = cyclesOf(p.p).length;
    let cur = p.p.slice(), k = 1;
    while (!cur.every((v, i) => v === i + 1) && k < 100000) { cur = cur.map(v => p.p[v - 1]); k++; }
    return [cyc, k];
  },
  /* Transposition count n − (number of cycles) by cycle lengths; sign taken from the parity of the number of
     out-of-order pairs (inversions) of the image list, an independent route. */
  q14: p => {
    const n = p.p.length;
    let tr = 0;
    for (const c of cyclesOf(p.p)) tr += c.length - 1;
    let inv = 0;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (p.p[a] > p.p[b]) inv++;
    return [tr, inv % 2 === 0 ? 1 : -1];
  },
  /* N sockets, w of them welded, so N - w loose bolts move. List every arrangement of the loose sockets,
     count all, the even ones (by inversions) and those that move exactly two bolts. */
  q15: p => {
    const w = p.N - p.w;
    let all = 0, even = 0, trans = 0;
    const perm = [], used = new Array(w).fill(false);
    const rec = () => {
      if (perm.length === w) {
        all++;
        let inv = 0, moved = 0;
        for (let a = 0; a < w; a++) { if (perm[a] !== a) moved++; for (let b = a + 1; b < w; b++) if (perm[a] > perm[b]) inv++; }
        if (inv % 2 === 0) even++;
        if (moved === 2) trans++;
        return;
      }
      for (let v = 0; v < w; v++) if (!used[v]) { used[v] = true; perm.push(v); rec(); perm.pop(); used[v] = false; }
    };
    rec();
    return [all, even, trans];
  },
  /* D_m on marks 0..m−1: 2m symmetries (m turns, m flips). The corner at mark v is turned by r, then flipped. */
  q16: p => {
    let pos = (p.v + p.r) % p.m;
    pos = (p.m - pos) % p.m;
    return [2 * p.m, pos];
  },
  /* p.type is a letter string of the routine in order (F flip, T turn); the turns are p.r then p.s, in the order
     they occur. Every corner is moved as a mark; the determinant is (−1)^(number of flips); the order is found by
     repeating the routine on all marks until each is home. */
  q17: p => {
    const m = p.m, turns = [p.r, p.s];
    const steps = [];
    let ti = 0;
    for (const ch of p.type) steps.push(ch === 'F' ? { f: true } : { t: turns[ti++] });
    const move = x => { for (const st of steps) x = st.f ? (m - x) % m : (x + st.t) % m; return x; };
    const cur = Array.from({ length: m }, (_, i) => i);
    let k = 0, now = cur.slice();
    do { now = now.map(move); k++; } while (!now.every((v, i) => v === i) && k < 10000);
    const flips = steps.filter(s => s.f).length;
    return [move(p.v), flips % 2 === 0 ? 1 : -1, k];
  },
  /* Z_m: build the subgroup ⟨a⟩ by adding a repeatedly until 0 returns (its size). The subgroups of Z_m are one
     per divisor of m, counted by trying every d from 1 to m. (keep only picks which text, if anything.) */
  q18: p => {
    let n = 0;
    for (let d = 1; d <= p.m; d++) if (p.m % d === 0) n++;
    const seen = new Set(); let x = 0;
    do { seen.add(x); x = (x + p.a) % p.m; } while (x !== 0);
    return [n, seen.size];
  },
  /* Z_m, H = ⟨d⟩ built by repeated addition. Form every coset z + H as a set, count the different ones, and take
     the smallest label in the coset a + H. */
  q19: p => {
    const H = []; let x = 0;
    do { H.push(x); x = (x + p.d) % p.m; } while (x !== 0);
    const key = z => H.map(h => (z + h) % p.m).sort((u, v) => u - v);
    const kinds = new Set();
    for (let z = 0; z < p.m; z++) kinds.add(key(z).join(','));
    return [kinds.size, key(p.a)[0]];
  },
  /* |G| = N, |H| = M. The index is the number of cosets, N ÷ M by splitting N moves into piles of M. Lagrange: a
     subgroup of size k is possible only when k divides N, so 1 if N has k as a divisor, else 0. */
  q20: p => {
    let piles = 0;
    for (let left = p.N; left > 0; left -= p.M) piles++;
    let ok = 0;
    for (let q = 1; q <= p.N; q++) if (q * p.k === p.N) ok = 1;
    return [piles, ok];
  },
});
})();
