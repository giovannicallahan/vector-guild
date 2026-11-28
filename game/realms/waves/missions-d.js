/* Waves: sound and light missions, file d: q31–q40. Mission objects: docs/PACK-FORMAT.md §2 (every field), §2.1 (what the
   harness requires), §7 (answers). Generators: gen-d.js (build(canonical) reproduces the prompt, hints, solution
   and guidance here exactly); experiments: experiments-d.js; drill statements: variants-d.js; oracles:
   qa/realms/waves/oracle-d.js. One author per file. The missions of this file (id, chapter, tier and XP, sector):
     q31  ch 6 Interference of light · Advanced, 200 XP · sector 'Fringe Lab' · Fringes on a screen: the small-angle approximation, y = mλD/d [V3 3.2]
     q32  ch 6 Interference of light · Advanced, 200 XP · sector 'Fringe Lab' · Thin films: thickness for a bright or dark reflection [V3 3.4]
     q33  ch 6 Interference of light · Advanced, 200 XP · sector 'Fringe Lab' · The Michelson interferometer: counting fringes to measure distance [V3 3.5]
     q34  ch 6 Interference of light · Advanced, 200 XP · sector 'Fringe Lab' · Single-slit diffraction minima, a sin θ = mλ [V3 4.1]
     q35  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · Intensity in a single-slit pattern [V3 4.2]
     q36  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · Two slits with width: missing orders [V3 4.3]
     q37  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · Diffraction gratings [V3 4.4]
     q38  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · Circular apertures and the Rayleigh criterion, θ = 1.22λ/D [V3 4.5]
     q39  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · X-ray diffraction and Bragg's law, mλ = 2d sin θ [V3 4.6]
     q40  ch 7 Diffraction · Advanced, 200 XP · sector 'Crystal Observatory' · Realm review: identifying a lamp from its fringes; bridge to Electricity and magnetism [V3 3.2, 4.4] */
(function(){
'use strict';
/* OpenStax University Physics Volume 1 (chapters 15–17) and Volume 3 (chapters 1–4) sections, one entry per section the missions below cite. Open each page before you set `verified` to the
   date you saw it. Every mission needs at least one source whose title matches /OpenStax/ (OpenStax).
   A title reads like: OpenStax University Physics Volume 1 — 16.1 Traveling Waves
   Link to the section page itself: https://openstax.org/books/university-physics-volume-1/pages/<section-slug> */
const source = {
 s3_2: { title: "OpenStax University Physics Volume 3 — 3.2 Mathematics of Interference", url: "https://openstax.org/books/university-physics-volume-3/pages/3-2-mathematics-of-interference", description: "Path difference d sin θ, bright fringes at d sin θ = mλ, the small-angle approximation and fringe positions y = mλD ÷ d.", verified: '2026-11-28' },
 s3_4: { title: "OpenStax University Physics Volume 3 — 3.4 Interference in Thin Films", url: "https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films", description: "The half-wavelength phase change on reflection from a higher index, the wavelength λ ÷ n in a film, and film thicknesses for bright and dark reflection.", verified: '2026-11-28' },
 s3_5: { title: "OpenStax University Physics Volume 3 — 3.5 The Michelson Interferometer", url: "https://openstax.org/books/university-physics-volume-3/pages/3-5-the-michelson-interferometer", description: "The Michelson interferometer: moving a mirror by λ ÷ 2 shifts the pattern by one fringe, so Δd = mλ ÷ 2.", verified: '2026-11-28' },
 s4_1: { title: "OpenStax University Physics Volume 3 — 4.1 Single-Slit Diffraction", url: "https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction", description: "Diffraction by a single slit, its dark fringes at a sin θ = mλ, and its wide, bright central maximum.", verified: '2026-11-28' },
 s4_2: { title: "OpenStax University Physics Volume 3 — 4.2 Intensity in Single-Slit Diffraction", url: "https://openstax.org/books/university-physics-volume-3/pages/4-2-intensity-in-single-slit-diffraction", description: "The single-slit intensity I = I₀(sin β ÷ β)² with β = πa sin θ ÷ λ, and the dim secondary maxima.", verified: '2026-11-28' },
 s4_3: { title: "OpenStax University Physics Volume 3 — 4.3 Double-Slit Diffraction", url: "https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction", description: "Two slits of finite width: fringes at d sin θ = mλ dimmed by the single-slit pattern, and missing orders where a fringe meets a diffraction minimum.", verified: '2026-11-28' },
 s4_4: { title: "OpenStax University Physics Volume 3 — 4.4 Diffraction Gratings", url: "https://openstax.org/books/university-physics-volume-3/pages/4-4-diffraction-gratings", description: "Diffraction gratings: d sin θ = mλ with the spacing from the lines per unit length, and positions on a screen from tan θ.", verified: '2026-11-28' },
 s4_5: { title: "OpenStax University Physics Volume 3 — 4.5 Circular Apertures and Resolution", url: "https://openstax.org/books/university-physics-volume-3/pages/4-5-circular-apertures-and-resolution", description: "Diffraction by a round opening, the Rayleigh criterion θ = 1.22λ ÷ D, and the smallest resolvable separation, about distance × θ.", verified: '2026-11-28' },
 s4_6: { title: "OpenStax University Physics Volume 3 — 4.6 X-Ray Diffraction", url: "https://openstax.org/books/university-physics-volume-3/pages/4-6-x-ray-diffraction", description: "X-ray diffraction by crystal planes and Bragg’s law mλ = 2d sin θ, with θ measured from the planes.", verified: '2026-11-28' }
};
window.QUESTS = window.QUESTS || [];
window.QUESTS.push(
 {
  "id": "q31",
  "title": "Fringes on the lab wall",
  "topic": "Fringes on a screen and the small-angle approximation",
  "tier": "Advanced",
  "sector": "Fringe Lab",
  "brief": "The Fringe Lab wants to read wavelengths off a ruler on the wall, so it needs to know exactly where each bright fringe lands.",
  "lesson": "For small angles sin θ ≈ tan θ = y ÷ D, so the bright fringes of a double slit sit at y = mλD ÷ d, evenly spaced λD ÷ d apart.",
  "prompt": "In the Fringe Lab a lamp of wavelength 580 nm shines on two narrow slits 0.35 mm apart, and the fringes fall on a screen 1.6 m away. The angles are small, so use the small-angle approximation. Enter the distance from the centre of the pattern to the 3rd bright fringe on one side (order m = 3), in millimetres to 2 decimal places, then the spacing between neighbouring bright fringes, in millimetres to 2 decimal places.",
  "answer": [
   7.95,
   2.65
  ],
  "labels": [
   "fringe distance (mm)",
   "fringe spacing (mm)"
  ],
  "tolerance": 0.005,
  "hints": [
   "For small angles sin θ ≈ tan θ ≈ θ, and tan θ = y ÷ D, so d sin θ = mλ becomes y = mλD ÷ d.",
   "Put every length in metres first (1 nm = 10⁻⁹ m, 1 mm = 10⁻³ m), and turn the result back into millimetres. Neighbouring bright fringes differ in m by 1, so their spacing is λD ÷ d."
  ],
  "solution": "In metres, λ = 580 × 10⁻⁹ m and d = 0.35 × 10⁻³ m. The spacing of bright fringes is λD ÷ d = 580 × 10⁻⁹ × 1.6 ÷ (0.35 × 10⁻³) m. In millimetres (1 m = 1000 mm) that is 580 × 1.6 ÷ 0.35 ÷ 1000 ≈ 2.6514 mm, which is 2.65 mm to 2 decimal places. The 3rd bright fringe is m = 3 spacings from the centre: y = 3 × λD ÷ d ≈ 7.9543 mm, which is 7.95 mm to 2 decimal places.",
  "xp": 200,
  "prereqs": [
   "q30"
  ],
  "sources": [source.s3_2],
  "teaching": {
   "intuition": "Two slits send light to a screen, and bright fringes appear where the path difference d sin θ is a whole number of wavelengths, mλ. On a real lab wall we do not measure angles; we measure how far each fringe is from the centre of the pattern, along the screen. Call that distance y and the distance from the slits to the screen D. The fringe sits at an angle θ with tan θ = y ÷ D. In a double slit the angles are tiny, a few thousandths of a radian, and for angles that small sin θ, tan θ and θ itself are almost the same number. That is the small-angle approximation. Swapping sin θ for y ÷ D in d sin θ = mλ gives y = mλD ÷ d. Each step up in m adds the same amount, so the bright fringes are evenly spaced, λD ÷ d apart.",
   "steps": [
    "Write every length in metres: λ in nanometres times 10⁻⁹, d in millimetres times 10⁻³, D already in metres.",
    "The spacing between neighbouring bright fringes is λD ÷ d.",
    "The bright fringe of order m is m spacings from the centre: y = mλD ÷ d.",
    "Turn the answer back into millimetres (1 m = 1000 mm) and round only at the end."
   ],
   "example": {
    "prompt": "Light of 500 nm passes two slits 0.25 mm apart onto a screen 2 m away. How far from the centre is the bright fringe of order 2?",
    "steps": [
     "Spacing: λD ÷ d = 500 × 10⁻⁹ × 2 ÷ (0.25 × 10⁻³) = 0.004 m, which is 4 mm.",
     "Order 2 is two spacings out: y = 2 × 4 = 8 mm."
    ],
    "answer": "8 mm from the centre."
   },
   "pitfalls": [
    "Mixing units: λ in nanometres and d in millimetres must both be turned into metres before dividing.",
    "Counting the central fringe as order 1. The central bright fringe is m = 0, so the 3rd bright fringe out is three spacings from the centre.",
    "Using the small-angle approximation for large angles. It only works when y is much smaller than D."
   ]
  },
  "guidance": [
   {
    "prompt": "Work out the spacing λD ÷ d with λ = 580 nm, D = 1.6 m and d = 0.35 mm, all in metres first. What is it in millimetres, to 2 decimal places?",
    "answer": [
     2.65
    ],
    "labels": [
     "fringe spacing (mm)"
    ],
    "explanation": "580 × 10⁻⁹ × 1.6 ÷ (0.35 × 10⁻³) m is the same as 580 × 1.6 ÷ 0.35 ÷ 1000 mm, because the powers of ten leave 10⁻⁶ m, which is 0.001 mm. So λD ÷ d ≈ 2.6514 mm, which is 2.65 mm to 2 decimal places."
   },
   {
    "prompt": "The 3rd bright fringe sits m = 3 spacings from the centre. Multiply the unrounded spacing by 3: how far is it from the centre, in millimetres to 2 decimal places?",
    "answer": [
     7.95
    ],
    "labels": [
     "fringe distance (mm)"
    ],
    "explanation": "y = 3 × λD ÷ d ≈ 7.9543 mm, which is 7.95 mm to 2 decimal places. The bright fringes are evenly spaced because each one adds one wavelength to the path difference."
   }
  ]
 },
 {
  "id": "q32",
  "title": "Coating the lab windows",
  "topic": "Thin films: thickness for a bright or dark reflection",
  "tier": "Advanced",
  "sector": "Fringe Lab",
  "brief": "The Fringe Lab is coating its windows and lenses, and the coating must be just thick enough to kill, or to boost, one colour of reflection.",
  "lesson": "Count the half-wavelength shifts at the two surfaces of a thin film; then the extra path 2t must be half or a whole wavelength in the film, λ ÷ n.",
  "prompt": "Light of wavelength 560 nm in air falls straight down on a film of index n = 1.4 laid on glass (n = 1.52), with air above it. The lab wants the reflected light as dark as possible. Of the two reflections, off the top surface and off the bottom surface, enter how many pick up a half-wavelength shift; then the wavelength inside the film, in nanometres to 1 decimal place; then the smallest thickness above zero that gives a dark reflection, in nanometres to 1 decimal place.",
  "answer": [
   2,
   400,
   100
  ],
  "labels": [
   "shifted reflections",
   "wavelength in film (nm)",
   "thickness (nm)"
  ],
  "tolerance": 0.05,
  "hints": [
   "A reflection picks up a half-wavelength shift only where the light meets a material of higher index. Check the top surface and the bottom surface separately.",
   "Inside the film the wavelength is λ ÷ n. The light reflected off the bottom travels an extra 2t. With one shift, bright needs 2t to be half a film wavelength; with two shifts, bright needs 2t to be a whole film wavelength. Dark is the other way round."
  ],
  "solution": "The top surface goes from air (n = 1) to the higher n = 1.4, so it shifts; the bottom surface, film into glass, goes from n = 1.4 to the higher n = 1.52, so it shifts too. That is 2 shifts. Inside the film λn = 560 ÷ 1.4 = 400 nm. Here two shifts cancel each other, so a dark reflection needs the extra path 2t to be half a wavelength in the film: 2t = λn ÷ 2, so t = λn ÷ 4 = 100 nm.",
  "xp": 200,
  "prereqs": [
   "q31"
  ],
  "sources": [source.s3_4],
  "teaching": {
   "intuition": "A thin film is a layer of clear material about as thick as a wavelength of light, like a coating on a lens or a soap film. Light shining straight down reflects twice: once off the top surface and once off the bottom. The second reflection travels down through the film and back up, an extra path of 2t for a film of thickness t. Inside the film the light is slower, so its wavelength is shorter: λn = λ ÷ n, where n is the film’s index of refraction. There is one more twist. When light reflects off a material of higher index than the one it is in, the reflected wave flips over, which is the same as a half-wavelength shift. Off a lower index there is no shift. So first count the shifts. With one shift the two reflections already start half a wavelength apart, so an extra path of half a film wavelength brings them back in step and the reflection is bright. With two shifts they cancel each other out, and an extra path of a whole film wavelength is needed for bright. Dark is the other way round in each case.",
   "steps": [
    "At each surface compare the indices: a reflection going into a higher index gets a half-wavelength shift; into a lower index, none. Count the shifts: 1 or 2.",
    "Find the wavelength in the film: λn = λ ÷ n.",
    "With 1 shift: bright when 2t = λn ÷ 2, dark when 2t = λn. With 2 shifts: bright when 2t = λn, dark when 2t = λn ÷ 2. These are the smallest thicknesses above zero.",
    "Solve for t: it is λn ÷ 4 or λn ÷ 2."
   ],
   "example": {
    "prompt": "A free-standing film of index 1.25 in air is lit straight on by 600 nm light. What is its smallest thickness for a bright reflection?",
    "steps": [
     "Top: air into n = 1.25, higher, so a shift. Bottom: film into air, lower, so none. One shift.",
     "λn = 600 ÷ 1.25 = 480 nm.",
     "One shift and bright: 2t = λn ÷ 2, so t = 480 ÷ 4 = 120 nm."
    ],
    "answer": "120 nm."
   },
   "pitfalls": [
    "Using the wavelength in air instead of the wavelength in the film, λ ÷ n.",
    "Forgetting that the light crosses the film twice, so the extra path is 2t, not t.",
    "Giving every reflection a shift. Only a reflection into a higher index shifts."
   ]
  },
  "guidance": [
   {
    "prompt": "The top reflection is air into the film; the bottom one is film (n = 1.4) into glass (n = 1.52). How many of the two reflections pick up a half-wavelength shift?",
    "answer": [
     2
    ],
    "labels": [
     "shifted reflections"
    ],
    "explanation": "The top surface goes from n = 1 to n = 1.4, which is higher, so it shifts; the bottom surface, film into glass, goes from n = 1.4 to the higher n = 1.52, so it shifts too. That makes 2."
   },
   {
    "prompt": "What is the wavelength inside the film, λ ÷ n, in nanometres to 1 decimal place?",
    "answer": [
     400
    ],
    "labels": [
     "wavelength in film (nm)"
    ],
    "explanation": "λn = 560 ÷ 1.4 = 400 nm. Light slows down in the film, so its waves bunch up."
   },
   {
    "prompt": "With 2 shifts, should the extra path 2t be half a film wavelength or a whole one for a dark reflection? Find the smallest thickness above zero, in nanometres to 1 decimal place.",
    "answer": [
     100
    ],
    "labels": [
     "thickness (nm)"
    ],
    "explanation": "Here two shifts cancel each other, so a dark reflection needs the extra path 2t to be half a wavelength in the film: 2t = λn ÷ 2, so t = λn ÷ 4 = 100 nm."
   }
  ]
 },
 {
  "id": "q33",
  "title": "Counting fringes on the mirror arm",
  "topic": "The Michelson interferometer: counting fringes to measure distance",
  "tier": "Advanced",
  "sector": "Fringe Lab",
  "brief": "The Fringe Lab wants to measure how far a mirror creeps, by distances far smaller than anyone can see.",
  "lesson": "In a Michelson interferometer each fringe that passes means the mirror moved half a wavelength: Δd = mλ ÷ 2.",
  "prompt": "The Fringe Lab’s Michelson interferometer is lit by a lamp of wavelength 546 nm. As one mirror is slowly moved, 150 bright fringes pass the mark in the eyepiece. Enter how far the mirror moved, in micrometres (μm) to 3 decimal places. Then the mirror is moved 27.3 μm the other way: enter how many fringes pass the mark.",
  "answer": [
   40.95,
   100
  ],
  "labels": [
   "mirror shift (μm)",
   "fringes counted"
  ],
  "tolerance": 0.0005,
  "hints": [
   "Light goes to the moving mirror and back, so moving the mirror by Δd changes the path by 2Δd. One fringe passes for each wavelength of path change.",
   "So one fringe means the mirror moved λ ÷ 2, and m fringes mean Δd = mλ ÷ 2. 1 μm is 1000 nm."
  ],
  "solution": "One fringe passes for each change of one wavelength in the path, and the path changes by twice the mirror’s move, so one fringe is a move of λ ÷ 2 = 273 nm. 150 fringes: Δd = 150 × 273 = 40950 nm = 40.950 μm. Back the other way, 27.3 μm is 27300 nm, and 27300 ÷ 273 = 100 fringes.",
  "xp": 200,
  "prereqs": [
   "q32"
  ],
  "sources": [source.s3_5],
  "teaching": {
   "intuition": "An interferometer splits one beam of light into two, sends them along two different arms, and brings them back together so that they interfere. In a Michelson interferometer each arm ends in a mirror. Where the two beams arrive in step you see a bright fringe; half a wavelength out of step, a dark one. Now slide one mirror. The light in that arm goes to the mirror and back, so moving the mirror by Δd makes its path 2Δd longer. Every time the path grows by one whole wavelength, the pattern looks the same again, and one bright fringe has moved past a mark in the eyepiece. So one fringe means the mirror moved λ ÷ 2, and counting m fringes measures Δd = mλ ÷ 2. With visible light that is a few hundred nanometres per fringe, which is why the lab can measure lengths smaller than a wavelength.",
   "steps": [
    "One fringe passing means the path changed by λ, so the mirror moved λ ÷ 2.",
    "For m fringes: Δd = mλ ÷ 2.",
    "To go the other way, divide the mirror move by λ ÷ 2 to count the fringes: m = 2Δd ÷ λ.",
    "Keep units straight: 1 μm = 1000 nm."
   ],
   "example": {
    "prompt": "With 500 nm light, 40 fringes pass the mark. How far did the mirror move?",
    "steps": [
     "One fringe is λ ÷ 2 = 250 nm of mirror move.",
     "40 × 250 = 10000 nm, which is 10 μm."
    ],
    "answer": "10 μm."
   },
   "pitfalls": [
    "Taking one fringe as a move of a whole wavelength. The light goes there and back, so it is half a wavelength.",
    "Mixing nanometres and micrometres: 1 μm is 1000 nm, not 100."
   ]
  },
  "guidance": [
   {
    "prompt": "Moving the mirror by Δd changes the path by 2Δd, and one fringe passes per wavelength of path. How far does the mirror move while one fringe passes, in nanometres?",
    "answer": [
     273
    ],
    "labels": [
     "shift per fringe (nm)"
    ],
    "explanation": "2Δd = λ, so Δd = λ ÷ 2 = 546 ÷ 2 = 273 nm."
   },
   {
    "prompt": "150 fringes passed. How far did the mirror move, in micrometres to 3 decimal places?",
    "answer": [
     40.95
    ],
    "labels": [
     "mirror shift (μm)"
    ],
    "explanation": "150 × 273 nm = 40950 nm, and 1000 nm is 1 μm, so 40.950 μm."
   },
   {
    "prompt": "Now the mirror moves 27.3 μm. How many fringes pass?",
    "answer": [
     100
    ],
    "labels": [
     "fringes counted"
    ],
    "explanation": "27.3 μm = 27300 nm, and 27300 ÷ 273 = 100."
   }
  ]
 },
 {
  "id": "q34",
  "title": "One slit, one shadow",
  "topic": "Single-slit diffraction minima, a sin θ = mλ",
  "tier": "Advanced",
  "sector": "Fringe Lab",
  "brief": "A gap in a Fringe Lab shutter throws a striped shadow on the wall, and the crew want to know where its dark bands fall.",
  "lesson": "A single slit of width a makes dark fringes where a sin θ = mλ for m = 1, 2, 3 …; the central peak spans 2Dλ ÷ a on a far screen.",
  "prompt": "A single slit 40 μm wide in the Fringe Lab is lit by light of wavelength 620 nm, and the pattern falls on a screen 1.5 m away. Enter the angle of the dark fringe of order m = 2 from the straight-through direction, in radians to 4 decimal places. Then, using the small-angle approximation, enter the width of the central bright band (from the first dark fringe on one side to the first on the other), in millimetres to 2 decimal places.",
  "answer": [
   0.031,
   46.5
  ],
  "labels": [
   "angle of dark fringe (rad)",
   "central band width (mm)"
  ],
  "tolerance": 0.00005,
  "hints": [
   "Dark fringes of a single slit of width a are where a sin θ = mλ, for m = 1, 2, 3 and so on. Put a and λ in the same unit (1 μm = 1000 nm) before dividing.",
   "The first dark fringe (m = 1) is at sin θ = λ ÷ a. For a small angle its distance from the centre is y = D × λ ÷ a, and the central band reaches that far on both sides."
  ],
  "solution": "sin θ = mλ ÷ a = 2 × 620 ÷ 40000 = 0.031, so θ = arcsin of that ≈ 0.031 rad. The first dark fringe is y = Dλ ÷ a from the centre. In millimetres that is 1000 × 1.5 × 620 ÷ 40000 = 23.25 mm. The central band is twice that: 2Dλ ÷ a = 46.5 mm.",
  "xp": 200,
  "prereqs": [
   "q30"
  ],
  "sources": [source.s4_1],
  "teaching": {
   "intuition": "Diffraction is the spreading and bending of a wave as it passes through an opening or round an edge. Light through one narrow slit does not make a sharp bright line on the screen: it spreads into a wide bright band, the central peak, with dimmer bands beside it and dark fringes between them. The dark fringes come from interference inside the slit itself. Split the slit into a top half and a bottom half. In the direction where light from the top edge travels one whole wavelength further than light from the bottom edge, each point in the top half has a partner in the bottom half half a wavelength out of step, and all the pairs cancel. That direction satisfies a sin θ = λ, where a is the slit width. In general the dark fringes of a single slit sit at a sin θ = mλ, for m = 1, 2, 3 and so on; there is no dark fringe at m = 0, the straight-through direction. A narrower slit spreads the light more.",
   "steps": [
    "Put the slit width a and the wavelength λ in the same unit (1 μm = 1000 nm).",
    "For the dark fringe of order m: sin θ = mλ ÷ a, then θ = arcsin(mλ ÷ a), with your calculator in radians.",
    "For a far screen and small angles, the first dark fringe is y = Dλ ÷ a from the centre (the small-angle approximation of q31).",
    "The central peak runs from the first dark fringe on one side to the first on the other, so its width is 2Dλ ÷ a."
   ],
   "example": {
    "prompt": "A slit 25 μm wide is lit by 550 nm light, with a screen 2 m away. Find the angle of the first dark fringe and the width of the central peak.",
    "steps": [
     "sin θ = 550 ÷ 25000 = 0.022, so θ = arcsin(0.022) ≈ 0.0220 rad.",
     "Width = 2Dλ ÷ a = 2 × 2 × 550 ÷ 25000 m = 0.088 m, which is 88 mm."
    ],
    "answer": "About 0.0220 rad, and 88 mm."
   },
   "pitfalls": [
    "Using the double-slit rule for bright fringes. For a single slit, a sin θ = mλ gives the dark fringes.",
    "Taking the central peak as Dλ ÷ a wide. That is only half of it: the peak reaches the first dark fringe on both sides.",
    "Leaving a in micrometres and λ in nanometres when dividing."
   ]
  },
  "guidance": [
   {
    "prompt": "Dark fringe m = 2: sin θ = mλ ÷ a with λ = 620 nm and a = 40 μm = 40000 nm. What is θ, in radians to 4 decimal places?",
    "answer": [
     0.031
    ],
    "labels": [
     "angle (rad)"
    ],
    "explanation": "sin θ = 1240 ÷ 40000 = 0.031 and θ = arcsin of that ≈ 0.031 rad. For an angle this small θ and sin θ are almost equal."
   },
   {
    "prompt": "The first dark fringe (m = 1) is at y = Dλ ÷ a from the centre for small angles. How far is that, in millimetres to 2 decimal places?",
    "answer": [
     23.25
    ],
    "labels": [
     "distance to first dark fringe (mm)"
    ],
    "explanation": "y = 1.5 × 620 ÷ 40000 m, and in millimetres that is 1000 × 1.5 × 620 ÷ 40000 = 23.25 mm."
   },
   {
    "prompt": "The central band runs from the first dark fringe on one side to the first on the other. How wide is it, in millimetres to 2 decimal places?",
    "answer": [
     46.5
    ],
    "labels": [
     "central band width (mm)"
    ],
    "explanation": "Twice the distance to the first dark fringe: 2Dλ ÷ a = 46.5 mm."
   }
  ]
 },
 {
  "id": "q35",
  "title": "How bright off-centre?",
  "topic": "Intensity in a single-slit pattern",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "A detector in the Crystal Observatory sits off to one side of a slit pattern, and the crew need to know what share of the light it catches.",
  "lesson": "In a single-slit pattern the intensity is I = I₀(sin β ÷ β)², with β = πa sin θ ÷ λ in radians.",
  "prompt": "The Crystal Observatory tests a slit 10 μm wide with light of wavelength 500 nm. A detector sits at θ = 0.03 rad from the centre of the pattern. Enter β = πa sin θ ÷ λ, in radians to 3 decimal places, then the intensity there as a fraction of the intensity at the centre, I ÷ I₀, to 3 decimal places.",
  "answer": [
   1.885,
   0.255
  ],
  "labels": [
   "β (rad)",
   "I ÷ I₀"
  ],
  "tolerance": 0.0005,
  "hints": [
   "β = πa sin θ ÷ λ, with a and λ in the same unit (1 μm = 1000 nm) and your calculator in radians.",
   "I ÷ I₀ = (sin β ÷ β)². Work out sin β, divide by β, then square."
  ],
  "solution": "sin θ = sin(0.03) ≈ 0.03. β = π × 10000 × sin θ ÷ 500 ≈ 1.8847 rad, which is 1.885 rad to 3 decimal places. Then sin β ÷ β ≈ 0.5047, which is 0.505 to 3 decimal places, and I ÷ I₀ = (sin β ÷ β)² ≈ 0.2547, which is 0.255 to 3 decimal places.",
  "xp": 200,
  "prereqs": [
   "q34"
  ],
  "sources": [source.s4_2],
  "teaching": {
   "intuition": "The single-slit rule a sin θ = mλ says where the light is gone, but not how bright it is in between. To get that, add up the little waves from every point across the slit. The result depends on one number, β = πa sin θ ÷ λ, which is half the difference in phase, in radians, between the light from the two edges of the slit. The intensity I as a share of the intensity I₀ at the centre is I ÷ I₀ = (sin β ÷ β)². At the centre β = 0 and the share is 1. As β grows the share falls, reaching 0 when β = π, which is exactly the first dark fringe a sin θ = λ. Past that it rises again into a much dimmer side band: at most about 4.5% of the centre. So almost all of the light lands in the central peak.",
   "steps": [
    "Put a and λ in the same unit, and set your calculator to radians.",
    "Work out β = πa sin θ ÷ λ.",
    "Work out sin β ÷ β.",
    "Square it: I ÷ I₀ = (sin β ÷ β)². Round only at the end."
   ],
   "example": {
    "prompt": "A slit 8 μm wide, light of 600 nm, a detector at 0.02 rad. What share of the centre’s intensity does it get?",
    "steps": [
     "β = π × 8000 × sin(0.02) ÷ 600 ≈ 0.8377 rad.",
     "sin β ÷ β ≈ 0.7431 ÷ 0.8377 ≈ 0.8871.",
     "I ÷ I₀ ≈ 0.8871² ≈ 0.787."
    ],
    "answer": "About 0.787 of the centre’s intensity."
   },
   "pitfalls": [
    "Using degrees. β must be in radians for sin β ÷ β to work.",
    "Forgetting to square sin β ÷ β. The intensity goes with the square of the wave’s amplitude.",
    "Dropping the π in β, which puts every dark fringe in the wrong place."
   ]
  },
  "guidance": [
   {
    "prompt": "With a = 10 μm = 10000 nm, λ = 500 nm and θ = 0.03 rad, what is β = πa sin θ ÷ λ, in radians to 3 decimal places?",
    "answer": [
     1.885
    ],
    "labels": [
     "β (rad)"
    ],
    "explanation": "sin(0.03) ≈ 0.03, and π × 10000 × sin θ ÷ 500 ≈ 1.8847 rad, which is 1.885 rad to 3 decimal places."
   },
   {
    "prompt": "What is sin β ÷ β, to 3 decimal places?",
    "answer": [
     0.505
    ],
    "labels": [
     "sin β ÷ β"
    ],
    "explanation": "sin β ÷ β ≈ 0.5047, which is 0.505 to 3 decimal places."
   },
   {
    "prompt": "Square it: what is I ÷ I₀, to 3 decimal places?",
    "answer": [
     0.255
    ],
    "labels": [
     "I ÷ I₀"
    ],
    "explanation": "(sin β ÷ β)² ≈ 0.2547, which is 0.255 to 3 decimal places, so the detector gets that fraction of the centre’s intensity."
   }
  ]
 },
 {
  "id": "q36",
  "title": "The fringes that go missing",
  "topic": "Two slits with width: missing orders",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "A double slit in the Crystal Observatory shows gaps where bright fringes should be, and the crew want to predict them.",
  "lesson": "Real slits have width, so the double-slit fringes are dimmed by a single-slit pattern; an order is missing where it falls on that pattern’s first dark fringe, at m = d ÷ a.",
  "prompt": "A plate in the Crystal Observatory has two slits, each 20 μm wide, with centres 80 μm apart, lit by light of wavelength 600 nm. Enter the angle of the first dark fringe of the single-slit pattern, in radians to 4 decimal places; then the lowest order m above 0 of the double-slit bright fringes that is missing; then how many bright fringes are seen inside the central peak of the single-slit pattern, counting the central fringe and leaving out the missing orders at its edges.",
  "answer": [
   0.03,
   4,
   7
  ],
  "labels": [
   "angle of first dark fringe (rad)",
   "first missing order",
   "bright fringes in central peak"
  ],
  "tolerance": 0.00005,
  "hints": [
   "The double-slit bright fringes are at d sin θ = mλ and the single-slit pattern’s first dark fringe is at a sin θ = λ. An order is missing when its bright fringe lands on that dark fringe.",
   "Divide the two rules: the bright fringe of order m lands on the first dark fringe when m = d ÷ a. Inside the central peak are the orders from −(m − 1) to m − 1."
  ],
  "solution": "The first dark fringe of one slit is at sin θ = λ ÷ a = 600 ÷ 20000 = 0.03, so θ ≈ 0.03 rad. A bright fringe of order m is at sin θ = mλ ÷ d, and it lands there when mλ ÷ d = λ ÷ a, that is m = d ÷ a = 80 ÷ 20 = 4. So orders ±4 are missing. Inside the central peak are the orders −3 to 3: 3 on each side and the central one, 7 bright fringes.",
  "xp": 200,
  "prereqs": [
   "q34",
   "q31"
  ],
  "sources": [source.s4_3],
  "teaching": {
   "intuition": "A real double slit has two slits that each have a width a, with centres a distance d apart. Two patterns then act at once. The two slits together put bright fringes at d sin θ = mλ, close together. Each slit alone spreads its light into a single-slit pattern, with its first dark fringe at a sin θ = λ, much further out. The single-slit pattern works like a dimmer laid over the fringes: bright fringes near the centre are bright, those further out are fainter, and a fringe that lands on a dark fringe of the single-slit pattern is not there at all. That is a missing order. Dividing the two rules, the bright fringe of order m lands on the first single-slit dark fringe when mλ ÷ d = λ ÷ a, that is m = d ÷ a. When d is a whole number of times a, the orders ±d ÷ a are missing, and the central peak holds the orders between them.",
   "steps": [
    "Find the first dark fringe of one slit: sin θ = λ ÷ a.",
    "Find the order that lands on it: m = d ÷ a. That order, on both sides, is missing.",
    "Inside the central peak are the orders from −(m − 1) to m − 1: that is m − 1 on each side, plus the central one.",
    "So the central peak holds 2m − 1 bright fringes."
   ],
   "example": {
    "prompt": "Two slits each 15 μm wide have centres 45 μm apart. Which order is missing first, and how many bright fringes are inside the central peak?",
    "steps": [
     "d ÷ a = 45 ÷ 15 = 3, so orders ±3 are missing.",
     "Inside are orders −2 to 2: 2 + 2 + 1 = 5."
    ],
    "answer": "Order 3 is missing first, and 5 bright fringes fit inside the central peak."
   },
   "pitfalls": [
    "Counting the missing orders at the edges as fringes inside the central peak.",
    "Forgetting the central fringe, m = 0, when counting.",
    "Dividing a by d instead of d by a. The centres are always further apart than the width of one slit."
   ]
  },
  "guidance": [
   {
    "prompt": "The single-slit pattern’s first dark fringe is at a sin θ = λ. With a = 20 μm = 20000 nm, what is θ, in radians to 4 decimal places?",
    "answer": [
     0.03
    ],
    "labels": [
     "angle of first dark fringe (rad)"
    ],
    "explanation": "sin θ = 600 ÷ 20000 = 0.03, so θ ≈ 0.03 rad."
   },
   {
    "prompt": "A double-slit bright fringe of order m sits at d sin θ = mλ. Which order m lands exactly on the first dark fringe, with d = 80 μm and a = 20 μm?",
    "answer": [
     4
    ],
    "labels": [
     "first missing order"
    ],
    "explanation": "mλ ÷ d = λ ÷ a gives m = d ÷ a = 4. That bright fringe falls where no light arrives from either slit, so it is missing."
   },
   {
    "prompt": "Inside the central peak are the orders strictly between −4 and 4. How many bright fringes is that?",
    "answer": [
     7
    ],
    "labels": [
     "bright fringes in central peak"
    ],
    "explanation": "Orders −3 to 3: 3 + 3 + 1 = 7."
   }
  ]
 },
 {
  "id": "q37",
  "title": "Splitting starlight",
  "topic": "Diffraction gratings",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "The Crystal Observatory’s spectrograph spreads light into its colours with a grating, and the crew need to read wavelengths from its angles.",
  "lesson": "A grating with N lines per millimetre has spacing d = 1 ÷ N mm and sends bright lines where d sin θ = mλ.",
  "prompt": "The Crystal Observatory’s spectrograph has a grating with 500 lines per millimetre. Enter the spacing d between neighbouring lines, in nanometres (type it without commas); then the angle of the order m = 2 bright line for light of wavelength 550 nm, in radians to 3 decimal places; then the wavelength of a second lamp whose first-order line is seen at 0.25 rad, in nanometres to 1 decimal place.",
  "answer": [
   2000,
   0.582,
   494.8
  ],
  "labels": [
   "line spacing (nm)",
   "angle of order (rad)",
   "second wavelength (nm)"
  ],
  "tolerance": 0.0005,
  "hints": [
   "N lines in 1 mm means the lines are 1 ÷ N mm apart, and 1 mm = 1000000 nm.",
   "A grating sends bright lines where d sin θ = mλ. Solve for θ with arcsin, or for λ = d sin θ ÷ m."
  ],
  "solution": "d = 1 mm ÷ 500 = 1000000 nm ÷ 500 = 2000 nm. Order 2: sin θ = mλ ÷ d = 1100 ÷ 2000 = 0.55, so θ = arcsin of that ≈ 0.5824 rad, which is 0.582 rad to 3 decimal places. The second lamp in first order: λ = d sin θ = 2000 × sin(0.25) ≈ 494.8079 nm, which is 494.8 nm to 1 decimal place.",
  "xp": 200,
  "prereqs": [
   "q30"
  ],
  "sources": [source.s4_4],
  "teaching": {
   "intuition": "A grating is a plate ruled with a great many equally spaced lines, which act as slits. Like a double slit, it sends bright light where the path difference between neighbouring slits is a whole number of wavelengths: d sin θ = mλ, where d is the spacing between lines and m is the order. With hundreds of slits instead of two, every slit has to agree, so the bright lines become very sharp and nearly all the space between them goes dark. Each wavelength goes off at its own angle, so white light is spread into its colours, and a measured angle tells you the wavelength. Gratings are labelled by how many lines fit in a millimetre: N lines per millimetre means d = 1 ÷ N mm.",
   "steps": [
    "Find the spacing: d = 1 ÷ N mm, and 1 mm = 1000000 nm, so d = 1000000 ÷ N nm.",
    "For a known wavelength and order m: sin θ = mλ ÷ d, then θ = arcsin(mλ ÷ d) in radians. If mλ ÷ d is more than 1, that order does not exist.",
    "For a measured angle: λ = d sin θ ÷ m."
   ],
   "example": {
    "prompt": "A grating has 400 lines per millimetre. At what angle is the first-order line of 500 nm light?",
    "steps": [
     "d = 1000000 ÷ 400 = 2500 nm.",
     "sin θ = 500 ÷ 2500 = 0.2, so θ = arcsin(0.2) ≈ 0.201 rad."
    ],
    "answer": "About 0.201 rad."
   },
   "pitfalls": [
    "Using N itself as the spacing. The spacing is 1 ÷ N mm.",
    "Using the small-angle approximation. Grating angles are often large, so use arcsin.",
    "Forgetting the order m when finding a wavelength from a second- or third-order line."
   ]
  },
  "guidance": [
   {
    "prompt": "500 lines fit in 1 mm, which is 1000000 nm. What is the spacing d between lines, in nanometres?",
    "answer": [
     2000
    ],
    "labels": [
     "line spacing (nm)"
    ],
    "explanation": "d = 1000000 ÷ 500 = 2000 nm."
   },
   {
    "prompt": "For order m = 2 and λ = 550 nm, sin θ = mλ ÷ d. What is θ, in radians to 3 decimal places?",
    "answer": [
     0.582
    ],
    "labels": [
     "angle of order (rad)"
    ],
    "explanation": "sin θ = 1100 ÷ 2000 = 0.55, and θ = arcsin of that ≈ 0.5824 rad, which is 0.582 rad to 3 decimal places."
   },
   {
    "prompt": "The second lamp’s first-order line (m = 1) is at 0.25 rad. What is its wavelength λ = d sin θ, in nanometres to 1 decimal place?",
    "answer": [
     494.8
    ],
    "labels": [
     "second wavelength (nm)"
    ],
    "explanation": "2000 × sin(0.25) ≈ 494.8079 nm, which is 494.8 nm to 1 decimal place."
   }
  ]
 },
 {
  "id": "q38",
  "title": "Two lamps on the moon",
  "topic": "Circular apertures and the Rayleigh criterion, θ = 1.22λ ÷ D",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "The Crystal Observatory wants to know how close together two lights on a distant moon can be before its telescope sees them as one.",
  "lesson": "A round opening of diameter D can tell apart two points only if they are at least θ = 1.22λ ÷ D apart in angle, the Rayleigh criterion.",
  "prompt": "The Crystal Observatory’s telescope has a round opening 25 cm across and looks at two lamps on a moon 380000 km away, in light of wavelength 550 nm. By the Rayleigh criterion, enter the smallest angle between two points that the telescope can still tell apart, in microradians (1 μrad = 10⁻⁶ rad) to 2 decimal places; then the smallest distance between the two lamps that it can still separate, in kilometres to 2 decimal places.",
  "answer": [
   2.68,
   1.02
  ],
  "labels": [
   "smallest angle (μrad)",
   "smallest separation (km)"
  ],
  "tolerance": 0.005,
  "hints": [
   "The Rayleigh criterion: two points are just told apart when θ = 1.22λ ÷ D, with λ and the diameter D in metres and θ in radians.",
   "The angle is tiny, so the distance between the two points is about their distance away times θ in radians."
  ],
  "solution": "λ = 550 × 10⁻⁹ m and D = 0.25 m. θ = 1.22 × 550 × 10⁻⁹ ÷ 0.25 rad. One microradian is 10⁻⁶ rad, so in microradians that is 1.22 × 550 ÷ 0.25 ÷ 1000 = 2.684 μrad, which is 2.68 μrad to 2 decimal places. The separation is s = Lθ, with θ in radians: 380000 km × θ ≈ 1.0199 km, which is 1.02 km to 2 decimal places.",
  "xp": 200,
  "prereqs": [
   "q34"
  ],
  "sources": [source.s4_5],
  "teaching": {
   "intuition": "Light entering a telescope passes through a round opening, and an opening diffracts light just as a slit does. So even a perfect telescope turns each star into a small bright disc with faint rings round it, not a point. The disc is smaller for a wider opening and for a shorter wavelength. Two points close together give two overlapping discs, and when they overlap too much they blur into one. The resolution of an instrument is how finely it can tell close points apart. The Rayleigh criterion draws the line: two points are just told apart when the centre of one pattern falls on the first dark ring of the other, which happens at an angle θ = 1.22λ ÷ D, in radians, for an opening of diameter D. The angle is tiny, so two points a distance L away are just told apart when they are about Lθ apart.",
   "steps": [
    "Put λ and D in metres.",
    "Work out θ = 1.22λ ÷ D, in radians. One microradian (μrad) is 10⁻⁶ rad.",
    "The smallest separation that can be told apart at distance L is s = Lθ, with θ in radians; s comes out in the unit of L."
   ],
   "example": {
    "prompt": "A telescope 10 cm across views two lights 200000 km away in 500 nm light. What is the smallest separation it can resolve?",
    "steps": [
     "θ = 1.22 × 500 × 10⁻⁹ ÷ 0.1 = 6.1 × 10⁻⁶ rad, which is 6.1 μrad.",
     "s = 200000 km × 6.1 × 10⁻⁶ = 1.22 km."
    ],
    "answer": "About 1.22 km."
   },
   "pitfalls": [
    "Leaving D in centimetres: 25 cm is 0.25 m.",
    "Forgetting the factor 1.22 that a round opening brings.",
    "Multiplying by the angle in microradians instead of radians."
   ]
  },
  "guidance": [
   {
    "prompt": "With λ = 550 nm and D = 25 cm, both in metres, what is θ = 1.22λ ÷ D, in microradians to 2 decimal places?",
    "answer": [
     2.68
    ],
    "labels": [
     "smallest angle (μrad)"
    ],
    "explanation": "1.22 × 550 × 10⁻⁹ ÷ 0.25 rad is 1.22 × 550 ÷ 0.25 ÷ 1000 microradians = 2.684 μrad, which is 2.68 μrad to 2 decimal places."
   },
   {
    "prompt": "Multiply the unrounded angle in radians by the distance, 380000 km. What is the smallest separation, in kilometres to 2 decimal places?",
    "answer": [
     1.02
    ],
    "labels": [
     "smallest separation (km)"
    ],
    "explanation": "s = 380000 km × θ ≈ 1.0199 km, which is 1.02 km to 2 decimal places. Lamps closer together than that blur into one spot."
   }
  ]
 },
 {
  "id": "q39",
  "title": "Reading a crystal with X-rays",
  "topic": "X-ray diffraction and Bragg’s law, mλ = 2d sin θ",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "The crystal lab wants to measure how far apart the layers of atoms in a new crystal are.",
  "lesson": "X-rays reflected from crystal planes spaced d apart are strongest where mλ = 2d sin θ, with θ measured from the planes.",
  "prompt": "In the crystal lab, X-rays of wavelength 0.12 nm reflect off a crystal. The order m = 1 reflection is strongest at 0.3 rad, measured from the crystal planes. Enter the spacing d of the planes, in nanometres to 3 decimal places; then the angle from the planes of the order m = 2 reflection, in radians to 3 decimal places.",
  "answer": [
   0.203,
   0.632
  ],
  "labels": [
   "plane spacing (nm)",
   "angle of higher order (rad)"
  ],
  "tolerance": 0.0005,
  "hints": [
   "Bragg’s law: mλ = 2d sin θ, where θ is measured from the planes, not from the line at right angles to them.",
   "Solve for d = mλ ÷ (2 sin θ), then put d into the same law with the new order and solve sin θ = mλ ÷ (2d)."
  ],
  "solution": "sin(0.3) ≈ 0.2955. d = mλ ÷ (2 sin θ) = 0.12 ÷ (2 × sin(0.3)) ≈ 0.203 nm. For order 2: sin θ = 2 × 0.12 ÷ (2d) ≈ 0.591, so θ ≈ 0.6323 rad, which is 0.632 rad to 3 decimal places.",
  "xp": 200,
  "prereqs": [
   "q37"
  ],
  "sources": [source.s4_6],
  "teaching": {
   "intuition": "X-rays are light of very short wavelength, about the size of the gaps between atoms. A crystal is atoms stacked in neat, equally spaced layers, the crystal planes, so it acts on X-rays the way a grating acts on visible light. Each plane reflects a little of the beam. A ray reflected from the next plane down travels further, by 2d sin θ, where d is the spacing between the planes and θ is the angle between the beam and the planes. When that extra path is a whole number of wavelengths the reflections add up and the reflection is strong. That is Bragg’s law: mλ = 2d sin θ, for m = 1, 2, 3 and so on. Take care: here θ is measured from the planes themselves, not from the line at right angles to them as in Snell’s law.",
   "steps": [
    "Read the angle θ from the crystal planes, and set the calculator to radians.",
    "To find the spacing: d = mλ ÷ (2 sin θ).",
    "To find the angle of another order: sin θ = mλ ÷ (2d), then θ = arcsin. If mλ ÷ (2d) is more than 1, that order does not exist."
   ],
   "example": {
    "prompt": "X-rays of 0.1 nm reflect most strongly in first order at 0.25 rad from the planes. How far apart are the planes?",
    "steps": [
     "sin(0.25) ≈ 0.2474.",
     "d = 0.1 ÷ (2 × 0.2474) ≈ 0.202 nm."
    ],
    "answer": "About 0.202 nm."
   },
   "pitfalls": [
    "Measuring θ from the line at right angles to the planes. Bragg’s law uses the angle from the planes.",
    "Forgetting the 2: the extra path is there and back, 2d sin θ."
   ]
  },
  "guidance": [
   {
    "prompt": "Bragg’s law mλ = 2d sin θ with m = 1, λ = 0.12 nm and θ = 0.3 rad. What is d, in nanometres to 3 decimal places?",
    "answer": [
     0.203
    ],
    "labels": [
     "plane spacing (nm)"
    ],
    "explanation": "d = 0.12 ÷ (2 × sin(0.3)) ≈ 0.203 nm."
   },
   {
    "prompt": "Now order m = 2 from the same planes: sin θ = 2λ ÷ (2d). What is θ, in radians to 3 decimal places?",
    "answer": [
     0.632
    ],
    "labels": [
     "angle of higher order (rad)"
    ],
    "explanation": "sin θ = 0.24 ÷ (2d) ≈ 0.591, and θ = arcsin of that ≈ 0.6323 rad, which is 0.632 rad to 3 decimal places. A higher order needs a steeper angle."
   }
  ]
 },
 {
  "id": "q40",
  "title": "Naming the mystery lamp",
  "topic": "Realm review: identifying a lamp from its fringes",
  "tier": "Advanced",
  "sector": "Crystal Observatory",
  "brief": "A new lamp has arrived at the Crystal Observatory with no label, and the crew want its wavelength and a check on where its next line will fall.",
  "lesson": "Measure where a grating sends a lamp’s light on a screen, use tan θ = y ÷ D and d sin θ = mλ to find λ, then predict the other orders.",
  "prompt": "To identify a lamp, the Crystal Observatory shines it through a grating with 500 lines per millimetre onto a flat screen 1.2 m away, square to the beam. The first-order bright line lands 36.98 cm from the centre. Enter the lamp’s wavelength, in nanometres to the nearest nanometre; then, using that whole-number wavelength, how far from the centre the second-order line lands, in centimetres to 1 decimal place.",
  "answer": [
   589,
   87.5
  ],
  "labels": [
   "wavelength (nm)",
   "second-order distance (cm)"
  ],
  "tolerance": 0.00005,
  "hints": [
   "The screen is square to the beam, so tan θ = y ÷ D. The angles here are not small, so use tan and arcsin, not the small-angle approximation.",
   "Then d sin θ = mλ with d = 1 ÷ N mm. For the second order, find θ from sin θ = 2λ ÷ d and the spot from y = D tan θ."
  ],
  "solution": "tan θ = 0.3698 ÷ 1.2, so θ ≈ 0.2989 rad. d = 1000000 ÷ 500 = 2000 nm, so λ = d sin θ ≈ 589 nm, which is 589 nm to the nearest nanometre. Second order: sin θ = 2 × 589 ÷ d = 0.589, θ ≈ 0.6298 rad, and y = D tan θ, which in centimetres is 100 × 1.2 × tan θ ≈ 87.4608 cm, which is 87.5 cm to 1 decimal place.",
  "xp": 200,
  "prereqs": [
   "q31",
   "q37"
  ],
  "sources": [source.s3_2, source.s4_4],
  "teaching": {
   "intuition": "Every lamp gives off its own set of wavelengths, so measuring a wavelength is a way to tell what is glowing. A grating does the measuring. Send the light through a grating onto a flat screen a distance D away, square to the beam, and the bright line of order m lands a distance y from the centre. The angle comes from tan θ = y ÷ D. A grating’s angles are large, so here you need tan and arcsin exactly: the small-angle approximation of the double slit would be badly off. Then d sin θ = mλ gives the wavelength. Once λ is known, the same rule predicts where every other order must land, a good check on the measurement. All of this treats light simply as a wave. Light is in fact an electromagnetic wave, a travelling ripple of electric and magnetic fields, and where that wave comes from is the subject of Electricity and magnetism.",
   "steps": [
    "Find the angle: θ = arctan(y ÷ D), with y and D in the same unit.",
    "Find the grating spacing: d = 1000000 ÷ N nm for N lines per millimetre.",
    "Find the wavelength: λ = d sin θ ÷ m, and round it as the question says.",
    "Predict another order: sin θ = mλ ÷ d, θ = arcsin, and y = D tan θ."
   ],
   "example": {
    "prompt": "A grating of 400 lines per millimetre puts a first-order line 20.62 cm from the centre of a screen 1 m away. What is the wavelength?",
    "steps": [
     "θ = arctan(0.2062 ÷ 1) ≈ 0.2033 rad.",
     "d = 1000000 ÷ 400 = 2500 nm, so λ = 2500 × sin(0.2033) ≈ 505 nm."
    ],
    "answer": "About 505 nm."
   },
   "pitfalls": [
    "Using y ÷ D as the angle. For a grating the angle is large, so take the arctan.",
    "Doubling the first-order distance to get the second order. Doubling sin θ is right; the distance grows by more than double.",
    "Using sin θ = y ÷ D. On a flat screen y ÷ D is tan θ."
   ]
  },
  "guidance": [
   {
    "prompt": "The spot is 36.98 cm = 0.3698 m from the centre on a screen 1.2 m away. What is the angle θ = arctan(y ÷ D), in radians to 4 decimal places?",
    "answer": [
     0.2989
    ],
    "labels": [
     "angle (rad)"
    ],
    "explanation": "θ = arctan(0.3698 ÷ 1.2) ≈ 0.2989 rad."
   },
   {
    "prompt": "With d = 1000000 ÷ 500 nm and m = 1, what is λ = d sin θ, to the nearest nanometre?",
    "answer": [
     589
    ],
    "labels": [
     "wavelength (nm)"
    ],
    "explanation": "d × sin θ ≈ 589 nm, which is 589 nm to the nearest nanometre."
   },
   {
    "prompt": "For the second order, sin θ = 2 × 589 ÷ d. Where does that line land, y = D tan θ, in centimetres to 1 decimal place?",
    "answer": [
     87.5
    ],
    "labels": [
     "second-order distance (cm)"
    ],
    "explanation": "sin θ = 0.589 gives θ ≈ 0.6298 rad, and 100 × 1.2 × tan θ ≈ 87.4608 cm, which is 87.5 cm to 1 decimal place. The second order is more than twice as far out, because tan grows faster than sin."
   }
  ]
 }
);
})();
