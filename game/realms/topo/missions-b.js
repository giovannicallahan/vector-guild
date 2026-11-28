/* Topology: shape without size missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/topo/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Topological spaces · Basic, 100 XP · sector 'Relay Network' · Chapter review: the relay map [W Topological Spaces, W Continuity]
     q12  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Connected sets and components [L 8.2, W Connectedness]
     q13  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Cut points [W Connectedness]
     q14  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Homeomorphisms: telling shapes apart [W Continuity and Homeomorphisms]
     q15  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Open covers and compactness [L 8.4, W Compactness]
     q16  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Continuous images of compact sets [L 8.5]
     q17  ch 3 Connected and compact · Intermediate, 150 XP · sector 'Cable Works' · Chapter review: one-piece cables [L 8.4, L 8.5]
     q18  ch 4 Gluing surfaces · Intermediate, 150 XP · sector 'Fabric Bay' · Gluing: quotient spaces [H 7.7]
     q19  ch 4 Gluing surfaces · Intermediate, 150 XP · sector 'Fabric Bay' · The standard surfaces [H 7.5]
     q20  ch 4 Gluing surfaces · Intermediate, 150 XP · sector 'Fabric Bay' · Euler characteristic of a cell division [H 7.5] */
(function(){
'use strict';
/* Lebl, Introduction to Real Analysis, chapter 8; Hitchman, Geometry with an Introduction to Cosmic Topology, chapter 7; Wikibooks, Topology.
   One entry per section the missions below cite; each page was opened on the date in `verified`. */
const source = {
 l82: { title: 'Lebl, Introduction to Real Analysis (LibreTexts) — 8.2 Open and Closed Sets', url: 'https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.02%3A_Open_and_Closed_Sets', description: 'Open and closed sets, and connected sets: a subset of the real line is connected exactly when it is an interval or a single point.', verified: '2026-11-28' },
 l84: { title: 'Lebl, Introduction to Real Analysis (LibreTexts) — 8.4 Completeness and Compactness', url: 'https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.04%3A_Completeness_and_Compactness', description: 'Open covers and compact sets: a compact set is closed and bounded, and a closed bounded subset of ℝⁿ is compact.', verified: '2026-11-28' },
 l85: { title: 'Lebl, Introduction to Real Analysis (LibreTexts) — 8.5 Continuous Functions', url: 'https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.05%3A_Continuous_Functions', description: 'Continuous maps send compact sets to compact sets, and a continuous real function on a compact space reaches a minimum and a maximum.', verified: '2026-11-28' },
 h75: { title: 'Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.5 Surfaces', url: 'https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.05%3A_Surfaces', description: 'Surfaces, the torus, Klein bottle and projective plane, orientability through the Möbius strip, cell divisions and the Euler characteristic v − e + f.', verified: '2026-11-28' },
 h77: { title: 'Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.7 Quotient Spaces', url: 'https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.07%3A_Quotient_Spaces', description: 'Gluing as identifying points: equivalence classes, quotient sets, and a torus made by identifying the edges of a rectangle in pairs.', verified: '2026-11-28' },
 wTop: { title: 'Wikibooks, Topology — Topological Spaces', url: 'https://en.wikibooks.org/wiki/Topology/Topological_Spaces', description: 'The axioms of a topology, small examples on the set {1, 2, 3}, and closed sets as the complements of open sets.', verified: '2026-11-28' },
 wCont: { title: 'Wikibooks, Topology — Continuity and Homeomorphisms', url: 'https://en.wikibooks.org/wiki/Topology/Continuity_and_Homeomorphisms', description: 'Continuity as open preimages of open sets, homeomorphisms as continuous bijections with continuous inverses, and topological properties.', verified: '2026-11-28' },
 wConn: { title: 'Wikibooks, Topology — Connectedness', url: 'https://en.wikibooks.org/wiki/Topology/Connectedness', description: 'Connected and disconnected spaces, with (0, 1) without the point 1/2 as a disconnected example, and continuous images of connected spaces.', verified: '2026-11-28' },
 wComp: { title: 'Wikibooks, Topology — Compactness', url: 'https://en.wikibooks.org/wiki/Topology/Compactness', description: 'Open covers, finite subcovers and compactness; continuous images of compact sets are compact; closed and bounded Euclidean sets are compact.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: 'Mapping the relay mesh', topic: 'Chapter review: the relay map', tier: 'Basic', sector: 'Relay Network',
  brief: 'Before the relay network goes live, Mira wants one check of the whole chapter: its open sets, one closure and whether the alarm wiring respects them.',
  lesson: 'A basis generates a topology by unions; the closure of a point is what is left when every open set missing it is taken away; and a map is continuous when every open set pulls back to an open set.',
  prompt: 'The relay network has 4 nodes, A, B, C and D. Mira makes it a topological space: its open sets are ∅ and every union of the basic sets {A}, {C}, {A, B} and {A, B, C, D}, which form a basis. Enter the number of open sets. Then enter the number of nodes in the closure of {B}. Finally, the alarm panel is the space {on, off} whose open sets are ∅, {on} and {on, off}, and the alarm map f sends B and C to on and every other node to off: enter 1 if f is continuous or 0 if it is not.',
  answer: [7, 2, 0], labels: ['open sets', 'nodes in the closure', 'f continuous (1 or 0)'], tolerance: 0.01,
  hints: [
   'Every union of some of the basic sets is open, and so is ∅. Count each different set once, however many ways it can be made.',
   'The closure of a set is the smallest closed set containing it, and a set is closed when its complement is open. Take the union of all the open sets that miss the node; the closure is everything else.',
   'f is continuous when the preimage of every open set of {on, off} is open. The preimages of ∅ and {on, off} are ∅ and the whole network, which are always open, so only f⁻¹({on}) needs checking.'
  ],
  solution: 'The open sets are ∅, {A}, {C}, {A, B}, {A, C}, {A, B, C}, {A, B, C, D}: 7 in all. The open sets that miss B are ∅, {A}, {C} and {A, C}, so the largest open set missing B is {A, C}. Its complement {B, D} is the smallest closed set containing B, so the closure of {B} has 2 nodes. The preimage f⁻¹({on}) is {B, C}, which is not one of the open sets, and the preimages of ∅ and {on, off} are ∅ and the whole network. So f is not continuous: enter 0.',
  xp: 100, prereqs: ['q09', 'q10'],
  artifact: { name: 'Relay mesh chart', description: 'Every open set of the network, with the alarm wiring checked against them.' },
  sources: [source.wTop, source.wCont],
  teaching: {
   intuition: 'This chapter replaced the ruler with a list. A topology on a set is a chosen family of open sets: it must contain the empty set ∅ and the whole set, every union of open sets, and every intersection of finitely many. Listing them all is tiring, so we often list a basis instead, a few basic sets whose unions give every open set. Closed sets are the complements of open sets, and the closure of a set is the smallest closed set that contains it. For one point x, that means: throw away every open set that misses x, and what remains is the closure. A map f between two spaces is continuous when, for every open set V of the target, the preimage f⁻¹(V), the set of points that f sends into V, is open. On a finite space each of these is a short count.',
   steps: [
    'List ∅ and every union of the basic sets, each different set once, and count them.',
    'For the closure of a point x, take the union of all open sets that do not contain x. The closure is the complement of that union.',
    'For continuity, go through the open sets V of the target and work out each preimage f⁻¹(V). The map is continuous exactly when every preimage is in the list of open sets.'
   ],
   example: {
    prompt: 'Three relay nodes P, Q, R have the basis {P}, {P, Q}, {P, Q, R}. A map g to {on, off}, with open sets ∅, {on}, {on, off}, sends P to on and Q, R to off. Count the open sets, find the closure of {Q}, and decide whether g is continuous.',
    steps: [
     'The unions of the basic sets are {P}, {P, Q} and {P, Q, R}; with ∅ that makes 4 open sets.',
     'The open sets missing Q are ∅ and {P}, whose union is {P}. The closure of {Q} is the complement, {Q, R}: 2 nodes.',
     'g⁻¹({on}) = {P}, which is open, and the preimages of ∅ and {on, off} are ∅ and the whole set. So g is continuous.'
    ],
    answer: '4 open sets, a closure of 2 nodes, and g is continuous (1).'
   },
   pitfalls: [
    'Forgetting ∅ in the count, or counting a set twice because two different unions give it.',
    'Taking the closure of {x} to be {x} itself. A single point is closed only when its complement is open.',
    'Checking that f sends open sets to open sets. Continuity is about preimages: pull each open set of the target back, and ask whether that is open.'
   ]
  },
  guidance: [
   { prompt: 'List ∅ and every union of the basic sets {A}, {C}, {A, B} and {A, B, C, D}. How many different open sets are there?', answer: [7], labels: ['open sets'], explanation: 'The open sets are ∅, {A}, {C}, {A, B}, {A, C}, {A, B, C}, {A, B, C, D}: 7 different sets.' },
   { prompt: 'Which open sets do not contain B? How many nodes are in their union, the largest open set that misses B?', answer: [2], labels: ['nodes in the union'], explanation: 'The open sets that miss B are ∅, {A}, {C} and {A, C}. Their union is {A, C}, with 2 nodes.' },
   { prompt: 'The closure of {B} is the complement of {A, C}. How many nodes does it have?', answer: [2], labels: ['nodes in the closure'], explanation: 'The complement of {A, C} is {B, D}. It is closed, because its complement is open, and no smaller closed set contains B.' },
   { prompt: 'The preimage f⁻¹({on}) is {B, C}. Enter 1 if it is one of the open sets, so that f is continuous, or 0 if it is not.', answer: [0], labels: ['f continuous (1 or 0)'], explanation: '{B, C} is not in the list of open sets, so f is not continuous.' }
  ]
 },
 {
  id: 'q12', title: 'Counting cable pieces', topic: 'Connected sets and components', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'Spools of test cable keep arriving cut into odd lengths, and the Cable Works needs to know how many separate runs each layout really is.',
  lesson: 'A connected set cannot be split into two separated open parts; the components of a set are its largest connected pieces.',
  prompt: 'The Cable Works lays a test cable along the set S = [1, 3] ∪ (3, 5) ∪ [6, 7) ∪ [7, 9] ∪ (10, 12) ∪ (12, 13] on a straight bench, measured in metres. Enter the number of components of S. Then enter the number of components of the real line (the full number line, running for ever both ways) with 4 points removed, and of the flat plane with 2 circles removed, where the circles lie side by side: none touches, crosses or lies inside another.',
  answer: [4, 5, 3], labels: ['components of S', 'components of the line', 'components of the plane'], tolerance: 0.01,
  hints: [
   'A component is a largest connected piece. On the line the connected sets are the intervals and single points, so two neighbouring pieces of S join into one exactly when they share an end point that belongs to at least one of them.',
   'Each point removed from the line cuts one piece into two. Each circle removed from the plane cuts off one more region, its inside, from the region outside.'
  ],
  solution: '[1, 3] and (3, 5) share the point 3, which belongs to [1, 3], so they join; [6, 7) and [7, 9] share the point 7, which belongs to [7, 9], so they join. (10, 12) and (12, 13] meet at 12, but 12 belongs to neither, so they stay apart. So the 6 pieces of S make 6 − 2 = 4 components. The number line with 4 points removed falls into 5 open pieces, because each removed point splits one piece into two. The plane with 2 circles removed falls into 3 regions: the inside of each circle, and the one region outside them all.',
  xp: 150, prereqs: ['q05'],
  artifact: { name: 'Cable run tally', description: 'Pieces of cable counted by what is truly joined, not by how they were written.' },
  sources: [source.l82, Object.assign({}, source.wConn, { description: 'Connected and disconnected spaces, with (0, 1) without the point 1/2 as a disconnected example. Components, the largest connected pieces of a set, are not on this page or the one above: they are worked out in this mission.' })],
  teaching: {
   intuition: 'A cable is in one piece when you cannot pull it apart into two bits without cutting it. Topology says this with open sets. A set is disconnected when it can be split into two non-empty parts, each open inside the set and with no point in common. If no such split exists, the set is connected. On the number line the connected sets are exactly the intervals and the single points: a set with a gap, a point missing between two of its points, falls apart at the gap. A set that is not connected breaks into components, its largest connected pieces. Two intervals that touch at a point join into one component when that point belongs to at least one of them, so [1, 3] ∪ (3, 5) is the single interval [1, 5). But (1, 3) ∪ (3, 5) is two components, because the point 3 itself is missing. Removing points cuts: the whole line with one point removed is two pieces. In the plane a single point does not cut, but a circle does, into its inside and its outside. Neither cited section defines components: this mission builds them from the definition of a connected set.',
   steps: [
    'Write the pieces of the set in order along the line.',
    'For each pair of neighbouring pieces that share an end point, check whether that point belongs to at least one of them. If it does, they join.',
    'The number of components is the number of pieces minus the number of joins.',
    'A line with k points removed has k + 1 components. A plane with m circles removed, side by side, has m + 1: the inside of each circle and the outside.'
   ],
   example: {
    prompt: 'How many components have S = [0, 2) ∪ [2, 4] ∪ (5, 6) ∪ (6, 8), and the line with 2 points removed?',
    steps: [
     '[0, 2) and [2, 4] share the point 2, which belongs to [2, 4], so they join into [0, 4]. (5, 6) and (6, 8) meet at 6, but 6 belongs to neither, so they stay apart.',
     'So S has 4 − 1 = 3 components: [0, 4], (5, 6) and (6, 8). The line with 2 points removed has 2 + 1 = 3.'
    ],
    answer: '3 components of S, and 3 of the line.'
   },
   pitfalls: [
    'Counting the pieces as written. Two pieces that share an included end point are one component.',
    'Joining (a, b) and (b, c). The point b is in neither, so a gap of one point keeps them apart.',
    'Thinking a removed point cuts the plane. Around a missing point there is always room to go round, so it takes a whole circle to cut the plane.'
   ]
  },
  guidance: [
   { prompt: 'Which neighbouring pieces of S share an end point that belongs to at least one of them? How many such joins are there?', answer: [2], labels: ['joins'], explanation: '[1, 3] and (3, 5) share the point 3, which belongs to [1, 3], so they join; [6, 7) and [7, 9] share the point 7, which belongs to [7, 9], so they join. (10, 12) and (12, 13] meet at 12, but 12 belongs to neither, so they stay apart.' },
   { prompt: 'S is written as 6 pieces. How many components are left after the joins?', answer: [4], labels: ['components of S'], explanation: 'Each join turns two pieces into one: 6 − 2 = 4.' },
   { prompt: 'How many pieces does the number line fall into when 4 points are removed?', answer: [5], labels: ['components of the line'], explanation: 'Each removed point splits one piece into two, so 4 points leave 4 + 1 = 5 pieces.' },
   { prompt: 'How many regions does the plane fall into when 2 circles are removed, side by side?', answer: [3], labels: ['regions of the plane'], explanation: 'Each circle cuts off its own inside, and the outside is one more region: 2 + 1 = 3.' }
  ]
 },
 {
  id: 'q13', title: 'Snipping the letter loom', topic: 'Cut points', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'The sign shop bends cable into stencil letters, and the riggers want to know which single snip would break a letter apart.',
  lesson: 'A cut point of a connected shape is a point whose removal leaves more than one piece; how many pieces it leaves, and how many end points a shape has, do not change when the shape is stretched.',
  prompt: 'Mira bends a cable into the letter R of the lab’s stencil font, which is drawn in thin strokes: a straight stem with a curved bowl from the top of the stem back to its middle, and a straight leg going down to the right from the point where the bowl meets the middle of the stem. She snips out one single point, the point where the bowl and the leg meet the stem. Enter the number of pieces the cable falls into. Then enter the number of end points the whole letter had before the snip.',
  answer: [3, 2], labels: ['pieces after the snip', 'end points'], tolerance: 0.01,
  hints: [
   'Look at the strokes that run into the snipped point. Each one is cut off there, but strokes that are still joined some other way, round a loop, stay in the same piece.',
   'An end point is a tip where a stroke stops and nothing carries on. Corners and the points where strokes meet are not end points.'
  ],
  solution: '4 strokes run into the point where the bowl and the leg meet the stem. With that point removed, the cable falls into 3 pieces, so it is a cut point. Counting the tips where a stroke stops, the whole letter R had 2 end points before the snip.',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Snip chart', description: 'Every stencil letter with the snips that break it marked in red.' },
  sources: [Object.assign({}, source.wConn, { description: 'Connected spaces, the theorem that a space homeomorphic to a connected space is connected, and an exercise hint that removing a single point from ℝ disconnects it. Cut points, the number of pieces a removed point leaves, and end points are worked out in this mission.' })],
  teaching: {
   intuition: 'Take a connected shape made of thin strokes and remove one single point. Sometimes it stays in one piece; sometimes it falls apart. A point whose removal leaves more than one component is a cut point. A point in the middle of a stroke usually is one: removing it leaves the two sides. But if the stroke is part of a loop, the two sides are still joined the long way round, so the shape stays in one piece. Where several strokes meet, removing the meeting point cuts each of them off there, and the number of pieces is the number of strokes that run in, less any that are still joined round a loop. An end point is a tip where a stroke stops and nothing carries on: removing it never cuts. These counts are the same however the cable is stretched or bent, as long as it is not cut or glued, so they tell shapes apart in the next mission. The cited page goes as far as the hint that removing one point from the line disconnects it; cut points and these counts are worked out here.',
   steps: [
    'Find the snipped point and count the strokes that run into it: 2 for a point in the middle of a stroke, 1 for a tip, and more where strokes meet.',
    'Follow each stroke away from the snip. Strokes that meet again further on, round a loop, are in the same piece.',
    'Count the pieces. The point is a cut point when there are two or more.',
    'Count the end points of the whole letter: the tips where a stroke stops. Corners and meeting points are not end points.'
   ],
   example: {
    prompt: 'A cable is bent into a T: a crossbar with a stem hanging from its midpoint. It is snipped at the point where its 3 strokes meet. How many pieces are left, and how many end points did the T have?',
    steps: [
     'Three strokes run into the meeting point: the left half of the crossbar, the right half and the stem. No loop joins them anywhere else.',
     'So the snip leaves 3 pieces, and the meeting point is a cut point. The T has 3 end points: the two ends of the crossbar and the foot of the stem.'
    ],
    answer: '3 pieces and 3 end points.'
   },
   pitfalls: [
    'Counting the strokes at the snip as the pieces when they are joined round a loop, as in the bowl of a P.',
    'Calling a corner an end point. In an L, the corner has strokes on both sides; only the two tips are end points.',
    'Snipping out a whole stroke. Only one point is removed; everything else stays.'
   ]
  },
  guidance: [
   { prompt: 'How many strokes run into the point where the bowl and the leg meet the stem? (A point in the middle of a stroke has 2: one on each side.)', answer: [4], labels: ['strokes at the snip'], explanation: '4 strokes run into that point. Each is cut off there, but some may still be joined further away.' },
   { prompt: 'After the snip, how many pieces is the cable in?', answer: [3], labels: ['pieces after the snip'], explanation: 'With the point where the bowl and the leg meet the stem removed, the cable falls into 3 pieces, so it is a cut point.' },
   { prompt: 'How many end points does the whole letter R have?', answer: [2], labels: ['end points'], explanation: 'Counting the tips where a stroke stops, the letter R has 2 end points.' }
  ]
 },
 {
  id: 'q14', title: 'Matching the label letters', topic: 'Homeomorphisms: telling shapes apart', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'Cable labels are bent from flexible strip, so the stores want to know which letters could be bent into one another without cutting.',
  lesson: 'A homeomorphism is a continuous bijection with a continuous inverse; homeomorphic shapes have the same end points, branch points and holes, so a difference in any of them proves two shapes are not homeomorphic.',
  prompt: 'A cable label spells RELAY in the lab’s stencil font, which is drawn in thin strokes: R is a straight stem with a curved bowl from the top of the stem back to its middle, and a straight leg going down to the right from the point where the bowl meets the middle of the stem; E is a straight stem with three straight arms going right, from its top, its middle and its bottom; L is a straight stem with a straight foot going right from its bottom; A is two straight strokes meeting at the apex, joined by a crossbar part of the way down, with both strokes going on below the bar as feet; Y is two straight arms that meet at one point, with a straight stem going down from that point; T is a straight crossbar with a straight stem hanging down from its midpoint. Enter how many of the letters of RELAY are homeomorphic to the letter T. Count a letter each time it appears.',
  answer: [2], labels: ['letters homeomorphic to the target'], tolerance: 0.01,
  hints: [
   'Stretching and bending never change the number of end points, the number of branch points (where three or more strokes meet) with how many strokes meet at each, or the number of holes (gaps closed off all round by a loop of strokes, like the inside of O). A corner is not a branch point.',
   'Work out those numbers for the target letter first, then for each letter of the word. For the letters of this font, two letters with the same end points, branch points and holes are homeomorphic, and two that differ in any of them are not.'
  ],
  solution: 'T has 3 end points, 1 branch point (3 strokes meet there) and 0 holes. In RELAY: R has 2 end points, 1 branch point (4 strokes meet there) and 1 hole; E has 3 end points, 1 branch point (3 strokes meet there) and 0 holes; L has 2 end points, no branch points and 0 holes; A has 2 end points, 2 branch points (3 strokes meet at each) and 1 hole; Y has 3 end points, 1 branch point (3 strokes meet there) and 0 holes. So the letters that match are E and Y, and the count is 2.',
  xp: 150, prereqs: ['q13'],
  artifact: { name: 'Stencil family tree', description: 'The alphabet sorted into the letters that bend into one another.' },
  sources: [source.wCont, source.wConn],
  teaching: {
   intuition: 'Two shapes are topologically the same when one can be stretched and bent into the other without cutting or gluing. The exact statement is a homeomorphism: a map f from one shape onto the other that pairs their points off one to one (a bijection), is continuous, and has a continuous inverse. When one exists the shapes are homeomorphic, written X ≅ Y. A property that every homeomorphism keeps is a topological property. Cut points give several. A homeomorphism carries a point where k strokes meet to a point where k strokes meet, because removing either point leaves a small neighbourhood in k bits; it carries end points to end points; and it keeps the number of holes. So a C and an L are homeomorphic: both are one stroke with 2 end points, and the corner of the L is not special. But a T and an L are not: the T has a point where 3 strokes meet and 3 end points. For the letters of the stencil font, two letters with the same end points, the same branch points (with the same number of strokes at each) and the same holes are homeomorphic. For general shapes these numbers are not always enough, but a difference in any of them always proves two shapes are not homeomorphic.',
   steps: [
    'For the target letter, count its end points, its branch points (where three or more strokes meet, noting how many meet at each) and its holes.',
    'Do the same for each different letter of the word. Ignore corners and curves: they straighten out under a homeomorphism.',
    'A letter matches the target when all of these agree. Count the matching letters, each time they appear in the word.'
   ],
   example: {
    prompt: 'Of the 4 letters of HOOK, how many are homeomorphic to O, a single closed loop?',
    steps: [
     'O has 0 end points, no branch points and 1 hole.',
     'H has 4 end points and 2 branch points; K has 4 end points and one branch point where 4 strokes meet. Neither matches. Both O letters match.'
    ],
    answer: '2 letters.'
   },
   pitfalls: [
    'Treating a corner as a branch point. The corner of an L or a V is just a bent stroke.',
    'Matching on end points alone. A, R, C and L all have 2 end points, but only C and L are homeomorphic.',
    'Counting a repeated letter once. Each time a matching letter appears, it counts.'
   ]
  },
  guidance: [
   { prompt: 'How many end points does the letter T have?', answer: [3], labels: ['end points'], explanation: 'T is a straight crossbar with a straight stem hanging down from its midpoint. It has 3 end points.' },
   { prompt: 'How many branch points, where three or more strokes meet, does T have?', answer: [1], labels: ['branch points'], explanation: 'T has 1 branch point (3 strokes meet there).' },
   { prompt: 'How many holes does T enclose?', answer: [0], labels: ['holes'], explanation: 'T has 0 holes.' },
   { prompt: 'Compare each letter of RELAY with T. How many letters, counting repeats, have the same end points, branch points and holes?', answer: [2], labels: ['letters homeomorphic to the target'], explanation: 'R has 2 end points, 1 branch point (4 strokes meet there) and 1 hole; E has 3 end points, 1 branch point (3 strokes meet there) and 0 holes; L has 2 end points, no branch points and 0 holes; A has 2 end points, 2 branch points (3 strokes meet at each) and 1 hole; Y has 3 end points, 1 branch point (3 strokes meet there) and 0 holes. So the letters that match are E and Y.' }
  ]
 },
 {
  id: 'q15', title: 'Clamping the test cable', topic: 'Open covers and compactness', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'Every cable on the test bench must be held along its whole length, and the Cable Works wants to know when a finite box of clamps can ever be enough.',
  lesson: 'An open cover of a set is a family of open sets whose union contains it; the set is compact when every open cover has a finite subcover, and on the line that happens exactly for the closed and bounded sets.',
  prompt: 'A straight cable on the bench runs from x = 2 to x = 11, measured in metres: it is the closed interval [2, 11]. Each clamp grips an open interval 1.5 metres long, wherever its centre is put, and it may reach past either end of the cable. Enter the fewest clamps whose open intervals together cover the whole cable. Then enter 1 if the set S = {1, 1/2, 1/3, 1/4, …} (the numbers 1 ÷ k for k = 1, 2, 3, …) is compact, or 0 if it is not.',
  answer: [7, 0], labels: ['fewest clamps', 'S compact (1 or 0)'], tolerance: 0.01,
  hints: [
   'Open intervals leave out their end points, so neighbouring clamps must overlap: the clamps cover the cable only if their total length is more than its length, not just equal to it.',
   'On the line a set is compact exactly when it is closed (it contains all its boundary points) and bounded (it fits inside some interval [−r, r]).'
  ],
  solution: 'The cable is 11 − 2 = 9 metres long. 7 clamps of 1.5 metres give 10.5 metres in all, which is more than 9, while 6 clamps give only 9 metres, which is not more than 9. So 7 overlapping clamps are the fewest that cover it. It lies between 0 and 1, so it is bounded. But the points 1 ÷ k crowd in on 0, so every ball round 0 meets the set: 0 is a boundary point that is not in the set, and the set is not closed. So S is not compact: enter 0.',
  xp: 150, prereqs: ['q04'],
  artifact: { name: 'Clamp rack', description: 'A finite set of clamps that holds every closed, bounded cable.' },
  sources: [source.l84, source.wComp],
  teaching: {
   intuition: 'A clamp holds an open stretch of cable: every point strictly inside its jaws, but not the two edge points. A family of open sets whose union contains a set is an open cover of it, and a part of the family that still covers the set is a subcover. A set is compact when every open cover of it, however it is chosen, has a finite subcover: finitely many of the open sets already do the job. A closed cable [a, b] is compact. The half-open cable (0, 1] is not: the open sets (1 ÷ k, 2) for k = 2, 3, 4, … cover it, but any finite number of them misses the points just above 0. On the line, and in every ℝⁿ, compact sets are exactly the closed and bounded ones. Bounded means it fits inside some interval [−r, r]. Closed means it contains all its boundary points, the points every ball round which meets both the set and the outside of the set. For one cover, the fewest clamps is easy: n open clamps of length L hold a cable of length D only if n × L is more than D, because neighbouring clamps must overlap to catch the point between them.',
   steps: [
    'Work out the length D = b − a of the cable [a, b].',
    'Find the smallest n with n × L more than D: that is the whole part of D ÷ L, plus 1. n overlapping clamps then cover the cable.',
    'For compactness, ask whether the set contains all its boundary points (closed) and whether it fits inside some interval [−r, r] (bounded).',
    'The set is compact exactly when both answers are yes.'
   ],
   example: {
    prompt: 'How many open clamps 2 metres long are needed for the cable [0, 5], and is (0, 1] compact?',
    steps: [
     'D = 5. Two clamps give 4 metres, not more than 5; three give 6 metres, which is more. So 3 clamps.',
     '(0, 1] is bounded, but its boundary point 0 is not in it, so it is not closed, and not compact.'
    ],
    answer: '3 clamps; (0, 1] is not compact (0).'
   },
   pitfalls: [
    'Dividing D by L and stopping there. When D ÷ L is a whole number, that many clamps leave the meeting points uncovered: one more is needed.',
    'Calling a set compact because it is bounded. (0, 1) is bounded but misses its boundary points.',
    'Calling a set compact because it is closed. The whole line is closed but not bounded.'
   ]
  },
  guidance: [
   { prompt: 'How long is the cable [2, 11], in metres?', answer: [9], labels: ['cable length (m)'], explanation: '11 − 2 = 9 metres.' },
   { prompt: 'What is the fewest clamps of 1.5 metres whose total length is more than 9 metres?', answer: [7], labels: ['fewest clamps'], explanation: '7 clamps of 1.5 metres give 10.5 metres in all, which is more than 9, while 6 clamps give only 9 metres, which is not more than 9.' },
   { prompt: 'Is S = {1, 1/2, 1/3, 1/4, …} (the numbers 1 ÷ k for k = 1, 2, 3, …) closed? Enter 1 for yes or 0 for no.', answer: [0], labels: ['S closed (1 or 0)'], explanation: 'It lies between 0 and 1, so it is bounded. But the points 1 ÷ k crowd in on 0, so every ball round 0 meets the set: 0 is a boundary point that is not in the set, and the set is not closed.' },
   { prompt: 'Is S bounded? Enter 1 for yes or 0 for no.', answer: [1], labels: ['S bounded (1 or 0)'], explanation: 'S fits inside an interval [−r, r] once r is large enough, so it is bounded. Compact means closed and bounded, so S is not compact.' }
  ]
 },
 {
  id: 'q16', title: 'Peak strain on the cable', topic: 'Continuous images of compact sets', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'Before a cable is signed off, the Cable Works needs the highest and the lowest strain reading anywhere along it.',
  lesson: 'A continuous function sends compact sets to compact sets, so on a closed interval it reaches a largest and a smallest value; for a function with a derivative everywhere, such as a polynomial, each is at an end point or at a critical point.',
  prompt: 'A strain gauge slides along a cable and reads f(x) = x³ − 12x + 5 at position x, for −3 ≤ x ≤ 3. Enter the largest value of f on [−3, 3], then the smallest.',
  answer: [21, -11], labels: ['largest value', 'smallest value'], tolerance: 0.01,
  hints: [
   'f is continuous and [a, b] is compact, so by the extreme value theorem f reaches a largest and a smallest value there. f is a polynomial, so it has a derivative everywhere, and each extreme is at an end point or at a critical point strictly inside, where f′(x) = 0.',
   'Work out f at both end points and at every critical point strictly between them, then compare the values.'
  ],
  solution: 'f′(x) = 3x² − 12, which is 0 at x = −2 and x = 2. Both lie strictly between −3 and 3. The values to compare are f(−3) = 14, f(3) = −4, f(−2) = 21 and f(2) = −11. The largest is 21 and the smallest is −11.',
  xp: 150, prereqs: ['q15'],
  artifact: { name: 'Strain log', description: 'The two extreme readings of a cable, with where each was reached.' },
  sources: [source.l85],
  teaching: {
   intuition: 'Compactness is kept by continuous maps: if f is continuous and K is compact, the image f(K), the set of all values f takes on K, is compact too. For a real function on a closed interval [a, b] this says the values form a closed and bounded set of numbers. Bounded means the values cannot run off to infinity; closed means the values contain their supremum and their infimum. So f really reaches a largest value and a smallest value: this is the extreme value theorem. On an open interval it can fail: 1 ÷ x on (0, 1) has no largest value. To find the extremes, calculus narrows the search. Inside the interval, a largest or smallest value of a function that has a derivative there can only occur where the derivative f′(x) is 0, a critical point. So for such a function the extremes are among the values at the two end points and at the critical points strictly inside. A function with a corner, such as |x − 2| at x = 2, has no derivative at the corner, and an extreme can sit there, so corners must be checked too. Every function in these missions is a polynomial, which has a derivative everywhere and no corners.',
   steps: [
    'Work out f′(x) and solve f′(x) = 0 to find the critical points.',
    'Keep the critical points that lie strictly between a and b.',
    'Work out f at a, at b and at each critical point kept.',
    'The largest of these values is the maximum of f on [a, b]; the smallest is the minimum.'
   ],
   example: {
    prompt: 'Find the largest and smallest values of f(x) = x² − 4x + 1 on [0, 5].',
    steps: [
     'f′(x) = 2x − 4 is 0 at x = 2, which lies inside [0, 5].',
     'f(0) = 1, f(5) = 6 and f(2) = −3.'
    ],
    answer: 'Largest 6, smallest −3.'
   },
   pitfalls: [
    'Using only the critical points. The largest value is often at an end point.',
    'Keeping a critical point that lies outside the interval. Only the points of [a, b] count.',
    'Forgetting that the theorem needs a closed, bounded interval. On an open interval the extremes may not be reached.'
   ]
  },
  guidance: [
   { prompt: 'What is f(−3), the value at the left end?', answer: [14], labels: ['f at the left end'], explanation: 'f(−3) = 14.' },
   { prompt: 'What is f(3), the value at the right end?', answer: [-4], labels: ['f at the right end'], explanation: 'f(3) = −4.' },
   { prompt: 'f′(x) = 3x² − 12. How many critical points, where f′(x) = 0, lie strictly between −3 and 3?', answer: [2], labels: ['critical points inside'], explanation: 'f′(x) = 0 at x = −2 and x = 2. Both lie strictly between −3 and 3.' },
   { prompt: 'Compare f(−3) = 14, f(3) = −4, f(−2) = 21 and f(2) = −11. What is the largest value?', answer: [21], labels: ['largest value'], explanation: 'The largest of these is 21; the smallest is −11.' }
  ]
 },
 {
  id: 'q17', title: 'Signing off the loom', topic: 'Chapter review: one-piece cables', tier: 'Intermediate', sector: 'Cable Works',
  brief: 'The cable loom is finished, and Mira wants one last check that ties together everything the Cable Works has learned.',
  lesson: 'Components count the pieces of a set, compactness promises finite covers, and continuity on a compact set promises a largest value.',
  prompt: 'Final check at the cable loom. A test cable lies along S = [0, 2) ∪ [2, 3] ∪ (4, 6) ∪ (6, 8] ∪ {9} on the bench, in metres: enter the number of components of S. Next, a straight cable runs from x = −2 to x = 3: enter the fewest clamps, each gripping an open interval 1.5 metres long (a clamp may reach past either end of the cable), that cover the closed interval [−2, 3]. Finally, a strain gauge sliding along it reads f(x) = −2x² + 4x + 5 for −2 ≤ x ≤ 3: enter the largest value of f there.',
  answer: [4, 4, 7], labels: ['components of S', 'fewest clamps', 'largest value'], tolerance: 0.01,
  hints: [
   'Two neighbouring pieces of S join into one component exactly when they share an end point that belongs to at least one of them.',
   'Open clamps must overlap, so their total length has to be more than the length of the cable, not just equal to it.',
   'By the extreme value theorem the largest value of f is reached somewhere. f is a polynomial, with a derivative everywhere, so that is at an end point or at a critical point strictly inside, where f′(x) = 0.'
  ],
  solution: '[0, 2) and [2, 3] share the point 2, which belongs to [2, 3], so they join. (4, 6) and (6, 8] meet at 6, but 6 belongs to neither, so they stay apart. So S has 5 − 1 = 4 components. The cable is 5 metres long; 4 clamps of 1.5 metres give 6 metres in all, which is more than 5, while 3 clamps give only 4.5 metres, which is not more than 5, so 4 clamps are needed. Finally f′(x) = −4x + 4, which is 0 at x = 1. That point lies strictly between −2 and 3. Comparing f(−2) = −11, f(3) = −1 and f(1) = 7, the largest value is 7.',
  xp: 150, prereqs: ['q14', 'q16'],
  artifact: { name: 'Loom certificate', description: 'One cable counted, clamped and strain-tested.' },
  sources: [source.l84, Object.assign({}, source.l85, { description: 'Continuous maps send compact sets to compact sets, and a continuous real function on a compact space reaches a minimum and a maximum. Counting components is on neither page: it is worked out in the mission on connected sets and components.' })],
  teaching: {
   intuition: 'This chapter asked three questions about a cable. Is it in one piece? A set falls into components, its largest connected pieces, and on the line two neighbouring pieces join exactly when they share an end point that belongs to at least one of them. Can it be held by finitely many clamps? A compact set is one where every open cover has a finite subcover, and the closed, bounded cable [a, b] is compact; for clamps of length L the fewest that cover it is the whole part of (b − a) ÷ L, plus 1, because the clamps must overlap. Does a continuous reading along it reach a largest value? Yes: the continuous image of a compact set is compact, so the extreme value theorem applies, and for a polynomial, which has a derivative everywhere, the largest value is at an end point or at a critical point inside. Components are worked out in the earlier mission on connected sets, not in the sections cited here.',
   steps: [
    'Components: count the pieces of S, then subtract one for each pair of neighbours that share an included end point.',
    'Cover: find the smallest n with n × L more than the length b − a.',
    'Largest value: compare f at a, at b and at each critical point strictly between them.'
   ],
   example: {
    prompt: 'S = [0, 1] ∪ (1, 3) ∪ (4, 5); clamps 3 metres long on [0, 7]; f(x) = 4 − x² on [−1, 2].',
    steps: [
     '[0, 1] and (1, 3) share 1, which is in [0, 1], so they join: 2 components.',
     'The cable is 7 metres: 2 clamps give 6, not enough; 3 give 9. f′(x) = −2x is 0 at x = 0, inside, and f(0) = 4 beats f(−1) = 3 and f(2) = 0.'
    ],
    answer: '2 components, 3 clamps and a largest value of 4.'
   },
   pitfalls: [
    'Joining two pieces that share an end point belonging to neither of them.',
    'Using exactly (b − a) ÷ L clamps when it is a whole number: open clamps then miss the points where they meet.',
    'Taking the value at a critical point as the largest without checking the two end points.'
   ]
  },
  guidance: [
   { prompt: 'How many components does S = [0, 2) ∪ [2, 3] ∪ (4, 6) ∪ (6, 8] ∪ {9} have?', answer: [4], labels: ['components of S'], explanation: '[0, 2) and [2, 3] share the point 2, which belongs to [2, 3], so they join. (4, 6) and (6, 8] meet at 6, but 6 belongs to neither, so they stay apart. That leaves 4.' },
   { prompt: 'How many open clamps of 1.5 metres are needed to cover [−2, 3]?', answer: [4], labels: ['fewest clamps'], explanation: 'The cable is 5 metres long; 4 clamps of 1.5 metres give 6 metres in all, which is more than 5, while 3 clamps give only 4.5 metres, which is not more than 5.' },
   { prompt: 'f′(x) = −4x + 4. How many critical points lie strictly between −2 and 3?', answer: [1], labels: ['critical points inside'], explanation: 'f′(x) = 0 at x = 1. That point lies strictly between −2 and 3.' },
   { prompt: 'Compare f(−2) = −11, f(3) = −1 and f(1) = 7. What is the largest value of f on the cable?', answer: [7], labels: ['largest value'], explanation: 'The largest of these values is 7.' }
  ]
 },
 {
  id: 'q18', title: 'Sewing the first panel', topic: 'Gluing: quotient spaces', tier: 'Intermediate', sector: 'Fabric Bay',
  brief: 'The Fabric Bay makes closed hulls by sewing the edges of flat panels together, and the cutters need to know what each sewing pattern makes of the corners.',
  lesson: 'Gluing makes a quotient space: points that are sewn together become one point, and a gluing word on a square says which edges meet and which way round.',
  prompt: 'A square hull panel has its 4 edges labelled with arrows. Read clockwise from the top-left corner (the top edge, then the right, the bottom and the left), the labels are a b a⁻¹ b⁻¹. A letter alone means that edge’s arrow points clockwise round the square; a letter with ⁻¹ means it points anticlockwise. The Fabric Bay sews together each pair of edges that share a letter, arrow on arrow, and leaves an edge whose letter appears only once unsewn. Two edges sewn together count as one edge. Enter how many distinct points the 4 corners become, then how many distinct edges are left.',
  answer: [1, 2], labels: ['corner points', 'edges left'], tolerance: 0.01,
  hints: [
   'Sewing two edges arrow on arrow joins the tail of one arrow to the tail of the other, and the head to the head. Write down which corners each sewing joins.',
   'Corners joined through any chain of sewings become one point. Each letter gives one edge of the finished panel, whether it was sewn or not.'
  ],
  solution: 'Sewing the two a edges (top and bottom) joins the top-left corner to the bottom-left corner and the top-right corner to the bottom-right corner. Sewing the two b edges (right and left) joins the top-right corner to the top-left corner and the bottom-right corner to the bottom-left corner. The corners fall into 1 group: {top-left, top-right, bottom-right, bottom-left}, so they become 1 point. The word uses 2 letters, so 2 edges are left (both pairs were sewn).',
  xp: 150, prereqs: ['q12'],
  artifact: { name: 'Pattern card', description: 'A square panel with lettered arrows, and the points its corners become.' },
  sources: [source.h77],
  teaching: {
   intuition: 'Sewing edges together is gluing: we declare certain points to be the same point. The space we get, whose points are the groups of points that were glued together, is a quotient space. A sheet of paper with its left and right edges glued becomes a cylinder; glue its top and bottom too and it becomes a torus, the surface of a ring doughnut. To say which edges are glued, label them with letters and arrows and read the labels round the square. Here we go clockwise from the top-left corner: the top edge, the right, the bottom, the left. A letter alone means that edge’s arrow points clockwise; a letter with ⁻¹ means it points anticlockwise. Edges with the same letter are sewn arrow on arrow: tail to tail and head to head. So the corners get glued as well, sometimes all into one point. An edge whose letter appears once is left free, as an edge of the finished panel.',
   steps: [
    'Mark each edge’s arrow: which corner it leaves (its tail) and which corner it points to (its head).',
    'For each letter that appears twice, join the two tails and join the two heads.',
    'Group the corners: corners joined through any chain of sewings are one point. Count the groups.',
    'Count the different letters: each is one edge of the finished space.'
   ],
   example: {
    prompt: 'The word is a a⁻¹ b b⁻¹. How many points do the four corners become, and how many edges are left?',
    steps: [
     'The a on top runs from top-left to top-right; the a⁻¹ on the right runs from bottom-right up to top-right. So top-left joins bottom-right, and top-right meets itself.',
     'The b on the bottom runs from bottom-right to bottom-left; the b⁻¹ on the left runs from top-left down to bottom-left. So bottom-right joins top-left again. The groups are {top-left, bottom-right}, {top-right} and {bottom-left}.'
    ],
    answer: 'Three points and two edges.'
   },
   pitfalls: [
    'Reading the word anticlockwise, or starting from another corner. The order is top, right, bottom, left.',
    'Sewing head to tail. Arrow on arrow means tail with tail and head with head.',
    'Stopping after one sewing. A corner joined to a second corner that is joined to a third makes all three one point.'
   ]
  },
  guidance: [
   { prompt: 'Follow the sewings. How many of the 4 corners end up as the same point as the top-left corner, counting the top-left corner itself?', answer: [4], labels: ['corners with the top-left'], explanation: 'Sewing the two a edges (top and bottom) joins the top-left corner to the bottom-left corner and the top-right corner to the bottom-right corner. Sewing the two b edges (right and left) joins the top-right corner to the top-left corner and the bottom-right corner to the bottom-left corner. The top-left corner\'s group has 4 corners.' },
   { prompt: 'How many distinct points do the 4 corners become?', answer: [1], labels: ['corner points'], explanation: 'The groups are {top-left, top-right, bottom-right, bottom-left}: 1 point.' },
   { prompt: 'How many different letters does the word a b a⁻¹ b⁻¹ use?', answer: [2], labels: ['edges left'], explanation: 'Each letter is one edge after sewing, so 2 edges are left.' }
  ]
 },
 {
  id: 'q19', title: 'The pattern book', topic: 'The standard surfaces', tier: 'Intermediate', sector: 'Fabric Bay',
  brief: 'The Fabric Bay is writing a pattern book of every panel shape it can sew, and each entry needs its edges counted and its sides checked.',
  lesson: 'The standard surfaces (the disc, annulus, cylinder, Möbius strip, pair of trousers, sphere, torus, Klein bottle and projective plane) differ in how many boundary circles they have and in whether they are orientable.',
  prompt: 'The Fabric Bay makes a Möbius strip, a long strip whose two ends are sewn together after a half-twist, and then cuts 2 small round holes in it, away from its edges and from each other. Enter the number of boundary circles of the finished surface, then 1 if it is orientable or 0 if it is not.',
  answer: [3, 0], labels: ['boundary circles', 'orientable (1 or 0)'], tolerance: 0.01,
  hints: [
   'A boundary circle is a loop of edge where the surface stops. Count those of the starting surface, then add one for each hole cut out of it.',
   'A surface is orientable when it contains no Möbius strip. Cutting a small hole never removes a Möbius strip and never creates one.'
  ],
  solution: 'The Möbius strip has 1 boundary circle: its edge, which runs round the strip twice before it closes up into a single circle. Each of the 2 holes adds one more, so there are 1 + 2 = 3. It contains a Möbius strip (a narrow band round its middle, clear of any holes), so it is not orientable: enter 0.',
  xp: 150, prereqs: ['q18'],
  artifact: { name: 'Pattern book', description: 'The standard surfaces, each with its edges and its sides recorded.' },
  sources: [source.h75],
  teaching: {
   intuition: 'A surface is a space that looks like a small piece of the flat plane near each of its points, apart from the points on its edge, if it has one. Its edge falls into closed loops, its boundary circles. A disc, a flat round panel, has 1. An annulus, the flat ring between two circles, has 2, and so does a cylinder, which squashes flat into an annulus. A pair of trousers, a disc with two smaller discs cut out, has 3. A Möbius strip is a strip whose ends are sewn after a half-twist: its edge runs round twice before closing up, so it has just 1. A sphere, the skin of a ball, and a torus, the surface of a ring doughnut, have no edge at all, and nor do the Klein bottle (the square sewn by a b a⁻¹ b) and the projective plane (a disc whose opposite rim points are sewn together). A surface is orientable when it contains no Möbius strip: an ant walking on it can never come back mirror-reversed. The Klein bottle and the projective plane each contain a Möbius strip, so they are not orientable; the sphere and the torus are. Cutting a small hole away from the edges adds one boundary circle and does not change orientability.',
   steps: [
    'Recognise the starting surface and recall its boundary circles.',
    'Add one boundary circle for each small hole cut out of it.',
    'Decide whether the surface contains a Möbius strip. If it does not, it is orientable (enter 1); if it does, it is not (enter 0).'
   ],
   example: {
    prompt: 'An annulus has 1 small round hole cut in it. How many boundary circles has it, and is it orientable?',
    steps: [
     'The annulus has 2 boundary circles, its inner and outer rims, and the hole adds 1: 3 in all.',
     'It lies flat, so it contains no Möbius strip: it is orientable.'
    ],
    answer: '3 boundary circles, orientable (1).'
   },
   pitfalls: [
    'Giving the Möbius strip 2 boundary circles because a strip has two long edges. After the half-twist they are one circle.',
    'Thinking a torus has an edge because it has a hole. The hole of the doughnut is not an edge: the torus is closed.',
    'Calling a surface non-orientable because it is curved. Only a Möbius strip inside it makes it non-orientable.'
   ]
  },
  guidance: [
   { prompt: 'Before any holes are cut, how many boundary circles does the starting surface have?', answer: [1], labels: ['boundary circles before the holes'], explanation: 'The Möbius strip has 1 boundary circle: its edge, which runs round the strip twice before it closes up into a single circle.' },
   { prompt: 'How many boundary circles does the finished surface have?', answer: [3], labels: ['boundary circles'], explanation: 'Each hole adds one: 1 + 2 = 3.' },
   { prompt: 'Does the surface contain a Möbius strip? Enter 0 if it does (not orientable) or 1 if it does not (orientable).', answer: [0], labels: ['orientable (1 or 0)'], explanation: 'It contains a Möbius strip (a narrow band round its middle, clear of any holes), so it is not orientable.' }
  ]
 },
 {
  id: 'q20', title: 'Counting the frame', topic: 'Euler characteristic of a cell division', tier: 'Intermediate', sector: 'Fabric Bay',
  brief: 'The Fabric Bay wants one number for every panelled hull that stays the same however the hull is drawn up into panels.',
  lesson: 'Cutting a surface into vertices, edges and faces is a cell division, and its Euler characteristic V − E + F depends only on the surface: 2 for a sphere, 0 for a torus.',
  prompt: 'The Fabric Bay takes a flat hull panel ruled into a grid of 3 columns and 4 rows of squares. It sews the left edge to the right edge and the top edge to the bottom edge (the word a b a⁻¹ b⁻¹), so the panel becomes a torus and the grid lines become a cell division of the torus. Count this cell division: enter the number of vertices V, the number of edges E and the number of faces F, then the Euler characteristic V − E + F.',
  answer: [12, 24, 12, 0], labels: ['vertices V', 'edges E', 'faces F', 'Euler characteristic'], tolerance: 0.01,
  hints: [
   'Count each kind of piece once. Points or lines that are sewn together count as one.',
   'Start from the flat grid: a grid of a columns and b rows of squares has (a + 1) × (b + 1) grid points. Each sewing merges a whole column or a whole row of points, and of edges, with another.'
  ],
  solution: 'The flat grid has 4 × 5 grid points. Sewing left to right merges the last column of points with the first, and sewing top to bottom merges the last row with the first, so V = 3 × 4 = 12. Each of the 4 rows of points left has 3 horizontal edges, and each of the 3 columns has 4 vertical edges, so E = 12 + 12 = 24. The squares are the faces: F = 3 × 4 = 12. So V − E + F = 12 − 24 + 12 = 0.',
  xp: 150, prereqs: ['q19'],
  artifact: { name: 'Frame count', description: 'Corners, struts and panels of a hull, with the one number they always give.' },
  sources: [source.h75],
  teaching: {
   intuition: 'Draw a network on a surface that cuts it into pieces: points called vertices, curves between them called edges, and the regions left over, the faces, each a patch like an open disc. That is a cell division. Count them: V vertices, E edges, F faces. The number V − E + F is the Euler characteristic, written χ (the Greek letter chi). The surprise is that it depends only on the surface, not on how you divided it. Every frame that blows up into a sphere, a cube, a prism or a pyramid, gives V − E + F = 2. A torus always gives 0. A flat panel, a disc, gives 1. A grid on a panel shows why sewing matters: once edges are sewn, points and lines that were sewn together count once. So a grid sewn into a torus has as many vertices as squares, and twice as many edges.',
   steps: [
    'Count the vertices V. After sewing, points that are sewn together count once.',
    'Count the edges E, again counting sewn-together edges once.',
    'Count the faces F.',
    'Work out the Euler characteristic V − E + F.'
   ],
   example: {
    prompt: 'A cube frame: count V, E and F and work out V − E + F.',
    steps: [
     'A cube has 8 corners, 12 struts and 6 square panels.',
     'V − E + F = 8 − 12 + 6 = 2, as for every cell division of the sphere.'
    ],
    answer: 'V = 8, E = 12, F = 6, and the Euler characteristic is 2.'
   },
   pitfalls: [
    'Counting the sewn edges of a grid twice. On a torus the left and right edges of the panel are one line of edges.',
    'Adding V + E + F, or working out V + F − E in the wrong order of signs. The pattern is V minus E plus F.',
    'Counting an outside face for a flat panel. Only the patches of the panel itself are faces.'
   ]
  },
  guidance: [
   { prompt: 'How many vertices V does the cell division have?', answer: [12], labels: ['vertices V'], explanation: 'The flat grid has 4 × 5 grid points. Sewing left to right merges the last column of points with the first, and sewing top to bottom merges the last row with the first, so V = 3 × 4 = 12.' },
   { prompt: 'How many edges E does it have?', answer: [24], labels: ['edges E'], explanation: 'Each of the 4 rows of points left has 3 horizontal edges, and each of the 3 columns has 4 vertical edges, so E = 12 + 12 = 24.' },
   { prompt: 'How many faces F does it have?', answer: [12], labels: ['faces F'], explanation: 'The squares are the faces: F = 3 × 4 = 12. So V − E + F = 12 − 24 + 12 = 0.' }
  ]
 }
);
})();
