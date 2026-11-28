/* Independent oracles for Abstract algebra: patterns of moves learn missions, file c: q21–q30 (game/realms/abstract/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* The subgroup ⟨d⟩ of Zₘ by adding d again and again until the running total returns to 0. */
const generated = (m, d) => { const el = [0]; let x = d % m; while (x !== 0) { el.push(x); x = (x + d) % m; } return el; };
/* Order of the state (x, y) in Zₐ × Zᵦ by adding it to itself until it returns to (0, 0). */
const pairOrder = (a, b, x, y) => { let n = 1, u = x % a, v = y % b; while (u !== 0 || v !== 0) { u = (u + x) % a; v = (v + y) % b; n++; } return n; };
Object.assign(window.ORACLE, {
  /* aᵏ mod m. φ(m) is counted straight from the definition. The power is then found by walking the powers a, a², …
     mod m until a value repeats (a is coprime to m, so the walk is a pure cycle), and indexing into the cycle. */
  q21: p => {
    let phi = 0;
    for (let x = 1; x < p.m; x++) if (gcd(x, p.m) === 1) phi++;
    const seen = new Map(), seq = []; let v = 1 % p.m;
    while (!seen.has(v)) { seen.set(v, seq.length); seq.push(v); v = (v * p.a) % p.m; }
    const start = seen.get(v), period = seq.length - start;
    const idx = p.k < start ? p.k : start + ((p.k - start) % period);
    return [phi, p.k % phi, seq[idx]];
  },
  /* Slots 1..5; s and t list where each move sends slots 1..5 in order. τ⁻¹(i) is found by searching for the slot τ
     sends to i. The second answer is a brute-force check of g h g⁻¹ ∈ H over every g of the group. c is only an index
     into the prompt's subgroup texts: 0 = swap of slots 1 and 2, 1 = swap of 1 and 3, 2 = swap of 2 and 3, 3 = the three
     turns of S₃, 4 = ⟨d⟩ in the dial group Zₘ (the first five are in S₃, the last in Zₘ). */
  q22: p => {
    let back = null;
    for (let y = 1; y <= 5; y++) if (p.t[y - 1] === p.i) back = y;
    const first = p.t[p.s[back - 1] - 1];
    let normal;
    if (p.c === 4) {
      const H = new Set(generated(p.m, p.d));
      normal = 1;
      for (let g = 0; g < p.m; g++) for (const h of H) if (!H.has(((g + h - g) % p.m + p.m) % p.m)) normal = 0;
    } else {
      const perms = [];
      for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) for (let c = 1; c <= 3; c++) if (a !== b && b !== c && a !== c) perms.push([a, b, c]);
      const key = q => q.join('');
      const swap = (x, y) => [1, 2, 3].map(z => z === x ? y : z === y ? x : z);
      const sets = [[[1, 2, 3], swap(1, 2)], [[1, 2, 3], swap(1, 3)], [[1, 2, 3], swap(2, 3)], [[1, 2, 3], [2, 3, 1], [3, 1, 2]]];
      const H = new Set(sets[p.c].map(key));
      normal = 1;
      for (const g of perms) {
        const ginv = [0, 0, 0]; g.forEach((v, i) => { ginv[v - 1] = i + 1; });
        for (const h of sets[p.c]) {
          const conj = [1, 2, 3].map(z => g[h[ginv[z - 1] - 1] - 1]);
          if (!H.has(key(conj))) normal = 0;
        }
      }
    }
    return [first, normal];
  },
  /* Zₘ, subgroup made by adding a repeatedly; cosets b + H listed outright, smallest element of the one holding b. */
  q23: p => {
    const H = generated(p.m, p.a);
    const coset = H.map(h => (h + p.b) % p.m);
    return [H.length, p.m / H.length, Math.min(...coset)];
  },
  /* φ(x) = k x mod t on Zₘ. φ(a), φ(b) and φ of the Zₘ sum are read straight off the rule. Well defined is tested by
     trying every reading x from 0 to m − 1 against x + m. */
  q24: p => {
    const f = x => (p.k * x) % p.t;
    let ok = 1;
    for (let x = 0; x < p.m; x++) if (f(x) !== f(x + p.m)) ok = 0;
    return [f(p.a), f(p.b), f((p.a + p.b) % p.m), ok];
  },
  /* φ(x) = k x mod m on Zₘ: kernel and image counted by running through every reading. */
  q25: p => {
    let ker = 0; const img = new Set();
    for (let x = 0; x < p.m; x++) { const y = (p.k * x) % p.m; if (y === 0) ker++; img.add(y); }
    return [ker, img.size];
  },
  /* Zₐ × Zᵦ: states counted, every state's order found by repeated addition, and cyclic (≅ Zₐᵦ) iff some state has
     order a·b. */
  q26: p => {
    let best = 0;
    for (let x = 0; x < p.a; x++) for (let y = 0; y < p.b; y++) best = Math.max(best, pairOrder(p.a, p.b, x, y));
    return [p.a * p.b, best, best === p.a * p.b ? 1 : 0];
  },
  /* Order of (x, y) by repeated addition; w found by searching the readings 0..ab − 1 for the one with both remainders. */
  q27: p => {
    let w = -1;
    for (let r = 0; r < p.a * p.b && w < 0; r++) if (r % p.a === p.x % p.a && r % p.b === p.y % p.b) w = r;
    return [pairOrder(p.a, p.b, p.x, p.y), w];
  },
  /* H = ⟨d⟩ in Zₘ. Cosets are counted by sorting readings into batches; the order of x + H is the smallest k ≥ 1 with k x in H. */
  q28: p => {
    const H = new Set(generated(p.m, p.d));
    const cosets = new Set();
    for (let r = 0; r < p.m; r++) cosets.add(Math.min(...[...H].map(h => (h + r) % p.m)));
    let k = 1;
    while (!H.has((k * p.x) % p.m)) k++;
    return [cosets.size, k];
  },
  /* φ(x) = k x mod M on Z_N: kernel and image counted over every reading; the pair order by repeated addition in
     Zₚ × Z_q. */
  q29: p => {
    let ker = 0; const img = new Set();
    for (let x = 0; x < p.N; x++) { const y = (p.k * x) % p.M; if (y === 0) ker++; img.add(y); }
    return [ker, img.size, pairOrder(p.p, p.q, p.x, p.y)];
  },
  /* Rotate the ring one slot at a time n times, listing the colourings reached; the orbit is the distinct ones and
     the turns that leave it unchanged are those that return the original. */
  q30: p => {
    const n = p.pat.length, orbit = new Set(); let stab = 0, cur = p.pat;
    for (let r = 0; r < n; r++) { orbit.add(cur); if (cur === p.pat) stab++; cur = cur.slice(1) + cur[0]; }
    return [orbit.size, stab];
  }
});
})();
