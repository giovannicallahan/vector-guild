/* Abstract algebra: patterns of moves missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/abstract/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · Adding on a clock: Z_n [3.1]
     q02  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · Multiplying on a clock [3.1]
     q03  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · Binary operations and operation tables [3.1, 3.2]
     q04  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · Identity and inverses [3.2]
     q05  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · The group rules [3.2]
     q06  ch 1 Clock arithmetic and groups · Basic, 100 XP · sector 'Lock Workshop' · Units and U(n) [3.2, 2.2]
     q07  ch 2 Order and cycles · Basic, 100 XP · sector 'Beacon Tower' · Order of an element in Z_n [4.1]
     q08  ch 2 Order and cycles · Basic, 100 XP · sector 'Beacon Tower' · Order of an element in U(n) [4.1]
     q09  ch 2 Order and cycles · Basic, 100 XP · sector 'Beacon Tower' · Cyclic groups and generators [4.1]
     q10  ch 2 Order and cycles · Basic, 100 XP · sector 'Beacon Tower' · Large powers through the order [4.1, 4.3] */
(function(){
'use strict';
/* Thomas W. Judson, Abstract Algebra: Theory and Applications (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Judson, Abstract Algebra/ (Judson, Abstract Algebra).
   A title reads like: Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s2_2: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 2.2 The Division Algorithm", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/02%3A_The_Integers/2.02%3A_The_Division_Algorithm", description: "The division algorithm, the greatest common divisor, relatively prime numbers and the Euclidean algorithm.", verified: '2026-11-28' },
 s3_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 3.1 Integer Equivalence Classes and Symmetries", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/03%3A_Groups/3.07%3A_Integer_Equivalence_Classes_and_Symmetries", description: "The integers mod n, Z_n, with addition and multiplication mod n.", verified: '2026-11-28' },
 s3_2: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 3.2 Definitions and Examples", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/03%3A_Groups/3.08%3A_Definitions_and_Examples", description: "Binary operations, the definition of a group, abelian groups, Cayley tables, the group of units U(n) and the order of a group.", verified: '2026-11-28' },
 s4_1: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/04%3A_Cyclic_Groups/4.01%3A_Cyclic_Subgroups", description: "Cyclic subgroups, generators, the order of an element, and which elements generate Z_n.", verified: '2026-11-28' },
 s4_3: { title: "Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.3 The Method of Repeated Squares", url: "https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/04%3A_Cyclic_Groups/4.03%3A_The_Method_of_Repeated_Squares", description: "Computing large powers mod n by repeated squaring.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01", title: "The dial that comes back round", topic: "Adding on a clock: Z_n", tier: "Basic", sector: "Lock Workshop",
  brief: "The first combination dial is on the bench, and the crew wants to know where it stops after a run of turns forward and back.",
  lesson: "On a dial of n positions, a number of steps lands on its remainder on division by n, written mod n; negative steps go backwards.",
  prompt: "A combination dial in the Lock Workshop has 17 positions, numbered 0 to 16, and it counts round like a clock: one step on from 16 is 0 again. Starting from 0, a technician turns it 23 steps forward and then 41 steps forward. Enter where it ends, (23 + 41) mod 17. In a second test she turns it 23 steps forward from 0 and then 41 steps back. Enter where it ends, (23 − 41) mod 17.",
  answer: [13,16], labels: ["(a + b) mod n","(a − b) mod n"], tolerance: 0.01,
  hints: [
   "Add first, then divide by the number of positions. The position is the remainder, which always lies from 0 up to one less than the number of positions.",
   "A step back is a step of −1. If the difference is negative, add the number of positions, as many times as needed, until the result lies from 0 up to one less than the number of positions."
  ],
  solution: "23 + 41 = 64, and 64 = 3 × 17 + 13, so (23 + 41) mod 17 = 13. 23 − 41 = −18. It is negative, so add 17 until the result lies from 0 to 16: −18 + 2 × 17 = −18 + 34 = 16. So (23 − 41) mod 17 = 16.",
  xp: 100, prereqs: [],
  artifact: { name: "First dial ring", description: "A brass ring with its positions stamped 0 upwards, which always comes back round to 0." },
  sources: [source.s3_1],
  teaching: {
   intuition: "A clock face forgets whole turns. Twelve hours after 9 o’clock it is 9 o’clock again, so 9 + 8 hours lands on 5, not 17. A combination dial with n positions, numbered 0 to n − 1, works the same way: only the remainder left after taking away whole turns of n matters. The remainder of a number on division by n is what is left when you take away as many n’s as you can, so it always lies from 0 to n − 1. We write it with mod: 17 mod 12 = 5, read “17 mod 12”. The n is called the modulus. Counting this way is called clock arithmetic, or modular arithmetic, and the numbers 0, 1, …, n − 1 with this adding are called Z_n. Steps backwards are negative steps: 3 − 7 = −4, and adding one whole turn of 12 gives 8, so 3 − 7 lands on 8.",
   steps: [
    "Add or subtract the numbers as usual, counting steps back as negative.",
    "If the result is 0 or more, divide it by the modulus n and keep the remainder: write the result as a whole number of n’s plus a remainder from 0 to n − 1.",
    "If the result is negative, add n as many times as needed until it lies from 0 to n − 1.",
    "That remainder is the position on the dial, the answer mod n."
   ],
   example: {
    prompt: "On a 12-hour clock dial numbered 0 to 11, where does 9 + 8 land, and where does 3 − 7 land?",
    steps: [
     "9 + 8 = 17, and 17 = 1 × 12 + 5, so (9 + 8) mod 12 = 5.",
     "3 − 7 = −4. It is negative, so add 12: −4 + 12 = 8. So (3 − 7) mod 12 = 8."
    ],
    answer: "5, then 8."
   },
   pitfalls: [
    "Giving a negative answer for a difference. On the dial every position lies from 0 to n − 1, so −18 mod 17 is 16, not −1 or −18.",
    "Typing the number of whole turns instead of the remainder. In 64 = 3 × 17 + 13 the position is 13, not 3.",
    "Using n itself as a position. A dial of 17 positions has no position 17: one step on from 16 is 0."
   ]
  },
  guidance: [
   { prompt: "How many steps forward does the dial turn in all in the first test? What is 23 + 41?", answer: [64], labels: ["sum of the steps"], explanation: "23 + 41 = 64 steps forward from 0." },
   { prompt: "Every 17 steps bring the dial back to 0. What is the remainder when 64 is divided by 17?", answer: [13], labels: ["position"], explanation: "64 = 3 × 17 + 13. The full turns of 17 steps change nothing, so the dial ends at 13." },
   { prompt: "In the second test the steps back count as negative. What is 23 − 41?", answer: [-18], labels: ["difference of the steps"], explanation: "23 − 41 = −18." },
   { prompt: "What is −18 mod 17, the position from 0 to 16 where the dial ends?", answer: [16], labels: ["position"], explanation: "−18 is negative, so add 17 until the result lies from 0 to 16: −18 + 2 × 17 = −18 + 34 = 16. The dial ends at 16." }
  ]
 },
 {
  id: "q02", title: "The ratchet that clicks round", topic: "Multiplying on a clock", tier: "Basic", sector: "Lock Workshop",
  brief: "A ratchet moves a dial the same number of steps on every click, and the crew needs to know where it stops after many clicks.",
  lesson: "Multiplying mod n is repeated adding mod n, and each number may be replaced by its remainder before you multiply.",
  prompt: "A ratchet on a 19-position dial, numbered 0 to 18, moves it 27 steps forward with every click. Starting from 0, enter where the dial is after 12 clicks, (27 × 12) mod 19. Then enter where it is after 27 clicks, 27² mod 19.",
  answer: [1,7], labels: ["(a × b) mod n","a² mod n"], tolerance: 0.01,
  hints: [
   "Each click adds the same number of steps, so the clicks multiply. You may first replace each number by its remainder: the final position does not change, and the numbers stay small.",
   "After multiplying the remainders, divide the product by the number of positions and keep the remainder."
  ],
  solution: "First the remainders: 27 = 1 × 19 + 8, so 27 mod 19 = 8. Then 8 × 12 = 96, and 96 = 5 × 19 + 1, so (27 × 12) mod 19 = 1. For the square, 8 × 8 = 64, and 64 = 3 × 19 + 7, so 27² mod 19 = 7.",
  xp: 100, prereqs: ["q01"],
  artifact: { name: "Ratchet pawl", description: "A toothed pawl that pushes the dial round by the same step on every click." },
  sources: [source.s3_1],
  teaching: {
   intuition: "A ratchet that moves a dial 13 steps on every click, for 6 clicks, moves it 13 × 6 = 78 steps, so multiplying mod n is just adding the same step many times. On a dial of 10 positions a step of 13 does exactly what a step of 3 does, because the extra 10 is one whole turn. So you may replace each number by its remainder before multiplying: (13 × 6) mod 10 is the same as (3 × 6) mod 10 = 18 mod 10 = 8. This keeps the numbers small. The square a² mod n works the same way: reduce a first, multiply it by itself, and reduce again. The remainder from 0 to n − 1 that a number leaves is called its least residue; every answer on a dial is typed as one.",
   steps: [
    "Replace each number by its remainder mod n.",
    "Multiply the two remainders.",
    "Take the remainder of that product mod n. This is the same as the remainder of the original product."
   ],
   example: {
    prompt: "A ratchet moves a 10-position dial 13 steps per click. Where is it after 6 clicks, and after 13 clicks?",
    steps: [
     "13 mod 10 = 3, so each click acts like 3 steps.",
     "After 6 clicks: 3 × 6 = 18, and 18 mod 10 = 8.",
     "After 13 clicks: 3 × 3 = 9, and 9 mod 10 = 9, so 13² mod 10 = 9."
    ],
    answer: "8, then 9."
   },
   pitfalls: [
    "Reducing only one of the numbers and then forgetting to reduce the product. The product of two remainders can still be bigger than n.",
    "Typing the full product, such as 324, instead of its remainder. The dial only shows a position from 0 to n − 1.",
    "Squaring the remainder of a² instead of a. Reduce a first, then square, then reduce again."
   ]
  },
  guidance: [
   { prompt: "Full turns of 19 steps change nothing. What is 27 mod 19?", answer: [8], labels: ["a mod n"], explanation: "27 = 1 × 19 + 8, so each click moves the dial as if it were 8 steps." },
   { prompt: "What is 12 mod 19?", answer: [12], labels: ["b mod n"], explanation: "12 is already below 19, so it stays 12." },
   { prompt: "Multiply the remainders and take the remainder again. What is (8 × 12) mod 19?", answer: [1], labels: ["(a × b) mod n"], explanation: "8 × 12 = 96, and 96 = 5 × 19 + 1. This is also (27 × 12) mod 19." },
   { prompt: "Now the square. What is (8 × 8) mod 19?", answer: [7], labels: ["a² mod n"], explanation: "8 × 8 = 64, and 64 = 3 × 19 + 7. So 27² mod 19 = 7." }
  ]
 },
 {
  id: "q03", title: "The table of linked dials", topic: "Binary operations and operation tables", tier: "Basic", sector: "Lock Workshop",
  brief: "Two dials are being linked by a new rule, and the crew wants a table that shows the result of every pair of settings.",
  lesson: "A binary operation combines any two elements of a set into one; its operation table lists the result for every row and column.",
  prompt: "The Lock Workshop links two dials of 7 positions, 0 to 6, with a new rule: x ∗ y = (x + y + 3) mod 7. The crew is filling in its operation table, where the entry in row x and column y is x ∗ y. Enter the entry in row 5, column 4, then the entry in row 2, column 6.",
  answer: [5,4], labels: ["first entry","second entry"], tolerance: 0.01,
  hints: [
   "The entry in row x and column y is x ∗ y: put the row number in for x and the column number in for y.",
   "Add the row number, the column number and the fixed extra amount, then take the remainder on division by the number of positions."
  ],
  solution: "Row 5, column 4: 5 ∗ 4 = (5 + 4 + 3) mod 7 = 12 mod 7, and 12 = 1 × 7 + 5, so the entry is 5. Row 2, column 6: 2 ∗ 6 = (2 + 6 + 3) mod 7 = 11 mod 7, and 11 = 1 × 7 + 4, so the entry is 4.",
  xp: 100, prereqs: ["q01"],
  artifact: { name: "Linkage chart", description: "A grid on the workshop wall with one cell for every pair of settings." },
  sources: [source.s3_1, source.s3_2],
  teaching: {
   intuition: "Adding mod n is one way to combine two settings into a third, but the workshop can invent others. Any rule that takes two elements of a set, in order, and gives back one element of the same set is called a binary operation. We often write it with a star: x ∗ y. One example on the settings 0 to 4 is x ∗ y = (x + y + 2) mod 5: add the two settings, add 2 more, and take the remainder. Because the set is small, every result can be written in a grid called an operation table, or Cayley table. It has one row and one column for each element, and the entry in row x and column y is x ∗ y. With this rule, 3 ∗ 4 = 9 mod 5 = 4. The order of the two inputs can matter for some operations, such as x − y, so always put the row first.",
   steps: [
    "Read the row number as x and the column number as y.",
    "Put them into the rule for x ∗ y, adding any fixed extra amount the rule asks for.",
    "Take the remainder mod n: that is the entry of the table."
   ],
   example: {
    prompt: "For x ∗ y = (x + y + 2) mod 5 on the settings 0 to 4, what is the entry in row 3, column 4, and the whole of row 0?",
    steps: [
     "Row 3, column 4: 3 + 4 + 2 = 9, and 9 mod 5 = 4.",
     "Row 0: 0 ∗ 0 = 2, 0 ∗ 1 = 3, 0 ∗ 2 = 4, 0 ∗ 3 = 5 mod 5 = 0, 0 ∗ 4 = 6 mod 5 = 1."
    ],
    answer: "Row 3, column 4 holds 4; row 0 reads 2, 3, 4, 0, 1."
   },
   pitfalls: [
    "Forgetting the fixed extra amount in the rule and simply adding the row and the column.",
    "Swapping the row and the column. It does not matter for this rule, but it does for rules such as x − y.",
    "Leaving a result of n or more in the table. Every entry must be a setting from 0 to n − 1."
   ]
  },
  guidance: [
   { prompt: "For row 5, column 4, add before taking the remainder. What is 5 + 4 + 3?", answer: [12], labels: ["x + y + k"], explanation: "5 + 4 + 3 = 12." },
   { prompt: "What is 12 mod 7, the entry in row 5, column 4?", answer: [5], labels: ["first entry"], explanation: "12 = 1 × 7 + 5, so 5 ∗ 4 = 5." },
   { prompt: "Now row 2, column 6. What is 2 ∗ 6 = (2 + 6 + 3) mod 7?", answer: [4], labels: ["second entry"], explanation: "2 + 6 + 3 = 11, and 11 = 1 × 7 + 4, so the entry is 4." }
  ]
 },
 {
  id: "q04", title: "The setting that changes nothing", topic: "Identity and inverses", tier: "Basic", sector: "Lock Workshop",
  brief: "Every linked lock needs a neutral setting and a way to undo each move, and the crew wants both for the new linkage.",
  lesson: "An identity element e leaves everything unchanged, and the inverse of a is the element that combines with a to give e.",
  prompt: "A pair of linked dials in the Lock Workshop combine two settings from 0 to 8 by the rule x ∗ y = (x + y + 4) mod 9. Enter the identity element e of ∗, the setting with e ∗ x = x and x ∗ e = x for every x. Then enter the inverse of 3: the setting b with 3 ∗ b = e.",
  answer: [5,7], labels: ["identity e","inverse"], tolerance: 0.01,
  hints: [
   "For e ∗ x to come back to x, the amount e adds, together with the fixed extra amount, must make a whole number of full turns.",
   "For the inverse of a, the setting b must make (a + b + the extra amount) leave the remainder e. Subtract, then bring the result into the range of the dial."
  ],
  solution: "e ∗ x = (e + x + 4) mod 9 equals x for every x only when e + 4 is a whole number of turns of 9. With e from 0 to 8 that means e + 4 = 9, so e = 5. Check: 5 ∗ 1 = (5 + 1 + 4) mod 9 = 10 mod 9 = 1. For the inverse, 3 ∗ b = (3 + b + 4) mod 9 must be 5, so b = (5 − 7) mod 9 = −2 mod 9 = 7. Check: 3 ∗ 7 = (3 + 7 + 4) mod 9 = 14 mod 9 = 5.",
  xp: 100, prereqs: ["q03"],
  artifact: { name: "Neutral notch", description: "A notch filed on the linked dials to mark the setting that changes nothing." },
  sources: [source.s3_2],
  teaching: {
   intuition: "With ordinary adding, 0 is special: adding 0 changes nothing. For any binary operation ∗ we look for a setting that behaves the same way. An identity element e is one with e ∗ x = x and x ∗ e = x for every x. For x ∗ y = (x + y + 1) mod 6, the identity is not 0: 0 ∗ 2 = 3. Instead e must cancel the extra 1, so e + 1 must be a whole turn of 6, which gives e = 5, and indeed 5 ∗ 2 = 8 mod 6 = 2. Once there is an identity, each move may have an undo move. The inverse of a is the element b with a ∗ b = e and b ∗ a = e: doing a and then b leaves you where the identity does. For the same rule, the inverse of 4 is the b with (4 + b + 1) mod 6 = 5, which is b = 0.",
   steps: [
    "Write e ∗ x = x with the rule and see what e must add: for (x + y + k) mod n, e + k must be a whole number of turns of n.",
    "Pick the e from 0 to n − 1 that does this, and check it with one value of x.",
    "For the inverse of a, write a ∗ b = e with the rule and solve for b: b = (e − a − k) mod n.",
    "Check that a ∗ b really gives e."
   ],
   example: {
    prompt: "For x ∗ y = (x + y + 1) mod 6 on the settings 0 to 5, find the identity element and the inverse of 4.",
    steps: [
     "e + 1 must be 6, so e = 5. Check: 5 ∗ 2 = 8 mod 6 = 2.",
     "The inverse b of 4 needs (4 + b + 1) mod 6 = 5, so b = (5 − 5) mod 6 = 0. Check: 4 ∗ 0 = 5."
    ],
    answer: "Identity 5; the inverse of 4 is 0."
   },
   pitfalls: [
    "Assuming the identity is 0 because it is for plain adding. Test it: with an extra amount in the rule, 0 ∗ x is not x.",
    "Making a ∗ b equal 0 instead of e when finding an inverse. The inverse brings you to the identity, whatever it is.",
    "Leaving a negative result such as −2 instead of bringing it into the range 0 to n − 1."
   ]
  },
  guidance: [
   { prompt: "e ∗ x = x for every x means e + 4 is a whole number of turns of 9. Which multiple of 9 lies from 4 to 12?", answer: [9], labels: ["multiple of n"], explanation: "The only multiple of 9 in that range is 9 itself, so e + 4 = 9." },
   { prompt: "So what is the identity element e?", answer: [5], labels: ["identity e"], explanation: "e = 9 − 4 = 5. Check: 5 ∗ 1 = 10 mod 9 = 1." },
   { prompt: "The inverse b of 3 needs (3 + b + 4) mod 9 = 5. What is b = (5 − 7) mod 9?", answer: [7], labels: ["inverse"], explanation: "5 − 7 = −2, and −2 mod 9 = 7. Check: 3 ∗ 7 = 14 mod 9 = 5." }
  ]
 },
 {
  id: "q05", title: "Checking the rules of a group", topic: "The group rules", tier: "Basic", sector: "Lock Workshop",
  brief: "Before a multiplying dial is fitted to a vault, the crew must check that it obeys every rule a safe lock needs.",
  lesson: "A group is a set with a binary operation that is closed and associative, has an identity element, and gives every element an inverse.",
  prompt: "The Lock Workshop tests a dial whose settings are the numbers 1 to 14, combined by multiplying mod 15; the setting 0 is not part of it. First enter (4 × 7) mod 15. Then check the group rules for this set and this operation: enter 1 if the set is closed, 0 if not; 1 if it has an identity element, 0 if not; 1 if every element has an inverse, 0 if not.",
  answer: [13,0,1,0], labels: ["product","closed (1 or 0)","identity (1 or 0)","inverses (1 or 0)"], tolerance: 0.01,
  hints: [
   "Closed means every product lands back in the set. Look for two settings whose product is a whole number of turns of the dial: its remainder is 0, which is not in the set.",
   "Multiplying by 1 changes nothing. For inverses: if the dial size is a product d × q with d at least 2, then every product d × x minus whole turns is still a multiple of d, so it can never leave the remainder 1."
  ],
  solution: "4 × 7 = 28, and 28 = 1 × 15 + 13, so the product is 13. 15 = 3 × 5, and both 3 and 5 are settings, but (3 × 5) mod 15 = 0, which is not in the set: it is not closed (0). 1 × x = x for every x, so 1 is the identity element (1). Every product 3 × x is a multiple of 3, and so is 15, so its remainder is a multiple of 3 and never 1: 3 has no inverse (0).",
  xp: 100, prereqs: ["q02","q04"],
  artifact: { name: "Group rule card", description: "A card with four boxes to tick: closed, associative, identity, inverses." },
  sources: [source.s3_2],
  teaching: {
   intuition: "The dials we trust share four rules, and any set with a binary operation that obeys all four is called a group. First, the set is closed: combining two elements always gives an element of the same set. Second, the operation is associative: (x ∗ y) ∗ z = x ∗ (y ∗ z), so a chain of moves can be grouped either way. Third, there is an identity element. Fourth, every element has an inverse. Adding mod n on 0 to n − 1 passes all four, so Z_n is a group. If also x ∗ y = y ∗ x for all x and y, the group is called abelian; Z_n is abelian. Now try multiplying mod 6 on the settings 1 to 5. Multiplying is associative, and 1 is an identity, but 2 × 3 = 6 leaves 0, which is not in the set, so the set is not closed. And 2 has no inverse: 2 × x always leaves an even remainder, never 1. When n is prime no product of two settings is a multiple of n, so the problem disappears.",
   steps: [
    "Closed: look for two elements whose combination falls outside the set. For multiplying mod n on 1 to n − 1, any n = d × q with d and q from 2 to n − 1 gives remainder 0.",
    "Associative: multiplying, like adding, gives the same result however a chain is grouped, so this rule holds here.",
    "Identity: find the element that changes nothing; for multiplying it is 1.",
    "Inverses: for each element a, look for b with (a × b) mod n = 1. If n = d × q with d at least 2, then d has none.",
    "The set is a group only if all four rules hold."
   ],
   example: {
    prompt: "Check the rules for the settings 1 to 5 multiplied mod 6.",
    steps: [
     "6 = 2 × 3, and (2 × 3) mod 6 = 0, which is not a setting: not closed.",
     "1 × x = x, so 1 is the identity.",
     "2 × x is even, and an even number minus whole turns of 6 is still even, so it never leaves 1: 2 has no inverse."
    ],
    answer: "Not closed, identity 1, not every element has an inverse: not a group."
   },
   pitfalls: [
    "Treating 0 as a setting. Here the set is 1 to n − 1 only, so a product that leaves 0 has left the set.",
    "Deciding that there is no identity because some rule fails. Each rule is checked on its own; 1 is the identity for multiplying either way.",
    "Thinking every element lacks an inverse when n is not prime. Some elements, such as n − 1, still have one; the rule fails if even one element has none."
   ]
  },
  guidance: [
   { prompt: "What is (4 × 7) mod 15?", answer: [13], labels: ["product"], explanation: "4 × 7 = 28, and 28 = 1 × 15 + 13." },
   { prompt: "15 = 3 × 5. What is (3 × 5) mod 15?", answer: [0], labels: ["remainder"], explanation: "3 × 5 = 15, exactly one full turn, so the remainder is 0, and 0 is not one of the settings." },
   { prompt: "So is the set closed? Enter 1 for yes, 0 for no.", answer: [0], labels: ["closed (1 or 0)"], explanation: "No: 3 and 5 are in the set but their product is not." },
   { prompt: "Does every element have an inverse? Enter 1 for yes, 0 for no.", answer: [0], labels: ["inverses (1 or 0)"], explanation: "No: every product 3 × x leaves a multiple of 3, never 1, so 3 has no inverse." }
  ]
 },
 {
  id: "q06", title: "The settings that can be undone", topic: "Units and U(n)", tier: "Basic", sector: "Lock Workshop",
  brief: "A multiplying vault dial is only safe on settings that can be undone, and the crew wants to know how many there are and how to undo one.",
  lesson: "The units mod n are the numbers coprime to n; under multiplying mod n they form the group U(n), and each has an inverse.",
  prompt: "A vault dial with settings 0 to 19 combines them by multiplying mod 20. Only the settings coprime to 20 can be undone, and they form the group U(20). Enter |U(20)|, the number of elements of U(20). Then enter the inverse of 7 in U(20): the setting b with (7 × b) mod 20 = 1.",
  answer: [8,3], labels: ["|U(n)|","inverse"], tolerance: 0.01,
  hints: [
   "Go through the numbers from 1 to one less than the dial size and keep those whose greatest common divisor with the dial size is 1. Count them.",
   "To find an inverse, multiply the setting by each element of the group in turn until the product leaves remainder 1 on division by the dial size."
  ],
  solution: "A number from 1 to 19 is in U(20) when its gcd with 20 is 1. Those numbers are 1, 3, 7, 9, 11, 13, 17, 19, so |U(20)| = 8. For the inverse of 7: 7 × 3 = 21, and 21 = 1 × 20 + 1, so the inverse of 7 is 3.",
  xp: 100, prereqs: ["q05"],
  artifact: { name: "Unit key ring", description: "A ring holding one key for every setting of the dial that can be undone." },
  sources: [source.s3_2, source.s2_2],
  teaching: {
   intuition: "Multiplying mod n fails to be a group when n is not prime, but part of the set can be saved. The greatest common divisor of two whole numbers, written gcd, is the largest number that divides both: gcd(8, 20) = 4. Euclid’s algorithm finds it without listing divisors: divide the larger by the smaller, keep the remainder, and repeat with the smaller number and that remainder until the remainder is 0. For 20 and 8: 20 = 2 × 8 + 4, then 8 = 2 × 4 + 0, so the gcd is the last remainder that is not 0, which is 4. Two numbers are coprime when their gcd is 1. A number a from 1 to n − 1 has an inverse mod n exactly when it is coprime to n; such a number is called a unit. The units mod n, multiplied mod n, form a group: the group of units, U(n). The number of elements of a group G is called the order of a group and written |G|. For example U(9) = {1, 2, 4, 5, 7, 8}, so |U(9)| = 6, and the inverse of 2 is 5 because 2 × 5 = 10 leaves 1.",
   steps: [
    "List the numbers from 1 to n − 1 and keep those with gcd 1 with n, using Euclid’s algorithm when it is not obvious.",
    "Count them: that count is |U(n)|.",
    "To find the inverse of a unit a, multiply a by each element of U(n) in turn until the product leaves remainder 1.",
    "Check the product: a × b = a whole number of n’s plus 1."
   ],
   example: {
    prompt: "Find |U(9)| and the inverse of 2 in U(9).",
    steps: [
     "3 and 6 share the factor 3 with 9, and every other number from 1 to 8 is coprime to 9: U(9) = {1, 2, 4, 5, 7, 8}.",
     "So |U(9)| = 6.",
     "2 × 5 = 10 = 1 × 9 + 1, so the inverse of 2 is 5."
    ],
    answer: "|U(9)| = 6; the inverse of 2 is 5."
   },
   pitfalls: [
    "Counting 0 or n as elements. U(n) only holds numbers from 1 to n − 1.",
    "Keeping a number because it is prime. 5 is prime but not coprime to 20, since gcd(5, 20) = 5.",
    "Stopping Euclid’s algorithm one line early. The gcd is the last remainder that is not 0, not the last divisor used."
   ]
  },
  guidance: [
   { prompt: "Is 18 in U(20)? Use Euclid's algorithm: what is gcd(20, 18)?", answer: [2], labels: ["gcd"], explanation: "20 = 1 × 18 + 2, 18 = 9 × 2 + 0. The last remainder that is not 0 is 2, so gcd(20, 18) = 2, not 1, and 18 is not in U(20)." },
   { prompt: "How many of the numbers from 1 to 19 have gcd 1 with 20? That is |U(20)|.", answer: [8], labels: ["|U(n)|"], explanation: "They are 1, 3, 7, 9, 11, 13, 17, 19: 8 numbers." },
   { prompt: "Which element b of U(20) gives (7 × b) mod 20 = 1?", answer: [3], labels: ["inverse"], explanation: "7 × 3 = 21, and 21 = 1 × 20 + 1. So b = 3." }
  ]
 },
 {
  id: "q07", title: "The pulse that comes home", topic: "Order of an element in Z_n", tier: "Basic", sector: "Beacon Tower",
  brief: "A ring of lamps on the Beacon Tower passes a pulse round in jumps, and the crew wants to know how many beats it takes to come home.",
  lesson: "The order of a in Z_n is the smallest number of a’s that add to a whole number of turns, and it equals n ÷ gcd(a, n).",
  prompt: "A ring of 24 lamps on the Beacon Tower is numbered 0 to 23. A light pulse starts at lamp 0 and jumps 18 lamps round the ring on every beat, so after k beats it is at (k × 18) mod 24. In Z_24 this asks for the order of 18. Enter gcd(18, 24), then the order of 18: the smallest number of beats, at least 1, that brings the pulse back to lamp 0.",
  answer: [6,4], labels: ["gcd(a, n)","order of a"], tolerance: 0.01,
  hints: [
   "The greatest common divisor is the largest number that divides both. Euclid's algorithm finds it: divide, keep the remainder, and repeat until the remainder is 0.",
   "The order of a in Z_n is n ÷ gcd(a, n): after that many jumps the pulse has gone a whole number of times round the ring, and not before."
  ],
  solution: "24 = 1 × 18 + 6, 18 = 3 × 6 + 0, so gcd(18, 24) = 6. Write 18 = 6 × 3 and 24 = 6 × 4. After k beats the pulse is home when k × 18 is a multiple of 24, that is when k × 3 is a multiple of 4. 3 and 4 share no factor, so k itself must be a multiple of 4. The order of 18 is 24 ÷ 6 = 4. Check: 4 × 18 = 72 = 3 × 24, a whole number of times round.",
  xp: 100, prereqs: ["q01","q06"],
  artifact: { name: "Beat counter", description: "A dial on the tower that counts beats until the pulse is home." },
  sources: [source.s4_1],
  teaching: {
   intuition: "In a group, repeating one element over and over must sooner or later bring you back to the identity, because there are only finitely many elements. The order of an element a is the smallest number of repeats, at least 1, that gives the identity. In Z_n the operation is adding and the identity is 0, so the order of a is the smallest k with k × a mod n = 0. Picture a ring of 12 lamps and a pulse that jumps 8 lamps per beat: it visits 0, 8, 4 and then 0 again, so the order of 8 in Z_12 is 3. There is a rule that saves the counting. Let g = gcd(a, n). Then a = g × a′ and n = g × n′, where a′ and n′ share no factor. The pulse is home when k × a′ is a multiple of n′, and since a′ shares nothing with n′, that first happens at k = n′. So the order of a is n ÷ gcd(a, n). For 8 in Z_12 that is 12 ÷ 4 = 3.",
   steps: [
    "Find g = gcd(a, n) with Euclid’s algorithm.",
    "Divide: the order of a in Z_n is n ÷ g.",
    "Check: order × a is a whole number of turns of n, so it leaves 0 mod n."
   ],
   example: {
    prompt: "A pulse jumps 8 lamps per beat round a ring of 12. What is the order of 8 in Z_12?",
    steps: [
     "12 = 1 × 8 + 4, 8 = 2 × 4 + 0, so gcd(8, 12) = 4.",
     "The order is 12 ÷ 4 = 3.",
     "Check: 3 × 8 = 24 = 2 × 12, two whole turns."
    ],
    answer: "The order of 8 is 3."
   },
   pitfalls: [
    "Giving the gcd as the order. The gcd tells you how far apart the lit lamps are; the order is the number of lamps visited, n ÷ gcd.",
    "Counting the start as a beat. The order counts jumps, and it is at least 1.",
    "Using the size of the jump as the answer: the order of 18 in Z_24 is not 18."
   ]
  },
  guidance: [
   { prompt: "What is gcd(18, 24)?", answer: [6], labels: ["gcd"], explanation: "24 = 1 × 18 + 6, 18 = 3 × 6 + 0. The last remainder that is not 0 is 6." },
   { prompt: "The order is 24 ÷ gcd(18, 24). What is it?", answer: [4], labels: ["order"], explanation: "24 ÷ 6 = 4 beats." },
   { prompt: "Check: after 4 beats the pulse has jumped 4 × 18 = 72 lamps. What is 72 mod 24?", answer: [0], labels: ["lamp reached"], explanation: "72 = 3 × 24 + 0, so the pulse is back at lamp 0." }
  ]
 },
 {
  id: "q08", title: "The beacon code that repeats", topic: "Order of an element in U(n)", tier: "Basic", sector: "Beacon Tower",
  brief: "A beacon multiplies its code on every beat, and the crew needs to know after how many beats the code is back to where it started.",
  lesson: "In U(n) the order of a is the smallest k with aᵏ mod n = 1, found from a table of powers.",
  prompt: "A beacon on the Beacon Tower stores a code from U(13). On every beat its code is multiplied by 5, mod 13, so after k beats it has been multiplied by 5ᵏ mod 13. Enter 5² mod 13 and 5³ mod 13. Then enter the order of 5 in U(13): the smallest k, at least 1, with 5ᵏ mod 13 = 1.",
  answer: [12,8,4], labels: ["a² mod n","a³ mod n","order of a"], tolerance: 0.01,
  hints: [
   "Make a table of powers. Each power is the one before it multiplied by the element, then reduced mod the modulus: you never need the full power.",
   "Keep going until the table reaches 1. The number of the power where 1 first appears is the order."
  ],
  solution: "Mod 13: 5¹ = 5; 5² = 5 × 5 = 25, which leaves 12; 5³ = 12 × 5 = 60, which leaves 8; 5⁴ = 8 × 5 = 40, which leaves 1. The first power to reach 1 is 5⁴, so the order of 5 in U(13) is 4.",
  xp: 100, prereqs: ["q06","q07"],
  artifact: { name: "Table of powers", description: "A strip of paper with each power of the code written below the last." },
  sources: [source.s4_1],
  teaching: {
   intuition: "In U(n) the operation is multiplying mod n and the identity is 1. Repeating an element a means multiplying by it again and again, so we write the result as a power: aᵏ is a multiplied by itself k times, mod n, and a⁰ is the identity 1. The order of a in U(n) is then the smallest k, at least 1, with aᵏ mod n = 1. You never need the huge number aᵏ itself. Each power is the one before it times a, reduced mod n, so a short table does the job. In U(7), the powers of 2 are 2, then 2 × 2 = 4, then 4 × 2 = 8, which leaves 1. So 2³ mod 7 = 1 and the order of 2 is 3. After that the table repeats: 2⁴ mod 7 = 2 again.",
   steps: [
    "Start the table with a¹ = a.",
    "Get each next power by multiplying the last entry by a and taking the remainder mod n.",
    "Stop at the first entry equal to 1. The power it stands for is the order."
   ],
   example: {
    prompt: "What is the order of 2 in U(7)?",
    steps: [
     "2¹ = 2.",
     "2² = 2 × 2 = 4.",
     "2³ = 4 × 2 = 8, which leaves 1 mod 7."
    ],
    answer: "The order of 2 is 3."
   },
   pitfalls: [
    "Working out the full power, such as 5⁴ = 625, before reducing. Reducing after every step gives the same result with small numbers.",
    "Counting the entries after the first 1. The order is where 1 first appears.",
    "Using the order of a in Z_n. In U(n) the operation is multiplying, so the target is 1, not 0."
   ]
  },
  guidance: [
   { prompt: "What is 5² mod 13?", answer: [12], labels: ["a² mod n"], explanation: "5 × 5 = 25, and 25 = 1 × 13 + 12." },
   { prompt: "Multiply that by 5 and reduce. What is 5³ mod 13?", answer: [8], labels: ["a³ mod n"], explanation: "12 × 5 = 60, and 60 = 4 × 13 + 8." },
   { prompt: "Keep multiplying by 5 and reducing. At which power does the table first reach 1?", answer: [4], labels: ["order of a"], explanation: "The powers mod 13 are 5, 12, 8, 1. The last of these is 5⁴, so the order is 4." }
  ]
 },
 {
  id: "q09", title: "The pulse that lights every lamp", topic: "Cyclic groups and generators", tier: "Basic", sector: "Beacon Tower",
  brief: "The tower crew wants beacons whose pulse reaches every lamp in the ring, and needs to know which jump sizes do that.",
  lesson: "A group made of the repeats of one element g is cyclic and g is a generator; g generates Z_n exactly when gcd(g, n) = 1.",
  prompt: "The Beacon Tower's ring of 18 lamps, 0 to 17, works like Z_18. A pulse that jumps g lamps per beat lights the lamps of ⟨g⟩, and g is a generator of Z_18 when it lights every lamp. Enter how many generators Z_18 has. Then enter 1 if 10 generates Z_18, 0 if not.",
  answer: [6,0], labels: ["number of generators","generates (1 or 0)"], tolerance: 0.01,
  hints: [
   "g lights every lamp exactly when its order is the whole ring size, and its order is the ring size divided by gcd(g, ring size).",
   "So the generators are the numbers from 1 to one less than the ring size that share no factor bigger than 1 with the ring size. Count them."
  ],
  solution: "g generates Z_18 exactly when its order 18 ÷ gcd(g, 18) is 18, that is when gcd(g, 18) = 1. The numbers from 1 to 17 coprime to 18 are 1, 5, 7, 11, 13, 17, so Z_18 has 6 generators. gcd(10, 18) = 2, so the order of 10 is 18 ÷ 2 = 9, less than 18: ⟨10⟩ lights only 9 lamps, and 10 is not a generator (0).",
  xp: 100, prereqs: ["q07"],
  artifact: { name: "Full-ring beacon", description: "A beacon set to a jump that lights every lamp of the ring in turn." },
  sources: [source.s4_1],
  teaching: {
   intuition: "Take one element g of a group and repeat it: g, g ∗ g, g ∗ g ∗ g and so on, back to the identity. The elements you reach are written ⟨g⟩. In Z_n, ⟨g⟩ is the set of multiples of g mod n: in Z_8, ⟨2⟩ = {0, 2, 4, 6}, only half the ring. If ⟨g⟩ is the whole group, g is called a generator, and a group that has a generator is called a cyclic group. Z_n is cyclic, because 1 reaches every element. The number of elements in ⟨g⟩ is the order of g, which in Z_n is n ÷ gcd(g, n). So g generates Z_n exactly when this is n, that is when gcd(g, n) = 1. In Z_8 the generators are 1, 3, 5 and 7: four of them.",
   steps: [
    "Find gcd(g, n). If it is 1, g is a generator; otherwise ⟨g⟩ has only n ÷ gcd(g, n) elements.",
    "To count all the generators of Z_n, count the numbers from 1 to n − 1 that are coprime to n.",
    "Check one of them by listing its multiples, if you like: a generator reaches every element before it returns to 0."
   ],
   example: {
    prompt: "How many generators does Z_8 have, and does 3 generate it?",
    steps: [
     "The numbers from 1 to 7 coprime to 8 are 1, 3, 5, 7.",
     "So Z_8 has 4 generators.",
     "gcd(3, 8) = 1, so 3 is one of them: its multiples are 3, 6, 1, 4, 7, 2, 5, 0."
    ],
    answer: "4 generators; 3 generates Z_8."
   },
   pitfalls: [
    "Counting 0 as a generator. ⟨0⟩ is just {0}.",
    "Thinking only prime jumps generate. 2 is prime but ⟨2⟩ in Z_8 is only {0, 2, 4, 6}, while 9 generates Z_10.",
    "Counting n itself among the numbers from 1 to n − 1."
   ]
  },
  guidance: [
   { prompt: "What is gcd(10, 18)?", answer: [2], labels: ["gcd"], explanation: "18 = 1 × 10 + 8, 10 = 1 × 8 + 2, 8 = 4 × 2 + 0. The last remainder that is not 0 is 2." },
   { prompt: "How many lamps does ⟨10⟩ light? That is the order of 10, 18 ÷ gcd(10, 18).", answer: [9], labels: ["lamps lit"], explanation: "18 ÷ 2 = 9. That is fewer than 18, so 10 is not a generator." },
   { prompt: "How many numbers from 1 to 17 have gcd 1 with 18?", answer: [6], labels: ["number of generators"], explanation: "They are 1, 5, 7, 11, 13, 17: 6 generators." }
  ]
 },
 {
  id: "q10", title: "The beacon after a thousand beats", topic: "Large powers through the order", tier: "Basic", sector: "Beacon Tower",
  brief: "The master beacon will run for hundreds of beats, and the crew wants its code at the end without multiplying all the way.",
  lesson: "If a has order m, then aᵏ mod n = aʳ mod n, where r is the remainder of k on division by m; repeated squaring is another shortcut.",
  prompt: "The Beacon Tower's master beacon multiplies its code by 3, mod 11, on every beat. The crew needs the factor after 437 beats, 3⁴³⁷ mod 11, without multiplying 437 times. Enter the order of 3 in U(11), then 437 mod that order, then 3⁴³⁷ mod 11.",
  answer: [5,2,9], labels: ["order of a","k mod order","aᵏ mod n"], tolerance: 0.01,
  hints: [
   "Find the order first with a table of powers: multiply by the element and reduce until you reach 1.",
   "Once the order is m, every block of m factors multiplies to 1, so only the remainder of the exponent on division by m matters."
  ],
  solution: "Powers of 3 mod 11: 3, 9, 5, 4, 1. The first 1 is at power 5, so the order of 3 is 5. 437 = 87 × 5 + 2, so 3⁴³⁷ = (3⁵)⁸⁷ × 3². Since 3⁵ mod 11 = 1, this leaves 3² mod 11 = 9.",
  xp: 100, prereqs: ["q08"],
  artifact: { name: "Beat logbook", description: "A logbook in which a thousand beats take up only one line." },
  sources: [source.s4_1, source.s4_3],
  teaching: {
   intuition: "Once a power of a reaches 1, the table of powers starts again from a, so it repeats forever with the same length: the order of a. If a has order m, every block of m factors multiplies to 1, and only what is left over matters. So for any exponent k, write k = q × m + r with r the remainder, and then aᵏ is q blocks of aᵐ, each leaving 1, followed by aʳ, so aᵏ mod n = aʳ mod n. In U(7) the order of 2 is 3, and 100 = 33 × 3 + 1, so 2¹⁰⁰ mod 7 = 2¹ = 2. When the order is not known, there is another shortcut called repeated squaring: square a again and again to get a², a⁴, a⁸, a¹⁶ and so on, reducing mod n each time, write k as a sum of these doubling exponents, and multiply the matching squares.",
   steps: [
    "Find the order m of a with a table of powers.",
    "Divide the exponent k by m and keep the remainder r.",
    "Read aʳ mod n from the table: it equals aᵏ mod n.",
    "Without the order, use repeated squaring: build a², a⁴, a⁸, … mod n and multiply the ones whose exponents add to k."
   ],
   example: {
    prompt: "What is 2¹⁰⁰ mod 7?",
    steps: [
     "Powers of 2 mod 7: 2, 4, 1, so the order of 2 is 3.",
     "100 = 33 × 3 + 1, so the remainder is 1.",
     "2¹⁰⁰ mod 7 = 2¹ mod 7 = 2."
    ],
    answer: "2."
   },
   pitfalls: [
    "Dividing the exponent by n instead of by the order of a.",
    "Taking the quotient instead of the remainder: in 437 = 87 × 5 + 2 the exponent that is left is 2, not 87.",
    "Reading the wrong row of the table: a remainder of r means the power aʳ, so count r entries along the table, starting from a¹."
   ]
  },
  guidance: [
   { prompt: "Make the table of powers of 3 mod 11. What is the order of 3?", answer: [5], labels: ["order of a"], explanation: "The powers are 3, 9, 5, 4, 1. The first 1 is the power 5." },
   { prompt: "What is the remainder when 437 is divided by 5?", answer: [2], labels: ["remainder"], explanation: "437 = 87 × 5 + 2. The 87 full blocks of 5 factors each multiply to 1." },
   { prompt: "So 3⁴³⁷ mod 11 is the same as 3² mod 11. What is it?", answer: [9], labels: ["aᵏ mod n"], explanation: "From the table of powers, 3² mod 11 = 9." }
  ]
 }
);
})();
