/* Calculus 2: accumulation missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/calc2/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Areas and solids · Basic, 100 XP · sector 'Hull Foundry' · Chapter review: areas and solids mixed [2.1, 2.2]
     q12  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Cylindrical shells [2.3]
     q13  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Arc length of a curve [2.4]
     q14  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Work done by a varying force; springs [2.5]
     q15  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Pumping water out of a tank [2.5]
     q16  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Mass, moments and centre of mass [2.6]
     q17  ch 3 Length, work and balance · Intermediate, 150 XP · sector 'Cargo Crane' · Chapter review: shells, work and balance [2.3, 2.5]
     q18  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Integration by parts [3.1]
     q19  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Powers of sine and cosine [3.2]
     q20  ch 4 Techniques of integration · Intermediate, 150 XP · sector 'Computing Core' · Trigonometric substitution [3.3]
   The text of prompt, hints, solution and guidance is build(canonical) of gen-b.js, cleaned by Gen.clean. */
(function(){
'use strict';
/* OpenStax Calculus Volume 2 sections the missions below cite (docs/plans/CALC2-PLAN.md; each page opened 2026-11-27). */
const source = {
 s2_1: { title: "OpenStax Calculus Volume 2 — 2.1 Areas between Curves", url: "https://openstax.org/books/calculus-volume-2/pages/2-1-areas-between-curves", description: "Areas between two curves, curves that cross, and slicing along y.", verified: '2026-11-27' },
 s2_2: { title: "OpenStax Calculus Volume 2 — 2.2 Determining Volumes by Slicing", url: "https://openstax.org/books/calculus-volume-2/pages/2-2-determining-volumes-by-slicing", description: "Volumes from cross-sections, and solids of revolution by discs and washers.", verified: '2026-11-27' },
 s2_3: { title: "OpenStax Calculus Volume 2 — 2.3 Volumes of Revolution: Cylindrical Shells", url: "https://openstax.org/books/calculus-volume-2/pages/2-3-volumes-of-revolution-cylindrical-shells", description: "The method of cylindrical shells, about the y-axis and about other vertical lines.", verified: '2026-11-27' },
 s2_4: { title: "OpenStax Calculus Volume 2 — 2.4 Arc Length of a Curve and Surface Area", url: "https://openstax.org/books/calculus-volume-2/pages/2-4-arc-length-of-a-curve-and-surface-area", description: "The arc length of a smooth curve y = f(x) as an integral of √(1 + (f′(x))²).", verified: '2026-11-27' },
 s2_5: { title: "OpenStax Calculus Volume 2 — 2.5 Physical Applications", url: "https://openstax.org/books/calculus-volume-2/pages/2-5-physical-applications", description: "Mass from density, work done by a varying force, springs and Hooke’s law, and pumping liquids.", verified: '2026-11-27' },
 s2_6: { title: "OpenStax Calculus Volume 2 — 2.6 Moments and Centers of Mass", url: "https://openstax.org/books/calculus-volume-2/pages/2-6-moments-and-centers-of-mass", description: "Moments, centres of mass of rods and thin plates, and centroids.", verified: '2026-11-27' },
 s3_1: { title: "OpenStax Calculus Volume 2 — 3.1 Integration by Parts", url: "https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts", description: "The integration by parts formula, choosing u and dv, and definite integrals by parts.", verified: '2026-11-27' },
 s3_2: { title: "OpenStax Calculus Volume 2 — 3.2 Trigonometric Integrals", url: "https://openstax.org/books/calculus-volume-2/pages/3-2-trigonometric-integrals", description: "Integrals of products of powers of sine and cosine, and the power-reducing identities.", verified: '2026-11-27' },
 s3_3: { title: "OpenStax Calculus Volume 2 — 3.3 Trigonometric Substitution", url: "https://openstax.org/books/calculus-volume-2/pages/3-3-trigonometric-substitution", description: "Substitutions x = a sin θ, a tan θ and a sec θ for integrals with square roots.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "The nozzle plate", topic: "Review: areas and solids", tier: "Basic", sector: "Hull Foundry",
  brief: "The foundry needs one plate cut and one nozzle turned from the same outline, and Mira wants both measured before the steel is touched.",
  lesson: "Split an area where the curves swap places, and build a solid of revolution from washers: π times outer radius squared minus inner radius squared.",
  prompt: "A hull plate is cut from the region between the parabola y = x² and the line y = 2x, from x = 0 to x = 3, with lengths in metres. The two curves cross inside that stretch, so they swap places. Enter the total area of the plate in m². Then the part of the plate between x = 0 and the crossing point is spun about the x-axis to make a nozzle of volume kπ m³: enter k. Type each answer as an exact fraction, such as 7/3, or as a decimal rounded to 4 places.",
  answer: [2.666666667,4.266666667], labels: ["total area (m²)","k"], tolerance: 0.00005,
  hints: [
   "Set x² equal to the line to find where the curves cross. On each side of the crossing, subtract the lower curve from the upper one before you integrate, and add the two areas.",
   "Spun about the x-axis, each slice of the nozzle is a washer: its outer radius is the line and its inner radius is the parabola, so the volume is π times the integral of (outer radius)² − (inner radius)²."
  ],
  solution: "x² = 2x gives x = 0 and x = 2. From 0 to 2 the line is on top: ∫ (2x − x²) dx = 8 ÷ 2 − 8 ÷ 3 = 4/3. From 2 to 3 the parabola is on top: ∫ (x² − 2x) dx = (27 − 8) ÷ 3 − 2 × (9 − 4) ÷ 2 = 4/3. The total area is 4/3 + 4/3 = 8/3 m². For the nozzle, the washer at x has outer radius 2x and inner radius x², so V = π ∫ from 0 to 2 of (4x² − x⁴) dx = π(32 ÷ 3 − 32 ÷ 5) = (64/15)π. So k = 64/15.",
  xp: 100, prereqs: ["q08","q10"],
  artifact: {"name":"Foundry template","description":"One outline traced twice: once as a flat plate, once spun into a nozzle."},
  sources: [source.s2_1, source.s2_2],
  teaching: {
   intuition: "This mission brings the chapter together. The area between two curves is the integral of the upper curve minus the lower one. When the curves cross, the upper one changes, so you split the interval at the crossing point, work out each piece with its own upper curve, and add the pieces. A solid of revolution is made by spinning a flat region about an axis. Each thin slice across the axis then becomes a washer: a disc with a hole in it. Its outer radius is the curve further from the axis and its inner radius is the curve nearer to it, so its area is π × outer radius² − π × inner radius². Adding up the washers along the axis with an integral gives the volume, and because every slice carries a π, the volume comes out as a number times π.",
   steps: [
    "Find where the curves cross by setting them equal and solving.",
    "On each piece between crossings, integrate the upper curve minus the lower curve, then add the pieces.",
    "For a solid spun about the x-axis, the slice at x is a washer with area π(R² − r²), where R is the outer radius and r the inner radius.",
    "Integrate π(R² − r²) across the interval. The volume is kπ, and k is the integral of R² − r²."
   ],
   example: {
    prompt: "The region between y = x² and y = x runs from x = 0 to x = 2. Find its area, and the volume made when its part from x = 0 to the crossing is spun about the x-axis.",
    steps: [
     "The curves cross where x² = x, at x = 0 and x = 1.",
     "From 0 to 1 the line is on top: ∫ (x − x²) dx = 1/2 − 1/3 = 1/6. From 1 to 2 the parabola is on top: ∫ (x² − x) dx = 7/3 − 3/2 = 5/6. The total area is 1/6 + 5/6 = 1.",
     "The washers from 0 to 1 have R = x and r = x², so V = π ∫ from 0 to 1 of (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15."
    ],
    answer: "Area 1 square unit; volume 2π/15, so k = 2/15."
   },
   pitfalls: [
    "Integrating the upper curve minus the lower curve across the whole interval without splitting at the crossing: the two pieces then partly cancel.",
    "Squaring the difference, (R − r)², instead of taking R² − r²: a washer is a big disc minus a small disc.",
    "Entering the volume itself, with π multiplied in, instead of the number k in front of π."
   ]
  },
  guidance: [
   { prompt: "Where do y = x² and y = 2x cross, apart from x = 0?", answer: [2], labels: ["crossing x"], explanation: "x² = 2x means x(x − 2) = 0, so x = 0 or x = 2. Between 0 and 2 the line is higher; beyond 2 the parabola is." },
   { prompt: "What is the area from 0 to 2, where the line is on top, and the area from 2 to 3, where the parabola is on top? Type them as fractions.", answer: [1.333333333,1.333333333], labels: ["area on the left (m²)","area on the right (m²)"], explanation: "On the left, 8 ÷ 2 − 8 ÷ 3 = 4/3. On the right, (27 − 8) ÷ 3 − 2 × (9 − 4) ÷ 2 = 4/3. Together they make 8/3 m²." },
   { prompt: "The nozzle is the left part spun about the x-axis. Its washers have outer radius 2x and inner radius x². What is k, where the volume is kπ?", answer: [4.266666667], labels: ["k"], explanation: "V = π ∫ from 0 to 2 of ((2x)² − (x²)²) dx = π(32 ÷ 3 − 32 ÷ 5) = (64/15)π." }
  ]
 },
 {
  id: "q12", title: "Turning the cable drum", topic: "Cylindrical shells", tier: "Intermediate", sector: "Cargo Crane",
  brief: "The crane needs a new cable drum turned on the lathe, and the stores want its volume to order the right block of metal.",
  lesson: "Spun about a vertical axis, a thin upright strip sweeps out a cylindrical shell of volume 2π × radius × height × thickness; integrating the shells gives the volume.",
  prompt: "A cable drum for the cargo crane is turned from the region under the arch y = 3x − x², between x = 0 and x = 3, with lengths in metres. Spun about the y-axis, the region would sweep out a solid of volume k₁π m³. The drum is instead spun about the line x = −2, which is 2 m to the left of the y-axis, and its volume is k₂π m³. Use cylindrical shells. Enter k₁, then k₂, each as an exact fraction such as 27/2 or as a decimal rounded to 4 places (type it without commas).",
  answer: [13.5,31.5], labels: ["k₁","k₂"], tolerance: 0.00005,
  hints: [
   "Cut the region into thin upright strips. Spun about a vertical line, the strip at x sweeps out a cylindrical shell of volume about 2π × radius × height × dx.",
   "The height of every shell is 3x − x². Only the radius depends on the axis: the distance from x to the y-axis is x, and the distance from x to the line x = −2 is x + 2."
  ],
  solution: "The arch meets the x-axis at x = 0 and x = 3. About the y-axis, the shell through x has radius x and height 3x − x², so V = 2π ∫ from 0 to 3 of (3x² − x³) dx = 2π(81 ÷ 3 − 81 ÷ 4) = 2π × 27/4 = (27/2)π, and k₁ = 27/2. About x = −2, the radius is x + 2, so V = 2π ∫ from 0 to 3 of (x + 2)(3x − x²) dx. Its extra part is 2π × 2 × ∫ (3x − x²) dx = 2π × 2 × 9/2 = 18π, so k₂ = 27/2 + 18 = 63/2.",
  xp: 150, prereqs: ["q10"],
  artifact: {"name":"Shell gauge","description":"A set of nested rings that slide together into a solid drum."},
  sources: [source.s2_3],
  teaching: {
   intuition: "Washers slice a solid across its axis. Cylindrical shells slice it the other way. Cut the flat region into thin upright strips. When the region spins about a vertical axis, each strip sweeps out a thin hollow tube, like the label of a tin can: that is a cylindrical shell. If you cut the label and unroll it, it is almost a flat sheet. Its length is the distance round the tube, 2π × radius; its height is the height of the strip; its thickness is the strip’s width, dx. So one shell has volume about 2π × radius × height × dx, and adding up all the shells with an integral gives V = 2π ∫ radius × height dx. The radius is the distance from the strip to the axis. About the y-axis, the strip at x has radius x; about another upright line, the radius is the distance from x to that line instead. Shells are handy when the curve is given as y = f(x) and the axis is vertical, because washers would need the curve written with x in terms of y.",
   steps: [
    "Draw a thin upright strip of the region at position x, of width dx. Its height is the upper curve minus the lower curve at x.",
    "Find the radius of the shell: the distance from x to the axis. About the y-axis it is x; about the line x = −c it is x + c.",
    "Write V = 2π ∫ radius × height dx, with the limits where the region starts and ends along x.",
    "Multiply out and integrate. The volume is kπ, and k is 2 times the integral of radius × height."
   ],
   example: {
    prompt: "The region under y = 2x − x², from x = 0 to x = 2, is spun about the y-axis. Find the volume.",
    steps: [
     "The shell through x has radius x and height 2x − x².",
     "V = 2π ∫ from 0 to 2 of x(2x − x²) dx = 2π ∫ from 0 to 2 of (2x² − x³) dx.",
     "2π(16/3 − 4) = 2π × 4/3 = 8π/3."
    ],
    answer: "V = 8π/3 cubic units, so k = 8/3."
   },
   pitfalls: [
    "Keeping the radius as x after the axis has moved: about x = −2 the radius is x + 2, not x.",
    "Using π × radius² as for a disc, or forgetting the 2π: a shell has volume 2π × radius × height × thickness.",
    "Slicing along y by habit: with shells about a vertical axis the strips are upright, so the variable is x."
   ]
  },
  guidance: [
   { prompt: "Look at the shell through x = 1. What is its height, and what is its radius when the axis is the line x = −2?", answer: [2,3], labels: ["shell height (m)","shell radius (m)"], explanation: "The height is 3 × 1 − 1² = 2 m. The axis is 2 m left of the y-axis, so the radius is 1 + 2 = 3 m." },
   { prompt: "About the y-axis, V = 2π ∫ from 0 to 3 of x(3x − x²) dx. What is k₁, where V = k₁π?", answer: [13.5], labels: ["k₁"], explanation: "2π(81 ÷ 3 − 81 ÷ 4) = 2π × 27/4 = (27/2)π." },
   { prompt: "About x = −2, the radius is x + 2. What is k₂?", answer: [31.5], labels: ["k₂"], explanation: "The extra radius 2 adds 2π × 2 × ∫ (3x − x²) dx = 2π × 2 × 9/2 = 18π, so k₂ = 27/2 + 18 = 63/2." }
  ]
 },
 {
  id: "q13", title: "Measuring the guide rail", topic: "Arc length of a curve", tier: "Intermediate", sector: "Cargo Crane",
  brief: "A curved guide rail has to be cut from straight stock, so the crew needs its true length, not the distance between its ends.",
  lesson: "The arc length of y = f(x) from a to b is the integral of √(1 + (f′(x))²): each tiny piece of curve is the long side of a right triangle.",
  prompt: "A crane’s guide rail follows the curve y = 2x^(3/2) from x = 0 to x = 3, in metres. To order the rail, the crew needs the arc length of that piece of curve. Change the variable with u = 1 + (dy/dx)². Enter the upper limit in u, then the length of the rail in metres to 2 decimal places.",
  answer: [28,10.9], labels: ["upper limit in u","length (m)"], tolerance: 0.005,
  hints: [
   "By the power rule the derivative of x^(3/2) is (3/2)x^(1/2), which is 1.5√x. Square dy/dx before you add 1.",
   "The arc length is ∫ from 0 to 3 of √(1 + (dy/dx)²) dx. When you change to u, change the limits too: x = 0 gives u = 1."
  ],
  solution: "dy/dx = 3√x, so (dy/dx)² = 9x and the length is L = ∫ from 0 to 3 of √(1 + 9x) dx. Put u = 1 + 9x, so du = 9 dx; x = 0 gives u = 1 and x = 3 gives u = 28. Then L = (1 ÷ 9) ∫ from 1 to 28 of √u du = (1 ÷ 9) × (2/3)(28^(3/2) − 1) = (2 ÷ 27) × (148.1621 − 1), which is about 10.90. The rail is 10.90 m long.",
  xp: 150, prereqs: ["q04"],
  artifact: {"name":"Rail tape","description":"A flexible tape that follows a curve and reads its length."},
  sources: [source.s2_4],
  teaching: {
   intuition: "A curve is longer than the straight line between its ends, but a very short piece of it is almost straight. Zoom in on a tiny piece: it goes across by dx and up by dy, so by Pythagoras its length is √(dx² + dy²). Taking dx out of the root, that is √(1 + (dy/dx)²) dx. Adding up all the tiny pieces with an integral gives the arc length, the length measured along the curve: L = ∫ from a to b of √(1 + (f′(x))²) dx. The root makes most of these integrals hard, so we use curves where 1 + (f′(x))² is simple. For y = x^(3/2), which means x times √x, the power rule still works with the power 3/2: the derivative is (3/2)x^(1/2), that is 1.5√x. Squaring it gives 2.25x, so the root becomes √(1 + 2.25x), which a substitution u = 1 + 2.25x turns into √u. Remember to change the limits along with the variable.",
   steps: [
    "Differentiate the curve to get dy/dx, and square it.",
    "Write the arc length L = ∫ from a to b of √(1 + (dy/dx)²) dx.",
    "Substitute u = 1 + (dy/dx)², find du, and change both limits from x to u.",
    "Integrate √u to (2/3)u^(3/2), put in the limits, and round only at the end."
   ],
   example: {
    prompt: "Find the length of the curve y = (2/3)x^(3/2) from x = 0 to x = 3.",
    steps: [
     "dy/dx = (2/3) × (3/2)x^(1/2) = √x, so 1 + (dy/dx)² = 1 + x.",
     "L = ∫ from 0 to 3 of √(1 + x) dx. With u = 1 + x, du = dx and the limits become u = 1 and u = 4.",
     "L = (2/3)(4^(3/2) − 1) = (2/3)(8 − 1) = 14/3."
    ],
    answer: "14/3, about 4.67 units."
   },
   pitfalls: [
    "Integrating √(1 + dy/dx) without squaring the derivative, or forgetting the 1 under the root.",
    "Changing to u but keeping the x limits: x = 4 is not u = 4.",
    "Forgetting to divide by the number in front of x when du = 9 dx: dx is du ÷ 9."
   ]
  },
  guidance: [
   { prompt: "What is the slope dy/dx of the rail at x = 1?", answer: [3], labels: ["slope at x = 1"], explanation: "dy/dx = 2 × (3/2)√x = 3√x, and √1 = 1, so the slope at x = 1 is 3." },
   { prompt: "With u = 1 + 9x, what do the limits x = 0 and x = 3 become?", answer: [1,28], labels: ["lower limit in u","upper limit in u"], explanation: "x = 0 gives u = 1 + 0 = 1, and x = 3 gives u = 1 + 9 × 3 = 28." },
   { prompt: "L = (2 ÷ 27) × (28^(3/2) − 1). What is the length, to 2 decimal places?", answer: [10.9], labels: ["length (m)"], explanation: "28^(3/2) = 28 × √28, about 148.1621. Then (2 ÷ 27) × 147.1621 is about 10.90 m." }
  ]
 },
 {
  id: "q14", title: "Stretching the shock spring", topic: "Work done by a varying force; springs", tier: "Intermediate", sector: "Cargo Crane",
  brief: "The crane’s hook hangs on a shock spring, and the energy budget needs to know how much effort it takes to stretch it during a lift.",
  lesson: "Work is force times distance when the force is steady; when it varies, the work is the integral of the force. A spring obeys Hooke’s law, F(x) = kx.",
  prompt: "A crane’s shock spring needs a force of 36 N to hold it 0.2 m beyond its natural length. By Hooke’s law, the force that holds it x metres beyond its natural length is F(x) = kx newtons. Enter the spring constant k in newtons per metre, then the work in joules needed to stretch the spring from x = 0.1 to x = 0.4.",
  answer: [180,13.5], labels: ["k (N/m)","work (J)"], tolerance: 0.005,
  hints: [
   "Hooke’s law at the reading says 36 = k × 0.2; divide to find k.",
   "The force grows as the spring stretches, so the work is the integral of F(x) = kx between the two stretches, not one force times the distance."
  ],
  solution: "From 36 = k × 0.2, k = 36 ÷ 0.2 = 180 N/m. The work is W = ∫ from 0.1 to 0.4 of 180x dx = 180 × (0.4² − 0.1²) ÷ 2 = 90 × (0.16 − 0.01) = 13.5 J.",
  xp: 150, prereqs: ["q01"],
  artifact: {"name":"Spring balance","description":"A calibrated spring with its constant stamped on the hook."},
  sources: [source.s2_5],
  teaching: {
   intuition: "When you push or pull something along, physicists say you do work on it. For a steady force the work is the force times the distance moved. Force is measured in newtons (N): one newton is about the pull of gravity on a small apple. Work is measured in joules (J): one joule is the work of a 1 N force acting over 1 m. A spring is harder to stretch the further it is stretched, so its force is not steady. The cure is the integral: over a very short stretch dx the force hardly changes, so the work there is about F(x) dx, and adding these pieces gives W = ∫ from a to b of F(x) dx. For a spring, Hooke’s law says the force needed to hold it x metres beyond its natural length is F(x) = kx. The number k is the spring constant, in newtons per metre: a stiff spring has a big k. One reading of a force and a stretch gives k, and then the work from stretch a to stretch b is ∫ kx dx = k(b² − a²) ÷ 2.",
   steps: [
    "Find the spring constant from one reading: k = force ÷ stretch, with the stretch in metres.",
    "Write the force as F(x) = kx, where x is the stretch beyond the natural length.",
    "The work from x = a to x = b is W = ∫ from a to b of kx dx.",
    "An antiderivative of kx is kx² ÷ 2, so W = k(b² − a²) ÷ 2 joules."
   ],
   example: {
    prompt: "A force of 20 N holds a spring 0.1 m beyond its natural length. How much work stretches it from its natural length to 0.3 m beyond it?",
    steps: [
     "k = 20 ÷ 0.1 = 200 N/m, so F(x) = 200x.",
     "W = ∫ from 0 to 0.3 of 200x dx = 100 × 0.3² − 0 = 100 × 0.09 = 9."
    ],
    answer: "9 J."
   },
   pitfalls: [
    "Multiplying the force at the end by the distance: the force is smaller at the start, so this counts too much.",
    "Measuring x from the spring’s whole length instead of from its natural length: x is the stretch only.",
    "Mixing centimetres and metres: keep every length in metres so that the work comes out in joules."
   ]
  },
  guidance: [
   { prompt: "36 N holds the spring 0.2 m out. What is k, the force for each metre of stretch?", answer: [180], labels: ["k (N/m)"], explanation: "k = 36 ÷ 0.2 = 180 newtons per metre." },
   { prompt: "What force holds the spring at x = 0.4, the end of the stretch?", answer: [72], labels: ["force (N)"], explanation: "F(0.4) = 180 × 0.4 = 72 N. The force at the start is smaller, which is why one force times the distance would be wrong." },
   { prompt: "What is the work, ∫ from 0.1 to 0.4 of 180x dx, in joules?", answer: [13.5], labels: ["work (J)"], explanation: "An antiderivative of 180x is 90x², so W = 90 × (0.16 − 0.01) = 13.5 J." }
  ]
 },
 {
  id: "q15", title: "Emptying the ballast tank", topic: "Pumping water out of a tank", tier: "Intermediate", sector: "Cargo Crane",
  brief: "The crane’s ballast tank must be pumped dry before a heavy lift, and the power crew wants to know how much energy the pump will use.",
  lesson: "To pump a tank empty, slice the water into thin layers: each layer’s weight times the height it must rise is its work, and the integral adds the layers.",
  prompt: "A water tank at the foot of the crane is an upright cylinder of radius 2 m and height 3 m, filled with water to a depth of 3 m. A pump lifts all of the water out through a pipe whose outlet is 1 m above the top of the tank. Water has density 1000 kg/m³, and g = 9.8 m/s². Measure y in metres up from the bottom of the tank. Enter how far a thin slice of water at the bottom, y = 0, must be lifted in metres, then the work needed to pump the tank empty in kilojoules to 1 decimal place (type it without commas).",
  answer: [4,923.6], labels: ["lift from the bottom (m)","work (kJ)"], tolerance: 0.05,
  hints: [
   "A thin slice of water at height y has volume (area of the cross-section) × dy. Its mass is the density times that volume, and its weight is 9.8 times the mass.",
   "Each slice rises from its own height to the outlet: the tank height plus the outlet height, minus y. Integrate the weight of a slice times that distance from y = 0 to the depth of the water."
  ],
  solution: "The cross-section is a circle of area π × 2² = 4π m², so a slice of thickness dy weighs 1000 × 9.8 × 4π dy = 39200π dy newtons. The outlet is 3 + 1 = 4 m above the bottom, so a slice at height y rises 4 − y metres. The work is W = 39200π ∫ from 0 to 3 of (4 − y) dy = 39200π × (12 − 4.5) = 39200π × 7.5, which is about 923628 J, or 923.6 kJ.",
  xp: 150, prereqs: ["q14","q09"],
  artifact: {"name":"Pump log","description":"A column of layers, each with its weight and the height it climbed."},
  sources: [source.s2_5],
  teaching: {
   intuition: "Pumping water out of a tank takes work, but not every drop goes the same distance: water near the outlet rises a little, water at the bottom rises a long way. So we cut the water into thin flat layers, each of thickness dy. A layer is almost a thin slab, so its volume is the area of the tank’s cross-section times dy. Density tells us how much mass each cubic metre holds: water has density 1000 kg/m³, written ρ = 1000 (ρ is the Greek letter rho). The mass of the layer is ρ times its volume, and its weight, the force gravity pulls it down with, is the mass times g = 9.8 m/s², in newtons. The work for one layer is its weight times the height it must rise to the outlet. Adding all the layers from the bottom of the water to its surface with an integral gives the total work. A kilojoule (kJ) is 1000 joules.",
   steps: [
    "Put y = 0 at the bottom of the tank, with y measured upwards in metres.",
    "Find the area of the cross-section at height y; a layer weighs 1000 × 9.8 × area × dy newtons.",
    "Find how far the layer at height y rises: the height of the outlet above the bottom, minus y.",
    "Integrate weight × distance from y = 0 to the water’s surface, then divide by 1000 for kilojoules."
   ],
   example: {
    prompt: "A box tank 2 m long and 1 m wide holds water 1 m deep, right up to its top edge, and it is pumped out over that edge. How much work does it take?",
    steps: [
     "The cross-section is 2 m², so a layer weighs 1000 × 9.8 × 2 dy = 19600 dy newtons.",
     "The layer at height y rises 1 − y metres.",
     "W = 19600 ∫ from 0 to 1 of (1 − y) dy = 19600 × 1/2 = 9800 J."
    ],
    answer: "9800 J, which is 9.8 kJ."
   },
   pitfalls: [
    "Using the same lift for every layer: the top water rises only a little, the bottom water the whole way.",
    "Multiplying the mass by the distance: multiply kilograms by 9.8 first to get the weight in newtons.",
    "Measuring the lift to the top of the tank when the outlet is higher: every layer must reach the outlet."
   ]
  },
  guidance: [
   { prompt: "How far must a slice at the very bottom, y = 0, be lifted to reach the outlet? And a slice at the surface of the water, y = 3?", answer: [4,1], labels: ["lift from the bottom (m)","lift from the surface (m)"], explanation: "The outlet is 3 + 1 = 4 m above the bottom. A slice at y = 0 rises 4 m; a slice at y = 3 rises 4 − 3 = 1 m." },
   { prompt: "Work out ∫ from 0 to 3 of (4 − y) dy.", answer: [7.5], labels: ["integral of the lift (m²)"], explanation: "An antiderivative is 4y − y² ÷ 2, so the integral is 12 − 4.5 = 7.5." },
   { prompt: "A slice weighs 39200π newtons for each metre of thickness. What is the work in kilojoules, to 1 decimal place?", answer: [923.6], labels: ["work (kJ)"], explanation: "39200π × 7.5 is about 923628 J. Dividing by 1000 gives 923.6 kJ." }
  ]
 },
 {
  id: "q16", title: "Balancing the crane arm", topic: "Mass, moments and centre of mass", tier: "Intermediate", sector: "Cargo Crane",
  brief: "A new crane arm is heavier at one end, and the riggers need to know where to hang the counterweight cable so it balances.",
  lesson: "For a rod of density ρ(x), the mass is ∫ ρ(x) dx, the moment is ∫ x ρ(x) dx, and the centre of mass x̄ is the moment divided by the mass.",
  prompt: "A crane’s steel arm is a rod 3 m long, thicker towards its far end. Its density, its mass per metre of length, is ρ(x) = 2 + 4x kg/m at x metres from the pivot. Enter the mass of the arm in kilograms, then the distance x̄ of its centre of mass from the pivot in metres.",
  answer: [24,1.875], labels: ["mass (kg)","x̄ (m)"], tolerance: 0.0005,
  hints: [
   "The mass is the integral of the density along the rod, from the pivot to the far end.",
   "The moment about the pivot is the integral of x × ρ(x). The centre of mass is the moment divided by the mass."
  ],
  solution: "m = ∫ from 0 to 3 of (2 + 4x) dx = 2 × 3 + 4 × 9 ÷ 2 = 24 kg. The moment about the pivot is M = ∫ from 0 to 3 of (2x + 4x²) dx = 2 × 9 ÷ 2 + 4 × 27 ÷ 3 = 45 kg·m. So x̄ = M ÷ m = 45 ÷ 24 = 1.875 m from the pivot.",
  xp: 150, prereqs: ["q07"],
  artifact: {"name":"Balance mark","description":"A notch filed into the arm at the point where it balances."},
  sources: [source.s2_6],
  teaching: {
   intuition: "Every object has a balance point, its centre of mass: hang it there and it does not tip. For a few weights on a light bar, each weight’s tipping effect about the end is its mass times its distance, which is called its moment. The centre of mass is the total moment divided by the total mass, so heavy weights pull it their way. A rod whose thickness changes has a density that changes along it: here density means mass per metre of length, written ρ(x) kg/m (ρ is rho). Cut the rod into tiny pieces of length dx. A piece at x has mass ρ(x) dx and moment x ρ(x) dx. Integrals add them up: the mass is m = ∫ ρ(x) dx, the moment is M = ∫ x ρ(x) dx, and the centre of mass is x̄ = M ÷ m (x̄ is read “x bar”). A rod with the same density all along balances at its middle. For a flat plate of even thickness the centre of mass is its centroid, its geometric centre, with two coordinates x̄ and ȳ found the same way.",
   steps: [
    "Write the density ρ(x) along the rod, with x measured from one end.",
    "Find the mass: m = ∫ ρ(x) dx over the length of the rod.",
    "Find the moment about that end: M = ∫ x ρ(x) dx over the same interval.",
    "Divide: the centre of mass is x̄ = M ÷ m, measured from the same end."
   ],
   example: {
    prompt: "A rod 6 m long has density ρ(x) = 2x kg/m at x metres from one end. Find its mass and its centre of mass.",
    steps: [
     "m = ∫ from 0 to 6 of 2x dx = 36 kg.",
     "M = ∫ from 0 to 6 of 2x² dx = 2 × 216 ÷ 3 = 144 kg·m.",
     "x̄ = 144 ÷ 36 = 4."
    ],
    answer: "Mass 36 kg; centre of mass 4 m from the light end."
   },
   pitfalls: [
    "Dividing the moment by the length of the rod instead of by its mass.",
    "Taking the middle of the rod: that is the centre of mass only when the density is the same all along.",
    "Forgetting the extra x in the moment: it is ∫ x ρ(x) dx, not ∫ ρ(x) dx."
   ]
  },
  guidance: [
   { prompt: "What is the mass of the arm, ∫ from 0 to 3 of (2 + 4x) dx?", answer: [24], labels: ["mass (kg)"], explanation: "An antiderivative is 2x + 2x², so m = 6 + 18 = 24 kg." },
   { prompt: "What is the moment about the pivot, ∫ from 0 to 3 of x(2 + 4x) dx?", answer: [45], labels: ["moment (kg·m)"], explanation: "x(2 + 4x) = 2x + 4x², so M = 2 × 9 ÷ 2 + 4 × 27 ÷ 3 = 45 kg·m." },
   { prompt: "Divide the moment by the mass. How far from the pivot is the centre of mass?", answer: [1.875], labels: ["x̄ (m)"], explanation: "x̄ = 45 ÷ 24 = 1.875 m. It lies beyond the middle of the rod, at 1.5 m, because the far end is heavier." }
  ]
 },
 {
  id: "q17", title: "Winding the drum", topic: "Review: shells, work and balance", tier: "Intermediate", sector: "Cargo Crane",
  brief: "The gantry crane gets its new drum today, and the crew needs its volume for the casting and the work to reel in its cable.",
  lesson: "Shells give volumes about a vertical axis, and work is an integral of force times distance whenever different pieces move different distances.",
  prompt: "The gantry crane’s cable drum is the solid made by spinning the region between the parabola y = x² and the line y = 9, for x from 0 to 3, about the y-axis, with lengths in decimetres; its volume is kπ dm³. A steel cable 20 m long, with a mass of 4 kg per metre, hangs straight down from the drum. Enter k, then the work in joules needed to wind the whole cable up onto the drum (g = 9.8 m/s²; type it without commas).",
  answer: [40.5,7840], labels: ["k","work (J)"], tolerance: 0.01,
  hints: [
   "Use cylindrical shells about the y-axis: the shell through x has radius x, and its height is the line minus the parabola.",
   "Cut the cable into short pieces. A piece y metres below the drum weighs 9.8 × (mass per metre) × dy newtons and must be lifted y metres."
  ],
  solution: "The shell through x has radius x and height 9 − x², so V = 2π ∫ from 0 to 3 of (9x − x³) dx = 2π(81 ÷ 2 − 81 ÷ 4) = 40.5π, and k = 40.5. Each metre of cable weighs 9.8 × 4 = 39.2 N, and the piece y metres down rises y metres, so W = ∫ from 0 to 20 of 39.2y dy = 39.2 × 400 ÷ 2 = 7840 J.",
  xp: 150, prereqs: ["q12","q15"],
  artifact: {"name":"Gantry drum","description":"A cast drum with a reel of steel cable wound on it."},
  sources: [source.s2_3, source.s2_5],
  teaching: {
   intuition: "This mission brings the chapter together. A volume about a vertical axis comes from cylindrical shells: V = 2π ∫ radius × height dx, where each upright strip of the region sweeps out a thin tube. Work comes from slicing too. When different pieces of something move different distances, as the layers of water did in the tank, find the work for one thin piece, its weight times the distance it moves, and add the pieces with an integral. A hanging cable is the same idea. Cut it into short pieces: the piece y metres below the drum weighs (mass per metre) × 9.8 × dy newtons and must be lifted y metres to reach the drum. So winding up a cable of length L takes W = ∫ from 0 to L of 9.8 × (mass per metre) × y dy, which is half its weight times its length.",
   steps: [
    "For the drum, take the shell through x: its radius is x and its height is the upper curve minus the lower curve.",
    "Integrate 2π × radius × height across the region; the volume is kπ.",
    "For the cable, put y = 0 at the drum and measure y downwards; a piece of length dy weighs 9.8 × (mass per metre) × dy newtons and rises y metres.",
    "Integrate from y = 0 to the length of the cable to get the work in joules."
   ],
   example: {
    prompt: "A chain 10 m long with a mass of 2 kg per metre hangs from a winch. How much work does it take to wind it all up?",
    steps: [
     "Each metre weighs 9.8 × 2 = 19.6 N, and the piece y metres down rises y metres.",
     "W = ∫ from 0 to 10 of 19.6y dy = 19.6 × 100 ÷ 2 = 980."
    ],
    answer: "980 J."
   },
   pitfalls: [
    "Lifting the whole cable its full length: the bottom piece rises the whole way and the top piece hardly at all, so the work is only half the weight times the length.",
    "Using the mass per metre instead of the weight per metre: multiply by 9.8 first.",
    "Taking the parabola alone as the shell’s height: the height is the upper line minus the parabola."
   ]
  },
  guidance: [
   { prompt: "What is the height of the shell through x = 1, in decimetres?", answer: [8], labels: ["shell height (dm)"], explanation: "The line is at 9 and the parabola at 1² = 1, so the height is 9 − 1 = 8 dm." },
   { prompt: "V = 2π ∫ from 0 to 3 of x(9 − x²) dx. What is k, where V = kπ?", answer: [40.5], labels: ["k"], explanation: "2π(81 ÷ 2 − 81 ÷ 4) = 2π × 20.25 = 40.5π." },
   { prompt: "What does one metre of cable weigh, in newtons, and what is the work to wind it all up, in joules?", answer: [39.2,7840], labels: ["weight per metre (N)","work (J)"], explanation: "9.8 × 4 = 39.2 N per metre. The work is ∫ from 0 to 20 of 39.2y dy = 39.2 × 400 ÷ 2 = 7840 J." }
  ]
 },
 {
  id: "q18", title: "The coolant loop integral", topic: "Integration by parts", tier: "Intermediate", sector: "Computing Core",
  brief: "The computing core’s cooling model needs an integral of a product, and no substitution will crack it.",
  lesson: "Integration by parts turns ∫ u dv into [uv] − ∫ v du: choose u to get simpler when differentiated and dv easy to integrate.",
  prompt: "The computing core’s cooling model gives the heat carried off by one coolant loop as ∫ from 0 to 2 of 3x eˣ dx kilojoules. Use integration by parts with u = 3x and dv = eˣ dx. Enter the boundary term [uv] over the interval, then the value of the integral, both to 3 decimal places.",
  answer: [44.334,25.167], labels: ["boundary term [uv]","value of the integral"], tolerance: 0.0005,
  hints: [
   "Integration by parts says ∫ u dv = [uv] − ∫ v du. Differentiate u to get du, and integrate dv to get v.",
   "Here du = 3 dx and v = eˣ. Work out uv at the top limit minus uv at the bottom limit, then the new integral ∫ v du over the same interval."
  ],
  solution: "With u = 3x, du = 3 dx; with dv = eˣ dx, v = eˣ. The boundary term is [3x eˣ] from 0 to 2, which is 3 × 2 × e² − 0, about 44.334. The remaining integral is ∫ from 0 to 2 of 3eˣ dx = 3(e² − 1), about 19.167. So the integral is 44.334 − 19.167, which is 25.167 to 3 decimal places.",
  xp: 150, prereqs: ["q04"],
  artifact: {"name":"Parts ledger","description":"Two columns, one differentiated and one integrated, that trade places."},
  sources: [source.s3_1],
  teaching: {
   intuition: "Substitution undoes the chain rule. Integration by parts undoes the product rule. The product rule says (uv)′ = u′v + uv′. Integrating both sides and rearranging gives ∫ u dv = uv − ∫ v du, where du is u′ dx and dv is v′ dx. The idea is to trade one integral for another that is easier. Split the integrand into two parts: u, which you will differentiate, and dv, which you will integrate. Choose u so that it gets simpler when differentiated: x becomes 1, and ln x becomes 1 ÷ x. Choose dv so that you can integrate it: eˣ dx, sin x dx, cos x dx, or just dx. For a definite integral the formula reads ∫ from a to b of u dv = [uv] from a to b − ∫ from a to b of v du, where [uv] from a to b, the boundary term, means uv at b minus uv at a. Angles are in radians.",
   steps: [
    "Choose u (to differentiate) and dv (to integrate), so that v du is simpler than u dv.",
    "Find du by differentiating u, and v by integrating dv; no constant is needed for v.",
    "Work out the boundary term [uv]: uv at the top limit minus uv at the bottom limit.",
    "Work out ∫ v du over the same interval, and subtract it from the boundary term."
   ],
   example: {
    prompt: "Find ∫ from 0 to 1 of x eˣ dx.",
    steps: [
     "Take u = x and dv = eˣ dx, so du = dx and v = eˣ.",
     "The boundary term is [x eˣ] from 0 to 1 = 1 × e − 0 = e.",
     "∫ from 0 to 1 of eˣ dx = e − 1, so the integral is e − (e − 1) = 1."
    ],
    answer: "Exactly 1."
   },
   pitfalls: [
    "Choosing u = eˣ and dv = x dx: the new integral then holds x², which is harder than the one you started with.",
    "Dropping the minus sign in front of ∫ v du, or working out uv at only one of the two limits.",
    "Using degrees for sin and cos: here the angles are in radians, so π stands for half a turn."
   ]
  },
  guidance: [
   { prompt: "With u = 3x and v = eˣ, what is the boundary term [uv] from 0 to 2, to 3 decimal places?", answer: [44.334], labels: ["boundary term [uv]"], explanation: "The boundary term is [3x eˣ] from 0 to 2, which is 3 × 2 × e² − 0, about 44.334." },
   { prompt: "What is ∫ v du over the same interval, where du = 3 dx?", answer: [19.167], labels: ["∫ v du"], explanation: "The remaining integral is ∫ from 0 to 2 of 3eˣ dx = 3(e² − 1), about 19.167." },
   { prompt: "Subtract: what is ∫ from 0 to 2 of 3x eˣ dx, to 3 decimal places?", answer: [25.167], labels: ["value of the integral"], explanation: "[uv] − ∫ v du = 44.334 − 19.167, which is 25.167. Round only at the end." }
  ]
 },
 {
  id: "q19", title: "Tuning the cooling fan", topic: "Powers of sine and cosine", tier: "Intermediate", sector: "Computing Core",
  brief: "A cooling fan’s tuning formula is a power of sine times a power of cosine, and the core wants its exact value, not an estimate.",
  lesson: "With an odd power of sine, split off one sin x and use sin²x = 1 − cos²x, so u = cos x finishes the job; even powers need a power-reducing identity.",
  prompt: "A cooling fan in the computing core is tuned with the integral ∫ from 0 to π/2 of sin³x cos²x dx, with x in radians. Its value is an exact fraction. Use the substitution u = cos x. Enter the value as a fraction in lowest terms: the numerator, then the denominator (type them without commas).",
  answer: [2,15], labels: ["numerator","denominator"], tolerance: 0.01,
  hints: [
   "The power of sine is odd, so split off one sin x and write the rest with sin²x = 1 − cos²x: sin³x = (1 − cos²x) sin x.",
   "With u = cos x, du = −sin x dx. x = 0 gives u = 1 and x = π/2 gives u = 0; the minus sign in du lets you swap the limits so the integral runs from 0 to 1."
  ],
  solution: "sin³x = (1 − cos²x) sin x. Put u = cos x, so du = −sin x dx; x = 0 gives u = 1 and x = π/2 gives u = 0. The minus sign swaps the limits, so the integral is ∫ from 0 to 1 of u² × (1 − u²) du = ∫ from 0 to 1 of (u² − u⁴) du = 1/3 − 1/5 = 2/15.",
  xp: 150, prereqs: ["q04"],
  artifact: {"name":"Fan blade","description":"A blade whose curve is a power of the sine."},
  sources: [source.s3_2],
  teaching: {
   intuition: "Powers of sine and cosine, such as sin³x cos²x, look hard to integrate, but one identity unlocks them: sin²x + cos²x = 1. When the power of sine is odd, split off one sin x and turn the rest into cosines with sin²x = 1 − cos²x. For example sin³x = (1 − cos²x) sin x. Now everything is a function of cos x times sin x, and the substitution u = cos x, du = −sin x dx, turns it into a plain polynomial in u. The minus sign in du can be used to swap the limits. When the power of cosine is odd instead, split off one cos x and use u = sin x. When both powers are even, use a power-reducing identity, which trades a square for a double angle: sin²x = (1 − cos 2x) ÷ 2 and cos²x = (1 + cos 2x) ÷ 2. Angles are in radians, and limits such as π/2 and π make the answers exact.",
   steps: [
    "Look for an odd power. If sine’s power is odd, split off one sin x; write the remaining even power with sin²x = 1 − cos²x.",
    "Substitute u = cos x, so du = −sin x dx, and change the limits: cos 0 = 1, cos(π/2) = 0, cos π = −1.",
    "Use the minus sign to swap the limits, multiply out the polynomial in u and integrate it term by term.",
    "With only even powers, use the power-reducing identities and integrate the cos 2x terms, which give sin 2x ÷ 2."
   ],
   example: {
    prompt: "Find ∫ from 0 to π of sin³x dx.",
    steps: [
     "sin³x = (1 − cos²x) sin x. Put u = cos x, so du = −sin x dx; x = 0 gives u = 1 and x = π gives u = −1.",
     "Swapping the limits for the minus sign: ∫ from −1 to 1 of (1 − u²) du = (1 − 1/3) − (−1 + 1/3) = 4/3."
    ],
    answer: "4/3."
   },
   pitfalls: [
    "Forgetting the minus sign in du = −sin x dx, which gives the right number with the wrong sign.",
    "Keeping the x limits after the substitution: π/2 is not a value of u = cos x.",
    "Writing sin²x = 1 + cos²x: the identity is sin²x + cos²x = 1, so sin²x = 1 − cos²x."
   ]
  },
  guidance: [
   { prompt: "With u = cos x, what are u at x = 0 and u at x = π/2?", answer: [1,0], labels: ["u at x = 0","u at the upper limit"], explanation: "cos 0 = 1 and cos(π/2) = 0." },
   { prompt: "After the substitution the integrand is u² × (1 − u²). Multiplied out, what is the highest power of u?", answer: [4], labels: ["highest power of u"], explanation: "Multiplied out it is u² − u⁴, so the highest power is 4." },
   { prompt: "Integrate term by term from 0 to 1. What is the value, as a fraction in lowest terms?", answer: [2,15], labels: ["numerator","denominator"], explanation: "∫ from 0 to 1 of (u² − u⁴) du = 1/3 − 1/5 = 2/15." }
  ]
 },
 {
  id: "q20", title: "Cutting the hatch plate", topic: "Trigonometric substitution", tier: "Intermediate", sector: "Computing Core",
  brief: "An access hatch to the core is a circular plate, and one piece of it must be cut away for a cable run; the stores need its area.",
  lesson: "A trigonometric substitution x = r sin θ turns √(r² − x²) into r cos θ, so the root disappears and a power of cosine is left.",
  prompt: "A circular hatch plate of radius 4 dm is centred on the origin. The piece needed is the part of its top half between x = 0 and x = 2: the region under y = √(16 − x²). Use the substitution x = 4 sin θ, with θ in radians between −π/2 and π/2, where cos θ is never negative. Enter the angle θ that goes with x = 2, to 4 decimal places, then the area of the piece in dm², to 2 decimal places.",
  answer: [0.5236,7.65], labels: ["θ (radians)","area (dm²)"], tolerance: 0.00005,
  hints: [
   "With x = 4 sin θ, the root √(16 − x²) becomes 4 cos θ, because 1 − sin²θ = cos²θ, and dx becomes 4 cos θ dθ.",
   "The integral of cos²θ needs the power-reducing identity cos²θ = (1 + cos 2θ) ÷ 2. Change the limits from x to θ before you put numbers in."
  ],
  solution: "Put x = 4 sin θ, so dx = 4 cos θ dθ and √(16 − x²) = 4 cos θ. x = 0 gives θ = 0, and x = 2 gives sin θ = 2 ÷ 4, so θ = arcsin(2 ÷ 4), about 0.5236. The area is ∫ from 0 to θ of 16 cos²θ dθ = 8 ∫ (1 + cos 2θ) dθ = 8(θ + sin θ cos θ), using sin 2θ = 2 sin θ cos θ. At the upper limit sin θ = 2 ÷ 4 and cos θ = √(16 − 4) ÷ 4, about 0.8660, so the area is about 8 × (0.5236 + 0.5 × 0.8660), which is 7.65 dm² to 2 decimal places.",
  xp: 150, prereqs: ["q19"],
  artifact: {"name":"Hatch template","description":"A semicircle with one slice marked off by a sine."},
  sources: [source.s3_3],
  teaching: {
   intuition: "The top half of a circle of radius r, centred on the origin, is the curve y = √(r² − x²). Areas under it lead to the integral of a square root, which no rule so far can do. A trigonometric substitution removes the root by borrowing an identity. Put x = r sin θ. Then r² − x² = r² − r² sin²θ = r² cos²θ, because 1 − sin²θ = cos²θ. Keep θ between −π/2 and π/2: there cos θ is never negative, so the root of r² cos²θ is r cos θ itself, not −r cos θ. Also dx = r cos θ dθ. The integral turns into r² ∫ cos²θ dθ, which the power-reducing identity cos²θ = (1 + cos 2θ) ÷ 2 handles, giving (r²/2)(θ + sin θ cos θ). The limits change too: x = 0 is θ = 0, and x = a is the angle whose sine is a ÷ r, written θ = arcsin(a ÷ r): arcsin, the inverse sine, gives the angle between −π/2 and π/2 that has a given sine, in radians. For a root of the form √(r² + x²) the same idea works with x = r tan θ.",
   steps: [
    "Match the root to an identity: √(r² − x²) calls for x = r sin θ.",
    "Replace x, the root and dx: √(r² − x²) = r cos θ and dx = r cos θ dθ.",
    "Change the limits to θ with θ = arcsin(x ÷ r), in radians, which lies between −π/2 and π/2.",
    "Integrate r² cos²θ with the power-reducing identity to (r²/2)(θ + sin θ cos θ), and put in the θ limits."
   ],
   example: {
    prompt: "Find the area under y = √(9 − x²) from x = 0 to x = 3, a quarter of a circle of radius 3.",
    steps: [
     "Put x = 3 sin θ; x = 0 gives θ = 0 and x = 3 gives θ = π/2.",
     "The area is ∫ from 0 to π/2 of 9 cos²θ dθ = (9/2)(θ + sin θ cos θ) from 0 to π/2 = (9/2)(π/2 + 0) = 9π/4."
    ],
    answer: "9π/4, about 7.069, which is a quarter of π × 3²."
   },
   pitfalls: [
    "Keeping the x limits after changing to θ: x = 3 is not θ = 3.",
    "Leaving out the r cos θ that comes from dx, so the integrand is r² cos²θ, not r cos θ.",
    "Working in degrees: arcsin must give the angle in radians for the formula to be right."
   ]
  },
  guidance: [
   { prompt: "x = 4 sin θ. Which θ, in radians, gives x = 2? Give it to 4 decimal places.", answer: [0.5236], labels: ["θ (radians)"], explanation: "sin θ = 2 ÷ 4, so θ = arcsin(2 ÷ 4), about 0.5236 radians." },
   { prompt: "At that θ, what is cos θ = √(16 − 4) ÷ 4, to 4 decimal places?", answer: [0.866], labels: ["cos θ"], explanation: "√12 ÷ 4 is about 0.8660. It is the height of the plate at x = 2, divided by the radius." },
   { prompt: "The area is 8(θ + sin θ cos θ) at that θ. What is it, to 2 decimal places?", answer: [7.65], labels: ["area (dm²)"], explanation: "8 × (0.5236 + 0.5 × 0.8660) is about 7.65 dm². At θ = 0 the bracket is 0, so nothing is subtracted." }
  ]
 }
);
})();
