/* Calculus 3: many variables missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/calc3/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Points in space and the distance between them [2.2]
     q02  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Vectors: components, adding and scaling [2.1]
     q03  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Magnitude and unit vectors [2.2]
     q04  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Dot product and the angle between vectors [2.3]
     q05  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Projection; work as a dot product [2.3]
     q06  ch 1 Points and arrows in space · Basic, 100 XP · sector 'Survey Deck' · Cross product and the area of a parallelogram [2.4]
     q07  ch 2 Lines, planes and paths · Basic, 100 XP · sector 'Orbital Dock' · Lines in space [2.5]
     q08  ch 2 Lines, planes and paths · Basic, 100 XP · sector 'Orbital Dock' · Planes and their normal vectors [2.5]
     q09  ch 2 Lines, planes and paths · Basic, 100 XP · sector 'Orbital Dock' · Distance from a point to a plane [2.5]
     q10  ch 2 Lines, planes and paths · Basic, 100 XP · sector 'Orbital Dock' · Vector-valued functions: velocity, speed, acceleration [3.2, 3.4] */
(function(){
'use strict';
/* OpenStax Calculus Volume 3 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient
   Link to the section page itself: https://openstax.org/books/calculus-volume-3/pages/<section-slug> */
const source = {
 s2_1: { title: 'OpenStax Calculus Volume 3 — 2.1 Vectors in the Plane', url: 'https://openstax.org/books/calculus-volume-3/pages/2-1-vectors-in-the-plane', description: 'Vectors as arrows, their components, vector addition, scalar multiplication, magnitude and unit vectors.', verified: '2026-11-27' },
 s2_2: { title: 'OpenStax Calculus Volume 3 — 2.2 Vectors in Three Dimensions', url: 'https://openstax.org/books/calculus-volume-3/pages/2-2-vectors-in-three-dimensions', description: 'The three-dimensional coordinate system, the distance between two points in space, and vectors in space with their magnitude, unit vectors and i, j, k.', verified: '2026-11-27' },
 s2_3: { title: 'OpenStax Calculus Volume 3 — 2.3 The Dot Product', url: 'https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product', description: 'The dot product, the angle between two vectors, orthogonal vectors, projections, and work as a dot product.', verified: '2026-11-27' },
 s2_4: { title: 'OpenStax Calculus Volume 3 — 2.4 The Cross Product', url: 'https://openstax.org/books/calculus-volume-3/pages/2-4-the-cross-product', description: 'The cross product and its determinant form, the area of a parallelogram as its magnitude, and torque.', verified: '2026-11-27' },
 s2_5: { title: 'OpenStax Calculus Volume 3 — 2.5 Equations of Lines and Planes in Space', url: 'https://openstax.org/books/calculus-volume-3/pages/2-5-equations-of-lines-and-planes-in-space', description: 'Parametric equations of a line, the equation of a plane from a normal vector, planes through three points, and the distance from a point to a plane.', verified: '2026-11-27' },
 s3_2: { title: 'OpenStax Calculus Volume 3 — 3.2 Calculus of Vector-Valued Functions', url: 'https://openstax.org/books/calculus-volume-3/pages/3-2-calculus-of-vector-valued-functions', description: 'Derivatives of vector-valued functions, taken one component at a time.', verified: '2026-11-27' },
 s3_4: { title: 'OpenStax Calculus Volume 3 — 3.4 Motion in Space', url: 'https://openstax.org/books/calculus-volume-3/pages/3-4-motion-in-space', description: 'Velocity as the derivative of position, speed as its magnitude, and acceleration as the derivative of velocity.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'Two beacons in the crater', topic: 'Points in space and the distance between them', tier: 'Basic', sector: 'Survey Deck',
  brief: 'The survey crew has planted two beacons at different heights in the crater, and Mira wants the length of cable that would run straight between them.',
  lesson: 'A point in space has three coordinates (x, y, z), and the distance between two points is the square root of the sum of the squared changes along the three axes.',
  prompt: 'Two survey beacons stand in the crater. Measured in metres from the deck’s corner post, with x east, y north and z up, beacon A is at (2, −1, 3) and beacon B is at (8, 1, 6). Enter the straight-line distance between the two beacons in metres.',
  answer: [7], labels: ['distance (m)'], tolerance: 0.01,
  hints: [
   'Subtract coordinate by coordinate, B minus A, to get the change along each axis.',
   'Square the three changes, add the squares, and take the square root of the total.'
  ],
  solution: 'The changes are x: 8 − 2 = 6, y: 1 − (−1) = 2 and z: 6 − 3 = 3. Squared and added: 36 + 4 + 9 = 49. The distance is √49 = 7 metres.',
  xp: 100, prereqs: [],
  artifact: { name: 'Beacon ledger', description: 'Two points in space, written as three numbers each, and the straight cable between them.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'On a flat map, two numbers fix a place: how far east and how far north of a chosen corner. The crater is not flat, so we add a third number for how far up. Pick a starting point, called the origin, and three axes at right angles to each other: x east, y north and z up. Every point in space then has three coordinates, written (x, y, z) in that order; a negative coordinate means west, south or down. To find the straight-line distance between two points, look at how much each coordinate changes. Those three changes are the edges of a box, and the straight line runs corner to corner across it. Pythagoras across the floor of the box, then once more up its height, gives the distance formula: d = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²).',
   steps: [
    'Write both points as (x, y, z), in the same units and from the same origin.',
    'Subtract coordinate by coordinate, second point minus first, to get the change along x, along y and along z.',
    'Square the three changes and add them. A square is never negative, so the order of subtraction does not matter here.',
    'Take the square root of the total: that is the distance, in the units of the coordinates.'
   ],
   example: {
    prompt: 'One marker is at (1, 2, 0) and another at (3, 4, 1), in metres. How far apart are they?',
    steps: [
     'The changes: x 3 − 1 = 2, y 4 − 2 = 2, z 1 − 0 = 1.',
     'Squared and added: 4 + 4 + 1 = 9.',
     'The square root: √9 = 3.'
    ],
    answer: '3 metres.'
   },
   pitfalls: [
    'Forgetting the z change and using only x and y. That is the distance across the floor, not through space.',
    'Subtracting a negative coordinate wrongly: from −1 to 1 the change is 1 − (−1) = 2, not 0.',
    'Adding the three changes instead of their squares, or forgetting the square root at the end.'
   ]
  },
  guidance: [
   { prompt: 'Take B minus A along each axis. What are the changes in x, in y and in z?', answer: [6, 2, 3], labels: ['change in x (m)', 'change in y (m)', 'change in z (m)'], explanation: 'x: 8 − 2 = 6, y: 1 − (−1) = 2, z: 6 − 3 = 3.' },
   { prompt: 'Square the three changes 6, 2 and 3 and add them. What is the total?', answer: [49], labels: ['sum of squares'], explanation: '6² + 2² + 3² = 36 + 4 + 9 = 49. A square is never negative, so the signs of the changes do not matter here.' },
   { prompt: 'The distance is the square root of that total. What is √49?', answer: [7], labels: ['distance (m)'], explanation: '√49 = 7, so the beacons are 7 metres apart in a straight line.' }
  ]
 },
 {
  id: 'q02', title: 'Arrows from the corner post', topic: 'Vectors: components, adding and scaling', tier: 'Basic', sector: 'Survey Deck',
  brief: 'The surveyors record every move as an arrow, and Mira needs one arrow that combines two of them so the crew can walk it in a single leg.',
  lesson: 'A vector is an arrow written by its components ⟨a, b, c⟩; vectors add component by component, and a scalar multiplies every component.',
  prompt: 'Two survey arrows start at the deck’s corner post: u = ⟨3, −1, 2⟩ and v = ⟨1, 4, −2⟩, in metres east, north and up. The team needs the arrow 2u − v. Enter its three components: x, then y, then z.',
  answer: [5, -6, 6], labels: ['x component', 'y component', 'z component'], tolerance: 0.01,
  hints: [
   'Scale first: multiply every component of u by the number in front of u, and every component of v by the number in front of v, sign included.',
   'Then combine the two scaled arrows component by component: x with x, y with y and z with z.'
  ],
  solution: '2u = ⟨6, −2, 4⟩ and −v = ⟨−1, −4, 2⟩. Adding component by component: 2u − v = ⟨6 − 1, −2 − 4, 4 + 2⟩ = ⟨5, −6, 6⟩.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Arrow sketchbook', description: 'Two survey arrows, stretched and joined tip to tail into one.' },
  sources: [source.s2_1],
  teaching: {
   intuition: 'A move has a size and a direction: “4 metres east, 1 metre south and 2 metres up” is the same move wherever it starts. Such a move is a vector, drawn as an arrow. Its components are the amounts along each axis, written in angle brackets: ⟨4, −1, 2⟩. Another way to write the same vector uses i, j and k, the arrows of length 1 along x, y and z: ⟨4, −1, 2⟩ = 4i − j + 2k. Two moves made one after the other add up component by component, because east moves add to east moves and up moves to up moves. A plain number, such as 3 or −2, is called a scalar when it multiplies a vector: it stretches the arrow by that factor, and a negative scalar also turns it round. So 3u means “do u three times”, and −v means “do v backwards”. We write vectors in bold or as single letters such as u and v.',
   steps: [
    'Read each vector’s components in the order x, y, z.',
    'Scale: multiply every component of a vector by its scalar, sign included.',
    'Add: put the scaled vectors together component by component, x with x, y with y and z with z.',
    'Write the result in angle brackets, ⟨x, y, z⟩.'
   ],
   example: {
    prompt: 'u = ⟨1, 0, 2⟩ and v = ⟨2, 1, −1⟩. Find u + 3v.',
    steps: [
     'Scale v: 3v = ⟨6, 3, −3⟩.',
     'Add component by component: ⟨1 + 6, 0 + 3, 2 − 3⟩.'
    ],
    answer: 'u + 3v = ⟨7, 3, −1⟩.'
   },
   pitfalls: [
    'Scaling only the first component. A scalar multiplies every component of the vector.',
    'Losing the minus sign of a subtraction: u − v means u + (−1)v, so every component of v changes sign.',
    'Mixing components, such as adding the x of one vector to the y of the other.'
   ]
  },
  guidance: [
   { prompt: 'Multiply each component of u = ⟨3, −1, 2⟩ by 2. What is 2u?', answer: [6, -2, 4], labels: ['x', 'y', 'z'], explanation: '2 × 3 = 6, 2 × (−1) = −2 and 2 × 2 = 4, so 2u = ⟨6, −2, 4⟩.' },
   { prompt: 'Multiply each component of v = ⟨1, 4, −2⟩ by −1. What is −v?', answer: [-1, -4, 2], labels: ['x', 'y', 'z'], explanation: '−1 × 1 = −1, −1 × 4 = −4 and −1 × (−2) = 2, so −v = ⟨−1, −4, 2⟩.' },
   { prompt: 'Add ⟨6, −2, 4⟩ and ⟨−1, −4, 2⟩ component by component. What is 2u − v?', answer: [5, -6, 6], labels: ['x component', 'y component', 'z component'], explanation: 'x: 6 − 1 = 5, y: −2 − 4 = −6, z: 4 + 2 = 6.' }
  ]
 },
 {
  id: 'q03', title: 'One metre along the survey line', topic: 'Magnitude and unit vectors', tier: 'Basic', sector: 'Survey Deck',
  brief: 'The laser on beacon A must be set to a pointing direction of exactly one metre in length, and Mira needs the arrow’s full length first.',
  lesson: 'The magnitude ‖v‖ of a vector is its length, the square root of the sum of its squared components; dividing v by ‖v‖ gives the unit vector in its direction.',
  prompt: 'A survey arrow from beacon A to beacon B is v = ⟨2, −3, 6⟩, in metres. Enter its magnitude ‖v‖ in metres, then the three components of the unit vector in the same direction, x, then y, then z, each typed as a fraction such as 5/9.',
  answer: [7, 0.285714286, -0.428571429, 0.857142857], labels: ['magnitude (m)', 'unit x', 'unit y', 'unit z'], tolerance: 0.00005,
  hints: [
   'The magnitude is the square root of the sum of the squared components.',
   'A unit vector has length 1: divide every component of v by the magnitude, keeping each sign.'
  ],
  solution: '‖v‖ = √(2² + (−3)² + 6²) = √(4 + 9 + 36) = √49 = 7 metres. Dividing each component by 7 gives the unit vector ⟨2/7, −3/7, 6/7⟩, which points the same way as v and has length 1.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'Laser pointing card', description: 'A survey arrow shrunk to length 1, keeping only its direction.' },
  sources: [source.s2_2],
  teaching: {
   intuition: 'A vector’s components say how far it goes along each axis. Its total length is called its magnitude, written ‖v‖ with double bars. It is the distance from the arrow’s tail to its tip, so the distance formula from the first mission gives it: ‖v‖ = √(a² + b² + c²) for v = ⟨a, b, c⟩. Often only the direction matters, as when a laser is told which way to point. Then we use a unit vector: an arrow of magnitude 1 pointing the same way. To make one, divide every component by the magnitude. The arrow shrinks or stretches to length 1 but its direction does not change. The vectors i, j and k are unit vectors along the three axes.',
   steps: [
    'Square each component and add the squares.',
    'Take the square root: that is the magnitude ‖v‖.',
    'Divide each component by ‖v‖, keeping its sign. The result is the unit vector in the direction of v.',
    'Check: the squares of the unit vector’s components add up to 1.'
   ],
   example: {
    prompt: 'Find the magnitude of ⟨1, 2, −2⟩ and the unit vector in its direction.',
    steps: [
     'Squares: 1 + 4 + 4 = 9, so the magnitude is √9 = 3.',
     'Divide each component by 3: ⟨1/3, 2/3, −2/3⟩.',
     'Check: 1/9 + 4/9 + 4/9 = 1.'
    ],
    answer: 'Magnitude 3; unit vector ⟨1/3, 2/3, −2/3⟩.'
   },
   pitfalls: [
    'Adding the components instead of their squares. A negative component still adds a positive square.',
    'Dividing by the sum of squares instead of its square root.',
    'Dropping a minus sign when dividing: the unit vector must point the same way as v.'
   ]
  },
  guidance: [
   { prompt: 'Square the components of ⟨2, −3, 6⟩ and add them. What is the total?', answer: [49], labels: ['sum of squares'], explanation: '2² + (−3)² + 6² = 4 + 9 + 36 = 49.' },
   { prompt: 'The magnitude is the square root of 49. What is ‖v‖?', answer: [7], labels: ['magnitude (m)'], explanation: '√49 = 7, so the arrow is 7 metres long.' },
   { prompt: 'Divide each component of ⟨2, −3, 6⟩ by 7. What are the components of the unit vector? Type them as fractions.', answer: [0.285714286, -0.428571429, 0.857142857], labels: ['unit x', 'unit y', 'unit z'], explanation: '2 ÷ 7 = 2/7, −3 ÷ 7 = −3/7, 6 ÷ 7 = 6/7. Check: the squares of these add up to 1.' }
  ]
 },
 {
  id: 'q04', title: 'The angle at beacon A', topic: 'Dot product and the angle between vectors', tier: 'Basic', sector: 'Survey Deck',
  brief: 'Two sight lines leave beacon A, one to the dish and one to the mast, and Mira wants the angle between them without climbing up with a protractor.',
  lesson: 'The dot product u · v is the sum of the products of matching components, and it equals ‖u‖ ‖v‖ cos θ, so it gives the angle θ between the vectors.',
  prompt: 'Two survey arrows leave beacon A: u = ⟨1, 2, 2⟩ towards the dish and v = ⟨6, −3, 2⟩ towards the mast. Enter the dot product u · v, then the angle between the two arrows in radians, rounded to 3 decimal places.',
  answer: [4, 1.379], labels: ['u · v', 'angle (rad)'], tolerance: 0.0005,
  hints: [
   'The dot product multiplies matching components and adds the three products.',
   'The cosine of the angle is u · v divided by the product of the two magnitudes. Then arccos, in radians, gives an angle between 0 and π.'
  ],
  solution: 'u · v = 1 × 6 + 2 × (−3) + 2 × 2 = 6 − 6 + 4 = 4. ‖u‖ = √9 = 3 and ‖v‖ = √49 = 7. So cos θ = 4 ÷ (3 × 7) = 4/21, and θ = arccos(4/21), which is 1.379 radians to 3 decimal places.',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'Sight-line protractor', description: 'An angle in space found from components alone.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'There is a way to multiply two vectors that gives a plain number. Multiply the matching components and add the three products: for u = ⟨u₁, u₂, u₃⟩ and v = ⟨v₁, v₂, v₃⟩ the dot product is u · v = u₁v₁ + u₂v₂ + u₃v₃. The small numbers ₁, ₂, ₃ just mean first, second and third component. The dot product measures how much two arrows point the same way. It obeys a rule that links it to the angle θ (the Greek letter theta) between the two arrows when they start at the same point: u · v = ‖u‖ ‖v‖ cos θ. So cos θ = u · v ÷ (‖u‖ ‖v‖). The angle between two vectors is taken from 0 to π radians, and arccos, the inverse of cosine (cos⁻¹ on a calculator), returns exactly that range. A positive dot product means an angle below π/2, a negative one an angle above π/2, and a dot product of 0 means the arrows are at right angles: such vectors are called orthogonal.',
   steps: [
    'Multiply matching components and add: that is u · v.',
    'Find the two magnitudes ‖u‖ and ‖v‖.',
    'Divide: cos θ = u · v ÷ (‖u‖ ‖v‖).',
    'Take arccos with the calculator in radians. The angle lies between 0 and π.'
   ],
   example: {
    prompt: 'Find the angle between ⟨2, 1, 2⟩ and ⟨−1, 2, 2⟩.',
    steps: [
     'Dot product: 2 × (−1) + 1 × 2 + 2 × 2 = −2 + 2 + 4 = 4.',
     'Both magnitudes are √9 = 3, so cos θ = 4 ÷ 9.',
     'θ = arccos(4 ÷ 9), about 1.110 radians.'
    ],
    answer: 'u · v = 4 and the angle is about 1.110 radians.'
   },
   pitfalls: [
    'Leaving the calculator in degrees. The angle is wanted in radians.',
    'Dividing by the sum of the magnitudes instead of their product.',
    'Treating the dot product as a vector. It is a single number.'
   ]
  },
  guidance: [
   { prompt: 'Multiply matching components of ⟨1, 2, 2⟩ and ⟨6, −3, 2⟩ and add. What is u · v?', answer: [4], labels: ['u · v'], explanation: '1 × 6 + 2 × (−3) + 2 × 2 = 6 − 6 + 4 = 4.' },
   { prompt: 'What are the magnitudes ‖u‖ and ‖v‖?', answer: [3, 7], labels: ['‖u‖', '‖v‖'], explanation: '‖u‖ = √(1 + 4 + 4) = 3 and ‖v‖ = √(36 + 9 + 4) = 7.' },
   { prompt: 'cos θ = 4 ÷ (3 × 7). What is θ = arccos of that, in radians, to 3 decimal places?', answer: [1.379], labels: ['angle (rad)'], explanation: 'cos θ = 4/21, and arccos(4/21) is 1.379 radians to 3 decimal places. The dot product is positive, so the angle is less than π/2.' }
  ]
 },
 {
  id: 'q05', title: 'Hauling the cargo sled', topic: 'Projection; work as a dot product', tier: 'Basic', sector: 'Survey Deck',
  brief: 'A winch cable pulls a cargo sled at a slant across the deck, and Mira needs to know how much of the pull actually moves the sled and the energy it costs.',
  lesson: 'The scalar projection of F onto d is F · d ÷ ‖d‖, the part of F along d; the work done by a constant force F over a displacement d is F · d.',
  prompt: 'A winch drags a cargo sled across the survey deck with a constant force F = ⟨10, 4, 3⟩ newtons, while the sled moves along the displacement d = ⟨6, 2, 3⟩ metres. Enter the scalar projection of F onto d (the part of the force along the motion) in newtons, then the work the winch does in joules.',
  answer: [11, 77], labels: ['scalar projection (N)', 'work (J)'], tolerance: 0.01,
  hints: [
   'The work done by a constant force is the dot product of the force and the displacement.',
   'The scalar projection is that dot product divided by the magnitude of d.'
  ],
  solution: 'F · d = 10 × 6 + 4 × 2 + 3 × 3 = 60 + 8 + 9 = 77, so the work is 77 joules. ‖d‖ = √49 = 7 metres, so the scalar projection is 77 ÷ 7 = 11 newtons: only that much of the force pulls along the motion.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Winch log', description: 'A slanted pull split into the part that moves the load, and the energy it spends.' },
  sources: [source.s2_3],
  teaching: {
   intuition: 'When a cable pulls a sled at a slant, only part of the pull drags it forward; the rest lifts or pushes sideways and moves nothing. The part of a vector F that lies along another vector d is called the scalar projection of F onto d. Since F · d = ‖F‖ ‖d‖ cos θ, and ‖F‖ cos θ is exactly the length of F’s shadow along d, the scalar projection is F · d ÷ ‖d‖. Work is the energy a force spends moving something: the force along the motion times the distance moved. With a force in newtons and a displacement d in metres, the work in joules is that scalar projection times ‖d‖, which is simply W = F · d. A force at right angles to the motion does no work, because then F · d = 0.',
   steps: [
    'Write the force F and the displacement d, the arrow from the start to the end of the motion, as components.',
    'Work out F · d. That is the work W in joules.',
    'Find ‖d‖, the distance moved.',
    'Divide: the scalar projection of F onto d is F · d ÷ ‖d‖, in newtons.'
   ],
   example: {
    prompt: 'A force F = ⟨6, 1, 1⟩ newtons moves a crate along d = ⟨2, 1, 2⟩ metres. Find the scalar projection of F onto d and the work done.',
    steps: [
     'F · d = 12 + 1 + 2 = 15, so the work is 15 joules.',
     '‖d‖ = √(4 + 1 + 4) = 3 metres.',
     'Scalar projection: 15 ÷ 3 = 5 newtons.'
    ],
    answer: 'Scalar projection 5 N; work 15 J.'
   },
   pitfalls: [
    'Dividing by ‖F‖ instead of ‖d‖. The projection is onto d, so it is d’s length that goes underneath.',
    'Multiplying the magnitudes ‖F‖ × ‖d‖ for the work. That counts the sideways part of the force too.',
    'Dividing the work by ‖d‖ twice. The work is F · d itself.'
   ]
  },
  guidance: [
   { prompt: 'Multiply matching components of F and d and add. What is F · d?', answer: [77], labels: ['F · d'], explanation: '10 × 6 + 4 × 2 + 3 × 3 = 60 + 8 + 9 = 77. This is also the work in joules.' },
   { prompt: 'What is the magnitude ‖d‖ of the displacement?', answer: [7], labels: ['‖d‖ (m)'], explanation: '‖d‖ = √(36 + 4 + 9) = √49 = 7 metres.' },
   { prompt: 'Divide F · d by ‖d‖. What is the scalar projection of F onto d?', answer: [11], labels: ['scalar projection (N)'], explanation: '77 ÷ 7 = 11 newtons.' }
  ]
 },
 {
  id: 'q06', title: 'Squaring up the solar frame', topic: 'Cross product and the area of a parallelogram', tier: 'Basic', sector: 'Survey Deck',
  brief: 'A slanted solar frame is ready to be skinned, and Mira needs the arrow that stands straight off it and the amount of panel to cut.',
  lesson: 'The cross product u × v is a vector at right angles to both u and v, and its magnitude is the area of the parallelogram they span.',
  prompt: 'A solar panel frame on the survey deck is a parallelogram whose two edges leave the same corner along u = ⟨2, 1, 2⟩ and v = ⟨1, 2, −2⟩, in metres. Enter the three components of u × v, x then y then z, then the panel’s area in square metres.',
  answer: [-6, 6, 3, 9], labels: ['x component', 'y component', 'z component', 'area (m²)'], tolerance: 0.01,
  hints: [
   'Each component of u × v is a criss-cross difference: x = u₂v₃ − u₃v₂, y = u₃v₁ − u₁v₃, z = u₁v₂ − u₂v₁.',
   'The area of the parallelogram is the magnitude of the cross product.'
  ],
  solution: 'x: 1 × (−2) − 2 × 2 = −6. y: 2 × 1 − 2 × (−2) = 6. z: 2 × 2 − 1 × 1 = 3. So u × v = ⟨−6, 6, 3⟩, and the area is ‖u × v‖ = √(36 + 36 + 9) = √81 = 9 square metres.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Frame square', description: 'Two edges of a panel, and the arrow standing straight up from both.' },
  sources: [source.s2_4],
  teaching: {
   intuition: 'The second way to multiply two vectors gives a vector, not a number. The cross product u × v is an arrow at right angles to both u and v. Its components follow a criss-cross recipe: u × v = ⟨u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁⟩. A way to remember it: for each component, cover that column of u and v and take “top left times bottom right minus top right times bottom left” of the two columns that remain, which is a 2 × 2 determinant (the middle one comes out with its order turned round, as written above). The cross product has a length with a meaning: ‖u × v‖ is the area of the parallelogram whose sides are u and v. Its direction follows the right-hand rule: curl the fingers of your right hand from u towards v and your thumb points along u × v, so v × u points the opposite way. This mission uses the cross product for areas. The same product also measures turning, which the practice missions use: a force F applied at the end of a lever arm r gives a torque r × F, whose length says how hard it twists.',
   steps: [
    'Write u = ⟨u₁, u₂, u₃⟩ and v = ⟨v₁, v₂, v₃⟩.',
    'x component: u₂v₃ − u₃v₂. y component: u₃v₁ − u₁v₃. z component: u₁v₂ − u₂v₁.',
    'Check: the dot product of u × v with u, and with v, is 0.',
    'The area of the parallelogram with sides u and v is ‖u × v‖.'
   ],
   example: {
    prompt: 'Find u × v for u = ⟨2, 2, 1⟩ and v = ⟨1, −2, 2⟩, and the area of the parallelogram they span.',
    steps: [
     'x: 2 × 2 − 1 × (−2) = 6. y: 1 × 1 − 2 × 2 = −3. z: 2 × (−2) − 2 × 1 = −6.',
     'Check with u: 12 − 6 − 6 = 0.',
     'Area: √(36 + 9 + 36) = √81 = 9.'
    ],
    answer: 'u × v = ⟨6, −3, −6⟩ and the area is 9.'
   },
   pitfalls: [
    'Getting the y component the wrong way round. It is u₃v₁ − u₁v₃, not u₁v₃ − u₃v₁.',
    'Swapping the order: v × u is the opposite arrow of u × v.',
    'Using the dot product for the area. The area is the magnitude of the cross product.'
   ]
  },
  guidance: [
   { prompt: 'The x component is u₂v₃ − u₃v₂. What is it here?', answer: [-6], labels: ['x component'], explanation: '1 × (−2) − 2 × 2 = −2 − 4 = −6.' },
   { prompt: 'The y component is u₃v₁ − u₁v₃ and the z component is u₁v₂ − u₂v₁. What are they?', answer: [6, 3], labels: ['y component', 'z component'], explanation: 'y: 2 × 1 − 2 × (−2) = 6. z: 2 × 2 − 1 × 1 = 3.' },
   { prompt: 'The area is the magnitude of u × v = ⟨−6, 6, 3⟩. What is it?', answer: [9], labels: ['area (m²)'], explanation: '√(36 + 36 + 9) = √81 = 9, so the panel covers 9 square metres.' }
  ]
 },
 {
  id: 'q07', title: 'The approach path', topic: 'Lines in space', tier: 'Basic', sector: 'Orbital Dock',
  brief: 'A shuttle is gliding in on a straight approach path, and the dock crew need to know when it reaches the ring and where to stand when it does.',
  lesson: 'A line in space is a start point plus t times a direction vector: x = x₀ + at, y = y₀ + bt, z = z₀ + ct.',
  prompt: 'A shuttle’s approach path to the orbital dock is the line x = 4 + 3t, y = −2 + t, z = 10 − 2t, with lengths in metres and t in seconds: it starts at (4, −2, 10) and moves by ⟨3, 1, −2⟩ every second. The docking ring is at height z = 2. Enter the time t at which the shuttle reaches that height, then its x and y coordinates at that moment.',
  answer: [4, 16, 2], labels: ['time t (s)', 'x (m)', 'y (m)'], tolerance: 0.01,
  hints: [
   'Set the z equation equal to the height of the ring and solve it for t.',
   'Put that value of t into the x and y equations.'
  ],
  solution: '10 − 2t = 2 gives −2t = −8, so t = −8 ÷ (−2) = 4 seconds. Then x = 4 + 3 × 4 = 16 and y = −2 + 1 × 4 = 2, so the shuttle reaches the ring’s height at (16, 2, 2).',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'Approach chart', description: 'A straight path through space, one equation for each coordinate.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'A shuttle flying straight at a steady rate starts at a point and moves by the same vector every second. That vector is the direction vector of its path. After t seconds it has moved t times the direction vector, so its position is the start point plus t times the direction: (x, y, z) = (x₀, y₀, z₀) + t⟨a, b, c⟩. Written one coordinate at a time these are the parametric equations of a line: x = x₀ + at, y = y₀ + bt, z = z₀ + ct. The letter t is called the parameter: each value of t gives one point on the line, and t = 0 gives the start point. To find when the line reaches a given height, solve the z equation for t; then the other two equations give where it is at that moment.',
   steps: [
    'Read the start point (x₀, y₀, z₀) and the direction vector ⟨a, b, c⟩ from the equations.',
    'To find when the path reaches a height h, set z₀ + ct = h and solve for t.',
    'Put that t into x = x₀ + at and y = y₀ + bt.',
    'Check: the point found has z = h.'
   ],
   example: {
    prompt: 'A path starts at (1, 0, 5) and moves by ⟨2, −1, −1⟩ each second. Where is it when z = 3?',
    steps: [
     'z = 5 − t = 3 gives t = 2.',
     'x = 1 + 2 × 2 = 5 and y = 0 − 2 = −2.'
    ],
    answer: 'At t = 2 it is at (5, −2, 3).'
   },
   pitfalls: [
    'Forgetting the start point and giving only t times the direction.',
    'Using the x or y equation to find when the height is reached. Only the z equation is about height.',
    'Dividing by the size of the direction component but dropping its sign: a negative c means the path is descending.'
   ]
  },
  guidance: [
   { prompt: 'Solve 10 − 2t = 2 for t. What is t?', answer: [4], labels: ['time t (s)'], explanation: 'Subtract 10 from both sides: −2t = −8. Divide by (−2): t = 4.' },
   { prompt: 'Put t = 4 into x = 4 + 3t and y = −2 + t. What are x and y?', answer: [16, 2], labels: ['x (m)', 'y (m)'], explanation: 'x = 4 + 3 × 4 = 16 and y = −2 + 1 × 4 = 2.' }
  ]
 },
 {
  id: 'q08', title: 'Three bolts make a panel', topic: 'Planes and their normal vectors', tier: 'Basic', sector: 'Orbital Dock',
  brief: 'Three anchor bolts are set for a docking panel, and the fitters want the panel’s equation so they can check every other fixing against it.',
  lesson: 'A plane through a point P with normal vector n = ⟨a, b, c⟩ has the equation ax + by + cz = d, where d = n · P; three points give n as a cross product.',
  prompt: 'Three anchor bolts for a docking panel sit at P(1, 0, 2), Q(3, 1, 2) and R(1, 2, 5), in metres. Use the normal vector n = PQ × PR, where PQ is the arrow from P to Q and PR the arrow from P to R. The panel’s plane is then ax + by + cz = d with ⟨a, b, c⟩ = n. Enter a, b and c, then d.',
  answer: [3, -6, 4, 11], labels: ['a', 'b', 'c', 'd'], tolerance: 0.01,
  hints: [
   'Each arrow is its end point minus its start point: PQ = Q − P and PR = R − P.',
   'The cross product of the two arrows is the normal vector. Then d is n · P, because P lies in the plane.'
  ],
  solution: 'PQ = ⟨2, 1, 0⟩ and PR = ⟨0, 2, 3⟩. Their cross product is n = ⟨1 × 3 − 0 × 2, 0 × 0 − 2 × 3, 2 × 2 − 1 × 0⟩ = ⟨3, −6, 4⟩. Then d = n · P = 3 × 1 + (−6) × 0 + 4 × 2 = 11. The plane is 3x − 6y + 4z = 11.',
  xp: 100, prereqs: ['q06'],
  artifact: { name: 'Panel template', description: 'A flat plane in space, pinned down by three bolts and one perpendicular arrow.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'A flat panel in space lies in a plane. The easiest way to describe a plane is by the arrow that stands straight out of it, at right angles to every direction within it. That arrow is called a normal vector, n = ⟨a, b, c⟩. A point (x, y, z) is in the plane exactly when the arrow from a known point P of the plane to it is at right angles to n, that is when their dot product is 0. Worked out, that condition reads ax + by + cz = d, where d = n · P: the equation of the plane. Three points P, Q and R that do not lie on one line fix a plane. The arrows PQ = Q − P and PR = R − P both lie in it, so their cross product, which is at right angles to both, is a normal vector. Any multiple of n is also a normal, and it multiplies the whole equation by the same number, so we fix n = PQ × PR.',
   steps: [
    'Form the two arrows in the plane: PQ = Q − P and PR = R − P.',
    'Take the cross product n = PQ × PR. Its components are a, b and c.',
    'Work out d = n · P, using the point P.',
    'Check the equation ax + by + cz = d with Q and with R.'
   ],
   example: {
    prompt: 'Find the plane through P(0, 0, 1), Q(2, 0, 1) and R(0, 1, 3), with n = PQ × PR.',
    steps: [
     'PQ = ⟨2, 0, 0⟩ and PR = ⟨0, 1, 2⟩.',
     'n = ⟨0 × 2 − 0 × 1, 0 × 0 − 2 × 2, 2 × 1 − 0 × 0⟩ = ⟨0, −4, 2⟩.',
     'd = n · P = 0 + 0 + 2 = 2. Check R: −4 + 6 = 2.'
    ],
    answer: 'The plane is −4y + 2z = 2.'
   },
   pitfalls: [
    'Subtracting the wrong way: PQ is Q − P, the end point minus the start point.',
    'Using a point that is not in the plane, such as the origin, for d.',
    'Treating the plane’s equation as a line’s. Three coordinates are tied together by one equation, not three.'
   ]
  },
  guidance: [
   { prompt: 'Subtract P from Q. What are the components of PQ?', answer: [2, 1, 0], labels: ['x', 'y', 'z'], explanation: 'PQ = (3, 1, 2) − (1, 0, 2) = ⟨2, 1, 0⟩.' },
   { prompt: 'Subtract P from R. What are the components of PR?', answer: [0, 2, 3], labels: ['x', 'y', 'z'], explanation: 'PR = (1, 2, 5) − (1, 0, 2) = ⟨0, 2, 3⟩.' },
   { prompt: 'Work out n = PQ × PR = ⟨2, 1, 0⟩ × ⟨0, 2, 3⟩. What are its components?', answer: [3, -6, 4], labels: ['a', 'b', 'c'], explanation: 'x: 1 × 3 − 0 × 2 = 3, y: 0 × 0 − 2 × 3 = −6, z: 2 × 2 − 1 × 0 = 4.' },
   { prompt: 'P lies in the plane, so d = n · P. What is d?', answer: [11], labels: ['d'], explanation: '3 × 1 + (−6) × 0 + 4 × 2 = 11.' }
  ]
 },
 {
  id: 'q09', title: 'How close is the drone?', topic: 'Distance from a point to a plane', tier: 'Basic', sector: 'Orbital Dock',
  brief: 'A maintenance drone is hovering near a guide panel, and its safety rules need its clearance from the panel’s plane.',
  lesson: 'The distance from a point (x₀, y₀, z₀) to the plane ax + by + cz = d is |ax₀ + by₀ + cz₀ − d| ÷ √(a² + b² + c²).',
  prompt: 'A guide panel at the orbital dock lies in the plane x + 2y − 3z = 4, in metres. A maintenance drone hovers at (5, 1, −2). Enter the value of x + 2y − 3z − 4 at the drone, then the drone’s shortest distance to the plane in metres, rounded to 2 decimal places.',
  answer: [9, 2.41], labels: ['value at the drone', 'distance (m)'], tolerance: 0.005,
  hints: [
   'Put the drone’s coordinates into the left side of the plane’s equation and subtract the right side.',
   'The distance is the size of that value, without its sign, divided by the magnitude of the normal vector ⟨a, b, c⟩.'
  ],
  solution: 'At (5, 1, −2): 5 + 2 × 1 − 3 × (−2) − 4 = 9. The normal vector is n = ⟨1, 2, −3⟩, with ‖n‖ = √(1 + 4 + 9) = √14. The distance is |9| ÷ ‖n‖ = 9 ÷ √14, which is 2.41 metres to 2 decimal places.',
  xp: 100, prereqs: ['q08', 'q05'],
  artifact: { name: 'Clearance gauge', description: 'The shortest gap between a hovering point and a flat panel.' },
  sources: [source.s2_5],
  teaching: {
   intuition: 'The shortest way from a point to a plane runs straight along the normal, at right angles to the plane. Take any point P of the plane and the arrow from P to the drone. Only the part of that arrow along the normal n counts: its scalar projection onto n, the idea from the winch mission. Worked out, the dot product with n turns into the plane’s left side minus its right side, evaluated at the drone. So the distance from (x₀, y₀, z₀) to the plane ax + by + cz = d is |ax₀ + by₀ + cz₀ − d| ÷ ‖n‖, with ‖n‖ = √(a² + b² + c²). The bars | | mean absolute value: the size without its sign. The sign of ax₀ + by₀ + cz₀ − d only says which side of the plane the point is on, and a value of 0 means the point lies in the plane.',
   steps: [
    'Read the normal n = ⟨a, b, c⟩ and the number d from the plane’s equation.',
    'Put the point into ax + by + cz − d.',
    'Find ‖n‖ = √(a² + b² + c²).',
    'Divide the size of the value, without its sign, by ‖n‖. Round only at the end.'
   ],
   example: {
    prompt: 'How far is the point (3, 1, 2) from the plane 2x + y + 2z = 1?',
    steps: [
     'Value: 2 × 3 + 1 + 2 × 2 − 1 = 10.',
     '‖n‖ = √(4 + 1 + 4) = 3.',
     'Distance: 10 ÷ 3, about 3.33.'
    ],
    answer: 'About 3.33 units.'
   },
   pitfalls: [
    'Forgetting to subtract d, which measures the distance to a parallel plane through the origin instead.',
    'Dividing by a² + b² + c² instead of its square root.',
    'Giving a negative distance. A distance is the size of the value, so drop the sign.'
   ]
  },
  guidance: [
   { prompt: 'Put x = 5, y = 1 and z = −2 into x + 2y − 3z − 4. What do you get?', answer: [9], labels: ['value at the drone'], explanation: '5 + 2 × 1 − 3 × (−2) − 4 = 9. It is not 0, so the drone is not in the plane.' },
   { prompt: 'What is ‖n‖², the sum of the squares of the coefficients 1, 2 and −3?', answer: [14], labels: ['‖n‖²'], explanation: '1 + 4 + 9 = 14, so ‖n‖ = √14.' },
   { prompt: 'Divide |9| by √14. What is the distance, to 2 decimal places?', answer: [2.41], labels: ['distance (m)'], explanation: '9 ÷ √14 is 2.41 to 2 decimal places. The sign of 9 only says which side of the plane the drone is on.' }
  ]
 },
 {
  id: 'q10', title: 'Clocking the cargo drone', topic: 'Vector-valued functions: velocity, speed, acceleration', tier: 'Basic', sector: 'Orbital Dock',
  brief: 'A cargo drone weaves out of the dock on a programmed curve, and traffic control wants its velocity, its speed and its upward acceleration at one moment.',
  lesson: 'A vector-valued function r(t) gives a position for each time t; its derivative r′(t), taken component by component, is the velocity, the velocity’s magnitude is the speed, and the derivative of the velocity is the acceleration.',
  prompt: 'A cargo drone leaves the orbital dock along r(t) = ⟨3t² − 4t, (6 ÷ π) sin(πt), t³⟩ metres, t seconds after release (the sine works in radians). Enter its velocity at t = 2, as x, y and z components in metres per second, then its speed at that moment in metres per second, rounded to 2 decimal places, then the z component of its acceleration at that moment in metres per second squared.',
  answer: [8, 6, 12, 15.62, 12], labels: ['x velocity (m/s)', 'y velocity (m/s)', 'z velocity (m/s)', 'speed (m/s)', 'z acceleration (m/s²)'], tolerance: 0.005,
  hints: [
   'Velocity is the derivative of the position, taken one component at a time. For the middle one, the chain rule gives the derivative of sin(πt) as π cos(πt).',
   'Speed is the magnitude of the velocity: the square root of the sum of its squared components. Acceleration is the derivative of the velocity, again one component at a time.'
  ],
  solution: 'v(t) = r′(t) = ⟨6t − 4, 6 cos(πt), 3t²⟩. At t = 2: 6 × 2 − 4 = 8, 6 cos(2π) = 6 × 1 = 6, and 3 × 4 = 12. So v(2) = ⟨8, 6, 12⟩ m/s. The speed is √(64 + 36 + 144) = √244, which is 15.62 m/s to 2 decimal places. Differentiating the z velocity 3t² again gives the z acceleration 6t, which at t = 2 is 6 × 2 = 12 m/s².',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'Flight recorder', description: 'A curved path through space, its velocity arrow and its speed.' },
  sources: [source.s3_2, source.s3_4],
  teaching: {
   intuition: 'A path that curves through space can be described by giving the position at every time t: r(t) = ⟨x(t), y(t), z(t)⟩. Because it gives a vector for each number t, it is called a vector-valued function. You met the flat version as a parametric curve in Calculus 2. How fast is each coordinate changing? That is the derivative of each component, so the derivative of r is taken one component at a time: r′(t) = ⟨x′(t), y′(t), z′(t)⟩. This vector is the velocity v(t). It points the way the object is moving, and its magnitude ‖v(t)‖ is the speed, a plain number in metres per second. Differentiating once more gives the acceleration vector a(t) = v′(t) = r″(t), which says how the velocity itself is changing. Remember the chain rule: the derivative of sin(kt) is k cos(kt), and of cos(kt) it is −k sin(kt), with angles in radians.',
   steps: [
    'Differentiate each component of r(t) separately: that gives the velocity v(t) = r′(t).',
    'Put the given time into each component of v(t).',
    'The speed is the magnitude of the velocity: the square root of the sum of the squared components.',
    'For the acceleration, differentiate the velocity again, component by component.'
   ],
   example: {
    prompt: 'r(t) = ⟨t², (4 ÷ π) sin(πt), 2t⟩. Find the velocity and the speed at t = 1.',
    steps: [
     'v(t) = ⟨2t, 4 cos(πt), 2⟩.',
     'At t = 1: cos(π) = −1, so v(1) = ⟨2, −4, 2⟩.',
     'Speed: √(4 + 16 + 4) = √24, about 4.90.'
    ],
    answer: 'v(1) = ⟨2, −4, 2⟩; speed about 4.90.'
   },
   pitfalls: [
    'Forgetting the chain rule on sin(πt): its derivative is π cos(πt), and the π cancels the one in front.',
    'Giving the position instead of the velocity: put the time into r′(t), not r(t).',
    'Adding the velocity components for the speed. The speed is the magnitude, a square root of squares.'
   ]
  },
  guidance: [
   { prompt: 'Differentiate the x component 3t² − 4t and put in t = 2. What is the x velocity?', answer: [8], labels: ['x velocity (m/s)'], explanation: 'The derivative is 6t − 4, and 6 × 2 − 4 = 8.' },
   { prompt: 'The derivative of (6 ÷ π) sin(πt) is 6 cos(πt), and the derivative of t³ is 3t². What are the y and z velocities at t = 2?', answer: [6, 12], labels: ['y velocity (m/s)', 'z velocity (m/s)'], explanation: 'cos(2π) = 1, so y: 6 × 1 = 6. z: 3 × 4 = 12.' },
   { prompt: 'The velocity is ⟨8, 6, 12⟩. What is the speed, its magnitude, to 2 decimal places?', answer: [15.62], labels: ['speed (m/s)'], explanation: '√(64 + 36 + 144) = √244, which is 15.62 to 2 decimal places.' },
   { prompt: 'The acceleration is the derivative of the velocity. Differentiate the z velocity 3t² and put in t = 2. What is the z acceleration?', answer: [12], labels: ['z acceleration (m/s²)'], explanation: 'The derivative of 3t² is 6t, and 6 × 2 = 12 m/s².' }
  ]
 }
);
})();
