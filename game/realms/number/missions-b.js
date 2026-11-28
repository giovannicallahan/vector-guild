/* Number theory: the hidden life of whole numbers missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/number/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Combining whole numbers · Basic, 100 XP · sector 'Fuel Depot' · Chapter review: depot measures [R2.4, R2.5, R4.2]
     q12  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Congruences and least residues [R3.1, R3.2]
     q13  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Arithmetic mod n [R3.1]
     q14  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Divisibility tests for 3, 9 and 11 [BC1.18]
     q15  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Modular inverses [R3.3]
     q16  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Linear congruences [R3.3]
     q17  ch 3 Congruences · Intermediate, 150 XP · sector 'Timetable Office' · Chapter review: calendar arithmetic [R3.1, R3.3]
     q18  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Chinese remainder theorem [R3.4]
     q19  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Fast powers by repeated squaring [BC1.26]
     q20  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Fermat's little theorem [R3.5]
   The prompt, hints, solution and guided steps of each mission are build(canonical) of gen-b.js, word for word. */
(function(){
'use strict';
/* Raji, Elementary Number Theory (LibreTexts); Barrus and Clark, Elementary Number Theory (LibreTexts): the sections the
   missions below cite. Each page was opened on the date in `verified` and the idea the mission uses was found on it.
   R3.2 is added to q12 because R3.1 defines congruence but not the least residues 0 … m − 1; R4.2 is added to q11
   for its divisor count. */
const source = {
 r2_4: { title: 'Raji, Elementary Number Theory (LibreTexts) — 2.4 Least Common Multiple', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.04%3A_Least_Common_Multiple', description: 'gcd and lcm from prime factorisations, and gcd × lcm = ab.', verified: '2026-11-27' },
 r2_5: { title: 'Raji, Elementary Number Theory (LibreTexts) — 2.5 Linear Diophantine Equations', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.05%3A_Linear_Diophantine_Equations', description: 'ax + by = c is solvable exactly when gcd(a, b) divides c, and the general solution from one solution.', verified: '2026-11-27' },
 r3_1: { title: 'Raji, Elementary Number Theory (LibreTexts) — 3.1 Introduction to Congruences', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.01%3A_Introduction_to_Congruences', description: 'The definition of a ≡ b (mod m) as m dividing a − b, and adding, subtracting and multiplying congruences.', verified: '2026-11-27' },
 r3_2: { title: 'Raji, Elementary Number Theory (LibreTexts) — 3.2 Residue Systems and Euler’s φ-Function', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.02%3A_Residue_Systems_and_Eulers_-Function', description: 'Complete residue systems: every integer is congruent to exactly one of 0, 1, …, m − 1.', verified: '2026-11-27' },
 r3_3: { title: 'Raji, Elementary Number Theory (LibreTexts) — 3.3 Linear Congruences', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.03%3A_Linear_Congruences', description: 'ax ≡ b (mod m) has gcd(a, m) solutions when that gcd divides b and none otherwise; the inverse of a modulo m.', verified: '2026-11-27' },
 r3_4: { title: 'Raji, Elementary Number Theory (LibreTexts) — 3.4 The Chinese Remainder Theorem', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.04%3A_The_Chinese_Remainder_Theorem', description: 'A system of congruences with pairwise relatively prime moduli has one solution modulo their product.', verified: '2026-11-27' },
 r3_5: { title: 'Raji, Elementary Number Theory (LibreTexts) — 3.5 Theorems of Fermat, Euler, and Wilson', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.05%3A_Theorems_of_Fermat_Euler_and_Wilson', description: 'Fermat’s little theorem: a to the power p − 1 is ≡ 1 (mod p) for a prime p that does not divide a.', verified: '2026-11-27' },
 r4_2: { title: 'Raji, Elementary Number Theory (LibreTexts) — 4.2 Multiplicative Number Theoretic Functions', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.02%3A_Multiplicative_Number_Theoretic_Functions', description: 'The number of divisors τ(n) as the product of (exponent + 1) over the prime powers of n.', verified: '2026-11-27' },
 bc1_18: { title: 'Barrus and Clark, Elementary Number Theory (LibreTexts) — 1.18 Divisibility Tests for 2, 3, 5, 9, 11', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.18%3A_Divisibility_Tests_for_2_3_5_9_11', description: 'A number is congruent to its digit sum mod 3 and mod 9, and to its alternating digit sum mod 11.', verified: '2026-11-27' },
 bc1_26: { title: 'Barrus and Clark, Elementary Number Theory (LibreTexts) — 1.26 Computation of aⁿ mod m', url: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.26%3A_Computation_of_a_mod_m', description: 'Computing aⁿ mod m by repeated squaring, using the binary digits of the exponent.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'The depot order book', topic: 'Chapter review: depot measures', tier: 'Basic', sector: 'Fuel Depot',
  brief: 'A large fuel order has come in, and the depot keeper wants to know every way the sealed cans can fill it, and every drum size that could hold it instead.',
  lesson: 'The gcd decides whether ax + by = c can be solved at all; one solution and a fixed step give every other one; and the exponents of a factorisation count the divisors.',
  prompt: 'The Fuel Depot fills orders with two sizes of sealed can, 6 litres and 9 litres, always full and never opened. An order of exactly 96 litres must use at least one can of each size. Enter the greatest common divisor gcd(6, 9). Then enter the number of different ways to make up the order: x cans of 6 litres and y cans of 9 litres, with 6x + 9y = 96 and x and y whole numbers of at least 1. Last, the order may instead go into equal drums of one whole-number size, filled exactly with nothing left over (one drum of 96 litres counts, and so does a 1-litre drum): enter how many drum sizes would work, which is the number of divisors τ(96).',
  answer: [3, 5, 12], labels: ['gcd of the can sizes', 'ways to fill the order', 'drum sizes'], tolerance: 0.01,
  hints: [
   'Euclid’s algorithm gives the gcd. An equation ax + by = c has whole-number solutions only when the gcd divides c, so divide every term by the gcd before you search.',
   'Find the solution with the smallest y. Each further solution adds (first can size ÷ gcd) to y and takes (second can size ÷ gcd) from x; count them while x is still at least 1.',
   'For the drum sizes, factorise the order into primes: τ(n) is the product of (exponent + 1) over its primes.'
  ],
  solution: 'Euclid’s algorithm: 9 = 1 × 6 + 3, 6 = 2 × 3 + 0. The last non-zero remainder is 3, so gcd(6, 9) = 3, and 3 divides 96, so the order can be filled. Divide every term by 3: 2x + 3y = 32. The smallest y that leaves a whole x is y = 2, with x = 13. Each further solution adds 2 to y and takes 3 from x, so the solutions (x, y) are (13, 2), (10, 4), (7, 6), (4, 8), (1, 10); one more step would make x 0 or less. That is 5 ways. For the drums, 96 = 2⁵ × 3, so τ(96) = (5 + 1) × (1 + 1) = 12 drum sizes.',
  xp: 100, prereqs: ['q08', 'q10'],
  artifact: { name: 'Depot order book', description: 'Every way two can sizes fill one order, and every drum that holds it.' },
  sources: [source.r2_4, source.r2_5, source.r4_2],
  teaching: {
   intuition: 'This review puts three tools of the chapter side by side. First, the greatest common divisor: whatever whole numbers of cans you take, the total is a multiple of the gcd of the two can sizes, so an order that is not a multiple of it can never be filled. Second, the whole-number equation ax + by = c itself. Once it can be solved, dividing through by the gcd gives a smaller equation with the same solutions, and one solution leads to all the others: swapping cans in a fixed trade, more of one size and fewer of the other, keeps the total the same. Counting the solutions with x and y both at least 1 is then a matter of stepping until one count would drop to 0. Third, the divisor count τ(n): writing n as a product of prime powers, each divisor chooses how many of each prime to take, from none up to all of them, so τ(n) is the product of (exponent + 1).',
   steps: [
    'Find g = gcd(a, b) with Euclid’s algorithm. If g does not divide c, there are no solutions.',
    'Divide a, b and c by g. Try y = 1, 2, 3, … until c − by is a multiple of a; that gives the solution with the smallest y and the largest x.',
    'Step to the other solutions: add (a ÷ g) to y and take (b ÷ g) from x each time. Stop when x would fall below 1, and count the solutions you listed.',
    'For the divisor count, factorise c into prime powers and multiply together (exponent + 1) for each prime.'
   ],
   example: {
    prompt: 'Cans of 4 litres and 6 litres fill an order of 30 litres, with at least one can of each size. Find gcd(4, 6), the number of ways, and the number of divisors of 30.',
    steps: [
     '6 = 1 × 4 + 2 and 4 = 2 × 2 + 0, so gcd(4, 6) = 2, and 2 divides 30.',
     'Divide by 2: 2x + 3y = 15. y = 1 gives 2x = 12, so x = 6.',
     'Step: add 2 to y and take 3 from x. (6, 1), then (3, 3); the next would be (0, 5), and x = 0 is not allowed. So there are 2 ways.',
     '30 = 2 × 3 × 5, so τ(30) = (1 + 1) × (1 + 1) × (1 + 1) = 8.'
    ],
    answer: 'gcd 2, 2 ways, and 8 divisors.'
   },
   pitfalls: [
    'Stepping by the can sizes themselves instead of by the sizes divided by the gcd, which skips solutions.',
    'Counting a solution with x = 0 or y = 0. The order must use at least one can of each size.',
    'Adding the exponents for τ(n), or forgetting the + 1: a prime that appears once still gives two choices, none or one.'
   ]
  },
  guidance: [
   { prompt: 'Run Euclid’s algorithm on 9 and 6. What is gcd(6, 9)?', answer: [3], labels: ['gcd of the can sizes'], explanation: '9 = 1 × 6 + 3, 6 = 2 × 3 + 0. The last non-zero remainder, 3, is the gcd.' },
   { prompt: 'Divide every term by 3: 2x + 3y = 32. Try y = 1, 2, 3, … in turn. What is the smallest y that leaves a whole number x of at least 1, and what is that x?', answer: [2, 13], labels: ['smallest y', 'its x'], explanation: 'With y = 2: 32 − 3 × 2 = 26 = 2 × 13, so x = 13. With y = 1, 29 leaves a remainder when divided by 2.' },
   { prompt: 'Each further solution adds 2 to y and takes 3 from x. How many solutions have x and y both at least 1?', answer: [5], labels: ['ways to fill the order'], explanation: 'The solutions are (13, 2), (10, 4), (7, 6), (4, 8), (1, 10). The next step would make x 0 or less, so there are 5.' },
   { prompt: 'Factorise 96 into primes. How many divisors does it have?', answer: [12], labels: ['drum sizes'], explanation: '96 = 2⁵ × 3. Each divisor picks an exponent for each prime, from 0 up to its exponent here, so τ(96) = (5 + 1) × (1 + 1) = 12.' }
  ]
 },
 {
  id: 'q12', title: 'Round the tram loop', topic: 'Congruences and least residues', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'The cargo tram has run so many stops, forwards and backwards, that the timetable clerk has lost track of where it is on its loop.',
  lesson: 'a ≡ b (mod n), a congruence, says that n divides a − b; the least residue of a mod n is the one number from 0 to n − 1 that a is congruent to.',
  prompt: 'The cargo tram at the Timetable Office runs round a loop of 9 stops, numbered 0 to 8, so every count of stops is read mod 9. Starting at stop 0 it has gone 470 stops forward: enter the least residue of 470 mod 9, which is the stop it has reached. A test run went 41 stops backward from stop 0, a count of −41: enter the least residue of −41 mod 9. Last, enter 1 if 38 ≡ 101 (mod 9) and 0 if not.',
  answer: [2, 4, 1], labels: ['least residue of the forward count', 'least residue of the backward count', 'congruent (1 or 0)'], tolerance: 0.01,
  hints: [
   'Divide by the modulus: a = qn + r with 0 ≤ r < n, and r is the least residue. For a negative number the quotient q is negative too, chosen so that r still lies from 0 to n − 1.',
   'a ≡ b (mod n) exactly when n divides a − b, which is the same as a and b leaving the same remainder.'
  ],
  solution: '470 = 52 × 9 + 2, so 470 ≡ 2 (mod 9) and the tram is at stop 2. −41 = −5 × 9 + 4, so the least residue of −41 is 4: going 41 stops back lands on stop 4. 101 − 38 = 63 = 7 × 9, so 9 divides it and 38 ≡ 101 (mod 9): enter 1.',
  xp: 150, prereqs: ['q01'],
  artifact: { name: 'Tram loop chart', description: 'A ring of stops where every count, however large or negative, lands on one stop.' },
  sources: [source.r3_1, source.r3_2],
  teaching: {
   intuition: 'A tram on a loop of 8 stops does not care whether it has gone 2 stops or 10 or 250: every full lap of 8 brings it back to where it started, so only the stops left over after whole laps matter. Number theory has a word for this. Two whole numbers a and b are congruent modulo n, written a ≡ b (mod n), when n divides a − b, that is when a − b is a multiple of n. The whole statement is called a congruence, and n is its modulus. So 250 ≡ 2 (mod 8), because 250 − 2 = 248 = 31 × 8. Every whole number is congruent to exactly one of 0, 1, …, n − 1, and that one is its least residue mod n: the remainder of the division algorithm, a = qn + r with 0 ≤ r < n. Negative numbers work the same way. Going 21 stops backwards is a count of −21, and −21 = −3 × 8 + 3, so the tram ends at stop 3: the quotient is negative, but the remainder still lies from 0 to n − 1. Two numbers are congruent exactly when they have the same least residue.',
   steps: [
    'To find the least residue of a mod n, divide: write a = qn + r with 0 ≤ r < n. The remainder r is the least residue.',
    'For a negative a, take the quotient one step more negative than plain division by n suggests, so that r = a − qn is not negative.',
    'To test whether a ≡ b (mod n), subtract: if n divides a − b they are congruent, otherwise not. Comparing the two least residues gives the same answer.',
    'Read mod n as “counting round a loop of n”: adding or taking away a whole multiple of n never changes the least residue.'
   ],
   example: {
    prompt: 'Find the least residue of 47 mod 6 and of −20 mod 6, and decide whether 13 ≡ 31 (mod 6).',
    steps: [
     '47 = 7 × 6 + 5, so 47 ≡ 5 (mod 6).',
     '−20 = −4 × 6 + 4, since −4 × 6 = −24 and −20 − (−24) = 4. So −20 ≡ 4 (mod 6).',
     '31 − 13 = 18 = 3 × 6, so 6 divides the difference and 13 ≡ 31 (mod 6).'
    ],
    answer: '5, 4, and yes: 13 ≡ 31 (mod 6), so enter 1.'
   },
   pitfalls: [
    'Giving a negative least residue, such as −5 for −21 mod 8. The least residue always lies from 0 to n − 1; add 8 to −5 to get 3.',
    'Dropping the minus sign and finding the residue of 21 instead of −21. They differ: 21 ≡ 5 but −21 ≡ 3 (mod 8).',
    'Deciding congruence by whether the numbers are close. 30 and 102 are far apart but congruent mod 8, since 102 − 30 = 72 = 9 × 8, while 30 and 31 are not.'
   ]
  },
  guidance: [
   { prompt: 'Divide 470 by 9. What are the quotient and the least residue?', answer: [52, 2], labels: ['quotient', 'least residue of the forward count'], explanation: '470 = 52 × 9 + 2, and 2 lies from 0 to 8.' },
   { prompt: 'Write −41 = q × 9 + r with 0 ≤ r < 9. What are q and r?', answer: [-5, 4], labels: ['quotient', 'least residue of the backward count'], explanation: '−5 × 9 = −45, and −41 − (−45) = 4, which lies from 0 to 8. One step less negative, −4 × 9 = −36, would leave a negative remainder.' },
   { prompt: 'What is 101 − 38, and what remainder does it leave on division by 9?', answer: [63, 0], labels: ['difference', 'remainder of the difference'], explanation: '101 − 38 = 63 = 7 × 9 + 0. The remainder is 0, so the two numbers are congruent.' }
  ]
 },
 {
  id: 'q13', title: 'The shift rota cycle', topic: 'Arithmetic mod n', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'The shift rota repeats on a short cycle, but the supply runs are thousands of shifts long and the clerk will not do long division on huge numbers.',
  lesson: 'Congruences with the same modulus can be added and multiplied, so a sum or product mod n can be worked out from the small least residues instead of the large numbers.',
  prompt: 'The Timetable Office runs its shift rota on a cycle of 13 shifts, numbered 0 to 12. Starting from shift 0, one supply run lasts 4831 shifts and the next lasts 2968 shifts. Enter the shift of the cycle at which the second run ends: the least residue of 4831 + 2968 mod 13. Then a convoy repeats a run of 2968 shifts 4831 times, starting from shift 0: enter the shift at which it ends, the least residue of 4831 × 2968 mod 13. Reduce each number mod 13 first.',
  answer: [12, 6], labels: ['shift after both runs', 'shift after the convoy'], tolerance: 0.01,
  hints: [
   'Replace each large number by its least residue first: if a ≡ a′ and b ≡ b′ (mod n), then a + b ≡ a′ + b′ and a × b ≡ a′ × b′ (mod n).',
   'After adding or multiplying the small residues, reduce once more so that the result lies from 0 to n − 1.'
  ],
  solution: '4831 = 371 × 13 + 8 and 2968 = 228 × 13 + 4, so 4831 ≡ 8 and 2968 ≡ 4 (mod 13). Sum: 8 + 4 = 12, already below 13, so the second run ends at shift 12. Product: 8 × 4 = 32 ≡ 6 (mod 13), so the convoy ends at shift 6. Check: 4831 × 2968 = 14338408, which also leaves 6 on division by 13.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Rota wheel', description: 'A small wheel that does the work of very large sums and products.' },
  sources: [source.r3_1],
  teaching: {
   intuition: 'Suppose a ≡ a′ and b ≡ b′ (mod n). Then a + b ≡ a′ + b′ and a × b ≡ a′ × b′ (mod n): congruences with the same modulus can be added and multiplied like equations. The reason is short. a is a′ plus some multiple of n, and b is b′ plus some multiple of n. When you add them, the two multiples of n add to another multiple of n. When you multiply them out, every piece except a′ × b′ contains a multiple of n. So the multiples of n never affect the answer mod n, and you may throw them away before you start. In practice that means: replace every large number by its least residue first, do the arithmetic on those small numbers, and reduce once more at the end. A product of two four-digit numbers can have eight digits, but mod 7 it is a product of two numbers below 7.',
   steps: [
    'Reduce each number mod n: find its least residue by dividing by n.',
    'Add or multiply the least residues instead of the original numbers.',
    'Reduce the result mod n again, so that the answer lies from 0 to n − 1.',
    'If you like, check with the full numbers: the big sum or product leaves the same remainder on division by n.'
   ],
   example: {
    prompt: 'Find (523 + 418) mod 5 and (523 × 418) mod 5.',
    steps: [
     '523 = 104 × 5 + 3 and 418 = 83 × 5 + 3, so both are ≡ 3 (mod 5).',
     'Sum: 3 + 3 = 6 ≡ 1 (mod 5).',
     'Product: 3 × 3 = 9 ≡ 4 (mod 5). Check: 523 × 418 = 218614, which ends in 4, so it leaves 4 on division by 5.'
    ],
    answer: '1 and 4.'
   },
   pitfalls: [
    'Forgetting the last reduction: 5 + 6 = 11 is not a least residue mod 7; it is ≡ 4.',
    'Reducing the number of repeats differently from the length of a run. In a product both factors are reduced mod the same n.',
    'Dividing a congruence. Adding and multiplying are always allowed, but dividing both sides needs more care (a later mission).'
   ]
  },
  guidance: [
   { prompt: 'Reduce both runs first. What are the least residues of 4831 and of 2968 mod 13?', answer: [8, 4], labels: ['least residue of the first run', 'least residue of the second run'], explanation: '4831 = 371 × 13 + 8 and 2968 = 228 × 13 + 4.' },
   { prompt: 'Add the two residues and reduce mod 13. At which shift does the second run end?', answer: [12], labels: ['shift after both runs'], explanation: '8 + 4 = 12, which is already below 13.' },
   { prompt: 'Multiply the two residues and reduce mod 13. At which shift does the convoy end?', answer: [6], labels: ['shift after the convoy'], explanation: '8 × 4 = 32 = 2 × 13 + 6.' }
  ]
 },
 {
  id: 'q14', title: 'The ticket serial check', topic: 'Divisibility tests for 3, 9 and 11', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'The ticket clerk checks long serial numbers by eye, and Mira wants the three remainders that catch a mistyped digit.',
  lesson: 'Because 10 ≡ 1 (mod 9) and 10 ≡ −1 (mod 11), a number has the same remainder as its digit sum mod 3 and mod 9, and as its alternating digit sum mod 11.',
  prompt: 'Every ticket at the Timetable Office carries a serial number, and the clerk checks it without long division. Today’s serial is 38472915. Enter the remainder when 38472915 is divided by 3, then when it is divided by 9, then when it is divided by 11.',
  answer: [0, 3, 8], labels: ['remainder mod 3', 'remainder mod 9', 'remainder mod 11'], tolerance: 0.01,
  hints: [
   'A number leaves the same remainder on division by 9, and on division by 3, as the sum of its digits does, because 10 ≡ 1 (mod 9).',
   'For 11 use the alternating digit sum: start with the units digit, subtract the tens digit, add the hundreds digit, and so on, because 10 ≡ −1 (mod 11). If the result is negative or above 10, add or take away 11s until it lies from 0 to 10.'
  ],
  solution: 'Digit sum: 3 + 8 + 4 + 7 + 2 + 9 + 1 + 5 = 39. 39 = 13 × 3 + 0 and 39 = 4 × 9 + 3, so 38472915 ≡ 0 (mod 3) and 38472915 ≡ 3 (mod 9). Alternating digit sum from the units digit: 5 − 1 + 9 − 2 + 7 − 4 + 8 − 3 = 19 ≡ 8 (mod 11), so 38472915 ≡ 8 (mod 11).',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Clerk’s check card', description: 'Three remainders of a long serial, found without any long division.' },
  sources: [source.bc1_18],
  teaching: {
   intuition: 'A serial such as 52143 is 5 × 10000 + 2 × 1000 + 1 × 100 + 4 × 10 + 3. Now look at the powers of 10 mod 9. 10 = 9 + 1, so 10 ≡ 1 (mod 9), and by multiplying congruences 100 ≡ 1, 1000 ≡ 1 and every power of 10 is ≡ 1 (mod 9). So the number is congruent to 5 + 2 + 1 + 4 + 3, its digit sum. The same holds mod 3, because 9 is a multiple of 3. Checking sums this way is called casting out nines. For 11 the trick changes: 10 = 11 − 1, so 10 ≡ −1 (mod 11), 100 ≡ (−1) × (−1) = 1, 1000 ≡ −1, and the signs alternate. So a number is congruent mod 11 to its alternating digit sum: the units digit, minus the tens digit, plus the hundreds digit, and so on. For 52143 that is 3 − 4 + 1 − 2 + 5 = 3. A remainder from these sums may be bigger than the modulus or negative; one more reduction brings it into range.',
   steps: [
    'Add all the digits to get the digit sum.',
    'Reduce the digit sum mod 3 and mod 9: those are the number’s remainders on division by 3 and by 9.',
    'Form the alternating digit sum, starting with + for the units digit, − for the tens digit, + for the hundreds digit, and so on.',
    'Reduce it mod 11, adding 11 if it is negative, to get the number’s remainder on division by 11.'
   ],
   example: {
    prompt: 'Find the remainders of 75284 on division by 3, 9 and 11.',
    steps: [
     'Digit sum: 7 + 5 + 2 + 8 + 4 = 26. 26 = 8 × 3 + 2 and 26 = 2 × 9 + 8.',
     'Alternating digit sum from the units digit: 4 − 8 + 2 − 5 + 7 = 0.',
     'So 75284 leaves 2 on division by 3, 8 on division by 9, and 0 on division by 11. Indeed 75284 = 11 × 6844.'
    ],
    answer: '2, 8 and 0.'
   },
   pitfalls: [
    'Starting the alternating sum from the leftmost digit. When the number of digits is even, that flips every sign and gives the negative of the right sum.',
    'Leaving a negative alternating sum as the answer. −4 is ≡ 7 (mod 11).',
    'Using the digit sum for 11. Only 3 and 9 follow the plain digit sum.'
   ]
  },
  guidance: [
   { prompt: 'Add up the digits of 38472915. What is the digit sum?', answer: [39], labels: ['digit sum'], explanation: '3 + 8 + 4 + 7 + 2 + 9 + 1 + 5 = 39.' },
   { prompt: 'The serial leaves the same remainders as its digit sum 39. What are the remainders on division by 9 and by 3?', answer: [3, 0], labels: ['remainder mod 9', 'remainder mod 3'], explanation: '39 = 4 × 9 + 3 and 39 = 13 × 3 + 0.' },
   { prompt: 'Start from the units digit and alternate: plus, minus, plus, … What is the alternating digit sum?', answer: [19], labels: ['alternating digit sum'], explanation: '5 − 1 + 9 − 2 + 7 − 4 + 8 − 3 = 19.' },
   { prompt: 'Bring 19 into the range 0 to 10 by adding or taking away 11s. What is the remainder of the serial on division by 11?', answer: [8], labels: ['remainder mod 11'], explanation: '19 ≡ 8 (mod 11), so the serial leaves 8 on division by 11.' }
  ]
 },
 {
  id: 'q15', title: 'One stop past the start', topic: 'Modular inverses', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'The express tram jumps several stops at a time, and the crew needs to know how many jumps bring it to rest exactly one stop past where it began.',
  lesson: 'A modular inverse of a mod n is a number k with ak ≡ 1 (mod n); it exists when gcd(a, n) = 1 and comes from Bézout’s identity.',
  prompt: 'The tram loop at the Timetable Office has 29 stops, numbered 0 to 28. On its express setting the tram jumps 11 stops at a time, and the crew wants it to stop exactly 1 stop past where it started. Enter the modular inverse of 11 mod 29: the number of jumps k, from 1 to 28, with 11k ≡ 1 (mod 29).',
  answer: [8], labels: ['modular inverse'], tolerance: 0.01,
  hints: [
   'An inverse of a mod n exists when gcd(a, n) = 1. Run Euclid’s algorithm, then work back up through its steps to write 1 = ax + ny, as for Bézout coefficients.',
   'The x of that equation is an inverse of a. If it is negative or bigger than n − 1, add or take away n until it lies from 1 to n − 1.'
  ],
  solution: 'Euclid’s algorithm: 29 = 2 × 11 + 7, 11 = 1 × 7 + 4, 7 = 1 × 4 + 3, 4 = 1 × 3 + 1, 3 = 3 × 1 + 0. The last non-zero remainder is 1, so gcd(11, 29) = 1 and the inverse exists. Working back up the steps gives 11 × 8 + 29 × (−3) = 1. So 11 × 8 ≡ 1 (mod 29) and the inverse is 8. Check: 11 × 8 = 88 = 3 × 29 + 1.',
  xp: 150, prereqs: ['q07', 'q12'],
  artifact: { name: 'Express jump table', description: 'The number of jumps that undoes a jump length on the loop.' },
  sources: [source.r3_3],
  teaching: {
   intuition: 'With ordinary numbers, dividing by 5 is the same as multiplying by 1 ÷ 5, the number that times 5 gives 1. Mod n there are no fractions, but there can still be a number that “undoes” multiplication by a: a whole number k with ak ≡ 1 (mod n). It is called the modular inverse of a mod n. On a loop of 17 stops, a tram that jumps 5 stops at a time stands 1 stop past its start after 7 jumps, because 5 × 7 = 35 = 2 × 17 + 1, so 7 is the inverse of 5 mod 17. An inverse exists exactly when gcd(a, n) = 1, and Bézout’s identity hands it over: when gcd(a, n) = 1 there are whole numbers x and y with ax + ny = 1. Read that mod n: ny is a multiple of n, so ax ≡ 1 (mod n), and x is the inverse. It may come out negative; adding n gives the inverse from 1 to n − 1, and that one is unique.',
   steps: [
    'Run Euclid’s algorithm on n and a. If the last non-zero remainder is not 1, there is no inverse.',
    'Work back up through the division steps, as for Bézout coefficients, to write 1 = ax + ny.',
    'Read the equation mod n: ax ≡ 1 (mod n), so x is an inverse. Add or take away n until it lies from 1 to n − 1.',
    'Check: a times your answer should be one more than a multiple of n.'
   ],
   example: {
    prompt: 'Find the inverse of 5 mod 17.',
    steps: [
     'Euclid: 17 = 3 × 5 + 2, 5 = 2 × 2 + 1, 2 = 2 × 1 + 0. The gcd is 1.',
     'Back up: 1 = 5 − 2 × 2 = 5 − 2 × (17 − 3 × 5) = 7 × 5 − 2 × 17.',
     'So 5 × 7 ≡ 1 (mod 17). Check: 35 = 2 × 17 + 1.'
    ],
    answer: '7.'
   },
   pitfalls: [
    'Giving a negative Bézout coefficient as the answer. −12 and 5 are both inverses of 7 mod 17, but the least residue, 5, is the one asked for.',
    'Taking the coefficient of n instead of the coefficient of a. Only the number multiplying a is its inverse.',
    'Looking for an inverse when gcd(a, n) is bigger than 1. Then ak and every multiple of n are multiples of that gcd, so ak can never be one more than a multiple of n.'
   ]
  },
  guidance: [
   { prompt: 'Run Euclid’s algorithm on 29 and 11. What is gcd(11, 29)?', answer: [1], labels: ['gcd(a, n)'], explanation: '29 = 2 × 11 + 7, 11 = 1 × 7 + 4, 7 = 1 × 4 + 3, 4 = 1 × 3 + 1, 3 = 3 × 1 + 0. The last non-zero remainder is 1, so an inverse exists.' },
   { prompt: 'Work back up the steps to write 11x + 29y = 1, with x from 1 to 28. What are x and y?', answer: [8, -3], labels: ['x, the inverse', 'y'], explanation: 'Back-substitution gives 11 × 8 + 29 × (−3) = 1. So x = 8 and y = −3.' },
   { prompt: 'Check the inverse. What is 11 × 8, and what is its least residue mod 29?', answer: [88, 1], labels: ['product', 'its least residue'], explanation: '11 × 8 = 88 = 3 × 29 + 1, so 8 jumps of 11 stops end 1 stop past the start.' }
  ]
 },
 {
  id: 'q16', title: 'Which jumps reach the platform', topic: 'Linear congruences', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'A new platform has been built at one stop of the loop, and the crew wants to know after which numbers of jumps the tram stands at it.',
  lesson: 'ax ≡ b (mod n) has no solution unless d = gcd(a, n) divides b; then it has exactly d solutions from 0 to n − 1, spaced n ÷ d apart.',
  prompt: 'On a loop of 28 stops, numbered 0 to 27, the tram starts at stop 0 and jumps 12 stops at a time. The crew wants the numbers of jumps x, from 0 to 27, after which it stands at stop 8: the solutions of the linear congruence 12x ≡ 8 (mod 28). Enter how many solutions there are from 0 to 27, then the smallest one.',
  answer: [4, 3], labels: ['number of solutions', 'smallest solution'], tolerance: 0.01,
  hints: [
   'Let d = gcd(a, n). If d does not divide b there is no solution; if it does, there are exactly d solutions from 0 to n − 1.',
   'Divide a, b and n by d, solve the smaller congruence by multiplying both sides by a modular inverse, then add n ÷ d again and again to list the other solutions.'
  ],
  solution: 'gcd(12, 28) = 4, which divides 8, so there are 4 solutions from 0 to 27. Divide a, b and n by 4: 3x ≡ 2 (mod 7). The inverse of 3 mod 7 is 5, since 3 × 5 = 15 ≡ 1 (mod 7). Multiply both sides by 5: x ≡ 5 × 2 = 10 ≡ 3 (mod 7). The solutions from 0 to 27 are 3, 10, 17, 24, each 7 more than the last, and the smallest is 3. Check: 12 × 3 = 36 ≡ 8 (mod 28).',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Platform timetable', description: 'Every jump count that brings the tram to the new platform.' },
  sources: [source.r3_3],
  teaching: {
   intuition: 'A linear congruence asks for every x with ax ≡ b (mod n). When gcd(a, n) = 1 it is easy: multiply both sides by the modular inverse of a, and x ≡ (inverse) × b, one solution from 0 to n − 1. When a and n share a factor, think of the tram again. On a loop of 24 stops, a tram jumping 9 stops at a time only ever stands at stops that are multiples of 3, because both 9 and 24 are multiples of 3. So with d = gcd(a, n), the congruence has no solution at all unless d divides b. If it does, divide a, b and n by d. The smaller congruence has a solution x₀ mod n ÷ d, found with an inverse. Back on the full loop, x₀, x₀ + n ÷ d, x₀ + 2(n ÷ d), … all work, and exactly d of them lie from 0 to n − 1. So the number of solutions is d (or 0), and the smallest is x₀.',
   steps: [
    'Find d = gcd(a, n). If d does not divide b, there is no solution.',
    'Divide a, b and n by d to get a smaller congruence, whose a and n now have gcd 1.',
    'Multiply both sides by the inverse of the new a modulo the new n, and reduce: that is the smallest solution x₀.',
    'List the solutions x₀, x₀ + n ÷ d, x₀ + 2(n ÷ d), … up to n − 1. There are d of them.'
   ],
   example: {
    prompt: 'Solve 6x ≡ 4 (mod 10): how many solutions from 0 to 9, and which is the smallest?',
    steps: [
     'gcd(6, 10) = 2, and 2 divides 4, so there are 2 solutions.',
     'Divide by 2: 3x ≡ 2 (mod 5). The inverse of 3 mod 5 is 2, since 3 × 2 = 6 ≡ 1.',
     'x ≡ 2 × 2 = 4 (mod 5), so the solutions are 4 and 4 + 5 = 9. Check: 6 × 4 = 24 ≡ 4 and 6 × 9 = 54 ≡ 4 (mod 10).'
    ],
    answer: '2 solutions, 4 and 9; the smallest is 4.'
   },
   pitfalls: [
    'Dividing a and b by d but not n. All three must be divided, or the solutions come out wrong.',
    'Stopping at one solution. When d is bigger than 1 the others are found by adding n ÷ d.',
    'Using an inverse of a mod n when gcd(a, n) is bigger than 1. That inverse does not exist; divide by d first.'
   ]
  },
  guidance: [
   { prompt: 'What is d = gcd(12, 28)? It is also the number of solutions, since it divides 8.', answer: [4], labels: ['gcd(a, n)'], explanation: '28 = 2 × 12 + 4, 12 = 3 × 4 + 0. The last non-zero remainder is 4.' },
   { prompt: 'After dividing by 4 the congruence is 3x ≡ 2 (mod 7). What is the inverse of 3 mod 7?', answer: [5], labels: ['inverse after dividing by the gcd'], explanation: '3 × 5 = 15 ≡ 1 (mod 7).' },
   { prompt: 'Multiply both sides by that inverse and reduce. What is the smallest solution?', answer: [3], labels: ['smallest solution'], explanation: 'x ≡ 5 × 2 = 10 ≡ 3 (mod 7). Adding 7 gives the others: 3, 10, 17, 24.' }
  ]
 },
 {
  id: 'q17', title: 'The Kepler week', topic: 'Chapter review: calendar arithmetic', tier: 'Intermediate', sector: 'Timetable Office',
  brief: 'The calendar office wants the weekday of a convoy thousands of days away, and the landing that puts a supply drone one weekday later.',
  lesson: 'Weekdays are least residues mod 7: a date far ahead reduces to its days left over after whole weeks, and a modular inverse mod 7 tells which repeat of a cycle shifts the weekday by one.',
  prompt: 'The Kepler calendar has a week of 7 days, numbered 0 to 6, and today is day 4 of the week. The next convoy leaves in 2851 days: enter the number of the weekday it leaves on. A supply drone also lands today and then every 12 days. Enter the smallest number x of further landings, from 1 to 6, after which it lands on day 5, one day on in the week from today’s day 4: this x is the inverse of 12 mod 7.',
  answer: [6, 3], labels: ['weekday of the convoy', 'landings x'], tolerance: 0.01,
  hints: [
   'Only the days left over after whole weeks matter: reduce the number of days mod 7, add it to today’s number and reduce again.',
   'x landings after today is x × k days later, so you need kx ≡ 1 (mod 7). Reduce k mod 7 first, then find its modular inverse.'
  ],
  solution: '2851 = 407 × 7 + 2, so 2851 ≡ 2 (mod 7), and the convoy leaves on day 4 + 2 = 6: day 6. For the drone, 12 ≡ 5 (mod 7), and 5 × 3 = 15 ≡ 1 (mod 7), so the inverse is 3: 3 landings later, 36 days from today, the drone lands on day 5.',
  xp: 150, prereqs: ['q14', 'q16'],
  artifact: { name: 'Kepler week wheel', description: 'Seven days in a ring, with the convoy and drone dates marked.' },
  sources: [source.r3_1, source.r3_3],
  teaching: {
   intuition: 'A week is a loop of 7 days, so the days of the week are least residues mod 7. Number the days 0 to 6. If today is day s, then N days from now is day s + N, read mod 7: whole weeks change nothing, so only N mod 7 matters, and one more reduction may be needed after adding s. A drone that lands every k days moves the weekday on by k each landing, and again only k mod 7 matters. After x landings it has moved kx days, so it lands one weekday later than today exactly when kx ≡ 1 (mod 7). That is the modular inverse of k mod 7. Because 7 is prime, every k that is not a multiple of 7 has one, and you can find it by trying x = 1 to 6.',
   steps: [
    'Reduce the number of days N mod 7.',
    'Add today’s day number and reduce mod 7 again: that is the weekday N days ahead.',
    'Reduce the drone’s gap k mod 7.',
    'Find the x from 1 to 6 with (k mod 7) × x ≡ 1 (mod 7): it is the number of landings that moves the drone on by exactly one weekday.'
   ],
   example: {
    prompt: 'Today is day 5 of the week. Which weekday is 100 days from now, and what is the inverse of 10 mod 7?',
    steps: [
     '100 = 14 × 7 + 2, so 100 ≡ 2 (mod 7). 5 + 2 = 7 ≡ 0, so it is day 0.',
     '10 ≡ 3 (mod 7), and 3 × 5 = 15 = 2 × 7 + 1, so the inverse is 5.'
    ],
    answer: 'Day 0, and the inverse is 5.'
   },
   pitfalls: [
    'Forgetting to reduce after adding today’s number: day 4 + 5 = 9 is day 2.',
    'Counting today as one of the days, which shifts the answer by one. N days from today is today’s number plus N.',
    'Answering with k mod 7 instead of its inverse. The question is how many landings, not how far one landing moves.'
   ]
  },
  guidance: [
   { prompt: 'What is 2851 mod 7?', answer: [2], labels: ['days mod 7'], explanation: '2851 = 407 × 7 + 2.' },
   { prompt: 'Add that to today’s day 4 and reduce mod 7. On which weekday does the convoy leave?', answer: [6], labels: ['weekday of the convoy'], explanation: '4 + 2 = 6, already below 7.' },
   { prompt: 'Reduce the drone’s gap of 12 days mod 7. What is it?', answer: [5], labels: ['gap mod 7'], explanation: '12 = 1 × 7 + 5.' },
   { prompt: 'Which x from 1 to 6 makes 5x ≡ 1 (mod 7)?', answer: [3], labels: ['landings x'], explanation: '5 × 3 = 15 = 2 × 7 + 1, so x = 3.' }
  ]
 },
 {
  id: 'q18', title: 'The message nobody measured', topic: 'Chinese remainder theorem', tier: 'Intermediate', sector: 'Signal Office',
  brief: 'A stored message has lost its length label, and the repeater mast can only say what is left over when the message is cut into blocks.',
  lesson: 'When no two moduli share a factor bigger than 1, the Chinese remainder theorem says the conditions x ≡ a, x ≡ b, x ≡ c have exactly one solution from 1 to the product of the moduli.',
  prompt: 'The Signal Office stores a message whose length x, in characters, nobody wrote down. The repeater mast only reports remainders: sent in blocks of 4 characters the message leaves 3 over, in blocks of 5 it leaves 1 over, and in blocks of 9 it leaves 7 over. No two of 4, 5 and 9 share a factor bigger than 1. Enter the shortest length x that fits all three reports, then the product 4 × 5 × 9, which is the gap between one length that fits and the next.',
  answer: [151, 180], labels: ['shortest length x', 'product of the moduli'], tolerance: 0.01,
  hints: [
   'By the Chinese remainder theorem, when no two moduli share a factor bigger than 1, exactly one number from 1 to the product of the moduli fits every condition, and the others differ from it by multiples of that product.',
   'Sieve: start at the first remainder and add the first modulus again and again until a number also fits the second condition. Then add the product of the first two moduli again and again until the third condition fits too.'
  ],
  solution: 'Numbers that leave 3 in blocks of 4: 3, 7, 11. The first of them that leaves 1 in blocks of 5 is 11. The numbers that fit both conditions repeat every 4 × 5 = 20: 11, 31, 51, 71, 91, 111, 131, 151. The first of these that leaves 7 in blocks of 9 is 151 = 16 × 9 + 7. By the Chinese remainder theorem the lengths that fit repeat every 4 × 5 × 9 = 180, so the shortest is 151.',
  xp: 150, prereqs: ['q16'],
  artifact: { name: 'Repeater remainder log', description: 'Three leftovers that pin down one message length.' },
  sources: [source.r3_4],
  teaching: {
   intuition: 'Knowing one remainder of a number leaves many possibilities: “2 left over in blocks of 5” fits 2, 7, 12, 17, … But each new remainder for a different block size thins the list. The Chinese remainder theorem says how far: if the moduli m₁, m₂, m₃ are such that no two of them share a factor bigger than 1, then the conditions x ≡ r₁ (mod m₁), x ≡ r₂ (mod m₂) and x ≡ r₃ (mod m₃) have exactly one solution from 1 to m₁ × m₂ × m₃, and every other solution differs from it by a multiple of that product. A hand method is a sieve. List the numbers that fit the first condition, r₁, r₁ + m₁, r₁ + 2m₁, …, until one also fits the second. The numbers that fit both then repeat every m₁ × m₂, so step by that until the third condition fits too. The first number that fits all three is the smallest positive solution.',
   steps: [
    'Check that no two moduli share a factor bigger than 1; then the theorem applies.',
    'Start at the first remainder and add the first modulus repeatedly until a number leaves the second remainder for the second modulus.',
    'From that number, add the product of the first two moduli repeatedly until a number leaves the third remainder for the third modulus.',
    'That number is the smallest positive solution. All solutions are it plus multiples of the product of all three moduli.'
   ],
   example: {
    prompt: 'Find the smallest positive x that leaves 1 in blocks of 3, 2 in blocks of 4 and 3 in blocks of 5.',
    steps: [
     'Fit the first condition: 1, 4, 7, 10. 10 = 2 × 4 + 2, so 10 also fits the second.',
     'Step by 3 × 4 = 12: 10, 22, 34, 46, 58. 58 = 11 × 5 + 3 fits the third.',
     'The solutions repeat every 3 × 4 × 5 = 60.'
    ],
    answer: 'x = 58, and the solutions repeat every 60.'
   },
   pitfalls: [
    'Stepping by the first modulus in the second round. Once two conditions fit, step by the product of their moduli, or the first two conditions break.',
    'Using moduli that share a factor, such as 4 and 6. Then the theorem does not apply: there may be no solution, or the solutions repeat sooner.',
    'Giving 0 or a negative number. The question asks for the smallest positive length.'
   ]
  },
  guidance: [
   { prompt: 'List 3, 7, 11, … (adding 4 each time). Which is the first that leaves 1 in blocks of 5?', answer: [11], labels: ['smallest fitting the first two'], explanation: '3, 7, 11: the last of these, 11, is 2 × 5 + 1.' },
   { prompt: 'Every number that fits the first two conditions is 11 plus a multiple of one step. What is that step?', answer: [20], labels: ['step for the first two'], explanation: '4 and 5 share no factor bigger than 1, so the step is 4 × 5 = 20.' },
   { prompt: 'Add 20 again and again, starting from 11. Which is the first number that leaves 7 in blocks of 9?', answer: [151], labels: ['shortest length x'], explanation: '11, 31, 51, 71, 91, 111, 131, 151: 151 = 16 × 9 + 7.' }
  ]
 },
 {
  id: 'q19', title: 'Squaring down the channel', topic: 'Fast powers by repeated squaring', tier: 'Intermediate', sector: 'Signal Office',
  brief: 'The channel can only carry small numbers, and Mira needs a power far too large to write out before it is reduced.',
  lesson: 'Repeated squaring finds aᵏ mod n by squaring and reducing again and again, then multiplying the squares whose exponents add up to k.',
  prompt: 'The Signal Office’s channel only carries numbers below 41, so every big number goes out as its least residue mod 41. Mira needs 12⁷⁷ mod 41. Using repeated squaring, enter how many squarings it takes to build the list 12, 12², 12⁴, 12⁸, … (each entry the square of the last, reduced mod 41) up to the last entry whose exponent is not more than 77. Then enter the least residue of 12⁷⁷ mod 41.',
  answer: [6, 7], labels: ['squarings', 'least residue of the power'], tolerance: 0.01,
  hints: [
   'Write the exponent as a sum of different powers of 2: 1, 2, 4, 8, 16, … The largest power in that sum is as far as the list of squares has to go, and each new entry is the last one squared and reduced.',
   'Multiply together the entries whose exponents add up to the exponent you need, reducing mod n after every multiplication.'
  ],
  solution: '77 = 64 + 8 + 4 + 1, and the largest power of 2 here is 64. The list: 12² = 144 ≡ 21, 12⁴ ≡ 21² = 441 ≡ 31, 12⁸ ≡ 31² = 961 ≡ 18, 12¹⁶ ≡ 18² = 324 ≡ 37, 12³² ≡ 37² = 1369 ≡ 16, 12⁶⁴ ≡ 16² = 256 ≡ 10 (mod 41). Reaching 12⁶⁴ takes 6 squarings. Then 12⁷⁷ = 12⁶⁴ × 12⁸ × 12⁴ × 12 ≡ 10 × 18 × 31 × 12: 10 × 18 = 180 ≡ 16, then 16 × 31 = 496 ≡ 4, then 4 × 12 = 48 ≡ 7. So 12⁷⁷ ≡ 7 (mod 41).',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Squaring ladder', description: 'A short ladder of squares that climbs to a huge power.' },
  sources: [source.bc1_26],
  teaching: {
   intuition: 'A power such as 7⁴⁵ has 39 digits, so nobody writes it out. Mod 31 we never need to: products can be reduced at every step. Multiplying by 7 forty-four times would work, but there is a much faster way. Square 7 to get 7², square that to get 7⁴, then 7⁸, 7¹⁶ and 7³², reducing mod 31 after every squaring so the numbers stay small. Each squaring doubles the exponent, so five squarings reach 7³². Every whole number is a sum of different powers of 2, such as 45 = 32 + 8 + 4 + 1, and exponents add when powers multiply, so 7⁴⁵ = 7³² × 7⁸ × 7⁴ × 7. Multiply those few entries of the list, reducing after each multiplication. This is repeated squaring: a few squarings and a few products instead of dozens of multiplications.',
   steps: [
    'Write the exponent k as a sum of different powers of 2, largest first: take the biggest power of 2 not above k, subtract it, and repeat with what is left.',
    'Build the list a, a², a⁴, a⁸, … mod n, each entry the square of the one before, reduced mod n, up to the largest power of 2 in that sum. Count the squarings.',
    'Multiply together the entries whose exponents appear in the sum, reducing mod n after each multiplication.',
    'The last result is the least residue of aᵏ mod n.'
   ],
   example: {
    prompt: 'Find 5¹¹ mod 13 by repeated squaring.',
    steps: [
     '11 = 8 + 2 + 1.',
     'The list mod 13: 5, then 5² = 25 ≡ 12, 5⁴ ≡ 12² = 144 ≡ 1, 5⁸ ≡ 1² = 1. That is 3 squarings.',
     '5¹¹ = 5⁸ × 5² × 5 ≡ 1 × 12 × 5 = 60 ≡ 8 (mod 13).'
    ],
    answer: '3 squarings, and 5¹¹ ≡ 8 (mod 13).'
   },
   pitfalls: [
    'Multiplying exponents instead of adding them: 5⁸ × 5² is 5¹⁰, not 5¹⁶.',
    'Forgetting to reduce after a squaring, so the numbers grow out of hand.',
    'Using the list entry for 4 where the sum needs 8: the list is indexed by exponents 1, 2, 4, 8, …, not by position.'
   ]
  },
  guidance: [
   { prompt: 'Write 77 as a sum of different powers of 2. The largest of them is 2 to the power j: how many squarings j does the list need?', answer: [6], labels: ['squarings'], explanation: '77 = 64 + 8 + 4 + 1. The largest power is 64, and 1, 2, 4, … reach 64 after 6 doublings, so 6 squarings.' },
   { prompt: 'Square and reduce mod 41 again and again. What is the last entry of the list, 12⁶⁴ mod 41?', answer: [10], labels: ['last entry of the list'], explanation: '12² = 144 ≡ 21, 12⁴ ≡ 21² = 441 ≡ 31, 12⁸ ≡ 31² = 961 ≡ 18, 12¹⁶ ≡ 18² = 324 ≡ 37, 12³² ≡ 37² = 1369 ≡ 16, 12⁶⁴ ≡ 16² = 256 ≡ 10 (mod 41).' },
   { prompt: 'Multiply the entries for 64 + 8 + 4 + 1, reducing as you go. What is 12⁷⁷ mod 41?', answer: [7], labels: ['least residue of the power'], explanation: '12⁷⁷ = 12⁶⁴ × 12⁸ × 12⁴ × 12 ≡ 10 × 18 × 31 × 12: 10 × 18 = 180 ≡ 16, then 16 × 31 = 496 ≡ 4, then 4 × 12 = 48 ≡ 7.' }
  ]
 },
 {
  id: 'q20', title: 'The prime channel shortcut', topic: 'Fermat’s little theorem', tier: 'Intermediate', sector: 'Signal Office',
  brief: 'The long-range channel works modulo a prime, and Mira needs a power whose exponent runs into the hundreds of thousands.',
  lesson: 'Fermat’s little theorem: if p is prime and does not divide a, then a to the power p − 1 is ≡ 1 (mod p), so an exponent can be reduced mod p − 1.',
  prompt: 'The long-range channel of the Signal Office works mod 23, and 23 is prime. Mira needs 5⁴⁸¹²¹³ mod 23. Enter the remainder when the exponent 481213 is divided by 23 − 1, the only part of the exponent that matters by Fermat’s little theorem. Then enter the least residue of 5⁴⁸¹²¹³ mod 23.',
  answer: [7, 17], labels: ['reduced exponent', 'least residue of the power'], tolerance: 0.01,
  hints: [
   'Fermat’s little theorem: when p is prime and does not divide a, a to the power p − 1 is ≡ 1 (mod p). Every whole block of p − 1 in the exponent multiplies by 1, so it can be dropped.',
   'Write the exponent as q × (p − 1) + r, keep only r, and find a to the power r mod p by repeated squaring.'
  ],
  solution: '23 is prime and does not divide 5, so 5²² ≡ 1 (mod 23). 481213 = 21873 × 22 + 7, so 5⁴⁸¹²¹³ = (5²²)²¹⁸⁷³ × 5⁷ ≡ 1 × 5⁷ (mod 23). By repeated squaring: 5² = 25 ≡ 2, 5⁴ ≡ 2² = 4 (mod 23); 5⁷ = 5⁴ × 5² × 5 ≡ 4 × 2 × 5: 4 × 2 = 8, then 8 × 5 = 40 ≡ 17. So 5⁴⁸¹²¹³ ≡ 17 (mod 23).',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Prime channel key', description: 'A cycle of p − 1 that cuts any exponent down to size.' },
  sources: [source.r3_5],
  teaching: {
   intuition: 'A prime is a whole number above 1 whose only divisors are 1 and itself, such as 7, 23 or 97. Primes give powers a regular rhythm. Take p = 7 and a = 3: the powers 3, 3², 3³, … are ≡ 3, 2, 6, 4, 5, 1 (mod 7), and then the pattern starts again, because 3⁶ ≡ 1. Fermat’s little theorem says this always happens by the power p − 1: if p is prime and does not divide a, then a to the power p − 1 is ≡ 1 (mod p). So in a huge exponent, every whole block of p − 1 contributes a factor ≡ 1 and can be dropped. Write the exponent as k = q × (p − 1) + r. Then aᵏ is a product of q copies of (a to the power p − 1), times aʳ, so aᵏ ≡ 1 × aʳ (mod p). Only the remainder r of k on division by p − 1 matters, and aʳ is small enough for repeated squaring.',
   steps: [
    'Check that p is prime and does not divide a, so Fermat’s little theorem applies.',
    'Divide the exponent k by p − 1 and keep the remainder r.',
    'Find a to the power r mod p by repeated squaring.',
    'That residue is also the least residue of aᵏ mod p.'
   ],
   example: {
    prompt: 'Find 3¹⁰⁰⁰ mod 7.',
    steps: [
     '7 is prime and does not divide 3, so 3⁶ ≡ 1 (mod 7).',
     '1000 = 166 × 6 + 4, so 3¹⁰⁰⁰ ≡ 3⁴ (mod 7).',
     '3² = 9 ≡ 2 and 3⁴ ≡ 2² = 4 (mod 7).'
    ],
    answer: '3¹⁰⁰⁰ ≡ 4 (mod 7).'
   },
   pitfalls: [
    'Reducing the exponent mod p instead of mod p − 1.',
    'Reducing the base mod p − 1. The base is reduced mod p; only the exponent is reduced mod p − 1.',
    'Using the theorem when the modulus is not prime, or when p divides a. Then a to the power p − 1 need not be ≡ 1.'
   ]
  },
  guidance: [
   { prompt: 'By Fermat’s little theorem, 5 to which power is ≡ 1 (mod 23)?', answer: [22], labels: ['p − 1'], explanation: '23 is prime and does not divide 5, so 5²² ≡ 1 (mod 23).' },
   { prompt: 'Divide 481213 by 22. What is the remainder r?', answer: [7], labels: ['reduced exponent'], explanation: '481213 = 21873 × 22 + 7, so only 5⁷ is left.' },
   { prompt: 'Find 5⁷ mod 23 by repeated squaring. What is it?', answer: [17], labels: ['least residue of the power'], explanation: '5² = 25 ≡ 2, 5⁴ ≡ 2² = 4 (mod 23); 5⁷ = 5⁴ × 5² × 5 ≡ 4 × 2 × 5: 4 × 2 = 8, then 8 × 5 = 40 ≡ 17.' }
  ]
 }
);
})();
