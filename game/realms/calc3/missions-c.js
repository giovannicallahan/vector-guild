/* Calculus 3: many variables missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/calc3/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · Critical points and the second derivative test [4.7]
     q22  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · Lagrange multipliers [4.8]
     q23  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · Chapter review: best values on the plain [4.6, 4.7]
     q24  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Double integrals over rectangles [5.1]
     q25  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Double integrals over general regions; switching the order [5.2]
     q26  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Double integrals in polar coordinates [5.3]
     q27  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Triple integrals [5.4, 5.6]
     q28  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Cylindrical and spherical coordinates [5.5]
     q29  ch 5 Double and triple integrals · Intermediate, 150 XP · sector 'Dome Works' · Chapter review: the mass of a dome [5.1, 5.5, 5.6]
     q30  ch 6 Fields and paths · Advanced, 200 XP · sector 'Cable Yard' · Change of variables and the Jacobian [5.7] */
(function(){
'use strict';
/* OpenStax Calculus Volume 3 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient
   Link to the section page itself: https://openstax.org/books/calculus-volume-3/pages/<section-slug> */
const source = {
 s4_6: { title: 'OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient', url: 'https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient', description: 'The gradient, directional derivatives, and the gradient’s length as the greatest rate of increase.', verified: '2026-11-27' },
 s4_7: { title: 'OpenStax Calculus Volume 3 — 4.7 Maxima/Minima Problems', url: 'https://openstax.org/books/calculus-volume-3/pages/4-7-maxima-minima-problems', description: 'Critical points of functions of two variables, saddle points and the second derivative test with the discriminant D.', verified: '2026-11-27' },
 s4_8: { title: 'OpenStax Calculus Volume 3 — 4.8 Lagrange Multipliers', url: 'https://openstax.org/books/calculus-volume-3/pages/4-8-lagrange-multipliers', description: 'Largest and smallest values on a constraint, found from ∇f = λ∇g.', verified: '2026-11-27' },
 s5_1: { title: 'OpenStax Calculus Volume 3 — 5.1 Double Integrals over Rectangular Regions', url: 'https://openstax.org/books/calculus-volume-3/pages/5-1-double-integrals-over-rectangular-regions', description: 'Double integrals as volumes, iterated integrals, Fubini’s theorem, products that split, and average value.', verified: '2026-11-27' },
 s5_2: { title: 'OpenStax Calculus Volume 3 — 5.2 Double Integrals over General Regions', url: 'https://openstax.org/books/calculus-volume-3/pages/5-2-double-integrals-over-general-regions', description: 'Type I and type II regions, and changing the order of integration.', verified: '2026-11-27' },
 s5_3: { title: 'OpenStax Calculus Volume 3 — 5.3 Double Integrals in Polar Coordinates', url: 'https://openstax.org/books/calculus-volume-3/pages/5-3-double-integrals-in-polar-coordinates', description: 'Polar rectangles, dA = r dr dθ, and integrals over discs and rings.', verified: '2026-11-27' },
 s5_4: { title: 'OpenStax Calculus Volume 3 — 5.4 Triple Integrals', url: 'https://openstax.org/books/calculus-volume-3/pages/5-4-triple-integrals', description: 'Triple integrals over boxes and general solids, and volume as the triple integral of 1.', verified: '2026-11-27' },
 s5_5: { title: 'OpenStax Calculus Volume 3 — 5.5 Triple Integrals in Cylindrical and Spherical Coordinates', url: 'https://openstax.org/books/calculus-volume-3/pages/5-5-triple-integrals-in-cylindrical-and-spherical-coordinates', description: 'Cylindrical and spherical coordinates, their volume elements, and volumes of balls and regions bounded by cones.', verified: '2026-11-27' },
 s5_6: { title: 'OpenStax Calculus Volume 3 — 5.6 Calculating Centers of Mass and Moments of Inertia', url: 'https://openstax.org/books/calculus-volume-3/pages/5-6-calculating-centers-of-mass-and-moments-of-inertia', description: 'Mass of a solid as the triple integral of its density.', verified: '2026-11-27' },
 s5_7: { title: 'OpenStax Calculus Volume 3 — 5.7 Change of Variables in Multiple Integrals', url: 'https://openstax.org/books/calculus-volume-3/pages/5-7-change-of-variables-in-multiple-integrals', description: 'Transformations of the plane, the Jacobian, and changing variables in double integrals.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'Flat spots on the weather map', topic: 'Critical points and the second derivative test', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'The weather mast needs to know where the temperature over the plain levels off, and whether that spot is a warm peak, a cold hollow or the shape of a mountain pass.',
  lesson: 'At a critical point both partial derivatives are 0; the discriminant D = f_xx f_yy − (f_xy)² then tells a maximum, a minimum and a saddle point apart.',
  prompt: 'The weather mast models the air temperature across the plain as f(x, y) = 2x² + 2xy − y² − 8x + 2y degrees Celsius, where x and y are kilometres east and north of the mast. This field has exactly one critical point. Enter its x-coordinate, then its y-coordinate, then the discriminant D, then a code for what the point is: 1 for a local maximum, 2 for a local minimum, 3 for a saddle point.',
  answer: [1, 2, -12, 3], labels: ['x', 'y', 'D', 'code'], tolerance: 0.01,
  hints: [
   'A critical point is where f_x and f_y are both 0. Write the two partial derivatives, set each one equal to 0, and solve the two equations together.',
   'D = f_xx f_yy − (f_xy)². If D is negative the point is a saddle point. If D is positive it is a minimum when f_xx is positive and a maximum when f_xx is negative.'
  ],
  solution: 'f_x = 4x + 2y − 8 and f_y = 2x − 2y + 2. Setting both equal to 0 and solving the two equations together gives x = 1 and y = 2 (check: 4 × 1 + 2 × 2 + (−8) = 0 and 2 × 1 + (−2) × 2 + 2 = 0). The second partial derivatives are f_xx = 4, f_yy = −2 and f_xy = 2, so D = 4 × (−2) − 2² = −12. D is negative, so the point is a saddle point: code 3.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Pass marker', description: 'A small saddle-shaped token for the flat spot between two hills of warm air.' },
  sources: [source.s4_7],
  teaching: {
   intuition: 'A smooth surface z = f(x, y) is flat at its highest and lowest points: standing there, the ground slopes neither east nor north, so both partial derivatives are 0. A point where f_x = 0 and f_y = 0 is called a critical point. A flat spot need not be a top or a bottom, though. A local maximum is a point higher than every point near it, and a local minimum is lower than every point near it. Now think of a mountain pass, or a horse’s saddle: along the ridge it is the lowest point, across the ridge the highest. A critical point like that, which is neither a local maximum nor a local minimum, is a saddle point. To tell the three apart we combine the second partial derivatives at the point into one number, the discriminant D = f_xx f_yy − (f_xy)². This is the second derivative test. If D is negative, the surface curves up one way and down the other, so the point is a saddle point. If D is positive, it curves the same way in every direction: a local minimum when f_xx is positive (a bowl), a local maximum when f_xx is negative (a dome). If D is exactly 0, the test cannot decide.',
   steps: [
    'Work out the partial derivatives f_x and f_y.',
    'Set both equal to 0 and solve the two equations together. Each solution is a critical point.',
    'Work out the second partial derivatives f_xx, f_yy and f_xy at the critical point.',
    'Compute D = f_xx f_yy − (f_xy)². If D < 0 it is a saddle point; if D > 0 and f_xx > 0, a local minimum; if D > 0 and f_xx < 0, a local maximum.'
   ],
   example: {
    prompt: 'Find and classify the critical point of f(x, y) = x² + xy + y² − 3y.',
    steps: [
     'f_x = 2x + y and f_y = x + 2y − 3.',
     'Setting both to 0: the first gives y = −2x, so x − 4x − 3 = 0, which gives x = −1 and then y = 2.',
     'f_xx = 2, f_yy = 2 and f_xy = 1, so D = 2 × 2 − 1² = 3.',
     'D is positive and f_xx is positive.'
    ],
    answer: 'The critical point (−1, 2) is a local minimum.'
   },
   pitfalls: [
    'Forgetting to square f_xy: D is f_xx times f_yy, minus f_xy squared.',
    'Calling every critical point a maximum or a minimum. When D is negative the point is a saddle point, even though both partial derivatives are 0 there.',
    'Stopping at the sign of D. A positive D says the point is a maximum or a minimum; the sign of f_xx says which.'
   ]
  },
  guidance: [
   { prompt: 'Write f_x and f_y for f(x, y) = 2x² + 2xy − y² − 8x + 2y, set both equal to 0 and solve. Where is the critical point?', answer: [1, 2], labels: ['x', 'y'], explanation: 'f_x = 4x + 2y − 8 and f_y = 2x − 2y + 2. Both are 0 at x = 1, y = 2, and nowhere else.' },
   { prompt: 'Differentiate again. What are the second partial derivatives f_xx, f_yy and f_xy?', answer: [4, -2, 2], labels: ['f_xx', 'f_yy', 'f_xy'], explanation: 'f_xx is the x-derivative of f_x, which is 4; f_yy is the y-derivative of f_y, which is −2; f_xy is the y-derivative of f_x, which is 2.' },
   { prompt: 'Work out the discriminant D = f_xx f_yy − (f_xy)², then the code: 1 for a local maximum, 2 for a local minimum, 3 for a saddle point.', answer: [-12, 3], labels: ['D', 'code'], explanation: 'D = 4 × (−2) − 2² = −12. D is negative, so the point is a saddle point: code 3.' }
  ]
 },
 {
  id: 'q22', title: 'The pressure rail', topic: 'Lagrange multipliers', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'A pressure sensor can only move along its circular rail, and the crew wants the highest reading it can ever reach there.',
  lesson: 'At the best point on a constraint g(x, y) = k, the gradients line up: ∇f = λ∇g for some number λ, the Lagrange multiplier.',
  prompt: 'A pressure sensor rides on a circular rail round the weather mast: its position (x, y), in metres from the mast, always satisfies x² + y² = 100. The pressure it reads there, in pascals above the mast’s own reading, is f(x, y) = 3x + 4y. Use a Lagrange multiplier: enter the largest value of f on the rail, then the value of λ at the point where it happens (a decimal is fine).',
  answer: [50, 0.25], labels: ['largest value (Pa)', 'λ'], tolerance: 0.0005,
  hints: [
   'Take the constraint function g(x, y) = x² + y², so ∇g = ⟨2x, 2y⟩. The method says ∇f = λ∇g: each component of ∇f equals λ times the matching component of ∇g.',
   'Write x and y in terms of λ, put them into the constraint and solve for λ. The two signs of λ give two points: work out f at both and keep the larger.'
  ],
  solution: '∇f = ⟨3, 4⟩ and ∇g = ⟨2x, 2y⟩, so 3 = 2λx and 4 = 2λy, which give x = 3 ÷ (2λ) and y = 4 ÷ (2λ). Putting these into x² + y² = 100 gives (9 + 16) ÷ (4λ²) = 100, so λ² = 25 ÷ 400 and λ = 0.25 or λ = −0.25. With λ = 0.25 the point is (6, 8) and f = 3 × 6 + 4 × 8 = 50; with λ = −0.25 the point is (−6, −8) and f = −50. The largest value is 50 pascals, where λ = 0.25.',
  xp: 150, prereqs: ['q20'],
  artifact: { name: 'Rail sensor', description: 'A pressure gauge on a ring of track, parked where it reads highest.' },
  sources: [source.s4_8],
  teaching: {
   intuition: 'Often the inputs cannot go anywhere they like: a cart must stay on its rail, a fence must use a fixed length of wire. The rule that ties the inputs together is called a constraint, and we write it as g(x, y) = k for a function g and a number k. The task is to find the largest or smallest value of f among only the points that obey it. Picture walking along the constraint curve over a contour map of f. While the path cuts across the level curves of f, the value of f is still climbing or falling. At the best point the path just touches a level curve and runs along it for a moment. There the two curves share a direction, so their gradients, which are at right angles to them, lie along the same line: ∇f = λ∇g for some number λ. That number is the Lagrange multiplier, written with the Greek letter λ (lambda). The equations ∇f = λ∇g, one for each component, together with g(x, y) = k, pin down the candidate points. Work out f at each candidate and keep the largest.',
   steps: [
    'Write the constraint as g(x, y) = k, and work out ∇f and ∇g.',
    'Set each component of ∇f equal to λ times the matching component of ∇g.',
    'Solve those equations together with g(x, y) = k for x, y and λ. There may be several solutions.',
    'Work out f at every solution. The largest is the maximum on the constraint, the smallest the minimum.'
   ],
   example: {
    prompt: 'Find the largest value of f(x, y) = x + y on the circle x² + y² = 8.',
    steps: [
     'g(x, y) = x² + y², so ∇f = ⟨1, 1⟩ and ∇g = ⟨2x, 2y⟩.',
     '1 = 2λx and 1 = 2λy, so x = y = 1 ÷ (2λ).',
     'Into the constraint: 2 ÷ (4λ²) = 8, so λ² = 1/16, and λ = 1/4 or λ = −1/4.',
     'λ = 1/4 gives the point (2, 2), where f = 4; λ = −1/4 gives (−2, −2), where f = −4.'
    ],
    answer: 'The largest value is 4, at (2, 2), with λ = 1/4.'
   },
   pitfalls: [
    'Stopping at one solution. The equations find both the highest and the lowest point; compare f at each.',
    'Leaving out the constraint itself. ∇f = λ∇g alone has too many unknowns; g(x, y) = k is the equation that fixes λ.',
    'Taking the gradient of the number on the right. ∇g is the gradient of g(x, y) = x² + y², which is ⟨2x, 2y⟩.'
   ]
  },
  guidance: [
   { prompt: 'From ∇f = λ∇g: 3 = 2λx and 4 = 2λy. Put x = 3 ÷ (2λ) and y = 4 ÷ (2λ) into x² + y² = 100. What is the positive value of λ?', answer: [0.25], labels: ['λ'], explanation: '(9 + 16) ÷ (4λ²) = 100, so 4λ² × 100 = 25 and λ² = 25 ÷ 400. The positive square root is λ = 0.25.' },
   { prompt: 'With λ = 0.25, where is the sensor? Enter x, then y.', answer: [6, 8], labels: ['x', 'y'], explanation: 'x = 3 ÷ (2 × 0.25) = 6 and y = 4 ÷ (2 × 0.25) = 8. Check: 6² + 8² = 100.' },
   { prompt: 'What does the sensor read at (6, 8)?', answer: [50], labels: ['largest value (Pa)'], explanation: 'f = 3 × 6 + 4 × 8 = 50. The other point, (−6, −8), gives −50, so 50 is the largest value on the rail.' }
  ]
 },
 {
  id: 'q23', title: 'Balloon over the plain', topic: 'Chapter review: best values on the plain', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'A weather balloon is up, and the crew wants to know how fast the air warms from where it hovers, and what kind of place the field’s one flat spot is.',
  lesson: 'The length of the gradient gives the steepest rate of climb at a point; the critical point and the second derivative test give the field’s flat spot and its kind.',
  prompt: 'Mira charts the temperature over the plain as f(x, y) = −3x² − 3xy − y² + 12x + 7y + 20 degrees Celsius, with x and y in kilometres east and north of the mast. A weather balloon hovers over the point P(−1, 1). Enter the greatest rate of increase of the temperature at P, in degrees per kilometre. The field has exactly one critical point: enter its code (1 for a local maximum, 2 for a local minimum, 3 for a saddle point), then the temperature there.',
  answer: [17, 1, 33], labels: ['greatest rate (°C/km)', 'code', 'temperature (°C)'], tolerance: 0.01,
  hints: [
   'The greatest rate of increase at a point is the length of the gradient there: √(f_x² + f_y²), with both partial derivatives worked out at that point.',
   'For the critical point, set f_x = 0 and f_y = 0 and solve. Classify it with D = f_xx f_yy − (f_xy)², then put its coordinates into f.'
  ],
  solution: 'f_x = −6x − 3y + 12 and f_y = −3x − 2y + 7. At P they are 15 and 8, so ∇f = ⟨15, 8⟩ there and its length is √(225 + 64) = 17 degrees per kilometre. Both partial derivatives are 0 at (1, 2), the critical point. There f_xx = −6, f_yy = −2 and f_xy = −3, so D = −6 × (−2) − (−3)² = 3. D is positive and f_xx is negative, so the point is a local maximum: code 1. The temperature there is f(1, 2) = 33 °C.',
  xp: 150, prereqs: ['q21', 'q22'],
  artifact: { name: 'Balloon log', description: 'A page of readings from a balloon over the plain, with the warm and cold spots marked.' },
  sources: [source.s4_6, source.s4_7],
  teaching: {
   intuition: 'This review joins the chapter’s ideas about a field f(x, y). At any point the gradient ∇f = ⟨f_x, f_y⟩ points the way f rises fastest, and its length √(f_x² + f_y²) is that fastest rate. Where the gradient has length 0, both partial derivatives are 0 and the point is a critical point: no direction leads up or down there. The second derivative test then sorts the point. The discriminant D = f_xx f_yy − (f_xy)² is negative at a saddle point. It is positive at a local maximum, where f_xx is negative, and at a local minimum, where f_xx is positive. Finally, putting the critical point’s coordinates into f gives the value there, such as the temperature of a warm spot.',
   steps: [
    'At the given point, work out f_x and f_y, and take the length √(f_x² + f_y²): the greatest rate of increase there.',
    'Set f_x = 0 and f_y = 0 and solve for the critical point.',
    'Use D = f_xx f_yy − (f_xy)² and the sign of f_xx to classify it.',
    'Put the critical point into f to find the value there.'
   ],
   example: {
    prompt: 'For f(x, y) = 10 − x² − y² + 4x, find the greatest rate of increase at (−1, 4), then classify the critical point and find f there.',
    steps: [
     'f_x = −2x + 4 and f_y = −2y. At (−1, 4) they are 6 and −8, so the greatest rate is √(36 + 64) = 10.',
     'Both partial derivatives are 0 at (2, 0).',
     'f_xx = −2, f_yy = −2 and f_xy = 0, so D = 4: positive, with f_xx negative.',
     'f(2, 0) = 10 − 4 − 0 + 8 = 14.'
    ],
    answer: 'The greatest rate is 10. The point (2, 0) is a local maximum (code 1), where f = 14.'
   },
   pitfalls: [
    'Working out the gradient at the critical point for the rate. The rate is asked at P, where the gradient is not 0.',
    'Adding f_x and f_y instead of taking √(f_x² + f_y²). The rate is the length of the gradient.',
    'Forgetting the constant term when you put the critical point into f.'
   ]
  },
  guidance: [
   { prompt: 'What are f_x and f_y at P(−1, 1)?', answer: [15, 8], labels: ['f_x at P', 'f_y at P'], explanation: 'f_x = −6x − 3y + 12 and f_y = −3x − 2y + 7. Putting in x = −1 and y = 1 gives 15 and 8.' },
   { prompt: 'How long is the gradient ⟨15, 8⟩? That is the greatest rate of increase at P.', answer: [17], labels: ['greatest rate (°C/km)'], explanation: '√(225 + 64) = √289 = 17 degrees per kilometre, in the direction of the gradient.' },
   { prompt: 'Set f_x = 0 and f_y = 0 and solve. Where is the critical point?', answer: [1, 2], labels: ['x', 'y'], explanation: 'Both equations hold at x = 1, y = 2.' },
   { prompt: 'What are the discriminant D = f_xx f_yy − (f_xy)² and the code (1 maximum, 2 minimum, 3 saddle point)?', answer: [3, 1], labels: ['D', 'code'], explanation: 'D = −6 × (−2) − (−3)² = 3. D is positive and f_xx is negative, so the point is a local maximum: code 1.' },
   { prompt: 'What is the temperature f(1, 2) at the critical point?', answer: [33], labels: ['temperature (°C)'], explanation: 'Putting x = 1 and y = 2 into f gives 33 °C.' }
  ]
 },
 {
  id: 'q24', title: 'Air under the storage roof', topic: 'Double integrals over rectangles', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'The air plant has to size the vents for a new storage hall, so it needs the volume of air under the hall’s curved roof.',
  lesson: 'A double integral over a rectangle is worked out as an iterated integral: integrate in one variable with the other held fixed, then integrate the result in the other.',
  prompt: 'The roof of a new storage hall at Dome Works rises over a rectangular floor. Across the floor x runs from 0 to 4 metres and y from 1 to 3 metres, and the roof height is h(x, y) = 4 + xy metres. Enter the volume of air in the hall, the double integral of h over the floor, in cubic metres (type it without commas), then the average roof height in metres.',
  answer: [64, 8], labels: ['volume (m³)', 'average height (m)'], tolerance: 0.01,
  hints: [
   'Work from the inside out. Integrate h with respect to x from one side of the floor to the other, holding y fixed as if it were a number, the way a partial derivative holds it fixed. Then integrate the result with respect to y.',
   'The average height is the volume divided by the floor area.'
  ],
  solution: 'Inside: the integral of 4 + xy with respect to x from 0 to 4 is 4 × 4 + 8 × y = 16 + 8y, because the integral of x from 0 to 4 is (16 − 0) ÷ 2 = 8. Outside: the integral of 16 + 8y with respect to y from 1 to 3 is 16 × 2 + 8 × 4 = 64 cubic metres. The floor area is 4 × 2 = 8 square metres, so the average height is 64 ÷ 8 = 8 metres.',
  xp: 150, prereqs: ['q14'],
  artifact: { name: 'Roof survey', description: 'A grid of roof heights over the hall floor, summed into one volume.' },
  sources: [source.s5_1],
  teaching: {
   intuition: 'A single integral adds up thin strips under a curve to give an area. A double integral does the same one dimension up. Over a region R of the floor, a height h(x, y) of at least 0 describes a roof, and the double integral ∬_R h dA adds up thin columns under it: each tiny patch of floor, of area dA, times the height above it. The total is the volume between the floor and the roof. Over a rectangle we work it out as an iterated integral, one ordinary integral inside another. First integrate h with respect to x from one side to the other, holding y fixed as if it were a number. That inner integral is the area of one slice across the hall, and it depends only on y. Then integrate that slice area with respect to y. Fubini’s theorem says the order does not matter over a rectangle: x first or y first gives the same number. Dividing the double integral by the area of the rectangle gives the average value of h over it, here the average roof height.',
   steps: [
    'Write the double integral as an iterated integral: the x-integral inside, with the x-limits, and the y-integral outside, with the y-limits.',
    'Integrate the inside with respect to x, treating y as a constant. The result depends on y only.',
    'Integrate that result with respect to y between its limits. This is the double integral.',
    'For an average value, divide by the area of the rectangle.'
   ],
   example: {
    prompt: 'Find the volume under h(x, y) = 2 + xy over the square 0 ≤ x ≤ 2, 0 ≤ y ≤ 2, and the average height.',
    steps: [
     'Inside: the integral of 2 + xy with respect to x from 0 to 2 is 4 + 2y.',
     'Outside: the integral of 4 + 2y with respect to y from 0 to 2 is 8 + 4 = 12.',
     'The square has area 4, so the average height is 12 ÷ 4 = 3.'
    ],
    answer: 'The volume is 12 and the average height is 3.'
   },
   pitfalls: [
    'Integrating the y in xy during the x-integral. While x varies, y is a fixed number and comes out as a factor.',
    'Putting the y-limits on the inner integral, which runs over x. Each integral takes the limits of its own variable.',
    'Dividing by the length of one side instead of the area when finding an average value.'
   ]
  },
  guidance: [
   { prompt: 'Integrate h with respect to x from x = 0 to x = 4, holding y fixed. The result has the form A + By: enter A, then B.', answer: [16, 8], labels: ['A', 'B'], explanation: 'The 4 gives 4 × 4 = 16, and the xy gives 1 × (16 − 0) ÷ 2 × y = 8y.' },
   { prompt: 'Now integrate 16 + 8y with respect to y from y = 1 to y = 3. What is the volume?', answer: [64], labels: ['volume (m³)'], explanation: '16 × 2 + 8 × (9 − 1) ÷ 2 = 32 + 32 = 64 cubic metres.' },
   { prompt: 'What is the floor area, and the average roof height?', answer: [8, 8], labels: ['floor area (m²)', 'average height (m)'], explanation: 'The floor is 4 by 2 metres, an area of 8 square metres, and 64 ÷ 8 = 8 metres.' }
  ]
 },
 {
  id: 'q25', title: 'Painting the curved panel', topic: 'Double integrals over general regions; switching the order', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'A curved wall panel needs a coat of paint that thickens towards one edge; the stores want the litres, and the drafting robot wants the same integral set up the other way round.',
  lesson: 'Over a region bounded by curves, the inner limits are functions of the outer variable; switching the order means describing the same region the other way.',
  prompt: 'A curved wall panel at Dome Works is laid flat for painting. It is the region between the x-axis, the line x = 2 and the curve y = 3x², measured in metres. The paint goes on 2x millimetres thick at the point (x, y), and paint 1 millimetre thick over 1 square metre is 1 litre. Enter the litres of paint needed, the double integral of the thickness over the panel (type it without commas). Then switch the order so that x is integrated first: enter the top limit of y, then the value of x where the inner integral starts at the height y = 3.',
  answer: [24, 12, 1], labels: ['paint (L)', 'top limit of y (m)', 'x where it starts (m)'], tolerance: 0.01,
  hints: [
   'As a type I region, x runs from 0 to the right edge and, for each x, y runs from 0 up to the curve. Integrate the thickness with respect to y first.',
   'To switch, read the region sideways: y runs from 0 to the highest point of the curve, and for each y, x runs from the curve (solve its equation for x) to the right edge.'
  ],
  solution: 'Type I: for each x from 0 to 2, y runs from 0 to 3x². Inside: the integral of 2x with respect to y from 0 to 3x² is 2x × 3x² = 6x³. Outside: the integral of 6x³ from 0 to 2 is 6 × 16 ÷ 4 = 24 litres. Switched: the curve is highest at x = 2, where y = 12, so y runs from 0 to 12. For each y, x runs from the curve, x = √(y ÷ 3), to 2. At y = 3 the inner integral starts at x = √(3 ÷ 3) = 1.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Paint chart', description: 'A curved panel drawn twice, once sliced upright and once sliced sideways.' },
  sources: [source.s5_2],
  teaching: {
   intuition: 'Most regions are not rectangles. A region in the plane is a type I region when it lies between two upright lines, x = a and x = b, and for each x the values of y run from a lower curve to an upper curve. It is a type II region when it lies between two level lines and, for each y, x runs from a left curve to a right curve. For a type I region the inner integral is over y, and its limits are the two curves, written in terms of x; the outer integral, over x, has number limits. Many regions are of both types, and the same double integral can be written either way. Switching the order of integration means reading the region sideways. The outer limits of y are the lowest and highest y in the whole region. Then, for a fixed y, find where x enters and leaves the region: solving a boundary curve’s equation for x gives each new inner limit. The value of the double integral does not change, but one order is often much easier to work.',
   steps: [
    'Sketch the region and decide how to describe it: type I (x outside, y inside) or type II (y outside, x inside).',
    'For a type I region, integrate with respect to y first, between the lower and upper curves, then with respect to x between the two number limits.',
    'To switch the order, take the outer limits of y from the lowest and highest y in the region.',
    'For a fixed y, find where x enters and leaves the region by solving each boundary curve for x. Those are the inner limits.'
   ],
   example: {
    prompt: 'Find ∬ x dA over the region between the x-axis, the line x = 3 and the line y = 2x, then write the limits the other way round.',
    steps: [
     'Type I: x runs from 0 to 3 and y from 0 to 2x. The inner integral of x with respect to y is x × 2x = 2x².',
     'Outer: the integral of 2x² from 0 to 3 is 2 × 27 ÷ 3 = 18.',
     'Sideways: the line reaches y = 6 at x = 3, so y runs from 0 to 6, and for each y, x runs from the line, x = y ÷ 2, to 3.'
    ],
    answer: 'The integral is 18. Switched, y runs from 0 to 6 and x from y ÷ 2 to 3.'
   },
   pitfalls: [
    'Using number limits on the inner integral of a curved region. The inner limits are the boundary curves, written in terms of the outer variable.',
    'Keeping the old outer limits after switching. The top limit of y is the highest point of the whole region, not the right-hand x-limit.',
    'Solving the curve for x the wrong way round: a curve y = cx² gives x = √(y ÷ c), not y ÷ c.'
   ]
  },
  guidance: [
   { prompt: 'For a fixed x, integrate the thickness with respect to y from 0 to 3x². The result is a number times x³: enter the number.', answer: [6], labels: ['number times x³'], explanation: 'The thickness does not change with y, so the inner integral is 2x × 3x² = 6x³.' },
   { prompt: 'Integrate that from x = 0 to x = 2. How many litres of paint is that?', answer: [24], labels: ['paint (L)'], explanation: 'The integral of x³ is x⁴ ÷ 4, so 6 × 16 ÷ 4 = 24 litres.' },
   { prompt: 'Read the region sideways. What is the top limit of y, and where does x start at the height y = 3?', answer: [12, 1], labels: ['top limit of y (m)', 'x where it starts (m)'], explanation: 'The highest point is y = 3x² at x = 2, which is 12. Solving y = 3x² for x gives x = √(y ÷ 3), so at y = 3 the inner integral starts at x = 1 and runs to 2.' }
  ]
 },
 {
  id: 'q26', title: 'The round heating mat', topic: 'Double integrals in polar coordinates', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'The floor of a round dome gets a heating mat shaped like a slice of a ring, and the power plant wants its total heat output.',
  lesson: 'Over discs, rings and their slices, use polar coordinates: x² + y² = r², and dA = r dr dθ.',
  prompt: 'A heating mat on a round dome floor covers the points between 1 m and 3 m from the centre with polar angle θ from 0 to π/2. Its heat output is f(x, y) = x² + y² watts per square metre, with x and y in metres from the centre. Enter the inner integral of f r with respect to r, from r = 1 to r = 3. Then write the total heat output, the double integral of f over the mat, as k·π watts and enter k (it may be a decimal, such as 2.25).',
  answer: [20, 10], labels: ['inner integral', 'k'], tolerance: 0.005,
  hints: [
   'In polar coordinates x = r cos θ and y = r sin θ, so x² + y² = r², and the area piece dA becomes r dr dθ. Do not forget the extra factor r.',
   'The inner integral over r is a plain number. Integrating a number over θ multiplies it by the width of the angle range.'
  ],
  solution: 'In polar coordinates dA = r dr dθ. f = x² + y² = r², so the inner integral is the integral of r² × r = r³ from 1 to 3, which is (81 − 1) ÷ 4 = 20. The angle runs from 0 to π/2, a width of π/2, so the total is 20 × π/2 = 10π watts, and k = 10.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'Heating mat', description: 'A curved strip of warm floor, cut along two circles and two straight lines from the centre.' },
  sources: [source.s5_3],
  teaching: {
   intuition: 'Round regions are awkward in x and y: their limits are square roots. Polar coordinates describe a point by its distance r from the centre and its angle θ, measured anticlockwise from the positive x-axis in radians. They are linked to x and y by x = r cos θ and y = r sin θ, so x² + y² = r². A ring is then simply all r between an inner and an outer radius, and a slice of a ring adds a range of θ: constant limits, like a rectangle. One thing changes in the area piece. A small polar patch is nearly a rectangle with sides dr and r dθ, because an arc at distance r is r times its angle. So dA = r dr dθ, and the double integral becomes the integral of f(r cos θ, r sin θ) r dr dθ. Forgetting that extra factor r is the classic mistake. When the limits are constants and the integrand depends only on r, the θ-integral just multiplies by the width of the angle range, which is why such answers come out as a number times π.',
   steps: [
    'Describe the region in polar coordinates: r from its inner to its outer radius, θ from its first angle to its last.',
    'Write the integrand with x = r cos θ and y = r sin θ; x² + y² becomes r².',
    'Multiply by the extra factor r, then integrate with respect to r.',
    'Integrate the result with respect to θ. A result that does not depend on θ is simply multiplied by the width of the angle range.'
   ],
   example: {
    prompt: 'Find the area of the quarter disc of radius 2 with θ from 0 to π/2, as k·π.',
    steps: [
     'The integrand is 1, so the inner integral is the integral of r from 0 to 2, which is 4 ÷ 2 = 2.',
     'The angle range is π/2 wide, so the area is 2 × π/2 = π.'
    ],
    answer: 'k = 1: the area is π, a quarter of the whole disc’s 4π.'
   },
   pitfalls: [
    'Leaving out the factor r: integrating f dr dθ instead of f r dr dθ.',
    'Using degrees for θ. The width of the angle range must be in radians, such as π/2 for a quarter turn.',
    'Writing x² + y² as r instead of r².'
   ]
  },
  guidance: [
   { prompt: 'Write f in polar coordinates and multiply by the extra factor r. What is its integral with respect to r from r = 1 to r = 3?', answer: [20], labels: ['inner integral'], explanation: 'Here f = x² + y² = r², so the inner integral is the integral of r² × r = r³ from 1 to 3, which is (81 − 1) ÷ 4 = 20.' },
   { prompt: 'The angle runs from θ = 0 to θ = π/2. How wide is that range, as a number times π?', answer: [0.5], labels: ['width in units of π'], explanation: 'π/2 − 0 = π/2, which is 0.5 times π.' },
   { prompt: 'Multiply the inner integral by the width of the angle range. What is k in k·π?', answer: [10], labels: ['k'], explanation: '20 × π/2 = 10π, so k = 10.' }
  ]
 },
 {
  id: 'q27', title: 'The regolith ramp', topic: 'Triple integrals', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'A ramp of packed regolith is going in at an airlock, and the crane crew needs its volume and how many tonnes it weighs.',
  lesson: 'A triple integral adds up over a solid: the integral of 1 gives the volume, and the integral of the density gives the mass.',
  prompt: 'Dome Works pours a ramp of packed regolith up to an airlock. It fills the solid where x runs from 0 to 4, y from 0 to 2, and z from 0 up to the sloping top z = x, all in metres. The packing is denser towards the back wall: the density is δ(x, y, z) = 1 + y tonnes per cubic metre. Enter the volume of the ramp in cubic metres, then its mass in tonnes (decimals are fine).',
  answer: [16, 32], labels: ['volume (m³)', 'mass (t)'], tolerance: 0.005,
  hints: [
   'The volume is the triple integral of 1 over the solid. Integrate z first: it runs from 0 to the sloping top, so the innermost integral is the height of the ramp at (x, y). Then integrate y, then x.',
   'The mass is the triple integral of the density. The density does not depend on z, so the innermost integral is the density times the height. Then integrate y, then x, as before.'
  ],
  solution: 'Volume: the integral of 1 with respect to z from 0 to x is x. Integrating that with respect to y from 0 to 2 gives 2x, and integrating with respect to x from 0 to 4 gives 2 × 16 ÷ 2 = 16 cubic metres. Mass: the integral of 1 + y with respect to z from 0 to x is (1 + y) × x. Integrating with respect to y from 0 to 2 gives (1 × 2 + 4 ÷ 2) × x = 4x, and integrating with respect to x from 0 to 4 gives 4 × 16 ÷ 2 = 32 tonnes.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'Ramp core sample', description: 'A tube of packed regolith, looser at the front and denser at the back.' },
  sources: [source.s5_4, source.s5_6],
  teaching: {
   intuition: 'A triple integral ∭_E f dV adds up a quantity over a solid E in space, one tiny box of volume dV at a time. If f = 1 everywhere, each box adds its own volume, so the triple integral of 1 over E is the volume of E. If f is a density, the mass per cubic metre at each point, written δ(x, y, z) with the Greek letter δ (delta), each box adds its own mass, and the triple integral of δ is the total mass. We work it out as three ordinary integrals, one inside the next. For a solid that sits on a floor region and rises from z = 0 to a top surface, integrate with respect to z first, from 0 up to that surface, holding x and y fixed. That leaves something that depends on x and y only, which is then a double integral over the floor, worked as before. For a box all the limits are numbers and the order is free; for a ramp or a wedge the top depends on x or y, so the z-integral must be the innermost.',
   steps: [
    'Describe the solid: the floor region in x and y, and z from the bottom surface to the top surface.',
    'Integrate with respect to z first, between those surfaces, holding x and y fixed.',
    'Integrate the result over the floor region: with respect to y, then with respect to x.',
    'Use 1 as the integrand for a volume, and the density δ for a mass.'
   ],
   example: {
    prompt: 'A block fills 0 ≤ x ≤ 2, 0 ≤ y ≤ 3, 0 ≤ z ≤ 1, with density δ = 1 + z. Find its volume and its mass.',
    steps: [
     'Volume: the triple integral of 1 over the block is 2 × 3 × 1 = 6.',
     'Mass: the integral of 1 + z with respect to z from 0 to 1 is 1 + 1/2 = 3/2.',
     'The y-integral and the x-integral multiply that by 3 and by 2: 3/2 × 6 = 9.'
    ],
    answer: 'The volume is 6 and the mass is 9.'
   },
   pitfalls: [
    'Putting the sloping top on the outer integral. A limit that depends on x must belong to an integral inside the x-integral.',
    'Multiplying the volume by the density at one point. When the density changes from place to place, it must go inside the integral.',
    'Treating x or y as variables inside the z-integral. While z varies, x and y are fixed numbers.'
   ]
  },
  guidance: [
   { prompt: 'Integrate 1 with respect to z (from 0 to x), then with respect to y (from 0 to 2). The result is a number times x: enter the number.', answer: [2], labels: ['number times x'], explanation: 'The z-integral is the height x; the y-integral multiplies it by 2, giving 2x.' },
   { prompt: 'Integrate that with respect to x from 0 to 4. What is the volume?', answer: [16], labels: ['volume (m³)'], explanation: '2 × 16 ÷ 2 = 16 cubic metres.' },
   { prompt: 'Now the density: the z-integral of 1 + y is (1 + y) × x. Integrate that with respect to y from 0 to 2. The result is a number times x: enter the number.', answer: [4], labels: ['number times x'], explanation: 'The integral of 1 + y from 0 to 2 is 1 × 2 + 4 ÷ 2 = 4, and 4 × x = 4x.' },
   { prompt: 'Integrate that with respect to x from 0 to 4. What is the mass?', answer: [32], labels: ['mass (t)'], explanation: '4 × 16 ÷ 2 = 32 tonnes.' }
  ]
 },
 {
  id: 'q28', title: 'Casting in round coordinates', topic: 'Cylindrical and spherical coordinates', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'The foundry casts round parts all day, and it wants each volume as a clean multiple of π before it orders material.',
  lesson: 'Round solids are easier in cylindrical coordinates, with dV = r dz dr dθ, or spherical coordinates, with dV = ρ² sin φ dρ dφ dθ.',
  prompt: 'Dome Works is casting a dome shell: the part above the floor of the space between two spheres round the origin, of radius 1 m and 3 m. Find its volume in spherical coordinates: the radial integral is the integral of ρ² with respect to ρ. Enter that radial integral, then k, where the volume is k·π cubic metres (a fraction such as 38/3 is fine, or a decimal to 4 places).',
  answer: [8.666666667, 17.333333333], labels: ['radial integral', 'k'], tolerance: 0.00005,
  hints: [
   'In cylindrical coordinates dV = r dz dr dθ. In spherical coordinates dV = ρ² sin φ dρ dφ dθ, where φ is the angle down from the positive z-axis. The extra factor in front is the part people forget.',
   'All the limits here are constants, so the triple integral is a product of three single integrals: one for the distance from the axis or the origin, one for the height or for φ, and one for θ, which runs from 0 to 2π.'
  ],
  solution: 'The radial integral is the integral of ρ² from 1 to 3: (27 − 1) ÷ 3 = 26/3. The integral of sin φ from 0 to π/2 (straight up to the floor) is 1 − cos(π/2) = 1 − 0 = 1. The angle θ runs all the way round, from 0 to 2π. The volume is 26/3 × 1 × 2π = (52/3)π cubic metres, so k = 52/3.',
  xp: 150, prereqs: ['q26', 'q27'],
  artifact: { name: 'Foundry pattern', description: 'A set of wooden moulds: a pipe sleeve, a lens and a shell.' },
  sources: [source.s5_5],
  teaching: {
   intuition: 'Polar coordinates handled round floors; space needs two versions. Cylindrical coordinates (r, θ, z) are polar coordinates in the floor plus the ordinary height z: x = r cos θ, y = r sin θ, z = z. A tiny box is a polar patch of area r dr dθ times a height dz, so dV = r dz dr dθ. They suit cylinders, pipes and anything round an upright axis. Spherical coordinates (ρ, θ, φ) describe a point by its distance ρ (the Greek letter rho) from the origin, the same angle θ as polar coordinates, and an angle φ (phi) measured down from the positive z-axis, from 0 straight up to π straight down, so φ = π/2 is the floor. Then x = ρ sin φ cos θ, y = ρ sin φ sin θ and z = ρ cos φ, and a tiny box has volume dV = ρ² sin φ dρ dφ dθ. They suit balls, shells and cones from the origin: the ball of radius 2 is just ρ ≤ 2, and φ = π/3 is a cone opening upwards at the angle π/3 from the z-axis. When every limit is a constant, the triple integral splits into three single integrals multiplied together.',
   steps: [
    'Pick the coordinates that fit: cylindrical for shapes round an upright axis, spherical for balls, shells and cones from the origin.',
    'Write the limits: r or ρ between the radii, z or φ for the height or the cone, and θ from 0 to 2π for a full turn.',
    'Include the extra factor in dV: r for cylindrical, ρ² sin φ for spherical.',
    'With constant limits, multiply the three single integrals: the radial one, the one in z or φ, and the one in θ.'
   ],
   example: {
    prompt: 'Find the volume of a ball of radius 3 m as k·π cubic metres, in spherical coordinates.',
    steps: [
     'The ball is 0 ≤ ρ ≤ 3, 0 ≤ φ ≤ π, 0 ≤ θ ≤ 2π.',
     'The radial integral of ρ² from 0 to 3 is 27 ÷ 3 = 9; the integral of sin φ from 0 to π is 1 − cos π = 2; θ gives 2π.',
     'The volume is 9 × 2 × 2π = 36π cubic metres.'
    ],
    answer: 'k = 36, which matches the ball formula 4/3 × π × 27.'
   },
   pitfalls: [
    'Dropping the extra factor, r or ρ² sin φ, from dV. Without it the integral does not measure volume.',
    'Measuring φ from the floor instead of from the positive z-axis: φ = 0 is straight up and φ = π/2 is the floor.',
    'Letting θ run only to π. A full turn round the axis is 0 to 2π.'
   ]
  },
  guidance: [
   { prompt: 'Set up the volume in spherical coordinates. What is the radial integral?', answer: [8.666666667], labels: ['radial integral'], explanation: 'The radial integral is the integral of ρ² from 1 to 3: (27 − 1) ÷ 3 = 26/3.' },
   { prompt: 'What is the integral of sin φ with respect to φ, from 0 to π/2?', answer: [1], labels: ['middle integral'], explanation: 'The integral of sin φ from 0 to π/2 (straight up to the floor) is 1 − cos(π/2) = 1 − 0 = 1.' },
   { prompt: 'Multiply the radial integral, that integral and the 2π from θ. What is k in k·π?', answer: [17.333333333], labels: ['k'], explanation: '26/3 × 1 × 2 = 52/3, so the volume is (52/3)π cubic metres.' }
  ]
 },
 {
  id: 'q29', title: 'Weighing the habitat dome', topic: 'Chapter review: the mass of a dome', tier: 'Intermediate', sector: 'Dome Works',
  brief: 'The main habitat dome is a thick shield of packed regolith, and the engineers must know how much space it fills and how heavy it is before they trust the floor beneath it.',
  lesson: 'A dome shell is a box in spherical coordinates: its volume is the integral of ρ² sin φ, and its mass takes the density in as a factor.',
  prompt: 'The main habitat dome is a thick shell: the part above the floor of the space between two spheres centred at the middle of the floor, of inner radius 6 m and outer radius 7 m. Its shielding is packed denser towards the inside: the density is δ = 6 ÷ ρ tonnes per cubic metre, where ρ is the distance from the centre. Enter the volume of the shell as k·π cubic metres (enter k: a fraction such as 98/3 is fine, or a decimal to 4 places), then the mass of the shell as k·π tonnes (enter that k).',
  answer: [84.666666667, 78], labels: ['volume k', 'mass k'], tolerance: 0.00005,
  hints: [
   'Use spherical coordinates: ρ from the inner radius to the outer, φ from 0 (straight up) to π/2 (the floor), and θ from 0 to 2π, with dV = ρ² sin φ dρ dφ dθ.',
   'All the limits are constants, so each triple integral is a product of three single integrals. For the mass, multiply the density by ρ² before you integrate over ρ.'
  ],
  solution: 'Volume: the integral of ρ² from 6 to 7 is (343 − 216) ÷ 3 = 127/3; the integral of sin φ from 0 to π/2 is 1; the integral of 1 from 0 to 2π is 2π. The volume is 127/3 × 1 × 2π = (254/3)π cubic metres. Mass: the density times ρ² is 6 ÷ ρ × ρ² = 6ρ, and its integral from 6 to 7 is 6 × (49 − 36) ÷ 2 = 39. The mass is 39 × 1 × 2π = 78π tonnes.',
  xp: 150, prereqs: ['q28'],
  artifact: { name: 'Dome load certificate', description: 'The signed sheet that says the habitat dome’s weight is known and safe.' },
  sources: [source.s5_1, source.s5_5, source.s5_6],
  teaching: {
   intuition: 'This review puts the chapter together on the biggest build at the outpost. A dome shell above the floor, with inner radius a and outer radius b, is in spherical coordinates the box a ≤ ρ ≤ b, 0 ≤ φ ≤ π/2, 0 ≤ θ ≤ 2π. All its limits are constants. Over a rectangle, a double integral of a product of a function of x and a function of y is the product of the two single integrals; in the same way, this triple integral splits into a product of three single integrals. The volume is the triple integral of 1, so with dV = ρ² sin φ dρ dφ dθ it is the integral of ρ², times the integral of sin φ, times 2π. The mass is the triple integral of the density δ. When δ depends only on ρ, the distance from the centre, it joins the ρ² in the radial integral and nothing else changes.',
   steps: [
    'Write the shell as a box in spherical coordinates: ρ between the radii, φ from 0 to π/2, θ from 0 to 2π.',
    'Volume: multiply the integral of ρ², the integral of sin φ and 2π.',
    'Mass: multiply the density by ρ², integrate over ρ, then multiply by the same φ and θ factors.',
    'Write each result as k·π and read off k.'
   ],
   example: {
    prompt: 'A half shell above the floor between radii 1 m and 2 m has density δ = 3 ÷ ρ. Find its volume and its mass as multiples of π.',
    steps: [
     'The integral of ρ² from 1 to 2 is (8 − 1) ÷ 3 = 7/3. Times 1 and times 2π, the volume is 14/3 π.',
     'δ × ρ² = 3ρ, and its integral from 1 to 2 is 3 × (4 − 1) ÷ 2 = 9/2. Times 1 and times 2π, the mass is 9π.'
    ],
    answer: 'The volume is 14/3 π cubic metres and the mass is 9π.'
   },
   pitfalls: [
    'Multiplying the volume by the density at one radius. The density changes with ρ, so it must go inside the radial integral.',
    'Letting φ run to π, which gives a whole shell instead of the half above the floor.',
    'Forgetting the ρ² from dV because the density already has a ρ in it: δ × ρ² is the radial integrand.'
   ]
  },
  guidance: [
   { prompt: 'For the volume, what is the integral of ρ² with respect to ρ from 6 to 7?', answer: [42.333333333], labels: ['radial integral'], explanation: '(343 − 216) ÷ 3 = 127/3.' },
   { prompt: 'Multiply by the integral of sin φ from 0 to π/2, which is 1, and by 2π from θ. What is k for the volume?', answer: [84.666666667], labels: ['volume k'], explanation: '127/3 × 1 × 2 = 254/3, so the volume is (254/3)π cubic metres.' },
   { prompt: 'For the mass, the density times ρ² is 6ρ. What is its integral with respect to ρ from 6 to 7?', answer: [39], labels: ['radial integral'], explanation: '6 × (49 − 36) ÷ 2 = 39.' },
   { prompt: 'Multiply by 1 and by 2π as before. What is k for the mass?', answer: [78], labels: ['mass k'], explanation: '39 × 1 × 2 = 78, so the mass is 78π tonnes.' }
  ]
 },
 {
  id: 'q30', title: 'The slanted cable plate', topic: 'Change of variables and the Jacobian', tier: 'Advanced', sector: 'Cable Yard',
  brief: 'A steel plate in the Cable Yard is a slanted four-sided shape, and the riggers need the total load the cables put on it.',
  lesson: 'New variables u and v turn a slanted region into a rectangle; the Jacobian says how much area each du dv stands for.',
  prompt: 'In the Cable Yard a steel plate lies between the lines x + y = 1 and x + y = 3, and between the lines x − y = 0 and x − y = 2, with x and y in metres. The cables load it with f(x, y) = x + y newtons per square metre. Change variables to u = x + y and v = x − y. Enter ∂(u, v)/∂(x, y), then the Jacobian J = ∂(x, y)/∂(u, v) (a decimal), then the total load on the plate, the double integral of f, in newtons.',
  answer: [-2, -0.5, 4], labels: ['∂(u, v)/∂(x, y)', 'J', 'total load (N)'], tolerance: 0.0005,
  hints: [
   '∂(u, v)/∂(x, y) is the 2 × 2 determinant u_x v_y − u_y v_x of the partial derivatives. The Jacobian J = ∂(x, y)/∂(u, v) of the way back is 1 divided by it.',
   'In u and v the plate is a rectangle, so the double integral of f becomes the integral of u × |J| with constant limits. Use the size of J, without its sign.'
  ],
  solution: 'u_x = 1, u_y = 1, v_x = 1 and v_y = −1, so ∂(u, v)/∂(x, y) = 1 × (−1) − 1 × 1 = −2. The Jacobian of the way back is J = 1 ÷ (−2) = −0.5, and |J| = 0.5. In u and v the plate is the rectangle 1 ≤ u ≤ 3, 0 ≤ v ≤ 2, and f = u. The integral of u from 1 to 3 is (9 − 1) ÷ 2 = 4, and v adds a factor 2, giving 8. The total load is 8 × 0.5 = 4 newtons.',
  xp: 200, prereqs: ['q28'],
  artifact: { name: 'Skewed grid', description: 'A plate scored with slanted lines, so that every cell is a small parallelogram of the same area.' },
  sources: [source.s5_7],
  teaching: {
   intuition: 'A region bounded by slanted lines is awkward in x and y but simple in the right new variables. If a plate lies between two parallel lines ax + by = constant and between two parallel lines cx + dy = constant, then the new variables u = ax + by and v = cx + dy turn it into a rectangle in u and v, with constant limits. This is a change of variables. The catch is area: a small rectangle du dv in the new variables is a small parallelogram on the plate, with a different area. The scale factor is the Jacobian J = ∂(x, y)/∂(u, v) = x_u y_v − x_v y_u, where x_u is the partial derivative of x with respect to u, and so on. It is a 2 × 2 determinant: for four numbers p, q in the first row and r, s in the second, the determinant is ps − qr. Then dA = |J| du dv, using the size of J and not its sign. When u and v are given in terms of x and y, work the other way first: ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x, which for u = ax + by and v = cx + dy is ad − bc. Solving for x and y and differentiating shows that the Jacobian of the way back is 1 divided by that number.',
   steps: [
    'Choose u and v from the boundary lines, so the region becomes a rectangle in u and v, and read off its limits.',
    'Work out ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x.',
    'The Jacobian of the way back is J = 1 ÷ ∂(u, v)/∂(x, y). Use its size, |J|.',
    'Write the integrand in u and v, multiply by |J|, and integrate over the rectangle.'
   ],
   example: {
    prompt: 'Find the area of the region between the lines 2x + y = 0 and 2x + y = 2, and between x + y = 0 and x + y = 1.',
    steps: [
     'Take u = 2x + y and v = x + y: the region is 0 ≤ u ≤ 2, 0 ≤ v ≤ 1.',
     '∂(u, v)/∂(x, y) = 2 × 1 − 1 × 1 = 1, so J = 1 ÷ 1 = 1.',
     'The area is the integral of 1 × |J| over the rectangle: 2 × 1 × 1 = 2.'
    ],
    answer: 'The area is 2 square units.'
   },
   pitfalls: [
    'Using ∂(u, v)/∂(x, y) itself as the area factor. The factor for du dv is its reciprocal, J = ∂(x, y)/∂(u, v).',
    'Keeping the sign of J in the integral. An area is never negative: use |J|.',
    'Mixing up the order in the determinant. It is u_x v_y − u_y v_x: the first diagonal minus the second.'
   ]
  },
  guidance: [
   { prompt: 'Take the partial derivatives of u = x + y and v = x − y. What is ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x?', answer: [-2], labels: ['∂(u, v)/∂(x, y)'], explanation: 'u_x = 1, u_y = 1, v_x = 1, v_y = −1: 1 × (−1) − 1 × 1 = −2.' },
   { prompt: 'What is the Jacobian J = ∂(x, y)/∂(u, v) of the way back?', answer: [-0.5], labels: ['J'], explanation: 'J = 1 ÷ (−2) = −0.5. Each small rectangle du dv in the new variables stands for an area |J| du dv on the plate.' },
   { prompt: 'In u and v the plate is the rectangle 1 ≤ u ≤ 3, 0 ≤ v ≤ 2. What is the integral of u over it, before the factor |J|?', answer: [8], labels: ['integral of u'], explanation: 'The integral of u from 1 to 3 is (9 − 1) ÷ 2 = 4, and the v-integral multiplies it by 2: 8.' },
   { prompt: 'Multiply by |J|. What is the total load on the plate?', answer: [4], labels: ['total load (N)'], explanation: '8 × 0.5 = 4 newtons.' }
  ]
 }
);
})();
