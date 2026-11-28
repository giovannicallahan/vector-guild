/* Topology: shape without size missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/topo/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · Three ways to measure distance [L 8.1]
     q02  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · Balls in different metrics [L 8.1, 8.2]
     q03  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · The metric rules [L 8.1]
     q04  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · Open sets: room round every point [L 8.2]
     q05  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · Interior, closure and boundary [L 8.2]
     q06  ch 1 Distance and open sets · Basic, 100 XP · sector 'Survey Grid' · Unions and intersections of open sets [L 8.2]
     q07  ch 2 Topological spaces · Basic, 100 XP · sector 'Relay Network' · Topologies on a finite set [W Topological Spaces]
     q08  ch 2 Topological spaces · Basic, 100 XP · sector 'Relay Network' · Closed sets and closure [W Topological Spaces]
     q09  ch 2 Topological spaces · Basic, 100 XP · sector 'Relay Network' · Bases [W Bases]
     q10  ch 2 Topological spaces · Basic, 100 XP · sector 'Relay Network' · Continuous maps [W Continuity and Homeomorphisms, L 8.5] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis: Introduction to Real Analysis; Hitchman, Geometry with an Introduction to Cosmic Topology; Wikibooks, Topology sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /LibreTexts|Wikibooks/ (LibreTexts or Wikibooks).
   A title reads like: Lebl, Introduction to Real Analysis (LibreTexts) — 8.2 Open and Closed Sets
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.0<N>%3A_<Section> */
const source = {
 l81: {"title":"Lebl, Introduction to Real Analysis (LibreTexts) — 8.1 Metric Spaces","url":"https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.01%3A_Metric_Spaces","description":"The definition of a metric, with the triangle inequality, the Euclidean metric on Rⁿ and the discrete metric.","verified":"2026-11-28"},
 l82: {"title":"Lebl, Introduction to Real Analysis (LibreTexts) — 8.2 Open and Closed Sets","url":"https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.02%3A_Open_and_Closed_Sets","description":"Open balls, open and closed sets, unions and finite intersections of open sets, closure, interior and boundary.","verified":"2026-11-28"},
 l85: {"title":"Lebl, Introduction to Real Analysis (LibreTexts) — 8.5 Continuous Functions","url":"https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.05%3A_Continuous_Functions","description":"Continuity between metric spaces, and the theorem that a function is continuous exactly when the preimage of every open set is open.","verified":"2026-11-28"},
 wts: {"title":"Wikibooks, Topology — Topological Spaces","url":"https://en.wikibooks.org/wiki/Topology/Topological_Spaces","description":"The axioms of a topology, the discrete and indiscrete topologies, a topology on a three-point set, and closed sets as complements of open sets.","verified":"2026-11-28"},
 wb: {"title":"Wikibooks, Topology — Bases","url":"https://en.wikibooks.org/wiki/Topology/Bases","description":"A base of a topology, the two conditions a family must meet to be a base, and the open sets as unions of base elements.","verified":"2026-11-28"},
 wc: {"title":"Wikibooks, Topology — Continuity and Homeomorphisms","url":"https://en.wikibooks.org/wiki/Topology/Continuity_and_Homeomorphisms","description":"Continuous maps between topological spaces by preimages of open sets, and maps out of a discrete space.","verified":"2026-11-28"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
{
 id: "q01",
 title: "Three rulers for one grid",
 topic: "Three ways to measure distance",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "Our rovers drive on grid tracks and our drones fly two motors at once, so a straight-line distance tells neither of them how far a trip really is.",
 lesson: "A metric is a rule d(x, y) for the distance between two points; the Euclidean, taxicab and maximum metrics measure the same two grid points in three different ways.",
 prompt: "Two survey rovers stand on the Survey Grid at P = (2, −1) and Q = (7, 3), with coordinates in kilometres. Enter the Euclidean distance from P to Q to 2 decimal places, then the taxicab distance, then the maximum distance, all in kilometres.",
 answer: [6.4, 9, 5],
 labels: ["Euclidean distance (km)", "taxicab distance (km)", "maximum distance (km)"],
 tolerance: 0.005,
 hints: ["Find the gap across, the difference of the x coordinates without its sign, and the gap up, the same for the y coordinates. All three metrics are built from those two gaps.", "Euclidean: the square root of the sum of the two squared gaps. Taxicab: the sum of the two gaps. Maximum: the larger of the two gaps."],
 solution: "The gap across is |7 − 2| = 5 and the gap up is |3 − (−1)| = 4. Euclidean: √(5² + 4²) = √41 ≈ 6.4031, which is 6.40 km to 2 decimal places. Taxicab: 5 + 4 = 9 km. Maximum: the larger of 5 and 4, which is 5 km.",
 xp: 100,
 prereqs: [],
 artifact: { name: "Three-ruler card", description: "One pair of grid points measured three ways." },
 sources: [source.l81],
 teaching: {
  intuition: "Topology studies what stays the same when a shape is stretched or bent, and it starts with a careful idea of distance. A metric is any rule d(x, y) that gives the distance between two points x and y and behaves as a distance should: it is never negative, it is 0 only from a point to itself, and it is the same in both directions. On a flat grid there is more than one sensible rule. The Euclidean metric is the straight-line distance of school geometry, found with Pythagoras: square the gap across and the gap up, add, and take the square root. The taxicab metric is the distance a vehicle drives when it must keep to the grid lines, like a taxi in a city of square blocks: add the gap across and the gap up. The maximum metric is the larger of the two gaps; it is the time a drone takes when its east–west and north–south motors run at once at the same speed, because it arrives when the slower job is done. All three are metrics, and each fits a different traveller.",
  steps: ["Find the gap across, the difference of the x coordinates without its sign, and the gap up, the same for the y coordinates.", "Euclidean metric: square both gaps, add, and take the square root.", "Taxicab metric: add the two gaps.", "Maximum metric: take the larger of the two gaps. For any two points, maximum ≤ Euclidean ≤ taxicab, a quick check on the working."],
  example: {
   prompt: "Find the Euclidean, taxicab and maximum distances between (1, 1) and (4, 5).",
   steps: ["The gaps are |4 − 1| = 3 across and |5 − 1| = 4 up.", "Euclidean: √(9 + 16) = √25 = 5. Taxicab: 3 + 4 = 7. Maximum: the larger gap, 4."],
   answer: "Euclidean 5, taxicab 7, maximum 4; and 4 ≤ 5 ≤ 7 as it should be."
  },
  pitfalls: ["Keeping a negative gap. A distance is never negative, so the gap from 7 to −1 is 8, not −8.", "Adding the gaps for the Euclidean distance. That is the taxicab distance; the Euclidean one squares, adds and takes a square root, and is never larger.", "Rounding too early. Take the square root of the exact sum of squares and round only the final answer."]
 },
 guidance: [
  {
   prompt: "What are the gap across, |7 − 2|, and the gap up, |3 − (−1)|?",
   answer: [5, 4],
   labels: ["gap across (km)", "gap up (km)"],
   explanation: "|7 − 2| = |5| = 5 and |3 − (−1)| = |4| = 4. A distance never has a sign, so the gaps are taken without theirs."
  },
  {
   prompt: "Square the two gaps, add them and take the square root. What is the Euclidean distance, to 2 decimal places?",
   answer: [6.4],
   labels: ["Euclidean distance (km)"],
   explanation: "5² + 4² = 25 + 16 = 41, and √41 ≈ 6.4031, which is 6.40 to 2 decimal places. This is the straight-line distance a beam of light would cover."
  },
  {
   prompt: "What are the taxicab distance (the sum of the gaps) and the maximum distance (the larger gap)?",
   answer: [9, 5],
   labels: ["taxicab distance (km)", "maximum distance (km)"],
   explanation: "Taxicab: 5 + 4 = 9, the distance driven along the grid lines. Maximum: the larger of 5 and 4 is 5."
  }
 ]
},
{
 id: "q02",
 title: "How far can a rover reach?",
 topic: "Balls in different metrics",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "Mission control wants to know how many grid stops lie within reach of the beacon, for a wheeled rover and for a drone.",
 lesson: "A ball B(x, r) is every point at distance less than r from x; in the taxicab metric it is a diamond and in the maximum metric a square.",
 prompt: "A beacon stands at the grid point (4, 2) of the Survey Grid, and rovers stop only at grid points: points whose two coordinates are whole numbers. A wheeled rover drives along the grid lines, so its distance is the taxicab metric. A drone runs its east–west and north–south motors at the same time, so its distance is the maximum metric. Count the beacon itself in both answers. Enter how many grid points are at taxicab distance at most 3 from the beacon, then how many are at maximum distance at most 4.",
 answer: [25, 81],
 labels: ["grid points, taxicab", "grid points, maximum"],
 tolerance: 0.01,
 hints: ["In the taxicab metric the grid points at distance exactly k, for k at least 1, form a diamond of 4k points round the beacon. Add these diamonds up and add 1 for the beacon.", "In the maximum metric each coordinate may differ from the beacon’s by at most the radius, so the points fill a square: count the whole numbers each coordinate may take, then multiply."],
 solution: "Taxicab: the beacon, then diamonds of 4 × 1, 4 × 2, …, 4 × 3 points at distances 1 to 3. That is 1 + 4 × (1 + 2 + 3) = 1 + 4 × 6 = 25 grid points, which is 2r² + 2r + 1 with r = 3. Maximum: each coordinate may differ from the beacon’s by at most 4, so each has 2 × 4 + 1 = 9 possible values, and 9 × 9 = 81 grid points.",
 xp: 100,
 prereqs: ["q01"],
 artifact: { name: "Reach map", description: "A diamond and a square of grid stops round one beacon." },
 sources: [source.l81, source.l82],
 teaching: {
  intuition: "Once we have a metric we can talk about everything near a point. The ball B(x, r) is the set of all points whose distance from x is less than r; x is its centre and r its radius. The word comes from the Euclidean metric, where a ball in the plane is a round disc. In other metrics a ball has another shape. In the taxicab metric the points at distance exactly 2 from the centre lie on a diamond, a square standing on its corner, because you can spend the 2 steps as 2 across, 1 across and 1 up, 2 up, and so on in all four directions. In the maximum metric they lie on an ordinary square, because each coordinate may move up to 2 on its own. The shape of a ball depends on the metric, but every ball still means \"the points close to the centre\". On a grid every taxicab or maximum distance is a whole number, so \"at distance at most r\" is the same as \"in the ball B(x, r + 1)\".",
  steps: ["Taxicab metric: the grid points at distance exactly k, for k at least 1, form a diamond of 4k points; the centre is the only point at distance 0.", "Add them: the grid points at taxicab distance at most r number 1 + 4 × (1 + 2 + … + r) = 2r² + 2r + 1.", "Maximum metric: each coordinate may differ from the centre’s by at most r, which gives 2r + 1 whole-number values for each coordinate.", "Multiply: the grid points at maximum distance at most r number (2r + 1) × (2r + 1)."],
  example: {
   prompt: "How many grid points are at taxicab distance at most 2 from (0, 0), and how many at maximum distance at most 2?",
   steps: ["Taxicab: 1 + 4 × (1 + 2) = 1 + 12 = 13, which matches 2 × 4 + 2 × 2 + 1 = 13.", "Maximum: each coordinate is one of −2, −1, 0, 1, 2, so 5 × 5 = 25."],
   answer: "13 grid points in the taxicab diamond and 25 in the maximum square."
  },
  pitfalls: ["Forgetting the centre itself. It is at distance 0, which is at most r.", "Counting the diamond at distance k as 4k + 4 by counting each corner twice. Give each corner to one edge only: 4k points.", "Using 2r for the side of the square instead of 2r + 1. From −2 to 2 there are 5 whole numbers, not 4."]
 },
 guidance: [
  {
   prompt: "How many grid points are at taxicab distance exactly 3 from the beacon?",
   answer: [12],
   labels: ["points at the largest distance"],
   explanation: "They form a diamond whose corners are 3 steps from the beacon along each axis. Each of its four edges holds 3 points when only one corner is counted per edge, so there are 4 × 3 = 12."
  },
  {
   prompt: "Add the beacon and the diamonds for distances 1 to 3. How many grid points are at taxicab distance at most 3?",
   answer: [25],
   labels: ["grid points, taxicab"],
   explanation: "1 + 4 × (1 + 2 + 3) = 1 + 4 × 6 = 25."
  },
  {
   prompt: "In the maximum metric, how many whole numbers are within 4 of the beacon’s x coordinate 4, and how many grid points are at maximum distance at most 4?",
   answer: [9, 81],
   labels: ["values per coordinate", "grid points, maximum"],
   explanation: "From 0 to 8 there are 2 × 4 + 1 = 9 whole numbers, and the y coordinate has as many choices, so 9 × 9 = 81 grid points."
  }
 ]
},
{
 id: "q03",
 title: "The masts and the courier",
 topic: "The metric rules",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "The survey lost one measurement between two relay masts, and Mira wants to know what range it could possibly lie in.",
 lesson: "The triangle inequality, d(x, z) ≤ d(x, y) + d(y, z), traps an unknown distance between the difference and the sum of two known ones.",
 prompt: "Three relay masts x, y and z stand on a flat plain, and d is the usual straight-line (Euclidean) distance in kilometres. Mast y is 7 km from x and 3 km from z, so d(x, y) = 7 and d(y, z) = 3; the masts may stand anywhere that fits these two distances. Enter the smallest possible value of d(x, z), then the largest possible value. Then a courier’s log uses the discrete metric on the stations: two different stations are at distance 1, and a station is at distance 0 from itself. The courier’s stops, in order, were A, C, C, B, A, E, D. Enter the total discrete distance travelled: the sum of the distances between consecutive stops.",
 answer: [4, 10, 5],
 labels: ["smallest d(x, z) (km)", "largest d(x, z) (km)", "discrete distance"],
 tolerance: 0.01,
 hints: ["The triangle inequality, d(x, z) ≤ d(x, y) + d(y, z), gives the largest value straight away.", "For the smallest value, use the triangle inequality with the longer of the two given distances on the left. In the courier’s log, a stop that repeats the one before adds 0."],
 solution: "The triangle inequality gives d(x, z) ≤ 7 + 3 = 10, reached when y lies on the straight segment from x to z. For the smallest value, the triangle inequality d(x, y) ≤ d(x, z) + d(z, y) gives 7 ≤ d(x, z) + 3, so d(x, z) ≥ 7 − 3 = 4, reached when z lies on the straight segment from x to y. So d(x, z) can be anything from 4 to 10 km. In the courier’s log the distances between consecutive stops are 1, 0, 1, 1, 1, 1: 5 steps change station and the others repeat one, so the total discrete distance is 5.",
 xp: 100,
 prereqs: ["q01"],
 artifact: { name: "Mast triangle", description: "Three masts, two known distances and the range for the third." },
 sources: [source.l81],
 teaching: {
  intuition: "A metric must obey four rules. Distances are never negative. d(x, y) is 0 exactly when x and y are the same point. d(x, y) = d(y, x). And the triangle inequality: d(x, z) ≤ d(x, y) + d(y, z), which says a detour through y is never shorter than going straight from x to z. The triangle inequality also works backwards. If d(x, y) = 7 and d(y, z) = 3, then 7 = d(x, y) ≤ d(x, z) + d(z, y) = d(x, z) + 3, so d(x, z) is at least 4. So an unknown third distance is trapped between the difference and the sum of the other two. In the plane with the straight-line distance both ends of that range happen, when the three points stand in a line. The rules allow strange metrics too. The discrete metric puts every two different points at distance 1 and each point at distance 0 from itself. It obeys all four rules, and it only tells you whether two points are the same.",
  steps: ["Largest value: by the triangle inequality, d(x, z) is at most d(x, y) + d(y, z).", "Smallest value: put the longer known distance on the left of the triangle inequality, so d(x, z) is at least the longer minus the shorter.", "Both bounds are reached in the plane when the three points stand in a line, so these are the smallest and largest possible values.", "Discrete metric: a step between different points counts 1 and a step that stays put counts 0."],
  example: {
   prompt: "d(x, y) = 5 and d(y, z) = 2 in the plane. What range can d(x, z) lie in? And with the discrete metric, how far is the route B, B, A?",
   steps: ["Largest: 5 + 2 = 7. Smallest: 5 ≤ d(x, z) + 2, so d(x, z) ≥ 3.", "Discrete route: B to B is 0 and B to A is 1, so the route is 1 long."],
   answer: "d(x, z) lies from 3 to 7; the discrete route has length 1."
  },
  pitfalls: ["Giving the difference with a minus sign when the second distance is the longer. A distance is never negative: take the longer minus the shorter.", "Thinking d(x, z) must equal d(x, y) + d(y, z). The triangle inequality only gives an upper limit; the masts need not stand in a line.", "Counting a repeated stop as 1 in the discrete metric. A station is at distance 0 from itself."]
 },
 guidance: [
  {
   prompt: "By the triangle inequality, what is the largest d(x, z) can be?",
   answer: [10],
   labels: ["largest d(x, z) (km)"],
   explanation: "d(x, z) ≤ d(x, y) + d(y, z) = 7 + 3 = 10. It equals 10 when the masts stand in a line with y in the middle."
  },
  {
   prompt: "Use the triangle inequality with the longer given distance on the left. What is the smallest d(x, z) can be?",
   answer: [4],
   labels: ["smallest d(x, z) (km)"],
   explanation: "The triangle inequality d(x, y) ≤ d(x, z) + d(z, y) gives 7 ≤ d(x, z) + 3, so d(x, z) ≥ 7 − 3 = 4, reached when z lies on the straight segment from x to y."
  },
  {
   prompt: "Write 1 for each step of the log that changes station and 0 for each that stays. What is the total?",
   answer: [5],
   labels: ["discrete distance"],
   explanation: "From A, C, C, B, A, E, D the steps give 1, 0, 1, 1, 1, 1, which add up to 5."
  }
 ]
},
{
 id: "q04",
 title: "Room round every sensor",
 topic: "Open sets: room round every point",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "Every sensor on the cable and every lamp on the pad needs a safety zone that never leaves the site, and we need to know how big it can be.",
 lesson: "A set is open when every point in it has a ball round it that stays inside the set; the largest such ball reaches to the nearest edge.",
 prompt: "A survey cable runs along the open interval (2, 9) of the x-axis, measured in metres with the usual distance, and a sensor sits at x = 6.5. Enter the largest radius r for which the ball B(6.5, r) lies inside (2, 9). Then a landing pad is the open rectangle of points (x, y) with 0 < x < 10 and 0 < y < 6, with the Euclidean metric, and a lamp stands at (3, 4). Enter the largest radius of a ball round the lamp that lies inside the pad.",
 answer: [2.5, 2],
 labels: ["largest radius on the cable (m)", "largest radius on the pad (m)"],
 tolerance: 0.01,
 hints: ["On a line, B(x, r) is the open interval from x − r to x + r. It stays inside (a, b) as long as neither of its ends passes a or b.", "A round ball stays inside an open rectangle as long as its radius is no more than the distance from its centre to each of the four sides."],
 solution: "The sensor is 6.5 − 2 = 4.5 from the left end and 9 − 6.5 = 2.5 from the right end. B(6.5, r) = (6.5 − r, 6.5 + r) stays inside while r is at most both, so the largest radius is 2.5. The lamp is 3 from the side x = 0, 7 from the side x = 10, 4 from the side y = 0 and 2 from the side y = 6. The ball can grow until it touches the nearest side, so the largest radius is 2. Every point of the cable and of the pad has some room like this, which is why both sets are open.",
 xp: 100,
 prereqs: ["q02"],
 artifact: { name: "Safety-zone gauge", description: "A ring that grows round a point until it touches the nearest edge." },
 sources: [source.l82],
 teaching: {
  intuition: "A set of points is open, or an open set, when every point in it has some room round it: for each point x of the set there is a radius r, greater than 0, so that the whole ball B(x, r) lies inside the set. The open interval (2, 9), all the numbers strictly between 2 and 9, is open. A point at 8.9 is only 0.1 from the end, but the ball B(8.9, 0.05) still fits, and however close a point is to 9, half of its distance to 9 gives a ball that fits. The ends 2 and 9 are not in the set, so they never need room. The closed interval [2, 9], which includes its ends, is not open: every ball round 9 contains numbers above 9. An open rectangle of the plane, with its edges left out, is open for the same reason. For a point inside an open interval or an open rectangle, the largest ball that fits is the one whose radius is the distance to the nearest edge: the ball is open, so it may reach exactly up to an edge that is not part of the set.",
  steps: ["On a line, B(x, r) is the open interval (x − r, x + r).", "Measure how far the point is from each end of the interval, or from each of the four sides of the rectangle.", "The largest ball that fits has radius equal to the smallest of those distances.", "If every point of a set has a radius greater than 0 that fits, the set is open."],
  example: {
   prompt: "A point sits at x = 1 in the open interval (0, 5). What is the largest radius of a ball round it inside the interval? And for the point (2, 3) in the open rectangle 0 < x < 8, 0 < y < 5?",
   steps: ["On the line: 1 − 0 = 1 and 5 − 1 = 4, so the largest radius is 1.", "In the rectangle: the distances to the sides are 2, 6, 3 and 2, so the largest radius is 2."],
   answer: "Radius 1 on the line and radius 2 in the rectangle."
  },
  pitfalls: ["Using the distance to the far end. The ball must fit on both sides, so the nearer edge decides.", "Thinking a point very close to the edge has no room. Every point strictly inside has some radius greater than 0 that fits, however small.", "Forgetting the sides y = 0 and y = h in the rectangle. Check all four sides."]
 },
 guidance: [
  {
   prompt: "How far is the sensor from each end of the interval: from 2, then from 9?",
   answer: [4.5, 2.5],
   labels: ["distance to the left end (m)", "distance to the right end (m)"],
   explanation: "6.5 − 2 = 4.5 and 9 − 6.5 = 2.5."
  },
  {
   prompt: "What is the largest radius of a ball round the sensor inside the interval?",
   answer: [2.5],
   labels: ["largest radius on the cable (m)"],
   explanation: "The ball (6.5 − r, 6.5 + r) must not pass either end, so r can be at most the smaller distance, 2.5."
  },
  {
   prompt: "How far is the lamp from the nearest side of the pad? That is the largest radius of a ball round it inside the pad.",
   answer: [2],
   labels: ["largest radius on the pad (m)"],
   explanation: "The distances to the four sides are 3, 7, 4 and 2. The smallest is 2, so a ball of radius 2 just fits."
  }
 ]
},
{
 id: "q05",
 title: "Where does the stretch end?",
 topic: "Interior, closure and boundary",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "The survey marks stretches of track with gaps and lone markers, and the crew must know exactly where each stretch begins and ends.",
 lesson: "The boundary points of a set are those where every ball meets both the set and the outside; a set is closed when it contains all of them.",
 prompt: "A survey team marks the stretch S = [1, 4) ∪ (4, 7] ∪ {9} on the x-axis, in kilometres from the grid beacon, with the usual distance. Enter the number of boundary points of S. Then enter 1 if S is open and 0 if it is not, then 1 if S is closed and 0 if it is not.",
 answer: [4, 0, 0],
 labels: ["boundary points", "open (1 or 0)", "closed (1 or 0)"],
 tolerance: 0.01,
 hints: ["Only the end points of the pieces, and a lone point, can be boundary points. For each one, ask: does every ball round it contain points of S and points outside S?", "S is open when every point of S is an interior point. S is closed when it contains every one of its boundary points."],
 solution: "Away from 1, 4, 7 and 9 every point is either well inside S or well outside it, so only these can be boundary points. 1 is in S, but every ball round it also holds points outside S, so it is a boundary point. 4 is not in S, but every ball round it meets S, so it is a boundary point. 7 is in S, but every ball round it also holds points outside S, so it is a boundary point. 9 is in S, but every ball round it also holds points outside S, so it is a boundary point. So S has 4 boundary points: 1, 4, 7 and 9. 1 is in S but is not an interior point, so S is not open. The boundary point 4 is not in S, so S is not closed.",
 xp: 100,
 prereqs: ["q04"],
 artifact: { name: "Marker stakes", description: "One stake at every point where a stretch begins or ends." },
 sources: [source.l82],
 teaching: {
  intuition: "Take a set S of points. A point of S is an interior point when some ball round it lies inside S; the interior of S is the set of all its interior points, so S is open exactly when every point of S is interior. A point is a boundary point when every ball round it, however small, contains points of S and points outside S. It may or may not belong to S. The boundary of S is the set of all its boundary points. The closure of S is S together with its boundary: every point that sits in S or right against it. A set is closed, a closed set, when its complement, everything not in it, is open; that happens exactly when the set contains all of its boundary points, so a closed set is its own closure. For S = [1, 4), the boundary is the two points 1 and 4: 1 is in S and 4 is not, so S is neither open (1 has no room) nor closed (4 is missing). Open and closed are not opposites. A set can be neither, and the whole line is both. A lone point {9} is its own boundary: every ball round it meets the point and the outside.",
  steps: ["List the candidates: the end points of each piece and any lone point. Every other point is well inside S or well outside it.", "For each candidate, look a little to its left and a little to its right, and at the point itself. It is a boundary point unless it is in S with S on both sides, or out of S with no S on either side.", "S is open when every point of S is an interior point; a closed end or a lone point stops it.", "S is closed when every boundary point belongs to S; a missing end point stops it."],
  example: {
   prompt: "S = (0, 2] ∪ {5}. How many boundary points has S? Is it open? Is it closed?",
   steps: ["The candidates are 0, 2 and 5. 0 is not in S but every ball round it meets S; 2 is in S but every ball round it meets numbers above 2; every ball round 5 meets 5 and points outside. All three are boundary points.", "2 is in S but not interior, so S is not open. The boundary point 0 is not in S, so S is not closed."],
   answer: "3 boundary points; neither open nor closed."
  },
  pitfalls: ["Counting only the boundary points that belong to S. A boundary point may lie outside the set, like 0 for (0, 2].", "Treating a point where two pieces meet as a boundary point without checking. In [1, 4] ∪ [4, 7] the point 4 has S on both sides and is interior.", "Deciding that a set that is not open must be closed. Many sets are neither."]
 },
 guidance: [
  {
   prompt: "Check the candidates 1, 4, 7 and 9 one at a time. How many of them are boundary points of S?",
   answer: [4],
   labels: ["boundary points"],
   explanation: "1 is in S, but every ball round it also holds points outside S, so it is a boundary point. 4 is not in S, but every ball round it meets S, so it is a boundary point. 7 is in S, but every ball round it also holds points outside S, so it is a boundary point. 9 is in S, but every ball round it also holds points outside S, so it is a boundary point."
  },
  {
   prompt: "Is every point of S an interior point? Enter 1 for yes, 0 for no.",
   answer: [0],
   labels: ["open (1 or 0)"],
   explanation: "1 is in S but is not an interior point, so S is not open."
  },
  {
   prompt: "Does S contain every one of its boundary points? Enter 1 for yes, 0 for no.",
   answer: [0],
   labels: ["closed (1 or 0)"],
   explanation: "The boundary point 4 is not in S, so S is not closed."
  }
 ]
},
{
 id: "q06",
 title: "Where the drones overlap",
 topic: "Unions and intersections of open sets",
 tier: "Basic",
 sector: "Survey Grid",
 brief: "Three survey drones cover overlapping stretches, and the crew needs the stretch they all cover, and a warning about overlaps that never stop.",
 lesson: "Any union of open sets is open, and so is the intersection of finitely many; the intersection of infinitely many open sets can fail to be open.",
 prompt: "Three survey drones each cover an open stretch of the x-axis: (−2, 6), (1, 9) and (0, 5). The points all three cover form their intersection, an open interval (p, q). Enter p, then q. Then the team looks at the set of points that lie in every one of the intervals (−1 ÷ k, 4 + 1 ÷ k) for k = 1, 2, 3 and so on for ever. Enter 1 if this set is open and 0 if it is not.",
 answer: [1, 5, 0],
 labels: ["left end p", "right end q", "open (1 or 0)"],
 tolerance: 0.01,
 hints: ["A point is in the intersection when it is in all three intervals, so it must be to the right of every left end and to the left of every right end.", "Finitely many open sets always meet in an open set, and any union of open sets is open. An intersection of infinitely many open sets can fail to be open, so work out exactly which points the set holds."],
 solution: "The intersection starts at the largest left end: the largest of −2, 1 and 0 is 1. It stops at the smallest right end: the smallest of 6, 9 and 5 is 5. So all three drones cover (1, 5), an open interval, as an intersection of finitely many open sets must be. Now the second set. A point x lies in every one of those intervals exactly when −1 ÷ k < x < 4 + 1 ÷ k for every k. As k grows, −1 ÷ k climbs towards 0 and 4 + 1 ÷ k falls towards 4, so the points that survive are those with 0 ≤ x ≤ 4: the set is [0, 4]. Every ball round 0 contains negative numbers, which are not in the set, so it is not open. So the last answer is 0.",
 xp: 100,
 prereqs: ["q05"],
 artifact: { name: "Overlap chart", description: "Three coverage bars and the stretch all of them share." },
 sources: [source.l82],
 teaching: {
  intuition: "The union of some sets is everything in at least one of them; the intersection is everything in all of them. Open sets behave well under both, with one catch. Any union of open sets is open, even of infinitely many: a point of the union sits in one of the open sets, and the room it has there is room inside the union. The intersection of two open sets is open: a point in both has a ball inside the first and a ball inside the second, and the smaller of the two balls fits in both. The same works for three, or any finite number, because there is always a smallest radius among finitely many. With infinitely many sets the radii can shrink towards 0 and there may be no smallest one. The intervals (5 − 1 ÷ k, 5 + 1 ÷ k) for k = 1, 2, 3 and so on are all open, but the only point in every one of them is 5 itself, and the single point {5} is not open. So check an infinite intersection by working out exactly which points it holds.",
  steps: ["The intersection of open intervals (a₁, b₁), (a₂, b₂), … starts at the largest left end and stops at the smallest right end.", "If the largest left end is below the smallest right end, the intersection is that open interval; otherwise it is empty.", "For an infinite family, find the points that are in every set (an intersection) or in at least one (a union) as k runs on for ever.", "Then test the result: is every point of it an interior point?"],
  example: {
   prompt: "Find the intersection of (−1, 3), (0, 4) and (2, 7). Then is the intersection of all (5 − 1 ÷ k, 5 + 1 ÷ k), for k = 1, 2, 3 and so on, open?",
   steps: ["The largest left end is 2 and the smallest right end is 3, so the intersection is (2, 3).", "Any x other than 5 is left out once 1 ÷ k is smaller than its distance from 5, so the intersection is {5}. A ball round 5 always holds other points, so {5} is not open."],
   answer: "(2, 3), and the infinite intersection {5} is not open (0)."
  },
  pitfalls: ["Taking the smallest left end for an intersection. The points must be in every interval, so the largest left end decides.", "Believing every intersection of open sets is open. Only finitely many are guaranteed; an infinite intersection can pick up its end points.", "Thinking a union of closed pieces must be closed. Infinitely many closed intervals can add up to an open interval."]
 },
 guidance: [
  {
   prompt: "What is the largest of the three left ends?",
   answer: [1],
   labels: ["left end p"],
   explanation: "A point of the intersection must be to the right of −2, 1 and 0, so of 1, the largest of them."
  },
  {
   prompt: "What is the smallest of the three right ends?",
   answer: [5],
   labels: ["right end q"],
   explanation: "It must also be to the left of 6, 9 and 5, so of 5, the smallest of them."
  },
  {
   prompt: "Now look at the set of points that lie in every one of the intervals (−1 ÷ k, 4 + 1 ÷ k) for k = 1, 2, 3 and so on for ever. Work out which points it holds. Is it open? Enter 1 for yes, 0 for no.",
   answer: [0],
   labels: ["open (1 or 0)"],
   explanation: "A point x lies in every one of those intervals exactly when −1 ÷ k < x < 4 + 1 ÷ k for every k. As k grows, −1 ÷ k climbs towards 0 and 4 + 1 ÷ k falls towards 4, so the points that survive are those with 0 ≤ x ≤ 4: the set is [0, 4]. Every ball round 0 contains negative numbers, which are not in the set, so it is not open."
  }
 ]
},
{
 id: "q07",
 title: "Nearness without a ruler",
 topic: "Topologies on a finite set",
 tier: "Basic",
 sector: "Relay Network",
 brief: "The relay nodes have no sensible distances between them, so Mira wants to describe which nodes count as near each other by listing open sets instead.",
 lesson: "A topology on X is a list of subsets, called open, that contains ∅ and X and is closed under unions and finite intersections.",
 prompt: "The relay network has nodes 1 to 3, so X = {1, 2, 3}. A technician proposes these subsets as the open sets: ∅, {1}, {2}, {1, 2, 3}. Enter 1 if this list is a topology on X and 0 if it is not. Then a larger network has 5 nodes and uses the discrete topology, in which every subset is open. Enter how many open sets it has, counting ∅ and the whole network.",
 answer: [0, 32],
 labels: ["is a topology (1 or 0)", "open sets, discrete"],
 tolerance: 0.01,
 hints: ["Check three things: ∅ and X are in the list; the union of any two listed sets is listed; the intersection of any two listed sets is listed. For a finite list, checking pairs is enough.", "A subset is fixed by deciding, for each node in turn, whether it is in or out."],
 solution: "{1} ∪ {2} = {1, 2} is not in the list, so the list is not a topology. So the first answer is 0. In the discrete topology every subset is open. Each of the 5 nodes is either in a subset or out of it, so there are 2⁵ = 32 subsets, ∅ and the whole network included.",
 xp: 100,
 prereqs: ["q06"],
 artifact: { name: "Relay open-set register", description: "The list of node groups the network treats as open." },
 sources: [source.wts],
 teaching: {
  intuition: "In the last chapter open sets came from a metric. But the facts we found about them do not mention distance: ∅ and the whole space are open, any union of open sets is open, and a finite intersection of open sets is open. Topology turns those facts into the definition. A topology on a set X is a list of subsets of X, called the open sets, such that ∅ and X are in the list, the union of any sets in the list is in the list, and the intersection of finitely many sets in the list is in the list. X together with a topology is a topological space. Now \"near\" needs no ruler: a point is near a set when every open set round the point meets it. On a finite set there are only finitely many open sets, so it is enough to check unions and intersections of two at a time. Two topologies exist on every set: the discrete topology, in which every subset is open, and the indiscrete topology, in which only ∅ and X are.",
  steps: ["Check that ∅ and the whole set X are in the list.", "For every pair of listed sets, check that their union is listed.", "For every pair of listed sets, check that their intersection is listed. If all checks pass, the list is a topology.", "In the discrete topology on m points every subset is open; each point is in or out, so there are 2 multiplied by itself m times, 2ᵐ, open sets."],
  example: {
   prompt: "On X = {1, 2, 3}, is ∅, {2}, {2, 3}, {1, 2, 3} a topology? How many open sets has the discrete topology on 3 points?",
   steps: ["∅ and X are listed. {2} ∪ {2, 3} = {2, 3} and {2} ∩ {2, 3} = {2} are listed, and any pair with ∅ or X gives a listed set.", "Discrete: 2 × 2 × 2 = 8 subsets."],
   answer: "Yes, it is a topology (1); the discrete topology has 8 open sets."
  },
  pitfalls: ["Forgetting ∅ or X. A list without them is never a topology, however good the rest is.", "Checking unions but not intersections, or the other way round.", "Counting 2 × m subsets instead of 2ᵐ. Each new point doubles the count."]
 },
 guidance: [
  {
   prompt: "Are ∅ and X both in the list? Enter 1 for yes, 0 for no.",
   answer: [1],
   labels: ["∅ and X listed (1 or 0)"],
   explanation: "Both ∅ and {1, 2, 3} are listed."
  },
  {
   prompt: "Is the union and the intersection of every pair of listed sets also in the list? Enter 1 for yes, 0 for no.",
   answer: [0],
   labels: ["pairs pass (1 or 0)"],
   explanation: "{1} ∪ {2} = {1, 2} is not in the list."
  },
  {
   prompt: "How many subsets does a set of 5 nodes have?",
   answer: [32],
   labels: ["subsets"],
   explanation: "Two choices, in or out, for each of 5 nodes: 2⁵ = 32."
  }
 ]
},
{
 id: "q08",
 title: "The nodes that cannot be separated",
 topic: "Closed sets and closure",
 tier: "Basic",
 sector: "Relay Network",
 brief: "When a node fails, the crew needs to know which other nodes no open set can keep apart from it.",
 lesson: "A closed set is the complement of an open set; the closure of a set is the smallest closed set that contains it.",
 prompt: "A relay network on the nodes X = {1, 2, 3, 4} has these open sets: ∅, {1}, {1, 2}, {3, 4}, {1, 3, 4}, {1, 2, 3, 4}. A closed set is the complement of an open set: the nodes of X that are not in it. Enter how many sets are both open and closed. Then enter how many nodes are in the closure of {1}, the smallest closed set that contains node 1.",
 answer: [4, 2],
 labels: ["open and closed", "nodes in the closure"],
 tolerance: 0.01,
 hints: ["Write down the complement of each open set: those are the closed sets. Count the sets that appear in both lists.", "The closure of {p} is the intersection of all the closed sets that contain p."],
 solution: "The closed sets, the complements of the open sets, are ∅, {2}, {1, 2}, {3, 4}, {2, 3, 4}, {1, 2, 3, 4}. The sets in both lists are ∅, {1, 2}, {3, 4} and {1, 2, 3, 4}, so 4 sets are both open and closed. The closed sets that contain node 1 are {1, 2} and {1, 2, 3, 4}. Their intersection is {1, 2}, so the closure of {1} has 2 nodes.",
 xp: 100,
 prereqs: ["q07"],
 artifact: { name: "Fault-spread chart", description: "The closure of one node: everything it cannot be kept apart from." },
 sources: [source.wts, source.l82],
 teaching: {
  intuition: "In a topological space a closed set is the complement of an open set: everything in X that is not in it. Each open set gives exactly one closed set, so there are as many closed sets as open sets. ∅ and X are always both open and closed. When some other set is both open and closed, it and its complement split X into two pieces that no open set joins, so such sets show where a space falls apart. The closure of a set A is the smallest closed set that contains A: the intersection of all the closed sets that contain A. On a finite space the closure of a single point p holds every node q that cannot be kept apart from p: every open set round q also contains p. Take X = {1, 2, 3} with open sets ∅, {1}, {1, 2}, X. The closed sets are X, {2, 3}, {3} and ∅, and the closure of {2} is {2, 3}: node 3 has no open set of its own that avoids 2.",
  steps: ["Write the complement of each open set; these are the closed sets.", "The sets in both lists are both open and closed; ∅ and X are always among them.", "For the closure of {p}, keep the closed sets that contain p.", "Intersect them: the nodes they all share form the closure of {p}."],
  example: {
   prompt: "X = {1, 2, 3} with open sets ∅, {1}, {1, 2}, {1, 2, 3}. How many sets are both open and closed, and how many nodes are in the closure of {2}?",
   steps: ["The closed sets are {1, 2, 3}, {2, 3}, {3} and ∅. Only ∅ and X are in both lists: 2 sets.", "The closed sets containing 2 are {1, 2, 3} and {2, 3}; they share {2, 3}, which has 2 nodes."],
   answer: "2 sets are both open and closed; the closure of {2} has 2 nodes."
  },
  pitfalls: ["Thinking closed means \"not open\". A set can be both, or neither.", "Taking the union of the closed sets that contain p. The closure is the smallest one, their intersection.", "Leaving p out of its own closure. The closure always contains the set itself."]
 },
 guidance: [
  {
   prompt: "Take the complement of each open set. How many of these complements are themselves open?",
   answer: [4],
   labels: ["open and closed"],
   explanation: "The complements are ∅, {2}, {1, 2}, {3, 4}, {2, 3, 4}, {1, 2, 3, 4}. Of these, ∅, {1, 2}, {3, 4} and {1, 2, 3, 4} are also open: 4 sets."
  },
  {
   prompt: "Which closed sets contain node 1? How many nodes are in their intersection?",
   answer: [2],
   labels: ["nodes in the closure"],
   explanation: "The closed sets containing 1 are {1, 2} and {1, 2, 3, 4}, and they have {1, 2} in common: 2 nodes."
  }
 ]
},
{
 id: "q09",
 title: "A short list for many open sets",
 topic: "Bases",
 tier: "Basic",
 sector: "Relay Network",
 brief: "Listing every open set of a network is slow, so the engineers send a short basis and we must unpack it.",
 lesson: "A basis is a family of open sets whose unions give every open set of the topology.",
 prompt: "The relay engineers describe the open sets on X = {1, 2, 3, 4} by a basis: {1}, {3}, {1, 2}, {3, 4}. The open sets are all the unions of basis sets, with ∅ counted as the union of none. Enter how many open sets this gives. Then enter 1 if {2, 3} is open and 0 if it is not.",
 answer: [9, 0],
 labels: ["open sets", "S is open (1 or 0)"],
 tolerance: 0.01,
 hints: ["List the basis sets, then their unions two at a time, three at a time and so on, crossing out repeats. Do not forget ∅.", "A set is open exactly when the basis sets that fit inside it have the whole set as their union."],
 solution: "The unions of basis sets are ∅, {1}, {3}, {1, 2}, {1, 3}, {3, 4}, {1, 2, 3}, {1, 3, 4}, {1, 2, 3, 4}: 9 open sets, ∅ included. The only basis set inside {2, 3} is {3}, so the union of those inside is {3}. That misses node 2, so {2, 3} is not open.",
 xp: 100,
 prereqs: ["q07"],
 artifact: { name: "Basis card", description: "A few node groups from which every open set can be built." },
 sources: [source.wb],
 teaching: {
  intuition: "A topology can have many open sets, so it is often given by a shorter list. A basis is a family of sets whose unions make up all the open sets: a set is open exactly when it is a union of basis sets, with ∅ the union of none. Balls are the basis of the topology of a metric: a set is open when it is a union of balls. Not every family can be a basis. It must cover X, so every point is in some basis set, and where two basis sets overlap, each point of the overlap must lie in a basis set that fits inside the overlap. Those two conditions make the unions a topology. To decide whether a given set S is open, collect the basis sets that fit inside S: S is open exactly when their union is all of S.",
  steps: ["Start the list of open sets with ∅ and the basis sets themselves.", "Add every union of two basis sets, then of three, and so on, crossing out any set already listed. Count the different sets.", "To test a set S, find the basis sets that lie inside S and take their union.", "S is open if that union is S, and not open if some node of S is left over."],
  example: {
   prompt: "On X = {1, 2, 3}, a basis is {1}, {2, 3}. How many open sets does it give?",
   steps: ["The unions are ∅ (none), {1}, {2, 3} and {1} ∪ {2, 3} = {1, 2, 3}.", "None repeats, so there are 4 open sets."],
   answer: "4 open sets: ∅, {1}, {2, 3} and X."
  },
  pitfalls: ["Forgetting ∅, the union of no basis sets.", "Counting a union twice when two different choices give the same set.", "Calling S open because it overlaps basis sets. The basis sets used must fit entirely inside S."]
 },
 guidance: [
  {
   prompt: "Form every union of basis sets and cross out repeats. How many different sets are there, counting ∅?",
   answer: [9],
   labels: ["open sets"],
   explanation: "They are ∅, {1}, {3}, {1, 2}, {1, 3}, {3, 4}, {1, 2, 3}, {1, 3, 4}, {1, 2, 3, 4}: 9 sets."
  },
  {
   prompt: "How many nodes are in the union of the basis sets that fit inside {2, 3}?",
   answer: [1],
   labels: ["nodes in the union"],
   explanation: "The only basis set inside {2, 3} is {3}, so the union of those inside is {3}, with 1 node."
  },
  {
   prompt: "Is that union all of {2, 3}? Enter 1 for yes, 0 for no.",
   answer: [0],
   labels: ["S is open (1 or 0)"],
   explanation: "That misses node 2, so {2, 3} is not open."
  }
 ]
},
{
 id: "q10",
 title: "Maps that keep the network whole",
 topic: "Continuous maps",
 tier: "Basic",
 sector: "Relay Network",
 brief: "Each relay node must be routed to a dish without tearing apart groups of nodes the network treats as near.",
 lesson: "A map f is continuous when the preimage f⁻¹(V) of every open set V is open.",
 prompt: "A relay map sends the nodes of X = {1, 2, 3} to the dishes of Y = {a, b}. The open sets of X are ∅, {1}, {1, 2}, {1, 2, 3}, and the open sets of Y are ∅, {a}, {a, b}. The map is f(1) = a, f(2) = b, f(3) = b. Enter 1 if f is continuous and 0 if it is not. Then enter how many of all the 8 maps from X to Y are continuous.",
 answer: [1, 4],
 labels: ["f is continuous (1 or 0)", "continuous maps"],
 tolerance: 0.01,
 hints: ["f is continuous when the preimage f⁻¹(V), the set of nodes that f sends into V, is open in X for every open set V of Y.", "To count, list every map by its images of the nodes in order and run the same preimage test on each. A constant map, which sends every node to one dish, always passes."],
 solution: "f⁻¹(∅) = ∅ and f⁻¹(Y) = X are always open. f⁻¹({a}) = {1}, which is open. Every open set of Y pulls back to an open set of X, so f is continuous. Listing each map as (f(1), f(2), f(3)) and running the same test on all 8, the continuous ones are (a, a, a), (a, a, b), (a, b, b) and (b, b, b): 4 maps.",
 xp: 100,
 prereqs: ["q08"],
 artifact: { name: "Routing table", description: "A node-to-dish map checked open set by open set." },
 sources: [source.wc, source.l85],
 teaching: {
  intuition: "In real analysis a function is continuous when small changes in the input give small changes in the output, measured with ε and δ. For maps between metric spaces that turns out to be the same as a statement about open sets alone: f is continuous exactly when the preimage of every open set is open. The preimage f⁻¹(V) of a set V is the set of all points that f sends into V; the symbol f⁻¹ here does not mean that f can be undone. Because this test uses only open sets, it is the definition of a continuous map between any two topological spaces. On finite spaces it is a short check: for each open set V of the target, collect the nodes that land in V, and see whether that group is open in the source. ∅ and the whole target never need checking, since their preimages are ∅ and the whole source. A constant map, which sends everything to one point, is always continuous, and any map out of a space with the discrete topology is continuous.",
  steps: ["List the open sets V of the target space, leaving out ∅ and the whole space.", "For each V, find the preimage f⁻¹(V): the points of the source that f sends into V.", "If every preimage is an open set of the source, f is continuous; one preimage that is not open is enough to show it is not.", "To count continuous maps, run the same test on every map. With |X| points in the source and |Y| in the target there are |Y| multiplied by itself |X| times maps to try."],
  example: {
   prompt: "X = {1, 2} has open sets ∅, {1}, X, and Y = {a, b} has every subset open. Is f(1) = b, f(2) = a continuous?",
   steps: ["The open set {a} of Y has preimage f⁻¹({a}) = {2}.", "{2} is not an open set of X, so f is not continuous."],
   answer: "Not continuous (0): the preimage of {a} is not open."
  },
  pitfalls: ["Checking images instead of preimages: f sending an open set onto an open set is a different property.", "Reading f⁻¹ as an inverse map. The preimage makes sense for any map, even one that sends two nodes to the same dish.", "Forgetting the maps that are constant when counting. They are always continuous."]
 },
 guidance: [
  {
   prompt: "Find the preimage under f of each open set of Y. Are they all open in X? Enter 1 for yes, 0 for no.",
   answer: [1],
   labels: ["f is continuous (1 or 0)"],
   explanation: "f⁻¹(∅) = ∅ and f⁻¹(Y) = X are always open. f⁻¹({a}) = {1}, which is open. Every open set of Y pulls back to an open set of X, so f is continuous."
  },
  {
   prompt: "Run the same test on every one of the 8 maps from X to Y. How many pass?",
   answer: [4],
   labels: ["continuous maps"],
   explanation: "The maps that pass are (a, a, a), (a, a, b), (a, b, b) and (b, b, b): 4 of the 8."
  }
 ]
}
);
})();
