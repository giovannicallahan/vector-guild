/* Calculus 3: many variables missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/calc3/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Fields and paths · Advanced, 200 XP · sector 'Cable Yard' · Vector fields; line integrals of a function [6.1, 6.2]
     q32  ch 6 Fields and paths · Advanced, 200 XP · sector 'Cable Yard' · Work along a path: line integrals of a field [6.2]
     q33  ch 6 Fields and paths · Advanced, 200 XP · sector 'Cable Yard' · Conservative fields and potential functions [6.3]
     q34  ch 6 Fields and paths · Advanced, 200 XP · sector 'Cable Yard' · Green's theorem [6.4]
     q35  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · Divergence and curl [6.5]
     q36  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · Parametrised surfaces and surface area [6.6]
     q37  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · Flux through a surface [6.6]
     q38  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · Stokes' theorem [6.7]
     q39  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · The divergence theorem [6.8]
     q40  ch 7 Flux and the great theorems · Advanced, 200 XP · sector 'Atmosphere Plant' · Realm review and bridge to Differential equations [4.6, 6.7, 6.8] */
(function(){
'use strict';
/* OpenStax Calculus Volume 3 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient
   Link to the section page itself: https://openstax.org/books/calculus-volume-3/pages/<section-slug> */
const source = {
 s4_6: { title: "OpenStax Calculus Volume 3 — 4.6 Directional Derivatives and the Gradient", url: "https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient", description: "The gradient of a function of two or three variables, and the directional derivative as the gradient dotted with a unit vector.", verified: '2026-11-27' },
 s6_1: { title: "OpenStax Calculus Volume 3 — 6.1 Vector Fields", url: "https://openstax.org/books/calculus-volume-3/pages/6-1-vector-fields", description: "Vector fields in the plane and in space, evaluated at points, and gradient fields.", verified: '2026-11-27' },
 s6_2: { title: "OpenStax Calculus Volume 3 — 6.2 Line Integrals", url: "https://openstax.org/books/calculus-volume-3/pages/6-2-line-integrals", description: "Scalar line integrals with ds = ‖r′(t)‖ dt, the mass of a wire, and vector line integrals as work.", verified: '2026-11-27' },
 s6_3: { title: "OpenStax Calculus Volume 3 — 6.3 Conservative Vector Fields", url: "https://openstax.org/books/calculus-volume-3/pages/6-3-conservative-vector-fields", description: "Potential functions, the fundamental theorem for line integrals, and the cross-partials test.", verified: '2026-11-27' },
 s6_4: { title: "OpenStax Calculus Volume 3 — 6.4 Green’s Theorem", url: "https://openstax.org/books/calculus-volume-3/pages/6-4-greens-theorem", description: "Green’s theorem in circulation form, turning a line integral round a closed curve into a double integral.", verified: '2026-11-27' },
 s6_5: { title: "OpenStax Calculus Volume 3 — 6.5 Divergence and Curl", url: "https://openstax.org/books/calculus-volume-3/pages/6-5-divergence-and-curl", description: "Divergence and curl of a vector field in space, and what they measure.", verified: '2026-11-27' },
 s6_6: { title: "OpenStax Calculus Volume 3 — 6.6 Surface Integrals", url: "https://openstax.org/books/calculus-volume-3/pages/6-6-surface-integrals", description: "Parametrised surfaces, surface area from ‖t_u × t_v‖, orientation, and flux integrals.", verified: '2026-11-27' },
 s6_7: { title: "OpenStax Calculus Volume 3 — 6.7 Stokes’ Theorem", url: "https://openstax.org/books/calculus-volume-3/pages/6-7-stokes-theorem", description: "Stokes’ theorem: circulation round a boundary curve equals the flux of the curl through the surface.", verified: '2026-11-27' },
 s6_8: { title: "OpenStax Calculus Volume 3 — 6.8 The Divergence Theorem", url: "https://openstax.org/books/calculus-volume-3/pages/6-8-the-divergence-theorem", description: "The divergence theorem: outward flux through a closed surface equals the triple integral of the divergence.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: "Weighing the coil cable", topic: "Vector fields; line integrals of a function", tier: 'Advanced', sector: 'Cable Yard',
  brief: "A new cable is going up beside the field coil, and the crane crew needs the pull at its anchor and the cable’s mass before they lift it.",
  lesson: "A vector field gives an arrow at every point; the line integral of a function along a curve adds the function up along the curve’s length, using ds = ‖r′(t)‖ dt.",
  prompt: "Near the field coil in the cable yard, the pull on a steel part is the vector field F(x, y, z) = ⟨2y, x + 3z, xy⟩ newtons, with x, y and z in metres. A straight cable runs from the point (3, 1, 2) up to (5, 4, 8). Its density is ρ = 2 + z kilograms per metre, where z is the height, so the cable is heavier higher up. Enter the three components of F at the cable’s lower end (3, 1, 2), then the mass of the cable in kilograms.",
  answer: [2,9,3,49], labels: ["F, x-component (N)","F, y-component (N)","F, z-component (N)","mass (kg)"], tolerance: 0.01,
  hints: [
   "To find F at a point, put that point’s x, y and z into each of the three components.",
   "Write the cable as r(t) = start + t × (end − start) for t from 0 to 1. Then ds = ‖r′(t)‖ dt, and the mass is the line integral of ρ: the integral of ρ(r(t)) × ‖r′(t)‖ from t = 0 to t = 1."
  ],
  solution: "F(3, 1, 2) = ⟨2 × 1, 3 + 3 × 2, 3 × 1⟩ = ⟨2, 9, 3⟩. The cable is r(t) = ⟨3 + 2t, 1 + 3t, 2 + 6t⟩ for t from 0 to 1, so r′(t) = ⟨2, 3, 6⟩ and ‖r′(t)‖ = √(4 + 9 + 36) = √49 = 7. Along the cable z = 2 + 6t, so ρ(r(t)) = 4 + 6t. The mass is the integral from t = 0 to t = 1 of (4 + 6t) × 7, which is 7 × (4 + 6 ÷ 2) = 7 × 7 = 49 kilograms.",
  xp: 200, prereqs: ["q10"],
  artifact: { name: "Coil cable tag", description: "The pull at the anchor and the weight of a cable that gets heavier as it climbs." },
  sources: [source.s6_1, source.s6_2],
  teaching: {
   intuition: "Near the field coil every point in space feels a push or pull with its own size and direction. A rule that gives an arrow at every point is called a vector field, written F(x, y, z) = ⟨P, Q, R⟩, where P, Q and R are three formulas in x, y and z. To read the arrow at one point, put that point’s coordinates into all three formulas. The second idea is adding up along a curve. A cable whose density ρ (kilograms per metre) changes along it cannot be weighed by density times length. Instead, cut it into tiny pieces of length ds, weigh each piece as ρ ds, and add them all: that sum is the line integral of ρ along the cable, written ∫_C ρ ds. To work it out, describe the cable as a path r(t), as in the motion missions. While t changes by dt, the point moves a distance ‖r′(t)‖ dt, its speed times the time, so ds = ‖r′(t)‖ dt and the mass is the ordinary integral of ρ(r(t)) × ‖r′(t)‖ over the range of t. A straight cable from a start point to an end point is r(t) = start + t × (end − start) with t from 0 to 1.",
   steps: [
    "To read a vector field at a point, put the point’s x, y and z into each component.",
    "Describe the curve as a path r(t): for a straight cable, start + t × (end − start) with t from 0 to 1.",
    "Work out r′(t) and its length ‖r′(t)‖, so that ds = ‖r′(t)‖ dt.",
    "Put the path into the density to get ρ(r(t)), a formula in t alone.",
    "Integrate ρ(r(t)) × ‖r′(t)‖ over the range of t. The result is the mass."
   ],
   example: {
    prompt: "F(x, y, z) = ⟨z, 2x, y⟩. Find F at (1, 4, 2). Then a cable runs straight from (0, 0, 0) to (2, 1, 2) with density ρ = 1 + 2z kilograms per metre: find its mass.",
    steps: [
     "F(1, 4, 2) = ⟨2, 2 × 1, 4⟩ = ⟨2, 2, 4⟩.",
     "The cable is r(t) = ⟨2t, t, 2t⟩ for t from 0 to 1, so r′(t) = ⟨2, 1, 2⟩ and ‖r′(t)‖ = √(4 + 1 + 4) = 3.",
     "Along the cable z = 2t, so ρ(r(t)) = 1 + 4t.",
     "The mass is the integral of (1 + 4t) × 3 from 0 to 1: 3 × (1 + 2) = 9."
    ],
    answer: "F(1, 4, 2) = ⟨2, 2, 4⟩, and the cable’s mass is 9 kilograms."
   },
   pitfalls: [
    "Forgetting the factor ‖r′(t)‖. Integrating ρ(r(t)) dt alone measures along t, not along the cable, and gives the wrong mass whenever the speed is not 1.",
    "Using the density at one end for the whole cable. When ρ changes along the cable, the mass needs the integral.",
    "Putting the coordinates into the wrong component of F, for example x where the formula has y."
   ]
  },
  guidance: [
   { prompt: "Put x = 3, y = 1 and z = 2 into F(x, y, z) = ⟨2y, x + 3z, xy⟩. What are its three components?", answer: [2,9,3], labels: ["F x-part (N)","F y-part (N)","F z-part (N)"], explanation: "2 × 1 = 2, 3 + 3 × 2 = 9 and 3 × 1 = 3." },
   { prompt: "The cable is r(t) = ⟨3 + 2t, 1 + 3t, 2 + 6t⟩ for t from 0 to 1. What is its speed ‖r′(t)‖, the length of r′(t) = ⟨2, 3, 6⟩?", answer: [7], labels: ["‖r′(t)‖"], explanation: "‖r′(t)‖ = √(4 + 9 + 36) = √49 = 7. It is the same for every t, and it is also the cable’s length, because t runs over an interval of length 1." },
   { prompt: "Along the cable z = 2 + 6t. Write the density there as ρ(r(t)) = A + Bt. What are A and B?", answer: [4,6], labels: ["A (kg/m)","B (kg/m)"], explanation: "ρ = 2 + z with z = 2 + 6t gives 4 + 6t, so A = 4 and B = 6." },
   { prompt: "The mass is 7 × (the integral of 4 + 6t from t = 0 to t = 1). What is it, in kilograms?", answer: [49], labels: ["mass (kg)"], explanation: "The integral of A + Bt from 0 to 1 is A + B ÷ 2 = 4 + 3 = 7. Times 7, the mass is 49 kilograms." }
  ]
 },
 {
  id: 'q32', title: "The winch that drags the cart", topic: "Work along a path: line integrals of a field", tier: 'Advanced', sector: 'Cable Yard',
  brief: "The yard winch drags carts along tracks of different shapes, and the power crew wants to know how much energy one trip costs.",
  lesson: "The work a force field does along a path is the line integral ∫_C F · dr, worked out as the integral of F(r(t)) · r′(t) dt.",
  prompt: "A winch drags a cart across the cable yard. The force on the cart is the force field F(x, y) = ⟨2y + 4, 3x⟩ newtons, with x and y in metres, and the cart follows the curved track r(t) = ⟨t, t²⟩ from t = 0 to t = 3. Enter the work the force does on the cart over the whole track, in joules.",
  answer: [84], labels: ["work (J)"], tolerance: 0.01,
  hints: [
   "Work along a path is the line integral of F(r(t)) · r′(t) dt: put the path into the force, then take the dot product with the velocity r′(t).",
   "The dot product comes out as a polynomial in t. Integrate it term by term from t = 0 to the end time."
  ],
  solution: "On the track x = t and y = t², so F(r(t)) = ⟨2t² + 4, 3t⟩ and r′(t) = ⟨1, 2t⟩. Their dot product is (2t² + 4) × 1 + 3t × 2t = 4 + 8t². The work is the integral of 4 + 8t² from t = 0 to t = 3: 4 × 3 + 8 × 3³ ÷ 3 = 12 + 72 = 84 joules.",
  xp: 200, prereqs: ["q31","q05"],
  artifact: { name: "Winch energy log", description: "One trip’s work, added up a tiny step at a time along a curving track." },
  sources: [source.s6_2],
  teaching: {
   intuition: "For a constant force and a straight move, work is the dot product force · displacement. A winch’s force field changes from place to place, and the cart’s track may curve, so we cut the trip into tiny steps. Over a tiny step dr the force is nearly constant, and the work is F · dr. Adding all the steps gives the line integral of F along the path, written ∫_C F · dr. With the path written as r(t), a tiny step is dr = r′(t) dt, so the work is the ordinary integral of F(r(t)) · r′(t) over the range of t. Only the part of the force along the direction of motion does work: a force at right angles to the track does none, and a force against the motion does negative work.",
   steps: [
    "Write the path as r(t) = ⟨x(t), y(t)⟩ and note the range of t.",
    "Put x(t) and y(t) into the force field to get F(r(t)), a vector whose parts are formulas in t.",
    "Work out the velocity r′(t).",
    "Take the dot product F(r(t)) · r′(t): multiply matching parts and add.",
    "Integrate that formula over the range of t. Newtons times metres gives joules."
   ],
   example: {
    prompt: "A force F(x, y) = ⟨y, 2x⟩ newtons pushes a cart along the straight track r(t) = ⟨t, 2t⟩ from t = 0 to t = 2. Find the work.",
    steps: [
     "On the track x = t and y = 2t, so F(r(t)) = ⟨2t, 2t⟩.",
     "r′(t) = ⟨1, 2⟩, so F(r(t)) · r′(t) = 2t × 1 + 2t × 2 = 6t.",
     "The integral of 6t from 0 to 2 is 3 × 2² = 12."
    ],
    answer: "12 joules."
   },
   pitfalls: [
    "Leaving x and y in the force. Put the path in first, so everything is a formula in t before you integrate.",
    "Using the speed ‖r′(t)‖ instead of the vector r′(t). Work needs the dot product with r′(t), which keeps only the part of the force along the motion.",
    "Integrating over the wrong range: the limits are the start and end values of t, not of x or y."
   ]
  },
  guidance: [
   { prompt: "The track ends at r(3) = (3, 9). What are the two components of the force F there?", answer: [22,9], labels: ["F x-part (N)","F y-part (N)"], explanation: "F(3, 9) = ⟨2 × 9 + 4, 3 × 3⟩ = ⟨22, 9⟩. The force changes along the track, which is why the work needs an integral." },
   { prompt: "Put the track into F and take the dot product with r′(t) = ⟨1, 2t⟩. Written as A + Bt², what are A and B?", answer: [4,8], labels: ["A","B"], explanation: "F(r(t)) = ⟨2t² + 4, 3t⟩, and the dot product is (2t² + 4) × 1 + 3t × 2t = 4 + 8t², so A = 4 and B = 8." },
   { prompt: "Integrate 4 + 8t² from t = 0 to t = 3. What is the work, in joules?", answer: [84], labels: ["work (J)"], explanation: "4 × 3 + 8 × 3³ ÷ 3 = 12 + 72 = 84 joules." }
  ]
 },
 {
  id: 'q33', title: "Two winches, one shortcut", topic: "Conservative fields and potential functions", tier: 'Advanced', sector: 'Cable Yard',
  brief: "Two winches can haul a cart along a winding track, and Mira suspects one of them makes the twists of the track irrelevant.",
  lesson: "A field is conservative when it is the gradient of a potential function φ; then the work along any path is φ(end) − φ(start). In the plane, ⟨P, Q⟩ is conservative when ∂P/∂y = ∂Q/∂x.",
  prompt: "Two winches in the cable yard pull with the force fields F(x, y) = ⟨4x + y, 3x + 2y⟩ and G(x, y) = ⟨2x + 3y, 3x + 4y⟩ newtons, with x and y in metres. Exactly one of them is conservative. Enter 1 if F is conservative and 0 if it is not, then the same for G. Then the conservative one hauls a cart along a winding track from (1, 0) to (2, 3): enter the work it does, in joules.",
  answer: [0,1,39], labels: ["F conservative (1 or 0)","G conservative (1 or 0)","work (J)"], tolerance: 0.01,
  hints: [
   "A field ⟨P, Q⟩ in the plane is conservative when ∂P/∂y = ∂Q/∂x everywhere. Compare the two for each field.",
   "For the conservative field find a potential function φ with ∂φ/∂x = P and ∂φ/∂y = Q. The work from one point to another along any path is φ at the end minus φ at the start."
  ],
  solution: "For F, ∂P/∂y = 1 and ∂Q/∂x = 3; for G, ∂P/∂y = 3 and ∂Q/∂x = 3. So G is conservative and F is not. A potential function for G is φ(x, y) = x² + 3xy + 2y²: its partial derivatives are 2x + 3y and 3x + 4y. Then φ(2, 3) = 40 and φ(1, 0) = 1, so the work is 40 − 1 = 39 joules, whatever shape the track has.",
  xp: 200, prereqs: ["q32","q19"],
  artifact: { name: "Potential map of the yard", description: "One number per spot, and the work between any two spots read straight off it." },
  sources: [source.s6_3],
  teaching: {
   intuition: "Some force fields are the gradient of a single function: F = ∇φ, so P = ∂φ/∂x and Q = ∂φ/∂y. Such a field is called a conservative field, and φ is its potential function. For these fields the work along a path does not depend on the path at all: it is φ at the end minus φ at the start, however the track winds. That is the fundamental theorem for line integrals, and it is the same idea as integrating a derivative in Calculus 1. A quick test tells you whether a field ⟨P, Q⟩ in the plane can be conservative: if F = ∇φ, then ∂P/∂y and ∂Q/∂x are both the mixed second partial of φ, so they must be equal. For fields defined everywhere in the plane, as here, equal cross partials ∂P/∂y = ∂Q/∂x are also enough. Each 0 or 1 you enter says whether the test passes: 1 for conservative, 0 for not.",
   steps: [
    "For each field ⟨P, Q⟩, work out ∂P/∂y and ∂Q/∂x. Equal everywhere means conservative (enter 1); different means not (enter 0).",
    "For the conservative field, find φ: integrate P in x, then choose the part that depends on y alone so that ∂φ/∂y = Q.",
    "Check your φ by taking both partial derivatives and comparing with P and Q.",
    "The work from A to B along any path is φ(B) − φ(A)."
   ],
   example: {
    prompt: "Is F(x, y) = ⟨2x + y, x⟩ conservative? If so, find the work it does from (0, 0) to (1, 2).",
    steps: [
     "∂P/∂y = 1 and ∂Q/∂x = 1. They are equal, so F is conservative.",
     "Integrating 2x + y in x gives x² + xy, and its y-derivative is x, which is Q. So φ = x² + xy.",
     "The work is φ(1, 2) − φ(0, 0) = 1 + 2 − 0 = 3."
    ],
    answer: "Yes, F is conservative, and the work is 3 joules along any path."
   },
   pitfalls: [
    "Comparing ∂P/∂x with ∂Q/∂y. The test crosses over: the y-rate of the first component against the x-rate of the second.",
    "Using φ(B) − φ(A) for a field that is not conservative. Then the work depends on the path and needs the full line integral.",
    "Subtracting in the wrong order. The work is φ at the end minus φ at the start."
   ]
  },
  guidance: [
   { prompt: "For F(x, y) = ⟨4x + y, 3x + 2y⟩, what are ∂P/∂y (the y-rate of the first component) and ∂Q/∂x (the x-rate of the second)?", answer: [1,3], labels: ["∂P/∂y","∂Q/∂x"], explanation: "∂P/∂y = 1 and ∂Q/∂x = 3. They differ, so F is not conservative." },
   { prompt: "Now for G(x, y) = ⟨2x + 3y, 3x + 4y⟩: what are ∂P/∂y and ∂Q/∂x?", answer: [3,3], labels: ["∂P/∂y","∂Q/∂x"], explanation: "∂P/∂y = 3 and ∂Q/∂x = 3. They are equal, so G is conservative." },
   { prompt: "G has a potential function of the form φ(x, y) = αx² + βxy + γy². What are α, β and γ?", answer: [1,3,2], labels: ["α","β","γ"], explanation: "∂φ/∂x = 2αx + βy must be 2x + 3y and ∂φ/∂y = βx + 2γy must be 3x + 4y, so α = 1, β = 3 and γ = 2." },
   { prompt: "With φ(x, y) = x² + 3xy + 2y², what is the work φ(2, 3) − φ(1, 0), in joules?", answer: [39], labels: ["work (J)"], explanation: "φ(2, 3) = 40 and φ(1, 0) = 1, so the work is 40 − 1 = 39 joules." }
  ]
 },
 {
  id: 'q34', title: "A lap of the cable yard", topic: "Green’s theorem", tier: 'Advanced', sector: 'Cable Yard',
  brief: "A survey cart is about to run a lap of the yard fence, and Mira wants its net work worked out without tracking all four sides.",
  lesson: "Green’s theorem: the circulation of F = ⟨P, Q⟩ anticlockwise round a closed curve equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside.",
  prompt: "A cable cart runs once round the rectangular yard with corners (1, 0), (3, 0), (3, 2) and (1, 2), in that order, which is anticlockwise. The force on it is F(x, y) = ⟨2xy − 3y, 2x² + x⟩ newtons, with x and y in metres. Use Green’s theorem to find the circulation of F round the yard: the work F does on the cart over one full lap. Enter it in joules.",
  answer: [32], labels: ["circulation (J)"], tolerance: 0.01,
  hints: [
   "Green’s theorem: for F = ⟨P, Q⟩ round a closed curve travelled anticlockwise, the circulation equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside.",
   "Work out ∂Q/∂x − ∂P/∂y first. Integrate it over the rectangle with x and y running between the corners’ values."
  ],
  solution: "Here P = 2xy − 3y and Q = 2x² + x. ∂Q/∂x = 4x + 1 and ∂P/∂y = 2x − 3, so ∂Q/∂x − ∂P/∂y = 2x + 4. Green’s theorem turns the lap into the double integral of 2x + 4 over the yard, which is 2 m by 2 m with area 4. The constant 4 gives 4 × 4 = 16. The term 2x gives 2 × 2 × (3² − 1²) ÷ 2 = 16. The circulation is 16 + 16 = 32 joules.",
  xp: 200, prereqs: ["q33","q25"],
  artifact: { name: "Fence-lap ledger", description: "Four sides of a lap traded for one double integral over the yard." },
  sources: [source.s6_4],
  teaching: {
   intuition: "A path that ends where it starts is a closed curve, and the work a field does round it is called the circulation, written ∮_C F · dr. For a conservative field it is always 0, because you come back to the same potential. For other fields it measures how much the field swirls along the loop. Green’s theorem says that instead of working along the loop, you can add up the swirl inside it: for F = ⟨P, Q⟩ and a closed curve travelled anticlockwise (with the region on your left), ∮_C F · dr equals the double integral of ∂Q/∂x − ∂P/∂y over the region the curve encloses. The quantity ∂Q/∂x − ∂P/∂y is the local swirl at each point. Inside the region the swirls of neighbouring patches cancel along their shared edges, and only the boundary is left. That is why the two sides are equal.",
   steps: [
    "Check the curve is closed and travelled anticlockwise. Clockwise flips the sign.",
    "Work out ∂Q/∂x and ∂P/∂y, and subtract: ∂Q/∂x − ∂P/∂y.",
    "Set up the double integral of that over the region inside the curve; for a rectangle the limits are the corners’ x and y values.",
    "Integrate in one variable, then the other. The result is the circulation."
   ],
   example: {
    prompt: "F(x, y) = ⟨−y, x⟩. Find its circulation anticlockwise round the rectangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 3.",
    steps: [
     "∂Q/∂x = 1 and ∂P/∂y = −1, so ∂Q/∂x − ∂P/∂y = 2 everywhere.",
     "The rectangle’s area is 2 × 3 = 6, so the double integral is 2 × 6 = 12."
    ],
    answer: "The circulation is 12."
   },
   pitfalls: [
    "Subtracting the wrong way round: it is ∂Q/∂x − ∂P/∂y, the x-rate of the second component minus the y-rate of the first.",
    "Ignoring the direction. Green’s theorem as stated is for anticlockwise travel; going clockwise gives the negative.",
    "Treating a term in x as a constant over the rectangle. A term like 3x has to be integrated, not multiplied by the area."
   ]
  },
  guidance: [
   { prompt: "Work out ∂Q/∂x for Q = 2x² + x and ∂P/∂y for P = 2xy − 3y. Their difference ∂Q/∂x − ∂P/∂y has the form mx + k: what are m and k?", answer: [2,4], labels: ["m","k"], explanation: "∂Q/∂x = 4x + 1 and ∂P/∂y = 2x − 3. Subtracting gives 2x + 4, so m = 2 and k = 4." },
   { prompt: "The yard runs from x = 1 to 3 and from y = 0 to 2. What is the integral of the constant 4 over it, and the integral of 2x over it?", answer: [16,16], labels: ["constant part","x part"], explanation: "The area is 2 × 2 = 4, so the constant gives 16. For 2x, integrate in y first (a factor 2), then in x: 2 × 2 × (9 − 1) ÷ 2 = 16." },
   { prompt: "Add the two parts. What is the circulation round the yard, in joules?", answer: [32], labels: ["circulation (J)"], explanation: "16 + 16 = 32 joules: the work done by F over one anticlockwise lap." }
  ]
 },
 {
  id: 'q35', title: "Spread and swirl in the mixing chamber", topic: "Divergence and curl", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "The mixing chamber should both spread fresh air out and stir it, and the plant engineers want both measured at one sampling point.",
  lesson: "For F = ⟨P, Q, R⟩, div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z measures spreading out, and curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩ measures swirl.",
  prompt: "The atmosphere plant blows air through a mixing chamber with velocity field F(x, y, z) = ⟨2xy + 3z, y² + 2xz, xz + 4y⟩ metres per second, with x, y and z in metres. Enter div F at the point (1, 2, −1), then the three components of curl F there.",
  answer: [9,2,4,-4], labels: ["div F (1/s)","curl F, x-component (1/s)","curl F, y-component (1/s)","curl F, z-component (1/s)"], tolerance: 0.01,
  hints: [
   "div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. For ∂P/∂x, differentiate P with x as the variable and treat y and z as fixed numbers.",
   "curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. Work out each partial derivative as a formula first, then put in the point."
  ],
  solution: "∂P/∂x = 2y, ∂Q/∂y = 2y and ∂R/∂z = x, so at (1, 2, −1) the divergence is 4 + 4 + 1 = 9. For the curl: ∂R/∂y = 4, ∂Q/∂z = 2x, ∂P/∂z = 3, ∂R/∂x = z, ∂Q/∂x = 2z and ∂P/∂y = 2x. At the point, curl F = ⟨4 − 2, 3 − (−1), −2 − 2⟩ = ⟨2, 4, −4⟩.",
  xp: 200, prereqs: ["q31"],
  artifact: { name: "Chamber probe reading", description: "How much the air spreads and how it spins, at one point." },
  sources: [source.s6_5],
  teaching: {
   intuition: "Two numbers describe what a flow does near a point. The first is the divergence, div F: how much the flow spreads out from the point (positive) or crowds into it (negative). The second is the curl, curl F: a vector whose direction is the axis the flow spins round and whose length says how fast. Both are built from partial derivatives. A partial derivative such as ∂P/∂x is the rate of change of P as x changes while y and z are held fixed: differentiate with x as the variable and treat y and z as fixed numbers. Then div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z, a single number at each point. The curl is curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. Its last component, ∂Q/∂x − ∂P/∂y, measures the spin about the z-axis, seen in the flat xy-directions; the other two are the same idea about the x-axis and the y-axis.",
   steps: [
    "Name the three components: P, Q and R.",
    "Work out the partial derivatives you need as formulas: for each, differentiate in one letter and hold the other two fixed.",
    "Divergence: add ∂P/∂x, ∂Q/∂y and ∂R/∂z, then put in the point.",
    "Curl: build ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩, then put in the point."
   ],
   example: {
    prompt: "F(x, y, z) = ⟨xz, yz, xy⟩. Find div F and curl F at (2, 1, 3).",
    steps: [
     "div F = ∂(xz)/∂x + ∂(yz)/∂y + ∂(xy)/∂z = z + z + 0 = 2z, which is 6 at the point.",
     "curl F = ⟨∂(xy)/∂y − ∂(yz)/∂z, ∂(xz)/∂z − ∂(xy)/∂x, ∂(yz)/∂x − ∂(xz)/∂y⟩ = ⟨x − y, x − y, 0⟩.",
     "At (2, 1, 3) that is ⟨1, 1, 0⟩."
    ],
    answer: "div F = 6 and curl F = ⟨1, 1, 0⟩."
   },
   pitfalls: [
    "Adding the wrong partials for the divergence: it is the x-rate of P, the y-rate of Q and the z-rate of R, each component with its own letter.",
    "Mixing up the order in a curl component. The first is ∂R/∂y − ∂Q/∂z, not ∂Q/∂z − ∂R/∂y.",
    "Putting in the point before differentiating. Differentiate the formulas first, then substitute."
   ]
  },
  guidance: [
   { prompt: "At (1, 2, −1), what are ∂P/∂x, ∂Q/∂y and ∂R/∂z?", answer: [4,4,1], labels: ["∂P/∂x","∂Q/∂y","∂R/∂z"], explanation: "∂P/∂x = 2y = 4, ∂Q/∂y = 2y = 4 and ∂R/∂z = x = 1." },
   { prompt: "Add them. What is div F at (1, 2, −1)?", answer: [9], labels: ["div F (1/s)"], explanation: "4 + 4 + 1 = 9. It is positive, so air spreads out from this point." },
   { prompt: "For the first component of the curl you need ∂R/∂y and ∂Q/∂z. What are they at (1, 2, −1)?", answer: [4,2], labels: ["∂R/∂y","∂Q/∂z"], explanation: "∂R/∂y = 4 (only the 4y term has a y) and ∂Q/∂z = 2x = 2." },
   { prompt: "What are the three components of curl F at (1, 2, −1)?", answer: [2,4,-4], labels: ["curl x","curl y","curl z"], explanation: "⟨4 − 2, 3 − (−1), −2 − 2⟩ = ⟨2, 4, −4⟩." }
  ]
 },
 {
  id: 'q36', title: "Cladding the air duct", topic: "Parametrised surfaces and surface area", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "The workshop is cutting curved panels to clad a round air duct and needs the area of each one to order the sheet metal.",
  lesson: "A parametrised surface r(u, v) has surface area equal to the double integral of ‖r_u × r_v‖ over its parameter region.",
  prompt: "A curved wall panel for an air duct is the piece of the cylinder of radius 3 m given by the parametrised surface r(θ, z) = ⟨3 cos θ, 3 sin θ, z⟩ for θ from 0 to π and z from 0 to 4. It goes half way round the duct and is 4 m tall. Enter the length of r_θ × r_z, then the panel’s surface area as k in k·π square metres: enter k.",
  answer: [3,12], labels: ["‖r_θ × r_z‖ (m)","k in k·π (m²)"], tolerance: 0.01,
  hints: [
   "r_θ is the derivative of r in θ with z held fixed, and r_z the derivative in z with θ held fixed. Take their cross product and its length, using cos²θ + sin²θ = 1.",
   "The surface area is the double integral of ‖r_θ × r_z‖ over the rectangle of parameter values: θ across its range and z across its range."
  ],
  solution: "r_θ = ⟨−3 sin θ, 3 cos θ, 0⟩ and r_z = ⟨0, 0, 1⟩. Their cross product is ⟨3 cos θ × 1 − 0 × 0, 0 × 0 − (−3 sin θ) × 1, 0⟩ = ⟨3 cos θ, 3 sin θ, 0⟩, and its length is √(9 cos²θ + 9 sin²θ) = √9 = 3. The area is the integral of 3 over θ from 0 to π and z from 0 to 4: 3 × π × 4 = 12π square metres, so k = 12.",
  xp: 200, prereqs: ["q06","q24"],
  artifact: { name: "Duct panel template", description: "A curved sheet unrolled into a flat rectangle of the right size." },
  sources: [source.s6_6],
  teaching: {
   intuition: "A curve in space needs one parameter, t. A surface needs two. A parametrised surface is a rule r(u, v) that sends each pair of numbers (u, v) in a flat region to a point in space. A round duct wall of radius R is r(θ, z) = ⟨R cos θ, R sin θ, z⟩: θ is the angle round the duct in radians and z the height. Now take a tiny rectangle of parameters, of size du by dv. Moving u a little moves the point along r_u du, where r_u is the partial derivative of r in u (v held fixed); moving v moves it along r_v dv. So the tiny rectangle becomes a tiny parallelogram on the surface with those two sides. A parallelogram’s area is the length of the cross product of its sides, so the patch has area ‖r_u × r_v‖ du dv. The surface area is the double integral of ‖r_u × r_v‖ over the parameter region. The cross product r_u × r_v also points straight out of the surface: it is a normal vector, which the next mission uses.",
   steps: [
    "Write the surface as r(u, v) and note the range of each parameter.",
    "Differentiate in each parameter: r_u with v held fixed, r_v with u held fixed.",
    "Take the cross product r_u × r_v and its length ‖r_u × r_v‖; simplify with cos² + sin² = 1 where it appears.",
    "Integrate ‖r_u × r_v‖ over the parameter region. The result is the surface area."
   ],
   example: {
    prompt: "A duct wall of radius 2 m goes all the way round (θ from 0 to 2π) and is 5 m tall. Find its area.",
    steps: [
     "r(θ, z) = ⟨2 cos θ, 2 sin θ, z⟩, so r_θ = ⟨−2 sin θ, 2 cos θ, 0⟩ and r_z = ⟨0, 0, 1⟩.",
     "r_θ × r_z = ⟨2 cos θ, 2 sin θ, 0⟩, whose length is √(4 cos²θ + 4 sin²θ) = 2.",
     "The area is the integral of 2 over θ from 0 to 2π and z from 0 to 5: 2 × 2π × 5 = 20π."
    ],
    answer: "20π square metres: the circumference 4π times the height 5, as unrolling the wall would give."
   },
   pitfalls: [
    "Integrating 1 instead of ‖r_u × r_v‖. The parameter rectangle is stretched when it is laid on the surface, and the length of the cross product is the stretch.",
    "Mixing degrees and radians. The angle θ runs in radians, so half way round is π, not 180.",
    "Forgetting that the length of a cross product is always positive, even when its components are negative."
   ]
  },
  guidance: [
   { prompt: "At θ = 0, r_θ = ⟨0, 3, 0⟩ and r_z = ⟨0, 0, 1⟩. What are the three components of r_θ × r_z there?", answer: [3,0,0], labels: ["x-component","y-component","z-component"], explanation: "⟨3 × 1 − 0 × 0, 0 × 0 − 0 × 1, 0 × 0 − 3 × 0⟩ = ⟨3, 0, 0⟩. It points straight out of the wall, as a normal vector should." },
   { prompt: "For any θ, r_θ × r_z = ⟨3 cos θ, 3 sin θ, 0⟩. What is its length?", answer: [3], labels: ["‖r_θ × r_z‖ (m)"], explanation: "√(9 cos²θ + 9 sin²θ) = √9 = 3, because cos²θ + sin²θ = 1. Each small patch of parameters is stretched by the same factor 3." },
   { prompt: "Integrate 3 over θ from 0 to π and z from 0 to 4. Writing the area as kπ, what is k?", answer: [12], labels: ["k in k·π"], explanation: "3 × π × 4 = 12π, so k = 12." }
  ]
 },
 {
  id: 'q37', title: "Air through the sloping filter", topic: "Flux through a surface", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "A sloping filter has been fitted in the plant’s main duct, and the crew need to know how much air it passes each second.",
  lesson: "The flux of F through an oriented surface r(u, v) is the double integral of F(r(u, v)) · N, with N = r_u × r_v pointing the chosen way.",
  prompt: "A sloping air filter in the plant is the surface z = x + 2y + 3 over the rectangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 1, in metres. Air moves through it with velocity F(x, y, z) = ⟨2, −1, z⟩ metres per second. Parametrise the filter as r(x, y) = ⟨x, y, x + 2y + 3⟩ and give it the upward orientation, N = r_x × r_y. Enter the three components of N, then the flux of F through the filter in that direction, in cubic metres per second.",
  answer: [-1,-2,1,10], labels: ["N, x-component","N, y-component","N, z-component","flux (m³/s)"], tolerance: 0.01,
  hints: [
   "For r(x, y) = ⟨x, y, g(x, y)⟩, r_x = ⟨1, 0, ∂g/∂x⟩ and r_y = ⟨0, 1, ∂g/∂y⟩, so r_x × r_y = ⟨−∂g/∂x, −∂g/∂y, 1⟩, which points upward. Swapping the order flips every sign and points it downward.",
   "The flux is the double integral of F(r(x, y)) · N over the rectangle. Replace z by its formula on the surface before you take the dot product."
  ],
  solution: "r_x = ⟨1, 0, 1⟩ and r_y = ⟨0, 1, 2⟩, so r_x × r_y = ⟨−1, −2, 1⟩, which points upward. That is the orientation asked for, so N = ⟨−1, −2, 1⟩. On the filter z = x + 2y + 3, so F = ⟨2, −1, (x + 2y + 3)⟩ and F · N = 3 + x + 2y. Over the rectangle the constant gives 3 × 2 = 6, the x term gives 1 × 1 × 2² ÷ 2 = 2 and the y term gives 2 × 2 × 1² ÷ 2 = 2. The flux is 6 + 2 + 2 = 10 cubic metres per second.",
  xp: 200, prereqs: ["q36"],
  artifact: { name: "Filter flow gauge", description: "Cubic metres of air through a tilted panel, counted with the right sign." },
  sources: [source.s6_6],
  teaching: {
   intuition: "The flux of a flow through a surface is how much passes through it each second. Only the part of the flow that crosses the surface counts; air sliding along it passes nothing. For a tiny patch with normal vector N = r_u × r_v, whose length is the patch’s area per unit of parameters, F · N du dv is the flow through the patch: the dot product keeps just the crossing part and the length of N supplies the area. So the flux is the double integral of F(r(u, v)) · N over the parameter region. First pick the orientation, the side the flow counts as going towards. Swapping the order of the cross product, r_v × r_u, flips N and changes the sign of the flux. For a surface z = g(x, y) over a region of the plane, use x and y as the parameters: r(x, y) = ⟨x, y, g(x, y)⟩, and r_x × r_y = ⟨−∂g/∂x, −∂g/∂y, 1⟩ points upward.",
   steps: [
    "Parametrise the surface, for a graph as r(x, y) = ⟨x, y, g(x, y)⟩.",
    "Find N = r_x × r_y and check it points the way asked; if not, use r_y × r_x, which flips every sign.",
    "Put the surface into F, replacing z by g(x, y), and take the dot product F · N.",
    "Integrate F · N over the region of x and y. The result is the flux, positive when the flow goes the way N points."
   ],
   example: {
    prompt: "A flat panel lies at height z = 2 over the square 0 ≤ x ≤ 3, 0 ≤ y ≤ 3. Find the upward flux of F = ⟨1, 1, 4⟩ through it.",
    steps: [
     "r(x, y) = ⟨x, y, 2⟩, so r_x = ⟨1, 0, 0⟩, r_y = ⟨0, 1, 0⟩ and N = r_x × r_y = ⟨0, 0, 1⟩, which points up.",
     "F · N = 4 at every point.",
     "The integral of 4 over the square of area 9 is 36."
    ],
    answer: "The upward flux is 36: only the upward part of the flow crosses the flat panel."
   },
   pitfalls: [
    "Leaving z in F · N. On the surface z has a formula in x and y; put it in before integrating.",
    "Ignoring the orientation. The same flow gives a flux of the opposite sign through the other side.",
    "Dividing N by its length. Its length is what turns the parameter area into surface area, so N = r_x × r_y is used as it is."
   ]
  },
  guidance: [
   { prompt: "r_x = ⟨1, 0, 1⟩ and r_y = ⟨0, 1, 2⟩. What are the three components of N = r_x × r_y?", answer: [-1,-2,1], labels: ["N, x-component","N, y-component","N, z-component"], explanation: "r_x × r_y = ⟨−1, −2, 1⟩, with a positive z-component, so it points upward." },
   { prompt: "On the filter z = x + 2y + 3. Write F(r(x, y)) · N as K + Lx + My: what are K, L and M?", answer: [3,1,2], labels: ["K","L","M"], explanation: "F · N = 2 × (−1) + (−1) × (−2) + (x + 2y + 3) × 1 = 3 + x + 2y, so K = 3, L = 1 and M = 2." },
   { prompt: "Integrate 3 + x + 2y over 0 ≤ x ≤ 2, 0 ≤ y ≤ 1. What is the flux, in cubic metres per second?", answer: [10], labels: ["flux (m³/s)"], explanation: "6 + 2 + 2 = 10." }
  ]
 },
 {
  id: 'q38', title: "Swirl round the dome rim", topic: "Stokes’ theorem", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "Air spirals inside the new habitat dome, and Mira wants the circulation round its rim without integrating over the curved shell.",
  lesson: "Stokes’ theorem: the circulation of F round a closed curve equals the flux of curl F through any surface with that curve as its rim, oriented by the right-hand rule.",
  prompt: "The dome over the air exchanger is a half-ball shell of radius 3 m standing on the floor z = 0, so its rim is the circle x² + y² = 9 on the floor. Air circulates with velocity F(x, y, z) = ⟨−2y + 3z, x + z², 2xy⟩ metres per second. Enter the z-component of curl F, then the circulation of F once round the rim, travelled anticlockwise as seen from above, as k in k·π square metres per second: enter k.",
  answer: [3,27], labels: ["z-component of curl F (1/s)","k in k·π (m²/s)"], tolerance: 0.01,
  hints: [
   "curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. A flat floor disc has normal ⟨0, 0, 1⟩ or ⟨0, 0, −1⟩, so only the z-component of the curl matters on it.",
   "Stokes’ theorem: the circulation round the rim equals the flux of curl F through any surface with that rim, such as the floor disc, when the surface’s normal matches the direction of travel. The right-hand rule gives that normal: curl the fingers of your right hand the way you travel round the rim, and your thumb points along it."
  ],
  solution: "∂Q/∂x = 1 and ∂P/∂y = −2, so the z-component of curl F is 1 − (−2) = 3. (The other components, 2x − 2z and 3 − 2y, do not matter on the floor.) By Stokes’ theorem the circulation round the rim equals the flux of curl F through any surface with that rim whose normal matches the direction of travel, so use the flat floor disc instead of the shell. Travelling anticlockwise goes with the upward normal ⟨0, 0, 1⟩, so curl F · N = 3 everywhere on the disc. The disc’s area is 9π, so the circulation is 3 × 9π = 27π and k = 27.",
  xp: 200, prereqs: ["q35","q37"],
  artifact: { name: "Rim circulation card", description: "A curved dome swapped for a flat floor with the same rim." },
  sources: [source.s6_7],
  teaching: {
   intuition: "The circulation of a flow round a closed curve is the work it does over one lap, ∮_C F · dr. Stokes’ theorem says you can get it from the swirl over a surface instead of from the loop. If S is a surface whose edge (its rim) is the closed curve C, then the circulation ∮_C F · dr equals the flux of curl F through S. The curl measures the swirl at each point, the flux adds up the part of that swirl around the surface’s normal, and inside the surface neighbouring swirls cancel, leaving only the rim. The direction round the rim and the normal must match by the right-hand rule: curl the fingers of your right hand the way you travel round the rim, and your thumb points along the normal. Anticlockwise seen from above goes with an upward normal. Because only the rim matters, any surface with the same rim, with its normal matched to the same direction of travel, gives the same flux of the curl; the opposite normal gives the same size with the opposite sign. So a curved dome may be swapped for the flat floor disc under it, where the normal is ⟨0, 0, 1⟩ and only the z-component of curl F matters.",
   steps: [
    "Identify the rim C and the direction of travel round it.",
    "Choose the easiest surface with that rim, often a flat disc, and the normal that matches the direction by the right-hand rule.",
    "Work out curl F, or only the component along that normal.",
    "Take the flux of curl F through the chosen surface. That number is the circulation round the rim."
   ],
   example: {
    prompt: "F(x, y, z) = ⟨−y, x, z⟩. Find its circulation anticlockwise (seen from above) round the circle x² + y² = 4 on the floor z = 0.",
    steps: [
     "The z-component of curl F is ∂Q/∂x − ∂P/∂y = 1 − (−1) = 2.",
     "Use the floor disc of radius 2 with the upward normal ⟨0, 0, 1⟩: curl F · N = 2 everywhere.",
     "The flux of the curl is 2 × the area 4π = 8π."
    ],
    answer: "The circulation is 8π."
   },
   pitfalls: [
    "Pairing the direction with the wrong normal. Anticlockwise seen from above goes with upward; clockwise with downward, which flips the sign.",
    "Using all three components of curl F on a flat floor disc. Its normal is ⟨0, 0, 1⟩, so only the z-component counts there.",
    "Thinking the curved shell needs its own integral. Any surface with the same rim, oriented to match the same direction of travel, gives the same answer."
   ]
  },
  guidance: [
   { prompt: "For P = −2y + 3z and Q = x + z², what are ∂Q/∂x and ∂P/∂y?", answer: [1,-2], labels: ["∂Q/∂x","∂P/∂y"], explanation: "∂Q/∂x = 1, since z² does not change with x, and ∂P/∂y = −2." },
   { prompt: "What is the z-component of curl F, ∂Q/∂x − ∂P/∂y?", answer: [3], labels: ["curl z (1/s)"], explanation: "1 − (−2) = 3. It is the same at every point." },
   { prompt: "The rim is travelled anticlockwise seen from above. Enter the z-component of the floor disc’s normal that goes with it: 1 for upward, −1 for downward.", answer: [1], labels: ["normal z (1 or −1)"], explanation: "Anticlockwise seen from above goes with the upward normal, by the right-hand rule: curl the fingers of your right hand along the rim and your thumb points up." },
   { prompt: "The floor disc has area 9π. Writing the circulation as kπ, what is k?", answer: [27], labels: ["k in k·π"], explanation: "curl F · N = 3 on the whole disc, so the flux of the curl is 3 × 9π = 27π, and so is the circulation." }
  ]
 },
 {
  id: 'q39', title: "Air out of the exchanger box", topic: "The divergence theorem", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "The air exchanger chamber is a closed box, and the crew want the total air leaving through its six walls without measuring each one.",
  lesson: "The divergence theorem: the outward flux of F through a closed surface equals the triple integral of div F over the solid inside.",
  prompt: "An air exchanger chamber is the box 0 ≤ x ≤ 3, 0 ≤ y ≤ 2, 0 ≤ z ≤ 2, in metres. Air moves with velocity F(x, y, z) = ⟨2x + y², y + xz, z²⟩ metres per second. Enter div F at the top corner (3, 2, 2), then the total flux of F out through the six walls of the box, in cubic metres per second.",
  answer: [7,60], labels: ["div F at the corner (1/s)","flux out (m³/s)"], tolerance: 0.01,
  hints: [
   "div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. Here it depends only on the height z.",
   "The divergence theorem: the flux out through the closed surface of the box equals the triple integral of div F over the inside. Integrate in z, then multiply by the area of the floor."
  ],
  solution: "∂P/∂x = 2, ∂Q/∂y = 1 and ∂R/∂z = 2z, so div F = 3 + 2z; at the top corner, where z = 2, it is 3 + 4 = 7. By the divergence theorem the flux out through the six walls is the triple integral of div F over the box. The box has volume 3 × 2 × 2 = 12, so the constant 3 gives 36. The 2z part gives 3 × 2 × 1 × 2² = 24, since the integral of 2z from 0 to 2 is 1 × 2². The flux out is 36 + 24 = 60 cubic metres per second.",
  xp: 200, prereqs: ["q35","q37","q27"],
  artifact: { name: "Exchanger balance sheet", description: "Six walls of outflow replaced by one sum over the inside." },
  sources: [source.s6_8],
  teaching: {
   intuition: "A closed surface, like the six walls of a box or the skin of a ball, has an inside and an outside, and we orient it with the normal pointing out. The divergence div F says how much the flow spreads out at each point, per unit of volume. If every little bit of the inside makes air spread out, that air has to leave through the walls. So the total outward flux through the closed surface equals the triple integral of div F over the solid inside. That is the divergence theorem. It turns six separate flux integrals, one per wall of a box, into a single triple integral, which is often much easier, especially when div F is simple.",
   steps: [
    "Check the surface is closed and the flux wanted is outward.",
    "Work out div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z.",
    "Set up the triple integral of div F over the solid inside; for a box the limits are its edges.",
    "Integrate. The result is the outward flux through the whole closed surface."
   ],
   example: {
    prompt: "Find the flux of F(x, y, z) = ⟨x, y, z⟩ out of the cube 0 ≤ x, y, z ≤ 2.",
    steps: [
     "div F = 1 + 1 + 1 = 3 everywhere.",
     "The cube’s volume is 2 × 2 × 2 = 8, so the triple integral of 3 is 3 × 8 = 24."
    ],
    answer: "The outward flux is 24."
   },
   pitfalls: [
    "Using the theorem on a surface that is not closed, such as an open-topped box. The theorem needs every wall.",
    "Treating a divergence that depends on position as a constant. A term like 2z has to be integrated over the height.",
    "Getting the sign of the flux wrong: the theorem gives the flux out, with the normal pointing away from the inside."
   ]
  },
  guidance: [
   { prompt: "What are ∂P/∂x and ∂Q/∂y, and ∂R/∂z at the top corner, where z = 2?", answer: [2,1,4], labels: ["∂P/∂x","∂Q/∂y","∂R/∂z"], explanation: "∂P/∂x = 2 (y² does not change with x), ∂Q/∂y = 1 (xz does not change with y) and ∂R/∂z = 2z = 4 at z = 2." },
   { prompt: "What is div F at the top corner (3, 2, 2)?", answer: [7], labels: ["div F (1/s)"], explanation: "2 + 1 + 4 = 7." },
   { prompt: "div F = 3 + 2z. What is the box’s volume, and the triple integral of the constant 3 over it?", answer: [12,36], labels: ["volume (m³)","constant part"], explanation: "The volume is 3 × 2 × 2 = 12, so the constant gives 3 × 12 = 36." },
   { prompt: "Add the 2z part. What is the total flux out of the box?", answer: [60], labels: ["flux out (m³/s)"], explanation: "The 2z part is 3 × 2 × 1 × 2² = 24, so the flux out is 36 + 24 = 60 cubic metres per second." }
  ]
 },
 {
  id: 'q40', title: "Breathing of the habitat dome", topic: "Realm review and bridge to Differential equations", tier: 'Advanced', sector: 'Atmosphere Plant',
  brief: "Before the atmosphere plant is signed off, Mira wants one last set of readings from the dome: heat, swirl and the air it breathes out.",
  lesson: "Gradients give rates in a direction, Stokes’ theorem swaps a surface for any other with the same rim oriented the same way, and the divergence theorem turns outflow into the spread inside; a rate of change set by a formula is a differential equation.",
  prompt: "A last check of the atmosphere plant. The dome is a half-ball shell of radius 3 m standing on the floor z = 0. First, the temperature inside is T(x, y, z) = x² + 3y + 2z degrees Celsius, with x, y and z in metres; the gradient is ∇T = ⟨∂T/∂x, ∂T/∂y, ∂T/∂z⟩, and the rate of change of T in the direction of a unit vector u is ∇T · u. A sensor drone at (2, 1, 1) sets off in the direction u = ⟨2/3, 1/3, 2/3⟩: enter the rate at which the temperature changes, in °C per metre. Second, the air moves with velocity F(x, y, z) = ⟨2x − y, x + y, 3z⟩ metres per second. Enter the flux of curl F up and out through the dome’s shell, as k in k·π. Third, enter the rate at which air leaves the dome through its shell, in cubic metres per second, as k in k·π (type k without commas).",
  answer: [5,18,108], labels: ["temperature rate (°C/m)","k for the flux of curl F","k for the air leaving (m³/s)"], tolerance: 0.01,
  hints: [
   "Work out the three partial derivatives of T, put in the drone’s position to get ∇T, and take the dot product with u.",
   "Stokes’ theorem lets you swap the shell for the flat floor disc with the same rim, keeping the normal pointing up. The divergence theorem turns the air leaving the closed dome into the triple integral of div F; a half-ball of radius R has volume 2πR³ ÷ 3. Check whether any air crosses the floor."
  ],
  solution: "∇T = ⟨2x, 3, 2⟩, which at (2, 1, 1) is ⟨4, 3, 2⟩. The rate is ∇T · u = (4 × 2 + 3 × 1 + 2 × 2) ÷ 3 = 15 ÷ 3 = 5 °C per metre. For the air, curl F = ⟨0, 0, 1 − (−1)⟩ = ⟨0, 0, 2⟩. By Stokes’ theorem its flux up through the shell equals its flux up through the floor disc with the same rim: 2 × 9π = 18π, so k = 18. Next, div F = 2 + 1 + 3 = 6. On the floor z = 0, so the upward part 3z is 0 and no air crosses it: everything that leaves the closed dome leaves through the shell. By the divergence theorem that is 6 × (2π × 3³ ÷ 3) = 6 × 18π = 108π cubic metres per second, so k = 108.",
  xp: 200, prereqs: ["q38","q39"],
  artifact: { name: "Dome sign-off sheet", description: "Heat, swirl and outflow of the dome, and the first equation of change." },
  sources: [source.s4_6, source.s6_7, source.s6_8],
  teaching: {
   intuition: "This mission puts three tools together. First, the gradient ∇T = ⟨∂T/∂x, ∂T/∂y, ∂T/∂z⟩ of a temperature field: the rate at which T changes as you move in the direction of a unit vector u is the directional derivative ∇T · u. Second, Stokes’ theorem: the flux of curl F through a surface depends only on its rim and which way its normal points, so the curved shell of the dome, with its normal pointing up and out, can be swapped for the flat floor disc with the same rim and an upward normal. Third, the divergence theorem: the air leaving a closed surface equals the triple integral of div F inside. The dome’s shell and floor together close it off, so if no air crosses the floor, all of that outflow goes through the shell. A half-ball of radius R holds 2πR³ ÷ 3. The rate at which air leaves tells you how fast the air inside changes: if M is the amount of air, the rate of change of M is minus the outflow. When the outflow itself depends on M, that statement is an equation for a rate of change, a differential equation, and those are what the next realm solves.",
   steps: [
    "For a rate in a direction: work out ∇T at the point, check u has length 1, and take ∇T · u.",
    "For the flux of a curl through a curved surface: swap the surface for the flat disc with the same rim, its normal on the same side, and use the component of curl F along its normal.",
    "For the air leaving through part of a closed surface: find the total from the divergence theorem, then take off what crosses the other parts (here the floor, where it may be 0).",
    "Use the volume of the solid when div F is a constant: the triple integral is div F × volume."
   ],
   example: {
    prompt: "In a half-ball dome of radius 3 m on the floor z = 0, air moves with F = ⟨x, y, z⟩. At what rate does air leave through the shell?",
    steps: [
     "div F = 1 + 1 + 1 = 3, and the dome holds 2π × 27 ÷ 3 = 18π.",
     "On the floor z = 0, so the upward part of F is 0 there and no air crosses it.",
     "So all the outflow, 3 × 18π = 54π, leaves through the shell."
    ],
    answer: "54π cubic metres per second."
   },
   pitfalls: [
    "Using a direction vector that is not of length 1 for the rate. ∇T · u only gives the rate per metre when ‖u‖ = 1.",
    "Forgetting the floor. The divergence theorem gives the flow out through the whole closed surface; subtract whatever crosses the floor before calling it the shell’s share.",
    "Using the volume of a whole ball, 4πR³ ÷ 3, for a half-ball dome."
   ]
  },
  guidance: [
   { prompt: "What are the three components of ∇T at (2, 1, 1)?", answer: [4,3,2], labels: ["∂T/∂x","∂T/∂y","∂T/∂z"], explanation: "∂T/∂x = 2x = 4, ∂T/∂y = 3 and ∂T/∂z = 2." },
   { prompt: "What is ∇T · u, the rate in °C per metre?", answer: [5], labels: ["rate (°C/m)"], explanation: "(4 × 2 + 3 × 1 + 2 × 2) ÷ 3 = 15 ÷ 3 = 5." },
   { prompt: "curl F has only a z-component, ∂Q/∂x − ∂P/∂y. What is it?", answer: [2], labels: ["curl z (1/s)"], explanation: "∂Q/∂x = 1 and ∂P/∂y = −1, so it is 1 − (−1) = 2. The other two components are 0." },
   { prompt: "Through the floor disc of area 9π, the upward flux of curl F is kπ. What is k?", answer: [18], labels: ["k for curl flux"], explanation: "2 × 9 = 18. By Stokes’ theorem the shell, which has the same rim, has the same flux of curl F." },
   { prompt: "What is div F?", answer: [6], labels: ["div F (1/s)"], explanation: "∂P/∂x + ∂Q/∂y + ∂R/∂z = 2 + 1 + 3 = 6, the same everywhere." },
   { prompt: "No air crosses the floor. Writing the air leaving through the shell as kπ, what is k?", answer: [108], labels: ["k for air leaving"], explanation: "The dome holds 2π × 3³ ÷ 3 = 18π cubic metres, so the divergence theorem gives 6 × 18π = 108π." }
  ]
 }
);
})();
