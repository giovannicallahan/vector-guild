/* Complex analysis: the plane of numbers glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['complex'] = {
 required: ['complex number', 'imaginary part', 'modulus', 'argument', 'analytic', 'Cauchy–Riemann equations', 'harmonic', 'contour integral', 'winding number', 'Cauchy\'s integral formula', 'Laurent series', 'pole', 'residue', 'radius of convergence'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['complex number', 'q01', 'A number x + yi made of a real part x and an imaginary part y, where i is a number with i² = −1.', '3 − 2i is a complex number with real part 3.'],
  ['real part', 'q01', 'The number x in the complex number x + yi, written Re z.', 'The real part of 3 − 2i is 3.'],
  ['imaginary part', 'q01', 'The real number y in the complex number x + yi, written Im z; it is the number in front of i, without the i.', 'The imaginary part of 3 − 2i is −2.'],
  ['conjugate', 'q02', 'The conjugate of z = x + yi is z̄ = x − yi: the same real part with the sign of the imaginary part flipped.', 'The conjugate of 4 + 7i is 4 − 7i.', ['complex conjugate']],
  ['complex plane', 'q03', 'The plane in which the complex number x + yi is the point (x, y): the real part across and the imaginary part up.', '2 + 3i is the point 2 to the right of 0 and 3 up.'],
  ['modulus', 'q03', 'The distance |z| = √(x² + y²) from 0 to the point z = x + yi of the complex plane.', '|3 + 4i| = 5.', ['moduli']],
  ['argument', 'q03', 'An angle in radians from the positive real axis round to z; two arguments of the same z differ by whole turns of 2π.', 'π ÷ 2 is an argument of i, and so is 5π ÷ 2.'],
  ['principal argument', 'q03', 'The one argument of z with −π < Arg z ≤ π, written Arg z.', 'Arg(−1) = π and Arg(−i) = −π ÷ 2.'],
  ['polar form', 'q04', 'Writing a complex number as z = r e^(iθ), by its modulus r and an argument θ, instead of by its two parts.', 'i = e^(iπ ÷ 2) in polar form.'],
  ['Euler\'s formula', 'q04', 'The rule e^(iθ) = cos θ + i sin θ for any real angle θ in radians.', 'e^(iπ) = cos π + i sin π = −1.', ['Euler’s formula']],
  ['de Moivre\'s formula', 'q05', 'The rule (r e^(iθ))ⁿ = rⁿ e^(inθ): a power raises the modulus to the nth power and multiplies the angle by n.', '(1 + i)⁴ = (√2)⁴ e^(iπ) = −4.', ['de Moivre’s formula']],
  ['nth root', 'q06', 'A number z with zⁿ = w; every non-zero w has exactly n different nth roots.', 'The square roots of −4 are 2i and −2i.'],
  ['root of unity', 'q06', 'A complex number z with zⁿ = 1 for some whole number n of at least 1.', 'i is a 4th root of unity, since i⁴ = 1.', ['roots of unity']],
  ['mapping', 'q07', 'A function w = f(z) thought of as moving each point z of one plane to a point w of another.', 'w = z² maps i to −1.', ['map']],
  ['complex exponential', 'q08', 'The function e^z = e^x(cos y + i sin y) for z = x + yi.', 'e^(1 + πi) = −e.'],
  ['period', 'q08', 'A shift that leaves a function unchanged; e^z has period 2πi, because e^(z + 2πi) = e^z.', 'e^(1 + 2πi) = e^1.'],
  ['complex logarithm', 'q09', 'A number w with e^w = z; its values are ln |z| + i(Arg z + 2πk) for every whole number k.', 'The values of log(−1) include πi, 3πi and −πi.'],
  ['branch', 'q09', 'A choice that makes a many-valued function single-valued, such as one fixed range for the argument in log z.', 'The principal branch of log z uses −π < Arg z ≤ π.'],
  ['principal value', 'q09', 'The value of a many-valued function picked out by the principal argument, such as Log z = ln |z| + i Arg z.', 'The principal value of log i is iπ ÷ 2.'],
  ['complex power', 'q10', 'The power z^a, defined as e^(a log z); its principal value uses Log z.', 'The principal value of i^i is e^(−π ÷ 2) ≈ 0.21.'],
  /* q11–q20 (missions-b.js) */
  ['complex derivative', 'q12', 'The limit of (f(z₀ + h) − f(z₀)) ÷ h as the complex step h shrinks to 0 from every direction, written f′(z₀).', 'The complex derivative of z² is 2z, so at z₀ = i it is 2i.'],
  ['partial derivative', 'q13', 'The derivative of a function of x and y in one variable while the other is held fixed, written ∂u/∂x or ∂u/∂y.', 'For u = x²y, ∂u/∂x = 2xy and ∂u/∂y = x².'],
  ['Cauchy–Riemann equations', 'q13', 'The two conditions ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x that the parts of an analytic function u + iv must satisfy.', 'u = x² − y², v = 2xy: ∂u/∂x = 2x = ∂v/∂y and ∂u/∂y = −2y = −∂v/∂x.'],
  ['analytic', 'q13', 'Having a complex derivative at every point of a region; for u + iv with continuous partial derivatives, the same as satisfying Cauchy–Riemann.', 'z³ + 2z is analytic in the whole plane; z̄ is analytic nowhere.'],
  ['sinh', 'q15', 'The hyperbolic sine, sinh y = (e^y − e^(−y)) ÷ 2, which is 0 at y = 0 and grows like e^y ÷ 2.', 'sinh 1 ≈ 1.1752.'],
  ['cosh', 'q15', 'The hyperbolic cosine, cosh y = (e^y + e^(−y)) ÷ 2, never below 1; it equals cos(iy).', 'cosh 1 ≈ 1.5431, so cos(i) ≈ 1.5431.'],
  ['Laplacian', 'q16', 'The sum of the second partial derivatives ∂²u/∂x² + ∂²u/∂y² of a function u(x, y).', 'The Laplacian of x² + 3y² is 2 + 6 = 8.'],
  ['Laplace’s equation', 'q16', 'The equation ∂²u/∂x² + ∂²u/∂y² = 0, required at every point of a region.', 'u = x² − y² satisfies Laplace’s equation: 2 − 2 = 0.', ['Laplace\'s equation']],
  ['harmonic', 'q16', 'Describes a function of x and y whose Laplacian is 0 at every point, so it satisfies Laplace’s equation.', 'u = x² − y² is harmonic; u = x² + y² is not.'],
  ['contour', 'q18', 'A curve in the plane with a direction: a start, an end and a way of travelling along it.', 'The segment from 0 to 1 + i, travelled from 0 towards 1 + i.'],
  ['parametrisation', 'q18', 'A description of a curve as a point γ(t) that moves along it as the real number t runs over an interval.', 'γ(t) = A + t(B − A) for t from 0 to 1 is the segment from A to B.', ['parametrise', 'parametrised']],
  ['contour integral', 'q18', 'The sum of f(z) dz along a contour γ, worked out as ∫ f(γ(t)) γ′(t) dt and written ∫_γ f(z) dz.', 'Along the segment from 0 to 2i, ∫_γ z dz = −2.'],
  ['path independence', 'q19', 'The property that an integral between two points gives the same value along every curve joining them, as when f has an antiderivative.', '∫ z dz from 0 to 1 + i is i along any route.'],
  ['closed curve', 'q20', 'A contour that ends where it starts, such as a circle driven once round; an integral round it is written ∮.', '∮ dz ÷ z = 2πi once round the unit circle.'],
  /* q21–q30 (missions-c.js) */
  ['Cauchy\'s theorem', 'q21', 'If a function is analytic at every point on and inside a closed curve, its integral round that curve is 0.', '∮ z² dz = 0 round any circle, since z² is analytic everywhere.', ['Cauchy’s theorem']],
  ['winding number', 'q22', 'The net number of anticlockwise turns a closed curve makes round a point, with each clockwise turn counted as −1.', 'A path twice clockwise round |z| = 2 has winding number −2 round 0.'],
  ['simple closed curve', 'q24', 'A closed curve that never crosses itself, such as a circle.', 'The circle |z| = 3 is a simple closed curve; a figure eight is not.'],
  ['Cauchy\'s integral formula', 'q24', 'For f analytic on and inside a loop run once anticlockwise and a inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a).', 'Round |z| = 2, ∮ (z + 3) ÷ (z − 1) dz = 2πi × 4 = 8πi.', ['Cauchy’s integral formula']],
  ['Cauchy\'s formula for derivatives', 'q25', 'For f analytic on and inside a loop and a inside it, ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!.', 'Round |z| = 2, ∮ z³ ÷ (z − 1)² dz = 2πi × 3 = 6πi.', ['Cauchy’s formula for derivatives']],
  ['Cauchy\'s inequality', 'q26', 'If |f| ≤ M on a circle of radius R round a and f is analytic on and inside it, then |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ.', 'With M = 20 and R = 4, |f′(a)| ≤ 20 ÷ 4 = 5.', ['Cauchy’s inequality']],
  ['entire function', 'q26', 'A function that is analytic at every point of the complex plane.', 'Every polynomial, such as z² + 1, is an entire function.'],
  ['Liouville\'s theorem', 'q26', 'An entire function that is bounded, with |f(z)| ≤ M at every point, must be constant.', 'z² + 1 is entire and not constant, so it is not bounded.', ['Liouville’s theorem']],
  ['mean value property', 'q27', 'The average of a harmonic function round a circle equals its value at the centre of the circle.', 'x² − y² averages 4 round any circle centred at (2, 0).'],
  ['maximum modulus principle', 'q28', 'For a function analytic on a disc and not constant, the largest value of |f| over the disc is reached on its edge.', 'On |z| ≤ 2, |z + 1| is largest at z = 2, where it is 3.'],
  ['triangle inequality', 'q28', 'For complex numbers w and c, |w + c| is at most |w| + |c| and at least |w| − |c|.', '|3 + 4i| = 5 and |3| + |4i| = 7, so 5 ≤ 7.'],
  ['geometric series', 'q30', 'A sum 1 + z + z² + … of the powers of one number; when |z| < 1 it adds up to 1 ÷ (1 − z).', 'For z = 0.5 the sum is 1 ÷ 0.5 = 2.'],
  /* q31–q40 (missions-d.js) */
  ['power series', 'q31', 'A sum a₀ + a₁z + a₂z² + … of powers of z, each with its own coefficient.', 'Σ zⁿ ÷ 2ⁿ is a power series in z.'],
  ['radius of convergence', 'q31', 'The number R for which a power series converges when |z| < R and diverges when |z| > R.', 'Σ n²zⁿ ÷ 6ⁿ has radius of convergence 6.'],
  ['disc of convergence', 'q31', 'The open disc |z| < R inside which a power series converges.', 'For Σ zⁿ the disc of convergence is |z| < 1.'],
  ['Taylor coefficient', 'q32', 'The number in front of zⁿ in the Taylor series of f about 0, equal to f⁽ⁿ⁾(0) ÷ n!.', 'The Taylor coefficient of z² in e^(3z) is 9 ÷ 2.'],
  ['Laurent series', 'q33', 'A series of powers of z that may include negative powers, which represents a function on an annulus.', 'e^(1 ÷ z) = 1 + z⁻¹ + z⁻² ÷ 2! + … for z ≠ 0.'],
  ['annulus', 'q33', 'The ring of points between two circles with the same centre, such as all z with 1 < |z| < 3.', '0 < |z| < 2 is an annulus with its inner circle shrunk to a point.'],
  ['principal part', 'q33', 'The terms of a Laurent series with negative powers.', 'The principal part of z⁻² + 3z⁻¹ + 5 + z is z⁻² + 3z⁻¹.'],
  ['singularity', 'q34', 'A point where a function is not analytic, for example because it has no value there.', '1 ÷ (z − 2) has a singularity at z = 2.'],
  ['removable singularity', 'q34', 'A singularity whose Laurent series has no negative powers, so the right value there makes the function analytic.', 'sin z ÷ z has a removable singularity at 0.'],
  ['pole', 'q34', 'A singularity whose Laurent series has finitely many negative powers; the most negative power (z − a)⁻ᵏ gives its order k.', '1 ÷ (z − 1)³ has a pole of order 3 at z = 1.'],
  ['simple pole', 'q34', 'A pole of order 1: the most negative power in the Laurent series is (z − a)⁻¹.', '1 ÷ (z + 4) has a simple pole at z = −4.'],
  ['essential singularity', 'q34', 'A singularity whose Laurent series has infinitely many negative powers.', 'e^(1 ÷ z) has an essential singularity at 0.'],
  ['residue', 'q35', 'The coefficient of (z − a)⁻¹ in the Laurent series of f about a point a.', 'The residue of 5 ÷ (z − 2) at z = 2 is 5.'],
  ['residue theorem', 'q37', 'The rule that ∮ f(z) dz once anticlockwise round a closed curve is 2πi times the sum of the residues inside it.', 'Round |z| = 3, ∮ dz ÷ (z − 1) = 2πi × 1.'],
  ['improper integral', 'q38', 'An integral over an infinite range, defined as the limit of integrals over longer and longer finite ranges.', '∫ dx ÷ (x² + 1) from −∞ to ∞ is an improper integral equal to π.'],
  ['upper half-plane', 'q38', 'The points of the complex plane with positive imaginary part.', '2i and 1 + i are in the upper half-plane; −i is not.'],
  ['argument principle', 'q40', 'The rule that (1 ÷ 2πi) ∮ f′ ÷ f dz equals the zeros minus the poles inside the curve, counted with their orders.', 'z² ÷ (z − 5) on |z| = 1 gives 2 − 0 = 2.'],
 ]
};
})();
