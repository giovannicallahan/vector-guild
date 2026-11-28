/* Waves: sound and light practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p7.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };


/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* rd(x, k): x rounded to k decimal places. tie(x, k): x lies within 2% of a step of a rounding tie at k places.
   exact(x, k): x has no more than k decimals. fx(x, k): x shown with exactly k decimals. val(x, k, u): "= 2.4" when x is
   exact to 4 places, else "≈ 2.4567", and ", which is 2.46 to 2 decimal places" when rounding to k places changes what was shown. */
const rd = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
const tie = (x, k) => { const f = Math.abs(x * Math.pow(10, k)) % 1; return Math.abs(f - 0.5) < 0.02; };
const exact = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-7;
const fx = (x, k) => G.tidy(x).toFixed(k);
const val = (x, k, u) => { const four = rd(x, 4), r = rd(x, k), unit = u ? ' ' + u : ''; let s = (Math.abs(x - four) < 1e-9 ? '= ' : '≈ ') + n(four) + unit;
 if (Math.abs(four - r) > 1e-9) s += `, which is ${fx(r, k)}${unit} to ${k} decimal place${k === 1 ? '' : 's'}`; return s; };
/* A value that is asked to the nearest whole number: "= 580 nm" or "≈ 579.6 nm, which is 580 nm to the nearest whole nanometre". */
const near = (x, u) => { const four = rd(x, 4), r = Math.round(x); return (Math.abs(x - four) < 1e-9 ? '= ' : '≈ ') + n(four) + ' ' + u + (Math.abs(four - r) > 1e-9 ? `, which is ${n(r)} ${u} to the nearest whole ${u === 'nm' ? 'nanometre' : u}` : ''); };
/* Ordinals: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st. */
const ord = k => { const t = k % 100, u = k % 10; return k + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const PI = Math.PI;
/* q35 helpers: the share of the centre's intensity at β, and whether rounding β, sin β ÷ β or the share early could change the third decimal. */
const share = b => { const s = Math.sin(b) / b; return { s, I: s * s }; };
const farFromDark = b => Math.abs(b / PI - Math.round(b / PI)) * PI >= 0.3;
const cleanB = b => { const { s, I } = share(b), br = rd(b, 3), sr = rd(Math.sin(br) / br, 3);
 return !tie(b, 3) && !tie(s, 3) && !tie(I, 3) && rd(Math.pow(Math.sin(br) / br, 2), 3) === rd(I, 3) && rd(sr * sr, 3) === rd(I, 3); };

/* ---- q31 Fringes on a screen: the small-angle approximation, y = mλD/d [V3 3.2] ---- */

/* q31b: the unknown is the slit separation, from a measured fringe distance. Not the worked example (500 nm, 2 m, order 2, 8 mm).
   The spacing y ÷ m is exact to 2 places in every draw, so no rounded intermediate can change the last digit of d. */
const okQ31b = p => { const d = p.m * p.lam * p.D / p.y / 1000;
 return d >= 0.1 && d <= 1.5 && !tie(d, 3) && exact(p.y / p.m, 2) && !(p.lam === 500 && p.D === 2 && p.m === 2 && p.y === 8); };
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The laser on the hall wall',
 brief: 'Mira has a laser pointer and a pair of slits of unknown spacing, and a measured fringe on the assembly hall wall is the only clue to how far apart the slits are.',
 labels: ['fringe spacing (mm)', 'slit separation (mm)'], tolerance: 0.0005,
 gl: [['fringe spacing (mm)'], ['slit separation (mm)']]
}, {
 canonical: { lam: 650, D: 3, m: 4, y: 26 },
 draw: R => retry(() => ({ lam: 10 * R.int(45, 68), D: R.pick([1.5, 2, 2.5, 3, 4]), m: R.int(2, 5), y: R.int(6, 40) }), okQ31b, { lam: 650, D: 3, m: 4, y: 26 }),
 build: ({ lam, D, m, y }) => { const s = y / m, d = lam * D / s / 1000; return {
  prompt: `Mira shines a laser pointer of wavelength ${n(lam)} nm through a pair of narrow slits and watches the fringes on the assembly hall wall, ${n(D)} m away. The angles are small, so use the small-angle approximation. She measures the ${ord(m)} bright fringe on one side (order m = ${n(m)}) at ${n(y)} mm from the centre of the pattern. Enter the spacing between neighbouring bright fringes, in millimetres to 2 decimal places, then the distance between the two slits, in millimetres to 3 decimal places.`,
  answer: [rd(s, 2), rd(d, 3)],
  hints: ['The bright fringe of order m is m spacings from the centre, and the spacings are all equal, so the spacing is the measured distance divided by m.', 'The spacing is λD ÷ d, so d = λD ÷ spacing. Put λ and D in metres first (1 nm = 10⁻⁹ m), and turn d back into millimetres at the end.'],
  solution: `The ${ord(m)} bright fringe is ${n(m)} spacings from the centre, so the spacing is ${n(y)} ÷ ${n(m)} ${val(s, 2, 'mm')}. Neighbouring bright fringes are λD ÷ d apart, so d = λD ÷ spacing. In metres that is d = ${n(lam)} × 10⁻⁹ × ${n(D)} ÷ (${n(s)} × 10⁻³) m, and in millimetres it is ${n(lam)} × ${n(D)} ÷ ${n(s)} ÷ 1000 ${val(d, 3, 'mm')}.`,
  guidance: [
   { prompt: `The ${ord(m)} bright fringe is m = ${n(m)} spacings from the centre and lies ${n(y)} mm away. What is the spacing between neighbouring bright fringes, in millimetres to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(y)} ÷ ${n(m)} ${val(s, 2, 'mm')}. Bright fringes are evenly spaced, so each of the ${n(m)} spacings is the same.` },
   { prompt: `The spacing is λD ÷ d. Solve it for d with λ = ${n(lam)} nm, D = ${n(D)} m and the spacing from the first step. What is d, in millimetres to 3 decimal places?`, answer: [rd(d, 3)], explanation: `d = λD ÷ spacing. In millimetres that is ${n(lam)} × ${n(D)} ÷ ${n(s)} ÷ 1000 ${val(d, 3, 'mm')}.` }
  ] }; }
});

/* q31c: an unknown lamp read off the wall ruler, then the screen is moved. y ÷ m is exact to 2 places; the new spacing is
   the old one times D2 ÷ D, and draws where using the whole-nanometre wavelength instead would change its last digit are dropped. */
const okQ31c = p => { const s = p.y / p.m, lam = s * p.d / p.D * 1000, s2 = s * p.D2 / p.D, alt = Math.round(lam) * p.D2 / p.d / 1000;
 return p.D2 !== p.D && exact(s, 2) && lam >= 420 && lam <= 680 && !tie(lam, 0) && !tie(s2, 2) && rd(alt, 2) === rd(s2, 2); };
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The unknown lamp on the ruler',
 brief: 'A lamp with no label on it is lit in the Fringe Lab, and the wall ruler is the only instrument that can tell Mira its wavelength.',
 labels: ['fringe spacing (mm)', 'wavelength (nm)', 'new fringe spacing (mm)'], tolerance: 0.005,
 gl: [['fringe spacing (mm)'], ['wavelength (nm)'], ['new fringe spacing (mm)']]
}, {
 canonical: { d: 0.3, D: 2.5, m: 4, y: 22, D2: 2 },
 draw: R => retry(() => ({ d: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), D: R.pick([1.2, 1.5, 2, 2.5, 3]), m: R.int(2, 5), y: R.int(8, 40), D2: R.pick([1, 1.5, 2, 2.5, 3, 4]) }), okQ31c, { d: 0.3, D: 2.5, m: 4, y: 22, D2: 2 }),
 build: ({ d, D, m, y, D2 }) => { const s = y / m, lam = s * d / D * 1000, s2 = s * D2 / D; return {
  prompt: `The wall ruler in the Fringe Lab shows the fringes of an unlabelled lamp shining through two narrow slits ${n(d)} mm apart onto a screen ${n(D)} m away. The angles are small, so use the small-angle approximation. The ${ord(m)} bright fringe on one side (order m = ${n(m)}) is ${n(y)} mm from the centre of the pattern. Enter the spacing between neighbouring bright fringes, in millimetres to 2 decimal places; then the wavelength of the lamp, in nanometres to the nearest whole number; then the new fringe spacing, in millimetres to 2 decimal places, if the screen is moved to ${n(D2)} m and nothing else changes.`,
  answer: [rd(s, 2), Math.round(lam), rd(s2, 2)],
  hints: ['The bright fringe of order m is m equal spacings from the centre, so the spacing is the measured distance divided by m.', 'The spacing is λD ÷ d, so λ = spacing × d ÷ D. Put everything in metres first, then turn the wavelength into nanometres.', 'With λ and d unchanged, the spacing λD ÷ d grows in proportion to D. Scale the old spacing directly, or use the wavelength from the step before.'],
  solution: `The ${ord(m)} bright fringe is ${n(m)} spacings out, so the spacing is ${n(y)} ÷ ${n(m)} ${val(s, 2, 'mm')}. The spacing is λD ÷ d, so λ = spacing × d ÷ D = ${n(s)} × ${n(d)} ÷ ${n(D)} × 1000 nm (the powers of ten leave a factor 1000 when the spacing and d are in millimetres) ${near(lam, 'nm')}. Moving the screen to ${n(D2)} m changes only D, so the spacing becomes ${n(s)} × ${n(D2)} ÷ ${n(D)} ${val(s2, 2, 'mm')}.`,
  guidance: [
   { prompt: `The ${ord(m)} bright fringe is m = ${n(m)} spacings from the centre and lies ${n(y)} mm away. What is the spacing between neighbouring bright fringes, in millimetres to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(y)} ÷ ${n(m)} ${val(s, 2, 'mm')}.` },
   { prompt: `The spacing is λD ÷ d. Solve it for λ with the spacing from the first step, d = ${n(d)} mm and D = ${n(D)} m. What is λ, in nanometres to the nearest whole number?`, answer: [Math.round(lam)], explanation: `λ = spacing × d ÷ D = ${n(s)} × ${n(d)} ÷ ${n(D)} × 1000 nm ${near(lam, 'nm')}.` },
   { prompt: `The lamp and the slits stay the same, so the spacing λD ÷ d is proportional to D. The screen goes from ${n(D)} m to ${n(D2)} m. What is the new spacing, in millimetres to 2 decimal places?`, answer: [rd(s2, 2)], explanation: `New spacing = ${n(s)} × ${n(D2)} ÷ ${n(D)} ${val(s2, 2, 'mm')}.` }
  ] }; }
});

/* q31d (also uses q30: the dark fringes of a double slit sit at (m + ½)λ). Two lines, 10 nm apart at least. The slit
   separation, screen distance and wavelengths make every spacing exact to 2 places, and so every answer. */
const spacing31 = (lam, D, d) => lam * D / d / 1000;
const okQ31d = p => { const s1 = spacing31(p.l1, p.D, p.d), s2 = spacing31(p.l2, p.D, p.d);
 return exact(s1, 2) && exact(s2, 2) && exact((p.j + 0.5) * s1, 2) && p.j !== p.m && !(p.l1 === 500 && p.d === 0.25 && p.D === 2); };
mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'Two colours on the wall',
 brief: 'A two-line lamp throws two sets of fringes onto the lab wall, and Mira wants to know how far apart they land.',
 labels: ['bright fringe distance (mm)', 'gap between the two lines (mm)', 'dark fringe distance (mm)'], tolerance: 0.005,
 gl: [['shorter line spacing (mm)'], ['gap between the two lines (mm)'], ['dark fringe distance (mm)']]
}, {
 canonical: { l1: 450, l2: 600, d: 0.25, D: 2, m: 3, j: 1 },
 draw: R => retry(() => { const l1 = 10 * R.int(40, 55); return { l1, l2: l1 + 10 * R.int(5, 15), d: R.pick([0.1, 0.2, 0.25, 0.4, 0.5]), D: R.pick([1.5, 2, 2.5, 3, 4]), m: R.int(2, 6), j: R.int(1, 4) }; }, okQ31d,
  { l1: 450, l2: 600, d: 0.25, D: 2, m: 3, j: 1 }),
 build: ({ l1, l2, d, D, m, j }) => { const s1 = spacing31(l1, D, d), s2 = spacing31(l2, D, d), y1 = m * s1, gap = m * (s2 - s1), yd = (j + 0.5) * s1; return {
  prompt: `A lamp in the Fringe Lab gives two bright lines at once, ${n(l1)} nm and ${n(l2)} nm. Both shine through the same pair of slits, ${n(d)} mm apart, onto a screen ${n(D)} m away. The angles are small, so use the small-angle approximation. Enter the distance from the centre of the pattern to the ${ord(m)} bright fringe (order m = ${n(m)}) of the ${n(l1)} nm line, in millimetres to 2 decimal places. Then enter how much farther from the centre the ${ord(m)} bright fringe of the ${n(l2)} nm line lies, in millimetres to 2 decimal places. Last, a dark fringe of a double slit lies where the path difference is (m + ½)λ, so the dark fringe with m = ${n(j)} sits ${n(j)} + ½ spacings from the centre (m = 0 is the dark fringe between the centre and the first bright fringe): enter its distance from the centre for the ${n(l1)} nm line, in millimetres to 2 decimal places.`,
  answer: [rd(y1, 2), rd(gap, 2), rd(yd, 2)],
  hints: ['A line of wavelength λ has fringe spacing λD ÷ d, and its bright fringe of order m is m spacings from the centre. Work out the spacing of each line first.', 'At the same order the longer line lies m times the difference of the two spacings farther out. A dark fringe of order m sits (m + ½) spacings out, using the spacing of its own line.'],
  solution: `The spacing of the ${n(l1)} nm line is λD ÷ d = ${n(l1)} × ${n(D)} ÷ ${n(d)} ÷ 1000 ${val(s1, 2, 'mm')} (nanometres, metres and millimetres leave a factor 1000), so its ${ord(m)} bright fringe is ${n(m)} × ${n(s1)} ${val(y1, 2, 'mm')} from the centre. The ${n(l2)} nm line has spacing ${n(l2)} × ${n(D)} ÷ ${n(d)} ÷ 1000 ${val(s2, 2, 'mm')}, so its ${ord(m)} bright fringe is ${n(m)} × ${n(s2)} = ${n(m * s2)} mm out, which is ${n(m * s2)} − ${n(y1)} ${val(gap, 2, 'mm')} farther than the first line’s. The dark fringe with m = ${n(j)} of the ${n(l1)} nm line is ${n(j + 0.5)} × ${n(s1)} ${val(yd, 2, 'mm')} from the centre.`,
  guidance: [
   { prompt: `What is the fringe spacing λD ÷ d of the ${n(l1)} nm line, in millimetres to 2 decimal places? Use d = ${n(d)} mm and D = ${n(D)} m.`, answer: [rd(s1, 2)], explanation: `${n(l1)} × ${n(D)} ÷ ${n(d)} ÷ 1000 ${val(s1, 2, 'mm')}.` },
   { prompt: `The ${n(l2)} nm line has a spacing of ${n(s2)} mm. How much farther out is its ${ord(m)} bright fringe than the ${ord(m)} bright fringe of the ${n(l1)} nm line, in millimetres to 2 decimal places?`, answer: [rd(gap, 2)], explanation: `${n(m)} × (${n(s2)} − ${n(s1)}) ${val(gap, 2, 'mm')}.` },
   { prompt: `The dark fringe with m = ${n(j)} of the ${n(l1)} nm line sits ${n(j + 0.5)} spacings from the centre. How far is that, in millimetres to 2 decimal places?`, answer: [rd(yd, 2)], explanation: `${n(j + 0.5)} × ${n(s1)} ${val(yd, 2, 'mm')}.` }
  ] }; }
});

/* ---- q32 Thin films: thickness for a bright or dark reflection [V3 3.4] ---- */

/* Thin film with air above it: shifts is 1 or 2, and the smallest thickness above zero is λn ÷ 4 or λn ÷ 2.
   quarter = true when the thickness is λn ÷ 4 (one shift and bright, or two shifts and dark). */
const filmCase = (lam, nf, nb, bright) => { const shifts = nb > nf ? 2 : 1, ln = lam / nf, quarter = (shifts === 1) === (bright === 1);
 return { shifts, ln, quarter, t: quarter ? ln / 4 : ln / 2 }; };
const filmRule = (shifts, bright) => shifts === 1 ? (bright ? 'one shift already puts the two reflections half a wavelength apart, so a bright reflection needs the extra path 2t to be half a wavelength in the film' : 'one shift puts the two reflections half a wavelength apart, so a dark reflection needs the extra path 2t to be a whole wavelength in the film')
 : (bright ? 'two shifts cancel each other, so a bright reflection needs the extra path 2t to be a whole wavelength in the film' : 'two shifts cancel each other, so a dark reflection needs the extra path 2t to be half a wavelength in the film');
const filmEq = quarter => quarter ? '2t = λn ÷ 2, so t = λn ÷ 4' : '2t = λn, so t = λn ÷ 2';
const bottomText = (nf, nb, back) => nb > nf ? `the bottom surface, film into ${back}, goes from n = ${n(nf)} to the higher n = ${n(nb)}, so it shifts too` : `the bottom surface, film into ${back}, goes from n = ${n(nf)} to the lower n = ${n(nb)}, so it does not shift`;
/* Rounding guard for a thickness list: λn and each thickness must not change their last digit if λn is rounded to 1 place first. */
const filmClean = (lam, nf, nb, bright) => { const f = filmCase(lam, nf, nb, bright), tb = filmCase(lam, nf, nb, 1).t, td = filmCase(lam, nf, nb, 0).t, lr = rd(f.ln, 1);
 return Math.abs(nf - nb) > 0.04 && !tie(f.ln, 1) && !tie(tb, 1) && !tie(td, 1) && rd(lr / 4, 1) === rd(f.ln / 4, 1) && rd(lr / 2, 1) === rd(f.ln / 2, 1); };

/* q32b: a lens coating, asking for both the brightest and the darkest thickness. Not the worked example (600 nm, n = 1.25 in air). */
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The lens coating',
 brief: 'The workshop is coating a camera lens for the observatory, and the coating must be thick enough to be either as bright or as dark as possible in reflected light.',
 labels: ['shifted reflections', 'bright thickness (nm)', 'dark thickness (nm)'], tolerance: 0.0005,
 gl: [['shifted reflections'], ['bright thickness (nm)'], ['dark thickness (nm)']]
}, {
 canonical: { lam: 540, nf: 1.25, nb: 1.65 },
 draw: R => retry(() => ({ lam: 10 * R.int(40, 70), nf: R.pick([1.25, 1.3, 1.38, 1.45, 1.7, 1.8, 1.9]), nb: R.pick([1.52, 1.65]) }), p => filmClean(p.lam, p.nf, p.nb, 1), { lam: 540, nf: 1.25, nb: 1.65 }),
 build: ({ lam, nf, nb }) => { const back = `glass of index n = ${n(nb)}`, b = filmCase(lam, nf, nb, 1), d = filmCase(lam, nf, nb, 0); return {
  prompt: `In the workshop a camera lens made of glass of index n = ${n(nb)} is coated with a thin film of index n = ${n(nf)}, with air above the film. Light of wavelength ${n(lam)} nm in air falls straight on the coating. Of the two reflections, off the top and off the bottom of the film, enter how many pick up a half-wavelength shift. Then enter the smallest thickness above zero, in nanometres to 1 decimal place, that makes the reflection as bright as possible, and the smallest thickness above zero that makes it as dark as possible, in nanometres to 1 decimal place.`,
  answer: [b.shifts, rd(b.t, 1), rd(d.t, 1)],
  hints: ['A reflection picks up a half-wavelength shift only where the light meets a material of higher index. Check the top surface and the bottom surface separately.', 'Inside the film the wavelength is λ ÷ n, and the light reflected off the bottom travels an extra 2t. With one shift, bright needs 2t to be half a film wavelength; with two shifts, bright needs a whole film wavelength. Dark is the other way round. Take the smallest thickness above zero.'],
  solution: `The top surface goes from air (n = 1) to the higher n = ${n(nf)}, so it shifts; ${bottomText(nf, nb, 'glass')}. That is ${n(b.shifts)} shift${b.shifts === 1 ? '' : 's'}. Inside the film λn = ${n(lam)} ÷ ${n(nf)} ${val(b.ln, 1, 'nm')}. Here ${filmRule(b.shifts, 1)}: ${filmEq(b.quarter)} ${val(b.t, 1, 'nm')} for bright. For dark it is the other way round: ${filmEq(d.quarter)} ${val(d.t, 1, 'nm')}.`,
  guidance: [
   { prompt: `The top reflection is air into the film; the bottom one is film (n = ${n(nf)}) into ${back}. How many of the two reflections pick up a half-wavelength shift?`, answer: [b.shifts], explanation: `The top surface goes from n = 1 to n = ${n(nf)}, which is higher, so it shifts; ${bottomText(nf, nb, 'glass')}. That makes ${n(b.shifts)}.` },
   { prompt: `Inside the film the wavelength is λ ÷ n = ${n(lam)} ÷ ${n(nf)} nm. With ${n(b.shifts)} shift${b.shifts === 1 ? '' : 's'}, should 2t be half a film wavelength or a whole one for a bright reflection? What is the smallest thickness above zero, in nanometres to 1 decimal place?`, answer: [rd(b.t, 1)], explanation: `λn ${val(b.ln, 1, 'nm')}. Here ${filmRule(b.shifts, 1)}: ${filmEq(b.quarter)} ${val(b.t, 1, 'nm')}.` },
   { prompt: `For the darkest reflection the condition is the other way round. What is the smallest thickness above zero, in nanometres to 1 decimal place?`, answer: [rd(d.t, 1)], explanation: `Here ${filmRule(d.shifts, 0)}: ${filmEq(d.quarter)} ${val(d.t, 1, 'nm')}.` }
  ] }; }
});

/* q32c: a layer grows on glass at a steady rate; the first bright or dark reflection, and the time it takes. */
const FILMS_C = [1.25, 1.35, 1.45, 1.75, 1.85, 1.95];
const okQ32c = p => { const f = filmCase(p.lam, p.nf, p.nb, p.bright);
 return filmClean(p.lam, p.nf, p.nb, p.bright) && !tie(f.t / p.rate, 1) && rd(rd(f.t, 1) / p.rate, 1) === rd(f.t / p.rate, 1); };
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Growing the layer',
 brief: 'The coating chamber lays a transparent layer down at a steady rate, and a sensor must stop it the first time the reflection reaches its target.',
 labels: ['shifted reflections', 'thickness (nm)', 'growth time (min)'], tolerance: 0.05,
 gl: [['shifted reflections'], ['thickness (nm)'], ['growth time (min)']]
}, {
 canonical: { lam: 520, nf: 1.25, nb: 1.52, bright: 0, rate: 8 },
 draw: R => retry(() => ({ lam: 10 * R.int(40, 70), nf: R.pick(FILMS_C), nb: R.pick([1.52, 1.65]), bright: R.int(0, 1), rate: R.pick([2, 2.5, 4, 5, 8, 10]) }), okQ32c, { lam: 520, nf: 1.25, nb: 1.52, bright: 0, rate: 8 }),
 build: p => { const { lam, nf, nb, bright, rate } = p, f = filmCase(lam, nf, nb, bright), word = bright ? 'bright' : 'dark', min = f.t / rate; return {
  prompt: `In the coating chamber a transparent layer of index n = ${n(nf)} is grown on a pane of glass of index n = ${n(nb)}, with air above it. It starts at zero thickness and grows by ${n(rate)} nm every minute. A lamp of wavelength ${n(lam)} nm in air shines straight down on it, and a sensor watches the reflected light. Of the two reflections, off the top and off the bottom of the layer, enter how many pick up a half-wavelength shift. Then enter the thickness, in nanometres to 1 decimal place, at which the reflection first becomes as ${word} as possible. Then enter how many minutes the growth takes to reach it, to 1 decimal place.`,
  answer: [f.shifts, rd(f.t, 1), rd(min, 1)],
  hints: ['A reflection picks up a half-wavelength shift only where the light meets a material of higher index. Check the top surface and the bottom surface separately.', 'Inside the layer the wavelength is λ ÷ n, and the bottom reflection travels an extra 2t. With one shift, bright needs 2t to be half a layer wavelength; with two shifts, bright needs a whole one. Dark is the other way round. The first time it happens is the smallest thickness above zero.', 'The growth is steady, so the time is the thickness divided by the growth per minute.'],
  solution: `The top surface goes from air (n = 1) to the higher n = ${n(nf)}, so it shifts; ${bottomText(nf, nb, 'glass')}. That is ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}. Inside the layer λn = ${n(lam)} ÷ ${n(nf)} ${val(f.ln, 1, 'nm')}. Here ${filmRule(f.shifts, bright)}: ${filmEq(f.quarter)} ${val(f.t, 1, 'nm')}. At ${n(rate)} nm per minute that takes ${n(f.t)} ÷ ${n(rate)} ${val(min, 1, 'minutes')}.`,
  guidance: [
   { prompt: `The top reflection is air into the layer; the bottom one is the layer (n = ${n(nf)}) into glass (n = ${n(nb)}). How many of the two reflections pick up a half-wavelength shift?`, answer: [f.shifts], explanation: `The top surface goes from n = 1 to n = ${n(nf)}, which is higher, so it shifts; ${bottomText(nf, nb, 'glass')}. That makes ${n(f.shifts)}.` },
   { prompt: `Inside the layer the wavelength is λ ÷ n = ${n(lam)} ÷ ${n(nf)} nm. With ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}, what is the smallest thickness above zero that gives a ${word} reflection, in nanometres to 1 decimal place?`, answer: [rd(f.t, 1)], explanation: `λn ${val(f.ln, 1, 'nm')}. Here ${filmRule(f.shifts, bright)}: ${filmEq(f.quarter)} ${val(f.t, 1, 'nm')}.` },
   { prompt: `The layer grows ${n(rate)} nm every minute. How many minutes does it take to reach that thickness, to 1 decimal place?`, answer: [rd(min, 1)], explanation: `${n(f.t)} ÷ ${n(rate)} ${val(min, 1, 'minutes')}.` }
  ] }; }
});

/* q32d (also uses q24: n = c ÷ v). The film's speed is drawn so that n is exact to 3 places. Backing: air (a free-standing sheet),
   or glass; the film and backing indices are at least 0.1 apart. Not the worked example (600 nm, n = 1.25, free-standing, bright). */
const SPEEDS = [2.5, 2.4, 1.6, 1.5, 1.2];
const okQ32d = p => { const nf = 3 / p.v, f = filmCase(p.lam, nf, p.nb, p.bright);
 return Math.abs(nf - p.nb) >= 0.1 && !tie(f.ln, 1) && !tie(f.t, 1) && !(p.lam === 600 && p.v === 2.4 && p.nb === 1 && p.bright === 1); };
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q24', title: 'The film from its light speed',
 brief: 'A sample film arrives labelled only with how fast light travels inside it, and the lab must find the thickness that tunes its reflection.',
 labels: ['index of refraction', 'shifted reflections', 'thickness (nm)'], tolerance: 0.0005,
 gl: [['index of refraction'], ['shifted reflections'], ['thickness (nm)']]
}, {
 canonical: { lam: 540, v: 1.6, nb: 1.52, bright: 1 },
 draw: R => retry(() => ({ lam: 10 * R.int(40, 70), v: R.pick(SPEEDS), nb: R.pick([1, 1.52, 1.65]), bright: R.int(0, 1) }), okQ32d, { lam: 540, v: 1.6, nb: 1.52, bright: 1 }),
 build: p => { const { lam, v, nb, bright } = p, nf = 3 / v, f = filmCase(lam, nf, nb, bright), word = bright ? 'bright' : 'dark', back = nb === 1 ? 'air' : 'glass',
  where = nb === 1 ? 'a free-standing sheet with air on both sides' : `laid on glass of index n = ${n(nb)}, with air above it`; return {
  prompt: `Light travels at ${n(v)} × 10⁸ m/s inside a new film, and at 3.00 × 10⁸ m/s in air. The film is ${where}. Light of wavelength ${n(lam)} nm in air falls straight on it, and the lab wants the reflection as ${word} as possible. Enter the index of refraction of the film, to 3 decimal places. Then enter how many of the two reflections, off the top and off the bottom of the film, pick up a half-wavelength shift. Then enter the smallest thickness above zero that gives a ${word} reflection, in nanometres to 1 decimal place.`,
  answer: [rd(nf, 3), f.shifts, rd(f.t, 1)],
  hints: ['The index of refraction is the speed of light in air divided by its speed in the material: n = c ÷ v.', 'A reflection picks up a half-wavelength shift only where the light meets a material of higher index. Check the top surface and the bottom surface separately.', 'Inside the film the wavelength is λ ÷ n, and the bottom reflection travels an extra 2t. With one shift, bright needs 2t to be half a film wavelength; with two shifts, bright needs a whole one. Dark is the other way round.'],
  solution: `n = c ÷ v = 3.00 ÷ ${n(v)} ${val(nf, 3)}. The top surface goes from air (n = 1) to the higher n = ${n(nf)}, so it shifts; ${bottomText(nf, nb, back)}. That is ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}. Inside the film λn = ${n(lam)} ÷ ${n(nf)} ${val(f.ln, 1, 'nm')}. Here ${filmRule(f.shifts, bright)}: ${filmEq(f.quarter)} ${val(f.t, 1, 'nm')}.`,
  guidance: [
   { prompt: `The index of refraction is n = c ÷ v with c = 3.00 × 10⁸ m/s and v = ${n(v)} × 10⁸ m/s. What is n, to 3 decimal places?`, answer: [rd(nf, 3)], explanation: `n = 3.00 ÷ ${n(v)} ${val(nf, 3)}.` },
   { prompt: `The top reflection is air into the film (n from 1 to ${n(nf)}); the bottom one is the film into ${back}${nb === 1 ? '' : ` (n = ${n(nb)})`}. How many of the two reflections pick up a half-wavelength shift?`, answer: [f.shifts], explanation: `The top surface goes from n = 1 to n = ${n(nf)}, which is higher, so it shifts; ${bottomText(nf, nb, back)}. That makes ${n(f.shifts)}.` },
   { prompt: `Inside the film the wavelength is λ ÷ n = ${n(lam)} ÷ ${n(nf)} nm. With ${n(f.shifts)} shift${f.shifts === 1 ? '' : 's'}, what is the smallest thickness above zero that gives a ${word} reflection, in nanometres to 1 decimal place?`, answer: [rd(f.t, 1)], explanation: `λn ${val(f.ln, 1, 'nm')}. Here ${filmRule(f.shifts, bright)}: ${filmEq(f.quarter)} ${val(f.t, 1, 'nm')}.` }
  ] }; }
});

/* ---- q33 The Michelson interferometer: counting fringes to measure distance [V3 3.5] ---- */

/* q33b: two dial readings. The end reading is a whole number of fringes past the start, so the count is whole in every draw.
   λ is even, so λ ÷ 2 is a whole number of nanometres and the distance is exact to 3 places. Not the worked example (500 nm, 40 fringes). */
const okQ33b = p => { const N = (p.x2 - p.x1) * 2000 / p.lam; return Math.abs(N - Math.round(N)) < 1e-6 && !(p.lam === 500 && Math.round(N) === 40); };
mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The mirror dial',
 brief: 'The mirror of the Fringe Lab’s interferometer sits on a micrometre dial, and Mira wants to turn two dial readings into a fringe count.',
 labels: ['distance moved (μm)', 'fringes counted'], tolerance: 0.0005,
 gl: [['distance moved (μm)'], ['shift per fringe (nm)'], ['fringes counted']]
}, {
 canonical: { x1: 12.35, x2: 43.55, lam: 520 },
 draw: R => retry(() => { const lam = 2 * R.int(200, 350), x1 = R.int(500, 3000) / 100; return { x1, x2: rd(x1 + R.int(20, 400) * lam / 2000, 3), lam }; }, okQ33b, { x1: 12.35, x2: 43.55, lam: 520 }),
 build: ({ x1, x2, lam }) => { const dist = rd(x2 - x1, 3), h = lam / 2, N = Math.round(dist * 1000 / h); return {
  prompt: `The micrometre dial on the moving mirror of the Fringe Lab’s Michelson interferometer reads ${n(x1)} μm before one slow move and ${n(x2)} μm after it. The lamp has wavelength ${n(lam)} nm. The mirror moved only one way, so each fringe passed the mark once. Enter how far the mirror moved, in micrometres (μm) to 3 decimal places; then enter how many bright fringes passed the mark in the eyepiece.`,
  answer: [dist, N],
  hints: ['Subtract the two dial readings to get the distance moved.', 'One fringe passes for every λ ÷ 2 of mirror move, because the light goes to the mirror and back. Put the distance and λ ÷ 2 in the same unit (1 μm = 1000 nm) and divide.'],
  solution: `The mirror moved ${n(x2)} − ${n(x1)} = ${fx(dist, 3)} μm, which is ${n(dist * 1000)} nm. One fringe is a move of λ ÷ 2 = ${n(lam)} ÷ 2 = ${n(h)} nm, so the number of fringes is ${n(dist * 1000)} ÷ ${n(h)} = ${n(N)}.`,
  guidance: [
   { prompt: `The dial reads ${n(x1)} μm and then ${n(x2)} μm. How far did the mirror move, in micrometres to 3 decimal places?`, answer: [dist], explanation: `${n(x2)} − ${n(x1)} = ${fx(dist, 3)} μm.` },
   { prompt: `One fringe passes for every λ ÷ 2 of mirror move. With λ = ${n(lam)} nm, how far does the mirror move for one fringe, in nanometres?`, answer: [h], explanation: `λ ÷ 2 = ${n(lam)} ÷ 2 = ${n(h)} nm.` },
   { prompt: `The move was ${fx(dist, 3)} μm, which is ${n(dist * 1000)} nm. How many fringes passed?`, answer: [N], explanation: `${n(dist * 1000)} ÷ ${n(h)} = ${n(N)}.` }
  ] }; }
});

/* q33c: a strain rod pushes the mirror as it warms. The second temperature rise gives a whole number of fringes, because the
   rod grows the same amount per degree. λ even, so the growth is exact to 3 places; the growth per degree is kept off ties. */
const okQ33c = p => p.dT2 !== p.dT && (p.N * p.dT2) % p.dT === 0 && p.N * p.dT2 / p.dT < 1000 && !tie(p.N * p.lam / 2000 / p.dT, 3);
mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'The strain rod',
 brief: 'A rod on the Signal Ridge mast grows a little as it warms, and the interferometer is the only instrument fine enough to measure how much.',
 labels: ['growth (μm)', 'growth per degree (μm per °C)', 'fringes counted'], tolerance: 0.0005,
 gl: [['growth (μm)'], ['growth per degree (μm per °C)'], ['fringes counted']]
}, {
 canonical: { lam: 540, N: 120, dT: 8, dT2: 20 },
 draw: R => retry(() => ({ lam: 2 * R.int(200, 350), N: R.int(30, 300), dT: R.pick([4, 5, 8, 10, 12, 15, 20]), dT2: R.pick([6, 10, 16, 20, 24, 30, 40, 50]) }), okQ33c, { lam: 540, N: 120, dT: 8, dT2: 20 }),
 build: ({ lam, N, dT, dT2 }) => { const h = lam / 2, g = N * h / 1000, per = g / dT, N2 = N * dT2 / dT; return {
  prompt: `A rod holds the moving mirror of the Fringe Lab’s Michelson interferometer, and the rod pushes the mirror out as it warms. The lamp has wavelength ${n(lam)} nm. While the rod warms by ${n(dT)} °C, ${n(N)} bright fringes pass the mark. Assume the rod grows by the same amount for every degree. Enter how far the rod grew, in micrometres (μm) to 3 decimal places; then how much it grows for each degree, in micrometres per °C to 3 decimal places; then how many fringes would pass if it warmed by ${n(dT2)} °C instead.`,
  answer: [g, rd(per, 3), N2],
  hints: ['One fringe passes for every λ ÷ 2 that the mirror moves, so the growth is the number of fringes times λ ÷ 2. Turn nanometres into micrometres at the end (1 μm = 1000 nm).', 'Growth for each degree is the total growth divided by the number of degrees it took.', 'The rod grows the same amount for every degree, so the number of fringes is in proportion to the temperature rise.'],
  solution: `One fringe is a mirror move of λ ÷ 2 = ${n(lam)} ÷ 2 = ${n(h)} nm. ${n(N)} fringes: ${n(N)} × ${n(h)} = ${n(N * h)} nm = ${fx(g, 3)} μm. Spread over ${n(dT)} °C that is ${fx(g, 3)} ÷ ${n(dT)} ${val(per, 3, 'μm per °C')}. A rise of ${n(dT2)} °C is ${n(dT2)} ÷ ${n(dT)} times as big, so ${n(N)} × ${n(dT2)} ÷ ${n(dT)} = ${n(N2)} fringes pass.`,
  guidance: [
   { prompt: `One fringe passes for every λ ÷ 2 of mirror move, and ${n(N)} fringes passed with λ = ${n(lam)} nm. How far did the rod grow, in micrometres to 3 decimal places?`, answer: [g], explanation: `${n(N)} × ${n(h)} nm = ${n(N * h)} nm = ${fx(g, 3)} μm.` },
   { prompt: `That growth took ${n(dT)} °C of warming. How much does the rod grow for each degree, in micrometres per °C to 3 decimal places?`, answer: [rd(per, 3)], explanation: `${fx(g, 3)} ÷ ${n(dT)} ${val(per, 3, 'μm per °C')}.` },
   { prompt: `The rod grows the same amount for every degree. How many fringes pass when it warms by ${n(dT2)} °C?`, answer: [N2], explanation: `${n(N)} fringes for ${n(dT)} °C, so ${n(N)} × ${n(dT2)} ÷ ${n(dT)} = ${n(N2)} fringes for ${n(dT2)} °C.` }
  ] }; }
});

/* q33d (also uses q32: the wavelength in a material is λ ÷ n). The oil wavelength is exact to 1 place in every draw, so it
   can be halved and multiplied without a rounded intermediate; the total shift is kept off 3-place ties. Not the worked example. */
const okQ33d = p => { const ln = p.lam / p.nIdx; return exact(ln, 1) && !tie(p.N * ln / 2000, 3) && !(p.lam === 500 && p.N === 40); };
mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q32', title: 'The oil-filled interferometer',
 brief: 'For a test run the Fringe Lab fills the whole interferometer with clear oil, and the fringe count no longer means what it did in air.',
 labels: ['wavelength in the oil (nm)', 'mirror shift (μm)'], tolerance: 0.0005,
 gl: [['wavelength in the oil (nm)'], ['shift per fringe (nm)'], ['mirror shift (μm)']]
}, {
 canonical: { lam: 560, nIdx: 1.25, N: 250 },
 draw: R => retry(() => ({ lam: 10 * R.int(40, 70), nIdx: R.pick([1.25, 1.4, 1.5, 1.6]), N: R.int(20, 400) }), okQ33d, { lam: 560, nIdx: 1.25, N: 250 }),
 build: ({ lam, nIdx, N }) => { const ln = lam / nIdx, h = ln / 2, tot = N * h / 1000; return {
  prompt: `For a test, the Fringe Lab fills both arms of its Michelson interferometer with a clear oil of index n = ${n(nIdx)}. In the oil the light has wavelength λ ÷ n, where λ = ${n(lam)} nm is the wavelength in air. The light goes to the moving mirror and back, so its path changes by twice the mirror’s move, and one bright fringe passes the mark each time that path changes by one wavelength in the oil. ${n(N)} bright fringes pass. Enter the wavelength of the light in the oil, in nanometres to 1 decimal place; then enter how far the mirror moved, in micrometres (μm) to 3 decimal places.`,
  answer: [rd(ln, 1), rd(tot, 3)],
  hints: ['In a material of index n the wavelength shrinks from λ to λ ÷ n.', 'One fringe means the path changed by one wavelength in the oil, and the path changes by twice the mirror’s move, so one fringe is a mirror move of half that wavelength. Multiply by the number of fringes, and turn nanometres into micrometres at the end (1 μm = 1000 nm).'],
  solution: `In the oil λn = ${n(lam)} ÷ ${n(nIdx)} ${val(ln, 1, 'nm')}. The path changes by twice the mirror’s move, so one fringe is a move of λn ÷ 2 = ${n(h)} nm. ${n(N)} fringes: ${n(N)} × ${n(h)} = ${n(N * h)} nm ${val(tot, 3, 'μm')} (1 μm = 1000 nm).`,
  guidance: [
   { prompt: `In the oil the wavelength is λ ÷ n = ${n(lam)} ÷ ${n(nIdx)} nm. What is it, in nanometres to 1 decimal place?`, answer: [rd(ln, 1)], explanation: `${n(lam)} ÷ ${n(nIdx)} ${val(ln, 1, 'nm')}. The light slows down in the oil, so its waves bunch up.` },
   { prompt: `One fringe is a change of one oil wavelength in the path, and the path changes by twice the mirror’s move. How far does the mirror move for one fringe, in nanometres?`, answer: [h], explanation: `λn ÷ 2 = ${n(ln)} ÷ 2 = ${n(h)} nm.` },
   { prompt: `${n(N)} fringes pass. How far did the mirror move, in micrometres to 3 decimal places?`, answer: [rd(tot, 3)], explanation: `${n(N)} × ${n(h)} nm = ${n(N * h)} nm ${val(tot, 3, 'μm')}.` }
  ] }; }
});

/* ---- q34 Single-slit diffraction minima, a sin θ = mλ [V3 4.1] ---- */

/* q34b: the slit width from a measured central band, then a dark fringe angle. a (μm) = 2Dλ ÷ width, with λ in nm, D in m and the
   width in mm. Draws keep the angle small enough for the band to be measured, avoid ties, and avoid draws where the rounded
   width would change the angle's last digit. Not the worked example (25 μm, 550 nm, 2 m). */
const okQ34b = p => { const a = 2 * p.D * p.lam / p.w, s = p.m * p.lam / (1000 * a), th = Math.asin(s);
 return a >= 10 && a <= 120 && s < 0.3 && !tie(a, 2) && !tie(th, 4) && rd(Math.asin(p.m * p.lam / (1000 * rd(a, 2))), 4) === rd(th, 4) && !(p.lam === 550 && p.D === 2 && p.w === 88); };
mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The gap in the shield plate',
 brief: 'A narrow gap has opened in a shield plate at the Fringe Lab, and Mira wants its width without touching it.',
 labels: ['gap width (μm)', 'angle of the dark fringe (rad)'], tolerance: 0.00005,
 gl: [['gap width (μm)'], ['angle of the dark fringe (rad)']]
}, {
 canonical: { lam: 540, D: 2.5, w: 45, m: 3 },
 draw: R => retry(() => ({ lam: 10 * R.int(40, 70), D: R.pick([1.5, 2, 2.5, 3, 4]), w: R.int(6, 80), m: R.int(2, 4) }), okQ34b, { lam: 540, D: 2.5, w: 45, m: 3 }),
 build: ({ lam, D, w, m }) => { const a = 2 * D * lam / w, s = m * lam / (1000 * a), th = Math.asin(s); return {
  prompt: `A narrow gap has opened in a shield plate in the Fringe Lab. Mira shines light of wavelength ${n(lam)} nm through it onto a screen ${n(D)} m behind the plate, and measures the central bright band, from the first dark fringe on one side to the first on the other, as ${n(w)} mm wide. Treat the gap as a single slit and use the small-angle approximation for the band. Enter the width of the gap, in micrometres (μm) to 2 decimal places; then enter the angle of the dark fringe of order m = ${n(m)} from the straight-through direction, in radians to 4 decimal places.`,
  answer: [rd(a, 2), rd(th, 4)],
  hints: ['The central band is 2Dλ ÷ a wide, so a = 2Dλ ÷ the band width. Put λ, D and the width in metres (1 nm = 10⁻⁹ m, 1 mm = 10⁻³ m), then give a in micrometres.', 'The dark fringe of order m is at sin θ = mλ ÷ a. Put a and λ in the same unit (1 μm = 1000 nm), take arcsin, and keep your calculator in radians.'],
  solution: `The central band is 2Dλ ÷ a wide, so a = 2Dλ ÷ width. In metres that is 2 × ${n(D)} × ${n(lam)} × 10⁻⁹ ÷ (${n(w)} × 10⁻³) m, and in micrometres it is 2 × ${n(D)} × ${n(lam)} ÷ ${n(w)} ${val(a, 2, 'μm')}. Then sin θ = mλ ÷ a = ${n(m)} × ${n(lam)} ÷ (1000 × ${n(a)}) ${val(s, 4)}, so θ = arcsin of that ${val(th, 4, 'rad')}.`,
  guidance: [
   { prompt: `The central band is 2Dλ ÷ a wide for small angles. Solve for a with D = ${n(D)} m, λ = ${n(lam)} nm and a band ${n(w)} mm wide. What is a, in micrometres to 2 decimal places?`, answer: [rd(a, 2)], explanation: `a = 2Dλ ÷ width = 2 × ${n(D)} × ${n(lam)} ÷ ${n(w)} ${val(a, 2, 'μm')} once nanometres, metres and millimetres are turned into micrometres.` },
   { prompt: `Use the unrounded value of a. The dark fringe of order m = ${n(m)} is at sin θ = mλ ÷ a, with a in nanometres (1 μm = 1000 nm). What is θ, in radians to 4 decimal places?`, answer: [rd(th, 4)], explanation: `sin θ = ${n(m)} × ${n(lam)} ÷ (1000 × ${n(a)}) ${val(s, 4)}, and θ = arcsin of that ${val(th, 4, 'rad')}.` }
  ] }; }
});

/* q34c: a detector strip of half-height H. The first dark fringe is at y = Dλ ÷ a (mm when D is in m, λ in nm, a in μm), the
   m-th is m times as far, and the count of dark fringes on one side is the whole number of y that fit in H. H ÷ y is kept
   at least 0.15 away from a whole number, and the doubled width must not round differently from twice the rounded y. */
const okQ34c = p => { const y = p.D * p.lam / p.a, r = p.H / y, c = Math.floor(r), f = r - c;
 return !tie(y, 2) && rd(2 * rd(y, 2), 2) === rd(2 * y, 2) && c >= 2 && c <= 8 && f >= 0.15 && f <= 0.85; };
mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'The detector strip',
 brief: 'A strip of light detectors is bolted across the lab wall, and Mira needs to know how many dark fringes land on it.',
 labels: ['first dark fringe distance (mm)', 'central band width (mm)', 'dark fringes on one side'], tolerance: 0.005,
 gl: [['first dark fringe distance (mm)'], ['central band width (mm)'], ['dark fringes on one side']]
}, {
 canonical: { a: 50, lam: 600, D: 2.5, H: 100 },
 draw: R => retry(() => ({ a: R.pick([30, 40, 50, 60, 75, 80, 100]), lam: 10 * R.int(40, 70), D: R.pick([1.5, 2, 2.5, 3, 4]), H: R.int(20, 150) }), okQ34c, { a: 50, lam: 600, D: 2.5, H: 100 }),
 build: ({ a, lam, D, H }) => { const y = D * lam / a, w = 2 * y, c = Math.floor(H / y); return {
  prompt: `A strip of detectors across the Fringe Lab’s screen runs ${n(H)} mm to either side of the centre of a single-slit pattern. The slit is ${n(a)} μm wide, the light has wavelength ${n(lam)} nm and the screen is ${n(D)} m away. Use the small-angle approximation, which puts the dark fringe of order m exactly m times as far from the centre as the first one. Enter the distance from the centre to the first dark fringe, in millimetres to 2 decimal places; then the width of the central bright band, in millimetres to 2 decimal places; then how many dark fringes fall on the strip on one side of the centre (none lies exactly on the strip’s end).`,
  answer: [rd(y, 2), rd(w, 2), c],
  hints: ['For small angles the first dark fringe is y = Dλ ÷ a from the centre. Put D, λ and a in metres, then turn the result into millimetres.', 'The central band reaches the first dark fringe on both sides, so it is twice as wide as that distance.', 'The dark fringe of order m is m times y from the centre. Count how many whole multiples of y fit inside the strip’s half-length.'],
  solution: `The first dark fringe is y = Dλ ÷ a from the centre. In millimetres that is ${n(D)} × ${n(lam)} ÷ ${n(a)} ${val(y, 2, 'mm')} (the powers of ten leave a factor 1 when D is in metres, λ in nanometres and a in micrometres). The central band is twice that: 2 × ${n(y)} ${val(w, 2, 'mm')}. The dark fringe of order m is m × ${n(y)} mm from the centre, and ${n(H)} ÷ ${n(y)} ${val(H / y, 2)}, so ${n(c)} whole multiples fit: the dark fringes of orders 1 to ${n(c)} fall on the strip, which is ${n(c)} on one side.`,
  guidance: [
   { prompt: `For small angles the first dark fringe is y = Dλ ÷ a from the centre. With D = ${n(D)} m, λ = ${n(lam)} nm and a = ${n(a)} μm, how far is that, in millimetres to 2 decimal places?`, answer: [rd(y, 2)], explanation: `y = ${n(D)} × ${n(lam)} ÷ ${n(a)} ${val(y, 2, 'mm')}.` },
   { prompt: `The central band runs from the first dark fringe on one side to the first on the other. How wide is it, in millimetres to 2 decimal places?`, answer: [rd(w, 2)], explanation: `Twice the distance to the first dark fringe: 2 × ${n(y)} ${val(w, 2, 'mm')}.` },
   { prompt: `The dark fringe of order m is m × ${n(y)} mm from the centre. The strip reaches ${n(H)} mm out on one side. How many dark fringes fall on that side of the strip?`, answer: [c], explanation: `${n(H)} ÷ ${n(y)} ${val(H / y, 2)}, so ${n(c)} whole multiples of ${n(y)} mm fit inside ${n(H)} mm.` }
  ] }; }
});

/* q34d (also uses q07: v = fλ, with c = 3.00 × 10⁸ m/s). Microwaves through a slot, so the angles are large and the exact
   geometry is used. λ = 30 ÷ f cm is exact to 2 places for every frequency in the list. The first dark fringe is D tan θ₁, and
   the width is kept from changing its last digit if θ₁ is rounded first. */
const FREQS = [5, 6, 7.5, 10, 12, 15, 20, 24, 25, 30];
const okQ34d = p => { const lamCm = 30 / p.f, s1 = lamCm / p.a, sm = p.m * lamCm / p.a;
 if (s1 < 0.1 || sm > 0.85) return false;
 const th1 = Math.asin(s1), w = 2 * p.D * Math.tan(th1), thm = Math.asin(sm);
 return exact(lamCm, 2) && !tie(thm, 4) && !tie(w, 3) && rd(2 * p.D * Math.tan(rd(th1, 4)), 3) === rd(w, 3) && !(p.f === 10 && p.a === 6 && p.m === 2); };
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q07', title: 'Microwaves through a slot',
 brief: 'The Signal Ridge sweeps a detector behind a metal slot to see how a microwave beam spreads, and the angles are too big to approximate.',
 labels: ['wavelength (cm)', 'angle of the dark fringe (rad)', 'central band width (m)'], tolerance: 0.00005,
 gl: [['wavelength (cm)'], ['angle of the dark fringe (rad)'], ['central band width (m)']]
}, {
 canonical: { f: 10, a: 8, D: 2, m: 2 },
 draw: R => retry(() => ({ f: R.pick(FREQS), a: R.pick([4, 5, 6, 8, 10, 12, 15, 20]), D: R.pick([1.5, 2, 2.5, 3, 4]), m: R.int(2, 4) }), okQ34d, { f: 10, a: 8, D: 2, m: 2 }),
 build: ({ f, a, D, m }) => { const lamCm = 30 / f, s1 = lamCm / a, th1 = Math.asin(s1), y1 = D * Math.tan(th1), w = 2 * y1, sm = m * lamCm / a, thm = Math.asin(sm); return {
  prompt: `At the Signal Ridge a microwave beam of frequency ${n(f)} GHz (1 GHz = 10⁹ Hz) passes through a slot ${n(a)} cm wide in a metal plate, and a detector is swept across a wall ${n(D)} m behind the plate. Microwaves travel at the speed of light, 3.00 × 10⁸ m/s, and the slot spreads them just as a single slit spreads light. Enter the wavelength of the microwaves, in centimetres to 2 decimal places. Then enter the angle of the dark fringe of order m = ${n(m)}, in radians to 4 decimal places. Then enter the width of the central band on the wall, from the first dark fringe on one side to the first on the other, in metres to 3 decimal places. These angles are not small, so do not use the small-angle approximation: a dark fringe at angle θ is D × tan θ from the centre of the wall.`,
  answer: [rd(lamCm, 2), rd(thm, 4), rd(w, 3)],
  hints: ['For any wave, speed = frequency × wavelength, so λ = c ÷ f. Remember that 1 GHz is 10⁹ Hz, and give the answer in centimetres (1 m = 100 cm).', 'The dark fringe of order m is at sin θ = mλ ÷ a, with λ and a in the same unit. Take arcsin with your calculator in radians.', 'The first dark fringe (m = 1) is at sin θ = λ ÷ a. Its distance from the centre of the wall is D × tan θ, and the central band reaches that far on both sides.'],
  solution: `λ = c ÷ f = 3.00 × 10⁸ ÷ (${n(f)} × 10⁹) m = ${n(lamCm / 100)} m = ${n(lamCm)} cm. The dark fringe of order ${n(m)}: sin θ = mλ ÷ a = ${n(m)} × ${n(lamCm)} ÷ ${n(a)} ${val(sm, 4)}, so θ = arcsin of that ${val(thm, 4, 'rad')}. The first dark fringe has sin θ₁ = λ ÷ a = ${n(lamCm)} ÷ ${n(a)} ${val(s1, 4)}, so θ₁ ${val(th1, 4, 'rad')}. It is D tan θ₁ = ${n(D)} × tan θ₁ ${val(y1, 3, 'm')} from the centre, and the central band is twice that: ${val(w, 3, 'm')}.`,
  guidance: [
   { prompt: `Speed = frequency × wavelength, so λ = c ÷ f with c = 3.00 × 10⁸ m/s and f = ${n(f)} GHz = ${n(f)} × 10⁹ Hz. What is λ, in centimetres to 2 decimal places?`, answer: [rd(lamCm, 2)], explanation: `λ = 3.00 × 10⁸ ÷ (${n(f)} × 10⁹) m = ${n(lamCm / 100)} m = ${n(lamCm)} cm.` },
   { prompt: `The dark fringe of order m = ${n(m)} is at sin θ = mλ ÷ a, with λ = ${n(lamCm)} cm and a = ${n(a)} cm. What is θ, in radians to 4 decimal places?`, answer: [rd(thm, 4)], explanation: `sin θ = ${n(m)} × ${n(lamCm)} ÷ ${n(a)} ${val(sm, 4)}, and θ = arcsin of that ${val(thm, 4, 'rad')}.` },
   { prompt: `For the first dark fringe, sin θ₁ = λ ÷ a. The central band is 2 × D × tan θ₁ wide on the wall. Using the unrounded angle, how wide is it, in metres to 3 decimal places?`, answer: [rd(w, 3)], explanation: `sin θ₁ = ${n(lamCm)} ÷ ${n(a)} ${val(s1, 4)}, so θ₁ ${val(th1, 4, 'rad')}. The band is 2 × ${n(D)} × tan θ₁ ${val(w, 3, 'm')}.` }
  ] }; }
});

/* ---- q35 Intensity in a single-slit pattern [V3 4.2] ---- */

/* q35b: a photodiode reads the centre at I₀ mW/m². I₀ is kept small enough that rounding the share to 3 places first
   cannot change the reading's last digit. Not the worked example (8 μm, 600 nm, 0.02 rad). */
const okQ35b = p => { const b = PI * p.a * 1000 * Math.sin(p.th) / p.lam, { I } = share(b);
 return b > 0.3 && b < 6 && farFromDark(b) && I >= 0.01 && cleanB(b) && !tie(p.I0 * I, 1) && rd(p.I0 * rd(I, 3), 1) === rd(p.I0 * I, 1) && !(p.a === 8 && p.lam === 600 && p.th === 0.02); };
mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The photodiode reading',
 brief: 'A photodiode behind a test slit gives its reading in milliwatts per square metre, and Mira wants to know what it should read away from the centre.',
 labels: ['β (rad)', 'reading (mW/m²)'], tolerance: 0.0005,
 gl: [['β (rad)'], ['sin β ÷ β'], ['reading (mW/m²)']]
}, {
 canonical: { a: 12, lam: 480, th: 0.025, I0: 64 },
 draw: R => retry(() => ({ a: R.pick([5, 8, 10, 12, 15, 20]), lam: 10 * R.int(40, 70), th: R.int(5, 60) / 1000, I0: R.int(10, 99) }), okQ35b, { a: 12, lam: 480, th: 0.025, I0: 64 }),
 build: ({ a, lam, th, I0 }) => { const st = Math.sin(th), b = PI * a * 1000 * st / lam, { s, I } = share(b), R0 = I0 * I; return {
  prompt: `A photodiode in the Crystal Observatory sits at the centre of the pattern behind a slit ${n(a)} μm wide, lit by light of wavelength ${n(lam)} nm, and reads ${n(I0)} mW/m² there. Mira moves it to θ = ${n(th)} rad from the centre. Enter β = πa sin θ ÷ λ, in radians to 3 decimal places; then what the photodiode should read now, in mW/m² to 1 decimal place. Keep full calculator precision until the last step.`,
  answer: [rd(b, 3), rd(R0, 1)],
  hints: ['β = πa sin θ ÷ λ, with a and λ in the same unit (1 μm = 1000 nm) and your calculator in radians.', 'The reading is the centre’s reading times I ÷ I₀, and I ÷ I₀ = (sin β ÷ β)². Work out sin β, divide by β, square it, then multiply.'],
  solution: `sin θ = sin(${n(th)}) ${val(st, 4)}. β = π × ${n(1000 * a)} × sin θ ÷ ${n(lam)} ${val(b, 3, 'rad')}. Then sin β ÷ β ${val(s, 3)} and I ÷ I₀ = (sin β ÷ β)² ${val(I, 3)}. The reading is ${n(I0)} × ${n(I)} ${val(R0, 1, 'mW/m²')}.`,
  guidance: [
   { prompt: `With a = ${n(a)} μm = ${n(1000 * a)} nm, λ = ${n(lam)} nm and θ = ${n(th)} rad, what is β = πa sin θ ÷ λ, in radians to 3 decimal places?`, answer: [rd(b, 3)], explanation: `sin(${n(th)}) ${val(st, 4)}, and π × ${n(1000 * a)} × sin θ ÷ ${n(lam)} ${val(b, 3, 'rad')}.` },
   { prompt: `What is sin β ÷ β, to 3 decimal places?`, answer: [rd(s, 3)], explanation: `sin β ÷ β ${val(s, 3)}${s < 0 ? '. It is negative because β is past π, but the square will be positive' : ''}.` },
   { prompt: `The photodiode reads ${n(I0)} mW/m² at the centre and I ÷ I₀ = (sin β ÷ β)² at θ. What does it read now, in mW/m² to 1 decimal place?`, answer: [rd(R0, 1)], explanation: `I ÷ I₀ ${val(I, 3)}, so the reading is ${n(I0)} × ${n(I)} ${val(R0, 1, 'mW/m²')}.` }
  ] }; }
});

/* q35c: two detectors. A is inside the central peak (β below π) and B is in the first side band (β between π and 2π), so A always
   reads more. Every share is kept clear of ties and of early rounding, and so is the difference of the two shares. */
const okQ35c = p => { const bA = PI * p.a * 1000 * Math.sin(p.thA) / p.lam, bB = PI * p.a * 1000 * Math.sin(p.thB) / p.lam, A = share(bA).I, B = share(bB).I;
 return bA > 0.3 && bA < PI - 0.3 && bB > PI + 0.3 && bB < 2 * PI - 0.3 && cleanB(bA) && cleanB(bB) && !tie(A - B, 3) && rd(rd(A, 3) - rd(B, 3), 3) === rd(A - B, 3); };
mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Two detectors on the wall',
 brief: 'Two detectors are bolted to the observatory wall behind a slit, and Mira wants to know how much more light the nearer one gets.',
 labels: ['A’s share of the centre', 'B’s share of the centre', 'difference'], tolerance: 0.0005,
 gl: [['A’s share of the centre'], ['B’s share of the centre'], ['difference']]
}, {
 canonical: { a: 10, lam: 500, thA: 0.02, thB: 0.06 },
 draw: R => retry(() => ({ a: R.pick([5, 8, 10, 12, 15, 20]), lam: 10 * R.int(40, 70), thA: R.int(5, 60) / 1000, thB: R.int(20, 120) / 1000 }), okQ35c, { a: 10, lam: 500, thA: 0.02, thB: 0.06 }),
 build: ({ a, lam, thA, thB }) => { const bA = PI * a * 1000 * Math.sin(thA) / lam, bB = PI * a * 1000 * Math.sin(thB) / lam, sA = share(bA), sB = share(bB), diff = sA.I - sB.I; return {
  prompt: `Two detectors sit behind a slit ${n(a)} μm wide in the Crystal Observatory, lit by light of wavelength ${n(lam)} nm. Detector A is at θ = ${n(thA)} rad from the centre of the pattern, inside the central peak. Detector B is at θ = ${n(thB)} rad, in the first dim side band, beyond the first dark fringe. Enter the intensity at A as a fraction of the intensity at the centre, I ÷ I₀, to 3 decimal places; then the same for B; then how much more of the centre’s intensity A gets than B, to 3 decimal places. Keep full calculator precision until the last step of each.`,
  answer: [rd(sA.I, 3), rd(sB.I, 3), rd(diff, 3)],
  hints: ['For each detector work out β = πa sin θ ÷ λ, with a and λ in the same unit (1 μm = 1000 nm) and your calculator in radians.', 'Then I ÷ I₀ = (sin β ÷ β)². The square makes the share positive even when sin β ÷ β is negative.', 'How much more A gets is A’s fraction minus B’s fraction.'],
  solution: `Detector A: β = π × ${n(1000 * a)} × sin(${n(thA)}) ÷ ${n(lam)} ${val(bA, 3, 'rad')}, sin β ÷ β ${val(sA.s, 3)}, so I ÷ I₀ = (sin β ÷ β)² ${val(sA.I, 3)}. Detector B: β = π × ${n(1000 * a)} × sin(${n(thB)}) ÷ ${n(lam)} ${val(bB, 3, 'rad')}, sin β ÷ β ${val(sB.s, 3)} (negative, because β is past π), so I ÷ I₀ ${val(sB.I, 3)}. A gets ${n(sA.I)} − ${n(sB.I)} ${val(diff, 3)} more of the centre’s intensity.`,
  guidance: [
   { prompt: `For detector A, with a = ${n(a)} μm = ${n(1000 * a)} nm, λ = ${n(lam)} nm and θ = ${n(thA)} rad, what is β = πa sin θ ÷ λ, in radians to 3 decimal places?`, answer: [rd(bA, 3)], explanation: `π × ${n(1000 * a)} × sin(${n(thA)}) ÷ ${n(lam)} ${val(bA, 3, 'rad')}.` },
   { prompt: `For detector A, what is I ÷ I₀ = (sin β ÷ β)², to 3 decimal places?`, answer: [rd(sA.I, 3)], explanation: `sin β ÷ β ${val(sA.s, 3)}, and its square ${val(sA.I, 3)}.` },
   { prompt: `For detector B, at θ = ${n(thB)} rad, what is I ÷ I₀ = (sin β ÷ β)², to 3 decimal places?`, answer: [rd(sB.I, 3)], explanation: `β = π × ${n(1000 * a)} × sin(${n(thB)}) ÷ ${n(lam)} ${val(bB, 3, 'rad')}. Then sin β ÷ β ${val(sB.s, 3)} and its square ${val(sB.I, 3)}.` }
  ] }; }
});

/* q35d (also uses q31: for a small angle, sin θ ≈ θ = y ÷ D). The first dark fringe is y = Dλ ÷ a (mm for D in m, λ in nm, a in μm).
   Draws keep β clear of every dark fringe, and keep the angle small. Not the worked example (8 μm, 600 nm, 0.02 rad). */
const okQ35d = p => { const th = p.y / 1000 / p.D, b = PI * p.a * 1000 * th / p.lam, { I } = share(b);
 return th < 0.1 && b > 0.3 && b < 6 && farFromDark(b) && I >= 0.01 && cleanB(b) && !tie(p.D * p.lam / p.a, 2) && !(p.a === 8 && p.lam === 600 && p.y === 40 && p.D === 2); };
mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q31', title: 'A detector on the ruler',
 brief: 'The observatory places a detector at a measured spot on the ruler, and Mira has to turn that distance into a share of the centre’s light.',
 labels: ['first dark fringe distance (mm)', 'β (rad)', 'I ÷ I₀'], tolerance: 0.0005,
 gl: [['first dark fringe distance (mm)'], ['β (rad)'], ['I ÷ I₀']]
}, {
 canonical: { a: 15, lam: 600, D: 2, y: 30 },
 draw: R => retry(() => ({ a: R.pick([5, 8, 10, 12, 15, 20, 25]), lam: 10 * R.int(40, 70), D: R.pick([1.5, 2, 2.5, 3, 4]), y: R.int(5, 120) }), okQ35d, { a: 15, lam: 600, D: 2, y: 30 }),
 build: ({ a, lam, D, y }) => { const y1 = D * lam / a, th = y / 1000 / D, b = PI * a * 1000 * th / lam, { s, I } = share(b); return {
  prompt: `A detector sits ${n(y)} mm from the centre of a single-slit pattern, on a screen ${n(D)} m from a slit ${n(a)} μm wide, lit by light of wavelength ${n(lam)} nm. The angles are small, so for this detector use sin θ ≈ θ = y ÷ D, with y and D in the same unit. Enter the distance from the centre to the first dark fringe, in millimetres to 2 decimal places. Then enter β = πa sin θ ÷ λ at the detector, in radians to 3 decimal places. Then enter the detector’s intensity as a fraction of the centre’s, I ÷ I₀, to 3 decimal places.`,
  answer: [rd(y1, 2), rd(b, 3), rd(I, 3)],
  hints: ['For small angles the first dark fringe is y = Dλ ÷ a from the centre. Put D, λ and a in metres, then turn the result into millimetres.', 'The angle is θ = y ÷ D in radians, with the distance and D in the same unit. Then β = πa sin θ ÷ λ with a and λ in the same unit (1 μm = 1000 nm).', 'I ÷ I₀ = (sin β ÷ β)². Work out sin β with your calculator in radians, divide by β, then square.'],
  solution: `The first dark fringe is Dλ ÷ a from the centre: ${n(D)} × ${n(lam)} ÷ ${n(a)} ${val(y1, 2, 'mm')} (the powers of ten leave a factor 1 when D is in metres, λ in nanometres and a in micrometres). At the detector θ ≈ ${n(y)} ÷ ${n(1000 * D)} ${val(th, 4, 'rad')}, so β = π × ${n(1000 * a)} × ${n(th)} ÷ ${n(lam)} ${val(b, 3, 'rad')}. Then sin β ÷ β ${val(s, 3)} and I ÷ I₀ = (sin β ÷ β)² ${val(I, 3)}.`,
  guidance: [
   { prompt: `For small angles the first dark fringe is y = Dλ ÷ a from the centre. With D = ${n(D)} m, λ = ${n(lam)} nm and a = ${n(a)} μm, how far is that, in millimetres to 2 decimal places?`, answer: [rd(y1, 2)], explanation: `y = ${n(D)} × ${n(lam)} ÷ ${n(a)} ${val(y1, 2, 'mm')}.` },
   { prompt: `The detector is ${n(y)} mm from the centre on a screen ${n(1000 * D)} mm away, so sin θ ≈ θ = ${n(y)} ÷ ${n(1000 * D)}. What is β = πa sin θ ÷ λ with a = ${n(1000 * a)} nm, in radians to 3 decimal places?`, answer: [rd(b, 3)], explanation: `θ ${val(th, 4, 'rad')}, and β = π × ${n(1000 * a)} × θ ÷ ${n(lam)} ${val(b, 3, 'rad')}.` },
   { prompt: `What is I ÷ I₀ = (sin β ÷ β)² for that β, to 3 decimal places?`, answer: [rd(I, 3)], explanation: `sin β ÷ β ${val(s, 3)}${s < 0 ? ', negative because β is past π, but the square is positive' : ''}, and its square ${val(I, 3)}.` }
  ] }; }
});

})();
