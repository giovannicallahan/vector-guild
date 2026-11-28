/* Real analysis missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/real/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 The Riemann integral · Advanced, 200 XP · sector 'Fuel Audit' · Refining until the sums meet [5.1]
     q32  ch 6 The Riemann integral · Advanced, 200 XP · sector 'Fuel Audit' · Properties of the integral: additivity and bounds [5.2]
     q33  ch 6 The Riemann integral · Advanced, 200 XP · sector 'Fuel Audit' · The fundamental theorem made precise [5.3]
     q34  ch 6 The Riemann integral · Advanced, 200 XP · sector 'Fuel Audit' · Improper integrals and integral-test bounds [5.5]
     q35  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Pointwise convergence [6.1]
     q36  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Uniform convergence and the uniform norm [6.1]
     q37  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Interchange of limits and the Weierstrass M-test [6.2, 11.2]
     q38  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Power series converge uniformly inside the radius [6.2]
     q39  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Metric spaces: distances and open balls [7.1]
     q40  ch 7 Sequences of functions · Advanced, 200 XP · sector 'Simulation Hall' · Realm review and bridge to Complex analysis [6.2, 7.1] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis I & II: Introduction to Real Analysis sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Lebl, Basic Analysis/ (Lebl, Basic Analysis).
   A title reads like: Lebl, Basic Analysis — 2.4 Cauchy sequences
   Link to the section page itself: https://www.jirka.org/ra/html/<file>.html */
const source = {
 s5_1: {"title":"Lebl, Basic Analysis — 5.1 The Riemann integral","url":"https://www.jirka.org/ra/html/sec_rint.html","description":"Lower and upper sums, refinements, the definition of Riemann integrable, the test that U − L can be made smaller than any ε, and an example with equal pieces.","verified":"2026-11-28"},
 s5_2: {"title":"Lebl, Basic Analysis — 5.2 Properties of the integral","url":"https://www.jirka.org/ra/html/sec_rintprop.html","description":"Additivity over adjoining intervals and monotonicity of the integral (f ≤ g gives a smaller integral).","verified":"2026-11-28"},
 s5_3: {"title":"Lebl, Basic Analysis — 5.3 Fundamental theorem of calculus","url":"https://www.jirka.org/ra/html/sec_ftc.html","description":"F(x) = ∫ from a to x of f is continuous, and differentiable with F′(c) = f(c) where f is continuous; a step function whose F has a corner.","verified":"2026-11-28"},
 s5_5: {"title":"Lebl, Basic Analysis — 5.5 Improper integrals","url":"https://www.jirka.org/ra/html/sec_impropriemann.html","description":"Integrals to infinity, the p-test for 1 ÷ xᵖ, and the integral test with bounds on the tail of a series.","verified":"2026-11-28"},
 s6_1: {"title":"Lebl, Basic Analysis — 6.1 Pointwise and uniform convergence","url":"https://www.jirka.org/ra/html/sec_puconv.html","description":"Pointwise convergence (N may depend on x), uniform convergence (one N for all x) and the uniform norm.","verified":"2026-11-28"},
 s6_2: {"title":"Lebl, Basic Analysis — 6.2 Interchange of limits","url":"https://www.jirka.org/ra/html/sec_liminter.html","description":"Uniform limits keep continuity and let a limit pass through an integral; power series converge uniformly on closed intervals inside the radius.","verified":"2026-11-28"},
 s11_2: {"title":"Lebl, Basic Analysis — 11.2 Swapping limits","url":"https://www.jirka.org/ra/html/sec_swaplim.html","description":"The Weierstrass M-test, and integrating a uniformly convergent series term by term.","verified":"2026-11-28"},
 s7_1: {"title":"Lebl, Basic Analysis — 7.1 Metric spaces","url":"https://www.jirka.org/ra/html/sec_metric.html","description":"The definition of a metric and a metric space, the euclidean metric, the complex numbers as the plane, and the discrete metric. The taxicab and maximum metrics and the open ball B(x, ρ) are not stated in this section; they are worked out in these missions.","verified":"2026-11-28"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "Squeezing the fuel-line total", topic: "Refining until the sums meet", tier: 'Advanced', sector: 'Fuel Audit',
  brief: "The auditors will only sign the fuel-line total if the lower and upper sums can be pushed as close together as anyone asks.",
  lesson: "f is Riemann integrable when U − L can be made smaller than any ε by a fine enough partition; for monotone f on equal pieces, U − L = |f(b) − f(a)|(b − a) ÷ n.",
  prompt: "A fuel line at the audit delivers fuel at the rate f(x) = x² litres per hour over the hours x from 1 to 3. Split [1, 3] into n equal pieces and compare the lower sum L and the upper sum U of f for that partition. Enter U − L for 10 equal pieces, then the smallest number n of equal pieces for which U − L < 0.03 (type it without commas).",
  answer: [1.6,534], labels: ["U − L","smallest n"], tolerance: 0.0005,
  hints: [
   "f is monotone, so on each piece its smallest and largest values sit at the two ends. Add up (largest − smallest) × width: the inside values cancel, leaving (difference of the end values) × (width of one piece).",
   "U − L for n equal pieces is a fixed number divided by n. Solve “that number ÷ n < the tolerance” for n; the inequality is strict, so when the division comes out whole, the smallest n is one more."
  ],
  solution: "f(x) = x² is increasing on [1, 3], so on each piece the largest value is at the right end and the smallest at the left end. In U − L every inside value appears once with a plus sign and once with a minus sign, so only the end values survive: U − L = |f(3) − f(1)| × (3 − 1) ÷ n = 8 × 2 ÷ n = 16 ÷ n. For 10 pieces of width 0.2, U − L = 8 × 0.2 = 1.6. U − L < 0.03 means n > 16 ÷ 0.03 = about 533.33, so the smallest n is 534.",
  xp: 200, prereqs: ["q30"],
  artifact: {"name":"Squeeze certificate","description":"Lower and upper sums that close in until they agree to any tolerance."},
  sources: [source.s5_1],
  teaching: {
   intuition: "A lower sum L can only be too small and an upper sum U can only be too large, so the true total sits between them. If we can choose a partition making U − L smaller than any ε someone names, there is room for just one number between all the lower sums and all the upper sums. Then f is called Riemann integrable, and that one number is its integral. For a monotone function on equal pieces the gap is easy to see: on each piece the largest value and the smallest value sit at the two ends, so U − L is the sum of (value at one end − value at the other end) × width. Each inside value is added once and taken away once, and only the two outer values survive. So U − L = |f(b) − f(a)| × (b − a) ÷ n, which shrinks to 0 as the number of pieces n grows.",
   steps: [
    "Check that f is monotone (increasing or decreasing) on [a, b], so each piece’s largest and smallest values are at its ends.",
    "Work out the difference of the end values, |f(b) − f(a)|, and the width of one piece, (b − a) ÷ n.",
    "Multiply them: U − L = |f(b) − f(a)| × (b − a) ÷ n.",
    "To meet a tolerance ε, solve |f(b) − f(a)|(b − a) ÷ n < ε for n. The inequality is strict: if the division gives a whole number, the smallest n is one more."
   ],
   example: {
    prompt: "f(x) = x² on [0, 2]. Find U − L for 4 equal pieces, and the smallest n with U − L < 0.1.",
    steps: [
     "f is increasing on [0, 2], and f(2) − f(0) = 4, so U − L = 4 × 2 ÷ n = 8 ÷ n.",
     "For 4 pieces, U − L = 8 ÷ 4 = 2.",
     "8 ÷ n < 0.1 means n > 80. n = 80 gives exactly 0.1, which is not smaller, so n = 81."
    ],
    answer: "U − L = 2 for 4 pieces; the smallest n is 81."
   },
   pitfalls: [
    "Taking n = 80 when 8 ÷ n < 0.1 needs n > 80. A strict inequality never accepts the boundary value.",
    "Using the right ends for U on a decreasing function. When f decreases, its largest value on each piece is at the left end.",
    "Forgetting the width. U − L is the difference of end values times the width of one piece, not the difference alone."
   ]
  },
  guidance: [
   { prompt: "f(x) = x² is increasing on [1, 3]. After the inside values cancel, U − L is |f(3) − f(1)| times the width of one piece. What is |f(3) − f(1)|?", answer: [8], labels: ["|f(b) − f(a)|"], explanation: "f(1) = 1 and f(3) = 9, so the difference of the end values is 8." },
   { prompt: "With 10 equal pieces each piece has width (3 − 1) ÷ 10 = 0.2. What is U − L?", answer: [1.6], labels: ["U − L"], explanation: "U − L = 8 × 0.2 = 1.6." },
   { prompt: "For n equal pieces U − L = 16 ÷ n. What is the smallest n with 16 ÷ n < 0.03?", answer: [534], labels: ["smallest n"], explanation: "16 ÷ n < 0.03 means n > 16 ÷ 0.03 = about 533.33. The smallest whole number strictly above it is 534." }
  ]
 },
 {
  id: 'q32', title: "Splitting the shift’s fuel bill", topic: "Properties of the integral: additivity and bounds", tier: 'Advanced', sector: 'Fuel Audit',
  brief: "The meter certified two totals for a pump, and the audit needs the fuel for the second part of the shift, checked against hard bounds.",
  lesson: "Integrals add over adjoining intervals, and m ≤ f ≤ M on [a, b] gives m(b − a) ≤ ∫ from a to b of f ≤ M(b − a).",
  prompt: "A pump at the fuel audit draws fuel at the rate f(t) = t² − 8t + 18 litres per hour, t hours into a shift. The meter certifies that the integral of f from 0 to 6 is 36 litres and the integral of f from 0 to 3 is 27 litres. Enter the integral of f from 3 to 6, then the lower bound m × (6 − 3) and the upper bound M × (6 − 3), where m and M are the smallest and largest values of f on [3, 6].",
  answer: [9,6,18], labels: ["fuel from the middle time to the end (litres)","lower bound (litres)","upper bound (litres)"], tolerance: 0.01,
  hints: [
   "Additivity: the integral over a whole interval is the integral over its first part plus the integral over the rest.",
   "Write f as (t − h)² plus a constant. Its lowest point is t = h; on an interval that misses h, the smallest value is at the end nearer h, and the largest value is always at an end."
  ],
  solution: "By additivity, the integral from 0 to 6 is the integral from 0 to 3 plus the integral from 3 to 6, so the piece is 36 − 27 = 9 litres. f(t) = (t − 4)² + 2, so f(3) = 3 and f(6) = 6. The lowest point t = 4 lies in [3, 6], so m = 2, and M = 6. Since m ≤ f(t) ≤ M on the piece, monotonicity of the integral gives 2 × 3 = 6 ≤ 9 ≤ 6 × 3 = 18, and the certified piece passes the check.",
  xp: 200, prereqs: ["q30"],
  artifact: {"name":"Shift ledger","description":"Two certified totals, their difference, and the bounds it must respect."},
  sources: [source.s5_2],
  teaching: {
   intuition: "Two properties of the integral make an audit fast. The first is additivity: if a < b < c, the integral from a to c is the integral from a to b plus the integral from b to c, just as the fuel for a whole shift is the fuel for the morning plus the fuel for the afternoon. So one certified piece can be found by subtracting two certified totals. The second is monotonicity of the integral: if f ≤ g everywhere on an interval, then the integral of f is at most the integral of g. Compare f with the constant m, its smallest value, and with the constant M, its largest value, on [b, c]. A constant integrates to itself times the length, so m(c − b) ≤ ∫ from b to c of f ≤ M(c − b). A figure from the meter that falls outside those bounds cannot be right.",
   steps: [
    "Use additivity: the integral over [b, c] is the integral over [a, c] minus the integral over [a, b].",
    "Find m and M, the smallest and largest values of f on [b, c]: check the ends, and any turning point inside the interval.",
    "Multiply each by the length c − b to get the lower bound m(c − b) and the upper bound M(c − b).",
    "Check that the piece from the first step lies between the two bounds."
   ],
   example: {
    prompt: "f(t) = t² − 2t + 3. The integral from 0 to 6 is 54 and from 0 to 3 is 9. Find the integral from 3 to 6 and its bounds.",
    steps: [
     "Additivity: 54 − 9 = 45.",
     "f(t) = (t − 1)² + 2 has its lowest point at t = 1, outside [3, 6], so m = f(3) = 6 and M = f(6) = 27.",
     "The length is 3, so the bounds are 6 × 3 = 18 and 27 × 3 = 81, and 18 ≤ 45 ≤ 81."
    ],
    answer: "The piece is 45, between the bounds 18 and 81."
   },
   pitfalls: [
    "Subtracting the wrong way round: the later piece is the longer total minus the shorter one.",
    "Taking m from the ends only when the lowest point of f lies inside the interval. Then m is the value at that lowest point.",
    "Multiplying m and M by the whole interval [0, c] instead of the length of the piece."
   ]
  },
  guidance: [
   { prompt: "The integral from 0 to 6 is 36 and the integral from 0 to 3 is 27. By additivity, what is the integral from 3 to 6?", answer: [9], labels: ["integral of the piece (litres)"], explanation: "The whole is the first part plus the rest, so the rest is 36 − 27 = 9 litres." },
   { prompt: "f(t) = (t − 4)² + 2. What is the smallest value m of f on [3, 6]?", answer: [2], labels: ["m"], explanation: "The square is 0 at t = 4, which lies in the interval, so m = 2." },
   { prompt: "What is the largest value M of f on [3, 6]?", answer: [6], labels: ["M"], explanation: "The square grows away from t = 4, so the largest value is at an end: f(3) = 3 and f(6) = 6, so M = 6." },
   { prompt: "The piece has length 3. What is the lower bound m × 3?", answer: [6], labels: ["lower bound (litres)"], explanation: "2 × 3 = 6. Since f ≥ m on the piece, its integral is at least this." },
   { prompt: "What is the upper bound M × 3?", answer: [18], labels: ["upper bound (litres)"], explanation: "6 × 3 = 18. The piece, 9 litres, lies between 6 and 18." }
  ]
 },
 {
  id: 'q33', title: "The valve that changed its mind", topic: "The fundamental theorem made precise", tier: 'Advanced', sector: 'Fuel Audit',
  brief: "A valve switched its flow mid-shift, and the audit wants the running total and an honest answer about whether that total has a slope at the switch.",
  lesson: "F(x) = ∫ from a to x of f is always continuous, and F′(c) = f(c) wherever f is continuous; at a jump of f, F has a corner.",
  prompt: "A valve’s fuel flow is logged as f(t) = 4 litres per hour for 0 ≤ t < 3, a single reading f(3) = 9 at the instant t = 3, and f(t) = 7 for 3 < t ≤ 7. The running total is F(x) = the integral of f from 0 to x. Enter F(3), then F(5), then 1 if F is differentiable at x = 3, 0 if not.",
  answer: [12,26,0], labels: ["F at the switch (litres)","F later (litres)","differentiable (1 or 0)"], tolerance: 0.01,
  hints: [
   "The value of f at one single instant does not change any integral, so the integral of a step rate is rate × time, piece by piece.",
   "F is differentiable at the switch exactly when its slope from the left equals its slope from the right; those slopes are the rates on the two sides."
  ],
  solution: "Up to t = 3 the rate is 4, so F(3) = 4 × 3 = 12; the single reading at t = 3 adds nothing. After that the rate is 7, so F(5) = 12 + 7 × (5 − 3) = 26. Near x = 3, F rises with slope 4 on the left and slope 7 on the right, so the difference quotients of F at 3 approach 4 from the left and 7 from the right. They differ, so F has a corner and is not differentiable at 3, although it is continuous there. The answer is 0.",
  xp: 200, prereqs: ["q32","q24"],
  artifact: {"name":"Running-total chart","description":"A total that bends at the switch but never breaks."},
  sources: [source.s5_3],
  teaching: {
   intuition: "The fundamental theorem of calculus is about the running total F(x), the integral of f from a fixed start up to x. Made precise, it says two things. First, F is always continuous: if |f| ≤ M, then F can change by at most M × |x − y| between x and y. Second, wherever f is continuous at a point c, F is differentiable there and F′(c) = f(c). At a point where f is not continuous, the theorem promises nothing, so we look directly. Just right of c the difference quotient (F(c + h) − F(c)) ÷ h is the average of f over a short stretch after c, and just left of c it is the average over a short stretch before c. If f jumps from one rate to another, those two averages approach different numbers and F has a corner. If the rates on the two sides agree and only one single reading is odd, F is still differentiable, because one value at one instant changes no integral.",
   steps: [
    "Integrate the step rate piece by piece: rate × time for each stretch. Ignore a value at a single instant.",
    "Add the pieces to get F at the points asked for.",
    "Find the slope of F just left of the switch and just right of it: these are the rates on the two sides.",
    "F is differentiable at the switch exactly when those two slopes are equal."
   ],
   example: {
    prompt: "f(t) = 3 for 0 ≤ t < 2, f(2) = 8, and f(t) = 5 for t > 2. F(x) = ∫ from 0 to x of f. Find F(2), F(4), and whether F is differentiable at 2.",
    steps: [
     "F(2) = 3 × 2 = 6; the single reading f(2) = 8 adds nothing.",
     "F(4) = 6 + 5 × 2 = 16.",
     "The slopes are 3 on the left and 5 on the right, so F has a corner at 2."
    ],
    answer: "F(2) = 6, F(4) = 16, and F is not differentiable at 2 (answer 0)."
   },
   pitfalls: [
    "Using the single reading at the switch as a rate. One instant has length 0, so it adds nothing to any integral.",
    "Deciding that F jumps because f jumps. F is always continuous; only its slope can jump.",
    "Answering F′(c) = f(c) at the switch. That rule needs f continuous at c, which it is not there."
   ]
  },
  guidance: [
   { prompt: "From t = 0 to t = 3 the rate is 4 litres per hour (one reading at a single instant changes no integral). What is F(3)?", answer: [12], labels: ["F at the switch (litres)"], explanation: "F(3) = 4 × 3 = 12 litres." },
   { prompt: "After t = 3 the rate is 7. What is F(5)?", answer: [26], labels: ["F later (litres)"], explanation: "F(5) = F(3) + 7 × (5 − 3) = 12 + 14 = 26 litres." },
   { prompt: "For a small h > 0, (F(3 + h) − F(3)) ÷ h is the average rate just after t = 3. What number do these difference quotients approach as h shrinks?", answer: [7], labels: ["slope from the right"], explanation: "Just after t = 3 the rate is 7, so F(3 + h) − F(3) = 7h and the quotient is 7 for every small h." },
   { prompt: "From the left the quotients approach 4, and from the right 7. Enter 1 if F is differentiable at 3, 0 if not.", answer: [0], labels: ["differentiable (1 or 0)"], explanation: "4 and 7 differ, so the two one-sided limits disagree and F′(3) does not exist." }
  ]
 },
 {
  id: 'q34', title: "Bracketing an endless correction log", topic: "Improper integrals and integral-test bounds", tier: 'Advanced', sector: 'Fuel Audit',
  brief: "No one can add every correction in an endless log, but the audit can still certify the total between two close bounds.",
  lesson: "For decreasing positive f, the tail f(K) + f(K + 1) + … lies between ∫ from K to ∞ of f and f(K) plus that integral.",
  prompt: "A relay’s correction log adds up the endless sum S of 1 ÷ n³ for n = 1, 2, 3, … . Using the first 4 terms and the improper integral of 1 ÷ x³ from 5 to infinity, enter a lower bound and an upper bound for S, each rounded to 3 decimal places (keep full precision until the last step).",
  answer: [1.198,1.206], labels: ["lower bound","upper bound"], tolerance: 0.0005,
  hints: [
   "The improper integral of c ÷ xᵖ from K to infinity is c ÷ ((p − 1) × Kᵖ⁻¹) when p > 1.",
   "For a decreasing positive f, the tail f(K) + f(K + 1) + … lies between the integral of f from K to infinity and f(K) plus that integral. Take K one past the terms you added."
  ],
  solution: "The first 4 terms add to 1.178 (to 3 decimal places). The improper integral of 1 ÷ x³ from 5 to infinity is 1 ÷ (2 × 5²) = 0.02 (to 3 decimal places). The tail from n = 5 on is at least that integral and at most the term 1 ÷ 5³ = 0.008 plus it. So S ≥ 1.178 + 0.02 and S ≤ 1.178 + 0.008 + 0.02; with full precision the bounds are 1.198 and 1.206.",
  xp: 200, prereqs: ["q33","q15"],
  artifact: {"name":"Bracketed log","description":"An endless sum pinned between two numbers three decimals apart."},
  sources: [source.s5_5],
  teaching: {
   intuition: "An improper integral runs to infinity: the integral of f from K to ∞ is the limit of the integral from K to c as c grows. For f(x) = 1 ÷ xᵖ with p > 1 the limit exists, and it is 1 ÷ ((p − 1)Kᵖ⁻¹). Now picture the terms f(K), f(K + 1), … of a series as bars of width 1. When f is positive and decreasing, the bar starting at n stands above the curve from n to n + 1, so the tail of the series is at least the integral from K to ∞. Shift the bars one step left and they sit under the curve, except the first bar f(K), so the tail is at most f(K) plus the same integral. Add the first terms exactly, put K one past them, and the endless sum is caught between two numbers that differ by only f(K).",
   steps: [
    "Add the first N terms exactly (keep all the decimals).",
    "Compute the improper integral of f from K = N + 1 to infinity; for c ÷ xᵖ it is c ÷ ((p − 1)Kᵖ⁻¹).",
    "Lower bound: the first N terms plus the integral.",
    "Upper bound: the first N terms plus the term f(K) plus the integral. Round only at the end."
   ],
   example: {
    prompt: "Bound the sum of 1 ÷ n² from n = 1, using the first 3 terms.",
    steps: [
     "1 + 1/4 + 1/9 = 1.36111…, and K = 4.",
     "The integral of 1 ÷ x² from 4 to infinity is 1 ÷ 4 = 0.25, and f(4) = 0.0625.",
     "Lower: 1.36111 + 0.25 = 1.61111…; upper: 1.36111 + 0.0625 + 0.25 = 1.67361…."
    ],
    answer: "The sum lies between 1.611 and 1.674."
   },
   pitfalls: [
    "Starting the integral at the last term you added instead of one past it. That counts that term twice.",
    "Rounding the partial sum before adding: the third decimal can move. Keep full precision until the end.",
    "Forgetting the extra term f(K) in the upper bound, which makes the two bounds equal."
   ]
  },
  guidance: [
   { prompt: "Add the first 4 terms. What is their sum, to 3 decimal places?", answer: [1.178], labels: ["partial sum"], explanation: "1 ÷ 1³ + 1 ÷ 2³ + 1 ÷ 3³ + 1 ÷ 4³ = 1.178 to 3 decimal places." },
   { prompt: "What is the improper integral of 1 ÷ x³ from 5 to infinity, to 3 decimal places?", answer: [0.02], labels: ["tail integral"], explanation: "It is 1 ÷ (2 × 5²) = 0.02 to 3 decimal places." },
   { prompt: "The tail from n = 5 on is at least that integral. What is the lower bound for S, to 3 decimal places?", answer: [1.198], labels: ["lower bound"], explanation: "Partial sum plus tail integral, with full precision, is 1.198 to 3 decimal places." },
   { prompt: "The tail is at most the term 1 ÷ 5³ plus the same integral. What is the upper bound for S, to 3 decimal places?", answer: [1.206], labels: ["upper bound"], explanation: "Adding the term 0.008 to the lower bound's working gives 1.206 to 3 decimal places." }
  ]
 },
 {
  id: 'q35', title: "Models that settle one load at a time", topic: "Pointwise convergence", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "Each new gauge model improves on the last, and the hall wants to know what they settle on at each load and how soon.",
  lesson: "fₙ → f pointwise when, for each fixed x, the numbers fₙ(x) converge to f(x); the N that meets ε may depend on x.",
  prompt: "A simulated gauge’s n-th model gives the reading fₙ(x) = (2 + 8nx) ÷ (1 + nx) at load x ≥ 0. Enter the pointwise limit f(0), then the pointwise limit f(1.5), then the smallest N for which |fₙ(1.5) − f(1.5)| < 0.1 holds for every n ≥ N (type it without commas).",
  answer: [2,8,40], labels: ["f(0)","f at the second load","N"], tolerance: 0.01,
  hints: [
   "Fix x first, then let n grow. At x = 0 every model gives the same number; for x > 0 divide the top and the bottom by n.",
   "For x > 0, write fₙ(x) − f(x) over the common bottom 1 + nx: the terms with nx cancel, leaving a constant ÷ (1 + nx), which shrinks as n grows. Solve “that < the tolerance” for n; the inequality is strict."
  ],
  solution: "At x = 0, fₙ(0) = 2 ÷ 1 = 2 for every n, so f(0) = 2. For x > 0, dividing the top and the bottom by n gives (2 ÷ n + 8x) ÷ (1 ÷ n + x), which approaches 8x ÷ x = 8; so f(1.5) = 8. The gap is |fₙ(1.5) − 8| = 6 ÷ (1 + 1.5n). It is below 0.1 when 1 + 1.5n > 60, that is n > 59 ÷ 1.5 = about 39.33. The gap only shrinks as n grows, so the smallest N is 40.",
  xp: 200, prereqs: ["q07"],
  artifact: {"name":"Load-by-load table","description":"Readings that settle at every load, but not all at the same pace."},
  sources: [source.s6_1],
  teaching: {
   intuition: "A sequence of functions f₁, f₂, f₃, … is a list of models, each giving a number at every input x. The simplest way they can settle is one input at a time: fix x, and look at the ordinary sequence of numbers f₁(x), f₂(x), f₃(x), …. If that sequence converges for every x, we call the limit f(x) and say fₙ converges to f pointwise. This is pointwise convergence. It is a separate limit at each x, so the ε–N promise is also made separately: for each x and each ε there is an N with |fₙ(x) − f(x)| < ε from n = N on, and that N may have to grow as x changes. The limit can even look quite different from the models. Every fₙ below is continuous, yet the limit jumps at x = 0.",
   steps: [
    "Fix one input x and treat fₙ(x) as an ordinary sequence in n.",
    "Find its limit as n grows: at x = 0 the formula may not depend on n at all; elsewhere divide the top and the bottom by n.",
    "For the ε–N promise at one x, write the gap |fₙ(x) − f(x)| as a formula in n.",
    "Solve “gap < ε” for n; take the smallest whole n strictly beyond the boundary, and check that the gap keeps shrinking after it."
   ],
   example: {
    prompt: "gₙ(x) = (1 + 5nx) ÷ (1 + nx) for x ≥ 0. Find the pointwise limit at 0 and at 2, and the smallest N with |gₙ(2) − g(2)| < 0.5 for n ≥ N.",
    steps: [
     "gₙ(0) = 1 for every n, so g(0) = 1. At x = 2, divide by n: the limit is 5.",
     "The gap at 2 is 4 ÷ (1 + 2n); below 0.5 means 1 + 2n > 8, so n > 3.5.",
     "The smallest N is 4."
    ],
    answer: "g(0) = 1, g(2) = 5, N = 4."
   },
   pitfalls: [
    "Putting x = 0 into the limit found for x > 0. At x = 0 the terms with n vanish, and the limit is the constant term.",
    "Expecting one N to work for every x. Smaller x needs a larger N here; pointwise convergence only promises an N for each x.",
    "Stopping at the boundary value of n when the inequality is strict."
   ]
  },
  guidance: [
   { prompt: "Put x = 0 into fₙ(x): every model gives the same number there. What is the pointwise limit f(0)?", answer: [2], labels: ["f(0)"], explanation: "fₙ(0) = 2 ÷ 1 = 2 for every n, and a sequence that never changes converges to that value." },
   { prompt: "Fix x = 1.5 and let n grow. What is the limit f(1.5)?", answer: [8], labels: ["f at the second load"], explanation: "Divide the top and the bottom by n: (2 ÷ n + 12) ÷ (1 ÷ n + 1.5) approaches 12 ÷ 1.5 = 8." },
   { prompt: "The gap at x = 1.5 is 6 ÷ (1 + 1.5n). What is the smallest N with this below 0.1 for every n ≥ N?", answer: [40], labels: ["N"], explanation: "6 ÷ (1 + 1.5n) < 0.1 means 1 + 1.5n > 60, so n > about 39.33. The smallest whole number strictly above it is 40, and larger n only make the gap smaller." }
  ]
 },
 {
  id: 'q36', title: "One promise for every input", topic: "Uniform convergence and the uniform norm", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "The hall will only certify a correction if a single N keeps it within ε at every input at once.",
  lesson: "fₙ → f uniformly when ‖fₙ − f‖_u, the supremum of |fₙ(x) − f(x)| over all x, tends to 0; one N then works for every x.",
  prompt: "The simulation core’s n-th correction is fₙ(x) = 3x ÷ (1 + nx²) for x ≥ 0, and fₙ(x) → 0 for every x. Enter the uniform norm ‖fₙ − 0‖_u for n = 25, then the smallest N for which ‖fₙ − 0‖_u < 0.05 holds for every n ≥ N (type it without commas).",
  answer: [0.3,901], labels: ["uniform norm","N"], tolerance: 0.0005,
  hints: [
   "The uniform norm is the supremum of |fₙ(x)| over all x ≥ 0. Find where the derivative of fₙ is 0.",
   "For a coefficient a, the largest value of ax ÷ (1 + nx²) is at x = 1 ÷ √n and equals a ÷ (2√n). Solve “that < the tolerance” for n; the inequality is strict."
  ],
  solution: "The derivative of 3x ÷ (1 + nx²) is 3(1 − nx²) ÷ (1 + nx²)², which is 0 at x = 1 ÷ √n; fₙ rises before that point and falls after it, and fₙ(0) = 0. So ‖fₙ − 0‖_u = fₙ(1 ÷ √n) = 3 ÷ (2√n). For n = 25, x = 0.2 and the norm is 3 ÷ 10 = 0.3. The norm is below 0.05 when √n > 3 ÷ 0.1, that is n > 900 (strictly). The norm only shrinks as n grows, so the smallest N is 901, and one N works for every x at once.",
  xp: 200, prereqs: ["q35","q05"],
  artifact: {"name":"Uniform certificate","description":"One N that holds for every input of the simulation."},
  sources: [source.s6_1],
  teaching: {
   intuition: "Pointwise convergence lets the N depend on the input, which is no use for a certificate that must cover every input at once. Uniform convergence asks for more: for every ε there is one N such that |fₙ(x) − f(x)| < ε for all n ≥ N and all x together. The tool for checking it is the uniform norm. ‖g‖_u is the supremum of |g(x)| over the whole domain: the worst gap anywhere. Then fₙ converges to f uniformly exactly when ‖fₙ − f‖_u tends to 0, because a bound on the worst gap is a bound on every gap. To compute the norm we find the supremum of a function over a set, as in the calibration bench missions: look for the point where the derivative is 0, compare with the ends, and take the largest size. Uniform convergence is the strong kind: a uniform limit of continuous functions is continuous.",
   steps: [
    "Find the pointwise limit f, then write the gap |fₙ(x) − f(x)|.",
    "For a fixed n, find the supremum of the gap over all x: solve where the derivative is 0 and compare with the ends.",
    "That supremum is ‖fₙ − f‖_u. Write it as a formula in n.",
    "Solve ‖fₙ − f‖_u < ε for n; the smallest whole n strictly beyond the boundary is N, and it works for every x at once."
   ],
   example: {
    prompt: "hₙ(x) = 4x ÷ (1 + nx²) for x ≥ 0. Find ‖hₙ‖_u for n = 4 and the smallest N with ‖hₙ‖_u < 0.1.",
    steps: [
     "The derivative 4(1 − nx²) ÷ (1 + nx²)² is 0 at x = 1 ÷ √n, so ‖hₙ‖_u = 4 ÷ (2√n) = 2 ÷ √n.",
     "For n = 4: 2 ÷ 2 = 1.",
     "2 ÷ √n < 0.1 means √n > 20, so n > 400 and N = 401."
    ],
    answer: "‖h₄‖_u = 1, and N = 401."
   },
   pitfalls: [
    "Checking the gap at one or two inputs. The norm is the worst gap over every x; it is a supremum.",
    "Forgetting that the peak moves with n. For each n the largest value is at x = 1 ÷ √n.",
    "Solving for √n and stopping. The question asks for n, so square the bound."
   ]
  },
  guidance: [
   { prompt: "For n = 25, where is the derivative 3(1 − 25x²) ÷ (1 + 25x²)² equal to 0 (with x > 0)?", answer: [0.2], labels: ["x of the peak"], explanation: "1 − 25x² = 0 gives x² = 1 ÷ 25, so x = 0.2." },
   { prompt: "What is f at x = 0.2 for n = 25, which is the uniform norm?", answer: [0.3], labels: ["uniform norm"], explanation: "3 × 0.2 ÷ (1 + 25 × 0.04) = 0.6 ÷ 2 = 0.3. Every other x gives less." },
   { prompt: "In general the norm is 3 ÷ (2√n). What is the smallest N with this below 0.05 for every n ≥ N?", answer: [901], labels: ["N"], explanation: "3 ÷ (2√n) < 0.05 means √n > 30, so n > 900. The smallest whole number strictly above it is 901." }
  ]
 },
 {
  id: 'q37', title: "Summing a vibration term by term", topic: "Interchange of limits and the Weierstrass M-test", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "The core adds up endless vibration terms, and Mira wants a bound that holds at every input and a total that can be integrated safely.",
  lesson: "If |fₖ(x)| ≤ Mₖ for all x and the Mₖ have a finite sum, the series of fₖ converges uniformly, and it may be integrated term by term.",
  prompt: "The simulation core runs g(x) = 4 + the endless sum, for k = 1, 2, 3, …, of 3 cos(2πkx) ÷ 2ᵏ. Enter the Weierstrass M-test bound Mₖ summed over all k (a bound on |g(x) − 4| for every x), then the uniform bound on the error after the first 3 terms, then the integral of g from 0 to 1.5.",
  answer: [3,0.375,6], labels: ["sum of the Mₖ","uniform error bound","integral of g"], tolerance: 0.0005,
  hints: [
   "|cos| is never more than 1, so each term is at most Mₖ = c ÷ bᵏ in size for every x. The Mₖ form a geometric series.",
   "Uniform convergence lets you integrate the sum term by term. The integral of cos(2πkx) from 0 to L is sin(2πkL) ÷ (2πk), which is 0 when L is a multiple of 1/2."
  ],
  solution: "For every x, |3 cos(2πkx) ÷ 2ᵏ| ≤ Mₖ = 3 ÷ 2ᵏ. The Mₖ form a geometric series with first term 1.5 and ratio 1/2, so their sum is 1.5 ÷ (1 − 1/2) = 3. By the M-test the sum converges uniformly, and |g(x) − 4| ≤ 3 for every x. After the first 3 terms the rest is at most the tail of the Mₖ: 3 ÷ 2³ = 0.375, the same for every x. Because the partial sums converge uniformly, the integral of g is the sum of the integrals of its terms. The integral of cos(2πkx) from 0 to 1.5 is sin(2πk × 1.5) ÷ (2πk) = 0, since 2πk × 1.5 is a whole multiple of π. Only the constant is left: 4 × 1.5 = 6.",
  xp: 200, prereqs: ["q36","q15"],
  artifact: {"name":"M-test seal","description":"A row of numbers that bounds every term at every input."},
  sources: [source.s6_2, source.s11_2],
  teaching: {
   intuition: "A limit can be taken in two orders: integrate each partial sum and then let the number of terms grow, or let it grow first and integrate the limit. Swapping two limits like this, an interchange of limits, can go wrong for pointwise convergence. It is safe under uniform convergence: when Riemann integrable fₙ converge uniformly to f on [a, b], the integrals of fₙ converge to the integral of f. For a series of functions the easiest way to prove uniform convergence is the Weierstrass M-test. Find numbers Mₖ with |fₖ(x)| ≤ Mₖ for every x. If the Mₖ have a finite sum, the series converges uniformly, and the error after N terms is at most the tail of the Mₖ after the first N, the same bound at every x. Then the series may be integrated term by term.",
   steps: [
    "Bound each term by a number Mₖ that does not depend on x (for example, |cos| ≤ 1).",
    "Add up the Mₖ. If the sum is finite, the M-test gives uniform convergence; for a geometric series use first term ÷ (1 − ratio).",
    "The uniform error after N terms is at most the tail of the Mₖ after N terms.",
    "Integrate term by term, which uniform convergence allows, and add up the integrals."
   ],
   example: {
    prompt: "h(x) = 2 + the sum for k ≥ 1 of 6 cos(2πkx) ÷ 7ᵏ. Find the sum of the Mₖ, the error bound after 1 term, and the integral of h from 0 to 1.",
    steps: [
     "Mₖ = 6 ÷ 7ᵏ, a geometric series: (6/7) ÷ (6/7) = 1.",
     "After 1 term the tail is 1 ÷ 7, about 0.143.",
     "Each cos(2πkx) integrates to 0 over [0, 1], so the integral is 2 × 1 = 2."
    ],
    answer: "Sum of the Mₖ 1, error after 1 term 1 ÷ 7, integral 2."
   },
   pitfalls: [
    "Choosing an Mₖ that depends on x. The M-test needs one number per term that works for every input.",
    "Including the constant term in the sum of the Mₖ when the bound is on |g(x) − constant|.",
    "Integrating term by term without checking uniform convergence; for pointwise convergence alone the swap can fail."
   ]
  },
  guidance: [
   { prompt: "The k-th term is at most Mₖ = 3 ÷ 2ᵏ in size for every x. What is the sum of all the Mₖ?", answer: [3], labels: ["sum of the Mₖ"], explanation: "A geometric series with first term 1.5 and ratio 1/2: 1.5 ÷ (1 − 1/2) = 3." },
   { prompt: "The error after 3 terms is at most M₄ + M₅ + … . What is that tail?", answer: [0.375], labels: ["uniform error bound"], explanation: "The tail of a geometric series with ratio 1/2 after 3 terms is the whole sum divided by 2³ = 8: 3 ÷ 8 = 0.375." },
   { prompt: "Integrate term by term. Each cos(2πkx) integrates to 0 from 0 to 1.5. What is the integral of g from 0 to 1.5?", answer: [6], labels: ["integral of g"], explanation: "Only the constant 4 contributes: 4 × 1.5 = 6." }
  ]
 },
 {
  id: 'q38', title: "The safe zone of a power series", topic: "Power series converge uniformly inside the radius", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "A power series drives the simulation, and the hall needs its radius and a uniform certificate on the interval where it is used.",
  lesson: "A power series with radius of convergence ρ converges uniformly on every closed interval [a − r, a + r] with r < ρ.",
  prompt: "A simulation uses the power series that adds up 6(x − 1)ᵏ ÷ 4ᵏ for k = 0, 1, 2, … . Enter its radius of convergence, then the Weierstrass M-test bound (the sum of the Mₖ) that certifies uniform convergence on [−1, 3].",
  answer: [4,12], labels: ["radius of convergence","sum of the Mₖ"], tolerance: 0.005,
  hints: [
   "Ratio test: divide the (k + 1)-th term by the k-th and take the size. The series converges where that ratio is below 1.",
   "On a closed interval strictly inside the radius, |x − x₀| is at most the half-width r, so each term is at most c(r ÷ b)ᵏ. Those bounds form a geometric series."
  ],
  solution: "The ratio of the (k + 1)-th term to the k-th is (x − 1) ÷ 4, of size |x − 1| ÷ 4. It is below 1 when the distance from 1 is below 4, so the radius of convergence is 4. On [−1, 3] the distance from 1 is at most 2, so each term is at most Mₖ = 6 × (2/4)ᵏ. These form a geometric series with ratio 0.5 < 1, whose sum is 6 ÷ (1 − 0.5) = 12. By the M-test the series converges uniformly on the interval, and its size there is never more than 12.",
  xp: 200, prereqs: ["q37","q16"],
  artifact: {"name":"Safe-zone chart","description":"An interval inside the radius, sealed by a geometric bound."},
  sources: [source.s6_2],
  teaching: {
   intuition: "A power series adds up cₖ(x − a)ᵏ for k = 0, 1, 2, …. The ratio test from the relay station gives its radius of convergence ρ: it converges when |x − a| < ρ and diverges when |x − a| > ρ. Inside the radius the convergence is even uniform, but only on closed intervals that stay strictly inside. On [a − r, a + r] with r < ρ, every x has |x − a| ≤ r, so each term is at most Mₖ = |cₖ|rᵏ in size, and these Mₖ form a convergent series. The M-test then certifies uniform convergence there, and the sum of the Mₖ bounds the size of the series on the whole interval. Near the edge of the radius this bound grows without limit, which is why the interval must stop short of it.",
   steps: [
    "Divide the (k + 1)-th term by the k-th and take its size; the series converges where this ratio is below 1. That gives the radius ρ.",
    "Check that the interval [a − r, a + r] has r < ρ, so it sits strictly inside.",
    "Bound each term on the interval by Mₖ, using |x − a| ≤ r.",
    "Sum the Mₖ; for a geometric bound use first term ÷ (1 − ratio)."
   ],
   example: {
    prompt: "The series adds up 2xᵏ ÷ 3ᵏ for k ≥ 0. Find the radius and the M-test bound on [−1, 1].",
    steps: [
     "The ratio of consecutive terms is x ÷ 3, of size below 1 when |x| < 3: ρ = 3.",
     "On [−1, 1], Mₖ = 2 × (1/3)ᵏ.",
     "The sum is 2 ÷ (1 − 1/3) = 3."
    ],
    answer: "Radius 3; bound 3 on [−1, 1]."
   },
   pitfalls: [
    "Using the radius itself as r. On an interval that reaches the radius the Mₖ need not have a finite sum.",
    "Measuring from 0 when the series is centred at another point a. The distance that matters is |x − a|.",
    "Forgetting the k = 0 term, which is the constant c₀ and is part of the sum of the Mₖ."
   ]
  },
  guidance: [
   { prompt: "The ratio of consecutive terms has size |x − 1| ÷ 4. Below what distance from 1 does the series converge?", answer: [4], labels: ["radius of convergence"], explanation: "The ratio is below 1 exactly when |x − 1| < 4, so the radius is 4." },
   { prompt: "On [−1, 3] the distance from 1 is at most 2. What is the ratio r ÷ b of the bounding geometric series?", answer: [0.5], labels: ["ratio"], explanation: "2 ÷ 4 = 0.5, which is below 1 because the interval sits strictly inside the radius." },
   { prompt: "Mₖ = 6 × 0.5ᵏ. What is the sum of all the Mₖ?", answer: [12], labels: ["sum of the Mₖ"], explanation: "6 ÷ (1 − 0.5) = 6 ÷ 0.5 = 12." }
  ]
 },
 {
  id: 'q39', title: "Four rulers for one plane", topic: "Metric spaces: distances and open balls", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "Different certificates in the hall measure the distance between two simulator states in different ways, and each must say which states count as close.",
  lesson: "A metric d(x, y) is a distance that is never negative, is 0 only for equal points, is symmetric, and obeys the triangle inequality; the open ball B(x, ρ) holds the points at distance less than ρ.",
  prompt: "Two states of a simulated relay are the points P = (2, −1) and Q = (−3, 3) of the plane. The certificate measures distance with the taxicab metric. Enter d(P, Q), then 1 if Q lies in the open ball B(P, 9), 0 if not.",
  answer: [9,0], labels: ["d(P, Q)","in the ball (1 or 0)"], tolerance: 0.01,
  hints: [
   "Start from the two coordinate gaps |x₁ − x₂| and |y₁ − y₂|. Euclidean: square, add, take the root. Taxicab: add them. Maximum: take the larger. Discrete: 0 for the same point, 1 for different points.",
   "The open ball B(P, ρ) holds the points at distance strictly less than ρ from P; a point at distance exactly ρ is not in it."
  ],
  solution: "The coordinate gaps are |2 − (−3)| = 5 and |−1 − 3| = 4. In the taxicab metric, d(P, Q) = 5 + 4 = 9. Q is in B(P, 9) exactly when d(P, Q) < 9. The distance equals 9, so Q is on the edge, which an open ball leaves out: the answer is 0.",
  xp: 200, prereqs: ["q04"],
  artifact: {"name":"Set of rulers","description":"Four ways to measure one gap, all honest."},
  sources: [source.s7_1],
  teaching: {
   intuition: "Everything so far measured closeness with |x − y|. Many other distances work just as well, and a metric is any rule d(x, y) with four properties: d(x, y) ≥ 0; d(x, y) = 0 only when x = y; d(x, y) = d(y, x); and the triangle inequality d(x, z) ≤ d(x, y) + d(y, z). A set with a metric is a metric space. In the plane, with coordinate gaps |x₁ − x₂| and |y₁ − y₂|, the euclidean metric is the straight-line distance √(gap₁² + gap₂²). The taxicab metric adds the two gaps, like a route along a grid of corridors. The maximum metric takes the larger gap. The discrete metric gives 0 for the same point and 1 for any two different points. The open ball B(P, ρ) is the set of points at distance strictly less than ρ from P: the meaning of “close to P” in that metric.",
   steps: [
    "Find the two coordinate gaps between the points.",
    "Combine them the way the named metric does: euclidean square, add and take the root; taxicab add; maximum take the larger; discrete 1 if the points differ.",
    "To test a point for the open ball B(P, ρ), compare its distance from P with ρ.",
    "It is in the ball only if the distance is strictly less than ρ; a point at distance exactly ρ is outside."
   ],
   example: {
    prompt: "P = (1, 1) and Q = (4, 5). Find d(P, Q) in each of the four metrics, and say whether Q is in B(P, 5) for the euclidean metric.",
    steps: [
     "The gaps are 3 and 4.",
     "Euclidean √(9 + 16) = 5; taxicab 3 + 4 = 7; maximum 4; discrete 1.",
     "Euclidean distance 5 is not less than 5, so Q is not in B(P, 5)."
    ],
    answer: "Distances 5, 7, 4 and 1; Q is not in the open ball B(P, 5)."
   },
   pitfalls: [
    "Counting a point at distance exactly ρ as inside the open ball. The inequality is strict.",
    "Keeping a minus sign on a gap. Gaps are sizes, so take |x₁ − x₂|, never a negative number.",
    "Treating the discrete metric as a count of different coordinates. Any two different points are at distance 1."
   ]
  },
  guidance: [
   { prompt: "What is the gap |2 − (−3)| between the first coordinates?", answer: [5], labels: ["first gap"], explanation: "2 − (−3) = 5, whose size is 5." },
   { prompt: "What is the gap |−1 − 3| between the second coordinates?", answer: [4], labels: ["second gap"], explanation: "−1 − 3 = −4, whose size is 4." },
   { prompt: "Combine the gaps as the taxicab metric does. What is d(P, Q)?", answer: [9], labels: ["d(P, Q)"], explanation: "d(P, Q) = 5 + 4 = 9." },
   { prompt: "Is d(P, Q) = 9 strictly less than 9? Enter 1 if Q is in B(P, 9), 0 if not.", answer: [0], labels: ["in the ball (1 or 0)"], explanation: "9 is not less than 9, so Q is not in the open ball." }
  ]
 },
 {
  id: 'q40', title: "The core’s final certificate", topic: "Realm review and bridge to Complex analysis", tier: 'Advanced', sector: 'Simulation Hall',
  brief: "The simulation core gets its last certificate today, and Mira wants the radius, a uniform bound and one distance in the plane where the next work begins.",
  lesson: "A radius from the ratio test, a geometric M-test bound inside it, and the euclidean distance in the plane together certify a power series.",
  prompt: "For the final certificate the simulation core sums 5(−1)ᵏxᵏ ÷ 6ᵏ for k = 0, 1, 2, … . Enter its radius of convergence, then the Weierstrass M-test bound on [−2, 2], then the euclidean distance from the origin to the point (3, −4) of the plane, where complex analysis will next evaluate such series.",
  answer: [6,7.5,5], labels: ["radius of convergence","M-test bound","distance"], tolerance: 0.005,
  hints: [
   "The sign (−1)ᵏ never changes the size of a term, so the ratio test sees |x| ÷ b.",
   "On [−r, r] each term is at most c(r ÷ b)ᵏ in size; sum that geometric series. The euclidean distance from the origin is the square root of the sum of the squared coordinates."
  ],
  solution: "The size of the ratio of consecutive terms is |x| ÷ 6, below 1 exactly when |x| < 6: the radius is 6. On [−2, 2] each term is at most Mₖ = 5 × (2/6)ᵏ, and these sum to 5 ÷ (1 − 2/6) = 7.5, which certifies uniform convergence there. The point (3, −4) is at distance √(9 + 16) = √25 = 5 from the origin. In complex analysis the same series is summed at points of the plane, and it converges in the open ball of radius 6 about the origin, so this point lies inside that disc.",
  xp: 200, prereqs: ["q38","q39"],
  artifact: {"name":"Master certificate","description":"The last seal of the Standards Laboratory, drawn as a disc in the plane."},
  sources: [source.s6_2, source.s7_1],
  teaching: {
   intuition: "This review puts the hall’s ideas together. A power series converges inside its radius of convergence, found with the ratio test. On any closed interval strictly inside the radius the convergence is uniform, certified by the Weierstrass M-test with a geometric sum of bounds. And distance is not only |x − y|: the plane with the euclidean metric is a metric space, and the complex numbers are exactly the points of that plane. In complex analysis the same series are summed at points z of the plane, and the set where |z| is below the radius is an open ball about the origin, a disc. So the three numbers of this certificate, a radius, a uniform bound and a distance in the plane, are the first three things you will compute there.",
   steps: [
    "Find the radius with the ratio test; a sign (−1)ᵏ does not change the size of a term.",
    "On [−r, r] with r below the radius, bound the k-th term by c(r ÷ b)ᵏ and sum that geometric series.",
    "Find the euclidean distance of the plane point from the origin: the square root of the sum of the squared coordinates.",
    "Compare that distance with the radius to see whether the point lies in the open disc of convergence."
   ],
   example: {
    prompt: "The series adds up 4(−1)ᵏxᵏ ÷ 5ᵏ. Find its radius, the M-test bound on [−1, 1], and the distance from the origin to (−6, 8).",
    steps: [
     "The ratio has size |x| ÷ 5, so the radius is 5.",
     "On [−1, 1], Mₖ = 4 × 0.2ᵏ, with sum 4 ÷ 0.8 = 5.",
     "√(36 + 64) = 10, outside the disc of radius 5."
    ],
    answer: "Radius 5, bound 5, distance 10."
   },
   pitfalls: [
    "Letting the sign (−1)ᵏ change the radius. The ratio test uses sizes, so the sign drops out.",
    "Adding the coordinates of the plane point instead of using the euclidean distance; that is the taxicab metric.",
    "Using the bound for the whole radius instead of the interval [−r, r]; the bound depends on r."
   ]
  },
  guidance: [
   { prompt: "The ratio of consecutive terms has size |x| ÷ 6. What is the radius of convergence?", answer: [6], labels: ["radius of convergence"], explanation: "|x| ÷ 6 < 1 exactly when |x| < 6, so the radius is 6." },
   { prompt: "On [−2, 2], Mₖ = 5 × (2/6)ᵏ. What is the sum of the Mₖ?", answer: [7.5], labels: ["M-test bound"], explanation: "5 ÷ (1 − 2/6) = 5 × 6 ÷ 4 = 7.5." },
   { prompt: "What is the euclidean distance from (0, 0) to (3, −4)?", answer: [5], labels: ["distance"], explanation: "√(3² + (−4)²) = √25 = 5." }
  ]
 }
);
})();
