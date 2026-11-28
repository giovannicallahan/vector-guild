/* Logic and proof review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
/* The same puzzles and lists as experiments-c.js, in the same order: keep the two files in step. */
const PUZZLES = [
 ['Cal is a knave.', 'Ada is a knave.', 'None of us three is a knight.'],
 ['Bo and I are different kinds.', 'Ada is a knight.', 'Ada and Bo are both knights.'],
 ['At least one of Bo and Cal is a knave.', 'Ada and I are different kinds.', 'Bo is a knight.'],
 ['Bo and Cal are both knights.', 'None of us three is a knight.', 'Bo and I are different kinds.'],
 ['Bo is a knave.', 'Cal and I are different kinds.', 'Bo is a knave.'],
 ['At least one of Bo and Cal is a knave.', 'Cal and I are different kinds.', 'Bo and I are the same kind.'],
 ['Bo and Cal are both knights.', 'Ada and I are the same kind.', 'Ada and Bo are both knights.'],
 ['Bo and I are different kinds.', 'At least one of Ada and Cal is a knave.', 'At least one of Ada and Bo is a knave.']
];
const LISTS = [[3, 5], [2, 7], [2, 3], [2, 11, 13], [2, 5, 11], [2, 7, 11], [2, 3, 5], [2, 13], [3, 7], [2, 7, 13]];
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const s = 2 + (t + 10) % 11; return `Airlocks x and keys y are each numbered 1 to 5. Key y fits airlock x exactly when x + y = ${s}.`; },
 q22: t => { const P = PUZZLES[(t + 10) % 8]; return `On the knights-and-knaves island, knights always tell the truth and knaves always lie. Ada says: “${P[0]}” Bo says: “${P[1]}” Cal says: “${P[2]}” Exactly one row fits.`; },
 q23: t => `The yes votes in eight sessions were 12, 7, 15, 9, 20, 4, 11 and 17. The chair claims: “There is a session in which more than ${t + 12} members voted yes.”`,
 q24: t => `A whole number n is odd when n = 2k + 1 for a whole number k. Take n = ${2 * (t + 20) + 1}.`,
 q25: t => { const a = 1 + (t + 10) % 9; return `In the proof that odd × odd is odd, m = 2a + 1 and n = 2b + 1. Take m = ${2 * a + 1} and n = 7, so a = ${a} and b = 3.`; },
 q26: t => `3 | a and 3 | b, with a = ${3 * (t + 12)} and b = 12. The proof writes a = 3s and b = 3t, so a + b = 3(s + t).`,
 q27: t => { const x = 2 * ((t + 10) % 12) + 3; return `To prove “if n² is even, then n is even”, prove its contrapositive “if n is odd, then n² is odd”. Check it for n = ${x}.`; },
 q28: t => `The claim: for every whole number n, n² + n is even. Check it for n = ${t + 12}.`,
 q29: t => `A direct proof shows: if m and n are odd, then m + n is even. Take m = ${2 * (t + 10) + 1} and n = 9.`,
 q30: t => { const ps = LISTS[(t + 10) % 10]; return `Euclid’s proof by contradiction, with the list of primes ${ps.length === 2 ? ps.join(' and ') : ps.slice(0, -1).join(', ') + ' and ' + ps[ps.length - 1]}: N is their product plus 1.`; },
});
Object.assign(window.VARIANT_POOL, {
 /* Every slider value gives a tidy drill; the full range keeps the targets varied. */
 q21: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
 q22: [-10, -9, -8, -7, -6, -5, -4, -3],
 q30: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
});
})();
