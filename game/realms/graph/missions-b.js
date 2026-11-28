/* Graph theory: networks missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/graph/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Getting around · Basic, 100 XP · sector 'Rover Depot' · Chapter review: eulerising a road map [O12.5]
     q12  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Trees [O12.10]
     q13  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Forests and leaves [KT5.1, O12.10]
     q14  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Spanning trees [O12.10]
     q15  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Counting spanning trees [O12.10]
     q16  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Minimum spanning trees: Kruskal's algorithm [O12.10, KT12.1]
     q17  ch 3 Trees · Intermediate, 150 XP · sector 'Cable Yard' · Chapter review: the cable plan [O12.10, KT12.1]
     q18  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · Shortest weighted paths: Dijkstra's algorithm [KT12.3]
     q19  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · Hamilton cycles in complete graphs [O12.7]
     q20  ch 4 Routes and tours · Intermediate, 150 XP · sector 'Dispatch' · Travelling salesperson: brute force [O12.9] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 12, and Keller and Trotter, Applied Combinatorics: the sections these
   missions cite. Each page was opened on the date in `verified` and the idea the mission uses was found on it. */
const source = {
 O12_5: { title: 'OpenStax Contemporary Mathematics — 12.5 Euler Circuits', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-5-euler-circuits', description: 'Euler circuits and eulerization: repeating existing edges so every vertex has even degree, with a street-grid example and at least half as many repeats as odd vertices.', verified: '2026-11-27' },
 O12_7: { title: 'OpenStax Contemporary Mathematics — 12.7 Hamilton Cycles', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-7-hamilton-cycles', description: 'Hamilton cycles, factorials, and the (n − 1)! Hamilton cycles of a complete graph, counting a cycle and its reverse as different.', verified: '2026-11-27' },
 O12_9: { title: 'OpenStax Contemporary Mathematics — 12.9 Traveling Salesperson Problem', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-9-traveling-salesperson-problem', description: 'The travelling salesperson problem and the brute force method: list the Hamilton cycles and compare their weights.', verified: '2026-11-27' },
 O12_10: { title: 'OpenStax Contemporary Mathematics — 12.10 Trees', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-10-trees', description: 'Trees as connected graphs with no cycles, n − 1 edges, forests, spanning trees, weighted graphs and Kruskal’s algorithm for a minimum spanning tree.', verified: '2026-11-27' },
 KT5_1: { title: 'Keller and Trotter, Applied Combinatorics — 5.1 Basic Notation and Terminology for Graphs', url: 'https://www.rellek.net/book/s_graphs_intro.html', description: 'Degree, connected graphs and components, forests (acyclic graphs), trees and leaves.', verified: '2026-11-27' },
 KT12_1: { title: 'Keller and Trotter, Applied Combinatorics — 12.1 Minimum Weight Spanning Trees', url: 'https://www.rellek.net/book/s_graphalgorithms_min-wt-span.html', description: 'Weighted graphs, minimum weight spanning trees and Kruskal’s algorithm (“Avoid Cycles”).', verified: '2026-11-27' },
 KT12_3: { title: 'Keller and Trotter, Applied Combinatorics — 12.3 Dijkstra’s Algorithm for Shortest Paths', url: 'https://www.rellek.net/book/s_graphalgorithms_shortest-paths.html', description: 'Dijkstra’s algorithm: shortest distances from a root vertex with permanent and temporary vertices.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q11", title: "Sweeping the new district", topic: "Eulerising a road map", tier: "Basic", sector: "Rover Depot",
  brief: "The depot’s sweeper has to clear every road in the new grid district and come home, and the drivers want to know how much driving it will cost.",
  lesson: "To eulerise a network, repeat existing edges until every vertex has even degree; each repeat fixes at most two odd vertices.",
  prompt: "The Rover Depot’s new district is a grid of streets 5 blocks wide (west to east) and 3 blocks deep (south to north), so it has 24 street corners. A road is one block-long stretch of street between neighbouring corners. Every west–east road is 200 metres long and every south–north road is 150 metres long. A sweeper must drive along every road at least once and finish at the corner where it started. Enter the fewest roads it must drive twice, then the least extra distance that driving roads twice adds, in metres (type it without commas).",
  answer: [6,1100], labels: ["roads driven twice","extra distance (m)"], tolerance: 0.01,
  hints: [
   "Corners inside the grid have degree 4 and the four outer corners have degree 2. The other corners along the edge of the grid are the odd ones.",
   "Each repeated road fixes at most two odd corners, so you need at least half as many repeats as odd corners. Here the odd corners pair up with their neighbours along each side of the grid."
  ],
  solution: "The corners along the edge of the grid, apart from the four outer corners, have degree 3: 4 on the south side, 4 on the north side and 2 on each of the west and east sides, 12 odd corners in all. A repeated road changes the degree of its two ends by 1, so at least 12 ÷ 2 = 6 repeats are needed. 6 is enough: on the south and north sides the 4 odd corners pair up with their neighbours, using 2 west–east roads on each side, and on the west and east sides they use 1 south–north road on each side. That is 4 west–east roads and 2 south–north roads, 6 in all, and the extra distance is 4 × 200 + 2 × 150 = 1100 metres.",
  xp: 100, prereqs: ["q10"],
  sources: [source.O12_5],
  teaching: {
   intuition: "An Euler circuit drives every road exactly once and comes home, and it exists only when every corner has even degree. A real street grid almost never has that: the corners along its edge have three roads. The fix is to drive some roads twice. On paper we draw a second copy of each road that will be driven twice, and once every corner has even degree the new network has an Euler circuit. Adding copies like this is called eulerising the network. Only roads that already exist can be copied: the sweeper cannot drive where there is no road. Each copy adds 1 to the degree of both of its ends, so one copy can turn at most two odd corners even. That gives a floor: the repeats must be at least half the number of odd corners. When the odd corners sit next to each other in pairs, that floor is reached, and the repeats are as few as they can be. The cited section shows eulerising by repeating roads and the floor of half as many repeats as odd corners; the reason, that one repeat fixes at most two odd corners, is worked out here from the degrees.",
   steps: [
    "Find the degree of every corner and mark the odd ones. In a grid, corners inside have degree 4, the four outer corners have degree 2, and the other corners along the edge have degree 3.",
    "Count the odd corners. You need at least half that many repeated roads.",
    "Pair each odd corner with a neighbouring odd corner and repeat the road between them. If every odd corner is used once, every degree is now even.",
    "Add up the lengths of the repeated roads: that is the extra distance on top of driving every road once."
   ],
   example: {
    prompt: "A grid is 3 blocks wide and 5 blocks deep. West–east roads are 100 metres and south–north roads 80 metres. What is the fewest number of roads to drive twice, and what extra distance do they add?",
    steps: [
     "Odd corners: 2 on the south side, 2 on the north side and 4 on each of the west and east sides, 12 in all. So at least 12 ÷ 2 = 6 repeats.",
     "Pair neighbours along each side: 1 west–east road on the south side and 1 on the north side, and 2 south–north roads on each of the west and east sides. That is 6 repeats.",
     "Extra distance: 2 × 100 + 4 × 80 = 200 + 320 = 520 metres."
    ],
    answer: "6 roads driven twice, adding 520 metres."
   },
   pitfalls: [
    "Adding a road where there is none, such as a diagonal across a block. Eulerising only repeats roads that already exist.",
    "Counting the four outer corners as odd. They have two roads each, which is even.",
    "Repeating a road that joins an odd corner to an inside corner. The inside corner becomes odd, and another repeat is needed to fix it."
   ]
  },
  guidance: [
   { prompt: "Corners inside the grid have degree 4 and the four outer corners have degree 2. The other corners along the edge have degree 3. How many corners have odd degree?", answer: [12], labels: ["odd corners"], explanation: "There are 4 on the south side, 4 on the north side and 2 on each of the west and east sides: 4 + 4 + 2 + 2 = 12." },
   { prompt: "A repeated road changes the degree at both of its ends by 1. What is the fewest repeated roads that can make all 12 odd corners even?", answer: [6], labels: ["roads driven twice"], explanation: "Each repeat fixes at most two odd corners, so at least 12 ÷ 2 = 6 are needed. Pairing each odd corner with its neighbour along the same side reaches that number." },
   { prompt: "The repeats are 4 west–east roads of 200 metres and 2 south–north roads of 150 metres. What extra distance do they add, in metres?", answer: [1100], labels: ["extra distance (m)"], explanation: "4 × 200 = 800 and 2 × 150 = 300, so the extra distance is 1100 metres." }
  ]
 },
 {
  id: "q12", title: "One cable fewer", topic: "Trees", tier: "Intermediate", sector: "Cable Yard",
  brief: "The Cable Yard is ordering cable for new links between domes and has to know how many cable runs each plan needs.",
  lesson: "A tree is a connected network with no circuits; a tree on n vertices always has n − 1 edges.",
  prompt: "The Cable Yard joins 14 domes with cables so that every dome can reach every other one and the cables form no circuit: the network is a tree. Enter how many cables it uses. A second plan, also a tree, uses 22 cables. Enter how many domes it links.",
  answer: [13,23], labels: ["cables in the first tree","domes in the second tree"], tolerance: 0.01,
  hints: [
   "Build a tree one dome at a time: start with a single dome, and each new dome arrives with exactly one new cable.",
   "So a tree always has one cable fewer than it has domes, and one dome more than it has cables."
  ],
  solution: "Start with one dome and add the others one at a time, each with one cable to a dome already joined. 14 domes need 14 − 1 = 13 cables. The other way round, a tree with 22 cables has 22 + 1 = 23 domes.",
  xp: 150, prereqs: ["q08"],
  sources: [source.O12_10],
  teaching: {
   intuition: "A tree is a connected network with no circuits. Connected means every vertex can reach every other one along edges; no circuits means there is no way to leave a vertex and come back to it along a trail of different edges. A tree is the leanest way to keep everything connected: take away any edge and the network falls into two pieces, add any edge and a circuit appears. Trees have a fixed count. Picture building one dome at a time. Start with a single dome and no cables. Each new dome must be joined to the network, and joining it with one cable is enough; a second cable to it would close a circuit. So every dome after the first brings exactly one cable, and a tree with n vertices has n − 1 edges. Read the other way, a tree with e edges has e + 1 vertices.",
   steps: [
    "Check that the network is a tree: connected, with no circuits.",
    "For the edges, take one fewer than the vertices: n vertices give n − 1 edges.",
    "For the vertices, take one more than the edges: e edges give e + 1 vertices."
   ],
   example: {
    prompt: "A tree links 9 domes. How many cables does it use? Another tree uses 13 cables. How many domes does it link?",
    steps: [
     "The first dome needs no cable, and each of the other 8 brings one: 9 − 1 = 8 cables.",
     "One more dome than cables: 13 + 1 = 14 domes."
    ],
    answer: "8 cables, and 14 domes."
   },
   pitfalls: [
    "Answering n instead of n − 1. The first dome comes without a cable.",
    "Using the rule on a network that has a circuit. A network with a circuit has at least as many edges as vertices, so it is not a tree."
   ]
  },
  guidance: [
   { prompt: "Start with one dome; each of the others arrives with exactly one cable. How many cables does the tree of 14 domes use?", answer: [13], labels: ["cables in the first tree"], explanation: "After the first dome, 13 more domes arrive, each with one cable, so the tree has 13 cables." },
   { prompt: "A tree has one dome more than it has cables. How many domes does the tree with 22 cables link?", answer: [23], labels: ["domes in the second tree"], explanation: "22 + 1 = 23 domes." }
  ]
 },
 {
  id: "q13", title: "Counting the cable ends", topic: "Forests and leaves", tier: "Intermediate", sector: "Cable Yard",
  brief: "The yard is surveying an old split-up network and a new one, and the crew needs the cable count of one and the number of dead-end domes in the other.",
  lesson: "A forest of n vertices in c trees has n − c edges; in a tree, the handshake rule fixes how many leaves there are.",
  prompt: "The Cable Yard’s old network is a forest: 30 domes split into 4 separate trees. Enter how many cables it has. The new network is one tree. In it, the number of domes of degree 2 is 3, of degree 3 is 5 and of degree 4 is 2, and every other dome is a leaf. Enter the number of leaves.",
  answer: [26,11], labels: ["cables in the forest","leaves"], tolerance: 0.01,
  hints: [
   "Each tree in the forest has one cable fewer than its domes, so the whole forest has one cable fewer than its domes for every tree in it.",
   "Call the number of leaves L. Count the domes and the cables of the new tree in terms of L, then use the handshake rule: the degrees add up to twice the number of cables."
  ],
  solution: "Each of the 4 trees has one cable fewer than its domes, so the forest has 30 − 4 = 26 cables. In the new tree, call the number of leaves L. It has L + 10 domes and so L + 9 cables. The degrees add up to L + 29, and by the handshake rule that is twice the cables, 2L + 18. So L = 29 − 18 = 11 leaves, and the tree has 21 domes.",
  xp: 150, prereqs: ["q12"],
  sources: [Object.assign({}, source.KT5_1, { description: 'Degree, forests (graphs with no cycles), trees and leaves.' }), Object.assign({}, source.O12_10, { description: 'Trees as connected graphs with no cycles and their n − 1 edges, and forests. The n − c count for a forest is worked out in this mission, not stated here.' })],
  teaching: {
   intuition: "A forest is a network with no circuits that may come in several separate pieces; each piece is a tree. A tree has one edge fewer than its vertices, so a forest has one edge fewer for each tree in it: n vertices in c trees have n − c edges. Neither cited section states this count; it is worked out here from the n − 1 rule for each tree. The degree of a vertex is the number of edges that meet there. A vertex of degree 1 in a tree is a leaf: a dead end, joined to the rest by a single edge. Every tree with at least two vertices has at least two leaves. To count the leaves of a tree, use the handshake rule: adding up the degrees of all the vertices counts every edge twice, once at each end, so the degrees add up to twice the number of edges. If we know how many vertices have each higher degree, call the number of leaves L, write the vertices and the edges in terms of L, and the handshake rule gives L.",
   steps: [
    "Forest: subtract the number of trees from the number of vertices to get the edges.",
    "Tree: call the number of leaves L. The vertices are L plus the vertices of higher degree, and the edges are one fewer than the vertices.",
    "Add up the degrees: L for the leaves, plus each higher degree times how many vertices have it.",
    "Set that sum equal to twice the edges and solve for L."
   ],
   example: {
    prompt: "A forest has 20 domes in 3 trees. How many cables does it have? A tree has 4 domes of degree 3 and 1 of degree 4, and every other dome is a leaf. How many leaves?",
    steps: [
     "Forest: 20 − 3 = 17 cables.",
     "Tree: L + 5 domes, so L + 4 cables. Degrees: L + 4 × 3 + 1 × 4 = L + 16.",
     "Handshake rule: L + 16 = 2 × (L + 4) = 2L + 8, so L = 8."
    ],
    answer: "17 cables, and 8 leaves."
   },
   pitfalls: [
    "Subtracting 1 for a whole forest. Each tree in it is one cable short, so subtract the number of trees.",
    "Forgetting that degree-2 domes count as domes. They add 2 to the degree total and 1 to the dome count, and do not change the number of leaves.",
    "Setting the degree total equal to the number of cables instead of twice it."
   ]
  },
  guidance: [
   { prompt: "Each of the 4 trees has one cable fewer than its domes. How many cables does the forest of 30 domes have?", answer: [26], labels: ["cables in the forest"], explanation: "Adding up over the trees, the cables are the domes minus one for each tree: 30 − 4 = 26." },
   { prompt: "In the new tree, what do the degrees of the domes that are not leaves add up to?", answer: [29], labels: ["degree total of the other domes"], explanation: "2 × 3 + 3 × 5 + 4 × 2 = 29." },
   { prompt: "With L leaves the tree has L + 10 domes and L + 9 cables, and the degrees add up to L + 29. The handshake rule says L + 29 = 2 × (L + 9). What is L?", answer: [11], labels: ["leaves"], explanation: "L + 29 = 2L + 18, so L = 29 − 18 = 11." }
  ]
 },
 {
  id: "q14", title: "Cable along the tunnels", topic: "Spanning trees", tier: "Intermediate", sector: "Cable Yard",
  brief: "Cable will run through the existing tunnels, and the yard needs to know how many tunnels get cable and how many are left bare.",
  lesson: "A spanning tree of a connected network keeps every vertex and only enough edges to form a tree: V − 1 of them, leaving out E − V + 1.",
  prompt: "The Cable Yard map shows domes 1 to 7 and these tunnels: 1–2, 1–4, 2–3, 2–5, 3–6, 4–5, 4–7, 5–6, 5–7, 6–7. Every dome can reach every other one through the tunnels. The crew will lay cable along a spanning tree of the tunnels. Enter how many tunnels the spanning tree uses, then how many tunnels it leaves without cable.",
  answer: [6,4], labels: ["tunnels in the spanning tree","tunnels left out"], tolerance: 0.01,
  hints: [
   "A spanning tree reaches every dome and is a tree, so it has one tunnel fewer than there are domes.",
   "Count the tunnels in the list. The ones the spanning tree does not use are all the rest."
  ],
  solution: "The network has 7 domes and 10 tunnels. A spanning tree reaches all 7 domes and is a tree, so it uses 7 − 1 = 6 tunnels. The other 10 − 6 = 4 tunnels are left without cable: each of them would close a circuit.",
  xp: 150, prereqs: ["q13"],
  sources: [source.O12_10],
  teaching: {
   intuition: "A connected network often has more edges than it needs, so some of them form circuits. A spanning tree of the network uses all of its vertices and some of its edges, chosen so that they form a tree: everything stays connected, and no circuit is left. We can find one by breaking circuits: while there is a circuit, remove one of its edges. Removing an edge from a circuit never disconnects anything, because the rest of the circuit still joins its two ends. When no circuit is left we have a tree that reaches every vertex. A network usually has many different spanning trees, but they all have the same size: a tree on V vertices has V − 1 edges. So from a connected network with V vertices and E edges, every spanning tree leaves out exactly E − (V − 1) = E − V + 1 edges.",
   steps: [
    "Check that the network is connected; only a connected network has a spanning tree.",
    "Count the vertices V and the edges E.",
    "A spanning tree keeps V − 1 edges.",
    "It leaves out E − V + 1 edges, whichever spanning tree you choose."
   ],
   example: {
    prompt: "A connected network has 5 domes and 8 tunnels. How many tunnels does a spanning tree use, and how many does it leave out?",
    steps: [
     "A spanning tree is a tree on all 5 domes: 5 − 1 = 4 tunnels.",
     "The rest are left out: 8 − 4 = 4 tunnels."
    ],
    answer: "4 tunnels used, and 4 left out."
   },
   pitfalls: [
    "Leaving out E − V tunnels. The tree keeps V − 1, so the number left out is E − V + 1.",
    "Thinking a different spanning tree might leave out a different number. All of them keep exactly V − 1 edges."
   ]
  },
  guidance: [
   { prompt: "Count the domes and the tunnels in the list. How many of each are there?", answer: [7,10], labels: ["domes","tunnels"], explanation: "The domes are numbered 1 to 7, and the list has 10 pairs." },
   { prompt: "A spanning tree is a tree that reaches all 7 domes. How many tunnels does it use?", answer: [6], labels: ["tunnels in the spanning tree"], explanation: "A tree has one edge fewer than its vertices: 7 − 1 = 6." },
   { prompt: "How many of the 10 tunnels are left without cable?", answer: [4], labels: ["tunnels left out"], explanation: "10 − 6 = 4. Whichever spanning tree is chosen, this number is the same." }
  ]
 },
 {
  id: "q15", title: "How many ways to wire it", topic: "Counting spanning trees", tier: "Intermediate", sector: "Cable Yard",
  brief: "Two districts have more cable than they need, and the yard wants to know how many different ways each one could be cut back to a spanning tree.",
  lesson: "Count spanning trees by counting the ways to leave out E − V + 1 edges so that the edges left still join every vertex.",
  prompt: "The east ring is 8 domes joined in a single loop by 8 cables. Enter how many different spanning trees it has. In the west, two hub domes are joined by three separate routes that meet only at the hubs: one of 3 cables, one of 2 cables and one of 5 cables, with a small dome between each pair of cables in a route. Enter how many different spanning trees this network has.",
  answer: [8,31], labels: ["spanning trees of the ring","spanning trees of the west network"], tolerance: 0.01,
  hints: [
   "A spanning tree keeps one cable fewer than the domes, so count how many cables it must leave out, and which choices of those cables leave every dome joined.",
   "In the west, the two cables left out must come from two different routes: two from the same route cut off the domes between them."
  ],
  solution: "The ring has 8 domes and 8 cables, so a spanning tree leaves out exactly one cable, and any one of the 8 will do: 8 spanning trees. The west network has 9 domes and 10 cables, so a spanning tree leaves out 10 − 8 = 2 cables. They must come from two different routes, since two from the same route would cut off the domes between them, and one cable from each of two routes always leaves every dome joined. The choices are 3 × 2 + 2 × 5 + 5 × 3 = 6 + 10 + 15 = 31 spanning trees.",
  xp: 150, prereqs: ["q14"],
  sources: [Object.assign({}, source.O12_10, { description: 'Spanning trees and the n − 1 edges of a tree. The section does not count spanning trees; this mission works the count out itself.' })],
  teaching: {
   intuition: "Every spanning tree of a network leaves out the same number of edges, E − V + 1, so counting spanning trees means counting the ways to choose which edges to leave out, where the edges left must still join everything. A ring of n vertices joined in one loop has n edges, so a spanning tree leaves out exactly one edge, and any one will do: what is left is a chain through every vertex. That gives n spanning trees. Now take two hub vertices joined by three separate routes, with a, b and c edges, and a vertex between each pair of edges in a route. It has two independent loops, and a spanning tree leaves out two edges. They must come from different routes: two edges from the same route cut off the vertices between them, and the other two routes still form a circuit. One edge from each of two routes always works. So the count is a × b + b × c + c × a. The cited section defines spanning trees but does not count them: this way of counting is worked out here.",
   steps: [
    "Count the vertices and edges, and work out how many edges a spanning tree leaves out: E − V + 1.",
    "Work out which choices of those edges keep every vertex joined and break every circuit.",
    "For a single ring, any one edge: n choices.",
    "For two hubs joined by routes of a, b and c edges, one edge from each of two different routes: a × b + b × c + c × a choices."
   ],
   example: {
    prompt: "How many spanning trees has a ring of 6 domes? And two hubs joined by routes of 2, 3 and 4 cables?",
    steps: [
     "The ring has 6 cables and leaves out one of them: 6 spanning trees.",
     "The routes have 9 cables and 8 domes, so a spanning tree leaves out 2, from different routes.",
     "2 × 3 + 3 × 4 + 4 × 2 = 6 + 12 + 8 = 26."
    ],
    answer: "6 for the ring, and 26 for the three routes."
   },
   pitfalls: [
    "Counting every pair of cables, C(E, 2). Two cables from the same route cut off the domes between them, so those pairs are not spanning trees.",
    "Multiplying a × b × c. Only two cables are left out, from two of the three routes, so the three products are added."
   ]
  },
  guidance: [
   { prompt: "The ring has 8 domes and 8 cables. How many spanning trees does it have?", answer: [8], labels: ["spanning trees of the ring"], explanation: "A spanning tree keeps 7 cables, so it leaves out exactly one. Leaving out any one of the 8 cables gives a chain through every dome, so there are 8." },
   { prompt: "The west network has 9 domes and 10 cables. How many cables does a spanning tree leave out?", answer: [2], labels: ["cables left out"], explanation: "A spanning tree keeps 9 − 1 = 8 cables, so it leaves out 10 − 8 = 2." },
   { prompt: "The two cables must come from different routes. How many ways are there to choose them?", answer: [31], labels: ["spanning trees of the west network"], explanation: "Routes of 3 and 2: 6 ways; 2 and 5: 10; 5 and 3: 15. In all 31." }
  ]
 },
 {
  id: "q16", title: "Cutting the cable bill", topic: "Minimum spanning trees: Kruskal’s algorithm", tier: "Intermediate", sector: "Cable Yard",
  brief: "Cable is expensive this far out, so the yard needs the plan that joins every dome with the least cable in total.",
  lesson: "Kruskal’s algorithm builds a minimum spanning tree by taking edges from lightest to heaviest and skipping any that would close a circuit.",
  prompt: "The Cable Yard can lay cable along these tunnels between domes 1 to 6; each tunnel’s cable length in hundreds of metres is in brackets: 1–2 (9), 1–3 (4), 1–4 (14), 2–3 (7), 2–5 (3), 3–4 (11), 3–5 (8), 4–6 (6), 5–6 (12). The crew wants every dome joined using as little cable as possible. Use Kruskal’s algorithm. Enter the total length of the minimum spanning tree, then the length of the last cable the algorithm adds (both in hundreds of metres).",
  answer: [31,11], labels: ["total length (hundreds of m)","last cable added (hundreds of m)"], tolerance: 0.01,
  hints: [
   "Sort the tunnels from shortest to longest. Take each in turn, and skip it only if its two domes are already joined by cables you have taken.",
   "Stop as soon as you have taken one cable fewer than the number of domes."
  ],
  solution: "Kruskal’s algorithm, shortest first: 2–5 (3) added; 1–3 (4) added; 4–6 (6) added; 2–3 (7) added; 3–5 (8) skipped, because 3 and 5 are already joined; 1–2 (9) skipped, because 1 and 2 are already joined; 3–4 (11) added. That is 5 cables, enough for 6 domes, so it stops. The total is 3 + 4 + 6 + 7 + 11 = 31 hundred metres, and the last cable added has length 11.",
  xp: 150, prereqs: ["q14"],
  sources: [source.O12_10, source.KT12_1],
  teaching: {
   intuition: "In a weighted graph every edge carries a number called its weight: a length, a cost or a time. Here the weight of a tunnel is the cable it needs. The weight of a spanning tree is the total weight of its edges, and a minimum spanning tree is a spanning tree whose weight is as small as possible. There are often far too many spanning trees to try them all, but a greedy rule finds the best one. Kruskal’s algorithm sorts the edges from lightest to heaviest and takes them in that order, skipping an edge only when its two ends are already joined by edges already taken, because taking it would close a circuit. It stops when it has V − 1 edges, which is a spanning tree. It is a theorem that this tree always has the smallest possible weight. If several edges have the same weight the tree may differ, but its total weight never does.",
   steps: [
    "Sort the edges by weight, lightest first.",
    "Take each edge in turn. If its two ends are already joined by edges you have taken, skip it; otherwise add it.",
    "Stop when you have one edge fewer than the vertices.",
    "Add up the weights of the edges you took: that is the weight of the minimum spanning tree."
   ],
   example: {
    prompt: "Four domes, with cable lengths 1–2 (5), 1–3 (2), 2–3 (4), 2–4 (6), 3–4 (7). Find the minimum spanning tree’s total length and its last cable.",
    steps: [
     "In order: 1–3 (2) added, 2–3 (4) added, 1–2 (5) skipped because 1 and 2 are already joined through 3, 2–4 (6) added.",
     "That is 3 cables for 4 domes, so stop. Total 2 + 4 + 6 = 12."
    ],
    answer: "Total 12; the last cable added has length 6."
   },
   pitfalls: [
    "Skipping a cable only because one of its domes is already in the tree. Skip it only when both ends are already joined to each other.",
    "Carrying on after V − 1 cables. Every later cable would close a circuit.",
    "Taking the cheapest cable at each dome in turn. That can make a circuit or leave pieces unjoined; Kruskal looks at all the cables in one sorted list."
   ]
  },
  guidance: [
   { prompt: "How many cables does a spanning tree of 6 domes have?", answer: [5], labels: ["cables in the tree"], explanation: "One fewer than the domes: 5." },
   { prompt: "Go through the tunnels from shortest to longest. What is the length of the first one you must skip because it would close a circuit?", answer: [8], labels: ["first cable skipped (hundreds of m)"], explanation: "2–5 (3) added; 1–3 (4) added; 4–6 (6) added; 2–3 (7) added; 3–5 (8) skipped, because 3 and 5 are already joined." },
   { prompt: "Carry on until 5 cables are in. What is their total length, and what is the length of the last cable added?", answer: [31, 11], labels: ["total length (hundreds of m)", "last cable added (hundreds of m)"], explanation: "The cables taken are 2–5 (3), 1–3 (4), 4–6 (6), 2–3 (7), 3–4 (11), which add up to 31. The last one added is 3–4, of length 11." }
  ]
 },
 {
  id: "q17", title: "The cable plan", topic: "Chapter review: the cable plan", tier: "Intermediate", sector: "Cable Yard",
  brief: "The yard’s final plan joins two hub domes by three routes, and the crew needs the cable count, the number of possible layouts and the cheapest one.",
  lesson: "One network, three questions: the edges of a spanning tree, how many spanning trees there are, and the weight of the lightest.",
  prompt: "The cable plan joins hub domes 1 and 2 by three routes that meet only at the hubs, with cable lengths in hundreds of metres in brackets: the first route 1–3 (6), 3–4 (13), 4–2 (2); the second route 1–5 (9), 5–2 (4); the third route 1–6 (11), 6–7 (5), 7–8 (7), 8–2 (16). Enter how many cables any spanning tree of this network has, then how many different spanning trees it has, then the total length of the minimum spanning tree (in hundreds of metres).",
  answer: [7,26,44], labels: ["cables in a spanning tree","spanning trees","minimum total length (hundreds of m)"], tolerance: 0.01,
  hints: [
   "Count the domes first: the two hubs and the small domes along the routes. A spanning tree has one cable fewer.",
   "A spanning tree leaves out two cables from two different routes. The cheapest one leaves out the longest cables it can, which Kruskal’s algorithm finds by itself."
  ],
  solution: "The network has 8 domes and 9 cables, so a spanning tree has 7 cables and leaves out 2. The routes have 3, 2 and 4 cables, and the two left out must come from different routes: 3 × 2 + 2 × 4 + 4 × 3 = 26 spanning trees. Kruskal’s algorithm, shortest first: 2–4 (2) added; 2–5 (4) added; 6–7 (5) added; 1–3 (6) added; 7–8 (7) added; 1–5 (9) added; 1–6 (11) added. The two cables left out are the longest cables of two routes, 16 and 13, so the minimum spanning tree has length 73 − 16 − 13 = 44.",
  xp: 150, prereqs: ["q15","q16"],
  sources: [source.O12_10, source.KT12_1],
  teaching: {
   intuition: "This chapter’s ideas fit together on one network. A spanning tree of V vertices always has V − 1 edges, so it leaves out E − V + 1 of them. Counting spanning trees means counting the choices of edges to leave out that keep everything joined. For two hubs joined by three routes, a spanning tree leaves out two edges from two different routes, which gives a × b + b × c + c × a trees for routes of a, b and c edges. Among all those trees, the minimum spanning tree has the least total weight, and Kruskal’s algorithm finds it by taking edges lightest first and skipping any that would close a circuit. On this network there is also a shortcut that checks the answer: the cheapest tree leaves out as much weight as it can, which means the heaviest edge of each of two routes, the two heaviest of the three route maximums.",
   steps: [
    "Count the vertices: the two hubs plus the vertices along the routes. A spanning tree has one edge fewer.",
    "Count the spanning trees: a × b + b × c + c × a for routes of a, b and c edges.",
    "Run Kruskal’s algorithm on the weights to find the minimum spanning tree.",
    "Check: total weight minus the two heaviest of the three route maximums."
   ],
   example: {
    prompt: "Hubs 1 and 2 are joined by three routes of 2 cables each, with lengths 3 and 8, 5 and 1, and 6 and 4. Find the cables in a spanning tree, the number of spanning trees and the minimum length.",
    steps: [
     "Domes: 2 hubs and 3 small domes, 5 in all, so a spanning tree has 4 cables.",
     "Spanning trees: 2 × 2 + 2 × 2 + 2 × 2 = 12.",
     "The route maximums are 8, 5 and 6. Leave out 8 and 6: 27 − 8 − 6 = 13. Kruskal gives the same: 1, 3, 4, 5 added, then 6 and 8 would close circuits."
    ],
    answer: "4 cables, 12 spanning trees, minimum length 13."
   },
   pitfalls: [
    "Leaving out the two longest cables overall when they lie on the same route. That cuts off a dome; the two cables must come from different routes.",
    "Counting the hubs once per route. Each hub is one dome, shared by all three routes."
   ]
  },
  guidance: [
   { prompt: "How many domes does the network have, and how many cables does a spanning tree of it have?", answer: [8,7], labels: ["domes","cables in a spanning tree"], explanation: "The 2 hubs and 6 small domes make 8 domes, so a spanning tree has 7 cables." },
   { prompt: "A spanning tree leaves out one cable from each of two different routes. How many spanning trees are there?", answer: [26], labels: ["spanning trees"], explanation: "3 × 2 + 2 × 4 + 4 × 3 = 26." },
   { prompt: "All the cables add up to 73. What is the total length of the minimum spanning tree?", answer: [44], labels: ["minimum total length (hundreds of m)"], explanation: "The cheapest tree leaves out the most cable it can: the longest cable of each of two routes, 16 and 13. 73 − 16 − 13 = 44." }
  ]
 },
 {
  id: "q18", title: "Fastest roads from the depot", topic: "Shortest weighted paths: Dijkstra’s algorithm", tier: "Intermediate", sector: "Dispatch",
  brief: "Dispatch sends rovers out from station 1 and needs the quickest driving time to each station it serves.",
  lesson: "Dijkstra’s algorithm finds shortest weighted distances from one vertex by making the nearest unfinished vertex permanent, one at a time.",
  prompt: "Dispatch has the driving times, in minutes, along the rover roads between stations 1 to 6 (in brackets): 1–2 (7), 1–3 (3), 1–4 (12), 2–3 (2), 2–5 (6), 3–4 (8), 3–5 (11), 4–6 (5), 5–6 (4). A rover leaves station 1. Use Dijkstra’s algorithm. Enter the shortest driving time to station 6, then the shortest driving time to station 4.",
  answer: [15,11], labels: ["time to the far station (min)","time to the other station (min)"], tolerance: 0.01,
  hints: [
   "Give station 1 the time 0. Each round, make permanent the station with the smallest time so far, then check whether going through it gives any of its neighbours a shorter time.",
   "A time is final only when its station is made permanent: a direct road is not always the fastest way."
  ],
  solution: "Dijkstra’s algorithm makes the stations permanent in this order, each with its shortest time: station 1 at 0, station 3 at 3, station 2 at 5, station 4 at 11, station 5 at 11, station 6 at 15. So the shortest driving time to station 6 is 15 minutes and to station 4 it is 11 minutes.",
  xp: 150, prereqs: ["q07"],
  sources: [source.KT12_3],
  teaching: {
   intuition: "In a weighted graph each edge carries a number, its weight, such as the minutes a road takes. The length of a path is then the total weight of its edges, and the shortest path from one vertex to another is the one with the least total, which may use more roads than another path. Dijkstra’s algorithm finds the shortest distance from a starting vertex to every other vertex, as long as no weight is negative. It keeps a time for each vertex: 0 for the start, and “not reached yet” for the rest. Each round it picks the unfinished vertex with the smallest time and makes it permanent: no other route can beat that time, because any other route would have to pass through a vertex that is already further away. Then it looks along each edge out of the new permanent vertex, and if going that way gives a neighbour a smaller time, it lowers that neighbour’s time. When every vertex is permanent, each time is the shortest distance.",
   steps: [
    "Give the start the time 0. The other vertices have no time yet.",
    "Make permanent the unfinished vertex with the smallest time.",
    "For each edge out of it, add the edge’s weight to its time. If that beats a neighbour’s current time, replace the neighbour’s time.",
    "Repeat until the vertex you want is permanent; its time is the shortest distance."
   ],
   example: {
    prompt: "Roads between stations 1 to 4, in minutes: 1–2 (4), 1–3 (1), 2–3 (2), 2–4 (5), 3–4 (8). Find the shortest time from station 1 to station 4.",
    steps: [
     "Station 1 at 0. Its neighbours get 2: 4 and 3: 1. Make 3 permanent at 1.",
     "Through 3: station 2 gets 1 + 2 = 3, better than 4; station 4 gets 1 + 8 = 9. Make 2 permanent at 3.",
     "Through 2: station 4 gets 3 + 5 = 8, better than 9. Make 4 permanent at 8."
    ],
    answer: "8 minutes, by 1, 3, 2, 4."
   },
   pitfalls: [
    "Taking the path with the fewest roads. A path with more roads can have a smaller total time.",
    "Treating a time as final before its station is made permanent. A later round can still lower it.",
    "Always moving on from the station you reached last, instead of the unfinished station with the smallest time."
   ]
  },
  guidance: [
   { prompt: "After station 1, which time is made permanent first? It belongs to the nearest neighbour of station 1.", answer: [3], labels: ["first time made permanent (min)"], explanation: "The roads out of station 1 are 1–2 (7), 1–3 (3), 1–4 (12). The smallest time, 3, cannot be beaten by any other route, so station 3 is made permanent at 3." },
   { prompt: "Carry on until station 4 is permanent. What is its shortest time?", answer: [11], labels: ["time to the other station (min)"], explanation: "Station 4 is made permanent at 11 minutes." },
   { prompt: "Carry on until station 6 is permanent. What is its shortest time?", answer: [15], labels: ["time to the far station (min)"], explanation: "The permanent times are 1: 0, 3: 3, 2: 5, 4: 11, 5: 11, 6: 15, so station 6 is 15 minutes away." }
  ]
 },
 {
  id: "q19", title: "Every station once", topic: "Hamilton cycles in complete graphs", tier: "Intermediate", sector: "Dispatch",
  brief: "Dispatch is planning loops that call at every station exactly once, and first needs to know how many loops there are to choose from.",
  lesson: "K_n has (n − 1)! Hamilton cycles from a fixed start when a cycle and its reverse count as different, and (n − 1)! ÷ 2 when they are merged.",
  prompt: "Every pair of the 6 north stations is linked by a road, and so is every pair of the 7 south stations. A north delivery rover starts at the north depot, one of those stations, visits every other north station once and returns to the depot; the order of its deliveries matters, so a route and its reverse count as different. A south inspection drone does the same from the south depot, one of the south stations, but a loop and its reverse are the same inspection. Enter how many different routes the rover could take, then how many different inspection loops the drone could fly (type them without commas).",
  answer: [120,360], labels: ["rover routes","drone loops"], tolerance: 0.01,
  hints: [
   "Fix the depot as the start. The other stations can then be visited in any order, and every order gives a Hamilton cycle.",
   "Each loop flown backwards is the same loop, so when reverses are merged every cycle has been counted twice."
  ],
  solution: "North: from the depot there are 5 choices for the first stop, 4 for the next, and so on, so (6 − 1)! = 5! = 120 routes. South: (7 − 1)! = 6! = 720 cycles counting direction, and each loop appears twice, once each way, so there are 720 ÷ 2 = 360 inspection loops.",
  xp: 150, prereqs: ["q03"],
  sources: [source.O12_7],
  teaching: {
   intuition: "A Hamilton cycle is a route through a network that starts at one vertex, visits every other vertex exactly once and returns to the start. It is about visiting vertices, not about using every edge. In the complete graph K_n every pair of vertices is joined, so every order of the vertices can be driven. Fix the starting vertex. There are n − 1 choices for the first stop, then n − 2, and so on down to 1: that is (n − 1)!, read “n minus 1 factorial”, the product (n − 1) × (n − 2) × … × 1. Counted this way, a cycle and the same cycle driven backwards are different, which is right when the order matters, such as a delivery schedule. When only the loop matters, such as an inspection where the direction makes no difference, each loop has been counted twice, once in each direction, so divide by 2.",
   steps: [
    "Fix the starting vertex: every Hamilton cycle can be read as starting there.",
    "Count the orders of the other n − 1 vertices: (n − 1)!.",
    "If a cycle and its reverse count as different, that is the answer.",
    "If they count as the same, divide by 2."
   ],
   example: {
    prompt: "Five stations are all linked in pairs. How many Hamilton cycles from the depot count direction, and how many are there with reverses merged?",
    steps: [
     "Orders of the other 4 stations: 4! = 4 × 3 × 2 × 1 = 24.",
     "Each loop is counted twice, once each way: 24 ÷ 2 = 12."
    ],
    answer: "24 counting direction, 12 with reverses merged."
   },
   pitfalls: [
    "Using n! instead of (n − 1)!. Starting at a different station gives the same loop, so the start is fixed.",
    "Halving when direction matters, or not halving when it does not. Read which the problem wants."
   ]
  },
  guidance: [
   { prompt: "The rover’s route is an order of the 5 north stations other than the depot. How many orders are there?", answer: [120], labels: ["rover routes"], explanation: "5! = 120." },
   { prompt: "How many Hamilton cycles from the depot does the south network have if direction counts?", answer: [720], labels: ["south cycles counting direction"], explanation: "(7 − 1)! = 6! = 720." },
   { prompt: "Each inspection loop was counted once in each direction. How many different loops are there?", answer: [360], labels: ["drone loops"], explanation: "720 ÷ 2 = 360." }
  ]
 },
 {
  id: "q20", title: "The cheapest drone tour", topic: "Travelling salesperson: brute force", tier: "Intermediate", sector: "Dispatch",
  brief: "A drone has to call at a handful of outlying stations and get home on one battery, so Dispatch wants the quickest possible tour.",
  lesson: "The brute force method lists every Hamilton cycle, adds up each one’s weight and keeps the smallest.",
  prompt: "Dispatch must send a drone from base station 1 to each of stations 2 to 5 once and back to base. Every pair of stations has a direct flight; the flight times in minutes are in brackets: 1–2 (14), 1–3 (9), 1–4 (22), 1–5 (11), 2–3 (17), 2–4 (8), 2–5 (20), 3–4 (13), 3–5 (6), 4–5 (16). A tour and its reverse take the same time. Enter how many different tours there are to compare (counting a tour and its reverse once), then the time of the cheapest tour.",
  answer: [12,52], labels: ["tours to compare","cheapest tour (min)"], tolerance: 0.01,
  hints: [
   "With the start fixed there are (n − 1)! orders of the other stations, and each tour appears twice, once each way.",
   "List the tours from station 1, add up the times on each, and keep the smallest total."
  ],
  solution: "There are (5 − 1)! ÷ 2 = 12 tours to compare: 1–2–3–4–5–1: 71; 1–2–3–5–4–1: 75; 1–2–4–3–5–1: 52; 1–2–4–5–3–1: 53; 1–2–5–3–4–1: 75; 1–2–5–4–3–1: 72; 1–3–2–4–5–1: 61; 1–3–2–5–4–1: 84; 1–3–4–2–5–1: 61; 1–3–5–2–4–1: 65; 1–4–2–3–5–1: 64; 1–4–3–2–5–1: 83. The cheapest takes 52 minutes.",
  xp: 150, prereqs: ["q19"],
  sources: [source.O12_9],
  teaching: {
   intuition: "The travelling salesperson problem asks for the cheapest Hamilton cycle in a network whose edges carry weights: the quickest way to visit every location once and return to the start. In a complete network every order of the stations is a possible tour. The brute force method simply tries them all. Fix the start, list every order of the other stations, and add up the weights along each tour. A tour and its reverse use the same edges, so they have the same total, and only (n − 1)! ÷ 2 totals need working out. The smallest total is the answer, guaranteed, because nothing was skipped. Brute force is exact but slow: the number of tours grows like a factorial, so it is fine for 4 or 5 stations and hopeless for 20.",
   steps: [
    "Fix the starting station and list the orders of the others, one of each reverse pair.",
    "For each tour, add up the weights of its edges, including the last edge back to the start.",
    "Compare the totals; the smallest is the cheapest tour."
   ],
   example: {
    prompt: "Four stations, flight times 1–2 (7), 1–3 (12), 1–4 (9), 2–3 (8), 2–4 (14), 3–4 (6). Find the cheapest tour from station 1.",
    steps: [
     "(4 − 1)! ÷ 2 = 3 tours: 1–2–3–4–1, 1–2–4–3–1 and 1–3–2–4–1.",
     "Totals: 7 + 8 + 6 + 9 = 30; 7 + 14 + 6 + 12 = 39; 12 + 8 + 14 + 9 = 43."
    ],
    answer: "3 tours; the cheapest takes 30 minutes."
   },
   pitfalls: [
    "Forgetting the last flight back to the base station.",
    "Missing a tour. List them in a fixed order, such as by the second station and then the third, so that none is left out."
   ]
  },
  guidance: [
   { prompt: "How many different tours are there, counting a tour and its reverse once?", answer: [12], labels: ["tours to compare"], explanation: "(5 − 1)! = 24 orders, halved because each tour appears both ways: 12." },
   { prompt: "What is the time of the tour 1–2–3–4–5–1?", answer: [71], labels: ["time of the first tour (min)"], explanation: "14 + 17 + 13 + 16 + 11 = 71." },
   { prompt: "Work out the time of every tour. What is the smallest?", answer: [52], labels: ["cheapest tour (min)"], explanation: "The times are 71, 75, 52, 53, 75, 72, 61, 84, 61, 65, 64, 83, and the smallest is 52." }
  ]
 }
);
})();
