/* Independent oracles for linear algebra practice missions, file 1 of 14: q01–q05 (game/realms/la/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Walk a list of moves one unit at a time from the origin and read where you end up. */
const walk = (moves, dims) => {
  const at = new Array(dims).fill(0);
  for (const move of moves) move.forEach((d, axis) => { for (let step = 0; step < Math.abs(d); step++) at[axis] += Math.sign(d); });
  return at;
};
/* n lots of x by repeated addition (n may be negative: take lots away). */
const lots = (n, x) => { let s = 0; for (let i = 0; i < Math.abs(n); i++) s += n < 0 ? -x : x; return s; };
/* Dot product as repeated addition, entry by entry. */
const dot = (u, v) => u.reduce((s, x, i) => s + lots(x, v[i]), 0);
/* Whole-number length by search: the L with L × L equal to the sum of squares; NaN when there is none. */
const wholeLength = v => { const q = dot(v, v); for (let L = 0; L * L <= q; L++) if (L * L === q) return L; return NaN; };
/* Cross product from the definition with the permutation sign (+1 for xyz, yzx, zxy; −1 for the reversed orders),
   then checked: the result must be at right angles to both inputs. */
const cross = (a, b) => {
  const c = [0, 0, 0];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
    if (i === j || j === k || i === k) continue;
    const sign = (j - i + 3) % 3 === 1 ? 1 : -1;
    c[i] += sign * a[j] * b[k];
  }
  return dot(c, a) === 0 && dot(c, b) === 0 ? c : [NaN, NaN, NaN];
};
/* Angle between two flat arrows in degrees, from their compass bearings (not from the dot product). */
const angleBetween = (u, v) => {
  let d = Math.abs(Math.atan2(u[1], u[0]) - Math.atan2(v[1], v[0])) * 180 / Math.PI;
  if (d > 180) d = 360 - d;
  return d;
};
const cosDeg = deg => Math.cos(deg * Math.PI / 180);

Object.assign(window.ORACLE, {
  /* Walk each move one metre at a time from the start point and read where the pod ends up. */
  q01b: p => {
    const at = [0, 0, 0];
    for (const move of [p.a, p.b]) move.forEach((d, axis) => { for (let step = 0; step < Math.abs(d); step++) at[axis] += Math.sign(d); });
    return at;
  },
  /* Café stock: start from the opening stock and move pack by pack through the delivery and the sales. */
  q01c: p => walk([p.S, p.D, p.O], 3),
  /* Kayak: search for the paddling move that, walked after tide and wind, lands on the target. */
  q01d: p => {
    const out = [NaN, NaN];
    for (let axis = 0; axis < 2; axis++) for (let m = -30; m <= 30; m++) {
      const moves = [[0, 0], [0, 0], [0, 0]];
      moves[0][axis] = p.tide[axis]; moves[1][axis] = p.wind[axis]; moves[2][axis] = m;
      if (walk(moves, 2)[axis] === p.target[axis]) out[axis] = m;
    }
    return out;
  },
  /* Ferry: whole-number length by search; the unit arrow is checked to have length 1 and to rebuild v. */
  q02b: p => {
    const L = wholeLength(p.v), u = p.v.map(x => x / L);
    const ok = Math.abs(u[0] * u[0] + u[1] * u[1] - 1) < 1e-9 && u.every((x, i) => Math.abs(x * L - p.v[i]) < 1e-9);
    return ok ? [L, u[0], u[1]] : [NaN, NaN, NaN];
  },
  /* Cable: length by search, cost by paying for one metre at a time. */
  q02c: p => { const L = wholeLength(p.d); return [L, lots(L, p.price)]; },
  /* Drone: walk both legs, length by search, unit arrow checked to have length 1. */
  q02d: p => {
    const s = walk([p.a, p.b], 3), L = wholeLength(s), u = s.map(x => x / L);
    return Math.abs(u[0] * u[0] + u[1] * u[1] + u[2] * u[2] - 1) < 1e-9 ? [L, u[0], u[1], u[2]] : [NaN, NaN, NaN, NaN];
  },
  /* Shop order: add each price once per item bought, take it away once per item handed back. */
  q03b: p => [dot(p.q, p.c)],
  /* League: score each season event by event; the gap is found by counting from Ben's score to Ana's. */
  q03c: p => {
    const score = S => { let t = 0; S.forEach((n, kind) => { for (let i = 0; i < n; i++) t += p.w[kind]; }); return t; };
    const ana = score(p.A), ben = score(p.B);
    let gap = 0; while (ben + gap < ana) gap++; while (ben + gap > ana) gap--;
    return [ana, ben, gap];
  },
  /* Cranes: total force by walking both pulls; work as the sum of the work each crane does alone. */
  q03d: p => { const F = walk([p.F1, p.F2], 3); return [F[0], F[1], F[2], dot(p.F1, p.d) + dot(p.F2, p.d)]; },
  /* Valve, triangle: cross product from the permutation definition, checked at right angles to both inputs. */
  q04b: p => cross(p.r, p.F),
  q04c: p => cross(p.a, p.b),
  /* Robot arm: the torque of the total force is the torque of the weight plus the torque of the wall push. */
  q04d: p => { const t1 = cross(p.r, p.F1), t2 = cross(p.r, p.F2); return t1.map((x, i) => x + t2[i]); },
  /* Park paths: both arrows are whole numbers; measure the angle from their bearings, then take its cosine. */
  q05b: p => { const deg = angleBetween(p.u, p.v); return [cosDeg(deg), deg]; },
  /* Films: angles from bearings; the closer match is the film with the smaller angle. */
  q05c: p => {
    const dA = angleBetween(p.t, p.A), dB = angleBetween(p.t, p.B);
    return [cosDeg(dA), cosDeg(dB), dA < dB ? 1 : dB < dA ? 2 : NaN];
  },
  /* Orienteering: add the legs, then measure the angle between leg one and the straight line from bearings. */
  q05d: p => {
    const s = [p.a + p.c, p.k * Math.sqrt(p.r)];
    const deg = angleBetween([p.a, 0], s);
    return [cosDeg(deg), deg];
  },
});
})();
