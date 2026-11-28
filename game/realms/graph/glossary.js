/* Graph theory: networks glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['graph'] = {
 required: ['vertex', 'edge', 'degree', 'path', 'connected', 'Euler circuit', 'tree', 'spanning tree', 'Hamilton cycle', 'planar', 'chromatic number', 'bipartite', 'matching', 'flow'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['graph', 'q01', 'A set of vertices together with edges, each edge joining two of the vertices.', 'Domes drawn as dots and tunnels as lines between them make a graph.'],
  ['vertex', 'q01', 'One of the points of a graph, such as a dome on the survey table.', 'A graph of 6 domes has 6 vertices.', ['vertices']],
  ['edge', 'q01', 'A link in a graph that joins two vertices, such as one tunnel between two domes.', 'The tunnel 2–5 is an edge joining dome 2 and dome 5.'],
  ['adjacent', 'q01', 'Two vertices are adjacent when an edge joins them.', 'With the edge 1–4, domes 1 and 4 are adjacent.'],
  ['neighbour', 'q01', 'A vertex adjacent to a given vertex: the other end of one of its edges.', 'With the edges 2–3 and 3–6, dome 3 has neighbours 2 and 6.'],
  ['loop', 'q01', 'An edge that joins a vertex to itself.', 'A tunnel that leaves dome 4 and comes back into dome 4 is a loop.'],
  ['multigraph', 'q01', 'A graph that may have loops, or more than one edge between the same pair of vertices.', 'Two separate tunnels between domes 1 and 2 make a multigraph.'],
  ['simple graph', 'q01', 'A graph with no loops and at most one edge between any pair of vertices.', 'Every tunnel map on the survey table is a simple graph.'],
  ['degree', 'q02', 'The number of edges that meet a vertex, written deg(v); in a simple graph it is the number of neighbours.', 'Dome 3 with tunnels to domes 2, 4 and 6 has deg(3) = 3.'],
  ['handshake rule', 'q02', 'The degrees of all the vertices of a graph add up to twice the number of edges.', 'A graph with 8 edges has degrees that add up to 16.'],
  ['complete graph', 'q03', 'A simple graph with an edge between every pair of vertices; with n vertices it is written Kₙ and has n(n − 1) ÷ 2 edges.', 'K₄ has 4 × 3 ÷ 2 = 6 edges.'],
  ['cycle', 'q03', 'Vertices joined in a ring, each to the next and the last back to the first; with n vertices it is written Cₙ.', 'C₅ is 5 domes in a ring, joined by 5 tunnels.'],
  ['subgraph', 'q04', 'Part of a graph: some of its vertices and some of the edges between them.', 'Domes 1, 2 and 3 with the tunnels among them form a subgraph.'],
  ['complement', 'q04', 'The graph on the same vertices that joins exactly the pairs the original graph leaves unjoined.', 'On domes 1, 2 and 3 the complement of the edge 1–2 has the edges 1–3 and 2–3.'],
  ['isomorphic', 'q05', 'Two graphs are isomorphic when renaming the vertices of one turns it into the other, edge for edge.', 'Two maps of the same ring of four domes, numbered differently, are isomorphic.'],
  ['invariant', 'q05', 'A number that renaming the vertices cannot change, so isomorphic graphs always share it.', 'The number of edges is an invariant.'],
  ['degree sequence', 'q05', 'The list of all the degrees of a graph, written from largest to smallest.', 'A triangle with one extra edge hanging off it has degree sequence 3, 2, 2, 1.'],
  ['walk', 'q06', 'A journey through a graph from vertex to vertex along edges, where repeats are allowed.', '1, 2, 1, 3 is a walk of length 3.'],
  ['trail', 'q06', 'A walk that never uses the same edge twice.', '1, 2, 3, 1, 4 is a trail: it visits dome 1 twice but uses no tunnel twice.'],
  ['path', 'q06', 'A walk that never visits the same vertex twice.', '1, 2, 4 is a path of length 2.'],
  ['circuit', 'q06', 'A trail that ends at the vertex where it started.', '1, 2, 3, 1 is a circuit of length 3.'],
  ['distance', 'q07', 'The number of edges in a shortest path between two vertices.', 'If the best route from depot 1 to depot 6 uses 3 roads, their distance is 3.'],
  ['connected', 'q08', 'A graph is connected when every pair of its vertices is joined by a path.', 'A road map on which every depot can reach every other is connected.'],
  ['component', 'q08', 'A piece of a graph in which every pair of vertices is joined by a path, and from which no edge leaves.', 'A depot with no roads at all is a component on its own.'],
  ['Euler circuit', 'q09', 'A circuit that uses every edge of a graph exactly once.', 'A connected graph whose degrees are all even has an Euler circuit.'],
  ['Euler trail', 'q10', 'A trail that uses every edge of a graph exactly once and ends at a different vertex from its start.', 'A connected graph with exactly two odd-degree vertices has an Euler trail.'],
  ['bridge', 'q10', 'An edge whose removal increases the number of components of a graph.', 'The only road out to a far depot is a bridge.'],
  /* q11–q20 (missions-b.js) */
  ['eulerise', 'q11', 'To add copies of existing edges to a network until every vertex has even degree, so that an Euler circuit exists.', 'A grid with 12 odd corners is eulerised by repeating at least 6 roads.', ['eulerising', 'eulerised']],
  ['tree', 'q12', 'A connected network with no circuits; a tree on n vertices always has n − 1 edges.', 'Five domes joined in a chain by 4 cables form a tree.'],
  ['leaf', 'q13', 'A vertex of degree 1 in a tree: a dead end joined to the rest by a single edge.', 'In a chain of 5 domes the two end domes are leaves.', ['leaves']],
  ['forest', 'q13', 'A network with no circuits that may come in several pieces, each of them a tree; n vertices in c trees have n − c edges.', '20 domes in 3 separate trees use 17 cables.'],
  ['spanning tree', 'q14', 'A tree inside a connected network that uses every vertex and only some of the edges: V − 1 of them.', 'A network of 5 domes and 8 tunnels has spanning trees of 4 tunnels.'],
  ['weighted graph', 'q16', 'A network in which every edge carries a number, its weight, such as a length, a cost or a time.', 'A map of tunnels marked with their cable lengths is a weighted graph.'],
  ['weight', 'q16', 'The number an edge carries in a weighted graph; the weight of a set of edges is the total of their weights.', 'A tree of cables 2, 4 and 6 has weight 12.'],
  ['minimum spanning tree', 'q16', 'A spanning tree of a weighted graph whose total weight is as small as possible.', 'Kruskal’s algorithm finds a minimum spanning tree of weight 12.'],
  ['Kruskal’s algorithm', 'q16', 'Take the edges from lightest to heaviest, skipping any that would close a circuit, until there are V − 1.', 'Lengths 2, 4 added, 5 skipped, 6 added: a tree of weight 12.'],
  ['Dijkstra’s algorithm', 'q18', 'Shortest distances from one vertex: each round, make the unfinished vertex with the smallest time permanent and update its neighbours.', 'Times 0, 1, 3, 8: station 4 is 8 minutes from station 1.'],
  ['Hamilton cycle', 'q19', 'A route that visits every vertex exactly once and returns to its start.', 'K_5 has 4! = 24 Hamilton cycles from a fixed start.'],
  ['travelling salesperson problem', 'q20', 'The problem of finding the Hamilton cycle of least total weight: the cheapest tour of every location.', 'For 4 stations the cheapest of the 3 tours solves it.'],
  ['brute force', 'q20', 'Solving a problem by checking every possible case, here every Hamilton cycle, and keeping the best.', '5 stations need 12 tours checked.'],
  /* q21–q30 (missions-c.js) */
  ['nearest-neighbour method', 'q21', 'A quick way to plan a tour: from each station go to the nearest one not yet visited, and at the end return to the start.', 'From 1 go to the nearest station, then to the nearest new one, and so on.', ['nearest neighbour method']],
  ['Hamilton path', 'q22', 'A path that visits every vertex of a network exactly once, without having to return to its start.', 'In a ring of 4 stations, 1 → 2 → 3 → 4 is a Hamilton path.'],
  ['Dirac’s theorem', 'q22', 'If every vertex of a simple network on n ≥ 3 vertices has degree at least n ÷ 2, the network has a Hamilton cycle.', '6 stations, each with at least 3 links: a Hamilton cycle must exist.', ['Dirac\'s theorem']],
  ['planar', 'q24', 'A network is planar when it can be drawn on a flat sheet with no two edges crossing.', 'Four vertices all joined to one another can be drawn flat with no crossings.'],
  ['plane drawing', 'q24', 'A drawing of a network on a flat sheet in which no two edges cross.', 'A triangle drawn on paper is a plane drawing with 2 faces.'],
  ['face', 'q24', 'One of the regions a plane drawing cuts the sheet into; the region outside the whole drawing counts as one face.', 'A drawn square has 2 faces: the inside and the outside.', [], 'face (the|a|an|up|down|it|them)\\b'],
  ['Euler’s formula', 'q24', 'For a connected plane drawing, vertices minus edges plus faces is always 2: V − E + F = 2.', 'A cube drawn flat: 8 − 12 + 6 = 2.', ['Euler\'s formula']],
  ['polyhedron', 'q26', 'A closed solid made of flat faces that meet along straight edges, such as a cube or a pyramid.', 'A cube is a polyhedron with 8 corners, 12 edges and 6 faces.', ['polyhedra']],
  ['prism', 'q26', 'A polyhedron with two matching end faces joined by a band of rectangles.', 'A prism with triangle ends has 6 corners, 9 edges and 5 faces.'],
  ['bipartite', 'q27', 'A network is bipartite when its vertices split into two sides so that every edge joins one side to the other.', 'Crew on one side and tasks on the other, each edge a person and a task they can do.'],
  ['odd cycle', 'q27', 'A cycle with an odd number of edges; a network that has one can never be bipartite.', '1 → 2 → 3 → 1 is an odd cycle of 3 edges.'],
  ['complete bipartite graph', 'q27', 'A bipartite network in which every vertex on one side is joined to every vertex on the other; K_{m,n} has m × n edges.', 'K_{2,3}: 2 vertices each joined to the same 3 others, 6 edges in all.', ['K_{m,n}']],
  ['colouring', 'q28', 'A choice of colour for every vertex so that the two ends of every edge get different colours.', 'A ring of 4 coloured red, blue, red, blue.', ['coloring']],
  ['chromatic number', 'q28', 'The fewest colours a colouring of a network can use, written χ.', 'A ring of 5 has chromatic number 3.', ['χ']],
  ['matching', 'q30', 'A set of edges no two of which share an end, such as pairs of crew and tasks with no one doubled up.', 'Crew 1 → A and crew 2 → B is a matching of size 2.'],
  /* q31–q40 (missions-d.js) */
  ['perfect matching', 'q31', 'A matching that uses every vertex of the graph, so that each vertex is paired with exactly one vertex on the other side.', 'Ash with job 2 and Bo with job 1 is a perfect matching of two technicians and two jobs.'],
  ['Hall’s condition', 'q31', 'Every set S of vertices on one side has at least as many neighbours as members; with equal sides, a perfect matching exists exactly when it holds.', 'Two technicians who can only do job 1 break Hall’s condition.', ['Hall’s test']],
  ['directed graph', 'q32', 'A graph whose edges each have a direction, from one vertex to another, drawn as arrows.', 'One-way pipes 1→2 and 2→3 form a directed graph.', ['digraph']],
  ['arc', 'q32', 'An edge with a direction in a directed graph, written i→j for an arc from vertex i to vertex j.', 'The arc 2→5 lets water go from 2 to 5 but not back.'],
  ['directed path', 'q32', 'A path that follows arcs only in the direction of their arrows, through different vertices.', '1→2→4 is a directed path if the arcs 1→2 and 2→4 exist.'],
  ['flow network', 'q33', 'A directed graph with a source, a sink and a capacity on every arc.', 'Pipes from a tank to a reservoir, each with a limit in litres per second.'],
  ['source', 'q33', 'In a flow network, the vertex where the flow starts.', 'The pumping tank at junction 1 is the source.', [], 'study the source|sources? of'],
  ['sink', 'q33', 'In a flow network, the vertex where the flow ends.', 'The reservoir at junction 5 is the sink.'],
  ['capacity', 'q33', 'The most an arc can carry in a flow network; for a cut, the total capacity of the arcs from the source side to the sink side.', 'A pipe of capacity 8 carries at most 8 litres per second.'],
  ['flow', 'q33', 'An amount on every arc, no more than its capacity, with flow in equal to flow out at every vertex except the source and the sink.', '4 litres per second along 1→2→4 and 3 along 1→3→4 make a flow of value 7.'],
  ['cut', 'q33', 'A split of the vertices into a source side holding the source and a sink side holding the sink.', 'The cut {1, 2} against {3, 4} crosses the arcs 1→3, 2→3 and 2→4.', [], 'cut (?:off|out|down|through|into|back)\\b|cut (?:an?|the|one) (?:edge|road|cable|tunnel|link|wire|pipe)'],
  ['max-flow min-cut theorem', 'q34', 'The largest value of a flow equals the smallest capacity of a cut.', 'When the narrowest cut of a station is 3 pipes of 2 litres per second, exactly 6 litres per second can be sent.'],
  ['labelled tree', 'q35', 'A tree whose vertices are numbered or named, so that trees of the same shape with different links count as different.', 'On vertices 1, 2, 3 the paths 1–2–3 and 2–1–3 are different labelled trees.'],
  ['Cayley’s formula', 'q35', 'The number of labelled trees on n vertices is n to the power n − 2.', 'On 4 vertices there are 4² = 16 labelled trees.'],
  ['Prüfer code', 'q36', 'The list of n − 2 numbers made from a labelled tree by removing the smallest leaf again and again and writing down its neighbour.', 'The tree with edges 1–2, 2–3, 2–4, 4–5 has the Prüfer code (2, 2, 4).'],
  ['clique', 'q37', 'A set of vertices in which every two are joined by an edge.', 'In a triangle with an extra vertex, the triangle’s three vertices form a clique.'],
  ['clique number', 'q37', 'The size of the largest clique in a graph, written ω.', 'The complete graph K₄ has clique number 4.'],
  ['independent set', 'q37', 'A set of vertices in which no two are joined by an edge.', 'In the ring 1–2–3–4–1, the vertices 1 and 3 form an independent set.'],
  ['independence number', 'q37', 'The size of the largest independent set in a graph, written α.', 'The cycle C₆ has independence number 3.'],
  ['pigeonhole principle', 'q39', 'If more things than boxes are put into boxes, some box gets at least two; in general some box gets at least the average, rounded up.', 'Five edges in two colours: one colour has at least 3.'],
  ['Ramsey number', 'q39', 'R(3, 3) is the smallest number of vertices for which every two-colouring of the complete graph has a one-colour triangle; it is 6.', 'K₆ always has a one-colour triangle, K₅ need not.'],
  ['torus', 'q40', 'The surface of a ring doughnut; a network on it can have V − E + F = 0 instead of 2.', 'An inner tube has the shape of a torus.'],
 ]
};
})();
