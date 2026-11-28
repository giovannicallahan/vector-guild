/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 6 of 8: q26b–q30d (game/realms/complex/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const r2 = x => Math.round(x * 100) / 100;
const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
/* Complex numbers as [re, im]. */
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cabs = a => Math.hypot(a[0], a[1]);
const cpow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cmul(r, z); return r; };
/* Polynomial with coefficients listed from the highest power down, at a complex point. */
const poly = (coef, z) => { let r = [0, 0]; for (const c of coef) r = cadd(cmul(r, z), [c, 0]); return r; };
/* Ceiling of |f| over the closed disc |z| <= R, by sampling radii and angles (the angle grid contains every multiple of 2π/e for e up to 6). */
const maxOnDisc = (f, R) => { let m = 0; for (let i = 0; i <= 40; i++) for (let j = 0; j < 720; j++) { const t = 2 * Math.PI * j / 720, s = R * i / 40; m = Math.max(m, cabs(f([s * Math.cos(t), s * Math.sin(t)]))); } return m; };
const minOnCircle = (f, R) => { let m = Infinity; for (let j = 0; j < 720; j++) { const t = 2 * Math.PI * j / 720; m = Math.min(m, cabs(f([R * Math.cos(t), R * Math.sin(t)]))); } return m; };
/* ∮ f(z) ÷ (z − a)^n dz once anticlockwise round |z − c| = R, divided by πi, by the trapezium rule (exact to many places for these smooth integrands). */
const contourK = (f, a, n, c, R) => { const N = 4096; let tot = [0, 0];
  for (let j = 0; j < N; j++) { const t = 2 * Math.PI * j / N, e = [Math.cos(t), Math.sin(t)], z = [c + R * e[0], R * e[1]], dz = cmul([0, R], e);
    tot = cadd(tot, cdiv(cmul(f(z), dz), cpow([z[0] - a, z[1]], n))); }
  return r6(tot[1] * (2 * Math.PI / N) / Math.PI); };
/* Cauchy's inequality bound n! M ÷ R^n. */
const cauchy = (n, M, R) => r6(fact(n) * M / Math.pow(R, n));
/* Sum of a geometric series term by term: first + first·z + first·z² + …, stepping by `step` powers (stops when the terms are negligible). */
const gsum = (first, z, step) => { const w = cpow(z, step); let term = first, tot = [0, 0]; for (let i = 0; i < 200000 && cabs(term) > 1e-15; i++) { tot = cadd(tot, term); term = cmul(term, w); } return tot; };
Object.assign(window.ORACLE, {
  /* q26b: n = k (order of the derivative), M, R: bound n! M ÷ R^n. The claim index s picks one of five technician claims (a lookup, not a quantity):
     0 f takes the same value at 1 and 100 (true, f is constant), 1 "2z+5 is bounded" (false), 2 f′(4) = 0 (true), 3 non-constant bounded entire (false), 4 f(z) = f(0) (true). */
  q26b: p => [cauchy(p.k, p.M, p.R), [1, 0, 1, 0, 1][p.s]],
  /* q26c: the bound e! M ÷ R^e from each circle, and the smaller of the two is the best. */
  q26c: p => { const b1 = cauchy(p.e, p.M1, p.R1), b2 = cauchy(p.e, p.M2, p.R2); return [b1, b2, Math.min(b1, b2)]; },
  /* q26d: ∮ f ÷ (z − a)^(j+1) dz = kπi = 2πi f⁽ʲ⁾(a) ÷ j!, so |f⁽ʲ⁾(a)| = |k| j! ÷ 2; the smallest M has j! M ÷ R^j equal to that. */
  q26d: p => { const d = Math.abs(p.k) * fact(p.j) / 2; let M = 0; while (cauchy(p.j, M, p.R) < d - 1e-9) M += 1 / 8; return [r6(d), r6(M)]; },
  /* q27b: u = A(x³ − 3xy²) + B(3x²y − y³) + Cx + Dy + E is harmonic, so the ring average is found by averaging u at many points round the ring; the top is (p, q + r). */
  q27b: p => { const u = (x, y) => p.A * (x * x * x - 3 * x * y * y) + p.B * (3 * x * x * y - y * y * y) + p.C * x + p.D * y + p.E;
    let s = 0; const N = 720; for (let j = 0; j < N; j++) { const t = 2 * Math.PI * j / N; s += u(p.p + p.r * Math.cos(t), p.q + p.r * Math.sin(t)); }
    return [r6(u(p.p, p.q + p.r)), r6(s / N)]; },
  /* q27c: u = A x² − A y² + B xy + C x + D y + E. The gauge average is the ring average of u with the true E; E is then found again as (gauge average) − (ring average of u without E). */
  q27c: p => { const u0 = (x, y) => p.A * (x * x - y * y) + p.B * x * y + p.C * x + p.D * y;
    const avg = f => { let s = 0; const N = 720; for (let j = 0; j < N; j++) { const t = 2 * Math.PI * j / N; s += f(p.p + p.r * Math.cos(t), p.q + p.r * Math.sin(t)); } return s / N; };
    const gauge = avg((x, y) => u0(x, y) + p.E), E = gauge - avg(u0);
    return [r6(E), r6(u0(p.p + p.r, p.q) + E)]; },
  /* q27d: f = al z² + be z + ga, ring centre a = p + qi, radius r: average f round the ring numerically; u at the point a + r is Re f(a + r). */
  q27d: p => { const f = z => poly([p.al, p.be, p.ga], z), a = [p.p, p.q];
    let s = [0, 0]; const N = 720; for (let j = 0; j < N; j++) { const t = 2 * Math.PI * j / N; s = cadd(s, f([a[0] + p.r * Math.cos(t), a[1] + p.r * Math.sin(t)])); }
    return [r6(f([a[0] + p.r, a[1]])[0]), r6(s[0] / N), r6(s[1] / N)]; },
  /* q28b: f = k z^e + c on |z| <= R: sample the whole disc for the largest |f| and the edge for the smallest. */
  q28b: p => { const f = z => cadd(cmul([p.k, 0], cpow(z, p.e)), [p.c, 0]); return [r6(maxOnDisc(f, p.R)), r6(minOnCircle(f, p.R))]; },
  /* q28c: f = z^e + c. The largest |f| on |z| <= R0; then try whole radii upward and keep the last one that fits under L. */
  q28c: p => { const f = z => cadd(cpow(z, p.e), [p.c, 0]); let best = 0;
    for (let R = 1; R <= 60; R++) { if (maxOnDisc(f, R) > p.L + 1e-9) break; best = R; }
    return [r6(maxOnDisc(f, p.R0)), best]; },
  /* q28d: f = z^e + c. M is the largest |f| on the disc, the bound is e! M ÷ R^e, and f⁽ᵉ⁾(0) = e! because the other term is constant. */
  q28d: p => { const f = z => cadd(cpow(z, p.e), [p.c, 0]); const M = maxOnDisc(f, p.R); return [r6(M), r6(cauchy(p.e, M, p.R)), fact(p.e)]; },
  /* q29b: f = al z³ + be z² + ga z + de; the two contour integrals by the trapezium rule round |z − c| = R about the point a; then the bound m! M ÷ rho^m. */
  q29b: p => { const f = z => poly([p.al, p.be, p.ga, p.de], z); return [contourK(f, p.a, 1, p.c, p.R), contourK(f, p.a, 3, p.c, p.R), cauchy(p.m, p.M, p.rho)]; },
  /* q29c: f = z² + p z + e. The gauge is ∮ f ÷ (z − a) dz with the true p; p is then solved from (gauge ÷ πi) = 2 f(a), and the next integral is found numerically with that p. */
  q29c: p => { const mk = pp => z => poly([1, pp, p.e], z);
    const G = contourK(mk(p.p), p.a, 1, 0, p.R), pp = (G / 2 - p.a * p.a - p.e) / p.a;
    return [r6(pp), contourK(mk(pp), p.a, 2, 0, p.R), cauchy(p.m, p.M, p.rho)]; },
  /* q29d: the cable winds w times, so each integral is w times the one-turn integral; f = al z³ + be z² + ga z + de; the point a lies inside |z − c| = R. Bound j! M ÷ rho^j. */
  q29d: p => { const f = z => poly([p.al, p.be, p.ga, p.de], z);
    return [r6(p.w * contourK(f, p.a, 1, p.c, p.R)), r6(p.w * contourK(f, p.a, 2, p.c, p.R)), cauchy(p.j, p.M, p.rho)]; },
  /* q30b: add A + Az + Az² + … term by term, z = (a + bi) ÷ d. */
  q30b: p => { const s = gsum([p.A, 0], [p.a / p.d, p.b / p.d], 1); return [r6(s[0]), r6(s[1])]; },
  /* q30c: S = 1 + z + z² + … for z = (a + bi) ÷ d is found by adding terms; then z is recovered from S through S(1 − z) = 1, that is z = 1 − 1 ÷ S. */
  q30c: p => { const S = gsum([1, 0], [p.a / p.d, p.b / p.d], 1), z = cadd([1, 0], cmul([-1, 0], cdiv([1, 0], S))); return [r6(z[0]), r6(z[1])]; },
  /* q30d: add 1 + z² + z⁴ + … term by term (steps of two powers), z = (a + bi) ÷ d; round to 2 places. */
  q30d: p => { const s = gsum([1, 0], [p.a / p.d, p.b / p.d], 2); return [r2(s[0]), r2(s[1])]; },
});
})();
