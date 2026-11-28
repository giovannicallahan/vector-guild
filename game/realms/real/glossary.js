/* Real analysis glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['real'] = {
 required: ['supremum', 'infimum', 'Archimedean property', 'triangle inequality', 'countable', 'convergent sequence', 'Cauchy sequence', 'absolute convergence', 'continuous', 'uniformly continuous', 'Lipschitz constant', 'Riemann integrable', 'uniform convergence', 'metric'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['upper bound', 'q01', 'A number that every member of a set is less than or equal to.', '5 is an upper bound of {1, 3, 4}, and so is 100.'],
  ['bounded above', 'q01', 'Said of a set that has at least one upper bound.', '{1 − 1/n : n ∈ ℕ} is bounded above by 1; ℕ itself is not bounded above.'],
  ['supremum', 'q01', 'The least upper bound of a set, written sup S: an upper bound that no smaller number improves on, which need not be in the set.', 'sup {1 − 1/n : n ∈ ℕ} = 1, which is not a member.', ['sup', 'least upper bound']],
  ['least-upper-bound property', 'q01', 'The fact that every non-empty set of real numbers that is bounded above has a supremum in the real numbers.', 'The set of x with x² < 2 has supremum √2, a real number.', ['completeness']],
  ['lower bound', 'q02', 'A number that every member of a set is greater than or equal to.', '0 is a lower bound of {1/n : n ∈ ℕ}, and so is −3.'],
  ['infimum', 'q02', 'The greatest lower bound of a set, written inf S, which is attained when it belongs to the set and is then the minimum.', 'inf {1/n : n ∈ ℕ} = 0, not attained; inf [2, 5) = 2, attained.', ['inf', 'greatest lower bound']],
  ['Archimedean property', 'q03', 'The fact that for any x > 0 and any real y some natural number n has nx > y; so 1/n can be made smaller than any ε > 0.', '1/n < 0.03 first holds at n = 34.'],
  ['triangle inequality', 'q04', 'The rule |a + b| ≤ |a| + |b|: the size of a sum is at most the sum of the sizes.', '|3 + (−5)| = 2 is at most 3 + 5 = 8.'],
  ['bounded function', 'q05', 'A function whose values on a set all lie between two fixed numbers, so that |f(x)| ≤ B for some B.', 'x² is a bounded function on (0, 3), with values between 0 and 9.'],
  ['countable', 'q06', 'Said of a set that is finite or can be listed as a first, second, third member and so on, every member at some position.', 'ℕ × ℕ is countable: list the pairs along diagonals.'],
  ['uncountable', 'q06', 'Said of a set that is not countable: no list, however long, contains every member.', 'Cantor showed that ℝ is uncountable.'],
  ['convergent sequence', 'q07', 'A sequence with a limit L: for every ε > 0 some N gives |xₙ − L| < ε for every n ≥ N.', '1/n is a convergent sequence with limit 0.', ['converges', 'convergent']],
  ['divergent', 'q07', 'Said of a sequence that has no limit.', 'The sequence (−1)ⁿ, which keeps jumping between −1 and 1, is divergent.'],
  ['monotone', 'q08', 'Said of a sequence that is increasing (each term at least the one before) or decreasing (each term at most the one before).', '1 − 1/n is monotone: it increases.'],
  ['recursively defined sequence', 'q08', 'A sequence given by a first term and a rule that makes each term from the one before.', 'x₁ = 1 and xₙ₊₁ = (xₙ + 6) ÷ 2 give 1, 3.5, 4.75, ….'],
  ['squeeze lemma', 'q09', 'If aₙ ≤ xₙ ≤ bₙ and aₙ and bₙ both converge to L, then xₙ converges to L as well.', 'sin(n) ÷ n lies between −1 ÷ n and 1 ÷ n, so it tends to 0.'],
  ['subsequence', 'q10', 'Some of the terms of a sequence, taken in their original order, such as every other term.', 'x₂, x₄, x₆, … is a subsequence of x₁, x₂, x₃, ….'],
  ['limit superior', 'q10', 'For a bounded sequence, the limit of the sups of its tails: the largest limit any subsequence can have.', 'For (−1)ⁿ the limit superior is 1.', ['limsup']],
  ['limit inferior', 'q10', 'For a bounded sequence, the limit of the infs of its tails: the smallest limit any subsequence can have.', 'For (−1)ⁿ the limit inferior is −1.', ['liminf']],
  ['Bolzano–Weierstrass theorem', 'q10', 'The theorem that every bounded sequence of real numbers has a convergent subsequence.', '(−1)ⁿ diverges, but its even terms form a subsequence converging to 1.'],
  /* q11–q20 (missions-b.js) */
  ['Cauchy sequence', 'q12', 'A sequence whose terms all end up close to each other: for every ε > 0 there is an N past which any two terms differ by less than ε.', 'xₙ = 1 ÷ n is Cauchy: from n = 100 on, any two terms differ by less than 0.01.'],
  ['partial sum', 'q13', 'The sum of the first N terms of a series; the series converges exactly when its partial sums converge.', 'For 1 + 1 ÷ 2 + 1 ÷ 4 + …, the partial sum s₃ is 1.75.'],
  ['Cauchy criterion', 'q13', 'A series converges exactly when, far enough out, every stretch of consecutive terms adds up to a total whose size (absolute value) is less than any chosen ε.', 'Every stretch of Σ 1 ÷ 2ⁿ after the 10th term adds up to less than 0.001 in size.'],
  ['p-series', 'q14', 'A series Σ 1 ÷ nᵖ for a fixed power p; it converges when p > 1 and diverges when p ≤ 1.', 'Σ 1 ÷ n² is a p-series with p = 2, so it converges.'],
  ['absolute convergence', 'q14', 'A series converges absolutely when the series of the sizes of its terms, Σ |aₙ|, converges; then the series itself converges.', 'Σ (−1)ⁿ ÷ n² converges absolutely, because Σ 1 ÷ n² converges.'],
  ['conditional convergence', 'q14', 'A series converges conditionally when it converges but the series of the sizes of its terms diverges.', '1 − 1 ÷ 2 + 1 ÷ 3 − … converges, but 1 + 1 ÷ 2 + 1 ÷ 3 + … does not.'],
  ['comparison test', 'q15', 'If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ.', '1 ÷ (2ⁿ + 1) < 1 ÷ 2ⁿ, so Σ 1 ÷ (2ⁿ + 1) is at most 1.'],
  ['ratio test', 'q16', 'If |aₙ₊₁ ÷ aₙ| tends to L, the series converges absolutely when L < 1 and diverges when L > 1; L = 1 decides nothing.', 'For aₙ = 2ⁿ ÷ 3ⁿ the ratio is 2/3, so Σ aₙ converges.'],
  ['root test', 'q16', 'If the n-th root of |aₙ| tends to L, the series converges absolutely when L < 1 and diverges when L > 1.', 'The n-th root of 2ⁿ ÷ 5ⁿ is 2/5, so the series converges.'],
  ['alternating series test', 'q16', 'A series whose signs alternate and whose term sizes decrease to 0 converges, and its sum lies within the next term of every partial sum.', '1 − 1 ÷ 2 + 1 ÷ 3 − … converges, and s₁₀ is within 1 ÷ 11 of its sum.'],
  ['cluster point', 'q18', 'A number c is a cluster point of a set when the set has points other than c as close to c as we like.', '0 is a cluster point of {1 ÷ n : n ∈ ℕ}, though 0 is not in the set.'],
  ['continuous', 'q19', 'f is continuous at c when for every ε > 0 there is a δ > 0 with |f(x) − f(c)| < ε whenever |x − c| < δ.', 'f(x) = 2x + 1 is continuous at 3: take δ = ε ÷ 2.'],
  ['sequential continuity', 'q19', 'The test that f is continuous at c exactly when f(xₙ) → f(c) for every sequence xₙ that converges to c.', 'xₙ = 3 + 1 ÷ n tends to 3, so 2xₙ + 1 must tend to 7.'],
  ['one-sided limit', 'q20', 'The number f(x) closes in on as x approaches c from one side only, from below for the left-hand limit and from above for the right-hand one.', 'For f(x) = |x| ÷ x at 0, the left-hand limit is −1 and the right-hand limit is 1.'],
  ['removable discontinuity', 'q20', 'A point where the limit of f exists but differs from the value f(c), or f(c) is missing; changing that one value would make f continuous.', 'f(x) = x for x ≠ 2 and f(2) = 5 has a removable discontinuity at 2.'],
  ['jump discontinuity', 'q20', 'A point where both one-sided limits of f exist but are different, so the graph jumps from one level to another.', 'f(x) = 0 for x < 0 and 1 for x ≥ 0 has a jump discontinuity at 0.'],
  /* q21–q30 (missions-c.js) */
  ['intermediate value theorem', 'q21', 'If f is continuous on [a, b], it takes every value between f(a) and f(b) somewhere in the interval.', 'x³ − 20 is negative at 2 and positive at 3, so it is 0 somewhere between.'],
  ['extreme value theorem', 'q21', 'A function that is continuous on a closed bounded interval reaches a largest and a smallest value on it.', 'x² on [−1, 2] reaches its largest value 4 at x = 2 and its smallest value 0 at x = 0.'],
  ['bisection', 'q21', 'Finding a root by halving an interval again and again, each time keeping the half at whose ends the function has opposite signs.', '[2, 3], then [2.5, 3], then [2.5, 2.75].'],
  ['uniformly continuous', 'q22', 'Said of f when for every ε > 0 one δ > 0 works at every point at once: |x − y| < δ gives |f(x) − f(y)| < ε.', 'x² on [0, 5] is uniformly continuous: δ = ε ÷ 10 works everywhere.'],
  ['Lipschitz constant', 'q22', 'A number K with |f(x) − f(y)| ≤ K|x − y| for all x and y in the set; then δ = ε ÷ K works everywhere.', 'K = 10 is a Lipschitz constant for x² on [0, 5].'],
  ['difference quotient', 'q24', 'The slope (f(c + h) − f(c)) ÷ h of the line from the point at c to the point at c + h, for h not 0.', 'For f(x) = x² at c = 3 it is 6 + h.'],
  ['differentiable', 'q24', 'f is differentiable at c when its difference quotient at c has a limit as h approaches 0; that limit is f′(c).', '|x| is not differentiable at 0: from the left the quotient is −1, from the right 1.'],
  ['Rolle’s theorem', 'q25', 'If f is continuous on [a, b], differentiable between a and b, and f(a) = f(b), then f′(c) = 0 for some c strictly between them.', 'x² − 4x on [0, 4] has f′(2) = 0.', ['Rolle\'s theorem']],
  ['mean value theorem', 'q25', 'If f is continuous on [a, b] and differentiable between, then f′(c) = (f(b) − f(a)) ÷ (b − a) for some c strictly between a and b.', 'x³ on [−1, 2] has average slope 3, and f′(1) = 3.'],
  ['Taylor remainder', 'q27', 'The error f(x) − Pₙ(x) left when f is replaced by its Taylor polynomial of degree n.', 'For eˣ at x = 1 with degree 4 it is at most 3 ÷ 5! = 1/40.'],
  ['Lagrange form', 'q27', 'The form f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × (x − x₀)ⁿ⁺¹ of the Taylor remainder, for some c between x₀ and x.', 'For sin x about 0 it is at most |x|ⁿ⁺¹ ÷ (n + 1)!.'],
  ['inverse function', 'q28', 'The function f⁻¹ that undoes f: f⁻¹(y) is the one x with f(x) = y.', 'For f(x) = x³ + x, f⁻¹(10) = 2.'],
  ['partition', 'q30', 'A finite list of points a = x₀ < x₁ < … < xₙ = b that cuts the interval [a, b] into pieces.', '{0, 1, 3, 4} is a partition of [0, 4] into 3 pieces.'],
  ['mesh', 'q30', 'The length of the longest piece of a partition.', 'The partition {0, 1, 3, 4} has mesh 2.'],
  ['lower sum', 'q30', 'L(P, f): the sum over the pieces of a partition of the infimum of f on the piece times its length.', 'For 2x + 1 and P = {0, 1, 2, 4}, L(P, f) = 14.'],
  ['upper sum', 'q30', 'U(P, f): the sum over the pieces of a partition of the supremum of f on the piece times its length.', 'For 2x + 1 and P = {0, 1, 2, 4}, U(P, f) = 26.'],
  /* q31–q40 (missions-d.js) */
  ['Riemann integrable', 'q31', 'A bounded function on [a, b] is Riemann integrable when its lower and upper sums can be squeezed together, leaving one number between them: the integral.', 'x² on [1, 3]: U − L = 16 ÷ n for n equal pieces, smaller than any ε for n large.'],
  ['additivity', 'q32', 'The property that the integral over [a, c] equals the integral over [a, b] plus the integral over [b, c].', 'If ∫ from 0 to 6 is 36 and ∫ from 0 to 3 is 27, then ∫ from 3 to 6 is 9.'],
  ['monotonicity of the integral', 'q32', 'The property that f ≤ g on [a, b] makes the integral of f at most the integral of g.', '2 ≤ f ≤ 6 on [3, 6] gives 6 ≤ ∫ from 3 to 6 of f ≤ 18.'],
  ['fundamental theorem of calculus', 'q33', 'The theorem that F(x) = ∫ from a to x of f is continuous, and has F′(c) = f(c) wherever f is continuous at c.', 'For f = 2 everywhere, F(x) = 2x and F′(x) = 2.'],
  ['improper integral', 'q34', 'An integral over an endless interval, defined as the limit of the integral from a to c as c grows without bound.', 'The improper integral of 1 ÷ x² from 1 to infinity is 1.'],
  ['pointwise convergence', 'q35', 'Convergence of functions fₙ to f one input at a time: for each fixed x, the numbers fₙ(x) converge to f(x).', 'xⁿ on [0, 1] converges pointwise to 0 for x < 1 and to 1 at x = 1.'],
  ['uniform convergence', 'q36', 'Convergence of functions fₙ to f in which one N keeps |fₙ(x) − f(x)| < ε for every x at once.', 'x ÷ n on [0, 1] converges uniformly to 0, since the gap is at most 1 ÷ n.'],
  ['uniform norm', 'q36', 'The supremum of |g(x)| over the whole domain, written ‖g‖_u: the worst size g reaches anywhere.', 'The uniform norm of sin x on all real numbers is 1.'],
  ['Weierstrass M-test', 'q37', 'The test that a series of functions converges uniformly when each term satisfies |fₖ(x)| ≤ Mₖ for all x and the Mₖ have a finite sum.', 'cos(kx) ÷ 2ᵏ is at most 1 ÷ 2ᵏ in size, and those bounds sum to 1.', ['M-test']],
  ['interchange of limits', 'q37', 'Taking two limits in the other order, such as integrating a limit instead of taking the limit of integrals; uniform convergence makes it safe.', 'Under uniform convergence, the limit of the integrals of fₙ is the integral of the limit.'],
  ['radius of convergence', 'q38', 'The number ρ for a power series about a such that it converges when |x − a| < ρ and diverges when |x − a| > ρ.', 'The series of xᵏ ÷ 4ᵏ has radius of convergence 4.'],
  ['metric', 'q39', 'A rule d(x, y) giving a distance that is never negative, is 0 only for equal points, is symmetric and obeys the triangle inequality.', 'd(x, y) = |x − y| is a metric on the real numbers.'],
  ['metric space', 'q39', 'A set together with a metric on it, so that every pair of its points has a distance.', 'The plane with the euclidean metric is a metric space.'],
  ['open ball', 'q39', 'The set B(x, ρ) of all points at distance strictly less than ρ from the centre x.', 'In the real numbers, B(2, 1) is the interval of x with 1 < x < 3.'],
  ['taxicab metric', 'q39', 'The metric on the plane that adds the sizes of the two coordinate gaps, like a route along a grid.', 'From (0, 0) to (3, 4) the taxicab distance is 7.'],
  ['discrete metric', 'q39', 'The metric that puts every two different points at distance 1, and a point at distance 0 from itself.', 'In the discrete metric, d(2, 9) = 1 and d(5, 5) = 0.'],
 ]
};
})();
