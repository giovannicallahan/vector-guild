# Number theory pack (`number`) — concept plan

Pack id `number`, name "Number theory: the hidden life of whole numbers", 40 learn + 120 practice = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "number"); files split by letter a–d and practice files 1–8 exactly as `docs/CALC1-PLAN.md`.

**Player:** an adult who has finished Foundations and Discrete mathematics (sets, logic, counting with factorials, induction, sequences, first remainders). Divides, remainder, prime and gcd are recapped in one sentence where first used, since the Discrete plan is still being written.
New words and symbols, each taught in the mission that first uses it: divisor, multiple, a | b, quotient, remainder, division algorithm, base b, digit, prime, composite, sieve, prime factorisation, exponent of a prime, gcd, lcm, Euclidean algorithm, Bézout coefficients, Diophantine equation, τ(n), σ(n), multiplicative function, congruent ≡, mod, least residue, casting out nines, modular inverse, linear congruence, Chinese remainder theorem, repeated squaring, Fermat's little theorem, φ(n), coprime, Euler's theorem, Wilson's theorem, square-free, Möbius μ(n), perfect number, Mersenne prime, order of a mod n, primitive root, index (discrete logarithm), quadratic residue, Legendre symbol (a/p), Euler's criterion, quadratic reciprocity, sum of two squares, pseudoprime, continued fraction [a₀; a₁, …], partial quotient, convergent, public key, RSA, encryption and decryption exponents.

**Setting:** the outpost's Signal Office and its neighbours: crates in the store, fuel cans at the depot, shuttle timetables on the station clock, the long Kepler calendar and the cipher room where Mira locks the outpost's messages.

**Sources:** Raji, *Elementary Number Theory*, on LibreTexts, with Barrus and Clark, *Elementary Number Theory*, on LibreTexts for divisibility tests, repeated squaring, primality tests, RSA and sums of squares. URL patterns `R` = `https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section>` and `BC` = `https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Barrus_and_Clark)/01%3A_Chapters/1.<MM>%3A_<Section>`. A source title reads `Raji, Elementary Number Theory (LibreTexts) — 3.4 The Chinese Remainder Theorem`; publisher word **Elementary Number Theory** (both books). Every URL below was opened on 2026-11-27; none is UNVERIFIED. Raji 2.6 was also opened: it does not give the exponent of p in n!, so that idea was dropped. No open section on Pell's equation was found, so q37 uses Raji 6.4 instead.

| Concepts | Section title | URL |
|---|---|---|
| q01 | Raji 1.3 Divisibility and the Division Algorithm | R/01%3A_Introduction/1.03%3A_Divisibility_and_the_Division_Algorithm |
| q02 | Raji 1.4 Representations of Integers in Different Bases | R/01%3A_Introduction/1.04%3A_Representations_of_Integers_in_Different_Bases |
| q06, q07 | Raji 1.6 The Euclidean Algorithm | R/01%3A_Introduction/1.06%3A_The_Euclidean_Algorithm |
| q03 | Raji 2.1 The Sieve of Eratosthenes | R/02%3A_Prime_Numbers/2.01%3A_The_Sieve_of_Eratosthenes |
| q04 | Raji 2.3 The Fundamental Theorem of Arithmetic | R/02%3A_Prime_Numbers/2.03%3A_The_Fundamental_Theorem_of_Arithmetic |
| q05, q11, q40 | Raji 2.4 Least Common Multiple | R/02%3A_Prime_Numbers/2.04%3A_Least_Common_Multiple |
| q08, q11 | Raji 2.5 Linear Diophantine Equations | R/02%3A_Prime_Numbers/2.05%3A_Linear_Diophantine_Equations |
| q12, q13, q17 | Raji 3.1 Introduction to Congruences | R/03%3A_Congruences/3.01%3A_Introduction_to_Congruences |
| q21 | Raji 3.2 Residue Systems and Euler's φ-Function | R/03%3A_Congruences/3.02%3A_Residue_Systems_and_Eulers_-Function |
| q15, q16, q17 | Raji 3.3 Linear Congruences | R/03%3A_Congruences/3.03%3A_Linear_Congruences |
| q18, q23 | Raji 3.4 The Chinese Remainder Theorem | R/03%3A_Congruences/3.04%3A_The_Chinese_Remainder_Theorem |
| q20, q22, q23, q24, q40 | Raji 3.5 Theorems of Fermat, Euler, and Wilson | R/03%3A_Congruences/3.05%3A_Theorems_of_Fermat_Euler_and_Wilson |
| q10 | Raji 4.1 Definitions and Properties | R/04%3A_Multiplicative_Number_Theoretic_Functions/4.01%3A_Definitions_and_Properties |
| q09, q10, q21 | Raji 4.2 Multiplicative Number Theoretic Functions | R/04%3A_Multiplicative_Number_Theoretic_Functions/4.02%3A_Multiplicative_Number_Theoretic_Functions |
| q25 | Raji 4.3 The Mobius Function and the Mobius Inversion Formula | R/04%3A_Multiplicative_Number_Theoretic_Functions/4.03%3A_The_Mobius_Function_and_the_Mobius_Inversion_Formula |
| q26 | Raji 4.4 Perfect, Mersenne, and Fermat Numbers | R/04%3A_Multiplicative_Number_Theoretic_Functions/4.04%3A_Perfect_Mersenne_and_Fermat_Numbers |
| q27, q28, q29 | Raji 5.1 The order of Integers and Primitive Roots | R/05%3A_Primitive_Roots_and_Quadratic_Residues/5.01%3A_The_order_of_Integers_and_Primitive_Roots |
| q28 | Raji 5.2 Primitive Roots for Primes | R/05%3A_Primitive_Roots_and_Quadratic_Residues/5.02%3A_Primitive_Roots_for_Primes |
| q30 | Raji 5.4 Introduction to Quadratic Residues and Nonresidues | R/05%3A_Primitive_Roots_and_Quadratic_Residues/5.04%3A_Introduction_to_Quadratic_Residues_and_Nonresidues |
| q31 | Raji 5.5 Legendre Symbol | R/05%3A_Primitive_Roots_and_Quadratic_Residues/5.05%3A_Legendre_Symbol |
| q32 | Raji 5.6 The Law of Quadratic Reciprocity | R/05%3A_Primitive_Roots_and_Quadratic_Residues/5.06%3A_The_Law_of_Quadratic_Reciprocity |
| q35 | Raji 6.1 Basic Notations | R/06%3A_Introduction_to_Continued_Fractions/6.01%3A_Basic_Notations |
| q36 | Raji 6.2 Main Technical Tool | R/06%3A_Introduction_to_Continued_Fractions/6.02%3A_Main_Technical_Tool |
| q37 | Raji 6.4 An Application | R/06%3A_Introduction_to_Continued_Fractions/6.04%3A_An_Application |
| q38, q39 | Raji 8.1 Cryptography | R/08%3A_Other_Topics_in_Number_Theory/8.01%3A_Cryptography |
| q14 | BC 1.18 Divisibility Tests for 2, 3, 5, 9, 11 | BC/1.18%3A_Divisibility_Tests_for_2_3_5_9_11 |
| q34 | BC 1.25 Primality Tests | BC/1.25%3A_Primality_Tests |
| q19 | BC 1.26 Computation of aⁿ mod m | BC/1.26%3A_Computation_of_a_mod_m |
| q38, q39 | BC 1.27 The RSA Scheme | BC/1.27%3A_The_RSA_Scheme |
| q33 | BC 1.28 Sum of Squares | BC/1.28%3A_Sum_of_Squares |

| Ch | Name | Ids | Tier, XP | Sector | "we have to …" | Landmark | Blurb |
|---|---|---|---|---|---|---|---|
| 1 | Divisors and primes | q01–q06 | Basic, 100 | Crate Store | pack every delivery into equal crates with nothing left over | Crate stack | Remainders, bases, primes, factorisation, gcd, lcm and Euclid's algorithm. |
| 2 | Combining whole numbers | q07–q11 | Basic, 100 | Fuel Depot | measure out exact amounts with only the cans we have | Measuring cans | Bézout's coefficients, whole-number equations and counting and adding divisors. |
| 3 | Congruences | q12–q17 | Intermediate, 150 | Timetable Office | run every timetable on its own repeating cycle | Station clock | Working mod n, divisibility tests, inverses and linear congruences. |
| 4 | Powers and remainders | q18–q23 | Intermediate, 150 | Signal Office | send huge numbers through a small channel | Repeater mast | The Chinese remainder theorem, fast powers, Fermat, φ and Euler. |
| 5 | Special numbers and orders | q24–q29 | Intermediate, 150 | Calendar Hall | line up cycles of every length on the Kepler year | Calendar wheel | Wilson's theorem, Möbius, perfect numbers, orders and primitive roots. |
| 6 | Squares and primes | q30–q34 | Advanced, 200 | Survey Field | lay out plots whose sides are whole numbers | Square plots | Quadratic residues, the Legendre symbol, reciprocity, sums of squares and testing primes. |
| 7 | Fractions and secret codes | q35–q40 | Advanced, 200 | Cipher Room | send messages only the outpost can read | Key tower | Continued fractions, best approximations and RSA. |

## Concepts (one learn mission each; R = Raji, BC = Barrus and Clark; "after" = prerequisites)

1. q01 Quotient and remainder [R1.3] — after none — Asked: q and r with a = qb + r and 0 ≤ r < b, a sometimes negative; varies a, b.
2. q02 Writing numbers in other bases [R1.4] — after q01 — Asked: the base-ten value of a base-b numeral and the digits of n in base b (fixed number of boxes); varies b 2–9, n.
3. q03 Primes and the sieve [R2.1] — after q01 — Asked: the smallest prime factor of n (trial division up to √n) and the count of primes up to N ≤ 100; varies n, N.
4. q04 Prime factorisation [R2.3] — after q03 — Asked: the exponents of 2, 3, 5 and 7 in n; varies n ≤ 10000 built from small primes.
5. q05 gcd and lcm from factorisations [R2.4] — after q04 — Asked: gcd(a, b) and lcm(a, b); varies a, b.
6. q06 Euclid's algorithm [R1.6] — after q05 — Asked: gcd(a, b) and the number of division steps; varies a, b ≤ 5000.
7. q07 Bézout coefficients [R1.6] — after q06 — Asked: x and y with ax + by = gcd(a, b), x the smallest positive choice; varies a, b.
8. q08 Linear Diophantine equations [R2.5] — after q07 — Asked: the number of solutions in positive whole numbers of ax + by = c and the smallest x; varies a, b, c.
9. q09 Counting divisors τ(n) [R4.2] — after q04 — Asked: τ(n) = product of (exponent + 1); varies n.
10. q10 Adding divisors σ(n); multiplicative functions [R4.1, R4.2] — after q09 — Asked: σ(n) from its prime powers, and σ(mn) from σ(m), σ(n) for coprime m, n; varies.
11. q11 Chapter review: depot measures [R2.4, R2.5] — after q08, q10 — Asked: a gcd, a solution count and a divisor count; varies all.
12. q12 Congruences and least residues [R3.1] — after q01 — Asked: the least residue of a mod n (a large or negative), and 1 or 0 for a ≡ b (mod n); varies.
13. q13 Arithmetic mod n [R3.1] — after q12 — Asked: the remainder of a sum or product of large numbers mod n, reducing first; varies.
14. q14 Divisibility tests for 3, 9 and 11 [BC1.18] — after q13 — Asked: n mod 9 from the digit sum and n mod 11 from the alternating digit sum; varies a 6–9 digit n.
15. q15 Modular inverses [R3.3] — after q07, q12 — Asked: the inverse of a mod n in 1 … n − 1; varies coprime a, n.
16. q16 Linear congruences [R3.3] — after q15 — Asked: the number of solutions mod n of ax ≡ b (gcd rule) and the smallest one; varies a, b, n.
17. q17 Chapter review: calendar arithmetic [R3.1, R3.3] — after q14, q16 — Asked: the weekday index 0–6 after N days and an inverse; varies N, start day.
18. q18 Chinese remainder theorem [R3.4] — after q16 — Asked: the smallest positive x with x ≡ a (mod m), x ≡ b (mod n), sometimes a third condition; varies coprime moduli.
19. q19 Fast powers by repeated squaring [BC1.26] — after q13 — Asked: aᵏ mod n for k up to 500, and the number of squarings; varies.
20. q20 Fermat's little theorem [R3.5] — after q19 — Asked: aᵏ mod p for k up to 1000000 (reduce k mod p − 1); varies prime p ≤ 97.
21. q21 Euler's φ-function [R3.2, R4.2] — after q04 — Asked: φ(n) from the factorisation; varies n ≤ 1000.
22. q22 Euler's theorem: last two digits [R3.5] — after q20, q21 — Asked: aᵏ mod 100 with gcd(a, 100) = 1, then the tens digit; varies a, k.
23. q23 Chapter review: signal checks [R3.4, R3.5] — after q18, q22 — Asked: a CRT value and a large power; varies all.
24. q24 Wilson's theorem [R3.5] — after q20 — Asked: (p − 1)! mod p, (p − 2)! mod p and (p − 3)! mod p; varies prime p ≤ 101.
25. q25 The Möbius function [R4.3] — after q04 — Asked: μ(n) typed −1, 0 or 1, and the sum of μ(d) over the divisors of n; varies n.
26. q26 Perfect numbers and Mersenne primes [R4.4] — after q10 — Asked: σ(n) − 2n (0 for perfect) and the perfect number 2^(p−1)(2^p − 1) for p = 2, 3, 5, 7 (answer said "without commas"); varies.
27. q27 The order of a mod n [R5.1] — after q19, q21, q22 — Asked: the smallest k with aᵏ ≡ 1 (mod n); varies n ≤ 50, a.
28. q28 Primitive roots [R5.1, R5.2] — after q27 — Asked: 1 or 0 for "g is a primitive root mod p" and the number of primitive roots φ(p − 1); varies prime p ≤ 61, g.
29. q29 Chapter review: the index of a number [R5.1] — after q28 — Asked: k with gᵏ ≡ b (mod p) for a primitive root g, p ≤ 23; varies p, b.
30. q30 Quadratic residues [R5.4] — after q13 — Asked: the number of solutions of x² ≡ a (mod p) and the smallest one; varies prime p, a.
31. q31 Legendre symbol and Euler's criterion [R5.5] — after q30, q20 — Asked: a^((p−1)/2) mod p and (a/p) typed 1 or −1; varies.
32. q32 Quadratic reciprocity [R5.6] — after q31 — Asked: (p/q) typed 1 or −1 for odd primes up to 100, flipping and reducing; varies p, q.
33. q33 Sums of two squares [BC1.28] — after q30, q04 — Asked: 1 or 0 for "n is a sum of two squares" and the number of ways a² + b² = n with 0 ≤ a ≤ b; varies n ≤ 500.
34. q34 Fermat test and pseudoprimes [BC1.25] — after q20 — Asked: 2^(n−1) mod n and 1 or 0 for "n passes" (341 and 561 pass yet are composite); varies n ≤ 600.
35. q35 Continued fractions of a fraction [R6.1] — after q06 — Asked: the partial quotients a₀, a₁, a₂, a₃ of p ÷ q (drawn with exactly four); varies p, q.
36. q36 Convergents [R6.2] — after q35 — Asked: the numerator and denominator of the third convergent; varies the continued fraction.
37. q37 Recovering a fraction from a decimal [R6.4] — after q36 — Asked: numerator and denominator (under 100, lowest terms) of a fraction shown to six decimal places; varies.
38. q38 RSA: encrypting [BC1.27, R8.1] — after q19, q21 — Asked: c = mᵉ mod n for n = pq < 1000; varies p, q, e, m.
39. q39 RSA: the decryption key [BC1.27, R8.1] — after q38, q15 — Asked: φ(n), d = e⁻¹ mod φ(n) and the message m = cᵈ mod n; varies.
40. q40 Realm review and bridge to Graph theory [R2.4, R3.5] — after q39, q05 — Asked: the number of dividing pairs a < b ≤ N (links in the divisor network, the sum of ⌊N ÷ a⌋ − 1) and one gcd; varies N ≤ 60.

Prerequisites go into each mission's `prereqs` (q01 has `[]`).

## Answers
Numbers only. Residues are typed as least residues 0 … n − 1; a Legendre or Möbius value as −1, 0 or 1; a yes-or-no property as 1 or 0. A factorisation is asked as its exponents in fixed boxes, a continued fraction as its partial quotients in fixed boxes, a fraction as numerator and denominator in two boxes "in lowest terms". Generators draw primes from fixed lists and build composites from them, so every answer stays checkable by hand; any answer of 1000 or more says "without commas".

## Ranks, achievements, copy
Ranks: CRATE COUNTER, DEPOT KEEPER, TIMEKEEPER, SIGNAL CLERK, CALENDAR MAKER, PLOT SURVEYOR, CODE WRITER, CIPHER CHIEF, MASTER OF NUMBERS.
Achievements: "Nothing left over" (`number-done`, all 40 concepts); "Unbreakable key" (`number-master`, all 160).
Home title: "Whole numbers keep secrets.<br><em>Learn to read them.</em>"
First visit (Mira): "Welcome to the Signal Office. Every crate count, timetable and coded message here rests on how whole numbers divide. We start by packing one delivery into equal crates."
First button: "Pack the first delivery". All done: "The outpost's codes are now yours to make and to break. Graph theory opens next in the Map Room, where numbers become networks."

**Must-have glossary terms:** divisor, prime, prime factorisation, greatest common divisor, Euclidean algorithm, congruence, modular inverse, Chinese remainder theorem, Euler's phi function, primitive root, quadratic residue, continued fraction, public key.
