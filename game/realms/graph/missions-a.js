/* Graph theory: networks missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/graph/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Vertices, edges and neighbours [O12.1]
     q02  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Degree and the handshake rule [O12.1, O12.2]
     q03  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Complete graphs and cycles [O12.2]
     q04  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Subgraphs and complements [O12.2, O12.3]
     q05  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Isomorphism and invariants [O12.3]
     q06  ch 1 Points and links · Basic, 100 XP · sector 'Map Room' · Walks, trails and paths [O12.4]
     q07  ch 2 Getting around · Basic, 100 XP · sector 'Rover Depot' · Distance [O12.4, KT5.1, KT12.3]
     q08  ch 2 Getting around · Basic, 100 XP · sector 'Rover Depot' · Connected components [KT5.1]
     q09  ch 2 Getting around · Basic, 100 XP · sector 'Rover Depot' · Euler circuits [O12.5]
     q10  ch 2 Getting around · Basic, 100 XP · sector 'Rover Depot' · Euler trails [O12.6] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 12; Keller and Trotter, Applied Combinatorics (KT sections at https://www.rellek.net/book/<page>.html) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Applied Combinatorics/ (OpenStax and Keller and Trotter).
   A title reads like: OpenStax Contemporary Mathematics — 12.5 Euler Circuits
   Link to the section page itself: https://openstax.org/books/contemporary-mathematics/pages/<section-slug> */
const source = {
 o1: { title: 'OpenStax Contemporary Mathematics — 12.1 Graph Basics', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-1-graph-basics', description: 'Vertices, edges, adjacent vertices, loops, multigraphs, simple graphs and the degree of a vertex.', verified: '2026-11-27' },
 o2: { title: 'OpenStax Contemporary Mathematics — 12.2 Graph Structures', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-2-graph-structures', description: 'The sum of degrees theorem, complete graphs and their edge count, subgraphs and cycles.', verified: '2026-11-27' },
 o3: { title: 'OpenStax Contemporary Mathematics — 12.3 Comparing Graphs', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-3-comparing-graphs', description: 'Isomorphic graphs, telling graphs apart by vertex, edge and degree counts, and complementary graphs.', verified: '2026-11-27' },
 o4: { title: 'OpenStax Contemporary Mathematics — 12.4 Navigating Graphs', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-4-navigating-graphs', description: 'Walks, trails, paths and circuits.', verified: '2026-11-27' },
 o5: { title: 'OpenStax Contemporary Mathematics — 12.5 Euler Circuits', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-5-euler-circuits', description: 'Connected graphs and components, the bridges of Königsberg, and the even-degree test for an Euler circuit.', verified: '2026-11-27' },
 o6: { title: 'OpenStax Contemporary Mathematics — 12.6 Euler Trails', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-6-euler-trails', description: 'Euler trails that start and end at the two odd-degree vertices, bridges, and Fleury’s algorithm.', verified: '2026-11-27' },
 kt51: { title: 'Keller and Trotter, Applied Combinatorics — 5.1 Basic Notation and Terminology for Graphs', url: 'https://www.rellek.net/book/s_graphs_intro.html', description: 'Adjacency, neighbourhoods, degree, walks, paths and their lengths, connected graphs and components.', verified: '2026-11-27' },
 kt123: { title: 'Keller and Trotter, Applied Combinatorics — 12.3 Dijkstra’s Algorithm for Shortest Paths', url: 'https://www.rellek.net/book/s_graphalgorithms_shortest-paths.html', description: 'The distance between two vertices as the length of a shortest path.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: 'Counting the first tunnels', topic: 'Vertices, edges and neighbours', tier: 'Basic', sector: 'Map Room',
  brief: 'The survey table shows the tunnels already dug between the domes, and Mira wants them counted before anyone digs a new one.',
  lesson: 'A graph is a set of vertices joined by edges; two vertices joined by an edge are adjacent, and each is a neighbour of the other.',
  prompt: 'The survey table lists every tunnel between 6 domes, numbered 1 to 6. Each tunnel joins two different domes, and no two tunnels join the same pair. The tunnels are 1–2, 1–4, 2–3, 2–5, 3–4, 3–6, 4–5, 5–6. In this graph each dome is a vertex and each tunnel is an edge. Enter the number of edges, then the number of neighbours of dome 3.',
  answer: [8, 3], labels: ['edges', 'neighbours of the dome'], tolerance: 0.01,
  hints: [
   'Each pair in the list is one edge, and each edge is listed once, so count the pairs.',
   'A neighbour of a dome is the other end of any pair that contains it, whichever side of the dash the dome is written on.'
  ],
  solution: 'The list has 8 pairs, so the graph has 8 edges. The pairs that contain 3 are 2–3, 3–4 and 3–6, so the neighbours of dome 3 are domes 2, 4 and 6: 3 neighbours.',
  xp: 100, prereqs: [],
  artifact: { name: 'Survey table, first sheet', description: 'Every dome a dot, every tunnel a line between two of them.' },
  sources: [source.o1],
  teaching: {
   intuition: 'Mira draws each dome as a dot and each tunnel as a line joining two dots. A drawing like this is called a graph. Each dot is a vertex (plural vertices) and each line is an edge. Only which dots are joined matters: the length, the bend and the position of a line change nothing. Two vertices joined by an edge are adjacent, and each is a neighbour of the other. An edge from a vertex back to itself is called a loop, and a graph that allows loops, or several edges between the same pair, is a multigraph. A graph with no loops and at most one edge between any pair is a simple graph. On the survey table every tunnel joins two different domes and no pair has two tunnels, so our graphs are simple, and we can write each edge as the pair it joins, such as 2–5.',
   steps: [
    'Read each pair in the list as one edge: 2–5 means a tunnel joining dome 2 and dome 5.',
    'Count the pairs to get the number of edges. Each pair is listed once.',
    'To find the neighbours of a dome, pick out every pair that contains it; the other number in each such pair is a neighbour.',
    'Count those neighbours. In a simple graph each neighbour comes from exactly one edge, so no neighbour is counted twice.'
   ],
   example: {
    prompt: 'Four domes are joined by the tunnels 1–2, 1–3, 2–3 and 3–4. How many edges does the graph have, and how many neighbours does dome 3 have?',
    steps: [
     'The list has four pairs, so the graph has 4 edges.',
     'The pairs that contain 3 are 1–3, 2–3 and 3–4, so the neighbours of dome 3 are domes 1, 2 and 4.'
    ],
    answer: '4 edges; dome 3 has 3 neighbours.'
   },
   pitfalls: [
    'Counting the domes instead of the tunnels. The number of vertices and the number of edges are different counts.',
    'Counting a dome as one of its own neighbours. A neighbour is the other end of an edge.',
    'Missing the pairs where the dome is written second: in 1–3, dome 3 is a neighbour of dome 1, and dome 1 is a neighbour of dome 3.'
   ]
  },
  guidance: [
   { prompt: 'Count the pairs in the list 1–2, 1–4, 2–3, 2–5, 3–4, 3–6, 4–5, 5–6. How many edges does the graph have?', answer: [8], labels: ['edges'], explanation: 'There are 8 pairs, and each pair is one tunnel, so the graph has 8 edges.' },
   { prompt: 'Pick out every pair that contains 3, on either side of the dash. How many neighbours does dome 3 have?', answer: [3], labels: ['neighbours of the dome'], explanation: 'The pairs 2–3, 3–4 and 3–6 contain 3. Their other ends are domes 2, 4 and 6, so dome 3 has 3 neighbours.' }
  ]
 },
 {
  id: 'q02', title: 'The smudged degree log', topic: 'Degree and the handshake rule', tier: 'Basic', sector: 'Map Room',
  brief: 'Someone counted the tunnels at each dome for the Map Room log, but one reading is smudged, and Mira wants it back without walking the tunnels again.',
  lesson: 'The degree of a vertex is the number of edges that meet it, and the degrees of a graph always add up to twice its number of edges.',
  prompt: 'The Map Room log covers 6 domes joined by 8 tunnels. Each tunnel joins two different domes, and no pair has two tunnels. Domes 1 to 5 have degrees 4, 3, 2, 3 and 1, in that order. The reading for dome 6 is smudged. Enter the sum of the degrees of all 6 domes, then the degree of dome 6.',
  answer: [16, 3], labels: ['sum of degrees', 'degree of the last dome'], tolerance: 0.01,
  hints: [
   'Every tunnel has two ends, and each end adds 1 to the degree of the dome it is in.',
   'The missing degree is the full sum of the degrees minus the degrees you already know.'
  ],
  solution: 'By the handshake rule the degrees add up to 2 × 8 = 16. The known degrees add up to 4 + 3 + 2 + 3 + 1 = 13. So deg(6) = 16 − 13 = 3.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Degree log', description: 'One count of tunnel ends for every dome, and a total that is always even.' },
  sources: [source.o1, source.o2],
  teaching: {
   intuition: 'The degree of a vertex is the number of edges that meet it. We write deg(v) for the degree of a vertex v; in a simple graph it is the number of neighbours of v. Now picture every tunnel as having two ends, one in each dome it joins. When you add up the degrees of all the domes you are counting tunnel ends, and every tunnel has exactly two ends, so every tunnel is counted exactly twice. That gives the handshake rule: the sum of the degrees equals 2 × the number of edges. Think of people shaking hands: every handshake uses two hands. Two things follow at once. The sum of the degrees is always even. And if you know the number of edges and every degree but one, the missing degree is whatever brings the sum up to twice the edges.',
   steps: [
    'Find the sum of all the degrees from the handshake rule: 2 × the number of edges.',
    'Add up the degrees you know.',
    'Subtract: the missing degree is the full sum minus the known part.',
    'Check that the answer makes sense: in a simple graph a degree is never more than the number of other vertices.'
   ],
   example: {
    prompt: 'Five domes are joined by 5 tunnels. Domes 1 to 4 have degrees 2, 3, 1 and 2. What is the degree of dome 5?',
    steps: [
     'By the handshake rule the degrees add up to 2 × 5 = 10.',
     'The known degrees add up to 2 + 3 + 1 + 2 = 8.',
     'The missing degree is 10 − 8 = 2.'
    ],
    answer: 'deg(5) = 2.'
   },
   pitfalls: [
    'Adding up the degrees and calling that the number of edges. Every edge is counted twice in the sum, so the edges are half of it.',
    'Using the number of edges as the sum of the degrees. The sum is twice the number of edges.',
    'Leaving a known degree out of the sum, or counting the missing dome as 0 and stopping there.'
   ]
  },
  guidance: [
   { prompt: 'The network has 8 tunnels, and every tunnel adds 1 to the degree at each of its two ends. What is the sum of all the degrees?', answer: [16], labels: ['sum of degrees'], explanation: 'Each tunnel is counted once at each end, so the degrees add up to 2 × 8 = 16.' },
   { prompt: 'What do the known degrees 4, 3, 2, 3 and 1 add up to?', answer: [13], labels: ['sum of the known degrees'], explanation: '4 + 3 + 2 + 3 + 1 = 13.' },
   { prompt: 'The missing degree makes up the difference. What is 16 − 13?', answer: [3], labels: ['degree of the last dome'], explanation: '16 − 13 = 3, so dome 6 has degree 3: 3 tunnels meet it.' }
  ]
 },
 {
  id: 'q03', title: 'Every pair, or a ring', topic: 'Complete graphs and cycles', tier: 'Basic', sector: 'Map Room',
  brief: 'Two plans for a new cluster of domes are on the table, one linking every pair and one linking them in a ring, and Mira wants to know how many tunnels each would take.',
  lesson: 'The complete graph Kₙ joins every pair of its n vertices and has n(n − 1) ÷ 2 edges; the cycle Cₙ joins n vertices in a ring with n edges.',
  prompt: 'Mira has two plans for a new cluster of 12 domes. Plan A is the complete graph K₁₂: a tunnel between every pair of domes. Plan B is the cycle C₁₂: the domes stand in a ring, each joined to the next, and the last joined back to the first. Enter the number of edges in plan A, then the degree of each dome in plan A, then the number of edges in plan B.',
  answer: [66, 11, 12], labels: ['edges in plan A', 'degree in plan A', 'edges in plan B'], tolerance: 0.01,
  hints: [
   'In a complete graph each dome is joined to every other dome, but never to itself.',
   'Adding up all the degrees counts every edge twice, once at each end, so halve that total. In a ring every dome has exactly two neighbours.'
  ],
  solution: 'In K₁₂ each dome is joined to the other 11, so each degree is 11. The degrees add up to 12 × 11 = 132, which counts every edge twice, so K₁₂ has 132 ÷ 2 = 66 edges. In C₁₂ every dome has degree 2, so the degrees add up to 2 × 12 = 24 and the ring has 24 ÷ 2 = 12 edges.',
  xp: 100, prereqs: ['q02'],
  artifact: { name: 'Two cluster plans', description: 'A web with every pair joined, beside a single ring.' },
  sources: [source.o2],
  teaching: {
   intuition: 'A complete graph has an edge between every pair of its vertices. With n vertices it is written Kₙ. Each vertex is joined to all the n − 1 others, so its degree is n − 1. Adding those degrees over all n vertices gives n × (n − 1), and by the handshake rule that counts every edge twice, so Kₙ has n(n − 1) ÷ 2 edges. For 4 domes that is 4 × 3 ÷ 2 = 6 tunnels. A cycle is the thrifty plan: the vertices stand in a ring, each joined to the next and the last joined back to the first. With n vertices, at least 3, it is written Cₙ. Every vertex has exactly two neighbours, the one before it and the one after, so every degree is 2, and the handshake rule gives 2n ÷ 2 = n edges.',
   steps: [
    'For the complete graph Kₙ: every vertex is joined to the other n − 1, so every degree is n − 1.',
    'Its number of edges is n × (n − 1) ÷ 2: multiply, then halve, because each edge has two ends.',
    'For the cycle Cₙ: every degree is 2, and the number of edges equals the number of vertices, n.'
   ],
   example: {
    prompt: 'A cluster of 7 domes. How many tunnels does K₇ need, what is the degree of each dome in K₇, and how many tunnels does the ring C₇ need?',
    steps: [
     'Each dome is joined to the other 6, so each degree is 6.',
     'K₇ has 7 × 6 ÷ 2 = 21 edges.',
     'C₇ has 7 edges, one from each dome to the next one round the ring.'
    ],
    answer: '21 tunnels with degree 6, and 7 tunnels for the ring.'
   },
   pitfalls: [
    'Forgetting to halve: n × (n − 1) counts every edge twice, once from each end.',
    'Using n instead of n − 1 for the degree in Kₙ. A dome is never joined to itself.',
    'Thinking a ring of n domes needs n − 1 tunnels. The last dome is joined back to the first, which makes n.'
   ]
  },
  guidance: [
   { prompt: 'In plan A, how many other domes is each dome joined to? That is its degree.', answer: [11], labels: ['degree in plan A'], explanation: 'Each dome is joined to all 12 domes except itself, so its degree is 12 − 1 = 11.' },
   { prompt: 'Add the degrees of all 12 domes and halve the total, since every edge has two ends. What is 12 × 11 ÷ 2?', answer: [66], labels: ['edges in plan A'], explanation: '12 × 11 = 132, and half of that is 66: plan A needs 66 tunnels.' },
   { prompt: 'In plan B every dome has degree 2. How many edges does the ring have?', answer: [12], labels: ['edges in plan B'], explanation: 'The degrees add up to 2 × 12 = 24, and half of that is 12: one tunnel from each dome to the next one round the ring.' }
  ]
 },
 {
  id: 'q04', title: 'The tunnels not yet dug', topic: 'Subgraphs and complements', tier: 'Basic', sector: 'Map Room',
  brief: 'Mira wants to know which pairs of domes still have no tunnel, because those are the only places left to dig.',
  lesson: 'The complement of a simple graph joins exactly the pairs the graph leaves unjoined, so it has n(n − 1) ÷ 2 − E edges and gives each vertex v degree n − 1 − deg(v).',
  prompt: 'The Map Room graph has 7 domes, numbered 1 to 7, and these 9 tunnels: 1–2, 1–5, 2–3, 2–4, 3–6, 4–5, 4–7, 5–6, 6–7. No tunnel joins a dome to itself, and no pair has two. Enter the number of edges in the subgraph on domes 1, 2, 3 and 4 (it keeps every tunnel between two of those domes), then the number of edges in the complement of the graph, then the degree of dome 4 in the complement.',
  answer: [3, 12, 3], labels: ['edges in the subgraph', 'edges in the complement', 'degree in the complement'], tolerance: 0.01,
  hints: [
   'A tunnel belongs to the subgraph only when both of its domes are among 1, 2, 3 and 4.',
   'The graph and its complement together make the complete graph on the same domes, with every pair joined exactly once.'
  ],
  solution: 'Between domes 1, 2, 3 and 4 the tunnels are 1–2, 2–3 and 2–4, so the subgraph has 3 edges. K₇ has 7 × 6 ÷ 2 = 21 edges, so the complement has 21 − 9 = 12. Dome 4 has degree 3, so in the complement its degree is 6 − 3 = 3.',
  xp: 100, prereqs: ['q03'],
  artifact: { name: 'The negative map', description: 'A sheet with a line for every tunnel that does not exist yet.' },
  sources: [source.o2, source.o3],
  teaching: {
   intuition: 'A subgraph is part of a graph: some of its vertices and some of the edges between them. Choose a few domes and keep every tunnel that runs between two chosen domes, and you have a subgraph. The complement of a simple graph is built the other way round. It has the same vertices, and two vertices are adjacent in the complement exactly when they are not adjacent in the original graph. Put a graph and its complement together and you get the complete graph Kₙ, with every pair joined exactly once. So if the graph has E edges, its complement has n(n − 1) ÷ 2 − E. In the same way, a vertex v is joined to n − 1 others in Kₙ, to deg(v) of them in the graph, and to all the rest in the complement, so its degree there is n − 1 − deg(v).',
   steps: [
    'For a subgraph on chosen domes, keep only the edges whose two ends are both chosen, and count them.',
    'For the complement, start from the n(n − 1) ÷ 2 edges of Kₙ and subtract the edges the graph already has.',
    'For the degree of a vertex v in the complement, subtract deg(v) from n − 1.'
   ],
   example: {
    prompt: 'A graph has 5 domes and 6 tunnels: 1–2, 1–3, 2–3, 2–4, 3–5 and 4–5. How many edges does the subgraph on domes 1, 2 and 3 have, how many edges does the complement have, and what is the degree of dome 2 in the complement?',
    steps: [
     'Between domes 1, 2 and 3 the tunnels are 1–2, 1–3 and 2–3, so the subgraph has 3 edges.',
     'K₅ has 5 × 4 ÷ 2 = 10 edges, so the complement has 10 − 6 = 4.',
     'Dome 2 has degree 3, so in the complement its degree is 4 − 3 = 1.'
    ],
    answer: '3 edges in the subgraph, 4 in the complement, and degree 1 for dome 2 there.'
   },
   pitfalls: [
    'Keeping a tunnel in the subgraph when only one of its ends is a chosen dome.',
    'Subtracting from n × (n − 1) instead of n(n − 1) ÷ 2: the complete graph has half as many edges.',
    'Using n instead of n − 1 for the degree: a dome is never joined to itself, in the graph or in its complement.'
   ]
  },
  guidance: [
   { prompt: 'Keep only the tunnels whose two ends are both among domes 1, 2, 3 and 4. How many edges does that subgraph have?', answer: [3], labels: ['edges in the subgraph'], explanation: 'They are 1–2, 2–3 and 2–4: 3 edges. Every other tunnel has an end outside domes 1 to 4.' },
   { prompt: 'The complete graph on 7 domes has 7 × 6 ÷ 2 = 21 edges. How many of those pairs are not tunnels yet?', answer: [12], labels: ['edges in the complement'], explanation: '21 − 9 = 12: those pairs are exactly the edges of the complement.' },
   { prompt: 'Dome 4 can be joined to 6 other domes, and 3 of those joins are tunnels already. What is its degree in the complement?', answer: [3], labels: ['degree in the complement'], explanation: '6 − 3 = 3: the complement joins dome 4 to every dome it is not joined to now.' }
  ]
 },
 {
  id: 'q05', title: 'Two maps, one network?', topic: 'Isomorphism and invariants', tier: 'Basic', sector: 'Map Room',
  brief: 'Two survey crews mapped the same cluster of domes but numbered the domes differently, and Mira wants to know whether their maps can show the same network.',
  lesson: 'Isomorphic graphs share every invariant, such as the number of edges and the degree sequence, so one invariant that differs proves two graphs are not isomorphic.',
  prompt: 'Two crews mapped a cluster of 6 domes, each numbering the domes 1 to 6 in its own way. Map A has the tunnels 1–2, 1–3, 2–3, 3–4, 4–5, 4–6, 5–6. Map B has the tunnels 1–2, 1–4, 1–5, 1–6, 2–3, 3–4, 5–6. Matching counts alone do not prove that two networks are the same shape in general, but for these two small maps the crews have checked that if they have the same number of edges and the same degree sequence, a renaming of the domes turns one map into the other. Enter the number of edges in map A, then the number in map B, then 1 if the maps are isomorphic or 0 if they are not.',
  answer: [7, 7, 0], labels: ['edges in map A', 'edges in map B', 'isomorphic (1 or 0)'], tolerance: 0.01,
  hints: [
   'Renaming the domes cannot change how many tunnels there are, or how many tunnels meet each dome.',
   'Write each map’s degree sequence from largest to smallest and compare the two lists, not just the edge counts.'
  ],
  solution: 'Map A has 7 edges and map B has 7. Map A has degree sequence 3, 3, 2, 2, 2, 2, and map B has 4, 2, 2, 2, 2, 2. The edge counts agree but the degree sequences differ, so no renaming can turn one map into the other: 0.',
  xp: 100, prereqs: ['q04'],
  artifact: { name: 'Crew comparison sheet', description: 'Two numberings of one cluster, matched invariant by invariant.' },
  sources: [source.o3],
  teaching: {
   intuition: 'Two graphs are isomorphic when they are the same graph with the vertices renamed: the vertices can be matched one to one so that two vertices are adjacent in the first graph exactly when their partners are adjacent in the second. The two drawings may look nothing alike. An invariant is a number that renaming cannot change, so isomorphic graphs always share it. The number of vertices and the number of edges are invariants, and so is the degree sequence: the list of all the degrees, written from largest to smallest. Invariants work in one direction only. If any invariant differs, the graphs are certainly not isomorphic. If they all agree, the graphs may be isomorphic, but that still needs a renaming that works to be sure.',
   steps: [
    'Compare the numbers of vertices of the two graphs.',
    'Count the edges of each graph.',
    'Work out every degree in each graph, and write each degree sequence from largest to smallest.',
    'If anything differs, the graphs are not isomorphic. If everything agrees, look for a renaming, or use one you have been told works.'
   ],
   example: {
    prompt: 'Graph P on domes 1 to 4 has edges 1–2, 2–3, 3–4 and 1–4. Graph Q on domes 1 to 4 has edges 1–2, 1–3, 1–4 and 2–3. Could they be isomorphic?',
    steps: [
     'Both have 4 vertices and 4 edges.',
     'P has degree sequence 2, 2, 2, 2. In Q, dome 1 has degree 3, domes 2 and 3 have degree 2, and dome 4 has degree 1: degree sequence 3, 2, 2, 1.',
     'The degree sequences differ, so P and Q are not isomorphic.'
    ],
    answer: 'No: P is a ring and Q is a triangle with a tail.'
   },
   pitfalls: [
    'Stopping when the vertex and edge counts agree. Graphs with the same counts can still have different degree sequences.',
    'Deciding from the drawings or the numbering. Isomorphic graphs can be numbered and drawn in completely different ways.',
    'Treating matching invariants as a proof in general. They only fail to rule isomorphism out; a renaming that works is the proof.'
   ]
  },
  guidance: [
   { prompt: 'Count the tunnels on each map. How many edges do map A and map B have?', answer: [7, 7], labels: ['edges in map A', 'edges in map B'], explanation: 'Map A lists 7 pairs and map B lists 7.' },
   { prompt: 'Work out the degree of every dome on each map. How many domes of degree 4 does each map have?', answer: [0, 1], labels: ['domes of that degree in map A', 'domes of that degree in map B'], explanation: 'Map A has degree sequence 3, 3, 2, 2, 2, 2, with 0 of degree 4; map B has 4, 2, 2, 2, 2, 2, with 1 of degree 4.' },
   { prompt: 'Do the maps agree on the edge count and on the whole degree sequence? Enter 1 if they are isomorphic, 0 if they are not.', answer: [0], labels: ['isomorphic (1 or 0)'], explanation: 'An invariant differs, and isomorphic graphs share every invariant, so the maps are not isomorphic.' }
  ]
 },
 {
  id: 'q06', title: 'Two-tunnel courier runs', topic: 'Walks, trails and paths', tier: 'Basic', sector: 'Map Room',
  brief: 'Couriers carry parcels through the tunnels, and Mira wants the short routes counted before she writes their timetable.',
  lesson: 'A walk follows edges from vertex to vertex; a trail never repeats an edge, a path never repeats a vertex, and a circuit is a trail that ends where it started.',
  prompt: 'Couriers move between 7 domes, numbered 1 to 7, through these tunnels: 1–2, 1–3, 1–5, 2–4, 2–6, 3–4, 3–7, 4–5, 5–6, 6–7. Enter the number of walks of length 2 from dome 1 to dome 6, then the number of paths of length 2 that start at dome 1.',
  answer: [2, 6], labels: ['walks of length 2', 'paths of length 2'], tolerance: 0.01,
  hints: [
   'A walk of length 2 from one dome to another passes through exactly one dome in between, and that dome must be a neighbour of both.',
   'A path of length 2 goes from the start to a neighbour and then on to one of that neighbour’s neighbours, but never back to the start.'
  ],
  solution: 'Dome 1 has neighbours 2, 3 and 5, and dome 6 has neighbours 2, 5 and 7. The common neighbours are 2 and 5, so there are 2 walks of length 2 from 1 to 6. For the paths, each neighbour w of dome 1 gives one path for each neighbour of w other than 1: dome 2 gives 2, dome 3 gives 2 and dome 5 gives 2. That makes 2 + 2 + 2 = 6 paths.',
  xp: 100, prereqs: ['q01'],
  artifact: { name: 'Courier route card', description: 'Every two-tunnel run from the hub, with no dome visited twice.' },
  sources: [source.o4, source.kt51],
  teaching: {
   intuition: 'A walk is a journey through a graph: start at a vertex, follow an edge to a neighbour, then another edge, and so on. Its length is the number of edges it uses, counting each repeat again. A walk that never uses the same edge twice is a trail. A walk that never visits the same vertex twice is a path, and a path cannot repeat an edge either. A trail that ends at the vertex where it started is a circuit. Short walks are easy to count. A walk of length 2 from u to a different vertex v goes u, then some w, then v, so w must be a neighbour of both u and v: there is one such walk for each common neighbour. A path of length 2 starting at u goes u, then a neighbour w, then a neighbour of w, which must not be u itself, or the path would visit u twice.',
   steps: [
    'List the neighbours of u and the neighbours of v.',
    'The walks of length 2 from u to v are u, w, v for each dome w on both lists: count the common neighbours.',
    'For the paths of length 2 starting at u: for each neighbour w of u, count the neighbours of w other than u.',
    'Add those counts over all the neighbours w of u.'
   ],
   example: {
    prompt: 'Tunnels: 1–2, 1–3, 2–3, 2–4 and 3–4. How many walks of length 2 go from dome 1 to dome 4, and how many paths of length 2 start at dome 1?',
    steps: [
     'Dome 1 has neighbours 2 and 3, and dome 4 has neighbours 2 and 3. Both are common, so there are 2 walks: 1, 2, 4 and 1, 3, 4.',
     'Dome 2 has neighbours 1, 3 and 4, which is 2 apart from dome 1. Dome 3 has neighbours 1, 2 and 4, again 2 apart from dome 1.',
     'So 2 + 2 = 4 paths: 1, 2, 3 and 1, 2, 4 and 1, 3, 2 and 1, 3, 4.'
    ],
    answer: '2 walks from dome 1 to dome 4, and 4 paths of length 2 from dome 1.'
   },
   pitfalls: [
    'Counting u, w, u as a path. It visits u twice, so it is a walk but not a path.',
    'Counting walks from u to v only when u and v are adjacent. They need not be: what matters is a dome w next to both.',
    'Counting only the neighbours of u. A path of length 2 has two steps, so look at the neighbours of each neighbour too.'
   ]
  },
  guidance: [
   { prompt: 'List the neighbours of dome 1 and of dome 6. How many domes are on both lists?', answer: [2], labels: ['walks of length 2'], explanation: 'Dome 1: 2, 3 and 5. Dome 6: 2, 5 and 7. Both lists contain 2 and 5, and each of these gives one walk 1, w, 6.' },
   { prompt: 'For each neighbour of dome 1 (2, 3 and 5), count its neighbours other than dome 1, and add the counts. How many paths of length 2 start at dome 1?', answer: [6], labels: ['paths of length 2'], explanation: '2 + 2 + 2 = 6. Leaving out dome 1 itself keeps out walks such as 1, 2, 1, which visit a dome twice.' }
  ]
 },
 {
  id: 'q07', title: 'The fewest roads to the far depots', topic: 'Distance', tier: 'Basic', sector: 'Rover Depot',
  brief: 'A rover has to reach two outlying depots, and the driver wants to know the fewest roads each trip needs.',
  lesson: 'The distance between two vertices is the length of a shortest path between them: the fewest edges any route needs.',
  prompt: 'The Rover Depot map has 8 depots, numbered 1 to 8, joined by these roads: 1–2, 1–3, 2–4, 3–4, 3–5, 4–6, 5–7, 6–8, 7–8. Enter the distance from depot 1 to depot 6, then the distance from depot 1 to depot 8.',
  answer: [3, 4], labels: ['distance to the first depot named', 'distance to the second depot named'], tolerance: 0.01,
  hints: [
   'Work outwards from the start: its neighbours are at distance 1, their neighbours not yet reached are at distance 2, and so on.',
   'A depot belongs to the first ring it appears in, and the number of that ring is the fewest roads that reach it.'
  ],
  solution: 'Start at depot 1, ring 0. Then ring 1 is depots 2 and 3; ring 2 is depots 4 and 5; ring 3 is depots 6 and 7; ring 4 is depot 8. Depot 6 first appears in ring 3 and depot 8 in ring 4, so the distances are 3 and 4.',
  xp: 100, prereqs: ['q06'],
  artifact: { name: 'Ring chart', description: 'The depots sorted into rings by how many roads it takes to reach them.' },
  sources: [source.o4, source.kt51, source.kt123],
  teaching: {
   intuition: 'The length of a path is the number of edges it uses. Two vertices are usually joined by many paths of different lengths, and the distance between them is the length of the shortest one: the fewest edges any route between them needs. You can find it without listing every path, by working outwards in rings. Start at u, which is at distance 0. Its neighbours make ring 1: they are at distance 1. Every vertex not yet reached that is a neighbour of something in ring 1 goes in ring 2, and so on: each new ring is the unreached neighbours of the ring before. The first ring that contains v gives the distance from u to v. A vertex in ring 3 can never be reached in 2 steps, because any 2-step route would have put it in an earlier ring. Of the sections cited below, the Keller and Trotter section on shortest paths is the one that defines distance; the other two give the walks and paths it is built on, and the ring method is worked out here.',
   steps: [
    'Put the start u in ring 0.',
    'Ring 1 is every neighbour of u.',
    'Each next ring is every vertex not yet reached that is a neighbour of a vertex in the ring before.',
    'The distance from u to v is the number of the ring that v first appears in.'
   ],
   example: {
    prompt: 'Roads: 1–2, 1–3, 2–4, 3–4, 4–5 and 5–6. What is the distance from depot 1 to depot 6?',
    steps: [
     'Ring 0 is depot 1, and ring 1 is depots 2 and 3.',
     'Ring 2 is depot 4, a neighbour of both 2 and 3. Ring 3 is depot 5, and ring 4 is depot 6.',
     'Depot 6 first appears in ring 4.'
    ],
    answer: 'The distance is 4 roads.'
   },
   pitfalls: [
    'Counting the depots on the route instead of the roads. A route through 5 depots uses 4 roads.',
    'Taking the first route you find. Another route may use fewer roads; the rings always find the shortest.',
    'Putting a depot in a later ring after it has already been reached. Each depot belongs to the first ring it appears in.'
   ]
  },
  guidance: [
   { prompt: 'Ring 1 is every neighbour of depot 1. Keep adding rings of depots not yet reached. In which ring does depot 6 first appear?', answer: [3], labels: ['distance to the first depot named'], explanation: 'From depot 1: ring 1 is depots 2 and 3; ring 2 is depots 4 and 5; ring 3 is depots 6 and 7. So the distance to depot 6 is 3.' },
   { prompt: 'Carry on with the same rings. In which ring does depot 8 first appear?', answer: [4], labels: ['distance to the second depot'], explanation: 'From depot 1: ring 1 is depots 2 and 3; ring 2 is depots 4 and 5; ring 3 is depots 6 and 7; ring 4 is depot 8. So the distance to depot 8 is 4: no route reaches it with fewer roads.' }
  ]
 },
 {
  id: 'q08', title: 'Road islands after the storm', topic: 'Connected components', tier: 'Basic', sector: 'Rover Depot',
  brief: 'A dust storm has cut the depot roads into separate pieces, and Mira wants to know how few new roads would join them all up again.',
  lesson: 'A graph is connected when every pair of vertices is joined by a path; otherwise it falls into components, and c components need at least c − 1 new edges to join them.',
  prompt: 'After the storm the depot map shows 9 depots, numbered 1 to 9, and only these roads still open: 1–4, 2–3, 2–5, 3–9, 4–7, 5–9, 6–8. Enter the number of components of the road graph, then the fewest new roads that would make it connected.',
  answer: [3, 2], labels: ['components', 'fewest new roads'], tolerance: 0.01,
  hints: [
   'Start at a depot and collect everything it can reach by open roads; that whole piece is one component. A depot with no open road is a component by itself.',
   'Each new road can join at most two pieces into one.'
  ],
  solution: 'The components are: depots 1, 4 and 7; depots 2, 3, 5 and 9; and depots 6 and 8. That is 3 in all. Each new road joins at most two pieces into one, so turning 3 pieces into one takes 3 − 1 = 2 new roads.',
  xp: 100, prereqs: ['q07'],
  artifact: { name: 'Storm damage map', description: 'The road network split into islands, with the fewest links that rejoin them.' },
  sources: [source.kt51, source.o5],
  teaching: {
   intuition: 'A graph is connected when there is a path between every pair of its vertices. A graph that is not connected falls into pieces called components: inside a component every pair of vertices is joined by a path, and no edge leaves it. A lone vertex with no edges is a component by itself. To find the components, start at any vertex and collect everything you can reach, for example ring by ring as in the last mission: that is one component. Then start again from a vertex not reached yet, until every vertex is used. To join c components into one connected graph, notice that a new edge can merge at most two pieces into one, so it lowers the number of components by at most 1. Going from c pieces down to 1 therefore takes at least c − 1 new edges, and c − 1 is enough: link each component to the next, like beads on a string.',
   steps: [
    'Pick a depot not used yet and collect every depot reachable from it by road: that is one component.',
    'Repeat from an unused depot until every depot belongs to a component. A depot with no roads is a component on its own.',
    'Count the components, c.',
    'The fewest new roads that join everything is c − 1, because each new road joins at most two pieces into one.'
   ],
   example: {
    prompt: 'Seven depots with roads 1–2, 2–3 and 4–5, and no others. How many components are there, and how many new roads would join them all?',
    steps: [
     'Depots 1, 2 and 3 form one component, and depots 4 and 5 form another.',
     'Depots 6 and 7 have no roads, so each is a component on its own: 4 components in all.',
     'Joining 4 pieces takes 4 − 1 = 3 new roads.'
    ],
    answer: '4 components, and 3 new roads.'
   },
   pitfalls: [
    'Forgetting depots with no roads at all. Each one is a component of its own.',
    'Answering with the number of components instead of one fewer. The first piece needs no new road; each later piece needs one.',
    'Treating two depots as linked because their numbers are close. Only the listed roads join depots.'
   ]
  },
  guidance: [
   { prompt: 'Start at depot 1 and collect every depot it can reach by open roads. How many depots are in that component?', answer: [3], labels: ["depots in depot 1’s component"], explanation: 'The component of depot 1 is depots 1, 4 and 7: 3 depots.' },
   { prompt: 'Start again from a depot not reached yet, and repeat until every depot is used. How many components are there?', answer: [3], labels: ['components'], explanation: 'The components are: depots 1, 4 and 7; depots 2, 3, 5 and 9; and depots 6 and 8. That is 3 pieces.' },
   { prompt: 'Each new road can join two pieces into one. How many new roads does it take to join 3 pieces into one?', answer: [2], labels: ['fewest new roads'], explanation: 'Every new road lowers the number of pieces by at most 1, so going from 3 to 1 takes 2 roads, for example one from each component to the next.' }
  ]
 },
 {
  id: 'q09', title: 'Sweeping every road once', topic: 'Euler circuits', tier: 'Basic', sector: 'Rover Depot',
  brief: 'The road sweeper has to clear every depot road after the storm, and Mira wants a route that uses each road once and ends back at the garage.',
  lesson: 'A connected graph has an Euler circuit, a circuit that uses every edge exactly once, exactly when every vertex has even degree.',
  prompt: 'The road sweeper starts at the garage in depot 1. The depot map has 7 depots joined by these roads: 1–2, 1–3, 2–3, 2–4, 2–5, 3–4, 3–5, 4–5, 4–6, 5–7, 6–7. Every depot can be reached from every other. Enter the degree of depot 1, then the number of depots of odd degree, then 1 if there is an Euler circuit or 0 if there is not.',
  answer: [2, 0, 1], labels: ['degree of depot 1', 'depots of odd degree', 'Euler circuit (1 or 0)'], tolerance: 0.01,
  hints: [
   'Each time the sweeper passes through a depot it uses one road in and one road out, so the roads at every depot are used up in pairs.',
   'An Euler circuit needs every depot to have even degree; one odd depot rules it out.'
  ],
  solution: 'The degrees are deg(1) = 2, deg(2) = 4, deg(3) = 4, deg(4) = 4, deg(5) = 4, deg(6) = 2, deg(7) = 2. Every degree is even, so no depot is odd. The graph is connected and every degree is even, so an Euler circuit exists: 1.',
  xp: 100, prereqs: ['q02', 'q08'],
  artifact: { name: 'Sweeper’s loop card', description: 'A route over every road once, back to the garage door.' },
  sources: [source.o5],
  teaching: {
   intuition: 'An Euler circuit is a circuit that uses every edge of the graph exactly once: it starts at a vertex, travels along every road one time, and ends where it began. The idea goes back to Leonhard Euler and the seven bridges of Königsberg. Think about one depot in the middle of such a route. Each time the route arrives along one road, it must leave along another, so the roads at that depot are used up in pairs. The start works the same way, because its first departure pairs with the final return. So every depot must have even degree. Euler showed that this is also enough: if a graph is connected and every vertex has even degree, an Euler circuit exists. A single odd-degree vertex rules it out. By the handshake rule the degrees add up to an even number, so the odd-degree vertices always come in an even number: 0, 2, 4 and so on.',
   steps: [
    'Check that the graph is connected: every depot can reach every other.',
    'Work out the degree of every depot.',
    'Count the depots of odd degree.',
    'If there are none, an Euler circuit exists: answer 1. If there are any, it does not: answer 0.'
   ],
   example: {
    prompt: 'Roads: 1–2, 2–3, 3–4, 1–4 and 1–3. Is there an Euler circuit?',
    steps: [
     'The graph is connected. The degrees are deg(1) = 3, deg(2) = 2, deg(3) = 3 and deg(4) = 2.',
     'Depots 1 and 3 have odd degree, so 2 depots are odd.',
     'An odd depot rules out an Euler circuit.'
    ],
    answer: 'No Euler circuit: 2 depots have odd degree.'
   },
   pitfalls: [
    'Checking only the start depot. Every depot must have even degree, not just the one where the route begins.',
    'Thinking a depot of degree 4 is a problem because the route passes it twice. Passing through twice uses 4 roads, which is fine.',
    'Forgetting that the graph must be connected: a road in a separate piece can never be reached.'
   ]
  },
  guidance: [
   { prompt: 'Count the roads that meet depot 1, the garage. What is its degree?', answer: [2], labels: ['degree of depot 1'], explanation: 'The roads 1–2 and 1–3 meet depot 1, so deg(1) = 2.' },
   { prompt: 'Work out the degree of every depot. How many depots have odd degree?', answer: [0], labels: ['depots of odd degree'], explanation: 'The degrees are deg(1) = 2, deg(2) = 4, deg(3) = 4, deg(4) = 4, deg(5) = 4, deg(6) = 2, deg(7) = 2. None of them is odd.' },
   { prompt: 'Enter 1 if every depot has even degree, so that an Euler circuit exists, or 0 if not.', answer: [1], labels: ['Euler circuit (1 or 0)'], explanation: 'The graph is connected and every degree is even, so the sweeper can use every road once and finish back at the garage.' }
  ]
 },
 {
  id: 'q10', title: 'One sweep from depot to depot', topic: 'Euler trails', tier: 'Basic', sector: 'Rover Depot',
  brief: 'The road inspector does not need to come back to the start, and Mira wants to know whether one sweep over every road is possible and where it must begin.',
  lesson: 'A connected graph has an Euler trail, which uses every edge once and ends at a different vertex from its start, exactly when it has exactly two odd-degree vertices; the trail runs from one of them to the other.',
  prompt: 'The road inspector must drive every depot road exactly once, starting and finishing at different depots, so the route must be an Euler trail. The map has 7 depots joined by these roads: 1–2, 1–4, 2–3, 2–4, 3–5, 4–5, 4–6, 5–6, 5–7, 6–7. Every depot can be reached from every other. Enter 1 if an Euler trail exists or 0 if not. Then enter the smaller label of the two depots where it could start, or 0 if there is no Euler trail.',
  answer: [1, 2], labels: ['Euler trail (1 or 0)', 'smaller start depot'], tolerance: 0.01,
  hints: [
   'Only the first and last depots of a trail can have odd degree; every depot in between uses its roads in pairs, one in and one out.',
   'An Euler trail needs exactly two odd depots, and it starts at one of them and finishes at the other.'
  ],
  solution: 'The degrees are deg(1) = 2, deg(2) = 3, deg(3) = 2, deg(4) = 4, deg(5) = 4, deg(6) = 3, deg(7) = 2. Exactly two depots, 2 and 6, have odd degree, so an Euler trail exists: 1. It must start at one of them and finish at the other, and the smaller label is 2.',
  xp: 100, prereqs: ['q09'],
  artifact: { name: 'Inspector’s route', description: 'One drive over every road, from one odd depot to the other.' },
  sources: [source.o6],
  teaching: {
   intuition: 'An Euler trail uses every edge of the graph exactly once but, unlike an Euler circuit, it starts and ends at different vertices; in this realm an Euler trail always means that. At every depot in the middle of the trail the roads are still used in pairs, one in and one out, so those depots have even degree. The start is different: its first road out has no road in to pair with, so the start has odd degree, and so does the end. So a connected graph has an Euler trail exactly when it has exactly two odd-degree vertices, and the trail must start at one of them and finish at the other. With no odd vertices there is an Euler circuit but no Euler trail; with four or more there is neither. To trace the trail by hand, use Fleury’s idea. A bridge is an edge whose removal would increase the number of components. Drive along a bridge of the roads not yet swept only when it is the only unswept road left at the depot you are standing at.',
   steps: [
    'Check that the graph is connected, and work out every degree.',
    'Count the depots of odd degree.',
    'If there are exactly two, an Euler trail exists (answer 1), and it must start at one odd depot and end at the other.',
    'If there are none, or four or more, there is no Euler trail (answer 0).'
   ],
   example: {
    prompt: 'Roads: 1–2, 1–3, 2–3, 2–4 and 3–4. Is there an Euler trail, and where can it start?',
    steps: [
     'The degrees are deg(1) = 2, deg(2) = 3, deg(3) = 3 and deg(4) = 2.',
     'Exactly two depots, 2 and 3, have odd degree, so an Euler trail exists.',
     'It runs from one odd depot to the other, for example 2, 1, 3, 2, 4, 3.'
    ],
    answer: 'Yes, starting at depot 2 or depot 3; the smaller label is 2.'
   },
   pitfalls: [
    'Answering yes for a graph with no odd depots. That graph has an Euler circuit, but an Euler trail here must end somewhere other than its start.',
    'Starting at an even depot. The route gets stuck before the last road.',
    'Thinking four odd depots allow a trail. Only the two ends of a trail can be odd.'
   ]
  },
  guidance: [
   { prompt: 'Work out the degree of every depot. How many depots have odd degree?', answer: [2], labels: ['depots of odd degree'], explanation: 'The degrees are deg(1) = 2, deg(2) = 3, deg(3) = 2, deg(4) = 4, deg(5) = 4, deg(6) = 3, deg(7) = 2. The odd ones are depots 2 and 6.' },
   { prompt: 'Enter 1 if exactly two depots have odd degree, so that an Euler trail exists, or 0 if not.', answer: [1], labels: ['Euler trail (1 or 0)'], explanation: 'Exactly two depots are odd, and the graph is connected, so an Euler trail exists.' },
   { prompt: 'Enter the smaller label of the two odd depots if there are exactly two, or 0 if there is no Euler trail.', answer: [2], labels: ['smaller start depot'], explanation: 'The trail runs from depot 2 to depot 6 or back the other way, so the smaller start label is 2.' }
  ]
 }
);
})();
