# Topology pack (`topo`) — concept plan

Pack id `topo`, name "Topology: shape without size", 40 learn + 120 practice = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "topo"); files split by letter a–d and practice files 1–8 exactly as `docs/CALC1-PLAN.md`.

**Player:** an adult who has finished Foundations, Calculus 1 and 2, Logic and proof and Real analysis (sequences and their limits, ε–δ continuity, open and closed intervals, sup and inf, the intermediate and extreme value theorems on [a, b]). No group theory and no complex numbers: the fundamental group is met only as "winding numbers add".
New words and symbols, each taught in the mission that first uses it: metric d(x, y), Euclidean, taxicab and maximum metrics, discrete metric, triangle inequality, ball B(x, r), open set, closed set, interior, closure, boundary, topology, topological space, discrete and indiscrete topology, basis, continuous (preimages of open sets), preimage f⁻¹, connected, component, cut point, homeomorphism, homeomorphic ≅, open cover, subcover, compact, quotient space, gluing, surface, sphere S², torus, disc, annulus, Möbius strip, Klein bottle, projective plane, boundary circle, cell division, Euler characteristic χ, gluing word, connected sum #, genus g, cross-cap, orientable, classification of surfaces, curvature k, angle excess, Gauss–Bonnet, elliptic, flat, hyperbolic, fundamental domain, loop, homotopy (deforming a loop), winding number, fundamental group, degree of a circle map, independent loops, fixed point.

**Setting:** the outpost's Shape Lab, where the crew builds things whose shape matters more than their size: inflatable domes, flexible cable looms, hull panels sewn edge to edge, a survey of the curved ground and the orbit ring round the planet.

**Sources:** Lebl, *Basic Analysis: Introduction to Real Analysis*, chapter 8 "Metric Spaces" on LibreTexts (`L`), and Hitchman, *Geometry with an Introduction to Cosmic Topology*, chapter 7 on LibreTexts (`H`). Neither covers general topological spaces or loops, so the open Wikibooks text *Topology* (`W`) supplies q07–q14 and q35–q37 and q40: three sources, one more than the brief prefers, because no single open text with stable section pages was found for all three parts (Morris's *Topology Without Tears* is a single PDF). URL patterns `L` = `https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.0N%3A_<Section>`, `H` = `https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.0N%3A_<Section>`, `W` = `https://en.wikibooks.org/wiki/Topology/<Page>`. A source title reads `Lebl, Introduction to Real Analysis (LibreTexts) — 8.2 Open and Closed Sets`, `Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.5 Surfaces` or `Wikibooks, Topology — Connectedness`; publisher words **LibreTexts** and **Wikibooks**. Every URL below was opened on 2026-11-27; none is UNVERIFIED (Lebl 8.6 returned 404 and is not cited).

| Concepts | Section title | URL |
|---|---|---|
| q01, q02, q03 | L 8.1 Metric Spaces | L/8.01%3A_Metric_Spaces |
| q02, q04, q05, q06, q12 | L 8.2 Open and Closed Sets | L/8.02%3A_Open_and_Closed_Sets |
| q15, q17 | L 8.4 Completeness and Compactness | L/8.04%3A_Completeness_and_Compactness |
| q10, q16, q17, q39 | L 8.5 Continuous Functions | L/8.05%3A_Continuous_Functions |
| q30 | H 7.1 Curvature | H/7.01%3A_Curvature |
| q31 | H 7.2 Elliptic Geometry with Curvature k > 0 | H/7.02%3A_Elliptic_Geometry_with_Curvature__k__0 |
| q31, q33 | H 7.4 The Family of Geometries (X_k, G_k) | H/7.04%3A_The_Family_of_Geometries__(_X_k__G_k_) |
| q19–q29, q38, q40 | H 7.5 Surfaces | H/7.05%3A_Surfaces |
| q32, q33 | H 7.6 Geometry of Surfaces | H/7.06%3A_Geometry_of_Surfaces |
| q18, q22, q34 | H 7.7 Quotient Spaces | H/7.07%3A_Quotient_Spaces |
| q07, q08, q11 | W Topological Spaces | https://en.wikibooks.org/wiki/Topology/Topological_Spaces |
| q09 | W Bases | https://en.wikibooks.org/wiki/Topology/Bases |
| q10, q11, q14 | W Continuity and Homeomorphisms | https://en.wikibooks.org/wiki/Topology/Continuity_and_Homeomorphisms |
| q12, q13 | W Connectedness | https://en.wikibooks.org/wiki/Topology/Connectedness |
| q15 | W Compactness | https://en.wikibooks.org/wiki/Topology/Compactness |
| q35, q36, q37, q40 | W The fundamental group | https://en.wikibooks.org/wiki/Topology/The_fundamental_group |

Notes: L 8.1 has the sum and maximum metrics on products but does not use the name "taxicab"; q01 introduces that name. W Connectedness does not define components; q12 takes them from L 8.2's connected sets.

| Ch | Name | Ids | Tier, XP | Sector | "we have to …" | Landmark | Blurb |
|---|---|---|---|---|---|---|---|
| 1 | Distance and open sets | q01–q06 | Basic, 100 | Survey Grid | measure distance the way each rover really travels | Grid beacon | Three ways to measure distance, balls, open and closed sets, interior and boundary. |
| 2 | Topological spaces | q07–q11 | Basic, 100 | Relay Network | say which places are near without a ruler | Relay node | Open sets without distance, closed sets, bases and continuous maps. |
| 3 | Connected and compact | q12–q17 | Intermediate, 150 | Cable Works | know when a cable is in one piece | Cable loom | Components, cut points, homeomorphisms, open covers and compact sets. |
| 4 | Gluing surfaces | q18–q23 | Intermediate, 150 | Fabric Bay | sew flat panels into closed hulls | Panel frame | Quotient spaces, the standard surfaces and the Euler characteristic. |
| 5 | Classifying surfaces | q24–q29 | Intermediate, 150 | Hull Gallery | name every hull shape we could ever build | Hull models | Connected sums, genus, cross-caps, orientability and the classification. |
| 6 | Curvature and shape | q30–q34 | Advanced, 200 | Observatory | tell the shape of our world from inside it | Star dome | Curvature, curved triangles, Gauss–Bonnet and fundamental domains. |
| 7 | Loops | q35–q40 | Advanced, 200 | Orbit Ring | count how often a path goes round | Orbit ring | Winding numbers, joining loops, circle maps, loops in graphs and fixed points. |

## Concepts (one learn mission each; section in brackets; "after" = prerequisites)

1. q01 Three ways to measure distance [L8.1] — after none — Asked: the Euclidean (2 decimal places), taxicab and maximum distances between two grid points; varies the points.
2. q02 Balls in different metrics [L8.1, L8.2] — after q01 — Asked: the grid points within taxicab distance r (2r² + 2r + 1) and within maximum distance r ((2r + 1)²); varies r 1–10.
3. q03 The metric rules [L8.1] — after q01 — Asked: the smallest and largest possible d(x, z) given d(x, y) and d(y, z), and a discrete-metric distance; varies.
4. q04 Open sets: room round every point [L8.2] — after q02 — Asked: the largest radius of a ball round x inside (a, b), and inside an open rectangle; varies.
5. q05 Interior, closure and boundary [L8.2] — after q04 — Asked: the number of boundary points of a union like [a, b) ∪ (c, d] ∪ {e}, and 1 or 0 for "open" and for "closed"; varies.
6. q06 Unions and intersections of open sets [L8.2] — after q05 — Asked: the end points of the intersection of three open intervals, and 1 or 0 for "the intersection of all (−1 ÷ k, a + 1 ÷ k) is open"; varies.
7. q07 Topologies on a finite set [W Topological Spaces] — after q06 — Asked: 1 or 0 for "this list of subsets is a topology", and the open sets of the discrete topology on n points (2ⁿ); varies the list, n.
8. q08 Closed sets and closure [W Topological Spaces] — after q07 — Asked: the number of closed sets and the size of the closure of a point; varies a topology on 3–5 points.
9. q09 Bases [W Bases] — after q07 — Asked: the number of open sets a basis generates on a 4–5 point set (all unions, with the empty set); varies the basis.
10. q10 Continuous maps [W Continuity and Homeomorphisms, L8.5] — after q08 — Asked: 1 or 0 for "f is continuous" (preimages of open sets are open) and the number of continuous maps between two tiny spaces; varies.
11. q11 Chapter review: the relay map [W Topological Spaces, W Continuity] — after q09, q10 — Asked: an open-set count, a closure size and a continuity check; varies.
12. q12 Connected sets and components [L8.2, W Connectedness] — after q05 — Asked: the components of a union of intervals, of a line with k points removed (k + 1) and of a plane with a circle removed (2); varies.
13. q13 Cut points [W Connectedness] — after q12 — Asked: the pieces left when the marked point is removed from a letter shape (T, X, Y, E, …) and the number of end points; varies the letter.
14. q14 Homeomorphisms: telling shapes apart [W Continuity and Homeomorphisms] — after q13 — Asked: how many letters of a word are homeomorphic to a given letter, using cut points and ends; varies the word.
15. q15 Open covers and compactness [L8.4, W Compactness] — after q04 — Asked: the fewest open intervals of length L covering [a, b] (⌊(b − a) ÷ L⌋ + 1), and 1 or 0 for "compact" (closed and bounded); varies a, b, L, the set.
16. q16 Continuous images of compact sets [L8.5] — after q15 — Asked: the largest and smallest values of a continuous f on [a, b] (the extreme value theorem); varies a quadratic or cubic f.
17. q17 Chapter review: one-piece cables [L8.4, L8.5] — after q14, q16 — Asked: a component count, a cover count and a largest value; varies.
18. q18 Gluing: quotient spaces [H7.7] — after q12 — Asked: the points the four corners of a square become, and the distinct edges left, after gluing by a given word; varies the word.
19. q19 The standard surfaces [H7.5] — after q18 — Asked: the boundary circles (disc 1, annulus 2, Möbius strip 1, pair of trousers 3) and 1 or 0 for "orientable"; varies the surface.
20. q20 Euler characteristic of a cell division [H7.5] — after q19 — Asked: V − E + F for a polyhedron or for an m × n square grid on a torus (0); varies.
21. q21 Graphs and surfaces with holes [H7.5] — after q20 — Asked: χ of a graph (V − E) and of a surface with b discs cut out (χ − b); varies.
22. q22 Surfaces from labelled polygons [H7.5, H7.7] — after q18, q20 — Asked: the vertex classes V, the edge pairs E and χ = V − E + 1 for a gluing word of 4–8 letters; varies the word.
23. q23 Chapter review: closing a hull [H7.5] — after q21, q22 — Asked: a boundary count and two Euler characteristics; varies.
24. q24 Connected sums [H7.5] — after q20 — Asked: χ(A # B) = χ(A) + χ(B) − 2 for listed surfaces; varies A, B.
25. q25 Genus [H7.5] — after q24 — Asked: χ = 2 − 2g for a given genus, or g from χ; varies g 0–12.
26. q26 Cross-caps [H7.5] — after q24 — Asked: χ = 2 − k for k cross-caps, or k from χ; varies k 1–12.
27. q27 Classification of surfaces [H7.5] — after q25, q26 — Asked: the cross-caps of a surface built from tori and projective planes (torus # projective plane = 3), and its χ; varies.
28. q28 Orientability from a gluing word [H7.5] — after q22, q27 — Asked: 1 or 0 for "orientable" (no letter appears twice in the same direction), χ, and the genus or cross-cap number; varies the word.
29. q29 Chapter review: naming every hull [H7.5] — after q28 — Asked: χ, orientability and genus or cross-cap number; varies.
30. q30 Curvature of a sphere [H7.1] — after q20 — Asked: k = 1 ÷ s² for a sphere of radius s, and s from k; varies s.
31. q31 Triangles on curved surfaces [H7.2, H7.4] — after q30 — Asked: the area (α + β + γ − π) ÷ k from the angles, or the angle sum from the area; varies k and the angles (2 decimal places).
32. q32 Gauss–Bonnet [H7.6] — after q31, q25 — Asked: the area of a surface of constant curvature from kA = 2πχ, in multiples of π (4(g − 1) for k = −1); varies g, k.
33. q33 Which geometry a surface allows [H7.4, H7.6] — after q32 — Asked: the sign of k typed 1, 0 or −1 from χ, and the area in multiples of π when k = −1; varies the surface, orientable or not.
34. q34 Fundamental domains [H7.7] — after q22, q33 — Asked: the corner angle of a regular 4g-gon whose corners glue to one point, as a fraction of π (1 ÷ 2g), and the copies meeting at a corner (4g); varies g.
35. q35 Loops and winding numbers [W The fundamental group] — after q12 — Asked: the winding number of a closed path round a point, from its signed crossings of a ray; varies the path.
36. q36 Joining loops: winding numbers add [W The fundamental group] — after q35 — Asked: the winding number of loop a then loop b, and of a run backwards; varies a, b.
37. q37 Wrapping maps of the circle [W The fundamental group] — after q36 — Asked: the degree n of θ ↦ nθ, the points that land on one point (|n|), and the winding of the image of a loop that goes round k times (nk); varies n, k.
38. q38 Independent loops in a graph [H7.5] — after q21, q35 — Asked: E − V + 1 = 1 − χ for a connected graph (letters, grids, wheels); varies.
39. q39 Fixed points [L8.5] — after q16 — Asked: the fixed point of a continuous map of [a, b] into itself, found by halving to 2 decimal places, and f there; varies f.
40. q40 Realm review and bridge to Complex analysis [W The fundamental group, H7.5] — after q37, q38 — Asked: the winding numbers of one loop round three marked points and their total; varies the loop.

Prerequisites go into each mission's `prereqs` (q01 has `[]`).

## Answers
Numbers only; a set, a space or a shape is never typed. Topology becomes a number through: a distance or radius, a count (open sets, components, boundary points, cover sizes, edge classes), an Euler characteristic, a genus or cross-cap number, a winding number or degree (negative allowed), an area or curvature (decimals to 2 places, or a multiple or fraction of π typed as that number), and a property typed 1 (true) or 0 (false). Every generator draws the points, intervals, finite topologies (from a stored list of valid and broken ones), gluing words (random pairings of 2–4 letters with random directions), surfaces and loops afresh and recomputes the answer.

## Ranks, achievements, copy
Ranks: GRID WALKER, RELAY KEEPER, CABLE TESTER, PANEL SEWER, HULL NAMER, SKY READER, LOOP TRACKER, SHAPE ANALYST, MASTER OF SHAPE.
Achievements: "Same shape, any size" (`topo-done`, all 40 concepts); "Every surface named" (`topo-master`, all 160).
Home title: "Stretch it, bend it, it stays the same.<br><em>Learn what shape really means.</em>"
First visit (Mira): "Welcome to the Shape Lab. Our domes inflate, our cables bend and our hull panels stretch, so the measurements we used to trust keep changing. We start with the question underneath all of it: what does it mean for two places to be close?"
First button: "Measure the first distance". All done: "You can now name every hull we could ever sew and count every loop round the ring. Complex analysis opens next at the Antenna Field, where winding numbers turn into integrals."

**Must-have glossary terms:** metric, open set, closed set, topology, continuous, homeomorphism, connected, compact, surface, Euler characteristic, genus, orientable, curvature, winding number.
