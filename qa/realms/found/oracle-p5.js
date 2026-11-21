/* Independent oracles for Foundations practice missions, file 5 of 8: q21b–q25d (game/realms/found/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers. Each oracle first rebuilds the numbers the prompt shows, then works only from those shown numbers. */
/* Steady rate between two readings (x1, y1), (x2, y2), found by search: the whole number r for which stepping
   from y1 by r, once per unit of x, lands exactly on y2. Returns [rate, units stepped]. */
const rateBySearch = (x1, y1, x2, y2) => {
  let units = 0; for (let x = x1; x < x2; x++) units++;
  for (let r = -5000; r <= 5000; r++) {
    let y = y1; for (let i = 0; i < units; i++) y += r;
    if (y === y2) return [r, units];
  }
  return [NaN, units];
};
/* Walk a line from a known point (x0, y0) to x = target, one unit of x at a time, adding or removing the rate. */
const walkTo = (x0, y0, rate, target) => {
  let x = x0, y = y0;
  while (x < target) { x++; y += rate; }
  while (x > target) { x--; y -= rate; }
  return y;
};
/* Value of rate·x + start by repeated addition (x a whole number >= 0). */
const lineAt = (rate, start, x) => { let y = start; for (let i = 0; i < x; i++) y += rate; return y; };
/* Two cost rules y = mA·x + bA and y = mB·x + bB: tabulate both, x = 0, 1, 2, …, until the totals match. */
const meet = (mA, bA, mB, bB) => {
  let a = bA, b = bB;
  for (let x = 0; x <= 100000; x++) { if (a === b) return [x, a]; a += mA; b += mB; }
  return [NaN, NaN];
};
/* Read a worded move ("4 m west") back into a signed number. */
const signed = (size, word) => (word === 'west' || word === 'south' || word === 'down') ? -size : size;
const worded = (v, pos, neg) => [Math.abs(v), v < 0 ? neg : pos];

Object.assign(window.ORACLE, {
  /* Rebuild the two post readings, then: rise by signed counting between the heights, run by counting posts,
     slope by searching for the per-km step that turns y1 into y2. */
  q21b: p => {
    const x1 = p.x1, x2 = p.x1 + p.run, y1 = p.y1, y2 = p.y1 + p.m * p.run;
    let rise = 0; for (let h = y1; h < y2; h++) rise++; for (let h = y1; h > y2; h--) rise--;
    const [slope, run] = rateBySearch(x1, y1, x2, y2);
    return [rise, run, slope];
  },
  /* Rebuild the statement (y2, y1 from y3), find the fall per payment by search, then pay x2+1 … x3 one by one. */
  q21c: p => {
    const x1 = p.x1, x2 = x1 + p.run, x3 = x2 + p.k;
    const y2 = p.y3 - p.m * p.k, y1 = y2 - p.m * p.run;
    const [slope] = rateBySearch(x1, y1, x2, y2);
    return [slope, walkTo(x2, y2, slope, x3)];
  },
  /* Rebuild the three log readings; each stretch's rate by search. */
  q21d: p => {
    const t1 = p.t1, t2 = t1 + p.r1, t3 = t2 + p.r2;
    const T2 = p.T2, T1 = T2 - p.a1 * p.r1, T3 = T2 - p.a2 * p.r2;
    return [rateBySearch(t1, T1, t2, T2)[0], rateBySearch(t2, T2, t3, T3)[0]];
  },
  /* Buy the passes one at a time; the slope is the change one pass makes to the credit. */
  q22b: p => {
    let credit = p.b; const start = credit;
    credit -= p.a; const perPass = credit - start;
    for (let i = 1; i < p.x1; i++) credit -= p.a;
    return [perPass, start, credit];
  },
  /* Add m minutes once per kilogram on top of the extra b; count up from the small bird's time to the large one's. */
  q22c: p => {
    const x2 = p.x1 + p.dx;
    const small = lineAt(p.m, p.b, p.x1), large = lineAt(p.m, p.b, x2);
    let extra = 0; for (let t = small; t < large; t++) extra++;
    return [small, large, extra];
  },
  /* First bill by repeated addition. Second job: only T is shown; add hours to the call-out fee until the bill is T. */
  q22d: p => {
    const T = p.m * p.x2 + p.b;
    let hours = 0, bill = p.b;
    while (bill < T) { bill += p.m; hours++; }
    return [lineAt(p.m, p.b, p.x1), bill === T ? hours : NaN];
  },
  /* Rebuild the two rides; rate by search; walk the line back to 0 km for the pick-up charge. */
  q23b: p => {
    const x1 = p.x1, x2 = x1 + p.run, y1 = p.m * x1 + p.b, y2 = p.m * x2 + p.b;
    const [slope] = rateBySearch(x1, y1, x2, y2);
    return [slope, walkTo(x1, y1, slope, 0)];
  },
  /* Rebuild the two readings from y3 (walk back from x3 at the true rate), then solve from the readings only. */
  q23c: p => {
    const x1 = p.x1, x2 = x1 + p.run, x3 = x2 + p.k;
    const y2 = walkTo(x3, p.y3, p.m, x2), y1 = walkTo(x3, p.y3, p.m, x1);
    const [slope] = rateBySearch(x1, y1, x2, y2);
    return [slope, walkTo(x2, y2, slope, 0), walkTo(x2, y2, slope, x3)];
  },
  /* Word the two places as the prompt does, read them back as signed points, then search and walk. */
  q23d: p => {
    const y1v = -p.m * p.a + p.b, y2v = p.m * p.c + p.b;
    const [wSize, wDir] = worded(y1v, 'north', 'south'), [hSize, hDir] = worded(y2v, 'north', 'south');
    const well = [signed(p.a, 'west'), signed(wSize, wDir)], pump = [signed(p.c, 'east'), signed(hSize, hDir)];
    const [slope] = rateBySearch(well[0], well[1], pump[0], pump[1]);
    return [slope, walkTo(well[0], well[1], slope, 0), walkTo(well[0], well[1], slope, p.c + p.k)];
  },
  /* Word each swim as the prompt does, read it back, and move the diver one metre at a time. */
  q24b: p => {
    const words = [['east', 'west'], ['north', 'south'], ['up', 'down']];
    const pos = p.s.slice();
    [p.d1, p.d2].forEach(d => d.forEach((v, i) => {
      const [size, dir] = worded(v, words[i][0], words[i][1]);
      const step = signed(1, dir);
      for (let n = 0; n < size; n++) pos[i] += step;
    }));
    return pos;
  },
  /* Follow the robot from the dock at (0, 0, 0); the trip back is the move that returns every reading to 0. */
  q24c: p => {
    const at = [0, 0, 0];
    [p.d1, p.d2].forEach(d => d.forEach((v, i) => { at[i] += v; }));
    return at.map(v => { for (let back = -100; back <= 100; back++) if (v + back === 0) return back; return NaN; });
  },
  /* Walk leg by leg; map distance: the whole number whose square is the sum of the squared x and y gaps. */
  q24d: p => {
    let at = p.s.slice();
    [p.d1, p.d2, p.d3].forEach(d => { at = at.map((v, i) => v + d[i]); });
    const gx = at[0] - p.s[0], gy = at[1] - p.s[1], sq = gx * gx + gy * gy;
    let dist = NaN; for (let d = 0; d <= 100; d++) if (d * d === sq) dist = d;
    if (Number.isNaN(dist)) dist = Math.hypot(gx, gy);
    return [at[0], at[1], at[2], dist];
  },
  /* Tabulate both shops day by day until the costs match. */
  q25b: p => meet(p.m1, p.b1, p.m2, p.b2),
  /* Tabulate both printers; then run both totals on to N cartridges and take the gap. */
  q25c: p => {
    const [x, y] = meet(p.m1, p.b1, p.m2, p.b2);
    const a = lineAt(p.m1, p.b1, p.N), b = lineAt(p.m2, p.b2, p.N);
    let gap = 0; for (let c = b; c < a; c++) gap++;
    return [x, y, gap];
  },
  /* Rebuild the drone log (marks at minute 0 and minute t), find each speed by search, then run both
     runners minute by minute until they are at the same mark. */
  q25d: p => {
    const pA = p.m1 * p.t + p.b1, pB = p.m2 * p.t + p.b2;
    const [sA] = rateBySearch(0, p.b1, p.t, pA), [sB] = rateBySearch(0, p.b2, p.t, pB);
    const [x, y] = meet(sA, p.b1, sB, p.b2);
    return [sA, sB, x, y];
  },
});
})();
