# Graph theory pack (`graph`) — concept plan

Pack id `graph`, name "Graph theory: networks", 40 learn + 120 practice = 160. Format: `docs/PACK-FORMAT.md` (every rule there applies; read "found" as "graph"); files split by letter a–d and practice files 1–8 exactly as `docs/CALC1-PLAN.md`.

**Player:** an adult who has finished Foundations and Discrete mathematics (sets, logic, counting with factorials and combinations C(n, k), induction, sequences). The Discrete plan may introduce a first graph; this pack re-teaches every graph word from the start, briefly where it is a recap.
New words and symbols, each taught in the mission that first uses it: graph, vertex, edge, adjacent, neighbour, loop, multigraph, simple graph, degree deg(v), handshake rule, complete graph K_n, cycle C_n, subgraph, complement, isomorphic, invariant, degree sequence, walk, trail, path, circuit, distance, connected, component, bridge, Euler circuit, Euler trail, eulerise, tree, leaf, forest, spanning tree, weighted graph, weight, minimum spanning tree, Kruskal's algorithm, Dijkstra's algorithm, Hamilton cycle, Hamilton path, travelling salesperson problem, brute force, nearest-neighbour method, Dirac's theorem, planar, face, Euler's formula V − E + F = 2, polyhedron, bipartite, K_{m,n}, colouring, chromatic number χ, matching, perfect matching, Hall's condition, directed graph, arc, network, source, sink, capacity, flow, cut, labelled tree, Cayley's formula, Prüfer code, clique, independent set, Ramsey number R(3, 3).

**Setting:** the outpost has spread into many domes, and Mira's Map Room plans every link between them on a survey table: tunnels, cables, rover roads, water pipes, crew rotas and circuit boards.

**Sources:** OpenStax *Contemporary Mathematics*, chapter 12 (`O`, `https://openstax.org/books/contemporary-mathematics/pages/<section-slug>`), and Keller and Trotter, *Applied Combinatorics* (`KT`, `https://www.rellek.net/book/<page>.html`). A source title reads `OpenStax Contemporary Mathematics — 12.5 Euler Circuits` or `Keller and Trotter, Applied Combinatorics — 5.5 Planar Graphs`; publisher words **OpenStax** and **Applied Combinatorics** (the pack's `sourceRule` must accept either). Every URL below was opened on 2026-11-27; none is UNVERIFIED. Levin's 4.1 was also opened but is not needed.

| Concepts | Section title | URL |
|---|---|---|
| q01, q02 | O 12.1 Graph Basics | https://openstax.org/books/contemporary-mathematics/pages/12-1-graph-basics |
| q02, q03, q04, q38 | O 12.2 Graph Structures | https://openstax.org/books/contemporary-mathematics/pages/12-2-graph-structures |
| q04, q05 | O 12.3 Comparing Graphs | https://openstax.org/books/contemporary-mathematics/pages/12-3-comparing-graphs |
| q06, q07, q28 | O 12.4 Navigating Graphs | https://openstax.org/books/contemporary-mathematics/pages/12-4-navigating-graphs |
| q09, q11 | O 12.5 Euler Circuits | https://openstax.org/books/contemporary-mathematics/pages/12-5-euler-circuits |
| q10 | O 12.6 Euler Trails | https://openstax.org/books/contemporary-mathematics/pages/12-6-euler-trails |
| q19, q23 | O 12.7 Hamilton Cycles | https://openstax.org/books/contemporary-mathematics/pages/12-7-hamilton-cycles |
| q22 | O 12.8 Hamilton Paths | https://openstax.org/books/contemporary-mathematics/pages/12-8-hamilton-paths |
| q20, q21, q23 | O 12.9 Traveling Salesperson Problem | https://openstax.org/books/contemporary-mathematics/pages/12-9-traveling-salesperson-problem |
| q12–q17 | O 12.10 Trees | https://openstax.org/books/contemporary-mathematics/pages/12-10-trees |
| q08, q13, q37 | KT 5.1 Basic Notation and Terminology for Graphs | https://www.rellek.net/book/s_graphs_intro.html |
| q22 | KT 5.3 Eulerian and Hamiltonian Graphs | https://www.rellek.net/book/s_graphs_eulerham.html |
| q27, q28, q29, q37 | KT 5.4 Graph Coloring | https://www.rellek.net/book/s_graphs_color.html |
| q24, q25, q26, q40 | KT 5.5 Planar Graphs | https://www.rellek.net/book/s_graphs_planar.html |
| q35, q36 | KT 5.6 Counting Labeled Trees | https://www.rellek.net/book/s_graphs_counting-trees.html |
| q39 | KT 11.2 Small Ramsey Numbers | https://www.rellek.net/book/s_ramsey_small.html |
| q16, q17 | KT 12.1 Minimum Weight Spanning Trees | https://www.rellek.net/book/s_graphalgorithms_min-wt-span.html |
| q32 | KT 12.2 Digraphs | https://www.rellek.net/book/s_graphalgorithms_digraphs.html |
| q18 | KT 12.3 Dijkstra's Algorithm for Shortest Paths | https://www.rellek.net/book/s_graphalgorithms_shortest-paths.html |
| q33, q34 | KT 13.2 Flows and Cuts | https://www.rellek.net/book/s_networkflow_flows-cuts.html |
| q30, q31 | KT 14.2 Matchings in Bipartite Graphs | https://www.rellek.net/book/s_flowapplications_bip-match.html |

Notes: O 12.7 counts a Hamilton cycle and its reverse as different, giving (n − 1)!; q19 asks for that count and for the count with reverses merged, and says which is which. O 12.10 covers spanning trees and n − 1 edges but not counting spanning trees; q15 counts them by choosing which edge to remove from each cycle. The torus count in q40 extends KT 5.5's Euler's formula and is taught as a preview.

| Ch | Name | Ids | Tier, XP | Sector | "we have to …" | Landmark | Blurb |
|---|---|---|---|---|---|---|---|
| 1 | Points and links | q01–q06 | Basic, 100 | Map Room | draw every link between the domes | Survey table | Vertices, edges, degrees, complete graphs, complements, isomorphism and walks. |
| 2 | Getting around | q07–q11 | Basic, 100 | Rover Depot | drive every road without doubling back | Route marker | Distance, components, Euler circuits and trails, and eulerising a road map. |
| 3 | Trees | q12–q17 | Intermediate, 150 | Cable Yard | connect every dome with the least cable | Cable spool | Trees, leaves, forests, spanning trees and Kruskal's algorithm. |
| 4 | Routes and tours | q18–q23 | Intermediate, 150 | Dispatch | plan the shortest tour of the outlying stations | Dispatch tower | Shortest paths, Hamilton cycles, the travelling salesperson and Dirac's theorem. |
| 5 | Planarity and colouring | q24–q29 | Intermediate, 150 | Circuit Shop | lay out circuits whose wires never cross | Circuit board | Euler's formula, planar limits, polyhedra, bipartite graphs and colouring. |
| 6 | Matching and flow | q30–q34 | Advanced, 200 | Pumping Station | push as much water as the pipes allow | Pump tower | Matchings, Hall's condition, directed paths, flows and cuts. |
| 7 | Counting structures | q35–q40 | Advanced, 200 | Archive | count every network we could ever build | Archive vault | Labelled trees, Prüfer codes, cliques, triangles and Ramsey's guarantee. |

## Concepts (one learn mission each; O = OpenStax 12, KT = Keller and Trotter; "after" = prerequisites)

1. q01 Vertices, edges and neighbours [O12.1] — after none — Asked: the number of edges in a listed network of 5–8 domes and the number of neighbours of one dome; varies the list.
2. q02 Degree and the handshake rule [O12.1, O12.2] — after q01 — Asked: the sum of the degrees, the number of edges, or one missing degree; varies the degree list.
3. q03 Complete graphs and cycles [O12.2] — after q02 — Asked: the edges of K_n (n(n − 1) ÷ 2) and of C_n, and the degree in each; varies n 3–40.
4. q04 Subgraphs and complements [O12.2, O12.3] — after q03 — Asked: the edges of the complement and the degree of v there (n − 1 − deg v); varies.
5. q05 Isomorphism and invariants [O12.3] — after q04 — Asked: 1 or 0 for "these two networks could be the same shape", from vertex, edge and degree counts; varies the pair.
6. q06 Walks, trails and paths [O12.4] — after q01 — Asked: the number of walks of length 2 from u to v (their common neighbours) and the number of paths of length 2 starting at u; varies.
7. q07 Distance [O12.4] — after q06 — Asked: the length of the shortest path from u to v and from u to w; varies a network of 6–9 vertices.
8. q08 Connected components [KT5.1] — after q07 — Asked: the number of components and the fewest new edges that join them all (components − 1); varies.
9. q09 Euler circuits [O12.5] — after q02, q08 — Asked: the number of odd-degree vertices and 1 or 0 for "an Euler circuit exists"; varies.
10. q10 Euler trails [O12.6] — after q09 — Asked: 1 or 0 for "an Euler trail exists" and the smaller label of a vertex where it must start; varies.
11. q11 Chapter review: eulerising a road map [O12.5] — after q10 — Asked: the fewest roads to drive twice and the extra distance on a grid of streets; varies grid size and lengths.
12. q12 Trees [O12.10] — after q08 — Asked: the edges of a tree on n vertices, or the vertices from the edges; varies n.
13. q13 Forests and leaves [KT5.1, O12.10] — after q12 — Asked: the edges of a forest of n vertices and c trees (n − c), and the leaves from the counts of higher degrees; varies.
14. q14 Spanning trees [O12.10] — after q13 — Asked: the edges to remove from a connected network to leave a spanning tree (E − V + 1); varies.
15. q15 Counting spanning trees [O12.10] — after q14 — Asked: the spanning trees of C_n (n) and of three routes of a, b, c edges between two hubs (ab + bc + ca); varies n, a, b, c.
16. q16 Minimum spanning trees: Kruskal [O12.10, KT12.1] — after q14 — Asked: the total weight of the cheapest spanning tree and the weight of the last edge added; varies weights on 5–7 vertices.
17. q17 Chapter review: the cable plan [O12.10, KT12.1] — after q15, q16 — Asked: a tree's edge count, a spanning-tree count and a minimum weight; varies all.
18. q18 Shortest weighted paths: Dijkstra [KT12.3] — after q07 — Asked: the shortest distance from s to t and to one other vertex; varies weights on 5–7 vertices.
19. q19 Hamilton cycles in complete graphs [O12.7] — after q03 — Asked: (n − 1)! cycles counting direction, and (n − 1)! ÷ 2 with reverses merged; varies n 4–9 ("without commas").
20. q20 Travelling salesperson: brute force [O12.9] — after q19 — Asked: the weight of the cheapest tour of 4 or 5 stations; varies the weight table.
21. q21 The nearest-neighbour method [O12.9] — after q20 — Asked: the nearest-neighbour tour weight from a given start and how much heavier it is than the best; varies.
22. q22 Hamilton paths and Dirac's theorem [O12.8, KT5.3] — after q19 — Asked: the smallest degree and 1 or 0 for "Dirac guarantees a Hamilton cycle" (smallest degree at least n ÷ 2); varies.
23. q23 Chapter review: the dispatch plan [O12.7, O12.9] — after q18, q21 — Asked: a shortest path and a tour weight; varies.
24. q24 Planar graphs and Euler's formula [KT5.5] — after q12 — Asked: the faces F = 2 − V + E of a connected plane drawing; varies V, E.
25. q25 The edge limit for planar graphs [KT5.5] — after q24 — Asked: the largest E for V vertices (3V − 6, or 2V − 4 with no triangles) and 1 or 0 for "could be planar"; varies.
26. q26 Polyhedra from Euler's formula [KT5.5] — after q25 — Asked: V, E and F when every face has p sides and q faces meet at each corner; varies (p, q) and prisms of n sides.
27. q27 Bipartite graphs and odd cycles [KT5.4] — after q07 — Asked: 1 or 0 for "bipartite" and the edges of K_{m,n} (mn); varies.
28. q28 Colouring and chromatic number [O12.4, KT5.4] — after q27 — Asked: χ of a cycle, wheel, complete or small drawn graph; varies n and the graph.
29. q29 Chapter review: scheduling by colouring [KT5.4] — after q26, q28 — Asked: the fewest exam slots for a conflict network and its number of faces; varies.
30. q30 Matchings in bipartite graphs [KT14.2] — after q27 — Asked: the size of a largest matching of crew to tasks; varies the compatibility list.
31. q31 Hall's condition [KT14.2] — after q30 — Asked: the number of neighbours of a given set S and 1 or 0 for "a perfect matching exists"; varies.
32. q32 Directed graphs: counting routes [KT12.2] — after q06 — Asked: the number of directed paths from s to t in a one-way layered network; varies the arcs.
33. q33 Flows and cuts [KT13.2] — after q32 — Asked: the value of a given flow and the capacity of a given cut; varies capacities.
34. q34 Maximum flow equals minimum cut [KT13.2] — after q33 — Asked: the maximum flow of a 5–6 vertex network (found from its smallest cut); varies.
35. q35 Labelled trees: Cayley's formula [KT5.6] — after q12 — Asked: n^(n−2) labelled trees for n 3–8 ("without commas"); varies n.
36. q36 Prüfer codes [KT5.6] — after q35 — Asked: the degree of vertex v from its code (appearances + 1) and the first leaf removed; varies the code.
37. q37 Cliques and independent sets [KT5.1, KT5.4] — after q28 — Asked: the clique number and independence number (⌊n ÷ 2⌋ for C_n); varies.
38. q38 Counting triangles and cliques [O12.2] — after q37 — Asked: the triangles in K_n (C(n, 3)) and the k-cliques C(n, k); varies n, k.
39. q39 Ramsey's guarantee [KT11.2] — after q38 — Asked: the fewest same-colour links at one vertex of a two-colour K_n (⌈(n − 1) ÷ 2⌉) and 1 or 0 for "a one-colour triangle is guaranteed" (n ≥ 6); varies n.
40. q40 Realm review and bridge to Topology [KT5.5] — after q24, q39 — Asked: V, E and F of an m × n street grid wrapped on a torus (mn, 2mn, mn) and V − E + F = 0; varies m, n.

Prerequisites go into each mission's `prereqs` (q01 has `[]`).

## Answers
Numbers only: a count (edges, faces, trees, colours, routes), a length or weight, a degree, a vertex label (vertices are numbered 1, 2, 3, … in the prompt), or a property typed 1 or 0. A route or a set of edges is never typed: ask for its total weight or its size. Every generator draws a new network from a family (cycles, wheels, grids, random graphs with fixed vertex counts and weights 1–20) and recomputes the answer, so prompts list edges as pairs, never only as a picture.

## Ranks, achievements, copy
Ranks: MAP READER, ROAD SURVEYOR, CABLE LAYER, DISPATCHER, CIRCUIT DESIGNER, FLOW ENGINEER, NETWORK PLANNER, NETWORK ARCHITECT, MASTER OF NETWORKS.
Achievements: "Every dome connected" (`graph-done`, all 40 concepts); "No edge left uncounted" (`graph-master`, all 160).
Home title: "Every dome needs a link.<br><em>Learn the shape of a network.</em>"
First visit (Mira): "Welcome to the Map Room. The outpost is now a scatter of domes, and every tunnel, cable and road between them is a line on this table. We start by counting the links we already have."
First button: "Count the first links". All done: "Every road, cable and pipe at the outpost is now planned on paper first. Topology opens next in the Survey Grid, where a network becomes a shape."

**Must-have glossary terms:** vertex, edge, degree, path, connected, Euler circuit, tree, spanning tree, Hamilton cycle, planar, chromatic number, bipartite, matching, flow.
