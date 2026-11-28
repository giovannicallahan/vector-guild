/* Mechanics: motion and force missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/mech/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · The inclined plane: weight along and across a ramp [5.6]
     q22  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · Static and kinetic friction [6.2]
     q23  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · Chapter review: a free-body problem from start to finish [6.1, 6.2]
     q24  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Centripetal force: what holds a body on a circle [6.3]
     q25  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Drag and terminal speed [6.4]
     q26  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Work by a constant force and by a varying force (an integral) [7.1]
     q27  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Kinetic energy and the work-energy theorem [7.2, 7.3]
     q28  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Power: the rate of doing work, P = Fv [7.4]
     q29  ch 5 Work and power · Intermediate, 150 XP · sector 'Engine Hall' · Chapter review: work, energy and power on one machine [7.1, 7.3]
     q30  ch 6 Energy and momentum · Advanced, 200 XP · sector 'Docking Ring' · Potential energy: height and a stretched spring [8.1] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 3.4 Motion with Constant Acceleration
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s5_6: { title: "OpenStax University Physics Volume 1 — 5.6 Common Forces", url: "https://openstax.org/books/university-physics-volume-1/pages/5-6-common-forces", description: "Weight on an incline split into mg sin θ along the slope and mg cos θ into it, the normal force that balances the second, and tension in a cable.", verified: "2026-11-28" },
 s6_1: { title: "OpenStax University Physics Volume 1 — 6.1 Solving Problems with Newton’s Laws", url: "https://openstax.org/books/university-physics-volume-1/pages/6-1-solving-problems-with-newtons-laws", description: "A problem-solving strategy with free-body diagrams, and connected bodies such as two blocks joined by a string over a pulley.", verified: "2026-11-28" },
 s6_2: { title: "OpenStax University Physics Volume 1 — 6.2 Friction", url: "https://openstax.org/books/university-physics-volume-1/pages/6-2-friction", description: "Static friction up to μs N, kinetic friction μk N, a table of coefficients, and sliding down an incline with a = g(sin θ − μk cos θ).", verified: "2026-11-28" },
 s6_3: { title: "OpenStax University Physics Volume 1 — 6.3 Centripetal Force", url: "https://openstax.org/books/university-physics-volume-1/pages/6-3-centripetal-force", description: "Centripetal force F = mv² ÷ r, and a car on a flat curve held by static friction, where μs = v² ÷ (rg).", verified: "2026-11-28" },
 s6_4: { title: "OpenStax University Physics Volume 1 — 6.4 Drag Force and Terminal Speed", url: "https://openstax.org/books/university-physics-volume-1/pages/6-4-drag-force-and-terminal-speed", description: "Drag ½CρAv² that grows with the square of the speed, and terminal speed, where drag equals weight.", verified: "2026-11-28" },
 s7_1: { title: "OpenStax University Physics Volume 1 — 7.1 Work", url: "https://openstax.org/books/university-physics-volume-1/pages/7-1-work", description: "Work as the integral of F · dr, Fd cos θ for a constant force, the joule, negative work by kinetic friction and zero work by the normal force.", verified: "2026-11-28" },
 s7_2: { title: "OpenStax University Physics Volume 1 — 7.2 Kinetic Energy", url: "https://openstax.org/books/university-physics-volume-1/pages/7-2-kinetic-energy", description: "Kinetic energy K = ½mv², measured in joules.", verified: "2026-11-28" },
 s7_3: { title: "OpenStax University Physics Volume 1 — 7.3 Work-Energy Theorem", url: "https://openstax.org/books/university-physics-volume-1/pages/7-3-work-energy-theorem", description: "The net work done on a particle equals the change in its kinetic energy.", verified: "2026-11-28" },
 s7_4: { title: "OpenStax University Physics Volume 1 — 7.4 Power", url: "https://openstax.org/books/university-physics-volume-1/pages/7-4-power", description: "Average power as work over time, instantaneous power P = F · v, the watt (1 W = 1 J/s), and lifting examples.", verified: "2026-11-28" },
 s8_1: { title: "OpenStax University Physics Volume 1 — 8.1 Potential Energy of a System", url: "https://openstax.org/books/university-physics-volume-1/pages/8-1-potential-energy-of-a-system", description: "Gravitational potential energy mgy from a chosen zero, spring potential energy ½kx², and ΔU as minus the work of gravity or a spring.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "Sled on the loading ramp", topic: "The inclined plane: weight along and across a ramp", tier: "Intermediate", sector: "Crane Yard",
  brief: "The Crane Yard parks loaded sleds on a sloping ramp, and the riggers need to know how hard each sled pulls on its cable and presses on the deck.",
  lesson: "On a ramp at angle θ, the weight w splits into w sin θ down along the ramp and w cos θ pressing into it; the normal force balances the second part.",
  prompt: "A cargo sled of mass 80 kg sits on the loading ramp of the Crane Yard, which rises at 0.4 radians above the horizontal. A cable laid along the ramp holds it still. The only forces across the ramp are the sled’s weight and the normal force from the ramp. Take g = 9.8 m/s². Enter the part of the sled’s weight that points down along the ramp, then the normal force, both in newtons to 2 decimal places. Type the numbers without commas.",
  answer: [305.3, 722.11], labels: ["along the ramp (N)", "normal force (N)"], tolerance: 0.005,
  hints: [
   "Turn your axes to match the inclined plane: one axis points down along the ramp, the other straight out of its surface. The angle between the weight and the line straight into the ramp is the ramp’s own angle.",
   "The part of the weight along the ramp is w sin θ and the part pressing into the ramp is w cos θ. Nothing moves across the ramp, so the normal force is exactly as large as the part pressing in."
  ],
  solution: "The weight is w = mg = 80 × 9.8 = 784 N. With the ramp angle θ = 0.4 radians, sin θ ≈ 0.3894 and cos θ ≈ 0.9211. Along the ramp: w sin θ = 784 × sin 0.4 ≈ 305.3 N. Into the ramp: w cos θ = 784 × cos 0.4 ≈ 722.11 N. Nothing moves across the ramp, so the normal force balances that part: N ≈ 722.11 N.",
  xp: 150, prereqs: ["q20", "q03"],
  artifact: { name: "Ramp chart", description: "A tilted pair of axes with the weight split along and across the deck." },
  sources: [source.s5_6],
  teaching: {
   intuition: "A ramp, or inclined plane, is a flat surface tilted at an angle θ to the horizontal. Gravity still pulls a load straight down with its weight w = mg, but the ramp only cares about two directions: along its surface and straight out of it. So we turn our axes to match the ramp and split the weight into components along those two axes, just as we split any vector into x and y components. Geometry gives a neat fact: the angle between the weight and the line straight into the ramp is the ramp’s own angle θ. So the part of the weight along the ramp is w sin θ, and the part pressing into the ramp is w cos θ. The ramp pushes back on the load at right angles to its surface with the normal force. Nothing moves into or out of the deck, so the normal force exactly balances the part pressing in: N = w cos θ. A flat ramp (θ = 0) gives no pull along it and the full weight into it; a steeper ramp pulls harder along it and presses less into it.",
   steps: [
    "Find the weight, w = mg, with g = 9.8 m/s².",
    "Take one axis along the ramp and the other straight out of its surface. The weight makes the angle θ with the line straight into the ramp.",
    "The component of the weight along the ramp is w sin θ; the component pressing into the ramp is w cos θ. Angles are in radians, so set your calculator to radians.",
    "With no motion across the ramp, the normal force balances the component pressing in: N = w cos θ."
   ],
   example: {
    prompt: "A 50 kg crate rests on a ramp at 0.3 radians, held by a rope along the ramp. Find the part of its weight along the ramp and the normal force.",
    steps: ["w = 50 × 9.8 = 490 N.", "Along the ramp: 490 × sin 0.3 ≈ 490 × 0.2955 ≈ 144.80 N.", "Into the ramp: 490 × cos 0.3 ≈ 490 × 0.9553 ≈ 468.11 N, and the normal force balances it."],
    answer: "About 144.80 N along the ramp and a normal force of about 468.11 N."
   },
   pitfalls: [
    "Swapping sine and cosine. On a nearly flat ramp the pull along it should be small, so it is w sin θ, not w cos θ.",
    "Leaving the calculator in degrees. These angles are in radians; sin 0.4 in degrees is a tiny number.",
    "Taking the normal force as the whole weight mg. On a ramp it is only the part pressing into the surface, w cos θ."
   ]
  },
  guidance: [
   { prompt: "First the whole weight. What is w = mg for the 80 kg sled, in newtons?", answer: [784], labels: ["weight (N)"], explanation: "w = 80 × 9.8 = 784 N, pointing straight down." },
   { prompt: "The ramp rises at θ = 0.4 radians. The part of the weight along the ramp is w sin θ. What is it, in newtons to 2 decimal places?", answer: [305.3], labels: ["along the ramp (N)"], explanation: "sin 0.4 ≈ 0.3894, so w sin θ = 784 × sin 0.4 ≈ 305.3 N." },
   { prompt: "The part pressing into the ramp is w cos θ, and the normal force balances it. What is the normal force, in newtons to 2 decimal places?", answer: [722.11], labels: ["normal force (N)"], explanation: "cos 0.4 ≈ 0.9211, so N = w cos θ = 784 × cos 0.4 ≈ 722.11 N." }
  ]
 },
 {
  id: "q22", title: "Will the crate slip?", topic: "Static and kinetic friction", tier: "Intermediate", sector: "Crane Yard",
  brief: "Crates are set down on the steel ramps of the Crane Yard, and before anyone lets go the riggers want to know whether each one stays put or slides.",
  lesson: "Static friction grips with whatever force is needed up to μs N; once a body slides, kinetic friction acts with the fixed size μk N.",
  prompt: "A crate of mass 60 kg is set down at rest on a steel ramp in the Crane Yard that rises at 0.6 radians. Between the crate and the ramp the coefficient of static friction is μs = 0.6 and the coefficient of kinetic friction is μk = 0.45. Only gravity, the normal force and friction act on the crate. Take g = 9.8 m/s². Enter the size of the friction force on the crate in newtons, then the crate’s acceleration down the ramp in m/s² (enter 0 if it stays at rest), both to 2 decimal places. Type the numbers without commas.",
  answer: [218.38, 1.89], labels: ["friction force (N)", "acceleration (m/s²)"], tolerance: 0.005,
  hints: [
   "Find the normal force first, N = mg cos θ. Static friction can grip with any force up to μs N, and no more.",
   "Compare the pull of gravity along the ramp, mg sin θ, with μs N. If the pull is smaller, static friction matches it exactly and the crate stays put. If it is larger, the crate slides, kinetic friction μk N acts up the ramp, and a = (mg sin θ − μk N) ÷ m. Keep full precision until the end."
  ],
  solution: "N = mg cos θ = 588 × cos 0.6 ≈ 485.3 N. The greatest static friction is μs N ≈ 0.6 × 485.3 ≈ 291.18 N. The pull along the ramp is mg sin θ = 588 × sin 0.6 ≈ 332.01 N. That is more than 291.18 N, so the crate slides. Kinetic friction then acts up the ramp: μk N ≈ 0.45 × 485.3 ≈ 218.38 N. The net force down the ramp is ≈ 113.63 N, so a = net force ÷ m ≈ 113.63 ÷ 60 ≈ 1.89 m/s².",
  xp: 150, prereqs: ["q21"],
  artifact: { name: "Grip gauge", description: "A dial that reads how much of the greatest static friction a resting crate is using." },
  sources: [source.s6_2],
  teaching: {
   intuition: "Friction is the force a surface exerts along itself, against sliding. It comes in two kinds. Static friction acts while the surfaces do not slide over each other. It is not a fixed force: it grows to match whatever is trying to slide the body, up to a limit. The limit is μs N, where N is the normal force and μs (the Greek letter mu, with s for static) is the coefficient of static friction, a plain number that depends on the two surfaces. Kinetic friction acts once the body is sliding. Its size is fixed at μk N, where μk is the coefficient of kinetic friction, usually smaller than μs: a body is harder to start than to keep moving. On a ramp, gravity pulls along the surface with mg sin θ and the normal force is mg cos θ. If mg sin θ is no more than μs N, static friction holds the body at rest and equals mg sin θ exactly. If it is more, the body slides, kinetic friction acts up the ramp, and Newton’s second law gives the acceleration down it.",
   steps: [
    "Find the normal force on the ramp, N = mg cos θ.",
    "Find the greatest static friction, μs N, and the pull of gravity along the ramp, mg sin θ.",
    "If mg sin θ ≤ μs N the body stays at rest: the friction force equals mg sin θ and the acceleration is 0.",
    "Otherwise it slides: the friction force is μk N, up the ramp, and the acceleration down the ramp is a = (mg sin θ − μk N) ÷ m."
   ],
   example: {
    prompt: "A 40 kg crate is set down at rest on a ramp at 0.3 radians, with μs = 0.5 and μk = 0.3. Does it slide, and what is the friction force?",
    steps: ["N = 40 × 9.8 × cos 0.3 ≈ 374.49 N, so static friction can give up to 0.5 × 374.49 ≈ 187.25 N.", "The pull along the ramp is 392 × sin 0.3 ≈ 115.84 N, which is less than 187.25 N.", "So static friction holds the crate and matches the pull exactly."],
    answer: "It stays put; the friction force is about 115.84 N and the acceleration is 0 m/s²."
   },
   pitfalls: [
    "Using μs N as the friction on a body at rest. Static friction is only as large as it needs to be; μs N is its ceiling.",
    "Using μs for a sliding body. Once it slides, the friction is kinetic, μk N.",
    "Using mg instead of the normal force mg cos θ when working out friction on a ramp."
   ]
  },
  guidance: [
   { prompt: "What is the normal force N = mg cos θ on the crate, in newtons to 2 decimal places?", answer: [485.3], labels: ["normal force (N)"], explanation: "N = 60 × 9.8 × cos 0.6 ≈ 485.3 N." },
   { prompt: "What is the greatest force static friction can give, μs N, in newtons to 2 decimal places?", answer: [291.18], labels: ["greatest static friction (N)"], explanation: "μs N ≈ 0.6 × 485.3 ≈ 291.18 N. Static friction can be anything up to this, never more." },
   { prompt: "What is the pull of gravity along the ramp, mg sin θ, in newtons to 2 decimal places?", answer: [332.01], labels: ["pull along the ramp (N)"], explanation: "mg sin θ = 588 × sin 0.6 ≈ 332.01 N. That is more than 291.18 N, so static friction cannot hold the crate and it slides." },
   { prompt: "So what is the size of the friction force on the crate, in newtons to 2 decimal places?", answer: [218.38], labels: ["friction force (N)"], explanation: "The crate slides, so kinetic friction acts: μk N ≈ 0.45 × 485.3 ≈ 218.38 N." },
   { prompt: "What is the crate’s acceleration down the ramp, in m/s² to 2 decimal places?", answer: [1.89], labels: ["acceleration (m/s²)"], explanation: "a = (mg sin θ − μk N) ÷ m ≈ 113.63 ÷ 60 ≈ 1.89 m/s²." }
  ]
 },
 {
  id: "q23", title: "Counterweight on the slope", topic: "Chapter review: a free-body problem from start to finish", tier: "Intermediate", sector: "Crane Yard",
  brief: "A hanging counterweight hauls crates up the Crane Yard slope, and the riggers must know how fast the crates gain speed and how hard the cable is loaded.",
  lesson: "Draw a free-body diagram for each connected body, write Newton’s second law along each one’s motion, and add the equations so the tension cancels.",
  prompt: "In the Crane Yard a crate of mass 40 kg sits on a ramp that rises at 0.5 radians. A cable runs from the crate up the ramp, over a pulley at the top, and straight down to a hanging counterweight of mass 35 kg. The crate is already sliding up the ramp, and the coefficient of kinetic friction between the crate and the ramp is μk = 0.3. The cable has no mass and does not stretch, and the pulley turns without friction, so the tension is the same all along the cable and both bodies share one acceleration. Take g = 9.8 m/s² and take the crate’s motion up the ramp (and the counterweight’s motion down) as positive. Enter the acceleration in m/s², then the tension in the cable in newtons, both to 2 decimal places.",
  answer: [0.69, 318.8], labels: ["acceleration (m/s²)", "tension (N)"], tolerance: 0.005,
  hints: [
   "Draw a free-body diagram for each body. Along the ramp the crate feels the tension up the slope, and both the pull of gravity along the ramp and kinetic friction down it, because it is moving up. The counterweight feels its weight down and the tension up.",
   "Add Newton’s second law for the two bodies: the tension cancels, leaving (m2 g − m1 g sin θ − μk m1 g cos θ) = (m1 + m2) a. Then use the counterweight alone, m2 g − T = m2 a, to find T."
  ],
  solution: "Crate, along the ramp: gravity pulls down the slope with m1 g sin θ = 40 × 9.8 × sin 0.5 ≈ 187.93 N, and kinetic friction μk m1 g cos θ = 0.3 × 40 × 9.8 × cos 0.5 ≈ 103.2 N also acts down the slope. Counterweight: its weight is m2 g = 343 N. Adding the two equations of Newton’s second law, the tension cancels: (m1 + m2) a = 343 − 187.93 − 103.2 ≈ 51.86 N, so a ≈ 51.86 ÷ 75 ≈ 0.69 m/s². For the counterweight, m2 g − T = m2 a, so T = m2 (g − a) ≈ 35 × (9.8 − 0.69) ≈ 318.8 N.",
  xp: 150, prereqs: ["q20", "q22"],
  artifact: { name: "Haul rig plan", description: "Two free-body diagrams joined by one cable over a pulley." },
  sources: [source.s6_1, source.s6_2],
  teaching: {
   intuition: "This chapter’s tools all meet in one machine: a crate on a ramp tied by a cable over a pulley to a hanging counterweight. The way through any such problem is the same. Draw a free-body diagram for each body: a sketch of that body alone with an arrow for every force on it. Choose a positive direction for each body that matches how they move together: up the ramp for the crate, down for the counterweight. Then write Newton’s second law, ΣF = ma, along that direction for each body. On the crate, the tension pulls up the ramp while the pull of gravity along the ramp, mg sin θ, and kinetic friction, μk mg cos θ, both point down it (friction always opposes the sliding). On the counterweight, its weight pulls down and the tension pulls up. A light cable over a smooth pulley carries the same tension at both ends, and the two bodies share one acceleration. Adding the two equations cancels the tension, which leaves the acceleration; either equation then gives the tension.",
   steps: [
    "Draw a free-body diagram for each body and choose each one’s positive direction along the shared motion.",
    "Crate, along the ramp: T − m1 g sin θ − μk m1 g cos θ = m1 a.",
    "Counterweight, vertically: m2 g − T = m2 a.",
    "Add the two equations to cancel T: a = (m2 g − m1 g sin θ − μk m1 g cos θ) ÷ (m1 + m2). Then T = m2 (g − a)."
   ],
   example: {
    prompt: "A 30 kg crate slides up a ramp at 0.4 radians (μk = 0.2), pulled by a 25 kg counterweight over a smooth pulley. Find the acceleration and the tension.",
    steps: ["Down the slope on the crate: 30 × 9.8 × sin 0.4 ≈ 114.49 N and friction 0.2 × 30 × 9.8 × cos 0.4 ≈ 54.16 N.", "The counterweight pulls with 25 × 9.8 = 245 N, so a ≈ (245 − 114.49 − 54.16) ÷ 55 ≈ 1.39 m/s².", "T = 25 × (9.8 − 1.39…) ≈ 210.29 N, using the unrounded acceleration."],
    answer: "About 1.39 m/s² and a tension of about 210.29 N."
   },
   pitfalls: [
    "Taking the tension as the counterweight’s full weight. That is true only when nothing accelerates; a falling counterweight pulls with less.",
    "Pointing friction the wrong way. The crate moves up the ramp, so kinetic friction points down it.",
    "Dividing the net force by one mass. The net force drives both bodies, so divide by m1 + m2."
   ]
  },
  guidance: [
   { prompt: "What is the pull of gravity on the crate along the ramp, m1 g sin θ, in newtons to 2 decimal places?", answer: [187.93], labels: ["pull along the ramp (N)"], explanation: "m1 g sin θ = 40 × 9.8 × sin 0.5 ≈ 187.93 N, down the slope." },
   { prompt: "The crate moves up the ramp, so kinetic friction acts down it. What is μk m1 g cos θ, in newtons to 2 decimal places?", answer: [103.2], labels: ["friction (N)"], explanation: "The normal force is m1 g cos θ, so friction is 0.3 × 40 × 9.8 × cos 0.5 ≈ 103.2 N." },
   { prompt: "What is the counterweight’s weight m2 g, in newtons?", answer: [343], labels: ["counterweight’s weight (N)"], explanation: "m2 g = 35 × 9.8 = 343 N." },
   { prompt: "The net force on the pair is m2 g minus the two forces down the slope, and it moves the total mass m1 + m2. What is the acceleration, in m/s² to 2 decimal places?", answer: [0.69], labels: ["acceleration (m/s²)"], explanation: "a = (343 − 187.93 − 103.2) ÷ 75 ≈ 51.86 ÷ 75 ≈ 0.69 m/s²." },
   { prompt: "For the counterweight alone, m2 g − T = m2 a. What is the tension T, in newtons to 2 decimal places?", answer: [318.8], labels: ["tension (N)"], explanation: "T = m2 (g − a) ≈ 35 × (9.8 − 0.69) ≈ 318.8 N. It is less than the counterweight’s weight because the counterweight is speeding up on its way down." }
  ]
 },
 {
  id: "q24", title: "Grip on the test track", topic: "Centripetal force: what holds a body on a circle", tier: "Intermediate", sector: "Engine Hall",
  brief: "Rovers leaving the Engine Hall are tested on a flat circular track, and the engineers want the speed limit before a tyre lets go.",
  lesson: "A body moving on a circle needs a net force towards the centre of size mv² ÷ r; on a flat track only static friction can supply it.",
  prompt: "A test rover of mass 600 kg drives at a steady 9 m/s round a flat circular track of radius 40 m beside the Engine Hall. Only static friction between the tyres and the track pulls the rover towards the centre of the circle, and the coefficient of static friction is μs = 0.5. Take g = 9.8 m/s². Enter the centripetal force the rover needs at this speed, in newtons, then the greatest speed at which it can go round this track without skidding, in metres per second, both to 2 decimal places. Type the numbers without commas.",
  answer: [1215, 14], labels: ["centripetal force (N)", "greatest speed (m/s)"], tolerance: 0.005,
  hints: [
   "A body moving on a circle at a steady speed needs a net force towards the centre of size F = mv² ÷ r: its mass times its centripetal acceleration.",
   "On a flat track the most static friction can give is μs mg. The rover skids when mv² ÷ r would have to be more than that, so the greatest speed solves mv² ÷ r = μs mg. The mass cancels."
  ],
  solution: "The centripetal acceleration is v² ÷ r = 81 ÷ 40 ≈ 2.03 m/s², so the centripetal force is F = mv² ÷ r ≈ 1215 N. The most static friction can give is μs mg = 0.5 × 600 × 9.8 = 2940 N. At the greatest speed mv² ÷ r = μs mg, so v² = μs g r = 0.5 × 9.8 × 40 = 196 and v = √196 ≈ 14 m/s. The mass cancelled: a heavier rover needs more grip but also presses down harder.",
  xp: 150, prereqs: ["q14", "q22"],
  artifact: { name: "Track speed board", description: "The fastest safe lap speed for each radius of the test track." },
  sources: [source.s6_3],
  teaching: {
   intuition: "A body going round a circle at a steady speed is still accelerating, because its direction keeps turning. Its centripetal acceleration v² ÷ r points towards the centre of the circle. Newton’s second law says something must supply a net force in that direction, of size F = m v² ÷ r. This is called the centripetal force. It is not a new kind of force: it is the job of pointing inwards, done by whatever force is there. For a ball on a cord it is tension; for a rover on a flat track it is static friction between the tyres and the ground, acting sideways towards the centre. The tyres are not sliding sideways, so the friction is static, and it can give at most μs N = μs mg on a flat track. As the rover speeds up, the force it needs grows with v². When m v² ÷ r would have to exceed μs mg, the grip runs out and the rover skids outwards. Setting m v² ÷ r = μs mg gives the greatest safe speed v = √(μs g r). The mass cancels: a heavier rover needs more grip but presses down harder.",
   steps: [
    "Find the centripetal acceleration v² ÷ r.",
    "Multiply by the mass for the centripetal force, F = m v² ÷ r.",
    "On a flat track the greatest static friction is μs mg.",
    "The greatest safe speed solves m v² ÷ r = μs mg, so v = √(μs g r)."
   ],
   example: {
    prompt: "An 800 kg rover drives at 10 m/s round a flat track of radius 50 m, with μs = 0.4. Find the force it needs and its greatest safe speed.",
    steps: ["v² ÷ r = 100 ÷ 50 = 2 m/s², so F = 800 × 2 = 1600 N.", "Static friction can give up to 0.4 × 800 × 9.8 = 3136 N, so 10 m/s is safe.", "Greatest speed: v = √(0.4 × 9.8 × 50) = √196 = 14 m/s."],
    answer: "1600 N, and at most 14 m/s."
   },
   pitfalls: [
    "Thinking the force points outwards. The rover feels pushed outwards, but the net force on it points in, towards the centre.",
    "Forgetting to square the speed: the force grows four times when the speed doubles.",
    "Using kinetic friction. The tyres roll without sliding sideways, so the grip is static friction, up to μs mg."
   ]
  },
  guidance: [
   { prompt: "What is the rover’s centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?", answer: [2.03], labels: ["centripetal acceleration (m/s²)"], explanation: "v² ÷ r = 81 ÷ 40 ≈ 2.03 m/s², pointing towards the centre." },
   { prompt: "What centripetal force F = m × (v² ÷ r) does that need, in newtons to 2 decimal places?", answer: [1215], labels: ["centripetal force (N)"], explanation: "F = 600 × 81 ÷ 40 ≈ 1215 N, all of it supplied by static friction." },
   { prompt: "What is the most force static friction can give, μs mg, in newtons?", answer: [2940], labels: ["greatest friction (N)"], explanation: "μs mg = 0.5 × 600 × 9.8 = 2940 N. The rover needs less than this at 9 m/s, so it holds the curve." },
   { prompt: "At the greatest speed, mv² ÷ r = μs mg, so v = √(μs g r). What is it, in m/s to 2 decimal places?", answer: [14], labels: ["greatest speed (m/s)"], explanation: "v = √(0.5 × 9.8 × 40) = √196 ≈ 14 m/s." }
  ]
 },
 {
  id: "q25", title: "The drop-shaft pod", topic: "Drag and terminal speed", tier: "Intermediate", sector: "Engine Hall",
  brief: "Supply pods are dropped down the test shaft beside the Engine Hall, and the landing crew needs to know the speed they will hit.",
  lesson: "Air drag grows with the square of the speed; a falling body speeds up until drag equals its weight, then falls at its terminal speed.",
  prompt: "A supply pod of mass 90 kg is dropped down the test shaft beside the Engine Hall. The air drags on it with a force of size D = bv², where v is its speed and the drag constant is b = 0.25 kg/m. Take g = 9.8 m/s². Enter the drag force on the pod when it is falling at 30 m/s, in newtons; then its acceleration at that moment, in m/s² with downward positive; then its terminal speed, in m/s. Give all three to 2 decimal places, and type them without commas.",
  answer: [225, 7.3, 59.4], labels: ["drag (N)", "acceleration (m/s²)", "terminal speed (m/s)"], tolerance: 0.005,
  hints: [
   "Drag points up, against the motion, and grows with the square of the speed. The net downward force is the weight mg minus the drag, and Newton’s second law turns it into an acceleration.",
   "At terminal speed the drag has grown to equal the weight, so the net force and the acceleration are zero: bv² = mg, so v = √(mg ÷ b)."
  ],
  solution: "At 30 m/s the drag is D = bv² = 0.25 × 900 = 225 N, upward. The weight is mg = 882 N, downward. The net downward force is 882 − 225 = 657 N, so a = 657 ÷ 90 ≈ 7.3 m/s². At terminal speed bv² = mg, so v² = 882 ÷ 0.25 ≈ 3528 and v ≈ 59.4 m/s.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Pod drop log", description: "Speed against time for a pod that levels off at its terminal speed." },
  sources: [source.s6_4],
  teaching: {
   intuition: "A body moving through air is pushed back by the air: this force is called drag, and it always points against the motion. For a pod or a person at everyday speeds the drag grows with the square of the speed: D = bv². Here b is a drag constant in kilograms per metre. It is ½CρA, where ρ (rho) is the density of the air, A is the area the body presents to the air, and C is a number for its shape, but in this mission b is given. Gravity pulls the pod down with its weight mg (g = 9.8 m/s²). Drop a pod and at first it is slow, so drag is small and it accelerates at nearly g. As it gains speed the drag grows, the net downward force mg − bv² shrinks, and so does the acceleration (mg − bv²) ÷ m. Eventually the drag equals the weight. Then the net force is zero, the acceleration is zero, and the pod falls at a steady speed: its terminal speed. From bv² = mg, the terminal speed is v = √(mg ÷ b). A heavier pod, or a smaller drag constant, means a faster terminal speed.",
   steps: [
    "At a given speed v the drag is D = bv², pointing up for a falling body.",
    "The net downward force is mg − D, and the acceleration is (mg − D) ÷ m.",
    "At terminal speed the drag equals the weight, bv² = mg.",
    "So the terminal speed is v = √(mg ÷ b)."
   ],
   example: {
    prompt: "A 60 kg pod falls with drag constant 0.2 kg/m. Find the drag and the acceleration at 20 m/s, and the terminal speed.",
    steps: ["D = 0.2 × 400 = 80 N, upward; the weight is 60 × 9.8 = 588 N.", "a = (588 − 80) ÷ 60 ≈ 8.47 m/s².", "Terminal speed: √(588 ÷ 0.2) = √2940 ≈ 54.22 m/s."],
    answer: "80 N, about 8.47 m/s², and about 54.22 m/s."
   },
   pitfalls: [
    "Thinking the pod keeps speeding up for ever. Drag grows until it matches the weight, and the speed levels off.",
    "Forgetting to square the speed in bv².",
    "Leaving out the square root at the end: bv² = mg gives v² = mg ÷ b, not v."
   ]
  },
  guidance: [
   { prompt: "What is the pod’s weight mg, in newtons?", answer: [882], labels: ["weight (N)"], explanation: "mg = 90 × 9.8 = 882 N." },
   { prompt: "What is the drag D = bv² at 30 m/s, in newtons to 2 decimal places?", answer: [225], labels: ["drag (N)"], explanation: "D = 0.25 × 30² = 0.25 × 900 = 225 N." },
   { prompt: "The net downward force is mg − D. What is the acceleration (mg − D) ÷ m, in m/s² to 2 decimal places?", answer: [7.3], labels: ["acceleration (m/s²)"], explanation: "a = (882 − 225) ÷ 90 ≈ 7.3 m/s², less than g because drag holds it back." },
   { prompt: "At terminal speed bv² = mg. What is that speed, √(mg ÷ b), in m/s to 2 decimal places?", answer: [59.4], labels: ["terminal speed (m/s)"], explanation: "v = √(882 ÷ 0.25) ≈ √3528 ≈ 59.4 m/s." }
  ]
 },
 {
  id: "q26", title: "Work in the Engine Hall", topic: "Work by a constant force and by a varying force (an integral)", tier: "Intermediate", sector: "Engine Hall",
  brief: "The Engine Hall logs the energy every machine hands over, and it starts with a winch and a hydraulic ram.",
  lesson: "Work is force along the motion times distance, W = Fd cos θ; for a force that changes with position it is the integral of F(x) dx.",
  prompt: "Two machines in the Engine Hall. First, a winch drags a sled 12 m across the level floor with a constant pull of 250 N along its cable, and the cable makes an angle of 0.5 radians with the floor. Second, a hydraulic ram pushes a block along a straight track from x = 1 m to x = 4 m with a force along the track of F(x) = 6x² + 10x newtons. Enter the work done by the winch’s pull on the sled, in joules to 2 decimal places, then the work done by the ram on the block, in joules. Type the numbers without commas.",
  answer: [2632.75, 201], labels: ["work by the winch (J)", "work by the ram (J)"], tolerance: 0.005,
  hints: [
   "Only the part of a force along the motion does work. For a constant force at angle θ to the displacement, W = F · d = Fd cos θ.",
   "For a force that changes with position, add up F dx along the path: the work is the definite integral of F(x) from the start to the end. Find an antiderivative and subtract its value at the start from its value at the end."
  ],
  solution: "Winch: the part of the pull along the floor is F cos θ = 250 × cos 0.5 ≈ 219.4 N, so W = Fd cos θ = 250 × 12 × cos 0.5 ≈ 2632.75 J. Ram: W = ∫ (6x² + 10x) dx from 1 to 4. An antiderivative is 2x³ + 5x². At x = 4 it is 208 and at x = 1 it is 7, so W = 208 − 7 = 201 J.",
  xp: 150, prereqs: ["q05", "q18"],
  artifact: { name: "Work ledger", description: "One page for steady pulls and one for pushes that change along the way." },
  sources: [source.s7_1],
  teaching: {
   intuition: "In physics, work measures how much a force does in moving something. A force does work only through the part of it that points along the motion, and only while the body moves. For a constant force F acting through a straight displacement d, the work is the dot product W = F · d = Fd cos θ, where θ is the angle between the force and the displacement. The unit is the newton-metre, called the joule (J): one newton pushing through one metre does one joule of work. A force along the motion does positive work; a force against it, such as friction, does negative work; a force at right angles, such as the normal force on a level floor, does no work at all. When the force changes with position, as with a hydraulic ram that pushes harder further along, we cut the path into tiny steps dx, each with work F(x) dx, and add them up. That sum is the definite integral: W = ∫ F(x) dx from the start to the end, found with an antiderivative and the Fundamental Theorem of Calculus.",
   steps: [
    "For a constant force at angle θ to the displacement, the part along the motion is F cos θ.",
    "Multiply by the distance: W = Fd cos θ, in joules when F is in newtons and d in metres.",
    "For a force F(x) along a straight track, the work from x = a to x = b is ∫ F(x) dx from a to b.",
    "Find an antiderivative, evaluate it at the end and at the start, and subtract."
   ],
   example: {
    prompt: "A rope pulls a cart 5 m with 100 N at 0.3 radians to the ground; a ram pushes with F(x) = 3x² + 2x newtons from x = 0 to x = 2 m. Find both works.",
    steps: ["Rope: 100 × 5 × cos 0.3 ≈ 500 × 0.9553 ≈ 477.67 J.", "Ram: an antiderivative of 3x² + 2x is x³ + x². At 2 it is 8 + 4 = 12, at 0 it is 0.", "So the ram does 12 − 0 = 12 J."],
    answer: "About 477.67 J by the rope and 12 J by the ram."
   },
   pitfalls: [
    "Multiplying the whole force by the distance when the force is at an angle. Only F cos θ, the part along the motion, does work.",
    "Multiplying a varying force by the distance. When the force changes along the way you must integrate.",
    "Forgetting to subtract the antiderivative’s value at the start when the start is not x = 0."
   ]
  },
  guidance: [
   { prompt: "What is the part of the winch’s pull along the floor, F cos θ, in newtons to 2 decimal places?", answer: [219.4], labels: ["pull along the floor (N)"], explanation: "F cos θ = 250 × cos 0.5 ≈ 219.4 N. The rest of the pull lifts slightly on the sled and does no work along the floor." },
   { prompt: "What work does the pull do over the 12 m, Fd cos θ, in joules to 2 decimal places?", answer: [2632.75], labels: ["work by the winch (J)"], explanation: "W = 250 × 12 × cos 0.5 ≈ 2632.75 J." },
   { prompt: "An antiderivative of 6x² + 10x is 2x³ + 5x². What is its value at the end, x = 4, in joules?", answer: [208], labels: ["antiderivative at the end (J)"], explanation: "2 × 64 + 5 × 16 = 208." },
   { prompt: "What is its value at the start, x = 1, in joules?", answer: [7], labels: ["antiderivative at the start (J)"], explanation: "2 × 1 + 5 × 1 = 7." },
   { prompt: "The ram’s work is the end value minus the start value. What is it, in joules?", answer: [201], labels: ["work by the ram (J)"], explanation: "W = 208 − 7 = 201 J." }
  ]
 },
 {
  id: "q27", title: "Boost and brake", topic: "Kinetic energy and the work-energy theorem", tier: "Intermediate", sector: "Engine Hall",
  brief: "Sleds on the test track are boosted and braked, and the engineers want each sled’s speed after a stretch without timing it.",
  lesson: "Kinetic energy is K = ½mv²; the net work done on a body equals the change in its kinetic energy.",
  prompt: "A cargo sled of mass 120 kg glides along the level test track at 6 m/s. Then a booster engine pushes it for a stretch, and the net work done on the sled over that stretch is 3240 J (positive, because the net force points along the motion). Enter the sled’s kinetic energy before the stretch, then after it, both in joules, then its speed after the stretch in metres per second to 2 decimal places. Type the numbers without commas.",
  answer: [2160, 5400, 9.49], labels: ["kinetic energy before (J)", "kinetic energy after (J)", "speed after (m/s)"], tolerance: 0.005,
  hints: [
   "Kinetic energy is K = ½mv², in joules when the mass is in kilograms and the speed in metres per second.",
   "The work-energy theorem says the net work equals the change in kinetic energy, so the kinetic energy after the stretch is the kinetic energy before it plus the net work. Then solve ½mv² = K for the speed: v = √(2K ÷ m)."
  ],
  solution: "Before: K = ½mv² = ½ × 120 × 36 = 2160 J. By the work-energy theorem, K after = K before + net work = 2160 + 3240 = 5400 J. Then v = √(2K ÷ m) = √(10800 ÷ 120) ≈ 9.49 m/s.",
  xp: 150, prereqs: ["q26"],
  artifact: { name: "Energy meter", description: "A gauge that reads a sled’s kinetic energy from its speed." },
  sources: [source.s7_2, source.s7_3],
  teaching: {
   intuition: "A moving body carries energy because it is moving: its kinetic energy, K = ½mv². It is measured in joules, like work, when the mass is in kilograms and the speed in metres per second. Because the speed is squared, doubling the speed makes the kinetic energy four times as large. Work and kinetic energy are tied together by the work-energy theorem: the net work done on a body, the total work of all the forces on it, equals the change in its kinetic energy. Positive net work, from a net force along the motion, speeds the body up; negative net work, from a net force against the motion, slows it down. So if you know the starting speed and the net work, you can find the final speed without knowing how long the push lasted: add the net work to the starting kinetic energy, then solve ½mv² = K for v, which gives v = √(2K ÷ m).",
   steps: [
    "Work out the kinetic energy at the start, K = ½mv².",
    "Add the net work (with its sign) to get the kinetic energy at the end.",
    "Solve ½mv² = K for the final speed: v = √(2K ÷ m)."
   ],
   example: {
    prompt: "A 50 kg sled moving at 4 m/s has 500 J of net work done on it. Find its final speed.",
    steps: ["K before = ½ × 50 × 16 = 400 J.", "K after = 400 + 500 = 900 J.", "v = √(2 × 900 ÷ 50) = √36 = 6 m/s."],
    answer: "6 metres per second."
   },
   pitfalls: [
    "Adding the work to the speed instead of to the kinetic energy.",
    "Forgetting the ½ in ½mv², or forgetting to square the speed.",
    "Ignoring the sign of the work: negative net work lowers the kinetic energy."
   ]
  },
  guidance: [
   { prompt: "What is the sled’s kinetic energy ½mv² at 6 m/s, in joules?", answer: [2160], labels: ["kinetic energy before (J)"], explanation: "K = ½ × 120 × 6² = ½ × 120 × 36 = 2160 J." },
   { prompt: "The net work changes the kinetic energy by exactly its own amount. What is the kinetic energy after the stretch, in joules?", answer: [5400], labels: ["kinetic energy after (J)"], explanation: "2160 + 3240 = 5400 J." },
   { prompt: "Solve ½mv² = 5400 for v. What is the speed, in m/s to 2 decimal places?", answer: [9.49], labels: ["speed after (m/s)"], explanation: "v = √(2 × 5400 ÷ 120) = √90 ≈ 9.49 m/s." }
  ]
 },
 {
  id: "q28", title: "The crane’s power rating", topic: "Power: the rate of doing work, P = Fv", tier: "Intermediate", sector: "Engine Hall",
  brief: "The Engine Hall is choosing a winch for the crane, and it needs to compare how fast each one can do the same lift.",
  lesson: "Power is the rate of doing work, P = W ÷ t, measured in watts; for a force on a moving body it is P = Fv.",
  prompt: "The Engine Hall crane lifts a crate of mass 150 kg straight up through 12 m at a steady speed, taking 20 s. Take g = 9.8 m/s². Enter the work the crane’s cable does on the crate, in joules; then the crane’s average power, in watts to 2 decimal places; then how long a 4 kW winch would take to make the same lift, with all of its power going into the lift, in seconds to 2 decimal places. Type the numbers without commas.",
  answer: [17640, 882, 4.41], labels: ["work (J)", "average power (W)", "time for the winch (s)"], tolerance: 0.005,
  hints: [
   "At a steady speed the net force is zero, so the cable pulls up with a force equal to the weight mg, along the motion. The work is that force times the height.",
   "Average power is work divided by time, P = W ÷ t, in watts (joules per second). A kilowatt is 1000 watts, so a winch of P kilowatts does 1000P joules each second, and the time is the work divided by that."
  ],
  solution: "The cable pulls up with mg = 150 × 9.8 = 1470 N, so it does W = mgh = 1470 × 12 = 17640 J. The average power is 17640 ÷ 20 ≈ 882 W. (The same comes from P = Fv: the speed is 12 ÷ 20 m/s, and 1470 × 12 ÷ 20 ≈ 882 W.) A 4 kW winch delivers 4000 J each second, so it needs 17640 ÷ 4000 ≈ 4.41 s.",
  xp: 150, prereqs: ["q27"],
  artifact: { name: "Winch rating plate", description: "A brass plate stamped with the winch’s power in kilowatts." },
  sources: [source.s7_4],
  teaching: {
   intuition: "Two cranes can do exactly the same work, lifting the same crate to the same shelf, but one may do it in half the time. Power measures how fast work is done: average power is the work divided by the time it took, P = W ÷ t. Its unit is the joule per second, called the watt (W): one watt is one joule each second. Larger machines are rated in kilowatts (kW), and a kilowatt is 1000 watts. When a crane lifts a load at a steady speed, the net force on the load is zero, so the cable pulls up with a force equal to the load’s weight, the pull of gravity on it, mg (g = 9.8 m/s²), and the work it does over a height h is mgh. There is a second way to see power: in each second the force moves the load a distance equal to its speed v, so the work per second is P = Fv. For the steady lift that is mg times h ÷ t, the same answer. A machine with a known power P needs time t = W ÷ P to do work W.",
   steps: [
    "At a steady speed the lifting force equals the weight, mg.",
    "The work done lifting through a height h is W = mgh.",
    "The average power is P = W ÷ t, in watts. The same comes from P = Fv with v = h ÷ t.",
    "A machine of power P (in watts: 1 kW = 1000 W) does work W in time t = W ÷ P."
   ],
   example: {
    prompt: "A crane lifts a 100 kg crate 10 m at a steady speed in 25 s. Find the work and the power, and the time a 5 kW winch would need.",
    steps: ["W = 100 × 9.8 × 10 = 9800 J.", "P = 9800 ÷ 25 = 392 W.", "A 5 kW winch does 5000 J per second, so t = 9800 ÷ 5000 = 1.96 s."],
    answer: "9800 J, 392 W, and 1.96 s."
   },
   pitfalls: [
    "Confusing work and power: work is how much energy is handed over, power is how fast.",
    "Forgetting that a kilowatt is 1000 watts.",
    "Dividing the time by the work instead of the work by the time."
   ]
  },
  guidance: [
   { prompt: "At a steady speed the cable’s pull equals the weight. What is mg, in newtons?", answer: [1470], labels: ["lifting force (N)"], explanation: "mg = 150 × 9.8 = 1470 N." },
   { prompt: "The pull acts along the 12 m of motion. What work does it do, in joules?", answer: [17640], labels: ["work (J)"], explanation: "W = 1470 × 12 = 17640 J." },
   { prompt: "What is the average power W ÷ t, in watts to 2 decimal places?", answer: [882], labels: ["average power (W)"], explanation: "P = 17640 ÷ 20 ≈ 882 W." },
   { prompt: "A 4 kW winch does 4000 J per second. How long does it take to do the same work, in seconds to 2 decimal places?", answer: [4.41], labels: ["time for the winch (s)"], explanation: "t = 17640 ÷ 4000 ≈ 4.41 s." }
  ]
 },
 {
  id: "q29", title: "One pull, start to finish", topic: "Chapter review: work, energy and power on one machine", tier: "Intermediate", sector: "Engine Hall",
  brief: "A winch hauls sleds across the Engine Hall floor, and the crew wants its whole energy account from one pull: work in, work lost, speed and power.",
  lesson: "Add the work of every force to get the net work; the work-energy theorem turns it into a speed, and P = Fv gives the power at that speed.",
  prompt: "A winch in the Engine Hall pulls a sled of mass 80 kg from rest across the level floor with a constant horizontal pull of 286 N, along the direction it moves, for 16 m. The coefficient of kinetic friction between the sled and the floor is μk = 0.25. Take g = 9.8 m/s². Enter the work done by the winch on the sled in joules; then the work done by friction in joules, with its sign; then the sled’s speed at the end of the pull in m/s; then the winch’s power at that moment, P = Fv, in watts. Type the numbers without commas.",
  answer: [4576, -3136, 6, 1716], labels: ["work by the winch (J)", "work by friction (J)", "end speed (m/s)", "power at the end (W)"], tolerance: 0.01,
  hints: [
   "The winch’s pull points along the motion, so its work is Fd. Kinetic friction μk mg points against the motion, so its work is −μk mg d. The weight and the normal force are at right angles to the motion and do no work.",
   "The net work is the sum of the two works, and by the work-energy theorem it equals ½mv² at the end, because the sled starts from rest. Solve for v, then multiply by the pull for the power."
  ],
  solution: "Winch: W = Fd = 286 × 16 = 4576 J. Friction: μk mg = 0.25 × 80 × 9.8 = 196 N against the motion, so W = −196 × 16 = −3136 J. Net work = 4576 − 3136 = 1440 J, which equals ½mv², so v² = 2 × 1440 ÷ 80 = 36 and v = 6 m/s. Power at the end: P = Fv = 286 × 6 = 1716 W.",
  xp: 150, prereqs: ["q27", "q28"],
  artifact: { name: "Winch energy account", description: "Work in, work lost to friction, and the speed and power at the end of the pull." },
  sources: [source.s7_1, source.s7_3, source.s7_4],
  teaching: {
   intuition: "This chapter’s ideas fit together on one machine. A winch pulls a sled from rest across a level floor. Four forces act on the sled, and each does its own work. The winch’s pull points along the motion, so it does positive work Fd. Kinetic friction is the drag of a surface on a body sliding over it: its size is μk N, where μk is the coefficient of kinetic friction for the two surfaces and N is the normal force, the floor’s push straight up on the sled, which on a level floor equals the weight mg. Friction points against the motion, so it does negative work −μk mg d: energy that is turned into heat and lost to the motion. The weight and the normal force are at right angles to the motion, so they do no work at all. The net work is the sum of these works. By the work-energy theorem it equals the change in kinetic energy, and the sled starts from rest, so the net work is ½mv² at the end. Solving gives the end speed. Finally, power: at that moment the winch’s pull F acts on a sled moving at speed v, so the winch is delivering P = Fv watts.",
   steps: [
    "Work of the pull along the motion: Fd.",
    "Work of kinetic friction: −μk mg d. The weight and the normal force do no work on a level floor.",
    "Net work = the sum of the works = ½mv² at the end, since the sled starts from rest. Solve for v.",
    "The winch’s power at that moment is P = Fv."
   ],
   example: {
    prompt: "A winch pulls a 50 kg sled from rest for 10 m with 138 N, and μk = 0.2. Find the works, the end speed and the power at the end.",
    steps: ["Winch: 138 × 10 = 1380 J. Friction: 0.2 × 50 × 9.8 = 98 N, so −98 × 10 = −980 J.", "Net work 1380 − 980 = 400 J = ½ × 50 × v², so v² = 16 and v = 4 m/s.", "Power: 138 × 4 = 552 W."],
    answer: "1380 J, −980 J, 4 m/s and 552 W."
   },
   pitfalls: [
    "Giving friction positive work. It points against the motion, so its work is negative.",
    "Using the winch’s work alone in the work-energy theorem. It is the net work that equals the change in kinetic energy.",
    "Using the average speed for the power at the end. At the end, P = F times the speed at the end."
   ]
  },
  guidance: [
   { prompt: "What work does the winch’s pull do over the 16 m, in joules?", answer: [4576], labels: ["work by the winch (J)"], explanation: "W = Fd = 286 × 16 = 4576 J." },
   { prompt: "Friction is μk mg against the motion. What work does it do, in joules, with its sign?", answer: [-3136], labels: ["work by friction (J)"], explanation: "μk mg = 196 N, so W = −196 × 16 = −3136 J." },
   { prompt: "The net work equals the kinetic energy at the end, ½mv². What is the speed, in m/s?", answer: [6], labels: ["end speed (m/s)"], explanation: "½ × 80 × v² = 1440, so v² = 36 and v = 6 m/s." },
   { prompt: "What is the winch’s power at that moment, P = Fv, in watts?", answer: [1716], labels: ["power at the end (W)"], explanation: "P = 286 × 6 = 1716 W." }
  ]
 },
 {
  id: "q30", title: "Energy on the shelf", topic: "Potential energy: height and a stretched spring", tier: "Advanced", sector: "Docking Ring",
  brief: "The Docking Ring stores cargo canisters on high shelves and stops them with spring buffers, and the safety officer wants the energy stored in each.",
  lesson: "Gravitational potential energy is U = mgy above a chosen zero; a spring squeezed or stretched by x stores U = ½kx²; gravity’s work is −ΔU.",
  prompt: "In the Docking Ring a crane lifts a cargo canister of mass 250 kg from the floor onto a shelf 8 m up. Later it lowers the canister from the shelf to a platform 3 m above the floor. Take the floor as the zero of gravitational potential energy, and g = 9.8 m/s². Beside it, a spring buffer with spring constant k = 1600 N/m is squeezed 0.25 m shorter than its natural length. Enter the canister’s gravitational potential energy on the shelf, then the potential energy stored in the spring buffer, then the work gravity does on the canister as it is lowered from the shelf to the platform, all in joules. Type the numbers without commas.",
  answer: [19600, 50, 12250], labels: ["potential energy on the shelf (J)", "spring energy (J)", "work by gravity (J)"], tolerance: 0.005,
  hints: [
   "Near the ground, gravitational potential energy is U = mgy, where y is the height above the level you chose as zero.",
   "A spring squeezed or stretched by x stores U = ½kx². The work gravity does is minus the change in potential energy: start value minus end value."
  ],
  solution: "On the shelf: U = mgy = 250 × 9.8 × 8 = 19600 J. Spring: U = ½kx² = ½ × 1600 × 0.25² = ½ × 1600 × 0.0625 = 50 J. On the platform U = 250 × 9.8 × 3 = 7350 J, so the change on the way down is 7350 − 19600 = −12250 J, and the work gravity does is minus that: 12250 J. Gravity does positive work because the canister moves the way gravity pulls.",
  xp: 200, prereqs: ["q26"],
  artifact: { name: "Stored-energy tag", description: "A tag on each shelf and buffer giving the energy it holds." },
  sources: [source.s8_1],
  teaching: {
   intuition: "Lifting a canister onto a high shelf takes work, and that work is not lost: it is stored, ready to come back as motion if the canister falls. Stored energy of this kind is called potential energy, U. Gravity pulls a body of mass m down with its weight mg, so lifting it through a height y at a steady speed takes work mgy. Near the ground, then, a body of mass m at height y has gravitational potential energy U = mgy. Only changes in U matter, so we are free to choose where y = 0 is; here it is the floor. When the body moves, gravity does work equal to minus the change in potential energy, W = −ΔU = U at the start − U at the end: positive when the body comes down, negative when it is lifted. A spring stores energy too. Squeezed or stretched by a distance x from its natural length, it pushes back with a force kx, where k is the spring constant in newtons per metre: a stiff spring has a large k. The work needed to squeeze it is ∫ ks ds from 0 to x, which is ½kx², and that is the energy the spring stores: U = ½kx², zero at its natural length.",
   steps: [
    "Choose the zero of height, then U = mgy for a body at height y.",
    "The work gravity does as the body moves is W = −ΔU = U at the start − U at the end.",
    "A spring with spring constant k, squeezed or stretched by x, pushes back with force kx.",
    "The energy it stores is U = ½kx², the integral of ks from 0 to x."
   ],
   example: {
    prompt: "A 100 kg canister is lifted 5 m onto a shelf, then lowered to 2 m. A spring with k = 1000 N/m is squeezed 0.2 m. Find the energies and gravity’s work.",
    steps: ["On the shelf: 100 × 9.8 × 5 = 4900 J; at 2 m: 1960 J.", "Gravity’s work on the way down: 4900 − 1960 = 2940 J.", "Spring: ½ × 1000 × 0.04 = 20 J."],
    answer: "4900 J on the shelf, 2940 J of work by gravity, 20 J in the spring."
   },
   pitfalls: [
    "Getting the sign of gravity’s work wrong. A body coming down loses potential energy, and gravity does positive work.",
    "Forgetting to square the squeeze in ½kx², or forgetting the ½.",
    "Measuring the height from the wrong level. Use the height above the level chosen as zero."
   ]
  },
  guidance: [
   { prompt: "What is the canister’s gravitational potential energy mgy on the shelf, in joules?", answer: [19600], labels: ["potential energy on the shelf (J)"], explanation: "U = 250 × 9.8 × 8 = 19600 J." },
   { prompt: "What is its gravitational potential energy on the platform, in joules?", answer: [7350], labels: ["potential energy on the platform (J)"], explanation: "U = 250 × 9.8 × 3 = 7350 J." },
   { prompt: "The work gravity does is minus the change in potential energy, shelf value minus platform value. What is it, in joules?", answer: [12250], labels: ["work by gravity (J)"], explanation: "W = 19600 − 7350 = 12250 J." },
   { prompt: "What energy ½kx² is stored in the squeezed spring buffer, in joules?", answer: [50], labels: ["spring energy (J)"], explanation: "½ × 1600 × 0.25² = ½ × 1600 × 0.0625 = 50 J." }
  ]
 }
);
})();
