/* Logic and proof concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const TF = b => b ? 'T' : 'F';
const upTo = N => Array.from({ length: N }, (_, i) => i + 1);
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
/* The rows of a table in the standard order, as lists of true/false (first letter T on the top half). */
const rows = k => Array.from({ length: 2 ** k }, (_, i) => Array.from({ length: k }, (_, j) => ((i >> (k - 1 - j)) & 1) === 0));
/* Shared with variants-a.js through the formulas below: keep the two files in step. The statement lists are the
   same, in the same order, in both files. */
const imp = (a, b) => !a || b;
const S08 = [['(p ∨ q) → ¬r', (p, q, r) => imp(p || q, !r)], ['p ∧ (q ∨ r)', (p, q, r) => p && (q || r)], ['(p → q) ∧ r', (p, q, r) => imp(p, q) && r],
 ['¬p ∨ (q ∧ r)', (p, q, r) => !p || (q && r)], ['(p ↔ q) ∧ ¬r', (p, q, r) => (p === q) && !r], ['p ∨ (q ↔ r)', (p, q, r) => p || q === r],
 ['(p ∧ ¬q) → r', (p, q, r) => imp(p && !q, r)], ['¬(p ∨ q) ∧ r', (p, q, r) => !(p || q) && r]];
const S09 = [['p → (p ∨ q)', (p, q) => imp(p, p || q)], ['(p → q) ∧ q', (p, q) => imp(p, q) && q], ['p ∧ ¬p', p => p && !p], ['(p ∧ q) → q', (p, q) => imp(p && q, q)],
 ['(p ∨ q) → p', (p, q) => imp(p || q, p)], ['¬(p → q)', (p, q) => !imp(p, q)], ['(p ↔ q) ∨ (p ↔ ¬q)', (p, q) => (p === q) || (p === !q)]];
const S10 = [['p → q', '¬p ∨ q', (p, q) => imp(p, q), (p, q) => !p || q], ['p → q', 'q → p', (p, q) => imp(p, q), (p, q) => imp(q, p)],
 ['¬(p ∨ q)', '¬p ∨ ¬q', (p, q) => !(p || q), (p, q) => !p || !q], ['p ∨ q', 'p ∧ q', (p, q) => p || q, (p, q) => p && q],
 ['p ↔ q', '¬p ↔ ¬q', (p, q) => p === q, (p, q) => !p === !q], ['p ∨ q', 'p ↔ ¬q', (p, q) => p || q, (p, q) => p === !q]];
const cmp = (x, y) => x > y ? 'greater than' : x === y ? 'equal to' : 'less than';
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A reading a from 15 to 22 in three sentences: "a is greater than 18", "a is less than 20", "a + 2 equals 20". */
 q01: t => { t = T(t); const a = 15 + (t + 10) % 8, s = [a > 18, a < 20, a + 2 === 20], k = s.filter(x => x).length;
  return E('Predict how many of the three sentences are true statements.', `${n(a)} is ${cmp(a, 18)} 18, so sentence 1 is ${s[0] ? 'true' : 'false'}. ${n(a)} is ${cmp(a, 20)} 20, so sentence 2 is ${s[1] ? 'true' : 'false'}. ${n(a)} + 2 = ${n(a + 2)}, so sentence 3 is ${s[2] ? 'true' : 'false'}. True sentences: ${n(k)}.`, [['True sentences', k], ['Reading', a], ['Reading + 2', a + 2]]); },
 /* Readings 36, 41, 45, 48, 52, 57, 60 and a limit k from 40 to 54: the largest reading with "not more than k" true. */
 q02: t => { t = T(t); const k = 40 + (t + 10) % 15, log = [36, 41, 45, 48, 52, 57, 60], ok = log.filter(x => x <= k), big = Math.max(...ok);
  return E('Predict the largest reading in the log that makes ¬p true.', `¬p, “not more than ${n(k)} litres”, means ${n(k)} litres or fewer. ${ok.length === 1 ? `Only ${n(big)} qualifies, so it is the largest.` : `The readings that qualify are ${ok.map(n).join(', ')}, and the largest is ${n(big)}.`}`, [['Largest reading (litres)', big], ['Readings with ¬p true', ok.length], ['Limit k (litres)', k]]); },
 /* p: n is greater than a (a from 2 to 22), q: n is a multiple of 3, over 1 to 30. */
 q03: t => { t = T(t); const a = 12 + t, both = upTo(30).filter(x => x > a && x % 3 === 0), cp = 30 - a;
  return E('Predict how many whole numbers from 1 to 30 make p ∧ q true.', `p, “n is greater than ${n(a)}”, holds for ${pl(cp, 'number')}. The multiples of 3 among them are ${both.map(n).join(', ')}: ${pl(both.length, 'number')}.`, [['Numbers with p ∧ q true', both.length], ['Numbers with p true', cp], ['Numbers with q true', 10]]); },
 /* p: n is less than a (a from 3 to 17), q: n is a multiple of 5, over 1 to 30. */
 q04: t => { t = T(t); const a = 3 + (t + 10) % 15, cp = a - 1, cb = upTo(a - 1).filter(x => x % 5 === 0).length, co = cp + 6 - cb;
  return E('Predict how many whole numbers from 1 to 30 make p ∨ q true.', `p holds for ${pl(cp, 'number')} and q, a multiple of 5, for 6 numbers. ${cb === 0 ? 'None makes both true' : `${pl(cb, 'number makes', 'numbers make')} both true`}, so p ∨ q holds for ${cb === 0 ? `${n(cp)} + 6` : `${n(cp)} + 6 − ${n(cb)}`} = ${n(co)}.`, [['Numbers with p ∨ q true', co], ['Numbers with p true', cp], ['Numbers with both true', cb]]); },
 /* The eight cycles of q05 (pressures and doors fixed); the limit k from 76 to 96 kPa. */
 q05: t => { t = T(t); const k = 76 + (t + 10), log = [[84, 0], [97, 0], [88, 1], [90, 0], [75, 0], [93, 1], [86, 1], [101, 0]],
  hyp = log.filter(([x]) => x < k), bad = hyp.filter(([, l]) => !l);
  return E('Predict how many of the eight cycles break the rule.', `The hypothesis, pressure below ${n(k)} kPa, is true in ${pl(hyp.length, 'cycle')}: ${hyp.map(([x]) => n(x)).join(', ')}. The door is open in ${n(bad.length)} of them, so ${pl(bad.length, 'cycle breaks', 'cycles break')} the rule.`, [['Cycles that break the rule', bad.length], ['Cycles with a true hypothesis', hyp.length], ['Limit (kPa)', k]]); },
 /* p: n is greater than a (a from 2 to 18), q: n is a multiple of 3, over 1 to 20. */
 q06: t => { t = T(t); const a = 2 + (t + 10) % 17, cb = upTo(20).filter(x => x > a && x % 3 === 0).length, cn = upTo(20).filter(x => x <= a && x % 3 !== 0).length;
  return E('Predict how many whole numbers from 1 to 20 make p ↔ q true.', `Both true (greater than ${n(a)} and a multiple of 3): ${n(cb)}. Both false (at most ${n(a)} and not a multiple of 3): ${n(cn)}. p ↔ q is true for ${n(cb)} + ${n(cn)} = ${n(cb + cn)}.`, [['Numbers with p ↔ q true', cb + cn], ['Both true', cb], ['Both false', cn]]); },
 /* Four letters p, q, r, s: the case numbered (t + 10) mod 16 in the standard order. */
 q07: t => { t = T(t); const i = (t + 10) % 16, v = rows(4)[i], w = [8, 4, 2, 1], skip = w.filter((_, j) => !v[j]);
  return E('Predict the row number of the case in the standard order.', `Blocks: p 8 rows, q 4, r 2, s 1. The false letters skip ${skip.length ? skip.map(n).join(' + ') : 'no rows'}${skip.length > 1 ? ` = ${n(i)}` : ''}, so the case ${v.map(TF).join('')} is on row ${n(i + 1)}.`, [['Row number', i + 1], ['Rows in the table', 16], ['Rows skipped', i]]); },
 /* One of eight statements in p, q and r. */
 q08: t => { t = T(t); const [s, f] = S08[(t + 10) % S08.length], col = rows(3).map(v => f(...v)), k = col.filter(x => x).length;
  return E('Predict how many of the 8 rows make the statement true.', `In the standard order the column for ${s} reads ${col.map(TF).join('')}: ${pl(k, 'row')} with T.`, [['True rows', k], ['Rows', 8], ['False rows', 8 - k]]); },
 /* One of seven statements in p and q, some of them tautologies or contradictions. */
 q09: t => { t = T(t); const [s, f] = S09[(t + 10) % S09.length], col = rows(2).map(v => f(...v)), k = col.filter(x => x).length;
  return E('Predict how many of the 4 rows make the statement true.', `The column for ${s} reads ${col.map(TF).join('')}: ${pl(k, 'row')} with T, so it is ${k === 4 ? 'a tautology' : k === 0 ? 'a contradiction' : 'neither a tautology nor a contradiction'}.`, [['True rows', k], ['Tautology (1 or 0)', k === 4 ? 1 : 0], ['Contradiction (1 or 0)', k === 0 ? 1 : 0]]); },
 /* One of six pairs of statements in p and q. */
 q10: t => { t = T(t); const [a, b, f, g] = S10[(t + 10) % S10.length], cf = rows(2).map(v => f(...v)), cg = rows(2).map(v => g(...v)), d = cf.filter((x, i) => x !== cg[i]).length;
  return E('Predict on how many of the 4 rows the two statements differ.', `${a} reads ${cf.map(TF).join('')} and ${b} reads ${cg.map(TF).join('')}. They differ on ${pl(d, 'row')}${d === 0 ? ', so they are logically equivalent' : ''}.`, [['Rows that differ', d], ['True rows of the first', cf.filter(x => x).length], ['True rows of the second', cg.filter(x => x).length]]); }
});
})();
