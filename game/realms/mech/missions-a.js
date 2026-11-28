/* Mechanics: motion and force missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/mech/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · SI units and conversion factors [1.3]
     q02  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · Powers of ten and metric prefixes [1.2]
     q03  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · Vector components from magnitude and angle (radians) [2.2]
     q04  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · Adding vectors by components; magnitude and direction of the resultant [2.3]
     q05  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · The dot product and the angle between two vectors [2.4]
     q06  ch 1 Measures and arrows · Basic, 100 XP · sector 'Survey Office' · Position, displacement, distance and average velocity [3.1]
     q07  ch 2 Motion on a line · Basic, 100 XP · sector 'Sled Run' · Instantaneous velocity as the derivative of position [3.2]
     q08  ch 2 Motion on a line · Basic, 100 XP · sector 'Sled Run' · Average and instantaneous acceleration [3.3]
     q09  ch 2 Motion on a line · Basic, 100 XP · sector 'Sled Run' · Motion with constant acceleration: the kinematic equations [3.4]
     q10  ch 2 Motion on a line · Basic, 100 XP · sector 'Sled Run' · Free fall with g = 9.8 m/s² [3.5] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 3.4 Motion with Constant Acceleration
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s1_2: { title: "OpenStax University Physics Volume 1 — 1.2 Units and Standards", url: "https://openstax.org/books/university-physics-volume-1/pages/1-2-units-and-standards", description: "The SI base units, among them the metre, kilogram and second, and the metric prefixes as powers of ten.", verified: '2026-11-28' },
 s1_3: { title: "OpenStax University Physics Volume 1 — 1.3 Unit Conversion", url: "https://openstax.org/books/university-physics-volume-1/pages/1-3-unit-conversion", description: "Conversion factors, and multiplying by them so that the unwanted units cancel.", verified: '2026-11-28' },
 s2_2: { title: "OpenStax University Physics Volume 1 — 2.2 Coordinate Systems and Components of a Vector", url: "https://openstax.org/books/university-physics-volume-1/pages/2-2-coordinate-systems-and-components-of-a-vector", description: "Vector components A cos θ and A sin θ, the unit vectors î and ĵ, and magnitude and direction from components.", verified: '2026-11-28' },
 s2_3: { title: "OpenStax University Physics Volume 1 — 2.3 Algebra of Vectors", url: "https://openstax.org/books/university-physics-volume-1/pages/2-3-algebra-of-vectors", description: "Adding vectors component by component, and the magnitude and direction angle of the resultant.", verified: '2026-11-28' },
 s2_4: { title: "OpenStax University Physics Volume 1 — 2.4 Products of Vectors", url: "https://openstax.org/books/university-physics-volume-1/pages/2-4-products-of-vectors", description: "The scalar (dot) product AB cos φ, its component form, and the angle between two vectors from it.", verified: '2026-11-28' },
 s3_1: { title: "OpenStax University Physics Volume 1 — 3.1 Position, Displacement, and Average Velocity", url: "https://openstax.org/books/university-physics-volume-1/pages/3-1-position-displacement-and-average-velocity", description: "Position, displacement Δx, total distance travelled as the sum of the sizes of the displacements, and average velocity Δx ÷ Δt.", verified: '2026-11-28' },
 s3_2: { title: "OpenStax University Physics Volume 1 — 3.2 Instantaneous Velocity and Speed", url: "https://openstax.org/books/university-physics-volume-1/pages/3-2-instantaneous-velocity-and-speed", description: "Instantaneous velocity as the derivative dx/dt of a position function, and speed as its magnitude.", verified: '2026-11-28' },
 s3_3: { title: "OpenStax University Physics Volume 1 — 3.3 Average and Instantaneous Acceleration", url: "https://openstax.org/books/university-physics-volume-1/pages/3-3-average-and-instantaneous-acceleration", description: "Average acceleration Δv ÷ Δt and instantaneous acceleration dv/dt, in metres per second squared.", verified: '2026-11-28' },
 s3_4: { title: "OpenStax University Physics Volume 1 — 3.4 Motion with Constant Acceleration", url: "https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration", description: "The kinematic equations for constant acceleration, with worked stopping distances for braking.", verified: '2026-11-28' },
 s3_5: { title: "OpenStax University Physics Volume 1 — 3.5 Free Fall", url: "https://openstax.org/books/university-physics-volume-1/pages/3-5-free-fall", description: "Free fall with negligible air resistance, g = 9.8 m/s² downwards, and a ball thrown straight up: its highest point and its flight time.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01", title: "One set of units for the ridge", topic: "SI units and conversion factors", tier: 'Basic', sector: "Survey Office",
  brief: "The survey rover reports its speed in kilometres per hour, but every log at the Proving Ground is kept in metres and seconds.",
  lesson: "To change units, multiply by conversion factors, fractions worth exactly 1, arranged so that the old units cancel.",
  prompt: "The survey rover’s dashboard shows its speed as 54 kilometres per hour (km/h). It keeps that speed for 4 minutes. Enter its speed in metres per second (m/s), then the driving time in seconds (s), then the distance it covers in metres (m), typed without commas.",
  answer: [15,240,3600], labels: ["speed (m/s)","time (s)","distance (m)"], tolerance: 0.01,
  hints: [
   "A kilometre is 1000 metres and an hour is 3600 seconds. Multiply by the conversion factors (1000 m ÷ 1 km) and (1 h ÷ 3600 s), so that km and h cancel.",
   "A minute is 60 seconds. At a steady speed the distance is the speed times the time, with the speed in m/s and the time in s."
  ],
  solution: "54 km/h × (1000 m ÷ 1 km) × (1 h ÷ 3600 s) = 54000 m ÷ 3600 s = 15 m/s. The time is 4 min × (60 s ÷ 1 min) = 240 s. The distance is 15 m/s × 240 s = 3600 m.",
  xp: 100, prereqs: [],
  artifact: {"name":"The units card","description":"A pocket card of SI units and the conversion factors the ridge uses most."},
  sources: [source.s1_3, source.s1_2],
  teaching: {
   intuition: "Every measurement is a number and a unit, and the number means nothing without the unit: 54 kilometres per hour and 15 metres per second are the same speed. Scientists agree on one system, the SI units (from the French Système International). Its base units for mechanics are the metre (m) for length, the kilogram (kg) for mass and the second (s) for time, and every other unit is built from them: a speed is in metres per second, m/s. A conversion factor is a fraction whose top and bottom are the same amount in two units, such as 1000 m ÷ 1 km. It is worth exactly 1, so multiplying by it changes the units without changing the amount. Units cancel like numbers do: km on the top and km on the bottom cancel, and what is left is the new unit.",
   steps: [
    "Write the quantity with its unit, for example 72 km/h, which is 72 km ÷ 1 h.",
    "Choose a conversion factor for each unit you want to change, and turn it so that the old unit is on the opposite side: km on top needs 1000 m ÷ 1 km; h underneath needs 1 h ÷ 3600 s.",
    "Multiply the numbers and cancel the units that appear on both the top and the bottom.",
    "Check that only the units you want are left, and that the size makes sense: a metre is smaller than a kilometre, so the number of metres is bigger."
   ],
   example: {
    prompt: "A cargo hauler drives at 72 km/h for 3 minutes. What is its speed in m/s, and how far does it go in metres?",
    steps: [
     "72 km/h × (1000 m ÷ 1 km) × (1 h ÷ 3600 s) = 72000 m ÷ 3600 s = 20 m/s.",
     "3 minutes × (60 s ÷ 1 min) = 180 s.",
     "Distance = speed × time = 20 m/s × 180 s = 3600 m; the seconds cancel."
    ],
    answer: "20 m/s, and 3600 m in 3 minutes."
   },
   pitfalls: [
    "Turning a conversion factor the wrong way up, so that the units multiply instead of cancelling: km × (1 km ÷ 1000 m) leaves km² ÷ m.",
    "Converting only one of the units in km/h. Both the kilometres and the hours have to change to give m/s.",
    "Using 60 instead of 3600 for an hour. An hour is 60 minutes of 60 seconds each, which is 3600 seconds."
   ]
  },
  guidance: [
   { prompt: "How many metres are there in 54 kilometres?", answer: [54000], labels: ["metres in the distance (m)"], explanation: "Each kilometre is 1000 metres, so 54 km × (1000 m ÷ 1 km) = 54000 m. The rover covers 54000 m every hour." },
   { prompt: "An hour is 3600 seconds. What is 54000 metres per hour in metres per second?", answer: [15], labels: ["speed (m/s)"], explanation: "54000 m ÷ 3600 s = 15 m/s: the hours cancel and seconds are left underneath." },
   { prompt: "How many seconds are there in 4 minutes?", answer: [240], labels: ["time (s)"], explanation: "Each minute is 60 seconds, so 4 × 60 = 240 s." },
   { prompt: "How far does the rover go at 15 m/s in 240 s, in metres?", answer: [3600], labels: ["distance (m)"], explanation: "15 m/s × 240 s = 3600 m. The seconds cancel and metres are left." }
  ]
 },
 {
  id: "q02", title: "Tiny pulses and big batteries", topic: "Powers of ten and metric prefixes", tier: 'Basic', sector: "Survey Office",
  brief: "The Survey Office instruments log very small and very large readings, and the crew wants them in units that give everyday-sized numbers.",
  lesson: "A metric prefix is a power of ten: milli- is 10⁻³, micro- is 10⁻⁶, kilo- is 10³ and mega- is 10⁶; divide by it to use the prefixed unit.",
  prompt: "The Survey Office logs three readings in powers of ten. A timing-gate pulse lasts 3.5 × 10⁻⁴ s, a gap in the sled rail is 4.8 × 10⁻² m wide, and a battery bank stores 2.7 × 10⁸ J of energy (J is the joule, the SI unit of energy). Enter the pulse in microseconds (μs), the gap in millimetres (mm), then the energy in megajoules (MJ).",
  answer: [350,48,270], labels: ["pulse (μs)","gap (mm)","energy (MJ)"], tolerance: 0.01,
  hints: [
   "micro- stands for 10⁻⁶, milli- for 10⁻³ and mega- for 10⁶. To write a value in a prefixed unit, divide it by the prefix’s power of ten.",
   "Dividing powers of ten subtracts the exponents: 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ. Then 10¹ moves the decimal point one place to the right, and 10⁰ = 1 leaves it where it is."
  ],
  solution: "Pulse: 3.5 × 10⁻⁴ s ÷ 10⁻⁶ = 3.5 × 10² = 350 μs. Gap: 4.8 × 10⁻² m ÷ 10⁻³ = 4.8 × 10¹ = 48 mm. Energy: 2.7 × 10⁸ J ÷ 10⁶ = 2.7 × 10² = 270 MJ.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"The prefix ladder","description":"A strip of metric prefixes from micro- to mega-, each a thousand times the one below."},
  sources: [source.s1_2],
  teaching: {
   intuition: "Physics meets numbers that are far too small or large to write comfortably. A timing pulse might last 0.000035 seconds; a battery bank might store 270000000 units of energy. Powers of ten tidy this up. 10³ is 1000 and 10⁻³ is 1 ÷ 1000 = 0.001, so 3.5 × 10⁻⁵ means 3.5 with the decimal point moved 5 places to the left. A metric prefix is a word in front of a unit that stands for a power of ten: kilo- (k) is 10³, mega- (M) is 10⁶, milli- (m) is 10⁻³ and micro- (μ, the Greek letter mu) is 10⁻⁶. So a kilometre is 10³ metres and a microsecond is 10⁻⁶ seconds. To write an amount in a prefixed unit, divide by the prefix’s power of ten, and remember that dividing powers of ten subtracts their exponents: 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ.",
   steps: [
    "Write the amount as a number times a power of ten, in the plain SI unit (s, m or J).",
    "Look up the power of ten of the prefix you want: milli- 10⁻³, micro- 10⁻⁶, kilo- 10³, mega- 10⁶.",
    "Divide by it by subtracting the exponents: the amount’s exponent minus the prefix’s exponent.",
    "Move the decimal point: a positive exponent moves it that many places to the right, a negative one to the left, and 10⁰ = 1 leaves the number as it is."
   ],
   example: {
    prompt: "A survey cable is 2.6 × 10⁴ m long and a sensor flash lasts 7.5 × 10⁻² s. Write the cable in kilometres and the flash in milliseconds.",
    steps: [
     "Cable: 2.6 × 10⁴ m ÷ 10³ = 2.6 × 10¹ = 26 km.",
     "Flash: 7.5 × 10⁻² s ÷ 10⁻³ = 7.5 × 10⁻²⁺³ = 7.5 × 10¹ = 75 ms."
    ],
    answer: "26 km and 75 ms."
   },
   pitfalls: [
    "Subtracting a negative exponent wrongly: −5 − (−6) is +1, not −11.",
    "Mixing up m for milli- with m for metre. In mm the first m is the prefix and the second is the unit; M (capital) is mega-.",
    "Multiplying by the prefix’s power instead of dividing. A microsecond is tiny, so a short time contains many of them: the number must get bigger."
   ]
  },
  guidance: [
   { prompt: "One microsecond is 10⁻⁶ s. What is 3.5 × 10⁻⁴ s ÷ 10⁻⁶, the pulse in microseconds?", answer: [350], labels: ["pulse (μs)"], explanation: "The exponents subtract: −4 − (−6) = 2, so the pulse is 3.5 × 10² = 350 μs." },
   { prompt: "One millimetre is 10⁻³ m. What is the gap, 4.8 × 10⁻² m, in millimetres?", answer: [48], labels: ["gap (mm)"], explanation: "−2 − (−3) = 1, so the gap is 4.8 × 10¹ = 48 mm." },
   { prompt: "One megajoule is 10⁶ J. What is the stored energy, 2.7 × 10⁸ J, in megajoules?", answer: [270], labels: ["energy (MJ)"], explanation: "8 − 6 = 2, so the energy is 2.7 × 10² = 270 MJ." }
  ]
 },
 {
  id: "q03", title: "Where the marker stands", topic: "Vector components from magnitude and angle", tier: 'Basic', sector: "Survey Office",
  brief: "Mira wants every survey marker on the ridge mapped as so far east and so far north of the mast.",
  lesson: "A vector of magnitude A at angle θ from the positive x-axis has components A cos θ along x and A sin θ along y.",
  prompt: "A survey marker stands 40 m from the survey mast. Take the mast as the origin, with the x-axis pointing east and the y-axis pointing north. The line from the mast to the marker makes an angle of 2.1 radians with the positive x-axis, measured anticlockwise (from east towards north). Enter the x component, then the y component, of the vector from the mast to the marker, in metres, each to 2 decimal places. A negative component points west or south.",
  answer: [-20.19,34.53], labels: ["x component (m)","y component (m)"], tolerance: 0.005,
  hints: [
   "The x component is the magnitude times the cosine of the angle, and the y component is the magnitude times the sine: Ax = A cos θ and Ay = A sin θ. Work in radians.",
   "Round only at the end. Between π/2 and π the cosine is negative; between π and 3π/2 the cosine and the sine are both negative; between 3π/2 and 2π the sine is negative."
  ],
  solution: "The angle 2.1 is between π/2 ≈ 1.57 and π ≈ 3.14, so the marker is north-west of the mast: the x component is negative and the y component positive. cos 2.1 ≈ −0.5048 and sin 2.1 ≈ 0.8632. The x component is 40 × cos 2.1 ≈ −20.1938 m, which is −20.19 m to 2 decimal places. The y component is 40 × sin 2.1 ≈ 34.5284 m, which is 34.53 m to 2 decimal places.",
  xp: 100, prereqs: ["q02"],
  artifact: {"name":"The marker map","description":"Survey markers plotted as east and north offsets from the mast."},
  sources: [source.s2_2],
  teaching: {
   intuition: "Some quantities are a single number with a unit, like a mass of 3 kg or a time of 5 s: these are scalars. Others also need a direction, like “40 m from the mast, towards the north-west”: these are vectors. The size of a vector, always positive, is its magnitude. To work with a vector we split it into two components, how far it goes along the x-axis (east) and how far along the y-axis (north). If the vector has magnitude A and makes an angle θ with the positive x-axis, measured anticlockwise, then right-triangle trigonometry gives the x component Ax = A cos θ and the y component Ay = A sin θ. A component is negative when it points west or south. Angles here are always in radians. We write î for the unit vector, of magnitude 1, pointing along x, and ĵ for the one along y, so a vector can be written A = Ax î + Ay ĵ.",
   steps: [
    "Read off the magnitude A and the angle θ, in radians, measured anticlockwise from the positive x-axis.",
    "Decide which quarter the angle is in: below π/2 both components are positive; between π/2 and π, x is negative; between π and 3π/2, both are negative; above 3π/2, y is negative.",
    "Work out Ax = A cos θ and Ay = A sin θ with a calculator set to radians; the signs come out by themselves.",
    "Round only at the end, and check that the signs match the quarter you found."
   ],
   example: {
    prompt: "A marker is 10 m from the mast at an angle of 0.5 radians anticlockwise from east. Find its x and y components to 2 decimal places.",
    steps: [
     "0.5 is between 0 and π/2, so both components are positive.",
     "cos 0.5 ≈ 0.8776, so Ax = 10 × 0.8776… ≈ 8.78 m.",
     "sin 0.5 ≈ 0.4794, so Ay = 10 × 0.4794… ≈ 4.79 m."
    ],
    answer: "Ax ≈ 8.78 m and Ay ≈ 4.79 m, so the vector to the marker is about 8.78î + 4.79ĵ metres."
   },
   pitfalls: [
    "Leaving the calculator in degrees. cos 2 in degrees is about 0.9994; in radians it is about −0.4161.",
    "Swapping sine and cosine. Measured from the x-axis, the cosine goes with x and the sine with y.",
    "Dropping a minus sign. A marker to the west has a negative x component, and the answer must keep it."
   ]
  },
  guidance: [
   { prompt: "What is the x component, 40 × cos 2.1, in metres to 2 decimal places?", answer: [-20.19], labels: ["x component (m)"], explanation: "cos 2.1 ≈ −0.5048, and 40 × cos 2.1 ≈ −20.1938, so the x component is −20.19 m." },
   { prompt: "What is the y component, 40 × sin 2.1, in metres to 2 decimal places?", answer: [34.53], labels: ["y component (m)"], explanation: "sin 2.1 ≈ 0.8632, and 40 × sin 2.1 ≈ 34.5284, so the y component is 34.53 m." }
  ]
 },
 {
  id: "q04", title: "Two legs, one arrow", topic: "Adding vectors by components", tier: 'Basic', sector: "Survey Office",
  brief: "A survey drone flew two legs, and the office needs the single straight move that would have taken it to the same place.",
  lesson: "The resultant of two vectors has components equal to the sums of their components; its magnitude and angle follow from those.",
  prompt: "A survey drone flies two straight legs from the mast. Its first move is the vector A = 7î − 2ĵ metres and its second is B = −3î + 8ĵ metres, where î is the unit vector pointing east and ĵ the unit vector pointing north. Enter the x component, then the y component, of the resultant R = A + B in metres, then its magnitude in metres to 2 decimal places, then its direction: the angle from the positive x-axis, anticlockwise, in radians to 2 decimal places. Both components of R are positive here, so that angle lies between 0 and π/2.",
  answer: [4,6,7.21,0.98], labels: ["Rx (m)","Ry (m)","magnitude (m)","angle (rad)"], tolerance: 0.005,
  hints: [
   "Add matching components: Rx = Ax + Bx and Ry = Ay + By.",
   "The magnitude is √(Rx² + Ry²). When both components are positive, the angle is tan⁻¹(Ry ÷ Rx), in radians."
  ],
  solution: "Rx = 7 + (−3) = 4 m and Ry = −2 + 8 = 6 m, so R = 4î + 6ĵ metres. Its magnitude is √(4² + 6²) = √52 ≈ 7.2111, which is 7.21 m to 2 decimal places. Its angle is tan⁻¹(6 ÷ 4) ≈ 0.9828, which is 0.98 radians to 2 decimal places.",
  xp: 100, prereqs: ["q03"],
  artifact: {"name":"The drone’s straight line","description":"Two flight legs and the single arrow that adds them up."},
  sources: [source.s2_3],
  teaching: {
   intuition: "Moving 3 m east and then 4 m north takes you to the same place as one straight move from start to finish. That single vector is the resultant, the sum of the two vectors. Drawn head to tail, the second arrow starts where the first ends and the resultant runs from the very start to the very end. With components, adding is easy: east parts add to east parts and north parts to north parts. If A = Ax î + Ay ĵ and B = Bx î + By ĵ, then R = A + B has Rx = Ax + Bx and Ry = Ay + By. Its magnitude comes from Pythagoras’ rule, |R| = √(Rx² + Ry²), and when both components are positive its direction is the angle tan⁻¹(Ry ÷ Rx), in radians from the positive x-axis. Here tan⁻¹ is the inverse tangent: the angle whose tangent is the given number.",
   steps: [
    "Write both vectors in components, with their signs.",
    "Add the x components to get Rx, and the y components to get Ry.",
    "Find the magnitude |R| = √(Rx² + Ry²).",
    "Find the direction. When Rx and Ry are both positive the angle from the positive x-axis is tan⁻¹(Ry ÷ Rx), between 0 and π/2; in other quarters the angle needs adjusting, as in the last mission."
   ],
   example: {
    prompt: "A = 3î + ĵ metres and B = î + 3ĵ metres. Find the resultant, its magnitude and its angle, to 2 decimal places.",
    steps: [
     "Rx = 3 + 1 = 4 and Ry = 1 + 3 = 4, so R = 4î + 4ĵ metres.",
     "|R| = √(16 + 16) = √32 ≈ 5.66 m.",
     "The angle is tan⁻¹(4 ÷ 4) = tan⁻¹ 1 ≈ 0.79 radians, which is π/4."
    ],
    answer: "R = 4î + 4ĵ metres, of magnitude about 5.66 m at about 0.79 radians."
   },
   pitfalls: [
    "Adding the magnitudes. Two 5 m moves can add up to anything from 0 m to 10 m, depending on their directions; only the components add.",
    "Losing a sign: adding −3 is subtracting 3.",
    "Taking tan⁻¹(Rx ÷ Ry) instead of tan⁻¹(Ry ÷ Rx). The angle is measured from the x-axis, so the y component goes on top."
   ]
  },
  guidance: [
   { prompt: "Add the x components of A and B. What is Rx, in metres?", answer: [4], labels: ["Rx (m)"], explanation: "Rx = 7 + (−3) = 4 m." },
   { prompt: "Add the y components of A and B. What is Ry, in metres?", answer: [6], labels: ["Ry (m)"], explanation: "Ry = −2 + 8 = 6 m." },
   { prompt: "What is the magnitude √(4² + 6²), in metres to 2 decimal places?", answer: [7.21], labels: ["magnitude (m)"], explanation: "4² + 6² = 16 + 36 = 52, and √52 ≈ 7.2111, so the magnitude is 7.21 m." },
   { prompt: "What is the angle tan⁻¹(6 ÷ 4), in radians to 2 decimal places?", answer: [0.98], labels: ["angle (rad)"], explanation: "6 ÷ 4 ≈ 1.5, and tan⁻¹ of that is about 0.9828 radians, which rounds to 0.98." }
  ]
 },
 {
  id: "q05", title: "The angle between two sight lines", topic: "The dot product and the angle between vectors", tier: 'Basic', sector: "Survey Office",
  brief: "Two sight lines leave the survey mast, and the office needs the angle between them without drawing anything.",
  lesson: "The dot product A · B = AxBx + AyBy also equals |A| |B| cos φ, so it gives the angle φ between two vectors.",
  prompt: "Two sight lines leave the survey mast along the vectors A = 4î + 3ĵ and B = 2î − 5ĵ, in metres (î points east, ĵ north). Enter the dot product A · B in square metres (m²), then the angle between the two sight lines in radians to 3 decimal places.",
  answer: [-7,1.834], labels: ["A · B (m²)","angle (rad)"], tolerance: 0.0005,
  hints: [
   "Multiply matching components and add: A · B = AxBx + AyBy.",
   "The dot product also equals |A| |B| cos φ, so cos φ = A · B ÷ (|A| |B|), and φ is the inverse cosine of that, between 0 and π."
  ],
  solution: "A · B = 4 × 2 + 3 × (−5) = 8 + (−15) = −7 m². The magnitudes are |A| = √25 ≈ 5 m and |B| = √29 ≈ 5.3852 m. So cos φ = −7 ÷ (5 × 5.3852) ≈ −0.26, and φ = cos⁻¹(−0.26) ≈ 1.8338, which is 1.834 radians to 3 decimal places.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"The sighting wheel","description":"A dial that reads the angle between two lines from their components."},
  sources: [source.s2_4],
  teaching: {
   intuition: "There is a way to multiply two vectors that gives a scalar, a plain number: the dot product, written with a dot, A · B. In components, multiply the x parts, multiply the y parts and add: A · B = AxBx + AyBy. Its unit is the product of the two units, so for two vectors in metres it is in square metres. The same number also equals |A| |B| cos φ, where φ (the Greek letter phi) is the angle between the two vectors, from 0 to π. That second form is why the dot product is useful: it measures how much two vectors point the same way. It is positive when the angle is less than π/2, zero when they are at right angles, and negative when the angle is more than π/2. Putting the two forms together, cos φ = A · B ÷ (|A| |B|), and the inverse cosine cos⁻¹ turns that into the angle.",
   steps: [
    "Work out the dot product from the components: A · B = AxBx + AyBy.",
    "Work out each magnitude: |A| = √(Ax² + Ay²) and |B| = √(Bx² + By²).",
    "Divide: cos φ = A · B ÷ (|A| |B|). It always lies between −1 and 1.",
    "Take the inverse cosine, in radians: φ = cos⁻¹(cos φ), between 0 and π. Round only at the end."
   ],
   example: {
    prompt: "A = î + 2ĵ and B = 3î + ĵ, in metres. Find A · B and the angle between them, to 3 decimal places.",
    steps: [
     "A · B = 1 × 3 + 2 × 1 = 5 m².",
     "|A| = √5 ≈ 2.236 m and |B| = √10 ≈ 3.162 m, so |A| |B| = √50 ≈ 7.071.",
     "cos φ = 5 ÷ 7.071… ≈ 0.7071, and cos⁻¹ 0.7071… ≈ 0.785 radians, which is π/4."
    ],
    answer: "A · B = 5 m² and the angle is about 0.785 radians."
   },
   pitfalls: [
    "Multiplying across, Ax × By, instead of matching components: x goes with x and y with y.",
    "Rounding the magnitudes or cos φ early. The inverse cosine is sensitive, so keep every digit until the last step.",
    "Thinking a negative dot product is a mistake. It means the angle is more than π/2, and the inverse cosine handles it."
   ]
  },
  guidance: [
   { prompt: "What is A · B = 4 × 2 + 3 × (−5), in square metres?", answer: [-7], labels: ["A · B (m²)"], explanation: "8 + (−15) = −7 m²." },
   { prompt: "What is the magnitude |A| = √(4² + 3²), in metres to 3 decimal places?", answer: [5], labels: ["|A| (m)"], explanation: "|A| = √25 ≈ 5. Keep the unrounded value for the last step." },
   { prompt: "What is the magnitude |B| = √(2² + (−5)²), in metres to 3 decimal places?", answer: [5.385], labels: ["|B| (m)"], explanation: "|B| = √29 ≈ 5.3852. Keep the unrounded value for the last step." },
   { prompt: "cos φ = A · B ÷ (|A| |B|). What is the angle φ, in radians to 3 decimal places?", answer: [1.834], labels: ["angle (rad)"], explanation: "cos φ = −7 ÷ (5 × 5.3852) ≈ −0.26, and cos⁻¹(−0.26) ≈ 1.8338, so φ ≈ 1.834 radians." }
  ]
 },
 {
  id: "q06", title: "The sled that turned back", topic: "Position, displacement, distance and average velocity", tier: 'Basic', sector: "Survey Office",
  brief: "A test sled went up the run, turned round and came back down, and the log needs three different numbers for its trip.",
  lesson: "Displacement is the change in position; distance adds up every leg as positive; average velocity is displacement divided by time.",
  prompt: "On the sled run, positions are measured in metres from a marker post, with uphill as the positive direction. A sled starts at x = 12 m at t = 0 s. At t = 6 s it is at x = 40 m, where it turns round, and at t = 10 s it stops at x = −8 m; between those moments it keeps going one way. Enter its displacement over the whole trip in metres, then the distance it travelled in metres, then its average velocity over the whole trip in metres per second (a negative value means downhill).",
  answer: [-20,76,-2], labels: ["displacement (m)","distance (m)","average velocity (m/s)"], tolerance: 0.01,
  hints: [
   "The displacement is the final position minus the starting position, Δx = x(final) − x(start). The turn does not change it.",
   "The distance adds the lengths of the two legs, each counted as positive. The average velocity is the displacement divided by the whole time, Δx ÷ Δt."
  ],
  solution: "Displacement: Δx = −8 − 12 = −20 m. The first leg is from 12 m to 40 m, a length of 28 m; the second is from 40 m to −8 m, a length of 48 m. The distance is 28 + 48 = 76 m. The average velocity is −20 m ÷ 10 s = −2 m/s.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"The first trip log","description":"A sled’s trip written three ways: where it ended, how far it went and how fast on average."},
  sources: [source.s3_1],
  teaching: {
   intuition: "To describe motion along a straight track we pick a reference point, a direction called positive, and a unit. A body’s position x is then a signed number: x = −8 m means 8 metres from the reference point on the negative side. Displacement is the change in position, Δx = x(final) − x(start). It is a vector along the line, so it has a sign and it ignores everything that happened in between: a sled that goes up 30 m and comes back to where it started has a displacement of 0. Distance travelled is different: it adds up the length of every leg, each counted as positive, so it is a scalar and never smaller than the size of the displacement. Velocity is a rate of change of position, and the average velocity over a time Δt is Δx ÷ Δt, in metres per second; its sign gives the direction.",
   steps: [
    "Fix the starting position, every turning point and the final position, all as signed numbers.",
    "Displacement: subtract, final position minus starting position.",
    "Distance: find the length of each leg between turning points as a positive number, and add them.",
    "Average velocity: divide the displacement, not the distance, by the whole time taken."
   ],
   example: {
    prompt: "A sled starts at x = 5 m, slides up to x = 15 m, then comes back to stop at x = 9 m, 4 seconds after it started. Find its displacement, its distance travelled and its average velocity.",
    steps: [
     "Displacement: 9 − 5 = 4 m.",
     "Legs: from 5 to 15 is 10 m and from 15 to 9 is 6 m, so the distance is 16 m.",
     "Average velocity: 4 m ÷ 4 s = 1 m/s."
    ],
    answer: "Displacement 4 m, distance 16 m, average velocity 1 m/s."
   },
   pitfalls: [
    "Dividing the distance by the time. That gives the average speed, not the average velocity.",
    "Forgetting that a leg can go in the negative direction: from 40 m to −8 m is a leg 48 m long.",
    "Subtracting in the wrong order. Final minus start gives the right sign; start minus final reverses it."
   ]
  },
  guidance: [
   { prompt: "What is the displacement, the final position −8 m minus the starting position 12 m?", answer: [-20], labels: ["displacement (m)"], explanation: "Δx = −8 − 12 = −20 m. Only the two ends count." },
   { prompt: "How long is the first leg of the trip, from 12 m to 40 m, in metres?", answer: [28], labels: ["first leg (m)"], explanation: "The first leg is 28 m long. A length is never negative, whichever way the sled went." },
   { prompt: "How long is the second leg, from 40 m to −8 m, in metres?", answer: [48], labels: ["second leg (m)"], explanation: "The second leg is 48 m long, again counted as positive." },
   { prompt: "What is the total distance, the two leg lengths added, in metres?", answer: [76], labels: ["distance (m)"], explanation: "The distance is 28 + 48 = 76 m." },
   { prompt: "What is the average velocity, the displacement divided by the 10 s of the trip, in metres per second?", answer: [-2], labels: ["average velocity (m/s)"], explanation: "The average velocity is −20 ÷ 10 = −2 m/s." }
  ]
 },
 {
  id: "q07", title: "The winch and the slipping sled", topic: "Instantaneous velocity as the derivative of position", tier: 'Basic', sector: "Sled Run",
  brief: "The winch on the sled run drags a sled up and then lets it slip, and the crew wants its exact velocity at given moments.",
  lesson: "Instantaneous velocity is the derivative of position, v(t) = dx/dt; speed is its size, with the sign dropped.",
  prompt: "A winch drags a sled up the run and then lets it slip back. Its position is x(t) = 10 + 4t + 3t² − t³ metres, t seconds after the start, with uphill as positive. Enter its velocity at t = 1 s, then its velocity at t = 3 s, both in metres per second, then its speed at t = 3 s in metres per second.",
  answer: [7,-5,5], labels: ["velocity at the first time (m/s)","velocity at the second time (m/s)","speed at the second time (m/s)"], tolerance: 0.01,
  hints: [
   "The velocity is the derivative of the position, v(t) = dx/dt. Differentiate term by term with the power rule.",
   "Speed is the size of the velocity, with its sign dropped: it is never negative."
  ],
  solution: "v(t) = dx/dt = 4 + 6t − 3t². At t = 1: v = 4 + 6 × 1 − 3 × 1 = 7 m/s, so the sled is moving uphill. At t = 3: v = 4 + 6 × 3 − 3 × 9 = −5 m/s, so it is sliding downhill, and its speed is 5 m/s.",
  xp: 100, prereqs: ["q06"],
  artifact: {"name":"The winch speedometer","description":"A needle that reads velocity straight from the position formula."},
  sources: [source.s3_2],
  teaching: {
   intuition: "An average velocity smooths a whole trip into one number, but a sled that is speeding up or slowing down has a different velocity at each moment. Calculus 1 already has the answer: the rate of change at one instant is the derivative. So if the position is a function x(t) of the time t, the instantaneous velocity is v(t) = dx/dt, the limit of Δx ÷ Δt as the time interval shrinks to 0. It is in metres per second when x is in metres and t in seconds, and its sign says which way the body is moving at that instant: positive means the positive direction. Speed is the size of the velocity with its sign dropped, |v|, so it is never negative. A sled sliding back down at 5 m/s has velocity −5 m/s and speed 5 m/s.",
   steps: [
    "Write the position x(t) as a polynomial in t.",
    "Differentiate term by term with the power rule: a constant gives 0, ct gives c, bt² gives 2bt, at³ gives 3at².",
    "Put the time into v(t) to get the velocity at that instant, with its sign.",
    "For the speed, drop the sign."
   ],
   example: {
    prompt: "A cart’s position is x(t) = 2t² + 5t metres after t seconds. What are its velocity and its speed at t = 2 s?",
    steps: [
     "v(t) = dx/dt = 4t + 5.",
     "v(2) = 4 × 2 + 5 = 13 m/s.",
     "The velocity is positive, so the speed is also 13 m/s."
    ],
    answer: "Velocity 13 m/s and speed 13 m/s at t = 2 s."
   },
   pitfalls: [
    "Putting the time into x(t) instead of v(t). That gives where the sled is, not how fast it is moving.",
    "Forgetting the factor from the power rule: the derivative of 3t² is 6t, not 3t.",
    "Giving the speed a minus sign. Speed is the size of the velocity and is never negative."
   ]
  },
  guidance: [
   { prompt: "Differentiate x(t) = 10 + 4t + 3t² − t³. What is the constant term of v(t)?", answer: [4], labels: ["constant term"], explanation: "The constant 10 has derivative 0 and 4t gives 4, so the constant term of v(t) is 4." },
   { prompt: "What is the number in front of t in v(t)?", answer: [6], labels: ["number in front of t"], explanation: "3t² gives 6t, so the number is 6." },
   { prompt: "What is the number in front of t² in v(t)?", answer: [-3], labels: ["number in front of t²"], explanation: "−t³ gives −3t², so the number is −3 and v(t) = 4 + 6t − 3t²." },
   { prompt: "What is v(1), the velocity at t = 1 s, in metres per second?", answer: [7], labels: ["velocity (m/s)"], explanation: "4 + 6 × 1 − 3 × 1 = 7 m/s. It is positive, so the sled is going uphill." },
   { prompt: "What is the velocity at t = 3 s, in metres per second?", answer: [-5], labels: ["velocity (m/s)"], explanation: "4 + 6 × 3 − 3 × 9 = −5 m/s. The minus sign says downhill." },
   { prompt: "What is the speed at t = 3 s, in metres per second?", answer: [5], labels: ["speed (m/s)"], explanation: "The speed drops the sign of the velocity: 5 m/s." }
  ]
 },
 {
  id: "q08", title: "How fast the speed changes", topic: "Average and instantaneous acceleration", tier: 'Basic', sector: "Sled Run",
  brief: "The sled run’s brakes and boosters are tuned by acceleration, so the crew wants it both over a stretch and at one moment.",
  lesson: "Average acceleration is Δv ÷ Δt; instantaneous acceleration is the derivative of velocity, a(t) = dv/dt, in m/s².",
  prompt: "A sled’s velocity on the run is v(t) = 2t² − 3t + 5 metres per second, t seconds after it is released, with uphill as positive. Enter its average acceleration from t = 1 s to t = 4 s, then its instantaneous acceleration at t = 4 s, both in metres per second squared (m/s²).",
  answer: [7,13], labels: ["average acceleration (m/s²)","instantaneous acceleration (m/s²)"], tolerance: 0.01,
  hints: [
   "The average acceleration is the change in velocity divided by the change in time, Δv ÷ Δt.",
   "The instantaneous acceleration is the derivative of the velocity, a(t) = dv/dt."
  ],
  solution: "v(1) = 4 m/s and v(4) = 25 m/s, so the average acceleration is (25 − 4) ÷ (4 − 1) = 21 ÷ 3 = 7 m/s². The derivative is a(t) = 4t − 3, so at t = 4 the acceleration is 4 × 4 − 3 = 13 m/s².",
  xp: 100, prereqs: ["q07"],
  artifact: {"name":"The acceleration gauge","description":"A gauge that shows how quickly a sled’s velocity is changing."},
  sources: [source.s3_3],
  teaching: {
   intuition: "Acceleration is to velocity what velocity is to position: the rate at which it changes. If a sled’s velocity goes from 4 m/s to 25 m/s in 3 seconds, its velocity rose by 21 m/s, which is 7 metres per second in every second. That is written 7 m/s², read “metres per second squared”. The average acceleration over a time interval is the change in velocity divided by the change in time, Δv ÷ Δt. The instantaneous acceleration at one moment is the derivative of the velocity, a(t) = dv/dt, just as velocity is the derivative of position. Acceleration has a sign too: a negative acceleration means the velocity is decreasing, which slows a sled moving in the positive direction but speeds up one moving in the negative direction.",
   steps: [
    "For the average acceleration, find the velocity at the start and at the end of the interval.",
    "Divide the change in velocity, end minus start, by the change in time.",
    "For the instantaneous acceleration, differentiate v(t) to get a(t).",
    "Put the moment into a(t). Both answers are in m/s²."
   ],
   example: {
    prompt: "A sled’s velocity is v(t) = t² + 4t metres per second. Find its average acceleration from t = 0 s to t = 2 s and its instantaneous acceleration at t = 2 s.",
    steps: [
     "v(0) = 0 and v(2) = 4 + 8 = 12 m/s, so the average acceleration is (12 − 0) ÷ 2 = 6 m/s².",
     "a(t) = dv/dt = 2t + 4, so a(2) = 8 m/s²."
    ],
    answer: "Average 6 m/s², instantaneous 8 m/s² at t = 2 s."
   },
   pitfalls: [
    "Dividing the final velocity by the time instead of the change in velocity by the change in time.",
    "Expecting the average and the instantaneous accelerations to agree. They are equal only when the acceleration is constant.",
    "Differentiating the velocity twice. One derivative of v(t) gives the acceleration."
   ]
  },
  guidance: [
   { prompt: "What is the velocity v(1), in metres per second?", answer: [4], labels: ["v at the start (m/s)"], explanation: "Put t = 1 into v(t) = 2t² − 3t + 5: v(1) = 4 m/s." },
   { prompt: "What is the velocity v(4), in metres per second?", answer: [25], labels: ["v at the end (m/s)"], explanation: "Put t = 4 into v(t) = 2t² − 3t + 5: v(4) = 25 m/s." },
   { prompt: "What is the average acceleration, (v(4) − v(1)) ÷ (4 − 1), in m/s²?", answer: [7], labels: ["average acceleration (m/s²)"], explanation: "21 m/s of change in 3 s gives 7 m/s²." },
   { prompt: "Differentiate: a(t) = 4t − 3. What is a(4), in m/s²?", answer: [13], labels: ["instantaneous acceleration (m/s²)"], explanation: "4 × 4 − 3 = 13 m/s². It is not the average, because the acceleration changes during the interval." }
  ]
 },
 {
  id: "q09", title: "Braking on the flat", topic: "Motion with constant acceleration", tier: 'Basic', sector: "Sled Run",
  brief: "Cargo sleds brake on the flat at the foot of the run, and the crew must know how long and how far each one takes to stop.",
  lesson: "With constant acceleration a: v = v₀ + at, x = x₀ + v₀t + ½at² and v² = v₀² + 2a(x − x₀).",
  prompt: "A cargo sled is moving along the flat run at 20 m/s when its brakes come on. They slow it with a constant deceleration of 2.5 m/s², so, taking its direction of motion as positive, its acceleration is −2.5 m/s². Enter the time it takes to stop in seconds, then the distance it slides while braking in metres.",
  answer: [8, 80], labels: ["stopping time (s)","stopping distance (m)"], tolerance: 0.005,
  hints: [
   "Use v = v₀ + at with the final velocity v = 0, and solve for t.",
   "Use v² = v₀² + 2a(x − x₀) with v = 0: the stopping distance x − x₀ is v₀² ÷ (2 × the deceleration)."
  ],
  solution: "From v = v₀ + at: 0 = 20 − 2.5t, so t = 20 ÷ 2.5 = 8 s. From v² = v₀² + 2a(x − x₀): 0 = 400 − 2 × 2.5 × (x − x₀), so x − x₀ = 400 ÷ 5 = 80 m.",
  xp: 100, prereqs: ["q08"],
  artifact: {"name":"The braking chart","description":"Stopping times and distances for every sled speed on the flat."},
  sources: [source.s3_4],
  teaching: {
   intuition: "When the acceleration a stays the same the whole time, the derivatives of the last two missions can be undone once and for all. Write v₀ for the velocity and x₀ for the position at t = 0. The velocity changes by a every second, so v = v₀ + at. Integrating that gives the position, x = x₀ + v₀t + ½at². Eliminating t between the two gives a third equation without any time in it: v² = v₀² + 2a(x − x₀). These are the kinematic equations, and each problem needs the one that links what you know to what you want. Braking is the classic case. A deceleration is an acceleration against the motion: if the direction of motion is positive, a deceleration of 3 m/s² is an acceleration of −3 m/s². The body stops when v = 0.",
   steps: [
    "Choose the positive direction (the way the body is moving) and write down v₀, a with its sign, and the final velocity (0 for a stop).",
    "For the time, use v = v₀ + at and solve for t.",
    "For the distance without the time, use v² = v₀² + 2a(x − x₀) and solve for x − x₀.",
    "Check: under constant acceleration the average velocity is halfway between v₀ and v, so the distance is also that average times the time."
   ],
   example: {
    prompt: "A sled at 12 m/s brakes with a constant deceleration of 3 m/s². How long and how far does it take to stop?",
    steps: [
     "Time: 0 = 12 − 3t, so t = 4 s.",
     "Distance: 0 = 144 − 2 × 3 × (x − x₀), so x − x₀ = 144 ÷ 6 = 24 m.",
     "Check: the average velocity is 6 m/s, and 6 × 4 = 24 m."
    ],
    answer: "4 s and 24 m."
   },
   pitfalls: [
    "Using a deceleration as a positive acceleration. Against the motion it must be negative, or the sled speeds up and never stops.",
    "Forgetting the 2 in v² = v₀² + 2a(x − x₀), which doubles the stopping distance.",
    "Multiplying the starting speed by the time to get the distance. The sled slows down, so it covers only half that."
   ]
  },
  guidance: [
   { prompt: "The sled stops when v = 0. Solve 0 = 20 − 2.5t. What is t, in seconds?", answer: [8], labels: ["stopping time (s)"], explanation: "2.5t = 20, so t = 20 ÷ 2.5 = 8 s." },
   { prompt: "The third equation needs v₀². What is 20², in square metres per second squared?", answer: [400], labels: ["v₀² (m²/s²)"], explanation: "20 × 20 = 400." },
   { prompt: "Solve 0 = 400 − 2 × 2.5 × (x − x₀). What is the stopping distance x − x₀, in metres?", answer: [80], labels: ["stopping distance (m)"], explanation: "2 × 2.5 = 5, and 400 ÷ 5 = 80 m. Check: the average speed while braking is 10 m/s, and 10 × 8 = 80 m." }
  ]
 },
 {
  id: "q10", title: "The pod thrown from the tower", topic: "Free fall with g = 9.8 m/s²", tier: 'Basic', sector: "Sled Run",
  brief: "Marker pods are thrown from the lookout tower to flag the sled run, and the crew wants to know how high they go and when they land.",
  lesson: "In free fall the only acceleration is g = 9.8 m/s² downwards, so the kinematic equations apply with a = −g when up is positive.",
  prompt: "A crew member on the lookout tower at the top of the sled run throws a marker pod straight up at 14 m/s. The pod leaves her hand 20 m above the ground and is then in free fall: take g = 9.8 m/s², upwards as positive, and ignore air resistance. Enter the time it takes to reach its highest point in seconds, then its greatest height above the ground in metres, then the time from the throw until it hits the ground in seconds, each to 2 decimal places.",
  answer: [1.43,30,3.9], labels: ["time to the top (s)","greatest height (m)","time to land (s)"], tolerance: 0.005,
  hints: [
   "At the highest point the velocity is 0 for an instant: solve 0 = v₀ − gt for t.",
   "The pod lands when its height y = h + v₀t − ½gt² is 0. Solve that quadratic with the quadratic formula and keep the positive root."
  ],
  solution: "Top: 0 = 14 − 9.8t gives t = 14 ÷ 9.8 ≈ 1.4286, which is 1.43 s. From v² = v₀² − 2g(y − y₀), the rise above the hand is 196 ÷ 19.6 ≈ 10 m, so the greatest height is 20 + 10 ≈ 30, which is 30.00 m. Landing: 4.9t² − 14t − 20 = 0, so t = (14 + √(196 + 19.6 × 20)) ÷ 9.8 = (14 + √588) ÷ 9.8 ≈ 3.9029, which is 3.90 s.",
  xp: 100, prereqs: ["q09"],
  artifact: {"name":"The tower pod","description":"A bright marker pod that rises, stops for an instant and falls."},
  sources: [source.s3_5],
  teaching: {
   intuition: "Drop or throw something and, when air resistance is small enough to ignore, it moves with the same constant downward acceleration whatever its mass. That motion under gravity alone is free fall, and near the ground the acceleration is g = 9.8 m/s², pointing down. With upwards taken as positive, a = −g, so the kinematic equations of the last mission become v = v₀ − gt and y = y₀ + v₀t − ½gt², with y the height. A pod thrown straight up slows by 9.8 m/s every second until, for an instant at the top, its velocity is 0; then it falls back, speeding up at the same rate. The highest point comes when v = 0, and the pod lands when its height y is 0, which is a quadratic equation in t.",
   steps: [
    "Take upwards as positive, so v₀ is positive for a throw upwards and a = −9.8 m/s². Let y₀ be the starting height.",
    "Time to the top: solve 0 = v₀ − gt, so t = v₀ ÷ g.",
    "Greatest height: from v² = v₀² − 2g(y − y₀) with v = 0, the rise is v₀² ÷ (2g); add it to the starting height.",
    "Landing: solve y₀ + v₀t − ½gt² = 0 with the quadratic formula and keep the positive root."
   ],
   example: {
    prompt: "A pod is thrown straight up at 19.6 m/s from the ground. When is it at the top, how high does it go, and when does it land?",
    steps: [
     "Top: t = 19.6 ÷ 9.8 = 2 s.",
     "Height: 19.6² ÷ 19.6 = 19.6 m.",
     "Landing: 19.6t − 4.9t² = 0 gives t = 0 (the throw) or t = 19.6 ÷ 4.9 = 4 s."
    ],
    answer: "Top after 2 s at 19.6 m, landing after 4 s."
   },
   pitfalls: [
    "Taking g as positive while upwards is positive. Then the pod never comes down.",
    "Thinking the acceleration is 0 at the top. The velocity is 0 for an instant, but gravity still pulls it at 9.8 m/s².",
    "Doubling the time to the top to get the landing time when the throw starts above the ground. The fall below the starting height takes extra time."
   ]
  },
  guidance: [
   { prompt: "At the top the velocity is 0. Solve 0 = 14 − 9.8t: what is t, in seconds to 2 decimal places?", answer: [1.43], labels: ["time to the top (s)"], explanation: "t = 14 ÷ 9.8 ≈ 1.4286 s, which rounds to 1.43 s." },
   { prompt: "The pod rises v₀² ÷ (2g) above the hand. What is its greatest height above the ground, in metres to 2 decimal places?", answer: [30], labels: ["greatest height (m)"], explanation: "196 ÷ 19.6 ≈ 10 m above the hand, and 20 + 10 ≈ 30 m above the ground, which rounds to 30.00 m." },
   { prompt: "Landing means 20 + 14t − 4.9t² = 0. What is the positive root, in seconds to 2 decimal places?", answer: [3.9], labels: ["time to land (s)"], explanation: "Rewritten as 4.9t² − 14t − 20 = 0, the quadratic formula gives t = (14 ± √588) ÷ 9.8. The root with + is about 3.9029, which rounds to 3.90 s; the other root is negative, before the throw." }
  ]
 }
);
})();
