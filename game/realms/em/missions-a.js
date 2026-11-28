/* Electricity and magnetism: fields missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/em/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · Electric charge comes in whole numbers of e [5.1]
     q02  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · Coulomb's law: force between two point charges [5.3]
     q03  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · Superposition: net force from several charges on a line [5.3]
     q04  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · The electric field of a point charge, and the force it gives [5.4]
     q05  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · Field of a charged rod or ring by integration [5.5]
     q06  ch 1 Charges and fields · Basic, 100 XP · sector 'Panel Field' · Dipoles: dipole moment and torque in a uniform field [5.7]
     q07  ch 2 Gauss's law · Basic, 100 XP · sector 'Shield Dome' · Electric flux: field through a surface, the surface integral [6.1]
     q08  ch 2 Gauss's law · Basic, 100 XP · sector 'Shield Dome' · Gauss's law: flux out of a closed surface and enclosed charge [6.2]
     q09  ch 2 Gauss's law · Basic, 100 XP · sector 'Shield Dome' · Gauss's law for a sphere: inside and outside a charged shell [6.3]
     q10  ch 2 Gauss's law · Basic, 100 XP · sector 'Shield Dome' · Gauss's law for a long line and a flat sheet [6.3] */
(function(){
'use strict';
/* OpenStax University Physics Volume 2 sections, one entry per section the missions below cite. Each page was opened on the
   `verified` date and its description credits it only with what it states. Mission text is written from build(canonical) in gen-a.js. */
const source = {
 s5_1: {"title":"OpenStax University Physics Volume 2 — 5.1 Electric Charge","url":"https://openstax.org/books/university-physics-volume-2/pages/5-1-electric-charge","description":"Charge comes in two kinds, is measured in coulombs, is quantised in whole multiples of the elementary charge e, and is conserved.","verified":"2026-11-28"},
 s5_3: {"title":"OpenStax University Physics Volume 2 — 5.3 Coulomb's Law","url":"https://openstax.org/books/university-physics-volume-2/pages/5-3-coulombs-law","description":"Coulomb's law for two point charges with k = 8.99 × 10⁹ N·m²/C², like charges repelling and unlike attracting, and the net force from several charges as a vector sum.","verified":"2026-11-28"},
 s5_4: {"title":"OpenStax University Physics Volume 2 — 5.4 Electric Field","url":"https://openstax.org/books/university-physics-volume-2/pages/5-4-electric-field","description":"The electric field defined through F = QE, its unit N/C, the field of a point charge, and superposition of fields.","verified":"2026-11-28"},
 s5_5: {"title":"OpenStax University Physics Volume 2 — 5.5 Calculating Electric Fields of Charge Distributions","url":"https://openstax.org/books/university-physics-volume-2/pages/5-5-calculating-electric-fields-of-charge-distributions","description":"Charge densities λ and σ, and the field of a charged line or ring found by integrating the fields of small pieces dq. The end-on rod used in this mission is worked out in the mission itself.","verified":"2026-11-28"},
 s5_7: {"title":"OpenStax University Physics Volume 2 — 5.7 Electric Dipoles","url":"https://openstax.org/books/university-physics-volume-2/pages/5-7-electric-dipoles","description":"The dipole moment p = qd, pointing from the negative to the positive charge, no net force in a uniform field, and the torque τ = p × E. The size pE sin θ is worked out in this mission.","verified":"2026-11-28"},
 s6_1: {"title":"OpenStax University Physics Volume 2 — 6.1 Electric Flux","url":"https://openstax.org/books/university-physics-volume-2/pages/6-1-electric-flux","description":"Electric flux through a flat surface in a uniform field, EA cos θ, the area vector along the normal, flux as a surface integral, and the outward normal of a closed surface.","verified":"2026-11-28"},
 s6_2: {"title":"OpenStax University Physics Volume 2 — 6.2 Explaining Gauss's Law","url":"https://openstax.org/books/university-physics-volume-2/pages/6-2-explaining-gausss-law","description":"Gauss's law: the flux through any closed surface is the enclosed charge divided by ε₀, whatever the surface's shape, and a charge outside gives no net flux.","verified":"2026-11-28"},
 s6_3: {"title":"OpenStax University Physics Volume 2 — 6.3 Applying Gauss's Law","url":"https://openstax.org/books/university-physics-volume-2/pages/6-3-applying-gausss-law","description":"Choosing a Gaussian sphere, cylinder or box from the symmetry: the field outside a spherical charge as if all of it sat at the centre, λ ÷ (2πε₀r) for cylindrical symmetry and σ ÷ (2ε₀) for a plane. The page does not treat a thin spherical shell: that the field inside an evenly charged shell is 0 is worked out in q09 from the symmetry and Gauss's law.","verified":"2026-11-28"}
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q01",
  title: "Counting the clinging dust",
  topic: "Electric charge comes in whole numbers of e",
  tier: "Basic",
  sector: "Panel Field",
  brief: "Dust keeps sticking to the solar panels because it is charged, and the cleaning crew wants to know how much charge each grain carries and what the brush does to it.",
  lesson: "Electric charge comes in whole numbers of the elementary charge e = 1.60 × 10⁻¹⁹ C, and it is conserved: moving electrons only moves charge from one object to another.",
  prompt: "A dust grain on a solar panel carries a net charge of −4.8 × 10⁻¹⁷ C (coulombs). Charge comes only in whole numbers of the elementary charge e = 1.60 × 10⁻¹⁹ C: each electron carries −e and each proton +e. Enter how many more electrons than protons the grain has. Mira’s brush then pulls 120 electrons off the grain. Enter the grain’s new charge as the number that multiplies 10⁻¹⁷ C (a negative number for a negative charge).",
  answer: [300,-2.88],
  labels: ["extra electrons","new charge (× 10⁻¹⁷ C)"],
  tolerance: 0.005,
  hints: ["The number of extra electrons is the size of the charge divided by e. Dividing 10⁻¹⁷ by 10⁻¹⁹ gives 10², which is 100.","Charge is conserved: each electron the brush takes away removes −e from the grain. Find how many extra electrons are left (negative if protons now outnumber electrons), then multiply that count by −e."],
  solution: "The number of extra electrons is (4.8 × 10⁻¹⁷ C) ÷ (1.60 × 10⁻¹⁹ C) = (4.8 ÷ 1.6) × 100 = 3 × 100 = 300. Taking 120 electrons away leaves 180 extra electrons, so the new charge is −180 × 1.60 × 10⁻¹⁹ C = −2.88 × 10⁻¹⁷ C. The grain is still negative.",
  xp: 100,
  prereqs: [],
  artifact: {"name":"Dust tally","description":"A count of electrons on a single grain of panel dust."},
  sources: [source.s5_1],
  teaching: {"intuition":"Everything is made of atoms, and atoms hold two kinds of electric charge: positive protons in the nucleus and negative electrons around it. Charge is measured in coulombs, written C. A normal atom has as many electrons as protons, so its charges cancel and it is neutral. Rub two things together and some electrons move from one to the other: the one that gains electrons is negative, the one that loses them is positive. Charge cannot come in any amount you like. Every proton carries exactly +e and every electron exactly −e, where e = 1.60 × 10⁻¹⁹ C is the elementary charge, so the charge on any object is a whole number times e. Charge is also conserved: it is never made or destroyed, only moved. A coulomb is a huge amount of charge, so a dust grain carries a tiny fraction of one, written with a power of ten.","steps":["Write the charge in coulombs, with its power of ten, and note its sign.","Divide the size of the charge by e = 1.60 × 10⁻¹⁹ C to count the extra electrons (for a negative charge) or the missing electrons (for a positive one).","When electrons move, change the count: each electron taken away raises the charge by e, each one added lowers it by e.","Multiply the new count of extra electrons by −e to get the new charge."],"example":{"prompt":"A grain has charge −8.0 × 10⁻¹⁸ C. How many extra electrons does it carry, and what is its charge after it gains 30 more?","steps":["8.0 × 10⁻¹⁸ ÷ (1.60 × 10⁻¹⁹) = 5 × 10 = 50 extra electrons.","After gaining 30 more it has 80 extra electrons, so its charge is 80 × (−1.60 × 10⁻¹⁹ C) = −1.28 × 10⁻¹⁷ C."],"answer":"50 extra electrons; then −1.28 × 10⁻¹⁷ C."},"pitfalls":["Forgetting the powers of ten when dividing: 10⁻¹⁷ ÷ 10⁻¹⁹ is 10², not 10⁻².","Getting the sign backwards: taking electrons away makes an object more positive, because each electron carries a negative charge.","Thinking protons move when objects are rubbed or brushed. It is the electrons that move; the protons stay in the nuclei."]},
  guidance: [
   {"prompt":"How many times does e = 1.60 × 10⁻¹⁹ C go into 4.8 × 10⁻¹⁷ C? That is the number of extra electrons.","answer":[300],"labels":["extra electrons"],"explanation":"(4.8 ÷ 1.6) × 10⁻¹⁷ ÷ 10⁻¹⁹ = 3 × 100 = 300 electrons."},
   {"prompt":"The grain had 300 more electrons than protons and loses 120 electrons. How many more electrons than protons does it have now? (Enter a negative number if protons now outnumber electrons.)","answer":[180],"labels":["extra electrons left"],"explanation":"300 − 120 = 180. Protons are not moved, so only the electron count changes."},
   {"prompt":"Each extra electron carries −1.60 × 10⁻¹⁹ C. What is the new charge, as the number that multiplies 10⁻¹⁷ C?","answer":[-2.88],"labels":["new charge (× 10⁻¹⁷ C)"],"explanation":"180 × (−1.60 × 10⁻¹⁹ C) = −2.88 × 10⁻¹⁷ C."}
  ]
 },
 {
  id: "q02",
  title: "The push between two spheres",
  topic: "Coulomb's law: the force between two point charges",
  tier: "Basic",
  sector: "Panel Field",
  brief: "Before building a dust shield, Mira wants to measure how hard two charged spheres on the test rig push or pull on each other.",
  lesson: "Coulomb's law: two point charges push or pull on each other with a force of size k|q₁q₂| ÷ r²; like charges repel and unlike charges attract.",
  prompt: "Two small charged spheres sit on the panel test rig with their centres 0.5 m apart. One has charge q₁ = 3 μC and the other q₂ = −5 μC, where 1 μC (microcoulomb) is 10⁻⁶ C. Use Coulomb’s law with k = 8.99 × 10⁹ N·m²/C². Enter the size of the force each sphere exerts on the other in newtons, rounded to 2 decimal places. Then enter 1 if the spheres repel each other or −1 if they attract.",
  answer: [0.54,-1],
  labels: ["force (N)","repel 1, attract −1"],
  tolerance: 0.005,
  hints: ["Coulomb’s law: F = k|q₁q₂| ÷ r². Write each charge in coulombs first, so that 1 μC × 1 μC is 10⁻¹² C².","Like charges (both positive or both negative) repel; unlike charges attract."],
  solution: "F = k|q₁q₂| ÷ r² = 8.99 × 10⁹ × 15 × 10⁻¹² ÷ 0.5² = 134.85 × 10⁻³ ÷ 0.25 = 0.5394 N, which is 0.54 N to 2 decimal places. The charges have opposite signs, so the spheres attract: enter −1.",
  xp: 100,
  prereqs: ["q01"],
  artifact: {"name":"Test rig spheres","description":"Two charged spheres on insulating stands, a ruler between them."},
  sources: [source.s5_3],
  teaching: {"intuition":"Charges push and pull on each other across empty space. Two charges of the same sign repel; opposite signs attract. Coulomb's law gives the size of that force for two point charges, charges so small compared with the distance between them that they can be treated as points. The force grows with each charge and falls with the square of the distance: F = k|q₁q₂| ÷ r², where r is the distance between them and k = 8.99 × 10⁹ N·m²/C² is the Coulomb constant. Double the distance and the force drops to a quarter. The force on each charge points along the line joining them, and by Newton's third law the two charges feel forces of the same size in opposite directions. Small charges are written in microcoulombs, μC, where 1 μC = 10⁻⁶ C.","steps":["Write both charges in coulombs and the distance between them in metres.","Multiply the sizes of the charges, |q₁q₂|, and divide by r².","Multiply by k = 8.99 × 10⁹ N·m²/C² to get the force in newtons.","Read the direction from the signs: the same sign repels, opposite signs attract."],"example":{"prompt":"Charges of 2 μC and 6 μC sit 0.3 m apart. What is the force between them, and do they attract or repel?","steps":["|q₁q₂| = 2 × 10⁻⁶ × 6 × 10⁻⁶ = 12 × 10⁻¹² C².","F = 8.99 × 10⁹ × 12 × 10⁻¹² ÷ 0.09 = 0.10788 ÷ 0.09 ≈ 1.1987 N.","Both charges are positive, so they repel."],"answer":"About 1.20 N, repelling."},"pitfalls":["Forgetting to square the distance: dividing by r instead of r² gives a force that is far too small at short range.","Leaving the charges in μC: each μC is 10⁻⁶ C, so the product of two carries 10⁻¹².","Putting the signs into the size of the force. Use |q₁q₂| for the size and the signs only for the direction."]},
  guidance: [
   {"prompt":"Multiply the sizes of the two charges: what is |q₁q₂| as the number that multiplies 10⁻¹² C²?","answer":[15],"labels":["|q₁q₂| (× 10⁻¹² C²)"],"explanation":"3 μC × 5 μC = 15 × 10⁻⁶ × 10⁻⁶ C² = 15 × 10⁻¹² C²."},
   {"prompt":"Now F = k|q₁q₂| ÷ r² with r = 0.5 m. What is F in newtons, to 2 decimal places?","answer":[0.54],"labels":["force (N)"],"explanation":"8.99 × 10⁹ × 15 × 10⁻¹² = 134.85 × 10⁻³, and dividing by 0.5² = 0.25 gives 0.5394 N, so 0.54 N."},
   {"prompt":"q₁ = 3 μC and q₂ = −5 μC. Enter 1 if they repel or −1 if they attract.","answer":[-1],"labels":["repel 1, attract −1"],"explanation":"The two charges have opposite signs, and unlike charges attract."}
  ]
 },
 {
  id: "q03",
  title: "Three spheres on a rail",
  topic: "Superposition: the net force from several charges on a line",
  tier: "Basic",
  sector: "Panel Field",
  brief: "The dust shield will have several charged strips, so Mira needs the total push on one charge from two others at once.",
  lesson: "Superposition: the net force on a charge is the vector sum of the forces each other charge would exert on it alone.",
  prompt: "The panel test rail is an x-axis marked in metres. A test sphere with charge q = 2 μC sits at x = 0. A sphere with charge 5 μC sits at x = −0.3 m and a sphere with charge −4 μC sits at x = 0.2 m (1 μC = 10⁻⁶ C). Use k = 8.99 × 10⁹ N·m²/C². Enter the x component of the net electric force on the test sphere in newtons, rounded to 2 decimal places: positive if it points towards +x, negative if towards −x.",
  answer: [2.8],
  labels: ["net force, x component (N)"],
  tolerance: 0.005,
  hints: ["Find the size of each force alone with Coulomb’s law, F = k|q₁q₂| ÷ r², then give it a sign from its direction: a repelling force points away from the other sphere, an attracting one towards it.","By superposition the net force is the sum of the two signed x components. Round only at the end."],
  solution: "The sphere on the left repels the test sphere: F₁ = 8.99 × 10⁹ × 10 × 10⁻¹² ÷ 0.3² ≈ 0.9989 N, pointing towards +x, so F₁ₓ ≈ 0.9989 N. The sphere on the right attracts it: F₂ = 8.99 × 10⁹ × 8 × 10⁻¹² ÷ 0.2² = 1.798 N, pointing towards +x, so F₂ₓ = 1.798 N. By superposition the net x component is 0.9989 + 1.798 ≈ 2.7969 N, which is 2.80 N to 2 decimal places.",
  xp: 100,
  prereqs: ["q02"],
  artifact: {"name":"Charged rail","description":"A straight rail with three spheres clipped along it."},
  sources: [source.s5_3],
  teaching: {"intuition":"When several charges act on one charge, each pushes or pulls on it exactly as if the others were not there. This is the principle of superposition: the net force is the sum of the separate forces, added as vectors. On a straight line that is simple. Put the charges on an x-axis and give every force a sign: positive if it points towards +x, negative towards −x. Find the size of each force with Coulomb's law, decide its direction from whether it repels or attracts, and add the signed numbers. Two forces can help each other or cancel: a charge on the left that repels and a charge on the right that attracts both push the same way.","steps":["For each other charge alone, find the size of its force with Coulomb's law, F = k|q₁q₂| ÷ r².","Decide each force's direction: repelling points away from the other charge, attracting points towards it.","Write each force as a signed x component: + towards +x, − towards −x.","Add the signed components to get the net force, and round only at the end."],"example":{"prompt":"A 1 μC charge sits at x = 0, with a 3 μC charge at x = −0.1 m and a 3 μC charge at x = 0.3 m. What is the net force on it?","steps":["The left charge repels it towards +x: 8.99 × 10⁹ × 3 × 10⁻¹² ÷ 0.01 = 2.697 N, so +2.697 N.","The right charge repels it towards −x: 8.99 × 10⁹ × 3 × 10⁻¹² ÷ 0.09 ≈ 0.2997 N, so −0.2997 N.","Net: 2.697 − 0.2997 ≈ 2.3973 N."],"answer":"About 2.40 N towards +x."},"pitfalls":["Adding the sizes without signs: two forces in opposite directions partly cancel.","Giving a force the direction of the charge that causes it, instead of working out whether it repels or attracts.","Measuring both distances from the end of the rail instead of from the charge the force acts on."]},
  guidance: [
   {"prompt":"Take the sphere at x = −0.3 m alone. What is the x component of its force on the test sphere, in newtons to 2 decimal places (signed)?","answer":[1],"labels":["force from the left sphere (N)"],"explanation":"Size 8.99 × 10⁹ × 10 × 10⁻¹² ÷ 0.09 ≈ 0.9989 N. It repels, and the sphere is on the left, so the force points towards +x: 1.00 N."},
   {"prompt":"Now the sphere at x = 0.2 m alone. What is the x component of its force on the test sphere, in newtons to 2 decimal places (signed)?","answer":[1.8],"labels":["force from the right sphere (N)"],"explanation":"Size 8.99 × 10⁹ × 8 × 10⁻¹² ÷ 0.04 = 1.798 N. It attracts, and the sphere is on the right, so the force points towards +x: 1.80 N."},
   {"prompt":"Add the two signed x components. What is the net x component of the force, in newtons to 2 decimal places?","answer":[2.8],"labels":["net force, x component (N)"],"explanation":"0.9989 + 1.798 ≈ 2.7969 N, so 2.80 N."}
  ]
 },
 {
  id: "q04",
  title: "Mapping the sensor's field",
  topic: "The electric field of a point charge, and the force it gives",
  tier: "Basic",
  sector: "Panel Field",
  brief: "Mira wants a map of the push a charged sensor gives at each point, so that any grain dropped there can be checked at once.",
  lesson: "The electric field E is the force per coulomb a charge would feel at a point; a point charge makes a field of size k|q| ÷ r², and a charge Q placed there feels F = QE.",
  prompt: "A charged sensor with charge q = 6 nC sits at the origin of the panel grid, where 1 nC (nanocoulomb) is 10⁻⁹ C. The point P is at x = 0.3 m on the x-axis. Use k = 8.99 × 10⁹ N·m²/C². Enter the x component of the electric field at P in newtons per coulomb (N/C), rounded to 2 decimal places: positive if it points towards +x. Then a test charge Q = −2 μC is placed at P (1 μC = 10⁻⁶ C). Enter the x component of the force on it in micronewtons (μN, 10⁻⁶ N), using the unrounded field and rounding to 2 decimal places, without commas.",
  answer: [599.33,-1198.67],
  labels: ["field Eₓ (N/C)","force Fₓ (μN)"],
  tolerance: 0.005,
  hints: ["The field of a point charge has size E = k|q| ÷ r². It points away from a positive charge and towards a negative one.","The force on a charge Q placed in a field is F = QE. A charge in μC times a field in N/C gives a force in μN, and a negative Q turns the force against the field."],
  solution: "E = k|q| ÷ r² = 8.99 × 10⁹ × 6 × 10⁻⁹ ÷ 0.3² = 53.94 ÷ 0.09 ≈ 599.3333 N/C. P is on the +x side of the sensor and the sensor is positive, so the field points away from it, towards +x: Eₓ ≈ 599.3333 N/C, which is 599.33 N/C to 2 decimal places. The force on the test charge is Fₓ = QEₓ = −2 μC × 599.3333 N/C ≈ −1198.6667 μN, which is −1198.67 μN.",
  xp: 100,
  prereqs: ["q03"],
  artifact: {"name":"Field map","description":"A grid of arrows, longest beside the sensor and pointing away from it."},
  sources: [source.s5_4],
  teaching: {"intuition":"Instead of working out the force for every charge we might bring along, we can describe what a source charge does to the space around it. The electric field at a point is the force per coulomb that a small test charge would feel there. Its unit is the newton per coulomb, N/C. Once you know the field E, the force on any charge Q placed at that point is F = QE: a positive Q is pushed along the field, a negative Q against it. For a single point charge q, Coulomb's law gives a field of size E = k|q| ÷ r² at distance r. It points straight away from a positive charge and straight towards a negative one. Field lines draw this: they start on positive charges, end on negative ones, and are crowded where the field is strong. Charges are often given in nanocoulombs, nC, where 1 nC = 10⁻⁹ C.","steps":["Find the size of the field at the point: E = k|q| ÷ r².","Give it a direction: away from a positive source charge, towards a negative one. On an axis, write it as a signed component.","For a charge Q placed at the point, multiply: F = QE. A negative Q reverses the direction.","Check the units: a charge in μC times a field in N/C gives a force in μN."],"example":{"prompt":"A −4 nC charge sits at the origin. What is the field at x = 0.2 m, and the force on a 3 μC charge placed there?","steps":["Size: 8.99 × 10⁹ × 4 × 10⁻⁹ ÷ 0.04 = 35.96 ÷ 0.04 = 899 N/C.","The source is negative, so the field points back towards it: Eₓ = −899 N/C.","F = QE = 3 μC × (−899 N/C) = −2697 μN."],"answer":"Eₓ = −899 N/C and Fₓ = −2697 μN."},"pitfalls":["Using the test charge in E = k|q| ÷ r². The field belongs to the source charge; the test charge only enters through F = QE.","Forgetting that a negative test charge is pushed against the field.","Squaring the distance in centimetres instead of metres."]},
  guidance: [
   {"prompt":"What is the size of the field at P, k|q| ÷ r² with r = 0.3 m, in N/C to 2 decimal places?","answer":[599.33],"labels":["size of the field (N/C)"],"explanation":"8.99 × 10⁹ × 6 × 10⁻⁹ = 53.94, and 53.94 ÷ 0.09 ≈ 599.3333 N/C."},
   {"prompt":"The sensor’s charge is 6 nC. Give the field’s x component at P a sign: what is Eₓ in N/C, to 2 decimal places?","answer":[599.33],"labels":["field Eₓ (N/C)"],"explanation":"A positive charge’s field points away from it. P lies towards +x of the sensor, so Eₓ is positive."},
   {"prompt":"Multiply by the test charge: Fₓ = QEₓ with Q = −2 μC. What is Fₓ in μN, to 2 decimal places?","answer":[-1198.67],"labels":["force Fₓ (μN)"],"explanation":"−2 × 599.3333 ≈ −1198.6667, so Fₓ is −1198.67 μN."}
  ]
 },
 {
  id: "q05",
  title: "The guard rod's reach",
  topic: "The field of a charged rod by integration",
  tier: "Basic",
  sector: "Panel Field",
  brief: "A charged guard rod is to sweep dust off the panel edge, and Mira needs the field it makes at a point just beyond its end.",
  lesson: "A spread-out charge is cut into small pieces dq = λ dx; their point-charge fields are added with an integral.",
  prompt: "A charged guard rod lies along the x-axis of the panel grid from x = 0.1 m to x = 0.5 m. Its charge is spread evenly, with linear charge density λ = 15 nC/m (nanocoulombs per metre; 1 nC = 10⁻⁹ C). Enter the rod’s total charge in nC. Then enter the size of the electric field the rod makes at the origin, x = 0, in kilonewtons per coulomb (kN/C, 1 kN/C = 1000 N/C), rounded to 2 decimal places. Use k = 8.99 × 10⁹ N·m²/C².",
  answer: [6,1.08],
  labels: ["total charge (nC)","field (kN/C)"],
  tolerance: 0.005,
  hints: ["The total charge is the charge per metre times the length of the rod.","Cut the rod into pieces of length dx at distance x from the origin. Each holds dq = λ dx and makes a field of size kλ dx ÷ x², all pointing the same way along the axis, so add them with an integral from the near end to the far end."],
  solution: "The rod is 0.5 − 0.1 = 0.4 m long, so its charge is 15 nC/m × 0.4 m = 6 nC. A piece dx at distance x makes a field kλ dx ÷ x² along the axis, and every piece’s field points the same way, so E = ∫ kλ ÷ x² dx from 0.1 to 0.5 = kλ(1 ÷ 0.1 − 1 ÷ 0.5) = kλ × (10 − 2) = 8.99 × 10⁹ × 15 × 10⁻⁹ × 8 = 1078.8 N/C. That is 1.08 kN/C to 2 decimal places.",
  xp: 100,
  prereqs: ["q04"],
  artifact: {"name":"Guard rod","description":"A charged rod on brackets along the panel edge."},
  sources: [source.s5_5],
  teaching: {"intuition":"A rod is not a point charge: its charge is spread along its length. When it is spread evenly, the linear charge density λ (lambda) says how much charge there is per metre, in C/m or nC/m. (Charge spread over an area has a surface charge density σ in C/m².) To find the field of a rod, cut it into tiny pieces of length dx. Each piece holds dq = λ dx and acts like a point charge, so it makes a field of size k dq ÷ x², where x is its distance from the point. Superposition says the total field is the sum of all these pieces' fields, and a sum of infinitely many tiny pieces is an integral. For a point on the rod's own line, beyond one end, every piece pushes along the same line in the same direction, so the pieces add as plain numbers: E = ∫ kλ ÷ x² dx from the near end to the far end, which is kλ(1 ÷ near − 1 ÷ far).","steps":["Find the total charge: λ times the rod's length.","Put the point at the origin and write each piece's distance as x, running from the near end a to the far end b.","Each piece gives dE = kλ dx ÷ x², all along the same line, so E = ∫ kλ ÷ x² dx from a to b.","An antiderivative of 1 ÷ x² is −1 ÷ x, so E = kλ(1 ÷ a − 1 ÷ b). Multiply out and convert the units."],"example":{"prompt":"A rod with λ = 10 nC/m runs from x = 0.2 m to x = 0.8 m. What is its field at the origin?","steps":["Total charge: 10 nC/m × 0.6 m = 6 nC.","1 ÷ 0.2 − 1 ÷ 0.8 = 5 − 1.25 = 3.75 per metre.","E = 8.99 × 10⁹ × 10 × 10⁻⁹ × 3.75 = 89.9 × 3.75 = 337.125 N/C, about 0.34 kN/C."],"answer":"About 0.34 kN/C, pointing away from the rod (it is positive)."},"pitfalls":["Treating the whole rod as a point charge at its middle. The near part counts far more than the far part, so this gives the wrong answer close up.","Integrating from 0: the rod starts at the near end, not at the point where the field is measured.","Mixing centimetres and metres in 1 ÷ a − 1 ÷ b."]},
  guidance: [
   {"prompt":"The rod runs from 0.1 m to 0.5 m and holds 15 nC per metre. What is its total charge in nC?","answer":[6],"labels":["total charge (nC)"],"explanation":"Its length is 0.4 m, and 15 × 0.4 = 6 nC."},
   {"prompt":"The integral of 1 ÷ x² from 0.1 to 0.5 is 1 ÷ 0.1 − 1 ÷ 0.5. What is that number, in 1/m?","answer":[8],"labels":["1 ÷ a − 1 ÷ b (1/m)"],"explanation":"An antiderivative of 1 ÷ x² is −1 ÷ x, so the integral is 10 − 2 = 8 per metre."},
   {"prompt":"Multiply by kλ = 8.99 × 10⁹ × 15 × 10⁻⁹ N·m/C. What is E in kN/C, to 2 decimal places?","answer":[1.08],"labels":["field (kN/C)"],"explanation":"kλ = 134.85 N·m/C, and 134.85 × 8 = 1078.8 N/C, which is 1.08 kN/C."}
  ]
 },
 {
  id: "q06",
  title: "The sensor that turns",
  topic: "Dipoles: dipole moment and torque in a uniform field",
  tier: "Basic",
  sector: "Panel Field",
  brief: "A dust sensor with a charge at each end keeps swinging round in the guard field, and Mira wants to know how strongly it is being turned.",
  lesson: "A dipole is a pair of equal and opposite charges; its dipole moment is p = qd, and a uniform field turns it with a torque of size pE sin θ.",
  prompt: "A dust sensor holds charges +5 nC and −5 nC on the two ends of a rod 0.04 m long (1 nC = 10⁻⁹ C). It sits in the uniform field of a panel guard, of strength 30 kN/C (1 kN/C = 1000 N/C), and the angle between the dipole moment and the field is θ = π/6 radians. Enter the size of the dipole moment p in nanocoulomb-metres (nC·m). Then enter the size of the torque on the sensor in micronewton-metres (μN·m, 10⁻⁶ N·m), rounded to 2 decimal places.",
  answer: [0.2,3],
  labels: ["dipole moment (nC·m)","torque (μN·m)"],
  tolerance: 0.005,
  hints: ["The dipole moment is p = qd: one charge’s size times the distance between the charges.","Each charge feels a force qE, in opposite directions, each acting a distance d ÷ 2 from the centre. Their torques add to τ = qdE sin θ = pE sin θ. A charge in nC times a field in kN/C is a force in μN."],
  solution: "p = qd = 5 nC × 0.04 m = 0.2 nC·m. Each charge feels a force of size qE = 5 nC × 30 kN/C = 150 μN, the two in opposite directions, so the net force is zero but they turn the rod. Each acts 0.02 m from the centre at angle θ, so the torque is 2 × 150 μN × 0.02 m × sin(π/6) = pE sin θ = 0.2 × 30 × 0.5 = 3 μN·m.",
  xp: 100,
  prereqs: ["q04"],
  artifact: {"name":"Swinging sensor","description":"A short rod with a plus and a minus end, turning on a pin."},
  sources: [source.s5_7],
  teaching: {"intuition":"A dipole is a pair of equal and opposite charges, +q and −q, a small distance d apart. Its dipole moment p = qd measures how strong it is; p is a vector that points from the negative charge to the positive one. In a uniform field, one where E has the same size and direction everywhere, the two charges feel forces qE of the same size in opposite directions. Those forces cancel, so the dipole does not move off, but they do turn it. You met torque in Mechanics: force times lever arm, F r sin θ. Each charge is d ÷ 2 from the centre, so the two torques add to 2 × qE × (d ÷ 2) × sin θ = pE sin θ, where θ is the angle between p and E. The torque is largest at θ = π/2 and zero when the dipole lines up with the field. Angles here are in radians.","steps":["Find the dipole moment: p = qd, using the size of one charge and the distance between them.","Each charge feels a force of size qE; the two point in opposite directions, so the net force is zero.","Add their torques about the centre: τ = pE sin θ, with θ the angle between p and E.","Check the units: nC·m times kN/C is 10⁻⁹ × 10³ N·m = μN·m."],"example":{"prompt":"Charges of ±3 nC sit 0.05 m apart in a 20 kN/C field, at θ = π/2. What are p and the torque?","steps":["p = 3 nC × 0.05 m = 0.15 nC·m.","τ = pE sin θ = 0.15 × 20 × sin(π/2) = 0.15 × 20 × 1 = 3 μN·m."],"answer":"p = 0.15 nC·m and τ = 3 μN·m."},"pitfalls":["Using 2q instead of q in p = qd: the dipole moment uses the size of one charge.","Using cos θ instead of sin θ: the torque vanishes when the dipole lines up with the field (θ = 0), where sin θ is 0.","Setting a calculator to degrees: θ is given in radians."]},
  guidance: [
   {"prompt":"What is the dipole moment p = qd, with q = 5 nC and d = 0.04 m, in nC·m?","answer":[0.2],"labels":["dipole moment (nC·m)"],"explanation":"5 × 0.04 = 0.2 nC·m."},
   {"prompt":"What is the size of the force on one of the charges, qE, in μN?","answer":[150],"labels":["force on one charge (μN)"],"explanation":"5 nC × 30 kN/C = 5 × 10⁻⁹ × 30 × 10³ N = 150 × 10⁻⁶ N = 150 μN."},
   {"prompt":"The torque is τ = pE sin θ with θ = π/6. What is τ in μN·m, to 2 decimal places?","answer":[3],"labels":["torque (μN·m)"],"explanation":"sin(π/6) = 0.5, and 0.2 × 30 × 0.5 = 3, so τ is 3.00 μN·m."}
  ]
 },
 {
  id: "q07",
  title: "Field through a tilted panel",
  topic: "Electric flux and the surface integral",
  tier: "Basic",
  sector: "Shield Dome",
  brief: "The Shield Dome's panels sit at many angles, and Mira wants a single number for how much field passes through each one.",
  lesson: "Electric flux measures how much field passes through a surface: EA cos θ for a flat surface in a uniform field, and a surface integral when the field varies.",
  prompt: "A flat solar panel of area 3 m² sits in a uniform electric field of 400 N/C. The angle between the field and the panel’s normal (the direction straight out of its face) is π/3 radians. Enter the electric flux through the panel in N·m²/C, rounded to 2 decimal places and without commas (negative if the field passes in through the back). A second panel, 2 m wide and 3 m tall, faces straight into a field whose strength grows across its width: at distance x metres from its left edge the field is 50x N/C, along the normal. Enter the flux through the second panel in N·m²/C, also without commas.",
  answer: [600,300],
  labels: ["flux, first panel (N·m²/C)","flux, second panel (N·m²/C)"],
  tolerance: 0.005,
  hints: ["For a uniform field and a flat surface the flux is Φ = EA cos θ, with θ the angle between the field and the normal.","When the field changes across the surface, cut it into thin strips where the field is nearly constant. A strip of width dx has area h dx and flux E(x) × h dx; the surface integral adds them: Φ = ∫ E(x) h dx across the width."],
  solution: "First panel: Φ = EA cos θ = 400 × 3 × cos(π/3) = 1200 × 0.5 = 600 N·m²/C. Second panel: a strip at x of width dx has area 3 dx and flux 50x × 3 dx, so Φ = ∫ 150x dx from 0 to 2 = 150 × 2² ÷ 2 = 300 N·m²/C.",
  xp: 100,
  prereqs: ["q04"],
  artifact: {"name":"Tilt gauge","description":"A frame that swings a panel to any angle in the field."},
  sources: [source.s6_1],
  teaching: {"intuition":"Think of field lines as rain and a panel as a window. The electric flux Φ (phi) through a surface counts how much field passes through it. A panel facing the field head-on catches the most; turned edge-on it catches none. To measure the tilt we use the surface's normal, the direction straight out of its face, and the angle θ between the field and the normal. For a flat surface of area A in a uniform field, Φ = EA cos θ, in N·m²/C. If θ is more than π/2 the field goes in through the back and the flux is negative. When the field is not the same everywhere on the surface, cut the surface into thin strips small enough that the field is nearly constant on each, find each strip's flux, and add them with an integral. That integral over a surface is called a surface integral: Φ = ∫ E cos θ dA.","steps":["Find the normal of the surface and the angle θ between it and the field.","For a uniform field and a flat surface: Φ = EA cos θ.","For a field that changes across the surface, cut it into strips of area dA (for a strip of width dx and height h, dA = h dx).","Add the strips' fluxes with the surface integral Φ = ∫ E cos θ dA, here an ordinary integral across the width."],"example":{"prompt":"A 2 m² panel sits in a 600 N/C field at π/4 radians to its normal. A 1 m by 4 m panel faces a field of 30x N/C across its 4 m width. Find both fluxes.","steps":["Φ = 600 × 2 × cos(π/4) ≈ 1200 × 0.7071 ≈ 848.53 N·m²/C.","Strips of width dx have area 1 dx, so Φ = ∫ 30x dx from 0 to 4 = 15 × 16 = 240 N·m²/C."],"answer":"About 848.53 N·m²/C, and 240 N·m²/C."},"pitfalls":["Taking θ between the field and the panel's surface instead of its normal: that swaps cos for sin.","Multiplying the largest field by the whole area when the field changes across the panel.","Dropping the minus sign when the field enters through the back of the panel."]},
  guidance: [
   {"prompt":"What is cos(π/3), to 2 decimal places? It tells you what share of the field goes straight through the first panel.","answer":[0.5],"labels":["cos θ"],"explanation":"cos(π/3) = 0.5."},
   {"prompt":"Multiply EA by that cosine (unrounded). What is the flux through the first panel, in N·m²/C to 2 decimal places?","answer":[600],"labels":["flux, first panel (N·m²/C)"],"explanation":"400 × 3 = 1200, and 1200 × cos(π/3) = 600 N·m²/C."},
   {"prompt":"For the second panel, add up the strips: what is ∫ 50x × 3 dx from x = 0 to x = 2, in N·m²/C?","answer":[300],"labels":["flux, second panel (N·m²/C)"],"explanation":"An antiderivative of 150x is 75x², and 75 × 4 = 300."}
  ]
 },
 {
  id: "q08",
  title: "What the closed box hides",
  topic: "Gauss's law: flux out of a closed surface and the charge inside",
  tier: "Basic",
  sector: "Shield Dome",
  brief: "Mira can measure the flux through a closed test surface without opening it, and wants to read off the charge inside.",
  lesson: "Gauss's law: the net flux out of any closed surface is the charge it encloses divided by ε₀; charges outside add nothing.",
  prompt: "A closed test surface wraps one of the dome’s sensor racks. Inside it are charges of 4 nC and −1 nC; just outside it is a charge of 6 nC (1 nC = 10⁻⁹ C). Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Enter the net electric flux out of the closed surface in N·m²/C, rounded to the nearest whole number and without commas (negative if more flux goes in than out). A second closed surface, around a different rack, has a net outward flux of 1000 N·m²/C. Enter the net charge inside it in nC, to 2 decimal places.",
  answer: [339,8.85],
  labels: ["flux out (N·m²/C)","charge inside (nC)"],
  tolerance: 0.005,
  hints: ["Gauss’s law: the net flux out of a closed surface is the charge enclosed divided by ε₀. A charge outside sends as much flux in as out, so it adds nothing.","Run Gauss’s law backwards for the second surface: the enclosed charge is ε₀ times the flux."],
  solution: "Only the charges inside count: q_enc = 4 − 1 = 3 nC; the 6 nC outside adds no net flux. Φ = q_enc ÷ ε₀ = 3 × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ≈ 338.9831 N·m²/C, which is 339 to the nearest whole number. For the second surface q_enc = ε₀Φ = 8.85 × 10⁻¹² × 1000 = 8.85 × 10⁻⁹ C = 8.85 nC.",
  xp: 100,
  prereqs: ["q07"],
  artifact: {"name":"Sealed test box","description":"A closed mesh box with a flux reading on its side."},
  sources: [source.s6_2],
  teaching: {"intuition":"A closed surface is one with no gaps, like a balloon or a sealed box: it has an inside and an outside, and its normal is taken to point outwards everywhere. Field lines start on positive charges and end on negative ones. So every line from a positive charge inside must cross the surface going out, while a charge outside sends its lines in one side and out the other, adding nothing in total. Gauss's law makes this exact: the net flux out of any closed surface equals the charge it encloses divided by ε₀, the permittivity of free space (ε₀ = 8.85 × 10⁻¹² C²/(N·m²)). Φ = q_enc ÷ ε₀, whatever the shape or size of the surface. A negative enclosed charge gives a negative net flux: more goes in than comes out. The law also runs backwards: q_enc = ε₀Φ.","steps":["Decide which charges are inside the closed surface and which are outside.","Add the charges inside, with their signs, to get q_enc.","The net outward flux is Φ = q_enc ÷ ε₀; charges outside add nothing.","To find the charge from a measured flux, run it backwards: q_enc = ε₀Φ."],"example":{"prompt":"A closed surface holds 7 nC and −2 nC, with 3 nC outside. What is the flux out? A second one has flux 400 N·m²/C; what charge is inside?","steps":["q_enc = 7 − 2 = 5 nC; the 3 nC outside does not count.","Φ = 5 × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ≈ 564.97, about 565 N·m²/C.","q_enc = 8.85 × 10⁻¹² × 400 = 3.54 × 10⁻⁹ C = 3.54 nC."],"answer":"About 565 N·m²/C, and 3.54 nC."},"pitfalls":["Counting a charge outside the surface. It sends as much flux in as out.","Thinking a bigger surface around the same charge has more flux. The flux depends only on the charge enclosed.","Multiplying by ε₀ when you should divide: from charge to flux divide by ε₀; from flux to charge multiply."]},
  guidance: [
   {"prompt":"What is the net charge enclosed by the first surface, in nC?","answer":[3],"labels":["charge inside (nC)"],"explanation":"4 − 1 = 3 nC. The charge outside is not enclosed."},
   {"prompt":"Divide by ε₀: what is the net flux out of the first surface, in N·m²/C to the nearest whole number?","answer":[339],"labels":["flux out (N·m²/C)"],"explanation":"3 × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ≈ 338.9831, which rounds to 339."},
   {"prompt":"For the second surface, multiply: ε₀ × 1000 N·m²/C. What is the enclosed charge in nC?","answer":[8.85],"labels":["charge inside (nC)"],"explanation":"8.85 × 10⁻¹² × 1000 = 8.85 × 10⁻⁹ C, which is 8.85 nC."}
  ]
 },
 {
  id: "q09",
  title: "Inside the double dome",
  topic: "Gauss's law for a sphere: inside and outside charged shells",
  tier: "Basic",
  sector: "Shield Dome",
  brief: "The Shield Dome is two charged shells, one inside the other, and Mira needs the field at the instrument ring between them and on the walkway outside.",
  lesson: "For a spherical charge, a Gaussian sphere through the point gives E = kq_enc ÷ r²: only the charge inside that sphere counts.",
  prompt: "The Shield Dome has two thin spherical shells with the same centre. The inner shell has radius 1 m and carries 20 nC spread evenly over it; the outer shell has radius 4 m and carries −50 nC, also spread evenly over it (1 nC = 10⁻⁹ C). Use k = 8.99 × 10⁹ N·m²/C², which is 1 ÷ (4πε₀). Enter the radial component of the electric field 2 m from the centre, then 5 m from the centre, both in N/C rounded to 2 decimal places: positive if the field points outwards, negative if inwards.",
  answer: [44.95,-10.79],
  labels: ["field between the shells (N/C)","field outside both (N/C)"],
  tolerance: 0.005,
  hints: ["Use a Gaussian surface: a sphere through the point, with the same centre. By symmetry the field has the same size all over it and points straight out or in, so Gauss’s law gives E × 4πr² = q_enc ÷ ε₀, which is E = kq_enc ÷ r².","Only the charge inside the Gaussian sphere counts. A shell larger than the sphere, with its charge spread evenly, adds nothing to the field there: by symmetry its own field would be the same size all over the sphere and straight out or in, and its flux through the sphere is 0, so that field is 0."],
  solution: "At 2 m the Gaussian sphere encloses only the inner shell, 20 nC, so E = kq_enc ÷ r² = 8.99 × 10⁹ × 20 × 10⁻⁹ ÷ 2² = 44.95 N/C. At 5 m it encloses both shells, 20 − 50 = −30 nC, so E = 8.99 × (−30) ÷ 25 = −10.788 N/C, which is −10.79 N/C to 2 decimal places. Inside the inner shell a Gaussian sphere would enclose no charge at all, so the field there is 0.",
  xp: 100,
  prereqs: ["q08"],
  artifact: {"name":"Double dome","description":"Two nested charged shells with a walkway around them."},
  sources: [source.s6_3, source.s6_2],
  teaching: {"intuition":"Gauss's law is true for every closed surface, but it only gives the field easily when we choose the surface cleverly. Such a chosen surface is called a Gaussian surface. Charge spread evenly over a sphere looks the same from every direction, so its field must point straight out (or in) and have the same size everywhere at one distance r from the centre. Take a Gaussian sphere of radius r with the same centre. The field is the same all over it and along its normal, so the flux is just E times its area: E × 4πr² = q_enc ÷ ε₀. That gives E = q_enc ÷ (4πε₀r²) = kq_enc ÷ r², with k = 1 ÷ (4πε₀). Outside, the charge acts as if it all sat at the centre. Inside a thin shell with its charge spread evenly, a Gaussian sphere encloses none of the shell's charge, so the shell's flux through it is 0. By the same symmetry the shell's field there would be the same size all over the Gaussian sphere and straight out or in, and the only such field with zero flux is no field at all: an evenly charged shell adds nothing to the field inside itself. (If the shell's charge were bunched up on one side, the symmetry would fail and this would not follow.)","steps":["Draw a Gaussian sphere through the point, with the same centre as the charge.","Find the charge it encloses: add the shells (or charges) that lie inside it.","Gauss's law with the symmetry gives E × 4πr² = q_enc ÷ ε₀, so E = kq_enc ÷ r².","The sign of q_enc gives the direction: positive outwards, negative inwards."],"example":{"prompt":"Two thin shells share a centre: one of radius 2 m holds 30 nC and one of radius 5 m holds 10 nC, each spread evenly. What is the field 3 m and 6 m from the centre?","steps":["At 3 m only the inner shell is enclosed: E = 8.99 × 30 ÷ 9 ≈ 29.97 N/C, outwards.","At 6 m both are enclosed, 40 nC: E = 8.99 × 40 ÷ 36 ≈ 9.99 N/C, outwards."],"answer":"About 29.97 N/C and 9.99 N/C, both outwards."},"pitfalls":["Counting a shell that is larger than the Gaussian sphere. Its charge is outside and adds nothing at that point.","Using the shell's radius instead of the distance r of the point from the centre.","Dropping the signs: a negative enclosed charge makes the field point inwards."]},
  guidance: [
   {"prompt":"A Gaussian sphere of radius 2 m: how much charge does it enclose, in nC?","answer":[20],"labels":["charge enclosed (nC)"],"explanation":"It lies outside the inner shell (1 m) but inside the outer one (4 m), so it encloses only 20 nC."},
   {"prompt":"What is the radial field at 2 m, kq_enc ÷ r², in N/C to 2 decimal places?","answer":[44.95],"labels":["field between the shells (N/C)"],"explanation":"8.99 × 20 ÷ 4 = 44.95 N/C."},
   {"prompt":"A Gaussian sphere of radius 5 m encloses both shells. What charge does it enclose, in nC?","answer":[-30],"labels":["charge enclosed (nC)"],"explanation":"20 − 50 = −30 nC."},
   {"prompt":"What is the radial field at 5 m, in N/C to 2 decimal places?","answer":[-10.79],"labels":["field outside both (N/C)"],"explanation":"8.99 × (−30) ÷ 25 = −10.788 N/C."}
  ]
 },
 {
  id: "q10",
  title: "The cable and the wall",
  topic: "Gauss's law for a long line and a flat sheet",
  tier: "Basic",
  sector: "Shield Dome",
  brief: "A charged power cable runs past the dome beside a charged wall panel, and Mira wants to know the field from each before the crew walks there.",
  lesson: "A Gaussian cylinder gives E = λ ÷ (2πε₀r) for a long charged line; a Gaussian box gives E = σ ÷ (2ε₀) for a large charged sheet.",
  prompt: "A long straight power cable runs past the Shield Dome carrying a fixed charge of λ = 40 nC per metre along its length (1 nC = 10⁻⁹ C). Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²) and treat the cable as infinitely long. Enter the size of its electric field 0.2 m from the cable, in kN/C (1 kN/C = 1000 N/C) to 2 decimal places. A large flat dome panel carries σ = 120 nC/m² spread evenly over it; treat it as an infinite sheet. Enter the size of its field near the panel, in kN/C to 2 decimal places.",
  answer: [3.6,6.78],
  labels: ["field of the cable (kN/C)","field of the sheet (kN/C)"],
  tolerance: 0.005,
  hints: ["For the cable, take a Gaussian cylinder of radius r and length L around it. Flux leaves only through the curved side, area 2πrL, so E × 2πrL = λL ÷ ε₀ and E = λ ÷ (2πε₀r).","For the sheet, take a Gaussian box that pokes through it, with faces of area A on both sides. Flux leaves through both faces, so E × 2A = σA ÷ ε₀ and E = σ ÷ (2ε₀), the same at any distance."],
  solution: "Cable: E = λ ÷ (2πε₀r) = 40 × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × 0.2) ≈ 3596.7219 N/C, which is 3.60 kN/C. (2πε₀r ≈ 11.1212 × 10⁻¹² C²/(N·m).) Sheet: E = σ ÷ (2ε₀) = 120 × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ≈ 6779.661 N/C, which is 6.78 kN/C, at any distance close to the panel.",
  xp: 100,
  prereqs: ["q09"],
  artifact: {"name":"Cable and wall","description":"A charged cable on posts beside a flat charged panel."},
  sources: [source.s6_3],
  teaching: {"intuition":"The same trick works for other shapes, as long as the Gaussian surface matches the symmetry. A very long straight line with charge λ per metre looks the same from every side and all along its length, so its field points straight out from the line and depends only on the distance r. Wrap it in a Gaussian cylinder of radius r and length L. No flux leaves through the flat ends, because the field runs along them; through the curved side, of area 2πrL, the flux is E × 2πrL. Gauss's law sets this equal to λL ÷ ε₀, so E = λ ÷ (2πε₀r). A large flat sheet with surface charge density σ (charge per square metre) has a field straight out of each face. A Gaussian box poking through it, with faces of area A on each side, has flux 2EA and encloses σA, so E = σ ÷ (2ε₀): the same at any distance from the sheet.","steps":["Match the Gaussian surface to the symmetry: a cylinder around a line, a box through a sheet.","Find the flux: only the faces the field passes through count (the curved side, or the two faces).","Set the flux equal to q_enc ÷ ε₀ and solve for E: λ ÷ (2πε₀r) for a line, σ ÷ (2ε₀) for a sheet.","Convert to the units asked for: 1 kN/C = 1000 N/C."],"example":{"prompt":"A long line holds 30 nC/m. What is its field 0.5 m away? A sheet holds 50 nC/m²; what is its field?","steps":["Line: 30 × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × 0.5) ≈ 30 × 10⁻⁹ ÷ (2.7803 × 10⁻¹¹) ≈ 1079 N/C.","Sheet: 50 × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ≈ 2824.86 N/C."],"answer":"About 1.08 kN/C and 2.82 kN/C."},"pitfalls":["Using the point-charge rule k q ÷ r² for a long line: a line's field falls off as 1 ÷ r, not 1 ÷ r².","Forgetting the 2 in σ ÷ (2ε₀): the flux leaves through both faces of the box.","Expecting a large sheet's field to weaken with distance. Close to a large sheet it does not."]},
  guidance: [
   {"prompt":"What is the cable’s field λ ÷ (2πε₀r) at r = 0.2 m, in kN/C to 2 decimal places?","answer":[3.6],"labels":["field of the cable (kN/C)"],"explanation":"2π × 8.85 × 10⁻¹² × 0.2 ≈ 11.1212 × 10⁻¹², and 40 × 10⁻⁹ divided by that ≈ 3596.7219 N/C, so 3.60 kN/C."},
   {"prompt":"What is the sheet’s field σ ÷ (2ε₀), in kN/C to 2 decimal places?","answer":[6.78],"labels":["field of the sheet (kN/C)"],"explanation":"2ε₀ = 1.77 × 10⁻¹¹, and 120 × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ≈ 6779.661 N/C, so 6.78 kN/C."}
  ]
 }
);
})();
