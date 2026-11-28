/* Probability missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/prob/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Conditions and independence · Basic, 100 XP · sector 'Sorting Shed' · Chapter review: tables, trees and rules mixed [IS 3.3, 3.4]
     q12  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Bayes' rule: reversing a condition [PDS 3.4]
     q13  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Odds for and against [CM 7.7]
     q14  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Random variables and probability distributions [IS 4.1]
     q15  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Expected value E(X) = Σ x P(x) [IS 4.2, CM 7.11]
     q16  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Variance and standard deviation of a random variable [IS 4.2]
     q17  ch 3 Updating and payoffs · Intermediate, 150 XP · sector 'Medical Bay' · Chapter review: is the game worth playing? [CM 7.11, IS 4.2]
     q18  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · Repeated independent trials: one particular sequence [IS 4.3]
     q19  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · How many orders: where the successes can fall [IS 4.3, CM 7.10]
     q20  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · The binomial probability P(X = k) [IS 4.3, CM 7.10] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e, Contemporary Mathematics and Principles of Data Science sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Introductory Statistics 2e — 3.4 Contingency Tables
   Link to the section page itself: https://openstax.org/books/introductory-statistics-2e/pages/<section-slug> */
const source = {
 is3_3: { title: 'OpenStax Introductory Statistics 2e — 3.3 Two Basic Rules of Probability', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability', description: 'The multiplication rule and the addition rule for combining the probabilities of two events.', verified: '2026-11-27' },
 is3_4: { title: 'OpenStax Introductory Statistics 2e — 3.4 Contingency Tables', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables', description: 'Reading probabilities, including conditional ones, from a table of counts for two variables.', verified: '2026-11-27' },
 pds3_4: { title: 'OpenStax Principles of Data Science — 3.4 Probability Theory', url: 'https://openstax.org/books/principles-data-science/pages/3-4-probability-theory', description: 'Conditional probability and Bayes’ Theorem for reversing a condition.', verified: '2026-11-27' },
 cm7_7: { title: 'OpenStax Contemporary Mathematics — 7.7 What Are the Odds?', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-7-what-are-the-odds', description: 'Odds for and against an event, and turning odds into a probability and back.', verified: '2026-11-27' },
 is4_1: { title: 'OpenStax Introductory Statistics 2e — 4.1 Probability Distribution Function (PDF) for a Discrete Random Variable', url: 'https://openstax.org/books/introductory-statistics-2e/pages/4-1-probability-distribution-function-pdf-for-a-discrete-random-variable', description: 'Random variables, and tables of their probabilities that add up to 1.', verified: '2026-11-27' },
 is4_2: { title: 'OpenStax Introductory Statistics 2e — 4.2 Mean or Expected Value and Standard Deviation', url: 'https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation', description: 'The expected value of a discrete random variable, and its variance and standard deviation.', verified: '2026-11-27' },
 cm7_11: { title: 'OpenStax Contemporary Mathematics — 7.11 Expected Value', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-11-expected-value', description: 'Expected value as a long-run average, applied to games of chance and fair prices.', verified: '2026-11-27' },
 is4_3: { title: 'OpenStax Introductory Statistics 2e — 4.3 Binomial Distribution', url: 'https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution', description: 'Independent trials with two outcomes, and the probability of a number of successes.', verified: '2026-11-27' },
 cm7_10: { title: 'OpenStax Contemporary Mathematics — 7.10 The Binomial Distribution', url: 'https://openstax.org/books/contemporary-mathematics/pages/7-10-the-binomial-distribution', description: 'Binomial experiments, counting the orders of successes, and binomial probabilities.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'The cracked-crate audit', topic: 'Tables, conditions and the addition rule together', tier: 'Basic', sector: 'Sorting Shed',
  brief: 'The quartermaster wants two numbers from the shed’s crate log before the next supplier order goes out.',
  lesson: 'One two-way table answers a conditional question by shrinking to a row, and an “or” question by the addition rule.',
  prompt: 'The sorting shed logged 200 crates by supplier and condition. Northway: 98 sound, 14 cracked. Ridgeline: 70 sound, 18 cracked. One of the 200 crates is picked at random. Enter P(cracked | Ridgeline), the probability that it is cracked given that it came from Ridgeline, to 3 decimal places. Then enter P(Ridgeline or cracked) as a decimal.',
  answer: [0.205, 0.51], labels: ['P(cracked | Ridgeline)', 'P(Ridgeline or cracked)'], tolerance: 0.0005,
  hints: [
   'Given Ridgeline, only the Ridgeline row counts: divide its cracked crates by all of its crates.',
   'For “or”, add the Ridgeline crates and the cracked crates, take away the crates counted twice (from Ridgeline and cracked), and divide by 200.'
  ],
  solution: 'Ridgeline sent 70 + 18 = 88 crates, and 18 of them are cracked, so P(cracked | Ridgeline) = 18 ÷ 88 = 0.2045…, which is 0.205 to 3 decimal places. There are 14 + 18 = 32 cracked crates in all. By the addition rule, P(Ridgeline or cracked) = (88 + 32 − 18) ÷ 200 = 102 ÷ 200 = 0.51.',
  xp: 100, prereqs: ['q09', 'q10'],
  artifact: { name: 'Crate audit sheet', description: 'A two-way table with a row ringed and a double count crossed out.' },
  sources: [source.is3_4, source.is3_3],
  teaching: {
   intuition: 'This chapter gave you several tools, and the skill now is choosing the right one for the question. A two-way table sorts every item by two things at once, here who sent a crate and whether it arrived sound. A conditional probability, “A given B”, tells you to look only at the items in B: pick out that row or column, and divide the count of A inside it by the row or column total. An “or” question asks about everything in either group, and the addition rule handles it: add the two groups, then take away the items that sit in both, because they were counted twice. Neither question needs a new rule, only a careful look at which part of the table it is about.',
   steps: [
    'Read the question and name its two events. A bar | means “given”: the event after it is what you already know.',
    'For P(A | B), use only the B row or column: the count of A inside it, divided by that row or column’s total.',
    'For P(A or B), add the count of A and the count of B, take away the count of A and B, and divide by the grand total.',
    'Round only at the end, as the question asks.'
   ],
   example: {
    prompt: 'A log of 100 crates: Eastgate 40 sound and 10 cracked; Westgate 35 sound and 15 cracked. Find P(cracked | Westgate) and P(Westgate or cracked).',
    steps: [
     'Westgate sent 35 + 15 = 50 crates, 15 of them cracked: P(cracked | Westgate) = 15 ÷ 50 = 0.3.',
     'There are 10 + 15 = 25 cracked crates. Westgate or cracked: 50 + 25 − 15 = 60 crates.',
     'P(Westgate or cracked) = 60 ÷ 100 = 0.6.'
    ],
    answer: '0.3 and 0.6.'
   },
   pitfalls: [
    'Dividing a conditional count by the grand total. Given Ridgeline, the denominator is the Ridgeline total, not every crate.',
    'Adding the two groups for “or” without taking away the crates in both, so those crates are counted twice.',
    'Swapping the condition: P(cracked | Ridgeline) and P(Ridgeline | cracked) have different denominators.'
   ]
  },
  guidance: [
   { prompt: 'How many crates came from Ridgeline, and how many of those are cracked?', answer: [88, 18], labels: ['Ridgeline crates', 'Ridgeline and cracked'], explanation: 'Ridgeline sent 70 sound and 18 cracked crates, 88 in all. Given Ridgeline, these 88 crates are the only ones that count.' },
   { prompt: 'What is 18 ÷ 88, to 3 decimal places?', answer: [0.205], labels: ['P(cracked | Ridgeline)'], explanation: '18 ÷ 88 = 0.2045…, which rounds to 0.205. That is P(cracked | Ridgeline).' },
   { prompt: 'How many crates are cracked in all, from both suppliers?', answer: [32], labels: ['cracked crates'], explanation: '14 from Northway and 18 from Ridgeline: 14 + 18 = 32.' },
   { prompt: 'Count the crates that are from Ridgeline or cracked or both: 88 + 32 − 18. What is that count, and what is it divided by 200?', answer: [102, 0.51], labels: ['Ridgeline or cracked', 'P(Ridgeline or cracked)'], explanation: 'The 18 cracked Ridgeline crates sit in both groups, so they are taken away once: 88 + 32 − 18 = 102, and 102 ÷ 200 = 0.51.' }
  ]
 },
 {
  id: 'q12', title: 'Reading a positive screen', topic: 'Bayes’ rule: reversing a condition', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'A crew member has just tested positive on the fever screen and wants to know how worried to be.',
  lesson: 'Bayes’ rule turns the chance of a test result given an illness into the chance of the illness given the result.',
  prompt: 'The medical bay screens every crew member for a fever virus. 2% of the crew carry it. The screen is positive for 90% of carriers, and it gives a false alarm, a positive result, for 5% of crew who do not carry it. A crew member tests positive. Enter P(carrier | positive), the probability that they really carry the virus, to 3 decimal places.',
  answer: [0.269], labels: ['P(carrier | positive)'], tolerance: 0.0005,
  hints: [
   'Picture 10000 crew screened. Work out how many carriers test positive, and how many crew who are not carriers test positive.',
   'Only the positive results count now: divide the carriers who test positive by everyone who tests positive.'
  ],
  solution: 'Out of 10000 crew screened, 2% means 200 carriers and 9800 who are not. Of the carriers, 90% test positive: 180. Of the others, 5% get a false alarm: 490. So 180 + 490 = 670 test positive, and P(carrier | positive) = 180 ÷ 670 = 0.2686…, which is 0.269 to 3 decimal places. By Bayes’ rule it is P(positive | carrier) × P(carrier) ÷ P(positive) = 0.9 × 0.02 ÷ 0.067, the same number. Even after a positive screen, carrying the virus is less likely than not.',
  xp: 150, prereqs: ['q10'],
  artifact: { name: 'Screening tree', description: 'Ten thousand crew split by the virus and then by the screen.' },
  sources: [source.pds3_4],
  teaching: {
   intuition: 'A screen is described by how it behaves on people we already understand: how often it is positive for someone who carries a virus, and how often it raises a false alarm for someone who does not. A patient wants the reverse: given that my result is positive, how likely is it that I carry the virus? Reversing a condition like this is what Bayes’ rule does. The clearest way to see it is to picture a large crowd, say 10000 crew, and follow them down a tree. First split them into carriers and non-carriers using how common the virus is, which is called the base rate. Then split each group by the screen’s result. Now look only at everyone who tested positive: the share of them who are carriers is the answer. When the virus is rare, the false alarms from the many healthy crew can outnumber the true positives, so a positive screen can still leave the chance well below one half. As a formula, P(A | B) = P(B | A) × P(A) ÷ P(B), where P(B) is the total from the tree.',
   steps: [
    'Picture 10000 people. Use the base rate to split them into those with the condition and those without.',
    'Use the test’s rates to find how many in each group test positive: the true positives and the false alarms.',
    'Add them to get everyone who tests positive.',
    'Divide the true positives by all the positives. That is P(condition | positive), Bayes’ rule worked out with counts.'
   ],
   example: {
    prompt: '1% of crew carry a virus. A screen is positive for 80% of carriers and gives a false alarm for 10% of the rest. Find P(carrier | positive).',
    steps: [
     'Of 10000 crew, 100 are carriers and 9900 are not.',
     '80% of 100 = 80 true positives; 10% of 9900 = 990 false alarms.',
     '80 + 990 = 1070 positives, and 80 ÷ 1070 = 0.0747…'
    ],
    answer: 'About 0.075: most positive results here are false alarms.'
   },
   pitfalls: [
    'Answering with the screen’s hit rate. P(positive | carrier) is not P(carrier | positive); the base rate changes everything.',
    'Forgetting the false alarms from the many crew who are not carriers, which is most of the positive results when the virus is rare.',
    'Dividing by all 10000 crew instead of by those who tested positive.'
   ]
  },
  guidance: [
   { prompt: 'Picture 10000 crew screened. How many are carriers, and how many of them test positive?', answer: [200, 180], labels: ['carriers', 'carriers who test positive'], explanation: '2% of 10000 is 200 carriers, and 90% of 200 is 180.' },
   { prompt: 'How many of the 10000 are not carriers, and how many of them get a false alarm?', answer: [9800, 490], labels: ['not carriers', 'false alarms'], explanation: '10000 − 200 = 9800 are not carriers, and 5% of 9800 is 490.' },
   { prompt: 'How many crew test positive in all, and what share of them are carriers, to 3 decimal places?', answer: [670, 0.269], labels: ['positive results', 'P(carrier | positive)'], explanation: '180 + 490 = 670 positive results, of which 180 are carriers: 180 ÷ 670 = 0.2686…, about 0.269.' }
  ]
 },
 {
  id: 'q13', title: 'Odds on the station cold', topic: 'Odds for and against', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'The crew talk about the station cold in odds, and the medic wants their talk and her chart to agree.',
  lesson: 'Odds compare the chance an event happens with the chance it does not, as a ratio of two whole numbers.',
  prompt: 'The medic puts the probability that a crew member catches the station cold this month at 0.35. Enter the odds against catching it as two whole numbers in lowest terms, the first and then the second of the pair. Then: the odds in favour of the new air filter clearing the cold spores are 3 : 5. Enter the probability that the filter clears them, as a decimal.',
  answer: [13, 7, 0.375], labels: ['odds against, first number', 'odds against, second number', 'P(filter clears the spores)'], tolerance: 0.0005,
  hints: [
   'Odds against compare the chance it does not happen with the chance it does: 0.65 : 0.35. Multiply both by 100, then divide both by the largest whole number that goes into both.',
   'Odds of 3 : 5 in favour mean 3 parts for it and 5 parts against it. A probability is the parts for it out of all the parts.'
  ],
  solution: 'The probability of not catching the cold is 1 − 0.35 = 0.65. The odds against are 0.65 : 0.35 = 65 : 35, and dividing both by 5 gives 13 : 7. Odds of 3 : 5 in favour mean 3 parts for and 5 against, 8 parts in all, so the probability is 3 ÷ 8 = 0.375.',
  xp: 150, prereqs: ['q03'],
  artifact: { name: 'The medic’s odds card', description: 'Probabilities on one side, odds on the other.' },
  sources: [source.cm7_7],
  teaching: {
   intuition: 'A probability compares the chances for an event with all the chances. Odds compare the chances for it with the chances against it, and they are written as a ratio such as 3 : 2, read “3 to 2”. If an event has probability 0.6, its complement has probability 0.4, so the odds in favour are 0.6 : 0.4, which is 6 : 4 or, in lowest terms, 3 : 2. The odds against are the same pair the other way round, 2 : 3. To go back from odds to a probability, think of the two numbers as parts: odds of 3 : 2 in favour mean 3 parts for and 2 against, 5 parts in all, so the probability is 3 ÷ 5 = 0.6. Odds are a different way to say the same thing, which is why gamblers and medics both use them.',
   steps: [
    'For odds in favour, write P(A) : P(A′); for odds against, write P(A′) : P(A), where P(A′) = 1 − P(A).',
    'Multiply both sides by the same number to make them whole numbers, then divide both by the largest number that goes into both, to get lowest terms.',
    'To turn odds of a : b in favour into a probability, divide a by a + b.'
   ],
   example: {
    prompt: 'The chance a shuttle is late is 0.2. Give the odds against it being late. Then, if the odds in favour of a repair working are 2 : 3, what is its probability?',
    steps: [
     'P(not late) = 1 − 0.2 = 0.8, so the odds against are 0.8 : 0.2 = 8 : 2 = 4 : 1.',
     'Odds of 2 : 3 in favour: 2 + 3 = 5 parts, so the probability is 2 ÷ 5 = 0.4.'
    ],
    answer: 'Odds against 4 : 1; probability 0.4.'
   },
   pitfalls: [
    'Writing the odds in favour when the question asks for the odds against. Against puts the chance of “not” first.',
    'Turning odds of a : b into a ÷ b instead of a ÷ (a + b). Odds of 3 : 5 give 3 ÷ 8, not 3 ÷ 5.',
    'Leaving the pair unreduced, such as 65 : 35 instead of 13 : 7.'
   ]
  },
  guidance: [
   { prompt: 'What is the probability of not catching the cold?', answer: [0.65], labels: ['P(not catching)'], explanation: 'By the complement rule it is 1 − 0.35 = 0.65.' },
   { prompt: 'Write 0.65 : 0.35 as two whole numbers in lowest terms. What are they?', answer: [13, 7], labels: ['first number', 'second number'], explanation: 'Times 100 the pair is 65 : 35; both divide by 5, giving 13 : 7.' },
   { prompt: 'For odds of 3 : 5 in favour, how many parts are there in all, and what is 3 divided by that number?', answer: [8, 0.375], labels: ['parts in all', 'P(filter clears the spores)'], explanation: '3 + 5 = 8 parts, so the probability is 3 ÷ 8 = 0.375.' }
  ]
 },
 {
  id: 'q14', title: 'The sick-bay visitor log', topic: 'Random variables and probability distributions', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'A smudge has wiped one number off the medical bay’s visitor chart, and Mira needs the chart whole to plan the medic’s shifts.',
  lesson: 'A random variable takes a number for each outcome, and its probability distribution lists every value with a probability, adding up to 1.',
  prompt: 'Mira tracks X, the number of crew who visit the medical bay in a day. Its probability distribution is P(X = 0) = 0.12, P(X = 1) = 0.3, P(X = 2) = ?, P(X = 3) = 0.18, P(X = 4) = 0.08, and X is never more than 4. Enter the missing probability P(X = 2), then P(X ≥ 2), the probability that at least 2 crew members visit.',
  answer: [0.32, 0.58], labels: ['missing probability', 'P(X ≥ k)'], tolerance: 0.005,
  hints: [
   'The probabilities of a distribution cover every value X can take, so they add up to 1. Take the four you know away from 1.',
   'X ≥ 2 means X is 2, 3 or 4. Two of these cannot happen on the same day, so add their probabilities.'
  ],
  solution: 'The four known probabilities add up to 0.12 + 0.3 + 0.18 + 0.08 = 0.68, so P(X = 2) = 1 − 0.68 = 0.32. Then P(X ≥ 2) = P(X = 2) + P(X = 3) + P(X = 4) = 0.32 + 0.18 + 0.08 = 0.58.',
  xp: 150, prereqs: ['q02'],
  artifact: { name: 'Visitor chart', description: 'A row of numbers from 0 to 4 with a probability under each.' },
  sources: [source.is4_1],
  teaching: {
   intuition: 'Many chance questions are about a number: how many crew visit the medical bay today, how many crates crack on a run. A random variable is a rule that gives a number to every outcome, and we name it with a capital letter, usually X. On one day X might be 0, on another 3; we cannot say in advance which. What we can write down is its probability distribution: a table of every value X can take, each with its probability. Each probability is between 0 and 1, and since X must take exactly one of its values, all the probabilities add up to 1. That is enough to fill a missing entry. P(X = 2) is read “the probability that X equals 2”, and P(X ≥ 2) is the probability that X is 2 or more. Two values of X cannot happen on the same day, so for “2 or more” you simply add the probabilities of 2, 3 and so on.',
   steps: [
    'List the values X can take and their probabilities.',
    'If one probability is missing, add the others and take the sum away from 1.',
    'For P(X ≥ k), add the probabilities of k and every value above it.'
   ],
   example: {
    prompt: 'X is the number of shuttles that dock in a day: P(X = 0) = 0.2, P(X = 1) = 0.5, P(X = 2) = ?, and X is never more than 2. Find P(X = 2) and P(X ≥ 1).',
    steps: [
     'The known probabilities add to 0.2 + 0.5 = 0.7, so P(X = 2) = 1 − 0.7 = 0.3.',
     'P(X ≥ 1) = P(X = 1) + P(X = 2) = 0.5 + 0.3 = 0.8.'
    ],
    answer: 'P(X = 2) = 0.3 and P(X ≥ 1) = 0.8.'
   },
   pitfalls: [
    'Reading X ≥ 2 as “more than 2” and leaving out X = 2 itself. The sign ≥ means “greater than or equal to”.',
    'Forgetting that the probabilities must add up to exactly 1, so the missing one is whatever is left.',
    'Adding the values of X instead of their probabilities.'
   ]
  },
  guidance: [
   { prompt: 'Add up the four probabilities you are given. What do they come to?', answer: [0.68], labels: ['sum of the four'], explanation: '0.12 + 0.3 + 0.18 + 0.08 = 0.68.' },
   { prompt: 'All five probabilities add up to 1. What is P(X = 2)?', answer: [0.32], labels: ['missing probability'], explanation: '1 − 0.68 = 0.32.' },
   { prompt: 'Now add P(X = 2) + P(X = 3) + P(X = 4). What is P(X ≥ 2)?', answer: [0.58], labels: ['P(X ≥ k)'], explanation: '0.32 + 0.18 + 0.08 = 0.58.' }
  ]
 },
 {
  id: 'q15', title: 'Spare parts for the scanners', topic: 'Expected value E(X)', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'The stores clerk is ordering scanner parts for the season and asks how many repairs the bay should plan for.',
  lesson: 'The expected value of a random variable is the sum of each value times its probability: the long-run average.',
  prompt: 'X is the number of scanner repairs the medical bay needs in a day: P(X = 0) = 0.25, P(X = 1) = 0.4, P(X = 2) = 0.2, P(X = 3) = 0.15. Enter the expected value E(X), the mean number of repairs a day. Then enter the number of repairs to expect over the next 20 days.',
  answer: [1.25, 25], labels: ['E(X), repairs a day', 'repairs over the days'], tolerance: 0.005,
  hints: [
   'Multiply each value of X by its probability. The value 0 adds nothing.',
   'E(X) is the sum of those products. Over many days the repairs average E(X) a day, so multiply it by the number of days.'
  ],
  solution: 'E(X) = 0 × 0.25 + 1 × 0.4 + 2 × 0.2 + 3 × 0.15 = 0 + 0.4 + 0.4 + 0.45 = 1.25 repairs a day. So μ = 1.25. Over 20 days expect 20 × 1.25 = 25 repairs.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Repair forecast', description: 'One number a day that the parts order is built on.' },
  sources: [source.is4_2, source.cm7_11],
  teaching: {
   intuition: 'Some days the scanners need no repairs, some days three; we cannot know tomorrow. But over a long run of days the count settles to an average, just as relative frequency settles in the long run. That long-run average is the expected value of the random variable, written E(X) and also called its mean, with the Greek letter μ (“mew”). To find it, weight each value by how often it happens: multiply each value by its probability, and add up the products. With Σ for “add them all”, E(X) = Σ x × P(x). The expected value need not be a value X can take; 1.25 repairs a day is a perfectly good average, even though no day has exactly 1.25. Over many days, the total is about the number of days times E(X).',
   steps: [
    'Write each value x of X next to its probability P(x).',
    'Multiply each value by its probability.',
    'Add the products: E(X) = Σ x × P(x), the mean μ.',
    'Over many days, expect about the number of days times E(X) in total.'
   ],
   example: {
    prompt: 'X is the number of alarms a day: P(X = 0) = 0.5, P(X = 1) = 0.3, P(X = 2) = 0.2. Find E(X), and the alarms to expect in 10 days.',
    steps: [
     'Products: 0 × 0.5 = 0, 1 × 0.3 = 0.3, 2 × 0.2 = 0.4.',
     'E(X) = 0 + 0.3 + 0.4 = 0.7 alarms a day.',
     'Over 10 days: 10 × 0.7 = 7 alarms.'
    ],
    answer: 'E(X) = 0.7; about 7 alarms in 10 days.'
   },
   pitfalls: [
    'Averaging the values 0, 1, 2 and 3 without weighting them by their probabilities.',
    'Rounding the expected value to a whole number because a day cannot have a fraction of a repair. The mean is a long-run average and keeps its decimals.',
    'Adding the probabilities instead of the products; the probabilities always add up to 1.'
   ]
  },
  guidance: [
   { prompt: 'Multiply each of the values 1, 2 and 3 by its probability. What are the three products?', answer: [0.4, 0.4, 0.45], labels: ['1 × P(X = 1)', '2 × P(X = 2)', '3 × P(X = 3)'], explanation: '1 × 0.4 = 0.4, 2 × 0.2 = 0.4 and 3 × 0.15 = 0.45. The value 0 gives 0 × 0.25 = 0.' },
   { prompt: 'Add the products. What is E(X)?', answer: [1.25], labels: ['E(X)'], explanation: '0.4 + 0.4 + 0.45 = 1.25, so the mean is μ = 1.25 repairs a day.' },
   { prompt: 'How many repairs should the bay expect over 20 days?', answer: [25], labels: ['repairs over the days'], explanation: '20 × 1.25 = 25.' }
  ]
 },
 {
  id: 'q16', title: 'How crowded the bench gets', topic: 'Variance and standard deviation', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'The medic knows the average queue at noon, but she wants one number for how far a day usually strays from it before she orders more chairs.',
  lesson: 'The variance is the expected squared distance from the mean, and the standard deviation is its square root.',
  prompt: 'X is the number of patients on the medical bay’s waiting bench at noon: P(X = 0) = 0.1, P(X = 1) = 0.3, P(X = 2) = 0.2, P(X = 3) = 0.3, P(X = 4) = 0.1. Enter the variance σ² of X, then its standard deviation σ to 2 decimal places.',
  answer: [1.4, 1.18], labels: ['σ²', 'σ'], tolerance: 0.005,
  hints: [
   'Find the mean μ first: multiply each value of X by its probability and add.',
   'For each value x, square its distance from the mean, (x − μ)², and multiply by its probability. The variance σ² is the sum, and σ is its square root.'
  ],
  solution: 'μ = 1 × 0.3 + 2 × 0.2 + 3 × 0.3 + 4 × 0.1 = 2. The squared distances (x − μ)² for x = 0, 1, 2, 3, 4 are 4, 1, 0, 1, 4. So σ² = 4 × 0.1 + 1 × 0.3 + 0 × 0.2 + 1 × 0.3 + 4 × 0.1 = 0.4 + 0.3 + 0 + 0.3 + 0.4 = 1.4. Then σ = √1.4 = 1.1832…, which is 1.18 to 2 decimal places.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Spread gauge', description: 'A mean in the middle, with marks one standard deviation either side.' },
  sources: [source.is4_2],
  teaching: {
   intuition: 'Two random variables can have the same mean and behave very differently: one is almost always close to its mean, the other swings far either way. To measure that spread, look at how far each value lies from the mean μ. Some distances are negative and some positive, so square them first, which makes every one positive and counts big strays heavily. Then weight each squared distance by its probability and add, as for an expected value. The result is the variance, written σ² (σ is the small Greek letter sigma): σ² = Σ (x − μ)² × P(x). The variance is in squared units, such as “patients squared”, which is hard to picture, so we take its square root to get back to ordinary units. That square root, σ, is the standard deviation: roughly, how far a typical day sits from the mean.',
   steps: [
    'Find the mean μ = Σ x × P(x).',
    'For each value x, find its distance from the mean, x − μ, and square it.',
    'Multiply each squared distance by its probability and add: that is the variance σ².',
    'Take the square root of the variance to get the standard deviation σ.'
   ],
   example: {
    prompt: 'X is the number of calls to the bay in an hour: P(X = 0) = 0.25, P(X = 1) = 0.5, P(X = 2) = 0.25. Find σ² and σ.',
    steps: [
     'μ = 0 × 0.25 + 1 × 0.5 + 2 × 0.25 = 1.',
     'Squared distances: (0 − 1)² = 1, (1 − 1)² = 0, (2 − 1)² = 1.',
     'σ² = 1 × 0.25 + 0 × 0.5 + 1 × 0.25 = 0.5, and σ = √0.5 = 0.707…'
    ],
    answer: 'σ² = 0.5 and σ ≈ 0.71.'
   },
   pitfalls: [
    'Forgetting to square the distances: the plain distances, weighted by their probabilities, always add up to 0.',
    'Stopping at the variance when the standard deviation is asked for, or the other way round.',
    'Squaring the probabilities instead of the distances.'
   ]
  },
  guidance: [
   { prompt: 'What is the mean μ of X?', answer: [2], labels: ['μ'], explanation: '1 × 0.3 + 2 × 0.2 + 3 × 0.3 + 4 × 0.1 = 2.' },
   { prompt: 'Square the distance of each value from 2. What is (x − 2)² for x = 0, 1, 2, 3 and 4?', answer: [4, 1, 0, 1, 4], labels: ['(0 − μ)²', '(1 − μ)²', '(2 − μ)²', '(3 − μ)²', '(4 − μ)²'], explanation: 'The distances are −2, −1, 0, 1, 2, and their squares are 4, 1, 0, 1, 4.' },
   { prompt: 'Multiply each squared distance by its probability and add. What is σ²?', answer: [1.4], labels: ['σ²'], explanation: '0.4 + 0.3 + 0 + 0.3 + 0.4 = 1.4.' },
   { prompt: 'What is σ = √1.4, to 2 decimal places?', answer: [1.18], labels: ['σ'], explanation: '√1.4 = 1.1832…, which rounds to 1.18.' }
  ]
 },
 {
  id: 'q17', title: 'The scanner raffle', topic: 'Is the game worth playing? Expected net gain', tier: 'Intermediate', sector: 'Medical Bay',
  brief: 'The bay is selling raffle tickets for a new scanner, and the crew want to know what a ticket is really worth before they buy one.',
  lesson: 'A game’s expected net gain is the expected prize minus the price; a fair price makes it 0.',
  prompt: 'To raise credits for a new scanner, the medical bay sells 1000 raffle tickets at 2 credits each. One ticket wins 800 credits, 10 tickets win 40 credits each and 50 tickets win 6 credits each; the rest win nothing. For one ticket, enter the expected net gain in credits (negative for a loss). Then enter the ticket price that would make the expected net gain 0.',
  answer: [-0.5, 1.5], labels: ['expected net gain (credits)', 'fair price (credits)'], tolerance: 0.0005,
  hints: [
   'Find the expected prize first: each prize times its probability, where the probability is the number of tickets that win it out of 1000.',
   'The net gain is the prize minus the price, and every ticket pays the price, so the expected net gain is the expected prize minus the price.'
  ],
  solution: 'The probabilities are 1 ÷ 1000 = 0.001, 10 ÷ 1000 = 0.01 and 50 ÷ 1000 = 0.05. The expected prize is 800 × 0.001 + 40 × 0.01 + 6 × 0.05 = 0.8 + 0.4 + 0.3 = 1.5 credits. Every ticket costs 2 credits whatever it wins, so the expected net gain is 1.5 − 2 = −0.5 credits: on average a ticket loses 0.5 credits, and that is what the bay raises. A price of 1.5 credits would make the expected net gain 0, a fair game.',
  xp: 150, prereqs: ['q15', 'q12'],
  artifact: { name: 'Raffle ticket stub', description: 'A ticket with its expected value pencilled on the back.' },
  sources: [source.cm7_11, source.is4_2],
  teaching: {
   intuition: 'A game of chance is worth playing, on average, when what you expect to win is more than what it costs. Treat the prize as a random variable: each prize, with the probability of winning it, and 0 with the rest of the probability. Its expected value is the expected prize, the average payout per ticket over a very long run. The net gain on one play is the prize minus the price, and since the price is paid whatever happens, the expected net gain is simply the expected prize minus the price. If it is negative, each play loses that much on average; a raffle for a good cause is meant to work that way. A game whose expected net gain is exactly 0 is called a fair game, so the fair price is the expected prize itself.',
   steps: [
    'List each prize with its probability: the number of tickets that win it out of all the tickets.',
    'Multiply each prize by its probability and add: that is the expected prize.',
    'Subtract the price to get the expected net gain per play.',
    'The fair price, which makes the expected net gain 0, equals the expected prize.'
   ],
   example: {
    prompt: '500 tickets at 3 credits each: 1 wins 400 credits and 20 win 15 credits. Find the expected net gain and the fair price.',
    steps: [
     'Probabilities: 1 ÷ 500 = 0.002 and 20 ÷ 500 = 0.04.',
     'Expected prize: 400 × 0.002 + 15 × 0.04 = 0.8 + 0.6 = 1.4 credits.',
     'Expected net gain: 1.4 − 3 = −1.6 credits.'
    ],
    answer: 'Expected net gain −1.6 credits; fair price 1.4 credits.'
   },
   pitfalls: [
    'Subtracting the price only from the winning tickets. Every ticket pays the price, so take it from the expected prize once.',
    'Leaving out a prize level, or using the number of winning tickets in place of their probability.',
    'Giving the net gain as positive when the game loses: a loss is a negative expected net gain.'
   ]
  },
  guidance: [
   { prompt: 'What is the probability that a ticket wins 800 credits, 40 credits and 6 credits?', answer: [0.001, 0.01, 0.05], labels: ['P(top prize)', 'P(middle prize)', 'P(small prize)'], explanation: '1 ÷ 1000 = 0.001, 10 ÷ 1000 = 0.01 and 50 ÷ 1000 = 0.05.' },
   { prompt: 'Multiply each prize by its probability and add. What is the expected prize?', answer: [1.5], labels: ['expected prize (credits)'], explanation: '0.8 + 0.4 + 0.3 = 1.5 credits.' },
   { prompt: 'Take away the price. What is the expected net gain?', answer: [-0.5], labels: ['expected net gain (credits)'], explanation: '1.5 − 2 = −0.5 credits. It is negative, so buying a ticket loses on average.' }
  ]
 },
 {
  id: 'q18', title: 'One row, one pattern', topic: 'Repeated independent trials: one particular sequence', tier: 'Intermediate', sector: 'Greenhouse',
  brief: 'Mira is testing a seed batch and wants the chance of one exact pattern of sprouts down a row.',
  lesson: 'For independent trials, the probability of one exact pattern of successes and failures is a product of p’s and q’s.',
  prompt: 'In the greenhouse each seed sprouts with probability 0.8, whatever the other seeds do. Mira plants a row of 6 seeds and wants this exact pattern, seed by seed: S, S, F, S, S, F (S for a seed that sprouts, F for one that fails). Enter the probability of that pattern, to 4 decimal places.',
  answer: [0.0164], labels: ['P(pattern)'], tolerance: 0.00005,
  hints: [
   'Each seed is a trial. A success has probability p = 0.8, and a failure has probability q = 1 − p.',
   'The seeds are independent, so multiply one factor for each seed in the pattern: p for each S and q for each F.'
  ],
  solution: 'q = 1 − 0.8 = 0.2. The pattern has 4 successes and 2 failures. The seeds are independent, so its probability is 0.8 × 0.8 × 0.2 × 0.8 × 0.8 × 0.2 = 0.8⁴ × 0.2², which is 0.0164 to 4 decimal places.',
  xp: 150, prereqs: ['q09'],
  artifact: { name: 'Seed row card', description: 'A row of S and F, with a probability under each letter.' },
  sources: [source.is4_3],
  teaching: {
   intuition: 'Planting a seed is a trial: an action with a chance result that we can repeat. Here every trial has two outcomes, so we call one a success (the seed sprouts) and the other a failure (it does not), without any praise or blame in the words. The probability of a success is written p, and the probability of a failure is q = 1 − p, its complement. When the trials are independent, one seed’s result does not change another’s, so by the multiplication rule for independent events the probability of an exact pattern, such as S, F, S, is the product p × q × p. Only the counts matter for this product: with k successes and f failures, any one exact pattern has probability p to the power k times q to the power f, written with small raised numbers as powers were in Foundations.',
   steps: [
    'Name a success and a failure, and write p for a success and q = 1 − p for a failure.',
    'Write one factor per trial: p for each success and q for each failure.',
    'Multiply. Grouping gives p to the power of the number of successes times q to the power of the number of failures.',
    'Round only the final product.'
   ],
   example: {
    prompt: 'Seeds sprout with probability 0.9, independently. Find the probability of the pattern S, F, S.',
    steps: [
     'q = 1 − 0.9 = 0.1.',
     'Pattern S, F, S: 0.9 × 0.1 × 0.9 = 0.9² × 0.1.',
     '0.81 × 0.1 = 0.081.'
    ],
    answer: '0.081.'
   },
   pitfalls: [
    'Using p for every seed, even the ones that fail.',
    'Adding the factors instead of multiplying them.',
    'Rounding each factor or each power before multiplying, which drifts the final digits.'
   ]
  },
  guidance: [
   { prompt: 'How many successes (S) and how many failures (F) are in the pattern?', answer: [4, 2], labels: ['successes', 'failures'], explanation: 'Counting the letters of S, S, F, S, S, F: 4 S and 2 F, 6 seeds in all.' },
   { prompt: 'What is q, the probability that one seed fails?', answer: [0.2], labels: ['q'], explanation: 'A seed either sprouts or fails, so q = 1 − 0.8 = 0.2.' },
   { prompt: 'Multiply 0.8⁴ × 0.2². What is it, to 4 decimal places?', answer: [0.0164], labels: ['P(pattern)'], explanation: 'Multiply the powers out, and round only at the end: 0.8⁴ × 0.2² is 0.0164 to 4 decimal places.' }
  ]
 },
 {
  id: 'q19', title: 'Where the sprouts can fall', topic: 'How many orders: the triangle of orders', tier: 'Intermediate', sector: 'Greenhouse',
  brief: 'Before Mira can put a chance on “exactly so many sprouts”, she has to know how many different rows give that count.',
  lesson: 'The number of orders of k successes among n trials can be listed for small rows and read from the triangle of orders.',
  prompt: 'Mira plants a row of 6 seeds, and exactly 2 of them sprout. The pattern could be S, S, F, F, F, F, or F, F, F, F, S, S, or many others. Enter the number of orders in which the last seed sprouts, then the number in which the last seed fails, then the total number of orders of 2 sprouts among 6 seeds.',
  answer: [5, 10, 15], labels: ['orders ending in a sprout', 'orders ending in a failure', 'orders in all'], tolerance: 0.01,
  hints: [
   'If the last seed sprouts, the other 1 sprout must fall among the first 5 seeds. If the last seed fails, all 2 sprouts fall among those 5 seeds.',
   'Build the triangle of orders down to row 6: each row starts and ends with 1, and every other entry is the sum of the two entries above it. Count entries from 0 at the left.'
  ],
  solution: 'The triangle of orders: row 1: 1 1; row 2: 1 2 1; row 3: 1 3 3 1; row 4: 1 4 6 4 1; row 5: 1 5 10 10 5 1; row 6: 1 6 15 20 15 6 1. Entry 1 of row 5 is 5: that many ways to place the other 1 sprout among the first 5 seeds when the last one sprouts. Entry 2 of row 5 is 10: the ways to place all 2 sprouts among the first 5 seeds when the last one fails. Every order ends one way or the other, so there are 5 + 10 = 15 orders in all, which is entry 2 of row 6.',
  xp: 150, prereqs: ['q18', 'q04'],
  artifact: { name: 'Triangle of orders', description: 'Rows of numbers, each the sum of the two above it.' },
  sources: [source.is4_3, source.cm7_10],
  teaching: {
   intuition: 'Two sprouts in a row of four seeds can happen in several ways: S, S, F, F or S, F, S, F and so on. Each arrangement is an order, and the number of orders is the count of different places the successes can fall. For small rows you can list them, as you listed the cells of a grid. For bigger rows there is a shortcut. Look at the last seed. Either it sprouts, and then the other successes fall among the seeds before it, or it fails, and then all of them do. So the count for a row of n seeds is the sum of two counts for a row of n − 1 seeds. Writing these counts in rows gives the triangle of orders: row 1 is 1 1, row 2 is 1 2 1, row 3 is 1 3 3 1, and each row starts and ends with 1 while every other entry is the sum of the two entries just above it. Entry k of row n, counting the first entry as entry 0, is the number of orders of k successes among n trials.',
   steps: [
    'For a short row, list every order of the successes and failures and count them.',
    'Build the triangle of orders: each row starts and ends with 1, and every other entry is the sum of the two above it.',
    'Read entry k of row n, counting from 0 at the left: that is the number of orders of k successes among n trials.',
    'Check with the last seed: the orders ending in a success plus those ending in a failure give the total.'
   ],
   example: {
    prompt: 'In how many orders can exactly 2 of 4 seeds sprout?',
    steps: [
     'List them: S S F F, S F S F, S F F S, F S S F, F S F S, F F S S.',
     'That is 6 orders. Check: row 4 of the triangle is 1 4 6 4 1, and entry 2 is 6.'
    ],
    answer: '6 orders.'
   },
   pitfalls: [
    'Counting entries from 1 instead of from 0: entry 0 of every row is the single order with no successes.',
    'Missing orders when listing. Work through them in a fixed pattern, moving the last success first.',
    'Adding the wrong two entries: each entry is the sum of the two directly above it, to its upper left and upper right.'
   ]
  },
  guidance: [
   { prompt: 'Write out the triangle of orders down to row 5. What are entry 1 and entry 2 of row 5?', answer: [5, 10], labels: ['orders ending in a sprout', 'orders ending in a failure'], explanation: 'Row 5 is 1 5 10 10 5 1. Counting from 0, entry 1 is 5 (the last seed sprouts) and entry 2 is 10 (the last seed fails).' },
   { prompt: 'Every order ends in a sprout or in a failure, never both. How many orders are there in all?', answer: [15], labels: ['orders in all'], explanation: '5 + 10 = 15, which is entry 2 of row 6: 1 6 15 20 15 6 1.' }
  ]
 },
 {
  id: 'q20', title: 'Exactly so many sprouts', topic: 'The binomial probability P(X = k)', tier: 'Intermediate', sector: 'Greenhouse',
  brief: 'The greenhouse needs a set number of seedlings from each tray, and Mira wants the chance of getting exactly that many.',
  lesson: 'The binomial probability of k successes in n trials is the number of orders times pᵏ times the right power of q.',
  prompt: 'Each seed in a tray sprouts with probability 0.7, independently of the others. Mira plants 5 seeds, and X is the number that sprout, so X has a binomial distribution. Enter P(X = 3), the probability that exactly 3 of the 5 seeds sprout, to 4 decimal places. Round only at the end, not the powers on the way.',
  answer: [0.3087], labels: ['P(X = k)'], tolerance: 0.00005,
  hints: [
   'Find the number of orders of 3 sprouts among 5 seeds from row 5 of the triangle of orders.',
   'Every one of those orders has the same probability, p³ × q², so multiply that by the number of orders.'
  ],
  solution: 'q = 1 − 0.7 = 0.3. Row 5 of the triangle of orders is 1 5 10 10 5 1, and entry 3 is 10, so there are 10 orders. Each order has probability 0.7³ × 0.3². So P(X = 3) = 10 × 0.7³ × 0.3², which is 0.3087 to 4 decimal places.',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Tray forecast', description: 'A bar for each possible number of sprouts in a tray.' },
  sources: [source.is4_3, source.cm7_10],
  teaching: {
   intuition: 'Put the last two missions together. A tray of n seeds is n independent trials, each a success with probability p. Let X be the number of successes. Any one order with exactly k successes has probability pᵏ × q to the power n − k, and every such order has the same probability, because only the counts matter. The orders cannot happen together, so to get P(X = k) we add that probability once for each order, which is the same as multiplying it by the number of orders from the triangle. So P(X = k) = (number of orders) × pᵏ × q to the power n − k. A random variable that counts successes in a fixed number of independent trials, each with the same p, is said to have a binomial distribution, and this is its formula.',
   steps: [
    'Check the setting: a fixed number n of independent trials, two outcomes each, the same p every time.',
    'Find the number of orders of k successes among n trials: entry k of row n of the triangle of orders.',
    'Find the probability of one order: pᵏ times q to the power n − k, with q = 1 − p.',
    'Multiply the number of orders by that probability, and round at the end.'
   ],
   example: {
    prompt: 'Seeds sprout with probability 0.5. In a tray of 4, find P(exactly 2 sprout).',
    steps: [
     'Row 4 of the triangle is 1 4 6 4 1, so there are 6 orders.',
     'One order: 0.5² × 0.5² = 0.0625.',
     '6 × 0.0625 = 0.375.'
    ],
    answer: '0.375.'
   },
   pitfalls: [
    'Leaving out the number of orders, which gives the chance of only one exact pattern.',
    'Using the wrong power of q: it is the number of failures, n − k, not n.',
    'Reading the entry for k from the wrong row: the row is the number of trials.'
   ]
  },
  guidance: [
   { prompt: 'How many orders of 3 sprouts among 5 seeds are there?', answer: [10], labels: ['number of orders'], explanation: 'Row 5 of the triangle of orders is 1 5 10 10 5 1; counting from 0, entry 3 is 10.' },
   { prompt: 'What is q, the probability that one seed fails?', answer: [0.3], labels: ['q'], explanation: 'q = 1 − 0.7 = 0.3.' },
   { prompt: 'Multiply 10 × 0.7³ × 0.3². What is P(X = 3), to 4 decimal places?', answer: [0.3087], labels: ['P(X = k)'], explanation: 'Multiply everything out, and round only at the end: 10 × 0.7³ × 0.3² is 0.3087 to 4 decimal places.' }
  ]
 }
);
})();
