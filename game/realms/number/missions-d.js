/* Number theory: the hidden life of whole numbers missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/number/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Squares and primes · Advanced, 200 XP · sector 'Survey Field' · Legendre symbol and Euler's criterion [R5.5]
     q32  ch 6 Squares and primes · Advanced, 200 XP · sector 'Survey Field' · Quadratic reciprocity [R5.6]
     q33  ch 6 Squares and primes · Advanced, 200 XP · sector 'Survey Field' · Sums of two squares [BC1.28]
     q34  ch 6 Squares and primes · Advanced, 200 XP · sector 'Survey Field' · Fermat test and pseudoprimes [BC1.25]
     q35  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · Continued fractions of a fraction [R6.1]
     q36  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · Convergents [R6.2]
     q37  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · Recovering a fraction from a decimal [R6.4]
     q38  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · RSA: encrypting [BC1.27, R8.1]
     q39  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · RSA: the decryption key [BC1.27, R8.1]
     q40  ch 7 Fractions and secret codes · Advanced, 200 XP · sector 'Cipher Room' · Realm review and bridge to Graph theory [R2.4, R3.5] */
(function(){
'use strict';
/* Raji, Elementary Number Theory (LibreTexts); Barrus and Clark, Elementary Number Theory (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /Elementary Number Theory/ (Elementary Number Theory (Raji; Barrus and Clark)).
   A title reads like: Raji, Elementary Number Theory (LibreTexts) — 3.4 The Chinese Remainder Theorem
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 r2_4: { title: "Raji, Elementary Number Theory (LibreTexts) — 2.4 Least Common Multiple", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.04%3A_Least_Common_Multiple", description: "Cited for multiples and for the gcd and lcm read from prime factorisations. Counting the dividing links of the divisor network is not on this page: the mission works that count out itself.", verified: '2026-11-27' },
 r5_5: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.5 Legendre Symbol", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.05%3A_Legendre_Symbol", description: "The Legendre symbol (a/p) and Euler’s criterion, a to the power (p − 1) ÷ 2 mod p.", verified: '2026-11-27' },
 r5_6: { title: "Raji, Elementary Number Theory (LibreTexts) — 5.6 The Law of Quadratic Reciprocity", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/05%3A_Primitive_Roots_and_Quadratic_Residues/5.06%3A_The_Law_of_Quadratic_Reciprocity", description: "The law of quadratic reciprocity for two different odd primes, with a proof by counting lattice points.", verified: '2026-11-27' },
 r6_1: { title: "Raji, Elementary Number Theory (LibreTexts) — 6.1 Basic Notations", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/06%3A_Introduction_to_Continued_Fractions/6.01%3A_Basic_Notations", description: "Finite continued fractions [a₀; a₁, …, aₙ] and how to expand a rational number into one.", verified: '2026-11-27' },
 r6_2: { title: "Raji, Elementary Number Theory (LibreTexts) — 6.2 Main Technical Tool", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/06%3A_Introduction_to_Continued_Fractions/6.02%3A_Main_Technical_Tool", description: "Convergents pₖ/qₖ, the rule pₖ = aₖpₖ₋₁ + pₖ₋₂, qₖ = aₖqₖ₋₁ + qₖ₋₂, and why they are in lowest terms.", verified: '2026-11-27' },
 r6_4: { title: "Raji, Elementary Number Theory (LibreTexts) — 6.4 An Application", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/06%3A_Introduction_to_Continued_Fractions/6.04%3A_An_Application", description: "Recovering an exact fraction from an accurate decimal: a large partial quotient marks where to cut.", verified: '2026-11-27' },
 r8_1: { title: "Raji, Elementary Number Theory (LibreTexts) — 8.1 Cryptography", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/08%3A_Other_Topics_in_Number_Theory/8.01%3A_Cryptography", description: "Encrypting by a power mod a product of two primes and decrypting with the inverse exponent mod φ.", verified: '2026-11-27' },
 bc1_25: { title: "Barrus and Clark, Elementary Number Theory (LibreTexts) — 1.25 Primality Tests", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.25%3A_Primality_Tests", description: "Primality tests from Fermat’s little theorem, the base 2 test and pseudoprimes such as 341.", verified: '2026-11-27' },
 bc1_27: { title: "Barrus and Clark, Elementary Number Theory (LibreTexts) — 1.27 The RSA Scheme", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.27%3A_The_RSA_Scheme", description: "The RSA scheme: a public modulus and encryption exponent, a private decryption exponent, and why it works.", verified: '2026-11-27' },
 bc1_28: { title: "Barrus and Clark, Elementary Number Theory (LibreTexts) — 1.28 Sum of Squares", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.28%3A_Sum_of_Squares", description: "Which whole numbers are sums of two squares: the primes that leave remainder 3 mod 4 need even exponents.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "The square-plot register", topic: "The Legendre symbol and Euler’s criterion", tier: 'Advanced', sector: "Survey Field",
  brief: "The plot register sorts plot areas by their remainders, and Mira wants a fast way to tell which remainders can come from a square.",
  lesson: "For an odd prime p that does not divide a, a to the power (p − 1) ÷ 2 leaves remainder 1 or p − 1 on division by p, and that gives the Legendre symbol (a/p).",
  prompt: "The Survey Field files each plot under the remainder of its area on division by the prime 13. Mira wants to know whether 10 is a quadratic residue mod 13: the remainder of some whole number squared. Use Euler’s criterion. Enter 10⁶ mod 13 as a least residue (0 to 12), then the Legendre symbol (10/13), typed 1 or −1.",
  answer: [1,1], labels: ["power mod p","Legendre symbol (a/p)"], tolerance: 0.01,
  hints: [
   "The exponent is (p − 1) ÷ 2. By Fermat’s little theorem, the square of a to that power leaves remainder 1, so a to the power (p − 1) ÷ 2 leaves either 1 or p − 1, which stands for −1.",
   "Euler’s criterion: the Legendre symbol (a/p) is 1 when a to the power (p − 1) ÷ 2 leaves remainder 1, and −1 when it leaves remainder p − 1."
  ],
  solution: "The exponent is (13 − 1) ÷ 2 = 6. Repeated squaring mod 13: 10¹ ≡ 10, 10² ≡ 9, 10⁴ ≡ 3. 6 = 4 + 2, so 10⁶ ≡ 3 × 9: 3 × 9 = 27 ≡ 1. The remainder is 1, so (10/13) = 1: 10 is a quadratic residue mod 13.",
  xp: 200, prereqs: ["q30","q20"],
  artifact: { name: "Square-plot register", description: "A ledger that sorts every remainder into squares and non-squares with one power each." },
  sources: [source.r5_5],
  teaching: {
   intuition: "A quadratic residue mod a prime p is a remainder that some square leaves. Listing every square mod p finds them, but for a big prime the list is long. Euler’s criterion is a shortcut that needs one power. Fermat’s little theorem says that a to the power p − 1 leaves remainder 1 when p does not divide a. Half of that power, a to the power (p − 1) ÷ 2, is therefore a number whose square leaves remainder 1, and mod a prime the only such remainders are 1 and p − 1. (p − 1 behaves like −1: add 1 and you get p, which leaves 0.) Euler showed which one you get: remainder 1 exactly when a is a quadratic residue, and p − 1 when it is not. We record the answer as the Legendre symbol, written (a/p): it is 1 when a is a quadratic residue mod p and −1 when it is not. It looks like a fraction but it is not one; it is a yes or no written as 1 or −1.",
   steps: [
    "Check that p is an odd prime and that p does not divide a.",
    "Work out the exponent (p − 1) ÷ 2.",
    "Find a to that power mod p by repeated squaring, reducing after every multiplication.",
    "Read the result: remainder 1 means (a/p) = 1, a quadratic residue; remainder p − 1 means (a/p) = −1, not a quadratic residue."
   ],
   example: {
    prompt: "Is 3 a quadratic residue mod 7? Find 3³ mod 7 and the Legendre symbol (3/7).",
    steps: [
     "The exponent is (7 − 1) ÷ 2 = 3.",
     "3² = 9 ≡ 2, so 3³ ≡ 2 × 3 = 6 (mod 7).",
     "6 is 7 − 1, which stands for −1, so (3/7) = −1. Check: the squares mod 7 are 1, 2 and 4, and 3 is not among them."
    ],
    answer: "3³ ≡ 6 (mod 7), so (3/7) = −1: 3 is not a quadratic residue mod 7."
   },
   pitfalls: [
    "Typing p − 1 as the Legendre symbol. The remainder p − 1 stands for −1, and the symbol is typed −1.",
    "Using the full exponent p − 1. Fermat’s little theorem makes that power leave 1 for every a, so it cannot tell squares apart; the criterion needs half of it.",
    "Not reducing mod p after each multiplication, so the numbers grow too large to handle."
   ]
  },
  guidance: [
   { prompt: "Euler’s criterion raises 10 to the power (p − 1) ÷ 2. What is that exponent for p = 13?", answer: [6], labels: ["exponent"], explanation: "(13 − 1) ÷ 2 = 6." },
   { prompt: "Square repeatedly, reducing mod 13 each time. What are 10² mod 13 and 10⁴ mod 13?", answer: [9,3], labels: ["a² mod p","a⁴ mod p"], explanation: "10² = 100 ≡ 9, and 10⁴ ≡ 9² = 81 ≡ 3 (mod 13)." },
   { prompt: "Combine the squares. What is 10⁶ mod 13?", answer: [1], labels: ["power mod p"], explanation: "Repeated squaring mod 13: 10¹ ≡ 10, 10² ≡ 9, 10⁴ ≡ 3. 6 = 4 + 2, so 10⁶ ≡ 3 × 9: 3 × 9 = 27 ≡ 1." },
   { prompt: "The remainder is 1. What is the Legendre symbol (10/13), as 1 or −1?", answer: [1], labels: ["(a/p)"], explanation: "A remainder of 1 means (10/13) = 1." }
  ]
 },
 {
  id: 'q32', title: "Flipping the survey symbols", topic: "Quadratic reciprocity", tier: 'Advanced', sector: "Survey Field",
  brief: "A plot code needs a Legendre symbol modulo a large prime, and Mira wants to swap it for one modulo a small prime that is quick to check.",
  lesson: "For two different odd primes p and q, (p/q) = (q/p), unless both leave remainder 3 on division by 4; then (p/q) = −(q/p).",
  prompt: "Two survey plots are numbered with the odd primes 7 and 59. Mira needs the Legendre symbol (7/59), which says whether 7 is a square mod 59. Working mod 59 is slow, so turn the symbol over with quadratic reciprocity. Enter the remainder of 59 on division by 7, then the symbol (59/7), then (7/59), each symbol typed 1 or −1.",
  answer: [3,-1,1], labels: ["q mod p","symbol (q/p)","symbol (p/q)"], tolerance: 0.01,
  hints: [
   "Quadratic reciprocity: for two different odd primes p and q, (p/q) and (q/p) are equal, except when both p and q leave remainder 3 on division by 4; then they are opposite.",
   "The symbol (a/p) depends only on the remainder of a on division by p, so reduce the top number first, then compare it with the list of squares mod the small prime."
  ],
  solution: "Reduce first: 59 = 8 × 7 + 3, so (59/7) = (3/7). The non-zero squares mod 7 are 1, 2 and 4, so 3 is not a quadratic residue and (59/7) = −1. On division by 4, 7 leaves 3 and 59 leaves 3. Both leave 3, so the symbol changes sign when it is turned over: (7/59) = 1.",
  xp: 200, prereqs: ["q31"],
  artifact: { name: "Reciprocity card", description: "A small card that turns a hard square question into an easy one." },
  sources: [source.r5_6],
  teaching: {
   intuition: "The Legendre symbol (p/q) asks whether p is a square mod q. When q is large, checking that directly needs a long list of squares or a big power. Quadratic reciprocity links two questions about two different odd primes: “is p a square mod q?” and “is q a square mod p?”. The answers are the same, except in one case: when p and q both leave remainder 3 on division by 4, the answers are opposite. So you can turn the symbol over, and then make its top number smaller, because (a/p) depends only on the remainder of a on division by p: numbers with the same remainder match the same squares. After one turn and one reduction the top number is below the small prime, and a short list of squares settles it.",
   steps: [
    "Check that p and q are two different odd primes.",
    "Find the remainders of p and q on division by 4. If both are 3, turning the symbol over changes its sign; otherwise it keeps its value.",
    "Turn the symbol over: (p/q) becomes (q/p), with the sign from the last step.",
    "Reduce the top: replace q by its remainder on division by p.",
    "Settle the small symbol from the list of squares mod p (or by Euler’s criterion), then put the sign back."
   ],
   example: {
    prompt: "Find (3/43): is 3 a square mod 43?",
    steps: [
     "3 leaves remainder 3 on division by 4, and 43 = 10 × 4 + 3 leaves 3 too, so (3/43) = −(43/3).",
     "43 = 14 × 3 + 1, so (43/3) = (1/3) = 1, because 1 = 1² is a square.",
     "So (3/43) = −1."
    ],
    answer: "(3/43) = −1: 3 is not a square mod 43."
   },
   pitfalls: [
    "Changing the sign when only one of the primes leaves remainder 3 on division by 4. The sign changes only when both do.",
    "Forgetting to reduce after turning the symbol over. (61/5) is the same as (1/5), because 61 leaves remainder 1 on division by 5.",
    "Using the rule with 2 or with a number that is not prime. It is for two different odd primes."
   ]
  },
  guidance: [
   { prompt: "What remainders do 7 and 59 leave on division by 4?", answer: [3,3], labels: ["p mod 4","q mod 4"], explanation: "7 = 1 × 4 + 3 and 59 = 14 × 4 + 3. Both leave 3, so (p/q) = −(q/p)." },
   { prompt: "Reduce the top of the turned symbol (59/7). What is the remainder of 59 on division by 7?", answer: [3], labels: ["q mod p"], explanation: "59 = 8 × 7 + 3, so (59/7) = (3/7)." },
   { prompt: "The non-zero squares mod 7 are 1, 2 and 4. What is (3/7), as 1 or −1?", answer: [-1], labels: ["reduced symbol"], explanation: "3 is not in the list, so the symbol is −1." },
   { prompt: "Now turn back. What is (7/59)?", answer: [1], labels: ["symbol (p/q)"], explanation: "The sign flips: (7/59) = −(59/7) = 1." }
  ]
 },
 {
  id: 'q33', title: "Two square plots from one block", topic: "Sums of two squares", tier: 'Advanced', sector: "Survey Field",
  brief: "A surveyor wants to split each block of land into two square plots with whole-number sides, and some blocks will not split that way at all.",
  lesson: "A whole number is a sum of two squares exactly when every prime that leaves remainder 3 on division by 4 has an even exponent in its prime factorisation.",
  prompt: "The Survey Field has a block of 325 square metres to share out as two square plots whose sides are whole numbers of metres, a and b with a ≤ b (a side of 0 means the block is one square plot). Enter 1 if 325 is a sum of two squares and 0 if it is not, then the number of ways to write 325 = a² + b² with 0 ≤ a ≤ b.",
  answer: [1,3], labels: ["sum of two squares (1 or 0)","number of ways"], tolerance: 0.01,
  hints: [
   "A whole number is a sum of two squares exactly when every prime in its factorisation that leaves remainder 3 on division by 4 has an even exponent.",
   "To count the ways, try each a from 0 upwards while 2a² is at most the number, and check whether the number minus a² is a perfect square."
  ],
  solution: "325 = 5² × 13. None of its primes leaves remainder 3 on division by 4. No such prime has an odd exponent, so 325 is a sum of two squares. Trying a = 0 to 12: 325 = 1² + 18², 325 = 6² + 17², 325 = 10² + 15². That is 3 ways.",
  xp: 200, prereqs: ["q30","q04"],
  artifact: { name: "Plot-splitting chart", description: "Which blocks split into two square plots, and in how many ways." },
  sources: [source.bc1_28],
  teaching: {
   intuition: "Some whole numbers are two squares added together: 13 = 2² + 3², and 25 = 0² + 5² = 3² + 4². Others, such as 3, 7 or 21, never are, however you try. The prime factorisation decides it. Sort the primes by their remainder on division by 4. The prime 2 and the primes that leave remainder 1 (5, 13, 17, …) cause no trouble. The primes that leave remainder 3 (3, 7, 11, 19, …) are the obstacle: a number is a sum of two squares exactly when each of them appears an even number of times, that is with an even exponent. So 45 = 3² × 5 works (45 = 3² + 6²), but 21 = 3 × 7 does not. Once you know a number is a sum of two squares, you find the actual ways by trying each small square in turn and checking whether what is left is a square too.",
   steps: [
    "Write the prime factorisation of the number.",
    "Look at each prime that leaves remainder 3 on division by 4. If any of them has an odd exponent, the number is not a sum of two squares, and there are 0 ways.",
    "Otherwise it is. To list the ways, try a = 0, 1, 2, … while 2a² is at most the number, so that a ≤ b.",
    "For each a, check whether the number minus a² is a perfect square b². Count the pairs you find."
   ],
   example: {
    prompt: "Is 65 a sum of two squares, and in how many ways is 65 = a² + b² with 0 ≤ a ≤ b? Is 21 a sum of two squares?",
    steps: [
     "65 = 5 × 13. Both primes leave remainder 1 on division by 4, so 65 is a sum of two squares.",
     "Try a = 0 to 5: 65 − 1 = 64 = 8² and 65 − 16 = 49 = 7². The other values, 65, 61, 56 and 40, are not squares.",
     "21 = 3 × 7, and 3 has exponent 1, which is odd, so 21 is not a sum of two squares."
    ],
    answer: "65 = 1² + 8² = 4² + 7²: 2 ways. 21 is not a sum of two squares."
   },
   pitfalls: [
    "Counting a² + b² and b² + a² as two ways. With a ≤ b each way is counted once.",
    "Rejecting a number just because a prime that leaves remainder 3 divides it. 9 = 0² + 3² is fine: the exponent of 3 is 2, which is even.",
    "Forgetting a = 0. A perfect square such as 25 = 0² + 5² counts as a way."
   ]
  },
  guidance: [
   { prompt: "Factorise 325 into primes. How many of its primes that leave remainder 3 on division by 4 have an odd exponent?", answer: [0], labels: ["such primes with odd exponent"], explanation: "325 = 5² × 13. None of its primes leaves remainder 3 on division by 4." },
   { prompt: "So is 325 a sum of two squares? Enter 1 for yes, 0 for no.", answer: [1], labels: ["sum of two squares (1 or 0)"], explanation: "Every prime that leaves remainder 3 on division by 4 has an even exponent, so it is." },
   { prompt: "In how many ways is 325 = a² + b² with 0 ≤ a ≤ b?", answer: [3], labels: ["number of ways"], explanation: "Trying a = 0 to 12: 325 = 1² + 18², 325 = 6² + 17², 325 = 10² + 15². That is 3 ways." }
  ]
 },
 {
  id: 'q34', title: "The quick prime check", topic: "The Fermat test and pseudoprimes", tier: 'Advanced', sector: "Survey Field",
  brief: "The plot register wants a fast check for prime plot numbers, and Mira warns that the check can be fooled.",
  lesson: "If n is an odd prime, 2ⁿ⁻¹ leaves remainder 1 on division by n; any other remainder proves n composite, but a remainder of 1 does not prove n prime.",
  prompt: "The Survey Field’s plot register runs a quick check before it treats a plot number as prime. For the odd number n = 561, enter 2ⁿ⁻¹ mod n, that is 2⁵⁶⁰ mod 561, as a least residue, then 1 if 561 passes the Fermat test (the remainder is 1) and 0 if it fails.",
  answer: [1,1], labels: ["2ⁿ⁻¹ mod n","passes (1 or 0)"], tolerance: 0.01,
  hints: [
   "Use repeated squaring: write n − 1 as a sum of powers of 2, square 2 again and again mod n, and multiply the squares you need, reducing mod n after every step.",
   "n passes the Fermat test when 2ⁿ⁻¹ leaves remainder 1 on division by n. A fail proves n is composite; a pass does not prove n is prime."
  ],
  solution: "Repeated squaring mod 561: 2¹ ≡ 2, 2² ≡ 4, 2⁴ ≡ 16, 2⁸ ≡ 256, 2¹⁶ ≡ 460, 2³² ≡ 103, 2⁶⁴ ≡ 511, 2¹²⁸ ≡ 256, 2²⁵⁶ ≡ 460, 2⁵¹² ≡ 103. 560 = 512 + 32 + 16, so 2⁵⁶⁰ ≡ 103 × 103 × 460: 103 × 103 = 10609 ≡ 511, 511 × 460 = 235060 ≡ 1. 561 passes the test, yet 561 = 3 × 11 × 17 is composite, so the working above shows that it is a pseudoprime to base 2.",
  xp: 200, prereqs: ["q20"],
  artifact: { name: "Prime-check stamp", description: "A stamp for plot numbers that pass the Fermat test, with a warning about pseudoprimes." },
  sources: [source.bc1_25],
  teaching: {
   intuition: "Fermat’s little theorem says that for a prime p, a to the power p − 1 leaves remainder 1 on division by p whenever p does not divide a. Turn it round and you get a test. The test is for odd n only: 2 is the one even prime, and it divides 2, so 2¹ mod 2 is 0, not 1; every other even number is plainly composite. Take an odd number n and work out 2ⁿ⁻¹ mod n, 2 to the power n − 1, by repeated squaring, which takes only a few steps even for a large n. If the remainder is not 1, n cannot be prime: it is composite, and you have proved it without finding a single factor. If the remainder is 1, n passes the Fermat test and is probably prime, but not certainly. A composite number that passes is called a pseudoprime to base 2; 341 = 11 × 31 is one. Pseudoprimes are rare, which is why the test is still a useful first check.",
   steps: [
    "Write n − 1 as a sum of powers of 2.",
    "Square 2 again and again mod n: 2, 2², 2⁴, 2⁸, …, reducing after every step.",
    "Multiply the powers that make up n − 1, reducing mod n each time. The result is 2ⁿ⁻¹ mod n.",
    "A remainder other than 1 proves n is composite. A remainder of 1 means n passes: it is prime or a pseudoprime."
   ],
   example: {
    prompt: "Run the Fermat test to base 2 on n = 15.",
    steps: [
     "14 = 8 + 4 + 2. Squaring mod 15: 2² = 4, 2⁴ = 16 ≡ 1, 2⁸ ≡ 1.",
     "So 2¹⁴ = 2⁸ × 2⁴ × 2² ≡ 1 × 1 × 4 = 4 (mod 15).",
     "The remainder is 4, not 1, so 15 fails the test and is composite, as 15 = 3 × 5 shows."
    ],
    answer: "2¹⁴ ≡ 4 (mod 15): 15 fails, so it is composite."
   },
   pitfalls: [
    "Reading a pass as a proof that n is prime. Pseudoprimes such as 341 pass and are composite.",
    "Using the exponent n instead of n − 1. For a prime, 2ⁿ leaves remainder 2, not 1.",
    "Letting the numbers grow: reduce mod n after every squaring and every multiplication."
   ]
  },
  guidance: [
   { prompt: "The test raises 2 to the power n − 1. What is that power for n = 561?", answer: [560], labels: ["n − 1"], explanation: "561 − 1 = 560." },
   { prompt: "With repeated squaring, what is 2⁵⁶⁰ mod 561?", answer: [1], labels: ["2ⁿ⁻¹ mod n"], explanation: "Repeated squaring mod 561: 2¹ ≡ 2, 2² ≡ 4, 2⁴ ≡ 16, 2⁸ ≡ 256, 2¹⁶ ≡ 460, 2³² ≡ 103, 2⁶⁴ ≡ 511, 2¹²⁸ ≡ 256, 2²⁵⁶ ≡ 460, 2⁵¹² ≡ 103. 560 = 512 + 32 + 16, so 2⁵⁶⁰ ≡ 103 × 103 × 460: 103 × 103 = 10609 ≡ 511, 511 × 460 = 235060 ≡ 1." },
   { prompt: "The remainder is 1. Does 561 pass the Fermat test? Enter 1 for yes, 0 for no.", answer: [1], labels: ["passes (1 or 0)"], explanation: "561 passes the test, yet 561 = 3 × 11 × 17 is composite, so the working above shows that it is a pseudoprime to base 2." }
  ]
 },
 {
  id: 'q35', title: "Setting the cipher wheel", topic: "Continued fractions of a fraction", tier: 'Advanced', sector: "Cipher Room",
  brief: "The cipher wheel is set by a short list of whole numbers hidden inside one fraction, and Mira needs that list.",
  lesson: "Euclid’s algorithm on the top and bottom of a fraction gives its continued fraction [a₀; a₁, a₂, …]: the quotients of the divisions, in order, are the partial quotients.",
  prompt: "Mira sets the cipher wheel from the continued fraction of 43/19, which has exactly four partial quotients. Enter a₀, a₁, a₂ and a₃, where 43/19 = [a₀; a₁, a₂, a₃].",
  answer: [2,3,1,4], labels: ["a₀","a₁","a₂","a₃"], tolerance: 0.01,
  hints: [
   "Divide with remainder: a₀ is the quotient of the top by the bottom. Then divide the old bottom by the remainder, and keep going, exactly as in Euclid’s algorithm.",
   "The quotients of the divisions, in order, are the partial quotients. Stop when a remainder is 0."
  ],
  solution: "43 = 2 × 19 + 5, 19 = 3 × 5 + 4, 5 = 1 × 4 + 1 and 4 = 4 × 1 + 0. The quotients are 2, 3, 1 and 4, so 43/19 = [2; 3, 1, 4].",
  xp: 200, prereqs: ["q06"],
  artifact: { name: "Cipher wheel setting card", description: "Four whole numbers peeled out of one fraction." },
  sources: [source.r6_1],
  teaching: {
   intuition: "Any fraction can be peeled into whole numbers. Take 30/13. It is 2 whole ones with 4/13 left over. Turn the leftover upside down: 13/4 is 3 with 1/4 more. Turn that over: 4/1 is exactly 4, and we stop. So 30/13 = 2 + 1 ÷ (3 + 1 ÷ 4). A number written like this, as a whole number plus 1 over (a whole number plus 1 over …), is a continued fraction, written for short as [2; 3, 4]. The whole numbers in it are its partial quotients, called a₀, a₁, a₂ and so on. They are exactly the quotients that Euclid’s algorithm produces on the top and the bottom: 30 = 2 × 13 + 4, 13 = 3 × 4 + 1, 4 = 4 × 1 + 0. The expansion stops because the remainders shrink until one is 0. Every fraction has exactly one such expansion whose last partial quotient is at least 2.",
   steps: [
    "Divide the top by the bottom: the quotient is a₀, and the remainder is what is left over.",
    "Divide the old bottom by that remainder: the quotient is a₁.",
    "Keep dividing each divisor by the new remainder, writing down each quotient, until a remainder is 0.",
    "The quotients in order are the partial quotients: the fraction equals [a₀; a₁, a₂, …]."
   ],
   example: {
    prompt: "Expand 30/13 as a continued fraction.",
    steps: [
     "30 = 2 × 13 + 4, so a₀ = 2.",
     "13 = 3 × 4 + 1, so a₁ = 3; then 4 = 4 × 1 + 0, so a₂ = 4 and the expansion stops.",
     "Check: 2 + 1 ÷ (3 + 1 ÷ 4) = 2 + 1 ÷ (13/4) = 2 + 4/13 = 30/13."
    ],
    answer: "30/13 = [2; 3, 4]."
   },
   pitfalls: [
    "Writing down the remainders instead of the quotients. The partial quotients are the quotients of the divisions.",
    "Dividing the remainder by the old bottom instead of the old bottom by the remainder: each step divides the last divisor by the new remainder.",
    "Stopping one step early. Carry on until the remainder is 0; the last division, by 1, gives the last partial quotient."
   ]
  },
  guidance: [
   { prompt: "Divide 43 by 19. What are the quotient a₀ and the remainder?", answer: [2,5], labels: ["a₀","remainder"], explanation: "43 = 2 × 19 + 5." },
   { prompt: "Now divide 19 by the remainder 5. What are the quotient a₁ and the new remainder?", answer: [3,4], labels: ["a₁","remainder"], explanation: "19 = 3 × 5 + 4." },
   { prompt: "Divide 5 by 4. What are the quotient a₂ and the new remainder?", answer: [1,1], labels: ["a₂","remainder"], explanation: "5 = 1 × 4 + 1." },
   { prompt: "Divide 4 by 1. What is the quotient a₃?", answer: [4], labels: ["a₃"], explanation: "4 = 4 × 1 + 0. The remainder is 0, so the expansion stops: [2; 3, 1, 4]." }
  ]
 },
 {
  id: 'q36', title: "Closing in on the key", topic: "Convergents", tier: 'Advanced', sector: "Cipher Room",
  brief: "Mira wants the fractions that come ever closer to the cipher key, built one step at a time from its partial quotients.",
  lesson: "The convergents of [a₀; a₁, a₂, …] are the fractions you get by cutting it off after each partial quotient, built by pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.",
  prompt: "The Cipher Room’s key is the continued fraction [3; 4, 2, 5]. Its convergents are C₀ = [3], C₁ = [3; 4], C₂ = [3; 4, 2] and C₃, the whole fraction. Enter the numerator, then the denominator, of the third convergent C₂, in lowest terms.",
  answer: [29,9], labels: ["numerator of C₂","denominator of C₂"], tolerance: 0.01,
  hints: [
   "Start from p₋₁ = 1 and q₋₁ = 0, and C₀ = a₀ ÷ 1, so p₀ = a₀ and q₀ = 1.",
   "Each new convergent uses the two before it: pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂. The fractions it gives are already in lowest terms."
  ],
  solution: "p₀ = 3 and q₀ = 1. Then p₁ = 4 × 3 + 1 = 13 and q₁ = 4 × 1 + 0 = 4. Then p₂ = 2 × 13 + 3 = 29 and q₂ = 2 × 4 + 1 = 9. So C₂ = 29/9.",
  xp: 200, prereqs: ["q35"],
  artifact: { name: "Convergent ladder", description: "A row of fractions closing in on the cipher key from both sides." },
  sources: [source.r6_2],
  teaching: {
   intuition: "Cut a continued fraction off early and you get a simpler fraction close to its full value. Cutting [a₀; a₁, a₂, a₃] after a₀ gives C₀ = [a₀]; after a₁ it gives C₁ = [a₀; a₁]; after a₂ it gives C₂ = [a₀; a₁, a₂]; and the last one is the whole fraction. These are the convergents. They are counted from C₀, so C₂ is the third. They fall on alternate sides of the full value and close in on it. You could work out each one from scratch, but a faster rule builds each from the two before it. Write the convergent Cₖ as pₖ/qₖ. Start with p₋₁ = 1, q₋₁ = 0 and p₀ = a₀, q₀ = 1. Then each new numerator is pₖ = aₖ × pₖ₋₁ + pₖ₋₂, and each new denominator is qₖ = aₖ × qₖ₋₁ + qₖ₋₂. The fractions this gives are always in lowest terms.",
   steps: [
    "Write down the partial quotients a₀, a₁, a₂, ….",
    "Start the two rows: p₋₁ = 1 and p₀ = a₀ for the numerators, q₋₁ = 0 and q₀ = 1 for the denominators.",
    "For each next partial quotient aₖ: pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.",
    "Stop at the convergent you need: Cₖ = pₖ/qₖ, already in lowest terms."
   ],
   example: {
    prompt: "Find the third convergent C₂ of [1; 2, 3, 4].",
    steps: [
     "p₀ = 1 and q₀ = 1.",
     "p₁ = 2 × 1 + 1 = 3 and q₁ = 2 × 1 + 0 = 2, so C₁ = 3/2.",
     "p₂ = 3 × 3 + 1 = 10 and q₂ = 3 × 2 + 1 = 7, so C₂ = 10/7. Check: 1 + 1 ÷ (2 + 1/3) = 1 + 3/7 = 10/7."
    ],
    answer: "C₂ = 10/7."
   },
   pitfalls: [
    "Counting the convergents from C₁. The first is C₀ = a₀, so the third is C₂.",
    "Mixing the rows: numerators are built from the earlier numerators, denominators from the earlier denominators.",
    "Using the whole continued fraction when only part of it is asked for. C₂ stops at a₂."
   ]
  },
  guidance: [
   { prompt: "C₀ = [3]. What are its numerator p₀ and denominator q₀?", answer: [3,1], labels: ["p₀","q₀"], explanation: "C₀ = 3 = 3/1." },
   { prompt: "C₁ = [3; 4] = 3 + 1/4. What are p₁ and q₁?", answer: [13,4], labels: ["p₁","q₁"], explanation: "p₁ = 4 × 3 + 1 = 13 and q₁ = 4 × 1 + 0 = 4, so C₁ = 13/4." },
   { prompt: "Use a₂ = 2 with the two convergents before it. What are p₂ and q₂?", answer: [29,9], labels: ["p₂","q₂"], explanation: "p₂ = 2 × 13 + 3 = 29 and q₂ = 2 × 4 + 1 = 9." }
  ]
 },
 {
  id: 'q37', title: "Rebuilding the code-wheel ratio", topic: "Recovering a fraction from a decimal", tier: 'Advanced', sector: "Cipher Room",
  brief: "A damaged log kept only a rounded decimal for a gear ratio, and Mira needs the exact fraction back to rebuild the code wheel.",
  lesson: "Expand a rounded decimal as a continued fraction: a sudden, very large partial quotient marks the rounding, and the convergent just before it is the fraction.",
  prompt: "A garbled log in the Cipher Room gives the code wheel’s turn per tick as 432432 millionths of a turn: the true value rounded to six decimal places, written as a whole number of millionths. The true value is a fraction whose denominator is under 100. Enter its numerator, then its denominator, in lowest terms.",
  answer: [16,37], labels: ["numerator","denominator"], tolerance: 0.01,
  hints: [
   "Write the reading as a fraction over 1000000 and expand it as a continued fraction with Euclid’s algorithm. Its whole-number part is 0, so a₀ = 0.",
   "The rounding shows up as one very large partial quotient. Cut the continued fraction just before it, and work out that convergent with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂."
  ],
  solution: "The reading is 432432/1000000. Euclid’s algorithm: 1000000 = 2 × 432432 + 135136, 432432 = 3 × 135136 + 27024, 135136 = 5 × 27024 + 16, and then 27024 ÷ 16 has quotient 1689. So the reading is [0; 2, 3, 5, 1689, …]. The partial quotient 1689 is huge, so cut before it: [0; 2, 3, 5]. Convergents: C₁ = 1/2, C₂ = 3/7, C₃ = (5 × 3 + 1)/(5 × 7 + 2) = 16/37. Check: 16 ÷ 37 × 1000000 ≈ 432432.4324, which rounds to 432432.",
  xp: 200, prereqs: ["q36"],
  artifact: { name: "Restored gear ratio", description: "An exact fraction rebuilt from six rounded digits." },
  sources: [source.r6_4],
  teaching: {
   intuition: "A fraction with a small denominator has a short continued fraction. A rounded decimal is a tiny bit off from that fraction, and the tiny error has to show up somewhere in its expansion. It shows up as one enormous partial quotient: the decimal’s expansion runs exactly like the fraction’s for a few steps, then a huge quotient appears, and whatever comes after it only describes the rounding. So the recipe is: write the decimal rounded to six places as a whole number of millionths over 1000000 (0.192308 is 192308/1000000), run Euclid’s algorithm as for any fraction, and watch the quotients. When one is suddenly in the hundreds or thousands, cut the continued fraction just before it. The convergent that is left is the fraction, and you can check it by dividing.",
   steps: [
    "Write the six-place decimal as a whole number of millionths over 1000000.",
    "Expand it with Euclid’s algorithm, noting each quotient: a₀, a₁, a₂, ….",
    "Stop at the first quotient that is suddenly very large, and keep only the partial quotients before it.",
    "Build the convergent from those partial quotients with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂, then check it by dividing."
   ],
   example: {
    prompt: "A reading of 192308 millionths (0.192308) is a fraction with a denominator under 100, rounded to six decimal places. Which fraction is it?",
    steps: [
     "0.192308 = 192308/1000000. Euclid: 1000000 = 5 × 192308 + 38460, 192308 = 5 × 38460 + 8, and 38460 = 4807 × 8 + 4.",
     "So the decimal is [0; 5, 5, 4807, …]. The quotient 4807 is huge, so cut before it: [0; 5, 5].",
     "p₁ = 1 and q₁ = 5; p₂ = 5 × 1 + 0 = 5 and q₂ = 5 × 5 + 1 = 26. Check: 5 ÷ 26 = 0.1923076…, which is 192307.6… millionths and rounds to 192308."
    ],
    answer: "5/26."
   },
   pitfalls: [
    "Cutting after the large partial quotient instead of before it. That gives a fraction with a huge denominator: the rounded reading itself.",
    "Rounding at every step of the expansion on a calculator. The small errors grow; work with the exact whole numbers of Euclid’s algorithm.",
    "Forgetting that a₀ = 0 for a decimal below 1. The first quotient after it is a₁."
   ]
  },
  guidance: [
   { prompt: "Expand 432432/1000000 with Euclid’s algorithm. a₀ = 0; what are the next three partial quotients a₁, a₂ and a₃?", answer: [2,3,5], labels: ["a₁","a₂","a₃"], explanation: "1000000 = 2 × 432432 + 135136, 432432 = 3 × 135136 + 27024 and 135136 = 5 × 27024 + 16. The next quotient, 1689, is huge: that is where the rounding hides." },
   { prompt: "With p₀ = 0, q₀ = 1, C₁ = 1/2, what are the numerator and denominator of C₂ = [0; 2, 3]?", answer: [3,7], labels: ["p₂","q₂"], explanation: "p₂ = 3 × 1 + 0 = 3 and q₂ = 3 × 2 + 1 = 7." },
   { prompt: "Cut before the huge quotient. What are the numerator and denominator of C₃ = [0; 2, 3, 5]?", answer: [16,37], labels: ["numerator","denominator"], explanation: "p₃ = 5 × 3 + 1 = 16 and q₃ = 5 × 7 + 2 = 37, so the fraction is 16/37." }
  ]
 },
 {
  id: 'q38', title: "Locking the first message", topic: "RSA: encrypting", tier: 'Advanced', sector: "Cipher Room",
  brief: "The outpost needs a lock that anyone can close but only Mira can open, starting with one short coded message.",
  lesson: "In RSA the public key is a modulus n = pq and an encryption exponent e; a message m below n is sent as the ciphertext c = mᵉ mod n.",
  prompt: "Mira chose the secret primes 13 and 37 and published her public key: the modulus n, which is the product of the two primes, and the encryption exponent e = 5. To send her the message m = 123 with RSA, enter n, then the ciphertext c = 123⁵ mod n as a least residue.",
  answer: [481,340], labels: ["modulus n","ciphertext c"], tolerance: 0.01,
  hints: [
   "The modulus n is the product of the two primes.",
   "Work out mᵉ mod n by repeated squaring: square m again and again, reducing mod n each time, then multiply the powers whose exponents add up to e."
  ],
  solution: "n = 13 × 37 = 481. Repeated squaring mod 481: 123¹ ≡ 123, 123² ≡ 218, 123⁴ ≡ 386. 5 = 4 + 1, so 123⁵ ≡ 386 × 123: 386 × 123 = 47478 ≡ 340. The ciphertext is c = 340.",
  xp: 200, prereqs: ["q19","q21"],
  artifact: { name: "First sealed message", description: "A number that only the holder of the secret primes can turn back into words." },
  sources: [source.bc1_27, source.r8_1],
  teaching: {
   intuition: "Most locks use one key to close and the same key to open. RSA splits the two. Mira picks two secret primes p and q and multiplies them to get the modulus n = p × q. She also picks an encryption exponent e that shares no factor with φ(n). The pair (n, e) is her public key: she can pin it on the station noticeboard, because it only closes the lock. To send her a message, turn it into a whole number m smaller than n and work out the ciphertext c = mᵉ mod n, the remainder of m to the power e on division by n. Repeated squaring keeps every step small. Anyone can do this, but undoing it needs a second exponent that comes from φ(n), and finding φ(n) needs the two primes. Multiplying two primes is easy; splitting a large n back into them is, as far as anyone knows, extremely slow. That gap keeps the message safe.",
   steps: [
    "Find the modulus n = p × q. The public key is the pair (n, e).",
    "Check that the message m is a whole number from 0 to n − 1.",
    "Work out mᵉ mod n by repeated squaring: square m, reducing mod n, then multiply the powers whose exponents add up to e.",
    "The remainder is the ciphertext c, a least residue from 0 to n − 1. Only c is sent."
   ],
   example: {
    prompt: "The public key is n = 33 = 3 × 11 with e = 3. Encrypt the message m = 4.",
    steps: [
     "4² = 16, which is already below 33.",
     "4³ = 16 × 4 = 64 = 1 × 33 + 31, so 4³ ≡ 31 (mod 33)."
    ],
    answer: "c = 31."
   },
   pitfalls: [
    "Publishing the primes. Only n and e are public; anyone who knows p and q can find φ(n) and unlock every message.",
    "Working out the full power before reducing. Reduce mod n after every multiplication and the numbers stay small.",
    "Choosing an e that shares a factor with φ(n). Then no decryption exponent exists, and the message cannot be unlocked."
   ]
  },
  guidance: [
   { prompt: "What is the modulus n = 13 × 37?", answer: [481], labels: ["n"], explanation: "13 × 37 = 481." },
   { prompt: "Square the message twice. What are 123² mod 481 and 123⁴ mod 481?", answer: [218,386], labels: ["m² mod n","m⁴ mod n"], explanation: "123² = 15129 ≡ 218, and 123⁴ ≡ 218² = 47524 ≡ 386 (mod 481)." },
   { prompt: "Combine the powers. What is the ciphertext 123⁵ mod 481?", answer: [340], labels: ["ciphertext c"], explanation: "Repeated squaring mod 481: 123¹ ≡ 123, 123² ≡ 218, 123⁴ ≡ 386. 5 = 4 + 1, so 123⁵ ≡ 386 × 123: 386 × 123 = 47478 ≡ 340." }
  ]
 },
 {
  id: 'q39', title: "Unlocking the reply", topic: "RSA: the decryption key", tier: 'Advanced', sector: "Cipher Room",
  brief: "A coded reply has reached the Cipher Room, and only Mira, who knows the secret primes, can build the key that opens it.",
  lesson: "The decryption exponent d is the inverse of e mod φ(n); raising the ciphertext to the power d mod n gives back the message.",
  prompt: "A reply for the outpost arrived as the RSA ciphertext c = 212. The public key is n = 253 with encryption exponent e = 3, and Mira keeps the secret primes: 253 = 11 × 23. Enter φ(n), then the decryption exponent d (the inverse of e mod φ(n), from 1 to φ(n) − 1), then the message m = cᵈ mod n as a least residue.",
  answer: [220,147,42], labels: ["φ(n)","decryption exponent d","message m"], tolerance: 0.01,
  hints: [
   "For two different primes, φ(pq) = (p − 1) × (q − 1).",
   "d is the number from 1 to φ(n) − 1 with e × d leaving remainder 1 on division by φ(n): find it with Euclid’s algorithm worked backwards. Then work out cᵈ mod n by repeated squaring."
  ],
  solution: "φ(253) = (11 − 1) × (23 − 1) = 220. Euclid’s algorithm on 220 and 3: 220 = 73 × 3 + 1, 3 = 3 × 1 + 0. Working backwards gives d = 147; check: 3 × 147 = 441 = 2 × 220 + 1. Repeated squaring mod 253: 212¹ ≡ 212, 212² ≡ 163, 212⁴ ≡ 4, 212⁸ ≡ 16, 212¹⁶ ≡ 3, 212³² ≡ 9, 212⁶⁴ ≡ 81, 212¹²⁸ ≡ 236. 147 = 128 + 16 + 2 + 1, so 212¹⁴⁷ ≡ 236 × 3 × 163 × 212: 236 × 3 = 708 ≡ 202, 202 × 163 = 32926 ≡ 36, 36 × 212 = 7632 ≡ 42. The message is m = 42.",
  xp: 200, prereqs: ["q38","q15"],
  artifact: { name: "Private key", description: "The decryption exponent, kept in Mira’s pocket and nowhere else." },
  sources: [source.bc1_27, source.r8_1],
  teaching: {
   intuition: "Encrypting raised the message m to the power e mod n. To undo it, raise the ciphertext c to a second power d, chosen so that e × d leaves remainder 1 on division by φ(n): d is the modular inverse of e mod φ(n). Then c to the power d is m to the power e × d. Euler’s theorem says that a number sharing no factor with n, raised to the power φ(n), leaves remainder 1 mod n; since e × d is one more than a multiple of φ(n), m to the power e × d comes back round to m itself, mod n. The number d is the decryption exponent, and with n it makes the private key, which Mira shows no one. Finding d needs φ(n) = (p − 1) × (q − 1), and that needs the secret primes. With them, Euclid’s algorithm worked backwards gives d in a few lines, and repeated squaring does the rest.",
   steps: [
    "Find φ(n) = (p − 1) × (q − 1) from the secret primes.",
    "Find d, the inverse of e mod φ(n): the number from 1 to φ(n) − 1 with e × d leaving remainder 1 on division by φ(n). Euclid’s algorithm worked backwards finds it.",
    "Check: e × d should be one more than a multiple of φ(n).",
    "Work out cᵈ mod n by repeated squaring. The result is the message m."
   ],
   example: {
    prompt: "The public key is n = 55 = 5 × 11 with e = 7, and the ciphertext is c = 2. Find φ(n), d and the message.",
    steps: [
     "φ(55) = 4 × 10 = 40.",
     "40 = 5 × 7 + 5, 7 = 1 × 5 + 2 and 5 = 2 × 2 + 1. Working backwards, 1 = 3 × 40 − 17 × 7, and −17 + 40 = 23, so d = 23: 7 × 23 = 161 = 4 × 40 + 1.",
     "Squaring mod 55 gives 2, 4, 16, 36 and 31 for the powers 1, 2, 4, 8 and 16. 23 = 16 + 4 + 2 + 1, so 2²³ ≡ 31 × 16 × 4 × 2 ≡ 8 (mod 55)."
    ],
    answer: "φ(55) = 40, d = 23 and the message is m = 8."
   },
   pitfalls: [
    "Taking d as the inverse of e mod n. It is the inverse mod φ(n).",
    "Using φ(n) = n − 1. That holds only when n is prime; for n = p × q it is (p − 1) × (q − 1).",
    "Keeping a negative d from Euclid’s algorithm. Add φ(n) until it lies between 1 and φ(n) − 1."
   ]
  },
  guidance: [
   { prompt: "253 = 11 × 23. What is φ(253)?", answer: [220], labels: ["φ(n)"], explanation: "φ(253) = (11 − 1) × (23 − 1) = 10 × 22 = 220." },
   { prompt: "Find d from 1 to 219 with 3 × d leaving remainder 1 on division by 220.", answer: [147], labels: ["d"], explanation: "220 = 73 × 3 + 1, 3 = 3 × 1 + 0. Working backwards gives d = 147: 3 × 147 = 441 = 2 × 220 + 1." },
   { prompt: "Decrypt. What is 212¹⁴⁷ mod 253?", answer: [42], labels: ["message m"], explanation: "Repeated squaring mod 253: 212¹ ≡ 212, 212² ≡ 163, 212⁴ ≡ 4, 212⁸ ≡ 16, 212¹⁶ ≡ 3, 212³² ≡ 9, 212⁶⁴ ≡ 81, 212¹²⁸ ≡ 236. 147 = 128 + 16 + 2 + 1, so 212¹⁴⁷ ≡ 236 × 3 × 163 × 212: 236 × 3 = 708 ≡ 202, 202 × 163 = 32926 ≡ 36, 36 × 212 = 7632 ≡ 42." }
  ]
 },
 {
  id: 'q40', title: "The divisor network for the Map Room", topic: "Realm review: the divisor network", tier: 'Advanced', sector: "Cipher Room",
  brief: "Before the Map Room takes over, Mira wants the outpost’s code numbers drawn as one network of dividing links, and its size checked.",
  lesson: "In the divisor network on 1 to N, each number a links up to its multiples, so it has (the quotient of N ÷ a) − 1 links going up; adding these counts gives every link once.",
  prompt: "For the hand-over to the Map Room, Mira draws the outpost’s divisor network: one dot for each code number from 1 to 24, and one link between a and b whenever a < b and a divides b. Enter the number of links in the network, then gcd(16, 20), the largest code number that divides both 16 and 20.",
  answer: [60,4], labels: ["number of links","gcd"], tolerance: 0.01,
  hints: [
   "The links that go up from a lead to its multiples 2a, 3a, … that are at most N. There are (the quotient of N ÷ a) − 1 of them.",
   "Add these counts for a = 1, 2, 3 and so on. Once a is more than half of N, it has no multiple left to link to. For the gcd, compare the two prime factorisations and keep the smaller exponent of each prime."
  ],
  solution: "Links going up from a = 1, 2, …, 12: 23 + 11 + 7 + 5 + 3 + 3 + 2 + 2 + 1 + 1 + 1 + 1 = 60; a number above 12 has no multiple up to 24. So the network has 60 links. 16 = 2⁴ and 20 = 2² × 5, so gcd(16, 20) = 4.",
  xp: 200, prereqs: ["q39","q05"],
  artifact: { name: "Divisor network map", description: "The outpost’s code numbers joined by every dividing link, ready for the Map Room." },
  sources: [source.r2_4],
  teaching: {
   intuition: "Draw a dot for each whole number from 1 to N, and join a to b with a link whenever a is smaller than b and a divides b. The result is a network of dots and links, the kind of picture Graph theory studies next. Counting the links one by one is slow, so count each link from its smaller end. The links that go up from a lead to its multiples 2a, 3a, 4a and so on, as far as N. The multiples of a from a up to N number exactly the quotient of N ÷ a, with the remainder ignored; leaving out a itself, a has that quotient minus 1 links going up. Add these counts for a = 1, 2, 3 and onwards. Once a is more than half of N, even 2a is past N, so the counts stop there. The network also shows the gcd from Chapter 1: when neither of two numbers divides the other, their gcd is the largest dot linked up to both.",
   steps: [
    "For each a from 1 up to half of N, find the quotient of N ÷ a, ignoring the remainder.",
    "Subtract 1: that is the number of links going up from a.",
    "Add the counts: every link is counted once, from its smaller end.",
    "For a gcd, write both prime factorisations and keep the smaller exponent of each shared prime."
   ],
   example: {
    prompt: "Count the links of the divisor network on 1 to 6, and find gcd(4, 6).",
    steps: [
     "From 1: 6 ÷ 1 has quotient 6, so 5 links. From 2: quotient 3, so 2 links (to 4 and 6). From 3: quotient 2, so 1 link (to 6).",
     "Above 3 there are none: 4, 5 and 6 have no multiple up to 6. The total is 5 + 2 + 1 = 8 links.",
     "4 = 2² and 6 = 2 × 3 share one 2, so gcd(4, 6) = 2."
    ],
    answer: "8 links, and gcd(4, 6) = 2."
   },
   pitfalls: [
    "Counting a link from both of its ends. Count each link only from its smaller number.",
    "Forgetting to subtract 1: a is one of its own multiples, but a dot has no link to itself.",
    "Leaving out a = 1. 1 divides every number, so it has N − 1 links."
   ]
  },
  guidance: [
   { prompt: "How many links go up from 1, from 2 and from 3 when the numbers run to 24?", answer: [23,11,7], labels: ["links from 1","links from 2","links from 3"], explanation: "1 divides every number from 2 to 24: 23 links. The quotient of 24 ÷ 2 is 12, so 2 has 11; the quotient of 24 ÷ 3 is 8, so 3 has 7." },
   { prompt: "Add the counts for every a up to 12. How many links are there in all?", answer: [60], labels: ["number of links"], explanation: "23 + 11 + 7 + 5 + 3 + 3 + 2 + 2 + 1 + 1 + 1 + 1 = 60." },
   { prompt: "What is gcd(16, 20)?", answer: [4], labels: ["gcd"], explanation: "16 = 2⁴ and 20 = 2² × 5; the shared part is 2² = 4." }
  ]
 }
);
})();
