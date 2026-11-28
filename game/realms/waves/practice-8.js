/* Waves: sound and light practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p8.js. */
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
   fx(x, k): x shown with exactly k decimals. val(x, k, unit): "= 2.4" when x is exact to 4 places, else "≈ 2.4567",
   and ", which is 2.46 to 2 decimal places" when rounding to k places changes what was shown. */
const rd = (x, k) => Math.round(x * Math.pow(10, k) + 1e-9) / Math.pow(10, k);
const tie = (x, k) => { const f = Math.abs(x * Math.pow(10, k)) % 1; return Math.abs(f - 0.5) < 0.02; };
const fx = (x, k) => G.tidy(x).toFixed(k);
const val = (x, k, u) => { const four = rd(x, 4), r = rd(x, k), unit = u ? ' ' + u : ''; let s = (Math.abs(x - four) < 1e-9 ? '= ' : '≈ ') + n(four) + unit;
 if (Math.abs(four - r) > 1e-9) s += `, which is ${fx(r, k)}${unit} to ${k} decimal place${k === 1 ? '' : 's'}`; return s; };
const ord = k => { const t = k % 100, u = k % 10; return k + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* True when x is not within 0.05 of a whole number, so "the highest whole order below x" is clear-cut. */
const clearFrac = x => { const f = x - Math.floor(x); return f >= 0.05 && f <= 0.95; };
const asin = Math.asin, sin = Math.sin, tan = Math.tan, atan = Math.atan;

/* ---- q36 Two slits with width: missing orders [V3 4.3] ---- */

/* q36b: a laser mask. Parameters a, d (a whole number of times a), λ, D. The fringe spacing on the wall is Dλ ÷ d (mm for λ in nm, d in μm, D in m). */
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The laser mask',
 brief: 'A foil mask over the reference laser has two slits, and the crew want the fringe spacing on the wall and the orders that will be missing.',
 labels: ['fringe spacing (mm)', 'first missing order', 'bright fringes in central peak'], tolerance: 0.005,
 gl: [['fringe spacing (mm)'], ['first missing order'], ['bright fringes in central peak']]
}, {
 /* Not the q36 worked example (a = 15, d = 45). The fringe spacing is kept off rounding ties. */
 canonical: { a: 30, d: 90, lam: 540, D: 1.5 },
 draw: R => retry(() => { const a = R.pick([10, 12, 15, 20, 25, 30, 40, 50]); return { a, d: a * R.int(2, 6), lam: 10 * R.int(40, 70), D: R.pick([1, 1.5, 2, 2.5, 3]) }; },
  p => !tie(p.D * p.lam / p.d, 2) && !(p.a === 15 && p.d === 45), { a: 30, d: 90, lam: 540, D: 1.5 }),
 build: ({ a, d, lam, D }) => { const k = d / a, dy = D * lam / d, c = 2 * k - 1; return {
  prompt: `A foil mask over the Crystal Observatory’s reference laser has two slits, each ${n(a)} μm wide, with centres ${n(d)} μm apart. The laser’s wavelength is ${n(lam)} nm and the pattern falls on a wall ${n(D)} m away. For small angles neighbouring bright fringes on the wall are Dλ ÷ d apart. Enter that spacing, in millimetres to 2 decimal places; then the lowest order m above 0 of the double-slit bright fringes that is missing; then how many bright fringes are seen inside the central peak of the single-slit pattern, counting the central fringe and leaving out the missing orders at its edges.`,
  answer: [rd(dy, 2), k, c],
  hints: ['With λ in nanometres, d in micrometres and D in metres, Dλ ÷ d comes out in millimetres.', 'A double-slit bright fringe of order m lands on the single-slit pattern’s first dark fringe when m = d ÷ a, and that order is missing. The central peak holds the orders from −(m − 1) to m − 1.'],
  solution: `The spacing is Dλ ÷ d = ${n(D)} × ${n(lam)} ÷ ${n(d)} ${val(dy, 2, 'mm')}. The order that lands on the first dark fringe of one slit is m = d ÷ a = ${n(d)} ÷ ${n(a)} = ${n(k)}, so orders ±${n(k)} are missing. Inside the central peak are the orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} on each side and the central one, ${n(c)} bright fringes.`,
  guidance: [
   { prompt: `Neighbouring bright fringes are Dλ ÷ d apart. With D = ${n(D)} m, λ = ${n(lam)} nm and d = ${n(d)} μm, what is the spacing, in millimetres to 2 decimal places?`, answer: [rd(dy, 2)], explanation: `${n(D)} × ${n(lam)} ÷ ${n(d)} ${val(dy, 2, 'mm')}. The units work out to millimetres.` },
   { prompt: `Which order m lands exactly on the first dark fringe of one slit, with d = ${n(d)} μm and a = ${n(a)} μm?`, answer: [k], explanation: `m = d ÷ a = ${n(d)} ÷ ${n(a)} = ${n(k)}. That bright fringe falls where no light arrives, so it is missing.` },
   { prompt: `Inside the central peak are the orders strictly between −${n(k)} and ${n(k)}. How many bright fringes is that?`, answer: [c], explanation: `Orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} + ${n(k - 1)} + 1 = ${n(c)}.` }
  ] }; }
});

/* q36c: design the mask. d, k (the first missing order wanted) and λ are the parameters; the slit width is d ÷ k. */
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Cutting the mask',
 brief: 'The workshop must cut a mask so that one chosen bright fringe is the first to go missing.',
 labels: ['slit width (μm)', 'angle of first dark fringe (rad)', 'bright fringes in central peak'], tolerance: 0.00005,
 gl: [['slit width (μm)'], ['angle of first dark fringe (rad)'], ['bright fringes in central peak']]
}, {
 /* a = d ÷ k is a whole number of micrometres. Not the q36 worked example (a = 15, d = 45, so k = 3). */
 canonical: { d: 150, k: 5, lam: 450 },
 draw: R => retry(() => { const a = R.pick([10, 12, 15, 20, 25, 30, 40, 50]), k = R.int(2, 7); return { d: a * k, k, lam: 10 * R.int(40, 70) }; },
  p => !tie(asin(p.lam / (1000 * p.d / p.k)), 4) && !(p.d === 45 && p.k === 3), { d: 150, k: 5, lam: 450 }),
 build: ({ d, k, lam }) => { const a = d / k, s = lam / (1000 * a), th = asin(s), c = 2 * k - 1; return {
  prompt: `For a test in the Crystal Observatory, the workshop must cut two equal slits with centres ${n(d)} μm apart, to be lit by light of wavelength ${n(lam)} nm. The crew want the ${ord(k)} order of the double-slit bright fringes to be the first one that is missing from the pattern. Enter the slit width a they must cut, in micrometres; then the angle of the first dark fringe of the single-slit pattern, in radians to 4 decimal places; then how many bright fringes will be seen inside the central peak of the single-slit pattern, counting the central fringe and leaving out the missing orders at its edges.`,
  answer: [a, rd(th, 4), c],
  hints: ['The first missing order is m = d ÷ a, because that bright fringe lands on the first dark fringe of one slit. Turn it round to find a.', 'The first dark fringe of one slit is at a sin θ = λ. Put a and λ in the same unit (1 μm = 1000 nm) and use arcsin with the calculator in radians.', 'Inside the central peak are the orders from −(m − 1) to m − 1, where m is the first missing order.'],
  solution: `The first missing order is m = d ÷ a, so a = d ÷ m = ${n(d)} ÷ ${n(k)} = ${n(a)} μm. The first dark fringe of one slit is at sin θ = λ ÷ a = ${n(lam)} ÷ ${n(1000 * a)} ${val(s, 4)}, so θ ${val(th, 4, 'rad')}. Inside the central peak are the orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} on each side and the central one, ${n(c)} bright fringes.`,
  guidance: [
   { prompt: `The ${ord(k)} order is the first to go missing, so m = d ÷ a with m = ${n(k)}. With d = ${n(d)} μm, what is the slit width a, in micrometres?`, answer: [a], explanation: `a = d ÷ m = ${n(d)} ÷ ${n(k)} = ${n(a)} μm.` },
   { prompt: `The first dark fringe of one slit is at a sin θ = λ. With a = ${n(a)} μm = ${n(1000 * a)} nm and λ = ${n(lam)} nm, what is θ, in radians to 4 decimal places?`, answer: [rd(th, 4)], explanation: `sin θ = ${n(lam)} ÷ ${n(1000 * a)} ${val(s, 4)}, so θ ${val(th, 4, 'rad')}.` },
   { prompt: `The first missing order is ${n(k)}, so the central peak holds the orders strictly between −${n(k)} and ${n(k)}. How many bright fringes is that?`, answer: [c], explanation: `Orders −${n(k - 1)} to ${n(k - 1)}: ${n(k - 1)} + ${n(k - 1)} + 1 = ${n(c)}.` }
  ] }; }
});

/* q36d: d ÷ a is not a whole number. The ratio is p ÷ q in lowest terms (q at least 2), so dark fringe j of one slit lands on order j × p ÷ q and the
   first whole order comes at j = q, order p. The first dark fringes sit at m = ±d ÷ a, so the orders strictly inside are −floor(d ÷ a) … floor(d ÷ a). */
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q31', title: 'A ratio that is not whole',
 brief: 'A test plate has slits whose spacing is not a whole number of widths, so the missing orders are not where the crew expect them.',
 labels: ['first missing order', 'bright fringes inside first dark fringes', 'distance of first missing order (mm)'], tolerance: 0.005,
 gl: [['first missing order'], ['bright fringes inside first dark fringes'], ['distance of first missing order (mm)']]
}, {
 canonical: { a: 24, d: 60, lam: 550, D: 1.5 },
 draw: R => retry(() => { const [p, q] = R.pick([[3, 2], [5, 2], [7, 2], [9, 2], [5, 3], [7, 3], [8, 3], [7, 4], [9, 4]]), u = R.pick([6, 8, 10, 12, 15, 20]);
   return { a: q * u, d: p * u, lam: 10 * R.int(40, 70), D: R.pick([1, 1.5, 2, 2.5, 3]) }; },
  p => { const g = gcd(p.a, p.d), pp = p.d / g; return !tie(pp * p.lam * p.D / p.d, 2) && asin(pp * p.lam / (1000 * p.d)) < 0.12; }, { a: 24, d: 60, lam: 550, D: 1.5 }),
 build: ({ a, d, lam, D }) => { const g = gcd(a, d), p = d / g, q = a / g, w = Math.floor(d / a), c = 2 * w + 1, y = p * lam * D / d; return {
  prompt: `A test plate in the Crystal Observatory has two slits, each ${n(a)} μm wide, with centres ${n(d)} μm apart, lit by light of wavelength ${n(lam)} nm. The pattern falls on a screen ${n(D)} m away. The single-slit pattern has dark fringes at a sin θ = jλ for j = 1, 2, 3 and so on, and a double-slit bright fringe of order m is missing when it lands on one of them. Order m lands on dark fringe j when m ÷ d = j ÷ a, that is m = j × d ÷ a, so the missing orders are the whole numbers of that form. Here d ÷ a is not a whole number itself. Enter the lowest order m above 0 that is missing; then how many bright fringes lie strictly inside the first dark fringes of the single-slit pattern, on both sides, counting the central fringe; then, using the small-angle rule y = mλD ÷ d, how far from the centre that first missing order would fall, in millimetres to 2 decimal places.`,
  answer: [p, c, rd(y, 2)],
  hints: ['A bright fringe of order m is at d sin θ = mλ and dark fringe j of one slit is at a sin θ = jλ. They land together when m = j × d ÷ a, so find the first j that makes m a whole number.', 'The first dark fringes (j = 1) sit at m = ± d ÷ a. Count the whole orders strictly between them, with the central one.', 'With λ in nanometres, d in micrometres and D in metres, y = mλD ÷ d comes out in millimetres.'],
  solution: `d ÷ a = ${n(d)} ÷ ${n(a)} = ${n(p)} ÷ ${n(q)} ${val(d / a, 4)}. Dark fringe j of one slit lands on order m = j × ${n(p)} ÷ ${n(q)}, and the first whole number comes at j = ${n(q)}, so the lowest missing order is m = ${n(p)}. The first dark fringes sit at m = ±${n(rd(d / a, 4))}, so the bright fringes strictly inside them are the orders −${n(w)} to ${n(w)}: ${n(c)} fringes. For the missing order, y = mλD ÷ d = ${n(p)} × ${n(lam)} × ${n(D)} ÷ ${n(d)} ${val(y, 2, 'mm')}.`,
  guidance: [
   { prompt: `Dark fringe j of one slit lands on order m = j × d ÷ a. With d = ${n(d)} μm and a = ${n(a)} μm, what is the lowest whole-number m above 0 that any j = 1, 2, 3 … gives?`, answer: [p], explanation: `d ÷ a = ${n(p)} ÷ ${n(q)}, so m = j × ${n(p)} ÷ ${n(q)}. It first comes out whole at j = ${n(q)}, giving m = ${n(p)}.` },
   { prompt: `The first dark fringes sit at m = ±d ÷ a. How many bright fringes (whole orders, counting the central one) lie strictly between them?`, answer: [c], explanation: `d ÷ a ${val(d / a, 4)}, so the whole orders inside are −${n(w)} to ${n(w)}: ${n(w)} + ${n(w)} + 1 = ${n(c)}.` },
   { prompt: `For small angles the bright fringe of order m is at y = mλD ÷ d. With m = ${n(p)}, what is y, in millimetres to 2 decimal places?`, answer: [rd(y, 2)], explanation: `y = ${n(p)} × ${n(lam)} × ${n(D)} ÷ ${n(d)} ${val(y, 2, 'mm')}. Nothing is seen there, because the order is missing.` }
  ] }; }
});

/* ---- q37 Diffraction gratings [V3 4.4] ---- */

/* q37b: highest order. d = 10⁶ ÷ N is a whole number of nanometres for every N listed. The highest order is the largest whole m with mλ < d. */
const gratingN = [250, 400, 500, 625, 800, 1000, 1250];
mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'The hobby-shop film',
 brief: 'A cheap grating film from the workshop shelf has no label, and the crew want to know how many orders it will show.',
 labels: ['line spacing (nm)', 'highest order', 'angle of highest order (rad)'], tolerance: 0.0005,
 gl: [['line spacing (nm)'], ['highest order'], ['angle of highest order (rad)']]
}, {
 /* Not the q37 worked example (N = 400, 500 nm). The ratio d ÷ λ is at least 2 and not near a whole number. */
 canonical: { N: 625, lam: 450 },
 draw: R => retry(() => ({ N: R.pick(gratingN), lam: 10 * R.int(40, 70) }),
  p => { const d = 1e6 / p.N, r = d / p.lam, M = Math.floor(r), s = M * p.lam / d;
   return r >= 2 && clearFrac(r) && s < 0.97 && !tie(asin(s), 3) && rd(asin(rd(s, 4)), 3) === rd(asin(s), 3) && !(p.N === 400 && p.lam === 500); }, { N: 625, lam: 450 }),
 build: ({ N, lam }) => { const d = 1e6 / N, r = d / lam, M = Math.floor(r), s = M * lam / d, th = asin(s); return {
  prompt: `A grating film from the Crystal Observatory’s workshop has ${n(N)} lines per millimetre and is lit by light of wavelength ${n(lam)} nm. A bright line of order m is at sin θ = mλ ÷ d, and it can only be seen if mλ ÷ d is less than 1, because no angle has a sine of 1 or more. Enter the spacing d between lines, in nanometres (type it without commas); then the highest order m that can be seen; then the angle of that highest order, in radians to 3 decimal places.`,
  answer: [d, M, rd(th, 3)],
  hints: ['N lines in 1 mm means d = 1000000 nm ÷ N.', 'Order m is seen only while mλ ÷ d is less than 1, so m must be less than d ÷ λ. Take the largest whole number below it.', 'For the angle of that order, use sin θ = mλ ÷ d and arcsin with the calculator in radians.'],
  solution: `d = 1000000 ÷ ${n(N)} = ${n(d)} nm. Order m is seen while m is less than d ÷ λ = ${n(d)} ÷ ${n(lam)} ${val(r, 4)}, so the highest whole order is ${n(M)}. Its angle: sin θ = ${n(M)} × ${n(lam)} ÷ ${n(d)} ${val(s, 4)}, so θ = arcsin of that ${val(th, 3, 'rad')}.`,
  guidance: [
   { prompt: `${n(N)} lines fit in 1 mm, which is 1000000 nm. What is the spacing d between lines, in nanometres?`, answer: [d], explanation: `d = 1000000 ÷ ${n(N)} = ${n(d)} nm.` },
   { prompt: `Order m is seen only while mλ is less than d. With d = ${n(d)} nm and λ = ${n(lam)} nm, what is the highest whole order m?`, answer: [M], explanation: `m is less than ${n(d)} ÷ ${n(lam)} ${val(r, 4)}, so the highest whole order is ${n(M)}.` },
   { prompt: `For order m = ${n(M)}, sin θ = mλ ÷ d. What is θ, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `sin θ = ${n(M * lam)} ÷ ${n(d)} ${val(s, 4)}, and θ = arcsin of that ${val(th, 3, 'rad')}.` }
  ] }; }
});

/* q37c: blue and red lines in the same order m. The gap is the red angle minus the blue angle. */
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Blue beside red',
 brief: 'A lamp gives a blue line and a red line, and the crew need to know how far apart a grating spreads them.',
 labels: ['line spacing (nm)', 'blue line angle (rad)', 'gap between lines (rad)'], tolerance: 0.0005,
 gl: [['line spacing (nm)'], ['blue line angle (rad)'], ['gap between lines (rad)']]
}, {
 /* Not the q37 worked example (N = 400). Both orders exist (sin θ < 0.95) and the gap is the same whether or not each angle is rounded first. */
 canonical: { N: 625, m: 2, lb: 450, lr: 650 },
 draw: R => retry(() => ({ N: R.pick(gratingN), m: R.int(1, 3), lb: 10 * R.int(40, 50), lr: 10 * R.int(60, 70) }),
  p => { const d = 1e6 / p.N, sb = p.m * p.lb / d, sr = p.m * p.lr / d; if (sr >= 0.95 || p.N === 400) return false; const tb = asin(sb), tr = asin(sr), gap = tr - tb;
   return !tie(tb, 3) && !tie(tr, 3) && !tie(gap, 3) && rd(rd(tr, 3) - rd(tb, 3), 3) === rd(gap, 3); }, { N: 625, m: 2, lb: 450, lr: 650 }),
 build: ({ N, m, lb, lr }) => { const d = 1e6 / N, sb = m * lb / d, sr = m * lr / d, tb = asin(sb), tr = asin(sr), gap = tr - tb; return {
  prompt: `A lamp in the Crystal Observatory gives a blue line of wavelength ${n(lb)} nm and a red line of wavelength ${n(lr)} nm. They are sent through a grating with ${n(N)} lines per millimetre, and the order m = ${n(m)} lines of both colours are measured. Enter the spacing d between lines, in nanometres (type it without commas); then the angle of the blue line in that order, in radians to 3 decimal places; then how far apart the blue and red lines are in that order, as the red angle minus the blue angle, in radians to 3 decimal places.`,
  answer: [d, rd(tb, 3), rd(gap, 3)],
  hints: ['N lines in 1 mm means d = 1000000 nm ÷ N.', 'Each colour has its own angle in order m: sin θ = mλ ÷ d. Use arcsin with the calculator in radians.', 'The gap is the red angle minus the blue angle, so find both angles before subtracting.'],
  solution: `d = 1000000 ÷ ${n(N)} = ${n(d)} nm. Blue: sin θ = ${n(m)} × ${n(lb)} ÷ ${n(d)} ${val(sb, 4)}, so θ ${val(tb, 3, 'rad')}. Red: sin θ = ${n(m)} × ${n(lr)} ÷ ${n(d)} ${val(sr, 4)}, so θ ${val(tr, 3, 'rad')}. The gap is the red angle minus the blue angle ${val(gap, 3, 'rad')}.`,
  guidance: [
   { prompt: `${n(N)} lines fit in 1 mm, which is 1000000 nm. What is the spacing d between lines, in nanometres?`, answer: [d], explanation: `d = 1000000 ÷ ${n(N)} = ${n(d)} nm.` },
   { prompt: `For the blue line, sin θ = mλ ÷ d with m = ${n(m)} and λ = ${n(lb)} nm. What is θ, in radians to 3 decimal places?`, answer: [rd(tb, 3)], explanation: `sin θ = ${n(m * lb)} ÷ ${n(d)} ${val(sb, 4)}, and θ = arcsin of that ${val(tb, 3, 'rad')}.` },
   { prompt: `The red line (λ = ${n(lr)} nm) comes from sin θ = ${n(m)} × ${n(lr)} ÷ d in the same way. What is the red angle minus the blue angle, in radians to 3 decimal places?`, answer: [rd(gap, 3)], explanation: `Red: sin θ ${val(sr, 4)} and θ ${val(tr, 3, 'rad')}. The gap is that minus the blue angle ${val(gap, 3, 'rad')}.` }
  ] }; }
});

/* q37d: two lamps' lines overlap at one angle: ma × la = mb × lb. The highest order of the second lamp is the largest whole m with mλ < d. */
mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', title: 'Two lamps, one angle',
 brief: 'Two lamps throw lines on exactly the same spot of the spectrograph screen, and the crew can use that to find one lamp from the other.',
 labels: ['second lamp wavelength (nm)', 'overlap angle (rad)', 'highest order of second lamp'], tolerance: 0.0005,
 gl: [['second lamp wavelength (nm)'], ['overlap angle (rad)'], ['highest order of second lamp']]
}, {
 canonical: { N: 500, la: 630, ma: 2, mb: 3 },
 draw: R => retry(() => { const [ma, mb] = R.pick([[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]]); return { N: R.pick([250, 500, 625, 800, 1000]), la: 10 * R.int(50, 70), ma, mb }; },
  p => { const d = 1e6 / p.N, lb = p.ma * p.la / p.mb, s = p.ma * p.la / d, r = d / lb; return lb >= 380 && s < 0.95 && clearFrac(r) && !tie(lb, 1) && !tie(asin(s), 3); }, { N: 500, la: 630, ma: 2, mb: 3 }),
 build: ({ N, la, ma, mb }) => { const d = 1e6 / N, lb = ma * la / mb, s = ma * la / d, th = asin(s), r = d / lb, M = Math.floor(r); return {
  prompt: `A grating in the Crystal Observatory has ${n(N)} lines per millimetre. A lamp’s line of wavelength ${n(la)} nm is seen in order m = ${n(ma)}. Exactly on top of it, at the same angle, is the order m = ${n(mb)} line of a second lamp. Enter the wavelength of the second lamp, in nanometres to 1 decimal place; then the angle where the two lines overlap, in radians to 3 decimal places; then the highest order of the second lamp that can be seen at all (an order can only be seen while mλ ÷ d is less than 1).`,
  answer: [rd(lb, 1), rd(th, 3), M],
  hints: ['At the same angle sin θ is the same for both lines, and sin θ = mλ ÷ d, so the products mλ of the two lamps are equal.', 'For the angle, use sin θ = mλ ÷ d for the first lamp, with d = 1000000 nm ÷ N, and then arcsin.', 'For the second lamp, m must be less than d ÷ λ. Take the largest whole number below it.'],
  solution: `At the same angle sin θ is the same, so ${n(ma)} × ${n(la)} = ${n(mb)} × λ₂, and λ₂ = ${n(ma)} × ${n(la)} ÷ ${n(mb)} ${val(lb, 1, 'nm')}. With d = 1000000 ÷ ${n(N)} = ${n(d)} nm, sin θ = ${n(ma)} × ${n(la)} ÷ ${n(d)} ${val(s, 4)}, so θ ${val(th, 3, 'rad')}. For the second lamp m is less than d ÷ λ₂ ${val(r, 4)}, so the highest whole order is ${n(M)}.`,
  guidance: [
   { prompt: `Both lines are at the same angle, so ${n(ma)} × ${n(la)} nm = ${n(mb)} × λ₂. What is the second lamp’s wavelength λ₂, in nanometres to 1 decimal place?`, answer: [rd(lb, 1)], explanation: `λ₂ = ${n(ma)} × ${n(la)} ÷ ${n(mb)} ${val(lb, 1, 'nm')}.` },
   { prompt: `The overlap is at sin θ = ${n(ma)}λ ÷ d with λ = ${n(la)} nm and d = 1000000 ÷ ${n(N)} nm. What is θ, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `d = ${n(d)} nm, sin θ = ${n(ma * la)} ÷ ${n(d)} ${val(s, 4)}, and θ = arcsin of that ${val(th, 3, 'rad')}.` },
   { prompt: `For the second lamp an order m is seen only while mλ₂ is less than d. What is the highest whole order m?`, answer: [M], explanation: `m is less than ${n(d)} ÷ λ₂ ${val(r, 4)}, so the highest whole order is ${n(M)}.` }
  ] }; }
});

/* ---- q38 Circular apertures and the Rayleigh criterion, θ = 1.22λ/D [V3 4.5] ---- */

/* q38b: from the orbiter. θ (μrad) = 1000 s ÷ H for s in metres and H in kilometres; D (cm) = 100 × 1.22λ ÷ θ with λ in metres and θ in radians. */
mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Rovers from orbit',
 brief: 'The orbiting camera must tell two rovers apart from high above, and the crew need to know how wide its opening has to be.',
 labels: ['angle between lamps (μrad)', 'smallest opening (cm)'], tolerance: 0.005,
 gl: [['angle between lamps (μrad)'], ['smallest opening (cm)']]
}, {
 /* Not the q38 worked example (500 nm, 10 cm, 200000 km). The opening is between 5 and 80 cm, off ties, and the same whether the angle is rounded first or not. */
 canonical: { s: 1.5, H: 300, lam: 520 },
 draw: R => retry(() => ({ s: R.pick([1, 1.5, 2, 2.5, 3, 4, 5]), H: R.pick([200, 250, 300, 400, 500, 600]), lam: 10 * R.int(40, 70) }),
  p => { const th = 1000 * p.s / p.H, D = 100 * 1.22 * p.lam * 1e-9 / (p.s / (1000 * p.H)); return !tie(th, 2) && !tie(D, 2) && D >= 5 && D <= 80 && rd(100 * 1.22 * p.lam * 1e-9 / (rd(th, 2) * 1e-6), 2) === rd(D, 2); }, { s: 1.5, H: 300, lam: 520 }),
 build: ({ s, H, lam }) => { const thr = s / (1000 * H), th = thr * 1e6, D = 100 * 1.22 * lam * 1e-9 / thr; return {
  prompt: `The Crystal Observatory’s orbiting camera looks straight down at two lamps on rovers that are ${n(s)} m apart, from a height of ${n(H)} km, in light of wavelength ${n(lam)} nm. The angle between the lamps, in radians, is their separation ÷ the height (both in metres). Enter that angle in microradians (1 μrad = 10⁻⁶ rad) to 2 decimal places; then, by the Rayleigh criterion θ = 1.22λ ÷ D, the smallest diameter D of round camera opening that can just tell the lamps apart, in centimetres to 2 decimal places.`,
  answer: [rd(th, 2), rd(D, 2)],
  hints: ['The angle in radians is the separation divided by the height, with both in metres. One microradian is 10⁻⁶ rad.', 'Rearrange θ = 1.22λ ÷ D to D = 1.22λ ÷ θ, with λ in metres and θ in radians (use the unrounded angle). Then change metres to centimetres.'],
  solution: `The height is ${n(1000 * H)} m, so θ = ${n(s)} ÷ ${n(1000 * H)} rad, which in microradians is 1000 × ${n(s)} ÷ ${n(H)}, so θ ${val(th, 2, 'μrad')}. Then D = 1.22λ ÷ θ with λ = ${n(lam)} × 10⁻⁹ m and θ in radians (the unrounded value): D = 1.22 × ${n(lam)} × 10⁻⁹ ÷ (${n(s)} ÷ ${n(1000 * H)}) m, and in centimetres D ${val(D, 2, 'cm')}.`,
  guidance: [
   { prompt: `The height is ${n(H)} km = ${n(1000 * H)} m and the lamps are ${n(s)} m apart. What is the angle between them, in microradians to 2 decimal places?`, answer: [rd(th, 2)], explanation: `${n(s)} ÷ ${n(1000 * H)} rad is ${n(rd(th, 4))} × 10⁻⁶ rad, which is θ ${val(th, 2, 'μrad')}.` },
   { prompt: `Rearrange θ = 1.22λ ÷ D to D = 1.22λ ÷ θ, with λ = ${n(lam)} nm in metres and θ in radians (unrounded). What is D, in centimetres to 2 decimal places?`, answer: [rd(D, 2)], explanation: `D = 1.22 × ${n(lam)} × 10⁻⁹ ÷ (${n(s)} ÷ ${n(1000 * H)}) m, which in centimetres is D ${val(D, 2, 'cm')}. A smaller opening would blur the two lamps into one.` }
  ] }; }
});

/* q38c: survey scope. Rayleigh angle in μrad = 0.122λ ÷ D (λ nm, D cm); the greatest distance in km = 1000 s ÷ θ(μrad). The crew's distance L is set from that greatest
   distance by a factor of 0.5 to 1.8 (never within 5% of it), so the yes or no differs from draw to draw. */
mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The beacon pair',
 brief: 'Two beacon lamps are fixed on a distant ridge, and the crew need to know from how far the survey scope can still tell them apart.',
 labels: ['Rayleigh angle (μrad)', 'greatest distance (km)', 'can tell apart (1 or 0)'], tolerance: 0.005,
 gl: [['Rayleigh angle (μrad)'], ['greatest distance (km)'], ['can tell apart (1 or 0)']]
}, {
 canonical: { Dc: 4, s: 1.5, lam: 500, L: 120 },
 draw: R => retry(() => { const p = { Dc: R.pick([2, 3, 4, 5, 6, 8]), s: R.pick([0.5, 0.8, 1, 1.5, 2, 2.5, 3]), lam: 10 * R.int(40, 70) }, th = 0.122 * p.lam / p.Dc, Lmax = 1000 * p.s / th;
   p.L = Math.round(Lmax * R.pick([0.5, 0.7, 0.85, 1.2, 1.4, 1.8])); return p; },
  p => { const th = 0.122 * p.lam / p.Dc, Lmax = 1000 * p.s / th; return p.L >= 5 && Math.abs(p.L - Lmax) / Lmax > 0.05 && Lmax >= 5 && Lmax <= 800 && !tie(th, 2) && !tie(Lmax, 2) && rd(1000 * p.s / rd(th, 2), 2) === rd(Lmax, 2); }, { Dc: 4, s: 1.5, lam: 500, L: 120 }),
 build: ({ Dc, s, lam, L }) => { const th = 0.122 * lam / Dc, Lmax = 1000 * s / th, yes = L <= Lmax ? 1 : 0; return {
  prompt: `A survey scope on Signal Ridge has a round opening ${n(Dc)} cm across. Two beacon lamps ${n(s)} m apart are fixed on a distant ridge, and the crew watch them in light of wavelength ${n(lam)} nm. The lamps can be told apart when the angle between them is at least the Rayleigh angle θ = 1.22λ ÷ D; that angle in radians is the lamps’ separation ÷ their distance. Enter the scope’s Rayleigh angle, in microradians (1 μrad = 10⁻⁶ rad) to 2 decimal places; then the greatest distance at which the lamps can still be told apart, in kilometres to 2 decimal places; then, for a crew ${n(L)} km from the ridge, enter 1 if they can tell the lamps apart or 0 if they cannot.`,
  answer: [rd(th, 2), rd(Lmax, 2), yes],
  hints: ['Use θ = 1.22λ ÷ D with λ and D in metres to get radians. One microradian is 10⁻⁶ rad.', 'The lamps are just apart when separation ÷ distance equals the Rayleigh angle (in radians), so the greatest distance is the separation ÷ that angle. Change metres to kilometres at the end.', 'Closer than the greatest distance, the angle between the lamps is bigger than the Rayleigh angle, so they can be told apart; farther away they cannot.'],
  solution: `θ = 1.22 × ${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad, which in microradians is 1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000, so θ ${val(th, 2, 'μrad')}. The lamps are just apart when s ÷ distance = θ, so distance = s ÷ θ with θ in radians; in kilometres that is 1000 × ${n(s)} ÷ (θ in microradians) ${val(Lmax, 2, 'km')}. The crew’s ${n(L)} km is ${yes ? 'less' : 'more'} than that, so they ${yes ? 'can' : 'cannot'} tell the lamps apart: ${yes}.`,
  guidance: [
   { prompt: `With λ = ${n(lam)} nm and D = ${n(Dc)} cm, both in metres, what is θ = 1.22λ ÷ D, in microradians to 2 decimal places?`, answer: [rd(th, 2)], explanation: `1.22 × ${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad is 1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000 microradians ${val(th, 2, 'μrad')}.` },
   { prompt: `The lamps are just told apart when ${n(s)} m ÷ distance equals that angle in radians (unrounded). What is that greatest distance, in kilometres to 2 decimal places?`, answer: [rd(Lmax, 2)], explanation: `distance = ${n(s)} ÷ θ with θ in radians, and in kilometres that is 1000 × ${n(s)} ÷ ${n(rd(th, 4))} ${val(Lmax, 2, 'km')}.` },
   { prompt: `The crew are ${n(L)} km from the ridge. Enter 1 if that is no farther than the greatest distance, or 0 if it is farther.`, answer: [yes], explanation: `${n(L)} km is ${yes ? 'less' : 'more'} than ${n(rd(Lmax, 2))} km, so the answer is ${yes}.` }
  ] }; }
});

/* q38d: slit against circle, same width a = D. Slit limit θ = λ ÷ a = 0.1λ ÷ D (μrad, λ nm, D cm); round limit 0.122λ ÷ D. The extra separation is L × (θ round − θ slit). */
mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q34', title: 'Slit against circle',
 brief: 'Two test telescopes of the same width, one slit-shaped and one round, are compared on the same pair of lamps.',
 labels: ['slit angle (μrad)', 'round angle (μrad)', 'difference in separation (km)'], tolerance: 0.005,
 gl: [['slit angle (μrad)'], ['round angle (μrad)'], ['difference in separation (km)']]
}, {
 canonical: { Dc: 12, lam: 540, L: 160000 },
 draw: R => retry(() => ({ Dc: R.pick([6, 8, 10, 12, 15, 20, 25, 30]), lam: 10 * R.int(40, 70), L: 10000 * R.int(5, 40) }),
  p => { const ts = 0.1 * p.lam / p.Dc, tr = 0.122 * p.lam / p.Dc, df = p.L * (tr - ts) / 1e6; return df >= 0.05 && !tie(ts, 2) && !tie(tr, 2) && !tie(df, 2) && rd(p.L * (rd(tr, 2) - rd(ts, 2)) / 1e6, 2) === rd(df, 2) && !(p.lam === 500 && p.Dc === 10); }, { Dc: 12, lam: 540, L: 160000 }),
 build: ({ Dc, lam, L }) => { const ts = 0.1 * lam / Dc, tr = 0.122 * lam / Dc, df = L * (tr - ts) / 1e6; return {
  prompt: `The Crystal Observatory has two test telescopes for light of wavelength ${n(lam)} nm: one has a slit-shaped opening ${n(Dc)} cm wide, and the other a round opening ${n(Dc)} cm across. For the slit, two points are just told apart at the angle of its first dark fringe, a sin θ = λ, which for such a small angle is θ = λ ÷ a in radians (across the slit’s width). For the round opening the angle is θ = 1.22λ ÷ D. Enter the slit telescope’s smallest angle, in microradians (1 μrad = 10⁻⁶ rad) to 2 decimal places; then the round telescope’s smallest angle, in microradians to 2 decimal places; then how many kilometres closer together two lamps on a moon ${n(L)} km away can be for the slit telescope than for the round one and still be told apart, in kilometres to 2 decimal places, worked out from the unrounded angles.`,
  answer: [rd(ts, 2), rd(tr, 2), rd(df, 2)],
  hints: ['For the slit, θ = λ ÷ a with both in metres gives radians. The round opening has the same form with an extra factor 1.22. One microradian is 10⁻⁶ rad.', 'The separation that is just told apart is the distance × the angle in radians. Work it out for each telescope from the unrounded angle, then subtract.'],
  solution: `Slit: θ = λ ÷ a = ${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad, which in microradians is ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000, so θ ${val(ts, 2, 'μrad')}. Round: 1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000, so θ ${val(tr, 2, 'μrad')}. The separations are the distance × the angle in radians, so the slit telescope can separate lamps closer by L × (θ round − θ slit) = ${n(L)} km × ${n(rd(tr - ts, 4))} × 10⁻⁶ ${val(df, 2, 'km')}.`,
  guidance: [
   { prompt: `For the slit, θ = λ ÷ a with λ = ${n(lam)} nm and a = ${n(Dc)} cm, both in metres. What is θ, in microradians to 2 decimal places?`, answer: [rd(ts, 2)], explanation: `${n(lam)} × 10⁻⁹ ÷ ${n(Dc / 100)} rad is ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000 microradians ${val(ts, 2, 'μrad')}.` },
   { prompt: `For the round opening, θ = 1.22λ ÷ D with the same λ and D = ${n(Dc)} cm. What is θ, in microradians to 2 decimal places?`, answer: [rd(tr, 2)], explanation: `1.22 × ${n(lam)} ÷ ${n(Dc / 100)} ÷ 1000 microradians ${val(tr, 2, 'μrad')}.` },
   { prompt: `At ${n(L)} km, a separation is the distance × the angle in radians. By how many kilometres is the slit telescope’s smallest separation less than the round one’s, to 2 decimal places? (Use the unrounded angles.)`, answer: [rd(df, 2)], explanation: `${n(L)} km × (θ round − θ slit) in radians = ${n(L)} × ${n(rd(tr - ts, 4))} × 10⁻⁶ ${val(df, 2, 'km')}.` }
  ] }; }
});

/* ---- q39 X-ray diffraction and Bragg's law, mλ = 2d sin θ [V3 4.6] ---- */

/* q39b: wavelength from the planes. λ = 2d sin θ ÷ m; the highest order is the largest whole m with mλ < 2d. */
mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The sample drawer',
 brief: 'A crystal from the sample drawer has known planes, and the crew want to know what X-rays the lab is using.',
 labels: ['X-ray wavelength (nm)', 'highest order'], tolerance: 0.0005,
 gl: [['X-ray wavelength (nm)'], ['highest order']]
}, {
 /* Not the q39 worked example (0.1 nm, 0.25 rad). The ratio 2d ÷ λ = m ÷ sin θ is not near a whole number. */
 canonical: { d: 0.35, th: 0.4, m: 2 },
 draw: R => retry(() => ({ d: R.int(150, 450) / 1000, th: R.int(150, 600) / 1000, m: R.int(1, 3) }),
  p => { const lam = 2 * p.d * sin(p.th) / p.m; return !tie(lam, 3) && clearFrac(2 * p.d / lam) && !(p.d === 0.1 && p.th === 0.25); }, { d: 0.35, th: 0.4, m: 2 }),
 build: ({ d, th, m }) => { const st = sin(th), lam = 2 * d * st / m, r = 2 * d / lam, M = Math.floor(r); return {
  prompt: `A crystal in the Crystal Observatory’s sample drawer has atomic planes ${n(d)} nm apart. X-rays reflect from it, and the order m = ${n(m)} reflection is strongest at ${n(th)} rad, measured from the crystal planes. Bragg’s law is mλ = 2d sin θ. Enter the wavelength of the X-rays, in nanometres to 3 decimal places; then the highest order that these X-rays can give from this crystal (an order can only exist while mλ ÷ (2d) is less than 1).`,
  answer: [rd(lam, 3), M],
  hints: ['Bragg’s law: mλ = 2d sin θ, where θ is measured from the planes. Solve it for λ, and keep the calculator in radians.', 'An order m only exists while mλ ÷ (2d) is less than 1, because sin θ cannot reach 1. So m must be less than 2d ÷ λ: take the largest whole number below it.'],
  solution: `sin(${n(th)}) ${val(st, 4)}. λ = 2d sin θ ÷ m = 2 × ${n(d)} × sin(${n(th)}) ÷ ${n(m)} ${val(lam, 3, 'nm')}. An order exists while m is less than 2d ÷ λ ${val(r, 4)}, so the highest whole order is ${n(M)}.`,
  guidance: [
   { prompt: `Solve mλ = 2d sin θ for λ with m = ${n(m)}, d = ${n(d)} nm and θ = ${n(th)} rad. What is λ, in nanometres to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ = 2 × ${n(d)} × sin(${n(th)}) ÷ ${n(m)} ${val(lam, 3, 'nm')}.` },
   { prompt: `An order m exists only while mλ is less than 2d. With your unrounded λ and 2d = ${n(rd(2 * d, 3))} nm, what is the highest whole order m?`, answer: [M], explanation: `m is less than 2d ÷ λ ${val(r, 4)}, so the highest whole order is ${n(M)}.` }
  ] }; }
});

/* q39c: aim the detector arm. sin θ = mλ ÷ (2d); the arm sits at 2θ from the straight-through beam. */
mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Aiming the detector arm',
 brief: 'The detector arm must be swung to the right angle before the crystal run starts.',
 labels: ['sin θ', 'angle from the planes (rad)', 'detector arm angle (rad)'], tolerance: 0.0005,
 gl: [['sin θ'], ['angle from the planes (rad)'], ['detector arm angle (rad)']]
}, {
 /* Not the q39 worked example (0.1 nm, 0.25 rad). sin θ is between 0.1 and 0.85; the rounded steps give the same last digits. */
 canonical: { d: 0.32, lam: 0.15, m: 2 },
 draw: R => retry(() => ({ d: R.int(150, 450) / 1000, lam: R.int(70, 200) / 1000, m: R.int(1, 3) }),
  p => { const s = p.m * p.lam / (2 * p.d); if (s < 0.1 || s > 0.85) return false; const th = asin(s);
   return !tie(s, 3) && !tie(th, 3) && !tie(2 * th, 3) && rd(asin(rd(s, 3)), 3) === rd(th, 3) && rd(2 * rd(th, 3), 3) === rd(2 * th, 3); }, { d: 0.32, lam: 0.15, m: 2 }),
 build: ({ d, lam, m }) => { const s = m * lam / (2 * d), th = asin(s), arm = 2 * th; return {
  prompt: `A detector arm in the Crystal Observatory’s crystal lab is to be set for the order m = ${n(m)} reflection from a crystal whose planes are ${n(d)} nm apart, using X-rays of wavelength ${n(lam)} nm. Bragg’s law is mλ = 2d sin θ, with θ measured from the planes. A beam reflecting off the planes is turned through 2θ from its original direction, so the arm must sit at 2θ from the straight-through beam. Enter sin θ to 3 decimal places; then θ, in radians to 3 decimal places; then the angle of the detector arm, 2θ, in radians to 3 decimal places, worked out from the unrounded θ.`,
  answer: [rd(s, 3), rd(th, 3), rd(arm, 3)],
  hints: ['Rearrange Bragg’s law to sin θ = mλ ÷ (2d).', 'Take arcsin of sin θ with the calculator in radians to get θ, the angle from the planes.', 'The arm sits at twice that angle, 2θ.'],
  solution: `sin θ = mλ ÷ (2d) = ${n(m)} × ${n(lam)} ÷ (2 × ${n(d)}) ${val(s, 3)}. Then θ = arcsin of that ${val(th, 3, 'rad')}. The detector arm sits at 2θ ${val(arm, 3, 'rad')}.`,
  guidance: [
   { prompt: `Rearrange mλ = 2d sin θ with m = ${n(m)}, λ = ${n(lam)} nm and d = ${n(d)} nm. What is sin θ, to 3 decimal places?`, answer: [rd(s, 3)], explanation: `sin θ = ${n(m * lam)} ÷ ${n(rd(2 * d, 3))} ${val(s, 3)}.` },
   { prompt: `What is θ, the angle from the planes, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `θ = arcsin of sin θ ${val(th, 3, 'rad')}.` },
   { prompt: `The arm sits at twice the angle from the planes. Double the unrounded θ: what is 2θ, in radians to 3 decimal places?`, answer: [rd(arm, 3)], explanation: `2 × θ ${val(arm, 3, 'rad')}.` }
  ] }; }
});

/* q39d: the arm angle α = 2θ is what is measured. α is a whole number of thousandths, even, so θ = α ÷ 2 is exact to 3 places. */
mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', title: 'Two beams, one crystal',
 brief: 'A crystal measured with one X-ray beam must be used to find the wavelength of a second beam.',
 labels: ['plane spacing (nm)', 'second wavelength (nm)'], tolerance: 0.0005,
 gl: [['angle from the planes (rad)'], ['plane spacing (nm)'], ['second wavelength (nm)']]
}, {
 canonical: { lam: 0.14, m: 1, al: 0.7, m2: 2, al2: 1.1 },
 draw: R => retry(() => ({ lam: R.int(70, 200) / 1000, m: R.int(1, 2), al: 2 * R.int(150, 500) / 1000, m2: R.int(1, 3), al2: 2 * R.int(150, 500) / 1000 }),
  p => { const d = p.m * p.lam / (2 * sin(p.al / 2)), l2 = 2 * d * sin(p.al2 / 2) / p.m2; return p.al !== p.al2 && !tie(d, 3) && !tie(l2, 3) && rd(2 * rd(d, 3) * sin(p.al2 / 2) / p.m2, 3) === rd(l2, 3) && !(p.lam === 0.1 && p.al === 0.5); }, { lam: 0.14, m: 1, al: 0.7, m2: 2, al2: 1.1 }),
 build: ({ lam, m, al, m2, al2 }) => { const t1 = al / 2, t2 = al2 / 2, d = m * lam / (2 * sin(t1)), l2 = 2 * d * sin(t2) / m2; return {
  prompt: `X-rays of wavelength ${n(lam)} nm are reflected from a crystal in the Crystal Observatory’s crystal lab, and a detector arm measures where the reflected beam goes. A beam reflecting from the planes at angle θ to them is turned through 2θ, so the arm angle α is twice the angle θ from the planes. The order m = ${n(m)} reflection is strongest with the arm at α = ${n(al)} rad. Then a second, unknown X-ray beam gives its order m = ${n(m2)} reflection from the same crystal with the arm at α = ${n(al2)} rad. Using Bragg’s law mλ = 2d sin θ, enter the plane spacing d, in nanometres to 3 decimal places; then the wavelength of the second X-rays, in nanometres to 3 decimal places.`,
  answer: [rd(d, 3), rd(l2, 3)],
  hints: ['The arm angle is twice the angle from the planes, so θ = α ÷ 2. Bragg’s law uses θ, not α.', 'Solve mλ = 2d sin θ for d with the first beam. Then use that same d (unrounded) with the second beam and solve for its wavelength.'],
  solution: `The first beam has θ = α ÷ 2 = ${n(al)} ÷ 2 = ${n(t1)} rad. Then d = mλ ÷ (2 sin θ) = ${n(m)} × ${n(lam)} ÷ (2 × sin(${n(t1)})) ${val(d, 3, 'nm')}. The second beam has θ = ${n(al2)} ÷ 2 = ${n(t2)} rad, so λ = 2d sin θ ÷ m = 2 × d × sin(${n(t2)}) ÷ ${n(m2)} ${val(l2, 3, 'nm')}.`,
  guidance: [
   { prompt: `The first beam’s arm angle is α = ${n(al)} rad, twice the angle from the planes. What is θ, in radians?`, answer: [t1], explanation: `θ = ${n(al)} ÷ 2 = ${n(t1)} rad.` },
   { prompt: `Now mλ = 2d sin θ with m = ${n(m)}, λ = ${n(lam)} nm and θ = ${n(t1)} rad. What is d, in nanometres to 3 decimal places?`, answer: [rd(d, 3)], explanation: `d = ${n(m * lam)} ÷ (2 × sin(${n(t1)})) ${val(d, 3, 'nm')}.` },
   { prompt: `The second beam has α = ${n(al2)} rad, so θ = ${n(t2)} rad, and m = ${n(m2)}. Use your unrounded d. What is its wavelength, in nanometres to 3 decimal places?`, answer: [rd(l2, 3)], explanation: `λ = 2 × d × sin(${n(t2)}) ÷ ${n(m2)} ${val(l2, 3, 'nm')}.` }
  ] }; }
});

/* ---- q40 Realm review: identifying a lamp from its fringes; bridge to Electricity and magnetism [V3 3.2, 4.4] ---- */

/* q40b: a double slit gives the wavelength (λ = Δy × d ÷ D, nm for mm, μm and m), then a grating predicts the first-order line (not small: tan and arcsin).
   The printed fringe spacing comes from a whole-number wavelength and is rounded to 2 places; the wavelength found from it is within 0.3 nm of that whole number. */
mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Fringes then grating',
 brief: 'A lamp is first measured with a double slit, and the crew then want to know where a grating will put its first line.',
 labels: ['wavelength (nm)', 'first-order line from centre (cm)'], tolerance: 0.00005,
 gl: [['wavelength (nm)'], ['angle of first order (rad)'], ['first-order line from centre (cm)']]
}, {
 /* Not the q40 worked example (N = 400, D = 1 m, 20.62 cm). */
 canonical: { d2: 200, D: 2, dy: 5.8, N: 500 },
 draw: R => retry(() => { const lam = R.int(400, 700), d2 = R.pick([100, 150, 200, 250, 300, 400]), D = R.pick([1, 1.5, 2, 2.5, 3]); return { d2, D, dy: rd(lam * D / d2, 2), N: R.pick([250, 300, 500, 625, 800]) }; },
  p => { const L = Math.round(p.dy * p.d2 / p.D), dg = 1e6 / p.N, s = L / dg; if (Math.abs(p.dy * p.d2 / p.D - L) >= 0.3 || s >= 0.9 || p.N === 400) return false; const th = asin(s), y = 100 * p.D * tan(th);
   return !tie(th, 4) && !tie(y, 1) && rd(100 * p.D * tan(rd(th, 4)), 1) === rd(y, 1); }, { d2: 200, D: 2, dy: 5.8, N: 500 }),
 build: ({ d2, D, dy, N }) => { const lamc = dy * d2 / D, L = Math.round(lamc), dg = 1e6 / N, s = L / dg, th = asin(s), y = 100 * D * tan(th); return {
  prompt: `To identify a lamp, the Crystal Observatory first shines it through a double slit with centres ${n(d2)} μm apart onto a screen ${n(D)} m away, and neighbouring bright fringes are ${n(dy)} mm apart. For small angles that spacing is Dλ ÷ d. Enter the lamp’s wavelength, in nanometres to the nearest nanometre. Then the same lamp is sent through a grating with ${n(N)} lines per millimetre onto the same screen, square to the beam. Using that whole-number wavelength, enter how far from the centre the first-order line lands, in centimetres to 1 decimal place (the angle is not small now: use d sin θ = λ and then y = D tan θ).`,
  answer: [L, rd(y, 1)],
  hints: ['Solve Dλ ÷ d = spacing for λ. With the spacing in millimetres, d in micrometres and D in metres, λ comes out in nanometres.', 'The grating’s line spacing is d = 1000000 nm ÷ N. First order: sin θ = λ ÷ d, so θ = arcsin of that, with the calculator in radians.', 'The screen is square to the beam, so the line is at y = D tan θ. Multiply by 100 for centimetres.'],
  solution: `λ = spacing × d ÷ D = ${n(dy)} × ${n(d2)} ÷ ${n(D)} ${val(lamc, 4, 'nm')}, which is ${n(L)} nm to the nearest nanometre. The grating has d = 1000000 ÷ ${n(N)} ${val(dg, 4, 'nm')}, so sin θ = ${n(L)} ÷ d ${val(s, 4)} and θ ${val(th, 4, 'rad')}. Then y = D tan θ, which in centimetres is 100 × ${n(D)} × tan θ ${val(y, 1, 'cm')}.`,
  guidance: [
   { prompt: `For small angles the fringe spacing is Dλ ÷ d. With a spacing of ${n(dy)} mm, d = ${n(d2)} μm and D = ${n(D)} m, what is λ, in nanometres to the nearest nanometre?`, answer: [L], explanation: `λ = ${n(dy)} × ${n(d2)} ÷ ${n(D)} ${val(lamc, 4, 'nm')}, which is ${n(L)} nm to the nearest nanometre.` },
   { prompt: `The grating has d = 1000000 ÷ ${n(N)} nm. For first order, sin θ = ${n(L)} ÷ d. What is θ, in radians to 4 decimal places?`, answer: [rd(th, 4)], explanation: `d = ${n(dg)} nm, sin θ ${val(s, 4)}, and θ = arcsin of that ${val(th, 4, 'rad')}.` },
   { prompt: `The screen is ${n(D)} m away and square to the beam, so y = D tan θ. How far from the centre is the first-order line, in centimetres to 1 decimal place?`, answer: [rd(y, 1)], explanation: `y = ${n(D)} × tan(${n(rd(th, 4))}) m, and in centimetres that is ${val(y, 1, 'cm')}.` }
  ] }; }
});

/* q40c: an unlabelled grating is calibrated with a lamp of known wavelength. N is the whole number of lines per millimetre; the unknown wavelength uses that whole number.
   Printed spot positions come from a true N and a whole-number wavelength, rounded to 2 places; the values found from them round back to the true ones. */
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'The unlabelled grating',
 brief: 'A grating has lost its label, so a lamp of known colour is used to find its number of lines before an unknown lamp is identified.',
 labels: ['lines per millimetre', 'unknown wavelength (nm)'], tolerance: 0.05,
 gl: [['line spacing (nm)'], ['lines per millimetre'], ['unknown wavelength (nm)']]
}, {
 canonical: { lc: 590, D: 1.5, yc: 80.31, yu: 62.38 },
 draw: R => retry(() => { const N = R.pick([250, 300, 400, 500, 600, 625, 800]), d = 1e6 / N, D = R.pick([0.8, 1, 1.2, 1.5, 2]), lc = 10 * R.int(45, 65), lu = R.int(400, 700);
   const pos = l => rd(100 * D * tan(asin(l / d)), 2); return { lc, D, yc: pos(lc), yu: pos(lu), N, lu }; },
  p => { const { lc, D, yc, yu, N, lu } = p, d = 1e6 / N; if (Math.abs(lu - lc) < 30 || lu / d >= 0.9 || lc / d >= 0.9) return false;
   const dcal = lc / sin(atan(yc / 100 / D)), Nc = 1e6 / dcal, Ni = Math.round(Nc), lcalc = (1e6 / Ni) * sin(atan(yu / 100 / D));
   if (!(Ni === N && Math.abs(Nc - Ni) < 0.15 && Math.abs(lcalc - lu) < 0.3 && Math.round(lcalc) === lu && !tie(dcal, 1))) return false; p.lu = undefined; delete p.N; delete p.lu; return true; }, { lc: 590, D: 1.5, yc: 80.31, yu: 62.38 }),
 build: ({ lc, D, yc, yu }) => { const thc = atan(yc / 100 / D), dcal = lc / sin(thc), Nc = 1e6 / dcal, Ni = Math.round(Nc), di = 1e6 / Ni, thu = atan(yu / 100 / D), lu = di * sin(thu), Lu = Math.round(lu); return {
  prompt: `A grating in the Crystal Observatory has lost its label. To find its number of lines per millimetre, a calibration lamp of wavelength ${n(lc)} nm is shone through it onto a flat screen ${n(D)} m away, square to the beam, and its first-order line lands ${n(yc)} cm from the centre. Then an unknown lamp is shone through the same grating and its first-order line lands ${n(yu)} cm from the centre. Enter the grating’s number of lines per millimetre, to the nearest whole number; then, using that whole number, the unknown lamp’s wavelength, in nanometres to the nearest nanometre.`,
  answer: [Ni, Lu],
  hints: ['For each line the screen is square to the beam, so tan θ = y ÷ D (take y in metres). Then for first order d sin θ = λ.', 'From the calibration lamp, d = λ ÷ sin θ in nanometres. Then N = 1000000 ÷ d, rounded to a whole number.', 'Use d = 1000000 nm ÷ that whole N for the unknown lamp: λ = d sin θ from its own angle.'],
  solution: `Calibration line: tan θ = ${n(yc / 100)} ÷ ${n(D)}, so θ ${val(thc, 4, 'rad')}, and d = λ ÷ sin θ = ${n(lc)} ÷ sin θ ${val(dcal, 4, 'nm')}. Then N = 1000000 ÷ d ${val(Nc, 4)}, which is ${n(Ni)} lines per millimetre to the nearest whole number. With that, d = 1000000 ÷ ${n(Ni)} ${val(di, 4, 'nm')}. Unknown line: tan θ = ${n(yu / 100)} ÷ ${n(D)}, so θ ${val(thu, 4, 'rad')}, and λ = d sin θ ${val(lu, 4, 'nm')}, which is ${n(Lu)} nm to the nearest nanometre.`,
  guidance: [
   { prompt: `For the calibration line, tan θ = y ÷ D with y = ${n(yc / 100)} m and D = ${n(D)} m, and d sin θ = λ with λ = ${n(lc)} nm. What is d, in nanometres to 1 decimal place?`, answer: [rd(dcal, 1)], explanation: `θ = arctan(${n(yc / 100)} ÷ ${n(D)}) ${val(thc, 4, 'rad')}, and d = ${n(lc)} ÷ sin θ ${val(dcal, 4, 'nm')}.` },
   { prompt: `Lines per millimetre is N = 1000000 ÷ d (with d in nanometres). What is N, to the nearest whole number?`, answer: [Ni], explanation: `N = 1000000 ÷ ${n(rd(dcal, 1))} ${val(Nc, 4)}, which is ${n(Ni)} to the nearest whole number.` },
   { prompt: `With d = 1000000 ÷ ${n(Ni)} nm, the unknown line has tan θ = ${n(yu / 100)} ÷ ${n(D)}. What is its wavelength λ = d sin θ, in nanometres to the nearest nanometre?`, answer: [Lu], explanation: `θ ${val(thu, 4, 'rad')} and λ = ${n(rd(di, 1))} × sin θ ${val(lu, 4, 'nm')}, which is ${n(Lu)} nm to the nearest nanometre.` }
  ] }; }
});

/* q40d: a lamp with two lines. The printed first-order spots come from whole-number wavelengths and are rounded to 2 places. The gap between the second-order spots is
   worked from the whole-number wavelengths. */
mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', title: 'A lamp with two lines',
 brief: 'A lamp shows two first-order lines on the screen, and the crew want both wavelengths and the gap between their second-order lines.',
 labels: ['shorter wavelength (nm)', 'longer wavelength (nm)', 'gap between second-order lines (cm)'], tolerance: 0.05,
 gl: [['shorter wavelength (nm)'], ['longer wavelength (nm)'], ['gap between second-order lines (cm)']]
}, {
 canonical: { N: 625, D: 1.2, y1: 37.74, y2: 50.44 },
 draw: R => retry(() => { const N = R.pick([250, 300, 500, 625, 800]), d = 1e6 / N, D = R.pick([0.8, 1, 1.2, 1.5, 2]), l1 = R.int(400, 560), l2 = l1 + R.int(40, 140), pos = l => rd(100 * D * tan(asin(l / d)), 2);
   return { N, D, y1: pos(l1), y2: pos(l2), l1, l2 }; },
  p => { const { N, D, y1, y2, l1, l2 } = p, d = 1e6 / N; if (l2 > 700 || 2 * l2 / d >= 0.9 || N === 400) return false;
   const r1 = d * sin(atan(y1 / 100 / D)), r2 = d * sin(atan(y2 / 100 / D)), a1 = Math.round(r1), a2 = Math.round(r2);
   if (!(a1 === l1 && a2 === l2 && Math.abs(r1 - a1) < 0.3 && Math.abs(r2 - a2) < 0.3)) return false;
   const gap = 100 * D * (tan(asin(2 * l2 / d)) - tan(asin(2 * l1 / d))); if (tie(gap, 1)) return false; delete p.l1; delete p.l2; return true; }, { N: 625, D: 1.2, y1: 37.74, y2: 50.44 }),
 build: ({ N, D, y1, y2 }) => { const d = 1e6 / N, t1 = atan(y1 / 100 / D), t2 = atan(y2 / 100 / D), r1 = d * sin(t1), r2 = d * sin(t2), L1 = Math.round(r1), L2 = Math.round(r2),
  s1 = 2 * L1 / d, s2 = 2 * L2 / d, Y1 = 100 * D * tan(asin(s1)), Y2 = 100 * D * tan(asin(s2)), gap = Y2 - Y1; return {
  prompt: `A mixed lamp has two bright lines. The Crystal Observatory shines it through a grating with ${n(N)} lines per millimetre onto a flat screen ${n(D)} m away, square to the beam. The first-order lines land ${n(y1)} cm and ${n(y2)} cm from the centre. Enter the shorter wavelength, then the longer wavelength, each in nanometres to the nearest nanometre; then, using those whole-number wavelengths, the distance between the two second-order lines on the screen, in centimetres to 1 decimal place. The angles are not small, so use tan θ = y ÷ D and d sin θ = mλ.`,
  answer: [L1, L2, rd(gap, 1)],
  hints: ['The grating’s line spacing is d = 1000000 nm ÷ N. For each first-order line, tan θ = y ÷ D (y in metres) and λ = d sin θ.', 'For second order, sin θ = 2λ ÷ d with the whole-number wavelength. Then each line is at y = D tan θ, and the gap is the difference of the two.'],
  solution: `d = 1000000 ÷ ${n(N)} ${val(d, 4, 'nm')}. First line: tan θ = ${n(y1 / 100)} ÷ ${n(D)}, θ ${val(t1, 4, 'rad')}, λ = d sin θ ${val(r1, 4, 'nm')}, so ${n(L1)} nm. Second line: tan θ = ${n(y2 / 100)} ÷ ${n(D)}, θ ${val(t2, 4, 'rad')}, λ ${val(r2, 4, 'nm')}, so ${n(L2)} nm. Second order of the first line: sin θ = 2 × ${n(L1)} ÷ d ${val(s1, 4)}, y = 100 × ${n(D)} × tan θ ${val(Y1, 1, 'cm')}. Second order of the second line: sin θ = 2 × ${n(L2)} ÷ d ${val(s2, 4)}, y ${val(Y2, 1, 'cm')}. The gap is the difference ${val(gap, 1, 'cm')}.`,
  guidance: [
   { prompt: `The first line lands ${n(y1)} cm = ${n(y1 / 100)} m from the centre on a screen ${n(D)} m away, and d = 1000000 ÷ ${n(N)} nm. What is its wavelength λ = d sin θ, with tan θ = y ÷ D, to the nearest nanometre?`, answer: [L1], explanation: `θ = arctan(${n(y1 / 100)} ÷ ${n(D)}) ${val(t1, 4, 'rad')}, and d sin θ ${val(r1, 4, 'nm')}, which is ${n(L1)} nm to the nearest nanometre.` },
   { prompt: `The second line lands ${n(y2)} cm = ${n(y2 / 100)} m from the centre. What is its wavelength, to the nearest nanometre?`, answer: [L2], explanation: `θ = arctan(${n(y2 / 100)} ÷ ${n(D)}) ${val(t2, 4, 'rad')}, and d sin θ ${val(r2, 4, 'nm')}, which is ${n(L2)} nm to the nearest nanometre.` },
   { prompt: `For second order, sin θ = 2λ ÷ d and y = D tan θ for each whole-number wavelength. How far apart are the two second-order lines, in centimetres to 1 decimal place?`, answer: [rd(gap, 1)], explanation: `For ${n(L1)} nm: sin θ ${val(s1, 4)}, y ${val(Y1, 1, 'cm')}. For ${n(L2)} nm: sin θ ${val(s2, 4)}, y ${val(Y2, 1, 'cm')}. The gap is the difference ${val(gap, 1, 'cm')}.` }
  ] }; }
});

})();
