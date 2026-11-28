/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 5 of 8: q21b–q25d (game/realms/abstract/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
/* Repeated multiplication, keeping the remainder each time: a^k mod m, one press at a time. */
const powStep = (a, k, m) => { let v = 1 % m; for (let i = 0; i < k; i++) v = (v * a) % m; return v; };
/* Count whole numbers from 1 to m-1 that are coprime to m. */
const phiCount = m => { let c = 0; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) c++; return c; };
/* Order of a in the multiplicative setting mod m: first j >= 1 with a^j = 1 (by stepping). */
const multOrder = (a, m) => { let v = a % m, j = 1; while (v !== 1 && j < 100000) { v = (v * a) % m; j++; } return j; };
/* Permutations are 1-based arrays s with s[x-1] = image of x. Inverse by scanning. */
const inv = s => { const r = []; for (let y = 1; y <= s.length; y++) r.push(s.indexOf(y) + 1); return r; };
/* conj(sigma, tau)(x) = tau(sigma(tau^-1(x))): tau^-1 first, then sigma, then tau. */
const conjMap = (s, t) => { const ti = inv(t); return s.map((_, k) => t[s[ti[k] - 1] - 1]); };
const lcm = (a, b) => a / gcd(a, b) * b;
const permOrder = s => { let j = 1, cur = s.slice(); const id = s.map((_, k) => k + 1);
  while (cur.some((v, k) => v !== id[k]) && j < 10000) { cur = cur.map(v => s[v - 1]); j++; } return j; };
/* Multiples of a in Z_m collected by stepping until a repeat: the cyclic subgroup <a>. */
const cyc = (a, m) => { const seen = []; let x = 0; while (!seen.includes(x)) { seen.push(x); x = (x + a) % m; } return seen; };
/* S3 on slots 1..3 as arrays; the subgroups H listed by the prompt's index c (0-2 one swap, 3 turns, 4 identity, 5 all). */
const S3 = [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]];
const subgroupsS3 = [
  [[1,2,3],[2,1,3]], [[1,2,3],[3,2,1]], [[1,2,3],[1,3,2]],
  [[1,2,3],[2,3,1],[3,1,2]], [[1,2,3]], S3
];
const isNormal = H => S3.every(g => H.every(h => { const gi = inv(g), c = g.map((_, k) => 0).map((_, k) => g[h[gi[k] - 1] - 1]);
  return H.some(x => x.every((v, k) => v === c[k])); }));
Object.assign(window.ORACLE, {
  /* q21b: p-1, then k mod (p-1), then a^k mod p worked by pressing one multiplication at a time. */
  q21b: p => [p.p - 1, p.k % (p.p - 1), powStep(p.a, p.k, p.p)],
  /* q21c: T = per × days presses; the remainder of T by the count of coprime numbers; the setting by pressing T times. */
  q21c: p => { const T = p.per * p.days; return [T, T % phiCount(p.m), powStep(p.a, T, p.m)]; },
  /* q21d: count of coprime numbers below m, the order by stepping, then the setting after k steps by stepping. */
  q21d: p => [phiCount(p.m), multOrder(p.a, p.m), powStep(p.a, p.k, p.m)],
  /* q22b: s = π, t = ρ, i = rack, c = index into the list of subgroups H of S3 in the prompt (see subgroupsS3). */
  q22b: p => [conjMap(p.s, p.t)[p.i - 1], isNormal(subgroupsS3[p.c]) ? 1 : 0],
  /* q22c: s = σ, t = τ, i = the new rack; the job in the new numbers sends τ(x) to τ(σ(x)). Count racks left in place. */
  q22c: p => { const sendTo = {}; for (let x = 1; x <= 6; x++) sendTo[p.t[x - 1]] = p.t[p.s[x - 1] - 1];
    let fixed = 0; for (let r = 1; r <= 6; r++) if (sendTo[r] === r) fixed++; return [sendTo[p.i], fixed]; },
  /* q22d: s = σ, t = τ, i = the bolt; order of the conjugate by repeating it until every bolt is home. */
  q22d: p => { const c = conjMap(p.s, p.t); return [c[p.i - 1], permOrder(c)]; },
  /* q23b: Z_m, step a, start b: size of <a>, number of cosets, largest locker in b + <a> by listing it. */
  q23b: p => { const H = cyc(p.a, p.m); const coset = H.map(h => (h + p.b) % p.m);
    return [H.length, p.m / H.length, Math.max(...coset)]; },
  /* q23c: same step a on Z_m: parts per courier, couriers needed, smallest label on the courier that starts at b. */
  q23c: p => { const H = cyc(p.a, p.m); const coset = H.map(h => (h + p.b) % p.m);
    return [H.length, p.m / H.length, Math.min(...coset)]; },
  /* q23d: size of <a>, number of divisors of that size (subgroups of a cyclic group), smallest element of b + <a>. */
  q23d: p => { const H = cyc(p.a, p.m); let d = 0; for (let x = 1; x <= H.length; x++) if (H.length % x === 0) d++;
    return [H.length, d, Math.min(...H.map(h => (h + p.b) % p.m))]; },
  /* q24b: Z_m to Z_t by kx mod t. Well defined when x and x+m give the same output for every x; answers phi(x), phi(x+m), flag. */
  q24b: p => { let ok = 1; for (let x = 0; x < p.m * 3; x++) if ((p.k * x) % p.t !== (p.k * (x + p.m)) % p.t) ok = 0;
    return [(p.k * p.x) % p.t, (p.k * (p.x + p.m)) % p.t, ok]; },
  /* q24c: nudges u, v, w one by one on Z_m, then the slave reading. */
  q24c: p => { let r = 0; for (const n of [p.u, p.v, p.w]) r = (r + n) % p.m; return [r, (p.k * r) % p.t]; },
  /* q24d: phi(a) = k a mod t; orders found by adding the element to itself until 0 is reached. */
  q24d: p => { const ord = (x, n) => { let v = x % n, c = 1; while (v !== 0) { v = (v + x) % n; c++; } return c; };
    const f = (p.k * p.a) % p.t; return [f, ord(p.a, p.m), ord(f, p.t)]; },
  /* q25b: phi(x) = kx mod m on Z_m: number of different lamps lit, and the number of switch positions lighting lamp y. */
  q25b: p => { const lit = new Set(); let hits = 0; for (let x = 0; x < p.m; x++) { const l = (p.k * x) % p.m; lit.add(l); if (l === p.y) hits++; }
    return [lit.size, hits]; },
  /* q25c: lamps x with kx = 0 mod m, and the lamps no switch lights. */
  q25c: p => { const lit = new Set(); let z = 0; for (let x = 0; x < p.m; x++) { const l = (p.k * x) % p.m; lit.add(l); if (l === 0) z++; }
    return [z, p.m - lit.size]; },
  /* q25d: kernel and image sizes of x -> kx mod t on 0..m-1, by listing. */
  q25d: p => { const lit = new Set(); let z = 0; for (let x = 0; x < p.m; x++) { const l = (p.k * x) % p.t; lit.add(l); if (l === 0) z++; }
    return [z, lit.size]; }
});
})();
