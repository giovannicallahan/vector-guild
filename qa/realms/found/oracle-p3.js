/* Independent oracles for Foundations practice missions, file 3 of 8: q11b–q15d (game/realms/found/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Exact rational helpers, so no oracle depends on floating-point percent arithmetic. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
/* x percent of whole, in exact hundredths: count the hundredths, then read whole units and a remainder. */
const percentOf = (x, whole) => {
  const hundredths = x * whole;                 // integer when x and whole are integers
  const units = Math.floor(hundredths / 100), rest = hundredths - units * 100;
  return units + rest / 100;
};
/* Repeated addition: n lots of x. */
const lots = (n, x) => { let s = 0; for (let i = 0; i < n; i++) s += x; return s; };
/* Smallest whole q with q × d = total (division by search); NaN when there is none. */
const shareOut = (total, d) => { for (let q = 0; q <= total; q++) if (q * d === total) return q; return NaN; };
/* Collect a linear expression a·x + b from terms [coefficient, constant], by sampling it at x = 0 and x = 1. */
const linear = f => { const b = f(0); return [f(1) - b, b]; };

Object.assign(window.ORACLE, {
  /* Sale tag: the price that is left is (100 − p) percent; the amount off is the gap to the full price. */
  q11b: p => {
    const sale = percentOf(100 - p.p, p.C);
    return [p.C - sale, sale];
  },
  /* Pay slip: take-home is the (100 − t − s) percent that is left; tax and pension by counting hundredths. */
  q11c: p => {
    const tax = percentOf(p.t, p.P), pension = percentOf(p.s, p.P);
    return [tax, pension, percentOf(100 - p.t - p.s, p.P)];
  },
  /* Food label: search for the smallest denominator that gives a whole numerator; grams by 1% blocks. */
  q11d: p => {
    let num = NaN, den = NaN;
    for (let d = 1; d <= 100; d++) { if ((p.p * d) % 100 === 0) { den = d; num = p.p * d / 100; break; } }
    return [num, den, lots(p.p, p.W / 100)];
  },
  /* Step count: pace by search from the counted steps, whole walk by adding one minute at a time. */
  q12b: p => {
    const counted = p.r * p.m;
    const pace = shareOut(counted, p.m);
    return [pace, lots(p.T, pace)];
  },
  /* Recipe: per-person amounts recovered from the recipe totals, then added once per person tonight. */
  q12c: p => {
    const rice = p.s * p.g, water = p.s * p.w;
    const riceEach = shareOut(rice, p.s), waterEach = shareOut(water, p.s);
    return [riceEach, lots(p.N, riceEach), lots(p.N, waterEach)];
  },
  /* Map scale: km per cm by search, distance by adding per cm, hours by walking v km at a time. */
  q12d: p => {
    const perCm = shareOut(p.k * p.c, p.c);
    const km = lots(p.d, perCm);
    let hours = 0, walked = 0;
    while (walked < km) { walked += p.v; hours++; }
    return [perCm, km, walked === km ? hours : km / p.v];
  },
  /* Phone bill: evaluate the bill for a price g, read off the coefficient and the constant. */
  q13b: p => linear(g => lots(p.a, g) + lots(p.b, g) + p.d),
  /* Fence: back, two sides, two gates, as a function of the panel width. */
  q13c: p => linear(w => lots(p.f, w) + lots(p.s, w) + lots(p.s, w) + p.g + p.g),
  /* Fuel crate: weigh it tray by tray, can by can. */
  q13d: p => linear(c => {
    let total = p.W;
    for (let tray = 0; tray < p.t; tray++) { total += p.w; for (let can = 0; can < p.r; can++) total += c; }
    return total;
  }),
  /* Savings jar: add the weekly amount one week at a time. */
  q14b: p => {
    const after = weeks => { let jar = p.S; for (let i = 0; i < weeks; i++) jar += p.r; return jar; };
    return [after(p.w1), after(p.w2)];
  },
  /* Van hire: drive kilometre by kilometre for each firm, then the gap between the two bills. */
  q14c: p => {
    let a = p.FA, b = p.FB;
    for (let i = 0; i < p.k; i++) { a += p.RA; b += p.RB; }
    return [a, b, Math.abs(a - b)];
  },
  /* Market stall: start in debt by the stall cost and sell one jar at a time. */
  q14d: p => {
    const day = jars => { let money = -p.F; for (let i = 0; i < jars; i++) money += p.R; return money; };
    return [day(p.n1), day(p.n2)];
  },
  /* Cinema: total cost as a function of the ticket price, ticket by ticket. */
  q15b: p => linear(t => lots(p.k, t + p.s) + lots(p.m, t)),
  /* Club kit: kit by kit. */
  q15c: p => linear(s => lots(p.a, s + p.p) + lots(p.b, s + p.q)),
  /* Convoy: rover by rover, then the sled; the total is the original expression at c = v. */
  q15d: p => {
    const litres = c => lots(p.k, c + p.s) + lots(p.m, c) + p.e;
    const [coef, plain] = linear(litres);
    return [coef, plain, litres(p.v)];
  },
});
})();
