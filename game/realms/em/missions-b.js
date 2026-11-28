/* Electricity and magnetism: fields missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/em/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Gauss's law · Basic, 100 XP · sector 'Shield Dome' · Chapter review: choose the Gaussian surface [6.2, 6.3]
     q12  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Electric potential energy of two charges [7.1]
     q13  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Potential difference, the volt and the electron-volt [7.2]
     q14  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Potential of several point charges (adding scalars) [7.3]
     q15  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Field from potential: E = −dV/dx [7.4]
     q16  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Uniform field between plates: V = Ed [7.2]
     q17  ch 3 Electric potential · Intermediate, 150 XP · sector 'Accelerator Bay' · Chapter review: field, potential and energy together [7.2, 7.3]
     q18  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Capacitance of parallel plates [8.1]
     q19  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Capacitors in series and in parallel [8.2]
     q20  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Energy stored in a capacitor [8.3]
   The text of prompt, hints, solution and guidance is build(canonical) of gen-b.js, cleaned by Gen.clean. */
(function(){
'use strict';
/* OpenStax University Physics Volume 2 sections the missions below cite (docs/plans/EM-PLAN.md); each page opened on 2026-11-28.
   A description credits the section only with what it states; units, the equipotential plane of q16 and the power of q20 are worked out in the missions. */
const source = {
 s6_2: { title: "OpenStax University Physics Volume 2 — 6.2 Explaining Gauss's Law", url: "https://openstax.org/books/university-physics-volume-2/pages/6-2-explaining-gausss-law", description: "Gauss’s law: the flux through any closed surface is the enclosed charge divided by ε₀, and only enclosed charge counts.", verified: '2026-11-28' },
 s6_3: { title: "OpenStax University Physics Volume 2 — 6.3 Applying Gauss's Law", url: "https://openstax.org/books/university-physics-volume-2/pages/6-3-applying-gausss-law", description: "Choosing a Gaussian surface with the symmetry of the charges; fields of spherical, cylindrical and planar distributions.", verified: '2026-11-28' },
 s7_1: { title: "OpenStax University Physics Volume 2 — 7.1 Electric Potential Energy", url: "https://openstax.org/books/university-physics-volume-2/pages/7-1-electric-potential-energy", description: "The potential energy kqQ ÷ r of two point charges, zero at infinite separation, and the work done by an applied force.", verified: '2026-11-28' },
 s7_2: { title: "OpenStax University Physics Volume 2 — 7.2 Electric Potential and Potential Difference", url: "https://openstax.org/books/university-physics-volume-2/pages/7-2-electric-potential-and-potential-difference", description: "Potential as energy per charge, the volt, the electron-volt, the energy and speed of an accelerated charge, and V = Ed in a uniform field.", verified: '2026-11-28' },
 s7_3: { title: "OpenStax University Physics Volume 2 — 7.3 Calculations of Electric Potential", url: "https://openstax.org/books/university-physics-volume-2/pages/7-3-calculations-of-electric-potential", description: "The potential kq ÷ r of a point charge, and the potential of several charges as a plain sum.", verified: '2026-11-28' },
 s7_4: { title: "OpenStax University Physics Volume 2 — 7.4 Determining Field from Potential", url: "https://openstax.org/books/university-physics-volume-2/pages/7-4-determining-field-from-potential", description: "The field components as minus the derivatives of the potential, and the field as minus the gradient.", verified: '2026-11-28' },
 s8_1: { title: "OpenStax University Physics Volume 2 — 8.1 Capacitors and Capacitance", url: "https://openstax.org/books/university-physics-volume-2/pages/8-1-capacitors-and-capacitance", description: "What a capacitor is, capacitance C = Q ÷ V, the farad, and the parallel-plate capacitor C = ε₀A ÷ d.", verified: '2026-11-28' },
 s8_2: { title: "OpenStax University Physics Volume 2 — 8.2 Capacitors in Series and in Parallel", url: "https://openstax.org/books/university-physics-volume-2/pages/8-2-capacitors-in-series-and-in-parallel", description: "Equivalent capacitance in series (reciprocals add) and in parallel (capacitances add), and reducing a network step by step.", verified: '2026-11-28' },
 s8_3: { title: "OpenStax University Physics Volume 2 — 8.3 Energy Stored in a Capacitor", url: "https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor", description: "The energy stored in a capacitor, ½CV² = Q² ÷ (2C) = ½QV.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: "Fields around the shield shells", topic: "Chapter review: choose the Gaussian surface", tier: 'Basic', sector: 'Shield Dome',
  brief: "The dome engineers nest charged parts inside metal shells and tubes, and they need the field at two places: inside the outer part and outside it.",
  lesson: "Match the Gaussian surface to the shape of the charges, count only the charge it encloses, and Gauss’s law gives the field.",
  prompt: "In the Shield Dome a test rig holds a small bead carrying 4 nC at the centre of a thin spherical metal shell of radius 0.5 m, which carries −7 nC spread evenly over it. Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Enter the radial component of the electric field at 0.2 m from the centre, then at 0.8 m from the centre, both in N/C to 2 decimal places (type them without commas). A positive value points away from the centre and a negative value points towards it.",
  answer: [899.18,-42.15], labels: ["field nearer in (N/C)","field further out (N/C)"], tolerance: 0.005,
  hints: [
   "Choose a Gaussian surface with the same symmetry as the charges: a sphere centred on the bead. Only the charge inside it counts, and the charge on the shell is inside only when the sphere is bigger than the shell.",
   "Over a sphere of radius r the field is the same size everywhere and straight out, so E × 4πr² = Q_enc ÷ ε₀ and E = Q_enc ÷ (4πε₀r²). Remember 1 nC = 10⁻⁹ C."
  ],
  solution: "At 0.2 m, a Gaussian sphere of radius 0.2 m centred on the bead lies inside the shell, so it encloses only the bead: 4 nC. Gauss's law gives E = Q_enc ÷ (4πε₀r²) = 4 × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × 0.04), which is 899.18 N/C to 2 decimal places, pointing away from the centre. At 0.8 m, a Gaussian sphere of radius 0.8 m centred on the bead encloses the bead and the whole shell: 4 + (−7) = −3 nC. So E = −3 × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × 0.64), which is −42.15 N/C to 2 decimal places, pointing towards the centre. The charge on the shell adds nothing to the field inside it.",
  xp: 100, prereqs: ["q09","q10"],
  artifact: { name: "Nested-shell chart", description: "Two Gaussian surfaces drawn around one rig, one inside the shell and one outside it." },
  sources: [source.s6_2, source.s6_3],
  teaching: {
   intuition: "Gauss’s law always holds, but it only hands you the field when the field is the same size all over your chosen surface. So the whole skill is picking the right surface. A ball-shaped arrangement calls for a sphere with the same centre; a long straight arrangement calls for a cylinder around the same axis. On such a surface the field points straight out (or straight in) and has one size, so the flux is just the field times the area. Then only one question is left: how much charge is inside the surface? Charge outside it, such as a shell larger than your surface, adds nothing to the field there.",
   steps: [
    "Look at the shape of the charges and choose a Gaussian surface with the same symmetry: a sphere for a point or a spherical shell, a cylinder of length L for a long wire or tube.",
    "Draw the surface through the point where you want the field and add up only the charge inside it, keeping signs.",
    "Sphere of radius r: E × 4πr² = Q_enc ÷ ε₀, so E = Q_enc ÷ (4πε₀r²). Cylinder of radius r: only the curved side has flux, E × 2πrL = λ_enc × L ÷ ε₀, so E = λ_enc ÷ (2πε₀r).",
    "Turn nC into coulombs (1 nC = 10⁻⁹ C). A positive answer points outwards, a negative one inwards."
   ],
   example: {
    prompt: "A long wire carrying 5 nC per metre runs along the axis of a thin tube of radius 0.4 m that carries −8 nC per metre. What is the radial field 0.6 m from the axis?",
    steps: ["A cylinder of radius 0.6 m is outside the tube, so it encloses 5 + (−8) = −3 nC per metre.","E = λ_enc ÷ (2πε₀r) = −3 × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × 0.6), about −89.92 N/C."],
    answer: "About −89.92 N/C: 89.92 N/C pointing in towards the axis."
   },
   pitfalls: ["Counting the charge on the shell or tube when the point is inside it. Inside, that charge is outside your Gaussian surface and adds nothing.","Using the sphere formula for a long wire. A cylinder gives a field that falls as 1 ÷ r, not 1 ÷ r².","Dropping the sign of the total: a negative enclosed charge gives a field pointing inwards."]
  },
  guidance: [
   { prompt: "Take a Gaussian sphere of radius 0.2 m centred on the bead. How much charge does it enclose, in nC?", answer: [4], labels: ["enclosed (nC or nC/m)"], explanation: "The shell is at 0.5 m, outside this surface, so only the bead is enclosed: 4 nC." },
   { prompt: "Use E = Q_enc ÷ (4πε₀r²) with r = 0.2 m. What is the radial field there, in N/C to 2 decimal places?", answer: [899.18], labels: ["field (N/C)"], explanation: "4 × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × 0.04) gives 899.18 N/C to 2 decimal places." },
   { prompt: "Now take a Gaussian sphere of radius 0.8 m centred on the bead. How much charge does it enclose, in nC?", answer: [-3], labels: ["enclosed (nC or nC/m)"], explanation: "This surface is outside the shell, so it encloses both charges: 4 + (−7) = −3 nC." },
   { prompt: "What is the radial field at 0.8 m, in N/C to 2 decimal places?", answer: [-42.15], labels: ["field (N/C)"], explanation: "−3 × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × 0.64) gives −42.15 N/C to 2 decimal places. The sign says it points towards the centre." }
  ]
 },
 {
  id: 'q12', title: "Pulling dust off a panel clip", topic: "Electric potential energy of two charges", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "A charged dust grain is stuck near a charged panel clip, and the cleaning arm needs to know how much energy it takes to move the grain.",
  lesson: "Two point charges store electric potential energy U = kq₁q₂ ÷ r, and the work to move them slowly is the change in U.",
  prompt: "A dust grain carrying 3 μC is held 0.5 m from a panel clip carrying −5 μC. Use k = 8.99 × 10⁹ N·m²/C², and take the potential energy to be 0 when the charges are very far apart. Enter the electric potential energy of the pair, then the work an outside force must do to move the grain slowly until the two are 0.2 m apart. Both are in mJ (1 mJ = 0.001 J) and may be negative; type them without commas.",
  answer: [-269.7,-404.55], labels: ["potential energy (mJ)","work by outside force (mJ)"], tolerance: 0.005,
  hints: [
   "The electric potential energy of two point charges is U = kq₁q₂ ÷ r. Keep the signs of the charges: like charges give a positive U, unlike charges a negative U.",
   "Moving the charges slowly, the outside force does work equal to the change in potential energy: W = U at the end − U at the start."
  ],
  solution: "With both charges in μC, kq₁q₂ = 8.99 × 10⁹ × 10⁻⁶ × 10⁻⁶ × q₁q₂ = 8.99 × 10⁻³ × q₁q₂ J·m, so U = 8.99 × q₁ × q₂ ÷ r in mJ when r is in metres. At 0.5 m, U = 8.99 × 3 × (−5) ÷ 0.5 = −269.7 mJ. At 0.2 m, U = 8.99 × 3 × (−5) ÷ 0.2 = −674.25 mJ. The work done by the outside force is the change in potential energy: −674.25 − (−269.7) = −404.55 mJ. Unlike charges attract, so the electric force does the work on this move and the outside force only holds back, so its work is negative.",
  xp: 150, prereqs: ["q02"],
  artifact: { name: "Energy ledger", description: "The potential energy of a pair of charges before and after a move." },
  sources: [source.s7_1],
  teaching: {
   intuition: "Lifting a box stores energy in gravity; pushing two charges around stores energy in the electric force between them. Push two like charges together and you work against their repulsion, so energy is stored: when you let go they fly apart and that energy comes back as motion. Unlike charges attract, so bringing them together releases energy instead. This stored energy is the electric potential energy of the pair. For two point charges it is U = kq₁q₂ ÷ r, where r is the distance between them and k = 8.99 × 10⁹ N·m²/C² is the Coulomb constant. It is counted from 0 when the charges are very far apart, so it is positive for like charges and negative for unlike ones. If an outside force moves the charges slowly, without giving them speed, the work it does is exactly the change in U.",
   steps: [
    "Write each charge in coulombs (1 μC = 10⁻⁶ C) and keep its sign.",
    "Work out U = kq₁q₂ ÷ r at the starting distance. Its unit is the joule; 1 mJ (millijoule) is 0.001 J.",
    "Work out U again at the final distance.",
    "The work done by an outside force moving them slowly is W = U at the end − U at the start. A negative W means the electric force did the work and the outside force only held back."
   ],
   example: {
    prompt: "Two charges of 2 μC and 6 μC are 0.3 m apart. What is their electric potential energy?",
    steps: ["U = kq₁q₂ ÷ r = 8.99 × 10⁹ × 2 × 10⁻⁶ × 6 × 10⁻⁶ ÷ 0.3 J.","That is 0.3596 J, which is 359.6 mJ. It is positive because the charges are alike."],
    answer: "359.6 mJ."
   },
   pitfalls: ["Using r² as in Coulomb’s force law. Potential energy falls off as 1 ÷ r, not 1 ÷ r².","Dropping the signs of the charges: unlike charges must give a negative U.","Taking start minus end for the work. The outside force’s work is end minus start."]
  },
  guidance: [
   { prompt: "Put the charges and the separation 0.5 m into U = kq₁q₂ ÷ r. What is U, in mJ?", answer: [-269.7], labels: ["U at the start (mJ)"], explanation: "With the charges in μC, U = 8.99 × q₁ × q₂ ÷ r mJ: 8.99 × 3 × (−5) ÷ 0.5 = −269.7 mJ. The sign is negative because the charges are unlike." },
   { prompt: "Now the separation is 0.2 m. What is U there, in mJ?", answer: [-674.25], labels: ["U at the end (mJ)"], explanation: "8.99 × 3 × (−5) ÷ 0.2 = −674.25 mJ." },
   { prompt: "The outside force's work is U at the end minus U at the start. What is it, in mJ?", answer: [-404.55], labels: ["work by outside force (mJ)"], explanation: "−674.25 − (−269.7) = −404.55 mJ." }
  ]
 },
 {
  id: 'q13', title: "Charging up the ion gun", topic: "Potential difference, the volt and the electron-volt", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "The ion gun fires charged nuclei at the ore samples, and the crew sets the energy of each shot by choosing a voltage.",
  lesson: "A charge q that moves through a potential difference ΔV = V_end − V_start changes its potential energy by qΔV and its kinetic energy by −qΔV; one elementary charge through one volt gains one electron-volt.",
  prompt: "The ion gun releases a helium nucleus (charge 2e, mass 6.64 × 10⁻²⁷ kg) from rest and accelerates it through a potential difference of 1500 V, from high potential to low potential. Use e = 1.60 × 10⁻¹⁹ C. Enter the kinetic energy it gains in eV, then the same energy as the number that multiplies 10⁻¹⁷ J, then its final speed in km/s to 2 decimal places (type the answers without commas).",
  answer: [3000,48,380.23], labels: ["energy (eV)","energy (× 10⁻¹⁷ J)","speed (km/s)"], tolerance: 0.005,
  hints: [
   "Write ΔV = V_end − V_start. The kinetic energy changes by −qΔV, so a charge q that falls from high to low potential through a drop of size |ΔV| gains kinetic energy q|ΔV|. In electron-volts this is just the number of elementary charges times the number of volts.",
   "Turn eV into joules with 1 eV = 1.60 × 10⁻¹⁹ J, then set ½mv² equal to that energy and solve for v. Divide metres per second by 1000 to get km/s."
  ],
  solution: "The nucleus carries two elementary charges, so it gains 2 × 1500 = 3000 eV. In joules that is 3000 × 1.60 × 10⁻¹⁹ = 48 × 10⁻¹⁷ J. From ½mv² = 48 × 10⁻¹⁷ J, v = √(2 × 48 × 10⁻¹⁷ ÷ (6.64 × 10⁻²⁷)) m/s, which is 380.23 km/s to 2 decimal places.",
  xp: 150, prereqs: ["q12"],
  artifact: { name: "Ion gun dial", description: "A voltage dial marked in electron-volts for each kind of nucleus." },
  sources: [source.s7_2],
  teaching: {
   intuition: "Potential energy depends on the charge you bring, so it is handy to divide it out. The electric potential at a place is the potential energy per coulomb a charge would have there, V = U ÷ q. Its unit is the volt: 1 V = 1 joule per coulomb. What matters for motion is the potential difference between where a charge starts and where it ends, ΔV = V_end − V_start. A charge q that moves between them changes its potential energy by ΔU = qΔV, and if only the electric force acts, its kinetic energy changes by the opposite amount, ΔK = −qΔV. A positive charge let go at high potential runs to low potential: ΔV is negative, so ΔU is negative and ΔK = −qΔV is positive. So a charge q that falls through a drop of size |ΔV| gains kinetic energy q|ΔV|. Atomic energies in joules are tiny, so we also use the electron-volt: 1 eV is the energy one elementary charge gains through 1 V, which is 1.60 × 10⁻¹⁹ J. A charge of 2e through 1000 V gains 2000 eV.",
   steps: [
    "Count the elementary charges the particle carries: a proton has 1, a helium nucleus has 2.",
    "Energy gained in eV = (number of elementary charges) × (potential difference in volts).",
    "In joules: multiply the eV by 1.60 × 10⁻¹⁹ J.",
    "From rest, all of it becomes kinetic energy: ½mv² = energy in joules, so v = √(2 × energy ÷ m). Divide m/s by 1000 for km/s."
   ],
   example: {
    prompt: "A proton (mass 1.67 × 10⁻²⁷ kg) starts from rest and is accelerated through 200 V. What energy does it gain and how fast does it end up?",
    steps: ["One elementary charge through 200 V gains 200 eV, which is 200 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁷ J.","v = √(2 × 3.2 × 10⁻¹⁷ ÷ (1.67 × 10⁻²⁷)) m/s, about 195763.51 m/s."],
    answer: "200 eV, and about 195.76 km/s."
   },
   pitfalls: ["Forgetting that a helium nucleus carries two elementary charges, so it gains twice the eV of a proton through the same voltage.","Putting the energy in eV straight into ½mv². Turn it into joules first.","Forgetting the square root, or leaving the speed in m/s when km/s is asked."]
  },
  guidance: [
   { prompt: "The charge is 2e and the potential difference is 1500 V. How much energy does it gain, in eV?", answer: [3000], labels: ["energy (eV)"], explanation: "Each elementary charge falling through 1 V gains 1 eV, so 2 × 1500 = 3000 eV." },
   { prompt: "Turn 3000 eV into joules. What number multiplies 10⁻¹⁷ J?", answer: [48], labels: ["energy (× 10⁻¹⁷ J)"], explanation: "3000 × 1.60 × 10⁻¹⁹ J = 48 × 10⁻¹⁷ J." },
   { prompt: "Set ½mv² = 48 × 10⁻¹⁷ J with m = 6.64 × 10⁻²⁷ kg. What is v, in km/s to 2 decimal places?", answer: [380.23], labels: ["speed (km/s)"], explanation: "v = √(2 × 48 × 10⁻¹⁷ ÷ (6.64 × 10⁻²⁷)) m/s, which is 380.23 km/s to 2 decimal places." }
  ]
 },
 {
  id: 'q14', title: "Reading the rail probe", topic: "Potential of several point charges (adding scalars)", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "Three ion traps share one rail, and the crew wants the voltage a probe will read between them before sending a charge in.",
  lesson: "The potential of several point charges is the plain sum of kq ÷ r for each one, with signs and no directions.",
  prompt: "Three charged ion traps sit on a straight rail: 5 μC at x = 0.2 m, −2 μC at x = 0.5 m and 3 μC at x = 0.8 m. A probe is at x = 0.3 m. Use k = 8.99 × 10⁹ N·m²/C², and take the potential to be 0 very far away. Enter the electric potential at the probe in kV, then the work needed to bring a +2 μC charge slowly from very far away to the probe, in mJ (type them without commas).",
  answer: [413.54,827.08], labels: ["potential (kV)","work (mJ)"], tolerance: 0.005,
  hints: [
   "Each point charge gives a potential kq ÷ r at a distance r, with the sign of its charge. Potential has no direction, so the three just add.",
   "The work to bring a charge q from where the potential is 0 to a point at potential V is qV. With q in μC and V in kV the work comes out in mJ."
  ],
  solution: "The distances from the probe are 0.1 m, 0.2 m and 0.5 m. With q in μC, kq ÷ r = 8.99 × q ÷ r in kV: 8.99 × 5 ÷ 0.1 = 449.5, 8.99 × (−2) ÷ 0.2 = −89.9, 8.99 × 3 ÷ 0.5 = 53.94. Adding, V = 449.5 + (−89.9) + 53.94 = 413.54 kV. The work is qV = 2 × 413.54 = 827.08 mJ.",
  xp: 150, prereqs: ["q13","q03"],
  artifact: { name: "Rail probe trace", description: "Three potentials added at one point, with their signs." },
  sources: [source.s7_3],
  teaching: {
   intuition: "A point charge q gives a potential V = kq ÷ r at a distance r, taken as 0 very far away. With several charges, the potential energy of a test charge is the sum of its energies with each one, so the potentials simply add. This is far easier than adding forces or fields in the earlier missions: potential is a scalar, a plain number with a sign and no direction, so there are no components to split. A positive charge raises the potential nearby and a negative charge lowers it. Once you know the potential V at a point, the work needed to bring a charge q in slowly from very far away is qV.",
   steps: [
    "Find the distance from each charge to the point. Distances are never negative.",
    "For each charge work out kq ÷ r, keeping the sign of q. With q in μC, k × 10⁻⁶ × q ÷ r volts is 8.99 × q ÷ r kilovolts (kV, 1 kV = 1000 V).",
    "Add the potentials with their signs to get V at the point.",
    "The work to bring a charge q from very far away (where V = 0) is W = qV. With q in μC and V in kV, W is in mJ."
   ],
   example: {
    prompt: "A +4 μC charge is 0.2 m from a point and a −6 μC charge is 0.5 m from it. What is the potential at the point?",
    steps: ["8.99 × 4 ÷ 0.2 = 179.8 kV and 8.99 × (−6) ÷ 0.5 = −107.88 kV.","Add: 179.8 + (−107.88) = 71.92 kV."],
    answer: "71.92 kV."
   },
   pitfalls: ["Splitting the potentials into left and right as if they were forces. Potential has no direction; only the sign of the charge matters.","Using the signed position difference as the distance. A charge to the left of the point is still a positive distance away.","Using r² instead of r: the potential of a point charge falls off as 1 ÷ r."]
  },
  guidance: [
   { prompt: "The 5 μC charge is 0.1 m from the probe. What potential does it give there, in kV?", answer: [449.5], labels: ["first potential (kV)"], explanation: "8.99 × 10⁹ × 5 × 10⁻⁶ ÷ 0.1 V is 8.99 × 5 ÷ 0.1 = 449.5 kV." },
   { prompt: "The other two give −89.9 kV and 53.94 kV. What is the total potential at the probe, in kV?", answer: [413.54], labels: ["potential (kV)"], explanation: "Potentials are numbers, not arrows, so they add: 449.5 + (−89.9) + 53.94 = 413.54 kV." },
   { prompt: "What work brings +2 μC from very far away to the probe, in mJ?", answer: [827.08], labels: ["work (mJ)"], explanation: "W = qV = 2 μC × 413.54 kV = 827.08 mJ." }
  ]
 },
 {
  id: 'q15', title: "The slope of the beam pipe", topic: "Field from potential: E = −dV/dx", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "A survey has mapped the voltage along the beam pipe as a formula, and the steering team needs the electric field at one station.",
  lesson: "The field is minus the rate of change of the potential with position: E_x = −dV/dx, pointing the way the potential falls.",
  prompt: "Along the beam pipe of the Accelerator Bay the potential is V(x) = 2x³ − 9x² + 40 volts, where x is the position in metres. Enter the potential at x = 2 m in V, then the x-component of the electric field there, E_x, in V/m (it may be negative).",
  answer: [20,12], labels: ["potential (V)","field E_x (V/m)"], tolerance: 0.005,
  hints: [
   "The field is minus the rate of change of the potential with position: E_x = −dV/dx. Differentiate V(x) term by term; the constant has derivative 0.",
   "Put the position into dV/dx, then change the sign. A positive E_x points towards larger x, which is the way the potential falls."
  ],
  solution: "V(2) = 2 × 8 + (−9) × 4 + 40 = 20 V. Differentiating, dV/dx = 6x² − 18x, so at x = 2 it is 6 × 4 + (−18) × 2 = −12 V/m. The field is E_x = −dV/dx = 12 V/m, pointing towards larger x.",
  xp: 150, prereqs: ["q14"],
  artifact: { name: "Pipe potential profile", description: "A graph of V along the pipe with its slope read off at one station." },
  sources: [source.s7_4],
  teaching: {
   intuition: "Think of the potential as the height of a hillside and a positive charge as a ball on it: the ball rolls downhill, and it is pushed hardest where the slope is steepest. In the same way the electric field points the way the potential falls, and its strength is how fast the potential changes with position. Along a line this is a derivative: E_x = −dV/dx. The minus sign says the field points towards lower potential. In three dimensions the same idea uses the gradient, the vector of rates of change of V in each direction, and the field is minus the gradient. A field in volts per metre is the same as newtons per coulomb, since a volt is a joule per coulomb and a joule is a newton-metre.",
   steps: [
    "Work out V at the point by putting in x.",
    "Differentiate V(x) term by term: axⁿ gives naxⁿ⁻¹, and a constant gives 0.",
    "Put the point into dV/dx. Its unit is volts per metre.",
    "Change the sign: E_x = −dV/dx. A positive E_x points towards larger x."
   ],
   example: {
    prompt: "The potential is V(x) = 4x² − 3x³ volts. What is E_x at x = 1 m?",
    steps: ["dV/dx = 8x − 9x², which at x = 1 is 8 − 9 = −1 V/m.","E_x = −dV/dx = 1 V/m."],
    answer: "1 V/m, pointing towards larger x."
   },
   pitfalls: ["Forgetting the minus sign: the field points downhill in potential, opposite to the slope.","Taking the field to be V ÷ x. That works only when the potential falls at a steady rate from 0.","Squaring or cubing a negative position carelessly: (−2)³ is −8 but (−2)² is 4."]
  },
  guidance: [
   { prompt: "Put x = 2 into V(x). What is the potential there, in V?", answer: [20], labels: ["potential (V)"], explanation: "2 × 8 + (−9) × 4 + 40 = 20 V." },
   { prompt: "The derivative is dV/dx = 6x² − 18x. What is it at x = 2, in V/m?", answer: [-12], labels: ["dV/dx (V/m)"], explanation: "6 × 4 + (−18) × 2 = −12 V/m." },
   { prompt: "E_x = −dV/dx. What is E_x at x = 2, in V/m?", answer: [12], labels: ["field E_x (V/m)"], explanation: "Change the sign: E_x = 12 V/m." }
  ]
 },
 {
  id: 'q16', title: "Between the gun plates", topic: "Uniform field between plates: V = Ed", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "The ion gun’s first stage is a pair of flat plates, and the crew needs the field between them and the voltage at a point along the way.",
  lesson: "Between large parallel plates the field is uniform, and the potential difference across a distance d along it is V = Ed.",
  prompt: "Two large parallel plates in the ion gun are 8 mm apart, with the positive plate 450 V above the negative plate. The field between them is uniform. Take the negative plate as 0 V. Enter the field strength between the plates in kV/m, then the potential difference between the positive plate and a point 3 mm from it in V, then the potential of that point in V.",
  answer: [56.25,168.75,281.25], labels: ["field (kV/m)","potential drop (V)","potential of the point (V)"], tolerance: 0.005,
  hints: [
   "In a uniform field the potential falls by the same amount for every millimetre you move along the field, so E = V ÷ d. A volt per millimetre is a kilovolt per metre.",
   "The potential difference over part of the gap is E × (distance moved along the field). The point’s own potential is what is left of the positive plate’s potential after that drop."
  ],
  solution: "E = V ÷ d = 450 V ÷ 8 mm = 56.25 V/mm, which is 56.25 kV/m. Over 3 mm the potential falls by 56.25 × 3 = 168.75 V. The positive plate is at 450 V, so the point is at 450 − 168.75 = 281.25 V. Every point in the plane 3 mm from the positive plate has this same potential: that plane is an equipotential.",
  xp: 150, prereqs: ["q13"],
  artifact: { name: "Plate gap gauge", description: "A ruler across the gap marked with the voltage at every millimetre." },
  sources: [source.s7_2],
  teaching: {
   intuition: "Two large flat metal plates facing each other, one at higher potential than the other, make a field between them that is the same everywhere: a uniform field, pointing from the positive plate to the negative one. In a uniform field the potential falls by the same amount for every millimetre you move along the field, like a staircase with equal steps. So the potential difference across the whole gap d is V = Ed, and the field is E = V ÷ d. Across part of the gap, a distance s along the field, the potential falls by Es. Moving across the field, parallel to the plates, the potential does not change at all: every plane parallel to the plates is an equipotential, a surface where the potential is the same everywhere.",
   steps: [
    "Divide the potential difference by the gap: E = V ÷ d. One volt per millimetre is 1000 V/m, which is one kilovolt per metre (kV/m).",
    "The potential falls by E × s over a distance s measured from the positive plate along the field.",
    "The potential at that point is the positive plate’s potential minus that fall.",
    "Points at the same distance from the plates share a potential: they lie on one equipotential plane."
   ],
   example: {
    prompt: "Plates 3 mm apart have 120 V between them. What is the field, and what is the potential 1 mm from the positive plate, with the negative plate at 0 V?",
    steps: ["E = 120 V ÷ 3 mm = 40 V/mm, which is 40 kV/m.","Over 1 mm the potential falls by 40 V, so the point is at 120 − 40 = 80 V."],
    answer: "40 kV/m, and 80 V."
   },
   pitfalls: ["Mixing millimetres and metres: 300 V ÷ 6 mm is 50 V/mm, which is 50000 V/m, not 50 V/m.","Measuring from the wrong plate: the potential falls as you move away from the positive plate.","Thinking the field is stronger near one plate. Between large plates it is the same at every point of the gap."]
  },
  guidance: [
   { prompt: "450 V across 8 mm. What is the field, in kV/m?", answer: [56.25], labels: ["field (kV/m)"], explanation: "450 ÷ 8 = 56.25 V per millimetre, and 1 V/mm = 1000 V/m = 1 kV/m, so E = 56.25 kV/m." },
   { prompt: "How much does the potential fall over the 3 mm from the positive plate, in V?", answer: [168.75], labels: ["potential drop (V)"], explanation: "56.25 V/mm × 3 mm = 168.75 V." },
   { prompt: "What is the potential of the point, in V, with the negative plate at 0 V?", answer: [281.25], labels: ["potential of the point (V)"], explanation: "450 − 168.75 = 281.25 V." }
  ]
 },
 {
  id: 'q17', title: "Stopping a proton in the gap", topic: "Chapter review: field, potential and energy together", tier: 'Intermediate', sector: 'Accelerator Bay',
  brief: "The ion gun can also be run backwards as a brake, and the crew wants to know where an incoming proton will stop.",
  lesson: "A charge moving towards higher potential trades kinetic energy for potential energy; in a uniform field it stops where the potential rise equals its energy per charge.",
  prompt: "In the ion gun a proton (mass 1.67 × 10⁻²⁷ kg, charge e = 1.60 × 10⁻¹⁹ C) passes through a hole in the negative plate at 200 km/s, heading straight for the positive plate. The plates are 8 mm apart with a potential difference of 600 V, and the field between them is uniform. Enter the field strength in kV/m, then the proton’s kinetic energy at the hole in eV, then how far it gets past the hole before it stops, in mm to 2 decimal places.",
  answer: [75,208.75,2.78], labels: ["field (kV/m)","kinetic energy (eV)","stopping distance (mm)"], tolerance: 0.005,
  hints: [
   "The field is the potential difference divided by the gap, E = V ÷ d; a volt per millimetre is a kilovolt per metre.",
   "Moving towards higher potential, the proton loses e × ΔV of kinetic energy, which is ΔV in eV. It stops where the potential rise equals its kinetic energy in eV, and the rise over a distance s is E × s."
  ],
  solution: "E = 600 V ÷ 8 mm = 75 V/mm, which is 75 kV/m. The kinetic energy is ½mv² = ½ × 1.67 × 10⁻²⁷ × (200 × 10³)² J, and dividing by 1.60 × 10⁻¹⁹ J per eV gives 208.75 eV. The proton stops where it has climbed 208.75 V, which takes 208.75 ÷ 75 mm, or 2.78 mm to 2 decimal places. That is less than the 8 mm gap, so it stops before the positive plate and is pushed back.",
  xp: 150, prereqs: ["q15","q16"],
  artifact: { name: "Brake-stage log", description: "A proton’s energy, the field and the point where it turned back." },
  sources: [source.s7_2, source.s7_3],
  teaching: {
   intuition: "This chapter has three linked ideas. The field tells you the force on a charge, the potential tells you its energy per coulomb, and in a uniform field they are tied by V = Ed. A proton fired towards higher potential is climbing a hill: it slows down, giving up kinetic energy as potential energy. Its energy in electron-volts tells you how many volts of hill it can climb, since a proton gains or loses 1 eV per volt. In a uniform field the potential rises by E for every unit of distance, so the proton gets a distance (its energy in eV) ÷ E before it stops and is pushed back.",
   steps: [
    "Find the field from the plates: E = V ÷ d. A volt per millimetre is a kilovolt per metre.",
    "Find the kinetic energy ½mv² in joules (km/s × 1000 gives m/s), then divide by 1.60 × 10⁻¹⁹ J per eV.",
    "For a proton, that many eV can climb that many volts. The distance needed is that number of volts divided by the field.",
    "Check the distance is less than the gap; if not, the proton reaches the other plate."
   ],
   example: {
    prompt: "A proton moving at 120 km/s heads into a uniform 20 kV/m field, towards higher potential. How far does it get?",
    steps: ["½ × 1.67 × 10⁻²⁷ × (120 × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV gives 75.15 eV.","It can climb 75.15 V, and the field gives 20 V per mm, so it stops after 75.15 ÷ 20 = 3.7575 mm."],
    answer: "About 3.76 mm."
   },
   pitfalls: ["Mixing units in the field: 20 kV/m is 20 V per millimetre, so a distance in mm comes straight from volts ÷ (kV/m).","Forgetting to square the speed, or using km/s in ½mv².","Thinking a proton speeds up towards the positive plate. It is pushed away from the positive plate, so it slows down."]
  },
  guidance: [
   { prompt: "600 V across 8 mm. What is the field, in kV/m?", answer: [75], labels: ["field (kV/m)"], explanation: "600 ÷ 8 = 75 V/mm, which is 75 kV/m." },
   { prompt: "Find ½mv² for v = 200 km/s and turn it into eV. What is the kinetic energy, in eV?", answer: [208.75], labels: ["kinetic energy (eV)"], explanation: "½ × 1.67 × 10⁻²⁷ × (200 × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV = 208.75 eV." },
   { prompt: "The proton stops after climbing 208.75 V, and the potential rises 75 V per mm. How far does it get, in mm to 2 decimal places?", answer: [2.78], labels: ["stopping distance (mm)"], explanation: "208.75 ÷ 75 gives 2.78 mm to 2 decimal places." }
  ]
 },
 {
  id: 'q18', title: "Sizing the vault plates", topic: "Capacitance of parallel plates", tier: 'Intermediate', sector: 'Battery Vault',
  brief: "The Battery Vault is fitting its first capacitor, and the crew needs to know how much charge a pair of plates will hold.",
  lesson: "A capacitor stores charge Q = CV; two parallel plates of area A a distance d apart have capacitance C = ε₀A ÷ d.",
  prompt: "A capacitor for the Battery Vault is two flat metal plates, each of area 400 cm², 2 mm apart with air between them. Use ε₀ = 8.85 × 10⁻¹² F/m. Enter the plate area in m², then the capacitance in pF to 2 decimal places, then the charge on the positive plate when it is connected to 300 V, in nC to 2 decimal places (type them without commas).",
  answer: [0.04,177,53.1], labels: ["area (m²)","capacitance (pF)","charge (nC)"], tolerance: 0.005,
  hints: [
   "A parallel-plate capacitor has C = ε₀A ÷ d, with A in m² and d in m. There are 10000 cm² in 1 m² and 1000 mm in 1 m.",
   "The charge stored is Q = CV. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC."
  ],
  solution: "A = 400 cm² = 0.04 m² and d = 2 mm = 0.002 m. C = ε₀A ÷ d = 8.85 × 10⁻¹² × 0.04 ÷ 0.002 F, which is 177 pF to 2 decimal places. Q = CV = 177 pF × 300 V, about 53100 pC, which is 53.1 nC to 2 decimal places.",
  xp: 150, prereqs: ["q16","q09"],
  artifact: { name: "First vault capacitor", description: "Two plates, a gap of air and a label with its capacitance in pF." },
  sources: [source.s8_1],
  teaching: {
   intuition: "A capacitor is a device that stores charge and energy: in its simplest form, two metal plates close together, not touching. Connect it to a voltage and charge +Q collects on one plate and −Q on the other. Double the voltage and you double the charge, so Q ÷ V is fixed for that capacitor. That ratio is its capacitance, C = Q ÷ V, measured in farads: 1 F is 1 coulomb per volt. A farad is huge, so real capacitors are counted in microfarads (μF, 10⁻⁶ F) and picofarads (pF, 10⁻¹² F). For a parallel-plate capacitor in air, C = ε₀A ÷ d: bigger plates hold more, and a smaller gap holds more. Here ε₀ = 8.85 × 10⁻¹² F/m, the same constant as in Gauss’s law (a farad per metre is the same unit as C²/(N·m²)).",
   steps: [
    "Put the area in square metres (10000 cm² = 1 m²) and the gap in metres (1000 mm = 1 m).",
    "Work out C = ε₀A ÷ d in farads, then turn it into picofarads by dividing by 10⁻¹² (multiply by 10¹²).",
    "The charge on the positive plate is Q = CV. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC."
   ],
   example: {
    prompt: "Two plates of area 0.5 m² are 1 mm apart in air. What is the capacitance, and what charge do they hold at 100 V?",
    steps: ["C = 8.85 × 10⁻¹² × 0.5 ÷ 0.001 = 4.425 × 10⁻⁹ F, which is 4425 pF.","Q = CV = 4425 pF × 100 V = 442500 pC, which is 442.5 nC."],
    answer: "4425 pF, holding 442.5 nC."
   },
   pitfalls: ["Leaving the area in cm²: 1 cm² is 0.0001 m², not 0.01 m².","Multiplying by the gap instead of dividing: a narrower gap gives a larger capacitance.","Mixing pC and nC when finding the charge."]
  },
  guidance: [
   { prompt: "There are 10000 cm² in 1 m². What is 400 cm² in m²?", answer: [0.04], labels: ["area (m²)"], explanation: "400 ÷ 10000 = 0.04 m²." },
   { prompt: "Use C = ε₀A ÷ d with d = 0.002 m. What is C, in pF to 2 decimal places?", answer: [177], labels: ["capacitance (pF)"], explanation: "8.85 × 10⁻¹² × 0.04 ÷ 0.002 F is 177 pF to 2 decimal places." },
   { prompt: "Use Q = CV with V = 300 V. What is Q, in nC to 2 decimal places?", answer: [53.1], labels: ["charge (nC)"], explanation: "177 pF × 300 V is about 53100 pC, which is 53.1 nC." }
  ]
 },
 {
  id: 'q19', title: "Wiring the capacitor bank", topic: "Capacitors in series and in parallel", tier: 'Intermediate', sector: 'Battery Vault',
  brief: "The vault has a mixed bag of capacitors, and the crew must know what one capacitor the whole bank behaves like.",
  lesson: "In parallel capacitances add; in series their reciprocals add. Reduce a network one pair at a time.",
  prompt: "In a bank of the Battery Vault, C₂ = 1 μF and C₃ = 2 μF are joined in parallel, and that pair is connected in series with C₁ = 6 μF. A 12 V supply is connected across the whole network. Enter the equivalent capacitance of the network in μF, then the total charge the supply moves onto it in μC.",
  answer: [2,24], labels: ["equivalent capacitance (μF)","total charge (μC)"], tolerance: 0.005,
  hints: [
   "Work from the inside out: replace the pair first by one capacitor, then combine that with the third. In parallel capacitances add; in series their reciprocals add.",
   "The whole network behaves like one capacitor of the equivalent capacitance, so the charge it takes is Q = C × V."
  ],
  solution: "In parallel the capacitances add: 1 + 2 = 3 μF. C₁ is in series with the pair: 1 ÷ C = 1 ÷ 6 + 1 ÷ 3, so C = 18 ÷ 9 = 2 μF. The supply moves Q = CV = 2 μF × 12 V = 24 μC.",
  xp: 150, prereqs: ["q18"],
  artifact: { name: "Bank wiring diagram", description: "Three capacitors folded step by step into one equivalent." },
  sources: [source.s8_2],
  teaching: {
   intuition: "Capacitors can be joined in two basic ways. In parallel, side by side across the same two wires, every capacitor has the same voltage and the charges add up, so the capacitances add: C = C₁ + C₂ + …. It is like making the plates bigger. In series, one after another in a chain, every capacitor carries the same charge and the voltages add up, so the reciprocals add: 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂ + …. It is like making the gap wider, so the result is smaller than the smallest one. A network that mixes the two is reduced one group at a time: replace a pure series or pure parallel group by its equivalent capacitance, the single capacitor that would take the same charge at the same voltage, and repeat until one capacitor is left.",
   steps: [
    "Find a pair that is purely in series or purely in parallel and replace it by one capacitor.",
    "Parallel: add, C = C₁ + C₂. Series: C = 1 ÷ (1 ÷ C₁ + 1 ÷ C₂), which for two is C₁C₂ ÷ (C₁ + C₂).",
    "Combine that result with the next capacitor the same way, until one equivalent capacitance is left.",
    "The supply moves charge Q = CV onto the whole network. With C in μF and V in volts, Q is in μC."
   ],
   example: {
    prompt: "What are 2 μF and 6 μF in series, and in parallel?",
    steps: ["Series: 2 × 6 ÷ (2 + 6) = 12 ÷ 8 = 1.5 μF.","Parallel: 2 + 6 = 8 μF."],
    answer: "1.5 μF in series, 8 μF in parallel."
   },
   pitfalls: ["Adding capacitances in series. A chain of capacitors has less capacitance than the smallest one in it.","Adding the reciprocals and forgetting to turn the sum back over: 1 ÷ C = 0.5 means C = 2, not 0.5.","Combining the wrong pair first. Start with the group that is purely series or purely parallel."]
  },
  guidance: [
   { prompt: "Start with the pair. What single capacitance replaces it, in μF?", answer: [3], labels: ["combined pair (μF)"], explanation: "In parallel the capacitances add: 1 + 2 = 3 μF." },
   { prompt: "Now combine 3 μF with the remaining capacitor. What is the equivalent capacitance, in μF?", answer: [2], labels: ["equivalent capacitance (μF)"], explanation: "C₁ is in series with the pair: 1 ÷ C = 1 ÷ 6 + 1 ÷ 3, so C = 18 ÷ 9 = 2 μF." },
   { prompt: "What charge does the 12 V supply move onto the network, in μC?", answer: [24], labels: ["total charge (μC)"], explanation: "Q = 2 × 12 = 24 μC." }
  ]
 },
 {
  id: 'q20', title: "The night bank flash", topic: "Energy stored in a capacitor", tier: 'Intermediate', sector: 'Battery Vault',
  brief: "At night the vault dumps a capacitor bank into the dome lights in one quick burst, and the crew needs its energy and power.",
  lesson: "A capacitor charged to V holds energy U = ½CV²; releasing it in a time t gives an average power U ÷ t.",
  prompt: "The night bank wires a 220 μF capacitor and a 330 μF capacitor in parallel and charges them to 40 V. Enter the total charge stored in mC, then the energy stored in mJ, then the average power in W if all that energy is released in 5 ms (type them without commas).",
  answer: [22,440,88], labels: ["charge (mC)","energy (mJ)","average power (W)"], tolerance: 0.005,
  hints: [
   "Capacitors in parallel add: C = C₁ + C₂. The charge is Q = CV, and 1 μF × 1 V = 1 μC.",
   "The energy stored is U = ½CV², and 1 μF × (1 V)² = 1 μJ. Average power is energy divided by time, and 1 mJ ÷ 1 ms = 1 W."
  ],
  solution: "In parallel, C = 220 + 330 = 550 μF. Q = CV = 550 μF × 40 V = 22000 μC, which is 22 mC. U = ½CV² = ½ × 550 μF × 1600 V² = 440000 μJ, which is 440 mJ. Released in 5 ms, the average power is 440 mJ ÷ 5 ms = 88 W.",
  xp: 150, prereqs: ["q19"],
  artifact: { name: "Night bank meter", description: "A dial showing the charge, energy and power of one burst." },
  sources: [source.s8_2, source.s8_3],
  teaching: {
   intuition: "Charging a capacitor takes work. The first bit of charge goes on easily, but each extra bit is pushed against the charge already there, and the voltage climbs steadily from 0 to V. On average the charge is moved through half the final voltage, so the energy stored is U = ½QV. Using Q = CV this is U = ½CV², or Q² ÷ (2C). Notice the square: double the voltage and you store four times the energy. When the capacitor discharges, letting its charge flow back out, that energy is released. If it all comes out in a time t, the average power is U ÷ t, in watts, joules per second, as in mechanics.",
   steps: [
    "Combine the capacitors first: in parallel their capacitances add.",
    "Charge: Q = CV. With C in μF and V in volts, Q is in μC; 1000 μC = 1 mC.",
    "Energy: U = ½CV². With C in μF and V in volts, U is in μJ; 1000 μJ = 1 mJ.",
    "Average power: P = U ÷ t. A millijoule per millisecond is a watt."
   ],
   example: {
    prompt: "A 500 μF capacitor is charged to 20 V. How much charge and energy does it hold?",
    steps: ["Q = 500 × 20 = 10000 μC, which is 10 mC.","U = ½ × 500 × 400 = 100000 μJ, which is 100 mJ."],
    answer: "10 mC and 100 mJ."
   },
   pitfalls: ["Forgetting the ½: the charge is not all moved through the full voltage.","Forgetting to square the voltage.","Mixing μJ and mJ, or ms and s, when finding the power."]
  },
  guidance: [
   { prompt: "With C = 550 μF at 40 V, what charge is stored, in mC?", answer: [22], labels: ["charge (mC)"], explanation: "550 × 40 = 22000 μC, and 1000 μC = 1 mC, so Q = 22 mC." },
   { prompt: "What energy is stored, U = ½CV², in mJ?", answer: [440], labels: ["energy (mJ)"], explanation: "½ × 550 × 1600 = 440000 μJ, which is 440 mJ." },
   { prompt: "The energy comes out in 5 ms. What is the average power, in W?", answer: [88], labels: ["average power (W)"], explanation: "440 mJ ÷ 5 ms = 88 W." }
  ]
 }
);
})();
