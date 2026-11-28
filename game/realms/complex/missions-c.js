/* Complex analysis: the plane of numbers missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/complex/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Cauchy's theorem [4.6]
     q22  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Holes and winding numbers [4.7]
     q23  ch 4 Contour integrals · Intermediate, 150 XP · sector 'Ring Road' · Chapter review: once round the ring road [4.5, 4.6]
     q24  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · Cauchy's integral formula [5.1]
     q25  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · The formula for derivatives [5.2]
     q26  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · Cauchy's inequality and Liouville's theorem [5.5]
     q27  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · Mean value property [6.5, 5.5]
     q28  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · Maximum modulus [5.5, 6.5]
     q29  ch 5 Cauchy's formula · Intermediate, 150 XP · sector 'Field Lab' · Chapter review: reading the field coil [5.1, 5.2]
     q30  ch 6 Series · Advanced, 200 XP · sector 'Signal Archive' · Geometric series in the plane [8.1] */
(function(){
'use strict';
/* Orloff, Complex Variables with Applications (MIT), on LibreTexts sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Orloff/ (Orloff).
   A title reads like: Orloff, Complex Variables with Applications (LibreTexts) — 9.4 Residues
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s4_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.5 Examples", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.05%3A_Examples", description: "Worked loop integrals: 1 ÷ z round the unit circle gives 2πi, round a circle that leaves 0 outside gives 0, and 1 ÷ z² round the unit circle gives 0.", verified: '2026-11-28' },
 s4_6: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.6 Cauchy's Theorem", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.06%3A_Cauchy's_Theorem", description: "Cauchy’s theorem: a function analytic on a simply connected region has integral 0 round every closed curve in it, and its integrals there are path independent.", verified: '2026-11-28' },
 s4_7: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 4.7 Extensions of Cauchy's theorem", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/04%3A_Line_Integrals_and_Cauchys_Theorem/4.07%3A_Extensions_of_Cauchy's_theorem", description: "Cauchy’s theorem for regions with holes, the integral of 1 ÷ z round closed curves, and the winding number as the count of anticlockwise turns.", verified: '2026-11-28' },
 s5_1: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 5.1 Cauchy's Integral for Functions", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/05%3A_Cauchy_Integral_Formula/5.01%3A_Cauchy's_Integral_for_Functions", description: "Cauchy’s integral formula, f(z₀) = (1 ÷ 2πi) ∮ f(z) ÷ (z − z₀) dz for z₀ inside a simple closed curve, with points inside, outside and wound round twice.", verified: '2026-11-28' },
 s5_2: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 5.2 Cauchy's Integral Formula for Derivatives", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/05%3A_Cauchy_Integral_Formula/5.02%3A_Cauchys_Integral_Formula_for_Derivatives", description: "Cauchy’s formula for derivatives, f⁽ⁿ⁾(z) = (n! ÷ 2πi) ∮ f(w) ÷ (w − z)ⁿ⁺¹ dw, with worked integrals.", verified: '2026-11-28' },
 s5_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 5.5 Amazing consequence of Cauchy's integral formula", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/05%3A_Cauchy_Integral_Formula/5.05%3A_Amazing_consequence_of_Cauchys_integral_formula", description: "Cauchy’s inequality |f⁽ⁿ⁾(z₀)| ≤ n! M ÷ Rⁿ, Liouville’s theorem, the mean value property and the maximum modulus principle.", verified: '2026-11-28' },
 s6_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 6.5 Maximum Principle and Mean Value Property", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/06%3A_Harmonic_Functions/6.05%3A_Maximum_Principle_and_Mean_Value_Property", description: "The mean value property of harmonic functions and the maximum principle: extremes of a harmonic function on a bounded region are on its boundary.", verified: '2026-11-28' },
 s8_1: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 8.1 Geometric Series", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/08%3A_Taylor_and_Laurent_Series/8.01%3A_Geometric_Series", description: "Finite and infinite geometric series: the partial sum formula, and convergence to a ÷ (1 − r) when |r| < 1.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "The source the ring road misses", topic: "Cauchy’s theorem", tier: "Intermediate", sector: "Ring Road",
  brief: "Field sources sit all over the plain, and the road crew wants to know which ones the ring road actually feels.",
  lesson: "Round a closed curve, a function that is analytic on and inside it integrates to 0; so ∮ dz ÷ (z − a) is 2πi when a is inside the loop and 0 when it is outside.",
  prompt: "The ring road follows the circle |z| = 3, driven once anticlockwise. A field source sits at the point a = 1 + 2i, and the field it makes along the road is 1 ÷ (z − (1 + 2i)). Enter k in ∮ dz ÷ (z − (1 + 2i)) = kπi round the road. A second field, z² ÷ (z + 5), is analytic everywhere except at z = −5: enter k in ∮ z² ÷ (z + 5) dz = kπi round the same road.",
  answer: [2,0], labels: ["k for 1 ÷ (z − a)","k for z² ÷ (z − b)"], tolerance: 0.01,
  hints: [
   "A point a is inside the circle |z| = R when its distance from 0 is less than R, that is when (Re a)² + (Im a)² < R². Compare the squares, so no square root is needed.",
   "Cauchy’s theorem: if a function is analytic at every point on and inside the loop, its integral round the loop is 0. If the one bad point of 1 ÷ (z − a) is inside, shrink the loop to a small circle centred on a, which does not change the integral; round that circle the integral is 2πi."
  ],
  solution: "|a|² = 1² + 2² = 5 and R² = 9. 5 is less than 9, so a is inside the road. 1 ÷ (z − (1 + 2i)) is analytic everywhere except at a, so the road can be shrunk to a small circle round a without changing the integral, and that circle gives 2πi: k = 2. The only bad point of z² ÷ (z + 5) is z = −5, at distance 5 from 0, more than 3, so it is outside the road. That function is analytic on and inside the road, so by Cauchy’s theorem its integral is 0: k = 0.",
  xp: 150, prereqs: ["q20","q13"],
  artifact: {"name":"Ring road survey","description":"A map of the field sources, each marked inside or outside the road."},
  sources: [source.s4_6],
  teaching: {
   intuition: "Some loops add up to nothing at all. If a function is analytic at every point on a closed curve and at every point inside it, its integral once round the curve is exactly 0. This is Cauchy’s theorem, and it is the reason analytic functions are so easy to integrate round loops: all the contributions cancel. A function such as 1 ÷ (z − a) is analytic everywhere except at the single point a, where its bottom is 0. So everything depends on where a sits. If a is outside the loop, the function is analytic on and inside it, and the theorem gives 0. If a is inside, the theorem does not apply to the whole loop, but it still lets us shrink the loop down to a small circle centred on a without changing the integral, as long as we never cross a. Round a small circle centred on a, the last mission gave 2πi. So the answer is 2πi for every inside point, whether or not it is the centre. To test inside or outside for the circle |z| = R, use the distance from 0: a is inside when |a| < R, that is when (Re a)² + (Im a)² < R².",
   steps: [
    "Find every point where the function fails to be analytic: for a fraction, the points where its bottom is 0.",
    "Decide for each such point whether it is inside the loop. For the circle |z| = R, compare (Re a)² + (Im a)² with R².",
    "If no bad point is inside, Cauchy’s theorem gives ∮ f(z) dz = 0.",
    "If the only bad point a of 1 ÷ (z − a) is inside, shrink the loop to a small circle round a: the integral stays 2πi, so k = 2."
   ],
   example: {
    prompt: "Round the circle |z| = 2, once anticlockwise, find k in ∮ dz ÷ (z − (4 − i)) = kπi and in ∮ dz ÷ (z − (1 − i)) = kπi.",
    steps: [
     "|4 − i|² = 16 + 1 = 17, more than 2² = 4, so 4 − i is outside: Cauchy’s theorem gives 0.",
     "|1 − i|² = 1 + 1 = 2, less than 4, so 1 − i is inside: shrink the circle to a small one round 1 − i, which gives 2πi."
    ],
    answer: "k = 0 for the first and k = 2 for the second."
   },
   pitfalls: [
    "Comparing |a|² with R instead of with R²: for the circle |z| = 3 the test is (Re a)² + (Im a)² < 9.",
    "Using Cauchy’s theorem when the bad point is inside the loop. The theorem needs the function to be analytic at every point inside as well as on the loop.",
    "Thinking the answer changes with where a sits inside the loop. Every inside point gives 2πi, centre or not."
   ]
  },
  guidance: [
   { prompt: "How far is a = 1 + 2i from 0, squared? Work out |a|² = (Re a)² + (Im a)².", answer: [5], labels: ["|a|²"], explanation: "|a|² = 1² + 2² = 5." },
   { prompt: "The road has radius 3, so R² = 9. Is a inside the road? Enter 1 for inside, 0 for outside.", answer: [1], labels: ["inside (1) or outside (0)"], explanation: "5 is less than 9, so a is inside the road." },
   { prompt: "What is k in ∮ dz ÷ (z − (1 + 2i)) = kπi?", answer: [2], labels: ["k for 1 ÷ (z − a)"], explanation: "The bad point is inside, so the road can be shrunk to a small circle round a, which gives 2πi: k = 2." },
   { prompt: "z² ÷ (z + 5) fails to be analytic only at z = −5, which is 5 from 0. What is k for its integral round the road?", answer: [0], labels: ["k for z² ÷ (z − b)"], explanation: "5 is more than the radius 3, so the bad point is outside and Cauchy’s theorem gives 0." }
  ]
 },
 {
  id: "q22", title: "The cart that would not stop", topic: "Holes and winding numbers", tier: "Intermediate", sector: "Ring Road",
  brief: "A test cart has been sent round the ring road several times, some of them backwards, and the log needs to know what it picked up.",
  lesson: "The winding number counts the net anticlockwise turns a closed curve makes round a point, and ∮ dz ÷ (z − a) = 2πi times that number.",
  prompt: "A test cart drives round the ring road, the circle |z| = 4, twice anticlockwise, without stopping, and comes back to where it started. A field source sits at a = 1 − 2i. Enter the winding number of the cart’s path round a, then k in ∮ 3 ÷ (z − (1 − 2i)) dz = kπi along the whole path.",
  answer: [2,12], labels: ["winding number","k"], tolerance: 0.01,
  hints: [
   "The winding number counts the turns round a: each anticlockwise turn counts +1 and each clockwise turn −1. A point outside the circle is never turned round, so its winding number is 0.",
   "Every anticlockwise turn round a adds 2πi to ∮ dz ÷ (z − a), and a number on top of the fraction multiplies the whole integral: ∮ c ÷ (z − a) dz = 2πi × c × (winding number)."
  ],
  solution: "|a|² = 1² + (−2)² = 5, which is less than R² = 16, so a is inside the circle. The path goes round a twice anticlockwise, so its winding number round a is 2. The integral is 2πi × 3 × 2 = 12πi, so k = 12.",
  xp: 150, prereqs: ["q21"],
  artifact: {"name":"Turn counter","description":"A dial that clicks forward for every anticlockwise lap and back for every clockwise one."},
  sources: [source.s4_7],
  teaching: {
   intuition: "A closed curve can go round a point more than once, or the other way round. The winding number of a closed curve round a point a counts its net turns round a: each anticlockwise turn counts +1 and each clockwise turn counts −1, so twice anticlockwise is 2 and once clockwise is −1. A point the curve never goes round, such as a point outside a circle the curve keeps to, has winding number 0. The plane with the bad point a taken out has a hole in it, and Cauchy’s theorem has a form for regions with holes: if a function is analytic in the whole ring-shaped region between two loops, the integrals round the two loops are equal. That is why one anticlockwise turn round a gives the same 2πi for 1 ÷ (z − a) as a small circle does, and why a clockwise turn, which runs the circle backwards, gives −2πi. The turns add up, so ∮ dz ÷ (z − a) = 2πi × (winding number), and a number c on top multiplies the whole integral by c.",
   steps: [
    "Decide whether the point a is inside the circle the path follows: compare (Re a)² + (Im a)² with R².",
    "Count the turns round a: +1 for each anticlockwise turn, −1 for each clockwise turn, and 0 in all if a is outside.",
    "Multiply: ∮ c ÷ (z − a) dz = 2πi × c × (winding number), so k = 2 × c × (winding number)."
   ],
   example: {
    prompt: "A path goes once clockwise round the circle |z| = 3. Find its winding number round 2i and k in ∮ 5 ÷ (z − 2i) dz = kπi.",
    steps: [
     "|2i|² = 4, less than 9, so 2i is inside; the path turns round it once clockwise, so the winding number is −1.",
     "The integral is 2πi × 5 × (−1) = −10πi."
    ],
    answer: "Winding number −1, and k = −10."
   },
   pitfalls: [
    "Counting a clockwise turn as +1. Clockwise turns count −1, and they make the integral negative.",
    "Giving the number of laps when the point is outside the circle. The path never goes round that point, so the winding number is 0.",
    "Forgetting the number on top: ∮ c ÷ (z − a) dz is c times ∮ dz ÷ (z − a)."
   ]
  },
  guidance: [
   { prompt: "Is a = 1 − 2i inside the circle |z| = 4? Work out |a|² = (Re a)² + (Im a)² to compare with R² = 16.", answer: [5], labels: ["|a|²"], explanation: "|a|² = 1² + (−2)² = 5, less than 16, so a is inside." },
   { prompt: "The cart goes round the circle twice anticlockwise. What is the winding number of its path round a?", answer: [2], labels: ["winding number"], explanation: "Each turn goes round a, and anticlockwise turns count +1, so the winding number is 2." },
   { prompt: "What is k in ∮ 3 ÷ (z − (1 − 2i)) dz = kπi?", answer: [12], labels: ["k"], explanation: "2πi × 3 × 2 = 12πi, so k = 12." }
  ]
 },
 {
  id: "q23", title: "Once round the ring road", topic: "Chapter review: contour integrals round loops", tier: "Intermediate", sector: "Ring Road",
  brief: "The ring road log ends the shift with two loop readings, and Mira wants both before the gates close.",
  lesson: "A loop integral splits into its terms: each A ÷ (z − a) gives 2πi × A if a is inside and 0 if it is outside, and round a circle centred on c only the power −1 of (z − c) survives.",
  prompt: "Two readings for the ring road log. First, round the circle |z| = 3, once anticlockwise, enter k in ∮ (4 ÷ (z − 1) + 7 ÷ (z − 5)) dz = kπi. Second, round the small loop |z − 2| = 1, once anticlockwise, enter k in ∮ (3 ÷ (z − 2)² − 5 ÷ (z − 2) + 6(z − 2)) dz = kπi.",
  answer: [8,-10], labels: ["k for the big loop","k for the small loop"], tolerance: 0.01,
  hints: [
   "Split each integral into its terms. A term A ÷ (z − a) gives 2πi × A when a is inside the loop, and 0 when a is outside, by Cauchy’s theorem.",
   "Round a circle centred on c, (z − c)ⁿ integrates to 2πi when n = −1 and to 0 for every other whole number n, positive or negative."
  ],
  solution: "First reading: the bad points are 1 and 5. 1 is 1 from 0, less than 3, so it is inside; 5 is 5 from 0, more than 3, so it is outside and its term gives 0. The inside term gives 2πi × 4 = 8πi, so k = 8. Second reading: the loop is centred on 2, so 3 ÷ (z − 2)² and 6(z − 2) give 0 and only −5 ÷ (z − 2) counts: 2πi × (−5) = −10πi, so k = −10.",
  xp: 150, prereqs: ["q22"],
  artifact: {"name":"Ring road log","description":"Two loop readings, each worked out term by term."},
  sources: [source.s4_5, source.s4_6],
  teaching: {
   intuition: "This chapter has given three tools for integrals round a loop, and a long integrand is usually a sum of pieces that each need one of them. First, the integral of a sum is the sum of the integrals, so you can take the terms one at a time. Second, Cauchy’s theorem: a term that is analytic on and inside the loop gives 0. So a term A ÷ (z − a) whose bad point a is outside the loop drops out, and one whose bad point is inside gives 2πi × A. Third, the powers round a circle: round a circle centred on c, (z − c)ⁿ gives 2πi when n = −1 and 0 for every other whole number n, so a term like 3 ÷ (z − c)², which is 3(z − c)⁻², gives 0 even though c is inside. Only the power −1 survives. Read each term, decide which tool it needs, and add up what is left.",
   steps: [
    "Split the integrand into its terms.",
    "For a term A ÷ (z − a), decide whether a is inside the loop: inside gives 2πi × A, outside gives 0.",
    "For powers of (z − c) round a circle centred on c, keep only the term with (z − c)⁻¹: it gives 2πi times its coefficient.",
    "Add the pieces and write the total as kπi."
   ],
   example: {
    prompt: "Round |z| = 2 once anticlockwise, find k in ∮ (6 ÷ (z + 1) + 9 ÷ (z − 4) + 8 ÷ (z + 1)²) dz = kπi.",
    steps: [
     "−1 is inside and 4 is outside, so 9 ÷ (z − 4) gives 0.",
     "8 ÷ (z + 1)² is a power −2 round the inside point, which gives 0; 6 ÷ (z + 1) gives 2πi × 6 = 12πi."
    ],
    answer: "k = 12."
   },
   pitfalls: [
    "Counting every term with a bad point inside. A power −2 or −3 of (z − c) still gives 0; only the power −1 counts.",
    "Adding the coefficients of outside points. A term whose bad point is outside is analytic on and inside the loop, so it gives 0.",
    "Forgetting the factor 2: a term A ÷ (z − a) with a inside gives 2πi × A, so k = 2A."
   ]
  },
  guidance: [
   { prompt: "Of the two bad points 1 and 5 in the first reading, which one is inside the circle |z| = 3?", answer: [1], labels: ["point inside"], explanation: "1 is 1 from 0, less than the radius 3; 5 is 5 from 0, more than 3." },
   { prompt: "Only the term with the bad point 1 counts. What is k for the first reading?", answer: [8], labels: ["k for the big loop"], explanation: "That term gives 2πi × 4 = 8πi, and the other gives 0, so k = 8." },
   { prompt: "Round |z − 2| = 1 only the power −1 of (z − 2) counts. What is k for the second reading?", answer: [-10], labels: ["k for the small loop"], explanation: "The (z − 2)⁻² and (z − 2) terms give 0. −5 ÷ (z − 2) gives 2πi × (−5) = −10πi, so k = −10." }
  ]
 },
 {
  id: "q24", title: "Reading the middle from the rim", topic: "Cauchy’s integral formula", tier: "Intermediate", sector: "Field Lab",
  brief: "The field lab can only measure along its coils, and the crew wants to know what that says about a point in the middle.",
  lesson: "If f is analytic on and inside a loop and a is inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a): the values on the loop fix the value inside.",
  prompt: "In the field lab a coil follows the circle |z − 1| = 3, once anticlockwise. The field along it is f(z) ÷ (z − a) with a = 2 and f(z) = 2z² − 3z + 5. Enter f(2), then k in ∮ (2z² − 3z + 5) ÷ (z − 2) dz = kπi.",
  answer: [7,14], labels: ["f(a)","k"], tolerance: 0.01,
  hints: [
   "Cauchy’s integral formula: if f is analytic on and inside the loop and a is inside it, ∮ f(z) ÷ (z − a) dz = 2πi f(a).",
   "Check first that a is inside: a real point a is inside the circle |z − c| = r when its distance from the centre, |a − c|, is less than r. A polynomial is analytic everywhere."
  ],
  solution: "2 is 1 from the centre 1, less than the radius 3, so a is inside the coil, and f is a polynomial, analytic everywhere. f(2) = 8 − 6 + 5 = 7. By Cauchy’s integral formula the integral is 2πi × 7 = 14πi, so k = 14.",
  xp: 150, prereqs: ["q22"],
  artifact: {"name":"Rim reader","description":"A coil that reports the field at its middle from readings along its rim."},
  sources: [source.s5_1],
  teaching: {
   intuition: "The ring road showed that 1 ÷ (z − a) round a loop gives 2πi when a is inside. Now put an analytic function f on top: f(z) ÷ (z − a). Close to a, the top f(z) is almost the constant f(a), and shrinking the loop to a tiny circle round a does not change the integral, so the integral is f(a) times 2πi. This is Cauchy’s integral formula: if f is analytic on and inside a simple closed curve run once anticlockwise, and a is inside it, then ∮ f(z) ÷ (z − a) dz = 2πi f(a). A simple closed curve is one that does not cross itself, such as a circle. Read the other way round, the formula says something surprising: the values of f along the loop alone decide its value at every point inside. If a is outside the loop, f(z) ÷ (z − a) is analytic on and inside it, so Cauchy’s theorem gives 0 instead.",
   steps: [
    "Check that f is analytic on and inside the loop; a polynomial is analytic everywhere.",
    "Check that a is inside the loop: for the circle |z − c| = r, a real point a is inside when |a − c| < r.",
    "Work out f(a).",
    "The integral is 2πi f(a), so k = 2f(a)."
   ],
   example: {
    prompt: "Round |z| = 2 once anticlockwise, find k in ∮ (z² + 4) ÷ (z + 1) dz = kπi.",
    steps: [
     "The bottom is z − (−1), so a = −1, which is 1 from 0 and inside |z| = 2.",
     "f(−1) = 1 + 4 = 5, so the integral is 2πi × 5 = 10πi."
    ],
    answer: "k = 10."
   },
   pitfalls: [
    "Reading a with the wrong sign: z + 3 on the bottom is z − (−3), so a = −3.",
    "Forgetting to check that a is inside the loop. If it is outside, the integral is 0.",
    "Writing k = f(a). The formula has 2πi f(a), so k = 2f(a)."
   ]
  },
  guidance: [
   { prompt: "How far is a = 2 from the centre 1 of the coil? Its radius is 3.", answer: [1], labels: ["distance from the centre"], explanation: "|2 − 1| = 1, less than 3, so a is inside and Cauchy’s integral formula applies." },
   { prompt: "Put z = 2 into f(z) = 2z² − 3z + 5. What is f(2)?", answer: [7], labels: ["f(a)"], explanation: "f(2) = 8 − 6 + 5 = 7." },
   { prompt: "The integral is 2πi f(a). What is k?", answer: [14], labels: ["k"], explanation: "2πi × 7 = 14πi, so k = 14." }
  ]
 },
 {
  id: "q25", title: "The coil that measures slope", topic: "Cauchy’s formula for derivatives", tier: "Intermediate", sector: "Field Lab",
  brief: "A second coil has a squared or cubed bottom in its field, and the lab wants to know which derivative it is really reading.",
  lesson: "If f is analytic on and inside a loop and a is inside it, ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!.",
  prompt: "A second coil follows the circle |z| = 3, once anticlockwise. Its field is (z³ + 2z² − 4z + 1) ÷ (z − 2)². Enter n, the order of the derivative that Cauchy’s formula for derivatives uses here, then that derivative of f(z) = z³ + 2z² − 4z + 1 at z = 2, then k in ∮ (z³ + 2z² − 4z + 1) ÷ (z − 2)² dz = kπi.",
  answer: [1,16,32], labels: ["n","derivative at a","k"], tolerance: 0.01,
  hints: [
   "Cauchy’s formula for derivatives: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!, where f⁽ⁿ⁾ is f differentiated n times and n! = 1 × 2 × … × n.",
   "Read n from the power on the bottom, which is n + 1: a square on the bottom means the first derivative, and a cube means the second. Then check that a is inside the circle."
  ],
  solution: "The power on the bottom is 2, so n = 1. f′(z) = 3z² + 4z − 4, so f′(2) = 12 + 8 − 4 = 16. a = 2 is inside |z| = 3, since |2| < 3, and f is a polynomial, analytic everywhere. The integral is 2πi × 16 ÷ 1! = 32πi, so k = 32.",
  xp: 150, prereqs: ["q24"],
  artifact: {"name":"Slope coil","description":"A coil whose higher powers on the bottom read off derivatives at its middle."},
  sources: [source.s5_2],
  teaching: {
   intuition: "Cauchy’s integral formula gave 2πi f(a) for f(z) ÷ (z − a). Raising the power on the bottom reads off derivatives instead. Write f⁽ⁿ⁾ for f differentiated n times, so f⁽¹⁾ = f′ and f⁽²⁾ = f′′, and n! = 1 × 2 × … × n, with 0! = 1. Cauchy’s formula for derivatives says: if f is analytic on and inside a simple closed curve run once anticlockwise, and a is inside it, then ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!. With n = 0 it is the integral formula again. You can see why for a polynomial: expand f round a as f(a) + f′(a)(z − a) + f′′(a)(z − a)² ÷ 2! + …; dividing by (z − a)ⁿ⁺¹ turns the term with (z − a)ⁿ into a power −1, the only power that survives round the loop, and its coefficient is f⁽ⁿ⁾(a) ÷ n!. So the power on the bottom tells you which derivative is being read.",
   steps: [
    "Read the power on the bottom; it is n + 1, so subtract 1 to get n.",
    "Check that a is inside the loop and that f is analytic on and inside it.",
    "Differentiate f n times and put in z = a.",
    "The integral is 2πi f⁽ⁿ⁾(a) ÷ n!, so k = 2f⁽ⁿ⁾(a) ÷ n!."
   ],
   example: {
    prompt: "Round |z| = 4 once anticlockwise, find k in ∮ (z³ − 5z) ÷ (z − 1)³ dz = kπi.",
    steps: [
     "The power is 3 = n + 1, so n = 2. f′(z) = 3z² − 5 and f′′(z) = 6z, so f′′(1) = 6.",
     "1 is inside |z| = 4. The integral is 2πi × 6 ÷ 2! = 6πi."
    ],
    answer: "k = 6."
   },
   pitfalls: [
    "Taking n to be the power on the bottom. A square on the bottom is n = 1, the first derivative.",
    "Forgetting to divide by n!: for n = 2 the integral is 2πi f′′(a) ÷ 2.",
    "Differentiating the whole fraction. Only the top f(z) is differentiated, and then evaluated at a."
   ]
  },
  guidance: [
   { prompt: "The bottom is (z − 2)², and in the formula the power is n + 1. What is n?", answer: [1], labels: ["n"], explanation: "n + 1 = 2, so n = 1." },
   { prompt: "Differentiate f(z) = z³ + 2z² − 4z + 1 once and put in z = 2. What is f′(2)?", answer: [16], labels: ["derivative at a"], explanation: "f′(z) = 3z² + 4z − 4, so f′(2) = 12 + 8 − 4 = 16." },
   { prompt: "The integral is 2πi × f′(2) ÷ 1!. What is k?", answer: [32], labels: ["k"], explanation: "2πi × 16 ÷ 1 = 32πi, so k = 32." }
  ]
 },
 {
  id: "q26", title: "No field stays bounded for ever", topic: "Cauchy’s inequality and Liouville’s theorem", tier: "Intermediate", sector: "Field Lab",
  brief: "A probe can only promise a ceiling on a signal, and the lab wants to know how steep that signal could possibly be.",
  lesson: "If |f| ≤ M on the circle |z − a| = R, then |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ; letting R grow shows that a bounded entire function is constant (Liouville’s theorem).",
  prompt: "A field-lab probe reads a signal f that is analytic on and inside the circle |z − 2| = 3, and on that circle |f(z)| is never more than 45. Enter the largest value Cauchy’s inequality allows for |f′′(2)|. Then judge this claim: “Every entire function f with |f(z)| ≤ 7 at every point of the plane is constant.” Enter 1 if it is true, 0 if it is false.",
  answer: [10,1], labels: ["bound","true (1) or false (0)"], tolerance: 0.01,
  hints: [
   "Cauchy’s inequality: if f is analytic on and inside the circle |z − a| = R and |f| ≤ M on that circle, then |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ.",
   "Liouville’s theorem: an entire function (one that is analytic at every point of the plane) that is bounded is constant. A polynomial of degree 1 or more grows without limit far from 0, so it is not bounded."
  ],
  solution: "Here n = 2, M = 45 and R = 3, so the bound is 2! × 45 ÷ 3² = 2 × 45 ÷ 9 = 10. That is Liouville’s theorem: an entire function that is bounded is constant, so the claim is true (1).",
  xp: 150, prereqs: ["q25"],
  artifact: {"name":"Ceiling gauge","description":"A dial that turns a ceiling on a signal into a ceiling on its slopes."},
  sources: [source.s5_5],
  teaching: {
   intuition: "Cauchy’s formula for derivatives writes f⁽ⁿ⁾(a) as an integral round a circle. If we know a ceiling for |f| on that circle, the integral cannot be large, so neither can the derivative. Cauchy’s inequality makes this exact: if f is analytic on and inside the circle |z − a| = R and |f(z)| ≤ M at every point of that circle, then |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ. A bigger circle with the same ceiling gives a smaller bound, because Rⁿ sits on the bottom. Now take an entire function, one that is analytic at every point of the plane, and suppose it is bounded: |f(z)| ≤ M everywhere. Then the inequality holds for every circle, however large. With n = 1 the bound M ÷ R shrinks towards 0 as R grows, so f′(a) = 0 at every a and f is constant. That is Liouville’s theorem: a bounded entire function is constant. So any polynomial of degree 1 or more, which is entire and not constant, must grow without limit.",
   steps: [
    "Read off n (which derivative), M (the ceiling for |f| on the circle) and R (the radius of the circle centred on the point).",
    "Work out the bound n! M ÷ Rⁿ.",
    "For a claim about an entire function, use Liouville’s theorem: bounded and entire means constant, and a non-constant entire function is never bounded."
   ],
   example: {
    prompt: "f is analytic on and inside |z| = 4, and |f| ≤ 20 on that circle. How large can |f′(0)| be?",
    steps: [
     "n = 1, M = 20 and R = 4.",
     "The bound is 1! × 20 ÷ 4 = 5."
    ],
    answer: "|f′(0)| is at most 5."
   },
   pitfalls: [
    "Leaving out n!: for the second derivative the bound is 2 × M ÷ R², not M ÷ R².",
    "Using the diameter of the circle instead of its radius.",
    "Thinking a polynomial can be bounded on the whole plane. Only a constant entire function is bounded."
   ]
  },
  guidance: [
   { prompt: "The derivative asked for is f′′, so n = 2. What is Rⁿ = 3²?", answer: [9], labels: ["Rⁿ"], explanation: "3² = 9." },
   { prompt: "What is the bound n! M ÷ Rⁿ = 2 × 45 ÷ 9?", answer: [10], labels: ["bound"], explanation: "2 × 45 = 90, and 90 ÷ 9 = 10." },
   { prompt: "“Every entire function f with |f(z)| ≤ 7 at every point of the plane is constant.” Enter 1 if it is true, 0 if it is false.", answer: [1], labels: ["true (1) or false (0)"], explanation: "That is Liouville’s theorem: an entire function that is bounded is constant, so the claim is true (1)." }
  ]
 },
 {
  id: "q27", title: "The ring that keeps an average", topic: "Mean value property", tier: "Intermediate", sector: "Field Lab",
  brief: "A sensor ring logs the potential all the way round itself, and the lab wants one number for the whole ring.",
  lesson: "The average of a harmonic function round a circle equals its value at the centre (the mean value property).",
  prompt: "The field lab maps a potential u(x, y) = x² − y² + 3xy − 2x + 4y + 1 across a flat sheet. A sensor ring is the circle of radius 3 centred at (2, 1). Enter u at the point (5, 1) on the ring, then the average of u over the whole ring.",
  answer: [34,10], labels: ["u at the point","average round the ring"], tolerance: 0.01,
  hints: [
   "Check that u is harmonic: ∂²u/∂x² + ∂²u/∂y² = 0. The mean value property then says that the average of u round a circle equals the value of u at its centre.",
   "The first answer is u at one point of the ring, found by putting in its x and y. The average is u at the centre of the ring, not at a point on it."
  ],
  solution: "u(5, 1) = 25 − 1 + 15 − 10 + 4 + 1 = 34. ∂²u/∂x² = 2 and ∂²u/∂y² = −2, which add to 0, so u is harmonic everywhere. By the mean value property its average round the ring is its value at the centre: u(2, 1) = 4 − 1 + 6 − 4 + 4 + 1 = 10.",
  xp: 150, prereqs: ["q16","q24"],
  artifact: {"name":"Averaging ring","description":"A loop of sensors whose average reading always matches the probe at its centre."},
  sources: [source.s6_5, source.s5_5],
  teaching: {
   intuition: "A harmonic function u(x, y), one with ∂²u/∂x² + ∂²u/∂y² = 0, has no bumps and no dips of its own: it is as smooth and as balanced as a function can be. One way to see that balance is the mean value property: if u is harmonic on and inside a circle, then the average of u round the circle equals the value of u at its centre. Here the average round the circle of radius r centred at (x₀, y₀) means (1 ÷ 2π) ∫ from 0 to 2π of u(x₀ + r cos θ, y₀ + r sin θ) dθ, with θ in radians: the value of u added up evenly all the way round, divided by the full turn 2π. It comes from Cauchy’s integral formula, since u is the real part of an analytic function on the disc. So the points on the ring can read very different values, some above and some below, but they always balance out to the centre value, whatever the radius. A probe at the centre and a whole ring of sensors give the same number.",
   steps: [
    "Check that u is harmonic: work out ∂²u/∂x² and ∂²u/∂y² and check that they add to 0.",
    "For a single point on the circle, put its x and y into u.",
    "For the average round the circle, put in the centre’s x and y instead."
   ],
   example: {
    prompt: "u(x, y) = x² − y² + 6. What is the average of u round the circle of radius 2 centred at (3, −1)?",
    steps: [
     "∂²u/∂x² = 2 and ∂²u/∂y² = −2, which add to 0, so u is harmonic.",
     "The average is u(3, −1) = 9 − 1 + 6 = 14."
    ],
    answer: "The average is 14."
   },
   pitfalls: [
    "Giving the value at a point on the ring as the average. Points on the ring differ; only their average equals the centre value.",
    "Using the mean value property for a function that is not harmonic, such as x² + y². Check the sum of second derivatives first.",
    "Thinking the average depends on the radius. For a harmonic function every circle round the same centre has the same average."
   ]
  },
  guidance: [
   { prompt: "Put x = 5 and y = 1 into u. What is u(5, 1)?", answer: [34], labels: ["u at the point"], explanation: "u(5, 1) = 25 − 1 + 15 − 10 + 4 + 1 = 34." },
   { prompt: "Is u harmonic? Work out ∂²u/∂x² + ∂²u/∂y².", answer: [0], labels: ["sum of second derivatives"], explanation: "∂²u/∂x² = 2 and ∂²u/∂y² = −2: they add to 0, so u is harmonic and the mean value property applies." },
   { prompt: "The average round the ring is u at its centre. What is u(2, 1)?", answer: [10], labels: ["average round the ring"], explanation: "u(2, 1) = 4 − 1 + 6 − 4 + 4 + 1 = 10." }
  ]
 },
 {
  id: "q28", title: "Where the coil runs hottest", topic: "Maximum modulus principle", tier: "Intermediate", sector: "Field Lab",
  brief: "The coil housing must be rated for the strongest field anywhere on its disc, and the cheapest place to look is the rim.",
  lesson: "For a function analytic on a disc and not constant, the largest value of |f| over the disc is on its edge (the maximum modulus principle).",
  prompt: "A field coil’s strength over the disc |z| ≤ 2 is |f(z)|, with f(z) = z³ − 5. Enter the largest value of |f(z)| on the whole disc, then the smallest value of |f(z)| on its edge, the circle |z| = 2.",
  answer: [13,3], labels: ["largest on the disc","smallest on the edge"], tolerance: 0.01,
  hints: [
   "Maximum modulus principle: for a function that is analytic on a disc and not constant, the largest |f| over the disc is reached on its edge and nowhere inside.",
   "On the edge |zⁿ| = Rⁿ. The triangle inequality puts |w + c| between |w| − |c| and |w| + |c|, and as z goes once round the edge, zⁿ goes all the way round the circle of radius Rⁿ, so both ends are reached."
  ],
  solution: "On the edge |z³| = 2³ = 8. As z goes round the edge, z³ passes through 8 and −8. |z³ − 5| is largest where z³ = −8, which points the same way as −5: 8 + 5 = 13. It is smallest where z³ = 8: 8 − 5 = 3. By the maximum modulus principle no point inside the disc beats the edge, so the largest value on the whole disc is 13.",
  xp: 150, prereqs: ["q27"],
  artifact: {"name":"Rim thermometer","description":"One gauge on the edge of the disc that stands for the whole disc."},
  sources: [source.s5_5, source.s6_5],
  teaching: {
   intuition: "The mean value property says f at the centre of a circle is the average of f round it, and an average can never be larger than every one of the values it averages. If |f| had its largest value at a point inside a disc, every small circle round that point would have to average to something at least as large, which forces f to be constant near there. So for an analytic function that is not constant, |f| has no peak inside: the maximum modulus principle says that the largest value of |f| over a closed disc is reached on its edge, and nowhere inside. To find that largest value on the edge, two facts help. The modulus of a product is the product of the moduli, so on the circle |z| = R we have |zⁿ| = Rⁿ, and as z goes once round, zⁿ goes all the way round the circle of radius Rⁿ, passing through Rⁿ and −Rⁿ. And the triangle inequality says |w + c| is never more than |w| + |c| and never less than |w| − |c|, with each reached when w points the same way as c or the opposite way.",
   steps: [
    "Check that f is analytic on the disc and not constant; a polynomial of degree 1 or more is.",
    "On the edge |z| = R, work out |zⁿ| = Rⁿ.",
    "Use the triangle inequality: |zⁿ + c| is largest, Rⁿ + |c|, where zⁿ points the same way as c, and smallest, Rⁿ − |c|, where it points the opposite way.",
    "By the maximum modulus principle the largest value on the edge is the largest on the whole disc."
   ],
   example: {
    prompt: "f(z) = z² + 3 on the disc |z| ≤ 2. Find the largest |f| on the disc and the smallest |f| on its edge.",
    steps: [
     "On the edge |z²| = 4, and z² passes through 4 and −4.",
     "Largest: |4 + 3| = 7. Smallest on the edge: |−4 + 3| = 1."
    ],
    answer: "Largest on the disc 7; smallest on the edge 1."
   },
   pitfalls: [
    "Looking for the largest value at the centre. The centre gives |c|, which is smaller than the edge value.",
    "Thinking the smallest value over the whole disc is also on the edge. Here f has zeros inside the disc, where |f| = 0; only the largest value is forced to the edge.",
    "Adding c with its sign. The largest value uses |c|: for z³ − 5 it is Rⁿ + 5, reached where z³ = −Rⁿ."
   ]
  },
  guidance: [
   { prompt: "On the edge |z| = 2. What is |z³| there?", answer: [8], labels: ["|zⁿ| on the edge"], explanation: "The modulus of a product is the product of the moduli, so |z³| = 2³ = 8." },
   { prompt: "What is the largest value of |f(z)| on the disc?", answer: [13], labels: ["largest on the disc"], explanation: "It is on the edge, where z³ = −8 lines up with −5: 8 + 5 = 13." },
   { prompt: "What is the smallest value of |f(z)| on the edge?", answer: [3], labels: ["smallest on the edge"], explanation: "Where z³ = 8 points against −5: 8 − 5 = 3." }
  ]
 },
 {
  id: "q29", title: "Reading the field coil", topic: "Chapter review: Cauchy’s formulas", tier: "Intermediate", sector: "Field Lab",
  brief: "The field lab’s end-of-shift report needs three numbers from the coil, and every one of them comes from the edge.",
  lesson: "Cauchy’s integral formula gives 2πi f(a), the formula for derivatives gives 2πi f⁽ⁿ⁾(a) ÷ n!, and Cauchy’s inequality bounds |f⁽ⁿ⁾(a)| by n! M ÷ Rⁿ.",
  prompt: "Three readings from the field coil. The coil is the circle |z| = 2, driven once anticlockwise, and f(z) = 3z² − z + 2. Enter k in ∮ f(z) ÷ (z + 1) dz = kπi, then k in ∮ f(z) ÷ (z + 1)² dz = kπi. A second signal g is analytic on and inside the circle |z − 1| = 2, with |g(z)| ≤ 12 on that circle: enter the largest value Cauchy’s inequality allows for |g′′(1)|.",
  answer: [12,-14,6], labels: ["k for (z − a)","k for (z − a)²","bound"], tolerance: 0.01,
  hints: [
   "When a is inside the loop, Cauchy’s integral formula gives 2πi f(a) for f(z) ÷ (z − a), and the formula for derivatives gives 2πi f′(a) ÷ 1! for f(z) ÷ (z − a)².",
   "Cauchy’s inequality: |g⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ for a circle of radius R centred on a, with |g| ≤ M on it."
  ],
  solution: "a = −1 is inside |z| = 2, and f is a polynomial. f(−1) = 3 + 1 + 2 = 6, so the first integral is 2πi × 6 = 12πi: k = 12. f′(z) = 6z − 1, so f′(−1) = −7 and the second integral is 2πi × (−7) = −14πi: k = −14. For g, n = 2: the bound is 2! × 12 ÷ 2² = 24 ÷ 4 = 6.",
  xp: 150, prereqs: ["q26","q28"],
  artifact: {"name":"Field coil report","description":"Three readings from one coil: a value, a slope and a ceiling."},
  sources: [source.s5_1, source.s5_2],
  teaching: {
   intuition: "Every result in this chapter reads something about the inside of a loop from the loop alone. Cauchy’s integral formula reads a value: ∮ f(z) ÷ (z − a) dz = 2πi f(a) when f is analytic on and inside the loop and a is inside. Raise the power on the bottom and it reads a derivative: ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!, so a square on the bottom reads 2πi f′(a). And Cauchy’s inequality turns a ceiling into a bound: if |g| ≤ M on the circle of radius R round a, then |g⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ. In a review the work is mostly recognising which tool a reading needs: look at the power on the bottom, check that the point is inside, and keep track of n!.",
   steps: [
    "For f(z) ÷ (z − a), check a is inside and use 2πi f(a): k = 2f(a).",
    "For f(z) ÷ (z − a)², use the formula for derivatives with n = 1: k = 2f′(a).",
    "For a bound, read n, M and R and work out n! M ÷ Rⁿ."
   ],
   example: {
    prompt: "Round |z| = 3, with f(z) = z² + 4z, find k for ∮ f(z) ÷ (z − 1) dz and for ∮ f(z) ÷ (z − 1)² dz.",
    steps: [
     "1 is inside |z| = 3. f(1) = 5, so the first integral is 10πi.",
     "f′(z) = 2z + 4, so f′(1) = 6 and the second integral is 12πi."
    ],
    answer: "k = 10 and k = 12."
   },
   pitfalls: [
    "Using f(a) for a squared bottom. A square on the bottom reads the first derivative, f′(a).",
    "Forgetting the factor 2 in k: the integral is 2πi times the value, so k is twice it.",
    "Leaving out n! in the bound for a second derivative."
   ]
  },
  guidance: [
   { prompt: "f(−1) = 6. What is k for ∮ f(z) ÷ (z + 1) dz?", answer: [12], labels: ["k for (z − a)"], explanation: "Cauchy’s integral formula: 2πi × 6 = 12πi, so k = 12." },
   { prompt: "f′(z) = 6z − 1. What is k for ∮ f(z) ÷ (z + 1)² dz?", answer: [-14], labels: ["k for (z − a)²"], explanation: "f′(−1) = −7, and the formula for derivatives with n = 1 gives 2πi × (−7) = −14πi, so k = −14." },
   { prompt: "What is the bound 2! × 12 ÷ 4 on |g′′(1)|?", answer: [6], labels: ["bound"], explanation: "24 ÷ 4 = 6." }
  ]
 },
 {
  id: "q30", title: "Every power of one signal", topic: "Geometric series in the plane", tier: "Advanced", sector: "Signal Archive",
  brief: "The archive keeps a signal as an endless stack of powers, and the index card needs the single number they add up to.",
  lesson: "For a complex z with |z| < 1, the geometric series 1 + z + z² + … adds up to 1 ÷ (1 − z).",
  prompt: "The signal archive stores a signal as the endless sum 1 + z + z² + z³ + … of every power of z = i ÷ 2. Enter the real part, then the imaginary part, of the sum, as exact decimals.",
  answer: [0.8,0.4], labels: ["real part","imaginary part"], tolerance: 0.005,
  hints: [
   "A geometric series 1 + z + z² + … adds up to 1 ÷ (1 − z) when |z| < 1, for a complex z just as for a real number.",
   "To divide by a complex number, multiply the top and the bottom by the conjugate of the bottom; the bottom becomes (Re)² + (Im)², a real number."
  ],
  solution: "|z|² = 1 ÷ 4, less than 1, so the series adds up to 1 ÷ (1 − z). 1 − z = (2 − i) ÷ 2, so 1 ÷ (1 − z) = 2 ÷ (2 − i). Multiply the top and the bottom by the conjugate 2 + i: the bottom becomes 2² + 1² = 5 and the top 4 + 2i. The sum is (4 + 2i) ÷ 5: real part 0.8, imaginary part 0.4.",
  xp: 200, prereqs: ["q02"],
  artifact: {"name":"Archive index card","description":"One complex number that stands for an endless sum of powers."},
  sources: [source.s8_1],
  teaching: {
   intuition: "In Calculus 2 a geometric series 1 + r + r² + r³ + … added up to 1 ÷ (1 − r) when −1 < r < 1. The same is true for a complex number z, with the size |z| in place of the size of r. Here |z| is the distance of z from 0, so |z|² = (Re z)² + (Im z)² = z z̄. The reason is the same calculation as before: the partial sum Sₙ = 1 + z + … + zⁿ satisfies Sₙ − zSₙ = 1 − zⁿ⁺¹, so Sₙ = (1 − zⁿ⁺¹) ÷ (1 − z). When |z| < 1, the size of zⁿ⁺¹ is |z|ⁿ⁺¹, which shrinks to 0, so the sum is 1 ÷ (1 − z). When |z| ≥ 1 the powers do not shrink and the series does not converge. Each power of z turns and shrinks the last one, so the partial sums spiral in towards one point of the plane, and 1 ÷ (1 − z) is that point. To get its real and imaginary parts, divide as in the second mission: multiply the top and the bottom by the conjugate of the bottom.",
   steps: [
    "Check that |z| < 1: (Re z)² + (Im z)² must be less than 1.",
    "Write 1 − z as one complex number.",
    "Divide 1 by it: multiply the top and the bottom by the conjugate of 1 − z, so the bottom becomes a real number.",
    "Read off the real part and the imaginary part."
   ],
   example: {
    prompt: "Find the sum 1 + z + z² + … for z = (1 + i) ÷ 2.",
    steps: [
     "|z|² = (1 + 1) ÷ 4 = 0.5, less than 1, so the sum is 1 ÷ (1 − z).",
     "1 − z = (1 − i) ÷ 2, so 1 ÷ (1 − z) = 2 ÷ (1 − i) = 2(1 + i) ÷ 2 = 1 + i."
    ],
    answer: "The sum is 1 + i: real part 1, imaginary part 1."
   },
   pitfalls: [
    "Using 1 ÷ (1 + z) instead of 1 ÷ (1 − z).",
    "Multiplying only the bottom by the conjugate. The top must be multiplied too, or the value changes.",
    "Using the formula when |z| ≥ 1. Then the powers do not shrink and the series has no sum."
   ]
  },
  guidance: [
   { prompt: "1 ÷ (1 − z) = 2 ÷ (2 − i). Multiply the top and the bottom by the conjugate 2 + i. What real number is the new bottom?", answer: [5], labels: ["bottom after the conjugate"], explanation: "(2 − i)(2 + i) = 2² + 1² = 5." },
   { prompt: "The new top is 2(2 + i) = 4 + 2i. What is the real part of the sum?", answer: [0.8], labels: ["real part"], explanation: "4 ÷ 5 = 0.8." },
   { prompt: "And the imaginary part?", answer: [0.4], labels: ["imaginary part"], explanation: "2 ÷ 5 = 0.4." }
  ]
 }
);
})();
