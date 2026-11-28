/* Independent oracles for Probability practice missions, file 3 of 8: q11b–q15d (game/realms/prob/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = (n, d) => Math.round(n * 1000 / d) / 1000;
const r6 = x => Math.round(x * 1e6) / 1e6;
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
/* Fill the missing entry (index m) of a list of hundredths so that the list sums to 100. */
const fill = (p, m) => { const q = p.slice(); let rest = 100; q.forEach((v, i) => { if (i !== m) rest -= v; }); q[m] = rest; return q; };
Object.assign(window.ORACLE, {
  /* q11b: build the 2 x 2 table cell by cell, then read the flat column and the union by listing cells. */
  q11b: p => {
    const cells = { b1c: p.a, b1f: p.b, b2c: p.c, b2f: p.d };
    const flat = cells.b1f + cells.b2f;
    let union = 0; for (const k in cells) if (k.startsWith('b1') || k.endsWith('c')) union += cells[k];
    return [r3(cells.b2f, flat), r6(union / p.T)];
  },
  /* q11c: sent back = Ridgeline (sound or cracked) plus Northway cracked. */
  q11c: p => {
    const back = p.c + p.d + p.b;
    return [back, r6(back / p.T), r3(p.b + p.d, back)];
  },
  /* q11d: T = 200 canisters; West total r, leaking total k, West and leaking d. Independence by cross-multiplying. */
  q11d: p => {
    const T = 200, west = p.r, leak = p.k, both = p.d;
    return [r3(both, west), r6((west + leak - both) / T), both * T === west * leak ? 1 : 0];
  },
  /* q12b: picture 10000 tanks as whole tanks. */
  q12b: p => {
    const N = 10000, carry = N * p.b / 100, clean = N - carry;
    const tp = carry * p.h / 100, fp = clean * p.f / 100;
    return [tp + fp, r3(tp, tp + fp)];
  },
  /* q12c: negatives among the allergic (misses) and among the rest (95% of them). */
  q12c: p => {
    const N = 10000, al = N * p.b / 100, no = N - al;
    const allNeg = al * p.m / 100, noNeg = no * (100 - p.f) / 100;
    return [allNeg, allNeg + noNeg, r3(noNeg, allNeg + noNeg)];
  },
  /* q12d: carriers deck by deck, then true and false positives among 10000 crew. */
  q12d: p => {
    const N = 10000, A = N * p.sA / 100, B = N - A;
    const car = A * p.rA / 100 + B * p.rB / 100, non = N - car;
    const tp = car * p.h / 100, fp = non * p.f / 100;
    return [r6(car / N * 100), r3(tp, tp + fp)];
  },
  /* q13b: odds a : b against means b out of every a + b cracks; 6% holding is 6 : 94. */
  q13b: p => {
    const g = gcd(p.x, 100 - p.x);
    return [r6(p.b / (p.a + p.b)), p.x / g, (100 - p.x) / g];
  },
  /* q13c: probability x hundredths: against is (100 - x) : x. */
  q13c: p => {
    const g = gcd(p.x, 100 - p.x);
    return [(100 - p.x) / g, p.x / g, r6(p.N * p.x / 100)];
  },
  /* q13d: addition rule in hundredths; late is the union. */
  q13d: p => {
    const late = p.pa + p.pb - p.pab, g = gcd(late, 100 - late);
    return [r6(late / 100), (100 - late) / g, late / g];
  },
  /* q14b: fill the missing hundredths, then add up to k. */
  q14b: p => {
    const q = fill(p.p, p.m); let s = 0; for (let i = 0; i <= p.k; i++) s += q[i];
    return [r6(q[p.m] / 100), r6(s / 100)];
  },
  /* q14c: overflow is any X above k; expected nights = D times that. */
  q14c: p => {
    const q = fill(p.p, p.m); let s = 0; q.forEach((v, i) => { if (i > p.k) s += v; });
    return [r6(q[p.m] / 100), r6(s / 100), r6(p.D * s / 100)];
  },
  /* q14d: smudged count is what is left of N; relative frequencies. */
  q14d: p => {
    let others = 0; p.c.forEach((v, i) => { if (i !== p.m) others += v; });
    const miss = p.N - others, q = p.c.slice(); q[p.m] = miss;
    let tail = 0; q.forEach((v, i) => { if (i >= p.k) tail += v; });
    return [miss, r6(q[p.m] / p.N), r6(tail / p.N)];
  },
  /* q15b: X takes the values 1, 2, 3, ... in order. */
  q15b: p => {
    let e = 0; p.p.forEach((v, i) => { e += (i + 1) * v; });
    return [r6(e / 100), r6(p.D * e / 100)];
  },
  /* q15c: X takes the values 0, 1, 2, ... in order; cost per repair c. */
  q15c: p => {
    let e = 0; p.p.forEach((v, i) => { e += i * v; });
    return [r6(e / 100), r6(p.c * e / 100), r6(p.D * p.c * e / 100)];
  },
  /* q15d: fill the missing hundredths, then weigh each value 0..5. */
  q15d: p => {
    const q = fill(p.p, p.m); let e = 0; q.forEach((v, i) => { e += i * v; });
    return [r6(q[p.m] / 100), r6(e / 100), r6(p.D * e / 100)];
  },
});
})();
