/* Calculus 3: many variables missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/calc3/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Lines, planes and paths · Basic, 100 XP · sector 'Orbital Dock' · Chapter review: docking a shuttle [2.5, 3.4]
     q12  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Functions of two variables and level curves [4.1]
     q13  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Limits along paths [4.2]
     q14  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Partial derivatives [4.3]
     q15  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Second and mixed partial derivatives [4.3]
     q16  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Tangent planes and linear approximation [4.4]
     q17  ch 3 Surfaces and slopes · Intermediate, 150 XP · sector 'Terrain Lab' · Chapter review: reading a terrain map [4.1, 4.3]
     q18  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · The chain rule for several variables [4.5]
     q19  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · Directional derivatives and the gradient [4.6]
     q20  ch 4 Gradients and best values · Intermediate, 150 XP · sector 'Weather Mast' · Steepest ascent [4.6] */
(function(){
'use strict';
/* OpenStax Calculus Volume 3 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient
   Link to the section page itself: https://openstax.org/books/calculus-volume-3/pages/<section-slug> */
const source = {
 s2_5: { title: 'OpenStax Calculus Volume 3 — 2.5 Equations of Lines and Planes in Space', url: 'https://openstax.org/books/calculus-volume-3/pages/2-5-equations-of-lines-and-planes-in-space', description: 'Vector and parametric equations of lines, and the equation of a plane through a point with a normal vector.', verified: '2026-11-27' },
 s3_4: { title: 'OpenStax Calculus Volume 3 — 3.4 Motion in Space', url: 'https://openstax.org/books/calculus-volume-3/pages/3-4-motion-in-space', description: 'Velocity as the derivative of the position vector, speed as its magnitude, and acceleration.', verified: '2026-11-27' },
 s4_1: { title: 'OpenStax Calculus Volume 3 — 4.1 Functions of Several Variables', url: 'https://openstax.org/books/calculus-volume-3/pages/4-1-functions-of-several-variables', description: 'Functions of two variables, their domains, graphs, level curves and contour maps.', verified: '2026-11-27' },
 s4_2: { title: 'OpenStax Calculus Volume 3 — 4.2 Limits and Continuity', url: 'https://openstax.org/books/calculus-volume-3/pages/4-2-limits-and-continuity', description: 'Limits of functions of two variables, including limits that fail to exist because different paths give different values.', verified: '2026-11-27' },
 s4_3: { title: 'OpenStax Calculus Volume 3 — 4.3 Partial Derivatives', url: 'https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives', description: 'Partial derivatives, higher-order and mixed partial derivatives, and Clairaut’s theorem.', verified: '2026-11-27' },
 s4_4: { title: 'OpenStax Calculus Volume 3 — 4.4 Tangent Planes and Linear Approximations', url: 'https://openstax.org/books/calculus-volume-3/pages/4-4-tangent-planes-and-linear-approximations', description: 'The tangent plane to a surface z = f(x, y) and the linear approximation it gives near a point.', verified: '2026-11-27' },
 s4_5: { title: 'OpenStax Calculus Volume 3 — 4.5 The Chain Rule', url: 'https://openstax.org/books/calculus-volume-3/pages/4-5-the-chain-rule', description: 'The chain rule for functions of several variables, including dz/dt = ∂z/∂x dx/dt + ∂z/∂y dy/dt.', verified: '2026-11-27' },
 s4_6: { title: 'OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient', url: 'https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient', description: 'Directional derivatives, the gradient, D_u f = ∇f · u, and the gradient as the direction of greatest increase.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'Threading the docking face', topic: 'Chapter review: docking a shuttle', tier: 'Basic', sector: 'Orbital Dock',
  brief: 'A supply shuttle is coasting in on a curved path, and the dock crew needs the moment it crosses the docking face and how fast it is going then.',
  lesson: 'To find when a moving object crosses a plane, put its position into the plane’s equation and solve for t; its speed then is the magnitude of r′(t).',
  prompt: 'A supply shuttle coasts in towards the Docking Ring. Its position t seconds after its last burn is r(t) = ⟨2t, 3t, t²⟩, in metres, and the ring’s flat docking face lies in the plane x + 2y + z = 33. The shuttle passes through the face at the moment its three coordinates satisfy the plane’s equation. Enter that time t, which is positive, in seconds, then the shuttle’s speed at that moment in metres per second.',
  answer: [3, 7], labels: ['meeting time (s)', 'speed (m/s)'], tolerance: 0.01,
  hints: [
   'Put the three components of r(t) in place of x, y and z in the plane’s equation. That leaves one quadratic equation in t: move everything to one side, solve it, and keep the positive root.',
   'The velocity is r′(t), differentiated one component at a time. The speed is the magnitude of the velocity: the square root of the sum of the squares of its components.'
  ],
  solution: 'Substituting x = 2t, y = 3t and z = t² gives 2t + 6t + t² = 33, so t² + 8t − 33 = 0. This factors as (t − 3)(t + 11) = 0, and the positive root is t = 3. The velocity is r′(t) = ⟨2, 3, 2t⟩, which at t = 3 is ⟨2, 3, 6⟩. The speed is √(2² + 3² + 6²) = √49 = 7 metres per second.',
  xp: 100, prereqs: ['q09', 'q10'],
  sources: [source.s2_5, source.s3_4],
  teaching: {
   intuition: 'Two ideas from this chapter meet at the dock. A plane is every point (x, y, z) whose coordinates satisfy one equation, such as 2x − y + 3z = 6. A moving shuttle has a position vector r(t) = ⟨x(t), y(t), z(t)⟩: one point in space for each time t. The shuttle is on the plane at exactly the moments when its three coordinates make the plane’s equation true. So we put x(t), y(t) and z(t) into the equation, and what is left is an ordinary equation in the one unknown t. Once we know the moment, the velocity r′(t), found by differentiating each component, tells us how the shuttle is moving then, and its magnitude, the speed, tells us how fast.',
   steps: [
    'Replace x, y and z in the plane’s equation by the three components of r(t).',
    'Collect the terms into one equation in t and solve it. Keep the root that makes sense: here, a positive time.',
    'Differentiate each component of r(t) to get the velocity r′(t), and put in that time.',
    'The speed is the magnitude of the velocity: the square root of the sum of the squares of its three components.'
   ],
   example: {
    prompt: 'A probe moves along r(t) = ⟨t, 2t, t²⟩ metres, t seconds after launch. When does it pass through the plane x + y + z = 4, and how fast is it moving then?',
    steps: [
     'Substitute: t + 2t + t² = 4, so t² + 3t − 4 = 0, which factors as (t − 1)(t + 4) = 0. The positive root is t = 1.',
     'The velocity is r′(t) = ⟨1, 2, 2t⟩, which at t = 1 is ⟨1, 2, 2⟩.',
     'The speed is √(1 + 4 + 4) = √9 = 3.'
    ],
    answer: 'After 1 second, moving at 3 metres per second.'
   },
   pitfalls: [
    'Keeping the negative root. A time before the burn is not a time on this approach.',
    'Using the position r(t) instead of the velocity r′(t) for the speed. The speed comes from the derivative.',
    'Forgetting that the derivative of t² is 2t, so the third component of the velocity changes with time.'
   ]
  },
  guidance: [
   { prompt: 'Substitute r(t) into x + 2y + z = 33. The equation becomes t² + Kt − 33 = 0. What is K, the number in front of t?', answer: [8], labels: ['coefficient of t'], explanation: 'x = 2t and y = 3t, so x + 2y = 2t + 6t = 8t. With z = t² the equation is t² + 8t − 33 = 0.' },
   { prompt: 'Solve t² + 8t − 33 = 0. What is its positive root?', answer: [3], labels: ['meeting time (s)'], explanation: 't² + 8t − 33 = (t − 3)(t + 11), so the roots are 3 and −11. Time after the burn is positive, so t = 3.' },
   { prompt: 'The velocity is r′(t) = ⟨2, 3, 2t⟩. What is its third component at t = 3?', answer: [6], labels: ['third velocity component (m/s)'], explanation: 'The derivative of t² is 2t, and 2 × 3 = 6. The other two components stay 2 and 3: the derivative of 2t is 2, and of 3t is 3.' },
   { prompt: 'What is the speed, the magnitude of ⟨2, 3, 6⟩?', answer: [7], labels: ['speed (m/s)'], explanation: '4 + 9 + 36 = 49, and √49 = 7 metres per second.' }
  ]
 },
 {
  id: 'q12', title: 'The beacon’s contour line', topic: 'Functions of two variables and level curves', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'The Terrain Lab is drawing a contour map of a hill on the crater floor and wants to know which line a survey beacon sits on.',
  lesson: 'A function of two variables gives one number for each point (x, y); a level curve joins the points where it takes the same value.',
  prompt: 'The Terrain Lab models a hill on the crater floor as h(x, y) = 50 − x² − 2y² metres, where (x, y) is a point on the map, in metres from the hill’s centre. A survey beacon stands at (1, 2). Enter the height of the ground at the beacon, which is the level c of the contour line through it. Then enter the positive x where that same contour line crosses the x-axis, where y = 0.',
  answer: [41, 3], labels: ['contour level c (m)', 'x crossing (m)'], tolerance: 0.01,
  hints: [
   'Put the beacon’s x and y into h(x, y). The height you get is the level c of the beacon’s contour line, the level curve h(x, y) = c.',
   'Every point on the x-axis has y = 0. Solve h(x, 0) = c for the positive x.'
  ],
  solution: 'h(1, 2) = 50 − 1 − 2 × 4 = 41, so the beacon lies on the level curve h(x, y) = 41. On the x-axis y = 0, so the curve meets it where 50 − x² = 41. Then x² = 9 and x = 3. The contour line through the beacon crosses the x-axis at (3, 0).',
  xp: 150, prereqs: ['q01'],
  sources: [source.s4_1],
  teaching: {
   intuition: 'The ground has a height at every spot on the map. That makes height a function of two variables: you give it two numbers, the map coordinates x and y, and it gives back one number, h(x, y). The set of points (x, y) it accepts is its domain; here, the whole map. Drawing such a function in three dimensions makes a surface, the hill itself, which is hard to sketch on paper. Hikers solve this with a contour map. Pick a height c and join every point where h(x, y) = c: that curve is a level curve, or contour line. Every point on it is at the same height, so walking along it you neither climb nor descend. Several level curves for evenly spaced heights, drawn on one map, make a contour map; where the lines crowd together the ground is steep.',
   steps: [
    'To find the height at a point, put its x and y into the formula.',
    'The level curve through that point is h(x, y) = c, where c is the height you just found.',
    'To find where that curve crosses a line, put the line’s condition into h(x, y) = c (for the x-axis, y = 0) and solve.',
    'Check the answer by putting the crossing point back into h: it must give the same level c.'
   ],
   example: {
    prompt: 'The ground height is h(x, y) = 40 − x² − y² metres. Which contour line passes through (3, 4), and where does it cross the positive x-axis?',
    steps: [
     'h(3, 4) = 40 − 9 − 16 = 15, so the point is on the level curve h(x, y) = 15.',
     'On the x-axis y = 0: 40 − x² = 15, so x² = 25 and x = 5.'
    ],
    answer: 'The 15 m contour line, which crosses the x-axis at (5, 0).'
   },
   pitfalls: [
    'Applying the coefficient before squaring: 3y² at y = 2 is 3 × 4 = 12, not 6² = 36.',
    'Thinking a contour line is a path that climbs. Every point on a level curve has the same height.',
    'Forgetting to undo the coefficient of x² before taking the square root when the formula has, say, 2x².'
   ]
  },
  guidance: [
   { prompt: 'What is h(1, 2), the height at the beacon?', answer: [41], labels: ['height at beacon (m)'], explanation: 'h(1, 2) = 50 − 1 − 2 × 4 = 41 metres. The beacon’s contour line is the level curve h(x, y) = 41.' },
   { prompt: 'On the x-axis y = 0, so the contour line meets it where 50 − x² = 41. What is x² there?', answer: [9], labels: ['x²'], explanation: 'x² = 50 − 41 = 9.' },
   { prompt: 'x² = 9. What is the positive x?', answer: [3], labels: ['x crossing (m)'], explanation: '√9 = 3, so the contour line crosses the x-axis at (3, 0). Check: h(3, 0) = 50 − 9 = 41, the same level as the beacon.' }
  ]
 },
 {
  id: 'q13', title: 'The tilt meter at the origin', topic: 'Limits along paths', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'A tilt meter on the crater floor gives no reading at its own base, and the lab wants to know whether its nearby readings settle on one value there.',
  lesson: 'A limit at a point in the plane must be the same along every path to the point; two paths with different limits mean there is no limit.',
  prompt: 'A tilt meter on the crater floor sits at the origin (0, 0). At nearby points (x, y) it reports f(x, y) = 10xy ÷ (x² + y²), and it reports nothing where the formula divides by 0, as at the origin itself. Find the limit of f as (x, y) approaches (0, 0) along the line y = x, then along the line y = 2x. Enter those two limits, then 1 if the limit of f as (x, y) approaches (0, 0) exists, or 0 if it does not.',
  answer: [5, 4, 0], labels: ['limit along first line', 'limit along second line', 'limit exists (1 or 0)'], tolerance: 0.01,
  hints: [
   'On the line y = mx, replace every y by mx and simplify. Either the x’s cancel and leave a fixed number, or a factor x is left over, which approaches 0.',
   'Two paths with different limits prove there is no limit. Equal limits along two lines prove nothing on their own: the limit exists when f simplifies to a formula you can put (0, 0) into.'
  ],
  solution: 'Along y = x, f = 10x(x) ÷ (x² + (x)²) = 10x² ÷ (2x²) = 5 for every x other than 0, so the limit along that line is 5. Along y = 2x, f = 10x(2x) ÷ (x² + (2x)²) = 20x² ÷ (5x²) = 4 for every x other than 0, so the limit along that line is 4. The two lines give different limits, 5 and 4, so f has no single limit at (0, 0): enter 0.',
  xp: 150, prereqs: ['q12'],
  sources: [source.s4_2],
  teaching: {
   intuition: 'In Calculus 1 a point on the number line could be approached from only two sides, the left and the right. In the plane there are endless ways in: along the x-axis, along a sloping line, along a curve. The limit of f(x, y) as (x, y) approaches (a, b) is a number L that f gets close to however the point comes in. So a single path can only ever show us a candidate. A limit along a path is what f approaches along that one path; the lines y = mx through the origin are the easiest paths to try, because putting y = mx into f leaves a formula in x alone. If two paths lead to different limits, f cannot settle on one number, and the limit does not exist. If every path we try gives the same value, that is not yet proof: we still need an argument that covers every path at once, such as rewriting f as a simpler formula we can substitute into.',
   steps: [
    'Choose a line through the point, y = mx for the origin, and replace every y in f by mx.',
    'Simplify and let x approach 0. The result is the limit along that line.',
    'Repeat for a second line. Different results mean the limit does not exist.',
    'If the results agree, look for a reason the limit exists for every path: for example, cancel a common factor so that f becomes a formula you can put the point into directly.'
   ],
   example: {
    prompt: 'Does f(x, y) = 6xy ÷ (x² + 2y²) have a limit at (0, 0)? Try the lines y = x and y = −x.',
    steps: [
     'Along y = x: f = 6x² ÷ (x² + 2x²) = 6x² ÷ (3x²) = 2.',
     'Along y = −x: f = −6x² ÷ (3x²) = −2.',
     'The two lines give 2 and −2, which differ.'
    ],
    answer: 'No: the limits along the two lines are 2 and −2, so there is no limit at (0, 0).'
   },
   pitfalls: [
    'Deciding that the limit exists because two lines agree. Agreement along a few paths proves nothing by itself.',
    'Putting x = 0 and y = 0 straight into a formula that gives 0 ÷ 0. Simplify along the path first.',
    'Dropping the slope when squaring: on y = 2x, y² is 4x², not 2x².'
   ]
  },
  guidance: [
   { prompt: 'Put y = x into f(x, y) = 10xy ÷ (x² + y²). What is the limit along the line y = x?', answer: [5], labels: ['limit along first line'], explanation: 'Along y = x, f = 10x(x) ÷ (x² + (x)²) = 10x² ÷ (2x²) = 5 for every x other than 0, so the limit along that line is 5.' },
   { prompt: 'Now put y = 2x into f. What is the limit along the line y = 2x?', answer: [4], labels: ['limit along second line'], explanation: 'Along y = 2x, f = 10x(2x) ÷ (x² + (2x)²) = 20x² ÷ (5x²) = 4 for every x other than 0, so the limit along that line is 4.' },
   { prompt: 'Along the two lines the limits are 5 and 4. Enter 1 if the limit of f at (0, 0) exists, 0 if not.', answer: [0], labels: ['limit exists (1 or 0)'], explanation: 'The two lines give different limits, 5 and 4, so f has no single limit at (0, 0): enter 0.' }
  ]
 },
 {
  id: 'q14', title: 'Slopes east and north', topic: 'Partial derivatives', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'A rover on a ridge needs to know how steep the ground is going east and going north before it picks a route.',
  lesson: 'A partial derivative is the rate of change of a function of several variables when only one variable moves and the others are held fixed.',
  prompt: 'The Terrain Lab’s model of a ridge gives the ground height as h(x, y) = 3x²y − 2xy² + 4e^(x − y) metres, where x is metres east and y is metres north. Enter the slope going east, the partial derivative ∂h/∂x, at the point (2, 2). Then enter the slope going north, ∂h/∂y, at the same point.',
  answer: [20, -8], labels: ['∂h/∂x at the point', '∂h/∂y at the point'], tolerance: 0.01,
  hints: [
   'For ∂h/∂x, treat y as a fixed number and differentiate with respect to x as in Calculus 1. For ∂h/∂y, hold x fixed instead.',
   'By the chain rule, e^(x − y) differentiates to e^(x − y) with respect to x, and to −e^(x − y) with respect to y. Where x and y are equal, e^(x − y) = e⁰ = 1.'
  ],
  solution: 'Holding y fixed, ∂h/∂x = 6xy − 2y² + 4e^(x − y). At (2, 2), where e^(x − y) = 1, this is 24 − 8 + 4 = 20. Holding x fixed, ∂h/∂y = 3x² − 4xy − 4e^(x − y). At (2, 2) this is 12 − 16 − 4 = −8.',
  xp: 150, prereqs: ['q12'],
  sources: [source.s4_3],
  teaching: {
   intuition: 'On a hillside there is no single slope: walking east may be steep while walking north is gentle. So we measure the slope one direction at a time. Hold y fixed and let only x change: h becomes an ordinary function of x, and its derivative is the partial derivative of h with respect to x, written ∂h/∂x or h_x. The curly ∂ is read “partial” and reminds us the other variable is frozen. Holding x fixed and letting y change gives ∂h/∂y, or h_y. Computing a partial derivative uses nothing new: every rule from Calculus 1 works, provided you treat the frozen letter as a number. So the derivative of 3x²y with respect to x is 6xy, because y behaves like a constant multiplier, while with respect to y it is 3x².',
   steps: [
    'For ∂h/∂x, treat y as a fixed number and differentiate each term with respect to x.',
    'For ∂h/∂y, treat x as a fixed number and differentiate each term with respect to y.',
    'Use the chain rule where a letter sits inside another function: e^(x − y) gives e^(x − y) with respect to x and −e^(x − y) with respect to y.',
    'Put the point’s coordinates into each partial derivative.'
   ],
   example: {
    prompt: 'For h(x, y) = x²y + 5e^(x − y), find ∂h/∂x and ∂h/∂y at (1, 1).',
    steps: [
     '∂h/∂x = 2xy + 5e^(x − y). At (1, 1), e⁰ = 1, so this is 2 + 5 = 7.',
     '∂h/∂y = x² − 5e^(x − y). At (1, 1) this is 1 − 5 = −4.'
    ],
    answer: '∂h/∂x = 7 and ∂h/∂y = −4.'
   },
   pitfalls: [
    'Differentiating the frozen letter too: with respect to x, the derivative of xy² is y², not 2xy.',
    'Dropping the minus sign from the exponent: with respect to y, e^(x − y) gives −e^(x − y).',
    'Treating a term with no x as if it had one: with respect to x, a term in y alone has derivative 0.'
   ]
  },
  guidance: [
   { prompt: 'What is e^(x − y) at the point (2, 2)?', answer: [1], labels: ['e^(x − y)'], explanation: 'There x − y = 2 − 2 = 0, and e⁰ = 1.' },
   { prompt: 'Hold y fixed and differentiate with respect to x. What is ∂h/∂x at (2, 2)?', answer: [20], labels: ['∂h/∂x'], explanation: '∂h/∂x = 6xy − 2y² + 4e^(x − y). At (2, 2): 24 − 8 + 4 = 20.' },
   { prompt: 'Hold x fixed and differentiate with respect to y. What is ∂h/∂y at (2, 2)?', answer: [-8], labels: ['∂h/∂y'], explanation: '∂h/∂y = 3x² − 4xy − 4e^(x − y): the y in the exponent brings a factor −1. At (2, 2): 12 − 16 − 4 = −8.' }
  ]
 },
 {
  id: 'q15', title: 'How sharply the wall bends', topic: 'Second and mixed partial derivatives', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'The rover team wants to know how sharply a crater wall curves before they drive along it.',
  lesson: 'Second partial derivatives are partial derivatives of partial derivatives; the two mixed partials h_xy and h_yx are equal for smooth functions.',
  prompt: 'A terrain model gives the height of a crater wall as h(x, y) = 2x³ − 3x²y + xy² + y³ metres. How the slopes themselves change tells the rover team how sharply the ground curves. Enter the second partial derivatives h_xx and h_yy at the point (2, 1), then the mixed partial derivative h_xy there.',
  answer: [18, 10, -10], labels: ['h_xx', 'h_yy', 'h_xy'], tolerance: 0.01,
  hints: [
   'Find the first partial derivatives h_x and h_y first. Then differentiate h_x with respect to x to get h_xx, and h_y with respect to y to get h_yy.',
   'For the mixed partial h_xy, differentiate h_x with respect to y. Differentiating h_y with respect to x gives the same result.'
  ],
  solution: 'The first partial derivatives are h_x = 6x² − 6xy + y² and h_y = −3x² + 2xy + 3y². Then h_xx = 12x − 6y, which at (2, 1) is 24 − 6 = 18; h_yy = 2x + 6y, which is 4 + 6 = 10; and h_xy = −6x + 2y, which is −12 + 2 = −10. Differentiating h_y with respect to x gives the same −6x + 2y, as Clairaut’s theorem says it must.',
  xp: 150, prereqs: ['q14'],
  sources: [source.s4_3],
  teaching: {
   intuition: 'A partial derivative is itself a function of x and y, so it has partial derivatives of its own. These are the second partial derivatives. Differentiating h_x again with respect to x gives h_xx: how fast the east slope changes as you walk east, which says how sharply the ground bends in that direction, just as the second derivative did in Calculus 1. In the same way h_yy says how the north slope bends going north. There are also two mixed partial derivatives: h_xy, which differentiates h_x with respect to y (how the east slope changes as you step north), and h_yx, which differentiates h_y with respect to x. For the smooth functions we use they are always equal; this is Clairaut’s theorem, and it gives a free check on your working.',
   steps: [
    'Find the first partial derivatives h_x and h_y.',
    'Differentiate h_x with respect to x to get h_xx, and h_y with respect to y to get h_yy.',
    'Differentiate h_x with respect to y to get the mixed partial h_xy. As a check, h_y differentiated with respect to x gives the same.',
    'Put the point’s coordinates into each second partial derivative.'
   ],
   example: {
    prompt: 'For h(x, y) = x³y + y², find h_xx, h_yy and h_xy at (2, 1).',
    steps: [
     'h_x = 3x²y and h_y = x³ + 2y.',
     'h_xx = 6xy = 12, h_yy = 2, and h_xy = 3x² = 12. From h_y, differentiating with respect to x also gives 3x².'
    ],
    answer: 'h_xx = 12, h_yy = 2 and h_xy = 12.'
   },
   pitfalls: [
    'Putting the point in too early. Differentiate twice first, then substitute.',
    'Differentiating with respect to the wrong letter the second time: h_xy means h_x differentiated with respect to y.',
    'Mixing up the coefficients when the power drops: the derivative of 4x³ is 12x², and of 12x² is 24x.'
   ]
  },
  guidance: [
   { prompt: 'h_x = 6x² − 6xy + y². Differentiate it with respect to x. What is h_xx at (2, 1)?', answer: [18], labels: ['h_xx'], explanation: 'h_xx = 12x − 6y. At (2, 1): 24 − 6 = 18.' },
   { prompt: 'h_y = −3x² + 2xy + 3y². Differentiate it with respect to y. What is h_yy at (2, 1)?', answer: [10], labels: ['h_yy'], explanation: 'h_yy = 2x + 6y. At (2, 1): 4 + 6 = 10.' },
   { prompt: 'Differentiate h_x = 6x² − 6xy + y² with respect to y. What is h_xy at (2, 1)?', answer: [-10], labels: ['h_xy'], explanation: 'h_xy = −6x + 2y. At (2, 1): −12 + 2 = −10. Starting from h_y and differentiating with respect to x gives the same.' }
  ]
 },
 {
  id: 'q16', title: 'A flat plank on the rim', topic: 'Tangent planes and linear approximation', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'A survey crew on the crater rim wants a quick estimate of the ground height a few steps away, without a new survey.',
  lesson: 'Near a point, a smooth surface is close to its tangent plane, whose slopes are the two partial derivatives; the plane gives the linear approximation.',
  prompt: 'A survey crew stands on the crater rim above the map point (3, 2). The ground height is h(x, y) = 80 − 2x² + xy − y² metres. The tangent plane there has slope h_x(3, 2) in the x-direction and slope h_y(3, 2) in the y-direction. Enter both slopes, then use the linear approximation to estimate the height at the nearby point (3.1, 1.8), in metres.',
  answer: [-10, -1, 63.2], labels: ['slope h_x', 'slope h_y', 'estimated height (m)'], tolerance: 0.01,
  hints: [
   'Find h_x and h_y by holding the other variable fixed, then put in the point.',
   'The linear approximation is L = h(a, b) + h_x(a, b) × Δx + h_y(a, b) × Δy, where Δx and Δy are the steps from (a, b) to the nearby point.'
  ],
  solution: 'h(3, 2) = 80 − 18 + 6 − 4 = 64. h_x = −4x + y, so h_x(3, 2) = −12 + 2 = −10; h_y = x − 2y, so h_y(3, 2) = 3 − 4 = −1. The tangent plane is z = 64 − 10(x − 3) − (y − 2). The steps are Δx = 0.1 and Δy = −0.2, so L = 64 + (−10) × 0.1 + (−1) × (−0.2) = 64 − 1 + 0.2 = 63.2 metres.',
  xp: 150, prereqs: ['q14', 'q08'],
  sources: [source.s4_4],
  teaching: {
   intuition: 'Zoom in far enough on a smooth hillside and it looks flat, like a plank laid on the ground. That plank is the tangent plane: the plane that touches the surface z = h(x, y) at one point and tilts exactly as the ground does there. Its slope in the x-direction is h_x and its slope in the y-direction is h_y, so at the point (a, b) its equation is z = h(a, b) + h_x(a, b)(x − a) + h_y(a, b)(y − b). Written as h_x(x − a) + h_y(y − b) − (z − h(a, b)) = 0, it is a plane with normal vector ⟨h_x, h_y, −1⟩. Because the plane hugs the surface near the point, its height is a good estimate of the ground’s height a short step away. Using it that way is the linear approximation: L = h(a, b) + h_x × Δx + h_y × Δy, where Δx and Δy are the steps in x and y.',
   steps: [
    'Work out the height h(a, b) at the point.',
    'Find h_x and h_y and put in the point: these are the two slopes of the tangent plane.',
    'Find the steps Δx and Δy from (a, b) to the nearby point.',
    'Add: L = h(a, b) + h_x(a, b) × Δx + h_y(a, b) × Δy. It is an estimate, close when the steps are small.'
   ],
   example: {
    prompt: 'The ground height is h(x, y) = 50 − x² − y² metres. Estimate the height at (1.1, 2.1) from the point (1, 2).',
    steps: [
     'h(1, 2) = 50 − 1 − 4 = 45.',
     'h_x = −2x = −2 and h_y = −2y = −4 at (1, 2).',
     'Δx = 0.1 and Δy = 0.1, so L = 45 + (−2) × 0.1 + (−4) × 0.1 = 45 − 0.2 − 0.4 = 44.4.'
    ],
    answer: 'About 44.4 metres.'
   },
   pitfalls: [
    'Multiplying the slopes by the new coordinates instead of by the steps: use Δx and Δy, not the coordinates of the new point.',
    'Losing a sign when a step is negative: a slope of −3 times a step of −0.1 adds 0.3.',
    'Forgetting the starting height h(a, b): the slopes only give the change.'
   ]
  },
  guidance: [
   { prompt: 'What is the height h(3, 2)?', answer: [64], labels: ['height (m)'], explanation: 'h(3, 2) = 80 − 18 + 6 − 4 = 64 metres.' },
   { prompt: 'h_x = −4x + y and h_y = x − 2y. What are h_x(3, 2) and h_y(3, 2)?', answer: [-10, -1], labels: ['h_x', 'h_y'], explanation: 'h_x(3, 2) = −12 + 2 = −10 and h_y(3, 2) = 3 − 4 = −1. These are the two slopes of the tangent plane.' },
   { prompt: 'From (3, 2) to (3.1, 1.8) the steps are Δx = 0.1 and Δy = −0.2. What is the estimate L = h + h_x × Δx + h_y × Δy?', answer: [63.2], labels: ['estimate (m)'], explanation: 'L = 64 + (−10) × 0.1 + (−1) × (−0.2) = 64 − 1 + 0.2 = 63.2 metres.' }
  ]
 },
 {
  id: 'q17', title: 'Reading the rover’s map', topic: 'Chapter review: reading a terrain map', tier: 'Intermediate', sector: 'Terrain Lab',
  brief: 'A rover is parked on a crater slope, and the lab wants its contour level, how steep the ground is ahead of it, and the height where it will stop next.',
  lesson: 'A height formula answers three questions at once: its value gives the contour level, its partial derivatives give the slopes, and together they give the linear estimate.',
  prompt: 'The contour map of a crater slope comes from h(x, y) = 40 + x²y − y³ + 3x metres, with x in metres east and y in metres north. A rover is parked at (2, 3). Enter the level of the contour line it is parked on, which is the height there. Then enter the slope of the ground going north, h_y(2, 3), and the linear estimate of the height at (2.2, 2.9).',
  answer: [31, -23, 36.3], labels: ['contour level (m)', 'slope north h_y', 'estimated height (m)'], tolerance: 0.01,
  hints: [
   'The rover’s contour line is the level curve h(x, y) = c through its point, so c is the height at that point.',
   'The estimate needs both slopes: L = h + h_x × Δx + h_y × Δy, with the steps Δx and Δy from the rover to the new point.'
  ],
  solution: 'h(2, 3) = 40 + 12 − 27 + 6 = 31, so the rover is on the 31 m contour line. h_x = 2xy + 3, which at (2, 3) is 15, and h_y = x² − 3y², which is 4 − 27 = −23. With Δx = 0.2 and Δy = −0.1, L = 31 + 15 × 0.2 + (−23) × (−0.1) = 31 + 3 + 2.3 = 36.3 metres.',
  xp: 150, prereqs: ['q15', 'q16'],
  sources: [source.s4_1, source.s4_3],
  teaching: {
   intuition: 'This chapter gave three ways to read a terrain formula h(x, y). Its value at a point is the height there, and so the level c of the contour line, the level curve h(x, y) = c, that passes through it. Its partial derivatives h_x and h_y are the slopes going east and going north, found by holding the other letter fixed. And those slopes, together with the height, give the linear approximation h + h_x × Δx + h_y × Δy for a point a short step away. A rover’s planner uses all three: where it is, how steep the next metre is, and roughly how high it will be after a short drive.',
   steps: [
    'Put the point into h(x, y): that is the height, and the level of the contour line through it.',
    'Find h_x and h_y, holding the other letter fixed each time, and put in the point.',
    'Find the steps Δx and Δy to the next point.',
    'Estimate: L = h + h_x × Δx + h_y × Δy.'
   ],
   example: {
    prompt: 'The ground height is h(x, y) = 20 + xy² metres. A rover is at (1, 2). Find its contour level, the slope north, and the estimated height at (1.1, 2).',
    steps: [
     'h(1, 2) = 20 + 4 = 24, so the rover is on the 24 m contour line.',
     'h_x = y² = 4 and h_y = 2xy = 4 at (1, 2).',
     'Δx = 0.1 and Δy = 0, so L = 24 + 4 × 0.1 = 24.4.'
    ],
    answer: 'Level 24 m, slope north 4, estimated height 24.4 m.'
   },
   pitfalls: [
    'Using h_x when the question asks for the slope going north, which is h_y.',
    'Taking a cube carelessly: the derivative of −y³ with respect to y is −3y², and at y = 2 that is −12.',
    'Using only one slope in the estimate when the rover moves in both x and y.'
   ]
  },
  guidance: [
   { prompt: 'What is h(2, 3), the level of the rover’s contour line?', answer: [31], labels: ['height (m)'], explanation: 'h(2, 3) = 40 + 12 − 27 + 6 = 31 metres.' },
   { prompt: 'h_x = 2xy + 3 and h_y = x² − 3y². What are h_x(2, 3) and h_y(2, 3)?', answer: [15, -23], labels: ['h_x', 'h_y'], explanation: 'h_x(2, 3) = 12 + 3 = 15 and h_y(2, 3) = 4 − 27 = −23.' },
   { prompt: 'The steps to (2.2, 2.9) are Δx = 0.2 and Δy = −0.1. What is the estimate L?', answer: [36.3], labels: ['estimate (m)'], explanation: 'L = 31 + 15 × 0.2 + (−23) × (−0.1) = 31 + 3 + 2.3 = 36.3 metres.' }
  ]
 },
 {
  id: 'q18', title: 'The drifting balloon', topic: 'The chain rule for several variables', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'A weather balloon is drifting across the plain, and the mast wants to know how fast the temperature it feels is changing.',
  lesson: 'When x and y both depend on t, the multivariable chain rule adds the two routes: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt.',
  prompt: 'A weather balloon drifts over the plain. The temperature at the point (x, y) is T(x, y) = 3x² − 2xy + y² degrees Celsius, with x and y in kilometres, and t hours after release the balloon is at x(t) = 1 + 2t, y(t) = t². At t = 1, enter ∂T/∂x and ∂T/∂y at the balloon’s position, in degrees per kilometre. Then enter dT/dt, the rate at which the balloon’s temperature is changing, in degrees per hour.',
  answer: [16, -4, 24], labels: ['∂T/∂x (°C per km)', '∂T/∂y (°C per km)', 'dT/dt (°C per hour)'], tolerance: 0.01,
  hints: [
   'First find where the balloon is at that time, and put that point into ∂T/∂x and ∂T/∂y.',
   'The multivariable chain rule: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt.'
  ],
  solution: 'At t = 1 the balloon is at x = 3, y = 1. There ∂T/∂x = 6x − 2y = 18 − 2 = 16 and ∂T/∂y = −2x + 2y = −6 + 2 = −4. Also dx/dt = 2 and dy/dt = 2t = 2. By the multivariable chain rule, dT/dt = 16 × 2 + (−4) × 2 = 32 − 8 = 24 °C per hour.',
  xp: 150, prereqs: ['q14'],
  sources: [source.s4_5],
  teaching: {
   intuition: 'The temperature T depends on where you are, (x, y). A drifting balloon’s position depends on the time t. So the temperature the balloon feels changes with time for two reasons at once: it moves in x, and it moves in y. Each route contributes a rate. Moving in x changes T at ∂T/∂x degrees per kilometre, and x changes at dx/dt kilometres per hour, so this route gives ∂T/∂x × dx/dt degrees per hour. The y route gives ∂T/∂y × dy/dt in the same way. The multivariable chain rule says the total rate is the sum: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt. It is the chain rule from Calculus 1, done once for each variable and then added.',
   steps: [
    'Find where the object is at the given time: put t into x(t) and y(t).',
    'Find ∂T/∂x and ∂T/∂y and put in that position.',
    'Differentiate the path: find dx/dt and dy/dt at that time.',
    'Combine: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt.'
   ],
   example: {
    prompt: 'T(x, y) = xy, and a probe moves along x = t², y = 3t. Find dT/dt at t = 2.',
    steps: [
     'At t = 2 the probe is at x = 4, y = 6.',
     '∂T/∂x = y = 6 and ∂T/∂y = x = 4. Also dx/dt = 2t = 4 and dy/dt = 3.',
     'dT/dt = 6 × 4 + 4 × 3 = 24 + 12 = 36. Check: T = 3t³, whose derivative 9t² is 36 at t = 2.'
    ],
    answer: 'dT/dt = 36.'
   },
   pitfalls: [
    'Putting the time t into ∂T/∂x instead of the position (x, y) at that time.',
    'Adding the partial derivatives without multiplying each by its own rate dx/dt or dy/dt.',
    'Forgetting that dy/dt changes with time when y(t) has a t² in it.'
   ]
  },
  guidance: [
   { prompt: 'Where is the balloon at t = 1? Enter x(1) and y(1).', answer: [3, 1], labels: ['x (km)', 'y (km)'], explanation: 'x(1) = 1 + 2 = 3 and y(1) = 1² = 1.' },
   { prompt: '∂T/∂x = 6x − 2y and ∂T/∂y = −2x + 2y. What are they at (3, 1)?', answer: [16, -4], labels: ['∂T/∂x', '∂T/∂y'], explanation: '∂T/∂x = 18 − 2 = 16 and ∂T/∂y = −6 + 2 = −4.' },
   { prompt: 'What are dx/dt and dy/dt at t = 1?', answer: [2, 2], labels: ['dx/dt', 'dy/dt'], explanation: 'dx/dt = 2 for every t, and dy/dt = 2t, which is 2 at t = 1.' },
   { prompt: 'Put them together: what is dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt?', answer: [24], labels: ['dT/dt'], explanation: 'dT/dt = 16 × 2 + (−4) × 2 = 32 − 8 = 24 °C per hour.' }
  ]
 },
 {
  id: 'q19', title: 'Temperature on the wind', topic: 'Directional derivatives and the gradient', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'The wind is carrying air across a warm patch of the plain, and the mast wants to know how fast the temperature changes along the wind.',
  lesson: 'The gradient ∇f collects the partial derivatives into a vector; the directional derivative in a unit direction u is the dot product ∇f · u.',
  prompt: 'The weather mast maps the air temperature near the ground as T(x, y) = x² + 3xy − 2y² degrees Celsius, with x and y in kilometres. At the point (2, 1) the wind blows in the direction of the vector ⟨3, 4⟩. Enter the two components of the gradient ∇T at (2, 1). Then enter the directional derivative of T in the wind’s direction: the rate, in degrees per kilometre, at which the temperature changes as you move with the wind.',
  answer: [7, 2, 5.8], labels: ['∇T first component', '∇T second component', 'rate with the wind (°C per km)'], tolerance: 0.01,
  hints: [
   'The gradient is ∇T = ⟨∂T/∂x, ∂T/∂y⟩, worked out at the point.',
   'Divide the direction vector by its length to get a unit vector u. The directional derivative is the dot product ∇T · u.'
  ],
  solution: '∂T/∂x = 2x + 3y = 4 + 3 = 7 and ∂T/∂y = 3x − 4y = 6 − 4 = 2, so ∇T(2, 1) = ⟨7, 2⟩. The vector ⟨3, 4⟩ has length √(9 + 16) = 5, so the unit vector is u = ⟨3/5, 4/5⟩ = ⟨0.6, 0.8⟩. The directional derivative is ∇T · u = 7 × 0.6 + 2 × 0.8 = 4.2 + 1.6 = 5.8 °C per kilometre.',
  xp: 150, prereqs: ['q18', 'q04'],
  sources: [source.s4_6],
  teaching: {
   intuition: 'Partial derivatives give the rate of change going exactly east or exactly north. The wind rarely blows exactly east, so we want the rate in any direction. Put the two partial derivatives into one vector: the gradient, ∇f = ⟨∂f/∂x, ∂f/∂y⟩, read “grad f” (∇ is called nabla). A direction is given by a unit vector u, a vector of length 1. Moving a small distance along u moves you u’s first component east and its second component north per unit travelled, so, by the multivariable chain rule, the rate of change in that direction is ∂f/∂x times the first component plus ∂f/∂y times the second. That is exactly the dot product ∇f · u. It is called the directional derivative of f in the direction u, written D_u f. If the direction comes as a vector that is not of length 1, divide it by its magnitude first.',
   steps: [
    'Find ∂f/∂x and ∂f/∂y and put in the point: these are the components of ∇f.',
    'Turn the direction into a unit vector u by dividing it by its magnitude.',
    'Take the dot product: D_u f = ∇f · u, the first components multiplied plus the second components multiplied.',
    'Read the sign: positive means f increases in that direction, negative means it decreases.'
   ],
   example: {
    prompt: 'For f(x, y) = x² + y², find the rate of change at (1, 2) in the direction of ⟨4, −3⟩.',
    steps: [
     '∇f = ⟨2x, 2y⟩ = ⟨2, 4⟩ at (1, 2).',
     '⟨4, −3⟩ has magnitude √(16 + 9) = 5, so u = ⟨0.8, −0.6⟩.',
     'D_u f = 2 × 0.8 + 4 × (−0.6) = 1.6 − 2.4 = −0.8.'
    ],
    answer: '−0.8: f decreases in that direction.'
   },
   pitfalls: [
    'Using the direction vector without dividing by its magnitude, which multiplies the rate by that magnitude.',
    'Taking the dot product with the point instead of with the gradient at the point.',
    'Losing a minus sign in a component of the direction.'
   ]
  },
  guidance: [
   { prompt: '∂T/∂x = 2x + 3y and ∂T/∂y = 3x − 4y. What are the components of ∇T at (2, 1)?', answer: [7, 2], labels: ['∂T/∂x', '∂T/∂y'], explanation: '∂T/∂x = 4 + 3 = 7 and ∂T/∂y = 6 − 4 = 2, so ∇T(2, 1) = ⟨7, 2⟩.' },
   { prompt: 'The vector ⟨3, 4⟩ has length 5. What are the components of the unit vector u in its direction, as decimals?', answer: [0.6, 0.8], labels: ['u first component', 'u second component'], explanation: 'Divide each component by 5: u = ⟨3/5, 4/5⟩ = ⟨0.6, 0.8⟩.' },
   { prompt: 'What is the directional derivative ∇T · u?', answer: [5.8], labels: ['rate (°C per km)'], explanation: '∇T · u = 7 × 0.6 + 2 × 0.8 = 4.2 + 1.6 = 5.8 °C per kilometre.' }
  ]
 },
 {
  id: 'q20', title: 'The fastest way up', topic: 'Steepest ascent', tier: 'Intermediate', sector: 'Weather Mast',
  brief: 'A weather drone has to climb a pressure field as fast as it can, and needs both the best rate and the heading to fly.',
  lesson: 'The gradient points in the direction of steepest ascent, and its magnitude ‖∇f‖ is the greatest rate of increase.',
  prompt: 'Above the plain, the air pressure differs from its base level by P(x, y) = x² + 3xy − y² pascals, with x and y in kilometres (x points east). A drone at (3, 2) must climb the pressure as fast as it can. Enter the greatest rate of increase of P at (3, 2), in pascals per kilometre. Then enter the angle between the direction of steepest ascent and due east, the direction of ⟨1, 0⟩, in radians to 3 decimal places.',
  answer: [13, 0.395], labels: ['greatest rate (Pa per km)', 'angle from east (radians)'], tolerance: 0.0005,
  hints: [
   'The greatest rate of increase is the length of the gradient: ‖∇P‖ = √((∂P/∂x)² + (∂P/∂y)²).',
   'The steepest way up is the direction of ∇P. The angle θ between ∇P and ⟨1, 0⟩ comes from the dot product: cos θ = (∇P · ⟨1, 0⟩) ÷ ‖∇P‖, with θ between 0 and π.'
  ],
  solution: '∂P/∂x = 2x + 3y = 6 + 6 = 12 and ∂P/∂y = 3x − 2y = 9 − 4 = 5, so ∇P(3, 2) = ⟨12, 5⟩. The greatest rate of increase is ‖∇P‖ = √(144 + 25) = √169 = 13 pascals per kilometre, in the direction of ∇P. For the angle with ⟨1, 0⟩, ∇P · ⟨1, 0⟩ = 12, so cos θ = 12 ÷ 13 and θ = arccos(12 ÷ 13), which is 0.395 radians to 3 decimal places.',
  xp: 150, prereqs: ['q19'],
  sources: [source.s4_6],
  teaching: {
   intuition: 'The directional derivative ∇f · u changes as the unit direction u turns. By the dot product rule from Chapter 1, ∇f · u = ‖∇f‖ × ‖u‖ × cos θ, where θ is the angle between ∇f and u, and ‖u‖ = 1. The cosine is largest, 1, when θ = 0: when u points the same way as the gradient. So the gradient points in the direction of steepest ascent, the way that f increases fastest, and the rate in that direction is ‖∇f‖, the magnitude of the gradient. The opposite direction is the steepest way down, at rate −‖∇f‖, and any direction at right angles to ∇f gives rate 0, which is the direction along the level curve. To steer in the steepest direction we describe it by the angle between ∇f and a fixed direction such as due east, ⟨1, 0⟩, found with the dot product as in Chapter 1.',
   steps: [
    'Find the gradient ∇f at the point.',
    'The greatest rate of increase is its magnitude, ‖∇f‖ = √((∂f/∂x)² + (∂f/∂y)²).',
    'For the angle θ with due east, use cos θ = (∇f · ⟨1, 0⟩) ÷ (‖∇f‖ × 1), which is ∂f/∂x ÷ ‖∇f‖.',
    'θ = arccos of that number, in radians between 0 and π. Round only at the end.'
   ],
   example: {
    prompt: 'For f(x, y) = x² + y² at (3, 4), find the greatest rate of increase and the angle of steepest ascent from due east.',
    steps: [
     '∇f = ⟨2x, 2y⟩ = ⟨6, 8⟩, and ‖∇f‖ = √(36 + 64) = 10.',
     'cos θ = 6 ÷ 10 = 0.6, so θ = arccos(0.6) = 0.927 radians to 3 decimal places.'
    ],
    answer: 'Greatest rate 10, at 0.927 radians from due east.'
   },
   pitfalls: [
    'Using arctan of ∂f/∂y ÷ ∂f/∂x, which gives the wrong angle when ∂f/∂x is negative. The arccos of the dot product always gives the angle between 0 and π.',
    'Reporting a partial derivative as the greatest rate. The greatest rate is the magnitude of the whole gradient.',
    'Rounding cos θ before taking the arccos, which can change the third decimal.'
   ]
  },
  guidance: [
   { prompt: '∂P/∂x = 2x + 3y and ∂P/∂y = 3x − 2y. What are the components of ∇P at (3, 2)?', answer: [12, 5], labels: ['∂P/∂x', '∂P/∂y'], explanation: '∂P/∂x = 6 + 6 = 12 and ∂P/∂y = 9 − 4 = 5.' },
   { prompt: 'What is the length ‖∇P‖ of ⟨12, 5⟩?', answer: [13], labels: ['‖∇P‖'], explanation: '144 + 25 = 169, and √169 = 13. That is the greatest rate of increase, in pascals per kilometre.' },
   { prompt: 'cos θ = 12 ÷ 13. What is θ in radians, to 3 decimal places?', answer: [0.395], labels: ['angle θ (radians)'], explanation: 'θ = arccos(12 ÷ 13), which is 0.395 radians to 3 decimal places.' }
  ]
 }
);
})();
