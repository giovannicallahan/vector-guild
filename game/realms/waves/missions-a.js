/* Waves: sound and light missions, file a: q01–q10. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-a.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-a.js; drill statements: variants-a.js; oracles:
   qa/realms/waves/oracle-a.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q01  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · Period and frequency of a repeating motion [V1 15.1]
     q02  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · Mass on a spring: ω = √(k/m) and the period [V1 15.1]
     q03  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · x(t) = A cos(ωt + φ): position, greatest speed and acceleration [V1 15.1, 15.3]
     q04  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · Energy in simple harmonic motion [V1 15.2]
     q05  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · The simple pendulum [V1 15.4]
     q06  ch 1 Oscillations · Basic, 100 XP · sector 'Quake Station' · Damped and driven oscillations: decay and resonance [V1 15.5, 15.6]
     q07  ch 2 Travelling waves · Basic, 100 XP · sector 'Mast Cables' · Waves: wavelength, frequency and v = fλ [V1 16.1]
     q08  ch 2 Travelling waves · Basic, 100 XP · sector 'Mast Cables' · The wave function y = A sin(kx − ωt) [V1 16.2]
     q09  ch 2 Travelling waves · Basic, 100 XP · sector 'Mast Cables' · Wave speed on a stretched cable, v = √(T/μ) [V1 16.3]
     q10  ch 2 Travelling waves · Basic, 100 XP · sector 'Mast Cables' · Power of a wave and the inverse-square law [V1 16.4] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 (chapters 15–17) and Volume 3 (chapters 1–4) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 16.1 Traveling Waves
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s15_1: { title: "OpenStax University Physics Volume 1 — 15.1 Simple Harmonic Motion", url: "https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion", description: "Period, frequency and the hertz, simple harmonic motion of a mass on a spring with ω = √(k/m) and T = 2π√(m/k), x(t) = A cos(ωt + φ) with its phase shift, and the greatest speed Aω and acceleration Aω².", verified: '2026-11-28' },
 s15_2: { title: "OpenStax University Physics Volume 1 — 15.2 Energy in Simple Harmonic Motion", url: "https://openstax.org/books/university-physics-volume-1/pages/15-2-energy-in-simple-harmonic-motion", description: "The total energy ½kA² of a mass on a spring, conserved as ½kx² + ½mv², and the speed at any position.", verified: '2026-11-28' },
 s15_3: { title: "OpenStax University Physics Volume 1 — 15.3 Comparing Simple Harmonic Motion and Circular Motion", url: "https://openstax.org/books/university-physics-volume-1/pages/15-3-comparing-simple-harmonic-motion-and-circular-motion", description: "Simple harmonic motion as the shadow of uniform circular motion, with ω = 2πf and greatest speed Aω.", verified: '2026-11-28' },
 s15_4: { title: "OpenStax University Physics Volume 1 — 15.4 Pendulums", url: "https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums", description: "The simple pendulum: for small angles its period is 2π√(L/g), independent of the mass and the amplitude.", verified: '2026-11-28' },
 s15_5: { title: "OpenStax University Physics Volume 1 — 15.5 Damped Oscillations", url: "https://openstax.org/books/university-physics-volume-1/pages/15-5-damped-oscillations", description: "Damping with constant b: the amplitude decays as A₀e^(−bt/2m), and underdamped, critically damped and overdamped motion.", verified: '2026-11-28' },
 s15_6: { title: "OpenStax University Physics Volume 1 — 15.6 Forced Oscillations", url: "https://openstax.org/books/university-physics-volume-1/pages/15-6-forced-oscillations", description: "The natural frequency ω₀ = √(k/m), driven oscillations, and resonance when the driving frequency equals the natural frequency; less damping gives a taller, narrower peak.", verified: '2026-11-28' },
 s16_1: { title: "OpenStax University Physics Volume 1 — 16.1 Traveling Waves", url: "https://openstax.org/books/university-physics-volume-1/pages/16-1-traveling-waves", description: "Waves and their medium, transverse and longitudinal waves, wavelength, period, frequency and amplitude, and v = λ/T = fλ.", verified: '2026-11-28' },
 s16_2: { title: "OpenStax University Physics Volume 1 — 16.2 Mathematics of Waves", url: "https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves", description: "The wave function y(x, t) = A sin(kx − ωt + φ), the wave number k = 2π/λ, ω = 2π/T, v = ω/k, and the sign for the direction of travel.", verified: '2026-11-28' },
 s16_3: { title: "OpenStax University Physics Volume 1 — 16.3 Wave Speed on a Stretched String", url: "https://openstax.org/books/university-physics-volume-1/pages/16-3-wave-speed-on-a-stretched-string", description: "The linear mass density μ = m/L and the wave speed √(F_T/μ) on a string under tension.", verified: '2026-11-28' },
 s16_4: { title: "OpenStax University Physics Volume 1 — 16.4 Energy and Power of a Wave", url: "https://openstax.org/books/university-physics-volume-1/pages/16-4-energy-and-power-of-a-wave", description: "The average power ½μA²ω²v of a sinusoidal wave on a string, intensity as power per unit area, and I = P/(4πr²) for a spherical wave.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  id: 'q01', title: "The seismometer swing", topic: "Period and frequency", tier: 'Basic', sector: 'Quake Station',
  brief: "The new seismometer at the Quake Station needs its swing timed before Mira trusts its readings.",
  lesson: "An oscillation repeats itself: its period T is the time for one full cycle, in seconds, and its frequency f = 1/T is the number of cycles each second, in hertz.",
  prompt: "The seismometer arm at the Quake Station swings back and forth. Mira counts 12 full swings, each one out and back again, in 30 seconds. Enter the period of one swing in seconds, then the frequency in hertz (Hz), the number of swings per second.",
  answer: [2.5,0.4], labels: ["period (s)","frequency (Hz)"], tolerance: 0.005,
  hints: [
   "The period is the time for one full swing: share the total time equally between the swings.",
   "The frequency is the number of swings in each second. It is 1 divided by the period, f = 1/T."
  ],
  solution: "The period is the total time divided by the number of swings: T = 30 ÷ 12 = 2.5 s. The frequency is the number of swings per second: f = 12 ÷ 30 = 0.4 Hz. As a check, 1 ÷ T = 1 ÷ 2.5 = 0.4.",
  xp: 100, prereqs: [],
  artifact: {"name":"Swing timer","description":"A stopwatch and a tally: the first two numbers of every oscillation."},
  sources: [source.s15_1],
  teaching: {
   intuition: "Anything that moves back and forth over the same path again and again is an oscillation: a swinging arm, a mass on a spring, a plucked string. The middle point it swings about, where it would rest if left alone, is its equilibrium. One full cycle takes it from a point, out to one side, over to the other side and back to the same point moving the same way. The time one full cycle takes is the period, written T and measured in seconds. The number of full cycles in each second is the frequency, written f and measured in hertz (Hz): 1 Hz is one cycle per second. The two are reciprocals, f = 1/T, so a slow swing has a long period and a low frequency. How far the motion goes from equilibrium is its amplitude; for the swings in this chapter the period does not depend on it.",
   steps: [
    "Count the full cycles and note the total time they take.",
    "Divide the total time by the number of cycles: that is the period T, in seconds.",
    "Divide the number of cycles by the total time, or work out 1/T: that is the frequency f, in hertz."
   ],
   example: {
    prompt: "A spring toy makes 20 full bounces in 8 seconds. What are its period and its frequency?",
    steps: [
     "T = 8 ÷ 20 = 0.4 s.",
     "f = 20 ÷ 8 = 2.5 Hz, and 1 ÷ 0.4 = 2.5 agrees."
    ],
    answer: "A period of 0.4 s and a frequency of 2.5 Hz."
   },
   pitfalls: [
    "Dividing the wrong way round: the period is seconds per cycle and the frequency is cycles per second.",
    "Counting a half swing, out to one side only, as a full cycle.",
    "Thinking a bigger swing must take longer: the amplitude does not set the period here."
   ]
  },
  guidance: [
   { prompt: "12 full swings take 30 seconds, all the same length. How long does one swing take, in seconds?", answer: [2.5], labels: ["period (s)"], explanation: "Each swing takes the same time, so T = 30 ÷ 12 = 2.5 s." },
   { prompt: "One swing takes 2.5 s. How many swings happen in each second, in hertz?", answer: [0.4], labels: ["frequency (Hz)"], explanation: "f = 1 ÷ T = 1 ÷ 2.5 = 0.4 Hz, the same as 12 swings ÷ 30 seconds." }
  ]
 },
 {
  id: 'q02', title: "The spring under the seismometer", topic: "Mass on a spring", tier: 'Basic', sector: 'Quake Station',
  brief: "Mira wants to know how fast the seismometer mass bobs on its spring before she bolts it to the rock.",
  lesson: "A mass m on a spring of constant k moves in simple harmonic motion with angular frequency ω = √(k/m), in radians per second, and period T = 2π/ω.",
  prompt: "A seismometer mass of 0.8 kg hangs on a spring with spring constant k = 180 N/m. Pulled down and let go, it bobs up and down in simple harmonic motion. Enter the angular frequency ω = √(k/m) in radians per second, then the period T = 2π/ω in seconds, both to 2 decimal places.",
  answer: [15,0.42], labels: ["angular frequency ω (rad/s)","period (s)"], tolerance: 0.005,
  hints: [
   "Divide the spring constant by the mass, then take the square root: that is ω in radians per second.",
   "One full cycle is an angle of 2π radians, turned at ω radians per second, so the period is 2π divided by ω."
  ],
  solution: "ω = √(k/m) = √(180 ÷ 0.8) = 15.00 rad/s. One cycle is 2π radians, so T = 2π/ω = 2π ÷ 15 ≈ 0.42 s. The amplitude does not appear anywhere: a bigger pull gives the same period.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Tuned spring","description":"A spring and a mass whose period is fixed by k and m alone."},
  sources: [source.s15_1],
  teaching: {
   intuition: "From Mechanics you know Hooke’s law: a spring stretched or squashed by x pulls back with force F = −kx, where k is the spring constant in newtons per metre. A force that always points back towards equilibrium and grows in step with the distance from it gives simple harmonic motion: Newton’s second law makes the acceleration a = −(k/m)x, and the mass swings back and forth along a cosine curve. It is easiest to measure the rate of such a motion as an angle: one full cycle counts as 2π radians, and the angular frequency ω (omega) is how many radians pass each second. For a mass on a spring ω = √(k/m) radians per second: a stiffer spring speeds it up and a heavier mass slows it down. Since one cycle is 2π radians, the period is T = 2π/ω and the frequency is f = 1/T, so ω = 2πf. The amplitude appears nowhere in these rules.",
   steps: [
    "Write down the spring constant k in N/m and the mass m in kg.",
    "Work out ω = √(k/m), in radians per second.",
    "Work out the period T = 2π/ω, in seconds; if you need it, the frequency is f = 1/T."
   ],
   example: {
    prompt: "A 2 kg mass hangs on a spring with k = 50 N/m. Find ω and the period.",
    steps: [
     "ω = √(50 ÷ 2) = √25 = 5 rad/s.",
     "T = 2π ÷ 5 ≈ 1.26 s."
    ],
    answer: "ω = 5 rad/s and a period of about 1.26 s."
   },
   pitfalls: [
    "Taking √(m/k) instead of √(k/m) for ω: a heavier mass must give a smaller ω.",
    "Forgetting the 2π: ω is in radians per second, not cycles per second.",
    "Rounding ω first and then using the rounded value for the period, which can change the last digit."
   ]
  },
  guidance: [
   { prompt: "What is ω = √(k/m) for k = 180 N/m and m = 0.8 kg, in radians per second to 2 decimal places?", answer: [15], labels: ["angular frequency ω (rad/s)"], explanation: "180 ÷ 0.8 = 225, and its square root is = 15.00 rad/s." },
   { prompt: "One cycle is 2π radians. What is the period T = 2π/ω, in seconds to 2 decimal places?", answer: [0.42], labels: ["period (s)"], explanation: "T = 2π ÷ 15 ≈ 0.42 s." }
  ]
 },
 {
  id: 'q03', title: "Reading the trace", topic: "Position, speed and acceleration in simple harmonic motion", tier: 'Basic', sector: 'Quake Station',
  brief: "The seismometer pen draws a cosine trace, and Mira needs to read where the mass is and how hard it moves.",
  lesson: "In simple harmonic motion x(t) = A cos(ωt + φ); the greatest speed is Aω and the greatest acceleration is Aω².",
  prompt: "The seismometer mass moves as x(t) = 0.15 cos(4t + 0.6) metres, with t in seconds and the angle in radians. Enter its position x at t = 0.5 s, in metres to 3 decimal places, then its greatest speed in m/s, then its greatest acceleration in m/s².",
  answer: [-0.129,0.6,2.4], labels: ["position x (m)","greatest speed (m/s)","greatest acceleration (m/s²)"], tolerance: 0.0005,
  hints: [
   "Put t into ωt + φ first to get the phase in radians, take its cosine with the calculator in radian mode, and multiply by A.",
   "Differentiate x(t): the velocity is −Aω sin(ωt + φ) and the acceleration is −Aω² cos(ωt + φ). Sine and cosine are never bigger than 1 in size, so the greatest speed is Aω and the greatest acceleration is Aω²."
  ],
  solution: "The phase is ωt + φ = 4 × 0.5 + 0.6 = 2.6 rad, and cos 2.6 ≈ −0.8569, so x ≈ 0.15 × (−0.8569) ≈ −0.129 m. The greatest speed is Aω = 0.15 × 4 = 0.6 m/s, and the greatest acceleration is Aω² = 0.15 × 16 = 2.4 m/s².",
  xp: 100, prereqs: ["q02"],
  artifact: {"name":"Seismometer pen","description":"A pen that draws the cosine trace of the mass, phase and all."},
  sources: [source.s15_1, source.s15_3],
  teaching: {
   intuition: "Picture a peg going round a wheel of radius A at a steady ω radians per second, and look at its shadow on a wall: the shadow slides back and forth in simple harmonic motion. Its position from equilibrium is x(t) = A cos(ωt + φ). A is the amplitude, the furthest the mass gets from equilibrium. The angle ωt + φ, in radians, is the phase: it says how far through its cycle the motion is at time t. The phase shift φ (phi) is the phase at t = 0, so it fixes where the mass starts: with φ = 0 it starts at x = A. Use the calculator in radian mode for the cosine. Differentiating gives the velocity v(t) = −Aω sin(ωt + φ) and the acceleration a(t) = −Aω² cos(ωt + φ). Sine and cosine swing between −1 and 1, so the greatest speed is Aω, at equilibrium, and the greatest acceleration is Aω², at the ends of the swing.",
   steps: [
    "Put the time into the phase ωt + φ, in radians.",
    "Take the cosine of the phase in radian mode and multiply by A: that is x, in the units of A.",
    "The greatest speed is Aω and the greatest acceleration is Aω², from the derivatives of x(t)."
   ],
   example: {
    prompt: "A mass moves as x(t) = 0.1 cos(5t + 0.4) metres. Where is it at t = 0.2 s, and what are its greatest speed and acceleration?",
    steps: [
     "The phase is 5 × 0.2 + 0.4 = 1.4 rad, and cos 1.4 ≈ 0.1700, so x ≈ 0.017 m.",
     "Aω = 0.1 × 5 = 0.5 m/s and Aω² = 0.1 × 25 = 2.5 m/s²."
    ],
    answer: "x ≈ 0.017 m; greatest speed 0.5 m/s and greatest acceleration 2.5 m/s²."
   },
   pitfalls: [
    "Leaving the calculator in degree mode: every angle in this pack is in radians.",
    "Adding φ after taking the cosine, A cos(ωt) + φ, instead of inside it.",
    "Writing Aω for the greatest acceleration: differentiating twice brings out ω twice, Aω²."
   ]
  },
  guidance: [
   { prompt: "What is the phase ωt + φ at t = 0.5 s, in radians?", answer: [2.6], labels: ["phase (rad)"], explanation: "ωt + φ = 4 × 0.5 + 0.6 = 2.6 rad." },
   { prompt: "What is x = 0.15 cos(2.6), in metres to 3 decimal places?", answer: [-0.129], labels: ["position x (m)"], explanation: "In radian mode cos 2.6 ≈ −0.8569, and 0.15 × (−0.8569) ≈ −0.129 m." },
   { prompt: "The speed is Aω times the size of sin(ωt + φ), which is at most 1. What is the greatest speed, in m/s?", answer: [0.6], labels: ["greatest speed (m/s)"], explanation: "Aω = 0.15 × 4 = 0.6 m/s, reached each time the mass passes through equilibrium." },
   { prompt: "The acceleration is Aω² times the size of cos(ωt + φ). What is the greatest acceleration, in m/s²?", answer: [2.4], labels: ["greatest acceleration (m/s²)"], explanation: "Aω² = 0.15 × 16 = 2.4 m/s², reached at the two ends of the swing." }
  ]
 },
 {
  id: 'q04', title: "Energy in the swing", topic: "Energy in simple harmonic motion", tier: 'Basic', sector: 'Quake Station',
  brief: "Mira wants the energy stored in a seismometer swing and how fast the mass crosses a mark on its scale.",
  lesson: "With no friction the energy of a mass on a spring stays at E = ½kA²; at any point ½kx² + ½mv² = ½kA².",
  prompt: "A seismometer mass of 1.5 kg on a spring with k = 120 N/m oscillates with amplitude 0.25 m, with no friction. Enter the total energy of the motion in joules, then the speed of the mass, in m/s to 2 decimal places, as it passes the point x = 0.15 m from equilibrium.",
  answer: [3.75,1.79], labels: ["total energy (J)","speed (m/s)"], tolerance: 0.0005,
  hints: [
   "At the end of a swing the mass stops for an instant, so all the energy is stored in the spring: the total is ½kA².",
   "Energy is conserved: ½kx² + ½mv² = ½kA². Take the spring energy at x away from the total, and the rest is the kinetic energy ½mv²; solve that for v."
  ],
  solution: "E = ½kA² = ½ × 120 × 0.0625 = 3.75 J. At x = 0.15 m the spring holds ½kx² = ½ × 120 × 0.0225 = 1.35 J, so the kinetic energy is 3.75 − 1.35 = 2.4 J. Then ½mv² = 2.4 gives v = √(2 × 2.4 ÷ 1.5) ≈ 1.79 m/s.",
  xp: 100, prereqs: ["q03"],
  artifact: {"name":"Energy ledger","description":"Spring energy and kinetic energy, trading places while their sum stays put."},
  sources: [source.s15_2],
  teaching: {
   intuition: "A spring stretched by x stores potential energy ½kx², and a mass m moving at speed v has kinetic energy ½mv² (both from Mechanics). In simple harmonic motion with no friction energy just moves back and forth between the two, and their sum stays the same. At the ends of the swing, x = ±A, the mass stops for an instant, so the total is all spring energy: E = ½kA², in joules when k is in N/m and A in metres. At equilibrium, x = 0, it is all kinetic energy, and the mass is fastest. At any other point ½kx² + ½mv² = ½kA², so the kinetic energy is the total minus the spring energy there, and the speed follows from ½mv² = that kinetic energy.",
   steps: [
    "Find the total energy E = ½kA² from the amplitude.",
    "Find the spring energy ½kx² at the point you care about.",
    "Subtract to get the kinetic energy there, then solve ½mv² = kinetic energy for v."
   ],
   example: {
    prompt: "A 0.5 kg mass on a spring with k = 200 N/m has amplitude 0.1 m. How fast is it at x = 0.06 m?",
    steps: [
     "E = ½ × 200 × 0.01 = 1 J.",
     "The spring holds ½ × 200 × 0.0036 = 0.36 J, so the kinetic energy is 0.64 J.",
     "v = √(2 × 0.64 ÷ 0.5) = √2.56 = 1.6 m/s."
    ],
    answer: "1.6 m/s, with a total energy of 1 J."
   },
   pitfalls: [
    "Using x instead of A in the total energy: the total is set by the amplitude.",
    "Subtracting the distances, A − x, instead of the energies, or forgetting to square them.",
    "Forgetting the ½ or the 2 when solving ½mv² for v."
   ]
  },
  guidance: [
   { prompt: "What is the total energy ½kA², in joules?", answer: [3.75], labels: ["total energy (J)"], explanation: "½ × 120 × 0.25² = ½ × 120 × 0.0625 = 3.75 J." },
   { prompt: "What energy is stored in the spring at x = 0.15 m, ½kx², in joules?", answer: [1.35], labels: ["spring energy (J)"], explanation: "½ × 120 × 0.0225 = 1.35 J." },
   { prompt: "What kinetic energy is left for the mass at that point, in joules?", answer: [2.4], labels: ["kinetic energy (J)"], explanation: "The total stays the same, so the kinetic energy is 3.75 − 1.35 = 2.4 J." },
   { prompt: "Solve ½mv² = that kinetic energy for the speed v, in m/s to 2 decimal places.", answer: [1.79], labels: ["speed (m/s)"], explanation: "v = √(2 × 2.4 ÷ 1.5) ≈ 1.79 m/s." }
  ]
 },
 {
  id: 'q05', title: "The pendulum clock", topic: "The simple pendulum", tier: 'Basic', sector: 'Quake Station',
  brief: "The Quake Station clock is a pendulum, and Mira needs one cord timed and another cut to length.",
  lesson: "For small swings a simple pendulum of length L has period T = 2π√(L/g), whatever the mass of its bob.",
  prompt: "Mira hangs a small heavy bob on a light cord 1.2 m long as a simple pendulum, and lets it swing through a small angle. Take g = 9.8 m/s². Enter its period in seconds to 2 decimal places. Then enter the length in metres, to 3 decimal places, that a second pendulum needs for a period of 2.5 s.",
  answer: [2.2,1.551], labels: ["period (s)","length (m)"], tolerance: 0.0005,
  hints: [
   "For small swings the period of a simple pendulum is T = 2π√(L/g); the mass of the bob does not matter.",
   "For the length, turn the rule round: divide the period by 2π, square the result and multiply by g, so L = g(T/2π)²."
  ],
  solution: "T = 2π√(L/g) = 2π√(1.2 ÷ 9.8) ≈ 2.20 s. For a period of 2.5 s, L = g(T/2π)² = 9.8 × (2.5 ÷ 2π)² ≈ 1.551 m.",
  xp: 100, prereqs: ["q02"],
  artifact: {"name":"Pendulum clock","description":"A heavy bob on a light cord, keeping time by its length alone."},
  sources: [source.s15_4],
  teaching: {
   intuition: "A simple pendulum is a small heavy bob on a light cord of length L, swinging under gravity. When the bob is pulled aside, gravity pulls it back towards the lowest point, its equilibrium. For small angles (less than about 0.26 radians, or 15 degrees) this pull grows in step with the distance from the bottom, just like the spring force, so the bob moves in simple harmonic motion. The role of k/m is taken by g/L, so ω = √(g/L) and the period is T = 2π/ω = 2π√(L/g), with g = 9.8 m/s². The mass of the bob has cancelled out, and so has the amplitude: only the length sets the period. A longer pendulum swings more slowly. Turning the rule round gives the length for a wanted period: L = g(T/2π)².",
   steps: [
    "Check that the swing is small; then the period rule applies.",
    "For a period, work out T = 2π√(L/g), with L in metres and g = 9.8 m/s².",
    "For a length, divide the period by 2π, square it and multiply by g: L = g(T/2π)²."
   ],
   example: {
    prompt: "What is the period of a pendulum 2.45 m long, and how long must a pendulum be for a period of 1 s?",
    steps: [
     "2.45 ÷ 9.8 = 0.25 and √0.25 = 0.5, so T = 2π × 0.5 = π ≈ 3.14 s.",
     "For 1 s: (1 ÷ 2π)² ≈ 0.02533, and 9.8 × 0.02533 ≈ 0.248 m."
    ],
    answer: "About 3.14 s; a length of about 0.248 m."
   },
   pitfalls: [
    "Putting the mass of the bob into the rule: it does not appear.",
    "Taking √(g/L) for the period instead of 2π√(L/g).",
    "Forgetting to square T/2π when solving for the length."
   ]
  },
  guidance: [
   { prompt: "What is the period 2π√(L/g) of the 1.2 m pendulum, in seconds to 2 decimal places?", answer: [2.2], labels: ["period (s)"], explanation: "1.2 ÷ 9.8 ≈ 0.1224, its square root is about 0.3499, and 2π times that is about 2.20 s." },
   { prompt: "What length L = g(T/2π)² gives a period of 2.5 s, in metres to 3 decimal places?", answer: [1.551], labels: ["length (m)"], explanation: "Divide 2.5 by 2π, square the result and multiply by 9.8: L = 9.8 × (2.5 ÷ 2π)² ≈ 1.551 m." }
  ]
 },
 {
  id: 'q06', title: "Calming the tremor arm", topic: "Damped and driven oscillations", tier: 'Basic', sector: 'Quake Station',
  brief: "A seismometer that rings on after every tremor is no use, so Mira has fitted an oil damper and wants to know what it does.",
  lesson: "Damping makes the amplitude shrink as A₀e^(−bt/2m); a driving force at the natural frequency f₀ = √(k/m) ÷ 2π gives resonance, the largest swing.",
  prompt: "A 2 kg seismometer mass on a spring with k = 50 N/m is slowed by an oil damper with damping constant b = 0.6 kg/s. It is pulled 8 cm from equilibrium and let go, and its amplitude shrinks as A(t) = A₀e^(−bt/2m), where A₀ is the starting amplitude. Enter the amplitude after 5 s, in cm to 2 decimal places. Then the ground shakes it at different frequencies. Enter, in hertz to 2 decimal places, the driving frequency that makes it swing hardest; the damping is light, so take that to be the natural frequency f₀ = √(k/m) ÷ 2π.",
  answer: [3.78,0.8], labels: ["amplitude (cm)","driving frequency (Hz)"], tolerance: 0.005,
  hints: [
   "Work out the number bt/2m first, with b in kg/s, t in seconds and m in kilograms; then multiply A₀ by e to the power of minus that number.",
   "Resonance happens when the drive matches the natural frequency. Find ω₀ = √(k/m) in radians per second and divide by 2π to turn it into hertz."
  ],
  solution: "bt/2m = 0.6 × 5 ÷ (2 × 2) = 0.75, so A = 8e^(−0.75) ≈ 3.78 cm. The natural angular frequency is ω₀ = √(50 ÷ 2) = 5 rad/s, so f₀ = ω₀ ÷ 2π ≈ 0.80 Hz. Driving it at this frequency gives resonance, the largest swing.",
  xp: 100, prereqs: ["q04"],
  artifact: {"name":"Oil damper","description":"A piston in oil that drains the energy of every swing."},
  sources: [source.s15_5, source.s15_6],
  teaching: {
   intuition: "A real spring does not swing for ever: friction or a damper takes energy away. A damper whose force is −bv, against the velocity and in step with the speed, is described by a damping constant b, in kg/s. With light damping the mass still swings at nearly its old rate, but its amplitude dies away exponentially: A(t) = A₀e^(−bt/2m), where A₀ is the starting amplitude and e ≈ 2.718 is the base of natural logarithms. Without damping or any push, the system swings at its natural frequency, ω₀ = √(k/m) in radians per second, or f₀ = ω₀ ÷ 2π in hertz. Now let an outside force, such as the shaking ground, drive it back and forth at some driving frequency. The swing it settles into is small for most driving frequencies, and largest when the drive matches the natural frequency. That is resonance. Less damping makes the resonance peak taller and narrower.",
   steps: [
    "Work out the number bt/2m, with b in kg/s, t in seconds and m in kilograms.",
    "Multiply the starting amplitude by e^(−bt/2m) to get the amplitude at time t.",
    "For resonance, find ω₀ = √(k/m) and divide by 2π to get the natural frequency in hertz."
   ],
   example: {
    prompt: "A 1 kg mass on a spring with k = 100 N/m has damping constant 0.2 kg/s and starts 10 cm from equilibrium. What is its amplitude after 10 s, and at what frequency does it resonate?",
    steps: [
     "bt/2m = 0.2 × 10 ÷ 2 = 1, so A = 10e^(−1) ≈ 3.68 cm.",
     "ω₀ = √100 = 10 rad/s, so f₀ = 10 ÷ 2π ≈ 1.59 Hz."
    ],
    answer: "About 3.68 cm after 10 s; resonance at about 1.59 Hz."
   },
   pitfalls: [
    "Subtracting a fixed amount each second: damping takes away a fixed fraction, so the decay is exponential.",
    "Leaving out the 2 in bt/2m.",
    "Giving the natural frequency in radians per second when hertz are asked for: divide ω₀ by 2π."
   ]
  },
  guidance: [
   { prompt: "What is the number bt/2m after 5 s?", answer: [0.75], labels: ["bt/2m"], explanation: "0.6 × 5 ÷ (2 × 2) = 0.75. It has no unit: kg/s times s divided by kg." },
   { prompt: "What is the amplitude A₀e^(−bt/2m) after 5 s, in cm to 2 decimal places?", answer: [3.78], labels: ["amplitude (cm)"], explanation: "e^(−0.75) ≈ 0.4724, and 8 × 0.4724 ≈ 3.78 cm." },
   { prompt: "What is the natural frequency f₀ = √(k/m) ÷ 2π, in hertz to 2 decimal places?", answer: [0.8], labels: ["natural frequency (Hz)"], explanation: "√(50 ÷ 2) = 5 rad/s, and dividing by 2π gives about 0.80 Hz." }
  ]
 },
 {
  id: 'q07', title: "Pulses on the guy cable", topic: "Wavelength, frequency and wave speed", tier: 'Basic', sector: 'Mast Cables',
  brief: "Mira is testing the guy cables of the comms mast by sending waves up them, and needs their speed and spacing.",
  lesson: "A wave carries a disturbance through a medium; its speed is its wavelength times its frequency, v = fλ.",
  prompt: "Mira shakes the bottom of a mast guy cable up and down 4 times a second, and a transverse wave runs up it. Its crests are 2.5 m apart. Enter the wave speed in m/s. Then she shakes it at 6 Hz instead; the cable carries every wave at the same speed. Enter the new wavelength in metres, to 2 decimal places.",
  answer: [10,1.67], labels: ["wave speed (m/s)","new wavelength (m)"], tolerance: 0.005,
  hints: [
   "In one period the wave moves forward one wavelength, so its speed is the wavelength times the frequency: v = fλ.",
   "With the speed fixed by the cable, the wavelength is the speed divided by the new frequency: λ = v ÷ f."
  ],
  solution: "v = fλ = 4 × 2.5 = 10 m/s. At 6 Hz the speed is still 10 m/s, so λ = v ÷ f = 10 ÷ 6 ≈ 1.67 m.",
  xp: 100, prereqs: ["q01"],
  artifact: {"name":"Cable shaker","description":"A handle at the foot of the mast that sends waves of any frequency up a guy cable."},
  sources: [source.s16_1],
  teaching: {
   intuition: "A wave is a disturbance that travels from where it was made, carrying energy but not the material itself: each bit of a cable only wobbles about its own resting place while the shape runs along. The material the wave travels through is its medium, here the cable, for sound usually the air. In a transverse wave the medium moves at right angles to the way the wave travels, like a cable shaken sideways; in a longitudinal wave it moves along that direction, like a spring pushed in and out at one end. Each point of the medium oscillates, so the wave has a period T, a frequency f = 1/T and an amplitude, just as in the last chapter. The wavelength λ (lambda) is the length of one full wave, from one crest to the next. In one period the wave moves on by one wavelength, so the wave speed is v = λ/T = fλ. On a given cable the speed is fixed, so a higher frequency means a shorter wavelength.",
   steps: [
    "Read the frequency f in hertz and the wavelength λ in metres.",
    "Multiply them: the wave speed is v = fλ, in m/s.",
    "For a new frequency in the same medium, keep v and divide: λ = v ÷ f."
   ],
   example: {
    prompt: "A wave of 50 Hz has wavelength 0.4 m. What is its speed, and its wavelength at 80 Hz on the same cable?",
    steps: [
     "v = 50 × 0.4 = 20 m/s.",
     "λ = 20 ÷ 80 = 0.25 m."
    ],
    answer: "20 m/s; a wavelength of 0.25 m at 80 Hz."
   },
   pitfalls: [
    "Thinking a higher frequency makes a wave faster: on the same cable it only makes the wavelength shorter.",
    "Dividing f by λ instead of multiplying them.",
    "Confusing the speed of the wave along the cable with the speed of the cable moving sideways."
   ]
  },
  guidance: [
   { prompt: "A wave of frequency 4 Hz has wavelength 2.5 m. What is its speed, in m/s?", answer: [10], labels: ["wave speed (m/s)"], explanation: "Each second 4 wavelengths of 2.5 m pass, so v = 4 × 2.5 = 10 m/s." },
   { prompt: "The speed stays 10 m/s. What is the wavelength at 6 Hz, in metres to 2 decimal places?", answer: [1.67], labels: ["new wavelength (m)"], explanation: "λ = 10 ÷ 6 ≈ 1.67 m." }
  ]
 },
 {
  id: 'q08', title: "The wave function", topic: "The wave function of a sine wave", tier: 'Basic', sector: 'Mast Cables',
  brief: "The strain gauges on the mast need a formula that gives the height of the cable at every place and time.",
  lesson: "A sine wave moving in the +x direction is y(x, t) = A sin(kx − ωt), with wave number k = 2π/λ and angular frequency ω = 2πf.",
  prompt: "A wave runs up a mast cable in the +x direction. Its wave function is y(x, t) = A sin(kx − ωt), with amplitude A = 4 cm, wavelength 1.6 m and frequency 2.5 Hz; x is in metres and t in seconds. Enter the wave number k in rad/m and the angular frequency ω in rad/s, both to 3 decimal places, then the displacement y in cm, to 2 decimal places, of the point x = 0.5 m at t = 0.3 s.",
  answer: [3.927,15.708,-1.53], labels: ["wave number k (rad/m)","angular frequency ω (rad/s)","displacement y (cm)"], tolerance: 0.0005,
  hints: [
   "The wave number is k = 2π/λ and the angular frequency is ω = 2πf: each turns a length or a time into an angle in radians.",
   "Work out kx − ωt in radians (it may be negative), take its sine with the calculator in radian mode, and multiply by A."
  ],
  solution: "k = 2π ÷ 1.6 ≈ 3.927 rad/m and ω = 2π × 2.5 ≈ 15.708 rad/s. Then kx − ωt ≈ 3.9270 × 0.5 − 15.7080 × 0.3 ≈ −2.7489 rad, and y = 4 sin(−2.7489) ≈ −1.53 cm.",
  xp: 100, prereqs: ["q07","q03"],
  artifact: {"name":"Strain gauge","description":"A gauge that reads the wave function at one point of the cable."},
  sources: [source.s16_2],
  teaching: {
   intuition: "A snapshot of a sine wave along a cable is a sine curve in x; watching one point over time gives simple harmonic motion in t. The wave function y(x, t) = A sin(kx − ωt) holds both. y is the sideways displacement of the cable at position x and time t, and A is the amplitude. The wave number k = 2π/λ, in radians per metre, turns a distance along the cable into an angle: one wavelength is 2π radians. The angular frequency ω = 2πf, in radians per second, does the same for time. The minus sign means the wave travels in the +x direction (kx + ωt would travel the other way). The whole angle kx − ωt is the phase, in radians, and the speed is v = ω/k, which is the same as fλ.",
   steps: [
    "Find the wave number k = 2π/λ and the angular frequency ω = 2πf.",
    "Put the position and time into the phase kx − ωt, in radians.",
    "Take the sine of the phase in radian mode and multiply by A to get the displacement y."
   ],
   example: {
    prompt: "A wave has A = 5 cm, λ = 2 m and f = 1 Hz. Find k, ω and y at x = 0.25 m, t = 0.5 s.",
    steps: [
     "k = 2π ÷ 2 = π ≈ 3.142 rad/m and ω = 2π ≈ 6.283 rad/s.",
     "kx − ωt ≈ 0.7854 − 3.1416 = −2.3562 rad, and 5 sin(−2.3562) ≈ −3.54 cm."
    ],
    answer: "k ≈ 3.142 rad/m, ω ≈ 6.283 rad/s, y ≈ −3.54 cm."
   },
   pitfalls: [
    "Using k = λ/2π or ω = f instead of k = 2π/λ and ω = 2πf.",
    "Taking the sine in degree mode.",
    "Dropping the minus sign of a negative phase, which flips the sign of y."
   ]
  },
  guidance: [
   { prompt: "What is the wave number k = 2π/λ for λ = 1.6 m, in rad/m to 3 decimal places?", answer: [3.927], labels: ["wave number k (rad/m)"], explanation: "k = 2π ÷ 1.6 ≈ 3.927 rad/m: the phase changes by that much for every metre along the cable." },
   { prompt: "What is the angular frequency ω = 2πf for f = 2.5 Hz, in rad/s to 3 decimal places?", answer: [15.708], labels: ["angular frequency ω (rad/s)"], explanation: "ω = 2π × 2.5 ≈ 15.708 rad/s." },
   { prompt: "What is y = 4 sin(kx − ωt) at x = 0.5 m and t = 0.3 s, in cm to 2 decimal places?", answer: [-1.53], labels: ["displacement y (cm)"], explanation: "kx − ωt ≈ −2.7489 rad, its sine is about −0.3827, and 4 times that is about −1.53 cm." }
  ]
 },
 {
  id: 'q09', title: "Tension on the guy line", topic: "Wave speed on a stretched cable", tier: 'Basic', sector: 'Mast Cables',
  brief: "Mira tunes the guy lines by their tension, and needs to know how fast a pulse runs along one and how tight to make it.",
  lesson: "A wave on a stretched cable travels at v = √(F_T/μ), where F_T is the tension and μ = mass ÷ length is the linear mass density.",
  prompt: "A guy cable on the comms mast is 20 m long and has a mass of 0.6 kg. It is pulled tight with a tension of 150 N. Enter its linear mass density in kg/m, then the speed of a wave pulse along it in m/s to 2 decimal places. Then enter the tension, in newtons, that would make pulses travel at 80 m/s.",
  answer: [0.03,70.71,192], labels: ["linear mass density (kg/m)","wave speed (m/s)","tension (N)"], tolerance: 0.0005,
  hints: [
   "The linear mass density is μ = mass ÷ length, in kg/m. The wave speed is v = √(F_T/μ), with the tension F_T in newtons.",
   "To reach a chosen speed, square both sides of v = √(F_T/μ) and solve for the tension: F_T = μv²."
  ],
  solution: "μ = 0.6 ÷ 20 = 0.03 kg/m. The speed is v = √(F_T/μ) = √(150 ÷ 0.03) ≈ 70.71 m/s. For pulses at 80 m/s the tension must be F_T = μv² = 0.03 × 6400 = 192 N.",
  xp: 100, prereqs: ["q07"],
  artifact: {"name":"Tension gauge","description":"A clamp-on meter that turns the pull on a cable into the speed of its waves."},
  sources: [source.s16_3],
  teaching: {
   intuition: "How fast a wave runs along a cable is set by the cable, not by the hand that shakes it. Two things matter. The tension F_T, the pull along the cable in newtons, is what drags each bit back into line: more tension, faster waves. The linear mass density μ (mu), the mass of each metre of cable, μ = mass ÷ length in kg/m, is what resists being moved: a heavier cable carries slower waves. Together they give v = √(F_T/μ), in m/s. Frequency and amplitude do not appear: on one cable at one tension every wave goes at the same speed, which is why v = fλ then fixes λ for each frequency. Squaring both sides gives the tension for a wanted speed: F_T = μv².",
   steps: [
    "Find the linear mass density μ = mass ÷ length, in kg/m.",
    "Work out the wave speed v = √(F_T/μ), with the tension in newtons.",
    "For a wanted speed, square it and multiply by μ: F_T = μv²."
   ],
   example: {
    prompt: "A cable of 0.5 kg and 50 m is under 64 N. What is the wave speed, and what tension gives 100 m/s?",
    steps: [
     "μ = 0.5 ÷ 50 = 0.01 kg/m, and v = √(64 ÷ 0.01) = √6400 = 80 m/s.",
     "F_T = 0.01 × 100² = 100 N."
    ],
    answer: "80 m/s; 100 N for 100 m/s."
   },
   pitfalls: [
    "Using the whole mass of the cable instead of the mass per metre.",
    "Forgetting the square root: v = F_T/μ is far too big.",
    "Doubling the tension and expecting double the speed: the speed grows only as the square root."
   ]
  },
  guidance: [
   { prompt: "What is the linear mass density of 0.6 kg spread along 20 m, in kg/m?", answer: [0.03], labels: ["linear mass density (kg/m)"], explanation: "μ = 0.6 ÷ 20 = 0.03 kg/m." },
   { prompt: "What is the wave speed √(F_T/μ) with F_T = 150 N, in m/s to 2 decimal places?", answer: [70.71], labels: ["wave speed (m/s)"], explanation: "150 ÷ 0.03 = 5000, and its square root is ≈ 70.71 m/s." },
   { prompt: "What tension μv² gives a speed of 80 m/s, in newtons?", answer: [192], labels: ["tension (N)"], explanation: "F_T = 0.03 × 80² = 0.03 × 6400 = 192 N." }
  ]
 },
 {
  id: 'q10', title: "Power up the mast", topic: "Power of a wave and the inverse-square law", tier: 'Basic', sector: 'Mast Cables',
  brief: "Mira wants to know how much power a driven cable carries and how loud the mast horn is by the time it reaches the huts.",
  lesson: "A sine wave on a cable carries average power P = ½μA²ω²v; a wave spreading evenly from a point has intensity I = P/(4πr²), which falls as 1/r².",
  prompt: "A wave on a mast cable with linear mass density 0.05 kg/m travels at 40 m/s. Mira drives it at 5 Hz with amplitude 2 cm. Enter the average power the wave carries, in watts to 2 decimal places, from P = ½μA²ω²v with the angular frequency ω = 2πf in rad/s and A in metres. Then a horn on the mast top sends sound out evenly in all directions, and its intensity is 0.8 W/m² at 5 m. Enter the intensity at 20 m from the horn, in W/m² to 3 decimal places.",
  answer: [0.39,0.05], labels: ["power (W)","intensity (W/m²)"], tolerance: 0.0005,
  hints: [
   "Change the amplitude to metres (divide by 100) and find ω = 2πf before you put the numbers into P = ½μA²ω²v.",
   "The same power spreads over a sphere of area 4πr², so the intensity falls as 1/r²: going twice as far divides it by 4."
  ],
  solution: "A = 2 cm = 0.02 m and ω = 2π × 5 ≈ 31.4159 rad/s, so P = ½ × 0.05 × 0.02² × 31.4159² × 40 ≈ 0.39 W. The horn is 20 ÷ 5 = 4 times as far away, so the intensity is divided by 4² = 16: I = 0.8 ÷ 16 = 0.050 W/m².",
  xp: 100, prereqs: ["q09"],
  artifact: {"name":"Horn on the mast","description":"A siren whose sound thins out over the square of the distance."},
  sources: [source.s16_4],
  teaching: {
   intuition: "A wave carries energy along with it, and the rate at which it carries energy is its power, in watts. For a sine wave on a cable the average power is P = ½μA²ω²v: μ is the linear mass density, A the amplitude in metres, ω = 2πf the angular frequency in radians per second (2π radians for every cycle) and v the wave speed. Double the amplitude or the frequency and the power goes up four times. A wave that spreads out in all directions from a point, like sound from a horn, shares its power over a sphere of area 4πr² at distance r. The power per square metre is its intensity, I = P/(4πr²) in W/m². So the intensity falls as 1/r², the inverse-square law: twice as far away the same power covers four times the area, and the intensity is a quarter.",
   steps: [
    "For a cable wave, change A to metres and find ω = 2πf, then work out P = ½μA²ω²v.",
    "For a point source, find how many times farther the new distance is.",
    "Divide the intensity by the square of that number: I₂ = I₁ × (r₁/r₂)²."
   ],
   example: {
    prompt: "A cable with μ = 0.1 kg/m carries waves at 50 m/s, driven at 10 Hz with amplitude 1 cm. A horn gives 2 W/m² at 3 m. Find the power and the intensity at 6 m.",
    steps: [
     "ω = 2π × 10 ≈ 62.83 rad/s, so P = ½ × 0.1 × 0.01² × 62.83² × 50 ≈ 0.99 W.",
     "6 m is twice as far, so I = 2 ÷ 4 = 0.5 W/m²."
    ],
    answer: "About 0.99 W; 0.5 W/m² at 6 m."
   },
   pitfalls: [
    "Leaving the amplitude in centimetres, which makes the power 10000 times too big.",
    "Using f in place of ω = 2πf.",
    "Dividing the intensity by the distance ratio instead of by its square."
   ]
  },
  guidance: [
   { prompt: "What is the average power ½μA²ω²v of the cable wave, in watts to 2 decimal places?", answer: [0.39], labels: ["power (W)"], explanation: "With A = 0.02 m and ω ≈ 31.4159 rad/s, ½ × 0.05 × 0.0004 × 986.96 × 40 ≈ 0.39 W." },
   { prompt: "How many times as far from the horn is 20 m as 5 m?", answer: [4], labels: ["times as far"], explanation: "20 ÷ 5 = 4." },
   { prompt: "What is the intensity there, in W/m² to 3 decimal places?", answer: [0.05], labels: ["intensity (W/m²)"], explanation: "The area the sound covers grows as r², so the intensity is 0.8 ÷ 4² = 0.8 ÷ 16 = 0.050 W/m²." }
  ]
 }
);
})();
