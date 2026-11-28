/* Discrete mathematics missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/disc/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Functions and counting principles · Basic, 100 XP · sector 'Labelling Bay' · Chapter review: labels and codes [Levin 0.4, 1.1]
     q12  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · Permutations and factorials [Levin 1.3]
     q13  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · Partial permutations P(n, k) [Levin 1.3]
     q14  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · Combinations C(n, k) = n! ÷ (k!(n − k)!) [Levin 1.3]
     q15  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · Pascal's triangle, bit strings and the 2ⁿ subsets [Levin 1.2]
     q16  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · The binomial theorem [Levin 1.2]
     q17  ch 3 Arrangements and selections · Intermediate, 150 XP · sector 'Crew Office' · Chapter review: order or no order? [Levin 1.3]
     q18  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Counting the complement: "at least one" [Levin 1.1, 1.3]
     q19  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Stars and bars [Levin 1.5]
     q20  ch 4 Counting with conditions · Intermediate, 150 XP · sector 'Packing Floor' · Inclusion–exclusion with three sets [Levin 1.6] */
(function(){
'use strict';
/* Oscar Levin, Discrete Mathematics: An Open Introduction (3rd edition), the sections the missions below cite. Each page was
   opened on the date in `verified`. Every mission needs at least one source whose title matches /OpenStax|Levin/.
   The prompt, hints, solution and guided steps of each mission are build(canonical) of gen-b.js, word for word. */
const source = {
 s0_4: { title: 'Levin, Discrete Mathematics: An Open Introduction — 0.4 Functions', url: 'https://discrete.openmathbooks.org/dmoi3/sec_intro-functions.html', description: 'Functions between sets: domain, codomain, range, one-to-one and onto.', verified: '2026-11-27' },
 s1_1: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.1 Additive and Multiplicative Principles', url: 'https://discrete.openmathbooks.org/dmoi3/sec_counting-addmult.html', description: 'The additive and multiplicative principles, and counting with sets.', verified: '2026-11-27' },
 s1_2: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.2 Binomial Coefficients', url: 'https://discrete.openmathbooks.org/dmoi3/sec_counting-binom.html', description: 'Bit strings, subsets, lattice paths, Pascal’s triangle and the coefficients of (x + y)ⁿ multiplied out.', verified: '2026-11-27' },
 s1_3: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.3 Combinations and Permutations', url: 'https://discrete.openmathbooks.org/dmoi3/sec_counting-combperm.html', description: 'Factorials, permutations P(n, k) and combinations, and when order matters.', verified: '2026-11-27' },
 s1_5: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.5 Stars and Bars', url: 'https://discrete.openmathbooks.org/dmoi3/sec_stars-and-bars.html', description: 'Sharing identical objects among groups, with or without a lower limit.', verified: '2026-11-27' },
 s1_6: { title: 'Levin, Discrete Mathematics: An Open Introduction — 1.6 Advanced Counting Using PIE', url: 'https://discrete.openmathbooks.org/dmoi3/sec_advPIE.html', description: 'The principle of inclusion and exclusion for three or more sets, derangements and onto functions.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'The crate code audit', topic: 'Chapter review: labels and codes', tier: 'Basic', sector: 'Labelling Bay',
  brief: 'Before the tag printer runs, Mira wants to know how many codes it can make and how many different check numbers those codes give.',
  lesson: 'A choice made in stages is counted by multiplying the options at each stage, and the range of a function counts each different output once.',
  prompt: 'The labelling bay prints a code on every crate: one letter from A to F, then a first digit from 1 to 4, then a second digit from 0 to 7. So B23 is one code. A checking function f sends each code to the sum of its two digits, so f(B23) = 5, and its codomain is the whole numbers from 0 to 18. Enter the number of different codes, then the size of the range of f.',
  answer: [192, 11], labels: ['codes', 'size of the range'], tolerance: 0.01,
  hints: [
   'A code is three choices made one after another, so the multiplicative principle applies: multiply the numbers of options for the three places.',
   'The range is the set of outputs f really gives. Find the smallest and the largest digit sum a code can have, and check that every whole number between them is reached.'
  ],
  solution: 'There are 6 letters (A to F), 4 first digits (1 to 4) and 8 second digits (0 to 7). By the multiplicative principle there are 6 × 4 × 8 = 192 codes. The smallest digit sum is 1 + 0 = 1 and the largest is 4 + 7 = 11. Every whole number in between is reached as well (keep the first digit at 1 and raise the second, then raise the first), so the range is {1, 2, …, 11}, which has 11 elements. The codomain also holds 0 and the sums from 12 to 18, but no code reaches them, so f is not onto.',
  xp: 100, prereqs: ['q08', 'q10'],
  artifact: { name: 'Tag printer settings', description: 'The code pattern for every crate, with its check sums.' },
  sources: [source.s0_4, source.s1_1],
  teaching: {
   intuition: 'This chapter gave you two tools, and a crate code needs both. A function sends each element of its domain to exactly one element of its codomain, and its range is the set of outputs that are really used. The multiplicative principle says that when a choice is made in stages, one after another, and each stage has the same number of options whatever was chosen before, the number of outcomes is the product of those numbers of options. A crate code is a staged choice: first a letter, then a digit, then another digit. A rule that turns each code into a number, such as adding its digits, is a function whose domain is the set of codes. Its range is usually far smaller than the set of codes, because many codes share an output, and it can be smaller than the codomain too.',
   steps: [
    'Write down the options for each place of the code and count them. A run of digits from 0 to 9 has 10 digits, not 9.',
    'Multiply the counts: by the multiplicative principle that is the number of codes.',
    'For the function, find its smallest and its largest output, then check whether every value between them is reached by some code.',
    'The size of the range is the number of different outputs. If it is smaller than the codomain, the function is not onto.'
   ],
   example: {
    prompt: 'Codes are one letter from A to C, then a digit from 1 to 2, then a digit from 0 to 3, and g sends each code to the sum of its digits. How many codes are there, and how big is the range of g?',
    steps: [
     'Options: 3 letters, 2 first digits and 4 second digits, so there are 3 × 2 × 4 = 24 codes.',
     'The sums run from 1 + 0 = 1 up to 2 + 3 = 5, and 1, 2, 3, 4 and 5 all occur.'
    ],
    answer: '24 codes; the range {1, 2, 3, 4, 5} has 5 elements.'
   },
   pitfalls: [
    'Counting the digits from 0 to 7 as 7. With 0 included there are 8.',
    'Giving the number of codes as the size of the range. Many codes have the same digit sum, and the range counts each output only once.',
    'Starting the range at 0. A digit sum of 0 needs both digits to be 0, and the first digit here is never 0.'
   ]
  },
  guidance: [
   { prompt: 'How many options does each place of a code have: the letter, the first digit and the second digit?', answer: [6, 4, 8], labels: ['letters', 'first digits', 'second digits'], explanation: 'A to F is 6 letters, 1 to 4 is 4 digits, and 0 to 7 is 8 digits, because 0 counts too.' },
   { prompt: 'Multiply the three numbers of options. How many codes are there?', answer: [192], labels: ['codes'], explanation: 'By the multiplicative principle, 6 × 4 × 8 = 192.' },
   { prompt: 'What are the smallest and the largest values f can give?', answer: [1, 11], labels: ['smallest sum', 'largest sum'], explanation: 'The first digit is never 0, so the smallest sum is 1 + 0 = 1. The largest is 4 + 7 = 11.' },
   { prompt: 'Every whole number from 1 to 11 is the digit sum of some code. How many elements does the range of f have?', answer: [11], labels: ['size of the range'], explanation: 'The range is {1, 2, …, 11}, so it has 11 elements, far fewer than the 192 codes: many codes share a digit sum.' }
  ]
 },
 {
  id: 'q12', title: 'One shelf, many orders', topic: 'Permutations and factorials', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'The crew office wants every crate on its new shelf tried in every order, and Mira needs to know how long that list would be.',
  lesson: 'The number of ways to put n different objects in a row is n! = n × (n − 1) × … × 2 × 1.',
  prompt: 'A shelf in the crew office has 6 spaces in a row, and 6 different crates must go on it, one in each space. Mira wants to know how many different orders there are. Enter 6!, the number of orders (type it without commas if it is 1000 or more).',
  answer: [720], labels: ['orders'], tolerance: 0.01,
  hints: [
   'Fill the spaces from left to right. The first space can take any of the 6 crates; the next can take any that are left.',
   'Multiply the numbers of choices for all the spaces: 6 × 5 × 4 × 3 × 2 × 1.'
  ],
  solution: 'The first space has 6 choices, the second 5, and so on down to 1 choice for the last space. By the multiplicative principle the number of orders is 6! = 6 × 5 × 4 × 3 × 2 × 1 = 720.',
  xp: 150, prereqs: ['q10'],
  artifact: { name: 'Shelf order card', description: 'One row of crates, and the factorial that counts all its orders.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'Put different crates in a row of spaces, one per space, and count the orders. The multiplicative principle does it in stages. The first space can hold any of the crates. Once it is filled, one crate fewer is left for the second space, then one fewer again for the third, until a single crate is left for the last space. So the count is a product of whole numbers that drops by one at each step, all the way down to 1. That product comes up so often that it has a name and a symbol: n factorial, written n!, is n × (n − 1) × (n − 2) × … × 2 × 1. For example 3! = 3 × 2 × 1 = 6, and by agreement 0! = 1. An arrangement of all the objects in an order is called a permutation of them, so n different objects have n! permutations. Factorials grow very fast: 10! is already more than three million.',
   steps: [
    'Count the objects to be arranged: n of them, all different, and every one is used.',
    'Fill the places one at a time: n choices for the first, n − 1 for the second, and so on down to 1 for the last.',
    'Multiply the choices. The product n × (n − 1) × … × 1 is n!, the number of permutations.'
   ],
   example: {
    prompt: 'In how many orders can 4 different crates stand on a shelf of 4 spaces?',
    steps: [
     'The first space has 4 choices, the second 3, the third 2 and the last 1.',
     'Multiply: 4! = 4 × 3 × 2 × 1 = 24.'
    ],
    answer: '24 orders.'
   },
   pitfalls: [
    'Adding the choices (6 + 5 + 4 + …) instead of multiplying them. The choices are made one after another, so the multiplicative principle applies.',
    'Keeping the same number of choices for every space. A crate cannot be in two spaces, so each space has one choice fewer than the one before.',
    'Writing a large answer with commas. The answer box reads a comma as a decimal point, so type the digits only.'
   ]
  },
  guidance: [
   { prompt: 'How many of the crates can go in the first space, and how many are left to choose from for the second space?', answer: [6, 5], labels: ['first space', 'second space'], explanation: 'Any of the 6 can go first. Whichever it is, 5 remain for the second space.' },
   { prompt: 'The choices keep dropping by one, down to a single choice for the last space. What is 6 × 5 × 4 × 3 × 2 × 1?', answer: [720], labels: ['orders'], explanation: '6 × 5 = 30, 30 × 4 = 120, 120 × 3 = 360, 360 × 2 = 720 and 720 × 1 = 720. So 6! = 720.' }
  ]
 },
 {
  id: 'q13', title: 'Filling the ranked jobs', topic: 'Partial permutations P(n, k)', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'A few jobs on the morning roster are different from each other, and Mira wants to know in how many ways the crew on shift can cover them.',
  lesson: 'Filling k different jobs from n people, one job each, can be done in P(n, k) = n × (n − 1) × … ways, with k factors; this equals n! ÷ (n − k)!.',
  prompt: 'Mira has 8 crew members on shift and needs a driver, a loader and a checker: 3 different jobs, one person each, and nobody does two. Enter P(8, 3), the number of ways to fill the jobs (type it without commas if it is 1000 or more).',
  answer: [336], labels: ['ways'], tolerance: 0.01,
  hints: [
   'Fill the jobs in order. The driver can be any of the 8 crew; the loader can be anyone except the driver.',
   'Multiply 3 numbers, starting at 8 and going down by one each time. The same count is 8! ÷ 5!.'
  ],
  solution: 'The driver can be chosen in 8 ways, the loader in 7 and the checker in 6. By the multiplicative principle P(8, 3) = 8 × 7 × 6 = 336. The same number is 8! ÷ 5!, because the factors from 5 down to 1 cancel.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Morning roster', description: 'Ranked jobs filled from the crew on shift, one name each.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'Sometimes only some of the objects are put in order. Suppose there are n crew and k different jobs, each job needs one person, and nobody does two. Fill the jobs one at a time. The first job can go to any of the n crew, the second to any of the n − 1 left, and so on. You stop after k jobs, so the product has only k factors: n × (n − 1) × … down to n − k + 1. This count is called a partial permutation, the number of permutations of k objects chosen from n, and it is written P(n, k). For example P(5, 2) = 5 × 4 = 20. Another way to write it uses factorials: n! runs all the way down to 1, and dividing by (n − k)! cancels the factors you did not use, so P(n, k) = n! ÷ (n − k)!. When k equals n, P(n, n) is just n!.',
   steps: [
    'Check that the jobs are different from each other, so that swapping two people gives a different roster, and that nobody does two jobs.',
    'Fill the jobs in order: n choices for the first, n − 1 for the second, and so on, one factor for each of the k jobs.',
    'Multiply the k factors to get P(n, k), or work out n! ÷ (n − k)!, which is the same number.'
   ],
   example: {
    prompt: 'A dome has 5 crew and needs a cook and a medic, one person each. In how many ways can the two jobs be filled?',
    steps: [
     'The cook can be any of the 5 crew; the medic is any of the other 4.',
     'P(5, 2) = 5 × 4 = 20, which is also 5! ÷ 3! = 120 ÷ 6.'
    ],
    answer: '20 ways.'
   },
   pitfalls: [
    'Going on multiplying all the way down to 1. That counts orders of the whole crew, n!, not just the k jobs.',
    'Dividing by k! as well. The jobs are different, so who gets which job matters and nothing is counted twice.',
    'Writing n! ÷ k! instead of n! ÷ (n − k)!. The factorial you divide by belongs to the crew left without a job.'
   ]
  },
  guidance: [
   { prompt: 'How many crew could be the driver? Once the driver is picked, how many could be the loader?', answer: [8, 7], labels: ['first job', 'second job'], explanation: 'Anyone of the 8 can be the driver. The loader is anyone else: 7 people.' },
   { prompt: 'Each job after that has one fewer choice. What is 8 × 7 × 6?', answer: [336], labels: ['ways'], explanation: '8 × 7 = 56 and 56 × 6 = 336. So P(8, 3) = 336.' }
  ]
 },
 {
  id: 'q14', title: 'Picking the ice-field team', topic: 'Combinations C(n, k) = n! ÷ (k!(n − k)!)', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'A team is going out to the ice field, and Mira wants to know how many different teams she could send.',
  lesson: 'The number of ways to choose k objects from n when order does not matter is C(n, k) = P(n, k) ÷ k! = n! ÷ (k!(n − k)!).',
  prompt: 'Mira must send 3 of the 10 crew on shift to the ice field as one team. Everyone on the team does the same work, so only who goes matters, not the order they were picked in. Enter C(10, 3), the number of different teams (type it without commas if it is 1000 or more).',
  answer: [120], labels: ['teams'], tolerance: 0.01,
  hints: [
   'First count the ordered picks, P(10, 3). Each team then turns up once for every order of its 3 members.',
   'A team of 3 can be put in order in 3! = 6 ways, so divide P(10, 3) by 6.'
  ],
  solution: 'Picking the team one person at a time gives P(10, 3) = 10 × 9 × 8 = 720 ordered picks. Each team of 3 appears 3! = 6 times in that count, once for each order of its members. So C(10, 3) = 720 ÷ 6 = 120, which is also 10! ÷ (3! × 7!).',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Team selection sheet', description: 'Names picked for the ice field, with no order among them.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'A team is not a roster. If Mira picks Ada, then Ben, then Cy, she has the same team as if she had picked Cy, then Ada, then Ben. So counting ordered picks counts every team many times over. How many times? Exactly as many as there are orders of its members: a team of k people can be listed in k! orders. So divide. A choice of k objects from n where order does not matter is called a combination, and the number of them is written C(n, k), read “n choose k”. C(n, k) = P(n, k) ÷ k!, and since P(n, k) = n! ÷ (n − k)!, that is C(n, k) = n! ÷ (k! × (n − k)!). For example C(4, 2) = (4 × 3) ÷ 2 = 6. Choosing who goes is the same as choosing who stays, so C(n, k) = C(n, n − k).',
   steps: [
    'Decide that order does not matter: swapping two chosen people gives the same team.',
    'Count the ordered picks, P(n, k) = n × (n − 1) × … with k factors.',
    'Each team appears k! times among them, so divide: C(n, k) = P(n, k) ÷ k!. The result is always a whole number.'
   ],
   example: {
    prompt: 'In how many ways can 2 of 6 crew be chosen for a supply run?',
    steps: [
     'Ordered picks: P(6, 2) = 6 × 5 = 30.',
     'Each pair appears 2! = 2 times, once in each order, so C(6, 2) = 30 ÷ 2 = 15.'
    ],
    answer: '15 ways.'
   },
   pitfalls: [
    'Stopping at P(n, k). That counts ordered picks, and here every team has been counted k! times.',
    'Dividing by k instead of by k!. A team of 3 can be listed in 3! = 6 orders, not 3.',
    'Dividing by (n − k)! only. The formula divides by both k! and (n − k)!.'
   ]
  },
  guidance: [
   { prompt: 'If the order of picking did matter, how many ordered picks of 3 from 10 would there be? That is P(10, 3) = 10 × 9 × 8.', answer: [720], labels: ['ordered picks'], explanation: '10 × 9 = 90 and 90 × 8 = 720: 720 ordered picks.' },
   { prompt: 'In how many orders can one team of 3 be listed? That is 3!.', answer: [6], labels: ['orders of a team'], explanation: '3! = 3 × 2 × 1 = 6. Every team was counted that many times among the ordered picks.' },
   { prompt: 'Divide the ordered picks by the orders of each team. What is 720 ÷ 6?', answer: [120], labels: ['teams'], explanation: '720 ÷ 6 = 120 different teams.' }
  ]
 },
 {
  id: 'q15', title: 'Duty strings and Pascal’s triangle', topic: 'Pascal’s triangle, bit strings and the 2ⁿ subsets', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'The duty log is kept as strings of 0s and 1s, and Mira wants to know how many logs have a given number of crew on duty, and how many logs there could be at all.',
  lesson: 'The n-bit strings with exactly k ones number C(n, k), the entry k of row n of Pascal’s triangle; all n-bit strings, like all subsets of an n-element set, number 2ⁿ.',
  prompt: 'The crew office logs each shift as a bit string: a row of 7 digits, one for each crew member, each 0 (off duty) or 1 (on duty). Enter the number of 7-bit strings with exactly 3 ones, then the number of subsets of a set of 7 crew (type them without commas if they are 1000 or more).',
  answer: [35, 128], labels: ['strings with k ones', 'subsets'], tolerance: 0.01,
  hints: [
   'A string with exactly 3 ones is fixed by choosing which 3 of the 7 places hold a 1, so the count is C(7, 3): entry 3 of row 7 of Pascal’s triangle, counting rows and entries from 0.',
   'A subset is fixed by saying “in” or “out” for each of the 7 crew, which is exactly a bit string. Count all the 7-bit strings.'
  ],
  solution: 'Choosing the 3 places that hold a 1 gives C(7, 3) strings. In Pascal’s triangle it is the sum of the two entries above it in row 6: C(6, 2) + C(6, 3) = 15 + 20 = 35. Each subset of the 7 crew matches one bit string (1 means in the subset, 0 means out), and each of the 7 places has 2 choices, so there are 2⁷ = 128 subsets.',
  xp: 150, prereqs: ['q14', 'q02'],
  artifact: { name: 'Duty log strip', description: 'A row of 0s and 1s, one for each crew member.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'A bit string is a row of digits, each 0 or 1; an n-bit string has n of them, so 0110 is a 4-bit string. A string with exactly k ones is fixed once you choose which k of the n places hold the 1s, so there are C(n, k) such strings. Because these numbers count choices of places in strings, and turn up again in the next mission, C(n, k) is also called a binomial coefficient. Write the binomial coefficients in rows, row n holding C(n, 0), C(n, 1), …, C(n, n), and you get Pascal’s triangle. Row 0 is 1; row 1 is 1 1; row 2 is 1 2 1; row 3 is 1 3 3 1; row 4 is 1 4 6 4 1. Rows and the places in them are counted from 0. Each entry inside the triangle is the sum of the two entries just above it: C(n, k) = C(n − 1, k − 1) + C(n − 1, k). The reason: an n-bit string with k ones either starts with 1, and then has k − 1 ones in the other n − 1 places, or starts with 0, and has all k ones in the other n − 1 places. Bit strings also count subsets. For a set of n elements, write 1 under each element that is in a subset and 0 under each that is not: every subset gives exactly one n-bit string. Each place has 2 choices, so there are 2 × 2 × … × 2 = 2ⁿ strings, and 2ⁿ subsets, the empty set and the whole set included.',
   steps: [
    'For strings with exactly k ones, choose the k places of the 1s: the count is C(n, k).',
    'To read C(n, k) from Pascal’s triangle, add the two entries above it in row n − 1, C(n − 1, k − 1) and C(n − 1, k).',
    'For all n-bit strings, or all subsets of an n-element set, multiply 2 by itself n times: 2ⁿ.'
   ],
   example: {
    prompt: 'How many 4-bit strings have exactly 2 ones, and how many subsets does a set of 4 elements have?',
    steps: [
     'Row 3 of Pascal’s triangle is 1 3 3 1. The entry C(4, 2) is the sum of the two above it: 3 + 3 = 6.',
     'The 6 strings are 1100, 1010, 1001, 0110, 0101 and 0011. All 4-bit strings number 2⁴ = 16, so a 4-element set has 16 subsets.'
    ],
    answer: '6 strings with two ones; 16 subsets.'
   },
   pitfalls: [
    'Counting the rows of Pascal’s triangle from 1. The top row, a single 1, is row 0, so C(n, k) sits in row n.',
    'Counting subsets as 2 × n instead of 2ⁿ. Each element doubles the number of subsets; it does not add 2.',
    'Leaving out the empty set or the whole set. The strings 00…0 and 11…1 are subsets too.'
   ]
  },
  guidance: [
   { prompt: 'In row 6 of Pascal’s triangle, what are C(6, 2) and C(6, 3), the two entries above C(7, 3)?', answer: [15, 20], labels: ['left entry above', 'right entry above'], explanation: 'C(6, 2) = 15 and C(6, 3) = 20, from the row or from n! ÷ (k! × (n − k)!).' },
   { prompt: 'Each entry of Pascal’s triangle is the sum of the two entries above it. What is 15 + 20?', answer: [35], labels: ['strings with k ones'], explanation: '15 + 20 = 35: that many 7-bit strings have exactly 3 ones.' },
   { prompt: 'Each of the 7 places in a bit string is 0 or 1. How many 7-bit strings are there in all, and so how many subsets of 7 crew?', answer: [128], labels: ['subsets'], explanation: '7 places with 2 choices each give 2⁷ = 128 strings, one for each subset.' }
  ]
 },
 {
  id: 'q16', title: 'Multiplying out the rota formula', topic: 'The binomial theorem', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'Mira’s rota formula is a bracket raised to a power, and she needs one coefficient of it without multiplying the whole thing out.',
  lesson: 'In (ax + by)ⁿ the term with xᵏyⁿ⁻ᵏ is C(n, k) × aᵏ × bⁿ⁻ᵏ × xᵏyⁿ⁻ᵏ.',
  prompt: 'Mira’s rota formula has to be multiplied out: (2x + y)⁵. Enter the coefficient of x³y² in the expansion, the number in front of it once like terms are collected (type it without commas if it is 1000 or more).',
  answer: [80], labels: ['coefficient'], tolerance: 0.01,
  hints: [
   'By the binomial theorem, the term with x³y² is C(5, 3) × (2x)³ × y².',
   'Work out C(5, 3) and 2³, and multiply them.'
  ],
  solution: 'By the binomial theorem, the term of (2x + y)⁵ with x³y² is C(5, 3) × (2x)³ × y². Here C(5, 3) = 10 and 2³ = 8, so the coefficient is 10 × 8 = 80.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Rota formula, expanded', description: 'One bracket to a power, opened up with Pascal’s triangle.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'Think of (x + y)ⁿ as n brackets multiplied together: (x + y)(x + y)…(x + y). Multiplying out means picking either x or y from every bracket and multiplying the picks, for every way of picking, then adding all those products; the result is called the expansion. A product with x from k brackets and y from the other n − k brackets is xᵏyⁿ⁻ᵏ. How many ways give it? As many as there are ways to choose which k brackets give the x: C(n, k). So the coefficient of xᵏyⁿ⁻ᵏ, the number in front of it once like terms are collected, is the binomial coefficient C(n, k), and the coefficients of (x + y)ⁿ are row n of Pascal’s triangle. This is the binomial theorem. For example (x + y)³ = x³ + 3x²y + 3xy² + y³, with row 3 being 1 3 3 1. When the brackets hold numbers too, as in (ax + by)ⁿ, each x picked brings a factor a and each y a factor b, so the term is C(n, k) × aᵏ × bⁿ⁻ᵏ × xᵏyⁿ⁻ᵏ.',
   steps: [
    'Find n, the power, and k, the power of x in the term you want; the power of y is n − k.',
    'Work out the binomial coefficient C(n, k), from Pascal’s triangle or from n! ÷ (k! × (n − k)!).',
    'Multiply it by aᵏ and by bⁿ⁻ᵏ, the numbers in front of x and y raised to their powers.'
   ],
   example: {
    prompt: 'What is the coefficient of x²y² in (x + 3y)⁴?',
    steps: [
     'n = 4 and k = 2, so the binomial coefficient is C(4, 2) = 6.',
     'The number in front of x is 1 and the number in front of y is 3: 1² = 1 and 3² = 9.',
     'Multiply: 6 × 1 × 9 = 54.'
    ],
    answer: 'The coefficient is 54: the term is 54x²y².'
   },
   pitfalls: [
    'Using C(n, k) alone and forgetting the numbers in the brackets. Each x picked from (2x + y) brings a factor 2.',
    'Multiplying the number by the power instead of raising it to the power: 2³ is 8, not 6.',
    'Mixing up which power goes with which letter. C(n, k) goes with x to the power k, and y then has power n − k.'
   ]
  },
  guidance: [
   { prompt: 'The term with x³y² picks x from 3 of the 5 brackets and y from the rest. In how many ways can those 3 brackets be chosen? Enter C(5, 3).', answer: [10], labels: ['binomial coefficient'], explanation: 'C(5, 3) = 10, the binomial coefficient in row 5 of Pascal’s triangle.' },
   { prompt: 'Each chosen x brings a factor 2 and each y a factor 1. What are 2³ and 1²?', answer: [8, 1], labels: ['number for x to its power', 'number for y to its power'], explanation: '2³ = 8 and 1² = 1.' },
   { prompt: 'Multiply the three numbers. What is 10 × 8 × 1?', answer: [80], labels: ['coefficient'], explanation: '10 × 8 × 1 = 80, so the term is 80x³y².' }
  ]
 },
 {
  id: 'q17', title: 'Order or no order?', topic: 'Chapter review: order or no order?', tier: 'Intermediate', sector: 'Crew Office',
  brief: 'The crew office has a stack of “how many ways?” requests, and Mira wants each one sorted into the right kind before it is counted.',
  lesson: 'If swapping two chosen objects gives a different outcome, count permutations, P(n, k); if it gives the same outcome, count combinations, C(n, k) = P(n, k) ÷ k!.',
  prompt: 'Mira plans a supply run that stops at 3 of the 7 domes, one after another, and a different order of stops is a different route. Is this a count of arrangements, where order matters, or of selections, where it does not? Enter 1 for a permutation or 2 for a combination, then the number of ways (type it without commas if it is 1000 or more).',
  answer: [1, 210], labels: ['1 permutation, 2 combination', 'ways'], tolerance: 0.01,
  hints: [
   'Swap two of the chosen domes around. If that gives a different outcome, order matters.',
   'For a permutation multiply 3 numbers going down from 7; for a combination, divide that product by 3!.'
  ],
  solution: 'Swapping two stops gives a different route, so order matters: this is a permutation. P(7, 3) = 7 × 6 × 5 = 210.',
  xp: 150, prereqs: ['q14', 'q16'],
  artifact: { name: 'Request sorting tray', description: 'Two slots: one for orders, one for selections.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'Every counting request in this chapter chooses k things out of n, and the whole question is whether order matters. The test is to swap two of the chosen things and ask whether the outcome changes. A route visits stops in order, so swapping two stops gives a new route; a podium ranks its winners, so swapping two gives a new result. Those are permutations, counted by P(n, k) = n × (n − 1) × … with k factors. A team, a sackful or a hand of cards is just a group, so swapping two members changes nothing. Those are combinations, counted by C(n, k) = P(n, k) ÷ k!, because each group appears once for each of its k! orders. Words like “first”, “then”, “ranked” or “different jobs” point to order; words like “team”, “group” or “together” point to no order. But the swap test decides.',
   steps: [
    'Take two of the chosen objects and swap them. If the outcome changes, order matters; if not, it does not.',
    'Count the ordered choices: P(n, k) = n × (n − 1) × … with k factors.',
    'If order matters, that is the answer. If order does not matter, divide by k! to get C(n, k).'
   ],
   example: {
    prompt: 'A dome of 5 crew must name a chair and a secretary. A second dome of 5 must send 2 people to a meeting. Count each.',
    steps: [
     'Chair and secretary are different jobs: swapping them changes the result, so it is a permutation, P(5, 2) = 5 × 4 = 20.',
     'Two people sent together are a group: swapping them changes nothing, so it is a combination, C(5, 2) = 20 ÷ 2 = 10.'
    ],
    answer: 'Chair and secretary: 20 ways (permutation). Two for the meeting: 10 ways (combination).'
   },
   pitfalls: [
    'Deciding from one word such as “choose”. People “choose” a route too, and a route has an order; use the swap test.',
    'Dividing by k! for a permutation, or forgetting it for a combination.',
    'Swapping a chosen object with one that was not chosen. The test swaps two of the chosen ones with each other.'
   ]
  },
  guidance: [
   { prompt: 'If two of the chosen domes swap places in the run, is it still the same route? Enter 1 if it changes (order matters) or 2 if it stays the same (order does not matter).', answer: [1], labels: ['1 permutation, 2 combination'], explanation: 'Swapping two stops gives a different route, so order matters: this is a permutation.' },
   { prompt: 'First count ordered choices of 3 from 7. What is 7 × 6 × 5?', answer: [210], labels: ['ordered choices'], explanation: '7 × 6 = 42 and 42 × 5 = 210: P(7, 3) = 210.' },
   { prompt: 'Order matters here, so nothing is divided out. How many ways are there?', answer: [210], labels: ['ways'], explanation: 'Each ordered choice is a different outcome, so there are 210 ways.' }
  ]
 },
 {
  id: 'q18', title: 'At least one engineer', topic: 'Counting the complement: “at least one”', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'Every packing crew needs someone who can fix the lift, and Mira wants to know how many crews meet that rule.',
  lesson: 'The number of choices with at least one of something is the number of all choices minus the number with none of it.',
  prompt: 'The packing floor has 3 engineers and 6 packers. Mira needs a crew of 3, and the crew must include at least one engineer. Enter the number of crews of 3 with no rule at all, then the number with no engineer, then the number with at least one engineer.',
  answer: [84, 20, 64], labels: ['all crews', 'crews with no engineer', 'crews with at least one engineer'], tolerance: 0.01,
  hints: [
   'With no rule, a crew is any 3 of the 9 people, in no order.',
   'A crew with no engineer is made of packers only. Every crew has either no engineer or at least one, never both, so take one count away from the other.'
  ],
  solution: 'With no rule there are C(9, 3) = 84 crews. A crew with no engineer is 3 of the 6 packers: C(6, 3) = 20. Every other crew has at least one engineer, so the count is 84 − 20 = 64. Counting the crews with exactly one, two or more engineers and adding gives the same total with far more work.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Crew rule card', description: 'All crews, minus the crews that break the rule.' },
  sources: [source.s1_1, source.s1_3],
  teaching: {
   intuition: '“At least one” is awkward to count head-on: a crew might have one engineer, or two, or three, and each case is a separate count. Its opposite is easy: a crew with no engineer at all is made only of packers. Every crew is in exactly one of the two groups, so the two counts add up to the count of all crews. This is the complement from the Store Rooms again: if U is the set of all crews and A is the set of crews with no engineer, the crews you want are the complement Aᶜ, and |Aᶜ| = |U| − |A|. Counting what you do not want and taking it away from the total is called complement counting. Look for it whenever a rule says “at least one”, “not all” or “not every”.',
   steps: [
    'Count all the choices with no rule, here C(total people, crew size).',
    'Count the choices that break the rule: crews with no engineer are crews chosen from the packers only.',
    'Subtract: all choices minus the rule-breakers is the number with at least one engineer.'
   ],
   example: {
    prompt: 'A floor has 2 engineers and 4 packers. How many crews of 2 include at least one engineer?',
    steps: [
     'All crews of 2 from 6 people: C(6, 2) = 15.',
     'Crews of 2 from the 4 packers only: C(4, 2) = 6.',
     'Subtract: 15 − 6 = 9. (Check: 2 × 4 = 8 crews with one engineer and 1 crew with both makes 9.)'
    ],
    answer: '9 crews.'
   },
   pitfalls: [
    'Counting “one engineer, then anyone else”: C(engineers, 1) × C(everyone else, k − 1). That counts a crew with two engineers twice.',
    'Taking away the crews with exactly one engineer instead of the crews with none.',
    'Choosing the no-engineer crews from all the people. They must be chosen from the packers only.'
   ]
  },
  guidance: [
   { prompt: 'How many people are there in all, and how many crews of 3 can be made from them with no rule?', answer: [9, 84], labels: ['people', 'all crews'], explanation: '3 + 6 = 9 people, and C(9, 3) = 84 crews.' },
   { prompt: 'How many crews of 3 can be made from the 6 packers alone?', answer: [20], labels: ['crews with no engineer'], explanation: 'C(6, 3) = 20: these are exactly the crews with no engineer.' },
   { prompt: 'Take away the crews with no engineer. What is 84 − 20?', answer: [64], labels: ['crews with at least one engineer'], explanation: '84 − 20 = 64 crews have at least one engineer.' }
  ]
 },
 {
  id: 'q19', title: 'Sharing out the water crates', topic: 'Stars and bars', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'A delivery of identical water crates has to be split between the domes, and Mira wants to know how many different splits are possible.',
  lesson: 'Sharing n identical objects among k groups can be done in C(n + k − 1, k − 1) ways, or C(n − 1, k − 1) ways if every group gets at least one.',
  prompt: 'A delivery of 8 identical crates of water must be shared among 3 domes; all that matters is how many crates each dome gets. Enter the number of ways if a dome may get no crates, then the number of ways if every dome gets at least one crate.',
  answer: [45, 21], labels: ['ways, none allowed', 'ways, at least one each'], tolerance: 0.01,
  hints: [
   'Write the 8 crates as stars in a row and put 2 bars among them to cut the row into 3 groups, one group per dome. Count the ways to choose which of the 10 places in the row hold bars.',
   'For “at least one each”, first give every dome one crate, then share the 5 crates that are left with no rule.'
  ],
  solution: 'A sharing is a row of 8 stars and 2 bars: 10 symbols, and the bars can be in any 2 of the 10 places. So there are C(10, 2) = 45 ways when a dome may get none. If every dome gets at least one crate, hand one to each dome first; the other 5 are shared freely, as 5 stars and 2 bars, in C(7, 2) = 21 ways.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Stars-and-bars chalkboard', description: 'A row of stars cut into groups by a few bars.' },
  sources: [source.s1_5],
  teaching: {
   intuition: 'When the objects are identical, a sharing is only a list of how many each group gets. Picture the crates as stars in a row: ★★★★★. To share them among 3 domes, drop 2 bars into the row: ★★|★|★★ means 2 for the first dome, 1 for the second and 2 for the third. A bar at the very start or two bars side by side mean a dome with nothing: |★★★|★★ is 0, 3, 2. Every row of stars and bars gives one sharing, and every sharing gives one row. So with n stars and k − 1 bars, there are n + k − 1 places in the row, and a sharing is fixed by choosing which k − 1 of them hold bars: C(n + k − 1, k − 1) ways. This picture is called stars and bars. If every group must get at least one, give each group one object first. Then n − k objects are left and can be shared with no rule, in C(n − 1, k − 1) ways.',
   steps: [
    'Count the stars (the identical objects, n) and the bars (one fewer than the groups, k − 1).',
    'With no lower limit, choose the places of the bars among all n + k − 1 places: C(n + k − 1, k − 1).',
    'If each group needs at least one, hand out one to each group first, then share the n − k that are left the same way.'
   ],
   example: {
    prompt: 'In how many ways can 4 identical crates be shared among 3 domes, first with no rule, then with at least one crate for each dome?',
    steps: [
     '4 stars and 2 bars make 6 places, so there are C(6, 2) = 15 ways with no rule.',
     'With at least one each, give each dome a crate. 1 crate is left: 1 star and 2 bars, C(3, 2) = 3 ways.'
    ],
    answer: '15 ways with no rule; 3 ways with at least one each.'
   },
   pitfalls: [
    'Using k bars for k groups. It takes only k − 1 bars to cut a row into k groups.',
    'Choosing the places of the bars among the stars only. The bars are part of the row, so there are n + k − 1 places.',
    'Using stars and bars when the objects are all different. Then who gets which object matters, and the count is different.'
   ]
  },
  guidance: [
   { prompt: 'How many symbols are in a row of 8 stars and 2 bars, and in how many ways can the bars be placed among them?', answer: [10, 45], labels: ['symbols', 'ways, none allowed'], explanation: '8 + 2 = 10 symbols. Choosing the 2 places for the bars gives C(10, 2) = 45.' },
   { prompt: 'Now every dome must get at least one crate. Give each dome one crate first. How many crates are left to share?', answer: [5], labels: ['crates left'], explanation: '8 − 3 = 5 crates are left, and they can go anywhere.' },
   { prompt: 'Share the 5 crates with no rule: 5 stars and 2 bars. How many ways is that?', answer: [21], labels: ['ways, at least one each'], explanation: '5 + 2 = 7 symbols, so C(7, 2) = 21 ways.' }
  ]
 },
 {
  id: 'q20', title: 'Codes kept for special stock', topic: 'Inclusion–exclusion with three sets', tier: 'Intermediate', sector: 'Packing Floor',
  brief: 'Some crate codes are held back for special stock, and Mira wants to know how many ordinary codes are left without checking every one.',
  lesson: '|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|.',
  prompt: 'Crate codes run from 1 to 200. Every code that is a multiple of 2, 3 or 5 is kept for special stock. Enter how many codes are multiples of at least one of 2, 3 and 5, then how many are multiples of none of them.',
  answer: [146, 54], labels: ['multiples of at least one', 'multiples of none'], tolerance: 0.01,
  hints: [
   'The number of multiples of 2 from 1 to 200 is 200 ÷ 2 with any decimal part thrown away. No two of the three numbers share a factor, so a code that is a multiple of both 2 and 3 is a multiple of 6.',
   'Add the three single counts, take away the three pair counts, then add back the count of multiples of all three, which are the multiples of 30.'
  ],
  solution: 'Multiples of 2: 100; of 3: 66; of 5: 40; together 206. Multiples of 6: 33; of 10: 20; of 15: 13; together 66. Multiples of 30: 6. By inclusion–exclusion, 206 − 66 + 6 = 146 codes are multiples of at least one of the three, so 200 − 146 = 54 are multiples of none.',
  xp: 150, prereqs: ['q05', 'q14'],
  artifact: { name: 'Held-code register', description: 'Three overlapping lists of codes, counted without double counting.' },
  sources: [source.s1_6],
  teaching: {
   intuition: 'Adding the sizes of three overlapping sets counts some elements more than once. In a three-set Venn diagram an element in exactly two of the sets is counted twice, and an element in all three is counted three times. So take away the three pairwise intersections. Now the elements in two sets are counted once, as they should be, but an element in all three was added three times and taken away three times, so it is not counted at all: add the triple intersection back. That gives |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|. Adding, taking away and adding back like this is called inclusion–exclusion. For codes from 1 to N, the multiples of a number d are d, 2d, 3d, …, so there are N ÷ d of them with the decimal part thrown away: from 1 to 20 there are 6 multiples of 3, because 20 ÷ 3 is about 6.67. When two numbers have no common factor bigger than 1, as with 2 and 3, a code is a multiple of both exactly when it is a multiple of their product, 6. The codes that are multiples of none are then N minus the union.',
   steps: [
    'Count the multiples of each of the three numbers: N divided by the number, with the decimal part thrown away.',
    'Count the multiples of each product of two of them, and of the product of all three.',
    'Combine: the three singles, minus the three pairs, plus the triple, gives the codes that are multiples of at least one.',
    'Take that away from N to get the codes that are multiples of none.'
   ],
   example: {
    prompt: 'Of the codes 1 to 50, how many are multiples of none of 2, 3 and 7?',
    steps: [
     'Singles: 25 multiples of 2, 16 of 3 and 7 of 7, which make 48.',
     'Pairs: 8 multiples of 6, 3 of 14 and 2 of 21, which make 13. Triple: 1 multiple of 42.',
     'At least one: 48 − 13 + 1 = 36. None: 50 − 36 = 14.'
    ],
    answer: '14 codes.'
   },
   pitfalls: [
    'Stopping after taking away the pairs. The codes in all three sets are then not counted at all, so the triple must be added back.',
    'Rounding N ÷ d to the nearest whole number. A part of a multiple is not a multiple, so always throw the decimal part away.',
    'Giving the union when the question asks for none, or the other way round. None is N minus the union.'
   ]
  },
  guidance: [
   { prompt: 'How many codes from 1 to 200 are multiples of 2, how many of 3, and how many of 5?', answer: [100, 66, 40], labels: ['multiples of the first', 'multiples of the second', 'multiples of the third'], explanation: '200 ÷ 2, 200 ÷ 3 and 200 ÷ 5, each without its decimal part: 100, 66 and 40.' },
   { prompt: 'Codes that are multiples of two of the numbers were counted twice. How many are multiples of 6, of 10 and of 15?', answer: [33, 20, 13], labels: ['multiples of the first pair', 'multiples of the second pair', 'multiples of the third pair'], explanation: '200 ÷ 6, 200 ÷ 10 and 200 ÷ 15 without decimal parts: 33, 20 and 13.' },
   { prompt: 'How many codes are multiples of 30? Then put the counts together: the singles, minus the pairs, plus this one.', answer: [6, 146], labels: ['multiples of all three', 'multiples of at least one'], explanation: 'Multiples of 30: 6. Then 206 − 66 + 6 = 146 codes are multiples of at least one of the three.' },
   { prompt: 'Take those away from all 200 codes. How many are multiples of none of the three?', answer: [54], labels: ['multiples of none'], explanation: '200 − 146 = 54 codes are multiples of none of 2, 3 and 5.' }
  ]
 }
);
})();
