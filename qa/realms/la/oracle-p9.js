/* Independent oracles for linear algebra practice missions, file 9 of 14: q41–q45 (game/realms/la/practice-9.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };

/* Cheapest split of `total` between two squared costs a·x² and b·y², by exhaustive search (no formula for the minimiser).
   Every candidate x is a multiple of 1/(a+b), which is fine enough to hit the exact minimum of this parabola; the cost
   is compared in whole numbers (cost × (a+b)²). Returns [x, y, least cost]; NaN if the minimum is not unique. */
const cheapestSplit = (a, b, total) => {
  const n = a + b;
  let best = Infinity, at = [], i;
  for (i = 0; i <= total * n; i++) {
    const j = total * n - i, cost = a * i * i + b * j * j;
    if (cost < best) { best = cost; at = [i]; } else if (cost === best) at.push(i);
  }
  if (at.length !== 1) return [NaN, NaN, NaN];
  const x = at[0] / n, y = total - x;
  return [x, y, a * x * x + b * y * y];
};

/* Fuse weighted readings without the weighted-mean formula: write each reading down once per unit of weight, then take
   the plain mean of that long list. The weighted squared error is the plain squared error of the long list. Checked:
   the weighted pulls w·(y − c) must cancel. */
const fuse = (y, w) => {
  const list = [];
  y.forEach((v, i) => { for (let k = 0; k < w[i]; k++) list.push(v); });
  const c = list.reduce((s, v) => s + v, 0) / list.length;
  const err = list.reduce((s, v) => s + (v - c) * (v - c), 0);
  const pull = y.reduce((s, v, i) => s + w[i] * (v - c), 0);
  return Math.abs(pull) < 1e-9 ? [c, err] : [NaN, NaN];
};

/* 3×3 determinant by cofactors along the first row. */
const det3 = M =>
    M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
  - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
  + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
/* Solve M·v = b by Cramer's rule (no row reduction), then check by putting the solution back into every equation. */
const cramer3 = (M, b) => {
  const D = det3(M);
  if (D === 0) return [NaN, NaN, NaN];
  const v = [0, 1, 2].map(col => det3(M.map((row, i) => row.map((e, j) => (j === col ? b[i] : e)))) / D);
  const ok = M.every((row, i) => Math.abs(row[0] * v[0] + row[1] * v[1] + row[2] * v[2] - b[i]) < 1e-9);
  return ok ? v : [NaN, NaN, NaN];
};

/* PA = LU for a 2×2 matrix after swapping its rows, without elimination: U11 and U12 are the new top row, U22 is
   det(PA) ÷ U11, and L21 is found from "L21 × U11 = the entry below". Checked by multiplying L·U back out.
   Returns { l, u11, u12, u22 } or null. */
const swappedLU = m => {
  const top = [m[2], m[3]], low = [m[0], m[1]];
  if (top[0] === 0) return null;
  const u11 = top[0], u12 = top[1];
  const u22 = (top[0] * low[1] - top[1] * low[0]) / u11;
  const l = low[0] / u11;
  const ok = Math.abs(l * u11 - low[0]) < 1e-9 && Math.abs(l * u12 + u22 - low[1]) < 1e-9;
  return ok ? { l: l, u11: u11, u12: u12, u22: u22 } : null;
};

Object.assign(window.ORACLE, {
  /* Cables: try every split of the current and keep the one that wastes least. */
  q41b: p => cheapestSplit(p.r[0], p.r[1], p.total),
  /* Depots: cheapest split by search; the saving is the equal-split bill minus the cheapest bill. */
  q41c: p => {
    const best = cheapestSplit(p.a, p.b, p.total), half = p.total / 2;
    return [best[0], best[1], p.a * half * half + p.b * half * half - best[2]];
  },
  /* Ship: step along the course in half-kilometre steps and keep the point nearest the lighthouse.
     Distances are compared in whole numbers (4 × squared distance). */
  q41d: p => {
    let best = Infinity, at = [];
    for (let i = -120; i <= 120; i++) {           // x = i/2
      const j = 2 * p.c - i;                      // y = j/2, so x + y = c
      const d4 = (i - 2 * p.p) * (i - 2 * p.p) + (j - 2 * p.q) * (j - 2 * p.q);
      if (d4 < best) { best = d4; at = [i]; } else if (d4 === best) at.push(i);
    }
    if (at.length !== 1 || Math.abs(at[0]) === 120) return [NaN, NaN, NaN];
    return [at[0] / 2, (2 * p.c - at[0]) / 2, best / 4];
  },

  /* Scales: each reading written once per unit of weight, then a plain mean and a plain squared error. */
  q42b: p => fuse(p.y, p.w),
  /* Polls: fused value from the long list; the gap is measured from the plain average. */
  q42c: p => { const c = fuse(p.y, p.w)[0]; return [c, Math.abs((p.y[0] + p.y[1]) / 2 - c)]; },
  /* Thermometers: fuse the first two, then all three; the error is taken around the three-reading value. */
  q42d: p => {
    const two = fuse(p.y.slice(0, 2), p.w.slice(0, 2)), three = fuse(p.y, p.w);
    return [two[0], three[0], three[1]];
  },

  /* Tickets: add entry by entry, then read the total film by film (column by column). */
  q43b: p => {
    const out = [];
    for (let film = 0; film < 3; film++) for (let cinema = 0; cinema < 2; cinema++) out.push(p.S[cinema][film] + p.T[cinema][film]);
    return out;
  },
  /* Stock: start from the opening stock, add the delivery once per arrival, take the sales away. */
  q43c: p => {
    const out = [];
    for (let shop = 0; shop < 2; shop++) for (let item = 0; item < 2; item++) {
      let n = p.S[shop][item];
      for (let k = 0; k < p.k; k++) n += p.D[shop][item];
      n -= p.T[shop][item];
      out.push(n);
    }
    return out;
  },
  /* Kitchen: cook the orders one portion at a time and count the pieces used. */
  q43d: p => {
    const used = [0, 0, 0];
    p.o.forEach((portions, dish) => { for (let n = 0; n < portions; n++) for (let g = 0; g < 3; g++) used[g] += p.A[dish][g]; });
    return used;
  },

  /* Receipts: Cramer's rule with cofactor determinants, solution put back into the three receipts. */
  q44b: p => cramer3(p.A, p.b),
  /* Ferry: the three facts as equations in x, y, z, solved by Cramer's rule and checked by substitution. */
  q44c: p => cramer3([[1, 1, 1], [0, 1, -1], p.L.slice()], [p.T, p.D, p.M]),
  /* Fertiliser: one equation per nutrient, so the blends are the columns; Cramer's rule, checked by mixing the bags. */
  q44d: p => {
    const M = [0, 1, 2].map(nutrient => p.blends.map(blend => blend[nutrient]));
    const v = cramer3(M, p.need);
    const mixed = [0, 1, 2].map(n => v[0] * p.blends[0][n] + v[1] * p.blends[1][n] + v[2] * p.blends[2][n]);
    return mixed.every((x, n) => Math.abs(x - p.need[n]) < 1e-9) ? v : [NaN, NaN, NaN];
  },

  /* Circuit: PA = LU from the determinant, checked by multiplying L·U. */
  q45b: p => { const f = swappedLU(p.m); return f ? [f.l, f.u11, f.u12, f.u22] : [NaN, NaN, NaN, NaN]; },
  /* Café: factors from the swapped count matrix; the prices by searching whole and half dollars that fit both receipts. */
  q45c: p => {
    const f = swappedLU([0, p.b, p.c, p.d]);
    const fits = [];
    for (let i = 0; i <= 200; i++) for (let j = 0; j <= 200; j++)   // x = i/2, y = j/2
      if (p.b * j === 2 * p.r[0] && p.c * i + p.d * j === 2 * p.r[1]) fits.push([i / 2, j / 2]);
    if (!f || fits.length !== 1) return [NaN, NaN, NaN, NaN];
    return [f.l + 0, f.u22, fits[0][0], fits[0][1]];
  },
  /* Drawing program: factors after the swap; det A straight from the 2×2 rule on the unswapped matrix,
     and it must be minus the product of U's diagonal. */
  q45d: p => {
    const f = swappedLU(p.m), det = p.m[0] * p.m[3] - p.m[1] * p.m[2];
    if (!f) return [NaN, NaN, NaN, NaN];
    const product = f.u11 * f.u22;
    return Math.abs(product + det) < 1e-9 ? [f.l, f.u22, product, det] : [NaN, NaN, NaN, NaN];
  },
});
})();
