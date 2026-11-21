/* Independent oracles for linear algebra practice missions, file 8 of 14: q36–q40 (game/realms/la/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Matrix times matrix and matrix times vector straight from the definition. */
const mul = (A, B) => A.map(row => B[0].map((_, j) => row.reduce((s, a, t) => s + a * B[t][j], 0)));
const apply = (A, v) => A.map(row => row.reduce((s, a, t) => s + a * v[t], 0));
const jordan = lam => [[lam, 1], [0, lam]];
/* Kronecker product built block by block: block (i, j) of the result is A[i][j] times the whole of B. */
const kron = (A, B) => {
  const out = [];
  A.forEach((arow, i) => B.forEach((brow, k) => {
    const row = [];
    arow.forEach(a => brow.forEach(b => row.push(a * b)));
    out[i * B.length + k] = row;
  }));
  return out;
};
/* Determinant by cofactor expansion along the first row. */
const det = M => M.length === 1 ? M[0][0]
  : M[0].reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * det(M.slice(1).map(r => r.filter((_, c) => c !== j))), 0);
/* Groups of a network by flood fill: start at an unvisited node, visit everything reachable, count one group. */
const groups = (n, edges) => {
  const seen = new Array(n + 1).fill(false);
  let count = 0;
  for (let start = 1; start <= n; start++) {
    if (seen[start]) continue;
    count++;
    const todo = [start]; seen[start] = true;
    while (todo.length) {
      const at = todo.pop();
      for (const [i, j] of edges) {
        const next = i === at ? j : j === at ? i : 0;
        if (next && !seen[next]) { seen[next] = true; todo.push(next); }
      }
    }
  }
  return count;
};
/* Laplacian as a full matrix: degrees on the diagonal, −1 for every link. */
const laplacian = (n, edges) => {
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [i, j] of edges) { L[i - 1][i - 1]++; L[j - 1][j - 1]++; L[i - 1][j - 1]--; L[j - 1][i - 1]--; }
  return L;
};
/* Rank by elimination with row swaps (entries stay small, so a loose zero test is safe). */
const rank = M0 => {
  const M = M0.map(r => r.slice()), rows = M.length, cols = M[0].length;
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1;
    for (let i = r; i < rows; i++) if (Math.abs(M[i][c]) > 1e-9) { piv = i; break; }
    if (piv < 0) continue;
    [M[r], M[piv]] = [M[piv], M[r]];
    for (let i = r + 1; i < rows; i++) { const f = M[i][c] / M[r][c]; for (let k = c; k < cols; k++) M[i][k] -= f * M[r][k]; }
    r++;
  }
  return r;
};
/* The energy f = ½ xᵀKx − Fᵀx evaluated term by term. */
const energy = (K, F, x) => {
  let quad = 0;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) quad += x[i] * K[i][j] * x[j];
  return quad / 2 - (F[0] * x[0] + F[1] * x[1]);
};
/* Lowest point of the energy on the whole-number grid 0..12, checked to be a true flat point (K x = F). */
const lowest = (K, F) => {
  let best = null;
  for (let x1 = 0; x1 <= 12; x1++) for (let x2 = 0; x2 <= 12; x2++) {
    const f = energy(K, F, [x1, x2]);
    if (!best || f < best.f) best = { x: [x1, x2], f };
  }
  const g = apply(K, best.x);
  return g[0] === F[0] && g[1] === F[1] ? best : { x: [NaN, NaN], f: NaN };
};

Object.assign(window.ORACLE, {
  /* Press the button k times: multiply by J over and over. */
  q36b: p => {
    let M = [[1, 0], [0, 1]];
    for (let i = 0; i < p.k; i++) M = mul(M, jordan(p.lam));
    return [M[0][0], M[0][1], M[1][0], M[1][1]];
  },
  /* Pump: run the cycle rule k times on the state itself (new stage 1 = lam × stage 1 + old stage 2). */
  q36c: p => {
    let [s1, s2] = p.x;
    for (let i = 0; i < p.k; i++) { const old2 = s2; s2 = p.lam * s2; s1 = p.lam * s1 + old2; }
    return [s1, s2];
  },
  /* Sensor: start from the end state the prompt prints and undo one hour at a time (the second number is only ever
     multiplied by lam; the first also received the old second number). */
  q36d: p => {
    let [first, second] = p.y;
    for (let hour = 0; hour < p.k; hour++) { second = second / p.lam; first = (first - second) / p.lam; }
    return [first, second];
  },
  /* Enlarged picture: build all 16 entries, read the asked row (p.row, counted from 1). */
  q37b: p => kron(p.A, p.B)[p.row - 1],
  /* Video wall: build the whole wall, count its rows and columns, read one pixel. */
  q37c: p => { const W = kron(p.A, p.B); return [W.length, W[0].length, W[p.r - 1][p.s - 1]]; },
  /* Eigenvalues as the whole numbers t with det(A⊗B − tI) = 0, found by search (cofactor determinant). */
  q37d: p => {
    const M = kron(p.A, p.B), found = [];
    for (let t = -40; t <= 40; t++) if (det(M.map((row, i) => row.map((x, j) => x - (i === j ? t : 0)))) === 0) found.push(t);
    return found.length === 4 ? found : [NaN, NaN, NaN, NaN];
  },
  /* Bikes: search for the whole split where the bikes leaving North equal the bikes arriving from South. */
  q38b: p => {
    for (let north = 0; north <= p.N; north++) if (p.a * north === p.b * (p.N - north)) return [north, p.N - north];
    return [NaN, NaN];
  },
  /* Weather: add up the two-day paths out of 100 (tenths × tenths). */
  q38c: p => {
    const dry = { dry: p.D, wet: 10 - p.D }, wet = { dry: p.W, wet: 10 - p.W };
    const dryDry = dry.dry * dry.dry + dry.wet * wet.dry, dryWet = dry.dry * dry.wet + dry.wet * wet.wet;
    return dryDry + dryWet === 100 ? [dryDry / 100, dryWet / 100] : [NaN, NaN];
  },
  /* Vans: search for the whole split where every night's moves cancel across each road. */
  q38d: p => {
    for (let w = 0; w <= p.N; w++) for (let c = 0; w + c <= p.N; c++) {
      const e = p.N - w - c;
      if (p.a * w === p.b * c && p.c * c === p.d * e) {
        const P = [[10 - p.a, p.b, 0], [p.a, 10 - p.b - p.c, p.d], [0, p.c, 10 - p.d]];
        const next = apply(P, [w, c, e]);
        return next.every((x, i) => x === 10 * [w, c, e][i]) ? [w, c, e] : [NaN, NaN, NaN];
      }
    }
    return [NaN, NaN, NaN];
  },
  /* Islands: count the ferries at each island; groups by flood fill. */
  q39b: p => {
    const deg = [0, 0, 0, 0];
    for (const [i, j] of p.edges) { deg[i - 1]++; deg[j - 1]++; }
    return deg.concat([groups(4, p.edges)]);
  },
  /* Rooms: every door adds the temperature gap to one room and takes it from the other. */
  q39c: p => {
    const out = [0, 0, 0, 0];
    for (const [i, j] of p.edges) { const gap = p.x[i - 1] - p.x[j - 1]; out[i - 1] += gap; out[j - 1] -= gap; }
    return out;
  },
  /* Sensors: groups by flood fill; rank by elimination on the Laplacian itself; nullity = N − rank. */
  q39d: p => {
    const r = rank(laplacian(p.N, p.edges));
    return [groups(p.N, p.edges), p.N - r, r];
  },
  /* Machines: lowest point by search on the whole-number grid, cost evaluated from the formula. */
  q40b: p => { const best = lowest([[p.q[0], 0], [0, p.q[1]]], p.b); return [best.x[0], best.x[1], best.f]; },
  /* Fans: lowest point by search; drop = cost now minus cost at the best settings, both from the formula. */
  q40c: p => {
    const Q = [[p.q[0], 0], [0, p.q[1]]], best = lowest(Q, p.b);
    return [best.x[0], best.x[1], energy(Q, p.b, p.cur) - best.f];
  },
  /* Springs: lowest point by search on the grid, checked against K x = F by substitution. */
  q40d: p => { const best = lowest(p.K, p.F); return [best.x[0], best.x[1], best.f]; }
});
})();
