/* Logic and proof missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/logic/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Nested quantifiers on a printed grid [Levin 0.2]
     q22  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Knights and knaves [Levin 0.2, 3.1]
     q23  ch 4 Arguments · Intermediate, 150 XP · sector 'Council Chamber' · Chapter review: weighing an argument in council [CM 2.7, Levin 0.2]
     q24  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Definitions: even, odd and “divides” [Levin 3.2, 0.2]
     q25  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Direct proof, step by step [Levin 3.2]
     q26  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Direct proofs with “divides” [Levin 3.2]
     q27  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Proof by contrapositive [Levin 3.2]
     q28  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Proof by cases [Levin 3.2]
     q29  ch 5 Direct proof · Intermediate, 150 XP · sector 'Proof Workshop' · Chapter review: choosing a method [Levin 3.2]
     q30  ch 6 Indirect proof · Advanced, 200 XP · sector 'Inquiry Office' · Proof by contradiction [Levin 3.2] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 2 Logic; Oscar Levin, Discrete Mathematics: An Open Introduction, 3rd edition sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Levin/ (OpenStax or Levin).
   A title reads like: Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs
   Link to the section page itself: https://discrete.openmathbooks.org/dmoi3/<page>.html */
const source = {
 lv0_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.2 Mathematical Statements', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-statements.html', description: 'Mathematical statements, connectives and quantifiers, including statements with more than one quantifier.', verified: '2026-11-27' },
 lv3_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.1 Propositional Logic', url: 'https://discrete.openmathbooks.org/dmoi3/sec_propositional.html', description: 'Truth tables and logical equivalence, the tools used here to test every case of a puzzle row by row.', verified: '2026-11-27' },
 lv3_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_logic-proofs.html', description: 'Direct proof, proof by contrapositive, proof by contradiction and proof by cases.', verified: '2026-11-27' },
 lv0_2k: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.2 Mathematical Statements', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-statements.html', description: 'Opens with a knights-and-knaves puzzle (each troll is a knight who always tells the truth or a knave who always lies), then the statements and implications used to reason about it.', verified: '2026-11-27' },
 lv5_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 5.2 Introduction to Number Theory', url: 'https://discrete.openmathbooks.org/dmoi3/sec_addtops-numbth.html', description: 'The divisibility relation: “m divides n” means n ÷ m is an integer, with true and false examples.', verified: '2026-11-27' },
 cm2_7: { title: 'OpenStax Contemporary Mathematics — 2.7 Logical Arguments', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-7-logical-arguments', description: 'Arguments, premises and conclusions, valid forms of reasoning and common fallacies.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'The master key question', topic: 'Nested quantifiers on a printed grid', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'The council wants to know whether one master key would do for every airlock, or whether each airlock only needs a key of its own.',
  lesson: 'With nested quantifiers the order matters: ∀x ∃y lets y change with x, while ∃y ∀x needs one y that works for every x.',
  prompt: 'The council keeps a key chart for four airlocks and four keys. Each row is an airlock and lists keys 1 to 4 in order; a 1 means that key opens the airlock and a 0 means it does not. The chart reads airlock 1: 0 1 0 0; airlock 2: 1 0 0 1; airlock 3: 0 0 1 0; airlock 4: 0 1 0 1. Let x stand for an airlock and y for a key. Statement A is ∀x ∃y (y opens x): for every airlock there is a key that opens it. Statement B is ∃y ∀x (y opens x): there is one key that opens every airlock. Enter the truth value of A (1 for true, 0 for false), then the truth value of B, then the number of airlocks that have at least one key.',
  answer: [1, 0, 4], labels: ['A (1 or 0)', 'B (1 or 0)', 'airlocks with a key'], tolerance: 0.01,
  hints: [
   'For A, read the chart row by row: every airlock needs at least one 1 in its row, and different airlocks may use different keys.',
   'For B, read it column by column: one single key must have a 1 in every row, so every entry in its column would be 1.'
  ],
  solution: 'Row by row: airlock 1 is opened by key 2; airlock 2 is opened by keys 1 and 4; airlock 3 is opened by key 3; airlock 4 is opened by keys 2 and 4. So all 4 airlocks have a key, and A is true (1): each airlock has its own key, even if the keys differ. Column by column: key 1 opens airlock 2; key 2 opens airlocks 1 and 4; key 3 opens airlock 3; key 4 opens airlocks 2 and 4. No column has a 1 in every row, so no single key opens every airlock and B is false (0). A is true while B is false: swapping the order of the quantifiers changed the meaning.',
  xp: 150, prereqs: ['q16'],
  artifact: { name: 'The key chart', description: 'Four rows, four columns and the difference between “each has one” and “one fits all”.' },
  sources: [source.lv0_2],
  teaching: {
   intuition: 'A statement can hold two quantifiers, one inside the other. These are called nested quantifiers. “For every airlock there is a key that opens it” is written ∀x ∃y (y opens x). Read it from the left: first any airlock x is picked, and then you may hunt for a key y that suits that airlock; a different airlock may use a different key. Now swap the quantifiers: ∃y ∀x (y opens x) says “there is a key that opens every airlock”. Here the key is chosen first and must then work for all the airlocks at once: a master key. The same words in a different order make a much stronger claim. On a chart with airlocks as rows and keys as columns, ∀x ∃y asks that every row has at least one 1, and ∃y ∀x asks that some column has a 1 in every row. If a master key exists, every airlock certainly has a key, so when ∃y ∀x is true, ∀x ∃y is true as well. The reverse can fail.',
   steps: [
    'Read the quantifiers from left to right. The one written first is chosen first, and the one after it may depend on it.',
    'For ∀x ∃y, go through every x and look for at least one y that works for it. One x with no y is a counterexample, and the statement is false.',
    'For ∃y ∀x, look for a single y that works for every x at once. On a chart that is a column with a 1 in every row.',
    'Count the x that have a match: ∀x ∃y is true exactly when that count is the whole domain.'
   ],
   example: {
    prompt: 'Three docking ports and three cables. Each row is a port and lists cables 1 to 3: port 1: 1 1 0; port 2: 0 1 0; port 3: 0 1 1. Are ∀x ∃y (cable y fits port x) and ∃y ∀x (cable y fits port x) true?',
    steps: [
     'Row by row: port 1 takes cables 1 and 2, port 2 takes cable 2, port 3 takes cables 2 and 3. Every port has a cable, so ∀x ∃y is true.',
     'Column by column: cable 2 has a 1 in every row, so it fits all three ports and ∃y ∀x is true as well.',
     'If port 2 read 0 0 1 instead, cable 2 would no longer fit every port: ∃y ∀x would become false, while ∀x ∃y would stay true.'
    ],
    answer: 'Both are true, 1 and 1, and all 3 ports have a cable.'
   },
   pitfalls: [
    'Reading ∀x ∃y as if one y must serve every x. In ∀x ∃y the y may change from one x to the next.',
    'Checking rows when the statement asks about columns. ∃y ∀x is about one column with a 1 in every row.',
    'Thinking the two orders always agree. A chart where each airlock has its own key makes ∀x ∃y true and ∃y ∀x false.'
   ]
  },
  guidance: [
   { prompt: 'Read the chart row by row. How many airlocks have at least one 1 in their row?', answer: [4], labels: ['airlocks with a key'], explanation: 'Airlock 1 is opened by key 2; airlock 2 is opened by keys 1 and 4; airlock 3 is opened by key 3; airlock 4 is opened by keys 2 and 4. That makes 4 airlocks with a key.' },
   { prompt: 'Now read it column by column. How many keys have a 1 in every row, so that they open all four airlocks?', answer: [0], labels: ['keys that open every airlock'], explanation: 'Key 1 opens airlock 2; key 2 opens airlocks 1 and 4; key 3 opens airlock 3; key 4 opens airlocks 2 and 4. No key opens all four, so the count is 0.' },
   { prompt: 'A needs every airlock to have some key; B needs one key that opens them all. What are the truth values of A and B?', answer: [1, 0], labels: ['A (1 or 0)', 'B (1 or 0)'], explanation: 'All 4 airlocks have a key, so A is true (1). No key opens every airlock, so B is false (0).' }
  ]
 },
 {
  id: 'q22', title: 'Delegates from the far island', topic: 'Knights and knaves', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'Three delegates from the far island have made statements about each other, and the clerk must record who is honest before the council votes.',
  lesson: 'In a knights-and-knaves puzzle every knight’s statement is true and every knave’s is false: test each row of the truth table and keep the one that fits.',
  prompt: 'Three delegates have come to the council from an island where every knight always tells the truth and every knave always lies. Each of them is one or the other. Ada says: “Bo is a knave.” Bo says: “Cal is a knave.” Cal says: “Ada and Bo are both knights.” Exactly one way of making each of them a knight or a knave fits all three statements. Enter 1 if Ada is a knight and 0 if Ada is a knave, then the same for Bo, then for Cal, then the number of knights among the three.',
  answer: [0, 1, 0, 1], labels: ['Ada (1 knight, 0 knave)', 'Bo (1 knight, 0 knave)', 'Cal (1 knight, 0 knave)', 'knights'], tolerance: 0.01,
  hints: [
   'Treat each delegate like a statement letter, with knight as 1 and knave as 0. Three letters give the 8 rows of a truth table.',
   'A row fits when every knight’s statement is true on it and every knave’s statement is false on it. Test the rows one at a time and cross out each row where some statement breaks this rule.'
  ],
  solution: 'The row that fits is Ada knave, Bo knight, Cal knave. Check: Ada is a knave and says “Bo is a knave”, which is false; Bo is a knight and says “Cal is a knave”, which is true; Cal is a knave and says “Ada and Bo are both knights”, which is false. Every knight told the truth and every knave lied, so there is 1 knight. Every other row breaks a statement: Ada knight, Bo knight, Cal knight breaks Ada’s statement; Ada knight, Bo knight, Cal knave breaks Ada’s statement; Ada knight, Bo knave, Cal knight breaks Cal’s statement; Ada knight, Bo knave, Cal knave breaks Bo’s statement; Ada knave, Bo knight, Cal knight breaks Bo’s statement; Ada knave, Bo knave, Cal knight breaks Ada’s statement; Ada knave, Bo knave, Cal knave breaks Ada’s statement.',
  xp: 150, prereqs: ['q08'],
  artifact: { name: 'The delegates’ testimony', description: 'Eight rows, three statements, and the one row that survives them all.' },
  sources: [source.lv0_2k, source.lv3_1],
  teaching: {
   intuition: 'On the island in this puzzle there are two kinds of people. A knight always tells the truth, so anything a knight says is a true statement. A knave always lies, so anything a knave says is false. You cannot see who is which; you only hear what they say. The trick is to treat “Ada is a knight” as a statement letter that is 1 or 0, just as p was in a truth table. With three people there are 2 × 2 × 2 = 8 rows: every way of making each of them a knight or a knave. On each row, check every speaker. A knight’s statement must come out true on that row, and a knave’s must come out false. A row where any speaker breaks this is impossible and is crossed out. A good puzzle leaves exactly one row standing, and that row tells you who is who.',
   steps: [
    'Write the 8 rows for the three speakers, knight as 1 and knave as 0, in the usual truth-table order.',
    'Take one speaker. On each row work out whether that speaker’s statement is true or false, and cross the row out if that does not match the speaker’s kind.',
    'Repeat with the next speaker on the rows that are left.',
    'The row that survives every speaker is the answer. Count its knights.'
   ],
   example: {
    prompt: 'Two delegates arrive. Dev says: “We are both knaves.” Eli says nothing. Who is who?',
    steps: [
     'There are 2 × 2 = 4 rows. If Dev were a knight, “we are both knaves” would be true and make Dev a knave: impossible. So Dev is a knave, and the statement is false.',
     'False means they are not both knaves. Dev is a knave, so Eli must be a knight. Only the row Dev knave, Eli knight fits.'
    ],
    answer: 'Dev is a knave and Eli is a knight: one knight.'
   },
   pitfalls: [
    'Checking only whether a statement is true, and forgetting that a knave’s statement must be false on the row you keep.',
    'Stopping at the first row that fits one speaker. Every speaker has to fit the same row.',
    '“Bo and I are the same kind” is about the speaker too: on each row compare both kinds before you decide whether it is true.'
   ]
  },
  guidance: [
   { prompt: 'Look at Ada’s statement alone. On how many of the 8 rows does it fit Ada: true where Ada is a knight, false where Ada is a knave?', answer: [4], labels: ['rows that fit Ada'], explanation: 'Ada’s statement, “Bo is a knave”, fits Ada on 4 of the 8 rows. The others are crossed out.' },
   { prompt: 'Keep only the rows where Ada’s statement and Bo’s statement both fit. How many rows are left?', answer: [2], labels: ['rows left'], explanation: 'Bo’s statement, “Cal is a knave”, crosses out more rows, and 2 rows are left.' },
   { prompt: 'Test Cal’s statement on the rows that are left: one row survives. Enter 1 or 0 for Ada, Bo and Cal on that row, then the number of knights.', answer: [0, 1, 0, 1], labels: ['Ada (1 knight, 0 knave)', 'Bo (1 knight, 0 knave)', 'Cal (1 knight, 0 knave)', 'knights'], explanation: 'Only Ada knave, Bo knight, Cal knave survives Cal’s statement, “Ada and Bo are both knights”, so there is 1 knight.' }
  ]
 },
 {
  id: 'q23', title: 'The council weighs its arguments', topic: 'Chapter review: weighing an argument in council', tier: 'Intermediate', sector: 'Council Chamber',
  brief: 'Before the council votes, the chair wants every argument on the table marked valid or fallacy, and one claim about past votes checked.',
  lesson: 'An argument is valid when its form forces the conclusion; a “there is” claim is true when it has at least one witness.',
  prompt: 'The council weighs three arguments before it votes. Argument 1: “If the dome pressure falls, then the alarm sounds. The alarm sounds. So the dome pressure falls.” Argument 2: “If the rover is late, then the supply run is delayed. The supply run is not delayed. So the rover is not late.” Argument 3: “If the filter clogs, then the water tastes of iron. If the water tastes of iron, then the council orders a new filter. So if the filter clogs, then the council orders a new filter.” Enter 1 for each argument that is valid and 0 for each that is a fallacy, in order. Then the chair claims: “There is a session in which more than 10 members voted yes.” The yes votes in the last six sessions were 12, 7, 15, 9, 18 and 11. Enter the number of sessions that are witnesses to the chair’s claim.',
  answer: [0, 1, 1, 4], labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'witnesses'], tolerance: 0.01,
  hints: [
   'Write each argument with letters, p for its first sentence, q for the next and r for a third, then match it to a form you know. Modus ponens, modus tollens and the chain rule are valid; affirming the conclusion and denying the hypothesis are fallacies.',
   'A witness is one session that makes the “there is” claim true. Count every session with more than 10 yes votes; a session with exactly 10 does not count.'
  ],
  solution: 'Argument 1 has the form p → q, q, so p: affirming the conclusion, a fallacy, so it scores 0. Argument 2 has the form p → q, ¬q, so ¬p: modus tollens, so it scores 1. Argument 3 has the form p → q, q → r, so p → r: the chain rule, so it scores 1. The yes votes above 10 are 12, 15, 18 and 11, one witness session each, so the claim has 4 witnesses and it is true.',
  xp: 150, prereqs: ['q20', 'q21'],
  artifact: { name: 'The council’s scorecard', description: 'Five argument patterns: three valid, two fallacies.' },
  sources: [source.cm2_7, source.lv0_2],
  teaching: {
   intuition: 'A persuasive argument and a valid one are not the same thing. Validity is about form, not topic: write each sentence as a letter and the argument becomes a pattern. If p then q, and p, so q (modus ponens) is valid. If p then q, and not q, so not p (modus tollens) is valid. If p then q, and if q then r, so if p then r (the chain rule) is valid. Two patterns look almost as good and are fallacies: if p then q, and q, so p (affirming the conclusion), and if p then q, and not p, so not q (denying the hypothesis). In a fallacy the premises can all be true while the conclusion is false, which a truth table shows. Claims about the record are checked the way quantifiers are: “there is a session with more than k yes votes” needs one witness, and the number of witnesses says how much support it has.',
   steps: [
    'Replace each sentence of an argument by a letter, p, q or r, and the word “not” by ¬.',
    'Compare the pattern with the five you know: modus ponens, modus tollens and the chain rule are valid; affirming the conclusion and denying the hypothesis are fallacies.',
    'Score 1 for a valid argument and 0 for a fallacy, whatever the topic and whether or not the conclusion happens to be true.',
    'For a “there is” claim, go through the list and count the witnesses, the items that make it true. The claim is true when there is at least one.'
   ],
   example: {
    prompt: 'Argument: “If the greenhouse is cold, then the seedlings wilt. The seedlings wilt. So the greenhouse is cold.” The water use on four days was 30, 45, 28 and 51 litres. How many witnesses has “there is a day with more than 40 litres”?',
    steps: [
     'With p for “the greenhouse is cold” and q for “the seedlings wilt”, the pattern is p → q, q, so p: affirming the conclusion. The seedlings might wilt for another reason, so it is a fallacy and scores 0.',
     'The days above 40 litres used 45 and 51 litres: two witnesses, so the claim is true.'
    ],
    answer: 'The argument scores 0, and the claim has 2 witnesses.'
   },
   pitfalls: [
    'Calling an argument valid because its conclusion sounds true. Validity depends on the pattern only.',
    'Mixing up modus tollens (¬q, so ¬p: valid) with denying the hypothesis (¬p, so ¬q: a fallacy).',
    'Counting a value equal to k as a witness for “more than k”.'
   ]
  },
  guidance: [
   { prompt: 'Write each argument with letters p, q and r. Is argument 1 valid (1) or a fallacy (0)? Then argument 2, then argument 3.', answer: [0, 1, 1], labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)'], explanation: 'Argument 1 is p → q, q, so p, affirming the conclusion, a fallacy. Argument 2 is p → q, ¬q, so ¬p, modus tollens. Argument 3 is p → q, q → r, so p → r, the chain rule.' },
   { prompt: 'The yes votes were 12, 7, 15, 9, 18 and 11. How many of them are more than 10?', answer: [4], labels: ['witnesses'], explanation: '12, 15, 18 and 11 are more than 10, so there are 4 witnesses.' }
  ]
 },
 {
  id: 'q24', title: 'Words with exact meanings', topic: 'Definitions: even, odd and “divides”', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'The proof workshop will not accept a claim about numbers until its words have exact meanings, so the first job is to apply three of them.',
  lesson: 'A definition turns a word into an equation: n is even when n = 2k, odd when n = 2k + 1, and a | b when b = a × m, for whole numbers k and m.',
  prompt: 'The proof workshop starts with definitions. A whole number n is odd when n = 2k + 1 for some whole number k. For n = 37, enter that k. Next, a | b (read “a divides b”) means b = a × m for some whole number m. Enter 1 if the claim is true and 0 if it is false for each of these three claims, in order: 4 | 28; 6 | 32; 9 | 3.',
  answer: [18, 1, 0, 0], labels: ['k', 'claim 1 (1 or 0)', 'claim 2 (1 or 0)', 'claim 3 (1 or 0)'], tolerance: 0.01,
  hints: [
   'Take 1 away from n: what is left is 2k, so halve it.',
   'For a | b, ask whether b is a times some whole number. a | b is a claim, true or false; it is not the number b ÷ a, and the order matters.'
  ],
  solution: '37 − 1 = 36 and 36 ÷ 2 = 18, so 37 = 2 × 18 + 1 and k = 18. Claim 1: 28 = 4 × 7, so 4 | 28 is true: 1. Claim 2: 6 × 5 = 30 is too small and 6 × 6 = 36 is too big, so no whole number m gives 32 = 6 × m and 6 | 32 is false: 0. Claim 3: 9 × 0 = 0 is too small and 9 × 1 = 9 is too big, so no whole number m gives 3 = 9 × m and 9 | 3 is false: 0 (3 | 9 is true, but that is a different claim).',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'The workshop dictionary', description: 'Even, odd and divides, each written as an equation.' },
  sources: [source.lv5_2, source.lv3_2],
  teaching: {
   intuition: 'A proof can only use what words mean exactly, so mathematics fixes the meaning of each word in a definition. Here are three. A whole number n is even when n = 2k for some whole number k: 14 is even because 14 = 2 × 7. A whole number n is odd when n = 2k + 1 for some whole number k: 53 is odd because 53 = 2 × 26 + 1. Every whole number is even or odd, and never both. Third, for whole numbers a and b we write a | b, read “a divides b”, when b = a × m for some whole number m: 5 | 35 because 35 = 5 × 7. Take care: a | b is a statement, true or false, not a number like 35 ÷ 5, and the order matters, because 3 | 12 is true while 12 | 3 is false. The power of a definition is that it turns a word into an equation you can calculate with, which is exactly what a proof needs.',
   steps: [
    'To use “n is odd”, write n = 2k + 1 and find k: take 1 away and halve what is left.',
    'To use “n is even”, write n = 2k and find k by halving.',
    'To test a | b, look for a whole number m with b = a × m. If b lies strictly between two neighbouring multiples of a, there is none, and a | b is false.',
    'Read a | b in the right order: the first number divides the second.'
   ],
   example: {
    prompt: 'Find the k with 53 = 2k + 1, then decide whether 6 | 42 and whether 8 | 20.',
    steps: [
     '53 − 1 = 52 and 52 ÷ 2 = 26, so 53 = 2 × 26 + 1 and k = 26.',
     '42 = 6 × 7, so 6 | 42 is true.',
     '8 × 2 = 16 and 8 × 3 = 24, and 20 lies between them, so 8 | 20 is false.'
    ],
    answer: 'k = 26; 6 | 42 is true (1); 8 | 20 is false (0).'
   },
   pitfalls: [
    'Reading a | b as the number a ÷ b or b ÷ a. It is a claim, and its value is 1 or 0.',
    'Swapping the order: 12 | 3 is false even though 3 | 12 is true.',
    'Halving n itself instead of n − 1 for an odd n: for 53 the k is 26, not 26.5.'
   ]
  },
  guidance: [
   { prompt: '37 − 1 = 36. Which whole number k gives 2k = 36?', answer: [18], labels: ['k'], explanation: '36 ÷ 2 = 18, so 37 = 2 × 18 + 1: 37 is odd with k = 18.' },
   { prompt: 'For each claim a | b, look for a whole number m with b = a × m. Enter 1 or 0 for claim 1, then claim 2, then claim 3.', answer: [1, 0, 0], labels: ['claim 1 (1 or 0)', 'claim 2 (1 or 0)', 'claim 3 (1 or 0)'], explanation: 'Claim 1: 28 = 4 × 7, so 4 | 28 is true: 1. Claim 2: 6 × 5 = 30 is too small and 6 × 6 = 36 is too big, so no whole number m gives 32 = 6 × m and 6 | 32 is false: 0. Claim 3: 9 × 0 = 0 is too small and 9 × 1 = 9 is too big, so no whole number m gives 3 = 9 × m and 9 | 3 is false: 0 (3 | 9 is true, but that is a different claim).' }
  ]
 },
 {
  id: 'q25', title: 'The missing step on the board', topic: 'Direct proof, step by step', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'A step has fallen off the proof board in the workshop, and the proof cannot be signed off until the gap is filled.',
  lesson: 'A direct proof assumes the hypothesis, rewrites it with definitions, and uses algebra until the conclusion appears.',
  prompt: 'Mira proves the theorem “if m and n are odd, then m × n is odd” with a direct proof, but one step has fallen off the board. Step 1: Assume m and n are odd whole numbers. Step 2: By the definition of odd, m = 2a + 1 and n = 2b + 1 for some whole numbers a and b. Step 3: Multiply out: m × n = (2a + 1)(2b + 1) = 4ab + 2a + 2b + 1. Step 4: (missing) Step 5: The bracket 2ab + a + b is a whole number, so m × n is odd by the definition of odd. ∎ The choices for the gap are: (1) By the definition of odd, m = 2a + 1 and n = 2a + 1 for one whole number a. (2) Take 2 out of the first three terms: m × n = 2(2ab + a + b) + 1. (3) Assume m × n is odd. (4) Check one case: 3 × 5 = 15, which is odd, so it holds every time. For m = 11 and n = 7, so that a = 5 and b = 3, enter the value of the bracket 2ab + a + b. Then enter the number of the choice that fills the gap.',
  answer: [38, 2], labels: ['bracket 2ab + a + b', 'choice'], tolerance: 0.01,
  hints: [
   'Put the numbers into the bracket: 2 × a × b, then add a and add b.',
   'Read the steps on either side of the gap. Step 4 has to lead from the one before it to the one after it, using only definitions and algebra.'
  ],
  solution: 'With a = 5 and b = 3, 2ab + a + b = 2 × 5 × 3 + 5 + 3 = 38, and indeed 11 × 7 = 77 = 2 × 38 + 1. The gap is step 4, which takes 2 out to reach the form 2k + 1: choice 2 says exactly that. Choice 1 uses the same a for both numbers, which would force m = n. Choice 3 assumes the conclusion instead of proving it. Choice 4 checks one example, and an example is not a proof for every m and n.',
  xp: 150, prereqs: ['q24', 'q19'],
  artifact: { name: 'The odd × odd proof', description: 'Five steps from “assume” to ∎, the first proof signed off in the workshop.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'A theorem is a statement that has been proved, usually of the form “if hypothesis, then conclusion”. A proof is a chain of sentences, each one an assumption, a definition or a step forced by the ones before, that shows the theorem holds every time, not just for the numbers we tried. The plainest kind is a direct proof. It assumes the hypothesis, turns its words into equations with the definitions, does algebra, and stops when the conclusion appears in the form a definition asks for. To prove “if m and n are odd, then m × n is odd”: assume m and n are odd; by definition m = 2a + 1 and n = 2b + 1 for whole numbers a and b; multiply out to get 4ab + 2a + 2b + 1; take 2 out of the first three terms to get 2(2ab + a + b) + 1; the bracket is a whole number, so m × n has the form 2k + 1 and is odd. The mark ∎ shows that the proof is finished. Checking 3 × 5 = 15 is a useful test, but it is not a proof: it says nothing about 7 × 9.',
   steps: [
    'Write down the hypothesis as an assumption: “Assume …”.',
    'Replace each defined word by its equation, with a new letter for each number (a for m, b for n).',
    'Use algebra to bring the expression into the form the conclusion needs, such as 2k + 1 for odd or 2k for even.',
    'Name the k, say why it is a whole number, and state the conclusion. End with ∎.'
   ],
   example: {
    prompt: 'Prove that if m and n are even, then m + n is even, and find the bracket for m = 6 and n = 10.',
    steps: [
     'Assume m and n are even. By definition m = 2a and n = 2b for whole numbers a and b.',
     'Then m + n = 2a + 2b = 2(a + b), and a + b is a whole number, so m + n is even. ∎',
     'For m = 6 and n = 10, a = 3 and b = 5, so the bracket a + b is 8, and indeed 6 + 10 = 16 = 2 × 8.'
    ],
    answer: 'The bracket a + b is 8.'
   },
   pitfalls: [
    'Using one letter for both numbers, as in m = 2a + 1 and n = 2a + 1. That proves the claim only when m = n.',
    'Starting from the conclusion (“assume m × n is odd”) instead of the hypothesis.',
    'Treating a checked example as a proof. An example can show that a claim is false, never that it always holds.'
   ]
  },
  guidance: [
   { prompt: 'Work out the bracket 2ab + a + b with a = 5 and b = 3.', answer: [38], labels: ['bracket 2ab + a + b'], explanation: '2 × 5 × 3 = 30, and 30 + 5 + 3 = 38.' },
   { prompt: 'Check the theorem on these numbers. What is m × n = 11 × 7, and what is 2 × 38 + 1?', answer: [77, 77], labels: ['m × n', '2 × bracket + 1'], explanation: '11 × 7 = 77 and 2 × 38 + 1 = 77: the same number, odd as the proof says. One check is not a proof, but it catches a slip in the algebra.' },
   { prompt: 'Step 4 has to take 2 out to reach the form 2k + 1. Which choice does that?', answer: [2], labels: ['choice'], explanation: 'Choice 2: “Take 2 out of the first three terms: m × n = 2(2ab + a + b) + 1.” Choice 1 uses the same a for both numbers, which would force m = n. Choice 3 assumes the conclusion instead of proving it. Choice 4 checks one example, and an example is not a proof for every m and n.' }
  ]
 },
 {
  id: 'q26', title: 'Dividing a sum', topic: 'Direct proofs with “divides”', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'The workshop wants a proof that a rule about “divides” holds for every pair of numbers, followed through on real numbers before it is filed.',
  lesson: 'To prove d | (a + b) from d | a and d | b, write a = d × s and b = d × t; then a + b = d × (s + t).',
  prompt: 'The workshop proves the theorem: if d | a and d | b, then d | (a + b). The proof: since d | a and d | b, a = d × s and b = d × t for some whole numbers s and t. Then a + b = d × s + d × t = d × (s + t), and s + t is a whole number, so d | (a + b). ∎ Follow the proof with d = 3, a = 27 and b = 12: enter s, then t, then the whole number m with a + b = 3m.',
  answer: [9, 4, 13], labels: ['s', 't', 'm'], tolerance: 0.01,
  hints: [
   'Since 3 | 27, 27 is 3 times a whole number s, so s = 27 ÷ 3. Find t the same way from b.',
   'Take 3 out of both terms: 3 × s + 3 × t = 3 × (s + t).'
  ],
  solution: '27 = 3 × 9, so s = 9; 12 = 3 × 4, so t = 4. Then 27 + 12 = 3 × 9 + 3 × 4 = 3 × (9 + 4) = 3 × 13, so m = 13. Check: 39 = 3 × 13, so 3 | 39, as the theorem says.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'The sum rule for divides', description: 'If d divides two numbers, it divides their sum: proved once, used everywhere.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'Claims about divisibility are proved the same way as claims about odd and even: turn each “divides” into an equation and do algebra. Suppose d | a and d | b. By the definition of divides there are whole numbers s and t with a = d × s and b = d × t. Add them: a + b = d × s + d × t. Both terms contain d, so take it out: a + b = d × (s + t). Since s + t is a whole number, a + b is d times a whole number, which is exactly what d | (a + b) means. The same steps with a minus sign show d | (a − b) when a is the larger number. Following a proof with real numbers is a good habit: the letters s, t and s + t become numbers you can see, and if one of them is not a whole number, a step went wrong.',
   steps: [
    'Write each hypothesis such as d | a as an equation a = d × s, with a new letter for each whole number.',
    'Combine the equations as the conclusion asks: add them, or subtract them.',
    'Take the common factor d out: d × s + d × t = d × (s + t).',
    'Say why the bracket is a whole number, and state the conclusion. ∎'
   ],
   example: {
    prompt: 'If 7 | a and 7 | b, then 7 | (a + b). Follow the proof for a = 35 and b = 56.',
    steps: [
     '35 = 7 × 5, so s = 5; 56 = 7 × 8, so t = 8.',
     '35 + 56 = 7 × 5 + 7 × 8 = 7 × (5 + 8) = 7 × 13.',
     'So 91 = 7 × 13 and 7 | 91, with m = 13.'
    ],
    answer: 's = 5, t = 8 and m = 13.'
   },
   pitfalls: [
    'Writing a = d × s and b = d × s with the same letter, which proves the claim only when a = b.',
    'Dividing the total by d instead of adding s and t. Both give m, but only s + t shows why m must be a whole number.',
    'Taking d out of only one term. The common factor comes out of the whole sum: d × s + d × t = d × (s + t).'
   ]
  },
  guidance: [
   { prompt: '3 | 27 means 27 = 3 × s for a whole number s. What is s?', answer: [9], labels: ['s'], explanation: '27 ÷ 3 = 9, so 27 = 3 × 9.' },
   { prompt: '3 | 12 means 12 = 3 × t. What is t?', answer: [4], labels: ['t'], explanation: '12 ÷ 3 = 4, so 12 = 3 × 4.' },
   { prompt: 'The proof says a + b = 3 × (s + t). What is the whole number m = s + t?', answer: [13], labels: ['m'], explanation: '9 + 4 = 13, and 3 × 13 = 39 = 27 + 12.' }
  ]
 },
 {
  id: 'q27', title: 'The back door of a proof', topic: 'Proof by contrapositive', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'A regulation about whole numbers is hard to prove head on, and Mira wants to show the crew a way in through the back door.',
  lesson: 'To prove “if p, then q”, you may give a direct proof of its contrapositive “if not q, then not p”; the two are logically equivalent.',
  prompt: 'A regulation says: “If n² is even, then n is even.” A direct attack is awkward, so Mira writes: “Assume n is odd, so n = 2j + 1 for a whole number j. Then n² = 4j² + 4j + 1 = 2(2j² + 2j) + 1, which is odd. ∎” Which statement have those lines proved? (1) If n² is odd, then n is odd. (2) If n is odd, then n² is even. (3) If n is odd, then n² is odd. (4) If n is even, then n² is even. Enter the number of that statement. Then check it for n = 9: enter the value of n², then the whole number k with n² = 2k + 1.',
  answer: [3, 81, 40], labels: ['statement proved', 'value', 'k'], tolerance: 0.01,
  hints: [
   'Read the first and last sentences of Mira’s lines: what is assumed becomes the hypothesis, and what is reached becomes the conclusion.',
   'Put n = 9 into n². For the k, take away 1 and halve what is left.'
  ],
  solution: 'Mira assumes “n is odd” and reaches “n² is odd”, so she has proved statement 3, “If n is odd, then n² is odd”: the contrapositive of the regulation. A statement and its contrapositive are logically equivalent, so the regulation is proved as well. Statement 1 is the inverse, with both parts negated. Statement 2 swaps the two parts but negates only one of them. Statement 4 is the converse, with the two parts swapped. For n = 9, n² = 81 = 2 × 40 + 1, which is odd, so k = 40.',
  xp: 150, prereqs: ['q13', 'q25'],
  artifact: { name: 'The contrapositive key', description: 'A way into a proof through its back door.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'Sometimes the hypothesis of a claim gives you nothing to calculate with. “If n² is even, then n is even” is like that: knowing n² = 2k tells you little about n itself. But a conditional and its contrapositive are logically equivalent, as the truth tables showed: “if p, then q” and “if not q, then not p” are true on exactly the same rows. So instead of the claim we may prove its contrapositive, “if n is odd, then n² is odd”, and that one is easy: n = 2j + 1, so n² = 4j² + 4j + 1 = 2(2j² + 2j) + 1, which is odd. This is a proof by contrapositive: a direct proof of the contrapositive, which settles the original claim. For whole numbers “not even” is “odd” and “not odd” is “even”, so the negations are easy to write. Be careful not to prove the converse or the inverse instead: neither is equivalent to the claim.',
   steps: [
    'Write the claim as “if p, then q” and name p and q.',
    'Form the contrapositive, “if not q, then not p”: negate both parts and swap them.',
    'Give a direct proof of the contrapositive: assume not q, use the definitions, and reach not p.',
    'Conclude the original claim, because a statement and its contrapositive are logically equivalent. ∎'
   ],
   example: {
    prompt: 'Prove “if 7n + 2 is odd, then n is odd” by contrapositive, and check the contrapositive for n = 6.',
    steps: [
     'The contrapositive is “if n is even, then 7n + 2 is even”.',
     'Assume n is even, so n = 2j. Then 7n + 2 = 14j + 2 = 2(7j + 1), which is even. ∎',
     'For n = 6: 7 × 6 + 2 = 44 = 2 × 22, even as the contrapositive says.'
    ],
    answer: 'The contrapositive is proved, and for n = 6 the value is 44 = 2 × 22.'
   },
   pitfalls: [
    'Proving the converse “if q, then p” by mistake. The converse is a different claim and can be false when the original is true.',
    'Negating only one part. The contrapositive negates both parts and swaps them.',
    'Forgetting that for whole numbers the negation of “even” is “odd”, so “n is not even” is written “n is odd”.'
   ]
  },
  guidance: [
   { prompt: 'Mira’s lines assume “n is odd” and end with “n² is odd”. Which of the four statements is “If n is odd, then n² is odd”?', answer: [3], labels: ['statement proved'], explanation: 'Statement 3. It is the contrapositive of “If n² is even, then n is even”: both parts negated and swapped.' },
   { prompt: 'Check the statement for n = 9. What is n²?', answer: [81], labels: ['value'], explanation: 'With n = 9, n² = 81.' },
   { prompt: '81 should be odd. Which whole number k gives 81 = 2k + 1?', answer: [40], labels: ['k'], explanation: '81 − 1 = 80 and 80 ÷ 2 = 40, so 81 = 2 × 40 + 1.' }
  ]
 },
 {
  id: 'q28', title: 'Two cases cover everything', topic: 'Proof by cases', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'A claim about every whole number has to be proved in the workshop, and no single line of algebra handles all of them at once.',
  lesson: 'A proof by cases splits the possibilities into cases that cover them all, such as n even and n odd, and proves the claim in each case.',
  prompt: 'The workshop wants a proof of the claim: for every whole number n, n² + 3n is even. Mira’s proof by cases first writes n² + 3n = n(n + 3), then splits the whole numbers into kinds that cover them all and shows the claim for each kind. Enter the number of cases the proof needs. Then, as checks, enter the whole number (n² + 3n) ÷ 2 for n = 12, which falls in the even case, and for n = 9, which falls in the odd case.',
  answer: [2, 90, 54], labels: ['cases', 'value for the even n', 'value for the odd n'], tolerance: 0.01,
  hints: [
   'Every whole number is even or odd, and none is both. Those kinds are the cases.',
   'Work out n² + 3n for the number first, then halve it. The result must be a whole number, because the claim says n² + 3n is even.'
  ],
  solution: 'Two cases cover every whole number. Case 1, n even: n = 2j, so n(n + 3) = 2j(n + 3) is even. Case 2, n odd: 3 is odd, and odd + odd is even, so n + 3 is even and so is the product. ∎ For n = 12: 144 + 36 = 180, and 180 ÷ 2 = 90. For n = 9: 81 + 27 = 108, and 108 ÷ 2 = 54.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'The case splitter', description: 'Even on one side, odd on the other, and nothing falls between.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'Some claims become easy once you know a little more about the number. “n² + n is even for every whole number n” is one: write n² + n = n(n + 1). If n is even, the product has an even factor, so it is even. If n is odd, then n + 1 is even, so again the product is even. That is a proof by cases. It splits all the possibilities into a few cases, proves the claim separately in each, and works because the cases together cover everything: every whole number is even or odd. The number of cases is part of the design. Two cases, even and odd, are enough here; leaving one out would leave a gap, and the proof would cover only some numbers. To check a case, pick a number in it and work the expression out.',
   steps: [
    'Find a split the claim responds to, such as n even and n odd, and check that the cases cover every possibility.',
    'Prove the claim in the first case, using that case’s extra fact (n = 2j, say).',
    'Prove it in each remaining case the same way.',
    'Conclude: the claim holds in every case, so it holds for every number. ∎'
   ],
   example: {
    prompt: 'Prove that n² + n is even for every whole number n, and check (n² + n) ÷ 2 for n = 6 and for n = 5.',
    steps: [
     'Case 1, n even: n = 2j, so n² + n = n(n + 1) = 2j(n + 1), which is even.',
     'Case 2, n odd: n + 1 is even, so n(n + 1) has an even factor and is even. ∎',
     'Checks: for n = 6, 36 + 6 = 42 and 42 ÷ 2 = 21; for n = 5, 25 + 5 = 30 and 30 ÷ 2 = 15.'
    ],
    answer: 'Two cases; the checks give 21 and 15.'
   },
   pitfalls: [
    'Proving one case and stopping. Every case must be done, or the proof has a gap.',
    'Choosing cases that do not cover every number, such as “n below 10” and “n above 10”, which misses 10 itself.',
    'Forgetting to halve: the check asks for the expression divided by 2, not the expression itself.'
   ]
  },
  guidance: [
   { prompt: 'Whole numbers come in two kinds by evenness. How many cases does the proof need?', answer: [2], labels: ['cases'], explanation: 'Two: n even and n odd. Together they cover every whole number, which a proof by cases must do.' },
   { prompt: 'In the even case, take n = 12. What is (n² + 3n) ÷ 2?', answer: [90], labels: ['value for the even n'], explanation: 'n² + 3n = 144 + 36 = 180, and 180 ÷ 2 = 90.' },
   { prompt: 'In the odd case, take n = 9. What is (n² + 3n) ÷ 2?', answer: [54], labels: ['value for the odd n'], explanation: 'n² + 3n = 81 + 27 = 108, and 108 ÷ 2 = 54.' }
  ]
 },
 {
  id: 'q29', title: 'The right tool for the claim', topic: 'Chapter review: choosing a method', tier: 'Intermediate', sector: 'Proof Workshop',
  brief: 'A new claim has come into the workshop, and before anyone writes a line Mira wants to know which kind of proof to reach for.',
  lesson: 'Choose the method from the shape of the claim: direct when the hypothesis gives a usable form, contrapositive when it does not, cases when the claim splits by even and odd.',
  prompt: 'The workshop has a claim to prove: “If n² is even, then n is even.” Use the workshop’s rule of thumb, which picks exactly one method for each claim. If the claim has no hypothesis (no “if” part) and starts “for every whole number n”, use proof by cases, n even and n odd. If the hypothesis is about an expression built from n, such as n² or 3n + 5, and the conclusion is about n alone, use proof by contrapositive. If the hypothesis is about the plain numbers themselves, such as m and n, or a and b, use direct proof. Which method does the rule pick? (1) Proof by cases. (2) Direct proof. (3) Proof by contrapositive. Enter the number of the method. Then enter the whole number k with n² = 2k + 1 that the proof gives for n = 7.',
  answer: [3, 24], labels: ['method', 'value'], tolerance: 0.01,
  hints: [
   'Test the claim against the rule in the prompt. Does it have an “if” part? If it does, is that part about an expression built from n, such as n² or 3n + 5, or about the plain numbers themselves?',
   'For the value, put the numbers into the expression the prompt names and solve for the whole number it asks for.'
  ],
  solution: 'Knowing n² = 2k says little about n itself, but the contrapositive “if n is odd, then n² is odd” starts from n = 2j + 1, which is easy to square. So the rule picks proof by contrapositive, choice 3. For the value: the proof assumes n is odd; 7² = 49 = 2 × 24 + 1, so k = 24.',
  xp: 150, prereqs: ['q26', 'q27', 'q28'],
  artifact: { name: 'The method rack', description: 'Direct, contrapositive and cases, each hung where it fits best.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'You now have three ways to prove a claim about whole numbers. A direct proof assumes the hypothesis and calculates; it suits a claim such as “if m and n are odd, then m + n is even”, where the definitions hand you m = 2a + 1 and n = 2b + 1 to add. A proof by contrapositive proves “if not q, then not p” instead; it suits a claim whose hypothesis is about a complicated expression such as n² or 3n + 5 while the conclusion is about n alone, because starting from n = 2j or n = 2j + 1 is easy. A proof by cases suits a claim with no hypothesis at all, “for every whole number n, …”, when the expression behaves differently for even and odd n. Choosing well saves work: the wrong method is not wrong, but it can leave you stuck.',
   steps: [
    'Look at the hypothesis. If it hands you a form you can calculate with, try a direct proof.',
    'If the hypothesis is about a complicated expression and the conclusion is about n alone, write the contrapositive and prove that directly.',
    'If there is no hypothesis and the claim depends on whether n is even or odd, split into those two cases.',
    'Carry out the method, and check one value from the proof with real numbers.'
   ],
   example: {
    prompt: 'Which method does the rule of thumb pick for “if n² is odd, then n is odd”, and what is k in n² = 2k for n = 8?',
    steps: [
     'The hypothesis is about n² and the conclusion about n alone, so prove the contrapositive, “if n is even, then n² is even”.',
     'For n = 8 the proof gives n² = 64 = 2 × 32, so k = 32.'
    ],
    answer: 'Proof by contrapositive, and k = 32.'
   },
   pitfalls: [
    'Choosing cases for a claim whose hypothesis already gives a form to calculate with. It works, but takes twice the effort.',
    'Trying a direct proof of “if n² is even, then n is even”: n² = 2k gives no form for n itself.',
    'Typing a method’s number from the order in the lesson instead of from the list in the prompt, which is shuffled.'
   ]
  },
  guidance: [
   { prompt: 'Which method does the rule pick for “If n² is even, then n is even”? Enter its number in the list.', answer: [3], labels: ['method'], explanation: 'Knowing n² = 2k says little about n itself, but the contrapositive “if n is odd, then n² is odd” starts from n = 2j + 1, which is easy to square. So the rule picks proof by contrapositive, choice 3.' },
   { prompt: 'Now enter the whole number k with n² = 2k + 1 that the proof gives for n = 7.', answer: [24], labels: ['value'], explanation: 'The proof assumes n is odd; 7² = 49 = 2 × 24 + 1, so k = 24.' }
  ]
 },
 {
  id: 'q30', title: 'Is there a last prime?', topic: 'Proof by contradiction', tier: 'Advanced', sector: 'Inquiry Office',
  brief: 'A council member says the outpost’s short list of primes is complete, and the Inquiry Office has to settle the matter for good.',
  lesson: 'A proof by contradiction assumes the claim is false and shows that this assumption leads to something impossible.',
  prompt: 'A council member insists that 2, 11 and 13 are the only primes there are. Mira answers with Euclid’s proof by contradiction. Assume the list is complete, and let N be the product of the listed primes plus 1. Enter N. Then enter the smallest prime factor of N, then N divided by that factor.',
  answer: [287, 7, 41], labels: ['N', 'smallest prime factor', 'N ÷ that factor'], tolerance: 0.01,
  hints: [
   'Multiply the listed primes together, then add 1.',
   'Try 2, 3, 5, 7, 11, … in turn. The first prime that divides N exactly is its smallest prime factor. If no prime whose square is at most N divides it, N is itself prime.'
  ],
  solution: 'N = 2 × 11 × 13 + 1 = 286 + 1 = 287. N is 1 more than a multiple of each listed prime, so none of 2, 11 and 13 divides it. Trying the other primes in order: 287 lies between 3 × 95 = 285 and 3 × 96 = 288, and between 5 × 57 = 285 and 5 × 58 = 290, so neither 3 nor 5 divides 287; but 287 = 7 × 41. So its smallest prime factor is 7, and 287 ÷ 7 = 41. 7 is not on the list, which contradicts the assumption that the list holds every prime. So the assumption is false: no finite list holds every prime. ∎',
  xp: 200, prereqs: ['q27'],
  artifact: { name: 'Euclid’s lantern', description: 'A light that always finds one more prime.' },
  sources: [source.lv3_2],
  teaching: {
   intuition: 'A prime is a whole number above 1 whose only divisors are 1 and itself, such as 2, 3, 5, 7 and 11. Every whole number above 1 has a smallest factor above 1, and that factor is always prime. Is there a largest prime? Euclid answered with a proof by contradiction: assume the opposite of what you want, and show that the assumption leads to something impossible, a contradiction. So assume there are only finitely many primes, and a list holds all of them. Multiply them all and add 1; call the result N. Each listed prime divides the product, so N is 1 more than a multiple of it, and no listed prime divides N. But N is above 1, so it has a smallest prime factor, and that prime cannot be on the list. The list was supposed to hold every prime: a contradiction. So the assumption is false, and there is no last prime. N itself need not be prime; it only needs a prime factor missing from the list.',
   steps: [
    'State the assumption: the claim is false. Here, a finite list holds every prime.',
    'Build N: multiply every prime on the list and add 1.',
    'Find the smallest prime factor of N by trying 2, 3, 5, 7, … in turn. If no prime whose square is at most N divides it, N is itself prime.',
    'Point out the contradiction: that prime is not on the list. So the assumption is false. ∎'
   ],
   example: {
    prompt: 'Someone claims that 3 and 5 are the only primes. Build Euclid’s N and find its smallest prime factor.',
    steps: [
     'N = 3 × 5 + 1 = 16.',
     '16 = 2 × 8, so its smallest prime factor is 2, and 16 ÷ 2 = 8.',
     '2 is not on the list, so the list was not complete: a contradiction.'
    ],
    answer: 'N = 16, its smallest prime factor is 2, and 16 ÷ 2 = 8.'
   },
   pitfalls: [
    'Thinking N must itself be prime. 2 × 7 × 13 + 1 = 183 = 3 × 61 is not prime; what matters is that its prime factor 3 is missing from the list.',
    'Taking the first number that divides N without checking that it is prime. Try the primes in order: the first one that divides N is its smallest prime factor.',
    'Forgetting the + 1. Every listed prime divides the product itself, so the product alone proves nothing.'
   ]
  },
  guidance: [
   { prompt: 'What is the product 2 × 11 × 13?', answer: [286], labels: ['product'], explanation: '2 × 11 × 13 = 286.' },
   { prompt: 'N is that product plus 1. What is N?', answer: [287], labels: ['N'], explanation: '286 + 1 = 287. It is 1 more than a multiple of every listed prime.' },
   { prompt: 'Find the smallest prime factor of 287 by trying 2, 3, 5, 7, … in turn. Enter it, then 287 divided by it.', answer: [7, 41], labels: ['smallest prime factor', 'N ÷ that factor'], explanation: '287 lies between 3 × 95 = 285 and 3 × 96 = 288, and between 5 × 57 = 285 and 5 × 58 = 290, so neither 3 nor 5 divides 287; but 287 = 7 × 41. So its smallest prime factor is 7, and 287 ÷ 7 = 41. That prime is not on the list: the contradiction.' }
  ]
 }
);
})();
