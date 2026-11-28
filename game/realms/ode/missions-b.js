/* Differential equations missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/ode/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 First-order models · Basic, 100 XP · sector 'Coolant Loop' · Chapter review: first-order models [1.3, 1.4, 1.6]
     q12  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Second-order linear equations: superposition and two starting values [2.1]
     q13  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Characteristic equation with two real roots [2.2]
     q14  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Repeated roots [2.2]
     q15  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Complex roots and Euler's formula [2.2]
     q16  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Mechanical vibrations: frequency and damping [2.4]
     q17  ch 3 Vibrations · Intermediate, 150 XP · sector 'Rover Garage' · Chapter review: tuning a suspension [2.2, 2.4]
     q18  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Undetermined coefficients: polynomial and exponential forcing [2.5]
     q19  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Undetermined coefficients: sine and cosine forcing [2.5]
     q20  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Forced oscillations: the steady amplitude [2.6] */
(function(){
'use strict';
/* Jiří Lebl, Notes on Diffy Qs: Differential Equations for Engineers sections the missions below cite
   (docs/plans/ODE-PLAN.md; each page opened 2026-11-27). The text of prompt, hints, solution and guidance is
   build(canonical) of gen-b.js, cleaned by Gen.clean. */
const source = {
 s1_3: { title: "Lebl, Notes on Diffy Qs — 1.3 Separable equations", url: "https://www.jirka.org/diffyqs/html/separable_section.html", description: "Separable equations, solved by separating the variables and integrating both sides.", verified: '2026-11-27' },
 s1_4: { title: "Lebl, Notes on Diffy Qs — 1.4 Linear equations and the integrating factor", url: "https://www.jirka.org/diffyqs/html/intfactor_section.html", description: "First-order linear equations solved with an integrating factor, and mixing problems.", verified: '2026-11-27' },
 s1_6: { title: "Lebl, Notes on Diffy Qs — 1.6 Autonomous equations", url: "https://www.jirka.org/diffyqs/html/auteq_section.html", description: "Autonomous equations, their equilibrium solutions and stability, and the logistic equation.", verified: '2026-11-27' },
 s2_1: { title: "Lebl, Notes on Diffy Qs — 2.1 Second-order linear ODEs", url: "https://www.jirka.org/diffyqs/html/solinear_section.html", description: "Second-order linear equations, superposition, and initial conditions y(0) and y′(0).", verified: '2026-11-27' },
 s2_2: { title: "Lebl, Notes on Diffy Qs — 2.2 Constant-coefficient second-order linear ODEs", url: "https://www.jirka.org/diffyqs/html/sec_ccsol.html", description: "The characteristic equation, with distinct real roots, a repeated root, or complex roots and Euler’s formula.", verified: '2026-11-27' },
 s2_4: { title: "Lebl, Notes on Diffy Qs — 2.4 Mechanical vibrations", url: "https://www.jirka.org/diffyqs/html/sec_mv.html", description: "Masses on springs with damping: natural angular frequency, period, and over-, critical and under-damping.", verified: '2026-11-27' },
 s2_5: { title: "Lebl, Notes on Diffy Qs — 2.5 Nonhomogeneous equations", url: "https://www.jirka.org/diffyqs/html/sec_nonhom.html", description: "Nonhomogeneous equations, particular solutions and the method of undetermined coefficients.", verified: '2026-11-27' },
 s2_6: { title: "Lebl, Notes on Diffy Qs — 2.6 Forced oscillations and resonance", url: "https://www.jirka.org/diffyqs/html/forcedo_section.html", description: "Forced oscillations with damping: the transient, the steady periodic solution and its amplitude.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "Balancing the coolant loop", topic: "Review: first-order models", tier: "Basic", sector: "Coolant Loop",
  brief: "The coolant loop has a tank, a filter and a cooling line, and Mira wants each one predicted: where it ends up, and where it is at a given time.",
  lesson: "For a first-order model, find the equilibrium by setting the rate to 0, then fit the solution through the starting value and read it at the time you need.",
  prompt: "A coolant mixing tank holds 200 L of brine and is kept well stirred. Brine with 0.3 kg of salt per litre flows in at 4 L/min, and the mixed brine flows out at the same rate, so the volume stays 200 L. At t = 0 the tank holds 10 kg of salt. The salt x(t) in kg after t minutes obeys x′ = 4 × 0.3 − (4 ÷ 200)x, that is x′ = 1.2 − 0.02x. Enter the salt in the tank after 30 minutes in kg, to 3 decimal places, then the equilibrium amount of salt in kg: the constant solution the tank settles towards.",
  answer: [32.559,60], labels: ["value at the time (3 d.p.)","equilibrium"], tolerance: 0.0005,
  hints: [
   "Set the right-hand side of the equation equal to 0 and solve: the constant that does this is the equilibrium. For the logistic equation, take the one that is not 0.",
   "The equation is linear with a constant rate, so its solution is the equilibrium plus a gap that shrinks: x(t) = equilibrium + De^(−kt), with D fixed by the starting amount."
  ],
  solution: "Setting x′ = 0 gives 0.02x = 1.2, so the equilibrium is x = 1.2 ÷ 0.02 = 60 kg. The solution is x(t) = 60 + De^(−0.02t), and x(0) = 10 gives D = 10 − 60 = −50, so x(t) = 60 − 50e^(−0.02t). At t = 30: x = 60 − 50e^(−0.6) = 32.5594…, which is 32.559 kg to 3 decimal places. As t grows the exponential shrinks to 0, so the salt settles at 60 kg.",
  xp: 100, prereqs: ["q08","q10"],
  artifact: {"name":"Coolant loop logbook","description":"Three machines, three equations, and the level each one settles at."},
  sources: [source.s1_3, source.s1_4, source.s1_6],
  teaching: {
   intuition: "This mission brings the chapter together. Each machine in the coolant loop is described by a first-order equation: one that gives the rate of change of one quantity from the quantity itself. Three kinds appear. A stirred tank with brine flowing in and out, and a cooling line, are linear with a constant rate: x′ = a − kx. Their solutions are the equilibrium plus a gap that shrinks like e^(−kt), so they head straight for the equilibrium. A population with limited room follows the logistic equation P′ = rP(1 − P ÷ K), which levels off at the carrying capacity K. In every case an equilibrium is a constant solution: the value where the rate is 0. Setting the right-hand side to 0 finds it without solving anything. To find the value at a time, use the solution formula, choose its constant so that it starts at the given value, and put the time in.",
   steps: [
    "Write down the equation and set its right-hand side to 0. The constant that makes it 0 (for the logistic equation, the one that is not 0) is the equilibrium.",
    "For x′ = a − kx, the solution is x(t) = E + De^(−kt), where E is the equilibrium. For the logistic equation it is P(t) = K ÷ (1 + De^(−rt)).",
    "Put t = 0 into the solution and match the starting value to find the constant D.",
    "Put the time into the solution and round only at the end."
   ],
   example: {
    prompt: "A 50 L tank starts with fresh water. Brine with 0.2 kg of salt per litre flows in at 5 L/min and the mixture flows out at 5 L/min, so x′ = 1 − 0.1x. Find the salt after 10 minutes and the equilibrium.",
    steps: [
     "Set x′ = 0: 1 − 0.1x = 0 gives the equilibrium x = 10 kg.",
     "The solution is x(t) = 10 + De^(−0.1t). At t = 0 the tank has no salt, so 10 + D = 0 and D = −10.",
     "At t = 10: x = 10 − 10e^(−1) = 10 − 3.67879… = 6.32120…"
    ],
    answer: "About 6.321 kg after 10 minutes; the equilibrium is 10 kg."
   },
   pitfalls: [
    "Giving 0 as the logistic equilibrium. P = 0 is an equilibrium too, but it is unstable: the one the population heads towards is K.",
    "Rounding e^(−kt) early. Keep all the digits until the last step, or the third decimal place can come out wrong.",
    "Taking D as the starting value itself. D is the starting value minus the equilibrium (or, for the logistic equation, K ÷ P₀ − 1)."
   ]
  },
  guidance: [
   { prompt: "Set x′ = 0 in x′ = 1.2 − 0.02x. Which constant x makes the right-hand side 0?", answer: [60], labels: ["equilibrium"], explanation: "1.2 − 0.02x = 0 gives x = 1.2 ÷ 0.02 = 60. That is the equilibrium: the salt per litre then matches the incoming brine." },
   { prompt: "The solution has the form x(t) = 60 + De^(−0.02t). Which D gives x(0) = 10?", answer: [-50], labels: ["D"], explanation: "At t = 0 the exponential is 1, so x(0) = 60 + D. Then D = 10 − 60 = −50." },
   { prompt: "Put t = 30 into x(t) = 60 − 50e^(−0.02t). How much salt is there, to 3 decimal places?", answer: [32.559], labels: ["value (3 d.p.)"], explanation: "0.02 × 30 = 0.6, so x = 60 − 50e^(−0.6) = 32.5594…, which is 32.559 kg to 3 decimal places." }
  ]
 },
 {
  id: "q12", title: "The shock rig’s first test", topic: "Second-order linear equations: superposition and two starting values", tier: "Intermediate", sector: "Rover Garage",
  brief: "The new shock rig in the garage records how a test arm moves, and Mira wants the formula for this run pinned down from its first two readings.",
  lesson: "For a linear homogeneous second-order equation, any mix C₁y₁ + C₂y₂ of two solutions is a solution, and the two starting values y(0) and y′(0) fix C₁ and C₂.",
  prompt: "Mira tests a rover’s shock rig with the equation y″ + 2y′ − 3y = 0, where y(t) is the arm’s height in cm and t is in seconds. Both y₁ = e^(−3t) and y₂ = e^(t) are solutions, so by superposition y = C₁e^(−3t) + C₂e^(t) is a solution for any constants C₁ and C₂. The test starts with y(0) = 6 and y′(0) = −2. Enter C₁, then C₂.",
  answer: [2,4], labels: ["C₁","C₂"], tolerance: 0.01,
  hints: [
   "Put t = 0 into y and into y′. Every exponential is 1 at t = 0, cos 0 = 1 and sin 0 = 0, so you get two plain equations for C₁ and C₂.",
   "Differentiate each basis solution before you put t = 0 in: the derivative of e^(rt) is re^(rt), of cos ωt is −ω sin ωt and of sin ωt is ω cos ωt."
  ],
  solution: "At t = 0 both exponentials are 1, so y(0) = C₁ + C₂ = 6. Differentiating, y′ = −3C₁e^(−3t) + C₂e^(t), so y′(0) = −3C₁ + C₂ = −2. Subtract (−3) times the first equation from the second: 4C₂ = −2 − (−3) × 6 = 16, so C₂ = 4. Then C₁ = 6 − 4 = 2, and y = 2e^(−3t) + 4e^(t).",
  xp: 150, prereqs: ["q07"],
  artifact: {"name":"Shock rig test card","description":"Two basis solutions, two starting readings, and the one mix that fits both."},
  sources: [source.s2_1],
  teaching: {
   intuition: "A spring or a shock absorber obeys an equation with y″, the second derivative of the position, because force sets the acceleration. An equation whose highest derivative is y″ is second order. The ones in this chapter are linear: y, y′ and y″ appear only multiplied by numbers and added, as in y″ + 3y′ + 2y = 0. With 0 on the right-hand side the equation is called homogeneous: every term contains y or one of its derivatives. Such equations have a powerful property called superposition. If y₁ and y₂ are both solutions, then so is C₁y₁ + C₂y₂ for any constants C₁ and C₂, because derivatives of a sum are sums of derivatives, and every term just adds up to C₁ × 0 + C₂ × 0 = 0. When y₁ and y₂ are genuinely different (neither is a constant multiple of the other), this mix covers every solution: it is the general solution. A second-order equation needs two starting facts to pick out one solution: where it starts, y(0), and how fast it is moving then, y′(0). Two facts fix the two constants.",
   steps: [
    "Write the general solution y = C₁y₁ + C₂y₂ from the two given solutions.",
    "Differentiate it: y′ = C₁y₁′ + C₂y₂′.",
    "Put t = 0 into y and into y′ and set them equal to the given starting values. This gives two equations for C₁ and C₂.",
    "Solve the pair: remove one constant by subtracting a multiple of one equation from the other."
   ],
   example: {
    prompt: "y₁ = e^(−t) and y₂ = e^(2t) both solve y″ − y′ − 2y = 0. Find C₁ and C₂ so that y = C₁e^(−t) + C₂e^(2t) has y(0) = 1 and y′(0) = 5.",
    steps: [
     "At t = 0 both exponentials are 1, so C₁ + C₂ = 1.",
     "y′ = −C₁e^(−t) + 2C₂e^(2t), so y′(0) = −C₁ + 2C₂ = 5.",
     "Add the two equations: 3C₂ = 6, so C₂ = 2 and C₁ = 1 − 2 = −1."
    ],
    answer: "C₁ = −1 and C₂ = 2, so y = −e^(−t) + 2e^(2t)."
   },
   pitfalls: [
    "Forgetting to differentiate before putting t = 0 into the second condition: y′(0) uses the derivatives of y₁ and y₂, not y₁ and y₂ themselves.",
    "Using only one starting value. A second-order equation needs both y(0) and y′(0); one equation cannot fix two constants.",
    "Dropping the factor from the chain rule: the derivative of e^(3t) is 3e^(3t), and of sin 4t is 4 cos 4t."
   ]
  },
  guidance: [
   { prompt: "The starting values give C₁ + C₂ = 6 and −3C₁ + C₂ = −2. Take (−3) times the first equation away from the second to remove C₁. What is C₂?", answer: [4], labels: ["C₂"], explanation: "The difference is 4C₂ = −2 − (−3) × 6 = 16, , so C₂ = 16 ÷ 4 = 4." },
   { prompt: "With C₂ = 4, what is C₁?", answer: [2], labels: ["C₁"], explanation: "C₁ + C₂ = 6, so C₁ = 6 − 4 = 2. Check: (−3) × 2 + 1 × 4 = −2." }
  ]
 },
 {
  id: "q13", title: "Settling the rear shock", topic: "Characteristic equation with two real roots", tier: "Intermediate", sector: "Rover Garage",
  brief: "A rear shock on the long-range rover has been rebuilt, and Mira wants to know where the wheel will be a moment after a bump.",
  lesson: "Putting y = e^(rt) into ay″ + by′ + cy = 0 turns it into the characteristic equation ar² + br + c = 0; two different real roots r₁ and r₂ give y = C₁e^(r₁t) + C₂e^(r₂t).",
  prompt: "Mira tests a rover’s rear shock with y″ + 4y′ + 3y = 0, where y(t) is the wheel’s height above its rest position in cm and t is in seconds. It starts at y(0) = 3 cm with y′(0) = 1 cm/s. Enter the two roots of the characteristic equation, smaller first, then y(1) in cm to 3 decimal places.",
  answer: [-3,-1,1.74], labels: ["smaller root","larger root","y at the time (cm, 3 d.p.)"], tolerance: 0.0005,
  hints: [
   "Try y = e^(rt). It turns the differential equation into the characteristic equation r² + pr + q = 0, with the same coefficients. Factor it to find the roots.",
   "With roots r₁ and r₂, y = C₁e^(r₁t) + C₂e^(r₂t). Use y(0) and y′(0) to find the constants, then put the time in."
  ],
  solution: "The characteristic equation is r² + 4r + 3 = 0, which factors as (r + 3)(r + 1) = 0, so the roots are −3 and −1. So y = C₁e^(−3t) + C₂e^(−t). Then y(0) = C₁ + C₂ = 3 and y′(0) = −3C₁ − C₂ = 1. Taking (−3) times the first from the second gives 2C₂ = 10, so C₂ = 5, and then C₁ = −2: y = −2e^(−3t) + 5e^(−t). At t = 1: y = −2e^(−3) + 5e^(−1) = 1.7398…, which is 1.740 cm to 3 decimal places.",
  xp: 150, prereqs: ["q12"],
  artifact: {"name":"Rear shock calibration sheet","description":"A quadratic in r, two roots, and the wheel’s height a moment later."},
  sources: [source.s2_2],
  teaching: {
   intuition: "In the last mission the two basis solutions were handed to you. Now we find them. For an equation like y″ + py′ + qy = 0 with constant numbers p and q, we need a function whose derivatives look like the function itself, so that the three terms can cancel. The exponential does this: if y = e^(rt), then y′ = re^(rt) and y″ = r²e^(rt). Putting these in gives (r² + pr + q)e^(rt) = 0. An exponential is never 0, so the bracket must be: r² + pr + q = 0. This ordinary quadratic is called the characteristic equation, and it has the same coefficients as the differential equation. Each root r gives a solution e^(rt). When the quadratic has two different real roots r₁ and r₂, superposition gives the general solution y = C₁e^(r₁t) + C₂e^(r₂t), and the starting values fix the constants as before. Negative roots give exponentials that die away, which is what a good shock does.",
   steps: [
    "Write the characteristic equation: replace y″ by r², y′ by r and y by 1.",
    "Solve it, by factoring or the quadratic formula, to get two real roots r₁ < r₂.",
    "Write y = C₁e^(r₁t) + C₂e^(r₂t); then y(0) = C₁ + C₂ and y′(0) = r₁C₁ + r₂C₂.",
    "Solve for C₁ and C₂ from the starting values, then put the time into y."
   ],
   example: {
    prompt: "Solve y″ + 3y′ + 2y = 0 with y(0) = 1 and y′(0) = 0, and find y(1).",
    steps: [
     "The characteristic equation is r² + 3r + 2 = 0, or (r + 2)(r + 1) = 0, so the roots are −2 and −1.",
     "y = C₁e^(−2t) + C₂e^(−t). Then C₁ + C₂ = 1 and −2C₁ − C₂ = 0. Adding them gives −C₁ = 1, so C₁ = −1 and C₂ = 2.",
     "y(1) = −e^(−2) + 2e^(−1) = −0.13534 + 0.73576 = 0.60042…"
    ],
    answer: "The roots are −2 and −1, and y(1) is about 0.600."
   },
   pitfalls: [
    "Getting the signs of the roots wrong: (r + 3)(r + 1) = 0 gives r = −3 and r = −1, not 3 and 1.",
    "Pairing the constants with the wrong roots. Keep C₁ with r₁ and C₂ with r₂ all the way through.",
    "Rounding the exponentials before adding them, which can change the third decimal place."
   ]
  },
  guidance: [
   { prompt: "Putting y = e^(rt) into the equation gives the characteristic equation r² + 4r + 3 = 0. What is its smaller root?", answer: [-3], labels: ["smaller root"], explanation: "r² + 4r + 3 = (r + 3)(r + 1), so the roots are −3 and −1. The smaller is −3." },
   { prompt: "And what is its larger root?", answer: [-1], labels: ["larger root"], explanation: "The other factor gives r = −1. Each root r gives a solution e^(rt)." },
   { prompt: "With y = C₁e^(−3t) + C₂e^(−t), the starting values give C₁ + C₂ = 3 and −3C₁ − C₂ = 1. What is C₂?", answer: [5], labels: ["C₂"], explanation: "Take (−3) times the first equation from the second: 2C₂ = 10, so C₂ = 5. Then C₁ = 3 − 5 = −2." },
   { prompt: "So y = −2e^(−3t) + 5e^(−t). What is y(1), to 3 decimal places?", answer: [1.74], labels: ["y (cm, 3 d.p.)"], explanation: "y(1) = −2e^(−3) + 5e^(−1) = 1.7398…, which is 1.740 cm to 3 decimal places." }
  ]
 },
 {
  id: "q14", title: "The front spring on the edge", topic: "Repeated roots", tier: "Intermediate", sector: "Rover Garage",
  brief: "The front spring has been set exactly on the boundary between bouncing and creeping back, and Mira needs its formula for the test log.",
  lesson: "When the characteristic equation has one repeated root r, the two basis solutions are e^(rt) and te^(rt), so y = (C₁ + C₂t)e^(rt).",
  prompt: "A rover’s front spring is tested with y″ + 6y′ + 9y = 0, where y(t) is the wheel’s height in cm and t is in seconds. It starts at y(0) = 4 cm with y′(0) = −7 cm/s. Its characteristic equation has one repeated root r, so the solution has the form y = (C₁ + C₂t)e^(rt). Enter r, then C₁, then C₂.",
  answer: [-3,4,5], labels: ["repeated root r","C₁","C₂"], tolerance: 0.01,
  hints: [
   "The characteristic equation is a perfect square, (r − r₀)² = 0, so its only root is r₀.",
   "At t = 0, y = C₁. Differentiate y = (C₁ + C₂t)e^(rt) with the product rule: y′(0) = rC₁ + C₂."
  ],
  solution: "The characteristic equation is r² + 6r + 9 = 0, which is (r + 3)² = 0, so the repeated root is r = −3. So y = (C₁ + C₂t)e^(−3t). At t = 0, y = C₁, so C₁ = 4. The product rule gives y′ = C₂e^(−3t) − 3(C₁ + C₂t)e^(−3t), so y′(0) = C₂ − 3C₁ = −7. Then C₂ = −7 − (−3) × 4 = 5.",
  xp: 150, prereqs: ["q13"],
  artifact: {"name":"Front spring setting","description":"A perfect square in r, and the extra t that rescues the second solution."},
  sources: [source.s2_2],
  teaching: {
   intuition: "Sometimes the characteristic equation is a perfect square, like r² + 6r + 9 = (r + 3)² = 0. Then it has only one root, r = −3, counted twice: a repeated root. One root gives only one exponential, e^(−3t), but a second-order equation needs two different basis solutions. The second one turns out to be t times the first: te^(rt). You can check it: with y = te^(rt), y′ = e^(rt) + rte^(rt) and y″ = 2re^(rt) + r²te^(rt). Put it into y″ − 2r₀y′ + r₀²y = 0, whose characteristic equation is (r − r₀)² = 0, with r = r₀: the terms with t add up to (r₀² − 2r₀² + r₀²)te^(r₀t) = 0, and the rest, 2r₀e^(r₀t) − 2r₀e^(r₀t), is 0 too. So the general solution is y = C₁e^(rt) + C₂te^(rt) = (C₁ + C₂t)e^(rt). At t = 0 it gives y(0) = C₁, and the product rule gives y′(0) = rC₁ + C₂.",
   steps: [
    "Write the characteristic equation and recognise the perfect square (r − r₀)², so the repeated root is r₀.",
    "Write y = (C₁ + C₂t)e^(r₀t).",
    "Put t = 0 in: y(0) = C₁.",
    "Differentiate with the product rule: y′ = C₂e^(r₀t) + r₀(C₁ + C₂t)e^(r₀t), so y′(0) = r₀C₁ + C₂ and C₂ = y′(0) − r₀C₁."
   ],
   example: {
    prompt: "Solve y″ + 4y′ + 4y = 0 with y(0) = 3 and y′(0) = −1.",
    steps: [
     "r² + 4r + 4 = (r + 2)² = 0, so the repeated root is r = −2 and y = (C₁ + C₂t)e^(−2t).",
     "y(0) = C₁ = 3.",
     "y′(0) = −2C₁ + C₂ = −1, so C₂ = −1 + 6 = 5."
    ],
    answer: "r = −2, C₁ = 3 and C₂ = 5, so y = (3 + 5t)e^(−2t)."
   },
   pitfalls: [
    "Writing y = C₁e^(rt) + C₂e^(rt). That is only one solution, (C₁ + C₂)e^(rt), and it cannot match two starting values.",
    "Taking C₂ = y′(0). The product rule adds rC₁, so C₂ = y′(0) − rC₁.",
    "Getting the sign of the root wrong: (r + 2)² = 0 means r = −2."
   ]
  },
  guidance: [
   { prompt: "The characteristic equation is r² + 6r + 9 = 0. What is its repeated root?", answer: [-3], labels: ["repeated root r"], explanation: "r² + 6r + 9 = (r + 3)², which is 0 only at r = −3. One root gives only one exponential, e^(−3t), so the second solution is te^(−3t)." },
   { prompt: "With y = (C₁ + C₂t)e^(−3t), what is C₁?", answer: [4], labels: ["C₁"], explanation: "At t = 0 the bracket is C₁ and the exponential is 1, so y(0) = C₁ = 4." },
   { prompt: "By the product rule, y′(0) = −3C₁ + C₂, and y′(0) = −7. What is C₂?", answer: [5], labels: ["C₂"], explanation: "C₂ = −7 − (−3) × 4 = 5." }
  ]
 },
 {
  id: "q15", title: "The swaying seat", topic: "Complex roots and Euler’s formula", tier: "Intermediate", sector: "Rover Garage",
  brief: "The driver’s seat on the rover sways after every bump, and Mira wants to know how fast the sway dies out and where the seat is a moment later.",
  lesson: "When the characteristic equation has complex roots a ± bi, Euler’s formula turns them into the real solutions e^(at) cos bt and e^(at) sin bt.",
  prompt: "A rover’s seat spring is modelled by y″ + 4y′ + 13y = 0, where y(t) is the seat’s height in cm, t is in seconds and angles are in radians. It starts at y(0) = 2 cm with y′(0) = −7 cm/s. The characteristic equation has complex roots a ± bi with b > 0. Enter the real part a, then b, then y(0.5) in cm to 3 decimal places.",
  answer: [-2,3,-0.315], labels: ["real part a","imaginary part b","y at the time (cm, 3 d.p.)"], tolerance: 0.0005,
  hints: [
   "Use the quadratic formula on the characteristic equation r² + pr + q = 0. The number under the square root is negative; write √(−d) as i√d, so the roots are a ± bi.",
   "By Euler’s formula the real solutions are e^(at) cos bt and e^(at) sin bt. So y = e^(at)(C₁ cos bt + C₂ sin bt), with y(0) = C₁ and y′(0) = aC₁ + bC₂."
  ],
  solution: "The characteristic equation is r² + 4r + 13 = 0. The quadratic formula gives r = (−4 ± √(−36)) ÷ 2 = −2 ± 3i, since √(−36) = 6i. So a = −2 and b = 3, and y = e^(−2t)(C₁ cos 3t + C₂ sin 3t). Then y(0) = C₁ = 2, and y′(0) = −2C₁ + 3C₂ = −7 gives C₂ = −1. So y = e^(−2t)(2 cos 3t − sin 3t), and y(0.5) = e^(−1)(2 cos 1.5 − sin 1.5) = −0.3149…, which is −0.315 cm to 3 decimal places.",
  xp: 150, prereqs: ["q13"],
  artifact: {"name":"Seat sway trace","description":"A pair of complex roots, and the shrinking wave they draw."},
  sources: [source.s2_2],
  teaching: {
   intuition: "Some characteristic equations have no real roots: for r² + 2r + 5 = 0 the quadratic formula needs √(4 − 20) = √(−16). Recall the complex numbers from linear algebra: the number i has i² = −1, so √(−16) = 4i, and a complex number a + bi has a real part a and an imaginary part b. Here the roots are (−2 ± 4i) ÷ 2 = −1 ± 2i: a pair a ± bi. To use them we need e^((a + bi)t), and Euler’s formula tells us what e to an imaginary power means: e^(iθ) = cos θ + i sin θ, with θ in radians. So e^((a + bi)t) = e^(at)(cos bt + i sin bt). Its real part e^(at) cos bt and its imaginary part e^(at) sin bt are each real solutions of the equation, and superposition gives y = e^(at)(C₁ cos bt + C₂ sin bt). The picture: the cos and sin make a swing with angular frequency b, and e^(at) is an envelope that shrinks it when a is negative. At t = 0, y(0) = C₁, and y′(0) = aC₁ + bC₂.",
   steps: [
    "Write the characteristic equation and use the quadratic formula. When the number under the square root is negative, write √(−d) = i√d.",
    "Read off the roots a ± bi: a is the real part and b > 0 the imaginary part.",
    "Write y = e^(at)(C₁ cos bt + C₂ sin bt). Then C₁ = y(0) and y′(0) = aC₁ + bC₂ gives C₂.",
    "Put the time in, with the angle bt in radians."
   ],
   example: {
    prompt: "Solve y″ + 2y′ + 5y = 0 with y(0) = 1 and y′(0) = 1, and find y(1).",
    steps: [
     "r = (−2 ± √(4 − 20)) ÷ 2 = (−2 ± 4i) ÷ 2 = −1 ± 2i, so a = −1 and b = 2.",
     "y = e^(−t)(C₁ cos 2t + C₂ sin 2t). C₁ = y(0) = 1, and y′(0) = −C₁ + 2C₂ = 1 gives C₂ = 1.",
     "y(1) = e^(−1)(cos 2 + sin 2) = 0.36788 × (−0.41615 + 0.90930) = 0.18142…"
    ],
    answer: "a = −1, b = 2, and y(1) is about 0.181."
   },
   pitfalls: [
    "Using degrees for cos bt and sin bt. The angle is in radians: cos 2 means 2 radians.",
    "Forgetting to halve: the roots are (−p ± √(p² − 4q)) ÷ 2, so both the real and the imaginary part are divided by 2.",
    "Taking C₂ = y′(0). The envelope adds a term: y′(0) = aC₁ + bC₂."
   ]
  },
  guidance: [
   { prompt: "The characteristic equation is r² + 4r + 13 = 0. Its roots are (−4 ± √(−36)) ÷ 2. What is their real part a?", answer: [-2], labels: ["real part a"], explanation: "The real part is −4 ÷ 2 = −2. It sets how fast the swings shrink: e^(−2t) gets smaller as t grows." },
   { prompt: "√(−36) = i√36. What is b, the positive imaginary part of the roots?", answer: [3], labels: ["imaginary part b"], explanation: "√36 = 6, so the roots are −2 ± 3i and b = 6 ÷ 2 = 3. It is the angular frequency of the swing." },
   { prompt: "With y = e^(−2t)(C₁ cos 3t + C₂ sin 3t), y(0) = C₁ = 2 and y′(0) = −2C₁ + 3C₂ = −7. What is C₂?", answer: [-1], labels: ["C₂"], explanation: "3C₂ = −7 − (−2) × 2 = −3, so C₂ = −1." },
   { prompt: "So y = e^(−2t)(2 cos 3t − sin 3t). What is y(0.5), to 3 decimal places?", answer: [-0.315], labels: ["y (cm, 3 d.p.)"], explanation: "With angles in radians, y(0.5) = e^(−1)(2 cos 1.5 − sin 1.5) = −0.3149…, which is −0.315 cm to 3 decimal places." }
  ]
 },
 {
  id: "q16", title: "Reading the suspension corner", topic: "Mechanical vibrations: frequency and damping", tier: "Intermediate", sector: "Rover Garage",
  brief: "Each corner of the rover is a mass on a spring with a damper, and Mira wants to know how fast each one would swing and whether it bounces at all.",
  lesson: "A mass on a spring with a damper obeys mx″ + cx′ + kx = 0: its natural angular frequency is ω₀ = √(k ÷ m), and comparing c² with 4mk tells whether it is overdamped, critically damped or underdamped.",
  prompt: "A rover’s suspension corner is a mass m = 4 kg on a spring of stiffness k = 36 N/m with a damper of c = 30 N·s/m, so mx″ + cx′ + kx = 0 becomes 4x″ + 30x′ + 36x = 0 (x in metres, t in seconds). Enter the natural angular frequency ω₀ = √(k ÷ m) in rad/s, then the natural period 2π ÷ ω₀ in seconds to 3 decimal places, then a code for the damping: 1 for overdamped, 2 for critically damped, 3 for underdamped.",
  answer: [3,2.094,1], labels: ["ω₀ (rad/s)","natural period (s, 3 d.p.)","damping code"], tolerance: 0.0005,
  hints: [
   "ω₀ = √(k ÷ m), and the natural period 2π ÷ ω₀ is the time one full swing would take with the damper removed.",
   "Compare c² with 4mk, the two parts of the number under the square root in the characteristic equation: c² bigger means overdamped, equal means critically damped, smaller means underdamped."
  ],
  solution: "ω₀ = √(36 ÷ 4) = √9 = 3 rad/s, and the natural period is 2π ÷ 3 = 2.0944…, which is 2.094 s to 3 decimal places. For the damping, c² = 900 and 4mk = 4 × 4 × 36 = 576, so c² − 4mk = 324. c² is bigger than 4mk, so the corner is overdamped: code 1.",
  xp: 150, prereqs: ["q15"],
  artifact: {"name":"Suspension corner chart","description":"Mass, spring and damper, sorted into bounce, no bounce and the line between."},
  sources: [source.s2_4],
  teaching: {
   intuition: "Push a mass m on a spring away from rest by x and the spring pulls back with force kx, where k is its stiffness in newtons per metre. A damper, like the oil in a shock absorber, resists motion with force cx′, where c is the damping constant: the faster it moves, the harder the damper pushes back. Newton’s law, mass times acceleration equals force, gives mx″ = −kx − cx′, or mx″ + cx′ + kx = 0. Without the damper the mass would swing for ever as cos ω₀t and sin ω₀t, with ω₀ = √(k ÷ m). This is the natural angular frequency, in radians per second; one full swing takes the natural period 2π ÷ ω₀ seconds. Damping decides what really happens. The characteristic equation mr² + cr + k = 0 has the number c² − 4mk under its square root. If c² > 4mk there are two negative real roots: the mass creeps back without bouncing, which is called overdamped. If c² = 4mk the square root is 0 and there is only one root, counted twice (a repeated root): critically damped, the boundary case. If c² < 4mk the roots are complex: the mass swings with shrinking swings, underdamped.",
   steps: [
    "Read m, c and k from mx″ + cx′ + kx = 0.",
    "Work out ω₀ = √(k ÷ m) in rad/s and the natural period 2π ÷ ω₀ in seconds.",
    "Work out c² − 4mk.",
    "Positive: overdamped. Zero: critically damped. Negative: underdamped."
   ],
   example: {
    prompt: "A mass of 2 kg hangs on a spring with k = 50 N/m and a damper with c = 12 N·s/m. Find ω₀, the natural period and the kind of damping.",
    steps: [
     "ω₀ = √(50 ÷ 2) = √25 = 5 rad/s, and the natural period is 2π ÷ 5 = 1.2566… s.",
     "c² − 4mk = 144 − 4 × 2 × 50 = 144 − 400 = −256, which is negative."
    ],
    answer: "ω₀ = 5 rad/s, period about 1.257 s, underdamped."
   },
   pitfalls: [
    "Using √(k × m) or k ÷ m without the square root. ω₀ = √(k ÷ m).",
    "Comparing c with 4mk instead of c² with 4mk.",
    "Calling the period 2π × ω₀. A bigger angular frequency means a shorter swing, so the period is 2π ÷ ω₀."
   ]
  },
  guidance: [
   { prompt: "What is ω₀ = √(k ÷ m) = √(36 ÷ 4), in rad/s?", answer: [3], labels: ["ω₀ (rad/s)"], explanation: "36 ÷ 4 = 9, and √9 = 3 rad/s." },
   { prompt: "What is the natural period 2π ÷ 3, in seconds to 3 decimal places?", answer: [2.094], labels: ["natural period (s, 3 d.p.)"], explanation: "2π ÷ 3 = 2.0944…, which is 2.094 s. One radian per second is 1 ÷ (2π) of a full turn per second, so a full turn takes 2π ÷ ω₀ seconds." },
   { prompt: "What is c² − 4mk = 30² − 4 × 4 × 36?", answer: [324], labels: ["c² − 4mk"], explanation: "900 − 576 = 324. This is the number under the square root when the characteristic equation 4r² + 30r + 36 = 0 is solved." },
   { prompt: "Which code fits: 1 overdamped (positive), 2 critically damped (zero), 3 underdamped (negative)?", answer: [1], labels: ["damping code"], explanation: "c² − 4mk = 324 is positive, so the corner is overdamped: code 1." }
  ]
 },
 {
  id: "q17", title: "Tuning the rear corner", topic: "Review: tuning a suspension", tier: "Intermediate", sector: "Rover Garage",
  brief: "Mira wants the rover’s rear corner to settle without a single bounce, and as quickly as it can, before the rover leaves the garage.",
  lesson: "Critical damping, c = 2√(mk), is the smallest damping with no bounce; its characteristic equation has the repeated root −c ÷ (2m), so x = (C₁ + C₂t)e^(rt).",
  prompt: "Mira wants the rover’s rear corner critically damped: no bounce, and the quickest settling. The corner has mass m = 3 kg and spring stiffness k = 12 N/m. Enter the damping constant c in N·s/m that makes mx″ + cx′ + kx = 0 critically damped. Then, with that damper, the corner is pushed to x(0) = 6 cm and released with x′(0) = −4 cm/s (t in seconds): enter x(1) in cm, to 3 decimal places.",
  answer: [12,1.895], labels: ["critical damping c (N·s/m)","x at the time (cm, 3 d.p.)"], tolerance: 0.0005,
  hints: [
   "Critical damping is the boundary case c² = 4mk, so c = 2√(mk).",
   "With critical damping the characteristic equation has one repeated root r = −c ÷ (2m), so x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁."
  ],
  solution: "Critical damping needs c² = 4mk = 4 × 3 × 12 = 144, so c = 12 N·s/m. The characteristic equation 3r² + 12r + 12 = 0 then has the repeated root r = −12 ÷ 6 = −2, so x = (C₁ + C₂t)e^(−2t). C₁ = x(0) = 6, and C₂ = x′(0) − rC₁ = −4 + 2 × 6 = 8. So x = (6 + 8t)e^(−2t), and x(1) = 14e^(−2) = 1.8947…, which is 1.895 cm to 3 decimal places.",
  xp: 150, prereqs: ["q14","q16"],
  artifact: {"name":"Tuned damper tag","description":"The one damper setting that settles the rover’s corner without a bounce."},
  sources: [source.s2_2, source.s2_4],
  teaching: {
   intuition: "This mission brings the chapter together. With too little damping a suspension bounces; with too much it creeps back slowly. The best setting sits exactly between them: critical damping, where c² = 4mk, so c = 2√(mk). At that setting the characteristic equation mr² + cr + k = 0 has one repeated root, r = −c ÷ (2m), which works out to −√(k ÷ m) = −ω₀. A repeated root gives the solution x = (C₁ + C₂t)e^(rt), as for any repeated root. So tuning a suspension takes two ideas from this chapter at once: the damping test from mechanical vibrations, and the repeated-root solution. The starting values then fix the constants: C₁ = x(0), and the product rule gives x′(0) = rC₁ + C₂.",
   steps: [
    "Set c² = 4mk and take the positive square root: c = 2√(mk).",
    "The repeated root is r = −c ÷ (2m).",
    "Write x = (C₁ + C₂t)e^(rt) with C₁ = x(0) and C₂ = x′(0) − rC₁.",
    "Put the time in and round only at the end."
   ],
   example: {
    prompt: "A corner has m = 1 kg and k = 16 N/m. Find the critical damping, then x(0.5) if x(0) = 2 cm and x′(0) = 0.",
    steps: [
     "c = 2√(1 × 16) = 8 N·s/m, and the repeated root is r = −8 ÷ 2 = −4.",
     "x = (C₁ + C₂t)e^(−4t) with C₁ = 2 and C₂ = 0 − (−4) × 2 = 8.",
     "x(0.5) = (2 + 4)e^(−2) = 6 × 0.135335… = 0.81201…"
    ],
    answer: "c = 8 N·s/m and x(0.5) is about 0.812 cm."
   },
   pitfalls: [
    "Forgetting the factor 2: critical damping is c = 2√(mk), not √(mk).",
    "Using r = −c ÷ m. The repeated root of mr² + cr + k = 0 is −c ÷ (2m).",
    "Using C₂ = x′(0) when the corner is released with a push: the product rule adds −rC₁."
   ]
  },
  guidance: [
   { prompt: "Critical damping needs c² = 4mk. What is c = 2√(3 × 12), in N·s/m?", answer: [12], labels: ["critical damping c (N·s/m)"], explanation: "3 × 12 = 36, √36 = 6, so c = 2 × 6 = 12 N·s/m." },
   { prompt: "With c = 12, the characteristic equation 3r² + 12r + 12 = 0 has one repeated root r = −c ÷ (2m). What is r?", answer: [-2], labels: ["repeated root r"], explanation: "r = −12 ÷ 6 = −2. It is −ω₀ = −√(k ÷ m): critical damping settles at the spring’s own rate." },
   { prompt: "With x = (C₁ + C₂t)e^(−2t), C₁ = x(0) = 6 and C₂ = x′(0) − rC₁. What is C₂?", answer: [8], labels: ["C₂"], explanation: "C₂ = −4 − (−2) × 6 = −4 + 12 = 8." },
   { prompt: "So x = (6 + 8t)e^(−2t). What is x(1), to 3 decimal places?", answer: [1.895], labels: ["x (cm, 3 d.p.)"], explanation: "x(1) = 14e^(−2) = 1.8947…, which is 1.895 cm to 3 decimal places." }
  ]
 },
 {
  id: "q18", title: "The engine mount’s steady offset", topic: "Undetermined coefficients: polynomial and exponential forcing", tier: "Intermediate", sector: "Engine Room",
  brief: "The engine pushes on its mount while it warms up, and Mira wants the part of the mount’s motion that the push itself causes.",
  lesson: "A nonhomogeneous equation has a forcing term on its right-hand side; guess a particular solution of the same form as the forcing, with unknown coefficients, and match terms to find them.",
  prompt: "An engine mount’s offset y(t) obeys y″ + 4y′ + 3y = 45e^(2t) − 6, where the right-hand side is a push from the engine that changes exponentially with time t. The number 2 is not a root of the characteristic equation, so the method of undetermined coefficients guesses a particular solution of the same form as the push: yₚ = Ce^(2t) + D. Enter C, then D.",
  answer: [3,-2], labels: ["C","D"], tolerance: 0.01,
  hints: [
   "Put the guess into the left-hand side: differentiate it twice, then collect the terms that match each part of the right-hand side.",
   "Match coefficients: the parts with t (or with the exponential) must agree on both sides, and so must the constant parts. Solve for C first, then D."
  ],
  solution: "For yₚ = Ce^(2t) + D, yₚ′ = 2Ce^(2t) and yₚ″ = 4Ce^(2t). The left-hand side is (4 + 8 + 3)Ce^(2t) + 3D = 15Ce^(2t) + 3D. Matching the exponential terms: 15C = 45, so C = 3. Matching the constants: 3D = −6, so D = −2. So yₚ = 3e^(2t) − 2.",
  xp: 150, prereqs: ["q13"],
  artifact: {"name":"Mount offset worksheet","description":"A guess with blanks in it, filled in term by term."},
  sources: [source.s2_5],
  teaching: {
   intuition: "So far the right-hand side was 0: the spring or shock was left alone. When something outside keeps pushing, the equation gets a forcing term on the right, as in y″ + 3y′ + 2y = 4t + 6. An equation like this, with a right-hand side that is not 0, is nonhomogeneous. Its general solution has two parts added together: the general solution of the same equation with 0 on the right, which you can already find from the characteristic equation, plus any one solution yₚ of the full equation, called a particular solution. To find yₚ we use the method of undetermined coefficients: guess a function of the same shape as the forcing, with unknown numbers in it. A straight-line push At + B gets the guess Ct + D. An exponential push Ae^(kt) + B gets Ce^(kt) + D. Put the guess into the left-hand side, and match the terms with t (or the exponential) and the constant terms on both sides. The guess works as long as its exponential is not already a solution of the homogeneous equation, that is, as long as k is not a root of the characteristic equation.",
   steps: [
    "Write the guess with the same shape as the forcing: Ct + D for At + B, or Ce^(kt) + D for Ae^(kt) + B.",
    "Differentiate the guess twice: for Ct + D, yₚ′ = C and yₚ″ = 0; for Ce^(kt) + D, yₚ′ = kCe^(kt) and yₚ″ = k²Ce^(kt).",
    "Put yₚ, yₚ′ and yₚ″ into the left-hand side and collect like terms.",
    "Match each kind of term with the right-hand side and solve, C first and then D."
   ],
   example: {
    prompt: "Find the particular solution yₚ = Ct + D of y″ + y′ + 2y = 4t + 6.",
    steps: [
     "yₚ′ = C and yₚ″ = 0, so the left-hand side is C + 2(Ct + D) = 2Ct + (C + 2D).",
     "Matching the t terms: 2C = 4, so C = 2.",
     "Matching the constants: C + 2D = 6, so 2D = 4 and D = 2."
    ],
    answer: "C = 2 and D = 2, so yₚ = 2t + 2."
   },
   pitfalls: [
    "Guessing only Ct for a push At + B. The guess needs the constant D as well, because y′ and y terms produce constants.",
    "Forgetting that yₚ′ also feeds the constant terms: in y″ + py′ + qy the y′ term adds pC.",
    "Trying Ce^(kt) when k is a root of the characteristic equation: then the left-hand side gives 0 and the guess fails."
   ]
  },
  guidance: [
   { prompt: "With yₚ = Ce^(2t) + D, the left-hand side is (k² + pk + q)Ce^(2t) + 3D with k = 2. Match the exponential terms with 45e^(2t) − 6. What is C?", answer: [3], labels: ["C"], explanation: "k² + pk + q = 4 + 8 + 3 = 15, so 15C = 45 and C = 45 ÷ 15 = 3." },
   { prompt: "Now match the constant terms: 3D = −6. What is D?", answer: [-2], labels: ["D"], explanation: "The constant D has zero derivatives, so only 3D is left on the left-hand side: D = −6 ÷ 3 = −2." }
  ]
 },
 {
  id: "q19", title: "The flywheel’s shake", topic: "Undetermined coefficients: sine and cosine forcing", tier: "Intermediate", sector: "Engine Room",
  brief: "The flywheel shakes its mount once every turn, and Mira wants the swing that the shaking settles into before she adjusts the mounts.",
  lesson: "For a forcing of cos ωt and sin ωt, guess yₚ = A cos ωt + B sin ωt with both terms, and match the cos terms and the sin terms separately.",
  prompt: "The flywheel shakes its engine mount with a push that turns at 3 rad/s. The mount’s offset y(t) obeys y″ + 2y′ + 13y = 2 cos 3t − 16 sin 3t, with t in seconds and angles in radians. By undetermined coefficients, the particular solution has the form yₚ = A cos 3t + B sin 3t. Enter A, then B.",
  answer: [2,-1], labels: ["A","B"], tolerance: 0.01,
  hints: [
   "Differentiate the guess twice: the derivative of cos ωt is −ω sin ωt, and of sin ωt is ω cos ωt. Put the three pieces into the left-hand side.",
   "Collect the cos terms and the sin terms separately and match each with the right-hand side. That gives two equations for A and B."
  ],
  solution: "yₚ′ = −3A sin 3t + 3B cos 3t and yₚ″ = −9A cos 3t − 9B sin 3t. In the left-hand side the cos terms add up to (13 − 9)A + 2 × 3B = 4A + 6B, and the sin terms to −6A + 4B. Matching the right-hand side: 4A + 6B = 2 and −6A + 4B = −16. Solving the pair, A = (4 × 2 − 6 × (−16)) ÷ (4² + 6²) = 104 ÷ 52 = 2 and B = (6 × 2 + 4 × (−16)) ÷ 52 = −52 ÷ 52 = −1.",
  xp: 150, prereqs: ["q18","q15"],
  artifact: {"name":"Flywheel balance card","description":"Two equations, one for cosines and one for sines, and the swing they fix."},
  sources: [source.s2_5],
  teaching: {
   intuition: "A turning flywheel pushes on its mount with a force that swings like a cosine or a sine of ωt, where ω is how fast it turns in radians per second. Undetermined coefficients still works, with one twist. Differentiating cos ωt gives −ω sin ωt, and differentiating sin ωt gives ω cos ωt, so the two keep turning into each other. Even if the push is only a cosine, the damping term y′ turns a cosine in the guess into a sine. So the guess must contain both: yₚ = A cos ωt + B sin ωt. Putting it into y″ + py′ + qy, the cos terms add up to (q − ω²)A + pωB and the sin terms to −pωA + (q − ω²)B. Match the cos terms with the cos part of the forcing and the sin terms with the sin part. That gives two equations in A and B, solved like any pair. The angles are in radians.",
   steps: [
    "Guess yₚ = A cos ωt + B sin ωt, with the forcing’s ω.",
    "Differentiate: yₚ′ = −ωA sin ωt + ωB cos ωt and yₚ″ = −ω²A cos ωt − ω²B sin ωt.",
    "Put them into the left-hand side. The cos terms give (q − ω²)A + pωB and the sin terms give −pωA + (q − ω²)B.",
    "Set these equal to the cos and sin coefficients of the forcing and solve the pair for A and B."
   ],
   example: {
    prompt: "Find yₚ = A cos t + B sin t for y″ + 2y′ + 2y = 3 cos t − sin t.",
    steps: [
     "Here q − ω² = 2 − 1 = 1 and pω = 2. The cos terms give A + 2B = 3 and the sin terms give −2A + B = −1.",
     "From the second, B = 2A − 1. Then A + 4A − 2 = 3, so A = 1 and B = 1."
    ],
    answer: "A = 1 and B = 1, so yₚ = cos t + sin t."
   },
   pitfalls: [
    "Guessing only A cos ωt because the push is a cosine. The y′ term makes sines, so B sin ωt is needed too.",
    "Losing the minus sign in yₚ″: the second derivative of cos ωt is −ω² cos ωt.",
    "Matching all the terms together instead of the cos terms and the sin terms separately."
   ]
  },
  guidance: [
   { prompt: "In the left-hand side, the cos terms add up to (q − ω²)A + pωB with q = 13, ω = 3 and p = 2. What is q − ω²?", answer: [4], labels: ["q − ω²"], explanation: "q − ω² = 13 − 9 = 4. The −ω²A comes from yₚ″ and the pωB from yₚ′." },
   { prompt: "Matching gives 4A + 6B = 2 (cos terms) and −6A + 4B = −16 (sin terms). What is A?", answer: [2], labels: ["A"], explanation: "Multiply the first by 4 and the second by 6 and subtract to remove B: 52A = 104, so A = 2." },
   { prompt: "And what is B?", answer: [-1], labels: ["B"], explanation: "Multiply the first by 6 and the second by 4 and add to remove A: 52B = −52, so B = −1." }
  ]
 },
 {
  id: "q20", title: "Steadying the engine mount", topic: "Forced oscillations: the steady amplitude", tier: "Intermediate", sector: "Engine Room",
  brief: "Once the engine is up to speed its mount shakes in a steady rhythm, and Mira needs to know how far it swings before she signs it off.",
  lesson: "With damping, the transient part of a forced oscillation dies away and the steady periodic solution is left; its amplitude is F₀ ÷ √((k − mω²)² + (cω)²).",
  prompt: "An engine mount of mass m = 2 kg sits on a spring of stiffness k = 40 N/m with damping c = 3 N·s/m. The engine pushes it with a force of 12 cos 4t newtons, so 2x″ + 3x′ + 40x = 12 cos 4t (x in metres, t in seconds, angles in radians). Once the start-up wobble has died away, the mount follows the steady periodic solution x = C cos(4t − γ). Enter its amplitude C in metres, to 3 decimal places.",
  answer: [0.832], labels: ["amplitude C (m, 3 d.p.)"], tolerance: 0.0005,
  hints: [
   "The steady periodic solution is the particular solution A cos ωt + B sin ωt from undetermined coefficients, and its amplitude is C = √(A² + B²).",
   "Worked out in general, that amplitude is C = F₀ ÷ √((k − mω²)² + (cω)²)."
  ],
  solution: "Here F₀ = 12 and ω = 4. k − mω² = 40 − 2 × 16 = 8 and cω = 3 × 4 = 12. So (k − mω²)² + (cω)² = 64 + 144 = 208, and C = 12 ÷ √208 = 0.8321…, which is 0.832 m to 3 decimal places.",
  xp: 150, prereqs: ["q19","q16"],
  artifact: {"name":"Engine mount sign-off","description":"The size of the steady shake, worked out before the bolts were tightened."},
  sources: [source.s2_6],
  teaching: {
   intuition: "An engine mount is a mass on a spring with a damper, pushed by the engine with a force F₀ cos ωt: mx″ + cx′ + kx = F₀ cos ωt. Its motion has two parts. The homogeneous part, from the characteristic equation, dies away whenever c > 0, because every root then has a negative real part: this is the transient, the start-up wobble. What is left is the particular solution from undetermined coefficients, A cos ωt + B sin ωt, which keeps swinging at the engine’s ω for as long as the engine runs. It is called the steady periodic solution. A cos ωt + B sin ωt is a single wave C cos(ωt − γ), shifted by an angle γ, with amplitude C = √(A² + B²): the largest distance from rest. Solving for A and B in general and taking √(A² + B²) gives the formula C = F₀ ÷ √((k − mω²)² + (cω)²). The term k − mω² is 0 when ω is the natural angular frequency √(k ÷ m); then only the damping cω holds the amplitude down.",
   steps: [
    "Read m, c, k, the force size F₀ and the angular frequency ω of the push.",
    "Work out k − mω² and cω.",
    "Add their squares: (k − mω²)² + (cω)².",
    "Divide: C = F₀ ÷ √((k − mω²)² + (cω)²), and round only at the end."
   ],
   example: {
    prompt: "A mount has m = 1 kg, c = 2 N·s/m and k = 7 N/m, and is pushed by 10 cos 2t newtons. Find the steady amplitude.",
    steps: [
     "k − mω² = 7 − 4 = 3 and cω = 2 × 2 = 4.",
     "3² + 4² = 25, so C = 10 ÷ √25 = 2."
    ],
    answer: "The steady amplitude is 2 m."
   },
   pitfalls: [
    "Using k − mω without squaring ω.",
    "Adding k − mω² and cω before squaring. Square each one first, then add, then take the square root.",
    "Including the transient. After the start-up wobble dies away only the steady periodic solution is left, and its amplitude does not depend on the starting values."
   ]
  },
  guidance: [
   { prompt: "What is k − mω² = 40 − 2 × 4²?", answer: [8], labels: ["k − mω²"], explanation: "2 × 16 = 32, so k − mω² = 40 − 32 = 8. It compares the spring with the push: it is 0 when ω is the natural angular frequency." },
   { prompt: "What is cω = 3 × 4?", answer: [12], labels: ["cω"], explanation: "cω = 12. This is the damper’s share, and it keeps the amplitude finite." },
   { prompt: "What is (k − mω²)² + (cω)²?", answer: [208], labels: ["sum of squares"], explanation: "8² + 12² = 64 + 144 = 208." },
   { prompt: "What is the amplitude C = 12 ÷ √208, to 3 decimal places?", answer: [0.832], labels: ["amplitude C (m, 3 d.p.)"], explanation: "√208 = 14.4222…, and 12 ÷ √208 = 0.8321…, which is 0.832 m to 3 decimal places." }
  ]
 }
);
})();
