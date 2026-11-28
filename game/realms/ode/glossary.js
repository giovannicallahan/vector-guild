/* Differential equations glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['ode'] = {
 required: ['differential equation', 'initial value problem', 'slope field', 'Euler\'s method', 'separable equation', 'integrating factor', 'equilibrium', 'characteristic equation', 'damping', 'resonance', 'eigenvalue method', 'phase portrait', 'Laplace transform', 'linearisation'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['differential equation', 'q01', 'An equation that links an unknown function to one or more of its own derivatives.', 'y′ = 2y says y grows at twice its own size.', []],
  ['ordinary differential equation', 'q02', 'A differential equation whose unknown is a function of one variable, so only ordinary derivatives appear.', 'y″ + 3y′ + 2y = 0 for an unknown y(t) is an ODE.', ['ODE']],
  ['nonlinear', 'q02', 'Said of an equation in which y or a derivative is squared, multiplied by another of them, or put inside a function.', 'y′ = y² and y″ + sin y = 0 are nonlinear.', []],
  ['general solution', 'q03', 'The whole family of solutions of a differential equation, written with one or more free constants.', 'y′ = 2x has general solution y = x² + C.', []],
  ['particular solution', 'q03', 'The one member of the general solution that also satisfies the given starting conditions.', 'y = x² + 3 is the particular solution of y′ = 2x with y(0) = 3.', []],
  ['initial condition', 'q03', 'A given value of the unknown function at one point, used to fix a constant of the general solution.', 'y(0) = 3 is an initial condition.', []],
  ['initial value problem', 'q03', 'A differential equation together with an initial condition, which picks out one solution.', 'y′ = 2x with y(0) = 3 has the solution y = x² + 3.', []],
  ['slope field', 'q04', 'A picture of short line segments showing, at many points, the slope a differential equation gives there.', 'For y′ = y the segments are flat along y = 0 and steep far from it.', []],
  ['equilibrium solution', 'q04', 'A constant function that solves a differential equation, so its slope is 0 everywhere along it.', 'y = 4 is an equilibrium solution of y′ = (x + 1)(2y − 8).', []],
  ['Euler\'s method', 'q05', 'A way to estimate a solution by stepping a short distance h along the slope at the current point, again and again.', 'y′ = y, y(0) = 1, h = 0.1: y₁ = 1 + 0.1 × 1 = 1.1.', []],
  ['step size', 'q05', 'The fixed distance h that Euler\'s method moves along x in each step.', 'With step size 0.5, three steps go from x = 0 to x = 1.5.', []],
  ['separable equation', 'q06', 'A first-order equation whose right-hand side is a function of t times a function of y, so the variables can be pulled apart.', 'y′ = ty is separable: dy ÷ y = t dt.', []],
  ['integrating factor', 'q07', 'The factor e^(pt) that turns the left side of y′ + py = g(t) into the derivative of a single product.', 'For y′ + 2y = 4 it is e^(2t), since (e^(2t)y)′ = 4e^(2t).', []],
  ['mixing problem', 'q08', 'A model of a substance in a tank with liquid flowing in and out: its rate of change is the rate in minus the rate out.', 'Salt in a tank: x′ = 0.5 − 0.05x.', []],
  ['autonomous equation', 'q09', 'A differential equation y′ = f(y) whose rate depends only on y, not on the time.', 'y′ = y(3 − y) is autonomous; y′ = t − y is not.', []],
  ['equilibrium', 'q09', 'A value of y where the rate f(y) is 0, so a solution that starts there stays there.', 'y′ = y(3 − y) has the equilibria 0 and 3.', ['equilibria']],
  ['stable equilibrium', 'q09', 'An equilibrium that nearby solutions move towards from both sides.', 'For y′ = 3 − y, solutions above and below 3 move towards it.', []],
  ['unstable equilibrium', 'q09', 'An equilibrium that nearby solutions move away from on at least one side.', 'For y′ = y − 3, solutions just off 3 run away from it.', []],
  ['logistic equation', 'q10', 'The growth model P′ = kP(1 − P ÷ K): almost exponential while P is small, levelling off at K.', 'P′ = 0.4P(1 − P ÷ 800).', []],
  ['carrying capacity', 'q10', 'The population K at which logistic growth stops: the largest one the surroundings can support.', 'For P′ = 0.4P(1 − P ÷ 800) it is 800.', []],
  /* q11–q20 (missions-b.js) */
  ['homogeneous', 'q12', 'Said of a linear equation whose every term contains the unknown function or one of its derivatives, so its right-hand side is 0.', 'y″ + 3y′ + 2y = 0 is homogeneous.'],
  ['superposition', 'q12', 'For a linear homogeneous equation, any sum of constant multiples of solutions is again a solution.', 'If e^(t) and e^(2t) are solutions, so is 3e^(t) − e^(2t).'],
  ['characteristic equation', 'q13', 'The quadratic ar² + br + c = 0 found by putting y = e^(rt) into ay″ + by′ + cy = 0; each root r gives a solution e^(rt).', 'y″ + 3y′ + 2y = 0 has characteristic equation r² + 3r + 2 = 0.', ['characteristic equations']],
  ['repeated root', 'q14', 'A root that a quadratic has twice, when it is a perfect square; the second solution is then te^(rt).', '(r + 2)² = 0 has the repeated root −2.'],
  ['complex number', 'q15', 'A number a + bi with real part a and imaginary part b, where i² = −1.', 'The roots of r² + 2r + 5 = 0 are −1 + 2i and −1 − 2i.'],
  ['Euler’s formula', 'q15', 'The rule e^(iθ) = cos θ + i sin θ, with θ in radians, that turns complex exponentials into sines and cosines.', 'e^(iπ) = cos π + i sin π = −1.', ['Euler\'s formula']],
  ['damping', 'q16', 'A force that resists motion in proportion to speed, like the oil in a shock absorber; in mx″ + cx′ + kx = 0 it is the cx′ term.', 'A damper with c = 4 N·s/m pushes back with 8 N at 2 m/s.', ['damper', 'damping constant']],
  ['angular frequency', 'q16', 'How fast a swing turns, in radians per second; cos ωt has angular frequency ω.', 'A spring with k ÷ m = 9 has natural angular frequency 3 rad/s.', ['natural angular frequency']],
  ['period', 'q16', 'The time one full swing takes: 2π divided by the angular frequency.', 'At ω = 4 rad/s the period is 2π ÷ 4, about 1.571 s.', ['natural period']],
  ['overdamped', 'q16', 'Damped so strongly (c² > 4mk) that the mass creeps back to rest without ever swinging past it.', 'x″ + 10x′ + 9x = 0 is overdamped: 100 > 36.'],
  ['critically damped', 'q16', 'Damped by exactly c² = 4mk, the boundary between swinging and not; it returns to rest fastest without a bounce.', 'x″ + 6x′ + 9x = 0 is critically damped: 36 = 36.', ['critical damping']],
  ['underdamped', 'q16', 'Damped weakly (c² < 4mk), so the mass swings back and forth with swings that shrink.', 'x″ + 2x′ + 9x = 0 is underdamped: 4 < 36.'],
  ['nonhomogeneous', 'q18', 'Said of a linear equation with a forcing term: a right-hand side that is not 0 and does not contain the unknown.', 'y″ + 3y′ + 2y = 4t + 6 is nonhomogeneous.'],
  ['undetermined coefficients', 'q18', 'A way to find a particular solution: guess a function shaped like the forcing, with unknown numbers, and match terms.', 'For y″ + y′ + 2y = 4t + 6, guess yₚ = Ct + D and find C = D = 2.'],
  ['steady periodic solution', 'q20', 'The part of a damped, periodically forced motion that is left once the transient has died away; it swings at the forcing frequency.', 'For x″ + 2x′ + 7x = 10 cos 2t it is 2 cos(2t − γ).'],
  ['amplitude', 'q20', 'The largest distance a swing reaches from its centre; A cos ωt + B sin ωt has amplitude √(A² + B²).', '3 cos t + 4 sin t has amplitude 5.'],
  ['transient', 'q20', 'The part of a forced, damped motion that dies away with time, leaving the steady periodic solution.', 'A start-up wobble like 5e^(−t) cos 2t is a transient.'],
  /* q21–q30 (missions-c.js) */
  ['resonance', 'q21', 'Forcing an undamped spring at its natural frequency, so that its swings grow larger and larger without limit.', 'x″ + 4x = cos(2t) swings wider every cycle.'],
  ['practical resonance', 'q21', 'Forcing a damped spring at the frequency that makes its steady amplitude as large as it can be.', 'x″ + 2x′ + 6x = cos(ωt) swings most at ω = 2.'],
  ['Wronskian', 'q22', 'The determinant of the matrix of some functions and their derivatives; for solutions of one linear equation, non-zero means independent.', 'For e^t and e^(2t) at t = 0 it is 1 × 2 − 1 × 1 = 1.'],
  ['linearly independent', 'q22', 'Describes functions none of which is a combination of the others, so only all-zero constants make their mix zero.', 'e^t and e^(2t) are independent; e^t and 3e^t are not.', ['linear independence']],
  ['first-order system', 'q24', 'Several equations in several unknowns that contain only first derivatives, written x′ = Ax when they are linear.', 'x″ = −x becomes x₁′ = x₂, x₂′ = −x₁.'],
  ['eigenvalue method', 'q26', 'Solving x′ = Ax with solutions e^(λt)v, one for each eigenvalue λ and eigenvector v of A.', 'A with eigenvalue 2, eigenvector (1, 1) gives e^(2t)(1, 1).'],
  ['trajectory', 'q28', 'The path a solution of a system traces out in the plane as time goes on.', 'For x₁′ = −x₁, x₂′ = −x₂ every trajectory runs straight to the origin.'],
  ['phase portrait', 'q28', 'A picture of many trajectories of a system at once, showing every way it can move.', 'A spiral phase portrait shows paths winding round the origin.'],
  ['node', 'q28', 'A phase portrait whose trajectories run straight into or out of the origin; its eigenvalues are real with one sign.', 'Eigenvalues −3 and −1 give a stable node.'],
  ['saddle', 'q28', 'A phase portrait where trajectories come in along one eigenvector and leave along another; eigenvalues of opposite signs.', 'Eigenvalues 2 and −1 give a saddle.'],
  ['spiral', 'q28', 'A phase portrait whose trajectories wind round the origin, in or out; complex eigenvalues with a non-zero real part.', 'Eigenvalues −1 ± 2i give a spiral that winds in.'],
  ['centre', 'q28', 'A phase portrait of closed loops round the origin; its eigenvalues are purely imaginary.', 'Eigenvalues ±3i give a centre.', ['center']],
  ['Laplace transform', 'q30', 'The function ℒ{f}(s) = ∫₀^∞ e^(−st)f(t) dt, which turns a function of time into a function of s.', 'ℒ{e^(2t)} = 1 ÷ (s − 2) for s > 2.'],
  /* q31–q40 (missions-d.js) */
  ['inverse transform', 'q31', 'Going back from a Laplace transform F(s) to the function f(t) it came from, usually by reading pieces off a table.', 'The inverse transform of 3 ÷ (s − 2) is 3e^(2t).', ['inverse Laplace transform']],
  ['transform of a derivative', 'q32', 'The rule ℒ{y′} = sY − y(0), used twice for y″, that turns a differential equation into algebra for Y(s).', 'ℒ{y″} = s²Y − s·y(0) − y′(0).', []],
  ['Heaviside function', 'q33', 'The switch u(t − a): 0 before time a and 1 from time a on, so F u(t − a) is a push of size F switched on at a.', 'ℒ{u(t − 3)} = e^(−3s) ÷ s.', ['unit step']],
  ['shift rule', 'q33', 'If g(t) has transform G(s), then e^(−as)G(s) is the transform of g(t − a)u(t − a): g started late, at t = a.', 'e^(−2s) ÷ s² is the transform of (t − 2)u(t − 2).', []],
  ['convolution', 'q34', 'The blend (f ∗ g)(t) of two functions, the integral from 0 to t of f(τ)g(t − τ); its transform is F(s)G(s).', 'For f(t) = t and g(t) = 2, (f ∗ g)(3) = 9.', []],
  ['Dirac delta', 'q34', 'δ(t − a), an instant kick of total size 1 at time a, with Laplace transform e^(−as).', 'y′ + y = 2δ(t − 1) makes y jump by 2 at t = 1.', []],
  ['impulse', 'q34', 'A push so short and strong that its whole effect arrives at one instant, written with the Dirac delta.', 'A hammer tap on a coil is an impulse.', []],
  ['power series solution', 'q35', 'A solution written as y = a₀ + a₁x + a₂x² + …, whose coefficients are found from the equation one by one.', 'For y″ + y = 0 with y(0) = 1, y′(0) = 0 the series is 1 − x²/2 + x⁴/24 − ….', []],
  ['recurrence relation', 'q35', 'A rule that gives each term of a sequence from earlier terms, such as each series coefficient from one two places back.', 'aₙ₊₂ = −aₙ ÷ ((n + 2)(n + 1)) for y″ + y = 0.', []],
  ['critical point', 'q36', 'A point where every right-hand side of an autonomous system is 0, so a solution starting there stays put.', 'x′ = x − y, y′ = y − 1 has the critical point (1, 1).', []],
  ['partial derivative', 'q36', 'The derivative of a function of two letters in one of them, with the other held fixed as a number.', 'For f = xy², ∂f/∂x = y² and ∂f/∂y = 2xy.', []],
  ['Jacobian matrix', 'q36', 'The square of partial derivatives of a system’s right-hand sides: row one ∂f/∂x, ∂f/∂y, row two ∂g/∂x, ∂g/∂y.', 'For x′ = xy, y′ = x + y it is [[y, x], [1, 1]].', []],
  ['linearisation', 'q36', 'The linear system u′ = Ju, with J the Jacobian matrix at a critical point, that a nonlinear system closely follows near it.', 'At (1, 1), x′ = xy − 1, y′ = x − y has linearisation u′ = u + v, v′ = u − v.', ['linearization']],
  ['predator–prey system', 'q38', 'A pair of equations x′ = ax − bxy, y′ = −cy + dxy for prey x and predators y, also called a Lotka–Volterra system.', 'Insects x and the birds y that eat them.', ['Lotka–Volterra system']],
  ['coexistence point', 'q38', 'The critical point of a predator–prey system where both populations are present and steady: (c ÷ d, a ÷ b).', 'x′ = x − 0.5xy, y′ = −y + 0.2xy has coexistence point (5, 2).', []],
  ['boundary value problem', 'q39', 'A differential equation with one condition at each end of an interval, which may have one solution, none or many.', 'y″ + y = 0 with y(0) = 0 and y(π) = 0 has the solutions C sin x.', []],
  ['eigenvalue problem', 'q39', 'A boundary value problem asking for which numbers λ there is a solution other than 0; those λ are its eigenvalues.', 'y″ + λy = 0, y(0) = y(π) = 0 allows λ = 1, 4, 9, ….', []],
  ['fundamental frequency', 'q40', 'The lowest frequency a string or other system with fixed ends can swing at, from its lowest allowed λ.', 'A string 2 metres long with wave speed 100 m/s has ω = 50π rad/s.', []],
 ]
};
})();
