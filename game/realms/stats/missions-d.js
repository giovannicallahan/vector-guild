/* Data and inference missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/stats/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Relationships · Advanced, 200 XP · sector 'Solar Farm' · The least-squares line: slope and intercept [12.3]
     q32  ch 6 Relationships · Advanced, 200 XP · sector 'Solar Farm' · Prediction, residuals and extrapolation [12.3, 12.5]
     q33  ch 6 Relationships · Advanced, 200 XP · sector 'Solar Farm' · r²: the share of variation explained [12.3]
     q34  ch 6 Relationships · Advanced, 200 XP · sector 'Solar Farm' · Testing r, and outliers from a line [12.4, 12.6]
     q35  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · One-way ANOVA: variation between and within groups [13.1, 13.2]
     q36  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · The F ratio and the decision [13.2]
     q37  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · Testing a single variance [11.6]
     q38  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · Intervals and tests agree [9.4, 8.1]
     q39  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · Choosing the right test [9.5]
     q40  ch 7 Many groups and the right test · Advanced, 200 XP · sector 'Council Chamber' · Realm review and bridge: a full study from sample to conclusion [9.5] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections cited below. Each page was opened on 2026-11-27 and the idea checked on it. */
const source = {
 s8_1: { title: "OpenStax Introductory Statistics 2e — 8.1 A Single Population Mean using the Normal Distribution", url: "https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution", description: "A confidence interval for a mean as the sample mean plus or minus the error bound z × σ ÷ √n, and what the confidence level means.", verified: '2026-11-27' },
 s9_4: { title: "OpenStax Introductory Statistics 2e — 9.4 Rare Events, the Sample, Decision and Conclusion", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-4-rare-events-the-sample-decision-and-conclusion", description: "The p-value, the decision rule (reject H₀ when the p-value is below α) and writing the conclusion in context.", verified: '2026-11-27' },
 s9_5: { title: "OpenStax Introductory Statistics 2e — 9.5 Additional Information and Full Hypothesis Test Examples", url: "https://openstax.org/books/introductory-statistics-2e/pages/9-5-additional-information-and-full-hypothesis-test-examples", description: "Full tests worked step by step, and how to choose the normal, Student’s t or proportion distribution for one sample.", verified: '2026-11-27' },
 s11_6: { title: "OpenStax Introductory Statistics 2e — 11.6 Test of a Single Variance", url: "https://openstax.org/books/introductory-statistics-2e/pages/11-6-test-of-a-single-variance", description: "The chi-square statistic (n − 1)s² ÷ σ² with df = n − 1 for a claim about a population variance, assuming a normal population; left-, right- and two-tailed tests.", verified: '2026-11-27' },
 s12_3: { title: "OpenStax Introductory Statistics 2e — 12.3 The Regression Equation", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-3-the-regression-equation", description: "The least-squares line ŷ = a + bx, its slope and intercept, residuals, the coefficient of determination r², and a warning against predicting outside the data.", verified: '2026-11-27' },
 s12_4: { title: "OpenStax Introductory Statistics 2e — 12.4 Testing the Significance of the Correlation Coefficient", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-4-testing-the-significance-of-the-correlation-coefficient", description: "Testing whether the population correlation ρ is 0 by comparing r with the 95% critical value for df = n − 2.", verified: '2026-11-27' },
 s12_5: { title: "OpenStax Introductory Statistics 2e — 12.5 Prediction", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-5-prediction", description: "Predicting y from the regression line, and the difference between interpolation and extrapolation.", verified: '2026-11-27' },
 s12_6: { title: "OpenStax Introductory Statistics 2e — 12.6 Outliers", url: "https://openstax.org/books/introductory-statistics-2e/pages/12-6-outliers", description: "Flagging points more than two standard deviations s from the best-fit line, with s worked from the residuals and n − 2; the table of 95% critical values of r.", verified: '2026-11-27' },
 s13_1: { title: "OpenStax Introductory Statistics 2e — 13.1 One-Way ANOVA", url: "https://openstax.org/books/introductory-statistics-2e/pages/13-1-one-way-anova", description: "What one-way ANOVA tests (whether several group means are equal), its hypotheses and its assumptions.", verified: '2026-11-27' },
 s13_2: { title: "OpenStax Introductory Statistics 2e — 13.2 The F Distribution and the F-Ratio", url: "https://openstax.org/books/introductory-statistics-2e/pages/13-2-the-f-distribution-and-the-f-ratio", description: "Sums of squares between and within groups, their df k − 1 and n − k, mean squares, and the always right-tailed F ratio.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "Drawing the sunlight line", topic: "The least-squares line: slope and intercept", tier: 'Advanced', sector: "Solar Farm",
  brief: "Mira wants a rule that turns tomorrow’s forecast hours of sunlight into an expected power output, drawn as fairly as possible through the farm’s records.",
  lesson: "The least-squares line ŷ = a + bx has slope b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² and passes through the point (x̄, ȳ), so a = ȳ − b × x̄.",
  prompt: "The solar farm logged five days. Hours of sunlight x: 5, 6, 7, 8, 9. Power output y in kilowatt-hours (kWh): 20, 22, 27, 28, 33. Find the least-squares line ŷ = a + bx. Enter the slope b, then the intercept a. Both come out exact, with at most one decimal place.",
  answer: [3.2,3.6], labels: ["slope b","intercept a"], tolerance: 0.01,
  hints: [
   "First find the mean hours x̄ and the mean output ȳ. Then list each day’s x − x̄ and y − ȳ.",
   "The slope is b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)², and the intercept is a = ȳ − b × x̄, because the line passes through the point (x̄, ȳ)."
  ],
  solution: "x̄ = 35 ÷ 5 = 7 and ȳ = 130 ÷ 5 = 26. The deviations x − x̄ are −2, −1, 0, 1, 2, and y − ȳ are −6, −4, 1, 2, 7. Their products are 12, 4, 0, 2, 14, so Σ(x − x̄)(y − ȳ) = 32, and Σ(x − x̄)² = 4 + 1 + 0 + 1 + 4 = 10. The slope is b = 32 ÷ 10 = 3.2 kWh per hour of sunlight. The intercept is a = 26 − 3.2 × 7 = 26 − 22.4 = 3.6. The line is ŷ = 3.6 + 3.2x.",
  xp: 200, prereqs: ["q30"],
  artifact: { name: "The sunlight rule", description: "A straight line through five days of records that turns hours of sun into kilowatt-hours." },
  sources: [source.s12_3],
  teaching: {
   intuition: "A scatter plot of the farm’s days shows the points drifting upwards: more sunlight, more power. To predict, we want one straight line through the middle of the cloud of points. Many lines look reasonable, so we pick the one that misses the points least. For each point, the vertical miss is the gap between its real y and the height of the line at its x. The least-squares line is the line that makes the sum of the squared misses as small as possible. It is written ŷ = a + bx. The symbol ŷ, read “y-hat”, is the value the line predicts. The number b is the slope: how much ŷ rises for each extra unit of x. The number a is the intercept: the value of ŷ when x is 0. The slope is built from the same sums as the correlation coefficient (Σ, capital sigma, means “add up”), and the line always passes through the point of means (x̄, ȳ).",
   steps: [
    "Find the means x̄ and ȳ.",
    "For every point, find x − x̄ and y − ȳ, multiply them, and add the products: Σ(x − x̄)(y − ȳ).",
    "Square each x − x̄ and add the squares: Σ(x − x̄)².",
    "The slope is b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)².",
    "The intercept is a = ȳ − b × x̄, because the line passes through (x̄, ȳ). Write the line as ŷ = a + bx."
   ],
   example: {
    prompt: "Five days had 2, 3, 4, 5 and 6 hours of sunlight and produced 5, 9, 10, 14 and 17 kWh. Find the least-squares line.",
    steps: [
     "x̄ = 20 ÷ 5 = 4 and ȳ = 55 ÷ 5 = 11.",
     "x − x̄ is −2, −1, 0, 1, 2 and y − ȳ is −6, −2, −1, 3, 6. The products are 12, 2, 0, 3, 12, so Σ(x − x̄)(y − ȳ) = 29, and Σ(x − x̄)² = 10.",
     "b = 29 ÷ 10 = 2.9 and a = 11 − 2.9 × 4 = 11 − 11.6 = −0.6."
    ],
    answer: "ŷ = −0.6 + 2.9x: slope 2.9 kWh per hour of sunlight, intercept −0.6 kWh."
   },
   pitfalls: [
    "Swapping x and y. The slope divides by the spread of x, the variable you predict from, not the spread of y.",
    "Working out a with a rounded slope. Keep b exact until a is found.",
    "Reading the intercept as a real day. x = 0 hours may lie far outside the data, so a is often just where the line meets the axis."
   ]
  },
  guidance: [
   { prompt: "Add the hours and the outputs, and divide each total by 5. What are the mean hours x̄ and the mean output ȳ?", answer: [7,26], labels: ["x̄ (hours)","ȳ (kWh)"], explanation: "x̄ = (5 + 6 + 7 + 8 + 9) ÷ 5 = 35 ÷ 5 = 7 and ȳ = (20 + 22 + 27 + 28 + 33) ÷ 5 = 130 ÷ 5 = 26." },
   { prompt: "The deviations x − x̄ are −2, −1, 0, 1, 2, and y − ȳ are −6, −4, 1, 2, 7. What are Σ(x − x̄)(y − ȳ) and Σ(x − x̄)²?", answer: [32,10], labels: ["Σ(x − x̄)(y − ȳ)","Σ(x − x̄)²"], explanation: "Multiply the deviations day by day: 12, 4, 0, 2, 14. They add to 32. The squares of x − x̄ are 4, 1, 0, 1, 4, which add to 10." },
   { prompt: "Divide to get the slope b, then use a = ȳ − b × x̄. What are b and a?", answer: [3.2,3.6], labels: ["slope b","intercept a"], explanation: "b = 32 ÷ 10 = 3.2 and a = 26 − 3.2 × 7 = 3.6, so ŷ = 3.6 + 3.2x." }
  ]
 },
 {
  id: 'q32', title: "Forecasting a cloudless day", topic: "Prediction, residuals and extrapolation", tier: 'Advanced', sector: "Solar Farm",
  brief: "The grid planners want a power forecast for a new day, and the farm manager wants to know whether one recorded day did better or worse than expected.",
  lesson: "The line predicts ŷ = a + bx; a residual is y − ŷ; predicting inside the range of the data’s x values is interpolation, and outside it extrapolation.",
  prompt: "The solar farm’s least-squares line is ŷ = 4.5 + 2.8x, where x is the hours of sunlight in a day and ŷ is the predicted power output in kWh. It was fitted to days with 3 to 10 hours of sunlight. Enter the predicted output for a new day with 12 hours of sunlight, then the residual for a recorded day that had 7 hours of sunlight and produced 25 kWh, then 1 if the prediction at 12 hours is an interpolation (inside the fitted range) or 0 if it is an extrapolation (outside it).",
  answer: [38.1,0.9,0], labels: ["predicted output (kWh)","residual (kWh)","1 interpolation, 0 extrapolation"], tolerance: 0.01,
  hints: [
   "To predict, put the hours into the line: ŷ = a + b × x.",
   "A residual is the observed y minus the predicted ŷ for the same x. A prediction is an interpolation when its x lies between the smallest and the largest x in the data, and an extrapolation when it lies outside."
  ],
  solution: "ŷ = 4.5 + 2.8 × 12 = 4.5 + 33.6 = 38.1 kWh. For the recorded day, ŷ = 4.5 + 2.8 × 7 = 4.5 + 19.6 = 24.1 kWh, so the residual is 25 − 24.1 = 0.9 kWh: the day produced more than the line predicts. 12 hours lies outside the fitted range from 3 to 10 hours, so the prediction is an extrapolation: enter 0. Nobody has checked the line there, so trust it less.",
  xp: 200, prereqs: ["q31"],
  artifact: { name: "Forecast card", description: "One prediction, one residual, and a note on whether the line was used where it was fitted." },
  sources: [source.s12_3, source.s12_5],
  teaching: {
   intuition: "Once a line is fitted, it does two jobs. First it predicts: put a value of x into ŷ = a + bx, and the result ŷ is the predicted value of y. Second, it shows how far each real point sits from the line. That gap, the observed y minus the predicted ŷ for the same x, is called the residual. A positive residual means the point lies above the line, a negative one below it. A residual is not a mistake: it is the part of y that the line does not capture. Predictions also need care about where x lies. The line was fitted only to the x values in the data. A prediction for an x inside that range is an interpolation, and is fairly safe. A prediction outside it is an extrapolation: nobody has checked that the straight-line pattern carries on out there, so it can be badly wrong.",
   steps: [
    "To predict, put the x value into ŷ = a + bx.",
    "For a recorded point, work out ŷ at its x, then the residual y − ŷ: observed minus predicted.",
    "Compare the new x with the smallest and the largest x in the data: inside that range is interpolation, outside it is extrapolation.",
    "Treat an extrapolation with suspicion. The further outside the range, the less it can be trusted."
   ],
   example: {
    prompt: "A line ŷ = 2 + 1.5x was fitted to days with 2 to 8 hours of sunlight. Predict the output at 6 hours, and find the residual of a recorded day with 4 hours and 7.5 kWh.",
    steps: [
     "ŷ = 2 + 1.5 × 6 = 2 + 9 = 11 kWh. 6 lies between 2 and 8, so this is an interpolation.",
     "For the recorded day, ŷ = 2 + 1.5 × 4 = 8, so the residual is 7.5 − 8 = −0.5 kWh: the day lies just below the line."
    ],
    answer: "Predicted 11 kWh (an interpolation); residual −0.5 kWh."
   },
   pitfalls: [
    "Taking the residual the wrong way round. It is observed minus predicted, y − ŷ, so a point above the line has a positive residual.",
    "Trusting an extrapolation because the arithmetic is easy. The line says nothing about x values the data never reached.",
    "Treating one day’s residual as the error of the whole line. Each point has its own residual."
   ]
  },
  guidance: [
   { prompt: "Put x = 12 into ŷ = 4.5 + 2.8x. What output does the line predict?", answer: [38.1], labels: ["predicted output (kWh)"], explanation: "2.8 × 12 = 33.6, and 4.5 + 33.6 = 38.1 kWh." },
   { prompt: "The recorded day had x = 7 and y = 25. What is the predicted ŷ for that day, and the residual y − ŷ?", answer: [24.1,0.9], labels: ["ŷ for the recorded day (kWh)","residual (kWh)"], explanation: "ŷ = 4.5 + 2.8 × 7 = 24.1, and the residual is observed minus predicted: 25 − 24.1 = 0.9." },
   { prompt: "The line was fitted to days with 3 to 10 hours of sunlight. Enter 1 if 12 hours is inside that range (interpolation), 0 if it is outside (extrapolation).", answer: [0], labels: ["1 inside, 0 outside"], explanation: "12 is not between 3 and 10, so this is an extrapolation." }
  ]
 },
 {
  id: 'q33', title: "How much the sunlight explains", topic: "r²: the share of variation explained", tier: 'Advanced', sector: "Solar Farm",
  brief: "Before the council relies on the farm’s straight line, it wants to know how much of the day-to-day swing in power the line actually accounts for.",
  lesson: "r², the square of the correlation coefficient, is the share of the variation in y that the best-fit straight line explains.",
  prompt: "The farm made a scatter plot of the days since the panels were last cleaned and the power output over many days, and found the correlation coefficient r = −0.91. Through these points it has fitted the best-fit straight line, the one whose squared vertical gaps from the points add up to as little as possible. Enter the percentage of the variation in power output that the line explains, then the percentage it leaves unexplained, both rounded to 1 decimal place.",
  answer: [82.8,17.2], labels: ["explained (%)","unexplained (%)"], tolerance: 0.00005,
  hints: [
   "Square r. The square of a negative number is positive.",
   "Multiply r² by 100 to turn it into a percentage. The unexplained share is 100% minus the explained share."
  ],
  solution: "r² = (−0.91)² = 0.8281, which is 82.81% of the variation, or 82.8% to 1 decimal place. The rest, 100 − 82.81 = 17.19%, or 17.2% to 1 decimal place, is variation the line does not explain.",
  xp: 200, prereqs: ["q30"],
  artifact: { name: "Share-of-the-swing gauge", description: "A dial that reads how much of the power’s variation the line accounts for." },
  sources: [source.s12_3],
  teaching: {
   intuition: "Power output varies from day to day. Part of that variation follows the hours of sunlight, and the rest comes from everything else: dust, heat and chance. Through the scatter plot we can fit the best-fit straight line, the one that keeps the squared vertical gaps from the points as small as possible. The coefficient of determination, written r², says what share of the variation in y that line explains. It is simply the correlation coefficient squared. As a percentage, r² = 0.64 means that 64% of the variation in output is explained by the straight-line link with sunlight, and the other 36% is not. Squaring removes the sign, so r = −0.8 explains just as much as r = 0.8; the sign only tells which way the line slopes.",
   steps: [
    "Square the correlation coefficient: r² = r × r. It is never negative.",
    "Multiply by 100 to give the percentage of the variation in y that the line explains.",
    "Subtract from 100% to get the share the line leaves unexplained.",
    "Round only at the end, to the places asked for."
   ],
   example: {
    prompt: "A scatter plot has r = 0.6. What share of the variation does the best-fit line explain, and what share does it leave?",
    steps: [
     "r² = 0.6 × 0.6 = 0.36.",
     "As a percentage that is 36%; the unexplained share is 100 − 36 = 64%."
    ],
    answer: "36% explained and 64% unexplained."
   },
   pitfalls: [
    "Forgetting to square. r = 0.6 does not mean 60% explained; it means 36%.",
    "Giving a negative r² for a negative r. (−0.7)² = 0.49, not −0.49.",
    "Reading a high r² as proof that x causes y. It measures how well a straight line fits, nothing more."
   ]
  },
  guidance: [
   { prompt: "What is r² for r = −0.91? Give it in full.", answer: [0.8281], labels: ["r²"], explanation: "(−0.91) × (−0.91) = 0.8281. Squaring removes the minus sign, if there is one." },
   { prompt: "Multiply r² by 100 and round to 1 decimal place. What percentage of the variation does the line explain?", answer: [82.8], labels: ["explained (%)"], explanation: "0.8281 × 100 = 82.81%, which is 82.8% to 1 decimal place." },
   { prompt: "What percentage of the variation is left unexplained, rounded to 1 decimal place?", answer: [17.2], labels: ["unexplained (%)"], explanation: "100 − 82.81 = 17.19%, which is 17.2% to 1 decimal place." }
  ]
 },
 {
  id: 'q34', title: "Real pattern or lucky days?", topic: "Testing r, and outliers from a line", tier: 'Advanced', sector: "Solar Farm",
  brief: "The council asks whether the farm’s correlation is real or a fluke of a few days, and whether any day stands out from the line.",
  lesson: "r is significant when it lies beyond plus or minus the critical value for df = n − 2, and a point more than 2s from the line is an outlier.",
  prompt: "The farm fitted a least-squares line to n = 10 days, comparing the hours of sunlight in a day and that day’s power output, and found r = 0.71. The 10 residuals, in kWh, are 1.2, −0.8, 0.5, −1.6, 4.6, −1.1, 0.3, −2, −0.4, −0.7. Their standard deviation about the line is s = 2 kWh. Table of 95% critical values of r: df 4, 0.811; df 5, 0.754; df 6, 0.707; df 7, 0.666; df 8, 0.632; df 9, 0.602; df 10, 0.576; df 11, 0.555; df 12, 0.532; df 13, 0.514. Enter the degrees of freedom for testing r, then 1 if r is significant at the 5% level or 0 if not, then the number of days that are outliers by the two-standard-deviation rule (a residual more than 2s from 0, above or below).",
  answer: [8,1,1], labels: ["df","1 significant, 0 not","outliers"], tolerance: 0.0005,
  hints: [
   "For testing r, the degrees of freedom are the number of points minus 2. Read the critical value from that row of the table.",
   "r is significant when it is above the critical value or below its negative. A point is an outlier when its residual is more than 2s above or below 0."
  ],
  solution: "df = 10 − 2 = 8, and the table gives the critical value 0.632 for df 8. r = 0.71 is above 0.632, so r is significant: enter 1. A linear relationship this strong would rarely happen by chance. For outliers, 2s = 2 × 2 = 4 kWh. Only the residual 4.6 is further than 4 from 0, so 1 day is an outlier.",
  xp: 200, prereqs: ["q33","q32"],
  artifact: { name: "Outlier flags", description: "Red pins for the days that sit too far from the line, and a stamp that says the pattern is real." },
  sources: [source.s12_4, source.s12_6],
  teaching: {
   intuition: "A sample correlation can look strong just by luck, especially with few points. The test of r asks whether the straight-line pattern is real in the whole population. Its starting assumption, called the null hypothesis, is that the population correlation, written ρ (the Greek letter rho), is 0: no linear relationship at all. The test uses n − 2 degrees of freedom, a count written df that picks the row of the table; it is n − 2 because the line uses up two numbers, a and b. For each df the table lists a 95% critical value. If r is above it, or below its negative, a correlation that strong would turn up less than 5% of the time if ρ were 0, so r is called significant and we conclude there is a linear relationship. The same line also flags outliers. The residuals have a standard deviation s = √(Σ(y − ŷ)² ÷ (n − 2)), how far points typically sit from the line. A rule of thumb, the two-standard-deviation rule, calls a point an outlier when its residual is more than 2s above or below 0: |residual| > 2s, where |residual| is its size without the sign.",
   steps: [
    "Degrees of freedom: df = n − 2, where n is the number of points.",
    "Read the 95% critical value for that df from the table.",
    "r is significant if r is above the critical value or below its negative; otherwise it is not.",
    "For outliers, double s and count the points whose residual is more than 2s from 0, in either direction."
   ],
   example: {
    prompt: "A line through 12 points has r = −0.81 and s = 1.68. Its residuals are 0.5, −0.7, 1.1, −0.4, 0.9, −1.2, 0.3, −0.6, 4.1, −1, −0.8 and −2.2. The table gives 0.576 for df 10.",
    steps: [
     "df = 12 − 2 = 10, so the critical value is 0.576. r = −0.81 is below −0.576, so r is significant.",
     "2s = 2 × 1.68 = 3.36. Only 4.1 is further than 3.36 from 0."
    ],
    answer: "df 10, r is significant, and 1 point is an outlier."
   },
   pitfalls: [
    "Using n − 1 or n for the degrees of freedom. The test of r uses n − 2.",
    "Comparing a negative r with the positive critical value only. A strong negative correlation is significant when r is below the negative critical value.",
    "Calling a point an outlier when its residual is more than s from 0. The rule is more than 2s."
   ]
  },
  guidance: [
   { prompt: "How many degrees of freedom does the test of r have, and what critical value does the table give for them?", answer: [8,0.632], labels: ["df","critical value"], explanation: "df = 10 − 2 = 8, and the row for df 8 reads 0.632." },
   { prompt: "Compare r = 0.71 with 0.632 and −0.632. Enter 1 if r is significant, 0 if not.", answer: [1], labels: ["1 significant, 0 not"], explanation: "r is above 0.632, so it is significant." },
   { prompt: "What is 2s, and how many residuals are further than 2s from 0?", answer: [4,1], labels: ["2s (kWh)","outliers"], explanation: "2 × 2 = 4. Beyond it in either direction: 4.6." }
  ]
 },
 {
  id: 'q35', title: "Splitting the seed trial’s spread", topic: "One-way ANOVA: variation between and within groups", tier: 'Advanced', sector: "Council Chamber",
  brief: "Three seed varieties have been trialled, and the council wants the spread of the yields split into the part the varieties cause and the part that is ordinary scatter.",
  lesson: "ANOVA splits the spread of all the readings into a sum of squares between groups and a sum of squares within groups.",
  prompt: "The council is choosing between three seed varieties, A, B and C. Each was grown on 4 plots, and the yields in kilograms were: A 12, 14, 15, 11; B 17, 15, 19, 17; C 10, 13, 11, 14. Enter the sum of squares between groups, then the sum of squares within groups.",
  answer: [56,28], labels: ["SS between groups","SS within groups"], tolerance: 0.01,
  hints: [
   "Find each group’s mean and the grand mean of all the readings. Between groups: for each group, square its mean minus the grand mean and multiply by the group’s size, then add.",
   "Within groups: square each reading’s distance from its own group’s mean, then add them all."
  ],
  solution: "The group means are 13, 17, 12, and the grand mean of all 12 yields is 168 ÷ 12 = 14. Between groups: 4 × (13 − 14)² + 4 × (17 − 14)² + 4 × (12 − 14)² = 4 + 36 + 16 = 56. Within groups: A gives 1 + 1 + 4 + 4 = 10, B gives 0 + 4 + 4 + 0 = 8, C gives 4 + 1 + 1 + 4 = 10, so 28 in all. Check: the total sum of squares about the grand mean is 56 + 28 = 84.",
  xp: 200, prereqs: ["q24"],
  artifact: { name: "The split ledger", description: "One column for the spread between varieties, one for the scatter inside each." },
  sources: [source.s13_1, source.s13_2],
  teaching: {
   intuition: "Three seed varieties give three groups of yields. Are their true mean yields all the same? A two-sample t test compares only two groups, so for three or more we use analysis of variance, ANOVA for short. It splits the spread of all the readings into two parts. Variation between groups is how far the group means sit from the grand mean, the mean of every reading together. Variation within groups is how far the readings sit from their own group’s mean: the ordinary scatter that has nothing to do with which variety was planted. Each part is measured as a sum of squares. Between groups: for each group, (group mean − grand mean)², times the size of the group, added over the groups. Within groups: (reading − its group’s mean)², added over every reading. Together they make the total sum of squares about the grand mean. If the varieties really differ, the between part is large compared with the within part. One-way ANOVA (one factor, here the variety) assumes normal populations with equal spreads, and random, independent samples.",
   steps: [
    "Find the mean of each group, and the grand mean of all the readings together.",
    "Sum of squares between groups: for each group, multiply its size by (group mean − grand mean)², then add.",
    "Sum of squares within groups: for each reading, square its distance from its own group’s mean, then add over all the readings.",
    "Check: between plus within equals the total sum of squares of every reading about the grand mean."
   ],
   example: {
    prompt: "Three groups of 3 readings: A 4, 5, 6; B 7, 9, 8; C 3, 5, 7. Find the two sums of squares.",
    steps: [
     "The group means are 5, 8 and 5, and the grand mean is 54 ÷ 9 = 6.",
     "Between: 3 × (5 − 6)² + 3 × (8 − 6)² + 3 × (5 − 6)² = 3 + 12 + 3 = 18.",
     "Within: A gives 1 + 0 + 1 = 2, B gives 1 + 1 + 0 = 2, C gives 4 + 0 + 4 = 8, so 12 in all."
    ],
    answer: "Between groups 18, within groups 12."
   },
   pitfalls: [
    "Measuring the within-group distances from the grand mean instead of from each group’s own mean.",
    "Forgetting to multiply by the group size in the between-groups sum.",
    "Averaging the group means to get the grand mean when the groups have different sizes. The grand mean is the mean of all the readings; with equal sizes the two agree."
   ]
  },
  guidance: [
   { prompt: "What are the means of groups A, B and C, and the grand mean of all the yields?", answer: [13,17,12,14], labels: ["mean of A","mean of B","mean of C","grand mean"], explanation: "A: 52 ÷ 4 = 13; B: 68 ÷ 4 = 17; C: 48 ÷ 4 = 12. All 12 yields add to 168, and 168 ÷ 12 = 14." },
   { prompt: "For each group, multiply its size by (group mean − grand mean)², and add. What is the sum of squares between groups?", answer: [56], labels: ["SS between groups"], explanation: "4 × (13 − 14)² + 4 × (17 − 14)² + 4 × (12 − 14)² = 4 + 36 + 16 = 56." },
   { prompt: "Square each yield’s distance from its own group’s mean, and add them all. What is the sum of squares within groups?", answer: [28], labels: ["SS within groups"], explanation: "A: 1 + 1 + 4 + 4; B: 0 + 4 + 4 + 0; C: 4 + 1 + 1 + 4. Together they make 28." }
  ]
 },
 {
  id: 'q36', title: "The council’s F verdict", topic: "The F ratio and the decision", tier: 'Advanced', sector: "Council Chamber",
  brief: "The council must decide, from the clerk’s two sums of squares, whether the groups in a trial really differ.",
  lesson: "Divide each sum of squares by its df to get the mean squares; F is the mean square between groups over the mean square within, and a large F rejects equal means.",
  prompt: "The council compared 3 seed varieties on 15 plots in all. The clerk’s ANOVA gives a sum of squares between groups of 96 and a sum of squares within groups of 132. Critical values of F with 5% of the area to their right, written F(df between, df within): F(2, 11) = 3.98, F(2, 12) = 3.89, F(2, 13) = 3.81, F(3, 11) = 3.59, F(3, 12) = 3.49, F(3, 13) = 3.41. Enter the degrees of freedom between groups, then within groups, then the F ratio to 2 decimal places, then 1 if the council should reject the claim that all the means are equal at the 5% level, or 0 if not.",
  answer: [2,12,4.36,1], labels: ["df between","df within","F ratio","1 reject, 0 not"], tolerance: 0.005,
  hints: [
   "Between groups the degrees of freedom are the number of groups minus 1. Within groups they are the number of readings minus the number of groups.",
   "A mean square is a sum of squares divided by its degrees of freedom, and F is the mean square between groups divided by the mean square within. Reject when F is larger than the critical value for your two df."
  ],
  solution: "df between = 3 − 1 = 2 and df within = 15 − 3 = 12. Mean square between = 96 ÷ 2 = 48 and mean square within = 132 ÷ 12 = 11, so F = 48 ÷ 11 = 4.3636…, which is 4.36 to 2 decimal places. The critical value F(2, 12) is 3.89. 4.36 is larger, so the p-value is below 0.05: reject the claim that the means are all equal, and enter 1. At least one of the seed varieties has a different mean.",
  xp: 200, prereqs: ["q35"],
  artifact: { name: "The verdict seal", description: "Stamped on a trial report once its F ratio has been weighed against the table." },
  sources: [source.s13_2, source.s9_4],
  teaching: {
   intuition: "The two sums of squares from ANOVA cannot be compared directly, because they add up different numbers of pieces. Dividing each by its degrees of freedom turns it into a mean square, an average squared variation. With k groups and n readings in all, the df between groups is k − 1 and the df within groups is n − k. The F ratio is F = mean square between ÷ mean square within. If all the true means are equal, both mean squares estimate the same natural scatter, and F should be near 1. If some means differ, the between part swells and F grows. So the test is always right-tailed. The F distribution, which depends on both df, gives a critical value with 5% of the area to its right. An F above that value has a p-value below 0.05, so we reject the null hypothesis that all the means are equal.",
   steps: [
    "df between = k − 1 (k groups) and df within = n − k (n readings in all).",
    "Mean square between = SS between ÷ df between, and mean square within = SS within ÷ df within.",
    "F = mean square between ÷ mean square within.",
    "Find the critical value for the two df, between first. If F is larger, reject H₀ (enter 1); if not, do not reject it (enter 0)."
   ],
   example: {
    prompt: "Four groups, 20 readings in all, a sum of squares of 60 between groups and 80 within. The 5% critical value F(3, 16) is 3.24.",
    steps: [
     "df between = 4 − 1 = 3 and df within = 20 − 4 = 16.",
     "The mean squares are 60 ÷ 3 = 20 and 80 ÷ 16 = 5, so F = 20 ÷ 5 = 4.",
     "4 is larger than 3.24, so reject H₀: at least one mean differs."
    ],
    answer: "df 3 and 16, F = 4, reject (1)."
   },
   pitfalls: [
    "Dividing the two sums of squares by each other before turning them into mean squares.",
    "Swapping the two df when reading the table: the df between groups comes first.",
    "Rejecting when F is small. Only a large F is evidence that the means differ."
   ]
  },
  guidance: [
   { prompt: "What are the degrees of freedom between groups and within groups?", answer: [2,12], labels: ["df between","df within"], explanation: "Between: 3 groups − 1 = 2. Within: 15 readings − 3 groups = 12." },
   { prompt: "Divide each sum of squares by its degrees of freedom. What are the mean square between, the mean square within, and F to 2 decimal places?", answer: [48,11,4.36], labels: ["mean square between","mean square within","F ratio"], explanation: "96 ÷ 2 = 48 and 132 ÷ 12 = 11. F = 48 ÷ 11 = 4.3636…, which is 4.36 to 2 decimal places." },
   { prompt: "The critical value for 2 and 12 degrees of freedom is 3.89. Enter 1 to reject the claim that all the means are equal, 0 not to.", answer: [1], labels: ["1 reject, 0 not"], explanation: "4.36 is larger than 3.89, so reject." }
  ]
 },
 {
  id: 'q37', title: "Holding the supplier to its spread", topic: "Testing a single variance", tier: 'Advanced', sector: "Council Chamber",
  brief: "A supplier promises goods that hardly vary, and the council wants to test that promise about spread rather than about the average.",
  lesson: "A claim about a population’s spread is tested with χ² = (n − 1)s² ÷ σ² on n − 1 degrees of freedom.",
  prompt: "The cable supplier says the lengths of its cut cables have a standard deviation of σ = 2.5 mm. The council suspects they vary more than that. A random sample of 15 cables has sample standard deviation s = 3.2 mm; assume the population is normal. Test at the 5% level. Chi-square table, the value with 5% of the area to its left and the value with 5% to its right: df 13, 5.892 and 22.362; df 14, 6.571 and 23.685; df 15, 7.261 and 24.996. Enter the degrees of freedom, then the test statistic χ² to 2 decimal places, then 1 to reject H₀: σ = 2.5 mm, or 0 not to.",
  answer: [14,22.94,0], labels: ["df","χ²","1 reject, 0 not"], tolerance: 0.0005,
  hints: [
   "The degrees of freedom are n − 1. The statistic compares the sample variance with the claimed variance: χ² = (n − 1)s² ÷ σ².",
   "A test for more spread is right-tailed: reject when χ² is above the value with 5% to its right. A test for less spread is left-tailed: reject when χ² is below the value with 5% to its left."
  ],
  solution: "df = 15 − 1 = 14. χ² = 14 × 3.2² ÷ 2.5² = 14 × 10.24 ÷ 6.25 = 143.36 ÷ 6.25 = 22.9376, which is 22.94 to 2 decimal places. “Vary more” makes the test right-tailed, and the table value for df 14 is 23.685. 22.94 is not above it, so do not reject H₀: enter 0. The sample’s spread is within what chance easily explains.",
  xp: 200, prereqs: ["q27","q07"],
  artifact: { name: "Spread gauge", description: "A gauge that checks a batch’s scatter against the supplier’s promise." },
  sources: [source.s11_6],
  teaching: {
   intuition: "Sometimes the question is not the average but the spread. A cable supplier may promise that lengths vary with a standard deviation of no more than some σ. To test a claim about σ, or about the variance σ², compare the sample variance s² with the claimed σ² using χ² = (n − 1)s² ÷ σ². If the claim is true, this statistic follows a chi-square distribution with df = n − 1, and its typical value is about n − 1. A much larger value suggests more spread than claimed, and a much smaller one less. The test assumes the population is normal. Its direction comes from the question. “Varies more” is right-tailed: reject H₀ when χ² is above the value with 5% of the area to its right. “Varies less” is left-tailed: reject when χ² is below the value with 5% of the area to its left. A two-tailed version splits the 5% between the two ends.",
   steps: [
    "df = n − 1.",
    "χ² = (n − 1) × s² ÷ σ²: square both standard deviations first.",
    "Pick the tail from the wording: more spread is right-tailed, less spread is left-tailed.",
    "Compare χ² with the table value for that tail and df. Beyond it, reject H₀ (1); otherwise do not reject (0)."
   ],
   example: {
    prompt: "An old machine filled packets with σ = 2 g. A new one should vary less: a sample of 11 packets has s = 1.4 g. The value with 5% to its left for df 10 is 3.94.",
    steps: [
     "df = 11 − 1 = 10.",
     "χ² = 10 × 1.4² ÷ 2² = 10 × 1.96 ÷ 4 = 4.9.",
     "“Vary less” is left-tailed. 4.9 is not below 3.94, so do not reject H₀."
    ],
    answer: "df 10, χ² = 4.9, do not reject (0)."
   },
   pitfalls: [
    "Using s and σ without squaring them. The statistic compares variances.",
    "Using n instead of n − 1, for the df or in the formula.",
    "Comparing with the right-hand value in a test for less spread. A left-tailed test uses the left-hand value."
   ]
  },
  guidance: [
   { prompt: "How many degrees of freedom does the test have?", answer: [14], labels: ["df"], explanation: "df = n − 1 = 15 − 1 = 14." },
   { prompt: "What is χ² = (n − 1)s² ÷ σ², to 2 decimal places?", answer: [22.94], labels: ["χ²"], explanation: "3.2² = 10.24 and 2.5² = 6.25, so χ² = 14 × 10.24 ÷ 6.25 = 22.9376, which is 22.94 to 2 decimal places." },
   { prompt: "Which table value fits the tail of this test? Enter that value, then 1 to reject H₀ or 0 not to.", answer: [23.685,0], labels: ["table value","1 reject, 0 not"], explanation: "“Vary more” makes the test right-tailed, so the value is 23.685. χ² = 22.94 is not beyond it: do not reject." }
  ]
 },
 {
  id: 'q38', title: "Three prospectors, one interval", topic: "Intervals and tests agree", tier: 'Advanced', sector: "Council Chamber",
  brief: "Three prospectors each claim a different grade for a new seam, and the council wants to settle all three claims from one confidence interval.",
  lesson: "A two-tailed test at α rejects exactly the claimed means that lie outside the matching (1 − α) confidence interval.",
  prompt: "The council reviews the assay lab’s 95% confidence interval for the mean gold grade of a new seam. It comes from a sample mean of x̄ = 48.6 grams per tonne (g/t) and a margin of error of 2.35 g/t, with σ known. Three prospectors claim mean grades of 45, 50 and 51.2 g/t. Enter the lower bound and the upper bound of the interval, then, for each claim in that order, 1 if a two-tailed test at α = 0.05 rejects it or 0 if not.",
  answer: [46.25,50.95,1,0,1], labels: ["lower bound","upper bound","claim 1: 1 reject, 0 not","claim 2: 1 reject, 0 not","claim 3: 1 reject, 0 not"], tolerance: 0.005,
  hints: [
   "The interval runs from x̄ minus the margin of error to x̄ plus the margin of error.",
   "A two-tailed test at α = 1 − (confidence level) rejects a claimed mean exactly when the claim lies outside the interval."
  ],
  solution: "Lower bound 48.6 − 2.35 = 46.25 and upper bound 48.6 + 2.35 = 50.95. A two-tailed test at α = 0.05 matches the 95% interval. 45 lies below 46.25, outside the interval: reject (1). 50 lies inside the interval: do not reject (0). 51.2 lies above 50.95, outside the interval: reject (1).",
  xp: 200, prereqs: ["q13","q21"],
  artifact: { name: "The claims board", description: "Every claimed grade pinned either inside the interval or outside it." },
  sources: [
   { ...source.s8_1, description: "The confidence interval for a mean, x̄ plus or minus the error bound z × σ ÷ √n, and what the confidence level means. The section gives the interval only; that it agrees with a two-tailed test is worked out in this mission." },
   { ...source.s9_4, description: "The p-value and the decision rule: reject H₀ when the p-value is below α. The section treats the test apart from confidence intervals; the link between the two is worked out in this mission." }
  ],
  teaching: {
   intuition: "A 95% confidence interval and a two-tailed test at α = 0.05 are two views of the same calculation. With σ known, the test of a claimed mean μ₀ rejects it when x̄ lies more than z* standard errors from μ₀, that is when the distance between x̄ and μ₀ is larger than z* × σ ÷ √n. But z* × σ ÷ √n is exactly the margin of error of the interval. So the test rejects μ₀ precisely when μ₀ is further from x̄ than the margin of error, which is when μ₀ lies outside the interval. The values inside the interval are the claims the data cannot rule out at that level. The levels must match: a 90% interval goes with α = 0.10, a 95% interval with α = 0.05, and a 99% interval with α = 0.01. The test must also be two-tailed, because the interval reaches out on both sides of x̄. The textbook sections linked below give the interval and the test separately; the agreement between them is the argument above, not a rule quoted from them.",
   steps: [
    "Find the interval: from x̄ minus the margin of error to x̄ plus the margin of error.",
    "Match the level: α = 1 − confidence level, and the test must be two-tailed.",
    "For each claimed mean μ₀: outside the interval, reject (1); inside it, do not reject (0)."
   ],
   example: {
    prompt: "A 90% interval comes from x̄ = 12.4 and a margin of error of 0.8. Test the claims μ₀ = 12 and μ₀ = 13.5, two-tailed at α = 0.10.",
    steps: [
     "The interval runs from 12.4 − 0.8 = 11.6 to 12.4 + 0.8 = 13.2.",
     "12 lies inside, so it is not rejected. 13.5 lies above 13.2, so it is rejected."
    ],
    answer: "Keep 12 (0); reject 13.5 (1)."
   },
   pitfalls: [
    "Using the interval for a one-tailed test. The match holds only for a two-tailed test.",
    "Mixing levels. A 95% interval says nothing exact about a test at α = 0.01.",
    "Reading “inside the interval” as proof that the claim is true. It only means the data cannot reject it."
   ]
  },
  guidance: [
   { prompt: "What are the lower and upper bounds of the interval?", answer: [46.25,50.95], labels: ["lower bound","upper bound"], explanation: "48.6 − 2.35 = 46.25 and 48.6 + 2.35 = 50.95." },
   { prompt: "Which confidence level matches a two-tailed test at α = 0.05? Enter it as a percentage.", answer: [95], labels: ["confidence level (%)"], explanation: "The level is 1 − α = 1 − 0.05, which is 95%: exactly the interval the lab gave." },
   { prompt: "For each claim, 45, 50 and 51.2 in that order, enter 1 if it lies outside the interval (reject) or 0 if it lies inside.", answer: [1,0,1], labels: ["claim 1","claim 2","claim 3"], explanation: "45 lies below 46.25, outside the interval: reject (1). 50 lies inside the interval: do not reject (0). 51.2 lies above 50.95, outside the interval: reject (1)." }
  ]
 },
 {
  id: 'q39', title: "The right test for each study", topic: "Choosing the right test", tier: 'Advanced', sector: "Council Chamber",
  brief: "Every study that reaches the council needs the right test chosen before any arithmetic starts.",
  lesson: "The kind of outcome, the number of groups and whether the data are paired decide which test fits.",
  prompt: "The same 9 workers are timed on a repair task before and after a training course, and the council tests whether the mean change in their times is zero. Tests: 1 z test for one mean (σ known); 2 t test for one mean (σ unknown); 3 z test for one proportion; 4 two-sample t test for two independent means; 5 z test for two proportions, with the pooled proportion; 6 matched-pairs t test on the differences; 7 χ² goodness-of-fit test; 8 χ² test of independence; 9 one-way ANOVA F test. A χ² test with only two categories, or on a 2 × 2 table, gives the same verdict as the z test for one or two proportions: for such data, choose the z test. ANOVA is for three or more groups. Enter the number of the right test, then its degrees of freedom. For a z test, which has none, enter 0; for the F test, enter the df between groups.",
  answer: [6,8], labels: ["test number","df"], tolerance: 0.01,
  hints: [
   "Ask three questions. Is the outcome a measurement or a counted category? How many groups or variables are compared? Are two sets of measurements independent, or pairs of the same subjects measured twice?",
   "One group of measurements: z if σ is known, t if not (df n − 1). Two independent groups: the two-sample t test (df from its formula, given in the story). Pairs: t on the differences (df pairs − 1). Counts of one variable against claimed shares: goodness of fit (df categories − 1); two variables in a table: independence (df (rows − 1) × (columns − 1)). Three or more means: ANOVA (df between groups k − 1)."
  ],
  solution: "The times are measurements, and each worker is measured twice, so the two sets are pairs. The test is 6, the matched-pairs t test on the 9 differences, with df = 9 − 1 = 8.",
  xp: 200, prereqs: ["q29","q36","q25"],
  artifact: { name: "The council’s test key", description: "A card of three questions that sends every study to its test." },
  sources: [
   { ...source.s9_5, description: "Full one-sample tests worked step by step: the normal distribution when σ is known, Student’s t when it is not, and the normal approximation for a proportion. It does not cover two-group or χ² tests; choosing among all nine tests is worked out in this mission." },
   { ...source.s13_1, description: "What one-way ANOVA tests (whether several group means are equal), its hypotheses and its assumptions. It does not compare ANOVA with the other tests; that choice is worked out in this mission." }
  ],
  teaching: {
   intuition: "By now there are many tests, and the hardest part of a real study is choosing the right one. Three questions settle almost every case. First, what was recorded: a measurement, such as a weight or a time, or a category, such as yes or no, which is then counted? Second, how many groups or variables are compared: one group against a claim, two groups, or three or more? Third, for two sets of measurements, are they independent groups, or pairs, the same subjects measured twice? One group of measurements uses a z test if σ is known and a t test with n − 1 df if not. Two independent means use the two-sample t test, whose df comes from a long formula and is printed in the story, and pairs use a t test on the differences, with pairs − 1 df. Three or more means use one-way ANOVA. Counted categories use z tests for one or two proportions, or χ²: goodness of fit for one variable against claimed shares, with categories − 1 df, and independence for two variables in a table, with (rows − 1) × (columns − 1) df. Two overlaps need a rule. A χ² test with only two categories, or on a 2 × 2 table, always reaches the same verdict as the z test for one or two proportions, so for such data the missions choose the z test. And ANOVA is kept for three or more groups. The textbook sections linked below cover the one-sample tests and ANOVA; the three questions that choose among all the tests are this mission’s own summary.",
   steps: [
    "Decide whether the outcome is a measurement or a counted category.",
    "Count the groups or variables, and check whether measurements are paired.",
    "Pick the test from the list.",
    "Give its df: none (0) for a z test; n − 1 or pairs − 1 for a one-sample or paired t test; the printed formula value for a two-sample t test; categories − 1 or (rows − 1) × (columns − 1) for χ²; k − 1 between groups for ANOVA."
   ],
   example: {
    prompt: "The mine sorts 150 rock samples into 4 colours to see whether the colours come up in the shares the geologist predicted. Which test fits, and with what df?",
    steps: [
     "The outcome is a colour: a category, counted for one variable and compared with claimed shares.",
     "That is the χ² goodness-of-fit test, with 4 − 1 = 3 df."
    ],
    answer: "The χ² goodness-of-fit test (number 7 in the list the missions print), with df 3."
   },
   pitfalls: [
    "Treating paired measurements as two independent groups. The same subjects measured twice are pairs.",
    "Using a t test for counts. Yes-or-no and category data call for proportion or χ² tests.",
    "Running several two-sample t tests on three or more groups instead of one ANOVA."
   ]
  },
  guidance: [
   { prompt: "Is the outcome a measurement, such as a time or a weight (enter 1), or a category that is counted (enter 2)?", answer: [1], labels: ["1 measurement, 2 counted category"], explanation: "Each subject gives a number on a scale, so the outcome is a measurement." },
   { prompt: "Which test from the list fits this design? Enter its number.", answer: [6], labels: ["test number"], explanation: "The times are measurements, and each worker is measured twice, so the two sets are pairs. The test is 6, the matched-pairs t test on the 9 differences, with df = 9 − 1 = 8." },
   { prompt: "What are the degrees of freedom of its statistic (0 for a z test)?", answer: [8], labels: ["df"], explanation: "df = 9 − 1 = 8." }
  ]
 },
 {
  id: 'q40', title: "The council’s full inquiry", topic: "Realm review and bridge: a full study from sample to conclusion", tier: 'Advanced', sector: "Council Chamber",
  brief: "A supplier’s claim has come before the full council, and Mira wants the whole test carried out from start to finish.",
  lesson: "A full test runs through the hypotheses, the statistic, the p-value, the decision and the conclusion, in that order.",
  prompt: "The supplier of drill bits claims a mean life of 120 hours, and the population standard deviation is known: σ = 10 hours. The council suspects the mean life is less than the claimed value. A random sample of 25 bits has x̄ = 116.3 hours. Test at α = 0.05. Normal table, the area to the left of z: z = 1.83, 0.9664; z = 1.84, 0.9671; z = 1.85, 0.9678; z = 1.86, 0.9686; z = 1.87, 0.9693. Enter the test statistic z (it comes out exact to 2 decimal places), then the p-value to 4 decimal places, read from the table rows (for a two-tailed test, double the smaller tail area), then 1 to reject the claim or 0 not to.",
  answer: [-1.85,0.0322,1], labels: ["z","p-value","1 reject, 0 not"], tolerance: 0.00005,
  hints: [
   "z = (x̄ − μ₀) ÷ (σ ÷ √n): how many standard errors the sample mean lies from the claimed mean.",
   "The table gives the area to the left of a positive z. The area beyond it in one tail is 1 minus that area, and by symmetry the left tail beyond −z is the same size. A two-tailed p-value doubles the one-tail area. Reject when the p-value is below α."
  ],
  solution: "H₀: μ = 120 and Hₐ: μ is less than 120, a left-tailed test. The standard error is 10 ÷ √25 = 10 ÷ 5 = 2, so z = (116.3 − 120) ÷ 2 = −3.7 ÷ 2 = −1.85. The table gives 0.9678 to the left of 1.85, so the p-value is the area to the left of −1.85, which by symmetry equals the area to the right of 1.85: 1 − 0.9678 = 0.0322. 0.0322 is below α = 0.05, so reject the claim: enter 1. The mean life is less than 120 hours.",
  xp: 200, prereqs: ["q38","q39"],
  artifact: { name: "Master of evidence seal", description: "The council’s seal for a claim tested from sample to conclusion." },
  sources: [source.s9_5, source.s9_4],
  teaching: {
   intuition: "A full study runs through every step learned so far. State the hypotheses: H₀ gives the claimed mean μ₀, and Hₐ says less than, more than or different from it, which fixes a left-tailed, right-tailed or two-tailed test. Check the conditions: a random sample and, here, a known population standard deviation σ, so the z test fits. Compute the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n). Turn it into a p-value with the normal table: the probability, if H₀ were true, of a sample mean at least this far out in the direction of Hₐ. Compare it with α: a p-value below α means the data would be rare under H₀, so reject H₀. Finally, say what that means for the outpost in plain words, and remember that not rejecting a claim is not the same as proving it.",
   steps: [
    "Write H₀: μ = μ₀ and Hₐ from the wording, and note the tail.",
    "Work out the standard error σ ÷ √n, then z = (x̄ − μ₀) ÷ standard error.",
    "Find the p-value from the table’s area to the left of |z|, the size of z without its sign: one tail is 1 minus that area, and a two-tailed p-value is twice that.",
    "Reject H₀ (1) if the p-value is below α; otherwise do not reject (0). State the conclusion in context."
   ],
   example: {
    prompt: "A clinic claims a mean wait of 30 minutes, with σ = 8 minutes known. Suspecting the wait is longer, the council times 16 visits: x̄ = 33.4. Test at α = 0.05; the table gives 0.9554 to the left of z = 1.7.",
    steps: [
     "Hₐ: μ > 30, so the test is right-tailed. The standard error is 8 ÷ 4 = 2, so z = (33.4 − 30) ÷ 2 = 1.7.",
     "The p-value is 1 − 0.9554 = 0.0446.",
     "0.0446 is below 0.05, so reject H₀: the waits are longer than claimed."
    ],
    answer: "z = 1.7, p-value 0.0446, reject (1)."
   },
   pitfalls: [
    "Doubling the tail area for a one-tailed test, or forgetting to double it for a two-tailed one.",
    "Comparing z with α. α is compared with the p-value, which is a probability.",
    "Concluding that H₀ is true when it is not rejected. The data simply do not give strong enough evidence against it."
   ]
  },
  guidance: [
   { prompt: "Which tail does the council’s suspicion give? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.", answer: [1], labels: ["tail code"], explanation: "“Less than” the claimed mean makes the test left-tailed." },
   { prompt: "What is the standard error σ ÷ √n, and the test statistic z?", answer: [2,-1.85], labels: ["standard error","z"], explanation: "10 ÷ 5 = 2, and z = (116.3 − 120) ÷ 2 = −1.85." },
   { prompt: "Use the table row for the size of z, without its sign. What is the p-value?", answer: [0.0322], labels: ["p-value"], explanation: "The table gives 0.9678 to the left of 1.85, so the p-value is the area to the left of −1.85, which by symmetry equals the area to the right of 1.85: 1 − 0.9678 = 0.0322." },
   { prompt: "Compare the p-value with α = 0.05. Enter 1 to reject the claim, 0 not to.", answer: [1], labels: ["1 reject, 0 not"], explanation: "0.0322 is below 0.05: reject." }
  ]
 }
);
})();
