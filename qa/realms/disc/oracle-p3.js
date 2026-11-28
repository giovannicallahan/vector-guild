/* Independent oracles for Discrete mathematics practice missions, file 3 of 8: q11b–q15d (game/realms/disc/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Number of orderings of m different objects into m places: count by dynamic programming over the set of places used. */
const orderings = m => {
  const ways = new Array(1 << m).fill(0); ways[0] = 1;
  for (let used = 0; used < (1 << m); used++) {
    let placed = 0; for (let b = 0; b < m; b++) if (used >> b & 1) placed++;
    for (let b = 0; b < m; b++) if (!(used >> b & 1)) ways[used | 1 << b] += ways[used]; // object number `placed` goes to place b
  }
  return ways[(1 << m) - 1];
};
/* Pascal's triangle row n (entries C(n, 0..n)), built by adding the two entries above. */
const pascalRow = n => { let row = [1]; for (let i = 0; i < n; i++) { const next = [1]; for (let j = 1; j < row.length; j++) next.push(row[j - 1] + row[j]); next.push(1); row = next; } return row; };
const choose = (n, k) => (k < 0 || k > n) ? 0 : pascalRow(n)[k];
/* Ordered picks of k from n, counted as a tree of choices: each level leaves one fewer. */
const picks = (n, k) => { let count = 1; for (let level = 0; level < k; level++) count *= (n - level); return count; };
/* Number of strings of N bits with exactly j ones, for each j, by running through every string. */
const onesTally = N => {
  const tally = new Array(N + 1).fill(0);
  for (let s = 0; s < (1 << N); s++) { let c = 0; for (let b = 0; b < N; b++) if (s >> b & 1) c++; tally[c]++; }
  return tally;
};
Object.assign(window.ORACLE, {
  /* q11b: C colours, row digit 1..r, bay digit 0..b; h = larger digit. List every tag and collect the values. */
  q11b: p => {
    let tags = 0; const seen = new Set();
    for (let c = 0; c < p.C; c++) for (let row = 1; row <= p.r; row++) for (let bay = 0; bay <= p.b; bay++) { tags++; seen.add(Math.max(row, bay)); }
    return [tags, seen.size];
  },
  /* q11c: Z letters, first digit 1..9, second digit 0..9 different from the first; N crates. */
  q11c: p => {
    let tags = 0;
    for (let z = 0; z < p.Z; z++) for (let d1 = 1; d1 <= 9; d1++) for (let d2 = 0; d2 <= 9; d2++) if (d2 !== d1) tags++;
    return [tags, tags - p.N];
  },
  /* q11d: L letters, first digit 1..a, second digit 1..b; f = |difference|, codomain 0..9. */
  q11d: p => {
    let seals = 0; const seen = new Set();
    for (let l = 0; l < p.L; l++) for (let x = 1; x <= p.a; x++) for (let y = 1; y <= p.b; y++) { seals++; seen.add(Math.abs(x - y)); }
    let missed = 0; for (let v = 0; v <= 9; v++) if (!seen.has(v)) missed++;
    return [seals, seen.size, missed];
  },
  /* q12b: m rovers into m slots: dynamic programming over the slots filled. */
  q12b: p => [orderings(p.m)],
  /* q12c: the airlock is first; order the other m - 1; nights = routes ÷ d rounded up. */
  q12c: p => {
    const routes = orderings(p.m - 1); let nights = 0, done = 0;
    while (done < routes) { done += p.d; nights++; }
    return [routes, nights];
  },
  /* q12d: p heavy and q light crates, each block in any order; the blocks can swap ends. */
  q12d: p => { const left = orderings(p.p) * orderings(p.q); return [left, left + left]; },
  /* q13b: ranked prizes for k places among N entrants. */
  q13b: p => [picks(p.N, p.k)],
  /* q13c: day shift a jobs from N, then night shift b jobs from those left. */
  q13c: p => { const day = picks(p.N, p.a); return [day, day * picks(p.N - p.a, p.b)]; },
  /* q13d: k posts from N crew; the captain is chosen from the m veterans, then the other k - 1 posts from the rest. */
  q13d: p => {
    let captains = 0; for (let v = 0; v < p.m; v++) captains++;
    return [picks(p.N, p.k), captains * picks(p.N - 1, p.k - 1)];
  },
  /* q14b: C(N, k) from Pascal's triangle. */
  q14b: p => [choose(p.N, p.k)],
  /* q14c: a of the e engineers and b of the m medics. */
  q14c: p => [choose(p.e, p.a), choose(p.e, p.a) * choose(p.m, p.b)],
  /* q14d: team of k from N, then an ordered pair (lead, deputy) from the team's k members. */
  q14d: p => {
    let pairs = 0; for (let lead = 0; lead < p.k; lead++) for (let dep = 0; dep < p.k; dep++) if (dep !== lead) pairs++;
    return [choose(p.N, p.k), choose(p.N, p.k) * pairs];
  },
  /* q15b: N-bit strings with exactly k ones, and all strings, by running through every string. */
  q15b: p => { const t = onesTally(p.N); return [t[p.k], t.reduce((a, b) => a + b, 0)]; },
  /* q15c: strings with exactly k faults, with exactly k + 1, and either. */
  q15c: p => { const t = onesTally(p.N); return [t[p.k], t[p.k + 1], t[p.k] + t[p.k + 1]]; },
  /* q15d: every subset of N tools as a bit string; one named tool forced in; at most 2 tools. */
  q15d: p => {
    let all = 0, withTool = 0, small = 0;
    for (let s = 0; s < (1 << p.N); s++) {
      all++; if (s & 1) withTool++;
      let c = 0; for (let b = 0; b < p.N; b++) if (s >> b & 1) c++;
      if (c <= 2) small++;
    }
    return [all, withTool, small];
  },
});
})();
