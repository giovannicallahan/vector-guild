# Real analysis pack (`real`) — concept plan

Pack id `real`, name "Real analysis", 40 learn missions (`q01`–`q40`) + 120 practice (`qNNb/c/d`) = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "real", and §11 as written for calc1).

**Player:** an adult who has finished Foundations, Calculus 1, Calculus 2 and Logic and proof: limits, derivatives, integrals, sequences, series and their tests, Taylor polynomials; statements, truth values, "and", "or", "not", implication, quantifiers ∀ and ∃ and their negation, sets, ∈, ⊆, functions, proof by contradiction and by induction. Calculus taught limits by tables and intuition; this pack makes every promise exact. Radians throughout. New words and symbols, each taught in the mission that first uses it: ℕ, ℚ, ℝ, upper bound, lower bound, bounded, supremum sup, infimum inf, maximum and minimum of a set, completeness (least-upper-bound property), Archimedean property, absolute value as distance, triangle inequality, bounded function, countable, uncountable, enumeration, ε (epsilon), N for "from this term on", convergent and divergent sequence, tail, monotone (increasing, decreasing), recursively defined sequence, squeeze lemma, subsequence, limit superior limsup and limit inferior liminf, Bolzano–Weierstrass theorem, Cauchy sequence, Cauchy criterion for series, absolute and conditional convergence, cluster point, δ (delta), ε–δ limit, continuous at a point, sequential continuity, removable and jump discontinuity, extreme value theorem, intermediate value theorem, bisection, uniformly continuous, Lipschitz constant, differentiable, Rolle's theorem, mean value theorem, Taylor remainder (Lagrange form), inverse function, partition, mesh, lower sum L(P, f), upper sum U(P, f), Riemann integrable, additivity, monotonicity of the integral, integral test bounds, pointwise convergence, uniform convergence, uniform norm ‖f‖_u, Weierstrass M-test, interchange of limits, metric d(x, y), metric space, open ball.

**Setting:** the Kepler outpost has opened a Standards Laboratory, where every instrument, gauge and simulation must be certified to a stated tolerance before anyone relies on it. Mira is still the mentor, now signing certificates. Objects are calibration rods, signal logs, relay repeaters, thermostats, pressure gauges, fuel audits and the simulation core, and every promise is of the form "within ε, from this point on".

**Sources:** Jiří Lebl, *Basic Analysis I & II: Introduction to Real Analysis* (open, CC BY-SA), one web page per section. OpenStax has no real analysis book, so Lebl is the single source. URL pattern `https://www.jirka.org/ra/html/<file>.html`; a source title reads `Lebl, Basic Analysis — 2.4 Cauchy sequences` and contains the publisher word **Lebl**. All 26 pages below were opened on 2026-11-27 and checked for title and the concept named; none is UNVERIFIED.

| Concepts | Section title | URL |
|---|---|---|
| q06 | 0.3 Basic set theory (cardinality) | https://www.jirka.org/ra/html/sec_basicset.html |
| q01, q02, q03 | 1.2 The set of real numbers | https://www.jirka.org/ra/html/sec_setofreals.html |
| q04, q05 | 1.3 Absolute value and bounded functions | https://www.jirka.org/ra/html/sec_absval.html |
| q06 | 1.4 Intervals and the size of ℝ | https://www.jirka.org/ra/html/sec_intandsizeR.html |
| q07, q08, q11 | 2.1 Sequences and limits | https://www.jirka.org/ra/html/sec_seqsandlims.html |
| q08, q09, q11 | 2.2 Facts about limits of sequences | https://www.jirka.org/ra/html/sec_factslimsseqs.html |
| q10, q11 | 2.3 Limit superior, limit inferior, and Bolzano–Weierstrass | https://www.jirka.org/ra/html/sec_bw.html |
| q12 | 2.4 Cauchy sequences | https://www.jirka.org/ra/html/sec_cauchy.html |
| q13, q14, q15, q17 | 2.5 Series | https://www.jirka.org/ra/html/sec_series.html |
| q16, q17 | 2.6 More on series | https://www.jirka.org/ra/html/sec_moreonseries.html |
| q18 | 3.1 Limits of functions | https://www.jirka.org/ra/html/sec_limoffunc.html |
| q19, q20, q23 | 3.2 Continuous functions | https://www.jirka.org/ra/html/sec_cont.html |
| q21, q23 | 3.3 Extreme and intermediate value theorems | https://www.jirka.org/ra/html/sec_minmaxint.html |
| q22 | 3.4 Uniform continuity | https://www.jirka.org/ra/html/sec_unifcont.html |
| q24 | 4.1 The derivative | https://www.jirka.org/ra/html/sec_der.html |
| q25, q26, q29 | 4.2 Mean value theorem | https://www.jirka.org/ra/html/sec_mvt.html |
| q27, q29 | 4.3 Taylor’s theorem | https://www.jirka.org/ra/html/sec_taylor.html |
| q28 | 4.4 Inverse function theorem | https://www.jirka.org/ra/html/sec_ift.html |
| q30, q31 | 5.1 The Riemann integral | https://www.jirka.org/ra/html/sec_rint.html |
| q32 | 5.2 Properties of the integral | https://www.jirka.org/ra/html/sec_rintprop.html |
| q33 | 5.3 Fundamental theorem of calculus | https://www.jirka.org/ra/html/sec_ftc.html |
| q34 | 5.5 Improper integrals | https://www.jirka.org/ra/html/sec_impropriemann.html |
| q35, q36 | 6.1 Pointwise and uniform convergence | https://www.jirka.org/ra/html/sec_puconv.html |
| q37, q38, q40 | 6.2 Interchange of limits | https://www.jirka.org/ra/html/sec_liminter.html |
| q37 | 11.2 Swapping limits (Weierstrass M-test) | https://www.jirka.org/ra/html/sec_swaplim.html |
| q39, q40 | 7.1 Metric spaces | https://www.jirka.org/ra/html/sec_metric.html |

Missions are original, never copied from the book's examples or exercises.

## Chapters

| Ch | Name | Ids | Tier, XP | Sector | "we have to …" | Landmark | Blurb |
|---|---|---|---|---|---|---|---|
| 1 | The real line | q01–q06 | Basic, 100 | Calibration Bench | certify every reading the outpost relies on | Standard Rod | Bounds, the least upper bound, distances, and how many numbers there are. |
| 2 | Sequences | q07–q11 | Basic, 100 | Signal Log | know which readings settle down | Data Spire | The exact meaning of a limit, with ε and N, and the sequences that must converge. |
| 3 | Cauchy sequences and series | q12–q17 | Intermediate, 150 | Relay Station | guarantee that long chains of corrections settle | Repeater Mast | Settling without knowing the limit, and exact promises about endless sums. |
| 4 | Limits and continuity | q18–q23 | Intermediate, 150 | Thermostat Hall | promise that small input errors give small output errors | Thermal Regulator | ε–δ limits, continuity, its great theorems, and continuity that is uniform. |
| 5 | The derivative made precise | q24–q29 | Intermediate, 150 | Gauge Workshop | bound how far every gauge can drift | Gauge Tower | Differentiability, the mean value theorem, and guaranteed Taylor errors. |
| 6 | The Riemann integral | q30–q34 | Advanced, 200 | Fuel Audit | pin a total between two guaranteed bounds | Fuel Depot | Lower and upper sums, when they meet, and the integral's exact properties. |
| 7 | Sequences of functions | q35–q40 | Advanced, 200 | Simulation Hall | trust approximations that keep improving | Simulation Core | Pointwise and uniform convergence, swapping limits, and distance in general. |

## Concepts (one learn mission each; Lebl section in brackets; prerequisites after the arrow)

1. q01 Upper bounds and the supremum [1.2] ← [] — Asked: sup of a set such as {a − b/n : n ∈ ℕ}, then 1 if it is a maximum, 0 if not. Varies: a, b, set form.
2. q02 Infimum, and whether it is attained [1.2] ← q01 — Asked: inf, then 1 or 0 for attained. Varies: sets of fractions and intervals.
3. q03 The Archimedean property [1.2] ← q01 — Asked: the smallest n ∈ ℕ with 1/n < ε (or n·x > y). Varies: ε, x, y.
4. q04 Absolute value and the triangle inequality [1.3] ← q01 — Asked: the largest possible |a + b| given bounds on |a| and |b|, or the interval of x with |x − c| < r as two endpoints. Varies: bounds, c, r.
5. q05 Bounded functions: sup and inf over a set [1.3] ← q04, q02 — Asked: sup f and inf f on an interval. Varies: quadratic or rational f, interval.
6. q06 Countable sets [0.3, 1.4] ← q03 — Asked: the position of a pair (a, b) or a fraction in a stated diagonal listing; or the decimal digit Cantor's argument changes. Varies: pair, listing.
7. q07 The limit of a sequence with ε and N [2.1] ← q03 — Asked: the smallest N that works for a given ε. Varies: (an + b)/(cn + d), ε.
8. q08 Monotone bounded sequences and recursive limits [2.1, 2.2] ← q07, q01 — Asked: x₃, then the limit of x_(n+1) = g(xₙ). Varies: g, x₁.
9. q09 Limit laws and the squeeze lemma [2.2] ← q07 — Asked: the limit, then the N where the squeeze bound drops below ε. Varies: bounds, ε.
10. q10 Subsequences, limsup and liminf [2.3] ← q08 — Asked: limsup and liminf. Varies: (−1)ⁿ and periodic patterns with offsets.
11. q11 Chapter review: certifying a signal log [2.1–2.3] ← q09, q10 — Asked: a limit, an N, a limsup. Varies: as above.
12. q12 Cauchy sequences [2.4] ← q07 — Asked: the smallest N with |xₘ − xₙ| < ε for all m, n ≥ N. Varies: 1/n-type terms, ε.
13. q13 Series as limits of partial sums; the tail [2.5] ← q12 — Asked: a partial sum, then the size of the tail after N terms. Varies: geometric and telescoping series.
14. q14 Absolute and conditional convergence [2.5] ← q13 — Asked: 1 if absolutely convergent, 0 if only conditionally, then a partial sum. Varies: (−1)ⁿ/nᵖ.
15. q15 Comparison and p-series bounds [2.5] ← q14 — Asked: an upper bound on the sum from a comparison series. Varies: terms, comparison.
16. q16 Ratio, root and alternating series tests [2.6] ← q15 — Asked: the ratio limit as a fraction, then 1 or 0; or the terms needed for an alternating error below ε. Varies: terms, ε.
17. q17 Chapter review: a relay of corrections [2.5, 2.6] ← q16 — Asked: a test result and a bound. Varies: as above.
18. q18 ε–δ limits of functions [3.1] ← q07 — Asked: the largest δ that works for a given ε. Varies: linear f (exact δ), then quadratic near a point.
19. q19 Continuity by ε–δ and by sequences [3.2] ← q18 — Asked: f(xₙ) for a term of a given sequence, then the largest δ. Varies: f, point, ε.
20. q20 Discontinuities [3.2] ← q19 — Asked: the two one-sided limits, then a code (1 removable, 2 jump, 0 continuous). Varies: piecewise f.
21. q21 Extreme and intermediate value theorems; bisection [3.3] ← q19 — Asked: the number of halvings needed to trap a root within ε, then the interval after two steps. Varies: polynomial, interval, ε.
22. q22 Uniform continuity and Lipschitz constants [3.4] ← q21 — Asked: the smallest Lipschitz constant on an interval, then a δ that works everywhere. Varies: f, interval.
23. q23 Chapter review: certifying a thermostat [3.2–3.4] ← q20, q22 — Asked: a δ, a code, a constant. Varies: as above.
24. q24 The derivative as a limit; differentiability [4.1] ← q18 — Asked: the two one-sided difference-quotient limits, then 1 if differentiable, 0 if not. Varies: piecewise and |x − c| forms.
25. q25 Rolle's theorem and the mean value theorem [4.2] ← q24, q21 — Asked: the point c the theorem promises. Varies: polynomial f, interval.
26. q26 Bounds from the mean value theorem [4.2] ← q25 — Asked: the largest possible change |f(b) − f(a)| given a bound on |f′|. Varies: bound, interval.
27. q27 Taylor's theorem with remainder [4.3] ← q26 — Asked: the remainder bound for degree n, then the smallest n for accuracy ε. Varies: eˣ, sin x, point, ε.
28. q28 The derivative of an inverse function [4.4] ← q24 — Asked: (f⁻¹)′ at a value, as a fraction. Varies: increasing polynomial f.
29. q29 Chapter review: a drifting gauge [4.2, 4.3] ← q27, q28 — Asked: an MVT bound and a degree. Varies: as above.
30. q30 Partitions, lower and upper sums [5.1] ← q05 — Asked: L(P, f) and U(P, f) for a given partition. Varies: monotone f, partition points.
31. q31 Refining until the sums meet [5.1] ← q30 — Asked: U − L for n equal pieces, then the smallest n with U − L < ε. Varies: monotone f, ε.
32. q32 Properties of the integral: additivity and bounds [5.2] ← q30 — Asked: the lower and upper bounds m(b − a) and M(b − a), or a missing piece by additivity. Varies: f, intervals.
33. q33 The fundamental theorem made precise [5.3] ← q32, q24 — Asked: F(x) at a point for F(x) = ∫ₐˣ f, then 1 if F is differentiable at a jump of f, 0 if not. Varies: step f.
34. q34 Improper integrals and integral-test bounds [5.5] ← q33, q15 — Asked: lower and upper bounds on Σ 1/nᵖ from integrals, to 3 decimal places. Varies: p, N.
35. q35 Pointwise convergence [6.1] ← q07 — Asked: the limit function's value at two points. Varies: xⁿ, nx/(1 + nx) families.
36. q36 Uniform convergence and the uniform norm [6.1] ← q35, q05 — Asked: ‖fₙ − f‖_u for a given n, then the smallest n making it below ε. Varies: family, ε.
37. q37 Interchange of limits and the Weierstrass M-test [6.2, 11.2] ← q36, q15 — Asked: the limit of ∫ fₙ, or the M-test bound Σ Mₙ. Varies: family, bound series.
38. q38 Power series converge uniformly inside the radius [6.2] ← q37, q16 — Asked: the radius, then the M-test bound on a smaller interval. Varies: coefficients, interval.
39. q39 Metric spaces: distances and open balls [7.1] ← q04 — Asked: the distance between two points in the euclidean, taxicab, maximum or discrete metric, then 1 if a point lies in a given ball, 0 if not. Varies: points, metric, radius.
40. q40 Realm review and bridge to Complex analysis [6.2, 7.1] ← q38, q39 — Asked: a uniform bound, a radius, a distance in the plane. Varies: as above.

## Files

As in calc1 (§11): learn letters a q01–q10, b q11–q20, c q21–q30, d q31–q40; practice file N covers q(5N−4)…q(5N), N = 1…8.

## Answers

Numbers only; a proof, a set or a function is never an answer. A proof idea becomes a number: the N or δ that meets a given ε (the smallest one where a formula fixes it), a sup or inf, a bound, a count of steps or terms, a truth value typed as 1 or 0, a position in a listing, or a code listed in the prompt. Every 1/0 answer comes with a number that the same reasoning produces, so guessing cannot pass. "Smallest N" and "largest δ" questions are drawn only where the exact value has a closed form (linear and simple rational terms); elsewhere the prompt asks whether a given N or δ works (1 or 0) and for a value that checks it.

## Ranks, achievements, copy

Ranks (steps as calc1: `at` 0, 8, 24, 44, 68, 96, 128, 144, 160; `learnAt` 4, 10, 16, 22, 28, 34, 40): BENCH HAND, BOUND SETTER, SEQUENCE CLERK, SERIES AUDITOR, CONTINUITY INSPECTOR, GAUGE CERTIFIER, INTEGRAL AUDITOR, CHIEF ANALYST, MASTER OF ANALYSIS.

Achievements: "Within epsilon" (`real-done`, the 40 concepts); "Certified to the last digit" (`real-master`, all 160).

- homeTitle: `Close enough is not enough.<br><em>Learn to make every promise exact.</em>`
- firstVisit (Mira): "Welcome to the Standards Laboratory. Calculus told us what limits are; here we prove that a reading really does settle, and we say exactly how close and from when. We start at the calibration bench with the smallest number above a whole set of readings."
- beginFirst: "Calibrate the first rod"
- allDone: "You did it. Every gauge, sum and simulation at the outpost carries a certificate you can defend line by line. Complex analysis comes next, where the same exact promises are made in the plane."

Must-have glossary terms (`REAL`): supremum, infimum, Archimedean property, triangle inequality, countable, convergent sequence, Cauchy sequence, absolute convergence, continuous, uniformly continuous, Lipschitz constant, Riemann integrable, uniform convergence, metric.
