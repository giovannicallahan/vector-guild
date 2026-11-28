/* Mechanics: motion and force missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/mech/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Energy and momentum · Advanced, 200 XP · sector 'Docking Ring' · Conservation of mechanical energy, with and without friction [8.3]
     q32  ch 6 Energy and momentum · Advanced, 200 XP · sector 'Docking Ring' · Momentum and impulse [9.1, 9.2]
     q33  ch 6 Energy and momentum · Advanced, 200 XP · sector 'Docking Ring' · Conservation of momentum: sticking and elastic collisions [9.3, 9.4]
     q34  ch 6 Energy and momentum · Advanced, 200 XP · sector 'Docking Ring' · The centre of mass [9.6]
     q35  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Angular position, angular velocity and v = ωr [10.1, 10.3]
     q36  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Moment of inertia and rotational kinetic energy [10.4]
     q37  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Torque and Newton's second law for rotation, τ = Iα [10.6, 10.7]
     q38  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Conservation of angular momentum [11.3]
     q39  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Universal gravitation and circular orbits [13.1, 13.4]
     q40  ch 7 Spin and orbit · Advanced, 200 XP · sector 'Flywheel Vault' · Realm review: a two-dimensional collision then a climb; bridge to Waves [9.5, 8.3] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 3.4 Motion with Constant Acceleration
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s8_1: { title: "OpenStax University Physics Volume 1 — 8.1 Potential Energy of a System", url: "https://openstax.org/books/university-physics-volume-1/pages/8-1-potential-energy-of-a-system", description: "Gravitational potential energy near the surface, mgy, and the elastic potential energy of a spring, ½kx².", verified: '2026-11-28' },
 s8_3: { title: "OpenStax University Physics Volume 1 — 8.3 Conservation of Energy", url: "https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy", description: "Mechanical energy K + U stays constant unless non-conservative forces such as friction do work, which changes it by the amount of that work.", verified: '2026-11-28' },
 s9_1: { title: "OpenStax University Physics Volume 1 — 9.1 Linear Momentum", url: "https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum", description: "Momentum as mass times velocity, a vector with the direction of the velocity.", verified: '2026-11-28' },
 s9_2: { title: "OpenStax University Physics Volume 1 — 9.2 Impulse and Collisions", url: "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions", description: "Impulse as force times time, in N·s; the impulse equals the change in momentum, and average force is impulse divided by collision time.", verified: '2026-11-28' },
 s9_3: { title: "OpenStax University Physics Volume 1 — 9.3 Conservation of Linear Momentum", url: "https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum", description: "In a closed system with no net external force the total momentum does not change.", verified: '2026-11-28' },
 s9_4: { title: "OpenStax University Physics Volume 1 — 9.4 Types of Collisions", url: "https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions", description: "Elastic collisions keep kinetic energy; inelastic ones lose some, and bodies that stick together lose the most.", verified: '2026-11-28' },
 s9_5: { title: "OpenStax University Physics Volume 1 — 9.5 Collisions in Multiple Dimensions", url: "https://openstax.org/books/university-physics-volume-1/pages/9-5-collisions-in-multiple-dimensions", description: "Momentum conserved separately in x and in y, for bodies that lock together after a two-dimensional collision.", verified: '2026-11-28' },
 s9_6: { title: "OpenStax University Physics Volume 1 — 9.6 Center of Mass", url: "https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass", description: "The centre of mass of point particles: the mass-weighted sum of positions divided by the total mass, one coordinate at a time.", verified: '2026-11-28' },
 s10_1: { title: "OpenStax University Physics Volume 1 — 10.1 Rotational Variables", url: "https://openstax.org/books/university-physics-volume-1/pages/10-1-rotational-variables", description: "Angular position in radians, angular velocity ω = dθ/dt, rpm to rad/s, and tangential speed v = ωr.", verified: '2026-11-28' },
 s10_3: { title: "OpenStax University Physics Volume 1 — 10.3 Relating Angular and Translational Quantities", url: "https://openstax.org/books/university-physics-volume-1/pages/10-3-relating-angular-and-translational-quantities", description: "Arc length s = rθ and tangential speed v = rω for a point on a rotating body.", verified: '2026-11-28' },
 s10_4: { title: "OpenStax University Physics Volume 1 — 10.4 Moment of Inertia and Rotational Kinetic Energy", url: "https://openstax.org/books/university-physics-volume-1/pages/10-4-moment-of-inertia-and-rotational-kinetic-energy", description: "The moment of inertia I = Σmr² in kg·m², and rotational kinetic energy ½Iω².", verified: '2026-11-28' },
 s10_6: { title: "OpenStax University Physics Volume 1 — 10.6 Torque", url: "https://openstax.org/books/university-physics-volume-1/pages/10-6-torque", description: "Torque of magnitude rF sin θ in N·m, the lever arm r sin θ, and net torque.", verified: '2026-11-28' },
 s10_7: { title: "OpenStax University Physics Volume 1 — 10.7 Newton’s Second Law for Rotation", url: "https://openstax.org/books/university-physics-volume-1/pages/10-7-newtons-second-law-for-rotation", description: "The net torque on a rigid body about a fixed axis equals its moment of inertia times its angular acceleration.", verified: '2026-11-28' },
 s11_3: { title: "OpenStax University Physics Volume 1 — 11.3 Conservation of Angular Momentum", url: "https://openstax.org/books/university-physics-volume-1/pages/11-3-conservation-of-angular-momentum", description: "With no net external torque angular momentum is constant, so Iω is the same before and after; coupled flywheels lose kinetic energy.", verified: '2026-11-28' },
 s13_1: { title: "OpenStax University Physics Volume 1 — 13.1 Newton’s Law of Universal Gravitation", url: "https://openstax.org/books/university-physics-volume-1/pages/13-1-newtons-law-of-universal-gravitation", description: "The attraction F = Gm₁m₂ ÷ r² between centres, with G = 6.67 × 10⁻¹¹ N·m²/kg².", verified: '2026-11-28' },
 s13_4: { title: "OpenStax University Physics Volume 1 — 13.4 Satellite Orbits and Energy", url: "https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy", description: "Gravity as the centripetal force of a circular orbit: v = √(GM ÷ r), and the period, with r measured from the planet’s centre.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "The buffer at the end of the ramp", topic: "Conservation of mechanical energy, with and without friction", tier: 'Advanced', sector: 'Docking Ring',
  brief: "Cargo sleds roll down the loading ramp into a buffer spring, and the riggers need to know how fast they arrive and how far the spring gives.",
  lesson: "With only gravity and springs doing work, kinetic plus potential energy stays the same; friction takes away energy equal to the size of its work.",
  prompt: "A cargo sled of mass 30 kg starts from rest at the top of the Docking Ring’s loading ramp, 4 m above the floor. The ramp is frictionless. At the bottom the sled crosses a rough strip of floor 3 m long, where the coefficient of kinetic friction is μ = 0.2: there the friction force is μmg, μ times the sled’s weight. Past the strip the floor is frictionless again, and the sled runs into a buffer spring with spring constant k = 3000 N/m. Take g = 9.8 m/s². Enter the sled’s speed at the bottom of the ramp in metres per second, then the greatest compression of the spring in metres, both to 2 decimal places.",
  answer: [8.85, 0.82], labels: ["speed at the bottom (m/s)","spring compression (m)"], tolerance: 0.005,
  hints: [
   "On the frictionless ramp mechanical energy is kept: the potential energy mgh at the top becomes the kinetic energy ½mv² at the bottom.",
   "On the rough strip friction takes away energy equal to the size of its work, μmg × distance. What is left is stored in the spring as ½kx² at the moment the sled stops."
  ],
  solution: "At the top U = mgh = 30 × 9.8 × 4 = 1176 J and K = 0. At the bottom of the ramp all of it is kinetic: ½ × 30 × v² = 1176, so v = √(2 × 9.8 × 4) ≈ 8.85 m/s. On the strip friction does −μmgd = −0.2 × 30 × 9.8 × 3 = −176.4 J of work, leaving 1176 − 176.4 = 999.6 J of mechanical energy. At the greatest compression the sled is still, so ½ × 3000 × x² = 999.6, giving x = √(2 × 999.6 ÷ 3000) ≈ 0.82 m.",
  xp: 200, prereqs: ["q30","q27"],
  artifact: { name: "Buffer test card", description: "One sled’s energy, counted at the top, the bottom and the spring." },
  sources: [source.s8_3, source.s8_1],
  teaching: {
   intuition: "Energy can change form without being lost. A sled at the top of a ramp has potential energy mgh because of its height. As it slides down a smooth ramp it loses height and gains speed, and the kinetic energy ½mv² it gains is exactly the potential energy it lost. The sum K + U is called the mechanical energy, and it stays the same while only conservative forces do work. A conservative force, such as gravity or a spring, stores the energy it takes and gives it back. Friction is different: it turns mechanical energy into heat, which does not come back. So with friction, the mechanical energy at the end is the energy at the start minus the size of the work friction did. A spring squeezed by a distance x stores ½kx², so energy left when the sled stops against a spring is all in the spring.",
   steps: [
    "Write the mechanical energy at the start: kinetic energy ½mv² plus potential energy mgh (and ½kx² for a squeezed spring).",
    "Where only gravity and springs do work, the mechanical energy at the end equals the mechanical energy at the start.",
    "Where friction acts, subtract the size of its work: the friction force times the distance slid. On flat ground the kinetic friction force is μmg.",
    "Set the energy that is left equal to the form it takes at the end (½mv² for a speed, ½kx² for a spring) and solve, rounding only at the very end."
   ],
   example: {
    prompt: "A 10 kg sled starts from rest 5 m up a frictionless ramp, crosses a 2 m strip with μ = 0.25, then squeezes a spring with k = 1000 N/m. Take g = 9.8 m/s². How far is the spring squeezed?",
    steps: [
     "At the top: U = 10 × 9.8 × 5 = 490 J, and K = 0.",
     "Friction on the strip: 0.25 × 10 × 9.8 × 2 = 49 J, so 490 − 49 = 441 J is left.",
     "At the greatest squeeze: ½ × 1000 × x² = 441, so x = √(882 ÷ 1000) = √0.882 ≈ 0.94."
    ],
    answer: "About 0.94 metres."
   },
   pitfalls: [
    "Forgetting the friction loss and putting all of mgh into the spring.",
    "Using the energy of the spring as kx instead of ½kx², or forgetting to take the square root at the end.",
    "Rounding the speed or the energy halfway through, which can change the last digit of the answer."
   ]
  },
  guidance: [
   { prompt: "What is the sled’s potential energy at the top of the ramp, U = mgh, in joules?", answer: [1176], labels: ["potential energy at the top (J)"], explanation: "U = 30 × 9.8 × 4 = 1176 J. The sled starts from rest, so this is all its mechanical energy." },
   { prompt: "On the frictionless ramp all of that becomes kinetic energy. What is the speed at the bottom, in m/s to 2 decimal places?", answer: [8.85], labels: ["speed at the bottom (m/s)"], explanation: "½mv² = mgh, and the mass cancels: v = √(2gh) = √(2 × 9.8 × 4) ≈ 8.85 m/s." },
   { prompt: "How much energy, in joules, does friction take on the 3 m strip (μmg × distance)?", answer: [176.4], labels: ["energy taken by friction (J)"], explanation: "0.2 × 30 × 9.8 × 3 = 176.4 J. Friction is not a conservative force: this energy leaves as heat and does not come back." },
   { prompt: "The 999.6 J that is left is stored in the spring when it is squeezed furthest. What is the compression x, in metres to 2 decimal places?", answer: [0.82], labels: ["spring compression (m)"], explanation: "½kx² = 999.6, so x = √(2 × 999.6 ÷ 3000) ≈ 0.82 m." }
  ]
 },
 {
  id: 'q32', title: "Bouncing off the docking buffer", topic: "Momentum and impulse", tier: 'Advanced', sector: 'Docking Ring',
  brief: "A cargo module has hit the docking buffer and bounced, and the engineers want to know how hard the buffer had to push.",
  lesson: "Momentum is mass times velocity; the impulse of a force is the change in momentum it causes, and average force is impulse divided by contact time.",
  prompt: "A 120 kg cargo module drifts towards the docking buffer at 3 m/s, presses into it for 0.4 s and bounces straight back at 1.5 m/s. The module floats in the ring, so during the contact only the buffer pushes on it along its line of motion. Take the direction towards the buffer as positive, so the velocity after the bounce is −1.5 m/s. Enter the module’s momentum before it touches the buffer in kilogram metres per second (kg·m/s), then the impulse the buffer gives it in newton seconds (N·s), then the average force of the buffer on it in newtons (N). Signs matter; type the numbers without commas.",
  answer: [360, -540, -1350], labels: ["momentum before (kg·m/s)","impulse (N·s)","average force (N)"], tolerance: 0.005,
  hints: [
   "Momentum is mass times velocity, p = mv. The velocity after the bounce is negative, so that momentum is negative too.",
   "The impulse equals the change in momentum, final minus initial. The average force is the impulse divided by the contact time."
  ],
  solution: "Before: p = 120 × 3 = 360 kg·m/s. After: p = 120 × (−1.5) = −180 kg·m/s. The impulse is the change in momentum: −180 − 360 = −540 N·s. The average force is impulse ÷ contact time = −540 ÷ 0.4 = −1350 N. The minus sign says the buffer pushes in the negative direction, back the way the load came.",
  xp: 200, prereqs: ["q18"],
  artifact: { name: "Buffer strain log", description: "The push a docking buffer gave one module, worked out from its bounce." },
  sources: [source.s9_1, source.s9_2],
  teaching: {
   intuition: "A heavy module that is moving slowly can be as hard to stop as a light one moving fast. The quantity that measures this is momentum, p = mv: mass times velocity, in kilogram metres per second (kg·m/s). Because velocity has a direction, so does momentum, and on a line we keep track of it with a sign. To change a body’s momentum a force has to act on it for some time. The force times the time is called the impulse, measured in newton seconds (N·s), which is the same unit as kg·m/s. Newton’s second law, rewritten, says the impulse on a body equals its change in momentum: final momentum minus initial momentum. So if we know how the momentum changed and how long the contact lasted, the average force is the impulse divided by the contact time. A shorter contact means a bigger force for the same change, which is why buffers are soft.",
   steps: [
    "Choose a positive direction, and give each velocity its sign.",
    "Work out the momentum before and after: p = mv each time.",
    "The impulse is the change in momentum: p after minus p before. Its unit is N·s.",
    "The average force is the impulse divided by the contact time, in newtons, with the same sign as the impulse."
   ],
   example: {
    prompt: "An 80 kg crate moving at 2 m/s hits a wall, touches it for 0.5 s and bounces back at 1 m/s. Take the direction towards the wall as positive. What is the average force of the wall on the crate?",
    steps: [
     "Before: p = 80 × 2 = 160 kg·m/s. After: p = 80 × (−1) = −80 kg·m/s.",
     "Impulse: −80 − 160 = −240 N·s.",
     "Average force: −240 ÷ 0.5 = −480 N."
    ],
    answer: "−480 newtons: 480 N pushing away from the wall."
   },
   pitfalls: [
    "Forgetting that the velocity after a bounce has the opposite sign, which gives the difference of the speeds instead of their sum.",
    "Subtracting in the wrong order: the impulse is final momentum minus initial momentum.",
    "Multiplying the impulse by the contact time instead of dividing by it."
   ]
  },
  guidance: [
   { prompt: "What is the module’s momentum before it touches the buffer, 120 × 3, in kg·m/s?", answer: [360], labels: ["momentum before (kg·m/s)"], explanation: "p = mv = 120 × 3 = 360 kg·m/s, positive because the module moves towards the buffer." },
   { prompt: "What is its momentum after the bounce, with velocity −1.5 m/s, in kg·m/s?", answer: [-180], labels: ["momentum after (kg·m/s)"], explanation: "p = 120 × (−1.5) = −180 kg·m/s. It is negative because the module now moves away from the buffer." },
   { prompt: "The impulse is the change in momentum, final minus initial. What is it, in N·s?", answer: [-540], labels: ["impulse (N·s)"], explanation: "−180 − 360 = −540 N·s. A bounce changes the momentum by more than a plain stop would." },
   { prompt: "Divide the impulse by the contact time of 0.4 s. What is the average force, in N?", answer: [-1350], labels: ["average force (N)"], explanation: "−540 ÷ 0.4 = −1350 N. A shorter contact time would mean a larger force for the same impulse." }
  ]
 },
 {
  id: 'q33', title: "Latching two modules on the track", topic: "Conservation of momentum: sticking and elastic collisions", tier: 'Advanced', sector: 'Docking Ring',
  brief: "Two cargo modules are about to latch together on the docking track, and control needs their speed afterwards and how much energy the latches must soak up.",
  lesson: "With no outside force, the total momentum before a collision equals the total after; when bodies stick together kinetic energy is lost.",
  prompt: "Module A (400 kg) glides along the docking track at 3 m/s towards module B (200 kg), which is coming the other way at 1.5 m/s (a velocity of −1.5 m/s). Take A’s direction of motion as positive. The two latch together and move off as one, and no outside force acts along the track. Enter their common velocity just after latching in metres per second, then the kinetic energy lost in the collision in joules (type the numbers without commas).",
  answer: [1.5, 1350], labels: ["common velocity (m/s)","kinetic energy lost (J)"], tolerance: 0.005,
  hints: [
   "The total momentum before, m₁v₁ + m₂v₂, equals the total momentum after, (m₁ + m₂)v. Keep the sign of each velocity.",
   "The kinetic energy lost is the total ½mv² of the two modules before, minus ½(m₁ + m₂)v² after."
  ],
  solution: "Momentum before: 400 × 3 + 200 × (−1.5) = 900 kg·m/s. After latching the mass is 600 kg, so v = 900 ÷ 600 = 1.5 m/s. Kinetic energy before: ½ × 400 × 3² + ½ × 200 × (−1.5)² = 2025 J. After: ½ × 600 × 1.5² = 675 J. Lost: 2025 − 675 = 1350 J. Latching makes the collision perfectly inelastic, so kinetic energy is lost; in an elastic collision none would be.",
  xp: 200, prereqs: ["q32","q27"],
  artifact: { name: "Latch rating sheet", description: "How much energy one latching collision turned into heat." },
  sources: [source.s9_3, source.s9_4],
  teaching: {
   intuition: "When two modules collide, each pushes on the other with forces of equal size and opposite direction (Newton’s third law) for the same time, so the impulse on one is the exact opposite of the impulse on the other. Whatever momentum one gains, the other loses. So if no outside force acts on the pair, their total momentum before the collision equals their total momentum after: momentum is conserved. Kinetic energy is a different story. In an elastic collision the bodies bounce apart and the total kinetic energy is kept too. In an inelastic collision some kinetic energy turns into heat, sound and bent metal. When the bodies stick together and move as one, the collision is perfectly inelastic and the loss is as large as momentum allows. For a sticking collision the common velocity comes from momentum alone: (m₁v₁ + m₂v₂) ÷ (m₁ + m₂).",
   steps: [
    "Choose a positive direction and give each velocity its sign.",
    "Add the momenta before the collision: m₁v₁ + m₂v₂.",
    "If the bodies stick, divide the total momentum by the total mass to get their common velocity.",
    "For the energy, work out the total ½mv² before and ½(m₁ + m₂)v² after; the difference is the kinetic energy lost.",
    "If instead the bodies bounce apart elastically, the total kinetic energy after equals the total before. That gives a second equation beside momentum, enough to find both velocities after the collision."
   ],
   example: {
    prompt: "A 300 kg cart moving at 2 m/s runs into a 100 kg cart at rest, and they stick together. What is their speed afterwards, and how much kinetic energy is lost?",
    steps: [
     "Momentum before: 300 × 2 + 100 × 0 = 600 kg·m/s. Joined mass 400 kg, so v = 600 ÷ 400 = 1.5 m/s.",
     "Kinetic energy before: ½ × 300 × 2² = 600 J. After: ½ × 400 × 1.5² = 450 J.",
     "Lost: 600 − 450 = 150 J."
    ],
    answer: "1.5 metres per second, and 150 joules lost."
   },
   pitfalls: [
    "Adding speeds instead of momenta, or dropping the minus sign of a body coming the other way.",
    "Assuming kinetic energy is conserved in a sticking collision. Only momentum is kept; the energy lost is real.",
    "Dividing the total momentum by one mass instead of the joined mass."
   ]
  },
  guidance: [
   { prompt: "What is the total momentum of A and B before the collision, in kg·m/s?", answer: [900], labels: ["total momentum (kg·m/s)"], explanation: "400 × 3 + 200 × (−1.5) = 900 kg·m/s. Momentum is kept, so the latched pair has this momentum too." },
   { prompt: "Divide by the joined mass of 600 kg. What is the common velocity, in m/s?", answer: [1.5], labels: ["common velocity (m/s)"], explanation: "v = 900 ÷ 600 = 1.5 m/s." },
   { prompt: "What is the total kinetic energy of the two modules before the collision, in joules?", answer: [2025], labels: ["kinetic energy before (J)"], explanation: "½ × 400 × 3² + ½ × 200 × (−1.5)² = 2025 J." },
   { prompt: "The latched pair has kinetic energy ½ × 600 × 1.5². How much kinetic energy, in joules, was lost?", answer: [1350], labels: ["kinetic energy lost (J)"], explanation: "After: ½ × 600 × 1.5² = 675 J. Lost: 2025 − 675 = 1350 J, turned into heat and sound in the latches." }
  ]
 },
 {
  id: 'q34', title: "Balancing the parked modules", topic: "The centre of mass", tier: 'Advanced', sector: 'Docking Ring',
  brief: "The docking ring tilts if its load sits off centre, so the crew needs the one point that stands for the whole group of parked modules.",
  lesson: "The centre of mass of point masses is the mass-weighted average of their positions, worked out one coordinate at a time.",
  prompt: "Three cargo modules are parked on the Docking Ring floor, which is marked with an x axis and a y axis in metres. Module A has mass 300 kg and sits at (2, 5), module B has mass 500 kg at (−4, 1), and module C has mass 200 kg at (6, −3). Treat each module as a point at its position. Enter the x coordinate of the centre of mass, then its y coordinate, both in metres to 2 decimal places.",
  answer: [-0.2, 1.4], labels: ["centre of mass x (m)","centre of mass y (m)"], tolerance: 0.005,
  hints: [
   "The centre of mass is a mass-weighted average: multiply each position by its mass, add the products, and divide by the total mass.",
   "Work out x and y separately, and keep the signs of negative coordinates."
  ],
  solution: "Total mass M = 300 + 500 + 200 = 1000 kg. Σmx = 300 × 2 + 500 × (−4) + 200 × 6 = −200 kg·m, so x = −200 ÷ 1000 = −0.2 m. Σmy = 300 × 5 + 500 × 1 + 200 × (−3) = 1400 kg·m, so y = 1400 ÷ 1000 = 1.4 m. The centre of mass is at (−0.2, 1.4).",
  xp: 200, prereqs: ["q33"],
  artifact: { name: "Floor load chart", description: "Three parked modules and the single point that balances them." },
  sources: [source.s9_6],
  teaching: {
   intuition: "A group of bodies moves, under outside forces, as if all its mass sat at one point: the centre of mass. For a few small bodies treated as points, it is a weighted average of their positions, where each position counts as much as the mass sitting there. Two equal masses have their centre of mass halfway between them; if one is three times heavier, the centre of mass is three times closer to it. In symbols, with M the total mass, the x coordinate is x = (m₁x₁ + m₂x₂ + …) ÷ M, and Σmx is a short way to write that sum of products, Σ meaning “add up”. The y coordinate is found the same way from the y positions. Because momentum is conserved when no outside force acts, the centre of mass of two colliding modules keeps moving at a steady velocity through the collision.",
   steps: [
    "Add the masses to get the total mass M.",
    "Multiply each x coordinate by its mass and add the products: Σmx.",
    "Divide by M to get the x coordinate of the centre of mass.",
    "Repeat with the y coordinates, keeping every sign."
   ],
   example: {
    prompt: "A 2 kg block sits at x = 0 m and a 6 kg block at x = 4 m on a line. Where is their centre of mass?",
    steps: [
     "Total mass: 2 + 6 = 8 kg.",
     "Σmx = 2 × 0 + 6 × 4 = 24 kg·m.",
     "x = 24 ÷ 8 = 3."
    ],
    answer: "At x = 3 metres, nearer the heavier block."
   },
   pitfalls: [
    "Taking the plain average of the positions, which ignores the masses.",
    "Dividing by the number of bodies instead of the total mass.",
    "Dropping the minus sign of a negative coordinate."
   ]
  },
  guidance: [
   { prompt: "What is the total mass of the three modules, in kg?", answer: [1000], labels: ["total mass (kg)"], explanation: "300 + 500 + 200 = 1000 kg." },
   { prompt: "Multiply each module’s x coordinate by its mass and add. What is Σmx, in kg·m?", answer: [-200], labels: ["Σmx (kg·m)"], explanation: "300 × 2 + 500 × (−4) + 200 × 6 = −200 kg·m." },
   { prompt: "Divide Σmx by the total mass. What is the x coordinate of the centre of mass, in metres to 2 decimal places?", answer: [-0.2], labels: ["centre of mass x (m)"], explanation: "−200 ÷ 1000 = −0.2 m." },
   { prompt: "Do the same with the y coordinates. What is the y coordinate of the centre of mass, in metres to 2 decimal places?", answer: [1.4], labels: ["centre of mass y (m)"], explanation: "Σmy = 1400 kg·m, and 1400 ÷ 1000 = 1.4 m." }
  ]
 },
 {
  id: 'q35', title: "Clocking the vault flywheel", topic: "Angular position, angular velocity and v = ωr", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "The vault flywheel’s gauge reads in revolutions per minute, and the safety check needs its spin in radians per second and the speed of its rim.",
  lesson: "Angular velocity ω is the rate of change of the angle turned, in radians per second; a point at distance r from the axle moves at v = ωr.",
  prompt: "A flywheel in the vault spins at a steady 150 revolutions per minute (rpm). A point on its rim is 0.4 m from the axle. Enter the flywheel’s angular velocity ω in radians per second, then the speed of the rim point in metres per second, both to 2 decimal places (use the unrounded ω for the speed), then the number of turns the flywheel makes in 12 seconds.",
  answer: [15.71, 6.28, 30], labels: ["angular velocity (rad/s)","rim speed (m/s)","turns"], tolerance: 0.005,
  hints: [
   "One turn is 2π radians and one minute is 60 seconds, so multiply the rpm by 2π and divide by 60 to get radians per second.",
   "A point at distance r from the axle moves at v = ωr. The number of turns is the turns per second times the time."
  ],
  solution: "ω = 150 × 2π ÷ 60 = 5π ≈ 15.71 rad/s. The rim speed is v = ωr = 5π × 0.4 ≈ 6.28 m/s. The flywheel makes 150 ÷ 60 = 2.5 turns each second, so in 12 s it makes 2.5 × 12 = 30 turns, and its angular position changes by 60π radians.",
  xp: 200, prereqs: ["q14"],
  artifact: { name: "Flywheel gauge card", description: "One spin reading, turned from rpm into radians per second." },
  sources: [source.s10_1, source.s10_3],
  teaching: {
   intuition: "A spinning wheel is easiest to describe by the angle it has turned through. That angle, measured in radians from a chosen starting line, is the wheel’s angular position θ. One full turn, a revolution, is 2π radians, because the rim of a circle of radius r is 2πr long and a radian is the angle whose arc is one radius long. The rate at which the angle changes is the angular velocity ω (the Greek letter omega), in radians per second: ω is the derivative of θ with respect to time. Gauges often read in revolutions per minute (rpm); to change to radians per second, multiply by 2π radians per turn and divide by 60 seconds per minute. Every point of a rigid wheel has the same ω, but a point further from the axle covers more ground each turn. A point at distance r moves along its circle at speed v = ωr, the arc length rθ covered per second.",
   steps: [
    "Change rpm to radians per second: ω = rpm × 2π ÷ 60.",
    "For a point at distance r from the axle, the speed along its circle is v = ωr.",
    "Turns per second are rpm ÷ 60; multiply by the time for the number of turns, and by 2π for the change in angular position in radians."
   ],
   example: {
    prompt: "A wheel spins at 120 rpm. A point on it is 0.5 m from the axle. Find ω, the point’s speed and the turns in 10 seconds.",
    steps: [
     "ω = 120 × 2π ÷ 60 = 4π ≈ 12.57 rad/s.",
     "v = ωr = 4π × 0.5 = 2π ≈ 6.28 m/s.",
     "Turns: 120 ÷ 60 = 2 per second, so 20 turns in 10 seconds."
    ],
    answer: "About 12.57 rad/s, 6.28 m/s, and 20 turns."
   },
   pitfalls: [
    "Dividing by 60 but forgetting the 2π, which gives turns per second instead of radians per second.",
    "Using the rounded ω to work out the speed, which can shift the last digit.",
    "Thinking points nearer the axle have a smaller ω: they share the same ω and only their speed is smaller."
   ]
  },
  guidance: [
   { prompt: "Turn 150 rpm into radians per second: multiply by 2π and divide by 60. What is ω, to 2 decimal places?", answer: [15.71], labels: ["angular velocity (rad/s)"], explanation: "150 × 2π ÷ 60 = 5π ≈ 15.71 rad/s." },
   { prompt: "The rim point is 0.4 m from the axle. What is its speed v = ωr, in m/s to 2 decimal places?", answer: [6.28], labels: ["rim speed (m/s)"], explanation: "v = 5π × 0.4 ≈ 6.28 m/s. Points nearer the axle have the same ω but move more slowly." },
   { prompt: "The flywheel makes 150 ÷ 60 turns each second. How many turns does it make in 12 s?", answer: [30], labels: ["turns"], explanation: "2.5 × 12 = 30 turns." }
  ]
 },
 {
  id: 'q36', title: "Weights on the energy wheel", topic: "Moment of inertia and rotational kinetic energy", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "The vault stores energy in a spinning frame of steel weights, and the crew wants to know how much it holds at its working speed.",
  lesson: "The moment of inertia I = Σmr² measures how hard a body is to spin; a spinning body has rotational kinetic energy ½Iω².",
  prompt: "To store energy, three steel weights are bolted to a light spoke frame that turns on the flywheel axle: 4 kg at 0.5 m from the axle, 6 kg at 0.8 m and 3 kg at 1.2 m. Treat each weight as a point and ignore the frame’s own mass. The frame spins at 10 rad/s. Enter the moment of inertia about the axle in kilogram square metres (kg·m²), then the rotational kinetic energy in joules (type the numbers without commas).",
  answer: [9.16, 458], labels: ["moment of inertia (kg·m²)","rotational kinetic energy (J)"], tolerance: 0.005,
  hints: [
   "The moment of inertia of point masses is I = Σmr²: square each distance from the axle before multiplying by its mass.",
   "The rotational kinetic energy is K = ½Iω², with ω in radians per second."
  ],
  solution: "I = 4 × 0.5² + 6 × 0.8² + 3 × 1.2² = 1 + 3.84 + 4.32 = 9.16 kg·m². K = ½ × 9.16 × 10² = 458 J.",
  xp: 200, prereqs: ["q35","q27"],
  artifact: { name: "Energy wheel tally", description: "Three weights, their moment of inertia, and the energy they hold spinning." },
  sources: [source.s10_4],
  teaching: {
   intuition: "Every piece of a spinning frame is moving, so the frame carries kinetic energy even though it stays in one place. A small weight at distance r from the axle moves at v = ωr, so its kinetic energy is ½m(ωr)² = ½(mr²)ω². Adding over all the weights gives ½(Σmr²)ω². The sum Σmr² is the moment of inertia I, measured in kilogram square metres (kg·m²). It plays the part for turning that mass plays for moving in a line: the larger I is, the harder the body is to start or stop spinning. Because the distance is squared, a weight twice as far from the axle counts four times as much. The energy of the spin, K = ½Iω², is the rotational kinetic energy, in joules, with ω in radians per second.",
   steps: [
    "For each point mass, square its distance from the axle and multiply by its mass: mr².",
    "Add these terms to get the moment of inertia I, in kg·m².",
    "Work out the rotational kinetic energy K = ½Iω², with ω in rad/s, in joules."
   ],
   example: {
    prompt: "A light rod carries 2 kg at 0.3 m from its axle and 5 kg at 0.6 m. It spins at 4 rad/s. Find I and the rotational kinetic energy.",
    steps: [
     "I = 2 × 0.3² + 5 × 0.6² = 0.18 + 1.8 = 1.98 kg·m².",
     "K = ½ × 1.98 × 4² = 15.84."
    ],
    answer: "1.98 kg·m² and 15.84 joules."
   },
   pitfalls: [
    "Multiplying each mass by its distance instead of by the square of its distance.",
    "Forgetting the ½ in ½Iω², or squaring I instead of ω.",
    "Using rpm instead of radians per second for ω."
   ]
  },
  guidance: [
   { prompt: "What does the first weight add to the moment of inertia, 4 × 0.5², in kg·m²?", answer: [1], labels: ["first term mr² (kg·m²)"], explanation: "0.5² = 0.25, and 4 × 0.25 = 1 kg·m²." },
   { prompt: "Add the three terms mr². What is the moment of inertia I, in kg·m²?", answer: [9.16], labels: ["moment of inertia (kg·m²)"], explanation: "1 + 3.84 + 4.32 = 9.16 kg·m²." },
   { prompt: "What is the rotational kinetic energy ½Iω² at 10 rad/s, in joules?", answer: [458], labels: ["rotational kinetic energy (J)"], explanation: "½ × 9.16 × 100 = 458 J." }
  ]
 },
 {
  id: 'q37', title: "Spanner on the flywheel hub", topic: "Torque and Newton’s second law for rotation, τ = Iα", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "A technician is starting a stopped flywheel by hand, and the vault log needs the turning effect of her pull and how fast the wheel picks up spin.",
  lesson: "Torque τ = rF sin θ is the turning effect of a force; the net torque equals the moment of inertia times the angular acceleration, τ = Iα.",
  prompt: "A technician turns a flywheel by pulling on a spanner clamped to its hub. She pulls with a force of 80 N at a point on the spanner 0.5 m from the axle, and the angle between the spanner and her pull is π/3 radians. The flywheel’s moment of inertia about the axle is 8 kg·m², and no other torque acts on it. Enter the torque about the axle in newton metres (N·m), then the flywheel’s angular acceleration in radians per second squared (rad/s²), both to 2 decimal places (use the unrounded torque for the second).",
  answer: [34.64, 4.33], labels: ["torque (N·m)","angular acceleration (rad/s²)"], tolerance: 0.005,
  hints: [
   "Torque is τ = rF sin θ, where θ is the angle between the line from the axle and the force. Only the part of the pull at right angles to the spanner turns it.",
   "Newton’s second law for rotation is τ = Iα, so α = τ ÷ I."
  ],
  solution: "The lever arm is r sin θ = 0.5 × sin(π/3) ≈ 0.43 m. The torque is τ = rF sin θ = 0.5 × 80 × sin(π/3) ≈ 34.64 N·m. Then α = τ ÷ I = τ ÷ 8 ≈ 4.33 rad/s².",
  xp: 200, prereqs: ["q36"],
  artifact: { name: "Hand-start record", description: "One pull on a spanner, its torque, and the spin-up it gave." },
  sources: [source.s10_6, source.s10_7],
  teaching: {
   intuition: "A force turns a wheel best when it pushes at right angles to the line from the axle, and far from the axle. Its turning effect is the torque τ (the Greek letter tau): τ = rF sin θ, where r is the distance from the axle to where the force acts and θ is the angle between that line and the force. The part r sin θ is the lever arm, the shortest distance from the axle to the line along which the force acts. A pull straight along the spanner has θ = 0, no lever arm and no torque; a pull at right angles, θ = π/2, has the most. Torque is measured in newton metres (N·m). Just as a net force gives a mass an acceleration, a net torque gives a body an angular acceleration α (alpha), the rate of change of ω, in rad/s²: Newton’s second law for rotation says τ = Iα.",
   steps: [
    "Find the lever arm: r sin θ, with θ the angle between the spanner (the line from the axle) and the force, in radians.",
    "Multiply by the force to get the torque: τ = rF sin θ, in N·m.",
    "Divide the net torque by the moment of inertia to get the angular acceleration: α = τ ÷ I, in rad/s²."
   ],
   example: {
    prompt: "A 50 N pull at right angles to a spanner, 0.4 m from the axle, turns a wheel with I = 5 kg·m². Find the torque and the angular acceleration.",
    steps: [
     "At right angles θ = π/2 and sin θ = 1, so τ = 0.4 × 50 × 1 = 20 N·m.",
     "α = τ ÷ I = 20 ÷ 5 = 4."
    ],
    answer: "20 N·m and 4 rad/s²."
   },
   pitfalls: [
    "Using cos θ instead of sin θ: the angle is measured between the spanner and the force.",
    "Setting a calculator to degrees while the angle is in radians.",
    "Multiplying the torque by I instead of dividing by it."
   ]
  },
  guidance: [
   { prompt: "What is the lever arm r sin θ, the distance from the axle to the line of the pull, in metres to 2 decimal places?", answer: [0.43], labels: ["lever arm (m)"], explanation: "0.5 × sin(π/3) ≈ 0.43 m." },
   { prompt: "Multiply the lever arm by the force. What is the torque, in N·m to 2 decimal places?", answer: [34.64], labels: ["torque (N·m)"], explanation: "τ = 0.5 × 80 × sin(π/3) ≈ 34.64 N·m." },
   { prompt: "Divide the torque by the moment of inertia, 8 kg·m². What is the angular acceleration, in rad/s² to 2 decimal places?", answer: [4.33], labels: ["angular acceleration (rad/s²)"], explanation: "α = τ ÷ I = τ ÷ 8 ≈ 4.33 rad/s²." }
  ]
 },
 {
  id: 'q38', title: "Coupling the two wheels", topic: "Conservation of angular momentum", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "A second wheel is being dropped onto a spinning flywheel to share its load, and the vault needs the speed they settle at and the energy the coupling costs.",
  lesson: "Angular momentum L = Iω stays the same when no outside torque acts, so a larger moment of inertia means a smaller angular velocity.",
  prompt: "Flywheel A, with moment of inertia 15 kg·m², spins freely at 40 rad/s. Wheel B, with moment of inertia 7 kg·m² and not turning, is dropped onto the same axle. Friction between the two makes them lock together and spin as one, and no outside torque acts about the axle. Enter the angular momentum of A before the drop in kg·m²/s, then the common angular velocity afterwards in rad/s, then the rotational kinetic energy lost in joules; give the last two to 2 decimal places (use the unrounded angular velocity for the energy) and type the numbers without commas.",
  answer: [600, 27.27, 3818.18], labels: ["angular momentum (kg·m²/s)","common angular velocity (rad/s)","energy lost (J)"], tolerance: 0.005,
  hints: [
   "Angular momentum is L = Iω. With no outside torque, the total angular momentum before equals the total after.",
   "Locked together, the two wheels have a moment of inertia equal to the sum of theirs. Compare ½Iω² before and after for the energy."
  ],
  solution: "L = 15 × 40 = 600 kg·m²/s, and B has none. Locked together, I = 15 + 7 = 22 kg·m², so ω = 600 ÷ 22 ≈ 27.27 rad/s. Kinetic energy before: ½ × 15 × 40² = 12000 J. After: ½ × 22 × ω² = 600² ÷ (2 × 22) ≈ 8181.82 J. Lost: 12000 − 8181.82 = 3818.18 J, turned into heat by the friction between the wheels.",
  xp: 200, prereqs: ["q37"],
  artifact: { name: "Coupling report", description: "Two wheels locked on one axle: the spin they share and the energy it cost." },
  sources: [source.s11_3],
  teaching: {
   intuition: "A spinning body has angular momentum L = Iω, measured in kg·m²/s. It is the turning partner of ordinary momentum, mass times velocity: only an outside torque can change it, just as only an outside force can change a moving body’s momentum. So when no outside torque acts, the total angular momentum stays the same: I₁ω₁ = I₂ω₂. If the moment of inertia grows, the angular velocity must drop to keep the product fixed. This is what happens when a resting wheel is dropped onto a spinning one: friction between them is an inside torque, so it shares the spin out but does not change the total, and the pair ends up turning more slowly. A skater pulling in her arms is the same rule in reverse: smaller I, faster spin. Rotational kinetic energy is not kept in the wheel coupling: some of it is turned into heat by the friction between the wheels.",
   steps: [
    "Work out the angular momentum before: L = Iω for each spinning body, added.",
    "Work out the moment of inertia afterwards (for wheels locked on one axle, add their moments of inertia).",
    "With no outside torque, L is the same after: ω after = L ÷ I after.",
    "For the energy, compare ½Iω² before and after."
   ],
   example: {
    prompt: "A wheel with I = 10 kg·m² spins at 20 rad/s. A resting wheel with I = 10 kg·m² is locked onto it. Find the new angular velocity and the energy lost.",
    steps: [
     "L = 10 × 20 = 200 kg·m²/s. After locking I = 20 kg·m², so ω = 200 ÷ 20 = 10 rad/s.",
     "Before: ½ × 10 × 20² = 2000 J. After: ½ × 20 × 10² = 1000 J.",
     "Lost: 2000 − 1000 = 1000 J."
    ],
    answer: "10 rad/s, and 1000 joules lost."
   },
   pitfalls: [
    "Keeping the kinetic energy the same instead of the angular momentum.",
    "Forgetting to add the second wheel’s moment of inertia after they lock.",
    "Rounding the new angular velocity before working out the energy."
   ]
  },
  guidance: [
   { prompt: "What is the angular momentum of flywheel A before the drop, in kg·m²/s?", answer: [600], labels: ["angular momentum (kg·m²/s)"], explanation: "L = Iω = 15 × 40 = 600 kg·m²/s." },
   { prompt: "What is the moment of inertia of the two wheels locked together, in kg·m²?", answer: [22], labels: ["moment of inertia after (kg·m²)"], explanation: "15 + 7 = 22 kg·m²." },
   { prompt: "Angular momentum is kept. What is the common angular velocity, in rad/s to 2 decimal places?", answer: [27.27], labels: ["common angular velocity (rad/s)"], explanation: "ω = 600 ÷ 22 ≈ 27.27 rad/s." },
   { prompt: "Rotational kinetic energy before is ½ × 15 × 40². How much is lost, in joules to 2 decimal places?", answer: [3818.18], labels: ["energy lost (J)"], explanation: "12000 J before and 600² ÷ (2 × 22) ≈ 8181.82 J after, so about 3818.18 J is lost." }
  ]
 },
 {
  id: 'q39', title: "Timing the survey satellite", topic: "Universal gravitation and circular orbits", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "A survey satellite is going up, and the tracking crew needs its speed and how often it will pass overhead.",
  lesson: "Two masses attract with force Gm₁m₂ ÷ r²; in a circular orbit gravity supplies the centripetal force, so v = √(GM ÷ r).",
  prompt: "A survey satellite circles the outpost’s planet in a circular orbit. The planet has mass 6 × 10²⁴ kg and radius 6400 km, and the satellite flies 400 km above the surface. Take G = 6.67 × 10⁻¹¹ N·m²/kg², and measure the orbit’s radius r from the planet’s centre. Enter the orbital speed in metres per second, to the nearest whole number, then the orbital period in minutes, to 2 decimal places (use the unrounded speed for the period; type the numbers without commas).",
  answer: [7672, 92.82], labels: ["orbital speed (m/s)","orbital period (minutes)"], tolerance: 0.005,
  hints: [
   "Gravity, GMm ÷ r², supplies the centripetal force mv² ÷ r, so v = √(GM ÷ r), with r in metres.",
   "The period is the time for one lap of the circle: T = 2πr ÷ v in seconds; divide by 60 for minutes."
  ],
  solution: "r = 6400 km + 400 km = 6800 km = 6800 × 1000 m. GM = 6.67 × 10⁻¹¹ × 6 × 10²⁴ = 40.02 × 10¹³ m³/s². v = √(GM ÷ r) ≈ 7671.6 m/s, which is 7672 m/s to the nearest whole number. T = 2πr ÷ v ≈ 5569.4 s, and dividing by 60 gives about 92.82 minutes.",
  xp: 200, prereqs: ["q24"],
  artifact: { name: "Orbit timetable", description: "One satellite’s speed and the minutes it takes to go once round." },
  sources: [source.s13_1, source.s13_4],
  teaching: {
   intuition: "Every two masses pull on each other. Newton’s law of universal gravitation says the force is F = Gm₁m₂ ÷ r², where r is the distance between their centres and G is the gravitational constant, 6.67 × 10⁻¹¹ N·m²/kg². G is tiny, so the pull is only noticeable when one mass is as large as a planet. A satellite in orbit is falling towards the planet all the time, but it moves sideways so fast that the ground curves away beneath it just as quickly. In a circular orbit the planet’s pull is the centripetal force that keeps the satellite on its circle: GMm ÷ r² = mv² ÷ r, where M is the planet’s mass and m the satellite’s. The m cancels, so the orbital speed is v = √(GM ÷ r) for any satellite at that radius. The time for one lap, the period, is the length of the circle divided by the speed: T = 2πr ÷ v. Here r is measured from the planet’s centre, so add the planet’s radius to the height above the ground.",
   steps: [
    "Find the orbit’s radius from the planet’s centre: planet radius plus height, in metres.",
    "Work out GM, the gravitational constant times the planet’s mass.",
    "The orbital speed is v = √(GM ÷ r).",
    "The period is T = 2πr ÷ v in seconds; divide by 60 for minutes."
   ],
   example: {
    prompt: "A moon has GM = 4 × 10¹² m³/s². A probe orbits it at r = 1000 km from its centre. Find the orbital speed and the period.",
    steps: [
     "r = 1000 km = 1 × 10⁶ m.",
     "v = √(4 × 10¹² ÷ 10⁶) = √(4 × 10⁶) = 2000 m/s.",
     "T = 2π × 10⁶ ÷ 2000 = 1000π ≈ 3141.6 s, which is about 52.36 minutes."
    ],
    answer: "2000 metres per second, and about 52.36 minutes."
   },
   pitfalls: [
    "Using the height above the ground as r instead of the distance from the planet’s centre.",
    "Leaving r in kilometres while G is in metres.",
    "Giving the period in seconds when minutes are asked for."
   ]
  },
  guidance: [
   { prompt: "The orbit’s radius is measured from the planet’s centre. What is r, in kilometres?", answer: [6800], labels: ["orbit radius (km)"], explanation: "r = 6400 + 400 = 6800 km, which is 6800 × 1000 m for the formula." },
   { prompt: "Gravity supplies the centripetal force, so v = √(GM ÷ r) with r in metres. What is the orbital speed, in m/s to the nearest whole number?", answer: [7672], labels: ["orbital speed (m/s)"], explanation: "GM = 40.02 × 10¹³ m³/s², and √(GM ÷ r) ≈ 7671.6, so v ≈ 7672 m/s." },
   { prompt: "One lap is 2πr long. What is the period T = 2πr ÷ v, in minutes to 2 decimal places?", answer: [92.82], labels: ["orbital period (minutes)"], explanation: "2πr ÷ v ≈ 5569.4 s, and ÷ 60 gives about 92.82 minutes." }
  ]
 },
 {
  id: 'q40', title: "Collision on the docking floor", topic: "Realm review: a two-dimensional collision then a climb", tier: 'Advanced', sector: 'Flywheel Vault',
  brief: "Two modules crossing the floor at right angles are going to latch, and the crew must know whether the joined pair can coast up the ramp to the upper deck.",
  lesson: "In two dimensions momentum is conserved in x and in y separately; after the collision, energy conservation tells how high the pair can climb.",
  prompt: "On the docking floor, module A (400 kg) slides east at 3 m/s and module B (100 kg) slides north at 6 m/s. Take east as the x direction and north as the y direction. They meet, latch together and slide on as one, with no outside force along the floor. The pair then coasts up a frictionless ramp until it stops. Take g = 9.8 m/s². Enter the speed of the pair just after latching in metres per second, then the height it climbs in metres, both to 2 decimal places (use the unrounded speed for the height).",
  answer: [2.68, 0.37], labels: ["speed after latching (m/s)","height climbed (m)"], tolerance: 0.005,
  hints: [
   "Momentum is kept in each direction separately: the x momentum of A alone becomes the x momentum of the pair, and the y momentum of B alone becomes its y momentum.",
   "The speed is √(vx² + vy²). On the frictionless ramp all the kinetic energy becomes potential energy, so ½Mv² = Mgh."
  ],
  solution: "In x: 400 × 3 = 1200 kg·m/s, so vx = 1200 ÷ 500 = 2.4 m/s. In y: 100 × 6 = 600 kg·m/s, so vy = 600 ÷ 500 = 1.2 m/s. The speed is √(2.4² + 1.2²) = √7.2 ≈ 2.68 m/s. On the ramp ½Mv² = Mgh, so h = v² ÷ (2 × 9.8) = 7.2 ÷ 19.6 ≈ 0.37 m.",
  xp: 200, prereqs: ["q33","q31"],
  artifact: { name: "Proving Ground master log", description: "A crossing collision and a climb: momentum, vectors and energy in one run." },
  sources: [source.s9_5, source.s8_3],
  teaching: {
   intuition: "This review joins three ideas from the realm. Momentum is a vector, so when bodies collide on a floor it is conserved in each direction separately: the total x momentum before equals the total x momentum after, and the same for y. If two modules latch together, the joined pair’s velocity components are vx = (total x momentum) ÷ M and vy = (total y momentum) ÷ M, with M the joined mass. Its speed is the size of that velocity vector, √(vx² + vy²). After the collision, the pair coasting up a frictionless ramp keeps its mechanical energy: its kinetic energy ½Mv² turns into potential energy Mgh, so the height it climbs is h = v² ÷ 2g, whatever its mass. These same rules, applied to many small pieces pushing on their neighbours, are what make ripples travel, which is where the next realm, Waves, begins.",
   steps: [
    "Choose x and y directions. Write each body’s momentum components.",
    "Add the x components and divide by the joined mass for vx; do the same for vy.",
    "Find the speed: √(vx² + vy²).",
    "Use conservation of mechanical energy for the climb: h = v² ÷ (2g), rounding only at the end."
   ],
   example: {
    prompt: "A 200 kg module moving east at 3 m/s latches onto a 200 kg module moving north at 4 m/s. How fast does the pair move, and how high can it coast up a frictionless ramp? Take g = 9.8 m/s².",
    steps: [
     "vx = 200 × 3 ÷ 400 = 1.5 m/s and vy = 200 × 4 ÷ 400 = 2 m/s.",
     "Speed: √(1.5² + 2²) = √6.25 = 2.5 m/s.",
     "Height: 2.5² ÷ 19.6 = 6.25 ÷ 19.6 ≈ 0.32."
    ],
    answer: "2.5 metres per second, and about 0.32 metres."
   },
   pitfalls: [
    "Adding the two speeds as plain numbers, as if the modules moved along one line.",
    "Using each module’s own mass instead of the joined mass when dividing.",
    "Rounding the speed before working out the height."
   ]
  },
  guidance: [
   { prompt: "Only A moves in the x direction before the collision. What is the pair’s velocity component vx just after latching, in m/s?", answer: [2.4], labels: ["vx (m/s)"], explanation: "vx = 400 × 3 ÷ 500 = 1200 ÷ 500 = 2.4 m/s." },
   { prompt: "Only B moves in the y direction. What is the pair’s velocity component vy, in m/s?", answer: [1.2], labels: ["vy (m/s)"], explanation: "vy = 100 × 6 ÷ 500 = 600 ÷ 500 = 1.2 m/s." },
   { prompt: "Combine the two components. What is the speed of the pair, in m/s to 2 decimal places?", answer: [2.68], labels: ["speed after latching (m/s)"], explanation: "√(2.4² + 1.2²) = √7.2 ≈ 2.68 m/s." },
   { prompt: "All of the pair’s kinetic energy becomes potential energy on the frictionless ramp. What height does it climb, in metres to 2 decimal places?", answer: [0.37], labels: ["height climbed (m)"], explanation: "½Mv² = Mgh, so h = v² ÷ 19.6 = 7.2 ÷ 19.6 ≈ 0.37 m." }
  ]
 }
);
})();
