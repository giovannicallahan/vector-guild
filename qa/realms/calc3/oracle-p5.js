/* Independent oracles for Calculus 3: many variables practice missions, file 5 of 8: q21b–q25d (game/realms/calc3/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const hyp = (a, b) => Math.sqrt(a * a + b * b);
/* Quadratic a x² + b xy + c y² + L1 x + L2 y + k whose critical point is (p, q): the linear terms are the ones that make f_x and f_y vanish there. */
const quad = (a, b, c, p, q, k) => {
  const L1 = -(2 * a * p + b * q), L2 = -(b * p + 2 * c * q);
  return (x, y) => a * x * x + b * x * y + c * y * y + L1 * x + L2 * y + k;
};
/* Central differences are exact for a quadratic: gradient and Hessian at a point, then the critical point by solving the 2 × 2 system. */
const grad = (f, x, y) => [(f(x + 1, y) - f(x - 1, y)) / 2, (f(x, y + 1) - f(x, y - 1)) / 2];
const hess = (f, x, y) => [f(x + 1, y) - 2 * f(x, y) + f(x - 1, y), (f(x + 1, y + 1) - f(x + 1, y - 1) - f(x - 1, y + 1) + f(x - 1, y - 1)) / 4, f(x, y + 1) - 2 * f(x, y) + f(x, y - 1)];
const kind = (fxx, fxy, fyy) => { const D = fxx * fyy - fxy * fxy; return D < 0 ? 3 : (fxx > 0 ? 2 : 1); };
const critical = f => {
  const [gx, gy] = grad(f, 0, 0), [A, B, C] = hess(f, 0, 0), det = A * C - B * B;
  const x = (-gx * C + gy * B) / det, y = (-gy * A + gx * B) / det;
  return { x: r6(x), y: r6(y), D: r6(det), code: kind(A, B, C), z: r6(f(x, y)) };
};
/* Composite Simpson rule in one variable; and over a rectangle, or a region with limits lo(x) ≤ y ≤ hi(x). */
const simpson = (g, a, b, n = 200) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
const area = (f, x1, x2, lo, hi) => simpson(x => simpson(y => f(x, y), lo(x), hi(x)), x1, x2);
/* Golden-section search for the largest value of g on [a, b] (g has one hump there). */
const peak = (g, a, b) => { const r = (Math.sqrt(5) - 1) / 2; for (let i = 0; i < 200; i++) { const c = b - r * (b - a), d = a + r * (b - a); if (g(c) > g(d)) b = d; else a = c; } return (a + b) / 2; };
/* Largest (sign = 1) or smallest (sign = −1) value of f on the closed curve (X(t), Y(t)), t in [0, 2π]: coarse scan, then a fine search round the best sample. */
const onCurve = (f, X, Y, sign) => {
  const N = 20000, h = 2 * Math.PI / N; let best = 0;
  for (let i = 1; i < N; i++) if (sign * f(X(i * h), Y(i * h)) > sign * f(X(best * h), Y(best * h))) best = i;
  const t = peak(u => sign * f(X(u), Y(u)), (best - 1) * h, (best + 1) * h);
  return { x: X(t), y: Y(t), v: f(X(t), Y(t)) };
};
Object.assign(window.ORACLE, {
  /* q21b: f = a x² + b xy + c y² + (linear terms) + k with its critical point at (p, q); k is the constant term. */
  q21b: p => { const c = critical(quad(p.a, p.b, p.c, p.p, p.q, p.k)); return [c.x, c.y, c.code, c.z]; },
  /* q21c: the same shape, with critical point (p, q); the lowest cost is m, so the constant term is m minus the rest at (p, q). */
  q21c: p => {
    const rest = quad(p.a, p.b, p.c, p.p, p.q, 0);
    const c = critical(quad(p.a, p.b, p.c, p.p, p.q, p.m - rest(p.p, p.q)));
    return [c.x, c.y, c.D, c.z];
  },
  /* q21d: f = t x³ − 3 t s² x + c y² − 2 c q y. Critical points by a sign-change scan of f_x on a grid (then bisection) and of f_y;
     D from second differences; the larger-x point is reported first, then the code of the other. */
  q21d: p => {
    const f = (x, y) => p.t * x * x * x - 3 * p.t * p.s * p.s * x + p.c * y * y - 2 * p.c * p.q * y;
    const fx = x => (f(x + 1e-4, 0) - f(x - 1e-4, 0)) / 2e-4, fy = y => (f(0, y + 1e-4) - f(0, y - 1e-4)) / 2e-4;
    const roots = g => { const out = []; for (let x = -60; x < 60; x += 0.01) { let a = x, b = x + 0.01; if (g(a) * g(b) < 0) { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (g(a) * g(m) <= 0) b = m; else a = m; } out.push(Math.round((a + b) / 2 * 1e6) / 1e6); } else if (g(a) === 0) out.push(Math.round(a * 1e6) / 1e6); } return out; };
    const xs = roots(fx).sort((u, v) => v - u), ys = roots(fy), h = 1e-3;
    const info = x => { const fxx = (f(x + h, ys[0]) - 2 * f(x, ys[0]) + f(x - h, ys[0])) / (h * h), fyy = (f(x, ys[0] + h) - 2 * f(x, ys[0]) + f(x, ys[0] - h)) / (h * h); const D = fxx * fyy; return { D: r6(D), code: D < 0 ? 3 : (fxx > 0 ? 2 : 1) }; };
    const a = info(xs[0]), b = info(xs[xs.length - 1]);
    return [xs[0], ys[0], a.D, a.code, b.code];
  },
  /* q22b: smallest value of Ax + By on the circle x² + y² = r², found by scanning the angle; λ from A = 2λx (or B = 2λy where x is 0). */
  q22b: p => {
    const m = onCurve((x, y) => p.A * x + p.B * y, t => p.r * Math.cos(t), t => p.r * Math.sin(t), -1);
    const lam = Math.abs(m.x) > Math.abs(m.y) ? p.A / (2 * m.x) : p.B / (2 * m.y);
    return [r6(m.v), r6(lam)];
  },
  /* q22c: maximise xy along a x + b y = B, where B = 2 a b m (the budget printed is 40 m, here a b = 20); search along the line; λ from f_x = y = λ a. */
  q22c: p => {
    const B = 2 * p.a * p.b * p.m, yOf = x => (B - p.a * x) / p.b;
    const x = peak(t => t * yOf(t), 0, B / p.a), y = yOf(x);
    return [r6(y / p.a), r6(x), r6(y), r6(x * y)];
  },
  /* q22d: li is only an index into the list of multipliers [0.25, 0.5, 1] (read off the prompts). f = α x + β y with α = 2λx0 and β = 8λy0, so the
     stationary point of f on the oval is (x0, y0); the oval is x² + 4y² = x0² + 4y0². Largest f by scanning the oval; λ from α = 2λx (or β = 8λy where x is 0). */
  q22d: p => {
    const R = Math.sqrt(p.x0 * p.x0 + 4 * p.y0 * p.y0), L = [0.25, 0.5, 1][p.li], al = 2 * L * p.x0, be = 8 * L * p.y0;
    const m = onCurve((x, y) => al * x + be * y, t => R * Math.cos(t), t => R * Math.sin(t) / 2, 1);
    const lam = Math.abs(m.x) > 2 * Math.abs(m.y) ? al / (2 * m.x) : be / (8 * m.y);
    return [r6(m.v), r6(lam)];
  },
  /* q23b: f has its critical point at (p, q); the rover stands at P = (p + u, q + v) (u, v are the steps from the critical point). */
  q23b: p => {
    const f = quad(p.a, p.b, p.c, p.p, p.q, p.k), c = critical(f), g = grad(f, p.p + p.u, p.q + p.v);
    return [c.code, c.z, r6(hyp(g[0], g[1]))];
  },
  /* q23c: same set-up; the climb is the height at the top minus the height at the camp P = (p + u, q + v). */
  q23c: p => {
    const f = quad(p.a, p.b, p.c, p.p, p.q, p.k), c = critical(f), g = grad(f, p.p + p.u, p.q + p.v);
    return [r6(hyp(g[0], g[1])), c.x, c.y, r6(c.z - f(p.p + p.u, p.q + p.v))];
  },
  /* q23d: as above; dir is only an index into the list of drift directions ⟨3,4⟩ ⟨4,3⟩ ⟨−3,4⟩ ⟨3,−4⟩ ⟨−4,3⟩ ⟨4,−3⟩ ⟨−3,−4⟩ ⟨−4,−3⟩ (read off the prompts). */
  q23d: p => {
    const f = quad(p.a, p.b, p.c, p.p, p.q, p.k), c = critical(f), g = grad(f, p.p + p.u, p.q + p.v);
    const d = [[3, 4], [4, 3], [-3, 4], [3, -4], [-4, 3], [4, -3], [-3, -4], [-4, -3]][p.dir];
    return [r6(hyp(g[0], g[1])), r6((g[0] * d[0] + g[1] * d[1]) / hyp(d[0], d[1])), c.code, c.z];
  },
  /* q24b: σ = k + a x + b y on the rectangle [x1, x2] × [y1, y2]; mass by Simpson's rule, then mass ÷ area. */
  q24b: p => {
    const m = area((x, y) => p.k + p.a * x + p.b * y, p.x1, p.x2, () => p.y1, () => p.y2);
    return [r6(m), r6(m / ((p.x2 - p.x1) * (p.y2 - p.y1)))];
  },
  /* q24c: thickness e + a x² + b y mm on x from x1 to x1 + 3 (the prompts always give a width of 3 m) and y from y1 to y1 + dy; 1 m² × 1 mm = 1 litre;
     w is the price per litre. */
  q24c: p => {
    const v = area((x, y) => p.e + p.a * x * x + p.b * y, p.x1, p.x1 + 3, () => p.y1, () => p.y1 + p.dy);
    return [r6(v), r6(p.w * v)];
  },
  /* q24d: power c x² y + e y + d on x from x1 to x1 + dx, y from y1 to y1 + dy; total by Simpson's rule, average = total ÷ area. */
  q24d: p => {
    const t = area((x, y) => p.c * x * x * y + p.e * y + p.d, p.x1, p.x1 + p.dx, () => p.y1, () => p.y1 + p.dy);
    return [r6(t), r6(t / (p.dx * p.dy))];
  },
  /* q25b: region x ≥ 0, c x² ≤ y ≤ c s² with thickness k x; litres = ∫∫ k x dA. The top limit of x is where c x² reaches the top line
     (bisection); the inner integral starts on the curve, y = c x1². */
  q25b: p => {
    const top = p.c * p.s * p.s;
    let a = 0, b = 100; for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (p.c * m * m < top) a = m; else b = m; }
    const xmax = (a + b) / 2;
    const litres = area((x, y) => p.k * x, 0, xmax, x => p.c * x * x, () => top);
    return [r6(litres), r6(xmax), r6(p.c * p.x1 * p.x1)];
  },
  /* q25c: triangle under the line y = m (a − x), from x = 0 to its x-intercept x = a (the prompt shows y = 12 − 4x for a = 3, m = 4), density k x;
     the tall edge is the line's height at x = 0. */
  q25c: p => [r6(p.m * (p.a - 0)), r6(area((x, y) => p.k * x, 0, p.a, () => 0, x => p.m * (p.a - x)))],
  /* q25d: lens is only an index into the list of (line slope, height y) pairs below, read off the prompts: y = x² and y = slope·x, density k.
     Mass by Simpson's rule between the crossing points; at height y the strip runs from y ÷ slope to √y (found by bisection). */
  q25d: p => {
    const [s, y] = [[4, 4], [8, 16], [9, 9], [9, 36], [12, 36], [16, 16], [16, 64], [18, 36], [18, 144]][p.lens];
    let a = 0, b = 1000; for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (m * m < y) a = m; else b = m; }
    return [r6(area(() => p.k, 0, s, x => x * x, x => s * x)), r6(y / s), r6((a + b) / 2)];
  },
});
})();
