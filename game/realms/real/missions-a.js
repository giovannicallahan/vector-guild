/* Real analysis missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/real/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · Upper bounds and the supremum [1.2]
     q02  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · Infimum, and whether it is attained [1.2]
     q03  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · The Archimedean property [1.2]
     q04  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · Absolute value and the triangle inequality [1.3]
     q05  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · Bounded functions: sup and inf over a set [1.3]
     q06  ch 1 The real line · Basic, 100 XP · sector 'Calibration Bench' · Countable sets [0.3, 1.4]
     q07  ch 2 Sequences · Basic, 100 XP · sector 'Signal Log' · The limit of a sequence with ε and N [2.1]
     q08  ch 2 Sequences · Basic, 100 XP · sector 'Signal Log' · Monotone bounded sequences and recursive limits [2.1, 2.2]
     q09  ch 2 Sequences · Basic, 100 XP · sector 'Signal Log' · Limit laws and the squeeze lemma [2.2]
     q10  ch 2 Sequences · Basic, 100 XP · sector 'Signal Log' · Subsequences, limsup and liminf [2.3] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis I & II: Introduction to Real Analysis, one entry per section the missions below cite.
   Each page was opened on the date in `verified` and checked for the idea the mission credits to it. */
const source = {
 s0_3: { title: 'Lebl, Basic Analysis — 0.3 Basic set theory', url: 'https://www.jirka.org/ra/html/sec_basicset.html', description: 'Cardinality and countable sets, with ℕ × ℕ listed along diagonals by the sum of the entries and the fractions listed the same way.', verified: '2026-11-28' },
 s1_2: { title: 'Lebl, Basic Analysis — 1.2 The set of real numbers', url: 'https://www.jirka.org/ra/html/sec_setofreals.html', description: 'ℝ has the least-upper-bound property; the Archimedean property; inf {1/n : n ∈ ℕ} = 0; maximum and minimum of a set.', verified: '2026-11-28' },
 s1_3: { title: 'Lebl, Basic Analysis — 1.3 Absolute value and bounded functions', url: 'https://www.jirka.org/ra/html/sec_absval.html', description: 'Absolute value, the triangle inequality, bounded functions, and the sup and inf of a function over a set.', verified: '2026-11-28' },
 s1_4: { title: 'Lebl, Basic Analysis — 1.4 Intervals and the size of ℝ', url: 'https://www.jirka.org/ra/html/sec_intandsizeR.html', description: 'Intervals, and Cantor’s theorem that ℝ is uncountable.', verified: '2026-11-28' },
 s2_1: { title: 'Lebl, Basic Analysis — 2.1 Sequences and limits', url: 'https://www.jirka.org/ra/html/sec_seqsandlims.html', description: 'Convergent and divergent sequences defined with ε, monotone sequences and the monotone convergence theorem, tails and subsequences.', verified: '2026-11-28' },
 s2_2: { title: 'Lebl, Basic Analysis — 2.2 Facts about limits of sequences', url: 'https://www.jirka.org/ra/html/sec_factslimsseqs.html', description: 'The squeeze lemma, the limit laws for sums, products and quotients, and recursively defined sequences.', verified: '2026-11-28' },
 s2_3: { title: 'Lebl, Basic Analysis — 2.3 Limit superior, limit inferior, and Bolzano–Weierstrass', url: 'https://www.jirka.org/ra/html/sec_bw.html', description: 'limsup and liminf as limits of the sups and infs of tails, subsequences converging to them, and the Bolzano–Weierstrass theorem.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'The rod that never quite reaches', topic: 'Upper bounds and the supremum', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'A calibration rod creeps towards a limit over many tests, and the bench needs the single number that caps every reading it will ever give.',
  lesson: 'The supremum of a set is its least upper bound: the smallest number at or above every member. It may or may not belong to the set.',
  prompt: 'A calibration rod is tested once for each n = 1, 2, 3, …, and test n gives the reading 4 − 3/n. The readings form the set S = {4 − 3/n : n ∈ ℕ}. Enter the supremum sup S, then 1 if S has a maximum (sup S is itself one of the readings) or 0 if it does not.',
  answer: [4, 0], labels: ['sup S', 'maximum (1 or 0)'], tolerance: 0.01,
  hints: [
   'Write out the readings for n = 1, 2, 4 and 10, and see which way they move as n grows.',
   'An upper bound sits at or above every reading, and the supremum is the smallest number that does. Then ask whether some single reading equals it.'
  ],
  solution: 'For n = 1, 2 and 4 the readings are 1, 2.5 and 3.25: they rise as n grows, because 3/n shrinks. Every reading is below 4, since 3/n is positive, so 4 is an upper bound. No smaller number u is one: 3/n becomes smaller than the gap 4 − u once n is large enough, and then that reading lies above u. So sup S = 4. No reading equals 4, because that would need 3/n = 0, so S has no maximum: enter 0.',
  xp: 100, prereqs: [],
  artifact: { name: 'Standard rod certificate', description: 'The first number the laboratory signs: the least upper bound of a whole set of readings.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'In this realm we stop trusting pictures and make every promise exact, starting with the natural numbers ℕ = {1, 2, 3, …}. Take a set S of real numbers, such as all the readings a rod will ever give. A number u is an upper bound of S when every member of S is at most u; a set with an upper bound is bounded above. A set bounded above has many upper bounds, and the useful one is the smallest. That number is the supremum, or least upper bound, written sup S. The real numbers have the least-upper-bound property, also called completeness: every non-empty set of reals that is bounded above has a supremum, and it is a real number. The supremum need not be in the set. If it is, it is the largest member, the maximum of S; if it is not, the members crowd up towards it without ever reaching it.',
   steps: [
    'Write out a few members of S, for small and for large n, and see which way they move.',
    'Find a number u that every member stays at or below: an upper bound.',
    'Check that no smaller number works: for any number below u, some member of S lies above it. Then u = sup S.',
    'Decide whether sup S is itself a member. If it is, it is the maximum of S; if not, S has no maximum.'
   ],
   example: {
    prompt: 'Find sup S for S = {5 − 2/n : n ∈ ℕ}, and say whether S has a maximum.',
    steps: [
     'The members for n = 1, 2, 4 and 10 are 3, 4, 4.5 and 4.8: they rise as n grows.',
     'Every member is below 5, because 2/n is positive, so 5 is an upper bound.',
     'For any number u below 5, 2/n is smaller than the gap 5 − u once n is large, and then 5 − 2/n lies above u. So sup S = 5.',
     'No member equals 5, since 2/n is never 0.'
    ],
    answer: 'sup S = 5, and S has no maximum.'
   },
   pitfalls: [
    'Taking the first member, or the largest member you happened to write down, as the supremum when the members keep rising past it.',
    'Thinking the supremum must belong to the set. It is the least upper bound, which a rising set may never reach.',
    'Giving any upper bound, such as 100, instead of the least one.'
   ]
  },
  guidance: [
   { prompt: 'What does the rod read in the first test, n = 1?', answer: [1], labels: ['reading at n = 1'], explanation: 'Put n = 1 into 4 − 3/n: 4 − 3 = 1.' },
   { prompt: 'What is the smallest number that sits at or above every reading?', answer: [4], labels: ['sup S'], explanation: 'The readings rise towards 4 and get as close to it as you like, but never pass it. So 4 is an upper bound and nothing smaller is: sup S = 4.' },
   { prompt: 'Is sup S one of the readings? Enter 1 for yes, 0 for no.', answer: [0], labels: ['maximum (1 or 0)'], explanation: 'A reading equal to 4 would need 3/n = 0, which no n gives. So S has no maximum: 0.' }
  ]
 },
 {
  id: 'q02', title: 'The floor under the gauge', topic: 'Infimum, and whether it is attained', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'Pressure readings and thermostat settings both need a certified floor, and Mira wants to know whether anything actually sits on it.',
  lesson: 'The infimum of a set is its greatest lower bound. It is attained when it belongs to the set, and then it is the minimum.',
  prompt: 'A pressure gauge is tested once for each n = 1, 2, 3, …, and test n settles at the reading 2 + 5/n, so its readings form the set S = {2 + 5/n : n ∈ ℕ}. Enter the infimum inf S, then 1 if the infimum is attained (it is itself in S, so S has a minimum) or 0 if it is not.',
  answer: [2, 0], labels: ['inf S', 'attained (1 or 0)'], tolerance: 0.01,
  hints: [
   'A lower bound sits at or below every member of S, and the infimum is the largest number that does.',
   'A square bracket means the end point is included and a round bracket means it is left out. For a set of readings, check whether one single reading equals the infimum.'
  ],
  solution: 'The readings 7, 4.5, 3.25, … (n = 1, 2, 4) fall as n grows, because 5/n shrinks, and every one is above 2, since 5/n is positive. So 2 is a lower bound. No larger number v is one: once n is large enough, 5/n is smaller than the gap v − 2, and that reading lies below v. So inf S = 2. No reading equals 2, because that would need 5/n = 0, so the infimum is not attained: enter 0.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Floor gauge', description: 'A dial marked with the greatest lower bound of everything it has read.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'Turn the supremum upside down. A number v is a lower bound of a set S when every member of S is at least v, and S is bounded below when it has one. The largest lower bound is the infimum, or greatest lower bound, written inf S; completeness promises that a non-empty set bounded below has one. Like the supremum, the infimum may or may not be a member. We say the infimum is attained when it is in S, and then it is the smallest member, the minimum of S. Intervals show this neatly. [2, 5) means every x with 2 ≤ x < 5: the square bracket includes the end point and the round bracket leaves it out. Its infimum 2 is attained. For (2, 5], every x with 2 < x ≤ 5, the infimum is still 2, but no member equals it.',
   steps: [
    'Find a number v that every member of S stays at or above: a lower bound.',
    'Check that no larger number works: for any number above v, some member of S lies below it. Then v = inf S.',
    'For a set of readings, see whether one reading equals inf S. For an interval, look at the bracket at the left end.',
    'If inf S is a member, it is attained and is the minimum; otherwise S has no minimum.'
   ],
   example: {
    prompt: 'Find inf S for S = {3 + 4/n : n ∈ ℕ}, and say whether it is attained.',
    steps: [
     'The members for n = 1, 2, 4 and 8 are 7, 5, 4 and 3.5: they fall towards 3.',
     'Every member is above 3, because 4/n is positive, so 3 is a lower bound; any larger number has members below it once n is large.',
     'So inf S = 3, and no member equals 3.'
    ],
    answer: 'inf S = 3, not attained.'
   },
   pitfalls: [
    'Reading a round bracket as if it included the end point. (2, 5] does not contain 2, though 2 is still its infimum.',
    'Answering with the first reading when the readings keep falling below it.',
    'Saying a set with no minimum has no infimum. Completeness gives every non-empty set bounded below an infimum.'
   ]
  },
  guidance: [
   { prompt: 'Every member of S is at least some number, and no larger number has that property. What is that number, inf S?', answer: [2], labels: ['inf S'], explanation: 'The readings 7, 4.5, 3.25, … (n = 1, 2, 4) fall as n grows, because 5/n shrinks, and every one is above 2, since 5/n is positive. So 2 is a lower bound. No larger number v is one: once n is large enough, 5/n is smaller than the gap v − 2, and that reading lies below v. So inf S = 2.' },
   { prompt: 'Is inf S itself a member of S? Enter 1 for yes, 0 for no.', answer: [0], labels: ['attained (1 or 0)'], explanation: '2 is not in S, so the infimum is not attained and S has no minimum: 0.' }
  ]
 },
 {
  id: 'q03', title: 'Enough rods to pass any mark', topic: 'The Archimedean property', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'The bench needs to know how fine a step must be to count as negligible, and how many short rods it takes to pass a long track.',
  lesson: 'The Archimedean property: for any x > 0 and any y there is a natural number n with nx > y; in particular 1/n can be made smaller than any ε > 0.',
  prompt: 'Mira wants two certificates that rest on the Archimedean property. First, a step of 1/n millimetres counts as negligible when it is smaller than the tolerance ε = 0.03: enter the smallest n ∈ ℕ with 1/n < 0.03. Second, a test track 9 metres long is to be passed by laying identical calibration rods 0.35 metres long end to end: enter the smallest number of rods n with n × 0.35 > 9.',
  answer: [34, 26], labels: ['smallest n for 1/n < ε', 'smallest number of rods'], tolerance: 0.01,
  hints: [
   '1/n < ε is the same as n > 1 ÷ ε, because both sides are positive. Work out 1 ÷ ε and take the next whole number above it.',
   'For the rods, n × x > y is the same as n > y ÷ x. If y ÷ x is a whole number, that many rods only just reach y and do not pass it.'
  ],
  solution: '1/n < 0.03 means n > 1 ÷ 0.03. 1 ÷ 0.03 = 33.3333…, and the smallest whole number above it is 34. For the rods, n × 0.35 > 9 means n > 9 ÷ 0.35. 9 ÷ 0.35 = 25.7143…, and the smallest whole number above it is 26.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Box of short rods', description: 'However short the rods, enough of them laid end to end pass any mark.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'However short a rod is, enough copies laid end to end will pass any mark. That is the Archimedean property of the real numbers: if x > 0 and y is any real number, there is a natural number n with n × x > y. It follows from completeness. If no such n existed, the multiples x, 2x, 3x, … would be bounded above, so they would have a supremum s; but then s − x, a smaller number, would already be passed by some multiple nx, and (n + 1)x would pass s itself. The everyday form uses the Greek letter ε (epsilon) for a small positive tolerance: for every ε > 0 there is an n with 1/n < ε, so 1/n can be made as small as we please. That is why inf {1/n : n ∈ ℕ} = 0. The method is to turn the inequality round, n > y ÷ x or n > 1 ÷ ε, and take the next whole number.',
   steps: [
    'Rewrite the condition as n > (a number): 1/n < ε becomes n > 1 ÷ ε, and n × x > y becomes n > y ÷ x.',
    'Work out that number exactly, keeping every decimal.',
    'Take the smallest natural number strictly greater than it. If the number is itself whole, that whole number fails, so go one higher.'
   ],
   example: {
    prompt: 'Find the smallest n ∈ ℕ with 1/n < 0.04, and the smallest number of 0.25 m rods that pass 6 m.',
    steps: [
     '1/n < 0.04 means n > 1 ÷ 0.04 = 25. At n = 25, 1/25 = 0.04 exactly, which is not smaller, so the smallest n is 26.',
     'n × 0.25 > 6 means n > 6 ÷ 0.25 = 24. 24 rods reach exactly 6 m without passing it, so 25 rods are needed.'
    ],
    answer: 'n = 26, and 25 rods.'
   },
   pitfalls: [
    'Stopping at n = 1 ÷ ε when that is a whole number. The inequality is strict, so equality does not count.',
    'Rounding 1 ÷ ε to the nearest whole number. A quotient such as 33.3 needs 34, not 33.',
    'Turning the inequality the wrong way: 1/n < ε means n is large, n > 1 ÷ ε.'
   ]
  },
  guidance: [
   { prompt: 'What is the whole-number part of 1 ÷ 0.03? (Drop any decimals.)', answer: [33], labels: ['whole part of 1 ÷ ε'], explanation: '1 ÷ 0.03 = 33.3333…, whose whole-number part is 33.' },
   { prompt: 'What is the smallest n ∈ ℕ with n > 1 ÷ 0.03, so that 1/n < 0.03?', answer: [34], labels: ['smallest n'], explanation: '1 ÷ 0.03 = 33.3333…, and the smallest whole number above it is 34.' },
   { prompt: 'What is the whole-number part of 9 ÷ 0.35?', answer: [25], labels: ['whole part of y ÷ x'], explanation: '9 ÷ 0.35 = 25.7143…, whose whole-number part is 25.' },
   { prompt: 'What is the smallest number of rods n with n × 0.35 > 9?', answer: [26], labels: ['smallest number of rods'], explanation: '9 ÷ 0.35 = 25.7143…, and the smallest whole number above it is 26.' }
  ]
 },
 {
  id: 'q04', title: 'Two errors, one certificate', topic: 'Absolute value and the triangle inequality', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'Two instruments each add a small error to a rod reading, and the certificate must cover the worst case and say which lengths pass.',
  lesson: '|x − c| is the distance from x to c, and the triangle inequality |a + b| ≤ |a| + |b| caps a total error by the sum of the separate error sizes.',
  prompt: 'Two instruments each add an error to a rod reading. The first error e₁ satisfies |e₁| ≤ 0.3 mm and the second error e₂ satisfies |e₂| ≤ 0.5 mm, and each may be positive or negative. Enter the largest value the total error |e₁ + e₂| can take, in millimetres. Then the rod\'s certificate accepts every length x with |x − 250| < 0.4 mm: enter the left end, then the right end, of the interval of accepted lengths.',
  answer: [0.8, 249.6, 250.4], labels: ['largest |e₁ + e₂| (mm)', 'left end (mm)', 'right end (mm)'], tolerance: 0.01,
  hints: [
   'The triangle inequality says |e₁ + e₂| ≤ |e₁| + |e₂|. Then ask whether both errors can be at their largest size with the same sign at once.',
   '|x − c| is the distance from x to c on the number line, so |x − c| < r says x lies less than r away from c, on either side.'
  ],
  solution: 'By the triangle inequality, |e₁ + e₂| ≤ |e₁| + |e₂| ≤ 0.3 + 0.5 = 0.8. The bound is reached when e₁ = 0.3 and e₂ = 0.5 (or both are negative), so the largest possible total error is 0.8 mm. Next, |x − 250| < 0.4 says x is less than 0.4 away from 250, so 250 − 0.4 < x < 250 + 0.4: the open interval (249.6, 250.4). Its left end is 249.6 and its right end 250.4; the end points themselves are not accepted.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Error ledger', description: 'Two error bounds added into one, with the worst case marked.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'The absolute value |x| is the size of x without its sign: |3| = 3 and |−3| = 3. Its real use in analysis is as a distance: |x − c| is how far x is from c on the number line, whichever side x is on. So |x − c| < r says that x is less than r away from c, which is the same as c − r < x < c + r: the open interval (c − r, c + r), with round brackets because its end points are left out. When two errors add, their sizes can at worst add too. That is the triangle inequality, |a + b| ≤ |a| + |b|: a signed error can cancel part of another, but it can never make the total bigger than the two sizes together. If |a| ≤ A and |b| ≤ B, then |a + b| ≤ A + B, and the bound is reached when a = A and b = B.',
   steps: [
    'Apply the triangle inequality: |a + b| ≤ |a| + |b| ≤ A + B.',
    'Check that the bound can be reached: choose both errors at their largest size with the same sign.',
    'Read |x − c| < r as a distance: x is less than r from c.',
    'Write it as c − r < x < c + r and read off the two end points of the open interval.'
   ],
   example: {
    prompt: 'If |a| ≤ 0.2 and |b| ≤ 0.6, how large can |a + b| be? Which x satisfy |x − 80| < 0.5?',
    steps: [
     '|a + b| ≤ |a| + |b| ≤ 0.2 + 0.6 = 0.8, and a = 0.2, b = 0.6 gives exactly 0.8.',
     '|x − 80| < 0.5 means 80 − 0.5 < x < 80 + 0.5.'
    ],
    answer: 'At most 0.8; the x in the open interval (79.5, 80.5).'
   },
   pitfalls: [
    'Subtracting the bounds, A − B, as if the errors had to cancel. They may have the same sign.',
    'Including the end points: |x − c| < r is strict, so c − r and c + r themselves are not accepted.',
    'Writing |x − c| < r as x < c + r only. The distance counts on both sides of c.'
   ]
  },
  guidance: [
   { prompt: 'What is the largest possible value of |e₁ + e₂| when |e₁| ≤ 0.3 and |e₂| ≤ 0.5?', answer: [0.8], labels: ['largest |e₁ + e₂| (mm)'], explanation: 'The triangle inequality caps it at 0.3 + 0.5 = 0.8, and e₁ = 0.3, e₂ = 0.5 reaches the cap.' },
   { prompt: '|x − 250| < 0.4 puts x less than 0.4 from 250. What is the left end of the interval?', answer: [249.6], labels: ['left end (mm)'], explanation: '250 − 0.4 = 249.6.' },
   { prompt: 'What is the right end of the interval?', answer: [250.4], labels: ['right end (mm)'], explanation: '250 + 0.4 = 250.4. So the accepted lengths are the open interval (249.6, 250.4).' }
  ]
 },
 {
  id: 'q05', title: 'Certifying a gauge on an open range', topic: 'Bounded functions: sup and inf over a set', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'A gauge is only certified for dial settings strictly inside a range, and its certificate must give the highest and lowest response it can show there.',
  lesson: 'The sup and inf of f over a set D are the sup and inf of the set of values f(x) for x in D; f is bounded on D when both exist as real numbers.',
  prompt: 'A gauge\'s response at dial setting x is f(x) = (x − 3)² + 2. It is certified only on the open interval (1, 6), the settings with 1 < x < 6; the end points are not included. Enter sup f and then inf f over this interval: the supremum and the infimum of the set of values f takes there.',
  answer: [11, 2], labels: ['sup f', 'inf f'], tolerance: 0.01,
  hints: [
   'A square is never negative, so (x − h)² is 0 at x = h and grows as x moves away from h. Decide whether that point lies inside the interval.',
   'On an open interval the values near the end points still count: a supremum or infimum can be a value f approaches at an end point without reaching it.'
  ],
  solution: 'The square (x − 3)² is never negative and is 0 only at x = 3, so f is smallest at x = 3 and grows as x moves away from 3 in either direction. x = 3 lies inside the interval, where f(3) = 2 is attained. At the end points f would be f(1) = 6 and f(6) = 11; these values are approached as x moves towards the ends, but the ends themselves are not in the interval. So sup f = 11 and inf f = 2.',
  xp: 100, prereqs: ['q04', 'q02'],
  artifact: { name: 'Response band', description: 'Two lines drawn across a gauge’s chart, the highest and lowest values it can approach.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'A function f gives one value f(x) for each x in a set D, such as an interval of dial settings. Collect all those values into one set, f(D). The supremum of f over D is sup f(D), and the infimum is inf f(D). We call f a bounded function on D when f(D) is bounded above and below, that is, when some number B has |f(x)| ≤ B for every x in D. On an open interval such as (0, 5), the end points are not in D, so f may never take the values it has there; but its values come as close to them as you like, so they still count for the sup and the inf. For a curve made from a square, such as (x − 4)² + 1, the square is never negative and is 0 only at x = 4, so the extreme values come from x = 4, if it lies inside D, and from the two end points.',
   steps: [
    'Work out the values f approaches at the two end points of the interval.',
    'Find where f turns: for s(x − h)² + k it is at x = h. Check whether h lies inside the interval.',
    'Collect the candidates: the two end values, and f(h) = k when h is inside.',
    'The sup is the largest candidate and the inf is the smallest. An end value is approached but not taken, because the end is not in the interval.'
   ],
   example: {
    prompt: 'Find sup f and inf f for f(x) = (x − 1)² + 2 on the open interval (−1, 2).',
    steps: [
     'At the ends, f(−1) = 4 + 2 = 6 and f(2) = 1 + 2 = 3.',
     'The square is 0 at x = 1, which is inside the interval, so f(1) = 2 is taken.',
     'The candidates are 6, 3 and 2. The values approach 6 near x = −1 without reaching it.'
    ],
    answer: 'sup f = 6 (not attained) and inf f = 2 (attained at x = 1).'
   },
   pitfalls: [
    'Leaving out an end value because the end point is not in the interval. The values get as close as you like to it, so it can still be the sup or the inf.',
    'Using the turning point when it lies outside the interval.',
    'Taking the sup from the end that is closer to the turning point instead of comparing both end values.'
   ]
  },
  guidance: [
   { prompt: 'What value does f approach as x moves towards the left end, x = 1?', answer: [6], labels: ['value at the left end'], explanation: 'f(1) = 6. The setting 1 is not in the interval, but values of f come as close to 6 as you like.' },
   { prompt: 'What value does f approach as x moves towards the right end, x = 6?', answer: [11], labels: ['value at the right end'], explanation: 'f(6) = 11.' },
   { prompt: 'What is sup f over the interval?', answer: [11], labels: ['sup f'], explanation: 'The square (x − 3)² is never negative and is 0 only at x = 3, so f is smallest at x = 3 and grows as x moves away from 3 in either direction. x = 3 lies inside the interval, where f(3) = 2 is attained. The smallest number at or above every value is 11.' },
   { prompt: 'What is inf f over the interval?', answer: [2], labels: ['inf f'], explanation: 'The largest number at or below every value is 2.' }
  ]
 },
 {
  id: 'q06', title: 'A place in line for every pair', topic: 'Countable sets', tier: 'Basic', sector: 'Calibration Bench',
  brief: 'The lab files every calibration pair in one numbered register, and Mira wants to check that no pair is ever left without a place.',
  lesson: 'A set is countable when it is finite or can be listed as a first, second, third member and so on; ℕ × ℕ and ℚ are countable, ℝ is not.',
  prompt: 'The lab gives every pair (a, b) of natural numbers a place in one list, which shows that the set ℕ × ℕ of all such pairs is countable. The list runs along diagonals: first the pair whose entries add to 2, then the pairs adding to 3, then 4, and so on; inside each diagonal the first entry goes up. So the list starts (1, 1), (1, 2), (2, 1), (1, 3), (2, 2), (3, 1), …, with (1, 1) in position 1. Enter the position of the pair (3, 4). Then enter the pair in position 20: its first entry, then its second.',
  answer: [18, 5, 2], labels: ['position of the pair', 'first entry', 'second entry'], tolerance: 0.01,
  hints: [
   'The diagonal with entries adding to s holds s − 1 pairs, so the diagonals before it hold 1 + 2 + … + (s − 2) pairs between them. Inside its diagonal, a pair with first entry a is the a-th one.',
   'To go back from a position to a pair, add 1 + 2 + 3 + … until the total first reaches the position. That tells you the diagonal; how far into it the position falls tells you the first entry.'
  ],
  solution: '(3, 4) lies on the diagonal with sum 7. The diagonals before it, with sums 2 to 6, hold 1 + 2 + … + 5 = 15 pairs, and (3, 4) is pair number 3 of its own diagonal, so its position is 15 + 3 = 18. For position 20: the diagonals up to sum 6 hold 15 pairs and those up to sum 7 hold 21, so position 20 is on the diagonal with sum 7, at place 20 − 15 = 5 in it. Its first entry is 5 and its second is 7 − 5 = 2: the pair (5, 2).',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'Diagonal register', description: 'A numbered list that gives every pair of natural numbers its own place.' },
  sources: [source.s0_3, source.s1_4],
  teaching: {
   intuition: 'A set is countable when it is finite, or when its members can be put in one list, first, second, third and so on, with every member appearing at some numbered position. Such a list is an enumeration, and it matches the set one to one with ℕ. Some sets that look bigger than ℕ are still countable. The set ℕ × ℕ of all pairs (a, b) of natural numbers fills a whole grid, but we can sweep it along diagonals: first the pair with a + b = 2, then the pairs with a + b = 3, then 4, and so on, each diagonal in order of its first entry. The diagonal with sum s holds s − 1 pairs, so every pair is reached after finitely many steps. The positive fractions a/b can be listed the same way, skipping repeats such as 2/2, so ℚ is countable too. Not every set is: Cantor showed that ℝ is uncountable, so no list of real numbers, however clever, contains them all.',
   steps: [
    'For a pair (a, b), find its diagonal: the sum s = a + b.',
    'Count the pairs on the earlier diagonals: 1 + 2 + … + (s − 2).',
    'Add a, the pair’s place inside its own diagonal, to get its position.',
    'To go back from a position, add 1 + 2 + 3 + … until the total first reaches it; that gives the diagonal, and the remainder gives the first entry.'
   ],
   example: {
    prompt: 'In the diagonal listing of ℕ × ℕ, find the position of (2, 3) and the pair in position 12.',
    steps: [
     '(2, 3) is on the diagonal with sum 5. The diagonals with sums 2, 3 and 4 hold 1 + 2 + 3 = 6 pairs, and (2, 3) is the 2nd pair of its diagonal, so its position is 8.',
     'The diagonals up to sum 5 hold 10 pairs and up to sum 6 hold 15, so position 12 is the 2nd place on the diagonal with sum 6: the pair (2, 4).'
    ],
    answer: 'Position 8; the pair (2, 4).'
   },
   pitfalls: [
    'Counting s pairs on the diagonal with sum s. Its pairs are (1, s − 1) up to (s − 1, 1): only s − 1 of them.',
    'Listing a whole row first, (1, 1), (1, 2), (1, 3), …. That row never ends, so (2, 1) would never get a place.',
    'Forgetting that the list starts at position 1, not 0.'
   ]
  },
  guidance: [
   { prompt: '(3, 4) is on the diagonal with sum 7. How many pairs come before that diagonal?', answer: [15], labels: ['pairs before the diagonal'], explanation: 'The diagonals with sums 2 to 6 hold 1 + 2 + … + 5 = 15 pairs.' },
   { prompt: 'What is the position of (3, 4)?', answer: [18], labels: ['position of the pair'], explanation: 'It is pair number 3 of its diagonal, so its position is 15 + 3 = 18.' },
   { prompt: 'Which diagonal sum does position 20 fall on?', answer: [7], labels: ['diagonal sum'], explanation: 'The diagonals up to sum 6 hold 15 pairs and those up to sum 7 hold 21, so position 20 is on the diagonal with sum 7.' },
   { prompt: 'What is the first entry of the pair in position 20?', answer: [5], labels: ['first entry'], explanation: 'It is place 20 − 15 = 5 in its diagonal, and the first entry counts the places: 5.' },
   { prompt: 'What is its second entry?', answer: [2], labels: ['second entry'], explanation: 'The entries add to 7, so the second is 7 − 5 = 2.' }
  ]
 },
 {
  id: 'q07', title: 'From this reading on', topic: 'The limit of a sequence with ε and N', tier: 'Basic', sector: 'Signal Log',
  brief: 'A signal log is settling, and its certificate must say exactly from which reading onwards every value stays inside the tolerance.',
  lesson: 'xₙ converges to L when for every ε > 0 there is an N with |xₙ − L| < ε for all n ≥ N.',
  prompt: 'A signal log records xₙ = (3n + 1) ÷ (2n + 5) as its nth reading. Enter the limit L of the sequence, then the smallest N such that |xₙ − L| < 0.01 for every n ≥ N (type it without commas).',
  answer: [1.5, 323], labels: ['limit L', 'smallest N'], tolerance: 0.001,
  hints: [
   'Divide the top and the bottom by n to see the limit: the parts with 1/n die away.',
   'Write xₙ − L as one fraction. Its top is a fixed number and its bottom grows with n, so once it drops below ε it stays below. Find the first n where it does.'
  ],
  solution: 'Dividing the top and the bottom by n, xₙ = (3 + 1/n) ÷ (2 + 5/n), which tends to 3 ÷ 2 = 1.5. Then xₙ − 1.5 = (1 × 2 − 3 × 5) ÷ (2(2n + 5)), so |xₙ − 1.5| = 13 ÷ (4n + 10), which shrinks as n grows. It is below 0.01 exactly when 4n + 10 > 13 ÷ 0.01 = 1300. At n = 322 the left side is 1298, which is not above it; at n = 323 it is 1302, which is. So N = 323.',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'Settling certificate', description: 'A tolerance, and the reading from which every value is promised to stay inside it.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'Calculus said a sequence x₁, x₂, x₃, … tends to L when its terms get close to L. Analysis makes that a promise you can check. The sequence converges to L when, for every tolerance ε > 0, there is a point N in the sequence such that |xₙ − L| < ε for every n ≥ N. In words: name any tolerance, and from some reading on, every reading stays within that tolerance of L. A sequence that does this is a convergent sequence with limit L; one that has no such L is divergent. The N may depend on ε: a tighter tolerance usually needs a later starting point. Lebl calls this index M; we use N. Proving a limit means finding a working N for each ε, and when the distance |xₙ − L| shrinks steadily we can find the smallest one exactly, by the Archimedean idea of solving for n and taking the next whole number.',
   steps: [
    'Find the limit L, for a fraction (an + b) ÷ (cn + d) by dividing the top and the bottom by n.',
    'Write xₙ − L as one fraction and simplify. Its size |xₙ − L| is a fixed number over something that grows with n.',
    'Solve |xₙ − L| < ε for n. Because the distance only shrinks, once it is below ε it stays below.',
    'The smallest N is the first whole number n that satisfies the inequality.'
   ],
   example: {
    prompt: 'xₙ = (2n + 1) ÷ (n + 3). Find the limit and the smallest N with |xₙ − 2| < 0.1 for all n ≥ N.',
    steps: [
     'Dividing by n, xₙ = (2 + 1/n) ÷ (1 + 3/n), which tends to 2.',
     'xₙ − 2 = (2n + 1 − 2n − 6) ÷ (n + 3) = −5 ÷ (n + 3), so |xₙ − 2| = 5 ÷ (n + 3).',
     '5 ÷ (n + 3) < 0.1 means n + 3 > 50, so n > 47.'
    ],
    answer: 'The limit is 2 and N = 48.'
   },
   pitfalls: [
    'Giving an N that works for one n but not for every later one. Check that the distance keeps shrinking.',
    'Forgetting the absolute value when xₙ − L is negative.',
    'Treating "n > 47" as N = 47. The first whole number that works is 48.'
   ]
  },
  guidance: [
   { prompt: 'What is the limit L of xₙ = (3n + 1) ÷ (2n + 5)?', answer: [1.5], labels: ['limit L'], explanation: 'Divide the top and the bottom by n: (3 + 1/n) ÷ (2 + 5/n) tends to 3 ÷ 2 = 1.5.' },
   { prompt: 'xₙ − L is one fraction with bottom 2(2n + 5) and top 1 × 2 − 3 × 5. What is the size of that top?', answer: [13], labels: ['size of the top'], explanation: '1 × 2 − 3 × 5 = −13, whose size is 13. So |xₙ − L| = 13 ÷ (4n + 10).' },
   { prompt: 'What is the smallest N with 13 ÷ (4n + 10) < 0.01 for every n ≥ N?', answer: [323], labels: ['smallest N'], explanation: 'The bound is below 0.01 when 4n + 10 > 1300. At n = 322 the left side is 1298; at n = 323 it is 1302. So N = 323.' }
  ]
 },
 {
  id: 'q08', title: 'The loop that settles itself', topic: 'Monotone bounded sequences and recursive limits', tier: 'Basic', sector: 'Signal Log',
  brief: 'A thermostat adjusts its setting from the last one, again and again, and Mira wants to know where the settings end up before trusting the loop.',
  lesson: 'A monotone sequence converges exactly when it is bounded; for a recursively defined sequence xₙ₊₁ = g(xₙ), the limit L then satisfies L = g(L).',
  prompt: 'A thermostat\'s control loop starts at the setting x₁ = 2 and then uses the rule xₙ₊₁ = (xₙ + 30) ÷ 4: each new setting is worked out from the one before. Enter x₃ (as a decimal or a fraction), then the limit of the sequence.',
  answer: [9.5, 10], labels: ['x₃', 'limit'], tolerance: 0.00005,
  hints: [
   'Put x₁ into the rule to get x₂, then put x₂ in to get x₃.',
   'Check that the settings move one way and never pass some number, so they converge. If the limit is L, then xₙ₊₁ tends to L as well, so L satisfies the rule with L on both sides. Solve that equation.'
  ],
  solution: 'x₂ = (2 + 30) ÷ 4 = 8 and x₃ = (8 + 30) ÷ 4 = 9.5. Subtracting 10 from both sides of the rule gives xₙ₊₁ − 10 = (xₙ − 10) ÷ 4: each step keeps the setting on the same side of 10 and cuts its distance from 10 by a factor of 4. The sequence starts below 10, so it is increasing and bounded above by 10, and a monotone bounded sequence converges. Call its limit L. Then xₙ₊₁ tends to L too, so L = (L + 30) ÷ 4, that is 4L = L + 30, 3L = 30 and L = 10.',
  xp: 100, prereqs: ['q07', 'q01'],
  artifact: { name: 'Control loop trace', description: 'Settings stepping steadily towards one value, each from the one before.' },
  sources: [source.s2_1, source.s2_2],
  teaching: {
   intuition: 'A recursively defined sequence gives a first term and a rule for getting each term from the one before: x₁ = 1 and xₙ₊₁ = (xₙ + 6) ÷ 2, read “x n plus one”. To trust such a loop we need to know that it converges, and then where. A sequence is increasing when each term is at least the one before, decreasing when each is at most the one before, and monotone when it is one or the other. The monotone convergence theorem says that a monotone sequence converges exactly when it is bounded; an increasing one that is bounded above converges to the supremum of its terms. This is completeness at work. Once we know the limit L exists, the rule finds it: xₙ₊₁ tends to L as well as xₙ, so taking limits on both sides of the rule gives an equation with L on both sides.',
   steps: [
    'Work out the first few terms from the rule to see how the sequence moves.',
    'Show it is monotone and bounded, for example by writing xₙ₊₁ − m in terms of xₙ − m for a suitable m.',
    'Conclude that it converges, by the monotone convergence theorem, and call the limit L.',
    'Take limits on both sides of the rule and solve the equation for L.'
   ],
   example: {
    prompt: 'x₁ = 1 and xₙ₊₁ = (xₙ + 6) ÷ 2. Find x₃ and the limit.',
    steps: [
     'x₂ = (1 + 6) ÷ 2 = 3.5 and x₃ = (3.5 + 6) ÷ 2 = 4.75.',
     'xₙ₊₁ − 6 = (xₙ − 6) ÷ 2, so the terms stay below 6 and halve their distance from it: increasing and bounded above.',
     'The limit satisfies L = (L + 6) ÷ 2, so 2L = L + 6.'
    ],
    answer: 'x₃ = 4.75 and the limit is 6.'
   },
   pitfalls: [
    'Solving L = g(L) without first checking that the sequence converges. The equation only finds a limit that exists.',
    'Applying the rule to x₁ twice in one step: x₃ comes from x₂, not from x₁.',
    'Rounding x₂ before working out x₃. Keep it exact.'
   ]
  },
  guidance: [
   { prompt: 'What is x₂ = (2 + 30) ÷ 4?', answer: [8], labels: ['x₂'], explanation: '32 ÷ 4 = 8.' },
   { prompt: 'What is x₃ = (x₂ + 30) ÷ 4?', answer: [9.5], labels: ['x₃'], explanation: '(8 + 30) ÷ 4 = 38 ÷ 4 = 9.5.' },
   { prompt: 'The sequence is monotone and bounded, so it has a limit L, and L = (L + 30) ÷ 4. What is L?', answer: [10], labels: ['limit'], explanation: 'Multiply by 4: 4L = L + 30, so 3L = 30 and L = 10.' }
  ]
 },
 {
  id: 'q09', title: 'Squeezing a noisy signal', topic: 'Limit laws and the squeeze lemma', tier: 'Basic', sector: 'Signal Log',
  brief: 'A signal wobbles as it settles, and the log needs its limit and a sample from which the wobble is certified to stay below tolerance.',
  lesson: 'Squeeze lemma: if aₙ ≤ xₙ ≤ bₙ and aₙ and bₙ both converge to L, then xₙ converges to L too.',
  prompt: 'A signal log reads xₙ = 7 + 4 sin(n) ÷ n on its nth sample, with n read in radians. Enter the limit of xₙ, then the smallest N for which the squeeze bound 4 ÷ n is below ε = 0.02 at n = N (and so for every n ≥ N).',
  answer: [7, 201], labels: ['limit', 'smallest N'], tolerance: 0.01,
  hints: [
   '−1 ≤ sin(n) ≤ 1 traps every term between two simpler sequences with the same limit; the squeeze lemma then gives the limit of xₙ.',
   'The distance from xₙ to its limit is at most the sin term with sin(n) replaced by 1. Find the first n where that bound is smaller than ε.'
  ],
  solution: 'Since −1 ≤ sin(n) ≤ 1, 7 − 4 ÷ n ≤ xₙ ≤ 7 + 4 ÷ n. Both outer sequences tend to 7, because 4 ÷ n tends to 0, so by the squeeze lemma xₙ tends to 7. The same bounds give |xₙ − 7| ≤ 4 ÷ n. Now 4 ÷ n < 0.02 means n > 4 ÷ 0.02 = 200. n must be greater than 200: at n = 200 the bound equals ε rather than being below it. So N = 201.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'Noise envelope', description: 'Two smooth curves pinching a wobbling signal down to one value.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'Some sequences wobble too much to handle directly, like 5 + 3cos(n) ÷ n with n read in radians: the cos part jumps about. But it is trapped. Since −1 ≤ cos(n) ≤ 1, every term lies between 5 − 3 ÷ n and 5 + 3 ÷ n, and both of those simpler sequences tend to 5. The squeeze lemma says that a sequence trapped between two sequences with the same limit has that limit too. The limit laws do the rest of the bookkeeping: the limit of a sum is the sum of the limits, and likewise for differences, products, and quotients when the bottom limit is not 0, so 5 ± 3 ÷ n tends to 5 ± 0. The trap also gives a certificate: |xₙ − 5| ≤ 3 ÷ n, so once 3 ÷ n is below ε, every term after it is within ε of 5. That N works for the sequence, though a smaller one might work too, because the bound is a worst case.',
   steps: [
    'Trap the sequence: replace the wobbling factor by its smallest and largest values to get aₙ ≤ xₙ ≤ bₙ.',
    'Find the limits of aₙ and bₙ with the limit laws. If they agree, the squeeze lemma gives the limit of xₙ.',
    'Read off the squeeze bound |xₙ − L| ≤ (a simple expression in n).',
    'Find the first n at which that bound is below ε. It stays below for every later n.'
   ],
   example: {
    prompt: 'xₙ = 5 + 3cos(n) ÷ n. Find the limit and the smallest N at which the squeeze bound is below 0.1.',
    steps: [
     '−1 ≤ cos(n) ≤ 1 gives 5 − 3 ÷ n ≤ xₙ ≤ 5 + 3 ÷ n, and both sides tend to 5.',
     'So xₙ tends to 5 and |xₙ − 5| ≤ 3 ÷ n.',
     '3 ÷ n < 0.1 means n > 30; at n = 30 the bound equals 0.1, which is not below it.'
    ],
    answer: 'The limit is 5 and N = 31.'
   },
   pitfalls: [
    'Trying to find the limit of sin(n) on its own. It has none; only the product with a shrinking factor settles.',
    'Squeezing between sequences with different limits. The lemma needs the two outer limits to agree.',
    'Taking the first n where the bound equals ε. It must be strictly below.'
   ]
  },
  guidance: [
   { prompt: 'What is the limit of xₙ = 7 + 4 sin(n) ÷ n?', answer: [7], labels: ['limit'], explanation: 'xₙ is trapped between 7 − 4 ÷ n and 7 + 4 ÷ n, which both tend to 7. By the squeeze lemma the limit is 7.' },
   { prompt: '4 ÷ n < 0.02 is the same as n > 4 ÷ 0.02. What is 4 ÷ 0.02?', answer: [200], labels: ['k ÷ ε'], explanation: '4 ÷ 0.02 = 200.' },
   { prompt: 'What is the smallest whole number N with N > 200?', answer: [201], labels: ['smallest N'], explanation: 'n must be greater than 200: at n = 200 the bound equals ε rather than being below it. So N = 201.' }
  ]
 },
 {
  id: 'q10', title: 'The highest note in the long run', topic: 'Subsequences, limsup and liminf', tier: 'Basic', sector: 'Signal Log',
  brief: 'A signal never settles on one value but keeps swinging between levels, and the log must record the levels it keeps coming back to.',
  lesson: 'limsup xₙ is the limit of the sups of the tails, and liminf xₙ the limit of their infs; for a bounded sequence they are the largest and smallest limits of subsequences.',
  prompt: 'A signal swings from side to side as it settles: its nth sample is xₙ = 3 + 2(−1)ⁿ + 6 ÷ n. Enter the supremum of the set of all the samples, then limsup xₙ, then liminf xₙ.',
  answer: [8, 5, 1], labels: ['sup of all samples', 'limsup', 'liminf'], tolerance: 0.01,
  hints: [
   'Split the samples into subsequences that each settle on one value. The limsup is the largest of these limits and the liminf the smallest.',
   'The supremum of all the samples looks at every term, early ones included; the limsup looks only at the far tail. The part c ÷ n falls as n grows, so the largest term of each subsequence is its first.'
  ],
  solution: 'For even n, (−1)ⁿ = 1 and xₙ = 5 + 6 ÷ n, a subsequence falling towards 5. For odd n, (−1)ⁿ = −1 and xₙ = 1 + 6 ÷ n, falling towards 1. Every tail contains terms of both, and each term lies above its own subsequence\'s limit. So the sup of the tail from term n on comes down towards 5 as n grows, while the inf of every tail is 1 itself, approached but never reached: limsup xₙ = 5 and liminf xₙ = 1. The largest even-numbered sample is x₂ = 8 and the largest odd-numbered one is x₁ = 7, so the supremum of all the samples is 8.',
  xp: 100, prereqs: ['q08'],
  artifact: { name: 'Swing chart', description: 'A signal that never settles, with the two levels it keeps returning to marked in ink.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'A sequence like (−1)ⁿ never converges, but it is not hopeless: it keeps returning to two levels. A subsequence picks out some of the terms in order, such as the even-numbered ones x₂, x₄, x₆, …, and a subsequence may converge when the whole sequence does not. To find the levels exactly, look at tails. The tail from term n on is xₙ, xₙ₊₁, xₙ₊₂, …. For a bounded sequence, the sup of the tail can only come down as n grows, and its limit is the limit superior, limsup xₙ; the inf of the tail can only go up, and its limit is the limit inferior, liminf xₙ. These are the largest and the smallest limits that a subsequence can have. The Bolzano–Weierstrass theorem, that every bounded sequence has a convergent subsequence, follows: some subsequence converges to the limsup. The sequence converges exactly when limsup and liminf are equal. Note that the sup of all the terms can be larger than the limsup, because early terms count for the sup but drop out of the far tails.',
   steps: [
    'Split the sequence into subsequences that each settle, for example the even and odd terms, or the terms by remainder on division by 3.',
    'Find the limit of each subsequence.',
    'The limsup is the largest of these limits and the liminf is the smallest.',
    'For the sup of all the terms, compare the largest term of each subsequence, which is often its first.'
   ],
   example: {
    prompt: 'xₙ = (−1)ⁿ + 4 ÷ n. Find the sup of all the terms, limsup xₙ and liminf xₙ.',
    steps: [
     'Even n give 1 + 4 ÷ n, falling towards 1; odd n give −1 + 4 ÷ n, falling towards −1.',
     'So limsup xₙ = 1 and liminf xₙ = −1.',
     'The first terms are x₁ = −1 + 4 = 3 and x₂ = 1 + 2 = 3, so the sup of all the terms is 3.'
    ],
    answer: 'sup 3, limsup 1, liminf −1.'
   },
   pitfalls: [
    'Giving the sup of all the terms as the limsup. Early terms count for the sup but not for the limsup.',
    'Using the limit of only one subsequence when the sequence visits several levels.',
    'Thinking a sequence without a limit has no limsup. Every bounded sequence has both a limsup and a liminf.'
   ]
  },
  guidance: [
   { prompt: 'The even-numbered samples x₂, x₄, x₆, … form a subsequence. What is its limit?', answer: [5], labels: ['limsup'], explanation: 'For even n, xₙ = 3 + 2 + 6 ÷ n, which tends to 5. It is the largest subsequence limit, so limsup xₙ = 5.' },
   { prompt: 'What is the limit of the odd-numbered samples x₁, x₃, x₅, …?', answer: [1], labels: ['liminf'], explanation: 'For odd n, xₙ = 3 − 2 + 6 ÷ n, which tends to 1. It is the smallest subsequence limit, so liminf xₙ = 1.' },
   { prompt: 'What is the largest of all the samples, the supremum of the set?', answer: [8], labels: ['sup of all samples'], explanation: 'Each subsequence falls, so compare their first terms: x₂ = 8 and x₁ = 7. The larger is 8.' }
  ]
 }
);
})();
