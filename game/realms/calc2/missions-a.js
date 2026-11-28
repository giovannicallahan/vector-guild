/* Calculus 2: accumulation missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/calc2/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Net change from a rate [1.4]
     q02  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Accumulation functions: the derivative of ∫ₐˣ f(t) dt [1.3]
     q03  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Average value of a function on an interval [1.3]
     q04  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Substitution, including changing the limits [1.5]
     q05  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Integrals that give ln|x| and eˣ [1.6]
     q06  ch 1 Accumulation · Basic, 100 XP · sector 'Reservoir' · Integrals that give arctan and arcsin [1.7]
     q07  ch 2 Areas and solids · Basic, 100 XP · sector 'Hull Foundry' · Area between two curves [2.1]
     q08  ch 2 Areas and solids · Basic, 100 XP · sector 'Hull Foundry' · Curves that swap places; slicing along y [2.1]
     q09  ch 2 Areas and solids · Basic, 100 XP · sector 'Hull Foundry' · Volume by slicing with known cross-sections [2.2]
     q10  ch 2 Areas and solids · Basic, 100 XP · sector 'Hull Foundry' · Discs and washers [2.2] */
(function(){
'use strict';
/* OpenStax Calculus Volume 2 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 2 — 3.1 Integration by Parts
   Link to the section page itself: https://openstax.org/books/calculus-volume-2/pages/<section-slug> */
const source = {
 s1_3: { title: 'OpenStax Calculus Volume 2 — 1.3 The Fundamental Theorem of Calculus', url: 'https://openstax.org/books/calculus-volume-2/pages/1-3-the-fundamental-theorem-of-calculus', description: 'Accumulation functions and their derivatives, the average value of a function, and the Mean Value Theorem for integrals.', verified: '2026-11-27' },
 s1_4: { title: 'OpenStax Calculus Volume 2 — 1.4 Integration Formulas and the Net Change Theorem', url: 'https://openstax.org/books/calculus-volume-2/pages/1-4-integration-formulas-and-the-net-change-theorem', description: 'Basic integration formulas and the Net Change Theorem: the final amount is the starting amount plus the integral of the rate.', verified: '2026-11-27' },
 s1_5: { title: 'OpenStax Calculus Volume 2 — 1.5 Substitution', url: 'https://openstax.org/books/calculus-volume-2/pages/1-5-substitution', description: 'Integration by substitution, including changing the limits of a definite integral.', verified: '2026-11-27' },
 s1_6: { title: 'OpenStax Calculus Volume 2 — 1.6 Integrals Involving Exponential and Logarithmic Functions', url: 'https://openstax.org/books/calculus-volume-2/pages/1-6-integrals-involving-exponential-and-logarithmic-functions', description: 'Integrals of exponential functions and integrals that give the natural logarithm ln|x|.', verified: '2026-11-27' },
 s1_7: { title: 'OpenStax Calculus Volume 2 — 1.7 Integrals Resulting in Inverse Trigonometric Functions', url: 'https://openstax.org/books/calculus-volume-2/pages/1-7-integrals-resulting-in-inverse-trigonometric-functions', description: 'Integrals that give the inverse sine and the inverse tangent.', verified: '2026-11-27' },
 s2_1: { title: 'OpenStax Calculus Volume 2 — 2.1 Areas between Curves', url: 'https://openstax.org/books/calculus-volume-2/pages/2-1-areas-between-curves', description: 'The area between two curves, curves that cross, and regions sliced along the y-axis.', verified: '2026-11-27' },
 s2_2: { title: 'OpenStax Calculus Volume 2 — 2.2 Determining Volumes by Slicing', url: 'https://openstax.org/books/calculus-volume-2/pages/2-2-determining-volumes-by-slicing', description: 'Volumes from known cross-sections, and solids of revolution by the disc and washer methods.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'Topping up the settling tank', topic: 'Net change from a rate', tier: 'Basic', sector: 'Reservoir',
  brief: 'The settling tank is filling from a feed pipe whose flow keeps rising, and the reservoir log needs the litres added and the level at the end of the run.',
  lesson: 'The net change in a quantity over an interval is the definite integral of its rate of change; adding it to the starting amount gives the final amount.',
  prompt: 'A feed pipe fills the settling tank at r(t) = 3t² + 4t litres per minute, where t is the number of minutes since the pump started. At t = 1 the tank holds 150 litres. Enter the net change in the amount of water from t = 1 to t = 4, then the amount in the tank at t = 4, both in litres.',
  answer: [93, 243], labels: ['net change (L)', 'amount at the end (L)'], tolerance: 0.01,
  hints: [
   'The net change is the definite integral of the rate over the interval. Find an antiderivative of r(t) by reversing the power rule on each term, with constant 0.',
   'By the Fundamental Theorem of Calculus the net change is F(4) − F(1). The amount at the end is the amount at the start plus the net change.'
  ],
  solution: 'An antiderivative of r(t) = 3t² + 4t is F(t) = t³ + 2t². F(4) = 1 × 64 + 2 × 16 = 96 and F(1) = 1 × 1 + 2 × 1 = 3, so the net change is ∫ from 1 to 4 of r(t) dt = 96 − 3 = 93 litres. By the Net Change Theorem the tank then holds 150 + 93 = 243 litres.',
  xp: 100, prereqs: [],
  artifact: { name: 'Settling tank log', description: 'One antiderivative, one subtraction and the level of the tank at the end of the run.' },
  sources: [source.s1_4],
  teaching: {
   intuition: 'You met this idea at the end of Calculus 1, and the whole of this realm grows from it. When a quantity changes at a rate r(t), the integral of r(t) from one time to another adds up every small change in between: each tiny time step times the rate during it. That total is the net change, and the Fundamental Theorem of Calculus finds it with one antiderivative F: the net change from t = a to t = b is F(b) − F(a). The Net Change Theorem says the same thing as a bookkeeping rule: the amount at the end is the amount at the start plus the net change. The word “net” matters. If the rate were negative for a while, the water leaving would count against the water arriving. Here the rate is in litres per minute and the time in minutes, so the net change comes out in litres.',
   steps: [
    'Find an antiderivative F of the rate, with constant 0, by reversing the power rule on each term.',
    'Work out F at the end of the interval and at the start.',
    'Subtract, end minus start: the net change F(b) − F(a) is the definite integral of the rate from a to b.',
    'Add the net change to the starting amount to get the amount at the end.'
   ],
   example: {
    prompt: 'A tank holds 40 litres at t = 0 and is fed at r(t) = 6t² + 2t litres per minute. What is the net change from t = 0 to t = 3, and how much does the tank hold at t = 3?',
    steps: [
     'An antiderivative is F(t) = 2t³ + t².',
     'F(3) = 54 + 9 = 63 and F(0) = 0, so the net change is 63 litres.',
     'The tank holds 40 + 63 = 103 litres at t = 3.'
    ],
    answer: 'A net change of 63 litres, leaving 103 litres in the tank.'
   },
   pitfalls: [
    'Giving the net change as the final amount: the integral is how much was added, so add it to the starting amount.',
    'Putting the end times into the rate r(t) instead of into the antiderivative F(t).',
    'Leaving out F at the start of the interval: F(a) is 0 only when a = 0 and F has no constant term.'
   ]
  },
  guidance: [
   { prompt: 'Reverse the power rule: an antiderivative of 3t² + 4t has the form F(t) = At³ + Bt². What are A and B?', answer: [1, 2], labels: ['A', 'B'], explanation: 'The derivative of At³ + Bt² is 3At² + 2Bt, so 3A = 3 and 2B = 4: A = 1 and B = 2.' },
   { prompt: 'With F(t) = t³ + 2t², what are F(1) and F(4)?', answer: [3, 96], labels: ['F at the start', 'F at the end'], explanation: 'F(1) = 1 × 1 + 2 × 1 = 3 and F(4) = 1 × 64 + 2 × 16 = 96.' },
   { prompt: 'What is the net change F(4) − F(1), and how much water is in the tank at t = 4?', answer: [93, 243], labels: ['net change (L)', 'amount at the end (L)'], explanation: 'The net change is 96 − 3 = 93 litres. Added to the 150 litres at the start, it leaves 243 litres in the tank.' }
  ]
 },
 {
  id: 'q02', title: 'The running total', topic: 'Accumulation functions', tier: 'Basic', sector: 'Reservoir',
  brief: 'Mira wants the reservoir log to keep a running total that updates every hour, and to know how fast that total is climbing at a chosen hour.',
  lesson: 'An accumulation function F(x) = ∫ from a to x of f(t) dt adds up f from a fixed start to a moving end, and its derivative is the integrand: F′(x) = f(x).',
  prompt: 'The reservoir log keeps a running total F(x) = ∫ from 1 to x of f(t) dt: the kilolitres gained between hour 1 and hour x, where f(t) = 3t² − 4t + 5 kilolitres per hour is the inflow rate. Enter F(4), then F′(4), the rate at which the running total is growing at x = 4, in kilolitres per hour.',
  answer: [48, 37], labels: ['running total (kL)', 'rate of growth (kL/h)'], tolerance: 0.01,
  hints: [
   'F at a number is an ordinary definite integral: find an antiderivative of the integrand and subtract its value at the bottom end from its value at the top end.',
   'You do not need to differentiate anything for F′: the derivative of an accumulation function is its integrand, read at the top end.'
  ],
  solution: 'An antiderivative of the integrand is G(t) = t³ − 2t² + 5t. G(4) = 64 − 32 + 20 = 52 and G(1) = 1 − 2 + 5 = 4, so F(4) = 52 − 4 = 48 kilolitres. The Fundamental Theorem of Calculus says F′(x) = f(x), so F′(4) = f(4) = 48 − 16 + 5 = 37 kilolitres per hour.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Running-total gauge', description: 'A dial that shows the water gained so far and how fast that total is climbing.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'So far the ends of an integral were fixed numbers. Now let the top end move. F(x) = ∫ from a to x of f(t) dt is the total built up from a fixed start a to whatever x you choose, so it is a function of x: an accumulation function, a running total. The function inside the integral, f, is called the integrand. The letter t inside is only a placeholder for what is being added up, and is called a dummy variable: ∫ from a to x of f(t) dt and ∫ from a to x of f(s) ds are the same number. We use t inside to keep it apart from the moving end x. How fast does the running total grow? Push x on by a tiny step h. The total gains a thin strip of width h and height about f(x), so it grows by about f(x) × h. Dividing by h and letting h shrink gives F′(x) = f(x). This is the first part of the Fundamental Theorem of Calculus: differentiating an accumulation function gives back its integrand. At the reservoir, the running total grows exactly as fast as the water flows in.',
   steps: [
    'Identify the integrand f(t) and the fixed bottom end a.',
    'To find F at a number b, work out the definite integral from a to b: an antiderivative at b minus the same antiderivative at a.',
    'To find F′ at b, skip the integral altogether: F′(b) = f(b), the integrand at the top end.',
    'Give units: F is an amount, such as kilolitres; F′ is a rate, such as kilolitres per hour.'
   ],
   example: {
    prompt: 'F(x) = ∫ from 0 to x of (6t + 1) dt. Find F(2) and F′(2).',
    steps: [
     'An antiderivative of 6t + 1 is 3t² + t, so F(2) = (12 + 2) − 0 = 14.',
     'F′(x) is the integrand at x, 6x + 1, so F′(2) = 13.'
    ],
    answer: 'F(2) = 14 and F′(2) = 13.'
   },
   pitfalls: [
    'Differentiating the integrand to get F′: F′(x) is the integrand itself, f(x), not its derivative.',
    'Leaving out the bottom end: F(b) is the antiderivative at b minus the antiderivative at a, and a need not be 0.',
    'Mixing up the dummy variable t with the top end x: the number goes in for x, at the end of the integral.'
   ]
  },
  guidance: [
   { prompt: 'An antiderivative of the integrand 3t² − 4t + 5 has the form G(t) = t³ + Bt² + Ct. What are B and C?', answer: [-2, 5], labels: ['B', 'C'], explanation: 'The derivative of t³ + Bt² + Ct is 3t² + 2Bt + C, so 2B = −4 and C = 5: B = −2 and C = 5.' },
   { prompt: 'With G(t) = t³ − 2t² + 5t, what are G(1) and G(4), and F(4) = G(4) − G(1)?', answer: [4, 52, 48], labels: ['G at the bottom end', 'G at the top end', 'running total (kL)'], explanation: 'G(1) = 1 − 2 + 5 = 4 and G(4) = 64 − 32 + 20 = 52, so F(4) = 52 − 4 = 48 kilolitres.' },
   { prompt: 'The derivative of an accumulation function is its integrand at the top end: F′(x) = f(x). What is F′(4)?', answer: [37], labels: ['rate of growth (kL/h)'], explanation: 'F′(4) = f(4) = 48 − 16 + 5 = 37 kilolitres per hour: at hour 4 the total grows exactly as fast as the water flows in.' }
  ]
 },
 {
  id: 'q03', title: 'The fair flow', topic: 'Average value of a function', tier: 'Basic', sector: 'Reservoir',
  brief: 'A flushing cycle pushes water through the intake at a changing rate, and the crew wants the one steady rate that would do the same job.',
  lesson: 'The average value of f from a to b is its integral over the interval divided by the length b − a; a continuous f takes that value somewhere in the interval.',
  prompt: 'The intake valve passes water at r(t) = 3t² + 4 litres per second, t seconds into a flushing cycle. Enter the average value of r(t) from t = 1 to t = 4, in litres per second, then the time c in that interval at which r(c) equals that average, in seconds to 2 decimal places.',
  answer: [25, 2.65], labels: ['average value (L/s)', 'time c (s)'], tolerance: 0.005,
  hints: [
   'The average value of a function on an interval is its definite integral over the interval divided by the length of the interval.',
   'For the time, set 3c² + 4 equal to the average and solve for c. Of the two solutions, keep the one between 1 and 4.'
  ],
  solution: 'An antiderivative of r(t) is H(t) = t³ + 4t. H(4) = 1 × 64 + 4 × 4 = 80 and H(1) = 1 × 1 + 4 × 1 = 5, so ∫ from 1 to 4 of r(t) dt = 80 − 5 = 75 litres. The interval lasts 4 − 1 = 3 seconds, so the average value is 75 ÷ 3 = 25 litres per second. Then 3c² + 4 = 25 gives 3c² = 21, so c² = 21 ÷ 3 and c ≈ 2.65 seconds, which lies between 1 and 4.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Flow equaliser', description: 'A valve set to the one steady rate that matches a whole flushing cycle.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'The average of a few numbers is their sum divided by how many there are. A function on an interval has endlessly many values, so we cannot list them, but the integral already adds them up, each weighted by a tiny width. Dividing that total by the length of the interval gives the average value of the function: (1 ÷ (b − a)) × ∫ from a to b of f(x) dx. On a graph it is the height of the rectangle on the same base with the same area as the region under the curve. For a flow rate, it is the steady rate that would pass the same amount of water in the same time. A continuous function cannot jump over its own average: somewhere in the interval it is at or below the average and somewhere at or above it, so at some input c between a and b, f(c) equals the average exactly. This is the Mean Value Theorem for integrals.',
   steps: [
    'Find the definite integral of the function over the interval.',
    'Divide it by the length of the interval, b − a. That is the average value.',
    'To find where the function takes that value, set f(c) equal to the average and solve for c.',
    'Keep only the solution that lies inside the interval.'
   ],
   example: {
    prompt: 'Find the average value of f(x) = 3x² from x = 0 to x = 2, and the c in that interval where f(c) equals it.',
    steps: [
     '∫ from 0 to 2 of 3x² dx = 2³ − 0 = 8.',
     'The interval has length 2, so the average value is 8 ÷ 2 = 4.',
     '3c² = 4 gives c² = 4 ÷ 3, so c ≈ 1.15, which lies between 0 and 2.'
    ],
    answer: 'The average value is 4, taken at c ≈ 1.15.'
   },
   pitfalls: [
    'Averaging the values at the two ends: (f(a) + f(b)) ÷ 2 is the average of two readings, not of the whole function.',
    'Forgetting to divide by the length of the interval, which gives the total instead of the average.',
    'Keeping the negative square root: c must lie inside the interval.'
   ]
  },
  guidance: [
   { prompt: 'An antiderivative of 3t² + 4 is H(t) = t³ + 4t. What is ∫ from 1 to 4 of r(t) dt, in litres?', answer: [75], labels: ['integral (L)'], explanation: 'H(4) = 1 × 64 + 4 × 4 = 80 and H(1) = 1 × 1 + 4 × 1 = 5, so the integral is 80 − 5 = 75 litres.' },
   { prompt: 'Divide the integral by the length of the interval, 4 − 1 = 3 seconds. What is the average value?', answer: [25], labels: ['average value (L/s)'], explanation: '75 ÷ 3 = 25 litres per second. A steady flow at this rate would pass the same water in the same time.' },
   { prompt: 'Solve 3c² + 4 = 25 for the c between 1 and 4, to 2 decimal places.', answer: [2.65], labels: ['time c (s)'], explanation: '3c² = 25 − 4 = 21, so c² = 21 ÷ 3 and the positive square root is c ≈ 2.65 seconds.' }
  ]
 },
 {
  id: 'q04', title: 'Undoing the chain rule', topic: 'Substitution', tier: 'Basic', sector: 'Reservoir',
  brief: 'The mixing tank’s feed follows a formula with one function inside another, and Mira wants the water added without multiplying out the brackets.',
  lesson: 'Substitution undoes the chain rule: with u the inner function and du = u′(x) dx, an integral in x becomes a simpler one in u, with its limits changed to values of u.',
  prompt: 'A mixing tank is fed at r(t) = 6t(t² + 1)² litres per minute, t minutes after the valve opens. Find the water added from t = 0 to t = 2, ∫ from 0 to 2 of r(t) dt, with the substitution u = t² + 1. Enter the new lower limit and the new upper limit in u, then the value of the integral in litres (type it without commas).',
  answer: [1, 5, 124], labels: ['lower limit in u', 'upper limit in u', 'integral (L)'], tolerance: 0.01,
  hints: [
   'With u = t² + 1, du = 2t dt, so the factor 6t dt in the integral is 3 du.',
   'Change the limits with the substitution too: put each end value of t into u = t² + 1. Then the integral is in u alone and you never go back to t.'
  ],
  solution: 'Let u = t² + 1. Then du = 2t dt, so 6t dt = 3 du. At t = 0, u = 0 + 1 = 1; at t = 2, u = 4 + 1 = 5. The integral becomes ∫ from 1 to 5 of 3u² du. An antiderivative of 3u² is u³, so the value is 5³ − 1³ = 125 − 1 = 124 litres.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'Mixing-tank meter', description: 'A total read straight off the new variable, with no brackets multiplied out.' },
  sources: [source.s1_5],
  teaching: {
   intuition: 'The chain rule says the derivative of (x² + 1)³ is 3(x² + 1)² × 2x: the derivative of the outer function, times the derivative of the inner function. So when an integrand looks like an outer function of an inner function, multiplied by the derivative of the inner function, it came from the chain rule, and we can run the rule backwards. Name the inner function u; here u = x² + 1. Its derivative is du/dx = 2x, which we write as du = 2x dx: a small change in x makes a change 2x times as big in u. Now replace every piece: x² + 1 becomes u and 2x dx becomes du, and the integral is in u alone. This is integration by substitution. For a definite integral, change the limits as well. While x runs from its bottom end to its top end, u runs from the inner function at the bottom end to the inner function at the top end. With the new limits you never have to go back to x.',
   steps: [
    'Choose u as the inner function, the part inside the brackets.',
    'Differentiate it: du = u′(x) dx. Check that the rest of the integrand is a number times u′(x) dx.',
    'Change the limits: put the bottom and top values of x into u.',
    'Rewrite the integral in u with the new limits, find an antiderivative in u, and subtract.'
   ],
   example: {
    prompt: 'Evaluate ∫ from 0 to 1 of 3x²(x³ + 1)² dx.',
    steps: [
     'Let u = x³ + 1, so du = 3x² dx.',
     'At x = 0, u = 1; at x = 1, u = 2.',
     'The integral is ∫ from 1 to 2 of u² du = (8 − 1) ÷ 3 = 7 ÷ 3.'
    ],
    answer: '7 ÷ 3, about 2.333.'
   },
   pitfalls: [
    'Changing to u but keeping the old limits in x: the ends must be values of u.',
    'Losing the factor: if du = 2x dx and the integrand has 6x dx, that is 3 du, not du.',
    'Putting u in for the inner function but leaving an x behind: every x must go before you integrate.'
   ]
  },
  guidance: [
   { prompt: 'With u = t² + 1, what is u at t = 0, and what is u at t = 2?', answer: [1, 5], labels: ['lower limit in u', 'upper limit in u'], explanation: 'At t = 0, u = 0 + 1 = 1. At t = 2, u = 4 + 1 = 5. These are the new limits.' },
   { prompt: 'du = 2t dt. The integral has 6t dt in it, which is k du for which number k?', answer: [3], labels: ['k'], explanation: '6t dt = 3 × 2t dt = 3 du, so the integral becomes ∫ from 1 to 5 of 3u² du.' },
   { prompt: 'An antiderivative of 3u² is u³. What is ∫ from 1 to 5 of 3u² du?', answer: [124], labels: ['integral (L)'], explanation: '5³ − 1³ = 125 − 1 = 124 litres.' }
  ]
 },
 {
  id: 'q05', title: 'Two feed lines', topic: 'Integrals that give ln|x| and eˣ', tier: 'Basic', sector: 'Reservoir',
  brief: 'One feed line slows down as its pressure falls and the other fades away, and the log needs the litres each one delivered.',
  lesson: 'An antiderivative of 1 ÷ x is ln|x|, and eˣ is its own antiderivative; with the chain rule, k ÷ (x + c) gives k ln|x + c| and e^(−x) gives −e^(−x).',
  prompt: 'Two feed lines fill the settling tank. Line A delivers 5 ÷ (t + 2) litres per minute and line B delivers 8e^(−t) litres per minute, t minutes after the valves open. Enter the litres delivered by line A from t = 0 to t = 4, then the litres delivered by line B over the same time, both to 3 decimal places.',
  answer: [5.493, 7.853], labels: ['line A (L)', 'line B (L)'], tolerance: 0.0005,
  hints: [
   'An antiderivative of 1 ÷ (t + 2) is ln|t + 2|: by the chain rule its derivative is 1 ÷ (t + 2).',
   'An antiderivative of e^(−t) is −e^(−t), because the chain rule makes the derivative of −e^(−t) equal to e^(−t). Keep every digit on the calculator and round only at the end.'
  ],
  solution: 'Line A: an antiderivative of 5 ÷ (t + 2) is 5 ln|t + 2|, so the litres delivered are 5 ln 6 − 5 ln 2 = 5 ln(6 ÷ 2) ≈ 5.493. Line B: an antiderivative of 8e^(−t) is −8e^(−t), so the litres delivered are −8e^(−4) − (−8e⁰) = 8 − 8e^(−4) ≈ 7.853.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Feed-line ledger', description: 'Litres from a slowing line and a fading line, each to the millilitre.' },
  sources: [source.s1_6],
  teaching: {
   intuition: 'The power rule reverses for every power but one. An antiderivative of xⁿ is xⁿ⁺¹ ÷ (n + 1), but for n = −1, that is for 1 ÷ x, it would divide by zero. The natural logarithm fills the gap: the derivative of ln x is 1 ÷ x, so ln x is an antiderivative of 1 ÷ x where x is positive. 1 ÷ x also has values for negative x, where ln x has none, and there ln(−x) does the job, because by the chain rule its derivative is (1 ÷ (−x)) × (−1) = 1 ÷ x. Both cases are written together as ln|x|, where |x| is the absolute value of x: x without its sign. The other function to know is eˣ, which is its own derivative and so its own antiderivative. With the chain rule, 1 ÷ (x + c) has antiderivative ln|x + c|, and e^(−x) has antiderivative −e^(−x), because differentiating −e^(−x) gives back e^(−x). Values of ln and e are not whole numbers, so these answers are rounded: keep every digit until the end.',
   steps: [
    'Match each piece of the integrand to a form you know: a number over (x + c), or a number times e^(−x) or eˣ.',
    'Write its antiderivative: k ln|x + c| for k ÷ (x + c), and −k e^(−x) for k e^(−x).',
    'Evaluate at the top end and at the bottom end and subtract; ln p − ln q can be written ln(p ÷ q).',
    'Round only the final answer, to the places asked for.'
   ],
   example: {
    prompt: 'Evaluate ∫ from 2 to 6 of 3 ÷ x dx and ∫ from 0 to 1 of 4e^(−x) dx, to 3 decimal places.',
    steps: [
     '3 ln 6 − 3 ln 2 = 3 ln 3 ≈ 3.296.',
     'An antiderivative of 4e^(−x) is −4e^(−x), so the second is −4e^(−1) − (−4) ≈ 2.528.'
    ],
    answer: 'About 3.296 and 2.528.'
   },
   pitfalls: [
    'Using the power rule on 1 ÷ x: it would divide by zero, so the antiderivative is ln|x| instead.',
    'Losing the minus sign: an antiderivative of e^(−x) is −e^(−x), not e^(−x).',
    'Forgetting that e⁰ = 1 at the bottom end, or rounding the pieces before subtracting.'
   ]
  },
  guidance: [
   { prompt: 'Line A: ∫ from 0 to 4 of 5 ÷ (t + 2) dt = 5 ln 6 − 5 ln 2. What is that to 3 decimal places?', answer: [5.493], labels: ['line A (L)'], explanation: '5 ln 6 − 5 ln 2 = 5 ln(6 ÷ 2) ≈ 5.493 litres.' },
   { prompt: 'Line B: an antiderivative of 8e^(−t) is −8e^(−t). What is its value at t = 0?', answer: [-8], labels: ['value at t = 0'], explanation: 'e⁰ = 1, so −8e⁰ = −8.' },
   { prompt: 'Subtract: −8e^(−4) − (−8). What is that to 3 decimal places?', answer: [7.853], labels: ['line B (L)'], explanation: '−8e^(−4) + 8 = 8(1 − e^(−4)) ≈ 7.853 litres.' }
  ]
 },
 {
  id: 'q06', title: 'Tracking the drifting float', topic: 'Integrals that give arctan and arcsin', tier: 'Basic', sector: 'Reservoir',
  brief: 'A camera on the bank must follow a float down the channel, and its motor controller needs the total angle it will turn.',
  lesson: 'An antiderivative of 1 ÷ (1 + x²) is arctan x and of 1 ÷ √(1 − x²) is arcsin x; with u = x ÷ a, 1 ÷ (a² + x²) gives (1 ÷ a) arctan(x ÷ a) and 1 ÷ √(a² − x²) gives arcsin(x ÷ a).',
  prompt: 'A camera on the reservoir bank sits 4 metres from a straight channel and follows a float that drifts along the channel at 1 metre per second, starting level with the camera. The camera turns at 4 ÷ (16 + t²) radians per second, t seconds later. Enter the angle it turns through from t = 0 to t = 6, in radians. Its calibration also needs ∫ from 0 to 3 of 1 ÷ √(25 − x²) dx: enter that value next. Give both to 3 decimal places.',
  answer: [0.983, 0.644], labels: ['angle turned (rad)', 'calibration value'], tolerance: 0.0005,
  hints: [
   'Write 16 + t² as 16(1 + (t ÷ 4)²) and substitute u = t ÷ 4. An antiderivative of 1 ÷ (1 + u²) is arctan u.',
   'An antiderivative of 1 ÷ √(25 − x²) is arcsin(x ÷ 5). Set your calculator to radians.'
  ],
  solution: 'With u = t ÷ 4, du = dt ÷ 4 and 4 ÷ (16 + t²) dt = du ÷ (1 + u²). The limits become u = 0 and u = 6 ÷ 4 = 1.5, so the angle is arctan 1.5 − arctan 0 = arctan 1.5 ≈ 0.983 radians. For the calibration, an antiderivative of 1 ÷ √(25 − x²) is arcsin(x ÷ 5), so the value is arcsin(3 ÷ 5) − arcsin 0 = arcsin 0.6 ≈ 0.644 radians.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Camera turn table', description: 'The angle a tracking camera sweeps, worked out from its rate of turning.' },
  sources: [source.s1_7],
  teaching: {
   intuition: 'Some integrals give angles. The tangent of an angle θ is tan θ = sin θ ÷ cos θ. The inverse tangent, arctan x, undoes it: it is the angle between −π ÷ 2 and π ÷ 2 whose tangent is x. In the same way arcsin x is the angle between −π ÷ 2 and π ÷ 2 whose sine is x, for x from −1 to 1. These angles are in radians, as always in calculus. Their derivatives are not trigonometric at all: the derivative of arctan x is 1 ÷ (1 + x²), and the derivative of arcsin x is 1 ÷ √(1 − x²). You can check the first by implicit differentiation: if y = arctan x then tan y = x, and differentiating gives (1 + tan² y) × dy/dx = 1, so dy/dx = 1 ÷ (1 + x²). Read backwards, these are two new antiderivatives. When the number is not 1, as in 1 ÷ (a² + x²), take a² out and substitute u = x ÷ a; this gives (1 ÷ a) arctan(x ÷ a). A camera a metres from a straight channel, following a float that moves at 1 metre per second, points at the angle arctan(t ÷ a), so it turns at the rate a ÷ (a² + t²).',
   steps: [
    'Spot the form: a number squared plus x², or the square root of a number squared minus x².',
    'Take the number out, as in a² + x² = a²(1 + (x ÷ a)²), and substitute u = x ÷ a, which also changes the limits.',
    'Use arctan u for 1 ÷ (1 + u²), and arcsin u for 1 ÷ √(1 − u²).',
    'Subtract the values at the two ends, with your calculator in radians; arctan 0 = arcsin 0 = 0.'
   ],
   example: {
    prompt: 'Evaluate ∫ from 0 to 3 of 1 ÷ (9 + x²) dx and ∫ from 0 to 1 of 1 ÷ √(4 − x²) dx, in radians to 3 decimal places.',
    steps: [
     'With u = x ÷ 3, the first becomes (1 ÷ 3) ∫ from 0 to 1 of 1 ÷ (1 + u²) du = (1 ÷ 3) arctan 1 ≈ 0.262.',
     'The second is arcsin(1 ÷ 2) − arcsin 0 = π ÷ 6 ≈ 0.524.'
    ],
    answer: 'About 0.262 and 0.524 radians.'
   },
   pitfalls: [
    'Leaving the calculator in degrees: arctan 1 is about 0.785 radians, not 45.',
    'Dropping the 1 ÷ a: ∫ of 1 ÷ (a² + x²) dx is (1 ÷ a) arctan(x ÷ a), not arctan(x ÷ a). In this mission the a on top of the rate cancels it.',
    'Mixing up the two forms: a sum with no root gives arctan, a difference under a square root gives arcsin.'
   ]
  },
  guidance: [
   { prompt: 'Substitute u = t ÷ 4. What is the new upper limit of the integral in u?', answer: [1.5], labels: ['upper limit in u'], explanation: 'At t = 6, u = 6 ÷ 4 = 1.5. The integral becomes ∫ from 0 to 1.5 of 1 ÷ (1 + u²) du.' },
   { prompt: 'An antiderivative of 1 ÷ (1 + u²) is arctan u. What is arctan 1.5 − arctan 0, in radians to 3 decimal places?', answer: [0.983], labels: ['angle turned (rad)'], explanation: 'arctan 0 = 0, so the angle is arctan 1.5 ≈ 0.983 radians.' },
   { prompt: 'An antiderivative of 1 ÷ √(25 − x²) is arcsin(x ÷ 5). What is arcsin(3 ÷ 5) − arcsin 0, to 3 decimal places?', answer: [0.644], labels: ['calibration value'], explanation: '3 ÷ 5 = 0.6 and arcsin 0 = 0, so the value is arcsin 0.6 ≈ 0.644 radians.' }
  ]
 },
 {
  id: 'q07', title: 'Cutting the bow plate', topic: 'Area between two curves', tier: 'Basic', sector: 'Hull Foundry',
  brief: 'The foundry has to cut a hull plate whose outline is a straight edge and a curve, and the steel order needs its area.',
  lesson: 'The area between two curves is the integral, between the points where they meet, of the top curve minus the bottom curve.',
  prompt: 'The hull foundry cuts a plate between the straight edge y = 4x + 10 and the curve y = 3x² − 2x + 1, with x and y in metres. Enter the two x-values where the edge meets the curve, smaller first, then the area of the plate in square metres.',
  answer: [-1, 3, 32], labels: ['left crossing x', 'right crossing x', 'area (m²)'], tolerance: 0.01,
  hints: [
   'Set the two formulas equal and move every term to one side. The quadratic you get factorises.',
   'Between the crossing points the edge is above the curve. The area is the integral of (top − bottom), the edge minus the curve, from the smaller crossing to the larger.'
  ],
  solution: 'Setting 4x + 10 = 3x² − 2x + 1 and moving every term to one side gives 3x² − 6x − 9 = 0, which is 3(x + 1)(x − 3) = 0, so the edge meets the curve at x = −1 and x = 3. Between them the edge is on top, and edge minus curve is −3x² + 6x + 9. An antiderivative is P(x) = −x³ + 3x² + 9x. P(3) = 27 and P(−1) = −5, so the area is 27 − (−5) = 32 square metres.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Bow plate template', description: 'A steel outline traced between a straight edge and a curve.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'A definite integral gives the signed area between one curve and the x-axis. For the region between two curves, slice it into thin vertical strips. A strip at position x reaches from the lower curve up to the upper one, so its height is top minus bottom, f(x) − g(x), and its area is about (f(x) − g(x)) times its width. Adding the strips and letting them get thinner gives the area between curves: ∫ from a to b of (f(x) − g(x)) dx, where f is the top curve and g the bottom one. When the curves themselves close the region off, the ends a and b are the x-values at which they meet, found by setting the two formulas equal. Because we subtract bottom from top, it does not matter whether the curves lie above or below the x-axis: the difference is the height of the strip either way.',
   steps: [
    'Set the two formulas equal and solve: the solutions are the x-values where the curves meet, the ends of the region.',
    'Find which curve is on top between them, for example by trying one x-value in between.',
    'Write top minus bottom as one polynomial and find an antiderivative of it.',
    'Take the antiderivative at the right end minus its value at the left end. The result is the area.'
   ],
   example: {
    prompt: 'Find the area between the line y = x + 2 and the curve y = x².',
    steps: [
     'x² = x + 2 gives (x + 1)(x − 2) = 0, so the ends are x = −1 and x = 2.',
     'At x = 0 the line is at 2 and the curve at 0, so the line is on top; top minus bottom is −x² + x + 2.',
     'An antiderivative is −x³ ÷ 3 + x² ÷ 2 + 2x, which is 10 ÷ 3 at x = 2 and −7 ÷ 6 at x = −1, so the area is 10 ÷ 3 + 7 ÷ 6 = 4.5.'
    ],
    answer: 'The area is 4.5 square units.'
   },
   pitfalls: [
    'Subtracting the wrong way round: bottom minus top gives the right size with a minus sign.',
    'Integrating between the wrong ends: the ends are where the curves meet each other, not where they cross the x-axis.',
    'Taking the area under the top curve alone, which also counts the part below the bottom curve.'
   ]
  },
  guidance: [
   { prompt: 'Solve 4x + 10 = 3x² − 2x + 1. At which two x-values do the edge and the curve meet? Smaller first.', answer: [-1, 3], labels: ['left crossing x', 'right crossing x'], explanation: 'Moving every term to one side gives 3x² − 6x − 9 = 0, which factorises as 3(x + 1)(x − 3) = 0: x = −1 or x = 3.' },
   { prompt: 'Edge minus curve is −3x² + 6x + 9, and an antiderivative is P(x) = −x³ + 3x² + 9x. What are P(−1) and P(3)?', answer: [-5, 27], labels: ['P at the left crossing', 'P at the right crossing'], explanation: 'Putting the two crossings into P(x) gives P(−1) = −5 and P(3) = 27.' },
   { prompt: 'What is the area of the plate, P(3) − P(−1), in square metres?', answer: [32], labels: ['area (m²)'], explanation: '27 − (−5) = 32 square metres. It is positive because the edge stays above the curve between the crossings.' }
  ]
 },
 {
  id: 'q08', title: 'The sideways fin', topic: 'Slicing along y', tier: 'Basic', sector: 'Hull Foundry',
  brief: 'The next cooling fin lies on its side, bounded by a curve that opens to the right, and Mira wants its area without cutting it into pieces.',
  lesson: 'When a region is bounded on the left and right by curves written as x in terms of y, slice it into horizontal strips: the area is the integral with respect to y of right minus left.',
  prompt: 'The foundry cuts a cooling fin from the flat region between the curve x = 6y² and the straight edge x = −6y + 12, in metres. Slice it along y into horizontal strips and enter the area of the fin in square metres.',
  answer: [27], labels: ['area (m²)'], tolerance: 0.01,
  hints: [
   'Each horizontal strip runs from the curve on the left to the edge on the right, so its length is (right − left), the edge minus the curve, written in y.',
   'Set 6y² equal to −6y + 12 to find the y-values where the strips start and stop, then integrate the strip length between them with respect to y.'
  ],
  solution: 'Setting 6y² = −6y + 12 gives 6y² + 6y − 12 = 0, which is 6(y + 2)(y − 1) = 0, so the curve and the edge meet at y = −2 and y = 1. Each horizontal strip between them runs from x = 6y² on the left to x = −6y + 12 on the right, so its length is −6y² − 6y + 12. An antiderivative is P(y) = −2y³ − 3y² + 12y. P(1) = 7 and P(−2) = −20, so the area is 7 − (−20) = 27 square metres.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'Fin pattern', description: 'A sideways outline measured strip by strip from left to right.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'Vertical strips work well when one curve is on top and another at the bottom all the way across. Sometimes the curves swap places: the boundary under the strips is one curve over part of the region and another curve over the rest. Then vertical strips force you to split the region into pieces and add their areas. Take the region between x = y² and the line x = y + 2. In vertical strips, the bottom edge is the lower half of the curve for x from 0 to 1, but the line for x from 1 to 4. Turned on its side, the picture is simple: every horizontal strip runs from the curve on the left to the line on the right. A horizontal strip at height y has length right minus left and thickness a tiny step in y, so the area is ∫ from c to d of (right − left) dy, where c and d are the heights at which the curves meet. Everything is written in y, and the region needs only one integral.',
   steps: [
    'Write both boundaries as x in terms of y, if they are not already.',
    'Set them equal and solve for y: the solutions are the lowest and highest heights of the region.',
    'Find which boundary is on the right; the strip length is right minus left.',
    'Integrate the strip length with respect to y between the two heights.'
   ],
   example: {
    prompt: 'Find the area between the curve x = y² and the line x = y + 2.',
    steps: [
     'y² = y + 2 gives (y + 1)(y − 2) = 0, so the heights run from y = −1 to y = 2.',
     'At y = 0 the line is at x = 2 and the curve at x = 0, so the line is on the right; the strip length is −y² + y + 2.',
     'The integral from −1 to 2 is 10 ÷ 3 − (−7 ÷ 6) = 4.5.'
    ],
    answer: 'The area is 4.5 square units, from one integral instead of two.'
   },
   pitfalls: [
    'Integrating with respect to y but using x-values as the limits: the limits are heights.',
    'Taking left minus right, which gives the area with a minus sign.',
    'Using vertical strips without splitting the region where the bottom boundary changes: one integral then gives the wrong area.'
   ]
  },
  guidance: [
   { prompt: 'Solve 6y² = −6y + 12. At which two y-values do the curve and the edge meet? Lower first.', answer: [-2, 1], labels: ['lower height y', 'upper height y'], explanation: '6y² + 6y − 12 = 0 factorises as 6(y + 2)(y − 1) = 0, so y = −2 or y = 1.' },
   { prompt: 'A strip at height y runs from x = 6y² to x = −6y + 12, so its length is −6y² − 6y + 12, with antiderivative P(y) = −2y³ − 3y² + 12y. What are P(−2) and P(1)?', answer: [-20, 7], labels: ['P at the lower height', 'P at the upper height'], explanation: 'Putting the two heights into P(y) gives P(−2) = −20 and P(1) = 7.' },
   { prompt: 'What is the area of the fin, P(1) − P(−2), in square metres?', answer: [27], labels: ['area (m²)'], explanation: '7 − (−20) = 27 square metres.' }
  ]
 },
 {
  id: 'q09', title: 'Casting the hull rib', topic: 'Volume by slicing', tier: 'Basic', sector: 'Hull Foundry',
  brief: 'A hull rib is cast in a mould whose slices all have the same shape but grow along its length, and the foundry needs to know how much metal to melt.',
  lesson: 'If every cross-section of a solid perpendicular to the x-axis has area A(x), the volume of the solid is the integral of A(x) along its length.',
  prompt: 'A casting for a hull rib stands on the floor region bounded by the x-axis, the line x = 5 and the curve y = 2√x, in metres. Every cross-section perpendicular to the x-axis is a square standing on the floor, with one side running across the base. Enter the area of the cross-section at x = 5 in square metres, then the volume of the casting in cubic metres.',
  answer: [20, 50], labels: ['end slice area (m²)', 'volume (m³)'], tolerance: 0.005,
  hints: [
   'At position x, the side across the base runs from the x-axis up to the curve, so its length is the height of the curve there.',
   'The slice is a square, so its area A(x) is that length squared. The volume is the integral of A(x) from 0 to the end of the base.'
  ],
  solution: 'At position x the base is 2√x metres across, so the cross-section has area A(x) = (2√x)² = 4x square metres. At x = 5 that is 4 × 5 = 20 square metres. The volume is ∫ from 0 to 5 of 4x dx = 2 × 5² − 0 = 2 × 25 = 50 cubic metres.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'Rib mould', description: 'A casting measured slice by slice from its narrow tip to its broad end.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'A loaf of bread is a pile of thin slices. Its volume is the sum of the volumes of the slices, and each slice is about its face area times its thickness. Any solid can be cut the same way. Cut it perpendicular to the x-axis: the face you see at position x is called a cross-section, and its area is A(x). A slice of thickness Δx has volume about A(x) × Δx, and adding the slices and letting them get thinner turns the sum into an integral: V = ∫ from a to b of A(x) dx. This is the move that turned strips into areas, one dimension up. The work is in finding A(x). When the solid stands on a flat region and every cross-section is a known shape, such as a square or a triangle, its size is set by the width of the region at x, so A(x) follows from the area formula for that shape.',
   steps: [
    'Find the width of the base at position x: the distance across the base along the slice.',
    'Use the shape of the cross-section to write its area A(x) from that width: the width squared for a square, half of it for a triangle as tall as it is wide.',
    'Integrate A(x) from one end of the solid to the other.',
    'Give the unit: square metres times metres is cubic metres.'
   ],
   example: {
    prompt: 'A solid stands on the region between the x-axis, the line y = x and the line x = 3. Every cross-section perpendicular to the x-axis is a square. Find its volume.',
    steps: [
     'At position x the base is x across, so A(x) = x².',
     'V = ∫ from 0 to 3 of x² dx = 27 ÷ 3 = 9.'
    ],
    answer: 'The volume is 9 cubic units.'
   },
   pitfalls: [
    'Using the width itself as the area: a square of side w has area w², not w.',
    'Forgetting the half for a triangle: its area is half the base times the height.',
    'Integrating along the wrong axis: the slices are perpendicular to the x-axis, so integrate with respect to x.'
   ]
  },
  guidance: [
   { prompt: 'The cross-section at position x has area A(x) = cx. What is c?', answer: [4], labels: ['c'], explanation: 'The side across the base is 2√x, so A(x) = (2√x)² = 4x: c = 4.' },
   { prompt: 'What is the area of the cross-section at x = 5?', answer: [20], labels: ['end slice area (m²)'], explanation: 'A(5) = 4 × 5 = 20 square metres.' },
   { prompt: 'The volume is ∫ from 0 to 5 of 4x dx. What is it, in cubic metres?', answer: [50], labels: ['volume (m³)'], explanation: 'An antiderivative of 4x is 2x², so the volume is 2 × 25 = 50 cubic metres.' }
  ]
 },
 {
  id: 'q10', title: 'Spinning the nozzle', topic: 'Discs and washers', tier: 'Basic', sector: 'Hull Foundry',
  brief: 'The foundry turns a flat template on a spindle to shape a nozzle, and Mira needs the volume of metal the spinning shape sweeps out.',
  lesson: 'Spinning a region about an axis gives a solid of revolution; its slices across the axis are discs of area πR², or washers of area π(R² − r²) when there is a hole, and the volume is their integral.',
  prompt: 'The foundry spins the flat region between the line y = 2x and the curve y = x² (in metres) about the x-axis to make a nozzle. Enter the x-value where the line and the curve meet away from the origin, then the volume of the nozzle as k·π cubic metres: enter k (a fraction such as 7/15 is fine, or a decimal to 4 places).',
  answer: [2, 4.266666666666667], labels: ['upper limit', 'k'], tolerance: 0.00005,
  hints: [
   'A slice across the x-axis is a washer: a disc of radius R with a disc of radius r cut out of its middle, so its area is π(R² − r²).',
   'Between the crossings the line is higher, so R = 2x and r = x². Integrate π(R² − r²) from 0 to the crossing.'
  ],
  solution: '2x = x² at x = 0 and x = 2. On that interval the outer radius is R = 2x and the inner radius is r = x², so each washer has area π(4x² − x⁴). The volume is π ∫ from 0 to 2 of (4x² − x⁴) dx = π(32/3 − 32/5) = (64/15)π cubic metres, so k = 64/15.',
  xp: 100, prereqs: ['q09'],
  artifact: { name: 'Spun nozzle', description: 'A round shape turned from a flat template, its volume counted in washers.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'Spin a flat region about a line and it sweeps out a solid of revolution, the way a potter’s wheel turns a profile into a pot. Slice that solid across the axis of spinning and every slice is round. If the region touches the axis, the slice is a disc, a filled circle whose radius R is the distance from the axis to the edge of the region, so its area is πR². If the region stands away from the axis, the slice is a washer: a disc with a smaller disc cut out of its middle, like the flat metal ring under a bolt. Its outer radius R reaches the far edge of the region and its inner radius r the near edge, so its area is π(R² − r²). Volume by slicing does the rest: integrate π(R² − r²) along the axis. About the x-axis the radii are heights, functions of x. About the y-axis they are sideways distances, so write each boundary as x in terms of y and integrate with respect to y. These volumes are multiples of π, so we ask for the number k in k·π.',
   steps: [
    'Find where the boundaries meet: these give the ends of the integral along the axis.',
    'Find the outer radius R and the inner radius r of a slice, as distances from the axis; r is 0 for a disc.',
    'Integrate π(R² − r²) along the axis between the ends.',
    'Write the volume as k·π and read off k.'
   ],
   example: {
    prompt: 'Spin the region under y = x² from x = 0 to x = 2 about the x-axis. Find its volume as k·π.',
    steps: [
     'The region touches the axis, so each slice is a disc of radius R = x², with area πx⁴.',
     'V = π ∫ from 0 to 2 of x⁴ dx = π × 32 ÷ 5.'
    ],
    answer: 'k = 32 ÷ 5 = 6.4.'
   },
   pitfalls: [
    'Squaring the difference instead of taking the difference of squares: a washer has area π(R² − r²), not π(R − r)².',
    'Measuring radii from the wrong axis: about the y-axis a radius is a sideways distance, so write the curves as x in terms of y.',
    'Leaving π inside k: the answer asks only for the number in front of π.'
   ]
  },
  guidance: [
   { prompt: 'Solve 2x = x². What is the solution other than x = 0?', answer: [2], labels: ['upper limit'], explanation: 'x² − 2x = x(x − 2) is 0 at x = 0 and x = 2.' },
   { prompt: 'The washer area is π(4x² − x⁴). What is ∫ from 0 to 2 of 4x² dx? A fraction is fine.', answer: [10.666666666666666], labels: ['first integral'], explanation: 'An antiderivative is 4x³ ÷ 3, which at x = 2 is 32/3.' },
   { prompt: '∫ from 0 to 2 of x⁴ dx = 32/5. What is k, the number in front of π in the volume?', answer: [4.266666666666667], labels: ['k'], explanation: 'k = 32/3 − 32/5 = 64/15.' }
  ]
 }
);
})();
