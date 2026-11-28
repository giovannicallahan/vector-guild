/* Independent oracles for Abstract algebra: patterns of moves learn missions, file d: q31–q40 (game/realms/abstract/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const md = (a, n) => ((a % n) + n) % n;
// partitions of n by brute-force enumeration (count of abelian groups of order p^n)
function partCount(n, max) { if (n === 0) return 1; let c = 0; for (let k = Math.min(n, max); k >= 1; k--) c += partCount(n - k, k); return c; }
function factor(N) { const f = []; for (let q = 2; q <= N; q++) { let e = 0; while (N % q === 0) { N /= q; e++; } if (e) f.push([q, e]); } return f; }
// count of integers 1..n coprime to n, by search
const phiSearch = n => { let c = 0; for (let i = 1; i <= n; i++) if (gcd(i, n) === 1) c++; return c; };

// ---- q31: build the real rotation group from signed permutation matrices, then count by orbit and by search.
function solidGroup(vertices) {
  const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const par = [0, 1, 1, 0, 0, 1];
  const key = v => v.map(x => Math.round(x * 6)).join(',');
  const vs = new Set(vertices.map(key));
  const G = [];
  perms.forEach((pm, pi) => { for (let s = 0; s < 8; s++) {
    const sg = [s & 1 ? -1 : 1, s & 2 ? -1 : 1, s & 4 ? -1 : 1];
    const det = (par[pi] ? -1 : 1) * sg[0] * sg[1] * sg[2];
    if (det !== 1) continue;
    const f = v => [sg[0] * v[pm[0]], sg[1] * v[pm[1]], sg[2] * v[pm[2]]];
    if (vertices.every(v => vs.has(key(f(v))))) G.push(f);
  } });
  return { G, key };
}
function features(kind) {
  const cube = []; for (let s = 0; s < 8; s++) cube.push([s & 1 ? -1 : 1, s & 2 ? -1 : 1, s & 4 ? -1 : 1]);
  const oct = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const tet = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
  const d2 = (a, b) => a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0);
  const mid = pts => [0,1,2].map(i => pts.reduce((s, v) => s + v[i], 0) / pts.length);
  const pairs = (V, d) => { const r = []; for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) if (Math.abs(d2(V[i], V[j]) - d) < 1e-9) r.push([V[i], V[j]]); return r; };
  const triples = (V, d) => { const r = []; for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) for (let k = j + 1; k < V.length; k++) if ([[i,j],[j,k],[i,k]].every(([a, b]) => Math.abs(d2(V[a], V[b]) - d) < 1e-9)) r.push([V[i], V[j], V[k]]); return r; };
  if (kind.startsWith('cube')) {
    const faces = []; for (let a = 0; a < 3; a++) for (const s of [1, -1]) faces.push(mid(cube.filter(v => v[a] === s)));
    return { V: cube, C: cube, E: pairs(cube, 4).map(mid), F: faces };
  }
  if (kind.startsWith('oct')) return { V: oct, C: oct, E: pairs(oct, 2).map(mid), F: triples(oct, 2).map(mid) };
  return { V: tet, C: tet, E: pairs(tet, 8).map(mid), F: triples(tet, 8).map(mid) };
}
function q31(p) {
  const k = p.kind, what = k.slice(-1), m = p.m;
  if (k.startsWith('poly')) {
    // dihedral moves on corners 0..m-1: turns i -> i+r, flips i -> r-i. An edge is the pair {i, i+1}.
    const moves = []; for (let r = 0; r < m; r++) { moves.push(i => md(i + r, m)); moves.push(i => md(r - i, m)); }
    const feat = what === 'C' ? [[0]] : [[0, 1]];
    const image = (mv, f) => f.map(mv).sort((a, b) => a - b).join(',');
    const base = feat[0].join(',');
    const orbit = new Set(moves.map(mv => image(mv, feat[0])));
    const stab = moves.filter(mv => image(mv, feat[0]) === feat[0].slice().sort((a, b) => a - b).join(',')).length;
    return [orbit.size, stab];
  }
  const { G, key } = solidGroup(features(k).V);
  const pts = features(k)[what];
  const x = pts[0];
  const orbit = new Set(G.map(g => key(g(x))));
  const stab = G.filter(g => key(g(x)) === key(x)).length;
  return [orbit.size, stab];
}

// ---- q32: enumerate every permutation of m symbols and count those with the cycle lengths.
function q32(p) {
  const m = p.m;
  const want = p.type.concat(Array(m - p.type.reduce((a, b) => a + b, 0)).fill(1)).sort((a, b) => a - b).join(',');
  let count = 0;
  const perm = Array(m).fill(0), used = Array(m).fill(false);
  function typeOf() {
    const seen = Array(m).fill(false), lens = [];
    for (let i = 0; i < m; i++) if (!seen[i]) { let l = 0, j = i; while (!seen[j]) { seen[j] = true; j = perm[j]; l++; } lens.push(l); }
    return lens.sort((a, b) => a - b);
  }
  (function rec(i) {
    if (i === m) { if (typeOf().join(',') === want) count++; return; }
    for (let v = 0; v < m; v++) if (!used[v]) { used[v] = true; perm[i] = v; rec(i + 1); used[v] = false; }
  })(0);
  const ord = p.type.reduce((a, b) => lcm(a, b), 1);
  return [count, ord];
}

// ---- q33: Burnside by actually colouring: count colourings fixed by each turn, by direct enumeration.
function q33(p) {
  const { m, k, r } = p;
  const total = Math.pow(k, m);
  const rot = (c, s) => { let x = c, d = []; for (let i = 0; i < m; i++) { d.push(x % k); x = Math.floor(x / k); } const e = d.map((_, i) => d[(i + s) % m]); return e.reduce((a, v, i) => a + v * Math.pow(k, i), 0); };
  let fixedR = 0; const fixedAll = Array(m).fill(0);
  for (let c = 0; c < total; c++) for (let s = 0; s < m; s++) if (rot(c, s) === c) fixedAll[s]++;
  fixedR = fixedAll[r % m];
  // distinct designs = number of orbits: count by marking
  const seen = new Uint8Array(total); let orbits = 0;
  for (let c = 0; c < total; c++) if (!seen[c]) { orbits++; for (let s = 0; s < m; s++) seen[rot(c, s)] = 1; }
  return [fixedR, orbits];
}

// ---- q34: factorise, then count abelian groups as products of partition counts; the first number is for the
// prime power with the largest exponent (ties: the smallest prime), as the prompt names "the part".
function q34(p) {
  const f = factor(p.N);
  let best = f[0]; for (const t of f) if (t[1] > best[1]) best = t;
  let all = 1; for (const [, e] of f) all *= partCount(e, e);
  return [partCount(best[1], best[1]), all];
}

// ---- q35: scan the ring.
function q35(p) {
  const N = p.N; let units = 0, zd = 0;
  for (let x = 1; x < N; x++) {
    let unit = false, zero = false;
    for (let y = 1; y < N; y++) { const pr = x * y % N; if (pr === 1) unit = true; if (pr === 0) zero = true; }
    if (unit) units++; else if (zero) zd++;
  }
  let b = 1; while ((p.a * b) % N !== 0) b++;
  return [units, zd, b];
}

// ---- q36: search the field.
function q36(p) {
  let inv = 0, x = -1;
  for (let t = 1; t < p.p; t++) if ((p.a * t) % p.p === 1) inv = t;
  for (let t = 0; t < p.p; t++) if ((p.a * t + p.b) % p.p === p.c) x = t;
  return [inv, x];
}

// ---- q37: polynomial long division by x - a, and a search for roots. cs = coefficients after the leading x^len.
function q37(p) {
  const q = p.p, n = p.cs.length;
  let co = [1].concat(p.cs); // highest first
  co = co.map(c => md(c, q));
  const out = [];
  let rem = co.slice();
  while (rem.length > 1) { const lead = rem[0]; rem[1] = md(rem[1] + lead * p.a, q); out.push(lead); rem = rem.slice(1); }
  let roots = 0;
  for (let r = 0; r < q; r++) { let v = 0; for (let i = 0; i <= n; i++) v += co[i] * Math.pow(r, n - i); if (md(v, q) === 0) roots++; }
  return [rem[0], roots];
}

// ---- q38: the smallest positive value of ax + by, found by searching x, y; 63-style membership by search.
function q38(p) {
  const { a, b, c } = p; let g = Infinity; const R = 400;
  const inI = new Set();
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) { const v = a * x + b * y; if (v > 0 && v < g) g = v; if (v === c) inI.add(1); }
  return [g, inI.has(1) ? 1 : 0];
}

// ---- q39: test every value for roots; count irreducible monic quadratics by listing them.
function q39(p) {
  const hasRoot = (b, c) => { for (let r = 0; r < p.p; r++) if ((r * r + b * r + c) % p.p === 0) return true; return false; };
  let n = 0; for (let b = 0; b < p.p; b++) for (let c = 0; c < p.p; c++) if (!hasRoot(b, c)) n++;
  return [hasRoot(p.b, p.c) ? 0 : 1, n];
}

// ---- q40: |GF(p^k)| = p^k; the multiplicative group is cyclic of order p^k - 1; generators are the powers coprime to it.
function q40(p) {
  const size = Math.pow(p.p, p.k);
  return [size, size - 1, phiSearch(size - 1)];
}

Object.assign(window.ORACLE, { q31, q32, q33, q34, q35, q36, q37, q38, q39, q40 });
})();
