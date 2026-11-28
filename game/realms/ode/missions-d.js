/* Differential equations missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/ode/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 The Laplace transform · Advanced, 200 XP · sector 'Signal Shop' · Inverse transforms with partial fractions [6.1]
     q32  ch 6 The Laplace transform · Advanced, 200 XP · sector 'Signal Shop' · Solving an initial value problem with the transform [6.2]
     q33  ch 6 The Laplace transform · Advanced, 200 XP · sector 'Signal Shop' · Switch-ons: the Heaviside function [6.2]
     q34  ch 6 The Laplace transform · Advanced, 200 XP · sector 'Signal Shop' · Impulses and convolution [6.3, 6.4]
     q35  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Power series solutions [7.2]
     q36  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Critical points and linearisation of nonlinear systems [8.1]
     q37  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Stability and classification of critical points [8.2]
     q38  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Predator and prey [8.3]
     q39  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Boundary value problems and eigenvalue problems [4.1]
     q40  ch 7 Beyond the formulas · Advanced, 200 XP · sector 'Ecology Dome' · Realm review and bridge to Waves [4.1, 8.3] */
(function(){
'use strict';
/* Jiří Lebl, Notes on Diffy Qs: Differential Equations for Engineers sections, one entry per section the missions below cite.
   Each page was opened on the date in `verified` and checked for the ideas its missions credit to it. A section is
   credited only with what it states; the rest (for example the period 2π ÷ √(ac) in q38, and the string rule ω = c√λ
   in q40) is worked out or given in the mission itself. */
const source = {
 s6_1: { title: "Lebl, Notes on Diffy Qs — 6.1 The Laplace transform", url: "https://www.jirka.org/diffyqs/html/laplace_section.html", description: "The transform of exponentials, the inverse transform found with partial fractions, and the Heaviside function.", verified: "2026-11-28" },
 s6_2: { title: "Lebl, Notes on Diffy Qs — 6.2 Transforms of derivatives and ODEs", url: "https://www.jirka.org/diffyqs/html/transformsofders_section.html", description: "The transforms of y′ and y″, solving initial value problems with the transform, the shift rule and switched-on forcing with the Heaviside function.", verified: "2026-11-28" },
 s6_3: { title: "Lebl, Notes on Diffy Qs — 6.3 Convolution", url: "https://www.jirka.org/diffyqs/html/convolution_section.html", description: "The convolution integral and the rule that its transform is the product of the transforms.", verified: "2026-11-28" },
 s6_4: { title: "Lebl, Notes on Diffy Qs — 6.4 Dirac delta and impulse response", url: "https://www.jirka.org/diffyqs/html/diracdelta_section.html", description: "The Dirac delta, its transform e^(−as), and the impulse response of an equation.", verified: "2026-11-28" },
 s7_2: { title: "Lebl, Notes on Diffy Qs — 7.2 Series solutions of linear second-order ODEs", url: "https://www.jirka.org/diffyqs/html/seriessols_section.html", description: "Power series solutions, the recurrence relation for their coefficients, and a₀ = y(0), a₁ = y′(0).", verified: "2026-11-28" },
 s8_1: { title: "Lebl, Notes on Diffy Qs — 8.1 Linearization, critical points, and equilibria", url: "https://www.jirka.org/diffyqs/html/linearization_section.html", description: "Critical points of an autonomous system, the Jacobian matrix of partial derivatives, and the linearisation at a critical point.", verified: "2026-11-28" },
 s8_2: { title: "Lebl, Notes on Diffy Qs — 8.2 Stability and classification of isolated critical points", url: "https://www.jirka.org/diffyqs/html/nlinstability_section.html", description: "Classifying critical points as saddles, nodes and spirals from the eigenvalues of the Jacobian, and why centres need care.", verified: "2026-11-28" },
 s8_3: { title: "Lebl, Notes on Diffy Qs — 8.3 Applications of nonlinear systems", url: "https://www.jirka.org/diffyqs/html/nlinapps_section.html", description: "Predator–prey (Lotka–Volterra) systems, their coexistence critical point and its linearisation.", verified: "2026-11-28" },
 s4_1: { title: "Lebl, Notes on Diffy Qs — 4.1 Boundary value problems", url: "https://www.jirka.org/diffyqs/html/bvp_section.html", description: "Boundary value problems with no, one or many solutions, and the eigenvalue problem x″ + λx = 0 with both ends 0.", verified: "2026-11-28" }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q31", title: "Unpacking the relay signal", topic: "Inverse transforms with partial fractions", tier: 'Advanced', sector: "Signal Shop",
  brief: "The signal shop has a relay’s output only as a transform, and the crew needs the signal itself to set the relay’s timers.",
  lesson: "To undo a Laplace transform, split it into partial fractions whose pieces are transforms you already know.",
  prompt: "In the signal shop, a relay’s output signal has Laplace transform F(s) = (3s + 11) ÷ ((s − 3)(s + 2)). Its inverse transform, the signal itself, has the form f(t) = A e^(3t) + B e^(−2t). Enter A, then B.",
  answer: [4,-1], labels: ["A","B"], tolerance: 0.01,
  hints: [
   "Split F(s) into partial fractions, one piece for each factor of the bottom: A ÷ (s − a) + B ÷ (s − b).",
   "To find A, cover up the factor (s − a) and put s = a into what is left; do the same with the other factor for B. Each piece A ÷ (s − a) is the transform of A e^(at)."
  ],
  solution: "Write F(s) = A ÷ (s − 3) + B ÷ (s + 2). Covering up (s − 3) and putting s = 3 into the rest gives A = 20 ÷ 5 = 4. Covering up (s + 2) and putting s = −2 into the rest gives B = 5 ÷ (−5) = −1. Since ℒ{e^(at)} = 1 ÷ (s − a), the inverse transform is f(t) = 4e^(3t) − e^(−2t).",
  xp: 200, prereqs: ["q30"],
  artifact: { name: "Transform table, back page", description: "Pieces like A ÷ (s − a), each matched with the signal A e^(at)." },
  sources: [source.s6_1],
  teaching: {
   intuition: "The Laplace transform turns a signal f(t) into a function F(s). Going back, from F(s) to the signal, is called the inverse transform. There is no new integral to do: we break F(s) into pieces we recognise from a table and read off the signal piece by piece. The most useful piece is 1 ÷ (s − a), which is the transform of e^(at). So when the bottom of F(s) is a product of two different factors (s − a)(s − b), we split F(s) into partial fractions A ÷ (s − a) + B ÷ (s − b), and the signal is A e^(at) + B e^(bt). The inverse transform is linear, just like the transform: the inverse of a sum is the sum of the inverses, and numbers in front stay in front.",
   steps: [
    "Factor the bottom of F(s) into two different linear factors (s − a)(s − b).",
    "Write F(s) = A ÷ (s − a) + B ÷ (s − b).",
    "Find A by covering up the factor (s − a), putting s = a into what is left. Find B the same way with s = b.",
    "Read the signal from the table: A ÷ (s − a) comes from A e^(at), so f(t) = A e^(at) + B e^(bt)."
   ],
   example: {
    prompt: "Find the inverse transform of F(s) = (5s − 1) ÷ ((s − 1)(s + 1)).",
    steps: [
     "Write F(s) = A ÷ (s − 1) + B ÷ (s + 1).",
     "Cover up (s − 1) and put s = 1: A = (5 − 1) ÷ (1 + 1) = 2. Cover up (s + 1) and put s = −1: B = (−5 − 1) ÷ (−1 − 1) = 3.",
     "From the table, f(t) = 2e^t + 3e^(−t)."
    ],
    answer: "f(t) = 2e^t + 3e^(−t), so A = 2 and B = 3."
   },
   pitfalls: [
    "Putting s = a into the whole of F(s): the factor (s − a) is then 0 and you divide by 0. Cover it up first.",
    "Reading 1 ÷ (s + 2) as the transform of e^(2t). It is e^(−2t), because s + 2 = s − (−2).",
    "Mixing up which coefficient belongs to which exponential: A belongs to the factor you covered up when you found it."
   ]
  },
  guidance: [
   { prompt: "Cover up the factor (s − 3) in F(s) = (3s + 11) ÷ ((s − 3)(s + 2)) and put s = 3 into what is left. What is A?", answer: [4], labels: ["A"], explanation: "What is left is (3s + 11) ÷ (s + 2). At s = 3 the top is 20 and the bottom is 5, so A = 20 ÷ 5 = 4." },
   { prompt: "Now cover up (s + 2) and put s = −2 into what is left. What is B?", answer: [-1], labels: ["B"], explanation: "What is left is (3s + 11) ÷ (s − 3). At s = −2 the top is 5 and the bottom is −5, so B = 5 ÷ (−5) = −1." }
  ]
 },
 {
  id: "q32", title: "Settling the meter needle", topic: "Solving an initial value problem with the transform", tier: 'Advanced', sector: "Signal Shop",
  brief: "A meter in the signal shop overshoots when it is flicked, and the crew wants to know exactly where the needle is a moment later.",
  lesson: "The transform turns a differential equation with starting values into algebra for Y(s); partial fractions then bring back y(t).",
  prompt: "A meter needle in the signal shop swings back to rest. Its deflection y, in millimetres, t seconds after release obeys y″ + 5y′ + 6y = 0, with y(0) = 3 and y′(0) = −7. Solve it with the Laplace transform. The transform Y(s) splits into partial fractions A ÷ (s − r₁) + B ÷ (s − r₂), where r₁ > r₂ are the two roots of its bottom. Enter A, then B, then y(1) to 3 decimal places.",
  answer: [2,1,0.32], labels: ["A","B","y at the time asked"], tolerance: 0.0005,
  hints: [
   "Use the transform of a derivative, twice for y″: ℒ{y′} = sY − y(0) and ℒ{y″} = s²Y − s·y(0) − y′(0). Collect the Y terms on one side and divide.",
   "The bottom of Y(s) is the characteristic polynomial. Factor it, split Y(s) into partial fractions by covering up one factor at a time, then turn each piece back into an exponential."
  ],
  solution: "Transforming term by term, ℒ{y″} = s²Y − 3s + 7 and ℒ{y′} = sY − 3. Collecting the Y terms gives (s² + 5s + 6)Y = 3s + 8, so Y(s) = (3s + 8) ÷ ((s + 2)(s + 3)). Covering up (s + 2) and putting s = −2 gives A = 2 ÷ 1 = 2; covering up (s + 3) and putting s = −3 gives B = (−1) ÷ (−1) = 1. So y(t) = 2e^(−2t) + e^(−3t), and y(1) = 2 × e^(−2) + 1 × e^(−3) ≈ 0.3205, which is 0.320 to 3 decimal places.",
  xp: 200, prereqs: ["q31","q13"],
  artifact: { name: "Needle trace", description: "A meter needle’s swing back to rest, found without guessing a solution." },
  sources: [source.s6_2],
  teaching: {
   intuition: "Taking the Laplace transform of a derivative gives something simple. The transform of a derivative is ℒ{y′} = sY − y(0), where Y(s) is the transform of y. Doing it twice gives ℒ{y″} = s²Y − s·y(0) − y′(0). So a differential equation like y″ + 5y′ + 6y = 0 becomes an ordinary equation for Y with the starting values already built in. We solve that equation for Y, which is plain algebra, then turn Y back into y with partial fractions and the inverse transform. The bottom of Y(s) turns out to be the characteristic polynomial, so its roots are the exponents we met with the characteristic equation; the transform also finds the constants in one go, with no separate step for the starting values.",
   steps: [
    "Transform every term: y″ becomes s²Y − s·y(0) − y′(0), y′ becomes sY − y(0), and y becomes Y.",
    "Put in the starting values and collect the Y terms: (s² + ps + q)Y = (the terms left over).",
    "Divide to get Y(s), factor its bottom, and split it into partial fractions.",
    "Read y(t) back from the table, then put in the time asked for."
   ],
   example: {
    prompt: "Solve y″ + 3y′ + 2y = 0 with y(0) = 2 and y′(0) = −1, and find y(1).",
    steps: [
     "Transform: s²Y − 2s + 1 + 3(sY − 2) + 2Y = 0, so (s² + 3s + 2)Y = 2s + 5.",
     "Y(s) = (2s + 5) ÷ ((s + 1)(s + 2)). Cover-up: at s = −1, A = 3 ÷ 1 = 3; at s = −2, B = 1 ÷ (−1) = −1.",
     "y(t) = 3e^(−t) − e^(−2t), so y(1) = 3 × 0.3679 − 0.1353 ≈ 0.968."
    ],
    answer: "y(1) ≈ 0.968."
   },
   pitfalls: [
    "Dropping the starting values when transforming y″: both −s·y(0) and −y′(0) must appear.",
    "Forgetting to multiply the −y(0) from ℒ{y′} by the coefficient in front of y′.",
    "Rounding e^(−2) and e^(−3) to two decimals before adding, which can change the third decimal of the answer."
   ]
  },
  guidance: [
   { prompt: "Transform y″ + 5y′ + 6y = 0 with y(0) = 3 and y′(0) = −7, and collect the Y terms: (s² + 5s + 6)Y = 3s + c. What is the constant c?", answer: [8], labels: ["c"], explanation: "ℒ{y″} = s²Y − 3s + 7 and 5 × ℒ{y′} = 5(sY − 3). Moving every term without Y to the right leaves 3s + 8, so c = 8." },
   { prompt: "The bottom factors as (s + 2)(s + 3). Cover up (s + 2) and put s = −2 into what is left of Y(s). What is A?", answer: [2], labels: ["A"], explanation: "At s = −2 the top is 2 and the other factor is 1, so A = 2 ÷ 1 = 2." },
   { prompt: "Cover up (s + 3) and put s = −3 into what is left. What is B?", answer: [1], labels: ["B"], explanation: "At s = −3 the top is −1 and the other factor is −1, so B = (−1) ÷ (−1) = 1." },
   { prompt: "So y(t) = 2e^(−2t) + e^(−3t). What is y(1), to 3 decimal places?", answer: [0.32], labels: ["y(1)"], explanation: "y(1) = 2 × 0.1353 + 1 × 0.0498 ≈ 0.3205, which is 0.320 to 3 decimal places." }
  ]
 },
 {
  id: "q33", title: "The late switch-on", topic: "Switch-ons: the Heaviside function", tier: 'Advanced', sector: "Signal Shop",
  brief: "A charging line in the signal shop is switched on some seconds after the shop opens, and the crew needs its voltage a little after the switch.",
  lesson: "The Heaviside function u(t − a) switches a push on at time a, and the transform handles it with a factor e^(−as).",
  prompt: "A charging line in the signal shop holds a voltage v, in volts, t seconds after the shop opens. It obeys v′ + 2v = 6u(t − 3) with v(0) = 0: the supply is switched on at t = 3. Enter the voltage the line settles to in the long run, then v(4) to 3 decimal places.",
  answer: [3,2.594], labels: ["long-run voltage (V)","v at the time asked (V)"], tolerance: 0.0005,
  hints: [
   "ℒ{u(t − a)} = e^(−as) ÷ s. Transform both sides, then split the part without e^(−as) into partial fractions.",
   "The shift rule: if g(t) has transform G(s), then e^(−as)G(s) is the transform of g(t − a)u(t − a). So find g first, then replace t by t − a and switch it on at t = a."
  ],
  solution: "Transforming with v(0) = 0 gives (s + 2)V = 6e^(−3s) ÷ s, so V(s) = e^(−3s) × 6 ÷ (s(s + 2)). In partial fractions, 6 ÷ (s(s + 2)) = 3 ÷ s − 3 ÷ (s + 2), the transform of g(t) = 3(1 − e^(−2t)). By the shift rule, v(t) = 3(1 − e^(−2(t − 3))) × u(t − 3): 0 before the switch, then rising towards 3 volts, the long-run value. At t = 4, v = 3(1 − e^(−2)) ≈ 2.5940, which is 2.594 to 3 decimal places.",
  xp: 200, prereqs: ["q32"],
  artifact: { name: "Switch-on log", description: "A voltage that waits at zero, then climbs once its supply is switched in." },
  sources: [source.s6_1, source.s6_2],
  teaching: {
   intuition: "Many machines are switched on part-way through. The Heaviside function u(t − a), also called the unit step, is 0 before time a and 1 from time a on, so F u(t − a) is a push of size F that starts at t = a. Its transform is ℒ{u(t − a)} = e^(−as) ÷ s. More generally, a delay by a in time becomes a factor e^(−as) in the transform. This is the shift rule: if g(t) has transform G(s), then e^(−as)G(s) is the transform of g(t − a)u(t − a), which is g started late, at t = a, and 0 before. So to solve an equation with a switch-on, transform it, put the part without e^(−as) into partial fractions, find its signal g, then delay g by a.",
   steps: [
    "Transform both sides; the switch-on F u(t − a) becomes F e^(−as) ÷ s.",
    "Solve for the transform, and split the part without e^(−as) into partial fractions to find its signal g(t).",
    "Apply the shift rule: the solution is g(t − a)u(t − a), zero before the switch.",
    "Put in the time asked for, measuring the time since the switch as t − a."
   ],
   example: {
    prompt: "v′ + v = 4u(t − 2) with v(0) = 0. Find v(5).",
    steps: [
     "(s + 1)V = 4e^(−2s) ÷ s, so V(s) = e^(−2s) × 4 ÷ (s(s + 1)).",
     "4 ÷ (s(s + 1)) = 4 ÷ s − 4 ÷ (s + 1), the transform of 4(1 − e^(−t)).",
     "Shift: v(t) = 4(1 − e^(−(t − 2))) for t ≥ 2, so v(5) = 4(1 − e^(−3)) ≈ 3.801."
    ],
    answer: "v(5) ≈ 3.801, rising towards 4 volts."
   },
   pitfalls: [
    "Using t instead of t − a after the switch: the exponential counts the time since the switch, not the time since the start.",
    "Forgetting that the solution is 0 before the switch, when the line starts at 0.",
    "Treating e^(−as) as part of the partial fractions. Keep it aside and use the shift rule at the end."
   ]
  },
  guidance: [
   { prompt: "Without the switch, the part 6 ÷ (s(s + 2)) splits as P ÷ s − P ÷ (s + 2). What is P?", answer: [3], labels: ["P"], explanation: "Cover up s and put s = 0 into 6 ÷ (s + 2): P = 6 ÷ 2 = 3. So the part is the transform of 3(1 − e^(−2t)), which settles at 3 volts." },
   { prompt: "By the shift rule, v(t) = 3(1 − e^(−2(t − 3))) for t ≥ 3. What is v(4), to 3 decimal places?", answer: [2.594], labels: ["v(4) (V)"], explanation: "t − 3 = 1, so v = 3(1 − e^(−2)) ≈ 2.5940, which is 2.594 to 3 decimal places." }
  ]
 },
 {
  id: "q34", title: "Kicks on the coil bench", topic: "Impulses and convolution", tier: 'Advanced', sector: "Signal Shop",
  brief: "The signal shop is testing a filter and a coil, one with a steady mix of signals and one with a sudden kick.",
  lesson: "A Dirac delta is an instant kick with transform e^(−as), and a convolution blends two signals, with transform equal to the product of theirs.",
  prompt: "Two jobs on the signal shop’s bench. First, a filter mixes the signals f(t) = 2t and g(t) = 3 by convolution: enter (f ∗ g)(4). Second, the current y in a coil obeys y′ + 3y = 5δ(t − 2) with y(0) = 0: an impulse, a sudden kick of size 5, at t = 2. Enter y(2.5) to 3 decimal places.",
  answer: [48,1.116], labels: ["(f ∗ g) at the time asked","y at the time asked"], tolerance: 0.0005,
  hints: [
   "The convolution is (f ∗ g)(t) = ∫ from 0 to t of f(τ)g(t − τ) dτ. Here g is the same number at every time, so g(t − τ) is that number.",
   "ℒ{δ(t − a)} = e^(−as). After transforming, the shift rule turns e^(−as) ÷ (s + k) into e^(−k(t − a)) switched on at t = a: the kick makes y jump by its size, and then y decays."
  ],
  solution: "(f ∗ g)(4) = ∫ from 0 to 4 of 2τ × 3 dτ = 6 × 4² ÷ 2 = 48. For the coil, transforming with y(0) = 0 gives (s + 3)Y = 5e^(−2s), so Y(s) = 5e^(−2s) ÷ (s + 3). By the shift rule y(t) = 5e^(−3(t − 2)) × u(t − 2): 0 before the kick, 5 just after it, then decaying. At t = 2.5, y = 5e^(−1.5) ≈ 1.1157, which is 1.116 to 3 decimal places.",
  xp: 200, prereqs: ["q33"],
  artifact: { name: "Impulse tester", description: "A hammer for circuits: one sharp kick, and the decay that follows." },
  sources: [source.s6_3, source.s6_4],
  teaching: {
   intuition: "Two new tools. First, convolution: (f ∗ g)(t) = ∫ from 0 to t of f(τ)g(t − τ) dτ, where τ (the Greek letter tau) runs over the times before t. It blends the two signals, and its key property is that the transform of f ∗ g is the product F(s)G(s). Second, an impulse: a push so short and strong that its whole effect arrives at one instant. We write it with the Dirac delta, δ(t − a), a kick of total size 1 at time a; c δ(t − a) is a kick of size c. Its transform is ℒ{δ(t − a)} = e^(−as). In y′ + ky = c δ(t − a), the kick makes y jump by c at t = a, and afterwards y decays as e^(−k(t − a)). The response to a kick of size 1 at t = 0 is called the impulse response, and for any other forcing the solution is the convolution of the impulse response with that forcing.",
   steps: [
    "For a convolution, write f(τ)g(t − τ) and integrate it in τ from 0 to t.",
    "For a kick, transform: c δ(t − a) becomes c e^(−as).",
    "Solve for Y(s) and use the shift rule on e^(−as): the solution is switched on at t = a.",
    "After the kick, put the time since the kick, t − a, into the decaying exponential."
   ],
   example: {
    prompt: "Find (f ∗ g)(3) for f(t) = t and g(t) = 4. Then solve y′ + 2y = 3δ(t − 1), y(0) = 0, and find y(2).",
    steps: [
     "f(τ)g(3 − τ) = 4τ, and its integral from 0 to 3 is 4 × 9 ÷ 2 = 18.",
     "(s + 2)Y = 3e^(−s), so Y = 3e^(−s) ÷ (s + 2) and y = 3e^(−2(t − 1)) after t = 1.",
     "y(2) = 3e^(−2) ≈ 0.406."
    ],
    answer: "(f ∗ g)(3) = 18 and y(2) ≈ 0.406."
   },
   pitfalls: [
    "Multiplying f(t) by g(t) instead of convolving: the transform of a plain product is not the product of the transforms.",
    "Starting the decay at t = 0 instead of at the kick.",
    "Thinking the kick adds a steady push. It acts at one instant; after it the equation has no forcing."
   ]
  },
  guidance: [
   { prompt: "In the convolution, f(τ)g(4 − τ) = 2τ × 3 = 6τ. What is the integral of 6τ from 0 to 4?", answer: [48], labels: ["(f ∗ g)(T)"], explanation: "An antiderivative of 6τ is 6τ² ÷ 2, so the integral is 6 × 16 ÷ 2 = 48." },
   { prompt: "The kick of size 5 at t = 2 makes y jump from 0. What is y just after t = 2?", answer: [5], labels: ["y just after the kick"], explanation: "Y(s) = 5e^(−2s) ÷ (s + 3) is the transform of 5e^(−3(t − 2)) switched on at t = 2, which is 5 at the moment of the kick." },
   { prompt: "After the kick, y(t) = 5e^(−3(t − 2)). What is y(2.5), to 3 decimal places?", answer: [1.116], labels: ["y(2.5)"], explanation: "t − 2 = 0.5, so y = 5e^(−1.5) ≈ 1.1157, which is 1.116 to 3 decimal places." }
  ]
 },
 {
  id: "q35", title: "The sagging planting cable", topic: "Power series solutions", tier: 'Advanced', sector: "Ecology Dome",
  brief: "A planting cable in the ecology dome sags in a way no simple formula fits, so the crew builds its shape term by term.",
  lesson: "Put a power series into the equation and match each power of x: the coefficients then follow from a recurrence relation.",
  prompt: "In the ecology dome, the sag y of a long planting cable at distance x from its middle post obeys y″ + xy′ + 3y = 0, with y(0) = 8 and y′(0) = −3. Look for a power series solution y = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + …, so a₀ = y(0) and a₁ = y′(0). Enter a₂, then a₃, then a₄.",
  answer: [-12,2,5], labels: ["a₂","a₃","a₄"], tolerance: 0.01,
  hints: [
   "Put the series into the equation. The coefficient of xⁿ in y″ is (n + 2)(n + 1)aₙ₊₂, in xy′ it is n·aₙ, and in y it is aₙ.",
   "Every power of x must cancel separately, which gives a recurrence relation: aₙ₊₂ = −(bn + c)aₙ ÷ ((n + 2)(n + 1)) when the equation is y″ + bxy′ + cy = 0. Use n = 0, then 1, then 2."
  ],
  solution: "The coefficient of xⁿ gives (n + 2)(n + 1)aₙ₊₂ + n·aₙ + 3aₙ = 0, so the recurrence relation is aₙ₊₂ = −(n + 3)aₙ ÷ ((n + 2)(n + 1)). With n = 0: a₂ = −(3) × 8 ÷ 2 = −12. With n = 1: a₃ = −(4) × (−3) ÷ 6 = 2. With n = 2: a₄ = −(5) × (−12) ÷ 12 = 5.",
  xp: 200, prereqs: ["q12"],
  artifact: { name: "Cable sag table", description: "The first coefficients of a sag curve, each found from two before it." },
  sources: [source.s7_2],
  teaching: {
   intuition: "Some equations, like y″ + xy′ + 2y = 0, have a coefficient that changes with x, and no exponential solves them. Instead we look for a power series solution, y = a₀ + a₁x + a₂x² + a₃x³ + …, the kind of series you met with Taylor series. Putting x = 0 shows a₀ = y(0), and differentiating once shows a₁ = y′(0), so the starting values give the first two coefficients. Then we put the series into the equation. Each power of x must cancel on its own, which links each coefficient to one two places earlier. A rule like this, giving each term from earlier ones, is a recurrence relation. With it, the starting values build the whole series one coefficient at a time.",
   steps: [
    "Write y = Σ aₙxⁿ. Then y″ has coefficient (n + 2)(n + 1)aₙ₊₂ in front of xⁿ, xy′ has n·aₙ, and y has aₙ.",
    "Add the coefficients of xⁿ from every term of the equation and set the total to 0.",
    "Solve for aₙ₊₂ to get the recurrence relation.",
    "Start from a₀ = y(0) and a₁ = y′(0), and use n = 0, 1, 2, … in turn."
   ],
   example: {
    prompt: "y″ − xy′ + 3y = 0 with y(0) = 8 and y′(0) = 3. Find a₂, a₃ and a₄.",
    steps: [
     "The coefficient of xⁿ: (n + 2)(n + 1)aₙ₊₂ − n·aₙ + 3aₙ = 0, so aₙ₊₂ = (n − 3)aₙ ÷ ((n + 2)(n + 1)).",
     "n = 0: a₂ = −3 × 8 ÷ 2 = −12. n = 1: a₃ = −2 × 3 ÷ 6 = −1.",
     "n = 2: a₄ = −1 × (−12) ÷ 12 = 1."
    ],
    answer: "a₂ = −12, a₃ = −1, a₄ = 1."
   },
   pitfalls: [
    "Matching the wrong powers: in y″ the term with xⁿ comes from aₙ₊₂, two places on, not from aₙ.",
    "Forgetting that xy′ keeps the power: x times n·aₙxⁿ⁻¹ is n·aₙxⁿ.",
    "Using a₁ to find a₂. Even coefficients come from a₀ and odd ones from a₁."
   ]
  },
  guidance: [
   { prompt: "The recurrence relation for y″ + xy′ + 3y = 0 is aₙ₊₂ = −(n + 3)aₙ ÷ ((n + 2)(n + 1)). Put n = 0 and a₀ = 8. What is a₂?", answer: [-12], labels: ["a₂"], explanation: "a₂ = −(3) × 8 ÷ (2 × 1) = −12." },
   { prompt: "Put n = 1 and a₁ = −3. What is a₃?", answer: [2], labels: ["a₃"], explanation: "a₃ = −(1 + 3) × (−3) ÷ (3 × 2) = −(4) × (−3) ÷ 6 = 2." },
   { prompt: "Put n = 2 and a₂ = −12. What is a₄?", answer: [5], labels: ["a₄"], explanation: "a₄ = −(2 + 3) × (−12) ÷ (4 × 3) = −(5) × (−12) ÷ 12 = 5." }
  ]
 },
 {
  id: "q36", title: "Balancing the air plant", topic: "Critical points and linearisation of nonlinear systems", tier: 'Advanced', sector: "Ecology Dome",
  brief: "The dome’s air plant has two readings that push each other around, and the crew wants to know where they could rest and how they behave nearby.",
  lesson: "A critical point makes every right-hand side 0; near it, the Jacobian matrix of partial derivatives gives a linear system that behaves almost the same.",
  prompt: "The dome’s air plant tracks two readings, x and y, that obey x′ = xy − 6 and y′ = y − 2x + 4. Find the critical point with the larger x, and the Jacobian matrix of the system there. Enter x, then y, then the four entries of the Jacobian matrix row by row.",
  answer: [3,2,2,3,-2,1], labels: ["x","y","J11","J12","J21","J22"], tolerance: 0.01,
  hints: [
   "At a critical point both right-hand sides are 0. Solve the simpler equation for y and put it into the other one.",
   "The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y), where f and g are the two right-hand sides. For a partial derivative, treat the other letter as a fixed number."
  ],
  solution: "y′ = 0 gives y = 2x − 4. Putting this into xy − 6 = 0 gives 2x² − 4x − 6 = 0, whose roots are x = −1 and x = 3. The larger is x = 3, with y = 2. For f = xy − 6: ∂f/∂x = y and ∂f/∂y = x. For g = y − 2x + 4: ∂g/∂x = −2 and ∂g/∂y = 1. At (3, 2) the Jacobian matrix is [[2, 3], [−2, 1]], and the linearisation there is u′ = 2u + 3v, v′ = −2u + v.",
  xp: 200, prereqs: ["q28"],
  artifact: { name: "Air plant balance sheet", description: "The two readings at rest, and the matrix that says how they respond to a nudge." },
  sources: [source.s8_1],
  teaching: {
   intuition: "A nonlinear system x′ = f(x, y), y′ = g(x, y) has terms like xy, so the eigenvalue method does not apply directly. First find where nothing changes: a critical point of the system is a point where f and g are both 0, an equilibrium of the pair. Close to a critical point the system looks almost linear, just as a curve looks almost straight close up. To find that linear system we need the rate of change of f in each direction. The partial derivative ∂f/∂x is the derivative of f in x while y is held fixed as a number, and ∂f/∂y is the derivative in y with x fixed. The Jacobian matrix puts these four rates in a square: first row ∂f/∂x, ∂f/∂y, second row ∂g/∂x, ∂g/∂y. Its values at the critical point give the linearisation u′ = Ju, where u measures the distance from the point.",
   steps: [
    "Set both right-hand sides to 0 and solve: usually one equation gives y in terms of x, and the other then gives x.",
    "Pick the critical point asked for and work out y there.",
    "Differentiate each right-hand side in x with y fixed, and in y with x fixed.",
    "Put the critical point into the four partial derivatives: those are the Jacobian matrix’s entries, row by row."
   ],
   example: {
    prompt: "x′ = xy − 2, y′ = y − x + 1. Find the critical point with the larger x and the Jacobian matrix there.",
    steps: [
     "y′ = 0 gives y = x − 1; then x(x − 1) = 2, so x = 2 or x = −1. The larger is x = 2, with y = 1.",
     "For f = xy − 2: ∂f/∂x = y, ∂f/∂y = x. For g = y − x + 1: ∂g/∂x = −1, ∂g/∂y = 1.",
     "At (2, 1) the Jacobian matrix is [[1, 2], [−1, 1]]."
    ],
    answer: "The point (2, 1), with Jacobian matrix [[1, 2], [−1, 1]]."
   },
   pitfalls: [
    "Differentiating xy in x as if y also changed: with y held fixed, the derivative of xy in x is just y.",
    "Putting the partial derivatives in the wrong places: each row belongs to one equation, each column to one letter.",
    "Forgetting to put the critical point into the entries: the Jacobian matrix of a nonlinear system changes from point to point."
   ]
  },
  guidance: [
   { prompt: "y′ = 0 gives y = 2x − 4. Put it into xy − 6 = 0 to get 2x² − 4x − 6 = 0. What is its larger root?", answer: [3], labels: ["x"], explanation: "2x² − 4x − 6 = 2(x + 1)(x − 3), so the roots are −1 and 3; the larger is 3." },
   { prompt: "What is y at that critical point?", answer: [2], labels: ["y"], explanation: "y = 2x − 4 at x = 3 is 2 × 3 − 4 = 2." },
   { prompt: "For f = xy − 6, treat y as a fixed number and differentiate in x. What is ∂f/∂x at the critical point?", answer: [2], labels: ["∂f/∂x"], explanation: "∂f/∂x = y, which is 2 at (3, 2)." },
   { prompt: "Now treat x as fixed and differentiate f in y. What is ∂f/∂y at the critical point?", answer: [3], labels: ["∂f/∂y"], explanation: "∂f/∂y = x, which is 3 there." },
   { prompt: "For g = y − 2x + 4, what is ∂g/∂x?", answer: [-2], labels: ["∂g/∂x"], explanation: "Only the term −2x depends on x, so ∂g/∂x = −2; and ∂g/∂y = 1, from the term y." }
  ]
 },
 {
  id: "q37", title: "Steadying the seed-pod sorter", topic: "Stability and classification of critical points", tier: 'Advanced', sector: "Ecology Dome",
  brief: "A seed-pod sorter in the dome rocks on a curved track, and the crew needs to know whether each resting place is one it settles into or falls away from.",
  lesson: "The eigenvalues of the Jacobian at a critical point classify it just as they classify a linear system, with care needed for centres.",
  prompt: "A seed-pod sorter in the ecology dome swings on a curved track. Its offset x and speed y obey x′ = y and y′ = −x² + 3x + 4 − 2y. Classify the critical point (4, 0). Enter the real parts of the two eigenvalues of the Jacobian matrix there, larger first (the same number twice for a complex pair), then the size of their imaginary part (0 if they are real), then the code: 1 node, 2 saddle, 3 spiral, 4 centre.",
  answer: [-1,-1,2,3], labels: ["larger real part","smaller real part","imaginary part","code (1–4)"], tolerance: 0.01,
  hints: [
   "The Jacobian matrix of x′ = y, y′ = g(x, y) is [[0, 1], [∂g/∂x, ∂g/∂y]]. Work out ∂g/∂x at the point.",
   "The eigenvalues solve λ² − (trace)λ + (determinant) = 0. Real with opposite signs is a saddle, real with the same sign a node, complex with a non-zero real part a spiral, purely imaginary a centre."
  ],
  solution: "∂g/∂x = −2x + 3, which is −5 at x = 4, and ∂g/∂y = −2. So the Jacobian matrix is [[0, 1], [−5, −2]], with trace −2 and determinant 5. The eigenvalues solve λ² + 2λ + 5 = 0, so λ = −1 ± 2i. They are complex with a non-zero real part, so the point is a spiral: code 3.",
  xp: 200, prereqs: ["q36"],
  artifact: { name: "Sorter track chart", description: "Each resting place on the track marked as a saddle, node, spiral or centre." },
  sources: [source.s8_2],
  teaching: {
   intuition: "Close to a critical point, a nonlinear system moves almost like its linearisation. So we classify the point by the eigenvalues of the Jacobian there, exactly as for x′ = Ax: real eigenvalues with opposite signs give a saddle; real eigenvalues with the same sign give a node; a complex pair with a non-zero real part gives a spiral; a purely imaginary pair gives a centre. Negative real parts mean nearby paths come in (stable), positive ones that they move away. For a 2 × 2 matrix the eigenvalues solve λ² − (trace)λ + (determinant) = 0, where the trace is the sum of the diagonal entries. One warning: a centre of the linearisation is delicate. The small nonlinear terms can turn it into a slow spiral either way, so it needs a second look. A system of this mission’s form, x′ = y and y′ = g(x) with no y term, keeps an energy fixed, like a frictionless swing, and its centres are real.",
   steps: [
    "Write the Jacobian matrix and put the critical point into it.",
    "Find its trace and determinant, and solve λ² − (trace)λ + (determinant) = 0.",
    "Read the type from the eigenvalues: saddle, node, spiral or centre.",
    "For a centre, check whether the system has any damping before trusting it."
   ],
   example: {
    prompt: "x′ = y, y′ = −x² + x + 2 − 2y. Classify the critical point (−1, 0).",
    steps: [
     "∂g/∂x = −2x + 1, which is 3 at x = −1, and ∂g/∂y = −2, so the Jacobian matrix is [[0, 1], [3, −2]].",
     "Trace −2, determinant −3: λ² + 2λ − 3 = 0, so λ = 1 and λ = −3.",
     "Real with opposite signs: a saddle."
    ],
    answer: "Eigenvalues 1 and −3: a saddle, code 2."
   },
   pitfalls: [
    "Using the Jacobian at the wrong point: each critical point has its own matrix and its own type.",
    "Calling a pair of negative real eigenvalues a spiral. A spiral needs an imaginary part.",
    "Trusting a linearised centre in a system with damping or other small terms: there it can be a slow spiral."
   ]
  },
  guidance: [
   { prompt: "g = −x² + 3x + 4 − 2y. What is ∂g/∂x at x = 4?", answer: [-5], labels: ["∂g/∂x"], explanation: "∂g/∂x = −2x + 3 = −2 × 4 + 3 = −5." },
   { prompt: "The Jacobian matrix is [[0, 1], [−5, −2]]. What is its determinant?", answer: [5], labels: ["determinant"], explanation: "0 × (−2) − 1 × (−5) = 5. The trace is −2, so the eigenvalues solve λ² + 2λ + 5 = 0." },
   { prompt: "Solve λ² + 2λ + 5 = 0. What is the real part of the larger eigenvalue (or of either one, for a complex pair)?", answer: [-1], labels: ["real part"], explanation: "λ = −1 ± 2i. They are complex with a non-zero real part, so the point is a spiral." }
  ]
 },
 {
  id: "q38", title: "Insects and birds in balance", topic: "Predator and prey", tier: 'Advanced', sector: "Ecology Dome",
  brief: "The sealed dome holds insects and the birds that eat them, and the crew wants to know the level they swing around and how long each swing takes.",
  lesson: "A predator–prey system has a coexistence point where both populations hold steady, and small swings around it have period 2π ÷ √(ac).",
  prompt: "In the sealed dome, insects x (in hundreds) and the birds that eat them y (in tens) follow the predator–prey system x′ = x − 0.2xy and y′ = −0.5y + 0.05xy, with time in months. Enter the coexistence point, x then y, where both populations stay constant, then the period in months of small swings around it, to 2 decimal places.",
  answer: [10,5,8.89], labels: ["x (hundreds)","y (tens)","period (months)"], tolerance: 0.005,
  hints: [
   "Factor each right-hand side: x(a − by) and y(−c + dx). The coexistence point has x and y both non-zero, so each bracket is 0.",
   "At the coexistence point the Jacobian matrix has zeros on its diagonal, so its eigenvalues are ±iω with ω² equal to minus its determinant. Small swings then repeat every 2π ÷ ω."
  ],
  solution: "x′ = x(1 − 0.2y) is 0 for y = 1 ÷ 0.2 = 5, and y′ = y(−0.5 + 0.05x) is 0 for x = 0.5 ÷ 0.05 = 10. So the coexistence point is (10, 5): 1000 insects and 50 birds. There the Jacobian matrix is [[0, −2], [0.25, 0]], with determinant 2 × 0.25 = 0.5. The eigenvalues are ±i√0.5, so the linearisation is a centre with ω = √0.5 ≈ 0.7071 per month, and the period is 2π ÷ ω ≈ 8.8858, which is 8.89 months to 2 decimal places.",
  xp: 200, prereqs: ["q37"],
  artifact: { name: "Dome census chart", description: "Insect and bird counts chasing each other round a steady point." },
  sources: [source.s8_3],
  teaching: {
   intuition: "In a predator–prey system, also called a Lotka–Volterra system, prey x grow on their own and are eaten when they meet predators, while predators y die out on their own and grow when they eat: x′ = ax − bxy and y′ = −cy + dxy, with a, b, c, d positive. Factored, x′ = x(a − by) and y′ = y(−c + dx). Besides (0, 0) there is one critical point with both populations present, the coexistence point (c ÷ d, a ÷ b). There the Jacobian matrix has zeros on its diagonal, and the eigenvalues come out as ±i√(ac): the linearisation is a centre, so the two populations chase each other round the point. A centre needs care, but for this system the paths really are closed loops. With eigenvalues ±iω the swings repeat every 2π ÷ ω, so near the point the period is 2π ÷ √(ac).",
   steps: [
    "Factor each right-hand side to find the coexistence point: y = a ÷ b makes x′ = 0, and x = c ÷ d makes y′ = 0.",
    "Find the Jacobian matrix at the coexistence point: its diagonal entries are 0.",
    "Its determinant is ac, so the eigenvalues are ±iω with ω = √(ac).",
    "The period of small swings is 2π ÷ ω."
   ],
   example: {
    prompt: "x′ = 0.6x − 0.1xy, y′ = −0.4y + 0.08xy. Find the coexistence point and the period of small swings.",
    steps: [
     "y = 0.6 ÷ 0.1 = 6 and x = 0.4 ÷ 0.08 = 5.",
     "ω² = 0.6 × 0.4 = 0.24, so ω ≈ 0.4899.",
     "Period 2π ÷ 0.4899 ≈ 12.83."
    ],
    answer: "The point (5, 6), and a period of about 12.83 time units."
   },
   pitfalls: [
    "Swapping the two levels: the prey level comes from the predator equation (x = c ÷ d), and the predator level from the prey equation (y = a ÷ b).",
    "Taking the period as 2π × ω instead of 2π ÷ ω.",
    "Using b and d in the period: near the point, only a and c set the swing."
   ]
  },
  guidance: [
   { prompt: "y′ = y(−0.5 + 0.05x) is 0 with y non-zero when the bracket is 0. What is x at the coexistence point?", answer: [10], labels: ["x (hundreds)"], explanation: "0.05x = 0.5, so x = 0.5 ÷ 0.05 = 10." },
   { prompt: "x′ = x(1 − 0.2y) is 0 with x non-zero when the bracket is 0. What is y there?", answer: [5], labels: ["y (tens)"], explanation: "0.2y = 1, so y = 1 ÷ 0.2 = 5." },
   { prompt: "At (10, 5) the Jacobian matrix is [[0, −2], [0.25, 0]]. What is its determinant, ω²?", answer: [0.5], labels: ["ω²"], explanation: "0 × 0 − (−2) × 0.25 = 0.5, which is a × c. The eigenvalues are ±i√0.5." },
   { prompt: "ω = √0.5. What is the period 2π ÷ ω, in months to 2 decimal places?", answer: [8.89], labels: ["period (months)"], explanation: "ω ≈ 0.7071, and 2π ÷ ω ≈ 8.8858, which is 8.89 to 2 decimal places." }
  ]
 },
 {
  id: "q39", title: "Pinning the seed cable", topic: "Boundary value problems and eigenvalue problems", tier: 'Advanced', sector: "Ecology Dome",
  brief: "A seed cable in the dome is pinned at both ends, and only some settings let it bow at all, so the crew needs to know which.",
  lesson: "With conditions at two ends, y″ + λy = 0 has a non-zero solution only for special λ, the eigenvalues, and other problems may have one solution, none or many.",
  prompt: "A seed cable in the dome is pinned at both ends, x = 0 and x = 2 metres. Its shape y obeys y″ + λy = 0 with y(0) = 0 and y(2) = 0, an eigenvalue problem. Enter the 3rd smallest positive λ that allows a solution other than y = 0, as a multiple of π² (for 5π² enter 5). Then take the boundary value problem y″ + 4π²y = 0 with y(0) = 0 and y(2) = 3: enter 1 if it has exactly one solution, 0 if it has none or many.",
  answer: [2.25,0], labels: ["λ ÷ π²","one solution (1/0)"], tolerance: 0.005,
  hints: [
   "For λ > 0 the solutions are y = A cos(√λ x) + C sin(√λ x). The condition at 0 removes the cosine, and the condition at the other end needs sin(√λ L) = 0, so √λ L must be a whole multiple of π. Zero or negative λ give only y = 0.",
   "If √λ L is a whole multiple of π, the sine is 0 at the far end and cannot reach a non-zero end value. Otherwise C is fixed by the end value, so there is exactly one solution."
  ],
  solution: "y(0) = 0 leaves y = C sin(√λ x). A solution other than 0 needs sin(√λ × 2) = 0, so √λ × 2 = kπ and λ = (kπ ÷ 2)². The 3rd is k = 3: λ = 9 ÷ 4 × π² = 2.25π², so enter 2.25. For λ = 4π², √λ × 2 = 4π, a whole multiple of π, so sin(√λ × 2) = 0 and C sin(√λ x) is 0 at x = 2 whatever C is: it cannot reach 3, so there is no solution. Code 0.",
  xp: 200, prereqs: ["q15"],
  artifact: { name: "Cable mode card", description: "The bowing shapes a pinned cable allows, one arch, two arches, three." },
  sources: [source.s4_1],
  teaching: {
   intuition: "So far every second-order problem gave y and y′ at the same start. A boundary value problem gives one condition at each end of an interval instead, like a cable pinned at x = 0 and at x = L. That changes everything: such a problem can have exactly one solution, none, or infinitely many. Take y″ + λy = 0 with y(0) = 0 and y(L) = 0. y = 0 always works. For λ > 0 the solutions are A cos(√λ x) + C sin(√λ x); y(0) = 0 removes the cosine, and y(L) = 0 needs sin(√λ L) = 0, so √λ L must be a whole multiple of π, kπ. So only λ = (kπ ÷ L)², for k = 1, 2, 3, …, give a solution other than 0; zero and negative λ give only y = 0. Finding these special λ is an eigenvalue problem: they are its eigenvalues, and the shapes sin(kπx ÷ L) are its eigenfunctions.",
   steps: [
    "Write the solutions for λ > 0: y = A cos(√λ x) + C sin(√λ x).",
    "Use y(0) = 0 to remove the cosine.",
    "At the other end, y(L) = 0 with C non-zero needs √λ L = kπ, so λ = k²π² ÷ L².",
    "For an end value that is not 0, there is exactly one solution unless √λ L is a whole multiple of π, when there is none."
   ],
   example: {
    prompt: "y″ + λy = 0, y(0) = 0, y(1) = 0: find the 2nd allowed λ. Is y″ + 2π²y = 0, y(0) = 0, y(1) = 5 solvable in exactly one way?",
    steps: [
     "λ = (kπ ÷ 1)²; for k = 2 that is 4π².",
     "For λ = 2π², √λ = √2 π, not a whole multiple of π, so sin(√λ) is not 0.",
     "C = 5 ÷ sin(√2 π) is the only choice."
    ],
    answer: "λ = 4π², and yes, exactly one solution."
   },
   pitfalls: [
    "Counting k = 0: it gives sin 0 = 0 everywhere, the zero solution, which does not count.",
    "Forgetting to square: √λ = kπ ÷ L, so λ = k²π² ÷ L².",
    "Assuming every boundary value problem has a solution, as starting-value problems do."
   ]
  },
  guidance: [
   { prompt: "The allowed values have √λ × 2 = kπ. For k = 3, what is √λ ÷ π?", answer: [1.5], labels: ["√λ ÷ π"], explanation: "√λ = 3π ÷ 2, so √λ ÷ π = 1.5." },
   { prompt: "Square it: what is λ ÷ π² for the 3rd allowed value?", answer: [2.25], labels: ["λ ÷ π²"], explanation: "1.5² = 2.25, so λ = 2.25π²." },
   { prompt: "For λ = 4π², is √λ × 2 a whole multiple of π? Enter 1 if the problem with y(2) = 3 has exactly one solution, 0 if not.", answer: [0], labels: ["one solution (1/0)"], explanation: "√λ × 2 = 4π, a whole multiple, so the sine vanishes at the far end and no solution reaches 3: 0." }
  ]
 },
 {
  id: "q40", title: "The dome’s last readings", topic: "Realm review and bridge to Waves", tier: 'Advanced', sector: "Ecology Dome",
  brief: "Before the outpost turns to its strings and air, the crew wants one last pair of readings from the dome: a harp string’s note and the bird count it hums over.",
  lesson: "The eigenvalues of a pinned string give its allowed frequencies, and the coexistence point gives the levels a predator–prey dome swings around.",
  prompt: "Two last readings before the outpost moves on to Waves. A wind-harp string in the dome is 1.25 metres long and fixed at both ends; its shape X obeys X″ + λX = 0 with X(0) = 0 and X(1.25) = 0. In the Waves realm you will see why such a string swings with angular frequency ω = 90√λ rad/s, where 90 m/s is its wave speed. Enter its lowest allowed angular frequency, the fundamental frequency, in rad/s to 2 decimal places. Then the dome’s insects x (hundreds) and birds y (tens) follow x′ = 0.8x − 0.2xy and y′ = −0.6y + 0.05xy: enter y at the coexistence point.",
  answer: [226.19,4], labels: ["ω (rad/s)","y (tens)"], tolerance: 0.005,
  hints: [
   "The allowed λ of the string are (kπ ÷ L)² for k = 1, 2, 3, …; the lowest frequency comes from k = 1.",
   "At the coexistence point both populations are non-zero, so the bracket of x′ = x(a − by) must be 0."
  ],
  solution: "The lowest allowed λ is (π ÷ 1.25)², so √λ = π ÷ 1.25 = 0.8π and ω = 90 × 0.8π = 72π ≈ 226.1947, which is 226.19 rad/s to 2 decimal places. In the dome, x′ = x(0.8 − 0.2y) is 0 with x non-zero when y = 0.8 ÷ 0.2 = 4, that is 40 birds; the insects sit at x = 0.6 ÷ 0.05 = 12.",
  xp: 200, prereqs: ["q38","q39"],
  artifact: { name: "Wind-harp string", description: "A string pinned at both ends that only sings at certain notes." },
  sources: [source.s4_1, source.s8_3],
  teaching: {
   intuition: "This mission joins two threads of the realm. A string fixed at both ends has a shape X with X″ + λX = 0 and X = 0 at both ends: the eigenvalue problem of the last mission, with allowed λ = (kπ ÷ L)². In the Waves realm you will meet the equation for a moving string and see that each allowed shape swings with angular frequency ω = c√λ, where c is the speed of waves along the string; take that rule as given here. The lowest allowed λ gives the lowest frequency, the fundamental frequency, ω = cπ ÷ L: a longer string sings lower. The second thread is the predator–prey dome: its coexistence point, where both populations hold steady, is found by setting each bracket of the factored equations to 0.",
   steps: [
    "For the string, the lowest allowed λ is (π ÷ L)², so √λ = π ÷ L.",
    "Multiply by the wave speed: the fundamental frequency is ω = c × π ÷ L, in rad/s.",
    "For the dome, factor x′ = x(a − by) and y′ = y(−c + dx).",
    "The coexistence point has y = a ÷ b and x = c ÷ d."
   ],
   example: {
    prompt: "A string 0.5 metres long with wave speed 100 m/s: find its fundamental frequency. Then find y at the coexistence point of x′ = 1.2x − 0.3xy, y′ = −0.5y + 0.1xy.",
    steps: [
     "√λ = π ÷ 0.5 = 2π, so ω = 100 × 2π = 200π ≈ 628.32 rad/s.",
     "x′ = x(1.2 − 0.3y) is 0 when y = 1.2 ÷ 0.3 = 4."
    ],
    answer: "ω ≈ 628.32 rad/s, and y = 4."
   },
   pitfalls: [
    "Forgetting the square root: ω = c√λ, so use π ÷ L, not (π ÷ L)².",
    "Giving the frequency in cycles per second instead of rad/s: ω is an angular frequency.",
    "Taking the bird level from the bird equation: y = a ÷ b comes from the insect equation."
   ]
  },
  guidance: [
   { prompt: "The lowest allowed λ is (π ÷ 1.25)². What is √λ ÷ π?", answer: [0.8], labels: ["√λ ÷ π"], explanation: "√λ = π ÷ 1.25 = 0.8π." },
   { prompt: "ω = 90√λ = 90 × 0.8π. What is ω in rad/s, to 2 decimal places?", answer: [226.19], labels: ["ω (rad/s)"], explanation: "72π ≈ 226.1947, which is 226.19 to 2 decimal places." },
   { prompt: "x′ = x(0.8 − 0.2y). With x non-zero, what y makes it 0?", answer: [4], labels: ["y (tens)"], explanation: "0.2y = 0.8, so y = 4." }
  ]
 }
);
})();
