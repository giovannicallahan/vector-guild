/* Independent oracles for Mechanics: motion and force practice missions, file 3 of 8: q11b–q15d (game/realms/mech/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const G = 9.8;
/* Composite Simpson's rule on [a, b]: the numerical stand-in for every integral of a(t) or v(t). */
const simpson = (f, a, b, n = 4000) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Time for a fall of height h from rest: bisect on the drop ½ g t² = h (no square-root formula). */
const fallTime = h => {
  let lo = 0, hi = 1e3;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (0.5 * G * m * m < h) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
/* Flight time of a launch from the ground: bisect the first t > 0 where height v sinθ t − ½ g t² returns to 0. */
const flightTime = (v, th) => {
  const y = t => v * Math.sin(th) * t - 0.5 * G * t * t;
  let lo = (v * Math.sin(th)) / G, hi = 4 * lo + 1; /* lo is the top of the arch, where y > 0; hi is far past landing */
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (y(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
Object.assign(window.ORACLE, {
  /* q11b: a = b − c t, v(0) = v0. Velocity and distance by Simpson on a(t) and then v(t); no turn-back, so distance = ∫v. */
  q11b: p => {
    const v = t => p.v0 + simpson(s => p.b - p.c * s, 0, t, 400);
    return [v(p.T), simpson(v, 0, p.T, 400)];
  },
  /* q11c: a = −c t and the printed starting speed v0. It stops at the first t where v = 0: bisect, with the bracket grown until v < 0. */
  q11c: p => {
    const v0 = p.v0;
    const v = t => v0 + simpson(s => -p.c * s, 0, t, 400);
    let lo = 0, hi = 1;
    while (v(hi) > 0) hi *= 2;
    for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (v(m) > 0) lo = m; else hi = m; }
    const tr = (lo + hi) / 2;
    return [tr, simpson(v, 0, tr, 400)];
  },
  /* q11d: booster phase a = b + c t from v0 for T s; then a steady brake d: stopping distance by constant-deceleration table v² = 2 d s. */
  q11d: p => {
    const v = t => p.v0 + simpson(s => p.b + p.c * s, 0, t, 400);
    const vT = v(p.T), boost = simpson(v, 0, p.T, 400);
    const s = simpson(t => vT - p.d * t, 0, vT / p.d, 400);
    return [vT, boost + s];
  },
  /* q12b: fall h from rest by bisection, then the crate travels u × t along the ground. Rounded to 2 places; distance from unrounded t. */
  q12b: p => { const t = fallTime(p.h); return [r2(t), r2(p.u * t)]; },
  /* q12c: landing distance u t; the second box is that minus the pad's near edge D (negative if short). */
  q12c: p => { const t = fallTime(p.h), x = p.u * t; return [r2(x), r2(x - p.D)]; },
  /* q12d: th is radians north of east; east = u cosθ t, north = u sinθ t. */
  q12d: p => { const t = fallTime(p.h); return [r2(t), r2(p.u * Math.cos(p.th) * t), r2(p.u * Math.sin(p.th) * t)]; },
  /* q13b: time of flight from the height equation by bisection; range = horizontal speed × time. */
  q13b: p => { const t = flightTime(p.v, p.th); return [r2(t), r2(p.v * Math.cos(p.th) * t)]; },
  /* q13c: range as above; the rover covers that distance in the same time, so its speed is range ÷ time. */
  q13c: p => { const t = flightTime(p.v, p.th), R = p.v * Math.cos(p.th) * t; return [r2(R), r2(R / t)]; },
  /* q13d: greatest height from v_y² = 2 g H by marching the climb in tiny steps; range = 2 × sideways distance of the fall from the top. */
  q13d: p => {
    const vy = p.v * Math.sin(p.th); let H = 0;
    /* climb: integrate the vertical speed vy − g t up to the top (t = vy / g) with Simpson */
    H = simpson(s => vy - G * s, 0, vy / G, 400);
    const fall = fallTime(H);
    return [r2(H), r2(2 * p.v * Math.cos(p.th) * fall)];
  },
  /* q14b: N turns a minute. Speed = circumference ÷ period (period 60/N s); acceleration from the unrounded speed. */
  q14b: p => { const T = 60 / p.N, v = 2 * Math.PI * p.r / T; return [r2(v), r2(v * v / p.r)]; },
  /* q14c: a = v²/r at the limit, so v = √(a r) (by bisection); period = circumference ÷ v; turns per minute = 60 ÷ period. */
  q14c: p => {
    let lo = 0, hi = 1e4;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (m * m / p.r < p.a) lo = m; else hi = m; }
    const v = (lo + hi) / 2, T = 2 * Math.PI * p.r / v;
    return [r2(v), r2(T), r2(60 / T)];
  },
  /* q14d: km/h to m/s by ×1000 ÷ 3600 (exact); period and centripetal acceleration from unrounded values. */
  q14d: p => {
    const v = p.kmh * 1000 / 3600, T = 2 * Math.PI * p.r / v;
    return [Math.round(v * 1e6) / 1e6, r2(T), r2(v * v / p.r)];
  },
  /* q15b: centripetal v²/r is along the radius, tangential at is along the path: they are at right angles, so the total is the hypotenuse. */
  q15b: p => { const ac = p.v * p.v / p.r; return [r2(ac), r2(Math.hypot(ac, p.at))]; },
  /* q15c: from rest the speed after t s is at × t (summed second by second); then as q15b. */
  q15c: p => {
    let v = 0; for (let i = 0; i < p.t; i++) v += p.at;
    const ac = v * v / p.r; return [r2(ac), r2(Math.hypot(ac, p.at))];
  },
  /* q15d: tangential acceleration = change of speed ÷ time between readings; centripetal from the second reading's speed. */
  q15d: p => {
    const at = (p.v2 - p.v1) / p.dt, ac = p.v2 * p.v2 / p.r;
    return [Math.round(at * 1e6) / 1e6, r2(ac), r2(Math.hypot(ac, at))];
  }
});
})();
