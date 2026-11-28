/* Electricity and magnetism: fields missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/em/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Dielectrics: κ raises the capacitance [8.4]
     q22  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Current: charge per second, and charge from I(t) by integration [9.1]
     q23  ch 4 Capacitors and current · Intermediate, 150 XP · sector 'Battery Vault' · Chapter review: a capacitor bank [8.2, 8.3]
     q24  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Resistivity and resistance of a cable, R = ρL/A [9.3]
     q25  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Ohm's law and electrical power [9.4, 9.5]
     q26  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Resistors in series and parallel [10.2]
     q27  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Kirchhoff's junction and loop rules [10.3]
     q28  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Charging a capacitor: RC time constant [10.5]
     q29  ch 5 Circuits · Intermediate, 150 XP · sector 'Cable Works' · Chapter review: a full circuit [10.2, 10.3]
     q30  ch 6 Magnetism · Advanced, 200 XP · sector 'Ore Sorter' · Magnetic force on a moving charge, F = qvB sin θ [11.2] */
(function(){
'use strict';
/* OpenStax University Physics Volume 2 sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 2 — 5.3 Coulomb's Law
   Link to the section page itself: https://openstax.org/books/university-physics-volume-2/pages/<section-slug> */
const source = {
 s8_2: { title: "OpenStax University Physics Volume 2 — 8.2 Capacitors in Series and in Parallel", url: "https://openstax.org/books/university-physics-volume-2/pages/8-2-capacitors-in-series-and-in-parallel", description: "Equivalent capacitance in series (reciprocals add) and in parallel (capacitances add), equal charge in series and equal voltage in parallel, and reducing series–parallel networks step by step.", verified: '2026-11-28' },
 s8_3: { title: "OpenStax University Physics Volume 2 — 8.3 Energy Stored in a Capacitor", url: "https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor", description: "The energy stored in a capacitor, U = ½CV² = Q² ÷ (2C) = ½QV, and the energy of a network of capacitors.", verified: '2026-11-28' },
 s8_4: { title: "OpenStax University Physics Volume 2 — 8.4 Capacitor with a Dielectric", url: "https://openstax.org/books/university-physics-volume-2/pages/8-4-capacitor-with-a-dielectric", description: "A dielectric filling an isolated charged capacitor: the charge stays, the voltage falls to V₀ ÷ κ, the capacitance rises to κC₀ and the energy falls to U₀ ÷ κ.", verified: '2026-11-28' },
 s9_1: { title: "OpenStax University Physics Volume 2 — 9.1 Electrical Current", url: "https://openstax.org/books/university-physics-volume-2/pages/9-1-electrical-current", description: "Average current ΔQ ÷ Δt, instantaneous current I = dQ/dt, the ampere as one coulomb per second, and the number of electrons in a current of one ampere.", verified: '2026-11-28' },
 s9_3: { title: "OpenStax University Physics Volume 2 — 9.3 Resistivity and Resistance", url: "https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance", description: "Resistivity in Ω·m with a table of values for metals, and the resistance of a wire, R = ρL ÷ A.", verified: '2026-11-28' },
 s9_4: { title: "OpenStax University Physics Volume 2 — 9.4 Ohm’s Law", url: "https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law", description: "Ohm’s law V = IR, and ohmic and nonohmic components.", verified: '2026-11-28' },
 s9_5: { title: "OpenStax University Physics Volume 2 — 9.5 Electrical Energy and Power", url: "https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power", description: "Electrical power P = IV, the power taken by a resistor, I²R and V² ÷ R, and energy as power times time.", verified: '2026-11-28' },
 s10_2: { title: "OpenStax University Physics Volume 2 — 10.2 Resistors in Series and Parallel", url: "https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel", description: "Equivalent resistance in series and in parallel, the same current in series and the same voltage in parallel, and reducing combinations step by step.", verified: '2026-11-28' },
 s10_3: { title: "OpenStax University Physics Volume 2 — 10.3 Kirchhoff’s Rules", url: "https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules", description: "The junction rule and the loop rule, the sign of each voltage change round a loop, and solving a two-source circuit for its currents, where a negative current flows against its arrow.", verified: '2026-11-28' },
 s10_5: { title: "OpenStax University Physics Volume 2 — 10.5 RC Circuits", url: "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits", description: "Charging a capacitor through a resistor: the time constant τ = RC, the charge and voltage rising as 1 − e^(−t/τ), 63.2% after one time constant, and the falling current.", verified: '2026-11-28' },
 s11_2: { title: "OpenStax University Physics Volume 2 — 11.2 Magnetic Fields and Lines", url: "https://openstax.org/books/university-physics-volume-2/pages/11-2-magnetic-fields-and-lines", description: "The magnetic force on a moving charge, F = qvB sin θ, the tesla, and the right-hand rule for its direction, reversed for a negative charge.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: "q21", title: "Packing the vault capacitor", topic: "Dielectrics: κ raises the capacitance", tier: "Intermediate", sector: "Battery Vault",
  brief: "The vault needs more storage without building more capacitors, so the crew will slide insulating slabs between the plates of the ones it has.",
  lesson: "A dielectric that fills a capacitor multiplies its capacitance by κ; what happens to the energy depends on whether the charge or the voltage is held fixed.",
  prompt: "A capacitor in the Battery Vault has a capacitance of 8 μF with only air between its plates, and it is charged from the 50 V supply. The supply is then disconnected, so no charge can reach or leave the plates. Next a slab with dielectric constant κ = 4 is slid in so that it fills the gap. Treat air as κ = 1. Enter the new capacitance in μF, then the energy now stored in the capacitor in mJ (1 mJ = 1000 μJ). Both are exact decimals.",
  answer: [32,2.5], labels: ["new capacitance (μF)","energy stored now (mJ)"], tolerance: 0.005,
  hints: [
   "A slab that fills the gap multiplies the capacitance by its dielectric constant: C = κC₀.",
   "Decide what stays fixed. With the supply disconnected the charge Q stays the same, so use U = Q² ÷ (2C); with the supply connected the voltage V stays the same, so use U = ½CV²."
  ],
  solution: "The new capacitance is C = κC₀ = 4 × 8 = 32 μF. The charge cannot change, so it stays Q = C₀V = 8 × 50 = 400 μC, and the voltage falls to Q ÷ C = 12.5 V. The energy is U = Q² ÷ (2C) = 160000 ÷ 64 = 2500 μJ = 2.5 mJ, which is the 10 mJ stored before divided by κ = 4: the field pulled the slab in, and the energy went into that work.",
  xp: 150, prereqs: ["q20"],
  artifact: {"name":"Dielectric slab","description":"A sheet of insulator cut to fit between capacitor plates and raise their capacitance."},
  sources: [source.s8_4],
  teaching: {
   "intuition": "A dielectric is an insulating material, such as glass, plastic or paper, placed between the plates of a capacitor. Its molecules cannot carry charge away, but in the field between the plates their charges shift slightly, the negative side of each molecule towards the positive plate. These shifted charges partly cancel the field inside, so the same charge on the plates now gives a smaller voltage. Capacitance is charge per volt, C = Q ÷ V, so a smaller voltage for the same charge means a larger capacitance. The factor is the dielectric constant, κ (the Greek letter kappa), a number fixed by the material: vacuum has κ = 1 exactly, air is so close to 1 that we treat it as 1, and every other material has κ greater than 1. A slab that fills the gap gives C = κC₀, where C₀ is the capacitance with nothing between the plates. What happens to the stored energy depends on what holds still. If the capacitor was disconnected from its supply, no charge can arrive or leave, so Q stays the same; the voltage falls to V₀ ÷ κ and the energy U = Q² ÷ (2C) falls to U₀ ÷ κ (the field pulls the slab in, and does work on it). If the supply stays connected, it holds the voltage fixed instead; it pushes extra charge on, Q = κC₀V, and the energy U = ½CV² rises to κ times U₀.",
   "steps": [
    "Find the new capacitance: C = κC₀, for a slab that fills the gap.",
    "Decide what is fixed. Supply disconnected: the charge Q = C₀V₀ stays the same. Supply connected: the voltage stays the same.",
    "Work out the energy with the formula that uses the fixed quantity: U = Q² ÷ (2C) for fixed charge, U = ½CV² for fixed voltage.",
    "Keep the units together: μF times volts gives μC, and μF times volts squared (or μC squared over μF) gives μJ. Divide μJ by 1000 for mJ."
   ],
   "example": {
    "prompt": "A 5 μF capacitor stays connected to a 100 V supply while a slab with κ = 2 is slid in to fill its gap. What are the new capacitance and the energy stored?",
    "steps": [
     "C = κC₀ = 2 × 5 = 10 μF.",
     "The supply holds the voltage at 100 V, so U = ½CV² = ½ × 10 × 10000 = 50000 μJ.",
     "50000 μJ is 50 mJ, twice the 25 mJ stored before the slab went in."
    ],
    "answer": "10 μF and 50 mJ."
   },
   "pitfalls": [
    "Using the old voltage after the supply was disconnected. Without the supply the charge is what stays fixed; the voltage drops by the factor κ.",
    "Dividing the capacitance by κ. A dielectric always raises the capacitance: C = κC₀ with κ greater than 1.",
    "Forgetting the units: μF × V² gives μJ, which must be divided by 1000 to give mJ."
   ]
  },
  guidance: [
   { prompt: "The slab has κ = 4 and fills the gap of the 8 μF capacitor. What is the new capacitance (μF)?", answer: [32], labels: ["new capacitance (μF)"], explanation: "C = κC₀ = 4 × 8 = 32 μF." },
   { prompt: "The supply was disconnected before the slab went in, so the charge keeps the value it had: Q = C₀V. What is the charge on the plates now (μC)?", answer: [400], labels: ["charge on the plates (μC)"], explanation: "Q = C₀V = 8 × 50 = 400 μC, and it cannot change: there is no path for charge to leave." },
   { prompt: "The charge is 400 μC and the capacitance is 32 μF. What is the stored energy U = Q² ÷ (2C) (mJ)?", answer: [2.5], labels: ["energy stored now (mJ)"], explanation: "U = 160000 ÷ 64 = 2500 μJ, which is 2.5 mJ." }
  ]
 },
 {
  id: "q22", title: "Counting the charge in the cable", topic: "Current: charge per second, and charge from I(t) by integration", tier: "Intermediate", sector: "Battery Vault",
  brief: "The charger’s log only records the current, and the crew wants to know how much charge it has actually delivered.",
  lesson: "Current is the rate at which charge passes, I = dQ/dt, so the charge that passes in a time is the integral of the current over that time.",
  prompt: "When the vault’s charger starts, the current in its charging cable ramps up as I(t) = 3 + 2t amperes, t seconds after switch-on. Enter the charge that passes along the cable in the first 5 s, in coulombs, then the number of electrons that carry it, in units of 10¹⁸ (enter N for N × 10¹⁸ electrons; type it without commas). Each electron carries a charge of size e = 1.60 × 10⁻¹⁹ C.",
  answer: [40,250], labels: ["charge (C)","electrons (units of 10¹⁸)"], tolerance: 0.005,
  hints: [
   "Current is charge per second, so the charge is the integral of the current over the time: Q is the integral of I(t) from t = 0 to the end time.",
   "Each electron carries 1.60 × 10⁻¹⁹ C, so the number of electrons is Q ÷ (1.60 × 10⁻¹⁹), which is Q × 6.25 × 10¹⁸."
  ],
  solution: "Q is the integral of 3 + 2t from t = 0 to t = 5. An antiderivative is 3t + 2t² ÷ 2, so Q = 3 × 5 + 2 × 25 ÷ 2 = 15 + 25 = 40 C. The number of electrons is 40 ÷ (1.60 × 10⁻¹⁹) = 40 × 6.25 × 10¹⁸ = 250 × 10¹⁸.",
  xp: 150, prereqs: ["q01"],
  artifact: {"name":"Charge meter","description":"A meter that integrates the current in a cable to show the charge delivered."},
  sources: [source.s9_1],
  teaching: {
   "intuition": "An electric current is charge on the move. Picture a cable and an imaginary cut across it: the current I is how much charge crosses that cut each second. Its unit is the ampere (A), one coulomb per second, so a current of 3 A carries 3 C past the cut every second. A steady current over a time carries current × time. Most currents are not steady, so we use calculus. If Q is the charge that has passed by time t, the current at each moment is its rate of change, I = dQ/dt. Going the other way, the charge that passes between two times is the integral of I(t) between them: the area under the graph of current against time. In a metal wire the charge is carried by electrons, each with charge of size e = 1.60 × 10⁻¹⁹ C, so the number of electrons is the charge divided by e. One coulomb is 1 ÷ (1.60 × 10⁻¹⁹) = 6.25 × 10¹⁸ electrons. By custom the direction of a current is the way positive charge would move; electrons, being negative, drift the opposite way.",
   "steps": [
    "Write the current as a function of time, I(t), in amperes, and the time interval in seconds.",
    "Integrate I(t) over the interval to get the charge Q in coulombs. For a steady current this is just current × time.",
    "Divide the charge by e = 1.60 × 10⁻¹⁹ C to count the electrons; that is the same as multiplying by 6.25 × 10¹⁸."
   ],
   "example": {
    "prompt": "The current in a cable is I(t) = 1 + 4t amperes. How much charge passes in the first 2 s, and how many electrons is that?",
    "steps": [
     "An antiderivative of 1 + 4t is t + 2t², so Q = 2 + 2 × 4 = 10 C.",
     "Electrons: 10 × 6.25 × 10¹⁸ = 62.5 × 10¹⁸."
    ],
    "answer": "10 C, carried by 62.5 × 10¹⁸ electrons."
   },
   "pitfalls": [
    "Multiplying the final current by the time. That works only for a steady current; a changing current needs the integral.",
    "Multiplying by 1.60 × 10⁻¹⁹ instead of dividing: one coulomb is a huge number of electrons, not a tiny one.",
    "Forgetting the units in the answer box: the count is asked in units of 10¹⁸, so 62.5 × 10¹⁸ is entered as 62.5."
   ]
  },
  guidance: [
   { prompt: "The steady part of the current, 3 A, flows for the whole 5 s. How much charge does that part carry (C)?", answer: [15], labels: ["charge from the steady part (C)"], explanation: "A steady current carries current × time: 3 × 5 = 15 C." },
   { prompt: "The growing part, 2t amperes, carries the integral of 2t from t = 0 to t = 5, which is 2 × 5² ÷ 2. What is that charge (C)?", answer: [25], labels: ["charge from the growing part (C)"], explanation: "2 × 25 ÷ 2 = 25 C. On a graph of I against t it is the triangle under the rising line." },
   { prompt: "The total charge is 15 + 25 = 40 C. How many electrons is that, in units of 10¹⁸?", answer: [250], labels: ["electrons (units of 10¹⁸)"], explanation: "40 ÷ (1.60 × 10⁻¹⁹) = 40 × 6.25 × 10¹⁸ = 250 × 10¹⁸ electrons." }
  ]
 },
 {
  id: "q23", title: "Wiring the night bank", topic: "Chapter review: a capacitor bank", tier: "Intermediate", sector: "Battery Vault",
  brief: "The night bank is a mix of capacitors, one with a dielectric slab, and the crew needs the charge and energy it will hold.",
  lesson: "Reduce a capacitor network to one equivalent capacitor, then Q = CV and U = ½CV² give the total charge and energy.",
  prompt: "A capacitor bank for the night shift is wired like this: capacitors B (4 μF) and C (2 μF when empty) are side by side in parallel, and that pair is in series with capacitor A (6 μF). Capacitor C is filled with a slab of dielectric constant κ = 4. The whole bank is connected across a 30 V supply. Enter the total charge the supply puts on the bank in μC (type it without commas), then the total energy stored in the bank in mJ. Both are exact decimals.",
  answer: [120,1.8], labels: ["total charge (μC)","total energy (mJ)"], tolerance: 0.005,
  hints: [
   "First give capacitor C its new value, κ times the empty one. Then reduce the bank one step at a time: capacitors in parallel add, C = C₁ + C₂, and for capacitors in series the reciprocals add, 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂.",
   "The supply sees one equivalent capacitor: the total charge is Q = CV and the total energy is U = ½CV², which is also QV ÷ 2."
  ],
  solution: "With the slab, C has κ × 2 = 4 × 2 = 8 μF. B and C in parallel: 4 + 8 = 12 μF. In series with A: 6 × 12 ÷ (6 + 12) = 4 μF. The total charge is Q = CV = 4 × 30 = 120 μC, and the energy is U = ½CV² = ½ × 4 × 900 = 1800 μJ = 1.8 mJ.",
  xp: 150, prereqs: ["q19","q21"],
  artifact: {"name":"Night bank","description":"The capacitor bank that carries the outpost through the dark hours."},
  sources: [source.s8_2, source.s8_3],
  teaching: {
   "intuition": "A bank of capacitors behaves, as far as the supply can tell, like one capacitor. Its equivalent capacitance is found by reducing the network one piece at a time. Capacitors side by side in parallel share the same voltage, so their charges add and so do their capacitances: C = C₁ + C₂. Capacitors in series, one after the other, carry the same charge while their voltages add, so their reciprocals add: 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂, which for two of them is C₁C₂ ÷ (C₁ + C₂). A capacitor filled with a dielectric (q21) first gets its new value, κ times its empty one. Once the whole bank is one equivalent capacitor C across a voltage V, the charge the supply has moved onto it is Q = CV, and the energy stored in the whole bank is U = ½CV², the same as the sum of the energies in its parts.",
   "steps": [
    "Give any capacitor with a dielectric its new value: C = κC₀.",
    "Find the innermost group that is purely in series or purely in parallel and replace it by its equivalent capacitance.",
    "Repeat until one capacitor is left: that is the bank’s equivalent capacitance.",
    "Total charge Q = CV (μF × V gives μC); total energy U = ½CV² (μF × V² gives μJ; divide by 1000 for mJ)."
   ],
   "example": {
    "prompt": "Capacitors of 6 μF and 1 μF are in series, and that pair is in parallel with a 3 μF capacitor. The 1 μF one is filled with a slab of κ = 3. The bank is across 10 V. Find the total charge and energy.",
    "steps": [
     "With the slab, the 1 μF capacitor becomes 3 μF.",
     "The series pair: 6 × 3 ÷ (6 + 3) = 2 μF. In parallel with 3 μF: 2 + 3 = 5 μF.",
     "Q = 5 × 10 = 50 μC and U = ½ × 5 × 100 = 250 μJ = 0.25 mJ."
    ],
    "answer": "50 μC and 0.25 mJ."
   },
   "pitfalls": [
    "Adding series capacitances. In series it is the reciprocals that add, so the result is smaller than the smallest capacitor.",
    "Using the empty value of a capacitor that has a dielectric in it: multiply by κ first.",
    "Leaving the energy in μJ when the answer asks for mJ."
   ]
  },
  guidance: [
   { prompt: "Capacitor C is 2 μF when empty and is filled with a slab of κ = 4. What is its capacitance now (μF)?", answer: [8], labels: ["capacitor C with slab (μF)"], explanation: "C = κC₀ = 4 × 2 = 8 μF." },
   { prompt: "B (4 μF) and C (8 μF) are in parallel. What is their equivalent capacitance (μF)?", answer: [12], labels: ["B and C together (μF)"], explanation: "In parallel the capacitances add: 4 + 8 = 12 μF." },
   { prompt: "That 12 μF pair is in series with A (6 μF). What is the capacitance of the whole bank (μF)?", answer: [4], labels: ["whole bank (μF)"], explanation: "In series, C = C₁C₂ ÷ (C₁ + C₂) = 72 ÷ 18 = 4 μF." },
   { prompt: "The bank acts as one 4 μF capacitor across 30 V. What total charge does the supply put on it (μC)?", answer: [120], labels: ["total charge (μC)"], explanation: "Q = CV = 4 × 30 = 120 μC." }
  ]
 },
 {
  id: "q24", title: "Sizing the dome cable", topic: "Resistivity and resistance of a cable, R = ρL/A", tier: "Intermediate", sector: "Cable Works",
  brief: "Every dome needs a cable from the Cable Works, and the crew must know how much each cable resists the current before they lay it.",
  lesson: "A wire’s resistance is its material’s resistivity times its length, divided by its cross-sectional area: R = ρL ÷ A.",
  prompt: "A copper cable runs 250 m from the Cable Works to a dome. Its conductor is one solid round wire 2 mm across, and copper has resistivity ρ = 1.68 × 10⁻⁸ Ω·m. Enter the cross-sectional area of the wire in mm², then the resistance of the cable in ohms (Ω), both rounded to 2 decimal places. Work out the resistance from the unrounded area.",
  answer: [3.14,1.34], labels: ["area (mm²)","resistance (Ω)"], tolerance: 0.005,
  hints: [
   "The cross-section is a circle whose radius is half the diameter, so A = πr². To change mm² to m², multiply by 10⁻⁶.",
   "Resistance grows with length and falls with area: R = ρL ÷ A, with ρ in Ω·m, L in m and A in m²."
  ],
  solution: "The radius is 2 ÷ 2 = 1 mm, so A = π × 1² ≈ 3.1416 mm², which is 3.14 mm² to 2 decimal places, or 3.1416 × 10⁻⁶ m². Then R = ρL ÷ A = (1.68 × 10⁻⁸ × 250) ÷ (3.1416 × 10⁻⁶) ≈ 1.3369 Ω, which rounds to 1.34 Ω.",
  xp: 150, prereqs: ["q22"],
  artifact: {"name":"Cable gauge","description":"A ring gauge that measures a wire’s diameter, and a card of resistivities."},
  sources: [source.s9_3],
  teaching: {
   "intuition": "A current does not flow through a wire for free: the moving electrons keep bumping into the atoms of the metal. The resistance R of a wire measures how strongly it opposes a current, and its unit is the ohm, written Ω (the Greek capital omega). Three things set it. The material: each material has a resistivity, ρ (the Greek letter rho), measured in ohm-metres (Ω·m); copper and silver have small resistivities, iron a larger one. The length L: a wire twice as long makes the charge push past twice as many atoms, so it has twice the resistance. The cross-sectional area A, the area of the cut face of the wire: a wire twice as thick in area gives the current twice as many paths side by side, so it has half the resistance. Together, R = ρL ÷ A. For a round wire of diameter d, the radius is d ÷ 2 and the area is A = π(d ÷ 2)². Diameters are usually given in millimetres, and a square millimetre is 10⁻⁶ m², because a millimetre is 10⁻³ m.",
   "steps": [
    "Find the radius of the wire, half its diameter, and its cross-sectional area A = πr².",
    "Change the area to square metres: 1 mm² = 10⁻⁶ m².",
    "Compute R = ρL ÷ A with ρ in Ω·m and L in metres; the result is in ohms."
   ],
   "example": {
    "prompt": "An aluminium wire (ρ = 2.65 × 10⁻⁸ Ω·m) is 100 m long and 1 mm across. What is its resistance?",
    "steps": [
     "The radius is 0.5 mm, so A = π × 0.25 ≈ 0.7854 mm² = 0.7854 × 10⁻⁶ m².",
     "R = (2.65 × 10⁻⁸ × 100) ÷ (0.7854 × 10⁻⁶) ≈ 3.374 Ω."
    ],
    "answer": "About 3.37 Ω."
   },
   "pitfalls": [
    "Using the diameter in A = πr² instead of the radius, which makes the area four times too big.",
    "Forgetting that 1 mm² is 10⁻⁶ m², not 10⁻³ m².",
    "Rounding the area first and then using the rounded value: work out the resistance from the unrounded area."
   ]
  },
  guidance: [
   { prompt: "The wire is 2 mm across. What is its radius (mm)?", answer: [1], labels: ["radius (mm)"], explanation: "The radius is half the diameter: 2 ÷ 2 = 1 mm." },
   { prompt: "What is the area of the circular cross-section, π × 1², in mm², to 2 decimal places?", answer: [3.14], labels: ["area (mm²)"], explanation: "π × 1 ≈ 3.1416 mm², which rounds to 3.14 mm²." },
   { prompt: "With ρ = 1.68 × 10⁻⁸ Ω·m, L = 250 m and A = 3.1416 × 10⁻⁶ m², what is R = ρL ÷ A in ohms, to 2 decimal places?", answer: [1.34], labels: ["resistance (Ω)"], explanation: "R = (1.68 × 10⁻⁸ × 250) ÷ (3.1416 × 10⁻⁶) ≈ 1.3369 Ω, which rounds to 1.34 Ω." }
  ]
 },
 {
  id: "q25", title: "Powering the dome heater", topic: "Ohm’s law and electrical power", tier: "Intermediate", sector: "Cable Works",
  brief: "A dome’s heater panel is going on its supply, and the crew must check the current it will draw and the heat it will give.",
  lesson: "Ohm’s law, V = IR, gives the current through a resistor from its voltage, and the power it takes is P = IV.",
  prompt: "A heater panel in a dome has a resistance of 48 Ω and is connected across the dome’s 120 V supply. Enter the current through the panel in amperes, then the power it turns into heat in watts (type it without commas).",
  answer: [2.5,300], labels: ["current (A)","power (W)"], tolerance: 0.005,
  hints: [
   "Ohm’s law: the current is the voltage divided by the resistance, I = V ÷ R.",
   "Electrical power is current times voltage, P = IV. For a resistor it is also I²R and V² ÷ R."
  ],
  solution: "By Ohm’s law, I = V ÷ R = 120 ÷ 48 = 2.5 A. The power is P = IV = 2.5 × 120 = 300 W. Check: I²R = 6.25 × 48 = 300 W as well.",
  xp: 150, prereqs: ["q24"],
  artifact: {"name":"Heater panel","description":"A resistive panel that turns electrical energy into warmth for a dome."},
  sources: [source.s9_4, source.s9_5],
  teaching: {
   "intuition": "A current needs a push. That push is the voltage V between the two ends of a component, measured in volts (V): it is the energy each coulomb of charge gives up in passing from one end to the other, and one volt means one joule per coulomb. (The volt is taught in full in the electric potential chapter; this is all we need here.) For many components, such as a metal wire or a heater element at a steady temperature, the current is proportional to the voltage: double the push and you double the flow. The fixed ratio is the resistance, and the rule is Ohm’s law, V = IR, so I = V ÷ R. This also says what an ohm is: one volt per ampere. Components that obey it are called ohmic. Each coulomb that passes gives up V joules, and I coulombs pass each second, so the energy given up each second, the power, is P = IV, in watts (W, joules per second). Putting V = IR into it gives two more forms for a resistor: P = I²R and P = V² ÷ R. In a heater all that energy becomes heat.",
   "steps": [
    "Find the current with Ohm’s law: I = V ÷ R, with V in volts and R in ohms, giving amperes.",
    "Find the power: P = IV, in watts.",
    "Check with another form: P = I²R or P = V² ÷ R should give the same number."
   ],
   "example": {
    "prompt": "A heater element of 8 Ω is connected across 24 V. What current does it draw and what power does it give off?",
    "steps": [
     "I = 24 ÷ 8 = 3 A.",
     "P = IV = 3 × 24 = 72 W; check: I²R = 9 × 8 = 72 W."
    ],
    "answer": "3 A and 72 W."
   },
   "pitfalls": [
    "Multiplying voltage by resistance to get the current. Current is voltage divided by resistance.",
    "Using P = I²R with the voltage in place of the current.",
    "Typing the power with a thousands comma: the answer box reads a comma as a decimal point."
   ]
  },
  guidance: [
   { prompt: "The panel has 120 V across it and a resistance of 48 Ω. What current flows through it (A)?", answer: [2.5], labels: ["current (A)"], explanation: "I = V ÷ R = 120 ÷ 48 = 2.5 A." },
   { prompt: "A current of 2.5 A flows with 120 V across the panel. What power does it turn into heat (W)?", answer: [300], labels: ["power (W)"], explanation: "P = IV = 2.5 × 120 = 300 W: each coulomb gives up 120 J, and 2.5 coulombs pass every second." }
  ]
 },
 {
  id: "q26", title: "Splitting the cable run", topic: "Resistors in series and parallel", tier: "Intermediate", sector: "Cable Works",
  brief: "One supply has to feed a cable and two heaters at once, and the crew needs to know how much current it will have to give.",
  lesson: "Resistances in series add; for resistances in parallel the reciprocals add. A network reduces to one equivalent resistance, and the source current is ε ÷ R.",
  prompt: "A supply with emf ε = 24 V feeds a cable run. The current goes through a feed cable of 4 Ω, then splits between two heaters of 6 Ω and 12 Ω connected in parallel, which join again and lead back to the supply. Treat the supply as ideal (no resistance inside it) and the connecting wires as having no resistance. Enter the equivalent resistance of the whole run in ohms, then the current from the supply in amperes. Both are exact decimals.",
  answer: [8,3], labels: ["equivalent resistance (Ω)","current from the supply (A)"], tolerance: 0.005,
  hints: [
   "Two resistors in parallel combine by adding reciprocals, 1 ÷ R = 1 ÷ R₁ + 1 ÷ R₂, which for two of them is R₁R₂ ÷ (R₁ + R₂). Resistors in series simply add.",
   "The supply sees one equivalent resistor, so the current it gives is I = ε ÷ R."
  ],
  solution: "The heaters in parallel: 6 × 12 ÷ (6 + 12) = 72 ÷ 18 = 4 Ω. In series with the feed cable: 4 + 4 = 8 Ω. The current from the supply is I = ε ÷ R = 24 ÷ 8 = 3 A.",
  xp: 150, prereqs: ["q25"],
  artifact: {"name":"Branch box","description":"A junction box where one feed splits into two heater lines."},
  sources: [source.s10_2],
  teaching: {
   "intuition": "A battery or supply drives current round a circuit. Its emf, written ε (the Greek letter epsilon), is the voltage it provides: the energy it gives each coulomb that passes through it, in volts. An ideal source has no resistance of its own, so its full emf is available to the circuit. When resistors are joined in series, one after another, the same current passes through each, and the voltages across them add, so the resistances add: R = R₁ + R₂ + …. When resistors are joined in parallel, side by side between the same two points, each has the same voltage across it and the currents add. Since each current is V ÷ R, the reciprocals add: 1 ÷ R = 1 ÷ R₁ + 1 ÷ R₂ + …, which for two resistors is R₁R₂ ÷ (R₁ + R₂). The parallel result is always smaller than the smallest resistor, because the current gets an extra path. A network of series and parallel pieces is reduced step by step to one equivalent resistance, and the current the source gives is then I = ε ÷ R.",
   "steps": [
    "Find a group that is purely in parallel or purely in series and replace it by one equivalent resistor.",
    "Repeat until a single equivalent resistance R is left for the whole network.",
    "The current from the source is I = ε ÷ R."
   ],
   "example": {
    "prompt": "A 14 V ideal supply feeds a 2 Ω cable followed by two 10 Ω heaters in parallel. What is the equivalent resistance and the current?",
    "steps": [
     "The heaters in parallel: 10 × 10 ÷ (10 + 10) = 5 Ω.",
     "In series with the cable: 2 + 5 = 7 Ω, so I = 14 ÷ 7 = 2 A."
    ],
    "answer": "7 Ω and 2 A."
   },
   "pitfalls": [
    "Adding parallel resistances. In parallel the reciprocals add, and the result is smaller than either resistor.",
    "Taking 1 ÷ R₁ + 1 ÷ R₂ as the answer and forgetting to turn it back over.",
    "Dividing the emf by one resistor instead of the equivalent resistance of the whole network."
   ]
  },
  guidance: [
   { prompt: "The heaters of 6 Ω and 12 Ω are in parallel. What single resistance can replace the pair (Ω)?", answer: [4], labels: ["parallel pair (Ω)"], explanation: "R = R₁R₂ ÷ (R₁ + R₂) = 72 ÷ 18 = 4 Ω. It is less than either heater: the current has two paths." },
   { prompt: "The feed cable of 4 Ω is in series with that 4 Ω pair. What is the equivalent resistance of the whole run (Ω)?", answer: [8], labels: ["equivalent resistance (Ω)"], explanation: "In series the resistances add: 4 + 4 = 8 Ω." },
   { prompt: "The 24 V supply drives current through 8 Ω. What current does it give (A)?", answer: [3], labels: ["current from the supply (A)"], explanation: "I = ε ÷ R = 24 ÷ 8 = 3 A." }
  ]
 },
 {
  id: "q27", title: "Balancing the two batteries", topic: "Kirchhoff’s junction and loop rules", tier: "Intermediate", sector: "Cable Works",
  brief: "Two batteries share the junction tower’s wiring, and the crew needs every branch current, including any that runs backwards.",
  lesson: "At a junction the currents in equal the currents out; around a closed loop the voltage changes add to zero. Together they give one equation per unknown current.",
  prompt: "Two junctions in the Cable Works, A at the top and B at the bottom, are joined by three branches. Left branch: a battery of emf ε₁ = 12 V with its positive terminal towards A, in series with a resistor R₁ = 2 Ω. Middle branch: a resistor R₂ = 4 Ω alone. Right branch: a battery of emf ε₂ = 6 V with its positive terminal towards A, in series with a resistor R₃ = 2 Ω. The batteries are ideal and the wires have no resistance. Call I₁ the current up the left branch towards A, I₂ the current down the middle branch from A to B, and I₃ the current up the right branch towards A. Enter I₁, I₂ and I₃ in amperes; a negative value means that current really flows the other way. Each is an exact decimal with at most 2 places.",
  answer: [2.4,1.8,-0.6], labels: ["I₁ (A)","I₂ (A)","I₃ (A)"], tolerance: 0.005,
  hints: [
   "Junction rule at A: the current flowing in equals the current flowing out, so I₂ = I₁ + I₃.",
   "Loop rule: around any closed loop the voltage changes add up to zero. Going through a battery from − to + gains its emf; going through a resistor in the direction of its current loses I × R. Write one equation for the left loop and one for the right loop, then solve them together."
  ],
  solution: "Junction A: I₂ = I₁ + I₃. Left loop (up the left branch, down the middle): 12 − 2 × I₁ − 4 × I₂ = 0. Right loop (up the right branch, down the middle): 6 − 2 × I₃ − 4 × I₂ = 0. Putting in I₂ = I₁ + I₃ gives 12 = 6 × I₁ + 4 × I₃ and 6 = 4 × I₁ + 6 × I₃. Eliminating I₃: I₁ = (12 × 6 − 4 × 6) ÷ (6 × 6 − 4²) = 48 ÷ 20 = 2.4 A. In the same way I₃ = (6 × 6 − 4 × 12) ÷ 20 = −12 ÷ 20 = −0.6 A, and I₂ = 2.4 + (−0.6) = 1.8 A. The minus sign on I₃ means that current flows down its branch, against the arrow chosen.",
  xp: 150, prereqs: ["q26"],
  artifact: {"name":"Junction tower diagram","description":"The wiring plan of the junction tower, with every branch current marked."},
  sources: [source.s10_3],
  teaching: {
   "intuition": "Some circuits cannot be reduced to series and parallel pieces, for example when two batteries push current through shared wires. Kirchhoff’s rules handle any circuit. A junction is a point where three or more wires meet; a branch is a path between two junctions; a loop is any closed path round the circuit. The junction rule says that charge does not pile up at a junction, so the total current flowing in equals the total current flowing out. The loop rule says that if you walk once round any loop and return to where you started, the voltage changes add up to zero, because you are back at the same electrical level, just as a walk round a hill that returns to its start has no net climb. Walking through a battery from its − terminal to its + terminal gains its emf; walking through a resistor in the direction of its current loses I × R (walking against the current gains I × R). To use the rules, give each branch a current with a chosen arrow, write the junction rule and enough loop equations, and solve. If a current comes out negative, it really flows against the arrow you chose: the arrow was a guess, and the sign corrects it.",
   "steps": [
    "Draw an arrow for the current in each branch and name the currents I₁, I₂, I₃.",
    "Write the junction rule at one junction: currents in = currents out.",
    "Write the loop rule for two loops: emfs gained minus I × R lost, added round the loop, equal zero.",
    "Substitute the junction rule into the loop equations and solve the two equations for two currents; the junction rule then gives the third. A negative current flows against its arrow."
   ],
   "example": {
    "prompt": "Junctions A (top) and B (bottom) are joined by a left branch with a 9 V battery (+ towards A) and 1 Ω, a middle branch of 2 Ω, and a right branch with a 3 V battery (+ towards A) and 1 Ω. Currents I₁ and I₃ flow up the side branches, I₂ down the middle. Find them.",
    "steps": [
     "Junction A: I₂ = I₁ + I₃. Loops: 9 = 1 × I₁ + 2 × I₂ and 3 = 1 × I₃ + 2 × I₂, so 9 = 3 × I₁ + 2 × I₃ and 3 = 2 × I₁ + 3 × I₃.",
     "Multiply the first by 3 and the second by 2 and subtract: 27 − 6 = (9 − 4) × I₁, so I₁ = 21 ÷ 5 = 4.2 A.",
     "Then 2 × I₃ = 9 − 12.6 = −3.6, so I₃ = −1.8 A, and I₂ = 4.2 − 1.8 = 2.4 A."
    ],
    "answer": "I₁ = 4.2 A, I₂ = 2.4 A, I₃ = −1.8 A (the right branch’s current really flows down, charging the 3 V battery)."
   },
   "pitfalls": [
    "Getting a sign wrong in the loop rule: a resistor crossed along its current arrow is a loss, −IR, whatever the true direction turns out to be.",
    "Changing an arrow after finding a negative current and then reusing the old equations. Keep the arrows and let the sign speak.",
    "Writing the junction rule with every current flowing in. At A, I₁ and I₃ arrive and I₂ leaves."
   ]
  },
  guidance: [
   { prompt: "Put I₂ = I₁ + I₃ into both loop equations: 12 = 6 × I₁ + 4 × I₃ and 6 = 4 × I₁ + 6 × I₃. Eliminate I₃: multiply the first equation by 6, the second by 4, and subtract. What is I₁ (A)?", answer: [2.4], labels: ["I₁ (A)"], explanation: "72 − 24 = (36 − 16) × I₁, so I₁ = 48 ÷ 20 = 2.4 A." },
   { prompt: "Put I₁ = 2.4 into 12 = 6 × I₁ + 4 × I₃. What is I₃ (A)?", answer: [-0.6], labels: ["I₃ (A)"], explanation: "4 × I₃ = 12 − 6 × 2.4 = −2.4, so I₃ = −0.6 A." },
   { prompt: "Use the junction rule at A. What is I₂ (A)?", answer: [1.8], labels: ["I₂ (A)"], explanation: "I₂ = I₁ + I₃ = 2.4 + (−0.6) = 1.8 A." }
  ]
 },
 {
  id: "q28", title: "Timing the charge-up", topic: "Charging a capacitor: RC time constant", tier: "Intermediate", sector: "Cable Works",
  brief: "The backup capacitor charges through a resistor, and the crew needs to know how full it will be when the next load switches on.",
  lesson: "A capacitor charging through a resistor reaches V = ε(1 − e^(−t/τ)), with the time constant τ = RC setting how fast.",
  prompt: "A capacitor of 250 μF, empty to begin with, is charged through a resistor of 20 kΩ from an ideal supply of emf 12 V. Enter the time constant of the circuit in seconds, then the voltage across the capacitor 10 s after the switch closes, in volts, rounded to 2 decimal places.",
  answer: [5,10.38], labels: ["time constant (s)","capacitor voltage (V)"], tolerance: 0.005,
  hints: [
   "The time constant is τ = RC with R in ohms and C in farads. A kilohm is 10³ Ω and a microfarad is 10⁻⁶ F, so kΩ × μF gives 10⁻³ s.",
   "While it charges, the capacitor voltage is V = ε(1 − e^(−t/τ)). Here e ≈ 2.718 is the base of natural exponentials, not the charge of an electron."
  ],
  solution: "τ = RC = 20 × 10³ Ω × 250 × 10⁻⁶ F = 5 s. At t = 10 s, t ÷ τ = 2, so V = 12 × (1 − e^(−2)) ≈ 12 × 0.8647 ≈ 10.376 V, which rounds to 10.38 V.",
  xp: 150, prereqs: ["q27","q20"],
  artifact: {"name":"Charge timer","description":"A dial marked in time constants, showing how full a capacitor is."},
  sources: [source.s10_5],
  teaching: {
   "intuition": "Connect an empty capacitor through a resistor to a source of emf ε and close the switch. At first the capacitor has no voltage, so the loop rule (q27) puts all of ε across the resistor, and a large current ε ÷ R flows, carrying charge onto the plates. As charge builds up, the capacitor’s voltage Q ÷ C grows and pushes back, so less voltage is left for the resistor and the current falls. The capacitor fills quickly at first and then more and more slowly: its voltage creeps towards ε but never quite reaches it. The result is exponential: V = ε(1 − e^(−t/τ)), where e ≈ 2.718 is the base of natural exponentials (not the electron charge). The time constant τ (the Greek letter tau) is the product τ = RC; with R in ohms and C in farads it is in seconds. A large resistor lets charge through slowly and a large capacitor needs more charge, so either makes the charging slower. After one time constant the capacitor is at 1 − e^(−1), about 63.2% of ε; after five it is above 99%.",
   "steps": [
    "Find the time constant τ = RC, with R in ohms and C in farads. kΩ × μF gives milliseconds: 10³ × 10⁻⁶ = 10⁻³ s.",
    "Work out how many time constants have passed: t ÷ τ.",
    "The capacitor voltage is V = ε(1 − e^(−t/τ)). The current at that time is (ε ÷ R)e^(−t/τ)."
   ],
   "example": {
    "prompt": "A 100 μF capacitor charges through 100 kΩ from 9 V. What is τ, and the capacitor voltage after 10 s?",
    "steps": [
     "τ = 100 × 10³ × 100 × 10⁻⁶ = 10 s.",
     "t ÷ τ = 1, so V = 9 × (1 − e^(−1)) ≈ 9 × 0.6321 ≈ 5.69 V."
    ],
    "answer": "τ = 10 s and about 5.69 V."
   },
   "pitfalls": [
    "Forgetting the prefixes: kΩ × μF is 10⁻³ s, so 20 kΩ with 250 μF is 5 s, not 5000 s.",
    "Using e^(−t/τ) alone, which is the fraction still missing, not the fraction charged.",
    "Mixing up the two e’s: in the exponential, e is about 2.718, not the electron charge."
   ]
  },
  guidance: [
   { prompt: "R = 20 kΩ and C = 250 μF. What is the time constant τ = RC (s)?", answer: [5], labels: ["time constant (s)"], explanation: "20 × 10³ × 250 × 10⁻⁶ = 5000 × 10⁻³ = 5 s." },
   { prompt: "How many time constants have passed at t = 10 s? Enter t ÷ τ.", answer: [2], labels: ["time constants passed"], explanation: "10 ÷ 5 = 2." },
   { prompt: "What is V = 12 × (1 − e^(−2)) in volts, to 2 decimal places?", answer: [10.38], labels: ["capacitor voltage (V)"], explanation: "e^(−2) ≈ 0.1353, so V ≈ 12 × 0.8647 ≈ 10.376 V, which rounds to 10.38 V." }
  ]
 },
 {
  id: "q29", title: "Rewiring the charging posts", topic: "Chapter review: a full circuit", tier: "Intermediate", sector: "Cable Works",
  brief: "Two batteries now feed a pair of heaters between the charging posts, and the crew must know the heat each heater will give before switching on.",
  lesson: "Reduce what you can with series and parallel rules, solve the rest with Kirchhoff’s rules, then use V = IR and P = V² ÷ R for any one resistor.",
  prompt: "A repair crew rewires two charging posts. Junction A at the top and junction B at the bottom are joined by three branches. Left branch: a battery of emf ε₁ = 18 V with its positive terminal towards A, in series with R₁ = 3 Ω. Middle branch: two heaters of 3 Ω and 6 Ω connected in parallel between A and B. Right branch: a battery of emf ε₂ = 9 V with its positive terminal towards A, in series with R₃ = 6 Ω. The batteries are ideal and the wires have no resistance. Enter the total current down the middle branch from A to B in amperes, then the power turned into heat in the 3 Ω heater in watts. Both are exact decimals.",
  answer: [3.75,18.75], labels: ["middle current (A)","heater power (W)"], tolerance: 0.005,
  hints: [
   "Replace the two heaters by one equivalent resistor R₂: for two resistors in parallel it is their product divided by their sum. Then the circuit has three branches between A and B, and Kirchhoff’s junction and loop rules give the currents.",
   "Both heaters have the same voltage across them, the middle current times R₂. The power in one heater is that voltage squared divided by its resistance, P = V² ÷ R."
  ],
  solution: "The heaters in parallel make R₂ = 3 × 6 ÷ 9 = 2 Ω. With I₁ up the left branch, I₂ down the middle and I₃ up the right branch, the junction rule gives I₂ = I₁ + I₃ and the two loops give 18 = 5 × I₁ + 2 × I₃ and 9 = 2 × I₁ + 8 × I₃. Solving: I₁ = 126 ÷ 36 = 3.5 A and I₃ = 9 ÷ 36 = 0.25 A, so I₂ = 3.5 + 0.25 = 3.75 A. The voltage across the middle branch is 3.75 × 2 = 7.5 V, so the 3 Ω heater turns 7.5² ÷ 3 = 18.75 W into heat.",
  xp: 150, prereqs: ["q26","q27"],
  artifact: {"name":"Charging post","description":"A post where rovers plug in, fed from two batteries through the junction tower."},
  sources: [source.s10_2, source.s10_3],
  teaching: {
   "intuition": "A real circuit mixes the two tools of this chapter. Wherever resistors are purely in series or purely in parallel, replace them by one equivalent resistor (q26): that shrinks the circuit without changing the currents in the rest of it. What is left, if it still has two batteries, is solved with Kirchhoff’s junction and loop rules (q27). Then work back out to the piece you care about. Resistors in parallel share the same voltage, which is the current through their equivalent times its resistance, V = IR. The current in each one is V ÷ R, and the power it turns into heat is P = V² ÷ R, or I²R with its own current.",
   "steps": [
    "Replace any purely parallel or purely series group by its equivalent resistance.",
    "Choose current arrows, write the junction rule and two loop equations, and solve for the branch currents.",
    "Find the voltage across the group you reduced: its current times its equivalent resistance.",
    "Work out the asked quantity for one resistor: its current V ÷ R or its power V² ÷ R."
   ],
   "example": {
    "prompt": "In a circuit, a current of 2 A flows into a pair of 4 Ω and 12 Ω resistors in parallel. What power does the 4 Ω resistor take?",
    "steps": [
     "The pair is 4 × 12 ÷ 16 = 3 Ω, so the voltage across it is 2 × 3 = 6 V.",
     "The 4 Ω resistor takes 6² ÷ 4 = 9 W."
    ],
    "answer": "9 W."
   },
   "pitfalls": [
    "Using the whole middle-branch current for one heater. The current splits between parallel resistors; the voltage is what they share.",
    "Solving with the two heaters as if they were in series.",
    "Using the battery’s emf as the voltage across the heaters. The batteries’ resistors take part of it."
   ]
  },
  guidance: [
   { prompt: "The two heaters of 3 Ω and 6 Ω are in parallel. What single resistance R₂ replaces them (Ω)?", answer: [2], labels: ["equivalent of the pair (Ω)"], explanation: "R₂ = 18 ÷ 9 = 2 Ω." },
   { prompt: "With R₂ = 2 Ω the loops give 18 = 5 × I₁ + 2 × I₃ and 9 = 2 × I₁ + 8 × I₃, where I₁ and I₃ flow up the side branches towards A. Solve them and use the junction rule. What is the current down the middle branch (A)?", answer: [3.75], labels: ["middle current (A)"], explanation: "I₁ = 126 ÷ 36 = 3.5 A and I₃ = 9 ÷ 36 = 0.25 A, so I₂ = I₁ + I₃ = 3.75 A." },
   { prompt: "A current of 3.75 A flows through the 2 Ω pair. What voltage is across the middle branch (V)?", answer: [7.5], labels: ["voltage across the pair (V)"], explanation: "V = IR = 3.75 × 2 = 7.5 V, the same across each heater." },
   { prompt: "The 3 Ω heater has 7.5 V across it. What power does it turn into heat (W)?", answer: [18.75], labels: ["heater power (W)"], explanation: "P = V² ÷ R = 56.25 ÷ 3 = 18.75 W." }
  ]
 },
 {
  id: "q30", title: "Steering the charged ore", topic: "Magnetic force on a moving charge, F = qvB sin θ", tier: "Advanced", sector: "Ore Sorter",
  brief: "Charged dust in the ore stream must be steered aside by magnets, so the crew needs the size and direction of the push on each ion.",
  lesson: "A charge moving through a magnetic field feels a force F = |q|vB sin θ at right angles to both its velocity and the field, given by the right-hand rule.",
  prompt: "In the ore sorter a dust ion of charge +2e (e = 1.60 × 10⁻¹⁹ C) moves at 400 km/s in the +x direction. The magnetic field there has strength 50 mT and points in the x–y plane at θ = 0.9 rad from the +x direction, turned towards +y. Take x to the right, y up the page and +z out of the page. Enter the size of the magnetic force on the ion in units of 10⁻¹⁵ N, rounded to 2 decimal places, then its direction: 1 if it points along +z, −1 if along −z.",
  answer: [5.01,1], labels: ["force (units of 10⁻¹⁵ N)","direction (1 for +z, −1 for −z)"], tolerance: 0.005,
  hints: [
   "The size of the force is F = |q|vB sin θ, with q in C, v in m/s and B in T: 1 km/s = 1000 m/s and 1 mT = 0.001 T.",
   "Right-hand rule: point the fingers of your right hand along v and curl them towards B; your thumb gives the force on a positive charge. A negative charge feels the force the opposite way."
  ],
  solution: "|q| = 2 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁹ C, v = 400 × 10³ m/s and B = 50 × 10⁻³ T, so |q|vB = 3.2 × 400 × 50 × 10⁻¹⁹ N = 6.4 × 10⁻¹⁵ N. Then F = |q|vB sin θ = 6.4 × sin 0.9 ≈ 6.4 × 0.7833 ≈ 5.0133 × 10⁻¹⁵ N, which rounds to 5.01. Fingers along +x curled towards the field (turned from +x towards +y) leave the thumb along +z, the force on a positive charge. The ion is positive, so the force points along +z: enter 1.",
  xp: 200, prereqs: ["q04"],
  artifact: {"name":"Deflector magnet","description":"The first magnet of the ore sorter, which bends charged dust out of the stream."},
  sources: [source.s11_2],
  teaching: {
   "intuition": "An electric field (q04) pushes on any charge, moving or not. A magnetic field is different: it pushes only on charges that move, and never along their motion. The magnetic field, written B, has a strength and a direction at every point, like the electric field. Its unit is the tesla (T): a field of 1 T pushes with 1 N on a charge of 1 C moving at 1 m/s at right angles to it, so 1 T = 1 N/(A·m), where an ampere (A) is one coulomb per second. Fields used in practice are often given in millitesla, mT. The size of the force on a charge q moving at speed v is F = |q|vB sin θ, where θ is the angle between the velocity and the field, in radians. A charge moving along the field feels nothing (sin 0 = 0); one moving at right angles to it feels the most. The force is at right angles to both the velocity and the field, and the right-hand rule gives which way: point the fingers of your right hand along the velocity, curl them towards the field through the smaller angle, and your thumb points along the force on a positive charge. On a negative charge the force is the opposite way. With x to the right and y up the page, a velocity along +x and a field turned from +x towards +y give a force along +z, out of the page.",
   "steps": [
    "Write the charge in coulombs, the speed in m/s and the field in teslas: 1 km/s = 10³ m/s, 1 mT = 10⁻³ T.",
    "Multiply |q|vB, then multiply by sin θ, with θ the angle between v and B in radians.",
    "Use the right-hand rule for the direction on a positive charge, and reverse it for a negative charge."
   ],
   "example": {
    "prompt": "A proton (+e) moves at 300 km/s along +x through a 40 mT field at 0.5 rad from +x towards +y. Find the force.",
    "steps": [
     "|q|vB = 1.60 × 10⁻¹⁹ × 300 × 10³ × 40 × 10⁻³ = 1.92 × 10⁻¹⁵ N.",
     "sin 0.5 ≈ 0.4794, so F ≈ 0.92 × 10⁻¹⁵ N.",
     "Fingers along +x curled towards +y: the thumb points along +z, and the proton is positive."
    ],
    "answer": "About 0.92 × 10⁻¹⁵ N, along +z."
   },
   "pitfalls": [
    "Using cos θ: the force is largest when the motion is at right angles to the field, so it goes with sin θ.",
    "Keeping the direction from the right-hand rule for a negative charge. Reverse it.",
    "Leaving the speed in km/s or the field in mT: convert to m/s and teslas first."
   ]
  },
  guidance: [
   { prompt: "The ion carries +2e. What is the size of its charge in units of 10⁻¹⁹ C?", answer: [3.2], labels: ["charge (units of 10⁻¹⁹ C)"], explanation: "2 × 1.60 = 3.2, so |q| = 3.2 × 10⁻¹⁹ C." },
   { prompt: "Multiply |q| = 3.2 × 10⁻¹⁹ C, v = 400 × 10³ m/s and B = 50 × 10⁻³ T. What is |q|vB in units of 10⁻¹⁵ N?", answer: [6.4], labels: ["|q|vB (units of 10⁻¹⁵ N)"], explanation: "3.2 × 400 × 50 = 64000, times 10⁻¹⁹ N, which is 6.4 × 10⁻¹⁵ N." },
   { prompt: "The angle between v and B is 0.9 rad. What is F = |q|vB sin θ in units of 10⁻¹⁵ N, to 2 decimal places?", answer: [5.01], labels: ["force (units of 10⁻¹⁵ N)"], explanation: "sin 0.9 ≈ 0.7833, so F ≈ 6.4 × 0.7833 ≈ 5.0133, which rounds to 5.01." },
   { prompt: "The right-hand rule gives +z for a positive charge here. Which way is the force on this ion? Enter 1 for +z, −1 for −z.", answer: [1], labels: ["direction (1 or −1)"], explanation: "The ion is positive, so the force is along +z: 1." }
  ]
 }
);
})();
