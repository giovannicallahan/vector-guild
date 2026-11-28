/* Complex analysis: the plane of numbers missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/complex/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · The number i: adding and multiplying [1.3]
     q02  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · Conjugates and division [1.3]
     q03  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · Modulus and argument [1.4, 1.5]
     q04  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · Euler's formula and polar form [1.6]
     q05  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · Powers: de Moivre's formula [1.13, 1.6]
     q06  ch 1 Complex numbers · Basic, 100 XP · sector 'Antenna Field' · nth roots and roots of unity [1.6]
     q07  ch 2 Exponentials and logarithms · Basic, 100 XP · sector 'Rotor Hall' · Functions as maps [1.8]
     q08  ch 2 Exponentials and logarithms · Basic, 100 XP · sector 'Rotor Hall' · The complex exponential [1.7]
     q09  ch 2 Exponentials and logarithms · Basic, 100 XP · sector 'Rotor Hall' · The complex logarithm [1.11]
     q10  ch 2 Exponentials and logarithms · Basic, 100 XP · sector 'Rotor Hall' · Complex powers [1.11] */
(function(){
'use strict';
/* Orloff, Complex Variables with Applications (MIT), on LibreTexts: one entry per section the missions below cite. The
   plan's URLs were opened on 2026-11-27; each description says only what that section states. Ideas a mission teaches
   that its section does not state (the principal argument as a range, the period 2πi, the name "root of unity",
   i^i) are worked out in the mission itself. */
const source = {
 s1_3: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.3 Terminology and Basic Arithmetic", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.03%3A_Terminology_and_Basic_Arithmetic", description: "Complex numbers x + iy with i² = −1, real and imaginary parts, adding and multiplying, the conjugate and z z̄ = x² + y², dividing with the conjugate, and the modulus.", verified: '2026-11-27' },
 s1_4: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.4 The Complex Plane", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.04%3A_The_Complex_Plane", description: "Complex numbers drawn as points of a plane with a real axis and an imaginary axis, and the triangle inequality.", verified: '2026-11-27' },
 s1_5: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.5 Polar Coordinates", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.05%3A_Polar_Coordinates", description: "The modulus r as the distance from the origin, the argument θ and its many values differing by 2π, and choosing a branch such as −π < θ ≤ π.", verified: '2026-11-27' },
 s1_6: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.6 Euler's Formula", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.06%3A_Euler's_Formula", description: "Euler's formula e^(iθ) = cos θ + i sin θ, the polar form r e^(iθ), multiplying by multiplying moduli and adding arguments, powers, and solving zᴺ = c for its N roots.", verified: '2026-11-27' },
 s1_7: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.7 The Exponential Function", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.07%3A_The_Exponential_Function", description: "The complex exponential e^z = e^x(cos y + i sin y) and its properties, including |e^z| = e^x.", verified: '2026-11-27' },
 s1_8: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.8 Complex Functions as Mappings", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.08%3A_Complex_Functions_as_Mappings", description: "Complex functions w = f(z) as mappings from the z-plane to the w-plane, with z² and e^z as examples.", verified: '2026-11-27' },
 s1_11: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.11 The Function log(z)", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.11%3A_The_Function_log(z)", description: "The logarithm log z = log |z| + i arg z, its many values, branches and the principal value, and powers z^a = e^(a log z), including roots.", verified: '2026-11-27' },
 s1_13: { title: "Orloff, Complex Variables with Applications (LibreTexts) — 1.13 de Moivre's formula", url: "https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/01%3A_Complex_Algebra_and_the_Complex_Plane/1.13%3A_de_Moivre's_formula", description: "De Moivre's formula (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ, proved from Euler's formula.", verified: '2026-11-27' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01", title: "Two-part signals", topic: "The number i: adding and multiplying", tier: 'Basic', sector: "Antenna Field",
  brief: "Every antenna reading at the Wave Station comes in two parts, and the crew needs two readings combined, once by adding them and once by multiplying them.",
  lesson: "A complex number x + yi has a real part x and an imaginary part y; complex numbers add part by part, and multiply like brackets with i² = −1.",
  prompt: "Two antenna readings arrive as the complex numbers z = 3 + 2i and w = 5 − i. Combining the two signals adds them, and passing z through an amplifier set to w multiplies them. Enter the real part of z + w, the imaginary part of z + w, then the real part of zw and the imaginary part of zw.",
  answer: [8,1,17,7], labels: ["Re(z + w)", "Im(z + w)", "Re(zw)", "Im(zw)"], tolerance: 0.01,
  hints: [
   "To add, add the real parts together and add the imaginary parts together.",
   "To multiply, multiply every part of z by every part of w, as with two brackets, then replace i² by −1 and collect the real terms and the i terms."
  ],
  solution: "Adding part by part, z + w = 8 + i, so its real part is 8 and its imaginary part is 1. Multiplying every part of z by every part of w gives four products: 3 × 5 = 15; 3 × (−i) = −3i; (2i) × 5 = 10i; and (2i) × (−i) = −2i², which is 2 because i² = −1. The real terms give 15 + 2 = 17, and the i terms give −3 + 10 = 7. So zw = 17 + 7i: real part 17, imaginary part 7.",
  xp: 100, prereqs: [],
  artifact: { name: "Antenna log, page one", description: "Two readings, their sum and their product, each written in two parts." },
  sources: [source.s1_3],
  teaching: {
   intuition: "No real number squares to a negative number, so we bring in a new one: i, a number with i² = −1. A complex number is z = x + yi, where x and y are ordinary real numbers. Its real part is x, written Re z, and its imaginary part is y, written Im z. The imaginary part is the plain number in front of i, not yi. Two complex numbers add part by part, like two-part readings on a dial. To multiply, treat i like a letter, multiply out the brackets, and then use i² = −1 wherever i² appears. Writing zw with no sign between the two letters means z × w.",
   steps: [
    "Write each number as its real part plus its imaginary part times i.",
    "For a sum, add the two real parts and add the two imaginary parts.",
    "For a product, multiply every part of the first number by every part of the second: four products.",
    "Replace i² by −1, then collect the real terms and the i terms. The number in front of i is the imaginary part."
   ],
   example: {
    prompt: "Find z + w and zw for z = 2 + i and w = 1 + 3i.",
    steps: [
     "z + w = (2 + 1) + (1 + 3)i = 3 + 4i.",
     "zw = 2 × 1 + 2 × 3i + i × 1 + i × 3i = 2 + 6i + i + 3i².",
     "With i² = −1 that is 2 − 3 + 7i = −1 + 7i."
    ],
    answer: "z + w = 3 + 4i and zw = −1 + 7i, so Re(zw) = −1 and Im(zw) = 7."
   },
   pitfalls: [
    "Giving the imaginary part as 7i instead of 7. The imaginary part is the real number in front of i.",
    "Leaving the i² term in the imaginary part, or adding it with the wrong sign. i² = −1 is a real number.",
    "Multiplying only real by real and imaginary by imaginary. The two cross products make the imaginary part of the product."
   ]
  },
  guidance: [
   { prompt: "Add the real parts of z and w, 3 and 5. What is the real part of z + w?", answer: [8], labels: ["Re(z + w)"], explanation: "3 + 5 = 8." },
   { prompt: "Add the imaginary parts of z and w, 2 and −1. What is the imaginary part of z + w?", answer: [1], labels: ["Im(z + w)"], explanation: "2 + (−1) = 1. The imaginary part is the plain number in front of i." },
   { prompt: "The real part of zw comes from two products: 3 × 5, and (2i) × (−i), which is real because i² = −1. What is the real part of zw?", answer: [17], labels: ["Re(zw)"], explanation: "3 × 5 = 15, and (2i) × (−i) = −2i² = 2. Together they make 15 + 2 = 17." },
   { prompt: "The imaginary part of zw comes from the two cross products, 3 × (−i) and (2i) × 5. What is the imaginary part of zw?", answer: [7], labels: ["Im(zw)"], explanation: "3 × (−i) = −3i and (2i) × 5 = 10i. Together they make −3 + 10 = 7, the number in front of i." }
  ]
 },
 {
  id: "q02", title: "Undoing the cable", topic: "Conjugates and division", tier: 'Basic', sector: "Antenna Field",
  brief: "A cable has scaled and turned an incoming signal, and the crew needs the original back by dividing one complex number by another.",
  lesson: "The conjugate of x + yi is x − yi; a number times its conjugate is real, and that is how we divide by a complex number.",
  prompt: "A receiver measures the signal z = 4 + 7i, and the cable it came through scaled and turned every signal by the factor w = 1 + 2i. To undo the cable the crew divides: z ÷ w. Enter z z̄ (z times its conjugate), then the real part and the imaginary part of z ÷ w. Each answer is an exact decimal or fraction.",
  answer: [65,3.6,-0.2], labels: ["z z̄", "Re(z ÷ w)", "Im(z ÷ w)"], tolerance: 0.005,
  hints: [
   "The conjugate of x + yi is x − yi, and (x + yi)(x − yi) = x² + y², a real number.",
   "Multiply the top and the bottom of z ÷ w by w̄, the conjugate of w. The bottom becomes the real number w w̄; then divide each part of the top by it."
  ],
  solution: "z̄ = 4 − 7i, so z z̄ = 4² + 7² = 16 + 49 = 65. For the division, w̄ = 1 − 2i and w w̄ = 1² + 2² = 5. The top becomes z w̄ = (4 + 7i)(1 − 2i) = 18 − i. Dividing each part by 5: the real part of z ÷ w is 18 ÷ 5 = 3.6 and the imaginary part is −1 ÷ 5 = −0.2, so z ÷ w = 3.6 − 0.2i.",
  xp: 100, prereqs: ["q01"],
  sources: [source.s1_3],
  teaching: {
   intuition: "The conjugate of z = x + yi is z̄ = x − yi: the same real part with the sign of the imaginary part flipped. The bar over the z is read “z bar”. A number times its conjugate is always real, because the i terms cancel: (x + yi)(x − yi) = x² − y²i² = x² + y². That fact is the key to division. We cannot divide by a number with an i in it directly, so to work out z ÷ w we multiply the top and the bottom by w̄, which does not change the value. The bottom becomes the real number w w̄, and dividing by a real number is easy: divide the real part and the imaginary part of the top by it.",
   steps: [
    "Write the conjugate of the bottom, w̄, by flipping the sign of its imaginary part.",
    "Multiply the bottom by w̄: for w = c + di, w w̄ = c² + d², a real number.",
    "Multiply the top by w̄ as well, multiplying out the brackets with i² = −1.",
    "Divide the real part and the imaginary part of the new top by the real bottom."
   ],
   example: {
    prompt: "Divide 5 + 5i by 2 − i.",
    steps: [
     "The conjugate of 2 − i is 2 + i, and (2 − i)(2 + i) = 4 + 1 = 5.",
     "The top: (5 + 5i)(2 + i) = 10 + 5i + 10i + 5i² = 5 + 15i.",
     "Divide both parts by 5: 1 + 3i."
    ],
    answer: "(5 + 5i) ÷ (2 − i) = 1 + 3i. Check: (1 + 3i)(2 − i) = 2 − i + 6i + 3 = 5 + 5i."
   },
   pitfalls: [
    "Multiplying only the bottom by the conjugate. The top must be multiplied by the same number, or the value changes.",
    "Getting c² − d² for w w̄. Because i² = −1, the bottom is c² + d², which is always positive.",
    "Flipping the sign of the real part as well when writing the conjugate. Only the imaginary part changes sign."
   ]
  },
  guidance: [
   { prompt: "The conjugate of z is z̄ = 4 − 7i. What is z z̄?", answer: [65], labels: ["z z̄"], explanation: "(4 + 7i)(4 − 7i) = 4² + 7² = 65. The i terms cancel, so the product is real." },
   { prompt: "Multiply the bottom of z ÷ w by its conjugate: w w̄ = (1 + 2i)(1 − 2i). What real number is it?", answer: [5], labels: ["w w̄"], explanation: "w w̄ = 1² + 2² = 5." },
   { prompt: "The top becomes z w̄ = (4 + 7i)(1 − 2i) = 18 − i. Divide its real part by w w̄ = 5. What is the real part of z ÷ w?", answer: [3.6], labels: ["Re(z ÷ w)"], explanation: "Multiplying out, the real terms of z w̄ are 4 × 1 = 4 and (7i) × (−2i) = 14, together 18. Then 18 ÷ 5 = 3.6." },
   { prompt: "Now divide the imaginary part of the top, −1, by 5. What is the imaginary part of z ÷ w?", answer: [-0.2], labels: ["Im(z ÷ w)"], explanation: "−1 ÷ 5 = −0.2. Check: (3.6 − 0.2i) × (1 + 2i) gives back 4 + 7i." }
  ]
 },
 {
  id: "q03", title: "Where the signal points", topic: "Modulus and argument", tier: 'Basic', sector: "Antenna Field",
  brief: "The antenna crew wants each signal described by how strong it is and which way it points, instead of by its two parts.",
  lesson: "In the complex plane the modulus |z| is the distance from 0 to z, and the principal argument Arg z is its angle from the positive real axis, between −π and π.",
  prompt: "An antenna picks up a signal at the point z = −8 + 6i of the complex plane. Enter its modulus |z|, then its principal argument Arg z in radians (between −π and π), to 2 decimal places.",
  answer: [10,2.5], labels: ["|z|", "Arg z"], tolerance: 0.005,
  hints: [
   "The modulus is the distance from 0 to z: |x + yi| = √(x² + y²).",
   "First find the angle arctan(|y| ÷ |x|) between z and the real axis. If z is left of the imaginary axis, take π minus that angle; if z is below the real axis, make the result negative."
  ],
  solution: "|z| = √((−8)² + 6²) = √100 = 10. The angle between z and the real axis is arctan(6 ÷ 8) ≈ 0.6435 radians. z lies above the real axis and to the left of the imaginary axis (quadrant 2), so Arg z = π − angle. With the unrounded angle, Arg z ≈ 2.4981, which is 2.50 to 2 decimal places.",
  xp: 100, prereqs: ["q02"],
  sources: [source.s1_4, source.s1_5],
  teaching: {
   intuition: "Draw z = x + yi as the point (x, y): the real part across and the imaginary part up. This picture is the complex plane, with the real axis across and the imaginary axis up. The axes split it into four quadrants, numbered 1 to 4 anticlockwise from the upper right. A point is also fixed by a distance and a direction. The modulus |z| is the distance from 0 to z, which is √(x² + y²) by Pythagoras. An argument of z is an angle in radians from the positive real axis round to z, measured anticlockwise. Adding a whole turn of 2π gives another argument of the same point, so every non-zero z has many. The principal argument Arg z is the one with −π < Arg z ≤ π. To find it, take the angle arctan(|y| ÷ |x|) between z and the real axis, then fix it up for the quadrant.",
   steps: [
    "Find the modulus: |z| = √(x² + y²).",
    "Find the angle between z and the real axis: arctan(|y| ÷ |x|), in radians.",
    "Use the quadrant: in quadrant 1 that angle is Arg z; in quadrant 2, Arg z = π − angle; in quadrant 3, Arg z = −(π − angle); in quadrant 4, Arg z = −angle.",
    "Round only at the end."
   ],
   example: {
    prompt: "Find |z| and Arg z for z = −3 − 4i.",
    steps: [
     "|z| = √(9 + 16) = √25 = 5.",
     "The angle with the real axis is arctan(4 ÷ 3) ≈ 0.9273.",
     "z is left of the imaginary axis and below the real axis, in quadrant 3, so Arg z = −(π − 0.9273) ≈ −2.2143."
    ],
    answer: "|z| = 5 and Arg z ≈ −2.21 radians."
   },
   pitfalls: [
    "Taking arctan(y ÷ x) straight from a calculator for a point left of the imaginary axis. The calculator gives an angle between −π ÷ 2 and π ÷ 2, which points the wrong way there.",
    "Giving an argument outside −π to π, such as 4.07 instead of −2.21. Both point the same way, but only one is the principal argument.",
    "Rounding the angle with the real axis before subtracting it from π, which can change the last decimal."
   ]
  },
  guidance: [
   { prompt: "How far is z = −8 + 6i from 0? Enter |z|.", answer: [10], labels: ["|z|"], explanation: "|z| = √(64 + 36) = √100 = 10." },
   { prompt: "What is the angle arctan(6 ÷ 8) between z and the real axis, in radians, to 2 decimal places?", answer: [0.64], labels: ["angle with the real axis"], explanation: "arctan(6 ÷ 8) ≈ 0.6435, which is 0.64 to 2 decimal places. Keep the unrounded value for the next step." },
   { prompt: "z lies above the real axis and to the left of the imaginary axis (quadrant 2). What is Arg z, in radians, to 2 decimal places?", answer: [2.5], labels: ["Arg z"], explanation: "In this quadrant Arg z = π − angle. Using the unrounded angle 0.6435, Arg z ≈ 2.4981, which is 2.50 to 2 decimal places." }
  ]
 },
 {
  id: "q04", title: "Turning the array", topic: "Euler's formula and polar form", tier: 'Basic', sector: "Antenna Field",
  brief: "The array sends signals out at set strengths and angles, and the receivers need each one as a real part and an imaginary part.",
  lesson: "Euler's formula e^(iθ) = cos θ + i sin θ turns the polar form r e^(iθ) into its parts: real part r cos θ, imaginary part r sin θ.",
  prompt: "An antenna array sends out a signal of strength 6, turned through the angle θ = 5π ÷ 6 radians, so the signal is z = 6e^(iθ). Enter the real part and the imaginary part of z, each to 2 decimal places.",
  answer: [-5.2,3], labels: ["Re z", "Im z"], tolerance: 0.005,
  hints: [
   "Euler's formula: e^(iθ) = cos θ + i sin θ, so r e^(iθ) = r cos θ + i r sin θ.",
   "Find the quadrant the angle points into: it gives the signs of cos θ and sin θ. Their sizes come from the angle that θ makes with the real axis."
  ],
  solution: "By Euler's formula, z = 6(cos θ + i sin θ). The angle 5π ÷ 6 points into quadrant 2, where cos(5π ÷ 6) = −√3 ÷ 2 and sin(5π ÷ 6) = 1 ÷ 2. So the real part is 6 × (−√3 ÷ 2) ≈ −5.1962, which is −5.20 to 2 decimal places, and the imaginary part is 6 × (1 ÷ 2) = 3.",
  xp: 100, prereqs: ["q03"],
  sources: [source.s1_6],
  teaching: {
   intuition: "A point of the complex plane at distance r from 0 and at angle θ has real part r cos θ and imaginary part r sin θ, so z = r(cos θ + i sin θ). Euler's formula gives the bracket a short name: e^(iθ) = cos θ + i sin θ, where e is the number 2.718… from calculus and e^(iθ) means e raised to the power iθ. So any non-zero z can be written in polar form z = r e^(iθ), with r = |z| and θ an argument of z. The formula is no accident: put iθ into the Taylor series of e^x, and the even powers collect into the series of cos θ while the odd powers collect into i times the series of sin θ. Polar form makes turning easy: multiplying by e^(iθ) turns a point through θ and keeps its distance from 0. To go back to parts you need cos θ and sin θ; for multiples of π ÷ 6 and π ÷ 4 their sizes are 1 ÷ 2, √2 ÷ 2 or √3 ÷ 2, and the quadrant gives the signs.",
   steps: [
    "Read off r and θ from z = r e^(iθ).",
    "Find the quadrant θ points into; it gives the signs of cos θ and sin θ.",
    "Find the sizes of cos θ and sin θ from the angle that θ makes with the real axis.",
    "Multiply: the real part is r cos θ and the imaginary part is r sin θ."
   ],
   example: {
    prompt: "Write z = 2e^(iπ ÷ 3) as a real part and an imaginary part.",
    steps: [
     "π ÷ 3 points into quadrant 1, so cos and sin are both positive.",
     "cos(π ÷ 3) = 1 ÷ 2 and sin(π ÷ 3) = √3 ÷ 2.",
     "The real part is 2 × 1 ÷ 2 = 1 and the imaginary part is 2 × √3 ÷ 2 = √3 ≈ 1.7321."
    ],
    answer: "z = 1 + 1.73i to 2 decimal places."
   },
   pitfalls: [
    "Using degrees on a calculator. Every angle here is in radians.",
    "Taking the sign of cos θ from the angle with the real axis instead of from the quadrant: cos(3π ÷ 4) is negative.",
    "Swapping cos and sin. The real part goes with cos θ, the imaginary part with sin θ."
   ]
  },
  guidance: [
   { prompt: "Into which quadrant does the angle θ = 5π ÷ 6 point? Enter 1, 2, 3 or 4 (quadrant 1 is the upper right, and they are numbered anticlockwise).", answer: [2], labels: ["quadrant"], explanation: "Measured anticlockwise from the positive real axis, 5π ÷ 6 lies in quadrant 2, so cos θ is negative and sin θ is positive." },
   { prompt: "The real part is 6 cos(5π ÷ 6). What is it, to 2 decimal places?", answer: [-5.2], labels: ["Re z"], explanation: "cos(5π ÷ 6) = −√3 ÷ 2, so 6 × (−√3 ÷ 2) ≈ −5.1962, which is −5.20 to 2 decimal places." },
   { prompt: "The imaginary part is 6 sin(5π ÷ 6). What is it, to 2 decimal places?", answer: [3], labels: ["Im z"], explanation: "sin(5π ÷ 6) = 1 ÷ 2, so 6 × (1 ÷ 2) = 3." }
  ]
 },
 {
  id: "q05", title: "Many passes through the rotor", topic: "Powers: de Moivre's formula", tier: 'Basic', sector: "Antenna Field",
  brief: "A signal goes round the same rotor stage again and again, and the crew needs to know what comes out after the last pass.",
  lesson: "De Moivre's formula (r e^(iθ))ⁿ = rⁿ e^(inθ): a power raises the modulus to the nth power and multiplies the angle by n.",
  prompt: "A rotor stage turns and scales a signal by the factor z = −1 + i each time the signal passes through it. After 5 passes the signal has been multiplied by z⁵. Enter the real part and the imaginary part of z⁵.",
  answer: [4,-4], labels: ["Re(zⁿ)", "Im(zⁿ)"], tolerance: 0.01,
  hints: [
   "Write z in polar form r e^(iθ) first. Its modulus is √(x² + y²), and its angle is an odd multiple of π ÷ 4.",
   "De Moivre's formula: (r e^(iθ))ⁿ = rⁿ e^(inθ). Multiply the angle by n, take away whole turns of 2π, then use cos and sin of what is left."
  ],
  solution: "|z| = √2 and z points at the angle θ = 3π ÷ 4, so z = √2 e^(iθ). By de Moivre's formula, z⁵ = (√2)⁵ e^(i × 5θ). The angle 5 × 3π ÷ 4 = 15π ÷ 4; taking away whole turns of 2π leaves 7π ÷ 4. The size is (√2)⁵ = 4√2. So z⁵ = 4√2(cos(7π ÷ 4) + i sin(7π ÷ 4)) = 4 − 4i: real part 4, imaginary part −4.",
  xp: 100, prereqs: ["q04"],
  sources: [source.s1_13, source.s1_6],
  teaching: {
   intuition: "Multiplying two numbers in polar form multiplies their moduli and adds their angles: r e^(iα) × s e^(iβ) = rs e^(i(α + β)). Multiply z by itself n times and the angle is added n times. That is de Moivre's formula: (r e^(iθ))ⁿ = rⁿ e^(inθ), or without the exponential, (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ. Raising a number to the 10th power by multiplying out brackets takes nine multiplications; in polar form it is one step for the modulus and one for the angle. A whole turn of 2π brings a point back where it started, so take whole turns away from the angle before you use cos and sin.",
   steps: [
    "Write z in polar form: r = |z| and θ an argument of z.",
    "Raise the modulus to the power: rⁿ. For r = √2, (√2)ⁿ is a whole number when n is even and a whole number times √2 when n is odd.",
    "Multiply the angle by n and take away whole turns of 2π until it lies from 0 up to 2π.",
    "Turn back into parts: the real part is rⁿ cos(nθ) and the imaginary part is rⁿ sin(nθ)."
   ],
   example: {
    prompt: "Find (1 + i)⁴.",
    steps: [
     "1 + i = √2 e^(iπ ÷ 4).",
     "(√2)⁴ = 4 and 4 × π ÷ 4 = π.",
     "(1 + i)⁴ = 4(cos π + i sin π) = 4 × (−1) = −4."
    ],
    answer: "(1 + i)⁴ = −4: real part −4, imaginary part 0."
   },
   pitfalls: [
    "Raising the parts separately: (x + yi)ⁿ is not xⁿ + yⁿi.",
    "Multiplying the angle by n but forgetting to raise the modulus to the nth power as well.",
    "Losing a factor with odd powers of √2: 4√2 × √2 ÷ 2 = 4, because √2 × √2 = 2."
   ]
  },
  guidance: [
   { prompt: "Write the angle of z = −1 + i, between 0 and 2π, as kπ ÷ 4. What is k?", answer: [3], labels: ["k"], explanation: "z sits on the diagonal of quadrant 2, at the angle 3π ÷ 4, so k = 3." },
   { prompt: "De Moivre's formula multiplies the angle by 5: 5 × 3π ÷ 4 = 15π ÷ 4. Take away whole turns of 2π (each turn is 8 steps of π ÷ 4). The angle left is jπ ÷ 4 with j from 0 to 7: what is j?", answer: [7], labels: ["j"], explanation: "15 steps of π ÷ 4, less whole turns of 8 steps, leaves 7 steps, so the angle of z⁵ is 7π ÷ 4." },
   { prompt: "The size of z⁵ is (√2)⁵ = 4√2, and its angle is 7π ÷ 4. What is the real part of z⁵?", answer: [4], labels: ["Re(zⁿ)"], explanation: "4√2 × cos(7π ÷ 4) = 4." },
   { prompt: "With the same size and angle, what is the imaginary part of z⁵?", answer: [-4], labels: ["Im(zⁿ)"], explanation: "4√2 × sin(7π ÷ 4) = −4, so z⁵ = 4 − 4i." }
  ]
 },
 {
  id: "q06", title: "Every way to make the signal", topic: "nth roots and roots of unity", tier: 'Basic', sector: "Antenna Field",
  brief: "The array must find every signal that, multiplied by itself a set number of times, gives the target reading.",
  lesson: "A non-zero number w has exactly n nth roots, all with the same modulus and spaced equally round a circle; the nth roots of 1 are the roots of unity.",
  prompt: "The antenna array needs every signal z with z³ = w, where w = −8: these are the cube roots of w. Enter how many cube roots w has, their common modulus, and the real part of the one with the smallest positive argument, to 2 decimal places.",
  answer: [3,2,1], labels: ["number of roots", "modulus", "real part"], tolerance: 0.005,
  hints: [
   "A non-zero number w has exactly n different nth roots. If |w| = R, every one of them has modulus r, the positive real number with rⁿ = R.",
   "If Arg w = φ, the roots have the arguments (φ + 2πk) ÷ n for k = 0, 1, …, n − 1, spaced equally round a circle. Pick the smallest of them that is greater than 0."
  ],
  solution: "w = −8 has modulus 8 and argument φ = π. It has 3 cube roots, all with modulus 2, because 2³ = 8. Their arguments are (φ + 2πk) ÷ 3 for k = 0 to 2: π ÷ 3, π, 5π ÷ 3. The smallest positive one is π ÷ 3, so that root has real part 2 × cos(π ÷ 3) = 1.",
  xp: 100, prereqs: ["q05"],
  sources: [source.s1_6],
  teaching: {
   intuition: "An nth root of w is a number z with zⁿ = w. Among the real numbers 8 has one cube root, 2, but in the complex plane it has three. De Moivre's formula says what zⁿ does: it raises the modulus to the nth power and multiplies the angle by n. To undo it, take the positive real nth root of |w| and divide the angle by n. The twist is that the angle of w is only known up to whole turns: φ, φ + 2π, φ + 4π and so on all point the same way. Divided by n they no longer do. (φ + 2πk) ÷ n for k = 0, 1, …, n − 1 are n different directions, a full turn split into n equal steps, and each gives a root. So every non-zero w has exactly n nth roots, at the corners of a regular n-sided shape round 0. The nth roots of 1 are called the nth roots of unity; one of them is always 1 itself.",
   steps: [
    "Write w in polar form: its modulus R and its argument φ.",
    "Every root has modulus r, the positive real number with rⁿ = R.",
    "The arguments of the roots are (φ + 2πk) ÷ n for k = 0, 1, …, n − 1.",
    "Each root is r(cos α + i sin α) for its argument α; there are exactly n of them."
   ],
   example: {
    prompt: "Find the 4th roots of 1, the 4th roots of unity.",
    steps: [
     "1 has modulus 1 and argument 0, so every root has modulus 1.",
     "The arguments are 2πk ÷ 4 for k = 0, 1, 2, 3: 0, π ÷ 2, π and 3π ÷ 2.",
     "The roots are 1, i, −1 and −i. The one with the smallest positive argument, π ÷ 2, is i, whose real part is 0."
    ],
    answer: "Four roots, each of modulus 1: 1, i, −1 and −i."
   },
   pitfalls: [
    "Finding only the real root. A non-zero number always has n different nth roots in the complex plane.",
    "Dividing the argument by n without first adding the whole turns 2πk, which finds one root instead of n.",
    "Counting the argument 0 as positive. The smallest positive argument is the smallest one greater than 0."
   ]
  },
  guidance: [
   { prompt: "How many different cube roots does the non-zero number w = −8 have?", answer: [3], labels: ["number of roots"], explanation: "Every non-zero number has exactly n different nth roots, so w has 3 cube roots." },
   { prompt: "|w| = 8. Which positive real number r has r³ = 8?", answer: [2], labels: ["modulus"], explanation: "2³ = 8, so every root has modulus 2." },
   { prompt: "The arguments of the roots are π ÷ 3, π, 5π ÷ 3. Take the smallest one greater than 0. What is the real part of that root, to 2 decimal places?", answer: [1], labels: ["real part"], explanation: "The smallest positive argument is π ÷ 3, so the real part is 2 × cos(π ÷ 3) = 1." }
  ]
 },
 {
  id: "q07", title: "The rotor controller", topic: "Functions as maps", tier: 'Basic', sector: "Rotor Hall",
  brief: "Each setting of the rotor controller produces an output number, and the crew wants the two parts of the output for given settings.",
  lesson: "A complex function w = f(z) maps each point z = x + yi to a point w = u + vi, so it is a pair of real functions u(x, y) and v(x, y).",
  prompt: "The rotor controller maps each setting z to an output w = f(z) = z² + c, with c = 2 − 3i. Writing z = x + yi and w = u + vi, the output has a real part u(x, y) and an imaginary part v(x, y). Enter u and v at the setting z = 1 + 2i, then the real part of f(z) at a second setting z = 3 − i.",
  answer: [-1,1,10], labels: ["u", "v", "Re f at the second setting"], tolerance: 0.01,
  hints: [
   "Expand (x + yi)² = x² − y² + 2xyi, then add the real part of c to the real part and the imaginary part of c to the imaginary part.",
   "So u(x, y) = x² − y² + Re c and v(x, y) = 2xy + Im c. Put in the x and the y of each setting."
  ],
  solution: "With z = x + yi, z² = x² − y² + 2xyi, so u(x, y) = x² − y² + 2 and v(x, y) = 2xy − 3. At z = 1 + 2i: u = 1² − 2² + 2 = −1 and v = 2 × 1 × 2 − 3 = 1. At z = 3 − i: u = 3² − (−1)² + 2 = 10, so the real part of f(z) there is 10.",
  xp: 100, prereqs: ["q02"],
  sources: [source.s1_8],
  teaching: {
   intuition: "A complex function takes a complex number in and gives a complex number out: w = f(z). A complex number is a point of the plane, so f is a mapping that moves the points of one plane, the z-plane, to points of another, the w-plane. Writing z = x + yi and w = u + vi, both parts of the output depend on both parts of the input. So one complex function is the same as two real functions of two real variables: u(x, y), its real part, and v(x, y), its imaginary part. For f(z) = z², expanding (x + yi)² = x² + 2xyi + y²i² = x² − y² + 2xyi gives u = x² − y² and v = 2xy. Adding a constant c then shifts every output by c.",
   steps: [
    "Write z = x + yi and work out f(z) with the rules of complex arithmetic.",
    "Collect the terms without i into u(x, y) and the number in front of i into v(x, y).",
    "Put in the x and the y of the point to get u and v there."
   ],
   example: {
    prompt: "For f(z) = z² + 1 + i, find u and v at z = 2 + i.",
    steps: [
     "u(x, y) = x² − y² + 1 and v(x, y) = 2xy + 1.",
     "At x = 2, y = 1: u = 4 − 1 + 1 = 4 and v = 2 × 2 × 1 + 1 = 5."
    ],
    answer: "f(2 + i) = 4 + 5i, so u = 4 and v = 5."
   },
   pitfalls: [
    "Writing (x + yi)² as x² + y². The cross term 2xyi and the sign from i² = −1 both matter.",
    "Putting the imaginary part of c into u. The real part of c joins u, and the imaginary part joins v.",
    "Swapping x and y when reading off the point: in z = x + yi, x is the real part."
   ]
  },
  guidance: [
   { prompt: "With z = x + yi, z² = x² − y² + 2xyi, so u(x, y) = x² − y² + 2. What is u at z = 1 + 2i?", answer: [-1], labels: ["u"], explanation: "x = 1 and y = 2: u = 1² − 2² + 2 = 1 − 4 + 2 = −1." },
   { prompt: "v(x, y) = 2xy − 3. What is v at z = 1 + 2i?", answer: [1], labels: ["v"], explanation: "v = 2 × 1 × 2 − 3 = 4 − 3 = 1." },
   { prompt: "Use the same u(x, y) at the second setting z = 3 − i. What is the real part of f(z) there?", answer: [10], labels: ["Re f"], explanation: "x = 3 and y = −1: u = 9 − 1 + 2 = 10." }
  ]
 },
 {
  id: "q08", title: "The rotor that comes round again", topic: "The complex exponential", tier: 'Basic', sector: "Rotor Hall",
  brief: "The rotor log stores each position as an exponential, and the crew needs its size, its real part and the simplest angle that gives it.",
  lesson: "The complex exponential is e^(x + yi) = e^x(cos y + i sin y): its modulus is e^x, and it has period 2πi, so y can change by whole turns of 2π.",
  prompt: "A rotor’s position is recorded as e^z with z = x + yi, where x = 1 and y = 17π ÷ 6 radians. Enter |e^z|, then the real part of e^z, then the angle y′ greater than 0 and at most 2π that gives the same value of e^z. Give all three to 2 decimal places.",
  answer: [2.72,-2.35,2.62], labels: ["|e^z|", "Re e^z", "y′"], tolerance: 0.005,
  hints: [
   "e^(x + yi) = e^x(cos y + i sin y). Its modulus is e^x, because cos y + i sin y has modulus 1.",
   "Adding or taking away 2π does not change cos y or sin y, so e^z repeats. Add or take away whole turns of 2π until the angle is greater than 0 and at most 2π."
  ],
  solution: "e^z = e^x(cos y + i sin y), so |e^z| = e ≈ 2.7183, which is 2.72 to 2 decimal places. Taking one whole turn of 2π away from y = 17π ÷ 6 leaves y′ = 5π ÷ 6 ≈ 2.618, which is 2.62 to 2 decimal places. cos y = cos y′ = −√3 ÷ 2, so the real part of e^z is e × (−√3 ÷ 2) ≈ −2.3541, which is −2.35 to 2 decimal places.",
  xp: 100, prereqs: ["q04"],
  sources: [source.s1_7],
  teaching: {
   intuition: "Euler's formula told us what e^(iy) means. For any z = x + yi we put the two parts together: e^z = e^x e^(iy) = e^x(cos y + i sin y). This is the complex exponential. The real part x sets the size, since e^(iy) has modulus 1, so |e^z| = e^x. The imaginary part y sets the direction, as an angle in radians. A whole turn changes nothing, because cos and sin repeat every 2π: e^(z + 2πi) = e^z. A shift that leaves a function unchanged is called a period, so e^z has period 2πi. That is the big change from the real exponential, which never repeats: many different z give the same e^z, and their imaginary parts differ by whole turns of 2π.",
   steps: [
    "Split z into its real part x and its imaginary part y.",
    "The modulus of e^z is e^x.",
    "Add or take away whole turns of 2π from y until the angle lies in the range you want; e^z does not change.",
    "The real part is e^x cos y and the imaginary part is e^x sin y."
   ],
   example: {
    prompt: "For z = 2 + 3πi, find |e^z|, the real part of e^z, and the angle greater than 0 and at most 2π that gives the same value.",
    steps: [
     "|e^z| = e² ≈ 7.3891.",
     "3π − 2π = π, so the angle is π.",
     "The real part is e² cos π = −e² ≈ −7.3891."
    ],
    answer: "|e^z| ≈ 7.39, the real part ≈ −7.39, and the angle is π ≈ 3.14."
   },
   pitfalls: [
    "Taking |e^z| to be e to the power |z|. Only the real part x sets the size.",
    "Changing y by π instead of 2π. Half a turn flips the sign of e^z.",
    "Using degrees for y. The angle is in radians."
   ]
  },
  guidance: [
   { prompt: "The modulus of e^z depends only on x. What is |e^z| = e, to 2 decimal places?", answer: [2.72], labels: ["|e^z|"], explanation: "|e^z| = e^x = e ≈ 2.7183, which is 2.72 to 2 decimal places." },
   { prompt: "Add or take away whole turns of 2π from y = 17π ÷ 6 until the angle is greater than 0 and at most 2π. What is that angle y′, to 2 decimal places?", answer: [2.62], labels: ["y′"], explanation: "17π ÷ 6 − 2π = 5π ÷ 6 ≈ 2.618, which is 2.62 to 2 decimal places." },
   { prompt: "The real part of e^z is e^x cos y, and cos y = cos y′ with y′ = 5π ÷ 6. What is the real part of e^z, to 2 decimal places?", answer: [-2.35], labels: ["Re e^z"], explanation: "cos(5π ÷ 6) = −√3 ÷ 2, so the real part is e × (−√3 ÷ 2) ≈ −2.3541, which is −2.35 to 2 decimal places." }
  ]
 },
 {
  id: "q09", title: "Logging a turn", topic: "The complex logarithm", tier: 'Basic', sector: "Rotor Hall",
  brief: "The rotor log records each turn by a logarithm, and the crew needs the principal value for a new reading.",
  lesson: "The complex logarithm undoes e^z: log z = ln |z| + i(Arg z + 2πk), and its principal value, on the branch −π < Arg z ≤ π, is Log z = ln |z| + i Arg z.",
  prompt: "The rotor log stores each turn z by its complex logarithm. For z = −3 + 4i, enter the real part and the imaginary part of the principal value Log z, each to 2 decimal places.",
  answer: [1.61,2.21], labels: ["Re Log z", "Im Log z"], tolerance: 0.005,
  hints: [
   "Log z = ln |z| + i Arg z, where ln is the natural logarithm and Arg z is the principal argument, between −π and π.",
   "ln |z| = ln √(x² + y²), which is half of ln(x² + y²). For Arg z, find arctan(|y| ÷ |x|) and then use the quadrant z lies in."
  ],
  solution: "|z|² = (−3)² + 4² = 25, so the real part of Log z is ln |z| = ½ ln 25 ≈ 1.6094, which is 1.61 to 2 decimal places. The angle between z and the real axis is arctan(4 ÷ 3) ≈ 0.9273. z lies above the real axis and to the left of the imaginary axis (quadrant 2), so Arg z = π − angle, and the imaginary part of Log z is Arg z ≈ 2.2143, which is 2.21 to 2 decimal places.",
  xp: 100, prereqs: ["q08", "q03"],
  sources: [source.s1_11],
  teaching: {
   intuition: "A logarithm of z is a number w with e^w = z. Write w = u + vi: then e^w has modulus e^u and angle v, so we need e^u = |z|, which gives u = ln |z|, where ln is the natural logarithm, and v must be an argument of z. Since z has many arguments, all differing by whole turns of 2π, the complex logarithm has many values: log z = ln |z| + i(Arg z + 2πk) for every whole number k, positive, negative or 0. That is the period 2πi of e^z seen from the other side. To get one value we pick a branch: a fixed range for the argument. The principal branch uses the principal argument, −π < Arg z ≤ π, and gives the principal value Log z = ln |z| + i Arg z, written with a capital L. Log z has no value at z = 0, which has no argument.",
   steps: [
    "Find |z|. The real part of Log z is ln |z|, and ln √(x² + y²) is half of ln(x² + y²).",
    "Find the principal argument Arg z from the quadrant, between −π and π.",
    "Log z = ln |z| + i Arg z; the other values of log z add 2πki."
   ],
   example: {
    prompt: "Find Log(1 + i).",
    steps: [
     "|1 + i| = √2, so ln |z| = ½ ln 2 ≈ 0.3466.",
     "1 + i is in quadrant 1, at the angle π ÷ 4 ≈ 0.7854.",
     "Log(1 + i) ≈ 0.3466 + 0.7854i."
    ],
    answer: "Log(1 + i) ≈ 0.35 + 0.79i."
   },
   pitfalls: [
    "Taking the logarithm of each part, ln x + i ln y. The real part is ln |z|, the logarithm of the distance from 0.",
    "Using an argument outside −π to π. The principal value needs the principal argument.",
    "Forgetting the factor ½: ln √(x² + y²) is half of ln(x² + y²)."
   ]
  },
  guidance: [
   { prompt: "What is |z|² = (−3)² + 4²?", answer: [25], labels: ["|z|²"], explanation: "9 + 16 = 25." },
   { prompt: "ln |z| is half of ln 25. What is the real part of Log z, to 2 decimal places?", answer: [1.61], labels: ["Re Log z"], explanation: "½ ln 25 ≈ 1.6094, which is 1.61 to 2 decimal places." },
   { prompt: "z lies above the real axis and to the left of the imaginary axis (quadrant 2). What is the imaginary part of Log z, which is Arg z, to 2 decimal places?", answer: [2.21], labels: ["Im Log z"], explanation: "arctan(4 ÷ 3) ≈ 0.9273, and Arg z = π − angle, so Arg z ≈ 2.2143, which is 2.21 to 2 decimal places." }
  ]
 },
 {
  id: "q10", title: "Powers that turn", topic: "Complex powers", tier: 'Basic', sector: "Rotor Hall",
  brief: "The rotor hall sets some stages to complex powers, and the crew needs their principal values and how many values a root can take.",
  lesson: "A complex power is z^a = e^(a log z); its principal value uses Log z, and because log z has many values, z^a can have many too.",
  prompt: "The rotor hall works with complex powers, z^a = e^(a log z), whose principal value uses Log z. Enter the principal value of i^i, which is a real number, to 2 decimal places; then the real part of the principal value of (4i)^1.5, to 2 decimal places; then how many different values v^(1 ÷ 3) has for v = −8, counting every branch of the logarithm.",
  answer: [0.21,-5.66,3], labels: ["principal value", "real part", "number of values"], tolerance: 0.005,
  hints: [
   "Log i = iπ ÷ 2, because |i| = 1 and Arg i = π ÷ 2. Then i to a power bi is e^(bi × iπ ÷ 2), and i × i = −1 makes the exponent real.",
   "For a real power a, the principal value is z^a = |z|^a e^(ia Arg z), so its real part is |z|^a cos(a Arg z). The other branches add 2πki to Log z; with a = 1 ÷ m they turn the value by 2πk ÷ m."
  ],
  solution: "Log i = iπ ÷ 2, so i^i = e^(i × iπ ÷ 2) = e^(−π ÷ 2) ≈ 0.2079, which is 0.21 to 2 decimal places. For z = 4i, |z| = 4 and Arg z = π ÷ 2, so the principal value is z^1.5 = 4^1.5 e^(i × 1.5 × π ÷ 2), with angle 3π ÷ 4. Its real part is 4^1.5 × cos(3π ÷ 4) ≈ −5.6569, which is −5.66 to 2 decimal places. Each branch of the logarithm adds 2πki to Log v, which turns v^(1 ÷ 3) by 2πk ÷ 3; k = 0, 1, 2 give 3 different values, and then they repeat.",
  xp: 100, prereqs: ["q09"],
  sources: [source.s1_11],
  teaching: {
   intuition: "For real numbers a power can be written with the exponential: 2^a = e^(a ln 2). The plane uses the same idea: z^a = e^(a log z). Because log z has many values, so can z^a, and using Log z gives the principal value. Two surprises follow. First, a number to an imaginary power can be real: Log i = iπ ÷ 2, so i^(2i) = e^(2i × iπ ÷ 2) = e^(−π) ≈ 0.0432. Second, the other branches of the logarithm add 2πki to Log z, which multiplies z^a by e^(2πkai). When a is a whole number that factor is 1 and every branch agrees. When a = 1 ÷ n it turns the value by 2πk ÷ n, so z^(1 ÷ n) has exactly n values: the nth roots. For a real power a, the principal value is |z|^a e^(ia Arg z): raise the modulus to the power a and multiply the principal argument by a.",
   steps: [
    "Find Log z = ln |z| + i Arg z.",
    "Multiply by the power a and raise e to the result: the principal value of z^a is e^(a Log z).",
    "For a real power a this is |z|^a e^(ia Arg z), with real part |z|^a cos(a Arg z).",
    "To count the values, add 2πki to Log z and see how many different results the turns give."
   ],
   example: {
    prompt: "Find the principal value of (−1)^i and the real part of the principal value of (9i)^0.5.",
    steps: [
     "Log(−1) = ln 1 + iπ = iπ, so (−1)^i = e^(i × iπ) = e^(−π) ≈ 0.0432.",
     "|9i| = 9 and Arg(9i) = π ÷ 2, so (9i)^0.5 = 3e^(iπ ÷ 4).",
     "Its real part is 3 cos(π ÷ 4) = 3√2 ÷ 2 ≈ 2.1213."
    ],
    answer: "(−1)^i ≈ 0.04, and the real part of (9i)^0.5 is about 2.12."
   },
   pitfalls: [
    "Expecting i^i to be imaginary. i × i = −1 makes the exponent real, so the principal value is a real number.",
    "Raising the parts separately: (x + yi)^a is not x^a + y^a i.",
    "Forgetting the other branches: z^(1 ÷ n) has n values, not one."
   ]
  },
  guidance: [
   { prompt: "Log i = iπ ÷ 2, so i^i = e^(i × iπ ÷ 2). What is it, to 2 decimal places?", answer: [0.21], labels: ["principal value"], explanation: "i × i = −1, so the exponent is −π ÷ 2 and i^i = e^(−π ÷ 2) ≈ 0.2079, which is 0.21 to 2 decimal places." },
   { prompt: "For z = 4i, |z| = 4 and Arg z = π ÷ 2. The real part of z^1.5 is |z|^1.5 cos(1.5 Arg z). What is it, to 2 decimal places?", answer: [-5.66], labels: ["real part"], explanation: "1.5 × π ÷ 2 = 3π ÷ 4, so the real part is 4^1.5 × cos(3π ÷ 4) ≈ −5.6569, which is −5.66 to 2 decimal places." },
   { prompt: "Each branch of the logarithm adds 2πki to Log v, which turns v^(1 ÷ 3) by 2πk ÷ 3. How many different values does v^(1 ÷ 3) take?", answer: [3], labels: ["number of values"], explanation: "k = 0, 1, 2 give 3 different turns; k = 3 is a whole turn and repeats the first value." }
  ]
 }
);
})();
