/* Waves: sound and light missions, file b: q11–q20. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-b.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-b.js; drill statements: variants-b.js; oracles:
   qa/realms/waves/oracle-b.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q11  ch 2 Travelling waves · Basic, 100 XP · sector 'Mast Cables' · Chapter review: a pulse on the mast cable [V1 16.2, 16.3]
     q12  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · Superposition: two waves out of phase, amplitude 2A cos(φ/2) [V1 16.5]
     q13  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · Standing waves on a string: nodes and harmonics [V1 16.6]
     q14  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · The speed of sound in air and its temperature [V1 17.2]
     q15  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · Sound intensity and decibels, β = 10 log₁₀(I/I₀) [V1 17.3]
     q16  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · Open and closed pipes: normal modes [V1 17.4]
     q17  ch 3 Superposition and sound · Intermediate, 150 XP · sector 'Assembly Hall' · Chapter review: strings and pipes in tune [V1 16.6, 17.4]
     q18  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Beats [V1 17.6]
     q19  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Doppler effect for a moving source [V1 17.7]
     q20  ch 4 Sound on the move · Intermediate, 150 XP · sector 'Rover Track' · Doppler effect for a moving listener, and both moving [V1 17.7] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 (chapters 15–17) and Volume 3 (chapters 1–4) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 16.1 Traveling Waves
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s16_2: { title: "OpenStax University Physics Volume 1 — 16.2 Mathematics of Waves", url: "https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves", description: "Wave speed v = λ ÷ T, the wave number, the wave function, and a pulse that keeps its shape and moves Δx = vΔt at a constant wave speed.", verified: '2026-11-28' },
 s16_3: { title: "OpenStax University Physics Volume 1 — 16.3 Wave Speed on a Stretched String", url: "https://openstax.org/books/university-physics-volume-1/pages/16-3-wave-speed-on-a-stretched-string", description: "Linear mass density μ = m ÷ l and the wave speed v = √(F_T ÷ μ) on a string under tension.", verified: '2026-11-28' },
 s16_5: { title: "OpenStax University Physics Volume 1 — 16.5 Interference of Waves", url: "https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves", description: "Superposition, constructive and destructive interference, and the resultant wave of amplitude 2A cos(φ ÷ 2) from two equal waves with a phase difference φ.", verified: '2026-11-28' },
 s16_6: { title: "OpenStax University Physics Volume 1 — 16.6 Standing Waves and Resonance", url: "https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance", description: "Standing waves on a string fixed at both ends: nodes, antinodes, λₙ = 2L ÷ n, fₙ = nv ÷ (2L), the fundamental and the harmonics. The node spacing L ÷ n is worked out in the mission.", verified: '2026-11-28' },
 s17_2: { title: "OpenStax University Physics Volume 1 — 17.2 Speed of Sound", url: "https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound", description: "The speed of sound in air, v = 331 m/s √(1 + T_C ÷ 273 °C), and v = fλ for sound.", verified: '2026-11-28' },
 s17_3: { title: "OpenStax University Physics Volume 1 — 17.3 Sound Intensity", url: "https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity", description: "Sound intensity level β = 10 log₁₀(I ÷ I₀) in decibels with I₀ = 10⁻¹² W/m²; each factor of 10 in intensity is 10 dB.", verified: '2026-11-28' },
 s17_4: { title: "OpenStax University Physics Volume 1 — 17.4 Normal Modes of a Standing Sound Wave", url: "https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave", description: "Resonant frequencies of a tube closed at one end (fₙ = nv ÷ (4L), odd n) and of a tube open at both ends (fₙ = nv ÷ (2L), every n).", verified: '2026-11-28' },
 s17_6: { title: "OpenStax University Physics Volume 1 — 17.6 Beats", url: "https://openstax.org/books/university-physics-volume-1/pages/17-6-beats", description: "Beats from two sounds of nearby frequencies, the beat frequency |f₂ − f₁|, and tuning an instrument by its beats.", verified: '2026-11-28' },
 s17_7: { title: "OpenStax University Physics Volume 1 — 17.7 The Doppler Effect", url: "https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect", description: "The heard frequency for a moving source, a moving observer and both moving, with the signs for approaching and moving away.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q11', title: "A pulse up the guy cable", topic: "Chapter review: a pulse on the mast cable", tier: 'Basic', sector: 'Mast Cables',
  brief: "Mira wants to time a signal pulse up one of the mast’s guy cables before trusting it to carry warnings.",
  lesson: "A cable’s mass and length give its linear mass density; with the tension that fixes the wave speed, and the wave speed then gives the wavelength and the travel time.",
  prompt: "A guy cable on the comms mast is 50 m long and has a mass of 4 kg. It is pulled tight with a tension of 288 N. Mira shakes its bottom end up and down 12 times a second, so a wave of frequency 12 Hz runs up the cable. Enter the cable’s linear mass density in kg/m, the wave speed on the cable in m/s, the wavelength in metres, and the time in seconds a pulse takes to travel the whole length of the cable, to 3 decimal places.",
  answer: [0.08,60,5,0.833], labels: ["linear mass density (kg/m)","wave speed (m/s)","wavelength (m)","travel time (s)"], tolerance: 0.0005,
  hints: [
   "Linear mass density is mass divided by length, μ = m ÷ L. The wave speed on a stretched cable is v = √(F_T ÷ μ), where F_T is the tension.",
   "The wavelength comes from v = fλ, so λ = v ÷ f. A pulse keeps the wave speed all the way, so the time is the distance divided by the speed."
  ],
  solution: "μ = 4 ÷ 50 = 0.08 kg/m. v = √(288 ÷ 0.08) = √3600 = 60 m/s. λ = v ÷ f = 60 ÷ 12 = 5 m. The pulse covers 50 m at 60 m/s, so it takes 50 ÷ 60 ≈ 0.833 s.",
  xp: 100, prereqs: ["q08","q09"],
  sources: [source.s16_2, source.s16_3],
  teaching: {
   intuition: "This review strings the chapter together on one cable. A wave on a stretched cable travels at a speed set by the cable alone: how tight it is pulled and how heavy each metre of it is. Each metre’s mass is the linear mass density, μ, the total mass divided by the length. The speed is v = √(F_T ÷ μ), where F_T is the tension in newtons: a tighter cable is faster, a heavier one slower. Whoever shakes the end chooses only the frequency f. The wavelength then follows from v = fλ, and a pulse keeps its shape and its speed all the way, so the time to cover a distance is that distance divided by v.",
   steps: [
    "Divide the mass by the length to get the linear mass density μ, in kg/m.",
    "Divide the tension by μ and take the square root: v = √(F_T ÷ μ), in m/s.",
    "Divide the wave speed by the frequency to get the wavelength: λ = v ÷ f, in metres.",
    "Divide the length of the cable by the wave speed to get the time a pulse takes, in seconds."
   ],
   example: {
    prompt: "A cable 40 m long has a mass of 2 kg and a tension of 125 N, and its end is shaken at 10 Hz. Find μ, the wave speed, the wavelength and the time for a pulse to run its length.",
    steps: [
     "μ = 2 ÷ 40 = 0.05 kg/m.",
     "v = √(125 ÷ 0.05) = √2500 = 50 m/s.",
     "λ = 50 ÷ 10 = 5 m, and the pulse takes 40 ÷ 50 = 0.8 s."
    ],
    answer: "μ = 0.05 kg/m, v = 50 m/s, λ = 5 m and 0.8 s."
   },
   pitfalls: [
    "Using the total mass in v = √(F_T ÷ μ) instead of the mass per metre. Divide by the length first.",
    "Thinking a faster shake makes the wave travel faster. The frequency changes the wavelength; the speed is fixed by the tension and μ.",
    "Forgetting the square root: F_T ÷ μ is the square of the speed."
   ]
  },
  guidance: [
   { prompt: "The cable’s 4 kg is spread evenly over 50 m. What is its linear mass density μ, in kg/m?", answer: [0.08], labels: ["μ (kg/m)"], explanation: "μ = m ÷ L = 4 ÷ 50 = 0.08 kg/m: each metre of cable has a mass of 0.08 kg." },
   { prompt: "The tension is 288 N and μ = 0.08 kg/m. What is the wave speed v = √(F_T ÷ μ), in m/s?", answer: [60], labels: ["wave speed (m/s)"], explanation: "288 ÷ 0.08 = 3600, and √3600 = 60, so waves run along the cable at 60 m/s." },
   { prompt: "The wave speed is 60 m/s and the frequency is 12 Hz. What is the wavelength λ = v ÷ f, in metres?", answer: [5], labels: ["wavelength (m)"], explanation: "λ = 60 ÷ 12 = 5 m. Each second 12 waves leave the bottom end, and together they stretch 60 m." },
   { prompt: "A pulse runs at 60 m/s along the 50 m cable. How long does it take, in seconds to 3 decimal places?", answer: [0.833], labels: ["travel time (s)"], explanation: "Time is distance ÷ speed: 50 ÷ 60 ≈ 0.833 s." }
  ]
 },
 {
  id: 'q12', title: "Two waves on one rope", topic: "Superposition and interference", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "Two crew members shaking one rope get a wobble neither of them made on their own, and Mira wants to predict its size.",
  lesson: "Superposition: where waves overlap their displacements add, and this adding of waves is called interference. Two equal waves with phase difference φ make one wave of amplitude 2A cos(φ ÷ 2): 2A in constructive interference, 0 in destructive interference.",
  prompt: "Two crew members shake the same long rope across the assembly hall from the same end, so two waves travel along it together: y₁ = 5 sin(kx − ωt) cm and y₂ = 5 sin(kx − ωt + 1.2) cm. They have the same amplitude, wave number and angular frequency, but the second is ahead by a phase difference of 1.2 rad. Angles are in radians. Enter the amplitude of the combined wave in cm, then the combined displacement of the rope in cm at a place and moment where kx − ωt = 0.6 rad. Give both to 2 decimal places; the displacement may be negative.",
  answer: [8.25,7.69], labels: ["combined amplitude (cm)","combined displacement (cm)"], tolerance: 0.005,
  hints: [
   "Superposition: where two waves overlap, their displacements add. Two equal waves with a phase difference φ add up to one wave of amplitude 2A cos(φ ÷ 2).",
   "For the displacement, put the value of kx − ωt into each wave on its own, take both sines in radians, and add the two displacements."
  ],
  solution: "The combined wave has amplitude 2A cos(φ ÷ 2) = 2 × 5 × cos(0.6) ≈ 8.25 cm. Where kx − ωt = 0.6, y₁ = 5 sin(0.6) ≈ 2.82 cm and y₂ = 5 sin(1.8) ≈ 4.87 cm, so the rope is displaced by y₁ + y₂ ≈ 2.82 + 4.87 = 7.69 cm.",
  xp: 150, prereqs: ["q08"],
  sources: [source.s16_5],
  teaching: {
   intuition: "When two waves pass through the same place at the same time, the medium does both things at once: its displacement is the sum of the two displacements. This is superposition, and the adding of waves is called interference. If two equal waves are exactly in step, crest on crest, they add to a wave twice as tall: constructive interference. If one is half a cycle behind, a phase difference of π rad, every crest meets a trough and they cancel: destructive interference. In between, two waves y₁ = A sin(kx − ωt) and y₂ = A sin(kx − ωt + φ) add up to y = 2A cos(φ ÷ 2) sin(kx − ωt + φ ÷ 2). That is one wave with the same wave number and angular frequency, and amplitude 2A cos(φ ÷ 2). Angles here are in radians.",
   steps: [
    "Check that the two waves have the same amplitude A, wave number k and angular frequency ω, and read off the phase difference φ in radians.",
    "The combined amplitude is 2A cos(φ ÷ 2). It is 2A for φ = 0 and 0 for φ = π.",
    "To find the displacement at one place and moment, put the value of kx − ωt into each wave, work out both sines in radians, and add the two displacements."
   ],
   example: {
    prompt: "Two waves of amplitude 3 cm differ in phase by 2 rad. What is the amplitude of their sum, and its displacement where kx − ωt = 0?",
    steps: [
     "Half the phase difference is 1 rad, so the amplitude is 2 × 3 × cos(1) ≈ 6 × 0.5403 ≈ 3.24 cm.",
     "Where kx − ωt = 0, y₁ = 3 sin(0) = 0 and y₂ = 3 sin(2) ≈ 2.73 cm, so the sum is 0 + 2.73 = 2.73 cm."
    ],
    answer: "Amplitude about 3.24 cm; displacement about 2.73 cm."
   },
   pitfalls: [
    "Using cos(φ) instead of cos(φ ÷ 2). With φ = π the waves cancel, and cos(π ÷ 2) = 0 shows it.",
    "Working the sines and cosines in degrees. Every angle in these missions is in radians.",
    "Adding the two amplitudes, 2A, whatever the phase. That is only true when the waves are exactly in step."
   ]
  },
  guidance: [
   { prompt: "The amplitude of each wave is A = 5 cm and the phase difference is φ = 1.2 rad. What is the combined amplitude 2A cos(φ ÷ 2), in cm to 2 decimal places?", answer: [8.25], labels: ["combined amplitude (cm)"], explanation: "φ ÷ 2 = 0.6 rad, and 2 × 5 × cos(0.6) ≈ 8.25 cm. It is less than 10 cm, the 2A of waves exactly in step, because the waves are partly out of step." },
   { prompt: "Where kx − ωt = 0.6 rad, what is the first wave’s displacement y₁ = 5 sin(0.6), in cm to 2 decimal places?", answer: [2.82], labels: ["y₁ (cm)"], explanation: "sin(0.6) ≈ 0.5646, so y₁ ≈ 2.82 cm." },
   { prompt: "The second wave is ahead by 1.2 rad, so there its angle is 0.6 + 1.2 = 1.8 rad. What is y₂ = 5 sin(1.8), in cm to 2 decimal places?", answer: [4.87], labels: ["y₂ (cm)"], explanation: "sin(1.8) ≈ 0.9738, so y₂ ≈ 4.87 cm. Adding the two displacements gives 7.69 cm." }
  ]
 },
 {
  id: 'q13', title: "The singing tuning cable", topic: "Standing waves on a string: nodes and harmonics", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "A tuning cable in the hall has to ring at exactly the right note, and Mira needs to know where it stays still.",
  lesson: "A string fixed at both ends holds standing waves of n half-wavelengths: λₙ = 2L ÷ n and fₙ = nv ÷ (2L). The fundamental is n = 1; neighbouring nodes are half a wavelength apart, with an antinode halfway between them.",
  prompt: "A tuning cable 1.2 m long is fixed at both ends in the assembly hall, and waves travel along it at 180 m/s. Mira plucks it so that it vibrates in its 3rd harmonic: a standing wave with 3 loops between the ends. Enter the wavelength of that standing wave in metres, its frequency in Hz, and the distance in metres between neighbouring nodes.",
  answer: [0.8,225,0.4], labels: ["wavelength (m)","frequency (Hz)","node spacing (m)"], tolerance: 0.0005,
  hints: [
   "A cable fixed at both ends has a node at each end. In its nth harmonic it holds n loops, and each loop is half a wavelength, so λ = 2L ÷ n.",
   "The frequency comes from v = fλ, so f = v ÷ λ = nv ÷ (2L). Neighbouring nodes are half a wavelength apart."
  ],
  solution: "λ = 2L ÷ n = 2 × 1.2 ÷ 3 = 0.8 m. f = v ÷ λ = 180 ÷ 0.8 = 225 Hz. Neighbouring nodes are λ ÷ 2 = 0.4 m apart, and 3 loops of 0.4 m fill the 1.2 m cable.",
  xp: 150, prereqs: ["q12","q09"],
  sources: [source.s16_6],
  teaching: {
   intuition: "Pluck a cable fixed at both ends and waves run along it, bounce off the ends and run back. The waves going each way overlap, and for certain frequencies they add up to a standing wave: a pattern that does not travel, but swells and shrinks in place. Some points never move at all; these are nodes. Halfway between nodes are antinodes, where the cable swings most. The fixed ends must be nodes, so the cable can hold only a whole number n of loops, and each loop is half a wavelength: L = n × λ ÷ 2, or λₙ = 2L ÷ n. The wave speed v on the cable is fixed by its tension and μ, so v = fλ gives the frequencies fₙ = nv ÷ (2L). The lowest, n = 1, is the fundamental; the frequency of the nth pattern is called the nth harmonic, and it is n times the fundamental.",
   steps: [
    "Read off the length L, the wave speed v and the harmonic number n (the number of loops).",
    "The wavelength is λ = 2L ÷ n.",
    "The frequency is f = v ÷ λ = nv ÷ (2L).",
    "Neighbouring nodes are half a wavelength apart, λ ÷ 2 = L ÷ n: one loop."
   ],
   example: {
    prompt: "A cable 0.9 m long, fixed at both ends, carries waves at 144 m/s and vibrates in its 2nd harmonic. Find the wavelength, the frequency and the node spacing.",
    steps: [
     "λ = 2 × 0.9 ÷ 2 = 0.9 m.",
     "f = 144 ÷ 0.9 = 160 Hz, twice the fundamental of 80 Hz.",
     "The nodes are 0.9 ÷ 2 = 0.45 m apart: at the two ends and in the middle."
    ],
    answer: "λ = 0.9 m, f = 160 Hz, nodes 0.45 m apart."
   },
   pitfalls: [
    "Taking the whole cable as one wavelength. One loop is half a wavelength, so the fundamental’s wavelength is twice the cable’s length.",
    "Counting nodes as the loops. The 3rd harmonic has 3 loops and 4 nodes, counting the two ends.",
    "Thinking a higher harmonic travels faster. The wave speed stays the same; the wavelength shrinks and the frequency grows."
   ]
  },
  guidance: [
   { prompt: "The cable is 1.2 m long and holds 3 loops, each half a wavelength long. What is the wavelength λ = 2L ÷ n, in metres?", answer: [0.8], labels: ["wavelength (m)"], explanation: "3 half-wavelengths make 1.2 m, so λ = 2 × 1.2 ÷ 3 = 0.8 m." },
   { prompt: "Waves travel at 180 m/s and the wavelength is 0.8 m. What is the frequency f = v ÷ λ, in Hz?", answer: [225], labels: ["frequency (Hz)"], explanation: "f = 180 ÷ 0.8 = 225 Hz, which is 3 times the fundamental frequency of 75 Hz." },
   { prompt: "Neighbouring nodes are half a wavelength apart. What is that distance, in metres?", answer: [0.4], labels: ["node spacing (m)"], explanation: "λ ÷ 2 = 0.8 ÷ 2 = 0.4 m, the length of one loop." }
  ]
 },
 {
  id: 'q14', title: "A warm hall and a cold hall", topic: "The speed of sound in air and its temperature", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "The hall’s heating changes how its notes travel, and Mira wants the speed of sound and a note’s wavelength for today’s air.",
  lesson: "Sound is a longitudinal wave in air; its speed grows with temperature, v = 331 √(1 + T_C ÷ 273) m/s, and v = fλ as for any wave.",
  prompt: "The air in the assembly hall is at 20 °C, and a speaker plays a note of 500 Hz. Enter the speed of sound in the hall in m/s, to 2 decimal places, then the wavelength of the note in metres, to 3 decimal places, worked out from the unrounded speed.",
  answer: [342.91,0.686], labels: ["speed of sound (m/s)","wavelength (m)"], tolerance: 0.0005,
  hints: [
   "In air at a temperature of T_C degrees Celsius, sound travels at v = 331 √(1 + T_C ÷ 273) m/s. A temperature below 0 °C makes the fraction negative.",
   "Sound is a wave like any other, so v = fλ and λ = v ÷ f."
  ],
  solution: "1 + 20 ÷ 273 ≈ 1.0733, so v = 331 × √(1 + 20 ÷ 273) ≈ 342.91 m/s. λ = v ÷ f ≈ 342.9103 ÷ 500 ≈ 0.686 m.",
  xp: 150, prereqs: ["q07"],
  sources: [source.s17_2],
  teaching: {
   intuition: "Sound is a wave in the air: a speaker pushes the air back and forth, and the squeezes and stretches pass from one bit of air to the next. The air moves along the direction the wave travels, so sound is a longitudinal wave. How fast it travels depends on the air, not on the note. Warm air molecules move faster and pass the squeeze on sooner, so sound is faster in warm air. In air at T_C degrees Celsius the speed is v = 331 √(1 + T_C ÷ 273) m/s: 331 m/s at 0 °C, a little more when warmer, a little less when colder. Once you know the speed, v = fλ gives the wavelength of a note of frequency f. Elsewhere at the outpost we take 343 m/s, the speed at about 20 °C.",
   steps: [
    "Divide the temperature in degrees Celsius by 273 and add 1. A temperature below 0 °C makes this less than 1.",
    "Take the square root and multiply by 331 to get the speed in m/s.",
    "Divide the speed by the frequency to get the wavelength in metres. Use the unrounded speed and round only at the end."
   ],
   example: {
    prompt: "The air is at 30 °C. What is the speed of sound, and the wavelength of a 1000 Hz note?",
    steps: [
     "1 + 30 ÷ 273 ≈ 1.1099, and √1.1099 ≈ 1.0535.",
     "v ≈ 331 × 1.0535 ≈ 348.71 m/s.",
     "λ ≈ 348.71 ÷ 1000 ≈ 0.349 m."
    ],
    answer: "About 348.71 m/s, and a wavelength of about 0.349 m."
   },
   pitfalls: [
    "Forgetting the square root and taking 331 × (1 + T_C ÷ 273), which overstates the change.",
    "Thinking a higher note travels faster. Every note travels at the same speed in the same air; only its wavelength changes.",
    "Rounding the speed early and then dividing; that can change the last digit of the wavelength."
   ]
  },
  guidance: [
   { prompt: "The hall is at 20 °C. What is the speed of sound v = 331 √(1 + T_C ÷ 273), in m/s to 2 decimal places?", answer: [342.91], labels: ["speed of sound (m/s)"], explanation: "20 ÷ 273 ≈ 0.0733, so v ≈ 331 × √1.0733 ≈ 342.91 m/s. That is faster than the 331 m/s of air at 0 °C, because the air is warmer." },
   { prompt: "The note is 500 Hz. What is its wavelength λ = v ÷ f, in metres to 3 decimal places?", answer: [0.686], labels: ["wavelength (m)"], explanation: "λ ≈ 342.9103 ÷ 500 ≈ 0.686 m." }
  ]
 },
 {
  id: 'q15', title: "How loud is the speaker?", topic: "Sound intensity and decibels", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "The hall’s speakers must be loud enough to hear but not painful, and the safety rules are written in decibels.",
  lesson: "The sound intensity level is β = 10 log₁₀(I ÷ I₀) decibels with I₀ = 10⁻¹² W/m²; each factor of 10 in intensity adds 10 dB.",
  prompt: "At Mira’s seat in the assembly hall, the sound from one speaker has an intensity of 4 × 10⁻⁷ W/m². A louder speaker gives 2.4 × 10⁻⁶ W/m² at the same seat. The reference intensity is I₀ = 10⁻¹² W/m². Enter the sound intensity level of the first speaker in dB, then that of the second in dB, both to 1 decimal place. Then enter how many times as intense the second sound is as the first.",
  answer: [56,63.8,6], labels: ["level of the first (dB)","level of the second (dB)","intensity factor"], tolerance: 0.005,
  hints: [
   "The sound intensity level is β = 10 log₁₀(I ÷ I₀) decibels. Dividing by I₀ = 10⁻¹² adds 12 to the power of ten.",
   "log₁₀(a × 10ᵖ) = log₁₀ a + p. For the last answer divide the second intensity by the first; each factor of 10 in intensity adds 10 dB."
  ],
  solution: "I₁ ÷ I₀ = 4 × 10⁵, so log₁₀(I₁ ÷ I₀) = log₁₀ 4 + 5 ≈ 5.6021 and β₁ ≈ 56.0 dB. I₂ ÷ I₀ = 2.4 × 10⁶, so log₁₀(I₂ ÷ I₀) ≈ 6.3802 and β₂ ≈ 63.8 dB. I₂ ÷ I₁ = (2.4 × 10⁻⁶) ÷ (4 × 10⁻⁷) = 6: the second sound is 6 times as intense, and its level is 10 log₁₀ 6 ≈ 7.8 dB higher.",
  xp: 150, prereqs: ["q10"],
  sources: [source.s17_3],
  teaching: {
   intuition: "Ears cope with an enormous range of sound intensity, the power per square metre: the loudest sound you can bear is about a million million times as intense as the faintest you can hear. Instead of those huge numbers we count powers of ten. log₁₀ x is the power you raise 10 to in order to get x: log₁₀ 1000 = 3, log₁₀ 1 = 0, and log₁₀ 2 ≈ 0.301 (the log key of a calculator gives it). A power of ten splits off: log₁₀(a × 10ᵖ) = log₁₀ a + p. The sound intensity level compares an intensity I with the faintest audible one, I₀ = 10⁻¹² W/m²: β = 10 log₁₀(I ÷ I₀). Its unit is the decibel, dB. So I₀ itself is 0 dB, ten times I₀ is 10 dB, and every further factor of 10 in intensity adds another 10 dB.",
   steps: [
    "Divide the intensity by I₀ = 10⁻¹² W/m². With I written as a × 10ᵖ, that adds 12 to the power: a × 10ᵖ⁺¹².",
    "Take log₁₀: log₁₀ a plus the power of ten.",
    "Multiply by 10 to get the level in decibels.",
    "To compare two sounds, divide their intensities; the levels differ by 10 log₁₀ of that ratio."
   ],
   example: {
    prompt: "A sound has intensity 3 × 10⁻⁵ W/m². What is its level? What is the level of a sound twice as intense?",
    steps: [
     "I ÷ I₀ = 3 × 10⁷, so log₁₀(I ÷ I₀) = log₁₀ 3 + 7 ≈ 7.4771.",
     "β ≈ 10 × 7.4771 ≈ 74.8 dB.",
     "Twice as intense adds 10 log₁₀ 2 ≈ 3.0 dB: about 77.8 dB."
    ],
    answer: "About 74.8 dB, and about 77.8 dB for twice the intensity."
   },
   pitfalls: [
    "Forgetting to divide by I₀ and taking the log of the intensity itself, which gives a negative number.",
    "Thinking twice the intensity means twice the decibels. Doubling the intensity adds only about 3 dB.",
    "Dropping the factor 10: log₁₀(I ÷ I₀) is in bels, and β in decibels is ten times it."
   ]
  },
  guidance: [
   { prompt: "I₁ ÷ I₀ = (4 × 10⁻⁷) ÷ 10⁻¹² = 4 × 10⁵. What is log₁₀ of that, to 2 decimal places?", answer: [5.6], labels: ["log₁₀(I₁ ÷ I₀)"], explanation: "log₁₀(4 × 10⁵) = log₁₀ 4 + 5 ≈ 5.6021, which is 5.60 to 2 decimal places. Ten times it is the level β₁ ≈ 56.0 dB." },
   { prompt: "Now the louder speaker: I₂ = 2.4 × 10⁻⁶ W/m². What is its level β₂ = 10 log₁₀(I₂ ÷ I₀), in dB to 1 decimal place?", answer: [63.8], labels: ["level of the second (dB)"], explanation: "I₂ ÷ I₀ = 2.4 × 10⁶, whose log₁₀ is about 6.3802, so β₂ ≈ 63.8 dB." },
   { prompt: "How many times as intense is 2.4 × 10⁻⁶ W/m² as 4 × 10⁻⁷ W/m²?", answer: [6], labels: ["intensity factor"], explanation: "Dividing the two intensities gives 6. The two levels differ by 10 log₁₀ 6 ≈ 7.8 dB, the same ratio told in decibels." }
  ]
 },
 {
  id: 'q16', title: "Organ pipes, open and closed", topic: "Open and closed pipes: normal modes", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "The hall’s organ is being rebuilt, and each new pipe must sound its note before anyone cuts the metal.",
  lesson: "An open pipe, open at both ends, has fₙ = nv ÷ (2L) for every n; a closed pipe, closed at one end, has fₙ = nv ÷ (4L) for odd n only.",
  prompt: "An organ pipe in the assembly hall is 0.7 m long and closed at one end, open at the other. Sound travels at 343 m/s in the hall. Enter the frequency of the pipe’s fundamental in Hz, then the frequency of the next harmonic the pipe can sound above it in Hz, both to 2 decimal places. Then enter the length in metres of a pipe open at both ends that has the same fundamental.",
  answer: [122.5,367.5,1.4], labels: ["fundamental (Hz)","next harmonic (Hz)","length of the other pipe (m)"], tolerance: 0.0005,
  hints: [
   "A pipe open at both ends has λ = 2L ÷ n and fₙ = nv ÷ (2L) for n = 1, 2, 3, … A pipe closed at one end has λ = 4L ÷ n and fₙ = nv ÷ (4L) for odd n only: 1, 3, 5, …",
   "The fundamental is n = 1. Find the next harmonic from the unrounded fundamental. For the other kind of pipe, set its fundamental equal to this one and solve for its length."
  ],
  solution: "A pipe closed at one end has a node at the closed end and an antinode at the open end, so its fundamental is f₁ = v ÷ (4L) = 343 ÷ (4 × 0.7) = 122.5 Hz. Only odd harmonics are possible, so the next one is the 3rd: 3 × f₁ = 367.5 Hz. A pipe open at both ends with the same fundamental needs v ÷ (2L′) = v ÷ (4 × 0.7), so L′ = 2 × 0.7 = 1.4 m.",
  xp: 150, prereqs: ["q13","q14"],
  sources: [source.s17_4],
  teaching: {
   intuition: "Air in a pipe holds standing sound waves, just as a cable holds standing waves on a string. What matters is the ends. At a closed end the air cannot move, so it is a node of the air’s motion. At an open end the air moves most freely, so it is an antinode. An open pipe, open at both ends, has antinodes at both ends, like a cable with nodes at both ends: it holds whole numbers of half-wavelengths, λₙ = 2L ÷ n, so fₙ = nv ÷ (2L) for n = 1, 2, 3, … A closed pipe, closed at one end and open at the other, has a node at one end and an antinode at the other. The shortest pattern is a quarter-wavelength, so λₙ = 4L ÷ n and fₙ = nv ÷ (4L), but only for odd n = 1, 3, 5, … Its fundamental is half that of an open pipe of the same length, and its next harmonic is the 3rd.",
   steps: [
    "Decide which kind of pipe it is: open at both ends, or closed at one end.",
    "Fundamental: f₁ = v ÷ (2L) for an open pipe, f₁ = v ÷ (4L) for a closed pipe, with v the speed of sound.",
    "Next harmonic: 2f₁ for an open pipe, 3f₁ for a closed pipe, because a closed pipe has odd harmonics only.",
    "For a pipe of the other kind with the same fundamental, set the two fundamentals equal and solve for its length."
   ],
   example: {
    prompt: "A pipe 0.5 m long is open at both ends, and sound travels at 343 m/s. Find its fundamental and next harmonic, and the length of a closed pipe with the same fundamental.",
    steps: [
     "f₁ = 343 ÷ (2 × 0.5) = 343 Hz.",
     "Every harmonic is possible, so the next is 2 × 343 = 686 Hz.",
     "A closed pipe needs 343 ÷ (4L′) = 343, so L′ = 0.25 m."
    ],
    answer: "343 Hz, then 686 Hz; a closed pipe 0.25 m long."
   },
   pitfalls: [
    "Giving a closed pipe a 2nd harmonic. Its harmonics are odd only, so after the fundamental comes the 3rd.",
    "Using 2L for a closed pipe. Its fundamental fits a quarter-wavelength, so λ = 4L.",
    "Mixing up which end is a node: the closed end is a node of the air’s motion, the open end an antinode."
   ]
  },
  guidance: [
   { prompt: "The pipe is closed at one end, so its fundamental is f₁ = v ÷ (4L). What is f₁, in Hz to 2 decimal places?", answer: [122.5], labels: ["fundamental (Hz)"], explanation: "f₁ = 343 ÷ (4 × 0.7) = 343 ÷ 2.8 = 122.5 Hz." },
   { prompt: "A pipe closed at one end sounds only odd harmonics. What is the frequency of the next harmonic above the fundamental, in Hz to 2 decimal places?", answer: [367.5], labels: ["next harmonic (Hz)"], explanation: "The next harmonic is the 3rd, at 3 × f₁ = 367.5 Hz." },
   { prompt: "A pipe open at both ends of length L′ has fundamental v ÷ (2L′). How long must it be, in metres, to have the same fundamental?", answer: [1.4], labels: ["length of the other pipe (m)"], explanation: "v ÷ (2L′) = v ÷ (4 × 0.7) gives 2L′ = 4 × 0.7, so L′ = 1.4 m: an open pipe must be twice as long for the same note." }
  ]
 },
 {
  id: 'q17', title: "A string and a pipe in tune", topic: "Chapter review: strings and pipes in tune", tier: 'Intermediate', sector: 'Assembly Hall',
  brief: "Before the concert in the hall, a tuning string and a new organ pipe have to play exactly the same note.",
  lesson: "Match two instruments by their frequencies: the string’s note from v = √(F_T ÷ μ) and fₙ = nv ÷ (2L), then the pipe length from its own fundamental and the speed of sound.",
  prompt: "A tuning string in the assembly hall is 0.8 m long and fixed at both ends. Its linear mass density is 0.005 kg/m and its tension is 200 N. It is played in its 2nd harmonic. Mira wants an organ pipe closed at one end whose fundamental is the same note, and sound travels at 343 m/s in the hall. Enter the wave speed on the string in m/s, the frequency of the note in Hz, and the length of the pipe in metres, to 3 decimal places.",
  answer: [200,250,0.343], labels: ["string wave speed (m/s)","frequency of the note (Hz)","pipe length (m)"], tolerance: 0.0005,
  hints: [
   "On the string, v = √(F_T ÷ μ), and the nth harmonic of a string fixed at both ends has frequency fₙ = nv ÷ (2L).",
   "The pipe’s fundamental is 343 ÷ (4L) for a pipe closed at one end. Set it equal to the string’s note and solve for L; the string’s wave speed has nothing to do with the speed of sound in the pipe."
  ],
  solution: "On the string v = √(200 ÷ 0.005) = √40000 = 200 m/s. Its 2nd harmonic is f = 2 × 200 ÷ (2 × 0.8) = 250 Hz. The pipe needs 343 ÷ (4L) = 250, so L = 343 ÷ (4 × 250) = 0.343 m.",
  xp: 150, prereqs: ["q13","q16"],
  sources: [source.s16_6, source.s17_4],
  teaching: {
   intuition: "Two instruments are in tune when they sound the same frequency. A string and a pipe make their notes in different ways, and the waves in them travel at different speeds. On the string the wave speed is v = √(F_T ÷ μ), and the nth harmonic is fₙ = nv ÷ (2L). In the pipe the wave is sound in air, at 343 m/s, and the fundamental is 343 ÷ (2L) for a pipe open at both ends or 343 ÷ (4L) for a closed pipe. What the two share is only the frequency: it passes from the string to the air unchanged, and the wavelength changes with the speed. So work out the string’s note first, then the pipe length that gives the same frequency.",
   steps: [
    "Find the wave speed on the string, v = √(F_T ÷ μ).",
    "Find the frequency of the harmonic being played, fₙ = nv ÷ (2L), using the string’s length.",
    "Set the pipe’s fundamental equal to that frequency and solve for the pipe length: L = 343 ÷ (2f) for an open pipe, L = 343 ÷ (4f) for a closed one."
   ],
   example: {
    prompt: "A string 0.5 m long with μ = 0.01 kg/m and tension 256 N plays its 1st harmonic. How long is an open pipe with the same fundamental?",
    steps: [
     "v = √(256 ÷ 0.01) = √25600 = 160 m/s.",
     "f₁ = 160 ÷ (2 × 0.5) = 160 Hz.",
     "The open pipe needs 343 ÷ (2L) = 160, so L = 343 ÷ 320 ≈ 1.072 m."
    ],
    answer: "About 1.072 m."
   },
   pitfalls: [
    "Using the string’s wave speed inside the pipe. The pipe holds sound in air, at 343 m/s.",
    "Matching wavelengths instead of frequencies. The same note has a different wavelength on the string and in the air.",
    "Using the closed-pipe rule for an open pipe, or the other way round; the two lengths differ by a factor of 2."
   ]
  },
  guidance: [
   { prompt: "The tension is 200 N and μ = 0.005 kg/m. What is the wave speed on the string, in m/s?", answer: [200], labels: ["string wave speed (m/s)"], explanation: "v = √(200 ÷ 0.005) = √40000 = 200 m/s." },
   { prompt: "The string is 0.8 m long and plays its 2nd harmonic. What is the frequency nv ÷ (2L), in Hz?", answer: [250], labels: ["frequency of the note (Hz)"], explanation: "f = 2 × 200 ÷ 1.6 = 250 Hz." },
   { prompt: "A pipe closed at one end has fundamental 343 ÷ (4L). What length gives 250 Hz, in metres to 3 decimal places?", answer: [0.343], labels: ["pipe length (m)"], explanation: "L = 343 ÷ (4 × 250) = 343 ÷ 1000 = 0.343 m." }
  ]
 },
 {
  id: 'q18', title: "Tuning by beats", topic: "Beats", tier: 'Intermediate', sector: 'Rover Track',
  brief: "The siren tower’s horns must be tuned to a reference fork, and the only tool out on the track is a pair of ears.",
  lesson: "Two sounds of nearby frequencies make beats, a swelling and fading of loudness at the beat frequency f_beat = |f₁ − f₂|.",
  prompt: "Mira tunes the hall’s organ against a reference fork of 440 Hz. One pipe sounds at 443.5 Hz. Enter the beat frequency in Hz you hear when the fork and that pipe sound together, then the number of beats you hear in 4 s. A second pipe, sounded with the same fork, gives 2 beats per second, and its pitch is known to be lower than the fork’s. Enter that second pipe’s frequency in Hz.",
  answer: [3.5,14,438], labels: ["beat frequency (Hz)","number of beats","second pipe’s frequency (Hz)"], tolerance: 0.01,
  hints: [
   "Two notes close in frequency drift in and out of step, so the sound swells and fades. The number of swells each second is the beat frequency, f_beat = |f₁ − f₂|: the difference, taken as positive.",
   "The number of beats in a stretch of time is the beat frequency times the time. A beat frequency says only how far apart two notes are; you need to know which one is higher to find the unknown note."
  ],
  solution: "f_beat = |440 − 443.5| = 3.5 Hz. In 4 s that is 3.5 × 4 = 14 beats. The second pipe is 2 Hz away from 440 Hz and lower, so it sounds at 440 − 2 = 438 Hz.",
  xp: 150, prereqs: ["q12"],
  sources: [source.s17_6],
  teaching: {
   intuition: "Play two notes that are almost the same and listen: the sound swells and fades, over and over. This throb is called beats. It is superposition at work. The two waves start in step and add up to a loud sound, then one slowly gets ahead until they are half a cycle apart and cancel, then they come back into step. The number of loud swells each second is the beat frequency, f_beat = |f₁ − f₂|: the difference of the two frequencies, taken as positive. The closer the notes, the slower the beats, and when the beats stop the notes are in tune. That is how instruments are tuned. A beat frequency tells you only how far apart the two notes are, not which is higher.",
   steps: [
    "Subtract the two frequencies and drop any minus sign: that is the beat frequency in Hz, beats per second.",
    "To count beats over a stretch of time, multiply the beat frequency by the time in seconds.",
    "To find an unknown note from its beats with a known one, add or subtract the beat frequency, using what you know about which note is higher."
   ],
   example: {
    prompt: "A 256 Hz fork and a horn at 259 Hz sound together. How many beats are heard each second, and in 5 s?",
    steps: [
     "|256 − 259| = 3, so the beat frequency is 3 Hz.",
     "In 5 s that is 3 × 5 = 15 beats."
    ],
    answer: "3 beats per second, 15 beats in 5 s."
   },
   pitfalls: [
    "Adding the frequencies instead of subtracting. The beats come from the difference.",
    "Keeping a negative beat frequency. It counts swells per second, so it is always positive.",
    "Guessing the unknown note from the beats alone. It could be above or below by the beat frequency; you need to know which."
   ]
  },
  guidance: [
   { prompt: "The fork is 440 Hz and the pipe 443.5 Hz. What is the beat frequency |f₁ − f₂|, in Hz?", answer: [3.5], labels: ["beat frequency (Hz)"], explanation: "440 − 443.5 = −3.5, and as a positive number that is 3.5 Hz: the sound swells 3.5 times a second." },
   { prompt: "How many beats are heard in 4 s at 3.5 beats per second?", answer: [14], labels: ["number of beats"], explanation: "3.5 × 4 = 14 beats." },
   { prompt: "The second pipe beats 2 times a second with the 440 Hz fork and is lower. What is its frequency, in Hz?", answer: [438], labels: ["second pipe’s frequency (Hz)"], explanation: "Its note is 2 Hz from the fork’s. It could be 438 Hz or 442 Hz; being lower, it is 438 Hz." }
  ]
 },
 {
  id: 'q19', title: "The siren coming and going", topic: "Doppler effect for a moving source", tier: 'Intermediate', sector: 'Rover Track',
  brief: "A rover’s siren changes pitch as it passes Mira on the track, and she wants to predict both notes.",
  lesson: "Doppler effect: a source moving towards a listener sounds higher, f_o = f_s × v ÷ (v − v_s); moving away it sounds lower, f_o = f_s × v ÷ (v + v_s).",
  prompt: "A rover drives along the track at 20 m/s with its siren sounding at 600 Hz. Mira stands still right at the edge of the track, so close to it that the rover’s motion counts as straight towards her and then straight away from her, and sound travels at 343 m/s. Enter the frequency she hears while the rover comes towards her, then the frequency she hears after it has passed and is moving away, both in Hz to 1 decimal place.",
  answer: [637.2,566.9], labels: ["heard while approaching (Hz)","heard while moving away (Hz)"], tolerance: 0.01,
  hints: [
   "For a moving source and a listener standing still, the heard frequency is f_o = f_s × v ÷ (v ∓ v_s): use v − v_s while the source comes towards the listener, and v + v_s while it moves away.",
   "Coming towards her, the waves are squeezed together, so the note is higher than the siren’s own; moving away, it is lower. Check your two answers against that."
  ],
  solution: "Coming towards her: f_o = 600 × 343 ÷ (343 − 20) = 600 × 343 ÷ 323 ≈ 637.2 Hz. Moving away: f_o = 600 × 343 ÷ (343 + 20) = 600 × 343 ÷ 363 ≈ 566.9 Hz.",
  xp: 150, prereqs: ["q14"],
  sources: [source.s17_7],
  teaching: {
   intuition: "A siren sends out waves at its own frequency f_s. If the siren stands still, the crests spread out evenly. If it moves, it chases the waves it sends ahead and runs away from the ones behind. In front, the crests are squeezed closer together, so they reach a listener more often: the note sounds higher. Behind, they are spread out and the note sounds lower. This change of the heard frequency because of motion is the Doppler effect. For a source moving at v_s and a listener standing still, with sound speed v, the heard frequency is f_o = f_s × v ÷ (v − v_s) while the source comes towards the listener and f_o = f_s × v ÷ (v + v_s) while it moves away. The sound itself still travels at v; only its spacing changes.",
   steps: [
    "Note the siren’s own frequency f_s, its speed v_s and the speed of sound v (343 m/s).",
    "Coming towards the listener: f_o = f_s × v ÷ (v − v_s). The answer is higher than f_s.",
    "Moving away: f_o = f_s × v ÷ (v + v_s). The answer is lower than f_s."
   ],
   example: {
    prompt: "A 500 Hz siren moves at 30 m/s past a listener who stands still, with sound at 343 m/s. What does the listener hear before and after it passes?",
    steps: [
     "Approaching: 500 × 343 ÷ (343 − 30) = 500 × 343 ÷ 313 ≈ 547.9 Hz.",
     "Moving away: 500 × 343 ÷ (343 + 30) = 500 × 343 ÷ 373 ≈ 459.8 Hz."
    ],
    answer: "About 547.9 Hz, then about 459.8 Hz."
   },
   pitfalls: [
    "Using v + v_s on the bottom while the source approaches. A squeezed wave has a higher frequency, so the bottom must shrink.",
    "Thinking the sound itself goes faster from a moving siren. Its speed in the air is still v; only the spacing of the crests changes.",
    "Rounding v ÷ (v − v_s) before multiplying by f_s, which can shift the last digit."
   ]
  },
  guidance: [
   { prompt: "While the rover comes towards Mira, the bottom of the formula is v − v_s. What is 343 − 20, in m/s?", answer: [323], labels: ["speed difference (m/s)"], explanation: "343 − 20 = 323 m/s. The siren chases its own waves at 20 m/s, so the waves in front of it bunch up." },
   { prompt: "What does Mira hear while the rover approaches, f_s × 343 ÷ 323, in Hz to 1 decimal place?", answer: [637.2], labels: ["heard while approaching (Hz)"], explanation: "600 × 343 ÷ 323 ≈ 637.2 Hz, higher than the siren’s 600 Hz." },
   { prompt: "After it passes, the bottom is v + v_s = 363 m/s. What does she hear then, in Hz to 1 decimal place?", answer: [566.9], labels: ["heard while moving away (Hz)"], explanation: "600 × 343 ÷ 363 ≈ 566.9 Hz, lower than the siren’s own note." }
  ]
 },
 {
  id: 'q20', title: "Riding towards the siren", topic: "Doppler effect for a moving listener, and both moving", tier: 'Intermediate', sector: 'Rover Track',
  brief: "Mira rides the track listening to the siren tower and to other rovers, and wants to know which notes she should hear.",
  lesson: "A moving listener hears f_o = f_s × (v ± v_o) ÷ v; with both moving, f_o = f_s × (v ± v_o) ÷ (v ∓ v_s), top signs for towards each other.",
  prompt: "The siren tower beside the track sounds at 750 Hz. Mira rides a rover at 14 m/s straight towards the tower, and sound travels at 343 m/s in the still air. Enter the frequency she hears, in Hz to 1 decimal place. Later a second rover carries a siren that also sounds at 750 Hz and drives at 22 m/s, while Mira still rides at 14 m/s. The two rovers are on the same straight track, moving towards each other. Enter the frequency Mira hears from the second siren, in Hz to 1 decimal place.",
  answer: [780.6,834.1], labels: ["heard from the tower (Hz)","heard from the second rover (Hz)"], tolerance: 0.01,
  hints: [
   "A moving listener meets the waves more often or less often: f_o = f_s × (v ± v_o) ÷ v, with + when moving towards the source and − when moving away.",
   "With both moving, f_o = f_s × (v ± v_o) ÷ (v ∓ v_s). Use the top signs (+ on top, − below) for towards each other and the bottom signs (− on top, + below) for apart."
  ],
  solution: "Mira moves towards a source that stands still, so f_o = 750 × (343 + 14) ÷ 343 = 750 × 357 ÷ 343 ≈ 780.6 Hz. With both rovers moving towards each other, f_o = 750 × (343 + 14) ÷ (343 − 22) = 750 × 357 ÷ 321 ≈ 834.1 Hz.",
  xp: 150, prereqs: ["q19"],
  sources: [source.s17_7],
  teaching: {
   intuition: "The Doppler effect also happens when the listener moves. The waves from a still siren are evenly spaced, but a listener moving towards it runs into the crests more often, so she hears a higher note; moving away, the crests catch her less often and the note is lower. The waves pass her at v + v_o or v − v_o instead of v, so the heard frequency is f_o = f_s × (v ± v_o) ÷ v, with + for towards and − for away. When source and listener both move, the two effects combine: f_o = f_s × (v ± v_o) ÷ (v ∓ v_s). The top signs, + above and − below, are for moving towards each other; the bottom signs, − above and + below, are for moving apart. Here “moving” always means moving through the still air.",
   steps: [
    "Decide who moves and in which direction: towards each other, or apart.",
    "Top of the formula: v + v_o if the listener moves towards the source, v − v_o if away, and just v if the listener stands still.",
    "Bottom of the formula: v − v_s if the source moves towards the listener, v + v_s if away, and just v if the source stands still.",
    "Multiply f_s by the top and divide by the bottom."
   ],
   example: {
    prompt: "A still 500 Hz siren is approached by a listener at 10 m/s. What does she hear? Then a 500 Hz siren at 20 m/s and the listener at 10 m/s move towards each other: what then?",
    steps: [
     "Listener only: 500 × (343 + 10) ÷ 343 = 500 × 353 ÷ 343 ≈ 514.6 Hz.",
     "Both towards each other: 500 × (343 + 10) ÷ (343 − 20) = 500 × 353 ÷ 323 ≈ 546.4 Hz."
    ],
    answer: "About 514.6 Hz, then about 546.4 Hz."
   },
   pitfalls: [
    "Putting the listener’s speed on the bottom. The listener’s speed changes the top; the source’s speed changes the bottom.",
    "Mixing the signs for both moving. Towards each other both changes raise the note: + on top and − below.",
    "Thinking only the speed between the two rovers matters. A moving listener and a moving source change the note by different amounts."
   ]
  },
  guidance: [
   { prompt: "Mira moves towards the tower at 14 m/s. What is the top of the formula, 343 + 14, in m/s?", answer: [357], labels: ["top of the formula (m/s)"], explanation: "343 + 14 = 357 m/s: the speed at which the waves pass her." },
   { prompt: "What frequency does she hear from the tower, 750 × 357 ÷ 343, in Hz to 1 decimal place?", answer: [780.6], labels: ["heard from the tower (Hz)"], explanation: "750 × 357 ÷ 343 ≈ 780.6 Hz, higher than the tower’s 750 Hz." },
   { prompt: "Now both rovers move towards each other: f_o = 750 × (343 + 14) ÷ (343 − 22). What is it, in Hz to 1 decimal place?", answer: [834.1], labels: ["heard from the second rover (Hz)"], explanation: "750 × 357 ÷ 321 ≈ 834.1 Hz." }
  ]
 }
);
})();
