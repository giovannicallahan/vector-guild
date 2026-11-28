/* Waves: sound and light mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* rd(x, k): x rounded to k decimal places. tie(x, k): x lies within 2% of a step of a rounding tie at k places.
   fx(x, k): x shown with exactly k decimals. val(x, k): "= 2.4" when x is exact to 4 places, else "≈ 2.4567", and
   ", which is 2.46 to 2 decimal places" when rounding to k places changes what was shown. */
const rd = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
const tie = (x, k) => { const f = Math.abs(x * Math.pow(10, k)) % 1; return Math.abs(f - 0.5) < 0.02; };
const fx = (x, k) => G.tidy(x).toFixed(k);
const val = (x, k, u) => { const four = rd(x, 4), r = rd(x, k), unit = u ? ' ' + u : ''; let s = (Math.abs(x - four) < 1e-9 ? '= ' : '≈ ') + n(four) + unit;
 if (Math.abs(four - r) > 1e-9) s += `, which is ${fx(r, k)}${unit} to ${k} decimal place${k === 1 ? '' : 's'}`; return s; };
/* Ordinals: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st. */
const ord = k => { const t = k % 100, u = k % 10; return k + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const same = (a, b) => Object.keys(a).every(k => a[k] === b[k]);

/* q32: the films, backings and the case table. A reflection off a higher index picks up a half-wavelength shift. */
const BACKING = { 1: 'air', 1.33: 'water', 1.52: 'glass', 1.65: 'dense glass' };
const film = ({ lam, nf, nb, bright }) => { const shifts = nb > nf ? 2 : 1, ln = lam / nf,
 quarter = (shifts === 1) === (bright === 1), t = quarter ? ln / 4 : ln / 2; return { shifts, ln, quarter, t }; };
/* q35: β = πa sin θ ÷ λ with a in micrometres and λ in nanometres (1 μm = 1000 nm). */
const slit = ({ a, lam, th }) => { const b = Math.PI * a * 1000 * Math.sin(th) / lam, s = Math.sin(b) / b; return { b, s, I: s * s }; };
/* q39: plane spacing from the first measured order, then the angle of a second order. */
const bragg = ({ lam, th, m, m2 }) => { const d = m * lam / (2 * Math.sin(th)), s2 = m2 * lam / (2 * d); return { d, s2, th2: Math.asin(s2) }; };
/* q40: wavelength from a first-order spot y cm from the centre on a screen D m away, then the second-order spot. */
const lamp = ({ N, D, y }) => { const d = 1e6 / N, th = Math.atan(y / 100 / D), lam = d * Math.sin(th), L = Math.round(lam),
 s2 = 2 * L / d, th2 = Math.asin(s2), y2 = 100 * D * Math.tan(th2); return { d, th, lam, L, s2, th2, y2 }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Bright fringe m at y = mλD ÷ d; with λ in nm, D in m and d in mm, λD ÷ d is in micrometres, so ÷ 1000 gives mm.
    Draws avoid rounding ties, draws where m times the rounded spacing rounds differently from y, and the worked
    example (500 nm, 0.25 mm, 2 m, order 2). */
 q31: {
  canonical: { lam: 580, d: 0.35, D: 1.6, m: 3 },
  draw: R => retry(() => ({ lam: 10 * R.int(40, 70), d: R.pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.75, 0.8]), D: R.pick([1.2, 1.5, 1.6, 1.8, 2, 2.4, 2.5, 3]), m: R.int(2, 5) }),
   p => { const s = p.lam * p.D / p.d / 1000, y = p.m * s; return !tie(s, 2) && !tie(y, 2) && rd(p.m * rd(s, 2), 2) === rd(y, 2) && !(p.lam === 500 && p.d === 0.25 && p.D === 2); },
   { lam: 580, d: 0.35, D: 1.6, m: 3 }),
  build: ({ lam, d, D, m }) => { const s = lam * D / d / 1000, y = m * s; return {
   prompt: `In the Fringe Lab a lamp of wavelength ${n(lam)} nm shines on two narrow slits ${n(d)} mm apart, and the fringes fall on a screen ${n(D)} m away. The angles are small, so use the small-angle approximation. Enter the distance from the centre of the pattern to the ${ord(m)} bright fringe on one side (order m = ${n(m)}), in millimetres to 2 decimal places, then the spacing between neighbouring bright fringes, in millimetres to 2 decimal places.`,
   answer: [rd(y, 2), rd(s, 2)],
   hints: ['For small angles sin θ ≈ tan θ ≈ θ, and tan θ = y ÷ D, so d sin θ = mλ becomes y = mλD ÷ d.', 'Put every length in metres first (1 nm = 10⁻⁹ m, 1 mm = 10⁻³ m), and turn the result back into millimetres. Neighbouring bright fringes differ in m by 1, so their spacing is λD ÷ d.'],
   solution: `In metres, λ = ${n(lam)} × 10⁻⁹ m and d = ${n(d)} × 10⁻³ m. The spacing of bright fringes is λD ÷ d = ${n(lam)} × 10⁻⁹ × ${n(D)} ÷ (${n(d)} × 10⁻³) m. In millimetres (1 m = 1000 mm) that is ${n(lam)} × ${n(D)} ÷ ${n(d)} ÷ 1000 ${val(s, 2, 'mm')}. The ${ord(m)} bright fringe is m = ${n(m)} spacings from the centre: y = ${n(m)} × λD ÷ d ${val(y, 2, 'mm')}.`,
   guidance: [
    { prompt: `Work out the spacing λD ÷ d with λ = ${n(lam)} nm, D = ${n(D)} m and d = ${n(d)} mm, all in metres first. What is it in millimetres, to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(lam)} × 10⁻⁹ × ${n(D)} ÷ (${n(d)} × 10⁻³) m is the same as ${n(lam)} × ${n(D)} ÷ ${n(d)} ÷ 1000 mm, because the powers of ten leave 10⁻⁶ m, which is 0.001 mm. So λD ÷ d ${val(s, 2, 'mm')}.` },
    { prompt: `The ${ord(m)} bright fringe sits m = ${n(m)} spacings from the centre. Multiply the unrounded spacing by ${n(m)}: how far is it from the centre, in millimetres to 2 decimal places?`, answer: [rd(y, 2)], explanation: `y = ${n(m)} × λD ÷ d ${val(y, 2, 'mm')}. The bright fringes are evenly spaced because each one adds one wavelength to the path difference.` }
   ] }; }
 },
 /* Thin film at normal incidence, air above. shifts = 1 or 2; the smallest thickness above zero is λn ÷ 4 or λn ÷ 2.
    Draws keep the film and backing indices at least 0.05 apart, avoid rounding ties, avoid draws where dividing the
    rounded λn gives a different last digit, and avoid the worked example (600 nm, n = 1.25 in air, bright). */
 q32: {
  canonical: { lam: 560, nf: 1.4, nb: 1.52, bright: 0 },
  draw: R => retry(() => ({ lam: 10 * R.int(40, 70), nf: R.pick([1.25, 1.3, 1.38, 1.4, 1.45, 1.48, 1.6]), nb: R.pick([1, 1.33, 1.52, 1.65]), bright: R.int(0, 1) }),
   p => { const f = film(p); return Math.abs(p.nf - p.nb) >= 0.05 && !tie(f.ln, 1) && !tie(f.t, 1) && rd(rd(f.ln, 1) / (f.quarter ? 4 : 2), 1) === rd(f.t, 1) && !(p.lam === 600 && p.nf === 1.25 && p.nb === 1); },
   { lam: 560, nf: 1.4, nb: 1.52, bright: 0 }),
  build: p => { const { lam, nf, nb, bright } = p, f = film(p), word = bright ? 'bright' : 'dark', back = BACKING[nb],
   where = nb === 1 ? `a free-standing film of index n = ${n(nf)} with air (n = 1) on both sides` : `a film of index n = ${n(nf)} laid on ${back} (n = ${n(nb)}), with air above it`,
   bottom = nb > nf ? `the bottom surface, film into ${back}, goes from n = ${n(nf)} to the higher n = ${n(nb)}, so it shifts too` : `the bottom surface, film into ${back}, goes from n = ${n(nf)} to the lower n = ${n(nb)}, so it does not shift`,
   rule = f.shifts === 1 ? (bright ? 'one shift already puts the two reflections half a wavelength apart, so a bright reflection needs the extra path 2t to be half a wavelength in the film' : 'one shift puts the two reflections half a wavelength apart, so a dark reflection needs the extra path 2t to be a whole wavelength in the film')
    : (bright ? 'two shifts cancel each other, so a bright reflection needs the extra path 2t to be a whole wavelength in the film' : 'two shifts cancel each other, so a dark reflection needs the extra path 2t to be half a wavelength in the film'),
   eq = f.quarter ? `2t = λn ÷ 2, so t = λn ÷ 4` : `2t = λn, so t = λn ÷ 2`; return {
   prompt: `Light of wavelength ${n(lam)} nm in air falls straight down on ${where}. The lab wants the reflected light as ${word} as possible. Of the two reflections, off the top surface and off the bottom surface, enter how many pick up a half-wavelength shift; then the wavelength inside the film, in nanometres to 1 decimal place; then the smallest thickness above zero that gives a ${word} reflection, in nanometres to 1 decimal place.`,
   answer: [f.shifts, rd(f.ln, 1), rd(f.t, 1)],
   hints: ['A reflection picks up a half-wavelength shift only where the light meets a material of higher index. Check the top surface and the bottom surface separately.', 'Inside the film the wavelength is λ ÷ n. The light reflected off the bottom travels an extra 2t. With one shift, bright needs 2t to be half a film wavelength; with two shifts, bright needs 2t to be a whole film wavelength. Dark is the other way round.'],
   solution: `The top surface goes from air (n = 1) to the higher n = ${n(nf)}, so it shifts; ${bottom}. That is ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}. Inside the film λn = ${n(lam)} ÷ ${n(nf)} ${val(f.ln, 1, 'nm')}. Here ${rule}: ${eq} ${val(f.t, 1, 'nm')}.`,
   guidance: [
    { prompt: `The top reflection is air into the film; the bottom one is film (n = ${n(nf)}) into ${back} (n = ${n(nb)}). How many of the two reflections pick up a half-wavelength shift?`, answer: [f.shifts], explanation: `The top surface goes from n = 1 to n = ${n(nf)}, which is higher, so it shifts; ${bottom}. That makes ${n(f.shifts)}.` },
    { prompt: `What is the wavelength inside the film, λ ÷ n, in nanometres to 1 decimal place?`, answer: [rd(f.ln, 1)], explanation: `λn = ${n(lam)} ÷ ${n(nf)} ${val(f.ln, 1, 'nm')}. Light slows down in the film, so its waves bunch up.` },
    { prompt: `With ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}, should the extra path 2t be half a film wavelength or a whole one for a ${word} reflection? Find the smallest thickness above zero, in nanometres to 1 decimal place.`, answer: [rd(f.t, 1)], explanation: `Here ${rule}: ${eq} ${val(f.t, 1, 'nm')}.` }
   ] }; }
 },
 /* Each fringe that passes means the mirror moved λ ÷ 2. λ is even, so λ ÷ 2 is a whole number of nanometres and both
    shifts are exact to 3 decimal places of a micrometre. The second move X (μm) is a parameter, printed as drawn; the draw
    makes it a whole number of half wavelengths. Not the worked example (500 nm, 40 fringes). */
 q33: {
  canonical: { lam: 546, N: 150, X: 27.3 },
  draw: R => retry(() => { const lam = 2 * R.int(200, 350); return { lam, N: R.int(20, 400), X: rd(R.int(20, 400) * lam / 2000, 3) }; },
   p => Math.round(2000 * p.X / p.lam) !== p.N && !(p.lam === 500 && p.N === 40), { lam: 546, N: 150, X: 27.3 }),
  build: ({ lam, N, X }) => { const h = lam / 2, s1 = N * h / 1000, s2 = X, k = Math.round(1000 * X / h); return {
   prompt: `The Fringe Lab’s Michelson interferometer is lit by a lamp of wavelength ${n(lam)} nm. As one mirror is slowly moved, ${n(N)} bright fringes pass the mark in the eyepiece. Enter how far the mirror moved, in micrometres (μm) to 3 decimal places. Then the mirror is moved ${n(s2)} μm the other way: enter how many fringes pass the mark.`,
   answer: [s1, k],
   hints: ['Light goes to the moving mirror and back, so moving the mirror by Δd changes the path by 2Δd. One fringe passes for each wavelength of path change.', 'So one fringe means the mirror moved λ ÷ 2, and m fringes mean Δd = mλ ÷ 2. 1 μm is 1000 nm.'],
   solution: `One fringe passes for each change of one wavelength in the path, and the path changes by twice the mirror’s move, so one fringe is a move of λ ÷ 2 = ${n(h)} nm. ${n(N)} fringes: Δd = ${n(N)} × ${n(h)} = ${n(N * h)} nm = ${fx(s1, 3)} μm. Back the other way, ${n(s2)} μm is ${n(k * h)} nm, and ${n(k * h)} ÷ ${n(h)} = ${n(k)} fringes.`,
   guidance: [
    { prompt: `Moving the mirror by Δd changes the path by 2Δd, and one fringe passes per wavelength of path. How far does the mirror move while one fringe passes, in nanometres?`, answer: [h], explanation: `2Δd = λ, so Δd = λ ÷ 2 = ${n(lam)} ÷ 2 = ${n(h)} nm.` },
    { prompt: `${n(N)} fringes passed. How far did the mirror move, in micrometres to 3 decimal places?`, answer: [s1], explanation: `${n(N)} × ${n(h)} nm = ${n(N * h)} nm, and 1000 nm is 1 μm, so ${fx(s1, 3)} μm.` },
    { prompt: `Now the mirror moves ${n(s2)} μm. How many fringes pass?`, answer: [k], explanation: `${n(s2)} μm = ${n(k * h)} nm, and ${n(k * h)} ÷ ${n(h)} = ${n(k)}.` }
   ] }; }
 },
 /* Dark fringe m at sin θ = mλ ÷ a; central width 2Dλ ÷ a, which is in millimetres when D is in m, λ in nm and a in μm.
    Draws avoid ties at 4 and 2 places and the worked example (a = 25 μm with 550 nm). */
 q34: {
  canonical: { a: 40, lam: 620, m: 2, D: 1.5 },
  draw: R => retry(() => ({ a: R.pick([20, 25, 40, 50, 60, 75, 80, 100]), lam: 10 * R.int(40, 70), m: R.int(2, 4), D: R.pick([1.2, 1.5, 2, 2.5, 3]) }),
   p => { const s = p.m * p.lam / (1000 * p.a), th = Math.asin(s), w = 2 * p.D * p.lam / p.a; return s < 0.2 && !tie(th, 4) && !tie(w, 2) && !tie(w / 2, 2) && !(p.a === 25 && p.lam === 550); },
   { a: 40, lam: 620, m: 2, D: 1.5 }),
  build: ({ a, lam, m, D }) => { const s = m * lam / (1000 * a), th = Math.asin(s), half = D * lam / a, w = 2 * half; return {
   prompt: `A single slit ${n(a)} μm wide in the Fringe Lab is lit by light of wavelength ${n(lam)} nm, and the pattern falls on a screen ${n(D)} m away. Enter the angle of the dark fringe of order m = ${n(m)} from the straight-through direction, in radians to 4 decimal places. Then, using the small-angle approximation, enter the width of the central bright band (from the first dark fringe on one side to the first on the other), in millimetres to 2 decimal places.`,
   answer: [rd(th, 4), rd(w, 2)],
   hints: ['Dark fringes of a single slit of width a are where a sin θ = mλ, for m = 1, 2, 3 and so on. Put a and λ in the same unit (1 μm = 1000 nm) before dividing.', 'The first dark fringe (m = 1) is at sin θ = λ ÷ a. For a small angle its distance from the centre is y = D × λ ÷ a, and the central band reaches that far on both sides.'],
   solution: `sin θ = mλ ÷ a = ${n(m)} × ${n(lam)} ÷ ${n(1000 * a)} ${val(s, 4)}, so θ = arcsin of that ${val(th, 4, 'rad')}. The first dark fringe is y = Dλ ÷ a from the centre. In millimetres that is 1000 × ${n(D)} × ${n(lam)} ÷ ${n(1000 * a)} ${val(half, 2, 'mm')}. The central band is twice that: 2Dλ ÷ a ${val(w, 2, 'mm')}.`,
   guidance: [
    { prompt: `Dark fringe m = ${n(m)}: sin θ = mλ ÷ a with λ = ${n(lam)} nm and a = ${n(a)} μm = ${n(1000 * a)} nm. What is θ, in radians to 4 decimal places?`, answer: [rd(th, 4)], explanation: `sin θ = ${n(m * lam)} ÷ ${n(1000 * a)} ${val(s, 4)} and θ = arcsin of that ${val(th, 4, 'rad')}. For an angle this small θ and sin θ are almost equal.` },
    { prompt: `The first dark fringe (m = 1) is at y = Dλ ÷ a from the centre for small angles. How far is that, in millimetres to 2 decimal places?`, answer: [rd(half, 2)], explanation: `y = ${n(D)} × ${n(lam)} ÷ ${n(1000 * a)} m, and in millimetres that is 1000 × ${n(D)} × ${n(lam)} ÷ ${n(1000 * a)} ${val(half, 2, 'mm')}.` },
    { prompt: `The central band runs from the first dark fringe on one side to the first on the other. How wide is it, in millimetres to 2 decimal places?`, answer: [rd(w, 2)], explanation: `Twice the distance to the first dark fringe: 2Dλ ÷ a ${val(w, 2, 'mm')}.` }
   ] }; }
 },
 /* I ÷ I₀ = (sin β ÷ β)² with β = πa sin θ ÷ λ. θ is a whole number of thousandths of a radian. Draws keep β at least
    0.3 from every multiple of π (no dark fringe, I ÷ I₀ not close to 0), avoid ties, and avoid draws where a player
    who rounds β, then sin β ÷ β, to 3 places would end on a different I ÷ I₀. Not the worked example (a = 8, 600 nm, 0.02). */
 q35: {
  canonical: { a: 10, lam: 500, th: 0.03 },
  draw: R => retry(() => ({ a: R.pick([5, 8, 10, 12, 15, 20]), lam: 10 * R.int(40, 70), th: R.int(5, 60) / 1000 }),
   p => { const { b, s, I } = slit(p), br = rd(b, 3), sr = rd(Math.sin(br) / br, 3), near = Math.abs(b / Math.PI - Math.round(b / Math.PI)) * Math.PI;
    return b > 0.3 && b < 6 && near >= 0.3 && I >= 0.01 && !tie(b, 3) && !tie(s, 3) && !tie(I, 3) && rd(Math.pow(Math.sin(br) / br, 2), 3) === rd(I, 3) && rd(sr * sr, 3) === rd(I, 3) && !(p.a === 8 && p.lam === 600 && p.th === 0.02); },
   { a: 10, lam: 500, th: 0.03 }),
  build: p => { const { a, lam, th } = p, { b, s, I } = slit(p), st = Math.sin(th); return {
   prompt: `The Crystal Observatory tests a slit ${n(a)} μm wide with light of wavelength ${n(lam)} nm. A detector sits at θ = ${n(th)} rad from the centre of the pattern. Enter β = πa sin θ ÷ λ, in radians to 3 decimal places, then the intensity there as a fraction of the intensity at the centre, I ÷ I₀, to 3 decimal places.`,
   answer: [rd(b, 3), rd(I, 3)],
   hints: ['β = πa sin θ ÷ λ, with a and λ in the same unit (1 μm = 1000 nm) and your calculator in radians.', 'I ÷ I₀ = (sin β ÷ β)². Work out sin β, divide by β, then square.'],
   solution: `sin θ = sin(${n(th)}) ${val(st, 4)}. β = π × ${n(1000 * a)} × sin θ ÷ ${n(lam)} ${val(b, 3, 'rad')}. Then sin β ÷ β ${val(s, 3)}, and I ÷ I₀ = (sin β ÷ β)² ${val(I, 3)}.`,
   guidance: [
    { prompt: `With a = ${n(a)} μm = ${n(1000 * a)} nm, λ = ${n(lam)} nm and θ = ${n(th)} rad, what is β = πa sin θ ÷ λ, in radians to 3 decimal places?`, answer: [rd(b, 3)], explanation: `sin(${n(th)}) ${val(st, 4)}, and π × ${n(1000 * a)} × sin θ ÷ ${n(lam)} ${val(b, 3, 'rad')}.` },
    { prompt: `What is sin β ÷ β, to 3 decimal places?`, answer: [rd(s, 3)], explanation: `sin β ÷ β ${val(s, 3)}${s < 0 ? '. It is negative because β is past π, but the square will be positive' : ''}.` },
    { prompt: `Square it: what is I ÷ I₀, to 3 decimal places?`, answer: [rd(I, 3)], explanation: `(sin β ÷ β)² ${val(I, 3)}, so the detector gets that fraction of the centre’s intensity.` }
   ] }; }
 },
 /* Slits of width a, centres d = ka apart. First diffraction minimum: sin θ = λ ÷ a. Orders ±k fall on it and are
    missing; the central peak holds orders −(k − 1) … k − 1, which is 2k − 1 bright fringes. Not the worked example (15, 45). */
 q36: {
  canonical: { a: 20, k: 4, lam: 600 },
  draw: R => retry(() => ({ a: R.pick([10, 12, 15, 20, 25, 30, 40, 50]), k: R.int(2, 7), lam: 10 * R.int(40, 70) }),
   p => !tie(Math.asin(p.lam / (1000 * p.a)), 4) && !(p.a === 15 && p.k === 3), { a: 20, k: 4, lam: 600 }),
  build: ({ a, k, lam }) => { const d = k * a, s = lam / (1000 * a), th = Math.asin(s), c = 2 * k - 1; return {
   prompt: `A plate in the Crystal Observatory has two slits, each ${n(a)} μm wide, with centres ${n(d)} μm apart, lit by light of wavelength ${n(lam)} nm. Enter the angle of the first dark fringe of the single-slit pattern, in radians to 4 decimal places; then the lowest order m above 0 of the double-slit bright fringes that is missing; then how many bright fringes are seen inside the central peak of the single-slit pattern, counting the central fringe and leaving out the missing orders at its edges.`,
   answer: [rd(th, 4), k, c],
   hints: ['The double-slit bright fringes are at d sin θ = mλ and the single-slit pattern’s first dark fringe is at a sin θ = λ. An order is missing when its bright fringe lands on that dark fringe.', 'Divide the two rules: the bright fringe of order m lands on the first dark fringe when m = d ÷ a. Inside the central peak are the orders from −(m − 1) to m − 1.'],
   solution: `The first dark fringe of one slit is at sin θ = λ ÷ a = ${n(lam)} ÷ ${n(1000 * a)} ${val(s, 4)}, so θ ${val(th, 4, 'rad')}. A bright fringe of order m is at sin θ = mλ ÷ d, and it lands there when mλ ÷ d = λ ÷ a, that is m = d ÷ a = ${n(d)} ÷ ${n(a)} = ${n(k)}. So orders ±${n(k)} are missing. Inside the central peak are the orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} on each side and the central one, ${n(c)} bright fringes.`,
   guidance: [
    { prompt: `The single-slit pattern’s first dark fringe is at a sin θ = λ. With a = ${n(a)} μm = ${n(1000 * a)} nm, what is θ, in radians to 4 decimal places?`, answer: [rd(th, 4)], explanation: `sin θ = ${n(lam)} ÷ ${n(1000 * a)} ${val(s, 4)}, so θ ${val(th, 4, 'rad')}.` },
    { prompt: `A double-slit bright fringe of order m sits at d sin θ = mλ. Which order m lands exactly on the first dark fringe, with d = ${n(d)} μm and a = ${n(a)} μm?`, answer: [k], explanation: `mλ ÷ d = λ ÷ a gives m = d ÷ a = ${n(k)}. That bright fringe falls where no light arrives from either slit, so it is missing.` },
    { prompt: `Inside the central peak are the orders strictly between −${n(k)} and ${n(k)}. How many bright fringes is that?`, answer: [c], explanation: `Orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} + ${n(k - 1)} + 1 = ${n(c)}.` }
   ] }; }
 },
 /* d = 1 mm ÷ N = 10⁶ ÷ N nm (a whole number for every N drawn). Order m exists: mλ ÷ d < 0.95. The second line's angle
    θ₂ is printed to 3 places and its wavelength is computed from that printed angle. Not the worked example (N = 400). */
 q37: {
  canonical: { N: 500, m: 2, lam: 550, th2: 0.25 },
  draw: R => retry(() => { const N = R.pick([200, 250, 500, 625, 800, 1000]), d = 1e6 / N, l2 = R.int(400, 700); return { N, m: R.int(1, 3), lam: 10 * R.int(40, 70), th2: rd(Math.asin(l2 / d), 3) }; },
   p => { const d = 1e6 / p.N, s = p.m * p.lam / d, l2 = d * Math.sin(p.th2); return s < 0.95 && !tie(Math.asin(s), 3) && !tie(l2, 1) && l2 > 390 && l2 < 710 && p.N !== 400; },
   { N: 500, m: 2, lam: 550, th2: 0.25 }),
  build: ({ N, m, lam, th2 }) => { const d = 1e6 / N, s = m * lam / d, th = Math.asin(s), l2 = d * Math.sin(th2); return {
   prompt: `The Crystal Observatory’s spectrograph has a grating with ${n(N)} lines per millimetre. Enter the spacing d between neighbouring lines, in nanometres (type it without commas); then the angle of the order m = ${n(m)} bright line for light of wavelength ${n(lam)} nm, in radians to 3 decimal places; then the wavelength of a second lamp whose first-order line is seen at ${n(th2)} rad, in nanometres to 1 decimal place.`,
   answer: [d, rd(th, 3), rd(l2, 1)],
   hints: ['N lines in 1 mm means the lines are 1 ÷ N mm apart, and 1 mm = 1000000 nm.', 'A grating sends bright lines where d sin θ = mλ. Solve for θ with arcsin, or for λ = d sin θ ÷ m.'],
   solution: `d = 1 mm ÷ ${n(N)} = 1000000 nm ÷ ${n(N)} = ${n(d)} nm. Order ${n(m)}: sin θ = mλ ÷ d = ${n(m * lam)} ÷ ${n(d)} ${val(s, 4)}, so θ = arcsin of that ${val(th, 3, 'rad')}. The second lamp in first order: λ = d sin θ = ${n(d)} × sin(${n(th2)}) ${val(l2, 1, 'nm')}.`,
   guidance: [
    { prompt: `${n(N)} lines fit in 1 mm, which is 1000000 nm. What is the spacing d between lines, in nanometres?`, answer: [d], explanation: `d = 1000000 ÷ ${n(N)} = ${n(d)} nm.` },
    { prompt: `For order m = ${n(m)} and λ = ${n(lam)} nm, sin θ = mλ ÷ d. What is θ, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `sin θ = ${n(m * lam)} ÷ ${n(d)} ${val(s, 4)}, and θ = arcsin of that ${val(th, 3, 'rad')}.` },
    { prompt: `The second lamp’s first-order line (m = 1) is at ${n(th2)} rad. What is its wavelength λ = d sin θ, in nanometres to 1 decimal place?`, answer: [rd(l2, 1)], explanation: `${n(d)} × sin(${n(th2)}) ${val(l2, 1, 'nm')}.` }
   ] }; }
 },
 /* θ = 1.22λ ÷ D; with λ in nm and D in cm, θ = 0.122λ ÷ D microradians. s = Lθ km with L in km. Draws avoid ties and
    draws where the rounded angle gives a different separation. Not the worked example (500 nm, 10 cm, 200000 km). */
 q38: {
  canonical: { lam: 550, Dc: 25, L: 380000 },
  draw: R => retry(() => ({ lam: 10 * R.int(40, 70), Dc: R.pick([8, 10, 12, 15, 20, 25, 30, 40, 50]), L: 10000 * R.int(10, 90) }),
   p => { const th = 0.122 * p.lam / p.Dc, s = p.L * th / 1e6; return !tie(th, 2) && !tie(s, 2) && rd(p.L * rd(th, 2) / 1e6, 2) === rd(s, 2) && s >= 0.1 && !(p.lam === 500 && p.Dc === 10); },
   { lam: 550, Dc: 25, L: 380000 }),
  build: ({ lam, Dc, L }) => { const th = 0.122 * lam / Dc, s = L * th / 1e6; return {
   prompt: `The Crystal Observatory’s telescope has a round opening ${n(Dc)} cm across and looks at two lamps on a moon ${n(L)} km away, in light of wavelength ${n(lam)} nm. By the Rayleigh criterion, enter the smallest angle between two points that the telescope can still tell apart, in microradians (1 μrad = 10⁻⁶ rad) to 2 decimal places; then the smallest distance between the two lamps that it can still separate, in kilometres to 2 decimal places, worked out from the unrounded angle.`,
   answer: [rd(th, 2), rd(s, 2)],
   hints: ['The Rayleigh criterion: two points are just told apart when θ = 1.22λ ÷ D, with λ and the diameter D in metres and θ in radians.', 'The angle is tiny, so the distance between the two points is about their distance away times θ in radians.'],
   solution: `λ = ${n(lam)} × 10⁻⁹ m and D = ${n(Dc / 100)} m. θ = 1.22 × ${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad. One microradian is 10⁻⁶ rad, so in microradians that is 1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000 ${val(th, 2, 'μrad')}. The separation is s = Lθ, with θ in radians: ${n(L)} km × θ ${val(s, 2, 'km')}.`,
   guidance: [
    { prompt: `With λ = ${n(lam)} nm and D = ${n(Dc)} cm, both in metres, what is θ = 1.22λ ÷ D, in microradians to 2 decimal places?`, answer: [rd(th, 2)], explanation: `1.22 × ${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad is 1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000 microradians ${val(th, 2, 'μrad')}.` },
    { prompt: `Multiply the unrounded angle in radians by the distance, ${n(L)} km. What is the smallest separation, in kilometres to 2 decimal places?`, answer: [rd(s, 2)], explanation: `s = ${n(L)} km × θ ${val(s, 2, 'km')}. Lamps closer together than that blur into one spot.` }
   ] }; }
 },
 /* Bragg: mλ = 2d sin θ, θ from the planes. d from order m at θ, then the angle of order m2. λ and θ are whole numbers
    of thousandths. Draws avoid ties and draws where using d rounded to 3 places changes θ₂. Not the worked example (0.1, 0.25). */
 q39: {
  canonical: { lam: 0.12, th: 0.3, m: 1, m2: 2 },
  draw: R => retry(() => { const m = R.int(1, 2); return { lam: R.int(70, 200) / 1000, th: R.int(150, 600) / 1000, m, m2: m + R.int(1, 2) }; },
   p => { const b = bragg(p), dr = rd(b.d, 3); return b.s2 < 0.95 && !tie(b.d, 3) && !tie(b.th2, 3) && rd(Math.asin(p.m2 * p.lam / (2 * dr)), 3) === rd(b.th2, 3) && !(p.lam === 0.1 && p.th === 0.25); },
   { lam: 0.12, th: 0.3, m: 1, m2: 2 }),
  build: p => { const { lam, th, m, m2 } = p, b = bragg(p), st = Math.sin(th); return {
   prompt: `In the crystal lab, X-rays of wavelength ${n(lam)} nm reflect off a crystal. The order m = ${n(m)} reflection is strongest at ${n(th)} rad, measured from the crystal planes. Enter the spacing d of the planes, in nanometres to 3 decimal places; then the angle from the planes of the order m = ${n(m2)} reflection, in radians to 3 decimal places.`,
   answer: [rd(b.d, 3), rd(b.th2, 3)],
   hints: ['Bragg’s law: mλ = 2d sin θ, where θ is measured from the planes, not from the line at right angles to them.', 'Solve for d = mλ ÷ (2 sin θ), then put d into the same law with the new order and solve sin θ = mλ ÷ (2d).'],
   solution: `sin(${n(th)}) ${val(st, 4)}. d = mλ ÷ (2 sin θ) = ${n(m * lam)} ÷ (2 × sin(${n(th)})) ${val(b.d, 3, 'nm')}. For order ${n(m2)}: sin θ = ${n(m2)} × ${n(lam)} ÷ (2d) ${val(b.s2, 4)}, so θ ${val(b.th2, 3, 'rad')}.`,
   guidance: [
    { prompt: `Bragg’s law mλ = 2d sin θ with m = ${n(m)}, λ = ${n(lam)} nm and θ = ${n(th)} rad. What is d, in nanometres to 3 decimal places?`, answer: [rd(b.d, 3)], explanation: `d = ${n(m * lam)} ÷ (2 × sin(${n(th)})) ${val(b.d, 3, 'nm')}.` },
    { prompt: `Now order m = ${n(m2)} from the same planes: sin θ = ${n(m2)}λ ÷ (2d). What is θ, in radians to 3 decimal places?`, answer: [rd(b.th2, 3)], explanation: `sin θ = ${n(m2 * lam)} ÷ (2d) ${val(b.s2, 4)}, and θ = arcsin of that ${val(b.th2, 3, 'rad')}. A higher order needs a steeper angle.` }
   ] }; }
 },
 /* The spot's distance y (cm) is a parameter, printed to 2 places; the draw makes it from a whole-number wavelength.
    The wavelength found from y is within 0.3 nm of a whole number, and θ rounded to 4 places gives the same whole
    number. The second order must exist (sin θ₂ < 0.9), and θ₂ rounded to 4 places gives the same second spot. Not the worked example (N = 400, D = 1, y = 20.62). */
 q40: {
  canonical: { N: 500, D: 1.2, y: 36.98 },
  draw: R => retry(() => { const N = R.pick([250, 300, 500, 600, 625, 800]), D = R.pick([0.5, 0.8, 1, 1.2, 1.5, 2]), lam = R.int(400, 700), d = 1e6 / N;
    return { N, D, y: rd(100 * D * Math.tan(Math.asin(lam / d)), 2) }; },
   p => { const c = lamp(p), lr = (1e6 / p.N) * Math.sin(rd(c.th, 4)); return c.s2 < 0.9 && Math.abs(c.lam - c.L) < 0.3 && Math.round(lr) === c.L && !tie(c.th2, 3) && !tie(c.y2, 1) && rd(100 * p.D * Math.tan(rd(c.th2, 4)), 1) === rd(c.y2, 1) && c.y2 < 500 && !(p.N === 400 && p.D === 1); },
   { N: 500, D: 1.2, y: 36.98 }),
  build: p => { const { N, D, y } = p, c = lamp(p); return {
   prompt: `To identify a lamp, the Crystal Observatory shines it through a grating with ${n(N)} lines per millimetre onto a flat screen ${n(D)} m away, square to the beam. The first-order bright line lands ${n(y)} cm from the centre. Enter the lamp’s wavelength, in nanometres to the nearest nanometre; then, using that whole-number wavelength, how far from the centre the second-order line lands, in centimetres to 1 decimal place.`,
   answer: [c.L, rd(c.y2, 1)],
   hints: ['The screen is square to the beam, so tan θ = y ÷ D. The angles here are not small, so use tan and arcsin, not the small-angle approximation.', 'Then d sin θ = mλ with d = 1 ÷ N mm. For the second order, find θ from sin θ = 2λ ÷ d and the spot from y = D tan θ.'],
   solution: `tan θ = ${n(y / 100)} ÷ ${n(D)}, so θ ${val(c.th, 4, 'rad')}. d = 1000000 ÷ ${n(N)} ${val(c.d, 1, 'nm')}, so λ = d sin θ ≈ ${n(rd(c.lam, 1))} nm, which is ${n(c.L)} nm to the nearest nanometre. Second order: sin θ = 2 × ${n(c.L)} ÷ d ${val(c.s2, 4)}, θ ${val(c.th2, 4, 'rad')}, and y = D tan θ, which in centimetres is 100 × ${n(D)} × tan θ ${val(c.y2, 1, 'cm')}.`,
   guidance: [
    { prompt: `The spot is ${n(y)} cm = ${n(y / 100)} m from the centre on a screen ${n(D)} m away. What is the angle θ = arctan(y ÷ D), in radians to 4 decimal places?`, answer: [rd(c.th, 4)], explanation: `θ = arctan(${n(y / 100)} ÷ ${n(D)}) ${val(c.th, 4, 'rad')}.` },
    { prompt: `With d = 1000000 ÷ ${n(N)} nm and m = 1, what is λ = d sin θ, to the nearest nanometre?`, answer: [c.L], explanation: `d × sin θ ≈ ${n(rd(c.lam, 1))} nm, which is ${n(c.L)} nm to the nearest nanometre.` },
    { prompt: `For the second order, sin θ = 2 × ${n(c.L)} ÷ d. Where does that line land, y = D tan θ, in centimetres to 1 decimal place?`, answer: [rd(c.y2, 1)], explanation: `sin θ ${val(c.s2, 4)} gives θ ${val(c.th2, 4, 'rad')}, and 100 × ${n(D)} × tan θ ${val(c.y2, 1, 'cm')}. The second order is more than twice as far out, because tan grows faster than sin.` }
   ] }; }
 }
});
})();
