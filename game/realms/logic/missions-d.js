/* Logic and proof missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/logic/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Indirect proof · Advanced, 200 XP · sector 'Inquiry Office' · Disproving with a counterexample [Levin 3.2]
     q32  ch 6 Indirect proof · Advanced, 200 XP · sector 'Inquiry Office' · Existence proofs: finding a witness [Levin 3.2]
     q33  ch 6 Indirect proof · Advanced, 200 XP · sector 'Inquiry Office' · If-and-only-if proofs: both directions [Levin 3.2]
     q34  ch 6 Indirect proof · Advanced, 200 XP · sector 'Inquiry Office' · Spotting the flawed step [Levin 3.2]
     q35  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · Induction: the base case and the domino idea [Levin 2.5]
     q36  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · The inductive step: from k to k + 1 [Levin 2.5]
     q37  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · Induction for sums [Levin 2.5]
     q38  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · Induction for inequalities: where it starts [Levin 2.5]
     q39  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · Strong induction: postage stamps [Levin 2.5]
     q40  ch 7 Induction · Advanced, 200 XP · sector 'Long Stair' · Realm review and bridge to Real analysis: “for every ε there is an N” [Levin 0.2, 2.5] */
(function(){
'use strict';
/* Levin, Discrete Mathematics: An Open Introduction, 3rd edition: the sections the missions below cite, opened on the date in `verified`. */
const source = {
 l3_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_logic-proofs.html', description: 'Direct proof, proof by contrapositive and by contradiction, counterexamples, and proofs of if-and-only-if statements.', verified: '2026-11-27' },
 l3_2e: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_logic-proofs.html', description: 'Proving an existence claim by finding one example (all we need to do is find one), and the Proof by (counter) Example subsection.', verified: '2026-11-27' },
 l3_2i: { title: 'Levin, Discrete Mathematics: An Open Introduction — 3.2 Proofs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_logic-proofs.html', description: 'Exercises that ask for both implications of an if-and-only-if statement (“prove both implications”); the only if-and-only-if proof practice in this section.', verified: '2026-11-27' },
 l2_5w: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.5 Induction', url: 'https://discrete.openmathbooks.org/dmoi3/sec_seq-induction.html', description: 'A Warning box with a flawed induction “proof” (every Canadian has the same eye color) and where it goes wrong.', verified: '2026-11-27' },
 oc5_1: { title: 'OpenStax Calculus Volume 2 — 5.1 Sequences', url: 'https://openstax.org/books/calculus-volume-2/pages/5-1-sequences', description: 'Limit of a Sequence: the definition with for all ε > 0 there exists an integer N such that |aₙ − L| < ε for n ≥ N.', verified: '2026-11-27' },
 l2_5: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.5 Induction', url: 'https://discrete.openmathbooks.org/dmoi3/sec_seq-induction.html', description: 'Mathematical induction: the base case, the inductive step, sums and inequalities, and strong induction.', verified: '2026-11-27' },
 l0_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.2 Mathematical Statements', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-statements.html', description: 'Statements, quantifiers and the order of nested quantifiers.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'The promise on the notice board', topic: 'Disproving with a counterexample', tier: 'Advanced', sector: 'Inquiry Office',
  brief: 'Someone pinned a rule to the Inquiry Office board that promises a prime every time, and Mira wants it settled before anyone builds on it.',
  lesson: 'One case where a claim about every number fails is a counterexample, and it disproves the claim completely.',
  prompt: 'A note on the Inquiry Office board claims: “For every whole number n from 1 up, n² + n + 11 is prime.” A prime is a whole number above 1 that no whole number divides except 1 and itself. Disprove the claim. Enter the smallest counterexample n, then the value of n² + n + 11 at that n, then the smallest whole number above 1 that divides that value.',
  answer: [10, 121, 11], labels: ['smallest counterexample n', 'value of the expression there', 'smallest divisor above 1'], tolerance: 0.01,
  hints: [
   'Work out n² + n + 11 for n = 1, 2, 3 and so on, and test each value for a divisor other than 1 and itself.',
   'For each value, try dividing by 2, 3, 5, 7, 11 and 13 in turn. The first value that one of them divides exactly, without being that value itself, is not prime.'
  ],
  solution: 'n = 1 to 9 give 13, 17, 23, 31, 41, 53, 67, 83 and 101, all prime. n = 10 gives 10² + 10 + 11 = 121, and 121 = 11 × 11, so it is not prime. One failing case is enough to disprove a claim about every n, so n = 10 is the smallest counterexample. The value there is 121, and the smallest whole number above 1 that divides it is 11.',
  xp: 200, prereqs: ['q16'],
  artifact: { name: 'The broken promise', description: 'One line of working that sinks a claim about every number.' },
  sources: [source.l3_2],
  teaching: {
   intuition: 'A claim about every whole number is a promise with no exceptions. Checking a thousand cases that work proves nothing about the next one, but a single case that fails breaks the promise for good. That failing case is a counterexample, and showing it is a complete disproof: no further argument is needed. A good disproof makes the failure plain. For a claim that some expression is always prime, you name the n, work out the value and show a divisor, as in 25 = 5 × 5. Searching from n = 1 upwards finds the smallest counterexample, the first place the promise breaks.',
   steps: [
    'Read the claim and note its domain: here, every whole number from 1 up.',
    'Test the cases in order, n = 1, 2, 3 and so on, working out the value each time.',
    'For each value, look for a divisor other than 1 and the value itself: try 2, 3, 5, 7 and so on.',
    'The first n whose value has such a divisor is the smallest counterexample. Write the value as a product to show that it is not prime.'
   ],
   example: {
    prompt: 'Disprove the claim “for every whole number n from 1 up, 4n + 3 is prime.”',
    steps: ['n = 1 gives 7 and n = 2 gives 11, both prime.', 'n = 3 gives 15, and 15 = 3 × 5, so 15 is not prime.'],
    answer: 'n = 3 is the smallest counterexample: there the value is 15, which 3 divides.'
   },
   pitfalls: [
    'Stopping after a few values that work and calling the claim true. Cases that work never prove a claim about every n.',
    'Calling a value prime without testing its small divisors. 91 looks prime, but 91 = 7 × 13.',
    'Giving the value as the counterexample. The counterexample is the input n; the value is the evidence.'
   ]
  },
  guidance: [
   { prompt: 'Work out n² + n + 11 for n = 1, 2 and 3. Enter the three values.', answer: [13, 17, 23], labels: ['value at n = 1', 'value at n = 2', 'value at n = 3'], explanation: '1² + 1 + 11 = 13, 2² + 2 + 11 = 17 and 3² + 3 + 11 = 23.' },
   { prompt: 'Keep going, testing each value for a divisor. At which n is the value first not prime, and what is the value there?', answer: [10, 121], labels: ['smallest counterexample n', 'value there'], explanation: 'n = 1 to 9 give 13, 17, 23, 31, 41, 53, 67, 83 and 101, all prime. At n = 10 the value is 121, which is not prime.' },
   { prompt: '121 is not prime. What is the smallest whole number above 1 that divides it?', answer: [11], labels: ['smallest divisor above 1'], explanation: '121 = 11 × 11, and no smaller whole number above 1 divides 121.' }
  ]
 },
 {
  id: 'q32', title: 'One example is enough', topic: 'Existence proofs: finding a witness', tier: 'Advanced', sector: 'Inquiry Office',
  brief: 'The council doubts that any number meets a new storage rule at all, and Mira wants to settle it with a single example.',
  lesson: 'To prove that something exists, show one example of it, a witness, and check that it works.',
  prompt: 'The council doubts this storage rule can ever be met: “there is a whole number greater than 100 that both 6 and 10 divide.” An existence proof only has to show one such number, a witness, and check it. Find the smallest witness and enter it.',
  answer: [120], labels: ['smallest witness'], tolerance: 0.01,
  hints: [
   'List the numbers above 100 that 6 divides, in order, and test each one: does 10 divide it too?',
   'Stop at the first number that passes the test. That number is the witness, and checking it is the whole proof.'
  ],
  solution: 'The numbers above 100 that 6 divides are 102, 108, 114 and 120, and so on. 10 does not divide 102, 108 or 114, but it divides 120: 120 = 6 × 20 = 10 × 12. So 120 is the smallest witness. Showing it and checking it proves that there is a whole number greater than 100 that both 6 and 10 divide.',
  xp: 200, prereqs: ['q15'],
  artifact: { name: 'The witness card', description: 'One number, and the check that proves it exists.' },
  sources: [source.l3_2e],
  teaching: {
   intuition: 'A claim that begins “there is” asks for far less than a claim about every number: one example settles it. An existence proof shows such a number, called a witness, and checks that it has the property. That is the quantifier ∃ again: a “there is” statement is true as soon as one value works. The search is easy to organise. List the candidates in order, test each one, and stop at the first that passes. That first one is the smallest witness. A witness proves the “there is” claim completely, even though it says nothing about any other number.',
   steps: [
    'Write down exactly what the witness must do, and where the search starts.',
    'List the candidates in increasing order, beginning just above the starting number.',
    'Test each candidate against the condition, and stop at the first one that passes.',
    'State the witness and show the check, such as 72 = 8 × 9. That check is the whole proof.'
   ],
   example: {
    prompt: 'Prove that there is a whole number greater than 50 that both 4 and 6 divide.',
    steps: ['The numbers above 50 that 4 divides are 52, 56, 60 and so on.', '6 does not divide 52 or 56, but 60 = 6 × 10.'],
    answer: '60 is the smallest witness: 60 = 4 × 15 = 6 × 10.'
   },
   pitfalls: [
    'Starting the search at the bound itself. “Greater than 100” leaves out 100.',
    'Thinking a “there is” claim needs a general argument. One checked example proves it.',
    'Skipping candidates. The smallest witness is only found by testing every candidate in order.'
   ]
  },
  guidance: [
   { prompt: 'What is the first number above 100 that 6 divides?', answer: [102], labels: ['first candidate'], explanation: '6 × 16 = 96 is not above 100, so the first multiple of 6 above 100 is 6 × 17 = 102.' },
   { prompt: 'Test the candidates in order, starting there. Which is the first one that passes?', answer: [120], labels: ['smallest witness'], explanation: 'The numbers above 100 that 6 divides are 102, 108, 114 and 120, and so on. 10 does not divide 102, 108 or 114, but it divides 120: 120 = 6 × 20 = 10 × 12. So the smallest witness is 120.' }
  ]
 },
 {
  id: 'q33', title: 'Both ways through the door', topic: 'If-and-only-if proofs: both directions', tier: 'Advanced', sector: 'Inquiry Office',
  brief: 'A new door rule says two conditions always go together, and the Inquiry Office needs to know which half of the proof it already has.',
  lesson: 'An if-and-only-if claim is proved in two directions, if P then Q and if Q then P, and its two sides are true for exactly the same numbers.',
  prompt: 'The Inquiry Office is checking the claim: “For every whole number n, n² is even if and only if n is even.” Its two directions are: 1. If n is even, then n² is even. 2. If n² is even, then n is even. An investigator hands in this argument: “Suppose n is odd, so n = 2k + 1 for a whole number k. Then n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd. So when n is not even, n² is not even.” Enter the number of the direction this argument proves. Then, for n from 1 to 30, enter how many n make “n² is even” true, and then how many make “n is even” true.',
  answer: [2, 15, 15], labels: ['direction proved', 'count for the left side', 'count for the right side'], tolerance: 0.01,
  hints: [
   'Read what the argument supposes at the start and what it reaches at the end. An argument that supposes the opposite of one side and reaches the opposite of the other is proving a contrapositive.',
   'An if-and-only-if claim says both directions hold, so its two sides are true for exactly the same numbers. Count one side; the other must give the same count.'
  ],
  solution: 'The argument supposes “n is odd” and concludes “n² is odd”. That is the contrapositive of “If n² is even, then n is even”, which says the same thing, so the argument proves that direction: number 2. The other direction needs its own argument before the claim is proved. For n from 1 to 30, “n² is even” is true for 15 numbers, the even numbers, and “n is even” is true for the same 15 numbers, as an if-and-only-if claim requires.',
  xp: 200, prereqs: ['q06', 'q27'],
  artifact: { name: 'The two-way key', description: 'A door rule proved from both sides.' },
  sources: [source.l3_2i, source.l0_2],
  teaching: {
   intuition: '“P if and only if Q” makes two promises at once: if P then Q, and if Q then P. Call the first the forward direction and the second the backward direction. A proof of an if-and-only-if claim must prove both, usually as two short separate arguments, and either one may go through the contrapositive: to prove “if P then Q” you may prove “if not Q, then not P” instead, because the two say the same thing. To tell which direction an argument proves, read what it supposes and what it ends with. Because both directions hold, P and Q are true for exactly the same numbers, so counting the numbers that make each side true gives the same count.',
   steps: [
    'Split the claim into its forward direction, if P then Q, and its backward direction, if Q then P.',
    'Prove each direction on its own, directly or through its contrapositive.',
    'To identify a given argument, look at what it supposes and what it concludes. If it supposes “not Q” and concludes “not P”, it proves the forward direction through the contrapositive.',
    'Check the claim on a list of numbers: the two sides should be true for exactly the same numbers.'
   ],
   example: {
    prompt: 'Claim: for every whole number n, n + 4 is even if and only if n is even. Which direction does this argument prove? “Suppose n is even, so n = 2k. Then n + 4 = 2(k + 2), which is even.”',
    steps: ['It supposes “n is even” and concludes “n + 4 is even”.', 'So it proves “if n is even, then n + 4 is even”: the backward direction, from the right side to the left.'],
    answer: 'The backward direction. The forward direction still needs its own argument.'
   },
   pitfalls: [
    'Proving one direction and stopping. An if-and-only-if claim needs both.',
    'Misreading a contrapositive argument. “Suppose n is odd … so n² is odd” proves “if n² is even, then n is even”, not the other way round.',
    'Expecting different counts for the two sides. If they differed, the claim would be false.'
   ]
  },
  guidance: [
   { prompt: 'Which direction does the argument prove? Enter its number from the list.', answer: [2], labels: ['direction proved'], explanation: 'The argument supposes “n is odd” and concludes “n² is odd”. That is the contrapositive of “If n² is even, then n is even”, which says the same thing, so the argument proves that direction: number 2.' },
   { prompt: 'For n from 1 to 30, how many n make “n² is even” true?', answer: [15], labels: ['count for the left side'], explanation: '“n² is even” is true exactly for the even numbers, and there are 15 of them from 1 to 30.' },
   { prompt: 'And how many n from 1 to 30 make “n is even” true?', answer: [15], labels: ['count for the right side'], explanation: 'For n from 1 to 30, “n² is even” is true for 15 numbers, the even numbers, and “n is even” is true for the same 15 numbers, as an if-and-only-if claim requires.' }
  ]
 },
 {
  id: 'q34', title: 'Two proofs that cannot be right', topic: 'Spotting the flawed step', tier: 'Advanced', sector: 'Inquiry Office',
  brief: 'Two investigators each handed in a proof of something that cannot be true, and Mira wants the exact step where each one goes wrong.',
  lesson: 'A proof of something false always has a first wrong step, most often a division by zero, a converse used as if it were the original, or a few examples treated as every case.',
  prompt: 'Two investigators each hand in a proof, and both conclusions are false. Proof A, that 2 = 1: (1) Let a = 4 and b = 4, so a = b. (2) Multiply both sides of a = b by a: a² = ab. (3) Subtract b² from both sides: a² − b² = ab − b². (4) Factor both sides: (a + b)(a − b) = b(a − b). (5) Divide both sides by a − b: a + b = b. (6) Put in the numbers: 8 = 4, and dividing by 4 gives 2 = 1. Proof B, that every multiple of 3 is a multiple of 6: (1) Let n be a multiple of 3, so n = 3k for some whole number k. (2) Every multiple of 6 is a multiple of 3, since 6j = 3 × 2j. (3) So n, being a multiple of 3, is a multiple of 6. (4) Therefore every multiple of 3 is a multiple of 6. ∎ Enter the number of the first wrong step in proof A, then in proof B.',
  answer: [5, 3], labels: ['first wrong step in A', 'first wrong step in B'], tolerance: 0.01,
  hints: [
   'Check the steps one at a time. Is each one true for the numbers in play, and does it follow from the steps before it?',
   'Look for a division by something that may be 0, an “if … then” rule used backwards, and a conclusion drawn from a few examples.'
  ],
  solution: 'Proof A: steps 1 to 4 are sound, but step 5 divides by a − b, which is 4 − 4 = 0. Proof B: steps 1 and 2 are sound, but step 3 uses the converse of the step before it: every multiple of 6 is a multiple of 3, but not the other way round, since 3 itself is not a multiple of 6. Every step after a wrong one inherits the error, so the first wrong steps are 5 in proof A and 3 in proof B.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'The red pencil', description: 'It circles the first step that does not follow.' },
  sources: [source.l2_5w],
  teaching: {
   intuition: 'A proof is only as strong as its weakest step. A “proof” of something false must contain a step that does not follow, and the skill is to find the first one. The usual culprits are few. The first is dividing both sides by something that is actually 0: from 0 × 3 = 0 × 5 you cannot conclude 3 = 5. The second is using a converse as if it said the same thing: “if it rains, the deck is wet” does not give “if the deck is wet, it rained”. The third is treating a few checked examples as a proof about every number. Read each step and ask two questions: is this true here, and does it follow from what came before?',
   steps: [
    'Read the claim and decide whether it is false. A false conclusion guarantees a wrong step somewhere.',
    'Check the steps in order. For each one ask: is it true for the numbers in play, and does it follow from the earlier steps?',
    'Before any division, ask whether the thing divided by could be 0.',
    'When a step uses an “if … then” rule, check that it is used in the direction it was stated, not as its converse.',
    'The first step that fails a check is the flawed step. Every later step inherits the error.'
   ],
   example: {
    prompt: 'Find the first wrong step: (1) Let x = 7. (2) Then x − 7 = 0. (3) So 9(x − 7) = 2(x − 7), since both sides are 0. (4) Divide both sides by x − 7: 9 = 2.',
    steps: ['Steps 1 to 3 are true: both sides of step 3 are 0.', 'Step 4 divides by x − 7, which is 0.'],
    answer: 'Step 4 is the first wrong step.'
   },
   pitfalls: [
    'Blaming the last step. The final line is wrong because of an earlier step; look for the first failure.',
    'Trusting a division because the thing divided by has letters in it. a − b is 0 whenever a = b.',
    'Missing a converse: “if 4 divides n, then n is even” is true, but “n is even, so 4 divides n” does not follow.'
   ]
  },
  guidance: [
   { prompt: 'Proof A: which is the first step that is false or does not follow from the steps before it?', answer: [5], labels: ['first wrong step in A'], explanation: 'In proof A, steps 1 to 4 are sound, but step 5 divides by a − b, which is 4 − 4 = 0.' },
   { prompt: 'Proof B: which is the first step that is false or does not follow?', answer: [3], labels: ['first wrong step in B'], explanation: 'In proof B, steps 1 and 2 are sound, but step 3 uses the converse of the step before it: every multiple of 6 is a multiple of 3, but not the other way round, since 3 itself is not a multiple of 6.' }
  ]
 },
 {
  id: 'q35', title: 'The first step of the stair', topic: 'Induction: the base case and the domino idea', tier: 'Advanced', sector: 'Long Stair',
  brief: 'The Long Stair climbs without end, and Mira wants a claim about its lamps proved for every step, starting from the right one.',
  lesson: 'Mathematical induction proves a claim for every whole number from a base case on: show it for the first number, then show that each case gives the next.',
  prompt: 'Mira’s claim about the lamps of the Long Stair is that 2ⁿ > 3n + 4 for every whole number n from some step on. Before an induction proof can start, it needs a base case where the claim really holds. Enter the left side and the right side at n = 1, then the first whole number n at which the claim is true.',
  answer: [2, 7, 5], labels: ['left side at n = 1', 'right side at n = 1', 'first n where it holds'], tolerance: 0.01,
  hints: [
   'At n = 1 the left side is 2¹ and the right side is 3 × 1 + 4.',
   'Raise n by 1 at a time and compare the two sides. The first n where the left side is bigger is where the base case goes.'
  ],
  solution: 'n = 1: 2 against 7, false; n = 2: 4 against 10, false; n = 3: 8 against 13, false; n = 4: 16 against 16, false; n = 5: 32 against 19, true. The claim fails at n = 1, where the left side is 2 and the right side 7, so the proof cannot start there. It first holds at n = 5, so that is the base case, the first domino. The inductive step then shows that each true case makes the next one true, so the claim holds for every n from 5 on.',
  xp: 200, prereqs: ['q25'],
  artifact: { name: 'The first domino', description: 'The step where the proof can safely begin.' },
  sources: [source.l2_5],
  teaching: {
   intuition: 'Picture a line of dominoes, one for each whole number. If the first domino falls, and every falling domino knocks over the next one, then every domino falls, however long the line is. Mathematical induction proves a claim about every whole number in the same way. The base case shows the claim is true for the first number. The inductive step shows that whenever the claim is true for one number k, it is also true for k + 1. Together they cover every number from the base case on. The base case must be a number where the claim really holds: a claim can be false for small n and true from some point on, and then the proof starts at that point.',
   steps: [
    'Write the claim as a statement about n.',
    'Base case: work out both sides at n = 1 and check whether the claim is true there.',
    'If it is false, try n = 2, 3 and so on until it is true. The proof starts at the first number where it holds.',
    'Inductive step: show that if the claim holds for n = k, it also holds for n = k + 1. Then the claim holds for every n from the base case on.'
   ],
   example: {
    prompt: 'Claim: 3ⁿ > 4n + 2. Where should an induction proof start?',
    steps: ['n = 1: 3 against 6, false. n = 2: 9 against 10, false.', 'n = 3: 27 against 14, true.'],
    answer: 'The base case is n = 3.'
   },
   pitfalls: [
    'Starting at n = 1 without checking. If the claim is false there, the base case fails and the proof proves nothing.',
    'Thinking the inductive step alone is enough. Without a true base case, no domino ever falls.',
    'Multiplying instead of taking a power: 2ⁿ at n = 4 is 2 × 2 × 2 × 2 = 16, not 2 × 4 = 8.'
   ]
  },
  guidance: [
   { prompt: 'Work out both sides at n = 1. Enter the left side, then the right side.', answer: [2, 7], labels: ['left side at n = 1', 'right side at n = 1'], explanation: '2¹ = 2 and 3 × 1 + 4 = 7.' },
   { prompt: 'Is the claim true at n = 1? Enter 1 for true or 0 for false.', answer: [0], labels: ['true at n = 1 (1 or 0)'], explanation: '2 is not bigger than 7, so the claim is false at n = 1 and the base case cannot go there.' },
   { prompt: 'Try n = 2, 3 and so on. What is the first n where the left side is bigger?', answer: [5], labels: ['first n where it holds'], explanation: 'n = 1: 2 against 7, false; n = 2: 4 against 10, false; n = 3: 8 against 13, false; n = 4: 16 against 16, false; n = 5: 32 against 19, true. The first true case is n = 5.' }
  ]
 },
 {
  id: 'q36', title: 'One more step up', topic: 'The inductive step: from k to k + 1', tier: 'Advanced', sector: 'Long Stair',
  brief: 'The bottom of the Long Stair is checked, and now Mira needs the push that carries a claim from each step to the one above it.',
  lesson: 'The inductive step assumes the claim for k, the inductive hypothesis, and shows it for k + 1; for a sum, that means adding the next term.',
  prompt: 'An induction proof on the Long Stair is under way for the formula 1 + 3 + 5 + … + (2n − 1) = n². In the inductive step, the inductive hypothesis assumes the formula is true for n = k. Take k = 7. Enter the sum up to n = 7 given by the formula, then the amount added to reach n = 8, then the total at n = 8 (type them without commas).',
  answer: [49, 15, 64], labels: ['sum up to n = k', 'amount added', 'total at n = k + 1'], tolerance: 0.01,
  hints: [
   'The amount added is the next term of the sum: put n = 8 into the last term, 2n − 1.',
   'Add that term to the sum up to n = 7. The result should match the formula at n = 8; showing that it always does is the inductive step.'
  ],
  solution: 'By the formula, the sum up to n = 7 is 7² = 49. The next term, for n = 8, is 2 × 8 − 1 = 15. So the total at n = 8 is 49 + 15 = 64, and the formula at n = 8 gives 8² = 64 as well. The same algebra works for every k, k² + (2k + 1) = (k + 1)², and that is the inductive step.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'The push', description: 'The one line that carries a formula from each step to the next.' },
  sources: [source.l2_5],
  teaching: {
   intuition: 'The inductive step is the push from one domino to the next. You assume the claim is true for one number k; this assumption is called the inductive hypothesis. Then you show that the claim must also be true for k + 1. For a formula about a sum, the step is always the same move: the sum up to k + 1 is the sum up to k plus one more term. Replace the sum up to k by the formula, which the hypothesis allows, add the new term and simplify. If the result is the formula with k + 1 in place of n, the step works for every k at once.',
   steps: [
    'Write the inductive hypothesis: the formula holds for n = k.',
    'Write the sum up to k + 1 as the sum up to k plus the term for n = k + 1.',
    'Replace the sum up to k by the formula, add the new term and simplify.',
    'Check that the result is the formula with k + 1 in place of n. Trying one number for k is a quick way to catch a slip.'
   ],
   example: {
    prompt: 'For 2 + 4 + 6 + … + 2n = n(n + 1), take k = 3 and carry out the inductive step.',
    steps: ['The hypothesis gives 2 + 4 + 6 = 3 × 4 = 12.', 'The next term, for n = 4, is 2 × 4 = 8, so the total is 12 + 8 = 20.', 'The formula at n = 4 gives 4 × 5 = 20, so they agree. In general k(k + 1) + 2(k + 1) = (k + 1)(k + 2).'],
    answer: 'The amount added is 8 and the total is 20, matching the formula.'
   },
   pitfalls: [
    'Adding the term for n = k instead of n = k + 1. The step adds the new term, the one with k + 1 in it.',
    'Using the formula at k + 1 to prove itself. Only the formula at k may be assumed; the total at k + 1 must be built from it.',
    'Checking one value of k and calling that the step. The algebra must work for every k; a number check only catches slips.'
   ]
  },
  guidance: [
   { prompt: 'Use the formula at n = 7. What is the sum up to n = 7?', answer: [49], labels: ['sum up to n = k'], explanation: 'The inductive hypothesis lets us use the formula at n = 7: 7² = 49.' },
   { prompt: 'What is the term added for n = 8?', answer: [15], labels: ['amount added'], explanation: 'The last term is 2n − 1; for n = 8 it is 2 × 8 − 1 = 15.' },
   { prompt: 'Add them. What is the total at n = 8?', answer: [64], labels: ['total at n = k + 1'], explanation: '49 + 15 = 64, which matches the formula: 8² = 64.' }
  ]
 },
 {
  id: 'q37', title: 'The count at the top of the stair', topic: 'Induction for sums', tier: 'Advanced', sector: 'Long Stair',
  brief: 'The crew wants the total for a flight of the Long Stair far too long to add up by hand, and Mira has a proved formula for it.',
  lesson: 'A sum formula proved by induction holds for every n, so it gives any such sum in one calculation.',
  prompt: 'This formula has been proved by induction, so it holds for every whole number n: 1 + 3 + 5 + … + (2n − 1) = n². The crew needs the total for a flight of 40 steps. Enter the sum for n = 40 (type it without commas), then the next term of the sum, the one for n = 41.',
  answer: [1600, 81], labels: ['sum for the given n', 'next term'], tolerance: 0.01,
  hints: [
   'There is no need to add 40 terms one by one: put n = 40 into the right side of the formula.',
   'The next term is the last term of the sum, 2n − 1, with n replaced by 41.'
  ],
  solution: 'The formula holds for every n, so put n = 40 into its right side: 40² = 1600. Adding the 40 terms one by one would give the same total, only much more slowly. The next term, for n = 41, is 2 × 41 − 1 = 81.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'The stair tally', description: 'A long sum, done in one line.' },
  sources: [source.l2_5],
  teaching: {
   intuition: 'Once a formula is proved by induction, it holds for every whole number n, and that is what makes it useful: it replaces a long addition by one short calculation. Adding the first 30 odd numbers by hand takes 29 additions; the formula 1 + 3 + 5 + … + (2n − 1) = n² gives 900 at once. Each such formula is proved the same way: a base case at n = 1, where both sides equal the first term, and an inductive step, where adding the next term matches the formula one step up. To use a formula well, read it well too. The left side shows a pattern of terms, and its last term, written with n, gives any term you want.',
   steps: [
    'Read the formula: the left side adds a pattern of terms whose last term is written with n, and the right side is the total.',
    'To find a sum, put the number of terms in place of n on the right side.',
    'To find the next term, put n + 1 into the expression for the last term.',
    'Check the formula with a small n, such as n = 3, by adding the terms by hand.'
   ],
   example: {
    prompt: 'Using 1 + 2 + 3 + … + n = n(n + 1) ÷ 2, find the sum for n = 12 and the next term.',
    steps: ['The sum is 12 × 13 ÷ 2 = 78.', 'The last term is n itself, so the next term, for n = 13, is 13.'],
    answer: 'Sum 78; next term 13.'
   },
   pitfalls: [
    'Confusing the number of terms with the last term. 1 + 3 + … + 59 has 30 terms, not 59.',
    'Taking the next term to be the next total. The next term is one item of the sum, not the whole sum.',
    'Dropping the brackets: n(n + 1) ÷ 2 at n = 12 is 12 × 13 ÷ 2, not 12 × 12 + 1 ÷ 2.'
   ]
  },
  guidance: [
   { prompt: 'Put n = 40 into the right side of the formula. What is the sum?', answer: [1600], labels: ['sum for the given n'], explanation: '40² = 1600.' },
   { prompt: 'What is the term for n = 41?', answer: [81], labels: ['next term'], explanation: 'The last term is 2n − 1, so for n = 41 it is 2 × 41 − 1 = 81.' }
  ]
 },
 {
  id: 'q38', title: 'Where the climb pulls ahead', topic: 'Induction for inequalities: where it starts', tier: 'Advanced', sector: 'Long Stair',
  brief: 'Two power demands race up the Long Stair, and Mira needs the step from which one of them stays ahead for good.',
  lesson: 'An inequality that fails for small n can still hold from some N on; induction proves it with N as the base case.',
  prompt: 'Two power demands race up the Long Stair, and Mira wants to prove 2ⁿ > n² by induction. It is false for some small n. Find the smallest whole number N from which it holds for good: true at N and at every whole number after N. Enter N, then the left side at N, then the right side at N (type them without commas).',
  answer: [5, 32, 25], labels: ['N', 'left side at N', 'right side at N'], tolerance: 0.01,
  hints: [
   'Make a table of both sides for n = 1, 2, 3 and so on. Careful: the inequality may be true for a small n, fail for a while, and only then hold for good.',
   'Each step multiplies the left side by 2, while the right side grows by a factor that gets closer and closer to 1. Being ahead once is not enough: the left side stays ahead only from a point where it is ahead and the right side’s factor is below 2.'
  ],
  solution: 'n = 1: 2 against 1, true; n = 2: 4 against 4, false; n = 3: 8 against 9, false; n = 4: 16 against 16, false; n = 5: 32 against 25, true; n = 6: 64 against 36, true. It is true at n = 1, but it fails after that, so the start is later. From n = 5 on it is true: 2⁵ = 32 is more than 5² = 25. From there each step multiplies the left side by 2 and the right side by (n + 1)² ÷ n². From n = 5 on, that factor is at most 6² ÷ 5² = 36 ÷ 25, which is less than 2, and it shrinks as n grows, so the left side stays ahead; that is the inductive step, and N = 5 is the base case.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'The overtaking mark', description: 'The step where one side pulls ahead for good.' },
  sources: [source.l2_5],
  teaching: {
   intuition: 'An inequality can be false for small numbers and true for every number after some point. A power such as 2ⁿ doubles at every step, while n² or n³ grows by a factor that shrinks towards 1: from n to n + 1, n² is multiplied by (n + 1)² ÷ n². Being ahead once is not enough. 2¹ = 2 is more than 1² = 1, yet 2² = 4 only ties with 2² = 4. But from some point N on, the power is ahead and the other side’s factor has dropped below the power’s base, and from there the power stays ahead at every step, because its side is multiplied by more than the other. Induction proves this. The base case is the number N from which the inequality holds for good, and the inductive step shows that if it holds at k, multiplying the left side by its base keeps it ahead at k + 1. Finding N takes care: an inequality may hold at n = 1, fail for a while, and only then hold for good, so the start is after the last failure, not at the first true case.',
   steps: [
    'Make a table of both sides for n = 1, 2, 3 and so on.',
    'Mark each row true or false, and find the point after which every row is true.',
    'Check a few rows beyond it to see the left side pulling away.',
    'Use that point as the base case; the inductive step shows that the left side stays ahead from there.'
   ],
   example: {
    prompt: 'From which n does 3ⁿ > n³ hold for good?',
    steps: ['n = 1: 3 > 1, true. n = 2: 9 > 8, true. n = 3: 27 > 27, false, since the two sides are equal.', 'n = 4: 81 > 64, true; n = 5: 243 > 125, true, and the gap keeps widening.'],
    answer: 'It holds for good from n = 4, even though it was already true at n = 1 and n = 2.'
   },
   pitfalls: [
    'Stopping at the first true row. An inequality that is true at n = 1 can still fail later.',
    'Counting a tie as a win. “>” needs the left side strictly bigger, so 27 > 27 is false.',
    'Multiplying instead of taking a power: n³ at n = 4 is 4 × 4 × 4 = 64, not 12.'
   ]
  },
  guidance: [
   { prompt: 'Is the inequality true at n = 1? And at n = 2? Enter 1 for true or 0 for false for each.', answer: [1, 0], labels: ['true at n = 1 (1 or 0)', 'true at n = 2 (1 or 0)'], explanation: 'n = 1: 2 against 1, true; n = 2: 4 against 4, false.' },
   { prompt: 'Keep going. What is the smallest N from which the left side stays bigger at every step?', answer: [5], labels: ['N'], explanation: 'n = 1: 2 against 1, true; n = 2: 4 against 4, false; n = 3: 8 against 9, false; n = 4: 16 against 16, false; n = 5: 32 against 25, true; n = 6: 64 against 36, true. From n = 5 on, the left side stays ahead.' },
   { prompt: 'Enter both sides at n = 5: the left side, then the right side.', answer: [32, 25], labels: ['left side at N', 'right side at N'], explanation: '2⁵ = 32 and 5² = 25.' }
  ]
 },
 {
  id: 'q39', title: 'Stamps for every amount', topic: 'Strong induction: postage stamps', tier: 'Advanced', sector: 'Long Stair',
  brief: 'The relay post at the foot of the Long Stair has only two stamp values, and Mira wants to know which parcels it can always send.',
  lesson: 'Strong induction may lean on any earlier case; with two stamp values, a run of payable amounts as long as the smaller value covers every larger amount.',
  prompt: 'The relay post at the foot of the Long Stair sells only 3-credit and 5-credit stamps, and any number of each may go on a parcel. Mira wants to prove by strong induction that every amount above some point can be paid exactly. Enter the largest amount that cannot be paid. Then enter how many base cases the strong induction needs, when its step pays each larger amount by adding one 3-credit stamp to an amount already paid.',
  answer: [7, 3], labels: ['largest amount that cannot be paid', 'base cases needed'], tolerance: 0.01,
  hints: [
   'List the amounts 1, 2, 3 and so on, and mark each one that can be made from 3s and 5s. Look for a run of amounts in a row that can all be paid, as long as the smaller stamp value.',
   'Once that many amounts in a row can be paid, every larger amount can be too: take the amount one small stamp below it and add one small stamp. Each amount in that first run is a base case.'
  ],
  solution: 'The amounts that cannot be paid are 1, 2, 4 and 7. The next 3 amounts can all be paid: 8 = 3 + 5, 9 = 3 × 3 and 10 = 2 × 5. These are the base cases. Strong induction: any larger amount m is 3 more than m − 3, an amount from 8 up that can be paid by the hypothesis, so m can be paid with one more 3-credit stamp. So 7 is the largest amount that cannot be paid, and 3 base cases are needed. For two stamp values with no common factor this always comes to 3 × 5 − 3 − 5 = 7.',
  xp: 200, prereqs: ['q38'],
  artifact: { name: 'The stamp ledger', description: 'Every amount from one point on, paid exactly.' },
  sources: [source.l2_5],
  teaching: {
   intuition: 'Ordinary induction steps from k to k + 1. Strong induction may lean on any earlier case, not only the one just before. Stamps show why that helps. Suppose a post office sells only two stamp values. Some small amounts cannot be made at all. But once you can pay a run of amounts in a row as long as the smaller stamp value, every larger amount follows: to pay m, pay the amount one small stamp below m, which you already can, and add one small stamp. That argument steps back by the small stamp value, not by 1, so it needs strong induction, whose hypothesis is that every amount from the start of the run up to k can be paid. It also needs one base case for each amount in that first run, since each later amount leans on one of them.',
   steps: [
    'List the amounts 1, 2, 3 and so on, and mark those that can be made from the two stamp values.',
    'Find the first run of payable amounts as long as the smaller stamp value. The amount just before the run is the largest that cannot be paid.',
    'The amounts in that run are the base cases: as many as the smaller stamp value.',
    'Inductive step: for any larger amount m, the amount m minus the smaller stamp value can be paid by the hypothesis, so add one more small stamp.'
   ],
   example: {
    prompt: 'With 4-credit and 5-credit stamps, what is the largest amount that cannot be paid, and how many base cases does strong induction need?',
    steps: ['Payable: 4, 5, 8, 9, 10, 12, 13, 14, 15 and so on. Not payable: 1, 2, 3, 6, 7 and 11.', '12, 13, 14 and 15 are four payable amounts in a row, so every larger amount follows by adding 4-credit stamps.'],
    answer: 'The largest amount that cannot be paid is 11, and strong induction needs 4 base cases: 12, 13, 14 and 15.'
   },
   pitfalls: [
    'Stopping at the first payable amount. A run as long as the smaller stamp value is needed before every amount can be paid.',
    'Using a single base case. The step goes back by the smaller stamp value, so each amount of the first run is its own base case.',
    'Forgetting that a stamp value can be used several times: 9 = 3 + 3 + 3.'
   ]
  },
  guidance: [
   { prompt: 'List the amounts that cannot be paid. How many are there?', answer: [4], labels: ['amounts that cannot be paid'], explanation: 'They are 1, 2, 4 and 7: 4 amounts.' },
   { prompt: 'What is the largest of them?', answer: [7], labels: ['largest amount that cannot be paid'], explanation: '7 cannot be paid, and the 3 amounts after it can: 8 = 3 + 5, 9 = 3 × 3 and 10 = 2 × 5.' },
   { prompt: 'The inductive step goes back 3 credits at a time. How many amounts in a row, just above 7, must be checked as base cases?', answer: [3], labels: ['base cases needed'], explanation: 'Each larger amount leans on the one 3 below it, so each of the 3 amounts from 8 to 10 must be checked on its own.' }
  ]
 },
 {
  id: 'q40', title: 'Below every tolerance', topic: 'Realm review and bridge to Real analysis: “for every ε there is an N”', tier: 'Advanced', sector: 'Long Stair',
  brief: 'The last check in the Rules Hall looks ahead to Real analysis, and Mira wants one claim of the form “for every ε there is an N” settled with numbers.',
  lesson: 'A claim “for every ε there is an N” is proved by finding an N for any given ε; for 1 ÷ n < ε, N is the first whole number above 1 ÷ ε.',
  prompt: 'Real analysis will ask questions of the form “for every ε there is an N”. Here ε, the Greek letter epsilon, is a small positive number, and the claim is that 1 ÷ n < ε for every whole number n ≥ N. Take ε = 0.03. Enter the smallest whole number N that works. Then the formula 1 + 3 + 5 + … + (2n − 1) = n², proved by induction, gives a value for n = N: enter it (type it without commas).',
  answer: [34, 1156], labels: ['N', 'formula value at n = N'], tolerance: 0.01,
  hints: [
   '1 ÷ n < ε means the same as n > 1 ÷ ε. Work out 1 ÷ ε, then take the first whole number strictly above it.',
   'Put your N in place of n on the right side of the formula.'
  ],
  solution: '1 ÷ n < 0.03 exactly when n > 1 ÷ 0.03, which is about 33.33. The first whole number strictly above it is N = 34: 1 ÷ 34 is less than 0.03, and every larger n makes 1 ÷ n smaller still. N = 33 is not enough, since 1 ÷ 33 is more than 0.03. The formula at n = 34 gives 34² = 1156.',
  xp: 200, prereqs: ['q37', 'q39', 'q21'],
  artifact: { name: 'The tolerance gauge', description: 'Pick any tolerance; it finds the point after which every value is below it.' },
  sources: [source.l0_2, source.oc5_1],
  teaching: {
   intuition: 'Real analysis makes the idea of a limit exact with claims of the form “for every ε there is an N”. ε, the Greek letter epsilon, stands for any small positive number, a tolerance. The claim about 1 ÷ n says: however small a tolerance you choose, there is a point N in the list 1, 1 ÷ 2, 1 ÷ 3 and so on after which every value is below it. The order of the quantifiers matters: ε is chosen first, and N may depend on it, so a smaller ε needs a larger N. To find the smallest N, solve 1 ÷ n < ε for n. It means n > 1 ÷ ε, so N is the first whole number strictly above 1 ÷ ε.',
   steps: [
    'Write the condition for one n: 1 ÷ n < ε.',
    'Turn it round: since n and ε are both positive, it is the same as n > 1 ÷ ε.',
    'N is the first whole number strictly greater than 1 ÷ ε. If 1 ÷ ε is itself a whole number, N is one more than it.',
    'Check: 1 ÷ N is below ε, and 1 ÷ (N − 1) is not.'
   ],
   example: {
    prompt: 'For ε = 0.08, find the smallest N with 1 ÷ n < ε for every whole number n ≥ N.',
    steps: ['1 ÷ 0.08 = 12.5.', 'The first whole number above 12.5 is 13: 1 ÷ 13 is about 0.077, below 0.08, while 1 ÷ 12 is about 0.083.'],
    answer: 'N = 13.'
   },
   pitfalls: [
    'Taking N = 1 ÷ ε when that is a whole number. For ε = 0.05, 1 ÷ 20 equals 0.05, which is not less than 0.05, so N = 21.',
    'Rounding 1 ÷ ε to the nearest whole number instead of going up. For ε = 0.07, 1 ÷ ε is about 14.29, so N is 15, not 14.',
    'Choosing N before ε. N depends on ε, so it is found after ε is given.'
   ]
  },
  guidance: [
   { prompt: 'What is 1 ÷ 0.03? If it is not a whole number, enter its whole-number part.', answer: [33], labels: ['whole-number part of 1 ÷ ε'], explanation: '1 ÷ 0.03 is about 33.33, so its whole-number part is 33.' },
   { prompt: 'What is the smallest whole number N with 1 ÷ N < 0.03?', answer: [34], labels: ['N'], explanation: 'N must be strictly above 1 ÷ 0.03, so N = 34. At n = 33, 1 ÷ n is still more than 0.03.' },
   { prompt: 'Put n = 34 into the right side of 1 + 3 + 5 + … + (2n − 1) = n². What is the value?', answer: [1156], labels: ['formula value at n = N'], explanation: '34² = 1156.' }
  ]
 }
);
})();
