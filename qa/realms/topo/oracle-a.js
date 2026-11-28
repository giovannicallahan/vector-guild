/* Independent oracles for Topology: shape without size learn missions, file a: q01–q10 (game/realms/topo/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const clean = x => Math.round(x * 1e9) / 1e9;
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const pc = n => { let c = 0; for (; n; n >>= 1) c += n & 1; return c; };
/* Bitmask sets: bit (i − 1) is node i (or dish i − 1 counted from a = 0), so mask 0 is ∅ (printed as ∅) and
   (1 << N) − 1 is the whole space. */
Object.assign(window.ORACLE, {
  /* P = (x1, y1), Q = (x2, y2). Euclidean (2 dp), taxicab and maximum distance, with the gaps found by walking along each axis. */
  q01: p => {
    const gap = (a, b) => { let n = 0, t = Math.min(a, b); while (t < Math.max(a, b)) { t++; n++; } return n; };
    const gx = gap(p.x1, p.x2), gy = gap(p.y1, p.y2);
    return [rd(Math.sqrt(gx * gx + gy * gy), 2), gx + gy, Math.max(gx, gy)];
  },
  /* Beacon (cx, cy). Count grid points in a window by testing each one: taxicab ≤ r and maximum ≤ s. */
  q02: p => {
    const W = Math.max(p.r, p.s) + 2; let t = 0, m = 0;
    for (let x = p.cx - W; x <= p.cx + W; x++) for (let y = p.cy - W; y <= p.cy + W; y++) {
      const dx = Math.abs(x - p.cx), dy = Math.abs(y - p.cy);
      if (dx + dy <= p.r) t++;
      if (Math.max(dx, dy) <= p.s) m++;
    }
    return [t, m];
  },
  /* d(x,y) = a, d(y,z) = b. Try every d(x,z) = t on a fine 0.01 km scale and keep those where the three lengths a, b, t can
     close a triangle (each at most the sum of the other two). Discrete metric: count consecutive stops that differ.
     (route is the list of station letters in order.) */
  q03: p => {
    let lo = null, hi = null;
    for (let i = 0; i <= 5000; i++) {
      const t = i / 100;
      if (t <= p.a + p.b + 1e-9 && p.a <= t + p.b + 1e-9 && p.b <= t + p.a + 1e-9) { if (lo === null) lo = t; hi = t; }
    }
    let moves = 0;
    for (let i = 1; i < p.route.length; i++) if (p.route[i] !== p.route[i - 1]) moves++;
    return [clean(lo), clean(hi), moves];
  },
  /* Interval (a, b) with sensor x; rectangle 0 < x < w, 0 < y < h with lamp (px, py). Bisection on the radius: a ball of
     radius r lies inside when its extreme points on each axis are inside the open region (or on its edge, as the open
     ball does not reach them). */
  q04: p => {
    const bis = ok => { let lo = 0, hi = 100; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (ok(m)) lo = m; else hi = m; } return lo; };
    const cable = bis(r => p.x - r >= p.a && p.x + r <= p.b);
    const pad = bis(r => p.px - r >= 0 && p.px + r <= p.w && p.py - r >= 0 && p.py + r <= p.h);
    return [rd(cable, 6), rd(pad, 6)];
  },
  /* S = a-b interval ∪ c-d interval ∪ {e} (e = 0 means no isolated point; ca..cd are 1 when that end is included).
     Test the end points and e by looking at S just left of, at, and just right of each of them. A point is in the closure
     if S meets every small ball round it, in the interior if the whole small ball is in S; boundary = closure but not interior. */
  q05: p => {
    const E = 1e-6;
    const inS = x => {
      const inI = (l, r, cl, cr) => (x > l && x < r) || (cl && Math.abs(x - l) < 1e-12) || (cr && Math.abs(x - r) < 1e-12);
      return inI(p.a, p.b, p.ca, p.cb) || inI(p.c, p.d, p.cc, p.cd) || (p.e > 0 && Math.abs(x - p.e) < 1e-12);
    };
    const cands = [p.a, p.b, p.c, p.d]; if (p.e > 0) cands.push(p.e);
    const uniq = [...new Set(cands)];
    let boundary = 0, open = 1, closed = 1;
    for (const t of uniq) {
      const here = inS(t), l = inS(t - E), r = inS(t + E);
      const closure = here || l || r, interior = here && l && r;
      const isB = closure && !interior;
      if (isB) boundary++;
      if (here && !interior) open = 0;       /* a member that is not interior */
      if (isB && !here) closed = 0;          /* a boundary point left out */
    }
    return [boundary, open, closed];
  },
  /* Part 1: intersection of three open intervals = (largest left end, smallest right end), found by testing a fine scale.
     Part 2: the family, by family number (an index into the printed families, as the text shows):
       0: every (−1÷k, m + 1÷k), k = 1, 2, 3, …      (infinite intersection)
       1: union of closed [1÷k, m − 1÷k], k = 2, 3, … (infinite union)
       2: every (−1÷k, m + 1÷k) for k = 1 to K       (finite intersection)
       3: union of open (1÷k, m), k = 1, 2, …        (infinite union)
       4: every (−1÷k, m), k = 1, 2, …               (infinite intersection)
     Each family is a nested sequence of intervals whose ends move monotonically; the combined set has a left and a right end,
     each of which is either reached by some single interval (then it takes that interval's bracket) or only approached
     in the limit (then, for an intersection, the limit point is inside; for a union, outside). Open means both ends excluded. */
  q06: p => {
    const pts = [p.a1, p.a2, p.a3]; let lo = -Infinity, hi = Infinity;
    for (let i = 0; i < 3; i++) { lo = Math.max(lo, pts[i]); hi = Math.min(hi, [p.b1, p.b2, p.b3][i]); }
    let leftIn, rightIn;
    const F = p.fam;
    if (F === 0) { leftIn = true; rightIn = true; }            /* ends −1/k and m+1/k only approach 0 and m: reached by the limit, intersection keeps them */
    else if (F === 1) { leftIn = false; rightIn = false; }     /* 1/k never reaches 0, m − 1/k never reaches m, union leaves them out */
    else if (F === 2) { leftIn = false; rightIn = false; }     /* finite intersection: the tightest interval (k = K) is open */
    else if (F === 3) { leftIn = false; rightIn = false; }     /* union of opens is open */
    else { leftIn = true; rightIn = false; }                   /* left limit 0 kept, right end m is every interval's own open end */
    return [lo, hi, (!leftIn && !rightIn) ? 1 : 0];
  },
  /* Masks in p.sets over N nodes (mask 0 = ∅). A topology needs ∅, the whole X, every union of two members and every
     intersection of two members in the list (finite unions by repeating the pairwise test). */
  q07: p => {
    const full = (1 << p.N) - 1, has = new Set(p.sets);
    let ok = has.has(0) && has.has(full);
    for (const a of p.sets) for (const b of p.sets) { if (!has.has(a | b) || !has.has(a & b)) ok = false; }
    let count = 0; for (let m = 0; m < (1 << p.m); m++) count++;
    return [ok ? 1 : 0, count];
  },
  /* Open sets = masks in p.sets; closed sets = complements. Both: a mask whose complement is also in the list.
     Closure of node p.p = intersection of every closed set containing it (start from X and intersect). */
  q08: p => {
    const full = (1 << p.N) - 1, has = new Set(p.sets);
    let both = 0; for (const s of p.sets) if (has.has(full ^ s)) both++;
    let cl = full; const bit = 1 << (p.p - 1);
    for (const s of p.sets) { const c = full ^ s; if (c & bit) cl &= c; }
    return [both, pc(cl)];
  },
  /* Open sets = all unions of subsets of the basis (including the empty union). Enumerate the 2^k choices. */
  q09: p => {
    const seen = new Set(); const k = p.basis.length;
    for (let pick = 0; pick < (1 << k); pick++) { let u = 0; for (let i = 0; i < k; i++) if (pick >> i & 1) u |= p.basis[i]; seen.add(u); }
    return [seen.size, seen.has(p.S) ? 1 : 0];
  },
  /* Masks: TX over X (NX nodes), TY over Y (NY dishes, dish index 0 = a). f[i] is the dish index (0 = a) that node i + 1 goes to.
     A map is continuous when the set of nodes sent into every open set of Y is open in X. Count over all NY^NX maps. */
  q10: p => {
    const hasX = new Set(p.TX);
    const cont = f => { for (const V of p.TY) { let pre = 0; for (let i = 0; i < p.NX; i++) if (V >> f[i] & 1) pre |= 1 << i; if (!hasX.has(pre)) return false; } return true; };
    let total = 0; const total_maps = Math.pow(p.NY, p.NX);
    for (let code = 0; code < total_maps; code++) { const f = []; let c = code; for (let i = 0; i < p.NX; i++) { f.push(c % p.NY); c = Math.floor(c / p.NY); } if (cont(f)) total++; }
    return [cont(p.f) ? 1 : 0, total];
  },
});
})();
