/* Logic and proof review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
/* The same statement lists, in the same order, as experiments-a.js. */
const S08 = ['(p ∨ q) → ¬r', 'p ∧ (q ∨ r)', '(p → q) ∧ r', '¬p ∨ (q ∧ r)', '(p ↔ q) ∧ ¬r', 'p ∨ (q ↔ r)', '(p ∧ ¬q) → r', '¬(p ∨ q) ∧ r'];
const S09 = ['p → (p ∨ q)', '(p → q) ∧ q', 'p ∧ ¬p', '(p ∧ q) → q', '(p ∨ q) → p', '¬(p → q)', '(p ↔ q) ∨ (p ↔ ¬q)'];
const S10 = [['p → q', '¬p ∨ q'], ['p → q', 'q → p'], ['¬(p ∨ q)', '¬p ∨ ¬q'], ['p ∨ q', 'p ∧ q'], ['p ↔ q', '¬p ↔ ¬q'], ['p ∨ q', 'p ↔ ¬q']];
const TF = b => b ? 'true' : 'false';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => { const a = 15 + (t + 10) % 8; return `The tank gauge reads ${n(a)}. Sentence 1: “${n(a)} is greater than 18.” Sentence 2: “${n(a)} is less than 20.” Sentence 3: “${n(a)} + 2 equals 20.”`; },
 q02: t => `p is “the tank holds more than ${n(40 + (t + 10) % 15)} litres”. The log readings, in litres, are 36, 41, 45, 48, 52, 57 and 60.`,
 q03: t => `p is “n is greater than ${n(12 + t)}” and q is “n is a multiple of 3”, for whole numbers n from 1 to 30.`,
 q04: t => `p is “n is less than ${n(3 + (t + 10) % 15)}” and q is “n is a multiple of 5”, for whole numbers n from 1 to 30. “Or” is inclusive.`,
 q05: t => `Rule: “If the pressure is below ${n(76 + (t + 10))} kPa, then the inner door is locked.” Eight cycles (kPa, door): 84 open, 97 open, 88 locked, 90 open, 75 open, 93 locked, 86 locked, 101 open.`,
 q06: t => `p is “n is greater than ${n(2 + (t + 10) % 17)}” and q is “n is a multiple of 3”, for whole numbers n from 1 to 20.`,
 q07: t => { const i = (t + 10) % 16, v = [8, 4, 2, 1].map(w => Math.floor(i / w) % 2 === 0); return `A table for p, q, r and s in the standard order. The case: p ${TF(v[0])}, q ${TF(v[1])}, r ${TF(v[2])}, s ${TF(v[3])}.`; },
 q08: t => `The statement ${S08[(t + 10) % S08.length]}, with a truth table for p, q and r.`,
 q09: t => `The statement ${S09[(t + 10) % S09.length]}, with a truth table for p and q.`,
 q10: t => { const [a, b] = S10[(t + 10) % S10.length]; return `The statements ${a} and ${b}, in one truth table for p and q.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
