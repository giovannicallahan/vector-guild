/* Discrete mathematics glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['disc'] = {
 required: ['set', 'element', 'cardinality', 'subset', 'union', 'intersection', 'function', 'one-to-one', 'onto', 'permutation', 'combination', 'factorial', 'recurrence relation', 'graph'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['set', 'q01', 'A collection of things taken as one whole, in which each thing is counted once.', 'The set {2, 5, 9} has three elements.', [], 'set (?:up|off|out|aside|down)\\b|sets (?:up|off|out)\\b'],
  ['element', 'q01', 'One of the things in a set; x ∈ A says that x is an element of A.', '5 is an element of {2, 5, 9}.'],
  ['∈', 'q01', 'The symbol for “is an element of”: x ∈ A means that x is one of the things in A.', '7 ∈ {3, 7, 8}, but 4 is not in it.'],
  ['cardinality', 'q01', 'The number of elements of a finite set A, written |A| with two upright bars.', '|{4, 9, 11}| = 3.'],
  ['empty set', 'q02', 'The set with no elements, written ∅ or { }; its cardinality is 0 and it is a subset of every set.', 'The even numbers in {1, 3, 5} form the empty set.', ['∅']],
  ['subset', 'q02', 'A set whose elements are all in another set; A ⊆ B says that A is a subset of B.', '{2, 9} ⊆ {2, 5, 9}, but {2, 4} is not a subset of it.', ['⊆']],
  ['union', 'q03', 'The set of everything in A, in B or in both, written A ∪ B; a shared element is in it once.', '{1, 2} ∪ {2, 3} = {1, 2, 3}.'],
  ['intersection', 'q03', 'The set of the elements that are in both A and B, written A ∩ B.', '{1, 2, 5} ∩ {2, 5, 7} = {2, 5}.', [], 'roads?|streets?|traffic|junctions?'],
  ['disjoint', 'q03', 'Having no element in common: A and B are disjoint when A ∩ B = ∅.', '{1, 3} and {2, 4} are disjoint.'],
  ['universal set', 'q04', 'The whole collection a problem is about, written U; every set in the problem is a subset of it.', 'If U is all 60 crates, the fragile crates form a subset of U.'],
  ['complement', 'q04', 'Everything in the universal set U that is not in A, written Aᶜ, so that |Aᶜ| = |U| − |A|.', 'With U = {1, 2, 3, 4} and A = {1, 3}, Aᶜ = {2, 4}.'],
  ['set difference', 'q04', 'The elements of A that are not in B, written A \\ B and read “A minus B”.', '{1, 2, 3, 4} \\ {2, 4, 6} = {1, 3}.'],
  ['Venn diagram', 'q04', 'A picture of sets as overlapping circles inside a rectangle that stands for the universal set.', 'Two overlapping circles make four regions: A only, B only, both and neither.'],
  ['ordered pair', 'q06', 'Two entries in a fixed order, written (a, b), so that (a, b) and (b, a) differ unless a = b.', '(3, 5) and (5, 3) are different ordered pairs.'],
  ['Cartesian product', 'q06', 'The set A × B of all ordered pairs (a, b) with a in A and b in B, so that |A × B| = |A| × |B|.', '{1, 2} × {7, 8} = {(1, 7), (1, 8), (2, 7), (2, 8)}.'],
  ['function', 'q07', 'A rule that gives every element of one set exactly one element of another, written f: A → B.', 'f: {1, 2} → {5, 6} with 1 → 6 and 2 → 6 is a function.'],
  ['domain', 'q07', 'The set of inputs of a function; for f: A → B it is A.', 'f: {1, 2, 3} → {0, 1} has the domain {1, 2, 3}.'],
  ['codomain', 'q07', 'The set that the outputs of a function are allowed to land in; for f: A → B it is B.', 'f: {1, 2} → {5, 6, 7} has the codomain {5, 6, 7}.'],
  ['image', 'q07', 'The output that a function gives to one input: the image of x under f is f(x).', 'If f sends 3 to 8, the image of 3 is 8.'],
  ['range', 'q07', 'The set of images that a function actually gives; it is a subset of the codomain.', 'For 1 → 5 and 2 → 5, the range is {5}.', [], '\\ba (?:wide |whole )?range of\\b|out of range|range from'],
  ['one-to-one', 'q08', 'Said of a function that never gives two different inputs the same image; also called injective.', '1 → 4, 2 → 7, 3 → 5 is one-to-one; 1 → 4, 2 → 4 is not.', ['injective']],
  ['onto', 'q08', 'Said of a function f: A → B when every element of B is the image of at least one input; also called surjective.', '1 → 5, 2 → 6, 3 → 5 is onto {5, 6}.', ['surjective'], '(?:load|loads|loaded|loading|put|puts|lift|lifted|stack|stacked|step|stepped|climb|climbed|pour|poured|tip|tipped|slid|slide) onto'],
  ['bijection', 'q08', 'A function that is both one-to-one and onto, so that it pairs off the elements of two sets exactly.', '1 → 6, 2 → 4, 3 → 5 is a bijection from {1, 2, 3} to {4, 5, 6}.'],
  ['additive principle', 'q09', 'If two groups of choices share nothing, the number of ways to choose from one or the other is their sum.', '4 spanners or 6 drivers: 4 + 6 = 10 ways to pick one tool.'],
  ['multiplicative principle', 'q10', 'If a choice is made in stages, the numbers of ways at the stages multiply.', 'One letter from 3, then one digit from 10: 3 × 10 = 30 codes.'],
  /* q11–q20 (missions-b.js) */
  ['factorial', 'q12', 'The product of a whole number and every whole number below it down to 1, written with an exclamation mark after the number.', '4! = 4 × 3 × 2 × 1 = 24.'],
  ['permutation', 'q12', 'An arrangement of objects in an order; n different objects have n! permutations.', 'The permutations of A, B and C include ABC, BCA and CAB.'],
  ['partial permutation', 'q13', 'An ordered choice of k objects from n different ones, counted by P(n, k) = n! ÷ (n − k)!.', 'A driver and a loader from 5 crew: P(5, 2) = 5 × 4 = 20 ways.'],
  ['combination', 'q14', 'A choice of k objects from n in which order does not matter, counted by C(n, k) = n! ÷ (k! × (n − k)!).', 'Teams of 2 from 4 crew: C(4, 2) = 6 combinations.'],
  ['n choose k', 'q14', 'The usual way to read C(n, k), the number of ways to choose k objects from n when order does not matter.', '“5 choose 2” is C(5, 2) = 10.'],
  ['bit string', 'q15', 'A row of digits in which every digit is 0 or 1; an n-bit string has n digits.', '01101 is a bit string of five digits, three of them ones.'],
  ['binomial coefficient', 'q15', 'Another name for C(n, k), because these numbers are the coefficients when a bracket such as (x + y)ⁿ is multiplied out.', 'C(4, 2) = 6 is the binomial coefficient of x²y² in (x + y)⁴.'],
  ['Pascal’s triangle', 'q15', 'A triangle of numbers whose row n lists C(n, 0) to C(n, n); each entry inside it is the sum of the two entries above.', 'Row 4 of Pascal’s triangle is 1 4 6 4 1.', ['Pascal\'s triangle']],
  ['binomial theorem', 'q16', 'The rule that the coefficient of xᵏyⁿ⁻ᵏ in (x + y)ⁿ is the binomial coefficient C(n, k).', '(x + y)³ = x³ + 3x²y + 3xy² + y³.'],
  ['complement counting', 'q18', 'Counting the cases you want by counting all cases and taking away the cases you do not want.', 'Crews with an engineer = all crews − crews with no engineer.'],
  ['stars and bars', 'q19', 'A way to count the ways to share identical objects among groups: the objects are stars, and bars cut the row into groups.', '★★|★|★★ shares 5 crates as 2, 1 and 2.'],
  ['inclusion–exclusion', 'q20', 'Counting a union by adding the sizes of the sets, taking away the overlaps of each pair, then adding back the overlap of all three.', '|A ∪ B ∪ C| = 30 + 20 + 10 − 5 − 4 − 3 + 1 = 49.', ['inclusion-exclusion']],
  /* q21–q30 (missions-c.js) */
  ['derangement', 'q22', 'An arrangement of labelled objects in which no object ends up in its own place.', 'For crates 1, 2, 3 in bins 1, 2, 3, the order 2, 3, 1 is a derangement.'],
  ['sequence', 'q24', 'A list of numbers in a fixed order, one number for each position 1, 2, 3 and so on.', '3, 7, 11, 15, … is a sequence with first term 3.'],
  ['closed formula', 'q24', 'A rule that gives any term of a sequence straight from its position n, with no earlier terms needed.', 'bₙ = n² + 3n gives b₁₀ = 130 at once.'],
  ['recursive definition', 'q24', 'A description of a sequence by its first term and a rule that builds each term from the one before it.', 'a₁ = 4 and aₙ = 2aₙ₋₁ − 1 give 4, 7, 13, 25, …'],
  ['subscript', 'q24', 'A small number or letter written below and to the right of a letter, giving the position of a term.', 'In a₅ the subscript 5 means the fifth term.'],
  ['arithmetic sequence', 'q25', 'A sequence in which the same number is added to each term to get the next one.', '14, 20, 26, 32, … adds 6 each time.'],
  ['common difference', 'q25', 'The fixed amount added at every step of an arithmetic sequence.', 'In 14, 20, 26, … the common difference is 6.'],
  ['partial sum', 'q25', 'The sum of the first n terms of a sequence.', 'The partial sum of 1, 3, 5, 7, … over four terms is 16.'],
  ['geometric sequence', 'q26', 'A sequence in which each term is the one before multiplied by the same number.', '3, 6, 12, 24, … doubles each time.'],
  ['common ratio', 'q26', 'The fixed number that each term of a geometric sequence is multiplied by to give the next.', 'In 3, 6, 12, … the common ratio is 2.'],
  ['finite difference', 'q27', 'The gap between neighbouring terms of a list, found by subtracting each term from the next one.', 'For 6, 13, 24 the first differences are 7 and 11.', ['first difference', 'second difference', 'third difference']],
  ['recurrence relation', 'q28', 'An equation that gives each term of a sequence from one or more of the terms before it.', 'aₙ = aₙ₋₁ + 2aₙ₋₂ is a recurrence relation.', ['recurrence']],
  ['initial condition', 'q28', 'A starting term of a sequence that a recurrence relation needs before it can produce the rest.', 'For aₙ = aₙ₋₁ + aₙ₋₂ the initial conditions a₀ and a₁ must be given.'],
  ['Fibonacci number', 'q28', 'A term of the sequence 0, 1, 1, 2, 3, 5, 8, …, where each term is the sum of the two before it.', 'The Fibonacci number after 5 and 8 is 13.'],
  ['iteration', 'q30', 'Solving a recurrence by applying it again and again until only the starting term and a sum are left.', 'aₙ = aₙ₋₁ + 2n gives a₃ = a₀ + 2 + 4 + 6.'],
  /* q31–q40 (missions-d.js) */
  ['characteristic equation', 'q31', 'The quadratic x² = cx + d that comes from trying aₙ = xⁿ in the recurrence aₙ = c × aₙ₋₁ + d × aₙ₋₂; its solutions are the characteristic roots.', 'aₙ = 5aₙ₋₁ − 6aₙ₋₂ has characteristic equation x² = 5x − 6, roots 2 and 3.', ['characteristic root']],
  ['tiling', 'q32', 'A way to cover a shape completely with tiles of given sizes, with no gaps and no overlaps.', 'A strip 3 long has 3 tilings with tiles 1 long and 2 long: 1 + 1 + 1, 1 + 2 and 2 + 1.'],
  ['generating function', 'q33', 'A sum of powers of x whose coefficients are the counts you want: the number in front of xᵏ counts the ways to make k.', 'In (1 + x + x²)(1 + x), the coefficient of x² is 2.'],
  ['combinatorial proof', 'q34', 'A proof that two formulas are equal because each one correctly counts the same set.', 'Crews with or without one named person: C(n, k) = C(n − 1, k − 1) + C(n − 1, k).'],
  ['quotient', 'q35', 'The number of whole times b fits when a is divided by b, the q in a = b × q + r.', '23 = 5 × 4 + 3, so the quotient is 4.'],
  ['remainder', 'q35', 'What is left when a is divided by b: the r in a = b × q + r, always from 0 to b − 1.', '−23 = 5 × (−5) + 2, so the remainder is 2.'],
  ['divides', 'q35', 'b divides a when a is b times a whole number, so the remainder of a on division by b is 0.', '5 divides 35, because 35 = 5 × 7.', ['divide']],
  ['mod', 'q36', 'a mod m is the remainder of a on division by m.', '17 mod 12 = 5, as on a clock face with 12 hours.'],
  ['congruent', 'q36', 'Two whole numbers are congruent mod m, written a ≡ b (mod m), when they leave the same remainder on division by m.', '17 ≡ 5 (mod 12).', ['congruence', '≡']],
  ['graph', 'q37', 'A set of points called vertices, with some pairs of them joined by edges; only which pairs are joined matters.', 'Junctions as vertices and roads as edges make a road map a graph.', [], 'graph of |graph paper|coordinate|plot'],
  ['vertex', 'q37', 'One of the points of a graph, such as a junction on a road map.', 'A triangle drawn as a graph has 3 vertices.', ['vertices']],
  ['edge', 'q37', 'A line in a graph that joins two vertices, such as a road between two junctions.', 'A triangle drawn as a graph has 3 edges.', [], 'edge of'],
  ['degree', 'q37', 'The number of edges that meet at a vertex of a graph.', 'At a junction where 3 roads meet, the degree is 3.', [], 'polynomial|differences|cubic|quadratic|level'],
  ['handshake lemma', 'q37', 'In any graph the degrees of the vertices add up to twice the number of edges.', 'Degrees 1, 3, 2, 2 and 4 add up to 12, so there are 6 edges.'],
  ['connected', 'q38', 'A graph is connected when every vertex can be reached from every other one along edges.', 'Three domes linked in a row by two roads form a connected graph.'],
  ['cycle', 'q38', 'A route in a graph that leaves a vertex and comes back to it without using any edge twice.', 'Roads A–B, B–C and C–A form a cycle.'],
  ['tree', 'q38', 'A connected graph with no cycle; a tree with v vertices has exactly v − 1 edges.', 'Five domes linked by 4 roads with no cycle form a tree.'],
  ['leaf', 'q38', 'A vertex of degree 1 in a tree: the end of a branch.', 'A path of 4 vertices in a row has 2 leaves.', ['leaves']],
  ['Euler path', 'q39', 'A route through a graph that uses every edge exactly once.', 'Roads A–B, B–C and C–D: the route A–B–C–D is an Euler path.'],
  ['Euler circuit', 'q39', 'An Euler path that ends at the vertex where it started.', 'Roads A–B, B–C and C–A: the route A–B–C–A is an Euler circuit.'],
 ]
};
})();
