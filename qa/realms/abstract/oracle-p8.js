/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 8 of 8: q36b–q40d (game/realms/abstract/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Smallest y from 1 to p-1 with a*y = 1 mod p (search). */
const invSearch = (a, p) => { for (let y = 1; y < p; y++) if ((a * y) % p === 1) return y; return -1; };
const mod = (x, p) => ((x % p) + p) % p;
/* Largest d that divides every number given (search downwards). */
const commonDivisor = nums => { for (let d = Math.min(...nums); d >= 1; d--) if (nums.every(n => n % d === 0)) return d; return 1; };
/* How many numbers from 1 to m share no factor with m (the generators of a cyclic group of order m). */
const generators = m => { let c = 0; for (let x = 1; x <= m; x++) if (commonDivisor([x, m]) === 1) c++; return c; };
/* Value of the monic polynomial x^n + cs[0] x^(n-1) + ... + cs[n-1] at r, mod p (n = cs.length). cs lists the
   coefficients below the leading 1, highest power first (a parameter layout, not a maths input). */
const evalMonic = (cs, r, p) => { let v = 1; for (const c of cs) v = (v * r + c) % p; return v; };
const rootsOf = (cs, p) => { let n = 0; for (let r = 0; r < p; r++) if (evalMonic(cs, r, p) === 0) n++; return n; };
/* Every monic quadratic x^2 + B x + C over Z_p: count those with no root. */
const irreducibleQuadratics = p => { let n = 0; for (let B = 0; B < p; B++) for (let C = 0; C < p; C++) if (rootsOf([B, C], p) === 0) n++; return n; };
/* Smallest positive number of the form a*x + b*y (x, y any integers), found by trying a box of x and y. */
const smallestCombo = (a, b) => { let best = Infinity; for (let x = -b; x <= b; x++) for (let y = -a; y <= a; y++) { const v = a * x + b * y; if (v > 0 && v < best) best = v; } return best; };
Object.assign(window.ORACLE, {
  /* q36b: readout c = (a m + b) mod p; try every key number m and find the one whose scramble matches (a, b, m are known). */
  q36b: p => {
    const c = (p.a * p.m + p.b) % p.p;
    let key = -1; for (let m = 0; m < p.p; m++) if ((p.a * m + p.b) % p.p === c) key = m;
    return [invSearch(p.a, p.p), key];
  },
  /* q36c: x is the setting with (a x + b) mod p equal to the stated value; dial A shows it for the true x, so search x by the
     stated value (the value of the right-hand side is that of the generator's x), then y = d x mod p. */
  q36c: p => {
    const target = (p.a * p.x + p.b) % p.p;
    let x = -1; for (let t = 0; t < p.p; t++) if ((p.a * t + p.b) % p.p === target) x = t;
    return [invSearch(p.a, p.p), x, (p.d * x) % p.p];
  },
  /* q36d: search the setting x where the two locks read the same; the first answer is the reduced coefficient. */
  q36d: p => {
    let x = -1; for (let t = 0; t < p.p; t++) if ((p.a * t + p.b) % p.p === (p.d * t + p.e) % p.p) x = t;
    return [mod(p.a - p.d, p.p), x];
  },
  /* q37b: remainder of f on division by x - a is found by long division; roots counted over all r. cs = coefficients below the leading 1. */
  q37b: p => {
    let q = [1, ...p.cs]; // highest power first
    const quot = [];
    let carry = 0;
    for (let i = 0; i < q.length; i++) { carry = (q[i] + carry * p.a) % p.p; quot.push(carry); }
    return [quot[quot.length - 1], rootsOf(p.cs, p.p)];
  },
  /* q37c: add the strands coefficient by coefficient, divide each of f, g, f+g by x - a (synthetic division), read the remainders. */
  q37c: p => {
    const rem = poly => { let carry = 0; for (const c of poly) carry = (c + carry * p.a) % p.p; return carry; };
    const full = cs => [1, ...cs];
    const F = full(p.f), G = full(p.g), n = Math.max(F.length, G.length);
    const pad = (arr, n) => Array(n - arr.length).fill(0).concat(arr);
    const S = pad(F, n).map((c, i) => (c + pad(G, n)[i]) % p.p);
    return [rem(F), rem(G), rem(S)];
  },
  /* q37d: synthetic division by x - a and by x - b; roots by trying every r. */
  q37d: p => {
    const rem = t => { let carry = 0; for (const c of [1, ...p.cs]) carry = (c + carry * t) % p.p; return carry; };
    return [rem(p.a), rem(p.b), rootsOf(p.cs, p.p)];
  },
  /* q38b: the amounts reachable as a x + b y are found in a box of x, y; count those from 1 to N. */
  q38b: p => {
    const seen = new Set();
    const B = p.N + p.a + p.b; // a box wide enough to reach every amount up to N
    for (let x = -B; x <= B; x++) for (let y = -B; y <= B; y++) { const v = p.a * x + p.b * y; if (v >= 1 && v <= p.N) seen.add(v); }
    return [smallestCombo(p.a, p.b), seen.size];
  },
  /* q38c: gcds by divisor search; whether t is a net load by searching which totals can be reached with steps of +-a, +-b, +-c. */
  q38c: p => {
    const bound = p.t + p.a + p.b + p.c + 50, seen = new Set([0]), queue = [0];
    while (queue.length) { const v = queue.pop(); for (const s of [p.a, p.b, p.c, -p.a, -p.b, -p.c]) { const w = v + s; if (Math.abs(w) <= bound && !seen.has(w)) { seen.add(w); queue.push(w); } } }
    return [commonDivisor([p.a, p.b]), commonDivisor([p.a, p.b, p.c]), seen.has(p.t) ? 1 : 0];
  },
  /* q38d: the ideal's generator is the smallest positive a x mod m (or m); presses by pressing the key until the dial is back at 0. */
  q38d: p => {
    let gen = p.m; for (let x = 1; x <= p.m; x++) { const v = (p.a * x) % p.m; if (v > 0 && v < gen) gen = v; }
    let presses = 0, dial = 0; do { dial = (dial + p.a) % p.m; presses++; } while (dial !== 0);
    return [gen, presses];
  },
  /* q39b: f(x) = x^2 + b x + c; irreducible when no r from 0 to p-1 is a root; reducible monic quadratics are those among all p^2 with a root. */
  q39b: p => {
    const irr = rootsOf([p.b, p.c], p.p) === 0 ? 1 : 0;
    return [irr, p.p * p.p - irreducibleQuadratics(p.p)];
  },
  /* q39c: f and g are monic cubics (coefficients below the leading 1, highest power first); roots by trying every r; irreducible = no root. */
  q39c: p => {
    const rf = rootsOf(p.f, p.p), rg = rootsOf(p.g, p.p);
    return [rf, rg, (rf === 0 ? 1 : 0) + (rg === 0 ? 1 : 0)];
  },
  /* q39d: f(x) = x^2 + b x + c; remainder f(t); irreducible = no root; count the irreducible monic quadratics by trying all (B, C). */
  q39d: p => [evalMonic([p.b, p.c], p.t, p.p), rootsOf([p.b, p.c], p.p) === 0 ? 1 : 0, irreducibleQuadratics(p.p)],
  /* q40b: GF(p^k) has p^k elements; the multiplication group is cyclic of order p^k - 1, with one generator for each number 1..m coprime to m. */
  q40b: p => {
    let q = 1; for (let i = 0; i < p.k; i++) q *= p.p;
    const g = generators(q - 1);
    return [q, g, q - 1 - g];
  },
  /* q40c: try k = 2, 3, ... until p^k - 1 >= N; then the generators of the cyclic group of that order. */
  q40c: p => {
    let k = 2, q = p.p * p.p; while (q - 1 < p.N) { k++; q *= p.p; }
    return [k, q - 1, generators(q - 1)];
  },
  /* q40d: the order of g^s is the least j >= 1 with m dividing j s; the elements of that order number the generators of a cyclic group of that size. */
  q40d: p => {
    let q = 1; for (let i = 0; i < p.k; i++) q *= p.p;
    const m = q - 1;
    let j = 1; while ((j * p.s) % m !== 0) j++;
    return [m, j, generators(j)];
  },
});
})();
