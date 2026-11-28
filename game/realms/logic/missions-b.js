/* Logic and proof missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/logic/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Truth tables · Basic, 100 XP · sector 'Control Panel' · Chapter review: tables and equivalence [CM 2.3, 2.5]
     q12  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · De Morgan's laws [CM 2.6]
     q13  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · Converse, inverse and contrapositive [CM 2.5]
     q14  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · Negating a conditional: p ∧ ¬q [CM 2.6]
     q15  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · Quantifiers ∀ and ∃ over a printed domain [CM 2.1, Levin 0.2]
     q16  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · Negating a quantifier; the smallest counterexample [CM 2.1, Levin 0.2]
     q17  ch 3 Laws of logic · Intermediate, 150 XP · sector 'Regulations Office' · Chapter review: rewriting regulations [CM 2.6, Levin 0.2]
     q18  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Arguments and validity by truth table [CM 2.7]
     q19  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Modus ponens and modus tollens [CM 2.7, Levin 3.1]
     q20  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Chains of reasoning and fallacies [CM 2.7] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 2 Logic; Oscar Levin, Discrete Mathematics: An Open Introduction, 3rd edition sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Levin/ (OpenStax or Levin).
   A title reads like: Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs
   Link to the section page itself: https://discrete.openmathbooks.org/dmoi3/<page>.html */
const source = {
 cm2_1: { title: 'OpenStax Contemporary Mathematics — 2.1 Statements and Quantifiers', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-1-statements-and-quantifiers', description: 'Statements, their negations, and statements with quantifiers.', verified: '2026-11-27' },
 cm2_3: { title: 'OpenStax Contemporary Mathematics — 2.3 Constructing Truth Tables', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-3-constructing-truth-tables', description: 'Truth tables for compound statements, row by row, with the standard order of the cases.', verified: '2026-11-27' },
 cm2_5: { title: 'OpenStax Contemporary Mathematics — 2.5 Equivalent Statements', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-5-equivalent-statements', description: 'Logically equivalent statements, and the converse, inverse and contrapositive of a conditional.', verified: '2026-11-27' },
 cm2_6: { title: 'OpenStax Contemporary Mathematics — 2.6 De Morgan’s Laws', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-6-de-morgans-laws', description: 'De Morgan’s laws for negating “and” and “or” statements.', verified: '2026-11-27' },
 cm2_7: { title: 'OpenStax Contemporary Mathematics — 2.7 Logical Arguments', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-7-logical-arguments', description: 'Valid arguments checked by truth table, modus ponens, modus tollens, the chain rule and common fallacies.', verified: '2026-11-27' },
 levin0_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.2 Mathematical Statements', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-statements.html', description: 'Statements, conditionals, and the quantifiers ∀ and ∃ with their negations.', verified: '2026-11-27' },
 levin3_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.1 Propositional Logic', url: 'https://discrete.openmathbooks.org/dmoi3/sec_propositional.html', description: 'Truth tables, logical equivalence, De Morgan’s laws and deductions such as modus ponens.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'Two crews, one lamp', topic: 'Chapter review: tables and equivalence', tier: 'Basic', sector: 'Control Panel',
  brief: 'Two crews have each wired the airlock warning lamp their own way, and before one design goes in we need to know whether they ever disagree.',
  lesson: 'Build both columns over the same rows: count the true rows of each, then count the rows where they differ; 0 differences means the two are logically equivalent.',
  prompt: 'Two crews have wired the airlock lamp. Proposal A lights it when (p ∨ q) → r is true; proposal B lights it when (p → r) ∨ (q → r) is true. Build the truth table over p, q and r, with its 8 rows in the standard order. Enter the number of rows on which A is true, then the number on which B is true, then the number of rows where A and B have different truth values.',
  answer: [5, 7, 2], labels: ['true rows of A', 'true rows of B', 'rows that differ'], tolerance: 0.01,
  hints: [
   'Work out the inner brackets first, as their own columns, and only then the main connective. A statement X → Y is false only when X is true and Y is false.',
   'Write the two final columns side by side, as ones and zeros, and compare them row by row. If they never differ, the two statements are logically equivalent.'
  ],
  solution: 'In the standard order (row 1 has p, q and r all true, row 8 has all three false), A gives 1, 0, 1, 0, 1, 0, 1, 1 and B gives 1, 0, 1, 1, 1, 1, 1, 1. A is true on 5 of the 8 rows and B on 7. They differ on rows 4 and 6, so 2 rows differ and the proposals are not logically equivalent.',
  xp: 100, prereqs: ['q09', 'q10'],
  artifact: { name: 'Lamp wiring sheet', description: 'Two columns of ones and zeros, side by side, with the rows where they disagree circled.' },
  sources: [source.cm2_3, source.cm2_5],
  teaching: {
   intuition: 'This mission brings the whole chapter together. A truth table gives one row to every case of the letters: with p, q and r there are 2 × 2 × 2 = 8 rows, in the standard order where row 1 has every letter true and row 8 every letter false. To find a statement’s column, work from the inside out: brackets first, as their own columns, then the main connective. Counting the ones in a column tells you how often the statement is true. Two statements are logically equivalent when their columns match on every single row, so the rows where they differ are what decides it. Two columns can have the same number of ones and still not be equivalent, because the ones can sit on different rows.',
   steps: [
    'Write the 8 rows of p, q and r in the standard order: r switches every row, q every two rows, p every four rows.',
    'For each statement, add a column for each bracket, then the column for the whole statement.',
    'Count the ones in each final column: those are the true rows.',
    'Put the two final columns side by side and count the rows where one has 1 and the other 0. If that count is 0, the statements are logically equivalent.'
   ],
   example: {
    prompt: 'Compare A: p → q and B: ¬q → ¬p over the 4 rows of p and q.',
    steps: [
     'Rows in the standard order: (p 1, q 1), (1, 0), (0, 1), (0, 0).',
     'A, p → q, is false only on row 2, so its column is 1, 0, 1, 1: 3 true rows.',
     'B, ¬q → ¬p, has a true hypothesis ¬q and a false conclusion ¬p only on row 2 as well, so its column is also 1, 0, 1, 1: 3 true rows.',
     'The columns match on all 4 rows: 0 rows differ.'
    ],
    answer: '3 true rows each, 0 rows differ: the two are logically equivalent.'
   },
   pitfalls: [
    'Deciding equivalence from the true-row counts alone. Two columns with five ones each can still put them on different rows.',
    'Mixing up the order of the rows between the two tables. Use the standard order for both, or the comparison means nothing.',
    'Reading p → q as false whenever p is false. A conditional with a false hypothesis is true.'
   ]
  },
  guidance: [
   { prompt: 'Build the column for A, (p ∨ q) → r, over the 8 rows. On how many rows is it true?', answer: [5], labels: ['true rows of A'], explanation: 'Row by row, A is 1, 0, 1, 0, 1, 0, 1, 1: 5 ones.' },
   { prompt: 'Now the column for B, (p → r) ∨ (q → r). On how many rows is it true?', answer: [7], labels: ['true rows of B'], explanation: 'Row by row, B is 1, 0, 1, 1, 1, 1, 1, 1: 7 ones.' },
   { prompt: 'Compare the columns A: 1, 0, 1, 0, 1, 0, 1, 1 and B: 1, 0, 1, 1, 1, 1, 1, 1. On how many rows do they differ?', answer: [2], labels: ['rows that differ'], explanation: 'They differ on rows 4 and 6. Equal true-row counts would not be enough: the true rows must be the same rows.' }
  ]
 },
 {
  id: 'q12', title: 'Regulation 7, rewritten', topic: 'De Morgan’s laws', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'Regulation 7 is written as one long “not”, and the office wants it rewritten in a form the crate clerks can check one condition at a time.',
  lesson: 'De Morgan’s laws: ¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q. The ¬ moves inside and the connective flips.',
  prompt: 'Regulation 7 is about crate numbers n from 1 to 30. Let p be “n is greater than 12” and q be “n is a multiple of 4”. The regulation allows exactly the crates for which ¬(p ∧ q) is true. Which rewrite says the same thing? 1: ¬p ∧ ¬q; 2: ¬p ∨ ¬q; 3: p ∨ ¬q. Enter its number, then how many crate numbers from 1 to 30 the regulation allows.',
  answer: [2, 26], labels: ['number of the rewrite', 'crate numbers allowed'], tolerance: 0.01,
  hints: [
   'De Morgan’s laws: the negation of an “and” is the “or” of the negations, and the negation of an “or” is the “and” of the negations. The ¬ moves inside and the connective flips.',
   'Count the crates that make p ∧ q true (greater than 12 and a multiple of 4), then take them away from all 30.'
  ],
  solution: 'By De Morgan’s laws, ¬(p ∧ q) says the same as ¬p ∨ ¬q: n is at most 12, or n is not a multiple of 4. That is rewrite 2. The crates it rules out are those that make p ∧ q true, the multiples of 4 above 12: 16, 20, 24, 28, which is 4 numbers. So 30 − 4 = 26 crate numbers are allowed.',
  xp: 150, prereqs: ['q10'],
  artifact: { name: 'Rewritten Regulation 7', description: 'The same rule, now in two short parts a clerk can check one at a time.' },
  sources: [source.cm2_6],
  teaching: {
   intuition: 'When you put “not” in front of a whole “and” or “or” statement, you cannot just put “not” in front of each part and keep the connective. Saying “it is not true that the crate is both heavy and fragile” does not mean the crate is light and sturdy; it only means at least one of the two fails, so the crate is light, or sturdy, or both. That is the first of De Morgan’s laws: ¬(p ∧ q) is logically equivalent to ¬p ∨ ¬q. The second goes the other way: “it is not true that the crate is heavy or fragile” means it is neither, so ¬(p ∨ q) is logically equivalent to ¬p ∧ ¬q. In both, the ¬ moves inside onto each letter and the connective flips, ∧ to ∨ or ∨ to ∧. The symbol ≡ means “is logically equivalent to”. A truth table of four rows checks each law, and they are useful for counting too: to count the cases where “not both” holds, count the cases where both hold and take them away from the total.',
   steps: [
    'Find the connective inside the brackets that the ¬ applies to.',
    'Move the ¬ onto each part and flip the connective: ∧ becomes ∨, and ∨ becomes ∧.',
    'Say the result in words, one condition per part, and check it against a case or two.',
    'To count, use whichever form is easier, or count the opposite and subtract from the total.'
   ],
   example: {
    prompt: 'For n from 1 to 20, let p be “n is greater than 15” and q be “n is a multiple of 2”. How many n make ¬(p ∨ q) true?',
    steps: [
     'By De Morgan’s laws, ¬(p ∨ q) ≡ ¬p ∧ ¬q: n is at most 15 and n is not a multiple of 2.',
     'From 1 to 15 there are 15 numbers; the multiples of 2 among them are 2, 4, 6, 8, 10, 12, 14, which is 7.',
     'So 15 − 7 = 8 numbers make it true: 1, 3, 5, 7, 9, 11, 13, 15.'
    ],
    answer: '8 numbers.'
   },
   pitfalls: [
    'Moving the ¬ inside but keeping the connective: ¬(p ∧ q) is not ¬p ∧ ¬q. “Not both” is weaker than “neither”.',
    'Forgetting that ¬(n is greater than 12) means “n is at most 12”, which includes 12 itself.',
    'Counting the numbers that break the regulation and entering that count instead of the numbers it allows.'
   ]
  },
  guidance: [
   { prompt: 'Move the ¬ inside ¬(p ∧ q): each letter gets its own ¬ and the connective flips. Which of the listed rewrites is that? 1: ¬p ∧ ¬q; 2: ¬p ∨ ¬q; 3: p ∨ ¬q.', answer: [2], labels: ['number of the rewrite'], explanation: '¬(p ∧ q) ≡ ¬p ∨ ¬q, which is rewrite 2. “Not both” means at least one of the two fails.' },
   { prompt: 'How many crate numbers from 1 to 30 make p ∧ q true, that is, are greater than 12 and a multiple of 4?', answer: [4], labels: ['numbers making p ∧ q true'], explanation: 'They are 16, 20, 24, 28: 4 numbers. Every other crate number makes ¬p ∨ ¬q true.' },
   { prompt: 'Take those 4 away from all 30 crate numbers. How many are allowed?', answer: [26], labels: ['crate numbers allowed'], explanation: '30 − 4 = 26.' }
  ]
 },
 {
  id: 'q13', title: 'Four versions of the door rule', topic: 'Converse, inverse and contrapositive', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'Someone has posted three reworded copies of the door rule beside the original, and only one of them can safely replace it.',
  lesson: 'From p → q: the converse is q → p, the inverse is ¬p → ¬q and the contrapositive is ¬q → ¬p. Only the contrapositive is logically equivalent to the rule.',
  prompt: 'The door rule says: “If n > 9, then n > 6”, about every whole number n = 1, 2, 3 and so on. A rule like this is true (1) when no whole number breaks it, and false (0) when at least one does. Statement 1: If n ≤ 9, then n ≤ 6. Statement 2: If n ≤ 6, then n ≤ 9. Statement 3: If n > 6, then n > 9. Enter 1 or 0 for statements 1, 2 and 3, in that order, then the number of the statement that is the contrapositive of the rule.',
  answer: [0, 1, 0, 2], labels: ['statement 1 (1 or 0)', 'statement 2 (1 or 0)', 'statement 3 (1 or 0)', 'number of the contrapositive'], tolerance: 0.01,
  hints: [
   'The converse swaps the two parts. The inverse puts ¬ on both parts and keeps the order. The contrapositive does both: it swaps the parts and negates them.',
   'To show a statement is false, find one whole number that makes its “if” part true and its “then” part false.'
  ],
  solution: 'The rule is true. Statement 1 is the inverse, and it is false (0): n = 9 breaks it. Statement 2 is the contrapositive, and it is true (1): it always has the same truth value as the rule, which is true. Statement 3 is the converse, and it is false (0): n = 9 breaks it. The contrapositive is statement 2; it is the one that always has the same truth value as the rule.',
  xp: 150, prereqs: ['q10'],
  artifact: { name: 'Door rule notice', description: 'The original rule with its one faithful rewording pinned beneath it.' },
  sources: [source.cm2_5],
  teaching: {
   intuition: 'A conditional p → q can be reworded in three standard ways. The converse swaps the parts: q → p. The inverse negates both parts and keeps the order: ¬p → ¬q. The contrapositive does both, swapping and negating: ¬q → ¬p. They sound alike, but they do not all mean the same thing. “If a crate is a multiple of 6, it is a multiple of 3” is true, yet its converse “if a crate is a multiple of 3, it is a multiple of 6” is false: 9 breaks it. A truth table shows that the contrapositive always has the same column as the rule, so the two are logically equivalent. The converse and the inverse are equivalent to each other (each is the contrapositive of the other), but not to the rule. A rule about every whole number n is true when no n breaks it; to show it is false you need just one n that makes its “if” part true and its “then” part false.',
   steps: [
    'Name the parts: p is the “if” part (the hypothesis) and q is the “then” part (the conclusion).',
    'Write the converse q → p, the inverse ¬p → ¬q and the contrapositive ¬q → ¬p.',
    'Decide the rule first. The contrapositive has the same truth value as the rule.',
    'Decide the converse by looking for one n that makes q true and p false. The inverse has the same truth value as the converse.'
   ],
   example: {
    prompt: 'The rule: “If n is a multiple of 10, then n is a multiple of 5.” Decide its converse, inverse and contrapositive.',
    steps: [
     'The rule is true: every multiple of 10 is a multiple of 5.',
     'The converse, “if n is a multiple of 5, then n is a multiple of 10”, is false: n = 15 breaks it. The inverse, “if n is not a multiple of 10, then n is not a multiple of 5”, is false too: n = 15 again.',
     'The contrapositive, “if n is not a multiple of 5, then n is not a multiple of 10”, is true, like the rule.'
    ],
    answer: 'Converse 0, inverse 0, contrapositive 1.'
   },
   pitfalls: [
    'Treating the converse as the same rule. A rule and its converse can have different truth values.',
    'Confusing the inverse with the contrapositive: the contrapositive also swaps the order of the parts.',
    'Forgetting that the negation of “n > 9” is “n ≤ 9”, which includes 9.'
   ]
  },
  guidance: [
   { prompt: 'Is the rule “If n > 9, then n > 6” itself true (1) or false (0)?', answer: [1], labels: ['rule (1 or 0)'], explanation: 'Any n above 9 is above 6 too, because 9 > 6.' },
   { prompt: 'The contrapositive swaps the parts and negates both: “If n ≤ 6, then n ≤ 9.” Which statement number is it?', answer: [2], labels: ['number of the contrapositive'], explanation: 'It is statement 2. It is logically equivalent to the rule, so it is true as well.' },
   { prompt: 'The converse and the inverse are contrapositives of each other, so they share one truth value. Is the converse “If n > 6, then n > 9” true (1) or false (0)?', answer: [0], labels: ['converse (1 or 0)'], explanation: 'No: n = 9 breaks it, so the inverse is false too.' }
  ]
 },
 {
  id: 'q14', title: 'Who broke the airlock rule?', topic: 'Negating a conditional: p ∧ ¬q', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'The airlock log has a week of cycles in it, and the safety officer wants to know exactly which ones broke the locking rule.',
  lesson: 'The negation of p → q is p ∧ ¬q: the hypothesis happens and the conclusion does not. That is the only way to break a conditional.',
  prompt: 'Airlock rule: “If the pressure reading is below 100, then the inner door is locked.” Let p be “the reading is below 100” and q be “the inner door is locked”. Log: cycle 1, reading 96, door locked; cycle 2, reading 104, door open; cycle 3, reading 93, door open; cycle 4, reading 110, door locked; cycle 5, reading 88, door locked; cycle 6, reading 99, door open; cycle 7, reading 107, door open; cycle 8, reading 91, door locked. Which statement is the negation of the rule, true exactly when the rule is broken? 1: ¬p → ¬q; 2: p → ¬q; 3: ¬p ∧ q; 4: p ∧ ¬q. Enter its number, then how many logged cycles broke the rule.',
  answer: [4, 2], labels: ['number of the negation', 'cycles that broke the rule'], tolerance: 0.01,
  hints: [
   'A conditional p → q is false in one case only: p true and q false. Its negation must be true in exactly that case.',
   'Pick out the cycles with a reading below 100 first. A cycle with a higher reading cannot break the rule, whatever the door did.'
  ],
  solution: 'The rule p → q is false only when p is true and q is false, so its negation is p ∧ ¬q: the reading is below 100 and the door is not locked. That is statement 4. The readings below 100 are in cycles 1, 3, 5, 6 and 8; of those, the door was open in cycles 3 and 6. So 2 cycles broke the rule.',
  xp: 150, prereqs: ['q12', 'q13'],
  artifact: { name: 'Marked airlock log', description: 'The cycle log with the rule-breakers picked out in red.' },
  sources: [source.cm2_6],
  teaching: {
   intuition: 'A conditional p → q is false in exactly one case: p is true and q is false. So the statement that is true exactly when the rule is broken, its negation, is p ∧ ¬q: “p happened, and q did not”. It is an “and”, not another “if … then”. A truth table confirms it, and De Morgan’s laws give the same answer: p → q is logically equivalent to ¬p ∨ q, and ¬(¬p ∨ q) ≡ p ∧ ¬q. This is what a safety check really looks for. A case where the hypothesis is false never breaks the rule, whatever happens to the conclusion, because the rule says nothing about that case. So to find the rule-breakers, first keep only the cases where the hypothesis is true, then pick out those where the conclusion fails.',
   steps: [
    'Name p, the “if” part, and q, the “then” part.',
    'Write the negation: p ∧ ¬q.',
    'Go through the log and keep only the entries where p is true.',
    'Among those, count the entries where q is false. Each one makes p ∧ ¬q true: it broke the rule.'
   ],
   example: {
    prompt: 'Rule: “If a rover returns after dark, then its lamp is on.” Log: rover A after dark, lamp on; rover B after dark, lamp off; rover C before dark, lamp off. How many broke the rule?',
    steps: [
     'The negation is “after dark and lamp off”.',
     'Rovers A and B returned after dark; rover C did not, so it cannot break the rule.',
     'Of A and B, only B had its lamp off.'
    ],
    answer: '1 rover broke the rule: rover B.'
   },
   pitfalls: [
    'Writing the negation as another conditional, such as p → ¬q or ¬p → ¬q.',
    'Counting entries where the hypothesis is false but the conclusion also fails. Those do not break the rule.',
    'Treating a reading equal to the threshold as “below” it.'
   ]
  },
  guidance: [
   { prompt: 'The negation of “if p, then q” is true exactly when p is true and q is false. Which listed statement says that? 1: ¬p → ¬q; 2: p → ¬q; 3: ¬p ∧ q; 4: p ∧ ¬q.', answer: [4], labels: ['number of the negation'], explanation: 'p ∧ ¬q is statement 4. Note that it is an “and”, not another “if … then”.' },
   { prompt: 'How many logged cycles have a reading below 100, so that p is true?', answer: [5], labels: ['cycles with p true'], explanation: 'Cycles 1, 3, 5, 6 and 8: 5 in all.' },
   { prompt: 'Of those, in how many was the door open, so that ¬q is true as well?', answer: [2], labels: ['cycles that broke the rule'], explanation: 'Cycles 3 and 6. Those are the rule-breakers.' }
  ]
 },
 {
  id: 'q15', title: 'Every shelf, or just one?', topic: 'Quantifiers ∀ and ∃ over a printed domain', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'The stores computer checks claims about whole lists of shelves at once, and we have to tell a claim about every shelf from a claim about just one.',
  lesson: '∀x means “for every x in the domain” and needs every member to pass; ∃x means “there is an x in the domain” and needs one witness.',
  prompt: 'The stores computer checks the shelf numbers in its domain, the list 4, 7, 9, 12, 15, 18, 22. Claim A: ∀x (x > 3). Claim B: ∃x (x² < 100). Enter 1 or 0 for claim A, then 1 or 0 for claim B, then the number of witnesses for claim B (0 if there are none).',
  answer: [1, 1, 3], labels: ['claim A (1 or 0)', 'claim B (1 or 0)', 'witnesses for B'], tolerance: 0.01,
  hints: [
   '∀ asks every number in the domain to pass; a single failure makes claim A false. ∃ needs just one number to pass.',
   'Test claim B on each of the 7 numbers in turn and count the ones that make it true; each of those is a witness.'
  ],
  solution: 'Claim A is true (1): every number in the list passes, including the smallest, 4. Claim B is true (1): its witnesses are 4, 7, 9, which is 3 witnesses.',
  xp: 150, prereqs: ['q04'],
  artifact: { name: 'Shelf audit card', description: 'A list of shelf numbers with one claim checked for all of them and one checked for any of them.' },
  sources: [source.cm2_1, source.levin0_2],
  teaching: {
   intuition: 'A sentence like “x > 3” is not a statement on its own, because it is true for some numbers and false for others. It becomes a statement when we say which numbers we mean and how many of them must pass. The list of numbers we mean is the domain. A quantifier says how many: ∀, read “for every”, claims that every member of the domain passes, and ∃, read “there is” or “there exists”, claims that at least one member passes. So ∀x (x > 3) over the domain 4, 7, 9 is true, because all three pass, while ∃x (x > 8) is true because 9 passes. A member that makes a “there is” claim true is a witness: one witness is enough. A “for every” claim is the opposite: one failure is enough to make it false. Over a short printed domain you can settle both kinds by checking every member.',
   steps: [
    'Read the domain: the list of numbers x can be.',
    'For a ∀ claim, test every member. If even one fails, the claim is false (0); if all pass, it is true (1).',
    'For an ∃ claim, test every member and note each one that passes: those are the witnesses.',
    'The ∃ claim is true (1) if there is at least one witness, and false (0) if there are none.'
   ],
   example: {
    prompt: 'Domain: 2, 5, 6, 11. Decide ∀x (x < 10) and ∃x (x is a multiple of 3), and count the witnesses of the second.',
    steps: [
     '∀x (x < 10): 11 is not below 10, so the claim is false.',
     '∃x (x is a multiple of 3): only 6 passes, so there is 1 witness and the claim is true.'
    ],
    answer: 'The ∀ claim is 0; the ∃ claim is 1, with 1 witness.'
   },
   pitfalls: [
    'Calling a ∀ claim true because most members pass. It needs every one.',
    'Calling an ∃ claim false because most members fail. One witness is enough.',
    'Testing numbers that are not in the domain. Only the listed numbers count.'
   ]
  },
  guidance: [
   { prompt: 'Check x > 3 for each number in 4, 7, 9, 12, 15, 18, 22. Does every one pass? Enter 1 for yes, 0 for no.', answer: [1], labels: ['claim A (1 or 0)'], explanation: 'Every one passes, so ∀x holds.' },
   { prompt: 'Now check x² < 100 for each number. How many make it true?', answer: [3], labels: ['witnesses for B'], explanation: '4, 7, 9: 3 in all.' },
   { prompt: 'Claim B is ∃x (x² < 100). With that many witnesses, is it true (1) or false (0)?', answer: [1], labels: ['claim B (1 or 0)'], explanation: 'One witness is enough, so it is true.' }
  ]
 },
 {
  id: 'q16', title: 'The rule that held until it didn’t', topic: 'Negating a quantifier; the smallest counterexample', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'A regulation was checked for the first few numbers and passed every time, so it was written down for all of them; we have to check whether it really holds.',
  lesson: 'P(n) stands for a claim about a number n, such as “n² < 3n + 10”. The negation of ∀n P(n) is ∃n ¬P(n). One counterexample, an n that makes the claim false, is enough to show a “for every” claim is false.',
  prompt: 'A regulation claims: for every whole number n from 1 to 10, n² < 3n + 10. Write its negation, then test it. Enter the smallest n in the domain that is a counterexample to the claim, then how many numbers from 1 to 10 are counterexamples.',
  answer: [5, 6], labels: ['smallest counterexample', 'counterexamples in the domain'], tolerance: 0.01,
  hints: [
   'The negation of “for every n, the claim holds” is “there is an n for which the claim fails”. A counterexample is such an n.',
   'Try n = 1, 2, 3 and so on, in order. The first n that fails is the smallest counterexample; then check the rest of the domain up to 10 as well.'
  ],
  solution: 'The negation is: there is an n from 1 to 10 for which n² < 3n + 10 is false. Testing in order: n = 1 gives 1 < 13, true; n = 2 gives 4 < 16, true; n = 3 gives 9 < 19, true; n = 4 gives 16 < 22, true; n = 5 gives 25 < 25, false. So the smallest counterexample is n = 5. Checking every n up to 10, the counterexamples are 5, 6, 7, 8, 9, 10: 6 of them. One is already enough to show the claim is false.',
  xp: 150, prereqs: ['q15', 'q12'],
  artifact: { name: 'Counterexample tag', description: 'A small tag marked with the first number that broke the regulation.' },
  sources: [source.cm2_1, source.levin0_2],
  teaching: {
   intuition: 'To deny “every crate is sealed” you do not have to show that no crate is sealed; you only have to find one crate that is not. That is how negation works with quantifiers: the negation of “for every n, P(n)” is “there is an n for which P(n) is false”, written ¬∀n P(n) ≡ ∃n ¬P(n). Like De Morgan’s laws, the ¬ moves inside and the quantifier flips, ∀ to ∃. In the same way, the negation of “there is an n with P(n)” is “for every n, P(n) is false”. A number that makes a “for every” claim false is called a counterexample, and a single counterexample settles the matter. This matters because a claim can pass test after test and still be false: n² < 3n + 10 holds for n = 1, 2, 3 and 4 and fails at n = 5. Checking a few cases is never a proof that a claim holds for all of them. To find the smallest counterexample, test n = 1, 2, 3 and so on in order, and stop at the first failure.',
   steps: [
    'Write the negation: “there is an n in the domain for which the claim is false”.',
    'Test n = 1, 2, 3 and so on in order, working out both sides each time.',
    'The first n that makes the claim false is the smallest counterexample; the negation is true and the claim is false.',
    'To count all the counterexamples, carry on testing up to the end of the domain.'
   ],
   example: {
    prompt: 'Claim: for every whole number n from 1 to 8, 2ⁿ < 4n + 4. Find the smallest counterexample.',
    steps: [
     'n = 1: 2 < 8. n = 2: 4 < 12. n = 3: 8 < 16. n = 4: 16 < 20. All true.',
     'n = 5: 32 < 24 is false, so the claim fails at n = 5.'
    ],
    answer: 'The smallest counterexample is n = 5.'
   },
   pitfalls: [
    'Deciding the claim is true because it held for the first few numbers you tried.',
    'Writing the negation as “for every n, the claim is false”. One failure is enough; the negation is a “there is” claim.',
    'Treating equality as passing a strict inequality: 25 < 25 is false.'
   ]
  },
  guidance: [
   { prompt: 'Test n = 1, 2, 3 and so on in n² < 3n + 10. What is the first n for which it is false?', answer: [5], labels: ['smallest counterexample'], explanation: 'n = 1 gives 1 < 13, true; n = 2 gives 4 < 16, true; n = 3 gives 9 < 19, true; n = 4 gives 16 < 22, true; n = 5 gives 25 < 25, false. So n = 5 is the smallest counterexample.' },
   { prompt: 'Check every n up to 10. How many make n² < 3n + 10 false?', answer: [6], labels: ['counterexamples in the domain'], explanation: 'The counterexamples are 5, 6, 7, 8, 9, 10: 6 in all.' }
  ]
 },
 {
  id: 'q17', title: 'The regulation audit', topic: 'Chapter review: rewriting regulations', tier: 'Intermediate', sector: 'Regulations Office',
  brief: 'The office is closing its audit, and two last regulations need checking: one against the hold log, one against every number it claims to cover.',
  lesson: 'A rule (p ∧ q) → r is broken exactly when p ∧ q ∧ ¬r is true, and a “for every n” claim is false as soon as one counterexample turns up.',
  prompt: 'Two regulations need checking. First: “If a crate weighs more than 30 kg and is marked fragile, then it is strapped down.” Hold log: crate 1, 34 kg, fragile, strapped; crate 2, 41 kg, fragile, loose; crate 3, 22 kg, fragile, loose; crate 4, 38 kg, not fragile, loose; crate 5, 45 kg, fragile, loose; crate 6, 27 kg, not fragile, strapped; crate 7, 52 kg, not fragile, loose; crate 8, 31 kg, fragile, strapped. Second: “For every whole number n from 1 to 12, 1 + 2 + … + n < 40.” Here 1 + 2 + … + n means every whole number from 1 up to n, added together. Enter how many crates break the first regulation, then the smallest counterexample to the second.',
  answer: [2, 9], labels: ['crates that break the first regulation', 'smallest counterexample to the second'], tolerance: 0.01,
  hints: [
   'The first regulation has the form (p ∧ q) → r. Its negation is (p ∧ q) ∧ ¬r: heavy, fragile and loose, all three at once.',
   'For the second, try n = 1, 2, 3 and so on in order, and stop at the first n that makes the claim false.'
  ],
  solution: 'The first regulation is broken exactly when p ∧ q ∧ ¬r is true: a crate over 30 kg, marked fragile, and loose. Over 30 kg and fragile: crates 1, 2, 5 and 8; of those, loose: crates 2 and 5. So 2 crates break it. For the second, the negation is “there is an n with 1 + 2 + … + n < 40 false”. Testing in order: n = 1 gives 1 < 40, true; n = 2 gives 1 + 2 = 3 < 40, true; n = 3 gives 1 + 2 + 3 = 6 < 40, true; n = 4 gives 1 + 2 + 3 + 4 = 10 < 40, true; n = 5 gives 1 + 2 + … + 5 = 15 < 40, true; n = 6 gives 1 + 2 + … + 6 = 21 < 40, true; n = 7 gives 1 + 2 + … + 7 = 28 < 40, true; n = 8 gives 1 + 2 + … + 8 = 36 < 40, true; n = 9 gives 1 + 2 + … + 9 = 45 < 40, false. The smallest counterexample is n = 9.',
  xp: 150, prereqs: ['q14', 'q16'],
  artifact: { name: 'Audit stamp', description: 'The office stamp, inked over two regulations that did not survive the check.' },
  sources: [source.cm2_6, source.levin0_2],
  teaching: {
   intuition: 'This review uses the two kinds of negation from the chapter. The first regulation is a conditional whose “if” part is itself an “and”: (p ∧ q) → r. Like every conditional, it is broken only when its hypothesis is true and its conclusion false, so its negation is (p ∧ q) ∧ ¬r, which says all three things at once: p, q and not r. A crate that is light, or not fragile, cannot break it. The second regulation is a “for every n” claim, and its negation is a “there is” claim: there is an n for which it fails. Testing n = 1, 2, 3 and so on in order finds the smallest counterexample, the first n that breaks it.',
   steps: [
    'For the conditional, write the negation: the hypothesis is true and the conclusion false.',
    'Keep only the log entries where every part of the hypothesis holds, then count those where the conclusion fails.',
    'For the “for every” claim, write the negation: there is an n for which the claim is false.',
    'Test n = 1, 2, 3 and so on in order; the first failure is the smallest counterexample.'
   ],
   example: {
    prompt: 'Rule: “If a rover is outside and its battery is low, then it is heading home.” Log: rover A outside, low, heading home; rover B outside, low, not heading home; rover C inside, low, not heading home. Claim: for every n from 1 to 6, n² < 2n + 5. Find the rule-breakers and the smallest counterexample.',
    steps: [
     'Outside and low: rovers A and B. Of those, not heading home: rover B. So 1 rover breaks the rule.',
     'n = 1: 1 < 7. n = 2: 4 < 9. n = 3: 9 < 11. n = 4: 16 < 13 is false.'
    ],
    answer: '1 rule-breaker; the smallest counterexample is n = 4.'
   },
   pitfalls: [
    'Counting a crate that fails only one part of the hypothesis. The rule only covers crates where both parts hold.',
    'Negating (p ∧ q) → r as ¬p ∧ ¬q ∧ ¬r. Only the conclusion is negated; the hypothesis must still be true.',
    'Stopping before the first failure because the early values were far apart.'
   ]
  },
  guidance: [
   { prompt: 'Which crates are over 30 kg and marked fragile, so that the “if” part is true? Enter how many there are.', answer: [4], labels: ['crates heavy and fragile'], explanation: 'Crates 1, 2, 5 and 8. Only these can break the regulation.' },
   { prompt: 'Of those, how many are loose, so that the regulation is broken?', answer: [2], labels: ['crates that break it'], explanation: 'Crates 2 and 5: heavy, fragile and loose.' },
   { prompt: 'Test n = 1, 2, 3 and so on in 1 + 2 + … + n < 40. What is the first n for which it is false?', answer: [9], labels: ['smallest counterexample'], explanation: 'n = 1 gives 1 < 40, true; n = 2 gives 1 + 2 = 3 < 40, true; n = 3 gives 1 + 2 + 3 = 6 < 40, true; n = 4 gives 1 + 2 + 3 + 4 = 10 < 40, true; n = 5 gives 1 + 2 + … + 5 = 15 < 40, true; n = 6 gives 1 + 2 + … + 6 = 21 < 40, true; n = 7 gives 1 + 2 + … + 7 = 28 < 40, true; n = 8 gives 1 + 2 + … + 8 = 36 < 40, true; n = 9 gives 1 + 2 + … + 9 = 45 < 40, false.' }
  ]
 },
 {
  id: 'q18', title: 'The council tests an argument', topic: 'Arguments and validity by truth table', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'A speaker has made a confident case to the council, and before anyone votes we have to know whether the conclusion really follows.',
  lesson: 'An argument is valid when no row of its truth table has every premise true and the conclusion false.',
  prompt: 'In the council chamber a speaker argues: premise 1, p ∨ q; premise 2, p → r; so, conclusion: r. Build the truth table over p, q and r (8 rows). Enter the number of rows on which every premise is true, then the number of those rows on which the conclusion is false, then 1 if the argument is valid or 0 if it is not.',
  answer: [4, 1, 0], labels: ['rows with every premise true', 'of those, rows with a false conclusion', 'valid (1) or not (0)'], tolerance: 0.01,
  hints: [
   'Only the rows where every premise is true matter. Cross out every row where some premise is false.',
   'On the rows that are left, look at the conclusion. One row with the conclusion false is enough to make the argument invalid.'
  ],
  solution: 'Every premise is true on 4 of the 8 rows: row 1 (p 1, q 1, r 1), row 3 (p 1, q 0, r 1), row 5 (p 0, q 1, r 1), row 6 (p 0, q 1, r 0). The conclusion r is false on row 6, so 1 row has true premises and a false conclusion. The argument is not valid (0).',
  xp: 150, prereqs: ['q08'],
  artifact: { name: 'Council truth table', description: 'An argument’s table, with the rows that matter shaded and the one that sinks it marked.' },
  sources: [source.cm2_7],
  teaching: {
   intuition: 'An argument is a list of statements called premises, followed by one more statement, the conclusion, that is claimed to follow from them. The argument is valid when the conclusion is forced: in every case where all the premises are true, the conclusion is true as well. Validity is about the form of the reasoning, not about whether the premises are actually true. A truth table tests it. Build one row for every case of the letters, find the rows where every premise is true, and look at the conclusion on those rows only. If even one of them has a false conclusion, the premises can all hold while the conclusion fails, so the argument is not valid. If there is no such row, the argument is valid. Rows where some premise is false do not matter at all.',
   steps: [
    'List the letters the argument uses and write their rows in the standard order: 4 rows for two letters, 8 for three.',
    'Work out a column for each premise and one for the conclusion.',
    'Mark the rows where every premise is true.',
    'Among the marked rows, count those where the conclusion is false. If the count is 0 the argument is valid (1); otherwise it is not (0).'
   ],
   example: {
    prompt: 'Premises: p → q and ¬p. Conclusion: ¬q. Is the argument valid?',
    steps: [
     'Over p and q there are 4 rows. ¬p is true on rows 3 and 4, (p 0, q 1) and (p 0, q 0), and p → q is true on both.',
     'On row 3 the conclusion ¬q is false, because q is true there.'
    ],
    answer: '2 rows with every premise true, 1 of them with a false conclusion: not valid (0).'
   },
   pitfalls: [
    'Looking at rows where a premise is false. Only the rows with every premise true decide validity.',
    'Calling an argument valid because the conclusion is true on some marked row. It must be true on all of them.',
    'Judging by whether the conclusion sounds true. A valid argument can have a false conclusion if a premise is false.'
   ]
  },
  guidance: [
   { prompt: 'On how many of the 8 rows are all the premises (p ∨ q and p → r) true?', answer: [4], labels: ['rows with every premise true'], explanation: 'Row 1 (p 1, q 1, r 1), row 3 (p 1, q 0, r 1), row 5 (p 0, q 1, r 1), row 6 (p 0, q 1, r 0): 4 rows.' },
   { prompt: 'On how many of those rows is the conclusion r false?', answer: [1], labels: ['rows with a false conclusion'], explanation: 'Row 6: true premises with a false conclusion.' },
   { prompt: 'Is the argument valid (1) or not (0)?', answer: [0], labels: ['valid (1) or not (0)'], explanation: 'At least one row has true premises and a false conclusion, so it is not valid.' }
  ]
 },
 {
  id: 'q19', title: 'Two cases before the council', topic: 'Modus ponens and modus tollens', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'Two incident reports have reached the council, each with a standing rule and one fact from the log, and we have to say what each one proves.',
  lesson: 'Modus ponens: from p → q and p, conclude q. Modus tollens: from p → q and ¬q, conclude ¬p.',
  prompt: 'Two cases come before the council. Case 1: the rule is “If the east pump is running, then the tank pressure rises”, and the log shows that the tank pressure does not rise. Case 2: the rule is “If the fan is off, then the hatch is sealed”, and the log shows that the fan is off. The rules of inference: 1: modus ponens; 2: modus tollens. For case 1, enter the truth value the facts force on “the east pump is running” (1 or 0), then the number of the rule of inference used; then the same two for case 2 and “the hatch is sealed”.',
  answer: [0, 2, 1, 1], labels: ['case 1 truth value', 'case 1 rule number', 'case 2 truth value', 'case 2 rule number'], tolerance: 0.01,
  hints: [
   'Modus ponens: from “if X, then Y” and X, conclude Y. Modus tollens: from “if X, then Y” and “not Y”, conclude “not X”.',
   'Check whether the fact matches the “if” part of the rule or contradicts the “then” part. Then read off the truth value of the asked sentence, which may be the opposite of the part you concluded.'
  ],
  solution: 'In case 1 the fact “the tank pressure does not rise” denies the conclusion of the rule, so modus tollens forces its hypothesis to be false: the east pump is not running. So “the east pump is running” is false (0), and the rule of inference is number 2, modus tollens. In case 2 the fact “the fan is off” is the hypothesis of the rule, so modus ponens forces its conclusion: the hatch is sealed. So “the hatch is sealed” is true (1), and the rule of inference is number 1, modus ponens.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Rules of inference card', description: 'Two short patterns of reasoning, printed on a card the council keeps on the table.' },
  sources: [source.cm2_7, source.levin3_1],
  teaching: {
   intuition: 'Some argument patterns are valid so often that they have names, and we call them rules of inference. The first is modus ponens, Latin for “the way of affirming”: from the rule “if p, then q” and the fact p, conclude q. If the pump running always makes the pressure rise, and the pump is running, then the pressure rises. The second is modus tollens, “the way of denying”: from “if p, then q” and the fact ¬q, conclude ¬p. If the pressure did not rise, the pump cannot have been running, because if it had been, the pressure would have risen. A four-row truth table shows that both are valid. Either part of the rule may itself be a negative sentence, so take care when you read off the answer. With the rule “if the fan is off, then the hatch is sealed” and the fact “the hatch is not sealed”, modus tollens concludes that the fan is not off, so “the fan is on” is true.',
   steps: [
    'Find the rule’s hypothesis (the “if” part) and its conclusion (the “then” part).',
    'If the fact states the hypothesis, use modus ponens: the conclusion is true.',
    'If the fact denies the conclusion, use modus tollens: the hypothesis is false.',
    'Read off the truth value of the sentence you are asked about; it may be the opposite of the part you concluded.'
   ],
   example: {
    prompt: 'Rule: “If the rover is docked, then its battery is charging.” Fact: the battery is not charging. What is the truth value of “the rover is docked”?',
    steps: [
     'The fact denies the rule’s conclusion, so this is modus tollens.',
     'The hypothesis must be false: the rover is not docked.'
    ],
    answer: '“The rover is docked” is false (0), by modus tollens.'
   },
   pitfalls: [
    'Using modus ponens backwards: from “if p, then q” and q, nothing follows about p.',
    'Reading off the part you concluded when the question asks about its opposite.',
    'Mixing up the names: ponens affirms the hypothesis, tollens denies the conclusion.'
   ]
  },
  guidance: [
   { prompt: 'Case 1: the rule is “If the east pump is running, then the tank pressure rises”, and the fact is “the tank pressure does not rise”. What truth value does that force on “the east pump is running”, and which rule of inference gives it? (1: modus ponens; 2: modus tollens.)', answer: [0, 2], labels: ['case 1 truth value', 'case 1 rule number'], explanation: 'The fact denies the conclusion, so the east pump is not running: “the east pump is running” is 0. That is modus tollens, rule 2.' },
   { prompt: 'Case 2: the rule is “If the fan is off, then the hatch is sealed”, and the fact is “the fan is off”. What truth value does that force on “the hatch is sealed”, and which rule of inference gives it?', answer: [1, 1], labels: ['case 2 truth value', 'case 2 rule number'], explanation: 'The fact is the hypothesis, so the hatch is sealed: “the hatch is sealed” is 1. That is modus ponens, rule 1.' }
  ]
 },
 {
  id: 'q20', title: 'Three speeches, one sound chain', topic: 'Chains of reasoning and fallacies', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'Three councillors have each made an argument that sounds convincing, and the chamber needs to know which ones actually hold up.',
  lesson: 'The chain rule: from p → q and q → r, conclude p → r. Affirming the conclusion and denying the hypothesis are fallacies.',
  prompt: 'Three speeches in the council. Argument 1: If the east pump is running, then the tank pressure rises. The tank pressure rises. So the east pump is running. Argument 2: If the hatch is sealed, then the fan is on. If the fan is on, then the heater is on. So if the hatch is sealed, then the heater is on. Argument 3: If the solar array is deployed, then the battery is charging. The battery is not charging. So the solar array is not deployed. Enter 1 if the argument is valid or 0 if it is a fallacy, for arguments 1, 2 and 3 in that order, then the number of the argument that uses the chain rule.',
  answer: [0, 1, 1, 2], labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'number of the chain rule argument'], tolerance: 0.01,
  hints: [
   'Match each argument to a pattern. Valid: modus ponens, modus tollens, the chain rule. Fallacies: affirming the conclusion, denying the hypothesis, a chain read backwards.',
   'The chain rule links two conditionals end to end: if X then Y, if Y then Z, so if X then Z. Read the order of the parts carefully.'
  ],
  solution: 'Argument 1 is affirming the conclusion, a fallacy (0): the conclusion of the rule is given and its hypothesis is claimed, but the conclusion can be true for some other reason. Argument 2 is the chain rule, valid (1): each rule passes truth on to the next, so the first part leads to the last. Argument 3 is modus tollens, valid (1): the conclusion of the rule is denied, so its hypothesis must be false. The chain rule is argument 2.',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Fallacy board', description: 'A board in the chamber listing the two tempting patterns that do not prove anything.' },
  sources: [source.cm2_7],
  teaching: {
   intuition: 'Rules can be linked end to end. If p → q and q → r, then whenever p is true, q is true, and then r is true, so p → r. This is the chain rule, also called hypothetical syllogism, and it is valid however long the chain is. A fallacy is an argument pattern that looks convincing but is not valid: its premises can all be true while its conclusion is false. Two fallacies are very common. Affirming the conclusion goes from “if p, then q” and q to p: if the pump makes the pressure rise and the pressure rose, the pump need not be running, because something else may have raised it. Denying the hypothesis goes from “if p, then q” and ¬p to ¬q: the pump being off does not stop the pressure rising for some other reason. A chain read backwards is a fallacy too: from p → q and q → r you cannot conclude r → p. The valid patterns are modus ponens, modus tollens and the chain rule.',
   steps: [
    'Write each argument as letters: find the rules (the “if … then” sentences) and the facts.',
    'Match the pattern: modus ponens, modus tollens, the chain rule, affirming the conclusion, denying the hypothesis, or a chain read backwards.',
    'The first three are valid (1); the other three are fallacies (0).',
    'In doubt, build the truth table and look for a row with every premise true and the conclusion false.'
   ],
   example: {
    prompt: 'Argument: “If the rover is docked, then the battery is charging. The battery is charging. So the rover is docked.” Valid or a fallacy?',
    steps: [
     'In letters: p → q, q, so p.',
     'That is affirming the conclusion: the battery could be charging from the solar array while the rover is out.'
    ],
    answer: 'A fallacy (0).'
   },
   pitfalls: [
    'Accepting affirming the conclusion because it sounds like modus ponens: the given fact must be the hypothesis, not the conclusion.',
    'Accepting a chain whose conclusion runs backwards, from the last part to the first.',
    'Judging by whether the conclusion is believable instead of by the pattern of the argument.'
   ]
  },
  guidance: [
   { prompt: 'Argument 1: If the east pump is running, then the tank pressure rises. The tank pressure rises. So the east pump is running. Valid (1) or a fallacy (0)?', answer: [0], labels: ['argument 1 (1 or 0)'], explanation: 'It is affirming the conclusion, a fallacy: the conclusion of the rule is given and its hypothesis is claimed, but the conclusion can be true for some other reason.' },
   { prompt: 'Argument 2: If the hatch is sealed, then the fan is on. If the fan is on, then the heater is on. So if the hatch is sealed, then the heater is on. Valid (1) or a fallacy (0)?', answer: [1], labels: ['argument 2 (1 or 0)'], explanation: 'It is the chain rule, valid: each rule passes truth on to the next, so the first part leads to the last.' },
   { prompt: 'Argument 3: If the solar array is deployed, then the battery is charging. The battery is not charging. So the solar array is not deployed. Valid (1) or a fallacy (0)? Then which argument links two rules end to end, the chain rule?', answer: [1, 2], labels: ['argument 3 (1 or 0)', 'number of the chain rule argument'], explanation: 'Argument 3 is modus tollens, valid: the conclusion of the rule is denied, so its hypothesis must be false. The chain rule is argument 2.' }
  ]
 }
);
})();
