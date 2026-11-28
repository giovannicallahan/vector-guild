/* Logic and proof review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
/* The same tables as experiments-b.js. */
const B11 = ['p → (q → r)', '(p → r) ∨ (q → r)', '(p ∨ q) → r', '(¬p ∨ ¬q) ∨ r', 'p → r', '(p ∧ q) ∨ r', 'q → r'];
const LOG14 = [[86, 0], [92, 1], [95, 0], [99, 0], [101, 1], [104, 0], [107, 1], [111, 0], [89, 1], [97, 0]];
const LOG17 = [[18, 1, 0], [24, 1, 0], [27, 1, 1], [31, 1, 0], [33, 0, 0], [36, 1, 1], [39, 1, 0], [42, 1, 0], [22, 0, 0], [29, 1, 0]];
const ARG18 = ['p → q and p, so q (4 rows)', 'p → q and q, so p (4 rows)', 'p → q and ¬q, so ¬p (4 rows)', 'p → q and ¬p, so ¬q (4 rows)',
 'p ∨ q and p → r, so r (8 rows)', 'p → q and q → r, so p → r (8 rows)', 'p → q and q → r, so r → p (8 rows)', 'p ∨ q and p, so ¬q (4 rows)'];
const ARG20 = [
 'If the beacon is lit, then the hatch is sealed. The beacon is lit. So the hatch is sealed.',
 'If the beacon is lit, then the hatch is sealed. The hatch is not sealed. So the beacon is not lit.',
 'If the beacon is lit, then the hatch is sealed. The hatch is sealed. So the beacon is lit.',
 'If the beacon is lit, then the hatch is sealed. The beacon is not lit. So the hatch is not sealed.',
 'If the beacon is lit, then the hatch is sealed. If the hatch is sealed, then the fan is on. So if the beacon is lit, then the fan is on.',
 'If the beacon is lit, then the hatch is sealed. If the hatch is sealed, then the fan is on. So if the fan is on, then the beacon is lit.'
];
Object.assign(window.VARIANT_SETUP, {
 q11: t => `Statement A is (p ∧ q) → r and statement B is ${B11[(T(t) + 10) % 7]}, compared over the 8 rows of p, q and r.`,
 q12: t => `For n from 1 to 30, p is “n is greater than ${15 + T(t)}” and q is “n is a multiple of 3”.`,
 q13: t => `The rule is “If n > ${[1, 2, 3, 4, 6, 7, 8, 9, 10, 11][(T(t) + 10) % 10]}, then n > 5”, about every whole number n.`,
 q14: t => `Rule: if the pressure reading is below ${100 + T(t)}, then the inner door is locked. Log: ${LOG14.map(([v, l]) => `${v} ${l ? 'locked' : 'open'}`).join(', ')}.`,
 q15: t => `The domain is 3, 7, 8, 12, 15, 20, 21 and the claim is ∃x (x > ${12 + T(t)}).`,
 q16: t => { const k = 1 + (T(t) + 10) % 6; return `The claim: for every whole number n from 1 to 20, n² < ${k === 1 ? '' : k}n + 10.`; },
 q17: t => `Rule: if a crate weighs more than ${20 + 2 * ((T(t) + 10) % 11)} kg and is fragile, then it is strapped. Log: ${LOG17.map(([v, f, s]) => `${v} kg ${f ? 'fragile' : 'not fragile'} ${s ? 'strapped' : 'loose'}`).join(', ')}.`,
 q18: t => `The argument: ${ARG18[(T(t) + 10) % 8]}.`,
 q19: t => { const c = (T(t) + 10) % 8, x = c & 1, y = (c >> 1) & 1, r = (c >> 2) & 1, X = `the beacon is ${x ? 'not ' : ''}lit`, Y = `the hatch is ${y ? 'not ' : ''}sealed`;
  return `The rule: “If ${X}, then ${Y}.” The fact: ${r === 0 ? X : `the hatch is ${y ? '' : 'not '}sealed`}. The sentence asked about: “${r === 0 ? 'the hatch is sealed' : 'the beacon is lit'}”.`; },
 q20: t => `The argument: ${ARG20[(T(t) + 10) % 6]}`
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
