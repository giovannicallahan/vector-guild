/* Data and inference glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['stats'] = {
 required: ['sample', 'median', 'quartile', 'outlier', 'sample standard deviation', 'confidence interval', 'margin of error', 'degrees of freedom', 'null hypothesis', 'p-value', 'significance level', 'chi-square', 'correlation coefficient', 'residual'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['data', 'q01', 'The readings or facts collected about something, such as counts, weights or times.', 'The daily check-up counts 3, 0, 2, 4 are data.'],
  ['variable', 'q01', 'The quantity being measured or recorded, which can change from one reading to the next.', 'The number of check-ups in a day is a variable.'],
  ['population', 'q01', 'The whole group a question is about, of which usually only a part can be measured.', 'Every day the clinic will ever be open.'],
  ['sample', 'q01', 'The part of a population that is actually measured or recorded, used to learn about the whole.', '25 logged days out of all the clinic’s days.'],
  ['frequency', 'q01', 'The number of times a value or class occurs in a data set.', 'If 8 of the days had 2 check-ups, the frequency of 2 is 8.', ['frequencies']],
  ['frequency table', 'q01', 'A table that lists each value or class of the data beside its frequency.', 'Check-ups 0, 1, 2 with days 3, 6, 8.'],
  ['relative frequency', 'q01', 'A frequency divided by the total number of readings: the share of the data in that class.', '8 days out of 25: 8 ÷ 25 = 0.32.', ['relative frequencies']],
  ['cumulative relative frequency', 'q01', 'The sum of the relative frequencies of a class and of every class before it in the table.', '0.12 + 0.24 + 0.32 = 0.68 for 2 check-ups or fewer.', ['cumulative relative frequencies']],
  ['sample mean', 'q02', 'The sum of a sample’s readings divided by how many there are, written x̄ = Σx ÷ n.', '(10 + 12 + 9 + 13) ÷ 4 = 11.', ['x-bar']],
  ['median', 'q03', 'The middle value of data put in order, or halfway between the two middle values when the count is even.', 'For 19, 22, 23, 26 the median is (22 + 23) ÷ 2 = 22.5.'],
  ['mode', 'q03', 'The value that occurs most often in a data set.', 'In 4, 7, 7, 9 the mode is 7.'],
  ['weighted mean', 'q04', 'A mean in which each value counts as many times as its frequency, or its weight, says.', '(3 × 4 + 4 × 6) ÷ 10 = 3.6.'],
  ['percentile', 'q05', 'A value with a stated percentage of the ordered data at or below it.', 'About 25% of the readings are at or below the 25th percentile.'],
  ['quartile', 'q05', 'One of the three values Q1, the median and Q3 that cut ordered data into four parts.', 'Q1 is the median of the lower half of the data.'],
  ['interquartile range', 'q06', 'The third quartile minus the first, Q3 − Q1: the width of the middle half of the data.', 'Q1 = 35 and Q3 = 44 give IQR = 9.', ['IQR']],
  ['five-number summary', 'q06', 'The minimum, Q1, the median, Q3 and the maximum of a data set.', '31, 35, 40, 44, 62.'],
  ['box plot', 'q06', 'A picture of the five-number summary: a box from Q1 to Q3 with a line at the median, and whiskers to the ends.', 'A box from 35 to 44 with a line at 40.', ['box-and-whisker plot']],
  ['outlier', 'q06', 'A reading below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR, far from the rest and worth checking.', 'With fences 21.5 and 57.5, the reading 62 is an outlier.'],
  ['fence', 'q06', 'One of the two cut-offs Q1 − 1.5 × IQR and Q3 + 1.5 × IQR beyond which a reading counts as an outlier.', 'Q3 = 44 and IQR = 9 give the upper fence 44 + 13.5 = 57.5.'],
  ['deviation', 'q07', 'How far a reading is from the mean, x − x̄: positive above the mean and negative below it.', 'A reading of 9 with mean 12 has deviation −3.'],
  ['sample variance', 'q07', 'The sum of the squared deviations of a sample divided by n − 1, written s².', 'Squares adding up to 54 over 5 readings: s² = 54 ÷ 4 = 13.5.'],
  ['standard deviation', 'q07', 'A measure of spread: the square root of the variance, roughly the typical distance of a reading from the mean.', 'A variance of 16 gives a standard deviation of 4.'],
  ['sample standard deviation', 'q07', 'The square root of the sample variance, written s: the typical distance of a sample reading from x̄.', 's = √13.5 ≈ 3.67.'],
  ['symmetric', 'q08', 'Describing data whose two sides match around the middle, so that the mean and the median are about equal.', '2, 4, 6, 8, 10 is symmetric about 6.'],
  ['skewed', 'q08', 'Describing data with a long tail on one side; the tail pulls the mean away from the median towards it.', 'Times 6, 7, 8, 8, 9, 10, 22 are skewed to the right.', ['skew', 'skewness']],
  ['z-score', 'q08', 'The number of standard deviations a reading lies from the mean: z = (x − x̄) ÷ s.', '(22 − 10) ÷ 5.45 ≈ 2.2.', ['z-scores']],
  ['simple random sample', 'q09', 'A sample chosen so that every group of that size in the population has the same chance of being picked.', 'Drawing 10 names from a well-mixed drum of every crew name.'],
  ['systematic sample', 'q09', 'A sample taken from a numbered list by starting at a random place and then taking every kth name.', 'Start at 3 with step 8: numbers 3, 11, 19 and so on.'],
  ['stratified sample', 'q09', 'A sample made by splitting the population into groups and taking a random share from each, in proportion to its size.', '5, 3 and 2 from domes of 40, 24 and 16.'],
  ['stratum', 'q09', 'One of the groups a population is split into for a stratified sample.', 'Each dome of the outpost is a stratum.', ['strata']],
  ['convenience sample', 'q09', 'A sample of whoever is easiest to reach, which may not represent the population fairly.', 'Asking only the crew who are in the canteen.'],
  ['parameter', 'q09', 'A number that describes a whole population, such as its mean μ.', 'The share of all the crew who like the menu.'],
  ['statistic', 'q09', 'A number worked out from a sample, such as its mean x̄, often used to estimate a parameter.', 'The share of the 10 sampled crew who like the menu.', [], 'statistics'],
  ['sampling variability', 'q10', 'The way a statistic such as x̄ changes from one sample to the next.', 'Two samples of 49 readings give means 31.2 and 30.6.'],
  ['standard error', 'q10', 'The standard deviation of a sample mean from sample to sample, σ ÷ √n.', 'σ = 7.4 and n = 49 give 7.4 ÷ 7 ≈ 1.06.'],
  /* q11–q20 (missions-b.js) */
  ['point estimate', 'q12', 'A single number from a sample used as the best guess for an unknown population value.', 'A sample mean of 47.3 g/kg is a point estimate of the seam’s mean.'],
  ['confidence level', 'q12', 'The share of all samples for which an interval method catches the true value, such as 90%, 95% or 99%.', 'At a 95% confidence level, 95 samples in 100 give an interval that holds μ.'],
  ['margin of error', 'q12', 'How far an estimate may be from the true value at a chosen confidence level: a critical value times a standard error.', '1.96 × 3 = 5.88, so the margin of error is 5.88 g/kg.'],
  ['critical value', 'q12', 'The number of standard errors, z* or t*, that leaves the chosen middle share of the curve between −z* and z*.', 'For 95% confidence the critical value is z* = 1.96.'],
  ['confidence interval', 'q13', 'The range from an estimate minus its margin of error to the estimate plus it.', 'x̄ = 52.4 and a margin of 2.35 give the interval 50.05 to 54.75.'],
  ['Student’s t distribution', 'q14', 'A curve like the standard normal but with thicker tails, used for critical values when σ is unknown and s is used.', 'With 11 degrees of freedom the 95% critical value is t* = 2.201.', ['t distribution', 'Student’s t']],
  ['degrees of freedom', 'q14', 'The number that picks which t distribution to use; for one sample of n readings it is n − 1.', 'A sample of 12 lumps has 11 degrees of freedom.'],
  ['sample proportion', 'q16', 'The share of a sample with some feature, written p̂: the number with it divided by the sample size.', '72 cores with a vein out of 200 give p̂ = 0.36.'],
  ['hypothesis test', 'q18', 'A way to decide whether a sample gives strong enough evidence against a claim to reject it.', 'Testing a supplier’s claimed mean of 300 hours against a sample of filters.'],
  ['null hypothesis', 'q18', 'The claim a test starts from, written H₀; it always contains an equals sign: =, ≥ or ≤.', 'H₀: μ ≥ 300 for a claim of at least 300 hours.'],
  ['alternative hypothesis', 'q18', 'What a test looks for evidence of instead of the claim, written Hₐ; it uses <, > or ≠.', 'Hₐ: μ < 300 when the filters are suspected of failing early.'],
  ['left-tailed test', 'q18', 'A test whose alternative hypothesis says μ is less than the claimed value.', 'Hₐ: μ < 40 litres gives a left-tailed test.', ['left-tailed']],
  ['right-tailed test', 'q18', 'A test whose alternative hypothesis says μ is more than the claimed value.', 'Hₐ: μ > 9 days gives a right-tailed test.', ['right-tailed']],
  ['two-tailed test', 'q18', 'A test whose alternative hypothesis says μ is different from the claimed value, in either direction.', 'Hₐ: μ ≠ 85 mm gives a two-tailed test.', ['two-tailed']],
  ['Type I error', 'q19', 'Rejecting the null hypothesis when it is in fact true: a false alarm.', 'Accusing an honest supplier whose batches meet the claim.'],
  ['Type II error', 'q19', 'Not rejecting the null hypothesis when it is in fact false: a miss.', 'Letting a batch through that really is short.'],
  ['significance level', 'q19', 'The chance of a Type I error that a test allows, written α and chosen before the test, often 0.05.', 'At α = 0.05, about 5 in 100 tests of a true H₀ reject it.'],
  ['power', 'q19', 'The chance that a test rejects the null hypothesis when it really is false: 1 − β.', 'A test that misses 18% of short batches has power 0.82.', [], 'power output|solar|kilowatt|watt|power (?:cell|line|plant|station|supply)'],
  ['test statistic', 'q20', 'A number worked out from the sample that says how far it lies from the null hypothesis, such as z = (x̄ − μ₀) ÷ (σ ÷ √n).', 'x̄ − μ₀ = −3.7 and a standard error of 2 give z = −1.85.'],
  /* q21–q30 (missions-c.js) */
  ['p-value', 'q21', 'The chance, if the null hypothesis is true, of a sample result at least as extreme as the one observed, in the direction the alternative points.', 'A right-tailed test with z = 2.12 has p-value 1 − 0.9830 = 0.0170.'],
  ['reject', 'q21', 'To decide against the null hypothesis because the p-value is less than the significance level α.', 'A p-value of 0.0170 at α = 0.05 means we reject H₀.', ['rejecting', 'rejected']],
  ['two-sample t test', 'q24', 'A test of whether two independent groups share one mean, using t = (x̄₁ − x̄₂) ÷ √(s₁² ÷ n₁ + s₂² ÷ n₂).', 'Separate plots for the new and the old seed call for a two-sample t test.'],
  ['independent samples', 'q24', 'Samples chosen separately, so that the values in one tell you nothing about the values in the other.', 'Plots sown with the new seed and other plots sown with the old seed.'],
  ['pooled proportion', 'q25', 'The share of successes in two samples put together: all the successes divided by all the trials.', '62 of 100 and 50 of 100 pool to 112 ÷ 200 = 0.56.'],
  ['matched pair', 'q26', 'Two measurements taken on the same unit, such as one plot in two seasons, and kept together.', 'A plot that yields 30 kg with the old seed and 32 kg with the new is one matched pair.'],
  ['paired difference', 'q26', 'The difference within one matched pair, taken in the same order for every pair; the differences become the data of the test.', 'Old 30 kg and new 32 kg give the paired difference 2 kg.'],
  ['chi-square', 'q27', 'The statistic χ² = Σ(O − E)² ÷ E, which measures how far observed counts are from expected counts; 0 is a perfect fit.', 'Counts 52, 35, 13 against 60, 30, 10 give χ² = 2.80.', ['chi-squared']],
  ['observed count', 'q27', 'The number of items actually seen in one category of a sample, written O.', '52 large seeds in the sample is the observed count for large.'],
  ['expected count', 'q27', 'The number of items a category should hold if the null hypothesis is true, written E.', 'A claim of 60% large in a sample of 100 gives an expected count of 60.'],
  ['goodness of fit', 'q27', 'A chi-square test of whether the counts in one list of categories fit claimed shares, with df = k − 1.', 'Checking a sack’s seed sizes against its label is a goodness-of-fit test.', ['goodness-of-fit']],
  ['test of independence', 'q28', 'A chi-square test of whether the two ways a two-way table sorts its items are unrelated.', 'Seed type against harvest grade calls for a test of independence.'],
  ['scatter plot', 'q30', 'A graph that shows each pair of values (x, y) as one point.', 'Five days of sunlight and output make five points on a scatter plot.'],
  ['correlation coefficient', 'q30', 'A number r from −1 to 1 that measures how closely paired data follow a straight line, and in which direction.', 'r = 0.84 means a strong rising straight-line pattern.'],
  ['linear relationship', 'q30', 'A pattern in paired data whose points lie close to a straight line, rising or falling.', 'More sunlight going with steadily more output.'],
  /* q31–q40 (missions-d.js) */
  ['least-squares line', 'q31', 'The straight line ŷ = a + bx that makes the sum of the squared vertical misses from the points as small as possible.', 'ŷ = 3.6 + 3.2x through five days of sunlight and output.', ['best-fit line', 'regression line']],
  ['slope', 'q31', 'In ŷ = a + bx, the number b: how much the predicted y rises for each extra unit of x.', 'A slope of 3.2 means 3.2 more kWh for each extra hour of sun.'],
  ['intercept', 'q31', 'In ŷ = a + bx, the number a: the value the line gives when x is 0.', 'ŷ = 3.6 + 3.2x has intercept 3.6.'],
  ['predicted value', 'q32', 'The value ŷ that a fitted line gives for a chosen x.', 'ŷ = 4.5 + 2.8 × 12 = 38.1 is the predicted value at x = 12.'],
  ['residual', 'q32', 'The observed y minus the value ŷ the line predicts for the same x: how far the point sits above or below the line.', 'A day with 25 kWh where the line predicts 24.1 has residual 0.9.'],
  ['interpolation', 'q32', 'Using a fitted line to predict for an x inside the range of x values in the data.', 'Predicting at 8 hours from a line fitted to 3 to 10 hours.'],
  ['extrapolation', 'q32', 'Using a fitted line to predict for an x outside the range of x values in the data, which can be badly wrong.', 'Predicting at 12 hours from a line fitted to 3 to 10 hours.'],
  ['coefficient of determination', 'q33', 'The square r² of the correlation coefficient: the share of the variation in y that the best-fit line explains.', 'r = −0.9 gives r² = 0.81, so 81% is explained.'],
  ['ANOVA', 'q35', 'Analysis of variance: a test of whether several group means are equal, by comparing variation between and within groups.', 'Three seed varieties’ mean yields compared at once.', ['analysis of variance']],
  ['grand mean', 'q35', 'The mean of every reading in all the groups taken together.', 'Groups with means 13, 17 and 12, all of size 4, have grand mean 14.'],
  ['sum of squares', 'q35', 'A total of squared distances, used to measure variation between groups or within them.', '(13 − 14)² + (17 − 14)² = 1 + 9 = 10.'],
  ['mean square', 'q36', 'A sum of squares divided by its degrees of freedom: an average squared variation.', '96 between groups on 2 df gives a mean square of 48.'],
  ['F ratio', 'q36', 'The mean square between groups divided by the mean square within groups; large values reject equal means.', '48 ÷ 11 = 4.36.', ['F-ratio']],
  ['F distribution', 'q36', 'The distribution an F ratio follows when all the group means are equal; it depends on two degrees of freedom.', 'F(2, 12) has 5% of its area to the right of 3.89.']
 ]
};
})();
