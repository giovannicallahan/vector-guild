/* Complex analysis: the plane of numbers missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/complex/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Series · Advanced, 200 XP · sector 'Signal Archive' · Power series and radius of convergence [8.2]
     q32  ch 6 Series · Advanced, 200 XP · sector 'Signal Archive' · Taylor coefficients [8.3]
     q33  ch 6 Series · Advanced, 200 XP · sector 'Signal Archive' · Laurent series [8.7]
     q34  ch 6 Series · Advanced, 200 XP · sector 'Signal Archive' · Poles and their order [8.9]
     q35  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · Residues at simple poles [9.4]
     q36  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · Residues at higher-order poles [9.4]
     q37  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · The residue theorem [9.5]
     q38  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · Real integrals along the whole line [10.1]
     q39  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · Trigonometric integrals [10.3]
     q40  ch 7 Residues · Advanced, 200 XP · sector 'Control Room' · Realm review and bridge to Waves [12.1] */
(function(){
'use strict';
/* Orloff, Complex Variables with Applications (MIT), on LibreTexts sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /^Orloff/ (Orloff).
   A title reads like: Orloff, Complex Variables with Applications (LibreTexts) — 9.4 Residues
   Link to the section page itself: https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/<NN>%3A_<Chapter>/<N.MM>%3A_<Section> */
const source = {
 s8_2: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 8.2 Convergence of Power Series', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/08%3A_Taylor_and_Laurent_Series/8.02%3A_Convergence_of_Power_Series', description: 'Power series, the radius and disc of convergence, and finding the radius with the ratio test.', verified: '2026-11-28' },
 s8_3: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 8.3 Taylor Series', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/08%3A_Taylor_and_Laurent_Series/8.03%3A_Taylor_Series', description: 'Taylor’s theorem: an analytic function equals its Taylor series, with coefficients f⁽ⁿ⁾(z₀) ÷ n!.', verified: '2026-11-28' },
 s8_7: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 8.7 Laurent Series', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/08%3A_Taylor_and_Laurent_Series/8.07%3A_Laurent_Series', description: 'Laurent series on an annulus, their principal part, and how the series depends on the annulus.', verified: '2026-11-28' },
 s8_9: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 8.9 Poles', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/08%3A_Taylor_and_Laurent_Series/8.09%3A_Poles', description: 'Removable singularities, poles of order k and essential singularities, read from the Laurent series.', verified: '2026-11-28' },
 s9_4: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 9.4 Residues', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/09%3A_Residue_Theorem/9.04%3A_Residues', description: 'The residue as the coefficient of 1 ÷ (z − z₀), p(z₀) ÷ q′(z₀) at a simple pole, and the derivative formula at a pole of order k.', verified: '2026-11-28' },
 s9_5: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 9.5 Cauchy Residue Theorem', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/09%3A_Residue_Theorem/9.05%3A_Cauchy_Residue_Theorem', description: 'The integral round a simple closed curve, anticlockwise, is 2πi times the sum of the residues inside.', verified: '2026-11-28' },
 s10_1: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 10.1 Integrals of functions that decay', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/10%3A_Definite_Integrals_Using_the_Residue_Theorem/10.01%3A_Integrals_of_functions_that_decay', description: 'Why the integral over a large semicircle tends to 0 when the function decays faster than 1 ÷ |z|.', verified: '2026-11-28' },
 s10_3: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 10.3 Trigonometric Integrals', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/10%3A_Definite_Integrals_Using_the_Residue_Theorem/10.03%3A_Trigonometric_Integrals', description: 'Turning an integral over 0 to 2π in cos θ and sin θ into a contour integral round |z| = 1 with z = e^(iθ).', verified: '2026-11-28' },
 s12_1: { title: 'Orloff, Complex Variables with Applications (LibreTexts) — 12.1 Principle of the Argument', url: 'https://math.libretexts.org/Bookshelves/Analysis/Complex_Variables_with_Applications_(Orloff)/12%3A_Argument_Principle/12.01%3A_Principle_of_the_Argument', description: 'The integral of f′ ÷ f counts zeros minus poles inside a curve, and equals the winding number of the image curve round 0.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q31', title: 'How far the archive reaches', topic: 'Power series and radius of convergence', tier: 'Advanced', sector: 'Signal Archive',
  brief: 'The archive stores each signal as an endless sum of powers, and the crew must know for which points of the plane that sum still gives a number.',
  lesson: 'A power series Σ aₙzⁿ converges inside a disc |z| < R and diverges outside it; the ratio test finds R.',
  prompt: 'The signal archive stores a signal as the power series Σ aₙzⁿ, summed over n = 1, 2, 3, … without end, with coefficients aₙ = n² ÷ 6ⁿ. Use the ratio test to find its radius of convergence R, and enter it. Then enter the modulus |z₀| of the test point z₀ = 3 + 4i, and enter 1 if the series converges at z₀ or 0 if it diverges there.',
  answer: [6, 5, 1], labels: ['radius R', '|z₀|', 'converges at z₀ (1 or 0)'], tolerance: 0.01,
  hints: [
   'Divide the size of term n + 1 by the size of term n, |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ|, and let n grow. The series converges where that limit is less than 1 and diverges where it is more than 1.',
   'The modulus of x + yi is √(x² + y²). A point closer to 0 than R lies inside the disc of convergence; a point farther away lies outside it.'
  ],
  solution: 'The sizes of neighbouring terms have the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ((n + 1) ÷ n)² × |z| ÷ 6. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to |z| ÷ 6. That is less than 1 exactly when |z| < 6, so the radius of convergence is R = 6. The test point has |z₀| = √(3² + 4²) = √25 = 5. 5 is less than 6, so z₀ lies inside the disc of convergence and the series converges there: enter 1.',
  xp: 200, prereqs: ['q30'],
  artifact: { name: 'Reach chart', description: 'A disc drawn round 0: inside it the archive’s sums settle, outside they run away.' },
  sources: [source.s8_2],
  teaching: {
   intuition: 'The geometric series 1 + z + z² + … adds up only when |z| < 1. A power series is the same kind of sum with a coefficient in front of each power: Σ aₙzⁿ = a₀ + a₁z + a₂z² + …, centred at 0. For each z it either settles on one number (it converges) or it does not. The striking fact in the plane is that the points where it converges always fill a disc: there is a number R, the radius of convergence, so that the series converges for every z with |z| < R and diverges for every z with |z| > R. That open disc is the disc of convergence. Only points exactly on the circle |z| = R need a separate look. To find R, use the ratio test from Calculus 2 on the sizes of the terms: if |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| tends to a limit below 1 the series converges, above 1 it diverges.',
   steps: [
    'Write the ratio of the sizes of neighbouring terms: |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = |aₙ₊₁ ÷ aₙ| × |z|.',
    'Let n grow and find the limit of |aₙ₊₁ ÷ aₙ| × |z|. Any factor such as ((n + 1) ÷ n)² tends to 1.',
    'Set the limit below 1 and solve for |z|: the bound you get is the radius of convergence R.',
    'For a given point, work out its modulus. If it is below R the series converges there; if it is above R it diverges.'
   ],
   example: {
    prompt: 'Find the radius of convergence of Σ aₙzⁿ with aₙ = n ÷ 3ⁿ, and say whether it converges at z = 2i.',
    steps: [
     'The ratio of neighbouring terms is ((n + 1) ÷ n) × |z| ÷ 3, which tends to |z| ÷ 3.',
     'That is below 1 exactly when |z| < 3, so R = 3.',
     '|2i| = 2, which is less than 3, so 2i is inside the disc of convergence.'
    ],
    answer: 'R = 3, and the series converges at 2i.'
   },
   pitfalls: [
    'Comparing the point itself with R instead of its modulus. A point such as 3 + 4i is compared through |3 + 4i| = 5.',
    'Taking R as the limit of the ratio of coefficients instead of its reciprocal: if |aₙ₊₁ ÷ aₙ| tends to 1 ÷ 6, then R is 6, not 1 ÷ 6.',
    'Letting a power of n change the radius. Factors like n² only change the ratio by ((n + 1) ÷ n)², which tends to 1.'
   ]
  },
  guidance: [
   { prompt: 'As n grows, the ratio |aₙ₊₁zⁿ⁺¹| ÷ |aₙzⁿ| = ((n + 1) ÷ n)² × |z| ÷ 6 tends to |z| ÷ 6. The series converges where this limit is less than 1. What is the radius of convergence R?', answer: [6], labels: ['radius R'], explanation: '|z| ÷ 6 < 1 exactly when |z| < 6, so R = 6: the series converges on the open disc |z| < 6 and diverges outside it.' },
   { prompt: 'What is the modulus of the test point z₀ = 3 + 4i?', answer: [5], labels: ['|z₀|'], explanation: '|z₀| = √(3² + 4²) = √25 = 5, its distance from 0.' },
   { prompt: 'Compare |z₀| = 5 with R = 6. Enter 1 if the series converges at z₀, 0 if it diverges there.', answer: [1], labels: ['converges at z₀ (1 or 0)'], explanation: '5 < 6: z₀ is inside the disc of convergence, so the series converges there.' }
  ]
 },
 {
  id: 'q32', title: 'Reading the archive’s coefficients', topic: 'Taylor coefficients', tier: 'Advanced', sector: 'Signal Archive',
  brief: 'Two signals have to be stored as lists of numbers, one number for each power of z, and the archive needs particular entries of those lists.',
  lesson: 'An analytic function equals its Taylor series about a point, and the coefficient of zⁿ about 0 is f⁽ⁿ⁾(0) ÷ n!.',
  prompt: 'The archive rebuilds two signals out of simple powers of z. Signal F is f(z) = e^(3z) and signal G is g(z) = 1 ÷ (1 + 2z), each written as its Taylor series about z = 0. Enter the Taylor coefficient of z⁴ in f as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z⁵ in g.',
  answer: [27, 8, -32], labels: ['numerator', 'denominator', 'coefficient in g'], tolerance: 0.01,
  hints: [
   'The Taylor coefficient of zⁿ about 0 is f⁽ⁿ⁾(0) ÷ n!. Each derivative of e^(az) brings down one more factor a.',
   'Put w = bz in the geometric series 1 ÷ (1 − w) = 1 + w + w² + …; the coefficient of zⁿ is then bⁿ.'
  ],
  solution: 'Each derivative of e^(3z) brings down another factor 3, so f⁽ⁿ⁾(0) = 3ⁿ and the coefficient of zⁿ is 3ⁿ ÷ n!. For n = 4 it is 3⁴ ÷ 4! = 81 ÷ 24, which is 27 ÷ 8 in lowest terms. For g, write 1 ÷ (1 + 2z) as 1 ÷ (1 − w) with w = −2z. The geometric series 1 + w + w² + … gives g(z) = Σ (−2)ⁿzⁿ for |z| < 1 ÷ 2, so the coefficient of z⁵ is (−2)⁵ = −32.',
  xp: 200, prereqs: ['q31', 'q25'],
  artifact: { name: 'Coefficient ledger', description: 'Two columns of Taylor coefficients, one entry for each power of z.' },
  sources: [source.s8_3],
  teaching: {
   intuition: 'Cauchy’s formula for derivatives says that an analytic function has derivatives of every order. Taylor’s theorem in the plane turns that into a series: near a point where f is analytic, f(z) equals its Taylor series about that point, and about 0 it reads f(z) = Σ cₙzⁿ with cₙ = f⁽ⁿ⁾(0) ÷ n!. The number cₙ is the Taylor coefficient of zⁿ, and the series is the only power series that equals f near 0, so any way of finding it gives the same coefficients. Two ways are used here. The complex exponential e^(az) has derivative ae^(az), just as a real exponential does, so for e^(az) every derivative brings down one more factor a, so the coefficient of zⁿ is aⁿ ÷ n!. For 1 ÷ (1 − bz), the geometric series with w = bz gives 1 + bz + b²z² + …, so the coefficient of zⁿ is bⁿ, valid while |bz| < 1.',
   steps: [
    'For the coefficient of zⁿ about 0, find the nth derivative f⁽ⁿ⁾(z) and put z = 0.',
    'Divide by n! = 1 × 2 × … × n, and reduce the fraction to lowest terms.',
    'For a function of the form 1 ÷ (1 − w), use the geometric series 1 + w + w² + … with w the expression in the bottom, and read off the power you need.',
    'Check that the series is used where it holds: the geometric series needs |w| < 1.'
   ],
   example: {
    prompt: 'Find the coefficient of z³ in the Taylor series of e^(2z) about 0, and the coefficient of z² in that of 1 ÷ (1 − 3z).',
    steps: [
     'The third derivative of e^(2z) is 2³e^(2z), which is 8 at z = 0. Dividing by 3! = 6 gives 8 ÷ 6 = 4 ÷ 3.',
     'With w = 3z, 1 ÷ (1 − 3z) = 1 + 3z + 9z² + …, so the coefficient of z² is 9.'
    ],
    answer: '4 ÷ 3 for e^(2z), and 9 for 1 ÷ (1 − 3z).'
   },
   pitfalls: [
    'Forgetting to divide by n!: the nth derivative at 0 is not yet the coefficient.',
    'Dropping the sign of a negative a or b. With a = −3, the coefficient of z³ is (−3)³ ÷ 3! = −27 ÷ 6, which is negative.',
    'Leaving the fraction unreduced: 81 ÷ 24 is 27 ÷ 8 in lowest terms.'
   ]
  },
  guidance: [
   { prompt: 'What is the 4th derivative of f(z) = e^(3z), at z = 0?', answer: [81], labels: ['the derivative at 0'], explanation: 'Each derivative multiplies by 3, so the 4th derivative is 3⁴e^(3z), which is 81 at z = 0.' },
   { prompt: 'The Taylor coefficient divides that derivative by 4!. What is 4!?', answer: [24], labels: ['the factorial'], explanation: '4! = 1 × 2 × 3 × 4 = 24, so the coefficient is 81 ÷ 24 = 27 ÷ 8.' },
   { prompt: 'In g(z) = 1 ÷ (1 + 2z) = 1 + w + w² + … with w = −2z, what is the coefficient of z⁵?', answer: [-32], labels: ['coefficient in g'], explanation: 'The term w⁵ is (−2z)⁵ = (−2)⁵z⁵, so the coefficient is −32.' }
  ]
 },
 {
  id: 'q33', title: 'Signals that blow up at the origin', topic: 'Laurent series', tier: 'Advanced', sector: 'Signal Archive',
  brief: 'Some archive signals are infinite at z = 0, and the crew still wants to store them as sums of powers of z.',
  lesson: 'On an annulus where f is analytic, f equals a Laurent series Σ cₙzⁿ with negative powers allowed; the negative powers are its principal part.',
  prompt: 'Two archive signals blow up at z = 0. Signal H is h(z) = z² e^(2 ÷ z), for every z ≠ 0. Signal G is g(z) = 12 ÷ (z(z + 2)), on the annulus 0 < |z| < 2. Enter the coefficient of z⁻¹ in the Laurent series of h as a fraction in lowest terms, numerator first and then denominator (a minus sign goes on the numerator). Then enter the coefficient of z⁻¹ and the coefficient of z⁰ in the Laurent series of g on that annulus.',
  answer: [4, 3, 6, -3], labels: ['numerator', 'denominator', 'z⁻¹ coefficient of g', 'z⁰ coefficient of g'], tolerance: 0.01,
  hints: [
   'In eʷ = 1 + w + w² ÷ 2! + w³ ÷ 3! + …, put w = a ÷ z, then multiply every term by the power of z in front. Pick the term that ends up as z⁻¹.',
   'On 0 < |z| < |c|, write 1 ÷ (z − c) = −(1 ÷ c) × 1 ÷ (1 − z ÷ c), expand that as a geometric series in z ÷ c, and then divide every term by z.'
  ],
  solution: 'Putting w = 2 ÷ z in the series of eʷ gives e^(2 ÷ z) = Σ 2ⁿz⁻ⁿ ÷ n!, summed over n = 0, 1, 2, … Multiplying by z² raises every power by 2, so the z⁻¹ term comes from n = 3: its coefficient is 2³ ÷ 3! = 8 ÷ 6, which is 4 ÷ 3 in lowest terms. For g, |z| < 2 means |z ÷ (−2)| < 1, so 1 ÷ (z − c) = −(1 ÷ c)(1 + z ÷ c + z² ÷ c² + …) with c = −2. Multiplying by 12 ÷ z gives g(z) = −(12 ÷ (−2))z⁻¹ − 12 ÷ 4 − … The z⁻¹ coefficient is −12 ÷ (−2) = 6 and the z⁰ coefficient is −12 ÷ 4 = −3.',
  xp: 200, prereqs: ['q32'],
  artifact: { name: 'Two-sided ledger', description: 'A ledger of coefficients that runs both ways: positive powers of z and negative ones.' },
  sources: [source.s8_7],
  teaching: {
   intuition: 'A Taylor series cannot describe a function that is infinite at its centre, because every power zⁿ with n ≥ 0 is finite there. The fix is to allow negative powers as well: z⁻¹ = 1 ÷ z, z⁻² = 1 ÷ z², and so on. A series Σ cₙzⁿ over all whole numbers n, negative ones included, is a Laurent series. It lives on an annulus, a ring between two circles round the centre, such as 0 < |z| < 2: the function must be analytic on the ring, but may blow up inside the inner circle. The terms with negative powers are the principal part. The same function can have different Laurent series on different annuli, so always say which ring you mean. Two tricks find the coefficients. Substituting w = a ÷ z into a known series, such as that of eʷ, gives negative powers directly. A fraction such as 1 ÷ (z − c) on |z| < |c| becomes a geometric series in z ÷ c.',
   steps: [
    'Name the annulus where the series must hold, for example 0 < |z| < 3.',
    'Rewrite the function with a known series: put w = a ÷ z into eʷ = 1 + w + w² ÷ 2! + …, or write 1 ÷ (z − c) = −(1 ÷ c) × 1 ÷ (1 − z ÷ c) when |z| < |c|.',
    'Multiply out any power of z in front: z to the power m times z⁻ⁿ is z to the power m − n.',
    'Collect the terms with the power you want and read off the coefficient.'
   ],
   example: {
    prompt: 'Find the coefficient of z⁻¹ in z e^(3 ÷ z), and the coefficients of z⁻¹ and z⁰ in 8 ÷ (z(z − 2)) on 0 < |z| < 2.',
    steps: [
     'e^(3 ÷ z) = 1 + 3z⁻¹ + 9z⁻² ÷ 2! + … Multiplying by z, the z⁻¹ term comes from the z⁻² term: 9 ÷ 2.',
     'On |z| < 2, 1 ÷ (z − 2) = −(1 ÷ 2)(1 + z ÷ 2 + z² ÷ 4 + …).',
     'Multiplying by 8 ÷ z: 8 ÷ (z(z − 2)) = −4z⁻¹ − 2 − z − …'
    ],
    answer: '9 ÷ 2 for z e^(3 ÷ z); −4 and −2 for 8 ÷ (z(z − 2)).'
   },
   pitfalls: [
    'Using the expansion for the wrong annulus. On |z| > |c| one expands in c ÷ z instead, and the coefficients change.',
    'Losing the minus sign in 1 ÷ (z − c) = −(1 ÷ c) × 1 ÷ (1 − z ÷ c).',
    'Picking the term n = m instead of n = m + 1: to end with z⁻¹ after multiplying by zᵐ, the series term must be z to the power −(m + 1).'
   ]
  },
  guidance: [
   { prompt: 'The series of e^(2 ÷ z) has terms 2ⁿz⁻ⁿ ÷ n!. Which n gives the term that becomes z⁻¹ once it is multiplied by z²?', answer: [3], labels: ['n'], explanation: 'z² × z⁻ⁿ = z to the power 2 − n, which is z⁻¹ when n = 3.' },
   { prompt: 'On 0 < |z| < 2, g(z) = 12 ÷ z × 1 ÷ (z − c) with c = −2, and 1 ÷ (z − c) = −(1 ÷ c)(1 + z ÷ c + …). What is the coefficient of z⁻¹ in g?', answer: [6], labels: ['z⁻¹ coefficient of g'], explanation: 'The first term is 12 ÷ z × (−1 ÷ (−2)), so the z⁻¹ coefficient is −12 ÷ (−2) = 6.' },
   { prompt: 'What is the coefficient of z⁰ in g, the constant term?', answer: [-3], labels: ['z⁰ coefficient of g'], explanation: 'The next term is 12 ÷ z × (−1 ÷ (−2)) × z ÷ (−2), a constant: −12 ÷ 4 = −3.' }
  ]
 },
 {
  id: 'q34', title: 'Sorting the archive’s blow-ups', topic: 'Poles and their order', tier: 'Advanced', sector: 'Signal Archive',
  brief: 'The archive files every point where a filter misbehaves by how badly it misbehaves, and two filters are waiting to be filed.',
  lesson: 'An isolated singularity is a removable singularity, a pole of order k or an essential singularity, according to how many negative powers its Laurent series has.',
  prompt: 'Two archive filters have singularities. Filter F is f(z) = (z + 1) ÷ ((z − 2)³(z + 1)). Enter the order of the pole of f at z = 2. Then enter 1 if the singularity of f at z = −1 is removable, or 0 if it is not. Filter S is s(z) = sin z ÷ z³: enter the order of its pole at z = 0.',
  answer: [3, 1, 2], labels: ['order at a', 'removable at c (1 or 0)', 'order of s at 0'], tolerance: 0.01,
  hints: [
   'The order of a pole at a is the power of (z − a) left on the bottom once any factor that also appears on the top has cancelled.',
   'Expand sin z as z − z³ ÷ 3! + z⁵ ÷ 5! − … and divide each term by the power of z on the bottom. The most negative power left gives the order.'
  ],
  solution: 'Near z = 2, the rest of f, (z + 1) ÷ (z + 1), is analytic and not 0, so f is a non-zero analytic function divided by (z − 2)³: a pole of order 3. At z = −1 the top (z + 1) is the same factor as (z + 1) on the bottom, so they cancel: f(z) = 1 ÷ (z − 2)³ for z ≠ −1, which has a finite value at −1. The singularity there is removable: enter 1. For s, sin z = z − z³ ÷ 3! + z⁵ ÷ 5! − …, so dividing by z³ gives s(z) = z⁻² − 1 ÷ 6 + … The most negative power is z⁻², so s has a pole of order 2 at 0.',
  xp: 200, prereqs: ['q33'],
  artifact: { name: 'Singularity file', description: 'A card for each blow-up: removable, a pole with its order, or essential.' },
  sources: [source.s8_9],
  teaching: {
   intuition: 'A singularity of f is a point where f is not analytic. It is isolated when f is analytic on a small punctured disc 0 < |z − a| < r round it, so f has a Laurent series there, and the negative powers sort the singularity into three kinds. If there are no negative powers at all, the singularity is removable: f only lacks a value at a, and giving it the right one makes f analytic. If the most negative power is (z − a)⁻ᵏ, f has a pole of order k at a; a pole of order 1 is a simple pole. If infinitely many negative powers appear, as for e^(1 ÷ z) at 0, the singularity is essential. For a fraction, cancel any factor that the top and bottom share; then the power of (z − a) left on the bottom is the order of the pole. A function such as sin z ÷ z³ is easiest to sort with the Taylor series of sin z, which is the same as for real sin x and holds for every complex z: sin z = z − z³ ÷ 3! + z⁵ ÷ 5! − …',
   steps: [
    'Factor the top and the bottom, and cancel any factor (z − a) that appears on both.',
    'If no factor (z − a) is left on the bottom, the singularity at a is removable.',
    'Otherwise the power k of (z − a) left on the bottom is the order of the pole at a, provided the rest of the function is not 0 at a.',
    'For functions such as sin z ÷ zᵖ, expand the top as a series, divide term by term, and find the most negative power.'
   ],
   example: {
    prompt: 'For (z − 4) ÷ ((z + 1)²(z − 5)), find the order of the pole at −1 and say whether the singularity at 5 is removable. Then find the order of the pole of sin z ÷ z⁴ at 0.',
    steps: [
     'Near −1 the top is −5 and z − 5 is −6, neither 0, so the pole at −1 has order 2.',
     'At 5 the top is 1, not 0, so nothing cancels z − 5: it is a simple pole, not removable.',
     'sin z ÷ z⁴ = z⁻³ − z⁻¹ ÷ 6 + …, so the pole at 0 has order 3.'
    ],
    answer: 'Order 2 at −1; not removable at 5 (a simple pole); order 3 for sin z ÷ z⁴.'
   },
   pitfalls: [
    'Reading the order straight off the bottom without cancelling a factor that the top shares.',
    'Taking the power on the bottom of sin z ÷ zᵖ as the order. sin z already has a factor z, so the order is one less.',
    'Calling any blow-up a pole. e^(1 ÷ z) has infinitely many negative powers: its singularity at 0 is essential, not a pole of any order.'
   ]
  },
  guidance: [
   { prompt: 'What power of (z − 2) is on the bottom of f, with nothing on the top to cancel it?', answer: [3], labels: ['power of (z − a)'], explanation: 'The bottom has (z − 2)³ and the top (z + 1) is not 0 at z = 2, so the pole at 2 has order 3.' },
   { prompt: 'What is the value of the top, z + 1, at z = −1?', answer: [0], labels: ['top at c'], explanation: 'It is −1 − (−1) = 0: the top has the same factor as the bottom, so they cancel and the singularity at −1 is removable.' },
   { prompt: 'In the series of s(z) = sin z ÷ z³, what is the lowest power of z? Enter its exponent.', answer: [-2], labels: ['lowest exponent'], explanation: 'The first term of sin z is z, and z ÷ z³ = z⁻². So the lowest power is −2, and the pole has order 2.' }
  ]
 },
 {
  id: 'q35', title: 'One number per pole', topic: 'Residues at simple poles', tier: 'Advanced', sector: 'Control Room',
  brief: 'The control room wants each pole of a transfer function summed up by a single number, so that later integrals become quick sums.',
  lesson: 'The residue of f at a is the coefficient of (z − a)⁻¹ in its Laurent series; at a simple pole of p ÷ q it equals p(a) ÷ q′(a).',
  prompt: 'A control-room transfer function is f(z) = (−3z + 11) ÷ (z² + 2z − 3). Its bottom is 0 at z = 1 and at z = −3, and both are simple poles. Enter the residue of f at z = 1, then the residue of f at z = −3.',
  answer: [2, -5], labels: ['residue at the first pole', 'residue at the second pole'], tolerance: 0.01,
  hints: [
   'At a simple pole a of p(z) ÷ q(z), where p(a) is not 0, the residue is p(a) ÷ q′(a).',
   'Differentiate the bottom first: the derivative of z² + Bz + C is 2z + B. Then put each pole into the top and into q′.'
  ],
  solution: 'Here p(z) = −3z + 11 and q(z) = z² + 2z − 3, so q′(z) = 2z + 2. At z = 1: p(1) = 8 and q′(1) = 4, so the residue is 8 ÷ 4 = 2. At z = −3: p(−3) = 20 and q′(−3) = −4, so the residue is 20 ÷ (−4) = −5.',
  xp: 200, prereqs: ['q34'],
  artifact: { name: 'Residue register', description: 'One line for each pole, holding the single number that matters for integrals.' },
  sources: [source.s9_4],
  teaching: {
   intuition: 'Round a small circle about a pole, every term (z − a)ⁿ of the Laurent series integrates to 0 except (z − a)⁻¹, which gives 2πi. So of all the coefficients, only the one in front of (z − a)⁻¹ matters for integrals. It is called the residue of f at a, written Res(f, a). At a simple pole there is a quick way to find it without the whole series. If f = p ÷ q, where p and q are analytic, q(a) = 0, q′(a) ≠ 0 and p(a) ≠ 0, then near a we have q(z) ≈ q′(a)(z − a), so f(z) ≈ (p(a) ÷ q′(a)) × 1 ÷ (z − a), and the residue is p(a) ÷ q′(a). The derivative q′ is taken just as for real polynomials.',
   steps: [
    'Check that the pole is simple: the bottom q is 0 at a, its derivative q′(a) is not 0, and the top p(a) is not 0.',
    'Differentiate the bottom to get q′(z).',
    'Put a into the top and into q′.',
    'Divide: Res(f, a) = p(a) ÷ q′(a).'
   ],
   example: {
    prompt: 'Find the residues of (3z + 2) ÷ (z² − 1) at z = 1 and at z = −1.',
    steps: [
     'q(z) = z² − 1, so q′(z) = 2z.',
     'At 1: p(1) = 5 and q′(1) = 2, so the residue is 5 ÷ 2.',
     'At −1: p(−1) = −1 and q′(−1) = −2, so the residue is 1 ÷ 2.'
    ],
    answer: '5 ÷ 2 at z = 1 and 1 ÷ 2 at z = −1.'
   },
   pitfalls: [
    'Dividing by q(a), which is 0, instead of by q′(a).',
    'Forgetting the sign of q′(a): at the smaller of two real poles of z² + Bz + C, q′ is negative.',
    'Using p(a) ÷ q′(a) at a pole that is not simple. At a pole of order 2 or more, q′(a) is 0 and another rule is needed.'
   ]
  },
  guidance: [
   { prompt: 'The bottom is q(z) = z² + 2z − 3. What is q′(z) at z = 1?', answer: [4], labels: ['q′ at the first pole'], explanation: 'q′(z) = 2z + 2, so q′(1) = 4.' },
   { prompt: 'What is the top, p(z) = −3z + 11, at z = 1?', answer: [8], labels: ['top at the first pole'], explanation: 'p(1) = 8, so the residue at 1 is 8 ÷ 4 = 2.' },
   { prompt: 'Now the second pole. What is the residue of f at z = −3?', answer: [-5], labels: ['residue at the second pole'], explanation: 'p(−3) = 20 and q′(−3) = −4, so the residue is 20 ÷ (−4) = −5.' }
  ]
 },
 {
  id: 'q36', title: 'Poles that sit twice', topic: 'Residues at higher-order poles', tier: 'Advanced', sector: 'Control Room',
  brief: 'Two control-room filters have poles of order 2 and 3, where the quick rule for simple poles no longer works.',
  lesson: 'At a pole of order k, with f = g ÷ (z − a)ᵏ and g analytic at a, the residue is g⁽ᵏ⁻¹⁾(a) ÷ (k − 1)!.',
  prompt: 'Two control-room filters share the top g(z) = z³ − 2z² + 5z + 1. Filter A is f(z) = g(z) ÷ (z − 2)², with a pole of order 2 at z = 2, and filter B is h(z) = g(z) ÷ (z − 2)³, with a pole of order 3 there. Enter the residue of f at z = 2, then the residue of h at z = 2.',
  answer: [9, 4], labels: ['residue of f', 'residue of h'], tolerance: 0.01,
  hints: [
   'At a pole of order k at a, write the function as g(z) ÷ (z − a)ᵏ with g analytic at a. The residue is the (k − 1)th derivative of g at a, divided by (k − 1)!.',
   'For order 2 that is g′(a) ÷ 1!; for order 3 it is g″(a) ÷ 2!.'
  ],
  solution: 'g(2) = 11, not 0, so the orders really are 2 and 3. g′(z) = 3z² − 4z + 5 and g″(z) = 6z − 4. For f, of order 2: the residue is g′(2) ÷ 1! = 9. For h, of order 3: the residue is g″(2) ÷ 2! = 8 ÷ 2 = 4.',
  xp: 200, prereqs: ['q35'],
  artifact: { name: 'Higher-order register', description: 'Residues at poles of order 2 and 3, each found from one derivative.' },
  sources: [source.s9_4],
  teaching: {
   intuition: 'When a pole has order k, write f(z) = g(z) ÷ (z − a)ᵏ, where g is analytic at a and g(a) ≠ 0. The Taylor series of g about a is g(a) + g′(a)(z − a) + g″(a)(z − a)² ÷ 2! + … Dividing every term by (z − a)ᵏ lowers each power by k, so the term that ends up as (z − a)⁻¹ is the one with (z − a)ᵏ⁻¹ in the series of g. Its coefficient is g⁽ᵏ⁻¹⁾(a) ÷ (k − 1)!, and that is the residue. For k = 1 this is just g(a), the simple-pole case. For k = 2 it is g′(a), and for k = 3 it is g″(a) ÷ 2.',
   steps: [
    'Write the function as g(z) ÷ (z − a)ᵏ, with g analytic at a, and check that g(a) is not 0, so the order really is k.',
    'Differentiate g k − 1 times.',
    'Put z = a into that derivative.',
    'Divide by (k − 1)!: the result is the residue.'
   ],
   example: {
    prompt: 'Find the residues at z = 1 of (z³ + z) ÷ (z − 1)² and of (z³ + z) ÷ (z − 1)³.',
    steps: [
     'g(z) = z³ + z and g(1) = 2, not 0. g′(z) = 3z² + 1 and g″(z) = 6z.',
     'Order 2: the residue is g′(1) ÷ 1! = 4.',
     'Order 3: the residue is g″(1) ÷ 2! = 6 ÷ 2 = 3.'
    ],
    answer: '4 for the pole of order 2, and 3 for the pole of order 3.'
   },
   pitfalls: [
    'Using the kth derivative instead of the (k − 1)th: for a pole of order 2 the residue uses g′, not g″.',
    'Forgetting to divide by (k − 1)!: at a pole of order 3 the second derivative must be halved.',
    'Differentiating f itself instead of g = (z − a)ᵏ f.'
   ]
  },
  guidance: [
   { prompt: 'What is g(2)? If it is not 0, the orders of the poles really are 2 and 3.', answer: [11], labels: ['g at the pole'], explanation: 'g(2) = 11, which is not 0.' },
   { prompt: 'What is g′(2)?', answer: [9], labels: ['g′ at the pole'], explanation: 'g′(z) = 3z² − 4z + 5, so g′(2) = 9. For the pole of order 2 that is the residue, since 1! = 1.' },
   { prompt: 'What is g″(2)?', answer: [8], labels: ['g″ at the pole'], explanation: 'g″(z) = 6z − 4, so g″(2) = 8. Dividing by 2! = 2 gives the residue of h, 4.' }
  ]
 },
 {
  id: 'q37', title: 'The quick sum round the loop', topic: 'The residue theorem', tier: 'Advanced', sector: 'Control Room',
  brief: 'The control room has to integrate a field once round a circular loop, and wants the answer from a few residues instead of a long calculation.',
  lesson: 'Once anticlockwise round a simple closed curve, ∮ f(z) dz = 2πi times the sum of the residues of f at the poles inside.',
  prompt: 'The control room needs ∮ f(z) dz once anticlockwise round the circle |z| = 3, where f(z) = 3 ÷ (z − 1) − 2 ÷ (z − 4i) + 5 ÷ (z + 2)². Enter how many poles of f lie inside the circle, then the number k with ∮ f(z) dz = kπi.',
  answer: [2, 6], labels: ['poles inside', 'k'], tolerance: 0.01,
  hints: [
   'Once anticlockwise round a closed curve, ∮ f(z) dz is 2πi times the sum of the residues of f at the poles inside the curve. Poles outside do not count.',
   'A term A ÷ (z − p) has residue A at p. A term C ÷ (z − p)² has residue 0 there, because it has no (z − p)⁻¹ part.'
  ],
  solution: 'The poles are at 1, modulus 1, inside; 4i, modulus 4, outside; and −2, modulus 2, inside. So 2 of them lie inside |z| = 3. The residues are 3 at 1, −2 at 4i and 0 at −2, because 5 ÷ (z + 2)² has no (z − p)⁻¹ part. The residues inside are 3 at 1 and 0 at −2, with sum 3. By the residue theorem, ∮ f(z) dz = 2πi × 3 = 6πi, so k = 6.',
  xp: 200, prereqs: ['q36', 'q22'],
  artifact: { name: 'Loop ledger', description: 'A circle, the poles it holds, and the integral as 2πi times their residues.' },
  sources: [source.s9_5],
  teaching: {
   intuition: 'Inside a simple closed curve, a curve that does not cross itself, take f analytic except at a few isolated poles, none of them on the curve. Shrink the curve onto small circles round each pole inside, which Cauchy’s theorem allows. Round each small circle, once anticlockwise, only the (z − a)⁻¹ term of the Laurent series survives, and it gives 2πi times the residue. So ∮ f(z) dz = 2πi × (sum of the residues of f at the poles inside the curve). This is the residue theorem. Poles outside the curve add nothing, and a term such as C ÷ (z − a)² has no (z − a)⁻¹ part, so its residue is 0. A point is inside the circle |z| = R when its modulus is less than R.',
   steps: [
    'List the poles of f and their moduli. Those with modulus less than R are inside |z| = R; none may lie on the circle.',
    'Find the residue at each pole inside. A term A ÷ (z − a) gives A; a term C ÷ (z − a)² gives 0.',
    'Add the residues inside.',
    'Multiply by 2πi. Writing the result as kπi, k is twice the sum of the residues.'
   ],
   example: {
    prompt: 'Find k with ∮ f(z) dz = kπi once anticlockwise round |z| = 3, for f(z) = 1 ÷ (z − 2) + 4 ÷ (z − 5i).',
    steps: [
     '|2| = 2 is inside the circle; |5i| = 5 is outside.',
     'The residue at 2 is 1. The pole at 5i does not count.',
     '∮ f(z) dz = 2πi × 1 = 2πi.'
    ],
    answer: 'k = 2.'
   },
   pitfalls: [
    'Adding the residues of every pole, including those outside the curve.',
    'Giving a term C ÷ (z − a)² the residue C. Its residue is 0, because it has no (z − a)⁻¹ part.',
    'Forgetting the factor 2: ∮ f dz = 2πi × (sum), so k is twice the sum of the residues.'
   ]
  },
  guidance: [
   { prompt: 'What is the residue of f at its double pole, z = −2?', answer: [0], labels: ['residue at the double pole'], explanation: 'Near −2 the term 5 ÷ (z + 2)² has no (z − p)⁻¹ part, and the other two terms are analytic there, so the residue is 0.' },
   { prompt: 'A pole is inside |z| = 3 when its modulus is less than 3. How many of the three poles are inside?', answer: [2], labels: ['poles inside'], explanation: 'The moduli are 1, 4 and 2, so 2 of them are less than 3.' },
   { prompt: 'What is the sum of the residues at the poles inside the circle?', answer: [3], labels: ['sum of residues inside'], explanation: 'The residues inside are 3 at 1 and 0 at −2, so the sum is 3, and ∮ f(z) dz = 2πi × 3 = 6πi.' }
  ]
 },
 {
  id: 'q38', title: 'Integrals the whole way along', topic: 'Real integrals along the whole line', tier: 'Advanced', sector: 'Control Room',
  brief: 'Two signal strengths are integrals over the whole real line, and the control room wants their exact values from the residue theorem.',
  lesson: 'For a rational function that shrinks like 1 ÷ x² or faster, ∫ from −∞ to ∞ equals 2πi times the sum of its residues in the upper half-plane.',
  prompt: 'The control room needs two improper integrals along the whole real line, from −∞ to ∞: I₁ = ∫ 6 dx ÷ (x² + 9) and I₂ = ∫ 36 dx ÷ ((x² + 1)(x² + 9)). Each equals a whole number times π. Enter k₁ with I₁ = k₁π, then k₂ with I₂ = k₂π.',
  answer: [2, 3], labels: ['k₁', 'k₂'], tolerance: 0.01,
  hints: [
   'Close the real line with a large semicircle in the upper half-plane. When the integrand shrinks like 1 ÷ |z|² or faster, the arc adds nothing in the limit, so the integral is 2πi times the sum of the residues in the upper half-plane.',
   'x² + a² = (x − ai)(x + ai), so of its two zeros only ai lies in the upper half-plane. At a simple pole, the residue is p(a) ÷ q′(a).'
  ],
  solution: 'Close the real line with a large semicircle in the upper half-plane. Both integrands shrink like 1 ÷ |z|² or faster, so the arc\'s integral tends to 0 and each real integral is 2πi times the sum of the residues in the upper half-plane. For I₁ the only pole there is z = 3i, where the residue of 6 ÷ (z² + 9) is p ÷ q′ = 6 ÷ (2z) at z = 3i, which is 6 ÷ (6i). So I₁ = 2πi × 6 ÷ (6i) = 6π ÷ 3 = 2π. For I₂ the poles in the upper half-plane are i and 3i. The residues are 36 ÷ (2i × 8) at i and 36 ÷ (6i × (−8)) at 3i. Adding them and multiplying by 2πi gives I₂ = 36π ÷ (1 × 3 × 4) = 36π ÷ 12 = 3π.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Half-moon contour', description: 'A stretch of the real line closed by a huge semicircle above it.' },
  sources: [source.s10_1],
  teaching: {
   intuition: 'An improper integral over the whole line, from −∞ to ∞, is the limit of the integral from −R to R as R grows. To use residues we need a closed curve, so close the segment from −R to R with the semicircle of radius R in the upper half-plane, the points with positive imaginary part. By the residue theorem, the integral round this closed curve is 2πi times the sum of the residues inside it. If the function shrinks like 1 ÷ |z|² or faster, the integral over the semicircle tends to 0 as R grows: its length grows like R, but the function shrinks like 1 ÷ R². So in the limit the real integral equals 2πi times the sum of the residues in the upper half-plane. For x² + a² with a > 0, the zeros are ai and −ai, and only ai lies in the upper half-plane.',
   steps: [
    'Check that the integrand shrinks like 1 ÷ |z|² or faster: the bottom’s degree is at least two more than the top’s, and the bottom has no zeros on the real line.',
    'Find the poles in the upper half-plane: for x² + a² it is ai.',
    'Find the residue at each of them, for example with p(a) ÷ q′(a).',
    'Multiply the sum of those residues by 2πi; the i’s cancel and leave a real multiple of π.'
   ],
   example: {
    prompt: 'Find ∫ 4 dx ÷ (x² + 4) and ∫ dx ÷ ((x² + 1)(x² + 4)), both from −∞ to ∞.',
    steps: [
     'In the first, the only pole in the upper half-plane is 2i, with residue 4 ÷ (2 × 2i) = 1 ÷ i. Times 2πi: 2π.',
     'In the second, the poles above are i and 2i, with residues 1 ÷ (2i × 3) and 1 ÷ (4i × (−3)).',
     'Their sum is 1 ÷ (6i) − 1 ÷ (12i) = 1 ÷ (12i). Times 2πi: π ÷ 6.'
    ],
    answer: '2π and π ÷ 6.'
   },
   pitfalls: [
    'Counting the poles in the lower half-plane as well. Only the ones inside the closed curve, above the real line, count.',
    'Forgetting the factor 2 in q′(z) = 2z, which halves the residue of 1 ÷ (z² + a²).',
    'Using the method when the integrand shrinks only like 1 ÷ |z|: then the semicircle does not drop out.'
   ]
  },
  guidance: [
   { prompt: 'The residue of 6 ÷ (z² + 9) at z = 3i is 6 ÷ (6i). Since 1 ÷ i = −i, what is its imaginary part?', answer: [-1], labels: ['Im of the residue'], explanation: '6 ÷ (6i) = −(6 ÷ 6)i, with imaginary part −1. Multiplying by 2πi gives 2π × 1 = 2π.' },
   { prompt: 'The bottom of I₂ is 0 at ±i and ±3i. How many of these poles lie in the upper half-plane?', answer: [2], labels: ['poles in the upper half-plane'], explanation: 'i and 3i have positive imaginary parts; their opposites are in the lower half-plane.' },
   { prompt: 'Adding the two residues and multiplying by 2πi gives 36π ÷ (p × q × (p + q)) with p = 1 and q = 3. What is p × q × (p + q)?', answer: [12], labels: ['p × q × (p + q)'], explanation: '1 × 3 × 4 = 12, so I₂ = 36π ÷ 12 = 3π.' }
  ]
 },
 {
  id: 'q39', title: 'Once round the rotor', topic: 'Trigonometric integrals', tier: 'Advanced', sector: 'Control Room',
  brief: 'A rotor sensor’s reading is an integral over one full turn, and the control room wants it exactly without grinding through a substitution.',
  lesson: 'With z = e^(iθ), an integral over 0 to 2π in cos θ becomes a contour integral round |z| = 1, found from the residues inside the unit circle.',
  prompt: 'A rotor sensor\'s reading needs I = ∫ from 0 to 2π of 6 dθ ÷ (5 + 3 cos θ), with θ in radians. Enter √(5² − 3²), then the whole number k with I = kπ.',
  answer: [4, 3], labels: ['√(a² − b²)', 'k'], tolerance: 0.01,
  hints: [
   'Put z = e^(iθ). Then θ from 0 to 2π takes z once anticlockwise round |z| = 1, cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz).',
   'The new bottom is a quadratic in z whose two roots multiply to 1, so exactly one root lies inside the unit circle. Find the residue there and multiply by 2πi.'
  ],
  solution: 'Put z = e^(iθ), so cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz). Then 5 + 3 cos θ = (3z² + 10z + 3) ÷ (2z), and I = ∮ 12 dz ÷ (i(3z² + 10z + 3)) round |z| = 1. The roots of 3z² + 10z + 3 are z = (−5 ± s) ÷ 3 with s = √(5² − 3²) = √16 = 4. They multiply to 1, so exactly one is inside the circle: z₀ = (4 − 5) ÷ 3. The derivative of the bottom there is i(6z₀ + 10) = 8i, so the residue is 12 ÷ (8i), and I = 2πi × 12 ÷ (8i) = 12π ÷ 4 = 3π.',
  xp: 200, prereqs: ['q37'],
  artifact: { name: 'Unit-circle dial', description: 'One turn of the rotor, read as one trip round |z| = 1.' },
  sources: [source.s10_3],
  teaching: {
   intuition: 'As θ goes from 0 to 2π, the point z = e^(iθ) goes once anticlockwise round the unit circle |z| = 1. So an integral over one full turn can be turned into a contour integral. On the circle, 1 ÷ z = e^(−iθ), so cos θ = (z + 1 ÷ z) ÷ 2. And dz = ie^(iθ) dθ = iz dθ, so dθ = dz ÷ (iz). After the substitution the integrand is a rational function of z, and the residue theorem finishes the job using only the poles inside |z| = 1. For a + b cos θ with a > |b| > 0, the new bottom is a quadratic bz² + 2az + b. Its two roots multiply to 1, so exactly one of them lies inside the unit circle.',
   steps: [
    'Substitute cos θ = (z + 1 ÷ z) ÷ 2 and dθ = dz ÷ (iz), and simplify to one fraction in z.',
    'Find the roots of the new bottom and keep the ones inside |z| = 1.',
    'Find the residue at each root inside, for example with p(a) ÷ q′(a).',
    'Multiply the sum by 2πi and write the result as a multiple of π.'
   ],
   example: {
    prompt: 'Find ∫ from 0 to 2π of dθ ÷ (5 + 4 cos θ).',
    steps: [
     '5 + 4 cos θ = (2z² + 5z + 2) ÷ z, so the integral is ∮ dz ÷ (i(2z² + 5z + 2)).',
     'The roots of 2z² + 5z + 2 are −1 ÷ 2 and −2; only −1 ÷ 2 is inside the circle.',
     'The derivative of the bottom there is i(4 × (−1 ÷ 2) + 5) = 3i, so the residue is 1 ÷ (3i). Times 2πi: 2π ÷ 3.'
    ],
    answer: '2π ÷ 3.'
   },
   pitfalls: [
    'Forgetting the 1 ÷ (iz) from dθ, which changes the bottom’s powers of z and adds a factor 1 ÷ i.',
    'Taking the residue at both roots. The root outside the unit circle does not count.',
    'Changing the answer for a minus sign in a − b cos θ: replacing θ by θ + π shows the integral is the same as for a + b cos θ.'
   ]
  },
  guidance: [
   { prompt: 'What is √(5² − 3²)?', answer: [4], labels: ['√(a² − b²)'], explanation: '25 − 9 = 16, and √16 = 4.' },
   { prompt: 'After z = e^(iθ), the bottom is 3z² + 10z + 3, whose two roots multiply to 1. How many of them lie inside |z| = 1?', answer: [1], labels: ['roots inside'], explanation: 'Two roots whose product is 1 and that are not on the circle: one has modulus less than 1 and the other more than 1. So one root is inside.' },
   { prompt: 'The residue at the root inside is 12 ÷ (8i). Multiply it by 2πi: what is k with I = kπ?', answer: [3], labels: ['k'], explanation: '2πi × 12 ÷ (8i) = 12π ÷ 4 = 3π.' }
  ]
 },
 {
  id: 'q40', title: 'The last loop of the realm', topic: 'Realm review and bridge to Waves', tier: 'Advanced', sector: 'Control Room',
  brief: 'Before the Wave Station hands over to Waves, the control room checks one last filter by counting how often its output turns round 0.',
  lesson: 'The argument principle: (1 ÷ 2πi) ∮ f′ ÷ f dz = Z − P, the zeros minus the poles inside the curve, which is the winding number of f(z) round 0.',
  prompt: 'To close the realm, the control room checks the filter f(z) = (z − 1)²(z + 4i) ÷ ((z + 2)³(z − 5)) on the circle |z| = 3, traced once anticlockwise. Count each zero and each pole as many times as the power of its factor. Enter the number Z of zeros of f inside the circle, then the number P of poles inside, then the winding number of the image curve f(z) round 0 as z goes once round the circle.',
  answer: [2, 3, -1], labels: ['zeros inside Z', 'poles inside P', 'winding number'], tolerance: 0.01,
  hints: [
   'A point is inside |z| = R when its modulus is less than R. A factor (z − a) raised to the power m counts m times.',
   'The argument principle: (1 ÷ 2πi) ∮ f′(z) ÷ f(z) dz = Z − P, and this is also the number of times the image curve f(z) winds round 0.'
  ],
  solution: 'The zeros are at 1 (power 2, modulus 1, inside) and −4i (power 1, modulus 4, outside), so Z = 2. The poles are at −2 (power 3, modulus 2, inside) and 5 (power 1, modulus 5, outside), so P = 3. By the argument principle, the winding number of the image curve round 0 is Z − P = 2 − 3 = −1; a negative winding number means the image curve goes round 0 clockwise.',
  xp: 200, prereqs: ['q38', 'q39'],
  artifact: { name: 'Station handover log', description: 'Zeros minus poles: the last count of the Wave Station before Waves begins.' },
  sources: [source.s12_1],
  teaching: {
   intuition: 'This mission ties the realm together. Near a zero of f of order m, f(z) = (z − a)ᵐg(z) with g(a) ≠ 0, and f′ ÷ f = m ÷ (z − a) + g′ ÷ g, so f′ ÷ f has a simple pole with residue m. Near a pole of order k the same sum gives residue −k. By the residue theorem, once anticlockwise round a simple closed curve with no zeros or poles on it, (1 ÷ 2πi) ∮ f′(z) ÷ f(z) dz = Z − P, where Z counts the zeros inside and P the poles inside, each as many times as its order. This is the argument principle. It also has a picture: as z goes once round the curve, the point f(z) traces an image curve, and Z − P is its winding number round 0, the number of times it turns anticlockwise round 0. A negative number means clockwise turns. Every signal that rides on a turning number in Waves will be counted this way.',
   steps: [
    'List the zeros and poles of f with their orders: a factor (z − a)ᵐ on top is a zero of order m, on the bottom a pole of order m.',
    'Keep those inside the curve: for |z| = R, the points with modulus less than R.',
    'Add the orders: Z for the zeros inside, P for the poles inside.',
    'The winding number of f(z) round 0 is Z − P, and ∮ f′ ÷ f dz = 2πi(Z − P).'
   ],
   example: {
    prompt: 'For f(z) = z³ ÷ ((z − 2)(z + 5)) on |z| = 4, find Z, P and the winding number of f(z) round 0.',
    steps: [
     'The zero at 0 has order 3 and is inside, so Z = 3.',
     'The pole at 2 is inside and the pole at −5 is outside, so P = 1.',
     'The winding number is Z − P = 3 − 1 = 2.'
    ],
    answer: 'Z = 3, P = 1, and the image curve winds twice round 0.'
   },
   pitfalls: [
    'Counting a zero of order 2 once. Each zero and pole counts as many times as its order.',
    'Adding the poles instead of subtracting them: the winding number is Z − P.',
    'Counting points outside the curve. Only zeros and poles with modulus less than R count for |z| = R.'
   ]
  },
  guidance: [
   { prompt: 'Which zeros of f, 1 and −4i, have modulus less than 3? Add up their powers: what is Z?', answer: [2], labels: ['zeros inside Z'], explanation: 'The moduli are 1 and 4, so Z = 2.' },
   { prompt: 'Do the same for the poles, −2 and 5: what is P?', answer: [3], labels: ['poles inside P'], explanation: 'The moduli are 2 and 5, so P = 3.' },
   { prompt: 'By the argument principle and the residue theorem, ∮ f′(z) ÷ f(z) dz = 2πi(Z − P) = kπi. What is k?', answer: [-2], labels: ['k'], explanation: 'k = 2 × (2 − 3) = −2, and the winding number itself is Z − P = −1.' }
  ]
 }
);
})();
