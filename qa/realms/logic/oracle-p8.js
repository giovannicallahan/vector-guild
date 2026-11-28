/* Independent oracles for Logic and proof practice missions, file 8 of 8: q36b–q40d (game/realms/logic/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Add up term(i) for i = from..to, one term at a time. */
const addUp = (term, from, to) => { let s = 0; for (let i = from; i <= to; i++) s += term(i); return s; };
/* Smallest whole number N with 1 / N < num / den, found by trying N = 1, 2, 3 ... (cross-multiplied: den < num * N). */
const firstBelow = (num, den) => { let n = 1; while (!(den < num * n)) n++; return n; };
/* Table of a^n > c n^b for n = 1..400 (BigInt, exact). N = one past the last false row. */
const tableRows = (a, b, c) => { const rows = []; for (let n = 1; n <= 400; n++) rows.push(BigInt(a) ** BigInt(n) > BigInt(c) * BigInt(n) ** BigInt(b)); return rows; };
const startOf = rows => { let last = 0; rows.forEach((ok, i) => { if (!ok) last = i + 1; }); return last + 1; };
/* Which amounts can be paid with stamps a and b: try every count of a-stamps. */
const payable = (a, b, x) => { for (let i = 0; i * a <= x; i++) if ((x - i * a) % b === 0) return true; return false; };
const unpayable = (a, b) => { const out = []; for (let x = 1; x <= a * b; x++) if (!payable(a, b, x)) out.push(x); return out; };
const termOf = { odd: i => 2 * i - 1, nat: i => i, even: i => 2 * i, sq: i => i * i, cube: i => i * i * i };
Object.assign(window.ORACLE, {
  /* q36b: layer 1 holds a and each layer 3 more; build the layers one at a time and add them. */
  q36b: p => { const layers = [p.a]; while (layers.length < p.k + 1) layers.push(layers[layers.length - 1] + 3);
    return [addUp(i => layers[i - 1], 1, p.k), layers[p.k], addUp(i => layers[i - 1], 1, p.k + 1)]; },
  /* q36c: day n hauls d n - (d - 1); the prompt's formula is n(dn - (d - 2)) / 2, used here directly. */
  q36c: p => { const F = n => n * (p.d * n - (p.d - 2)) / 2; return [F(p.k), F(p.k + 1), F(p.k + 1) - F(p.k)]; },
  /* q36d: first section a, each section 2h longer, so section n = a + 2h(n - 1); the claim reads n(hn + a - h). */
  q36d: p => {
    const sec = n => p.a + 2 * p.h * (n - 1), F = n => n * (p.h * n + p.a - p.h);
    return [sec(1), F(1), sec(p.k + 1), F(p.k) + sec(p.k + 1)];
  },
  /* q37b: add the squares one layer at a time. */
  q37b: p => [addUp(i => i * i, 1, p.m), (p.m + 1) * (p.m + 1)],
  /* q37c: add the treads one at a time. */
  q37c: p => { const t = termOf[p.f]; return [addUp(t, 1, p.hi), addUp(t, 1, p.lo), addUp(t, p.lo + 1, p.hi)]; },
  /* q37d: add the levels one at a time. */
  q37d: p => { const t = termOf[p.f]; return [addUp(t, 1, p.m), t(p.m + 1), addUp(t, 1, p.m + 1)]; },
  /* q38b: table of a^n > c n^b; N is one past the last false row. */
  q38b: p => { const N = startOf(tableRows(p.a, p.b, p.c)); return [N, Number(BigInt(p.a) ** BigInt(N) - BigInt(p.c) * BigInt(N) ** BigInt(p.b))]; },
  /* q38c: same table, then the gap at N + 3. */
  q38c: p => { const N = startOf(tableRows(p.a, p.b, p.c)), M = BigInt(N + 3); return [N, Number(BigInt(p.a) ** M - BigInt(p.c) * M ** BigInt(p.b))]; },
  /* q38d: same table; count the true rows below N. */
  q38d: p => { const rows = tableRows(p.a, p.b, p.c), N = startOf(rows); return [N, rows.slice(0, N - 1).filter(Boolean).length]; },
  /* q39b: list the amounts that cannot be made; largest and how many. */
  q39b: p => { const u = unpayable(p.a, p.b); return [u[u.length - 1], u.length]; },
  /* q39c: largest unpayable by listing; fewest stamps by trying every count of the a-stamp. */
  q39c: p => {
    const u = unpayable(p.a, p.b); let best = Infinity;
    for (let i = 0; i * p.a <= p.T; i++) { const r = p.T - i * p.a; if (r % p.b === 0) best = Math.min(best, i + r / p.b); }
    return [u[u.length - 1], best];
  },
  /* q39d: largest unpayable by listing; the claim holds if M is above it; base cases = the run of payable amounts needed,
     which is as long as the smaller stamp (the first stretch of that many payable amounts in a row). */
  q39d: p => {
    const u = unpayable(p.a, p.b), L = u[u.length - 1], s = Math.min(p.a, p.b);
    let run = 0, x = L + 1; while (run < s && payable(p.a, p.b, x)) { run++; x++; }
    return [L, p.M > L ? 1 : 0, run];
  },
  /* q40b: tolerance e/100, then e/200; smallest N by trying N = 1, 2, 3 ... */
  q40b: p => [firstBelow(p.e, 100), firstBelow(p.e, 200)],
  /* q40c: tolerances e1/1000 and e2/1000; readings numbered below N fail. */
  q40c: p => { const n1 = firstBelow(p.e1, 1000), n2 = firstBelow(p.e2, 1000); return [n1, n2, (n2 - 1) - (n1 - 1)]; },
  /* q40d: N from 1/n < p/q by trying; then add the first N terms of the stated sum. */
  q40d: p => { const N = firstBelow(p.p, p.q); return [N, addUp(termOf[p.f], 1, N)]; },
});
})();
