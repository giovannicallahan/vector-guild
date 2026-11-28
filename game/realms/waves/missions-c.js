/* Waves: sound and light missions, file c: q21–q30. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-c.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-c.js; drill statements: variants-c.js; oracles:
   qa/realms/waves/oracle-c.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q21  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Shock waves and the Mach angle [V1 17.8]
     q22  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Two speakers: path difference, loud and quiet spots [V1 16.5, 17.4]
     q23  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Chapter review: a siren on the track [V1 17.6, 17.7]
     q24  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · The speed of light and the index of refraction, n = c/v [V3 1.1]
     q25  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · Reflection and Snell's law, n₁ sin θ₁ = n₂ sin θ₂ [V3 1.2, 1.3]
     q26  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · Critical angle and total internal reflection [V3 1.4]
     q27  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · Polarisation and Malus's law, I = I₀ cos² θ [V3 1.7]
     q28  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · Mirrors and thin lenses: 1/d₀ + 1/dᵢ = 1/f and magnification [V3 2.2, 2.4]
     q29  ch 5 Rays of light · Intermediate, 150 XP · sector 'Lens Workshop' · Chapter review: a telescope lens bench [V3 1.3, 2.4]
     q30  ch 6 Interference of light · Advanced, 200 XP · sector 'Fringe Lab' · Young's double slit: bright and dark angles, d sin θ = mλ [V3 3.1, 3.2] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 (chapters 15–17) and Volume 3 (chapters 1–4) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 16.1 Traveling Waves
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 v1_16_5: { title: 'OpenStax University Physics Volume 1 — 16.5 Interference of Waves', url: 'https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves', description: 'Superposition of waves, constructive and destructive interference, and the resultant amplitude 2A cos(φ/2) of two waves out of phase.', verified: '2026-11-28' },
 v1_17_4: { title: 'OpenStax University Physics Volume 1 — 17.4 Normal Modes of a Standing Sound Wave', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave', description: 'Two speakers driven by one signal: constructive interference when the path difference is a whole number of wavelengths, destructive at odd half wavelengths.', verified: '2026-11-28' },
 v1_17_6: { title: 'OpenStax University Physics Volume 1 — 17.6 Beats', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-6-beats', description: 'Beats from two sounds of nearly equal frequency, and the beat frequency |f₂ − f₁|.', verified: '2026-11-28' },
 v1_17_7: { title: 'OpenStax University Physics Volume 1 — 17.7 The Doppler Effect', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect', description: 'The heard frequency for a moving source, a moving observer, and both moving, with the sign of each speed.', verified: '2026-11-28' },
 v1_17_8: { title: 'OpenStax University Physics Volume 1 — 17.8 Shock Waves', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-8-shock-waves', description: 'The Mach number M = v_s ÷ v, the shock wave cone with sin θ = v ÷ v_s, and the sonic boom.', verified: '2026-11-28' },
 v3_1_1: { title: 'OpenStax University Physics Volume 3 — 1.1 The Propagation of Light', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-1-the-propagation-of-light', description: 'The speed of light c ≈ 3.00 × 10⁸ m/s, the index of refraction n = c ÷ v, and a table of indices for gases, liquids and solids.', verified: '2026-11-28' },
 v3_1_2: { title: 'OpenStax University Physics Volume 3 — 1.2 The Law of Reflection', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-2-the-law-of-reflection', description: 'The angle of reflection equals the angle of incidence, both measured from the normal to the surface.', verified: '2026-11-28' },
 v3_1_3: { title: 'OpenStax University Physics Volume 3 — 1.3 Refraction', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction', description: 'Snell’s law n₁ sin θ₁ = n₂ sin θ₂ with angles from the normal; a ray entering a larger index bends towards the normal.', verified: '2026-11-28' },
 v3_1_4: { title: 'OpenStax University Physics Volume 3 — 1.4 Total Internal Reflection', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection', description: 'The critical angle θc = sin⁻¹(n₂ ÷ n₁) for n₁ > n₂, total internal reflection beyond it, and fibre optics.', verified: '2026-11-28' },
 v3_1_7: { title: 'OpenStax University Physics Volume 3 — 1.7 Polarization', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-7-polarization', description: 'Polarising filters, half the intensity passed from unpolarised light, two filters in a row, and Malus’s law I = I₀ cos² θ.', verified: '2026-11-28' },
 v3_2_2: { title: 'OpenStax University Physics Volume 3 — 2.2 Spherical Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-2-spherical-mirrors', description: 'The mirror equation 1/d₀ + 1/dᵢ = 1/f, f = R ÷ 2, magnification m = −dᵢ ÷ d₀, and the signs for concave and convex mirrors and virtual images.', verified: '2026-11-28' },
 v3_2_4: { title: 'OpenStax University Physics Volume 3 — 2.4 Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses', description: 'The thin-lens equation, magnification m = hᵢ ÷ h₀ = −dᵢ ÷ d₀, and the signs of f for converging and diverging lenses and of dᵢ for real and virtual images.', verified: '2026-11-28' },
 v3_3_1: { title: 'OpenStax University Physics Volume 3 — 3.1 Young’s Double-Slit Interference', url: 'https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference', description: 'Young’s double slit: bright fringes where the path difference is mλ and dark fringes where it is (m + ½)λ.', verified: '2026-11-28' },
 v3_3_2: { title: 'OpenStax University Physics Volume 3 — 3.2 Mathematics of Interference', url: 'https://openstax.org/books/university-physics-volume-3/pages/3-2-mathematics-of-interference', description: 'The path difference d sin θ, bright fringes at d sin θ = mλ, dark at (m + ½)λ, and the largest order from sin θ ≤ 1.', verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q21', title: 'The drone that outruns its sound', topic: 'Shock waves and the Mach angle', tier: 'Intermediate', sector: 'Rover Track',
  brief: 'A test drone is going to cross the Rover Track faster than sound, and the crew want to know how wide its boom will spread.',
  lesson: 'A source faster than sound drags a cone-shaped shock wave behind it; its Mach number is M = v_s ÷ v and the cone’s half-angle θ has sin θ = v ÷ v_s.',
  prompt: 'A test drone flies level over the Rover Track at 540 m/s, faster than sound, which travels at 343 m/s here. Enter its Mach number (a pure number, no unit) to 2 decimal places, then the half-angle of its shock cone in radians to 3 decimal places. Use the unrounded Mach number for the angle.',
  answer: [1.57,0.688], labels: ['Mach number (no unit)', 'cone half-angle (rad)'], tolerance: 0.0005,
  hints: [
   'The Mach number is the speed of the source divided by the speed of sound: M = v_s ÷ v.',
   'The half-angle θ of the cone obeys sin θ = v ÷ v_s, which is 1 ÷ M. Take arcsin with the calculator set to radians.'
  ],
  solution: 'The Mach number is M = 540 ÷ 343 ≈ 1.5743, which is 1.57 to 2 decimal places. The cone’s half-angle θ has sin θ = 343 ÷ 540 ≈ 0.6352, so θ = arcsin of the unrounded sine ≈ 0.6882 radians, which is 0.688 radians to 3 decimal places. The drone outruns its own sound, so the crests pile up along a cone that trails behind it: that cone is the shock wave, heard on the ground as a sonic boom.',
  xp: 150, prereqs: ['q19'],
  sources: [source.v1_17_8],
  teaching: {
   intuition: 'A moving siren squashes its sound waves together in front of it: that is the Doppler effect. Now let the source go faster than sound itself. Each crest it sends out spreads as a circle, but the source has already moved past the edge of every earlier circle. The circles crowd onto two lines that meet at the source, a cone in three dimensions, and along that cone the crests add up into one sharp jump in pressure: a shock wave. When the cone sweeps over you, you hear it as a sonic boom. How fast a source goes, compared with sound, is its Mach number M = v_s ÷ v, the source speed divided by the speed of sound: Mach 1 is the speed of sound, Mach 2 twice that. In the time t a crest spreads a distance vt while the source moves v_st, and the cone touches every circle, so the half-angle θ of the cone, measured from the line the source flies along, obeys sin θ = vt ÷ v_st = v ÷ v_s = 1 ÷ M. To get θ back from its sine use arcsin, also written sin⁻¹, with the calculator set to radians: arcsin(0.5) is the angle whose sine is 0.5, about 0.524 rad. A faster source has a larger M, a smaller sine and a narrower cone.',
   steps: [
    'Divide the source speed by the speed of sound to get the Mach number M = v_s ÷ v. A shock wave forms only when M is more than 1.',
    'Work out sin θ = v ÷ v_s, which is 1 ÷ M.',
    'Set the calculator to radians and take arcsin of that number to get the cone’s half-angle θ, measured from the line of flight.',
    'Round only at the end: use the unrounded sine for the arcsin.'
   ],
   example: {
    prompt: 'A jet crosses the track at 686 m/s, with sound at 343 m/s. What is its Mach number and the half-angle of its shock cone?',
    steps: ['M = 686 ÷ 343 = 2: the jet flies at twice the speed of sound.', 'sin θ = 343 ÷ 686 = 0.5.', 'θ = arcsin(0.5) ≈ 0.5236 rad.'],
    answer: 'Mach 2, and a half-angle of about 0.524 radians.'
   },
   pitfalls: [
    'Dividing the wrong way round: the Mach number is the source speed over the speed of sound, so a supersonic source has M above 1, while sin θ is the other way up, sound over source.',
    'Leaving the calculator in degrees: arcsin(0.5) is 30 in degrees but about 0.524 in radians, and this pack always works in radians.',
    'Thinking the boom happens only at the moment the source passes Mach 1: the cone trails the source the whole time it is supersonic.'
   ]
  },
  guidance: [
   { prompt: 'The drone flies at 540 m/s and sound travels at 343 m/s. What is the Mach number, to 2 decimal places?', answer: [1.57], labels: ['Mach number'], explanation: 'M = 540 ÷ 343 ≈ 1.5743, which is 1.57 to 2 decimal places. It is more than 1, so the drone is supersonic and makes a shock wave.' },
   { prompt: 'For the cone, sin θ = 343 ÷ 540. What is sin θ, to 3 decimal places?', answer: [0.635], labels: ['sin θ'], explanation: '343 ÷ 540 ≈ 0.6352, which is 0.635 to 3 decimal places. It is the same as 1 ÷ M.' },
   { prompt: 'Take arcsin of the unrounded sin θ, with the calculator set to radians. What is the half-angle θ in radians, to 3 decimal places?', answer: [0.688], labels: ['half-angle θ (rad)'], explanation: 'θ = arcsin of the unrounded sine ≈ 0.6882 radians, which is 0.688 radians to 3 decimal places. A faster drone gives a smaller sine and so a narrower cone.' }
  ]
 },
 {
  id: 'q22', title: 'Loud and quiet spots by the track', topic: 'Two speakers: path difference, loud and quiet spots', tier: 'Intermediate', sector: 'Rover Track',
  brief: 'The track marshals stand between two warning speakers, and some of them say the warning tone almost vanishes where they stand.',
  lesson: 'Two speakers in phase reinforce where the path difference is a whole number of wavelengths and largely cancel where it is a whole number and a half.',
  prompt: 'Two speakers at the edge of the Rover Track are wired to the same signal generator, so they send out the same 686 Hz tone in phase. Sound travels at 343 m/s. A marshal stands 2.4 m from speaker A and 3.9 m from speaker B. Enter the path difference in metres, then the path difference in wavelengths, then 1 if the marshal’s spot is loud (constructive interference) or 0 if it is quiet (destructive interference).',
  answer: [1.5,3,1], labels: ['path difference (m)', 'path difference (wavelengths)', 'loud (1) or quiet (0)'], tolerance: 0.0005,
  hints: [
   'The path difference is the longer distance minus the shorter one. One wavelength is the speed of sound divided by the frequency.',
   'A path difference of a whole number of wavelengths means crest meets crest and the sound is loud; a whole number and a half means crest meets trough and the sound largely cancels.'
  ],
  solution: 'The path difference is 3.9 − 2.4 = 1.5 m. One wavelength is 343 ÷ 686 = 0.5 m, so the path difference is 1.5 ÷ 0.5 = 3 wavelengths. That is a whole number of wavelengths, so crests from the two speakers arrive together: constructive interference, a loud spot (1).',
  xp: 150, prereqs: ['q12', 'q14'],
  sources: [source.v1_17_4, source.v1_16_5],
  teaching: {
   intuition: 'Two speakers fed by the same signal send out identical sound waves in step, crest for crest: we say they are in phase. At any spot, the two waves add up, which is superposition. What decides the result is how much farther one wave has travelled than the other. That extra distance is the path difference, Δr = r₂ − r₁, the distance from the farther speaker minus the distance from the nearer one. If Δr is a whole number of wavelengths (0, λ, 2λ …), a crest from one speaker arrives together with a crest from the other, and they add: constructive interference, a loud spot. If Δr is a whole number and a half (λ/2, 3λ/2, 5λ/2 …), a crest arrives with a trough and they cancel: destructive interference, a quiet spot. The cancelling is complete only if the two waves arrive equally strong; the farther speaker usually sounds a little weaker, so such a spot is quiet but not silent. So the question is only how many wavelengths fit into the path difference, and for sound the wavelength comes from v = fλ, so λ = v ÷ f. Walk along the track and the sound swells and fades as Δr passes through whole and half wavelengths. Real spots between these two cases are partly loud; here we look only at the two clear cases, and we ignore echoes.',
   steps: [
    'Subtract the two distances to get the path difference Δr, in metres.',
    'Work out the wavelength λ = v ÷ f from the speed of sound and the frequency.',
    'Divide Δr by λ to get the path difference in wavelengths.',
    'A whole number of wavelengths means constructive interference (loud); a whole number and a half means destructive interference (quiet).'
   ],
   example: {
    prompt: 'Two speakers play a 343 Hz tone in phase, with sound at 343 m/s. A listener is 3 m from one and 4.5 m from the other. Is the spot loud or quiet?',
    steps: ['Δr = 4.5 − 3 = 1.5 m.', 'λ = 343 ÷ 343 = 1 m.', 'Δr ÷ λ = 1.5 wavelengths: a whole number and a half.'],
    answer: 'Quiet: destructive interference (enter 0).'
   },
   pitfalls: [
    'Using one distance instead of the difference: what matters is how much farther one wave travels, not how far either travels.',
    'Comparing the path difference in metres with whole numbers: 2 m is a whole number of metres but may be a half number of wavelengths. Divide by λ first.',
    'Forgetting that the speakers must be in phase: these rules are for speakers driven by the same signal in step.'
   ]
  },
  guidance: [
   { prompt: 'The marshal is 2.4 m from A and 3.9 m from B. What is the path difference, in metres?', answer: [1.5], labels: ['path difference (m)'], explanation: '3.9 − 2.4 = 1.5 m: the sound from B travels that much farther.' },
   { prompt: 'What is the wavelength of a 686 Hz tone when sound travels at 343 m/s, in metres?', answer: [0.5], labels: ['wavelength (m)'], explanation: 'λ = v ÷ f = 343 ÷ 686 = 0.5 m.' },
   { prompt: 'How many wavelengths is a path difference of 1.5 m?', answer: [3], labels: ['path difference (wavelengths)'], explanation: '1.5 ÷ 0.5 = 3 wavelengths.' },
   { prompt: 'The path difference is 3 wavelengths. Enter 1 if the spot is loud, or 0 if it is quiet.', answer: [1], labels: ['loud (1) or quiet (0)'], explanation: '3 is a whole number, so the two waves arrive in step and add: loud, 1.' }
  ]
 },
 {
  id: 'q23', title: 'Clocking the rover by its siren', topic: 'Chapter review: a siren on the track', tier: 'Intermediate', sector: 'Rover Track',
  brief: 'The speed sensor on a rover has failed, and the only record of its run is what the siren sounded like to a listener at the tower.',
  lesson: 'Two Doppler readings, one approaching and one leaving, give the source’s speed and its true frequency; a fixed tone at the true frequency then beats against the heard one.',
  prompt: 'A rover drives past the siren tower at a steady speed, sounding its siren. The tower stands right at the edge of the track, so close to it that the rover’s motion counts as straight towards the tower and then straight away from it. A listener standing still at the tower hears 560 Hz while the rover comes towards her and 480 Hz after it has passed. Sound travels at 343 m/s and there is no wind. Enter the rover’s speed in m/s, then the siren’s own frequency in Hz, then the beat frequency in Hz that she would hear between the approaching siren and a horn at the tower that plays the siren’s own frequency. Give all three to 1 decimal place, using unrounded values from one step to the next.',
  answer: [26.4,516.9,43.1], labels: ['rover speed (m/s)', 'siren’s own frequency (Hz)', 'beat frequency (Hz)'], tolerance: 0.05,
  hints: [
   'For a source moving towards a listener at rest, f_heard = f_s × v ÷ (v − v_s); moving away, f_heard = f_s × v ÷ (v + v_s). Divide one equation by the other so that f_s cancels, then solve for v_s.',
   'The beat frequency is the difference between two frequencies sounding together: f_beat = |f₂ − f₁|.'
  ],
  solution: 'Dividing the approaching equation by the leaving one cancels f_s: 560 ÷ 480 = (343 + v_s) ÷ (343 − v_s). Cross-multiplying, 560 × (343 − v_s) = 480 × (343 + v_s), so v_s = 343 × (560 − 480) ÷ (560 + 480) = 343 × 80 ÷ 1040 ≈ 26.3846 m/s, which is 26.4 m/s to 1 decimal place. Then f_s = 560 × (343 − v_s) ÷ 343 ≈ 516.9231 Hz, which is 516.9 Hz to 1 decimal place. The horn and the approaching siren beat at 560 − 516.9231 ≈ 43.0769 Hz, which is 43.1 Hz to 1 decimal place.',
  xp: 150, prereqs: ['q18', 'q20'],
  sources: [source.v1_17_7, source.v1_17_6],
  teaching: {
   intuition: 'This mission puts the chapter together. A listener at rest hears a moving siren higher while it comes towards her and lower as it goes away. For a source moving at speed v_s and sound at speed v, the Doppler effect gives f_towards = f_s × v ÷ (v − v_s) and f_away = f_s × v ÷ (v + v_s), where f_s is the siren’s own frequency. With both heard frequencies measured, we have two equations and two unknowns, v_s and f_s. Dividing one equation by the other makes f_s cancel: f_towards ÷ f_away = (v + v_s) ÷ (v − v_s). Cross-multiplying and gathering the v_s terms gives v_s = v × (f_towards − f_away) ÷ (f_towards + f_away). Put that speed back into either equation to find f_s. Finally, two tones of nearly the same frequency sounding together rise and fall in loudness: these are beats, and the beat frequency is the difference f_beat = |f₂ − f₁|. A horn at the tower playing f_s beats against the approaching siren at f_towards − f_s beats per second.',
   steps: [
    'Write the two Doppler equations, approaching with v − v_s underneath and leaving with v + v_s underneath.',
    'Divide them so f_s cancels, and solve for the speed: v_s = v × (f_towards − f_away) ÷ (f_towards + f_away).',
    'Put the unrounded v_s back in: f_s = f_towards × (v − v_s) ÷ v.',
    'Subtract to get the beat frequency between the heard tone and the true tone, and round each answer only at the end.'
   ],
   example: {
    prompt: 'A listener at rest hears a siren at 440 Hz as it approaches and 360 Hz as it leaves, with sound at 343 m/s. How fast is it moving, and what is its own frequency?',
    steps: ['v_s = 343 × (440 − 360) ÷ (440 + 360) = 343 × 80 ÷ 800 = 34.3 m/s.', 'f_s = 440 × (343 − 34.3) ÷ 343 = 440 × 0.9 = 396 Hz.', 'Against a 396 Hz horn, the approaching siren beats at 440 − 396 = 44 Hz.'],
    answer: '34.3 m/s, a 396 Hz siren, and 44 beats per second.'
   },
   pitfalls: [
    'Taking the siren’s own frequency as the average of the two heard ones: the shifts up and down are not equal, so the true frequency is a little below the average.',
    'Swapping the signs: approaching, the source catches up with its own waves, so v − v_s is underneath and the heard frequency is higher.',
    'Rounding v_s before using it for f_s, which can move the last digit of the frequency.'
   ]
  },
  guidance: [
   { prompt: 'Use v_s = 343 × (f_towards − f_away) ÷ (f_towards + f_away) with 560 Hz and 480 Hz. What is the rover’s speed in m/s, to 1 decimal place?', answer: [26.4], labels: ['rover speed (m/s)'], explanation: 'v_s = 343 × 80 ÷ 1040 ≈ 26.3846 m/s, which is 26.4 m/s to 1 decimal place.' },
   { prompt: 'Put the unrounded v_s into f_s = f_towards × (343 − v_s) ÷ 343. What is the siren’s own frequency in Hz, to 1 decimal place?', answer: [516.9], labels: ['siren’s own frequency (Hz)'], explanation: 'f_s = 560 × (343 − 26.3846) ÷ 343 ≈ 516.9231 Hz, which is 516.9 Hz to 1 decimal place. It lies between the two heard frequencies, as it must.' },
   { prompt: 'What is the beat frequency between 560 Hz and the siren’s own frequency, in Hz to 1 decimal place?', answer: [43.1], labels: ['beat frequency (Hz)'], explanation: 'f_beat = 560 − 516.9231 ≈ 43.0769 Hz, which is 43.1 Hz to 1 decimal place.' }
  ]
 },
 {
  id: 'q24', title: 'Slow light in the lens blanks', topic: 'The speed of light and the index of refraction, n = c/v', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'The workshop is cutting lens blanks from several materials, and each one slows the laser that tests it by a different amount.',
  lesson: 'Light travels at c ≈ 3.00 × 10⁸ m/s in a vacuum and at v = c ÷ n in a material of index of refraction n; its frequency stays the same, so its wavelength inside is λ ÷ n.',
  prompt: 'A laser beam whose wavelength in a vacuum is 600 nm passes into a block of crown glass, whose index of refraction is 1.52. Take c = 3.00 × 10⁸ m/s. Enter the speed of light in the crown glass in units of 10⁸ m/s, to 3 decimal places, then the wavelength of the light inside the crown glass in nanometres, to 1 decimal place.',
  answer: [1.974,394.7], labels: ['speed in the material (10⁸ m/s)', 'wavelength inside (nm)'], tolerance: 0.0005,
  hints: [
   'The index of refraction is n = c ÷ v, so the speed in the material is v = c ÷ n.',
   'The frequency does not change when light enters a material. With v = fλ and v smaller by the factor n, the wavelength is smaller by the same factor: λ inside = λ in a vacuum ÷ n.'
  ],
  solution: 'v = c ÷ n = 3.00 ÷ 1.52 ≈ 1.9737, which is 1.974 to 3 decimal places, in units of 10⁸ m/s. The frequency, the same in the vacuum and in the crown glass, is f = c ÷ λ = 3000 ÷ 600 = 5, in units of 10¹⁴ Hz. Inside, the light is 1.52 times slower at the same frequency, so its wavelength is 600 ÷ 1.52 ≈ 394.7368 nm, which is 394.7 nm to 1 decimal place.',
  xp: 150, prereqs: ['q07'],
  sources: [source.v3_1_1],
  teaching: {
   intuition: 'Light is a wave too: an electromagnetic wave, which needs no medium and crosses empty space. In a vacuum every colour of light travels at the speed of light, c ≈ 3.00 × 10⁸ m/s. We draw the path of a narrow beam as a straight line called a ray. In glass, water or diamond light goes slower, and how much slower is the material’s index of refraction, n = c ÷ v, where v is the speed in the material. Water has n = 1.333 and diamond 2.419, so light in diamond moves at less than half its vacuum speed; air has n = 1.000293, so close to 1 that we take it as 1.00. Wavelengths of light are tiny, so they are given in nanometres: 1 nm is 10⁻⁹ m, and visible light runs from about 400 nm (violet) to 700 nm (red). When light enters a material its frequency does not change, because each crest arriving at the surface makes one crest inside. With v = fλ, a speed n times smaller at the same frequency means a wavelength n times smaller: λ inside = λ ÷ n. Speeds here are given in units of 10⁸ m/s, so c is just 3.00.',
   steps: [
    'Read the index of refraction n of the material.',
    'Divide: v = c ÷ n, which in units of 10⁸ m/s is 3.00 ÷ n.',
    'The frequency f = c ÷ λ is the same inside and outside.',
    'Divide the vacuum wavelength by n to get the wavelength inside, in nanometres.'
   ],
   example: {
    prompt: 'Light of vacuum wavelength 500 nm enters fresh water, n = 1.333. Find its speed in the water and its wavelength there.',
    steps: ['v = 3.00 ÷ 1.333 ≈ 2.2506, so about 2.251 × 10⁸ m/s.', 'The frequency is unchanged, so λ inside = 500 ÷ 1.333 ≈ 375.09 nm.'],
    answer: 'About 2.251 × 10⁸ m/s and 375.1 nm.'
   },
   pitfalls: [
    'Multiplying by n instead of dividing: n is at least 1, so light is never faster in a material than in a vacuum, and its wavelength never longer.',
    'Thinking the frequency changes as well: the frequency is set by the source and stays the same; the speed and the wavelength change together.',
    'Losing the powers of ten: keep speeds in units of 10⁸ m/s and wavelengths in nanometres throughout.'
   ]
  },
  guidance: [
   { prompt: 'What is 3.00 ÷ 1.52: the speed of light in the crown glass in units of 10⁸ m/s, to 3 decimal places?', answer: [1.974], labels: ['speed (10⁸ m/s)'], explanation: 'v = c ÷ n = 3.00 ÷ 1.52 ≈ 1.9737, which is 1.974 to 3 decimal places, so light is 1.52 times slower in the crown glass than in a vacuum.' },
   { prompt: 'The frequency is f = c ÷ λ. With c = 3 × 10⁸ m/s and λ = 600 × 10⁻⁹ m, f = (3000 ÷ 600) × 10¹⁴ Hz. What is f in units of 10¹⁴ Hz, to 3 decimal places?', answer: [5], labels: ['frequency (10¹⁴ Hz)'], explanation: '3000 ÷ 600 = 5, so f is about 5 × 10¹⁴ Hz, in the vacuum and in the crown glass alike.' },
   { prompt: 'Same frequency, speed 1.52 times smaller: what is the wavelength inside the crown glass in nanometres, to 1 decimal place?', answer: [394.7], labels: ['wavelength inside (nm)'], explanation: 'λ inside = 600 ÷ 1.52 ≈ 394.7368 nm, which is 394.7 nm to 1 decimal place.' }
  ]
 },
 {
  id: 'q25', title: 'Bending the beam into the blank', topic: 'Reflection and Snell’s law, n₁ sin θ₁ = n₂ sin θ₂', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'A test beam has to be steered through the surface of a lens blank, and the alignment jig needs both the glint and the bent beam set exactly.',
  lesson: 'At a boundary the reflected ray leaves at the same angle from the normal as the incoming ray, and the refracted ray obeys Snell’s law, n₁ sin θ₁ = n₂ sin θ₂.',
  prompt: 'In the Lens Workshop a narrow ray of light passes from air (index of refraction 1.00) into fresh water (index 1.333) across a flat boundary. It meets the boundary at 0.8 radians from the normal, the line at right angles to the boundary. Part of the light reflects back into the air and part refracts into the fresh water. Enter the angle between the reflected ray and the boundary surface, then the angle of the refracted ray from the normal, both in radians to 3 decimal places.',
  answer: [0.771,0.568], labels: ['reflected ray to surface (rad)', 'refracted angle (rad)'], tolerance: 0.0005,
  hints: [
   'By the law of reflection, the reflected ray makes the same angle with the normal as the incoming ray. The normal and the surface are at right angles: π/2 radians apart.',
   'Snell’s law: n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal. Find sin θ₂, then take arcsin with the calculator set to radians.'
  ],
  solution: 'By the law of reflection the reflected ray is also 0.8 rad from the normal, so the angle it makes with the surface is π/2 − 0.8 ≈ 0.7708 rad, which is 0.771 rad to 3 decimal places. By Snell’s law, sin θ₂ = 1.00 × sin 0.8 ÷ 1.333 = 1.00 × 0.7174 ÷ 1.333 ≈ 0.5382, so θ₂ = arcsin of the unrounded sine ≈ 0.5682 rad, which is 0.568 rad to 3 decimal places. The ray bends towards the normal, because it enters a material with a larger index of refraction.',
  xp: 150, prereqs: ['q24'],
  sources: [source.v3_1_2, source.v3_1_3],
  teaching: {
   intuition: 'When a ray of light reaches the boundary between two materials, some of it bounces back and some goes on into the second material, changing direction as it crosses. The bending is called refraction. Angles at a boundary are always measured from the normal, the line at right angles to the surface where the ray hits. The law of reflection says the reflected ray makes the same angle with the normal as the incoming ray. Because the normal is at right angles to the surface, π/2 radians, a ray at θ from the normal is at π/2 − θ from the surface itself. For the ray that goes through, Snell’s law links the angle θ₁ in the first material to the angle θ₂ in the second: n₁ sin θ₁ = n₂ sin θ₂. A ray going into a material with a larger index is slowed and bends towards the normal; going into a smaller index, it bends away. In this pack angles are in radians, never degrees: set the calculator to radians before taking sin, and use arcsin (sin⁻¹) to turn a sine back into an angle, so arcsin(0.5) ≈ 0.5236.',
   steps: [
    'Measure every angle from the normal. The reflected ray is at the same angle from the normal as the incoming one, and at π/2 minus that from the surface.',
    'With the calculator in radians, work out n₁ sin θ₁.',
    'Divide by n₂ to get sin θ₂.',
    'Take arcsin of the unrounded sin θ₂ to get the refracted angle θ₂ in radians.'
   ],
   example: {
    prompt: 'A ray in air (n = 1.00) meets crown glass (n = 1.52) at 0.5 radians from the normal. At what angle from the normal does it travel in the glass?',
    steps: ['sin 0.5 ≈ 0.4794, with the calculator in radians.', 'sin θ₂ = 1.00 × 0.4794 ÷ 1.52 ≈ 0.3154.', 'θ₂ = arcsin(0.3154) ≈ 0.3209 rad: smaller, so the ray bends towards the normal.'],
    answer: 'About 0.321 radians from the normal.'
   },
   pitfalls: [
    'Measuring angles from the surface instead of the normal: Snell’s law uses angles from the normal.',
    'Taking the sine with the calculator in degrees: sin 0.5 must be the sine of 0.5 radians, about 0.479.',
    'Dividing the angles instead of their sines: θ₂ is not θ₁ × n₁ ÷ n₂.'
   ]
  },
  guidance: [
   { prompt: 'The reflected ray is 0.8 rad from the normal. What angle does it make with the surface, in radians to 3 decimal places?', answer: [0.771], labels: ['reflected ray to surface (rad)'], explanation: 'The normal is at π/2 ≈ 1.5708 rad to the surface, so the angle is π/2 − 0.8 ≈ 0.7708 rad, which is 0.771 rad to 3 decimal places.' },
   { prompt: 'By Snell’s law sin θ₂ = 1.00 × sin 0.8 ÷ 1.333. What is sin θ₂, to 3 decimal places?', answer: [0.538], labels: ['sin θ₂'], explanation: 'sin 0.8 ≈ 0.7174 (radians), and 1.00 × 0.7174 ÷ 1.333 ≈ 0.5382, which is 0.538 to 3 decimal places.' },
   { prompt: 'Take arcsin of the unrounded sin θ₂, with the calculator set to radians. What is the refracted angle θ₂ in radians, to 3 decimal places?', answer: [0.568], labels: ['refracted angle θ₂ (rad)'], explanation: 'θ₂ = arcsin of the unrounded sine ≈ 0.5682 rad, which is 0.568 rad to 3 decimal places, smaller than the 0.8 rad it came in at.' }
  ]
 },
 {
  id: 'q26', title: 'Light trapped in the glass', topic: 'Critical angle and total internal reflection', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'The workshop wants to pipe light round the telescope frame inside glass rods, so it must know which rays stay inside and which leak out.',
  lesson: 'Going from a larger index n₁ to a smaller n₂, a ray beyond the critical angle θc, where sin θc = n₂ ÷ n₁, cannot leave: it is totally internally reflected.',
  prompt: 'A ray travelling inside a block of polystyrene (index of refraction 1.49) reaches a flat face where the block meets air (index 1.00). It strikes the face at 0.8 radians from the normal. Enter the critical angle for this face, in radians to 3 decimal places, then 1 if the ray is totally internally reflected (trapped inside the polystyrene) or 0 if some of it escapes into the air.',
  answer: [0.736,1], labels: ['critical angle (rad)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
  hints: [
   'At the critical angle the refracted ray would run along the face, at π/2 from the normal, and sin(π/2) = 1, so Snell’s law gives sin θc = n₂ ÷ n₁.',
   'A ray that strikes the face at more than the critical angle cannot refract out: all of it reflects back inside. At less than the critical angle, part of it escapes.'
  ],
  solution: 'sin θc = 1.00 ÷ 1.49 ≈ 0.6711, so θc = arcsin(0.6711) ≈ 0.7357 rad, which is 0.736 rad to 3 decimal places. The ray strikes at 0.8 rad, which is more than the critical angle, so it is totally internally reflected and stays in the polystyrene: 1.',
  xp: 150, prereqs: ['q25'],
  sources: [source.v3_1_4],
  teaching: {
   intuition: 'A ray leaving glass for air goes into a smaller index of refraction, so by Snell’s law it bends away from the normal: the angle outside is larger than the angle inside. Tilt the ray inside more and more, and the ray outside tilts faster, until at one angle inside the ray outside runs flat along the surface, at π/2 from the normal. That inside angle is the critical angle θc. Putting θ₂ = π/2 into n₁ sin θ₁ = n₂ sin θ₂, and using sin(π/2) = 1, gives sin θc = n₂ ÷ n₁. For any angle bigger than θc, Snell’s law would need a sine bigger than 1, which no angle has, so no light gets out at all: every bit of it reflects back inside. That is total internal reflection. It can only happen going from a larger index to a smaller one (n₁ > n₂), and it is how optical fibres carry light round corners.',
   steps: [
    'Check that the ray is in the material with the larger index, n₁ > n₂; otherwise there is no critical angle.',
    'Work out sin θc = n₂ ÷ n₁.',
    'Take arcsin, with the calculator in radians, to get θc.',
    'Compare the ray’s angle from the normal with θc: more than θc means it is trapped (1); less means part of it escapes (0).'
   ],
   example: {
    prompt: 'A ray in fresh water (n = 1.333) meets the surface with air (n = 1.00) at 0.8 radians from the normal. Is it trapped?',
    steps: ['sin θc = 1.00 ÷ 1.333 ≈ 0.7502.', 'θc = arcsin(1.00 ÷ 1.333) ≈ 0.8483 rad.', '0.8 rad is less than 0.848 rad, so the ray is not trapped.'],
    answer: 'A critical angle of about 0.848 radians; the ray escapes (enter 0).'
   },
   pitfalls: [
    'Dividing the wrong way: sin θc is the smaller index over the larger, n₂ ÷ n₁, which is always less than 1.',
    'Looking for a critical angle when light goes into the larger index: then the ray bends towards the normal and always gets through.',
    'Comparing the angle from the surface with θc: both angles are measured from the normal.'
   ]
  },
  guidance: [
   { prompt: 'What is sin θc = 1.00 ÷ 1.49, to 3 decimal places?', answer: [0.671], labels: ['sin θc'], explanation: '1.00 ÷ 1.49 ≈ 0.6711, which is 0.671 to 3 decimal places. It is less than 1 because the ray is in the material with the larger index.' },
   { prompt: 'Take arcsin of the unrounded sin θc, with the calculator set to radians. What is the critical angle in radians, to 3 decimal places?', answer: [0.736], labels: ['critical angle (rad)'], explanation: 'θc = arcsin(0.6711) ≈ 0.7357 rad, which is 0.736 rad to 3 decimal places.' },
   { prompt: 'The ray strikes at 0.8 rad and the critical angle is about 0.736 rad. Enter 1 if it is trapped, 0 if it escapes.', answer: [1], labels: ['trapped (1) or escapes (0)'], explanation: '0.8 rad is more than the critical angle, so there is no refracted ray: total internal reflection, 1.' }
  ]
 },
 {
  id: 'q27', title: 'Dimming the beam with filters', topic: 'Polarisation and Malus’s law, I = I₀ cos² θ', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'The solar telescope needs its light cut down to a safe, exact level, and the workshop only has polarising filters to do it.',
  lesson: 'A polarising filter halves unpolarised light and leaves it polarised along its axis; each later filter at angle θ to that passes I = I₀ cos² θ.',
  prompt: 'Unpolarised light of intensity 240 W/m² shines on a stack of three polarising filters. The axis of the second filter is turned 0.5 radians from the axis of the first, and the axis of the third is turned a further 0.7 radians on from the second, the same way round, so the angle between the axes of the second and third filters is 0.7 radians. Enter the intensity after the first filter, after the second and after the third, each in W/m² to 2 decimal places. Use unrounded values from one filter to the next.',
  answer: [120,92.42,54.06], labels: ['after filter 1 (W/m²)', 'after filter 2 (W/m²)', 'after filter 3 (W/m²)'], tolerance: 0.005,
  hints: [
   'A polarising filter passes half the intensity of unpolarised light, and the light that leaves it is polarised along the filter’s axis.',
   'Malus’s law: polarised light through a filter whose axis is at θ to its polarisation leaves with I = I₀ cos² θ, where I₀ is the intensity just before that filter.'
  ],
  solution: 'After the first filter the light is polarised and has half the intensity: 240 ÷ 2 = 120 W/m². The second filter is at 0.5 rad to that polarisation, and cos²(0.5) ≈ 0.7702, so I₂ = 120 × cos²(0.5) ≈ 92.4181 W/m², which is 92.42 W/m² to 2 decimal places. The third filter is at 0.7 rad to the second, and cos²(0.7) ≈ 0.585, so I₃ = I₂ × cos²(0.7) ≈ 54.0631 W/m², which is 54.06 W/m² to 2 decimal places.',
  xp: 150, prereqs: ['q24'],
  sources: [source.v3_1_7],
  teaching: {
   intuition: 'Light is a transverse wave: it wobbles at right angles to the way it travels, and the wobble can point in any direction across the beam. Light from a lamp or the Sun mixes all directions; it is unpolarised. Light that wobbles in one direction only is polarised, and that direction is its polarisation. A polarising filter has an axis: it lets through only the part of the wobble along its axis. Unpolarised light loses half its intensity in a filter and leaves polarised along the axis. Polarised light meeting a second filter whose axis is turned θ from its polarisation keeps the fraction cos² θ of its intensity. That is Malus’s law, I = I₀ cos² θ, where I₀ (said “I nought”) is the intensity just before the filter, in watts per square metre. Two filters at θ = π/2, crossed, block everything, because cos(π/2) = 0. With a chain of filters, apply the rule one filter at a time, each angle measured from the filter before.',
   steps: [
    'First filter, unpolarised light: the intensity halves, and the light is now polarised along the first axis.',
    'Next filter: find the angle θ between its axis and the light’s polarisation, which is the axis of the filter before it.',
    'Multiply by cos² θ, with the calculator in radians: square the cosine, do not take the cosine of the square.',
    'Repeat for each further filter, carrying the unrounded intensity forward, and round only at the end.'
   ],
   example: {
    prompt: 'Unpolarised light of 80 W/m² meets three filters; the second is turned 0.4 rad from the first and the third a further 0.9 rad. Find the intensity at each stage.',
    steps: ['After the first: 80 ÷ 2 = 40 W/m².', 'cos(0.4) ≈ 0.92106, squared ≈ 0.84835, so 40 × 0.84835 ≈ 33.93 W/m².', 'cos(0.9) ≈ 0.6216, squared ≈ 0.3864, so 33.93 × 0.3864 ≈ 13.11 W/m².'],
    answer: '40, about 33.93 and about 13.11 W/m².'
   },
   pitfalls: [
    'Using cos² θ on unpolarised light: the first filter always passes exactly half.',
    'Using cos θ instead of cos² θ: intensity goes as the square of the cosine.',
    'Measuring the third filter’s angle from the first instead of from the second, the filter just before it.'
   ]
  },
  guidance: [
   { prompt: 'Unpolarised light of 240 W/m² meets the first filter. What intensity leaves it, in W/m²?', answer: [120], labels: ['after filter 1 (W/m²)'], explanation: 'A polarising filter passes half of unpolarised light: 240 ÷ 2 = 120 W/m².' },
   { prompt: 'That light is polarised along the first axis and meets a filter at 0.5 rad to it. What is 120 × cos²(0.5), in W/m² to 2 decimal places?', answer: [92.42], labels: ['after filter 2 (W/m²)'], explanation: 'cos(0.5) ≈ 0.8776, squared ≈ 0.7702, and 120 × cos²(0.5) ≈ 92.4181 W/m², which is 92.42 W/m² to 2 decimal places.' },
   { prompt: 'Now the third filter, 0.7 rad from the second. Multiply the unrounded I₂ by cos²(0.7). What is I₃ in W/m², to 2 decimal places?', answer: [54.06], labels: ['after filter 3 (W/m²)'], explanation: 'cos²(0.7) ≈ 0.585, so I₃ = I₂ × cos²(0.7) ≈ 54.0631 W/m², which is 54.06 W/m² to 2 decimal places.' }
  ]
 },
 {
  id: 'q28', title: 'Where the image lands', topic: 'Mirrors and thin lenses: 1/d₀ + 1/dᵢ = 1/f and magnification', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'Each new lens and mirror from the grinder gets a bench test, and the crew have to say in advance where the image of the test lamp will appear.',
  lesson: 'For a thin lens or a curved mirror, 1/d₀ + 1/dᵢ = 1/f gives the image distance, and m = −dᵢ ÷ d₀ gives the magnification; the signs say real or virtual, upright or inverted.',
  prompt: 'A small lamp stands 20 cm in front of a converging lens. Its focal length is f = 12 cm (a converging lens has a positive focal length). Enter the image distance dᵢ in centimetres to 1 decimal place, with a minus sign if the image is virtual, then the magnification m to 2 decimal places, with its sign, worked out from the unrounded image distance.',
  answer: [30,-1.5], labels: ['image distance (cm)', 'magnification (no unit)'], tolerance: 0.005,
  hints: [
   'Rearrange 1/d₀ + 1/dᵢ = 1/f to 1/dᵢ = 1/f − 1/d₀, then take the reciprocal. Keep the sign of f.',
   'The magnification is m = −dᵢ ÷ d₀. A negative m means the image is upside down; a size above 1 means it is larger than the lamp.'
  ],
  solution: '1/dᵢ = 1/12 − 1/20, so dᵢ = 12 × 20 ÷ (20 − 12) = 240 ÷ 8 = 30 cm. It is positive, so the image is real: on the far side of the lens, where the light really meets. The magnification is m = −dᵢ ÷ d₀ = −30 ÷ 20 = −1.5: the image is upside down and larger than the lamp.',
  xp: 150, prereqs: ['q25'],
  sources: [source.v3_2_4, source.v3_2_2],
  teaching: {
   intuition: 'A lens bends rays by refraction, and a curved mirror turns them by reflection, so that rays from one point of an object meet again, or seem to come from one point. That point is the image. A converging lens, or a concave mirror (hollow, like a bowl), brings parallel rays together at a point a distance f away: f is the focal length, and it is positive. A diverging lens, or a convex mirror (bulging), spreads parallel rays as if they came from a point behind it, and its focal length is negative. Lenses and mirrors obey the same equation, 1/d₀ + 1/dᵢ = 1/f, where d₀ is the object distance and dᵢ the image distance. A positive dᵢ is a real image, where light really meets and a card could catch it: behind a lens, or in front of a mirror. A negative dᵢ is a virtual image, which you only see by looking into the lens or mirror. The magnification m = −dᵢ ÷ d₀ = hᵢ ÷ h₀ compares the image height with the object height: negative means upside down, and a size above 1 means larger. These rules hold for thin lenses and for rays close to the middle of a mirror.',
   steps: [
    'Write f with its sign: positive for a converging lens or concave mirror, negative for a diverging lens or convex mirror.',
    'Rearrange 1/d₀ + 1/dᵢ = 1/f to dᵢ = f × d₀ ÷ (d₀ − f).',
    'Read the sign of dᵢ: positive is a real image, negative a virtual one.',
    'Work out m = −dᵢ ÷ d₀: its sign says upright or upside down, its size says larger or smaller.'
   ],
   example: {
    prompt: 'A lamp stands 15 cm from a converging lens with f = 10 cm. Where is the image, and what is the magnification?',
    steps: ['dᵢ = 10 × 15 ÷ (15 − 10) = 150 ÷ 5 = 30 cm: positive, so a real image on the far side.', 'm = −30 ÷ 15 = −2: upside down and twice as tall.'],
    answer: 'dᵢ = 30 cm and m = −2.'
   },
   pitfalls: [
    'Dropping the minus sign of f for a diverging lens or a convex mirror, which turns a virtual image into a real one.',
    'Forgetting to take the reciprocal: 1/f − 1/d₀ is 1/dᵢ, not dᵢ.',
    'Leaving out the minus sign in m = −dᵢ ÷ d₀, so every real image comes out upright.'
   ]
  },
  guidance: [
   { prompt: 'Use dᵢ = f × d₀ ÷ (d₀ − f) with f = 12 cm and d₀ = 20 cm. What is dᵢ in centimetres, to 1 decimal place?', answer: [30], labels: ['image distance (cm)'], explanation: 'dᵢ = 240 ÷ 8 = 30 cm.' },
   { prompt: 'What is the magnification m = −dᵢ ÷ d₀, using the unrounded dᵢ, to 2 decimal places?', answer: [-1.5], labels: ['magnification (no unit)'], explanation: 'm = −30 ÷ 20 = −1.5.' },
   { prompt: 'Enter 1 if the image is real, or 0 if it is virtual.', answer: [1], labels: ['real (1) or virtual (0)'], explanation: 'dᵢ is positive, so the image is real: light really meets there, and it could be caught on a card.' }
  ]
 },
 {
  id: 'q29', title: 'The telescope lens bench', topic: 'Chapter review: a telescope lens bench', tier: 'Intermediate', sector: 'Lens Workshop',
  brief: 'The first telescope lens is finished, and before it goes up to the dome it has to pass one full test on the bench.',
  lesson: 'A lens is a piece of refracting glass: the thin-lens equation places its image and sets its size, and the critical angle says which stray rays stay trapped inside it.',
  prompt: 'On the telescope lens bench, a target 3 cm tall stands 40 cm in front of a converging lens with focal length 25 cm. The lens is made of Plexiglas (index of refraction 1.51) and has a flat back face in air (take n = 1.00 for air). Enter the image distance in cm to 1 decimal place (negative if the image is virtual), then the image height in cm to 2 decimal places (negative if the image is upside down), worked out from the unrounded image distance. Then a stray ray inside the lens strikes the flat back face at 0.8 radians from the normal: enter 1 if it is totally internally reflected, or 0 if it escapes into the air.',
  answer: [66.7,-5,1], labels: ['image distance (cm)', 'image height (cm)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
  hints: [
   'Use the thin-lens equation 1/d₀ + 1/dᵢ = 1/f for the image distance, then hᵢ = m × h₀ with m = −dᵢ ÷ d₀.',
   'For the stray ray, find the critical angle from sin θc = n₂ ÷ n₁ with the glass as n₁, and compare the ray’s angle with it.'
  ],
  solution: 'dᵢ = f × d₀ ÷ (d₀ − f) = 25 × 40 ÷ 15 ≈ 66.6667 cm, which is 66.7 cm to 1 decimal place, so the image is real, on the far side of the lens. m = −dᵢ ÷ d₀ ≈ −1.6667, so hᵢ = m × 3 = −5 cm: upside down. For the stray ray, sin θc = 1.00 ÷ 1.51 ≈ 0.6623, so θc ≈ 0.7238 rad, which is 0.724 rad to 3 decimal places. The ray strikes at 0.8 rad, more than θc, so it is totally internally reflected: 1.',
  xp: 150, prereqs: ['q26', 'q28'],
  sources: [source.v3_2_4, source.v3_1_3, source.v3_1_4],
  teaching: {
   intuition: 'This review uses the whole chapter on one lens. The lens works because its glass refracts light, and it focuses because its curved faces bend each ray by just the right amount, so for imaging we can use the thin-lens equation, 1/d₀ + 1/dᵢ = 1/f, and the magnification m = −dᵢ ÷ d₀. The image height is hᵢ = m × h₀: negative means the image is upside down. But not every ray in the glass makes it out. A stray ray that bounces around inside and meets a flat face of the glass at a steep angle is going from the glass, with the larger index, into air, with the smaller one. If its angle from the normal is more than the critical angle θc, where sin θc = n_air ÷ n_glass, it is totally internally reflected and stays trapped in the lens.',
   steps: [
    'Find the image distance from dᵢ = f × d₀ ÷ (d₀ − f); its sign says real or virtual.',
    'Find the magnification m = −dᵢ ÷ d₀ and the image height hᵢ = m × h₀, keeping the sign.',
    'For the stray ray, work out θc = arcsin(1.00 ÷ n) for the glass against air, in radians.',
    'Compare the ray’s angle from the normal with θc: more means trapped (1), less means it escapes (0).'
   ],
   example: {
    prompt: 'A target 2 cm tall stands 30 cm from a crown glass (n = 1.52) converging lens with f = 20 cm. Where is the image and how tall is it? Is a stray ray inside at 0.6 rad to a flat face trapped?',
    steps: ['dᵢ = 20 × 30 ÷ (30 − 20) = 60 cm, a real image.', 'm = −60 ÷ 30 = −2, so hᵢ = −2 × 2 = −4 cm: 4 cm tall and upside down.', 'θc = arcsin(1.00 ÷ 1.52) ≈ 0.7180 rad, and 0.6 rad is less, so the ray escapes.'],
    answer: 'dᵢ = 60 cm, hᵢ = −4 cm, and the ray escapes (enter 0).'
   },
   pitfalls: [
    'Giving the image height without its sign: a real image from a single converging lens is upside down, so hᵢ is negative.',
    'Using the critical angle for a ray going from air into glass: total internal reflection only happens inside the material with the larger index.',
    'Rounding dᵢ before working out the magnification.'
   ]
  },
  guidance: [
   { prompt: 'What is the image distance dᵢ = 25 × 40 ÷ (40 − 25), in cm to 1 decimal place?', answer: [66.7], labels: ['image distance (cm)'], explanation: 'dᵢ = 1000 ÷ 15 ≈ 66.6667 cm, which is 66.7 cm to 1 decimal place.' },
   { prompt: 'With m = −dᵢ ÷ d₀ and the unrounded dᵢ, what is the image height hᵢ = m × 3 cm, to 2 decimal places?', answer: [-5], labels: ['image height (cm)'], explanation: 'm = −66.6667 ÷ 40 ≈ −1.6667, and hᵢ = m × 3 = −5 cm.' },
   { prompt: 'What is the critical angle for Plexiglas against air, arcsin(1.00 ÷ 1.51), in radians to 3 decimal places?', answer: [0.724], labels: ['critical angle (rad)'], explanation: '1.00 ÷ 1.51 ≈ 0.6623, and arcsin of that ≈ 0.7238 rad, which is 0.724 rad to 3 decimal places.' },
   { prompt: 'The stray ray strikes at 0.8 rad. Enter 1 if it is trapped, 0 if it escapes.', answer: [1], labels: ['trapped (1) or escapes (0)'], explanation: '0.8 rad is more than the critical angle: total internal reflection, 1.' }
  ]
 },
 {
  id: 'q30', title: 'Two slits in the Fringe Lab', topic: 'Young’s double slit: bright and dark angles, d sin θ = mλ', tier: 'Advanced', sector: 'Fringe Lab',
  brief: 'The Fringe Lab will measure tiny lengths with light, and its first instrument is a pair of slits that turns one lamp into a row of stripes.',
  lesson: 'Light from two slits a distance d apart is bright where the path difference d sin θ is a whole number of wavelengths, d sin θ = mλ, and dark where it is (m + ½)λ.',
  prompt: 'In the Fringe Lab, light of wavelength 600 nm falls on two narrow slits 5 μm apart (a micrometre, μm, is 1000 nm). Enter the angle from the centre line of the bright fringe of order m = 2, then the angle of the dark fringe given by d sin θ = (m + ½)λ with m = 2, both in radians to 4 decimal places. Then enter the highest order m of a bright fringe that can appear on one side, as a whole number.',
  answer: [0.2424,0.3047,8], labels: ['bright fringe angle (rad)', 'dark fringe angle (rad)', 'highest order (whole number)'], tolerance: 0.00005,
  hints: [
   'The path difference from the two slits to a point at angle θ is d sin θ. Bright fringes need d sin θ = mλ; dark fringes need d sin θ = (m + ½)λ. Put d and λ in the same unit first.',
   'No angle can pass π/2, where sin θ = 1, so a bright fringe’s order can be at most d ÷ λ: take the whole-number part.'
  ],
  solution: 'In nanometres the slits are d = 5000 nm apart. Bright fringe: sin θ = 2 × 600 ÷ 5000 = 0.24, so θ = arcsin(0.24) ≈ 0.2424 rad. Dark fringe: sin θ = 2.5 × 600 ÷ 5000 = 0.3, so θ ≈ 0.3047 rad. Highest order: m ≤ d ÷ λ = 5000 ÷ 600 ≈ 8.33, so the highest bright fringe is order 8.',
  xp: 200, prereqs: ['q22', 'q24'],
  sources: [source.v3_3_1, source.v3_3_2],
  teaching: {
   intuition: 'Two speakers in phase make loud and quiet spots, and light does the same. Shine one lamp on a screen with two narrow slits close together, a double slit, and each slit sends out light in step with the other. On a far wall the light does not make two bright lines but a row of bright and dark stripes called fringes. Each fringe is a place where the waves from the two slits arrive in step or opposite. Light leaving the slits at an angle θ from the centre line travels farther from one slit than from the other by the path difference d sin θ, where d is the distance between the slits. Bright fringes sit where that is a whole number of wavelengths, d sin θ = mλ, and m = 0, 1, 2 … is the fringe’s order: m = 0 is the bright centre, m = 1 the first bright fringe out, and so on, the same on both sides. Dark fringes sit where the path difference is a whole number and a half, d sin θ = (m + ½)λ, so the dark fringe with m = 0 lies between the centre and the first bright fringe. Since sin θ can never be more than 1, the order can be at most d ÷ λ, which limits how many bright fringes appear. Slit spacings are in micrometres (1 μm = 1000 nm) and wavelengths in nanometres, so convert before you divide.',
   steps: [
    'Put d and λ in the same unit: 1 μm is 1000 nm.',
    'Bright fringe of order m: sin θ = mλ ÷ d, then θ = arcsin, in radians.',
    'Dark fringe: sin θ = (m + ½)λ ÷ d, then θ = arcsin.',
    'Highest order: the whole-number part of d ÷ λ, because sin θ cannot pass 1.'
   ],
   example: {
    prompt: 'Light of 500 nm falls on slits 4.4 μm apart. Find the angles of the first bright fringe (m = 1) and the dark fringe with m = 1, and the highest order.',
    steps: ['d = 4400 nm.', 'Bright: sin θ = 500 ÷ 4400 ≈ 0.1136, θ ≈ 0.1139 rad.', 'Dark: sin θ = 1.5 × 500 ÷ 4400 ≈ 0.1705, θ ≈ 0.1713 rad.', '4400 ÷ 500 = 8.8, so the highest order is 8.'],
    answer: 'About 0.1139 rad and 0.1713 rad, and orders up to 8.'
   },
   pitfalls: [
    'Mixing units: 600 nm against 5 μm must become 600 against 5000 before dividing.',
    'Using mλ for a dark fringe: dark fringes need a half wavelength more, (m + ½)λ.',
    'Rounding d ÷ λ up for the highest order: an order above d ÷ λ would need sin θ above 1.'
   ]
  },
  guidance: [
   { prompt: 'Put both lengths in nanometres. What is d = 5 μm in nm?', answer: [5000], labels: ['slit spacing (nm)'], explanation: '1 μm is 1000 nm, so 5 μm = 5000 nm.' },
   { prompt: 'For the bright fringe, sin θ = 2 × 600 ÷ 5000. What is θ in radians, to 4 decimal places?', answer: [0.2424], labels: ['bright fringe angle (rad)'], explanation: 'sin θ = 0.24, and arcsin of it ≈ 0.2424 rad.' },
   { prompt: 'For the dark fringe, sin θ = 2.5 × 600 ÷ 5000. What is θ in radians, to 4 decimal places?', answer: [0.3047], labels: ['dark fringe angle (rad)'], explanation: 'sin θ = 0.3, and arcsin of it ≈ 0.3047 rad. It lies between the bright fringes of orders 2 and 3.' },
   { prompt: 'sin θ cannot be more than 1, so m ≤ 5000 ÷ 600. What is the highest order of bright fringe?', answer: [8], labels: ['highest order (whole number)'], explanation: '5000 ÷ 600 ≈ 8.33, and the order must be a whole number, so it is 8.' }
  ]
 }
);
})();
