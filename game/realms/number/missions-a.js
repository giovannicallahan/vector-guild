/* Number theory: the hidden life of whole numbers missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/number/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · Quotient and remainder [R1.3]
     q02  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · Writing numbers in other bases [R1.4]
     q03  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · Primes and the sieve [R2.1]
     q04  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · Prime factorisation [R2.3]
     q05  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · gcd and lcm from factorisations [R2.4]
     q06  ch 1 Divisors and primes · Basic, 100 XP · sector 'Crate Store' · Euclid's algorithm [R1.6]
     q07  ch 2 Combining whole numbers · Basic, 100 XP · sector 'Fuel Depot' · Bézout coefficients [R1.6]
     q08  ch 2 Combining whole numbers · Basic, 100 XP · sector 'Fuel Depot' · Linear Diophantine equations [R2.5]
     q09  ch 2 Combining whole numbers · Basic, 100 XP · sector 'Fuel Depot' · Counting divisors τ(n) [R4.2]
     q10  ch 2 Combining whole numbers · Basic, 100 XP · sector 'Fuel Depot' · Adding divisors σ(n); multiplicative functions [R4.1, R4.2] */
(function(){
'use strict';
/* Raji, Elementary Number Theory (LibreTexts): the sections docs/plans/NUMBER-PLAN.md gives for q01–q10, each opened on the date in `verified`. */
const source = {
 r13: { title: "Raji, Elementary Number Theory (LibreTexts) — 1.3 Divisibility and the Division Algorithm", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/01%3A_Introduction/1.03%3A_Divisibility_and_the_Division_Algorithm", description: "Divisibility, a | b, and the division algorithm a = bq + r with 0 ≤ r < b.", verified: '2026-11-27' },
 r14: { title: "Raji, Elementary Number Theory (LibreTexts) — 1.4 Representations of Integers in Different Bases", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/01%3A_Introduction/1.04%3A_Representations_of_Integers_in_Different_Bases", description: "Writing integers in base b, reading a base-b numeral in base ten, and converting by repeated division.", verified: '2026-11-27' },
 r16: { title: "Raji, Elementary Number Theory (LibreTexts) — 1.6 The Euclidean Algorithm", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/01%3A_Introduction/1.06%3A_The_Euclidean_Algorithm", description: "The gcd by repeated division, and writing the gcd as a linear combination by working backwards.", verified: '2026-11-27' },
 r21: { title: "Raji, Elementary Number Theory (LibreTexts) — 2.1 The Sieve of Eratosthenes", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.01%3A_The_Sieve_of_Eratosthenes", description: "Primes and composites, a prime factor no bigger than the square root, and the sieve of Eratosthenes.", verified: '2026-11-27' },
 r23: { title: "Raji, Elementary Number Theory (LibreTexts) — 2.3 The Fundamental Theorem of Arithmetic", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.03%3A_The_Fundamental_Theorem_of_Arithmetic", description: "Every positive integer other than 1 is a product of primes in exactly one way.", verified: '2026-11-27' },
 r24: { title: "Raji, Elementary Number Theory (LibreTexts) — 2.4 Least Common Multiple", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.04%3A_Least_Common_Multiple", description: "The lcm and gcd from the larger and smaller prime exponents, and lcm = ab ÷ gcd.", verified: '2026-11-27' },
 r25: { title: "Raji, Elementary Number Theory (LibreTexts) — 2.5 Linear Diophantine Equations", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/02%3A_Prime_Numbers/2.05%3A_Linear_Diophantine_Equations", description: "ax + by = c is solvable exactly when gcd(a, b) divides c, and the form of every solution.", verified: '2026-11-27' },
 r41: { title: "Raji, Elementary Number Theory (LibreTexts) — 4.1 Definitions and Properties", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.01%3A_Definitions_and_Properties", description: "Arithmetic functions, multiplicative functions, and sums of a function over the divisors of n.", verified: '2026-11-27' },
 r42: { title: "Raji, Elementary Number Theory (LibreTexts) — 4.2 Multiplicative Number Theoretic Functions", url: "https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/04%3A_Multiplicative_Number_Theoretic_Functions/4.02%3A_Multiplicative_Number_Theoretic_Functions", description: "The number of divisors τ(n) and the sum of divisors σ(n) from the prime factorisation; both are multiplicative.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01", title: "Packing the first delivery", topic: "Quotient and remainder", tier: "Basic", sector: "Crate Store",
  brief: "The first delivery of bolts is on the dock, and the crate store needs to know how many full crates it fills and what is left loose.",
  lesson: "Dividing a by b > 0 gives one quotient q and one remainder r with a = bq + r and 0 ≤ r < b, even when a is negative.",
  prompt: "A delivery of 287 bolts reaches the crate store, and each crate holds 12 bolts. Write 287 = 12q + r with 0 ≤ r < 12, and enter the quotient q (the full crates) and the remainder r (the bolts left over). The stock ledger also shows −95: the store owes 95 bolts. Write −95 = 12q + r with 0 ≤ r < 12 too, and enter that q and r.",
  answer: [23,11,-8,1], labels: ["q for the delivery","r for the delivery","q for the shortfall","r for the shortfall"], tolerance: 0.01,
  hints: [
   "The quotient is how many whole times the divisor fits into the number; the remainder is what is left, and it must be at least zero and less than the divisor.",
   "For a negative number, go down to the first multiple of the divisor at or below it. That gives a negative quotient, and the remainder is the distance back up."
  ],
  solution: "12 × 23 = 276 and 287 − 276 = 11, so 287 = 12 × 23 + 11: q = 23 and r = 11. For −95: 95 = 12 × 7 + 11, so −84 is above −95, and the first multiple of 12 at or below −95 is 12 × (−8) = −96. From −96 up to −95 is 1, so −95 = 12 × (−8) + 1: q = −8 and r = 1.",
  xp: 100, prereqs: [],
  artifact: {"name":"Crate tally, page one","description":"The first delivery split into full crates and a few loose bolts."},
  sources: [source.r13],
  teaching: {
   intuition: "Number theory is the study of whole numbers: 0, 1, 2, 3 and so on, and the negative ones −1, −2, −3 too. Its first question is how one whole number fits into another. Pack 17 bolts into crates of 5: three crates fill up and 2 bolts are left. The number of full crates is the quotient, and the bolts left over are the remainder. In symbols, 17 = 5 × 3 + 2. The division algorithm says this always works: for any whole number a and any whole number b above 0, there is exactly one quotient q and one remainder r with a = bq + r and 0 ≤ r < b. Here bq means b × q. The remainder is never negative and never as big as b. When the remainder is 0, we say b divides a, or b is a divisor of a, and a is a multiple of b; we write b | a, read “b divides a”. So 5 | 20, because 20 = 5 × 4 + 0. A negative number follows the same rule. To divide −17 by 5, go down to the first multiple of 5 at or below −17, which is −20 = 5 × (−4), then count back up: −17 = 5 × (−4) + 3. The remainder is 3, not −2.",
   steps: [
    "Find the largest multiple of b that is not above a. Its multiplier is the quotient q.",
    "Subtract that multiple from a. What is left is the remainder r, and it must satisfy 0 ≤ r < b.",
    "For a negative a, divide the number without its minus sign first. If that leaves a remainder, the quotient for a is minus one more than that quotient, and r is b minus that remainder.",
    "Check by multiplying back: b × q + r must give a."
   ],
   example: {
    prompt: "Divide 53 by 7, and divide −20 by 6, each in the form a = bq + r with 0 ≤ r < b.",
    steps: [
     "7 × 7 = 49 is the largest multiple of 7 not above 53, and 53 − 49 = 4, so 53 = 7 × 7 + 4.",
     "Without the minus sign, 20 = 6 × 3 + 2. The first multiple of 6 at or below −20 is 6 × (−4) = −24, and −20 − (−24) = 4."
    ],
    answer: "53 = 7 × 7 + 4, so q = 7 and r = 4; −20 = 6 × (−4) + 4, so q = −4 and r = 4."
   },
   pitfalls: [
    "Giving a negative remainder for a negative number: −20 = 6 × (−3) − 2 is true, but −2 is not allowed as a remainder. Go one more multiple down.",
    "Letting the remainder reach b. A remainder of 7 when dividing by 7 means one more full crate fits.",
    "Mixing up the two answers: the quotient counts the full crates, the remainder counts the loose items."
   ]
  },
  guidance: [
   { prompt: "How many whole times does 12 go into 287, and how many bolts are left over?", answer: [23,11], labels: ["quotient","remainder"], explanation: "12 × 23 = 276 is the largest multiple of 12 that is not above 287, and 287 − 276 = 11, which is less than 12." },
   { prompt: "Leave the minus sign aside for a moment and divide 95 by 12. What are the quotient and the remainder?", answer: [7,11], labels: ["quotient without the sign","remainder without the sign"], explanation: "95 = 12 × 7 + 11. Putting a minus in front would give a remainder of −11, which is not allowed." },
   { prompt: "The remainder may not be negative, so go one more multiple of 12 down, below −95. What are q and r for −95?", answer: [-8,1], labels: ["q for the shortfall","r for the shortfall"], explanation: "12 × (−8) = −96 is the first multiple at or below −95, and −95 − (−96) = 1, so −95 = 12 × (−8) + 1." }
  ]
 },
 {
  id: "q02", title: "The old crate labeller", topic: "Writing numbers in other bases", tier: "Basic", sector: "Crate Store",
  brief: "An old labeller in the crate store prints counts in a different base, and its labels have to be read and written correctly.",
  lesson: "In base b each place is worth b times the place to its right; dividing by b again and again gives the digits from the right.",
  prompt: "The crate store’s old labeller works in base 6, so it prints only the digits 0 to 5. One crate is labelled (2351)₆. Enter the number of parts in that crate, written in base ten (type it without commas). Then the labeller must print a new count of 845 parts in base 6, which takes exactly four digits: enter those digits from left to right.",
  answer: [571,3,5,2,5], labels: ["value in base ten","first digit","second digit","third digit","fourth digit"], tolerance: 0.01,
  hints: [
   "In a base, each place from the right is worth the base times the place before it: ones, then the base, then the base squared, then the base cubed. Multiply each digit by its place value and add.",
   "To write a number in a base, divide by the base again and again. The remainders are the digits from the right, so read them from the last one back to the first."
  ],
  solution: "In base 6 the four places are worth 216, 36, 6 and 1, so (2351)₆ = 2 × 216 + 3 × 36 + 5 × 6 + 1 = 571. For 845: 845 = 6 × 140 + 5, 140 = 6 × 23 + 2, 23 = 6 × 3 + 5, and 3 = 6 × 0 + 3. Reading the remainders from the last to the first gives (3525)₆.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Labeller conversion card","description":"A card for reading the old labeller’s base and writing counts in it."},
  sources: [source.r14],
  teaching: {
   intuition: "We usually write numbers in base ten. Each digit is one of the symbols 0 to 9, and each place is worth ten times the place to its right: ones, tens, hundreds, thousands. So 352 means 3 hundreds, 5 tens and 2 ones. Nothing is special about ten. In base b, where b is a whole number above 1, the digits are 0 to b − 1 and the places from the right are worth 1, b, b × b and b × b × b, written 1, b, b² and b³. We put the base as a small number after the brackets: (213)₄ means 2 × 16 + 1 × 4 + 3 = 39. To go the other way, use the division algorithm of the last mission. Dividing a number by b leaves a remainder from 0 to b − 1: that remainder is the last digit, and the quotient counts the groups of b that are left. Dividing the quotient by b again gives the next digit, and so on until the quotient is 0. The remainders, read from the last one back to the first, are the digits.",
   steps: [
    "To read a base-b numeral, write the place values from the right: 1, b, b², b³, and so on.",
    "Multiply each digit by its place value and add. The total is the value in base ten.",
    "To write a number in base b, divide it by b and keep the remainder; then divide the quotient by b, and so on until the quotient is 0.",
    "Read the remainders from the last one to the first: they are the digits from left to right."
   ],
   example: {
    prompt: "What is (123)₅ in base ten? And what are the digits of 47 in base 4?",
    steps: [
     "In base 5 the places are worth 25, 5 and 1, so (123)₅ = 1 × 25 + 2 × 5 + 3 = 38.",
     "47 = 4 × 11 + 3, then 11 = 4 × 2 + 3, then 2 = 4 × 0 + 2. Reading the remainders from the last: 2, 3, 3."
    ],
    answer: "(123)₅ = 38, and 47 = (233)₄."
   },
   pitfalls: [
    "Reading the remainders in the order you found them. The first remainder is the last digit, so the digits come out right to left.",
    "Using base-ten place values (10, 100, 1000) for a numeral in another base.",
    "Writing a digit as big as the base. In base 6 the digits stop at 5: a remainder of 6 means the division was not finished."
   ]
  },
  guidance: [
   { prompt: "In base 6, what are the place values of the first two of the four places, 6³ and 6²?", answer: [216,36], labels: ["b³","b²"], explanation: "6³ = 6 × 6 × 6 = 216 and 6² = 6 × 6 = 36. The last two places are worth 6 and 1." },
   { prompt: "What is (2351)₆ in base ten?", answer: [571], labels: ["value in base ten"], explanation: "2 × 216 + 3 × 36 + 5 × 6 + 1 × 1 = 432 + 108 + 30 + 1 = 571." },
   { prompt: "Divide 845 by 6. What are the quotient and the remainder? The remainder is the last digit.", answer: [140,5], labels: ["quotient","last digit"], explanation: "845 = 6 × 140 + 5, so the ones digit in base 6 is 5, and the rest of the number is 140 groups of 6." },
   { prompt: "Keep dividing each quotient by 6. What are the four digits of 845 in base 6, from left to right?", answer: [3,5,2,5], labels: ["first digit","second digit","third digit","fourth digit"], explanation: "140 = 6 × 23 + 2 and 23 = 6 × 3 + 5, and 3 is less than 6, so the digits are 3, 5, 2, 5. Check: 3 × 216 + 5 × 36 + 2 × 6 + 5 = 845." }
  ]
 },
 {
  id: "q03", title: "Crates that will not split", topic: "Primes and the sieve", tier: "Basic", sector: "Crate Store",
  brief: "Some deliveries will not split into equal crates at all, and the store wants to spot them before the packing starts.",
  lesson: "A prime has no divisors but 1 and itself; testing primes up to the square root finds the smallest prime factor, and the sieve lists the primes.",
  prompt: "A delivery of 391 washers must go into equal crates with nothing left over, each crate holding more than 1 washer. Enter the smallest crate size that works (if 391 is prime, the only size is a single crate of all 391). Then the store keeps one shelf for each prime from 2 up to 60, including 60 if it is prime: enter how many shelves that is.",
  answer: [17,17], labels: ["smallest crate size","prime shelves"], tolerance: 0.01,
  hints: [
   "Test the primes in order, smallest first. You only need primes whose square is not more than the number: if none of those divides it, the number is prime.",
   "For the count, write out the numbers from two up to the limit and cross out every multiple of each prime up to seven, but not the prime itself. What is left are the primes."
  ],
  solution: "19 × 19 = 361 is not more than 391, but 20 × 20 = 400 is, so only primes up to 19 need testing. 2, 3, 5, 7, 11 and 13 do not divide 391, but 17 does: 391 = 17 × 23. So 391 is composite and the smallest crate size is 17. The sieve leaves these primes up to 60: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53 and 59. There are 17 of them.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Sieve board","description":"The numbers to one hundred, with every multiple of a small prime struck out."},
  sources: [source.r21],
  teaching: {
   intuition: "Recall from the first mission that b divides a when a ÷ b leaves no remainder. Every whole number above 1 is divisible by 1 and by itself. A prime is a whole number above 1 with no other divisors: 2, 3, 5, 7, 11, 13 and so on. A whole number above 1 that is not prime is composite: it splits as a product of two smaller whole numbers above 1, like 15 = 3 × 5. To test whether a number n is prime, try dividing it by the primes 2, 3, 5, 7 and onwards. The first one that divides n is its smallest prime factor. You can stop early. If n = a × b with both a and b bigger than the square root of n (the number whose square is n), then a × b would be bigger than n. So a composite n always has a prime factor whose square is at most n, and if no such prime divides n, n is prime. To list every prime up to a limit, use the sieve of Eratosthenes: write the numbers from 2 to the limit, then cross out every multiple of 2 except 2, every multiple of 3 except 3, and so on for each prime whose square is not above the limit. The numbers left are the primes.",
   steps: [
    "Find the largest whole number whose square is not more than n.",
    "Try the primes up to that number in order. The first that divides n is the smallest prime factor; if none does, n is prime.",
    "For the primes up to a limit, write out 2 to the limit and cross out the multiples of each prime whose square is not above the limit, keeping the prime itself.",
    "Count what is left: those are the primes up to the limit."
   ],
   example: {
    prompt: "Find the smallest prime factor of 221, and the number of primes up to 30.",
    steps: [
     "14 × 14 = 196 and 15 × 15 = 225, so only primes up to 14 need testing. 2, 3, 5, 7 and 11 do not divide 221, but 13 does: 221 = 13 × 17.",
     "Cross out the multiples of 2, 3 and 5 from 2 to 30 (7 × 7 = 49 is above 30). Left: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29."
    ],
    answer: "The smallest prime factor of 221 is 13, and there are 10 primes up to 30."
   },
   pitfalls: [
    "Counting 1 as a prime. A prime must be above 1, so the sieve starts at 2.",
    "Crossing out a prime itself, such as 3, while crossing out the multiples of 3.",
    "Testing only 2, 3 and 5. A number such as 289 = 17 × 17 has no small factor at all, so test every prime up to the square root."
   ]
  },
  guidance: [
   { prompt: "What is the largest whole number whose square is not more than 391? Only primes up to it need testing.", answer: [19], labels: ["largest number to test"], explanation: "19 × 19 = 361 and 20 × 20 = 400, which is more than 391. If 391 had two factors both bigger than 19, their product would be too big." },
   { prompt: "Test the primes from 2 up to 19 in order. What is the smallest crate size?", answer: [17], labels: ["smallest crate size"], explanation: "2, 3, 5, 7, 11 and 13 do not divide 391, but 17 does: 391 = 17 × 23. So 391 is composite and the smallest crate size is 17." },
   { prompt: "In the list from 2 to 60, cross out the multiples of 2, 3, 5 and 7 but not those four primes. How many numbers are left?", answer: [17], labels: ["primes left"], explanation: "Every composite number up to 60 has a prime factor no bigger than 7, so it is crossed out. What is left are the primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53 and 59, which is 17 numbers." }
  ]
 },
 {
  id: "q04", title: "Filing by prime factors", topic: "Prime factorisation", tier: "Basic", sector: "Crate Store",
  brief: "The crate store files each delivery under the primes it is made of, so that any packing question can be answered from the file.",
  lesson: "Every whole number above 1 is a product of primes in exactly one way, apart from order; the exponent of a prime counts how often it appears.",
  prompt: "The crate store files every delivery under its prime factorisation. A delivery of 5040 rivets has arrived. Write 5040 = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ and enter the exponents a, b, c and d, in that order. An exponent is 0 when that prime does not divide 5040.",
  answer: [4,2,1,1], labels: ["exponent of 2","exponent of 3","exponent of 5","exponent of 7"], tolerance: 0.01,
  hints: [
   "Divide by the smallest prime for as long as the result stays a whole number, counting the divisions. Then do the same with the next prime, and the next.",
   "Check by multiplying the prime powers back together: you must get the number you started with."
  ],
  solution: "Dividing 5040 by 2 for as long as possible takes 4 divisions and leaves 315. Dividing 315 by 3 takes 2 divisions and leaves 35. Dividing 35 by 5 takes one division and leaves 7, and 7 = 7¹. So 5040 = 2⁴ × 3² × 5 × 7, and the exponents are 4, 2, 1 and 1.",
  xp: 100, prereqs: ["q03"],
  artifact: {"name":"Prime filing cards","description":"One card per delivery, listing the primes it is built from."},
  sources: [source.r23],
  teaching: {
   intuition: "Primes are the building blocks of whole numbers. A composite number splits into two smaller factors, and each factor that is still composite splits again, until only primes are left: 60 = 6 × 10 = 2 × 3 × 2 × 5. The fundamental theorem of arithmetic says that the primes you end with are always the same, whichever way you split, apart from their order. This list is the prime factorisation of the number. We group repeated primes with powers: 2 × 2 is 2², and 2 × 2 × 2 is 2³, so 60 = 2² × 3 × 5. The small raised number is the exponent of a prime: it counts how many times that prime divides the number. A prime that does not divide the number has exponent 0, and any number to the power 0 is 1, so 60 = 2² × 3¹ × 5¹ × 7⁰ as well. To find the exponents, divide by 2 as many times as you can, counting, then by 3, then by 5, and so on.",
   steps: [
    "Divide by 2 for as long as the result is a whole number. The number of divisions is the exponent of 2.",
    "Do the same with 3, then 5, then 7, each time starting from what is left.",
    "When what is left is 1, you are done; any prime you never divided by has exponent 0.",
    "Check by multiplying the prime powers back together."
   ],
   example: {
    prompt: "Write 360 as 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ.",
    steps: [
     "360 → 180 → 90 → 45: three halvings, so a = 3, and 45 is left.",
     "45 → 15 → 5: two divisions by 3, so b = 2. Then 5 ÷ 5 = 1, so c = 1, and 7 never divides, so d = 0."
    ],
    answer: "360 = 2³ × 3² × 5, so the exponents are 3, 2, 1 and 0."
   },
   pitfalls: [
    "Stopping too soon: 8 can be halved three times, not once, so its exponent of 2 is 3.",
    "Leaving a prime out because it appears only once: its exponent is 1, not 0.",
    "Writing a composite number such as 9 or 15 in the factorisation; every factor must be prime."
   ]
  },
  guidance: [
   { prompt: "How many times can 5040 be halved before the result is odd, and what odd number is left?", answer: [4,315], labels: ["exponent of 2","odd part left"], explanation: "Halving 5040 takes 4 divisions before the result is odd: 315 is left, so the exponent of 2 is 4." },
   { prompt: "How many times can 315 be divided by 3, and what is left?", answer: [2,35], labels: ["exponent of 3","part left"], explanation: "Dividing 315 by 3 takes 2 divisions before 3 no longer divides: 35 is left, so the exponent of 3 is 2." },
   { prompt: "What are the exponents of 5 and of 7 in 35?", answer: [1,1], labels: ["exponent of 5","exponent of 7"], explanation: "35 = 5¹ × 7¹ (a power 0 is 1), so the exponents of 5 and 7 are 1 and 1. Altogether 5040 = 2⁴ × 3² × 5 × 7." }
  ]
 },
 {
  id: "q05", title: "Bolts and nuts in step", topic: "gcd and lcm from factorisations", tier: "Basic", sector: "Crate Store",
  brief: "Bolts and nuts arrive in boxes of different sizes, and the store wants one crate size that suits both and one stock level that matches both.",
  lesson: "From the two factorisations, gcd takes each prime to the smaller exponent and lcm takes it to the larger; gcd × lcm = a × b.",
  prompt: "Bolts reach the crate store in boxes of 360 and nuts in boxes of 756. Mira wants the largest crate size that packs a box of bolts, and also a box of nuts, into equal crates with nothing left over. She also wants the smallest stock that is a whole number of bolt boxes and also a whole number of nut boxes. Factorise both numbers, then enter gcd(360, 756) and lcm(360, 756) (type them without commas).",
  answer: [36,7560], labels: ["gcd","lcm"], tolerance: 0.01,
  hints: [
   "For the greatest common divisor, take each prime to the smaller of its two exponents. A prime missing from either number is left out.",
   "For the least common multiple, take each prime to the larger of its two exponents."
  ],
  solution: "360 = 2³ × 3² × 5 and 756 = 2² × 3³ × 7. The smaller exponents give gcd = 2² × 3² = 36, and the larger exponents give lcm = 2³ × 3³ × 5 × 7 = 7560. Check: 36 × 7560 = 272160, which is 360 × 756.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"Matching chart","description":"Two factorisations side by side, with the smaller and larger exponents marked."},
  sources: [source.r24],
  teaching: {
   intuition: "A common divisor of two numbers divides both of them. The greatest common divisor, written gcd(a, b), is the largest one: the biggest crate size that packs both a and b with nothing left over. A common multiple of a and b is a number that both divide; the least common multiple, written lcm(a, b), is the smallest positive one. Prime factorisations make both easy. A divisor of a number can only use the primes of that number, each with an exponent no bigger than the number’s own. So a common divisor can use each prime with at most the smaller of its two exponents, and the gcd uses exactly the smaller one. A common multiple needs each prime at least as often as either number has it, so the lcm uses the larger exponent. For example 12 = 2² × 3 and 18 = 2 × 3²: the gcd is 2 × 3 = 6 and the lcm is 2² × 3² = 36. Since each prime gets its smaller exponent once and its larger exponent once, gcd × lcm = a × b: 6 × 36 = 216 = 12 × 18.",
   steps: [
    "Factorise both numbers, writing the exponent of each prime (0 if the prime is missing).",
    "For the gcd, take each prime to the smaller of its two exponents and multiply.",
    "For the lcm, take each prime to the larger of its two exponents and multiply.",
    "Check: gcd × lcm must equal the product of the two numbers."
   ],
   example: {
    prompt: "Find gcd(12, 18) and lcm(12, 18).",
    steps: [
     "12 = 2² × 3 and 18 = 2 × 3².",
     "Smaller exponents: 2¹ × 3¹ = 6. Larger exponents: 2² × 3² = 36."
    ],
    answer: "gcd(12, 18) = 6 and lcm(12, 18) = 36."
   },
   pitfalls: [
    "Swapping the rules: the gcd takes the smaller exponents, the lcm the larger.",
    "Putting a prime in the gcd that divides only one of the numbers. Its smaller exponent is 0, so it is left out.",
    "Taking the lcm as a × b. That is a common multiple, but it is the least one only when the gcd is 1."
   ]
  },
  guidance: [
   { prompt: "Write 360 = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are the four exponents?", answer: [3,2,1,0], labels: ["exponent of 2 in the first","exponent of 3 in the first","exponent of 5 in the first","exponent of 7 in the first"], explanation: "360 = 2³ × 3² × 5, so the exponents are 3, 2, 1 and 0." },
   { prompt: "Now write 756 the same way. What are its four exponents?", answer: [2,3,0,1], labels: ["exponent of 2 in the second","exponent of 3 in the second","exponent of 5 in the second","exponent of 7 in the second"], explanation: "756 = 2² × 3³ × 7, so the exponents are 2, 3, 0 and 1." },
   { prompt: "Take each prime to the smaller of its two exponents. What is gcd(360, 756)?", answer: [36], labels: ["gcd"], explanation: "The smaller exponents of 2, 3, 5 and 7 are 2, 2, 0, 0, so the gcd is 2² × 3² = 36." },
   { prompt: "Take each prime to the larger of its two exponents. What is lcm(360, 756)?", answer: [7560], labels: ["lcm"], explanation: "The larger exponents are 3, 3, 1, 1, so the lcm is 2³ × 3³ × 5 × 7 = 7560." }
  ]
 },
 {
  id: "q06", title: "Euclid at the loading bay", topic: "Euclid’s algorithm", tier: "Basic", sector: "Crate Store",
  brief: "Two big deliveries are too large to factorise by hand, and the loading bay still needs the crate size that packs both.",
  lesson: "The Euclidean algorithm replaces (a, b) by (b, r), where r is the remainder of a ÷ b, until r is 0; the last remainder that is not 0 is the gcd.",
  prompt: "Two deliveries, of 4389 cans and of 1683 cans, must be packed into crates of one size with nothing left over, and Mira wants the largest such size without factorising. Run Euclid’s algorithm: divide 4389 by 1683, then divide each divisor by the remainder it left, until a remainder is 0. Enter gcd(4389, 1683), then the number of divisions you made, counting the last one, whose remainder is 0.",
  answer: [33,7], labels: ["gcd","divisions"], tolerance: 0.01,
  hints: [
   "Each new division divides the previous divisor by the previous remainder. The remainders keep getting smaller, so the process must stop.",
   "The greatest common divisor is the last remainder that is not zero: the divisor in the final division."
  ],
  solution: "4389 = 2 × 1683 + 1023; 1683 = 1 × 1023 + 660; 1023 = 1 × 660 + 363; 660 = 1 × 363 + 297; 363 = 1 × 297 + 66; 297 = 4 × 66 + 33; 66 = 2 × 33 + 0. The last remainder that is not 0 is 33, so gcd(4389, 1683) = 33, found in 7 divisions.",
  xp: 100, prereqs: ["q05"],
  artifact: {"name":"Euclid’s ladder","description":"A column of divisions, each one shorter than the last, ending at the gcd."},
  sources: [source.r16],
  teaching: {
   intuition: "Factorising large numbers is slow, but there is a faster way to the greatest common divisor, the Euclidean algorithm, also called Euclid’s algorithm after the Greek mathematician who wrote it down. It rests on one fact. If a = qb + r, then every number that divides both a and b also divides r = a − qb, and every number that divides both b and r also divides a. So a and b have exactly the same common divisors as b and r, and gcd(a, b) = gcd(b, r). The remainder r is smaller than b, so the numbers shrink at every division. Keep dividing the last divisor by the last remainder. When a remainder of 0 appears, the divisor in that last division divides everything above it, and it is the gcd. For 84 and 30: 84 = 2 × 30 + 24, 30 = 1 × 24 + 6, 24 = 4 × 6 + 0, so gcd(84, 30) = 6 after three divisions.",
   steps: [
    "Divide the larger number a by the smaller b: a = qb + r.",
    "Replace the pair (a, b) by (b, r) and divide again.",
    "Repeat until a remainder is 0. Count every division, including that last one.",
    "The gcd is the last remainder that is not 0, which is the divisor of the final division."
   ],
   example: {
    prompt: "Find gcd(84, 30) with Euclid’s algorithm, and count the divisions.",
    steps: [
     "84 = 2 × 30 + 24, then 30 = 1 × 24 + 6.",
     "24 = 4 × 6 + 0: the remainder is 0, so stop."
    ],
    answer: "gcd(84, 30) = 6, found in 3 divisions."
   },
   pitfalls: [
    "Dividing by the original b every time. Each division uses the previous remainder as its new divisor.",
    "Taking the final remainder, 0, as the gcd. The gcd is the last remainder before the 0.",
    "Forgetting to count the last division, the one that leaves 0."
   ]
  },
  guidance: [
   { prompt: "First division: 4389 = q × 1683 + r. What are q and r?", answer: [2,1023], labels: ["first quotient","first remainder"], explanation: "2 × 1683 = 3366, and 4389 − 3366 = 1023, so 4389 = 2 × 1683 + 1023." },
   { prompt: "Second division: 1683 = q × 1023 + r. What are q and r?", answer: [1,660], labels: ["second quotient","second remainder"], explanation: "1 × 1023 = 1023, and 1683 − 1023 = 660. Every number that divides both 4389 and 1683 also divides 1023 and 660, so the gcd has not changed." },
   { prompt: "Keep going until a remainder is 0. What is the gcd, and how many divisions did you make in all?", answer: [33,7], labels: ["gcd","divisions"], explanation: "4389 = 2 × 1683 + 1023; 1683 = 1 × 1023 + 660; 1023 = 1 × 660 + 363; 660 = 1 × 363 + 297; 363 = 1 × 297 + 66; 297 = 4 × 66 + 33; 66 = 2 × 33 + 0. The last remainder that is not 0 is 33, and there were 7 divisions." }
  ]
 },
 {
  id: "q07", title: "Two cans, one exact amount", topic: "Bézout coefficients", tier: "Basic", sector: "Fuel Depot",
  brief: "The fuel depot has only two measuring cans, and Mira needs a recipe of fills and scoops that leaves the smallest possible exact amount.",
  lesson: "Working back up Euclid’s algorithm writes gcd(a, b) = ax + by; adding b ÷ gcd to x and taking a ÷ gcd from y gives every other pair.",
  prompt: "The fuel depot has only two measuring cans, holding 84 litres and 33 litres. Mira can pour full 84-litre cans into a tank and scoop full 33-litre cans back out, and the smallest positive amount she can leave in the tank this way is gcd(84, 33) litres. Find whole numbers x and y with 84x + 33y = gcd(84, 33), taking x as the smallest positive choice; y comes out negative, the cans scooped out. Enter the gcd, then x, then y.",
  answer: [3,2,-5], labels: ["gcd","x","y"], tolerance: 0.01,
  hints: [
   "Run Euclid’s algorithm, then work back up from the last line: write the gcd using the last two remainders, and replace each remainder by the division that made it.",
   "From one solution you get another by adding b ÷ gcd to x and taking a ÷ gcd from y. Use this to bring x down to the smallest positive value."
  ],
  solution: "Euclid’s algorithm: 84 = 2 × 33 + 18; 33 = 1 × 18 + 15; 18 = 1 × 15 + 3; 15 = 5 × 3 + 0, so the gcd is 3. Working back up the lines gives 3 = 84 × 2 + 33 × (−5). This x is already the smallest positive choice. So x = 2 and y = −5. Check: 84 × 2 − 33 × 5 = 168 − 165 = 3.",
  xp: 100, prereqs: ["q06"],
  artifact: {"name":"Fill-and-scoop recipe","description":"How many cans to pour in and how many to scoop out for one exact amount."},
  sources: [source.r16],
  teaching: {
   intuition: "With a 5-litre can and a 3-litre can you can measure 1 litre exactly: pour in two 5-litre cans (10 litres) and scoop out three 3-litre cans (9 litres). In symbols, 5 × 2 + 3 × (−3) = 1, where a negative count means scooping out. In general, any amount you can make is ax + by for whole numbers x and y, and every such amount is a multiple of gcd(a, b), since the gcd divides both a and b. The surprise is that the gcd itself can always be made: there are whole numbers x and y with ax + by = gcd(a, b). They are called Bézout coefficients, after the French mathematician Étienne Bézout. To find them, run Euclid’s algorithm, then work back up its lines. The second-to-last line gives the gcd in terms of the two numbers just above it; replace the smaller of those by the line that made it, and keep going until only a and b are left. The pair is not unique. Adding b ÷ gcd to x and taking a ÷ gcd from y leaves ax + by unchanged, because a × (b ÷ gcd) = b × (a ÷ gcd). That lets you choose the smallest positive x.",
   steps: [
    "Run Euclid’s algorithm on a and b and note each line r = (dividend) − q × (divisor).",
    "Start from the line whose remainder is the gcd, and write the gcd as a combination of that line’s two numbers.",
    "Replace the smaller number by its own line, collect terms, and repeat until the gcd is written as ax + by.",
    "Shift by adding or taking away b ÷ gcd from x (and a ÷ gcd from y the other way) until x is the smallest positive choice."
   ],
   example: {
    prompt: "Find x and y with 17x + 5y = 1, x the smallest positive choice.",
    steps: [
     "Euclid: 17 = 3 × 5 + 2, then 5 = 2 × 2 + 1, then 2 = 2 × 1 + 0, so the gcd is 1.",
     "Back up: 1 = 5 − 2 × 2 = 5 − 2 × (17 − 3 × 5) = 7 × 5 − 2 × 17, so x = −2 and y = 7.",
     "x is negative, so add 5 to x and take 17 from y: x = 3, y = −10. Check: 51 − 50 = 1."
    ],
    answer: "x = 3 and y = −10."
   },
   pitfalls: [
    "Shifting x and y by the same amount. x moves by b ÷ gcd and y by a ÷ gcd, in opposite directions.",
    "Losing a minus sign while substituting back up the lines. Check the final pair by working out ax + by.",
    "Stopping at the first pair found. Working back can give a negative x; shift it to the smallest positive one."
   ]
  },
  guidance: [
   { prompt: "Run Euclid’s algorithm on 84 and 33. What is their gcd?", answer: [3], labels: ["gcd"], explanation: "84 = 2 × 33 + 18; 33 = 1 × 18 + 15; 18 = 1 × 15 + 3; 15 = 5 × 3 + 0. The last remainder that is not 0 is 3." },
   { prompt: "If 84x + 33y = 3, by how much can x go up, and y go down, so that the total stays 3? Use the smallest whole steps.", answer: [11,28], labels: ["step for x","step for y"], explanation: "84 × 11 = 33 × 28 = 924, so adding 11 to x adds 924 and taking 28 from y removes the same amount. These are 33 ÷ 3 and 84 ÷ 3." },
   { prompt: "Work back up Euclid’s lines to get one solution, then shift it. What are the smallest positive x and its y?", answer: [2,-5], labels: ["x","y"], explanation: "Working back gives 3 = 84 × 2 + 33 × (−5). This x is already the smallest positive choice. So x = 2 and y = −5." }
  ]
 },
 {
  id: "q08", title: "Filling the tank exactly", topic: "Linear Diophantine equations", tier: "Basic", sector: "Fuel Depot",
  brief: "A tank must take an exact amount of fuel from full cans only, and Mira wants every way to do it.",
  lesson: "ax + by = c has whole-number solutions (negative ones allowed) exactly when gcd(a, b) divides c; from one solution (x, y) the rest are (x + (b ÷ g)t, y − (a ÷ g)t). Whether any has x and y both positive is a separate check.",
  prompt: "A tank at the fuel depot needs exactly 200 litres, and the only cans hold 7 litres and 11 litres. Mira pours in x full 7-litre cans and y full 11-litre cans, using at least one of each, so 7x + 11y = 200 with x and y positive whole numbers. Enter how many such pairs (x, y) there are, then the smallest x among them.",
  answer: [3,5], labels: ["pairs","smallest x"], tolerance: 0.01,
  hints: [
   "There are whole-number solutions only when gcd(a, b) divides c. Once you have one solution, every other one comes from adding b ÷ gcd to x and taking a ÷ gcd from y.",
   "Start from the smallest positive x that works, then keep shifting until y would drop below one. Count the pairs on the way."
  ],
  solution: "gcd(7, 11) = 1, which divides 200, so there are whole-number solutions; whether any are positive is checked next. The smallest positive x that leaves a multiple of 11 is x = 5: 200 − 7 × 5 = 165 = 11 × 15, so y = 15. Every solution is x = 5 + 11t, y = 15 − 7t for a whole number t. y stays positive for t = 0 to 2, which gives the pairs (5, 15), (16, 8) and (27, 1): 3 pairs, and the smallest x is 5.",
  xp: 100, prereqs: ["q07"],
  artifact: {"name":"Tank filling table","description":"Every way to fill one tank exactly from two sizes of full can."},
  sources: [source.r25],
  teaching: {
   intuition: "An equation whose answers must be whole numbers is called a Diophantine equation, after Diophantus of Alexandria. The simplest kind is ax + by = c: how many full a-litre cans and full b-litre cans make exactly c litres? The left side is always a multiple of g = gcd(a, b), so there is no solution unless g divides c. When it does, there are infinitely many whole-number solutions, and the last mission shows how they line up: from one solution (x, y), every other is x + (b ÷ g)t and y − (a ÷ g)t for a whole number t. Here the cans are real, so x and y must both be at least 1, and that leaves only a few, sometimes none: with 12-litre and 20-litre cans, 4 litres passes the gcd test, but even one can is too much. So the gcd test tells you whether whole-number solutions exist; whether a positive pair exists you find by listing. To list them, find the smallest positive x for which c − ax is a positive multiple of b, which gives y, then keep adding b ÷ g to x and taking a ÷ g from y while y stays at least 1. You can find that first x with the Bézout coefficients times c ÷ g, or by trying x = 1, 2, 3 and so on; you never need to try more than b ÷ g values.",
   steps: [
    "Find g = gcd(a, b). If g does not divide c, there are no solutions.",
    "Find the smallest positive x that makes c − ax a positive multiple of b, and the matching y = (c − ax) ÷ b.",
    "Every other solution adds b ÷ g to x and takes a ÷ g from y.",
    "Keep the pairs with y at least 1 and count them."
   ],
   example: {
    prompt: "How many pairs of positive whole numbers solve 3x + 5y = 31, and what is the smallest x?",
    steps: [
     "gcd(3, 5) = 1, which divides 31. x = 1 leaves 28 and is not a multiple of 5; x = 2 leaves 25 = 5 × 5, so (2, 5).",
     "Add 5 to x and take 3 from y: (7, 2). Once more gives y = −1, which is not allowed."
    ],
    answer: "2 pairs, (2, 5) and (7, 2); the smallest x is 2."
   },
   pitfalls: [
    "Shifting x by 1 at a time. Between two solutions x moves by b ÷ gcd, not by 1.",
    "Counting pairs with x or y equal to 0. Here at least one can of each size is used.",
    "Looking for solutions when the gcd does not divide c. Then there are none."
   ]
  },
  guidance: [
   { prompt: "What is gcd(7, 11)? It must divide 200 for any solution to exist.", answer: [1], labels: ["gcd"], explanation: "gcd(7, 11) = 1, and 1 divides every whole number, so whole-number solutions exist, though not always positive ones." },
   { prompt: "What is the smallest positive x for which 200 − 7x is a positive multiple of 11, and what is y then?", answer: [5,15], labels: ["smallest x","its y"], explanation: "200 − 7 × 5 = 165 = 11 × 15, and no smaller positive x leaves a multiple of 11." },
   { prompt: "Each further solution adds 11 to x and takes 7 from y. How many pairs keep y at least 1, counting the first?", answer: [3], labels: ["pairs"], explanation: "The pairs are (5, 15), (16, 8) and (27, 1). One more shift would make y −6, which is not positive." }
  ]
 },
 {
  id: "q09", title: "Every way to crate the tins", topic: "Counting divisors τ(n)", tier: "Basic", sector: "Fuel Depot",
  brief: "A load of fuel tins can be crated in many equal-sized ways, and the depot wants to know how many crate sizes there are without listing them.",
  lesson: "If n = p^a × q^b × …, then τ(n), the number of divisors of n, is (a + 1)(b + 1)….",
  prompt: "The crate store has 720 identical tins, and every divisor of 720 is a possible crate size, from crates of 1 tin up to one crate of all 720. Enter τ(720), the number of divisors of 720. A second delivery has 11³ × 13 tins, written as its prime factorisation: enter its number of divisors too.",
  answer: [30,8], labels: ["number of divisors of the first","number of divisors of the second"], tolerance: 0.01,
  hints: [
   "A divisor picks an exponent for each prime, anywhere from zero up to that prime’s exponent in the number. So a prime with exponent e gives one more than e choices.",
   "Multiply the numbers of choices for all the primes together."
  ],
  solution: "720 = 2⁴ × 3² × 5, so τ(720) = (4 + 1) × (2 + 1) × (1 + 1) = 5 × 3 × 2 = 30. For 11³ × 13, the number of divisors is (3 + 1) × (1 + 1) = 4 × 2 = 8.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"Divisor counter","description":"A rule card that counts crate sizes from a factorisation."},
  sources: [source.r42],
  teaching: {
   intuition: "A divisor of n can only be built from the primes of n, each with an exponent no bigger than its exponent in n. Take 12 = 2² × 3. A divisor of 12 chooses an exponent of 2 from 0, 1 or 2, and an exponent of 3 from 0 or 1. That is 3 choices times 2 choices, so 6 divisors: 1, 2, 4, 3, 6 and 12. By the uniqueness of prime factorisation, different choices always give different divisors. In general, if n = p^a × q^b × r^c for different primes p, q and r, then the number of divisors of n is (a + 1)(b + 1)(c + 1): one more than each exponent, multiplied together. This count is written τ(n), with the Greek letter tau. It counts 1 and n themselves.",
   steps: [
    "Write the prime factorisation of n with its exponents.",
    "Add 1 to each exponent: that is the number of choices for that prime.",
    "Multiply the numbers of choices together. The product is τ(n).",
    "A prime that does not divide n has exponent 0 and gives 1 choice, so it changes nothing."
   ],
   example: {
    prompt: "How many divisors does 12 have?",
    steps: [
     "12 = 2² × 3, so the exponents are 2 and 1.",
     "(2 + 1) × (1 + 1) = 3 × 2 = 6. The divisors are 1, 2, 3, 4, 6 and 12."
    ],
    answer: "τ(12) = 6."
   },
   pitfalls: [
    "Multiplying the exponents themselves: 2 × 1 = 2 is wrong for 12. Add 1 to each first.",
    "Adding the choices instead of multiplying them.",
    "Leaving out 1 or n itself when listing divisors to check; both count."
   ]
  },
  guidance: [
   { prompt: "Write 720 = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are a, b, c and d?", answer: [4,2,1,0], labels: ["exponent of 2","exponent of 3","exponent of 5","exponent of 7"], explanation: "720 = 2⁴ × 3² × 5, so the exponents are 4, 2, 1 and 0." },
   { prompt: "Add 1 to each exponent that is not 0 and multiply. What is τ(720)?", answer: [30], labels: ["number of divisors of the first"], explanation: "τ(720) = (4 + 1) × (2 + 1) × (1 + 1) = 5 × 3 × 2 = 30. Each divisor is one way of choosing the exponents." },
   { prompt: "Do the same for 11³ × 13. How many divisors does it have?", answer: [8], labels: ["number of divisors of the second"], explanation: "The exponents are 3 and 1, so there are 4 × 2 = 8 divisors." }
  ]
 },
 {
  id: "q10", title: "The can rack total", topic: "Adding divisors σ(n); multiplicative functions", tier: "Basic", sector: "Fuel Depot",
  brief: "The fuel depot keeps a rack with one can of every size that divides the tank, and the log needs the rack’s total without adding every can by hand.",
  lesson: "σ(n), the sum of divisors of n, is multiplicative: σ(mn) = σ(m)σ(n) when m and n share no prime factor, and σ(p^a) = 1 + p + … + p^a.",
  prompt: "The fuel depot keeps one can of every size that divides 72, in litres. Enter σ(72), the sum of divisors of 72: the litres all those cans hold together. Then the depot log says σ(8) = 15 and σ(25) = 31, and 8 and 25 have no prime factor in common. Enter σ(200). Type both without commas.",
  answer: [195,465], labels: ["σ of the can sizes","σ of the product"], tolerance: 0.01,
  hints: [
   "For a prime power, σ is the sum of all the powers of the prime from the zeroth up to that one.",
   "σ is multiplicative: when two numbers share no prime factor, σ of their product is the product of their σ values."
  ],
  solution: "72 = 2³ × 3². σ(2³) = 1 + 2 + 4 + 8 = 15 and σ(3²) = 1 + 3 + 9 = 13. The two prime powers share no prime factor, so σ(72) = 15 × 13 = 195. 8 and 25 share no prime factor either, so σ(200) = σ(8) × σ(25) = 15 × 31 = 465.",
  xp: 100, prereqs: ["q09"],
  artifact: {"name":"Can rack ledger","description":"The total of a full rack of cans, worked out prime by prime."},
  sources: [source.r41, source.r42],
  teaching: {
   intuition: "The sum of divisors of n, written σ(n) with the Greek letter sigma, adds up all its divisors, including 1 and n. For 12 it is 1 + 2 + 3 + 4 + 6 + 12 = 28. For a prime power the divisors are just the powers: σ(2³) = 1 + 2 + 4 + 8 = 15. For other numbers there is a shortcut. Two numbers that share no prime factor have gcd 1. A function f of whole numbers is called a multiplicative function when f(mn) = f(m) × f(n) every time m and n share no prime factor. The number of divisors τ from the last mission is one, and so is σ. The reason: when m and n share no prime, every divisor of mn is exactly one divisor of m times one divisor of n, so multiplying out (sum of divisors of m) × (sum of divisors of n) lists every divisor of mn once. For 12 = 4 × 3: σ(4) × σ(3) = 7 × 4 = 28. So split n into prime powers, add the powers of each prime, and multiply the sums.",
   steps: [
    "Factorise n into powers of different primes.",
    "For each prime power p^a, add 1 + p + p² + … + p^a.",
    "Multiply those sums together: that is σ(n).",
    "More generally, when m and n share no prime factor, σ(mn) = σ(m) × σ(n). Check that they share none first."
   ],
   example: {
    prompt: "Find σ(12). Then, given σ(4) = 7 and σ(9) = 13, find σ(36).",
    steps: [
     "12 = 2² × 3: σ(2²) = 1 + 2 + 4 = 7 and σ(3) = 1 + 3 = 4, so σ(12) = 7 × 4 = 28.",
     "4 and 9 share no prime factor, so σ(36) = 7 × 13 = 91."
    ],
    answer: "σ(12) = 28 and σ(36) = 91."
   },
   pitfalls: [
    "Using σ(mn) = σ(m) × σ(n) when m and n share a prime: σ(2) × σ(2) = 9, but σ(4) = 7.",
    "Leaving out 1 or the number itself from a sum of divisors.",
    "Adding the prime-power sums instead of multiplying them."
   ]
  },
  guidance: [
   { prompt: "What is σ(2³), the sum 1 + 2 + 4 + 8?", answer: [15], labels: ["σ of the first prime power"], explanation: "The divisors of 2³ are its powers 1, 2, 4, 8, which add up to 15." },
   { prompt: "What is σ(3²)?", answer: [13], labels: ["σ of the second prime power"], explanation: "1 + 3 + 9 = 13." },
   { prompt: "72 = 2³ × 3², and the two share no prime factor. What is σ(72)?", answer: [195], labels: ["σ of the can sizes"], explanation: "Each divisor of 72 is a divisor of 2³ times a divisor of 3², so the sum of them all is 15 × 13 = 195." },
   { prompt: "What is σ(200) = σ(8 × 25)?", answer: [465], labels: ["σ of the product"], explanation: "8 and 25 share no prime factor, so σ(200) = 15 × 31 = 465." }
  ]
 }
);
})();
