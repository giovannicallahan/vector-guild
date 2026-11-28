/* Number theory: the hidden life of whole numbers review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = k => String(k).split('').map(d => SUP[+d]).join('');
const factor = x => { const out = []; for (let p = 2; p * p <= x; p++) { let a = 0; while (x % p === 0) { x /= p; a++; } if (a) out.push([p, a]); } if (x > 1) out.push([x, 1]); return out; };
const fac = f => f.map(([p, a]) => a === 1 ? n(p) : `${n(p)}${sup(a)}`).join(' × ');
const order = (a, m) => { let v = a % m, k = 1; while (v !== 1 && k <= m) { v = v * a % m; k++; } return k; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* The same lists as experiments-c.js. */
const PAIRS = []; for (let N = 8; N <= 30; N++) for (let a = 2; a <= N - 2; a++) if (gcd(a, N) === 1 && order(a, N) >= 3 && order(a, N) <= 8) PAIRS.push([N, a]);
const L25 = [6, 10, 12, 14, 15, 18, 20, 21, 22, 26, 28, 42, 44, 45, 50, 66, 70, 75, 105, 110, 210];
const L26 = [6, 12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 56, 60, 70, 72, 88, 96, 100, 120, 496, 945];
const P24 = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53], P28 = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const A22 = [3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29];
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const i = t + 10, a = 1 + i % 4, P = [5, 7, 11, 13][Math.floor(i / 4) % 4], N = Math.pow(2, a) * 3 * P; return `A channel numbers its codes from 1 to ${n(N)}, and ${n(N)} = ${fac(factor(N))}.`; },
 q22: t => { const i = t + 10, a = A22[i % 11], k = 1003 + 37 * i; return `Find the last two digits of ${n(a)}${sup(k)}, that is, ${n(a)}${sup(k)} mod 100. ${n(a)} and 100 are coprime.`; },
 q23: t => { const i = t + 10; return `x leaves remainder ${n(2 * i % 9)} on division by 9 and remainder ${n((i + 3) % 11)} on division by 11.`; },
 q24: t => { const p = P24[(t + 10) % 12]; return `A gear wheel has a prime number of teeth, p = ${n(p)}. Find (${n(p)} − 3)! mod ${n(p)}.`; },
 q25: t => { const N = L25[t + 10]; return `A calendar cycle is N = ${n(N)} days long, and ${n(N)} = ${fac(factor(N))}.`; },
 q26: t => { const N = L26[t + 10]; return `Test N = ${n(N)} = ${fac(factor(N))} for being perfect.`; },
 q27: t => { const [N, a] = PAIRS[(t + 10) * 7 % PAIRS.length]; return `Find the order of a = ${n(a)} mod N = ${n(N)}. ${n(a)} and ${n(N)} are coprime.`; },
 q28: t => `Count the primitive roots mod the prime p = ${n(P28[(t + 10) % 11])}.`,
 q29: t => `2 is a primitive root mod 13. Find the index of b = ${n(2 + (t + 10) % 11)}, base 2.`,
 q30: t => `Solve x² ≡ ${n(t + 11)} (mod 23) for x from 1 to 22.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
