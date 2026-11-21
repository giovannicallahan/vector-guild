/* Independent oracles for Calculus 1 learn missions, file d: q31–q40 (game/realms/calc1/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build(): a table of values, a numerical limit or difference quotient with a small
   step, a numerical integral, a search or a general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
 // q31: fence on three sides. Search x on a fine grid for the largest area x(L - 2x).
 q31: p => {
   let bx = 0, ba = -1;
   for (let i = 0; i <= p.L * 200; i++) { const x = i / 400, a = x * (p.L - 2 * x); if (a > ba + 1e-12) { ba = a; bx = x; } }
   return [bx, p.L - 2 * bx, bx * (p.L - 2 * bx)];
 },
 /* q32: d(t) = at² + bt. Average speed from the two positions; then bisect for the time where a small symmetric
    difference of d equals that average. */
 q32: p => {
   const d = t => p.a * t * t + p.b * t, h = 1e-4;
   const avg = (d(p.t2) - d(p.t1)) / (p.t2 - p.t1);
   const g = t => (d(t + h) - d(t - h)) / (2 * h) - avg;
   let lo = p.t1, hi = p.t2;
   for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
   return [avg, (lo + hi) / 2];
 },
 /* q33: (e^(ax) − 1)/sin(bx) at 0. Derivatives by symmetric differences, limit by evaluating either side of 0. */
 q33: p => {
   const top = x => Math.expm1(p.a * x), bot = x => Math.sin(p.b * x), h = 1e-5;
   const dt = (top(h) - top(-h)) / (2 * h), db = (bot(h) - bot(-h)) / (2 * h);
   const x = 1e-6, f = z => top(z) / bot(z);
   return [dt, db, (f(x) + f(-x)) / 2];
 },
 /* q34: Newton on f(x) = x² − N from x0: follow the tangent line (slope by symmetric difference) down to the axis. */
 q34: p => {
   const f = x => x * x - p.N, step = x => { const h = 1e-3, m = (f(x + h) - f(x - h)) / (2 * h); return x - f(x) / m; };
   const x1 = step(p.x0), x2 = step(x1);
   return [x1, Math.round(x2 * 1000) / 1000];
 },
 /* q35: r(t) = 3a t² + 2b t + c; the antiderivative with C = 0 is V(t) = pt³ + qt² + st. Integrate r numerically
    from 0 to t = 1, 2, 3 and solve the 3×3 system for p, q, s. */
 q35: p => {
   const r = t => 3 * p.a * t * t + 2 * p.b * t + p.c;
   const simp = (lo, hi) => { const n = 400, h = (hi - lo) / n; let s = r(lo) + r(hi); for (let i = 1; i < n; i++) s += r(lo + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
   const M = [1, 2, 3].map(t => [t * t * t, t * t, t, simp(0, t)]);
   for (let c = 0; c < 3; c++) {
     let piv = c; for (let i = c + 1; i < 3; i++) if (Math.abs(M[i][c]) > Math.abs(M[piv][c])) piv = i;
     [M[c], M[piv]] = [M[piv], M[c]];
     for (let i = 0; i < 3; i++) if (i !== c) { const k = M[i][c] / M[c][c]; for (let j = c; j < 4; j++) M[i][j] -= k * M[c][j]; }
   }
   return M.map((row, i) => row[3] / row[i]);
 },
 /* q36: r(t) = 2a t + b. The gauge at t1 is C plus the area under r from 0 to t1; the level at T is the gauge plus
    the area from t1 to T (fine midpoint sums). */
 q36: p => {
   const r = t => 2 * p.a * t + p.b;
   const area = (lo, hi) => { const n = 20000, h = (hi - lo) / n; let s = 0; for (let i = 0; i < n; i++) s += r(lo + (i + 0.5) * h); return s * h; };
   const gauge = p.C + area(0, p.t1);
   return [gauge - area(0, p.t1), gauge + area(p.t1, p.T)];
 },
 /* q37: r(t) = a t² + c on [0, w·k] with k rectangles of width w: add up the rectangles at each end. */
 q37: p => {
   const r = t => p.a * t * t + p.c; let left = 0, right = 0;
   for (let i = 0; i < p.k; i++) { left += r(i * p.w) * p.w; right += r((i + 1) * p.w) * p.w; }
   return [p.w, left, right];
 },
 /* q38: r(t) = b·t0 − b·t: integrate the positive and negative parts separately over 0..t0 and t0..t0+m
    with fine midpoint sums. */
 q38: p => {
   const r = t => p.b * p.t0 - p.b * t;
   const sum = (lo, hi) => { const n = 20000, h = (hi - lo) / n; let s = 0; for (let i = 0; i < n; i++) s += r(lo + (i + 0.5) * h); return s * h; };
   const up = sum(0, p.t0), down = -sum(p.t0, p.t0 + p.m);
   return [up, down, up - down];
 },
 /* q39: r(t) = 3a t² + 2b t. F(x) is the area under r from 0 to x (Simpson); the integral is F(q) − F(p) from
    its own panels over [p, q]. */
 q39: p => {
   const r = t => 3 * p.a * t * t + 2 * p.b * t;
   const simp = (lo, hi) => { if (hi === lo) return 0; const n = 400, h = (hi - lo) / n; let s = r(lo) + r(hi); for (let i = 1; i < n; i++) s += r(lo + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
   return [simp(0, p.p), simp(0, p.q), simp(p.p, p.q)];
 },
 /* q40: r(t) = 3a(t0² − t²). The volume peaks where r changes from positive to negative: bisect for that
    time; net change by Simpson over [0, T]; final volume = V0 + net. */
 q40: p => {
   const r = t => 3 * p.a * (p.t0 * p.t0 - t * t);
   let lo = 0, hi = p.T;
   for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (r(m) > 0) lo = m; else hi = m; }
   const n = 400, h = p.T / n; let s = r(0) + r(p.T);
   for (let i = 1; i < n; i++) s += r(i * h) * (i % 2 ? 4 : 2);
   const net = s * h / 3;
   return [(lo + hi) / 2, net, p.V0 + net];
 },
});
})();
