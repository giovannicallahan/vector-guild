/* Logic and proof missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/logic/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · Statements and truth values [CM 2.1]
     q02  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · Negation ¬ [CM 2.1]
     q03  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · And (∧) [CM 2.2]
     q04  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · Inclusive or (∨) [CM 2.2]
     q05  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · If … then (→): hypothesis and conclusion [CM 2.2, 2.4]
     q06  ch 1 Statements · Basic, 100 XP · sector 'Switch Room' · If and only if (↔) [CM 2.4]
     q07  ch 2 Truth tables · Basic, 100 XP · sector 'Control Panel' · Truth tables: one row per case, doubling with each letter [CM 2.3]
     q08  ch 2 Truth tables · Basic, 100 XP · sector 'Control Panel' · Building a truth table [CM 2.3]
     q09  ch 2 Truth tables · Basic, 100 XP · sector 'Control Panel' · Tautologies and contradictions [CM 2.3, Levin 3.1]
     q10  ch 2 Truth tables · Basic, 100 XP · sector 'Control Panel' · Logical equivalence: rows where two statements differ [CM 2.5, Levin 3.1] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 2 Logic; Oscar Levin, Discrete Mathematics: An Open Introduction, 3rd edition sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Levin/ (OpenStax or Levin).
   A title reads like: Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs
   Link to the section page itself: https://discrete.openmathbooks.org/dmoi3/<page>.html */
const source = {
 cm21: { title: 'OpenStax Contemporary Mathematics — 2.1 Statements and Quantifiers', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-1-statements-and-quantifiers', description: 'Statements, truth values and negation, with the words all, some and none.', verified: '2026-11-27' },
 cm22: { title: 'OpenStax Contemporary Mathematics — 2.2 Compound Statements', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-2-compound-statements', description: 'Compound statements built with not, and, or and if … then, written in words and in symbols.', verified: '2026-11-27' },
 cm23: { title: 'OpenStax Contemporary Mathematics — 2.3 Constructing Truth Tables', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-3-constructing-truth-tables', description: 'Building truth tables for compound statements, one row for each case of the letters.', verified: '2026-11-27' },
 cm24: { title: 'OpenStax Contemporary Mathematics — 2.4 Truth Tables for the Conditional and Biconditional', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-4-truth-tables-for-the-conditional-and-biconditional', description: 'When an if-then statement and an if-and-only-if statement are true or false.', verified: '2026-11-27' },
 cm25: { title: 'OpenStax Contemporary Mathematics — 2.5 Equivalent Statements', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-5-equivalent-statements', description: 'Logically equivalent statements, checked by comparing truth tables.', verified: '2026-11-27' },
 levin31: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.1 Propositional Logic', url: 'https://discrete.openmathbooks.org/dmoi3/sec_propositional.html', description: 'Truth tables, tautologies, contradictions and logical equivalence.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01',
  title: 'Reading the airlock screen',
  topic: 'Statements and truth values',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'The airlock computer has started printing its rules as sentences, and Mira wants each one marked true or false before anyone trusts it.',
  lesson: 'A statement is a sentence that is either true or false; its truth value is typed as 1 for true and 0 for false.',
  prompt: 'The airlock computer shows three sentences. Sentence 1: “17 is greater than 3 × 6.” Sentence 2: “28 + 15 equals 43.” Sentence 3: “9 is less than 31 − 24.” Each one is a statement. Enter the value of 3 × 6 first. Then enter the truth value of each sentence in order, typing 1 for true and 0 for false.',
  answer: [18, 0, 1, 0],
  labels: ['value of the product', 'sentence 1 (1 or 0)', 'sentence 2 (1 or 0)', 'sentence 3 (1 or 0)'],
  tolerance: 0.01,
  hints: ['Work out the calculation in each sentence first, then compare the two sides.', '“Greater than” and “less than” are both false when the two sides are equal.'],
  solution: '3 × 6 = 18, and 17 is less than 18, so sentence 1 is false: 0. 28 + 15 = 43, the same as 43, so sentence 2 is true: 1. 31 − 24 = 7, and 9 is greater than 7, so sentence 3 is false: 0.',
  xp: 100,
  prereqs: [],
  artifact: { name: 'The first rule card', description: 'Three sentences from the airlock screen, each marked 1 or 0.' },
  sources: [source.cm21],
  teaching: {
   intuition: 'Logic starts with one kind of sentence: a statement. A statement is a sentence that is either true or false, but not both. “17 is greater than 15” is a statement, and it is true. “4 + 4 equals 9” is also a statement, and it is false: a false sentence still counts. A question such as “Is the door shut?” or an order such as “Shut the door” is not a statement, because it cannot be true or false. Whether a statement is true or false is called its truth value. In this realm you type a truth value as a number: 1 for true and 0 for false.',
   steps: ['Check that the sentence makes a claim that can be true or false. That makes it a statement.', 'Work out any calculation in it first, so that each side is a single number.', 'Compare the two sides exactly as the sentence says: greater than, less than or equals.', 'Write the truth value: 1 if the claim holds, 0 if it does not.'],
   example: { prompt: 'Sentence: “29 is greater than 4 × 7.” Is it a statement, and what is its truth value?', steps: ['It claims something that is either true or false, so it is a statement.', '4 × 7 = 28.', '29 is greater than 28, so the claim holds.'], answer: 'A true statement: truth value 1.' },
   pitfalls: ['Reading “greater than” as “at least”. 20 is not greater than 20, so “20 is greater than 4 × 5” is false.', 'Treating a false sentence as “not a statement”. A false claim is still a statement; only questions, orders and the like are not.', 'Comparing before working out the calculation, so the wrong two numbers are compared.']
  },
  guidance: [
   { prompt: 'Sentence 1 compares 17 with 3 × 6. What is 3 × 6, and is the sentence true (1) or false (0)?', answer: [18, 0], labels: ['value of the product', 'sentence 1 (1 or 0)'], explanation: '3 × 6 = 18. 17 is less than 18, so the sentence is false.' },
   { prompt: 'Sentence 2 says 28 + 15 equals 43. What is 28 + 15, and is the sentence true (1) or false (0)?', answer: [43, 1], labels: ['value of the sum', 'sentence 2 (1 or 0)'], explanation: '28 + 15 = 43, the same as 43, so the sentence is true.' },
   { prompt: 'Sentence 3 compares 9 with 31 − 24. What is 31 − 24, and is the sentence true (1) or false (0)?', answer: [7, 0], labels: ['value of the difference', 'sentence 3 (1 or 0)'], explanation: '31 − 24 = 7. 9 is greater than 7, so the sentence is false.' }
  ]
 },
 {
  id: 'q02',
  title: 'The tank gauge rule',
  topic: 'Negation ¬',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'The overflow check reads the water tank’s rule the other way round, so the crew needs to know exactly what its opposite says.',
  lesson: 'The negation ¬p is true exactly when p is false.',
  prompt: 'The water tank rule p says: “The tank holds more than 46 litres.” Its negation ¬p says: “The tank holds not more than 46 litres.” Today’s log shows these readings, in litres: 52, 46, 39, 48, 44, 57. Enter the truth value of ¬p for the first reading (1 for true, 0 for false). Then enter the largest reading in the log that makes ¬p true.',
  answer: [0, 46],
  labels: ['¬p for the first reading (1 or 0)', 'reading asked for (litres)'],
  tolerance: 0.01,
  hints: ['¬p is true exactly when p is false. Decide p for a reading first, then flip it.', 'Mind the boundary: a reading equal to the limit in the rule is not more than that limit, so it makes ¬p true.'],
  solution: 'For the first reading, 52 litres, p is true, so ¬p is false: 0. ¬p means the tank holds 46 litres or fewer. The readings that make ¬p true are 46, 39, 44, and the largest of them is 46 litres.',
  xp: 100,
  prereqs: ['q01'],
  artifact: { name: 'Overflow gauge tag', description: 'A tank rule and its negation, written side by side.' },
  sources: [source.cm21],
  teaching: {
   intuition: 'Every statement has an opposite. The negation of a statement p says that p is not the case. We write it ¬p and read it “not p”. The symbol ¬ flips the truth value: when p is true, ¬p is false, and when p is false, ¬p is true. Letters such as p and q stand for whole statements, the way x stands for a number. Take care with the negation of a comparison. If p is “the tank holds more than 50 litres”, then ¬p is “the tank holds not more than 50 litres”, which means 50 litres or fewer. Exactly 50 litres makes p false, so it makes ¬p true.',
   steps: ['Decide whether p is true or false for the case in front of you.', 'Flip it: ¬p has the opposite truth value.', 'To list the cases that make ¬p true, say it without “not”: “not more than k” is “k or fewer”, and “not less than k” is “k or more”.', 'Check the boundary value k itself: it makes “more than k” false, so it makes “not more than k” true.'],
   example: { prompt: 'p is “the tank holds less than 30 litres”. The readings are 24, 30, 35 and 28 litres. What is ¬p for the reading 24, and what is the smallest reading that makes ¬p true?', steps: ['24 is less than 30, so p is true and ¬p is false: 0.', '¬p, “not less than 30 litres”, means 30 litres or more.', 'The readings 30 and 35 qualify, and the smaller is 30.'], answer: '¬p is 0 for 24 litres, and the smallest reading with ¬p true is 30 litres.' },
   pitfalls: ['Turning “not more than k” into “less than k”, which wrongly leaves out k itself.', 'Changing the reading instead of the truth value. ¬p does not change any number, only whether the claim holds.', 'Forgetting that the negation of a true statement is false, and the negation of a false one is true, whatever words the statement uses.']
  },
  guidance: [
   { prompt: 'The first reading is 52 litres. Is p, “the tank holds more than 46 litres”, true (1) or false (0) for it? Then what is ¬p?', answer: [1, 0], labels: ['p (1 or 0)', '¬p (1 or 0)'], explanation: '52 is more than 46, so p is true and ¬p, its opposite, is false.' },
   { prompt: '¬p means the tank holds 46 litres or fewer. How many of the six readings make ¬p true?', answer: [3], labels: ['readings with ¬p true'], explanation: 'The readings 46, 39, 44 are 46 litres or fewer: 3 readings.' },
   { prompt: 'Which is the largest of those readings?', answer: [46], labels: ['reading asked for (litres)'], explanation: 'Of 46, 39, 44, the largest is 46.' }
  ]
 },
 {
  id: 'q03',
  title: 'The double-check airlock code',
  topic: 'And (∧)',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'The inner airlock should open only for codes that pass two checks at once, and the crew wants to know how many codes get through.',
  lesson: 'A conjunction p ∧ q is true only when p and q are both true.',
  prompt: 'The airlock accepts a code number n only when p ∧ q is true, where p is “n is greater than 7” and q is “n is a multiple of 4”. Enter the truth value of p ∧ q for the code 12 (1 for true, 0 for false). Then enter how many whole numbers from 1 to 30 make p ∧ q true.',
  answer: [1, 6],
  labels: ['p ∧ q for the code (1 or 0)', 'numbers with p ∧ q true'],
  tolerance: 0.01,
  hints: ['p ∧ q is true only when p and q are both true. One false part makes the whole statement false.', 'Go through the numbers from 1 to 30 that make p true, and keep only those that also make q true.'],
  solution: 'For 12: p is true and q is true, so p ∧ q is true: 1. From 1 to 30, p is true for 23 numbers, and the ones that also make q true are 8, 12, 16, 20, 24, 28. That is 6 numbers.',
  xp: 100,
  prereqs: ['q02'],
  artifact: { name: 'Two-key lock diagram', description: 'Both checks must pass before the inner door opens.' },
  sources: [source.cm22],
  teaching: {
   intuition: 'Two statements can be joined into one. A statement built from smaller statements is a compound statement. The word “and” makes a conjunction, written p ∧ q and read “p and q”. A conjunction makes a strong claim: both parts hold. So p ∧ q is true only when p is true and q is true. If either part is false, or both are, the conjunction is false. A statement can also be about a number n that we can change, such as “n is greater than 10”. Each whole number you put in for n gives a statement that is true or false, so we can count the numbers that make p ∧ q true.',
   steps: ['For one number, decide the truth value of p and of q separately.', 'p ∧ q is true (1) only if both are true; otherwise it is false (0).', 'To count over a range, first list the numbers that make p true.', 'Keep only those that also make q true, and count them.'],
   example: { prompt: 'p is “n is greater than 5” and q is “n is a multiple of 3”. What is p ∧ q for n = 3, and how many whole numbers from 1 to 15 make p ∧ q true?', steps: ['For 3, p is false (3 is not greater than 5), so p ∧ q is false: 0, even though q is true.', 'The numbers from 1 to 15 that are greater than 5 are 6 to 15.', 'The multiples of 3 among them are 6, 9, 12 and 15: 4 numbers.'], answer: 'p ∧ q is 0 for n = 3, and 4 numbers from 1 to 15 make it true.' },
   pitfalls: ['Calling p ∧ q true because one part is true. Both parts must be.', 'Adding the count for p to the count for q. A conjunction keeps only the numbers that are in both lists.', 'Including the boundary: “greater than 10” does not include 10.']
  },
  guidance: [
   { prompt: 'Take the code 12. Is p true (1) or false (0)? Is q?', answer: [1, 1], labels: ['p (1 or 0)', 'q (1 or 0)'], explanation: 'p, “n is greater than 7”, is true for 12, and q, “n is a multiple of 4”, is true. So p ∧ q is true.' },
   { prompt: 'How many whole numbers from 1 to 30 make p true?', answer: [23], labels: ['numbers with p true'], explanation: 'p, “n is greater than 7”, holds for 23 numbers from 1 to 30.' },
   { prompt: 'Of those, how many also make q true?', answer: [6], labels: ['numbers with p ∧ q true'], explanation: 'Both parts hold for 8, 12, 16, 20, 24, 28, which is 6 numbers.' }
  ]
 },
 {
  id: 'q04',
  title: 'When the pressure alarm sounds',
  topic: 'Inclusive or (∨)',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'The pressure alarm sounds when either of two warnings fires, and the crew needs to know how many sensors can set it off.',
  lesson: 'A disjunction p ∨ q uses the inclusive or: it is true when at least one of p and q is true, including when both are.',
  prompt: 'The pressure alarm sounds for a sensor number n when p ∨ q is true, where p is “n is less than 9” and q is “n is a multiple of 5”. Here “or” is inclusive: p ∨ q is true when p is true, when q is true, or when both are. Enter how many whole numbers from 1 to 40 make p ∨ q true.',
  answer: [15],
  labels: ['numbers with p ∨ q true'],
  tolerance: 0.01,
  hints: ['Count the numbers that make p true and the numbers that make q true.', 'A number that makes both true has been counted twice. Take it away once.'],
  solution: 'From 1 to 40, p is true for 8 numbers and q for 8 numbers. 1 number makes both true, so p ∨ q is true for 8 + 8 − 1 = 15 numbers.',
  xp: 100,
  prereqs: ['q03'],
  artifact: { name: 'Alarm wiring sketch', description: 'Two warning lines feeding one alarm bell.' },
  sources: [source.cm22],
  teaching: {
   intuition: 'The word “or” joins two statements into a disjunction, written p ∨ q and read “p or q”. In logic “or” is inclusive: p ∨ q is true when p is true, when q is true, or when both are. It is false only when both parts are false. Everyday speech sometimes means one or the other but not both, as in “soup or salad”; logic does not. So when you count the numbers that make p ∨ q true, a number that makes both parts true must still be counted, but only once. The count is the numbers for p, plus the numbers for q, minus the numbers that were counted twice.',
   steps: ['Count the numbers in the range that make p true.', 'Count the numbers that make q true.', 'Count the numbers that make both true: they are in both counts.', 'Add the first two counts and take away the overlap once.'],
   example: { prompt: 'p is “n is less than 6” and q is “n is a multiple of 4”. How many whole numbers from 1 to 20 make p ∨ q true?', steps: ['p holds for 1, 2, 3, 4 and 5: 5 numbers.', 'q holds for 4, 8, 12, 16 and 20: 5 numbers.', '4 is in both lists, so it was counted twice.', 'Add and take away the overlap once: 5 + 5 − 1 = 9.'], answer: '9 numbers.' },
   pitfalls: ['Treating “or” as “one but not both” and leaving out the numbers that make both parts true.', 'Adding the two counts without taking away the overlap, so a shared number is counted twice.', 'Forgetting that p ∨ q is false only when both parts are false.']
  },
  guidance: [
   { prompt: 'How many whole numbers from 1 to 40 make p true, and how many make q true?', answer: [8, 8], labels: ['numbers with p true', 'numbers with q true'], explanation: 'p, “n is less than 9”, holds for 8 numbers; q, “n is a multiple of 5”, for 8 numbers.' },
   { prompt: 'How many of the numbers make both p and q true?', answer: [1], labels: ['numbers with both true'], explanation: '1 number makes both true, and it was counted in both lists.' },
   { prompt: 'Add the two counts and take away the overlap once. How many numbers make p ∨ q true?', answer: [15], labels: ['numbers with p ∨ q true'], explanation: '8 + 8 − 1 = 15. Inclusive “or” counts a number that makes both true once, not twice.' }
  ]
 },
 {
  id: 'q05',
  title: 'The inner door rule',
  topic: 'If … then (→): hypothesis and conclusion',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'An airlock rule links the pressure to the inner door, and the log has to be checked for every cycle that broke it.',
  lesson: 'A conditional p → q is false only when its hypothesis p is true and its conclusion q is false.',
  prompt: 'An airlock rule says: “If the pressure is below 90 kPa, then the inner door is locked.” The log of eight cycles gives the pressure in kPa (kilopascals, a unit of pressure) and the inner door: cycle 1, 84, open; cycle 2, 97, open; cycle 3, 88, locked; cycle 4, 90, open; cycle 5, 75, open; cycle 6, 93, locked; cycle 7, 86, locked; cycle 8, 101, open. Enter the truth value of the rule for cycle 1 (1 for true, 0 for false). Then enter how many of the eight cycles break the rule.',
  answer: [0, 2],
  labels: ['rule for cycle 1 (1 or 0)', 'cycles that break the rule'],
  tolerance: 0.01,
  hints: ['The hypothesis is “the pressure is below the limit” and the conclusion is “the inner door is locked”.', 'An if-then rule is broken only when its hypothesis is true and its conclusion is false. When the hypothesis is false, the rule holds whatever the door does.'],
  solution: 'Cycle 1 has 84 kPa, so the hypothesis is true, and the door is open, so the conclusion is false. The rule is false for cycle 1: 0. The hypothesis is true in 4 cycles, and the door is open in 2 of them (cycles 1 and 5). So 2 cycles break the rule.',
  xp: 100,
  prereqs: ['q03'],
  artifact: { name: 'Annotated cycle log', description: 'The cycles that broke the door rule, circled in red.' },
  sources: [source.cm22, source.cm24],
  teaching: {
   intuition: 'Many rules have the form “if p, then q”. This is a conditional, written p → q. The part after “if” is the hypothesis, and the part after “then” is the conclusion. A conditional is a promise: whenever the hypothesis is true, the conclusion will be true too. The only way to break the promise is a case where the hypothesis is true and the conclusion is false. When the hypothesis is false, the rule promises nothing, so it is not broken, and p → q counts as true. That surprises people, but think of the rule “if it rains, the hatch is closed”. On a dry day the rule cannot be broken, whatever the hatch does.',
   steps: ['Split the rule into its hypothesis (after “if”) and its conclusion (after “then”).', 'For each case, decide whether the hypothesis is true and whether the conclusion is true.', 'The conditional is false only for a true hypothesis with a false conclusion. Every other case makes it true.', 'To find the cases that break the rule, keep the cases with a true hypothesis, then count those with a false conclusion.'],
   example: { prompt: 'Rule: “If the battery is below 20 per cent, then the heater is off.” Four readings: 15 per cent, heater on; 35 per cent, heater on; 12 per cent, heater off; 20 per cent, heater on. How many readings break the rule?', steps: ['The hypothesis is “below 20 per cent”. It is true for 15 and 12, and false for 35 and 20.', 'At 15 per cent the heater is on, so the conclusion is false: that reading breaks the rule.', 'At 12 per cent the heater is off, so the rule holds. The other two readings have a false hypothesis, so they cannot break it.'], answer: 'One reading breaks the rule.' },
   pitfalls: ['Counting a case with a false hypothesis as a break. When the hypothesis is false, the conditional is true.', 'Treating “below k” as including k. A reading of exactly k does not make the hypothesis true.', 'Swapping the hypothesis and the conclusion. The rule says what must follow from the pressure, not the other way round.']
  },
  guidance: [
   { prompt: 'In cycle 1 the pressure is 84 kPa and the door is open. Is the hypothesis true (1) or false (0)? Is the conclusion?', answer: [1, 0], labels: ['hypothesis (1 or 0)', 'conclusion (1 or 0)'], explanation: '84 is below 90, so the hypothesis is true; the door is open, so the conclusion is false. The rule is false for this cycle.' },
   { prompt: 'In how many of the eight cycles is the pressure below 90 kPa?', answer: [4], labels: ['cycles with a true hypothesis'], explanation: 'The hypothesis is true in 4 cycles. Only these can break the rule.' },
   { prompt: 'Of those cycles, in how many is the inner door open?', answer: [2], labels: ['cycles that break the rule'], explanation: '2 cycles have a true hypothesis and a false conclusion, and those are the only cycles that break the rule.' }
  ]
 },
 {
  id: 'q06',
  title: 'The pump’s two-way rule',
  topic: 'If and only if (↔)',
  tier: 'Basic',
  sector: 'Switch Room',
  brief: 'The coolant pump follows a two-way rule, and Mira wants it tested on a few numbers and then over the whole dial.',
  lesson: 'A biconditional p ↔ q is true when p and q have the same truth value.',
  prompt: 'The pump runs on the rule p ↔ q, where p is “n is greater than 9” and q is “n is a multiple of 3”. Enter the truth value of p ↔ q for n = 6, then for n = 12, then for n = 10 (1 for true, 0 for false). Then enter how many whole numbers from 1 to 20 make p ↔ q true.',
  answer: [0, 1, 0, 9],
  labels: ['p ↔ q for the first number (1 or 0)', 'p ↔ q for the second number (1 or 0)', 'p ↔ q for the third number (1 or 0)', 'numbers with p ↔ q true'],
  tolerance: 0.01,
  hints: ['p ↔ q is true when p and q have the same truth value: both true or both false.', 'Count the numbers that make both parts true, then the numbers that make both parts false, and add.'],
  solution: 'For 6, p is false and q is true, so p ↔ q is false: 0. For 12, p is true and q is true, so p ↔ q is true: 1. For 10, p is true and q is false, so p ↔ q is false: 0. From 1 to 20, 3 numbers make both parts true and 6 numbers make both false, so p ↔ q is true for 3 + 6 = 9 numbers.',
  xp: 100,
  prereqs: ['q05'],
  artifact: { name: 'Pump rule plate', description: 'A two-way rule, engraved with the symbol ↔.' },
  sources: [source.cm24],
  teaching: {
   intuition: 'Some rules work in both directions: “the pump runs if and only if the coolant is hot”. That means the pump runs when the coolant is hot, and it runs only then. This is a biconditional, written p ↔ q and read “p if and only if q”. It says that p and q always agree. So p ↔ q is true when both parts are true, and also when both parts are false. It is false when one part is true and the other is false. A biconditional says the same as two conditionals at once: p → q and q → p.',
   steps: ['For a number, decide the truth value of p and of q.', 'If they match (both true or both false), p ↔ q is true: 1. If they differ, it is false: 0.', 'To count over a range, count the numbers that make both parts true.', 'Then count the numbers that make both parts false, and add the two counts.'],
   example: { prompt: 'p is “n is less than 8” and q is “n is a multiple of 2”. What is p ↔ q for n = 4, for n = 5 and for n = 9?', steps: ['n = 4: p is true and q is true. They match, so p ↔ q is true: 1.', 'n = 5: p is true and q is false. They differ, so p ↔ q is false: 0.', 'n = 9: p is false and q is false. They match, so p ↔ q is true: 1.'], answer: '1, then 0, then 1.' },
   pitfalls: ['Calling p ↔ q false when both parts are false. Two false parts agree, so the biconditional is true.', 'Treating ↔ like ∧. A conjunction needs both parts true; a biconditional needs them to match.', 'Counting only the numbers that make both parts true, and forgetting those that make both false.']
  },
  guidance: [
   { prompt: 'Take n = 6. Is p true (1) or false (0)? Is q?', answer: [0, 1], labels: ['p (1 or 0)', 'q (1 or 0)'], explanation: 'p is false and q is true. They differ, so p ↔ q is false.' },
   { prompt: 'From 1 to 20, how many numbers make p and q both true?', answer: [3], labels: ['numbers with both true'], explanation: '3 numbers make both “n is greater than 9” and “n is a multiple of 3” true.' },
   { prompt: 'How many make p and q both false?', answer: [6], labels: ['numbers with both false'], explanation: '6 numbers make both parts false. Adding the two counts gives 9.' }
  ]
 },
 {
  id: 'q07',
  title: 'Counting the switch settings',
  topic: 'Truth tables: one row per case, doubling with each letter',
  tier: 'Basic',
  sector: 'Control Panel',
  brief: 'Before the new control panel is wired in, the crew has to list every way its switches can be set.',
  lesson: 'A truth table has one row for each case of its letters: 2 rows for one letter, and twice as many for each letter added.',
  prompt: 'A control panel has 3 switches, p, q and r. Each switch is a statement that is true or false. Enter how many rows a truth table for these 3 letters needs. Then enter the row number of the case p false, q true, r true, in the standard order: the first letter is true on the top half of the rows, each next letter switches twice as often, and the last letter switches on every row.',
  answer: [8, 5],
  labels: ['rows in the table', 'row number of the case'],
  tolerance: 0.01,
  hints: ['One letter alone needs 2 rows, and each new letter doubles the number of rows.', 'p is true on the top half of the rows. Each letter that is false in the case moves it down by the number of rows that letter’s block fills.'],
  solution: 'With 3 letters the table has 2 × 2 × 2 = 8 rows. In the standard order the blocks are 4 rows for p, 2 rows for q, 1 row for r. The case is false for p, so it sits 4 rows below row 1: row 5.',
  xp: 100,
  prereqs: ['q04', 'q06'],
  artifact: { name: 'Blank switch table', description: 'Every setting of the panel switches, in the standard order.' },
  sources: [source.cm23],
  teaching: {
   intuition: 'A truth table lists every possible case of some statements, one case per row, so that nothing is missed. With one letter p there are 2 rows: p true and p false. Add a second letter q and each of those rows splits in two, once with q true and once with q false: 4 rows. Every new letter doubles the count again, so 3 letters need 8 rows, 4 letters need 16 and 5 letters need 32. The rows are written in a standard order so that everyone’s tables match. The first letter is true (T) on the top half of the rows and false (F) on the bottom half. The next letter switches twice as often, and so on, until the last letter switches on every row: T, F, T, F.',
   steps: ['Count the letters, and double from 1 once for each letter: that is the number of rows.', 'In the standard order, the first letter’s block of T rows is half the table, the next letter’s block is half of that, and the last letter’s block is 1 row.', 'Row 1 has every letter true. Each letter that is false in a case moves the case down by that letter’s block length.', 'Add the block lengths of the false letters, then add 1 to get the row number.'],
   example: { prompt: 'A table has the letters p, q and r. Which row is the case p true, q false, r true?', steps: ['Three letters need 2 × 2 × 2 = 8 rows. The blocks are 4 rows for p, 2 for q and 1 for r.', 'Only q is false, so the case is 2 rows below row 1.', '2 + 1 = 3.'], answer: 'Row 3, the case T, F, T.' },
   pitfalls: ['Adding 2 for each letter instead of doubling: 4 letters need 16 rows, not 8.', 'Starting the order with false. In the standard order the top row has every letter true.', 'Giving the first letter the shortest block. The first letter changes least often; the last letter changes on every row.']
  },
  guidance: [
   { prompt: 'How many rows does a truth table for 3 letters have?', answer: [8], labels: ['rows'], explanation: 'Each letter doubles the count: 2 × 2 × 2 = 8.' },
   { prompt: 'p is true on the top half of the rows. How many rows is that? And how many rows long is the block of the last letter, r?', answer: [4, 1], labels: ['rows in the top half', 'block of the last letter'], explanation: 'The top half is 4 rows; the last letter changes every row, so its block is 1 row long.' },
   { prompt: 'Add the block lengths of the letters that are false in the case, p, and add 1. Which row is it?', answer: [5], labels: ['row number'], explanation: 'The case sits 4 rows below row 1, so it is on row 5.' }
  ]
 },
 {
  id: 'q08',
  title: 'Wiring the warning lamp',
  topic: 'Building a truth table',
  tier: 'Basic',
  sector: 'Control Panel',
  brief: 'A warning lamp will follow a compound rule, and Mira wants its whole truth table built before the wires go in.',
  lesson: 'Build a truth table column by column: the letters first, then each part, then the whole statement.',
  prompt: 'A lamp on the control panel lights when the statement (p ∨ q) → ¬r is true. Build its truth table in the standard order, with a column for p ∨ q, a column for ¬r and a column for the whole statement. Enter how many rows make the whole statement true.',
  answer: [5],
  labels: ['rows with the statement true'],
  tolerance: 0.01,
  hints: ['Three letters need 8 rows. Fill in the column of each part first, row by row.', 'The last column joins the two part columns with →. Look up its rule for each pair of values.'],
  solution: 'Row by row (values of p, q, r: p ∨ q, ¬r, whole statement): TTT: T, F, F; TTF: T, T, T; TFT: T, F, F; TFF: T, T, T; FTT: T, F, F; FTF: T, T, T; FFT: F, F, T; FFF: F, T, T. The whole statement is true on 5 rows.',
  xp: 100,
  prereqs: ['q07'],
  artifact: { name: 'Lamp truth table', description: 'Eight rows, three letters and one lamp column, checked twice.' },
  sources: [source.cm23],
  teaching: {
   intuition: 'A compound statement can join several letters with ¬, ∧, ∨, → and ↔; these symbols are called connectives. To find when it is true, build its truth table one column at a time. Start with a column for each letter, in the standard order. Then add a column for each part in brackets, working inside out, just as you work out brackets first in arithmetic. Each new column uses only columns you already have and the rule for one connective. A ¬ in front of a letter flips that letter’s column; a ¬ in front of a bracket flips the bracket’s column. The last column is the whole statement, and counting its T entries tells you in how many cases it is true.',
   steps: ['Write the columns for p, q and r in the standard order: 8 rows.', 'Add a column for each part in brackets, and for each ¬, by flipping the column it applies to.', 'Use the rules: ∧ is T only for T and T; ∨ is F only for F and F; → is F only when the left side is T and the right side is F; ↔ is T when the two sides match.', 'Join the last two columns with the main connective (the one that joins the two biggest parts) to get the whole statement, and count its T rows.'],
   example: { prompt: 'How many of the 8 rows make (p ∧ ¬q) ∨ r true?', steps: ['The column for ¬q flips q: F, F, T, T, F, F, T, T.', 'p ∧ ¬q is true only where p is true and q is false: rows 3 and 4.', 'Joining with ∨ r: r is true on rows 1, 3, 5 and 7, so the whole statement is true on rows 1, 3, 4, 5 and 7.'], answer: '5 rows.' },
   pitfalls: ['Working out the main connective before the parts in brackets.', 'Using the wrong rule for →: it is false only when the left side is true and the right side is false.', 'Flipping the wrong column for a ¬: ¬r flips r alone, while ¬(p ∨ q) flips the whole bracket.']
  },
  guidance: [
   { prompt: 'How many rows does the table for p, q and r need?', answer: [8], labels: ['rows'], explanation: 'Three letters: 2 × 2 × 2 = 8 rows.' },
   { prompt: 'On how many rows is p ∨ q true? On how many is ¬r true?', answer: [6, 4], labels: ['rows with the left part true', 'rows with the right part true'], explanation: 'p ∨ q is true on 6 rows and ¬r on 4 rows.' },
   { prompt: 'Join the two columns with →. On how many rows is (p ∨ q) → ¬r true?', answer: [5], labels: ['rows with the statement true'], explanation: 'Going down the rows gives FTFTFTTT: 5 rows with T.' }
  ]
 },
 {
  id: 'q09',
  title: 'Rules that can never fail',
  topic: 'Tautologies and contradictions',
  tier: 'Basic',
  sector: 'Control Panel',
  brief: 'Some panel rules turn out to be true whatever the switches say, and Mira wants those marked before they waste a relay.',
  lesson: 'A tautology is true on every row of its truth table; a contradiction is false on every row.',
  prompt: 'Before a rule is wired into the panel, Mira checks the statement ((p → q) ∧ p) → q. Build its truth table, with a row for each case of the letters in it. Enter how many rows make the statement true. Then enter 1 if the statement is a tautology, 0 if it is not.',
  answer: [4, 1],
  labels: ['rows with the statement true', 'tautology (1 or 0)'],
  tolerance: 0.01,
  hints: ['The statement uses two letters, so its table has 4 rows.', 'A tautology is true on every row. One false row is enough to stop it being one.'],
  solution: 'The rows (p, q) give: TT: T; TF: T; FT: T; FF: T. The statement is true on 4 of the 4 rows, so it is a tautology: enter 4 and 1.',
  xp: 100,
  prereqs: ['q08'],
  artifact: { name: 'Spare relay', description: 'Saved from a rule that could never fail, so never needed a switch.' },
  sources: [source.cm23, source.levin31],
  teaching: {
   intuition: 'Most compound statements are true in some cases and false in others. A few are true in every case, whatever truth values their letters have. Such a statement is a tautology. “The hatch is open or the hatch is not open”, p ∨ ¬p, is one: it cannot fail, so it tells you nothing about the hatch. The opposite is a contradiction, a statement that is false in every case, such as p ∧ ¬p: the hatch cannot be open and not open at once. A truth table settles which kind a statement is. Count its true rows: all of them means a tautology, none means a contradiction, and anything in between means neither.',
   steps: ['Count the letters that appear in the statement: its table has 2 rows for one letter, 4 for two and 8 for three.', 'Build the table column by column, parts in brackets first.', 'Count the rows where the whole statement is true.', 'Every row true: a tautology. No row true: a contradiction. Otherwise it is neither.'],
   example: { prompt: 'Is (p ∧ q) → p a tautology? Its table has 4 rows.', steps: ['p ∧ q is true only on row 1 (p T, q T), and there p is true too, so the conditional is true.', 'On rows 2, 3 and 4 the hypothesis p ∧ q is false, so the conditional is true there as well.', 'It is true on all 4 rows.'], answer: 'Yes: it is true on 4 of 4 rows, so it is a tautology.' },
   pitfalls: ['Stopping after a few true rows. One false row anywhere means the statement is not a tautology.', 'Calling every statement that is not a tautology a contradiction. A contradiction must be false on every row.', 'Giving a statement with one letter 4 rows. Only the letters that appear in it count.']
  },
  guidance: [
   { prompt: 'How many rows does the table for ((p → q) ∧ p) → q have?', answer: [4], labels: ['rows'], explanation: 'It uses the letters p and q, and each letter doubles the rows: 4.' },
   { prompt: 'Work out the statement on each row. On how many rows is it true?', answer: [4], labels: ['rows with the statement true'], explanation: 'Down the rows it reads TTTT: true on 4 of the 4 rows.' },
   { prompt: 'Is it true on every row? Enter 1 for a tautology, 0 if not.', answer: [1], labels: ['tautology (1 or 0)'], explanation: 'It is a tautology.' }
  ]
 },
 {
  id: 'q10',
  title: 'Two versions of the door rule',
  topic: 'Logical equivalence: rows where two statements differ',
  tier: 'Basic',
  sector: 'Control Panel',
  brief: 'Two crews wrote the same door rule in different ways, and the panel can keep only one if they really say the same thing.',
  lesson: 'Two statements are logically equivalent, written ≡, when they have the same truth value on every row of one truth table.',
  prompt: 'Two versions of a door rule are on the panel: p → q, and q → p. Build one truth table for both, with a row for each case of the letters p and q in the standard order. Enter how many rows make p → q true. Then enter on how many rows the two statements have different truth values (0 means they are logically equivalent).',
  answer: [3, 2],
  labels: ['rows with the first statement true', 'rows where the two differ'],
  tolerance: 0.01,
  hints: ['The letters are p and q, so the table has 4 rows. Work out both statements on every row.', 'Compare the two columns row by row and count the rows where one is T and the other is F.'],
  solution: 'Row by row (p, q: first statement, second statement): TT: T, T; TF: F, T; FT: T, F; FF: T, T. p → q is true on 3 rows. The columns differ on rows 2 and 3, so 2 rows differ and the statements are not equivalent.',
  xp: 100,
  prereqs: ['q08'],
  artifact: { name: 'Merged door rule', description: 'Two ways of writing one rule, shown to agree row by row.' },
  sources: [source.cm25, source.levin31],
  teaching: {
   intuition: 'Two statements can look different and still say the same thing. Statements are logically equivalent when they have the same truth value in every case: on every row of a truth table built for both, their columns match. We write this with the symbol ≡, as in p → q ≡ ¬p ∨ q. To test a pair, build one table with all the letters of both, add a column for each statement, and compare the two columns row by row. If no row differs, the statements are equivalent and either one can replace the other. One row that differs is enough to show they are not equivalent, and that row is a case where the two rules would act differently.',
   steps: ['List all the letters that appear in either statement and build one table for them.', 'Add a column for each statement, working out the parts in brackets first.', 'Compare the two columns row by row and count the rows where they differ.', 'A count of 0 means the statements are logically equivalent (≡). Any other count means they are not.'],
   example: { prompt: 'Are ¬(p ∧ q) and ¬p ∨ ¬q logically equivalent? The table has 4 rows.', steps: ['¬(p ∧ q): p ∧ q reads T, F, F, F, so its negation reads F, T, T, T.', '¬p ∨ ¬q: ¬p reads F, F, T, T and ¬q reads F, T, F, T, so the disjunction reads F, T, T, T.', 'The columns match on all 4 rows: 0 rows differ.'], answer: 'Yes: 0 rows differ, so ¬(p ∧ q) ≡ ¬p ∨ ¬q.' },
   pitfalls: ['Comparing only the numbers of true rows. Two statements can both be true on 3 rows, but on different rows.', 'Building two separate tables in different orders, so that the rows do not line up. Use one table in the standard order.', 'Assuming that a rule turned round, such as q → p for p → q, says the same thing. It differs when p and q have different truth values.']
  },
  guidance: [
   { prompt: 'On how many rows is p → q true? On how many is q → p true?', answer: [3, 3], labels: ['rows with the first statement true', 'rows with the second statement true'], explanation: 'p → q is true on 3 rows and q → p on 3 rows.' },
   { prompt: 'Compare the two columns row by row. On how many rows do they differ?', answer: [2], labels: ['rows where the two differ'], explanation: 'They differ on rows 2 and 3.' }
  ]
 }
);
})();
