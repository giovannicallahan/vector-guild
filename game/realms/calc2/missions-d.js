/* Calculus 2: accumulation missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/calc2/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Testing series · Advanced, 200 XP · sector 'Signal Lab' · The integral test and p-series [5.3]
     q32  ch 6 Testing series · Advanced, 200 XP · sector 'Signal Lab' · Comparison and limit comparison tests [5.4]
     q33  ch 6 Testing series · Advanced, 200 XP · sector 'Signal Lab' · Alternating series and the error bound [5.5]
     q34  ch 6 Testing series · Advanced, 200 XP · sector 'Signal Lab' · Ratio and root tests [5.6]
     q35  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Power series: radius and interval of convergence [6.1]
     q36  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Taylor polynomials [6.3]
     q37  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Maclaurin series of eˣ, sin x, cos x and 1/(1 − x) [6.3]
     q38  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Taylor's remainder: how good is the estimate [6.3]
     q39  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Integrating a series to estimate an integral [6.4]
     q40  ch 7 Power series · Advanced, 200 XP · sector 'Navigation Room' · Realm review and bridge to Calculus 3: a path given by x(t) and y(t) [7.1, 7.2] */
(function(){
'use strict';
/* OpenStax Calculus Volume 2 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 2 — 3.1 Integration by Parts
   Link to the section page itself: https://openstax.org/books/calculus-volume-2/pages/<section-slug> */
const source = {
 s5_3: { title: 'OpenStax Calculus Volume 2 — 5.3 The Divergence and Integral Tests', url: 'https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests', description: 'The divergence test, the integral test, p-series, and estimating the remainder of a series with an integral.', verified: '2026-11-27' },
 s5_4: { title: 'OpenStax Calculus Volume 2 — 5.4 Comparison Tests', url: 'https://openstax.org/books/calculus-volume-2/pages/5-4-comparison-tests', description: 'The comparison test and the limit comparison test for series of positive terms.', verified: '2026-11-27' },
 s5_5: { title: 'OpenStax Calculus Volume 2 — 5.5 Alternating Series', url: 'https://openstax.org/books/calculus-volume-2/pages/5-5-alternating-series', description: 'The alternating series test and the bound on the remainder of an alternating series.', verified: '2026-11-27' },
 s5_6: { title: 'OpenStax Calculus Volume 2 — 5.6 Ratio and Root Tests', url: 'https://openstax.org/books/calculus-volume-2/pages/5-6-ratio-and-root-tests', description: 'The ratio test and the root test, with series built from factorials and powers.', verified: '2026-11-27' },
 s6_1: { title: 'OpenStax Calculus Volume 2 — 6.1 Power Series and Functions', url: 'https://openstax.org/books/calculus-volume-2/pages/6-1-power-series-and-functions', description: 'Power series, their centre, and the radius and interval of convergence.', verified: '2026-11-27' },
 s6_3: { title: 'OpenStax Calculus Volume 2 — 6.3 Taylor and Maclaurin Series', url: 'https://openstax.org/books/calculus-volume-2/pages/6-3-taylor-and-maclaurin-series', description: 'Taylor polynomials, Taylor and Maclaurin series, and Taylor’s theorem with remainder.', verified: '2026-11-27' },
 s6_4: { title: 'OpenStax Calculus Volume 2 — 6.4 Working with Taylor Series', url: 'https://openstax.org/books/calculus-volume-2/pages/6-4-working-with-taylor-series', description: 'Using known series to build new ones, and evaluating integrals that have no simple antiderivative.', verified: '2026-11-27' },
 s7_1: { title: 'OpenStax Calculus Volume 2 — 7.1 Parametric Equations', url: 'https://openstax.org/books/calculus-volume-2/pages/7-1-parametric-equations', description: 'Curves given by parametric equations x(t) and y(t), and the parameter t.', verified: '2026-11-27' },
 s7_2: { title: 'OpenStax Calculus Volume 2 — 7.2 Calculus of Parametric Curves', url: 'https://openstax.org/books/calculus-volume-2/pages/7-2-calculus-of-parametric-curves', description: 'Slopes dy/dx and arc lengths of parametric curves.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'Echoes that never stop', topic: 'The integral test and p-series', tier: 'Advanced', sector: 'Signal Lab',
  brief: 'Two test pings keep echoing back from the deep-space dish, and the lab must know whether their total strength settles, and how much is still missing after the first pulses.',
  lesson: 'A series of positive, shrinking terms f(n) converges exactly when the integral of f from 1 to ∞ is finite, and the integral from N to ∞ bounds what is left after N terms.',
  prompt: 'The signal lab adds up the echoes of two test pings. Echo A returns pulses of strength aₙ = 1 ÷ n and echo B pulses of strength bₙ = 1 ÷ n³, for n = 1, 2, 3, … without end. Use the integral test: enter 1 if the series of echo A converges and 0 if it diverges, then the same for echo B. Then, for the echo whose series converges, enter the integral bound on its tail after the first 10 pulses: the integral of its formula from x = 10 to ∞.',
  answer: [0, 1, 0.005], labels: ['echo A converges (1 or 0)', 'echo B converges (1 or 0)', 'tail bound'], tolerance: 0.00005,
  hints: [
   'Both are p-series, Σ 1 ÷ nᵖ. By the integral test each one does what the integral of 1 ÷ xᵖ from 1 to ∞ does, and that integral is finite only when p > 1.',
   'The tail after 10 terms is smaller than the integral of the same formula from x = 10 to ∞. An antiderivative of 1 ÷ xᵖ is x^(1 − p) ÷ (1 − p).'
  ],
  solution: 'Echo A is the p-series with p = 1 and echo B the one with p = 3. Their terms are positive and shrink, so the integral test applies: Σ 1 ÷ nᵖ converges exactly when the integral of 1 ÷ xᵖ from 1 to ∞ is finite, which is when p > 1. For echo A, the integral of 1 ÷ x from 1 to b is ln b, which grows without bound, so its series diverges. Echo B has p = 3 > 1, so its series converges. So the answers are 0 for echo A and 1 for echo B. The tail of echo B after 10 terms is less than the integral of 1 ÷ x³ from 10 to ∞: [−1 ÷ (2x²)] from 10 to ∞ = 0 + 1 ÷ (2 × 100) = 0.005.',
  xp: 200, prereqs: ['q30', 'q24'],
  artifact: { name: 'Echo ledger', description: 'Two columns of fading pulses: one that adds up, and one that never does.' },
  sources: [source.s5_3],
  teaching: {
   intuition: 'Picture the terms of a series as a row of bars, each 1 wide: bar n has height aₙ. Suppose the terms come from a function, aₙ = f(n), where f is positive and falls as x grows. Stand bar n on the stretch from x = n − 1 to x = n. Because f falls, every bar after the first fits under the curve y = f(x). So the sum and the area under the curve rise or stall together: if the integral of f from 1 to ∞ is finite, the series converges too, and if that integral grows without bound, so does the series. This is the integral test. The most useful family it settles is the p-series Σ 1 ÷ nᵖ, where p is a fixed power. The integral of 1 ÷ xᵖ from 1 to ∞ is finite only when p > 1, so the p-series converges when p > 1 and diverges when p ≤ 1. Σ 1 ÷ n, with p = 1, is called the harmonic series, and it diverges even though its terms shrink to 0. The same picture bounds the tail, the part of the sum left over after the first N terms: the tail is less than the integral of f from N to ∞.',
   steps: [
    'Check that the terms come from a function f(x) that is positive and falling for x ≥ 1, so that aₙ = f(n).',
    'Work out the improper integral of f from 1 to ∞, as the limit of the integral from 1 to b as b → ∞.',
    'If the integral is finite the series converges; if it grows without bound the series diverges. For a p-series Σ 1 ÷ nᵖ this comes down to one rule: it converges when p > 1 and diverges when p ≤ 1.',
    'For a convergent series, the tail after N terms is less than the integral of f from N to ∞. That is the most the partial sum of the first N terms can fall short of the true sum.'
   ],
   example: {
    prompt: 'Does Σ 1 ÷ n² converge, and how large can its tail be after the first 4 terms?',
    steps: [
     'It is a p-series with p = 2 > 1. The integral of 1 ÷ x² from 1 to ∞ is [−1 ÷ x] from 1 to ∞ = 0 + 1 = 1, which is finite, so the series converges.',
     'The tail after 4 terms is less than the integral of 1 ÷ x² from 4 to ∞: [−1 ÷ x] from 4 to ∞ = 0 + 1 ÷ 4 = 0.25.'
    ],
    answer: 'It converges, and the first 4 terms are within 0.25 of the total.'
   },
   pitfalls: [
    'Deciding that a series converges because its terms shrink to 0. Σ 1 ÷ n has shrinking terms and still diverges.',
    'Thinking the integral equals the sum. The integral test only says whether both are finite: the integral of 1 ÷ x² from 1 to ∞ is 1, while Σ 1 ÷ n² is about 1.645.',
    'Counting p = 1 as convergent. A p-series needs p strictly greater than 1.'
   ]
  },
  guidance: [
   { prompt: 'Echo A has p = 1 and echo B has p = 3. A p-series converges when p > 1 and diverges otherwise. Enter 1 or 0 for echo A, then for echo B.', answer: [0, 1], labels: ['echo A (1 or 0)', 'echo B (1 or 0)'], explanation: 'p = 3 is greater than 1, so echo B converges; p = 1 is not, so echo A diverges.' },
   { prompt: 'For the convergent echo, work out the integral of 1 ÷ x³ from x = 1 to ∞. An antiderivative is −1 ÷ (2x²).', answer: [0.5], labels: ['integral from 1 to ∞'], explanation: '[−1 ÷ (2x²)] from 1 to ∞ is 0 − (−1 ÷ 2) = 0.5. The integral is finite, which is what the integral test needs.' },
   { prompt: 'Now take the same integral from x = 10 to ∞. It bounds everything after the first 10 terms.', answer: [0.005], labels: ['tail bound'], explanation: '[−1 ÷ (2x²)] from 10 to ∞ = 0 + 1 ÷ (2 × 100) = 0.005. Adding the first 10 terms leaves less than 0.005 still to come.' }
  ]
 },
 {
  id: 'q32', title: 'The relay that leaks power', topic: 'Comparison and limit comparison tests', tier: 'Advanced', sector: 'Signal Lab',
  brief: 'A relay loses a little power at every step for ever, and the lab needs to know whether the total loss stays finite.',
  lesson: 'A series of positive terms behaves like a simpler series it is compared with: when aₙ ÷ bₙ approaches a positive, finite limit, Σ aₙ and Σ bₙ both converge or both diverge.',
  prompt: 'A relay in the signal lab loses power in steps: step n costs aₙ = (3n + 2) ÷ (4n³ + 5) watts, for n = 1, 2, 3, … without end. Mira compares it with the p-series bₙ = 1 ÷ n². Enter the limit of aₙ ÷ bₙ as n → ∞, then 1 if Σ aₙ converges and 0 if it diverges.',
  answer: [0.75, 1], labels: ['limit of aₙ ÷ bₙ', 'converges (1 or 0)'], tolerance: 0.0005,
  hints: [
   'Dividing by bₙ = 1 ÷ n² is the same as multiplying by n². Then divide the top and the bottom by the highest power of n, n³.',
   'If the limit is a positive, finite number, the two series both converge or both diverge. A p-series Σ 1 ÷ nᵖ converges only when p > 1.'
  ],
  solution: 'aₙ ÷ bₙ = (3n + 2) × n² ÷ (4n³ + 5) = (3n³ + 2n²) ÷ (4n³ + 5). Dividing the top and the bottom by n³ gives (3 + 2 ÷ n) ÷ (4 + 5 ÷ n³), which approaches 3 ÷ 4 = 0.75 as n → ∞. The limit is positive and finite, so by the limit comparison test Σ aₙ does what Σ 1 ÷ n² does. That is a p-series with p = 2 > 1, which converges: enter 1.',
  xp: 200, prereqs: ['q31'],
  artifact: { name: 'Power-loss chart', description: 'A messy sum drawn beside the p-series that keeps it honest.' },
  sources: [source.s5_4],
  teaching: {
   intuition: 'Many series look messy but act like a simple one. If every term of Σ aₙ is positive and no bigger than the matching term of a convergent series Σ bₙ, then Σ aₙ is held below a finite total, so it converges too. If every aₙ is at least as big as the terms of a divergent series of positive terms, Σ aₙ diverges too. That is the comparison test. Finding a series that sits neatly above or below can be fiddly, so the limit comparison test asks a looser question: what does aₙ ÷ bₙ approach as n → ∞? If the limit is a positive, finite number, then for large n each aₙ is about that number times bₙ, and multiplying every term of a series by the same positive number does not change whether it converges. So Σ aₙ and Σ bₙ do the same thing. For a fraction made of powers of n, the right bₙ is a p-series: keep only the highest power on the top and on the bottom. (5n + 1) ÷ (2n³ + 7) is roughly 5n ÷ 2n³, which is (5 ÷ 2) × 1 ÷ n², so it is compared with Σ 1 ÷ n².',
   steps: [
    'Make sure every term is positive.',
    'Choose bₙ: keep only the highest power of n on the top and on the bottom. What is left is a number times 1 ÷ nᵖ, so take bₙ = 1 ÷ nᵖ.',
    'Work out the limit of aₙ ÷ bₙ as n → ∞ by dividing the top and the bottom by the highest power of n.',
    'If the limit is positive and finite, Σ aₙ converges exactly when Σ bₙ does, which for a p-series is when p > 1.'
   ],
   example: {
    prompt: 'Does Σ (2n + 1) ÷ (5n² + 3) converge?',
    steps: [
     'The highest powers give 2n ÷ 5n² = (2 ÷ 5) × 1 ÷ n, so compare with bₙ = 1 ÷ n.',
     'aₙ ÷ bₙ = (2n² + n) ÷ (5n² + 3). Dividing the top and the bottom by n² gives (2 + 1 ÷ n) ÷ (5 + 3 ÷ n²), which approaches 2 ÷ 5 = 0.4.',
     '0.4 is positive and finite, and Σ 1 ÷ n diverges (p = 1).'
    ],
    answer: 'The limit is 0.4, and the series diverges, as Σ 1 ÷ n does.'
   },
   pitfalls: [
    'Comparing with the wrong power. The power of the p-series is the highest power on the bottom minus the highest power on the top, not the bottom one alone.',
    'Trusting the limit comparison test when the limit is 0 or grows without bound. Then it says nothing on its own.',
    'Reading the limit as the sum. The test only judges whether the series converges; the limit is not its total.'
   ]
  },
  guidance: [
   { prompt: 'Multiply aₙ by n² to get (3n³ + 2n²) ÷ (4n³ + 5), then divide the top and the bottom by n³. What does it approach as n → ∞?', answer: [0.75], labels: ['limit'], explanation: 'After dividing, every term except 3 on top and 4 below has a power of n underneath it and shrinks to 0, so the limit is 3 ÷ 4 = 0.75.' },
   { prompt: 'The limit 0.75 is positive and finite, so Σ aₙ behaves like Σ 1 ÷ n². Enter 1 if that p-series converges, 0 if it diverges.', answer: [1], labels: ['converges (1 or 0)'], explanation: 'Σ 1 ÷ n² has p = 2 > 1, so it converges, and so does Σ aₙ.' }
  ]
 },
 {
  id: 'q33', title: 'Counting the fading pulses', topic: 'Alternating series and the error bound', tier: 'Advanced', sector: 'Signal Lab',
  brief: 'A signal comes back as pulses that flip between positive and negative, and the lab must decide how many to add before the total is good enough.',
  lesson: 'An alternating series whose terms shrink to 0 converges, and the error of a partial sum is less than the size of the first term left out.',
  prompt: 'A fading signal arrives as pulses that alternate in sign: 1 − 1/4 + 1/9 − 1/16 + …, the nth pulse being (−1)ⁿ⁺¹ ÷ n². The lab estimates the total with a partial sum. Enter the alternating series bound on the error after 4 terms, then the smallest number of terms N for which that bound is itself below 0.001.',
  answer: [0.04, 31], labels: ['error bound after those terms', 'terms needed N'], tolerance: 0.00005,
  hints: [
   'The terms alternate in sign and shrink towards 0, so the error of a partial sum is less than the size of the first term left out.',
   'With N terms the first term left out is 1 ÷ (N + 1)². It is below 0.001 exactly when (N + 1)² > 1000.'
  ],
  solution: 'The pulses 1 ÷ n² shrink towards 0 and alternate in sign, so by the alternating series test the series converges, and the remainder after a partial sum is smaller than the first term left out. After 4 terms that is term 5: 1 ÷ 5² = 1 ÷ 25 = 0.04. For the bound to be below 0.001 we need 1 ÷ (N + 1)² < 0.001, that is (N + 1)² > 1000. 31² = 961 is not enough and 32² = 1024 is, so N + 1 = 32 and N = 31 terms.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'Pulse counter', description: 'A tally of plus and minus pulses that stops the moment the error is small enough.' },
  sources: [source.s5_5],
  teaching: {
   intuition: 'An alternating series is one whose terms take turns: plus, minus, plus, minus, as in 1 − 1/2 + 1/3 − 1/4 + …. Picture walking along a line: forward 1, back a half, forward a third, back a quarter. Each step is shorter than the last and points the other way, so you overshoot, then undershoot, then overshoot again, and the swings close in on one point. That is the alternating series test: if the sizes of the terms keep shrinking and approach 0, the series converges, even when the same terms without their signs would diverge. The walk also tells you how far off you are. After any number of steps the target lies between where you stand and where the next step would take you. So the remainder, the gap between a partial sum and the true total, is smaller than the size of the first term you left out. To guarantee an error below some size, add terms until the next one is below that size.',
   steps: [
    'Check that the signs alternate and that the sizes of the terms shrink towards 0.',
    'The error after N terms is less than the size of term N + 1, the first one left out.',
    'To make the error below a chosen size, ask that term N + 1 be below that size, and solve for N.',
    'Take the smallest whole number N that works. Adding more terms only makes the bound smaller.'
   ],
   example: {
    prompt: 'How many terms of 1 − 1/2 + 1/3 − 1/4 + … guarantee an error below 0.04?',
    steps: [
     'After N terms the first term left out is 1 ÷ (N + 1).',
     'We need 1 ÷ (N + 1) < 0.04, that is N + 1 > 1 ÷ 0.04 = 25.',
     'The smallest whole number above 25 is 26, so N + 1 = 26.'
    ],
    answer: '25 terms.'
   },
   pitfalls: [
    'Using the last term added instead of the first term left out: after 10 terms the bound is term 11.',
    'Stopping when (N + 1)² exactly equals the target. The bound must be below the target, so (N + 1)² must be strictly bigger.',
    'Using the bound on a series whose signs do not alternate, or whose terms do not keep shrinking. The test needs both.'
   ]
  },
  guidance: [
   { prompt: 'After 4 terms, the first term left out is term 5. What is its size, 1 ÷ 5²?', answer: [0.04], labels: ['size of first term left out'], explanation: '1 ÷ 5² = 1 ÷ 25 = 0.04, so the partial sum of 4 terms is within 0.04 of the total.' },
   { prompt: 'With N terms the bound is 1 ÷ (N + 1)². For it to be below 0.001, (N + 1)² must be above 1 ÷ 0.001 = 1000. What is the smallest whole number m with m² > 1000?', answer: [32], labels: ['m = N + 1'], explanation: '31² = 961 is not above 1000, but 32² = 1024 is, so m = 32.' },
   { prompt: 'That m is N + 1, the position of the first term left out. How many terms N must be added?', answer: [31], labels: ['terms needed N'], explanation: 'N = 32 − 1 = 31. With 31 terms the first term left out is 1 ÷ 32², which is below 0.001.' }
  ]
 },
 {
  id: 'q34', title: 'The code that checks itself', topic: 'Ratio and root tests', tier: 'Advanced', sector: 'Signal Lab',
  brief: 'The relay tower’s error-correcting code adds up terms built from powers and factorials, and Mira wants a quick way to tell whether the sum is safe.',
  lesson: 'When the ratio aₙ₊₁ ÷ aₙ, or the nth root of aₙ, approaches a limit L, the series converges if L < 1 and diverges if L > 1; L = 1 decides nothing.',
  prompt: 'A relay tower’s error-correcting code adds up the terms aₙ = (2n)! ÷ ((n!)² × 5ⁿ) for n = 1, 2, 3, … without end. Use the ratio test. Enter the limit L of aₙ₊₁ ÷ aₙ as n → ∞ as a fraction in lowest terms, its numerator and then its denominator (a whole number has denominator 1), then 1 if the series converges and 0 if it diverges.',
  answer: [4, 5, 1], labels: ['L numerator', 'L denominator', 'converges (1 or 0)'], tolerance: 0.01,
  hints: [
   '(n + 1)! = (n + 1) × n! and (2n + 2)! = (2n + 2)(2n + 1) × (2n)!, so most of the factorials cancel in aₙ₊₁ ÷ aₙ.',
   'The ratio test: L < 1 means the series converges, L > 1 means it diverges, and L = 1 tells you nothing.'
  ],
  solution: 'aₙ₊₁ ÷ aₙ = (2n + 2)! ÷ (2n)! × (n!)² ÷ ((n + 1)!)² ÷ 5 = (2n + 2)(2n + 1) ÷ ((n + 1)² × 5) = 2(2n + 1) ÷ (5(n + 1)) = (4n + 2) ÷ (5n + 5). Dividing the top and the bottom by n, this approaches 4 ÷ 5 = 4/5. L = 4/5 < 1, so the series converges: enter 1.',
  xp: 200, prereqs: ['q32'],
  artifact: { name: 'Ratio gauge', description: 'A needle that reads how each term compares with the one before.' },
  sources: [source.s5_6],
  teaching: {
   intuition: 'A geometric series converges when its common ratio is below 1 in size, because every term is the same fraction of the one before. The ratio test asks whether any series behaves like that in the long run. Work out aₙ₊₁ ÷ aₙ, the size of each term compared with the one before, and find its limit L as n → ∞. If L < 1, the terms eventually shrink at least as fast as a geometric series with a ratio below 1, so the series converges. If L > 1, the terms eventually grow, so it diverges. If L = 1, the test gives no answer and another test is needed. The ratio test is at its best with factorials. The factorial n!, read “n factorial”, is the product 1 × 2 × 3 × … × n, so 4! = 24, and by agreement 0! = 1. The handy fact is (n + 1)! = (n + 1) × n!, which makes most of a factorial cancel in a ratio. The root test is the twin for terms that are a whole nth power: take the nth root of aₙ, find its limit L, and use the same rule.',
   steps: [
    'Write aₙ₊₁ by putting n + 1 in place of n everywhere in aₙ.',
    'Simplify aₙ₊₁ ÷ aₙ: cancel factorials with (n + 1)! = (n + 1) × n!, and powers with bⁿ⁺¹ ÷ bⁿ = b.',
    'Find the limit L of the simplified ratio as n → ∞, dividing the top and the bottom by the highest power of n.',
    'L < 1: the series converges. L > 1: it diverges. L = 1: the test decides nothing. When aₙ is a whole nth power, its nth root gives L in the same way (the root test).'
   ],
   example: {
    prompt: 'Does Σ 3ⁿ ÷ n! converge?',
    steps: [
     'aₙ₊₁ ÷ aₙ = 3ⁿ⁺¹ ÷ (n + 1)! × n! ÷ 3ⁿ = 3 ÷ (n + 1).',
     'As n → ∞, 3 ÷ (n + 1) approaches 0, so L = 0.',
     '0 < 1, so the series converges, however big 3ⁿ gets: n! grows faster.'
    ],
    answer: 'L = 0, and the series converges.'
   },
   pitfalls: [
    'Reading L = 1 as “converges” or as “diverges”. It means the test cannot tell: Σ 1 ÷ n and Σ 1 ÷ n² both give L = 1.',
    'Cancelling factorials wrongly: (2n + 2)! ÷ (2n)! is (2n + 2)(2n + 1), two factors, not one.',
    'Dividing the wrong way round. aₙ ÷ aₙ₊₁ turns a limit below 1 into one above 1.'
   ]
  },
  guidance: [
   { prompt: 'Cancel the factorials: aₙ₊₁ ÷ aₙ = (2n + 2)(2n + 1) ÷ ((n + 1)² × 5) = (4n + 2) ÷ (5n + 5). What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.', answer: [4, 5], labels: ['L numerator', 'L denominator'], explanation: 'Divide the top and the bottom by n: (4 + 2 ÷ n) ÷ (5 + 5 ÷ n) approaches 4 ÷ 5, which in lowest terms is 4/5.' },
   { prompt: 'L = 4/5. Enter 1 if the ratio test says the series converges, 0 if it says it diverges.', answer: [1], labels: ['converges (1 or 0)'], explanation: '4/5 is less than 1, so the terms shrink at least as fast as a geometric series with ratio below 1: the series converges.' }
  ]
 },
 {
  id: 'q35', title: 'The heading correction series', topic: 'Power series: radius and interval of convergence', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'The star compass corrects its heading with an endless sum of powers, and the navigator needs to know for which settings that sum can be trusted.',
  lesson: 'A power series in powers of (x − a) is centred at a; it converges when x is closer to a than its radius of convergence R, and diverges when x is further away.',
  prompt: 'The star compass corrects its heading with the power series Σ (x − 3)ⁿ ÷ (n × 4ⁿ), summed from n = 1. Enter the centre of the series, then its radius of convergence, then the left end and the right end of its interval of convergence.',
  answer: [3, 4, -1, 7], labels: ['centre', 'radius of convergence', 'left end', 'right end'], tolerance: 0.01,
  hints: [
   'A power series in powers of (x − a) is centred at a. Write (x − 3) in the form (x − a) to read off a.',
   'Use the ratio test on the terms: divide one term by the one before and let n grow, remembering that a factor such as n ÷ (n + 1) approaches 1. The series converges where the size of that limit is below 1, and how far x may then be from the centre is the radius.'
  ],
  solution: 'The series is written in powers of (x − 3), so it is centred at 3. The ratio of one term to the one before is (x − 3) × n ÷ (4(n + 1)), whose size approaches |x − 3| ÷ 4. The ratio test needs |x − 3| ÷ 4 < 1, that is |x − 3| < 4, so the radius of convergence is 4. The interval runs from 3 − 4 = −1 to 3 + 4 = 7. At its ends the ratio test says nothing: at x = 7 the series is Σ 1 ÷ n, the harmonic series, which diverges, and at x = −1 it is Σ (−1)ⁿ ÷ n, an alternating series that converges.',
  xp: 200, prereqs: ['q34'],
  artifact: { name: 'Trust band', description: 'A strip on the compass dial marking the settings where the correction series holds.' },
  sources: [source.s6_1],
  teaching: {
   intuition: 'A power series is a series whose terms are powers of x − a, each with its own number in front: c₀ + c₁(x − a) + c₂(x − a)² + …. The number a is its centre. It is like a polynomial that never ends, so it can do jobs no polynomial can, but only for some values of x: each x gives a different series of numbers, which may converge or diverge. The ratio test sorts them out. The ratio of one term to the one before contains a factor (x − a), so its limit comes out as |x − a|, the distance from x to the centre, divided by some number R. The series converges where that limit is below 1, which is when x is less than R away from a, and diverges when x is further. R is the radius of convergence, and the stretch from a − R to a + R is the interval of convergence. At its two ends the limit is exactly 1, so the ratio test says nothing there, and each end has to be checked on its own with the other tests.',
   steps: [
    'Read the centre: a series in powers of (x − a) is centred at a. A power of (x + 2) is a power of (x − (−2)), so its centre is −2.',
    'Apply the ratio test to the terms, keeping x as a letter. The limit comes out as |x − a| ÷ R for some number R.',
    'The series converges when |x − a| ÷ R < 1, that is when x is within R of the centre: R is the radius of convergence.',
    'The interval of convergence runs from a − R to a + R. Its two ends need their own check when you need them.'
   ],
   example: {
    prompt: 'Find the centre and the radius of convergence of Σ (x − 1)ⁿ ÷ 5ⁿ.',
    steps: [
     'It is in powers of (x − 1), so the centre is 1.',
     'The ratio of one term to the one before is (x − 1) ÷ 5, so the limit is |x − 1| ÷ 5.',
     'That is below 1 when |x − 1| < 5.'
    ],
    answer: 'Centre 1 and radius 5: the series converges for x between −4 and 6.'
   },
   pitfalls: [
    'Reading the centre of a series in powers of (x + 4) as 4. It is −4, because x + 4 = x − (−4).',
    'Taking the radius from the first coefficient. It comes from the limit of the ratio, |x − a| ÷ R.',
    'Assuming the ends of the interval behave like its inside. At the ends the ratio test gives exactly 1, and a series may converge at one end and diverge at the other.'
   ]
  },
  guidance: [
   { prompt: 'Write (x − 3) in the form (x − a). What is the centre a?', answer: [3], labels: ['centre'], explanation: '(x − 3) is already in that form, so the series is centred at 3.' },
   { prompt: 'The ratio test gives the limit |x − 3| ÷ 4, and the series converges when it is below 1. How far from the centre can x be?', answer: [4], labels: ['radius'], explanation: '|x − 3| ÷ 4 < 1 means |x − 3| < 4: x may be up to 4 away from the centre. That distance is the radius of convergence.' },
   { prompt: 'The interval of convergence runs one radius either side of the centre 3. What are its left and right ends?', answer: [-1, 7], labels: ['left end', 'right end'], explanation: '3 − 4 = −1 and 3 + 4 = 7.' }
  ]
 },
 {
  id: 'q36', title: 'Square roots by polynomial', topic: 'Taylor polynomials', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'The star compass chip can only add and multiply, so the navigator needs a polynomial that stands in for a harder function near one point.',
  lesson: 'The Taylor polynomial of degree n about a matches f and its first n derivatives at a: the coefficient of (x − a)ᵏ is the kth derivative at a divided by k!.',
  prompt: 'The star compass cannot take square roots directly, so it uses the Taylor polynomial of degree 2 of f(x) = √x about x = 4. Enter the coefficient of (x − 4)² in that polynomial (a fraction such as −1/8 is fine), then the polynomial’s value at x = 4.2, rounded to 4 decimal places.',
  answer: [-0.015625, 2.0494], labels: ['coefficient of the top power', 'P at the point (4 d.p.)'], tolerance: 0.00005,
  hints: [
   'The coefficient of (x − a)ᵏ in a Taylor polynomial is the kth derivative at a divided by k!. Here you need f′(x) = 1 ÷ (2√x) and f″(x) = −1 ÷ (4x√x).',
   'Put x = 4.2 into the polynomial, so that x − 4 = 0.2, and keep every decimal until the final rounding.'
  ],
  solution: 'For f(x) = √x: f′(x) = 1 ÷ (2√x), f″(x) = −1 ÷ (4x√x). At x = 4: f(4) = 2, f′(4) = 1/4, f″(4) = −1/32. Dividing the kth derivative by k! gives the coefficients, so P(x) = 2 + (x − 4) ÷ 4 − (x − 4)² ÷ 64, and the coefficient of (x − 4)² is −1/32 ÷ 2! = −1/64. At x = 4.2, x − 4 = 0.2, and P(4.2) = 2.0493… (the next decimal is 7), which rounds to 2.0494.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Polynomial stand-in', description: 'A short polynomial that does the work of a square root near one point.' },
  sources: [source.s6_3],
  teaching: {
   intuition: 'Near a point a, a smooth function can be copied by a polynomial. The tangent line from Calculus 1, f(a) + f′(a)(x − a), already matches the value and the slope at a. Add a term in (x − a)² to match the bending, the second derivative, as well; add a term in (x − a)³ to match the third derivative, and so on. Matching the kth derivative needs the coefficient f⁽ᵏ⁾(a) ÷ k!, where f⁽ᵏ⁾ is the kth derivative and k! = 1 × 2 × … × k: differentiating (x − a)ᵏ k times leaves exactly k!, and the division cancels it. The result, P(x) = f(a) + f′(a)(x − a) + f″(a)(x − a)² ÷ 2! + … + f⁽ⁿ⁾(a)(x − a)ⁿ ÷ n!, is the Taylor polynomial of degree n about a. Close to a it is an excellent stand-in for f, and it needs only adding and multiplying. Carrying the terms on without end gives a power series, the Taylor series of f about a.',
   steps: [
    'Differentiate f as many times as the degree asks.',
    'Put x = a into f and into each derivative.',
    'Divide the kth derivative at a by k! to get the coefficient of (x − a)ᵏ.',
    'Write out the polynomial and put in the value of x you need. Keep every decimal until the last step.'
   ],
   example: {
    prompt: 'Find the Taylor polynomial of degree 2 of ln x about 1, and use it at x = 1.1.',
    steps: [
     'f(1) = ln 1 = 0; f′(x) = 1 ÷ x gives f′(1) = 1; f″(x) = −1 ÷ x² gives f″(1) = −1.',
     'The coefficients are 0, 1 and −1 ÷ 2! = −1/2, so P(x) = (x − 1) − (x − 1)² ÷ 2.',
     'At x = 1.1: 0.1 − 0.01 ÷ 2 = 0.095.'
    ],
    answer: 'P(1.1) = 0.095, close to ln 1.1 ≈ 0.0953.'
   },
   pitfalls: [
    'Forgetting to divide by k!. The coefficient of (x − a)³ is f‴(a) ÷ 6, not f‴(a).',
    'Putting x itself into the powers instead of x − a. For x = 16.5 about 16, the number to raise to each power is 0.5.',
    'Rounding each term before adding them. Round only the final value.'
   ]
  },
  guidance: [
   { prompt: 'Start with f(x) = √x at x = 4. What are f(4) and f′(4)? Fractions are fine.', answer: [2, 0.25], labels: ['f at the centre', 'f′ at the centre'], explanation: 'f(4) = 2, and f′(x) = 1 ÷ (2√x) gives f′(4) = 1/4.' },
   { prompt: 'f″(x) = −1 ÷ (4x√x). What is f″(4)?', answer: [-0.03125], labels: ['top derivative at the centre'], explanation: 'f″(4) = −1/32.' },
   { prompt: 'The coefficient of (x − 4)² is f″(4) ÷ 2!. What is it?', answer: [-0.015625], labels: ['coefficient'], explanation: '−1/32 ÷ 2 = −1/64.' },
   { prompt: 'The polynomial is P(x) = 2 + (x − 4) ÷ 4 − (x − 4)² ÷ 64. Put in x = 4.2. What is P(4.2), rounded to 4 decimal places?', answer: [2.0494], labels: ['P at the point (4 d.p.)'], explanation: 'With x − 4 = 0.2, P(4.2) = 2.0493… (the next decimal is 7), which rounds to 2.0494.' }
  ]
 },
 {
  id: 'q37', title: 'Series from the star tables', topic: 'Maclaurin series of eˣ, sin x, cos x and 1 ÷ (1 − x)', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'The star tables list four standard series, and the navigation room builds every other formula it needs out of them.',
  lesson: 'A Maclaurin series is a Taylor series about 0; the series of eˣ, sin x, cos x and 1 ÷ (1 − x) give new series when a multiple of x is put in place of x.',
  prompt: 'The navigation room computes sin(2x) from its Maclaurin series. Enter the coefficient of x⁵ in that series as a fraction in lowest terms: its numerator (with a minus sign if the coefficient is negative), then its denominator (1 for a whole number). Type the numbers without commas.',
  answer: [4, 15], labels: ['numerator', 'denominator'], tolerance: 0.01,
  hints: [
   'Start from the known series sin u = u − u³/3! + u⁵/5! − u⁷/7! + ….',
   'Put u = 2x. The term with u⁵ becomes (2x)⁵ ÷ 5!, and (2x)⁵ = 2⁵x⁵.'
  ],
  solution: 'The Maclaurin series sin u = u − u³/3! + u⁵/5! − u⁷/7! + … holds for every u. Put u = 2x: the term with x⁵ comes from +u⁵ ÷ 5!, which becomes 2⁵x⁵ ÷ 5! = 32x⁵ ÷ 120. So the coefficient is 4/15 in lowest terms: numerator 4, denominator 15.',
  xp: 200, prereqs: ['q36'],
  artifact: { name: 'Star table of series', description: 'Four series copied out by hand, the starting point for every other formula.' },
  sources: [source.s6_3],
  teaching: {
   intuition: 'A Taylor series about 0 is called a Maclaurin series. Four of them are worth knowing by heart. eˣ = 1 + x + x²/2! + x³/3! + …, because every derivative of eˣ is eˣ, which is 1 at 0. sin x = x − x³/3! + x⁵/5! − …, with only odd powers and alternating signs, because the derivatives of sin at 0 cycle through 0, 1, 0, −1 (x in radians, as always). cos x = 1 − x²/2! + x⁴/4! − …, with only even powers. And 1 ÷ (1 − x) = 1 + x + x² + x³ + …, the geometric series with ratio x, which converges only when |x| < 1; the other three converge for every x. New series come from these without any more differentiating. For e^(3x), put 3x in place of x everywhere, so the x² term becomes (3x)²/2! = 9x²/2. The number in front of each power of x, its coefficient, can then be read straight off.',
   steps: [
    'Pick the known series that matches the function: eᵘ, sin u, cos u or 1 ÷ (1 − u).',
    'Write the function with u standing for the scaled input, such as u = 3x.',
    'Find the term of the known series that holds the power you want, and put the scaled input in for u: (3x)⁴ = 3⁴x⁴.',
    'Multiply the coefficient of that power of u by the scale raised to the same power, keep the sign, and reduce the fraction to lowest terms.'
   ],
   example: {
    prompt: 'Find the coefficient of x⁴ in the Maclaurin series of cos(3x).',
    steps: [
     'cos u = 1 − u²/2! + u⁴/4! − …, so the u⁴ term is +u⁴ ÷ 24.',
     'With u = 3x: (3x)⁴ = 81x⁴, so the term is 81x⁴ ÷ 24.',
     '81 ÷ 24 = 27/8 in lowest terms.'
    ],
    answer: '27/8.'
   },
   pitfalls: [
    'Forgetting to raise the scale to the power too: the x³ term of e^(2x) is (2x)³/3! = 8x³/6, not 2x³/6.',
    'Losing a sign: the series of sin and cos alternate, so the x³ term of sin x is −x³/3!.',
    'Looking for an x⁴ term in sin x or an x³ term in cos x. Those coefficients are 0: sin has only odd powers and cos only even ones.'
   ]
  },
  guidance: [
   { prompt: 'In sin(2x) the series variable is u = 2x, so u⁵ = 2⁵x⁵. What is 2⁵?', answer: [32], labels: ['scale to the power'], explanation: '2⁵ = 32.' },
   { prompt: 'The u⁵ term of the series is +u⁵ ÷ 5!, and 5! = 120. So the coefficient of x⁵ is 32 ÷ 120. Write it in lowest terms: numerator, then denominator.', answer: [4, 15], labels: ['numerator', 'denominator'], explanation: '32 ÷ 120 = 4/15 after dividing the top and the bottom by 8.' }
  ]
 },
 {
  id: 'q38', title: 'How many terms is enough', topic: 'Taylor’s remainder: how good is the estimate', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'The star compass has to stop adding terms somewhere, and the navigator must prove the answer is still accurate enough.',
  lesson: 'Taylor’s theorem bounds the error of the degree-n Maclaurin polynomial (the Taylor polynomial about 0) by M × |x|ⁿ⁺¹ ÷ (n + 1)!, where M bounds the size of the next derivative.',
  prompt: 'The star compass works out cos(0.5) with a Maclaurin polynomial of degree n: a Taylor polynomial about 0, built from powers of x up to xⁿ. Taylor’s theorem bounds the error by M × |x|ⁿ⁺¹ ÷ (n + 1)!, with x = 0.5 and M = 1, because every derivative of cos x is ± sin x or ± cos x, which never exceeds 1 in size. Enter the smallest degree n for which this bound is below 0.0001.',
  answer: [5], labels: ['smallest degree n'], tolerance: 0.01,
  hints: [
   'Work out the bound for n = 1, 2, 3, … in turn. Each step multiplies the previous bound by |x| ÷ (n + 1), so it soon shrinks fast.',
   'Stop at the first degree whose bound is below 0.0001; the degree before it must still give a bound of 0.0001 or more.'
  ],
  solution: 'The Taylor remainder after the degree-n polynomial is at most M × |x|ⁿ⁺¹ ÷ (n + 1)! with M = 1. For n = 4 the bound is 0.5⁵ ÷ 5! = 0.5⁵ ÷ 120, about 1 ÷ 3840, which is not below 0.0001 = 1 ÷ 10000. For n = 5 it is 0.5⁶ ÷ 6! = 0.5⁶ ÷ 720, about 1 ÷ 46080, which is. So the smallest degree is 5.',
  xp: 200, prereqs: ['q36', 'q33'],
  artifact: { name: 'Accuracy certificate', description: 'A signed note that the compass reading is good to the last digit shown.' },
  sources: [source.s6_3],
  teaching: {
   intuition: 'A Taylor polynomial is only the start of the Taylor series, so it leaves an error behind: the Taylor remainder, the true value minus the polynomial’s value. Taylor’s theorem says how large that remainder can be. If the (n + 1)th derivative of f never exceeds some number M in size between a and x, then the remainder after the degree-n polynomial is at most M × |x − a|ⁿ⁺¹ ÷ (n + 1)!. It looks like the first term left out, with M in place of the derivative at a. A Maclaurin polynomial is a Taylor polynomial about a = 0, so its bound is M × |x|ⁿ⁺¹ ÷ (n + 1)!. For sin and cos every derivative is ± sin or ± cos, so M = 1 works for every x. For eˣ every derivative is eˣ itself, so for x between 0 and 1 we can use M = 3, since e is less than 3. The factorial on the bottom grows so fast that the bound soon collapses, which is why a handful of terms is usually enough. To find how many, raise the degree one step at a time until the bound drops below the accuracy you need. Here n counts the powers up to xⁿ even when the xⁿ term itself is 0: sin x has no x⁶ term, so its polynomials for n = 5 and n = 6 are the same, and the bound for n = 6 then covers that polynomial too. The question is how large n must be before the bound itself drops below the target.',
   steps: [
    'Find M: a number that the size of the needed derivative never exceeds between 0 and x.',
    'For n = 1, 2, 3, …, work out the bound M × |x|ⁿ⁺¹ ÷ (n + 1)!.',
    'Going from degree n − 1 to degree n multiplies the bound by |x| ÷ (n + 1), which saves work.',
    'The answer is the first degree whose bound is below the accuracy asked for.'
   ],
   example: {
    prompt: 'For the Maclaurin polynomial of sin x at x = 1.5, what is the smallest n for which the bound is below 0.01?',
    steps: [
     'M = 1, because every derivative of sin is ± sin or ± cos.',
     'n = 5: 1.5⁶ ÷ 6! = 11.390625 ÷ 720 ≈ 0.0158, not below 0.01.',
     'n = 6: 1.5⁷ ÷ 7! = 17.0859375 ÷ 5040 ≈ 0.0034, below 0.01.'
    ],
    answer: 'n = 6. sin x has no x⁶ term, so this is the same polynomial as n = 5, and its error is below 0.0034.'
   },
   pitfalls: [
    'Using |x|ⁿ instead of |x|ⁿ⁺¹. The remainder after degree n starts with the power n + 1.',
    'Taking M = 1 for eˣ. Its derivatives are eˣ itself, which reaches e between 0 and 1, so M = 3 is the safe choice.',
    'Stopping at a degree whose bound is merely close. The bound must be strictly below the accuracy asked for.'
   ]
  },
  guidance: [
   { prompt: 'Try n = 4: the bound is 0.5⁵ ÷ 5!. Is it below 0.0001? Enter 1 for yes, 0 for no.', answer: [0], labels: ['below? (1 or 0)'], explanation: '0.5⁵ ÷ 5! = 0.5⁵ ÷ 120, about 1 ÷ 3840, which is not below 0.0001.' },
   { prompt: 'Try n = 5: the bound is 0.5⁶ ÷ 6!. Is it below 0.0001? Enter 1 for yes, 0 for no.', answer: [1], labels: ['below? (1 or 0)'], explanation: '0.5⁶ ÷ 6! = 0.5⁶ ÷ 720, about 1 ÷ 46080, which is below 0.0001.' },
   { prompt: 'Lower degrees give bigger bounds. What is the smallest degree n whose bound is below the target?', answer: [5], labels: ['smallest degree n'], explanation: 'Degree 4 is not enough and degree 5 is, so the answer is 5.' }
  ]
 },
 {
  id: 'q39', title: 'The bell curve with no antiderivative', topic: 'Integrating a series to estimate an integral', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'The navigation room needs an area under a curve that nothing from Calculus 1 can integrate, and it needs it to four decimal places.',
  lesson: 'Inside its interval of convergence a power series can be integrated term by term, which turns an integral with no simple antiderivative into a sum of easy terms.',
  prompt: 'The navigation room needs the integral of e^(−x²) from x = 0 to x = 0.5, but e^(−x²) has no antiderivative made of the usual functions. Replace e^(−x²) by its Maclaurin series, integrate term by term, and add the first 3 terms of the result. Enter the estimate rounded to 4 decimal places.',
  answer: [0.4615], labels: ['estimate (4 d.p.)'], tolerance: 0.00005,
  hints: [
   'Start from e^(−x²) = 1 − x² + x⁴/2! − x⁶/3! + …. Integrating xᵐ from 0 to b gives bᵐ⁺¹ ÷ (m + 1).',
   'Keep every decimal while you add the terms, and round only the final sum.'
  ],
  solution: 'The series is e^(−x²) = 1 − x² + x⁴/2! − x⁶/3! + …. Integrating each term from 0 to 0.5 gives 0.5 − 0.5³/3 + 0.5⁵/10 − …. Adding the first 3 terms with every decimal kept gives 0.4614… (the next decimal is 5), which rounds to 0.4615. The integrated series alternates, so the estimate is within the first term left out, which is less than 0.0002, of the true value.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Brightness integral', description: 'An area worked out term by term, with its error bound written beside it.' },
  sources: [source.s6_4],
  teaching: {
   intuition: 'Some functions, such as e^(−x²) and sin(x) ÷ x, have no antiderivative that can be written with the usual functions, so the Fundamental Theorem cannot be used on them directly. Their Maclaurin series are easy, though: put −x² in place of x in the series of eˣ, or divide the series of sin x by x. A power series may be integrated term by term inside its interval of convergence, and every term is a plain power of x, whose integral is simple: the integral of xᵐ from 0 to b is bᵐ⁺¹ ÷ (m + 1). So the integral becomes a series of numbers. For these two functions that series alternates in sign and its terms shrink fast, so a few terms give a very good estimate. How good is told by the alternating series bound: when the terms of a series take turns being positive and negative and keep shrinking towards 0, the error of a partial sum is less than the size of the first term left out.',
   steps: [
    'Write the Maclaurin series of the function, by substituting into a known series.',
    'Integrate each term from 0 to b: xᵐ becomes bᵐ⁺¹ ÷ (m + 1), still divided by any number the term was already divided by.',
    'Add the terms asked for, keeping every decimal.',
    'Round only the final sum. Because the series alternates, the first term left out bounds the error.'
   ],
   example: {
    prompt: 'Estimate the integral of e^(−x²) from 0 to 0.2 with the first two terms of the integrated series.',
    steps: [
     'e^(−x²) = 1 − x² + …, and integrating from 0 to 0.2 gives 0.2 − 0.2³ ÷ 3 + ….',
     '0.2³ ÷ 3 = 0.008 ÷ 3 ≈ 0.0026667.',
     '0.2 − 0.0026667 = 0.1973333.'
    ],
    answer: 'About 0.1973. The next term, 0.2⁵ ÷ 10 = 0.000032, bounds the error.'
   },
   pitfalls: [
    'Integrating the power but dropping the factorial already under it: x⁴/2! integrates to b⁵ ÷ (5 × 2) = b⁵ ÷ 10.',
    'Rounding each term to 4 decimals before adding. Small slips add up and can change the last digit.',
    'Losing the alternating signs of the series.'
   ]
  },
  guidance: [
   { prompt: 'The third term of the series of e^(−x²) is x⁴/2!. Integrated from 0 to b it becomes b⁵ ÷ D. What is D?', answer: [10], labels: ['D'], explanation: 'The integral of x⁴ from 0 to b is b⁵ ÷ 5, and it is still divided by 2! = 2, so D = 5 × 2 = 10.' },
   { prompt: 'The integrated series is 0.5 − 0.5³/3 + 0.5⁵/10 − …. Add these 3 terms. What is the estimate, rounded to 4 decimal places?', answer: [0.4615], labels: ['estimate (4 d.p.)'], explanation: 'Work out each term, keep every decimal and add them with their signs: the sum is 0.4614… (the next decimal is 5), which rounds to 0.4615.' }
  ]
 },
 {
  id: 'q40', title: 'The survey drone’s path', topic: 'Parametric equations: the slope and length of a path', tier: 'Advanced', sector: 'Navigation Room',
  brief: 'Before the survey of three dimensions begins, a drone must fly a test path, and the navigation room needs its slope at one moment and its total length.',
  lesson: 'A path given by x(t) and y(t) has slope dy/dx = (dy/dt) ÷ (dx/dt), and its length is the integral of √((dx/dt)² + (dy/dt)²) dt.',
  prompt: 'A survey drone leaves the navigation room on a path given by two functions of time: x(t) = 3t² + 2 and y(t) = t³ − 3t + 1, in metres, t seconds after launch. Enter the slope dy/dx of its path at t = 2, then the length of the path in metres from t = 0 to t = 3.',
  answer: [0.75, 36], labels: ['slope dy/dx', 'length (m)'], tolerance: 0.0005,
  hints: [
   'The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt): how fast y changes divided by how fast x changes.',
   'The length is the integral of √((dx/dt)² + (dy/dt)²) dt. Here (dx/dt)² + (dy/dt)² works out to 9(t² + 1)², a perfect square.'
  ],
  solution: 'dx/dt = 6t and dy/dt = 3t² − 3. At t = 2: dx/dt = 12 and dy/dt = 9, so dy/dx = 9 ÷ 12 = 0.75. For the length, (6t)² + (3t² − 3)² = 9(t⁴ + 2t² + 1) = 9(t² + 1)², so the speed is √(…) = 3(t² + 1) = 3t² + 3. Its integral from 0 to 3 is [t³ + 3t] from 0 to 3 = 36 − 0 = 36 metres.',
  xp: 200, prereqs: ['q13', 'q39'],
  artifact: { name: 'Flight trace', description: 'The drone’s test path, with its slope and its length marked on it.' },
  sources: [source.s7_1, source.s7_2],
  teaching: {
   intuition: 'Not every path is the graph of y = f(x): a drone can turn back or loop over itself. Instead, give its position at each time by two functions, x(t) and y(t). These are parametric equations, and t, the extra variable that both depend on, is the parameter. To find the slope of the path, ask how fast each coordinate changes. In a short time dt, x changes by about (dx/dt) dt and y by about (dy/dt) dt, so the slope dy/dx is (dy/dt) ÷ (dx/dt), as long as dx/dt is not 0. The length works like the arc length of a curve: over a short time the drone moves along the long side of a tiny right triangle whose other sides are (dx/dt) dt and (dy/dt) dt, so by Pythagoras it covers √((dx/dt)² + (dy/dt)²) dt. That square root is its speed. Adding these pieces up with an integral, from one time to another, gives the length of the path. Describing motion with a parameter is where Calculus 3 begins, with a third coordinate z(t) as well.',
   steps: [
    'Differentiate both functions with respect to t to get dx/dt and dy/dt.',
    'Slope at a time: put the time into both derivatives and divide, dy/dx = (dy/dt) ÷ (dx/dt).',
    'Speed: √((dx/dt)² + (dy/dt)²). Simplify it before integrating; on a well-chosen path it is a perfect square.',
    'Length: integrate the speed from the start time to the end time.'
   ],
   example: {
    prompt: 'A rover follows x(t) = t² and y(t) = t³ ÷ 3 − t. Find the slope of its path at t = 3 and the length of the path from t = 0 to t = 3.',
    steps: [
     'dx/dt = 2t and dy/dt = t² − 1. At t = 3: dy/dx = 8 ÷ 6 = 4/3.',
     '(2t)² + (t² − 1)² = t⁴ + 2t² + 1 = (t² + 1)², so the speed is t² + 1.',
     'The length is [t³ ÷ 3 + t] from 0 to 3 = 9 + 3 = 12.'
    ],
    answer: 'Slope 4/3 at t = 3; length 12.'
   },
   pitfalls: [
    'Dividing the wrong way round: the slope is dy/dt divided by dx/dt, not dx/dt divided by dy/dt.',
    'Integrating dx/dt + dy/dt for the length. The two rates combine by Pythagoras, under a square root.',
    'Using the change in x and in y between the two end points. That gives the straight-line distance, which is shorter than a curved path.'
   ]
  },
  guidance: [
   { prompt: 'dx/dt = 6t and dy/dt = 3t² − 3. What are they at t = 2?', answer: [12, 9], labels: ['dx/dt', 'dy/dt'], explanation: 'dx/dt = 6 × 2 = 12 and dy/dt = 3 × 4 − 3 = 9.' },
   { prompt: 'The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt). What is it at t = 2?', answer: [0.75], labels: ['slope dy/dx'], explanation: '9 ÷ 12 = 0.75.' },
   { prompt: 'The speed along the path is √((dx/dt)² + (dy/dt)²). What is it at t = 2?', answer: [15], labels: ['speed (m/s)'], explanation: '√(12² + 9²) = √225 = 15, which matches 3(t² + 1) at t = 2.' },
   { prompt: 'The speed is 3(t² + 1) = 3t² + 3 at every time. Integrate it from t = 0 to t = 3. What is the length of the path?', answer: [36], labels: ['length (m)'], explanation: 'An antiderivative is t³ + 3t, so the length is 36 − 0 = 36 metres.' }
  ]
 }
);
})();
