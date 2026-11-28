/* Data and inference missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/stats/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · Data, samples and frequency tables [1.3]
     q02  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · The mean of a data set, x̄ = Σx ÷ n [2.5]
     q03  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · Median and mode [2.5]
     q04  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · The mean from a frequency table [2.5]
     q05  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · Percentiles and quartiles [2.3]
     q06  ch 1 Describing data · Basic, 100 XP · sector 'Records Office' · IQR, box plots and outliers [2.3, 2.4]
     q07  ch 2 Spread and sampling · Basic, 100 XP · sector 'Survey Camp' · Sample variance and standard deviation, dividing by n − 1 [2.7]
     q08  ch 2 Spread and sampling · Basic, 100 XP · sector 'Survey Camp' · Skew and the z-score of a reading [2.6, 2.7]
     q09  ch 2 Spread and sampling · Basic, 100 XP · sector 'Survey Camp' · Fair samples: simple random, systematic, stratified [1.2]
     q10  ch 2 Spread and sampling · Basic, 100 XP · sector 'Survey Camp' · Sampling variability and the standard error of x̄ [7.1] */
(function(){
'use strict';
/* OpenStax Introductory Statistics 2e sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Introductory Statistics 2e — 2.3 Measures of the Location of the Data
   Link to the section page itself: https://openstax.org/books/introductory-statistics-2e/pages/<section-slug> */
const source = {
 s1_2: { title: 'OpenStax Introductory Statistics 2e — 1.2 Data, Sampling, and Variation in Data and Sampling', url: 'https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling', description: 'Simple random, stratified (a proportionate number from each stratum) and systematic (every nth from a random start) sampling.', verified: '2026-11-27' },
 s1_3: { title: 'OpenStax Introductory Statistics 2e — 1.3 Frequency, Frequency Tables, and Levels of Measurement', url: 'https://openstax.org/books/introductory-statistics-2e/pages/1-3-frequency-frequency-tables-and-levels-of-measurement', description: 'Frequency, relative frequency and cumulative relative frequency in a frequency table.', verified: '2026-11-27' },
 s2_3: { title: 'OpenStax Introductory Statistics 2e — 2.3 Measures of the Location of the Data', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-3-measures-of-the-location-of-the-data', description: 'Percentiles, quartiles as medians of the lower and upper halves, the interquartile range and the 1.5 × IQR rule for outliers.', verified: '2026-11-27' },
 s2_4: { title: 'OpenStax Introductory Statistics 2e — 2.4 Box Plots', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-4-box-plots', description: 'Box plots drawn from the minimum, Q1, the median, Q3 and the maximum.', verified: '2026-11-27' },
 s2_5: { title: 'OpenStax Introductory Statistics 2e — 2.5 Measures of the Center of the Data', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data', description: 'The sample mean, the median for odd and even counts, the mode, and the mean from a frequency table.', verified: '2026-11-27' },
 s2_6: { title: 'OpenStax Introductory Statistics 2e — 2.6 Skewness and the Mean, Median, and Mode', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-6-skewness-and-the-mean-median-and-mode', description: 'Symmetric and skewed data, and how a tail pulls the mean away from the median.', verified: '2026-11-27' },
 s2_7: { title: 'OpenStax Introductory Statistics 2e — 2.7 Measures of the Spread of the Data', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data', description: 'Deviations, the sample variance and standard deviation dividing by n − 1, and the number of standard deviations from the mean.', verified: '2026-11-27' },
 s7_1: { title: 'OpenStax Introductory Statistics 2e — 7.1 The Central Limit Theorem for Sample Means (Averages)', url: 'https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages', description: 'The distribution of sample means and its standard deviation σ ÷ √n, the standard error of the mean.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'The clinic visit log', topic: 'Data, samples and frequency tables', tier: 'Basic', sector: 'Records Office',
  brief: 'The clinic has filed a month of daily check-up counts, and the council wants to know how common a busy day really is.',
  lesson: 'A frequency table counts how often each value occurs; dividing a count by the total gives a relative frequency, and adding those down the table gives a cumulative relative frequency.',
  prompt: 'The clinic files a log at the Records Office of how many crew came in for a check-up each day. Over the last 25 days its frequency table reads: check-ups in a day 0, 1, 2, 3, 4; number of days 3, 6, 8, 5, 3. Enter the relative frequency of the days on which the count was 2, then the cumulative relative frequency of the days on which the count was 2 or fewer. Give both as exact decimals.',
  answer: [0.32, 0.68], labels: ['relative frequency', 'cumulative relative frequency'], tolerance: 0.0005,
  hints: [
   'A relative frequency is the frequency of one class divided by the total of all the frequencies.',
   'A cumulative relative frequency adds the relative frequency of a class to those of every class before it in the table.'
  ],
  solution: 'The frequencies add up to the number of days logged: 3 + 6 + 8 + 5 + 3 = 25. The class 2 has frequency 8, so its relative frequency is 8 ÷ 25 = 0.32. The counts from 0 to 2 cover 3 + 6 + 8 = 17 days, so the cumulative relative frequency is 17 ÷ 25 = 0.68. Adding the relative frequencies row by row, 0.12 + 0.24 + 0.32, gives the same 0.68.',
  xp: 100, prereqs: [],
  artifact: { name: 'The first frequency table', description: 'One month of clinic counts, sorted into classes with their shares.' },
  sources: [source.s1_3],
  teaching: {
   intuition: 'Data are the readings we collect: numbers such as daily counts, weights or times. The thing being measured, which changes from one reading to the next, is called a variable; here it is the number of check-ups in a day. The whole group we care about is the population, such as every day the clinic will ever be open. We can only ever record part of it, and the part we record is a sample. A long list of readings is hard to read, so we sort it into a frequency table: each possible value (a class) in one column, and beside it its frequency, the number of times it occurred. The frequencies add up to the number of readings. A relative frequency is a frequency divided by that total, so it is the share of the readings in that class, a number from 0 to 1. A cumulative relative frequency runs down the table adding up the relative frequencies so far: it is the share of readings in that class or any class before it. The last one is always 1.',
   steps: [
    'Add all the frequencies to get the total number of readings.',
    'Divide the frequency of the class you want by that total: that is its relative frequency.',
    'For the cumulative relative frequency, add the frequencies of that class and of every class before it, then divide by the total. Adding the relative frequencies row by row gives the same number.',
    'Check: the relative frequencies add up to 1, so the last cumulative relative frequency is 1.'
   ],
   example: {
    prompt: 'A dome logs how many dust alarms sounded each day for 20 days. Alarms in a day 0, 1, 2, 3, 4; number of days 2, 5, 7, 4, 2. What are the relative frequency of days with 2 alarms and the cumulative relative frequency of days with 2 alarms or fewer?',
    steps: [
     'The total is 2 + 5 + 7 + 4 + 2 = 20 days.',
     'Relative frequency of 2 alarms: 7 ÷ 20 = 0.35.',
     'Days with 2 alarms or fewer: 2 + 5 + 7 = 14, so the cumulative relative frequency is 14 ÷ 20 = 0.7. Row by row: 0.1 + 0.25 + 0.35 = 0.7.'
    ],
    answer: 'Relative frequency 0.35; cumulative relative frequency 0.7.'
   },
   pitfalls: [
    'Dividing by the number of rows in the table instead of the number of readings. A table with 5 rows can hold 25 days.',
    'Leaving out the class itself when adding for the cumulative relative frequency: “2 or fewer” includes the days with exactly 2.',
    'Mixing up a value and its frequency: the number of check-ups in a day is the value; the number of days with that count is the frequency.'
   ]
  },
  guidance: [
   { prompt: 'How many days does the log cover? Add the frequencies 3, 6, 8, 5, 3.', answer: [25], labels: ['days logged'], explanation: '3 + 6 + 8 + 5 + 3 = 25. The frequencies of a table always add up to the number of readings.' },
   { prompt: 'On how many days was the count 2, and what is that frequency divided by 25?', answer: [8, 0.32], labels: ['frequency', 'relative frequency'], explanation: 'The table gives the frequency 8, and 8 ÷ 25 = 0.32: that share of the days had a count of 2.' },
   { prompt: 'On how many days was the count 2 or fewer, and what is that number divided by 25?', answer: [17, 0.68], labels: ['days with that count or fewer', 'cumulative relative frequency'], explanation: '3 + 6 + 8 = 17 days, and 17 ÷ 25 = 0.68.' }
  ]
 },
 {
  id: 'q02', title: 'Weighing the bean harvest', topic: 'The mean of a data set, x̄ = Σx ÷ n', tier: 'Basic', sector: 'Records Office',
  brief: 'The greenhouse crew want one fair number for how much a trial plot yields, so the seed order can be planned.',
  lesson: 'The sample mean x̄ is the sum of the readings divided by how many there are: x̄ = Σx ÷ n.',
  prompt: 'The Records Office has the bean yields, in kilograms, of 8 trial plots in the greenhouse: 42, 37, 51, 45, 39, 48, 44, 46. Treat these plots as a sample of all the outpost’s plots. Enter the total yield Σx in kilograms, then the sample mean x̄ in kilograms.',
  answer: [352, 44], labels: ['Σx (kg)', 'x̄ (kg)'], tolerance: 0.01,
  hints: [
   'Σx means “add up every reading x”. Add the yields one at a time and keep a running total.',
   'The sample mean x̄ is the total Σx divided by n, the number of readings.'
  ],
  solution: 'Σx = 42 + 37 + 51 + 45 + 39 + 48 + 44 + 46 = 352 kg. There are n = 8 plots, so x̄ = Σx ÷ n = 352 ÷ 8 = 44 kg.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The yield ledger', description: 'A row of plots, one total and one fair share.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'The mean is the everyday average: share the total out equally. If 4 plots gave 10, 12, 9 and 13 kilograms, the total is 44, and sharing it out equally over the 4 plots gives 11 each. Statistics writes this with three symbols. x stands for one reading. Σ, the Greek capital letter sigma, means “add up all of them”, so Σx is the total of the readings. n is the number of readings. The mean of a sample is written x̄, said “x-bar”: x̄ = Σx ÷ n. The mean of a whole population is written μ, as in Probability, where it was the expected value of a distribution. The sample mean is our best single guess at μ from the readings we have. It is a balance point: the readings above it and the readings below it are the same total distance from it.',
   steps: [
    'Count the readings: that is n.',
    'Add them all up: that is Σx. Keep a running total, and check it once more.',
    'Divide: x̄ = Σx ÷ n. The mean has the same unit as the readings.'
   ],
   example: {
    prompt: 'Five plots of oats gave 30, 26, 34, 29 and 31 kilograms. What is the sample mean?',
    steps: [
     'n = 5 and Σx = 30 + 26 + 34 + 29 + 31 = 150.',
     'x̄ = 150 ÷ 5 = 30.'
    ],
    answer: 'x̄ = 30 kg.'
   },
   pitfalls: [
    'Dividing by the wrong count: n is the number of readings, not the number of different values among them.',
    'Dropping a reading while adding. Add twice, or add in pairs, to check the total.',
    'Rounding the mean to a whole number when it is not one: a mean of 43.5 kg is a fine answer.'
   ]
  },
  guidance: [
   { prompt: 'How many readings are there? That number is n.', answer: [8], labels: ['n'], explanation: 'Counting the yields gives n = 8.' },
   { prompt: 'Add the 8 yields. What is Σx?', answer: [352], labels: ['Σx (kg)'], explanation: '42 + 37 + 51 + 45 + 39 + 48 + 44 + 46 = 352 kg.' },
   { prompt: 'Divide the total by n. What is 352 ÷ 8?', answer: [44], labels: ['x̄ (kg)'], explanation: '352 ÷ 8 = 44, so the sample mean is x̄ = 44 kg per plot.' }
  ]
 },
 {
  id: 'q03', title: 'Counting the seed pods', topic: 'Median and mode', tier: 'Basic', sector: 'Records Office',
  brief: 'A few very full plants could give the wrong picture, so Mira wants a typical pod count that one odd plant cannot drag about.',
  lesson: 'The median is the middle value of the ordered data; the mode is the value that occurs most often.',
  prompt: 'A Records Office clerk counted the seed pods on 8 bean plants and wrote the counts down in the order she met the plants: 23, 31, 19, 27, 31, 22, 35, 26. Enter the median number of pods, then the mode.',
  answer: [26.5, 31], labels: ['median (pods)', 'mode (pods)'], tolerance: 0.01,
  hints: [
   'Put the counts in order from smallest to largest first. With an odd number of counts the median is the middle one; with an even number it is halfway between the two middle ones.',
   'The mode is the count that appears most often.'
  ],
  solution: 'In order the counts are 19, 22, 23, 26, 27, 31, 31, 35. There are 8 counts, an even number, so the median is halfway between the 4th and 5th counts: (26 + 27) ÷ 2 = 26.5. The count 31 appears twice and every other count once, so the mode is 31.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'The pod tally', description: 'A row of counts in order, with its middle marked.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'The mean can be pulled about by one extreme reading. If four plants have 10, 11, 12 and 13 pods and a fifth has 59, the mean jumps to 21, bigger than every typical plant. The median resists that. Put the readings in order from smallest to largest; the median is the one in the middle, with as many readings below it as above. With an odd number of readings there is one middle value. With an even number there are two, and the median is halfway between them: add the two and divide by 2. In the example the median is 12, however many pods the fifth plant has. The mode is the value that occurs most often. A data set can have one mode, several, or none at all when every value occurs once.',
   steps: [
    'Write the readings in order from smallest to largest.',
    'Count them. With an odd count n the median is the reading in place (n + 1) ÷ 2; with an even count it is halfway between the readings in places n ÷ 2 and n ÷ 2 + 1.',
    'For the mode, look for the value that appears most often in the list.'
   ],
   example: {
    prompt: 'Seven plants had 15, 24, 12, 18, 15, 29 and 20 pods. Find the median and the mode.',
    steps: [
     'In order: 12, 15, 15, 18, 20, 24, 29.',
     'Seven readings: the median is the 4th, 18.',
     '15 appears twice and every other value once, so the mode is 15.'
    ],
    answer: 'Median 18 pods, mode 15 pods.'
   },
   pitfalls: [
    'Taking the middle of the list before putting it in order.',
    'With an even count, picking one of the two middle values instead of the value halfway between them.',
    'Giving how many times the mode appears instead of the mode itself.'
   ]
  },
  guidance: [
   { prompt: 'Put the 8 counts in order. What are the smallest and the largest?', answer: [19, 35], labels: ['smallest', 'largest'], explanation: 'In order: 19, 22, 23, 26, 27, 31, 31, 35. The smallest is 19 and the largest is 35.' },
   { prompt: 'There are 8 counts. What is the median?', answer: [26.5], labels: ['median (pods)'], explanation: 'An even number of counts has two middle counts: the median is halfway between the 4th and 5th counts: (26 + 27) ÷ 2 = 26.5.' },
   { prompt: 'Which count appears most often?', answer: [31], labels: ['mode (pods)'], explanation: '31 appears twice; every other count appears once. So the mode is 31.' }
  ]
 },
 {
  id: 'q04', title: 'Crew sizes on the shuttle runs', topic: 'The mean from a frequency table', tier: 'Basic', sector: 'Records Office',
  brief: 'The shuttle office keeps its crew counts as a frequency table, and the ration planners need the mean crew size per run from it.',
  lesson: 'From a frequency table, the mean is the sum of value × frequency divided by the sum of the frequencies: each value counts as often as it occurred.',
  prompt: 'The Records Office lists the crew sizes of its recent shuttle runs in a frequency table: crew size 3, 4, 5, 6; frequency (number of runs) 4, 7, 6, 3. Enter the number of runs, then the total of all the crew sizes (every seat filled, counted over all the runs), then the mean crew size per run as an exact decimal.',
  answer: [20, 88, 4.4], labels: ['runs', 'total crew', 'mean crew size'], tolerance: 0.005,
  hints: [
   'Each row stands for several runs of the same size: multiply each crew size by its frequency to get that row’s total.',
   'The mean is the grand total divided by the number of runs, which is the sum of the frequencies, not the number of rows.'
  ],
  solution: 'The number of runs is 4 + 7 + 6 + 3 = 20. The row totals are 3 × 4 = 12, 4 × 7 = 28, 5 × 6 = 30, 6 × 3 = 18, and they add up to 88. The mean crew size is 88 ÷ 20 = 4.4.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'The crew roster table', description: 'Four rows that stand for a whole season of runs.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'A frequency table is a short way of writing a long list. A row “crew size 4, frequency 7” stands for seven runs of 4 crew each, so it adds 4 × 7 = 28 to the total, exactly as writing 4 seven times and adding would. So the total of all the readings is the sum of value × frequency over the rows, and the number of readings is the sum of the frequencies. The mean is still the total divided by the number of readings. It is called a weighted mean: each value is weighted by how often it occurs, so a common value pulls the mean towards itself more than a rare one. The plain average of the values in the first column ignores the frequencies and is usually wrong.',
   steps: [
    'Add the frequencies to get n, the number of readings.',
    'Multiply each value by its frequency and add the products to get Σx.',
    'Divide: the mean is Σx ÷ n.'
   ],
   example: {
    prompt: 'A table of rover trips gives crew sizes 1, 2, 3, 4 with frequencies 2, 3, 4, 1. What is the mean crew size?',
    steps: [
     'n = 2 + 3 + 4 + 1 = 10 trips.',
     'Σx = 1 × 2 + 2 × 3 + 3 × 4 + 4 × 1 = 2 + 6 + 12 + 4 = 24.',
     'The mean is 24 ÷ 10 = 2.4.'
    ],
    answer: '2.4 crew per trip.'
   },
   pitfalls: [
    'Averaging the values in the first column and ignoring the frequencies.',
    'Dividing by the number of rows instead of by the total of the frequencies.',
    'Adding each frequency to its value instead of multiplying them.'
   ]
  },
  guidance: [
   { prompt: 'How many runs does the table cover? Add the frequencies.', answer: [20], labels: ['runs'], explanation: '4 + 7 + 6 + 3 = 20 runs.' },
   { prompt: 'Multiply each crew size by its frequency and add the four products. What is the total?', answer: [88], labels: ['total crew'], explanation: '3 × 4 = 12, 4 × 7 = 28, 5 × 6 = 30, 6 × 3 = 18; together 12 + 28 + 30 + 18 = 88.' },
   { prompt: 'Divide the total by the number of runs. What is 88 ÷ 20?', answer: [4.4], labels: ['mean crew size'], explanation: '88 ÷ 20 = 4.4 crew per run on average.' }
  ]
 },
 {
  id: 'q05', title: 'Splitting the water log', topic: 'Percentiles and quartiles', tier: 'Basic', sector: 'Records Office',
  brief: 'The water plant wants to know what counts as a low day and a high day of use, so it can set its warning levels.',
  lesson: 'Quartiles cut ordered data into four parts: Q1 is the median of the lower half and Q3 the median of the upper half.',
  prompt: 'The Records Office has the outpost’s water use, in hundreds of litres, on 10 days, already sorted from smallest to largest: 12, 15, 17, 18, 21, 24, 26, 29, 33, 38. Find the quartiles by the median-of-halves method. Enter the first quartile Q1, then the third quartile Q3.',
  answer: [17, 29], labels: ['Q1', 'Q3'], tolerance: 0.01,
  hints: [
   'Find the median first. The lower half is every reading before the median’s place and the upper half every reading after it; with an odd number of readings the median itself is in neither half.',
   'Q1 is the median of the lower half, and Q3 is the median of the upper half.'
  ],
  solution: 'There are 10 readings, so the median is halfway between the 5th and 6th readings: (21 + 24) ÷ 2 = 22.5. The lower half is 12, 15, 17, 18, 21 and the upper half is 24, 26, 29, 33, 38. Q1 = 17, the middle of 12, 15, 17, 18, 21. Q3 = 29, the middle of 24, 26, 29, 33, 38.',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'The quarter marks', description: 'A water log cut into four equal parts.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'The median cuts ordered data into two halves. Cutting each half in half again gives four quarters, and the cut points are the quartiles. The first quartile Q1 is the median of the lower half of the data: about a quarter of the readings lie at or below it. The second quartile is the median itself. The third quartile Q3 is the median of the upper half: about three quarters of the readings lie at or below it. Quartiles are special percentiles. The kth percentile is a value with about k% of the data at or below it, so Q1 is the 25th percentile, the median the 50th and Q3 the 75th. We use the median-of-halves method: find the median, split the ordered list into the readings before it and the readings after it, and take the median of each half. With an odd number of readings the median itself goes in neither half. Other books use slightly different rules, which is why the method is always stated.',
   steps: [
    'Put the readings in order and find the median.',
    'Split the list: the lower half is every reading before the median’s place, the upper half every reading after it. With an odd count, leave the median out of both.',
    'Q1 is the median of the lower half and Q3 is the median of the upper half.'
   ],
   example: {
    prompt: 'Nine readings, in order: 3, 5, 6, 8, 9, 11, 12, 14, 15. Find Q1 and Q3.',
    steps: [
     'The median is the 5th reading, 9, and it goes in neither half.',
     'Lower half 3, 5, 6, 8: Q1 = (5 + 6) ÷ 2 = 5.5.',
     'Upper half 11, 12, 14, 15: Q3 = (12 + 14) ÷ 2 = 13.'
    ],
    answer: 'Q1 = 5.5 and Q3 = 13.'
   },
   pitfalls: [
    'Putting the median of an odd-sized list into one of the halves.',
    'Taking the reading a quarter of the way along as Q1 instead of the median of the lower half.',
    'Forgetting to put the readings in order first.'
   ]
  },
  guidance: [
   { prompt: 'There are 10 readings. What is the median?', answer: [22.5], labels: ['median'], explanation: 'The median is halfway between the 5th and 6th readings: (21 + 24) ÷ 2 = 22.5.' },
   { prompt: 'The lower half is 12, 15, 17, 18, 21. What is its median, Q1?', answer: [17], labels: ['Q1'], explanation: 'Q1 = 17, the middle of 12, 15, 17, 18, 21.' },
   { prompt: 'The upper half is 24, 26, 29, 33, 38. What is its median, Q3?', answer: [29], labels: ['Q3'], explanation: 'Q3 = 29, the middle of 24, 26, 29, 33, 38.' }
  ]
 },
 {
  id: 'q06', title: 'The slow drone runs', topic: 'IQR, box plots and outliers', tier: 'Basic', sector: 'Records Office',
  brief: 'A few drone deliveries took far longer than the rest, and the depot wants a fair rule for which runs to look into.',
  lesson: 'IQR = Q3 − Q1; a reading below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR is an outlier worth investigating.',
  prompt: 'The Records Office timed the supply drone on 11 delivery runs. The times in minutes, sorted: 31, 34, 35, 37, 38, 40, 41, 43, 44, 47, 62. Find Q1 and Q3 by the median-of-halves method. Enter the interquartile range IQR = Q3 − Q1, then the upper fence Q3 + 1.5 × IQR, then the number of outliers: runs below the lower fence Q1 − 1.5 × IQR or above the upper fence.',
  answer: [9, 57.5, 1], labels: ['IQR', 'upper fence', 'outliers'], tolerance: 0.005,
  hints: [
   'Find Q1 and Q3 by the median-of-halves method; the IQR is the gap between them.',
   'Multiply the IQR by 1.5. Add that to Q3 for the upper fence and take it from Q1 for the lower fence, then count the readings outside the two fences.'
  ],
  solution: 'The lower half is 31, 34, 35, 37, 38, so Q1 = 35; the upper half is 41, 43, 44, 47, 62, so Q3 = 44. IQR = 44 − 35 = 9, and 1.5 × 9 = 13.5. The upper fence is 44 + 13.5 = 57.5 and the lower fence is 35 − 13.5 = 21.5. Only 62 lies outside the fences, so there is 1 outlier.',
  xp: 100, prereqs: ['q05'],
  artifact: { name: 'The first box plot', description: 'A box, two whiskers and one dot that needs explaining.' },
  sources: [source.s2_3, source.s2_4],
  teaching: {
   intuition: 'The interquartile range, IQR = Q3 − Q1, is the width of the middle half of the data. Unlike the full range from smallest to largest, one strange reading cannot stretch it. The five-number summary (the minimum, Q1, the median, Q3 and the maximum) describes a data set in five numbers, and a box plot draws it: a box from Q1 to Q3 with a line across it at the median, and whiskers out to the smallest and largest readings. A reading far outside the box is suspicious. The usual rule sets two fences: the lower fence Q1 − 1.5 × IQR and the upper fence Q3 + 1.5 × IQR. A reading below the lower fence or above the upper fence is called an outlier. It is not automatically an error. It might be a slip in the log or a real run that went badly; either way it deserves a closer look.',
   steps: [
    'Find Q1 and Q3 by the median-of-halves method, then IQR = Q3 − Q1.',
    'Work out 1.5 × IQR.',
    'Lower fence: Q1 − 1.5 × IQR. Upper fence: Q3 + 1.5 × IQR.',
    'Count the readings below the lower fence or above the upper fence: those are the outliers.'
   ],
   example: {
    prompt: 'Nine readings in order: 12, 14, 15, 16, 18, 19, 21, 22, 40. Find the IQR, the two fences and the outliers.',
    steps: [
     'The median is 18. Lower half 12, 14, 15, 16: Q1 = 14.5. Upper half 19, 21, 22, 40: Q3 = 21.5.',
     'IQR = 21.5 − 14.5 = 7, and 1.5 × 7 = 10.5.',
     'Fences: 14.5 − 10.5 = 4 and 21.5 + 10.5 = 32. Only 40 is above 32, and nothing is below 4.'
    ],
    answer: 'IQR 7, fences 4 and 32, one outlier (40).'
   },
   pitfalls: [
    'Using the full range, largest minus smallest, instead of Q3 − Q1.',
    'Adding 1.5 × IQR to the median or to the maximum instead of to Q3.',
    'Forgetting the lower fence: a reading can be an outlier at either end.'
   ]
  },
  guidance: [
   { prompt: 'Split the 11 times into a lower and an upper half, leaving the median out. What are Q1 and Q3?', answer: [35, 44], labels: ['Q1', 'Q3'], explanation: 'Lower half 31, 34, 35, 37, 38 gives Q1 = 35; upper half 41, 43, 44, 47, 62 gives Q3 = 44.' },
   { prompt: 'IQR = 44 − 35 = 9. What are the lower fence Q1 − 1.5 × IQR and the upper fence Q3 + 1.5 × IQR?', answer: [21.5, 57.5], labels: ['lower fence', 'upper fence'], explanation: '1.5 × 9 = 13.5. 35 − 13.5 = 21.5 and 44 + 13.5 = 57.5.' },
   { prompt: 'How many of the 11 times lie below 21.5 or above 57.5?', answer: [1], labels: ['outliers'], explanation: '62 is outside the fences, so the count is 1.' }
  ]
 },
 {
  id: 'q07', title: 'Depth of the dust layer', topic: 'Sample variance and standard deviation, dividing by n − 1', tier: 'Basic', sector: 'Survey Camp',
  brief: 'Before the rovers cross the plain the drivers need to know not just how deep the dust is on average but how much it varies.',
  lesson: 'The sample variance is s² = Σ(x − x̄)² ÷ (n − 1); the sample standard deviation s is its square root.',
  prompt: 'At the Survey Camp the crew measured the depth of the dust layer, in millimetres, at 5 survey stakes: 14, 9, 12, 17, 8. Treat these as a sample. Enter the sample variance s², then the sample standard deviation s, each to 2 decimal places.',
  answer: [13.5, 3.67], labels: ['s²', 's'], tolerance: 0.005,
  hints: [
   'Find the mean first, then each reading’s deviation from it: the reading minus the mean. Square every deviation and add the squares.',
   'For a sample, divide that sum by n − 1, one less than the number of readings, to get s². Then s is the square root of s².'
  ],
  solution: 'x̄ = 60 ÷ 5 = 12 mm. The deviations x − x̄ are 2, −3, 0, 5, −4 (they add up to 0, a useful check), and their squares are 4, 9, 0, 25, 16, which add up to 54. With n − 1 = 4, s² = 54 ÷ 4 = 13.5 mm², and s = √(54 ÷ 4) ≈ 3.6742, which rounds to 3.67 mm.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'The dust gauge', description: 'A depth reading with its typical wobble beside it.' },
  sources: [source.s2_7],
  teaching: {
   intuition: 'Two plains can have the same mean dust depth, one smooth and one full of drifts. Spread measures the difference. Each reading’s deviation is how far it is from the mean: x − x̄, positive above the mean and negative below. The deviations always add up to 0, so to measure their size we square them, which makes them all positive, and add the squares. In Probability the variance σ² of a distribution was the average squared distance from the mean μ. For a sample we divide the sum of the squares by n − 1 instead of n: the readings sit a little closer to their own mean x̄ than to the unknown population mean, and dividing by one less makes up for that. The result is the sample variance s². Its unit is the square of the readings’ unit, so we take its square root to get back to the readings’ unit: the sample standard deviation s, roughly the typical distance of a reading from the mean.',
   steps: [
    'Find the mean x̄.',
    'Work out each deviation x − x̄ and square it.',
    'Add the squares, then divide by n − 1: that is s².',
    'Take the square root of s² to get s.'
   ],
   example: {
    prompt: 'Five readings: 6, 10, 7, 9, 8. Find s² and s.',
    steps: [
     'x̄ = 40 ÷ 5 = 8.',
     'The deviations are −2, 2, −1, 1, 0; their squares 4, 4, 1, 1, 0 add up to 10.',
     's² = 10 ÷ 4 = 2.5, and s = √2.5 ≈ 1.5811, which rounds to 1.58.'
    ],
    answer: 's² = 2.5 and s ≈ 1.58.'
   },
   pitfalls: [
    'Dividing by n instead of n − 1 for a sample.',
    'Adding the deviations without squaring them: they always come to 0.',
    'Rounding s² first and taking the square root of the rounded value: work s out from the exact s².'
   ]
  },
  guidance: [
   { prompt: 'What is the mean x̄ of the 5 depths?', answer: [12], labels: ['x̄ (mm)'], explanation: '14 + 9 + 12 + 17 + 8 = 60, and 60 ÷ 5 = 12 mm.' },
   { prompt: 'Subtract 12 from each depth, square the results and add them. What is the sum of the squared deviations?', answer: [54], labels: ['sum of squared deviations'], explanation: 'The deviations are 2, −3, 0, 5, −4; squared they are 4, 9, 0, 25, 16, and the sum is 54.' },
   { prompt: 'Divide 54 by n − 1 = 4, then take the square root. What are s² and s, to 2 decimal places?', answer: [13.5, 3.67], labels: ['s²', 's'], explanation: 's² = 54 ÷ 4 = 13.5, and s = √(54 ÷ 4) ≈ 3.6742, which rounds to 3.67.' }
  ]
 },
 {
  id: 'q08', title: 'The ridge path times', topic: 'Skew and the z-score of a reading', tier: 'Basic', sector: 'Survey Camp',
  brief: 'One survey trip along the ridge took far longer or far shorter than the rest, and Mira wants to know how unusual it was and how much it bends the average.',
  lesson: 'A mean above the median signals data skewed to the right; z = (x − x̄) ÷ s says how many standard deviations a reading is from the mean.',
  prompt: 'A survey team timed the walk along the ridge path, in minutes, on 7 trips: 8, 22, 7, 9, 6, 10, 8. The sample standard deviation of these times is s = 5.45 minutes, rounded to 2 decimal places. Enter the mean minus the median; its sign shows the skew. Then enter the z-score of the longest trip, 22 minutes, using s = 5.45, to 2 decimal places.',
  answer: [2, 2.2], labels: ['mean − median', 'z-score'], tolerance: 0.005,
  hints: [
   'Find the mean and the median. A mean above the median usually means a long tail on the right (skewed to the right); a mean below it, a tail on the left.',
   'A z-score counts standard deviations from the mean: z = (x − x̄) ÷ s. It is negative for a reading below the mean.'
  ],
  solution: 'x̄ = 70 ÷ 7 = 10 minutes. In order the times are 6, 7, 8, 8, 9, 10, 22, so the median is the 4th time, 8. The mean minus the median is 10 − 8 = 2, which is positive: the data are skewed to the right, pulled up by the one long trip. The z-score of 22 is (22 − 10) ÷ 5.45 = 12 ÷ 5.45 ≈ 2.2018, which rounds to 2.20.',
  xp: 100, prereqs: ['q07', 'q03'],
  artifact: { name: 'The long-trip marker', description: 'One far reading, measured in standard deviations.' },
  sources: [source.s2_6, source.s2_7],
  teaching: {
   intuition: 'Data are symmetric when the two sides of their picture match, as for the normal curve; then the mean and the median sit together in the middle. Often one side instead has a long tail of a few far readings, and the data are skewed towards that tail. The mean feels every reading’s size, so a tail pulls it towards itself; the median only counts places, so it barely moves. That gives a quick test: when the mean is greater than the median the data are usually skewed to the right (a long tail of big values), and when it is less they are usually skewed to the left. To say how unusual one reading is, use the z-score from Probability, now with the sample’s mean and standard deviation: z = (x − x̄) ÷ s. It counts how many standard deviations the reading lies above the mean (positive) or below it (negative). A z-score beyond 2 or −2 is rare in data shaped like a normal curve.',
   steps: [
    'Find the mean x̄ and the median of the data.',
    'Work out the mean minus the median: positive suggests skewed to the right, negative skewed to the left.',
    'For one reading x, compute z = (x − x̄) ÷ s.'
   ],
   example: {
    prompt: 'Six trip times: 30, 31, 32, 33, 34, 50 minutes, with s = 7.48. Which way are they skewed, and what is the z-score of 50?',
    steps: [
     'x̄ = 210 ÷ 6 = 35, and the median is (32 + 33) ÷ 2 = 32.5.',
     'The mean minus the median is 2.5, which is positive: skewed to the right by the 50-minute trip.',
     'z = (50 − 35) ÷ 7.48 = 15 ÷ 7.48 ≈ 2.0053, which rounds to 2.01.'
    ],
    answer: 'Skewed to the right; z ≈ 2.01.'
   },
   pitfalls: [
    'Reading the sign backwards: a mean above the median points to a tail on the right, not the left.',
    'Dividing by the variance s² instead of the standard deviation s.',
    'Dropping the minus sign of a reading below the mean.'
   ]
  },
  guidance: [
   { prompt: 'What are the mean and the median of the 7 times?', answer: [10, 8], labels: ['x̄', 'median'], explanation: 'x̄ = 70 ÷ 7 = 10. In order, 6, 7, 8, 8, 9, 10, 22: the median is the 4th time, 8.' },
   { prompt: 'What is the mean minus the median, 10 − 8?', answer: [2], labels: ['mean − median'], explanation: '10 − 8 = 2. It is positive, so the tail is on the right.' },
   { prompt: 'What is z = (22 − 10) ÷ 5.45, to 2 decimal places?', answer: [2.2], labels: ['z-score'], explanation: '12 ÷ 5.45 ≈ 2.2018, which rounds to 2.20. The longest trip is about 2.2 standard deviations above the mean.' }
  ]
 },
 {
  id: 'q09', title: 'A fair survey of the domes', topic: 'Fair samples: simple random, systematic, stratified', tier: 'Basic', sector: 'Survey Camp',
  brief: 'Mira wants the crew’s views on the new ration menu, but asking only the people nearest the kitchen would not be fair.',
  lesson: 'A sample should be chosen by chance: simple random, systematic (every kth name from a random start) or stratified (a proportional share from each group).',
  prompt: 'Mira wants 10 crew members surveyed about the new ration menu. The crew live in three domes: 40 in Dome A, 24 in Dome B and 16 in Dome C, 80 in all. For a proportional stratified sample, enter how many to take from Dome A, from Dome B and from Dome C. Then, for a systematic sample of 10 instead, the whole crew list is numbered 1 to 80 and the first person chosen is number 3, picked at random from numbers 1 to 8. Enter the number of the third person chosen.',
  answer: [5, 3, 2, 19], labels: ['from Dome A', 'from Dome B', 'from Dome C', 'third pick'], tolerance: 0.01,
  hints: [
   'In a proportional stratified sample each stratum gets the same share of the sample as it has of the population: its size divided by the total, times the sample size.',
   'In a systematic sample the step is the population size divided by the sample size. Start at the first pick and add the step each time: the third pick is two steps on.'
  ],
  solution: 'Dome A: 40 ÷ 80 × 10 = 5; Dome B: 24 ÷ 80 × 10 = 3; Dome C: 16 ÷ 80 × 10 = 2. Together 5 + 3 + 2 = 10, the whole sample. For the systematic sample the step is 80 ÷ 10 = 8, so the picks are number 3, 11, 19 and so on: the third person chosen is number 19.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'The survey drum', description: 'Every name in, well mixed, a few drawn out.' },
  sources: [source.s1_2],
  teaching: {
   intuition: 'A sample is only useful if it looks like the population it stands for. Asking whoever happens to be in the canteen gives a convenience sample, and it can be badly biased. Chance is the cure. In a simple random sample every group of the chosen size has the same chance of being the one picked, like drawing names from a well-mixed drum. In a systematic sample you number the population list, divide its size by the sample size to get a step k, choose a random start among the first k numbers, and then take every kth name after it. In a stratified sample you first split the population into groups called strata (one group is a stratum), such as the domes people live in, and take a random sample from each, in proportion to its size, so every group is fairly represented. A number that describes the whole population, such as the share of all the crew who like the menu, is a parameter. The same kind of number worked out from a sample is a statistic, and we use the statistic to estimate the parameter.',
   steps: [
    'Stratified: for each stratum, its size ÷ the population size × the sample size gives its share of the sample.',
    'Check that the shares add up to the whole sample.',
    'Systematic: the step is the population size ÷ the sample size. From the random start, add the step again and again to get the next picks.'
   ],
   example: {
    prompt: 'A crew of 60 lives in three domes of 30, 20 and 10, and a sample of 12 is wanted. How many come from each dome, and if a systematic sample starts at number 2, what is the third pick?',
    steps: [
     '12 out of 60 is 1 in every 5.',
     'The shares are 30 ÷ 5 = 6, 20 ÷ 5 = 4 and 10 ÷ 5 = 2, which add up to 12.',
     'The step is 60 ÷ 12 = 5, so the picks are 2, 7, 12 and so on: the third pick is number 12.'
    ],
    answer: '6, 4 and 2 from the domes; the third systematic pick is number 12.'
   },
   pitfalls: [
    'Taking the same number from every stratum, whatever its size.',
    'Counting the start as a step: the third pick is two steps after the start, not three.',
    'Choosing the people who are easiest to reach. That is not a random sample, however many are asked.'
   ]
  },
  guidance: [
   { prompt: 'The sample is 10 out of 80. How many crew members does each person in the sample stand for: what is 80 ÷ 10?', answer: [8], labels: ['crew per sampled person'], explanation: '80 ÷ 10 = 8: the sample takes 1 crew member in every 8.' },
   { prompt: 'Taking 1 in every 8 from each dome, how many come from Dome A, Dome B and Dome C?', answer: [5, 3, 2], labels: ['from Dome A', 'from Dome B', 'from Dome C'], explanation: '40 ÷ 8 = 5, 24 ÷ 8 = 3 and 16 ÷ 8 = 2.' },
   { prompt: 'The systematic sample starts at number 3 and steps by 8. What number is the third pick?', answer: [19], labels: ['third pick'], explanation: '3, then 3 + 8 = 11, then 11 + 8 = 19.' }
  ]
 },
 {
  id: 'q10', title: 'How far a sample mean wanders', topic: 'Sampling variability and the standard error of x̄', tier: 'Basic', sector: 'Survey Camp',
  brief: 'The camp will average a batch of soil moisture readings, and the farm planners want to know how far that average could be from the truth.',
  lesson: 'The sample mean x̄ varies from sample to sample with standard deviation σ ÷ √n, the standard error; four times the sample size halves it.',
  prompt: 'Survey Camp records show that soil moisture readings across the plain vary with standard deviation σ = 7.4 grams of water per kilogram of soil. The crew will average n = 49 readings taken at points chosen at random. Enter the standard error of the sample mean, σ ÷ √n, in grams per kilogram to 2 decimal places. Then enter the sample size that would halve the standard error.',
  answer: [1.06, 196], labels: ['standard error (g/kg)', 'sample size'], tolerance: 0.005,
  hints: [
   'The standard error of the sample mean is σ ÷ √n: the spread of single readings divided by the square root of the sample size.',
   'Because n sits under a square root, halving the standard error needs √n to double, so n must be multiplied by 4.'
  ],
  solution: '√49 = 7, so the standard error is 7.4 ÷ 7 ≈ 1.0571, which rounds to 1.06 grams per kilogram. To halve it, √n must double from 7 to 14, so n = 14 × 14 = 196 readings: four times as many.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'The wandering average', description: 'Many sample means, crowding closer as the samples grow.' },
  sources: [source.s7_1],
  teaching: {
   intuition: 'Take a sample, work out its mean, and you get one number. Take another sample of the same size and the mean comes out a little different. This is sampling variability: a sample mean is itself a random variable, with a distribution of its own. You met that distribution in Probability with the Central Limit Theorem: its centre is the population mean μ and its standard deviation is σ ÷ √n, where σ is the standard deviation of single readings and n is the sample size. That standard deviation of the sample mean is called the standard error. It says how far a sample mean typically lands from μ. Because n sits under a square root, bigger samples help, but slowly: four times as many readings give half the standard error, and a hundred times as many give a tenth.',
   steps: [
    'Find √n.',
    'Divide σ by √n: that is the standard error of the sample mean.',
    'To cut the standard error by some factor, multiply √n by that factor; n then grows by the factor squared, so halving the standard error takes 4 times the sample size.'
   ],
   example: {
    prompt: 'Readings vary with σ = 9, and a sample of n = 25 is averaged. What is the standard error, and what sample size would halve it?',
    steps: [
     '√25 = 5, so the standard error is 9 ÷ 5 = 1.8.',
     'Halving it needs √n = 10, so n = 100.'
    ],
    answer: 'Standard error 1.8; n = 100 halves it.'
   },
   pitfalls: [
    'Dividing σ by n instead of by √n.',
    'Doubling the sample to halve the standard error: doubling n only divides it by about 1.41.',
    'Mixing up σ, the spread of single readings, with the standard error, the spread of sample means.'
   ]
  },
  guidance: [
   { prompt: 'What is √n for n = 49?', answer: [7], labels: ['√n'], explanation: '7 × 7 = 49, so √49 = 7.' },
   { prompt: 'What is σ ÷ √n = 7.4 ÷ 7, to 2 decimal places?', answer: [1.06], labels: ['standard error (g/kg)'], explanation: '7.4 ÷ 7 ≈ 1.0571, which rounds to 1.06. A typical sample mean of 49 readings lands about that far from the true mean.' },
   { prompt: 'For half the standard error, √n must be twice 7. What sample size n has √n = 14?', answer: [196], labels: ['sample size'], explanation: '14 × 14 = 196, which is 4 × 49.' }
  ]
 }
);
})();
