/* Independent oracles for Foundations practice missions, file 4 of 8: q16b–q20d (game/realms/found/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers: counting and search, never the closed formula. */
const repeatAdd = (step, times) => { let s = 0; for (let i = 0; i < times; i++) s += step; return s; };
/* The whole number v (0..limit) for which test(v) holds; NaN when there is none, so a bad draw fails loudly. */
const findWhole = (test, limit) => { for (let v = 0; v <= (limit || 100000); v++) if (test(v)) return v; return NaN; };
/* Take lots of `size` out of `stock` one at a time: [lots, what is left]. */
const takeOut = (stock, size) => { let lots = 0, left = stock; while (left >= size) { left -= size; lots++; } return [lots, left]; };
/* The whole number whose product with itself is `sq`, found by trying 0, 1, 2, ... */
const wholeRoot = sq => findWhole(v => v * v === sq, sq + 1);
/* Walk a point on a grid one unit at a time. dir: 'E', 'W', 'N' or 'S'. */
const walk = (pt, dir, steps) => {
  let [x, y] = pt;
  for (let i = 0; i < steps; i++) { if (dir === 'E') x++; else if (dir === 'W') x--; else if (dir === 'N') y++; else y--; }
  return [x, y];
};
/* Count the unit steps between two whole numbers on a number line. */
const gap = (u, v) => { let lo = Math.min(u, v), hi = Math.max(u, v), steps = 0; while (lo < hi) { lo++; steps++; } return steps; };
/* Straight distance between two grid points: build the two squares by repeated addition, then search for the root. */
const straight = (A, B) => { const gx = gap(A[0], B[0]), gy = gap(A[1], B[1]); return wholeRoot(repeatAdd(gx, gx) + repeatAdd(gy, gy)); };

Object.assign(window.ORACLE, {
  /* Receipt: what is shown is c, a and b. Search for the tin price that makes k tins cost c, and for the bill t
     that leaves b once the voucher is taken off. */
  q16b: p => {
    const c = repeatAdd(p.p, p.k);            // the shown paint total
    let t = c; for (let i = 0; i < p.extra; i++) t++;   // paint plus the other items
    let b = t; for (let i = 0; i < p.a; i++) b--;       // the shown amount paid
    const price = findWhole(v => repeatAdd(v, p.k) === c);
    const bill = findWhole(v => v - p.a === b);
    return [price, bill];
  },
  /* Tram strip: shown are k, c and b. Search for the ride price; then search for the morning balance from which
     two rides, taken off one at a time, leave b. */
  q16c: p => {
    const c = repeatAdd(p.t, p.k);
    const ride = findWhole(v => repeatAdd(v, p.k) === c);
    const morning = findWhole(v => { let left = v; left -= ride; left -= ride; return left === p.b; });
    return [ride, morning];
  },
  /* Tiles: shown are m, p, T and b. Count the boxes one by one, share T tiles among them by taking one box-load at a
     time, and search for the stock that leaves b. */
  q16d: p => {
    const T = repeatAdd(p.t, p.m) + repeatAdd(p.t, p.p);
    let boxes = 0; for (let i = 0; i < p.m; i++) boxes++; for (let i = 0; i < p.p; i++) boxes++;
    const perBox = findWhole(v => repeatAdd(v, boxes) === T);
    const stock = findWhole(v => v - T === p.b);
    return [boxes, perBox, stock];
  },
  /* Cinema: shown are k, b and T. Search for the ticket price that satisfies kx − b = T, then price the tickets. */
  q17b: p => {
    const T = repeatAdd(p.x, p.k) - p.b;
    const x = findWhole(v => repeatAdd(v, p.k) - p.b === T);
    return [repeatAdd(x, p.k), x];
  },
  /* Pay slip: shown are k, m, b and T. Search for the hourly rate that satisfies the equation exactly as printed
     (kx + mx + b = T), then pay each hour one at a time. */
  q17c: p => {
    const T = repeatAdd(p.x, p.k) + repeatAdd(p.x, p.m) + p.b;
    const x = findWhole(v => repeatAdd(v, p.k) + repeatAdd(v, p.m) + p.b === T);
    let hours = 0; for (let i = 0; i < p.k + p.m; i++) hours++;
    return [hours, repeatAdd(x, hours), x];
  },
  /* Savings: P% of F means P dollars for every 100 dollars of target. Then make the deposits one at a time for each
     candidate x until the fund matches. */
  q17d: p => {
    const [hundreds, rest] = takeOut(p.F, 100);
    const saved = repeatAdd(p.P, hundreds) + rest * p.P / 100;
    const x = findWhole(v => { let fund = p.b; for (let i = 0; i < p.k; i++) fund += v + p.s; return fund === saved; });
    return [saved, x];
  },
  /* Dinner: shown are w, base and cap. Pay for the room, then add guests one at a time while the bill still fits. */
  q18b: p => {
    const cap = p.base + repeatAdd(p.w, p.nmax) + p.extra;
    const forMeals = gap(p.base, cap);
    let n = 0; while (p.w * (n + 1) + p.base <= cap) n++;
    return [forMeals, n];
  },
  /* Gym: shown are w, a, b and cap. Take the warm-up and the stretch off, then fit circuits one at a time. */
  q18c: p => {
    const cap = p.a + p.b + repeatAdd(p.w, p.nmax) + p.extra;
    let free = cap; for (let i = 0; i < p.a; i++) free--; for (let i = 0; i < p.b; i++) free--;
    const [circuits, over] = takeOut(free, p.w);
    return [free, circuits, over];
  },
  /* Laptop: shown are w, base and G. Save week by week until the target is reached or passed. */
  q18d: p => {
    const base = p.G - (repeatAdd(p.w, p.q) + p.r);
    const toSave = gap(base, p.G);
    let weeks = 0, savings = base;
    while (savings < p.G) { savings += p.w; weeks++; }
    return [toSave, weeks, gap(p.G, savings)];
  },
  /* City map: walk from the town hall one block at a time. */
  q19b: p => {
    const library = walk(walk([0, 0], 'E', p.a), 'S', p.b);
    const tram = walk([0, 0], 'W', p.c);
    return [library[0], library[1], tram[0], tram[1]];
  },
  /* Rover: walk each leg one kilometre at a time from the gate. */
  q19c: p => {
    const flag1 = walk(walk([p.x0, p.y0], 'E', p.a), 'N', p.b);
    const flag2 = walk(walk(flag1, 'W', p.c), 'S', p.d);
    return [flag1[0], flag1[1], flag2[0], flag2[1]];
  },
  /* Atlas: the lake is A km east and B km south; step one square (k km) at a time until the distance is covered.
     The village is p squares west and q squares north; add k km for every square. */
  q19d: p => {
    const A = repeatAdd(p.k, p.a), B = repeatAdd(p.k, p.b);
    let lake = [0, 0], east = 0, south = 0;
    while (east < A) { lake = walk(lake, 'E', 1); east += p.k; }
    while (south < B) { lake = walk(lake, 'S', 1); south += p.k; }
    const village = [-p.p, p.q];
    const kmWest = repeatAdd(p.k, gap(village[0], 0)), kmNorth = repeatAdd(p.k, gap(0, village[1]));
    return [lake[0], lake[1], kmWest, kmNorth];
  },
  /* Rectangle: build each square by repeated addition, then search for the whole number whose square is the sum.
     The stated d is not used. */
  q20b: p => {
    const sum = repeatAdd(p.W, p.W) + repeatAdd(p.L, p.L);
    return [sum, wholeRoot(sum)];
  },
  /* Towns: only the two printed points are used. Count the grid steps each way, then search for the root. */
  q20c: p => {
    const ashby = [p.x1, p.y1], brook = [p.x1 + p.dx, p.y1 + p.sy * p.dy];
    const road = gap(ashby[0], brook[0]) + gap(ashby[1], brook[1]);
    const ferry = straight(ashby, brook);
    return [road, ferry, gap(ferry, road)];
  },
  /* Drone: build the three printed points as the prompt's rule says, then measure each leg from the points alone. */
  q20d: p => {
    const pad = [p.x0, p.y0];
    const c1 = [p.x0 + p.sx1 * p.dx1, p.y0 + p.sy1 * p.dy1];
    const c2 = [c1[0] > 0 ? c1[0] - p.dx2 : c1[0] + p.dx2, c1[1] > 0 ? c1[1] - p.dy2 : c1[1] + p.dy2];
    const leg1 = straight(pad, c1), leg2 = straight(c1, c2);
    return [leg1, leg2, repeatAdd(1, leg1) + leg2];
  },
});
})();
