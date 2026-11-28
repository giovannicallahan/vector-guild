/* Discrete mathematics missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/disc/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Counting onto functions [Levin 1.6]
     q22  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Derangements [Levin 1.6]
     q23  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Chapter review: packing under rules [Levin 1.5, 1.6]
     q24  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Sequences: closed and recursive formulas [Levin 2.1]
     q25  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Arithmetic sequences and their sums [Levin 2.2]
     q26  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Geometric sequences and their sums [Levin 2.2]
     q27  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Finite differences and polynomial fitting [Levin 2.3]
     q28  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Recurrence relations and the Fibonacci numbers [Levin 2.1, 2.4]
     q29  ch 5 Sequences · Intermediate, 150 XP · sector 'Stock Yard' · Chapter review: forecasting stock [Levin 2.1–2.3]
     q30  ch 6 Recurrences and generating functions · Advanced, 200 XP · sector 'Tiling Works' · Solving a recurrence by iteration [Levin 2.4] */
(function(){
'use strict';
/* Oscar Levin, Discrete Mathematics: An Open Introduction (3rd edition); OpenStax Contemporary Mathematics, chapter 1 Sets sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Levin/ (Levin and OpenStax).
   A title reads like: Levin, Discrete Mathematics: An Open Introduction — 1.3 Combinations and Permutations
   Link to the section page itself: https://discrete.openmathbooks.org/dmoi3/<page>.html */
const source = {
 l1_5: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.5 Stars and Bars', url: 'https://discrete.openmathbooks.org/dmoi3/sec_stars-and-bars.html', description: 'Sharing identical objects among distinct recipients as rows of stars and bars, with and without a lower limit.', verified: '2026-11-27' },
 l1_6: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.6 Advanced Counting Using PIE', url: 'https://discrete.openmathbooks.org/dmoi3/sec_advPIE.html', description: 'Inclusion–exclusion for onto functions, derangements and stars and bars with upper limits.', verified: '2026-11-27' },
 l2_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.1 Describing Sequences', url: 'https://discrete.openmathbooks.org/dmoi3/sec_seq_intro.html', description: 'Sequences, their terms, closed formulas and recursive definitions.', verified: '2026-11-27' },
 l2_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.2 Arithmetic and Geometric Sequences', url: 'https://discrete.openmathbooks.org/dmoi3/sec_seq-arithgeom.html', description: 'Sequences with a common difference or a common ratio, and the sums of their first terms.', verified: '2026-11-27' },
 l2_3: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.3 Polynomial Fitting', url: 'https://discrete.openmathbooks.org/dmoi3/sec_polyfit.html', description: 'Finite differences, and how a constant row of differences reveals the degree of a polynomial.', verified: '2026-11-27' },
 l2_4: { title: 'Levin, Discrete Mathematics: An Open Introduction — 2.4 Solving Recurrence Relations', url: 'https://discrete.openmathbooks.org/dmoi3/sec_recurrence.html', description: 'Recurrence relations with initial conditions, solved by iteration and other methods.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'Every crew gets a job', topic: 'Counting onto functions', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'Jobs are being handed out on the Packing Floor, and the shift lead will not accept a plan that leaves a crew standing idle.',
  lesson: 'The onto functions are all the functions minus those that miss at least one target, and inclusion–exclusion counts the ones that miss.',
  prompt: 'The Packing Floor has 5 different jobs to hand out to 3 crews. Every job goes to exactly one crew, and a crew may take several jobs, so an assignment is a function from the jobs to the crews. Mira wants every crew to get at least one job: the function must be onto. Enter the number of ways to assign the jobs with no condition, then the number of ways that leave at least one crew with no job, then the number of onto assignments. Type each count without commas.',
  answer: [243, 93, 150], labels: ['all assignments', 'some crew left out', 'onto assignments'], tolerance: 0.01,
  hints: [
   'Each of the 5 jobs has 3 crews to choose from, one job after another: that is the multiplicative principle.',
   'For the middle count, let Aᵢ be the assignments in which crew i gets no job, and use inclusion–exclusion on these 3 sets. With one named crew left out, every job has 2 crews to go to.'
  ],
  solution: 'With no condition each of the 5 jobs can go to any of the 3 crews, so there are 3⁵ = 243 assignments. Let Aᵢ be the assignments in which crew i gets no job. If one named crew gets nothing, each job has 2 crews left, so |Aᵢ| = 2⁵ = 32, and there are 3 such sets. If two named crews get nothing, each job has 1 crew left: 1⁵ = 1 way, for each of the C(3, 2) = 3 choices of crews. All 3 crews cannot be empty at once. By inclusion–exclusion, 3 × 32 − 3 × 1 = 93 assignments leave at least one crew with no job. The rest are onto: 243 − 93 = 150.',
  xp: 150, prereqs: ['q20', 'q08'],
  artifact: { name: 'Job board', description: 'Every crew has its name on at least one job card.' },
  sources: [source.l1_6],
  teaching: {
   intuition: 'Handing out jobs to crews is a function: each job is an input, and the crew it goes to is its output. With no rules, the multiplicative principle counts these functions at once, because every job picks its crew independently. The hard part is the rule that every crew gets at least one job, which makes the function onto. Counting onto functions directly is messy, so count the opposite instead: the functions that leave some crew out. Write Aᵢ (read “A sub i”) for the set of assignments in which crew number i gets nothing; the small i just says which crew. If crew i is left out, every job has one crew fewer to choose from, so |Aᵢ| is easy. If two named crews are left out, every job has two fewer. These sets overlap, which is exactly what inclusion–exclusion handles: add the one-crew sets, subtract the two-crew overlaps, add back the three-crew overlaps, and so on. Take that total away from all the functions, and what is left is onto.',
   steps: [
    'Count every function from the jobs to the crews: with k crews and n jobs that is k × k × … × k, n times, which is kⁿ.',
    'For each crew i let Aᵢ be the functions that give crew i no job. Leaving out j named crews leaves k − j crews for every job, so such an overlap has (k − j)ⁿ functions, and there are C(k, j) ways to name the j crews.',
    'Use inclusion–exclusion: the functions that miss at least one crew number C(k, 1)(k − 1)ⁿ − C(k, 2)(k − 2)ⁿ + C(k, 3)(k − 3)ⁿ − …, stopping before all k crews are left out.',
    'Subtract that from kⁿ. The result is the number of onto functions.'
   ],
   example: {
    prompt: 'In how many ways can 4 different jobs go to 3 crews so that every crew gets at least one?',
    steps: [
     'All functions: 3⁴ = 81.',
     'One named crew left out: 2⁴ = 16, for each of 3 crews. Two named crews left out: 1⁴ = 1, for each of 3 pairs.',
     'Missing at least one crew: 3 × 16 − 3 × 1 = 45.',
     'Onto: 81 − 45 = 36.'
    ],
    answer: '36 ways.'
   },
   pitfalls: [
    'Stopping after the first level: 3 × 16 counts an assignment that leaves two crews out twice, so the overlaps must be subtracted.',
    'Writing nᵏ instead of kⁿ. Each job chooses a crew, so the crews are the base and the jobs are the power.',
    'Treating the jobs as identical. They are different jobs, so two assignments that swap jobs between crews count separately.'
   ]
  },
  guidance: [
   { prompt: 'How many ways are there to assign the 5 jobs to the 3 crews with no condition?', answer: [243], labels: ['all assignments'], explanation: 'Each job has 3 choices, and there are 5 jobs, so the multiplicative principle gives 3⁵ = 243.' },
   { prompt: 'Pick one crew and give it no job. How many assignments leave that one crew with nothing?', answer: [32], labels: ['one crew left out'], explanation: 'Every job must then go to one of the other 2 crews, so there are 2⁵ = 32 such assignments.' },
   { prompt: 'Use inclusion–exclusion over the 3 crews. How many assignments leave at least one crew with no job?', answer: [93], labels: ['some crew left out'], explanation: 'Add the one-crew sets, subtract the two-crew overlaps, and so on: 3 × 32 − 3 × 1 = 93.' },
   { prompt: 'How many assignments are onto, giving every crew at least one job?', answer: [150], labels: ['onto assignments'], explanation: 'Take the bad assignments away from all of them: 243 − 93 = 150.' }
  ]
 },
 {
  id: 'q22', title: 'Nothing in its own bin', topic: 'Derangements', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'A new packer is putting crates back without reading the labels, and Mira wants to know how often that ends with every crate in the wrong bin.',
  lesson: 'A derangement puts no object in its own place; inclusion–exclusion counts them as n! minus the orders with at least one object at home.',
  prompt: '5 labelled crates were lifted out of their bins for a stock check, and each crate has its own bin with the same label. A new packer puts them back, one crate to a bin, without reading the labels. Enter the number of ways to put the 5 crates back one to a bin, then the number of ways in which no crate ends up in its own bin. Type each count without commas.',
  answer: [120, 44], labels: ['all orders', 'derangements'], tolerance: 0.01,
  hints: [
   'Putting the crates back one to a bin is an ordering of the 5 crates, so count it with a factorial.',
   'Let Aᵢ be the ways in which crate i is back in its own bin. When j named crates are home, the other crates can go in any order. Use inclusion–exclusion to count the ways with at least one crate home, then take that away from all the ways.'
  ],
  solution: 'There are 5! = 120 ways to put the crates back. Let Aᵢ be the ways with crate i in its own bin. Fixing j named crates leaves (5 − j)! orders of the rest, and there are C(5, j) ways to name them, so level j of inclusion–exclusion is C(5, j) × (5 − j)! = 5! ÷ j!: 5! ÷ 1! = 120, 5! ÷ 2! = 60, 5! ÷ 3! = 20, 5! ÷ 4! = 5, 5! ÷ 5! = 1. The ways with at least one crate home number 120 − 60 + 20 − 5 + 1 = 76. The derangements are the rest: 120 − 76 = 44.',
  xp: 150, prereqs: ['q20'],
  artifact: { name: 'Mixed-up bin map', description: 'A rack plan in which not one crate sits under its own label.' },
  sources: [source.l1_6],
  teaching: {
   intuition: 'Put n labelled crates back into n labelled bins, one to a bin, and there are n! ways to do it. A derangement is a way in which no crate lands in its own bin: every single one is out of place. Counting derangements directly is hard, because whether one crate is home depends on where the others went. So count the opposite. Let Aᵢ be the orders in which crate i is home. If j named crates are home, the other n − j crates can be in any order, which gives (n − j)! orders, and there are C(n, j) ways to choose which j crates. Since C(n, j) × (n − j)! simplifies to n! ÷ j!, each level of inclusion–exclusion is just n! divided by a factorial. Add and subtract the levels in turn to count the orders with at least one crate home, and take that from n!. A neat fact: with 4 or more crates, the share of orders that are derangements is always close to 37 percent.',
   steps: [
    'Count all the orders: n!.',
    'For each j from 1 to n, work out the level j term C(n, j) × (n − j)!, which equals n! ÷ j!.',
    'Combine the levels with alternating signs, plus at level 1, minus at level 2, plus at level 3, and so on. This counts the orders with at least one object in its own place.',
    'Subtract from n! to get the number of derangements.'
   ],
   example: {
    prompt: 'How many ways can 4 labelled crates go back into their 4 bins with none in its own bin?',
    steps: [
     'All orders: 4! = 24.',
     'Levels: 24 ÷ 1! = 24, 24 ÷ 2! = 12, 24 ÷ 3! = 4, 24 ÷ 4! = 1.',
     'At least one home: 24 − 12 + 4 − 1 = 15. Derangements: 24 − 15 = 9.'
    ],
    answer: '9 derangements.'
   },
   pitfalls: [
    'Forgetting the last levels. With 5 crates there are five levels, down to the single order with all 5 home.',
    'Using (n − 1)! for every level. Two crates fixed leaves (n − 2)! orders, three fixed leaves (n − 3)!, and so on.',
    'Answering with the count that has at least one crate home. The question wants the rest.'
   ]
  },
  guidance: [
   { prompt: 'In how many ways can the 5 crates go back one to a bin, with no condition?', answer: [120], labels: ['all orders'], explanation: 'The first bin can take any of 5 crates, the next any of the 4 left, and so on: 5! = 120.' },
   { prompt: 'Crates 1 and 2 are both in their own bins. In how many ways can the other 3 crates go back?', answer: [6], labels: ['orders of the rest'], explanation: 'The other 3 crates fill the other bins in any order: 3! = 6. There are C(5, 2) = 10 such pairs, giving 60 = 5! ÷ 2! at level 2.' },
   { prompt: 'By inclusion–exclusion, in how many ways is at least one crate back in its own bin?', answer: [76], labels: ['at least one home'], explanation: 'Level j gives 5! ÷ j!, with signs taking turns: 120 − 60 + 20 − 5 + 1 = 76.' },
   { prompt: 'In how many ways is no crate in its own bin?', answer: [44], labels: ['derangements'], explanation: 'All the ways minus those with a crate at home: 120 − 76 = 44.' }
  ]
 },
 {
  id: 'q23', title: 'Domes with full stores', topic: 'Chapter review: packing under rules', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'A load of identical crates is going out to the domes, but each dome’s store is small, and Mira needs to know how many plans fit.',
  lesson: 'An upper limit in stars and bars is handled by inclusion–exclusion: count the shares that break the limit and subtract them.',
  prompt: 'Mira has 12 identical crates to share among 4 domes, and a dome may get none. Each dome’s store holds at most 5 crates. Enter the number of ways to share the crates with no limit, then the number of ways in which at least one dome gets more than 5, then the number of ways in which every dome gets at most 5.',
  answer: [455, 330, 125], labels: ['ways with no limit', 'ways over the limit', 'ways within the limit'], tolerance: 0.01,
  hints: [
   'With no limit this is stars and bars: 12 stars and 3 bars in a row of 15 places.',
   'A dome that gets more than 5 gets at least 6: hand it 6 crates first, then share the rest with no limit. Do this for one dome, two domes and so on, and combine with inclusion–exclusion.'
  ],
  solution: 'With no limit there are C(15, 3) = 455 ways. One named dome over the limit: give it 6 first and share the other 6 freely, C(9, 3) = 84 ways, for each of the 4 domes. Two named domes over the limit: give each 6 first and share the other 0, C(3, 3) = 1 way, for each of the C(4, 2) = 6 choices. Three domes cannot all be over the limit, because that needs 18 crates. By inclusion–exclusion, 4 × 84 − 6 × 1 = 330 ways give some dome more than 5. So 455 − 330 = 125 ways keep every dome at most 5.',
  xp: 150, prereqs: ['q19', 'q22'],
  artifact: { name: 'Delivery plan', description: 'A share of crates in which no dome’s store overflows.' },
  sources: [source.l1_5, source.l1_6],
  teaching: {
   intuition: 'Stars and bars shares identical crates among domes: the crates are stars, the domes are separated by bars, and with n crates and k domes there are C(n + k − 1, k − 1) shares. That method cannot see an upper limit such as “at most 4 crates per dome”. Inclusion–exclusion can. A share breaks the limit when some dome gets 5 or more. To count the shares in which one named dome gets at least 5, hand that dome 5 crates first and share what is left with stars and bars, with no limit at all. For two named domes over the limit, hand each of them 5 first. Those counts overlap in the usual way, so add the one-dome counts, subtract the two-dome counts, and so on, until there are not enough crates to put that many domes over. That total is the number of bad shares; the rest keep every dome within the limit.',
   steps: [
    'Count all the shares with no limit: C(n + k − 1, k − 1).',
    'With a limit L per dome, a dome over the limit gets at least L + 1. For j named domes over the limit, hand each L + 1 crates first and share the other n − j(L + 1) freely by stars and bars.',
    'Multiply each such count by C(k, j), the ways to name the j domes, and combine the levels with alternating signs. Stop when j(L + 1) is more than n.',
    'Subtract the shares over the limit from all the shares.'
   ],
   example: {
    prompt: 'In how many ways can 10 identical crates go to 3 domes if each dome takes at most 4?',
    steps: [
     'No limit: C(12, 2) = 66.',
     'One named dome gets 5 or more: hand it 5, share the other 5 freely, C(7, 2) = 21, for each of 3 domes. Two named domes over: hand each 5, nothing is left, C(2, 2) = 1, for each of 3 pairs.',
     'Over the limit: 3 × 21 − 3 × 1 = 60. Within the limit: 66 − 60 = 6.'
    ],
    answer: '6 ways.'
   },
   pitfalls: [
    'Handing a dome L crates first instead of L + 1. A dome with exactly L crates is within the limit.',
    'Forgetting the two-dome overlap, which the one-dome counts include twice.',
    'Using C(n + k − 1, k) instead of C(n + k − 1, k − 1). With k domes there are k − 1 bars.'
   ]
  },
  guidance: [
   { prompt: 'With no limit, in how many ways can the 12 crates be shared among the 4 domes?', answer: [455], labels: ['ways with no limit'], explanation: 'Stars and bars: choose the places of the 3 bars among 15, C(15, 3) = 455.' },
   { prompt: 'Give one named dome 6 crates first and share the remaining 6 with no limit. In how many ways can that be done?', answer: [84], labels: ['one dome over'], explanation: '6 stars and 3 bars: C(9, 3) = 84.' },
   { prompt: 'By inclusion–exclusion over the 4 domes, in how many ways does at least one dome get more than 5?', answer: [330], labels: ['ways over the limit'], explanation: '4 × 84 − 6 × 1 = 330.' },
   { prompt: 'In how many ways does every dome get at most 5?', answer: [125], labels: ['ways within the limit'], explanation: 'All the ways minus those over the limit: 455 − 330 = 125.' }
  ]
 },
 {
  id: 'q24', title: 'Two rules on the board', topic: 'Sequences: closed and recursive formulas', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'The Stock Yard keeps two crate stacks that grow by different rules, and Mira wants a forecast from each.',
  lesson: 'A closed formula gives a term straight from its position; a recursive definition gives each term from the one before.',
  prompt: 'Two stock rules are pinned up in the Stock Yard. Stack A has a recursive definition: a₁ = 4 and aₙ = 2aₙ₋₁ − 1 for n ≥ 2, so each week’s count comes from the week before. Stack B has a closed formula: bₙ = n² + 3n, so any week’s count comes straight from the week number n. Enter a₅, then b₁₀.',
  answer: [49, 130], labels: ['a₅', 'b₁₀'], tolerance: 0.01,
  hints: [
   'Start from a₁ = 4 and use the rule once for each later week: a₂ = 2 × 4 − 1, then a₃ from a₂, and so on up to a₅.',
   'For b₁₀ put n = 10 into the formula for bₙ. No earlier terms are needed.'
  ],
  solution: 'a₂ = 2 × 4 − 1 = 7, a₃ = 2 × 7 − 1 = 13, a₄ = 2 × 13 − 1 = 25 and a₅ = 2 × 25 − 1 = 49. For stack B, b₁₀ = 10² + 3 × 10 = 100 + 30 = 130.',
  xp: 150, prereqs: ['q07'],
  artifact: { name: 'Stock board', description: 'Two growth rules chalked side by side, one recursive and one closed.' },
  sources: [source.l2_1],
  teaching: {
   intuition: 'A sequence is a list of numbers in order: a first one, a second one, a third one, and so on without end. Each number in the list is a term. We name the terms with a letter and a small number below it, called a subscript, that gives the position: a₁ is the first term, a₂ the second, and aₙ (read “a sub n”) is the term in position n. A sequence is a function whose inputs are the positions 1, 2, 3, …, so aₙ is like f(n). There are two common ways to describe one. A closed formula gives any term straight from its position, such as bₙ = n² + 1: put in n and out comes the term, with no other terms needed. A recursive definition gives a starting term and a rule that builds each term from the one before it, such as a₁ = 3 and aₙ = aₙ₋₁ + 4. Here aₙ₋₁ means the term just before aₙ. A recursive definition is often the easiest way to state a rule, but to reach a late term you must climb through every term before it.',
   steps: [
    'Read which description you have. A closed formula uses only n; a recursive definition uses earlier terms such as aₙ₋₁ and gives a starting term.',
    'For a closed formula, put the position n into the formula and work it out.',
    'For a recursive definition, start from the first term and apply the rule once to get the second term, again to get the third, and so on up to the term you want.',
    'Check the first few terms of the list against the description to make sure the rule is read the right way.'
   ],
   example: {
    prompt: 'Stack P has p₁ = 2 and pₙ = 3pₙ₋₁ − 2. Stack Q has qₙ = 2n² − n. Find p₄ and q₆.',
    steps: [
     'p₂ = 3 × 2 − 2 = 4, p₃ = 3 × 4 − 2 = 10 and p₄ = 3 × 10 − 2 = 28.',
     'q₆ = 2 × 36 − 6 = 72 − 6 = 66.'
    ],
    answer: 'p₄ = 28 and q₆ = 66.'
   },
   pitfalls: [
    'Using the position instead of the previous term in a recursive rule: aₙ = 2aₙ₋₁ − 1 doubles the last term, not the number n.',
    'Starting the climb at the wrong term. If a₁ is given, the first use of the rule gives a₂.',
    'Squaring the whole product in a closed formula: in 3n², only n is squared.'
   ]
  },
  guidance: [
   { prompt: 'Use the rule aₙ = 2aₙ₋₁ − 1 twice, starting from a₁ = 4. What are a₂ and a₃?', answer: [7, 13], labels: ['a₂', 'a₃'], explanation: 'a₂ = 2 × 4 − 1 = 7 and a₃ = 2 × 7 − 1 = 13.' },
   { prompt: 'Keep going. What are a₄ and a₅?', answer: [25, 49], labels: ['a₄', 'a₅'], explanation: 'a₄ = 2 × 13 − 1 = 25 and a₅ = 2 × 25 − 1 = 49.' },
   { prompt: 'Put n = 10 into bₙ = n² + 3n. What is b₁₀?', answer: [130], labels: ['b₁₀'], explanation: 'b₁₀ = 10² + 3 × 10 = 100 + 30 = 130. The closed formula needs no earlier terms.' }
  ]
 },
 {
  id: 'q25', title: 'Pipes by the week', topic: 'Arithmetic sequences and their sums', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'Pipe deliveries to the Stock Yard grow by the same amount every week, and the racks must be sized for the whole season.',
  lesson: 'An arithmetic sequence adds the same common difference each time; its nth term is a₁ + (n − 1)d and its first n terms sum to n(a₁ + aₙ) ÷ 2.',
  prompt: 'In week 1 the Stock Yard receives 14 pipes, and each week’s delivery is 6 pipes more than the week before. Enter the delivery in week 12, then the total number of pipes delivered over the first 12 weeks (type it without commas).',
  answer: [80, 564], labels: ['last delivery', 'total delivered'], tolerance: 0.01,
  hints: [
   'Week 12 is 11 steps of 6 after week 1: aₙ = a₁ + (n − 1)d.',
   'For the total, add the first and the last delivery, multiply by the number of weeks and halve.'
  ],
  solution: 'The deliveries form an arithmetic sequence with a₁ = 14 and common difference 6, so a₁₂ = 14 + 11 × 6 = 14 + 66 = 80 pipes. The partial sum of the first 12 terms is 12 × (14 + 80) ÷ 2 = 12 × 94 ÷ 2 = 564 pipes.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Pipe rack chart', description: 'Rows of pipes, each longer than the last by the same amount.' },
  sources: [source.l2_2],
  teaching: {
   intuition: 'An arithmetic sequence goes up (or down) by the same amount every step, such as 5, 8, 11, 14, …. That fixed amount is the common difference, written d. To reach term n from the first term you take n − 1 steps, not n, so aₙ = a₁ + (n − 1)d. Adding up the first n terms gives a partial sum, and there is a lovely shortcut for it. Write the terms forwards and then backwards underneath: the first and last make a pair, the second and second-to-last make another, and every pair adds to the same total a₁ + aₙ, because one side goes up by d exactly as the other goes down by d. There are n terms in each row, so the two rows together make n pairs, n × (a₁ + aₙ), which is twice the sum. So the sum of the first n terms is n × (a₁ + aₙ) ÷ 2. With Σ from Foundations, that is Σ aᵢ for i from 1 to n.',
   steps: [
    'Find the first term a₁ and the common difference d (any term minus the one before it).',
    'Find the last term you need: aₙ = a₁ + (n − 1)d.',
    'Add the first and last terms: a₁ + aₙ.',
    'Multiply by the number of terms n and halve: the partial sum is n × (a₁ + aₙ) ÷ 2.'
   ],
   example: {
    prompt: 'A sequence starts at 5 and goes up by 3 each time. Find the 10th term and the sum of the first 10 terms.',
    steps: [
     'a₁₀ = 5 + 9 × 3 = 32.',
     'The first and last add to 5 + 32 = 37, so the sum is 10 × 37 ÷ 2 = 185.'
    ],
    answer: 'The 10th term is 32 and the sum of the first 10 terms is 185.'
   },
   pitfalls: [
    'Using n steps instead of n − 1: the 10th term is 9 steps after the first.',
    'Forgetting to halve in the sum. n × (a₁ + aₙ) counts every term twice.',
    'Adding the terms one by one and losing count; the pairing shortcut is safer and faster.'
   ]
  },
  guidance: [
   { prompt: 'How many steps of 6 lie between week 1 and week 12, and what is the week 12 delivery?', answer: [11, 80], labels: ['steps', 'last delivery'], explanation: 'From week 1 to week 12 there are 11 steps, so the delivery is 14 + 11 × 6 = 80.' },
   { prompt: 'What is the first delivery plus the last, 14 + 80?', answer: [94], labels: ['first plus last'], explanation: '14 + 80 = 94. The second plus the second-to-last gives the same, and so does every such pair.' },
   { prompt: 'Multiply by the number of weeks and halve: 12 × 94 ÷ 2. What is the total?', answer: [564], labels: ['total delivered'], explanation: '12 × 94 = 1128, and half of that is 564 pipes.' }
  ]
 },
 {
  id: 'q26', title: 'Filters on the double', topic: 'Geometric sequences and their sums', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'Orders for air filters keep multiplying week on week, and the yard needs to know the order it will face and the total it has to stock.',
  lesson: 'A geometric sequence multiplies by the same common ratio each time; its nth term is a₁rⁿ⁻¹ and its first n terms sum to a₁(rⁿ − 1) ÷ (r − 1).',
  prompt: 'In week 1 the yard orders 3 air filters, and each week’s order is 2 times the week before. Enter the order in week 8, then the total number of filters ordered over the first 8 weeks. Type each count without commas.',
  answer: [384, 765], labels: ['last order', 'total ordered'], tolerance: 0.01,
  hints: [
   'Week 8 is 7 multiplications by 2 after week 1: aₙ = a₁ × rⁿ⁻¹.',
   'For the total use the sum formula a₁ × (rⁿ − 1) ÷ (r − 1), where n is the number of weeks.'
  ],
  solution: 'The orders form a geometric sequence with a₁ = 3 and common ratio 2, so a₈ = 3 × 2⁷ = 3 × 128 = 384 filters. The partial sum of the first 8 terms is 3 × (2⁸ − 1) ÷ (2 − 1) = 3 × 255 ÷ 1 = 765 filters.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Order ledger', description: 'A column of orders that grows by the same multiple every line.' },
  sources: [source.l2_2],
  teaching: {
   intuition: 'A geometric sequence multiplies by the same number every step, such as 2, 6, 18, 54, …, which triples each time. That fixed multiplier is the common ratio, written r. To reach term n you multiply n − 1 times, so aₙ = a₁ × rⁿ⁻¹, using the powers from Foundations. The partial sum of the first n terms also has a shortcut. Call the sum S. Multiply every term by r and each one becomes the next term, so r × S is the same list shifted along by one place: it has every term of S except the first, plus one new term past the end. Subtracting S from r × S cancels everything in the middle and leaves the new last term minus the first: (r − 1) × S = a₁ × rⁿ − a₁. Dividing by r − 1 gives S = a₁ × (rⁿ − 1) ÷ (r − 1). Because the terms multiply, geometric sequences grow very fast, which is why forecasts of anything that doubles get large so quickly.',
   steps: [
    'Find the first term a₁ and the common ratio r (any term divided by the one before it).',
    'For the nth term work out rⁿ⁻¹ and multiply by a₁.',
    'For the sum of the first n terms work out rⁿ − 1.',
    'Multiply by a₁ and divide by r − 1: S = a₁ × (rⁿ − 1) ÷ (r − 1).'
   ],
   example: {
    prompt: 'A sequence starts at 5 and triples each time. Find the 4th term and the sum of the first 4 terms.',
    steps: [
     'a₄ = 5 × 3³ = 5 × 27 = 135.',
     'The sum is 5 × (3⁴ − 1) ÷ (3 − 1) = 5 × 80 ÷ 2 = 200. Check: 5 + 15 + 45 + 135 = 200.'
    ],
    answer: 'The 4th term is 135 and the sum of the first 4 terms is 200.'
   },
   pitfalls: [
    'Using rⁿ for the nth term: the first term has had no multiplications, so the nth has had n − 1.',
    'Using rⁿ⁻¹ in the sum formula. The sum needs rⁿ − 1, one power higher than the last term.',
    'Multiplying a₁ by r first and then raising to a power: a₁ × rⁿ⁻¹ raises only r.'
   ]
  },
  guidance: [
   { prompt: 'What is 2⁷, and what is the week 8 order?', answer: [128, 384], labels: ['power of the ratio', 'last order'], explanation: '2⁷ = 128, so the order is 3 × 128 = 384.' },
   { prompt: 'What is 2⁸ − 1?', answer: [255], labels: ['rⁿ − 1'], explanation: '2⁸ = 256, and one less is 255.' },
   { prompt: 'What is the total, 3 × 255 ÷ (2 − 1)?', answer: [765], labels: ['total ordered'], explanation: '3 × 255 = 765, divided by 1 is 765 filters.' }
  ]
 },
 {
  id: 'q27', title: 'Rows of differences', topic: 'Finite differences and polynomial fitting', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'A crate line grows in a way that is neither steady nor doubling, and Mira wants the next count before the week starts.',
  lesson: 'If the differences of a sequence become constant at level k, the sequence comes from a polynomial of degree k, and the rows can be extended to predict the next term.',
  prompt: 'The weekly counts of one crate line over six weeks are 6, 13, 24, 39, 58, 81. Mira assumes they follow the simplest polynomial in the week number that fits them: the one of lowest degree, so that once a row of differences is constant, it stays constant. Use finite differences: enter the degree of the polynomial, which is the level at which the differences become constant, then the count to expect in week 7.',
  answer: [2, 108], labels: ['degree', 'next count'], tolerance: 0.01,
  hints: [
   'Subtract each count from the next to get the first differences. Do the same to those differences, and keep going until one row is constant.',
   'To get the next count, add one more copy of the constant at the bottom row, then add your way back up: each row’s new entry is its last entry plus the new entry of the row below.'
  ],
  solution: 'First differences: 7, 11, 15, 19, 23. Second differences: 4, 4, 4, 4. The second differences are constant, so the counts come from a polynomial of degree 2. Extending the rows, the next first difference is 23 + 4 = 27, so week 7 has 81 + 27 = 108.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'Difference table', description: 'A triangle of differences that ends in a row of equal numbers.' },
  sources: [source.l2_3],
  teaching: {
   intuition: 'Subtract each term of a sequence from the next one and you get a new row: the first differences. For an arithmetic sequence that row is constant, the common difference. For a sequence like 1, 4, 9, 16, 25 (the squares) the first differences 3, 5, 7, 9 are not constant, but their own differences, the second differences, are: 2, 2, 2. These rows of finite differences tell you what kind of formula lies behind a list. If the first differences are constant, the terms come from a polynomial of degree 1 (a straight-line rule like 3n + 2). If the second differences are constant, it is degree 2 (with an n² term, a quadratic from Foundations). If the third are constant, degree 3 (with an n³ term). The degree is the highest power of n in the polynomial, and it is the level of the first constant row. A short list on its own never fixes the rule, because many formulas fit any few numbers. So we assume the simplest polynomial that fits, the one of lowest degree: once a row of differences is constant, it stays constant. The table also predicts the next term without finding the formula at all: add one more copy of the constant to the bottom row, then work back up, each row’s new entry being its last entry plus the new entry beneath it.',
   steps: [
    'Write the terms in a row. Under them write the first differences: each term minus the one before.',
    'Take differences of that row, and keep going until a row is constant. Its level (1 for first differences, 2 for second, 3 for third) is the degree of the polynomial.',
    'Extend the constant row by one more copy of its number.',
    'Work back up: each row gets a new entry equal to its last entry plus the new entry of the row below. The new entry of the top row is the next term.'
   ],
   example: {
    prompt: 'A list reads 2, 9, 28, 65, 126, 217. Find the degree of the polynomial behind it and the next term.',
    steps: [
     'First differences: 7, 19, 37, 61, 91. Second differences: 12, 18, 24, 30. Third differences: 6, 6, 6, constant, so the degree is 3.',
     'Extend: the next second difference is 30 + 6 = 36, the next first difference is 91 + 36 = 127, and the next term is 217 + 127 = 344.'
    ],
    answer: 'Degree 3, and the next term is 344.'
   },
   pitfalls: [
    'Subtracting in the wrong order. Always take the later term minus the earlier one, or the signs flip.',
    'Calling the degree the number of rows written, counting the terms themselves as a row. The first differences are level 1.',
    'Extending only the top row by the last first difference. Every row below must be extended first, from the constant row up.'
   ]
  },
  guidance: [
   { prompt: 'What are the first two first differences, 13 − 6 and 24 − 13?', answer: [7, 11], labels: ['first difference 1', 'first difference 2'], explanation: '13 − 6 = 7 and 24 − 13 = 11.' },
   { prompt: 'Keep taking differences of differences. At which level do they become constant, and what is the constant?', answer: [2, 4], labels: ['degree', 'constant difference'], explanation: 'First differences: 7, 11, 15, 19, 23. Second differences: 4, 4, 4, 4. The row at level 2 is constant, at 4, so the degree is 2.' },
   { prompt: 'Extend every row by one entry, from the constant row up. What is the count for week 7?', answer: [108], labels: ['next count'], explanation: 'Extending the rows, the next first difference is 23 + 4 = 27, so week 7 has 81 + 27 = 108.' }
  ]
 },
 {
  id: 'q28', title: 'Valves that breed valves', topic: 'Recurrence relations and the Fibonacci numbers', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'The spare valve count each week depends on the two weeks before it, and the yard wants a forecast two months out.',
  lesson: 'A recurrence relation gives each term from earlier terms; with its initial conditions it fixes the whole sequence, which is computed one term at a time.',
  prompt: 'The yard’s count of spare valves follows the recurrence relation aₙ = aₙ₋₁ + 2aₙ₋₂ for n ≥ 2, with initial conditions a₀ = 3 and a₁ = 1, where aₙ is the count n weeks from now. Enter a₄, then a₈.',
  answer: [23, 343], labels: ['a₄', 'a₈'], tolerance: 0.01,
  hints: [
   'Each new term needs the two terms just before it: a₂ = a₁ + 2 × a₀.',
   'Write the terms in a row from a₀ and keep going one term at a time, up to a₈.'
  ],
  solution: 'a₂ = 1 + 2 × 3 = 7, a₃ = 7 + 2 × 1 = 9, a₄ = 9 + 2 × 7 = 23, a₅ = 23 + 2 × 9 = 41, a₆ = 41 + 2 × 23 = 87, a₇ = 87 + 2 × 41 = 169 and a₈ = 169 + 2 × 87 = 343.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Valve forecast', description: 'Eight weeks of counts, each made from the two before it.' },
  sources: [source.l2_1, source.l2_4],
  teaching: {
   intuition: 'A recurrence relation is an equation that gives each term of a sequence from terms before it. The recursive definitions of the last missions used one earlier term; many rules use two. The most famous is the rule of the Fibonacci numbers, Fₙ = Fₙ₋₁ + Fₙ₋₂: each term is the sum of the two before it. A rule that looks back two terms cannot get started on its own, so it needs two starting terms, called initial conditions. For Fibonacci they are F₀ = 0 and F₁ = 1, and the sequence runs 0, 1, 1, 2, 3, 5, 8, 13, 21, …. Here the positions start at 0, so a₀ is the term at week 0, now. Change the initial conditions or the numbers in the rule and you get a different sequence, but the method is always the same: write the terms in a row and build each new one from the two just before it.',
   steps: [
    'Write down the initial conditions, such as a₀ and a₁, as the first two terms of a row.',
    'Read the rule: in aₙ = c·aₙ₋₁ + d·aₙ₋₂, the new term is c times the term just before plus d times the term two places back.',
    'Build a₂ from a₁ and a₀, then a₃ from a₂ and a₁, and so on.',
    'Stop at the term you need, keeping track of the position numbers as you go.'
   ],
   example: {
    prompt: 'The Fibonacci numbers follow Fₙ = Fₙ₋₁ + Fₙ₋₂ with F₀ = 0 and F₁ = 1. Find F₈.',
    steps: [
     'F₂ = 1 + 0 = 1, F₃ = 1 + 1 = 2, F₄ = 2 + 1 = 3, F₅ = 3 + 2 = 5.',
     'F₆ = 5 + 3 = 8, F₇ = 8 + 5 = 13, F₈ = 13 + 8 = 21.'
    ],
    answer: 'F₈ = 21.'
   },
   pitfalls: [
    'Swapping the two earlier terms: in aₙ = aₙ₋₁ + 2aₙ₋₂ the 2 multiplies the term two places back, not the one just before.',
    'Losing the position count. With a₀ as the first term, a₈ is the ninth number in the row.',
    'Applying the rule to get a₁. The initial conditions are given, not computed; the rule starts at a₂.'
   ]
  },
  guidance: [
   { prompt: 'Use the rule aₙ = aₙ₋₁ + 2aₙ₋₂ with a₀ = 3 and a₁ = 1. What are a₂ and a₃?', answer: [7, 9], labels: ['a₂', 'a₃'], explanation: 'a₂ = 1 + 2 × 3 = 7 and a₃ = 7 + 2 × 1 = 9.' },
   { prompt: 'Keep going. What are a₄ and a₅?', answer: [23, 41], labels: ['a₄', 'a₅'], explanation: 'a₄ = 9 + 2 × 7 = 23 and a₅ = 23 + 2 × 9 = 41.' },
   { prompt: 'What are a₆ and a₇?', answer: [87, 169], labels: ['a₆', 'a₇'], explanation: 'a₆ = 41 + 2 × 23 = 87 and a₇ = 87 + 2 × 41 = 169.' },
   { prompt: 'What is a₈?', answer: [343], labels: ['a₈'], explanation: 'a₈ = 169 + 2 × 87 = 343.' }
  ]
 },
 {
  id: 'q29', title: 'Forecasting the yard', topic: 'Chapter review: forecasting stock', tier: 'Intermediate', sector: 'Stock Yard',
  brief: 'Three stock lines in the yard grow by three different rules, and the forecast for each has to be on Mira’s desk tonight.',
  lesson: 'Recognise the rule first: a common difference means arithmetic, a common ratio means geometric, and differences that settle at a deeper level mean a polynomial.',
  prompt: 'Mira forecasts three stock lines. Line A: 17, 23, 29, 35, … (the same amount is added each week). Line B: 2, 6, 18, 54, … (each week is the same multiple of the week before). Line C: 3, 7, 13, 21, 31, … (assume the simplest polynomial in the week number that fits: once a row of differences is constant, it stays constant). Enter line A’s count in week 10, then line B’s total over its first 6 weeks, then line C’s count in week 6. Type each count without commas.',
  answer: [71, 728, 43], labels: ['line A week 10', 'line B total', 'line C week 6'], tolerance: 0.01,
  hints: [
   'Line A is an arithmetic sequence and line B a geometric one: find the common difference and the common ratio first.',
   'For line C take differences until a row is constant, then extend every row by one entry.'
  ],
  solution: 'Line A has common difference 6, so a₁₀ = 17 + 9 × 6 = 71. Line B has common ratio 3, so the sum of its first 6 terms is 2 × (3⁶ − 1) ÷ (3 − 1) = 2 × 728 ÷ 2 = 728. Line C has first differences 4, 6, 8, 10 and second differences 2, 2, 2, so the next first difference is 10 + 2 = 12 and week 6 has 31 + 12 = 43.',
  xp: 150, prereqs: ['q26', 'q27', 'q28'],
  artifact: { name: 'Yard forecast', description: 'Three lines of stock, each continued by its own rule.' },
  sources: [source.l2_1, source.l2_2, source.l2_3],
  teaching: {
   intuition: 'Real stock lists do not come labelled with their rule, so the first job is to recognise it. Subtract neighbouring terms: if the differences are all the same, the list is an arithmetic sequence and its common difference is that number. Divide neighbouring terms: if the quotients are all the same, it is a geometric sequence with that common ratio. If neither works, keep taking differences; when a row of differences becomes constant at some deeper level, the list comes from a polynomial and the table can be extended. Once the rule is known, use its own shortcut: aₙ = a₁ + (n − 1)d for an arithmetic term, a₁ × (rⁿ − 1) ÷ (r − 1) for a geometric sum, and extending the rows for a polynomial.',
   steps: [
    'For each list, test the differences and the quotients of neighbouring terms.',
    'Constant differences: arithmetic. Use aₙ = a₁ + (n − 1)d, or n × (a₁ + aₙ) ÷ 2 for a sum.',
    'Constant quotients: geometric. Use a₁ × rⁿ⁻¹ for a term, or a₁ × (rⁿ − 1) ÷ (r − 1) for a sum.',
    'Neither: take differences of differences until a row is constant, then extend the rows to get the next term.'
   ],
   example: {
    prompt: 'List P: 4, 9, 14, 19, …. List Q: 3, 6, 12, 24, …. List R: 2, 5, 10, 17, 26, …. Find P’s 8th term, Q’s sum over 5 terms and R’s 6th term.',
    steps: [
     'P adds 5: the 8th term is 4 + 7 × 5 = 39.',
     'Q doubles: the sum is 3 × (2⁵ − 1) ÷ (2 − 1) = 3 × 31 = 93.',
     'R: first differences 3, 5, 7, 9, second differences 2, 2, 2, so the next first difference is 11 and the 6th term is 26 + 11 = 37.'
    ],
    answer: '39, 93 and 37.'
   },
   pitfalls: [
    'Calling a list arithmetic after checking only the first two terms. Check every neighbouring pair.',
    'Using a term formula where a sum is asked, or the other way round.',
    'Treating a polynomial list as geometric because it grows quickly. Test the quotients: for 3, 7, 13, 21 they are not equal.'
   ]
  },
  guidance: [
   { prompt: 'What is line A’s common difference, and what is its count in week 10?', answer: [6, 71], labels: ['common difference', 'line A week 10'], explanation: 'Each week adds 23 − 17 = 6. Week 10 is 9 steps after week 1: 17 + 9 × 6 = 71.' },
   { prompt: 'What is line B’s common ratio, and what is its total over the first 6 weeks?', answer: [3, 728], labels: ['common ratio', 'line B total'], explanation: 'Each week is 3 times the one before, so the total is 2 × (3⁶ − 1) ÷ (3 − 1) = 2 × 728 ÷ 2 = 728.' },
   { prompt: 'What is line C’s next first difference, and its count in week 6?', answer: [12, 43], labels: ['next first difference', 'line C week 6'], explanation: 'The first differences 4, 6, 8, 10 grow by 2 each time, so the next is 12, and week 6 has 31 + 12 = 43.' }
  ]
 },
 {
  id: 'q30', title: 'Unrolling the tile count', topic: 'Solving a recurrence by iteration', tier: 'Advanced', sector: 'Tiling Works',
  brief: 'The Tiling Works store gains a few more tiles each week than the week before, and Mira wants the count far ahead without working out every week.',
  lesson: 'Iteration unrolls aₙ = aₙ₋₁ + f(n) into a₀ plus the sum of f(1) to f(n); when f is linear that sum is arithmetic, so the far term comes in one step.',
  prompt: 'The Tiling Works tile store follows the recurrence relation aₙ = aₙ₋₁ + 2n + 3 for n ≥ 1, with a₀ = 5: in week n the store gains 2n + 3 tiles. Enter a₃, then a₂₀ (type it without commas).',
  answer: [26, 485], labels: ['a₃', 'far term'], tolerance: 0.01,
  hints: [
   'Iterate: a₁ = a₀ + (2 × 1 + 3), a₂ = a₁ + (2 × 2 + 3), and so on, each step adding one more amount.',
   'Unrolled all the way down, a₂₀ is a₀ plus the 20 amounts gained in weeks 1 to 20. Those amounts form an arithmetic sequence, so add them as the number of terms × (first + last) ÷ 2.'
  ],
  solution: 'a₁ = 5 + 5 = 10, a₂ = 10 + 7 = 17 and a₃ = 17 + 9 = 26. By iteration, a₂₀ = a₀ + (5 + 7 + … + 43). The 20 amounts form an arithmetic sequence from 5 to 43, with sum 20 × (5 + 43) ÷ 2 = 480. So a₂₀ = 5 + 480 = 485.',
  xp: 200, prereqs: ['q28', 'q25'],
  artifact: { name: 'Unrolled ledger', description: 'A long recurrence written out as one start and one tidy sum.' },
  sources: [source.l2_4],
  teaching: {
   intuition: 'A recurrence relation like aₙ = aₙ₋₁ + 2n + 1 says how much is added in week n. To find a term far ahead, such as a₅₀, you could climb through all fifty weeks, but iteration is faster. Apply the rule to itself over and over: aₙ = aₙ₋₁ + (amount in week n), and aₙ₋₁ = aₙ₋₂ + (amount in week n − 1), and so on all the way down to a₀. Put together, aₙ is just the starting value a₀ plus every amount added from week 1 to week n. When each week’s amount is a linear rule such as 2n + 1, those amounts go up by the same step every week, so they form an arithmetic sequence, and the last chapter’s shortcut adds them at once: number of terms × (first + last) ÷ 2. That turns the recurrence into a closed formula for aₙ, so any term, however far ahead, takes one short calculation.',
   steps: [
    'Write the rule as aₙ = aₙ₋₁ + (amount in week n), and note the starting value a₀.',
    'Unroll it: aₙ = a₀ + (amount in week 1) + (amount in week 2) + … + (amount in week n).',
    'Find the first amount (put n = 1 into the rule’s added part) and the last (put in the week you want). The amounts form an arithmetic sequence.',
    'Add them with number of terms × (first + last) ÷ 2, then add a₀.'
   ],
   example: {
    prompt: 'A store has a₀ = 2 and aₙ = aₙ₋₁ + 4n − 1. Find a₁₀.',
    steps: [
     'Unrolled, a₁₀ = 2 + (3 + 7 + 11 + … + 39): the amounts for n = 1 to 10.',
     'They are arithmetic from 3 to 39, so their sum is 10 × (3 + 39) ÷ 2 = 210.',
     'a₁₀ = 2 + 210 = 212.'
    ],
    answer: 'a₁₀ = 212.'
   },
   pitfalls: [
    'Forgetting to add the starting value a₀ at the end.',
    'Counting the amounts from week 0. The first amount added is the one for n = 1, so there are exactly n amounts.',
    'Using the amount for the last week as the answer. That is only what week n adds, not the total in store.'
   ]
  },
  guidance: [
   { prompt: 'Apply the rule three times from a₀ = 5. What are a₁, a₂ and a₃?', answer: [10, 17, 26], labels: ['a₁', 'a₂', 'a₃'], explanation: 'Week 1 adds 5, week 2 adds 7 and week 3 adds 9: 10, 17, 26.' },
   { prompt: 'What are the amounts gained in week 1 and in week 20?', answer: [5, 43], labels: ['first amount', 'last amount'], explanation: 'Put n = 1 and n = 20 into 2n + 3: 5 and 43.' },
   { prompt: 'What is the sum of the 20 amounts, and what is a₂₀?', answer: [480, 485], labels: ['sum of amounts', 'far term'], explanation: '20 × (5 + 43) ÷ 2 = 480, and a₂₀ = 5 + 480 = 485.' }
  ]
 }
);
})();
