/* Independent oracles for Differential equations practice missions, file 1 of 8: q01b–q05d (game/realms/ode/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = x => Math.round(x * 1000 + (x >= 0 ? 1e-7 : -1e-7)) / 1000;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Find, by searching a grid of hundredths from -20 to 20, the k for which  lhsY' k + lhsY = rhsY' k + rhsY  holds. */
const searchK = (dy, dn) => {            // dy k + dn = 0
  let best = 0, bestErr = Infinity;
  for (let i = -2000; i <= 2000; i++) { const k = i / 100, err = Math.abs(dy * k + dn); if (err < bestErr - 1e-12) { bestErr = err; best = k; } }
  return best;
};
/* Integral of f from a to b by Simpson's rule on many slices (exact for cubics and below). */
const integ = (f, a, b) => { const n = 400, w = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * w) * (i % 2 ? 4 : 2); return s * w / 3; };
/* Euler's method written as a loop over the steps; f(x, y) is the whole right-hand side. */
const euler = (f, x, y, h, n) => { for (let i = 0; i < n; i++) { y += h * f(x, y); x += h; } return y; };
/* q02 slots: read every slot letter L (or prefix + L) that has a kind field. Kind 1 = nonlinear term, 0 = linear term.
   The slot's order field is the derivative order shown in the term (0 for y itself or for a function of y alone). */
const slots = (p, prefix) => {
  const out = [];
  for (const key of Object.keys(p)) {
    const m = key.match(new RegExp('^' + prefix + '([A-Z])k$'));
    if (m) out.push({ nonlinear: p[key] === 1, order: p[prefix + m[1] + 'o'] });
  }
  return out;
};
const orderOf = s => s.reduce((m, t) => Math.max(m, t.order), 0);
const isLinear = s => s.every(t => !t.nonlinear);
Object.assign(window.ORACLE, {
  /* q01b: a y′ − a k y = 0 (printed as a y′ ± B y). Collect the y coefficient B, search for the k that cancels it, then rate = k C. */
  q01b: p => {
    const B = -p.a * p.k;                 // coefficient of y as printed (sign included)
    const k = searchK(p.a, B);            // a k + B = 0
    return [k, r6(k * p.C)];
  },
  /* q01c: a y′ = (a k) y. Find k by search, C from the starting rate kC, then rate at the stated amount V from the equation itself. */
  q01c: p => {
    const coef = p.a * p.k, start = p.k * p.C;      // printed: a y′ = coef y; y′(0) = start
    const k = searchK(p.a, -coef);
    return [k, r6(start / k), r6(coef * p.V / p.a)];
  },
  /* q01d: (r+d) y′ + q y = r y′ + s y. Collect: d k = s − q. Search k on a grid of 1/100, then C = rate / k. */
  q01d: p => {
    const k = searchK(p.d, p.q - p.s);
    return [k, r6(k * p.C / k)];
  },
  /* q02: count from the slots (kind, order); the index is only an index into a list of texts, so it is never used. */
  q02b: p => { const s = slots(p, ''); return [orderOf(s), isLinear(s) ? 1 : 0]; },
  q02c: p => {
    const eqs = ['a', 'b', 'e'].map(pre => slots(p, pre));
    return [Math.max(...eqs.map(orderOf)), eqs.filter(isLinear).length, eqs.filter(s => isLinear(s) && orderOf(s) === 1).length];
  },
  q02d: p => { const s = slots(p, ''); return [orderOf(s), isLinear(s) ? 1 : 0, s.filter(t => t.nonlinear).length]; },
  /* q03b: y′ = a x³ + b x + c, y(x0) = y0. Integrate numerically from x0 to x1: y(x1) = y0 + ∫ y′; C from y(0)... via F(x)=∫0^x. */
  q03b: p => {
    const f = x => p.a * x * x * x + p.b * x + p.c, F = x => integ(f, 0, x);
    return [r6(p.y0 - F(p.x0)), r6(p.y0 + integ(f, p.x0, p.x1))];
  },
  /* q03c: y′ = a x² + b x − k. The gauge reading at x1 is what the prompt prints; solve it back for k, then run on to x2. */
  q03c: p => {
    const g = x => p.a * x * x + p.b * x;
    const reading = p.y0 + integ(g, 0, p.x1) - p.k * p.x1;          // y(x1) as printed
    const k = (p.y0 + integ(g, 0, p.x1) - reading) / p.x1;           // inflow gain minus observed gain, per hour
    return [r6(k), r6(p.y0 + integ(g, 0, p.x2) - k * p.x2)];
  },
  /* q03d: y′ = a x³ + b x² + c x + d, y(x0) = y0. */
  q03d: p => {
    const f = x => p.a * x * x * x + p.b * x * x + p.c * x + p.d;
    return [r6(p.y0 - integ(f, 0, p.x0)), r6(p.y0 + integ(f, p.x0, p.x1))];
  },
  /* q04b: y′ = (q m − q y)(x² + c). Equilibrium: search the y where the y-factor vanishes; slope at (x1, y1). */
  q04b: p => {
    const f = (x, y) => (p.q * p.m - p.q * y) * (x * x + p.c);
    let eq = null; for (let y = -200; y <= 200; y += 0.25) if (Math.abs(p.q * p.m - p.q * y) < 1e-9) eq = y;
    return [r6(f(p.x1, p.y1)), eq];
  },
  /* q04c: y′ = (x − c)(a m − a y); the reading is dd below (up = 0) or above (up = 1) the equilibrium. */
  q04c: p => {
    let eq = null; for (let y = -200; y <= 200; y += 0.25) if (Math.abs(p.a * p.m - p.a * y) < 1e-9) eq = y;
    const y1 = p.up ? eq + p.dd : eq - p.dd;
    return [eq, r6((p.x1 - p.c) * (p.a * p.m - p.a * y1))];
  },
  /* q04d: y′ = (c x − c xs)(a y − b). Equilibrium y = b / a (decimal); the vertical line is where the x-factor is 0. */
  q04d: p => {
    let xstar = null; for (let x = -100; x <= 100; x += 0.5) if (Math.abs(p.c * x - p.c * p.xs) < 1e-9) xstar = x;
    return [r6((p.c * p.x1 - p.c * p.xs) * (p.a * p.y1 - p.b)), r6(p.b / p.a), xstar];
  },
  /* q05b: y′ = p − q y, Euler with step h for N steps. */
  q05b: p => [r3(euler((x, y) => p.p - p.q * y, 0, p.y0, p.h, p.N))],
  /* q05c: y′ = p x − q y; second answer is the target minus the estimate already rounded to 3 places. */
  q05c: p => { const e = r3(euler((x, y) => p.p * x - p.q * y, 0, p.y0, p.h, p.N)); return [e, r6(p.T - e)]; },
  /* q05d: y′ = (x + c)(a m − a y); the start is y(0) = m + dev; the prompt states 2 steps.
     hn is only an index into the list of step sizes the prompt prints (seen in prompts: 2 -> 0.2, 3 -> 0.1). */
  q05d: p => {
    const f = (x, y) => (x + p.c) * (p.a * p.m - p.a * y);
    let eq = null; for (let y = -200; y <= 200; y += 0.25) if (Math.abs(p.a * p.m - p.a * y) < 1e-9) eq = y;
    return [eq, r3(euler(f, 0, p.m + p.dev, { 2: 0.2, 3: 0.1 }[p.hn], 2))];
  },
});
})();
