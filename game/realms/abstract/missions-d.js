/* Abstract algebra: patterns of moves missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/abstract/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Groups in action · Advanced, 200 XP · sector 'Tile Studio' · Orbit–stabiliser theorem [14.1]
     q32  ch 6 Groups in action · Advanced, 200 XP · sector 'Tile Studio' · Conjugacy classes in S_n [14.2]
     q33  ch 6 Groups in action · Advanced, 200 XP · sector 'Tile Studio' · Burnside's counting theorem [14.3]
     q34  ch 6 Groups in action · Advanced, 200 XP · sector 'Tile Studio' · Finite abelian groups [13.1]
     q35  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Rings and zero divisors [16.3]
     q36  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Fields: dividing in Z_p [16.4]
     q37  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Polynomials over Z_p [17.1, 17.2]
     q38  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Ideals in the integers [16.5]
     q39  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Irreducible polynomials [17.3]
     q40  ch 7 Rings and fields · Advanced, 200 XP · sector 'Cipher Vault' · Finite fields; realm review and bridge to Number theory [22.1] */
(function(){
'use strict';
/* Thomas W. Judson, Abstract Algebra: Theory and Applications (LibreTexts) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Judson, Abstract Algebra/ (Judson, Abstract Algebra).
   A title reads like: Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 4.1 Cyclic Subgroups
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s13_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 13.1 Finite Abelian Groups', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/13%3A_The_Structure_of_Groups/13.01%3A_Finite_Abelian_Groups', description: 'The Fundamental Theorem of Finite Abelian Groups: every finite abelian group is a direct product of cyclic groups of prime-power order, with the abelian groups of order 540 listed. Counting them by partitions of the exponents is worked out in this mission.', verified: '2026-11-28' },
 s14_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 14.1 Groups Acting on Sets', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/14%3A_Group_Actions/14.01%3A_Groups_Acting_on_Sets', description: 'Group actions, orbits and stabilisers (isotropy subgroups), and Theorem 14.11: the size of an orbit is the index of the stabiliser. The cube and tetrahedron examples are worked out in this mission.', verified: '2026-11-28' },
 s14_2: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 14.2 The Class Equation', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/14%3A_Group_Actions/14.02%3A_The_Class_Equation', description: 'Conjugacy classes as the orbits of conjugation, the class equation, and Example 14.14: permutations of Sₙ with the same cycle lengths are conjugate. The formula for the size of a class is worked out in this mission.', verified: '2026-11-28' },
 s14_3: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 14.3 Burnside’s Counting Theorem', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/14%3A_Group_Actions/14.03%3A_Burnside\'s_Counting_Theorem', description: 'Burnside’s theorem, the number of orbits as the average number of elements each move fixes, with colourings of the corners of a square. The rule k to the power gcd(r, n) for a turned ring is worked out in this mission.', verified: '2026-11-28' },
 s16_3: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 16.3 Rings', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/16%3A_Rings/16.03%3A_Rings', description: 'Rings, commutative rings and zero divisors, with Zₙ as a ring under addition and multiplication mod n. Counting the units and zero divisors of Zₙ is worked out in this mission.', verified: '2026-11-28' },
 s16_4: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 16.4 Integral Domains and Fields', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/16%3A_Rings/16.04%3A_Integral_Domains_and_Fields', description: 'Units, integral domains and fields, and Example 16.17: Zₚ is a field for every prime p.', verified: '2026-11-28' },
 s16_5: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 16.5 Ring Homomorphisms and Ideals', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/16%3A_Rings/16.05%3A_Ring_Homomorphisms_and_Ideals', description: 'Ideals and principal ideals, and Theorem 16.25: every ideal of the integers is principal, the multiples of its least positive element. That the ideal made by two numbers is generated by their gcd is worked out in this mission.', verified: '2026-11-28' },
 s17_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 17.1 Polynomial Rings', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/17%3A_Polynomials/17.01%3A_Polynomial_Rings', description: 'Polynomial rings R[x], the degree of a polynomial, monic polynomials, and evaluating a polynomial at a value.', verified: '2026-11-28' },
 s17_2: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 17.2 The Division Algorithm', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/17%3A_Polynomials/17.02%3A_The_Division_Algorithm', description: 'The division algorithm for polynomials over a field; α is a zero of p(x) exactly when x − α is a factor; a polynomial of degree n has at most n zeros.', verified: '2026-11-28' },
 s17_3: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 17.3 Irreducible Polynomials', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/17%3A_Polynomials/17.03%3A_Irreducible_Polynomials', description: 'Irreducible polynomials over a field, with a cubic over Z₃ shown irreducible because it has no zeros. The count of monic irreducible quadratics is worked out in this mission.', verified: '2026-11-28' },
 s22_1: { title: 'Judson, Abstract Algebra: Theory and Applications (LibreTexts) — 22.1 Structure of a Finite Field', url: 'https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Abstract_Algebra%3A_Theory_and_Applications_(Judson)/22%3A_Finite_Fields/22.01%3A_Structure_of_a_Finite_Field', description: 'A finite field has pⁿ elements, the Galois field GF(pⁿ) exists for every prime power, and the non-zero elements of a finite field form a cyclic group under multiplication. Counting its generators is worked out in this mission.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'The stamp that stays put', topic: 'Orbit–stabiliser theorem', tier: 'Advanced', sector: 'Tile Studio',
  brief: 'A pattern stamp is about to be pressed into the dome tiles, and the crew needs to know how many of its turns leave one part of it exactly where it started.',
  lesson: 'The orbit of an item times its stabiliser, the moves that leave it in place, always equals the size of the group: |orbit| × |stabiliser| = |G|.',
  prompt: 'The Tile Studio’s pattern stamp is a solid cube. The 24 turns that carry it onto itself (the do-nothing turn included) form a group, and one of them carries any face to the place of any other face. Enter the size of the orbit of one face, then the size of its stabiliser: the number of these moves that leave that face in its own place.',
  answer: [6, 4], labels: ['orbit size', 'stabiliser size'], tolerance: 0.01,
  hints: [
   'The orbit of one face is every place it can be carried to. Since any face can reach any other, count the faces.',
   'The orbit–stabiliser theorem: the size of the orbit times the size of the stabiliser is the size of the group.'
  ],
  solution: 'Any face can be carried to the place of any other, so the orbit of one face is all 6 faces. By the orbit–stabiliser theorem, |stabiliser| = |G| ÷ |orbit| = 24 ÷ 6 = 4. Check: the moves that leave one face in its place are the do-nothing move and the quarter, half and three-quarter turns about the axis through the centre of that face, which is 4 moves.',
  xp: 200, prereqs: ['q30', 'q20'],
  artifact: { name: 'Stamp turning chart', description: 'Every turn of the stamp, sorted by where it sends one face.' },
  sources: [source.s14_1],
  teaching: {
   intuition: 'When a group acts on a set, every element of the set has two things attached to it. Its orbit is every place the moves of the group can send it. Its stabiliser is the set of moves that leave it exactly where it is. The stabiliser is a subgroup: two moves that each leave the element in place still leave it in place when done one after the other, and so does undoing one of them. The two sizes are tied together. Sort the moves by where they send the element. The moves that send it to one particular place form a coset of the stabiliser, and every coset has as many moves as the stabiliser has. So each place in the orbit is reached by the same number of moves, and that gives the orbit–stabiliser theorem: |orbit| × |stabiliser| = |G|, the size of the group. In the words of Lagrange’s theorem, the size of the orbit is the index [G : stabiliser].',
   steps: [
    'Name the group and its size |G|: the moves that carry the object onto itself, the do-nothing move included.',
    'Find the orbit of the chosen item: every place a move can carry it to. When any item can be sent to the place of any other, the orbit is all of them.',
    'Divide: |stabiliser| = |G| ÷ |orbit|.',
    'Check by listing the moves that leave the item in its place, always counting the do-nothing move.'
   ],
   example: {
    prompt: 'A square hatch has 8 moves: 4 turns, the do-nothing turn included, and 4 flips. Any corner can be sent to the place of any other. How many moves leave one corner in its place?',
    steps: [
     'The orbit of a corner is all 4 corners.',
     'By the orbit–stabiliser theorem the stabiliser has 8 ÷ 4 = 2 moves.',
     'They are the do-nothing move and the flip across the diagonal through that corner.'
    ],
    answer: 'Orbit 4, stabiliser 2 moves.'
   },
   pitfalls: [
    'Forgetting the do-nothing move. It leaves everything in place, so it is always in the stabiliser.',
    'Counting a move that sends the item to another place of the same kind. A stabiliser move must leave this particular item where it was.',
    'Multiplying instead of dividing. The stabiliser is the group size divided by the orbit size, so it is never bigger than the group.'
   ]
  },
  guidance: [
   { prompt: 'Any face can be carried to the place of any other. How many places can one face reach: how many faces are there?', answer: [6], labels: ['orbit size'], explanation: 'The orbit is all the places the face can be sent to, which is every face: 6 of them.' },
   { prompt: 'The group has 24 moves and the orbit has 6 places. How many moves leave one face in its own place?', answer: [4], labels: ['stabiliser size'], explanation: 'Orbit size × stabiliser size = group size, so the stabiliser has 24 ÷ 6 = 4 moves: the do-nothing move and the quarter, half and three-quarter turns about the axis through the centre of that face.' }
  ]
 },
 {
  id: 'q32', title: 'Shuffles of the same shape', topic: 'Conjugacy classes in Sₙ', tier: 'Advanced', sector: 'Tile Studio',
  brief: 'The floor crew keeps reordering tiles in the same pattern of loops and swaps, and wants to know how many different reorderings share that pattern.',
  lesson: 'In Sₙ the conjugacy class of a permutation is every permutation with the same cycle lengths, and it holds n! ÷ (kᵐ × m! over the cycle lengths) of them.',
  prompt: 'The Tile Studio reorders a row of 6 floor tiles, labelled 1 to 6, with permutations. One reordering is made of one 3-cycle and one 2-cycle, with 1 tile left in its place. Its conjugacy class is every permutation of the 6 tiles with exactly the same cycle lengths. Enter how many permutations are in that class, then the order of each of them.',
  answer: [120, 6], labels: ['class size', 'order'], tolerance: 0.01,
  hints: [
   'Write the n symbols in any of the n! orders into the brackets of the pattern. Each k-cycle can be started at any of its k symbols, and cycles of the same length can be listed in any order, so divide n! by kᵐ × m! for each length k that appears m times (fixed symbols count as cycles of length 1).',
   'The order of a permutation is the lcm of its cycle lengths, and every permutation in the class has the same cycle lengths.'
  ],
  solution: 'There are 6! = 720 ways to write the tiles into the pattern. Each permutation comes up once for every way of writing it: for the cycles of length 3, 2 and 1 that is 3 × 1! = 3, 2 × 1! = 2 and 1 × 1! = 1, so 6 ways in all. So the class has 720 ÷ 6 = 120 permutations. Each has order lcm(3, 2) = 6.',
  xp: 200, prereqs: ['q13', 'q31'],
  artifact: { name: 'Shuffle pattern ledger', description: 'Every reordering of the tiles, filed by the lengths of its cycles.' },
  sources: [source.s14_2],
  teaching: {
   intuition: 'Sₙ is the group of all permutations of n symbols. Two permutations σ and τστ⁻¹ are called conjugate: the second does the same job as the first, after the symbols have been renamed by τ. Renaming the symbols changes which symbols sit in each cycle, but never the lengths of the cycles, and any two permutations with the same cycle lengths can be renamed into each other. So the conjugacy class of a permutation, the set of all its conjugates, is exactly the set of permutations with the same cycle type: the same list of cycle lengths. To count a class, write n! (n factorial) for 1 × 2 × … × n, the number of ways to put n symbols in a row. Fill the brackets of the pattern, such as (_ _ _)(_ _)(_), with the symbols in all n! orders. Each permutation then turns up several times: a k-cycle reads the same started at any of its k symbols, and m cycles of the same length can be listed in m! orders. So divide n! by kᵐ × m! for each length k that appears m times, counting every fixed symbol as a cycle of length 1.',
   steps: [
    'Write the cycle type: the lengths of the cycles, with every fixed symbol as a cycle of length 1.',
    'Work out n! = 1 × 2 × … × n.',
    'For each length k that appears m times, work out kᵐ × m!, and multiply these together.',
    'Divide n! by that product to get the size of the conjugacy class. Every member has the same order: the lcm of the cycle lengths.'
   ],
   example: {
    prompt: 'How many permutations of 5 symbols are made of two 2-cycles and one fixed symbol, and what is their order?',
    steps: [
     '5! = 120.',
     'The two 2-cycles give 2² × 2! = 8, and the fixed symbol gives 1¹ × 1! = 1.',
     '120 ÷ 8 = 15 permutations, each of order lcm(2, 2) = 2.'
    ],
    answer: '15 permutations, each of order 2.'
   },
   pitfalls: [
    'Forgetting the m! for cycles of the same length: (1 2)(3 4) and (3 4)(1 2) are the same permutation.',
    'Leaving out the fixed symbols when there are several: two fixed symbols can swap places in the pattern, which divides by 2! more.',
    'Adding the cycle lengths to get the order instead of taking their lcm.'
   ]
  },
  guidance: [
   { prompt: 'How many ways are there to write the 6 tiles in a row: what is 6!?', answer: [720], labels: ['ways to order the tiles'], explanation: '6! = 1 × 2 × 3 × 4 × 5 × 6 = 720.' },
   { prompt: 'Each permutation of this type is written 6 different ways. How many permutations are in the class?', answer: [120], labels: ['class size'], explanation: '720 ÷ 6 = 120. The 6 comes from 3 × 1! = 3, 2 × 1! = 2 and 1 × 1! = 1, multiplied together.' },
   { prompt: 'What is the order of a permutation made of one 3-cycle and one 2-cycle, with 1 tile left in its place?', answer: [6], labels: ['order'], explanation: 'The order is the lcm of the cycle lengths: lcm(3, 2) = 6.' }
  ]
 },
 {
  id: 'q33', title: 'Rings of coloured tiles', topic: 'Burnside’s counting theorem', tier: 'Advanced', sector: 'Tile Studio',
  brief: 'Each skylight ring is a circle of coloured tiles, and the studio wants to stock one of every truly different ring without making two that are only turned copies.',
  lesson: 'Burnside’s theorem: the number of different designs (orbits) is the average, over all the moves, of how many colourings each move leaves unchanged.',
  prompt: 'A ring of 6 tiles runs round the dome’s skylight in a frame that can be turned but never flipped over. Each tile is one of 3 colours, and two colourings count as the same design when a turn of the ring carries one onto the other. Enter how many colourings are left unchanged by a turn of 2 steps, then how many truly different designs there are.',
  answer: [9, 130], labels: ['unchanged colourings', 'different designs'], tolerance: 0.01,
  hints: [
   'A turn of r steps around n tiles splits them into gcd(r, n) cycles, and a colouring is unchanged only if every tile in a cycle has the same colour.',
   'Burnside’s theorem: the number of different designs is the average, over all the turns (the do-nothing turn included), of the number of colourings each turn leaves unchanged.'
  ],
  solution: 'A turn of 2 steps splits the 6 tiles into gcd(2, 6) = 2 cycles, and each cycle must be one colour, so it leaves 3² = 9 colourings unchanged. Over the turns of 0 to 5 steps the unchanged counts are 729, 3, 9, 27, 9 and 3, which add up to 780. Burnside’s theorem divides by the 6 turns: 780 ÷ 6 = 130 different designs.',
  xp: 200, prereqs: ['q31'],
  artifact: { name: 'Skylight ring catalogue', description: 'One of every ring design, each turned copy left out.' },
  sources: [source.s14_3],
  teaching: {
   intuition: 'Burnside’s theorem counts orbits without listing them. Suppose a group G acts on a set X, such as the turns of a ring acting on its colourings. For each move g, count the elements of X that g leaves unchanged. Burnside’s theorem says that the number of orbits is the average of these counts: add them up over every move of G and divide by |G|. It works because of the orbit–stabiliser theorem: each element of an orbit is left unchanged by |G| ÷ |orbit| moves, so the elements of one orbit together add exactly |G| to the total. For a ring of n tiles in k colours that can only be turned, the group is the n turns of 0, 1, …, n − 1 steps. A turn of r steps splits the tiles into gcd(r, n) cycles: follow one tile round and it comes back to its start after n ÷ gcd(r, n) jumps. A colouring stays the same only if each cycle is a single colour, so the turn leaves k to the power gcd(r, n) colourings unchanged. The do-nothing turn leaves all kⁿ of them unchanged.',
   steps: [
    'List the turns: 0, 1, …, n − 1 steps.',
    'For a turn of r steps, find gcd(r, n). The turn leaves k to the power gcd(r, n) colourings unchanged (gcd(0, n) = n, so the do-nothing turn leaves all kⁿ).',
    'Add the counts over all the turns.',
    'Divide by the number of turns, n. The result is the number of truly different designs.'
   ],
   example: {
    prompt: 'A ring of 4 tiles, each black or white, can be turned but not flipped. How many different designs are there?',
    steps: [
     'Turns of 0, 1, 2 and 3 steps have gcd 4, 1, 2 and 1 with 4.',
     'They leave 2⁴ = 16, 2, 2² = 4 and 2 colourings unchanged.',
     '16 + 2 + 4 + 2 = 24, and 24 ÷ 4 = 6.'
    ],
    answer: '6 different designs.'
   },
   pitfalls: [
    'Leaving out the do-nothing turn. It leaves every colouring unchanged and is usually the biggest count.',
    'Dividing the number of colourings kⁿ by n. A ring of one colour all round has only one turned copy, so that division is wrong and need not even give a whole number.',
    'Counting flips when the frame can only be turned. The group here is the turns alone.'
   ]
  },
  guidance: [
   { prompt: 'How many cycles does a turn of 2 steps make among 6 tiles, and so how many colourings does it leave unchanged?', answer: [9], labels: ['unchanged colourings'], explanation: 'It makes gcd(2, 6) = 2 cycles; each is one of 3 colours, so 3² = 9 colourings are unchanged.' },
   { prompt: 'Add up the unchanged colourings over all 6 turns, from 0 steps (which changes nothing) to 5 steps. What is the total?', answer: [780], labels: ['total'], explanation: 'The counts are 729, 3, 9, 27, 9 and 3, one for each turn, and they add up to 780.' },
   { prompt: 'Divide the total by the number of turns. How many different designs are there?', answer: [130], labels: ['different designs'], explanation: '780 ÷ 6 = 130: Burnside’s theorem says the number of orbits, here the designs, is the average number of colourings a move leaves unchanged.' }
  ]
 },
 {
  id: 'q34', title: 'Drawers for every pattern', topic: 'Finite abelian groups', tier: 'Advanced', sector: 'Tile Studio',
  brief: 'The studio’s pattern library is filed by symmetry group, and the crew wants to know how many drawers to build for the abelian ones of each size.',
  lesson: 'Every finite abelian group is a product of cyclic groups of prime-power order, so the number of abelian groups of order n is the product of the numbers of partitions of the exponents in its prime factorisation.',
  prompt: 'The Tile Studio is listing every abelian group a dome pattern could follow, counting groups that are isomorphic (copies of each other) as one. Take the order 144 = 2⁴ × 3². Enter the number of abelian groups of order 16 (the part 2⁴), then the number of abelian groups of order 144.',
  answer: [5, 10], labels: ['groups of the prime-power part', 'groups of the whole order'], tolerance: 0.01,
  hints: [
   'By the fundamental theorem, an abelian group of order pᵉ is a product of cyclic groups whose orders are powers of p, with exponents adding up to e. Count the partitions of e.',
   'Each prime is split on its own, so multiply the numbers of partitions of the exponents.'
  ],
  solution: 'Each abelian group of order 144 is a product of cyclic groups of prime-power order, one splitting of the exponent for each prime. 2⁴: 4 can be written as 4, 3 + 1, 2 + 2, 2 + 1 + 1 and 1 + 1 + 1 + 1, so 5 ways; 3²: 2 can be written as 2 and 1 + 1, so 2 ways. So there are 5 abelian groups of order 16, and 5 × 2 = 10 abelian groups of order 144.',
  xp: 200, prereqs: ['q27'],
  artifact: { name: 'Pattern library drawers', description: 'One drawer for each abelian group, labelled by its cyclic parts.' },
  sources: [source.s13_1],
  teaching: {
   intuition: 'The fundamental theorem of finite abelian groups says that every finite abelian group is a direct product of cyclic groups whose orders are powers of primes, such as Z₄ × Z₂ × Z₃. So to list the abelian groups of order n, first write n as a product of prime powers. Each prime power pᵉ is shared out among cyclic groups whose orders are powers of p with exponents adding up to e. A way to write e as a sum of positive whole numbers, ignoring the order of the parts, is called a partition of e. For example 3 has three partitions, 3, 2 + 1 and 1 + 1 + 1, which give Z₈, Z₄ × Z₂ and Z₂ × Z₂ × Z₂. These really are different groups: Z₈ has an element of order 8, while no element of Z₄ × Z₂ has order more than lcm(4, 2) = 4. A further part of the theorem, which we take on trust here, says that different partitions never give isomorphic groups. The primes are shared out independently of each other, so the number of abelian groups of order n is the product of the numbers of partitions of its exponents.',
   steps: [
    'Write n as a product of prime powers, such as 2³ × 5².',
    'For each prime, count the partitions of its exponent: 1 has 1, 2 has 2, 3 has 3, 4 has 5, 5 has 7, 6 has 11 and 7 has 15.',
    'Each partition gives one abelian group of that prime-power order.',
    'Multiply the numbers of partitions over all the primes to get the number of abelian groups of order n.'
   ],
   example: {
    prompt: 'How many abelian groups of order 72 = 2³ × 3² are there?',
    steps: [
     '3 has the partitions 3, 2 + 1 and 1 + 1 + 1: three abelian groups of order 8.',
     '2 has the partitions 2 and 1 + 1: two abelian groups of order 9.',
     '3 × 2 = 6.'
    ],
    answer: '6 abelian groups of order 72.'
   },
   pitfalls: [
    'Counting 2 + 1 and 1 + 2 as different partitions. Z₄ × Z₂ and Z₂ × Z₄ are the same group, so the order of the parts does not matter.',
    'Adding the partition counts of the primes instead of multiplying them. Every choice for one prime goes with every choice for the others.',
    'Splitting the whole order instead of each exponent: 12 = 2² × 3 has 2 × 1 = 2 abelian groups, not one for each way of factoring 12.'
   ]
  },
  guidance: [
   { prompt: 'In how many ways can the exponent 4 be written as a sum of positive whole numbers, ignoring order?', answer: [5], labels: ['partitions'], explanation: '4 can be written as 4, 3 + 1, 2 + 2, 2 + 1 + 1 and 1 + 1 + 1 + 1: 5 partitions, so 5 abelian groups of order 16.' },
   { prompt: 'Multiply the numbers of partitions of the exponents of 2⁴ × 3². How many abelian groups of order 144 are there?', answer: [10], labels: ['abelian groups'], explanation: 'The exponents 4 and 2 have 5 and 2 partitions, and 5 × 2 = 10.' }
  ]
 },
 {
  id: 'q35', title: 'The dial that multiplies to zero', topic: 'Rings and zero divisors', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'A new cipher dial adds and multiplies mod its size, and Mira wants to know which settings can be undone and which can wipe a code out to 0.',
  lesson: 'A ring has an addition and a multiplication; in Zₙ each non-zero element is either a unit (coprime to n) or a zero divisor, which multiplies some non-zero element to 0.',
  prompt: 'The Cipher Vault’s dial works in the ring Z₁₅: the numbers 0 to 14, added and multiplied mod 15. Enter how many units the ring has, then how many zero divisors, then the smallest b from 1 to 14 with 6 × b = 0 in Z₁₅.',
  answer: [8, 6, 5], labels: ['units', 'zero divisors', 'smallest b'], tolerance: 0.01,
  hints: [
   'A non-zero x in Zₙ is a unit when gcd(x, n) = 1 and a zero divisor when gcd(x, n) > 1. Every non-zero x is exactly one of the two.',
   'For a zero divisor a, the product a × b is a multiple of n first when b = n ÷ gcd(a, n).'
  ],
  solution: 'The units are the x with gcd(x, 15) = 1: 1, 2, 4, 7, 8, 11, 13 and 14, 8 of them. The other non-zero numbers, 3, 5, 6, 9, 10 and 12, are the 6 zero divisors (14 − 8 = 6). gcd(6, 15) = 3, so 6 × b is first a multiple of 15 at b = 15 ÷ 3 = 5: 6 × 5 = 30, which is 0 mod 15.',
  xp: 200, prereqs: ['q06'],
  artifact: { name: 'Dial settings sheet', description: 'The settings that can be undone, and the ones that wipe a code to 0.' },
  sources: [source.s16_3],
  teaching: {
   intuition: 'A ring is a set with two operations, an addition and a multiplication, that behave the way they do for whole numbers: addition makes an abelian group, multiplication is associative, and multiplying spreads over adding, a × (b + c) = a × b + a × c. Zₙ, the numbers 0 to n − 1 with addition and multiplication mod n, is a ring. A ring can do something whole numbers never do: two non-zero elements can multiply to 0. In Z₆, 2 × 3 = 6, which is 0 mod 6. A non-zero element a is called a zero divisor when a × b = 0 for some non-zero b. In Zₙ every non-zero x is exactly one of two kinds. If gcd(x, n) = 1, x is a unit: it has an inverse, as in U(n), and a unit can never be a zero divisor. If gcd(x, n) = d is more than 1, then x × (n ÷ d) is a multiple of n, so x is a zero divisor, and n ÷ d is the smallest non-zero partner that works.',
   steps: [
    'List the non-zero elements, 1 to n − 1.',
    'Count the units: the x with gcd(x, n) = 1. That count is |U(n)|.',
    'Every other non-zero element is a zero divisor, so there are n − 1 minus the number of units of them.',
    'For a zero divisor a with gcd(a, n) = d, the smallest b from 1 to n − 1 with a × b = 0 in Zₙ is n ÷ d.'
   ],
   example: {
    prompt: 'In Z₁₀, how many units and how many zero divisors are there, and what is the smallest b with 4 × b = 0?',
    steps: [
     'The units, with gcd 1 with 10, are 1, 3, 7 and 9: four of them.',
     'The zero divisors are 2, 4, 5, 6 and 8: 9 − 4 = 5 of them.',
     'gcd(4, 10) = 2, so b = 10 ÷ 2 = 5: 4 × 5 = 20, which is 0 mod 10.'
    ],
    answer: '4 units, 5 zero divisors, and b = 5.'
   },
   pitfalls: [
    'Counting 0 as a zero divisor. A zero divisor must itself be non-zero.',
    'Taking b = n. In Zₙ the number n is 0, and the partner must be non-zero.',
    'Expecting zero divisors when n is prime. In Zₚ every non-zero element is a unit.'
   ]
  },
  guidance: [
   { prompt: 'How many of the numbers 1 to 14 have gcd 1 with 15?', answer: [8], labels: ['units'], explanation: 'They are 1, 2, 4, 7, 8, 11, 13 and 14: 8 units.' },
   { prompt: 'The other non-zero numbers share a factor with 15. How many zero divisors are there?', answer: [6], labels: ['zero divisors'], explanation: '14 non-zero numbers minus 8 units leaves 6 zero divisors.' },
   { prompt: 'gcd(6, 15) = 3. What is the smallest b from 1 to 14 with 6 × b = 0 in Z₁₅?', answer: [5], labels: ['smallest b'], explanation: '6 × b must be a multiple of 15, which first happens at b = 15 ÷ 3 = 5.' }
  ]
 },
 {
  id: 'q36', title: 'Dividing on a prime dial', topic: 'Fields: dividing in Zₚ', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'The vault’s lock dial has a prime number of settings, and the crew must find the one setting that opens it from the lock’s rule.',
  lesson: 'A field is a ring in which every non-zero element has an inverse; Zₚ is a field for every prime p, so (ax + b) mod p = c is solved by subtracting b and multiplying by the inverse of a.',
  prompt: 'A vault lock works in the field Z₁₁. It opens at the setting x, a whole number from 0 to 10, with (4x + 5) mod 11 = 3. Enter the inverse of 4 in Z₁₁, then x.',
  answer: [3, 5], labels: ['inverse of a', 'x'], tolerance: 0.01,
  hints: [
   'In a field you can undo each step: subtract the constant (mod p), then multiply by the inverse of the coefficient.',
   'The inverse of a in Zₚ is the number y from 1 to p − 1 with a × y mod p = 1.'
  ],
  solution: 'Subtract 5: 4x mod 11 = (3 − 5) mod 11 = 9. The inverse of 4 is 3, since 4 × 3 = 12, which is 1 mod 11. So x = 9 × 3 mod 11 = 27 mod 11 = 5. Check: 4 × 5 + 5 = 25, which is 3 mod 11.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Prime dial key', description: 'The setting that opens the lock, found by undoing its rule one step at a time.' },
  sources: [source.s16_4],
  teaching: {
   intuition: 'A field is a ring in which multiplication is commutative, there is a 1, and every non-zero element has an inverse, so you can divide by anything except 0. The fractions form a field. The whole numbers do not, because 2 has no whole-number inverse. Zₙ is a field exactly when n is prime: then every non-zero x is coprime to n, so it is a unit, and there are no zero divisors. We write Zₚ, with p for a prime. In a field, an equation (ax + b) mod p = c is solved just like ax + b = c in ordinary algebra: subtract b, then multiply by the inverse of a instead of dividing by a. Each step can be undone, so there is exactly one answer x from 0 to p − 1.',
   steps: [
    'Subtract b from both sides and reduce: a × x mod p = (c − b) mod p.',
    'Find the inverse of a: the y from 1 to p − 1 with a × y mod p = 1.',
    'Multiply (c − b) mod p by that inverse and reduce mod p. That is x.',
    'Check by putting x back into (ax + b) mod p.'
   ],
   example: {
    prompt: 'Solve (3x + 2) mod 7 = 6 in Z₇.',
    steps: [
     'Subtract 2: 3x mod 7 = 4.',
     'The inverse of 3 is 5, since 3 × 5 = 15, which is 1 mod 7.',
     'x = 4 × 5 mod 7 = 20 mod 7 = 6. Check: 3 × 6 + 2 = 20, which is 6 mod 7.'
    ],
    answer: 'x = 6.'
   },
   pitfalls: [
    'Dividing as with fractions. 4 ÷ 3 is not a whole number, but in Z₇ dividing by 3 means multiplying by its inverse, 5.',
    'Forgetting to reduce a negative difference: (2 − 6) mod 13 is 9, not −4.',
    'Using the same method when n is not prime. In Z₁₀, (2x) mod 10 = 5 has no solution, because 2 has no inverse.'
   ]
  },
  guidance: [
   { prompt: 'Subtract 5 from both sides. What is (3 − 5) mod 11?', answer: [9], labels: ['c − b mod p'], explanation: '3 − 5 = −2, which is 9 mod 11. So 4x mod 11 = 9.' },
   { prompt: 'Which y from 1 to 10 has 4 × y mod 11 = 1?', answer: [3], labels: ['inverse of a'], explanation: '4 × 3 = 12, which is 1 more than a multiple of 11, so the inverse of 4 is 3.' },
   { prompt: 'Multiply 9 by the inverse 3 and reduce mod 11. What is x?', answer: [5], labels: ['x'], explanation: '9 × 3 = 27, which is 5 mod 11.' }
  ]
 },
 {
  id: 'q37', title: 'Codes written as polynomials', topic: 'Polynomials over Zₚ', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'Vault codes are now stored as polynomials, and Mira needs to know which code values make them vanish.',
  lesson: 'In Zₚ[x], the remainder on dividing f(x) by x − a is f(a) mod p, and the roots of f are the values r in Zₚ with f(r) mod p = 0.',
  prompt: 'Vault codes are polynomials with coefficients in Z₇, so all their arithmetic is done mod 7. Take f(x) = x³ + 2x + 3 in Z₇[x]. Enter the remainder when f(x) is divided by x − 2 (a number from 0 to 6), then how many roots f has in Z₇: the r from 0 to 6 with f(r) mod 7 = 0.',
  answer: [1, 1], labels: ['remainder', 'roots'], tolerance: 0.01,
  hints: [
   'Write f(x) = (x − a) × q(x) + remainder and put x = a: the first part becomes 0, so the remainder is f(a), reduced mod p.',
   'A field this small can be searched: work out f(r) mod p for every r from 0 to p − 1 and count the zeros.'
  ],
  solution: 'Putting x = 2 into f(x) = (x − 2) × q(x) + remainder leaves the remainder alone, so it is f(2) = 15, which is 1 mod 7. For r = 0 to 6, f(r) mod 7 is 3, 6, 1, 1, 5, 5 and 0. It is 0 at r = 6, so f has 1 root in Z₇.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'Polynomial code table', description: 'Each code polynomial with its value at every setting of the dial.' },
  sources: [source.s17_1, source.s17_2],
  teaching: {
   intuition: 'A polynomial over Zₚ is a polynomial whose coefficients are numbers from 0 to p − 1, with all the arithmetic done mod p. Together they form the polynomial ring Zₚ[x]: polynomials can be added and multiplied, and the result is again one of them. Because Zₚ is a field, one polynomial can be divided by another with a remainder, just as one whole number can be divided by another. Dividing f(x) by x − a gives f(x) = (x − a) × q(x) + r, where the remainder r is a single number. Putting x = a makes the first part 0, so r = f(a), reduced mod p. This is the factor theorem: x − a divides f exactly when f(a) = 0. A root of f in Zₚ is a value r with f(r) mod p = 0. Zₚ has only p elements, so every root can be found by trying them all, and a polynomial of degree d never has more than d roots in a field.',
   steps: [
    'To divide f(x) by x − a, work out f(a) as an ordinary number.',
    'Reduce it mod p. That is the remainder.',
    'To find the roots, work out f(r) mod p for r = 0, 1, …, p − 1.',
    'Count the values that give 0. There are never more roots than the degree.'
   ],
   example: {
    prompt: 'In Z₅[x], take f(x) = x² + 1. Find the remainder on dividing by x − 3, and the number of roots.',
    steps: [
     'f(3) = 10, which is 0 mod 5, so the remainder is 0 and x − 3 is a factor.',
     'f(0), f(1), f(2), f(3) and f(4) mod 5 are 1, 2, 0, 0 and 2.',
     'Two values give 0: r = 2 and r = 3.'
    ],
    answer: 'Remainder 0, and 2 roots.'
   },
   pitfalls: [
    'Dividing by x − a and putting in −a instead of a.',
    'Forgetting to reduce mod p. A remainder in Zₚ is a number from 0 to p − 1.',
    'Expecting every polynomial to have a root. x² + 2 has no root in Z₅.'
   ]
  },
  guidance: [
   { prompt: 'Work out f(2) and reduce it mod 7. What is the remainder on dividing by x − 2?', answer: [1], labels: ['remainder'], explanation: 'f(2) = 15, and 15 mod 7 = 1. By the factor theorem, that is the remainder.' },
   { prompt: 'The values of f(r) mod 7 for r = 0 to 6 are 3, 6, 1, 1, 5, 5 and 0. How many roots does f have in Z₇?', answer: [1], labels: ['roots'], explanation: 'The value is 0 at r = 6: 1 root.' }
  ]
 },
 {
  id: 'q38', title: 'All the clicks a dial can make', topic: 'Ideals in the integers', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'A vault dial clicks forward and back in two sizes of step, and the crew wants to know exactly which click counts it can ever reach.',
  lesson: 'Every ideal of the integers is all the multiples of one number; the ideal made by a and b is generated by gcd(a, b), and c is in it exactly when gcd(a, b) divides c.',
  prompt: 'A vault dial accepts a number c of clicks when c = 28x + 42y for some whole numbers x and y, which may be negative. These numbers form an ideal of the integers. Enter the positive number that generates it (the smallest positive number in it), then 1 if 63 is in the ideal and 0 if it is not.',
  answer: [14, 0], labels: ['generator', 'c in the ideal (1 or 0)'], tolerance: 0.01,
  hints: [
   'Every ideal of the integers is all the multiples of its smallest positive member, and for the ideal made by a and b that member is gcd(a, b). Euclid’s algorithm finds it.',
   'A number is in the ideal exactly when it is a multiple of the generator.'
  ],
  solution: 'Euclid’s algorithm: 42 = 1 × 28 + 14; 28 = 2 × 14 + 0. So gcd(28, 42) = 14, and it is in the ideal: 28 × (−1) + 42 × 1 = 14. Every member is a multiple of 14, so 14 generates the ideal. 63 ÷ 14 leaves 7, so 63 is not a multiple of 14 and is not in the ideal: 0.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Reachable clicks chart', description: 'Every click count the dial can reach: the multiples of one number.' },
  sources: [source.s16_5],
  teaching: {
   intuition: 'An ideal of the integers is a set of whole numbers (negative ones included) that you can never leave by adding, by subtracting, or by multiplying by any whole number. The multiples of 6, … −12, −6, 0, 6, 12 …, are an ideal: two multiples of 6 add up to another, and 6 times anything is a multiple of 6. Every ideal of the integers is of this kind: it is all the multiples of its smallest positive member, which is said to generate it. Now take two numbers a and b and all the numbers ax + by, with x and y any whole numbers. They form an ideal, so they are the multiples of some generator g. Then g divides a (take x = 1, y = 0) and b, and any common divisor of a and b divides every ax + by, g included. So g is the greatest common divisor, gcd(a, b), which Euclid’s algorithm finds. A number c is in the ideal exactly when c is a multiple of gcd(a, b).',
   steps: [
    'Use Euclid’s algorithm: divide the larger number by the smaller, then the smaller by the remainder, and so on until a remainder is 0.',
    'The last non-zero remainder is gcd(a, b), the generator of the ideal.',
    'To test a number c, divide it by the generator: c is in the ideal exactly when the remainder is 0.'
   ],
   example: {
    prompt: 'Which number generates the ideal made by 12 and 18, and is 30 in it?',
    steps: [
     '18 = 1 × 12 + 6 and 12 = 2 × 6 + 0, so gcd(12, 18) = 6.',
     '6 = 18 − 12 is in the ideal, and every member is a multiple of 6.',
     '30 = 5 × 6, so 30 is in the ideal.'
    ],
    answer: 'The generator is 6, and 30 is in the ideal.'
   },
   pitfalls: [
    'Taking the smaller of the two numbers as the generator. The ideal made by 12 and 18 contains 6, which is smaller than both.',
    'Thinking only numbers bigger than a and b are in the ideal. x and y may be negative, so a small number such as the gcd is in it.',
    'Using the lcm. Common multiples are in the ideal, but so is the gcd, and the ideal is all the multiples of the gcd.'
   ]
  },
  guidance: [
   { prompt: 'Use Euclid’s algorithm on 28 and 42. What is their gcd?', answer: [14], labels: ['gcd'], explanation: '42 = 1 × 28 + 14; 28 = 2 × 14 + 0. The last non-zero remainder is 14.' },
   { prompt: 'The ideal is all the multiples of 14. Is 63 in it? Enter 1 for yes, 0 for no.', answer: [0], labels: ['in the ideal (1 or 0)'], explanation: '63 = 4 × 14 + 7, so it is not a multiple of 14: 0.' }
  ]
 },
 {
  id: 'q39', title: 'A quadratic that will not split', topic: 'Irreducible polynomials', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'To build a bigger number system for the vault, Mira needs a quadratic that no pair of simpler factors can produce.',
  lesson: 'A quadratic over Zₚ is irreducible exactly when it has no root there, and Zₚ has (p² − p) ÷ 2 monic irreducible quadratics.',
  prompt: 'A vault cipher needs a quadratic that cannot be factored over Z₅. Take f(x) = x² + x + 1, with arithmetic mod 5. Enter 1 if f is irreducible over Z₅ and 0 if it is not, then how many monic quadratics x² + Bx + C (B and C each from 0 to 4) are irreducible over Z₅.',
  answer: [1, 10], labels: ['irreducible (1 or 0)', 'irreducible quadratics'], tolerance: 0.01,
  hints: [
   'A quadratic that factors has a factor x − r, so it has a root r. A quadratic with no root in the field is irreducible.',
   'Count the reducible monic quadratics (x − r)(x − s): p with r = s, and p(p − 1) ÷ 2 with r and s different. Take them away from all p² monic quadratics.'
  ],
  solution: 'For x = 0 to 4, f(x) mod 5 is 1, 3, 2, 3 and 1. No value is 0, so f has no root and no factor x − r: it is irreducible, 1. There are 5² = 25 monic quadratics. The reducible ones are (x − r)(x − s): 5 with r = s and 5 × 4 ÷ 2 = 10 with r ≠ s, 15 in all. So 25 − 15 = 10 are irreducible.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Unsplittable quadratic', description: 'A quadratic with no root, ready to build a bigger field.' },
  sources: [source.s17_3],
  teaching: {
   intuition: 'A polynomial is irreducible over a field when it cannot be written as a product of two polynomials of lower degree with coefficients in that field. Irreducible polynomials play the part that prime numbers play among whole numbers. For a quadratic there is a quick test. If x² + bx + c factors, both factors have degree 1, so one of them is x − r and r is a root. So a quadratic (and, in the same way, a cubic) is irreducible exactly when it has no root in the field; over Zₚ, try every value from 0 to p − 1. Counting gives a neat formula. A polynomial is monic when its highest power of x has coefficient 1, so there are p² monic quadratics x² + Bx + C. The reducible ones are the products (x − r)(x − s): p of them with r = s, and p(p − 1) ÷ 2 with r ≠ s, since (x − r)(x − s) and (x − s)(x − r) are the same. Different pairs give different polynomials, because the roots of (x − r)(x − s) are r and s. That leaves p² − p(p + 1) ÷ 2 = (p² − p) ÷ 2 irreducible ones.',
   steps: [
    'Work out f(x) mod p for every x from 0 to p − 1.',
    'If some value is 0, x − r is a factor and f is not irreducible (enter 0); if none is, the quadratic is irreducible (enter 1).',
    'To count the monic irreducible quadratics, take the p(p + 1) ÷ 2 products (x − r)(x − s) away from all p² monic quadratics.',
    'The result is (p² − p) ÷ 2.'
   ],
   example: {
    prompt: 'Is x² + 1 irreducible over Z₃, and how many monic irreducible quadratics does Z₃ have?',
    steps: [
     'x² + 1 mod 3 at x = 0, 1 and 2 gives 1, 2 and 2: no zero, so it is irreducible.',
     'There are 3² = 9 monic quadratics, of which 3 + 3 = 6 are products (x − r)(x − s).',
     '9 − 6 = 3 are irreducible.'
    ],
    answer: 'Yes, it is irreducible (1), and Z₃ has 3 monic irreducible quadratics.'
   },
   pitfalls: [
    'Using the no-root test on degree 4 or more: (x² + 1)² has no root over Z₃ but is not irreducible.',
    'Counting (x − r)(x − s) and (x − s)(x − r) as two different polynomials.',
    'Forgetting the squares (x − r)², which are not irreducible either.'
   ]
  },
  guidance: [
   { prompt: 'The values of f(x) mod 5 for x = 0 to 4 are 1, 3, 2, 3 and 1. Is f irreducible? Enter 1 for yes, 0 for no.', answer: [1], labels: ['irreducible (1 or 0)'], explanation: 'No value is 0, so there is no root and no linear factor: irreducible.' },
   { prompt: 'How many monic quadratics (x − r)(x − s) can be made with r and s from 0 to 4, counting (x − r)(x − s) and (x − s)(x − r) once?', answer: [15], labels: ['reducible quadratics'], explanation: '5 with r = s, and 5 × 4 ÷ 2 = 10 with r ≠ s: 15 in all.' },
   { prompt: 'There are 25 monic quadratics. How many are irreducible?', answer: [10], labels: ['irreducible quadratics'], explanation: '25 − 15 = 10.' }
  ]
 },
 {
  id: 'q40', title: 'The vault door field', topic: 'Finite fields', tier: 'Advanced', sector: 'Cipher Vault',
  brief: 'The main vault door gets the strongest cipher yet, built on a finite field, and Mira wants its sizes worked out before the door is sealed.',
  lesson: 'Every finite field has pᵏ elements for some prime p, and its pᵏ − 1 non-zero elements form a cyclic group under multiplication.',
  prompt: 'The vault’s strongest cipher runs in the finite field GF(3⁴). Enter how many elements the field has, then the order of its multiplication group (the non-zero elements under ×), then how many generators that cyclic group has.',
  answer: [81, 80, 32], labels: ['elements', 'group order', 'generators'], tolerance: 0.01,
  hints: [
   'GF(pᵏ) has exactly pᵏ elements, and every element except 0 has an inverse under ×, so the non-zero ones form a group.',
   'That group is cyclic. A cyclic group of order m has one generator for each number from 1 to m that is coprime to m: m × (1 − 1 ÷ r) for each prime r dividing m.'
  ],
  solution: 'GF(3⁴) has 3⁴ = 81 elements. Leaving out 0, the multiplication group has order 81 − 1 = 80, and it is cyclic. 80 = 2⁴ × 5, so 80 × (1 − 1 ÷ 2) × (1 − 1 ÷ 5) = 32 of the numbers from 1 to 80 are coprime to 80, and the group has 32 generators.',
  xp: 200, prereqs: ['q39', 'q09'],
  artifact: { name: 'Vault door cipher', description: 'A finite field and the generators of its multiplication group, sealed into the door.' },
  sources: [source.s22_1],
  teaching: {
   intuition: 'A finite field is a field with finitely many elements. Zₚ is one, with p elements, but there are more. An irreducible polynomial of degree k over Zₚ can be used to build a field whose elements are the remainders on dividing by it: the polynomials of degree below k with coefficients in Zₚ, and there are pᵏ of them. In fact every finite field has a prime power pᵏ of elements, and for every prime power there is a field of exactly that size, the Galois field GF(pᵏ); all fields of one size are isomorphic. The non-zero elements of GF(pᵏ), all pᵏ − 1 of them, form a group under multiplication, because each one has an inverse, and that group is always cyclic. A cyclic group of order m has one generator for each number from 1 to m that is coprime to m. To count those numbers, start from m and remove the multiples of each prime r dividing m in turn: one number in every r is a multiple of r, so the count is m × (1 − 1 ÷ r) for each different prime r dividing m. Number theory calls this count Euler’s φ(m), and that is where these ideas go next.',
   steps: [
    'Work out the number of elements, pᵏ.',
    'Subtract 1 for the multiplication group: its order is m = pᵏ − 1.',
    'Write m as a product of primes.',
    'Multiply m by (1 − 1 ÷ r) for each different prime r dividing m. That is the number of generators.'
   ],
   example: {
    prompt: 'How many elements does GF(2³) have, what is the order of its multiplication group, and how many generators does that group have?',
    steps: [
     '2³ = 8 elements.',
     'The non-zero ones form a group of order 8 − 1 = 7.',
     '7 is prime, so there are 7 × (1 − 1 ÷ 7) = 6 generators: every element except 1.'
    ],
    answer: '8 elements, a group of order 7, and 6 generators.'
   },
   pitfalls: [
    'Leaving 0 in the multiplication group. 0 has no inverse, so the group has pᵏ − 1 elements.',
    'Taking GF(pᵏ) to be the numbers mod pᵏ. The numbers mod 9 have zero divisors (3 × 3 = 0), but GF(3²) is a field.',
    'Using a prime factor once for every time it repeats. For 2² × 7 the factors are (1 − 1 ÷ 2) and (1 − 1 ÷ 7), once each.'
   ]
  },
  guidance: [
   { prompt: 'How many elements does GF(3⁴) have?', answer: [81], labels: ['elements'], explanation: '3⁴ = 81.' },
   { prompt: 'Leave out 0. What is the order of the multiplication group?', answer: [80], labels: ['group order'], explanation: '81 − 1 = 80: every non-zero element has an inverse, so they form a group.' },
   { prompt: '80 = 2⁴ × 5. How many numbers from 1 to 80 are coprime to 80: how many generators does the cyclic group have?', answer: [32], labels: ['generators'], explanation: '80 × (1 − 1 ÷ 2) × (1 − 1 ÷ 5) = 32. Each such number a makes gᵃ a generator, where g is any one generator.' }
  ]
 }
);
})();
