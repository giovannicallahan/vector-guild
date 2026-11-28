/* Calculus 2: accumulation glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['calc2'] = {
 required: ['accumulation function', 'average value', 'substitution', 'solid of revolution', 'washer', 'cylindrical shell', 'arc length', 'work', 'centre of mass', 'integration by parts', 'partial fractions', 'improper integral', 'series', 'Taylor series'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['net change', 'q01', 'How much a quantity has changed overall from the start of an interval to its end: the integral of its rate of change.', 'Filling at 5 litres per minute for 4 minutes is a net change of 20 litres.'],
  ['Net Change Theorem', 'q01', 'The amount at the end of an interval equals the amount at the start plus the integral of the rate of change over it.', 'A tank with 10 litres, fed 12 more, ends with 22 litres.'],
  ['antiderivative', 'q01', 'A function whose derivative is the given function; any constant may be added to it.', 'x³ is an antiderivative of 3x², and so is x³ + 7.'],
  ['definite integral', 'q01', 'The signed area between a curve and the horizontal axis from one input to another, written ∫ from a to b.', 'The definite integral of 2x from 0 to 3 is 9.'],
  ['accumulation function', 'q02', 'A function F(x) = ∫ from a to x of f(t) dt that gives the running total of f from a fixed start a up to x.', 'For f(t) = 2t and a = 0, the accumulation function is F(x) = x².'],
  ['integrand', 'q02', 'The function inside an integral, the one being added up.', 'In ∫ from 0 to 3 of (t² + 1) dt the integrand is t² + 1.'],
  ['dummy variable', 'q02', 'The letter used inside an integral for the quantity being added up; changing it to another letter does not change the value.', '∫ from 0 to 2 of t dt and ∫ from 0 to 2 of s ds are both 2.'],
  ['average value', 'q03', 'The integral of a function over an interval divided by the length of the interval: the steady level with the same total.', 'The average value of 2x from 0 to 4 is 16 ÷ 4 = 4.'],
  ['substitution', 'q04', 'A way to integrate by naming an inner function u, so that du replaces its derivative times dx and the integral becomes simpler.', 'With u = x² + 1, ∫ 2x(x² + 1)³ dx becomes ∫ u³ du.', ['integration by substitution', 'u-substitution']],
  ['natural logarithm', 'q05', 'The logarithm with base e, written ln x: the power you raise e to in order to get x.', 'ln 1 = 0, because e⁰ = 1.', ['ln']],
  ['absolute value', 'q05', 'The size of a number without its sign, written with two upright bars.', '|−3| = 3 and |3| = 3.'],
  ['radian', 'q06', 'A unit of angle: the angle whose arc on a circle is as long as the radius, so a full turn is 2π radians.', 'A right angle is π ÷ 2 radians, about 1.571.'],
  ['arctan', 'q06', 'The inverse tangent: the angle between −π ÷ 2 and π ÷ 2 whose tangent is the given number.', 'arctan 1 = π ÷ 4, about 0.785 radians.', ['inverse tangent']],
  ['arcsin', 'q06', 'The inverse sine: the angle between −π ÷ 2 and π ÷ 2 whose sine is the given number, from −1 to 1.', 'arcsin 0.5 = π ÷ 6, about 0.524 radians.', ['inverse sine']],
  ['area between curves', 'q07', 'The integral, between the points where two curves meet, of the top curve minus the bottom curve.', 'Between y = x + 2 and y = x² the area is 4.5.', ['area between two curves']],
  ['horizontal strip', 'q08', 'A thin slice of a region parallel to the x-axis, whose length is the right boundary minus the left one at that height.', 'Between x = y² and x = 4 the strip at height y has length 4 − y².'],
  ['cross-section', 'q09', 'The flat face you see when you cut a solid straight across; its area times a small thickness is the volume of a thin slice.', 'Every cross-section of a cylinder across its axis is a disc.', ['cross section']],
  ['solid of revolution', 'q10', 'The solid swept out when a flat region is spun about a line, the axis of revolution.', 'Spinning a rectangle about one side makes a cylinder.'],
  ['disc', 'q10', 'A filled circle; a slice of a solid of revolution that touches the axis, with area π times its radius squared.', 'A disc of radius 3 m has area 9π m².', ['disk']],
  ['washer', 'q10', 'A disc with a smaller disc cut from its middle; a slice of a solid of revolution with a hole, area π(R² − r²).', 'Outer radius 3 and inner radius 1 give area π(9 − 1) = 8π.'],
  /* q11–q20 (missions-b.js) */
  ['cylindrical shell', 'q12', 'A thin hollow tube swept out when an upright strip of a region spins about a vertical axis; its volume is about 2π × radius × height × thickness.', 'A strip 3 m tall at radius 2 m, 0.1 m wide, sweeps out about 2π × 2 × 3 × 0.1 m³.', ['shell']],
  ['arc length', 'q13', 'The length of a curve measured along it: the integral of √(1 + (dy/dx)²) between the two ends.', 'The arc length of y = (2/3)x^(3/2) from x = 0 to x = 3 is 14/3.'],
  ['work', 'q14', 'The effort of moving something against a force: force times distance, or the integral of the force when it varies.', 'Lifting a 10 N load 2 m takes 20 J of work.', [], 'work out|work it out|works out|worked out'],
  ['joule', 'q14', 'The unit of work and energy, written J: the work done by a force of 1 newton acting over 1 metre.', 'A 5 N push over 3 m does 15 J of work.'],
  ['newton', 'q14', 'The unit of force, written N: about the pull of gravity on a small apple.', 'A 2 kg mass weighs 2 × 9.8 = 19.6 N.'],
  ['Hooke’s law', 'q14', 'The force needed to hold a spring stretched x beyond its natural length is F = kx, for a constant k.', 'If k = 200 N/m, holding the spring 0.3 m out takes 60 N.', ['Hooke\'s law']],
  ['spring constant', 'q14', 'The number k in Hooke’s law: the force, in newtons, for each metre a spring is stretched.', '30 N holds a spring 0.2 m out, so k = 150 N/m.'],
  ['density', 'q15', 'Mass per unit of size: per cubic metre for a liquid such as water, or per metre of length for a rod.', 'Water has density 1000 kg/m³, so 2 m³ of it has a mass of 2000 kg.'],
  ['kilojoule', 'q15', 'A thousand joules, written kJ.', '9800 J is 9.8 kJ.'],
  ['moment', 'q16', 'The tipping effect of a mass about a point: the mass times its distance from the point, added up or integrated.', 'A 3 kg mass 2 m from the pivot has moment 6 kg·m.', [], 'at the moment|at that moment|at this moment|at one moment|any moment|single moment|exact moment'],
  ['centre of mass', 'q16', 'The balance point of an object: its total moment divided by its total mass.', 'A rod with the same density all along has its centre of mass at its middle.', ['center of mass']],
  ['centroid', 'q16', 'The geometric centre of a flat shape: the centre of mass of a plate of even thickness.', 'The centroid of a rectangle is where its diagonals cross.'],
  ['integration by parts', 'q18', 'The rule ∫ u dv = uv − ∫ v du, which undoes the product rule and trades one integral for an easier one.', 'For ∫ x eˣ dx take u = x and dv = eˣ dx: x eˣ − eˣ + C.'],
  ['boundary term', 'q18', 'In integration by parts over an interval, uv at the top limit minus uv at the bottom limit.', 'For u = x, v = eˣ from 0 to 1 the boundary term is 1 × e − 0 = e.'],
  ['power-reducing identity', 'q19', 'An identity that trades a square of sine or cosine for a double angle: sin²x = (1 − cos 2x) ÷ 2, cos²x = (1 + cos 2x) ÷ 2.', 'cos²x = (1 + cos 2x) ÷ 2, so ∫ cos²x dx = x ÷ 2 + sin 2x ÷ 4 + C.', ['power-reducing identities']],
  ['trigonometric substitution', 'q20', 'Replacing x by r sin θ (or r tan θ) so that a root such as √(r² − x²) becomes r cos θ.', 'With x = 3 sin θ, √(9 − x²) becomes 3 cos θ.'],
  /* q21–q30 (missions-c.js) */
  ['partial fractions', 'q21', 'Simpler fractions that add up to a given fraction, such as A ÷ (x + a) + B ÷ (x + b) for a bottom (x + a)(x + b).', '(5x + 7) ÷ ((x + 1)(x + 2)) = 2 ÷ (x + 1) + 3 ÷ (x + 2).', ['partial fraction']],
  ['linear factor', 'q21', 'A factor of the form x plus or minus a number, whose graph is a straight line.', 'x² + 3x + 2 = (x + 1)(x + 2) has the linear factors x + 1 and x + 2.'],
  ['numerical integration', 'q22', 'Estimating an integral with arithmetic on values of the function, when no antiderivative is at hand.', 'Readings every 2 minutes, combined by Simpson’s rule, estimate the litres pumped.'],
  ['trapezoidal rule', 'q22', 'An estimate of an integral from readings at equal steps h: (h ÷ 2) × (first + 2 × each middle reading + last).', 'Readings 3, 5, 4 with h = 1: (1 ÷ 2) × (3 + 10 + 4) = 8.5.'],
  ['Simpson’s rule', 'q22', 'An estimate of an integral from readings at equal steps h over an even number of strips, weighted 1, 4, 2, 4, …, 4, 1, times h ÷ 3.', 'Readings 3, 5, 4 with h = 1: (1 ÷ 3) × (3 + 20 + 4) = 9.', ['Simpson rule']],
  ['improper integral', 'q24', 'An integral with ∞ as a limit, or whose integrand grows without bound at a point of the interval; it is found as a limit of ordinary integrals.', '∫ from 1 to ∞ of 1 ÷ t² dt is the limit of 1 − 1 ÷ b as b → ∞, which is 1.', ['improper']],
  ['converges', 'q24', 'Settles on one finite number: said of an improper integral, a sequence or a series whose values close in on a limit.', '∫ from 1 to b of 1 ÷ t² dt = 1 − 1 ÷ b converges to 1.', ['converge', 'convergent', 'converging']],
  ['diverges', 'q24', 'Fails to settle on one finite number, for example by growing without bound.', '∫ from 1 to b of 1 ÷ t dt = ln b grows without bound, so it diverges.', ['diverge', 'divergent']],
  ['rate constant', 'q26', 'The number k in y = y₀e^(−kt) or y = y₀e^(kt): how fast, as a fraction of the amount, the amount shrinks or grows.', 'A half-life of 10 days gives k = ln 2 ÷ 10 ≈ 0.0693 per day.'],
  ['half-life', 'q26', 'The time it takes a decaying amount to fall to half of what it was; for y₀e^(−kt) it is ln 2 ÷ k.', 'With a half-life of 12 days, 80 kg becomes 40 kg after 12 days and 20 kg after 24.', ['half-lives']],
  ['doubling time', 'q26', 'The time it takes a growing amount to double; for y₀e^(kt) it is ln 2 ÷ k.', 'With k = 0.1 per hour the doubling time is 0.693 ÷ 0.1 ≈ 6.9 hours.'],
  ['sequence', 'q27', 'An endless list of numbers in order, a₁, a₂, a₃, …, often given by a formula for aₙ.', 'aₙ = 1 ÷ n gives the sequence 1, 1/2, 1/3, 1/4, …'],
  ['term', 'q27', 'One number in a sequence or series, or one of the pieces added together in a sum.', 'The third term of 2, 4, 8, 16, … is 8.'],
  ['series', 'q28', 'The sum of all the terms of a sequence, a₁ + a₂ + a₃ + …, written Σ aₙ.', 'The series 1 + 1/2 + 1/4 + … has the sum 2.'],
  ['Σ', 'q28', 'The Greek capital letter sigma, used to mean “add up all of these”.', 'Σ aₙ means a₁ + a₂ + a₃ + …', ['sigma']],
  ['partial sum', 'q28', 'The sum Sₙ of the first n terms of a series; the series converges when the partial sums settle on a number.', 'For 1 + 1/2 + 1/4 + …, the partial sum S₃ is 1.75.'],
  ['geometric series', 'q28', 'A series in which each term is the one before times the same common ratio r; when r is between −1 and 1 its sum is a ÷ (1 − r).', '8 + 4 + 2 + 1 + … = 8 ÷ (1 − 1/2) = 16.'],
  ['common ratio', 'q28', 'The fixed number r that each term of a geometric series is multiplied by to give the next one.', 'In 36, 24, 16, … the common ratio is 24 ÷ 36 = 2/3.'],
  ['telescoping series', 'q30', 'A series whose terms are differences that cancel in the partial sums, leaving only a few pieces at the two ends.', '1 ÷ (n(n + 1)) = 1 ÷ n − 1 ÷ (n + 1), so Sₙ = 1 − 1 ÷ (n + 1).', ['telescoping', 'telescopes']],
  ['divergence test', 'q30', 'If the terms of a series do not approach 0, the series diverges; if they do approach 0, the test says nothing.', '1 + 1 + 1 + … diverges because its terms stay at 1.'],
  /* q31–q40 (missions-d.js) */
  ['integral test', 'q31', 'A series of positive, falling terms f(n) converges exactly when the integral of f from 1 to ∞ is finite.', 'Σ 1 ÷ n² converges because the integral of 1 ÷ x² from 1 to ∞ is 1.'],
  ['p-series', 'q31', 'A series Σ 1 ÷ nᵖ for a fixed power p; it converges when p > 1 and diverges when p ≤ 1.', 'Σ 1 ÷ n³ converges; Σ 1 ÷ √n diverges.'],
  ['harmonic series', 'q31', 'The series 1 + 1/2 + 1/3 + 1/4 + …, the p-series with p = 1; its terms shrink to 0 but it diverges.', 'Its partial sums pass 2 after 4 terms and keep growing without bound.'],
  ['tail', 'q31', 'The part of a series left over after its first N terms: the true sum minus the partial sum.', 'For Σ 1 ÷ n² the tail after 4 terms is less than 1 ÷ 4.'],
  ['comparison test', 'q32', 'A series of positive terms converges if its terms are never bigger than those of a convergent series.', 'Each 1 ÷ (n² + 1) is below 1 ÷ n², so Σ 1 ÷ (n² + 1) converges.'],
  ['limit comparison test', 'q32', 'If aₙ ÷ bₙ approaches a positive, finite limit, the series Σ aₙ and Σ bₙ both converge or both diverge.', '(2n + 1) ÷ (5n² + 3) against 1 ÷ n: the limit is 0.4, so both diverge.'],
  ['alternating series', 'q33', 'A series whose terms take turns being positive and negative.', '1 − 1/2 + 1/3 − 1/4 + … is an alternating series.'],
  ['remainder', 'q33', 'The error left by a partial sum or a polynomial estimate: the true value minus the estimate.', 'After 4 terms of 1 − 1/4 + 1/9 − …, the remainder is less than 1/25.'],
  ['ratio test', 'q34', 'If aₙ₊₁ ÷ aₙ approaches L, the series converges when L < 1 and diverges when L > 1; L = 1 decides nothing.', 'For Σ 3ⁿ ÷ n! the ratio 3 ÷ (n + 1) approaches 0, so it converges.'],
  ['root test', 'q34', 'If the nth root of the nth term approaches L, the series converges when L < 1 and diverges when L > 1.', 'For terms (n ÷ (3n + 1))ⁿ the root approaches 1/3, so the series converges.'],
  ['factorial', 'q34', 'The product of the whole numbers from 1 up to n, written n!, with 0! counted as 1.', '5! = 1 × 2 × 3 × 4 × 5 = 120.', ['n!']],
  ['power series', 'q35', 'A series whose terms are numbers times powers of x − a, like a polynomial that never ends.', '1 + x + x² + x³ + … is a power series centred at 0.'],
  ['radius of convergence', 'q35', 'The distance R from the centre of a power series within which it converges and beyond which it diverges.', 'Σ (x − 1)ⁿ ÷ 5ⁿ has radius of convergence 5.'],
  ['interval of convergence', 'q35', 'The stretch of x values for which a power series converges, from one radius below its centre to one above.', 'Σ (x − 1)ⁿ ÷ 5ⁿ converges for x between −4 and 6.'],
  ['Taylor polynomial', 'q36', 'The polynomial whose value and first n derivatives at a point a match those of a function there.', 'About 1, ln x has the Taylor polynomial (x − 1) − (x − 1)² ÷ 2 of degree 2.'],
  ['Taylor series', 'q36', 'The power series Σ f⁽ᵏ⁾(a)(x − a)ᵏ ÷ k! made from all the derivatives of a function at a point a.', 'The Taylor series of eˣ about 0 is 1 + x + x²/2! + ….'],
  ['Maclaurin series', 'q37', 'A Taylor series about the point 0.', 'sin x = x − x³/3! + x⁵/5! − … is a Maclaurin series.'],
  ['Taylor’s theorem', 'q38', 'The remainder after a Taylor polynomial of degree n is at most M × |x − a|ⁿ⁺¹ ÷ (n + 1)!, where M bounds the next derivative.', 'For cos x at 0.5, the degree 4 error is at most 0.5⁵ ÷ 120.', ['Taylor remainder']],
  ['parametric equations', 'q40', 'A pair of formulas x(t) and y(t) that give a point’s position for each value of a third variable t.', 'x(t) = t², y(t) = t³ describe a path traced out as t grows.'],
  ['parameter', 'q40', 'The extra variable, often the time t, on which both coordinates in parametric equations depend.', 'In x(t) = 3t², y(t) = t³ − 3t, the parameter is t.'],
 ]
};
})();
