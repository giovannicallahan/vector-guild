/* Graph theory: networks missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/graph/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Matching and flow · Advanced, 200 XP · sector 'Pumping Station' · Hall's condition [KT14.2]
     q32  ch 6 Matching and flow · Advanced, 200 XP · sector 'Pumping Station' · Directed graphs: counting routes [KT12.2]
     q33  ch 6 Matching and flow · Advanced, 200 XP · sector 'Pumping Station' · Flows and cuts [KT13.2]
     q34  ch 6 Matching and flow · Advanced, 200 XP · sector 'Pumping Station' · Maximum flow equals minimum cut [KT13.2]
     q35  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Labelled trees: Cayley's formula [KT5.6]
     q36  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Prüfer codes [KT5.6]
     q37  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Cliques and independent sets [KT5.1, KT5.4]
     q38  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Counting triangles and cliques [O12.2]
     q39  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Ramsey's guarantee [KT11.2]
     q40  ch 7 Counting structures · Advanced, 200 XP · sector 'Archive' · Realm review and bridge to Topology [KT5.5] */
(function(){
'use strict';
/* OpenStax Contemporary Mathematics, chapter 12; Keller and Trotter, Applied Combinatorics (KT sections at https://www.rellek.net/book/<page>.html) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax|Applied Combinatorics/ (OpenStax and Keller and Trotter).
   A title reads like: OpenStax Contemporary Mathematics — 12.5 Euler Circuits
   Link to the section page itself: https://openstax.org/books/contemporary-mathematics/pages/<section-slug> */
const source = {
 kt5_4: { title: 'Keller and Trotter, Applied Combinatorics — 5.4 Graph Coloring', url: 'https://www.rellek.net/book/s_graphs_color.html', description: 'Proper colourings and the chromatic number; a clique, the clique number ω and the bound χ ≥ ω.', verified: '2026-11-27' },
 kt5_5: { title: 'Keller and Trotter, Applied Combinatorics — 5.5 Planar Graphs', url: 'https://www.rellek.net/book/s_graphs_planar.html', description: 'Planar drawings, faces and Euler’s formula V − E + F = 2, with a note that other surfaces have their own versions.', verified: '2026-11-27' },
 kt5_6: { title: 'Keller and Trotter, Applied Combinatorics — 5.6 Counting Labeled Trees', url: 'https://www.rellek.net/book/s_graphs_counting-trees.html', description: 'Cayley’s formula nⁿ⁻² for labelled trees, proved with the Prüfer code made by removing the smallest leaf again and again.', verified: '2026-11-27' },
 kt11_1: { title: 'Keller and Trotter, Applied Combinatorics — 11.1 A First Taste of Ramsey Theory', url: 'https://www.rellek.net/book/s_probmeth_graph-ramsey.html', description: 'Six vertices always hold a complete triangle or an independent set of three, by splitting one vertex’s neighbours; the five-cycle shows five are not enough.', verified: '2026-11-27' },
 kt11_2: { title: 'Keller and Trotter, Applied Combinatorics — 11.2 Small Ramsey Numbers', url: 'https://www.rellek.net/book/s_ramsey_small.html', description: 'The known small Ramsey numbers, among them R(3, 3) = 6.', verified: '2026-11-27' },
 kt12_2: { title: 'Keller and Trotter, Applied Combinatorics — 12.2 Digraphs', url: 'https://www.rellek.net/book/s_graphalgorithms_digraphs.html', description: 'Directed graphs, directed edges written as ordered pairs, and directed paths.', verified: '2026-11-27' },
 kt13_1: { title: 'Keller and Trotter, Applied Combinatorics — 13.1 Basic Notation and Terminology', url: 'https://www.rellek.net/book/s_networkflow_intro.html', description: 'Networks with a source, a sink and capacities; flows, the conservation laws and the value of a flow.', verified: '2026-11-27' },
 kt13_2: { title: 'Keller and Trotter, Applied Combinatorics — 13.2 Flows and Cuts', url: 'https://www.rellek.net/book/s_networkflow_flows-cuts.html', description: 'Cuts and their capacities, counting only edges from the source side to the sink side, and why no flow exceeds any cut.', verified: '2026-11-27' },
 kt13_4: { title: 'Keller and Trotter, Applied Combinatorics — 13.4 The Ford-Fulkerson Labeling Algorithm', url: 'https://www.rellek.net/book/s_networkflow_labeling-algorithm.html', description: 'The labelling algorithm and the max-flow min-cut theorem: the largest flow equals the smallest cut capacity.', verified: '2026-11-27' },
 kt14_2: { title: 'Keller and Trotter, Applied Combinatorics — 14.2 Matchings in Bipartite Graphs', url: 'https://www.rellek.net/book/s_flowapplications_bip-match.html', description: 'Matchings in bipartite graphs and Hall’s theorem: one side can be fully matched exactly when every set of it has at least as many neighbours.', verified: '2026-11-27' },
 o12_2: { title: 'OpenStax Contemporary Mathematics — 12.2 Graph Structures', url: 'https://openstax.org/books/contemporary-mathematics/pages/12-2-graph-structures', description: 'Complete graphs, subgraphs and cliques, and counting the triangles of a complete graph with Pascal’s triangle.', verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'The certificate check', topic: 'Hall’s condition', tier: 'Advanced', sector: 'Pumping Station',
  brief: 'Every pump job needs exactly one technician tonight, and the rota office wants to know whether the certificates make that possible before anyone is called in.',
  lesson: 'A perfect matching exists exactly when every set of vertices on one side has at least as many neighbours as members: Hall’s condition.',
  prompt: 'Four pump jobs, numbered 1 to 4, each need one technician, and each of the four technicians must take exactly one job that they are certified for. Certificates: Ash: jobs 1 and 3; Bo: jobs 2 and 4; Cy: job 1; Di: jobs 1 and 3. Take the set S = {Ash, Bo}. Enter the number of jobs that at least one technician in S is certified for. Then enter 1 if all four technicians can be given different jobs they are certified for (a perfect matching), or 0 if they cannot.',
  answer: [4, 0], labels: ['jobs S can do', 'perfect matching (1 yes, 0 no)'], tolerance: 0.01,
  hints: [
   'Join the certificate lists of the technicians in S and count each job once, however many of them share it.',
   'Hall’s condition: a perfect matching exists exactly when every set of technicians is certified, between them, for at least as many jobs as the set has members. To show yes, find the matching; to show no, find one set that falls short.'
  ],
  solution: 'S = {Ash, Bo} is certified for jobs 1, 2, 3 and 4: that is 4 jobs for 2 technicians, at least as many as its members, so S passes Hall’s test. But the set {Ash, Cy, Di} of 3 technicians is certified only for jobs 1 and 3, which is 2 jobs, fewer than 3. Hall’s condition fails, so no perfect matching exists.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'Certificate grid', description: 'A rota showing, for every group of technicians, how many jobs they can cover.' },
  sources: [source.kt14_2],
  teaching: {
   intuition: 'A matching pairs vertices across the two sides of a bipartite graph, using each vertex at most once. A perfect matching is a matching that uses every vertex: here, every technician gets a different job they are certified for, and every job gets a technician. Sometimes it is plain that this is impossible. If three technicians are certified, between them, for only two jobs, those three cannot all get different jobs. Hall’s condition says that this kind of shortage is the only thing that can go wrong. For a set S of technicians, the neighbours of S are the jobs that at least one technician in S is certified for. When both sides have the same number of vertices, a perfect matching exists exactly when every set S has at least as many neighbours as members. So to show that a perfect matching exists, find one; to show that it does not, find one set whose neighbours are too few.',
   steps: [
    'For a set S, join the lists of its members and count each job once: that is the number of neighbours of S.',
    'S passes Hall’s test when it has at least as many neighbours as members.',
    'To show a perfect matching exists, build one: place the technicians with the fewest choices first, and change an earlier choice when you get stuck.',
    'To show none exists, find a set that fails the test, often technicians whose lists are short and overlap.'
   ],
   example: {
    prompt: 'Three technicians, Fen, Gus and Ivo, and three jobs. Fen can do job 1, Gus can do job 1, and Ivo can do jobs 1, 2 and 3. Is there a perfect matching?',
    steps: ['Take S = {Fen, Gus}. Its only neighbour is job 1: one job for two technicians.', 'S fails Hall’s test: Fen and Gus would both need job 1.'],
    answer: 'No perfect matching exists, even though Ivo could take any job.'
   },
   pitfalls: [
    'Checking one set, such as S, and stopping there. A set that passes says nothing about the other sets; only a matching you have found shows that the answer is yes.',
    'Counting a job twice when two technicians in S share it. Each neighbour counts once.',
    'Checking only single technicians. Each one may have a job, yet a group of them can still share too few jobs.'
   ]
  },
  guidance: [
   { prompt: 'Join the certificates of Ash and Bo and count each job once. How many different jobs is that?', answer: [4], labels: ['jobs S can do'], explanation: 'S = {Ash, Bo} is certified for jobs 1, 2, 3 and 4: that is 4 jobs for 2 technicians.' },
   { prompt: 'Now look at all four technicians. Start with those who have the fewest jobs and try to give everyone a different one. Can it be done? Enter 1 for yes, 0 for no.', answer: [0], labels: ['perfect matching (1 yes, 0 no)'], explanation: 'But the set {Ash, Cy, Di} of 3 technicians is certified only for jobs 1 and 3, which is 2 jobs, fewer than 3. Hall’s condition fails, so no perfect matching exists.' }
  ]
 },
 {
  id: 'q32', title: 'One-way pipes', topic: 'Directed graphs: counting routes', tier: 'Advanced', sector: 'Pumping Station',
  brief: 'The new pipes only let water run one way, and the engineers want to know how many different ways water can reach each tank.',
  lesson: 'When every arc points forwards, the directed paths into a vertex are the sum of the directed paths into the vertices whose arcs point to it.',
  prompt: 'The pumping station’s one-way pipes join junctions 1 to 7. Each pipe is an arc: water can only run along it in the direction of its arrow. The arcs are 1→2, 1→3, 2→3, 2→4, 2→5, 3→5, 3→6, 4→5, 4→6, 5→7, 6→7. Enter the number of directed paths from junction 1 to junction 5, then the number from junction 1 to junction 7.',
  answer: [4, 7], labels: ['paths to the inner junction', 'paths to the last junction'], tolerance: 0.01,
  hints: [
   'Every arc here goes from a smaller number to a larger one, so work through the junctions in order. The directed paths into a junction are the sum of the directed paths into each junction that has an arc pointing to it.',
   'Start with 1 at junction 1, for the path that has not moved yet, and write each count beside its junction before you go on to the next.'
  ],
  solution: 'Count in order, starting with 1 at junction 1: junction 2 gets 1 (from junction 1); junction 3 gets 1 + 1 = 2 (from junctions 1 and 2); junction 4 gets 1 (from junction 2); junction 5 gets 1 + 2 + 1 = 4 (from junctions 2, 3 and 4); junction 6 gets 2 + 1 = 3 (from junctions 3 and 4); junction 7 gets 4 + 3 = 7 (from junctions 5 and 6). So 4 directed paths reach junction 5 and 7 reach junction 7.',
  xp: 200, prereqs: ['q06'],
  artifact: { name: 'Valve diagram', description: 'Arrows on every pipe, and a count of the ways in beside every tank.' },
  sources: [source.kt12_2],
  teaching: {
   intuition: 'Some links only work one way: a pipe with a valve, a one-way road. A directed graph is a graph whose edges have a direction. Each such edge is called an arc and is drawn as an arrow, written 2→5 for an arc from vertex 2 to vertex 5. A directed path follows arcs only in the direction of their arrows, through different vertices, like a path in an ordinary graph. To count the directed paths from vertex 1 to every other vertex there is no need to list them. A directed path to vertex j arrives along exactly one arc i→j, straight after a directed path to i. So the number of directed paths into j is the sum of the numbers for all the vertices i with an arc i→j. When every arc goes from a smaller number to a larger one, you can fill in the numbers in order: 1 at the start, then each vertex from the numbers already written. The cited section defines directed graphs and directed paths; this way of counting them is worked out here.',
   steps: [
    'Write 1 beside the starting vertex: the directed path that has not moved yet.',
    'Go through the other vertices in the order of their numbers. For each one, find the arcs that point into it.',
    'Add the numbers already written beside the vertices those arcs come from, and write the total beside the new vertex.',
    'The number beside the end vertex is the number of directed paths from the start to it.'
   ],
   example: {
    prompt: 'Arcs 1→2, 1→3, 2→3, 2→4 and 3→4. How many directed paths go from 1 to 4?',
    steps: ['Vertex 1 gets 1. Only 1→2 points into vertex 2, so it gets 1.', 'Vertex 3 gets 1 + 1 = 2, from 1 and 2. Vertex 4 gets 1 + 2 = 3, from 2 and 3.'],
    answer: '3 directed paths: 1→2→4, 1→3→4 and 1→2→3→4.'
   },
   pitfalls: [
    'Following an arc against its arrow. 3→5 lets water go from 3 to 5, never from 5 to 3.',
    'Adding up the arcs that point in instead of the numbers written beside the vertices they come from.',
    'Filling in a vertex before every vertex that points into it has its number.'
   ]
  },
  guidance: [
   { prompt: 'Arcs point into junction 5 from 2, 3 and 4. Count the directed paths from 1 to each of those first, then add. How many directed paths go from 1 to 5?', answer: [4], labels: ['paths to the inner junction'], explanation: 'Junction 5 gets 1 + 2 + 1 = 4 (from junctions 2, 3 and 4).' },
   { prompt: 'Arcs point into junction 7 from 5 and 6. How many directed paths go from 1 to 7?', answer: [7], labels: ['paths to the last junction'], explanation: 'Junction 7 gets 4 + 3 = 7 (from junctions 5 and 6). Each directed path to 7 arrives along exactly one of these arcs, so nothing is counted twice.' }
  ]
 },
 {
  id: 'q33', title: 'Reading the pump gauges', topic: 'Flows and cuts', tier: 'Advanced', sector: 'Pumping Station',
  brief: 'The gauges show how much water each pipe is carrying, and the station chief wants the total delivered and the most that one group of pipes could ever pass.',
  lesson: 'The value of a flow is what leaves the source; the capacity of a cut is the total capacity of the arcs from the source side to the sink side, and no flow is worth more than any cut.',
  prompt: 'Water runs from the source, junction 1, to the sink, the reservoir at junction 5, through one-way pipes. For each arc the flow now running and its capacity are given in litres per second: 1→2 carries 3 of 5; 1→3 carries 5 of 6; 2→3 carries 1 of 3; 2→4 carries 2 of 2; 3→4 carries 2 of 5; 3→5 carries 4 of 6; 4→5 carries 4 of 5. Enter the value of this flow, then the capacity of the cut that puts junctions 1 and 3 on the source side and 2, 4 and 5 on the sink side.',
  answer: [8, 16], labels: ['value of the flow', 'capacity of the cut'], tolerance: 0.01,
  hints: [
   'The value of a flow is the total leaving the source. Nothing flows into the source here, so add the flows on the arcs that leave it.',
   'For the cut, add the capacities, not the flows, of the arcs that start on the source side and end on the sink side. An arc pointing back from the sink side to the source side is not counted.'
  ],
  solution: 'Nothing flows into junction 1, so the value is what leaves it: 3 + 5 = 8 litres per second, the same as the 4 + 4 arriving at junction 5. The arcs from the source side to the sink side are 1→2 (5), 3→4 (5) and 3→5 (6), so the cut’s capacity is 5 + 5 + 6 = 16 litres per second. 2→3 points back from the sink side and is not counted. The flow’s value, 8, is no more than the cut’s capacity, as it must be for every cut.',
  xp: 200, prereqs: ['q32'],
  artifact: { name: 'Gauge log', description: 'Every pipe’s flow beside its capacity, and one line drawn across the station.' },
  sources: [source.kt13_1, source.kt13_2],
  teaching: {
   intuition: 'A flow network is a directed graph with two special vertices, the source where the water starts and the sink where it ends, and a capacity on every arc: the most it can carry, here in litres per second. A flow says how much runs along each arc. It never exceeds the arc’s capacity, and at every vertex other than the source and the sink, water in equals water out, because junctions store nothing. The value of the flow is the total leaving the source, which is also the total reaching the sink. A cut splits the vertices into two sides, with the source on one side and the sink on the other. Every drop has to cross from the source side to the sink side somewhere, so the capacity of the cut, the total capacity of the arcs that point from the source side to the sink side, is a ceiling on the value of every flow. Arcs that point back from the sink side are not counted.',
   steps: [
    'Check the flow: each arc carries at most its capacity, and at each inner junction the flows in add up to the flows out.',
    'Add the flows on the arcs leaving the source: that total is the value of the flow.',
    'For a cut, list the arcs that start on the source side and end on the sink side.',
    'Add their capacities. That is the capacity of the cut, and it is at least the value of every flow.'
   ],
   example: {
    prompt: 'Source 1 and sink 4. Flow and capacity on each arc: 1→2 carries 3 of 5, 1→3 carries 4 of 4, 2→3 carries 1 of 2, 2→4 carries 2 of 6, 3→4 carries 5 of 7. Find the value of the flow and the capacity of the cut with 1 and 2 on the source side.',
    steps: ['Value: 3 + 4 = 7 litres per second leave the source, and 2 + 5 = 7 reach the sink.', 'The cut {1, 2} against {3, 4}: the arcs that cross forwards are 1→3, 2→3 and 2→4, with capacities 4 + 2 + 6 = 12.'],
    answer: 'The value is 7 and the cut’s capacity is 12.'
   },
   pitfalls: [
    'Adding flows instead of capacities for the cut. A cut’s capacity does not depend on the flow running now.',
    'Counting an arc that points back from the sink side to the source side. Water on it is not crossing towards the sink.',
    'Taking the value of the flow as the total over every arc. Water that passes through several pipes would be counted several times.'
   ]
  },
  guidance: [
   { prompt: 'Water in equals water out at every junction other than the source and the sink. How much flows into junction 2, and how much flows out of it?', answer: [3, 3], labels: ['into junction 2', 'out of junction 2'], explanation: 'In: 1→2 carries 3. Out: 2→3 and 2→4 carry 1 + 2 = 3. The two balance.' },
   { prompt: 'What is the total flow leaving junction 1, the source?', answer: [8], labels: ['value of the flow'], explanation: '1→2 carries 3 and 1→3 carries 5, so 8 litres per second leave the source. That is the value of the flow.' },
   { prompt: 'Which arcs go from {1, 3} to {2, 4, 5}? Add their capacities.', answer: [16], labels: ['capacity of the cut'], explanation: 'The forward arcs are 1→2 (5), 3→4 (5) and 3→5 (6): 5 + 5 + 6 = 16. 2→3 points back from the sink side and is not counted.' }
  ]
 },
 {
  id: 'q34', title: 'The narrowest pipes', topic: 'Maximum flow equals minimum cut', tier: 'Advanced', sector: 'Pumping Station',
  brief: 'The reservoir needs as much water per second as the pipes will carry, and the chief wants the exact figure before the pumps are set.',
  lesson: 'The largest value of a flow equals the smallest capacity of a cut: the max-flow min-cut theorem.',
  prompt: 'The pumping station sends water from the source, junction 1, to the sink, junction 5. The one-way pipes and their capacities in litres per second are 1→2 (9), 1→3 (7), 2→3 (3), 2→4 (4), 3→4 (2), 3→5 (5), 4→5 (8). Enter the capacity of the cut with only junction 1 on the source side, then the capacity of the cut with only junction 5 on the sink side, then the maximum flow from 1 to 5 in litres per second.',
  answer: [16, 13, 11], labels: ['cut around the source', 'cut around the sink', 'maximum flow'], tolerance: 0.01,
  hints: [
   'Every flow’s value is at most every cut’s capacity, and the max-flow min-cut theorem says the largest flow equals the smallest cut capacity.',
   'Junctions 2, 3 and 4 can each sit on the source side or the sink side, so there are 2 × 2 × 2 = 8 cuts. Work out all eight capacities, counting only arcs from the source side to the sink side.'
  ],
  solution: 'Around the source: 9 + 7 = 16. Around the sink: 5 + 8 = 13. All eight cuts, by their source side: {1} 16; {1, 2} 14; {1, 3} 16; {1, 4} 24; {1, 2, 3} 11; {1, 2, 4} 18; {1, 3, 4} 22; {1, 2, 3, 4} 13. The smallest is {1, 2, 3} with 11. By the max-flow min-cut theorem the maximum flow equals the smallest cut capacity, so it is 11 litres per second.',
  xp: 200, prereqs: ['q33'],
  artifact: { name: 'Bottleneck map', description: 'The one line across the station that limits everything the pumps can send.' },
  sources: [source.kt13_2, source.kt13_4],
  teaching: {
   intuition: 'Every cut is a ceiling on every flow, because all the water must cross from the source side to the sink side. So the maximum flow is at most the smallest cut capacity. The max-flow min-cut theorem says more: some flow reaches that ceiling exactly, so the maximum flow equals the minimum cut capacity. The smallest cut is the network’s real bottleneck, and it is often not the obvious one at the source or at the sink. It can run through the middle, where a few narrow pipes carry everything. In a small network you can list every cut. Each inner vertex is on the source side or on the sink side, so with three inner vertices there are 2 × 2 × 2 = 8 cuts. Work out each capacity; the smallest is the maximum flow.',
   steps: [
    'List the cuts: the source is always on the source side and the sink on the sink side, and each inner vertex can go either way.',
    'For each cut, add the capacities of the arcs from the source side to the sink side, leaving out arcs that point back.',
    'Find the smallest of these capacities.',
    'By the max-flow min-cut theorem the maximum flow equals it. If you can, check by finding a flow of that value.'
   ],
   example: {
    prompt: 'Source 1 and sink 4, with arcs and capacities 1→2 (5), 2→4 (3), 1→3 (4) and 3→4 (6). What is the maximum flow?',
    steps: ['The four cuts, by source side: {1} 5 + 4 = 9; {1, 2} 3 + 4 = 7; {1, 3} 5 + 6 = 11; {1, 2, 3} 3 + 6 = 9.', 'The smallest is {1, 2}, with 7. Sending 3 along 1→2→4 and 4 along 1→3→4 reaches it.'],
    answer: 'The maximum flow is 7 litres per second.'
   },
   pitfalls: [
    'Stopping at the cut around the source or the sink. A cut through the middle can be smaller.',
    'Counting an arc that points back from the sink side, which makes a cut look bigger than it is.',
    'Taking the largest cut instead of the smallest. Every cut is a ceiling, so only the lowest one decides.'
   ]
  },
  guidance: [
   { prompt: 'Only junction 1 on the source side: which arcs cross, and what is the total of their capacities?', answer: [16], labels: ['cut around the source'], explanation: '1→2 and 1→3 cross: 9 + 7 = 16.' },
   { prompt: 'Only junction 5 on the sink side: which arcs cross, and what is the total of their capacities?', answer: [13], labels: ['cut around the sink'], explanation: '3→5 and 4→5 cross: 5 + 8 = 13.' },
   { prompt: 'Now work out the other six cuts as well. What is the smallest capacity of all eight?', answer: [11], labels: ['smallest cut capacity'], explanation: 'By source side: {1} 16; {1, 2} 14; {1, 3} 16; {1, 4} 24; {1, 2, 3} 11; {1, 2, 4} 18; {1, 3, 4} 22; {1, 2, 3, 4} 13. The smallest is {1, 2, 3}, 11, so no flow can beat 11, and the theorem says 11 can be reached.' }
  ]
 },
 {
  id: 'q35', title: 'Every possible cable plan', topic: 'Labelled trees: Cayley’s formula', tier: 'Advanced', sector: 'Archive',
  brief: 'The archive wants a drawer for every way cables could ever link a group of domes, and needs to know how many drawers to build.',
  lesson: 'There are n to the power n − 2 labelled trees on n numbered vertices: Cayley’s formula.',
  prompt: 'The archive is filing every possible cable plan that links 6 numbered domes as a tree: 5 cables, every dome reachable from every other, and no loop of cables. Two plans count as different when some pair of domes is joined in one plan and not in the other. It has already filed 250 different plans. Enter the number of labelled trees on 6 vertices, then the number of plans still missing. Type numbers without commas.',
  answer: [1296, 1046], labels: ['labelled trees', 'plans still missing'], tolerance: 0.01,
  hints: [
   'Cayley’s formula: the number of labelled trees on n vertices is n to the power n − 2, that is, n multiplied by itself n − 2 times.',
   'The plans still missing are the labelled trees that have not been filed yet: take the ones filed away from the total.'
  ],
  solution: 'With n = 6, n − 2 = 4, so Cayley’s formula gives 6⁴ = 6 × 6 × 6 × 6 = 1296 labelled trees. 1296 − 250 = 1046 plans are still missing.',
  xp: 200, prereqs: ['q12'],
  artifact: { name: 'Plan drawers', description: 'One drawer for every tree that could link the domes, numbered to the last.' },
  sources: [source.kt5_6],
  teaching: {
   intuition: 'A tree is a connected graph with no cycle; on n vertices it always has n − 1 edges. When the vertices carry names or numbers, two trees count as different whenever some pair of vertices is joined in one and not in the other, even if the two drawings have the same shape. These are labelled trees. For 3 numbered vertices there are 3: a path with vertex 1, 2 or 3 in the middle. For 4 there are already 16. Cayley’s formula gives the count for every n: there are n to the power n − 2 labelled trees, written nⁿ⁻², which means n multiplied by itself n − 2 times. The count grows very fast: 10 domes could be linked by 100000000 different cable trees.',
   steps: [
    'Check that the plans are trees on numbered vertices: connected, no cycles, n − 1 edges.',
    'Work out the power n − 2.',
    'Multiply n by itself that many times: the result is the number of labelled trees.',
    'Use the total as the whole set of plans: take away the ones already made to get those still missing.'
   ],
   example: {
    prompt: 'How many labelled trees are there on 4 numbered vertices?',
    steps: ['n − 2 = 2, so Cayley’s formula gives 4² = 4 × 4 = 16.', 'Check: 4 of them are stars, one centre joined to the other three, and 12 are paths, because a path through all 4 can be written in 24 orders and each path is written twice, once from each end.'],
    answer: '16 labelled trees.'
   },
   pitfalls: [
    'Using the power n, or n − 1, the number of edges, instead of n − 2.',
    'Counting shapes instead of labelled trees. On 4 vertices there are only two shapes, a star and a path, but 16 labelled trees.',
    'Typing a large count with a comma for thousands: type a number like 4096 as 4096, not 4,096.'
   ]
  },
  guidance: [
   { prompt: 'For 6 vertices, what is the power n − 2 in Cayley’s formula?', answer: [4], labels: ['power n − 2'], explanation: '6 − 2 = 4.' },
   { prompt: 'Multiply 6 by itself 4 times. How many labelled trees are there on 6 vertices?', answer: [1296], labels: ['labelled trees'], explanation: '6⁴ = 6 × 6 × 6 × 6 = 1296.' },
   { prompt: '250 plans are filed already. How many are still missing?', answer: [1046], labels: ['plans still missing'], explanation: '1296 − 250 = 1046.' }
  ]
 },
 {
  id: 'q36', title: 'The filing code', topic: 'Prüfer codes', tier: 'Advanced', sector: 'Archive',
  brief: 'Old cable plans are filed as short strings of dome numbers to save space, and a repair crew needs facts about one plan without redrawing it.',
  lesson: 'A labelled tree on n vertices is stored as a Prüfer code of n − 2 numbers, in which each vertex appears one time fewer than its degree.',
  prompt: 'A tree plan for 7 domes, numbered 1 to 7, is filed in the archive as its Prüfer code (3, 6, 3, 1, 6). Enter the degree of dome 3 (its number of cables), then the number of leaves (domes with exactly one cable), then the number of the first leaf that was removed when the code was made.',
  answer: [3, 4, 2], labels: ['degree of the dome', 'leaves', 'first leaf removed'], tolerance: 0.01,
  hints: [
   'Each vertex is written in the Prüfer code one time fewer than its degree.',
   'A leaf is never written in the code, so the leaves are exactly the numbers that do not appear in it. The code is made by always removing the smallest-numbered leaf.'
  ],
  solution: 'Dome 3 appears twice in the code, so its degree is 2 + 1 = 3. The numbers from 1 to 7 that never appear are 2, 4, 5 and 7: those are the leaves, so there are 4. The first leaf removed is the smallest of them, 2.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Filing card', description: 'A whole cable tree squeezed into one short line of numbers.' },
  sources: [source.kt5_6],
  teaching: {
   intuition: 'The degree of a vertex is its number of edges, and a leaf is a vertex of degree 1, the end of a branch. A Prüfer code turns a labelled tree into a list of numbers. Remove the leaf with the smallest label and write down the label of its one neighbour. Repeat on the tree that is left, until only two vertices remain. A tree on n vertices gives a list of n − 2 numbers, and different trees give different lists; that is how Cayley’s formula is proved. The code can be read without rebuilding the tree. A vertex is written down each time one of its neighbours is removed while it stays, and it loses all its edges that way except one: the edge it is removed by, or the last edge between the final two vertices. So each vertex appears one time fewer than its degree, and the leaves never appear at all; the cited section gives the code and Cayley’s formula, and this count is worked out here. The first leaf removed is the smallest label missing from the code.',
   steps: [
    'Find n: the code has n − 2 numbers, so n is its length plus 2.',
    'Count how often a vertex appears; its degree is that count plus 1.',
    'The leaves are the labels from 1 to n that never appear.',
    'The first leaf removed is the smallest label that does not appear.'
   ],
   example: {
    prompt: 'Make the Prüfer code of the tree on 5 vertices with edges 1–2, 2–3, 2–4 and 4–5.',
    steps: ['The leaves are 1, 3 and 5. Remove 1, the smallest, and write its neighbour 2. The leaves are now 3 and 5: remove 3 and write 2.', 'Now 2 is a leaf, joined only to 4: remove it and write 4. Only 4 and 5 are left, so stop.', 'Check: 2 appears twice and has degree 3; 4 appears once and has degree 2; the leaves 1, 3 and 5 never appear.'],
    answer: 'The code is (2, 2, 4).'
   },
   pitfalls: [
    'Taking the degree to be the number of appearances. Add 1: a vertex that appears twice has degree 3.',
    'Thinking a vertex missing from the code is missing from the tree. It is there, as a leaf.',
    'Removing any leaf. The code always removes the leaf with the smallest label, or it would not be one fixed list.'
   ]
  },
  guidance: [
   { prompt: 'How many times does 3 appear in the code (3, 6, 3, 1, 6)?', answer: [2], labels: ['times it appears'], explanation: 'Dome 3 appears twice.' },
   { prompt: 'Each vertex appears one time fewer than its degree. What is the degree of dome 3?', answer: [3], labels: ['degree of the dome'], explanation: '2 + 1 = 3.' },
   { prompt: 'Which numbers from 1 to 7 never appear in the code? Enter how many there are, then the smallest.', answer: [4, 2], labels: ['leaves', 'first leaf removed'], explanation: '2, 4, 5 and 7 never appear, so there are 4 leaves, and the smallest, 2, was removed first.' }
  ]
 },
 {
  id: 'q37', title: 'Linked and unlinked servers', topic: 'Cliques and independent sets', tier: 'Advanced', sector: 'Archive',
  brief: 'The archive’s servers are being grouped for backups, and Mira wants the biggest fully linked group and the biggest group with no links at all.',
  lesson: 'The clique number ω is the size of the largest set of vertices all joined to each other; the independence number α is the size of the largest set with no edge inside it.',
  prompt: 'Seven archive servers, numbered 1 to 7, have direct links 1–2, 1–3, 1–7, 2–3, 2–4, 3–4, 4–5, 5–6, 5–7, 6–7. Enter the clique number ω, the size of the largest set of servers that are all linked to each other, then the independence number α, the size of the largest set of servers no two of which are linked.',
  answer: [3, 3], labels: ['clique number ω', 'independence number α'], tolerance: 0.01,
  hints: [
   'A clique is a set of vertices every two of which are joined by an edge. Look for three vertices that are all joined, then check whether a fourth joins all three.',
   'For an independent set, pick a vertex, cross out its neighbours, pick another vertex that is left, and repeat. Try different starting vertices and keep the largest set you find.'
  ],
  solution: 'Servers 1, 2 and 3 are all linked to each other, and no 4 servers are, so ω = 3. Servers 1, 4 and 6 have no link between any two of them, and no 4 servers are like that, so α = 3.',
  xp: 200, prereqs: ['q28'],
  artifact: { name: 'Backup groups', description: 'Two lists of servers: one where every server talks to every other, one where none do.' },
  sources: [source.kt5_4, source.kt11_1],
  teaching: {
   intuition: 'A clique is a set of vertices in which every two are joined by an edge. An independent set is the opposite: a set of vertices in which no two are joined. The clique number of a graph, written ω (omega), is the size of its largest clique, and the independence number, written α (alpha), is the size of its largest independent set. Two families show the extremes. The complete graph Kₙ has n vertices with every pair joined, so ω = n and α = 1. The cycle Cₙ is n vertices in a ring, each joined to the next and the last to the first. With 4 or more vertices it has no triangle, so ω = 2, and taking every second vertex gives α = n ÷ 2 rounded down. Both numbers are tied to colouring: the vertices of a clique all need different colours, so the chromatic number χ is at least ω, and the vertices of any one colour form an independent set.',
   steps: [
    'To find ω, look for triangles, then try to add a vertex joined to every vertex of the clique; stop when no clique can grow.',
    'To find α, choose a vertex, cross out its neighbours, choose another vertex that is left, and repeat.',
    'Try several starting points for both, and keep the largest sets you find.',
    'Check that nothing bigger works: for ω, that no set one larger is fully joined; for α, that every set one larger contains an edge.'
   ],
   example: {
    prompt: 'Find ω and α for the cycle C₆, six vertices in a ring.',
    steps: ['The two neighbours of any vertex are not joined, so there is no triangle: ω = 2.', 'Vertices 1, 3 and 5 have no edge between them, and any 4 of the 6 include two neighbours, so α = 3.'],
    answer: 'ω = 2 and α = 3.'
   },
   pitfalls: [
    'Finding a clique that cannot grow and stopping there. A different clique elsewhere may be larger.',
    'Mixing up the two: ω counts vertices that are all joined, α counts vertices with no edge between any two.',
    'In a ring with an odd number of vertices, taking every second vertex all the way round: the last one taken and the first would then be neighbours.'
   ]
  },
  guidance: [
   { prompt: 'Find a largest set of servers that are all linked to each other. How many servers are in it?', answer: [3], labels: ['clique number ω'], explanation: 'Servers 1, 2 and 3 are all linked to each other, and no larger set is, so ω = 3.' },
   { prompt: 'Find a largest set of servers with no link between any two of them. How many servers are in it?', answer: [3], labels: ['independence number α'], explanation: 'Servers 1, 4 and 6 have no link between them, and no larger set is free of links, so α = 3.' }
  ]
 },
 {
  id: 'q38', title: 'Counting fully linked groups', topic: 'Counting triangles and cliques', tier: 'Advanced', sector: 'Archive',
  brief: 'A fully linked group of domes is planned, and the archive wants to index every triangle and every larger fully linked group in it.',
  lesson: 'In the complete graph Kₙ every choice of k vertices is a clique of k vertices, so there are C(n, k) of them; the triangles are the C(n, 3) cliques of 3.',
  prompt: 'The archive plans a fully linked group of 9 domes, with a tunnel between every pair: the complete graph K₉. Enter the number of triangles, the sets of 3 domes all joined to each other, then the number of 4-cliques, the sets of 4 domes all joined to each other. Type numbers without commas.',
  answer: [84, 126], labels: ['triangles', 'k-cliques'], tolerance: 0.01,
  hints: [
   'In a complete graph every set of 3 vertices is a triangle, so the triangles are the ways to choose 3 of the vertices, C(n, 3).',
   'In the same way every choice of k vertices is a k-clique: C(n, k) = n × (n − 1) × … with k factors on top, divided by k × (k − 1) × … × 1.'
  ],
  solution: 'Every 3 of the 9 domes form a triangle, so there are C(9, 3) = (9 × 8 × 7) ÷ (3 × 2 × 1) = 84. Every 4 of them form a 4-clique, so there are C(9, 4) = (9 × 8 × 7 × 6) ÷ (4 × 3 × 2 × 1) = 126.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Clique index', description: 'An index card for every fully linked group, sorted by size.' },
  sources: [source.o12_2],
  teaching: {
   intuition: 'A triangle is three vertices that are all joined to each other: a clique of 3. In the complete graph Kₙ every pair of vertices is joined, so any three vertices you choose form a triangle, and any k vertices form a k-clique, a clique of k vertices. Counting them is therefore the same as counting choices. From Discrete mathematics, the number of ways to choose k things from n, when order does not matter, is C(n, k) = n! ÷ (k! × (n − k)!). It is quickest to work out as n × (n − 1) × … with k factors on top, divided by k × (k − 1) × … × 1. So Kₙ has C(n, 3) triangles and C(n, k) k-cliques. These counts are entries of Pascal’s triangle: row 7 holds C(7, 3) = 35, the number of triangles in K₇.',
   steps: [
    'Check that the graph is complete: every pair of vertices is joined.',
    'A clique of k vertices is just a choice of k vertices, so the count is C(n, k).',
    'Work out C(n, k) as the product of k numbers counting down from n, divided by the product of k numbers counting down from k.',
    'For triangles, use k = 3.'
   ],
   example: {
    prompt: 'How many triangles and how many 4-cliques does K₅ have?',
    steps: ['Triangles: C(5, 3) = (5 × 4 × 3) ÷ (3 × 2 × 1) = 10.', '4-cliques: C(5, 4) = (5 × 4 × 3 × 2) ÷ (4 × 3 × 2 × 1) = 5, one for each vertex left out.'],
    answer: '10 triangles and 5 4-cliques.'
   },
   pitfalls: [
    'Forgetting to divide by k × (k − 1) × … × 1, which counts each clique once for every order of its vertices.',
    'Counting edges, C(n, 2), when the question asks for triangles.',
    'Typing a large count with a comma for thousands: type a number like 4060 as 4060, not 4,060.'
   ]
  },
  guidance: [
   { prompt: 'How many ways are there to choose 3 of the 9 domes?', answer: [84], labels: ['triangles'], explanation: 'C(9, 3) = (9 × 8 × 7) ÷ (3 × 2 × 1) = 84, and each choice is a triangle.' },
   { prompt: 'How many ways are there to choose 4 of the 9 domes?', answer: [126], labels: ['k-cliques'], explanation: 'C(9, 4) = (9 × 8 × 7 × 6) ÷ (4 × 3 × 2 × 1) = 126, and each choice is a 4-clique.' }
  ]
 },
 {
  id: 'q39', title: 'Cables and beams', topic: 'Ramsey’s guarantee', tier: 'Advanced', sector: 'Archive',
  brief: 'The archive’s link plans mix cables and radio beams, and the safety office needs to know when three domes are sure to share links of one kind.',
  lesson: 'Every two-colour K₆ contains a one-colour triangle and a two-colour K₅ need not: the Ramsey number R(3, 3) is 6.',
  prompt: 'In an archive plan for 9 domes, every pair of domes is joined by exactly one link, and each link is either a cable or a radio beam: a two-colour K₉. Enter the largest number that is guaranteed however the links are chosen: at least this many links of one kind meet at dome 4. Then enter 1 if every such plan must contain three domes joined to each other by links of one kind only, a one-kind triangle, or 0 if some choice of links avoids one.',
  answer: [4, 1], labels: ['links of one kind guaranteed', 'one-kind triangle (1 yes, 0 no)'], tolerance: 0.01,
  hints: [
   'Pigeonhole principle: when a number of links is split into two kinds, one kind gets at least half of them, rounded up.',
   'A one-kind triangle is guaranteed exactly when the plan has at least R(3, 3) domes.'
  ],
  solution: 'Dome 4 is joined to the other 8 domes, so 8 links meet there. If each kind had 3 or fewer, there would be at most 6 links, fewer than 8, so one kind has at least 4; and a split of 4 and 4 shows no larger number is certain. 9 is at least R(3, 3) = 6, so a one-kind triangle is guaranteed: pick any 6 of the domes and the argument for six applies to them.',
  xp: 200, prereqs: ['q38'],
  artifact: { name: 'Two-colour chart', description: 'Six domes, two kinds of link, and the triangle that cannot be avoided.' },
  sources: [source.kt11_1, source.kt11_2],
  teaching: {
   intuition: 'Colour every edge of a complete graph with one of two colours, say cable or beam. Can you always find a one-colour triangle, three vertices joined to each other by edges of the same colour? With five vertices, no: colour the ring 1–2–3–4–5–1 one way and the other five edges, a star inside the ring, the other way, and every triangle mixes both. With six, always. Pick any vertex v: it has five edges. The pigeonhole principle says that if five things go into two boxes, one box gets at least three; in general one of the two colours gets at least half the edges, rounded up. So v has three edges of one colour, say cable, to vertices a, b and c. If any edge among a, b and c is a cable, it makes a cable triangle with v. If none is, a, b and c form a beam triangle. The smallest number of vertices that forces a one-colour triangle is the Ramsey number R(3, 3), so R(3, 3) = 6, and every larger complete graph contains a K₆ and so has the same guarantee.',
   steps: [
    'Count the edges at one vertex: in Kₙ it is joined to the other n − 1 vertices.',
    'Split them into two colours as evenly as possible: the bigger colour gets half, rounded up, and that is the most that is certain.',
    'Compare n with R(3, 3) = 6: from 6 vertices on, a one-colour triangle is guaranteed.',
    'Below 6, show a colouring that avoids one, such as a ring in one colour and every other edge in the other.'
   ],
   example: {
    prompt: 'A two-colour K₇. How many edges of one colour must meet at a vertex, and is a one-colour triangle guaranteed?',
    steps: ['A vertex has 6 edges. With 2 or fewer of each colour there would be at most 4, so one colour has at least 3, and a split of 3 and 3 shows that 4 is not certain.', '7 is at least R(3, 3) = 6, so a one-colour triangle is guaranteed.'],
    answer: '3 edges of one colour, and yes, a one-colour triangle.'
   },
   pitfalls: [
    'Rounding half of the edges down when their number is odd. The bigger colour gets the larger half.',
    'Thinking a one-colour triangle needs many vertices. Six are already enough, whatever the colouring.',
    'Thinking five vertices are enough because a triangle needs only three. The ring-and-star colouring of K₅ has none.'
   ]
  },
  guidance: [
   { prompt: 'How many links meet at dome 4?', answer: [8], labels: ['links at the dome'], explanation: 'Dome 4 is joined once to each of the other 8 domes.' },
   { prompt: 'Split 8 links into two kinds as evenly as you can. How many does the bigger kind get?', answer: [4], labels: ['links of one kind guaranteed'], explanation: '8 = 4 + 4, so the bigger share is 4, and no split does better than that for both kinds.' },
   { prompt: 'Is a one-kind triangle guaranteed for 9 domes? Enter 1 for yes, 0 for no.', answer: [1], labels: ['one-kind triangle (1 yes, 0 no)'], explanation: '9 is at least R(3, 3) = 6, so a one-kind triangle is guaranteed: pick any 6 of the domes and the argument for six applies to them.' }
  ]
 },
 {
  id: 'q40', title: 'The ring habitat', topic: 'Realm review and bridge to Topology', tier: 'Advanced', sector: 'Archive',
  brief: 'The last plan in the archive is for a future habitat shaped like a ring, and Mira wants to see what becomes of Euler’s formula there.',
  lesson: 'A grid wrapped round a torus has V − E + F = 0, not 2: the value of V − E + F depends on the surface a network is drawn on.',
  prompt: 'Mira’s last plan is for a ring-shaped habitat on a torus, the surface of a ring doughnut. Its corridors form a grid that wraps all the way round: 4 corridors circle the tube, 6 corridors circle the ring, and each corridor of one kind crosses each corridor of the other kind exactly once. Take each crossing as a vertex, each stretch of corridor between two neighbouring crossings as an edge, and each block enclosed by four stretches as a face. Enter V, then E, then F, then V − E + F.',
  answer: [24, 48, 24, 0], labels: ['vertices V', 'edges E', 'faces F', 'V − E + F'], tolerance: 0.01,
  hints: [
   'Every corridor of one kind meets every corridor of the other kind once, so the crossings are the product of the two counts. Four stretches meet at every crossing, and each stretch has two ends.',
   'Every block has four sides, and on the torus every stretch is a side of exactly two blocks.'
  ],
  solution: 'V = 4 × 6 = 24 crossings. Four stretches meet at each crossing and each stretch has two ends, so E = 4 × 24 ÷ 2 = 48. Each block has four sides and each stretch borders two blocks, so F = 2 × 48 ÷ 4 = 24. V − E + F = 24 − 48 + 24 = 0, not the 2 of Euler’s formula in the plane: the number belongs to the surface the network is drawn on.',
  xp: 200, prereqs: ['q24', 'q39'],
  artifact: { name: 'Torus survey', description: 'A street grid that never ends, and the number that tells its surface apart from a flat map.' },
  sources: [source.kt5_5],
  teaching: {
   intuition: 'Euler’s formula says that a connected network drawn in the plane without crossing edges has V − E + F = 2, where V counts vertices, E edges and F faces, the outside region included. That 2 belongs to the plane. A torus is a different surface: the surface of a ring doughnut. Draw a grid on it whose lines wrap all the way round, some circles round the tube and some round the ring, with each circle of one kind crossing each circle of the other kind once. Then four edges meet at every crossing, and every face is a block with four sides; there is no outside region at all. Counting edge ends, two for each edge, gives E = 2V, and counting face sides, two faces along each edge, gives F = V. So V − E + F = 0, whatever the size of the grid. The number V − E + F belongs to the surface, not to the network, and studying surfaces through numbers like this is where Topology begins. The cited section states Euler’s formula for the plane and only notes that other surfaces have their own versions; the torus count of 0 is worked out here.',
   steps: [
    'Count the vertices: each crossing is one, so V is the number of circles of one kind times the number of the other kind.',
    'Count the edges from their ends: four edges meet at each vertex and each edge has two ends, so E = 4V ÷ 2.',
    'Count the faces from their sides: each face has four sides and each edge borders two faces, so F = 2E ÷ 4.',
    'Work out V − E + F and compare it with the 2 of a drawing in the plane.'
   ],
   example: {
    prompt: 'A grid on a torus has 3 circles round the tube and 5 round the ring. Find V, E, F and V − E + F.',
    steps: ['V = 3 × 5 = 15, and E = 4 × 15 ÷ 2 = 30.', 'F = 2 × 30 ÷ 4 = 15, so V − E + F = 15 − 30 + 15 = 0.'],
    answer: 'V = 15, E = 30, F = 15 and V − E + F = 0.'
   },
   pitfalls: [
    'Using Euler’s formula V − E + F = 2 on the torus. It holds for drawings in the plane; here the answer is 0.',
    'Forgetting that every edge has two ends, which gives E = 4V instead of 2V.',
    'Looking for an outside face. On the torus the grid covers the whole surface, so every face is a block.'
   ]
  },
  guidance: [
   { prompt: '4 corridors round the tube each cross 6 corridors round the ring once. How many crossings are there?', answer: [24], labels: ['vertices V'], explanation: '4 × 6 = 24 crossings, so V = 24.' },
   { prompt: 'Four stretches meet at each crossing, and each stretch has two ends. How many stretches are there?', answer: [48], labels: ['edges E'], explanation: '4 × 24 = 96 ends, two per stretch, so E = 48.' },
   { prompt: 'Each block has four sides, and each stretch borders two blocks. Enter F, then V − E + F.', answer: [24, 0], labels: ['faces F', 'V − E + F'], explanation: '2 × 48 = 96 sides, four per block, so F = 24, and 24 − 48 + 24 = 0.' }
  ]
 }
);
})();
