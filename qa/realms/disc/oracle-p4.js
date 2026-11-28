/* Independent oracles for Discrete mathematics practice missions, file 4 of 8: q16b–q20d (game/realms/disc/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Multiply (a x + b y)^N out as a list of coefficients by repeated multiplication: coef[i] belongs to x^i y^(N-i)... */
const expand = (a, b, N) => {
  let poly = [1]; /* poly[j] = coefficient of (second letter)^j; the first letter fills the rest */
  for (let step = 0; step < N; step++) {
    const next = new Array(poly.length + 1).fill(0);
    poly.forEach((c, j) => { next[j] += c * a; next[j + 1] += c * b; });
    poly = next;
  }
  return poly;
};
/* Pascal's triangle: C(n, r) by adding the two entries above. */
const choose = (n, r) => {
  if (r < 0 || r > n) return 0;
  let row = [1];
  for (let i = 1; i <= n; i++) { const nx = [1]; for (let j = 1; j < i; j++) nx.push(row[j - 1] + row[j]); nx.push(1); row = nx; }
  return row[r];
};
/* Ordered selections: count by extending partial lists one position at a time. */
const arrangements = (n, k) => { let count = 1; for (let i = 0; i < k; i++) count *= (n - i); return count; };
/* Ways to split `total` identical items over `parts` places (a place may stay empty): dynamic programme. */
const shares = (total, parts) => {
  let ways = new Array(total + 1).fill(0); ways[0] = 1;
  for (let part = 0; part < parts; part++) {
    const nx = new Array(total + 1).fill(0);
    for (let used = 0; used <= total; used++) for (let give = 0; used + give <= total; give++) nx[used + give] += ways[used];
    ways = nx;
  }
  return ways[total];
};
/* Count the numbers 1..N that satisfy a test, one at a time. */
const countIf = (N, test) => { let c = 0; for (let n = 1; n <= N; n++) if (test(n)) c++; return c; };
/* Divisor lists read off the printed prompts, indexed by the generator's t. */
const TRIPLES = [[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 4, 5], [3, 4, 7], [3, 5, 7], [2, 5, 9], [3, 5, 8], [4, 5, 7], [2, 7, 9]];
const PAIRS = [[3, 4, 5], [4, 5, 7], [5, 7, 9], [4, 7, 9], [5, 8, 9], [3, 5, 8], [3, 7, 8], [4, 5, 9], [3, 7, 10]];
const pick = (table, t) => { if (!table[t]) throw new Error('unknown t ' + t); return table[t]; };
Object.assign(window.ORACLE, {
  /* q16b: expand (a f + b w)^N and read the w^j coefficient. */
  q16b: p => [expand(p.a, p.b, p.N)[p.j]],
  /* q16c: coefficient of c^k w^(N-k) in (a c + b w)^N, then the cost at p credits each. */
  q16c: p => { const c = expand(p.a, p.b, p.N)[p.N - p.k]; return [c, c * p.p]; },
  /* q16d: coefficients of u^k v^(N-k) and u^(k+1) v^(N-k-1) in (a u + b v)^N. */
  q16d: p => { const e = expand(p.a, p.b, p.N); return [e[p.N - p.k], e[p.N - p.k - 1]]; },
  /* q17b: the prompt fixes the kind; the count is Pascal's triangle (combination) or that times the k! orders (permutation). */
  q17b: p => {
    let fact = 1; for (let i = 2; i <= p.k; i++) fact *= i;
    return [p.kind, p.kind === 1 ? choose(p.N, p.k) * fact : choose(p.N, p.k)];
  },
  /* q17c: choose the team, name two different jobs among its k members, multiply. */
  q17c: p => { let jobs = 0; for (let l = 0; l < p.k; l++) for (let d = 0; d < p.k; d++) if (l !== d) jobs++;
    return [choose(p.N, p.k), jobs, choose(p.N, p.k) * jobs]; },
  /* q17d: an ordered run of a stops from N, a group of b from M, and the plans simply add. */
  q17d: p => { const run = arrangements(p.N, p.a), visit = choose(p.M, p.b); return [run, visit, run + visit]; },
  /* q18b: count every batch, the batches drawn only from the good cells, and the difference. */
  q18b: p => { const all = choose(p.f + p.g, p.k), none = choose(p.g, p.k); return [all, none, all - none]; },
  /* q18c: list every code of length L over s symbols (symbol 0 is the alarm) and count. */
  q18c: p => {
    let all = 0, withAlarm = 0;
    const total = Math.pow(p.s, p.L);
    for (let code = 0, n = 0; code < total; code++) {
      let x = code, has = false; for (let i = 0; i < p.L; i++) { if (x % p.s === 0) has = true; x = Math.floor(x / p.s); }
      all++; if (has) withAlarm++;
    }
    return [all, all - withAlarm, withAlarm];
  },
  /* q18d: members are e engineers and m + d others; crews of k with no engineer come from the others only. */
  q18d: p => { const none = choose(p.m + p.d, p.k), some = choose(p.e + p.m + p.d, p.k) - none; return [none, some, some * p.k]; },
  /* q19b: shares of N identical trays over k benches, empty allowed, then every bench at least one. */
  q19b: p => [shares(p.N, p.k), shares(p.N - p.k, p.k)],
  /* q19c: put m on every dome first, share what is left. */
  q19c: p => { const left = p.N - p.k * p.m; return [left, shares(left, p.k)]; },
  /* q19d: the two deliveries are shared independently, so the counts multiply. */
  q19d: p => { const w = shares(p.N, p.k), f = shares(p.P, p.k); return [w, f, w * f]; },
  /* q20b: walk the days; a quiet day is a multiple of none of the three numbers. */
  q20b: p => { const d = pick(TRIPLES, p.t), quiet = countIf(p.N, n => d.every(x => n % x !== 0)); return [quiet, p.N - quiet]; },
  /* q20c: walk the bays; a bay is fitted if it is a multiple of any of the three numbers. */
  q20c: p => { const d = pick(TRIPLES, p.t), fitted = countIf(p.N, n => d.some(x => n % x === 0)); return [fitted, fitted * p.s]; },
  /* q20d: [x, y, z] means multiples of x or y, dropped if also a multiple of z. */
  q20d: p => {
    const [x, y, z] = pick(PAIRS, p.t);
    const either = countIf(p.N, n => n % x === 0 || n % y === 0);
    const dropped = countIf(p.N, n => (n % x === 0 || n % y === 0) && n % z === 0);
    return [either, dropped, either - dropped];
  },
});
})();
