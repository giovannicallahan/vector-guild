/* Electricity and magnetism: fields missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/em/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Magnetism · Advanced, 200 XP · sector 'Ore Sorter' · Circular orbits in a magnetic field: radius and period [11.3]
     q32  ch 6 Magnetism · Advanced, 200 XP · sector 'Ore Sorter' · Force on a current-carrying wire, F = ILB sin θ [11.4]
     q33  ch 6 Magnetism · Advanced, 200 XP · sector 'Ore Sorter' · Field of a long straight wire, and force between parallel wires [12.2, 12.3]
     q34  ch 6 Magnetism · Advanced, 200 XP · sector 'Ore Sorter' · Ampère's law (the line integral ∮B·dl) and the field inside a solenoid [12.5, 12.6]
     q35  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · Magnetic flux and Faraday's law, with Lenz's law for direction [13.1]
     q36  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · Motional emf and the generator, peak emf NBAω [13.3, 13.6]
     q37  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · Inductance, energy in an inductor and the RL time constant [14.2, 14.3, 14.4]
     q38  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · Alternating current: peak, rms and reactance [15.1, 15.2, 15.4]
     q39  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · RLC series circuit: impedance and resonance [15.3, 15.5]
     q40  ch 7 Induction and light · Advanced, 200 XP · sector 'Generator Station' · Electromagnetic waves: c = fλ and E = cB; realm review and bridge to Waves [16.2, 16.5] */
(function(){
'use strict';
/* OpenStax University Physics Volume 2 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 2 — 5.3 Coulomb's Law
   Link to the section page itself: https://openstax.org/books/university-physics-volume-2/pages/<section-slug> */
const source = {
 s11_3: { title: "OpenStax University Physics Volume 2 — 11.3 Motion of a Charged Particle in a Magnetic Field", url: "https://openstax.org/books/university-physics-volume-2/pages/11-3-motion-of-a-charged-particle-in-a-magnetic-field", description: "A charge moving at right angles to a uniform field moves in a circle with r = mv/(qB) and period T = 2πm/(qB); the force does no work.", verified: '2026-11-28' },
 s11_4: { title: "OpenStax University Physics Volume 2 — 11.4 Magnetic Force on a Current-Carrying Conductor", url: "https://openstax.org/books/university-physics-volume-2/pages/11-4-magnetic-force-on-a-current-carrying-conductor", description: "The force on a straight wire in a uniform field, F = IlB sin θ, largest when the current is at right angles to the field.", verified: '2026-11-28' },
 s12_2: { title: "OpenStax University Physics Volume 2 — 12.2 Magnetic Field Due to a Thin Straight Wire", url: "https://openstax.org/books/university-physics-volume-2/pages/12-2-magnetic-field-due-to-a-thin-straight-wire", description: "The field of a long straight wire, B = μ₀I/(2πR), with μ₀ = 4π × 10⁻⁷ T·m/A, in circles round the wire.", verified: '2026-11-28' },
 s12_3: { title: "OpenStax University Physics Volume 2 — 12.3 Magnetic Force between Two Parallel Currents", url: "https://openstax.org/books/university-physics-volume-2/pages/12-3-magnetic-force-between-two-parallel-currents", description: "The force per length between parallel wires, μ₀I₁I₂/(2πr): attraction for currents in the same direction, repulsion for opposite ones.", verified: '2026-11-28' },
 s12_5: { title: "OpenStax University Physics Volume 2 — 12.5 Ampère's Law", url: "https://openstax.org/books/university-physics-volume-2/pages/12-5-amperes-law", description: "Ampère's law, ∮B·dl = μ₀I for the current through the closed path, used for the field of a long wire.", verified: '2026-11-28' },
 s12_6: { title: "OpenStax University Physics Volume 2 — 12.6 Solenoids and Toroids", url: "https://openstax.org/books/university-physics-volume-2/pages/12-6-solenoids-and-toroids", description: "The field inside a long solenoid, B = μ₀nI with n turns per unit length, found quickly with Ampère's law.", verified: '2026-11-28' },
 s13_1: { title: "OpenStax University Physics Volume 2 — 13.1 Faraday's Law", url: "https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law", description: "Magnetic flux, the weber (1 Wb = 1 T·m²), and Faraday's law ε = −N dΦ/dt for a coil of N turns.", verified: '2026-11-28' },
 s13_2: { title: "OpenStax University Physics Volume 2 — 13.2 Lenz's Law", url: "https://openstax.org/books/university-physics-volume-2/pages/13-2-lenzs-law", description: "Lenz's law: the induced emf drives a current that opposes the change in magnetic flux that causes it.", verified: '2026-11-28' },
 s13_3: { title: "OpenStax University Physics Volume 2 — 13.3 Motional Emf", url: "https://openstax.org/books/university-physics-volume-2/pages/13-3-motional-emf", description: "The emf Blv of a rod moving on rails through a field, and the emf of a rotating coil, with peak NBAω.", verified: '2026-11-28' },
 s13_6: { title: "OpenStax University Physics Volume 2 — 13.6 Electric Generators and Back Emf", url: "https://openstax.org/books/university-physics-volume-2/pages/13-6-electric-generators-and-back-emf", description: "Generators: a coil turning in a field gives ε = NBAω sin ωt with peak NBAω, and f = ω/2π.", verified: '2026-11-28' },
 s14_2: { title: "OpenStax University Physics Volume 2 — 14.2 Self-Inductance and Inductors", url: "https://openstax.org/books/university-physics-volume-2/pages/14-2-self-inductance-and-inductors", description: "Self-inductance L, the induced emf ε = −L dI/dt, and inductance in henries.", verified: '2026-11-28' },
 s14_3: { title: "OpenStax University Physics Volume 2 — 14.3 Energy in a Magnetic Field", url: "https://openstax.org/books/university-physics-volume-2/pages/14-3-energy-in-a-magnetic-field", description: "The energy stored in an inductor, U = ½LI², and the energy density of a magnetic field.", verified: '2026-11-28' },
 s14_4: { title: "OpenStax University Physics Volume 2 — 14.4 RL Circuits", url: "https://openstax.org/books/university-physics-volume-2/pages/14-4-rl-circuits", description: "The growing current I(t) = (ε/R)(1 − e^(−t/τ)) in an RL circuit, with time constant τ = L/R.", verified: '2026-11-28' },
 s15_1: { title: "OpenStax University Physics Volume 2 — 15.1 AC Sources", url: "https://openstax.org/books/university-physics-volume-2/pages/15-1-ac-sources", description: "Alternating voltage v = V₀ sin ωt with peak V₀ and angular frequency ω.", verified: '2026-11-28' },
 s15_2: { title: "OpenStax University Physics Volume 2 — 15.2 Simple AC Circuits", url: "https://openstax.org/books/university-physics-volume-2/pages/15-2-simple-ac-circuits", description: "Reactance of an inductor, X_L = ωL, and of a capacitor, X_C = 1/(ωC), with peak current I₀ = V₀/X.", verified: '2026-11-28' },
 s15_4: { title: "OpenStax University Physics Volume 2 — 15.4 Power in an AC Circuit", url: "https://openstax.org/books/university-physics-volume-2/pages/15-4-power-in-an-ac-circuit", description: "Rms values, I_rms = I₀/√2 and V_rms = V₀/√2, and the average power of an ac circuit.", verified: '2026-11-28' },
 s15_3: { title: "OpenStax University Physics Volume 2 — 15.3 RLC Series Circuits with AC", url: "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac", description: "The impedance of a series RLC circuit, Z = √(R² + (X_L − X_C)²), and the peak current I₀ = V₀/Z.", verified: '2026-11-28' },
 s15_5: { title: "OpenStax University Physics Volume 2 — 15.5 Resonance in an AC Circuit", url: "https://openstax.org/books/university-physics-volume-2/pages/15-5-resonance-in-an-ac-circuit", description: "Resonance at ω₀ = 1/√(LC), f₀ = 1/(2π√(LC)), where the impedance is just R.", verified: '2026-11-28' },
 s16_2: { title: "OpenStax University Physics Volume 2 — 16.2 Plane Electromagnetic Waves", url: "https://openstax.org/books/university-physics-volume-2/pages/16-2-plane-electromagnetic-waves", description: "Plane electromagnetic waves travel at c = 1/√(ε₀μ₀) ≈ 3.00 × 10⁸ m/s, with E = cB and c = fλ.", verified: '2026-11-28' },
 s16_5: { title: "OpenStax University Physics Volume 2 — 16.5 The Electromagnetic Spectrum", url: "https://openstax.org/books/university-physics-volume-2/pages/16-5-the-electromagnetic-spectrum", description: "The electromagnetic spectrum from radio waves (longer than about 0.1 m) through visible light to gamma rays, with c = fλ.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "Steering ore round the magnet box", topic: "Circular orbits in a magnetic field: radius and period", tier: 'Advanced', sector: 'Ore Sorter',
  brief: "The sorter separates ore by bending charged fragments in a magnet box, and we need to know how wide each one swings and how long one loop takes.",
  lesson: "A charge moving at right angles to a uniform magnetic field moves in a circle of radius r = mv/(qB), and its period T = 2πm/(qB) does not depend on its speed.",
  prompt: "The ore sorter fires ionised ore fragments into a magnet box. One fragment is a proton, with mass 1.67 × 10⁻²⁷ kg and charge e = 1.60 × 10⁻¹⁹ C. It enters at 3 × 10⁵ m/s, at right angles to a uniform magnetic field of 0.2 T, and the magnetic force bends its path into a circle. Enter the radius of the circle in millimetres (mm), then the time for one full circle, the cyclotron period, in nanoseconds (ns, 1 ns = 10⁻⁹ s). Give each to 2 decimal places and type numbers without commas.",
  answer: [15.66,327.9], labels: ["radius (mm)","cyclotron period (ns)"], tolerance: 0.005,
  hints: [
   "The magnetic force qvB is the centripetal force mv²/r that keeps the particle on its circle. Solve qvB = mv²/r for the radius r.",
   "The period is the circumference 2πr divided by the speed v. That gives T = 2πm/(qB): the speed cancels out."
  ],
  solution: "The velocity is at right angles to the field, so the magnetic force has size qvB, and it supplies the centripetal force: qvB = mv²/r, so r = mv/(qB) = (1.67 × 10⁻²⁷ × 3 × 10⁵) ÷ (1.60 × 10⁻¹⁹ × 0.2) m ≈ 15.6563 mm, which is 15.66 mm to 2 decimal places. One circle is 2πr ≈ 98.3711 mm long, and the particle covers it at 3 × 10⁵ m/s, so the cyclotron period is T = 2πr/v = 2πm/(qB) ≈ 327.9037 ns, which is 327.90 ns to 2 decimal places.",
  xp: 200, prereqs: ["q30"],
  artifact: { name: "Sorter orbit gauge", description: "A dial that reads how wide a charged fragment swings in the magnet box." },
  sources: [source.s11_3],
  teaching: {
   intuition: "In the last mission you met the magnetic force on a moving charge, F = qvB sin θ, and saw that it always pushes at right angles to the motion. A force that always pushes sideways never speeds a particle up or slows it down; it only turns it. So a charge fired at right angles to a uniform field (sin θ = 1) is turned by the same amount all the time and runs round a circle. From Mechanics, keeping a mass m on a circle of radius r at speed v needs a centripetal force mv²/r. Here the magnetic force qvB is that force: qvB = mv²/r, so r = mv/(qB). Heavier or faster particles swing wider; more charge or a stronger field pulls the circle tighter. The time for one full circle is the distance 2πr divided by the speed: T = 2πr/v = 2πm/(qB). The speed has cancelled, so every particle of the same kind in the same field takes the same time per loop, however fast it goes. This time is called the cyclotron period. Small times are given in nanoseconds: 1 ns = 10⁻⁹ s.",
   steps: [
    "Check that the velocity is at right angles to the field, so the magnetic force has size qvB.",
    "Set qvB equal to the centripetal force mv²/r and solve: r = mv/(qB). Convert metres to the unit asked for.",
    "Find the cyclotron period from T = 2πr/v, or straight from T = 2πm/(qB).",
    "Round only at the end, to the places the question asks for."
   ],
   example: {
    prompt: "An electron (mass 9.11 × 10⁻³¹ kg, charge of size 1.60 × 10⁻¹⁹ C) moves at 1.0 × 10⁶ m/s at right angles to a field of 0.01 T. Find the radius of its circle in millimetres and its period in nanoseconds.",
    steps: [
     "r = mv/(qB) = (9.11 × 10⁻³¹ × 1.0 × 10⁶) ÷ (1.60 × 10⁻¹⁹ × 0.01) m ≈ 5.69 × 10⁻⁴ m, which is about 0.57 mm.",
     "T = 2πm/(qB) = 2π × 9.11 × 10⁻³¹ ÷ (1.60 × 10⁻²¹) s ≈ 3.58 × 10⁻⁹ s, which is about 3.58 ns."
    ],
    answer: "About 0.57 mm and 3.58 ns."
   },
   pitfalls: [
    "Leaving the radius in metres when the question asks for millimetres: multiply by 1000.",
    "Thinking a faster particle takes longer per loop. Its circle is bigger, but it covers it faster, and the period stays 2πm/(qB).",
    "Forgetting that an alpha particle has charge 2e, not e."
   ]
  },
  guidance: [
   { prompt: "Set the magnetic force qvB equal to the centripetal force mv²/r and solve for r. For the proton at 3 × 10⁵ m/s in 0.2 T, what is the radius in millimetres, to 2 decimal places?", answer: [15.66], labels: ["radius (mm)"], explanation: "r = mv/(qB) = (1.67 × 10⁻²⁷ × 3 × 10⁵) ÷ (1.60 × 10⁻¹⁹ × 0.2) m ≈ 15.6563 mm." },
   { prompt: "One trip round the circle is its circumference, 2πr. Using the unrounded radius, how long is it, in millimetres, to 2 decimal places?", answer: [98.37], labels: ["circumference (mm)"], explanation: "2π × 15.6563 mm ≈ 98.3711 mm." },
   { prompt: "The particle covers that distance at 3 × 10⁵ m/s. What is the cyclotron period in nanoseconds, to 2 decimal places?", answer: [327.9], labels: ["cyclotron period (ns)"], explanation: "T = 2πr/v ≈ 327.9037 ns. The same comes from T = 2πm/(qB), which has no v in it: a faster particle runs a bigger circle in the same time." }
  ]
 },
 {
  id: 'q32', title: "The lifting magnet bar", topic: "Force on a current-carrying wire, F = ILB sin θ", tier: 'Advanced', sector: 'Ore Sorter',
  brief: "The lifting magnet pulls on a copper bar carrying current, and we must know the push it gets at its working angle and at its strongest.",
  lesson: "A straight wire of length L carrying current I in a uniform field B feels a force of size ILB sin θ, where θ is the angle between the current and the field.",
  prompt: "A straight copper bar in the ore sorter's lifting magnet is 1.5 m long. A 24 V supply drives a current through it, and the bar's circuit has a total resistance of 4 Ω. The bar lies in a uniform magnetic field of 0.3 T, with an angle of π/6 radians between the current and the field. Enter the current in amperes (A), then the size of the magnetic force on the bar in newtons (N), then the size of the force in newtons if the bar were turned to lie at right angles to the field. Give the forces to 2 decimal places.",
  answer: [6,1.35,2.7], labels: ["current (A)","force (N)","force at right angles (N)"], tolerance: 0.005,
  hints: [
   "Ohm's law gives the current: I = V/R.",
   "The force on a straight wire in a uniform field has size F = ILB sin θ, where θ is the angle between the current and the field. At right angles sin θ = 1, which gives the largest force."
  ],
  solution: "Ohm's law: I = V/R = 24 ÷ 4 = 6 A. The force has size F = ILB sin θ = 6 × 1.5 × 0.3 × sin(π/6) = 2.7 × sin(π/6) = 1.35 N. At right angles sin θ = 1, so the force would be ILB = 2.7 N.",
  xp: 200, prereqs: ["q30","q25"],
  artifact: { name: "Bar-force gauge", description: "A meter that reads the push a magnet gives a current-carrying bar." },
  sources: [source.s11_4],
  teaching: {
   intuition: "A current is charge on the move, and the last missions showed that a moving charge in a magnetic field feels a force qvB sin θ. Inside a wire, every moving charge feels this push, and the wire carries them along, so the whole wire is pushed. Add up the pushes on all the charges in a straight length L of wire carrying current I, and the total is F = ILB sin θ, where B is the field in tesla and θ is the angle between the direction of the current and the field. The force is largest, ILB, when the wire lies at right angles to the field (θ = π/2, sin θ = 1). It is zero when the wire lies along the field (θ = 0). Its direction is at right angles to both the wire and the field, given by the right-hand rule you used for a single charge, with your fingers along the current. The current itself often comes from Ohm's law, I = V/R. Angles here are in radians.",
   steps: [
    "Find the current, for example with Ohm's law I = V/R.",
    "Find the angle θ between the current and the field, in radians, and its sine.",
    "Multiply: F = ILB sin θ, with L in metres and B in tesla, gives newtons.",
    "For the largest possible force, use sin θ = 1: F = ILB."
   ],
   example: {
    prompt: "A 2 m wire carries 5 A at right angles to a 0.1 T field. Find the force on it, then the force if it is turned to an angle of π/6 to the field.",
    steps: [
     "At right angles, F = ILB = 5 × 2 × 0.1 = 1 N.",
     "At π/6, sin(π/6) = 0.5, so F = 1 × 0.5 = 0.5 N."
    ],
    answer: "1 N at right angles, 0.5 N at π/6."
   },
   pitfalls: [
    "Using the angle between the wire and something else (the floor, the magnet face) instead of the angle between the current and the field.",
    "Leaving the calculator in degrees when the angle is given in radians.",
    "Forgetting sin θ, which gives the right-angle force ILB whatever the angle."
   ]
  },
  guidance: [
   { prompt: "The supply is 24 V and the resistance 4 Ω. What current flows, in amperes?", answer: [6], labels: ["current (A)"], explanation: "I = V/R = 24 ÷ 4 = 6 A." },
   { prompt: "Use F = ILB sin θ with θ = π/6. What is the size of the force on the bar, in newtons, to 2 decimal places?", answer: [1.35], labels: ["force (N)"], explanation: "sin(π/6) = 0.5, so F = 6 × 1.5 × 0.3 × sin(π/6) = 1.35 N." },
   { prompt: "Now the bar lies at right angles to the field, so θ = π/2. What is the force, in newtons, to 2 decimal places?", answer: [2.7], labels: ["force at right angles (N)"], explanation: "sin(π/2) = 1, so F = ILB = 6 × 1.5 × 0.3 = 2.7 N, the largest force this bar can feel in this field." }
  ]
 },
 {
  id: 'q33', title: "Two cables side by side", topic: "Field of a long straight wire, and force between parallel wires", tier: 'Advanced', sector: 'Ore Sorter',
  brief: "Two heavy feed cables run side by side to the coils, and we must know whether they tug together or apart, and how hard.",
  lesson: "A long straight wire makes a field B = μ₀I/(2πr) in circles round it; a parallel wire carrying I₂ feels a force per metre I₂B, attracting for currents the same way and repelling for opposite ones.",
  prompt: "Two long, straight cables feed the ore sorter's coils. They run parallel, 8 cm apart. The first carries 30 A and the second 20 A, in opposite directions. Take μ₀ = 4π × 10⁻⁷ T·m/A. Enter the size of the magnetic field the first cable makes at the second, in microtesla (μT, 1 μT = 10⁻⁶ T); then the size of the force on each metre of the second cable, in micronewtons per metre (μN/m, 1 μN = 10⁻⁶ N); then 1 if the cables pull towards each other or −1 if they push apart. Round the field and the force to 2 decimal places and type numbers without commas.",
  answer: [75,1500,-1], labels: ["field (μT)","force per metre (μN/m)","attract 1, repel −1"], tolerance: 0.005,
  hints: [
   "A long straight wire carrying a current I makes a field of size B = μ₀I/(2πr) at a distance r from it. With μ₀ = 4π × 10⁻⁷ T·m/A, μ₀/(2π) = 2 × 10⁻⁷ T·m/A.",
   "The second cable's current is at right angles to that field, so a length L of it feels F = I₂LB, and the force per metre is F/L = I₂B. Parallel currents in the same direction attract; in opposite directions they repel."
  ],
  solution: "The gap is 8 cm = 0.08 m. The first cable's field there is B = μ₀I₁/(2πr) = 2 × 10⁻⁷ × 30 ÷ 0.08 T = 75 μT. Each metre of the second cable feels F/L = I₂B = 20 × 75 μN/m = 1500 μN/m. The currents run opposite ways, so the cables repel: −1.",
  xp: 200, prereqs: ["q32"],
  artifact: { name: "Cable spacer", description: "A clamp sized to hold two current-carrying cables against their magnetic pull." },
  sources: [source.s12_2, source.s12_3],
  teaching: {
   intuition: "So far magnets made the fields. Currents make them too. A long straight wire carrying a current I is surrounded by a magnetic field whose lines are circles round the wire. Point your right thumb along the current and your fingers curl the way the field goes. At a distance r from the wire the field has size B = μ₀I/(2πr). The constant μ₀ is the permeability of free space, μ₀ = 4π × 10⁻⁷ T·m/A, so μ₀/(2π) = 2 × 10⁻⁷ T·m/A and B = 2 × 10⁻⁷ × I/r tesla. The field is proportional to the current and falls off as you move away. Now put a second long wire, carrying I₂, parallel to the first at a distance r. It sits in the first wire's field, at right angles to it, so by the last mission each length L of it feels a force F = I₂LB. The force on each metre is F/L = I₂B = μ₀I₁I₂/(2πr). Using the right-hand rules, the two wires pull towards each other when their currents run the same way and push apart when they run opposite ways. These fields are tiny, so we use microtesla (1 μT = 10⁻⁶ T) and micronewtons (1 μN = 10⁻⁶ N).",
   steps: [
    "Convert the distance to metres.",
    "Find the first wire's field at the second: B = μ₀I₁/(2πr) = 2 × 10⁻⁷ × I₁/r tesla.",
    "Multiply by the second current for the force per metre: F/L = I₂B.",
    "Currents the same way attract; opposite ways repel."
   ],
   example: {
    prompt: "A wire carries 10 A. Find its field 2 cm away, in μT, then the force per metre on a parallel wire there carrying 5 A the same way.",
    steps: [
     "B = 2 × 10⁻⁷ × 10 ÷ 0.02 = 1 × 10⁻⁴ T, which is 100 μT.",
     "F/L = I₂B = 5 × 100 μN/m = 500 μN/m. The currents run the same way, so the wires attract."
    ],
    answer: "100 μT and 500 μN/m, attracting."
   },
   pitfalls: [
    "Leaving the distance in centimetres in B = μ₀I/(2πr).",
    "Mixing up the rule: parallel currents in the same direction attract, unlike charges of the same sign, which repel.",
    "Multiplying by the first current twice instead of using the second wire's own current for the force."
   ]
  },
  guidance: [
   { prompt: "Use B = μ₀I/(2πr) with I = 30 A and r = 0.08 m. What is the field at the second cable, in μT, to 2 decimal places?", answer: [75], labels: ["field (μT)"], explanation: "B = 2 × 10⁻⁷ × 30 ÷ 0.08 T = 75 × 10⁻⁶ T, that is 75 μT." },
   { prompt: "The second cable carries 20 A at right angles to that field. What force acts on each metre of it, in μN/m, to 2 decimal places?", answer: [1500], labels: ["force per metre (μN/m)"], explanation: "F/L = I₂B = 20 × 75 μN/m = 1500 μN/m." },
   { prompt: "The currents run opposite ways. Enter 1 if the cables attract or −1 if they repel.", answer: [-1], labels: ["attract 1, repel −1"], explanation: "Currents in opposite directions repel, so the answer is −1." }
  ]
 },
 {
  id: 'q34', title: "Winding the coil gate", topic: "Ampère's law (the line integral ∮B·dl) and the field inside a solenoid", tier: 'Advanced', sector: 'Ore Sorter',
  brief: "The coil gate grabs steel ore with the field inside a long coil, and we must set its strength before the next load arrives.",
  lesson: "Ampère's law says the line integral of B round any closed path is μ₀ times the current through it; for a long solenoid this gives a uniform inside field B = μ₀nI.",
  prompt: "The ore sorter's coil gate is a long solenoid: one wire wound into a tight coil of 600 turns spread evenly along 30 cm. It carries a current of 2.5 A. Take μ₀ = 4π × 10⁻⁷ T·m/A. Enter the number of turns per metre, n, then the size of the magnetic field inside the solenoid in millitesla (mT, 1 mT = 10⁻³ T), to 2 decimal places. Type numbers without commas.",
  answer: [2000,6.28], labels: ["turns per metre","field (mT)"], tolerance: 0.005,
  hints: [
   "The number of turns per metre is the number of turns divided by the length in metres.",
   "Ampère's law round a rectangle with one side of length l inside the coil, along its axis, gives Bl = μ₀ × (the current through the rectangle) = μ₀ × nl × I, so B = μ₀nI."
  ],
  solution: "The coil is 30 cm = 0.3 m long, so n = 600 ÷ 0.3 = 2000 turns per metre. Take a rectangle with a 0.1 m side inside the coil along its axis and the opposite side outside, where the field is close to zero. Only the inside side adds to the line integral, which is B × 0.1 m. That side has 200 turns beside it, each carrying 2.5 A through the rectangle, so 500 A passes through. Ampère's law gives B × 0.1 = μ₀ × 500, so B = μ₀nI = 4π × 10⁻⁷ × 2000 × 2.5 T ≈ 6.2832 mT, which is 6.28 mT to 2 decimal places.",
  xp: 200, prereqs: ["q33"],
  artifact: { name: "Coil gate winding card", description: "The turns-per-metre count that sets the field inside the gate." },
  sources: [source.s12_5, source.s12_6],
  teaching: {
   intuition: "A line integral adds up a quantity along a path. Walk once round a closed path, split it into tiny steps dl (small vectors along the path), and at each step take B·dl, the part of the field along your step times the step length. Adding them all round the loop gives the line integral ∮B·dl; the circle on ∮ means the path closes. When B lies along the path and has the same size everywhere on it, the sum is simply B times the length of the path. Ampère's law says that for any closed path, ∮B·dl = μ₀I, where I is the total current passing through the path. Check it on the long wire: on a circle of radius r round it, B is along the circle and constant, so B × 2πr = μ₀I, giving B = μ₀I/(2πr), as in the last mission. Now a solenoid: a wire wound into a long, tight coil. Inside, its field is uniform and runs along the axis; outside, it is close to zero. Write n for the number of turns per metre. Take a rectangle with one side of length l inside along the axis and the opposite side outside. Only the inside side adds to the line integral: the outside side has no field, and the two sides that cross the coil's wall are at right angles to the field inside, so they add nothing. The line integral is Bl. The current through the rectangle is I from each of the nl turns beside that side: nlI. So Bl = μ₀nlI, and B = μ₀nI. Fields this size are given in millitesla: 1 mT = 10⁻³ T.",
   steps: [
    "Find n, the number of turns per metre: turns divided by length in metres.",
    "Choose an Ampère path: a rectangle with one side of length l inside the coil along its axis.",
    "The line integral is Bl, and the current through the rectangle is nlI.",
    "Ampère's law gives Bl = μ₀nlI, so B = μ₀nI. Convert to mT."
   ],
   example: {
    prompt: "A long solenoid has 1000 turns per metre and carries 1 A. Find the field inside, in mT.",
    steps: [
     "A rectangle with a 0.1 m side inside has 100 turns beside it, so 100 A passes through it.",
     "B × 0.1 = 4π × 10⁻⁷ × 100, so B = 4π × 10⁻⁴ T ≈ 1.26 mT."
    ],
    answer: "About 1.26 mT."
   },
   pitfalls: [
    "Using the total number of turns N in place of the turns per metre n.",
    "Counting the current only once: each turn beside the inside side of the path carries I through it.",
    "Leaving the answer in tesla when millitesla are asked for."
   ]
  },
  guidance: [
   { prompt: "600 turns are spread along 30 cm. How many turns are there per metre?", answer: [2000], labels: ["turns per metre"], explanation: "30 cm = 0.3 m, and 600 ÷ 0.3 = 2000 turns per metre." },
   { prompt: "Draw a rectangle with one 0.1 m side inside the coil along its axis and the opposite side outside. How much current passes through the rectangle, in amperes?", answer: [500], labels: ["current through the rectangle (A)"], explanation: "The inside side has 2000 × 0.1 = 200 turns beside it. Each carries 2.5 A through the rectangle, so 200 × 2.5 = 500 A passes through." },
   { prompt: "Only the inside side adds to the line integral, so ∮B·dl = B × 0.1 m. Ampère's law sets this equal to μ₀ × 500 A. What is B, in mT, to 2 decimal places?", answer: [6.28], labels: ["field (mT)"], explanation: "B = 4π × 10⁻⁷ × 500 ÷ 0.1 T ≈ 6.2832 × 10⁻³ T, that is 6.2832 mT. It is the same as μ₀nI." }
  ]
 },
 {
  id: 'q35', title: "The pick-up coil", topic: "Magnetic flux and Faraday's law, with Lenz's law for direction", tier: 'Advanced', sector: 'Generator Station',
  brief: "A pick-up coil on the test bench tells us when the generator's field shifts, and we must read its signal and which way its current runs.",
  lesson: "A changing magnetic flux through a coil induces an emf N × (change in flux)/(time); by Lenz's law the induced current opposes the change.",
  prompt: "A flat pick-up coil lies on the test bench in the Generator Station. It has 50 turns, each enclosing 0.04 m². A magnetic field points straight up through it, at right angles to the coil, and over 0.4 s its strength changes steadily from 20 mT to 80 mT. The coil's ends are joined, and its total resistance is 6 Ω. Enter the size of the induced emf in millivolts (mV), then the size of the current in milliamperes (mA), each to 2 decimal places. Then enter the direction of the current seen from above: 1 for clockwise, −1 for anticlockwise. Type numbers without commas.",
  answer: [300,50,1], labels: ["emf (mV)","current (mA)","clockwise 1, anticlockwise −1"], tolerance: 0.005,
  hints: [
   "The magnetic flux through one turn is Φ = BA when the field is at right angles to the coil. Faraday's law: the size of the emf is N times the change in flux through one turn, divided by the time the change takes.",
   "Lenz's law: the induced current makes a field of its own that opposes the change in flux. Curl the fingers of your right hand along the current: your thumb shows the direction of its field inside the loop."
  ],
  solution: "The flux through one turn changes by ΔΦ = A × ΔB = 0.04 × 60 mT = 2.4 mWb (1 Wb = 1 T·m²). Faraday's law gives an emf of size N × ΔΦ/Δt = 50 × 2.4 ÷ 0.4 = 300 mV. Ohm's law gives the current: 300 ÷ 6 = 50 mA. The upward flux is growing, so by Lenz's law the current makes a downward field inside the coil. With your right thumb pointing down, your fingers curl clockwise seen from above: 1.",
  xp: 200, prereqs: ["q34","q07"],
  artifact: { name: "Pick-up coil", description: "A loop of wire that answers every change of field with a pulse of current." },
  sources: [source.s13_1, source.s13_2],
  teaching: {
   intuition: "Electric flux measured how much electric field passes through a surface. Magnetic flux does the same for B: through a flat area A with a uniform field at right angles to it, Φ = BA. Its unit is the weber: 1 Wb = 1 T·m², and 1 mWb = 10⁻³ Wb. The discovery that powers the outpost is Faraday's law: when the magnetic flux through a loop changes, an emf appears round the loop, equal to the rate of change of the flux. For a coil of N turns the emfs of the turns add: ε = −N dΦ/dt. When the flux changes steadily by ΔΦ over a time Δt, the size of the emf is N × ΔΦ/Δt. This is called electromagnetic induction. If the coil is closed, the emf drives a current I = ε/R. The minus sign carries the direction, and Lenz's law says what it means: the induced current flows so that its own field opposes the change in flux. If the flux grows, the current's field points against it; if it shrinks, the current's field points along it, to make up the loss. To turn that into a direction, use the right-hand rule for a loop: curl your right fingers along the current, and your thumb points along the field it makes inside the loop.",
   steps: [
    "Find the flux through one turn before and after: Φ = BA, with A in m² and B in T (mT gives mWb).",
    "Faraday's law: emf = N × ΔΦ/Δt in size.",
    "If the coil is closed, the current is I = emf/R.",
    "Lenz's law: the current's field opposes the change. Use your right hand to turn that field into clockwise or anticlockwise."
   ],
   example: {
    prompt: "A 10-turn coil encloses 0.1 m². A field pointing up through it grows steadily from 0 to 50 mT in 0.5 s. Find the emf in mV, and say which way the current runs, seen from above.",
    steps: [
     "ΔΦ = 0.1 × 50 mT = 5 mWb through each turn.",
     "emf = 10 × 5 ÷ 0.5 = 100 mV.",
     "The upward flux grows, so the current makes a downward field inside: with your right thumb down, your fingers curl clockwise seen from above."
    ],
    answer: "100 mV, clockwise seen from above."
   },
   pitfalls: [
    "Using the field itself instead of its change: a large steady field induces nothing.",
    "Forgetting the factor N for a coil of many turns.",
    "Making the current's field point along the change instead of against it."
   ]
  },
  guidance: [
   { prompt: "The field changes from 20 mT to 80 mT through 0.04 m². By how much does the flux through one turn change, in milliwebers (mWb)? Enter the size.", answer: [2.4], labels: ["change in flux (mWb)"], explanation: "ΔΦ = A × ΔB = 0.04 × 60 mT = 2.4 mWb." },
   { prompt: "Faraday's law: emf = N × ΔΦ/Δt for 50 turns over 0.4 s. What is the size of the emf, in mV, to 2 decimal places?", answer: [300], labels: ["emf (mV)"], explanation: "50 × 2.4 ÷ 0.4 = 300 mV." },
   { prompt: "The coil's resistance is 6 Ω. What current flows, in mA, to 2 decimal places?", answer: [50], labels: ["current (mA)"], explanation: "I = emf/R = 300 ÷ 6 = 50 mA." },
   { prompt: "The upward flux is growing. Which way does the current run, seen from above? Enter 1 for clockwise, −1 for anticlockwise.", answer: [1], labels: ["clockwise 1, anticlockwise −1"], explanation: "The current must make a downward field to oppose the growth. A downward thumb means fingers curling clockwise seen from above." }
  ]
 },
 {
  id: 'q36', title: "Checking the wind generator", topic: "Motional emf and the generator, peak emf NBAω", tier: 'Advanced', sector: 'Generator Station',
  brief: "Before the wind generator goes on line, we test the emf of a sliding rod and work out the generator's peak voltage.",
  lesson: "A rod of length l moving at speed v across a field B has a motional emf Blv; a coil of N turns of area A spinning at ω in a field B gives an emf NBAω sin ωt, with peak NBAω.",
  prompt: "Two checks on the wind generator. First, a test rod 1.2 m long slides along two metal rails at a steady 5 m/s. A uniform magnetic field of 0.4 T is at right angles to the rod, the rails and its motion. Second, the generator's coil has 200 turns, each of area 0.05 m², and spins at 40 rad/s in a uniform field of 0.3 T, about an axis at right angles to the field. Enter the motional emf across the rod in volts (V), then the peak emf of the generator in volts, each to 2 decimal places. Type numbers without commas.",
  answer: [2.4,120], labels: ["rod emf (V)","peak emf (V)"], tolerance: 0.005,
  hints: [
   "Each second the rod sweeps out an area of l × v, so the flux of the circuit it closes changes at the rate Blv. By Faraday's law that rate is the emf.",
   "A coil of N turns of area A spinning at angular speed ω in a field B has flux BA cos ωt through each turn. Its rate of change gives the emf NBAω sin ωt, whose peak is NBAω."
  ],
  solution: "The rod sweeps out 1.2 × 5 = 6 m² each second, so the flux changes at the rate Blv = 0.4 × 6 = 2.4 V. The generator's emf is NBAω sin ωt, so its peak is NBAω = 200 × 0.3 × 0.05 × 40 = 120 V.",
  xp: 200, prereqs: ["q35"],
  artifact: { name: "Generator test rig", description: "A sliding rod and a spinning coil that turn motion into volts." },
  sources: [source.s13_3, source.s13_6],
  teaching: {
   intuition: "Faraday's law needs the flux to change, but the field does not have to change: the area can. Picture a metal rod of length l lying across two rails, with a field B at right angles to the rails, the rod and its motion. The rod and rails form a loop. When the rod slides at speed v, the loop grows by an area lv every second, so its flux grows at the rate Blv. By Faraday's law that is the emf: ε = Blv, called motional emf because motion makes it. A generator does the same job by turning. A coil of N turns, each of area A, spins at angular speed ω (radians per second) in a field B, about an axis at right angles to the field. The angle between the field and the coil's face changes as ωt, so the flux through each turn is BA cos ωt. Its rate of change gives the emf ε = NBAω sin ωt, which swings up and down like a sine wave. Since sin ωt is never more than 1, the peak emf is NBAω. The coil goes round ω/(2π) times a second; this is its frequency f, measured in hertz (Hz), so ω = 2πf.",
   steps: [
    "For a sliding rod, find the area it sweeps out each second: l × v.",
    "Multiply by the field: the motional emf is Blv.",
    "For a spinning coil, the emf is NBAω sin ωt.",
    "Its peak, where sin ωt = 1, is NBAω."
   ],
   example: {
    prompt: "A 0.5 m rod slides at 10 m/s across a 0.2 T field. A generator coil of 100 turns, each 0.02 m², spins at 50 rad/s in a 0.5 T field. Find both emfs.",
    steps: [
     "The rod sweeps 0.5 × 10 = 5 m² a second, so ε = 0.2 × 5 = 1 V.",
     "The peak emf is NBAω = 100 × 0.5 × 0.02 × 50 = 50 V."
    ],
    answer: "1 V across the rod and a 50 V peak from the generator."
   },
   pitfalls: [
    "Using the frequency f in place of the angular speed ω in NBAω; ω = 2πf.",
    "Forgetting the number of turns N for the generator coil.",
    "Treating the peak emf as the emf at every moment: the generator's emf rises and falls as sin ωt."
   ]
  },
  guidance: [
   { prompt: "The rod is 1.2 m long and moves at 5 m/s. What area does it sweep out each second, in square metres?", answer: [6], labels: ["area swept per second (m²)"], explanation: "1.2 × 5 = 6 m² each second." },
   { prompt: "The flux changes by B times that area each second. What is the motional emf, in volts, to 2 decimal places?", answer: [2.4], labels: ["rod emf (V)"], explanation: "ε = Blv = 0.4 × 6 = 2.4 V." },
   { prompt: "The coil's emf is NBAω sin ωt. What is its peak, in volts, to 2 decimal places?", answer: [120], labels: ["peak emf (V)"], explanation: "sin ωt is at most 1, so the peak is NBAω = 200 × 0.3 × 0.05 × 40 = 120 V." }
  ]
 },
 {
  id: 'q37', title: "Switching on the field coil", topic: "Inductance, energy in an inductor and the RL time constant", tier: 'Advanced', sector: 'Generator Station',
  brief: "The generator's field coil cannot reach full current at once, and we must know how fast it fills and how much energy it holds.",
  lesson: "An inductor opposes changes in its current with an emf −L dI/dt; switched onto a supply its current grows as (ε/R)(1 − e^(−t/τ)) with τ = L/R, and it stores ½LI².",
  prompt: "The wind generator's field coil is an inductor with inductance 200 mH (1 mH = 10⁻³ H) and resistance 8 Ω. At t = 0 it is switched onto a steady 24 V supply. Enter the time constant τ = L/R in milliseconds (ms); then the energy stored in the coil once the current has settled, in millijoules (mJ); then the current 20 ms after the switch closes, in amperes (A). Give the energy and the current to 2 decimal places and type numbers without commas.",
  answer: [25,900,1.65], labels: ["time constant (ms)","energy (mJ)","current (A)"], tolerance: 0.005,
  hints: [
   "τ = L/R comes out in seconds with L in henries and R in ohms, so with L in millihenries it comes out in milliseconds.",
   "The settled current is ε/R, and an inductor carrying a current I stores energy ½LI². While the current grows, I(t) = (ε/R)(1 − e^(−t/τ))."
  ],
  solution: "τ = L/R = 200 mH ÷ 8 Ω = 25 ms. Once the current settles, the coil's emf is zero and the current is ε/R = 24 ÷ 8 = 3 A. The stored energy is ½LI² = ½ × 200 × 10⁻³ × 3² J = 900 mJ. At t = 20 ms, t/τ = 0.8, so I = 3 × (1 − e^(−0.8)) ≈ 1.652 A, which is 1.65 A to 2 decimal places.",
  xp: 200, prereqs: ["q36","q28"],
  artifact: { name: "Field coil timer", description: "A clock that knows how long the field coil takes to fill with current." },
  sources: [source.s14_2, source.s14_3, source.s14_4],
  teaching: {
   intuition: "A coil's current makes a field through the coil itself. If the current changes, its own flux changes, and by Faraday's law the coil induces an emf in itself. Lenz's law says that emf opposes the change. The size of the effect is the coil's inductance L: the self-induced emf is ε = −L dI/dt. Inductance is measured in henries (H): 1 H gives 1 V when the current changes by 1 A each second, and 1 mH = 10⁻³ H. A coil used for its inductance is called an inductor. Switch an inductor with resistance R onto a steady supply ε, and the current cannot jump: the inductor's back emf holds it down at first. The current grows as I(t) = (ε/R)(1 − e^(−t/τ)), the same shape as a charging capacitor's voltage, with time constant τ = L/R. After one τ it has reached about 63% of its final value ε/R, and after a few τ it has settled. A settled current is steady, so the inductor's emf is then zero. Building that current took work against the back emf, and the inductor keeps it as energy in its magnetic field: U = ½LI².",
   steps: [
    "Find the time constant τ = L/R; with L in mH it comes out in ms.",
    "Find the settled current ε/R.",
    "The stored energy at that current is ½LI²; with L in mH it comes out in mJ.",
    "For the current at a time t, use I(t) = (ε/R)(1 − e^(−t/τ))."
   ],
   example: {
    prompt: "A 100 mH inductor with resistance 10 Ω is switched onto 12 V. Find τ, the settled current, the stored energy, and the current after 10 ms.",
    steps: [
     "τ = 100 mH ÷ 10 Ω = 10 ms, and the settled current is 12 ÷ 10 = 1.2 A.",
     "U = ½ × 0.1 × 1.2² = 0.072 J = 72 mJ.",
     "At 10 ms, t/τ = 1, so I = 1.2 × (1 − e^(−1)) ≈ 0.76 A."
    ],
    answer: "τ = 10 ms, 1.2 A, 72 mJ, and about 0.76 A after 10 ms."
   },
   pitfalls: [
    "Writing τ = R/L, upside down.",
    "Using e^(−t/τ) alone, which is the falling current when the supply is removed, not the growing one.",
    "Forgetting to square the current in ½LI²."
   ]
  },
  guidance: [
   { prompt: "What is the time constant τ = L/R, in milliseconds?", answer: [25], labels: ["time constant (ms)"], explanation: "200 mH ÷ 8 Ω = 25 ms." },
   { prompt: "Once the current has settled, the coil's emf is zero. What is the current then, in amperes, to 2 decimal places?", answer: [3], labels: ["settled current (A)"], explanation: "Only the resistance limits it: ε/R = 24 ÷ 8 = 3 A." },
   { prompt: "What energy does the coil store at that current, in millijoules, to 2 decimal places?", answer: [900], labels: ["energy (mJ)"], explanation: "½LI² = ½ × 200 × 10⁻³ H × (3 A)² = 900 × 10⁻³ J, that is 900 mJ." },
   { prompt: "Use I(t) = (ε/R)(1 − e^(−t/τ)) at t = 20 ms. What is the current, in amperes, to 2 decimal places?", answer: [1.65], labels: ["current (A)"], explanation: "t/τ = 0.8, and 3 × (1 − e^(−0.8)) ≈ 1.652 A." }
  ]
 },
 {
  id: 'q38', title: "Reading the ac line", topic: "Alternating current: peak, rms and reactance", tier: 'Advanced', sector: 'Generator Station',
  brief: "The generator's output is alternating, and we must rate the line's voltage and current before plugging in a coil or a capacitor.",
  lesson: "An ac voltage V₀ sin ωt has rms value V₀/√2; an inductor's reactance is ωL and a capacitor's is 1/(ωC), and the rms current is V_rms/X.",
  prompt: "A 60 Hz alternating supply in the Generator Station has a peak voltage of 170 V. It is connected across an inductor of 150 mH (1 mH = 10⁻³ H) and nothing else; take the resistance of the wires as zero. Enter the rms voltage in volts (V), the reactance of the inductor in ohms (Ω), then the rms current in amperes (A), each to 2 decimal places. Type numbers without commas.",
  answer: [120.21,56.55,2.13], labels: ["rms voltage (V)","reactance (Ω)","rms current (A)"], tolerance: 0.005,
  hints: [
   "The rms value of a sine-wave voltage is its peak divided by √2.",
   "With ω = 2πf, an inductor's reactance is X_L = ωL and a capacitor's is X_C = 1/(ωC). The rms current is the rms voltage divided by the reactance, as in Ohm's law."
  ],
  solution: "V_rms = 170 ÷ √2 ≈ 120.2082 V, which is 120.21 V to 2 decimal places. The angular frequency is ω = 2π × 60 ≈ 376.9911 rad/s, so the inductor's reactance is X_L = ωL ≈ 376.9911 × 0.15 ≈ 56.5487 Ω, which is 56.55 Ω to 2 decimal places. The rms current is V_rms/X ≈ 120.2082 ÷ 56.5487 ≈ 2.1257 A, which is 2.13 A to 2 decimal places.",
  xp: 200, prereqs: ["q37"],
  artifact: { name: "Ac line meter", description: "A meter that reads the steady-equivalent voltage of a swinging supply." },
  sources: [source.s15_1, source.s15_2, source.s15_4],
  teaching: {
   intuition: "The generator's emf swings as a sine wave, so the outpost runs on alternating current (ac): a voltage v = V₀ sin ωt whose current reverses direction twice each cycle. V₀ is the peak voltage, and ω = 2πf, where f is the frequency in hertz. An ac voltage spends little time at its peak, so the peak overstates it. The useful single number is the rms value (root mean square: the square root of the average of the square). For a sine wave it is the peak divided by √2: V_rms = V₀/√2, and likewise I_rms = I₀/√2. An rms voltage heats a resistor as much as a steady voltage of the same size. Inductors and capacitors limit an ac current without using up energy, by a reactance X, measured in ohms. An inductor resists fast changes, so its reactance grows with frequency: X_L = ωL. A capacitor passes fast changes easily, so its reactance falls with frequency: X_C = 1/(ωC). With either one alone on the supply, the current follows Ohm's law with X in place of R: I₀ = V₀/X, and so I_rms = V_rms/X.",
   steps: [
    "Find the angular frequency ω = 2πf.",
    "Find the rms voltage V_rms = V₀/√2.",
    "Find the reactance: X_L = ωL for an inductor (L in henries), X_C = 1/(ωC) for a capacitor (C in farads).",
    "Divide: I_rms = V_rms/X."
   ],
   example: {
    prompt: "A 50 Hz supply with peak 20 V is connected across a 100 μF capacitor alone. Find V_rms, X_C and I_rms.",
    steps: [
     "V_rms = 20 ÷ √2 ≈ 14.14 V, and ω = 2π × 50 ≈ 314.16 rad/s.",
     "X_C = 1 ÷ (314.16 × 100 × 10⁻⁶) ≈ 31.83 Ω.",
     "I_rms ≈ 14.14 ÷ 31.83 ≈ 0.44 A."
    ],
    answer: "About 14.14 V, 31.83 Ω and 0.44 A."
   },
   pitfalls: [
    "Using f in place of ω = 2πf in the reactance.",
    "Mixing peak and rms values: divide the rms voltage by X for the rms current.",
    "Forgetting the prefixes: mH means 10⁻³ H and μF means 10⁻⁶ F."
   ]
  },
  guidance: [
   { prompt: "What is the angular frequency ω = 2πf of a 60 Hz supply, in radians per second, to 2 decimal places?", answer: [376.99], labels: ["angular frequency (rad/s)"], explanation: "2π × 60 ≈ 376.9911 rad/s." },
   { prompt: "The peak voltage is 170 V. What is the rms voltage, in volts, to 2 decimal places?", answer: [120.21], labels: ["rms voltage (V)"], explanation: "170 ÷ √2 ≈ 120.2082 V." },
   { prompt: "What is the inductor's reactance, in ohms, to 2 decimal places?", answer: [56.55], labels: ["reactance (Ω)"], explanation: "X_L = ωL ≈ 376.9911 × 0.15 H ≈ 56.5487 Ω." },
   { prompt: "What is the rms current, in amperes, to 2 decimal places?", answer: [2.13], labels: ["rms current (A)"], explanation: "I_rms = V_rms/X ≈ 120.2082 ÷ 56.5487 ≈ 2.1257 A." }
  ]
 },
 {
  id: 'q39', title: "Tuning the mast circuit", topic: "RLC series circuit: impedance and resonance", tier: 'Advanced', sector: 'Generator Station',
  brief: "The comms mast's tuning circuit must pick out one frequency, and we need its impedance on the bench supply and the frequency it rings at.",
  lesson: "A series RLC circuit has impedance Z = √(R² + (X_L − X_C)²) and peak current V₀/Z; it resonates where X_L = X_C, at f₀ = 1/(2π√(LC)).",
  prompt: "The comms mast's tuning circuit has a resistor of 40 Ω, an inductor of 100 mH (1 mH = 10⁻³ H) and a capacitor of 20 μF (1 μF = 10⁻⁶ F) in series. A 60 Hz supply with a peak voltage of 50 V drives it. Enter the impedance of the circuit in ohms (Ω), then the peak current in amperes (A), then the circuit's resonant frequency in hertz (Hz), each to 2 decimal places. Type numbers without commas.",
  answer: [103.01,0.49,112.54], labels: ["impedance (Ω)","peak current (A)","resonant frequency (Hz)"], tolerance: 0.005,
  hints: [
   "Work out X_L = ωL and X_C = 1/(ωC) with ω = 2πf. The impedance of the series circuit is Z = √(R² + (X_L − X_C)²), and the peak current is V₀/Z.",
   "At resonance X_L = X_C, which happens at the angular frequency ω₀ = 1/√(LC). The resonant frequency is f₀ = ω₀/(2π) = 1/(2π√(LC))."
  ],
  solution: "ω = 2π × 60 ≈ 376.9911 rad/s. X_L = ωL ≈ 376.9911 × 0.1 ≈ 37.6991 Ω and X_C = 1/(ωC) ≈ 1 ÷ (376.9911 × 20 × 10⁻⁶) ≈ 132.6291 Ω. Z = √(40² + (37.6991 − 132.6291)²) ≈ 103.0131 Ω, which is 103.01 Ω to 2 decimal places. The peak current is V₀/Z ≈ 50 ÷ 103.0131 ≈ 0.4854 A, which is 0.49 A to 2 decimal places. The resonant frequency is f₀ = 1/(2π√(LC)) = 1 ÷ (2π√(0.1 × 20 × 10⁻⁶)) ≈ 112.5395 Hz, which is 112.54 Hz to 2 decimal places.",
  xp: 200, prereqs: ["q38"],
  artifact: { name: "Mast tuner", description: "A dial that sets the one frequency the mast circuit answers loudest." },
  sources: [source.s15_3, source.s15_5],
  teaching: {
   intuition: "Put a resistor R, an inductor L and a capacitor C in series on an ac supply. The same current flows through all three, but the inductor's voltage runs a quarter cycle ahead of the current and the capacitor's a quarter cycle behind, so those two partly cancel. The result is that the circuit's total opposition to the current, its impedance Z, combines the parts like the sides of a right-angled triangle: Z = √(R² + (X_L − X_C)²), in ohms. The peak current is then I₀ = V₀/Z. Because X_L grows with frequency and X_C shrinks, there is one frequency where they are equal and cancel completely. There Z is just R, the smallest it can be, and the current is largest. This is resonance. Setting ωL = 1/(ωC) gives the resonant angular frequency ω₀ = 1/√(LC), and the resonant frequency f₀ = ω₀/(2π) = 1/(2π√(LC)). A radio tunes to a station by setting its resonant frequency to the station's.",
   steps: [
    "Find ω = 2πf, then X_L = ωL and X_C = 1/(ωC).",
    "Combine: Z = √(R² + (X_L − X_C)²).",
    "The peak current is I₀ = V₀/Z.",
    "The resonant frequency is f₀ = 1/(2π√(LC)), with L in henries and C in farads."
   ],
   example: {
    prompt: "A series circuit has R = 30 Ω, L = 50 mH and C = 50 μF. On one supply X_L = 80 Ω and X_C = 40 Ω. Find Z there, and the resonant frequency.",
    steps: [
     "Z = √(30² + (80 − 40)²) = √(900 + 1600) = √2500 = 50 Ω.",
     "√(LC) = √(0.05 × 50 × 10⁻⁶) ≈ 1.581 × 10⁻³ s, so f₀ = 1 ÷ (2π × 1.581 × 10⁻³) ≈ 100.66 Hz."
    ],
    answer: "Z = 50 Ω and f₀ ≈ 100.66 Hz."
   },
   pitfalls: [
    "Adding R, X_L and X_C straight together instead of using the right-angle rule.",
    "Adding X_L and X_C: they work against each other, so take their difference.",
    "Using 1/√(LC) as the frequency in hertz: that is ω₀, and f₀ is ω₀ divided by 2π."
   ]
  },
  guidance: [
   { prompt: "With ω = 2π × 60 rad/s, what is the inductor's reactance X_L = ωL, in ohms, to 2 decimal places?", answer: [37.7], labels: ["inductor reactance (Ω)"], explanation: "X_L ≈ 376.9911 × 0.1 H ≈ 37.6991 Ω." },
   { prompt: "What is the capacitor's reactance X_C = 1/(ωC), in ohms, to 2 decimal places?", answer: [132.63], labels: ["capacitor reactance (Ω)"], explanation: "X_C ≈ 1 ÷ (376.9911 × 20 × 10⁻⁶ F) ≈ 132.6291 Ω." },
   { prompt: "Using the unrounded reactances, what is the impedance Z = √(R² + (X_L − X_C)²), in ohms, to 2 decimal places?", answer: [103.01], labels: ["impedance (Ω)"], explanation: "X_L − X_C ≈ −94.93 Ω, so Z ≈ √(1600 + 9011.7063) ≈ 103.0131 Ω." },
   { prompt: "What is the resonant frequency f₀ = 1/(2π√(LC)), in hertz, to 2 decimal places?", answer: [112.54], labels: ["resonant frequency (Hz)"], explanation: "√(LC) = √(0.1 × 20 × 10⁻⁶) s, and 1 ÷ (2π√(LC)) ≈ 112.5395 Hz. The supply runs below it, so X_C is larger than X_L." }
  ]
 },
 {
  id: 'q40', title: "The signal home", topic: "Electromagnetic waves: c = fλ and E = cB; realm review and bridge to Waves", tier: 'Advanced', sector: 'Generator Station',
  brief: "The mast is ready to call home, and we must know the signal's frequency, its wavelength and how strong its magnetic part is.",
  lesson: "An electromagnetic wave is linked electric and magnetic fields travelling at c = 3.00 × 10⁸ m/s, with c = fλ and E = cB.",
  prompt: "The comms mast sends its signal home as an electromagnetic wave. The transmitter is tuned to the resonant frequency of an inductor of 2 μH (1 μH = 10⁻⁶ H) in series with a capacitor of 50 pF (1 pF = 10⁻¹² F), and the wave has that frequency. Near the mast the wave's electric field has an amplitude of 1.2 V/m. Take c = 3.00 × 10⁸ m/s. Enter the frequency in megahertz (MHz, 1 MHz = 10⁶ Hz), the wavelength in metres (m), then the amplitude of the wave's magnetic field in nanotesla (nT, 1 nT = 10⁻⁹ T), each to 2 decimal places.",
  answer: [15.92,18.85,4], labels: ["frequency (MHz)","wavelength (m)","magnetic field (nT)"], tolerance: 0.005,
  hints: [
   "The resonant frequency of an inductor and a capacitor in series is f = 1/(2π√(LC)). Every electromagnetic wave travels at c, so its wavelength is λ = c/f.",
   "In an electromagnetic wave the field amplitudes are tied together by E = cB, so B = E/c."
  ],
  solution: "√(LC) = √(2 × 10⁻⁶ × 50 × 10⁻¹²) s, so f = 1/(2π√(LC)) ≈ 15.9155 MHz, which is 15.92 MHz to 2 decimal places. The wavelength is λ = c/f = 3.00 × 10⁸ ÷ (15.9155 × 10⁶) ≈ 18.8496 m, which is 18.85 m to 2 decimal places: longer than about 0.1 m, so these are radio waves. The magnetic field amplitude is B = E/c = 1.2 ÷ (3.00 × 10⁸) T = 4 nT.",
  xp: 200, prereqs: ["q39","q36"],
  artifact: { name: "Signal beacon", description: "The mast's first message home, carried by light-speed fields." },
  sources: [source.s16_2, source.s16_5, source.s15_5],
  teaching: {
   intuition: "Everything in this realm meets here. Faraday's law showed that a changing magnetic field makes an electric field, as in the generator. The reverse is also true: a changing electric field makes a magnetic field. So a field that changes keeps making the other, and the pair sets off through empty space as an electromagnetic wave. The electric and magnetic fields point at right angles to each other and to the direction the wave travels. Every electromagnetic wave in empty space travels at the speed of light, c = 1/√(ε₀μ₀) ≈ 3.00 × 10⁸ m/s, built from the two constants of this realm. Like any wave, its speed is its frequency times its wavelength: c = fλ, so λ = c/f. The field amplitudes are tied together by E = cB, so the magnetic part is tiny: B = E/c, often a few nanotesla (1 nT = 10⁻⁹ T). Sorted by wavelength, these waves make the electromagnetic spectrum: radio waves (longer than about 0.1 m), microwaves, infrared, visible light (about 400 nm to 750 nm), ultraviolet, X-rays and gamma rays. A transmitter makes radio waves at its tuning circuit's resonant frequency, f = 1/(2π√(LC)), from the last mission. Megahertz are 1 MHz = 10⁶ Hz. Waves of every kind are the next realm.",
   steps: [
    "Find the frequency: here the resonant frequency f = 1/(2π√(LC)) of the transmitter's circuit.",
    "The wavelength is λ = c/f, with f in hertz.",
    "The magnetic field amplitude is B = E/c.",
    "Use the wavelength to place the wave in the spectrum."
   ],
   example: {
    prompt: "A radio wave has frequency 100 MHz and electric field amplitude 6 V/m. Find its wavelength and its magnetic field amplitude in nT.",
    steps: [
     "λ = c/f = 3.00 × 10⁸ ÷ (100 × 10⁶) = 3 m.",
     "B = E/c = 6 ÷ (3.00 × 10⁸) = 2 × 10⁻⁸ T, which is 20 nT."
    ],
    answer: "3 m and 20 nT."
   },
   pitfalls: [
    "Leaving the frequency in MHz when dividing c by it: convert to hertz first.",
    "Multiplying E by c instead of dividing for B.",
    "Using 1/√(LC) as the frequency: divide by 2π as well."
   ]
  },
  guidance: [
   { prompt: "Use f = 1/(2π√(LC)). What is the frequency, in MHz, to 2 decimal places?", answer: [15.92], labels: ["frequency (MHz)"], explanation: "√(LC) = √(2 × 10⁻⁶ × 50 × 10⁻¹²) s, and 1 ÷ (2π√(LC)) ≈ 15.9155 × 10⁶ Hz." },
   { prompt: "Using the unrounded frequency, what is the wavelength λ = c/f, in metres, to 2 decimal places?", answer: [18.85], labels: ["wavelength (m)"], explanation: "3.00 × 10⁸ ÷ (15.9155 × 10⁶) ≈ 18.8496 m." },
   { prompt: "The electric field amplitude is 1.2 V/m. What is the magnetic field amplitude B = E/c, in nT, to 2 decimal places?", answer: [4], labels: ["magnetic field (nT)"], explanation: "1.2 ÷ (3.00 × 10⁸) T = 4 × 10⁻⁹ T, that is 4 nT." }
  ]
 }
);
})();
