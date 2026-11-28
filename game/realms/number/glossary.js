/* Number theory: the hidden life of whole numbers glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['number'] = {
 required: ['divisor', 'prime', 'prime factorisation', 'greatest common divisor', 'Euclidean algorithm', 'congruence', 'modular inverse', 'Chinese remainder theorem', 'Euler\'s phi function', 'primitive root', 'quadratic residue', 'continued fraction', 'public key'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['divisor', 'q01', 'A whole number b divides a, and is a divisor of a, when a ÷ b leaves remainder 0; we write b | a.', '5 is a divisor of 20, since 20 = 5 × 4.'],
  ['multiple', 'q01', 'A multiple of b is b times some whole number, so b divides it.', '20 and −15 are multiples of 5.'],
  ['quotient', 'q01', 'In a = bq + r with 0 ≤ r < b, the quotient q is how many whole times b fits into a.', '17 = 5 × 3 + 2 has quotient 3.'],
  ['remainder', 'q01', 'In a = bq + r with 0 ≤ r < b, the remainder r is what is left over; it is never negative and always less than b.', '−17 = 5 × (−4) + 3 has remainder 3.'],
  ['division algorithm', 'q01', 'The fact that for any whole number a and any b above 0 there is exactly one pair q, r with a = bq + r and 0 ≤ r < b.', '53 = 7 × 7 + 4.'],
  ['digit', 'q02', 'One of the symbols 0 to b − 1 that fill the places of a numeral in base b.', '(213)₄ has the digits 2, 1 and 3.'],
  ['prime', 'q03', 'A whole number above 1 whose only divisors are 1 and itself.', '2, 3, 5, 7, 11 and 13 are prime.'],
  ['composite', 'q03', 'A whole number above 1 that is not prime: a product of two smaller whole numbers above 1.', '15 = 3 × 5 is composite.'],
  ['sieve of Eratosthenes', 'q03', 'A way to list the primes up to a limit by crossing out the multiples of each small prime, but not the prime itself.', 'Up to 30, cross out the multiples of 2, 3 and 5.', ['sieve']],
  ['prime factorisation', 'q04', 'A whole number above 1 written as a product of primes; apart from order, there is only one.', '360 = 2³ × 3² × 5.'],
  ['exponent of a prime', 'q04', 'How many times a prime divides a number: the power of that prime in its prime factorisation.', 'In 360 = 2³ × 3² × 5 the exponent of 2 is 3.'],
  ['greatest common divisor', 'q05', 'The largest whole number that divides both of two numbers, written gcd(a, b).', 'gcd(12, 18) = 6.', ['gcd']],
  ['least common multiple', 'q05', 'The smallest positive number that both of two numbers divide, written lcm(a, b).', 'lcm(12, 18) = 36.', ['lcm']],
  ['Euclidean algorithm', 'q06', 'A way to find gcd(a, b) by dividing, then dividing each divisor by its remainder, until a remainder is 0.', '84 = 2 × 30 + 24, 30 = 1 × 24 + 6, 24 = 4 × 6 + 0, so the gcd is 6.', ['Euclid’s algorithm', 'Euclid\'s algorithm']],
  ['Bézout coefficients', 'q07', 'Whole numbers x and y with ax + by = gcd(a, b), found by working back up the Euclidean algorithm.', '17 × 3 + 5 × (−10) = 1.', ['Bezout coefficients']],
  ['Diophantine equation', 'q08', 'An equation whose solutions must be whole numbers, such as ax + by = c.', '3x + 5y = 31 has the positive solutions (2, 5) and (7, 2).'],
  ['number of divisors', 'q09', 'τ(n), the count of the divisors of n including 1 and n: one more than each prime’s exponent, multiplied together.', 'τ(12) = (2 + 1) × (1 + 1) = 6.'],
  ['sum of divisors', 'q10', 'σ(n), all the divisors of n added up, including 1 and n.', 'σ(12) = 1 + 2 + 3 + 4 + 6 + 12 = 28.'],
  ['multiplicative function', 'q10', 'A function f of whole numbers with f(mn) = f(m) × f(n) whenever m and n share no prime factor.', 'σ(36) = σ(4) × σ(9) = 7 × 13 = 91.'],
  /* q11–q20 (missions-b.js) */
  ['congruence', 'q12', 'A statement a ≡ b (mod n), read “a is congruent to b modulo n”, which says that n divides a − b.', '38 ≡ 101 (mod 9), since 101 − 38 = 63 = 7 × 9.', ['congruent', '≡']],
  ['modulus', 'q12', 'The number n in a ≡ b (mod n): the length of the loop that whole numbers are counted round.', 'In 17 ≡ 2 (mod 5) the modulus is 5.', ['moduli']],
  ['least residue', 'q12', 'The one number from 0 to n − 1 that a is congruent to mod n: the remainder when a is divided by n.', 'The least residue of −41 mod 9 is 4, since −41 = −5 × 9 + 4.'],
  ['digit sum', 'q14', 'All the digits of a number added up; it leaves the same remainder as the number on division by 3 and by 9.', '75284 has digit sum 7 + 5 + 2 + 8 + 4 = 26.'],
  ['alternating digit sum', 'q14', 'The units digit, minus the tens digit, plus the hundreds digit, and so on; it is ≡ the number mod 11.', 'For 75284: 4 − 8 + 2 − 5 + 7 = 0, so 11 divides 75284.'],
  ['casting out nines', 'q14', 'Checking arithmetic by replacing each number with its digit sum mod 9, since every power of 10 is ≡ 1 (mod 9).', '4831 has digit sum 16, and 16 ≡ 7, so 4831 ≡ 7 (mod 9).'],
  ['modular inverse', 'q15', 'A number k with ak ≡ 1 (mod n); it exists exactly when gcd(a, n) = 1.', 'The modular inverse of 5 mod 17 is 7, since 5 × 7 = 35 = 2 × 17 + 1.'],
  ['linear congruence', 'q16', 'A congruence ax ≡ b (mod n) to solve for x; it has gcd(a, n) solutions from 0 to n − 1 if that gcd divides b, and none otherwise.', '6x ≡ 4 (mod 10) has the 2 solutions 4 and 9.'],
  ['Chinese remainder theorem', 'q18', 'The fact that when no two moduli share a factor above 1, remainders for each modulus fix one number below their product.', 'x ≡ 1 (mod 3), x ≡ 2 (mod 4), x ≡ 3 (mod 5) gives x = 58 below 60.'],
  ['repeated squaring', 'q19', 'Finding a power mod n by squaring and reducing again and again, then multiplying the squares the exponent needs.', '5¹¹ = 5⁸ × 5² × 5, and mod 13 that is 1 × 12 × 5 ≡ 8.'],
  ['Fermat’s little theorem', 'q20', 'The fact that a to the power p − 1 is ≡ 1 (mod p) when p is prime and does not divide a.', '3⁶ = 729 = 104 × 7 + 1, so 3⁶ ≡ 1 (mod 7).', ['Fermat\'s little theorem']],
  /* q21–q30 (missions-c.js) */
  ['Euler\'s phi function', 'q21', 'φ(n): how many of the whole numbers from 1 to n share no prime factor with n.', 'φ(10) = 4: the numbers 1, 3, 7 and 9.', ['Euler’s phi function', 'Euler’s φ-function']],
  ['coprime', 'q21', 'Sharing no prime factor: two whole numbers are coprime when their only common divisor is 1.', '8 and 15 are coprime; 8 and 6 are not, as both are even.'],
  ['Euler’s theorem', 'q22', 'When a and n are coprime, a raised to the power φ(n) leaves remainder 1 on division by n.', 'φ(100) = 40, so 3⁴⁰ leaves remainder 1 on division by 100.', ['Euler\'s theorem']],
  ['Wilson’s theorem', 'q24', 'For a prime p, the product 1 × 2 × … × (p − 1) leaves remainder p − 1, that is −1, on division by p.', '6! = 720 leaves remainder 6 on division by 7.', ['Wilson\'s theorem']],
  ['square-free', 'q25', 'Having no prime that appears twice or more in its prime factorisation.', '30 = 2 × 3 × 5 is square-free; 12 = 2² × 3 is not.'],
  ['Möbius function', 'q25', 'μ(n): 0 when n is not square-free, otherwise 1 or −1 as n has an even or an odd number of distinct primes.', 'μ(6) = 1, μ(30) = −1 and μ(12) = 0.', ['Mobius function']],
  ['perfect number', 'q26', 'A whole number whose divisors other than itself add up to the number itself, so that σ(n) = 2n.', '28 = 1 + 2 + 4 + 7 + 14.'],
  ['Mersenne prime', 'q26', 'A prime of the form 2ᵖ − 1, one less than a power of 2.', '2⁵ − 1 = 31 is a Mersenne prime; 2¹¹ − 1 = 2047 = 23 × 89 is not.'],
  ['order', 'q27', 'The order of a mod n is the smallest power k, at least 1, for which aᵏ leaves remainder 1 on division by n.', 'The powers of 2 mod 7 are 2, 4, 1, so 2 has order 3.', [], '\\border\\b(?! of [a-z0-9]+ mod)'],
  ['primitive root', 'q28', 'A number whose powers run through every remainder coprime to n before they return to 1; its order is φ(n).', '3 is a primitive root mod 7: its powers are 3, 2, 6, 4, 5, 1.'],
  ['index', 'q29', 'For a primitive root g mod p, the index of b is the exponent k from 1 to p − 1 with gᵏ ≡ b (mod p).', '3³ ≡ 6 (mod 7), so the index of 6 (base 3) is 3.', ['discrete logarithm']],
  ['quadratic residue', 'q30', 'A number a coprime to n for which x² ≡ a (mod n) has a solution: a remainder that is a square.', '5 is a quadratic residue mod 11, since 4² = 16 ≡ 5.'],
  ['quadratic nonresidue', 'q30', 'A number a coprime to n for which x² ≡ a (mod n) has no solution.', '3 is a quadratic nonresidue mod 7: the squares mod 7 are 1, 2 and 4.'],
  /* q31–q40 (missions-d.js) */
  ['Legendre symbol', 'q31', 'For an odd prime p that does not divide a, (a/p) is 1 when a is a quadratic residue mod p and −1 when it is not.', '(2/7) = 1, because 3² = 9 leaves remainder 2 mod 7.'],
  ['Euler’s criterion', 'q31', 'The rule that a to the power (p − 1) ÷ 2 leaves remainder 1 mod an odd prime p when a is a quadratic residue, and p − 1 when it is not.', '3³ = 27 ≡ 6 (mod 7), so 3 is not a square mod 7.', ['Euler\'s criterion']],
  ['quadratic reciprocity', 'q32', 'For two different odd primes p and q, (p/q) = (q/p), except that (p/q) = −(q/p) when both leave remainder 3 on division by 4.', '(3/43) = −(43/3) = −(1/3) = −1.'],
  ['sum of two squares', 'q33', 'A whole number that can be written as a² + b² with whole numbers a and b.', '65 = 1² + 8² = 4² + 7² is a sum of two squares in two ways.', ['sums of two squares']],
  ['Fermat test', 'q34', 'A quick check for primes: if 2ⁿ⁻¹ mod n is not 1, n is composite; if it is 1, n is probably prime.', '2¹⁴ ≡ 4 (mod 15), so 15 fails and is composite.'],
  ['pseudoprime', 'q34', 'A composite number n that still passes the Fermat test: 2ⁿ⁻¹ leaves remainder 1 on division by n.', '341 = 11 × 31 is a pseudoprime to base 2.'],
  ['continued fraction', 'q35', 'A number written as a whole number plus 1 over (a whole number plus 1 over …), recorded as [a₀; a₁, a₂, …].', '30/13 = 2 + 1 ÷ (3 + 1 ÷ 4) = [2; 3, 4].'],
  ['partial quotient', 'q35', 'One of the whole numbers a₀, a₁, a₂, … of a continued fraction; for a fraction they are the quotients of Euclid’s algorithm.', 'The partial quotients of 30/13 are 2, 3 and 4.'],
  ['convergent', 'q36', 'The fraction you get by cutting a continued fraction off after one of its partial quotients.', 'The convergents of [1; 2, 3] are 1, 3/2 and 10/7.'],
  ['public key', 'q38', 'The numbers of a code that anyone may know and use to lock a message; in RSA, the modulus n and the encryption exponent e.', 'Mira’s public key is n = 33 with e = 3.'],
  ['RSA', 'q38', 'A public-key code: a message m is locked as c = mᵉ mod n, and only someone who knows the two primes of n can unlock it.', 'With n = 33 and e = 3, the message 4 is locked as 64 mod 33 = 31.'],
  ['ciphertext', 'q38', 'The locked form of a message: the number that is actually sent.', 'In RSA with n = 33 and e = 3, the ciphertext of 4 is 31.'],
  ['encryption exponent', 'q38', 'The power e to which an RSA message is raised mod n to lock it; it shares no factor with φ(n).', 'With e = 3 and n = 33, the message 4 is locked as 4³ mod 33 = 31.'],
  ['decryption exponent', 'q39', 'The power d that unlocks an RSA ciphertext: the inverse of the encryption exponent mod φ(n).', 'For n = 55 and e = 7, d = 23, since 7 × 23 = 161 = 4 × 40 + 1.'],
  ['private key', 'q39', 'The part of a code that its owner keeps secret to unlock messages; in RSA, the decryption exponent d with n.', 'For n = 55 and e = 7 the private key is d = 23.'],
  ['divisor network', 'q40', 'A picture with one dot for each number from 1 to N and a link from a to b whenever a < b and a divides b.', 'The divisor network on 1 to 6 has 8 links.'],
 ]
};
})();
