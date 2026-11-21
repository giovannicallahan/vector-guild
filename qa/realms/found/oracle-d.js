/* Independent oracles for Foundations chapter 7 "Functions and angles", q36–q40 (game/realms/found/missions-d.js).
   Each one rebuilds the situation the prompt describes from the generator's parameters and answers it by a
   different method from build(): stepping the winch minute by minute, sliding graph points, bisection for an
   inverse, running the relay stages one by one, and turning a boom by the angle of the guy wire. */
(function(){ 'use strict';
/* Bisection: the x in [lo, hi] where the increasing function f reaches y. */
const solveUp = (f, y, lo, hi) => { for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < y) lo = mid; else hi = mid; } return (lo + hi) / 2; };
Object.assign(window.ORACLE, {
  /* L(t): start with c metres hanging and add m metres for each minute run. The range is every length met
     while t runs over the domain 0..H, scanned in thousandths of the domain (endpoints included). */
  q36: p => {
    const L = t => { let len = p.c; for (let i = 0; i < t; i++) len += p.m; return len; };   // whole minutes
    const at = t => p.m * t + p.c;                                                          // any time in the domain
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 1000; i++) { const v = at(p.H * i / 1000); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    return [L(p.a), lo, hi];
  },
  /* The new graph is the old graph slid h to the right: the point of p above x = a is the old point above the
     x that lands on a after sliding. Find it among the old graph's points, then count k degrees per step. */
  q37: p => {
    const oldPoints = []; for (let x = -50; x <= 50; x++) oldPoints.push([x, p.m * x + p.c]);
    const moved = oldPoints.map(([x, y]) => [x + p.h, y]);
    const hit = moved.find(([x]) => x === p.a);
    const steps = hit ? hit[1] : NaN;
    let deg = 0; for (let i = 0; i < steps; i++) deg += p.k;
    return [steps, deg];
  },
  /* P(s) = m s + c. Invert it numerically by bisection, then read a and b off two points of the inverse:
     P⁻¹(w) = (w − a) ÷ b has slope 1 ÷ b and is 0 at w = a. The logged wattage is P at the hidden setting. */
  q38: p => {
    const power = s => p.m * s + p.c, logged = power(p.s);
    const inv = w => solveUp(power, w, -1e4, 1e4);
    const w1 = 100, w2 = 1100, slope = (inv(w2) - inv(w1)) / (w2 - w1);
    const b = 1 / slope, a = w1 - b * inv(w1);
    return [a, b, inv(logged)];
  },
  /* Run the signal through the relays one at a time; for the second signal, keep adding relays until it reaches
     the target strength. */
  q39: p => {
    let s = p.S; for (let i = 0; i < p.n; i++) s *= p.b;
    const target = p.S * Math.pow(p.b, p.k);
    let t = p.S, stages = 0; while (t < target && stages < 100) { t *= p.b; stages++; }
    return [s, t === target ? stages : NaN];
  },
  /* Sides as stated: mast k·o high, anchor k·d from the foot, cable k·h. Reject a cable that cannot close the
     right triangle; take the angle at the anchor with atan2, then turn a boom of the given length up from flat
     by that angle and read the coordinates of its tip. */
  q40: p => {
    const H = p.k * p.o, D = p.k * p.d, L = p.k * p.h;
    if (Math.abs(Math.hypot(H, D) - L) > 1e-9) return [NaN, NaN, NaN];
    const th = Math.atan2(H, D);
    const turn = r => [r * Math.cos(th), r * Math.sin(th)];
    const unit = turn(1), boom = turn(p.arm);
    return [unit[1], unit[0], boom[1]];
  },
});
})();
