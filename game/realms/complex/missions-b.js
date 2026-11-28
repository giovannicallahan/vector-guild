/* Complex analysis: the plane of numbers missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/complex/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Exponentials and logarithms · Basic, 100 XP · sector 'Rotor Hall' · Chapter review: the rotor log [1.7, 1.11]
     q12  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Limits and the complex derivative [2.3, 2.5]
     q13  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Cauchy–Riemann equations [2.6]
     q14  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Rules of differentiation [2.5]
     q15  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Sine, cosine, sinh and cosh [2.8, 1.12]
     q16  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Harmonic functions [6.2]
     q17  ch 3 Analytic functions · Intermediate, 150 XP · sector 'Flow Tank' · Chapter review: the flow tank [2.6, 6.2]
     q18  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Contour integrals by parametrisation [4.2]
     q19  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Antiderivatives and path independence [4.3]
     q20  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Powers round a circle [4.5] */
(function(){
'use strict';
/* Orloff, Complex Variables with Applications (MIT), on LibreTexts: one entry per section the missions below cite. Each page was opened
   on the date in `verified`. A source row credits a section only with what it states; the rest is worked out in the mission. */
const source = {
 s1_7: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.7 The Exponential Function", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.07%3A_The_Exponential_Function", description: "The complex exponential e^(x + iy) = e^x(cos y + i sin y), and its modulus e^x.", verified: '2026-11-27' },
 s1_11: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.11 The Function log(z)", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.11%3A_The_Function_log(z)", description: "log z = ln |z| + i arg z, the principal branch with −π < arg z ≤ π, and complex powers.", verified: '2026-11-27' },
 s1_12: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.12 Inverse Euler formula", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.12%3A_Inverse_Euler_formula", description: "Cosine and sine written with e^(it) and e^(−it).", verified: '2026-11-27' },
 s2_3: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 2.3 Limits and Continuous Functions", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/02%3A_Analytic_Functions/2.03%3A_Limits_and_Continuous_Functions", description: "Limits of complex functions: f(z) must close in on the same value whichever direction z approaches from.", verified: '2026-11-27' },
 s2_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 2.5 Derivatives", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/02%3A_Analytic_Functions/2.05%3A_Derivatives", description: "The complex derivative as a limit of difference quotients, the derivative of z², and the sum, product, quotient and chain rules.", verified: '2026-11-27' },
 s2_6: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 2.6 Cauchy-Riemann Equations", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/02%3A_Analytic_Functions/2.06%3A_Cauchy-Riemann_Equations", description: "Partial derivatives, the Cauchy–Riemann equations, and the derivative f′ = ∂u/∂x + i ∂v/∂x.", verified: '2026-11-27' },
 s2_8: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 2.8 Gallery of Functions", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/02%3A_Analytic_Functions/2.08%3A_Gallery_of_Functions", description: "The complex sine, cosine, sinh and cosh, sin(x + iy) = sin x cosh y + i cos x sinh y, and their derivatives.", verified: '2026-11-27' },
 s6_2: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 6.2 Harmonic Functions", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/06%3A_Harmonic_Functions/6.02%3A_Harmonic_Functions", description: "Harmonic functions as the solutions of Laplace’s equation.", verified: '2026-11-27' },
 s4_2: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.2 Complex Line Integrals", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.02%3A_Complex_Line_Integrals", description: "Integrals along a parametrised curve as ∫ f(γ(t)) γ′(t) dt, with examples on a line segment, including the integral of z̄.", verified: '2026-11-27' },
 s4_3: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.3 Fundamental Theorem for Complex Line Integrals", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.03%3A_Fundamental_Theorem_for_Complex_Line_Integrals", description: "If F′ = f, the integral of f along a curve is F at the end minus F at the start, so a closed curve gives 0.", verified: '2026-11-27' },
 s4_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.5 Examples", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.05%3A_Examples", description: "Worked integrals round circles: dz ÷ z round the unit circle gives 2πi and dz ÷ z² gives 0.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "The rotor log", topic: "Chapter review: modulus, argument and logarithm", tier: "Basic", sector: "Rotor Hall",
  brief: "The rotor log stores each position as one complex number, and the night shift needs its size, its angle and a logarithm read off it.",
  lesson: "Modulus, argument and logarithm fit together: Log z = ln |z| + i Arg z, and raising z to a power raises |z| to that power.",
  prompt: "The rotor log records the rotor’s position as the complex number z = −3 + 4i. Angles are in radians. Enter the modulus |z|, then the principal argument Arg z to 2 decimal places, then the real part of Log(z²) to 2 decimal places.",
  answer: [5,2.21,3.22], labels: ["|z|","Arg z (radians)","Re Log(z²)"], tolerance: 0.005,
  hints: [
   "The modulus of a + bi is √(a² + b²). For Arg z, first decide which quadrant z is in: Arg z lies in (−π, π], and arctan on its own only gives angles between −π ÷ 2 and π ÷ 2.",
   "By de Moivre’s formula, squaring a complex number squares its modulus. The real part of Log w is ln |w|."
  ],
  solution: "|z| = √(9 + 16) = √25 = 5. z lies in the second quadrant (real part negative, imaginary part positive). arctan(4 ÷ 3) ≈ 0.9273, so Arg z = π − 0.9273 ≈ 3.1416 − 0.9273 = 2.2143, which is 2.21 to 2 decimal places. Squaring z squares its modulus: |z²| = 5² = 25. So Re Log(z²) = ln 25 ≈ 3.2189, which is 3.22 to 2 decimal places.",
  xp: 100, prereqs: ["q06","q10"],
  sources: [source.s1_7, source.s1_11],
  teaching: {
   intuition: "Every complex number z = a + bi is an arrow in the plane. Its length is the modulus |z| = √(a² + b²), and its direction is the argument: the angle from the positive real axis, in radians. The principal argument Arg z is the one choice of that angle in (−π, π]. These two numbers are exactly what the logarithm reads: the principal logarithm is Log z = ln |z| + i Arg z, so its real part only cares about the length. Powers fit the same picture. By de Moivre’s formula, (r e^(iθ))ⁿ = rⁿ e^(inθ): the length is raised to the power and the angle is multiplied. So the length of z² is |z|², and Re Log(z²) = ln(|z|²).",
   steps: [
    "Find the modulus |z| = √(a² + b²).",
    "Find the quadrant from the signs of a and b. Take φ = arctan(|b| ÷ |a|), then Arg z is φ in the first quadrant, π − φ in the second, −(π − φ) in the third and −φ in the fourth.",
    "For a power zⁿ, the modulus is |z|ⁿ, so Re Log(zⁿ) = ln(|z|ⁿ).",
    "Round only at the end, to the number of decimal places asked for."
   ],
   example: {
    prompt: "z = 5 + 12i. Find |z|, Arg z and Re Log(z²), the last two to 2 decimal places.",
    steps: [
     "|z| = √(25 + 144) = √169 = 13.",
     "Both parts are positive, so Arg z = arctan(12 ÷ 5) ≈ 1.1760, which is 1.18.",
     "|z²| = 13² = 169, so Re Log(z²) = ln 169 ≈ 5.1299, which is 5.13."
    ],
    answer: "|z| = 13, Arg z ≈ 1.18 and Re Log(z²) ≈ 5.13."
   },
   pitfalls: [
    "Using arctan(b ÷ a) straight away when the real part is negative. That gives an angle in the wrong half of the plane; use the quadrant first.",
    "Giving an argument outside (−π, π]. The principal argument of a number below the real axis is negative, not a number between π and 2π.",
    "Taking ln |z| for Log(z²). Squaring z squares the modulus, so the real part doubles."
   ]
  },
  guidance: [
   { prompt: "What is the modulus of z = −3 + 4i?", answer: [5], labels: ["|z|"], explanation: "|z| = √((−3)² + 4²) = √25 = 5." },
   { prompt: "z lies in the second quadrant (real part negative, imaginary part positive), and arctan(4 ÷ 3) ≈ 0.9273. What is Arg z, to 2 decimal places?", answer: [2.21], labels: ["Arg z (radians)"], explanation: "Arg z = π − 0.9273 ≈ 3.1416 − 0.9273 = 2.2143, which is 2.21 to 2 decimal places. It lies in (−π, π], as a principal argument must." },
   { prompt: "|z²| = |z|² = 25. What is Re Log(z²) = ln |z²|, to 2 decimal places?", answer: [3.22], labels: ["Re Log(z²)"], explanation: "ln 25 ≈ 3.2189, which is 3.22 to 2 decimal places." }
  ]
 },
 {
  id: "q12", title: "Smooth flow past the hull", topic: "Limits and the complex derivative", tier: "Intermediate", sector: "Flow Tank",
  brief: "The flow tank needs to know how fast the flow model changes at one point near the hull, and in which direction it turns.",
  lesson: "The complex derivative f′(z₀) is the limit of (f(z₀ + h) − f(z₀)) ÷ h as the complex number h shrinks to 0 from every direction; polynomials follow the power rule.",
  prompt: "In the flow tank the flow past the hull is modelled by f(z) = z³ + 2z² − 5z + 4. Find the complex derivative f′(z₀) at z₀ = 1 + 2i. Enter its real part, then its imaginary part.",
  answer: [-10,20], labels: ["Re f′(z₀)","Im f′(z₀)"], tolerance: 0.01,
  hints: [
   "For a polynomial in z, the complex derivative follows the same power rule as for real x: zⁿ has derivative nzⁿ⁻¹, and a constant has derivative 0.",
   "Square z₀ first, using i² = −1. Then put z₀ and z₀² into f′(z) and collect the real parts and the imaginary parts."
  ],
  solution: "By the power rule, f′(z) = 3z² + 4z − 5. z₀² = (1 + 2i)² = 1² − 2² + (2 × 1 × 2)i = −3 + 4i. So 3z₀² = −9 + 12i and 4z₀ = 4 + 8i, and f′(z₀) = (−9 + 12i) + (4 + 8i) + (−5) = −10 + 20i.",
  xp: 150, prereqs: ["q07"],
  sources: [source.s2_3, source.s2_5],
  teaching: {
   intuition: "A function w = f(z) takes a point of the plane to another point. Near a point z₀, we ask how a tiny step h away from z₀ changes the output. In real calculus h could only come from the left or the right. In the plane h is a complex number, so it can arrive from any direction: from the right, from above, along a spiral. We say h → 0 when the distance from h to 0, √((Re h)² + (Im h)²), shrinks towards 0, whatever the direction. The limit of a function as z → z₀ is the value it closes in on from every direction at once. The complex derivative is f′(z₀) = the limit of (f(z₀ + h) − f(z₀)) ÷ h as h → 0. For f(z) = z², the quotient is ((z₀ + h)² − z₀²) ÷ h = 2z₀ + h, which closes in on 2z₀ from every direction, so (z²)′ = 2z. In the same way zⁿ has derivative nzⁿ⁻¹, and sums and constant multiples behave as in real calculus. So a polynomial in z is differentiated exactly like a polynomial in x; only the arithmetic at the end is complex.",
   steps: [
    "Differentiate the polynomial term by term with the power rule: zⁿ becomes nzⁿ⁻¹, and a constant becomes 0.",
    "Work out the powers of z₀ you need, using i² = −1.",
    "Put z₀ into f′(z) and add the real parts and the imaginary parts separately.",
    "Read off the real part and the imaginary part of f′(z₀)."
   ],
   example: {
    prompt: "Find f′(z₀) for f(z) = z² + 3z at z₀ = 2 − i.",
    steps: [
     "f′(z) = 2z + 3.",
     "f′(2 − i) = 2(2 − i) + 3 = 4 − 2i + 3."
    ],
    answer: "f′(z₀) = 7 − 2i: real part 7, imaginary part −2."
   },
   pitfalls: [
    "Forgetting that i² = −1 when squaring z₀, so the real part of z₀² comes out as a² + b² instead of a² − b².",
    "Putting z₀ into f instead of f′. The question asks for the rate of change at z₀, not the value there.",
    "Adding the constant term of f to the derivative. A constant does not change, so its derivative is 0."
   ]
  },
  guidance: [
   { prompt: "z₀ = 1 + 2i. What is the real part of z₀²?", answer: [-3], labels: ["Re z₀²"], explanation: "(a + bi)² = a² − b² + 2abi, so the real part is 1² − 2² = −3." },
   { prompt: "What is the imaginary part of z₀²?", answer: [4], labels: ["Im z₀²"], explanation: "It is 2ab = 2 × 1 × 2 = 4, so z₀² = −3 + 4i." },
   { prompt: "f′(z) = 3z² + 4z − 5. What is the real part of f′(z₀)?", answer: [-10], labels: ["Re f′(z₀)"], explanation: "3z₀² = −9 + 12i and 4z₀ = 4 + 8i. The real parts add up: −9 + 4 + (−5) = −10." },
   { prompt: "What is the imaginary part of f′(z₀)?", answer: [20], labels: ["Im f′(z₀)"], explanation: "The imaginary parts: 12 + 8 = 20. The constant −5 is real and adds nothing here." }
  ]
 },
 {
  id: "q13", title: "Testing the flow models", topic: "Cauchy–Riemann equations", tier: "Intermediate", sector: "Flow Tank",
  brief: "Two flow models arrived as pairs of real functions, and only the ones that really come from a complex function can be trusted in the tank.",
  lesson: "f = u + iv is analytic exactly when the Cauchy–Riemann equations ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x hold at every point, with continuous partial derivatives.",
  prompt: "Two flow models for the tank are written as pairs of real functions of x and y. Model A: u(x, y) = 2x³ − kxy² − 5x and v(x, y) = 6x²y − 2y³ − 5y, where k is a constant. Model B: U(x, y) = 3x² − 3y² + 4y and V(x, y) = 6xy − 4x. Enter the value of k that makes u + iv analytic, then 1 if U + iV is analytic or 0 if it is not.",
  answer: [6,1], labels: ["k","B analytic (1 or 0)"], tolerance: 0.01,
  hints: [
   "A partial derivative ∂u/∂x treats y as a fixed number and differentiates in x; ∂u/∂y treats x as fixed and differentiates in y.",
   "u + iv is analytic exactly when the Cauchy–Riemann equations ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x hold at every point (these partial derivatives are continuous here). Match the coefficient of each term."
  ],
  solution: "Model A: ∂u/∂x = 6x² − ky² − 5 and ∂v/∂y = 6x² − 6y² − 5. They agree everywhere only if k = 6. Then ∂u/∂y = −2kxy = −12xy and −∂v/∂x = −12xy, which agree too, so k = 6. Model B: ∂U/∂x = 6x = ∂V/∂y, but ∂U/∂y = −6y + 4 and −∂V/∂x = −6y + 4. These agree at every point, so U + iV is analytic: 1.",
  xp: 150, prereqs: ["q12"],
  sources: [source.s2_6],
  teaching: {
   intuition: "Write z = x + iy and split a complex function into its real part and its imaginary part: f(z) = u(x, y) + i v(x, y), where u and v are ordinary real functions of two variables. To see how u changes we use partial derivatives. ∂u/∂x (read “partial u by partial x”) is the derivative of u in x while y is held fixed as if it were a number; ∂u/∂y holds x fixed instead. For x²y, ∂/∂x gives 2xy and ∂/∂y gives x². Now, a complex derivative must be the same limit from every direction. Stepping h along the real axis gives f′ = ∂u/∂x + i ∂v/∂x; stepping up the imaginary axis gives f′ = ∂v/∂y − i ∂u/∂y. The two agree only if ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x. These are the Cauchy–Riemann equations. A function is analytic on a region when it has a complex derivative at every point there; when the partial derivatives are continuous, that happens exactly when the Cauchy–Riemann equations hold at every point. Most pairs u, v you could write down fail them: only special pairs come from a complex function.",
   steps: [
    "Work out the four partial derivatives ∂u/∂x, ∂u/∂y, ∂v/∂x and ∂v/∂y, holding the other variable fixed each time.",
    "Check the first equation, ∂u/∂x = ∂v/∂y, term by term: matching coefficients fixes any unknown constant.",
    "Check the second equation, ∂u/∂y = −∂v/∂x, the same way. Both must hold at every point.",
    "If both hold everywhere (and the partial derivatives are continuous, as they are for polynomials), u + iv is analytic, and then f′ = ∂u/∂x + i ∂v/∂x."
   ],
   example: {
    prompt: "For which k is u = x² − ky², v = 2xy an analytic pair?",
    steps: [
     "∂u/∂x = 2x and ∂v/∂y = 2x: the first equation holds for any k.",
     "∂u/∂y = −2ky and −∂v/∂x = −2y: the second equation needs k = 1."
    ],
    answer: "k = 1, which gives u + iv = z²."
   },
   pitfalls: [
    "Checking only the first equation. Both equations must hold; a pair can pass one and fail the other.",
    "Forgetting the minus sign in the second equation: it is ∂u/∂y = −∂v/∂x, not ∂u/∂y = ∂v/∂x.",
    "Treating y as a variable when taking ∂/∂x. In ∂u/∂x the y is a fixed number, so a term like y³ differentiates to 0."
   ]
  },
  guidance: [
   { prompt: "Differentiate v with respect to y, holding x fixed. What is the coefficient of y² in ∂v/∂y?", answer: [-6], labels: ["coefficient of y²"], explanation: "∂v/∂y = 6x² − 6y² − 5, so the y² term has coefficient −6." },
   { prompt: "∂u/∂x = 6x² − ky² − 5. The first Cauchy–Riemann equation needs ∂u/∂x = ∂v/∂y at every point. What must k be?", answer: [6], labels: ["k"], explanation: "Matching the y² terms gives −k = −6, so k = 6. The second equation, ∂u/∂y = −∂v/∂x, gives −2kxy = −12xy: the same k." },
   { prompt: "For model B, ∂U/∂y = −6y + 4 and −∂V/∂x = −6y + 4. What is ∂U/∂y − (−∂V/∂x)? It must be 0 at every point for U + iV to be analytic.", answer: [0], labels: ["difference"], explanation: "The y terms cancel and leave 4 − 4 = 0." },
   { prompt: "The first equation holds for model B: ∂U/∂x = 6x = ∂V/∂y. Is U + iV analytic? Enter 1 for yes, 0 for no.", answer: [1], labels: ["B analytic (1 or 0)"], explanation: "Both Cauchy–Riemann equations hold at every point and the partial derivatives are continuous, so U + iV is analytic: 1." }
  ]
 },
 {
  id: "q14", title: "Reading the flow probe", topic: "Rules of differentiation", tier: "Intermediate", sector: "Flow Tank",
  brief: "A probe’s formula is built from simpler pieces, and the tank crew needs its rate of change at one point without expanding everything.",
  lesson: "The product, quotient and chain rules hold for complex derivatives exactly as for real ones; only the arithmetic at the end is complex.",
  prompt: "A flow probe in the tank reads f(z) = (z² + 3)(z − 2). Find f′(z₀) at z₀ = 2 + i. Enter its real part, then its imaginary part.",
  answer: [4,8], labels: ["Re f′(z₀)","Im f′(z₀)"], tolerance: 0.005,
  hints: [
   "The product rule (gh)′ = g′h + gh′, the quotient rule (g ÷ h)′ = (g′h − gh′) ÷ h² and the chain rule (g(h(z)))′ = g′(h(z)) h′(z) work for complex functions exactly as for real ones.",
   "Simplify f′(z) as a formula first, then put in z₀ and use i² = −1. To divide by a complex number, multiply the top and the bottom by its conjugate."
  ],
  solution: "By the product rule, f′(z) = 2z(z − 2) + (z² + 3). z₀² = 3 + 4i, so z₀² + 3 = 6 + 4i. z₀ − 2 = i, so 2z₀(z₀ − 2) = 2 × (2 + i) × i = −2 + 4i. So f′(z₀) = (−2 + 4i) + (6 + 4i) = 4 + 8i.",
  xp: 150, prereqs: ["q12"],
  sources: [source.s2_5],
  teaching: {
   intuition: "The rules that build derivatives in real calculus come from the limit of a difference quotient and from ordinary algebra. Nothing in that algebra cares whether the numbers are real or complex, so the same rules hold for complex functions that have derivatives. The product rule: (gh)′ = g′h + gh′. The quotient rule: (g ÷ h)′ = (g′h − gh′) ÷ h², wherever h is not 0. The chain rule: the derivative of g(h(z)) is g′(h(z)) × h′(z). The only new work is complex arithmetic at the end: multiplying with i² = −1, and dividing by a complex number by multiplying the top and the bottom by its conjugate, so that the bottom becomes the real number |w|².",
   steps: [
    "Decide which rule fits: a product of two pieces, a quotient, or one function inside another.",
    "Write f′(z) with that rule and simplify it as a formula in z.",
    "Put in z₀, working out each piece with i² = −1.",
    "For a quotient, divide by a complex number w by multiplying the top and the bottom by its conjugate w̄; the bottom becomes |w|², a real number."
   ],
   example: {
    prompt: "Find f′(i) for f(z) = (z + 1) ÷ (z − 1).",
    steps: [
     "Quotient rule: f′(z) = ((z − 1) − (z + 1)) ÷ (z − 1)² = −2 ÷ (z − 1)².",
     "(i − 1)² = i² − 2i + 1 = −2i, so f′(i) = −2 ÷ (−2i) = 1 ÷ i.",
     "1 ÷ i = −i ÷ (i × (−i)) = −i ÷ 1 = −i."
    ],
    answer: "f′(i) = −i: real part 0, imaginary part −1."
   },
   pitfalls: [
    "Swapping the order on top of the quotient rule: it is g′h − gh′, and the other order flips the sign.",
    "Forgetting the inner derivative in the chain rule: the derivative of (z² + a)³ needs the factor 2z.",
    "Dividing the real and imaginary parts separately by the parts of a complex bottom. Multiply by the conjugate instead."
   ]
  },
  guidance: [
   { prompt: "By the product rule, f′(z) = 2z(z − 2) + (z² + 3). What is the real part of 2z₀(z₀ − 2)?", answer: [-2], labels: ["real part"], explanation: "2z₀(z₀ − 2) = −2 + 4i." },
   { prompt: "What is the imaginary part of 2z₀(z₀ − 2)?", answer: [4], labels: ["imaginary part"], explanation: "2z₀(z₀ − 2) = −2 + 4i, so its imaginary part is 4." },
   { prompt: "What is the real part of f′(z₀)?", answer: [4], labels: ["Re f′(z₀)"], explanation: "f′(z₀) = (−2 + 4i) + (z₀² + 3), and z₀² + 3 = 6 + 4i. That gives f′(z₀) = 4 + 8i." },
   { prompt: "What is the imaginary part of f′(z₀)?", answer: [8], labels: ["Im f′(z₀)"], explanation: "f′(z₀) = 4 + 8i, so its imaginary part is 8." }
  ]
 },
 {
  id: "q15", title: "Waves with an imaginary twist", topic: "Sine, cosine, sinh and cosh", tier: "Intermediate", sector: "Flow Tank",
  brief: "A surface wave in the tank is modelled with sine and cosine of complex numbers, and the crew needs to know how large they get.",
  lesson: "cos z = (e^(iz) + e^(−iz)) ÷ 2 and sin z = (e^(iz) − e^(−iz)) ÷ (2i); on the imaginary axis cosine becomes cosh, which grows without bound.",
  prompt: "A wave in the flow tank is modelled with the complex sine and cosine. Angles are in radians. Enter cos(iy) for y = 1, then |sin(x + iy)| for x = π ÷ 4 and y = 1, both to 2 decimal places.",
  answer: [1.54,1.37], labels: ["cos(iy)","|sin(x + iy)|"], tolerance: 0.005,
  hints: [
   "Put z = iy into cos z = (e^(iz) + e^(−iz)) ÷ 2. Since i × i = −1, both exponents become real, and the result is cosh y = (e^y + e^(−y)) ÷ 2.",
   "sin(x + iy) = sin x cosh y + i cos x sinh y. Its modulus squared is sin²x cosh²y + cos²x sinh²y, which simplifies to sin²x + sinh²y because cosh²y − sinh²y = 1."
  ],
  solution: "cos(iy) = (e^(−y) + e^y) ÷ 2 = cosh y. With y = 1: e^1 ≈ 2.7183 and e^(−1) ≈ 0.3679, so cosh 1 ≈ 1.5431, which is 1.54 to 2 decimal places. Next, sinh 1 = (e^1 − e^(−1)) ÷ 2 ≈ 1.1752, and sin(π ÷ 4) = √2 ÷ 2, so sin²(π ÷ 4) = 0.5. Then |sin(x + iy)| = √(sin²x + sinh²y) ≈ √(0.5 + 1.3811) ≈ 1.3715, which is 1.37 to 2 decimal places.",
  xp: 150, prereqs: ["q08"],
  sources: [source.s1_12, source.s2_8],
  teaching: {
   intuition: "Euler’s formula e^(iθ) = cos θ + i sin θ, together with e^(−iθ) = cos θ − i sin θ, can be solved for cosine and sine: cos θ = (e^(iθ) + e^(−iθ)) ÷ 2 and sin θ = (e^(iθ) − e^(−iθ)) ÷ (2i). The right-hand sides make sense for any complex number, so we use them to define cos z and sin z. Two related real functions appear at once. The hyperbolic cosine is cosh y = (e^y + e^(−y)) ÷ 2 and the hyperbolic sine is sinh y = (e^y − e^(−y)) ÷ 2, read “cosh” and “sinch”. Put z = iy into cos z: iz = i × iy = −y, so cos(iy) = (e^(−y) + e^y) ÷ 2 = cosh y. That is a real number that grows like e^y ÷ 2, so the complex cosine is not stuck between −1 and 1. Splitting sin(x + iy) gives sin x cosh y + i cos x sinh y, and since cosh²y − sinh²y = 1, its modulus is |sin(x + iy)| = √(sin²x + sinh²y). That modulus formula is worked out in this mission from the two parts.",
   steps: [
    "For cos(iy), use cos(iy) = cosh y = (e^y + e^(−y)) ÷ 2.",
    "Work out sinh y = (e^y − e^(−y)) ÷ 2 and sin x for the given angle in radians.",
    "Use |sin(x + iy)| = √(sin²x + sinh²y), which comes from sin(x + iy) = sin x cosh y + i cos x sinh y.",
    "Keep 4 decimal places in the working and round to 2 only at the end."
   ],
   example: {
    prompt: "Find cos(iy) for y = 3, and |sin(x + iy)| for x = π ÷ 2 and y = 3, to 2 decimal places.",
    steps: [
     "cosh 3 = (e³ + e^(−3)) ÷ 2 ≈ (20.0855 + 0.0498) ÷ 2 ≈ 10.0677, which is 10.07.",
     "sin(π ÷ 2) = 1, so |sin(x + iy)| = √(1 + sinh²3). Since cosh² − sinh² = 1, that is cosh 3 ≈ 10.07."
    ],
    answer: "cos(3i) ≈ 10.07 and |sin(π ÷ 2 + 3i)| ≈ 10.07."
   },
   pitfalls: [
    "Expecting |cos z| and |sin z| to stay at most 1, as they do for real angles. Off the real axis they grow like e^(|y|) ÷ 2.",
    "Mixing up cosh and sinh: cosh has the plus sign and is never below 1; sinh has the minus sign and is 0 at y = 0.",
    "Working the angle x in degrees. Angles here are in radians."
   ]
  },
  guidance: [
   { prompt: "cos(iy) = cosh y = (e^y + e^(−y)) ÷ 2. What is cosh 1, to 2 decimal places?", answer: [1.54], labels: ["cosh y"], explanation: "(2.7183 + 0.3679) ÷ 2 ≈ 1.5431, which is 1.54 to 2 decimal places." },
   { prompt: "What is sin²(π ÷ 4)?", answer: [0.5], labels: ["sin²x"], explanation: "sin(π ÷ 4) = √2 ÷ 2, and its square is 0.5." },
   { prompt: "sinh y = (e^y − e^(−y)) ÷ 2. What is sinh²(1), to 2 decimal places?", answer: [1.38], labels: ["sinh²y"], explanation: "sinh 1 ≈ 1.1752, and its square ≈ 1.3811, which is 1.38 to 2 decimal places." },
   { prompt: "|sin(x + iy)| = √(sin²x + sinh²y). What is it, to 2 decimal places?", answer: [1.37], labels: ["|sin(x + iy)|"], explanation: "√(0.5 + 1.3811) ≈ 1.3715, which is 1.37 to 2 decimal places." }
  ]
 },
 {
  id: "q16", title: "Calm water in the tank", topic: "Harmonic functions", tier: "Intermediate", sector: "Flow Tank",
  brief: "Steady pressure in still water has to balance at every point, and the crew needs to check which of two pressure models does.",
  lesson: "A function u(x, y) is harmonic when its Laplacian ∂²u/∂x² + ∂²u/∂y² is 0 at every point: it satisfies Laplace’s equation.",
  prompt: "The flow tank’s pressure models must be harmonic. Model 1 is u(x, y) = ax² + 4xy + 3y² − 2x, where a is a constant. Model 2 is w(x, y) = x³ + 2xy² − y². Enter the value of a that makes u harmonic, then the Laplacian ∂²w/∂x² + ∂²w/∂y² of w at the point (2, −1).",
  answer: [-3,18], labels: ["a","Laplacian of w"], tolerance: 0.01,
  hints: [
   "A function is harmonic when its Laplacian ∂²u/∂x² + ∂²u/∂y² is 0 at every point: that is Laplace’s equation. A term in xy or in x alone has second derivative 0 in both directions.",
   "For a second partial derivative, differentiate twice in the same variable, treating the other variable as a fixed number each time."
  ],
  solution: "For u: ∂²u/∂x² = 2a and ∂²u/∂y² = 6; the xy and x terms give 0. Laplace’s equation 2a + 6 = 0 gives a = −3. For w: ∂²w/∂x² = 6x and ∂²w/∂y² = 4x − 2. At (2, −1) these are 12 and 6, so the Laplacian is 12 + 6 = 18. It is not 0, so w is not harmonic.",
  xp: 150, prereqs: ["q13"],
  sources: [source.s6_2],
  teaching: {
   intuition: "A second partial derivative is a partial derivative taken twice. ∂²u/∂x² means: differentiate u in x, holding y fixed, then do it again. ∂²u/∂y² does the same in y. For u = x²y, ∂²u/∂x² = 2y and ∂²u/∂y² = 0. The sum ∂²u/∂x² + ∂²u/∂y² is called the Laplacian of u. It measures how u at a point compares with the average of u on a tiny circle round it: positive when the point sits below its surroundings, negative when it sits above. A function whose Laplacian is 0 at every point is called harmonic, and the equation ∂²u/∂x² + ∂²u/∂y² = 0 is Laplace’s equation. Steady temperatures, still pressures and smooth flows are all harmonic: nothing bulges up or dips down. In a sum of terms, each term contributes its own second derivatives, so the test is term by term. Terms like xy or x have zero second derivatives in both directions, while x² gives 2 and y² gives 2: so ax² + cy² is harmonic only when a = −c.",
   steps: [
    "Differentiate each term twice in x, holding y fixed: that is ∂²u/∂x².",
    "Differentiate each term twice in y, holding x fixed: that is ∂²u/∂y².",
    "Add them to get the Laplacian. If it must be 0 at every point, set each coefficient of the sum to 0 and solve for the unknown.",
    "For a value at a point, put the point’s x and y into the Laplacian."
   ],
   example: {
    prompt: "Find a so that u = ax² + 5y² is harmonic, and find the Laplacian of w = x³ + y² at (1, 0).",
    steps: [
     "∂²u/∂x² = 2a and ∂²u/∂y² = 10, so 2a + 10 = 0 and a = −5.",
     "For w: ∂²w/∂x² = 6x and ∂²w/∂y² = 2, so the Laplacian is 6x + 2, which is 8 at (1, 0)."
    ],
    answer: "a = −5; the Laplacian of w at (1, 0) is 8, so w is not harmonic."
   },
   pitfalls: [
    "Differentiating once instead of twice. The Laplacian uses second partial derivatives.",
    "Treating the other variable as a variable: in ∂²/∂x² the y is a fixed number, so the second x-derivative of xy² is 0.",
    "Calling a function harmonic because its Laplacian is 0 at one point. It must be 0 at every point."
   ]
  },
  guidance: [
   { prompt: "Differentiate u twice with respect to y, holding x fixed. What is ∂²u/∂y²?", answer: [6], labels: ["∂²u/∂y²"], explanation: "Only the y² term survives two differentiations in y: 3y² gives 6y and then 6." },
   { prompt: "∂²u/∂x² = 2a. What value of a makes the Laplacian of u equal to 0?", answer: [-3], labels: ["a"], explanation: "2a + 6 = 0 gives a = −3, at every point at once." },
   { prompt: "What is ∂²w/∂x² at the point (2, −1)?", answer: [12], labels: ["∂²w/∂x²"], explanation: "Only the x³ term survives: ∂²w/∂x² = 6x, which is 12 at x = 2." },
   { prompt: "What is ∂²w/∂y² at that point?", answer: [6], labels: ["∂²w/∂y²"], explanation: "∂²w/∂y² = 4x − 2, which is 6 at x = 2. The Laplacian is the sum of the two." }
  ]
 },
 {
  id: "q17", title: "Signing off the flow tank", topic: "Chapter review: analytic and harmonic flow", tier: "Intermediate", sector: "Flow Tank",
  brief: "Before the hull model leaves the tank, its flow has to be harmonic, analytic and measured at one test point.",
  lesson: "The real part of a flow must be harmonic, the pair u, v must satisfy Cauchy–Riemann, and then f′ = ∂u/∂x + i ∂v/∂x.",
  prompt: "The flow round the hull is f = u + iv with u(x, y) = 2x³ + kxy² + 3y and v(x, y) = mx²y − 2y³ − 3x, where k and m are constants. Enter the k that makes u harmonic, then the m that makes u and v satisfy the Cauchy–Riemann equations, then the real part and the imaginary part of f′(z₀) at z₀ = 2 + i.",
  answer: [-6,6,18,21], labels: ["k","m","Re f′(z₀)","Im f′(z₀)"], tolerance: 0.01,
  hints: [
   "u is harmonic when ∂²u/∂x² + ∂²u/∂y² = 0 at every point. u and v satisfy the Cauchy–Riemann equations when ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at every point.",
   "When f = u + iv is analytic, f′ = ∂u/∂x + i ∂v/∂x: differentiate u and v in x, then put in the point (x, y) that matches z₀ = x + iy."
  ],
  solution: "∂²u/∂x² = 12x and ∂²u/∂y² = 2kx, so u is harmonic when 12 + 2k = 0: k = −6. Then ∂u/∂x = 6x² − 6y² and ∂v/∂y = mx² − 6y², so m = 6; the second equation, −12xy + 3 = −(2mxy − 3), agrees. At z₀ = 2 + i, x = 2 and y = 1: ∂u/∂x = 6 × 4 − 6 × 1 = 18 and ∂v/∂x = 2 × 6 × 2 × 1 − 3 = 21. So f′(z₀) = 18 + 21i.",
  xp: 150, prereqs: ["q14","q16"],
  sources: [source.s2_6, source.s6_2],
  teaching: {
   intuition: "This chapter built three tools that work together on one flow f = u + iv. Laplace’s equation tells us whether u on its own is a calm, harmonic field: ∂²u/∂x² + ∂²u/∂y² = 0 everywhere. The Cauchy–Riemann equations tell us whether u and v fit together as the two parts of one analytic function: ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x. And once f is analytic, its derivative can be read straight from the partial derivatives, by stepping h along the real axis: f′ = ∂u/∂x + i ∂v/∂x. So a flow with unknown constants can be fixed one condition at a time and then measured at any point.",
   steps: [
    "Use Laplace’s equation on u to find the constant in u.",
    "With u fixed, use the first Cauchy–Riemann equation to find the constant in v; check the second equation agrees.",
    "Work out ∂u/∂x and ∂v/∂x as formulas.",
    "Put in the point (x, y) of z₀ = x + iy: the real part of f′(z₀) is ∂u/∂x and the imaginary part is ∂v/∂x."
   ],
   example: {
    prompt: "u = x³ + kxy², v = mx²y − y³. Find k, m and f′(1).",
    steps: [
     "∂²u/∂x² + ∂²u/∂y² = 6x + 2kx = 0 gives k = −3.",
     "∂u/∂x = 3x² − 3y² and ∂v/∂y = mx² − 3y² give m = 3.",
     "At z = 1, x = 1 and y = 0: ∂u/∂x = 3 and ∂v/∂x = 2mxy = 0."
    ],
    answer: "k = −3, m = 3 and f′(1) = 3 (this flow is f = z³)."
   },
   pitfalls: [
    "Using the point z₀ as x without splitting it: for z₀ = x + iy, both x and y go into the partial derivatives.",
    "Reading f′ as ∂u/∂x + ∂v/∂y. The imaginary part of f′ is ∂v/∂x.",
    "Finding m before k. The value of ∂u/∂x depends on k, so fix u first."
   ]
  },
  guidance: [
   { prompt: "∂²u/∂x² = 12x and ∂²u/∂y² = 2kx. What k makes u harmonic?", answer: [-6], labels: ["k"], explanation: "The sum is (12 + 2k)x, which is 0 at every point only if k = −6." },
   { prompt: "With k = −6, ∂u/∂x = 6x² − 6y² and ∂v/∂y = mx² − 6y². What m makes them equal?", answer: [6], labels: ["m"], explanation: "Matching the x² terms gives m = 6. Then ∂u/∂y = −12xy + 3 and −∂v/∂x = −12xy + 3 agree as well." },
   { prompt: "f′ = ∂u/∂x + i ∂v/∂x. What is ∂u/∂x at x = 2, y = 1?", answer: [18], labels: ["Re f′(z₀)"], explanation: "6 × 4 − 6 × 1 = 18. That is the real part of f′(z₀)." },
   { prompt: "∂v/∂x = 2mxy − 3. What is it at that point?", answer: [21], labels: ["Im f′(z₀)"], explanation: "2 × 6 × 2 × 1 − 3 = 21. That is the imaginary part of f′(z₀)." }
  ]
 },
 {
  id: "q18", title: "Down the straight", topic: "Contour integrals by parametrisation", tier: "Intermediate", sector: "Ring Road",
  brief: "A field has to be added up along one straight stretch of the ring road, and the survey team needs the total as one complex number.",
  lesson: "A contour integral ∫_γ f(z) dz is worked out with a parametrisation: ∫ f(γ(t)) γ′(t) dt, splitting into real and imaginary parts.",
  prompt: "A straight stretch of the ring road runs from A = 1 + i to B = 3 + 2i. Parametrise it as γ(t) = A + t(B − A) for t from 0 to 1. Enter the real part, then the imaginary part, of the contour integral ∫_γ z̄ dz.",
  answer: [5.5,-1], labels: ["real part","imaginary part"], tolerance: 0.01,
  hints: [
   "On the segment, γ(t) = A + tD with D = B − A, so γ′(t) = D and ∫_γ f(z) dz = ∫ from 0 to 1 of f(γ(t)) × D dt.",
   "The conjugate of γ(t) is Ā + tD̄, so the integrand is ĀD + t × D̄D, and D̄D = |D|². A constant integrates to itself from 0 to 1, and t integrates to 1 ÷ 2."
  ],
  solution: "D = B − A = 2 + i. The conjugate of γ(t) is Ā + tD̄ with Ā = 1 − i, so z̄ γ′(t) = ĀD + t|D|². ĀD = (1 − i) × (2 + i) = 3 − i and |D|² = 5. Integrating from 0 to 1 gives ĀD + |D|² ÷ 2 = (3 − i) + 2.5 = 5.5 − i.",
  xp: 150, prereqs: ["q12"],
  sources: [source.s4_2],
  teaching: {
   intuition: "A contour is a curve in the plane with a direction: a start, an end and a way of going along it. To describe it we use a parametrisation γ(t), a complex number that depends on a real “time” t, so that as t runs from a to b the point γ(t) travels the curve. A straight segment from A to B is γ(t) = A + t(B − A) for t from 0 to 1. Its velocity γ′(t) is the derivative of the real and imaginary parts in t; for the segment it is the constant B − A. A contour integral ∫_γ f(z) dz adds up f(z) times each tiny step dz along the curve, the way a real integral adds f(x) dx along an interval. With the parametrisation, a step is dz = γ′(t) dt, so ∫_γ f(z) dz = ∫ from a to b of f(γ(t)) γ′(t) dt. The integrand is a complex number for each t; integrate its real part and its imaginary part separately, as two ordinary integrals. Recall the conjugate z̄: for z = x + iy it is x − iy, so the conjugate of A + tD is Ā + tD̄.",
   steps: [
    "Write D = B − A, the parametrisation γ(t) = A + tD for t from 0 to 1, and γ′(t) = D.",
    "Put γ(t) into f and multiply by γ′(t). For f(z) = z this is (A + tD)D; for f(z) = z̄ it is (Ā + tD̄)D.",
    "Write the integrand as a constant plus t times a constant, working the products with i² = −1. Note D̄D = |D|².",
    "Integrate from 0 to 1: a constant stays as it is, and t gives 1 ÷ 2. Add, and read off the real and imaginary parts."
   ],
   example: {
    prompt: "Find ∫_γ z dz along the segment from 0 to 2i.",
    steps: [
     "γ(t) = 2it for t from 0 to 1, so γ′(t) = 2i.",
     "The integrand is 2it × 2i = 4i²t = −4t.",
     "From 0 to 1, −4t integrates to −4 ÷ 2 = −2."
    ],
    answer: "∫_γ z dz = −2: real part −2, imaginary part 0."
   },
   pitfalls: [
    "Leaving out γ′(t). The step dz along the curve is γ′(t) dt, not dt.",
    "Taking the conjugate of D as well when integrating z̄: only the z̄ in the integrand is conjugated, so the step is still D dt.",
    "Integrating t from 0 to 1 as 1 instead of 1 ÷ 2."
   ]
  },
  guidance: [
   { prompt: "What is the real part of D = B − A?", answer: [2], labels: ["Re D"], explanation: "3 − 1 = 2." },
   { prompt: "What is the imaginary part of D?", answer: [1], labels: ["Im D"], explanation: "2 − 1 = 1, so D = 2 + i and dz = D dt." },
   { prompt: "What is the real part of ∫_γ z̄ dz?", answer: [5.5], labels: ["real part"], explanation: "ĀD = 3 − i and |D|² ÷ 2 = 2.5, so the integral is 5.5 − i." },
   { prompt: "What is the imaginary part of ∫_γ z̄ dz?", answer: [-1], labels: ["imaginary part"], explanation: "The integral is 5.5 − i, so its imaginary part is −1." }
  ]
 },
 {
  id: "q19", title: "Any route will do", topic: "Antiderivatives and path independence", tier: "Intermediate", sector: "Ring Road",
  brief: "A cable takes a winding route between two points, and the crew wants its integral without tracing every bend.",
  lesson: "If F′ = f along the way, then ∫_γ f(z) dz = F(end) − F(start) for every curve between the same two points.",
  prompt: "A cable on the ring road runs along a winding route from a = −1 + 2i to b = 2 + 2i. Enter the real part, then the imaginary part, of ∫ z² dz along the route.",
  answer: [-9,6], labels: ["real part","imaginary part"], tolerance: 0.005,
  hints: [
   "zⁿ has the antiderivative zⁿ⁺¹ ÷ (n + 1), because the derivative of that is zⁿ. With an antiderivative F, the integral is F(end) − F(start), whatever route joins them.",
   "Work out the powers of the two end points one multiplication at a time, using i² = −1."
  ],
  solution: "An antiderivative of z² is F(z) = z³ ÷ 3, so the route does not matter: the integral is F(b) − F(a) = (b³ − a³) ÷ 3. b³ = −16 + 16i and a³ = 11 − 2i, so b³ − a³ = −27 + 18i. Dividing by 3 gives −9 + 6i.",
  xp: 150, prereqs: ["q18"],
  sources: [source.s4_3],
  teaching: {
   intuition: "In real calculus an antiderivative turns an integral into a subtraction: if F′ = f, the integral of f from a to b is F(b) − F(a). The same is true for contour integrals. If F is a complex function with F′(z) = f(z) at every point of a curve γ from a to b, then along γ the chain rule gives d/dt F(γ(t)) = f(γ(t)) γ′(t), which is exactly the integrand of the parametrised integral. So ∫_γ f(z) dz = F(b) − F(a). The curve has dropped out: any route from a to b gives the same answer. That is path independence. For powers, zⁿ has the antiderivative zⁿ⁺¹ ÷ (n + 1) everywhere in the plane, so the integral of zⁿ from a to b is (bⁿ⁺¹ − aⁿ⁺¹) ÷ (n + 1) along any route at all.",
   steps: [
    "Find an antiderivative F of the integrand: for zⁿ, F(z) = zⁿ⁺¹ ÷ (n + 1).",
    "Work out F at the end point b and at the start point a, with i² = −1.",
    "Subtract: the integral is F(b) − F(a). The shape of the route does not matter.",
    "Read off the real and imaginary parts."
   ],
   example: {
    prompt: "Find ∫ z dz along any route from 0 to 1 + i.",
    steps: [
     "An antiderivative of z is z² ÷ 2.",
     "(1 + i)² = 1 + 2i + i² = 2i, so the integral is 2i ÷ 2 − 0."
    ],
    answer: "The integral is i: real part 0, imaginary part 1."
   },
   pitfalls: [
    "Subtracting the wrong way round. It is F at the end minus F at the start.",
    "Forgetting to divide by n + 1. The derivative of zⁿ⁺¹ is (n + 1)zⁿ, not zⁿ.",
    "Thinking a longer route gives a bigger answer. With an antiderivative, only the two end points matter."
   ]
  },
  guidance: [
   { prompt: "b³ = −16 + 16i and a³ = 11 − 2i. What is the real part of b³ − a³?", answer: [-27], labels: ["real part of the difference"], explanation: "−16 − 11 = −27." },
   { prompt: "What is the imaginary part of b³ − a³?", answer: [18], labels: ["imaginary part of the difference"], explanation: "16 − (−2) = 18." },
   { prompt: "The integral is (b³ − a³) ÷ 3. What is its real part?", answer: [-9], labels: ["real part"], explanation: "−27 ÷ 3 = −9." },
   { prompt: "What is its imaginary part?", answer: [6], labels: ["imaginary part"], explanation: "18 ÷ 3 = 6. So the integral is −9 + 6i along any route from a to b." }
  ]
 },
 {
  id: "q20", title: "Once round the ring", topic: "Powers round a circle", tier: "Intermediate", sector: "Ring Road",
  brief: "The survey team has to add up several fields all the way round the ring road and back to the start.",
  lesson: "Round a circle centred at c, ∮ (z − c)ⁿ dz is 0 for every whole number n except n = −1, where it is 2πi.",
  prompt: "The ring road is the circle of radius 3 centred at c = 2 − i, driven once anticlockwise; ∮ means a contour integral once round it. ∮ (z − 2 + i)⁻² dz = k₁πi and ∮ (3 ÷ (z − 2 + i) − 2(z − 2 + i)²) dz = k₂πi. Enter k₁, then k₂.",
  answer: [0,6], labels: ["k₁","k₂"], tolerance: 0.01,
  hints: [
   "For a power other than −1, (z − c)ⁿ has the antiderivative (z − c)ⁿ⁺¹ ÷ (n + 1). Round a closed curve the start and the end are the same point, so the integral is 0.",
   "For the power −1, parametrise z = c + r(cos t + i sin t) for t from 0 to 2π. Then dz ÷ (z − c) = i dt, which adds up to 2πi whatever the centre and the radius."
  ],
  solution: "(z − 2 + i)⁻² has the antiderivative (z − 2 + i)⁻¹ ÷ (−1), which takes the same value at the start and the end of a closed curve, so the integral is 0 and k₁ = 0. In the second integral, 3 ÷ (z − 2 + i) gives 3 × 2πi = 6πi, and −2(z − 2 + i)² gives 0 because its power is not −1. So k₂ = 6.",
  xp: 150, prereqs: ["q19"],
  sources: [source.s4_5],
  teaching: {
   intuition: "A closed curve ends where it starts. We write ∮ for a contour integral once round a closed curve; here the curve is a circle, driven once anticlockwise. If the integrand has an antiderivative F all along the curve, the integral is F(end) − F(start), and on a closed curve that is 0. For a power (z − c)ⁿ with n not equal to −1, the antiderivative (z − c)ⁿ⁺¹ ÷ (n + 1) works at every point except possibly c, and the circle never passes through c, so the integral is 0. Negative powers such as (z − c)⁻² = 1 ÷ (z − c)² are included. The one power left out is n = −1, because 1 ÷ (z − c) has no such antiderivative round the circle. Parametrise the circle of radius r round c: z = c + r(cos t + i sin t) for t from 0 to 2π. Then dz = r(−sin t + i cos t) dt = i r(cos t + i sin t) dt, so dz ÷ (z − c) = i dt, and adding i dt from 0 to 2π gives 2πi. The radius and the centre cancel out. So round such a circle every power gives 0 except (z − c)⁻¹, which gives 2πi. The section shows this for circles centred at 0; the general centre and power are worked out in this mission.",
   steps: [
    "Write each integrand as a sum of constants times powers of (z − c), with c the centre of the circle.",
    "Every power other than −1 has an antiderivative on the circle, so its integral round the closed curve is 0.",
    "The power −1 gives 2πi: A ÷ (z − c) gives A × 2πi.",
    "Add the pieces and write the total as kπi to read off k."
   ],
   example: {
    prompt: "Find k in ∮ dz ÷ z = kπi round the unit circle |z| = 1.",
    steps: [
     "Here c = 0 and the power of z is −1.",
     "With z = cos t + i sin t, dz ÷ z = i dt, which adds up to 2πi from t = 0 to 2π."
    ],
    answer: "The integral is 2πi, so k = 2."
   },
   pitfalls: [
    "Thinking negative powers always give 2πi. Only the power −1 does; (z − c)⁻² gives 0.",
    "Using powers of z when the circle is centred at c. The rule is about powers of z − c.",
    "Letting the radius change the answer. dz ÷ (z − c) = i dt whatever the radius."
   ]
  },
  guidance: [
   { prompt: "What is k₁ in ∮ (z − 2 + i)⁻² dz = k₁πi?", answer: [0], labels: ["k₁"], explanation: "(z − 2 + i)⁻² has the antiderivative (z − 2 + i)⁻¹ ÷ (−1), which takes the same value at the start and the end of a closed curve, so the integral is 0 and k₁ = 0." },
   { prompt: "What is k in ∮ 3 ÷ (z − 2 + i) dz = kπi?", answer: [6], labels: ["k"], explanation: "∮ dz ÷ (z − 2 + i) = 2πi, so 3 times it is 6πi." },
   { prompt: "What is k in ∮ −2(z − 2 + i)² dz = kπi?", answer: [0], labels: ["k"], explanation: "The power 2 is not −1, so (z − 2 + i)² has an antiderivative on the circle and the integral round the closed curve is 0. Adding the pieces, k₂ = 6 + 0." }
  ]
 }
);
})();
