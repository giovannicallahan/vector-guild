/* Topology: shape without size missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/topo/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Curvature and shape · Advanced, 200 XP · sector 'Observatory' · Triangles on curved surfaces [H 7.2, 7.4]
     q32  ch 6 Curvature and shape · Advanced, 200 XP · sector 'Observatory' · Gauss–Bonnet [H 7.6]
     q33  ch 6 Curvature and shape · Advanced, 200 XP · sector 'Observatory' · Which geometry a surface allows [H 7.4, 7.6]
     q34  ch 6 Curvature and shape · Advanced, 200 XP · sector 'Observatory' · Fundamental domains [H 7.7]
     q35  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Loops and winding numbers [W The fundamental group]
     q36  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Joining loops: winding numbers add [W The fundamental group]
     q37  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Wrapping maps of the circle [W The fundamental group]
     q38  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Independent loops in a graph [H 7.5]
     q39  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Fixed points [L 8.5]
     q40  ch 7 Loops · Advanced, 200 XP · sector 'Orbit Ring' · Realm review and bridge to Complex analysis [W The fundamental group, H 7.5] */
(function(){
'use strict';
/* Jiří Lebl, Basic Analysis: Introduction to Real Analysis; Hitchman, Geometry with an Introduction to Cosmic Topology; Wikibooks, Topology sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /LibreTexts|Wikibooks/ (LibreTexts or Wikibooks).
   A title reads like: Lebl, Introduction to Real Analysis (LibreTexts) — 8.2 Open and Closed Sets
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.0<N>%3A_<Section> */
const source = {
 h7_2: {"title":"Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.2 Elliptic Geometry with Curvature k > 0","url":"https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.02%3A_Elliptic_Geometry_with_Curvature__k__0","description":"Elliptic geometry of curvature k > 0 on a sphere of radius 1 ÷ √k, with great circles as lines, and the area of a triangle with angles α, β, γ: (α + β + γ − π) ÷ k.","verified":"2026-11-28"},
 h7_4: {"title":"Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.4 The Family of Geometries (X_k, G_k)","url":"https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.04%3A_The_Family_of_Geometries__(_X_k__G_k_)","description":"For any real k a triangle with angles α, β, γ and area A has kA = α + β + γ − π; the sign of k gives elliptic, Euclidean or hyperbolic geometry.","verified":"2026-11-28"},
 h7_5: {"title":"Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.5 Surfaces","url":"https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.05%3A_Surfaces","description":"Cell divisions, a 1-complex (a graph) as vertices and edges, the Euler characteristic v − e + f, connected sums and the classification of surfaces.","verified":"2026-11-28"},
 h7_6: {"title":"Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.6 Geometry of Surfaces","url":"https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.06%3A_Geometry_of_Surfaces","description":"The Gauss–Bonnet formula kA = 2πχ for a surface of constant curvature, which surfaces admit elliptic, Euclidean or hyperbolic geometry, and a regular polygon whose corners all meet at one point.","verified":"2026-11-28"},
 h7_7: {"title":"Hitchman, Geometry with an Introduction to Cosmic Topology (LibreTexts) — 7.7 Quotient Spaces","url":"https://math.libretexts.org/Bookshelves/Geometry/Geometry_with_an_Introduction_to_Cosmic_Topology_(Hitchman)/07%3A_Geometry_on_Surfaces/7.07%3A_Quotient_Spaces","description":"Fundamental domains, a regular hyperbolic octagon with angles π ÷ 4 glued into the genus-2 surface, and the tiling its copies make.","verified":"2026-11-28"},
 w_fg: {"title":"Wikibooks, Topology — The fundamental group","url":"https://en.wikibooks.org/wiki/Topology/The_fundamental_group","description":"Loops at a base point, homotopy of paths, joining paths and running them backwards, the fundamental group, the circle’s fundamental group as the integers (counting turns), and z ↦ z² doubling it.","verified":"2026-11-28"},
 l8_5: {"title":"Lebl, Introduction to Real Analysis (LibreTexts) — 8.5 Continuous Functions","url":"https://math.libretexts.org/Bookshelves/Analysis/Introduction_to_Real_Analysis_(Lebl)/08%3A_Metric_Spaces/8.05%3A_Continuous_Functions","description":"Continuous functions between metric spaces, and (in an exercise) the intermediate value theorem for a continuous real function on a connected space.","verified":"2026-11-28"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  "id": "q31",
  "title": "Pegging a triangle on the dome",
  "topic": "Triangles on curved surfaces",
  "tier": "Advanced",
  "sector": "Observatory",
  "brief": "The survey crew is pegging out triangles on the curved star dome and needs their areas without unrolling the dome, which cannot be done.",
  "lesson": "On a surface of constant curvature k, a triangle with angles α, β and γ has kA = α + β + γ − π: its area is its angle excess divided by k.",
  "prompt": "The Observatory’s star dome is part of a sphere of radius 10 metres, so its surface has curvature k = 1 ÷ 10² = 1 ÷ 100. A survey crew pegs out a triangle on the dome whose sides are arcs of great circles, the straightest paths on a sphere. Its angles are π ÷ 2, π ÷ 3 and 5π ÷ 12 radians. Enter its angle excess in radians, then its area in square metres. A second triangle on the dome has an area of 120 square metres: enter the sum of its angles in radians. Give all three to 2 decimal places, rounding only at the end.",
  "answer": [
   0.79,
   78.54,
   4.34
  ],
  "labels": [
   "angle excess (rad)",
   "area (m²)",
   "angle sum (rad)"
  ],
  "tolerance": 0.005,
  "hints": [
   "The angle excess is the angle sum minus π. On a surface of curvature k, a triangle satisfies kA = α + β + γ − π.",
   "With k = 1 ÷ s², the area is the angle excess times s². For the second triangle, turn the formula round: α + β + γ = π + kA."
  ],
  "solution": "The angles add up to 5π ÷ 4 ≈ 3.93 radians, so the angle excess is 5π ÷ 4 − π = π ÷ 4 ≈ 0.79 radians. By kA = α + β + γ − π with k = 1 ÷ 100, the area is A = (π ÷ 4) × 100 ≈ 78.54 square metres. For the second triangle, α + β + γ = π + kA = π + 120 ÷ 100 ≈ 4.34 radians, more than π as it must be on a sphere.",
  "xp": 200,
  "prereqs": [
   "q30"
  ],
  "artifact": {
   "name": "Pegged dome triangle",
   "description": "Three pegs and three arcs of great circles whose angles add up to more than π."
  },
  "sources": [source.h7_2, source.h7_4],
  "teaching": {
   "intuition": "On a flat floor the angles of every triangle add up to π radians (180 degrees). On a curved surface they do not. Draw a triangle on a sphere using great circles, the circles round a sphere whose centre is the centre of the sphere: they are the straightest paths there, the sphere’s version of straight lines. Its angles add up to more than π. The amount by which they beat π is the angle excess. The bigger the triangle, the bigger the excess: a tiny triangle looks almost flat, while one with a corner at the north pole and two on the equator, a quarter of the way round from each other, has three right angles. The rule that ties this together is kA = α + β + γ − π, where k is the curvature and A the area. On a sphere of radius s, k = 1 ÷ s², so the area is the angle excess times s². Turned round, a triangle of known area has angle sum π + kA. Angles here are in radians.",
   "steps": [
    "Add the three angles, in radians.",
    "Subtract π to get the angle excess, α + β + γ − π. On a sphere it is positive.",
    "Divide by the curvature: A = (angle excess) ÷ k. On a sphere of radius s that is the angle excess times s².",
    "For the angle sum of a triangle of known area, reverse it: α + β + γ = π + kA. Round only at the end."
   ],
   "example": {
    "prompt": "A sphere of radius 5 metres has a triangle with three right angles, π ÷ 2 each. What is its area?",
    "steps": [
     "The angle sum is 3π ÷ 2, so the angle excess is 3π ÷ 2 − π = π ÷ 2.",
     "k = 1 ÷ 25, so A = (π ÷ 2) × 25 = 12.5π ≈ 39.27.",
     "Check: the whole sphere has area 4π × 25 = 100π, and this triangle is one eighth of it."
    ],
    "answer": "About 39.27 square metres."
   },
   "pitfalls": [
    "Working in degrees. The rule kA = α + β + γ − π needs the angles in radians.",
    "Forgetting to subtract π, and dividing the whole angle sum by k.",
    "Rounding the angle excess first and then multiplying by s²: the rounding error is multiplied by s² as well."
   ]
  },
  "guidance": [
   {
    "prompt": "Add the three angles π ÷ 2, π ÷ 3 and 5π ÷ 12. What is their sum in radians, to 2 decimal places?",
    "answer": [
     3.93
    ],
    "labels": [
     "angle sum (rad)"
    ],
    "explanation": "π ÷ 2 + π ÷ 3 + 5π ÷ 12 = 5π ÷ 4, which is about 3.93 radians."
   },
   {
    "prompt": "The angle excess is the angle sum minus π. What is it, to 2 decimal places?",
    "answer": [
     0.79
    ],
    "labels": [
     "angle excess (rad)"
    ],
    "explanation": "5π ÷ 4 − π = π ÷ 4, about 0.79 radians. A flat triangle would have excess 0."
   },
   {
    "prompt": "The curvature is k = 1 ÷ 100, so the area A = (α + β + γ − π) ÷ k is the excess times 100. What is the area, to 2 decimal places?",
    "answer": [
     78.54
    ],
    "labels": [
     "area (m²)"
    ],
    "explanation": "A = (π ÷ 4) × 100 ≈ 78.54 square metres. Use the exact excess, not the rounded one."
   },
   {
    "prompt": "A second triangle has area 120 square metres. What is its angle sum π + kA, to 2 decimal places?",
    "answer": [
     4.34
    ],
    "labels": [
     "angle sum (rad)"
    ],
    "explanation": "π + 120 ÷ 100 ≈ 4.34 radians."
   }
  ]
 },
 {
  "id": "q32",
  "title": "The area of a curved hull",
  "topic": "Gauss–Bonnet",
  "tier": "Advanced",
  "sector": "Observatory",
  "brief": "A hull surface is to be built with the same curvature everywhere, and the fabric store wants its area before any panel is cut.",
  "lesson": "Gauss–Bonnet: a closed surface of constant curvature k and Euler characteristic χ has area A with kA = 2πχ.",
  "prompt": "The Hull Gallery has sent a closed hull surface of genus 3 to the Observatory, which can give it constant curvature k = −1 ÷ 2. Enter its Euler characteristic χ, then its area divided by π. Then a dome closed into a full sphere of radius 5 metres has curvature k = 1 ÷ 25: enter its area in square metres divided by π.",
  "answer": [
   -4,
   16,
   100
  ],
  "labels": [
   "χ",
   "hull area ÷ π",
   "sphere area ÷ π"
  ],
  "tolerance": 0.01,
  "hints": [
   "An orientable surface of genus g has Euler characteristic χ = 2 − 2g, and a sphere has χ = 2.",
   "Gauss–Bonnet: a closed surface of constant curvature k has kA = 2πχ, so A = 2πχ ÷ k. Divide by π at the end."
  ],
  "solution": "Genus 3 gives χ = 2 − 2 × 3 = −4. By Gauss–Bonnet, A = 2πχ ÷ k = 2π × (−4) ÷ (−1 ÷ 2) = 2π × (−4) × (−2) = 16π, so the area divided by π is 16. The sphere has χ = 2, so A = 2π × 2 ÷ (1 ÷ 25) = 4π × 25 = 100π, the familiar 4πs², so the answer is 100.",
  "xp": 200,
  "prereqs": [
   "q31",
   "q25"
  ],
  "artifact": {
   "name": "Gauss–Bonnet card",
   "description": "One line, kA = 2πχ, that ties how curved a surface is to how many holes it has."
  },
  "sources": [source.h7_6],
  "teaching": {
   "intuition": "Cut a closed surface into triangles. On a curved surface each triangle obeys kA = (angle sum) − π, so adding the rule over every triangle adds all their areas on the left. On the right, the angles that meet at each corner point fill a full turn, 2π, and the minus π terms count the triangles. When the counting is done, the right-hand side is 2π(V − E + F), which is 2π times the Euler characteristic. This is the Gauss–Bonnet formula for a surface whose curvature k is the same everywhere: kA = 2πχ. It means the shape of the surface, through χ, fixes its area once the curvature is chosen: A = 2πχ ÷ k. An orientable surface of genus g has χ = 2 − 2g, so a surface with two or more holes has negative χ and needs negative curvature. A sphere has χ = 2, and with k = 1 ÷ s² the formula gives back the familiar area 4πs².",
   "steps": [
    "Find the Euler characteristic: χ = 2 − 2g for an orientable surface of genus g.",
    "Write Gauss–Bonnet, kA = 2πχ, and divide by k: A = 2πχ ÷ k.",
    "Dividing by a fraction such as −1 ÷ 3 is multiplying by −3.",
    "To give the area in multiples of π, divide the result by π."
   ],
   "example": {
    "prompt": "A surface of genus 2 has constant curvature −1. What is its area divided by π?",
    "steps": [
     "χ = 2 − 2 × 2 = −2.",
     "A = 2π × (−2) ÷ (−1) = 4π."
    ],
    "answer": "4, so the area is 4π."
   },
   "pitfalls": [
    "Getting a negative area: k and χ always have the same sign, so check both signs.",
    "Using χ = 2 − g for an orientable surface; that rule is for cross-caps. Genus g gives 2 − 2g.",
    "Multiplying by k instead of dividing by it."
   ]
  },
  "guidance": [
   {
    "prompt": "What is the Euler characteristic χ = 2 − 2g of a surface of genus 3?",
    "answer": [
     -4
    ],
    "labels": [
     "χ"
    ],
    "explanation": "χ = 2 − 2 × 3 = −4. It is negative, which matches the negative curvature."
   },
   {
    "prompt": "Gauss–Bonnet says kA = 2πχ. With k = −1 ÷ 2 and χ = −4, what is A ÷ π?",
    "answer": [
     16
    ],
    "labels": [
     "hull area ÷ π"
    ],
    "explanation": "A = 2πχ ÷ k: dividing by −1 ÷ 2 is multiplying by −2, so A = 2 × (−4) × (−2) × π = 16π."
   },
   {
    "prompt": "A sphere has χ = 2 and here k = 1 ÷ 25. What is its area divided by π?",
    "answer": [
     100
    ],
    "labels": [
     "sphere area ÷ π"
    ],
    "explanation": "A = 2π × 2 × 25 = 100π, the same as 4πs² for s = 5."
   }
  ]
 },
 {
  "id": "q33",
  "title": "Which sky fits the hull",
  "topic": "Which geometry a surface allows",
  "tier": "Advanced",
  "sector": "Observatory",
  "brief": "Each new hull design needs one kind of geometry all over it, and the Observatory has to say which kind before the panels are drawn.",
  "lesson": "In kA = 2πχ the area is positive, so the curvature has the sign of χ: χ > 0 elliptic, χ = 0 flat, χ < 0 hyperbolic.",
  "prompt": "Three hull designs reach the Observatory: a Klein bottle (2 cross-caps), an orientable surface of genus 4, and a non-orientable surface with 5 cross-caps. Each can be given one constant curvature k all over, and Gauss–Bonnet fixes the sign of k. Enter the sign of k for the first design, then for the second (1 for positive, 0 for zero, −1 for negative). Then give the third design curvature k = −1 and enter its area divided by π.",
  "answer": [
   0,
   -1,
   6
  ],
  "labels": [
   "sign of k, design 1",
   "sign of k, design 2",
   "area ÷ π, design 3"
  ],
  "tolerance": 0.01,
  "hints": [
   "χ = 2 − 2g for an orientable surface of genus g, and χ = 2 − c for a non-orientable one with c cross-caps.",
   "In kA = 2πχ the area A is positive, so k has the same sign as χ. With k = −1 the area is A = −2πχ."
  ],
  "solution": "The first design has χ = 2 − 2 = 0, so k has sign 0 and its geometry is flat. The second has χ = 2 − 2 × 4 = −6, so k has sign −1: hyperbolic. The third has χ = 2 − 5 = −3. With k = −1, Gauss–Bonnet gives −A = 2π × (−3), so A = 6π and the answer is 6.",
  "xp": 200,
  "prereqs": [
   "q32"
  ],
  "artifact": {
   "name": "Three-geometry chart",
   "description": "Sphere and projective plane, torus and Klein bottle, and everything else, sorted by the sign of χ."
  },
  "sources": [source.h7_4, source.h7_6],
  "teaching": {
   "intuition": "A surface can be given a geometry that looks the same at every point and in every direction, with one constant curvature k. Which kind of geometry it gets is not up to us. Gauss–Bonnet says kA = 2πχ, and an area A is always positive, so k must have the same sign as the Euler characteristic χ. When χ > 0 the curvature is positive and the geometry is elliptic, like a sphere: triangles have angle sums above π. When χ = 0 the curvature is 0 and we get flat geometry, the ordinary Euclidean kind, with angle sums exactly π. When χ < 0 the curvature is negative and the geometry is hyperbolic: triangles have angle sums below π. This works for non-orientable surfaces too. A cross-cap is a Möbius strip sewn into a hole in a sphere; a surface made with c cross-caps has χ = 2 − c, so the projective plane (c = 1) is elliptic, the Klein bottle (c = 2) is flat, and three or more cross-caps give hyperbolic geometry. An orientable surface of genus g has χ = 2 − 2g.",
   "steps": [
    "Find χ: 2 − 2g for an orientable surface of genus g, 2 − c for one with c cross-caps.",
    "The sign of k is the sign of χ: 1 for positive, 0 for zero, −1 for negative.",
    "Name the geometry: elliptic for k > 0, flat for k = 0, hyperbolic for k < 0.",
    "With k = −1, Gauss–Bonnet gives −A = 2πχ, so the area is −2πχ."
   ],
   "example": {
    "prompt": "What sign of curvature does a torus take, and what area does a surface of genus 2 have at k = −1?",
    "steps": [
     "A torus has genus 1, so χ = 2 − 2 = 0: the sign is 0, flat geometry.",
     "Genus 2 gives χ = −2. With k = −1, A = −2π × (−2) = 4π."
    ],
    "answer": "Sign 0 for the torus; area 4π for the genus-2 surface."
   },
   "pitfalls": [
    "Using 2 − 2c for a surface with c cross-caps. Each cross-cap lowers χ by 1, not 2.",
    "Calling the Klein bottle hyperbolic because it is strange: its χ is 0, so it is flat.",
    "Typing the geometry’s angle sum or χ itself instead of the sign 1, 0 or −1."
   ]
  },
  "guidance": [
   {
    "prompt": "What is the Euler characteristic of the first design, a Klein bottle (2 cross-caps)?",
    "answer": [
     0
    ],
    "labels": [
     "χ, design 1"
    ],
    "explanation": "χ = 2 − 2 = 0."
   },
   {
    "prompt": "k has the same sign as χ. What is the sign of k for the first design (1, 0 or −1)?",
    "answer": [
     0
    ],
    "labels": [
     "sign of k, design 1"
    ],
    "explanation": "χ = 0, so the sign is 0: flat geometry."
   },
   {
    "prompt": "What is the Euler characteristic of the second design, an orientable surface of genus 4?",
    "answer": [
     -6
    ],
    "labels": [
     "χ, design 2"
    ],
    "explanation": "χ = 2 − 2 × 4 = −6, so the sign of k is −1."
   },
   {
    "prompt": "The third design has χ = 2 − 5 = −3. With k = −1, what is its area divided by π?",
    "answer": [
     6
    ],
    "labels": [
     "area ÷ π, design 3"
    ],
    "explanation": "kA = 2πχ gives −A = 2π × (−3), so A = 6π."
   }
  ]
 },
 {
  "id": "q34",
  "title": "One tile for the whole hull",
  "topic": "Fundamental domains",
  "tier": "Advanced",
  "sector": "Observatory",
  "brief": "The panel cutters want one polygon pattern that, glued along its edges, makes a whole hull of higher genus.",
  "lesson": "A regular 4g-gon glued so all its corners meet at one point is a fundamental domain for the genus-g surface; its corner angles must add up to 2π.",
  "prompt": "The Observatory models the hull surface of genus 3 as one regular polygon glued by the word a₁b₁a₁⁻¹b₁⁻¹ … a₃b₃a₃⁻¹b₃⁻¹, which has 4 letters for each unit of genus. The gluing sends all the corners to one point, and the polygon is drawn with constant curvature k = −1 ÷ 2. Each corner angle is π ÷ N: enter N. Copies of this fundamental domain tile the curved plane: enter how many copies meet at each corner point. Then enter the polygon’s area divided by π.",
  "answer": [
   6,
   12,
   16
  ],
  "labels": [
   "N (angle π ÷ N)",
   "copies at a corner",
   "area ÷ π"
  ],
  "tolerance": 0.01,
  "hints": [
   "All the corners meet at one point, so their angles must add up to one full turn, 2π. A regular polygon has equal angles.",
   "Cut a polygon with n sides into n − 2 triangles. On curvature k its area satisfies kA = (angle sum) − (n − 2)π."
  ],
  "solution": "The word has 4 × 3 = 12 letters, so the polygon has 12 sides and 12 corners. They all glue to one point, so the 12 equal angles add up to 2π and each is 2π ÷ 12 = π ÷ 6. Around a corner point of the tiling, one corner of each copy fills the full turn, so 12 copies meet there. A flat 12-gon would have angle sum (12 − 2)π = 10π, far more than 2π, which is why the polygon must be hyperbolic. With k = −1 ÷ 2, kA = 2π − 10π = −8π, so A = 16π and the answer is 16.",
  "xp": 200,
  "prereqs": [
   "q22",
   "q33"
  ],
  "artifact": {
   "name": "Hyperbolic tile",
   "description": "A regular polygon with thin corners that tiles the curved plane, one copy per hull."
  },
  "sources": [source.h7_7, source.h7_6],
  "teaching": {
   "intuition": "A gluing word turns one polygon into a closed surface. The polygon is then a fundamental domain: a region that holds one representative of every point of the surface, with at most one in its interior, so only edges and corners appear more than once. For an orientable surface of genus g the standard word is a₁b₁a₁⁻¹b₁⁻¹ a₂b₂a₂⁻¹b₂⁻¹ and so on up to the g-th pair: 4g letters, so the polygon has 4g sides, and this gluing sends all its corners to one point. On the finished surface, the corner angles that meet at that point must fill exactly one full turn, 2π, so a regular 4g-gon needs each corner angle to be 2π ÷ 4g = π ÷ 2g. A flat polygon cannot do that: its angles add up to (4g − 2)π, far more than 2π. So we draw the polygon with negative curvature, where angles shrink, and hyperbolic geometry lets the angles be exactly right. Copies of the domain then tile the curved plane, and 4g copies meet at every corner, one corner angle each. Cutting the polygon into 4g − 2 triangles and adding kA = (angle sum) − π over them gives its area: kA = 2π − (4g − 2)π.",
   "steps": [
    "Count the sides: one per letter of the gluing word, 4g for genus g.",
    "All corners meet at one point, so the equal corner angles add up to 2π: each is 2π ÷ 4g = π ÷ 2g.",
    "In the tiling, one corner of each copy meets at a corner point, so 4g copies meet there.",
    "For the area, use kA = (angle sum) − (n − 2)π with n sides and angle sum 2π, then divide by k."
   ],
   "example": {
    "prompt": "The genus-2 surface uses a regular octagon. What is each corner angle, and its area when k = −1?",
    "steps": [
     "The word a₁b₁a₁⁻¹b₁⁻¹a₂b₂a₂⁻¹b₂⁻¹ has 8 letters, so the polygon is an octagon.",
     "Eight equal angles add up to 2π, so each is π ÷ 4, and 8 copies meet at each corner.",
     "kA = 2π − 6π = −4π, so with k = −1 the area is 4π."
    ],
    "answer": "Each angle is π ÷ 4; the area is 4π."
   },
   "pitfalls": [
    "Using the flat-polygon angle (n − 2)π ÷ n. The corners must meet at one point, so the angles must add up to 2π.",
    "Counting g sides instead of 4g: each unit of genus brings four letters, a, b, a⁻¹ and b⁻¹.",
    "Forgetting the sign: kA is negative here, and dividing by a negative k makes the area positive."
   ]
  },
  "guidance": [
   {
    "prompt": "How many sides does the polygon have? It has one side for each letter of the word.",
    "answer": [
     12
    ],
    "labels": [
     "sides"
    ],
    "explanation": "4 letters for each unit of genus: 4 × 3 = 12 sides."
   },
   {
    "prompt": "The 12 equal corner angles add up to 2π. Each angle is π ÷ N: what is N?",
    "answer": [
     6
    ],
    "labels": [
     "N (angle π ÷ N)"
    ],
    "explanation": "2π ÷ 12 = π ÷ 6, so N = 6."
   },
   {
    "prompt": "With k = −1 ÷ 2 and angle sum 2π, kA = 2π − (12 − 2)π. What is the area divided by π?",
    "answer": [
     16
    ],
    "labels": [
     "area ÷ π"
    ],
    "explanation": "kA = 2π − 10π = −8π. Dividing by k = −1 ÷ 2 gives A = 16π."
   }
  ]
 },
 {
  "id": "q35",
  "title": "Counting turns round the beacon",
  "topic": "Loops and winding numbers",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "A survey drone keeps flying round a beacon, and the ring crew needs to know how many times its closed path really goes round.",
  "lesson": "The winding number of a loop round a point is its net number of anticlockwise turns: crossings of a ray from the point, anticlockwise minus clockwise.",
  "prompt": "A survey drone flies a closed loop round beacon B on the Orbit Ring. Lines due north and due east through B split the ground into four sectors, NE, NW, SW and SE, which follow each other anticlockwise. The drone never passes over B, and each move takes it into a neighbouring sector. Its log has 11 entries, starting and ending in NE: NE, NW, SW, SE, NE, SE, NE, NW, SW, SE, NE. Use the ray due east from B, the border between SE and NE. Enter the number of anticlockwise crossings of the ray (SE to NE), then the clockwise crossings (NE to SE), then the winding number of the loop round B.",
  "answer": [
   3,
   1,
   2
  ],
  "labels": [
   "anticlockwise crossings",
   "clockwise crossings",
   "winding number"
  ],
  "tolerance": 0.01,
  "hints": [
   "Read the log in pairs of neighbouring entries. Only the pairs SE, NE and NE, SE cross the ray due east.",
   "The winding number is the anticlockwise crossings minus the clockwise crossings."
  ],
  "solution": "Reading the log in pairs, SE followed by NE happens 3 times, and NE followed by SE happens once. Every other move stays clear of the ray. The winding number is 3 − 1 = 2, so the loop goes round B twice anticlockwise.",
  "xp": 200,
  "prereqs": [
   "q12"
  ],
  "artifact": {
   "name": "Beacon ray marker",
   "description": "A painted ray due east from the beacon, where every crossing of a loop is counted."
  },
  "sources": [source.w_fg],
  "teaching": {
   "intuition": "A loop is a path that starts and ends at the same point. Picture a loop drawn round a beacon that it never touches. However it wanders, it goes round the beacon some whole number of times, anticlockwise counting as plus and clockwise as minus. That net count is the winding number of the loop round the point. To read it, draw a ray, a half-line, out from the point, such as due east. Each time the loop crosses the ray going anticlockwise, add 1; each time it crosses going clockwise, subtract 1. Back-and-forth wiggles across the ray cancel out. The winding number does not change when the loop is deformed little by little without ever passing through the point. Such a deformation is a homotopy, and loops that can be deformed into each other are homotopic. A loop that can be shrunk to a dot without crossing the point has winding number 0.",
   "steps": [
    "Choose a ray from the point that the loop never stops on, for example due east.",
    "Go along the loop and list each crossing of the ray, with its direction.",
    "Count the anticlockwise crossings and the clockwise crossings.",
    "The winding number is anticlockwise minus clockwise. It is a whole number, and it can be negative or 0."
   ],
   "example": {
    "prompt": "A log reads NE, NW, SW, SE, NE: 5 entries round beacon B. What is the winding number?",
    "steps": [
     "The pairs are NE to NW, NW to SW, SW to SE and SE to NE. Only the last crosses the east ray, anticlockwise.",
     "One anticlockwise crossing and none clockwise: 1 − 0 = 1."
    ],
    "answer": "Winding number 1: once round anticlockwise."
   },
   "pitfalls": [
    "Counting every crossing as plus one. A clockwise crossing subtracts.",
    "Counting moves between other sectors, such as NW to SW: only crossings of the chosen ray count.",
    "Thinking a loop that wiggles back and forth across the ray goes round several times: a crossing undone by the next one adds nothing."
   ]
  },
  "guidance": [
   {
    "prompt": "How many times does the log go from SE straight to NE?",
    "answer": [
     3
    ],
    "labels": [
     "anticlockwise crossings"
    ],
    "explanation": "SE, NE appears 3 times: each time is one anticlockwise crossing of the ray."
   },
   {
    "prompt": "How many times does the log go from NE straight to SE?",
    "answer": [
     1
    ],
    "labels": [
     "clockwise crossings"
    ],
    "explanation": "NE, SE appears once: each time is one clockwise crossing of the ray."
   },
   {
    "prompt": "What is the winding number: anticlockwise crossings minus clockwise crossings?",
    "answer": [
     2
    ],
    "labels": [
     "winding number"
    ],
    "explanation": "3 − 1 = 2."
   }
  ]
 },
 {
  "id": "q36",
  "title": "Flying one loop after another",
  "topic": "Joining loops: winding numbers add",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "Drone routes are built by flying stored loops one after another, sometimes in reverse, and the crew wants the turn count of the whole route.",
  "lesson": "Joining loops adds their winding numbers and running a loop backwards changes its sign, so loops round a point behave like the whole numbers.",
  "prompt": "Round beacon B the sectors NE, NW, SW and SE follow each other anticlockwise, and the ray due east from B is the border between SE and NE. Two drone loops start and end in NE. Loop a logs NE, NW, SW, SE, NE, NW, SW, SE, NE. Loop b logs NE, SE, SW, NW, NE. Enter the winding number round B of the loop “a, then b”, then of a run backwards, then of the loop “b, then a backwards, then b again”.",
  "answer": [
   1,
   -2,
   -4
  ],
  "labels": [
   "a then b",
   "a backwards",
   "b, a backwards, b"
  ],
  "tolerance": 0.01,
  "hints": [
   "Find the winding number of each loop first: anticlockwise crossings of the ray minus clockwise ones.",
   "Joining loops adds their winding numbers, and running a loop backwards changes the sign of its winding number."
  ],
  "solution": "Loop a crosses the ray with winding number 2 and loop b with winding number −1. Joining adds: “a, then b” has 2 + (−1) = 1. Backwards, every crossing changes direction, so a backwards has −2. “b, then a backwards, then b” has −1 + (−2) + (−1) = −4.",
  "xp": 200,
  "prereqs": [
   "q35"
  ],
  "artifact": {
   "name": "Loop library",
   "description": "Stored loops from the same base point, flown in any order and either way round."
  },
  "sources": [source.w_fg],
  "teaching": {
   "intuition": "Two loops that start and end at the same base point can be joined: fly the first one, then the second. Every crossing of the ray from the first loop and every crossing from the second still happens, so the winding number of the joined loop is the sum of the two winding numbers. A loop can also be run backwards, from its end to its start. Then every anticlockwise crossing becomes a clockwise one and the other way round, so the winding number changes sign. A loop joined to its own reverse has winding number 0, and it can be shrunk to the base point by a homotopy. Grouping loops by homotopy and joining them gives the fundamental group of the space. For the ring round the beacon (a circle), loops are known up to homotopy by their winding numbers alone, so this fundamental group is the whole numbers, with joining as adding.",
   "steps": [
    "Find the winding number of each loop on its own.",
    "For a loop run backwards, change the sign of its winding number.",
    "For loops joined one after another, add the winding numbers, in any order.",
    "Check the answer’s sign: more anticlockwise than clockwise turns in total gives a positive number."
   ],
   "example": {
    "prompt": "Loop p has winding number 3 and loop q has winding number −1. What is the winding number of p, then q backwards, then q backwards again?",
    "steps": [
     "q backwards has winding number 1.",
     "Joining: 3 + 1 + 1 = 5."
    ],
    "answer": "5."
   },
   "pitfalls": [
    "Multiplying winding numbers when loops are joined. Joining adds.",
    "Forgetting to change the sign of a loop run backwards.",
    "Thinking the order matters for the count: a then b and b then a have the same winding number."
   ]
  },
  "guidance": [
   {
    "prompt": "What is the winding number of loop a on its own?",
    "answer": [
     2
    ],
    "labels": [
     "winding number of a"
    ],
    "explanation": "Count SE, NE pairs minus NE, SE pairs in loop a’s log: 2."
   },
   {
    "prompt": "What is the winding number of loop b on its own?",
    "answer": [
     -1
    ],
    "labels": [
     "winding number of b"
    ],
    "explanation": "The same count for loop b gives −1."
   },
   {
    "prompt": "Joining adds and running backwards changes the sign. What is the winding number of “b, then a backwards, then b”?",
    "answer": [
     -4
    ],
    "labels": [
     "b, a backwards, b"
    ],
    "explanation": "−1 + (−2) + (−1) = −4."
   }
  ]
 },
 {
  "id": "q37",
  "title": "Gears that wrap the ring",
  "topic": "Wrapping maps of the circle",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "The ring’s drive wraps one circular track round another through a train of gears, and the engineers need to know how the turns multiply.",
  "lesson": "The map θ ↦ nθ of a circle has degree n: it sends a loop with winding number k to one with winding number nk, and |n| points to each point.",
  "prompt": "The Orbit Ring’s drive moves each point of a circular track: the point at angle θ goes to angle 3θ, written f: θ ↦ 3θ. A second gear then applies g: θ ↦ −2θ. The combined map takes θ to g(f(θ)). Enter the degree of the combined map, then how many points of the track it sends to the single point at angle 0, then the winding number of the image of a loop that goes round the track twice anticlockwise (winding number 2).",
  "answer": [
   -6,
   6,
   -12
  ],
  "labels": [
   "degree",
   "points sent to angle 0",
   "image winding number"
  ],
  "tolerance": 0.01,
  "hints": [
   "θ ↦ nθ has degree n: as θ goes once round, nθ goes n times round. Doing one map after another multiplies the degrees.",
   "A map of degree n (not 0) sends exactly |n| points to each point. A loop with winding number k goes to a loop with winding number n × k."
  ],
  "solution": "f(θ) = 3θ, so g(f(θ)) = −2 × 3θ = −6θ: the combined map has degree −6. Angle −6θ is a whole number of turns at exactly 6 angles θ round the circle (θ = 2πj ÷ 6 for j = 0 to 5), so 6 points land on angle 0. The loop with winding number 2 goes to a loop with winding number −6 × 2 = −12.",
  "xp": 200,
  "prereqs": [
   "q36"
  ],
  "artifact": {
   "name": "Wrapping gear",
   "description": "A gear train that winds one ring round another a fixed number of times."
  },
  "sources": [source.w_fg],
  "teaching": {
   "intuition": "Describe a point of a circle by its angle θ. The map θ ↦ nθ, for a whole number n, moves each point to n times its angle. As θ goes once round, nθ goes n times round: for n = 2 the circle is wrapped twice round itself, and for n = −1 it is flipped so it runs the other way. The number n is the degree of a circle map like this one. A loop that winds k times round goes to a loop that winds n × k times, so the map multiplies winding numbers by its degree. Doing θ ↦ aθ and then θ ↦ bθ gives θ ↦ baθ, so degrees multiply. Counting the points that land on one target point also shows the degree: for n not 0, nθ hits any given angle at exactly |n| evenly spaced values of θ, where |n| is the size of n without its sign.",
   "steps": [
    "Read the degree of θ ↦ nθ: it is n. For one map after another, multiply the degrees.",
    "The points sent to any one point number |n|, spaced 2π ÷ |n| apart.",
    "A loop with winding number k goes to a loop with winding number n × k.",
    "A negative degree reverses direction: anticlockwise loops become clockwise ones."
   ],
   "example": {
    "prompt": "The map θ ↦ 2θ. How many points go to angle 0, and where does a loop with winding number 3 go?",
    "steps": [
     "2θ is a whole number of turns when θ = 0 or θ = π: 2 points.",
     "The loop goes to one with winding number 2 × 3 = 6."
    ],
    "answer": "2 points; winding number 6."
   },
   "pitfalls": [
    "Adding the degrees of two maps done one after another. Degrees multiply.",
    "Giving a negative count of points: the number of points is |n|, never negative.",
    "Forgetting that a negative degree changes the sign of every winding number."
   ]
  },
  "guidance": [
   {
    "prompt": "What is the degree of g(f(θ)) = −2 × 3θ?",
    "answer": [
     -6
    ],
    "labels": [
     "degree"
    ],
    "explanation": "Degrees multiply: −2 × 3 = −6."
   },
   {
    "prompt": "A map of degree −6 sends how many points to angle 0?",
    "answer": [
     6
    ],
    "labels": [
     "points sent to angle 0"
    ],
    "explanation": "|−6| = 6: one for each whole number of turns the angle −6θ passes as θ goes once round."
   },
   {
    "prompt": "What is the winding number of the image of a loop with winding number 2?",
    "answer": [
     -12
    ],
    "labels": [
     "image winding number"
    ],
    "explanation": "−6 × 2 = −12."
   }
  ]
 },
 {
  "id": "q38",
  "title": "Loops in the cable loom",
  "topic": "Independent loops in a graph",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "Every independent loop in a cable loom needs its own current sensor, so the electricians want the count for each new loom.",
  "lesson": "A connected graph with V vertices and E edges has E − V + 1 = 1 − χ independent loops.",
  "prompt": "A cable loom on the Orbit Ring is a rectangular grid of cable 3 cells wide and 2 cells tall: every cell is a square edged by cable, and there is a junction at every corner of every cell. Treat it as a graph: junctions are vertices and the cables between them are edges. Enter the number of vertices V, then the number of edges E, then the number of independent loops: the fewest loops from which every loop in the graph can be built by joining them.",
  "answer": [
   12,
   17,
   6
  ],
  "labels": [
   "V",
   "E",
   "independent loops"
  ],
  "tolerance": 0.01,
  "hints": [
   "Count vertices and edges row by row or part by part, so you count each once.",
   "A spanning tree of a connected graph uses V − 1 edges and has no loop. Each further edge closes one new independent loop, so there are E − V + 1 = 1 − χ of them."
  ],
  "solution": "The junctions form 3 rows of 4, so V = 3 × 4 = 12. Each of the 3 rows has 3 horizontal cables and each of the 4 columns has 2 vertical ones, so E = 3 × 3 + 4 × 2 = 17. The Euler characteristic of the graph is χ = V − E = 12 − 17 = −5, and the number of independent loops is E − V + 1 = 1 − χ = 6.",
  "xp": 200,
  "prereqs": [
   "q21",
   "q35"
  ],
  "artifact": {
   "name": "Loop sensor kit",
   "description": "One sensor for each independent loop of a cable loom."
  },
  "sources": [source.h7_5],
  "teaching": {
   "intuition": "A cable loom is a graph: junctions are vertices and cables are edges, and it is connected, all in one piece. Some routes through it come back to where they started: loops. Many loops are built from others, since two loops that share a cable can be joined into a bigger one, so the useful count is the number of independent loops, the fewest from which every loop can be built. To count them, keep cutting cables that lie on a loop until no loop is left but the loom is still in one piece. What remains is a spanning tree: it reaches every vertex, has no loop, and has exactly V − 1 edges. Every cable put back closes exactly one new loop, so there are E − (V − 1) = E − V + 1 independent loops. The Euler characteristic of a graph is χ = V − E, so the count is also 1 − χ.",
   "steps": [
    "Count the vertices V, part by part or row by row so none is counted twice.",
    "Count the edges E the same way.",
    "Work out χ = V − E.",
    "The number of independent loops of a connected graph is E − V + 1 = 1 − χ."
   ],
   "example": {
    "prompt": "A wheel has a hub, 4 spokes and 4 rim junctions joined round the rim. How many independent loops?",
    "steps": [
     "V = 4 + 1 = 5 and E = 4 spokes + 4 rim cables = 8.",
     "E − V + 1 = 8 − 5 + 1 = 4: one loop for each wedge between two spokes."
    ],
    "answer": "4 independent loops."
   },
   "pitfalls": [
    "Counting every loop you can see. In a grid of 4 cells the big outer loop is built from the small ones, so it does not count again.",
    "Forgetting the + 1: a tree has E = V − 1 and no loop, not −1 of them.",
    "Counting a junction once for each cable that meets it."
   ]
  },
  "guidance": [
   {
    "prompt": "How many vertices (junctions) does the loom have?",
    "answer": [
     12
    ],
    "labels": [
     "V"
    ],
    "explanation": "The junctions form 3 rows of 4, so V = 3 × 4 = 12."
   },
   {
    "prompt": "How many edges (cables between junctions) does it have?",
    "answer": [
     17
    ],
    "labels": [
     "E"
    ],
    "explanation": "Each of the 3 rows has 3 horizontal cables and each of the 4 columns has 2 vertical ones, so E = 3 × 3 + 4 × 2 = 17."
   },
   {
    "prompt": "What is χ = V − E for this graph?",
    "answer": [
     -5
    ],
    "labels": [
     "χ"
    ],
    "explanation": "12 − 17 = −5, so there are 1 − χ = 6 independent loops."
   }
  ]
 },
 {
  "id": "q39",
  "title": "The set point that stays put",
  "topic": "Fixed points",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "A thermostat keeps resetting its own set point, and the crew wants the one setting that it leaves unchanged.",
  "lesson": "A continuous f that takes [a, b] into itself has a fixed point, f(x) = x: g(x) = f(x) − x changes sign, so halving finds it.",
  "prompt": "A thermostat on the Orbit Ring resets its set point x (between 0 and 5) to f(x) = (x² + 11) ÷ 10 after each cycle. This f is continuous, takes [0, 5] into itself and has exactly one fixed point there. A fixed point is an x with f(x) = x. Let g(x) = f(x) − x. Enter g(0), then g(5), then the fixed point of f in [0, 5] to 2 decimal places, found by halving the interval where g changes sign (or by solving f(x) = x exactly).",
  "answer": [
   1.1,
   -1.4,
   1.26
  ],
  "labels": [
   "g(0)",
   "g(5)",
   "fixed point"
  ],
  "tolerance": 0.005,
  "hints": [
   "g(0) = f(0) − 0 is at least 0 and g(5) = f(5) − 5 is at most 0, because f stays in [0, 5]. By the intermediate value theorem g is 0 somewhere between.",
   "Halve the interval and keep the half whose ends give g opposite signs, until both ends round to the same 2 decimal places. Or solve f(x) = x as a quadratic and keep the root in [0, 5]."
  ],
  "solution": "g(0) = f(0) = 1.1 is positive and g(5) = f(5) − 5 = −1.4 is negative, so g has a zero in between: a fixed point of f. Checking whole numbers, g(1) = 0.2 and g(2) = −0.5, so it lies between 1 and 2. Halving that interval again and again, or solving x² − 10x + 11 = 0 to get x = 5 − √14, gives x ≈ 1.26.",
  "xp": 200,
  "prereqs": [
   "q16"
  ],
  "artifact": {
   "name": "Steady set point",
   "description": "The one setting the thermostat hands back unchanged."
  },
  "sources": [source.l8_5],
  "teaching": {
   "intuition": "A fixed point of a function f is an input that f leaves alone: f(x) = x. If f is continuous and takes the interval [a, b] into itself, so every value f(x) also lies in [a, b], then f must have a fixed point. To see why, look at g(x) = f(x) − x, which is continuous too. At the left end, f(a) is at least a, so g(a) ≥ 0. At the right end, f(b) is at most b, so g(b) ≤ 0. By the intermediate value theorem, a continuous function that goes from a value ≥ 0 to a value ≤ 0 is 0 somewhere in between, and there f(x) = x. The same argument tells us how to find it: halve the interval, look at the sign of g at the midpoint, and keep the half whose ends still have opposite signs. Each halving makes the interval half as long, so the fixed point is pinned down as closely as we like. This is the simplest fixed point theorem; it holds for any continuous map of the interval, whatever its formula.",
   "steps": [
    "Check that f is continuous and that its values stay inside [a, b].",
    "Set g(x) = f(x) − x and work out g(a) ≥ 0 and g(b) ≤ 0.",
    "Halve: find g at the midpoint and keep the half whose ends give opposite signs.",
    "Stop when both ends round to the same 2 decimal places; that is the fixed point."
   ],
   "example": {
    "prompt": "f(x) = (x + 4) ÷ 3 takes [0, 4] into itself. Find its fixed point.",
    "steps": [
     "g(0) = 4 ÷ 3 is positive and g(4) = 8 ÷ 3 − 4 is negative, so there is a fixed point.",
     "The midpoint 2 gives g(2) = 6 ÷ 3 − 2 = 0, so x = 2 is the fixed point exactly."
    ],
    "answer": "x = 2, since f(2) = 2."
   },
   "pitfalls": [
    "Keeping the wrong half: keep the half whose two ends give g opposite signs.",
    "Looking for f(x) = 0 instead of f(x) = x.",
    "Expecting a fixed point when f leaves the interval: the theorem needs f to take [a, b] into itself."
   ]
  },
  "guidance": [
   {
    "prompt": "What is g(0) = f(0) − 0?",
    "answer": [
     1.1
    ],
    "labels": [
     "g(0)"
    ],
    "explanation": "f(0) = 1.1, so g(0) = 1.1, which is positive."
   },
   {
    "prompt": "What is g(5) = f(5) − 5?",
    "answer": [
     -1.4
    ],
    "labels": [
     "g(5)"
    ],
    "explanation": "f(5) = 3.6, so g(5) = −1.4, which is negative."
   },
   {
    "prompt": "g changes sign between two whole numbers m and m + 1. What is m?",
    "answer": [
     1
    ],
    "labels": [
     "m"
    ],
    "explanation": "g(1) = 0.2 and g(2) = −0.5 have opposite signs, so m = 1."
   },
   {
    "prompt": "Keep halving from [1, 2]. What is the fixed point to 2 decimal places?",
    "answer": [
     1.26
    ],
    "labels": [
     "fixed point"
    ],
    "explanation": "The halvings close in on x ≈ 1.2583, which rounds to 1.26. Check: f(1.26) is very close to 1.26."
   }
  ]
 },
 {
  "id": "q40",
  "title": "The survey loop round three sensors",
  "topic": "Realm review and bridge to Complex analysis",
  "tier": "Advanced",
  "sector": "Orbit Ring",
  "brief": "One long survey loop is built from stored circuits, and the Antenna Field team wants its turn count round each of three sensors before Complex analysis takes over.",
  "lesson": "One loop has a winding number round each point it avoids, and joining circuits adds them point by point.",
  "prompt": "Three sensors A, B and C stand in a row, in that order, near the Orbit Ring. One survey loop is made by joining three circuits, all starting and ending at the same point: first twice anticlockwise round a circle enclosing A and B, then 3 times clockwise round a circle enclosing B only, then once anticlockwise round a circle enclosing B and C. Each circle encloses exactly the sensors named. Enter the winding number of the whole loop round A, then round B, then round C, then the total of the three.",
  "answer": [
   2,
   0,
   1,
   3
  ],
  "labels": [
   "winding round A",
   "winding round B",
   "winding round C",
   "total"
  ],
  "tolerance": 0.01,
  "hints": [
   "A circle flown once anticlockwise has winding number 1 round each point inside it and 0 round each point outside. Clockwise gives −1.",
   "The loop is the three circuits joined, so for each sensor add the winding numbers of the circuits that enclose it."
  ],
  "solution": "Round A: 2. Round B: 2 + (−3) + 1 = 0. Round C: 1. The total is 2 + 0 + 1 = 3. In complex analysis each of these winding numbers becomes an integral round the loop.",
  "xp": 200,
  "prereqs": [
   "q37",
   "q38"
  ],
  "artifact": {
   "name": "Three-sensor survey map",
   "description": "One joined loop and the turn count it makes round each sensor."
  },
  "sources": [source.w_fg],
  "teaching": {
   "intuition": "One loop goes round different points different numbers of times. A circle flown once anticlockwise has winding number 1 round every point inside it and 0 round every point outside, since a ray from an outside point can be chosen to miss the circle altogether. Clockwise, the inside points get −1. When a loop is made by joining circuits that all start and end at one base point, its winding number round each point is the sum of the circuits’ winding numbers round that point, exactly as for joining loops round one beacon. So a few circles, each flown some number of times, give a whole table of winding numbers, one per point. This is the bridge to complex analysis, which opens next at the Antenna Field: there, the winding number round a point becomes an integral taken along the loop, and totals over several points like the one here decide what such integrals are worth.",
   "steps": [
    "For each circuit, note which points it encloses and its winding number: + for anticlockwise, − for clockwise, times the number of times round.",
    "For each point, add the winding numbers of the circuits that enclose it. A circuit that does not enclose the point adds 0.",
    "Repeat for every point.",
    "Add the point totals if the total is asked for."
   ],
   "example": {
    "prompt": "A loop flies once anticlockwise round a circle enclosing P and Q, then 2 times clockwise round a circle enclosing Q only. What are its winding numbers round P and Q?",
    "steps": [
     "Round P: only the first circle encloses it, so 1.",
     "Round Q: 1 + (−2) = −1."
    ],
    "answer": "P: 1, Q: −1."
   },
   "pitfalls": [
    "Adding a circuit’s turns round a point it does not enclose.",
    "Forgetting that clockwise circuits count negative.",
    "Thinking one loop has one winding number: it has one for each point it avoids."
   ]
  },
  "guidance": [
   {
    "prompt": "Add the winding numbers of the circuits that enclose A. What is the winding number of the loop round A?",
    "answer": [
     2
    ],
    "labels": [
     "winding round A"
    ],
    "explanation": "Round A: 2."
   },
   {
    "prompt": "What is the winding number round B?",
    "answer": [
     0
    ],
    "labels": [
     "winding round B"
    ],
    "explanation": "Round B: 2 + (−3) + 1 = 0."
   },
   {
    "prompt": "What is the winding number round C?",
    "answer": [
     1
    ],
    "labels": [
     "winding round C"
    ],
    "explanation": "Round C: 1."
   }
  ]
 }
);
})();
