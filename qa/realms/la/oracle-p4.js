/* Independent oracles for linear algebra practice missions, file 4 of 14: q16–q20 (game/realms/la/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const len = v => Math.sqrt(dot(v, v));
/* Remove float dust (0.6000000001 → 0.6, −1e−17 → 0). */
const tidy = x => { const r = Math.round(x * 1e9) / 1e9; return r === 0 ? 0 : r; };
/* Determinant by cofactor expansion along the first row. */
const det = M => M.length === 1 ? M[0][0]
  : M[0].reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * det(M.slice(1).map(r => r.filter((_, c) => c !== j))), 0);
/* All ways to choose k indices out of 0..n−1. */
const choose = (n, k, from = 0) => k === 0 ? [[]]
  : Array.from({ length: n - from }, (_, i) => from + i).flatMap(i => choose(n, k - 1, i + 1).map(rest => [i, ...rest]));
/* Rank from the definition by minors: the size of the largest square sub-table with a non-zero determinant. */
const rank = M => {
  for (let k = Math.min(M.length, M[0].length); k >= 1; k--)
    for (const rows of choose(M.length, k)) for (const cols of choose(M[0].length, k))
      if (Math.abs(det(rows.map(r => cols.map(c => M[r][c])))) > 1e-9) return k;
  return 0;
};
/* Square system A x = b by Cramer's rule (each unknown is a ratio of two cofactor determinants). */
const cramer = (A, b) => { const D = det(A); return A.map((_, j) => det(A.map((row, i) => row.map((x, c) => c === j ? b[i] : x))) / D); };
/* Cross product, component by component. */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/* Nearest point of the line through the origin along u to the point v, found by shrinking an interval around the
   multiple of u with the smallest distance (no projection formula). */
const nearestOnLine = (u, v) => {
  const d2 = t => { const g = v.map((x, i) => x - t * u[i]); return dot(g, g); };
  let lo = -50, hi = 50;
  for (let i = 0; i < 200; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (d2(a) < d2(b)) hi = b; else lo = a; }
  /* The search is flat near its lowest point, so snap the multiple to the nearest fraction with a small denominator
     and keep the snap only if the leftover is then square to u. */
  const t = (lo + hi) / 2; let best = t;
  for (let den = 1; den <= 60; den++) { const c = Math.round(t * den) / den; if (Math.abs(c - t) < 1e-5 && Math.abs(dot(v.map((x, i) => x - c * u[i]), u)) < 1e-9) { best = c; break; } }
  return u.map(x => best * x);
};
/* Sum of squared gaps between readings and a fitted list. */
const sse = (r, fit) => r.reduce((s, x, i) => s + (x - fit[i]) * (x - fit[i]), 0);
/* Lowest point of a one-number fit, by a grid search in hundredths between lo and hi. */
const bestOnGrid = (lo, hi, cost) => {
  let best = NaN, bestCost = Infinity;
  for (let k = Math.round(lo * 100); k <= Math.round(hi * 100); k++) { const c = cost(k / 100); if (c < bestCost - 1e-12) { bestCost = c; best = k / 100; } }
  return best;
};

Object.assign(window.ORACLE, {
  /* Budget: the two rules plus "x = a" as a 3 × 3 system, solved by Cramer's rule; dimension = unknowns − rank (by minors). */
  q16b: p => {
    const rules = [[1, 1, 1], [-p.k, 1, 0]];
    const s = cramer([...rules, [1, 0, 0]], [0, 0, p.a]);
    return [tidy(s[1]), tidy(s[2]), 3 - rank(rules)];
  },
  /* Feed mix: every written rule is listed (the third, when the prompt has one, is the weight rule in other units).
     Weight and protein rules plus "z = given" by Cramer's rule, then checked by substitution into every written rule;
     dimension = unknowns − rank of all the written rules (by minors). */
  q16c: p => {
    const q = p.p + p.d, r = p.p + p.d * p.m;
    const rules = [[1, 1, 1], [p.p, q, r]];
    if (p.w) rules.push([p.w, p.w, p.w]);
    const s = cramer([rules[0], rules[1], [0, 0, 1]], [0, 0, p.z]).map(tidy);
    const ok = rules.every(row => Math.abs(dot(row, s)) < 1e-9) && s[2] === p.z;
    return ok ? [s[0], s[1], 3 - rank(rules)] : [NaN, NaN, NaN];
  },
  /* Quarterly corrections: rank by minors; x and z by searching for the only whole numbers that satisfy every written rule. */
  q16d: p => {
    const rules = [[1, 1, 1, 1], [1, 1, 0, 0], [0, 0, 1, 1]];
    if (p.rules === 4) rules.push([1, 0, -1, 0]);
    const r = rank(rules), found = [];
    for (let x = -20; x <= 20; x++) for (let z = -20; z <= 20; z++)
      if (rules.every(row => dot(row, [p.a, x, p.c, z]) === 0)) found.push([x, z]);
    return found.length === 1 ? [r, 4 - r, found[0][0], found[0][1]] : [r, 4 - r, NaN, NaN];
  },
  /* Bakery: add the ingredients tray by tray. */
  q17b: p => {
    const total = [0, 0, 0];
    for (let i = 0; i < p.x; i++) p.u.forEach((kg, j) => { total[j] += kg; });
    for (let i = 0; i < p.y; i++) p.w.forEach((kg, j) => { total[j] += kg; });
    return total;
  },
  /* Drawing program: write each dot as a mix of the two dots whose landing spots are known, (1,0) and (1,1), by search,
     then mix the landing spots the same way. */
  q17c: p => {
    const land = dotAt => {
      for (let m = -12; m <= 12; m++) for (let n = -12; n <= 12; n++)
        if (m * 1 + n * 1 === dotAt[0] && m * 0 + n * 1 === dotAt[1]) return [m * p.e1[0] + n * p.s[0], m * p.e1[1] + n * p.s[1]];
      return [NaN, NaN];
    };
    return [...land([0, 1]), ...land(p.v)];
  },
  /* Robot hand: try every pair of whole turns and keep the only one that moves the tip by the target. */
  q17d: p => {
    const hits = [];
    for (let x = -12; x <= 12; x++) for (let y = -12; y <= 12; y++)
      if (x * p.ma[0] + y * p.mb[0] === p.target[0] && x * p.ma[1] + y * p.mb[1] === p.target[1]) hits.push([x, y]);
    return hits.length === 1 ? hits[0] : [NaN, NaN];
  },
  /* Road and farm: the nearest spot found by minimising the distance along the road. */
  q18b: p => nearestOnLine(p.u, p.v).map(tidy),
  /* Cart on a rail: the along part from the angle between push and rail (length of push × cos of the angle, laid along
     the rail); the sideways part is what is left, checked to be square to the rail. */
  q18c: p => {
    const angle = Math.atan2(p.v[1], p.v[0]) - Math.atan2(p.u[1], p.u[0]);
    const along = len(p.v) * Math.cos(angle), unit = p.u.map(x => x / len(p.u));
    const a = unit.map(x => tidy(along * x)), s = p.v.map((x, i) => tidy(x - a[i]));
    return Math.abs(dot(s, p.u)) < 1e-6 ? [...a, ...s] : [NaN, NaN, NaN, NaN];
  },
  /* Supply pipe: nearest point by minimising the distance; feeder length from Pythagoras on |v| and the nearest point. */
  q18d: p => {
    const n = nearestOnLine(p.u, p.v).map(tidy);
    return [...n, tidy(Math.sqrt(dot(p.v, p.v) - dot(n, n)))];
  },
  /* Camera: q2 lies in the plane of a1 and a2, square to a1, on a2's side. (a1 × a2) × a1 points exactly there; scale it to length 1. */
  q19b: p => {
    const w = cross(cross(p.a1, p.a2), p.a1), L = len(w);
    return w.map(x => tidy(x / L));
  },
  /* Street grid: q1 from the bearing of a1; q1·a2 as (length of a2) × cos(angle between); q2 is q1 turned a quarter
     turn, taking the turn that points to a2's side. */
  q19c: p => {
    const th = Math.atan2(p.a1[1], p.a1[0]), q1 = [Math.cos(th), Math.sin(th)];
    const along = len(p.a2) * Math.cos(Math.atan2(p.a2[1], p.a2[0]) - th);
    let q2 = [-q1[1], q1[0]];
    if (dot(q2, p.a2) < 0) q2 = [q1[1], -q1[0]];
    return [q1[0], q1[1], along, q2[0], q2[1]].map(tidy);
  },
  /* Drone frame: the only directions square to both q1 and q2 are ±(q1 × q2); take the one on a3's side. */
  q19d: p => {
    let q3 = cross(p.q1, p.q2);
    const L = len(q3); q3 = q3.map(x => x / L);
    if (dot(q3, p.a3) < 0) q3 = q3.map(x => -x);
    return [dot(p.q1, p.a3), dot(p.q2, p.a3), ...q3].map(tidy);
  },
  /* Laps: try every time in hundredths between the fastest and slowest lap; keep the one with the smallest sum of squared gaps. */
  q20b: p => {
    const c = bestOnGrid(Math.min(...p.r), Math.max(...p.r), t => sse(p.r, p.r.map(() => t)));
    return [c, tidy(sse(p.r, p.r.map(() => c)))];
  },
  /* Charger prices: same search; then the squared gaps for the buyer's guess, gap by gap. */
  q20c: p => {
    const c = bestOnGrid(Math.min(...p.r), Math.max(...p.r), t => sse(p.r, p.r.map(() => t)));
    return [c, tidy(sse(p.r, p.r.map(() => c))), sse(p.r, p.r.map(() => p.g))];
  },
  /* Spring: try every m in hundredths from 0 to 12; keep the one with the smallest sum of squared gaps. */
  q20d: p => {
    const m = bestOnGrid(0, 12, k => sse(p.y, p.t.map(x => k * x)));
    return [m, tidy(sse(p.y, p.t.map(x => m * x)))];
  },
});
})();
