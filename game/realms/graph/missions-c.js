/* Graph theory: networks missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/graph/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · The nearest-neighbour method [O12.9]
     q22  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · Hamilton paths and Dirac's theorem [O12.8, KT5.3]
     q23  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · Chapter review: the dispatch plan [O12.7, O12.9]
     q24  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · Planar graphs and Euler's formula [KT5.5]
     q25  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · The edge limit for planar graphs [KT5.5]
     q26  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · Polyhedra from Euler's formula [KT5.5]
     q27  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · Bipartite graphs and odd cycles [KT5.4]
     q28  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · Colouring and the chromatic number [O12.4, KT5.4]
     q29  ch 5 Planarity and colouring · Intermediate, 150 XP · sector 'Circuit Shop' · Chapter review: scheduling by colouring [KT5.4]
     q30  ch 6 Matching and flow · Advanced, 200 XP · sector 'Pumping Station' · Matchings in bipartite graphs [KT14.2] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 12; Keller and Trotter, Applied Combinatorics (KT sections at https://www.rellek.net/book/<page>.html) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Applied Combinatorics/ (OpenStax and Keller and Trotter).
   A title reads like: OpenStax Contemporary Mathematics — 12.5 Euler Circuits
   Link to the section page itself: https://openstax.org/books/contemporary-mathematics/pages/<section-slug> */
const source = {
 o12_4: { title: 'OpenStax Contemporary Mathematics — 12.4 Navigating Graphs', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-4-navigating-graphs', description: 'Graph colourings, the chromatic number, scheduling by colouring and the four colour theorem.', verified: '2026-11-27' },
 o12_7: { title: 'OpenStax Contemporary Mathematics — 12.7 Hamilton Cycles', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-7-hamilton-cycles', description: 'Hamilton cycles, their count in complete graphs, and weighted graphs with the total weight of a route.', verified: '2026-11-27' },
 o12_8: { title: 'OpenStax Contemporary Mathematics — 12.8 Hamilton Paths', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-8-hamilton-paths', description: 'Hamilton paths: paths that visit every vertex exactly once, and how they differ from Euler trails.', verified: '2026-11-27' },
 o12_9: { title: 'OpenStax Contemporary Mathematics — 12.9 Traveling Salesperson Problem', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-9-traveling-salesperson-problem', description: 'The travelling salesperson problem, the brute force method and the nearest neighbor method.', verified: '2026-11-27' },
 kt5_3: { title: 'Keller and Trotter, Applied Combinatorics — 5.3 Eulerian and Hamiltonian Graphs', url: 'https://www.rellek.net/book/s_graphs_eulerham.html', description: 'Hamiltonian cycles and Dirac’s theorem (Theorem 5.19): n ≥ 3 vertices, each with at least ⌈n ÷ 2⌉ neighbours.', verified: '2026-11-27' },
 kt5_4: { title: 'Keller and Trotter, Applied Combinatorics — 5.4 Graph Coloring', url: 'https://www.rellek.net/book/s_graphs_color.html', description: 'Proper colourings, the chromatic number, cliques, bipartite graphs, K_{m,n}, and 2-colourable exactly when there is no odd cycle (Theorem 5.22).', verified: '2026-11-27' },
 kt5_5: { title: 'Keller and Trotter, Applied Combinatorics — 5.5 Planar Graphs', url: 'https://www.rellek.net/book/s_graphs_planar.html', description: 'Planar graphs, faces, Euler’s formula (Theorem 5.33), the 3n − 6 edge limit (Theorem 5.34) and the face-length count that rules out K_{3,3}.', verified: '2026-11-27' },
 kt12_3: { title: 'Keller and Trotter, Applied Combinatorics — 12.3 Dijkstra’s Algorithm for Shortest Paths', url: 'https://www.rellek.net/book/s_graphalgorithms_shortest-paths.html', description: 'Dijkstra’s algorithm for shortest paths with non-negative weights (stated for directed graphs; a two-way road is a pair of arcs).', verified: '2026-11-27' },
 kt14_2: { title: 'Keller and Trotter, Applied Combinatorics — 14.2 Matchings in Bipartite Graphs', url: 'https://www.rellek.net/book/s_flowapplications_bip-match.html', description: 'Matchings in bipartite graphs, finding a largest matching, and Hall’s theorem.', verified: '2026-11-27' },
 levin4_3: { title: 'Levin, Discrete Mathematics: An Open Introduction — 4.3 Planar Graphs', url: 'https://discrete.openmathbooks.org/dmoi3/sec_planar.html', description: 'Euler’s formula applied to convex polyhedra, and the five regular polyhedra (Theorem 4.3.4).', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'The rover that always takes the nearest road', topic: 'The nearest-neighbour method', tier: 'Intermediate', sector: 'Dispatch',
  brief: 'The rover crew want a quick rule for the daily tour of the outlying stations, and Mira wants to know how much distance the quick rule wastes.',
  lesson: 'The nearest-neighbour method builds a tour by always driving to the nearest unvisited station; it is fast, but it does not always find the shortest tour.',
  prompt: 'Dispatch has to send one rover on a tour of the five outlying stations, numbered 1 to 5: it starts at station 1, visits every other station once and returns to station 1. Every pair of stations is joined by a direct road; the road lengths in km are 1–2: 7, 1–3: 3, 1–4: 15, 1–5: 9, 2–3: 6, 2–4: 11, 2–5: 4, 3–4: 13, 3–5: 12, 4–5: 5. All ten road lengths are different, so there is never a tie for the nearest unvisited station. Use the nearest-neighbour method starting at station 1, and enter the length of the tour it gives, in km. Then enter how many km longer that tour is than the shortest possible tour.',
  answer: [33, 1], labels: ['nearest-neighbour tour (km)', 'longer than the best (km)'], tolerance: 0.01,
  hints: [
   'From the station you are at, drive to the nearest station you have not visited yet. When every station has been visited, drive back to the start.',
   'For the shortest tour, use brute force: list the 12 tours from the start (a tour and its reverse have the same length), add up the roads of each, and take the smallest. Then subtract.'
  ],
  solution: 'From station 1 the nearest unvisited station is 3 (3 km); from 3 the nearest unvisited station is 2 (6 km); from 2 the nearest unvisited station is 5 (4 km); from 5 the nearest unvisited station is 4 (5 km); then back from 4 to 1 (15 km). The nearest-neighbour tour 1 → 3 → 2 → 5 → 4 → 1 is 3 + 6 + 4 + 5 + 15 = 33 km. Brute force lists the 12 tours from station 1, each with its reverse counted once: 1 → 2 → 3 → 4 → 5 → 1 is 40, 1 → 2 → 3 → 5 → 4 → 1 is 45, 1 → 2 → 4 → 3 → 5 → 1 is 52, 1 → 2 → 4 → 5 → 3 → 1 is 38, 1 → 2 → 5 → 3 → 4 → 1 is 51, 1 → 2 → 5 → 4 → 3 → 1 is 32, 1 → 3 → 2 → 4 → 5 → 1 is 34, 1 → 3 → 2 → 5 → 4 → 1 is 33, 1 → 3 → 4 → 2 → 5 → 1 is 40, 1 → 3 → 5 → 2 → 4 → 1 is 45, 1 → 4 → 2 → 3 → 5 → 1 is 53, 1 → 4 → 3 → 2 → 5 → 1 is 47. The shortest is 1 → 2 → 5 → 4 → 3 → 1 at 32 km, so the nearest-neighbour tour is 33 − 32 = 1 km longer.',
  xp: 150, prereqs: ['q20'],
  artifact: { name: 'Quick-route card', description: 'A rule of thumb for the daily tour, and a note of what it costs.' },
  sources: [source.o12_9],
  teaching: {
   intuition: 'Brute force finds the shortest tour by checking every one, but the number of tours grows very fast: 5 stations give 12 tours, and 10 stations give 181440. A quicker idea is to be greedy: from wherever you are, drive to the nearest station you have not visited yet, and when every station is done, drive back to the start. This is the nearest-neighbour method. It needs only one look at each step, so it is fast even for big networks. The catch is that it never looks ahead. Taking a short road now can leave you far from home with only long roads left. So the nearest-neighbour tour is usually good but not always the shortest, and on a small network brute force shows how much it misses by.',
   steps: [
    'Start at the given station and mark it visited.',
    'Look at the roads from where you are to the stations not yet visited, and take the shortest one. Mark the station at its end as visited.',
    'Repeat until every station is visited, then take the road back to the start. Add up the roads: that is the nearest-neighbour tour.',
    'To judge it, find the shortest tour by brute force and subtract.'
   ],
   example: {
    prompt: 'Four stations, every pair joined. Road lengths in km: 1–2: 2, 1–3: 4, 1–4: 7, 2–3: 3, 2–4: 5, 3–4: 9. Use the nearest-neighbour method from station 1, then compare it with the shortest tour.',
    steps: [
     'From 1 the nearest station is 2 (2 km). From 2 the unvisited stations are 3 (3 km) and 4 (5 km), so go to 3. From 3 only 4 is left (9 km), and the road from 4 back to 1 is 7 km.',
     'The nearest-neighbour tour 1 → 2 → 3 → 4 → 1 is 2 + 3 + 9 + 7 = 21 km.',
     'Brute force: 1 → 2 → 3 → 4 → 1 is 21, 1 → 2 → 4 → 3 → 1 is 20 and 1 → 3 → 2 → 4 → 1 is 19. The shortest is 19 km.'
    ],
    answer: 'The nearest-neighbour tour is 21 km, which is 2 km longer than the shortest tour of 19 km.'
   },
   pitfalls: [
    'Choosing the nearest station of all instead of the nearest one not yet visited.',
    'Forgetting the last road back to the start when adding up the tour.',
    'Assuming the nearest-neighbour tour is the shortest. It often is not, so check by brute force when the network is small.'
   ]
  },
  guidance: [
   { prompt: 'Start at station 1. Which station is nearest to it, and how long is that road?', answer: [3, 3], labels: ['nearest station', 'road length (km)'], explanation: 'The four roads out of station 1 are 1–2: 7, 1–3: 3, 1–4: 15, 1–5: 9. The shortest goes to station 3, 3 km.' },
   { prompt: 'Keep going to the nearest unvisited station each time, then return to the start. How long is the whole nearest-neighbour tour?', answer: [33], labels: ['nearest-neighbour tour (km)'], explanation: 'The tour is 1 → 3 → 2 → 5 → 4 → 1, and its roads add up to 3 + 6 + 4 + 5 + 15 = 33 km.' },
   { prompt: 'Now list the 12 tours from station 1 and add up each one. How long is the shortest tour?', answer: [32], labels: ['shortest tour (km)'], explanation: 'The shortest of the 12 is 1 → 2 → 5 → 4 → 3 → 1: 32 km. The nearest-neighbour tour is 1 km longer: each step looks only at the next road, so the method can be forced onto long roads later.' }
  ]
 },
 {
  id: 'q22', title: 'One message past every relay', topic: 'Hamilton paths and Dirac’s theorem', tier: 'Intermediate', sector: 'Dispatch',
  brief: 'Mira wants a relay order that passes a radio message through every station, and a quick check that tells her when such an order must exist.',
  lesson: 'A Hamilton path visits every vertex exactly once; Dirac’s theorem says a simple network on n ≥ 3 vertices in which every degree is at least n ÷ 2 has a Hamilton cycle.',
  prompt: 'Dispatch’s radio network links 7 relay stations, numbered 1 to 7. There is at most one link between two stations and no link from a station to itself. The links are 1–2, 1–4, 1–6, 1–7, 2–3, 2–5, 2–7, 3–4, 3–5, 3–6, 4–5, 4–7, 5–6 and 6–7. Enter the smallest degree in the network: the fewest links at any one station. Then enter 1 if Dirac’s theorem guarantees a Hamilton cycle through all 7 stations, or 0 if the theorem gives no guarantee.',
  answer: [4, 1], labels: ['smallest degree', 'Dirac guarantees (1 or 0)'], tolerance: 0.01,
  hints: [
   'The degree of a station is the number of links that end at it. Count the links at every station and keep the smallest count.',
   'Dirac’s theorem needs every degree to be at least half the number of stations. When half is not a whole number, a degree must reach the next whole number up.'
  ],
  solution: 'The degrees of stations 1 to 7 are 4, 4, 4, 4, 4, 4 and 4, so the smallest degree is 4 (at stations 1, 2, 3, 4, 5, 6 and 7). Half the number of stations is 7 ÷ 2 = 3.5. 4 is at least 3.5, so Dirac’s theorem guarantees a Hamilton cycle, and so a Hamilton path as well: enter 1.',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Relay order sheet', description: 'Every relay station in one line, and the degree count that proves it can be done.' },
  sources: [source.o12_8, source.kt5_3],
  teaching: {
   intuition: 'A Hamilton cycle visits every vertex exactly once and comes back to its start. Leave out the last step home and you have a Hamilton path: a path that visits every vertex exactly once and may end anywhere. For most networks there is no quick test for either; you have to search. But some networks have so many links that a Hamilton cycle cannot be avoided, and Dirac’s theorem makes this exact. Take a simple network, with no loops and no two links joining the same pair, on n vertices, where n is at least 3. If every vertex has degree at least n ÷ 2, then the network has a Hamilton cycle. The theorem works one way only: if some degree is smaller, it gives no answer, and a Hamilton cycle may or may not exist. Dirac’s theorem is from the Keller and Trotter section cited below; the OpenStax section covers Hamilton paths but not the theorem.',
   steps: [
    'Count the links at each vertex to get every degree, and find the smallest.',
    'Work out n ÷ 2, half the number of vertices. When n is odd this is not a whole number, so a degree must reach the next whole number up.',
    'If the smallest degree is at least n ÷ 2, Dirac’s theorem guarantees a Hamilton cycle, and leaving out any one link of that cycle gives a Hamilton path.',
    'If the smallest degree is below n ÷ 2, the theorem says nothing either way.'
   ],
   example: {
    prompt: 'Five stations have links 1–2, 1–3, 1–4, 2–3, 2–5, 3–4, 3–5 and 4–5. Does Dirac’s theorem guarantee a Hamilton cycle?',
    steps: [
     'The degrees of stations 1 to 5 are 3, 3, 4, 3 and 3, so the smallest degree is 3.',
     'Half of 5 is 2.5, and 3 is at least 2.5.',
     'So Dirac’s theorem guarantees a Hamilton cycle. One is 1 → 2 → 5 → 4 → 3 → 1.'
    ],
    answer: 'Yes: the smallest degree, 3, is at least 2.5.'
   },
   pitfalls: [
    'Reading a 0 as “there is no Hamilton cycle”. Dirac’s theorem only guarantees; when its condition fails, a cycle may still exist.',
    'Comparing with half the stations rounded down. With 7 stations half is 3.5, so a degree of 3 is not enough.',
    'Checking only some stations. The condition must hold at every station, so the smallest degree decides.'
   ]
  },
  guidance: [
   { prompt: 'Count the links at each station. What is the smallest degree?', answer: [4], labels: ['smallest degree'], explanation: 'Station by station the degrees are 4, 4, 4, 4, 4, 4 and 4. The smallest is 4.' },
   { prompt: 'Dirac’s theorem compares the smallest degree with half the number of stations. What is 7 ÷ 2?', answer: [3.5], labels: ['n ÷ 2'], explanation: '7 ÷ 2 = 3.5. A degree is a whole number, so it must be at least 4.' },
   { prompt: 'Is the smallest degree, 4, at least 3.5? Enter 1 for yes, 0 for no.', answer: [1], labels: ['Dirac guarantees (1 or 0)'], explanation: 'Yes. Every station has at least 4 links, so Dirac’s theorem guarantees a Hamilton cycle.' }
  ]
 },
 {
  id: 'q23', title: 'The dispatch board', topic: 'Chapter review: the dispatch plan', tier: 'Intermediate', sector: 'Dispatch',
  brief: 'Before the new season, Dispatch wants the shortest road from the depot to the far station and the shortest drone tour of the masts, both on one board.',
  lesson: 'Dijkstra’s algorithm gives the shortest path between two stations; brute force over every tour gives the shortest tour of a few stations.',
  prompt: 'Dispatch’s road map links six stations, numbered 1 to 6. The two-way roads and their lengths in km are 1–2: 8, 1–3: 3, 2–3: 4, 2–4: 9, 2–5: 6, 3–5: 7, 4–5: 2, 4–6: 10, 5–6: 8. A rover leaves the depot at station 1: enter the shortest driving distance from station 1 to station 6, in km. On a separate run, a drone visits four masts, numbered 1 to 4, flying straight between any two of them. The flight lengths in km are 1–2: 6, 1–3: 9, 1–4: 7, 2–3: 5, 2–4: 11, 3–4: 8. Enter the length of the shortest tour that starts at mast 1, visits every mast once and returns to mast 1.',
  answer: [18, 26], labels: ['shortest distance to 6 (km)', 'shortest tour (km)'], tolerance: 0.01,
  hints: [
   'Dijkstra’s algorithm: settle the station with the smallest distance so far, then check whether going through it shortens the distance to each of its neighbours. Repeat until station 6 is settled.',
   'Four masts give (4 − 1)! ÷ 2 = 3 different tours from mast 1 once reverses are merged. Add up the flights of each and take the smallest.'
  ],
  solution: 'Dijkstra’s algorithm settles the stations in order of distance from station 1: station 1 at 0, station 3 at 3, station 2 at 7, station 5 at 10, station 4 at 12, station 6 at 18. The shortest distance to station 6 is 18 km, along 1 → 3 → 5 → 6. For the drone, the three tours from mast 1 are 1 → 2 → 3 → 4 → 1 = 26, 1 → 2 → 4 → 3 → 1 = 34, 1 → 3 → 2 → 4 → 1 = 32. The shortest is 26 km.',
  xp: 150, prereqs: ['q18', 'q21'],
  artifact: { name: 'Dispatch board', description: 'One road route and one tour, each the shortest of its kind.' },
  sources: [source.o12_7, source.o12_9, source.kt12_3],
  teaching: {
   intuition: 'This chapter has two kinds of route. A shortest path gets from one station to another as cheaply as possible and need not visit anything else. Dijkstra’s algorithm finds it by settling stations in order of distance: the nearest station not yet settled is settled for good, and then every road out of it is checked to see whether it gives a shorter way to a neighbour. A tour is different. It must visit every station and come home, so it is a Hamilton cycle, and its length is the sum of its roads. With only a few stations, brute force lists every tour and picks the shortest; with n stations there are (n − 1)! ÷ 2 tours once each is merged with its reverse. The nearest-neighbour method is a quick guess, but it can miss, so on a small network brute force is the safe choice.',
   steps: [
    'For the shortest path, start Dijkstra’s algorithm at the depot with distance 0.',
    'Settle the unsettled station with the smallest distance so far, then check each road out of it: if going through it is shorter, update the neighbour’s distance. Repeat until the target is settled.',
    'For the tour, list every tour from the start once, add up its roads and take the smallest.'
   ],
   example: {
    prompt: 'Roads in km: 1–2: 5, 1–3: 2, 2–3: 2, 2–4: 4, 3–4: 8. Find the shortest distance from station 1 to station 4. Then four masts have flights 1–2: 3, 1–3: 6, 1–4: 4, 2–3: 5, 2–4: 7, 3–4: 2. Find the shortest tour from mast 1.',
    steps: [
     'Settle 1 at 0: station 2 gets 5 and station 3 gets 2. Settle 3 at 2: through it, station 2 drops to 4 and station 4 gets 10.',
     'Settle 2 at 4: through it, station 4 drops to 8. Settle 4 at 8, along 1 → 3 → 2 → 4.',
     'Tours: 1 → 2 → 3 → 4 → 1 = 14, 1 → 2 → 4 → 3 → 1 = 18 and 1 → 3 → 2 → 4 → 1 = 22.'
    ],
    answer: 'The shortest distance is 8 km and the shortest tour is 14 km.'
   },
   pitfalls: [
    'Settling a station too early. A station is final only when it has the smallest distance of all the unsettled stations.',
    'Taking the direct road as the shortest. A route through other stations can be shorter.',
    'Counting a tour and its reverse as two different tours, or leaving out the flight back to the start.'
   ]
  },
  guidance: [
   { prompt: 'Start Dijkstra’s algorithm at station 1. What are the shortest distances from station 1 to stations 2 and 3?', answer: [7, 3], labels: ['distance to 2 (km)', 'distance to 3 (km)'], explanation: 'Station 2: 7 km, along 1 → 3 → 2. Station 3: 3 km, along 1 → 3.' },
   { prompt: 'Carry on settling stations, nearest first. What is the shortest distance from station 1 to station 6?', answer: [18], labels: ['shortest distance to 6 (km)'], explanation: 'The stations settle as 1 (0), 3 (3), 2 (7), 5 (10), 4 (12), 6 (18). Station 6 is reached along 1 → 3 → 5 → 6, 18 km.' },
   { prompt: 'For the drone, add up each of the three tours from mast 1. How long is the shortest?', answer: [26], labels: ['shortest tour (km)'], explanation: '1 → 2 → 3 → 4 → 1 = 26; 1 → 2 → 4 → 3 → 1 = 34; 1 → 3 → 2 → 4 → 1 = 32. The smallest is 26 km.' }
  ]
 },
 {
  id: 'q24', title: 'Counting the regions of a board', topic: 'Planar graphs and Euler’s formula', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'The Circuit Shop prints its wiring in one flat layer, and Mira wants to know how many separate regions each layout leaves on the board.',
  lesson: 'A network is planar when it can be drawn with no crossing edges; a connected plane drawing with V vertices, E edges and F faces always has V − E + F = 2.',
  prompt: 'A circuit board’s wiring is a connected network of 9 junctions and 14 wires, drawn flat on the board so that no two wires cross. The wires divide the board into regions called faces, and the region outside all the wires counts as one face. Enter the number of faces. The designer then adds 2 more wires, each joining two junctions that are already there, still with no crossings. Enter the number of faces after that.',
  answer: [7, 9], labels: ['faces', 'faces after the new wires'], tolerance: 0.01,
  hints: [
   'Euler’s formula for a connected plane drawing: vertices − edges + faces = 2, or V − E + F = 2. Solve it for F.',
   'Each new wire that joins two existing junctions without crossing cuts one face into two.'
  ],
  solution: 'Euler’s formula says V − E + F = 2, so F = 2 − V + E = 2 − 9 + 14 = 7. With 2 more wires there are 16 edges and still 9 vertices, so F = 2 − 9 + 16 = 9: each new wire split one face in two, adding 2 faces.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Single-layer board', description: 'A wiring plan with no crossings, and its faces counted.' },
  sources: [source.kt5_5],
  teaching: {
   intuition: 'A circuit board has only one layer, so its wires must never cross. A network that can be drawn flat with no two edges crossing is called planar, and such a drawing is called a plane drawing. The edges of a plane drawing cut the sheet into regions called faces, and the unbounded region outside everything counts as a face too. Euler found that the counts are tied together. For any connected plane drawing, V − E + F = 2, where V is the number of vertices, E the number of edges and F the number of faces. A tree is the simplest check: it has V − 1 edges and only the outside face, so V − (V − 1) + 1 = 2. Each time you add an edge between two vertices of a connected drawing without crossing, it splits one face into two, so E and F both go up by 1 and the formula still balances.',
   steps: [
    'Check that the drawing is connected and has no crossings: Euler’s formula is only for such drawings.',
    'Count the vertices V and the edges E.',
    'Rearrange V − E + F = 2 to F = 2 − V + E. The outside region is one of the faces.'
   ],
   example: {
    prompt: 'A connected plane drawing has 6 vertices and 8 edges. How many faces does it have?',
    steps: [
     'Euler’s formula: 6 − 8 + F = 2.',
     'So F = 2 − 6 + 8 = 4.'
    ],
    answer: '4 faces, one of them the outside region.'
   },
   pitfalls: [
    'Forgetting the outside region. It is a face, so a single closed loop has 2 faces, not 1.',
    'Using the formula on a drawing with crossings, or on a network in separate pieces. Neither has to satisfy V − E + F = 2.',
    'Mixing up the signs: it is V minus E plus F.'
   ]
  },
  guidance: [
   { prompt: 'Euler’s formula is V − E + F = 2. What is E − V for 9 junctions and 14 wires?', answer: [5], labels: ['E − V'], explanation: '14 − 9 = 5.' },
   { prompt: 'Rearranged, F = 2 + E − V. How many faces does the drawing have?', answer: [7], labels: ['faces'], explanation: 'F = 2 + 5 = 7, counting the outside region.' },
   { prompt: 'After 2 more wires, the drawing has 16 edges. How many faces does it have now?', answer: [9], labels: ['faces after the new wires'], explanation: 'F = 2 − 9 + 16 = 9.' }
  ]
 },
 {
  id: 'q25', title: 'Too many wires for one layer', topic: 'The edge limit for planar graphs', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'A new controller needs a lot of wires, and the Circuit Shop wants to know before drawing anything whether one flat layer could ever hold them.',
  lesson: 'A simple planar network with V ≥ 3 vertices has at most 3V − 6 edges, and at most 2V − 4 when it has no triangles.',
  prompt: 'A circuit layout has 12 components and 31 wires. Each wire joins two different components, no two wires join the same pair, and the layout is connected. Enter the largest number of wires a planar layout with 12 components can have. Then enter 1 if 31 wires is within that limit, so the count does not rule out a flat layout, or 0 if it is over the limit, so the layout can never be drawn without crossings.',
  answer: [30, 0], labels: ['most wires (planar)', 'within the limit (1 or 0)'], tolerance: 0.01,
  hints: [
   'In a flat drawing every face has at least three edges round it, and each edge borders at most two faces. Put that together with Euler’s formula.',
   'The limit is 3V − 6. A count at or below the limit passes; above it, the layout is not planar.'
  ],
  solution: 'Every face has at least 3 edges round it and each edge borders at most two faces, so 3F ≤ 2E. With Euler’s formula F = 2 − V + E this gives E ≤ 3V − 6. For 12 components the limit is 3 × 12 − 6 = 30. 31 is more than 30, so the layout cannot be planar: enter 0.',
  xp: 150, prereqs: ['q24'],
  artifact: { name: 'Layer check', description: 'One quick count that tells a designer when a second layer is unavoidable.' },
  sources: [source.kt5_5],
  teaching: {
   intuition: 'Euler’s formula also limits how many edges a planar network can have. Take a connected plane drawing of a simple network, with no loops and no two edges joining the same pair, on at least 3 vertices, with at least one closed loop. Walk round the border of any face and you meet at least 3 edges, because a closed loop needs at least 3 different vertices. Each edge has two sides, so it borders at most 2 faces. Counting edge sides two ways gives 3F ≤ 2E, where ≤ means “is at most”. Now put in F = 2 − V + E from Euler’s formula: 3(2 − V + E) ≤ 2E, which tidies up to E ≤ 3V − 6. If the network has no triangle, meaning no three vertices all joined to one another, every face needs at least 4 edges, so 4F ≤ 2E, and the same steps give E ≤ 2V − 4. A network with more edges than its limit can never be drawn flat. One within the limit might still be impossible for other reasons, so passing the count does not prove a network is planar.',
   steps: [
    'Decide which limit applies: 3V − 6 in general, or 2V − 4 when there are no triangles.',
    'Work out the limit for the given number of vertices.',
    'Compare: an edge count above the limit proves the network is not planar; a count at or below the limit does not rule it out.'
   ],
   example: {
    prompt: 'A network has 8 vertices, no triangles and 13 edges. Could it be planar?',
    steps: [
     'With no triangles the limit is 2V − 4 = 2 × 8 − 4 = 12.',
     '13 is more than 12.'
    ],
    answer: 'No: 13 edges is over the limit of 12, so the network cannot be drawn without crossings.'
   },
   pitfalls: [
    'Using 3V − 6 when there are no triangles. The no-triangle limit 2V − 4 is lower and catches more networks.',
    'Treating a count within the limit as proof that the network is planar. The limit only rules networks out.',
    'Working out 3V − 6 as 3 × (V − 6). Multiply first, then subtract 6.'
   ]
  },
  guidance: [
   { prompt: 'What is the fewest edges that can run round one face of this layout?', answer: [3], labels: ['edges round a face'], explanation: 'A face needs a closed loop round it, and the shortest loop between different components is a triangle: three edges.' },
   { prompt: 'The limit is 3V − 6. What is it for 12 components?', answer: [30], labels: ['most wires (planar)'], explanation: '3 × 12 − 6 = 30.' },
   { prompt: 'Is 31 at most 30? Enter 1 for yes, 0 for no.', answer: [0], labels: ['within the limit (1 or 0)'], explanation: 'No: 31 wires is too many for any flat layout of 12 components.' }
  ]
 },
 {
  id: 'q26', title: 'The cage of identical panels', topic: 'Polyhedra from Euler’s formula', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'The sensor cages are built from identical flat panels, and the stores need to know how many joints, struts and panels each cage takes.',
  lesson: 'A polyhedron with no holes obeys V − E + F = 2; when every face has p edges and q faces meet at every corner, pF = 2E and qV = 2E fix all three counts.',
  prompt: 'The Circuit Shop is building a sensor cage shaped like a polyhedron: a closed solid with flat faces, straight edges and no holes through it, so its corners and edges can be drawn flat as a connected plane drawing. Every face is a pentagon (5 edges), and exactly 3 faces meet at every corner. Enter the number of corners V, then of edges E, then of faces F.',
  answer: [20, 30, 12], labels: ['corners V', 'edges E', 'faces F'], tolerance: 0.01,
  hints: [
   'Count edge ends two ways. Each face has p edges and each edge borders 2 faces, so pF = 2E. Each corner has q edges and each edge has 2 ends, so qV = 2E.',
   'Put F = 2E ÷ p and V = 2E ÷ q into V − E + F = 2. Multiplying through by pq gives E = 2pq ÷ (2p + 2q − pq).'
  ],
  solution: 'Each face has 5 edges and each edge borders 2 faces, so 5F = 2E. At each corner 3 faces meet, so 3 edges meet, and each edge has 2 ends, so 3V = 2E. Euler’s formula V − E + F = 2 then gives E = 2pq ÷ (2p + 2q − pq) = 30 ÷ (10 + 6 − 15) = 30 ÷ 1 = 30. So V = 2 × 30 ÷ 3 = 20 and F = 2 × 30 ÷ 5 = 12. Check: 20 − 30 + 12 = 2. The solid is the dodecahedron.',
  xp: 150, prereqs: ['q25'],
  artifact: { name: 'Panel order', description: 'Corners, struts and panels for a cage, worked out before it is built.' },
  sources: [source.kt5_5, source.levin4_3],
  teaching: {
   intuition: 'A polyhedron is a closed solid made of flat faces that meet along straight edges, such as a cube or a pyramid. If it has no holes through it, imagine cutting out one face and stretching the rest of the surface flat, like a rubber sheet. Its corners and edges become a connected plane drawing, and the face you cut out becomes the outside region, so the faces of the solid are exactly the faces of the drawing. So Euler’s formula V − E + F = 2 holds, with V corners, E edges and F faces. When every face has the same number of edges, p, and the same number of faces, q, meet at every corner, we can count edge ends two ways. Each face has p edges and each edge borders 2 faces, so pF = 2E. At each corner q edges meet and each edge has 2 ends, so qV = 2E. Putting F = 2E ÷ p and V = 2E ÷ q into Euler’s formula leaves only E to find, and multiplying through by pq gives E = 2pq ÷ (2p + 2q − pq).',
   steps: [
    'Read off p, the number of edges round each face, and q, the number of faces at each corner (the same as the number of edges there).',
    'Work out E = 2pq ÷ (2p + 2q − pq), finding the bottom of the fraction first.',
    'Then V = 2E ÷ q and F = 2E ÷ p. Check that V − E + F = 2.',
    'For a prism, count the corners and faces directly and get the edges from Euler’s formula: E = V + F − 2.'
   ],
   example: {
    prompt: 'A cube has square faces (4 edges each), and 3 faces meet at every corner. Find V, E and F.',
    steps: [
     'E = 2 × 4 × 3 ÷ (8 + 6 − 12) = 24 ÷ 2 = 12.',
     'V = 2 × 12 ÷ 3 = 8 and F = 2 × 12 ÷ 4 = 6.',
     'Check: 8 − 12 + 6 = 2.'
    ],
    answer: '8 corners, 12 edges and 6 faces.'
   },
   pitfalls: [
    'Forgetting that each edge is shared. Counting p edges for every face counts each edge twice, once from each face beside it, so pF = 2E, not E.',
    'Mixing up p and q: p is the number of edges round one face, q the number of faces at one corner.',
    'Counting only the edges round the two ends of a prism. The edges running between the ends count too.'
   ]
  },
  guidance: [
   { prompt: 'Work out the bottom of the fraction, 2p + 2q − pq, for p = 5 and q = 3.', answer: [1], labels: ['2p + 2q − pq'], explanation: '10 + 6 − 15 = 1.' },
   { prompt: 'E = 2pq ÷ (2p + 2q − pq). How many edges does the cage have?', answer: [30], labels: ['edges E'], explanation: '2 × 5 × 3 = 30, and 30 ÷ 1 = 30.' },
   { prompt: 'Use qV = 2E and pF = 2E. How many corners and faces are there?', answer: [20, 12], labels: ['corners V', 'faces F'], explanation: 'V = 60 ÷ 3 = 20 and F = 60 ÷ 5 = 12.' }
  ]
 },
 {
  id: 'q27', title: 'Two banks of chips', topic: 'Bipartite graphs and odd cycles', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'The new chip racks have two banks, and every wire has to cross from one bank to the other.',
  lesson: 'A network is bipartite when its vertices split into two sides with every edge running between them, which happens exactly when it has no odd cycle; K_{m,n} has m × n edges.',
  prompt: 'The Circuit Shop wants to split 7 chips, numbered 1 to 7, into two banks so that every wire runs from one bank to the other and none stays inside a bank. The wires are 1–3, 1–5, 2–3, 2–6, 3–4, 4–5, 4–7, 5–6 and 6–7. Enter 1 if the network is bipartite (such a split exists), or 0 if it is not. Then a test rig joins each of 4 probes to each of 6 sockets by one wire, making the complete bipartite graph K_{4,6}. Enter its number of wires.',
  answer: [0, 24], labels: ['bipartite (1 or 0)', 'wires in the test rig'], tolerance: 0.01,
  hints: [
   'Put chip 1 in bank A, every neighbour of it in bank B, their other neighbours in bank A, and so on. If a wire ever joins two chips of the same bank, the network is not bipartite: that wire closes an odd cycle.',
   'In K_{m,n} each of the m vertices on one side is joined to each of the n vertices on the other side, and there are no other edges.'
  ],
  solution: 'The network has the odd cycle 2 → 3 → 1 → 5 → 6 → 2, with 5 wires. Going round it the banks would have to alternate A, B, A, … and an odd number of steps cannot end back where it started, so no split exists: enter 0. In K_{4,6} each of the 4 probes has 6 wires, so there are 4 × 6 = 24 wires.',
  xp: 150, prereqs: ['q07'],
  artifact: { name: 'Two-bank rack', description: 'A wiring plan split into two banks, with every wire crossing between them.' },
  sources: [source.kt5_4],
  teaching: {
   intuition: 'Sometimes the vertices of a network fall into two groups and every edge runs from one group to the other, never inside a group: chips and sockets, crew and tasks, probes and pins. Such a network is called bipartite, and the two groups are its sides. To test a network, try to build the sides. Put one vertex on side A; all its neighbours must go on side B; their other neighbours go back on side A; and so on, until every vertex that can be reached has a side. Either every edge ends up between the sides, or some edge joins two vertices on the same side. A cycle is a path that comes back to where it started through different vertices, and it is odd when it has an odd number of edges. Going round a cycle the sides must alternate A, B, A, B, so an odd cycle can never close up. In fact a network is bipartite exactly when it has no odd cycle. The complete bipartite graph K_{m,n} has m vertices on one side and n on the other, with each vertex of one side joined to each vertex of the other, so it has m × n edges.',
   steps: [
    'Put a starting vertex on side A and every one of its neighbours on side B.',
    'Keep going: each vertex goes on the side opposite its neighbours. If some vertices cannot be reached, start again from one of them.',
    'If an edge joins two vertices on the same side, follow the two routes back to where they meet: with that edge they make an odd cycle, so the network is not bipartite. Otherwise the two sides prove that it is bipartite.',
    'For K_{m,n}, multiply: each of the m vertices has n edges.'
   ],
   example: {
    prompt: 'Chips 1 to 6 have wires 1–2, 2–3, 3–4, 4–5, 5–6, 6–1 and 1–4. Is the network bipartite? How many edges does K_{3,5} have?',
    steps: [
     'Going round, chips 1, 3 and 5 go on side A and chips 2, 4 and 6 on side B.',
     'The extra wire 1–4 joins side A to side B, so every wire crosses between the sides: the network is bipartite.',
     'K_{3,5} has 3 × 5 = 15 edges.'
    ],
    answer: 'Bipartite (enter 1), and K_{3,5} has 15 edges.'
   },
   pitfalls: [
    'Stopping after the first few chips. One wire inside a bank anywhere makes the network not bipartite.',
    'Thinking any cycle spoils it. Even cycles are fine; only an odd cycle forces two neighbours onto the same side.',
    'Adding m + n for the edges of K_{m,n}. That is the number of vertices; the edges number m × n.'
   ]
  },
  guidance: [
   { prompt: 'Put chip 1 in bank A. Its neighbours must all go in bank B. How many neighbours does chip 1 have?', answer: [2], labels: ['neighbours of chip 1'], explanation: 'Chip 1 is wired to 3 and 5, so those 2 chips go in bank B.' },
   { prompt: 'Keep sorting chips into the opposite bank of their neighbours. Does every wire end up between the banks? Enter 1 for yes, 0 for no.', answer: [0], labels: ['bipartite (1 or 0)'], explanation: 'No: the cycle 2 → 3 → 1 → 5 → 6 → 2 has an odd number of wires, so two chips of one bank end up wired together.' },
   { prompt: 'How many wires does K_{4,6} have?', answer: [24], labels: ['wires in the test rig'], explanation: 'Each of the 4 probes is wired to all 6 sockets: 4 × 6 = 24.' }
  ]
 },
 {
  id: 'q28', title: 'Colours on the test rig', topic: 'Colouring and the chromatic number', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'The test rig lights up each part of a board, linked parts must never show the same colour, and the Circuit Shop wants to know how few colours each board needs.',
  lesson: 'A colouring gives the two ends of every edge different colours; the chromatic number χ is the fewest colours a colouring can use.',
  prompt: 'The Circuit Shop tests boards on a rig where any two linked parts must glow different colours. The first board is a wheel: a ring of 6 parts, each linked to the next and the last back to the first, plus a hub part linked to all 6. Enter its chromatic number χ, the fewest colours that can do it. The second board has six parts, numbered 1 to 6, with links 1–2, 1–3, 1–5, 2–3, 2–4, 3–6, 4–5, 4–6 and 5–6. Enter its chromatic number.',
  answer: [3, 3], labels: ['χ of the first board', 'χ of the second board'], tolerance: 0.01,
  hints: [
   'A ring with an even number of parts needs 2 colours and an odd ring needs 3. A hub linked to every part of a ring needs one more colour. In a complete graph every part needs its own colour.',
   'For the six parts, find a colouring, then show that fewer colours cannot work: parts that are all linked to one another need different colours, and an odd cycle needs 3.'
  ],
  solution: 'For the first board, the hub clashes with every rim part, so it needs a colour of its own. The rim is a ring of 6, which is even, so 2 more alternate round it: χ = 3. On the second board, giving colour 1 to parts 1 and 4, colour 2 to parts 2 and 6 and colour 3 to parts 3 and 5 keeps every pair of linked parts apart, so 3 colours are enough. Parts 1, 2 and 3 are all linked to one another, so they need 3 different colours. So χ = 3.',
  xp: 150, prereqs: ['q27'],
  artifact: { name: 'Colour key', description: 'The fewest lamp colours for each test board.' },
  sources: [source.o12_4, source.kt5_4],
  teaching: {
   intuition: 'A colouring of a network gives every vertex a colour so that the two ends of every edge get different colours. The chromatic number of the network, written χ (the Greek letter chi), is the fewest colours any colouring can use. To pin χ down you need two things: a colouring with that many colours, which shows that many are enough, and a reason fewer cannot work. Two reasons come up again and again. A group of vertices that are all joined to one another needs a different colour for each. And an odd cycle needs 3 colours, because 2 colours would have to alternate round it, which an odd cycle does not allow; this is the bipartite test again. Some families follow at once. A ring of n vertices, each joined to the next and the last to the first (the cycle C_n), needs 2 colours when n is even and 3 when n is odd. A wheel, which is a ring plus a hub joined to every ring vertex, needs one more colour than its ring, since the hub clashes with all of them. A complete graph K_n, in which every pair of the n vertices is joined, needs n colours.',
   steps: [
    'Find a colouring: go through the vertices and give each the first colour that none of its neighbours already has.',
    'Look for a reason that fewer colours fail: a group of vertices all joined to one another, or an odd cycle.',
    'When the colouring and the reason give the same number, that number is χ.'
   ],
   example: {
    prompt: 'What is χ for a ring of 7 parts? And for a board whose four parts have links 1–2, 1–3, 1–4, 2–3, 2–4 and 3–4?',
    steps: [
     'Round a ring of 7 two colours would alternate, but 7 is odd, so the last part would clash with the first. A third colour on one part fixes it: χ = 3.',
     'Every pair of the four parts on the board is linked, so all four need different colours: χ = 4.'
    ],
    answer: 'χ = 3 for the ring and χ = 4 for the board.'
   },
   pitfalls: [
    'Stopping at a colouring that works without checking that fewer colours fail. A colouring only shows that number is enough.',
    'Giving an even ring 3 colours. With an even number of parts, 2 colours alternate all the way round.',
    'Forgetting that the hub of a wheel needs a colour of its own, one more than the ring.'
   ]
  },
  guidance: [
   { prompt: 'What is the chromatic number of the first board?', answer: [3], labels: ['χ of the first board'], explanation: 'The hub clashes with every rim part, so it needs a colour of its own. The rim is a ring of 6, which is even, so 2 more alternate round it: χ = 3.' },
   { prompt: 'On the second board, what is the largest number of parts that are all linked to one another?', answer: [3], labels: ['largest all-linked group'], explanation: 'Parts 1, 2 and 3 are all linked to one another, and no larger group is.' },
   { prompt: 'Colour the second board with as few colours as you can. What is its chromatic number?', answer: [3], labels: ['χ of the second board'], explanation: 'Giving colour 1 to parts 1 and 4, colour 2 to parts 2 and 6 and colour 3 to parts 3 and 5 works with 3 colours. Parts 1, 2 and 3 are all linked to one another, so they need 3 different colours.' }
  ]
 },
 {
  id: 'q29', title: 'The certification timetable', topic: 'Chapter review: scheduling by colouring', tier: 'Intermediate', sector: 'Circuit Shop',
  brief: 'The Circuit Shop’s certification week is cramped, and any two exams that share a candidate need separate slots.',
  lesson: 'Exam slots are colours of the conflict network, so the fewest slots is its chromatic number; when the network is drawn flat, Euler’s formula counts its faces.',
  prompt: 'The Circuit Shop runs certification exams, and two exams that share a candidate cannot be in the same slot. The conflict network has 7 exams, numbered 1 to 7, with a link for each pair that share a candidate: 1–2, 1–3, 1–4, 1–5, 1–6, 2–4, 2–5, 2–7, 3–4, 3–6, 3–7, 4–5, 4–6 and 4–7. It is connected and is drawn on the planning board with no crossing links. Enter the fewest exam slots needed. Then enter the number of faces of that drawing, counting the region outside it.',
  answer: [4, 9], labels: ['fewest slots', 'faces'], tolerance: 0.01,
  hints: [
   'Exam slots are colours: linked exams need different slots, so the fewest slots is the chromatic number. Find a colouring, then a reason fewer colours fail (exams all linked to one another, or an odd cycle).',
   'The drawing is connected and planar, so Euler’s formula V − E + F = 2 gives F = 2 − V + E. Count the links first.'
  ],
  solution: 'Putting exams 1 and 7 in slot 1, exams 2 and 3 in slot 2, exam 4 in slot 3 and exams 5 and 6 in slot 4 never puts two linked exams together, so 4 slots are enough. Exams 1, 2, 4 and 5 all conflict with one another, so they need 4 different slots. So the fewest slots is 4. The network has V = 7 exams and E = 14 links, so Euler’s formula gives F = 2 − 7 + 14 = 9 faces.',
  xp: 150, prereqs: ['q26', 'q28'],
  artifact: { name: 'Exam timetable', description: 'Certification week in the fewest slots, drawn on one flat board.' },
  sources: [source.o12_4, source.kt5_4, source.kt5_5],
  teaching: {
   intuition: 'A timetable is a colouring in disguise. Make a network with one vertex for each exam and an edge between two exams whenever some candidate sits both. Two linked exams cannot share a slot, so a timetable is a colouring with one colour per slot, and the fewest slots is the chromatic number χ. To be sure of it, find a timetable and also a reason no shorter one exists: a group of exams that all conflict with one another, or an odd cycle of conflicts. The chapter’s other tool comes in when the conflict network is drawn flat. If the drawing is connected and has no crossings, Euler’s formula V − E + F = 2 gives the number of faces from the numbers of exams and links. Planar networks are also easy to colour: the four colour theorem says a planar network never needs more than 4 colours.',
   steps: [
    'Treat each exam as a vertex and each pair of exams with a shared candidate as an edge.',
    'Find a timetable by colouring, then a reason fewer slots fail; together they give χ.',
    'For the faces, count V and E and use F = 2 − V + E.'
   ],
   example: {
    prompt: 'Five exams have conflicts 1–2, 2–3, 3–4, 4–5 and 5–1, drawn flat with no crossings. How many slots are needed, and how many faces does the drawing have?',
    steps: [
     'Exams 1 and 3 in slot 1, exams 2 and 4 in slot 2 and exam 5 in slot 3 works.',
     'The conflicts form a ring of 5, an odd cycle, so 2 slots cannot work: 3 is the fewest.',
     'F = 2 − 5 + 5 = 2: the inside and the outside of the ring.'
    ],
    answer: '3 slots and 2 faces.'
   },
   pitfalls: [
    'Judging the slots by the exam with the most conflicts. The fewest slots depends on the whole network, not on one exam.',
    'Missing the outside region when counting faces.',
    'Using Euler’s formula on a drawing with crossings. It holds only for a connected drawing with none.'
   ]
  },
  guidance: [
   { prompt: 'Treat slots as colours. What is the fewest number of slots?', answer: [4], labels: ['fewest slots'], explanation: 'Putting exams 1 and 7 in slot 1, exams 2 and 3 in slot 2, exam 4 in slot 3 and exams 5 and 6 in slot 4 works. Exams 1, 2, 4 and 5 all conflict with one another, so they need 4 different slots.' },
   { prompt: 'How many exams and how many links does the network have?', answer: [7, 14], labels: ['exams V', 'links E'], explanation: '7 exams and 14 links.' },
   { prompt: 'Use Euler’s formula, F = 2 − V + E. How many faces does the drawing have?', answer: [9], labels: ['faces'], explanation: 'F = 2 − 7 + 14 = 9.' }
  ]
 },
 {
  id: 'q30', title: 'Crew to the pumps', topic: 'Matchings in bipartite graphs', tier: 'Advanced', sector: 'Pumping Station',
  brief: 'Each pump task needs one person, and Mira wants as many tasks covered at once as the crew’s skills allow.',
  lesson: 'A matching is a set of edges with no shared ends; in a crew-and-task network a largest matching covers the most tasks at once.',
  prompt: 'The Pumping Station has 5 crew members, numbered 1 to 5, and 5 pump tasks, labelled A, B, C, D and E. Each crew member takes at most one task and each task needs at most one person. Crew 1 can do A or B. Crew 2 can do only A. Crew 3 can do B, C or D. Crew 4 can do A or B. Crew 5 can do D or E. Enter the largest number of crew who can be given tasks at the same time (the size of a largest matching). Then enter how many crew are left without a task.',
  answer: [4, 1], labels: ['largest matching', 'crew without a task'], tolerance: 0.01,
  hints: [
   'Pair crew to tasks one at a time. If someone is stuck, look for a swap chain: move the crew member who holds a task the stuck person needs to another task that crew member can do, freeing the first task.',
   'To show no larger matching exists, find a group of crew who between them can do fewer tasks than there are people in the group: some of them must stay without a task.'
  ],
  solution: 'The matching crew 1 → B, crew 2 → A, crew 3 → C and crew 5 → D gives 4 crew a task each, and no two share a task. Crew members 1, 2 and 4 can only do A and B between them: 3 people for 2 tasks, so at least 1 of them must go without. So the largest matching has 4 pairs and 1 crew member is left without a task.',
  xp: 200, prereqs: ['q27'],
  artifact: { name: 'Pump roster', description: 'Every task the crew can cover at once, with no one doubled up.' },
  sources: [source.kt14_2],
  teaching: {
   intuition: 'Crew and tasks form a bipartite network: one side is the crew, the other is the tasks, and an edge joins each person to each task they can do. A matching is a set of edges no two of which share an end, so each person gets at most one task and each task at most one person. Its size is its number of edges, and we want a largest matching. Pairing people greedily can get stuck: someone is left whose only tasks are already taken. Before giving up, look for a swap chain. Suppose Ana is stuck and wants task A, which Ben holds; if Ben can also do task C, which is free, move Ben to C and give A to Ana. A chain like this, from a stuck person to a free task, always makes the matching one bigger, and when no chain exists the matching is as large as it can be. To show that it cannot grow, find a group of people who between them can do fewer tasks than there are people in the group: the difference is how many of them must go without.',
   steps: [
    'Pair crew to tasks one at a time, each with a task they can do that is still free.',
    'When someone is stuck, look for a swap chain that moves people along to free a task for them.',
    'When no swap chain helps, look for a group with fewer possible tasks than people: it shows the matching cannot be larger.',
    'The crew left without a task are the number of crew minus the size of the matching.'
   ],
   example: {
    prompt: 'Four crew and four tasks. Crew 1 can do A or B; crew 2 only A; crew 3 B or C; crew 4 only C. How large can a matching be?',
    steps: [
     'Crew 2 takes A, crew 1 takes B and crew 3 takes C.',
     'Crew 4 can only do C, held by crew 3, who could move only to B, held by crew 1, who could move only to A, held by crew 2, who has nowhere else to go. No swap chain works.',
     'All four crew can do only A, B and C between them: 4 people and 3 tasks, so at most 3 can be busy.'
    ],
    answer: 'A largest matching has 3 pairs, and 1 crew member is left without a task.'
   },
   pitfalls: [
    'Stopping at the first greedy pairing. A swap chain can often fit one more person in.',
    'Giving one person two tasks, or one task to two people. That is not a matching.',
    'Looking only at how many tasks each person can do. The limit comes from groups of people who share too few tasks.'
   ]
  },
  guidance: [
   { prompt: 'Look at crew members 1, 2 and 4. How many different tasks can they do between them?', answer: [2], labels: ['tasks they can do'], explanation: 'Between them they can do A and B: 2 tasks for 3 people.' },
   { prompt: 'Build the biggest matching you can, using swap chains when someone is stuck. How many pairs does it have?', answer: [4], labels: ['largest matching'], explanation: 'Crew 1 → B, crew 2 → A, crew 3 → C and crew 5 → D: 4 pairs. The group above has more people than tasks, so no matching can have more.' },
   { prompt: 'How many crew are left without a task?', answer: [1], labels: ['crew without a task'], explanation: '5 − 4 = 1.' }
  ]
 }
);
})();
