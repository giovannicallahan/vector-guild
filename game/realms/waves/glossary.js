/* Waves: sound and light glossary: the words this pack teaches, shown as tap-to-define buttons in its lessons, prompts, hints and
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
P['waves'] = {
 required: ['oscillation', 'frequency', 'amplitude', 'wavelength', 'interference', 'standing wave', 'harmonic', 'decibel', 'Doppler effect', 'refraction', 'total internal reflection', 'focal length', 'diffraction', 'grating'],
 terms: [
  /* q01–q10 (missions-a.js) */
  ['oscillation', 'q01', 'A motion that repeats itself, back and forth over the same path, again and again.', 'A swinging pendulum and a bouncing spring are oscillations.', ['oscillate', 'oscillates', 'oscillating']],
  ['equilibrium', 'q01', 'The resting place of an oscillating object, where no net force acts on it.', 'A mass hanging still on a spring is at equilibrium.'],
  ['period', 'q01', 'The time one full cycle of a repeating motion takes, written T and measured in seconds.', '12 swings in 30 s: a period of 2.5 s.'],
  ['frequency', 'q01', 'The number of full cycles in each second, f = 1/T, measured in hertz.', 'A period of 0.5 s is a frequency of 2 Hz.'],
  ['hertz', 'q01', 'The unit of frequency, written Hz: one full cycle per second.', '50 Hz is 50 cycles each second.'],
  ['amplitude', 'q01', 'How far an oscillation or a wave reaches from equilibrium at its furthest point.', 'A mass swinging 3 cm each side of the middle has amplitude 3 cm.'],
  ['simple harmonic motion', 'q02', 'Oscillation driven by a force towards equilibrium that grows in step with the distance from it; the position is a cosine of time.', 'A mass on a spring moves in simple harmonic motion.'],
  ['angular frequency', 'q02', 'The rate of an oscillation measured as an angle, ω = 2π/T = 2πf, in radians per second.', 'A period of 2π seconds is an angular frequency of 1 rad/s.'],
  ['phase', 'q03', 'The angle inside the cosine or sine of an oscillation or wave, which says how far through its cycle it is.', 'In 0.2 cos(5t + 0.4) the phase at t = 0 is 0.4 rad.'],
  ['phase shift', 'q03', 'The phase φ at time zero in A cos(ωt + φ), which fixes where in its cycle the motion starts.', 'With φ = 0 the mass starts at x = A.'],
  ['kinetic energy', 'q04', 'The energy of a moving mass, ½mv², in joules.', 'A 2 kg mass at 3 m/s has 9 J of kinetic energy.'],
  ['simple pendulum', 'q05', 'A small heavy bob on a light cord of length L; for small swings its period is 2π√(L/g).', 'A 2.45 m simple pendulum has a period of about 3.14 s.', ['pendulum']],
  ['damping', 'q06', 'A force such as friction that takes energy out of an oscillation, so its amplitude dies away.', 'An oil damper stops a seismometer ringing.', ['damped', 'damper']],
  ['damping constant', 'q06', 'The number b in a damping force −bv, in kg/s; a bigger b makes the swing die away faster.', 'With b = 0.2 kg/s and m = 1 kg the amplitude falls by e every 10 s.'],
  ['natural frequency', 'q06', 'The frequency at which a system oscillates by itself with no damping and no driving force, ω₀ = √(k/m) for a spring.', 'k = 100 N/m and m = 1 kg give ω₀ = 10 rad/s.'],
  ['resonance', 'q06', 'The large swing of a system driven at its natural frequency.', 'Pushing a swing in time with its motion makes it go higher: resonance.'],
  ['driving frequency', 'q06', 'The frequency of an outside force that pushes an oscillator back and forth.', 'Ground that shakes twice a second has a driving frequency of 2 Hz.'],
  ['wave', 'q07', 'A disturbance that travels from where it was made, carrying energy but not the material itself.', 'A flick at one end of a cable sends a wave along it.'],
  ['medium', 'q07', 'The material a wave travels through.', 'The cable is the medium for its waves; air is the medium for sound.'],
  ['transverse wave', 'q07', 'A wave in which the medium moves at right angles to the direction the wave travels.', 'Shaking a cable sideways sends a transverse wave along it.', ['transverse']],
  ['longitudinal wave', 'q07', 'A wave in which the medium moves back and forth along the direction the wave travels.', 'Sound in air is a longitudinal wave.', ['longitudinal']],
  ['wavelength', 'q07', 'The length of one full wave, from one crest to the next, written λ.', 'Crests 2.5 m apart: a wavelength of 2.5 m.'],
  ['wave speed', 'q07', 'How fast a wave moves through its medium, v = fλ.', 'A 4 Hz wave with λ = 2.5 m has wave speed 10 m/s.'],
  ['wave function', 'q08', 'A formula y(x, t) for the displacement of the medium at every place x and time t.', 'y(x, t) = A sin(kx − ωt) is a wave travelling in the +x direction.'],
  ['wave number', 'q08', 'The angle per unit length of a wave, k = 2π/λ, in radians per metre.', 'A wavelength of 2 m gives k = π rad/m.'],
  ['linear mass density', 'q09', 'The mass of each metre of a string or cable, μ = mass ÷ length, in kg/m.', 'A 0.6 kg cable 20 m long has μ = 0.03 kg/m.'],
  ['tension', 'q09', 'The pulling force along a stretched string or cable, in newtons.', 'A guy line pulled tight at 150 N has tension 150 N.'],
  ['intensity', 'q10', 'The power a wave carries through each square metre facing it, in W/m².', '100 W spread over 50 m² is an intensity of 2 W/m².'],
  ['inverse-square law', 'q10', 'The rule that a wave spreading evenly from a point has an intensity that falls as 1/r² with distance r.', 'Twice as far from a horn the intensity is a quarter.'],
  /* q11–q20 (missions-b.js) */
  ['superposition', 'q12', 'The rule that where waves overlap, the displacement of the medium is the sum of the displacements of each wave.', 'Displacements of 2 cm and −0.5 cm at one point give 1.5 cm.'],
  ['interference', 'q12', 'What happens when waves overlap and their displacements add, making a bigger or smaller wave.', 'Two speakers playing one note give loud and quiet spots by interference.'],
  ['constructive interference', 'q12', 'Interference of waves in step, crest on crest, so that they add to a bigger wave.', 'Two 3 cm waves in step add to a 6 cm wave.'],
  ['destructive interference', 'q12', 'Interference of waves half a cycle out of step, crest on trough, so that they cancel.', 'Two 3 cm waves π rad apart add to nothing.'],
  ['standing wave', 'q13', 'A wave pattern that stays in place, made by equal waves travelling both ways; it swells and shrinks but does not move along.', 'A plucked cable fixed at both ends holds a standing wave.'],
  ['node', 'q13', 'A point of a standing wave that never moves.', 'The fixed ends of a plucked cable are nodes.'],
  ['antinode', 'q13', 'A point of a standing wave, halfway between two nodes, where the medium moves the most.', 'A cable in its fundamental has one antinode, in the middle.'],
  ['harmonic', 'q13', 'One of the standing-wave patterns an instrument can hold; the nth harmonic has n times the frequency of the first.', 'A 100 Hz string has its 3rd harmonic at 300 Hz.', [], 'simple harmonic'],
  ['fundamental', 'q13', 'The lowest-frequency standing wave a string or pipe can hold, its first harmonic.', 'A 0.5 m cable with waves at 100 m/s has a 100 Hz fundamental.'],
  ['sound', 'q14', 'A longitudinal wave of squeezes and stretches travelling through air or another medium.', 'In air at 20 °C sound travels at about 343 m/s.'],
  ['speed of sound', 'q14', 'How fast sound travels in a medium; in air it is v = 331 √(1 + T_C ÷ 273) m/s at T_C degrees Celsius.', 'At 0 °C sound travels at 331 m/s in air.'],
  ['decibel', 'q15', 'The unit of sound intensity level, written dB; each factor of 10 in intensity adds 10 dB.', 'An intensity of 10⁻⁶ W/m² is a level of 60 dB.', ['dB']],
  ['sound intensity level', 'q15', 'How loud a sound is on a scale of powers of ten, β = 10 log₁₀(I ÷ I₀) dB, with I₀ = 10⁻¹² W/m².', 'An intensity of 10⁻⁵ W/m² is a level of 70 dB.'],
  ['open pipe', 'q16', 'A pipe open at both ends; its harmonics are fₙ = nv ÷ (2L) for every whole number n.', 'An open pipe 0.5 m long has a fundamental of 343 Hz.'],
  ['closed pipe', 'q16', 'A pipe closed at one end and open at the other; its harmonics are fₙ = nv ÷ (4L) for odd n only.', 'A closed pipe 0.5 m long has a fundamental of 171.5 Hz.'],
  ['beats', 'q18', 'The swelling and fading of loudness heard when two sounds of nearby frequencies play together.', 'Notes of 440 Hz and 443 Hz give 3 beats each second.'],
  ['beat frequency', 'q18', 'The number of beats each second, the difference of the two frequencies: f_beat = |f₁ − f₂|.', 'Forks of 256 Hz and 260 Hz have a beat frequency of 4 Hz.'],
  ['Doppler effect', 'q19', 'The change in the frequency heard when the source of a wave, the listener or both move.', 'A siren sounds higher coming towards you and lower going away.'],
  /* q21–q30 (missions-c.js) */
  ['Mach number', 'q21', 'The speed of a source divided by the speed of sound, M = v_s ÷ v; above 1 the source is supersonic.', 'A drone at 686 m/s with sound at 343 m/s flies at Mach 2.'],
  ['shock wave', 'q21', 'The cone of piled-up crests trailing a source that moves faster than the waves it sends out.', 'Its half-angle θ has sin θ = 1 ÷ M.'],
  ['sonic boom', 'q21', 'The sudden bang heard when the shock wave of a supersonic source sweeps over a listener.', 'A jet at Mach 2 drags a sonic boom along the ground.'],
  ['path difference', 'q22', 'How much farther a wave travels from one source than from the other to reach the same point.', '3 m from one speaker and 4.5 m from the other: Δr = 1.5 m.'],
  ['speed of light', 'q24', 'The speed c at which light travels in a vacuum, about 3.00 × 10⁸ m/s.', 'Light crosses 300 km in a thousandth of a second.'],
  ['index of refraction', 'q24', 'How many times slower light travels in a material than in a vacuum, n = c ÷ v.', 'Water has n = 1.333 and diamond 2.419.', ['indices of refraction', 'refractive index']],
  ['ray', 'q24', 'A straight line drawn along the path that a narrow beam of light follows.', 'A laser beam is drawn as a ray.', [], 'X-ray'],
  ['refraction', 'q25', 'The bending of a ray as it passes from one material into another where light has a different speed.', 'A straw in water looks bent because of refraction.', ['refracts', 'refracted', 'refract']],
  ['normal', 'q25', 'The line at right angles to a surface where a ray hits it; angles at a boundary are measured from it.', 'A ray at 0.3 rad from the normal is at π/2 − 0.3 from the surface.', [], '\\bnormal modes?\\b'],
  ['law of reflection', 'q25', 'A reflected ray makes the same angle with the normal as the incoming ray.', 'A ray in at 0.4 rad from the normal leaves at 0.4 rad.'],
  ['Snell’s law', 'q25', 'At a boundary, n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal.', 'Air into water at 0.8 rad: sin θ₂ = sin 0.8 ÷ 1.333.', ['Snell\'s law']],
  ['critical angle', 'q26', 'The angle inside the larger index beyond which no light can pass out, where sin θc = n₂ ÷ n₁.', 'Water to air: θc = arcsin(1 ÷ 1.333) ≈ 0.848 rad.'],
  ['total internal reflection', 'q26', 'All of the light reflecting back inside, when a ray meets a smaller index beyond the critical angle.', 'Optical fibres carry light round corners by total internal reflection.', ['totally internally reflected']],
  ['polarisation', 'q27', 'The one direction across the beam in which a polarised light wave wobbles.', 'Light leaving a polarising filter has its polarisation along the filter’s axis.', ['polarization', 'polarised', 'polarized']],
  ['unpolarised', 'q27', 'Light whose wobble points every way across the beam at once, like light from a lamp or the Sun.', 'A filter passes half of unpolarised light.', ['unpolarized']],
  ['polarising filter', 'q27', 'A sheet that passes only the part of a light wave that wobbles along its axis.', 'Two crossed polarising filters block all the light.', ['polarizing filter']],
  ['Malus’s law', 'q27', 'Polarised light through a filter at angle θ to its polarisation keeps the fraction cos² θ: I = I₀ cos² θ.', '100 W/m² at θ = π/3 leaves as 25 W/m².', ['Malus\'s law']],
  ['focal length', 'q28', 'The distance f from a lens or mirror to the point where it brings parallel rays together; negative if it spreads them.', 'A converging lens with f = 10 cm.'],
  ['image distance', 'q28', 'The distance dᵢ from a lens or mirror to the image; negative for a virtual image.', 'f = 10 cm and d₀ = 15 cm give dᵢ = 30 cm.'],
  ['magnification', 'q28', 'The image height divided by the object height, m = −dᵢ ÷ d₀; negative means upside down.', 'm = −2: twice as tall and upside down.'],
  ['real image', 'q28', 'An image where light really meets, so it can be caught on a card; its image distance is positive.', 'A projector throws a real image on a screen.'],
  ['virtual image', 'q28', 'An image that light only seems to come from, seen by looking into the lens or mirror; its image distance is negative.', 'Your face in a flat mirror is a virtual image.'],
  ['converging lens', 'q28', 'A lens, thicker in the middle, that brings parallel rays together; its focal length is positive.', 'A magnifying glass is a converging lens.'],
  ['diverging lens', 'q28', 'A lens, thinner in the middle, that spreads parallel rays apart; its focal length is negative.', 'A diverging lens with f = −15 cm.'],
  ['concave mirror', 'q28', 'A mirror curved inwards like a bowl, which brings parallel rays together; its focal length is positive.', 'A shaving mirror is concave.'],
  ['convex mirror', 'q28', 'A mirror that bulges outwards, which spreads parallel rays apart; its focal length is negative.', 'A wide-angle safety mirror is convex.'],
  ['double slit', 'q30', 'Two narrow slits close together, lit by one source so that their light interferes.', 'Slits 5 μm apart lit by 600 nm light.', ['double-slit']],
  ['fringe', 'q30', 'One of the bright or dark stripes in an interference pattern.', 'Bright fringes sit where d sin θ = mλ.'],
  ['order', 'q30', 'The whole number m that counts the bright fringes out from the centre, m = 0 being the centre itself.', 'The second bright fringe out has order m = 2.', [], '\\bin order\\b|\\border of\\b'],
  /* q31–q40 (missions-d.js) */
  ['small-angle approximation', 'q31', 'For an angle of a few hundredths of a radian or less, sin θ, tan θ and θ itself are almost the same number.', 'sin 0.02 ≈ tan 0.02 ≈ 0.02.'],
  ['thin film', 'q32', 'A layer of clear material about as thick as a wavelength of light, whose top and bottom surfaces both reflect.', 'A coating 100 nm thick on a lens.'],
  ['half-wavelength shift', 'q32', 'The flip a wave picks up when light reflects off a material of higher index; off a lower index there is none.', 'Air into glass: a shift. Glass into air: none.'],
  ['interferometer', 'q33', 'An instrument that splits light into two paths and brings them back together, so a tiny change in one path moves the fringes.', 'In a Michelson interferometer one fringe is a mirror move of λ ÷ 2.'],
  ['diffraction', 'q34', 'The spreading and bending of a wave as it passes through an opening or round an edge.', 'Light through a narrow slit spreads into bands.'],
  ['central peak', 'q34', 'The wide bright band in the middle of a single-slit pattern, between the first dark fringes on either side.', 'A 50 μm slit, 500 nm light, screen 1 m away: 20 mm wide.'],
  ['missing order', 'q36', 'A double-slit bright fringe that does not appear because it lands on a dark fringe of the single-slit pattern.', 'With d = 4a, orders ±4 are missing.'],
  ['grating', 'q37', 'A plate ruled with many equally spaced lines that act as slits, sending each wavelength off at its own angles.', '500 lines per millimetre: d = 2000 nm.'],
  ['resolution', 'q38', 'How finely an instrument can tell apart two points that are close together.', 'A wider telescope has finer resolution.'],
  ['Rayleigh criterion', 'q38', 'Two points are just told apart when the centre of one diffraction pattern falls on the first dark ring of the other.', 'θ = 1.22λ ÷ D for a round opening.'],
  ['Bragg’s law', 'q39', 'X-rays reflect strongly off crystal planes d apart when mλ = 2d sin θ, with θ measured from the planes.', 'λ = 0.1 nm, θ = 0.25 rad, m = 1: d ≈ 0.202 nm.'],
  ['crystal plane', 'q39', 'One of the flat, equally spaced layers of atoms that a crystal is stacked from.', 'X-rays reflect off planes 0.2 nm apart.'],
 ]
};
})();
