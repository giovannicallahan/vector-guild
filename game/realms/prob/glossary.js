/* Probability glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['prob'] = {
 required: ['outcome', 'sample space', 'event', 'complement', 'mutually exclusive', 'conditional probability', 'independent', 'random variable', 'expected value', 'standard deviation', 'binomial distribution', 'exponential distribution', 'normal distribution', 'z-score'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['outcome', 'q01', 'One possible result of a chance process, such as drawing one particular token from a bag.', 'Drawing a token from a bag of 12 has 12 outcomes.'],
  ['sample space', 'q01', 'The list of every possible outcome of a chance process.', 'For one spinner numbered 1 to 4 the sample space is 1, 2, 3, 4.'],
  ['event', 'q01', 'A group of outcomes you are interested in; it happens when the result is one of them.', 'The event “green” is every green token in the bag.'],
  ['probability', 'q01', 'A number from 0 to 1 that says how likely an event is: 0 means impossible and 1 means certain.', 'P(blue) = 3/12 = 1/4 for 3 blue tokens out of 12.', ['probabilities']],
  ['equally likely', 'q01', 'Having the same chance as each other, so that no outcome is favoured over another.', 'Each section of a fair spinner is equally likely.'],
  ['relative frequency', 'q02', 'How many times an event happened divided by how many times it could have happened.', '21 full openings in 25 drops: 21 ÷ 25 = 0.84.', ['relative frequencies']],
  ['complement', 'q03', 'The event made of every outcome not in a given event A, written A′; its probability is 1 − P(A).', 'If P(rain) = 0.3, the complement “no rain” has probability 0.7.'],
  ['Venn diagram', 'q05', 'A picture of events as overlapping circles inside a box that stands for the sample space.', 'The overlap of circles F and C holds the crates in both.'],
  ['mutually exclusive', 'q05', 'Describing events that cannot happen at the same time, so their overlap is empty.', 'One token cannot be both red and green.'],
  ['addition rule', 'q06', 'The rule P(A or B) = P(A) + P(B) − P(A and B), which counts the overlap only once.', '0.4 + 0.3 − 0.1 = 0.6.'],
  ['two-way table', 'q07', 'A table that sorts the same items in two ways at once, one way down the side and one along the top.', 'Crates by supplier (rows) and condition (columns).', ['contingency table']],
  ['conditional probability', 'q07', 'The probability of one event when you already know that another has happened, written P(A | B).', 'P(bad | Pallas) = 4/20 looks only at the Pallas row.'],
  ['multiplication rule', 'q08', 'The rule P(A and B) = P(A) × P(B | A): the chance of the first times the chance of the second given the first.', '2/6 × 1/5 = 1/15 for two dead bulbs.'],
  ['without replacement', 'q08', 'Describing picks in which an item taken out is not put back before the next pick.', 'After one of 6 bulbs is taken, the next pick is from 5.'],
  ['independent', 'q09', 'Describing events where knowing one happened does not change the chance of the other, so P(A and B) = P(A) × P(B).', '0.5 × 0.4 = 0.2 = P(A and B), so A and B are independent.', ['independence']],
  ['tree diagram', 'q10', 'A branching picture of a chance process, with a probability on each branch; multiply along a path to get its chance.', 'Ceres 0.7 then fail 0.1 gives the path 0.07.'],
  ['total probability', 'q10', 'The chance of an outcome reached by several paths: the sum of the path probabilities.', '0.07 + 0.06 = 0.13 for a seed failing.'],
  /* q11–q20 (missions-b.js) */
  ['Bayes’ rule', 'q12', 'The rule that reverses a condition: P(A | B) = P(B | A) × P(A) ÷ P(B).', 'From P(positive | ill) and how common the illness is, Bayes’ rule gives P(ill | positive).', ['Bayes rule', 'Bayes’ theorem']],
  ['base rate', 'q12', 'How common a condition is in the whole group, before any test result is known.', 'If 2 crew in every 100 carry a virus, the base rate is 2%.'],
  ['false alarm', 'q12', 'A positive test result for someone who does not have the condition being tested for.', 'A screen that is positive for 5% of healthy crew gives 5 false alarms per 100 of them.', ['false positive']],
  ['odds', 'q13', 'A comparison of the chance that an event happens with the chance that it does not, written as a ratio such as 3 : 2.', 'A probability of 0.6 gives odds in favour of 0.6 : 0.4, which is 3 : 2.', ['odds in favour', 'odds against'], 'odds board'],
  ['random variable', 'q14', 'A rule that gives a number to each outcome of a chance process, usually named by a capital letter such as X.', 'X = the number of crew who visit the medical bay today.'],
  ['probability distribution', 'q14', 'A list of every value a random variable can take, each with its probability; the probabilities add up to 1.', 'P(X = 0) = 0.3, P(X = 1) = 0.5, P(X = 2) = 0.2.'],
  ['expected value', 'q15', 'The long-run average of a random variable: each value times its probability, all added up.', 'P(X = 0) = 0.5 and P(X = 2) = 0.5 give E(X) = 0 + 1 = 1.', ['E(X)']],
  ['μ', 'q15', 'The Greek letter mu, used for the mean or expected value of a random variable.', 'If E(X) = 1.25, then μ = 1.25.', ['mu']],
  ['variance', 'q16', 'The expected value of the squared distance from the mean, written σ²; it measures spread in squared units.', 'Values 0 and 2, each with probability 0.5, have mean 1 and variance 1.', ['σ²']],
  ['standard deviation', 'q16', 'The square root of the variance, written σ: roughly how far a typical value lies from the mean.', 'A variance of 4 gives a standard deviation of 2.'],
  ['net gain', 'q17', 'What a play of a game leaves you with: the prize won minus the price paid.', 'A ticket that costs 2 credits and wins 5 credits has a net gain of 3 credits.', ['expected net gain']],
  ['fair game', 'q17', 'A game whose expected net gain is 0, so on average neither the player nor the house comes out ahead.', 'A ticket whose expected prize is 1.5 credits is a fair game at a price of 1.5 credits.', ['fair price']],
  ['trial', 'q18', 'One go at an action with a chance result, such as planting one seed or tossing one coin.', 'Planting a row of 6 seeds is 6 trials.'],
  ['success', 'q18', 'The outcome of a trial that we are counting, written S, with probability p; the word carries no praise.', 'If we count sprouts, a seed that sprouts is a success.'],
  ['failure', 'q18', 'The other outcome of a two-outcome trial, written F, with probability q = 1 − p.', 'If p = 0.8, a failure has probability q = 0.2.'],
  ['number of orders', 'q19', 'How many different arrangements put k successes among n trials.', 'Two sprouts among 4 seeds can fall in 6 orders.',],
  ['triangle of orders', 'q19', 'Rows of numbers that start and end with 1, each other entry the sum of the two above it; entry k of row n is a number of orders.', 'Row 4 is 1 4 6 4 1, so 2 successes in 4 trials have 6 orders.'],
  ['binomial distribution', 'q20', 'The distribution of the number of successes in a fixed number of independent trials with the same probability of success.', 'The number of sprouts among 5 seeds, each sprouting with probability 0.7.', ['binomial']],
  /* q21–q30 (missions-c.js) */
  ['geometric distribution', 'q22', 'The distribution of the number of the trial on which the first success comes, when independent trials repeat with the same chance p.', 'With p = 0.2, the first success comes on trial 3 with chance 0.8² × 0.2 = 0.128.'],
  ['Poisson distribution', 'q24', 'The distribution of the number of rare, independent events in a fixed stretch of time or space, where λ is the expected count in that stretch.', 'With 2 pings a minute, λ = 2 for one minute and P(exactly 1 ping) = 2 × e^(−2) ÷ 1! ≈ 0.2707.'],
  ['λ', 'q24', 'The Greek letter lambda, used for the expected number of events in the stretch of a Poisson distribution: the rate times the length of the stretch.', 'At 0.5 events a minute, 6 minutes give λ = 0.5 × 6 = 3.'],
  ['factorial', 'q24', 'For a whole number k, written k!, the product k × (k − 1) × … × 1 of the whole numbers from k down to 1, with 0! = 1.', '4! = 4 × 3 × 2 × 1 = 24.'],
  ['continuous random variable', 'q25', 'A random variable that can take any value in a range, such as a time or a length, rather than only separate values.', 'A waiting time of 14.53 minutes.'],
  ['density curve', 'q25', 'A graph for a continuous random variable with total area 1 under it, where the area over an interval is the probability of landing in it.', 'A flat line at height 0.05 from 10 to 30.'],
  ['uniform distribution', 'q25', 'A distribution where every value from a to b is equally likely, so its density curve is flat at height 1 ÷ (b − a).', 'Uniform from 0 to 8: P(2 < X < 5) = 3 ÷ 8.'],
  ['percentile', 'q26', 'The kth percentile is the value with k% of the probability, or of the data, below it.', 'Uniform from 0 to 10: the 30th percentile is 3.'],
  ['exponential distribution', 'q27', 'The distribution of a waiting time or lifetime with decay rate m, where P(X > x) = e^(−mx) and the mean is 1 ÷ m.', 'With m = 0.05 per hour the mean life is 20 hours.'],
  ['decay rate', 'q27', 'The number m of an exponential distribution: the height where its density curve starts, equal to 1 ÷ the mean.', 'A mean life of 40 hours means a decay rate of 0.025 per hour.'],
  ['memoryless', 'q28', 'Describing a waiting time whose chances ahead do not depend on how long you have already waited, as for an exponential distribution.', 'P(X > 15 | X > 5) = P(X > 10).'],
  ['normal distribution', 'q30', 'A symmetric, bell-shaped distribution fixed by its mean μ and standard deviation σ, with most values near the mean.', 'Bolt lengths with μ = 50 mm and σ = 0.4 mm.'],
  ['bell curve', 'q30', 'The density curve of a normal distribution: highest at the mean and falling away evenly on both sides.', 'Bolt lengths pile up in a bell curve around the target.'],
  ['empirical rule', 'q30', 'For a normal distribution, about 68% of values lie within 1σ of the mean, 95% within 2σ and 99.7% within 3σ.', 'From μ − σ to μ + 2σ: 34% + 34% + 13.5% = 81.5%.'],
  /* q31–q40 (missions-d.js) */
  ['z-score', 'q31', 'How many standard deviations a value lies above or below the mean: z = (x − μ) ÷ σ, negative below the mean.', 'With μ = 40 and σ = 0.5, the value 41.2 has z = 2.4.'],
  ['standard normal distribution', 'q31', 'The normal distribution with mean 0 and standard deviation 1, written Z; z-scores turn any normal distribution into it.', 'P(Z < 0) = 0.5, half the area.', ['standard normal']],
  ['normal table', 'q32', 'A table that lists z to 2 decimal places beside the area under the standard normal curve to the left of z.', 'The row 1.30 → 0.9032 says P(Z < 1.30) = 0.9032.'],
  ['sample mean', 'q37', 'The average of n readings in a sample, written X̄; it is a random variable with mean μ and standard error σ ÷ √n.', 'Readings 4, 6 and 8 have sample mean 18 ÷ 3 = 6.'],
  ['standard error', 'q37', 'The standard deviation of a sample mean or sample proportion: σ ÷ √n for a mean, √(pq ÷ n) for a proportion.', 'With σ = 6 and n = 9, the standard error is 6 ÷ 3 = 2.'],
  ['law of large numbers', 'q37', 'The rule that the mean of more and more independent readings settles ever closer to the true mean μ.', 'The share of heads in 10000 tosses is very close to 0.5.'],
  ['Central Limit Theorem', 'q38', 'For many independent values, the sample mean is close to normal with mean μ and standard error σ ÷ √n; how many is enough depends on how lopsided single values are.', 'The mean of 81 lopsided rainfall readings is close to normal, so a normal table gives a good estimate of its chances.'],
  ['normal approximation', 'q39', 'Using a normal curve with mean np and standard deviation √(npq) in place of a binomial distribution when np and nq are at least 5.', '100 coin tosses: about normal with mean 50 and standard deviation 5.'],
  ['continuity correction', 'q39', 'Moving a cut-off by half a step when a normal curve stands in for whole-number counts: at least k starts at k − 0.5.', 'P(X ≥ 58) is found from the area to the right of 57.5.'],
  ['sample proportion', 'q40', 'The share of successes in a sample, p̂ = X ÷ n; for a large n it is close to normal with mean p and standard error √(pq ÷ n).', '59 red seeds out of 100 give p̂ = 0.59.'],
 ]
};
})();
