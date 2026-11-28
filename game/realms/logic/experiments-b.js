/* Logic and proof concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
/* The 8 rows of p, q, r in the standard order (row 1 all true), and the 4 rows of p, q. */
const ROWS3 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => [!(i & 4), !(i & 2), !(i & 1)]);
const ROWS2 = [0, 1, 2, 3].map(i => [!(i & 2), !(i & 1), false]);
const imp = (a, b) => !a || b;
const rowsText = list => list.length === 1 ? `row ${list[0]}` : `rows ${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
/* q11: statement B, compared with A = (p ∧ q) → r. */
const B11 = [
 ['p → (q → r)', (p, q, r) => imp(p, imp(q, r))], ['(p → r) ∨ (q → r)', (p, q, r) => imp(p, r) || imp(q, r)],
 ['(p ∨ q) → r', (p, q, r) => imp(p || q, r)], ['(¬p ∨ ¬q) ∨ r', (p, q, r) => !p || !q || r],
 ['p → r', (p, q, r) => imp(p, r)], ['(p ∧ q) ∨ r', (p, q, r) => (p && q) || r], ['q → r', (p, q, r) => imp(q, r)]
];
/* q14: the airlock log, as [reading, door locked]. */
const LOG14 = [[86, 0], [92, 1], [95, 0], [99, 0], [101, 1], [104, 0], [107, 1], [111, 0], [89, 1], [97, 0]];
/* q17: the hold log, as [kg, fragile, strapped]. */
const LOG17 = [[18, 1, 0], [24, 1, 0], [27, 1, 1], [31, 1, 0], [33, 0, 0], [36, 1, 1], [39, 1, 0], [42, 1, 0], [22, 0, 0], [29, 1, 0]];
/* q18: arguments as [text, letters, premises, conclusion]. */
const ARG18 = [
 ['p → q, p, so q', 2, [(p, q) => imp(p, q), p => p], (p, q) => q],
 ['p → q, q, so p', 2, [(p, q) => imp(p, q), (p, q) => q], p => p],
 ['p → q, ¬q, so ¬p', 2, [(p, q) => imp(p, q), (p, q) => !q], p => !p],
 ['p → q, ¬p, so ¬q', 2, [(p, q) => imp(p, q), p => !p], (p, q) => !q],
 ['p ∨ q, p → r, so r', 3, [(p, q) => p || q, (p, q, r) => imp(p, r)], (p, q, r) => r],
 ['p → q, q → r, so p → r', 3, [(p, q) => imp(p, q), (p, q, r) => imp(q, r)], (p, q, r) => imp(p, r)],
 ['p → q, q → r, so r → p', 3, [(p, q) => imp(p, q), (p, q, r) => imp(q, r)], (p, q, r) => imp(r, p)],
 ['p ∨ q, p, so ¬q', 2, [(p, q) => p || q, p => p], (p, q) => !q]
];
/* q20: one argument pattern per slider value, with its verdict and its bad-row count. */
const ARG20 = [
 ['modus ponens', 1, 0], ['modus tollens', 1, 0], ['affirming the conclusion', 0, 1],
 ['denying the hypothesis', 0, 1], ['the chain rule', 1, 0], ['a chain read backwards', 0, 2]
];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A = (p ∧ q) → r against seven statements B; four of them are equivalent to A. */
 q11: t => { t = T(t); const [text, f] = B11[(t + 10) % 7], a = ROWS3.map(([p, q, r]) => imp(p && q, r) ? 1 : 0), b = ROWS3.map(([p, q, r]) => f(p, q, r) ? 1 : 0),
  diff = a.map((x, i) => x !== b[i] ? i + 1 : 0).filter(Boolean), tb = b.reduce((s, x) => s + x, 0);
  return E('Predict the number of rows on which A and B have different truth values.', `Row by row, A is ${a.join(', ')} and B, ${text}, is ${b.join(', ')}. ${diff.length ? `They differ on ${rowsText(diff)}: ${diff.length} in all.` : 'They agree on every row, so the count is 0 and the two are logically equivalent.'}`,
   [['Rows that differ', diff.length], ['True rows of B', tb], ['True rows of A', 7]]); },
 /* ¬(p ∧ q) for n from 1 to 30, p "n > a" (a from 5 to 25), q "n is a multiple of 3". */
 q12: t => { t = T(t); const a = 15 + t, both = 10 - Math.floor(a / 3), ok = 30 - both;
  return E('Predict how many numbers from 1 to 30 make ¬(p ∧ q) true.', `By De Morgan’s laws ¬(p ∧ q) ≡ ¬p ∨ ¬q, so only the numbers that make p ∧ q true are left out: the multiples of 3 above ${n(a)}, of which there are ${n(both)}. So 30 − ${n(both)} = ${n(ok)} numbers make it true.`,
   [['Numbers that make it true', ok], ['Numbers that make p ∧ q true', both]]); },
 /* "If n > a, then n > 5" for a from 1 to 11 (never 5): count the true ones among converse, inverse, contrapositive. */
 q13: t => { t = T(t); const a = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11][(t + 10) % 10], rule = a > 5 ? 1 : 0, conv = 1 - rule, count = 2 * conv + rule;
  return E('Predict how many of the converse, the inverse and the contrapositive are true.', `The rule is ${rule ? 'true' : `false (n = 5 breaks it)`}, so its contrapositive is ${rule ? 'true' : 'false'} too. The converse “if n > 5, then n > ${n(a)}” is ${conv ? 'true' : `false (n = ${n(a)} breaks it)`}, and the inverse matches the converse. That makes ${n(count)} true.`,
   [['True statements among the three', count], ['Rule (1 or 0)', rule], ['Converse (1 or 0)', conv]]); },
 /* The rule "if the reading is below a, then the door is locked" against a fixed log of 10 cycles, a from 90 to 110. */
 q14: t => { t = T(t); const a = 100 + t, low = LOG14.filter(([v]) => v < a).length, br = LOG14.filter(([v, l]) => v < a && !l).length;
  return E('Predict how many logged cycles broke the rule.', `The rule is broken when p ∧ ¬q is true: a reading below ${n(a)} with the door open. ${n(low)} readings are below ${n(a)}, and the door was open in ${n(br)} of those cycles.`,
   [['Cycles that broke the rule', br], ['Cycles with a reading below the threshold', low]]); },
 /* ∃x (x > c) over the domain 3, 7, 8, 12, 15, 20, 21, for c from 2 to 22. */
 q15: t => { t = T(t); const c = 12 + t, dom = [3, 7, 8, 12, 15, 20, 21], wit = dom.filter(x => x > c);
  return E('Predict the number of witnesses for ∃x (x > c).', wit.length ? `The witnesses are the numbers in the domain above ${n(c)}: ${wit.join(', ')}. The claim is true.` : `No number in the domain is above ${n(c)}, so there are no witnesses and the claim is false.`,
   [['Witnesses', wit.length], ['Claim true (1) or false (0)', wit.length ? 1 : 0]]); },
 /* "For every n from 1 to 20, n² < kn + 10" for k from 1 to 6. */
 q16: t => { t = T(t); const k = 1 + (t + 10) % 6; let x = 1; while (x * x < k * x + 10) x++;
  return E('Predict the smallest counterexample to the claim.', `The claim holds while n² is below ${k === 1 ? '' : n(k)}n + 10. At n = ${n(x - 1)}: ${n((x - 1) * (x - 1))} < ${n(k * (x - 1) + 10)}. At n = ${n(x)}: ${n(x * x)} is not below ${n(k * x + 10)}, so n = ${n(x)} is the smallest counterexample.`,
   [['Smallest counterexample', x], ['n² there', x * x], ['Right side there', k * x + 10]]); },
 /* "If a crate weighs more than w kg and is fragile, then it is strapped" against a fixed log of 10 crates, w from 20 to 40. */
 q17: t => { t = T(t); const w = 20 + 2 * ((t + 10) % 11), hyp = LOG17.filter(([v, f]) => v > w && f).length, br = LOG17.filter(([v, f, s]) => v > w && f && !s).length;
  return E('Predict how many crates break the rule.', `The rule is broken when p ∧ q ∧ ¬r is true: over ${n(w)} kg, fragile and loose. ${n(hyp)} crates are over ${n(w)} kg and fragile, and ${n(br)} of them are loose.`,
   [['Crates that break the rule', br], ['Crates over the limit and fragile', hyp]]); },
 /* Eight arguments over p, q (4 rows) or p, q, r (8 rows). */
 q18: t => { t = T(t); const [text, k, prem, conc] = ARG18[(t + 10) % 8], rs = k === 2 ? ROWS2 : ROWS3,
  good = rs.map((r, i) => prem.every(f => f(...r)) ? i + 1 : 0).filter(Boolean), bad = good.filter(i => !conc(...rs[i - 1]));
  return E('Predict the number of rows with every premise true and the conclusion false.', `For ${text}: every premise is true on ${rowsText(good)}. ${bad.length ? `The conclusion is false on ${rowsText(bad)}, so the argument is not valid.` : 'The conclusion is true on all of them, so the count is 0 and the argument is valid.'}`,
   [['Rows with true premises and a false conclusion', bad.length], ['Rows with every premise true', good.length], ['Valid (1) or not (0)', bad.length ? 0 : 1]]); },
 /* "If X, then Y" with X from "the beacon is lit" and Y from "the hatch is sealed", either one negated, and one fact. */
 q19: t => { t = T(t); const c = (t + 10) % 8, x = c & 1, y = (c >> 1) & 1, r = (c >> 2) & 1, v = r === 0 ? 1 - y : x;
  return E('Predict the truth value the fact forces on the sentence asked about (1 or 0).', r === 0 ? `The fact is the hypothesis of the rule, so modus ponens gives its conclusion. The hatch is ${y ? 'not ' : ''}sealed, so “the hatch is sealed” is ${v}.` : `The fact denies the conclusion of the rule, so modus tollens makes the hypothesis false. The beacon is ${x ? '' : 'not '}lit, so “the beacon is lit” is ${v}.`,
   [['Truth value forced (1 or 0)', v], ['Rule (1 modus ponens, 2 modus tollens)', r + 1]]); },
 /* One argument pattern per slider value. */
 q20: t => { t = T(t); const [name, v, bad] = ARG20[(t + 10) % 6];
  return E('Predict whether the argument is valid (1) or a fallacy (0).', `This is ${name}. ${v ? 'Whenever its premises are true, its conclusion is true too, so it is valid.' : `Its premises can be true while its conclusion is false (on ${bad} ${bad === 1 ? 'row' : 'rows'} of its truth table), so it is a fallacy.`}`,
   [['Valid (1) or fallacy (0)', v], ['Rows with true premises and a false conclusion', bad]]); }
});
})();
