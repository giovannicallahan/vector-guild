/* Electricity and magnetism: fields glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
   solutions. game/glossary.js (loaded right after this file) merges them; docs/PACK-SPEC.md, "Glossary".
   required  the words the pack must define: qa/glossary.test.js fails while one is missing
   terms     one row per word: [term, taught, means, example, also?, avoid?]
               term     the word as shown at the top of the definition (keyed in lower case)
               taught   the learn mission that teaches it (q01–q40); once that mission is written, its text must use the word
               means    one plain sentence, 20 to 190 characters, ending with a full stop
               example  one tiny example, 8 to 150 characters
               also     other spellings of the same word (plurals are added automatically)
               avoid    a pattern: where the text around a match fits it, the word has another sense there and is left alone
   Minus signs are − (U+2212). Add the row for a word in the same change as the mission that teaches it, under the
   section of that mission's file. Once all 40 learn missions are written the pack needs at least 40 words. */
(function(){
'use strict';
const P = window.VG_GLOSSARY_PACKS = window.VG_GLOSSARY_PACKS || {};
P['em'] = {
 required: ['charge', 'electric field', 'flux', 'Gauss\'s law', 'potential', 'volt', 'capacitor', 'current', 'resistance', 'emf', 'magnetic field', 'induction', 'inductance', 'impedance'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['charge', 'q01', 'The property of matter that makes it push or pull on other charged matter; it is positive or negative and measured in coulombs.', 'A grain with 300 extra electrons has charge −4.8 × 10⁻¹⁷ C.', ['electric charge']],
  ['coulomb', 'q01', 'The unit of electric charge, written C.', '1 nC is 10⁻⁹ C and 1 μC is 10⁻⁶ C.', []],
  ['elementary charge', 'q01', 'The smallest free charge, e = 1.60 × 10⁻¹⁹ C: a proton carries +e and an electron −e.', 'A charge of −3.2 × 10⁻¹⁹ C is −2e, two extra electrons.', []],
  ['electron', 'q01', 'A tiny particle outside the nucleus of an atom that carries a charge of −e.', 'Rubbing moves electrons, never protons.', []],
  ['proton', 'q01', 'A particle in the nucleus of an atom that carries a charge of +e.', 'A neutral atom has as many electrons as protons.', []],
  ['Coulomb\'s law', 'q02', 'The rule that two point charges push or pull on each other with a force of size k|q₁q₂| ÷ r².', '1 μC and 1 μC, 1 m apart: F = 8.99 × 10⁹ × 10⁻¹² ≈ 0.009 N.', []],
  ['Coulomb constant', 'q02', 'The number k = 8.99 × 10⁹ N·m²/C² in Coulomb\'s law; it equals 1 ÷ (4πε₀).', 'k × (1 C)² ÷ (1 m)² is 8.99 × 10⁹ N.', []],
  ['point charge', 'q02', 'A charge so small compared with the distances involved that it can be treated as sitting at a single point.', 'A charged dust grain seen from 1 m away.', []],
  ['superposition', 'q03', 'The rule that the total force or field from several charges is the vector sum of what each would give alone.', '+2 N from one charge and −0.5 N from another give +1.5 N.', []],
  ['electric field', 'q04', 'The force per coulomb that a charge would feel at a point, measured in N/C; a charge Q there feels F = QE.', 'In a 500 N/C field a 2 μC charge feels 1000 μN.', []],
  ['field line', 'q04', 'A line drawn along the direction of the electric field; it starts on positive charge and ends on negative charge.', 'Field lines spread straight out from a positive point charge.', []],
  ['linear charge density', 'q05', 'The charge per metre along a line or rod, written λ, in C/m or nC/m.', 'A 0.4 m rod with λ = 15 nC/m holds 6 nC.', ['charge density']],
  ['surface charge density', 'q10', 'The charge per square metre on a surface, written σ, in C/m² or nC/m².', 'A 2 m² sheet with σ = 5 nC/m² holds 10 nC.', []],
  ['dipole', 'q06', 'A pair of equal and opposite charges a small distance apart.', '+5 nC and −5 nC on the ends of a 4 cm rod.', []],
  ['dipole moment', 'q06', 'The strength of a dipole, p = qd, pointing from the negative charge to the positive one.', '±5 nC, 0.04 m apart: p = 0.2 nC·m.', []],
  ['uniform field', 'q06', 'An electric field with the same size and direction at every point of a region.', 'Between two large charged plates the field is nearly uniform.', []],
  ['flux', 'q07', 'A measure of how much electric field passes through a surface: EA cos θ for a flat surface in a uniform field.', '400 N/C through 3 m² at π/3 to the normal: 600 N·m²/C.', ['electric flux']],
  ['normal', 'q07', 'The direction straight out of the face of a surface, at right angles to it.', 'A panel lying flat on the ground has its normal pointing up.', [], /normal (atom|amount)/],
  ['surface integral', 'q07', 'An integral that adds up a quantity over a surface, piece by piece, such as the flux ∫ E cos θ dA.', 'Flux of 50x N/C through a 2 m by 3 m panel: ∫ 150x dx = 300.', []],
  ['closed surface', 'q08', 'A surface with no gaps, such as a sphere or a sealed box, which has an inside and an outside.', 'A balloon is a closed surface; a sheet of paper is not.', []],
  ['Gauss\'s law', 'q08', 'The rule that the net electric flux out of any closed surface is the charge it encloses divided by ε₀.', '3 nC inside gives a flux of about 339 N·m²/C.', []],
  ['permittivity of free space', 'q08', 'The constant ε₀ = 8.85 × 10⁻¹² C²/(N·m²) in Gauss\'s law; k is 1 ÷ (4πε₀).', 'Flux = q ÷ ε₀, so 8.85 nC inside gives 1000 N·m²/C.', ['ε₀']],
  ['Gaussian surface', 'q09', 'A closed surface chosen to match the symmetry of a charge, so that Gauss\'s law gives the field easily.', 'A sphere around a charged shell, a cylinder around a long wire.', ['Gaussian sphere', 'Gaussian cylinder', 'Gaussian box']],
  ['spherical shell', 'q09', 'A thin hollow sphere, here one with charge spread evenly over it.', 'A charged shell adds no field inside itself.', []],
  /* q11–q20 (missions-b.js) */
  ['electric potential energy', 'q12', 'The energy stored by charges because of where they are; for two point charges it is kq₁q₂ ÷ r, counted from 0 far apart.', 'Two 1 μC charges 1 m apart store about 0.009 J.'],
  ['potential', 'q13', 'The electric potential at a place: the electric potential energy per coulomb a charge would have there, measured in volts.', 'A 2 C charge with 10 J of potential energy is at a potential of 5 V.', ['electric potential']],
  ['potential difference', 'q13', 'The change in potential between two places: the change in potential energy per coulomb for a charge moved between them.', 'A 3 C charge moved through 4 V changes its energy by 12 J.', ['voltage']],
  ['volt', 'q13', 'The unit of potential and potential difference, written V: one joule per coulomb.', '12 V means 12 J for every coulomb that passes.', ['kilovolt']],
  ['electron-volt', 'q13', 'A unit of energy, written eV: what one elementary charge gains through one volt, 1.60 × 10⁻¹⁹ J.', 'A proton through 500 V gains 500 eV.', ['electron volt']],
  ['gradient', 'q15', 'The rates of change of a quantity with position in each direction; the electric field is minus the gradient of the potential.', 'If V rises 3 V per metre along x, the field there is −3 V/m.'],
  ['equipotential', 'q16', 'A line or surface on which the potential is the same everywhere, so moving a charge along it takes no work.', 'Between flat plates, every plane parallel to them is an equipotential.'],
  ['capacitor', 'q18', 'A device that stores charge and energy, in its simplest form two metal plates close together but not touching.', 'A camera flash charges a capacitor, then empties it at once.'],
  ['capacitance', 'q18', 'How much charge a capacitor holds per volt across it, C = Q ÷ V, measured in farads.', '10 μC held at 5 V means a capacitance of 2 μF.'],
  ['farad', 'q18', 'The unit of capacitance, written F: one coulomb per volt.', '1 μF is 10⁻⁶ F and 1 pF is 10⁻¹² F.', ['microfarad', 'picofarad']],
  ['parallel-plate capacitor', 'q18', 'A capacitor made of two flat plates of area A a distance d apart, with capacitance ε₀A ÷ d in air.', 'Halving the gap doubles the capacitance.'],
  ['series', 'q19', 'Joined one after another in a chain, so the same charge or current passes through each part in turn.', '2 μF and 6 μF in series give 1.5 μF.', [], 'series of'],
  ['parallel', 'q19', 'Joined side by side across the same two points, so every part has the same voltage across it.', '2 μF and 6 μF in parallel give 8 μF.', [], 'parallel[- ]plates?|parallel to'],
  ['equivalent capacitance', 'q19', 'The capacitance of the single capacitor that would take the same charge as a whole network at the same voltage.', 'Two 4 μF capacitors in series have an equivalent capacitance of 2 μF.'],
  ['discharge', 'q20', 'To let a capacitor’s stored charge flow back out, releasing its stored energy.', 'A charged capacitor across a lamp discharges and lights it briefly.'],
  /* q21–q30 (missions-c.js) */
  ['dielectric', 'q21', 'An insulating material placed between the plates of a capacitor; it weakens the field inside and so raises the capacitance.', 'Glass or plastic slid between the plates.'],
  ['dielectric constant', 'q21', 'The number κ by which a dielectric that fills a capacitor multiplies its capacitance; 1 for vacuum, more for any material.', 'κ = 4 turns 8 μF into 32 μF.'],
  ['current', 'q22', 'The rate at which charge passes a point in a circuit, I = dQ/dt, measured in amperes.', '3 A carries 3 C past a point each second.', ['electric current'], 'current (?:state|value|setting)'],
  ['ampere', 'q22', 'The unit of current, A: one coulomb of charge passing each second.', '2 A for 5 s carries 10 C.', ['amp']],
  ['resistance', 'q24', 'How strongly an object opposes a current through it, R = V ÷ I, measured in ohms.', 'A 4 Ω heater on 12 V draws 3 A.'],
  ['resistivity', 'q24', 'How strongly a material opposes current, ρ in Ω·m; a wire of length L and area A has resistance ρL ÷ A.', 'Copper: ρ = 1.68 × 10⁻⁸ Ω·m.'],
  ['ohm', 'q24', 'The unit of resistance, written Ω: one volt per ampere.', '10 V across 5 Ω drives 2 A.'],
  ['Ohm\'s law', 'q25', 'The rule V = IR: in an ohmic component the current is the voltage divided by the resistance.', '120 V across 48 Ω gives 2.5 A.'],
  ['watt', 'q25', 'The unit of power, W: one joule per second.', '2 A at 12 V is 24 W.'],
  ['emf', 'q26', 'The voltage a battery or supply provides, ε: the energy it gives each coulomb that passes through it.', 'A 12 V battery gives each coulomb 12 J.', ['electromotive force']],
  ['equivalent resistance', 'q26', 'The resistance of the single resistor that would draw the same current from the source as a whole network.', '6 Ω and 12 Ω in parallel: 4 Ω.'],
  ['junction', 'q27', 'A point in a circuit where three or more wires meet.', 'At a junction 2 A in can split into 1.5 A and 0.5 A.'],
  ['loop', 'q27', 'Any closed path round a circuit that comes back to where it started.', 'Round a loop the voltage changes add to 0.'],
  ['Kirchhoff\'s rules', 'q27', 'The junction rule (current in equals current out) and the loop rule (voltage changes round a loop add to zero).', 'I₂ = I₁ + I₃ at a junction.', ['junction rule', 'loop rule']],
  ['time constant', 'q28', 'The time τ = RC that sets how fast a capacitor charges through a resistor; after one τ it is at 63.2% of the emf.', '20 kΩ with 250 μF: τ = 5 s.'],
  ['magnetic field', 'q30', 'A field, B, that pushes on moving charges with a force at right angles to their motion, measured in teslas.', 'Near a fridge magnet B is a few mT.'],
  ['tesla', 'q30', 'The unit of magnetic field, T: 1 T = 1 N/(A·m).', '50 mT is 0.05 T.'],
  ['right-hand rule', 'q30', 'Fingers along the velocity, curled towards the field: the thumb gives the magnetic force on a positive charge.', 'v along +x, B along +y: force along +z.'],
  /* q31–q40 (missions-d.js) */
  ['cyclotron period', 'q31', 'The time a charged particle takes to go once round its circle in a uniform magnetic field, T = 2πm/(qB), whatever its speed.', 'A proton in a 0.2 T field takes about 328 ns per circle.', []],
  ['permeability of free space', 'q33', 'The constant μ₀ = 4π × 10⁻⁷ T·m/A that sets how strong a magnetic field a current makes.', 'B = μ₀I/(2πr) uses the permeability of free space.', ['μ₀']],
  ['line integral', 'q34', 'The sum of B·dl, the part of the field along each tiny step, taken all the way round a path, written ∮B·dl for a closed path.', 'Round a circle where B is constant and along the path, ∮B·dl = B × 2πr.', []],
  ['Ampère\'s law', 'q34', 'The rule that the line integral of B round any closed path equals μ₀ times the current passing through the path.', 'Round a long wire, B × 2πr = μ₀I.', ['Ampère’s law']],
  ['solenoid', 'q34', 'A long, tightly wound coil of wire; inside it the field is uniform, B = μ₀nI, with n turns per metre.', '1000 turns per metre carrying 1 A give about 1.26 mT inside.', []],
  ['magnetic flux', 'q35', 'How much magnetic field passes through a surface; for a uniform field at right angles to a flat area, Φ = BA.', '0.04 T through 0.5 m² is a flux of 0.02 Wb.', []],
  ['weber', 'q35', 'The unit of magnetic flux, Wb: 1 Wb = 1 T·m².', '50 mT through 0.1 m² is 5 mWb.', []],
  ['Faraday\'s law', 'q35', 'The rule that a changing magnetic flux through a loop induces an emf equal to its rate of change, ε = −N dΦ/dt for N turns.', 'Flux falling by 2 mWb in 0.5 s through 50 turns gives 200 mV.', ['Faraday’s law']],
  ['Lenz\'s law', 'q35', 'The rule that an induced current flows so that its own field opposes the change in flux that caused it.', 'Growing upward flux drives a current whose field points down.', ['Lenz’s law']],
  ['induction', 'q35', 'Making an emf, and so a current, in a circuit by changing the magnetic flux through it.', 'Moving a magnet into a coil drives a current by induction.', ['electromagnetic induction']],
  ['motional emf', 'q36', 'The emf Blv across a conductor of length l moving at speed v through a magnetic field B, when the conductor, its motion and the field are at right angles to each other.', 'A 1 m rod at 5 m/s in 0.4 T has a motional emf of 2 V.', []],
  ['generator', 'q36', 'A machine that spins a coil in a magnetic field to turn motion into an emf, NBAω sin ωt.', 'A wind turbine drives the outpost\'s generator.', []],
  ['inductance', 'q37', 'How strongly a coil opposes a change in its own current: the self-induced emf is −L dI/dt.', 'A 0.2 H coil whose current rises at 10 A/s has an emf of 2 V.', []],
  ['henry', 'q37', 'The unit of inductance, H: 1 H gives 1 V when the current changes by 1 A each second.', 'A 200 mH coil has an inductance of 0.2 henries.', ['henries']],
  ['inductor', 'q37', 'A coil used in a circuit for its inductance; it stores energy ½LI² in its magnetic field.', 'A 100 mH inductor carrying 2 A stores 0.2 J.', []],
  ['alternating current', 'q38', 'Current that reverses direction over and over, driven by a voltage that swings like V₀ sin ωt.', 'The outpost\'s 60 Hz supply is alternating current.', []],
  ['rms', 'q38', 'Root mean square: for a sine wave, the peak divided by √2, the steady value with the same heating effect.', 'A 170 V peak has an rms voltage of about 120.21 V.', []],
  ['reactance', 'q38', 'How much an inductor (ωL) or a capacitor (1/(ωC)) limits an alternating current, in ohms.', 'A 0.1 H inductor at 50 Hz has a reactance of about 31.42 Ω.', []],
  ['impedance', 'q39', 'The total opposition of an ac circuit to the current, in ohms; for a series RLC circuit Z = √(R² + (X_L − X_C)²).', 'R = 30 Ω with X_L − X_C = 40 Ω gives Z = 50 Ω.', []],
  ['resonance', 'q39', 'The state of an RLC circuit driven at the frequency where X_L = X_C, so the impedance is just R and the current is largest.', 'At resonance the inductor and capacitor cancel.', []],
  ['resonant frequency', 'q39', 'The frequency f₀ = 1/(2π√(LC)) at which a circuit with inductance and capacitance resonates.', '50 mH with 50 μF has a resonant frequency of about 100.66 Hz.', []],
  ['electromagnetic wave', 'q40', 'Linked electric and magnetic fields that travel through space at the speed of light, with E = cB.', 'Radio waves and visible light are electromagnetic waves.', []],
  ['speed of light', 'q40', 'The speed c ≈ 3.00 × 10⁸ m/s at which every electromagnetic wave travels in empty space.', 'A 100 MHz wave at the speed of light has λ = 3 m.', []],
  ['electromagnetic spectrum', 'q40', 'The range of electromagnetic waves sorted by wavelength, from radio waves through visible light to gamma rays.', 'Visible light, about 400 nm to 750 nm, is a small band of it.', ['spectrum']],
 ]
};
})();
