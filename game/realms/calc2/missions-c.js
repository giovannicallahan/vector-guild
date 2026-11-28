/* Calculus 2: accumulation missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/calc2/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Partial fractions [3.4]
     q22  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Trapezoidal and Simpson's rules [3.6]
     q23  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Chapter review: choosing a technique [3.5]
     q24  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Improper integrals over an endless interval [3.7]
     q25  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Improper integrals where the integrand blows up [3.7]
     q26  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Exponential growth and decay; half-life [2.8]
     q27  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Sequences and their limits [5.1]
     q28  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Geometric series [5.2]
     q29  ch 5 Growth and the infinite · Intermediate, 150 XP · sector 'Deep Signal Array' · Chapter review: the infinite so far [3.7, 5.1, 5.2]
     q30  ch 6 Testing series · Advanced, 200 XP · sector 'Signal Lab' · Partial sums, telescoping series, the divergence test [5.2, 5.3] */
(function(){
'use strict';
/* OpenStax Calculus Volume 2 sections, one entry per section the missions below cite (the plan, docs/plans/CALC2-PLAN.md,
   records that each page was opened on 2026-11-27). Every mission needs at least one source whose title matches /OpenStax/. */
const source = {
 s2_8: { title: 'OpenStax Calculus Volume 2 — 2.8 Exponential Growth and Decay', url: 'https://openstax.org/books/calculus-volume-2/pages/2-8-exponential-growth-and-decay', description: 'Exponential decay, the rate constant, half-life and doubling time.', verified: '2026-11-27' },
 s3_4: { title: 'OpenStax Calculus Volume 2 — 3.4 Partial Fractions', url: 'https://openstax.org/books/calculus-volume-2/pages/3-4-partial-fractions', description: 'Splitting a rational function over linear factors into partial fractions, and integrating the pieces.', verified: '2026-11-27' },
 s3_5: { title: 'OpenStax Calculus Volume 2 — 3.5 Other Strategies for Integration', url: 'https://openstax.org/books/calculus-volume-2/pages/3-5-other-strategies-for-integration', description: 'Choosing a method of integration, with tables and computer algebra.', verified: '2026-11-27' },
 s3_6: { title: 'OpenStax Calculus Volume 2 — 3.6 Numerical Integration', url: 'https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration', description: 'The midpoint, trapezoidal and Simpson’s rules and their errors.', verified: '2026-11-27' },
 s3_7: { title: 'OpenStax Calculus Volume 2 — 3.7 Improper Integrals', url: 'https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals', description: 'Integrals over infinite intervals and of integrands that are unbounded, and when they converge.', verified: '2026-11-27' },
 s5_1: { title: 'OpenStax Calculus Volume 2 — 5.1 Sequences', url: 'https://openstax.org/books/calculus-volume-2/pages/5-1-sequences', description: 'Sequences, their terms and their limits.', verified: '2026-11-27' },
 s5_2: { title: 'OpenStax Calculus Volume 2 — 5.2 Infinite Series', url: 'https://openstax.org/books/calculus-volume-2/pages/5-2-infinite-series', description: 'Partial sums, geometric series and telescoping series.', verified: '2026-11-27' },
 s5_3: { title: 'OpenStax Calculus Volume 2 — 5.3 The Divergence and Integral Tests', url: 'https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests', description: 'The divergence test, the integral test and p-series.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'Splitting the heat model', topic: 'Partial fractions', tier: 'Intermediate', sector: 'Computing Core',
  brief: 'The Computing Core’s heat model has a fraction that no rule integrates as it stands, and Mira wants it broken into pieces the core already knows.',
  lesson: 'A fraction whose bottom is a product of two different linear factors splits into partial fractions A ÷ (x + a) + B ÷ (x + b), and each piece integrates to a logarithm.',
  prompt: 'The Computing Core’s heat model needs ∫ from 0 to 2 of (5x + 7) ÷ ((x + 1)(x + 2)) dx. Split the fraction into partial fractions, A ÷ (x + 1) + B ÷ (x + 2). Enter A, then B, then the value of the integral to 3 decimal places.',
  answer: [2, 3, 4.277], labels: ['A', 'B', 'integral (3 d.p.)'], tolerance: 0.0005,
  hints: [
   'Multiply both sides by (x + 1)(x + 2): 5x + 7 = A(x + 2) + B(x + 1). Put x = −1 to make the B part vanish, then x = −2 to make the A part vanish.',
   'Each partial fraction gives a logarithm: ∫ A ÷ (x + 1) dx = A ln|x + 1|. Work out both logarithms at x = 2 and at x = 0, and subtract.'
  ],
  solution: 'Multiply both sides by (x + 1)(x + 2): 5x + 7 = A(x + 2) + B(x + 1). With x = −1: 5 × (−1) + 7 = 2, and the right side is A × 1, so A = 2 ÷ 1 = 2. With x = −2: 5 × (−2) + 7 = −3, and the right side is B × (−1), so B = −3 ÷ (−1) = 3. The integrand is 2 ÷ (x + 1) + 3 ÷ (x + 2), with antiderivative 2 ln|x + 1| + 3 ln|x + 2|. From x = 0 to x = 2 that is 2 × (ln 3 − ln 1) + 3 × (ln 4 − ln 2) ≈ 2.1972 + 2.0794, which is 4.277 to 3 decimal places.',
  xp: 150, prereqs: ['q05'],
  artifact: { name: 'Split-fraction card', description: 'One awkward fraction written as two easy ones.' },
  sources: [source.s3_4],
  teaching: {
   intuition: 'Adding fractions is easy: 4 ÷ (x + 2) + 1 ÷ (x + 5), over the common bottom (x + 2)(x + 5), is (5x + 22) ÷ ((x + 2)(x + 5)). For integrating we want to go the other way. The single fraction has no rule of its own, but each small piece does: the integral of A ÷ (x + a) is A ln|x + a|, one of the logarithm integrals you met earlier. So we undo the adding and split the fraction back into its pieces, which are called partial fractions. This works when the bottom is a product of two different linear factors (a linear factor is x plus or minus a number, such as x + 2) and the top has a lower power of x than the bottom. To find the numerators, multiply both sides by the bottom, then put in the value of x that makes one factor 0: one unknown is left on its own.',
   steps: [
    'Check the shape: the bottom is (x + a)(x + b) with a and b different, and the top has a lower power of x than the bottom.',
    'Write the fraction as A ÷ (x + a) + B ÷ (x + b) and multiply both sides by (x + a)(x + b): the top equals A(x + b) + B(x + a).',
    'Put x = −a: the B part is 0, so A is the top’s value there divided by b − a. Put x = −b to find B the same way.',
    'Integrate each piece: A ÷ (x + a) gives A ln|x + a| and B ÷ (x + b) gives B ln|x + b|. Work out both at the two limits and subtract.'
   ],
   example: {
    prompt: 'Find ∫ from 0 to 1 of (3x + 5) ÷ ((x + 1)(x + 3)) dx.',
    steps: [
     '3x + 5 = A(x + 3) + B(x + 1). Put x = −1: 2 = 2A, so A = 1. Put x = −3: −4 = −2B, so B = 2.',
     'The antiderivative is ln|x + 1| + 2 ln|x + 3|. From 0 to 1: (ln 2 − ln 1) + 2 × (ln 4 − ln 3) ≈ 0.6931 + 0.5754.'
    ],
    answer: 'A = 1 and B = 2, and the integral is about 1.269.'
   },
   pitfalls: [
    'Putting x = a instead of x = −a. The factor x + a is 0 when x = −a.',
    'Forgetting the numerator when integrating: the integral of 3 ÷ (x + 2) is 3 ln|x + 2|, not ln|x + 2|.',
    'Subtracting the logarithms the wrong way round. For each piece take its value at the top limit minus its value at the bottom limit.'
   ]
  },
  guidance: [
   { prompt: 'Put x = −1 into 5x + 7 = A(x + 2) + B(x + 1). The B part becomes 0. What is A?', answer: [2], labels: ['A'], explanation: 'The left side is 5 × (−1) + 7 = 2. The right side is A × (−1 + 2) = A × 1. So A = 2 ÷ 1 = 2.' },
   { prompt: 'Now put x = −2. The A part becomes 0. What is B?', answer: [3], labels: ['B'], explanation: 'The left side is 5 × (−2) + 7 = −3. The right side is B × (−2 + 1) = B × (−1). So B = −3 ÷ (−1) = 3.' },
   { prompt: 'Integrate 2 ÷ (x + 1) + 3 ÷ (x + 2) from x = 0 to x = 2. What is the value to 3 decimal places?', answer: [4.277], labels: ['integral (3 d.p.)'], explanation: 'The antiderivative is 2 ln|x + 1| + 3 ln|x + 2|. Top limit minus bottom limit: 2 × (ln 3 − ln 1) + 3 × (ln 4 − ln 2) ≈ 2.1972 + 2.0794, which is 4.277 to 3 decimal places.' }
  ]
 },
 {
  id: 'q22', title: 'Counting coolant from a log', topic: 'Trapezoidal and Simpson’s rules', tier: 'Intermediate', sector: 'Computing Core',
  brief: 'The coolant meter only logs a reading every few minutes, and the core needs a good estimate of how much coolant went through.',
  lesson: 'From readings at equal steps h, the trapezoidal rule joins them with straight lines and Simpson’s rule with parabolas; on curved readings Simpson’s rule is usually closer.',
  prompt: 'The Computing Core logs its coolant flow in litres per minute every 2 minutes, from t = 0 to t = 8: 12, 18, 21, 19, 15. Estimate how many litres flowed in those 8 minutes with the trapezoidal rule, then with Simpson’s rule. Enter both to 3 decimal places.',
  answer: [143, 144.667], labels: ['trapezoidal estimate (L)', 'Simpson estimate (L)'], tolerance: 0.0005,
  hints: [
   'The readings are h = 2 minutes apart, so there are 4 strips. Trapezoidal rule: (h ÷ 2) × (first reading + 2 × each middle reading + last reading).',
   'Simpson’s rule: (h ÷ 3) × (first reading + 4, 2, 4, …, 2, 4 times the middle readings in turn + last reading). It needs an even number of strips, and 4 is even.'
  ],
  solution: 'The readings are h = 2 minutes apart, which makes 4 strips. Trapezoidal rule: (2 ÷ 2) × (12 + 2 × 18 + 2 × 21 + 2 × 19 + 15) = 1 × 143 = 143 litres. Simpson’s rule: (2 ÷ 3) × (12 + 4 × 18 + 2 × 21 + 4 × 19 + 15) = (2 ÷ 3) × 217 = 144.6667 litres, which is 144.667 to 3 decimal places.',
  xp: 150, prereqs: ['q01'],
  artifact: { name: 'Coolant ledger', description: 'A row of meter readings turned into one total, two ways.' },
  sources: [source.s3_6],
  teaching: {
   intuition: 'Sometimes there is no formula to integrate, only readings from a meter taken at equal steps. The total is still the area under the curve through those readings, so we estimate it with arithmetic instead of an antiderivative. That is numerical integration. The trapezoidal rule joins neighbouring readings with straight lines, so each strip becomes a trapezium, a shape whose area is its width times the average of its two side heights. Adding the strips gives (h ÷ 2) × (first + 2 × every middle reading + last), where h is the step between readings: each middle reading is a side of two strips, so it counts twice. Simpson’s rule does better when the readings curve. It fits a parabola through each three readings in a row, so it needs an even number of strips, and its weights go 1, 4, 2, 4, …, 2, 4, 1, all multiplied by h ÷ 3.',
   steps: [
    'Find the step h between readings and count the strips: one fewer than the number of readings.',
    'Trapezoidal rule: add the first and last readings and twice each middle reading, then multiply by h ÷ 2.',
    'Simpson’s rule, for an even number of strips: add the first and last readings, 4 times the 2nd, 4th, 6th … readings and 2 times the 3rd, 5th … readings, then multiply by h ÷ 3.',
    'The unit is the reading’s unit times the step’s unit: litres per minute times minutes gives litres.'
   ],
   example: {
    prompt: 'A pump’s flow is read every 3 minutes from t = 0 to t = 12: 10, 16, 20, 18, 12 litres per minute. Estimate the litres pumped with both rules.',
    steps: [
     'Trapezoidal: (3 ÷ 2) × (10 + 2 × 16 + 2 × 20 + 2 × 18 + 12) = 1.5 × 130 = 195.',
     'Simpson: (3 ÷ 3) × (10 + 4 × 16 + 2 × 20 + 4 × 18 + 12) = 1 × 198 = 198.'
    ],
    answer: 'About 195 litres by the trapezoidal rule and 198 litres by Simpson’s rule.'
   },
   pitfalls: [
    'Using the number of readings instead of the number of strips: 5 readings make 4 strips.',
    'Doubling the first and last readings too. Only the middle readings are shared by two strips.',
    'Using Simpson’s rule with an odd number of strips, or starting its weights 1, 2, 4 instead of 1, 4, 2.'
   ]
  },
  guidance: [
   { prompt: 'For the trapezoidal rule, weight the readings 1, 2, 2, …, 2, 1 and add. What is the weighted sum, and what is (2 ÷ 2) times it?', answer: [143, 143], labels: ['trapezoidal weighted sum', 'trapezoidal estimate (L)'], explanation: '12 + 2 × 18 + 2 × 21 + 2 × 19 + 15 = 143. Each strip is a trapezium of width 2, so the estimate is (2 ÷ 2) × 143 = 143.' },
   { prompt: 'For Simpson’s rule, weight them 1, 4, 2, 4, …, 4, 1 and add. What is the weighted sum, and what is (2 ÷ 3) times it, to 3 decimal places?', answer: [217, 144.667], labels: ['Simpson weighted sum', 'Simpson estimate (L)'], explanation: '12 + 4 × 18 + 2 × 21 + 4 × 19 + 15 = 217. Then (2 ÷ 3) × 217 = 144.6667, which is 144.667 to 3 decimal places. Simpson’s rule fits a parabola over each pair of strips, so it follows the bend in the readings.' }
  ]
 },
 {
  id: 'q23', title: 'Picking the right tool', topic: 'Choosing a technique of integration', tier: 'Intermediate', sector: 'Computing Core',
  brief: 'The Computing Core’s solver has a box of methods but no sense of which one to reach for, so Mira wants you to show it how to choose.',
  lesson: 'Read the integrand’s shape first: an inside function with its derivative beside it calls for substitution, a product for parts, two linear factors underneath for partial fractions, and a top-heavy fraction for dividing first.',
  prompt: 'The Computing Core’s solver is stuck on ∫ from 0 to 2 of 3x·eˣ dx. It knows four techniques: 1 substitution, 2 integration by parts, 3 partial fractions, 4 dividing the fraction out first and then using the basic rules. Enter the number of the technique that fits, then the value of the integral to 3 decimal places.',
  answer: [2, 25.167], labels: ['technique number', 'integral (3 d.p.)'], tolerance: 0.0005,
  hints: [
   'The integrand is a product of x and eˣ. Which factor becomes simpler when you differentiate it?',
   'Take u = x and dv = eˣ dx: the integral of x·eˣ is x·eˣ minus the integral of eˣ, which is (x − 1)eˣ.'
  ],
  solution: 'The integrand is x times eˣ, a product where differentiating x makes it simpler, so integration by parts fits: technique 2. With u = x and dv = eˣ dx, the integral of x·eˣ is x·eˣ − eˣ = (x − 1)eˣ, so the antiderivative is 3(x − 1)eˣ. F(2) ≈ 22.1672 (e² ≈ 7.3891) and F(0) = −3, so the integral is 22.1672 − (−3) ≈ 25.1672, which is 25.167 to 3 decimal places.',
  xp: 150, prereqs: ['q18', 'q21'],
  artifact: { name: 'Solver’s checklist', description: 'Four questions to ask an integral before touching it.' },
  sources: [source.s3_5],
  teaching: {
   intuition: 'You now have several ways to integrate, and the hard part is often choosing one. The integrand’s shape tells you. If one part is the derivative of another part’s inside, as 2x is the derivative of x² + 1, substitution turns it into something simple. If it is a product of two different kinds of function, such as x times eˣ or x times ln x, integration by parts trades it for an easier integral. If it is a fraction whose bottom is two different linear factors and whose top is a constant or a lower power, partial fractions split it into logarithms. If the top of a fraction has as high a power as the bottom or higher, divide it out first: (x² + 3) ÷ x is just x + 3 ÷ x, and both parts have basic rules. A quick look before any algebra saves a lot of wasted work.',
   steps: [
    'Is there an inside function whose derivative also appears, perhaps times a number? Use substitution (technique 1).',
    'Is it a product of x with eˣ, sin x or ln x, with no inside to substitute? Use integration by parts with u = x, or u = ln x (technique 2).',
    'Is it a constant or a lower power over two different linear factors? Use partial fractions (technique 3).',
    'Is it a fraction whose top has at least the power of its bottom, with a single x underneath? Divide it out first and use the basic rules (technique 4). Then evaluate the antiderivative at the two limits and subtract.'
   ],
   example: {
    prompt: 'Which technique fits ∫ from 0 to 1 of 4x ÷ (x² + 1) dx, and what is its value?',
    steps: [
     'The top, 4x, is 2 times the derivative of x² + 1, so substitution fits: u = x² + 1, du = 2x dx, and the integral of 2 ÷ u is 2 ln|u|.',
     'The antiderivative 2 ln(x² + 1) gives 2 ln 2 − 2 ln 1 ≈ 1.3863.'
    ],
    answer: 'Technique 1, substitution; the value is about 1.386.'
   },
   pitfalls: [
    'Reaching for partial fractions when the bottom does not split into linear factors, such as x² + 4.',
    'Taking u = eˣ in integration by parts: the x never goes away. Take u = x, whose derivative is 1.',
    'Forgetting the logarithm after dividing out: (x² + 6) ÷ x is x + 6 ÷ x, and 6 ÷ x integrates to 6 ln x.'
   ]
  },
  guidance: [
   { prompt: 'Look at the shape of 3x·eˣ. Which technique fits? Enter its number, 1 to 4.', answer: [2], labels: ['technique number'], explanation: 'The integrand is x times eˣ, a product where differentiating x makes it simpler, so integration by parts fits: technique 2.' },
   { prompt: 'The antiderivative is F(x) = 3(x − 1)eˣ. What are F(2) and F(0), to 3 decimal places?', answer: [22.167, -3], labels: ['F at the top limit', 'F at the bottom limit'], explanation: 'With u = x and dv = eˣ dx, the integral of x·eˣ is x·eˣ − eˣ = (x − 1)eˣ, so the antiderivative is 3(x − 1)eˣ. F(2) ≈ 22.1672 and F(0) = −3.' },
   { prompt: 'Subtract, using the unrounded values: what is F(2) − F(0), to 3 decimal places?', answer: [25.167], labels: ['integral (3 d.p.)'], explanation: '22.1672 − (−3) ≈ 25.1672, which is 25.167 to 3 decimal places.' }
  ]
 },
 {
  id: 'q24', title: 'An echo that never ends', topic: 'Improper integrals over an endless interval', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'A fading echo keeps arriving at the array for as long as we listen, and the engineers need to know whether its total energy is finite.',
  lesson: 'An integral to ∞ is the limit of integrals to b as b → ∞: it converges if that limit is a number and diverges if it is not.',
  prompt: 'A fading echo reaches the Deep Signal Array with power 6 ÷ t² units at time t seconds, for t ≥ 1. Its total energy is the improper integral ∫ from 1 to ∞ of 6 ÷ t² dt. First enter ∫ from 1 to 10 of 6 ÷ t² dt, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).',
  answer: [5.4, 1, 6], labels: ['integral to t = 10 (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
  hints: [
   'An antiderivative of 6 ÷ t² is −6 ÷ t. Work it out at the top limit and at the bottom limit, and subtract.',
   'For the improper integral, put a letter b in place of the top limit, then let b grow without bound (b → ∞). If the result settles on a number, the integral converges to it; if it grows without bound, the integral diverges.'
  ],
  solution: 'An antiderivative is F(t) = −6 ÷ t. From 1 to 10 the integral is F(10) − F(1) = −0.6 − (−6) = 5.4. With top limit b the integral is 6 − 6 ÷ b. As b → ∞, 6 ÷ b shrinks to 0, so the integral settles on 6. It converges: enter 1, then 6.',
  xp: 150, prereqs: ['q05'],
  artifact: { name: 'Echo energy log', description: 'The total of a signal that never quite stops.' },
  sources: [source.s3_7],
  teaching: {
   intuition: 'An echo that fades but never quite stops raises a fair question: is its total energy finite? The total is an integral whose top limit is ∞, the symbol for “without end”. That is an improper integral, because no antiderivative can be worked out at ∞. So we stop at a number b, find the ordinary integral from the start to b, and then let b grow without bound, written b → ∞. If the results settle on a number, the improper integral converges and that number is its value. If they grow without bound, it diverges. Fading alone is not enough. 1 ÷ t fades, yet its integral from 1 to b is ln b, which keeps growing, so it diverges. 1 ÷ t² fades faster: its integral from 1 to b is 1 − 1 ÷ b, which settles on 1. In general 1 ÷ tᵖ from 1 to ∞ converges exactly when p is greater than 1, and e^(−kt), which is e to the power −kt, converges from 0 to ∞ for any k above 0.',
   steps: [
    'Replace ∞ by a letter b and find an antiderivative.',
    'Work out the integral from the bottom limit to b: the antiderivative at b minus the antiderivative at the bottom limit.',
    'Let b → ∞. Parts like 1 ÷ b, 1 ÷ b² and e^(−kb) shrink to 0; parts like √b and ln b grow without bound.',
    'If the result settles on a number, the integral converges to that number; if it does not, the integral diverges.'
   ],
   example: {
    prompt: 'Does ∫ from 1 to ∞ of 4 ÷ t³ dt converge, and to what?',
    steps: [
     'An antiderivative is −2 ÷ t², so the integral from 1 to b is −2 ÷ b² + 2 = 2 − 2 ÷ b².',
     'As b → ∞, 2 ÷ b² shrinks to 0, so the integral settles on 2.'
    ],
    answer: 'It converges, to 2.'
   },
   pitfalls: [
    'Deciding it converges because the integrand fades to 0. 1 ÷ t fades too, but its integral diverges.',
    'Putting ∞ into the antiderivative as if it were a number. Use a finite b, then see what happens as b grows.',
    'Dropping the minus sign of the antiderivative: the integral of 1 ÷ t² is −1 ÷ t, so from 1 to b it is 1 − 1 ÷ b, not 1 ÷ b − 1.'
   ]
  },
  guidance: [
   { prompt: 'An antiderivative of 6 ÷ t² is −6 ÷ t. What is the integral from 1 to 10, to 3 decimal places?', answer: [5.4], labels: ['integral to t = 10 (3 d.p.)'], explanation: 'Top limit minus bottom limit: F(10) − F(1) = −0.6 − (−6) = 5.4.' },
   { prompt: 'With top limit b, the integral is 6 − 6 ÷ b. As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.', answer: [1], labels: ['settles (1) or not (0)'], explanation: 'As b → ∞, 6 ÷ b shrinks to 0, so the integral settles on 6.' },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [6], labels: ['value (0 if it diverges)'], explanation: 'The integral converges to 6: the energy is finite even though the echo never stops.' }
  ]
 },
 {
  id: 'q25', title: 'The switch-on surge', topic: 'Improper integrals where the integrand blows up', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'When the receiver switches on, its input power spikes without limit for an instant, and Mira needs to know whether the energy it takes in is finite.',
  lesson: 'When the integrand grows without bound at one end of the interval, start a little way in and take the limit as you move back to that end: the integral converges if the limit is a number.',
  prompt: 'The Deep Signal Array’s receiver switches on at time t = 0, in seconds, and its input power is P(t) = 3 ÷ √t units for 0 < t ≤ 4: it grows without bound just after t = 0. The energy received is ∫ from 0 to 4 of P(t) dt, an improper integral because P blows up at t = 0. First enter the integral from t = 0.01 to t = 4, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).',
  answer: [11.4, 1, 12], labels: ['integral from just after the start (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
  hints: [
   'An antiderivative of 3 ÷ √t is 6√t. Work it out at t = 4 and at t = 0.01, and subtract.',
   'For the improper integral, put a letter c in place of the bottom limit 0, then let c come down to 0 from above. If the result settles on a number, the integral converges to it; if it grows without bound, it diverges.'
  ],
  solution: 'An antiderivative is F(t) = 6√t. From t = 0.01 to t = 4 the integral is F(4) − F(0.01) = 12 − 0.6 = 11.4. With bottom limit c the integral is 12 − 6√c. As c comes down to 0, √c shrinks to 0, so the integral settles on 12. It converges: enter 1, then 12.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Surge meter', description: 'A spike with no top, and the finite energy under it.' },
  sources: [source.s3_7],
  teaching: {
   intuition: 'An integral can be improper for a second reason: the interval is finite, but the integrand grows without bound at one end. 1 ÷ √t, for instance, is huge just after t = 0 and has no value at t = 0 itself. We cannot use an antiderivative at the point where the function blows up, so we start a little to the right, at a number c, integrate from c to the top limit as usual, and then let c come down to the trouble point from above. If the results settle on a number, the improper integral converges; if they grow without bound, it diverges. The rule near 0 is the mirror image of the rule at ∞: 1 ÷ tᵖ from 0 to a positive limit converges exactly when p is less than 1. So 1 ÷ √t converges, because its antiderivative 2√t stays finite as t comes down to 0, while 1 ÷ t and 1 ÷ t² diverge.',
   steps: [
    'Find where the integrand blows up. Here it is the bottom limit a, where the bottom of the fraction is 0.',
    'Replace a by a letter c just above it and work out the integral from c to the top limit.',
    'Let c come down to a. Parts like √(c − a) shrink to 0; parts like ln(c − a) and 1 ÷ (c − a) grow without bound in size.',
    'If the result settles on a number, the integral converges to it; if it does not, the integral diverges.'
   ],
   example: {
    prompt: 'Does ∫ from 0 to 9 of 1 ÷ √t dt converge, and to what?',
    steps: [
     'An antiderivative is 2√t, so from c to 9 the integral is 2 × 3 − 2√c = 6 − 2√c.',
     'As c comes down to 0, √c shrinks to 0, so the integral settles on 6.'
    ],
    answer: 'It converges, to 6.'
   },
   pitfalls: [
    'Putting the blow-up point into the antiderivative as if nothing were wrong: for 1 ÷ t² that gives −1 ÷ t, which has no value at 0.',
    'Using the rule for ∞ near 0. Near 0, 1 ÷ t² diverges and 1 ÷ √t converges: the opposite way round from the rule at ∞.',
    'Missing the problem because the formula looks harmless. Always check where the bottom of a fraction is 0 before integrating.'
   ]
  },
  guidance: [
   { prompt: 'An antiderivative of 3 ÷ √t is 6√t. What is the integral from t = 0.01 to t = 4, to 3 decimal places?', answer: [11.4], labels: ['integral from just after the start (3 d.p.)'], explanation: 'Top limit minus bottom limit: F(4) − F(0.01) = 12 − 0.6 = 11.4.' },
   { prompt: 'With bottom limit c, the integral is 12 − 6√c. As c comes down to 0, does that settle on a number? Enter 1 for yes, 0 for no.', answer: [1], labels: ['settles (1) or not (0)'], explanation: 'As c comes down to 0, √c shrinks to 0, so the integral settles on 12.' },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [12], labels: ['value (0 if it diverges)'], explanation: 'The integral converges to 12: the power is endless at the start, but the energy is finite.' }
  ]
 },
 {
  id: 'q26', title: 'Fuel that halves itself', topic: 'Exponential decay and half-life', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'The array’s isotope fuel is slowly decaying in storage, and the crew must know when the store will run low.',
  lesson: 'A decaying amount y₀e^(−kt) halves every half-life T, with k = ln 2 ÷ T; a growing amount y₀e^(kt) doubles every doubling time, which is also ln 2 ÷ k.',
  prompt: 'The Deep Signal Array’s power cells run on an isotope fuel with a half-life of 12 days: every 12 days, half of what is left decays. The store holds 80 kg now, so the amount after t days is y(t) = 80e^(−kt) kg. Enter the rate constant k, per day, to 4 decimal places, then the number of days until only 25 kg is left, to 2 decimal places (work with the unrounded k).',
  answer: [0.0578, 20.14], labels: ['k per day (4 d.p.)', 'time (days, 2 d.p.)'], tolerance: 0.00005,
  hints: [
   'After one half-life the amount has halved: 80e^(−12k) = 40, so e^(−12k) = 1/2. Take ln of both sides.',
   'Then solve 80e^(−kt) = 25: divide by 80, take ln of both sides, and divide by −k.'
  ],
  solution: 'e^(−12k) = 1/2 gives −12k = ln(1/2) = −ln 2, so k = ln 2 ÷ 12 ≈ 0.0578 to 4 decimal places. Then 80e^(−kt) = 25 gives e^(−kt) = 25 ÷ 80, so kt = ln(80 ÷ 25) = 1.1632 and t = 1.1632 ÷ k ≈ 20.1369, dividing by the unrounded k, which is 20.14 days to 2 decimal places.',
  xp: 150, prereqs: ['q05'],
  artifact: { name: 'Fuel decay chart', description: 'A curve that halves at every step of the same length.' },
  sources: [source.s2_8],
  teaching: {
   intuition: 'Some quantities lose the same fraction of themselves in every equal stretch of time: isotope fuel decaying, an echo fading. Their rate of change is proportional to the amount itself, dy/dt = −ky, and the function whose derivative is −k times itself is y(t) = y₀e^(−kt), where y₀ is the amount at t = 0 and e^(−kt) means e to the power −kt. The number k is the rate constant. The time it takes for half of what is left to decay is the half-life T, and it is the same however much you start with. Setting e^(−kT) = 1/2 and taking the natural logarithm ln of both sides (ln undoes e, so ln(eᵘ) = u) gives kT = ln 2, so k = ln 2 ÷ T. Growth works the same way with e^(kt): the time to double is the doubling time, which is also ln 2 ÷ k. To find when the amount reaches some level, set y₀e^(−kt) equal to it and take ln again.',
   steps: [
    'From the half-life T, the rate constant is k = ln 2 ÷ T, with ln 2 ≈ 0.6931.',
    'Write the amount as y(t) = y₀e^(−kt).',
    'To find when the amount is y₁, solve y₀e^(−kt) = y₁: e^(−kt) = y₁ ÷ y₀, so kt = ln(y₀ ÷ y₁).',
    'Divide by k, keeping k unrounded: t = ln(y₀ ÷ y₁) ÷ k.'
   ],
   example: {
    prompt: 'A fuel has a half-life of 30 days. How long until 50 kg of it has decayed to 20 kg?',
    steps: [
     'k = ln 2 ÷ 30 ≈ 0.0231 per day; keep the full value on the calculator.',
     'ln(50 ÷ 20) = ln 2.5 ≈ 0.9163, and dividing it by the unrounded k gives about 39.66.'
    ],
    answer: 'k ≈ 0.0231 per day, and it takes about 39.66 days.'
   },
   pitfalls: [
    'Using the rounded k to find the time. A small rounding in k becomes a visible error in t.',
    'Taking ln(y₁ ÷ y₀) and getting a negative time. For decay, kt = ln(y₀ ÷ y₁), the larger amount over the smaller.',
    'Thinking the fuel is gone after two half-lives. After two half-lives a quarter is left, after three an eighth.'
   ]
  },
  guidance: [
   { prompt: 'One half-life halves the fuel: e^(−12k) = 1/2, so k = ln 2 ÷ 12. What is k to 4 decimal places?', answer: [0.0578], labels: ['k per day (4 d.p.)'], explanation: 'ln 2 ≈ 0.6931, and ln 2 ÷ 12 ≈ 0.0578 to 4 decimal places. Keep the full value of k for the next steps.' },
   { prompt: 'To reach 25 kg, e^(−kt) = 25 ÷ 80, so kt = ln(80 ÷ 25). What is ln(80 ÷ 25) to 4 decimal places?', answer: [1.1632], labels: ['ln of the ratio (4 d.p.)'], explanation: '80 ÷ 25 = 3.2, and its natural logarithm is 1.1632 to 4 decimal places.' },
   { prompt: 'Divide by the unrounded k: t = ln(80 ÷ 25) ÷ k. How many days is that, to 2 decimal places?', answer: [20.14], labels: ['time (days, 2 d.p.)'], explanation: '1.1632 ÷ k ≈ 20.1369 with the unrounded k, which is 20.14 days. That is about 1.68 half-lives.' }
  ]
 },
 {
  id: 'q27', title: 'Noise that settles down', topic: 'Sequences and their limits', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'Each sweep of the sky gives a new noise reading, and Mira wants to know the level the readings are settling on.',
  lesson: 'A sequence is an endless list a₁, a₂, a₃, …; its limit is the number its terms close in on as n → ∞.',
  prompt: 'The Deep Signal Array sweeps the sky again and again, and its noise reading after sweep n is aₙ = (6n + 5) ÷ (2n + 3). The readings a₁, a₂, a₃, … form a sequence. Enter a₁₀, the reading after sweep 10, to 3 decimal places, then the limit of the sequence as n → ∞.',
  answer: [2.826, 3], labels: ['term (3 d.p.)', 'limit'], tolerance: 0.0005,
  hints: [
   'Put n = 10 into the formula, work out the top and the bottom, then divide.',
   'For the limit, divide the top and the bottom by n. The parts 5 ÷ n and 3 ÷ n shrink to 0 as n grows.'
  ],
  solution: 'With n = 10, the top is 6 × 10 + 5 = 65 and the bottom is 2 × 10 + 3 = 23, so a₁₀ = 65 ÷ 23 ≈ 2.8261, which is 2.826 to 3 decimal places. Dividing the top and the bottom by n gives aₙ = (6 + 5 ÷ n) ÷ (2 + 3 ÷ n). As n → ∞ the parts divided by n approach 0, so aₙ approaches 6 ÷ 2 = 3. The limit is 3.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Sweep register', description: 'Readings that wander less with every pass.' },
  sources: [source.s5_1],
  teaching: {
   intuition: 'A sequence is an endless list of numbers in order: a₁, a₂, a₃, and so on. Each number is a term, and aₙ, read “a sub n”, is the term in place n, so a formula for aₙ gives every term at once. Here n is a whole number, 1, 2, 3, …, not any number on the line. Often the terms close in on one number as n grows; that number is the limit of the sequence, written lim aₙ = L as n → ∞, and the sequence converges. If the terms do not settle, the sequence diverges. For a fraction such as (3n + 1) ÷ (n + 4), divide the top and the bottom by the fastest-growing piece, here n: you get (3 + 1 ÷ n) ÷ (1 + 4 ÷ n). As n grows, 1 ÷ n and 4 ÷ n shrink to 0, so the terms close in on 3 ÷ 1 = 3. The same move works with 2ⁿ, which grows even faster than n.',
   steps: [
    'To find a particular term, put that value of n into the formula.',
    'For the limit, find the fastest-growing piece in the top and the bottom, such as n or 2ⁿ.',
    'Divide the top and the bottom by it. Every part with that piece underneath shrinks to 0 as n → ∞.',
    'What remains is the limit: the ratio of the numbers in front of the fastest-growing piece.'
   ],
   example: {
    prompt: 'bₙ = (3n + 1) ÷ (n + 4). Find b₆ and the limit of the sequence.',
    steps: [
     'b₆ = (18 + 1) ÷ (6 + 4) = 19 ÷ 10 = 1.9.',
     'Dividing by n gives (3 + 1 ÷ n) ÷ (1 + 4 ÷ n), which approaches 3 ÷ 1 = 3.'
    ],
    answer: 'b₆ = 1.9 and the limit is 3.'
   },
   pitfalls: [
    'Taking the limits of the top and the bottom separately: both grow without bound, and ∞ ÷ ∞ says nothing. Divide first.',
    'Reading aₙ as a times n. The small n only names the place in the list.',
    'Thinking some term has to reach the limit. The terms can get as close as you like without ever equalling it.'
   ]
  },
  guidance: [
   { prompt: 'Put n = 10 into aₙ = (6n + 5) ÷ (2n + 3). What is a₁₀ to 3 decimal places?', answer: [2.826], labels: ['term (3 d.p.)'], explanation: 'The top is 6 × 10 + 5 = 65 and the bottom is 2 × 10 + 3 = 23. 65 ÷ 23 ≈ 2.8261, which is 2.826 to 3 decimal places.' },
   { prompt: 'Divide the top and the bottom by n: aₙ = (6 + 5 ÷ n) ÷ (2 + 3 ÷ n). As n → ∞, what do the top and the bottom approach?', answer: [6, 2], labels: ['top approaches', 'bottom approaches'], explanation: '5 ÷ n and 3 ÷ n shrink to 0, so the top approaches 6 and the bottom approaches 2.' },
   { prompt: 'So what is the limit of the sequence?', answer: [3], labels: ['limit'], explanation: '6 ÷ 2 = 3. The readings settle on 3, the ratio of the two leading coefficients.' }
  ]
 },
 {
  id: 'q28', title: 'Echoes off the far mirror', topic: 'Geometric series', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'A signal bounces between the dish and a far mirror and comes back weaker each time, and the engineers want every echo added together.',
  lesson: 'A geometric series a + ar + ar² + … with common ratio r between −1 and 1 converges to a ÷ (1 − r).',
  prompt: 'Each echo the Deep Signal Array hears from a far mirror is weaker than the one before by the same factor. The echo strengths are 36, 24, 16, … and so on for ever. Enter the common ratio r (a fraction such as 1/2 is fine), then the sum of the whole series of echoes.',
  answer: [0.666666667, 108], labels: ['common ratio', 'sum'], tolerance: 0.00005,
  hints: [
   'The common ratio is any term divided by the one before it, such as 24 ÷ 36.',
   'The ratio is between −1 and 1, so the geometric series converges, and its sum is a ÷ (1 − r), where a is the first term.'
  ],
  solution: 'r = 24 ÷ 36 = 2/3, and 16 ÷ 24 gives 2/3 again. The partial sum of the first three terms is S₃ = 36 + 24 + 16 = 76. Because 2/3 is between −1 and 1, the series converges, to a ÷ (1 − r) = 36 ÷ (1 − 2/3) = 36 ÷ (1/3) = 36 × 3 = 108.',
  xp: 150, prereqs: ['q27'],
  artifact: { name: 'Mirror echo trace', description: 'Echoes that shrink by the same factor, and their finite total.' },
  sources: [source.s5_2],
  teaching: {
   intuition: 'Adding up all the terms of a sequence gives a series, a₁ + a₂ + a₃ + …, written Σ aₙ with the Greek capital letter sigma, Σ, for “sum”. We cannot add for ever, so we add the first n terms to get a partial sum Sₙ, and ask whether the partial sums settle on a number. If they do, the series converges and that number is its sum. In a geometric series each term is the one before times the same number r, the common ratio: a, ar, ar², ar³, … Multiplying Sₙ = a + ar + … + arⁿ⁻¹ by r moves every term along one place, and subtracting gives Sₙ(1 − r) = a − arⁿ. When r is between −1 and 1, arⁿ shrinks to 0, so the partial sums settle on a ÷ (1 − r). For 8 + 4 + 2 + 1 + … that is 8 ÷ (1 − 1/2) = 16. When r is 1 or more in size, the terms do not shrink and the series diverges.',
   steps: [
    'Find the common ratio: divide any term by the one before it, and check that the next pair gives the same.',
    'Check that r is between −1 and 1; otherwise the series diverges.',
    'Take the first term a and work out 1 − r.',
    'The sum is a ÷ (1 − r). The partial sums Sₙ climb towards it.'
   ],
   example: {
    prompt: 'Find the sum of the geometric series 54 + 18 + 6 + …',
    steps: [
     'r = 18 ÷ 54 = 1/3, and 6 ÷ 18 = 1/3 too.',
     'The sum is 54 ÷ (1 − 1/3) = 54 ÷ (2/3) = 81.'
    ],
    answer: 'r = 1/3 and the sum is 81.'
   },
   pitfalls: [
    'Dividing a term by the one after it. The ratio is a later term over the one before it, so it is less than 1 for shrinking echoes.',
    'Putting the second term in for a in a ÷ (1 − r). a is the first term of the series.',
    'Using the formula when r is 1 or more in size. Then the terms do not shrink and there is no sum.'
   ]
  },
  guidance: [
   { prompt: 'Divide the second echo by the first: what is 24 ÷ 36? (A fraction is fine.)', answer: [0.666666667], labels: ['common ratio'], explanation: '24 ÷ 36 = 2/3. The third echo divided by the second gives the same, 16 ÷ 24 = 2/3, so the common ratio is 2/3.' },
   { prompt: 'Add the first three echoes. What is the partial sum S₃?', answer: [76], labels: ['partial sum S₃'], explanation: 'S₃ = 36 + 24 + 16 = 76. Each further partial sum adds a smaller piece.' },
   { prompt: 'Use a ÷ (1 − r) with a = 36 and r = 2/3. What is the sum of the whole series?', answer: [108], labels: ['sum'], explanation: '1 − 2/3 = 1/3, and 36 ÷ (1/3) = 36 × 3 = 108. The partial sums climb towards 108 and never pass it.' }
  ]
 },
 {
  id: 'q29', title: 'Everything the beacon sends', topic: 'Chapter review: the infinite so far', tier: 'Intermediate', sector: 'Deep Signal Array',
  brief: 'The Long-range Dish is logging a beacon whose tone fades out for ever while its pulses keep coming, and Mira wants the total of both.',
  lesson: 'An endless flow and an endless list can both have finite totals: an improper integral that converges, and a geometric series whose ratio is between −1 and 1.',
  prompt: 'The Long-range Dish tracks a beacon that sends two things. Its tone fades, with power 8e^(−0.5t) units at time t seconds, so the tone’s total energy is the improper integral ∫ from 0 to ∞ of 8e^(−0.5t) dt. It also sends pulses carrying 75, 30, 12, … units, each the same fraction of the one before, for ever. Enter the energy of the tone, then the total energy of all the pulses.',
  answer: [16, 125], labels: ['tone energy', 'pulse energy'], tolerance: 0.00005,
  hints: [
   'An antiderivative of 8e^(−0.5t) is −16e^(−0.5t). Integrate from 0 up to a top limit b, then let b → ∞.',
   'For the pulses, the common ratio is 30 ÷ 75, and a geometric series with ratio between −1 and 1 adds up to a ÷ (1 − r).'
  ],
  solution: 'Tone: from 0 to b the integral is 16 − 16e^(−0.5b). As b → ∞ the part with b shrinks to 0, so the improper integral converges to 16. Pulses: r = 30 ÷ 75 = 2/5, so the series converges to 75 ÷ (1 − 2/5) = 75 ÷ (3/5) = 125.',
  xp: 150, prereqs: ['q25', 'q28'],
  artifact: { name: 'Beacon tally', description: 'A fading tone and a train of pulses, each with a finite total.' },
  sources: [source.s3_7, source.s5_1, source.s5_2],
  teaching: {
   intuition: 'This chapter has added up things that never end, in two ways. A quantity that flows without a break, like the power of a fading tone, is added with an integral; when it goes on for ever the integral is improper, so we integrate up to a top limit b and let b → ∞. A quantity that arrives in separate pieces, like pulses, is added with a series; when each piece is the one before times a common ratio r between −1 and 1, the geometric series converges to a ÷ (1 − r). Both answers rest on the same idea: an endless total makes sense when the partial totals settle on a number. The tone’s integrals up to b and the pulses’ partial sums Sₙ both climb towards a limit, and that limit is the total.',
   steps: [
    'For the flowing part, find an antiderivative and the integral from the start to b.',
    'Let b → ∞; if the part with b shrinks to 0, what remains is the value of the improper integral.',
    'For the pulses, find the common ratio r by dividing a pulse by the one before it.',
    'Check that r is between −1 and 1; then the sum is a ÷ (1 − r), with a the first pulse.'
   ],
   example: {
    prompt: 'A tone has power 10e^(−2t) for t ≥ 0, and pulses carry 9, 3, 1, … units. Find both totals.',
    steps: [
     'Tone: from 0 to b the integral is 5 − 5e^(−2b), which settles on 5 as b → ∞.',
     'Pulses: r = 3 ÷ 9 = 1/3, so the sum is 9 ÷ (2/3) = 13.5.'
    ],
    answer: 'The tone carries 5 units and the pulses 13.5 units.'
   },
   pitfalls: [
    'Treating the pulses as a flow or the tone as a list. A flow needs an integral; separate pieces need a sum.',
    'Forgetting the factor 1 ÷ k: the integral of e^(−kt) from 0 to ∞ is 1 ÷ k, not 1.',
    'Using a ratio that is upside down. Each pulse divided by the one before it gives a ratio below 1 for shrinking pulses.'
   ]
  },
  guidance: [
   { prompt: 'With top limit b, the tone’s integral is 16 − 16e^(−0.5b). What does it approach as b → ∞?', answer: [16], labels: ['tone energy'], explanation: 'The part with b shrinks to 0 as b grows, so the improper integral converges to 16.' },
   { prompt: 'What is the common ratio of the pulses, 30 ÷ 75? (A fraction is fine.)', answer: [0.4], labels: ['common ratio'], explanation: '30 ÷ 75 = 2/5, and 12 ÷ 30 gives 2/5 too.' },
   { prompt: 'What is the sum of the pulses, a ÷ (1 − r)?', answer: [125], labels: ['pulse energy'], explanation: '75 ÷ (1 − 2/5) = 75 ÷ (3/5) = 125.' }
  ]
 },
 {
  id: 'q30', title: 'Pulses that cancel', topic: 'Partial sums, telescoping series and the divergence test', tier: 'Advanced', sector: 'Signal Lab',
  brief: 'The Signal Lab needs the total energy of an endless train of relay pulses, if that total exists at all.',
  lesson: 'In a telescoping series most of each partial sum cancels, leaving a few end pieces; and if the terms do not approach 0, the series diverges.',
  prompt: 'Relay pulses in the Signal Lab carry energies a₁, a₂, a₃, … with aₙ = 12 ÷ (n(n + 2)). The total of them all is the series a₁ + a₂ + a₃ + …, written Σ aₙ. Enter the partial sum S₁₀ = a₁ + a₂ + … + a₁₀ to 3 decimal places, then the sum of the whole series, or 0 if the series diverges.',
  answer: [7.955, 9], labels: ['partial sum S₁₀ (3 d.p.)', 'sum (0 if it diverges)'], tolerance: 0.0005,
  hints: [
   'Split the fading part: 12 ÷ (n(n + 2)) = 6 × (1 ÷ n − 1 ÷ (n + 2)). Write out the first few terms and watch them cancel.',
   'Before adding for ever, look at the terms: if aₙ does not approach 0 as n → ∞, the divergence test says the series diverges.'
  ],
  solution: '12 ÷ (n(n + 2)) = 6 × (1 ÷ n − 1 ÷ (n + 2)). In S₁₀ each −1 ÷ (n + 2) cancels the 1 ÷ n of a later term, leaving 6 × (1 + 1/2 − 1/11 − 1/12) ≈ 7.9545, which is 7.955 to 3 decimal places. For the partial sum of N terms the same cancelling leaves 6 × (1 + 1/2) minus pieces that shrink to 0 as N → ∞, so the series converges to 6 × (1 + 1/2) = 9.',
  xp: 200, prereqs: ['q28'],
  artifact: { name: 'Telescope slide', description: 'A long sum folding down to its two ends.' },
  sources: [source.s5_2, source.s5_3],
  teaching: {
   intuition: 'Two checks come first with any series. The first is the divergence test: if the terms aₙ do not approach 0 as n → ∞, the series diverges, because adding for ever pieces that stay near some number other than 0 makes the partial sums grow without bound. The test can only rule a series out. If the terms do approach 0, the series may still diverge, as 1 + 1/2 + 1/3 + 1/4 + … does, so we must look further. The second check: can the partial sums be found exactly? In a telescoping series each term is a difference, such as 1 ÷ n − 1 ÷ (n + 1), so in a partial sum the back part of each term cancels the front part of a later one, like the sections of a telescope sliding together. For 1 ÷ (n(n + 1)) = 1 ÷ n − 1 ÷ (n + 1), the partial sum Sₙ is 1 − 1 ÷ (n + 1), which settles on 1.',
   steps: [
    'Find what aₙ approaches as n → ∞. If it is not 0, the series diverges by the divergence test, and there is no sum.',
    'If the terms approach 0, try to split aₙ into a difference, such as c ÷ (n(n + k)) = (c ÷ k) × (1 ÷ n − 1 ÷ (n + k)).',
    'Write out the partial sum. Everything cancels except the first k front pieces and the last k back pieces.',
    'Let the number of terms grow: the leftover back pieces shrink to 0, and what stays is the sum.'
   ],
   example: {
    prompt: 'Find S₄ and the sum of the series with aₙ = 6 ÷ (n(n + 1)).',
    steps: [
     '6 ÷ (n(n + 1)) = 6 × (1 ÷ n − 1 ÷ (n + 1)), so S₄ = 6 × (1 − 1/5) = 4.8.',
     'The terms approach 0, and Sₙ = 6 × (1 − 1 ÷ (n + 1)) settles on 6.'
    ],
    answer: 'S₄ = 4.8 and the sum is 6.'
   },
   pitfalls: [
    'Deciding a series converges because its terms approach 0. The divergence test can only ever prove divergence.',
    'Forgetting the factor 1 ÷ k when the two factors differ by k: 1 ÷ (n(n + 2)) is half of 1 ÷ n − 1 ÷ (n + 2).',
    'Cancelling too much when the gap is 2: 1 and 1/2 both survive at the front, and two pieces survive at the back.'
   ]
  },
  guidance: [
   { prompt: 'As n → ∞, what does aₙ = 12 ÷ (n(n + 2)) approach?', answer: [0], labels: ['limit of the terms'], explanation: 'The bottom grows without bound, so aₙ approaches 0. The divergence test then says nothing, and we have to look at the partial sums.' },
   { prompt: 'Use 12 ÷ (n(n + 2)) = 6 × (1 ÷ n − 1 ÷ (n + 2)). What is S₁₀ to 3 decimal places?', answer: [7.955], labels: ['partial sum S₁₀ (3 d.p.)'], explanation: 'In S₁₀ each −1 ÷ (n + 2) cancels the 1 ÷ n of a later term, leaving 6 × (1 + 1/2 − 1/11 − 1/12) ≈ 7.9545.' },
   { prompt: 'What is the sum of the whole series? Enter 0 if it diverges.', answer: [9], labels: ['sum (0 if it diverges)'], explanation: 'As N → ∞ the leftover pieces at the end of the partial sums shrink to 0, so the partial sums approach 6 × (1 + 1/2) = 9.' }
  ]
 }
);
})();
