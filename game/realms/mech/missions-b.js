/* Mechanics: motion and force missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/mech/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Motion on a line · Basic, 100 XP · sector 'Sled Run' · Chapter review: velocity and position from acceleration by integrating [3.6, 3.4]
     q12  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Projectile launched horizontally: two motions at once [4.3]
     q13  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Projectile launched at an angle: range and highest point [4.3]
     q14  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Uniform circular motion: period and centripetal acceleration [4.4]
     q15  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Speeding up on a circle: tangential and total acceleration [4.4]
     q16  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Relative motion: velocity seen from a moving frame [4.5]
     q17  ch 3 Motion in a plane · Intermediate, 150 XP · sector 'Catapult Field' · Chapter review: motion in a plane [4.3, 4.4]
     q18  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · Force and Newton's second law, net force ΣF = ma [5.3]
     q19  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · Mass, weight and the normal force (lift cage speeding up) [5.4, 5.6]
     q20  ch 4 Forces · Intermediate, 150 XP · sector 'Crane Yard' · Newton's third law and tension: two crates on one cable [5.5, 6.1] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 sections, one entry per section the missions below cite. Each page was opened on the
   date in `verified` and its description says only what that section states. */
const source = {
 s3_4: { title: "OpenStax University Physics Volume 1 — 3.4 Motion with Constant Acceleration", url: "https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration", description: "The equations for constant acceleration, including v = v₀ + at and x = x₀ + v₀t + ½at².", verified: "2026-11-28" },
 s3_6: { title: "OpenStax University Physics Volume 1 — 3.6 Finding Velocity and Displacement from Acceleration", url: "https://openstax.org/books/university-physics-volume-1/pages/3-6-finding-velocity-and-displacement-from-acceleration", description: "Velocity as the integral of acceleration and position as the integral of velocity, with the constants fixed by v(0) and x(0).", verified: "2026-11-28" },
 s4_3: { title: "OpenStax University Physics Volume 1 — 4.3 Projectile Motion", url: "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion", description: "Projectile motion: independent horizontal and vertical motions, time of flight, maximum height and range on level ground.", verified: "2026-11-28" },
 s4_4: { title: "OpenStax University Physics Volume 1 — 4.4 Uniform and Nonuniform Circular Motion", url: "https://openstax.org/books/university-physics-volume-1/pages/4-4-uniform-circular-motion", description: "Centripetal acceleration v²/r, the period of a turn, tangential acceleration and the total acceleration √(a_c² + a_T²).", verified: "2026-11-28" },
 s4_5: { title: "OpenStax University Physics Volume 1 — 4.5 Relative Motion in One and Two Dimensions", url: "https://openstax.org/books/university-physics-volume-1/pages/4-5-relative-motion-in-one-and-two-dimensions", description: "Reference frames and the addition of relative velocities, v_PS = v_PS′ + v_S′S, with a plane flying in a wind.", verified: "2026-11-28" },
 s5_3: { title: "OpenStax University Physics Volume 1 — 5.3 Newton’s Second Law", url: "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law", description: "Newton’s second law, ΣF = ma, in vector and component form, with the acceleration in the direction of the net external force.", verified: "2026-11-28" },
 s5_4: { title: "OpenStax University Physics Volume 1 — 5.4 Mass and Weight", url: "https://openstax.org/books/university-physics-volume-1/pages/5-4-mass-and-weight", description: "Weight as the gravitational force w = mg, and how mass differs from weight.", verified: "2026-11-28" },
 s5_5: { title: "OpenStax University Physics Volume 1 — 5.5 Newton’s Third Law", url: "https://openstax.org/books/university-physics-volume-1/pages/5-5-newtons-third-law", description: "Newton’s third law: equal and opposite forces on different bodies, and internal forces cancelling inside a chosen system.", verified: "2026-11-28" },
 s5_6: { title: "OpenStax University Physics Volume 1 — 5.6 Common Forces", url: "https://openstax.org/books/university-physics-volume-1/pages/5-6-common-forces", description: "The normal force, perpendicular to the supporting surface, and tension, the pull along a rope or cable.", verified: "2026-11-28" },
 s6_1: { title: "OpenStax University Physics Volume 1 — 6.1 Solving Problems with Newton’s Laws", url: "https://openstax.org/books/university-physics-volume-1/pages/6-1-solving-problems-with-newtons-laws", description: "A problem-solving strategy built on free-body diagrams, with connected objects whose acceleration and string tension are found.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "The booster sled", topic: "Velocity and position from acceleration", tier: "Basic", sector: "Sled Run",
  brief: "A new rocket sled has a booster whose push changes as it burns, and Mira wants to know where it will be and how fast it will be going a few seconds after the start.",
  lesson: "Integrate the acceleration to get the velocity, using v(0) for the constant, then integrate the velocity to get the position, using x(0).",
  prompt: "A rocket sled on the Sled Run has a booster whose push changes as it burns, so the sled’s acceleration is not constant: it is a(t) = 2 + 3t m/s², t seconds after the start. Distances are measured down the run from the top marker, with positive meaning down the run. At t = 0 the sled is at x(0) = 10 m with velocity v(0) = 4 m/s. Enter its velocity at t = 4 s in metres per second, then its position at t = 4 s in metres.",
  answer: [36, 74], labels: ["velocity (m/s)", "position (m)"], tolerance: 0.01,
  hints: [
   "Velocity is an antiderivative of acceleration: v(t) = ∫a(t) dt + C, and the constant C is the velocity at t = 0.",
   "Position is an antiderivative of velocity: x(t) = ∫v(t) dt + C, and this constant is the position at t = 0."
  ],
  solution: "An antiderivative of a(t) = 2 + 3t is 2t + 1.5t². At t = 0 it is 0, so the constant is v(0) = 4 and v(t) = 4 + 2t + 1.5t². At t = 4: v = 4 + 8 + 24 = 36 m/s. An antiderivative of v(t) is 4t + t² + 0.5t³, and the constant is x(0) = 10, so x(t) = 10 + 4t + t² + 0.5t³. At t = 4: x = 10 + 16 + 16 + 32 = 74 m.",
  xp: 100, prereqs: ["q08", "q10"],
  artifact: { name: "Booster run sheet", description: "An acceleration, its two integrals, and the two constants that pin them down." },
  sources: [source.s3_6, source.s3_4],
  teaching: {
   intuition: "Velocity is the derivative of position and acceleration is the derivative of velocity. So we can run the chain backwards: an antiderivative of the acceleration gives the velocity, and an antiderivative of the velocity gives the position. Each antiderivative comes with a constant you are free to choose, and the start of the run fixes it: put t = 0 in and the constant must be the starting velocity, or the starting position. This works for any acceleration, even one that changes from moment to moment. When the acceleration is a constant a, it gives exactly the constant-acceleration equations: v = v₀ + at and x = x₀ + v₀t + ½at².",
   steps: [
    "Find an antiderivative of a(t), term by term: the antiderivative of a number b is bt, and of ct it is ct² ÷ 2.",
    "Add a constant and choose it so that the velocity at t = 0 is v(0). That gives v(t).",
    "Find an antiderivative of v(t) in the same way, adding the constant x(0) so that the position at t = 0 is right. That gives x(t).",
    "Put the asked time into v(t) and x(t). Keep the units: m/s for velocity, metres for position."
   ],
   example: {
    prompt: "A sled has acceleration a(t) = 4 + 6t m/s², with v(0) = 1 m/s and x(0) = 5 m. Find its velocity and position at t = 2 s.",
    steps: [
     "Integrate: v(t) = 1 + 4t + 3t². At t = 2: v = 1 + 8 + 12 = 21 m/s.",
     "Integrate again: x(t) = 5 + t + 2t² + t³. At t = 2: x = 5 + 2 + 8 + 8 = 23 m."
    ],
    answer: "Velocity 21 m/s, position 23 m."
   },
   pitfalls: [
    "Forgetting the constant: leaving out v(0) or x(0) gives the change in velocity or position, not the value.",
    "Using v = v₀ + at when the acceleration changes with time. That equation holds only for a constant acceleration.",
    "Integrating ct as ct² instead of ct² ÷ 2, or ct² as ct³ instead of ct³ ÷ 3."
   ]
  },
  guidance: [
   { prompt: "Integrate a(t) = 2 + 3t and add v(0): v(t) = 4 + 2t + kt². What is the number k, in m/s³?", answer: [1.5], labels: ["k (m/s³)"], explanation: "The antiderivative of 3t is 3t² ÷ 2, so k = 3 ÷ 2 = 1.5." },
   { prompt: "Put t = 4 into v(t) = 4 + 2t + 1.5t². What is the velocity, in m/s?", answer: [36], labels: ["velocity (m/s)"], explanation: "4 + 2 × 4 + 1.5 × 16 = 36 m/s." },
   { prompt: "Integrate v(t) and add x(0) = 10: x(t) = 10 + 4t + t² + 0.5t³. What is the position at t = 4, in metres?", answer: [74], labels: ["position (m)"], explanation: "10 + 4 × 4 + 1 × 16 + 0.5 × 64 = 74 m." }
  ]
 },
 {
  id: "q12", title: "Off the crater rim", topic: "Projectile launched horizontally", tier: "Intermediate", sector: "Catapult Field",
  brief: "A pod launcher on the crater rim fires supply pods straight out sideways, and the ground crew needs to know where to stand to catch them.",
  lesson: "A projectile moves sideways at a steady speed and falls freely at the same time; the fall alone sets the time in the air.",
  prompt: "The catapult crew tests a pod launcher on the rim of the crater. It fires a supply pod straight out sideways (horizontally) at 12 m/s from a platform 20 m above the flat crater floor. Ignore the air and take g = 9.8 m/s². Enter the time the pod is in the air in seconds, then how far it lands from the foot of the platform, measured along the floor, in metres. Give both to 2 decimal places, and work out the distance from the unrounded time.",
  answer: [2.02, 24.24], labels: ["time in the air (s)", "distance from the platform (m)"], tolerance: 0.005,
  hints: [
   "The fall is free fall that starts with no up or down speed: the drop is ½gt², so set ½ × 9.8 × t² equal to the height and solve for t.",
   "Sideways nothing pushes the pod, so its sideways speed stays the same the whole time: distance = sideways speed × time in the air."
  ],
  solution: "Down: 20 = ½ × 9.8 × t², so t² = 2 × 20 ÷ 9.8 ≈ 4.0816 and t = √4.0816 ≈ 2.0203, which is 2.02 s to 2 decimal places. Sideways: the speed stays 12 m/s, so the pod travels 12 × 2.0203 ≈ 24.2437 m, which is 24.24 m to 2 decimal places.",
  xp: 150, prereqs: ["q10", "q03"],
  artifact: { name: "Rim launcher chart", description: "Two motions at once: a steady sideways glide and a free fall." },
  sources: [source.s4_3],
  teaching: {
   intuition: "A projectile is any object that, once it is thrown, moves under gravity alone: we ignore the air. Its motion splits into two motions that do not affect each other. Sideways nothing pushes it, so its sideways speed never changes. Up and down it is in free fall, exactly as if it had been dropped, with the downward acceleration g = 9.8 m/s². A pod fired straight out sideways starts with no up or down speed, so it hits the ground at the same moment as a pod simply dropped from the same height. Work out that fall time first; the sideways distance is then the sideways speed times that time.",
   steps: [
    "Split the motion into sideways (x) and up-and-down (y). The sideways speed stays the launch speed; the vertical motion is a free fall from rest.",
    "Fall time: the drop from rest after a time t is ½gt², so solve ½ × 9.8 × t² = height for t.",
    "Sideways distance: launch speed × fall time. Round only at the end."
   ],
   example: {
    prompt: "A pod is fired horizontally at 5 m/s from a ledge 10 m above flat ground. How long is it in the air, and how far out does it land?",
    steps: [
     "10 = ½ × 9.8 × t², so t² = 20 ÷ 9.8 ≈ 2.0408 and t ≈ 1.4286 s.",
     "Distance = 5 × 1.4286 ≈ 7.1429 m."
    ],
    answer: "About 1.43 s in the air, landing about 7.14 m out."
   },
   pitfalls: [
    "Letting the sideways speed change the fall time. A faster pod goes further, but it takes just as long to fall.",
    "Using g as the time or forgetting the ½: the drop is ½gt², not gt².",
    "Rounding the time first and multiplying the rounded value, which can move the last digit of the distance."
   ]
  },
  guidance: [
   { prompt: "Look at the up-and-down motion only. It starts with no vertical speed and drops 20 m, so 20 = ½ × 9.8 × t². What is t, in seconds, to 2 decimal places?", answer: [2.02], labels: ["time in the air (s)"], explanation: "t² = 2 × 20 ÷ 9.8 ≈ 4.0816, so t = √4.0816 ≈ 2.02 s. The sideways speed plays no part in how long the fall takes." },
   { prompt: "Sideways, the pod keeps its 12 m/s for the whole of that time. How far does it travel along the floor, in metres, to 2 decimal places?", answer: [24.24], labels: ["distance from the platform (m)"], explanation: "Distance = 12 × 2.0203 ≈ 24.24 m, using the unrounded time." }
  ]
 },
 {
  id: "q13", title: "The long lob", topic: "Projectile launched at an angle", tier: "Intermediate", sector: "Catapult Field",
  brief: "The pod catapult throws its loads upwards at a slant, and the crew must know where each pod lands and whether it clears the cable mast on the way.",
  lesson: "On level ground a projectile launched at speed v and angle θ has range v² sin(2θ) ÷ g and greatest height (v sin θ)² ÷ (2g).",
  prompt: "The pod catapult throws a supply pod from the flat crater floor at 20 m/s, aimed 0.6 radians above the horizontal. It lands back on the same flat floor. Ignore the air and take g = 9.8 m/s². Enter the range (the distance along the floor from launch to landing) in metres, then the greatest height the pod reaches above the floor in metres, both to 2 decimal places.",
  answer: [38.04, 6.51], labels: ["range (m)", "greatest height (m)"], tolerance: 0.005,
  hints: [
   "Split the launch speed into parts: sideways v cos θ and upwards v sin θ, with θ in radians. Only the upward part decides how long the flight lasts and how high it goes.",
   "On level ground the range is v² sin(2θ) ÷ g, and the greatest height is (v sin θ)² ÷ (2g)."
  ],
  solution: "Upward part of the launch speed: 20 × sin 0.6 ≈ 11.2928 m/s. Range: 20² × sin(2 × 0.6) ÷ 9.8 ≈ 400 × 0.932 ÷ 9.8 ≈ 38.0424, which is 38.04 m. Greatest height: 11.2928² ÷ (2 × 9.8) ≈ 6.5066, which is 6.51 m. (The flight lasts 2 × 11.2928 ÷ 9.8 ≈ 2.3 s.)",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Catapult range card", description: "One launch speed, one angle in radians, and the arc they make." },
  sources: [source.s4_3],
  teaching: {
   intuition: "A pod thrown at a slant is still a projectile: a steady sideways motion and a free fall at the same time. The difference is that it now starts with some upward speed. Split the launch speed v, aimed at an angle θ above the horizontal, into a sideways part v cos θ and an upward part v sin θ. Angles here are in radians, as everywhere in this pack. The upward part shrinks by 9.8 m/s every second until it is 0 at the top, then the pod falls back for the same time. So the time in the air is 2v sin θ ÷ g. The range, the distance along the floor from launch to landing, is the sideways speed times that time, which simplifies to v² sin(2θ) ÷ g because 2 sin θ cos θ = sin(2θ). The greatest height is (v sin θ)² ÷ (2g). These formulas hold only when the pod lands at the height it was launched from.",
   steps: [
    "Split the launch speed: sideways v cos θ, upward v sin θ, with θ in radians.",
    "Time in the air on level ground: 2v sin θ ÷ g.",
    "Range: v² sin(2θ) ÷ g. Greatest height: (v sin θ)² ÷ (2g).",
    "Keep unrounded values until the end, then round each answer as asked."
   ],
   example: {
    prompt: "A pod is thrown at 15 m/s, 1 radian above the horizontal, and lands on level ground. Find its range and greatest height.",
    steps: [
     "Upward part: 15 × sin 1 ≈ 15 × 0.8415 ≈ 12.622 m/s.",
     "Range: 225 × sin 2 ÷ 9.8 ≈ 225 × 0.9093 ÷ 9.8 ≈ 20.877 m.",
     "Greatest height: 12.622² ÷ 19.6 ≈ 8.128 m."
    ],
    answer: "Range about 20.88 m, greatest height about 8.13 m."
   },
   pitfalls: [
    "Using the calculator in degrees. An angle of 0.6 means 0.6 radians, about 34°, not 0.6°.",
    "Writing sin² θ for sin(2θ) in the range, or sin(2θ) for sin² θ in the height.",
    "Using the range formula when the landing point is higher or lower than the launch point; it is for level ground only."
   ]
  },
  guidance: [
   { prompt: "What is the upward part of the launch speed, 20 × sin 0.6 (θ in radians), in m/s to 2 decimal places?", answer: [11.29], labels: ["upward speed (m/s)"], explanation: "20 × sin 0.6 ≈ 20 × 0.5646 ≈ 11.29 m/s." },
   { prompt: "The pod rises until its upward speed is 0, then falls for just as long. The flight time is 2 × (upward speed) ÷ g. What is it, in seconds, to 2 decimal places?", answer: [2.3], labels: ["flight time (s)"], explanation: "2 × 11.2928 ÷ 9.8 ≈ 2.3 s." },
   { prompt: "The range is the sideways speed 20 × cos 0.6 times the flight time. Since 2 sin θ cos θ = sin(2θ), that comes to v² sin(2θ) ÷ g. What is the range, in metres, to 2 decimal places?", answer: [38.04], labels: ["range (m)"], explanation: "400 × sin 1.2 ÷ 9.8 ≈ 400 × 0.932 ÷ 9.8 ≈ 38.04 m." },
   { prompt: "At the top the upward speed is 0, so the height is (upward speed)² ÷ (2g). What is the greatest height, in metres, to 2 decimal places?", answer: [6.51], labels: ["greatest height (m)"], explanation: "11.2928² ÷ 19.6 ≈ 6.51 m." }
  ]
 },
 {
  id: "q14", title: "The whirling sling", topic: "Uniform circular motion", tier: "Intermediate", sector: "Catapult Field",
  brief: "Before each throw the catapult whirls its pod round on the sling arm, and the arm’s makers need to know how hard it must pull the pod in.",
  lesson: "At a steady speed on a circle the speed is 2πr ÷ T, and the centripetal acceleration points at the centre with size v² ÷ r.",
  prompt: "Before a throw, the catapult’s sling arm whirls a supply pod round a circle of radius 5 m at a steady speed, taking 4 s for each full turn (its period). Enter the pod’s speed in metres per second, then the size of its centripetal acceleration in metres per second squared, both to 2 decimal places. Work out the acceleration from the unrounded speed.",
  answer: [7.85, 12.34], labels: ["speed (m/s)", "centripetal acceleration (m/s²)"], tolerance: 0.005,
  hints: [
   "In one period the pod goes once round the circle, a distance of 2πr. Speed is that distance divided by the period.",
   "The centripetal acceleration points at the centre and has size v² ÷ r."
  ],
  solution: "One turn is 2π × 5 ≈ 31.4159 m, covered in 4 s, so v = 31.4159 ÷ 4 ≈ 7.854, which is 7.85 m/s. The centripetal acceleration is v² ÷ r = 7.854² ÷ 5 ≈ 12.337, which is 12.34 m/s², directed at the centre of the circle.",
  xp: 150, prereqs: ["q07"],
  artifact: { name: "Sling arm log", description: "A radius, a period and the pull towards the centre they need." },
  sources: [source.s4_4],
  teaching: {
   intuition: "A pod going round a circle at a steady speed is still accelerating, because acceleration is the rate of change of velocity, and velocity has a direction. The pod’s direction turns all the time, and the change always points towards the centre of the circle. This acceleration is called centripetal, which means centre-seeking. Its size is v² ÷ r, where v is the speed and r the radius: faster, or a tighter circle, means a bigger acceleration. The period T is the time for one full turn. In one period the pod travels the whole circumference 2πr, so its speed is v = 2πr ÷ T.",
   steps: [
    "Speed from radius and period: v = 2πr ÷ T, with r in metres and T in seconds.",
    "Centripetal acceleration: a_c = v² ÷ r, in m/s², pointing at the centre.",
    "Use the unrounded speed for the acceleration, and round each answer at the end."
   ],
   example: {
    prompt: "A test pod goes round a circle of radius 3 m once every 2 s at a steady speed. Find its speed and centripetal acceleration.",
    steps: [
     "v = 2π × 3 ÷ 2 = 3π ≈ 9.4248 m/s.",
     "a_c = 9.4248² ÷ 3 ≈ 29.609 m/s²."
    ],
    answer: "Speed about 9.42 m/s, centripetal acceleration about 29.61 m/s²."
   },
   pitfalls: [
    "Thinking a steady speed means no acceleration. The direction changes, so the velocity changes.",
    "Dividing by the diameter instead of the radius, or using πr instead of 2πr for one turn.",
    "Computing v ÷ r or v² × r: the size is v² ÷ r."
   ]
  },
  guidance: [
   { prompt: "How far does the pod travel in one full turn of a circle of radius 5 m? Give the circumference 2πr in metres, to 2 decimal places.", answer: [31.42], labels: ["circumference (m)"], explanation: "2π × 5 ≈ 31.42 m." },
   { prompt: "It covers that distance in one period, 4 s. What is its speed, in m/s, to 2 decimal places?", answer: [7.85], labels: ["speed (m/s)"], explanation: "31.4159 ÷ 4 ≈ 7.85 m/s." },
   { prompt: "What is the centripetal acceleration v² ÷ r, in m/s², to 2 decimal places?", answer: [12.34], labels: ["centripetal acceleration (m/s²)"], explanation: "7.854² ÷ 5 ≈ 12.34 m/s², pointing at the centre." }
  ]
 },
 {
  id: "q15", title: "Winding up the throw", topic: "Tangential and total acceleration", tier: "Intermediate", sector: "Catapult Field",
  brief: "The sling arm speeds the pod up as it swings, and the arm’s joint must take the whole acceleration, not just the part towards the centre.",
  lesson: "Speeding up on a circle adds a tangential acceleration along the path; it is at a right angle to the centripetal one, so the total is √(a_c² + a_t²).",
  prompt: "As the catapult winds up, its sling arm swings a pod round a circle of radius 8 m and keeps speeding it up. At one moment the pod moves at 6 m/s and its speed is growing by 3.5 m/s every second (its tangential acceleration). Enter the size of the centripetal acceleration at that moment, then the size of the total acceleration, both in metres per second squared and to 2 decimal places.",
  answer: [4.5, 5.7], labels: ["centripetal acceleration (m/s²)", "total acceleration (m/s²)"], tolerance: 0.005,
  hints: [
   "The centripetal part points at the centre and has size v² ÷ r, whether or not the speed is changing.",
   "The tangential part points along the path, at a right angle to the centripetal part, so the total is √(centripetal² + tangential²)."
  ],
  solution: "Centripetal: 6² ÷ 8 = 36 ÷ 8 = 4.5, which is 4.5 m/s². The tangential part, 3.5 m/s², is at a right angle to it, so the total is √(4.5² + 3.5²) ≈ 5.7009, which is 5.7 m/s².",
  xp: 150, prereqs: ["q14"],
  artifact: { name: "Wind-up gauge", description: "Two accelerations at a right angle, and the one they add up to." },
  sources: [source.s4_4],
  teaching: {
   intuition: "When a pod on a circle speeds up, its velocity changes in two ways at once. Its direction turns, which gives the centripetal acceleration v² ÷ r towards the centre. And its speed grows, which gives a tangential acceleration: the rate at which the speed changes, pointing along the path (forwards when speeding up). The path is at a right angle to the line to the centre, so the two parts are at a right angle to each other. The total acceleration is their vector sum, and by Pythagoras its size is √(a_c² + a_t²). Use the speed at the moment you are asked about, since v² ÷ r changes as the pod speeds up.",
   steps: [
    "Centripetal part at that moment: a_c = v² ÷ r.",
    "Tangential part: a_t, the rate at which the speed grows, in m/s per second (m/s²).",
    "Total: √(a_c² + a_t²), because the two parts are at a right angle."
   ],
   example: {
    prompt: "A pod on a circle of radius 10 m moves at 6 m/s and is speeding up at 2.7 m/s². Find its total acceleration.",
    steps: [
     "Centripetal: 6² ÷ 10 = 3.6 m/s².",
     "Total: √(3.6² + 2.7²) = √(12.96 + 7.29) = √20.25 = 4.5 m/s²."
    ],
    answer: "4.5 m/s²."
   },
   pitfalls: [
    "Adding the two parts as plain numbers. They are at a right angle, so they combine by Pythagoras.",
    "Leaving out the centripetal part because the speed is changing. It is there whenever the path curves.",
    "Using the tangential acceleration as the speed in v² ÷ r."
   ]
  },
  guidance: [
   { prompt: "What is the centripetal acceleration v² ÷ r, in m/s², to 2 decimal places?", answer: [4.5], labels: ["centripetal acceleration (m/s²)"], explanation: "36 ÷ 8 = 4.5 m/s², pointing at the centre." },
   { prompt: "The tangential acceleration is 3.5 m/s² along the path, at a right angle to the centripetal one. What is the size of the total, √(a_c² + a_t²), in m/s² to 2 decimal places?", answer: [5.7], labels: ["total acceleration (m/s²)"], explanation: "√(4.5² + 3.5²) ≈ 5.7 m/s²." }
  ]
 },
 {
  id: "q16", title: "The wind from a moving rover", topic: "Relative velocity", tier: "Intermediate", sector: "Catapult Field",
  brief: "The survey rover reports the wind from its mast while it drives, and the catapult crew needs the wind as it blows over the ground.",
  lesson: "A relative velocity measured from a moving frame of reference becomes the velocity relative to the ground when you add the frame’s own velocity: v_PG = v_PR + v_RG.",
  prompt: "A survey rover crosses the Catapult Field with velocity (6, 2) m/s relative to the ground, where x points east and y points north. The wind vane on its mast measures the wind relative to the rover as (−2, 5) m/s. The catapult crew needs the wind relative to the ground. Enter its x component and its y component in metres per second, then its speed over the ground in metres per second to 2 decimal places.",
  answer: [4, 7, 8.06], labels: ["wind x relative to ground (m/s)", "wind y relative to ground (m/s)", "wind speed over the ground (m/s)"], tolerance: 0.005,
  hints: [
   "Velocities between frames add: (wind relative to ground) = (wind relative to rover) + (rover relative to ground).",
   "Add the x components together and the y components together, then the speed is √(x² + y²)."
  ],
  solution: "Wind relative to ground = (−2, 5) + (6, 2) = (−2 + 6, 5 + 2) = (4, 7) m/s. Its speed is √(4² + 7²) = √65 ≈ 8.0623, which is 8.06 m/s.",
  xp: 150, prereqs: ["q04"],
  artifact: { name: "Mast vane log", description: "A wind seen from a moving rover, turned into the wind over the ground." },
  sources: [source.s4_5],
  teaching: {
   intuition: "A velocity is a speed together with a direction: a vector, written by its components in metres per second (m/s). It is always measured against something: the ground, the air, a moving rover. That something is the frame of reference. A wind vane on a moving rover feels the wind relative to the rover, which is not the wind relative to the ground: on a still day a rover driving east at 5 m/s feels a 5 m/s wind from the east. Velocities between frames add like the displacements of a journey. The velocity of P relative to the ground equals the velocity of P relative to the rover plus the velocity of the rover relative to the ground: v_PG = v_PR + v_RG. Each such velocity is a relative velocity. Add them component by component, as for any vectors.",
   steps: [
    "Name the frames: here P is the wind, R the rover and G the ground.",
    "Write the rule with the inner letters matching: v_PG = v_PR + v_RG.",
    "Add the x components, then the y components.",
    "The speed is the size of the result, √(x² + y²)."
   ],
   example: {
    prompt: "A rover drives at (4, 0) m/s over the ground and measures the wind relative to itself as (−1, 3) m/s. What is the wind over the ground?",
    steps: [
     "v_PG = (−1, 3) + (4, 0) = (3, 3) m/s.",
     "Speed: √(9 + 9) = √18 ≈ 4.2426 m/s."
    ],
    answer: "(3, 3) m/s, about 4.24 m/s."
   },
   pitfalls: [
    "Subtracting the rover’s velocity instead of adding it. Check the letters: v_PR + v_RG, with R in the middle of both.",
    "Adding the speeds instead of the components.",
    "Mixing up the order of the answer: x first, then y."
   ]
  },
  guidance: [
   { prompt: "Add the x components: the wind’s x relative to the rover, −2, plus the rover’s x relative to the ground, 6. What is the wind’s x component relative to the ground, in m/s?", answer: [4], labels: ["wind x relative to ground (m/s)"], explanation: "−2 + 6 = 4 m/s." },
   { prompt: "Now the y components: 5 plus 2. What is the wind’s y component relative to the ground, in m/s?", answer: [7], labels: ["wind y relative to ground (m/s)"], explanation: "5 + 2 = 7 m/s." },
   { prompt: "What is the wind’s speed over the ground, √(x² + y²) for (4, 7), in m/s to 2 decimal places?", answer: [8.06], labels: ["wind speed over the ground (m/s)"], explanation: "√(4² + 7²) = √65 ≈ 8.06 m/s." }
  ]
 },
 {
  id: "q17", title: "The full catapult test", topic: "Chapter review: motion in a plane", tier: "Intermediate", sector: "Catapult Field",
  brief: "Mira runs the whole catapult once from wind-up to landing, and the crew must give her the strain on the sling arm and where the pod comes down.",
  lesson: "On the sling the pod has centripetal and tangential acceleration; once released it is a projectile with flight time 2v sin θ ÷ g and range v² sin(2θ) ÷ g.",
  prompt: "The full catapult test. The sling arm swings the pod round a circle of radius 3 m, speeding up. Just before release the pod moves at 15 m/s and its speed is growing by 8 m/s every second. It is then released at that speed from floor level, 0.7 radians above the horizontal, and lands on the same flat floor. Ignore the air and the release height, and take g = 9.8 m/s². Enter the size of the pod’s total acceleration just before release in m/s², then its flight time in seconds, then its range in metres, all to 2 decimal places.",
  answer: [75.43, 1.97, 22.63], labels: ["total acceleration before release (m/s²)", "flight time (s)", "range (m)"], tolerance: 0.005,
  hints: [
   "On the circle the acceleration has a centripetal part v² ÷ r and a tangential part at a right angle to it; combine them with Pythagoras.",
   "After release it is a projectile: the flight time is 2v sin θ ÷ g and the range is v² sin(2θ) ÷ g, with θ in radians."
  ],
  solution: "On the circle: centripetal 225 ÷ 3 = 75 m/s² and tangential 8 m/s², so the total is √(75² + 8²) ≈ 75.4255, which is 75.43 m/s². In flight: the upward part of the speed is 15 × sin 0.7 ≈ 9.6633 m/s, so the flight time is 2 × 9.6633 ÷ 9.8 ≈ 1.9721, which is 1.97 s, and the range is 225 × sin 1.4 ÷ 9.8 ≈ 22.6251, which is 22.63 m.",
  xp: 150, prereqs: ["q13", "q15"],
  artifact: { name: "Catapult trial report", description: "A circle and a parabola joined at the moment of release." },
  sources: [source.s4_4, source.s4_3],
  teaching: {
   intuition: "A catapult throw is two motions joined end to end. While the pod is on the sling arm it moves on a circle and speeds up, so it has a centripetal acceleration v² ÷ r towards the centre and a tangential one along its path, and the total is √(a_c² + a_t²). At release the circle no longer holds it: from then on it is a projectile, starting with the speed it had on the sling. The speed it leaves with is the link between the two parts. On level ground its flight time is 2v sin θ ÷ g and its range v² sin(2θ) ÷ g, with θ in radians.",
   steps: [
    "On the circle: a_c = v² ÷ r, then the total √(a_c² + a_t²).",
    "At release: the projectile starts with the same speed v, aimed θ above the horizontal.",
    "In flight: time 2v sin θ ÷ g and range v² sin(2θ) ÷ g.",
    "Round each answer to 2 decimal places only at the end."
   ],
   example: {
    prompt: "A sling of radius 4 m releases a pod at 12 m/s while speeding up at 5 m/s², aimed 0.5 radians up, onto level ground. Find the total acceleration before release, the flight time and the range.",
    steps: [
     "Centripetal 144 ÷ 4 = 36 m/s², so the total is √(36² + 5²) = √1321 ≈ 36.346 m/s².",
     "Flight time 2 × 12 × sin 0.5 ÷ 9.8 ≈ 24 × 0.4794 ÷ 9.8 ≈ 1.1741 s.",
     "Range 144 × sin 1 ÷ 9.8 ≈ 144 × 0.8415 ÷ 9.8 ≈ 12.364 m."
    ],
    answer: "About 36.35 m/s², 1.17 s and 12.36 m."
   },
   pitfalls: [
    "Using the tangential acceleration as the launch speed. The pod leaves with its speed v, not its rate of speeding up.",
    "Adding a_c and a_t as plain numbers instead of with Pythagoras.",
    "Working the angle in degrees instead of radians."
   ]
  },
  guidance: [
   { prompt: "What is the centripetal acceleration v² ÷ r just before release, in m/s² to 2 decimal places?", answer: [75], labels: ["centripetal acceleration (m/s²)"], explanation: "225 ÷ 3 = 75 m/s²." },
   { prompt: "Combine it with the tangential 8 m/s², which is at a right angle to it. What is the size of the total acceleration, in m/s² to 2 decimal places?", answer: [75.43], labels: ["total acceleration before release (m/s²)"], explanation: "√(75² + 8²) ≈ 75.43 m/s²." },
   { prompt: "After release, what is the flight time 2v sin θ ÷ g, in seconds to 2 decimal places?", answer: [1.97], labels: ["flight time (s)"], explanation: "2 × 15 × sin 0.7 ÷ 9.8 = 2 × 9.6633 ÷ 9.8 ≈ 1.97 s." },
   { prompt: "What is the range v² sin(2θ) ÷ g, in metres to 2 decimal places?", answer: [22.63], labels: ["range (m)"], explanation: "225 × 0.9854 ÷ 9.8 ≈ 22.63 m." }
  ]
 },
 {
  id: "q18", title: "Two ropes on the ice", topic: "Net force and Newton’s second law", tier: "Intermediate", sector: "Crane Yard",
  brief: "Two winches drag a cargo sled across the frozen yard at once, and the crane crew wants to know how quickly the sled will pick up speed.",
  lesson: "The net force ΣF is the vector sum of all the forces on a body, and Newton’s second law says ΣF = ma: the acceleration is the net force divided by the mass.",
  prompt: "In the Crane Yard two winch ropes pull a 4 kg cargo sled across smooth ice, seen from above with x east and y north. Rope 1 pulls with force (10, −3) N and rope 2 with (−4, 11) N. The ice pushes up on the sled exactly as hard as gravity pulls it down, and nothing else pushes along the ice. Enter the x component of the net force in newtons, then its y component in newtons, then the size of the sled’s acceleration in metres per second squared.",
  answer: [6, 8, 2.5], labels: ["net force x (N)", "net force y (N)", "acceleration (m/s²)"], tolerance: 0.005,
  hints: [
   "The net force ΣF is the vector sum of all the forces: add the x components together and the y components together.",
   "Newton’s second law says ΣF = ma, so the size of the acceleration is the size of the net force divided by the mass."
  ],
  solution: "ΣF = (10 − 4, −3 + 11) = (6, 8) N. Its size is √(6² + 8²) = √100 = 10 N. By Newton’s second law the acceleration has size 10 ÷ 4 = 2.5 m/s², in the direction of the net force.",
  xp: 150, prereqs: ["q08", "q04"],
  artifact: { name: "Winch force card", description: "Two pulls added as vectors, and the acceleration they give." },
  sources: [source.s5_3],
  teaching: {
   intuition: "A force is a push or a pull on a body. It has a size and a direction, so it is a vector. Mass, measured in kilograms, is how much matter a body has, and it says how hard the body is to speed up or slow down. Several forces on one body add as vectors; their sum is the net force, written ΣF (Σ, the Greek capital sigma, means “the sum of”). Newton’s second law says the net force equals mass times acceleration: ΣF = ma. So the acceleration points the way the net force points, and its size is the size of the net force divided by the mass. Force is measured in newtons (N): one newton is the force that gives 1 kg an acceleration of 1 m/s², so 1 N = 1 kg·m/s². In components the law reads ΣFx = m aₓ and ΣFy = m a_y.",
   steps: [
    "List every force on the body with its components.",
    "Add the x components to get ΣFx and the y components to get ΣFy.",
    "The size of the net force is √(ΣFx² + ΣFy²).",
    "Divide by the mass: the acceleration has size |ΣF| ÷ m, in m/s², in the direction of the net force."
   ],
   example: {
    prompt: "Forces (5, 1) N and (−2, 3) N act on a 2 kg sled on smooth ice. Find the net force and the size of the acceleration.",
    steps: [
     "ΣF = (5 − 2, 1 + 3) = (3, 4) N.",
     "Size √(9 + 16) = 5 N, so the acceleration is 5 ÷ 2 = 2.5 m/s²."
    ],
    answer: "Net force (3, 4) N; acceleration 2.5 m/s²."
   },
   pitfalls: [
    "Adding the sizes of the forces instead of their components. Two pulls at an angle give less than their sizes added.",
    "Dividing one force by the mass instead of the net force.",
    "Forgetting a force that pushes the other way: a negative component makes the net smaller."
   ]
  },
  guidance: [
   { prompt: "Add the x components of the two rope forces, 10 and −4. What is the net force’s x component, in newtons?", answer: [6], labels: ["net force x (N)"], explanation: "10 − 4 = 6 N." },
   { prompt: "Add the y components, −3 and 11. What is the net force’s y component, in newtons?", answer: [8], labels: ["net force y (N)"], explanation: "−3 + 11 = 8 N." },
   { prompt: "What is the size of the net force (6, 8) N, √(x² + y²), in newtons?", answer: [10], labels: ["net force size (N)"], explanation: "√(6² + 8²) = √100 = 10 N." },
   { prompt: "ΣF = ma. What is the size of the acceleration of the 4 kg sled, in m/s²?", answer: [2.5], labels: ["acceleration (m/s²)"], explanation: "10 ÷ 4 = 2.5 m/s²." }
  ]
 },
 {
  id: "q19", title: "The crate in the lift cage", topic: "Mass, weight and the normal force", tier: "Intermediate", sector: "Crane Yard",
  brief: "A crate rides the lift cage up and down the crane tower, and the cage floor is only rated for so much push.",
  lesson: "Weight is mg downwards; the normal force from a floor is whatever the floor must push so that the net force F_N − mg equals ma.",
  prompt: "A 60 kg crate stands on the floor of a lift cage in the Crane Yard. The cage is rising and speeding up: its acceleration has size 1.5 m/s². Take up as positive and g = 9.8 m/s². Enter the crate’s weight in newtons, then the normal force the floor pushes up on it with, in newtons.",
  answer: [588, 678], labels: ["weight (N)", "normal force (N)"], tolerance: 0.01,
  hints: [
   "Weight is the pull of gravity, w = mg, and it acts downwards whatever the cage does.",
   "Speeding up means the acceleration points the way the cage moves; slowing down means it points the other way. With up positive, the free-body diagram has the normal force F_N up and the weight mg down, and F_N − mg must equal ma."
  ],
  solution: "Weight: w = 60 × 9.8 = 588 N, downwards. The cage is rising and speeding up, so its acceleration points up: a = 1.5 m/s². Newton’s second law for the crate: F_N − 588 = 60 × 1.5 = 90, so the normal force is F_N = 588 + 90 = 678 N.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Cage floor gauge", description: "A weight that never changes and a floor push that does." },
  sources: [source.s5_4, source.s5_6],
  teaching: {
   intuition: "Weight is the force of gravity on a body: w = mg, pointing down, with g = 9.8 m/s². Mass is how much matter there is and stays the same anywhere; weight depends on gravity. A crate on a floor is also pushed by the floor, at a right angle to the floor’s surface: the normal force, which we write F_N. The floor pushes exactly as hard as it must. If the cage is still or moves at a steady speed, the crate does not accelerate, so F_N equals the weight. If the cage accelerates up, the floor must push harder than the weight; if it accelerates down, less. A sketch of the body alone with an arrow for every force on it is a free-body diagram. Here it has two arrows, F_N up and mg down, and Newton’s second law, with up positive, says F_N − mg = ma.",
   steps: [
    "Choose up as positive. Weight: w = mg, pointing down.",
    "Find the sign of a: speeding up means a points the way the cage moves; slowing down means it points the other way.",
    "Draw the free-body diagram: F_N up, mg down. Newton’s second law: F_N − mg = ma.",
    "Solve: F_N = mg + ma = m(g + a)."
   ],
   example: {
    prompt: "A 50 kg crate rides a cage that is rising and speeding up at 1.2 m/s². Find its weight and the normal force on it.",
    steps: [
     "Weight 50 × 9.8 = 490 N. Rising and speeding up, so a = +1.2 m/s².",
     "F_N = 490 + 50 × 1.2 = 490 + 60 = 550 N."
    ],
    answer: "Weight 490 N, normal force 550 N."
   },
   pitfalls: [
    "Taking “slowing down” as a negative acceleration whatever the motion. Slowing down while descending is an upward acceleration.",
    "Thinking the weight changes in a moving cage. Only the normal force changes.",
    "Mixing up mass (kg) and weight (N): a 60 kg crate weighs 588 N."
   ]
  },
  guidance: [
   { prompt: "What is the crate’s weight mg, in newtons?", answer: [588], labels: ["weight (N)"], explanation: "60 × 9.8 = 588 N. It is the same whether the cage moves or not." },
   { prompt: "The cage is rising and speeding up. With up positive, what is the crate’s acceleration a, in m/s² (negative if it points down)?", answer: [1.5], labels: ["acceleration (m/s²)"], explanation: "Speeding up while rising means the acceleration points up, so a = 1.5 m/s²." },
   { prompt: "The net force on the crate is ma. What is it, in newtons (negative if it points down)?", answer: [90], labels: ["net force (N)"], explanation: "60 × 1.5 = 90 N." },
   { prompt: "The forces on the crate are the normal force F_N up and its weight down, so F_N − 588 = 90. What is F_N, in newtons?", answer: [678], labels: ["normal force (N)"], explanation: "F_N = 588 + 90 = 678 N." }
  ]
 },
 {
  id: "q20", title: "Two crates, one hook", topic: "Newton’s third law and tension", tier: "Intermediate", sector: "Crane Yard",
  brief: "The gantry crane is lifting two crates hung one below the other, and the lower cable must not be asked to hold more than it is rated for.",
  lesson: "Treat the crates as one system to find the acceleration, where the inner cable’s equal and opposite pulls cancel, then look at one crate alone to find the tension.",
  prompt: "The gantry crane lifts two crates at once. Its cable pulls straight up with 700 N on the top crate, of mass 40 kg. A second, lower cable hangs from the top crate and holds the bottom crate, of mass 25 kg. Ignore the mass of the cables and take g = 9.8 m/s². Enter the crates’ upward acceleration in metres per second squared, then the tension in the lower cable in newtons, both to 2 decimal places.",
  answer: [0.97, 269.23], labels: ["acceleration (m/s²)", "lower cable tension (N)"], tolerance: 0.005,
  hints: [
   "Treat both crates and the lower cable as one system. The lower cable’s pulls on the two crates are equal and opposite (Newton’s third law), so they cancel inside the system: only the crane’s pull and the total weight act on it.",
   "Then look at the bottom crate alone: the lower cable pulls it up with the tension T and gravity pulls it down, and T − m₂g = m₂a."
  ],
  solution: "Whole system: mass 40 + 25 = 65 kg and weight 65 × 9.8 = 637 N. Net force 700 − 637 = 63 N, so a = 63 ÷ 65 ≈ 0.9692, which is 0.97 m/s². Bottom crate alone: T − 245 = 25a, so T = 25 × (9.8 + a) ≈ 269.2308, which is 269.23 N. By Newton’s third law the lower cable pulls down on the top crate with the same 269.23 N.",
  xp: 150, prereqs: ["q19"],
  artifact: { name: "Twin-lift rating", description: "One acceleration for both crates, and the share of the pull the lower cable carries." },
  sources: [source.s5_5, source.s6_1, source.s5_6],
  teaching: {
   intuition: "A cable pulls on whatever is tied to each end, along its own length. That pull is the tension. Newton’s third law says forces come in pairs: when one body pushes or pulls on a second, the second pushes or pulls back on the first with a force of the same size in the opposite direction. The two forces of a pair act on different bodies. So the lower cable pulls the bottom crate up and pulls the top crate down with the same tension. If we treat both crates together as one system, those two pulls are inside it and cancel; only the crane’s pull and the total weight are left, which gives the acceleration. Then a free-body diagram of the bottom crate alone, tension up and its weight down, gives the tension.",
   steps: [
    "System of both crates: total mass m₁ + m₂ and total weight (m₁ + m₂)g. The inner cable’s pulls cancel.",
    "Newton’s second law, up positive: F − (m₁ + m₂)g = (m₁ + m₂)a, so a = F ÷ (m₁ + m₂) − g.",
    "Bottom crate alone: T − m₂g = m₂a, so T = m₂(g + a).",
    "By the third law, the lower cable pulls down on the top crate with the same T."
   ],
   example: {
    prompt: "A crane pulls up with 330 N on a 20 kg crate, with a 10 kg crate hanging below it on a second cable. Find the acceleration and the lower tension.",
    steps: [
     "Total mass 30 kg, weight 294 N. a = (330 − 294) ÷ 30 = 1.2 m/s².",
     "T = 10 × (9.8 + 1.2) = 110 N."
    ],
    answer: "Acceleration 1.2 m/s², tension 110 N."
   },
   pitfalls: [
    "Setting the lower tension equal to the bottom crate’s weight. While the crates speed up it must be more.",
    "Counting the inner cable’s pull in the whole-system equation. Its pulls on the two crates cancel.",
    "Thinking the third-law pair cancels on one crate. The two forces act on different bodies."
   ]
  },
  guidance: [
   { prompt: "Take both crates as one system of mass 65 kg. What is its total weight, in newtons?", answer: [637], labels: ["total weight (N)"], explanation: "65 × 9.8 = 637 N." },
   { prompt: "The net force on the system is 700 − 637 N. What is the acceleration, net force ÷ total mass, in m/s² to 2 decimal places?", answer: [0.97], labels: ["acceleration (m/s²)"], explanation: "63 ÷ 65 ≈ 0.97 m/s², upwards." },
   { prompt: "Now the 25 kg bottom crate alone: T − 245 = 25 × a. What is the tension T, in newtons to 2 decimal places? Use the unrounded acceleration.", answer: [269.23], labels: ["lower cable tension (N)"], explanation: "T = 25 × (9.8 + a) ≈ 269.23 N, with a ≈ 0.9692 m/s². (The same as 25 × 700 ÷ 65: the bottom crate gets its share of the crane’s pull.)" }
  ]
 }
);
})();
