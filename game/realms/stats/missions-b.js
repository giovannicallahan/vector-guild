/* Data and inference missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/stats/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Spread and sampling · Basic, 100 XP · sector 'Survey Camp' · Chapter review: summarising a survey [2.7, 7.1]
     q12  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · Point estimate, confidence level and margin of error (σ known) [8.1]
     q13  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · The confidence interval for a mean, and the sample size for a target margin [8.1]
     q14  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · Student's t distribution and degrees of freedom [8.2]
     q15  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · The t interval for a mean [8.2]
     q16  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · The confidence interval for a proportion [8.3]
     q17  ch 3 Estimating with confidence · Intermediate, 150 XP · sector 'Assay Lab' · Chapter review: which interval? [8.1, 8.2, 8.3]
     q18  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · Null and alternative hypotheses [9.1]
     q19  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · Type I and Type II errors, α, β and power [9.2]
     q20  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · The test statistic for a mean [9.5] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Introductory Statistics 2e — 2.3 Measures of the Location of the Data
   Link to the section page itself: https://openstax.org/books/introductory-statistics-2e/pages/<section-slug> */
const source = {
 s2_7: { title: "OpenStax Introductory Statistics 2e — 2.7 Measures of the Spread of the Data", url: "https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data", description: "The sample variance and sample standard deviation, dividing by n − 1.", verified: '2026-11-27' },
 s7_1: { title: "OpenStax Introductory Statistics 2e — 7.1 The Central Limit Theorem for Sample Means (Averages)", url: "https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages", description: "The spread of the sample mean and the standard error of the mean σ ÷ √n.", verified: '2026-11-27' },
 s8_2: { title: "OpenStax Introductory Statistics 2e — 8.2 A Single Population Mean using the Student t Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/8-2-a-single-population-mean-using-the-student-t-distribution", description: "Using s for an unknown σ, Student’s t distribution, degrees of freedom n − 1, the t table and the t interval.", verified: '2026-11-27' },
 s8_1: { title: "OpenStax Introductory Statistics 2e — 8.1 A Single Population Mean using the Normal Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution", description: "Point estimates, confidence levels, the error bound z × σ ÷ √n, the interval for a mean, and the sample size for a chosen error bound, rounded up.", verified: '2026-11-27' },
 s8_3: { title: "OpenStax Introductory Statistics 2e — 8.3 A Population Proportion", url: "https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion", description: "The sample proportion p′ = x ÷ n, its error bound z × √(p′q′ ÷ n), and the interval for a proportion.", verified: '2026-11-27' },
 s9_1: { title: "OpenStax Introductory Statistics 2e — 9.1 Null and Alternative Hypotheses", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-1-null-and-alternative-hypotheses", description: "H₀ and Hₐ, and which symbols (=, ≥, ≤ against ≠, <, >) each may use.", verified: '2026-11-27' },
 s9_5: { title: "OpenStax Introductory Statistics 2e — 9.5 Additional Information and Full Hypothesis Test Examples", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-5-additional-information-and-full-hypothesis-test-examples", description: "Full tests: left-, right- and two-tailed tests read from Hₐ, and the z test statistic for a mean with σ known.", verified: '2026-11-27' },
 s9_2: { title: "OpenStax Introductory Statistics 2e — 9.2 Outcomes and the Type I and Type II Errors", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-2-outcomes-and-the-type-i-and-type-ii-errors", description: "The four outcomes of a test, Type I and Type II errors, α, β and the power 1 − β.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: "The survey report", topic: "Chapter review: summarising a survey", tier: 'Basic', sector: 'Survey Camp',
  brief: "The survey team is back from the ice fields with one small set of depth readings, and Mira wants the whole survey summed up in three numbers.",
  lesson: "A small survey is summed up by its mean x̄, its sample standard deviation s, and the standard error s ÷ √n, which says how far x̄ is likely to be from the true mean.",
  prompt: "The survey team measured the depth of the frozen ground layer, in centimetres, at 6 sites chosen at random: 14, 18, 11, 20, 16 and 17. Enter the sample mean x̄ in centimetres, then the sample standard deviation s to 2 decimal places, then the estimated standard error of the mean, s ÷ √n, to 2 decimal places.",
  answer: [16,3.16,1.29], labels: ["sample mean x̄ (cm)","s (cm)","standard error (cm)"], tolerance: 0.005,
  hints: [
   "The sample mean is the sum of the readings divided by how many readings there are.",
   "For s, take each reading minus x̄, square it, add the squares, divide by n − 1 and take the square root. The standard error is s divided by the square root of the number of readings."
  ],
  solution: "The readings add up to 96, so x̄ = 96 ÷ 6 = 16 cm. The distances from the mean are −2, +2, −5, +4, 0 and +1, and their squares add up to 50. Then s = √(50 ÷ 5) ≈ 3.16 cm. With s in place of the unknown σ, the standard error is s ÷ √6 ≈ 1.29 cm.",
  xp: 100, prereqs: ["q08","q10"],
  artifact: { name: "Survey summary card", description: "Three numbers that carry a whole survey: where it sits, how it spreads, and how far its mean can be trusted." },
  sources: [source.s2_7, source.s7_1, source.s8_2],
  teaching: {
   intuition: "A survey of a few sites gives a handful of readings, and three numbers tell its story. The sample mean x̄ says where the readings sit. The sample standard deviation s says how far a typical reading lies from x̄: square the distances from the mean, add them, divide by n − 1 and take the square root. The third number is about the mean itself. Another survey of the same size at other sites would give a slightly different x̄, and the standard error, σ ÷ √n, says how much x̄ moves from survey to survey. The true σ of all the ground is unknown, so we put s in its place and use s ÷ √n as an estimate of the standard error. Because of the √n, a mean of 25 readings wobbles only a fifth as much as a single reading.",
   steps: [
    "Add the readings and divide by n to get x̄.",
    "Subtract x̄ from each reading, square the results, add them, divide by n − 1 and take the square root to get s.",
    "Divide s by √n to estimate the standard error of the mean.",
    "Round only at the end: keep s unrounded when you divide by √n."
   ],
   example: {
    prompt: "Five sites give depths of 8, 12, 10, 9 and 11 cm. Find x̄, s and the estimated standard error.",
    steps: [
     "x̄ = 50 ÷ 5 = 10 cm.",
     "The distances from the mean are −2, +2, 0, −1 and +1; their squares add up to 10, so s = √(10 ÷ 4) = √2.5 ≈ 1.58 cm.",
     "The standard error is s ÷ √5 ≈ 1.5811 ÷ 2.2361 ≈ 0.71 cm."
    ],
    answer: "x̄ = 10 cm, s ≈ 1.58 cm and a standard error of about 0.71 cm."
   },
   pitfalls: [
    "Dividing by n instead of n − 1 for s. That describes these few readings only and comes out too small as an estimate for all the ground.",
    "Dividing s by n instead of by √n. The standard error shrinks with the square root of the sample size.",
    "Mixing up s and the standard error: s is the spread of single readings, the standard error is the spread of the mean."
   ]
  },
  guidance: [
   { prompt: "Add the 6 readings. What is their sum, and what is the sample mean x̄?", answer: [96,16], labels: ["sum of readings (cm)","sample mean x̄ (cm)"], explanation: "The sum is 96, and 96 ÷ 6 = 16, so x̄ = 16 cm." },
   { prompt: "Subtract x̄ = 16 from each reading, square each result and add the squares. What is the total?", answer: [50], labels: ["sum of squared distances"], explanation: "The distances are −2, +2, −5, +4, 0 and +1. Their squares add up to 50." },
   { prompt: "Divide 50 by n − 1 = 5 and take the square root. What is s, to 2 decimal places?", answer: [3.16], labels: ["s (cm)"], explanation: "50 ÷ 5 = 10, and its square root is s ≈ 3.16 cm." },
   { prompt: "Divide s by √6. What is the standard error, to 2 decimal places?", answer: [1.29], labels: ["standard error (cm)"], explanation: "√6 ≈ 2.4495, so s ÷ √6 ≈ 1.29 cm. A mean of 6 readings varies much less from survey to survey than a single reading does." }
  ]
 },
 {
  id: 'q12', title: "Within a few grams", topic: "Point estimate, confidence level and margin of error (σ known)", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "The council will open a new seam only if its iron content is high enough, and the lab must say how far its estimate could be off.",
  lesson: "The margin of error z* × σ ÷ √n says how far the point estimate x̄ may be from the true mean, at a chosen confidence level.",
  prompt: "The assay lab measures the iron content of ore lumps in grams per kilogram (g/kg). Years of records give a standard deviation of σ = 18 g/kg. Today 36 lumps from a new seam were measured, and their mean, x̄ = 47.3 g/kg, is the lab’s point estimate of the mean iron content of the whole seam. Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576. Enter the standard error σ ÷ √n, then the margin of error for 95% confidence, to 2 decimal places.",
  answer: [3,5.88], labels: ["standard error (g/kg)","margin of error (g/kg)"], tolerance: 0.005,
  hints: [
   "The standard error is σ divided by the square root of the number of lumps.",
   "The margin of error is the critical value z* for the chosen confidence level times the standard error."
  ],
  solution: "√36 = 6, so the standard error is 18 ÷ 6 = 3 g/kg. At 95% confidence z* = 1.96, so the margin of error is 1.96 × 3 = 5.88 g/kg. The lab can say, with 95% confidence, that the seam’s mean lies within 5.88 g/kg of 47.3 g/kg.",
  xp: 150, prereqs: ["q10"],
  artifact: { name: "Assay error card", description: "A best guess for the seam, and how far it may be off." },
  sources: [source.s8_1],
  teaching: {
   intuition: "The lab cannot test every lump in a seam, so it measures a sample and uses the sample mean x̄ as its best single guess for the seam’s true mean μ. A single number used as a guess like this is a point estimate. It is almost never exactly right, so the lab also says how far off it might be. From Probability you know that x̄ is spread normally around μ with standard deviation σ ÷ √n, the standard error. On the normal curve, 95% of the area lies within 1.96 standard deviations of the centre, so in 95% of samples x̄ lands within 1.96 standard errors of μ. That distance, z* × σ ÷ √n, is the margin of error, and 95% is the confidence level: the share of samples for which the method works. The number z* is the critical value: the z that leaves the middle 90%, 95% or 99% of the normal curve between −z* and z*. A normal table gives 1.645, 1.96 and 2.576 (areas of 0.95, 0.975 and 0.995 to their left). More confidence means a bigger z* and a wider margin.",
   steps: [
    "Take x̄ as the point estimate of the true mean.",
    "Work out the standard error σ ÷ √n.",
    "Pick z* for the confidence level: 1.645 for 90%, 1.96 for 95%, 2.576 for 99%.",
    "Multiply: the margin of error is z* × σ ÷ √n."
   ],
   example: {
    prompt: "Records give σ = 10 g/kg, and a sample of 25 lumps is measured. What is the margin of error for 90% confidence?",
    steps: [
     "√25 = 5, so the standard error is 10 ÷ 5 = 2 g/kg.",
     "For 90%, z* = 1.645, so the margin of error is 1.645 × 2 = 3.29 g/kg."
    ],
    answer: "3.29 g/kg."
   },
   pitfalls: [
    "Multiplying σ, not σ ÷ √n, by z*. The margin is about the mean of the sample, which varies much less than a single lump.",
    "Taking z* = 1.96 for every level. 1.96 goes with 95%; 90% and 99% need 1.645 and 2.576.",
    "Reading 95% confidence as a promise about one sample. It describes the method: 95% of samples give an x̄ within the margin of the true mean."
   ]
  },
  guidance: [
   { prompt: "What is √36, and what is the standard error σ ÷ √n?", answer: [6,3], labels: ["square root of n","standard error (g/kg)"], explanation: "6 × 6 = 36, so √36 = 6, and 18 ÷ 6 = 3 g/kg." },
   { prompt: "Read z* for 95% confidence from the list. What is the margin of error z* × 3, to 2 decimal places?", answer: [5.88], labels: ["margin of error (g/kg)"], explanation: "z* = 1.96 for 95%, and 1.96 × 3 = 5.88 g/kg." }
  ]
 },
 {
  id: 'q13', title: "Bounds for the seam", topic: "The confidence interval for a mean, and the sample size for a target margin", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "The council wants a range it can quote for the seam’s iron content, and a sample big enough to make that range tight.",
  lesson: "A confidence interval runs from x̄ minus the margin of error to x̄ plus it; to reach a margin E, take n = (z* × σ ÷ E)², rounded up.",
  prompt: "The assay lab’s records give σ = 6 g/kg for the iron content of ore lumps. A sample of 25 lumps from a new seam has mean x̄ = 52.4 g/kg. Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576. Enter the lower and then the upper bound of the 95% confidence interval for the seam’s mean, each to 2 decimal places. Then the council wants a margin of error of at most 1.5 g/kg at the same confidence level: enter the smallest sample size that gives it.",
  answer: [50.05,54.75,62], labels: ["lower bound (g/kg)","upper bound (g/kg)","sample size needed"], tolerance: 0.005,
  hints: [
   "The interval runs from x̄ minus the margin of error to x̄ plus it, where the margin is z* × σ ÷ √n.",
   "For the sample size, solve margin = z* × σ ÷ √n for n: n = (z* × σ ÷ E)², where E is the margin wanted. Round up to the next whole number, even when the decimal part is small."
  ],
  solution: "The standard error is 6 ÷ √25 = 6 ÷ 5 = 1.2 g/kg, so the margin of error is 1.96 × 1.2 ≈ 2.35 g/kg. The interval runs from 52.4 − 2.35 = 50.05 to 52.4 + 2.35 = 54.75 g/kg. For a margin of at most 1.5 g/kg, n = (1.96 × 6 ÷ 1.5)² ≈ 61.47, which rounds up to 62 lumps.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Seam grade range", description: "Two bounds the council can quote, and the sample size that would pull them closer." },
  sources: [source.s8_1],
  teaching: {
   intuition: "The point estimate and its margin of error together make a confidence interval: every value from x̄ minus the margin to x̄ plus the margin. A 95% confidence interval is made by a method that catches the true mean in 95% of samples. The two ends of the interval are its lower and upper bounds. If the interval is too wide to be useful, the cure is a bigger sample, because the margin z* × σ ÷ √n shrinks as n grows. To hit a target margin E, set z* × σ ÷ √n = E and solve for n: √n = z* × σ ÷ E, so n = (z* × σ ÷ E)². This n is rarely a whole number, and the lab can only measure whole lumps. Rounding down would leave the margin a little too big, so always round up.",
   steps: [
    "Work out the margin of error z* × σ ÷ √n.",
    "Subtract it from x̄ for the lower bound and add it to x̄ for the upper bound.",
    "For a target margin E, compute (z* × σ ÷ E)².",
    "Round that up to the next whole number, even if its decimal part is tiny; a whole number stays as it is."
   ],
   example: {
    prompt: "Records give σ = 5 g/kg, a sample of 16 lumps has x̄ = 40 g/kg, and the level is 90%. Find the interval, and the sample size for a margin of at most 1 g/kg.",
    steps: [
     "The standard error is 5 ÷ 4 = 1.25, and the margin is 1.645 × 1.25 ≈ 2.06.",
     "The interval runs from 40 − 2.06 = 37.94 to 40 + 2.06 = 42.06.",
     "Sample size: (1.645 × 5 ÷ 1)² = 8.225² ≈ 67.65, which rounds up to 68."
    ],
    answer: "From 37.94 to 42.06 g/kg; 68 lumps for a margin of 1 g/kg."
   },
   pitfalls: [
    "Rounding the sample size to the nearest whole number. 61.2 must become 62, or the margin ends up just above the target.",
    "Forgetting to square: n = (z* × σ ÷ E)², not z* × σ ÷ E.",
    "Changing the confidence level between the interval and the sample size. Keep the same z* throughout."
   ]
  },
  guidance: [
   { prompt: "The standard error is 6 ÷ 5 = 1.2 g/kg. What is the margin of error for 95% confidence, to 2 decimal places?", answer: [2.35], labels: ["margin of error (g/kg)"], explanation: "z* = 1.96, and 1.96 × 1.2 ≈ 2.35 g/kg." },
   { prompt: "Subtract the margin from x̄ = 52.4, then add it. What are the lower and upper bounds?", answer: [50.05,54.75], labels: ["lower bound (g/kg)","upper bound (g/kg)"], explanation: "52.4 − 2.35 = 50.05 and 52.4 + 2.35 = 54.75. The interval is 50.05 to 54.75 g/kg." },
   { prompt: "For a margin of at most 1.5 g/kg, what is (z* × σ ÷ E)² to 2 decimal places, and the smallest whole sample size?", answer: [61.47,62], labels: ["(z* × σ ÷ E)²","sample size needed"], explanation: "1.96 × 6 ÷ 1.5 = 7.84, and its square ≈ 61.47. Fewer than 61.4656 lumps would leave the margin above 1.5 g/kg, so round up to 62." }
  ]
 },
 {
  id: 'q14', title: "Reading the t table", topic: "Student’s t distribution and degrees of freedom", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "A new seam has no records of how much its lumps vary, so the lab needs a critical value that allows for that extra doubt.",
  lesson: "When σ is unknown and s is used, the critical value t* comes from Student’s t distribution with n − 1 degrees of freedom.",
  prompt: "The assay lab has only 12 ore lumps from a new seam and no records of σ, so it uses the sample standard deviation s, and its critical value comes from Student’s t distribution instead of the normal curve. Part of the t table, one row for each number of degrees of freedom (df), with columns for the confidence level: df 10: 90% 1.812, 95% 2.228, 99% 3.169; df 11: 90% 1.796, 95% 2.201, 99% 3.106; df 12: 90% 1.782, 95% 2.179, 99% 3.055. Enter the degrees of freedom for this sample, then the critical value t* for 95% confidence.",
  answer: [11,2.201], labels: ["degrees of freedom","t*"], tolerance: 0.0005,
  hints: [
   "For one sample of n readings, the degrees of freedom are n − 1.",
   "Find the row for your degrees of freedom, then read across to the column for the confidence level."
  ],
  solution: "The sample has n = 12 lumps, so df = 12 − 1 = 11. In the row df 11, the 95% column reads t* = 2.201. That is larger than the normal curve’s z* = 1.96 for the same level, because the t distribution has thicker tails: with σ unknown, the interval has to be wider.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Pocket t table", description: "One row per degree of freedom, one column per confidence level." },
  sources: [source.s8_2],
  teaching: {
   intuition: "So far the lab knew σ from years of records. A brand-new seam has no records, so the only measure of spread is s from the sample itself, and s is uncertain too: a small sample can easily make the spread look smaller than it is. To allow for that, the normal curve is replaced by Student’s t distribution. It is symmetric about 0 like the standard normal curve, but shorter in the middle and thicker in the tails, so its critical values are bigger and the intervals wider. There is a whole family of t distributions, one for each number of degrees of freedom, df. For a single sample of n readings, df = n − 1, the same n − 1 you divide by when you work out s. The more degrees of freedom, the closer the t curve is to the normal curve. A t table has one row per df and one column per confidence level, and t* is read where they meet.",
   steps: [
    "Check that σ is unknown and s is used: then the critical value comes from the t distribution.",
    "Count the readings n and work out df = n − 1.",
    "Find the row of the t table for that df.",
    "Read across to the column for the confidence level: that number is t*."
   ],
   example: {
    prompt: "A sample of 8 lumps, σ unknown, 90% confidence. Rows of the t table (columns 90%, 95%, 99%): df 6: 1.943, 2.447, 3.707; df 7: 1.895, 2.365, 3.499.",
    steps: [
     "df = 8 − 1 = 7.",
     "Row df 7, column 90%: 1.895."
    ],
    answer: "df = 7 and t* = 1.895, a little more than z* = 1.645."
   },
   pitfalls: [
    "Using the row for n instead of n − 1. For 15 readings the row is df 14.",
    "Reading the wrong column: each column is one confidence level.",
    "Using z* when σ is unknown. With s in place of σ the critical value must come from the t table."
   ]
  },
  guidance: [
   { prompt: "How many degrees of freedom does a sample of 12 lumps have?", answer: [11], labels: ["degrees of freedom"], explanation: "df = n − 1 = 12 − 1 = 11." },
   { prompt: "In the row df 11, what does the 95% column say?", answer: [2.201], labels: ["t*"], explanation: "The row reads 90% 1.796, 95% 2.201, 99% 3.106, so t* = 2.201." }
  ]
 },
 {
  id: 'q15', title: "An interval without records", topic: "The t interval for a mean", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "With no records for the new seam, the lab must build its interval from the sample’s own spread.",
  lesson: "With σ unknown, the confidence interval for a mean is x̄ ± t* × s ÷ √n, with t* from the row df = n − 1.",
  prompt: "The assay lab measured 12 ore lumps from a seam with no records of σ. Their iron content has mean x̄ = 38.6 g/kg and sample standard deviation s = 4.3 g/kg. Row of the t table for df 11: 90% 1.796, 95% 2.201, 99% 3.106. Enter the margin of error t* × s ÷ √n for 95% confidence, then the lower and the upper bound of the confidence interval, each to 2 decimal places.",
  answer: [2.73,35.87,41.33], labels: ["margin of error (g/kg)","lower bound (g/kg)","upper bound (g/kg)"], tolerance: 0.005,
  hints: [
   "Use df = n − 1 to pick the row, and the column for the confidence level, to get t*.",
   "The margin of error is t* times s ÷ √n; the bounds are x̄ minus and plus the margin."
  ],
  solution: "df = 12 − 1 = 11, so for 95% confidence t* = 2.201. s ÷ √12 = 4.3 ÷ √12 ≈ 1.2413, so the margin of error is 2.201 × 1.2413 ≈ 2.73 g/kg. The interval runs from 38.6 − 2.73 = 35.87 to 38.6 + 2.73 = 41.33 g/kg.",
  xp: 150, prereqs: ["q14","q07"],
  artifact: { name: "New seam report", description: "An interval built from the sample alone, a little wider for not knowing σ." },
  sources: [source.s8_2],
  teaching: {
   intuition: "The t interval is built exactly like the z interval, with two swaps. The sample standard deviation s stands in for the unknown σ, so the standard error becomes s ÷ √n. And the critical value z* is replaced by t* from the t table, in the row df = n − 1 and the column for the confidence level. The margin of error is t* × s ÷ √n, and the interval runs from x̄ minus the margin to x̄ plus it; the sign ± means “minus and plus”. Because t* is larger than z*, especially for small samples, the interval comes out a little wider: that extra width is the price of not knowing σ. The method assumes the readings come from a population that is roughly normal, as the lab assumes for iron content.",
   steps: [
    "Work out df = n − 1 and read t* from the t table.",
    "Work out s ÷ √n.",
    "Multiply: the margin of error is t* × s ÷ √n.",
    "Subtract the margin from x̄ and add it to x̄ to get the two bounds."
   ],
   example: {
    prompt: "A sample of 16 lumps has x̄ = 20.5 g/kg and s = 2.4 g/kg, at 90% confidence; the row df 15 reads 1.753, 2.131, 2.947.",
    steps: [
     "s ÷ √16 = 2.4 ÷ 4 = 0.6.",
     "The margin of error is 1.753 × 0.6 ≈ 1.05.",
     "The bounds are 20.5 − 1.05 = 19.45 and 20.5 + 1.05 = 21.55."
    ],
    answer: "From 19.45 to 21.55 g/kg."
   },
   pitfalls: [
    "Using z* = 1.96 instead of t*. Without σ the critical value is t*, which is larger.",
    "Dividing s by n instead of √n.",
    "Rounding s ÷ √n hard before multiplying; keep 4 decimal places until the end."
   ]
  },
  guidance: [
   { prompt: "How many degrees of freedom does the sample have?", answer: [11], labels: ["degrees of freedom"], explanation: "df = 12 − 1 = 11, so the row to read is df 11, where the 95% column gives t* = 2.201." },
   { prompt: "What is s ÷ √n = 4.3 ÷ √12, to 2 decimal places?", answer: [1.24], labels: ["s ÷ √n (g/kg)"], explanation: "√12 ≈ 3.4641, and 4.3 ÷ 3.4641 ≈ 1.24 g/kg." },
   { prompt: "Multiply by t* = 2.201. What is the margin of error, to 2 decimal places?", answer: [2.73], labels: ["margin of error (g/kg)"], explanation: "2.201 × 1.2413 ≈ 2.73 g/kg." },
   { prompt: "Subtract the margin from x̄ = 38.6, then add it. What are the two bounds?", answer: [35.87,41.33], labels: ["lower bound (g/kg)","upper bound (g/kg)"], explanation: "38.6 − 2.73 = 35.87 and 38.6 + 2.73 = 41.33." }
  ]
 },
 {
  id: 'q16', title: "Counting veins", topic: "The confidence interval for a proportion", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "The mining crew only cares whether a core shows a nickel vein or not, and the council wants to know what share of the seam does.",
  lesson: "For a proportion, the point estimate is p̂ = x ÷ n and the margin of error is z* × √(p̂(1 − p̂) ÷ n).",
  prompt: "The assay lab split 200 rock cores from the new seam, and 72 of them showed a nickel vein. Both 72 and 128 are more than 5, so the normal curve can be used. Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576. Enter the sample proportion p̂, then the margin of error z* × √(p̂(1 − p̂) ÷ n) for 95% confidence, then the lower and the upper bound of the confidence interval, all to 3 decimal places.",
  answer: [0.36,0.067,0.293,0.427], labels: ["p̂","margin of error","lower bound","upper bound"], tolerance: 0.0005,
  hints: [
   "p̂ is the number of cores with a vein divided by the number of cores.",
   "Multiply p̂ by 1 − p̂, divide by n and take the square root to get the standard error. The margin of error is z* times that, and the bounds are p̂ minus and plus the margin."
  ],
  solution: "p̂ = 72 ÷ 200 = 0.36, so 1 − p̂ = 0.64. The standard error is √(0.36 × 0.64 ÷ 200) ≈ 0.0339. At 95% confidence z* = 1.96, so the margin of error is 1.96 × 0.0339 ≈ 0.067. The interval runs from 0.36 − 0.067 = 0.293 to 0.36 + 0.067 = 0.427: between 29.3% and 42.7% of the seam’s cores have a vein, with 95% confidence.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Core tally", description: "A share of cores with a vein, and how far that share may be off." },
  sources: [source.s8_3],
  teaching: {
   intuition: "Some readings are not measurements but yes-or-no results: a core shows a vein or it does not. Then the thing to estimate is a proportion p, the share of all cores in the seam that show a vein. Its point estimate is the sample proportion p̂ (say “p hat”): the number of yes results x divided by the sample size n. From Probability, the count of yes results is binomial, and for a large enough sample p̂ is spread roughly normally around p with standard deviation √(p(1 − p) ÷ n). We do not know p, so we put p̂ in its place: the standard error is √(p̂(1 − p̂) ÷ n). The margin of error is z* times that, with the same z* values as before, and the interval runs from p̂ minus the margin to p̂ plus it. The normal curve is a fair guide only when both counts, the yes results and the no results, are more than 5. To plan a survey, solve the margin of error for n: a margin of at most E needs n = z*² × p̂(1 − p̂) ÷ E², with p̂ taken from an earlier sample as a guess, rounded up to the next whole number.",
   steps: [
    "Work out p̂ = x ÷ n and 1 − p̂.",
    "Check that both x and n − x are more than 5.",
    "Work out the standard error √(p̂(1 − p̂) ÷ n).",
    "Multiply by z* for the margin of error, then subtract it from p̂ and add it to p̂ for the bounds."
   ],
   example: {
    prompt: "45 of 100 cores show a vein. Find the 90% confidence interval for the proportion.",
    steps: [
     "p̂ = 45 ÷ 100 = 0.45 and 1 − p̂ = 0.55.",
     "The standard error is √(0.45 × 0.55 ÷ 100) = √0.002475 ≈ 0.0497.",
     "The margin is 1.645 × 0.0497 ≈ 0.082, so the interval runs from 0.368 to 0.532."
    ],
    answer: "From 0.368 to 0.532: between 36.8% and 53.2% of the cores."
   },
   pitfalls: [
    "Forgetting the square root: the standard error is √(p̂(1 − p̂) ÷ n), not p̂(1 − p̂) ÷ n.",
    "Using the count x instead of the proportion p̂ in the formula.",
    "Rounding the standard error hard, to 0.03 say, before multiplying; keep at least 3 decimal places."
   ]
  },
  guidance: [
   { prompt: "What is the sample proportion p̂ = 72 ÷ 200?", answer: [0.36], labels: ["p̂"], explanation: "72 ÷ 200 = 0.36." },
   { prompt: "What is the standard error √(p̂(1 − p̂) ÷ n), to 3 decimal places?", answer: [0.034], labels: ["standard error"], explanation: "0.36 × 0.64 = 0.2304; divided by 200 and square-rooted it is 0.0339, which is 0.034 to 3 decimal places." },
   { prompt: "Multiply by z* = 1.96. What is the margin of error, to 3 decimal places?", answer: [0.067], labels: ["margin of error"], explanation: "1.96 × 0.0339 ≈ 0.067." },
   { prompt: "Subtract the margin from p̂ = 0.36, then add it. What are the two bounds?", answer: [0.293,0.427], labels: ["lower bound","upper bound"], explanation: "0.36 − 0.067 = 0.293 and 0.36 + 0.067 = 0.427." }
  ]
 },
 {
  id: 'q17', title: "Which interval for which job", topic: "Chapter review: which interval?", tier: 'Intermediate', sector: 'Assay Lab',
  brief: "Three kinds of question reach the Assay Lab every day, and Mira wants each one answered with the right interval.",
  lesson: "Use the z interval when σ is known, the t interval when only s is known, and the interval for a proportion for yes-or-no counts.",
  prompt: "A new seam has no records of σ. A sample of 10 lumps has mean 45.2 g/kg and sample standard deviation s = 3.5 g/kg. The council wants a 95% confidence interval for the mean iron content. The intervals: 1, the z interval for a mean (σ known); 2, the t interval for a mean (σ unknown, s from the sample); 3, the interval for a proportion. Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576. t table rows, columns 90%, 95%, 99%: df 8: 1.860, 2.306, 3.355; df 9: 1.833, 2.262, 3.250; df 10: 1.812, 2.228, 3.169; df 11: 1.796, 2.201, 3.106. Enter the number of the right interval, then its lower and its upper bound, to 2 decimal places.",
  answer: [2,42.7,47.7], labels: ["interval number","lower bound","upper bound"], tolerance: 0.0005,
  hints: [
   "σ known from long records points to z; only s from this sample points to t, with df = n − 1; a count of items with or without something points to a proportion.",
   "Whichever interval it is, the margin of error is the critical value times the standard error, and the bounds are the estimate minus and plus the margin."
  ],
  solution: "Only s from this sample is known, so this is the t interval, number 2, with df = 10 − 1 = 9 and t* = 2.262. The standard error is 3.5 ÷ √10 ≈ 1.1068, and the margin is 2.262 × 1.1068 ≈ 2.50 g/kg. The interval runs from 45.2 − 2.50 = 42.70 to 45.2 + 2.50 = 47.70.",
  xp: 150, prereqs: ["q15","q16"],
  artifact: { name: "Assay Lab furnace key", description: "Three intervals and the question each one answers." },
  sources: [source.s8_1, source.s8_2, source.s8_3],
  teaching: {
   intuition: "Every confidence interval in this chapter has the same shape: an estimate, minus and plus a critical value times a standard error. What changes is which pieces fit the question. If the question is about a mean and σ is known from long records, use x̄ ± z* × σ ÷ √n. If it is about a mean but σ is unknown, so that only the sample’s own s is available, use x̄ ± t* × s ÷ √n with df = n − 1. If each item is a yes or a no and the question is about a share, use p̂ ± z* × √(p̂(1 − p̂) ÷ n). So the first job is to read the story and decide which of the three it is; the arithmetic then follows a recipe you already know.",
   steps: [
    "Ask whether the data are measurements (a mean) or yes-or-no results (a proportion).",
    "For a mean, ask whether σ is known from records (the z interval) or only s from the sample (the t interval, df = n − 1).",
    "Work out the standard error and the margin of error with the right critical value.",
    "Subtract the margin from the estimate and add it to get the bounds."
   ],
   example: {
    prompt: "Records give σ = 8 g/kg; 64 lumps have mean 30 g/kg; 95% confidence. Which interval, and what are its bounds?",
    steps: [
     "σ is known, so this is the z interval.",
     "The standard error is 8 ÷ 8 = 1, and the margin is 1.96 × 1 = 1.96.",
     "The bounds are 30 − 1.96 = 28.04 and 30 + 1.96 = 31.96."
    ],
    answer: "The z interval, from 28.04 to 31.96 g/kg."
   },
   pitfalls: [
    "Picking the z interval when the story gives only s. Without records of σ, the t interval is the right one.",
    "Using t* from the row df = n instead of n − 1.",
    "Treating a count as a mean: a share of cores with a vein is a proportion, with standard error √(p̂(1 − p̂) ÷ n)."
   ]
  },
  guidance: [
   { prompt: "Is σ known from records (1), is only s from the sample known (2), or is the reading a count of yes-or-no results (3)? Enter the number of the interval.", answer: [2], labels: ["interval number"], explanation: "There are no records of σ, only s from this sample, so the t interval fits: number 2." },
   { prompt: "What is the margin of error, to 2 decimal places?", answer: [2.5], labels: ["margin of error"], explanation: "Only s from this sample is known, so this is the t interval, number 2, with df = 10 − 1 = 9 and t* = 2.262. The standard error is 3.5 ÷ √10 ≈ 1.1068, and the margin is 2.262 × 1.1068 ≈ 2.50 g/kg." },
   { prompt: "Subtract the margin from the estimate 45.2, then add it. What are the two bounds?", answer: [42.7,47.7], labels: ["lower bound","upper bound"], explanation: "45.2 − 2.50 = 42.70 and 45.2 + 2.50 = 47.70." }
  ]
 },
 {
  id: 'q18', title: "Writing down the claim", topic: "Null and alternative hypotheses", tier: 'Intermediate', sector: 'Inspection Hall',
  brief: "A supplier’s claim has reached the Inspection Hall, and before any test the inspectors must write down exactly what is being tested.",
  lesson: "The null hypothesis H₀ states the claim with an equals sign in it; the alternative hypothesis Hₐ states the suspicion, and its sign sets the tail of the test.",
  prompt: "The filter supplier claims that its air filters last at least 300 hours on average. The inspectors suspect that the mean life is shorter. In the test, μ stands for the true mean of everything the supplier sends. Enter the number that appears in the null hypothesis H₀, then the tail of the test: 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.",
  answer: [300,1], labels: ["value in H₀","tail code"], tolerance: 0.01,
  hints: [
   "H₀ is the supplier’s claim and always contains an equals sign (=, ≥ or ≤). The number in it is the claimed mean.",
   "Hₐ is what the inspectors suspect: μ < value is left-tailed, μ > value is right-tailed, μ ≠ value is two-tailed."
  ],
  solution: "H₀: μ ≥ 300 and Hₐ: μ < 300. The number in H₀ is 300. Hₐ uses <, so the test is left-tailed: code 1.",
  xp: 150, prereqs: ["q13"],
  artifact: { name: "Claim ledger", description: "Every supplier’s claim written as H₀, and every suspicion as Hₐ." },
  sources: [source.s9_1, source.s9_5],
  teaching: {
   intuition: "A hypothesis test starts with two opposite statements about a population mean μ. The null hypothesis, H₀, is the claim being tested: the supplier’s figure, the “nothing is wrong” position. It always contains an equals sign: =, ≥ (at least) or ≤ (at most). The alternative hypothesis, Hₐ, is what the inspectors suspect instead, and it never contains an equals sign: < (less than), > (more than) or ≠ (not equal to). The test asks whether a sample gives strong enough evidence against H₀ to reject it in favour of Hₐ, much as a court assumes innocence until the evidence says otherwise. The sign in Hₐ says where to look for that evidence. If Hₐ says μ < value, only a sample mean well below the value counts: a left-tailed test. If Hₐ says μ > value, it is a right-tailed test. If Hₐ says μ ≠ value, a sample mean far off in either direction counts: a two-tailed test. H₀ pairs ≥ with <, ≤ with >, and = with ≠; some writers put = in H₀ every time, which leads to the same test.",
   steps: [
    "Find the number in the claim: it is the value in both hypotheses.",
    "Write H₀ with an equals sign in it: =, ≥ or ≤.",
    "Write Hₐ from the suspicion, with <, > or ≠.",
    "Read the tail from Hₐ: < is left-tailed, > is right-tailed, ≠ is two-tailed."
   ],
   example: {
    prompt: "A miller claims a mean flour sack mass of 25 kg; the inspectors suspect the sacks are underfilled.",
    steps: [
     "H₀: μ ≥ 25 and Hₐ: μ < 25.",
     "Hₐ uses <, so the test is left-tailed."
    ],
    answer: "The value is 25, and the test is left-tailed (code 1)."
   },
   pitfalls: [
    "Putting the suspicion into H₀. H₀ is the claim being tested; the suspicion is Hₐ.",
    "Reading the tail from H₀. A claim of “at least” has Hₐ with <, so the test is left-tailed, not right-tailed.",
    "Choosing a one-tailed test when the inspectors care about a change in either direction: “different from” means ≠ and two tails."
   ]
  },
  guidance: [
   { prompt: "What number does the supplier’s claim give for the mean μ?", answer: [300], labels: ["value in H₀"], explanation: "The claim is about the value 300, so H₀ is μ ≥ 300." },
   { prompt: "The suspicion goes into Hₐ. Enter 1 if Hₐ reads μ < 300, 2 if it reads μ > 300, 3 if it reads μ ≠ 300.", answer: [1], labels: ["tail code"], explanation: "Hₐ: μ < 300, so the test is left-tailed." }
  ]
 },
 {
  id: 'q19', title: "False alarms at the gate", topic: "Type I and Type II errors, α, β and power", tier: 'Intermediate', sector: 'Inspection Hall',
  brief: "The Inspection Hall tests hundreds of batches a year, and Mira wants to know how often it will raise a false alarm and how often it will catch a real shortfall.",
  lesson: "A Type I error rejects a true H₀, with probability α, the significance level; a Type II error keeps a false H₀, with probability β; the power is 1 − β.",
  prompt: "The Inspection Hall tests each batch of rations, with H₀: the batch meets its claimed mean weight, at significance level α = 0.05. When a batch really is short, the test misses it with probability β = 0.18. Enter the power of the test. Then the hall tests 200 batches, each separately, that all turn out to have met their claim: enter the expected number of them for which the test wrongly rejects H₀.",
  answer: [0.82,10], labels: ["power","expected false alarms"], tolerance: 0.005,
  hints: [
   "β is the chance of a Type II error, missing a real shortfall. The power is the chance of catching it, so power and β add up to 1.",
   "Rejecting a true H₀ is a Type I error, and each test makes one with probability α. The expected number of them is the number of tests times α."
  ],
  solution: "Power = 1 − β = 1 − 0.18 = 0.82. Every one of the 200 batches met its claim, so H₀ was true each time, and a rejection is a Type I error, with probability α = 0.05 in each test. The expected number of false alarms is 200 × 0.05 = 10.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Inspector’s error chart", description: "Two ways to be wrong, and the chance of each." },
  sources: [source.s9_2],
  teaching: {
   intuition: "A test ends in one of two decisions, reject H₀ or do not reject it, and the truth is one of two things, H₀ true or H₀ false. Two of the four combinations are mistakes. Rejecting H₀ when it is in fact true is a Type I error: a false alarm, accusing an honest supplier. Not rejecting H₀ when it is in fact false is a Type II error: a miss, letting a short batch through. The chance of a Type I error is chosen in advance and called the significance level, α (the Greek letter alpha), often 0.05. (That chance is exactly α when the test statistic follows its model exactly; for a test on counts it can differ a little, and the missions say when they take it as α.) The chance of a Type II error is called β (beta). The power of the test is 1 − β: the chance that the test does reject H₀ when H₀ really is false, that is, the chance of catching a real problem. Over N separate tests of true H₀s, the number of false alarms is binomial, so from Probability its expected value is N × α.",
   steps: [
    "Name the error: rejecting a true H₀ is Type I, keeping a false H₀ is Type II.",
    "The probability of a Type I error is α, the significance level.",
    "The probability of a Type II error is β, and the power is 1 − β.",
    "For N separate tests of true H₀s, the expected number of false alarms is N × α."
   ],
   example: {
    prompt: "A test has α = 0.01 and β = 0.3, and it is run on 500 batches that all meet their claim.",
    steps: [
     "Power = 1 − 0.3 = 0.7.",
     "Every rejection would be a Type I error, with probability 0.01 each: 500 × 0.01 = 5 false alarms expected."
    ],
    answer: "Power 0.7, and 5 false alarms expected."
   },
   pitfalls: [
    "Taking β itself as the power. The power is the chance of catching a real problem, 1 − β.",
    "Mixing up the two errors: a false alarm, rejecting a true H₀, is Type I; a miss is Type II.",
    "Thinking α = 0.05 means no false alarms. It means that about 5 in every 100 tests of a true H₀ still reject it."
   ]
  },
  guidance: [
   { prompt: "What is the power 1 − β, with β = 0.18?", answer: [0.82], labels: ["power"], explanation: "1 − 0.18 = 0.82: the test catches 82% of the batches that really are short." },
   { prompt: "A batch that met its claim is rejected. Is that a Type I error (enter 1) or a Type II error (enter 2)?", answer: [1], labels: ["error type"], explanation: "H₀ was true and was rejected: a Type I error, a false alarm." },
   { prompt: "Each of the 200 tests raises a false alarm with probability α = 0.05. What is the expected number of false alarms?", answer: [10], labels: ["expected false alarms"], explanation: "200 × 0.05 = 10." }
  ]
 },
 {
  id: 'q20', title: "How far from the claim", topic: "The test statistic for a mean", tier: 'Intermediate', sector: 'Inspection Hall',
  brief: "The inspectors have weighed a sample of ration packs, and before deciding anything they need one number for how far the sample sits from the supplier’s claim.",
  lesson: "The test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) counts how many standard errors the sample mean lies from the value in H₀.",
  prompt: "A supplier claims that its ration packs have a mean mass of 500 g, so the inspectors test H₀: μ = 500. Long records give σ = 12 g. The inspectors weigh 36 packs and find a mean of x̄ = 496.3 g. Enter the standard error σ ÷ √n, then the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) to 2 decimal places, where μ₀ = 500 is the value in H₀.",
  answer: [2,-1.85], labels: ["standard error (g)","test statistic z"], tolerance: 0.005,
  hints: [
   "The standard error is σ divided by the square root of the sample size.",
   "The test statistic counts how many standard errors x̄ lies from the value in H₀: subtract μ₀ from x̄, then divide by the standard error. Keep the sign."
  ],
  solution: "√36 = 6, so σ ÷ √n = 12 ÷ 6 = 2 g. x̄ − μ₀ = 496.3 − 500 = −3.7 g. z = −3.7 ÷ 2 = −1.85: the sample mean lies about 1.85 standard errors below the claimed mean.",
  xp: 150, prereqs: ["q18","q12"],
  artifact: { name: "Inspection scale reading", description: "A sample mean turned into a distance from the claim, in standard errors." },
  sources: [source.s9_5],
  teaching: {
   intuition: "Once H₀ is written down, say H₀: μ = 500, call its value μ₀ (“mu nought”). If H₀ is true, the Central Limit Theorem says the sample mean x̄ is spread normally around μ₀ with standard error σ ÷ √n. So the way to judge the sample is to turn x̄ into a z-score on that curve: z = (x̄ − μ₀) ÷ (σ ÷ √n). This number is the test statistic. It says how many standard errors the sample mean lies above μ₀ (z positive) or below it (z negative). A z near 0 is just what H₀ predicts; a z of 2 or 3 in size would be unusual if H₀ were true, and that is the first sign of evidence against it. The next mission turns the test statistic into a decision.",
   steps: [
    "Write down μ₀, the value in H₀.",
    "Work out the standard error σ ÷ √n.",
    "Subtract: x̄ − μ₀, keeping the sign.",
    "Divide by the standard error: z = (x̄ − μ₀) ÷ (σ ÷ √n)."
   ],
   example: {
    prompt: "H₀: μ = 80 g, σ = 10 g, and a sample of 25 packs has x̄ = 83.1 g.",
    steps: [
     "The standard error is 10 ÷ √25 = 10 ÷ 5 = 2.",
     "x̄ − μ₀ = 83.1 − 80 = 3.1.",
     "z = 3.1 ÷ 2 = 1.55."
    ],
    answer: "z = 1.55: the sample mean lies 1.55 standard errors above the claim."
   },
   pitfalls: [
    "Dividing by σ instead of σ ÷ √n. The test is about the mean of the sample, not one pack.",
    "Subtracting the wrong way round: it is x̄ − μ₀, so a light sample gives a negative z.",
    "Dropping the minus sign: the sign says on which side of the claim the sample fell."
   ]
  },
  guidance: [
   { prompt: "What is the standard error σ ÷ √n = 12 ÷ √36?", answer: [2], labels: ["standard error (g)"], explanation: "√36 = 6, and 12 ÷ 6 = 2 g." },
   { prompt: "What is x̄ − μ₀ = 496.3 − 500?", answer: [-3.7], labels: ["x̄ − μ₀ (g)"], explanation: "496.3 − 500 = −3.7 g: the sample came out light." },
   { prompt: "Divide by the standard error. What is z, to 2 decimal places?", answer: [-1.85], labels: ["test statistic z"], explanation: "−3.7 ÷ 2 = −1.85." }
  ]
 }
);
})();
