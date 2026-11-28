/* Real analysis missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/real/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · Extreme and intermediate value theorems; bisection [3.3]
     q22  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · Uniform continuity and Lipschitz constants [3.4]
     q23  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · Chapter review: certifying a thermostat [3.2, 3.4]
     q24  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · The derivative as a limit; differentiability [4.1]
     q25  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · Rolle's theorem and the mean value theorem [4.2]
     q26  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · Bounds from the mean value theorem [4.2]
     q27  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · Taylor's theorem with remainder [4.3]
     q28  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · The derivative of an inverse function [4.4]
     q29  ch 5 The derivative made precise · Intermediate, 150 XP · sector 'Gauge Workshop' · Chapter review: a drifting gauge [4.2, 4.3]
     q30  ch 6 The Riemann integral · Advanced, 200 XP · sector 'Fuel Audit' · Partitions, lower and upper sums [5.1] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis I & II: Introduction to Real Analysis sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Lebl, Basic Analysis/ (Lebl, Basic Analysis).
   A title reads like: Lebl, Basic Analysis — 2.4 Cauchy sequences
   Link to the section page itself: https://www.jirka.org/ra/html/<file>.html */
const source = {
 s3_2: { title: 'Lebl, Basic Analysis — 3.2 Continuous functions', url: 'https://www.jirka.org/ra/html/sec_cont.html', description: 'Continuity by ε and δ and by sequences, with examples of a jump and of a removable discontinuity.', verified: '2026-11-28' },
 s3_3: { title: 'Lebl, Basic Analysis — 3.3 Extreme and intermediate value theorems', url: 'https://www.jirka.org/ra/html/sec_minmaxint.html', description: 'The min–max (extreme value) theorem and Bolzano’s intermediate value theorem on [a, b], and locating a root by repeated halving.', verified: '2026-11-28' },
 s3_4: { title: 'Lebl, Basic Analysis — 3.4 Uniform continuity', url: 'https://www.jirka.org/ra/html/sec_unifcont.html', description: 'Uniform continuity, uniform continuity of continuous functions on closed bounded intervals, and Lipschitz continuous functions.', verified: '2026-11-28' },
 s4_1: { title: 'Lebl, Basic Analysis — 4.1 The derivative', url: 'https://www.jirka.org/ra/html/sec_der.html', description: 'The derivative as the limit of the difference quotient, and |x| as a function that is not differentiable at 0. The one-sided limits of the quotient are worked out in this mission.', verified: '2026-11-28' },
 s4_2: { title: 'Lebl, Basic Analysis — 4.2 Mean value theorem', url: 'https://www.jirka.org/ra/html/sec_mvt.html', description: 'Rolle’s theorem and the mean value theorem.', verified: '2026-11-28' },
 s4_2b: { title: 'Lebl, Basic Analysis — 4.2 Mean value theorem', url: 'https://www.jirka.org/ra/html/sec_mvt.html', description: 'The mean value theorem. The bound on a change from a bound on |f′| is worked out in this mission.', verified: '2026-11-28' },
 s4_3: { title: 'Lebl, Basic Analysis — 4.3 Taylor’s theorem', url: 'https://www.jirka.org/ra/html/sec_taylor.html', description: 'Taylor polynomials and Taylor’s theorem with the Lagrange form of the remainder. The bounds for eˣ, sin x and cos x are worked out in this mission.', verified: '2026-11-28' },
 s4_4: { title: 'Lebl, Basic Analysis — 4.4 Inverse function theorem', url: 'https://www.jirka.org/ra/html/sec_ift.html', description: 'For a strictly monotone f with f′(x₀) ≠ 0, the inverse is differentiable at f(x₀) with derivative 1 ÷ f′(x₀).', verified: '2026-11-28' },
 s5_1: { title: 'Lebl, Basic Analysis — 5.1 The Riemann integral', url: 'https://www.jirka.org/ra/html/sec_rint.html', description: 'Partitions, lower and upper sums from the infimum and supremum on each piece, refinement and Riemann integrability. The word mesh is defined in this mission, not in the section.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'Trapping the heater’s zero', topic: 'Extreme and intermediate value theorems; bisection', tier: 'Intermediate', sector: 'Thermostat Hall',
  brief: 'The heater must switch over at the exact setting where its curve crosses zero, and Mira wants that setting pinned down to a stated tolerance.',
  lesson: 'A continuous function on a closed interval reaches a largest and a smallest value (the extreme value theorem) and takes every value in between (the intermediate value theorem); bisection uses the second to trap a root.',
  prompt: 'A thermostat’s heater curve is f(x) = x³ − 20. It is continuous, f(2) = −12 is negative and f(3) = 7 is positive, so by the intermediate value theorem f has a root between 2 and 3. Bisection halves the interval [2, 3] again and again, each time keeping the half at whose ends f has opposite signs. Mira wants the root trapped in an interval shorter than ε = 0.01, so that every point of it is within 0.01 of the root. Enter the smallest number of halvings that guarantees this, then the left end and the right end of the interval left after two halvings.',
  answer: [7, 2.5, 2.75], labels: ['halvings', 'left end', 'right end'], tolerance: 0.005,
  hints: [
   'Each halving cuts the length in half, so after k halvings an interval of length L has length L ÷ 2ᵏ. Find the first k that makes this shorter than ε.',
   'For the interval after two halvings: work out f at the midpoint, keep the half whose ends give f opposite signs, then do the same once more.'
  ],
  solution: 'After 6 halvings the length is 1 ÷ 64 ≈ 0.0156, which is not below 0.01; after 7 it is 1 ÷ 128 ≈ 0.0078, which is. So 7 halvings are needed. First halving: the midpoint is 2.5 and f(2.5) = −4.375 is negative, so the root lies in [2.5, 3]. Second halving: the midpoint is 2.75 and f(2.75) ≈ 0.7969 is positive, so after two halvings the root is trapped in [2.5, 2.75].',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Bisection log', description: 'An interval halved again and again, the root inside it every time.' },
  sources: [source.s3_3],
  teaching: {
   intuition: 'Draw a continuous curve from below the axis to above it without lifting the pen, and it must cross the axis somewhere. That is the intermediate value theorem: if f is continuous on [a, b], then f takes every value between f(a) and f(b), so when f(a) and f(b) have opposite signs, f is 0 somewhere between a and b. Its partner, the extreme value theorem, says that a continuous f on a closed bounded interval reaches a largest and a smallest value there. Neither theorem says where. Bisection finds the place: cut the interval at its midpoint, look at the sign of f there, and keep the half whose ends still have opposite signs. The theorem promises a root in that half too. Each halving cuts the length in half, so after k halvings an interval of length L has shrunk to L ÷ 2ᵏ, and once that is shorter than ε every point left is within ε of the root.',
   steps: [
    'Check that f is continuous on [a, b] and that f(a) and f(b) have opposite signs; the intermediate value theorem then gives a root inside.',
    'For the number of halvings, find the first k with L ÷ 2ᵏ < ε, where L is the starting length.',
    'For each halving, work out f at the midpoint. Keep the half at whose ends f has opposite signs.',
    'Stop when the interval is short enough; the root lies inside the last interval kept.'
   ],
   example: {
    prompt: 'f(x) = x² − 3 is continuous, negative at 1 and positive at 2. How many halvings trap its root in an interval shorter than 0.05, and what is the interval after two halvings?',
    steps: [
     'The length 1 becomes 1 ÷ 2ᵏ. 1 ÷ 16 = 0.0625 is not below 0.05, but 1 ÷ 32 = 0.03125 is, so 5 halvings.',
     'First midpoint 1.5: f(1.5) = −0.75 is negative, so keep [1.5, 2].',
     'Second midpoint 1.75: f(1.75) = 0.0625 is positive, so keep [1.5, 1.75].'
    ],
    answer: '5 halvings; after two halvings the root lies in [1.5, 1.75].'
   },
   pitfalls: [
    'Keeping the wrong half. Keep the half whose two ends give f opposite signs, not the half where f is closer to 0.',
    'Stopping at a length equal to ε. The interval must be shorter than ε, so the length has to drop below it.',
    'Using bisection on a function that is not continuous. Without continuity, a sign change does not promise a root.'
   ]
  },
  guidance: [
   { prompt: 'Start the bisection. What is the midpoint of [2, 3]?', answer: [2.5], labels: ['first midpoint'], explanation: '(2 + 3) ÷ 2 = 2.5. f(2.5) = −4.375 is negative, and f is positive at the right end, so the root lies in [2.5, 3].' },
   { prompt: 'The root lies in [2.5, 3]. What is the midpoint of this half?', answer: [2.75], labels: ['second midpoint'], explanation: '(2.5 + 3) ÷ 2 = 2.75. f(2.75) ≈ 0.7969 is positive, so the half to keep is [2.5, 2.75].' },
   { prompt: 'After k halvings the interval has length 1 ÷ 2ᵏ. What is the smallest k that makes this shorter than 0.01?', answer: [7], labels: ['halvings'], explanation: '1 ÷ 64 ≈ 0.0156 is still at least 0.01, while 1 ÷ 128 ≈ 0.0078 is below it, so 7 halvings are needed.' }
  ]
 },
 {
  id: 'q22', title: 'One tolerance for every dial setting', topic: 'Uniform continuity and Lipschitz constants', tier: 'Intermediate', sector: 'Thermostat Hall',
  brief: 'Thermostat dials are certified once, not setting by setting, so Mira needs a single input tolerance that works across the whole dial.',
  lesson: 'f is uniformly continuous when one δ works at every point at once; a Lipschitz constant K, with |f(x) − f(y)| ≤ K|x − y|, gives δ = ε ÷ K everywhere.',
  prompt: 'A thermostat turns a dial setting x, anywhere in [1, 4], into a heater power f(x) = x² + 3x. Mira wants one δ that works at every setting at once. Enter the smallest Lipschitz constant of f on [1, 4], that is the smallest K with |f(x) − f(y)| ≤ K|x − y| for all x and y in the interval, then the δ = ε ÷ K that this constant gives for ε = 0.11.',
  answer: [11, 0.01], labels: ['smallest K', 'δ'], tolerance: 0.0001,
  hints: [
   'Factor the difference with x² − y² = (x + y)(x − y): f(x) − f(y) is (x − y) times a sum of x, y and a number. The smallest K is the supremum of the size of that sum over the interval.',
   'If |x − y| < ε ÷ K, then |f(x) − f(y)| ≤ K|x − y| < ε, wherever x and y lie in the interval. One δ for every point is what uniformly continuous means.'
  ],
  solution: 'f(x) − f(y) = (x − y)(x + y + 3). For x ≠ y in [1, 4], x + y + 3 lies strictly between 5 and 11 and comes as close as you like to both, so the supremum of |x + y + 3| is 11. So |f(x) − f(y)| ≤ 11|x − y|, and no smaller constant works: the smallest Lipschitz constant is 11. With ε = 0.11, δ = 0.11 ÷ 11 = 0.01: whenever |x − y| < 0.01, |f(x) − f(y)| ≤ 11|x − y| < 0.11 at every setting at once, so f is uniformly continuous on [1, 4].',
  xp: 150, prereqs: ['q21'],
  artifact: { name: 'Dial certificate', description: 'One δ, stamped once, good for every setting.' },
  sources: [source.s3_4],
  teaching: {
   intuition: 'Continuity at a point says: for every ε there is a δ that works at that point. The δ may depend on the point. On a steep part of a curve a small input error makes a big output error, so the δ there must be small. A function is uniformly continuous on a set when, for every ε > 0, one δ > 0 works at every point at once: |x − y| < δ gives |f(x) − f(y)| < ε for all x and y in the set. A simple way to get that single δ is a Lipschitz constant: a number K with |f(x) − f(y)| ≤ K|x − y| for all x and y in the set. Then δ = ε ÷ K works everywhere, because |x − y| < ε ÷ K gives |f(x) − f(y)| < ε. For x² + px, the difference factors as (x − y)(x + y + p), so the smallest K is the supremum of |x + y + p| over the set. On a closed bounded interval that supremum is finite, but on the whole line x² has no Lipschitz constant and is not uniformly continuous.',
   steps: [
    'Write f(x) − f(y) as (x − y) times a factor, using x² − y² = (x + y)(x − y).',
    'Find the supremum of the size of that factor over all x ≠ y in the interval. It is the smallest Lipschitz constant K.',
    'For a given ε, take δ = ε ÷ K. It works at every point of the interval at once.'
   ],
   example: {
    prompt: 'f(x) = x² on [0, 5]. Find the smallest Lipschitz constant, and the δ it gives for ε = 0.05.',
    steps: [
     'x² − y² = (x − y)(x + y), and on [0, 5] the sum x + y comes as close as you like to 10, never above it.',
     'So K = 10, and δ = 0.05 ÷ 10 = 0.005.'
    ],
    answer: 'K = 10 and δ = 0.005.'
   },
   pitfalls: [
    'Using only the right end. When the interval reaches below 0, the size of x + y + p can be largest at the left end.',
    'Dividing K by ε. The δ is ε ÷ K: a steeper function needs a smaller δ.',
    'Thinking every continuous function has one δ for the whole line. x² on all of the real line has none.'
   ]
  },
  guidance: [
   { prompt: 'f(x) − f(y) = (x − y)(x + y + 3). As x and y range over [1, 4], x + y + 3 comes as close as you like to 5 and to 11. What is the supremum of its size |x + y + 3|, the smallest Lipschitz constant?', answer: [11], labels: ['smallest K'], explanation: 'The sizes at the two ends are 5 and 11, and the sum lies between them, so the supremum of its size is the larger one, 11.' },
   { prompt: 'With K = 11, what is δ = ε ÷ K for ε = 0.11?', answer: [0.01], labels: ['δ'], explanation: '0.11 ÷ 11 = 0.01. Then |x − y| < 0.01 gives |f(x) − f(y)| < 11 × 0.01 = 0.11, wherever x and y are.' }
  ]
 },
 {
  id: 'q23', title: 'Certifying the thermostat', topic: 'Chapter review: certifying a thermostat', tier: 'Intermediate', sector: 'Thermostat Hall',
  brief: 'Before the thermostat leaves the hall it needs three signatures: a tolerance for its dial, a verdict on its switch-over, and a constant for its heater.',
  lesson: 'A certificate of continuity is a δ for each ε: exact for a straight line, missing at a removable or jump discontinuity, and the same everywhere when there is a Lipschitz constant.',
  prompt: 'Mira certifies a thermostat in three checks. First, its dial reads T(x) = 4x + 15: enter the largest δ such that |x − x₀| < δ always gives |T(x) − T(x₀)| < 0.2. Second, its switch-over curve is g(x) = x² + 1 for x < 2, g(2) = 7, and g(x) = 3x − 1 for x > 2: enter 0 if g is continuous at x = 2, 1 if it has a removable discontinuity there, or 2 if it has a jump discontinuity. Third, enter the smallest Lipschitz constant of h(x) = x² − 2x on [1, 5].',
  answer: [0.05, 1, 8], labels: ['δ', 'code', 'smallest K'], tolerance: 0.001,
  hints: [
   'A straight line changes by the size of its slope times the change in x, so δ is ε divided by the size of the slope.',
   'Compare the left-hand limit, the right-hand limit and the value at the switch: different one-sided limits make a jump; equal limits with a different value make a removable discontinuity.',
   'For x² + px, h(x) − h(y) = (x − y)(x + y + p), so the constant is the supremum of |x + y + p| over the interval.'
  ],
  solution: '|T(x) − T(x₀)| = 4|x − x₀|, which is below 0.2 exactly when |x − x₀| < 0.2 ÷ 4 = 0.05, so the largest δ is 0.05. For g, the left-hand limit at 2 is 4 + 1 = 5, the right-hand limit is 3 × 2 − 1 = 5, and g(2) = 7: the discontinuity is removable, code 1. For h, h(x) − h(y) = (x − y)(x + y − 2), and on [1, 5] the sum comes as close as you like to 0 and 8, so the smallest Lipschitz constant is 8.',
  xp: 150, prereqs: ['q20', 'q22'],
  artifact: { name: 'Thermostat certificate', description: 'Three numbers that say how far the thermostat can be trusted.' },
  sources: [source.s3_2, source.s3_4],
  teaching: {
   intuition: 'This chapter turned “small input errors give small output errors” into exact promises. For a straight line T(x) = mx + c the promise is exact: |T(x) − T(x₀)| = |m| |x − x₀|, so the largest δ for a given ε is ε ÷ |m|. At a point where a function is built from two pieces, look at three numbers: the left-hand limit, the right-hand limit and the value. If the two limits differ, no δ can work and the function has a jump discontinuity. If the limits agree but the value is different, it has a removable discontinuity: changing one value would repair it. If all three agree, it is continuous there. Finally, a Lipschitz constant K makes one δ = ε ÷ K work at every point at once, which is uniform continuity. For x² + px on [a, b], K is the supremum of |x + y + p|, the larger of |2a + p| and |2b + p|.',
   steps: [
    'For a straight line, divide ε by the size of the slope to get the largest δ.',
    'At a switch point, find the left-hand limit, the right-hand limit and the value; compare them to choose the code.',
    'For x² + px on [a, b], compare |2a + p| and |2b + p|; the larger is the smallest Lipschitz constant.'
   ],
   example: {
    prompt: 'T(x) = −5x + 9 with ε = 0.5; g(x) = x² − 1 for x < 3, g(3) = 8, g(x) = 2x + 4 for x > 3; h(x) = x² + 4x on [−3, 2].',
    steps: [
     'δ = 0.5 ÷ 5 = 0.1.',
     'Left-hand limit 8, right-hand limit 10: they differ, so a jump, code 2.',
     '|2 × (−3) + 4| = 2 and |2 × 2 + 4| = 8, so K = 8.'
    ],
    answer: 'δ = 0.1, code 2, K = 8.'
   },
   pitfalls: [
    'Using the value at the switch point to decide a jump. A jump is about the two one-sided limits; the value only decides between removable and continuous.',
    'Keeping the sign of a negative slope in δ. δ is a distance, so divide by the size of the slope.',
    'Forgetting that the size of x + y + p can be largest at the left end of the interval.'
   ]
  },
  guidance: [
   { prompt: 'T(x) − T(x₀) = 4(x − x₀). What is the largest δ that makes |T(x) − T(x₀)| < 0.2 whenever |x − x₀| < δ?', answer: [0.05], labels: ['δ'], explanation: '|T(x) − T(x₀)| = 4|x − x₀| < 0.2 exactly when |x − x₀| < 0.2 ÷ 4 = 0.05. Any larger δ lets in an x with an error of 0.2 or more.' },
   { prompt: 'What does g(x) approach as x approaches 2 from the left?', answer: [5], labels: ['left-hand limit'], explanation: 'For x < 2, g(x) = x² + 1, which approaches 4 + 1 = 5.' },
   { prompt: 'What does g(x) approach as x approaches 2 from the right?', answer: [5], labels: ['right-hand limit'], explanation: 'For x > 2, g(x) = 3x − 1, which approaches 3 × 2 − 1 = 5.' },
   { prompt: 'The one-sided limits are 5 and 5, and g(2) = 7. Enter the code: 0 continuous, 1 removable, 2 jump.', answer: [1], labels: ['code'], explanation: 'The limit exists and equals 5, but g(2) is 7, so the discontinuity is removable: code 1.' },
   { prompt: 'h(x) − h(y) = (x − y)(x + y − 2). On [1, 5], what is the supremum of |x + y − 2|?', answer: [8], labels: ['smallest K'], explanation: 'The sum comes as close as you like to 0 and 8 and lies between them, so the supremum of its size is 8.' }
  ]
 },
 {
  id: 'q24', title: 'The gauge with a corner', topic: 'The derivative as a limit; differentiability', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'A gauge’s response curve is made of two pieces, and Mira needs to know whether it has a well-defined rate of change at the join.',
  lesson: 'f is differentiable at c when the difference quotient (f(c + h) − f(c)) ÷ h has a limit as h approaches 0; at a join, the limits from the left and from the right must agree.',
  prompt: 'A pressure gauge in the workshop reads f(x) = x² − x + 3 for x < 2, and f(x) = 3x − 1 for x ≥ 2 (the two pieces meet at x = 2). At x = 2, the difference quotient (f(2 + h) − f(2)) ÷ h compares the reading at a nearby setting with the reading at 2. Enter its limit as h approaches 0 from the left (h < 0), then its limit as h approaches 0 from the right (h > 0), then 1 if f is differentiable at x = 2, 0 if not.',
  answer: [3, 3, 1], labels: ['limit from the left', 'limit from the right', 'differentiable (1 or 0)'], tolerance: 0.01,
  hints: [
   'For h < 0 the point c + h is on the left piece, and for h > 0 on the right piece. f(c) itself comes from the piece for x ≥ c.',
   'f is differentiable at c exactly when the two one-sided limits are equal; the derivative is then their common value.'
  ],
  solution: 'f(2) = 5. For h > 0, f(2 + h) − f(2) = 3h, so the quotient is 3. For h < 0, f(2 + h) − f(2) = h² + 3h, so the quotient is h + 3, which approaches 3. The one-sided limits are 3 and 3. They agree, so the difference quotient has the limit 3 and f is differentiable at x = 2 with f′(2) = 3: enter 1.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Corner gauge', description: 'A curve whose slope from the left and from the right do not match.' },
  sources: [source.s4_1],
  teaching: {
   intuition: 'Calculus found derivatives with rules. Here we go back to the definition. The difference quotient (f(c + h) − f(c)) ÷ h is the slope of the line from the point at c to the point at c + h, for a small h that is not 0. f is differentiable at c when this quotient has a limit as h approaches 0, in the ε–δ sense: one number L such that for every ε > 0 some δ > 0 makes the quotient within ε of L whenever 0 < |h| < δ. That limit is f′(c). Where a curve is made of two pieces joined at c, or has an absolute value like |x − c|, look at the two sides separately. For h < 0 we only use points to the left of c, and the quotient’s limit there is the limit from the left; for h > 0 it is the limit from the right. If the two one-sided limits are equal, the quotient has a limit and f is differentiable at c. If they differ, the graph has a corner, and f is not differentiable there, even though it is continuous.',
   steps: [
    'Find f(c) from the piece that holds at x = c.',
    'For h < 0, write f(c + h) − f(c) using the left piece (or |h| = −h), divide by h and let h approach 0.',
    'For h > 0, do the same with the right piece (or |h| = h).',
    'Compare the two limits: equal means differentiable, with f′(c) the common value; different means not differentiable.'
   ],
   example: {
    prompt: 'f(x) = 3|x − 1| + 2x. Find the two one-sided limits of the difference quotient at x = 1. Is f differentiable there?',
    steps: [
     'f(1 + h) − f(1) = 3|h| + 2h, so the quotient is 3|h| ÷ h + 2.',
     'For h < 0 it is −3 + 2 = −1; for h > 0 it is 3 + 2 = 5.'
    ],
    answer: 'The limits are −1 and 5. They differ, so f is not differentiable at x = 1.'
   },
   pitfalls: [
    'Using the left piece for f(c) as well. f(c) comes from whichever piece holds at x = c itself.',
    'Forgetting that |h| ÷ h is −1 when h is negative.',
    'Deciding that a continuous function must be differentiable. A corner is continuous but has no derivative.'
   ]
  },
  guidance: [
   { prompt: 'Take h < 0, so 2 + h is just left of 2. What does (f(2 + h) − f(2)) ÷ h approach as h approaches 0?', answer: [3], labels: ['limit from the left'], explanation: 'For h < 0 the left piece applies: the difference is h² + 3h, so the quotient is h + 3, which approaches 3.' },
   { prompt: 'Now take h > 0. What does the quotient approach?', answer: [3], labels: ['limit from the right'], explanation: 'For h > 0 the right piece applies: the difference is 3h, so the quotient is 3.' },
   { prompt: 'The one-sided limits are 3 and 3. Enter 1 if f is differentiable at x = 2, 0 if not.', answer: [1], labels: ['differentiable (1 or 0)'], explanation: 'Both sides give 3, so the limit exists and f′(2) = 3.' }
  ]
 },
 {
  id: 'q25', title: 'Where the needle matches the average', topic: 'Rolle’s theorem and the mean value theorem', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'A gauge needle swept across a range of settings, and Mira wants the exact setting where its instant rate equalled its average rate.',
  lesson: 'If f is continuous on [a, b] and differentiable between a and b, some c strictly between them has f′(c) = (f(b) − f(a)) ÷ (b − a); Rolle’s theorem is the case f(a) = f(b).',
  prompt: 'A gauge needle sits at f(x) = x³ − 3x² + x for settings x from 0 to 3. f is a polynomial, so it is continuous on [0, 3] and differentiable between 0 and 3. Enter the average slope (f(3) − f(0)) ÷ (3 − 0), then the point c strictly between 0 and 3 where f′(c) equals that slope, as the mean value theorem promises. Here there is exactly one such c.',
  answer: [1, 2], labels: ['average slope', 'c'], tolerance: 0.01,
  hints: [
   'Work out f at both ends, subtract, and divide by the length of the interval.',
   'Differentiate, set f′(c) equal to the average slope, and solve the quadratic. Keep the solution that lies strictly between the two ends.'
  ],
  solution: 'f(0) = 0 and f(3) = 3, so the average slope is (3 − 0) ÷ 3 = 1. f′(x) = 3x² − 6x + 1, so c must solve 3c² − 6c + 1 = 1. Its solutions are 2 and 0; only 2 lies strictly between 0 and 3, so c = 2.',
  xp: 150, prereqs: ['q24', 'q21'],
  artifact: { name: 'Matched needle', description: 'The one setting where the needle moved at exactly its average rate.' },
  sources: [source.s4_2],
  teaching: {
   intuition: 'Rolle’s theorem starts with a function that ends where it began: f continuous on [a, b], differentiable between a and b, and f(a) = f(b). Then somewhere strictly between a and b the derivative is 0. The reason uses the extreme value theorem: f reaches a largest and a smallest value on [a, b], and unless f is constant one of them is inside the interval, where the graph is flat. Tilt the picture and you get the mean value theorem: for f continuous on [a, b] and differentiable between a and b, some c strictly between a and b has f′(c) = (f(b) − f(a)) ÷ (b − a). The average slope over the whole interval is matched by the instant slope at some point. A car that covers 120 kilometres in 2 hours was going exactly 60 kilometres per hour at some moment. The theorem promises that c exists; for a polynomial we can find it by solving f′(c) = the average slope.',
   steps: [
    'Check that f is continuous on [a, b] and differentiable between a and b. Every polynomial is.',
    'Work out the average slope (f(b) − f(a)) ÷ (b − a).',
    'Differentiate and solve f′(c) = the average slope.',
    'Keep only the solutions strictly between a and b.'
   ],
   example: {
    prompt: 'f(x) = x³ on [−1, 2]. Find the average slope and the point c the mean value theorem promises.',
    steps: [
     'f(−1) = −1 and f(2) = 8, so the average slope is 9 ÷ 3 = 3.',
     'f′(c) = 3c² = 3 gives c = 1 or c = −1.',
     'Only 1 lies strictly between −1 and 2.'
    ],
    answer: 'The average slope is 3, and c = 1.'
   },
   pitfalls: [
    'Keeping a solution at an end point or outside the interval. The theorem’s c is strictly between a and b.',
    'Dividing by b instead of b − a, or getting the sign of b − a wrong when a is negative.',
    'Using the theorem for a function with a corner. Without differentiability between a and b there may be no such c.'
   ]
  },
  guidance: [
   { prompt: 'f(0) = 0 and f(3) = 3. What is the average slope over [0, 3]?', answer: [1], labels: ['average slope'], explanation: '(3 − 0) ÷ (3 − 0) = 3 ÷ 3 = 1.' },
   { prompt: 'f′(x) = 3x² − 6x + 1. Solve 3c² − 6c + 1 = 1. Which solution lies strictly between 0 and 3?', answer: [2], labels: ['c'], explanation: 'The solutions are 2 and 0. Only 2 is inside the interval, and f′(2) = 1, the average slope.' }
  ]
 },
 {
  id: 'q26', title: 'How far can the gauge drift?', topic: 'Bounds from the mean value theorem', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'A gauge only has a limit on how fast it drifts, and Mira needs a guaranteed window for where its reading can end up.',
  lesson: 'If |f′| ≤ M between a and b, the mean value theorem gives |f(b) − f(a)| ≤ M(b − a), and that bound cannot be improved.',
  prompt: 'A pressure gauge drifts while it warms up. From t = 2 to t = 7 hours its reading f(t), in kilopascals, changes smoothly (f is differentiable), and the drift rate never exceeds 0.4 in size: |f′(t)| ≤ 0.4 kilopascals per hour. At t = 2 the gauge reads 35. Enter the largest possible change |f(7) − f(2)|, then the lowest and the highest readings the gauge could show at t = 7.',
  answer: [2, 33, 37], labels: ['largest change (kPa)', 'lowest reading (kPa)', 'highest reading (kPa)'], tolerance: 0.01,
  hints: [
   'The mean value theorem writes the change as f′(c) × (the length of the time interval) for some c in between. Bound |f′(c)| by the drift limit.',
   'From where it started, the reading can move down or up by at most that largest change.'
  ],
  solution: 'By the mean value theorem, f(7) − f(2) = f′(c) × (7 − 2) for some c between 2 and 7, so |f(7) − f(2)| ≤ 0.4 × 5 = 2 kilopascals. The readings f(t) = 35 + 0.4(t − 2) and f(t) = 35 − 0.4(t − 2) obey the drift limit and change by exactly 2, so no smaller bound is safe. At t = 7 the reading lies between 35 − 2 = 33 and 35 + 2 = 37.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'Drift window', description: 'A start reading and the guaranteed band it can drift into.' },
  sources: [source.s4_2b],
  teaching: {
   intuition: 'The mean value theorem turns a fact about rates into a fact about totals. For a differentiable f, f(b) − f(a) = f′(c)(b − a) for some c between a and b. We do not know c, but if we know that |f′(t)| ≤ M everywhere on the interval, then |f′(c)| ≤ M too, so |f(b) − f(a)| ≤ M(b − a). A gauge that can drift at most 0.5 kilopascals per hour cannot move more than 0.5 × 6 = 3 kilopascals in 6 hours, whatever it does in between. The bound is the best possible: a reading that drifts steadily at exactly M, f(t) = f(a) + M(t − a), changes by exactly M(b − a), and so does one that falls steadily at M. So the reading at b lies in the window from f(a) − M(b − a) to f(a) + M(b − a), and both ends of the window can happen.',
   steps: [
    'Find the length b − a of the interval.',
    'Multiply by the bound M on |f′|: the largest possible change is M(b − a).',
    'Subtract it from and add it to the starting reading to get the lowest and highest possible readings.'
   ],
   example: {
    prompt: 'A reading starts at 40 at t = 0, and |f′(t)| ≤ 0.5 per hour until t = 6. How far can it drift, and where can it end?',
    steps: [
     'The change is at most 0.5 × 6 = 3.',
     'The reading at t = 6 lies between 40 − 3 = 37 and 40 + 3 = 43.'
    ],
    answer: 'At most 3; between 37 and 43.'
   },
   pitfalls: [
    'Multiplying by the end time instead of the length of the interval.',
    'Giving only the upward window. The drift may go down as well as up.',
    'Thinking the bound is only rough. A steady drift at exactly the limit reaches it.'
   ]
  },
  guidance: [
   { prompt: 'The time interval has length 7 − 2 = 5 hours, and |f′| ≤ 0.4. What is the largest possible change |f(7) − f(2)|?', answer: [2], labels: ['largest change (kPa)'], explanation: 'The mean value theorem gives |f(7) − f(2)| = |f′(c)| × 5 ≤ 0.4 × 5 = 2.' },
   { prompt: 'The gauge started at 35. What is the lowest reading it could show at t = 7?', answer: [33], labels: ['lowest reading (kPa)'], explanation: 'It can fall by at most 2: 35 − 2 = 33.' },
   { prompt: 'And the highest reading at t = 7?', answer: [37], labels: ['highest reading (kPa)'], explanation: 'It can rise by at most 2: 35 + 2 = 37.' }
  ]
 },
 {
  id: 'q27', title: 'A guaranteed Taylor error', topic: 'Taylor’s theorem with remainder', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'The workshop’s converters replace exact functions by polynomials, and each converter needs a certificate for its worst error.',
  lesson: 'Taylor’s theorem writes the error of the degree-n Taylor polynomial as f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × (x − x₀)ⁿ⁺¹ for some c between x₀ and x; a bound on f⁽ⁿ⁺¹⁾ turns that into a guaranteed error.',
  prompt: 'The gauge workshop approximates eˣ at x = 1 by its Taylor polynomial of degree n about 0. By Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. Every derivative of eˣ is eˣ, and eᶜ < 3 for every c between 0 and 1, so the error at x = 1 is at most 3 ÷ (n + 1)!. Enter this bound for degree 4 as a fraction in lowest terms, numerator then denominator (type them without commas), then the smallest degree n for which the bound is below 0.0001.',
  answer: [1, 40, 7], labels: ['numerator', 'denominator', 'smallest degree'], tolerance: 0.01,
  hints: [
   'For degree n the bound has (n + 1)! underneath and the power n + 1 of x on top. Cancel common factors to reach lowest terms.',
   'The bound shrinks as the degree grows. Try degrees one after another until it first drops below ε.'
  ],
  solution: 'For degree 4, k = n + 1 = 5, so the bound is 3 ÷ 5! = 3 ÷ 120 = 1/40 in lowest terms. The bound for degree n is below 0.0001 exactly when (n + 1)! is bigger than 3 × 10000 = 30000. For degree 6: 7! = 5040, which is not bigger than 30000. For degree 7: 8! = 40320, which is bigger than 30000. So the smallest degree is 7.',
  xp: 150, prereqs: ['q26'],
  artifact: { name: 'Converter certificate', description: 'A polynomial and the largest error it can ever make at one point.' },
  sources: [source.s4_3],
  teaching: {
   intuition: 'In Calculus 2 a Taylor polynomial was an approximation that got better with more terms. Taylor’s theorem says exactly how good. Let Pₙ be the Taylor polynomial of f of degree n about x₀. Then f(x) = Pₙ(x) + f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × (x − x₀)ⁿ⁺¹ for some c between x₀ and x. Here f⁽ⁿ⁺¹⁾ is the derivative taken n + 1 times, and the last term is the Taylor remainder in its Lagrange form. It is the mean value theorem grown up: for n = 0 it says f(x) = f(x₀) + f′(c)(x − x₀). We never learn c, but if every value of f⁽ⁿ⁺¹⁾ between x₀ and x is at most M in size, the error is at most M|x − x₀|ⁿ⁺¹ ÷ (n + 1)!. For sin x and cos x every derivative is ±sin x or ±cos x, so M = 1. For eˣ every derivative is eˣ, and between 0 and 1 it stays below 3. Because (n + 1)! grows faster than any power, the bound shrinks to 0, and we can choose the degree that makes it smaller than any ε.',
   steps: [
    'Find a bound M on the size of the (n + 1)th derivative between the centre and the point.',
    'Write the bound M|x − x₀|ⁿ⁺¹ ÷ (n + 1)! for the degree asked, and reduce the fraction.',
    'For a wanted accuracy ε, try degrees in turn until the bound first drops below ε.'
   ],
   example: {
    prompt: 'sin x at x = 1, Taylor polynomial about 0. Bound the error for degree 3, and find the smallest degree whose bound is below 0.01.',
    steps: [
     'M = 1, so the bound for degree 3 is 1⁴ ÷ 4! = 1/24.',
     'The bound 1 ÷ (n + 1)! is below 0.01 when (n + 1)! is bigger than 100: 4! = 24 is not, 5! = 120 is.'
    ],
    answer: 'The bound is 1/24, and the smallest degree is 4.'
   },
   pitfalls: [
    'Using n! instead of (n + 1)!. The remainder of degree n uses the next derivative and the next factorial.',
    'Forgetting the bound M. For eˣ the derivatives are not at most 1; between 0 and 1 they stay below 3.',
    'Stopping at a degree whose bound equals ε or lies above it. The bound must be strictly below ε.'
   ]
  },
  guidance: [
   { prompt: 'For degree 4 the bound is 3 ÷ 5!, and 5! = 120. In lowest terms, what is the numerator?', answer: [1], labels: ['numerator'], explanation: '3 and 120 have highest common factor 3, so 3 ÷ 120 = 1/40.' },
   { prompt: 'And the denominator in lowest terms?', answer: [40], labels: ['denominator'], explanation: '120 ÷ 3 = 40.' },
   { prompt: 'What is the smallest degree n whose bound is below 0.0001?', answer: [7], labels: ['smallest degree'], explanation: 'The bound for degree n is below 0.0001 exactly when (n + 1)! is bigger than 3 × 10000 = 30000. For degree 6: 7! = 5040, which is not bigger than 30000. For degree 7: 8! = 40320, which is bigger than 30000. So the smallest degree is 7.' }
  ]
 },
 {
  id: 'q28', title: 'Reading the dial backwards', topic: 'The derivative of an inverse function', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'Operators read the gauge and need to know which dial position produced it, and how sensitive that answer is to a small error in the reading.',
  lesson: 'If f is strictly monotone and f′(x₀) ≠ 0, the inverse function f⁻¹ is differentiable at y₀ = f(x₀), and (f⁻¹)′(y₀) = 1 ÷ f′(x₀).',
  prompt: 'A gauge turns a dial position x into a reading f(x) = x³ + 2x + 1. Its derivative f′(x) = 3x² + 2 is positive, so f is strictly increasing and has an inverse function f⁻¹ that turns a reading back into a dial position. For the reading y = 13, enter x₀ = f⁻¹(13), then f′(x₀), then the derivative (f⁻¹)′(13), either as a fraction typed like 2/3 or as a decimal rounded to 5 decimal places.',
  answer: [2, 14, 0.071428571], labels: ['x₀', 'f′(x₀)', '(f⁻¹)′(y)'], tolerance: 0.00005,
  hints: [
   'Try small whole numbers for x until f(x) equals the reading; that x is the dial position f⁻¹ gives.',
   'The inverse function theorem: (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀), provided f′(x₀) is not 0.'
  ],
  solution: 'f(2) = 2³ + 2 × 2 + 1 = 13, and f is strictly increasing, so no other x gives 13: x₀ = 2. f′(2) = 3 × 2² + 2 = 14. By the inverse function theorem, (f⁻¹)′(13) = 1 ÷ f′(2) = 1/14.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Reverse dial', description: 'A reading turned back into a setting, with its sensitivity.' },
  sources: [source.s4_4],
  teaching: {
   intuition: 'A strictly increasing function never takes the same value twice, so each output y comes from exactly one input x. The inverse function f⁻¹ sends y back to that x: f⁻¹(y) = x exactly when f(x) = y. A function whose derivative is positive everywhere is strictly increasing. How fast does f⁻¹ change? Near x₀ the graph of f is almost a straight line of slope f′(x₀): moving x by a small amount moves y about f′(x₀) times as much. Going backwards, moving y moves x about 1 ÷ f′(x₀) times as much. The inverse function theorem makes this exact: if f is strictly monotone, differentiable at x₀ and f′(x₀) ≠ 0, then f⁻¹ is differentiable at y₀ = f(x₀) and (f⁻¹)′(y₀) = 1 ÷ f′(x₀). Note the two different points: the derivative of f⁻¹ is taken at the reading y₀, the derivative of f at the setting x₀.',
   steps: [
    'Check that f is strictly increasing (or decreasing), for example because f′ is positive everywhere.',
    'Find x₀ = f⁻¹(y₀) by solving f(x) = y₀; for these gauges, try small whole numbers.',
    'Work out f′(x₀).',
    'The answer is (f⁻¹)′(y₀) = 1 ÷ f′(x₀).'
   ],
   example: {
    prompt: 'f(x) = x³ + x, which is strictly increasing. Find (f⁻¹)′(10).',
    steps: [
     'f(2) = 8 + 2 = 10, so f⁻¹(10) = 2.',
     'f′(x) = 3x² + 1, so f′(2) = 13.',
     '(f⁻¹)′(10) = 1 ÷ 13.'
    ],
    answer: '(f⁻¹)′(10) = 1/13.'
   },
   pitfalls: [
    'Putting the reading y into f′. The derivative of f is taken at the setting x₀ = f⁻¹(y₀), not at y₀.',
    'Confusing f⁻¹ with 1 ÷ f. The inverse function undoes f; it is not a reciprocal.',
    'Forgetting to check that f′(x₀) is not 0. Where f′ is 0, f⁻¹ has no derivative.'
   ]
  },
  guidance: [
   { prompt: 'Which whole number x₀ gives f(x₀) = 13?', answer: [2], labels: ['x₀'], explanation: 'f(2) = 13. Since f is strictly increasing, it is the only one.' },
   { prompt: 'What is f′(2)?', answer: [14], labels: ['f′(x₀)'], explanation: 'f′(2) = 3 × 2² + 2 = 14.' },
   { prompt: 'What is (f⁻¹)′(13) = 1 ÷ f′(2)? Enter it as a fraction, or as a decimal rounded to 5 decimal places.', answer: [0.071428571], labels: ['(f⁻¹)′(y)'], explanation: '1 ÷ 14 = 1/14. A small change in the reading moves the dial 14 times less.' }
  ]
 },
 {
  id: 'q29', title: 'Signing off a drifting gauge', topic: 'Chapter review: a drifting gauge', tier: 'Intermediate', sector: 'Gauge Workshop',
  brief: 'The last gauge of the workshop needs two guarantees before it is installed: how far it can drift, and how good its converter is.',
  lesson: 'The mean value theorem bounds a change by the size of the derivative times the length; Taylor’s theorem bounds an approximation error by the next derivative over the next factorial.',
  prompt: 'Mira signs off a drifting gauge in two parts. First, from t = 0 to t = 8 hours its reading f(t) is differentiable with |f′(t)| ≤ 0.3 kilopascals per hour: enter the largest possible change |f(8) − f(0)|. Second, its converter replaces sin x at x = 2 by the Taylor polynomial of degree n about 0, and by Taylor’s theorem with the Lagrange form of the remainder the error is at most 2ⁿ⁺¹ ÷ (n + 1)! (every derivative is ±sin x or ±cos x, at most 1 in size): enter the smallest degree n that makes this bound less than 0.001.',
  answer: [2.4, 9], labels: ['largest change (kPa)', 'smallest degree'], tolerance: 0.01,
  hints: [
   'The mean value theorem: the change is f′(c) times the length of the time interval, for some c in between.',
   'The remainder bound shrinks as the degree grows; try degrees in turn until it first drops below ε.'
  ],
  solution: 'By the mean value theorem, |f(8) − f(0)| = |f′(c)| × 8 ≤ 0.3 × 8 = 2.4 kilopascals, and a reading that drifts at exactly 0.3 per hour reaches it. The bound for degree n is below 0.001 exactly when (n + 1)! is bigger than 2ⁿ⁺¹ × 1000. For degree 8: 9! = 362880, which is not bigger than 512000. For degree 9: 10! = 3628800, which is bigger than 1024000. So the smallest degree is 9.',
  xp: 150, prereqs: ['q27', 'q28'],
  artifact: { name: 'Gauge Tower seal', description: 'A gauge certified for drift and for conversion.' },
  sources: [source.s4_2b, source.s4_3],
  teaching: {
   intuition: 'Both certificates in this chapter come from the same idea: a value we cannot know, the c in the mean value theorem or in Taylor’s theorem, is replaced by the worst case. For drift, f(b) − f(a) = f′(c)(b − a), and a bound |f′| ≤ M gives |f(b) − f(a)| ≤ M(b − a), which a steady drift at exactly M reaches. For conversion, the error of the Taylor polynomial of degree n is f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × (x − x₀)ⁿ⁺¹. With every derivative at most M in size, the error is at most M|x − x₀|ⁿ⁺¹ ÷ (n + 1)!, and the smallest degree that pushes this below ε is found by trying degrees in turn.',
   steps: [
    'Drift: multiply the bound on |f′| by the length of the time interval.',
    'Conversion: write the remainder bound M|x − x₀|ⁿ⁺¹ ÷ (n + 1)! for the function.',
    'Find the first degree n whose bound is strictly below ε.'
   ],
   example: {
    prompt: '|f′| ≤ 0.6 over 5 hours; cos x at x = 1 about 0, error at most 1 ÷ (n + 1)!, with ε = 0.001.',
    steps: [
     'The drift is at most 0.6 × 5 = 3.',
     '(n + 1)! must be bigger than 1000: 6! = 720 is not, 7! = 5040 is, so n = 6.'
    ],
    answer: 'At most 3 kilopascals; degree 6.'
   },
   pitfalls: [
    'Using the end time instead of the length of the interval.',
    'Using n! in the remainder instead of (n + 1)!.',
    'Forgetting the power of x when x is not 1: at x = 2 the bound is 2ⁿ⁺¹ ÷ (n + 1)!.'
   ]
  },
  guidance: [
   { prompt: 'The interval is 8 hours long and |f′| ≤ 0.3. What is the largest possible change?', answer: [2.4], labels: ['largest change (kPa)'], explanation: '0.3 × 8 = 2.4.' },
   { prompt: 'What is the smallest degree n whose remainder bound is below 0.001?', answer: [9], labels: ['smallest degree'], explanation: 'The bound for degree n is below 0.001 exactly when (n + 1)! is bigger than 2ⁿ⁺¹ × 1000. For degree 8: 9! = 362880, which is not bigger than 512000. For degree 9: 10! = 3628800, which is bigger than 1024000. So the smallest degree is 9.' }
  ]
 },
 {
  id: 'q30', title: 'Two guaranteed fuel totals', topic: 'Partitions, lower and upper sums', tier: 'Advanced', sector: 'Fuel Audit',
  brief: 'The fuel audit cannot measure the burn exactly, so Mira wants one total that is certainly too low and one that is certainly too high.',
  lesson: 'A partition P cuts [a, b] into pieces; the lower sum L(P, f) adds infimum × length over the pieces and the upper sum U(P, f) adds supremum × length.',
  prompt: 'The fuel audit pins the fuel burned between two guaranteed totals. The burn rate is f(x) = x² + 1 on [0, 4], where it is increasing. Take the partition P = {0, 1, 3, 4}, which cuts the interval into 3 pieces; its mesh, the length of the longest piece, is 2. Enter the lower sum L(P, f), then the upper sum U(P, f).',
  answer: [15, 39], labels: ['lower sum', 'upper sum'], tolerance: 0.01,
  hints: [
   'A monotone function takes its infimum and its supremum on each piece at the two ends of that piece. Decide which end gives which.',
   'L(P, f) adds up infimum × length over the pieces; U(P, f) adds up supremum × length.'
  ],
  solution: 'f is increasing, so on each piece the infimum is at the left end and the supremum at the right end: on [0, 1] the infimum is f(0) = 1 and the supremum is f(1) = 2; on [1, 3] the infimum is f(1) = 2 and the supremum is f(3) = 10; on [3, 4] the infimum is f(3) = 10 and the supremum is f(4) = 17. L(P, f) = 1 × 1 + 2 × 2 + 10 × 1 = 15 and U(P, f) = 2 × 1 + 10 × 2 + 17 × 1 = 39. Every lower sum is at most the true total and every upper sum at least it, so the fuel burned lies between 15 and 39.',
  xp: 200, prereqs: ['q05'],
  artifact: { name: 'Audit bracket', description: 'A total pinned between a guaranteed low and a guaranteed high.' },
  sources: [source.s5_1],
  teaching: {
   intuition: 'Calculus defined the integral through Riemann sums with sample points. Real analysis builds it from two sums that cannot be wrong in a known direction. A partition P of [a, b] is a finite list of points a = x₀ < x₁ < … < xₙ = b. It cuts the interval into n pieces; the length of the longest piece is called the mesh of the partition. On each piece take the infimum m of f there (the greatest lower bound of its values) and the supremum M (the least upper bound). The lower sum L(P, f) adds m × length over the pieces, and the upper sum U(P, f) adds M × length. For a positive rate, every L(P, f) is at most the true total and every U(P, f) is at least it. For a monotone function the infimum and supremum on each piece sit at the two ends: for an increasing f the infimum is at the left end and the supremum at the right; for a decreasing f it is the other way round. The pieces need not have equal lengths.',
   steps: [
    'List the pieces of the partition and their lengths.',
    'On each piece find the infimum and the supremum of f; for a monotone f they are the values at the two ends.',
    'Add infimum × length to get L(P, f), and supremum × length to get U(P, f).'
   ],
   example: {
    prompt: 'f(x) = 2x + 1 on [0, 4], which is increasing, with the partition P = {0, 1, 2, 4}. Find L(P, f) and U(P, f).',
    steps: [
     'Pieces [0, 1], [1, 2] and [2, 4], of lengths 1, 1 and 2.',
     'Infima f(0) = 1, f(1) = 3, f(2) = 5; suprema f(1) = 3, f(2) = 5, f(4) = 9.',
     'L = 1 × 1 + 3 × 1 + 5 × 2 = 14 and U = 3 × 1 + 5 × 1 + 9 × 2 = 26.'
    ],
    answer: 'L(P, f) = 14 and U(P, f) = 26.'
   },
   pitfalls: [
    'Multiplying every piece by the same length. With an uneven partition each piece has its own length.',
    'Taking the left end as the infimum for a decreasing function. There the smallest value is at the right end.',
    'Counting the points of the partition as the number of pieces. Four points make three pieces.'
   ]
  },
  guidance: [
   { prompt: 'On the first piece, [0, 1], what is the infimum of f?', answer: [1], labels: ['infimum on the first piece'], explanation: 'f is increasing, so its smallest value on the piece is at the left end: f(0) = 1.' },
   { prompt: 'Add infimum × length over all the pieces. What is L(P, f)?', answer: [15], labels: ['lower sum'], explanation: 'L(P, f) = 1 × 1 + 2 × 2 + 10 × 1 = 15.' },
   { prompt: 'Add supremum × length over all the pieces. What is U(P, f)?', answer: [39], labels: ['upper sum'], explanation: 'U(P, f) = 2 × 1 + 10 × 2 + 17 × 1 = 39.' }
  ]
 }
);
})();
