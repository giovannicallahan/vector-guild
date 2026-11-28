/* Abstract algebra: patterns of moves glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['abstract'] = {
 required: ['modular arithmetic', 'identity element', 'inverse', 'group', 'abelian', 'order', 'cyclic group', 'permutation', 'subgroup', 'coset', 'homomorphism', 'kernel', 'orbit', 'field'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['modular arithmetic', 'q01', 'Arithmetic in which numbers wrap round after a fixed modulus, so that only the remainder on division by it counts.', 'In modular arithmetic mod 12, 9 + 8 is 5.'],
  ['clock arithmetic', 'q01', 'Another name for modular arithmetic, because a clock face forgets whole turns.', 'On a clock face of 12 hours, 3 − 7 lands on 8.'],
  ['remainder', 'q01', 'What is left when you take away as many whole copies of the divisor as you can; it is from 0 to one less than the divisor.', '64 = 3 × 17 + 13, so the remainder is 13.'],
  ['modulus', 'q01', 'The number n that modular arithmetic wraps round at: the number of positions on the dial.', 'In 17 mod 12 the modulus is 12.'],
  ['mod', 'q01', 'Written between two numbers, a mod n means the remainder of a on division by n, from 0 to n − 1.', '17 mod 12 = 5 and −4 mod 12 = 8.'],
  ['Z_n', 'q01', 'The numbers 0, 1, …, n − 1 with adding mod n: the positions of a dial with n positions.', 'Z_5 is 0, 1, 2, 3, 4, and 3 + 4 is 2 in Z_5.'],
  ['least residue', 'q02', 'The remainder from 0 to n − 1 that a whole number leaves mod n: the usual way to write an element of Z_n.', 'The least residue of 27 mod 19 is 8.'],
  ['binary operation', 'q03', 'A rule that combines any two elements of a set, taken in order, into one element of the same set.', 'x ∗ y = (x + y + 2) mod 5 on the numbers 0 to 4.'],
  ['operation table', 'q03', 'A grid with a row and a column for each element, whose entry in row x and column y is x ∗ y.', 'In the table of (x + y + 2) mod 5, row 3, column 4 holds 4.', ['Cayley table']],
  ['identity element', 'q04', 'An element e that changes nothing under the operation: e ∗ x = x and x ∗ e = x for every x.', '0 for adding mod n, and 1 for multiplying mod n.', ['identity']],
  ['inverse', 'q04', 'The inverse of a is the element b that undoes it: a ∗ b and b ∗ a are both the identity element.', 'In Z_12 the inverse of 5 is 7, since 5 + 7 leaves 0.'],
  ['closed', 'q05', 'A set is closed under an operation when combining any two of its elements always gives an element of the same set.', '1 to 5 under × mod 6 is not closed: 2 × 3 leaves 0.', ['closure']],
  ['associative', 'q05', 'An operation is associative when (x ∗ y) ∗ z = x ∗ (y ∗ z) for all x, y and z, so a chain can be grouped either way.', '(2 + 3) + 4 = 2 + (3 + 4).'],
  ['group', 'q05', 'A set with a binary operation that is closed and associative, has an identity element, and gives every element an inverse.', 'Z_n under adding mod n is a group.'],
  ['abelian', 'q05', 'A group is abelian when its operation does not depend on the order of the two inputs: x ∗ y = y ∗ x always.', 'Z_n is abelian, because a + b = b + a.'],
  ['gcd', 'q06', 'The greatest common divisor of two whole numbers: the largest whole number that divides both of them.', 'gcd(8, 20) = 4.', ['greatest common divisor']],
  ['Euclid’s algorithm', 'q06', 'A way to find a gcd: divide, keep the remainder, and repeat with the smaller number and the remainder until it is 0.', '20 = 2 × 8 + 4 and 8 = 2 × 4 + 0, so gcd(20, 8) = 4.', ["Euclid's algorithm", 'Euclidean algorithm']],
  ['coprime', 'q06', 'Two whole numbers are coprime when their gcd is 1: they share no factor bigger than 1.', '9 and 20 are coprime; 8 and 20 are not.'],
  ['unit', 'q06', 'A unit mod n is a number from 1 to n − 1 that has an inverse when multiplying mod n: one coprime to n.', '7 is a unit mod 20, since 7 × 3 = 21 leaves 1.', [], '\\bunit (?:of|circle|vector|price|cost)'],
  ['group of units', 'q06', 'U(n): the numbers from 1 to n − 1 coprime to n, with multiplying mod n as the operation.', 'U(9) = {1, 2, 4, 5, 7, 8}.'],
  ['order of a group', 'q06', 'The number of elements of a group G, written |G|.', '|U(9)| = 6 and |Z_12| = 12.'],
  ['order', 'q07', 'The order of an element is the smallest number of repeats, at least 1, of the element that gives the identity element.', 'In Z_12 the order of 8 is 3: 8, 4, 0.', [], '\\bin order\\b|\\border of (?:the )?(?:inputs|two)'],
  ['power', 'q08', 'In a group, aᵏ is a combined with itself k times; for multiplying mod n, a multiplied by itself k times mod n.', 'In U(7), 2³ is 8 mod 7, which is 1.'],
  ['cyclic group', 'q09', 'A group in which the repeats of one element reach every element of the group.', 'Z_8 is cyclic, since the multiples of 1 reach every element.'],
  ['generator', 'q09', 'An element g of a group whose repeats ⟨g⟩ reach every element of the group.', '3 is a generator of Z_8; 2 is not.'],
  ['repeated squaring', 'q10', 'A way to work out a large power mod n by squaring again and again to get a², a⁴, a⁸, … and multiplying the ones needed.', '2¹³ = 2⁸ × 2⁴ × 2¹.'],
  /* q11–q20 (missions-b.js) */
  ['permutation', 'q12', 'A rearrangement of a finite set: a rule that sends each element to an element of the same set, never two to the same place.', '1 → 2, 2 → 3, 3 → 1 is a permutation of {1, 2, 3}.'],
  ['composition', 'q12', 'Doing one permutation or function after another; σ ∘ τ means τ first, then σ, so (σ ∘ τ)(i) = σ(τ(i)).', 'If τ(1) = 2 and σ(2) = 5, then (σ ∘ τ)(1) = 5.'],
  ['cycle notation', 'q13', 'Writing a permutation as its cycles side by side, each in brackets in the order its symbols are visited.', '1 → 3, 2 → 2, 3 → 1 is written (1 3)(2).'],
  ['cycle', 'q13', 'A loop of symbols that a permutation sends round in turn, written (a b c) for a → b, b → c and c → a.', '(1 4 7) sends 1 to 4, 4 to 7 and 7 back to 1.'],
  ['fixed point', 'q13', 'A symbol that a permutation leaves where it is; in cycle notation it is a cycle of length 1.', 'In (1 2)(3), the symbol 3 is a fixed point.'],
  ['lcm', 'q13', 'The least common multiple: the smallest positive whole number that each of the given whole numbers divides exactly.', 'lcm(4, 6) = 12.', ['least common multiple']],
  ['transposition', 'q14', 'A permutation that swaps two symbols and leaves every other symbol where it is.', '(2 5) swaps 2 and 5 and fixes the rest.'],
  ['even permutation', 'q14', 'A permutation that can be written as an even number of transpositions; its sign is 1.', '(1 2 3) = (1 3)(1 2) is even.'],
  ['odd permutation', 'q14', 'A permutation that can be written as an odd number of transpositions; its sign is −1.', 'A single transposition such as (1 2) is odd.'],
  ['factorial', 'q15', 'n factorial, written n!, is the product n × (n − 1) × … × 2 × 1 of the whole numbers from n down to 1.', '4! = 4 × 3 × 2 × 1 = 24.'],
  ['symmetric group', 'q15', 'The group Sₙ of all the permutations of n symbols under composition; it has n! elements.', 'S₃ has 3! = 6 elements.'],
  ['alternating group', 'q15', 'The group Aₙ of the even permutations of n symbols; for n ≥ 2 it has n! ÷ 2 elements.', 'A₄ has 24 ÷ 2 = 12 elements.'],
  ['dihedral group', 'q16', 'The group Dₙ of the 2n symmetries of a regular polygon with n corners: n turns and n flips.', 'D₆, for a regular hexagon, has 12 symmetries.'],
  ['subgroup', 'q18', 'A subset of a group that is a group by itself under the same operation.', '{0, 3, 6, 9} is a subgroup of Z₁₂ under adding mod 12.'],
  ['divisor', 'q18', 'A whole number that divides another whole number exactly, leaving no remainder.', 'The divisors of 12 are 1, 2, 3, 4, 6 and 12.'],
  ['coset', 'q19', 'The set a + H made by combining one element a of a group with every element of a subgroup H.', 'In Z₁₂ with H = {0, 4, 8}, the coset 1 + H is {1, 5, 9}.'],
  ['index', 'q20', 'The number of cosets of a subgroup H in a group G, written [G : H]; for a finite group it is |G| ÷ |H|.', 'A subgroup of 6 elements in a group of 24 has index 4.'],
  ['Lagrange’s theorem', 'q20', 'In a finite group, the number of elements of every subgroup divides the number of elements of the group.', 'A group of 15 elements has no subgroup of 4 elements.'],
  /* q21–q30 (missions-c.js) */
  ['Euler’s theorem', 'q21', 'When a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n, where φ(n) counts the numbers below n coprime to n.', 'φ(10) = 4, and 3⁴ = 81 leaves 1 on division by 10.'],
  ['Fermat’s little theorem', 'q21', 'For a prime p and a not a multiple of p, a to the power p − 1 leaves remainder 1 on division by p.', '2⁶ = 64 leaves 1 on division by 7.'],
  ['conjugate', 'q22', 'The conjugate of h by g is g h g⁻¹: the move h done on elements renamed by g.', 'Conjugating a swap of slots 1 and 2 by a renaming gives another swap.', ['conjugates']],
  ['normal subgroup', 'q22', 'A subgroup H with g h g⁻¹ in H for every g in the group and every h in H, so that gH = Hg.', 'Every subgroup of Z₁₂ is normal, because adding does not depend on order.'],
  ['homomorphism', 'q24', 'A map between groups that keeps the operation: the image of a combination is the combination of the images.', 'x ↦ 3x mod 9 from Z₆ to Z₉, since 3 × 6 is a multiple of 9.'],
  ['well defined', 'q24', 'A rule is well defined when every name of the same element gives the same output.', 'On Z₄, x and x + 4 are the same reading, so x ↦ 2x mod 8 must treat them alike.'],
  ['kernel', 'q25', 'The set of elements a homomorphism sends to the identity of the target group.', 'x ↦ 8x mod 12 on Z₁₂ has kernel {0, 3, 6, 9}.'],
  ['image', 'q25', 'The set of all outputs a map actually reaches.', 'x ↦ 8x mod 12 on Z₁₂ has image {0, 4, 8}.'],
  ['isomorphism', 'q26', 'A homomorphism that pairs the elements of two groups off one to one, so they have the same pattern under different names.', 'Z₂ × Z₃ ≅ Z₆, by matching k(1, 1) with k.', ['isomorphic']],
  ['direct product', 'q26', 'The group of pairs (x, y), with x from one group and y from another, combined part by part.', 'In Z₂ × Z₃, (1, 2) + (1, 2) = (0, 1).'],
  ['quotient group', 'q28', 'The group whose elements are the cosets of a normal subgroup H, added by adding one representative from each.', 'With H = ⟨6⟩ in Z₁₈, the quotient Z₁₈/H has the 6 cosets 0 + H to 5 + H.'],
  ['first isomorphism theorem', 'q29', 'For a homomorphism from G, G divided by the kernel is isomorphic to the image, so the image has |G| ÷ |kernel| elements.', 'x ↦ 2x mod 8 on Z₁₂ has a kernel of 3, so its image has 12 ÷ 3 = 4 elements.'],
  ['group action', 'q30', 'A group acts on a set when each element moves each member of the set, the identity moves nothing, and moves combine as in the group.', 'The 6 turns of a ring of 6 tiles act on its colourings.'],
  ['orbit', 'q30', 'The orbit of a member of a set acted on by a group is everything the group’s moves can take it to.', 'R B R B R B has an orbit of 2 colourings under the turns of its ring.'],
  /* q31–q40 (missions-d.js) */
  ['stabiliser', 'q31', 'The stabiliser of a member of a set acted on by a group is the subgroup of moves that leave that member exactly where it is.', 'In the 8 moves of a square, a corner’s stabiliser is the do-nothing move and one flip.', ['stabilizer']],
  ['orbit–stabiliser theorem', 'q31', 'For a group G acting on a set, the size of an orbit times the size of the stabiliser of any member of it equals |G|.', 'A cube’s 24 turns send a face to 6 places, so 24 ÷ 6 = 4 turns keep it in place.', ['orbit-stabiliser theorem']],
  ['conjugacy class', 'q32', 'All the conjugates g h g⁻¹ of one element h of a group; in Sₙ it is every permutation with the same cycle lengths.', 'In S₃ the three swaps (1 2), (1 3) and (2 3) form one conjugacy class.', ['conjugacy classes']],
  ['cycle type', 'q32', 'The list of the lengths of the cycles of a permutation, each fixed symbol counted as a cycle of length 1.', '(1 2 3)(4 5) in S₆ has cycle type 3, 2, 1.'],
  ['Burnside’s theorem', 'q33', 'The number of orbits of a group acting on a set is the average, over all its moves, of the number of members each move leaves unchanged.', 'A ring of 4 black or white tiles: (16 + 2 + 4 + 2) ÷ 4 = 6 designs.', ['Burnside’s counting theorem']],
  ['partition', 'q34', 'A partition of a whole number is a way to write it as a sum of positive whole numbers, the order of the parts not mattering.', '3 has three partitions: 3, 2 + 1 and 1 + 1 + 1.'],
  ['fundamental theorem of finite abelian groups', 'q34', 'Every finite abelian group is a direct product of cyclic groups whose orders are powers of primes.', 'An abelian group of order 8 is Z₈, Z₄ × Z₂ or Z₂ × Z₂ × Z₂.'],
  ['ring', 'q35', 'A set with an addition that makes an abelian group and a multiplication that is associative and spreads over the addition.', 'Z₆, the numbers 0 to 5 added and multiplied mod 6, is a ring.', [], '^(?!.*(ring Z|ring R|a ring is|is a ring|ring in which|ring has|ring can)).*$'],
  ['zero divisor', 'q35', 'A non-zero element a of a ring for which a × b = 0 for some non-zero element b.', 'In Z₆, 2 × 3 = 0, so 2 and 3 are zero divisors.'],
  ['field', 'q36', 'A ring in which multiplication is commutative, there is a 1, and every non-zero element has an inverse, so you can divide by anything but 0.', 'Z₇ is a field: 3 × 5 = 15 is 1 mod 7, so 3 and 5 are inverses.', [], 'field (engineer|guide)'],
  ['polynomial ring', 'q37', 'The ring of all polynomials whose coefficients come from a given ring, such as Zₚ[x], added and multiplied as usual.', 'In Z₅[x], (x + 3) + (x + 4) = 2x + 2.'],
  ['root', 'q37', 'A root of a polynomial f is a value r with f(r) = 0.', 'x² + 1 has the roots 2 and 3 in Z₅, since 4 + 1 and 9 + 1 are both 0 mod 5.', [], '(square|cube) root'],
  ['factor theorem', 'q37', 'Dividing a polynomial f(x) by x − a leaves the remainder f(a), so x − a is a factor exactly when f(a) = 0.', 'x² + 1 at x = 3 is 10, which is 0 mod 5, so x − 3 divides it in Z₅[x].'],
  ['ideal', 'q38', 'A set of elements of a ring that adding, subtracting and multiplying by any element of the ring never leave.', 'The multiples of 6 form an ideal of the integers.', ['ideals']],
  ['irreducible', 'q39', 'A polynomial is irreducible over a field when it is not a product of two polynomials of lower degree over that field.', 'x² + 1 is irreducible over Z₃, because it has no root there.'],
  ['monic', 'q39', 'A polynomial is monic when the coefficient of its highest power of x is 1.', 'x² + 3x + 2 is monic; 2x² + 1 is not.'],
  ['finite field', 'q40', 'A field with finitely many elements; it always has pᵏ of them for some prime p.', 'Z₇ is a finite field with 7 elements.'],
  ['Galois field', 'q40', 'GF(pᵏ), the field with exactly pᵏ elements, which exists for every prime power and is unique up to isomorphism.', 'GF(2³) has 8 elements and a cyclic multiplication group of order 7.', ['GF']],
 ]
};
})();
