# Differential equations pack (`ode`) — concept plan

Pack id `ode`, name "Differential equations", 40 learn missions (`q01`–`q40`) + 120 practice (`qNNb/c/d`) = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "ode", and §11 as written for calc1).

**Player:** an adult who has finished Foundations, Calculus 1, Calculus 2 and Linear algebra: derivatives and integrals with their techniques (substitution, by parts, partial fractions), improper integrals, exponential growth and decay, power and Taylor series; vectors, matrices, determinants, eigenvalues and eigenvectors, and complex vectors. Calculus 3 is not assumed: the one partial derivative the pack needs (q36) is taught where it is used. Complex numbers are reviewed briefly in q15 before Euler's formula. Radians and SI units throughout. New words and symbols, each taught in the mission that first uses it: differential equation, solution, y′ and y″ as unknowns, order, linear and nonlinear, ordinary differential equation (ODE), general solution, particular solution, initial value problem, initial condition, slope field, equilibrium solution, Euler's method, step size h, separable equation, integrating factor, mixing problem, autonomous equation, stable and unstable equilibrium, logistic equation, carrying capacity, homogeneous, superposition, characteristic equation, repeated root, Euler's formula e^(iθ), damping, angular frequency ω, period, overdamped, critically damped, underdamped, nonhomogeneous, undetermined coefficients, steady periodic solution, amplitude, resonance, practical resonance, Wronskian, linearly independent solutions, first-order system, x′ = Ax, eigenvalue method, phase portrait, node, saddle, spiral, centre, trajectory, Laplace transform ℒ{f}(s), inverse transform, transfer of derivatives, Heaviside function u(t − a), convolution f ∗ g, Dirac delta δ(t − a), impulse, power series solution, recurrence relation, critical point of a system, linearisation, Jacobian matrix, predator–prey (Lotka–Volterra) system, boundary value problem, eigenvalue problem.

**Setting:** the Kepler outpost's machines now run themselves, and their behaviour over time has to be predicted: greenhouse populations, coolant loops and mixing tanks, rover suspensions, engine mounts that shake, linked control systems, switch-on surges in the signal shop, and a sealed ecology dome. Mira is still the mentor. Objects are seed trays, brine tanks, springs and dampers, flywheels, relay circuits and the dome's insect and bird populations.

**Sources:** Jiří Lebl, *Notes on Diffy Qs: Differential Equations for Engineers* (open, CC BY-SA), one web page per section. OpenStax has no book covering systems or the Laplace transform, so Lebl is the single source. URL pattern `https://www.jirka.org/diffyqs/html/<file>.html`; a source title reads `Lebl, Notes on Diffy Qs — 1.3 Separable equations` and contains the publisher word **Lebl**. All 27 pages below were opened on 2026-11-27 and checked for title and the concept named; none is UNVERIFIED.

| Concepts | Section title | URL |
|---|---|---|
| q01 | 0.2 Introduction to differential equations | https://www.jirka.org/diffyqs/html/introde_section.html |
| q02 | 0.3 Classification of differential equations | https://www.jirka.org/diffyqs/html/classification_section.html |
| q03 | 1.1 Integrals as solutions | https://www.jirka.org/diffyqs/html/integralsols_section.html |
| q04 | 1.2 Slope fields | https://www.jirka.org/diffyqs/html/slopefields_section.html |
| q06, q11 | 1.3 Separable equations | https://www.jirka.org/diffyqs/html/separable_section.html |
| q07, q08, q11 | 1.4 Linear equations and the integrating factor | https://www.jirka.org/diffyqs/html/intfactor_section.html |
| q09, q10, q11 | 1.6 Autonomous equations | https://www.jirka.org/diffyqs/html/auteq_section.html |
| q05 | 1.7 Numerical methods: Euler’s method | https://www.jirka.org/diffyqs/html/numer_section.html |
| q12 | 2.1 Second-order linear ODEs | https://www.jirka.org/diffyqs/html/solinear_section.html |
| q13, q14, q15, q17 | 2.2 Constant-coefficient second-order linear ODEs | https://www.jirka.org/diffyqs/html/sec_ccsol.html |
| q22, q23 | 2.3 Higher-order linear ODEs | https://www.jirka.org/diffyqs/html/sec_hol.html |
| q16, q17 | 2.4 Mechanical vibrations | https://www.jirka.org/diffyqs/html/sec_mv.html |
| q18, q19, q23 | 2.5 Nonhomogeneous equations | https://www.jirka.org/diffyqs/html/sec_nonhom.html |
| q20, q21, q23 | 2.6 Forced oscillations and resonance | https://www.jirka.org/diffyqs/html/forcedo_section.html |
| q24 | 3.1 Introduction to systems of ODEs | https://www.jirka.org/diffyqs/html/sec_introtosys.html |
| q25 | 3.3 Linear systems of ODEs | https://www.jirka.org/diffyqs/html/linsystems_section.html |
| q26, q27, q29 | 3.4 Eigenvalue method | https://www.jirka.org/diffyqs/html/eigenmethod_section.html |
| q28, q29 | 3.5 Two-dimensional systems and their vector fields | https://www.jirka.org/diffyqs/html/sec_twodimaut.html |
| q39, q40 | 4.1 Boundary value problems | https://www.jirka.org/diffyqs/html/bvp_section.html |
| q30, q31 | 6.1 The Laplace transform | https://www.jirka.org/diffyqs/html/laplace_section.html |
| q32, q33 | 6.2 Transforms of derivatives and ODEs | https://www.jirka.org/diffyqs/html/transformsofders_section.html |
| q34 | 6.3 Convolution | https://www.jirka.org/diffyqs/html/convolution_section.html |
| q34 | 6.4 Dirac delta and impulse response | https://www.jirka.org/diffyqs/html/diracdelta_section.html |
| q35 | 7.2 Series solutions of linear second-order ODEs | https://www.jirka.org/diffyqs/html/seriessols_section.html |
| q36 | 8.1 Linearization, critical points, and equilibria | https://www.jirka.org/diffyqs/html/linearization_section.html |
| q37 | 8.2 Stability and classification of isolated critical points | https://www.jirka.org/diffyqs/html/nlinstability_section.html |
| q38, q40 | 8.3 Applications of nonlinear systems | https://www.jirka.org/diffyqs/html/nlinapps_section.html |

Missions are original, never copied from the book's examples or exercises.

## Chapters

| Ch | Name | Ids | Tier, XP | Sector | "we have to …" | Landmark | Blurb |
|---|---|---|---|---|---|---|---|
| 1 | Equations of change | q01–q06 | Basic, 100 | Greenhouse | predict how the plants and the air will change | Grow Tower | What a differential equation is, how to read one, and the first ways to solve one. |
| 2 | First-order models | q07–q11 | Basic, 100 | Coolant Loop | keep tanks, coolant and populations in balance | Mixing Tanks | Linear equations, mixing tanks, equilibria and logistic growth. |
| 3 | Vibrations | q12–q17 | Intermediate, 150 | Rover Garage | tune the rover suspension | Shock Rig | Second-order equations with constant coefficients, and springs with damping. |
| 4 | Forcing and resonance | q18–q23 | Intermediate, 150 | Engine Room | drive machines without shaking them apart | Flywheel Housing | Equations with a push from outside, steady swings, and resonance. |
| 5 | Systems | q24–q29 | Intermediate, 150 | Control Room | run several linked machines at once | Control Tower | Systems x′ = Ax solved with eigenvalues, and pictures of their trajectories. |
| 6 | The Laplace transform | q30–q34 | Advanced, 200 | Signal Shop | handle switch-ons and sudden kicks | Transform Relay | Turning differential equations into algebra, for switches and impulses. |
| 7 | Beyond the formulas | q35–q40 | Advanced, 200 | Ecology Dome | predict the swings of a closed ecosystem | Biosphere Dome | Series solutions, nonlinear systems near equilibrium, and boundary value problems. |

## Concepts (one learn mission each; Lebl section in brackets; prerequisites after the arrow)

1. q01 Checking a solution [0.2] ← [] — Asked: the k that makes y = Ce^(kt) a solution, then C from a starting value. Varies: equation coefficients, start value.
2. q02 Order and linearity [0.3] ← q01 — Asked: the order, then 1 if linear, 0 if not. Varies: equations built from a bank of terms.
3. q03 Integrals as solutions: y′ = f(x) with a starting value [1.1] ← q01 — Asked: y at a later x. Varies: f, start point.
4. q04 Slope fields and equilibrium solutions [1.2] ← q03 — Asked: the slope at a point, then the equilibrium value. Varies: f(x, y) linear in y.
5. q05 Euler's method [1.7] ← q04 — Asked: the estimate after n steps to 3 decimal places. Varies: equation, h, n (2–4).
6. q06 Separable equations [1.3] ← q03 — Asked: y at a time, to 3 decimal places. Varies: y′ = ky, y′ = x·y, y′ = x/y forms.
7. q07 Linear first-order equations and the integrating factor [1.4] ← q06 — Asked: the integrating factor's exponent, then y at a time. Varies: constant p, forcing.
8. q08 Mixing tanks [1.4] ← q07 — Asked: salt in kg after t minutes, and the long-run amount. Varies: volumes, flow rates, concentrations.
9. q09 Autonomous equations: equilibria and stability [1.6] ← q04 — Asked: the equilibria in increasing order, then a code for one (1 stable, 0 unstable). Varies: factored polynomial f(y).
10. q10 Logistic growth [1.6] ← q09, q06 — Asked: the carrying capacity, then the time to reach a level to 2 decimal places. Varies: rate, capacity, start.
11. q11 Chapter review: first-order models [1.3, 1.4, 1.6] ← q08, q10 — Asked: a value and an equilibrium. Varies: model type.
12. q12 Second-order linear equations: superposition and two starting values [2.1] ← q07 — Asked: the constants C₁ and C₂. Varies: given basis solutions, starting values.
13. q13 Characteristic equation with two real roots [2.2] ← q12 — Asked: the roots, then y at a time. Varies: integer roots.
14. q14 Repeated roots [2.2] ← q13 — Asked: the root and the two constants. Varies: root, starting values.
15. q15 Complex roots and Euler's formula [2.2] ← q13 — Asked: the real and imaginary parts of the roots, then y at a time. Varies: a ± bi with whole a, b.
16. q16 Mechanical vibrations: frequency and damping [2.4] ← q15 — Asked: ω in rad/s, the period, and a code (1 over-, 2 critically, 3 underdamped). Varies: m, c, k.
17. q17 Chapter review: tuning a suspension [2.2, 2.4] ← q14, q16 — Asked: the damping c that makes it critical, then a value. Varies: m, k.
18. q18 Undetermined coefficients: polynomial and exponential forcing [2.5] ← q13 — Asked: the coefficients of the particular solution. Varies: forcing, coefficients.
19. q19 Undetermined coefficients: sine and cosine forcing [2.5] ← q18, q15 — Asked: the two coefficients A and B. Varies: forcing frequency, equation.
20. q20 Forced oscillations: the steady amplitude [2.6] ← q19, q16 — Asked: the amplitude to 3 decimal places. Varies: m, c, k, F₀, ω.
21. q21 Resonance and practical resonance [2.6] ← q20 — Asked: the forcing frequency that makes the amplitude largest. Varies: m, c, k.
22. q22 Higher-order equations and the Wronskian [2.3] ← q14 — Asked: the Wronskian at a point, then 1 if the solutions are independent, 0 if not. Varies: solution sets.
23. q23 Chapter review: the engine mount [2.3, 2.5, 2.6] ← q21, q22 — Asked: a particular coefficient and an amplitude. Varies: as above.
24. q24 Turning an equation into a first-order system; Euler for systems [3.1] ← q12 — Asked: the entries of A, then one Euler step. Varies: coefficients, h.
25. q25 Linear systems x′ = Ax [3.3] ← q24 — Asked: x′ at a point, then 1 if a given vector function is a solution, 0 if not. Varies: A.
26. q26 The eigenvalue method: real eigenvalues [3.4] ← q25 — Asked: the eigenvalues, then x₁ at a time from a starting vector. Varies: A with integer eigenvalues.
27. q27 Complex eigenvalues [3.4] ← q26, q15 — Asked: the growth rate and the angular frequency. Varies: A with eigenvalues a ± bi.
28. q28 Phase portraits [3.5] ← q27 — Asked: a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if stable, 0 if not. Varies: A.
29. q29 Chapter review: two linked tanks [3.4, 3.5] ← q26, q28 — Asked: eigenvalues, a code, a value. Varies: flow rates.
30. q30 The Laplace transform [6.1] ← q07 — Asked: ℒ{f}(s) at a given s. Varies: sums of tᵏ, e^(at), sin, cos.
31. q31 Inverse transforms with partial fractions [6.1] ← q30 — Asked: the coefficients of the inverse. Varies: two distinct linear factors.
32. q32 Solving an initial value problem with the transform [6.2] ← q31, q13 — Asked: y at a time. Varies: coefficients, starting values.
33. q33 Switch-ons: the Heaviside function [6.2] ← q32 — Asked: y at a time after the switch. Varies: switch time, forcing size.
34. q34 Impulses and convolution [6.3, 6.4] ← q33 — Asked: (f ∗ g)(t) at a time, or the response to a kick. Varies: functions, kick time and size.
35. q35 Power series solutions [7.2] ← q12 — Asked: the coefficients a₂, a₃, a₄ from the recurrence. Varies: equation, a₀, a₁.
36. q36 Critical points and linearisation of nonlinear systems [8.1] ← q28 — Asked: a critical point, then the Jacobian's entries there. Varies: polynomial systems.
37. q37 Stability and classification of critical points [8.2] ← q36 — Asked: the eigenvalues of the Jacobian, then the code from q28. Varies: system, point.
38. q38 Predator and prey [8.3] ← q37 — Asked: the coexistence point, then the period of small swings to 2 decimal places. Varies: the four rates.
39. q39 Boundary value problems and eigenvalue problems [4.1] ← q15 — Asked: the nth allowed λ as a multiple of π², or 1/0 for a unique solution. Varies: length L, n.
40. q40 Realm review and bridge to Waves [4.1, 8.3] ← q38, q39 — Asked: the lowest allowed frequency of a string of given length, then a dome population value. Varies: as above.

## Files

As in calc1 (§11): learn letters a q01–q10, b q11–q20, c q21–q30, d q31–q40; practice file N covers q(5N−4)…q(5N), N = 1…8.

## Answers

Numbers only; a solution function is never an answer. Ask instead for a constant, a root, a coefficient, an eigenvalue, the solution's value at a time, an amplitude or a period. Classifications are codes listed in the prompt (stable 1, unstable 0; over-, critically, underdamped 1, 2, 3; node, saddle, spiral, centre 1–4), always alongside a number. Complex roots are typed as real and imaginary parts in two boxes. Generators draw matrices with integer eigenvalues and characteristic equations with integer or a ± bi roots.

## Ranks, achievements, copy

Ranks (steps as calc1: `at` 0, 8, 24, 44, 68, 96, 128, 144, 160; `learnAt` 4, 10, 16, 22, 28, 34, 40): GREENHOUSE HAND, SLOPE READER, FLOW BALANCER, SUSPENSION TUNER, ENGINE MINDER, SYSTEMS OPERATOR, TRANSFORM ENGINEER, DYNAMICS ANALYST, MASTER OF DYNAMICS.

Achievements: "Ahead of time" (`ode-done`, the 40 concepts); "Every system steady" (`ode-master`, all 160).

- homeTitle: `The machines run themselves.<br><em>Learn to predict what they do next.</em>`
- firstVisit (Mira): "Welcome back. The outpost's machines now react to each other: tanks drain, springs bounce, populations rise and fall. An equation that says how something changes can tell us where it is going, and we start with the greenhouse seedlings."
- beginFirst: "Check the first seedling"
- allDone: "You did it. Every machine, tank and population at the outpost is predicted, and you know when one will settle or swing. Waves comes next, where the strings and air of the outpost start to ring."

Must-have glossary terms (`ODE`): differential equation, initial value problem, slope field, Euler's method, separable equation, integrating factor, equilibrium, characteristic equation, damping, resonance, eigenvalue method, phase portrait, Laplace transform, linearisation.
