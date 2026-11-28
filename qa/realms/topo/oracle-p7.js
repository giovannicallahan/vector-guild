/* Independent oracles for Topology: shape without size practice missions, file 7 of 8: q31b–q35d (game/realms/topo/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const PI = Math.PI;
/* Euler characteristic of a closed surface from its kind: o = 1 orientable of genus h (sphere with h handles), o = 0
   non-orientable with h cross-caps (sphere with h discs replaced by Möbius bands). */
const chiOf = (o, h) => o ? 2 - 2 * h : 2 - h;
/* Sectors are numbered anticlockwise 0 = NE, 1 = NW, 2 = SW, 3 = SE. Ray code r (read off the printed prompts) is the border
   between sector r and sector r + 1: 0 = due north (NE|NW), 1 = due west (NW|SW), 2 = due south (SW|SE), 3 = due east (SE|NE).
   The winding number is counted by adding up quarter turns (+1 for each step anticlockwise to the next sector, -1 for each step
   clockwise) and dividing by 4, a different route from counting the crossings of one ray. */
const quarterTurns = seq => { let t = 0; for (let i = 1; i < seq.length; i++) { const d = ((seq[i] - seq[i - 1]) % 4 + 4) % 4; t += d === 1 ? 1 : d === 3 ? -1 : NaN; } return t; };
const winding = seq => quarterTurns(seq) / 4;
const crossings = (seq, r) => {
  let ac = 0, cw = 0;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i - 1] === r && seq[i] === (r + 1) % 4) ac++;
    if (seq[i - 1] === (r + 1) % 4 && seq[i] === r) cw++;
  }
  return [ac, cw];
};
/* q33c: t is only an index into the generator's list of triangles; read off from the printed prompts, each entry is the three
   denominators of the corner angles pi/x, pi/y, pi/z. */
const TRI = [[2,3,7],[2,3,8],[2,3,9],[2,4,5],[2,4,6],[3,3,4],[2,5,5],[2,4,8],[3,3,6],[2,6,6],[3,4,4],[4,4,4]];
Object.assign(window.ORACLE, {
  /* Sphere of radius s (k = 1/s^2), patch of area A, two angles a*pi/12 and b*pi/12: excess = kA; third = pi + excess - others. */
  q31b: p => {
    const k = 1 / (p.s * p.s), ex = k * p.A;
    return [rd(ex, 2), rd(PI + ex - p.a * PI / 12 - p.b * PI / 12, 2)];
  },
  /* Angles a, b, c in twelfths of pi: excess = sum - pi; area = excess / k; copies = (4 pi s^2) / area, found by counting. */
  q31c: p => {
    const ex = (p.a + p.b + p.c) * PI / 12 - PI, area = ex * p.s * p.s, whole = 4 * PI * p.s * p.s;
    let n = 0; while (n * area < whole - 1e-6) n++;
    return [rd(ex, 2), rd(area, 2), n];
  },
  /* Angles a, b, c in twelfths of pi and the printed area Am pi. k = excess / area = 1 / N, so N = area / excess;
     radius = sqrt N found by search. */
  q31d: p => {
    const ex = (p.a + p.b + p.c - 12) * PI / 12, areaOverPi = p.Am;
    const N = Math.round(areaOverPi * PI / ex);
    let r = 1; while (r * r < N) r++;
    return [rd(ex, 2), N, r];
  },
  /* Genus g1 and printed area P pi: Gauss-Bonnet kA = 2 pi chi gives k = 2 chi / P; the twin shell has genus g2 and the same k. */
  q32b: p => {
    const chi1 = 2 - 2 * p.g1, chi2 = 2 - 2 * p.g2;
    const kBack = 2 * chi1 / p.P;
    return [chi1, kBack, 2 * chi2 / kBack];
  },
  /* Genus g, k = -1/m, r litres a square metre. */
  q32c: p => {
    const chi = 2 - 2 * p.g, k = -1 / p.m, area = 2 * PI * chi / k;
    return [chi, rd(area, 2), rd(area * p.r, 2)];
  },
  /* chi = -c, k = -1/m: genus from chi = 2 - 2g by search; area / pi = 2 chi / k; sphere radius from 4 pi s^2 = area. */
  q32d: p => {
    const chi = -p.c, k = -1 / p.m;
    let g = 0; while (2 - 2 * g > chi) g++;
    const a = 2 * chi / k;
    return [g, a, rd(Math.sqrt(a / 4), 2)];
  },
  /* items [o, h]: o = 1 orientable of genus h, o = 0 non-orientable with h cross-caps. Sign of k = sign of chi (Gauss-Bonnet). */
  q33b: p => {
    let e = 0, f = 0, h = 0;
    for (const [o, n] of p.items) { const c = chiOf(o, n); if (c > 0) e++; else if (c === 0) f++; else h++; }
    return [e, f, h];
  },
  /* c cross-caps, k = -1: chi = 2 - c; A / pi = -2 chi; the plate has angle sum (1/x + 1/y + 1/z) pi, so kA = sum - pi gives
     plate area / pi = 1 - (1/x + 1/y + 1/z); plates by exact whole-number arithmetic. */
  q33c: p => {
    const chi = 2 - p.c, [x, y, z] = TRI[p.t], a = -2 * chi;
    const num = a * x * y * z, den = x * y * z - (y * z + x * z + x * y);
    return [chi, a, Math.round(num / den)];
  },
  /* Sections [o_i, h_i]; chi(X#Y) = chi X + chi Y - 2; k = -1 so A / pi = -2 chi. */
  q33d: p => {
    const cA = chiOf(p.o1, p.h1), cB = chiOf(p.o2, p.h2), cC = chiOf(p.o3, p.h3);
    const c2 = cA + cB - 2, c3 = c2 + cC - 2;
    return [c2, Math.sign(c2), c3, -2 * c3];
  },
  /* k = -1/m and the printed area P pi. Recover the polygon
     by search over n: with all n corners at one point the angle is 2 pi / n, so the area is m ((n - 2) pi - 2 pi) = m (n - 4) pi. */
  q34b: p => {
    const aOverPi = p.P;
    let n = 4; while (p.m * (n - 4) < aOverPi) n += 4;
    return [n / 4, n, n / 2];
  },
  /* One copy has area / pi = 2 m (2g - 2); copies = Q / that; each copy has 4g corners. */
  q34c: p => {
    const one = 2 * p.m * (2 * p.g - 2);
    const copies = Math.round(p.Q / one);
    return [one, copies, copies * 4 * p.g];
  },
  /* c cross-caps: word of 2c letters so n = 2c sides, all corners one point so V = 1, E = c, F = 1 and chi = 2 - c; the corner
     angle is 2 pi / n = pi / c; copies round a point = 2 pi / angle; area = m ((n - 2) pi - n angle) = m (n - 4) pi. */
  q34d: p => {
    const n = 2 * p.c, chi = 1 - p.c + 1, N = n / 2;
    return [chi, N, 2 * N, p.m * (n - 4)];
  },
  /* seq = sector log (0 NE, 1 NW, 2 SW, 3 SE), r = ray code as above. */
  q35b: p => { const [ac, cw] = crossings(p.seq, p.r); return [ac, cw, winding(p.seq)]; },
  q35c: p => { const [ac, cw] = crossings(p.seq, p.r); const w = winding(p.seq); return [ac + cw, w, w * p.len]; },
  q35d: p => {
    const [ac, cw] = crossings(p.seq, p.r);
    return [ac, cw, winding(p.seq), winding(p.seq.slice().reverse())];
  }
});
})();
