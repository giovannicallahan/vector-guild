/* Real analysis missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/real/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Sequences · Basic, 100 XP · sector 'Signal Log' · Chapter review: certifying a signal log [2.1–2.3]
     q12  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Cauchy sequences [2.4]
     q13  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Series as limits of partial sums; the tail [2.5]
     q14  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Absolute and conditional convergence [2.5]
     q15  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Comparison and p-series bounds [2.5]
     q16  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Ratio, root and alternating series tests [2.6]
     q17  ch 3 Cauchy sequences and series · Intermediate, 150 XP · sector 'Relay Station' · Chapter review: a relay of corrections [2.5, 2.6]
     q18  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · ε–δ limits of functions [3.1]
     q19  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · Continuity by ε–δ and by sequences [3.2]
     q20  ch 4 Limits and continuity · Intermediate, 150 XP · sector 'Thermostat Hall' · Discontinuities [3.2] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis I & II: Introduction to Real Analysis, one entry per section the missions below cite. Each page was opened
   and checked for the concept on the date in `verified`. Every source row credits a section only with what it states; anything else
   in a mission (telescoping sums, the alternating-series error bound, the ratio test from Calculus 2) is worked out in the mission. */
const source = {
 s2_1: { title: "Lebl, Basic Analysis — 2.1 Sequences and limits", url: "https://www.jirka.org/ra/html/sec_seqsandlims.html", description: "Sequences, and the limit of a sequence defined with ε and a starting index N.", verified: "2026-11-27" },
 s2_2: { title: "Lebl, Basic Analysis — 2.2 Facts about limits of sequences", url: "https://www.jirka.org/ra/html/sec_factslimsseqs.html", description: "Limit laws for sequences, the squeeze lemma and monotone bounded sequences.", verified: "2026-11-27" },
 s2_3: { title: "Lebl, Basic Analysis — 2.3 Limit superior, limit inferior, and Bolzano–Weierstrass", url: "https://www.jirka.org/ra/html/sec_bw.html", description: "Subsequences, the limit superior and limit inferior of a bounded sequence, and the Bolzano–Weierstrass theorem.", verified: "2026-11-27" },
 s2_4: { title: "Lebl, Basic Analysis — 2.4 Cauchy sequences", url: "https://www.jirka.org/ra/html/sec_cauchy.html", description: "Cauchy sequences, and the fact that a sequence of real numbers is Cauchy exactly when it converges.", verified: "2026-11-27" },
 s2_5: { title: "Lebl, Basic Analysis — 2.5 Series", url: "https://www.jirka.org/ra/html/sec_series.html", description: "Series as limits of partial sums, geometric series, tails, the Cauchy criterion, absolute and conditional convergence, the comparison test and p-series.", verified: "2026-11-28" },
 s2_6: { title: "Lebl, Basic Analysis — 2.6 More on series", url: "https://www.jirka.org/ra/html/sec_moreonseries.html", description: "The root test and the alternating series test (with rearrangements, products of series and power series).", verified: "2026-11-28" },
 s3_1: { title: "Lebl, Basic Analysis — 3.1 Limits of functions", url: "https://www.jirka.org/ra/html/sec_limoffunc.html", description: "Cluster points and the ε–δ definition of the limit of a function at a point.", verified: "2026-11-27" },
 s3_2: { title: "Lebl, Basic Analysis — 3.2 Continuous functions", url: "https://www.jirka.org/ra/html/sec_cont.html", description: "Continuity at a point by ε and δ and by sequences, and discontinuities, among them a removable one.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "Certifying the signal log", topic: "Chapter review: certifying a signal log", tier: "Basic", sector: "Signal Log",
  brief: "Two channels of the signal log are due for their certificates, and Mira wants every promise about them stated exactly.",
  lesson: "A limit comes with an N that meets each ε, and a sequence that does not settle still has an exact limit superior.",
  prompt: "The signal log certifies two channels, read at n = 1, 2, 3, …. Channel A reads xₙ = (3n + 5) ÷ (n + 2). Channel B reads zₙ = 4 + 2 × (−1)ⁿ + 3 ÷ n. Enter the limit L of channel A, then the smallest N such that |xₙ − L| < 0.01 for every n ≥ N, then the limit superior of channel B.",
  answer: [3,99,6], labels: ["limit L","smallest N","limsup of zₙ"], tolerance: 0.01,
  hints: [
   "The limit of a ratio of two linear expressions in n is the ratio of the numbers in front of n.",
   "Write xₙ − L as one fraction with n in the bottom and solve the inequality for n. For channel B, follow the even terms and the odd terms separately."
  ],
  solution: "Dividing the top and the bottom by n gives xₙ = (3 + 5 ÷ n) ÷ (1 + 2 ÷ n), which tends to 3, so L = 3. Then xₙ − 3 = (3n + 5 − 3(n + 2)) ÷ (n + 2) = −1 ÷ (n + 2), so |xₙ − 3| = 1 ÷ (n + 2). This is below 0.01 exactly when n + 2 > 1 ÷ 0.01 = 100, that is when n > 98. The distance shrinks as n grows, so the smallest N is 99. For channel B, the even terms are 6 + 3 ÷ n, which come down towards 6, and the odd terms are 2 + 3 ÷ n, which come down towards 2. The supremum of the terms from any point on is an even term just above 6, and these suprema fall to 6, so limsup zₙ = 6.",
  xp: 100, prereqs: ["q09","q10"],
  artifact: { name: "Signal log certificate", description: "Two channels, one limit with its N, and one limit superior, each signed." },
  sources: [source.s2_1, source.s2_2, source.s2_3],
  teaching: {
   intuition: "This review puts the chapter’s tools side by side. A sequence xₙ converges to L when, for every tolerance ε > 0, there is a starting index N such that every term from the N-th on is within ε of L. For a ratio of two linear expressions in n, the limit is the ratio of the numbers in front of n, and the distance to the limit can be written as one fraction with n in the bottom, so the N for a given ε can be read off exactly. Some sequences never settle: a term like (−1)ⁿ makes them swing between two levels. They still have exact limits of their own. The limit superior, limsup, is the limit of the suprema of the tails, the largest level the terms keep coming back to; the limit inferior, liminf, is the smallest. A sequence converges exactly when the two agree.",
   steps: [
    "For a ratio of linear expressions in n, divide the top and the bottom by n to find the limit L.",
    "Subtract L and simplify to one fraction, so that |xₙ − L| is a number divided by an expression in n.",
    "Solve |xₙ − L| < ε for n. If the distance shrinks as n grows, the smallest N is the first whole number that satisfies it.",
    "For a swinging sequence, follow the even terms and the odd terms separately. The larger of their limits is the limsup and the smaller is the liminf."
   ],
   example: {
    prompt: "xₙ = (2n + 1) ÷ (n + 1) and zₙ = 1 + 3 × (−1)ⁿ + 2 ÷ n. Find the limit of xₙ, the smallest N with |xₙ − 2| < 0.05 for every n ≥ N, and limsup zₙ.",
    steps: [
     "Dividing by n, xₙ tends to 2 ÷ 1 = 2.",
     "xₙ − 2 = (2n + 1 − 2n − 2) ÷ (n + 1) = −1 ÷ (n + 1), so |xₙ − 2| = 1 ÷ (n + 1).",
     "1 ÷ (n + 1) < 0.05 means n + 1 > 20, so n > 19 and N = 20.",
     "The even terms 4 + 2 ÷ n fall towards 4 and the odd terms −2 + 2 ÷ n towards −2, so limsup zₙ = 4."
    ],
    answer: "The limit is 2, N = 20 and limsup zₙ = 4."
   },
   pitfalls: [
    "Stopping at the number n must exceed. If n must be larger than 98, the smallest N is 99, not 98.",
    "Using ≤ where the promise says <. A term exactly ε away from the limit does not meet the promise.",
    "Taking the largest single term as the limsup. The early terms can be larger than every later one; the limsup is where the tails’ suprema settle."
   ]
  },
  guidance: [
   { prompt: "Divide the top and the bottom of xₙ = (3n + 5) ÷ (n + 2) by n. What number L does xₙ tend to?", answer: [3], labels: ["L"], explanation: "xₙ = (3 + 5 ÷ n) ÷ (1 + 2 ÷ n). Both pieces divided by n tend to 0, so xₙ tends to 3 ÷ 1 = 3." },
   { prompt: "|xₙ − 3| = 1 ÷ (n + 2). For this to be below 0.01, n + 2 must be larger than which number?", answer: [100], labels: ["n + d must exceed"], explanation: "1 ÷ (n + 2) < 0.01 exactly when n + 2 > 1 ÷ 0.01 = 100." },
   { prompt: "So |xₙ − L| < 0.01 exactly when n > 98. What is the smallest such whole number N?", answer: [99], labels: ["N"], explanation: "The first whole number above 98 is 99, and every later n also works because the distance keeps shrinking." },
   { prompt: "The even terms of zₙ are 6 + 3 ÷ n and the odd terms are 2 + 3 ÷ n. What is the limit superior of zₙ?", answer: [6], labels: ["limsup"], explanation: "The even terms come down towards 6 and the odd ones towards 2. The suprema of the tails fall to the larger of the two, so limsup zₙ = 6." }
  ]
 },
 {
  id: "q12", title: "The repeater that settles", topic: "Cauchy sequences", tier: "Intermediate", sector: "Relay Station",
  brief: "A relay repeater’s readings must be certified as settling before anyone knows what they settle to.",
  lesson: "A Cauchy sequence is one whose terms all end up within ε of each other: for every ε there is an N with |xₘ − xₙ| < ε for all m, n ≥ N.",
  prompt: "A relay repeater’s n-th reading is xₙ = 7 + 3 ÷ n, for n = 1, 2, 3, …. To certify it as a Cauchy sequence without using its limit, first enter the gap |x₄ − x₁₀|. For m, n ≥ N the gap |xₘ − xₙ| is always strictly below 3 ÷ N, and some pairs come as close to 3 ÷ N as we like. Enter the smallest N such that |xₘ − xₙ| < 0.02 for all m, n ≥ N.",
  answer: [0.45,150], labels: ["gap","smallest N"], tolerance: 0.0005,
  hints: [
   "The constant part of the reading cancels in every gap, so only the part that shrinks with n matters.",
   "For m and n both at least N, the shrinking parts both lie between 0 and their value at N. Find the largest gap they can come close to, then compare it with ε."
  ],
  solution: "x₄ = 7 + 3 ÷ 4 = 7.75 and x₁₀ = 7 + 3 ÷ 10 = 7.3, so the gap is 3 × (1 ÷ 4 − 1 ÷ 10) = 0.45; the 7 cancels. For m, n ≥ N, both 3 ÷ m and 3 ÷ n lie between 0 and 3 ÷ N, so |xₘ − xₙ| = |3 ÷ m − 3 ÷ n| is less than 3 ÷ N. Taking m = N and n very large makes the gap as close to 3 ÷ N as we like. So N works exactly when 3 ÷ N ≤ 0.02, that is N ≥ 3 ÷ 0.02 = 150. The smallest N is 150.",
  xp: 150, prereqs: ["q07"],
  artifact: { name: "Repeater settling tag", description: "A tag that promises the readings settle, signed without ever naming the limit." },
  sources: [source.s2_4],
  teaching: {
   intuition: "To prove that a sequence converges, the definition asks us to name the limit first. Often we cannot: the repeater only reports readings. A Cauchy sequence gets round this by comparing the terms with each other instead of with a limit. It promises that, for every tolerance ε > 0, there is an N such that any two terms from the N-th on, xₘ and xₙ, differ by less than ε. The terms crowd together. The great fact about the real numbers is that this is enough: a sequence of real numbers is Cauchy exactly when it converges. (It is the completeness of ℝ at work; among the rational numbers alone it fails, because the limit could be missing.) To find the N, look for the largest gap the terms from the N-th on can have. That largest gap may be a supremum that no single pair reaches, so check whether the promise needs < or ≤ there.",
   steps: [
    "Write the gap |xₘ − xₙ| and cancel whatever does not depend on m or n.",
    "For m, n ≥ N, find the supremum of the possible gaps. Note whether some pair reaches it or the gaps only come close to it.",
    "The promise needs every gap below ε. If the supremum is reached, it must be below ε; if it is only approached, it may equal ε.",
    "Solve for N and take the smallest whole number that works."
   ],
   example: {
    prompt: "xₙ = 5 + 2 ÷ n. Find |x₂ − x₈| and the smallest N with |xₘ − xₙ| < 0.05 for all m, n ≥ N.",
    steps: [
     "x₂ = 6 and x₈ = 5.25, so the gap is 0.75.",
     "For m, n ≥ N, 2 ÷ m and 2 ÷ n lie between 0 and 2 ÷ N, so every gap is below 2 ÷ N, and gaps come as close to 2 ÷ N as we like.",
     "So N works exactly when 2 ÷ N ≤ 0.05, that is N ≥ 40."
    ],
    answer: "The gap is 0.75 and the smallest N is 40."
   },
   pitfalls: [
    "Adding one out of habit. When the largest gap is only approached and never reached, N = k ÷ ε already works.",
    "Checking only neighbouring terms. The promise is about every pair m, n ≥ N, not just xₙ and xₙ₊₁.",
    "Working out the limit first. A Cauchy test never needs it: the constant part cancels in every gap."
   ]
  },
  guidance: [
   { prompt: "Work out x₄ and x₁₀ from xₙ = 7 + 3 ÷ n. What is the gap |x₄ − x₁₀|?", answer: [0.45], labels: ["gap"], explanation: "x₄ = 7.75 and x₁₀ = 7.3, so the gap is 0.45. The 7 cancels, which is why a Cauchy test never needs the limit." },
   { prompt: "For m, n ≥ N the gaps stay below 3 ÷ N and come as close to it as we like. So N works exactly when 3 ÷ N ≤ 0.02. What is the smallest such N?", answer: [150], labels: ["N"], explanation: "3 ÷ N ≤ 0.02 means N ≥ 3 ÷ 0.02 = 150. At N = 150 every gap is strictly below 3 ÷ 150 = 0.02." },
   { prompt: "Does N = 149 also work? Enter 1 if it does, 0 if it does not.", answer: [0], labels: ["1 or 0"], explanation: "With m = 149 and n very large, the gap comes as close to 3 ÷ 149 as we like, and that is more than 0.02, so some gap fails: 0." }
  ]
 },
 {
  id: "q13", title: "Summing the correction chain", topic: "Series as limits of partial sums; the tail", tier: "Intermediate", sector: "Relay Station",
  brief: "The relay stacks up an endless chain of small corrections, and the lab must say what they total and how much is still to come after the first few.",
  lesson: "A series is the limit of its partial sums; the tail after N terms is what the N-th partial sum still misses.",
  prompt: "The relay applies a chain of corrections without end: 24, 12, 6, …, each one the previous one divided by 2. The total correction is the sum of this series. Enter the partial sum s₄, the sum of the first 4 corrections, then the tail after 4 corrections: the sum of all the corrections from the 5th on.",
  answer: [45,3], labels: ["partial sum","tail"], tolerance: 0.01,
  hints: [
   "A partial sum adds only the first few terms. The sum of the whole series is the limit of its partial sums.",
   "A geometric series with first term a and ratio r between −1 and 1 sums to a ÷ (1 − r). The tail is the whole sum minus the partial sum."
  ],
  solution: "The first 4 terms are 24, 12, 6, 3, so s₄ = 24 + 12 + 6 + 3 = 45. The series is geometric with first term 24 and ratio 1 ÷ 2, so its sum is 24 ÷ (1 − 1 ÷ 2) = 24 × 2 = 48. The tail after 4 terms is the sum minus the partial sum: 48 − 45 = 3.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Correction ledger", description: "A running total of endless corrections, with the part still to come written beside it." },
  sources: [source.s2_5],
  teaching: {
   intuition: "An endless sum a₁ + a₂ + a₃ + … is a series, written Σ aₙ. Nobody can add infinitely many numbers, so the series is defined through its partial sums: s_N is the sum of the first N terms. The series converges, with sum S, when the sequence of partial sums s₁, s₂, s₃, … converges to S; otherwise it diverges. So every question about a series is a question about a sequence. The tail after N terms is the sum of all the terms from the (N + 1)-th on, and when the series converges it equals S − s_N: it shrinks to 0, which is exactly what convergence says. The Cauchy criterion from the last mission becomes, for series: the series converges exactly when the sums of long stretches of terms far out are all tiny. Two kinds of series have sums we can write down. A geometric series a + ar + ar² + … with −1 < r < 1 sums to a ÷ (1 − r). A telescoping series has terms that split as a difference, such as 1 ÷ (n(n + 1)) = 1 ÷ n − 1 ÷ (n + 1), so that a partial sum collapses to its first and last pieces.",
   steps: [
    "Write the first terms and add them to get the partial sum s_N.",
    "Find the sum S of the whole series as the limit of the partial sums: a ÷ (1 − r) for a geometric series, or the limit of the collapsed partial sum for a telescoping one.",
    "The tail after N terms is S − s_N.",
    "Check that the tail shrinks towards 0 as N grows: that is what it means for the series to converge."
   ],
   example: {
    prompt: "A geometric series 18 + 6 + 2 + … divides by 3 each time. Find s₂ and the tail after 2 terms.",
    steps: [
     "s₂ = 18 + 6 = 24.",
     "The sum is 18 ÷ (1 − 1 ÷ 3) = 18 × 3 ÷ 2 = 27.",
     "The tail is 27 − 24 = 3: the terms 2 + 2 ÷ 3 + 2 ÷ 9 + … add up to 3."
    ],
    answer: "s₂ = 24 and the tail after 2 terms is 3."
   },
   pitfalls: [
    "Treating the tail as the next term alone. The tail is the sum of every term after the N-th, not just the (N + 1)-th.",
    "Using a ÷ (1 − r) with a ratio of 1 or more. Such a geometric series diverges and has no sum.",
    "Cancelling the wrong pieces in a telescoping sum. Write out the first two or three differences to see which pieces survive."
   ]
  },
  guidance: [
   { prompt: "Add the first 4 corrections, 24, 12, 6, 3. What is s₄?", answer: [45], labels: ["partial sum"], explanation: "24 + 12 + 6 + 3 = 45." },
   { prompt: "The series is geometric with first term 24 and ratio 1 ÷ 2. What is its sum, 24 ÷ (1 − 1 ÷ 2)?", answer: [48], labels: ["sum of the series"], explanation: "1 − 1 ÷ 2 = 1 ÷ 2, so the sum is 24 × 2 = 48." },
   { prompt: "The tail is everything after the first 4 terms. What is the sum 48 minus the partial sum 45?", answer: [3], labels: ["tail"], explanation: "48 − 45 = 3. The partial sums close in on 48, and the tail is the part still missing." }
  ]
 },
 {
  id: "q14", title: "Signs that save a sum", topic: "Absolute and conditional convergence", tier: "Intermediate", sector: "Relay Station",
  brief: "Some relay corrections push one way and some the other, and the lab must say whether the total holds up because of the sizes or only because of the signs.",
  lesson: "A series converges absolutely when the series of sizes Σ |aₙ| converges; one that converges while Σ |aₙ| diverges converges only conditionally.",
  prompt: "A relay’s correction readings alternate in sign: aₙ = (−1)ⁿ⁺¹ × 36 ÷ n², for n = 1, 2, 3, …. Enter 1 if the series Σ aₙ converges absolutely, or 0 if it converges only conditionally. Then enter the partial sum s₃ of the first 3 terms.",
  answer: [1,31], labels: ["1 absolute, 0 conditional","partial sum"], tolerance: 0.01,
  hints: [
   "Absolute convergence asks about the series of sizes, Σ |aₙ|, with every sign made positive. That is a p-series times a constant.",
   "A p-series Σ 1 ÷ nᵖ converges when p > 1 and diverges when p ≤ 1. For the partial sum, add the first terms with their signs."
  ],
  solution: "The sizes are |aₙ| = 36 ÷ n², 36 times the p-series with p = 2. Because 2 > 1, Σ |aₙ| converges, so the series converges absolutely: 1. The first 3 terms are 36, −9, 4, so s₃ = 36 − 9 + 4 = 31.",
  xp: 150, prereqs: ["q13"],
  artifact: { name: "Sign-and-size chart", description: "Two columns, the corrections with their signs and without, and which column has a finite total." },
  sources: [source.s2_5],
  teaching: {
   intuition: "A series with mixed signs can converge for two quite different reasons. If the sizes alone add up to a finite total, the series is safe whatever the signs do: it converges absolutely, meaning Σ |aₙ| converges, and absolute convergence always implies convergence. But a series can also converge only because its positive and negative terms cancel each other: Σ |aₙ| diverges, yet Σ aₙ converges. Then it converges conditionally, and we speak of conditional convergence. The standard example is the alternating harmonic series 1 − 1 ÷ 2 + 1 ÷ 3 − 1 ÷ 4 + …: the sizes form the harmonic series, which diverges, while the signed series converges by the alternating series test from Calculus 2 (the terms alternate in sign and their sizes shrink to 0). To test for absolute convergence, make every sign positive and compare with a p-series Σ 1 ÷ nᵖ, which converges when p > 1 and diverges when p ≤ 1.",
   steps: [
    "Make every sign positive: write |aₙ|.",
    "Recognise Σ |aₙ| as a constant times a p-series and read off p.",
    "If p > 1, the series converges absolutely. If p ≤ 1 but the signs alternate and the sizes shrink to 0, it converges only conditionally.",
    "For a partial sum, add the first terms with their signs."
   ],
   example: {
    prompt: "aₙ = (−1)ⁿ⁺¹ × 12 ÷ n. Does Σ aₙ converge absolutely or only conditionally? Find s₄.",
    steps: [
     "|aₙ| = 12 ÷ n is 12 times the harmonic series, p = 1, which diverges.",
     "The signs alternate and the sizes shrink to 0, so the series converges, only conditionally.",
     "The first four terms are 12, −6, 4, −3, so s₄ = 7."
    ],
    answer: "Only conditionally (0), and s₄ = 7."
   },
   pitfalls: [
    "Testing the signed series instead of the sizes. Absolute convergence is about Σ |aₙ|.",
    "Calling p = 1 convergent. The harmonic series Σ 1 ÷ n diverges, although its terms shrink to 0.",
    "Dropping the signs in the partial sum. The partial sum adds the terms as they are, signs included."
   ]
  },
  guidance: [
   { prompt: "Make every sign positive: |aₙ| = 36 ÷ n². Which power p of n is this, up to the constant 36?", answer: [2], labels: ["p"], explanation: "36 ÷ n² is 36 × 1 ÷ n², a p-series with p = 2." },
   { prompt: "A p-series converges exactly when p > 1. Enter 1 if Σ aₙ converges absolutely, 0 if only conditionally.", answer: [1], labels: ["1 or 0"], explanation: "p = 2 > 1, so the sizes add up to a finite total: absolute convergence, 1." },
   { prompt: "The first 3 terms are 36, −9, 4. What is their sum s₃?", answer: [31], labels: ["partial sum"], explanation: "36 − 9 + 4 = 31." }
  ]
 },
 {
  id: "q15", title: "A ceiling for the corrections", topic: "Comparison and p-series bounds", tier: "Intermediate", sector: "Relay Station",
  brief: "Nobody can sum the relay’s corrections exactly, so the lab will certify a ceiling the total can never pass.",
  lesson: "If 0 ≤ aₙ ≤ bₙ and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ.",
  prompt: "The relay’s corrections are aₙ = 12 ÷ (3ⁿ + 1), for n = 1, 2, 3, …. Compare each term with bₙ = 12 ÷ 3ⁿ. Enter the upper bound on Σ aₙ given by the whole comparison series Σ bₙ, then the sharper upper bound a₁ + (b₂ + b₃ + b₄ + …), which keeps the first term exact.",
  answer: [6,5], labels: ["comparison bound","sharper bound"], tolerance: 0.01,
  hints: [
   "If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ.",
   "The comparison series here is geometric, so its sum is its first term divided by 1 minus its ratio. For the sharper bound, swap its first term for the exact first term of Σ aₙ."
  ],
  solution: "Since 3ⁿ + 1 > 3ⁿ, every aₙ is smaller than bₙ. Σ bₙ is geometric with first term 12 ÷ 3 = 4 and ratio 1 ÷ 3, so it sums to 4 ÷ (1 − 1 ÷ 3) = 12 ÷ 2 = 6. So Σ aₙ ≤ 6. For the sharper bound, a₁ = 12 ÷ 4 = 3 and b₁ = 4, so Σ aₙ ≤ 3 + (6 − 4) = 5.",
  xp: 150, prereqs: ["q14"],
  artifact: { name: "Ceiling certificate", description: "A total that cannot be computed, capped by one that can." },
  sources: [source.s2_5],
  teaching: {
   intuition: "Most series have no sum we can write down, but we can often trap one. The comparison test says: if every term satisfies 0 ≤ aₙ ≤ bₙ and Σ bₙ converges, then Σ aₙ converges too, and its sum is at most Σ bₙ. The reason is that the partial sums of Σ aₙ only increase and never pass Σ bₙ, so they are bounded and increasing, and so they converge. To use it, make the bottom of each term smaller (which makes the term bigger) until you reach a series you can sum: a geometric series, or a telescoping one such as Σ 1 ÷ (n(n + 1)) = 1. The p-series Σ 1 ÷ nᵖ is the other common comparison: it converges for p > 1 and diverges for p ≤ 1, so it settles whether a series converges, though for a number we still need a sum we know. A bound can be sharpened: keep the first term or two exact and compare only the rest.",
   steps: [
    "Check that every term is positive and find a simpler bₙ with aₙ ≤ bₙ for every n.",
    "Sum the comparison series Σ bₙ: geometric (first term ÷ (1 − ratio)) or telescoping.",
    "Σ aₙ ≤ Σ bₙ is the comparison bound.",
    "For a sharper bound, keep a₁ exact: Σ aₙ ≤ a₁ + (Σ bₙ − b₁)."
   ],
   example: {
    prompt: "aₙ = 6 ÷ (2ⁿ + 1). Bound Σ aₙ by comparing with bₙ = 6 ÷ 2ⁿ, then sharpen the bound with the exact first term.",
    steps: [
     "2ⁿ + 1 > 2ⁿ, so aₙ < bₙ.",
     "Σ 6 ÷ 2ⁿ is geometric with first term 3 and ratio 1 ÷ 2, so it sums to 3 ÷ (1 ÷ 2) = 6.",
     "a₁ = 6 ÷ 3 = 2 and b₁ = 3, so the sharper bound is 2 + (6 − 3) = 5."
    ],
    answer: "Σ aₙ ≤ 6, and more sharply Σ aₙ ≤ 5."
   },
   pitfalls: [
    "Comparing in the wrong direction. A series smaller than a divergent one, or larger than a convergent one, tells you nothing.",
    "Starting the geometric sum at the wrong term. Σ k ÷ qⁿ from n = 1 has first term k ÷ q, not k.",
    "Taking the bound for the sum itself. Σ aₙ is at most the bound, usually strictly less."
   ]
  },
  guidance: [
   { prompt: "Σ bₙ is geometric with first term 12 ÷ 3 and ratio 1 ÷ 3. What is its sum?", answer: [6], labels: ["comparison bound"], explanation: "(12 ÷ 3) ÷ (1 − 1 ÷ 3) = 12 ÷ 2 = 6. Every aₙ is below bₙ, so Σ aₙ ≤ 6." },
   { prompt: "What is the exact first term a₁ = 12 ÷ (3 + 1)?", answer: [3], labels: ["a₁"], explanation: "a₁ = 12 ÷ 4 = 3." },
   { prompt: "What is the comparison’s first term b₁ = 12 ÷ 3?", answer: [4], labels: ["b₁"], explanation: "b₁ = 12 ÷ 3 = 4, a little more than a₁ = 3." },
   { prompt: "Keep a₁ exact and compare only the rest: a₁ + (Σ bₙ − b₁). What is the sharper bound?", answer: [5], labels: ["sharper bound"], explanation: "3 + (6 − 4) = 5." }
  ]
 },
 {
  id: "q16", title: "Ratio, root and the alternating estimate", topic: "Ratio, root and alternating series tests", tier: "Intermediate", sector: "Relay Station",
  brief: "Two more correction series arrive at the relay: one must be judged by how its terms shrink, the other summed to a guaranteed accuracy.",
  lesson: "The ratio and root tests compare a series with a geometric one; for an alternating series with shrinking sizes, the sum lies within the next term of every partial sum.",
  prompt: "Two correction series are logged at the relay station. Series A has terms aₙ = n² × 2ⁿ ÷ 3ⁿ. Enter the limit of |aₙ₊₁ ÷ aₙ| as a fraction in lowest terms, numerator then denominator, then 1 if the ratio test shows that Σ aₙ converges, or 0 if it shows that Σ aₙ diverges. Series B is 5 − 5 ÷ 2 + 5 ÷ 3 − 5 ÷ 4 + …, with terms (−1)ⁿ⁺¹ × 5 ÷ n and sum S. Its sizes shrink to 0, so S lies within the next term of every partial sum: |S − s_N| ≤ 5 ÷ (N + 1). Enter the smallest N for which this bound guarantees |S − s_N| < 0.01.",
  answer: [2,3,1,500], labels: ["ratio numerator","ratio denominator","1 converges, 0 diverges","smallest N"], tolerance: 0.001,
  hints: [
   "Divide the (n + 1)-th term by the n-th term and cancel. A power of n over a power of n + 1 tends to 1.",
   "The ratio test: a limit below 1 means convergence, above 1 means divergence. For series B, solve the bound inequality for N + 1 first."
  ],
  solution: "aₙ₊₁ ÷ aₙ = ((n + 1) ÷ n)² × 2 ÷ 3. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to 2/3. This is below 1, so by the ratio test Σ aₙ converges (absolutely): 1. The root test agrees: the n-th root of aₙ also tends to 2/3. For series B, 5 ÷ (N + 1) < 0.01 means N + 1 > 5 ÷ 0.01 = 500, so N ≥ 500. The smallest N is 500.",
  xp: 150, prereqs: ["q15"],
  artifact: { name: "Test bench readout", description: "A ratio that settles below one, and a count of terms that pins a sum to the second decimal." },
  sources: [source.s2_6],
  teaching: {
   intuition: "A geometric series converges when its ratio is below 1. The ratio test and the root test ask whether a series behaves like a geometric one in the long run. The ratio test, met in Calculus 2, looks at L = lim |aₙ₊₁ ÷ aₙ|; the root test looks at the limit of the n-th root of |aₙ|. In both, L < 1 means the series converges absolutely, L > 1 means it diverges, and L = 1 decides nothing. Powers of n do not change L: (n + 1) ÷ n tends to 1, and so does the n-th root of n. The alternating series test covers series whose signs alternate and whose sizes decrease to 0: they converge. It also gives a guarantee, worked out here from how the partial sums move. Each new term steps past the sum S and back, overshooting less each time, so S always lies between two neighbouring partial sums, s_N and the one after it. Their distance is the size of term N + 1, so |S − s_N| is at most the size of the next term.",
   steps: [
    "For the ratio test, divide term n + 1 by term n and cancel; powers of n leave a factor tending to 1.",
    "Read the limit L: below 1, the series converges; above 1, it diverges; equal to 1, use another test.",
    "For an alternating series with sizes decreasing to 0, the error after N terms is at most the size of term N + 1.",
    "To guarantee an error below ε, solve \"size of term N + 1 < ε\" for N and take the smallest whole number."
   ],
   example: {
    prompt: "aₙ = n × 3ⁿ ÷ 4ⁿ. Find the ratio limit and decide convergence. Then, for 3 − 3 ÷ 2 + 3 ÷ 3 − …, find the smallest N that guarantees an error below 0.1.",
    steps: [
     "aₙ₊₁ ÷ aₙ = ((n + 1) ÷ n) × 3 ÷ 4, which tends to 3/4.",
     "3/4 < 1, so Σ aₙ converges.",
     "The error bound is 3 ÷ (N + 1) < 0.1, so N + 1 > 30 and N = 30."
    ],
    answer: "The ratio limit is 3/4, so the series converges; N = 30."
   },
   pitfalls: [
    "Reading L = 1 as convergence or divergence. The test is silent there: Σ 1 ÷ n and Σ 1 ÷ n² both have L = 1.",
    "Using the N-th term instead of the next one. The error after N terms is bounded by term N + 1.",
    "Forgetting that the alternating estimate needs the sizes to decrease to 0. Without that, the partial sums need not trap the sum."
   ]
  },
  guidance: [
   { prompt: "aₙ₊₁ ÷ aₙ = ((n + 1) ÷ n)² × 2 ÷ 3. It tends to a fraction. Written in lowest terms, what is its numerator?", answer: [2], labels: ["numerator"], explanation: "(n + 1) ÷ n tends to 1, so the ratio tends to 2/3, already in lowest terms. Its numerator is 2." },
   { prompt: "Same limit of the ratio, in lowest terms. What is its denominator?", answer: [3], labels: ["denominator"], explanation: "The limit is 2/3, so its denominator is 3." },
   { prompt: "The ratio limit is 2/3. Enter 1 if the ratio test shows convergence, 0 if it shows divergence.", answer: [1], labels: ["1 or 0"], explanation: "2/3 < 1, so Σ aₙ converges: 1." },
   { prompt: "For series B, the bound 5 ÷ (N + 1) must be strictly below 0.01. Solve for N + 1 first. What is the smallest whole number N that does it?", answer: [500], labels: ["N"], explanation: "5 ÷ (N + 1) < 0.01 needs N + 1 > 5 ÷ 0.01 = 500, so N + 1 is at least 501 and N is at least 500. At N = 499 the bound would equal 0.01 instead of being below it." }
  ]
 },
 {
  id: "q17", title: "The last link in the relay", topic: "Chapter review: a relay of corrections", tier: "Intermediate", sector: "Relay Station",
  brief: "The final chain of relay corrections needs its certificate: how it converges, and how far a short sum can be from the true total.",
  lesson: "Decide convergence by comparing the sizes with a p-series, then bound the error of a partial sum with the alternating estimate.",
  prompt: "The relay’s final chain of corrections is cₙ = (−1)ⁿ⁺¹ × 3 ÷ (n + 1)², for n = 1, 2, 3, …, with sum S. Enter 1 if Σ cₙ converges absolutely, or 0 if it converges only conditionally. Then enter the bound on the error |S − s₃| after 3 terms that the alternating series estimate guarantees.",
  answer: [1,0.12], labels: ["1 absolute, 0 conditional","error bound"], tolerance: 0.00005,
  hints: [
   "Compare the sizes |cₙ| with a p-series: make the bottom bigger or smaller in a way you can control.",
   "When the sizes of an alternating series shrink to 0, the sum lies within the next term of every partial sum."
  ],
  solution: "|cₙ| = 3 ÷ (n + 1)² ≤ 3 ÷ n², and Σ 3 ÷ n² is a p-series with p = 2 > 1, so it converges. By comparison Σ |cₙ| converges, and the series converges absolutely: 1. The sizes decrease to 0, so S lies within the next term of s₃: |S − s₃| ≤ |c₄| = 3 ÷ (4 + 1)² = 3 ÷ 25 = 0.12.",
  xp: 150, prereqs: ["q16"],
  artifact: { name: "Relay station certificate", description: "The chapter’s seal: a series judged by its sizes, and its error pinned down." },
  sources: [source.s2_5, source.s2_6],
  teaching: {
   intuition: "This review joins the chapter’s tools on one series. First, the sizes: make every sign positive and compare |cₙ| with a p-series. If the bottom grows like n², the sizes are smaller than a convergent p-series and the series converges absolutely. If the bottom only grows like n, the sizes are at least a fixed fraction of the harmonic series and Σ |cₙ| diverges; with alternating signs and sizes shrinking to 0 the series still converges, but only conditionally. Either way, when the signs alternate and the sizes decrease to 0, the sum S lies within the next term of every partial sum, so the error of s_N is at most the size of term N + 1. That bound is what the lab writes on the certificate.",
   steps: [
    "Write |cₙ| and compare it with a p-series: make the bottom smaller to get an upper bound, or larger in a controlled way to get a lower bound.",
    "Decide: sizes below a convergent series mean absolute convergence (1); sizes above a divergent one, with alternating signs, mean only conditional convergence (0).",
    "For the error after N terms, put n = N + 1 into |cₙ|.",
    "Work the bound out exactly."
   ],
   example: {
    prompt: "cₙ = (−1)ⁿ⁺¹ × 1 ÷ (n + 1). Does it converge absolutely? What is the error bound after 4 terms?",
    steps: [
     "n + 1 ≤ 2n, so |cₙ| ≥ 1 ÷ (2n), half the harmonic series, which diverges.",
     "The signs alternate and the sizes shrink to 0, so the series converges only conditionally: 0.",
     "The error after 4 terms is at most |c₅| = 1 ÷ 6."
    ],
    answer: "Only conditionally (0); the error after 4 terms is at most 1 ÷ 6."
   },
   pitfalls: [
    "Using the shift in the bottom to change the verdict. 1 ÷ (n + 3) still behaves like 1 ÷ n, so Σ of its sizes diverges.",
    "Bounding the error by the last term added instead of the next one.",
    "Forgetting the shift when putting n = N + 1 into (n + d): the bottom is N + 1 + d."
   ]
  },
  guidance: [
   { prompt: "Compare |cₙ| = 3 ÷ (n + 1)² with a p-series. Enter 1 if Σ |cₙ| converges, 0 if it diverges.", answer: [1], labels: ["1 or 0"], explanation: "3 ÷ (n + 1)² ≤ 3 ÷ n², a p-series with p = 2 > 1, so Σ |cₙ| converges: 1." },
   { prompt: "The error after 3 terms is at most the size of the next term, |c₄|. Which number is n + 1 for n = 4?", answer: [5], labels: ["n + d"], explanation: "4 + 1 = 5." },
   { prompt: "What is the bound |c₄| = 3 ÷ 5²?", answer: [0.12], labels: ["error bound"], explanation: "3 ÷ 25 = 0.12." }
  ]
 },
 {
  id: "q18", title: "How close is close enough", topic: "ε–δ limits of functions", tier: "Intermediate", sector: "Thermostat Hall",
  brief: "Thermostat Hall wants a written tolerance for every dial: how near the setting must be for the reading to land within the promise.",
  lesson: "f(x) → L as x → c means: for every ε > 0 there is a δ > 0 with |f(x) − L| < ε whenever 0 < |x − c| < δ.",
  prompt: "A thermostat’s dial reads f(x) = 4x − 3 for a control setting x, and f(x) → 5 as x → 2. Enter the largest δ such that |f(x) − 5| < 0.2 whenever 0 < |x − 2| < δ. A second gauge reads g(x) = x², and g(x) → 9 as x → 3. Enter the largest δ such that |x² − 9| < 0.61 whenever 0 < |x − 3| < δ.",
  answer: [0.05,0.1], labels: ["largest δ for f","largest δ for g"], tolerance: 0.00005,
  hints: [
   "For a straight line, the output gap is the slope’s size times the input gap, so solve |slope| × δ = ε.",
   "For x², the output grows faster to the right of the point, so the right side is the one that limits δ: solve (c + δ)² = c² + ε."
  ],
  solution: "f(x) − 5 = 4(x − 2), so |f(x) − 5| = 4 × |x − 2|. That is below 0.2 exactly when |x − 2| < 0.2 ÷ 4 = 0.05. So δ = 0.05 works, and any larger δ lets in an x whose gap from 2 is just above 0.05, where |f(x) − 5| is 0.2 or more. For g, the right side binds: x² < 9 + 0.61 = 9.61 means x < √9.61 = 3.1, which is 3 + 0.1. On the left, every x between 2.9 and 3 has x² > 2.9² = 8.41, which is above 9 − 0.61 = 8.39, so the left side never fails first. The largest δ for g is 0.1.",
  xp: 150, prereqs: ["q07"],
  artifact: { name: "Dial tolerance card", description: "For each dial, the output promise ε and the input window δ that keeps it." },
  sources: [source.s3_1],
  teaching: {
   intuition: "For a sequence, a limit promise says: name a tolerance ε, and from some index N on every term is within ε. For a function the inputs do not march along an index; they come close to a point c. So the promise uses a second small number, δ (the Greek letter delta), for how close the input must be. We say f(x) → L as x → c when, for every ε > 0, there is a δ > 0 such that |f(x) − L| < ε for every x in the domain with 0 < |x − c| < δ. The condition 0 < |x − c| leaves out x = c itself: the limit is about the values near c, not at c. For this to say anything, the domain must have points as close to c as we like; such a c is called a cluster point of the domain. Here the domain is every real number, so every c is a cluster point. Given ε, finding δ is a design job: for a straight line the output gap is the slope’s size times the input gap, so δ = ε ÷ |slope| exactly. For a curve such as x², the output changes faster on one side, and that side sets δ.",
   steps: [
    "Write |f(x) − L| in terms of |x − c|.",
    "For f(x) = mx + b, |f(x) − L| = |m| × |x − c|, so the largest δ is ε ÷ |m|.",
    "For g(x) = x² near c > 0, the right side is tighter: solve (c + δ)² = c² + ε, that is c + δ = √(c² + ε).",
    "Check the other side: for x between c − δ and c, x² stays above c² − ε, so that side never fails first."
   ],
   example: {
    prompt: "f(x) = 3x + 1 tends to 4 as x → 1, with ε = 0.6; g(x) = x² tends to 1 as x → 1, with ε = 0.21. Find the largest δ for each.",
    steps: [
     "|f(x) − 4| = 3 × |x − 1|, so δ = 0.6 ÷ 3 = 0.2.",
     "For g, x² < 1.21 means x < √1.21 = 1.1, so δ = 0.1 on the right.",
     "On the left, 0.9² = 0.81 is above 1 − 0.21 = 0.79, so the left side is safe."
    ],
    answer: "δ = 0.2 for f and δ = 0.1 for g."
   },
   pitfalls: [
    "Dividing by the slope with its sign. δ is a distance, so use |m|.",
    "Using the left side of x² to set δ. Near a positive point the output grows faster to the right, so the right side binds.",
    "Treating δ as anything that works. The question asks for the largest δ, the exact edge beyond which some x fails."
   ]
  },
  guidance: [
   { prompt: "|f(x) − 5| = 4 × |x − 2|. What is the largest δ with 4 × δ ≤ 0.2?", answer: [0.05], labels: ["δ for f"], explanation: "δ = 0.2 ÷ 4 = 0.05. Inside that distance the output gap is below 0.2; just outside it is not." },
   { prompt: "On the right of 3, x² stays below 9 + 0.61 = 9.61 only while x < √9.61. What is √9.61?", answer: [3.1], labels: ["square root"], explanation: "3.1 × 3.1 = 9.61, so √9.61 = 3.1." },
   { prompt: "The left side is safe, since 2.9² = 8.41 is above 8.39. What is the largest δ for g?", answer: [0.1], labels: ["δ for g"], explanation: "δ is the distance from 3 to 3.1: 3.1 − 3 = 0.1." }
  ]
 },
 {
  id: "q19", title: "The heater that never jumps", topic: "Continuity by ε–δ and by sequences", tier: "Intermediate", sector: "Thermostat Hall",
  brief: "A heater’s output must be certified continuous at its working setting, checked two ways: by a δ window and by a run of test settings.",
  lesson: "f is continuous at c when for every ε > 0 there is a δ > 0 with |f(x) − f(c)| < ε whenever |x − c| < δ; equivalently, f(xₙ) → f(c) for every sequence xₙ → c.",
  prompt: "A heater’s output is f(x) = 2x + 1 for a setting x. To test continuity at x = 3, the lab feeds in the settings xₙ = 3 + (−1)ⁿ × 2 ÷ n, which tend to 3. Enter f(x₁₀). Then enter the largest δ such that |f(x) − f(3)| < 0.1 whenever |x − 3| < δ. Finally enter the smallest n such that |f(xₙ) − f(3)| < 0.1 for that n and every later one.",
  answer: [7.4,0.05,41], labels: ["f at the test setting","largest δ","smallest n"], tolerance: 0.0005,
  hints: [
   "For a straight line, the output gap is the size of the slope times the input gap.",
   "The n-th setting is k ÷ n away from the point, so the output gap is |slope| × k ÷ n. Solve that inequality for n."
  ],
  solution: "x₁₀ = 3 + 2 ÷ 10 = 3.2, so f(x₁₀) = 2 × 3.2 + 1 = 7.4. Since f(3) = 7, |f(x) − 7| = 2 × |x − 3|, which is below 0.1 exactly when |x − 3| < 0.1 ÷ 2 = 0.05; so the largest δ is 0.05. For the sequence, |xₙ − 3| = 2 ÷ n, so |f(xₙ) − 7| = 4 ÷ n. This is below 0.1 exactly when n > 4 ÷ 0.1 = 40, so from n = 41 on. Those are exactly the n with 2 ÷ n < 0.05, where xₙ is within δ of 3.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Heater continuity seal", description: "A δ window and a run of test settings that agree on one promise." },
  sources: [source.s3_2],
  teaching: {
   intuition: "A limit says what f(x) closes in on near c. Continuity at c asks for more: that the value at c is exactly that limit. In ε–δ form, f is continuous at c when, for every ε > 0, there is a δ > 0 such that |f(x) − f(c)| < ε for every x with |x − c| < δ. (This time x = c is allowed, since f(c) is the target itself.) There is a second, equivalent test, sequential continuity: f is continuous at c exactly when, for every sequence of inputs xₙ that converges to c, the outputs f(xₙ) converge to f(c). The two fit together: once the inputs xₙ are within δ of c, the outputs are within ε of f(c), so the N for the outputs comes from the δ for the inputs. Sequences are often the easier way to show that f is not continuous: one sequence xₙ → c with f(xₙ) not tending to f(c) is enough.",
   steps: [
    "Evaluate f at the requested term xₙ of the test sequence.",
    "Find the largest δ: for f(x) = mx + b, |f(x) − f(c)| = |m| × |x − c|, so δ = ε ÷ |m|.",
    "For the sequence, write |xₙ − c| in terms of n, multiply by |m| to get |f(xₙ) − f(c)|, and solve for n.",
    "Check the link: those n are exactly the ones where |xₙ − c| < δ."
   ],
   example: {
    prompt: "f(x) = 3x − 2 at x = 1, with xₙ = 1 + 1 ÷ n and ε = 0.3. Find f(x₅), the largest δ and the smallest n from which |f(xₙ) − f(1)| < 0.3.",
    steps: [
     "x₅ = 1.2, so f(x₅) = 3.6 − 2 = 1.6.",
     "|f(x) − 1| = 3 × |x − 1|, so δ = 0.3 ÷ 3 = 0.1.",
     "|f(xₙ) − 1| = 3 ÷ n < 0.3 means n > 10, so from n = 11 on, exactly where 1 ÷ n < 0.1."
    ],
    answer: "f(x₅) = 1.6, δ = 0.1, and n = 11."
   },
   pitfalls: [
    "Forgetting the sign (−1)ⁿ in the test settings. Odd terms sit below c and even terms above it.",
    "Stopping at the number n must exceed. If n > 40, the first n that works is 41.",
    "Thinking one well-behaved sequence proves continuity. Sequential continuity needs every sequence tending to c; one bad sequence disproves it."
   ]
  },
  guidance: [
   { prompt: "The 10th setting is x₁₀ = 3 + 2 ÷ 10. What is f(x₁₀)?", answer: [7.4], labels: ["f at the setting"], explanation: "x₁₀ = 3.2, and f(3.2) = 2 × 3.2 + 1 = 7.4." },
   { prompt: "|f(x) − f(3)| = 2 × |x − 3|. What is the largest δ that keeps this below 0.1?", answer: [0.05], labels: ["δ"], explanation: "2 × δ = 0.1 gives δ = 0.05." },
   { prompt: "|f(xₙ) − f(3)| = 4 ÷ n. What is the smallest n from which this stays below 0.1?", answer: [41], labels: ["n"], explanation: "4 ÷ n < 0.1 means n > 40, so the first such n is 41, and the gap keeps shrinking after it." }
  ]
 },
 {
  id: "q20", title: "Where the heating law switches", topic: "Discontinuities", tier: "Intermediate", sector: "Thermostat Hall",
  brief: "A thermostat changes its heating law at one setting, and the hall must know whether the output survives the switch, breaks for one value, or jumps.",
  lesson: "At a switching point, compare the two one-sided limits and the value: different limits make a jump; equal limits that miss the value make a removable discontinuity.",
  prompt: "A thermostat switches its heating law at x = 2: f(x) = 3x − 1 for x < 2, f(2) = 8, and f(x) = x² + 1 for x > 2. Enter the left-hand limit of f at 2, then the right-hand limit, then a code: 0 if f is continuous at 2, 1 if it has a removable discontinuity there, 2 if it has a jump discontinuity.",
  answer: [5,5,1], labels: ["left-hand limit","right-hand limit","code"], tolerance: 0.01,
  hints: [
   "Each one-sided limit uses only the piece on that side, put in at the switching point; the value f(c) itself plays no part in either limit.",
   "Different one-sided limits make a jump. Equal ones that differ from the value make a removable discontinuity. Equal ones that match the value mean continuity."
  ],
  solution: "From the left, 3x − 1 tends to 3 × 2 − 1 = 5. From the right, x² + 1 tends to 4 + 1 = 5. The one-sided limits agree, so the limit is 5, but f(2) = 8 is different: redefining that one value would mend it, so this is a removable discontinuity, code 1.",
  xp: 150, prereqs: ["q19"],
  artifact: { name: "Switch-point report", description: "Two one-sided readings and the value at the switch, with the verdict stamped beside them." },
  sources: [source.s3_2],
  teaching: {
   intuition: "A function made of pieces can fail to be continuous where the pieces meet, and there are two very different ways to fail. The tools are the one-sided limits: the left-hand limit is what f(x) closes in on as x approaches c from below, using only the piece for x < c, and the right-hand limit uses only the piece for x > c. The value f(c) plays no part in either. If the two one-sided limits differ, the graph tears apart at c: a jump discontinuity, and no choice of f(c) can mend it. If they agree, the limit exists. Then either f(c) equals it, and f is continuous at c, or f(c) is some other number. That is a removable discontinuity: changing the single value f(c) to the limit would make f continuous. In sequence terms, a jump means settings approaching from the two sides give outputs settling to two different levels.",
   steps: [
    "Find the left-hand limit by putting c into the piece used for x < c.",
    "Find the right-hand limit by putting c into the piece used for x > c.",
    "If they differ, it is a jump discontinuity (code 2).",
    "If they agree, compare with f(c): equal means continuous (code 0), different means removable (code 1)."
   ],
   example: {
    prompt: "f(x) = 2x + 1 for x < 1, f(1) = 4, and f(x) = x² + 2 for x > 1. Classify x = 1.",
    steps: [
     "From the left, 2x + 1 tends to 3.",
     "From the right, x² + 2 tends to 3.",
     "The limits agree at 3, but f(1) = 4, so the discontinuity is removable."
    ],
    answer: "Both one-sided limits are 3; removable, code 1."
   },
   pitfalls: [
    "Using f(c) as a one-sided limit. The limits come from the pieces near c, never from the value at c.",
    "Calling a removable discontinuity a jump. If the two sides agree, there is no jump, whatever f(c) is.",
    "Putting c into the wrong piece. The left-hand limit uses the rule for x < c only."
   ]
  },
  guidance: [
   { prompt: "Only the left piece 3x − 1 matters for x just below 2. What is the left-hand limit?", answer: [5], labels: ["left-hand limit"], explanation: "3 × 2 − 1 = 5." },
   { prompt: "Only the right piece x² + 1 matters for x just above 2. What is the right-hand limit?", answer: [5], labels: ["right-hand limit"], explanation: "4 + 1 = 5." },
   { prompt: "The limits are 5 and 5, and f(2) = 8. Which code fits: 0 continuous, 1 removable, 2 jump?", answer: [1], labels: ["code"], explanation: "The limits agree but the value is different: removable, code 1." }
  ]
 }
);
})();
