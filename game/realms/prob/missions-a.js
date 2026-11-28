/* Probability missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/prob/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · Outcomes, sample space and equally likely probability [CM 7.5, IS 3.1]
     q02  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · Probability as long-run relative frequency [IS 3.1]
     q03  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · The complement rule [CM 7.5]
     q04  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · Two-stage outcomes in a grid or tree [CM 7.4]
     q05  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · Events: "and", "or", Venn diagrams, mutually exclusive [IS 3.2, 3.5]
     q06  ch 1 Chance and outcomes · Basic, 100 XP · sector 'Dispatch Office' · The addition rule [IS 3.3, CM 7.8]
     q07  ch 2 Conditions and independence · Basic, 100 XP · sector 'Sorting Shed' · Conditional probability from a two-way table [IS 3.4]
     q08  ch 2 Conditions and independence · Basic, 100 XP · sector 'Sorting Shed' · The multiplication rule: drawing without replacement [IS 3.3, CM 7.9]
     q09  ch 2 Conditions and independence · Basic, 100 XP · sector 'Sorting Shed' · Independent events [IS 3.2]
     q10  ch 2 Conditions and independence · Basic, 100 XP · sector 'Sorting Shed' · Tree diagrams and the total probability of an outcome [IS 3.5] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e, Contemporary Mathematics and Principles of Data Science sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Introductory Statistics 2e — 3.4 Contingency Tables
   Link to the section page itself: https://openstax.org/books/introductory-statistics-2e/pages/<section-slug> */
const source = {
 cm7_4: { title: 'OpenStax Contemporary Mathematics — 7.4 Tree Diagrams, Tables, and Outcomes', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-4-tree-diagrams-tables-and-outcomes', description: 'Listing the outcomes of a multi-stage experiment with tables and tree diagrams.', verified: '2026-11-27' },
 cm7_5: { title: 'OpenStax Contemporary Mathematics — 7.5 Basic Concepts of Probability', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-5-basic-concepts-of-probability', description: 'Sample spaces, events, equally likely outcomes and the complement rule.', verified: '2026-11-27' },
 cm7_8: { title: 'OpenStax Contemporary Mathematics — 7.8 The Addition Rule for Probability', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-8-the-addition-rule-for-probability', description: 'The chance of “A or B”, with and without mutually exclusive events.', verified: '2026-11-27' },
 cm7_9: { title: 'OpenStax Contemporary Mathematics — 7.9 Conditional Probability and the Multiplication Rule', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-9-conditional-probability-and-the-multiplication-rule', description: 'Conditional probability and the chance that two events both happen.', verified: '2026-11-27' },
 is3_1: { title: 'OpenStax Introductory Statistics 2e — 3.1 Terminology', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology', description: 'Outcomes, sample spaces, events, equally likely outcomes and long-run relative frequency.', verified: '2026-11-27' },
 is3_2: { title: 'OpenStax Introductory Statistics 2e — 3.2 Independent and Mutually Exclusive Events', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events', description: 'Independent events, mutually exclusive events and how to test for each.', verified: '2026-11-27' },
 is3_3: { title: 'OpenStax Introductory Statistics 2e — 3.3 Two Basic Rules of Probability', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability', description: 'The multiplication rule and the addition rule.', verified: '2026-11-27' },
 is3_4: { title: 'OpenStax Introductory Statistics 2e — 3.4 Contingency Tables', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables', description: 'Reading probabilities and conditional probabilities from a two-way table.', verified: '2026-11-27' },
 is3_5: { title: 'OpenStax Introductory Statistics 2e — 3.5 Tree and Venn Diagrams', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams', description: 'Tree diagrams for multi-stage chances and Venn diagrams for events.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'The token bag', topic: 'Outcomes, sample space and equally likely probability', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'Mira has started picking supply routes out of a bag, and before she pins tomorrow’s choice to the odds board she wants the chance of each colour as a number.',
  lesson: 'When every outcome is equally likely, the probability of an event is the number of outcomes in the event divided by the number of outcomes in the sample space.',
  prompt: 'Mira chooses tomorrow’s supply route by drawing one token from a bag without looking. The bag holds 5 red tokens, 6 green tokens and 4 yellow tokens, and every token is equally likely to be drawn. Enter the number of outcomes in the sample space, then P(green) as a fraction in lowest terms: its numerator, then its denominator.',
  answer: [15, 2, 5], labels: ['outcomes in the sample space', 'numerator', 'denominator'], tolerance: 0.01,
  hints: [
   'Each token is one outcome, so the sample space has one outcome for every token in the bag.',
   'P(green) is the number of green outcomes divided by the number of outcomes in all. Then divide the top and the bottom by the biggest whole number that goes into both.'
  ],
  solution: 'The sample space has 5 + 6 + 4 = 15 equally likely outcomes, one for each token. The event “green” is made of 6 of them, so P(green) = 6/15. Both 6 and 15 divide by 3, so in lowest terms P(green) = 2/5.',
  xp: 100, prereqs: [],
  artifact: { name: 'The first token', description: 'A green token, the first chance ever pinned to the odds board.' },
  sources: [source.cm7_5, source.is3_1],
  teaching: {
   intuition: 'Drawing a token from a bag without looking is a chance process: you cannot say in advance what will happen, but you can list everything that could. Each possible result is an outcome, and the list of all of them is the sample space. If the bag holds 12 tokens, the sample space has 12 outcomes, one per token. An event is any group of outcomes you care about, such as “the token is blue”. When the tokens are mixed well and drawn blind, no token is favoured, so every outcome is equally likely. Then the probability of an event, the number that says how likely it is, is a fraction: the outcomes in the event divided by all the outcomes. We write it P(event), so P(blue) is “the probability of blue”. A probability is always between 0 and 1: 0 means it cannot happen and 1 means it is certain.',
   steps: [
    'List or count the outcomes: one for each equally likely result. Their number is the size of the sample space.',
    'Count the outcomes that belong to the event.',
    'Divide: P(event) = outcomes in the event ÷ outcomes in the sample space, written as a fraction.',
    'Reduce the fraction to lowest terms by dividing the top and the bottom by the largest whole number that goes into both.'
   ],
   example: {
    prompt: 'A bag holds 3 blue tokens and 9 white tokens. One is drawn without looking. What is P(blue)?',
    steps: [
     'The sample space has 3 + 9 = 12 equally likely outcomes.',
     'The event “blue” has 3 of them, so P(blue) = 3/12.',
     '3 and 12 both divide by 3, so 3/12 = 1/4.'
    ],
    answer: 'P(blue) = 1/4: about one draw in four is blue.'
   },
   pitfalls: [
    'Dividing by the number of other tokens instead of all the tokens: with 3 blue and 9 white, P(blue) is 3/12, not 3/9.',
    'Counting colours instead of tokens. Three colours do not make three equally likely outcomes when there are more tokens of one colour.',
    'Leaving the fraction unreduced, such as 6/15 instead of 2/5. Both are the same number, but the answer boxes ask for lowest terms.'
   ]
  },
  guidance: [
   { prompt: 'How many tokens are in the bag altogether? That is the number of outcomes in the sample space.', answer: [15], labels: ['outcomes'], explanation: '5 + 6 + 4 = 15. Each token is one equally likely outcome.' },
   { prompt: 'Write P(green) as the number of green outcomes over the number of all outcomes, before simplifying.', answer: [6, 15], labels: ['numerator', 'denominator'], explanation: '6 of the 15 outcomes are green, so P(green) = 6/15.' },
   { prompt: 'Write 6/15 in lowest terms.', answer: [2, 5], labels: ['numerator', 'denominator'], explanation: '6 and 15 both divide by 3: 6 ÷ 3 = 2 and 15 ÷ 3 = 5, so 6/15 = 2/5.' }
  ]
 },
 {
  id: 'q02', title: 'The on-time log', topic: 'Probability as long-run relative frequency', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'Supply runs have no bag of tokens to count, so Mira wants the dispatch log turned into a chance of arriving on time and a forecast for the runs ahead.',
  lesson: 'The relative frequency of an event is how often it happened divided by how many chances it had; over many repeats it settles near the probability.',
  prompt: 'The dispatch log covers the last 40 supply runs, and 34 of them arrived on time. Enter the relative frequency of on-time runs as a decimal, then the number of the next 60 runs you would expect to arrive on time if the pattern holds.',
  answer: [0.85, 51], labels: ['relative frequency', 'expected on-time runs'], tolerance: 0.005,
  hints: [
   'A relative frequency is the number of times something happened divided by the number of times it could have happened: here 34 ÷ 40.',
   'Use the relative frequency as the probability of an on-time run, and multiply it by the number of runs to come, 60.'
  ],
  solution: 'The relative frequency is 34 ÷ 40 = 0.85. Taken as the probability that a run arrives on time, it predicts 60 × 0.85 = 51 on-time runs out of the next 60. The real count will land a little either side, but over many runs the share settles close to 0.85.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The dispatch log', description: 'A column of ticks and crosses, one for each supply run.' },
  sources: [source.is3_1],
  teaching: {
   intuition: 'Some chances cannot be counted from a bag. Nobody can list equally likely outcomes for a shuttle arriving on time, because wind, dust and engines all play a part. What we can do is watch. If a thing happened 18 times out of 24 chances, its relative frequency is 18 ÷ 24 = 0.75. Repeat the process a few times and the relative frequency jumps about; repeat it many times and it settles down near one value. That value is what we mean by the probability, so a relative frequency from a long record is a good estimate of it. Once we have the probability we can forecast: if each run arrives on time with probability 0.75, then in 40 runs we expect about 40 × 0.75 = 30 on time. “Expect” means about that many, not exactly that many.',
   steps: [
    'Count how many times the event happened and how many times it could have happened.',
    'Divide the first count by the second. That decimal is the relative frequency.',
    'Use the relative frequency as the probability of the event on the next try.',
    'To forecast a number of tries, multiply: expected count = number of tries × probability.'
   ],
   example: {
    prompt: 'In 25 test drops, a cargo parachute opened fully 21 times. Estimate the probability that it opens fully, then the expected number of full openings in the next 50 drops.',
    steps: [
     'The relative frequency is 21 ÷ 25 = 0.84.',
     'Take 0.84 as the probability, then 50 × 0.84 = 42.'
    ],
    answer: 'About 0.84, and about 42 full openings in 50 drops.'
   },
   pitfalls: [
    'Dividing the wrong way round. The count of times it happened goes on top: 21 ÷ 25, not 25 ÷ 21, and a probability is never above 1.',
    'Expecting the forecast to come out exactly. An expected count is the centre of what will happen; the real count lands a little either side.',
    'Trusting a short record. Three runs out of three on time does not make the probability 1; the share only settles over many runs.'
   ]
  },
  guidance: [
   { prompt: 'Divide the number of on-time runs by the number of runs in the log. What is 34 ÷ 40?', answer: [0.85], labels: ['relative frequency'], explanation: '34 ÷ 40 = 0.85, so 85% of the logged runs were on time.' },
   { prompt: 'If each run is on time with probability 0.85, how many of the next 60 runs do you expect on time? Work out 60 × 0.85.', answer: [51], labels: ['expected on-time runs'], explanation: '60 × 0.85 = 51. That is the expected count; the real one will usually be close to it, not exactly on it.' }
  ]
 },
 {
  id: 'q03', title: 'The canyon card', topic: 'The complement rule', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'The canyon route is the risky one, and the drivers would rather know their chance of avoiding it than the chance of getting it.',
  lesson: 'The complement A′ of an event A is every outcome not in A, and P(A′) = 1 − P(A).',
  prompt: 'Each morning dispatch draws one card from a deck of 40 route cards, all equally likely. Let A be the event “the card names the canyon route”, and P(A) = 0.35. Enter P(A′), the probability that the card does not name the canyon route, as a decimal, then the number of cards in the deck that do not name the canyon route.',
  answer: [0.65, 26], labels: ['P(A′)', 'cards not for the canyon'], tolerance: 0.005,
  hints: [
   'A′ means “not A”. Every outcome is in A or in A′ and never in both, so P(A) + P(A′) = 1.',
   'The cards are equally likely, so a probability is a count of cards divided by 40. Turn it back into a count by multiplying by 40.'
  ],
  solution: 'P(A′) = 1 − P(A) = 1 − 0.35 = 0.65. The cards are equally likely, so P(A′) is the number of cards that do not name the canyon divided by 40, and that number is 40 × 0.65 = 26. Check: 40 × 0.35 = 14 cards name the canyon, and 14 + 26 = 40.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The route deck', description: 'A worn deck of route cards, a few of them marked with a canyon.' },
  sources: [source.cm7_5],
  teaching: {
   intuition: 'Every outcome either belongs to an event or it does not. The outcomes that are not in an event A make up a second event, called the complement of A and written A′, read “A prime” or simply “not A”. A and A′ split the sample space into two parts with nothing left over and nothing shared, so their probabilities add up to 1, the chance of something happening at all. That gives the complement rule: P(A′) = 1 − P(A). If the chance of rain is 0.3, the chance of no rain is 1 − 0.3 = 0.7. The rule is often the quickest road to an answer, because “not A” can be much harder to count directly than A. When the outcomes are equally likely, a probability is also a share of a count, so multiplying it by the number of outcomes turns it back into a count.',
   steps: [
    'Name the event A and read off P(A).',
    'The complement A′ is everything that is not A.',
    'Subtract: P(A′) = 1 − P(A).',
    'With equally likely outcomes, the number of outcomes in A′ is P(A′) × the number of outcomes in the sample space.'
   ],
   example: {
    prompt: 'A spinner has 20 equal sections, and P(red) = 0.15. Find P(not red) and the number of sections that are not red.',
    steps: [
     'P(not red) = 1 − 0.15 = 0.85.',
     'The sections are equally likely, so 20 × 0.85 = 17 sections are not red.'
    ],
    answer: 'P(not red) = 0.85, and 17 sections are not red.'
   },
   pitfalls: [
    'Subtracting from 100 instead of 1. Probabilities as decimals run from 0 to 1, so the complement of 0.35 is 0.65, not 99.65.',
    'Thinking A′ is a separate, unrelated event. It is exactly the outcomes left over once A is taken out.',
    'Giving the count of A instead of A′. Check that the two counts add up to the whole sample space.'
   ]
  },
  guidance: [
   { prompt: 'A′ is the complement of A: every outcome not in A. What is 1 − 0.35?', answer: [0.65], labels: ['P(A′)'], explanation: '1 − 0.35 = 0.65. A and A′ share the whole sample space between them, so their probabilities add to 1.' },
   { prompt: '0.65 of the 40 equally likely cards do not name the canyon. How many cards is that? Work out 40 × 0.65.', answer: [26], labels: ['cards'], explanation: '40 × 0.65 = 26 cards.' }
  ]
 },
 {
  id: 'q04', title: 'The two training spinners', topic: 'Two-stage outcomes in a grid', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'New dispatchers learn their odds on two spinners, and Mira wants the chance of one total worked out before the trainees start betting on it.',
  lesson: 'When two stages happen one after the other, a grid with one row per first result and one column per second result lists every outcome once.',
  prompt: 'New dispatchers practise on two fair spinners. The first has 4 equal sections numbered 1 to 4, and the second has 6 equal sections numbered 1 to 6. Both are spun once, and one spin does not affect the other. The two numbers are added. Enter the number of cells in the grid of all outcomes (first spinner down the side, second along the top), then P(sum = 7) as a fraction in lowest terms: numerator, then denominator.',
  answer: [24, 1, 6], labels: ['cells in the grid', 'numerator', 'denominator'], tolerance: 0.01,
  hints: [
   'The grid has one row for each number on the first spinner and one column for each number on the second, so the number of cells is rows × columns.',
   'Go down the rows: in row 1 the second spinner must show 7 − 1, in row 2 it must show 7 − 2, and so on. Count the rows where that number is really on the second spinner.'
  ],
  solution: 'The grid has 4 rows and 6 columns, so it has 4 × 6 = 24 equally likely cells. The cells with sum 7 are (1, 6), (2, 5), (3, 4), (4, 3): 4 of them. So P(sum = 7) = 4/24, which is 1/6 in lowest terms.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The spinner grid', description: 'A chalk grid of every pair the two spinners can show.' },
  sources: [source.cm7_4],
  teaching: {
   intuition: 'Spin two spinners and the result is a pair: what the first shows and what the second shows. To list every pair once, draw a grid. Put the first spinner’s numbers down the side, one per row, and the second spinner’s along the top, one per column. Each cell is one outcome, the pair of its row and its column. A first spinner with 3 sections and a second with 5 make a grid of 3 × 5 = 15 cells, and if both spinners are fair and one spin does not affect the other, every cell is equally likely. So the probability of an event is the number of cells in it divided by all the cells, exactly as with tokens in a bag. Do not count totals instead of cells: a sum of 2 can only come from one cell, while a sum in the middle comes from several, so the totals are not equally likely even though the cells are.',
   steps: [
    'Draw the grid: one row for each result of the first stage, one column for each result of the second.',
    'Count the cells: rows × columns. Every cell is one equally likely outcome.',
    'Mark the cells that belong to the event, for example every cell whose two numbers add to the target.',
    'P(event) = marked cells ÷ all cells, reduced to lowest terms.'
   ],
   example: {
    prompt: 'Two fair spinners are each numbered 1 to 3. Both are spun and the numbers added. What is P(sum = 4)?',
    steps: [
     'The grid has 3 × 3 = 9 cells.',
     'The sum is 4 in the cells (1, 3), (2, 2) and (3, 1): 3 cells.',
     'P(sum = 4) = 3/9 = 1/3.'
    ],
    answer: 'P(sum = 4) = 1/3.'
   },
   pitfalls: [
    'Treating the totals as equally likely. With two spinners numbered 1 to 3 the sums 2 to 6 are five totals, but P(sum = 4) is 3/9, not 1/5.',
    'Counting (2, 5) and (5, 2) as one cell. The first spinner showing 2 and the second showing 5 is a different outcome from the other way round.',
    'Adding the spinner sizes instead of multiplying them to get the number of cells.'
   ]
  },
  guidance: [
   { prompt: 'The grid has a row for each of the 4 numbers on the first spinner and a column for each of the 6 on the second. How many cells does it have?', answer: [24], labels: ['cells'], explanation: '4 × 6 = 24 cells, one for each pair (first, second), and every cell is equally likely.' },
   { prompt: 'List the pairs (first, second) whose numbers add to 7. How many are there?', answer: [4], labels: ['cells with the sum'], explanation: 'They are (1, 6), (2, 5), (3, 4), (4, 3): 4 cells.' },
   { prompt: 'Write 4/24 in lowest terms.', answer: [1, 6], labels: ['numerator', 'denominator'], explanation: '4 and 24 both divide by 4, so 4/24 = 1/6.' }
  ]
 },
 {
  id: 'q05', title: 'Fragile, cold or both', topic: 'Events with “and” and “or”, Venn diagrams, mutually exclusive', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'A supply run has dumped a pile of crates on the dispatch floor, and Mira needs to know how many need careful handling of one kind or the other.',
  lesson: '“A or B” is every outcome in A, in B or in both; “A and B” is only the outcomes in both; a Venn diagram shows them as circles and their overlap.',
  prompt: 'A supply run has unloaded its crates, and Mira sorts them on a Venn diagram. Circle F holds the fragile crates and circle C holds the crates that must be kept cold. Circle F holds 10 crates in all, and 7 of them sit outside the overlap. 5 crates sit in C outside the overlap, and 10 sit outside both circles. Enter the number of crates in the event “F or C”, then the number in the event “F and C”.',
  answer: [15, 3], labels: ['crates in F or C', 'crates in F and C'], tolerance: 0.01,
  hints: [
   '“F or C” means in F, in C, or in both: every crate inside at least one circle. The crates outside both circles are not in it.',
   '“F and C” means in both circles at once: the overlap. Circle F is made of its crates outside the overlap and the overlap itself, so take the first from F’s total.'
  ],
  solution: 'Circle F holds 10 crates and 7 of them sit outside the overlap, so the overlap, “F and C”, holds 10 − 7 = 3 crates. “F or C” is everything inside the circles: 7 + 3 + 5 = 15 crates. The 10 crates outside both circles are in neither event. F and C are not mutually exclusive, because 3 crates are in both.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The chalk circles', description: 'Two overlapping circles chalked on the dispatch floor.' },
  sources: [source.is3_2, source.is3_5],
  teaching: {
   intuition: 'Two events can be joined in two ways. “A or B” happens when A happens, B happens, or both do: it is every outcome in at least one of them. “A and B” happens only when both happen at once. A Venn diagram makes this easy to see. Draw a box for the sample space, and inside it one circle for A and one for B. Where the circles overlap sit the outcomes in both, “A and B”. Everything inside either circle is “A or B”, and the outcomes outside both circles are in neither event. Two events with no overlap, so that they can never happen together, are called mutually exclusive: a single token cannot be both red and green. Watch the overlap when you add: the total in A plus the total in B counts the overlap twice.',
   steps: [
    'Read the Venn diagram as four regions: in A only, in both, in B only, and outside both.',
    '“A and B” is the overlap region alone.',
    '“A or B” is the three regions inside the circles added together. Equivalently, the total in A plus the total in B, minus the overlap once.',
    'If the overlap is empty, the events are mutually exclusive and “A and B” has nothing in it.'
   ],
   example: {
    prompt: 'Circle S holds the sealed crates and circle H the heavy ones. 5 crates are in S only, 2 in the overlap, 4 in H only and 8 outside both. How many are in “S or H”, and how many in “S and H”?',
    steps: [
     '“S or H” is inside the circles: 5 + 2 + 4 = 11.',
     '“S and H” is the overlap: 2.',
     'The 8 outside are in neither.'
    ],
    answer: '11 crates in “S or H”, 2 in “S and H”.'
   },
   pitfalls: [
    'Adding the two circle totals without taking off the overlap, which counts the crates in both twice.',
    'Reading “or” as “one but not the other”. In probability “A or B” includes the outcomes in both.',
    'Counting the outcomes outside both circles in “A or B”. They belong to neither event.'
   ]
  },
  guidance: [
   { prompt: 'Circle F holds 10 crates, and 7 of them sit outside the overlap. How many crates are in both circles at once, the event “F and C”?', answer: [3], labels: ['crates in F and C'], explanation: '10 − 7 = 3. The overlap is the only part of F that is inside C as well.' },
   { prompt: 'How many crates are in circle C altogether? Remember that the overlap is inside C too.', answer: [8], labels: ['crates in C'], explanation: 'C holds 5 + 3 = 8 crates.' },
   { prompt: 'Adding 10 and 8 counts the overlap twice. How many crates are in “F or C”? Work out 10 + 8 − 3.', answer: [15], labels: ['crates in F or C'], explanation: '10 + 8 − 3 = 15, the same as adding the three regions inside the circles, 7 + 3 + 5.' }
  ]
 },
 {
  id: 'q06', title: 'Dust or a fault', topic: 'The addition rule', tier: 'Basic', sector: 'Dispatch Office',
  brief: 'The odds board needs one number for a run being held up at all, whatever the reason.',
  lesson: 'The addition rule: P(A or B) = P(A) + P(B) − P(A and B); for mutually exclusive events the last term is 0.',
  prompt: 'From the dispatch records, a supply run is held up by dust with probability 0.35, by an engine fault with probability 0.2, and by both with probability 0.08. Enter P(dust or fault), the probability that a run is held up by at least one of the two, as a decimal.',
  answer: [0.47], labels: ['P(dust or fault)'], tolerance: 0.005,
  hints: [
   'Adding P(dust) and P(fault) counts the runs held up by both twice, once in each.',
   'Subtract P(dust and fault) once, so the overlap is counted only once.'
  ],
  solution: 'By the addition rule, P(dust or fault) = P(dust) + P(fault) − P(dust and fault) = 0.35 + 0.2 − 0.08 = 0.55 − 0.08 = 0.47.',
  xp: 100, prereqs: ['q05'],
  artifact: { name: 'The hold-up tally', description: 'A tally of runs held up by dust, by faults and by both.' },
  sources: [source.is3_3, source.cm7_8],
  teaching: {
   intuition: 'The Venn diagram of crates showed that adding the two circles counts the overlap twice. The same is true of probabilities, which are shares of the sample space. P(A) covers all of circle A, overlap included, and P(B) covers all of circle B, overlap included. So P(A) + P(B) counts the overlap twice, and taking P(A and B) off once fixes it. That is the addition rule: P(A or B) = P(A) + P(B) − P(A and B). For two mutually exclusive events there is no overlap, P(A and B) = 0, and the rule is plain adding. The rule works with probabilities from a log or a forecast, not only with counts, so it is how the odds board combines chances it already has.',
   steps: [
    'Read off P(A), P(B) and P(A and B).',
    'Add P(A) and P(B). This counts the overlap twice.',
    'Subtract P(A and B) once: P(A or B) = P(A) + P(B) − P(A and B).',
    'Check: the answer is at least the larger of P(A) and P(B), and at most 1.'
   ],
   example: {
    prompt: 'A run is late with probability 0.4, damaged with probability 0.3, and both late and damaged with probability 0.1. What is P(late or damaged)?',
    steps: [
     'Add: 0.4 + 0.3 = 0.7.',
     'Take off the overlap once: 0.7 − 0.1 = 0.6.'
    ],
    answer: 'P(late or damaged) = 0.6.'
   },
   pitfalls: [
    'Just adding P(A) and P(B). That is only right when the events are mutually exclusive.',
    'Subtracting the overlap twice. It was counted twice, so it comes off once.',
    'An answer above 1 is a sure sign the overlap was not taken off.'
   ]
  },
  guidance: [
   { prompt: 'Add P(dust) and P(fault). What is 0.35 + 0.2?', answer: [0.55], labels: ['P(dust) + P(fault)'], explanation: '0.35 + 0.2 = 0.55. This counts the runs held up by both twice.' },
   { prompt: 'Take the overlap off once. What is 0.55 − 0.08?', answer: [0.47], labels: ['P(dust or fault)'], explanation: '0.55 − 0.08 = 0.47, the chance that a run is held up by dust, by a fault, or by both.' }
  ]
 },
 {
  id: 'q07', title: 'The Tycho row', topic: 'Conditional probability from a two-way table', tier: 'Basic', sector: 'Sorting Shed',
  brief: 'The shed has a crate whose label says only “Tycho Works”, and Mira wants to know how worried to be about it before it is opened.',
  lesson: 'P(A | B), the probability of A given B, counts only the outcomes in B: it is the outcomes in both divided by the outcomes in B.',
  prompt: 'The sorting shed’s two-way table counts this month’s crates by supplier and condition. Rhea Depot: 42 intact, 8 cracked. Tycho Works: 27 intact, 9 cracked. A crate is picked at random from the whole shed, and you are told it came from Tycho Works. Enter P(cracked | Tycho), the probability that it is cracked given that it came from Tycho Works, as a fraction in lowest terms: numerator, then denominator.',
  answer: [1, 4], labels: ['numerator', 'denominator'], tolerance: 0.01,
  hints: [
   '“Given Tycho” means you look only at the Tycho Works row of the table. Rhea’s crates are no longer possible outcomes.',
   'Divide the cracked crates in that row by the total of that row, then reduce the fraction.'
  ],
  solution: 'Given that the crate came from Tycho Works, the sample space shrinks to that row: 27 + 9 = 36 crates. 9 of them are cracked, so P(cracked | Tycho) = 9/36 = 1/4. Across the whole shed 17 of 86 crates are cracked, a different share: knowing the supplier changes the chance.',
  xp: 100, prereqs: ['q06'],
  artifact: { name: 'The shed ledger', description: 'A two-way table of crates by supplier and condition.' },
  sources: [source.is3_4],
  teaching: {
   intuition: 'Knowing something about an outcome can change its chances. A two-way table sorts every crate in two ways at once: one way down the side, such as the supplier, and one way along the top, such as the condition. Each cell counts the crates that fit its row and its column. Now suppose you are told a crate came from one particular supplier. Every crate from the other suppliers is ruled out, so the sample space shrinks to that supplier’s row. The chance of “cracked” is now the cracked crates in that row divided by the row’s total. This is a conditional probability, written P(cracked | Tycho), where the upright bar | is read “given”. In general P(A | B) = (outcomes in A and B) ÷ (outcomes in B). The order matters: P(cracked | Tycho) looks inside the Tycho row, while P(Tycho | cracked) would look inside the cracked column.',
   steps: [
    'Find the condition, the part after the bar |. That row or column is the new sample space.',
    'Add up that row or column to get its total.',
    'Find the cell where the event and the condition meet.',
    'Divide that cell by the total of the row or column, and reduce the fraction.'
   ],
   example: {
    prompt: 'A table of seed packets: Ceres batch 30 good, 10 bad; Pallas batch 16 good, 4 bad. What is P(bad | Pallas)?',
    steps: [
     'The condition is Pallas, so keep that row: 16 + 4 = 20 packets.',
     '4 of them are bad, so P(bad | Pallas) = 4/20.',
     '4/20 = 1/5.'
    ],
    answer: 'P(bad | Pallas) = 1/5.'
   },
   pitfalls: [
    'Dividing by the grand total of the table instead of the total of the condition’s row.',
    'Swapping the two sides of the bar. P(cracked | Tycho) and P(Tycho | cracked) use different totals and are usually different numbers.',
    'Forgetting to reduce the fraction to lowest terms.'
   ]
  },
  guidance: [
   { prompt: 'Keep only the Tycho Works row. How many crates came from Tycho Works?', answer: [36], labels: ['Tycho crates'], explanation: '27 + 9 = 36 crates. These are the only outcomes left once you know the supplier.' },
   { prompt: '9 of those 36 crates are cracked. Write 9/36 in lowest terms.', answer: [1, 4], labels: ['numerator', 'denominator'], explanation: '9 and 36 both divide by 9, so P(cracked | Tycho) = 1/4.' }
  ]
 },
 {
  id: 'q08', title: 'Two crates off the stack', topic: 'The multiplication rule: drawing without replacement', tier: 'Basic', sector: 'Sorting Shed',
  brief: 'Inspectors pull two crates from each stack, and Mira wants the chance that both of them turn out to have bad seals.',
  lesson: 'The multiplication rule: P(A and B) = P(A) × P(B | A). Without replacement, the second chance is worked out from what is left.',
  prompt: 'A stack in the sorting shed holds 10 crates, and 4 of them have a faulty seal. Mira takes one crate at random and sets it aside, then takes a second at random from the crates left. Enter P(both crates are faulty) as a fraction in lowest terms: numerator, then denominator.',
  answer: [2, 15], labels: ['numerator', 'denominator'], tolerance: 0.01,
  hints: [
   'The first crate is faulty with probability 4/10.',
   'If the first crate was faulty, the stack now has one crate fewer and one faulty crate fewer. Multiply the two probabilities, then reduce.'
  ],
  solution: 'P(first faulty) = 4/10. The first crate is not put back, so if it was faulty the stack holds 9 crates with 3 faulty among them: P(second faulty | first faulty) = 3/9. By the multiplication rule, P(both faulty) = 4/10 × 3/9 = 12/90 = 2/15.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'The inspection tag', description: 'A tag that says two crates were pulled and not put back.' },
  sources: [source.is3_3, source.cm7_9],
  teaching: {
   intuition: 'For two things to both happen, the first has to happen, and then the second has to happen given that the first did. So the chance of both is a chance of a chance: P(A and B) = P(A) × P(B | A). This is the multiplication rule. It matters most when the first event changes the situation for the second. Take two crates from a stack without replacement, which means the first crate is not put back. If the first was faulty, the stack the second comes from is one crate smaller and has one faulty crate fewer, so the second chance is worked out from what is left. Multiplying two fractions is done top times top and bottom times bottom, then the result is reduced.',
   steps: [
    'Work out P(first event) from the whole stack.',
    'Imagine the first event has happened. Take that item out and work out P(second | first) from what is left.',
    'Multiply: P(both) = P(first) × P(second | first), top times top and bottom times bottom.',
    'Reduce the fraction to lowest terms.'
   ],
   example: {
    prompt: 'A box holds 6 bulbs and 2 of them are dead. Two bulbs are taken without replacement. What is P(both dead)?',
    steps: [
     'P(first dead) = 2/6.',
     'One dead bulb is out, so 1 dead bulb is left among 5: P(second dead | first dead) = 1/5.',
     'P(both dead) = 2/6 × 1/5 = 2/30 = 1/15.'
    ],
    answer: 'P(both dead) = 1/15.'
   },
   pitfalls: [
    'Using the same fraction twice, as if the first crate were put back. Without replacement both the top and the bottom drop by one.',
    'Adding the two probabilities instead of multiplying them. “Both” needs the first and then the second, which is a product.',
    'Forgetting to reduce: 12/90 and 2/15 are equal, but the answer asks for lowest terms.'
   ]
  },
  guidance: [
   { prompt: 'For the first pick: how many crates are faulty, and how many crates are in the stack?', answer: [4, 10], labels: ['faulty crates', 'crates'], explanation: '4 of 10 crates are faulty, so P(first faulty) = 4/10.' },
   { prompt: 'Now suppose the first crate was faulty and has been set aside. How many faulty crates are left, and how many crates?', answer: [3, 9], labels: ['faulty crates left', 'crates left'], explanation: 'One faulty crate is gone: 3 faulty out of 9, so P(second faulty | first faulty) = 3/9.' },
   { prompt: 'Multiply 4/10 × 3/9: tops together, bottoms together. What are the new top and bottom, before reducing?', answer: [12, 90], labels: ['numerator before reducing', 'denominator before reducing'], explanation: '4 × 3 = 12 and 10 × 9 = 90, so P(both faulty) = 12/90, which reduces to 2/15.' }
  ]
 },
 {
  id: 'q09', title: 'Morning crates and damp', topic: 'Independent events', tier: 'Basic', sector: 'Sorting Shed',
  brief: 'The shed crew blames the morning run for damp crates, and Mira wants to check from the records whether the two have anything to do with each other.',
  lesson: 'Two events are independent when knowing one happened does not change the chance of the other; then P(A and B) = P(A) × P(B).',
  prompt: 'The sorting shed’s records say that a crate came on the morning run with probability 0.6, that a crate is damp with probability 0.3, and that a crate came on the morning run and is damp with probability 0.24. Enter P(morning) × P(damp), then 1 if the events “morning run” and “damp” are independent or 0 if they are not.',
  answer: [0.18, 0], labels: ['P(morning) × P(damp)', 'independent (1) or not (0)'], tolerance: 0.0005,
  hints: [
   'Multiply the two single probabilities, P(morning) and P(damp).',
   'Two events are independent exactly when P(A and B) = P(A) × P(B). Compare your product with the recorded chance of “morning run and damp”.'
  ],
  solution: 'P(morning) × P(damp) = 0.6 × 0.3 = 0.18. The records give P(morning and damp) = 0.24, which is not 0.18, so the events are not independent: knowing that a crate came on the morning run changes the chance that it is damp. Enter 0.',
  xp: 100, prereqs: ['q08'],
  artifact: { name: 'The damp-crate chart', description: 'A chart that settles the argument about the morning run.' },
  sources: [source.is3_2],
  teaching: {
   intuition: 'Sometimes knowing one thing tells you nothing new about another. A spinner in the dispatch office and the weather on the pad have nothing to do with each other: hearing that it rained does not change the spinner’s chances. Such events are called independent. In the language of the last two missions, A and B are independent when P(B | A) = P(B): the condition makes no difference. Then the multiplication rule P(A and B) = P(A) × P(B | A) becomes simply P(A and B) = P(A) × P(B). That gives a test. Multiply the two single probabilities and compare the result with the real chance of both. If they are equal the events are independent; if not, they are dependent, and knowing one changes the chance of the other. Independent is not the same as mutually exclusive: mutually exclusive events cannot happen together, so knowing one happened changes the other’s chance to 0.',
   steps: [
    'Read off P(A), P(B) and the actual P(A and B).',
    'Multiply P(A) × P(B).',
    'Compare the product with P(A and B).',
    'Equal means independent (enter 1); different means not independent (enter 0).'
   ],
   example: {
    prompt: 'P(A) = 0.5, P(B) = 0.4 and P(A and B) = 0.2. Are A and B independent?',
    steps: [
     'P(A) × P(B) = 0.5 × 0.4 = 0.2.',
     'That equals P(A and B) = 0.2.'
    ],
    answer: 'Yes: they are independent, so the answer is 1.'
   },
   pitfalls: [
    'Mixing up independent and mutually exclusive. Mutually exclusive events with real chances are never independent.',
    'Judging from the story instead of the numbers. The test is whether P(A and B) equals P(A) × P(B).',
    'Multiplying decimals carelessly: 0.6 × 0.3 is 0.18, not 1.8 or 0.018.'
   ]
  },
  guidance: [
   { prompt: 'What is 0.6 × 0.3?', answer: [0.18], labels: ['P(morning) × P(damp)'], explanation: '0.6 × 0.3 = 0.18. If the events were independent, this would be the chance of both.' },
   { prompt: 'The recorded chance of both is 0.24. Is it equal to 0.18? Enter 1 for yes (independent) or 0 for no.', answer: [0], labels: ['independent (1) or not (0)'], explanation: '0.24 is not 0.18, so the events are not independent.' }
  ]
 },
 {
  id: 'q10', title: 'Three suppliers, one damage rate', topic: 'Tree diagrams and the total probability of an outcome', tier: 'Basic', sector: 'Sorting Shed',
  brief: 'Crates from three suppliers are mixed together in the shed, and Mira wants a single chance that the next crate off the pile is damaged.',
  lesson: 'In a tree diagram, multiply along each branch path; the probability of an outcome is the sum of the paths that end in it.',
  prompt: 'A crate in the sorting shed came from Rhea Depot with probability 0.45, from Tycho Works with probability 0.35 and from Vesta Yard with probability 0.2. A crate from Rhea is damaged with probability 0.04, one from Tycho with probability 0.06 and one from Vesta with probability 0.09. Enter P(damaged), the probability that a crate picked at random from the shed is damaged, to 4 decimal places.',
  answer: [0.057], labels: ['P(damaged)'], tolerance: 0.00005,
  hints: [
   'Draw a tree diagram: three branches for the suppliers, then from each a “damaged” and an “undamaged” branch. Multiply along each path that ends in “damaged”.',
   'Add the three path probabilities. A damaged crate came from exactly one supplier, so the paths are mutually exclusive.'
  ],
  solution: 'Along the Rhea path, 0.45 × 0.04 = 0.018; along the Tycho path, 0.35 × 0.06 = 0.021; along the Vesta path, 0.2 × 0.09 = 0.018. These are the only ways to get a damaged crate, so P(damaged) = 0.018 + 0.021 + 0.018 = 0.057.',
  xp: 100, prereqs: ['q08'],
  artifact: { name: 'The supply tree', description: 'A branching chart from three suppliers down to damaged and undamaged crates.' },
  sources: [source.is3_5],
  teaching: {
   intuition: 'A tree diagram draws a chance process as branches. From a starting point, one branch goes out for each first result, labelled with its probability; from the end of each of those, more branches go out for the second result, labelled with its conditional probability given the first. Following one path from the start to a tip is one way things can turn out. By the multiplication rule, the chance of a whole path is the product of the probabilities along it. Different paths can never happen together, so they are mutually exclusive, and the chance of an outcome that several paths lead to is the sum of those paths. So to find the overall chance that a crate is damaged, when crates come from several suppliers with different damage rates, multiply share × damage rate for each supplier and add the results. This is called the total probability of the outcome.',
   steps: [
    'Draw the first set of branches, one per supplier, with their probabilities. They must add to 1.',
    'From each supplier, draw the second set: damaged and undamaged, with that supplier’s rates.',
    'Multiply along every path that ends in the outcome you want.',
    'Add those path products. The total is the probability of the outcome.'
   ],
   example: {
    prompt: 'Seeds come from two growers: 0.7 of them from Ceres, of which 0.1 fail, and 0.3 from Pallas, of which 0.2 fail. What is P(a seed fails)?',
    steps: [
     'Ceres path: 0.7 × 0.1 = 0.07.',
     'Pallas path: 0.3 × 0.2 = 0.06.',
     'Add the paths: 0.07 + 0.06 = 0.13.'
    ],
    answer: 'P(fails) = 0.13.'
   },
   pitfalls: [
    'Averaging the damage rates. A supplier that sends more crates counts for more, which is why each rate is multiplied by its share first.',
    'Adding along a path instead of multiplying. Along a path the events happen one after the other, so their chances multiply.',
    'Including the undamaged paths in the sum. Add only the paths that end in “damaged”.'
   ]
  },
  guidance: [
   { prompt: 'Multiply along each path that ends in “damaged”: supplier share × damage rate. What are the Rhea, Tycho and Vesta path probabilities?', answer: [0.018, 0.021, 0.018], labels: ['Rhea path', 'Tycho path', 'Vesta path'], explanation: '0.45 × 0.04 = 0.018, 0.35 × 0.06 = 0.021 and 0.2 × 0.09 = 0.018. Each is P(supplier and damaged).' },
   { prompt: 'Add the three paths. What is 0.018 + 0.021 + 0.018?', answer: [0.057], labels: ['P(damaged)'], explanation: '0.018 + 0.021 + 0.018 = 0.057. About 5.7 crates in every 100 arrive damaged.' }
  ]
 }
);
})();
