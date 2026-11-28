# Discrete mathematics pack (`disc`) — concept plan

Pack id `disc`, name "Discrete mathematics", 40 learn missions (`q01`–`q40`) + 120 practice (`qNNb/c/d`) = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "disc"), in the shape of `docs/CALC1-PLAN.md`.

**Player:** an adult who has finished Foundations (arithmetic, fractions, percent, algebra, equations, coordinates and ordered pairs, functions and function notation, exponent rules, Σ for sums, quadratics and factoring) and nothing more. Logic and probability are not assumed: no truth tables, no ∀ or ∃, no proofs (those belong to `logic`). This pack owns sets and counting; `prob` re-teaches only the little it needs. Number theory and graph theory have their own later packs (`number`, `graph`), so this pack gives them one shared introductory chapter (chapter 7: two missions on remainders, three on graphs). Every word and symbol below is taught in the mission that first uses it: set, element, ∈, braces { }, cardinality |A|, empty set ∅, subset ⊆, universal set U, union ∪, intersection ∩, complement Aᶜ, difference A \ B, Venn diagram, Cartesian product A × B, function f: A → B, domain, codomain, image, range, one-to-one (injective), onto (surjective), bijection, additive principle, multiplicative principle, factorial n!, permutation P(n, k), combination C(n, k) ("n choose k"), Pascal's triangle, bit string, binomial coefficient, binomial theorem, complement counting, stars and bars, inclusion–exclusion, derangement, sequence, term aₙ, closed formula, recursive definition, recurrence relation, initial condition, Fibonacci numbers, arithmetic and geometric sequence, common difference, common ratio, finite differences, characteristic equation, generating function, divides, quotient, remainder, mod, congruent ≡, graph, vertex, edge, degree, handshake lemma, tree, Euler path, Euler circuit.

**Setting:** the Kepler outpost has a Logistics Depot now: crates to sort into bins, codes to assign, crews to pick, stock that grows each week and roads between the domes. Mira keeps the depot ledger and wants every "how many ways?" answered exactly, without listing them all.

**Sources:** Levin, Discrete Mathematics: An Open Introduction, 3rd edition (Levin), `https://discrete.openmathbooks.org/dmoi3/<page>.html`, title form `Levin, Discrete Mathematics: An Open Introduction — 1.3 Combinations and Permutations`; and OpenStax Contemporary Mathematics, chapter 1 Sets (CM), `https://openstax.org/books/contemporary-mathematics/pages/<slug>`, title form `OpenStax Contemporary Mathematics — 1.5 Set Operations with Three Sets`. Publisher words: `Levin` or `OpenStax` (the pack's `sourceRule` must accept both). All 20 URLs below were opened on 2026-11-27; none is UNVERIFIED.

| Ch | Section title (concepts) | URL |
|---|---|---|
| 1 | CM 1.1 Basic Set Concepts (q01); Levin 0.3 Sets (q01–q04, q06); CM 1.4 Set Operations with Two Sets (q03, q04); CM 1.5 Set Operations with Three Sets (q05) | https://openstax.org/books/contemporary-mathematics/pages/1-1-basic-set-concepts https://discrete.openmathbooks.org/dmoi3/sec_intro-sets.html https://openstax.org/books/contemporary-mathematics/pages/1-4-set-operations-with-two-sets https://openstax.org/books/contemporary-mathematics/pages/1-5-set-operations-with-three-sets |
| 2 | Levin 0.4 Functions (q07, q08, q11); Levin 1.1 Additive and Multiplicative Principles (q09–q11) | https://discrete.openmathbooks.org/dmoi3/sec_intro-functions.html https://discrete.openmathbooks.org/dmoi3/sec_counting-addmult.html |
| 3 | Levin 1.3 Combinations and Permutations (q12–q14, q17); Levin 1.2 Binomial Coefficients (q15, q16) | https://discrete.openmathbooks.org/dmoi3/sec_counting-combperm.html https://discrete.openmathbooks.org/dmoi3/sec_counting-binom.html |
| 4 | Levin 1.1 and 1.3 (q18); Levin 1.5 Stars and Bars (q19, q23); Levin 1.6 Advanced Counting Using PIE (q20–q23) | https://discrete.openmathbooks.org/dmoi3/sec_stars-and-bars.html https://discrete.openmathbooks.org/dmoi3/sec_advPIE.html |
| 5 | Levin 2.1 Describing Sequences (q24, q28); Levin 2.2 Arithmetic and Geometric Sequences (q25, q26); Levin 2.3 Polynomial Fitting (q27); Levin 2.4 Solving Recurrence Relations (q28) | https://discrete.openmathbooks.org/dmoi3/sec_seq_intro.html https://discrete.openmathbooks.org/dmoi3/sec_seq-arithgeom.html https://discrete.openmathbooks.org/dmoi3/sec_polyfit.html https://discrete.openmathbooks.org/dmoi3/sec_recurrence.html |
| 6 | Levin 2.4 (q30–q32); Levin 5.1 Generating Functions (q33); Levin 1.4 Combinatorial Proofs (q34) | https://discrete.openmathbooks.org/dmoi3/sec_addtops-genfun.html https://discrete.openmathbooks.org/dmoi3/sec_comb-proofs.html |
| 7 | Levin 5.2 Introduction to Number Theory (q35, q36); Levin 4.1 Definitions (q37); Levin 4.2 Trees (q38); Levin 4.5 Euler Paths and Circuits (q39) | https://discrete.openmathbooks.org/dmoi3/sec_addtops-numbth.html https://discrete.openmathbooks.org/dmoi3/sec_gt-intro.html https://discrete.openmathbooks.org/dmoi3/sec_trees.html https://discrete.openmathbooks.org/dmoi3/sec_paths.html |

| Ch | Name | Ids | Tier, XP | Sector | Purpose ("we have to …") | Landmark |
|---|---|---|---|---|---|---|
| 1 | Sets and Venn diagrams | q01–q06 | Basic, 100 | Store Rooms | know exactly what is in every bin | Bin racks |
| 2 | Functions and counting principles | q07–q11 | Basic, 100 | Labelling Bay | give every crate a label and every code a meaning | Tag post |
| 3 | Arrangements and selections | q12–q17 | Intermediate, 150 | Crew Office | count every way to pick and order a crew | Roster board |
| 4 | Counting with conditions | q18–q23 | Intermediate, 150 | Packing Floor | pack crates under every rule at once | Crate stack |
| 5 | Sequences | q24–q29 | Intermediate, 150 | Stock Yard | forecast stock that grows by a rule | Pipe stacks |
| 6 | Recurrences and generating functions | q30–q34 | Advanced, 200 | Tiling Works | count patterns that are built one step at a time | Tiled arch |
| 7 | First steps into numbers and networks | q35–q40 | Advanced, 200 | Road Office | number the codes and map the roads between the domes | Junction beacon |

Blurbs: 1 Sets, subsets, union, intersection, complement, Venn diagrams and pairs. 2 Functions between finite sets, one-to-one and onto, and the two counting principles. 3 Factorials, permutations, combinations, Pascal's triangle and the binomial theorem. 4 Counting the complement, stars and bars, inclusion–exclusion and derangements. 5 Closed and recursive formulas, arithmetic and geometric sequences, finite differences. 6 Solving recurrences, counting tilings, generating functions and counting two ways. 7 Remainders and clock arithmetic, graphs, trees and Euler paths.

## Concepts (one learn mission each; section in brackets; ← prerequisites)

1. q01 Sets, elements and cardinality [CM 1.1, Levin 0.3] ← none
   Asked: |A| for a set given by a list or a rule ("multiples of k from a to b"). Varies: k, a, b.
2. q02 Subsets and the empty set [Levin 0.3] ← q01
   Asked: 1 if A ⊆ B or 0 if not, then the number of elements of B not in A. Varies: the two lists.
3. q03 Union and intersection [CM 1.4, Levin 0.3] ← q01
   Asked: |A ∪ B| and |A ∩ B| for two listed bins. Varies: lists.
4. q04 Complement, difference and |A ∪ B| = |A| + |B| − |A ∩ B| [CM 1.4, Levin 0.3] ← q03
   Asked: the number of crates in neither bin, then |A \ B|. Varies: |U|, |A|, |B|, |A ∩ B|.
5. q05 Three-set Venn diagrams [CM 1.5] ← q04
   Asked: the count in exactly one set, then in none. Varies: the seven region totals given as survey figures.
6. q06 Cartesian products [Levin 0.3] ← q03
   Asked: |A × B|, then the number of pairs (a, b) with a + b equal to a target. Varies: A, B, target.
7. q07 Functions between finite sets: domain, codomain, image [Levin 0.4] ← q01
   Asked: f(x) for two inputs from an arrow table, then the size of the range. Varies: table.
8. q08 One-to-one and onto [Levin 0.4] ← q07
   Asked: 1 or 0 for one-to-one, then the number of codomain elements no input reaches. Varies: table.
9. q09 The additive principle [Levin 1.1] ← q04
   Asked: ways to choose one item from separate shelves. Varies: shelf sizes.
10. q10 The multiplicative principle [Levin 1.1] ← q09, q06
   Asked: the number of crate codes of letter, digit, digit with stated restrictions. Varies: alphabet size, restrictions.
11. q11 Chapter review: labels and codes [Levin 0.4, 1.1] ← q08, q10
   Asked: a code count and a range size. Varies: rules.
12. q12 Permutations and factorials [Levin 1.3] ← q10
   Asked: n! orders of n crates on a shelf (n ≤ 9, "without commas" if 1000 or more). Varies: n.
13. q13 Partial permutations P(n, k) [Levin 1.3] ← q12
   Asked: the ways to fill k ranked jobs from n crew. Varies: n, k.
14. q14 Combinations C(n, k) = n! ÷ (k!(n − k)!) [Levin 1.3] ← q13
   Asked: the number of k-person crews from n. Varies: n ≤ 15, k.
15. q15 Pascal's triangle, bit strings and the 2ⁿ subsets [Levin 1.2] ← q14, q02
   Asked: the number of n-bit strings with exactly k ones, then the number of subsets of an n-element set. Varies: n, k.
16. q16 The binomial theorem [Levin 1.2] ← q15
   Asked: the coefficient of xᵏyⁿ⁻ᵏ in (ax + by)ⁿ. Varies: a, b small, n ≤ 7, k.
17. q17 Chapter review: order or no order? [Levin 1.3] ← q14, q16
   Asked: 1 for permutation or 2 for combination, then the count. Varies: story.
18. q18 Counting the complement: "at least one" [Levin 1.1, 1.3] ← q14
   Asked: crews with at least one engineer, as all crews minus crews with none. Varies: group sizes, k.
19. q19 Stars and bars [Levin 1.5] ← q14
   Asked: ways to share n identical crates among k domes, with or without "each gets at least one". Varies: n, k.
20. q20 Inclusion–exclusion with three sets [Levin 1.6] ← q05, q14
   Asked: the number of codes from 1 to N that are multiples of none of a, b, c. Varies: N, a, b, c (pairwise without common factors).
21. q21 Counting onto functions [Levin 1.6] ← q20, q08
   Asked: the number of ways to give n distinct jobs to k crews so every crew gets one. Varies: n ≤ 6, k ≤ 4.
22. q22 Derangements [Levin 1.6] ← q20
   Asked: the ways to return n labelled crates so none is in its own bin. Varies: n ≤ 7.
23. q23 Chapter review: packing under rules [Levin 1.5, 1.6] ← q19, q22
   Asked: a stars-and-bars count with an upper limit, by inclusion–exclusion. Varies: n, k, limit.
24. q24 Sequences: closed and recursive formulas [Levin 2.1] ← q07
   Asked: a₅ from a recursive rule and a₁₀ from a closed one. Varies: rules.
25. q25 Arithmetic sequences and their sums [Levin 2.2] ← q24
   Asked: the nth term and the sum of the first n terms. Varies: first term, difference, n.
26. q26 Geometric sequences and their sums [Levin 2.2] ← q24
   Asked: the nth term and the sum of the first n terms. Varies: first term, ratio, n.
27. q27 Finite differences and polynomial fitting [Levin 2.3] ← q25
   Asked: the degree (the level where differences become constant), then the next term. Varies: polynomial of degree 2 or 3.
28. q28 Recurrence relations and the Fibonacci numbers [Levin 2.1, 2.4] ← q24
   Asked: a₈ from aₙ = c·aₙ₋₁ + d·aₙ₋₂ and its initial conditions. Varies: c, d, a₀, a₁.
29. q29 Chapter review: forecasting stock [Levin 2.1–2.3] ← q26, q27, q28
   Asked: next terms and a partial sum for three stock rules. Varies: rules.
30. q30 Solving a recurrence by iteration [Levin 2.4] ← q28, q25
   Asked: the closed-formula value aₙ for aₙ = aₙ₋₁ + (linear in n), at a large n. Varies: rule, n.
31. q31 The characteristic root technique [Levin 2.4] ← q30
   Asked: the two roots, then a₁₂ from the closed formula. Varies: integer roots, initial conditions.
32. q32 Counting with recurrences: tilings and spaced-out bit strings [Levin 2.4] ← q28, q15
   Asked: the number of ways to tile a 1-by-n strip with 1- and 2-long tiles, or n-bit strings with no two 1s together. Varies: n, tile lengths.
33. q33 Generating functions: reading off a coefficient [Levin 5.1] ← q26, q16
   Asked: the coefficient of xᵏ in a product such as (1 + x + x²)(1 + x²)(1 + x)³: the ways to make k from given coins. Varies: factors, k.
34. q34 Counting one thing two ways [Levin 1.4] ← q15
   Asked: both sides of an identity such as C(n, k) = C(n − 1, k − 1) + C(n − 1, k) or a row sum of Pascal's triangle, at drawn n and k. Varies: identity, n, k.
35. q35 Divisibility, quotients and remainders [Levin 5.2] ← q01
   Asked: the quotient and the remainder when a is divided by b, negative a included. Varies: a, b.
36. q36 Clock arithmetic: mod and congruence [Levin 5.2] ← q35
   Asked: (a × b + c) mod m, or the day of the week N days on. Varies: a, b, c, m, N.
37. q37 Graphs, degrees and the handshake lemma [Levin 4.1] ← q01
   Asked: the number of roads from a list of junction degrees, or one missing degree. Varies: degree lists.
38. q38 Trees: v − 1 edges [Levin 4.2] ← q37
   Asked: the number of roads to link v domes with no loop, or the roads to remove from a connected network to leave a tree. Varies: v, edges.
39. q39 Euler paths and circuits [Levin 4.5] ← q37
   Asked: the number of odd-degree junctions, then 2 (circuit), 1 (path only) or 0 (neither). Varies: network.
40. q40 Realm review and bridge to Number theory and Graph theory [Levin 5.2, 4.5] ← q36, q39
   Asked: a remainder, an edge count and an Euler code for one depot plan. Varies: plan.

## Answers
Numbers only: almost every answer is a count, which is whole and exact (tolerance 0.01). Large counts are drawn below 1000 where possible, and otherwise the prompt says "without commas". A yes/no question is typed as 1 or 0; a choice (permutation or combination, Euler type) is a code from a list in the prompt. A set is never an answer: ask for its size or for the count of a region. Generators vary the set lists and rules, n and k, the restrictions, the recurrence coefficients and the networks (drawn as adjacency or degree lists).

## Ranks, achievements, copy
Ranks: OBSERVER, STOCK TAKER, LABELLER, ROSTER CLERK, PACKER, QUARTERMASTER, PATTERN MAKER, DEPOT CHIEF, MASTER OF COUNTING.
Achievements: "Every way counted" (`disc-done`, all 40 concepts); "The whole ledger" (`disc-master`, all 160).
Home title: "Everything here can be counted.<br><em>Learn to count it cleverly.</em>"
First visit (Mira): "Welcome back. The depot is overflowing with crates, codes, crews and roads, and nobody knows how many ways there are to arrange them. We begin by listing what is in one bin; everything you need you learned in Foundations."
First button: "Open the first bin". All done: "You did it. The depot ledger is complete, and every count in it is exact. Number theory and Graph theory each pick up a thread from the Road Office."
Must-have glossary terms: set, element, cardinality, subset, union, intersection, function, one-to-one, onto, permutation, combination, factorial, recurrence relation, graph.
