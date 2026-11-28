/* Number theory: the hidden life of whole numbers missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/number/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Euler's φ-function [R3.2, R4.2]
     q22  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Euler's theorem: last two digits [R3.5]
     q23  ch 4 Powers and remainders · Intermediate, 150 XP · sector 'Signal Office' · Chapter review: signal checks [R3.4, R3.5]
     q24  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · Wilson's theorem [R3.5]
     q25  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · The Möbius function [R4.3]
     q26  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · Perfect numbers and Mersenne primes [R4.4]
     q27  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · The order of a mod n [R5.1]
     q28  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · Primitive roots [R5.1, R5.2]
     q29  ch 5 Special numbers and orders · Intermediate, 150 XP · sector 'Calendar Hall' · Chapter review: the index of a number [R5.1]
     q30  ch 6 Squares and primes · Advanced, 200 XP · sector 'Survey Field' · Quadratic residues [R5.4] */
(function(){
'use strict';
/* Raji, Elementary Number Theory (LibreTexts); Barrus and Clark, Elementary Number Theory (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /Elementary Number Theory/ (Elementary Number Theory (Raji; Barrus and Clark)).
   A title reads like: Raji, Elementary Number Theory (LibreTexts) — 3.4 The Chinese Remainder Theorem
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 r3_2: { title: "Raji, Elementary Number Theory (LibreTexts) — 3.2 Residue Systems and Euler’s φ-Function", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.02%3A_Residue_Systems_and_Eulers_-Function", description: "Defines Euler’s φ-function as the count of positive integers below n that are relatively prime to n.", verified: "2026-11-27" },
 r3_4: { title: "Raji, Elementary Number Theory (LibreTexts) — 3.4 The Chinese Remainder Theorem", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.04%3A_The_Chinese_Remainder_Theorem", description: "A system of congruences with pairwise coprime moduli has one solution modulo the product of the moduli.", verified: "2026-11-27" },
 r3_5: { title: "Raji, Elementary Number Theory (LibreTexts) — 3.5 Theorems of Fermat, Euler, and Wilson", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/03%3A_Congruences/3.05%3A_Theorems_of_Fermat_Euler_and_Wilson", description: "Fermat’s little theorem, Euler’s theorem a^φ(m) ≡ 1 (mod m) for coprime a and m, and Wilson’s theorem (p − 1)! ≡ −1 (mod p).", verified: "2026-11-27" },
 r4_2: { title: "Raji, Elementary Number Theory (LibreTexts) — 4.2 Multiplicative Number Theoretic Functions", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.02%3A_Multiplicative_Number_Theoretic_Functions", description: "φ is multiplicative, φ(p^m) = p^m − p^(m−1), and the product formula for φ(n) from the factorisation of n.", verified: "2026-11-27" },
 r4_3: { title: "Raji, Elementary Number Theory (LibreTexts) — 4.3 The Mobius Function and the Mobius Inversion Formula", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.03%3A_The_Mobius_Function_and_the_Mobius_Inversion_Formula", description: "The Möbius function μ(n), and the sum of μ(d) over the divisors of n: 1 for n = 1 and 0 for n above 1.", verified: "2026-11-27" },
 r4_4: { title: "Raji, Elementary Number Theory (LibreTexts) — 4.4 Perfect, Mersenne, and Fermat Numbers", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.04%3A_Perfect_Mersenne_and_Fermat_Numbers", description: "Perfect numbers (σ(n) = 2n), Mersenne numbers 2^l − 1, and the even perfect numbers 2^(l−1)(2^l − 1) with 2^l − 1 prime.", verified: "2026-11-27" },
 r5_1: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.1 The order of Integers and Primitive Roots", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.01%3A_The_order_of_Integers_and_Primitive_Roots", description: "The order of a modulo m, primitive roots, the powers of a primitive root as a reduced residue system, and the count φ(φ(m)).", verified: "2026-11-27" },
 r5_1_index: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.1 The order of Integers and Primitive Roots", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.01%3A_The_order_of_Integers_and_Primitive_Roots", description: "Cited for the order of a modulo m and for primitive roots, whose powers run through every residue coprime to m. The index (discrete logarithm) is not on this page: the mission works it out itself from those two facts.", verified: "2026-11-27" },
 r5_2: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.2 Primitive Roots for Primes", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.02%3A_Primitive_Roots_for_Primes", description: "Every prime has a primitive root, and a prime p has φ(p − 1) of them.", verified: "2026-11-27" },
 r5_4: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.4 Introduction to Quadratic Residues and Nonresidues", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.04%3A_Introduction_to_Quadratic_Residues_and_Nonresidues", description: "Quadratic residues; for an odd prime, x² ≡ a has no solution or exactly two, and there are (p − 1)/2 residues.", verified: "2026-11-27" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "Counting the clean codes", topic: "Euler’s φ-function", tier: "Intermediate", sector: "Signal Office",
  brief: "The Signal Office only sends on codes that share nothing with the channel size, and it wants to know how many such codes a channel has.",
  lesson: "φ(n) counts the numbers from 1 to n that are coprime to n; for n = pᵃ × qᵇ × … it is φ(pᵃ) × φ(qᵇ) × …, with φ(pᵃ) = pᵃ − pᵃ⁻¹.",
  prompt: "The Signal Office numbers the codes on one channel from 1 to 360, and 360 = 2³ × 3² × 5. A code is clean when it is coprime to 360: it shares no prime factor with 360. Enter φ(360), the number of clean codes, then the number of codes from 1 to 360 that are not clean.",
  answer: [96,264], labels: ["φ(n)","codes not clean"], tolerance: 0.01,
  hints: [
   "For one prime power pᵃ, φ(pᵃ) = pᵃ − pᵃ⁻¹: the numbers that share a factor with pᵃ are exactly the multiples of p, and every p-th number is one.",
   "φ of a product of powers of different primes is the product of their φ values. The codes that are not clean are the rest: n − φ(n) of them."
  ],
  solution: "360 = 2³ × 3² × 5. φ(2³) = 8 − 4 = 4; φ(3²) = 9 − 3 = 6; φ(5) = 5 − 1 = 4. The three prime powers belong to different primes, so φ(360) = 4 × 6 × 4 = 96. That leaves 360 − 96 = 264 codes that share a prime factor with 360.",
  xp: 150, prereqs: ["q04"],
  artifact: { name: "Clean code tally", description: "A channel’s codes with every multiple of its primes struck out." },
  sources: [source.r3_2, source.r4_2],
  teaching: {
   intuition: "Two whole numbers are coprime when they share no prime factor: 8 and 15 are coprime, 8 and 6 are not, because both are even. Euler’s phi function, written φ(n) with the Greek letter phi, counts the numbers from 1 to n that are coprime to n. For a prime p every number from 1 to p − 1 is coprime to p, so φ(p) = p − 1. For a prime power pᵃ, the numbers that share a factor with it are exactly the multiples of p, and one number in every p is a multiple, so φ(pᵃ) = pᵃ − pᵃ⁻¹. The striking fact is that φ multiplies: when m and n are coprime, φ(m × n) = φ(m) × φ(n). So once n is written as a prime factorisation, φ(n) is the product of φ of each prime power in it.",
   steps: [
    "Write n as a product of powers of different primes.",
    "For each prime power pᵃ work out φ(pᵃ) = pᵃ − pᵃ⁻¹; for a single prime, that is p − 1.",
    "Multiply these values together: the result is φ(n).",
    "The numbers from 1 to n that are not coprime to n number n − φ(n)."
   ],
   example: {
    prompt: "A channel has the codes 1 to 60, and 60 = 2² × 3 × 5. How many codes are coprime to 60?",
    steps: [
     "φ(2²) = 4 − 2 = 2, φ(3) = 3 − 1 = 2 and φ(5) = 5 − 1 = 4.",
     "Multiply: φ(60) = 2 × 2 × 4 = 16.",
     "Check one: 7 shares no prime with 60, so it is one of the 16; 9 shares the prime 3, so it is not."
    ],
    answer: "φ(60) = 16, and 60 − 16 = 44 codes are not coprime to 60."
   },
   pitfalls: [
    "Using pᵃ − 1 for a prime power: φ(8) = 8 − 4 = 4, not 7, because 2, 4, 6 and 8 all share the factor 2.",
    "Multiplying φ values of two numbers that share a prime: φ(4 × 2) is φ(8) = 4, not φ(4) × φ(2) = 2.",
    "Forgetting that 1 counts: 1 shares no prime factor with anything, so it is always coprime to n."
   ]
  },
  guidance: [
   { prompt: "Work out φ of each prime power in 2³ × 3² × 5, in that order.", answer: [4,6,4], labels: ["φ of first power","φ of second power","φ of third power"], explanation: "φ(2³) = 8 − 4 = 4; φ(3²) = 9 − 3 = 6; φ(5) = 5 − 1 = 4. Each count leaves out the multiples of its own prime." },
   { prompt: "Multiply the three values. What is φ(360)?", answer: [96], labels: ["φ(n)"], explanation: "4 × 6 × 4 = 96, because φ multiplies across powers of different primes." },
   { prompt: "How many of the codes 1 to 360 are not clean?", answer: [264], labels: ["codes not clean"], explanation: "360 − 96 = 264. These are the codes that share at least one of the primes 2, 3, 5 with 360." }
  ]
 },
 {
  id: "q22", title: "The last two digits of a giant", topic: "Euler’s theorem: last two digits", tier: "Intermediate", sector: "Signal Office",
  brief: "A message check code is the last two digits of a power far too big to write out, and the Signal Office needs it before the next transmission.",
  lesson: "When a and n are coprime, a to the power φ(n) leaves remainder 1 mod n, so the exponent can be reduced mod φ(n); for n = 100 that gives the last two digits.",
  prompt: "The Signal Office’s check code for a message is the last two digits of 13¹²³⁴: its remainder on division by 100. 13 and 100 are coprime. Enter r, the remainder of 1234 on division by φ(100), then 13¹²³⁴ mod 100 as a number from 0 to 99, then the tens digit of the check code (0 when the last two digits are 00 to 09).",
  answer: [34,89,8], labels: ["r","last two digits","tens digit"], tolerance: 0.01,
  hints: [
   "Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. Here φ(100) = 40, so every whole block of 40 in the exponent can be dropped.",
   "Write r as a sum of powers of 2, build those powers by squaring again and again, and reduce mod 100 after every multiplication."
  ],
  solution: "100 = 2² × 5², so φ(100) = 2 × 20 = 40, and 13 is coprime to 100. 1234 = 40 × 30 + 34, and 13⁴⁰ ≡ 1 (mod 100), so 13¹²³⁴ ≡ 13³⁴ (mod 100). Squaring: 13² = 169 ≡ 69, 13⁴ ≡ 69² = 4761 ≡ 61, 13⁸ ≡ 61² = 3721 ≡ 21, 13¹⁶ ≡ 21² = 441 ≡ 41, 13³² ≡ 41² = 1681 ≡ 81. 34 = 32 + 2, so 13³⁴ ≡ 13³² × 13²: 81 × 69 = 5589 ≡ 89. So the last two digits are 89: 13¹²³⁴ mod 100 = 89, and the tens digit is 8.",
  xp: 150, prereqs: ["q20","q21"],
  artifact: { name: "Check-code slide rule", description: "A strip marked in blocks of 40 for cutting exponents down to size." },
  sources: [source.r3_5],
  teaching: {
   intuition: "The last two digits of a whole number are its remainder on division by 100: 4761 ends in 61, and 4761 mod 100 = 61. Fermat’s little theorem says that a to the power p − 1 leaves remainder 1 on division by a prime p. Euler’s theorem is the same idea for any n: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. For n = 100, φ(100) = 40, so a⁴⁰ ≡ 1 (mod 100) for every a with no factor 2 or 5. That makes huge powers easy. Every whole block of 40 in the exponent multiplies the answer by 1, so only the remainder of the exponent on division by 40 matters. Then repeated squaring, reducing mod 100 after each step, finishes the job with small numbers.",
   steps: [
    "Check that a and 100 are coprime: a must be odd and not end in 5 or 0.",
    "Divide the exponent k by φ(100) = 40 and keep the remainder r. Then aᵏ ≡ aʳ (mod 100).",
    "Work out aʳ mod 100 by repeated squaring: a², a⁴, a⁸, … mod 100, then multiply the ones whose exponents add up to r.",
    "The result, from 0 to 99, is the last two digits. Its tens digit is the first of the two."
   ],
   example: {
    prompt: "What are the last two digits of 3²⁰³?",
    steps: [
     "3 and 100 are coprime, and 203 = 40 × 5 + 3, so 3²⁰³ ≡ 3³ (mod 100).",
     "3³ = 27."
    ],
    answer: "3²⁰³ ends in 27; the tens digit is 2."
   },
   pitfalls: [
    "Reducing the exponent mod 100 instead of mod φ(100) = 40. The exponent cycles with φ(n), not with n.",
    "Using the rule when a shares a factor with 100: for a = 2 or a = 5 the powers never come back to 1 mod 100.",
    "Writing the last two digits 07 as 70. A remainder of 7 means the tens digit is 0."
   ]
  },
  guidance: [
   { prompt: "100 = 2² × 5². What is φ(100)?", answer: [40], labels: ["φ(100)"], explanation: "φ(2²) = 4 − 2 = 2 and φ(5²) = 25 − 5 = 20, so φ(100) = 2 × 20 = 40." },
   { prompt: "Divide 1234 by 40. What is the remainder r?", answer: [34], labels: ["r"], explanation: "1234 = 40 × 30 + 34. By Euler’s theorem 13⁴⁰ ≡ 1 (mod 100), so each block of 40 contributes a factor 1 and 13¹²³⁴ ≡ 13³⁴ (mod 100)." },
   { prompt: "Square repeatedly mod 100 and combine the powers you need. What is 13³⁴ mod 100?", answer: [89], labels: ["last two digits"], explanation: "13² = 169 ≡ 69, 13⁴ ≡ 69² = 4761 ≡ 61, 13⁸ ≡ 61² = 3721 ≡ 21, 13¹⁶ ≡ 21² = 441 ≡ 41, 13³² ≡ 41² = 1681 ≡ 81. 34 = 32 + 2, so 13³⁴ ≡ 13³² × 13²: 81 × 69 = 5589 ≡ 89." },
   { prompt: "The last two digits are 89. What is the tens digit?", answer: [8], labels: ["tens digit"], explanation: "The tens digit is the first of the two: 8." }
  ]
 },
 {
  id: "q23", title: "Checking the relay signal", topic: "Chapter review: signal checks", tier: "Intermediate", sector: "Signal Office",
  brief: "Two relay counters on the mast agree on one signal number only through their remainders, and the office must rebuild it and send its check code.",
  lesson: "Rebuild a number from its remainders with the Chinese remainder theorem, then reduce its power mod 100 with Euler’s theorem and repeated squaring.",
  prompt: "Two relay counters on the repeater mast fix a signal number x: x leaves remainder 2 on division by 5 and remainder 3 on division by 7. The smallest positive such x is coprime to 100. Enter that x, then r, the remainder of 3215 on division by 40, then the check code x³²¹⁵ mod 100, a number from 0 to 99.",
  answer: [17,15,93], labels: ["x","r","check code"], tolerance: 0.01,
  hints: [
   "List the positive numbers with the right remainder for the larger modulus, adding that modulus each time, and keep the first one that also has the right remainder for the smaller modulus.",
   "φ(100) = 40 and x is coprime to 100, so by Euler’s theorem whole blocks of 40 can be dropped from the exponent before you square."
  ],
  solution: "The numbers with remainder 3 on division by 7 are 3, 10, 17; the last of these leaves remainder 2 on division by 5, so x = 17. 5 and 7 are coprime, so by the Chinese remainder theorem this is the only answer below 35. Next, 3215 = 40 × 80 + 15 and φ(100) = 40, so 17³²¹⁵ ≡ 17¹⁵ (mod 100). Squaring: 17² = 289 ≡ 89, 17⁴ ≡ 89² = 7921 ≡ 21, 17⁸ ≡ 21² = 441 ≡ 41. 15 = 8 + 4 + 2 + 1, so 17¹⁵ ≡ 17⁸ × 17⁴ × 17² × 17: 41 × 21 = 861 ≡ 61, then 61 × 89 = 5429 ≡ 29, then 29 × 17 = 493 ≡ 93. The check code is 93.",
  xp: 150, prereqs: ["q18","q22"],
  artifact: { name: "Relay logbook", description: "Two counters’ remainders, the signal number they fix and its check code." },
  sources: [source.r3_4, source.r3_5],
  teaching: {
   intuition: "This chapter review joins two tools. The Chinese remainder theorem says that when two moduli m and n are coprime, the remainders of x on division by m and by n fix x completely among the numbers 0 to m × n − 1. To find it, list the numbers with the right remainder for the larger modulus and test each against the smaller one. Euler’s theorem then handles a huge power of x: if x is coprime to 100, x to the power 40 leaves remainder 1 on division by 100, because φ(100) = 40. So the exponent can be cut down to its remainder on division by 40, and repeated squaring mod 100 finishes the check code.",
   steps: [
    "List the positive numbers with the right remainder for the larger modulus: start at that remainder (or at the modulus, if the remainder is 0) and add the modulus each time.",
    "Stop at the first that has the right remainder for the smaller modulus: that is the smallest positive x.",
    "Divide the exponent by 40 and keep the remainder r; x to the exponent is then congruent to xʳ mod 100.",
    "Find xʳ mod 100 by repeated squaring, reducing after every multiplication."
   ],
   example: {
    prompt: "x leaves remainder 1 on division by 3 and remainder 3 on division by 4. What are x and x¹⁰⁰² mod 100?",
    steps: [
     "Numbers with remainder 3 on division by 4: 3, 7. 3 leaves 0 on division by 3, 7 leaves 1, so x = 7.",
     "7 is coprime to 100 and 1002 = 40 × 25 + 2, so 7¹⁰⁰² ≡ 7² = 49 (mod 100)."
    ],
    answer: "x = 7 and the check code is 49."
   },
   pitfalls: [
    "Stopping at a number with the right remainder for one modulus only. Check both remainders before you accept x.",
    "Reducing the exponent mod 100 instead of mod 40.",
    "Letting the numbers grow while squaring. Reduce mod 100 after every multiplication, so you never work with more than four digits."
   ]
  },
  guidance: [
   { prompt: "List 3, 10, … (adding 7 each time) and find the first that leaves remainder 2 on division by 5. What is x?", answer: [17], labels: ["x"], explanation: "3, 10, 17: 17 = 5 × 3 + 2, so x = 17." },
   { prompt: "Divide 3215 by 40. What is the remainder r?", answer: [15], labels: ["r"], explanation: "3215 = 40 × 80 + 15, and 17⁴⁰ ≡ 1 (mod 100) by Euler’s theorem, so 17³²¹⁵ ≡ 17¹⁵ (mod 100)." },
   { prompt: "Square repeatedly mod 100. What is 17¹⁵ mod 100?", answer: [93], labels: ["check code"], explanation: "17² = 289 ≡ 89, 17⁴ ≡ 89² = 7921 ≡ 21, 17⁸ ≡ 21² = 441 ≡ 41. 15 = 8 + 4 + 2 + 1, so 17¹⁵ ≡ 17⁸ × 17⁴ × 17² × 17: 41 × 21 = 861 ≡ 61, then 61 × 89 = 5429 ≡ 29, then 29 × 17 = 493 ≡ 93." }
  ]
 },
 {
  id: "q24", title: "Wilson’s lock on the gear wheels", topic: "Wilson’s theorem", tier: "Intermediate", sector: "Calendar Hall",
  brief: "The Calendar Hall’s lock asks for remainders of enormous products, and no one wants to multiply sixty numbers to open a door.",
  lesson: "For a prime p, (p − 1)! ≡ −1 (mod p); peeling factors off the end gives (p − 2)! ≡ 1 and (p − 3)! ≡ (p − 1) ÷ 2.",
  prompt: "The Calendar Hall’s lock takes three codes from its two gear wheels, whose tooth counts are the primes 31 and 13. Enter (31 − 1)! mod 31, then (31 − 2)! mod 31, then (13 − 3)! mod 13. Type each as a least residue: a remainder from 0 to one less than the prime.",
  answer: [30,1,6], labels: ["(p − 1)! mod p","(p − 2)! mod p","(q − 3)! mod q"], tolerance: 0.01,
  hints: [
   "Wilson’s theorem: for a prime p, (p − 1)! ≡ −1 (mod p), and the least residue of −1 is p − 1.",
   "Peel off the last factor: (p − 1)! = (p − 2)! × (p − 1) with p − 1 ≡ −1, and (p − 2)! = (p − 3)! × (p − 2) with p − 2 ≡ −2. Then find the residue that the factor turns into the known value."
  ],
  solution: "By Wilson’s theorem (31 − 1)! ≡ −1 ≡ 30 (mod 31). Next, 30! = 29! × 30 and 30 ≡ −1, so −29! ≡ −1 and 29! ≡ 1 (mod 31). For the second wheel the same step gives 11! ≡ 1 (mod 13). Then 11! = 10! × 11 with 11 ≡ −2, so −2 × 10! ≡ 1 (mod 13). y = 6 works: −2 × 6 = −12 = 1 − 13 ≡ 1. Only one residue works, because 13 is an odd prime, so (13 − 3)! ≡ 6 (mod 13).",
  xp: 150, prereqs: ["q20"],
  artifact: { name: "Gear-wheel lock", description: "A lock whose combination is a factorial read mod a prime." },
  sources: [source.r3_5],
  teaching: {
   intuition: "Recall that n! (n factorial) is 1 × 2 × 3 × … × n, so 5! = 120. Factorials grow fast: 30! has 33 digits. Wilson’s theorem gives the remainder of one of them for free: when p is prime, (p − 1)! ≡ −1 (mod p), so (p − 1)! leaves remainder p − 1. The reason is pairing: each number from 2 to p − 2 pairs with a different partner in that range whose product with it leaves remainder 1, so those pairs vanish and only 1 × (p − 1) is left, which is −1 mod p. From there, peel factors off the end. (p − 1)! = (p − 2)! × (p − 1), and p − 1 ≡ −1, so (p − 2)! ≡ 1. Then (p − 2)! = (p − 3)! × (p − 2), and p − 2 ≡ −2, so −2 × (p − 3)! ≡ 1, and the residue that does that is (p − 1) ÷ 2.",
   steps: [
    "Wilson’s theorem: (p − 1)! leaves remainder p − 1 on division by the prime p.",
    "Removing the factor p − 1, which is −1 mod p, flips the sign: (p − 2)! ≡ 1 (mod p).",
    "Removing the factor p − 2, which is −2 mod p, needs a residue y with −2 × y ≡ 1 (mod p).",
    "y = (p − 1) ÷ 2 works, because −2 × (p − 1) ÷ 2 = 1 − p, which leaves remainder 1."
   ],
   example: {
    prompt: "For p = 7, find 6! mod 7, 5! mod 7 and 4! mod 7.",
    steps: [
     "6! = 720 = 7 × 102 + 6, so 6! ≡ 6, which is −1 mod 7, as Wilson’s theorem says.",
     "5! = 120 = 7 × 17 + 1, so 5! ≡ 1.",
     "4! = 24 = 7 × 3 + 3, so 4! ≡ 3, and (7 − 1) ÷ 2 = 3."
    ],
    answer: "6, 1 and 3."
   },
   pitfalls: [
    "Typing −1 instead of the least residue p − 1.",
    "Using the rule for a number that is not prime: 5! = 120 leaves remainder 0 on division by 6.",
    "Peeling a factor without changing its sign: p − 2 is −2 mod p, not 2."
   ]
  },
  guidance: [
   { prompt: "By Wilson’s theorem, what is (31 − 1)! mod 31?", answer: [30], labels: ["(p − 1)! mod p"], explanation: "(31 − 1)! ≡ −1 (mod 31), and −1 + 31 = 30 is its least residue." },
   { prompt: "30! = 29! × 30, and 30 ≡ −1 (mod 31). What is 29! mod 31?", answer: [1], labels: ["(p − 2)! mod p"], explanation: "−29! ≡ 30! ≡ −1, so 29! ≡ 1 (mod 31)." },
   { prompt: "For the second wheel 11! ≡ 1 (mod 13), and 11! = 10! × 11 with 11 ≡ −2. Which residue y gives −2 × y ≡ 1 (mod 13)?", answer: [6], labels: ["y"], explanation: "−2 × 6 = −12, which is 1 − 13, so it leaves remainder 1. Hence 10! ≡ 6 (mod 13)." }
  ]
 },
 {
  id: "q25", title: "The cycle signs of the hall", topic: "The Möbius function", tier: "Intermediate", sector: "Calendar Hall",
  brief: "Each calendar cycle in the hall gets a sign of plus, minus or nothing, and the keepers want the signs of a cycle and of all its sub-cycles.",
  lesson: "μ(n) is 0 unless n is square-free; then it is 1 or −1 as n has an even or odd number of distinct primes. Over all divisors of any n above 1, the μ values add up to 0.",
  prompt: "A calendar cycle in the hall is 84 days long, and 84 = 2² × 3 × 7. Enter μ(84) (type −1, 0 or 1), then how many divisors d of 84 have μ(d) not equal to 0, then the sum of μ(d) over all the divisors d of 84.",
  answer: [0,8,0], labels: ["μ(n)","square-free divisors","sum of μ(d)"], tolerance: 0.01,
  hints: [
   "μ(n) is 0 when some prime appears twice or more in the factorisation of n. Otherwise n is square-free, and μ(n) is 1 for an even number of distinct primes and −1 for an odd number.",
   "A square-free divisor takes each distinct prime of n once or leaves it out, so there are 2 to the power (number of distinct primes) of them. Pair each one with the divisor that swaps the smallest prime in or out: the pair’s μ values cancel."
  ],
  solution: "84 = 2² × 3 × 7 has 3 distinct primes. 2² divides 84, so 84 is not square-free and μ(84) = 0. The divisors with μ(d) not 0 are the square-free ones: products of some of the primes 2, 3, 7, each used at most once. There are 2³ = 8 of them. 4 use an even number of primes (μ = 1) and 4 an odd number (μ = −1), and every other divisor has μ(d) = 0, so the sum is 4 − 4 = 0.",
  xp: 150, prereqs: ["q04"],
  artifact: { name: "Sign wheel", description: "A wheel of cycle lengths, each marked plus, minus or blank." },
  sources: [source.r4_3],
  teaching: {
   intuition: "A number is square-free when no prime appears twice in its factorisation: 30 = 2 × 3 × 5 is square-free, 12 = 2² × 3 is not. The Möbius function μ(n), with the Greek letter mu, gives each number a sign. μ(1) = 1. If n is not square-free, μ(n) = 0. If n is square-free with k distinct primes, μ(n) = (−1)ᵏ: 1 for an even number of primes and −1 for an odd number. So μ(6) = 1, μ(30) = −1 and μ(12) = 0. The remarkable fact is what happens over the divisors of n: for every n above 1, the values μ(d) over all the divisors d of n add up to exactly 0. Only the square-free divisors count, and they can be paired off by putting the smallest prime in or taking it out, which changes the sign. For n = 1 the sum is μ(1) = 1.",
   steps: [
    "Factorise n and count its distinct primes k.",
    "If any prime appears with exponent 2 or more, μ(n) = 0; otherwise μ(n) = (−1)ᵏ.",
    "The divisors with μ(d) not 0 are the square-free ones: choose each of the k primes or not, 2ᵏ choices.",
    "Half of those 2ᵏ have an even number of primes and half an odd number, so the sum of μ(d) over the divisors of n is 0 for n above 1."
   ],
   example: {
    prompt: "n = 30 = 2 × 3 × 5. Find μ(30) and the sum of μ(d) over the divisors of 30.",
    steps: [
     "30 is square-free with 3 primes, so μ(30) = (−1)³ = −1.",
     "Divisors: μ(1) = 1; μ(2) = μ(3) = μ(5) = −1; μ(6) = μ(10) = μ(15) = 1; μ(30) = −1.",
     "Sum: 1 − 3 + 3 − 1 = 0."
    ],
    answer: "μ(30) = −1, all 8 divisors are square-free, and the sum is 0."
   },
   pitfalls: [
    "Counting a prime power as one prime: 12 = 2² × 3 is not square-free, so μ(12) = 0, not 1.",
    "Forgetting the divisor 1, whose μ is 1: without it the sum would not come out to 0.",
    "Counting all the divisors instead of the square-free ones: 12 has 6 divisors but only 4 square-free ones (1, 2, 3, 6)."
   ]
  },
  guidance: [
   { prompt: "How many distinct primes divide 84?", answer: [3], labels: ["distinct primes"], explanation: "84 = 2² × 3 × 7: the distinct primes are 2, 3, 7." },
   { prompt: "Does the square of a prime divide 84? Use that and the number of distinct primes to give μ(84).", answer: [0], labels: ["μ(n)"], explanation: "2² divides 84, so μ(84) = 0." },
   { prompt: "How many divisors of 84 are square-free?", answer: [8], labels: ["square-free divisors"], explanation: "Each of the 3 primes is either in or out: 2³ = 8 choices, 1 included (no primes at all)." },
   { prompt: "What is the sum of μ(d) over all the divisors d of 84?", answer: [0], labels: ["sum of μ(d)"], explanation: "4 square-free divisors give 1 and 4 give −1; the rest give 0. The sum is 0, as it is for every n above 1." }
  ]
 },
 {
  id: "q26", title: "The perfect anniversary", topic: "Perfect numbers and Mersenne primes", tier: "Intermediate", sector: "Calendar Hall",
  brief: "The hall celebrates cycles whose lengths are perfect numbers, and it needs to test a candidate and add the next perfect number to its list.",
  lesson: "n is perfect when σ(n) = 2n; when 2ᵖ − 1 is prime (a Mersenne prime), 2ᵖ⁻¹ × (2ᵖ − 1) is perfect.",
  prompt: "The Calendar Hall keeps a list of perfect numbers for its anniversary cycles. Test N = 100 = 2² × 5²: enter σ(100), the sum of all its divisors, then σ(100) − 2 × 100 (0 means perfect). Then, for p = 7, enter the Mersenne prime 2⁷ − 1 and the perfect number 2⁶ × (2⁷ − 1). Type every answer without commas.",
  answer: [217,17,127,8128], labels: ["σ(N)","σ(N) − 2N","Mersenne prime","perfect number"], tolerance: 0.01,
  hints: [
   "σ(n) adds every divisor of n, n itself included. For a prime power add 1, p, p², … up to that power; for powers of different primes, multiply their σ values.",
   "n is perfect when σ(n) = 2n, that is, when its divisors other than n add up to n. Euclid’s rule: whenever 2ᵖ − 1 is prime, 2ᵖ⁻¹ × (2ᵖ − 1) is perfect."
  ],
  solution: "σ(2²) = 1 + 2 + 4 = 7; σ(5²) = 1 + 5 + 25 = 31. σ multiplies across powers of different primes, so σ(100) = 7 × 31 = 217. Then σ(100) − 2 × 100 = 217 − 200 = 17, so 100 is not perfect: its divisors other than itself add up to more than 100. For p = 7, 2⁷ − 1 = 127, which is prime, so 2⁶ × 127 = 64 × 127 = 8128 is perfect.",
  xp: 150, prereqs: ["q10"],
  artifact: { name: "Perfect calendar", description: "Anniversary cycles of 6, 28, 496 and 8128 days." },
  sources: [source.r4_4],
  teaching: {
   intuition: "σ(n) adds up every divisor of n, n itself included. A number is perfect when its divisors other than itself add up to the number: 6 = 1 + 2 + 3 and 28 = 1 + 2 + 4 + 7 + 14. Including n itself, that is σ(n) = 2n, so σ(n) − 2n is 0 exactly for perfect numbers; it is positive when the smaller divisors overshoot n and negative when they fall short. Euclid found a recipe for perfect numbers. A Mersenne prime is a prime of the form 2ᵖ − 1, such as 3, 7, 31 and 127. Whenever 2ᵖ − 1 is prime, the number 2ᵖ⁻¹ × (2ᵖ − 1) is perfect, and every even perfect number comes from this recipe. The exponent p must itself be prime for 2ᵖ − 1 to be prime, but that is not enough: 2¹¹ − 1 = 2047 = 23 × 89.",
   steps: [
    "Factorise n and work out σ of each prime power: 1 + p + p² + … up to the power.",
    "Multiply those σ values to get σ(n), because σ multiplies across powers of different primes.",
    "Subtract 2n. The number is perfect exactly when the result is 0.",
    "For a Mersenne prime 2ᵖ − 1, the perfect number is 2ᵖ⁻¹ times it."
   ],
   example: {
    prompt: "Is 28 perfect? Then give the perfect number 2² × (2³ − 1) for p = 3.",
    steps: [
     "28 = 2² × 7: σ(2²) = 1 + 2 + 4 = 7 and σ(7) = 8, so σ(28) = 56.",
     "56 − 2 × 28 = 0, so 28 is perfect.",
     "2³ − 1 = 7 is prime, and 2² × 7 = 28."
    ],
    answer: "σ(28) − 56 = 0, so 28 is perfect; the recipe for p = 3 gives 28 itself."
   },
   pitfalls: [
    "Leaving n out of σ(n): σ(6) is 1 + 2 + 3 + 6 = 12, and perfect means σ(n) = 2n.",
    "Assuming 2ᵖ − 1 is prime whenever p is prime: 2¹¹ − 1 = 2047 = 23 × 89.",
    "Writing 2ᵖ⁻¹ as 2ᵖ: for p = 5 the perfect number is 16 × 31 = 496, not 32 × 31."
   ]
  },
  guidance: [
   { prompt: "Add the divisors of each prime power in 2² × 5² and multiply the results. What is σ(100)?", answer: [217], labels: ["σ(N)"], explanation: "σ(2²) = 1 + 2 + 4 = 7; σ(5²) = 1 + 5 + 25 = 31. Multiplied: 7 × 31 = 217." },
   { prompt: "What is σ(100) − 2 × 100?", answer: [17], labels: ["σ(N) − 2N"], explanation: "217 − 200 = 17. It is not 0, so 100 is not perfect." },
   { prompt: "What is 2⁷ − 1?", answer: [127], labels: ["2ᵖ − 1"], explanation: "2⁷ = 128, so 2⁷ − 1 = 127. It has no divisor other than 1 and itself, so it is a Mersenne prime." },
   { prompt: "What is 2⁶ × 127?", answer: [8128], labels: ["perfect number"], explanation: "64 × 127 = 8128, the perfect number that belongs to this Mersenne prime." }
  ]
 },
 {
  id: "q27", title: "How long until the pointer returns", topic: "The order of a mod n", tier: "Intermediate", sector: "Calendar Hall",
  brief: "A calendar pointer jumps by multiplying its position, and the keepers need to know after how many jumps it is back where it started.",
  lesson: "The order of a mod n is the smallest k ≥ 1 with aᵏ ≡ 1 (mod n); it divides φ(n).",
  prompt: "A calendar wheel has 26 positions, 0 to 25. Each step moves the pointer from position x to the remainder of 3 × x on division by 26. It starts at 1, so after k steps it shows 3ᵏ mod 26. 3 and 26 are coprime. Enter φ(26), then the order of 3 mod 26: the fewest steps, at least one, that bring the pointer back to 1.",
  answer: [12,3], labels: ["φ(n)","order"], tolerance: 0.01,
  hints: [
   "φ(n) comes from the factorisation of n: multiply φ of each prime power. The order always divides φ(n), so it is one of the divisors of φ(n).",
   "Multiply by a again and again, reducing mod n each time, and stop at the first power that leaves remainder 1."
  ],
  solution: "26 = 2 × 13, so φ(26) = 1 × 12 = 12. Powers of 3 mod 26: 3¹ ≡ 3, 3² ≡ 9, 3³ ≡ 1. The first power that gives 1 is 3³, so the order of 3 mod 26 is 3. It divides φ(26) = 12, as an order always does.",
  xp: 150, prereqs: ["q19","q21","q22"],
  artifact: { name: "Pointer cycle chart", description: "The positions a multiplying pointer visits before it is home again." },
  sources: [source.r5_1],
  teaching: {
   intuition: "Take a number a coprime to n and keep multiplying by it, writing down only the remainder mod n each time. Euler’s theorem says that a to the power φ(n) leaves remainder 1, so the powers of a are sure to come back to 1. Often they come back sooner. The order of a mod n is the smallest positive k with aᵏ ≡ 1 (mod n): the length of the cycle the powers run round. For example, the powers of 2 mod 7 are 2, 4, 1, 2, 4, 1, …, so 2 has order 3 mod 7. The order always divides φ(n), here 3 divides 6, which gives a quick check on the answer and a short list of exponents worth trying.",
   steps: [
    "Check that a and n are coprime; otherwise no power of a is ever 1 mod n.",
    "Work out φ(n) from the factorisation of n. The order is one of the divisors of φ(n).",
    "List a, a², a³, … mod n, multiplying the last remainder by a and reducing each time.",
    "The first exponent at which the remainder is 1 is the order."
   ],
   example: {
    prompt: "Find the order of 2 mod 7.",
    steps: [
     "7 is prime, so φ(7) = 6.",
     "2¹ ≡ 2, 2² ≡ 4, 2³ = 8 ≡ 1 (mod 7)."
    ],
    answer: "The order of 2 mod 7 is 3, which divides 6."
   },
   pitfalls: [
    "Taking φ(n) as the order. Euler’s theorem gives a power that returns to 1, not always the first one.",
    "Counting a⁰ = 1 as the return: the order is the smallest exponent of at least 1.",
    "Letting the numbers grow instead of reducing mod n after every multiplication."
   ]
  },
  guidance: [
   { prompt: "What is φ(26)?", answer: [12], labels: ["φ(n)"], explanation: "26 = 2 × 13, so φ(26) = 1 × 12 = 12." },
   { prompt: "What is 3² mod 26?", answer: [9], labels: ["a² mod n"], explanation: "3² = 9, which leaves remainder 9 on division by 26." },
   { prompt: "Keep multiplying by 3. After how many steps is the pointer back at 1?", answer: [3], labels: ["order"], explanation: "3¹ ≡ 3, 3² ≡ 9, 3³ ≡ 1. The first 1 comes at step 3." }
  ]
 },
 {
  id: "q28", title: "A step that visits every day", topic: "Primitive roots", tier: "Intermediate", sector: "Calendar Hall",
  brief: "The hall wants a single multiplying step whose powers land on every position of a wheel before repeating, and it has a candidate to test.",
  lesson: "g is a primitive root mod a prime p when its order is p − 1; test g to the power (p − 1) ÷ q for each prime q dividing p − 1. A prime p has φ(p − 1) primitive roots.",
  prompt: "The Calendar Hall wants a pointer step whose powers visit every position 1 to 22 of a 23-position wheel before returning to 1: a primitive root mod 23. Test g = 5. Enter 5¹¹ mod 23, then 1 if 5 is a primitive root mod 23 and 0 if it is not, then how many primitive roots mod 23 there are among 1 to 22.",
  answer: [22,1,10], labels: ["g to the (p − 1) ÷ 2","primitive root (1 or 0)","number of primitive roots"], tolerance: 0.01,
  hints: [
   "The order of g mod p divides p − 1. If it is smaller, it divides (p − 1) ÷ q for some prime q that divides p − 1, so g is a primitive root exactly when g to the power (p − 1) ÷ q is not 1 for every such q.",
   "A prime p has exactly φ(p − 1) primitive roots: work out φ of p − 1 from its factorisation."
  ],
  solution: "22 = 2 × 11, so test the powers 11 and 2: 5¹¹ ≡ 22, 5² ≡ 2 (mod 23). None of them is 1, so the order of 5 is 22 and 5 is a primitive root mod 23. The number of primitive roots is φ(22): 22 = 2 × 11, so φ(22) = 1 × 10 = 10.",
  xp: 150, prereqs: ["q27"],
  artifact: { name: "Full-cycle stepper", description: "A pointer step whose powers reach every position of the wheel." },
  sources: [source.r5_1, source.r5_2],
  teaching: {
   intuition: "For a prime p, the order of any g from 1 to p − 1 divides φ(p) = p − 1. A primitive root mod p is a g whose order is as large as possible, p − 1. Then its powers g¹, g², …, gᵖ⁻¹ land on every remainder from 1 to p − 1 exactly once before coming back to 1. Every prime has primitive roots, and a prime p has exactly φ(p − 1) of them. To test g without listing all p − 1 powers, use the divisors: if the order of g were smaller than p − 1, it would divide (p − 1) ÷ q for some prime q dividing p − 1, and then g to that power would already be 1. So g is a primitive root exactly when g to the power (p − 1) ÷ q is not 1 for each prime q dividing p − 1.",
   steps: [
    "Factorise p − 1 and list its distinct primes q.",
    "For each q, work out g to the power (p − 1) ÷ q mod p by repeated squaring.",
    "If none of these is 1, g is a primitive root; if one is 1, it is not.",
    "The number of primitive roots mod p is φ(p − 1)."
   ],
   example: {
    prompt: "Is 3 a primitive root mod 7? How many primitive roots does 7 have?",
    steps: [
     "7 − 1 = 6 = 2 × 3, so test 3 to the powers 6 ÷ 2 = 3 and 6 ÷ 3 = 2.",
     "3³ = 27 ≡ 6 and 3² = 9 ≡ 2 (mod 7). Neither is 1.",
     "φ(6) = φ(2) × φ(3) = 1 × 2 = 2."
    ],
    answer: "Yes, 3 is a primitive root mod 7, and 7 has 2 primitive roots (3 and 5)."
   },
   pitfalls: [
    "Testing only (p − 1) ÷ 2. Every prime factor of p − 1 needs its own test.",
    "Counting primitive roots with φ(p) instead of φ(p − 1).",
    "Taking p − 1 as a primitive root: (p − 1)² ≡ 1, so its order is 2."
   ]
  },
  guidance: [
   { prompt: "22 is even, so one test power is 22 ÷ 2 = 11. What is 5¹¹ mod 23?", answer: [22], labels: ["g to the (p − 1) ÷ 2"], explanation: "By repeated squaring mod 23, 5¹¹ ≡ 22." },
   { prompt: "The prime factors of 22 give the test powers 11 and 2. Is 5 a primitive root mod 23? Enter 1 for yes, 0 for no.", answer: [1], labels: ["primitive root (1 or 0)"], explanation: "5¹¹ ≡ 22, 5² ≡ 2. None is 1, so yes." },
   { prompt: "How many primitive roots does 23 have? Work out φ(22).", answer: [10], labels: ["number of primitive roots"], explanation: "22 = 2 × 11, so φ(22) = 1 × 10 = 10." }
  ]
 },
 {
  id: "q29", title: "Finding a date on the wheel", topic: "Chapter review: the index of a number", tier: "Intermediate", sector: "Calendar Hall",
  brief: "Every position on the hall’s wheel is some number of steps of its primitive root, and the keepers need the step count for one position and its own cycle length.",
  lesson: "If g is a primitive root mod p, each b from 1 to p − 1 is gᵏ for exactly one k from 1 to p − 1, its index; the order of b is the smallest j with p − 1 dividing k × j.",
  prompt: "On the Calendar Hall’s 17-position wheel, 3 is a primitive root mod 17, so every position from 1 to 16 is 3ᵏ mod 17 for exactly one k from 1 to 16. That k is the index of the position. Enter the index of 13 (base 3, mod 17), then the order of 13 mod 17.",
  answer: [4,4], labels: ["index","order of b"], tolerance: 0.01,
  hints: [
   "Multiply by g again and again, reducing mod p each time, and count the steps until you reach b.",
   "If b ≡ gᵏ, then b to the power j is g to the power k × j, which is 1 exactly when p − 1 divides k × j. The order of b is the smallest such j."
  ],
  solution: "Powers of 3 mod 17: 3¹ ≡ 3, 3² ≡ 9, 3³ ≡ 10, 3⁴ ≡ 13, so the index of 13 is 4. Then 13ʲ ≡ 3 to the power 4j, which is 1 exactly when 16 divides 4 × j, because 3 has order 16. The smallest such j is 4 (4 × 4 = 16), so the order of 13 mod 17 is 4.",
  xp: 150, prereqs: ["q28"],
  artifact: { name: "Index table", description: "Each position of the wheel with the number of steps that reaches it." },
  sources: [source.r5_1_index],
  teaching: {
   intuition: "This chapter review puts orders and primitive roots to work. When g is a primitive root mod p, the powers g¹, g², …, gᵖ⁻¹ run through every remainder from 1 to p − 1 exactly once. So each b in that range is gᵏ for exactly one k from 1 to p − 1, called the index of b (base g, mod p), also called the discrete logarithm of b. It works like a logarithm for remainders: it turns multiplying into adding exponents. It also tells you the order of b at once. bʲ is g to the power k × j, and that is 1 exactly when p − 1 divides k × j, because g has order p − 1. The smallest such j is the order of b.",
   steps: [
    "List g, g², g³, … mod p, multiplying by g and reducing each time.",
    "Stop when you reach b: the exponent is the index k of b.",
    "Look for the smallest j at least 1 for which p − 1 divides k × j.",
    "That j is the order of b mod p."
   ],
   example: {
    prompt: "3 is a primitive root mod 7. Find the index of 6 and the order of 6 mod 7.",
    steps: [
     "3¹ ≡ 3, 3² ≡ 2, 3³ ≡ 6 (mod 7), so the index of 6 is 3.",
     "6 divides 3 × j first at j = 2, so 6 has order 2. Check: 6² = 36 ≡ 1 (mod 7)."
    ],
    answer: "Index 3, order 2."
   },
   pitfalls: [
    "Counting the steps from g⁰ = 1 as if it were step 1: g itself is the first power, with exponent 1.",
    "Giving the index as the order of b. They are different: the order is how long b takes to return to 1.",
    "Forgetting to reduce mod p before multiplying again, which makes the list hard to check."
   ]
  },
  guidance: [
   { prompt: "Start the list of powers. What are 3² mod 17 and 3³ mod 17?", answer: [9,10], labels: ["g² mod p","g³ mod p"], explanation: "3² = 9, and 9 × 3 = 27 ≡ 10 (mod 17)." },
   { prompt: "Carry on multiplying by 3. Which power of 3 is 13 mod 17?", answer: [4], labels: ["index"], explanation: "3¹ ≡ 3, 3² ≡ 9, 3³ ≡ 10, 3⁴ ≡ 13, so the index is 4." },
   { prompt: "13 ≡ 3⁴ and 3 has order 16. What is the smallest j for which 16 divides 4 × j?", answer: [4], labels: ["order of b"], explanation: "4 × 4 = 16 is the first multiple of 4 that 16 divides, so the order of 13 is 4." }
  ]
 },
 {
  id: "q30", title: "Square plots on the stake ring", topic: "Quadratic residues", tier: "Advanced", sector: "Survey Field",
  brief: "The surveyors flag square plots on a ring of stakes, and they need to know which plot sides land a flag on a given stake.",
  lesson: "a, from 1 to p − 1, is a quadratic residue mod p when x² ≡ a (mod p) has a solution; for an odd prime p there are then exactly two, x and p − x, and there are (p − 1) ÷ 2 residues. For a = 0 the only solution is x = 0.",
  prompt: "The Survey Field marks plot corners on a ring of 19 stakes, numbered 0 to 18. A square plot with side x rods, x from 1 to 18, puts its corner flag on stake x² mod 19. Enter how many sides x give stake 17 (the number of solutions of x² ≡ 17 (mod 19)), then the smallest such x (0 if there is none), then how many of the stakes 1 to 18 are quadratic residues mod 19.",
  answer: [2,6,9], labels: ["number of solutions","smallest solution","quadratic residues"], tolerance: 0.01,
  hints: [
   "Square only 1 to (p − 1) ÷ 2 and reduce mod p: (p − x)² leaves the same remainder as x², so the other half adds nothing new.",
   "For an odd prime p and a from 1 to p − 1, x² ≡ a has either no solution or exactly two, x and p − x (for a = 0 only x = 0 works). The squares of 1 to (p − 1) ÷ 2 are all different, so there are (p − 1) ÷ 2 quadratic residues."
  ],
  solution: "Squares mod 19: 1² ≡ 1, 2² ≡ 4, 3² ≡ 9, 4² ≡ 16, 5² ≡ 6, 6² ≡ 17, 7² ≡ 11, 8² ≡ 7, 9² ≡ 5. 17 appears at x = 6, so the solutions are 6 and 19 − 6 = 13: two solutions, the smallest 6. 17 is a quadratic residue mod 19. The list holds 9 different values, so there are 9 quadratic residues mod 19.",
  xp: 200, prereqs: ["q13"],
  artifact: { name: "Stake-ring chart", description: "The ring of stakes with every square plot’s flag marked." },
  sources: [source.r5_4],
  teaching: {
   intuition: "Squaring mod a prime p misses half the remainders. A number a from 1 to p − 1 is a quadratic residue mod p when x² ≡ a (mod p) has a solution, and a quadratic nonresidue when it has none. Mod 7, the squares of 1 to 6 leave 1, 4, 2, 2, 4, 1, so 1, 2 and 4 are quadratic residues and 3, 5 and 6 are not. Notice the mirror: (p − x)² leaves the same remainder as x², because (p − x)² = p² − 2px + x² and the first two parts are multiples of p. So only 1 to (p − 1) ÷ 2 need squaring. For an odd prime p those squares are all different, which gives two facts: for a from 1 to p − 1, x² ≡ a has either no solution or exactly two, x and p − x; and there are exactly (p − 1) ÷ 2 quadratic residues. Zero is the exception: x² ≡ 0 (mod p) only when p divides x, so its one solution is x = 0, and 0 is not counted as a residue.",
   steps: [
    "Square each of 1, 2, …, (p − 1) ÷ 2 and reduce mod p.",
    "If a is in the list at x, the solutions are x and p − x, and the smaller is x.",
    "If a is not in the list, x² ≡ a (mod p) has no solution: a is a quadratic nonresidue.",
    "The list holds (p − 1) ÷ 2 different values: that is the number of quadratic residues."
   ],
   example: {
    prompt: "Solve x² ≡ 5 (mod 11) for x from 1 to 10.",
    steps: [
     "Squares mod 11: 1² ≡ 1, 2² ≡ 4, 3² ≡ 9, 4² = 16 ≡ 5, 5² = 25 ≡ 3.",
     "5 appears at x = 4, so the solutions are 4 and 11 − 4 = 7."
    ],
    answer: "Two solutions, 4 and 7; there are 5 quadratic residues mod 11."
   },
   pitfalls: [
    "Stopping at the first solution: x and p − x are both solutions.",
    "Squaring all the way to p − 1 and counting each residue twice.",
    "Expecting a solution for every a: half of the numbers from 1 to p − 1 are not squares mod p."
   ]
  },
  guidance: [
   { prompt: "Square 1 to 9 and reduce mod 19. How many solutions does x² ≡ 17 (mod 19) have?", answer: [2], labels: ["number of solutions"], explanation: "1² ≡ 1, 2² ≡ 4, 3² ≡ 9, 4² ≡ 16, 5² ≡ 6, 6² ≡ 17, 7² ≡ 11, 8² ≡ 7, 9² ≡ 5. 17 is there, so there are two solutions, x and 19 − x." },
   { prompt: "What is the smallest solution? Enter 0 if there is none.", answer: [6], labels: ["smallest solution"], explanation: "6² ≡ 17, and the other solution is 13, which is larger." },
   { prompt: "How many of 1 to 18 are quadratic residues mod 19?", answer: [9], labels: ["quadratic residues"], explanation: "The 9 squares in the list are all different, and the other half repeats them, so there are 9." }
  ]
 }
);
})();
