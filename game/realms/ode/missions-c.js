/* Differential equations missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/ode/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Resonance and practical resonance [2.6]
     q22  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Higher-order equations and the Wronskian [2.3]
     q23  ch 4 Forcing and resonance · Intermediate, 150 XP · sector 'Engine Room' · Chapter review: the engine mount [2.3, 2.5, 2.6]
     q24  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · Turning an equation into a first-order system; Euler for systems [3.1]
     q25  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · Linear systems x′ = Ax [3.3]
     q26  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · The eigenvalue method: real eigenvalues [3.4]
     q27  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · Complex eigenvalues [3.4]
     q28  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · Phase portraits [3.5]
     q29  ch 5 Systems · Intermediate, 150 XP · sector 'Control Room' · Chapter review: two linked tanks [3.4, 3.5]
     q30  ch 6 The Laplace transform · Advanced, 200 XP · sector 'Signal Shop' · The Laplace transform [6.1] */
(function(){
'use strict';
/* Jiří Lebl, Notes on Diffy Qs: Differential Equations for Engineers sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Lebl/ (Lebl, Notes on Diffy Qs).
   A title reads like: Lebl, Notes on Diffy Qs — 1.3 Separable equations
   Link to the section page itself: https://www.jirka.org/diffyqs/html/<file>.html */
const source = {
 s2_3: { title: "Lebl, Notes on Diffy Qs — 2.3 Higher-order linear ODEs", url: "https://www.jirka.org/diffyqs/html/sec_hol.html", description: "Linear independence of functions, and higher-order linear equations with constant coefficients solved through the characteristic equation.", verified: "2026-11-28" },
 s2_5: { title: "Lebl, Notes on Diffy Qs — 2.5 Nonhomogeneous equations", url: "https://www.jirka.org/diffyqs/html/sec_nonhom.html", description: "Particular solutions by undetermined coefficients: guess the form of the right-hand side and match terms.", verified: "2026-11-28" },
 s2_6: { title: "Lebl, Notes on Diffy Qs — 2.6 Forced oscillations and resonance", url: "https://www.jirka.org/diffyqs/html/forcedo_section.html", description: "Steady periodic solutions of forced springs, pure resonance, and the practical resonance frequency that makes the damped amplitude largest.", verified: "2026-11-28" },
 s3_1: { title: "Lebl, Notes on Diffy Qs — 3.1 Introduction to systems of ODEs", url: "https://www.jirka.org/diffyqs/html/sec_introtosys.html", description: "Systems of ODEs, and rewriting a higher-order equation as a first-order system by naming the unknown and its derivatives.", verified: "2026-11-28" },
 s3_3: { title: "Lebl, Notes on Diffy Qs — 3.3 Linear systems of ODEs", url: "https://www.jirka.org/diffyqs/html/linsystems_section.html", description: "Linear systems written with a matrix, what a vector solution is, and superposition of solutions.", verified: "2026-11-28" },
 s3_4: { title: "Lebl, Notes on Diffy Qs — 3.4 Eigenvalue method", url: "https://www.jirka.org/diffyqs/html/eigenmethod_section.html", description: "Solutions ve^(λt) from eigenvectors, the general solution for distinct real eigenvalues, and real solutions from complex eigenvalues.", verified: "2026-11-28" },
 s3_5: { title: "Lebl, Notes on Diffy Qs — 3.5 Two-dimensional systems and their vector fields", url: "https://www.jirka.org/diffyqs/html/sec_twodimaut.html", description: "Phase portraits of 2 × 2 systems sorted by eigenvalues: sources and sinks (nodes), saddles, spiral sources and sinks, and centres.", verified: "2026-11-28" },
 s6_1: { title: "Lebl, Notes on Diffy Qs — 6.1 The Laplace transform", url: "https://www.jirka.org/diffyqs/html/laplace_section.html", description: "The transform as an integral from 0 to ∞ of e^(−st)f(t), a table of transforms, linearity, and when the transform exists.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "Finding the shake point", topic: "Resonance and practical resonance", tier: "Intermediate", sector: "Engine Room",
  brief: "The engine can run at any speed, and the crew needs to know which speed shakes its mount the hardest before they choose one.",
  lesson: "Forcing a spring at the frequency that makes its steady amplitude largest is practical resonance; with no damping, forcing at the natural frequency is resonance and the swings grow without limit.",
  prompt: "An engine mount obeys 2x″ + 12x′ + 68x = 12 cos(ωt): mass 2 kg, damping 12 N·s/m, stiffness 68 N/m, and a push of size 12 N whose angular frequency ω (in rad/s) the engine can choose. The steady swing has amplitude C(ω) = 12 ÷ √((68 − 2ω²)² + (12ω)²) metres. Enter the practical resonance frequency, the ω that makes the amplitude largest, then that largest amplitude in metres.",
  answer: [4,0.2], labels: ["practical resonance frequency (rad/s)","largest amplitude (m)"], tolerance: 0.01,
  hints: [
   "The amplitude is largest where the quantity under the square root is smallest. Write u = ω² and find where (k − mu)² + c²u has slope zero.",
   "Setting that slope to zero gives ω² = k/m − c²/(2m²). This is positive only when c² < 2mk; then put that ω back into C(ω)."
  ],
  solution: "Under the root is (k − mu)² + c²u with u = ω². Its derivative in u is −2m(k − mu) + c², which is zero at u = k/m − c²/(2m²) = 34 − 18 = 16. So the practical resonance frequency is ω = √16 = 4 rad/s. There k − mω² = 68 − 32 = 36 and cω = 12 × 4 = 48, so the root is √(1296 + 2304) = √3600 = 60. The largest amplitude is 12 ÷ 60 = 0.2 m.",
  xp: 150, prereqs: ["q20"],
  artifact: { name: "Shake-point chart", description: "The amplitude of an engine mount against forcing frequency, with its single peak marked." },
  sources: [source.s2_6],
  teaching: {
   intuition: "Push a swing at just the right moments and it goes higher each time. A spring does the same: it has a natural frequency ω₀ = √(k/m), the angular frequency it rings at when left alone. With no damping, a push of angular frequency exactly ω₀ adds energy on every cycle and the swings grow without limit. That is resonance, and it is how machines shake themselves apart. Damping takes energy out, so the swing settles to a steady amplitude C(ω) = F₀ ÷ √((k − mω²)² + (cω)²) for each forcing frequency ω. That amplitude has one peak. The ω at the peak is the practical resonance frequency, ω = √(k/m − c²/(2m²)), a little below ω₀. It exists only when c² < 2mk; with more damping than that, the amplitude simply falls as ω grows.",
   steps: [
    "Write the amplitude C(ω) = F₀ ÷ √((k − mω²)² + (cω)²). It is largest where the quantity under the root is smallest.",
    "Put u = ω². The quantity (k − mu)² + c²u has derivative −2m(k − mu) + c² in u; setting it to zero gives u = k/m − c²/(2m²).",
    "If that u is positive (c² < 2mk), the practical resonance frequency is ω = √u. If not, there is no peak above ω = 0.",
    "Put the ω back into C(ω) to get the largest amplitude."
   ],
   example: {
    prompt: "A spring with m = 1 kg, c = 2 N·s/m and k = 6 N/m is pushed by 4 cos(ωt) newtons. Find the practical resonance frequency and the largest amplitude.",
    steps: [
     "ω² = k/m − c²/(2m²) = 6 − 4 ÷ 2 = 4, so ω = 2 rad/s.",
     "At ω = 2: k − mω² = 6 − 4 = 2 and cω = 4, so the root is √(4 + 16) = √20 ≈ 4.472.",
     "C = 4 ÷ 4.472 ≈ 0.894."
    ],
    answer: "ω = 2 rad/s, and the largest amplitude is about 0.894 m."
   },
   pitfalls: [
    "Taking the natural frequency √(k/m) as the answer. With damping the peak sits lower, at √(k/m − c²/(2m²)).",
    "Forgetting the square on m in c²/(2m²). With m = 2 the divisor is 8, not 4.",
    "Setting the derivative of C(ω) to zero by hand through the square root. It is simpler to minimise the quantity under the root, with u = ω²."
   ]
  },
  guidance: [
   { prompt: "The best ω satisfies ω² = k/m − c²/(2m²). What is ω² for this mount?", answer: [16], labels: ["ω²"], explanation: "k/m = 68 ÷ 2 = 34 and c²/(2m²) = 144 ÷ 8 = 18, so ω² = 34 − 18 = 16." },
   { prompt: "ω² = 16. What is the practical resonance frequency ω in rad/s?", answer: [4], labels: ["ω (rad/s)"], explanation: "ω = √16 = 4 rad/s, the positive root." },
   { prompt: "At ω = 4, what is √((k − mω²)² + (cω)²)?", answer: [60], labels: ["root at the peak"], explanation: "k − mω² = 68 − 32 = 36 and cω = 48. Then 1296 + 2304 = 3600, whose square root is 60." },
   { prompt: "What is the largest amplitude, 12 ÷ 60, in metres?", answer: [0.2], labels: ["largest amplitude (m)"], explanation: "12 ÷ 60 = 0.2 m. Any other forcing frequency gives a larger root and a smaller swing." }
  ]
 },
 {
  id: "q22", title: "Three shafts, one gear train", topic: "Higher-order equations and the Wronskian", tier: "Intermediate", sector: "Engine Room",
  brief: "A gear train needs a third-order equation, and before the crew builds its general solution they must check that their three solutions really are different.",
  lesson: "n solutions of an nth-order linear equation give its general solution only if they are linearly independent, and a non-zero Wronskian shows that they are.",
  prompt: "A gear train in the Engine Room obeys the third-order equation y‴ − 2y″ − 5y′ + 6y = 0, where y is a shaft angle and t is time in seconds. The crew has three solutions: y₁ = e^t, y₂ = e^(−2t) and y₃ = e^(3t). Enter their Wronskian W at t = 0, then 1 if the three solutions are linearly independent, 0 if not.",
  answer: [-30,1], labels: ["Wronskian at t = 0","independent (1 yes, 0 no)"], tolerance: 0.01,
  hints: [
   "At t = 0 each e^(rt) has value 1, first derivative r and second derivative r². Put the values in the first row of a 3 × 3 matrix, the first derivatives in the second row and the second derivatives in the third, one column per function.",
   "The Wronskian is the determinant of that matrix. For solutions of one linear equation it is zero at every t or at no t, so a non-zero value means independent and zero means one solution is a combination of the others."
  ],
  solution: "At t = 0, y₃ = e^(3t) has value 1, first derivative 3 and second derivative 9. The matrix has rows (1, 1, 1), (1, −2, 3) and (1, 4, 9), and its determinant is W(0) = −30. The Wronskian is not zero, so the three solutions are linearly independent and y = C₁y₁ + C₂y₂ + C₃y₃ is the general solution.",
  xp: 150, prereqs: ["q14"],
  artifact: { name: "Gear-train determinant", description: "A 3 × 3 table of values and derivatives whose determinant says the three solutions are truly different." },
  sources: [source.s2_3],
  teaching: {
   intuition: "A third-order equation contains y‴, the third derivative, and needs three starting values. For constant coefficients the guess y = e^(rt) still works: it turns the equation into a cubic in r, the characteristic equation, and each root r gives a solution. The general solution is y = C₁y₁ + C₂y₂ + C₃y₃, but only if the three solutions are linearly independent: none of them is a combination of the others, so the only way to make C₁y₁ + C₂y₂ + C₃y₃ zero for every t is C₁ = C₂ = C₃ = 0. If y₃ were 2y₁ − y₂, it would add nothing new and one starting value could not be matched. The Wronskian W is a test for this: the determinant of the matrix whose first row holds the functions, the second their first derivatives and the third their second derivatives. For solutions of one linear equation, W is zero at every t or at no t, so one value, such as W(0), settles it.",
   steps: [
    "For each solution, write its value, first derivative and second derivative at the chosen t (at t = 0, e^(rt) gives 1, r and r²).",
    "Put them in a 3 × 3 matrix, one column per solution: values in row 1, first derivatives in row 2, second derivatives in row 3.",
    "Work out the determinant. That is the Wronskian at that t.",
    "A non-zero Wronskian means the solutions are linearly independent. Zero means one is a combination of the others."
   ],
   example: {
    prompt: "y₁ = e^t, y₂ = e^(−t) and y₃ = 2e^t + e^(−t) all solve y‴ − 2y″ − y′ + 2y = 0. Are they independent?",
    steps: [
     "At t = 0: y₁ gives 1, 1, 1; y₂ gives 1, −1, 1; y₃ gives 3, 1, 3.",
     "The matrix has rows (1, 1, 3), (1, −1, 1) and (1, 1, 3). Its first and third rows are equal, so the determinant is 0.",
     "W(0) = 0, so the solutions are dependent: y₃ is 2y₁ + y₂."
    ],
    answer: "W(0) = 0: not independent."
   },
   pitfalls: [
    "Putting the derivatives in columns and the functions in rows, then mixing the two layouts halfway. Either layout gives the same determinant, but each row (or column) must be one kind of entry.",
    "Reading W = 0 at one point as proof of dependence for any functions. It is a proof here because all three solve the same linear equation.",
    "Forgetting that the derivative of e^(rt) brings down r each time: the second derivative is r²e^(rt), not re^(rt)."
   ]
  },
  guidance: [
   { prompt: "What is the second derivative of y₃ = e^(3t) at t = 0?", answer: [9], labels: ["y₃″(0)"], explanation: "The second derivative of e^(rt) is r²e^(rt), which is r² = 9 at t = 0." },
   { prompt: "The matrix at t = 0 has rows (1, 1, 1), (1, −2, 3) and (1, 4, 9). What is its determinant, W(0)?", answer: [-30], labels: ["Wronskian at t = 0"], explanation: "Expanding along the first row gives W(0) = −30." },
   { prompt: "W(0) = −30. Enter 1 if the three solutions are linearly independent, 0 if not.", answer: [1], labels: ["independent (1 yes, 0 no)"], explanation: "A non-zero Wronskian means no solution is a combination of the others: they are independent." }
  ]
 },
 {
  id: "q23", title: "Damping the engine mount", topic: "Chapter review: the engine mount", tier: "Intermediate", sector: "Engine Room",
  brief: "The engine runs at a fixed speed, and the crew wants the full steady swing of its mount before they bolt the flywheel housing shut.",
  lesson: "The steady swing of a damped, forced spring is A cos(ωt) + B sin(ωt), with A and B found by undetermined coefficients and amplitude √(A² + B²).",
  prompt: "An engine mount obeys x″ + 4x′ + 10x = 15 cos(2t), with x in metres and t in seconds. Its steady swing has the form x = A cos(2t) + B sin(2t). Enter the Wronskian of cos(2t) and sin(2t) at t = 0 (it shows the two guesses are independent), then A, then B, then the amplitude √(A² + B²) in metres.",
  answer: [2,0.9,1.2,1.5], labels: ["Wronskian at t = 0","A (m)","B (m)","amplitude (m)"], tolerance: 0.01,
  hints: [
   "For two functions the Wronskian is the determinant of the 2 × 2 matrix with the values in the first row and the first derivatives in the second.",
   "Put x = A cos(ωt) + B sin(ωt) into the equation and match the cos and the sin terms: (k − mω²)A + cωB = F₀ and −cωA + (k − mω²)B = 0. Solve the pair for A and B."
  ],
  solution: "At t = 0, cos(2t) has value 1 and derivative 0, and sin(2t) has value 0 and derivative 2, so the Wronskian is 1 × 2 − 0 × 0 = 2, not zero. Here k − mω² = 10 − 4 = 6 and cω = 4 × 2 = 8. Matching terms gives 6A + 8B = 15 and −8A + 6B = 0. Solving, A = 15 × 6 ÷ (36 + 64) = 0.9 and B = 15 × 8 ÷ 100 = 1.2. The amplitude is √(0.81 + 1.44) = 1.5 m, which is also 15 ÷ √100.",
  xp: 150, prereqs: ["q21","q22"],
  artifact: { name: "Mount tuning card", description: "The cosine and sine parts of the engine mount’s swing, and the amplitude they make together." },
  sources: [source.s2_3, source.s2_5, source.s2_6],
  teaching: {
   intuition: "A push F₀ cos(ωt) makes a damped spring settle into a swing at the same angular frequency ω. Damping shifts the swing out of step with the push, so the swing needs both a cosine and a sine: x = A cos(ωt) + B sin(ωt). This is undetermined coefficients: guess the shape, put it into the equation, and choose the numbers that make it fit. Both pieces are needed because cos(ωt) and sin(ωt) are independent, which their Wronskian, ω, confirms. Putting the guess into m x″ + c x′ + k x = F₀ cos(ωt) and matching the cosine terms and the sine terms gives two linear equations, (k − mω²)A + cωB = F₀ and −cωA + (k − mω²)B = 0. Their solution is A = F₀(k − mω²) ÷ D² and B = F₀cω ÷ D², with D² = (k − mω²)² + (cω)². Together they make one wave of amplitude √(A² + B²), which equals F₀ ÷ D.",
   steps: [
    "Check that cos(ωt) and sin(ωt) are independent: their Wronskian at t = 0 is ω, which is not zero.",
    "Work out k − mω² and cω, and D² = (k − mω²)² + (cω)².",
    "A = F₀(k − mω²) ÷ D² and B = F₀cω ÷ D². These come from matching the cos and sin terms.",
    "The amplitude is √(A² + B²) = F₀ ÷ D."
   ],
   example: {
    prompt: "A mount obeys x″ + 2x′ + 2x = 5 cos(t). Find A, B and the amplitude.",
    steps: [
     "ω = 1, so k − mω² = 2 − 1 = 1, cω = 2 and D² = 1 + 4 = 5.",
     "A = 5 × 1 ÷ 5 = 1 and B = 5 × 2 ÷ 5 = 2.",
     "The amplitude is √(1 + 4) = √5 ≈ 2.236."
    ],
    answer: "A = 1, B = 2, amplitude about 2.236 m."
   },
   pitfalls: [
    "Guessing only A cos(ωt). With damping the swing lags the push, and the sine part is needed.",
    "Dropping the sign of k − mω². When the push is faster than the natural frequency it is negative, and so is A.",
    "Adding A and B for the amplitude. The two parts are a quarter-turn apart, so they combine as √(A² + B²)."
   ]
  },
  guidance: [
   { prompt: "At t = 0, cos(2t) has value 1 and derivative 0, and sin(2t) has value 0 and derivative 2. What is their Wronskian there?", answer: [2], labels: ["Wronskian at t = 0"], explanation: "The determinant of the matrix with rows (1, 0) and (0, 2) is 2. It is not zero, so cos and sin are independent and both are needed." },
   { prompt: "With k − mω² = 6 and cω = 8, what is (k − mω²)² + (cω)²?", answer: [100], labels: ["D²"], explanation: "36 + 64 = 100." },
   { prompt: "A = F₀(k − mω²) ÷ ((k − mω²)² + (cω)²). What is A?", answer: [0.9], labels: ["A (m)"], explanation: "15 × 6 ÷ 100 = 0.9." },
   { prompt: "B = F₀cω ÷ ((k − mω²)² + (cω)²). What is B?", answer: [1.2], labels: ["B (m)"], explanation: "15 × 8 ÷ 100 = 1.2." },
   { prompt: "What is the amplitude √(A² + B²) in metres?", answer: [1.5], labels: ["amplitude (m)"], explanation: "√(0.81 + 1.44) = √2.25 = 1.5 m." }
  ]
 },
 {
  id: "q24", title: "Two numbers for one arm", topic: "Turning an equation into a first-order system; Euler for systems", tier: "Intermediate", sector: "Control Room",
  brief: "The control computer only steps first-order equations, so the gimbal arm’s second-order equation has to be rewritten before it can be simulated.",
  lesson: "Naming x₁ = x and x₂ = x′ turns a second-order equation into a first-order system x′ = Ax, which Euler’s method steps forward one vector at a time.",
  prompt: "A gimbal arm in the Control Room obeys 2x″ + 6x′ + 10x = 0, where x is its angle in radians and t is time in seconds. Write it as a first-order system with x₁ = x and x₂ = x′, so that (x₁, x₂)′ = A(x₁, x₂). Enter the four entries of A row by row, then take one Euler step of size h = 0.1 from x(0) = 2, x′(0) = −1, and enter the estimates of x₁ and x₂ at t = 0.1.",
  answer: [0,1,-5,-3,1.9,-1.7], labels: ["A11","A12","A21","A22","x₁ after one step","x₂ after one step"], tolerance: 0.0005,
  hints: [
   "x₁′ = x₂ is the first equation. For the second, solve the given equation for x″ and write it with x₁ and x₂ in place of x and x′.",
   "Euler’s method moves each unknown forward by h times its rate: new value = old value + h × (its derivative worked out at the old values)."
  ],
  solution: "Since x₁ = x, x₁′ = x′ = x₂, so the top row of A is (0, 1). Dividing the equation by 2 gives x″ = −5x − 3x′, so x₂′ = −5x₁ − 3x₂ and the bottom row is (−5, −3). At t = 0 the rates are x₁′ = −1 and x₂′ = −5 × 2 − 3 × (−1) = −7. One step gives x₁ ≈ 2 + 0.1 × (−1) = 1.9 and x₂ ≈ −1 + 0.1 × (−7) = −1.7.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Gimbal state card", description: "An angle and its rate written side by side as one vector, ready for the control computer." },
  sources: [source.s3_1],
  teaching: {
   intuition: "A second-order equation such as m x″ + c x′ + k x = 0 needs two starting values, the position and the velocity. So treat them as two unknowns: x₁ = x and x₂ = x′. Then x₁′ = x₂ just says that the derivative of the position is the velocity, and the equation itself, solved for x″, says what x₂′ is. Together they form a first-order system: two equations, each with only first derivatives. We write the unknowns as a vector x = (x₁, x₂) and the right-hand sides with a 2 × 2 matrix A, so the system reads x′ = Ax. A computer can now step it with Euler’s method, which moves forward a short time h by the rule new value = old value + h × rate. For a system the rule is applied to both unknowns at once, using the rates worked out at the old values.",
   steps: [
    "Set x₁ = x and x₂ = x′. The first equation is always x₁′ = x₂, so the top row of A is (0, 1).",
    "Solve the original equation for x″ and replace x by x₁ and x′ by x₂. That gives x₂′, and its two coefficients are the bottom row of A.",
    "Work out both rates at the starting values: x₁′ = x₂ and x₂′ from the bottom row.",
    "Take one Euler step: x₁ ≈ x₁ + h x₁′ and x₂ ≈ x₂ + h x₂′, both with the old rates."
   ],
   example: {
    prompt: "Write x″ + 2x′ + 5x = 0 as a system, and take one Euler step of h = 0.5 from x(0) = 1, x′(0) = 0.",
    steps: [
     "x₁′ = x₂ and x₂′ = −5x₁ − 2x₂, so A has rows (0, 1) and (−5, −2).",
     "At the start the rates are x₁′ = 0 and x₂′ = −5 × 1 − 2 × 0 = −5.",
     "One step: x₁ ≈ 1 + 0.5 × 0 = 1 and x₂ ≈ 0 + 0.5 × (−5) = −2.5."
    ],
    answer: "A has rows (0, 1) and (−5, −2); after one step x₁ ≈ 1 and x₂ ≈ −2.5."
   },
   pitfalls: [
    "Forgetting to divide by m before reading off the bottom row. The bottom row is (−k/m, −c/m).",
    "Updating x₁ first and then using the new x₁ to work out x₂′. Euler’s method uses the old values for both rates.",
    "Dropping the minus signs: moving k x and c x′ to the other side of the equation makes both negative."
   ]
  },
  guidance: [
   { prompt: "Solve the equation for x″. What number multiplies x (that is, x₁) in x₂′ = x″?", answer: [-5], labels: ["A21"], explanation: "x″ = −(10 ÷ 2)x − (6 ÷ 2)x′, so x multiplies −5. That is the bottom-left entry of A." },
   { prompt: "What number multiplies x′ (that is, x₂) in x₂′?", answer: [-3], labels: ["A22"], explanation: "−(6 ÷ 2) = −3, the bottom-right entry of A." },
   { prompt: "x₁′ = x₂ = −1 at t = 0. What is the Euler estimate x₁ ≈ 2 + 0.1 × (−1)?", answer: [1.9], labels: ["x₁ after one step"], explanation: "2 + (−0.1) = 1.9." },
   { prompt: "x₂′ = −5x₁ − 3x₂ is −7 at t = 0. What is the Euler estimate of x₂?", answer: [-1.7], labels: ["x₂ after one step"], explanation: "−1 + 0.1 × (−7) = −1.7." }
  ]
 },
 {
  id: "q25", title: "Testing the valve model", topic: "Linear systems x′ = Ax", tier: "Intermediate", sector: "Control Room",
  brief: "An engineer has proposed a formula for how two linked valves move, and Mira wants it tested against the system before it goes into the controller.",
  lesson: "A linear system x′ = Ax gives the rate of change of a whole vector by one matrix product, and a vector function is a solution when its derivative equals A times itself at every time.",
  prompt: "Two linked valves in the Control Room obey x′ = Ax, where x = (x₁, x₂) holds their openings and A is the matrix with rows (−4, 1) and (−6, 1). Enter x₁′ and x₂′ when the valves are at x = (1, 3). Then enter 1 if x(t) = (e^(−2t), 2e^(−2t)) is a solution of the system, 0 if not.",
  answer: [-1,-3,1], labels: ["x₁′","x₂′","solution (1 yes, 0 no)"], tolerance: 0.01,
  hints: [
   "x′ = Ax means x₁′ = (first row of A) · x and x₂′ = (second row of A) · x: multiply each row by the point and add.",
   "For x(t) = e^(μt)v, the left side is x′ = μe^(μt)v and the right side is Ax = e^(μt)Av. It is a solution exactly when Av = μv for both components."
  ],
  solution: "x₁′ = −4 × 1 + 1 × 3 = −1 and x₂′ = −6 × 1 + 1 × 3 = −3. For the candidate, v = (1, 2) and μ = −2. Av = (−2, −4) and μv = (−2, −4). They agree, so x′ = Ax holds at every t: it is a solution, and the answer is 1.",
  xp: 150, prereqs: ["q24"],
  artifact: { name: "Valve rate table", description: "One matrix that turns where the two valves are into how fast each is moving." },
  sources: [source.s3_3],
  teaching: {
   intuition: "When two quantities change together and each rate is a fixed mix of both, the system is linear: x₁′ = a x₁ + b x₂ and x₂′ = c x₁ + d x₂. Packing the numbers into a matrix A with rows (a, b) and (c, d) and the unknowns into a vector x = (x₁, x₂), the whole system is x′ = Ax. At any point, the rate of change is just A times the point: each row of A dotted with x. A solution is a vector function x(t) that makes x′(t) and Ax(t) equal at every t. The functions to try first have the form x(t) = e^(μt)v for a fixed vector v. Then x′ = μe^(μt)v while Ax = e^(μt)Av, so it is a solution exactly when Av = μv. Two solutions can also be added, or multiplied by constants, and the result still solves the system: this is superposition.",
   steps: [
    "Read the rates at a point: x₁′ is the first row of A dotted with x, and x₂′ is the second row dotted with x.",
    "For a candidate x(t) = e^(μt)v, its derivative is μe^(μt)v.",
    "Compute Av and compare it with μv, component by component.",
    "If both components agree, x′ = Ax at every t and the candidate is a solution; if either differs, it is not."
   ],
   example: {
    prompt: "A has rows (1, 2) and (2, 1). Find x′ at x = (2, 0), and test x(t) = (e^(3t), e^(3t)).",
    steps: [
     "x′ = (1 × 2 + 2 × 0, 2 × 2 + 1 × 0) = (2, 4).",
     "The candidate has v = (1, 1) and μ = 3. Av = (3, 3) and μv = (3, 3).",
     "They agree, so it is a solution."
    ],
    answer: "x′ = (2, 4), and the candidate is a solution."
   },
   pitfalls: [
    "Multiplying a column of A by x instead of a row. x₁′ uses the first row.",
    "Checking a candidate only at t = 0 by comparing x(0) with x′(0). The test is x′ = Ax, so compare μv with Av.",
    "Stopping after one matching component. Both components must agree."
   ]
  },
  guidance: [
   { prompt: "What is x₁′ = −4x₁ + x₂ at x = (1, 3)?", answer: [-1], labels: ["x₁′"], explanation: "−4 × 1 + 1 × 3 = −1." },
   { prompt: "What is x₂′ = −6x₁ + x₂ at the same point?", answer: [-3], labels: ["x₂′"], explanation: "−6 × 1 + 1 × 3 = −3." },
   { prompt: "The candidate is e^(−2t) times v = (1, 2). What is the second component of Av?", answer: [-4], labels: ["second component of Av"], explanation: "−6 × 1 + 1 × 2 = −4. The second component of μv is −2 × 2 = −4." },
   { prompt: "Enter 1 if Av = μv (so the candidate is a solution), 0 if not.", answer: [1], labels: ["solution (1 yes, 0 no)"], explanation: "Both components agree, so x′ = Ax for every t." }
  ]
 },
 {
  id: "q26", title: "Heaters that settle", topic: "The eigenvalue method: real eigenvalues", tier: "Intermediate", sector: "Control Room",
  brief: "Two heaters in the control room warm each other, and the crew wants to know exactly where the first one will be a short while after start-up.",
  lesson: "In the eigenvalue method, each eigenvalue λ and eigenvector v of A give a solution e^(λt)v of x′ = Ax, and a mix of two of them can be fitted to any starting vector.",
  prompt: "Two coupled heaters in the Control Room obey x′ = Ax, where A has rows (−5, 3) and (−6, 4) and t is in minutes. They start at x(0) = (1, 0). Enter the eigenvalues of A in increasing order, then x₁ at t = ln 2 (about 0.693 minutes). At that time e^(λt) = 2^λ, so x₁ comes out as an exact short decimal.",
  answer: [-2,1,-1.5], labels: ["smaller eigenvalue","larger eigenvalue","x₁ at t = ln 2"], tolerance: 0.0005,
  hints: [
   "The eigenvalues are the roots of λ² − (trace)λ + (determinant) = 0, where the trace is the sum of the diagonal entries of A.",
   "With eigenvectors v₁ and v₂, x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂. Choose c₁ and c₂ so that x(0) = c₁v₁ + c₂v₂, then put in t = ln 2."
  ],
  solution: "The trace is −1 and the determinant is −2, so λ² + λ − 2 = 0, with roots −2 and 1. Solving (A − λI)v = 0 gives v₁ = (1, 1) for −2 and v₂ = (1, 2) for 1. From (1, 0) = c₁(1, 1) + c₂(1, 2), c₁ = 2 and c₂ = −1. So x₁(t) = 2e^(−2t) − e^t, and at t = ln 2 it is 2 × 0.25 − 1 × 2 = −1.5.",
  xp: 150, prereqs: ["q25"],
  artifact: { name: "Heater forecast", description: "Two eigenvalues and the mix of solutions that fits the heaters’ start." },
  sources: [source.s3_4],
  teaching: {
   intuition: "The last mission showed that e^(λt)v solves x′ = Ax exactly when Av = λv. That is the definition of an eigenvalue λ with eigenvector v, which linear algebra taught. So the eigenvalue method is: find the eigenvalues of A, find an eigenvector for each, and build solutions from them. Along an eigenvector the system is simple: the vector keeps its direction and grows or shrinks by the factor e^(λt). When A is 2 × 2 with two different real eigenvalues λ₁ and λ₂, every solution is x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂, by superposition. The constants c₁ and c₂ come from the start: at t = 0 both exponentials are 1, so x(0) = c₁v₁ + c₂v₂, two linear equations for two unknowns. A handy time to look at is t = ln 2, because e^(λ ln 2) = 2^λ.",
   steps: [
    "Find the eigenvalues: the roots of λ² − (trace)λ + (determinant) = 0.",
    "For each eigenvalue, solve (A − λI)v = 0 for an eigenvector; fixing its first component at 1 makes it definite.",
    "Solve x(0) = c₁v₁ + c₂v₂ for c₁ and c₂.",
    "Write x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂ and put in the time asked for."
   ],
   example: {
    prompt: "A has rows (1, 2) and (2, 1), and x(0) = (2, 0). Find x₁ at t = ln 2.",
    steps: [
     "Trace 2, determinant −3: λ² − 2λ − 3 = (λ − 3)(λ + 1), so the eigenvalues are −1 and 3, with eigenvectors (1, −1) and (1, 1).",
     "(2, 0) = 1 × (1, −1) + 1 × (1, 1), so c₁ = 1 and c₂ = 1.",
     "x₁(t) = e^(−t) + e^(3t), so at t = ln 2, x₁ = 0.5 + 8 = 8.5."
    ],
    answer: "x₁ = 8.5 at t = ln 2."
   },
   pitfalls: [
    "Pairing each eigenvalue with the wrong eigenvector. Check Av = λv for each pair before you use it.",
    "Taking c₁ and c₂ straight from x(0) as if the eigenvectors were (1, 0) and (0, 1). Solve x(0) = c₁v₁ + c₂v₂.",
    "Writing 2^λ as 2λ. With λ = −2, e^(λ ln 2) = 2^(−2) = 0.25."
   ]
  },
  guidance: [
   { prompt: "The trace of A is −1 and its determinant is −2. What is the smaller eigenvalue?", answer: [-2], labels: ["smaller eigenvalue"], explanation: "λ² + λ − 2 = (λ + 2)(λ − 1), so the roots are −2 and 1." },
   { prompt: "What is the larger eigenvalue?", answer: [1], labels: ["larger eigenvalue"], explanation: "The other root of the same equation is 1." },
   { prompt: "An eigenvector for −2 has first component 1. What is its second component?", answer: [1], labels: ["second component"], explanation: "The first row of (A − λI)v = 0 is −3 × 1 + 3v₂ = 0, so v₂ = 1." },
   { prompt: "An eigenvector for 1 has first component 1. What is its second component?", answer: [2], labels: ["second component"], explanation: "The first row of (A − λI)v = 0 is −6 × 1 + 3v₂ = 0, so v₂ = 2." },
   { prompt: "Write x(0) = (1, 0) as c₁(1, 1) + c₂(1, 2). What is c₁?", answer: [2], labels: ["c₁"], explanation: "The first components give c₁ + c₂ = 1 and the second give c₁ + 2c₂ = 0. Subtracting 1 times the first from the second leaves c₂ = −1, so c₁ = 2." },
   { prompt: "x₁(t) = 2e^(−2t) − e^t. What is x₁ at t = ln 2?", answer: [-1.5], labels: ["x₁ at t = ln 2"], explanation: "e^(λ ln 2) = 2^λ, so x₁ = 2 × 0.25 − 1 × 2 = −1.5." }
  ]
 },
 {
  id: "q27", title: "The turning sensor mount", topic: "Complex eigenvalues", tier: "Intermediate", sector: "Control Room",
  brief: "A sensor mount turns as it settles, and the crew needs its turning rate and whether it winds in or out.",
  lesson: "Complex eigenvalues a ± bi make solutions turn at angular frequency b while e^(at) grows or shrinks them, by Euler’s formula.",
  prompt: "A rotating sensor mount in the Control Room obeys x′ = Ax, where A has rows (1, −2) and (4, −3) and t is in seconds. Its eigenvalues are complex, a ± bi with b > 0. Enter the growth rate a, then the angular frequency b in rad/s, then the time for one full turn, 2π ÷ b, in seconds to 3 decimal places.",
  answer: [-1,2,3.142], labels: ["growth rate a","angular frequency b (rad/s)","time for one turn (s)"], tolerance: 0.0005,
  hints: [
   "The eigenvalues solve λ² − (trace)λ + (determinant) = 0. When (trace)² − 4 × (determinant) is negative, the quadratic formula gives a ± bi.",
   "a is half the trace, and b is half of √(4 × determinant − trace²). By Euler’s formula the solutions are e^(at) times cos(bt) and sin(bt) mixtures."
  ],
  solution: "The trace is −2 and the determinant is 5, so λ² + 2λ + 5 = 0. Then (trace)² − 4 × (determinant) = −16, which is negative, and λ = −2 ÷ 2 ± i√16 ÷ 2 = −1 ± 2i. So a = −1, b = 2 rad/s, and one full turn takes 2π ÷ 2 ≈ 3.142 seconds. By Euler’s formula the solutions are mixtures of e^(−t)cos(2t) and e^(−t)sin(2t).",
  xp: 150, prereqs: ["q26","q15"],
  artifact: { name: "Mount turning log", description: "A growth rate and an angular frequency read from one pair of complex eigenvalues." },
  sources: [source.s3_4],
  teaching: {
   intuition: "Some matrices have no real eigenvalues: the quadratic λ² − (trace)λ + (determinant) = 0 has a negative discriminant, and its roots are a ± bi. The eigenvalue method still works with complex numbers, giving a solution e^((a + bi)t)v with a complex eigenvector v. Euler’s formula, met for second-order equations, splits the exponential: e^((a + bi)t) = e^(at)(cos(bt) + i sin(bt)). The real and imaginary parts of that complex solution are two real solutions, and every real solution is a mix of them. So each solution is e^(at) times a mixture of cos(bt) and sin(bt). The cos and sin make the vector turn round and round with angular frequency b, one full turn every 2π ÷ b. The factor e^(at) shrinks it when a is negative, grows it when a is positive, and leaves it alone when a = 0. So a is the growth rate and b the angular frequency.",
   steps: [
    "Work out the trace and the determinant of A.",
    "Check that (trace)² − 4 × (determinant) is negative, so the eigenvalues are complex.",
    "The real part is a = trace ÷ 2, and the imaginary part is b = √(4 × determinant − trace²) ÷ 2.",
    "Solutions are e^(at) times cos(bt) and sin(bt) mixtures: growth rate a, angular frequency b, one turn every 2π ÷ b."
   ],
   example: {
    prompt: "A has rows (0, −1) and (1, 0). Find a, b and the time for one turn.",
    steps: [
     "Trace 0, determinant 1, so λ² + 1 = 0 and λ = ±i.",
     "a = 0 and b = 1.",
     "One turn takes 2π ÷ 1 ≈ 6.283."
    ],
    answer: "a = 0, b = 1 rad/s, one turn in about 6.283 seconds."
   },
   pitfalls: [
    "Taking b as √(determinant). It is √(4 × determinant − trace²) ÷ 2, which equals √(determinant) only when the trace is 0.",
    "Reading the growth rate off a diagonal entry of A. It is half the trace, the sum of both diagonal entries.",
    "Giving the angular frequency as the time for one turn. b is in radians per second; one turn takes 2π ÷ b seconds."
   ]
  },
  guidance: [
   { prompt: "What is the trace of A, the sum of its diagonal entries?", answer: [-2], labels: ["trace"], explanation: "1 + (−3) = −2." },
   { prompt: "What is the determinant of A?", answer: [5], labels: ["determinant"], explanation: "1 × (−3) − (−2) × 4 = 5." },
   { prompt: "What is the growth rate a, the real part of the eigenvalues?", answer: [-1], labels: ["growth rate a"], explanation: "a = trace ÷ 2 = −2 ÷ 2 = −1." },
   { prompt: "What is b, the imaginary part with b > 0?", answer: [2], labels: ["angular frequency b (rad/s)"], explanation: "4 × 5 − 4 = 16, and b = √16 ÷ 2 = 2." },
   { prompt: "What is 2π ÷ 2, to 3 decimal places?", answer: [3.142], labels: ["time for one turn (s)"], explanation: "2π ÷ 2 = 3.142 seconds to 3 decimal places." }
  ]
 },
 {
  id: "q28", title: "Mapping the thermostat", topic: "Phase portraits", tier: "Intermediate", sector: "Control Room",
  brief: "The control room wants a picture of every way the thermostat can move, and one line in the log saying whether it calms down.",
  lesson: "The eigenvalues of A decide the phase portrait of x′ = Ax: a node, a saddle, a spiral or a centre, and whether trajectories close in on the origin.",
  prompt: "A two-loop thermostat in the Control Room obeys x′ = Ax, where A has rows (3, −2) and (4, −1). Enter the trace of A, then its determinant, then the kind of phase portrait at the origin as a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if the origin is stable, 0 if not. Here stable means every trajectory that starts near the origin stays near it for all later time, so a centre counts as stable.",
  answer: [2,5,3,0], labels: ["trace","determinant","portrait code","stable (1 yes, 0 no)"], tolerance: 0.01,
  hints: [
   "The eigenvalues solve λ² − (trace)λ + (determinant) = 0. A negative determinant means real eigenvalues of opposite signs; otherwise look at the discriminant (trace)² − 4 × (determinant).",
   "Real eigenvalues of one sign give a node; complex ones give a spiral, or a centre when the trace is zero. Negative real parts pull trajectories in (stable), positive ones push them out, and a saddle is always unstable."
  ],
  solution: "The trace is 3 + (−1) = 2 and the determinant is 3 × (−1) − (−2) × 4 = 5. The discriminant is 4 − 4 × 5 = −16. The discriminant is negative and the trace is not zero, so the eigenvalues are complex with real part trace ÷ 2: a spiral. The trace is positive, so the real parts are positive and trajectories run away from the origin: unstable. The codes are 3 (spiral) and 0.",
  xp: 150, prereqs: ["q27"],
  artifact: { name: "Thermostat phase map", description: "Every path the thermostat can take, drawn as arrows around one point." },
  sources: [source.s3_5],
  teaching: {
   intuition: "A solution of x′ = Ax is a point (x₁, x₂) moving in the plane, and the path it traces is a trajectory. Drawing many trajectories at once gives the phase portrait, a map of every way the system can move. The origin is always an equilibrium, and the eigenvalues of A decide the picture around it. Two real eigenvalues of the same sign give a node: trajectories run straight in to the origin if both are negative, or straight out if both are positive. Real eigenvalues of opposite signs give a saddle: trajectories come in along one eigenvector and leave along the other. Complex eigenvalues a ± bi give a spiral, winding in when a < 0 and out when a > 0, or a centre when a = 0, closed loops around the origin. The trace and determinant are enough to tell: a negative determinant means a saddle; otherwise a positive discriminant (trace)² − 4 × (determinant) means a node and a negative one a spiral or centre.",
   steps: [
    "Work out the trace, the determinant and the discriminant (trace)² − 4 × (determinant) of A.",
    "Determinant negative: saddle. Determinant positive and discriminant positive: node. Discriminant negative: spiral, or centre if the trace is 0.",
    "For a node or a spiral, a negative trace means the real parts are negative: stable. A positive trace means unstable.",
    "A saddle is always unstable. A centre keeps nearby trajectories nearby, so it counts as stable here, though they never close in."
   ],
   example: {
    prompt: "A has rows (−3, 0) and (0, −1). Classify the origin.",
    steps: [
     "Trace −4, determinant 3, discriminant 16 − 12 = 4.",
     "Determinant and discriminant are positive: a node.",
     "The trace is negative, so both eigenvalues (−3 and −1) are negative: stable."
    ],
    answer: "A stable node: code 1, and stable."
   },
   pitfalls: [
    "Calling every positive determinant a node. With a negative discriminant the eigenvalues are complex and the picture is a spiral or a centre.",
    "Judging stability by the determinant. For nodes and spirals it is the sign of the trace that decides.",
    "Calling a saddle stable because some trajectories come in. Almost every trajectory near it leaves, so it is unstable."
   ]
  },
  guidance: [
   { prompt: "What is the trace of A?", answer: [2], labels: ["trace"], explanation: "3 + (−1) = 2." },
   { prompt: "What is the determinant of A?", answer: [5], labels: ["determinant"], explanation: "3 × (−1) − (−2) × 4 = 5." },
   { prompt: "What is the discriminant, (trace)² − 4 × (determinant)?", answer: [-16], labels: ["discriminant"], explanation: "4 − 4 × 5 = −16." },
   { prompt: "Which kind of phase portrait is it? Enter 1 node, 2 saddle, 3 spiral, 4 centre.", answer: [3], labels: ["portrait code"], explanation: "The discriminant is negative and the trace is not zero, so the eigenvalues are complex with real part trace ÷ 2: a spiral." },
   { prompt: "Enter 1 if the origin is stable, 0 if not.", answer: [0], labels: ["stable (1 yes, 0 no)"], explanation: "The trace is positive, so the real parts are positive and trajectories run away from the origin: unstable." }
  ]
 },
 {
  id: "q29", title: "Flushing the linked tanks", topic: "Chapter review: two linked tanks", tier: "Intermediate", sector: "Control Room",
  brief: "Two linked brine tanks are being flushed with fresh water, and the crew wants to know how much salt is left in the first one a little later.",
  lesson: "Two linked tanks form a 2 × 2 system whose eigenvalues give the flushing rates, the shape of the phase portrait and, with the start, the salt at any time.",
  prompt: "Two brine tanks in the Control Room are linked. Tank 1 holds 20 litres and tank 2 holds 20 litres, both well stirred. Fresh water flows into tank 1 at 30 L/min; 40 L/min flows from tank 1 into tank 2; 10 L/min flows back from tank 2 into tank 1, and tank 2 drains 30 L/min, so both volumes stay fixed. At t = 0 tank 1 holds 5 kg of salt and tank 2 holds 3 kg. Enter the two eigenvalues of the system’s matrix in increasing order, then the phase portrait code (1 node, 2 saddle, 3 spiral, 4 centre), then the salt in tank 1 in kg at t = ln 2 minutes, to 3 decimal places.",
  answer: [-3,-1,1,1.844], labels: ["smaller eigenvalue","larger eigenvalue","portrait code","salt in tank 1 (kg)"], tolerance: 0.0005,
  hints: [
   "Salt leaves a tank at (outflow rate) × (salt ÷ volume). So x₁′ = −(flow out of tank 1 ÷ V₁)x₁ + (flow back ÷ V₂)x₂, and x₂′ is built the same way.",
   "Write x₁(t) = pe^(λ₁t) + qe^(λ₂t). Then p + q = x₁(0) and λ₁p + λ₂q = x₁′(0), which the first equation gives at t = 0. At t = ln 2, e^(λt) = 2^λ."
  ],
  solution: "x₁′ = −(40 ÷ 20)x₁ + (10 ÷ 20)x₂ = −2x₁ + 0.5x₂ and x₂′ = 2x₁ − 2x₂. The matrix has trace −4 and determinant 3, so λ² + 4λ + 3 = 0, with roots −3 and −1: real, both negative, so the portrait is a stable node (code 1). At t = 0, x₁′ = −2 × 5 + 0.5 × 3 = −8.5. With x₁(t) = pe^(−3t) + qe^(−t): p + q = 5 and −3p − q = −8.5, so p = 1.75 and q = 3.25. At t = ln 2, x₁ = 1.75 ÷ 8 + 3.25 ÷ 2 ≈ 1.844 kg.",
  xp: 150, prereqs: ["q26","q28"],
  artifact: { name: "Tank flush schedule", description: "Two flushing rates and the salt left in the first tank at a chosen time." },
  sources: [source.s3_4, source.s3_5],
  teaching: {
   intuition: "In a well-stirred tank, salt leaves with the water: each litre that flows out carries the tank’s concentration, salt ÷ volume. With two tanks pumping into each other, each tank gains salt from the other and loses it through its own outflow. Writing x₁ and x₂ for the kilograms of salt, each rate is a fixed mix of x₁ and x₂, so the tanks make a linear system x′ = Ax. The eigenvalue method then does all the work. The eigenvalues are the two flushing rates: for these tanks they are real and negative, so the phase portrait is a stable node and every trajectory closes in on (0, 0), where all the salt is gone. The salt in tank 1 is a mix pe^(λ₁t) + qe^(λ₂t) of the two rates, and its two constants are fixed by the starting salt and the starting rate of change.",
   steps: [
    "Build each rate: salt in from the other tank is (flow in) × (that tank’s salt ÷ its volume); salt out is (flow out) × (own salt ÷ own volume).",
    "Find the eigenvalues of the matrix from its trace and determinant, and classify the portrait.",
    "Write x₁(t) = pe^(λ₁t) + qe^(λ₂t). At t = 0, p + q = x₁(0) and λ₁p + λ₂q = x₁′(0), the first rate at the start.",
    "Solve for p and q and put in the time asked for; at t = ln 2, e^(λt) = 2^λ."
   ],
   example: {
    prompt: "Tank 1 holds 10 litres and tank 2 holds 20. Fresh water enters tank 1 at 10 L/min, tank 1 pumps 10 L/min into tank 2, tank 2 drains 10 L/min, and nothing flows back. Tank 1 starts with 4 kg of salt. Find the eigenvalues, the code and x₁ at t = ln 2.",
    steps: [
     "x₁′ = −(10 ÷ 10)x₁ = −x₁ and x₂′ = (10 ÷ 10)x₁ − (10 ÷ 20)x₂ = x₁ − 0.5x₂, so A has rows (−1, 0) and (1, −0.5).",
     "The matrix is triangular, so its eigenvalues are its diagonal entries, −1 and −0.5: real and negative, a stable node.",
     "Nothing flows back into tank 1, so x₁(t) = 4e^(−t), and at t = ln 2 that is 4 × 0.5 = 2."
    ],
    answer: "Eigenvalues −1 and −0.5, code 1, and 2 kg in tank 1 at t = ln 2."
   },
   pitfalls: [
    "Dividing by the wrong volume. Salt leaving tank 2 travels at tank 2’s concentration, salt ÷ V₂, wherever it goes.",
    "Leaving out the return flow when building tank 1’s outflow. Tank 1 pumps out what flows in from both sources.",
    "Rounding p, q or 2^λ before the last step. Keep every value exact and round only the final answer."
   ]
  },
  guidance: [
   { prompt: "The matrix has trace −4 and determinant 3. What is the smaller eigenvalue?", answer: [-3], labels: ["smaller eigenvalue"], explanation: "λ² + 4λ + 3 = (λ + 3)(λ + 1), so the smaller root is −3." },
   { prompt: "What is the larger eigenvalue?", answer: [-1], labels: ["larger eigenvalue"], explanation: "The other root is −1." },
   { prompt: "Both eigenvalues are real and negative. Enter the code of the phase portrait.", answer: [1], labels: ["portrait code"], explanation: "Real eigenvalues of the same sign give a node; both negative, so every trajectory closes in on the origin: all the salt is flushed out." },
   { prompt: "What is x₁′(0) = −2x₁ + 0.5x₂ at the start?", answer: [-8.5], labels: ["x₁′(0) (kg/min)"], explanation: "−2 × 5 + 0.5 × 3 = −8.5 kg/min." },
   { prompt: "With x₁(t) = pe^(−3t) + qe^(−t), p + q = 5 and −3p − q = −8.5. What is p?", answer: [1.75], labels: ["p"], explanation: "Subtracting −1 times the first equation from the second gives (−3 − (−1))p = −8.5 − (−1) × 5, so p = 1.75 and q = 3.25." },
   { prompt: "What is x₁ at t = ln 2, in kg to 3 decimal places?", answer: [1.844], labels: ["salt in tank 1 (kg)"], explanation: "x₁ = 1.75 ÷ 8 + 3.25 ÷ 2 ≈ 1.844 kg." }
  ]
 },
 {
  id: "q30", title: "The relay’s new language", topic: "The Laplace transform", tier: "Advanced", sector: "Signal Shop",
  brief: "The signal shop wants every relay signal written in a form that turns calculus into algebra, starting with one test signal.",
  lesson: "The Laplace transform ℒ{f}(s) = ∫₀^∞ e^(−st)f(t) dt turns a function of time into a function of s, and it is linear, so a sum is transformed piece by piece.",
  prompt: "A relay in the Signal Shop sends the signal f(t) = 4t² + 3e^(−t) + 2sin(4t), with t in seconds. Enter the number that s must be greater than for the Laplace transform ℒ{f}(s) to exist, then the value of ℒ{f}(s) at s = 2.",
  answer: [0,2.4], labels: ["s must exceed","ℒ{f} at the given s"], tolerance: 0.0005,
  hints: [
   "ℒ{tⁿ} = n! ÷ sⁿ⁺¹ and ℒ{sin(bt)} = b ÷ (s² + b²), ℒ{cos(bt)} = s ÷ (s² + b²), all for s > 0; ℒ{e^(at)} = 1 ÷ (s − a) for s > a.",
   "The transform is linear: transform each piece, multiply by its coefficient and add. The whole transform exists where every piece does."
  ],
  solution: "The power and the sin need s > 0 and e^(−t) needs s > −1, so all three integrals converge when s > 0. At s = 2: ℒ{4t²} = 4 × 2 ÷ 2^3 = 1; ℒ{3e^(−t)} = 3 ÷ (2 − (−1)) = 1; ℒ{2sin(4t)} = 2 × 4 ÷ (2² + 4²) = 0.4. Adding, ℒ{f}(2) = 1 + 1 + 0.4 = 2.4.",
  xp: 200, prereqs: ["q07"],
  artifact: { name: "Transform table card", description: "Five rows that turn powers, exponentials, sines and cosines into fractions in s." },
  sources: [source.s6_1],
  teaching: {
   intuition: "The Laplace transform turns a function of time f(t) into a new function of a variable s. Its definition is an improper integral: ℒ{f}(s) = ∫₀^∞ e^(−st)f(t) dt. The factor e^(−st) dies away fast when s is large, so for most signals the integral converges once s is big enough. For example, ℒ{e^(at)} = ∫₀^∞ e^((a − s)t) dt = 1 ÷ (s − a), but only when s > a; otherwise the integrand does not die away and the integral diverges. In the same way, ℒ{tⁿ} = n! ÷ sⁿ⁺¹, ℒ{sin(bt)} = b ÷ (s² + b²) and ℒ{cos(bt)} = s ÷ (s² + b²), each for s > 0. The integral is linear, so the transform of a sum is the sum of the transforms, and constants come out in front. Later missions use the transform to turn a differential equation into algebra in s.",
   steps: [
    "Split the signal into pieces: powers of t, exponentials and sines or cosines, each with its coefficient.",
    "Each piece needs s large enough: s > 0 for powers, sines and cosines; s > a for e^(at). The whole transform exists for s greater than the largest of these.",
    "Transform each piece from the table: n! ÷ sⁿ⁺¹, 1 ÷ (s − a), b ÷ (s² + b²), s ÷ (s² + b²).",
    "Multiply each by its coefficient, put in the value of s and add."
   ],
   example: {
    prompt: "Find ℒ{5 + e^(2t)} at s = 3.",
    steps: [
     "The constant 5 is 5t⁰, with transform 5 ÷ s for s > 0; e^(2t) needs s > 2.",
     "At s = 3: 5 ÷ 3 ≈ 1.667 and 1 ÷ (3 − 2) = 1.",
     "Adding, about 2.667."
    ],
    answer: "About 2.667, and the transform exists for s > 2."
   },
   pitfalls: [
    "Writing ℒ{tⁿ} = 1 ÷ sⁿ⁺¹ and forgetting the n!. ℒ{t²} = 2 ÷ s³.",
    "Swapping the sine and cosine rows: sin(bt) has b on top, cos(bt) has s on top.",
    "Using s > 0 for an exponential that grows. e^(3t) needs s > 3, and that sets the limit for the whole signal."
   ]
  },
  guidance: [
   { prompt: "Each piece needs s > 0, except e^(at), which needs s > a. Which number must s exceed?", answer: [0], labels: ["s must exceed"], explanation: "The largest of 0 and −1 is 0, so the transform exists for s > 0." },
   { prompt: "What is ℒ{4t²} at s = 2?", answer: [1], labels: ["power piece"], explanation: "4 × 2! ÷ 2^3 = 8 ÷ 8 = 1." },
   { prompt: "What is ℒ{3e^(−t)} at s = 2?", answer: [1], labels: ["exponential piece"], explanation: "3 ÷ (2 − (−1)) = 3 ÷ 3 = 1." },
   { prompt: "What is ℒ{2sin(4t)} at s = 2?", answer: [0.4], labels: ["sine or cosine piece"], explanation: "2 × 4 ÷ (2² + 4²) = 0.4." },
   { prompt: "What is ℒ{f}(2), the sum of the three pieces?", answer: [2.4], labels: ["ℒ{f} at the given s"], explanation: "1 + 1 + 0.4 = 2.4." }
  ]
 }
);
})();
