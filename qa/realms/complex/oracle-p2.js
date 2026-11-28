/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 2 of 8: q06b–q10d (game/realms/complex/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const PI = Math.PI, TAU = 2 * Math.PI;
const r2 = x => Math.round(x * 100 + (x >= 0 ? 1e-7 : -1e-7)) / 100 + 0;
/* Complex numbers as [re, im] pairs. */
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cabs = a => Math.hypot(a[0], a[1]);
/* Principal argument in (−π, π], reduced by repeated whole turns. */
const principal = t => { while (t > PI + 1e-12) t -= TAU; while (t <= -PI + 1e-12) t += TAU; return t; };
/* Complex exponential e^(re + im i). */
const cexp = (re, im) => [Math.exp(re) * Math.cos(im), Math.exp(re) * Math.sin(im)];
/* The n-th roots of w, found by putting each trial argument back through z^n: roots are r e^(i(φ+2πk)/n). */
const roots = (w, n) => {
  const r = Math.pow(cabs(w), 1 / n), phi = Math.atan2(w[1], w[0]), out = [];
  for (let k = 0; k < n; k++) { const t = (phi + TAU * k) / n; out.push({ t: principal(t), z: [r * Math.cos(t), r * Math.sin(t)] }); }
  return { r, list: out };
};
/* The root whose argument is the smallest strictly positive one. */
const firstPositive = list => list.filter(o => o.t > 1e-9).sort((a, b) => a.t - b.t)[0];
Object.assign(window.ORACLE, {
  /* q06b: dir indexes the direction of w in [1, i, −1, −i] (a list of texts); |w| = rho^p. */
  q06b: p => {
    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]], d = dirs[p.dir], mod = Math.pow(p.rho, p.p);
    const w = [mod * d[0], mod * d[1]], R = roots(w, p.p), f = firstPositive(R.list);
    return [r2(R.r), r2(TAU / p.p), r2(R.r * Math.sin(f.t))];
  },
  /* q06c: the tips are rho·e^(2πik/p) (arm 0 on the positive real axis, anticlockwise); cable between arm 0 and arm m. */
  q06c: p => {
    const w = [Math.pow(p.rho, p.p), 0], R = roots(w, p.p);
    const tips = R.list.map(o => o.z).sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
    // order tips by anticlockwise angle from the positive real axis, arm 0 first
    const byAng = R.list.map(o => ({ a: (o.t + TAU) % TAU, z: o.z })).sort((x, y) => x.a - y.a);
    const t0 = byAng[0].z, tm = byAng[p.m].z;
    return [r2(R.r), r2(tm[0]), r2(cabs([t0[0] - tm[0], t0[1] - tm[1]]))];
  },
  /* q06d: w = z0^s by repeated multiplication (z0 = a + bi), then its p-th roots. */
  q06d: p => {
    let w = [1, 0]; for (let i = 0; i < p.s; i++) w = cmul(w, [p.a, p.b]);
    const R = roots(w, p.p), f = firstPositive(R.list);
    return [r2(R.r), r2(f.t), r2(f.z[0])];
  },
  /* q07b: expand f(z) = z² + kz by multiplying out. */
  q07b: p => {
    const f = (x, y) => { const z = [x, y], s = cmul(z, z); return [s[0] + p.k * x, s[1] + p.k * y]; };
    const a = f(p.x1, p.y1), b = f(p.x2, p.y2);
    return [r2(a[0]), r2(a[1]), r2(b[1])];
  },
  /* q07c: w = z² + c, then multiply by g = g1 + g2 i. */
  q07c: p => {
    const z = [p.x, p.y], w = cadd(cmul(z, z), [p.p, p.q]), o = cmul([p.g1, p.g2], w);
    return [r2(o[0]), r2(o[1])];
  },
  /* q07d: 1/z found by solving (x + yi)(s + ti) = 1 for s, t, then adding c = p + qi. */
  q07d: p => {
    const inv = (x, y) => { const n = x * x + y * y; return [x / n, -y / n]; };
    const a = inv(p.x1, p.y1), b = inv(p.x2, p.y2);
    return [r2(a[0] + p.p), r2(a[1] + p.q), r2(b[1] + p.q)];
  },
  /* q08b: y = K·π/4 (K only an index into the multiples of π/4). e^z = e^x (cos y + i sin y); phase brought into (−π, π].
     The prompt order is |e^z|, phase, Im e^z. */
  q08b: p => {
    const y = p.K * PI / 4, e = cexp(p.x, y), ph = principal(y);
    return [r2(cabs(e)), r2(ph), r2(e[1])];
  },
  /* q08c: after T seconds x = rx·T, y = T·m·π/6; subtract whole turns until y lies in (0, 2π]. */
  q08c: p => {
    const x = p.rx * p.T, y = p.T * p.m * PI / 6;
    let n = 0, a = y; while (a > TAU + 1e-12) { a -= TAU; n++; } while (a <= 1e-12) { a += TAU; n--; }
    const e = cexp(x, y);
    return [r2(cabs(e)), n, r2(e[0])];
  },
  /* q08d: y = K·π/6 (K only an index into the multiples of π/6). Multiply N copies of e^z one at a time. */
  q08d: p => {
    const e = cexp(p.x, p.K * PI / 6); let t = [1, 0];
    for (let i = 0; i < p.N; i++) t = cmul(t, e);
    let ang = Math.atan2(t[1], t[0]); while (ang <= 1e-12) ang += TAU;
    return [r2(cabs(t)), r2(ang), r2(t[0])];
  },
  /* q09b: Log z = ln|z| + i Arg z, Arg in (−π, π]. */
  q09b: p => {
    const m = Math.hypot(p.a, p.b);
    return [r2(Math.log(m)), r2(Math.atan2(p.b, p.a)), r2(Math.atan2(-p.b, p.a))];
  },
  /* q09c: ln|z| + i(Arg z + 2πk). */
  q09c: p => [r2(Math.log(Math.hypot(p.a, p.b))), r2(Math.atan2(p.b, p.a) + TAU * p.k)],
  /* q09d: Log z = l + (Kπ/6) i (K only an index into multiples of π/6), so z = e^l (cos + i sin). */
  q09d: p => {
    const z = cexp(p.l, p.K * PI / 6);
    return [r2(cabs(z)), r2(z[0]), r2(z[1])];
  },
  /* q10b: (−1)^(ci) = e^(ci·Log(−1)) = e^(ci·iπ). (−s)^(r/q) = e^((r/q)(ln s + iπ)). v^(1/m) has m values, equally spaced. */
  q10b: p => {
    const a = Math.exp(-p.c * PI);
    const z = cexp((p.r / p.q) * Math.log(p.s), (p.r / p.q) * PI);
    return [r2(a), r2(z[0]), r2(TAU / p.m)];
  },
  /* q10c: G = i^(ci) = e^(ci·iπ/2) = e^(−cπ/2). Strength after p stages, then search the stage count from 0 up. */
  q10c: p => {
    const G = Math.exp(-p.c * PI / 2);
    let n = 0, s = p.S0; while (s < p.L - 1e-12 && n < 100000) { s *= G; n++; }
    return [r2(G), r2(p.S0 * Math.pow(G, p.p)), n];
  },
  /* q10d: z^(ci) = e^(ci(ln|z| + i Arg z)) = e^(−c Arg z) · e^(i c ln|z|). */
  q10d: p => {
    const lm = Math.log(Math.hypot(p.a, p.b)), arg = Math.atan2(p.b, p.a);
    const v = cexp(-p.c * arg, p.c * lm);
    return [r2(cabs(v)), r2(v[0]), r2(v[1])];
  },
});
})();
