/* Probability missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/prob/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 The normal curve · Advanced, 200 XP · sector 'Quality Lab' · z-scores [IS 6.1]
     q32  ch 6 The normal curve · Advanced, 200 XP · sector 'Quality Lab' · Area to the left from a normal table [IS 6.1, 6.2]
     q33  ch 6 The normal curve · Advanced, 200 XP · sector 'Quality Lab' · Probability between two values [IS 6.2]
     q34  ch 6 The normal curve · Advanced, 200 XP · sector 'Quality Lab' · Percentiles: from an area back to a value [IS 6.2]
     q35  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · Sums of random variables: means add [IS 7.2]
     q36  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · Spread of a sum: variances add when independent [IS 7.2]
     q37  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · The sample mean, standard error and the law of large numbers [IS 7.1, 7.3]
     q38  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · Central Limit Theorem: probability for a sample mean [IS 7.1]
     q39  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · Normal approximation to the binomial [IS 7.3]
     q40  ch 7 Sums and averages · Advanced, 200 XP · sector 'Weather Station' · Realm review and bridge to Data and inference: how surprising is this sample? [IS 7.3] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections cited below, opened on the date in `verified`. */
const source = {
 s6_1: {"title":"OpenStax Introductory Statistics 2e — 6.1 The Standard Normal Distribution","url":"https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution","description":"z-scores, the standard normal distribution Z and the empirical rule.","verified":"2026-11-27"},
 s6_2: {"title":"OpenStax Introductory Statistics 2e — 6.2 Using the Normal Distribution","url":"https://openstax.org/books/introductory-statistics-2e/pages/6-2-using-the-normal-distribution","description":"Areas to the left, to the right and between values of a normal distribution, and percentiles.","verified":"2026-11-27"},
 s7_1: {"title":"OpenStax Introductory Statistics 2e — 7.1 The Central Limit Theorem for Sample Means (Averages)","url":"https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages","description":"The sample mean, its standard error σ ÷ √n, and the Central Limit Theorem for averages.","verified":"2026-11-27"},
 s7_2: {"title":"OpenStax Introductory Statistics 2e — 7.2 The Central Limit Theorem for Sums","url":"https://openstax.org/books/introductory-statistics-2e/pages/7-2-the-central-limit-theorem-for-sums","description":"The mean nμ and standard deviation √n σ of a sum of independent random variables.","verified":"2026-11-27"},
 s7_3: {"title":"OpenStax Introductory Statistics 2e — 7.3 Using the Central Limit Theorem","url":"https://openstax.org/books/introductory-statistics-2e/pages/7-3-using-the-central-limit-theorem","description":"The law of large numbers, and the normal approximation to the binomial distribution.","verified":"2026-11-27"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q31", title: "Measuring bolts in standard deviations", topic: "z-scores", tier: "Advanced", sector: "Quality Lab",
  brief: "Bolts of different sizes come off different machines, and the lab wants one scale that says how unusual any bolt is.",
  lesson: "A z-score, z = (x − μ) ÷ σ, says how many standard deviations a value lies above or below the mean.",
  prompt: "The Quality Lab’s bolts have lengths that follow a normal distribution with mean μ = 80 mm and standard deviation σ = 2.5 mm. A bolt on the bench measures 84.6 mm. Enter its z-score, rounded to 2 decimal places. Then a second bolt has a z-score of −1.2: enter its length in mm.",
  answer: [1.84,77], labels: ["z-score of the first bolt","length of the second bolt (mm)"], tolerance: 0.005,
  hints: [
   "The z-score is (x − μ) ÷ σ: the distance from the mean, measured in standard deviations. It is negative for a bolt shorter than the mean.",
   "To go back from a z-score to a length, turn the rule round: x = μ + z × σ."
  ],
  solution: "The first bolt is x − μ = 84.6 − 80 = 4.6 mm from the mean, so its z-score is 4.6 ÷ 2.5 = 1.84: it sits 1.84 standard deviations above the mean. For the second bolt, x = μ + z × σ = 80 + (−1.2) × 2.5 = 80 − 3 = 77 mm.",
  xp: 200, prereqs: ["q30"],
  artifact: {"name":"Bolt ruler in σ","description":"A ruler marked in standard deviations instead of millimetres."},
  sources: [source.s6_1],
  teaching: {
   intuition: "A bolt that is 3 mm too long can be a disaster or nothing at all: it depends on how much bolts usually vary. So we measure distance from the mean in standard deviations instead of millimetres. That count is the z-score: z = (x − μ) ÷ σ, where x is the value, μ the mean and σ the standard deviation. A z-score of 2 means two standard deviations above the mean; −1.5 means one and a half below; 0 means exactly at the mean. Turning every value of a normal distribution into its z-score gives the standard normal distribution, written Z: a bell curve with mean 0 and standard deviation 1. Every normal curve becomes this one curve, which is why one table of areas serves them all. The rule also runs backwards: a value with z-score z is x = μ + z × σ.",
   steps: [
    "Subtract the mean from the value: x − μ. The answer is negative when the value is below the mean.",
    "Divide by the standard deviation: z = (x − μ) ÷ σ. Round as the question asks.",
    "Read the sign and the size: positive is above the mean, negative below, and the size counts standard deviations.",
    "To go back from a z-score to a value, use x = μ + z × σ."
   ],
   example: {
    prompt: "Washers have mean thickness 40 mm and standard deviation 0.5 mm. What is the z-score of a washer 41.2 mm thick, and how thick is a washer with z = −0.6?",
    steps: ["41.2 − 40 = 1.2, and 1.2 ÷ 0.5 = 2.4.","x = 40 + (−0.6) × 0.5 = 40 − 0.3 = 39.7."],
    answer: "z = 2.4; the second washer is 39.7 mm thick."
   },
   pitfalls: [
    "Dividing by the variance σ² instead of the standard deviation σ.",
    "Dropping the minus sign: a value below the mean has a negative z-score.",
    "Going back with x = z × σ and forgetting to add the mean."
   ]
  },
  guidance: [
   { prompt: "How far is the bolt of 84.6 mm from the mean of 80 mm? Enter x − μ, negative if the bolt is shorter than the mean.", answer: [4.6], labels: ["x − μ (mm)"], explanation: "84.6 − 80 = 4.6 mm." },
   { prompt: "Divide that distance by σ = 2.5 mm and round to 2 decimal places. What is the z-score?", answer: [1.84], labels: ["z-score"], explanation: "4.6 ÷ 2.5 = 1.84. The bolt is 1.84 standard deviations above the mean." },
   { prompt: "The second bolt has z = −1.2. What is z × σ, and what is its length μ + z × σ?", answer: [-3,77], labels: ["z × σ (mm)","length (mm)"], explanation: "(−1.2) × 2.5 = −3 mm, and 80 − 3 = 77 mm." }
  ]
 },
 {
  id: "q32", title: "Reading the bell curve table", topic: "Area to the left from a normal table", tier: "Advanced", sector: "Quality Lab",
  brief: "Bolts that are too light get scrapped, and the lab needs the chance that a bolt falls below the line.",
  lesson: "P(X < x) for a normal X is the area to the left of its z-score under the standard normal curve, read from a normal table.",
  prompt: "The masses of the Quality Lab’s bolts follow a normal distribution with mean 120 g and standard deviation 8 g. What is the probability that a bolt picked at random weighs less than 130.4 g? Enter the z-score of 130.4 g, then P(X < 130.4) to 4 decimal places. Rows from the normal table (z → area to the left of z): 1.29 → 0.9015, 1.30 → 0.9032, 1.31 → 0.9049.",
  answer: [1.3,0.9032], labels: ["z-score","P(X < x)"], tolerance: 0.00005,
  hints: [
   "Turn the mass into a z-score first with z = (x − μ) ÷ σ. Here it comes out to exactly 2 decimal places.",
   "Find the table row with your z. The number beside it is the area to the left of z, which is the probability of a value below x."
  ],
  solution: "z = (130.4 − 120) ÷ 8 = 10.4 ÷ 8 = 1.30. The area to the left of 130.4 g under the bolts’ curve is the area to the left of z = 1.30 under the standard normal curve, and the table row for 1.30 gives 0.9032. So P(X < 130.4) = 0.9032.",
  xp: 200, prereqs: ["q31"],
  artifact: {"name":"Page of the normal table","description":"Rows of z with the area to the left of each."},
  sources: [source.s6_1, source.s6_2],
  teaching: {
   intuition: "For a continuous random variable a probability is an area under its curve, and the whole area is 1. The area under a bell curve cannot be found with a simple formula, so people worked it out once, for the standard normal curve Z, and printed it in a normal table. Each row gives a z, to two decimal places, and the area under the curve to the left of that z, which is P(Z < z). To use it for any normal X, turn x into its z-score first: the share of bolts below x is the same as the share of the standard curve below z, because the z-score only re-labels the axis. A z-score of 0 has area 0.5000 to its left, half the curve, and the area grows towards 1 as z grows. The game prints the rows each mission needs.",
   steps: [
    "Turn the value into a z-score: z = (x − μ) ÷ σ.",
    "Find the row of the normal table with that z.",
    "The area in that row is P(Z < z), which equals P(X < x). For a continuous variable P(X < x) and P(X ≤ x) are the same.",
    "For the area to the right, use the complement: P(X > x) = 1 − P(X < x)."
   ],
   example: {
    prompt: "Rivets have mean mass 60 g and standard deviation 5 g. What is P(X < 57.75)? The table row needed is −0.45 → 0.3264.",
    steps: ["z = (57.75 − 60) ÷ 5 = −2.25 ÷ 5 = −0.45.","The row for −0.45 gives 0.3264."],
    answer: "P(X < 57.75) = 0.3264: about a third of the rivets are lighter."
   },
   pitfalls: [
    "Reading the table with the value itself instead of its z-score.",
    "Taking the area to the left when the question asks for more than a value: that needs 1 minus the area.",
    "Using the row for 1.30 when z is −1.30. A negative z has less than half the area to its left."
   ]
  },
  guidance: [
   { prompt: "How far is 130.4 g from the mean? What is x − μ = 130.4 − 120?", answer: [10.4], labels: ["x − μ (g)"], explanation: "130.4 − 120 = 10.4 g." },
   { prompt: "Divide by σ = 8. What is the z-score?", answer: [1.3], labels: ["z-score"], explanation: "10.4 ÷ 8 = 1.30." },
   { prompt: "Read the row for z = 1.30. What is P(X < 130.4)?", answer: [0.9032], labels: ["P(X < x)"], explanation: "The row 1.30 → 0.9032 gives the area to the left of z, so P(X < 130.4) = 0.9032." }
  ]
 },
 {
  id: "q33", title: "The pass band for bolts", topic: "Probability between two values", tier: "Advanced", sector: "Quality Lab",
  brief: "A bolt passes inspection only if its length lands inside a band, and the lab wants to know what share will pass.",
  lesson: "P(a < X < b) is the area to the left of b minus the area to the left of a.",
  prompt: "The Quality Lab passes a bolt if its length is between 47.5 mm and 53.1 mm. Bolt lengths follow a normal distribution with mean 50 mm and standard deviation 2 mm. Enter the z-score of 47.5 mm, then the z-score of 53.1 mm, then P(47.5 < X < 53.1), the probability that a bolt passes, to 4 decimal places, worked out from the table rows given here. Rows from the normal table (z → area to the left of z): −1.27 → 0.1020, −1.26 → 0.1038, −1.25 → 0.1056, 1.55 → 0.9394, 1.56 → 0.9406, 1.57 → 0.9418.",
  answer: [-1.25,1.55,0.8338], labels: ["z-score of the lower length","z-score of the upper length","P(a < X < b)"], tolerance: 0.00005,
  hints: [
   "Turn both lengths into z-scores with z = (x − μ) ÷ σ.",
   "The table gives areas to the left. The area between two values is the area to the left of the larger one minus the area to the left of the smaller one."
  ],
  solution: "For 47.5 mm, z = (47.5 − 50) ÷ 2 = −1.25; for 53.1 mm, z = (53.1 − 50) ÷ 2 = 1.55. The table gives 0.9394 to the left of 1.55 and 0.1056 to the left of −1.25. The area between them is the difference: P(47.5 < X < 53.1) = 0.9394 − 0.1056 = 0.8338.",
  xp: 200, prereqs: ["q32"],
  artifact: {"name":"Pass gauge","description":"A go and no-go gauge with the share of bolts that pass written on it."},
  sources: [source.s6_2],
  teaching: {
   intuition: "The normal table only gives areas to the left of a point. To get the area between two points, take everything to the left of the upper point and cut away everything to the left of the lower point. What is left is the strip between them. So P(a < X < b) = P(X < b) − P(X < a), with each area read from the table after turning a and b into z-scores. It works for two points on the same side of the mean as well as for two points on either side, because each area always starts from the far left of the curve.",
   steps: [
    "Turn both ends into z-scores: one for the lower length a, one for the upper length b.",
    "Read the area to the left of each z from the table.",
    "Subtract the smaller area from the larger: P(a < X < b) = P(X < b) − P(X < a)."
   ],
   example: {
    prompt: "Pins have mean length 30 mm and standard deviation 4 mm. What is P(26 < X < 38)? Table rows: −1.00 → 0.1587, 2.00 → 0.9772.",
    steps: ["z for 26 is (26 − 30) ÷ 4 = −1.00; z for 38 is (38 − 30) ÷ 4 = 2.00.","0.9772 − 0.1587 = 0.8185."],
    answer: "P(26 < X < 38) = 0.8185, close to the 81.5% the empirical rule gives."
   },
   pitfalls: [
    "Adding the two areas instead of subtracting them.",
    "Subtracting in the wrong order and getting a negative probability.",
    "Using one z-score for both ends because the band looks even about the mean when it is not."
   ]
  },
  guidance: [
   { prompt: "What are the z-scores of 47.5 mm and of 53.1 mm?", answer: [-1.25,1.55], labels: ["z of the lower length","z of the upper length"], explanation: "(47.5 − 50) ÷ 2 = −1.25 and (53.1 − 50) ÷ 2 = 1.55." },
   { prompt: "Read the two table rows. What is the area to the left of z = −1.25, and to the left of z = 1.55?", answer: [0.1056,0.9394], labels: ["area left of the lower z","area left of the upper z"], explanation: "The rows give 0.1056 for −1.25 and 0.9394 for 1.55." },
   { prompt: "The area between is the larger area minus the smaller one. What is 0.9394 − 0.1056?", answer: [0.8338], labels: ["P(a < X < b)"], explanation: "0.9394 − 0.1056 = 0.8338: the share of bolts that pass." }
  ]
 },
 {
  id: "q34", title: "Setting the cut-off length", topic: "Percentiles: from an area back to a value", tier: "Advanced", sector: "Quality Lab",
  brief: "The lab wants a single length for the sorting gate, chosen so that a stated share of bolts falls below it.",
  lesson: "For the kth percentile, find the z whose area to the left is closest to k ÷ 100, then turn it back into a value with x = μ + z × σ.",
  prompt: "The Quality Lab cuts bolts whose lengths follow a normal distribution with mean 64 mm and standard deviation 3 mm. Mira wants the 90th percentile: the length that 90% of the bolts are shorter than. Use the table row whose area is closest to 0.90. Enter that row’s z, then the length at the 90th percentile in mm, rounded to 1 decimal place. Rows from the normal table (z → area to the left of z): 1.27 → 0.8980, 1.28 → 0.8997, 1.29 → 0.9015.",
  answer: [1.28,67.8], labels: ["z","length at the percentile (mm)"], tolerance: 0.005,
  hints: [
   "The 90th percentile has an area of 0.90 to its left. Look down the areas, not the z values, for the one nearest 0.90.",
   "Then go back from z to a length with x = μ + z × σ, as you did for z-scores."
  ],
  solution: "The 90th percentile has 90% of the area, 0.90, to its left. The closest area in the table is 0.8997, in the row z = 1.28. The length is x = μ + z × σ = 64 + 1.28 × 3 = 64 + 3.84 = 67.84, which is 67.8 mm to 1 decimal place.",
  xp: 200, prereqs: ["q32"],
  artifact: {"name":"Sorting gate setting","description":"A gate set at one length, with a known share of bolts below it."},
  sources: [source.s6_2],
  teaching: {
   intuition: "So far we have gone from a value to an area. A percentile runs the other way. The kth percentile is the value with k% of the distribution below it: the 90th percentile of bolt lengths is the length that 90% of bolts are shorter than. To find it, look inside the normal table for the area nearest k ÷ 100 (0.90 for the 90th) and read off the z in that row. Then turn that z back into a length with x = μ + z × σ. The table rarely has the exact area, so we use the closest row. Percentiles below the 50th have negative z, because less than half the area lies to their left.",
   steps: [
    "Write the percentile as an area to the left: the kth percentile has area k ÷ 100 to its left.",
    "Search the areas in the table, not the z column, for the one closest to that area, and read its z.",
    "Turn z into a value: x = μ + z × σ.",
    "Round as the question asks."
   ],
   example: {
    prompt: "Rods have mean length 50 mm and standard deviation 4 mm. Find the 75th percentile. Table rows: 0.67 → 0.7486, 0.68 → 0.7517.",
    steps: ["The area wanted is 0.75. The row 0.67 is 0.0014 away; the row 0.68 is 0.0017 away. So z = 0.67.","x = 50 + 0.67 × 4 = 50 + 2.68 = 52.68."],
    answer: "The 75th percentile is about 52.7 mm."
   },
   pitfalls: [
    "Looking for k ÷ 100 in the z column instead of among the areas.",
    "Using k itself as the z-score.",
    "Forgetting the mean: the length is μ + z × σ, not z × σ."
   ]
  },
  guidance: [
   { prompt: "Which z in the table has the area closest to 0.90?", answer: [1.28], labels: ["z"], explanation: "The area 0.8997 is the closest to 0.90, and it sits in the row z = 1.28." },
   { prompt: "How far from the mean is that, in mm? What is z × σ = 1.28 × 3?", answer: [3.84], labels: ["z × σ (mm)"], explanation: "1.28 × 3 = 3.84 mm." },
   { prompt: "Add that to the mean of 64 mm and round to 1 decimal place. What is the length at the 90th percentile?", answer: [67.8], labels: ["length (mm)"], explanation: "64 + 3.84 = 67.84, which rounds to 67.8 mm." }
  ]
 },
 {
  id: "q35", title: "Weighing the balloon payload", topic: "Sums of random variables: means add", tier: "Advanced", sector: "Weather Station",
  brief: "Every weather balloon has a lift limit, and the station needs the payload it should expect before it fills the balloon.",
  lesson: "The expected value of a sum of random variables is the sum of their expected values: n items with mean μ have expected total nμ.",
  prompt: "A weather balloon from the station carries 6 sensor pods and one radio. Each pod’s mass is a random variable with mean 85 g, and the radio’s mass has mean 240 g. Enter the expected total mass of the 6 pods, then the expected mass of the whole payload, pods and radio together. Both are in grams; type them without commas.",
  answer: [510,750], labels: ["expected mass of the pods (g)","expected payload (g)"], tolerance: 0.01,
  hints: [
   "The mean of a sum is the sum of the means: E(X + Y) = E(X) + E(Y). It holds for any number of random variables, independent or not.",
   "Each pod adds one copy of the same mean, so the pods together add the number of pods times that mean."
  ],
  solution: "The total mass of the pods is a sum of 6 random variables, each with mean 85 g. Means add, so its expected value is 85 added 6 times: 6 × 85 = 510 g. The radio is one more random variable in the sum, so the whole payload has expected mass 510 + 240 = 750 g.",
  xp: 200, prereqs: ["q15"],
  artifact: {"name":"Payload tag","description":"A balloon tag with the expected payload worked out item by item."},
  sources: [source.s7_2],
  teaching: {
   intuition: "A random variable can be built from others. If X is the mass of one sensor pod and Y the mass of another, the pair together weighs X + Y, which is itself a random variable. Its expected value is easy: E(X + Y) = E(X) + E(Y). On average the pair weighs the average of one plus the average of the other. This holds for any number of random variables, and they do not have to be independent. So the total of n pods that each have mean μ has expected value μ + μ + … + μ, n times, which is nμ. Adding a different item, such as a radio, just adds its own mean.",
   steps: [
    "Write the total as a sum of random variables, one for each item.",
    "Find each item’s expected value.",
    "Add the expected values: E(X + Y + …) = E(X) + E(Y) + … . For n items with the same mean μ, that is nμ."
   ],
   example: {
    prompt: "A crate holds 4 water cans, each with mean mass 12 kg, and a lid with mean mass 3 kg. What is the expected mass of the crate’s load?",
    steps: ["The cans: 4 × 12 = 48 kg.","Add the lid: 48 + 3 = 51 kg."],
    answer: "51 kg."
   },
   pitfalls: [
    "Thinking the items must be independent before means can be added. Means add in every case.",
    "Leaving out the one item that is not like the others, such as the radio.",
    "Dividing by the number of items, which gives the mean of one item back, not the total."
   ]
  },
  guidance: [
   { prompt: "Start with two pods. What is the expected mass of the two together?", answer: [170], labels: ["two pods (g)"], explanation: "E(X + Y) = E(X) + E(Y) = 85 + 85 = 170 g." },
   { prompt: "Now all 6 pods. What is their expected total mass?", answer: [510], labels: ["all pods (g)"], explanation: "6 copies of 85 g: 6 × 85 = 510 g." },
   { prompt: "Add the radio. What is the expected mass of the whole payload?", answer: [750], labels: ["payload (g)"], explanation: "510 + 240 = 750 g." }
  ]
 },
 {
  id: "q36", title: "How much the payload wobbles", topic: "Spread of a sum: variances add when independent", tier: "Advanced", sector: "Weather Station",
  brief: "The balloon’s lift has a safety margin, so the station needs to know how far the payload’s mass can stray from its mean.",
  lesson: "For independent random variables the variances add, so the total of n items with standard deviation σ has standard deviation √n × σ.",
  prompt: "The 8 sensor pods on a weather balloon have independent masses, each with standard deviation 3 g. Enter the variance of the pods’ total mass in g² (type it without commas), then the standard deviation of the total mass in grams, rounded to 2 decimal places.",
  answer: [72,8.49], labels: ["variance of the total (g²)","standard deviation of the total (g)"], tolerance: 0.005,
  hints: [
   "For independent random variables the variances add, not the standard deviations. Square σ to get one pod’s variance first.",
   "The standard deviation of the total is the square root of the total’s variance."
  ],
  solution: "One pod has variance σ² = 3² = 9 g². The masses are independent, so the variances add: 8 × 9 = 72 g². The standard deviation of the total is √72 = 8.4852…, which is 8.49 g to 2 decimal places. That is √8 × 3: the spread grows like the square root of the number of pods, so it is far less than 8 × 3 = 24 g.",
  xp: 200, prereqs: ["q35","q16"],
  artifact: {"name":"Margin chart","description":"The spread of a payload growing with the square root of its pod count."},
  sources: [source.s7_2],
  teaching: {
   intuition: "Means add, but standard deviations do not. When independent items are put together, some come out heavy and some light, and their errors partly cancel. The quantity that adds up cleanly is the variance, σ²: for independent X and Y, the variance of X + Y is the variance of X plus the variance of Y. So n independent items, each with standard deviation σ, have a total with variance n × σ², and the standard deviation of the total is the square root of that: √n × σ. Four pods have twice the spread of one, not four times; a hundred pods have ten times the spread. This only works when the items are independent, so that one being heavy says nothing about the others.",
   steps: [
    "Square each standard deviation to get a variance.",
    "Add the variances. For n items with the same σ, the total has variance n × σ².",
    "Take the square root of the total variance to get the standard deviation of the total, √n × σ."
   ],
   example: {
    prompt: "A crate holds 9 independent cans, each with standard deviation 2 kg. What are the variance and the standard deviation of the crate’s total mass?",
    steps: ["One can has variance 2² = 4 kg².","The total has variance 9 × 4 = 36 kg², so its standard deviation is √36 = 6 kg."],
    answer: "Variance 36 kg², standard deviation 6 kg (not 9 × 2 = 18 kg)."
   },
   pitfalls: [
    "Adding the standard deviations: n × σ is far too big.",
    "Stopping at the variance when the question asks for the standard deviation.",
    "Using the rule for items that are not independent, such as parts that all come from one faulty batch."
   ]
  },
  guidance: [
   { prompt: "What is one pod’s variance, σ² = 3²?", answer: [9], labels: ["variance of one pod (g²)"], explanation: "3 × 3 = 9 g²." },
   { prompt: "The masses are independent, so the variances add. What is the variance of the total of 8 pods?", answer: [72], labels: ["variance of the total (g²)"], explanation: "8 × 9 = 72 g²." },
   { prompt: "Take the square root of 72 and round to 2 decimal places. What is the standard deviation of the total?", answer: [8.49], labels: ["standard deviation (g)"], explanation: "√72 = 8.4852…, which rounds to 8.49 g." }
  ]
 },
 {
  id: "q37", title: "Averaging the wind", topic: "The sample mean, standard error and the law of large numbers", tier: "Advanced", sector: "Weather Station",
  brief: "One wind reading jumps about too much to trust, so the station averages many and wants to know how steady the average is.",
  lesson: "The sample mean X̄ of n independent readings has mean μ and standard error σ ÷ √n, which shrinks as n grows: the law of large numbers.",
  prompt: "Single wind-speed readings at the weather station vary with standard deviation σ = 7 km/h. Mira averages n = 20 independent readings into one sample mean, X̄. Enter the standard error of X̄, σ ÷ √n, in km/h rounded to 2 decimal places. Then enter the number of readings that would make the standard error half as big.",
  answer: [1.57,80], labels: ["standard error (km/h)","readings needed"], tolerance: 0.005,
  hints: [
   "The sample mean is the total divided by n. The total has standard deviation √n × σ, and dividing by n leaves σ ÷ √n.",
   "To make σ ÷ √n half as big, √n has to be twice as big. Think about what doubling √n does to n itself."
  ],
  solution: "The standard error is σ ÷ √n = 7 ÷ √20 = 1.5652…, which is 1.57 km/h to 2 decimal places. To halve it, √n must double, and doubling √n multiplies n by 2 × 2 = 4: 20 × 4 = 80 readings. This is the law of large numbers at work: the more readings go into X̄, the closer it tends to sit to the true mean, but each halving of the error costs four times as many readings.",
  xp: 200, prereqs: ["q36"],
  artifact: {"name":"Averaging log","description":"A column of readings and the steadier average beneath it."},
  sources: [source.s7_1, source.s7_3],
  teaching: {
   intuition: "Take n independent readings and average them: add them up and divide by n. The result is the sample mean, written X̄ and read “X bar”. It is a random variable too, since a new set of readings gives a new average. Its mean is μ, the same as one reading’s. Its spread is smaller: the total of the n readings has standard deviation √n × σ, and dividing by n leaves σ ÷ √n. This is called the standard error of the sample mean. The bigger n is, the smaller the standard error, so the sample mean settles ever closer to the true mean μ. That is the law of large numbers. The square root makes progress slow: to halve the standard error you need four times as many readings.",
   steps: [
    "The sample mean X̄ is the total of the n readings divided by n. Its mean is μ.",
    "Its standard deviation, the standard error, is σ ÷ √n.",
    "To shrink the standard error by a factor, multiply n by the square of that factor: half the error needs 4 times n, a third needs 9 times n."
   ],
   example: {
    prompt: "Rain gauge readings have standard deviation 6 mm. What is the standard error of the mean of 9 readings, and how many readings would halve it?",
    steps: ["6 ÷ √9 = 6 ÷ 3 = 2 mm.","Halving it needs √n twice as big, so n = 9 × 4 = 36 readings (6 ÷ 6 = 1 mm)."],
    answer: "Standard error 2 mm; 36 readings halve it."
   },
   pitfalls: [
    "Dividing σ by n instead of by √n.",
    "Doubling n to halve the standard error. Doubling n only divides it by √2, about 1.41.",
    "Thinking the sample mean’s own mean changes with n. Only its spread does."
   ]
  },
  guidance: [
   { prompt: "What is σ ÷ √n = 7 ÷ √20, rounded to 2 decimal places?", answer: [1.57], labels: ["standard error (km/h)"], explanation: "√20 = 4.4721, and 7 ÷ 4.4721 = 1.5652…, which rounds to 1.57 km/h." },
   { prompt: "To halve σ ÷ √n, how many times bigger must √n be?", answer: [2], labels: ["times bigger"], explanation: "Dividing σ by twice as much gives half as much, so √n must be 2 times as big." },
   { prompt: "If √n is twice as big, n is 2 × 2 = 4 times as big. How many readings is that?", answer: [80], labels: ["readings needed"], explanation: "20 × 4 = 80 readings, and √80 is twice √20." }
  ]
 },
 {
  id: "q38", title: "Forecasting the monthly average", topic: "Central Limit Theorem: probability for a sample mean", tier: "Advanced", sector: "Weather Station",
  brief: "The greenhouse needs warning if the average high over the coming days will run warm, and single days are too erratic to say.",
  lesson: "By the Central Limit Theorem, for a large n the mean of independent values is close to normal with mean μ and standard error σ ÷ √n, whatever the shape of single values, so the normal table gives a good estimate of its chances.",
  prompt: "The weather station’s daily high temperature has mean μ = 18 °C and standard deviation σ = 4 °C, and its spread is lopsided, not bell-shaped. Mira averages the highs of n = 64 days, and one day’s high does not affect another’s. Use the normal model of the Central Limit Theorem to estimate the probability that the sample mean X̄ is above 18.7 °C. Enter the z-score of 18.7 for X̄, rounded to 2 decimal places, then the estimate of P(X̄ > 18.7) to 4 decimal places. Rows from the normal table (z → area to the left of z): 1.40 → 0.9192, 1.41 → 0.9207, 1.42 → 0.9222.",
  answer: [1.4,0.0808], labels: ["z-score","P(X̄ > c)"], tolerance: 0.00005,
  hints: [
   "By the Central Limit Theorem, X̄ is close to normal with mean μ and standard deviation σ ÷ √n, the standard error. Work that out first, and measure z in standard errors.",
   "The table gives the area to the left of z. The area to the right is 1 minus it."
  ],
  solution: "The days do not affect one another and n = 64 is large, so by the Central Limit Theorem X̄ is close to normal, even though single days are not. Its mean is 18 °C and its standard error is σ ÷ √n = 4 ÷ √64 = 4 ÷ 8 = 0.5 °C. So z = (18.7 − 18) ÷ 0.5 = 0.7 ÷ 0.5 = 1.40. The table gives 0.9192 to the left of 1.40, so P(X̄ > 18.7) ≈ 1 − 0.9192 = 0.0808. That is the normal model’s estimate: how close it comes to the true chance depends on how lopsided single days are.",
  xp: 200, prereqs: ["q37","q32"],
  artifact: {"name":"Forecast card","description":"A chance that the average high runs warm, worked from a bell curve."},
  sources: [source.s7_1],
  teaching: {
   intuition: "Single daily highs can have any shape of spread: lopsided, with a long tail of hot days. Yet when you average many of them, something remarkable happens. The Central Limit Theorem says that for a large sample, the sample mean X̄ has close to a normal distribution, whatever shape the single values have. Its mean is μ and its standard deviation is the standard error σ ÷ √n. Two things must hold. The values must be independent: one day’s high says nothing about the next. And n must be large enough, which depends on the shape: a common rule of thumb is 30 or more, but a very lopsided spread needs more. Even then the bell curve gives an estimate, not the exact chance. So a question about an average becomes a question about a bell curve: find z = (c − μ) ÷ (σ ÷ √n), the distance in standard errors, and read the area from the normal table.",
   steps: [
    "Check that the values are independent and that n is large: 30 or more as a rule of thumb, more for a very lopsided spread. The answer is then a normal-model estimate.",
    "Find the standard error σ ÷ √n.",
    "Find z = (c − μ) ÷ (σ ÷ √n) and round it to 2 decimal places to match a table row.",
    "Read the area to the left from the table; for P(X̄ > c) subtract it from 1."
   ],
   example: {
    prompt: "Daily rainfall has mean 5 mm and standard deviation 9 mm, with a long tail. What is P(X̄ > 6.2) for the mean of 81 days? Table row: 1.20 → 0.8849.",
    steps: ["Standard error 9 ÷ √81 = 9 ÷ 9 = 1 mm.","z = (6.2 − 5) ÷ 1 = 1.20, and 1 − 0.8849 = 0.1151."],
    answer: "P(X̄ > 6.2) = 0.1151."
   },
   pitfalls: [
    "Using σ instead of the standard error σ ÷ √n when finding z for a sample mean.",
    "Forgetting to subtract from 1 when the question asks for “above”.",
    "Applying the theorem to one single day: it is about averages of many values, not about one."
   ]
  },
  guidance: [
   { prompt: "What is the standard error of X̄, σ ÷ √n = 4 ÷ √64?", answer: [0.5], labels: ["standard error (°C)"], explanation: "√64 = 8, and 4 ÷ 8 = 0.5 °C." },
   { prompt: "Measure 18.7 in standard errors from the mean. What is z = (18.7 − 18) ÷ 0.5, rounded to 2 decimal places?", answer: [1.4], labels: ["z-score"], explanation: "0.7 ÷ 0.5 = 1.40." },
   { prompt: "The row for 1.40 gives 0.9192 to the left. What is the area to the right, the estimate of P(X̄ > 18.7)?", answer: [0.0808], labels: ["P(X̄ > c)"], explanation: "1 − 0.9192 = 0.0808." }
  ]
 },
 {
  id: "q39", title: "Counting balloons that make it", topic: "Normal approximation to the binomial", tier: "Advanced", sector: "Weather Station",
  brief: "The season’s forecast needs enough balloons to reach the upper air, and adding up a hundred binomial terms by hand is out of the question.",
  lesson: "When np and nq are both at least 5, a binomial count is close to normal with mean np and standard deviation √(npq); a half-step continuity correction fits the bars to the curve.",
  prompt: "Each weather balloon the station launches has a chance of 0.5 of reaching the upper air, independently of the others. This season 144 balloons go up. Use the normal approximation, with the continuity correction, to find the probability that at least 80 of them reach it. Enter the z-score of the corrected cut-off, rounded to 2 decimal places, then the approximate P(X ≥ 80) to 4 decimal places. Rows from the normal table (z → area to the left of z): 1.24 → 0.8925, 1.25 → 0.8944, 1.26 → 0.8962.",
  answer: [1.25,0.1056], labels: ["z-score","P(X ≥ k)"], tolerance: 0.00005,
  hints: [
   "The count X is binomial, with mean np and standard deviation √(npq), where q = 1 − p. Here np and nq are both at least 5, so a normal curve with that mean and standard deviation fits it well.",
   "“At least 80” starts at the bar for 80, whose left edge is at 80 − 0.5. Find the z-score of that cut-off and take the area to its right."
  ],
  solution: "X is binomial with n = 144 and p = 0.5, so q = 0.5. Its mean is np = 144 × 0.5 = 72 and its standard deviation is √(npq) = √(144 × 0.5 × 0.5) = √36 = 6. The bar for 80 balloons runs from 80 − 0.5 to 80 + 0.5, so with the continuity correction “at least 80” starts at 79.5. Then z = (79.5 − 72) ÷ 6 = 1.25. The table gives 0.8944 to the left of 1.25, so P(X ≥ 80) ≈ 1 − 0.8944 = 0.1056.",
  xp: 200, prereqs: ["q21","q38"],
  artifact: {"name":"Season tally board","description":"A bar chart of balloon counts with a bell curve drawn over it."},
  sources: [source.s7_3],
  teaching: {
   intuition: "A binomial count is a sum: each balloon adds 1 if it succeeds and 0 if it fails. So the Central Limit Theorem applies to it too. When n is large, the count X has close to a normal distribution with the binomial’s own mean np and standard deviation √(npq), where q = 1 − p. A common rule is that np and nq should both be at least 5. This is the normal approximation to the binomial. There is one adjustment. The binomial is a row of bars, one for each whole count, and the bar for k covers k − 0.5 to k + 0.5 on the smooth curve. So “at least k” starts at k − 0.5, and “at most k” ends at k + 0.5. Moving the cut-off by this half-step is called the continuity correction.",
   steps: [
    "Find the mean np and the standard deviation √(npq). Check that np and nq are both at least 5.",
    "Apply the continuity correction: for “at least k” use the cut-off k − 0.5; for “at most k” use k + 0.5.",
    "Find z = (cut-off − np) ÷ √(npq), rounded to 2 decimal places.",
    "Read the area from the table: the area to the right, 1 minus the table’s value, for “at least”."
   ],
   example: {
    prompt: "A coin is tossed 100 times. Approximately, what is P(X ≥ 58) heads? Table row: 1.50 → 0.9332.",
    steps: ["np = 50 and √(100 × 0.5 × 0.5) = √25 = 5.","Cut-off 57.5, so z = (57.5 − 50) ÷ 5 = 1.50, and 1 − 0.9332 = 0.0668."],
    answer: "P(X ≥ 58) ≈ 0.0668."
   },
   pitfalls: [
    "Using k itself as the cut-off and forgetting the continuity correction.",
    "Moving the cut-off the wrong way: “at least k” goes down to k − 0.5, not up to k + 0.5.",
    "Using √(np) as the standard deviation instead of √(npq)."
   ]
  },
  guidance: [
   { prompt: "What are the mean np and the standard deviation √(npq) of the count, for n = 144 and p = 0.5?", answer: [72,6], labels: ["mean np","standard deviation"], explanation: "np = 144 × 0.5 = 72, and √(npq) = √(144 × 0.5 × 0.5) = √36 = 6." },
   { prompt: "The corrected cut-off is 80 − 0.5 = 79.5. What is its z-score, rounded to 2 decimal places?", answer: [1.25], labels: ["z-score"], explanation: "(79.5 − 72) ÷ 6 = 1.25." },
   { prompt: "The row for 1.25 gives 0.8944 to the left. What is the area to the right?", answer: [0.1056], labels: ["P(X ≥ k)"], explanation: "1 − 0.8944 = 0.1056, so P(X ≥ 80) is about 0.1056." }
  ]
 },
 {
  id: "q40", title: "Is the barometer telling us something?", topic: "Realm review and bridge to Data and inference: how surprising is this sample?", tier: "Advanced", sector: "Weather Station",
  brief: "This month’s readings look odd, and Mira wants to know whether that is chance or a sign that the weather has shifted.",
  lesson: "A sample far out in the tail of its normal model is surprising: the tail area beyond it says how often chance alone would give a sample that extreme.",
  prompt: "Air pressure at the weather station has a long-run mean of μ = 1012 hPa and a standard deviation of σ = 6 hPa (hPa, hectopascals, is the unit on the barometer). The last 36 daily readings average x̄ = 1010.3 hPa. If nothing has changed, how surprising is a sample mean at least this far below μ? Enter the z-score of x̄, rounded to 2 decimal places, then the probability of a sample mean at least this far out on the same side, to 4 decimal places. Rows from the normal table (z → area to the left of z): −1.71 → 0.0436, −1.70 → 0.0446, −1.69 → 0.0455.",
  answer: [-1.7,0.0446], labels: ["z-score","tail probability"], tolerance: 0.00005,
  hints: [
   "If nothing has changed, the sample mean X̄ is close to normal with mean μ and standard error σ ÷ √n. Measure x̄ in standard errors from μ.",
   "For a value below the mean the tail is the area to the left, read straight from the table. For a value above the mean it is 1 minus the table’s area."
  ],
  solution: "If nothing has changed, the Central Limit Theorem makes X̄ close to normal with mean 1012 hPa and standard error σ ÷ √n = 6 ÷ √36 = 6 ÷ 6 = 1 hPa. So z = (1010.3 − 1012) ÷ 1 = −1.7 ÷ 1 = −1.70. The sample mean is below the mean, so the tail is the area to the left of −1.70, which the table gives directly: 0.0446. Fewer than 5 samples in 100 would land this far out by chance, so this one is surprising: something may well have changed.",
  xp: 200, prereqs: ["q38","q39"],
  artifact: {"name":"Mira’s odds board, last line","description":"One sample, one tail area, and the question it leaves for the next realm."},
  sources: [source.s7_3],
  teaching: {
   intuition: "Every sample wobbles, so a sample mean that differs from the long-run mean proves nothing on its own. The question is how big the wobble is compared with what chance usually gives. Suppose nothing has changed. Then the Central Limit Theorem tells us how the sample statistic behaves: a sample mean X̄ is close to normal with mean μ and standard error σ ÷ √n. A sample proportion p̂, the share of successes X ÷ n, is close to normal with mean p and standard error √(pq ÷ n), which is the binomial’s np and √(npq) divided by n. Find the z-score of what we saw, then the tail area beyond it on the same side. That area is how often chance alone would give a sample at least that far out. A tiny area, such as less than 0.05, makes the sample surprising, and suggests that something really has changed. Deciding that with care is the work of the next realm, Data and inference.",
   steps: [
    "Choose the model: a sample mean has mean μ and standard error σ ÷ √n; a sample proportion has mean p and standard error √(pq ÷ n).",
    "Find z = (observed value − mean) ÷ standard error, rounded to 2 decimal places.",
    "Take the tail beyond z on the observed side: the table’s area itself for a negative z, 1 minus it for a positive z.",
    "Judge it: a tail area under about 0.05 means chance alone would rarely give a sample this far out."
   ],
   example: {
    prompt: "Seed packets should hold a share p = 0.5 of red seeds. A sample of 100 has 59 red ones. How surprising is that? Table row: 1.80 → 0.9641.",
    steps: ["p̂ = 0.59 and the standard error is √(0.5 × 0.5 ÷ 100) = 0.05.","z = (0.59 − 0.5) ÷ 0.05 = 1.80, and the tail to the right is 1 − 0.9641 = 0.0359."],
    answer: "A tail of 0.0359: under 0.05, so the sample is surprising."
   },
   pitfalls: [
    "Using σ instead of the standard error, which makes the sample look far less surprising than it is.",
    "Taking the area on the wrong side: the tail is beyond the observed value, away from the mean.",
    "Reading a large tail area as proof that nothing changed. It only says the sample is not surprising."
   ]
  },
  guidance: [
   { prompt: "What is the standard error of the sample mean, σ ÷ √n = 6 ÷ √36?", answer: [1], labels: ["standard error"], explanation: "√36 = 6, and 6 ÷ 6 = 1 hPa." },
   { prompt: "How many standard errors from the mean is the sample mean? Enter z, rounded to 2 decimal places.", answer: [-1.7], labels: ["z-score"], explanation: "z = (1010.3 − 1012) ÷ 1 = −1.7 ÷ 1 = −1.70." },
   { prompt: "The row for −1.70 gives 0.0446 to the left. What is the probability of a sample mean at least this far out on the same side?", answer: [0.0446], labels: ["tail probability"], explanation: "The tail is on the left, so it is the table’s area itself: 0.0446." }
  ]
 }
);
})();
