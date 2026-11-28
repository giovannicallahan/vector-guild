/* Independent oracles for Probability practice missions, file 2 of 8: q06b–q10d (game/realms/prob/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
const frac = (t, b) => { const g = gcd(t, b); return [t / g, b / g]; };
const r4 = x => Math.round(x * 1e4 + 1e-9) / 1e4;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Count the outcomes of a draw in order without replacement by listing every ordered pair/triple of crate numbers.
   Crates 0..f-1 are the faulty ones. Returns { total, count } where count satisfies the test. */
const listDraws = (N, f, k, test) => {
  let total = 0, count = 0;
  const walk = (picked) => {
    if (picked.length === k) { total++; if (test(picked.map(c => c < f))) count++; return; }
    for (let c = 0; c < N; c++) if (!picked.includes(c)) walk(picked.concat(c));
  };
  walk([]);
  return { total, count };
};
Object.assign(window.ORACLE, {
  /* Percent-points of a 100-cell grid: cells closed by crosswind (A), by cloud (B), by both (AB); count the cells in the union. */
  q06b: p => {
    const union = p.A + p.B - p.AB, open = 100 - union;
    return [r6(union / 100), r6(open / 100)];
  },
  /* Count the runs that are late or damaged, then scale up by proportion. */
  q06c: p => {
    const lateOnly = p.x - p.z, damOnly = p.y - p.z, count = lateOnly + damOnly + p.z;
    return [r6(count / p.N), r6(p.M * count / p.N)];
  },
  /* In 100 imaginary runs: none = 100 - (dust or fault), so dust-or-fault = 100 - none; fault cells = rest of the union plus the overlap. */
  q06d: p => {
    const none = 100 - (p.A + p.B - p.AB), either = 100 - none, fault = either - (p.A - p.AB);
    return [r6(either / 100), r6(fault / 100)];
  },
  /* Loose column only: South loose over all loose. */
  q07b: p => frac(p.sl, p.nl + p.sl),
  /* Vesta row only: cracked over the row; expected count by scaling. */
  q07c: p => {
    const row = p.T, cracked = p.vc, prob = cracked / row;
    return [r6(prob), r6(p.M * cracked / row)];
  },
  /* Cracked column only: Tycho and Vesta cracked cells over the whole column. */
  q07d: p => frac(p.tc + p.vc, p.rc + p.tc + p.vc),
  /* List every ordered pair of distinct tags and count the red-then-not-red ones. */
  q08b: p => { const r = listDraws(p.N, p.f, 2, d => d[0] && !d[1]); return frac(r.count, r.total); },
  /* List every ordered pair; count those with no faulty crate; the complement count is the rest. */
  q08c: p => {
    const r = listDraws(p.N, p.f, 2, d => !d[0] && !d[1]);
    const [t, b] = frac(r.count, r.total);
    return [t, b, b - t];
  },
  /* List every ordered triple; count all-faulty; the complement is every other triple. */
  q08d: p => {
    const r = listDraws(p.N, p.f, 3, d => d[0] && d[1] && d[2]);
    const [t, b] = frac(r.count, r.total);
    return [t, b, b - t];
  },
  /* Percent grid: a, b in tenths; g in hundredths. Product of the singles, and independence by comparing whole-number cells. */
  q09b: p => {
    const prod100 = p.a * p.b;            /* in hundredths of a hundredth... a/10 * b/10 = a*b/100 */
    const joint100 = p.g;                  /* g/100 */
    return [r6(prod100 / 100), prod100 === joint100 ? 1 : 0];
  },
  /* Percent inputs: scale to a population of 10000 crates and count. */
  q09c: p => {
    const pop = 10000, A = pop * p.a / 100, B = pop * p.b / 100;
    const both = A * B / pop, either = A + B - both;
    return [r4(both / pop), r4(either / pop)];
  },
  /* List ordered pairs with replacement and without replacement. */
  q09d: p => {
    let withTot = 0, withHit = 0, withoutTot = 0, withoutHit = 0;
    for (let i = 0; i < p.N; i++) for (let j = 0; j < p.N; j++) {
      withTot++; if (i < p.f && j < p.f) withHit++;
      if (i !== j) { withoutTot++; if (i < p.f && j < p.f) withoutHit++; }
    }
    return [r4(withHit / withTot), r4(withoutHit / withoutTot)];
  },
  /* Population of 10000 trays: s% North, rejected counts per greenhouse in percent. */
  q10b: p => {
    const pop = 10000, north = pop * p.s / 100, south = pop - north;
    const rejected = north * p.r1 / 100 + south * p.r2 / 100;
    return [r4(rejected / pop), r4((pop - rejected) / pop)];
  },
  /* Same counting method on 10000 crates, then scale to the delivery. */
  q10c: p => {
    const pop = 10000, rhea = pop * p.s / 100, vesta = pop - rhea;
    const damaged = rhea * p.r1 / 100 + vesta * p.r2 / 100;
    return [r4(damaged / pop), r6(p.M * damaged / pop)];
  },
  /* List every ordered pair of distinct crates; count exactly-one-faulty and second-faulty. */
  q10d: p => {
    const one = listDraws(p.N, p.f, 2, d => d[0] !== d[1]);
    const second = listDraws(p.N, p.f, 2, d => d[1]);
    return frac(one.count, one.total).concat(frac(second.count, second.total));
  },
});
})();
