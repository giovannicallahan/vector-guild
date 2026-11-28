/* Data and inference missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/stats/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · The p-value and the decision [9.4]
     q22  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · Testing a proportion [9.5]
     q23  ch 4 Testing a claim · Intermediate, 150 XP · sector 'Inspection Hall' · Chapter review: a full test of a supplier's claim [9.4, 9.5]
     q24  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Two independent means: the two-sample t statistic [10.1]
     q25  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Two proportions: the pooled proportion and z [10.3]
     q26  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Matched pairs: testing the differences [10.4]
     q27  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Chi-square goodness of fit [11.2]
     q28  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Chi-square test of independence [11.3]
     q29  ch 5 Comparing groups · Intermediate, 150 XP · sector 'Trial Fields' · Chapter review: choosing a two-group test [10.1, 10.4, 11.2, 11.3]
     q30  ch 6 Relationships · Advanced, 200 XP · sector 'Solar Farm' · Scatter plots and the correlation coefficient r [12.2, 12.3] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Introductory Statistics 2e — 2.3 Measures of the Location of the Data
   Link to the section page itself: https://openstax.org/books/introductory-statistics-2e/pages/<section-slug> */
const source = {
 s9_4: { title: "OpenStax Introductory Statistics 2e — 9.4 Rare Events, the Sample, Decision and Conclusion", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-4-rare-events-the-sample-decision-and-conclusion", description: "The p-value as the chance of a result at least as extreme if H₀ is true, and the rule: reject H₀ when the p-value is less than α.", verified: '2026-11-27' },
 s9_5: { title: "OpenStax Introductory Statistics 2e — 9.5 Additional Information and Full Hypothesis Test Examples", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-5-additional-information-and-full-hypothesis-test-examples", description: "Full tests of a single mean and a single proportion, with left-, right- and two-tailed p-values.", verified: '2026-11-27' },
 s10_1: { title: "OpenStax Introductory Statistics 2e — 10.1 Two Population Means with Unknown Standard Deviations", url: "https://openstax.org/books/introductory-statistics-2e/pages/10-1-two-population-means-with-unknown-standard-deviations", description: "The two-sample t statistic with standard error √(s₁² ÷ n₁ + s₂² ÷ n₂), variances not pooled, and its degrees of freedom.", verified: '2026-11-27' },
 s10_3: { title: "OpenStax Introductory Statistics 2e — 10.3 Comparing Two Independent Population Proportions", url: "https://openstax.org/books/introductory-statistics-2e/pages/10-3-comparing-two-independent-population-proportions", description: "The pooled proportion and the z statistic for the difference of two sample proportions.", verified: '2026-11-27' },
 s10_4: { title: "OpenStax Introductory Statistics 2e — 10.4 Matched or Paired Samples", url: "https://openstax.org/books/introductory-statistics-2e/pages/10-4-matched-or-paired-samples", description: "Paired differences as the data, their mean and standard deviation, and t with df = n − 1.", verified: '2026-11-27' },
 s11_2: { title: "OpenStax Introductory Statistics 2e — 11.2 Goodness-of-Fit Test", url: "https://openstax.org/books/introductory-statistics-2e/pages/11-2-goodness-of-fit-test", description: "Observed and expected counts, χ² = Σ(O − E)² ÷ E, df = k − 1 and expected counts of at least 5.", verified: '2026-11-27' },
 s11_3: { title: "OpenStax Introductory Statistics 2e — 11.3 Test of Independence", url: "https://openstax.org/books/introductory-statistics-2e/pages/11-3-test-of-independence", description: "Expected counts (row total)(column total) ÷ total, df = (rows − 1)(columns − 1), and the right-tailed χ² test.", verified: '2026-11-27' },
 s12_2: { title: "OpenStax Introductory Statistics 2e — 12.2 Scatter Plots", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-2-scatter-plots", description: "Scatter plots of paired data, the direction of a relationship and how strong a linear pattern is.", verified: '2026-11-27' },
 s12_3: { title: "OpenStax Introductory Statistics 2e — 12.3 The Regression Equation", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-3-the-regression-equation", description: "The correlation coefficient r, its formula, and why −1 ≤ r ≤ 1 measures the strength and direction of a linear association.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "How surprising is the spool test?", topic: "The p-value and the decision", tier: "Intermediate", sector: "Inspection Hall",
  brief: "A supplier’s cable spools seem short, and the inspectors have their test statistic; now they need to know how surprising it is and what to decide.",
  lesson: "The p-value is the chance, if H₀ is true, of a sample at least as extreme as ours; reject H₀ when it is less than α.",
  prompt: "A supplier claims that its cable spools hold a mean length of 500 m. The inspectors tested H₀: μ = 500 against Hₐ: μ < 500, and their sample gave the test statistic z = −1.87. Rows of the normal table (z → area under the standard normal curve to the left of z): −1.88 → 0.0301, −1.87 → 0.0307, −1.86 → 0.0314. At significance level α = 0.05, enter the p-value to 4 decimal places, then 1 to reject H₀ or 0 not to reject it.",
  answer: [0.0307,1], labels: ["p-value (4 d.p.)","decision (1 reject, 0 not)"], tolerance: 0.00005,
  hints: [
   "The p-value is the area beyond z in the direction Hₐ points: to the left for <, to the right for >, and in both tails for ≠.",
   "The area to the right of z is 1 minus the area to the left. For a two-tailed test, double the smaller tail. Reject H₀ when the p-value is less than α."
  ],
  solution: "Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.87 → 0.0307 gives p-value = 0.0307. 0.0307 is less than α = 0.05, so we reject H₀. A sample this far from 500 would be rare if the claim were true. Enter 0.0307 and 1.",
  xp: 150, prereqs: ["q20"],
  artifact: {"name":"Decision stamp","description":"Two stamps, REJECT H₀ and DO NOT REJECT, and the p-value that picks one."},
  sources: [source.s9_4],
  teaching: {
   intuition: "A test statistic such as z says how far the sample landed from the value in H₀, counted in standard errors. The p-value turns that distance into a probability: if H₀ were true, how likely is a sample at least this far out, in the direction Hₐ points? A small p-value means the sample would be rare under H₀, so we doubt H₀. Before testing we choose the significance level α (the Greek letter alpha), the cut-off for “rare”, usually 0.05, 0.01 or 0.1. It is also the risk we accept of rejecting an H₀ that is in fact true. The decision rule is short: if the p-value is less than α, reject H₀; otherwise do not reject it. Not rejecting is not proof that H₀ is true, only that the sample is not strong evidence against it. For a z statistic the p-value comes from the normal table, which lists the area under the standard normal curve to the left of each z.",
   steps: [
    "Read the tail from Hₐ: < is left-tailed, > is right-tailed and ≠ is two-tailed.",
    "Find the table row for your z: it gives the area to the left of z.",
    "Left-tailed: the p-value is that area. Right-tailed: it is 1 minus that area. Two-tailed: double the smaller of the two tail areas.",
    "Compare: if the p-value is less than α, enter 1 (reject H₀); otherwise enter 0 (do not reject H₀)."
   ],
   example: {
    prompt: "A right-tailed test (Hₐ: μ > 80) gives z = 2.12, and the normal table row reads 2.12 → 0.9830. At α = 0.05, what are the p-value and the decision?",
    steps: [
     "The area to the left of 2.12 is 0.9830, so the area to the right is 1 − 0.9830 = 0.0170.",
     "The test is right-tailed, so the p-value is 0.0170.",
     "0.0170 is less than 0.05, so we reject H₀. Had Hₐ been μ ≠ 80, the p-value would be 2 × 0.0170 = 0.0340, still a rejection."
    ],
    answer: "p-value 0.0170; decision 1, reject H₀."
   },
   pitfalls: [
    "Using the area to the left of z for a right-tailed test: the p-value is the area beyond z in the direction of Hₐ.",
    "Forgetting to double for a two-tailed test, so the p-value comes out half its size.",
    "Reading the rule backwards: a small p-value is evidence against H₀, so it leads to rejecting it."
   ]
  },
  guidance: [
   { prompt: "Find the row for z = −1.87 in the table. What is the area to the left of z?", answer: [0.0307], labels: ["area to the left of z"], explanation: "The row −1.87 → 0.0307 says that 0.0307 of the area under the standard normal curve lies to the left of −1.87." },
   { prompt: "Hₐ: μ < 500 makes this a left-tailed test. What is the p-value?", answer: [0.0307], labels: ["p-value"], explanation: "Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.87 → 0.0307 gives p-value = 0.0307." },
   { prompt: "Compare the p-value 0.0307 with α = 0.05. Enter 1 to reject H₀ or 0 not to reject it.", answer: [1], labels: ["decision (1 or 0)"], explanation: "0.0307 is less than α = 0.05, so we reject H₀. The rule: reject H₀ only when the p-value is less than α." }
  ]
 },
 {
  id: "q22", title: "Do the packets really sprout?", topic: "Testing a proportion", tier: "Intermediate", sector: "Inspection Hall",
  brief: "A seed supplier boasts about how many of its packets sprout, and the inspectors want a test that settles it from one sample.",
  lesson: "To test a claimed proportion p₀, z = (p̂ − p₀) ÷ √(p₀(1 − p₀) ÷ n), and the p-value is read from the normal table as before.",
  prompt: "A seed supplier claims that 80% of its packets sprout. Write p for the share of all its packets that sprout. The inspectors test H₀: p = 0.8 against Hₐ: p < 0.8 at significance level α = 0.05. In a random sample of 400 packets, 306 sprouted; assume the packets sprout independently. Rows of the normal table (z → area to the left of z): −1.76 → 0.0392, −1.75 → 0.0401, −1.74 → 0.0409. Enter the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.",
  answer: [-1.75,1], labels: ["z (2 d.p.)","decision (1 reject, 0 not)"], tolerance: 0.00005,
  hints: [
   "If H₀ is true, the sample proportion p̂ has mean p₀ and standard error √(p₀(1 − p₀) ÷ n). Use the claimed p₀ here, not p̂.",
   "z = (p̂ − p₀) ÷ standard error. Then find the p-value from the table as for a mean, in the direction Hₐ points, and reject H₀ when it is less than α."
  ],
  solution: "p̂ = 306 ÷ 400 = 0.765. If H₀ is true, the standard error is √(0.8 × 0.2 ÷ 400) = 0.02. So z = (0.765 − 0.8) ÷ 0.02 = −0.035 ÷ 0.02 = −1.75. Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.75 → 0.0401 gives p-value = 0.0401. 0.0401 is less than α = 0.05, so we reject H₀. Enter −1.75 and 1.",
  xp: 150, prereqs: ["q21","q16"],
  artifact: {"name":"Sprout tally card","description":"One sample’s sprout count set against a supplier’s promise."},
  sources: [source.s9_5],
  teaching: {
   intuition: "A claim about a share, such as “80% of our packets sprout”, is a claim about a population proportion p. The test runs exactly like the test for a mean. H₀ takes the claimed share p₀ (say “p-nought”), and Hₐ says the true share is lower, higher or different. A sample gives the sample proportion p̂ (say “p-hat”), the share that sprouted. If H₀ is true, p̂ varies from sample to sample around p₀ with standard error √(p₀(1 − p₀) ÷ n), where n is the sample size. Notice that it uses p₀, not p̂: we work out how much samples would vary if the claim were true. Then z = (p̂ − p₀) ÷ standard error counts how many standard errors the sample landed from the claim, and the normal table gives the p-value. This works when the outcomes are independent and n × p₀ and n × (1 − p₀) are both at least 5, so that the normal curve fits.",
   steps: [
    "Write H₀: p = p₀ and Hₐ with <, > or ≠, from the wording of the question.",
    "Work out p̂ = x ÷ n, the number of successes divided by the sample size.",
    "Work out the standard error √(p₀(1 − p₀) ÷ n), using the claimed p₀.",
    "z = (p̂ − p₀) ÷ standard error, rounded to 2 decimal places.",
    "Read the p-value from the table row of your rounded z, in the direction Hₐ points, and reject H₀ if it is less than α."
   ],
   example: {
    prompt: "A supplier claims that 50% of its seeds are a fast-growing type. In a random sample of 100 seeds, 61 are. Test H₀: p = 0.5 against Hₐ: p > 0.5 at α = 0.05, given the table row 2.20 → 0.9861.",
    steps: [
     "p̂ = 61 ÷ 100 = 0.61.",
     "The standard error is √(0.5 × 0.5 ÷ 100) = √0.0025 = 0.05.",
     "z = (0.61 − 0.5) ÷ 0.05 = 0.11 ÷ 0.05 = 2.20.",
     "Right-tailed: p-value = 1 − 0.9861 = 0.0139, which is less than 0.05, so we reject H₀."
    ],
    answer: "z = 2.20; decision 1, reject H₀."
   },
   pitfalls: [
    "Using p̂ instead of p₀ in the standard error. The test asks how samples would vary if the claim were true.",
    "Forgetting the square root, or dividing by n outside it.",
    "Writing p₀ − p̂ instead of p̂ − p₀, which flips the sign of z and the tail you read."
   ]
  },
  guidance: [
   { prompt: "What is the sample proportion p̂ = 306 ÷ 400?", answer: [0.765], labels: ["sample proportion p̂"], explanation: "306 of 400 packets sprouted, so p̂ = 306 ÷ 400 = 0.765." },
   { prompt: "If H₀ is true, what is the standard error √(p₀(1 − p₀) ÷ n) with p₀ = 0.8 and n = 400?", answer: [0.02], labels: ["standard error"], explanation: "0.8 × 0.2 = 0.16, so the standard error is √0.16 ÷ √400 = 0.4 ÷ 20 = 0.02." },
   { prompt: "What is z = (p̂ − p₀) ÷ standard error, to 2 decimal places?", answer: [-1.75], labels: ["z (2 d.p.)"], explanation: "(0.765 − 0.8) ÷ 0.02 = −0.035 ÷ 0.02 = −1.75." },
   { prompt: "Use the table row for z = −1.75. What is the p-value, and what is the decision (1 reject, 0 do not reject)?", answer: [0.0401,1], labels: ["p-value","decision (1 or 0)"], explanation: "Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.75 → 0.0401 gives p-value = 0.0401. 0.0401 is less than α = 0.05, so we reject H₀." }
  ]
 },
 {
  id: "q23", title: "The supplier on trial", topic: "Chapter review: a full test of a claim", tier: "Intermediate", sector: "Inspection Hall",
  brief: "Two suppliers are under review, and the council wants every step of the test laid out: the hypotheses, the statistic and the verdict.",
  lesson: "A full test: H₀ from the claim, the tail from Hₐ, a z statistic, its p-value, and the decision against α.",
  prompt: "A supplier claims that its power cells run for 50 hours on average, or longer. The inspectors suspect that the true mean running time μ is lower. From long records the running times have standard deviation σ = 5 hours. A random sample of 25 cells ran for a mean of x̄ = 48.3 hours. Test the claim at significance level α = 0.05. Rows of the normal table (z → area to the left of z): −1.71 → 0.0436, −1.70 → 0.0446, −1.69 → 0.0455. Enter the tail of the test (1 left-tailed, 2 right-tailed, 3 two-tailed), then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.",
  answer: [1,-1.7,1], labels: ["tail (1, 2 or 3)","z (2 d.p.)","decision (1 reject, 0 not)"], tolerance: 0.00005,
  hints: [
   "Read which direction the story asks about, whether it is what the inspectors suspect or what a test must show: “lower” makes Hₐ use <, “higher” makes it use >, and “different, in either direction” makes it use ≠. H₀ always takes the claimed value.",
   "For a mean with σ known the standard error is σ ÷ √n; for a proportion it is √(p₀(1 − p₀) ÷ n). z = (estimate − claimed value) ÷ standard error, and H₀ is rejected when the p-value is less than α."
  ],
  solution: "The hypotheses are H₀: μ = 50 and Hₐ: μ < 50: the suspicion is “lower”, so Hₐ uses < and the test is left-tailed (1). The standard error is σ ÷ √n = 5 ÷ √25 = 5 ÷ 5 = 1, so z = (x̄ − μ₀) ÷ (σ ÷ √n) = (48.3 − 50) ÷ 1 = −1.7 ÷ 1 = −1.70. Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.70 → 0.0446 gives p-value = 0.0446. 0.0446 is less than α = 0.05, so we reject H₀. If the claim is in fact true, this rejection is a Type I error, a risk of α. Enter 1, −1.70 and 1.",
  xp: 150, prereqs: ["q19","q22"],
  artifact: {"name":"Inspection verdict","description":"A signed sheet: the claim, the test and the decision, step by step."},
  sources: [source.s9_4, source.s9_5],
  teaching: {
   intuition: "Every test in this chapter follows the same five moves, whether the claim is about a mean or a share. First, the null hypothesis H₀ takes the claimed value, and the alternative Hₐ points where the doubt points: “lower” gives <, “higher” gives >, and “different” gives ≠. Second, α is chosen before looking at the data. Third, measure how far the sample landed from the claim in standard errors: z = (estimate − claimed value) ÷ standard error, with standard error σ ÷ √n for a mean when σ is known, or √(p₀(1 − p₀) ÷ n) for a proportion. Fourth, turn z into a p-value with the normal table. Fifth, decide: reject H₀ if the p-value is less than α. Either decision can be wrong. Rejecting a true H₀ is a Type I error, and its chance is α; keeping a false H₀ is a Type II error.",
   steps: [
    "Write H₀ with the claimed value, and choose the tail of Hₐ from the words: 1 for <, 2 for >, 3 for ≠.",
    "Find the standard error: σ ÷ √n for a mean with σ known, √(p₀(1 − p₀) ÷ n) for a proportion.",
    "Work out z = (estimate − claimed value) ÷ standard error, to 2 decimal places.",
    "Read the p-value from the table in the direction of Hₐ, and reject H₀ (1) if it is less than α, otherwise not (0)."
   ],
   example: {
    prompt: "A supplier claims that its grit sacks weigh 25 kg on average; the inspectors want to know whether the mean is different from 25 kg, in either direction. σ = 2 kg from long records, and 64 sacks average 25.6 kg. Test at α = 0.05, given the table row 2.40 → 0.9918.",
    steps: [
     "“Different” gives Hₐ: μ ≠ 25, a two-tailed test: tail 3.",
     "The standard error is 2 ÷ √64 = 2 ÷ 8 = 0.25, so z = (25.6 − 25) ÷ 0.25 = 2.40.",
     "Two-tailed: p-value = 2 × (1 − 0.9918) = 2 × 0.0082 = 0.0164, which is less than 0.05, so we reject H₀."
    ],
    answer: "Tail 3, z = 2.40, decision 1."
   },
   pitfalls: [
    "Taking the tail from the claim’s own words (“or longer”) instead of from what the inspectors suspect.",
    "Mixing up the two standard errors: σ ÷ √n is for a mean, √(p₀(1 − p₀) ÷ n) for a proportion.",
    "Treating “do not reject” as proof that the claim is true; it only means the sample is not strong evidence against it."
   ]
  },
  guidance: [
   { prompt: "H₀ takes the claimed value. Which way does Hₐ point? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.", answer: [1], labels: ["tail (1, 2 or 3)"], explanation: "H₀: μ = 50 and Hₐ: μ < 50: the suspicion is “lower”, so Hₐ uses < and the test is left-tailed (1)." },
   { prompt: "What is the standard error of the sample mean if H₀ is true?", answer: [1], labels: ["standard error"], explanation: "σ ÷ √n = 5 ÷ 5 = 1." },
   { prompt: "What is z = (estimate − claimed value) ÷ standard error, to 2 decimal places?", answer: [-1.7], labels: ["z (2 d.p.)"], explanation: "(48.3 − 50) ÷ 1 = −1.7 ÷ 1 = −1.70." },
   { prompt: "Use the table row for z = −1.70. What is the p-value, and what is the decision (1 reject, 0 do not reject)?", answer: [0.0446,1], labels: ["p-value","decision (1 or 0)"], explanation: "Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: the row −1.70 → 0.0446 gives p-value = 0.0446. 0.0446 is less than α = 0.05, so we reject H₀." }
  ]
 },
 {
  id: "q24", title: "New seed against old", topic: "Two independent means: the two-sample t statistic", tier: "Intermediate", sector: "Trial Fields",
  brief: "The new seed and the old one grew on separate plots, and the council wants to know whether the new seed’s higher average is real or luck.",
  lesson: "For two independent samples, t = (x̄₁ − x̄₂) ÷ √(s₁² ÷ n₁ + s₂² ÷ n₂), compared with a critical value from the t table.",
  prompt: "The Trial Fields grew the new seed on 10 plots and the old seed on 16 other plots, chosen at random. New seed: mean yield x̄₁ = 44.6 kg, standard deviation s₁ = 5 kg. Old seed: x̄₂ = 41.2 kg, s₂ = 4 kg. The council tests H₀: μ₁ = μ₂ against Hₐ: μ₁ > μ₂ at α = 0.05. The degrees-of-freedom formula gives df = 16 (rounded down), and the t table gives the critical value t* = 1.746 for df = 16, with an area of 0.05 to its right. Enter the two-sample t statistic to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (compare the unrounded t with t*).",
  answer: [1.82,1], labels: ["t (2 d.p.)","decision (1 reject, 0 not)"], tolerance: 0.0005,
  hints: [
   "Each sample adds s² ÷ n to the square of the standard error: SE = √(s₁² ÷ n₁ + s₂² ÷ n₂). The two variances are not pooled.",
   "If H₀ is true μ₁ − μ₂ = 0, so t = (x̄₁ − x̄₂) ÷ SE. Compare t with the critical value t* in the direction Hₐ points."
  ],
  solution: "s₁² ÷ n₁ = 25 ÷ 10 = 2.5 and s₂² ÷ n₂ = 16 ÷ 16 = 1. SE = √(2.5 + 1) = √3.5 = 1.8708 (to 4 decimal places). t = (44.6 − 41.2) ÷ 1.8708 = 3.4 ÷ 1.8708, which is 1.82 to 2 decimal places. Hₐ: μ₁ > μ₂ is right-tailed, so H₀ is rejected when t is greater than t* = 1.746. 1.82 is greater than 1.746, so we reject H₀: the p-value is below 0.05. Enter 1.82 and 1.",
  xp: 150, prereqs: ["q21","q15"],
  artifact: {"name":"Twin plot markers","description":"Flags for two separate groups of plots, one per seed."},
  sources: [source.s10_1],
  teaching: {
   intuition: "Two groups of plots, one sown with each seed, give two sample means. Even if both seeds were equally good, the two means would differ a little by chance, so the question is whether the gap is bigger than chance easily makes. The samples are independent: different plots, chosen separately, so one group tells us nothing about the other. Each sample mean wobbles with its own standard error s ÷ √n, and the gap between them wobbles with standard error SE = √(s₁² ÷ n₁ + s₂² ÷ n₂): the squares of the two standard errors add, and the two variances are not pooled. With H₀: μ₁ = μ₂ the expected gap is 0, so t = (x̄₁ − x̄₂) ÷ SE. This is the two-sample t test. Because s₁ and s₂ only estimate the true spreads, t follows a Student’s t distribution, whose degrees of freedom come from a long formula that the prompt works out for you. Instead of a p-value we compare t with a critical value t* from the t table: t* cuts off an area α in the tail Hₐ points to, or α ÷ 2 in each tail for ≠. A t beyond t* means the p-value is less than α, so H₀ is rejected.",
   steps: [
    "Square each standard deviation and divide by its sample size: s₁² ÷ n₁ and s₂² ÷ n₂.",
    "Add them and take the square root: SE = √(s₁² ÷ n₁ + s₂² ÷ n₂).",
    "Divide the difference of the means by it: t = (x̄₁ − x̄₂) ÷ SE, to 2 decimal places.",
    "Right-tailed: reject H₀ if t is greater than t*. Two-tailed: reject it if t is beyond −t* or t*."
   ],
   example: {
    prompt: "New seed on 15 plots: mean 52.0 kg, s = 6 kg. Old seed on 15 other plots: mean 48.0 kg, s = 3 kg. Test H₀: μ₁ = μ₂ against Hₐ: μ₁ > μ₂ at α = 0.05, with df = 20 and t* = 1.725.",
    steps: [
     "36 ÷ 15 = 2.4 and 9 ÷ 15 = 0.6.",
     "SE = √(2.4 + 0.6) = √3 = 1.7321.",
     "t = (52.0 − 48.0) ÷ 1.7321 = 2.31.",
     "2.31 is greater than 1.725, so we reject H₀."
    ],
    answer: "t = 2.31; decision 1, reject H₀."
   },
   pitfalls: [
    "Adding the standard deviations, or the two values of s ÷ √n, instead of adding s² ÷ n under one square root.",
    "Subtracting the means in the opposite order from Hₐ, which flips the sign of t.",
    "Comparing t with a two-tailed t* for a one-tailed test, or the other way round."
   ]
  },
  guidance: [
   { prompt: "What are s₁² ÷ n₁ and s₂² ÷ n₂?", answer: [2.5,1], labels: ["s₁² ÷ n₁","s₂² ÷ n₂"], explanation: "5² = 25 and 25 ÷ 10 = 2.5; 4² = 16 and 16 ÷ 16 = 1." },
   { prompt: "What is the standard error SE = √(2.5 + 1), to 3 decimal places?", answer: [1.871], labels: ["SE (3 d.p.)"], explanation: "2.5 + 1 = 3.5, and √3.5 = 1.8708, which is 1.871 to 3 decimal places. Keep the longer value for the next step." },
   { prompt: "What is t = (x̄₁ − x̄₂) ÷ SE, to 2 decimal places?", answer: [1.82], labels: ["t (2 d.p.)"], explanation: "(44.6 − 41.2) ÷ 1.8708 = 3.4 ÷ 1.8708, which rounds to 1.82." },
   { prompt: "Compare the unrounded t with the critical value t* = 1.746. Enter 1 to reject H₀ or 0 not to reject it.", answer: [1], labels: ["decision (1 or 0)"], explanation: "Hₐ: μ₁ > μ₂ is right-tailed, so H₀ is rejected when t is greater than t* = 1.746. 1.82 is greater than 1.746, so we reject H₀: the p-value is below 0.05." }
  ]
 },
 {
  id: "q25", title: "Which seed sprouts more often?", topic: "Two proportions: the pooled proportion and z", tier: "Intermediate", sector: "Trial Fields",
  brief: "The new seed seems to sprout more often than the old, and the council wants one number that says how far apart the two shares really are.",
  lesson: "To compare two proportions, pool the samples into p_c = (x₁ + x₂) ÷ (n₁ + n₂) and divide p̂₁ − p̂₂ by √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)).",
  prompt: "The Trial Fields sowed 200 seeds of the new variety and 250 of the old, in random positions, and assume each seed sprouts independently. 150 of the new seeds and 160 of the old seeds sprouted. To test H₀: p₁ = p₂, the same sprouting share for both, enter the pooled proportion to 3 decimal places, then the z statistic for new minus old to 2 decimal places.",
  answer: [0.689,2.5], labels: ["pooled proportion (3 d.p.)","z (2 d.p.)"], tolerance: 0.0005,
  hints: [
   "If H₀ is true both groups share one proportion, so pool them: p_c = (all the seeds that sprouted) ÷ (all the seeds sown).",
   "z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)). Keep p_c unrounded inside the square root."
  ],
  solution: "p̂₁ = 150 ÷ 200 = 0.75 and p̂₂ = 160 ÷ 250 = 0.64. Pooled: p_c = (150 + 160) ÷ (200 + 250) = 310 ÷ 450, which is 0.689 to 3 decimal places. The standard error is √(p_c(1 − p_c)(1 ÷ 200 + 1 ÷ 250)) = 0.0439 (to 4 decimal places), so z = (0.75 − 0.64) ÷ 0.0439 = 0.11 ÷ 0.0439, which is 2.50 to 2 decimal places. Enter 0.689 and 2.50.",
  xp: 150, prereqs: ["q22"],
  artifact: {"name":"Sprouting trays","description":"Two trays of seedlings, counted together for one pooled share."},
  sources: [source.s10_3],
  teaching: {
   intuition: "Now each group gives a share instead of a mean: the share of new seeds that sprouted, p̂₁, and the share of old seeds, p̂₂. The null hypothesis says the two true shares are equal, H₀: p₁ = p₂. If that is so, both samples come from one common share, and the best estimate of it uses every seed at once. That estimate is the pooled proportion p_c: all the successes together divided by all the trials together, p_c = (x₁ + x₂) ÷ (n₁ + n₂). It sits between the two sample shares, nearer the bigger sample. If H₀ is true, the gap p̂₁ − p̂₂ has standard error √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)), and z = (p̂₁ − p̂₂) ÷ standard error counts the gap in standard errors, to be read with the normal table as before. The groups must be independent, with at least 5 successes and 5 failures in each.",
   steps: [
    "Work out each sample proportion: p̂₁ = x₁ ÷ n₁ and p̂₂ = x₂ ÷ n₂.",
    "Pool: p_c = (x₁ + x₂) ÷ (n₁ + n₂), all the successes over all the trials.",
    "Standard error: √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)), with p_c unrounded.",
    "z = (p̂₁ − p̂₂) ÷ standard error, to 2 decimal places."
   ],
   example: {
    prompt: "Of 100 new seeds 62 sprouted, and of 100 old seeds 50 sprouted. Find the pooled proportion and z for new minus old.",
    steps: [
     "p̂₁ = 0.62 and p̂₂ = 0.5.",
     "p_c = (62 + 50) ÷ (100 + 100) = 112 ÷ 200 = 0.56.",
     "The standard error is √(0.56 × 0.44 × (0.01 + 0.01)) = √0.004928 = 0.0702.",
     "z = (0.62 − 0.5) ÷ 0.0702 = 0.12 ÷ 0.0702 = 1.71."
    ],
    answer: "p_c = 0.56; z = 1.71."
   },
   pitfalls: [
    "Averaging the two sample proportions instead of pooling the counts: with unequal samples the two give different answers.",
    "Using p̂₁ and p̂₂ inside the standard error instead of p_c.",
    "Rounding p_c before the square root, which can change the last digit of z."
   ]
  },
  guidance: [
   { prompt: "What are the two sample proportions, p̂₁ for the new seed and p̂₂ for the old?", answer: [0.75,0.64], labels: ["p̂₁ (new)","p̂₂ (old)"], explanation: "p̂₁ = 150 ÷ 200 = 0.75 and p̂₂ = 160 ÷ 250 = 0.64." },
   { prompt: "What is the pooled proportion p_c = (x₁ + x₂) ÷ (n₁ + n₂), to 3 decimal places?", answer: [0.689], labels: ["pooled proportion (3 d.p.)"], explanation: "(150 + 160) ÷ (200 + 250) = 310 ÷ 450, which rounds to 0.689." },
   { prompt: "What is z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ 200 + 1 ÷ 250)), to 2 decimal places?", answer: [2.5], labels: ["z (2 d.p.)"], explanation: "1 ÷ 200 + 1 ÷ 250 = 0.009, so the standard error is 0.0439 to 4 decimal places, and (0.75 − 0.64) ÷ 0.0439 rounds to 2.50." }
  ]
 },
 {
  id: "q26", title: "The same plots, two seasons", topic: "Matched pairs: testing the differences", tier: "Intermediate", sector: "Trial Fields",
  brief: "Each plot grew the old seed one season and the new seed the next, and the council wants to use that pairing instead of throwing it away.",
  lesson: "With matched pairs, turn each pair into one difference and run a one-sample t test on the differences: t = x̄d ÷ (s_d ÷ √n).",
  prompt: "The Trial Fields planted 7 plots with the old seed one season and the new seed the next, so each plot gives a matched pair. Yields in kg, old then new: A 31 and 35; B 26 and 27; C 35 and 41; D 29 and 32; E 38 and 43; F 24 and 24; G 33 and 35. Take each difference as new minus old. Enter the mean difference x̄d in kg, then the t statistic for testing H₀: μd = 0, to 2 decimal places.",
  answer: [3,3.67], labels: ["mean difference x̄d (kg)","t (2 d.p.)"], tolerance: 0.005,
  hints: [
   "Work only with the differences, one per plot: new yield minus old yield. They are the data now.",
   "Find the mean x̄d and the sample standard deviation s_d of the differences (divide by n − 1), then t = x̄d ÷ (s_d ÷ √n), with n the number of pairs."
  ],
  solution: "The differences are 4, 1, 6, 3, 5, 0, 2. Their sum is 21, so x̄d = 21 ÷ 7 = 3 kg. The squared distances from the mean add to 1 + 4 + 9 + 0 + 4 + 9 + 1 = 28, so s_d = √(28 ÷ 6) = 2.1602 (to 4 decimal places). t = 3 ÷ (2.1602 ÷ √7) = 3 ÷ 0.8165, which is 3.67 to 2 decimal places, with df = 6. Enter 3 and 3.67.",
  xp: 150, prereqs: ["q24"],
  artifact: {"name":"Paired plot log","description":"Each plot’s two harvests on one line, with the difference beside them."},
  sources: [source.s10_4],
  teaching: {
   intuition: "Some plots are simply richer than others. If the same plot grows the old seed one season and the new seed the next, its two yields form a matched pair, and the plot’s own richness cancels out when we subtract. So each pair becomes one number, the difference d = new − old, and these paired differences are now the data. Their mean is x̄d and their sample standard deviation is s_d, found exactly as for any data set, dividing by n − 1. If the new seed makes no difference, the true mean difference μd is 0, so H₀: μd = 0. The test statistic is t = (x̄d − 0) ÷ (s_d ÷ √n), with n the number of pairs, and it follows a Student’s t distribution with df = n − 1. A positive t says the new seed tends to yield more.",
   steps: [
    "Subtract within each pair, always in the same order: d = new − old.",
    "Find the mean of the differences, x̄d = Σd ÷ n.",
    "Find their standard deviation: s_d = √(Σ(d − x̄d)² ÷ (n − 1)).",
    "t = x̄d ÷ (s_d ÷ √n), to 2 decimal places, with df = n − 1."
   ],
   example: {
    prompt: "Five plots, old then new yields in kg: 30 and 32, 25 and 29, 33 and 33, 28 and 31, 26 and 32. Find the mean difference and t.",
    steps: [
     "The differences new − old are 2, 4, 0, 3, 6, with sum 15 and mean 15 ÷ 5 = 3.",
     "The squared distances from 3 add to 1 + 1 + 9 + 0 + 9 = 20, so s_d = √(20 ÷ 4) = √5 = 2.2361.",
     "s_d ÷ √5 = 2.2361 ÷ 2.2361 = 1, so t = 3 ÷ 1 = 3.00, with df = 4."
    ],
    answer: "x̄d = 3 kg; t = 3.00."
   },
   pitfalls: [
    "Treating the two columns as independent samples and using the two-sample formula: that throws the pairing away.",
    "Subtracting old − new for some plots and new − old for others.",
    "Dividing by n instead of n − 1 for s_d, or counting the yields (2n) instead of the pairs."
   ]
  },
  guidance: [
   { prompt: "Work out the 7 differences, new minus old. What is their sum, and what is their mean x̄d?", answer: [21,3], labels: ["sum of differences","mean difference"], explanation: "The differences are 4, 1, 6, 3, 5, 0, 2. They add to 21, and 21 ÷ 7 = 3." },
   { prompt: "Subtract the mean 3 from each difference and square. What do the squares add to?", answer: [28], labels: ["sum of squares"], explanation: "1 + 4 + 9 + 0 + 4 + 9 + 1 = 28." },
   { prompt: "What is the standard deviation of the differences, s_d = √(28 ÷ 6), to 2 decimal places?", answer: [2.16], labels: ["s_d (2 d.p.)"], explanation: "28 ÷ 6 = 4.6667 (to 4 decimal places), and its square root is 2.1602, which is 2.16 to 2 decimal places. Keep the longer value for the next step." },
   { prompt: "What is t = x̄d ÷ (s_d ÷ √7), to 2 decimal places?", answer: [3.67], labels: ["t (2 d.p.)"], explanation: "s_d ÷ √7 = 2.1602 ÷ 2.6458 = 0.8165, and 3 ÷ 0.8165 rounds to 3.67." }
  ]
 },
 {
  id: "q27", title: "Is the seed mix as labelled?", topic: "Chi-square goodness of fit", tier: "Intermediate", sector: "Trial Fields",
  brief: "A supplier’s sacks promise a set mix of seed sizes, and the Trial Fields want to know whether one sack fits the label.",
  lesson: "Goodness of fit compares the observed counts O with the expected counts E that a claim predicts: χ² = Σ(O − E)² ÷ E.",
  prompt: "A seed supplier claims that its mixed sacks hold 50% large, 30% medium and 20% small seeds. The Trial Fields sorted a random sample of 120 seeds from one sack: 52 large, 41 medium and 27 small. Enter the expected counts of large, medium and small seeds if the claim is true, then the chi-square statistic χ² to 2 decimal places.",
  answer: [60,36,24,2.14], labels: ["expected large","expected medium","expected small","χ² (2 d.p.)"], tolerance: 0.005,
  hints: [
   "An expected count is the claimed share times the sample size: what the claim says we should see.",
   "For each category work out (O − E)² ÷ E, with O the observed count and E the expected count, and add the three results."
  ],
  solution: "Expected counts: 50% of 120 is 60, 30% is 36 and 20% is 24. The differences O − E are −8, 5, 3, with squares 64, 25, 9. χ² = 64 ÷ 60 + 25 ÷ 36 + 9 ÷ 24, which is 2.14 to 2 decimal places. Enter 60, 36, 24 and 2.14.",
  xp: 150, prereqs: ["q21"],
  artifact: {"name":"Seed sieve","description":"Three trays for large, medium and small seeds, with the label’s promise beside them."},
  sources: [source.s11_2],
  teaching: {
   intuition: "Some claims are about how a whole sample splits into categories: half large seeds, a third medium, the rest small. A goodness-of-fit test checks whether the counts fit such a claim. First, turn the claim into expected counts: the count each category should get if the claim is true, which is its claimed share times the sample size. Then compare them with the observed counts, the counts we actually saw. For each category, square the gap O − E and divide by E, so that a gap of 5 counts for more when only 20 were expected than when 200 were. Adding these gives the chi-square statistic, χ² = Σ(O − E)² ÷ E (χ is the Greek letter chi, said “kai”). χ² is 0 when the fit is perfect and grows as the fit gets worse, so the test is always right-tailed. It is compared with a chi-square distribution whose degrees of freedom, df = k − 1 for k categories, pick which chi-square curve to use. The test needs every expected count to be at least 5.",
   steps: [
    "Write H₀: the shares are as claimed.",
    "Expected count of each category: claimed share × sample size. The expected counts add up to the sample size.",
    "For each category work out (O − E)² ÷ E.",
    "Add them: χ² = Σ(O − E)² ÷ E. A large χ² means a poor fit."
   ],
   example: {
    prompt: "A sack claims 60% large, 30% medium and 10% small seeds. A sample of 100 holds 52 large, 35 medium and 13 small. Find the expected counts and χ².",
    steps: [
     "Expected: 60% of 100 = 60, 30% of 100 = 30 and 10% of 100 = 10.",
     "(52 − 60)² ÷ 60 = 64 ÷ 60 = 1.0667; (35 − 30)² ÷ 30 = 25 ÷ 30 = 0.8333; (13 − 10)² ÷ 10 = 9 ÷ 10 = 0.9.",
     "χ² = 1.0667 + 0.8333 + 0.9 = 2.80."
    ],
    answer: "Expected counts 60, 30 and 10; χ² = 2.80."
   },
   pitfalls: [
    "Dividing by the observed count O instead of the expected count E.",
    "Forgetting to square O − E, so that positive and negative gaps cancel out.",
    "Using the shares themselves instead of counts: χ² works with counts, so multiply each share by the sample size."
   ]
  },
  guidance: [
   { prompt: "If the claim is true, how many large, medium and small seeds should a sample of 120 hold?", answer: [60,36,24], labels: ["expected large","expected medium","expected small"], explanation: "50% of 120 = 60, 30% of 120 = 36 and 20% of 120 = 24. They add to 120, as they must." },
   { prompt: "For each category, what is (O − E)²?", answer: [64,25,9], labels: ["(O − E)² large","(O − E)² medium","(O − E)² small"], explanation: "(52 − 60)² = 64, (41 − 36)² = 25, (27 − 24)² = 9." },
   { prompt: "What is χ² = 64 ÷ 60 + 25 ÷ 36 + 9 ÷ 24, to 2 decimal places?", answer: [2.14], labels: ["χ² (2 d.p.)"], explanation: "64 ÷ 60 = 1.0667, 25 ÷ 36 = 0.6944, 9 ÷ 24 = 0.375. Their sum rounds to 2.14." }
  ]
 },
 {
  id: "q28", title: "Does the harvest depend on the seed?", topic: "Chi-square test of independence", tier: "Intermediate", sector: "Trial Fields",
  brief: "The council has a table of harvest grades by seed type, and wants to know whether the grade has anything to do with the seed.",
  lesson: "In a test of independence each expected count is row total × column total ÷ grand total, df = (rows − 1) × (columns − 1), and χ² = Σ(O − E)² ÷ E over every cell.",
  prompt: "The Trial Fields graded the harvest of 200 plots. New seed: 22 poor, 33 fair, 45 good. Old seed: 38 poor, 27 fair, 35 good. To test H₀: the grade is independent of the seed, enter the expected count for new seed with a good harvest, then the degrees of freedom, then χ² to 2 decimal places.",
  answer: [40,2,6.12], labels: ["expected count","df","χ² (2 d.p.)"], tolerance: 0.005,
  hints: [
   "If H₀ is true, the expected count of a cell is (row total × column total) ÷ grand total.",
   "df = (number of rows − 1) × (number of columns − 1). χ² adds (O − E)² ÷ E over all six cells."
  ],
  solution: "The row totals are 100 and 100, the column totals 60, 60, 80, and the grand total 200. The new-seed, good cell expects 100 × 80 ÷ 200 = 40. The table has 2 rows and 3 columns, so df = (2 − 1) × (3 − 1) = 2. The six expected counts are new 30, 30, 40; old 30, 30, 40, and adding (O − E)² ÷ E over the six cells gives χ² = 6.1167, which is 6.12 to 2 decimal places. Enter 40, 2 and 6.12.",
  xp: 150, prereqs: ["q27"],
  artifact: {"name":"Harvest grade board","description":"A two-way board of seed type against harvest grade."},
  sources: [source.s11_3],
  teaching: {
   intuition: "A two-way table sorts every plot in two ways at once: by its seed (the rows) and by its harvest grade (the columns). The test of independence asks whether the two are linked. H₀ says they are independent: the seed tells you nothing about the grade. If so, the grades should split in the same proportions in every row. That gives each cell’s expected count, row total × column total ÷ grand total. For example, if 40% of all plots were good and a row has 50 plots, that row should hold 40% of 50 = 20 good plots, and 50 × (column total) ÷ (grand total) is exactly that. Then χ² = Σ(O − E)² ÷ E, added over every cell of the table, measures how far the table is from independence, and the test is right-tailed. The degrees of freedom are df = (number of rows − 1) × (number of columns − 1): once that many cells are filled in, the totals fix the rest. Every expected count should be at least 5.",
   steps: [
    "Add up each row and each column, and find the grand total.",
    "Expected count of a cell: row total × column total ÷ grand total.",
    "df = (rows − 1) × (columns − 1).",
    "For every cell work out (O − E)² ÷ E, and add them all to get χ²."
   ],
   example: {
    prompt: "A table of 100 plots: new seed 18 poor, 22 fair, 20 good; old seed 12 poor, 18 fair, 10 good. Find the expected count for old seed with a good harvest, df and χ².",
    steps: [
     "Row totals 60 and 40; column totals 30, 40 and 30. Old seed, good harvest: 40 × 30 ÷ 100 = 12.",
     "df = (2 − 1) × (3 − 1) = 2.",
     "All six expected counts: new 18, 24, 18; old 12, 16, 12.",
     "χ² = 0 ÷ 18 + 4 ÷ 24 + 4 ÷ 18 + 0 ÷ 12 + 4 ÷ 16 + 4 ÷ 12 = 0.97."
    ],
    answer: "Expected count 12; df = 2; χ² = 0.97."
   },
   pitfalls: [
    "Multiplying the row total by the column total and forgetting to divide by the grand total.",
    "Taking df as the number of cells minus 1, which belongs to goodness of fit, not to a two-way table.",
    "Adding (O − E)² ÷ E over one row only instead of over every cell."
   ]
  },
  guidance: [
   { prompt: "For the new-seed, good cell: what is its row total, its column total, and the grand total?", answer: [100,80,200], labels: ["row total","column total","grand total"], explanation: "The new-seed row adds to 100, the good column adds to 80, and all the plots add to 200." },
   { prompt: "What is that cell's expected count, row total × column total ÷ grand total?", answer: [40], labels: ["expected count"], explanation: "100 × 80 ÷ 200 = 8000 ÷ 200 = 40." },
   { prompt: "The table has 2 rows and 3 columns. What is df?", answer: [2], labels: ["df"], explanation: "df = (2 − 1) × (3 − 1) = 1 × 2 = 2." },
   { prompt: "The six expected counts are new 30, 30, 40; old 30, 30, 40. What is χ², the sum of (O − E)² ÷ E over the six cells, to 2 decimal places?", answer: [6.12], labels: ["χ² (2 d.p.)"], explanation: "(22 − 30)² ÷ 30 + (33 − 30)² ÷ 30 + (45 − 40)² ÷ 40 + (38 − 30)² ÷ 30 + (27 − 30)² ÷ 30 + (35 − 40)² ÷ 40 rounds to 6.12." }
  ]
 },
 {
  id: "q29", title: "The right test for the trial", topic: "Chapter review: choosing a two-group test", tier: "Intermediate", sector: "Trial Fields",
  brief: "The Trial Fields have four kinds of result on file, and the council wants each one checked with the test that fits it.",
  lesson: "Two independent groups of measurements take the two-sample t test, paired measurements the matched-pairs t test, counts against claimed shares goodness of fit, and a two-way table of counts the test of independence.",
  prompt: "The same 16 plots were sown with the old seed one season and the new seed the next. The 16 differences in yield, new minus old, have mean 1.8 kg and standard deviation 3.2 kg. The council asks whether the new seed raises the yield, testing H₀: μd = 0. Which test fits? 1 two-sample t test (two independent means), 2 matched-pairs t test, 3 chi-square goodness-of-fit test, 4 chi-square test of independence. Enter the number of the test, then its statistic (t) to 2 decimal places.",
  answer: [2,2.25], labels: ["test number","statistic (2 d.p.)"], tolerance: 0.005,
  hints: [
   "First ask: are the data measurements (kilograms) or counts in categories? Measurements of two groups call for a t test; counts call for chi-square.",
   "Measurements: the same plots twice means matched pairs, different plots means two independent samples. Counts: claimed shares mean goodness of fit, a two-way table means independence."
  ],
  solution: "This is test 2, the matched-pairs t test: the same plots are measured twice, so each plot gives one difference and the differences are the data. s_d ÷ √n = 3.2 ÷ √16 = 3.2 ÷ 4 = 0.8, and t = 1.8 ÷ 0.8 = 2.25. Enter 2 and 2.25.",
  xp: 150, prereqs: ["q26","q28"],
  artifact: {"name":"Test chooser","description":"A card with two questions that sends any trial result to its test."},
  sources: [source.s10_1, source.s10_4, source.s11_2, source.s11_3],
  teaching: {
   intuition: "Choosing the test comes before any arithmetic, and two questions settle it. First: are the data measurements, such as kilograms of yield, or counts of things in categories? Measurements of two groups call for a t test, which compares means. Counts call for a chi-square test. Second, for measurements: did the two groups use different plots, or the same plots twice? Different plots give two independent samples, so use the two-sample t test, t = (x̄₁ − x̄₂) ÷ √(s₁² ÷ n₁ + s₂² ÷ n₂). The same plots give matched pairs, so subtract within each pair and use t = x̄d ÷ (s_d ÷ √n). For counts: are they set against claimed shares in one list of categories, or sorted two ways at once in a two-way table? Claimed shares call for goodness of fit, with E = share × sample size; a two-way table calls for the test of independence, with E = row total × column total ÷ grand total. Both then use χ² = Σ(O − E)² ÷ E.",
   steps: [
    "Decide whether the data are measurements or counts in categories.",
    "Measurements: the same units measured twice means matched pairs (test 2); separate groups mean two independent samples (test 1).",
    "Counts: one list checked against claimed shares means goodness of fit (test 3); a two-way table means independence (test 4).",
    "Work out that test’s statistic, to 2 decimal places."
   ],
   example: {
    prompt: "Of 100 plots, 40 were sown with the new seed and 60 with the old, and each crop was graded healthy or blighted: new 30 healthy, 10 blighted; old 30 healthy, 30 blighted. Which test fits, and what is its statistic?",
    steps: [
     "Counts sorted two ways at once, by seed and by health, form a two-way table: test 4, independence.",
     "Expected counts: new 40 × 60 ÷ 100 = 24 healthy and 16 blighted; old 36 healthy and 24 blighted.",
     "χ² = 36 ÷ 24 + 36 ÷ 16 + 36 ÷ 36 + 36 ÷ 24 = 1.5 + 2.25 + 1 + 1.5 = 6.25."
    ],
    answer: "Test 4; χ² = 6.25."
   },
   pitfalls: [
    "Using the two-sample t test for two seasons on the same plots: the pairs must be kept together.",
    "Using goodness of fit for a two-way table: when counts are sorted two ways at once, the expected counts come from the row and column totals.",
    "Reaching for a t test when the data are counts: t compares means of measurements."
   ]
  },
  guidance: [
   { prompt: "Measurements or counts, and how are the groups formed? Enter the number of the test that fits.", answer: [2], labels: ["test number"], explanation: "Test 2, the matched-pairs t test: the same plots are measured twice, so each plot gives one difference and the differences are the data." },
   { prompt: "Work out the statistic t for this test, to 2 decimal places.", answer: [2.25], labels: ["statistic (2 d.p.)"], explanation: "s_d ÷ √n = 3.2 ÷ √16 = 3.2 ÷ 4 = 0.8, and t = 1.8 ÷ 0.8 = 2.25." }
  ]
 },
 {
  id: "q30", title: "Sunlight and the solar output", topic: "Scatter plots and the correlation coefficient r", tier: "Advanced", sector: "Solar Farm",
  brief: "The Solar Farm wants to know how closely its daily power output follows the weather, before anyone tries to predict it.",
  lesson: "A scatter plot shows paired data as points; the correlation coefficient r, between −1 and 1, measures how closely they follow a straight line and in which direction.",
  prompt: "The Solar Farm logged five days, each with its hours of sunlight x and its power output y in MWh: (4, 8), (6, 12), (7, 10), (9, 15), (10, 14). Enter the correlation coefficient r to 2 decimal places.",
  answer: [0.88], labels: ["r (2 d.p.)"], tolerance: 0.005,
  hints: [
   "Tabulate the five sums first: Σx, Σy, Σx², Σy² and Σxy, where Σxy adds x × y for each point.",
   "r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)), with n = 5. Its sign shows the direction of the pattern."
  ],
  solution: "Σx = 36, Σy = 59, Σx² = 282, Σy² = 729 and Σxy = 449. The top is 5 × 449 − 36 × 59 = 121. The bottom is √((5 × 282 − 36²)(5 × 729 − 59²)) = √(114 × 164) = 136.7333. So r = 121 ÷ 136.7333, which is 0.88 to 2 decimal places: more output goes with more hours of sunlight, a strong positive linear relationship. Enter 0.88.",
  xp: 200, prereqs: ["q07"],
  artifact: {"name":"Sunlight scatter chart","description":"Five days as five points, and the number that says how straight they line up."},
  sources: [source.s12_2, source.s12_3],
  teaching: {
   intuition: "Some data come in pairs: each day gives two numbers, an x (hours of sunlight) and a y (power output). Plotting each pair as a point (x, y) gives a scatter plot. If the points rise from left to right, more x goes with more y: a positive relationship. If they fall, more x goes with less y: a negative one. The closer the points lie to one straight line, the stronger the linear relationship. The correlation coefficient r puts this into one number. It is always between −1 and 1: near 1 means a strong rising line, near −1 a strong falling line, and near 0 no straight-line pattern at all. Exactly 1 or −1 means every point lies on one line. With n points, r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)). Here Σ (sigma) means “add up”: Σx adds the x values, Σx² adds their squares, and Σxy adds x × y for each point. r measures only straight-line patterns, and a strong r does not prove that x causes y.",
   steps: [
    "List the points and add up five columns: Σx, Σy, Σx², Σy² and Σxy.",
    "Top: nΣxy − ΣxΣy.",
    "Bottom: √((nΣx² − (Σx)²) × (nΣy² − (Σy)²)).",
    "r = top ÷ bottom. Its sign gives the direction; its size says how close the points are to a line."
   ],
   example: {
    prompt: "Four days: (1, 3), (2, 5), (3, 4), (4, 8). Find r.",
    steps: [
     "Σx = 10, Σy = 20, Σx² = 30, Σy² = 114 and Σxy = 57, with n = 4.",
     "Top: 4 × 57 − 10 × 20 = 28. Bottom: √((4 × 30 − 100)(4 × 114 − 400)) = √(20 × 56) = √1120 = 33.4664.",
     "r = 28 ÷ 33.4664 = 0.84, a strong positive linear relationship."
    ],
    answer: "r = 0.84."
   },
   pitfalls: [
    "Confusing Σx² (square each x, then add) with (Σx)² (add, then square the total).",
    "Forgetting the square root on the bottom, which can give an r outside −1 to 1.",
    "Reading a strong r as proof that x causes y: it shows only that the points lie near a line."
   ]
  },
  guidance: [
   { prompt: "What are Σx and Σy, the sums of the x values and of the y values?", answer: [36,59], labels: ["Σx","Σy"], explanation: "4 + 6 + 7 + 9 + 10 = 36 and 8 + 12 + 10 + 15 + 14 = 59." },
   { prompt: "What are Σx², Σy² and Σxy? Type each number in full, without commas inside it.", answer: [282,729,449], labels: ["Σx²","Σy²","Σxy"], explanation: "Σx² = 4² + 6² + 7² + 9² + 10² = 282; Σy² = 8² + 12² + 10² + 15² + 14² = 729; Σxy = 4 × 8 + 6 × 12 + 7 × 10 + 9 × 15 + 10 × 14 = 449." },
   { prompt: "What is the top of the formula, nΣxy − ΣxΣy, with n = 5?", answer: [121], labels: ["top"], explanation: "5 × 449 − 36 × 59 = 2245 − 2124 = 121." },
   { prompt: "What are nΣx² − (Σx)² and nΣy² − (Σy)²? Type each number in full, without commas inside it.", answer: [114,164], labels: ["nΣx² − (Σx)²","nΣy² − (Σy)²"], explanation: "5 × 282 − 36² = 1410 − 1296 = 114, and 5 × 729 − 59² = 3645 − 3481 = 164." },
   { prompt: "What is r = 121 ÷ √(114 × 164), to 2 decimal places?", answer: [0.88], labels: ["r (2 d.p.)"], explanation: "114 × 164 = 18696, whose square root is 136.7333, and 121 ÷ 136.7333 rounds to 0.88." }
  ]
 }
);
})();
