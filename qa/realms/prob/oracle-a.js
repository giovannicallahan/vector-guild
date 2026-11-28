/* Independent oracles for Probability learn missions, file a: q01–q10 (game/realms/prob/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Lowest terms by searching for the largest common divisor, and rounding to a stated number of decimals. */
const lowest = (top, bottom) => { let g = 1; for (let d = 2; d <= top; d++) if (top % d === 0 && bottom % d === 0) g = d; return [top / g, bottom / g]; };
const round = (x, dp) => Math.round(x * 10 ** dp + 1e-9) / 10 ** dp;
Object.assign(window.ORACLE, {
  /* Put every token in a list, one entry per outcome; count the list and the green entries. */
  q01: p => {
    const bag = [];
    for (let i = 0; i < p.r; i++) bag.push('r');
    for (let i = 0; i < p.g; i++) bag.push('g');
    for (let i = 0; i < p.y; i++) bag.push('y');
    const green = bag.filter(c => c === 'g').length;
    return [bag.length, ...lowest(green, bag.length)];
  },
  /* Relative frequency k of L; the forecast applies it to the next N runs. */
  q02: p => [round(p.k / p.L, 4), round(p.N * (p.k / p.L), 4)],
  /* The deck is T cards, k of them name the canyon. P(A) = k/T is printed as a decimal; the complement is the
     other cards counted directly. */
  q03: p => { const notA = []; for (let c = 0; c < p.T; c++) if (c >= p.k) notA.push(c); return [round(notA.length / p.T, 4), notA.length]; },
  /* Build the grid of pairs and count the cells whose sum is s. */
  q04: p => {
    let cells = 0, hit = 0;
    for (let i = 1; i <= p.a; i++) for (let j = 1; j <= p.b; j++) { cells++; if (i + j === p.s) hit++; }
    return [cells, ...lowest(hit, cells)];
  },
  /* Sort each crate into F or C by region: a only F, c both, b only C, d neither. */
  q05: p => {
    const crates = [];
    const add = (n, inF, inC) => { for (let i = 0; i < n; i++) crates.push({ inF, inC }); };
    add(p.a, true, false); add(p.c, true, true); add(p.b, false, true); add(p.d, false, false);
    return [crates.filter(x => x.inF || x.inC).length, crates.filter(x => x.inF && x.inC).length];
  },
  /* Percent probabilities A, B, AB. Imagine 10000 runs and count them: by dust, by fault, by both; those held up by
     either are the union counted with each run once. */
  q06: p => {
    const runs = 10000, dust = p.A * 100, fault = p.B * 100, both = p.AB * 100;
    const either = dust + fault - both;
    return [round(either / runs, 4)];
  },
  /* Keep only the Tycho row: cracked tc out of ti + tc. */
  q07: p => lowest(p.tc, p.ti + p.tc),
  /* Count ordered pairs of distinct crates: N(N − 1) pairs, f(f − 1) of them both faulty. */
  q08: p => {
    let pairs = 0, both = 0;
    for (let i = 0; i < p.N; i++) for (let j = 0; j < p.N; j++) if (i !== j) { pairs++; if (i < p.f && j < p.f) both++; }
    return lowest(both, pairs);
  },
  /* Probabilities in hundredths and thousandths: P(morning) = a/10, P(damp) = b/20, P(both) = g/1000. Compare in
     integer units of 1/20000 so there is no rounding in the independence test. */
  q09: p => {
    const m = p.a * 2000, d = p.b * 1000, both = p.g * 20;
    const product = m * d / 20000;
    return [round(p.a / 10 * (p.b / 20), 4), product === both ? 1 : 0];
  },
  /* Shares s1, s2 in percent; the third is what is left of 100. Walk 1000000 imaginary crates through the three
     branches; damaged ones are counted in each, then the total is turned back into a probability. */
  q10: p => {
    const s3 = 100 - p.s1 - p.s2;
    const damaged = p.s1 * p.r1 + p.s2 * p.r2 + s3 * p.r3;  // out of 100 × 100 = 10000 per unit
    return [round(damaged / 10000, 4)];
  },
});
})();
