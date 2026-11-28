/* Discrete mathematics missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/disc/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Recurrences and generating functions · Advanced, 200 XP · sector 'Tiling Works' · The characteristic root technique [Levin 2.4]
     q32  ch 6 Recurrences and generating functions · Advanced, 200 XP · sector 'Tiling Works' · Counting with recurrences: tilings and spaced-out bit strings [Levin 2.4]
     q33  ch 6 Recurrences and generating functions · Advanced, 200 XP · sector 'Tiling Works' · Generating functions: reading off a coefficient [Levin 5.1]
     q34  ch 6 Recurrences and generating functions · Advanced, 200 XP · sector 'Tiling Works' · Counting one thing two ways [Levin 1.4]
     q35  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Divisibility, quotients and remainders [Levin 5.2]
     q36  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Clock arithmetic: mod and congruence [Levin 5.2]
     q37  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Graphs, degrees and the handshake lemma [Levin 4.1]
     q38  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Trees: v − 1 edges [Levin 4.2]
     q39  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Euler paths and circuits [Levin 4.5]
     q40  ch 7 First steps into numbers and networks · Advanced, 200 XP · sector 'Road Office' · Realm review and bridge to Number theory and Graph theory [Levin 5.2, 4.5] */
(function(){
'use strict';
/* Oscar Levin, Discrete Mathematics: An Open Introduction (3rd edition); OpenStax Contemporary Mathematics, chapter 1 Sets sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Levin/ (Levin and OpenStax).
   A title reads like: Levin, Discrete Mathematics: An Open Introduction — 1.3 Combinations and Permutations
   Link to the section page itself: https://discrete.openmathbooks.org/dmoi3/<page>.html */
const source = {
 s1_4: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.4 Combinatorial Proofs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_comb-proofs.html', description: 'Proving binomial identities by counting one set in two ways, including Pascal’s rule and the sum of a row.', verified: '2026-11-27' },
 s2_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.1 Describing Sequences', url: 'https://discrete.openmathbooks.org/dmoi3/sec_seq_intro.html', description: 'Describing sequences by closed and recursive formulas, including a recurrence for the ways to tile a strip with squares and dominoes.', verified: '2026-11-27' },
 s2_4: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.4 Solving Recurrence Relations', url: 'https://discrete.openmathbooks.org/dmoi3/sec_recurrence.html', description: 'Solving recurrences by iteration and by the characteristic root technique.', verified: '2026-11-27' },
 s4_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 4.1 Definitions', url: 'https://discrete.openmathbooks.org/dmoi3/sec_gt-intro.html', description: 'Graphs, vertices, edges, degrees and the handshake lemma.', verified: '2026-11-27' },
 s4_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 4.2 Trees', url: 'https://discrete.openmathbooks.org/dmoi3/sec_trees.html', description: 'Trees as connected graphs with no cycles, leaves, and why a tree on v vertices has v − 1 edges.', verified: '2026-11-27' },
 s4_5: { title: 'Levin, Discrete Mathematics: An Open Introduction — 4.5 Euler Paths and Circuits', url: 'https://discrete.openmathbooks.org/dmoi3/sec_paths.html', description: 'When a graph has an Euler path or an Euler circuit, decided by its odd-degree vertices.', verified: '2026-11-27' },
 s5_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 5.1 Generating Functions', url: 'https://discrete.openmathbooks.org/dmoi3/sec_addtops-genfun.html', description: 'Generating functions as power series whose coefficients count, and products of them for counting problems.', verified: '2026-11-27' },
 s5_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 5.2 Introduction to Number Theory', url: 'https://discrete.openmathbooks.org/dmoi3/sec_addtops-numbth.html', description: 'Divisibility, the division algorithm with quotient and remainder, and congruence mod n.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'Jumping ahead in the pattern log', topic: 'The characteristic root technique', tier: 'Advanced', sector: 'Tiling Works',
  brief: 'The pattern counter only knows how to step forward one term at a time, and Mira needs a term far down the list without stepping all the way there.',
  lesson: 'For aₙ = c × aₙ₋₁ + d × aₙ₋₂, solve x² = cx + d. With roots r and s, aₙ = A × rⁿ + B × sⁿ, where A and B are fixed by the initial conditions.',
  prompt: 'The pattern counter in the Tiling Works follows the rule aₙ = 3aₙ₋₁ − 2aₙ₋₂, with initial conditions a₀ = 5 and a₁ = 8. Its characteristic equation has two roots, and each is a whole number or a negative whole number. Enter the larger root, then the smaller root, then a₁₂ (type it without commas).',
  answer: [2, 1, 12290], labels: ['larger root', 'smaller root', 'a₁₂'], tolerance: 0.01,
  hints: [
   'Replace aₙ by x², aₙ₋₁ by x and aₙ₋₂ by 1 to get the characteristic equation. Move every term to one side and factor it.',
   'With roots r and s, the closed formula is aₙ = A × rⁿ + B × sⁿ. Put n = 0 and n = 1 into it and match the initial conditions to find A and B.'
  ],
  solution: 'The characteristic equation is x² = 3x − 2, that is x² − 3x + 2 = 0, which factors as (x − 2)(x − 1) = 0. The roots are 2 and 1, so aₙ = A × 2ⁿ + B × 1ⁿ. Putting in n = 0 gives A + B = 5, and n = 1 gives 2A + B = 8. Subtracting the first equation from the second removes B: A = 8 − 5 = 3. Then B = 5 − 3 = 2. So aₙ = 3 × 2ⁿ + 2 × 1ⁿ, and a₁₂ = 3 × 2¹² + 2 × 1¹² = 3 × 4096 + 2 × 1 = 12290.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'Root finder card', description: 'A recurrence turned into a quadratic, and the quadratic into a closed formula.' },
  sources: [source.s2_4],
  teaching: {
   intuition: 'A recurrence relation such as aₙ = 5aₙ₋₁ − 6aₙ₋₂ tells you each term from the two before it, so finding a far-off term means stepping through every one in between. The characteristic root technique finds a closed formula instead. The trick is to try a geometric sequence, aₙ = xⁿ, where every term is the one before times the same ratio x. Putting it into the rule gives xⁿ = 5xⁿ⁻¹ − 6xⁿ⁻²; dividing every term by xⁿ⁻² leaves x² = 5x − 6. That quadratic is the characteristic equation, and its solutions are the characteristic roots. Each root r gives a sequence rⁿ that obeys the rule, and so does any mix A × rⁿ + B × sⁿ of the two. The two initial conditions then pick the one mix that starts with the right two terms.',
   steps: [
    'Write the characteristic equation: for aₙ = c × aₙ₋₁ + d × aₙ₋₂ it is x² = cx + d. Move every term to one side: x² − cx − d = 0.',
    'Factor the quadratic, as in Foundations, to find its two roots r and s.',
    'Write aₙ = A × rⁿ + B × sⁿ. Put in n = 0 (every power is 1) and n = 1 and match the initial conditions a₀ and a₁. Solve the two equations for A and B.',
    'Put the wanted n into the closed formula. A negative root raised to an even power is positive.'
   ],
   example: {
    prompt: 'A sequence has aₙ = aₙ₋₁ + 6aₙ₋₂ with a₀ = 2 and a₁ = 1. Find a closed formula and a₄.',
    steps: [
     'The characteristic equation is x² = x + 6, that is x² − x − 6 = 0, which factors as (x − 3)(x + 2) = 0. The roots are 3 and −2.',
     'So aₙ = A × 3ⁿ + B × (−2)ⁿ. At n = 0: A + B = 2. At n = 1: 3A − 2B = 1. Doubling the first gives 2A + 2B = 4; adding it to the second gives 5A = 5, so A = 1 and B = 1.',
     'aₙ = 3ⁿ + (−2)ⁿ, so a₄ = 81 + 16 = 97. Stepping through the rule agrees: a₂ = 13, a₃ = 19, a₄ = 19 + 6 × 13 = 97.'
    ],
    answer: 'aₙ = 3ⁿ + (−2)ⁿ, and a₄ = 97.'
   },
   pitfalls: [
    'Slipping a sign when moving terms across: x² = 5x − 6 becomes x² − 5x + 6 = 0, not x² + 5x − 6 = 0.',
    'Matching a₁ at n = 0. The condition a₀ goes with n = 0, where every power rⁿ is 1, so it gives A + B.',
    'Forgetting that a negative root to an even power is positive: (−2)¹² is 4096, not −4096.'
   ]
  },
  guidance: [
   { prompt: 'The characteristic equation of aₙ = 3aₙ₋₁ − 2aₙ₋₂ is x² − 3x + 2 = 0. Factor it. What are its two roots, larger first?', answer: [2, 1], labels: ['larger root', 'smaller root'], explanation: 'x² − 3x + 2 = 0 factors as (x − 2)(x − 1) = 0, so the roots are 2 and 1.' },
   { prompt: 'So aₙ = A × 2ⁿ + B × 1ⁿ. Putting in n = 0 and n = 1 gives A + B = 5 and 2A + B = 8. What are A and B?', answer: [3, 2], labels: ['A', 'B'], explanation: 'Subtracting the first equation from the second removes B: A = 8 − 5 = 3. Then B = 5 − 3 = 2.' },
   { prompt: 'Now aₙ = 3 × 2ⁿ + 2 × 1ⁿ. What is a₁₂? Use 2¹² = 4096 and 1¹² = 1.', answer: [12290], labels: ['a₁₂'], explanation: 'a₁₂ = 3 × 2¹² + 2 × 1¹² = 3 × 4096 + 2 × 1 = 12290. Stepping through the rule twelve times gives the same number.' }
  ]
 },
 {
  id: 'q32', title: 'Laying the long strips', topic: 'Counting with recurrences: tilings and spaced-out bit strings', tier: 'Advanced', sector: 'Tiling Works',
  brief: 'The Tiling Works wants to know how many different patterns its strip layers can make, and the code room wants a count of its spaced-out codes.',
  lesson: 'Sort the patterns by their last piece. Each kind of last piece leaves a shorter pattern, so the count is a sum of shorter counts: a recurrence relation.',
  prompt: 'The Tiling Works lays strips 1 unit wide. A strip 9 units long is to be covered end to end with tiles 1 unit long and tiles 2 units long. Enter the number of different tilings of the strip. Then enter the number of 6-bit strings in which no 1 sits next to another 1.',
  answer: [55, 21], labels: ['tilings of the strip', 'good bit strings'], tolerance: 0.01,
  hints: [
   'Look at the last tile of the strip: it is 1 long or 2 long, and taking it away leaves a shorter strip. So tₙ = tₙ₋₁ + tₙ₋₂, starting from t₀ = 1 for the empty strip.',
   'A good bit string ends in 0 or in 01, and taking that end away leaves a shorter good string. So bₘ = bₘ₋₁ + bₘ₋₂, with b₁ = 2 and b₂ = 3.'
  ],
  solution: 'Let tₙ be the number of tilings of a strip n long. Its last tile is 1 long or 2 long, so tₙ = tₙ₋₁ + tₙ₋₂. Starting from t₀ = 1 (the empty strip) and t₁ = 1, the counts for lengths 0 to 9 are 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, so the strip has 55 tilings. For the bit strings, bₘ = bₘ₋₁ + bₘ₋₂ with b₁ = 2 and b₂ = 3 gives 2, 3, 5, 8, 13, 21 for lengths 1 to 6, so there are 21 good strings of length 6.',
  xp: 200, prereqs: ['q28', 'q15'],
  artifact: { name: 'Strip tiling chart', description: 'Every tiling of the short strips, counted by the last tile laid.' },
  sources: [source.s2_1, source.s2_4],
  teaching: {
   intuition: 'A tiling of a strip is a way to cover it completely, end to end, with tiles of given lengths, without gaps or overlaps. Listing all tilings of a long strip is hopeless, but counting them is easy if you build the pattern one step at a time. Look at the last tile. If tiles are 1 long and 2 long, the last tile is one or the other. Take it away and what is left is a tiling of a strip 1 shorter or 2 shorter. So if tₙ is the number of tilings of a strip n long, tₙ = tₙ₋₁ + tₙ₋₂: the Fibonacci rule again. The empty strip counts as one tiling (lay nothing), so t₀ = 1. Bit strings in which no 1 sits next to another 1 work the same way: such a string ends in 0 or in 01, and taking that end away leaves a shorter good string.',
   steps: [
    'Name the count: tₙ is the number of patterns of size n.',
    'Sort the patterns by their last piece. Each kind of last piece, taken away, leaves a smaller pattern of the same sort, so tₙ is the sum of the counts for those smaller sizes.',
    'Find the first counts by hand: t₀ = 1 for the empty strip, and a strip shorter than the long tile has only one tiling.',
    'Add your way up the recurrence to the size you need.'
   ],
   example: {
    prompt: 'How many ways are there to tile a strip 5 long with tiles 1 long and 2 long?',
    steps: [
     'The last tile is 1 long or 2 long, so tₙ = tₙ₋₁ + tₙ₋₂, with t₀ = 1 and t₁ = 1.',
     'Adding up: t₂ = 2, t₃ = 3, t₄ = 5, t₅ = 8. As a check, the 3 tilings of a strip 3 long are 1 + 1 + 1, 1 + 2 and 2 + 1.'
    ],
    answer: '8 tilings.'
   },
   pitfalls: [
    'Starting with t₀ = 0. The empty strip has exactly one tiling, the one with no tiles, and without it t₂ comes out wrong.',
    'Using tₙ₋₂ when the long tile is 3 long. The step back is the length of the tile: tₙ = tₙ₋₁ + tₙ₋₃.',
    'Starting the bit strings at b₁ = 1. There are two 1-bit strings, 0 and 1, and both are good.'
   ]
  },
  guidance: [
   { prompt: 'Count short strips first. A strip shorter than 2 can only take 1-long tiles, so t₀ = 1 (the empty strip) and t₁ = 1; after that tₙ = tₙ₋₁ + tₙ₋₂. What are t₂, t₃ and t₄?', answer: [2, 3, 5], labels: ['first new count', 'second new count', 'third new count'], explanation: 't₂ = 1 + 1 = 2, t₃ = 2 + 1 = 3 and t₄ = 3 + 2 = 5.' },
   { prompt: 'Keep adding with tₙ = tₙ₋₁ + tₙ₋₂. What is t₉, the number of tilings of the strip 9 long?', answer: [55], labels: ['tilings of the strip'], explanation: 'The counts for lengths 0 to 9 are 1, 1, 2, 3, 5, 8, 13, 21, 34, 55. Each is the one before it plus the one 2 places before it.' },
   { prompt: 'For the bit strings, b₁ = 2 (0 and 1), b₂ = 3 (00, 01 and 10) and bₘ = bₘ₋₁ + bₘ₋₂. What is b₆?', answer: [21], labels: ['good bit strings'], explanation: 'The counts for lengths 1 to 6 are 2, 3, 5, 8, 13, 21: each is the sum of the two before it.' }
  ]
 },
 {
  id: 'q33', title: 'Paying at the token desk', topic: 'Generating functions: reading off a coefficient', tier: 'Advanced', sector: 'Tiling Works',
  brief: 'The pay desk at the Tiling Works takes tokens of three values, and Mira wants to know how many different handfuls make an exact price.',
  lesson: 'Each bracket lists the choices for one kind of item as powers of x. In the expanded product, the coefficient of xᵏ counts the ways the choices add up to k.',
  prompt: 'At the Tiling Works pay desk Mira has 4 one-credit tokens, 3 two-credit tokens and 2 five-credit tokens. Tokens of the same value are alike. The generating function for paying with them is (1 + x + x² + x³ + x⁴)(1 + x² + x⁴ + x⁶)(1 + x⁵ + x¹⁰). Enter the coefficient of x⁹: the number of ways to pay exactly 9 credits. Then enter the value of the product at x = 1.',
  answer: [4, 60], labels: ['coefficient of xᵏ', 'value at x = 1'], tolerance: 0.01,
  hints: [
   'Picking one term from each bracket is picking how many of each token to use, and the powers add up to the value paid. So the coefficient of xᵏ counts the picks whose values add up to k.',
   'Sort the picks by the number of five-credit tokens: none, one or two. For each, try every number of two-credit tokens and keep those that leave a number of one-credit tokens Mira really has.'
  ],
  solution: 'Write a choice as (fives, twos, ones). With no five-credit token the rest must make 9: (0, 3, 3), 1 way. With one five-credit token the rest must make 4: (1, 0, 4), (1, 1, 2), (1, 2, 0), 3 ways. With two five-credit tokens the value is already over 9: 0 ways. In all 1 + 3 + 0 = 4, so the coefficient of x⁹ is 4. At x = 1 every power of x is 1, so each bracket becomes its number of terms: 5 × 4 × 3 = 60, the number of ways to pick tokens with no target at all.',
  xp: 200, prereqs: ['q26', 'q16'],
  artifact: { name: 'Token ledger', description: 'Three brackets that count every handful of tokens by its value.' },
  sources: [source.s5_1],
  teaching: {
   intuition: 'When you multiply out brackets, every term of the answer comes from picking one term in each bracket and multiplying them, and powers multiply by adding their exponents: x² × x⁵ = x⁷. That is exactly how a handful of tokens works. Give the choices for each kind of token their own bracket: 1 + x + x² means "no one-credit token, one, or two", and 1 + x⁵ + x¹⁰ means "no five-credit token, one, or two", the power being the value they add. A pick from each bracket is one handful, and its power of x is the handful’s total value. So when the product is expanded and like terms are collected, the coefficient of xᵏ (the number in front of it) is the number of handfuls worth exactly k. A sum like this, whose coefficients are the counts you want, is a generating function. The binomial theorem was one already: (1 + x)ⁿ has C(n, k) in front of xᵏ.',
   steps: [
    'Write one bracket for each kind of item: 1 + xᵛ + x²ᵛ + … for items worth v each, up to the number available. The 1 is the choice of using none.',
    'The wanted count is the coefficient of xᵏ in the product of the brackets.',
    'To find it without expanding everything, sort the picks by the item with the biggest value, and count the ways the other brackets make up the rest.',
    'Putting x = 1 turns every term into 1, so the product at x = 1 is the total number of picks: the product of the numbers of terms in the brackets.'
   ],
   example: {
    prompt: 'Find the coefficient of x³ in (1 + x + x² + x³)(1 + x²), and the value of the product at x = 1.',
    steps: [
     'A pick is a number of one-credit tokens (0 to 3) and of two-credit tokens (0 or 1), and the powers must add up to 3.',
     'With no two-credit token, three ones: one way. With one two-credit token, one one: one way. So the coefficient is 2.',
     'At x = 1 the brackets are 4 and 2, so the product is 8: there are 8 handfuls in all.'
    ],
    answer: 'The coefficient of x³ is 2, and the product at x = 1 is 8.'
   },
   pitfalls: [
    'Counting tokens of the same value as different. Two alike one-credit tokens give one handful worth 2, not two.',
    'Leaving out the 1 in a bracket. Using none of a kind is a choice too, and it is the 1.',
    'Multiplying the exponents of a pick instead of adding them. Values add, so powers add.'
   ]
  },
  guidance: [
   { prompt: 'How many choices use no five-credit token, so that the one- and two-credit tokens make 9 by themselves?', answer: [1], labels: ['ways with no five'], explanation: 'Write a choice as (fives, twos, ones). The ones must be from 0 to 4: (0, 3, 3).' },
   { prompt: 'How many use exactly one five-credit token? Then the other tokens must make 9 − 5.', answer: [3], labels: ['ways with one five'], explanation: 'Write a choice as (fives, twos, ones). The ones must be from 0 to 4: (1, 0, 4), (1, 1, 2), (1, 2, 0).' },
   { prompt: 'How many use both five-credit tokens? Then the other tokens must make 9 − 10.', answer: [0], labels: ['ways with two fives'], explanation: '9 − 10 is below 0, so no choice works.' },
   { prompt: 'Put x = 1 into (1 + x + x² + x³ + x⁴)(1 + x² + x⁴ + x⁶)(1 + x⁵ + x¹⁰). What number do you get?', answer: [60], labels: ['value at x = 1'], explanation: 'Every term becomes 1, so the brackets become 5, 4 and 3, and 5 × 4 × 3 = 60.' }
  ]
 },
 {
  id: 'q34', title: 'Checking the crew ledger twice', topic: 'Counting one thing two ways', tier: 'Advanced', sector: 'Tiling Works',
  brief: 'Mira wants the crew ledger checked by a second, independent count before she signs it.',
  lesson: 'Count the same set in two different ways. Both counts are right, so they are equal, and that proves an identity, such as C(n, k) = C(n − 1, k − 1) + C(n − 1, k).',
  prompt: 'The Tiling Works needs a crew of 4 from its 9 tilers, and Mira checks the ledger by counting the crews two ways. One of the tilers is Oskar, the foreman. Enter the number of crews that include Oskar, then the number that leave him out, then the number of all crews of 4 counted directly as C(9, 4).',
  answer: [56, 70, 126], labels: ['crews with Oskar', 'crews without Oskar', 'all crews'], tolerance: 0.01,
  hints: [
   'If Oskar is in the crew, he fills one place, and only the other places are left to fill from the other tilers.',
   'If Oskar is left out, the whole crew comes from the other tilers. The two cases never overlap and between them cover every crew, so their counts add up to the direct count.'
  ],
  solution: 'Crews with Oskar: he takes one place, and the other 3 come from the other 8 tilers, so there are C(8, 3) = 56. Crews without him: all 4 come from the other 8, so there are C(8, 4) = 70. Directly, C(9, 4) = 9! ÷ (4! × 5!) = 126. Both ways count the same crews, and 56 + 70 = 126: the identity C(n, k) = C(n − 1, k − 1) + C(n − 1, k) at n = 9 and k = 4.',
  xp: 200, prereqs: ['q15'],
  artifact: { name: 'Second-count stamp', description: 'The mark Mira puts on a ledger page once two different counts agree.' },
  sources: [source.s1_4],
  teaching: {
   intuition: 'If two honest counts of the same collection give two formulas, the formulas must be equal. Proving an identity that way is called a combinatorial proof, and it explains why the identity is true, not just that it is. Take the crews of k chosen from n people, of which there are C(n, k). Now count them again by asking about one particular person. Either that person is in the crew, and the other k − 1 places come from the other n − 1 people, in C(n − 1, k − 1) ways; or the person is left out, and all k come from the other n − 1, in C(n − 1, k) ways. Every crew is in exactly one of the two cases, so C(n, k) = C(n − 1, k − 1) + C(n − 1, k). That is the rule that builds Pascal’s triangle: each entry is the sum of the two above it.',
   steps: [
    'Say clearly what set you are counting, such as the crews of k from n.',
    'Count it once directly, with a formula you know.',
    'Count it again by splitting it into cases that do not overlap and between them cover everything, and add the cases.',
    'The two counts are equal. At any numbers, the two sides of the identity give the same value.'
   ],
   example: {
    prompt: 'Count the crews of 3 from 6 people two ways, splitting on whether Ana is in the crew.',
    steps: [
     'With Ana: the other 2 places come from 5 people, C(5, 2) = 10. Without Ana: all 3 come from 5, C(5, 3) = 10.',
     'Directly: C(6, 3) = 6! ÷ (3! × 3!) = 20, and 10 + 10 = 20, as the identity says.'
    ],
    answer: '10 crews with Ana, 10 without, 20 in all.'
   },
   pitfalls: [
    'Choosing k more people when the named person is already in. Only k − 1 places are left.',
    'Choosing from all n people in the cases. The named person has been decided, so the choice is from the other n − 1.',
    'Splitting into cases that overlap or miss some crews. The cases must cover every crew exactly once for the counts to add.'
   ]
  },
  guidance: [
   { prompt: 'Oskar is in the crew. The other 3 places are filled from the other 8 tilers. How many crews is that?', answer: [56], labels: ['crews with Oskar'], explanation: 'C(8, 3) = 8! ÷ (3! × 5!) = 56.' },
   { prompt: 'Oskar is left out. All 4 places are filled from the other 8 tilers. How many crews is that?', answer: [70], labels: ['crews without Oskar'], explanation: 'C(8, 4) = 8! ÷ (4! × 4!) = 70.' },
   { prompt: 'Now count all crews of 4 from 9 at once. What is C(9, 4)?', answer: [126], labels: ['all crews'], explanation: 'C(9, 4) = 126, the same as 56 + 70: two honest counts of one set of crews always agree.' }
  ]
 },
 {
  id: 'q35', title: 'Reading the beacon timer', topic: 'Divisibility, quotients and remainders', tier: 'Advanced', sector: 'Road Office',
  brief: 'The Road Office beacon logs every event by its round and its seconds into the round, and two readings, one from before the clock was set, need logging.',
  lesson: 'Dividing a by a positive b gives a quotient q and a remainder r with a = b × q + r and r from 0 to b − 1. When r is 0, b divides a.',
  prompt: 'The Road Office beacon runs on a timer that starts a new round every 7 seconds. A clock reading t is logged as t = 7 × quotient + remainder, where the quotient is the round and the remainder, from 0 to 6, is the seconds into it. A signal came at t = 100, and a fault began at t = −45, before the clock was set. Enter the quotient and the remainder for 100, then the quotient and the remainder for −45.',
  answer: [14, 2, -7, 4], labels: ['quotient for the signal', 'remainder for the signal', 'quotient for the fault', 'remainder for the fault'], tolerance: 0.01,
  hints: [
   'For a positive reading, the quotient is how many whole 7s fit into it, and the remainder is what is left over.',
   'For a negative reading, step down to the first multiple of 7 at or below it, so that the remainder is still from 0 to 6. The quotient is then negative, but the remainder is not.'
  ],
  solution: '100 = 7 × 14 + 2, with 2 from 0 to 6, so the quotient is 14 and the remainder is 2. For −45, the first multiple of 7 at or below it is 7 × (−7) = −49, and −45 − (−49) = 4. So −45 = 7 × (−7) + 4: the quotient is −7 and the remainder is 4. The quotient −6 would leave −3, and a remainder is never negative.',
  xp: 200, prereqs: ['q01'],
  artifact: { name: 'Beacon round counter', description: 'A dial that turns any reading into its round and its seconds into the round.' },
  sources: [source.s5_2],
  teaching: {
   intuition: 'Packing 23 crates into boxes of 5 gives 4 full boxes and 3 crates over: 23 = 5 × 4 + 3. The 4 is the quotient and the 3 is the remainder. The rule that pins them down is that the remainder must be at least 0 and less than the number you divide by, so 23 = 5 × 3 + 8 does not count: 8 crates would fill another box. When the remainder is 0, as in 35 = 5 × 7 + 0, we say 5 divides 35. The same rule works for negative numbers, and it is where people slip. For −23, the remainder still has to be from 0 to 4, so we step down to the first multiple of 5 at or below −23, which is −25 = 5 × (−5). Then −23 = 5 × (−5) + 2: the quotient is −5 and the remainder is 2. A timer that repeats makes the sense of this clear: 23 seconds before the start is 2 seconds into the round that began 25 seconds before the start.',
   steps: [
    'For a divided by b (b positive), find the largest multiple of b that is at or below a. Call it b × q.',
    'The quotient is q. For a negative a, q is negative.',
    'The remainder is r = a − b × q. Check that r is from 0 to b − 1.',
    'Write the answer as a = b × q + r. If r is 0, b divides a.'
   ],
   example: {
    prompt: 'Find the quotient and the remainder when 23 is divided by 5, and when −23 is divided by 5.',
    steps: [
     '5 × 4 = 20 is the largest multiple of 5 at or below 23, and 23 − 20 = 3, so 23 = 5 × 4 + 3.',
     'For −23, the first multiple of 5 at or below it is 5 × (−5) = −25, and −23 − (−25) = 2, so −23 = 5 × (−5) + 2.'
    ],
    answer: 'Quotient 4 and remainder 3; then quotient −5 and remainder 2.'
   },
   pitfalls: [
    'Giving −23 the quotient −4 and the remainder −3. A remainder is never negative: step down to −25, not up to −20.',
    'Leaving a remainder as big as the divisor or bigger. If it is, another whole b still fits.',
    'Mixing up the order: the quotient is the number of whole b’s, and the remainder is what is left.'
   ]
  },
  guidance: [
   { prompt: 'How many whole 7s fit into 100, and how much is left over?', answer: [14, 2], labels: ['quotient', 'remainder'], explanation: '7 × 14 = 98, and 100 − 98 = 2, so 100 = 7 × 14 + 2.' },
   { prompt: 'Which multiple of 7 is the first one at or below −45?', answer: [-49], labels: ['multiple at or below'], explanation: '7 × (−6) = −42 is above −45, and 7 × (−7) = −49 is the first multiple at or below it.' },
   { prompt: 'So −45 = 7 × quotient + remainder with the remainder from 0 to 6. What are the quotient and the remainder?', answer: [-7, 4], labels: ['quotient', 'remainder'], explanation: '−45 − (−49) = 4, so −45 = 7 × (−7) + 4.' }
  ]
 },
 {
  id: 'q36', title: 'Stamping the convoy permits', topic: 'Clock arithmetic: mod and congruence', tier: 'Advanced', sector: 'Road Office',
  brief: 'Every permit the Road Office issues carries a short check number, and the convoy rota needs the weekday of a departure far ahead.',
  lesson: 'a mod m is the remainder of a on division by m. Two numbers are congruent mod m, written a ≡ b (mod m), when they leave the same remainder, and congruent numbers can stand in for each other in sums and products.',
  prompt: 'The Road Office stamps each permit with a check number: the remainder of 38 × 47 + 15 on division by 9, written (38 × 47 + 15) mod 9. Enter that check number. Then: today is Wednesday, and the next convoy leaves in 100 days. With the days coded 0 for Monday, 1 for Tuesday, 2 for Wednesday, 3 for Thursday, 4 for Friday, 5 for Saturday and 6 for Sunday, enter the code of the day the convoy leaves.',
  answer: [1, 4], labels: ['check number', 'day code'], tolerance: 0.01,
  hints: [
   'Replace each number by its remainder first. Numbers that are congruent mod m give congruent results in sums and products, so the small numbers give the same check number.',
   'The weekday comes round again every 7 days, so only the number of days mod 7 matters. Add it to today’s code, and take mod 7 again if the sum reaches 7.'
  ],
  solution: '38 mod 9 = 2 and 47 mod 9 = 2, so 38 × 47 + 15 ≡ 2 × 2 + 15 = 19 ≡ 1 (mod 9). As a check, 38 × 47 + 15 = 1801 = 9 × 200 + 1. The check number is 1. Today is Wednesday, code 2. 100 = 7 × 14 + 2, so the weekday moves on by 2: 2 + 2 = 4, which is Friday, code 4.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Permit stamp', description: 'A small wheel that prints the remainder of a long calculation.' },
  sources: [source.s5_2],
  teaching: {
   intuition: 'A clock face forgets whole turns. Nine hours after 8 o’clock is 5 o’clock, because 8 + 9 = 17 and the 12 hours of a full turn drop out. That is arithmetic mod 12. In general, a mod m means the remainder of a on division by m, so 17 mod 12 = 5. Two numbers are congruent mod m, written a ≡ b (mod m), when they leave the same remainder; 17 ≡ 5 (mod 12). The useful fact is that congruent numbers can stand in for each other when you add and multiply: to find a big product mod m, replace each factor by its remainder first, then multiply the small numbers, then take mod m again. Weekdays are the same with m = 7: every 7 days the weekday comes round again, so only the number of days mod 7 matters.',
   steps: [
    'Replace each number by its remainder mod m.',
    'Do the sums and products with the small numbers.',
    'Take mod m of the result, so the answer is from 0 to m − 1.',
    'For weekdays, number them 0 to 6, add the number of days mod 7 to today’s number, and take mod 7 again.'
   ],
   example: {
    prompt: 'Find (23 × 19 + 4) mod 5. Then, with Monday as 0 and Sunday as 6, which day is 30 days after a Saturday?',
    steps: [
     '23 ≡ 3 and 19 ≡ 4 (mod 5), so 23 × 19 + 4 ≡ 3 × 4 + 4 = 16 ≡ 1 (mod 5). The long way agrees: 23 × 19 + 4 = 441 = 5 × 88 + 1.',
     'Saturday is 5, and 30 ≡ 2 (mod 7). 5 + 2 = 7 ≡ 0 (mod 7), which is Monday.'
    ],
    answer: '1, and Monday (code 0).'
   },
   pitfalls: [
    'Stopping before the last mod: 16 is congruent to 1 mod 5, but 16 is not a remainder, because a remainder is less than 5.',
    'Counting today as the first of the days. Thirty days after Saturday means adding 30 to Saturday, not 29.',
    'Taking the quotient for a mod m. The mod is the remainder, the part left over.'
   ]
  },
  guidance: [
   { prompt: 'What are 38 mod 9 and 47 mod 9?', answer: [2, 2], labels: ['first remainder', 'second remainder'], explanation: '38 = 9 × 4 + 2 and 47 = 9 × 5 + 2.' },
   { prompt: 'Now work out (2 × 2 + 15) mod 9.', answer: [1], labels: ['check number'], explanation: '2 × 2 + 15 = 19, and 19 = 9 × 2 + 1, so the check number is 1.' },
   { prompt: 'What is 100 mod 7?', answer: [2], labels: ['days mod 7'], explanation: '100 = 7 × 14 + 2. The 14 whole weeks bring back the same weekday.' },
   { prompt: 'Today’s code is 2. Add 2 and take mod 7. What is the code of the convoy’s day?', answer: [4], labels: ['day code'], explanation: '2 + 2 = 4: Friday.' }
  ]
 },
 {
  id: 'q37', title: 'Counting the yard roads', topic: 'Graphs, degrees and the handshake lemma', tier: 'Advanced', sector: 'Road Office',
  brief: 'The Road Office has a list of how many roads meet at each junction, but nobody wrote down how many roads there are.',
  lesson: 'In a graph, the degree of a vertex is the number of edges that meet there, and the handshake lemma says the degrees add up to twice the number of edges.',
  prompt: 'The Road Office maps the depot roads as a graph: each junction is a vertex, and each road is an edge joining two junctions. The degree of a junction is the number of roads that meet there. In the east yard, junctions A to F have degrees 3, 2, 4, 1, 2 and 2. Enter the number of roads in the east yard. The west yard has 7 roads and 5 junctions, P to T; P, Q, R and S have degrees 3, 3, 2 and 2. Enter the degree of T.',
  answer: [7, 4], labels: ['roads in the east yard', 'missing degree'], tolerance: 0.01,
  hints: [
   'Every road has two ends, and each end adds 1 to the degree of a junction. So the degrees add up to twice the number of roads.',
   'In the west yard the degrees must add up to twice the number of roads. The degree of T is whatever the other junctions leave short of that total.'
  ],
  solution: 'East yard: the degrees add up to 3 + 2 + 4 + 1 + 2 + 2 = 14. By the handshake lemma that is twice the number of roads, so there are 14 ÷ 2 = 7 roads. West yard: 7 roads give a degree sum of 2 × 7 = 14. The other degrees add up to 10, so T has degree 14 − 10 = 4.',
  xp: 200, prereqs: ['q01'],
  artifact: { name: 'Junction tally sheet', description: 'One tick for every road end, and half as many roads.' },
  sources: [source.s4_1],
  teaching: {
   intuition: 'A graph, in discrete maths, is a set of points called vertices with some pairs of them joined by lines called edges. It is not the graph of a function: what matters is only which vertices are joined, not where they are drawn or how long the lines are. A road map is a graph, with junctions as vertices and roads as edges. The degree of a vertex is the number of edges that meet there. Add up all the degrees and something neat happens: every edge has two ends, and each end adds 1 to the degree of the vertex it touches, so every edge is counted exactly twice. That is the handshake lemma: the degrees add up to twice the number of edges. (At a party, the handshakes counted person by person come to twice the number of handshakes.) So the sum of the degrees is always even.',
   steps: [
    'Add up the degrees of all the vertices.',
    'By the handshake lemma, that sum is twice the number of edges.',
    'Halve it to get the number of edges; or, when the number of edges is known, double it to get the degree sum.',
    'A missing degree is the degree sum minus the degrees you know.'
   ],
   example: {
    prompt: 'Junctions have degrees 1, 3, 2, 2 and 4. How many roads are there?',
    steps: [
     'The degrees add up to 1 + 3 + 2 + 2 + 4 = 12.',
     'That is twice the number of roads, so there are 12 ÷ 2 = 6 roads.'
    ],
    answer: '6 roads.'
   },
   pitfalls: [
    'Forgetting to halve. Each road is counted once at each end.',
    'Counting a road only at one of its junctions when you work out a degree by hand.',
    'Accepting a degree list with an odd sum. No road map has one, so a mistake has crept in.'
   ]
  },
  guidance: [
   { prompt: 'What do the degrees in the east yard add up to?', answer: [14], labels: ['sum of degrees'], explanation: '3 + 2 + 4 + 1 + 2 + 2 = 14.' },
   { prompt: 'Each road adds 2 to that sum, one for each end. How many roads are in the east yard?', answer: [7], labels: ['roads in the east yard'], explanation: '14 ÷ 2 = 7. This is the handshake lemma: the degrees add up to twice the number of edges.' },
   { prompt: 'In the west yard, what must all 5 degrees add up to, and what do the degrees of P, Q, R and S add up to?', answer: [14, 10], labels: ['degree sum needed', 'known degrees'], explanation: '7 roads give 2 × 7 = 14. The known degrees give 3 + 3 + 2 + 2 = 10.' },
   { prompt: 'What is the degree of T?', answer: [4], labels: ['missing degree'], explanation: '14 − 10 = 4.' }
  ]
 },
 {
  id: 'q38', title: 'Linking the outer domes', topic: 'Trees: v − 1 edges', tier: 'Advanced', sector: 'Road Office',
  brief: 'Road building is expensive, so Mira wants the outer domes linked with as few roads as possible, and an old tangle of roads trimmed back.',
  lesson: 'A tree is a connected graph with no cycle, and a tree with v vertices always has exactly v − 1 edges.',
  prompt: 'Mira is planning roads for the outer domes. She wants to link 12 domes so that every dome can reach every other one, with no cycle: no route that leaves a dome and comes back to it without using a road twice. Enter the number of roads she needs. Next, an old network links 9 junctions with 14 roads and is connected. Enter the fewest roads to close so that what is left is a tree. Last, a tree in the plan has 5 junctions of degree 3, and every other junction has degree 1. Enter the number of junctions of degree 1.',
  answer: [11, 6, 7], labels: ['roads needed', 'roads to close', 'junctions of degree 1'], tolerance: 0.01,
  hints: [
   'A connected network with no cycle is a tree, and a tree with v vertices always has v − 1 edges. Closing roads to leave a tree keeps exactly that many.',
   'For the last tree, write L for the number of junctions of degree 1. It has 5 + L junctions and so 5 + L − 1 roads, and by the handshake lemma its degrees add up to twice the number of roads.'
  ],
  solution: 'A tree on 12 vertices has 12 − 1 = 11 edges, so Mira needs 11 roads. A tree on 9 junctions keeps 8 of the 14 roads, so 14 − 8 = 6 must close. For the last tree, with L leaves: 3 × 5 + L = 2 × (5 + L − 1), that is 15 + L = 8 + 2L, so L = 15 − 8 = 7.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Branching road plan', description: 'A road map with no loops, where every road is needed.' },
  sources: [source.s4_2],
  teaching: {
   intuition: 'A graph is connected when you can get from any vertex to any other along edges. A cycle is a route that leaves a vertex and comes back to it without using any edge twice. A connected graph with no cycle is called a tree, because drawn out it branches like one. Trees are the cheapest way to connect things: start from one dome, and each new road can only reach one new dome, so linking v domes takes v − 1 roads, never fewer and, with no cycle, never more. Every tree with v vertices has exactly v − 1 edges. A connected network with more roads than that has cycles, and closing one road on a cycle at a time, until v − 1 are left, leaves a tree that still connects everything. A vertex of degree 1 in a tree is a leaf: the end of a branch.',
   steps: [
    'Check that the network is connected; a tree must be.',
    'A tree on v vertices has v − 1 edges.',
    'To trim a connected network with e edges down to a tree, close e − (v − 1) edges, each one on a cycle.',
    'For degree questions about a tree, combine v − 1 edges with the handshake lemma: the degrees add up to 2 × (v − 1).'
   ],
   example: {
    prompt: 'A connected network has 6 junctions and 9 roads. How many roads must close so that what is left is a tree?',
    steps: [
     'A tree on 6 junctions has 6 − 1 = 5 roads.',
     'So 9 − 5 = 4 roads must close, each one taken from a cycle so nothing is cut off.'
    ],
    answer: '4 roads.'
   },
   pitfalls: [
    'Using v edges instead of v − 1. A tree has one edge fewer than it has vertices.',
    'Closing a road that is not on a cycle. That cuts the network in two, and it is no longer connected.',
    'Assuming the leaves are as many as the branch points. The handshake lemma, with v − 1 edges, decides how many leaves there are.'
   ]
  },
  guidance: [
   { prompt: 'A tree on 12 vertices has how many edges?', answer: [11], labels: ['roads needed'], explanation: '12 − 1 = 11. Start from one dome; each road then reaches one new dome, so 11 roads reach the other 11.' },
   { prompt: 'A tree on 9 junctions has how many roads, and how many of the 14 roads must close?', answer: [8, 6], labels: ['roads kept', 'roads to close'], explanation: 'The tree keeps 9 − 1 = 8 roads, so 14 − 8 = 6 close. Each one closed breaks one cycle without cutting the network.' },
   { prompt: 'The degrees of the last tree add up to 3 × 5 + L, and the tree has 5 + L − 1 roads. Solve 3 × 5 + L = 2 × (5 + L − 1). What is L?', answer: [7], labels: ['junctions of degree 1'], explanation: '15 + L = 8 + 2L, so L = 15 − 8 = 7.' }
  ]
 },
 {
  id: 'q39', title: 'Planning the night patrol', topic: 'Euler paths and circuits', tier: 'Advanced', sector: 'Road Office',
  brief: 'The night patrol wants to inspect every road of the north yard once, without driving any road twice.',
  lesson: 'A connected graph has an Euler circuit when every vertex has even degree, and an Euler path but no circuit when exactly two vertices have odd degree.',
  prompt: 'The night patrol wants to drive along every road of the north yard exactly once. The yard is connected, with junctions A to F and these 8 roads: A–B, A–C, A–D, B–C, C–D, C–E, C–F and E–F. Enter the number of junctions of odd degree. Then enter 2 if the yard has an Euler circuit, 1 if it has an Euler path but no Euler circuit, or 0 if it has neither.',
  answer: [2, 1], labels: ['junctions of odd degree', 'Euler code'], tolerance: 0.01,
  hints: [
   'Count the roads that meet at each junction to get its degree, then count how many of the six degrees are odd.',
   'A connected graph has an Euler circuit when every degree is even, an Euler path but no circuit when exactly two degrees are odd, and neither when more than two are odd.'
  ],
  solution: 'The degrees are A 3, B 2, C 5, D 2, E 2, F 2. The odd ones are A and C, 2 in all. Exactly two are odd, so there is an Euler path from A to C but no Euler circuit: code 1.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Patrol route card', description: 'A route that uses every road of the yard exactly once.' },
  sources: [source.s4_5],
  teaching: {
   intuition: 'An Euler path is a route through a graph that uses every edge exactly once. An Euler circuit is an Euler path that ends where it started. Whether one exists depends only on the degrees. Each time the patrol passes through a junction, it arrives on one road and leaves on another, using up two of the roads there. So at a junction where the route neither starts nor ends, the roads must pair up: the degree is even. Only the start and the end can have odd degree. That gives Euler’s rule for a connected graph: if every degree is even there is an Euler circuit; if exactly two degrees are odd there is an Euler path, starting at one odd vertex and ending at the other, but no circuit; and if more than two are odd there is neither. By the handshake lemma the number of odd degrees is always even, so exactly one odd vertex never happens.',
   steps: [
    'Check that the graph is connected.',
    'Work out the degree of every vertex by counting the edges that touch it.',
    'Count the vertices of odd degree.',
    'None odd: an Euler circuit. Exactly two: an Euler path between them, but no circuit. More than two: neither.'
   ],
   example: {
    prompt: 'Roads A–B, B–C, C–D, D–A and A–C. Is there an Euler circuit, an Euler path, or neither?',
    steps: [
     'Degrees: A 3, B 2, C 3, D 2. Two are odd, A and C.',
     'So there is an Euler path from A to C, such as A–B–C–D–A–C, but no Euler circuit.'
    ],
    answer: 'An Euler path but no circuit (code 1).'
   },
   pitfalls: [
    'Thinking two odd vertices still allow a circuit. A circuit needs every degree even.',
    'Counting a road at only one of its ends when working out degrees.',
    'Forgetting the graph must be connected: two separate pieces can never be covered by one route.'
   ]
  },
  guidance: [
   { prompt: 'Count the roads at each junction. What are the degrees of A, B and C?', answer: [3, 2, 5], labels: ['degree of A', 'degree of B', 'degree of C'], explanation: 'A 3, B 2, C 5: each road listed with that letter adds 1.' },
   { prompt: 'And the degrees of D, E and F?', answer: [2, 2, 2], labels: ['degree of D', 'degree of E', 'degree of F'], explanation: 'D 2, E 2, F 2. All six add up to 16, twice the 8 roads.' },
   { prompt: 'How many of the six degrees are odd?', answer: [2], labels: ['junctions of odd degree'], explanation: 'The odd ones are A and C: 2 in all. By the handshake lemma this count is always even.' },
   { prompt: 'Which code fits: 2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither?', answer: [1], labels: ['Euler code'], explanation: 'Exactly two are odd, so there is an Euler path from A to C but no Euler circuit: code 1.' }
  ]
 },
 {
  id: 'q40', title: 'Signing off the depot plan', topic: 'Realm review and bridge to Number theory and Graph theory', tier: 'Advanced', sector: 'Road Office',
  brief: 'The last page of the depot ledger is the road plan itself, and Mira wants its roads, its patrol route and its reflector posts settled before she signs.',
  lesson: 'One plan, three tools: the handshake lemma counts the edges, the odd degrees decide the Euler code, and division with remainder shares things out.',
  prompt: 'Mira’s final depot plan joins junctions A to G in one connected network. Their degrees, in order, are 2, 4, 3, 3, 2, 4 and 2. Before opening, 247 reflector posts are shared out equally among the roads, as many to each road as possible. Enter the number of roads, then the Euler code (2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither), then the number of posts left over.',
  answer: [10, 1, 7], labels: ['roads', 'Euler code', 'posts left over'], tolerance: 0.01,
  hints: [
   'The handshake lemma turns the list of degrees into the number of roads.',
   'Count the odd degrees to choose the Euler code. The posts left over are the remainder when the number of posts is divided by the number of roads.'
  ],
  solution: 'The degrees add up to 20, so there are 20 ÷ 2 = 10 roads. The odd degrees are at C and D, 2 in all. Exactly two are odd, so it has an Euler path from C to D but no circuit: code 1. 247 = 10 × 24 + 7, with 7 from 0 to 9, so each road gets 24 posts and 7 are left over.',
  xp: 200, prereqs: ['q36', 'q39'],
  artifact: { name: 'Signed depot ledger', description: 'The finished ledger of the Logistics Depot, every count in it exact.' },
  sources: [source.s5_2, source.s4_5],
  teaching: {
   intuition: 'This last mission puts the two threads of the Road Office together, and both carry on in later realms. Number theory grows out of division with remainders: a = b × q + r, with r from 0 to b − 1, and arithmetic mod m. Graph theory grows out of vertices, edges and degrees: the handshake lemma, trees with v − 1 edges, and Euler’s rule that the odd degrees decide whether a route can use every edge once. In one plan, a degree list gives the number of roads through the handshake lemma, the same list gives the Euler code through the odd degrees, and sharing things out among the roads is a division with remainder.',
   steps: [
    'Add the degrees and halve the sum to get the number of edges.',
    'Count the odd degrees. In a connected graph: none means an Euler circuit, two means an Euler path but no circuit, more means neither.',
    'To share N things equally among the edges, divide: N = edges × q + r. Each edge gets q, and r are left over.'
   ],
   example: {
    prompt: 'A connected plan has degrees 2, 3, 3, 2 and 2, and 50 posts are shared among its roads. Find the roads, the Euler code and the posts left over.',
    steps: [
     'The degrees add up to 12, so there are 6 roads.',
     'Two degrees are odd, so there is an Euler path but no circuit: code 1.',
     '50 = 6 × 8 + 2, so each road gets 8 posts and 2 are left over.'
    ],
    answer: '6 roads, code 1, and 2 posts left over.'
   },
   pitfalls: [
    'Dividing the posts by the degree sum instead of by the number of roads. Halve the sum first.',
    'Choosing code 2 when two degrees are odd. Two odd degrees give a path, not a circuit.',
    'Giving the quotient instead of the remainder for the posts left over.'
   ]
  },
  guidance: [
   { prompt: 'The degrees add up to 20. How many roads are there?', answer: [10], labels: ['roads'], explanation: 'By the handshake lemma, 20 ÷ 2 = 10.' },
   { prompt: 'How many of the degrees are odd?', answer: [2], labels: ['odd degrees'], explanation: 'The odd degrees are at C and D, 2 in all.' },
   { prompt: 'Which Euler code fits: 2, 1 or 0?', answer: [1], labels: ['Euler code'], explanation: 'The network is connected. Exactly two are odd, so it has an Euler path from C to D but no circuit: code 1.' },
   { prompt: 'Share 247 posts among 10 roads. What are the quotient and the remainder of 247 on division by 10?', answer: [24, 7], labels: ['posts each', 'posts left over'], explanation: '10 × 24 = 240, and 247 − 240 = 7.' }
  ]
 }
);
})();
