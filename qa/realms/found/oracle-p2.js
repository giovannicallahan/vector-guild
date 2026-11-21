/* Independent oracles for Foundations practice missions, file 2 of 8: q06b–q10d (game/realms/found/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers: walking the number line and searching, never the closed formula. */
/* Walk `steps` single steps of size `dir` (+1 or −1) from `from`. */
const walk = (from, steps, dir) => { let x = from; for (let i = 0; i < steps; i++) x += dir; return x; };
/* Number of single steps up from `from` to `to`. */
const stepsUp = (from, to) => { let s = 0; for (let x = from; x < to; x++) s++; return s; };
const repeatAdd = (step, times) => { let s = 0; for (let i = 0; i < times; i++) s += step; return s; };
/* Share `amount` into `parts` equal whole shares by search: the share x with x added `parts` times giving `amount`. */
const share = (amount, parts) => {
  for (let x = 0; x <= amount; x++) if (repeatAdd(x, parts) === amount) return x;
  throw new Error('no whole share of ' + amount + ' in ' + parts);
};
/* The fraction num/den in lowest terms, by search: the smallest denominator D for which num × D ÷ den is whole. */
const lowest = (num, den) => {
  for (let D = 1; D <= den; D++) if ((num * D) % den === 0) return [(num * D) / den, D];
  throw new Error('cannot reduce ' + num + '/' + den);
};
/* Fractions as [numerator, denominator] pairs. Add by counting both in pieces of size 1/(b × d). */
const addFr = (a, b, c, d) => lowest(repeatAdd(a, d) + repeatAdd(c, b), repeatAdd(b, d));
const mulFr = (e, f, g, h) => lowest(repeatAdd(e, g), repeatAdd(f, h));

Object.assign(window.ORACLE, {
  /* Ride the lift one floor at a time. */
  q06b: p => {
    const car = walk(p.f, p.d, -1);
    return [car, walk(car, p.u, +1)];
  },
  /* Take the rent out a dollar at a time, then count the dollars needed to climb to the target. */
  q06c: p => {
    const after = walk(p.b, p.r, -1);
    return [after, stepsUp(after, p.t)];
  },
  /* Run the winch minute by minute. */
  q06d: p => {
    let height = p.h;
    for (let minute = 0; minute < p.t; minute++) height -= p.a;
    const lowered = height;
    for (let minute = 0; minute < p.s; minute++) height += p.b;
    return [lowered, height];
  },
  /* Count the unlit bars; find one bar's hours from the full charge the prompt shows, then add it once per lit bar. */
  q07b: p => {
    let used = 0; for (let bar = p.k + 1; bar <= p.d; bar++) used++;
    const full = repeatAdd(p.w, p.d);
    return [used, p.d, repeatAdd(share(full, p.d), p.k)];
  },
  /* Find one part of the pay by search, take k parts; the rest is what is left after paying both out. */
  q07c: p => {
    const rent = repeatAdd(share(p.pay, p.d1), p.k1);
    const food = repeatAdd(share(p.pay, p.d2), p.k2);
    return [rent, food, stepsUp(rent + food, p.pay)];
  },
  /* The prompt shows the km driven; find one part by search, lay out d parts, count on from driven to the whole. */
  q07d: p => {
    const driven = repeatAdd(p.unit, p.k);
    const whole = repeatAdd(share(driven, p.k), p.d);
    return [whole, stepsUp(driven, whole)];
  },
  /* Smallest-denominator search on m/60. */
  q08b: p => lowest(p.m, 60),
  /* Work from what the prompt shows (total and free), not from p and q. */
  q08c: p => {
    const free = p.total - (p.p * p.total) / p.q;
    return lowest(stepsUp(free, p.total), p.total);
  },
  /* Lay the rows out one at a time; the prompt shows the tiles laid. */
  q08d: p => {
    const all = repeatAdd(p.c, p.r);
    const laid = (p.p * all) / p.q;
    return [all].concat(lowest(laid, all));
  },
  q09b: p => addFr(p.a, p.b, p.c, p.d).concat(mulFr(p.e, p.f, p.g, p.h)),
  q09c: p => {
    const milk = mulFr(p.e, p.f, p.g, p.h);
    return milk.concat(addFr(milk[0], milk[1], p.c, p.d));
  },
  /* Fraction saved, then N of the D equal parts of the price, then count up to the price. */
  q09d: p => {
    const [N, D] = addFr(p.a, p.b, p.c, p.d);
    const saved = repeatAdd(share(p.price, D), N);
    return [N, D, saved, stepsUp(saved, p.price)];
  },
  /* Work in whole hundredths of a second: count up from Ben's time to Ana's; add by counting on. */
  q10b: p => [stepsUp(p.B, p.A) / 100, walk(p.A, p.B, +1) / 100],
  /* Work in whole cents: ring the items up, take the coupon off, count the change up from the amount to the note. */
  q10c: p => {
    let bill = 0; for (const item of [p.x, p.y, p.z]) bill = walk(bill, item, +1);
    const pay = walk(bill, p.c, -1);
    return [bill / 100, pay / 100, stepsUp(pay, repeatAdd(100, p.N)) / 100];
  },
  /* Work in whole hundredths of a degree, one hundredth at a time. */
  q10d: p => {
    const night = walk(p.s, p.w, -1);
    return [night / 100, walk(night, p.u, +1) / 100];
  },
});
})();
