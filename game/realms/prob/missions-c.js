/* Probability missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/prob/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · Binomial mean np, spread √(npq), and "at least one" [IS 4.3]
     q22  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · Geometric distribution: waiting for the first success [IS 4.4]
     q23  ch 4 Repeated trials · Intermediate, 150 XP · sector 'Greenhouse' · Chapter review: binomial or geometric? [IS 4.3, 4.4]
     q24  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · Poisson distribution: counts of rare events [IS 4.6]
     q25  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · Probability as area; the uniform distribution [IS 5.1, 5.2]
     q26  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · Uniform mean, percentiles and conditional chances [IS 5.2]
     q27  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · The exponential distribution [IS 5.3]
     q28  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · Memoryless waiting [IS 5.3]
     q29  ch 5 Rare events and waiting times · Intermediate, 150 XP · sector 'Radio Room' · Chapter review: the right model for a count or a wait [IS 4.6, 5.3]
     q30  ch 6 The normal curve · Advanced, 200 XP · sector 'Quality Lab' · The normal curve and the empirical rule [IS 6.1] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections cited below; each page was opened on 2026-11-27. */
const source = {
 s4_3: { title: "OpenStax Introductory Statistics 2e — 4.3 Binomial Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution", description: "Binomial counts of successes in n independent trials, with mean np and standard deviation √(npq).", verified: '2026-11-27' },
 s4_4: { title: "OpenStax Introductory Statistics 2e — 4.4 Geometric Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/4-4-geometric-distribution", description: "Repeating trials until the first success, its probabilities and its mean 1 ÷ p.", verified: '2026-11-27' },
 s4_6: { title: "OpenStax Introductory Statistics 2e — 4.6 Poisson Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/4-6-poisson-distribution", description: "Counts of independent events in a fixed interval with a known average, and their probabilities.", verified: '2026-11-27' },
 s5_1: { title: "OpenStax Introductory Statistics 2e — 5.1 Continuous Probability Functions", url: "https://openstax.org/books/introductory-statistics-2e/pages/5-1-continuous-probability-functions", description: "Continuous random variables, where probability is area under a density curve.", verified: '2026-11-27' },
 s5_2: { title: "OpenStax Introductory Statistics 2e — 5.2 The Uniform Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/5-2-the-uniform-distribution", description: "Equally likely values over a range: areas, the mean, percentiles and conditional chances.", verified: '2026-11-27' },
 s5_3: { title: "OpenStax Introductory Statistics 2e — 5.3 The Exponential Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/5-3-the-exponential-distribution", description: "Waiting times and lifetimes with a decay rate m, the mean 1 ÷ m, and the memoryless property.", verified: '2026-11-27' },
 s6_1: { title: "OpenStax Introductory Statistics 2e — 6.1 The Standard Normal Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution", description: "The normal curve, z-scores and the empirical rule for 1, 2 and 3 standard deviations.", verified: '2026-11-27' }
};
/* Written from build(canonical) in gen-c.js, so the prompt, hints, solution and guidance match the generator exactly. */
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: "A tray of stubborn seeds", topic: "Binomial mean, spread and “at least one”", tier: 'Intermediate', sector: 'Greenhouse',
  brief: "A tray of a rare vine has been sown, and Mira wants to know how many shoots to expect, how far the count may stray, and whether any will come up at all.",
  lesson: "A binomial count of n trials with success chance p has mean np and standard deviation √(npq), and the chance of at least one success is 1 − qⁿ.",
  prompt: "The greenhouse has a tray of 12 blue kelp-vine seeds, a variety that seldom sprouts. Each seed sprouts with probability 0.15, whatever the others do, and X is the number of seeds in the tray that sprout. Enter the mean of X, then its standard deviation to 2 decimal places, then the probability that at least one seed sprouts, to 4 decimal places.",
  answer: [1.8,1.24,0.8578], labels: ["mean", "standard deviation", "P(at least one)"], tolerance: 0.00005,
  hints: [
   "For a binomial count the mean is np and the variance is npq, where q = 1 − p is the chance that a seed does not sprout. The standard deviation is the square root of the variance.",
   "“At least one sprouts” is the complement of “none sprouts”, and none sprouting means 12 failures in a row, with probability q¹²."
  ],
  solution: "q = 1 − 0.15 = 0.85. The mean is np = 12 × 0.15 = 1.8. The variance is npq = 12 × 0.15 × 0.85 = 1.53, so the standard deviation is √1.53 ≈ 1.24. The chance that no seed sprouts is q¹² = 0.85¹² ≈ 0.1422, so the chance that at least one sprouts is 1 − 0.1422 = 0.8578.",
  xp: 150, prereqs: ["q20", "q16"],
  artifact: { name: "Sprout forecast card", description: "The mean, the spread and the chance of a first shoot for one tray." },
  sources: [source.s4_3],
  teaching: {
   intuition: "When n seeds are planted and each sprouts with chance p, whatever the others do, the number that sprout is a binomial count X. You could write out its whole table of P(X = 0), P(X = 1) and so on, then find the mean as Σ x P(x) and the spread from the variance, but there are shortcuts. If one seed in five sprouts and you plant 20, you expect about 20 × 0.2 = 4 sprouts: the mean of a binomial count is μ = np. Its variance is σ² = npq, where q = 1 − p, and its standard deviation is σ = √(npq), which says how far the count usually lands from the mean. For “at least one success”, written P(X ≥ 1) (≥ means “is at least”), use the complement. The only outcome with no success is n failures in a row, with probability qⁿ, so P(X ≥ 1) = 1 − qⁿ.",
   steps: [
    "Write q = 1 − p, the chance that one trial fails.",
    "The mean is np: the number of trials times the chance of success.",
    "The variance is npq; its square root is the standard deviation σ = √(npq).",
    "For at least one success, find the chance of none, qⁿ, and take it away from 1."
   ],
   example: {
    prompt: "A tray holds 8 seeds, each sprouting with probability 0.25. Find the mean and the standard deviation of the number that sprout, and the chance that at least one sprouts.",
    steps: [
     "q = 1 − 0.25 = 0.75, and the mean is np = 8 × 0.25 = 2.",
     "npq = 8 × 0.25 × 0.75 = 1.5, so σ = √1.5 ≈ 1.22.",
     "P(none) = 0.75⁸ ≈ 0.1001, so P(X ≥ 1) = 1 − 0.1001 = 0.8999."
    ],
    answer: "Mean 2, standard deviation about 1.22, and P(at least one) ≈ 0.8999."
   },
   pitfalls: [
    "Using p instead of q for “none”: no sprouts means every seed fails, so the chance is qⁿ, not pⁿ.",
    "Forgetting the square root: npq is the variance, and the standard deviation is its square root.",
    "Taking n × p as the chance of at least one. With 10 seeds and p = 0.3 that gives 3, which is not a probability at all."
   ]
  },
  guidance: [
   { prompt: "What is q, the chance that one seed does not sprout, and what is the mean np of the 12 seeds?", answer: [0.85,1.8], labels: ["q", "mean np"], explanation: "q = 1 − 0.15 = 0.85, and np = 12 × 0.15 = 1.8: on average that many seeds of the tray sprout." },
   { prompt: "What is the variance npq, and the standard deviation √(npq) to 2 decimal places?", answer: [1.53,1.24], labels: ["variance npq", "standard deviation"], explanation: "npq = 12 × 0.15 × 0.85 = 1.53, and √1.53 ≈ 1.24." },
   { prompt: "What is q¹², the chance that none of the 12 seeds sprouts, to 4 decimal places? Then what is the chance that at least one sprouts?", answer: [0.1422,0.8578], labels: ["P(none)", "P(at least one)"], explanation: "0.85¹² ≈ 0.1422. Every outcome other than “none” has at least one sprout, so the chance is 1 − 0.1422 = 0.8578." }
  ]
 },
 {
  id: 'q22', title: "The first shoot of the moon squash", topic: "Geometric distribution: waiting for the first success", tier: 'Intermediate', sector: 'Greenhouse',
  brief: "Mira is down to a packet of old moon-squash seeds and wants to know how long she may be planting before one finally comes up.",
  lesson: "When trials repeat until the first success, P(first success on trial k) = qᵏ⁻¹ × p, and the mean number of trials is 1 ÷ p.",
  prompt: "Mira has a packet of old moon-squash seeds. Each one sprouts with probability 0.2, whatever the others do, and she plants them one at a time until the first one sprouts. Enter the probability that the first sprout comes from seed number 4, to 4 decimal places, then the mean number of seeds she plants to get her first sprout.",
  answer: [0.1024,5], labels: ["P(first sprout on that seed)", "mean number of seeds"], tolerance: 0.00005,
  hints: [
   "The first sprout is seed 4 only if the first 3 seeds all fail and seed 4 sprouts: that is one particular sequence of 4 trials.",
   "For a geometric distribution the mean number of trials up to and including the first success is 1 ÷ p."
  ],
  solution: "q = 1 − 0.2 = 0.8. Seed 4 is the first sprout when 3 failures come before one success, so P(X = 4) = q³ × p = 0.8³ × 0.2 ≈ 0.512 × 0.2 ≈ 0.1024. The mean is 1 ÷ p = 1 ÷ 0.2 = 5 seeds.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Planting tally", description: "Seeds planted one by one, with a mark at the first green shoot." },
  sources: [source.s4_4],
  teaching: {
   intuition: "Sometimes the number of trials is not fixed: you keep going until the first success and count how many trials it took. That count X has a geometric distribution. X can be 1, 2, 3 and so on, with no top limit. For the first success to come on trial k, the first k − 1 trials must all fail and trial k must succeed. That is one particular sequence, so P(X = k) = qᵏ⁻¹ × p, where q = 1 − p, by multiplying the chances of independent trials. There is only one order to count, because the success has to come last. On average you wait 1 ÷ p trials: if one seed in four sprouts, the first sprout comes, on average, at the fourth seed.",
   steps: [
    "Write q = 1 − p.",
    "For the first success on trial k, count the failures before it: k − 1.",
    "Multiply: P(X = k) = qᵏ⁻¹ × p.",
    "The mean number of trials up to and including the first success is 1 ÷ p."
   ],
   example: {
    prompt: "Seeds sprout with probability 0.25. What is the chance that the first sprout is seed 3, and what is the mean number of seeds up to the first sprout?",
    steps: [
     "q = 0.75, and seed 3 is the first sprout when seeds 1 and 2 fail: 2 failures.",
     "P(X = 3) = 0.75² × 0.25 ≈ 0.1406.",
     "The mean is 1 ÷ 0.25 = 4 seeds."
    ],
    answer: "P(X = 3) ≈ 0.1406, and on average the first sprout is seed 4."
   },
   pitfalls: [
    "Using qᵏ instead of qᵏ⁻¹: the success itself is the kth trial, so only k − 1 trials fail.",
    "Counting several orders of the successes and failures. The first success has to come last, so there is only one order.",
    "Giving p as the mean. The mean number of trials is 1 ÷ p, which is bigger when success is rarer."
   ]
  },
  guidance: [
   { prompt: "If the first sprout is seed 4, how many failures come before it? And what is q, the chance that one seed fails?", answer: [3,0.8], labels: ["failures first", "q"], explanation: "Seeds 1 to 3 all fail before seed 4 sprouts, so there are 3 failures. q = 1 − 0.2 = 0.8." },
   { prompt: "Multiply q³ by p. What is P(X = 4) to 4 decimal places?", answer: [0.1024], labels: ["probability"], explanation: "0.8³ ≈ 0.512, and 0.512 × 0.2 ≈ 0.1024. There is only one order here: all the failures first, then the success." },
   { prompt: "What is the mean number of seeds up to the first sprout, 1 ÷ p?", answer: [5], labels: ["mean number of seeds"], explanation: "1 ÷ 0.2 = 5. With a chance of 0.2 each time, a sprout comes once in every 5 seeds on average." }
  ]
 },
 {
  id: 'q23', title: "Fixed row or first shoot?", topic: "Chapter review: binomial or geometric?", tier: 'Intermediate', sector: 'Greenhouse',
  brief: "Two jobs on the greenhouse board sound alike, and Mira wants each one matched to the right model before anyone does a sum.",
  lesson: "A fixed number of trials with the successes counted is binomial; trials repeated until the first success are geometric.",
  prompt: "Two models are chalked on the greenhouse board: 1, the binomial distribution (a fixed number of trials, counting the successes) and 2, the geometric distribution (trials one at a time until the first success). Today Mira plants a row of 6 sun-wheat seeds, each sprouting with probability 0.3 whatever the others do, and wants the chance that exactly 2 of them sprout. The number of orders of 2 sprouts among 6 seeds is 15. Enter the number of the model that fits, then the probability, to 4 decimal places. Round only at the end, not the powers on the way.",
  answer: [1,0.3241], labels: ["model", "probability"], tolerance: 0.00005,
  hints: [
   "Ask what is fixed. If the number of seeds is fixed and the sprouts are counted, it is binomial. If planting stops at the first sprout, it is geometric.",
   "Binomial: (number of orders) × pᵏ × qⁿ⁻ᵏ. Geometric: qᵏ⁻¹ × p, with only one order."
  ],
  solution: "The number of seeds is fixed at 6 and the sprouts are counted, so it is model 1, binomial. q = 1 − 0.3 = 0.7. P(X = 2) = 15 × 0.3² × 0.7⁴ ≈ 0.3241.",
  xp: 150, prereqs: ["q21", "q22"],
  artifact: { name: "Greenhouse job board", description: "Two seed jobs, each chalked up with the model that fits it." },
  sources: [source.s4_3, source.s4_4],
  teaching: {
   intuition: "The binomial and geometric distributions both come from repeated independent trials with the same chance p, so their stories sound alike. The difference is what is fixed and what is counted. Binomial: the number of trials n is fixed in advance, and X counts the successes among them, from 0 up to n. Many orders of successes can give the same count, so P(X = k) = (number of orders) × pᵏ × qⁿ⁻ᵏ. Geometric: there is no fixed number of trials. You keep going until the first success, and X is the number of the trial where it comes. Only one order works, all failures and then the success, so P(X = k) = qᵏ⁻¹ × p. Ask first: is there a fixed row of trials, or do we stop at the first success?",
   steps: [
    "Read the story: is the number of trials fixed (binomial), or do the trials stop at the first success (geometric)?",
    "Count the failures in the outcome asked about: n − k for a binomial count, k − 1 for a geometric one.",
    "Binomial: multiply the number of orders by pᵏ and by qⁿ⁻ᵏ. Geometric: multiply qᵏ⁻¹ by p."
   ],
   example: {
    prompt: "Seeds sprout with probability 0.4. Mira plants them one at a time and stops at the first sprout. Which model fits, and what is the chance that the first sprout is seed 3?",
    steps: [
     "She stops at the first sprout, so it is geometric: model 2.",
     "Seed 3 is the first sprout when 2 seeds fail: 0.6² × 0.4 = 0.144."
    ],
    answer: "Model 2, with probability 0.144."
   },
   pitfalls: [
    "Calling every story with a chance p binomial. If the planting stops at the first sprout, it is geometric.",
    "Leaving out the number of orders in a binomial probability; it counts every way the successes can fall.",
    "Using the wrong power of q: n − k failures for a binomial count, k − 1 for a geometric one."
   ]
  },
  guidance: [
   { prompt: "Is the number of seeds fixed, with the sprouts counted (model 1), or does planting stop at the first sprout (model 2)? Enter the model number.", answer: [1], labels: ["model"], explanation: "The row has a fixed 6 seeds and we count how many sprout: model 1, binomial." },
   { prompt: "How many seeds fail in the outcome asked about?", answer: [4], labels: ["seeds that fail"], explanation: "2 of the 6 seeds sprout, so 4 seeds fail: the power of q is 4." },
   { prompt: "Put the numbers into the formula of that model. What is the probability, to 4 decimal places?", answer: [0.3241], labels: ["probability"], explanation: "15 × 0.3² × 0.7⁴ ≈ 0.3241. The 15 counts every order the sprouts could come in." }
  ]
 },
 {
  id: 'q24', title: "Counting meteor pings", topic: "Poisson distribution: counts of rare events", tier: 'Intermediate', sector: 'Radio Room',
  brief: "The meteor counter in the radio room clicks at random, and Mira wants to know how often a minute brings a burst of pings.",
  lesson: "For rare independent events at a steady average rate, the count X in a fixed stretch of time has P(X = k) = λᵏ × e^(−λ) ÷ k!, where λ is the expected count in that stretch: the rate times its length.",
  prompt: "The radio room’s meteor counter clicks at random, at an average of 2 pings a minute, and the pings come independently of one another. Model the number of pings X in one minute with a Poisson distribution with λ = 2; e^(−2) = 0.1353 to 4 decimal places. Enter 3!, then the probability of exactly 3 pings in a minute, to 4 decimal places.",
  answer: [6,0.1804], labels: ["k!", "probability"], tolerance: 0.00005,
  hints: [
   "k! means k × (k − 1) × … × 1, so 3! multiplies the whole numbers from 3 down to 1.",
   "P(X = k) = λᵏ × e^(−λ) ÷ k!. Here λᵏ is 2³."
  ],
  solution: "3! = 3 × 2 × 1 = 6, and λ³ = 2³ = 8. So P(X = 3) = 8 × 0.1353 ÷ 6 ≈ 0.1804.",
  xp: 150, prereqs: ["q20"],
  artifact: { name: "Ping log", description: "A minute-by-minute tally of meteor pings off the counter." },
  sources: [source.s4_6],
  teaching: {
   intuition: "Some events happen at random moments, one at a time and independently of one another: meteor pings, static crackles, calls on the radio. We know only the average number in a fixed stretch of time, written λ (the Greek letter lambda). λ is always the expected count for the stretch you ask about: if pings come at an average of 0.5 a minute and you watch for 6 minutes, λ = 0.5 × 6 = 3, not 0.5. The number X that happen in one such stretch has a Poisson distribution, named after the French mathematician Siméon Poisson. X can be 0, 1, 2 and so on, and its mean is λ. The chance of exactly k events is P(X = k) = λᵏ × e^(−λ) ÷ k!. Two new pieces of notation appear here. k! (read “k factorial”) means k × (k − 1) × … × 1, the whole numbers from k down to 1 multiplied together, so 4! = 4 × 3 × 2 × 1 = 24; by agreement 0! = 1. And e is a fixed number, about 2.718, that turns up wherever chances are spread smoothly over time; e^(−λ) means 1 ÷ e^λ. The missions print its value, or a calculator’s eˣ key gives it.",
   steps: [
    "Find λ, the average count in the stretch of time asked about. If you are given a rate, multiply it by the length of the stretch. Read off k, the count asked about.",
    "Work out k! by multiplying the whole numbers from k down to 1.",
    "Work out λᵏ, λ multiplied by itself k times.",
    "Multiply λᵏ by e^(−λ) and divide by k!."
   ],
   example: {
    prompt: "Radio calls arrive at an average of 1.5 an hour. What is the chance of exactly 2 calls in an hour? (e^(−1.5) = 0.2231.)",
    steps: [
     "2! = 2 × 1 = 2, and 1.5² = 2.25.",
     "P(X = 2) = 2.25 × 0.2231 ÷ 2 ≈ 0.2510."
    ],
    answer: "About 0.2510, roughly one hour in four."
   },
   pitfalls: [
    "Forgetting to divide by k!. Without it the chances add up to far more than 1.",
    "Using e^λ instead of e^(−λ): e^(−λ) is less than 1, and it is the chance of no events at all.",
    "Taking λ as the count that is sure to happen. λ is the average; the count itself changes from one minute to the next.",
    "Using a rate per minute as λ for a longer stretch. Over 6 minutes at 0.5 a minute, λ is 3."
   ]
  },
  guidance: [
   { prompt: "Work out 3! = 3 × 2 × 1.", answer: [6], labels: ["k!"], explanation: "3 × 2 × 1 = 6." },
   { prompt: "What is λ³ = 2³?", answer: [8], labels: ["λ to the power k"], explanation: "2 multiplied by itself 3 times is 8." },
   { prompt: "Multiply λ³ by e^(−2) = 0.1353 and divide by 3!. What is P(X = 3) to 4 decimal places?", answer: [0.1804], labels: ["probability"], explanation: "8 × 0.1353 ÷ 6 ≈ 0.1804. About 18.04% of minutes have exactly 3 pings." }
  ]
 },
 {
  id: 'q25', title: "When the relay signal lands", topic: "Probability as area; the uniform distribution", tier: 'Intermediate', sector: 'Radio Room',
  brief: "The relay buoy’s signal can reach the radio room at any moment in a window, and the operator wants the chance that it lands during her turn at the desk.",
  lesson: "For a continuous random variable, probability is area under the density curve; a uniform density from a to b has height 1 ÷ (b − a).",
  prompt: "The relay buoy’s signal reaches the radio room at a random moment between 10 and 30 minutes past the hour, and every moment in that range is equally likely. Let X be the arrival time in minutes past the hour. Enter the height of the density curve of X, then the probability that the signal arrives between 14 and 23 minutes past the hour.",
  answer: [0.05,0.45], labels: ["density height", "probability"], tolerance: 0.00005,
  hints: [
   "The density curve is a flat rectangle over the range from 10 to 30. Its total area is 1, so its height is 1 ÷ (30 − 10).",
   "The probability is the area of the strip from 14 to 23: its width times the height."
  ],
  solution: "The range is 30 − 10 = 20 minutes wide, so the height is 1 ÷ 20 = 0.05. The strip from 14 to 23 is 23 − 14 = 9 minutes wide, so P(14 < X < 23) = 9 × 0.05 = 0.45.",
  xp: 150, prereqs: ["q14"],
  artifact: { name: "Signal window chart", description: "A flat strip over the arrival window, with one slice shaded." },
  sources: [source.s5_1, source.s5_2],
  teaching: {
   intuition: "Until now every random variable has taken separate values, like 0, 1 or 2 sprouts. A time can be any number in a range: 14 minutes, 14.5, 14.53 and so on. A random variable like this is a continuous random variable. There are so many possible values that the chance of hitting one exact value is 0, so we ask for the chance of landing in an interval instead. The tool is a density curve: a graph over the possible values whose total area underneath is 1, where the area under it between two values is the probability of landing between them. The simplest is the uniform distribution, where every moment from a to b is equally likely. Its density curve is a flat rectangle. The width is b − a and the area must be 1, so the height is 1 ÷ (b − a). Then P(c < X < d) is the area of the strip from c to d: (d − c) × 1 ÷ (b − a). A single point has no width, so it makes no difference whether we write < or ≤.",
   steps: [
    "Find the width of the whole range, b − a.",
    "The density height is 1 ÷ (b − a), so that the rectangle has area 1.",
    "Find the width of the strip asked about, d − c.",
    "Multiply the strip width by the height: P(c < X < d) = (d − c) ÷ (b − a)."
   ],
   example: {
    prompt: "A delivery drone arrives at a time spread evenly from 0 to 8 minutes after a call. What is the height of the density curve, and the chance that it arrives between 2 and 5 minutes?",
    steps: [
     "The range is 8 minutes wide, so the height is 1 ÷ 8 = 0.125.",
     "The strip from 2 to 5 is 3 minutes wide: 3 × 0.125 = 0.375."
    ],
    answer: "Height 0.125, and P(2 < X < 5) = 0.375."
   },
   pitfalls: [
    "Dividing by b instead of by the width b − a when the range does not start at 0.",
    "Giving the height as the probability. The height is a density; only an area is a probability.",
    "Thinking P(X = 7) is 0.1 because the height is 0.1. A single exact value has probability 0."
   ]
  },
  guidance: [
   { prompt: "How wide is the range of arrival times, 30 − 10, and what height gives the rectangle over it an area of 1?", answer: [20,0.05], labels: ["range width (min)", "height"], explanation: "30 − 10 = 20 minutes, and 20 × height = 1 gives a height of 1 ÷ 20 = 0.05." },
   { prompt: "How wide is the strip from 14 to 23, and what is its area?", answer: [9,0.45], labels: ["strip width (min)", "probability"], explanation: "23 − 14 = 9 minutes, and 9 × 0.05 = 0.45. That area is the probability." }
  ]
 },
 {
  id: 'q26', title: "The beacon’s late check-in", topic: "Uniform mean, percentiles and conditional chances", tier: 'Intermediate', sector: 'Radio Room',
  brief: "The supply beacon checks in at a random time each night, and the radio watch wants to know when to expect it and what to think once it is late.",
  lesson: "A uniform distribution from a to b has mean (a + b) ÷ 2 and kth percentile a + (k ÷ 100) × (b − a); given X > d, it is uniform from d to b.",
  prompt: "The supply beacon checks in with the radio room at a random time X between 4 and 20 minutes after midnight, and every moment in that range is equally likely. Enter the mean check-in time, then the 75th percentile of X, then the probability that it checks in after 17 minutes, given that it has not checked in by 12 minutes.",
  answer: [12,16,0.375], labels: ["mean (min)", "percentile (min)", "probability"], tolerance: 0.00005,
  hints: [
   "The mean of a uniform distribution is halfway along the range. The kth percentile is the time with k% of the area to its left: a + (k ÷ 100) × (b − a).",
   "Once you know X > 12, X is spread evenly from 12 to 20. The chance it is after 17 is the share of that shorter range lying above 17."
  ],
  solution: "The mean is (4 + 20) ÷ 2 = 12 minutes. The range is 16 minutes wide, so the 75th percentile is 4 + 0.75 × 16 = 16 minutes. Given X > 12, X is uniform from 12 to 20, a range 8 minutes wide, of which 3 minutes lie above 17: P(X > 17 | X > 12) = 3 ÷ 8 = 0.375.",
  xp: 150, prereqs: ["q25", "q07"],
  artifact: { name: "Night watch timetable", description: "The beacon’s window, its middle and its late quarter marked in pencil." },
  sources: [source.s5_2],
  teaching: {
   intuition: "A flat density balances at its middle, so the mean of a uniform distribution from a to b is (a + b) ÷ 2. A percentile answers the opposite question to a probability. Instead of asking how much area lies below a value, it asks which value has a given share of the area below it: the kth percentile is the value with k% of the probability to its left, and the 50th percentile is the middle. For a uniform distribution the area grows evenly along the range, so the kth percentile is a + (k ÷ 100) × (b − a). Conditional chances work as they did in the Sorting Shed: P(A | B) = P(A and B) ÷ P(B). If we already know X > d, the time is still equally likely anywhere in what is left, from d to b. So for a later time c, P(X > c | X > d) is the share of that shorter range lying above c: (b − c) ÷ (b − d).",
   steps: [
    "Mean: add the two ends of the range and halve.",
    "Percentile: turn k% into a decimal, multiply it by the width b − a, and add the result to a.",
    "Conditional: once X > d is known, the range left runs from d to b, still flat.",
    "P(X > c | X > d) = (b − c) ÷ (b − d), the share of the range left that lies above c."
   ],
   example: {
    prompt: "A time is spread evenly from 0 to 10 minutes. Find the mean, the 30th percentile, and P(X > 8 | X > 6).",
    steps: [
     "The mean is (0 + 10) ÷ 2 = 5.",
     "The 30th percentile is 0 + 0.3 × 10 = 3.",
     "Given X > 6 the range left is 6 to 10, which is 4 minutes, and 2 of them lie above 8: 2 ÷ 4 = 0.5."
    ],
    answer: "Mean 5 minutes, 30th percentile 3 minutes, and P(X > 8 | X > 6) = 0.5."
   },
   pitfalls: [
    "Forgetting to add a: the percentile is measured from the start of the range, not from 0.",
    "Dividing by the whole width b − a in the conditional chance. Once X > d is known, only the range from d to b is left.",
    "Mixing up a percentile and a probability: the 75th percentile is a time, and 0.75 is the area to its left."
   ]
  },
  guidance: [
   { prompt: "What is the mean, halfway between 4 and 20?", answer: [12], labels: ["mean (min)"], explanation: "(4 + 20) ÷ 2 = 12 minutes. The flat density balances at the middle of the range." },
   { prompt: "What share of the range, as a decimal, lies to the left of the 75th percentile, and what time is that?", answer: [0.75,16], labels: ["share to the left", "percentile (min)"], explanation: "75% is 0.75, and 0.75 of the 16-minute range is 12 minutes, so the percentile is 4 + 12 = 16." },
   { prompt: "Given X > 12, how wide is the range that is left, and what is P(X > 17 | X > 12)?", answer: [8,0.375], labels: ["range left (min)", "probability"], explanation: "The range left runs from 12 to 20, 8 minutes, and 3 of them are above 17: 3 ÷ 8 = 0.375." }
  ]
 },
 {
  id: 'q27', title: "How long a valve lasts", topic: "The exponential distribution", tier: 'Intermediate', sector: 'Radio Room',
  brief: "The receiver’s amplifier valves burn out without warning, and Mira wants to know how many spares a long listening watch will need.",
  lesson: "An exponential lifetime with decay rate m has P(X < x) = 1 − e^(−mx), P(X > x) = e^(−mx) and mean 1 ÷ m.",
  prompt: "The radio room’s receiver uses amplifier valves that burn out at random, without warning. A valve’s lifetime X in hours follows an exponential distribution with decay rate m = 0.05 per hour; e^(−0.5) = 0.6065 to 4 decimal places. Enter the probability that a new valve fails within 10 hours, to 4 decimal places, then the mean lifetime of a valve in hours.",
  answer: [0.3935,20], labels: ["probability", "mean lifetime (h)"], tolerance: 0.00005,
  hints: [
   "For an exponential distribution P(X < x) = 1 − e^(−mx). Here mx = 0.05 × 10.",
   "The mean lifetime is 1 ÷ m."
  ],
  solution: "mx = 0.05 × 10 = 0.5, so P(X < 10) = 1 − e^(−0.5) = 1 − 0.6065 ≈ 0.3935. The mean lifetime is 1 ÷ 0.05 = 20 hours.",
  xp: 150, prereqs: ["q25"],
  artifact: { name: "Valve spares list", description: "Lifetimes of burnt-out valves, and how many spares to keep in the drawer." },
  sources: [source.s5_3],
  teaching: {
   intuition: "Some waiting times have no favourite length. A part that fails by sudden accident is as likely to fail in the next hour whether it is new or old, so short lives are common and long lives get rarer and rarer. Such a time X has an exponential distribution. Its density curve starts at a height m on the left and falls away smoothly towards 0 without ever reaching it. The number m is the decay rate: while it is small it is roughly the chance of failing in each unit of time, so m = 0.05 per hour is about a 5% chance in the next hour. The area to the left of x is P(X < x) = 1 − e^(−mx), the chance of failing within x hours, and the area to the right is P(X > x) = e^(−mx), the chance of lasting longer. Here e is a fixed number, about 2.718, that turns up wherever chances are spread smoothly over time; e^(−mx) means 1 ÷ e^(mx), and the missions print the powers you need. On average such a part lasts 1 ÷ m hours.",
   steps: [
    "Read off the decay rate m and the time x.",
    "Multiply them to get mx.",
    "Failing within x: P(X < x) = 1 − e^(−mx). Lasting longer than x: P(X > x) = e^(−mx).",
    "The mean lifetime is 1 ÷ m."
   ],
   example: {
    prompt: "A filter clogs at random with decay rate m = 0.2 per day. What is the chance that it clogs within 3 days, and what is its mean life? (e^(−0.6) = 0.5488.)",
    steps: [
     "mx = 0.2 × 3 = 0.6.",
     "P(X < 3) = 1 − 0.5488 = 0.4512.",
     "The mean life is 1 ÷ 0.2 = 5 days."
    ],
    answer: "About 0.4512, and 5 days on average."
   },
   pitfalls: [
    "Giving e^(−mx) as the chance of failing. That is the chance of lasting longer than x; failing within x is 1 minus it.",
    "Using the mean in place of m: a mean life of 40 hours means m = 1 ÷ 40 = 0.025, not 40.",
    "Expecting half the parts to fail by the mean. With an exponential lifetime more than half fail before the mean, because many lives are short."
   ]
  },
  guidance: [
   { prompt: "What is mx = 0.05 × 10?", answer: [0.5], labels: ["mx"], explanation: "0.05 × 10 = 0.5." },
   { prompt: "What is 1 − e^(−0.5), to 4 decimal places?", answer: [0.3935], labels: ["probability"], explanation: "1 − 0.6065 = 0.3935: the area under the density curve to the left of 10 hours." },
   { prompt: "What is the mean lifetime, 1 ÷ 0.05?", answer: [20], labels: ["mean lifetime (h)"], explanation: "1 ÷ 0.05 = 20 hours." }
  ]
 },
 {
  id: 'q28', title: "A battery that forgets", topic: "Memoryless waiting", tier: 'Intermediate', sector: 'Radio Room',
  brief: "A beacon battery has already run for hours without trouble, and the crew argue about whether it is now more likely to die soon.",
  lesson: "An exponential lifetime is memoryless: P(X > a + b | X > a) = P(X > b) = e^(−mb).",
  prompt: "A radio beacon’s battery life X in hours is exponential with decay rate m = 0.05 per hour. The battery in the beacon has already run 4 hours without failing. For reference, e^(−0.2) = 0.8187, e^(−0.6) = 0.5488 and e^(−0.4) = 0.6703, each to 4 decimal places. Enter P(X > 12), the chance that a new battery lasts more than 12 hours, then P(X > 12 | X > 4), the chance that this battery lasts another 8 hours. Give both to 4 decimal places.",
  answer: [0.5488,0.6703], labels: ["P(X > a + b)", "P(X > a + b | X > a)"], tolerance: 0.00005,
  hints: [
   "For an exponential lifetime P(X > x) = e^(−mx).",
   "By the rule for conditional probability, P(X > 12 | X > 4) = P(X > 12 and X > 4) ÷ P(X > 4), and lasting past 12 hours already means lasting past 4."
  ],
  solution: "P(X > 12) = e^(−0.6) ≈ 0.5488. Lasting past 12 hours includes lasting past 4, so P(X > 12 | X > 4) = e^(−0.6) ÷ e^(−0.2) = 0.5488 ÷ 0.8187 ≈ 0.6703. That is e^(−0.4) = P(X > 8): the battery’s chances ahead do not depend on the 4 hours it has already run.",
  xp: 150, prereqs: ["q27", "q07"],
  artifact: { name: "Battery logbook", description: "Hours run so far, and the same odds for the hours ahead." },
  sources: [source.s5_3],
  teaching: {
   intuition: "Suppose a battery with an exponential lifetime has already run a hours. What is the chance it lasts b hours more? By the rule for conditional probability, P(X > a + b | X > a) = P(X > a + b and X > a) ÷ P(X > a). Lasting past a + b hours already includes lasting past a, so the top is just P(X > a + b) = e^(−m(a + b)). Dividing by e^(−ma) leaves e^(−mb), because e^(−m(a + b)) = e^(−ma) × e^(−mb). That is exactly P(X > b), the chance that a brand-new battery lasts b hours. So the hours already run make no difference: the exponential distribution is memoryless. That fits parts that fail by sudden accident, not parts that wear out; a tyre that wears down is not memoryless.",
   steps: [
    "Write the conditional chance as P(X > a + b) ÷ P(X > a).",
    "Use P(X > x) = e^(−mx) for the top and the bottom.",
    "Divide: the answer is e^(−mb), the same as P(X > b) for a new part."
   ],
   example: {
    prompt: "A seal fails at random with decay rate m = 0.2 per week and has lasted 3 weeks. What is the chance it lasts 4 more? (e^(−1.4) = 0.2466, e^(−0.6) = 0.5488 and e^(−0.8) = 0.4493.)",
    steps: [
     "P(X > 7 | X > 3) = P(X > 7) ÷ P(X > 3) = 0.2466 ÷ 0.5488 ≈ 0.4493.",
     "That is e^(−0.8) = P(X > 4): the 3 weeks already passed do not matter."
    ],
    answer: "About 0.4493."
   },
   pitfalls: [
    "Answering P(X > a + b), the chance for a new part, when the part is known to have lasted a hours already.",
    "Subtracting the chances instead of dividing them. A conditional probability is a quotient.",
    "Thinking an old part is “due” to fail. For an exponential lifetime the hours already run change nothing."
   ]
  },
  guidance: [
   { prompt: "Which of the printed values are P(X > 4) and P(X > 12)?", answer: [0.8187,0.5488], labels: ["P(X > a)", "P(X > a + b)"], explanation: "P(X > x) = e^(−mx), so P(X > 4) = e^(−0.2) = 0.8187 and P(X > 12) = e^(−0.6) = 0.5488." },
   { prompt: "Divide P(X > 12) by P(X > 4). What is P(X > 12 | X > 4) to 4 decimal places?", answer: [0.6703], labels: ["conditional probability"], explanation: "0.5488 ÷ 0.8187 ≈ 0.6703." },
   { prompt: "Compare with the chance that a new battery lasts more than 8 hours, P(X > 8) = e^(−0.4). What is it, from the printed values?", answer: [0.6703], labels: ["P(X > b)"], explanation: "e^(−0.4) = 0.6703, the same as the conditional chance: the exponential distribution is memoryless." }
  ]
 },
 {
  id: 'q29', title: "Which model for the radio desk?", topic: "Chapter review: the right model for a count or a wait", tier: 'Intermediate', sector: 'Radio Room',
  brief: "The radio desk logs counts, call times and battery lives side by side, and Mira wants each one read with the right model.",
  lesson: "Counts of rare events are Poisson, times equally likely across a range are uniform, and waiting times or lifetimes with a decay rate are exponential.",
  prompt: "Three models are pinned above the radio desk: 1, Poisson (a count of rare events in a fixed time); 2, uniform (a time equally likely anywhere in a range); 3, exponential (a waiting time or lifetime with a decay rate). A headset battery runs for a random time with decay rate m = 0.04 per hour. What is the probability that it runs flat within 20 hours? (e^(−0.8) = 0.4493 to 4 decimal places.) Enter the number of the model that fits, then the probability, to 4 decimal places.",
  answer: [3,0.5507], labels: ["model", "probability"], tolerance: 0.00005,
  hints: [
   "A count of events in a fixed time is Poisson. A time equally likely anywhere in a range is uniform. A waiting time or lifetime with a decay rate is exponential.",
   "Poisson: λᵏ × e^(−λ) ÷ k!. Uniform: (d − c) ÷ (b − a). Exponential: P(X < x) = 1 − e^(−mx)."
  ],
  solution: "It is a lifetime with a decay rate, so it is model 3, exponential. The probability is 1 − e^(−0.8) = 1 − 0.4493 ≈ 0.5507, with mx = 0.04 × 20 = 0.8.",
  xp: 150, prereqs: ["q24", "q28"],
  artifact: { name: "Radio desk model chart", description: "Three curves pinned above the desk: a count, a flat window and a falling wait." },
  sources: [source.s4_6, source.s5_3],
  teaching: {
   intuition: "Three models from this chapter cover most of what the radio room logs, and the first job is always to tell them apart. A Poisson distribution counts how many rare, independent events happen in a fixed stretch of time with an average of λ: its values are whole numbers, and P(X = k) = λᵏ × e^(−λ) ÷ k!. A uniform distribution describes a continuous time that is equally likely anywhere from a to b: the density is flat, and P(c < X < d) = (d − c) ÷ (b − a). An exponential distribution describes a continuous waiting time or lifetime with a decay rate m, where short times are common and long ones rare: P(X < x) = 1 − e^(−mx). So ask two questions. Is the answer a count or a time? If it is a time, is it spread evenly over a range, or does it have a decay rate?",
   steps: [
    "Decide whether X is a count of events (Poisson) or a time (uniform or exponential).",
    "For a time: a range with every moment equally likely is uniform; a decay rate means exponential.",
    "Use that model’s formula with the numbers in the story."
   ],
   example: {
    prompt: "A pump seal fails at random with decay rate m = 0.5 per year. Which model fits, and what is the chance that it fails within 2 years? (e^(−1) = 0.3679.)",
    steps: [
     "A lifetime with a decay rate is exponential: model 3.",
     "mx = 0.5 × 2 = 1, so P(X < 2) = 1 − 0.3679 = 0.6321."
    ],
    answer: "Model 3, with probability about 0.6321."
   },
   pitfalls: [
    "Treating a lifetime as uniform just because a span of time is mentioned. A decay rate means exponential.",
    "Using the Poisson formula for a time. Poisson answers are whole-number counts.",
    "Mixing up the exponential pieces: 1 − e^(−mx) is the chance of failing within x, and e^(−mx) the chance of lasting longer."
   ]
  },
  guidance: [
   { prompt: "Is this a count of rare events (1), a time equally likely anywhere in a range (2) or a lifetime with a decay rate (3)? Enter the model number.", answer: [3], labels: ["model"], explanation: "It is a lifetime with a decay rate: model 3, exponential." },
   { prompt: "Use the exponential formula. What is the probability, to 4 decimal places?", answer: [0.5507], labels: ["probability"], explanation: "1 − e^(−0.8) = 1 − 0.4493 ≈ 0.5507, with mx = 0.04 × 20 = 0.8." }
  ]
 },
 {
  id: 'q30', title: "Bolts under the bell curve", topic: "The normal curve and the empirical rule", tier: 'Advanced', sector: 'Quality Lab',
  brief: "The lab’s bolt lengths vary a little from one bolt to the next, and Mira wants to say what share of a batch falls between two gauge marks.",
  lesson: "For a normal distribution about 68%, 95% and 99.7% of values lie within 1, 2 and 3 standard deviations of the mean.",
  prompt: "The quality lab makes bolts whose lengths follow a normal distribution with mean μ = 50 mm and standard deviation σ = 0.4 mm. Using the empirical rule, find the percentage of bolts between 49.6 mm and 50.8 mm long. Enter how many standard deviations the shorter length is from the mean (negative if it is below the mean), then the same for the longer length, then the percentage.",
  answer: [-1,2,81.5], labels: ["shorter length (σ from mean)", "longer length (σ from mean)", "percentage"], tolerance: 0.005,
  hints: [
   "Subtract the mean from each length and divide by σ: that says how many standard deviations from the mean it is.",
   "The empirical rule puts 68% within 1σ of the mean, 95% within 2σ and 99.7% within 3σ. Halve each to get the pieces on one side, then add the pieces between your two marks."
  ],
  solution: "(49.6 − 50) ÷ 0.4 = −1 and (50.8 − 50) ÷ 0.4 = 2, so the lengths are at μ − σ and μ + 2σ. Between them the pieces are 34% + 34% + 13.5% = 81.5%.",
  xp: 200, prereqs: ["q16", "q25"],
  artifact: { name: "Bolt gauge", description: "A steel gauge with marks one standard deviation apart." },
  sources: [source.s6_1],
  teaching: {
   intuition: "Measure many bolts from the same machine and the lengths pile up around the target, thinning out evenly on both sides. Their density curve is the bell curve of the normal distribution: symmetric about its mean μ, highest at μ, and with a spread set by its standard deviation σ. A normal distribution is fixed by just these two numbers. Every normal curve has the same shape once you measure in steps of σ from the mean, and that gives the empirical rule. About 68% of values lie within 1σ of the mean, from μ − σ to μ + σ; about 95% lie within 2σ; and about 99.7% lie within 3σ. Because the curve is symmetric, each band splits into equal halves: 34% from μ to μ + σ, 13.5% from μ + σ to μ + 2σ (half of 95 − 68), and 2.35% from μ + 2σ to μ + 3σ (half of 99.7 − 95), with the same pieces on the left. To use the rule, find how many σ each mark is from μ, then add the pieces between them.",
   steps: [
    "For each mark, subtract the mean and divide by σ: that is how many standard deviations from the mean it lies.",
    "Split the rule into pieces on each side of the mean: 34%, 13.5% and 2.35%.",
    "Add the pieces from the lower mark to the upper mark."
   ],
   example: {
    prompt: "Rod lengths are normal with mean 120 mm and standard deviation 5 mm. What percentage of rods are between 115 mm and 135 mm long?",
    steps: [
     "(115 − 120) ÷ 5 = −1 and (135 − 120) ÷ 5 = 3.",
     "From μ − σ to μ + 3σ: 34% + 34% + 13.5% + 2.35% = 83.85%."
    ],
    answer: "83.85% of the rods."
   },
   pitfalls: [
    "Using 68% for a band on one side of the mean only. From μ to μ + σ is half of it, 34%.",
    "Dropping the sign of a mark below the mean: 28 mm with mean 30 mm and σ = 1 mm is −2 standard deviations, not 2.",
    "Adding 95% and 68% for the band from μ − 2σ to μ + σ. The bands overlap; add the separate pieces instead."
   ]
  },
  guidance: [
   { prompt: "How many standard deviations from the mean is 49.6 mm? Enter a negative number if it is below the mean.", answer: [-1], labels: ["σ from mean"], explanation: "(49.6 − 50) ÷ 0.4 = −1, so 49.6 mm is at μ − σ." },
   { prompt: "How many standard deviations from the mean is 50.8 mm?", answer: [2], labels: ["σ from mean"], explanation: "(50.8 − 50) ÷ 0.4 = 2, so 50.8 mm is at μ + 2σ." },
   { prompt: "Add the empirical-rule pieces from μ − σ to μ + 2σ. What percentage of bolts is that?", answer: [81.5], labels: ["percentage"], explanation: "Each side of the mean holds 34% within 1σ, 13.5% from 1σ to 2σ and 2.35% from 2σ to 3σ. From μ − σ to μ + 2σ the pieces are 34% + 34% + 13.5% = 81.5%." }
  ]
 }
);
})();
