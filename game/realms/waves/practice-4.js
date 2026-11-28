/* Waves: sound and light practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Helpers. practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints,
   solution and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text
   and the generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm waves --draw 3 */
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* Rounding to k places and its text; "= x" when the value is exactly x at k places and "≈ x" when it was rounded; a guard
   against rounding ties; a test for "k decimal places or fewer"; a bounded retry; ordinals (1st, 2nd, 3rd, 11th). */
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => { const t = rd(x, k).toFixed(k); return (/^-0\.?0*$/.test(t) ? t.slice(1) : t).replace('-', '−'); };
const exact = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-7;
const eq = (x, k) => (exact(x, k) ? '= ' + n(x) : '≈ ' + fx(x, k));
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const same = (p, q) => Object.keys(q).every(key => p[key] === q[key]);
const ord = k => { const m = k % 100; return k + (m >= 11 && m <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[k % 10] || 'th'); };
/* A difference of two rounded answers must equal the rounded difference, so that no way of rounding changes the last digit. */
const steady = (a, b, k) => Math.abs((rd(a, k) - rd(b, k)) - rd(a - b, k)) < 1e-9;
const V = 343;   // speed of sound in the hall and on the track, m/s, as the plan fixes it
/* Pipes of the hall whose fundamental has one decimal place or none: {L, shut, f}. */
const PIPES = []; for (let c = 10; c <= 200; c++) for (const shut of [false, true]) { const L = c / 100, f = V / ((shut ? 4 : 2) * L); if (exact(f, 1) && f >= 60 && f <= 900) PIPES.push({ L, shut, f }); }
const ends = shut => shut ? 'closed at one end, open at the other' : 'open at both ends';
/* The pipe rule, stated in a prompt for the missions whose parent does not teach it. */
const rule = (L, shut) => shut ? `Such a pipe sounds the frequencies n × 343 ÷ (4 × ${n(L)}) for n = 1, 3, 5, … ` : `Such a pipe sounds the frequencies n × 343 ÷ (2 × ${n(L)}) for n = 1, 2, 3, … `;
/* A multiple of v as text: hv(1) is v, hv(3) is 3v. */
const hv = h => h === 1 ? 'v' : n(h) + 'v';
const hs = shut => shut ? [3, 5] : [2, 3, 4];

/* ---- q16 Open and closed pipes: normal modes [V1 17.4] ---- */

/* q16b: a duct of fundamental f; its length and its h-th harmonic. Length off a rounding tie at 3 places, harmonic below 1000 Hz.
   Not the parent's pipe (0.7 m, closed) or its worked example (0.5 m, open). */
const m16b = ({ f, shut, h }) => ({ L: V / ((shut ? 4 : 2) * f), fh: h * f });
practice({ id: 'q16b', parent: 'q16', kind: 'setting', title: 'The roof duct',
 brief: 'An air duct above the stage rings like a pipe, and the sound crew need its length and a higher note it will give.',
 labels: ['duct length (m)', 'harmonic frequency (Hz)'], tolerance: 0.0005 },
 [['duct length (m)'], ['harmonic frequency (Hz)']], {
 canonical: { f: 160, shut: false, h: 4 },
 draw: R => tries(() => { const shut = R.bool(); return { f: R.int(80, 250), shut, h: R.pick(hs(shut)) }; },
  p => { const m = m16b(p); return !edge(m.L, 3) && m.fh < 1000 && !same(p, { f: 160, shut: false, h: 4 }); }, { f: 160, shut: false, h: 4 }),
 build: p => { const { f, shut, h } = p, { L, fh } = m16b(p), k = shut ? 4 : 2; return {
  prompt: `A tuned air duct runs across the roof of the assembly hall. It is ${shut ? 'sealed at one end and open at the other' : 'open at both ends'}, and its fundamental note has a frequency of ${n(f)} Hz. Sound travels at 343 m/s in the hall.${shut ? ' A duct sealed at one end can sound only the odd harmonics.' : ''} Enter the length of the duct in metres to 3 decimal places, then the frequency in Hz of its ${ord(h)} harmonic.`,
  answer: [rd(L, 3), fh],
  hints: [`The fundamental of a pipe ${shut ? 'closed at one end' : 'open at both ends'} is f₁ = v ÷ (${k}L). Rearrange it to find L from the note.`, 'The nth harmonic has n times the fundamental frequency, so the last answer needs no length at all.'],
  solution: `The duct is ${shut ? 'sealed at one end' : 'open at both ends'}, so f₁ = v ÷ (${k}L), which gives L = v ÷ (${k}f₁) = 343 ÷ (${k} × ${n(f)}) ${eq(L, 3)} m. The ${ord(h)} harmonic is ${n(h)} × ${n(f)} = ${n(fh)} Hz.`,
  guidance: [
   { prompt: `The duct is ${shut ? 'sealed at one end' : 'open at both ends'}, so f₁ = v ÷ (${k}L), and rearranged L = v ÷ (${k}f₁). What is L, in metres to 3 decimal places?`, answer: [rd(L, 3)], explanation: `L = 343 ÷ (${k} × ${n(f)}) = 343 ÷ ${n(k * f)} ${eq(L, 3)} m.` },
   { prompt: `The ${ord(h)} harmonic is ${n(h)} times the fundamental. What is its frequency, in Hz?`, answer: [fh], explanation: `${n(h)} × ${n(f)} = ${n(fh)} Hz.` }
  ] }; }
});

/* q16c: a pipe of length L (hundredths of a metre) is cut by `cut` cm. Both fundamentals are off ties at 2 places and
   the rise is the same whether or not the two fundamentals are rounded first. Not the parent's pipe (0.7 m closed, 0.5 m open). */
const m16c = ({ L, cut, shut }) => { const k = shut ? 4 : 2, L2 = G.tidy(L - cut / 100), a = V / (k * L), b = V / (k * L2); return { k, L2, a, b, rise: b - a }; };
practice({ id: 'q16c', parent: 'q16', kind: 'applied', title: 'Shortening the flat pipe',
 brief: 'One organ pipe plays flat, and Mira will saw a little off the open end, so she wants to know the new note before she cuts.',
 labels: ['fundamental before (Hz)', 'fundamental after (Hz)', 'rise (Hz)'], tolerance: 0.005 },
 [['fundamental before (Hz)'], ['fundamental after (Hz)'], ['rise (Hz)']], {
 canonical: { L: 0.9, cut: 6, shut: false },
 draw: R => tries(() => ({ L: R.int(45, 160) / 100, cut: R.int(2, 15), shut: R.bool() }),
  p => { const m = m16c(p); return m.L2 >= 0.3 && m.b < 1500 && !edge(m.a, 2) && !edge(m.b, 2) && !edge(m.rise, 2) && steady(m.b, m.a, 2) && !(p.L === 0.7 && p.shut) && !(p.L === 0.5 && !p.shut) && !same(p, { L: 0.9, cut: 6, shut: false }); },
  { L: 0.9, cut: 6, shut: false }),
 build: p => { const { L, cut, shut } = p, { k, L2, a, b, rise } = m16c(p); return {
  prompt: `An organ pipe in the assembly hall is ${n(L)} m long and ${ends(shut)}. It plays a little flat, so Mira saws ${n(cut)} cm off its length. The pipe keeps the same kind of ends, and sound travels at 343 m/s. Enter the fundamental frequency before the cut, then the fundamental frequency after the cut, then the number of hertz the fundamental rose by, each to 2 decimal places.`,
  answer: [rd(a, 2), rd(b, 2), rd(rise, 2)],
  hints: [`The fundamental of a pipe ${shut ? 'closed at one end' : 'open at both ends'} is f₁ = v ÷ (${k}L). Cutting the pipe changes L but not v.`, 'The new length is the old length minus the cut, after changing centimetres to metres (100 cm make 1 m). The rise is the new fundamental minus the old one.'],
  solution: `Before the cut f₁ = 343 ÷ (${k} × ${n(L)}) ${eq(a, 2)} Hz. The pipe is then ${n(L)} − ${n(G.tidy(cut / 100))} = ${n(L2)} m long, so f₁ = 343 ÷ (${k} × ${n(L2)}) ${eq(b, 2)} Hz. The rise is ${fx(b, 2)} − ${fx(a, 2)} = ${fx(rise, 2)} Hz.`,
  guidance: [
   { prompt: `The pipe is ${n(L)} m long and ${ends(shut)}, so f₁ = v ÷ (${k}L). What is the fundamental before the cut, in Hz to 2 decimal places?`, answer: [rd(a, 2)], explanation: `f₁ = 343 ÷ (${k} × ${n(L)}) = 343 ÷ ${n(G.tidy(k * L))} ${eq(a, 2)} Hz.` },
   { prompt: `${n(cut)} cm is ${n(G.tidy(cut / 100))} m, so the pipe is now ${n(L2)} m long. What is its fundamental, in Hz to 2 decimal places?`, answer: [rd(b, 2)], explanation: `f₁ = 343 ÷ (${k} × ${n(L2)}) = 343 ÷ ${n(G.tidy(k * L2))} ${eq(b, 2)} Hz.` },
   { prompt: 'The rise is the new fundamental minus the old one. By how many hertz did the fundamental rise, to 2 decimal places?', answer: [rd(rise, 2)], explanation: `${fx(b, 2)} − ${fx(a, 2)} = ${fx(rise, 2)} Hz: a shorter pipe sounds higher.` }
  ] }; }
});

/* q16d (uses q14): the speed of sound at T °C, a pipe's h-th harmonic measured as fh = h × f1 Hz; the pipe's length.
   Speed and length are off ties, and rounding the speed first does not change the length's last digit. */
const sound = T => 331 * Math.sqrt(1 + T / 273);
const m16d = ({ T, h, fh, shut }) => { const k = shut ? 4 : 2, v = sound(T), f1 = fh / h, L = v / (k * f1), L2 = rd(v, 2) / (k * f1); return { k, v, f1, L, L2 }; };
practice({ id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q14', title: 'A pipe in the changed air',
 brief: 'The hall’s air is not at the usual 343 m/s temperature, and a pipe rings out a high harmonic that the crew can measure but whose length nobody wrote down.',
 labels: ['speed of sound (m/s)', 'fundamental (Hz)', 'pipe length (m)'], tolerance: 0.0005 },
 [['speed of sound (m/s)'], ['fundamental (Hz)'], ['pipe length (m)']], {
 canonical: { T: 12, h: 3, fh: 540, shut: false },
 draw: R => tries(() => { const shut = R.bool(), h = R.pick(shut ? [3, 5] : [2, 3, 4]); return { T: R.int(2, 38), h, fh: h * R.int(60, 300), shut }; },
  p => { const m = m16d(p); return p.fh < 1000 && !edge(m.v, 2) && !edge(m.L, 3) && rd(m.L, 3) === rd(m.L2, 3) && !same(p, { T: 12, h: 3, fh: 540, shut: false }); },
  { T: 12, h: 3, fh: 540, shut: false }),
 build: p => { const { T, h, fh, shut } = p, { k, v, f1, L } = m16d(p); return {
  prompt: `On a day when the air in the assembly hall is at ${n(T)} °C, the speed of sound at T °C is v = 331 × √(1 + T ÷ 273) m/s. A pipe that is ${ends(shut)}${shut ? ',' : ''} is sounding its ${ord(h)} harmonic, and a microphone measures that note at ${n(fh)} Hz. Enter the speed of sound in the hall in m/s to 2 decimal places, then the pipe’s fundamental frequency in Hz, then the pipe’s length in metres to 3 decimal places.`,
  answer: [rd(v, 2), f1, rd(L, 3)],
  hints: ['Put the temperature into v = 331 × √(1 + T ÷ 273). The nth harmonic is n times the fundamental, so divide the measured note by n.', `For a pipe ${shut ? 'closed at one end' : 'open at both ends'} the fundamental is f₁ = v ÷ (${k}L), so L = v ÷ (${k}f₁). Use this hall’s speed of sound, not 343 m/s.`],
  solution: `v = 331 × √(1 + ${n(T)} ÷ 273) ${eq(v, 2)} m/s. The measured note is the ${ord(h)} harmonic, so f₁ = ${n(fh)} ÷ ${n(h)} = ${n(f1)} Hz. For this pipe f₁ = v ÷ (${k}L), so L = v ÷ (${k}f₁) = ${fx(v, 2)} ÷ (${k} × ${n(f1)}) ${eq(L, 3)} m.`,
  guidance: [
   { prompt: `The air is at ${n(T)} °C. What is v = 331 × √(1 + T ÷ 273), in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `1 + ${n(T)} ÷ 273 ≈ ${fx(1 + T / 273, 4)}, and 331 × its square root ${eq(v, 2)} m/s.` },
   { prompt: `The measured note is the ${ord(h)} harmonic, ${n(h)} times the fundamental. What is the fundamental, in Hz?`, answer: [f1], explanation: `${n(fh)} ÷ ${n(h)} = ${n(f1)} Hz.` },
   { prompt: `For this pipe f₁ = v ÷ (${k}L). Using the speed from the first step, what is L, in metres to 3 decimal places?`, answer: [rd(L, 3)], explanation: `L = ${fx(v, 2)} ÷ (${k} × ${n(f1)}) = ${fx(v, 2)} ÷ ${n(k * f1)} ${eq(L, 3)} m.` }
  ] }; }
});

/* ---- q17 Chapter review: strings and pipes in tune [V1 16.6, 17.4] ---- */

/* q17b: which harmonic of a string matches a pipe's fundamental. The pipe is one of PIPES, the string speed is a whole
   number, the tension has at most 2 decimals and the match is a whole harmonic from the 1st to the 6th.
   Not the parent's worked example (0.01 kg/m, 256 N, 0.5 m string). */
const m17b = ({ Lp, shut, Ls, mu, F }) => { const fp = V / ((shut ? 4 : 2) * Lp), v = G.tidy(Math.sqrt(F / mu)); return { k: shut ? 4 : 2, fp, v, h: G.tidy(2 * Ls * fp / v) }; };
const MU17 = [0.002, 0.0025, 0.004, 0.005, 0.008, 0.01, 0.0125, 0.02, 0.04];
practice({ id: 'q17b', parent: 'q17', kind: 'setting', title: 'The harp and the pipe',
 brief: 'A harp string on the stage must ring in step with one of the hall’s pipes, and Mira needs to know which of its notes does it.',
 labels: ['pipe fundamental (Hz)', 'string wave speed (m/s)', 'harmonic number'], tolerance: 0.01 },
 [['pipe fundamental (Hz)'], ['string wave speed (m/s)'], ['harmonic number']], {
 canonical: { Lp: 0.49, shut: true, Ls: 0.8, mu: 0.01, F: 49 },
 draw: R => tries(() => { const pp = R.pick(PIPES), Ls = R.pick([0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5]), mu = R.pick(MU17), v = 2 * Ls * pp.f / R.int(1, 6);
   return { Lp: pp.L, shut: pp.shut, Ls, mu, F: G.tidy(mu * v * v) }; },
  p => { const m = m17b(p); return Number.isInteger(m.v) && m.v >= 60 && m.v <= 500 && exact(p.F, 2) && Math.abs(p.F - p.mu * m.v * m.v) < 1e-9 && Number.isInteger(m.h) && m.h >= 1 && m.h <= 6 && !same(p, { Lp: 0.49, shut: true, Ls: 0.8, mu: 0.01, F: 49 }) && !(p.mu === 0.01 && p.F === 256 && p.Ls === 0.5); },
  { Lp: 0.49, shut: true, Ls: 0.8, mu: 0.01, F: 49 }),
 build: p => { const { Lp, shut, Ls, mu, F } = p, { k, fp, v, h } = m17b(p); return {
  prompt: `A harp in the assembly hall has a string ${n(Ls)} m long, fixed at both ends, with a linear mass density of ${n(mu)} kg/m and a tension of ${n(F)} N. Beside it stands a pipe ${n(Lp)} m long, ${ends(shut)}. Sound travels at 343 m/s in the hall. Exactly one whole-number harmonic of the string has the same frequency as the pipe’s fundamental. Enter the pipe’s fundamental frequency in Hz, the wave speed on the string in m/s, and the number of that harmonic of the string.`,
  answer: [fp, v, h],
  hints: [`The pipe’s fundamental is v ÷ (${k}L) with v = 343 m/s. On the string, v = √(F_T ÷ μ), which is a different speed.`, 'The nth harmonic of the string has frequency nv ÷ (2L) with the string’s own speed and length. Set it equal to the pipe’s fundamental and solve for n.'],
  solution: `The pipe’s fundamental is 343 ÷ (${k} × ${n(Lp)}) = ${n(fp)} Hz. On the string v = √(${n(F)} ÷ ${n(mu)}) = √${n(G.tidy(v * v))} = ${n(v)} m/s. The string’s nth harmonic is n × ${n(v)} ÷ (2 × ${n(Ls)}) = ${n(fp)}, so n = ${n(fp)} × ${n(G.tidy(2 * Ls))} ÷ ${n(v)} = ${n(h)}.`,
  guidance: [
   { prompt: `The pipe is ${n(Lp)} m long and ${ends(shut)}, so its fundamental is 343 ÷ (${k}L). What is it, in Hz?`, answer: [fp], explanation: `343 ÷ (${k} × ${n(Lp)}) = 343 ÷ ${n(G.tidy(k * Lp))} = ${n(fp)} Hz.` },
   { prompt: `The tension is ${n(F)} N and μ = ${n(mu)} kg/m. What is the wave speed on the string, in m/s?`, answer: [v], explanation: `v = √(${n(F)} ÷ ${n(mu)}) = √${n(G.tidy(v * v))} = ${n(v)} m/s.` },
   { prompt: `The string’s nth harmonic has frequency n × ${n(v)} ÷ (2 × ${n(Ls)}). For which whole number n does this equal ${n(fp)} Hz?`, answer: [h], explanation: `n = ${n(fp)} × ${n(G.tidy(2 * Ls))} ÷ ${n(v)} = ${n(h)}.` }
  ] }; }
});

/* q17c: the tension that tunes a string's h-th harmonic to a pipe's fundamental. The speed needed and the tension have at
   most 2 decimals (so nothing depends on rounding). Not the parent's worked example. */
const m17c = ({ Lp, shut, Ls, mu, hs: h }) => { const k = shut ? 4 : 2, fp = V / (k * Lp), v = 2 * Ls * fp / h; return { k, fp, v, F: mu * v * v }; };
practice({ id: 'q17c', parent: 'q17', kind: 'applied', title: 'Tightening the harp string',
 brief: 'A harp string is a little slack, and Mira has to find how hard to pull it so that it rings with a pipe.',
 labels: ['pipe fundamental (Hz)', 'string speed needed (m/s)', 'tension needed (N)'], tolerance: 0.005 },
 [['pipe fundamental (Hz)'], ['string speed needed (m/s)'], ['tension needed (N)']], {
 canonical: { Lp: 0.7, shut: true, Ls: 0.8, mu: 0.005, hs: 2 },
 draw: R => tries(() => { const pp = R.pick(PIPES); return { Lp: pp.L, shut: pp.shut, Ls: R.pick([0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5]), mu: R.pick(MU17), hs: R.int(1, 5) }; },
  p => { const m = m17c(p); return exact(m.v, 2) && exact(m.F, 2) && m.v >= 40 && m.v <= 450 && m.F >= 1 && m.F < 1000 && !same(p, { Lp: 0.7, shut: true, Ls: 0.8, mu: 0.005, hs: 2 }) && !(p.mu === 0.01 && p.Ls === 0.5 && p.Lp === 0.5 && !p.shut); },
  { Lp: 0.7, shut: true, Ls: 0.8, mu: 0.005, hs: 2 }),
 build: p => { const { Lp, shut, Ls, mu, hs: h } = p, { k, fp, v, F } = m17c(p); return {
  prompt: `Mira is retuning a harp string in the assembly hall. The string is ${n(Ls)} m long, fixed at both ends, and its linear mass density is ${n(mu)} kg/m. Its ${ord(h)} harmonic must sound at exactly the frequency of the fundamental of a pipe ${n(Lp)} m long, ${ends(shut)}. Sound travels at 343 m/s in the hall. Enter the pipe’s fundamental frequency in Hz, the wave speed the string needs in m/s, and the tension the string needs in newtons, each to 2 decimal places.`,
  answer: [fp, v, F],
  hints: ['The string’s nth harmonic is f = nv ÷ (2L), so the wave speed it needs is v = 2Lf ÷ n, where f is the frequency it must sound.', 'On a string v = √(F_T ÷ μ). Square both sides to get the tension: F_T = μv².'],
  solution: `The pipe’s fundamental is 343 ÷ (${k} × ${n(Lp)}) ${eq(fp, 2)} Hz. The string’s ${ord(h)} harmonic is ${hv(h)} ÷ (2 × ${n(Ls)}), which must equal ${n(fp)}, so v = 2 × ${n(Ls)} × ${n(fp)} ÷ ${n(h)} = ${n(v)} m/s. The tension is F_T = μv² = ${n(mu)} × ${n(v)}² = ${n(F)} N.`,
  guidance: [
   { prompt: `The pipe is ${n(Lp)} m long and ${ends(shut)}, so its fundamental is 343 ÷ (${k}L). What is it, in Hz?`, answer: [fp], explanation: `343 ÷ (${k} × ${n(Lp)}) = 343 ÷ ${n(G.tidy(k * Lp))} ${eq(fp, 2)} Hz.` },
   { prompt: `The string’s ${ord(h)} harmonic is ${hv(h)} ÷ (2 × ${n(Ls)}), and it must equal ${n(fp)} Hz. What wave speed does the string need, in m/s?`, answer: [v], explanation: `v = 2 × ${n(Ls)} × ${n(fp)} ÷ ${n(h)} = ${n(v)} m/s.` },
   { prompt: `With μ = ${n(mu)} kg/m, what tension F_T = μv² gives that wave speed, in newtons?`, answer: [F], explanation: `F_T = ${n(mu)} × ${n(v)}² = ${n(F)} N.` }
  ] }; }
});

/* q17d (uses q14): a pipe in the air at T °C sounding its hp-th harmonic, and the length of a string whose hs-th harmonic matches it.
   The string speed is a whole number; the speed of sound, the note and the length are off ties and do not change if the
   earlier answer is rounded first. */
const m17d = ({ T, Lp, shut, hp, mu, F, hs: h }) => { const k = shut ? 4 : 2, vs = G.tidy(Math.sqrt(F / mu)), v = sound(T), f = hp * v / (k * Lp), Ls = h * vs / (2 * f),
 f2 = hp * rd(v, 2) / (k * Lp), Ls2 = h * vs / (2 * rd(f, 2)); return { k, v, f, Ls, f2, Ls2, vs }; };
practice({ id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'Matching a string in the changed air',
 brief: 'The hall’s air is not at the usual 343 m/s temperature, so a pipe sounds differently, and the string beside it must be cut to match.',
 labels: ['speed of sound (m/s)', 'pipe frequency (Hz)', 'string length (m)'], tolerance: 0.0005 },
 [['speed of sound (m/s)'], ['pipe frequency (Hz)'], ['string length (m)']], {
 canonical: { T: 24, Lp: 0.9, shut: true, hp: 3, mu: 0.01, F: 225, hs: 2 },
 draw: R => tries(() => { const shut = R.bool(), mu = R.pick([0.002, 0.004, 0.005, 0.008, 0.01, 0.02]), vs = R.int(80, 350); return { T: R.int(2, 38), Lp: R.int(40, 150) / 100, shut, hp: R.pick(shut ? [1, 3, 5] : [1, 2, 3, 4]), mu, F: G.tidy(mu * vs * vs), hs: R.int(1, 4) }; },
  p => { const m = m17d(p); return exact(p.F, 1) && Number.isInteger(m.vs) && m.f < 1000 && m.f > 60 && m.Ls >= 0.2 && m.Ls <= 2.5 && !edge(m.v, 2) && !edge(m.f, 2) && !edge(m.Ls, 3) && rd(m.f, 2) === rd(m.f2, 2) && rd(m.Ls, 3) === rd(m.Ls2, 3) && !same(p, { T: 24, Lp: 0.9, shut: true, hp: 3, mu: 0.01, F: 225, hs: 2 }); },
  { T: 24, Lp: 0.9, shut: true, hp: 3, mu: 0.01, F: 225, hs: 2 }),
 build: p => { const { T, Lp, shut, hp, mu, F, hs: h } = p, { k, v, f, Ls, vs } = m17d(p); return {
  prompt: `On a day when the air in the assembly hall is at ${n(T)} °C, the speed of sound at T °C is v = 331 × √(1 + T ÷ 273) m/s. A pipe ${n(Lp)} m long, ${ends(shut)}, is sounding its ${ord(hp)} harmonic. A string fixed at both ends, with linear mass density ${n(mu)} kg/m under a tension of ${n(F)} N, must sound its ${ord(h)} harmonic at that same frequency. Enter the speed of sound in m/s to 2 decimal places, the frequency of the pipe’s note in Hz to 2 decimal places, and the length of the string in metres to 3 decimal places.`,
  answer: [rd(v, 2), rd(f, 2), rd(Ls, 3)],
  hints: [`Put the temperature into v = 331 × √(1 + T ÷ 273). A pipe ${shut ? 'closed at one end' : 'open at both ends'} has harmonics nv ÷ (${k}L) for ${shut ? 'odd n' : 'n = 1, 2, 3, …'}, using this hall’s speed of sound.`, 'On the string v = √(F_T ÷ μ), a different speed, and its nth harmonic is nv ÷ (2L). Set that equal to the pipe’s note and solve for the string’s length.'],
  solution: `v = 331 × √(1 + ${n(T)} ÷ 273) ${eq(v, 2)} m/s. The pipe’s ${ord(hp)} harmonic is f = ${hv(hp)} ÷ (${k} × ${n(Lp)}) ${eq(f, 2)} Hz. On the string v = √(${n(F)} ÷ ${n(mu)}) = ${n(vs)} m/s. Its ${ord(h)} harmonic is ${n(h)} × ${n(vs)} ÷ (2L) = f, so L = ${n(h)} × ${n(vs)} ÷ (2 × ${fx(f, 2)}) ${eq(Ls, 3)} m.`,
  guidance: [
   { prompt: `The air is at ${n(T)} °C. What is v = 331 × √(1 + T ÷ 273), in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `1 + ${n(T)} ÷ 273 ≈ ${fx(1 + T / 273, 4)}, and 331 × its square root ${eq(v, 2)} m/s.` },
   { prompt: `The pipe’s ${ord(hp)} harmonic is ${hv(hp)} ÷ (${k}L) with L = ${n(Lp)} m. What is its frequency, in Hz to 2 decimal places?`, answer: [rd(f, 2)], explanation: `f = ${n(hp)} × ${fx(v, 2)} ÷ (${k} × ${n(Lp)}) ${eq(f, 2)} Hz.` },
   { prompt: `On the string v = √(F_T ÷ μ) = ${n(vs)} m/s, and its ${ord(h)} harmonic is ${hv(h)} ÷ (2L). Setting that equal to the pipe’s note, what is L, in metres to 3 decimal places?`, answer: [rd(Ls, 3)], explanation: `L = ${n(h)} × ${n(vs)} ÷ (2 × ${fx(f, 2)}) ${eq(Ls, 3)} m.` }
  ] }; }
});

/* ---- q18 Beats [V1 17.6] ---- */

/* q18b: c beats counted in t s between the tower's siren f1 and a rover's siren known to be higher or lower. The beat
   frequency c ÷ t has at most one decimal. Not the parent's worked example (256 and 259 Hz). */
const m18b = ({ f1, c, t, up }) => { const fb = G.tidy(c / t); return { fb, f2: G.tidy(up ? f1 + fb : f1 - fb) }; };
practice({ id: 'q18b', parent: 'q18', kind: 'setting', title: 'Two sirens on the track',
 brief: 'The tower’s siren and a rover’s siren are out of tune, and Mira can only count the swells in the sound to find the rover’s note.',
 labels: ['beat frequency (Hz)', 'rover siren frequency (Hz)'], tolerance: 0.01 },
 [['beat frequency (Hz)'], ['rover siren frequency (Hz)']], {
 canonical: { f1: 520, c: 9, t: 5, up: true },
 draw: R => tries(() => ({ f1: 10 * R.int(20, 90), c: R.int(3, 40), t: R.pick([2, 4, 5, 10]), up: R.bool() }),
  p => { const m = m18b(p); return exact(m.fb, 1) && m.fb >= 1 && m.fb <= 12 && p.f1 !== 256 && !same(p, { f1: 520, c: 9, t: 5, up: true }); }, { f1: 520, c: 9, t: 5, up: true }),
 build: p => { const { f1, c, t, up } = p, { fb, f2 } = m18b(p); return {
  prompt: `Two sirens on the track are being compared. The tower’s siren sounds at ${n(f1)} Hz. A rover’s siren, known to be ${up ? 'higher' : 'lower'} in pitch than the tower’s, sounds at the same time. Mira stands between them and counts ${n(c)} loud swells in ${n(t)} s. Enter the beat frequency in Hz, then the frequency of the rover’s siren in Hz.`,
  answer: [fb, f2],
  hints: ['The beat frequency is the number of loud swells each second: the number counted divided by the time in seconds.', 'The beat frequency says only how far apart the two notes are. The problem tells you whether the rover’s siren is above or below the tower’s, so add or subtract the beat frequency.'],
  solution: `The beat frequency is ${n(c)} ÷ ${n(t)} = ${n(fb)} Hz. The rover’s siren is ${up ? 'higher' : 'lower'} than the tower’s, so its frequency is ${n(f1)} ${up ? '+' : '−'} ${n(fb)} = ${n(f2)} Hz.`,
  guidance: [
   { prompt: `Mira counts ${n(c)} loud swells in ${n(t)} s. How many swells is that each second, in Hz?`, answer: [fb], explanation: `${n(c)} ÷ ${n(t)} = ${n(fb)} swells a second, so the beat frequency is ${n(fb)} Hz.` },
   { prompt: `The two notes are ${n(fb)} Hz apart and the rover’s is ${up ? 'higher' : 'lower'} than the tower’s ${n(f1)} Hz. What is the rover’s frequency, in Hz?`, answer: [f2], explanation: `${n(f1)} ${up ? '+' : '−'} ${n(fb)} = ${n(f2)} Hz.` }
  ] }; }
});

/* q18c: a rover siren lower than the tower's, a beat count before, then the rover's siren is raised by s Hz: the new beat
   frequency |f_b − s|, which is s − f_b when the technician has overshot. s is never f_b. */
const m18c = ({ ft, c, t, s }) => { const fb = G.tidy(c / t), fr = G.tidy(ft - fb), fr2 = G.tidy(fr + s); return { fb, fr, fr2, after: G.tidy(Math.abs(ft - fr2)) }; };
practice({ id: 'q18c', parent: 'q18', kind: 'applied', title: 'Raising the rover’s siren',
 brief: 'A technician is nudging a rover’s siren up towards the tower’s note, and Mira must check by ear whether the swells slow down or start again.',
 labels: ['beat frequency before (Hz)', 'rover frequency before (Hz)', 'beat frequency after (Hz)'], tolerance: 0.01 },
 [['beat frequency before (Hz)'], ['rover frequency before (Hz)'], ['beat frequency after (Hz)']], {
 canonical: { ft: 480, c: 15, t: 5, s: 2 },
 draw: R => tries(() => ({ ft: 10 * R.int(20, 90), c: R.int(3, 40), t: R.pick([2, 4, 5, 10]), s: R.int(1, 24) / 2 }),
  p => { const m = m18c(p); return exact(m.fb, 1) && m.fb >= 1 && m.fb <= 12 && m.fb !== p.s && !same(p, { ft: 480, c: 15, t: 5, s: 2 }); }, { ft: 480, c: 15, t: 5, s: 2 }),
 build: p => { const { ft, c, t, s } = p, { fb, fr, fr2, after } = m18c(p), over = fr2 > ft; return {
  prompt: `Mira is tuning the siren on a rover to match the tower’s. The tower’s siren sounds at ${n(ft)} Hz. The rover’s siren sounds a lower note, and sounded together the two give ${n(c)} loud swells in ${n(t)} s. A technician then raises the rover’s siren by ${n(s)} Hz. Enter the beat frequency before the change in Hz, then the rover’s frequency before the change in Hz, then the beat frequency after the change in Hz. A beat frequency is never negative.`,
  answer: [fb, fr, after],
  hints: ['The beat frequency is the number of swells each second, and it equals the difference of the two frequencies taken as positive. The rover’s siren starts lower than the tower’s.', 'After the change work out the rover’s new frequency, then take the difference from the tower’s again. Check whether the rover is still below the tower or has been raised past it.'],
  solution: `Before: the beat frequency is ${n(c)} ÷ ${n(t)} = ${n(fb)} Hz, and the rover is lower, so its frequency is ${n(ft)} − ${n(fb)} = ${n(fr)} Hz. After raising it by ${n(s)} Hz it sounds at ${n(fr)} + ${n(s)} = ${n(fr2)} Hz, which is ${over ? 'now above' : 'still below'} the tower’s ${n(ft)} Hz, so the beat frequency is ${over ? `${n(fr2)} − ${n(ft)}` : `${n(ft)} − ${n(fr2)}`} = ${n(after)} Hz.`,
  guidance: [
   { prompt: `Mira counts ${n(c)} swells in ${n(t)} s. What is the beat frequency before the change, in Hz?`, answer: [fb], explanation: `${n(c)} ÷ ${n(t)} = ${n(fb)} Hz.` },
   { prompt: `The rover’s siren is lower than the tower’s ${n(ft)} Hz by that beat frequency. What is the rover’s frequency before the change, in Hz?`, answer: [fr], explanation: `${n(ft)} − ${n(fb)} = ${n(fr)} Hz.` },
   { prompt: `The rover’s siren is raised by ${n(s)} Hz, so it now sounds at ${n(fr2)} Hz. What is the beat frequency with the tower’s ${n(ft)} Hz now, in Hz?`, answer: [after], explanation: `${n(fr2)} is ${over ? 'above' : 'below'} ${n(ft)}, and the difference taken as positive is ${n(after)} Hz.` }
  ] }; }
});

/* q18d (uses q16): a pipe's h-th harmonic against a fork of fk Hz; the beat frequency and the count in t s. The harmonic has at most
   one decimal, the fork is a whole number, and the count of beats in t s is a whole number. */
const m18d = ({ Lp, shut, h, fk, t }) => { const fh = G.tidy(h * V / ((shut ? 4 : 2) * Lp)), fb = G.tidy(Math.abs(fh - fk)); return { k: shut ? 4 : 2, fh, fb, count: G.tidy(fb * t) }; };
practice({ id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q16', title: 'A siren pipe against a fork',
 brief: 'The tower’s siren is a single pipe, and Mira checks one of its high notes against a tuning fork by listening for beats.',
 labels: ['harmonic frequency (Hz)', 'beat frequency (Hz)', 'beats counted'], tolerance: 0.01 },
 [['harmonic frequency (Hz)'], ['beat frequency (Hz)'], ['beats counted']], {
 canonical: { Lp: 0.7, shut: false, h: 3, fk: 738, t: 6 },
 draw: R => tries(() => { const pp = R.pick(PIPES), h = R.pick(hs(pp.shut)), fh = h * pp.f; return { Lp: pp.L, shut: pp.shut, h, fk: Math.round(fh) + R.int(-7, 7), t: R.pick([2, 4, 6, 10]) }; },
  p => { const m = m18d(p); return m.fh < 1000 && exact(m.fh, 1) && m.fb >= 0.5 && m.fb <= 7 && Number.isInteger(m.count) && !same(p, { Lp: 0.7, shut: false, h: 3, fk: 738, t: 6 }); },
  { Lp: 0.7, shut: false, h: 3, fk: 738, t: 6 }),
 build: p => { const { Lp, shut, h, fk, t } = p, { k, fh, fb, count } = m18d(p); return {
  prompt: `The siren tower’s pipe is ${n(Lp)} m long and ${ends(shut)}. ${rule(Lp, shut)}Sound travels at 343 m/s. Mira sounds the pipe’s ${ord(h)} harmonic together with a tuning fork of ${n(fk)} Hz and listens for beats. Enter the frequency of the pipe’s ${ord(h)} harmonic in Hz, then the beat frequency in Hz (both come out exact, with at most one decimal place, so no rounding is needed), then the number of beats she hears in ${n(t)} s.`,
  answer: [fh, fb, count],
  hints: [`The nth harmonic of this pipe is n × 343 ÷ (${k}L). Put in n and the length.`, 'The beat frequency is the difference of the two frequencies taken as positive, and the beats in a stretch of time are the beat frequency times the time.'],
  solution: `The ${ord(h)} harmonic is ${n(h)} × 343 ÷ (${k} × ${n(Lp)}) = ${n(fh)} Hz. The beat frequency is |${n(fh)} − ${n(fk)}| = ${n(fb)} Hz. In ${n(t)} s that is ${n(fb)} × ${n(t)} = ${n(count)} beats.`,
  guidance: [
   { prompt: `The ${ord(h)} harmonic is ${n(h)} × 343 ÷ (${k} × ${n(Lp)}). What is its frequency, in Hz?`, answer: [fh], explanation: `${n(h)} × 343 ÷ ${n(G.tidy(k * Lp))} = ${n(fh)} Hz.` },
   { prompt: `The pipe’s note is ${n(fh)} Hz and the fork is ${n(fk)} Hz. What is the beat frequency, in Hz?`, answer: [fb], explanation: `|${n(fh)} − ${n(fk)}| = ${n(fb)} Hz.` },
   { prompt: `At a beat frequency of ${n(fb)} Hz, how many beats does she hear in ${n(t)} s?`, answer: [count], explanation: `${n(fb)} × ${n(t)} = ${n(count)} beats.` }
  ] }; }
});

/* ---- q19 Doppler effect for a moving source [V1 17.7] ---- */

const dop = (fs, vs) => ({ fa: fs * V / (V - vs), fl: fs * V / (V + vs) });
/* q19b: a hauler's horn of fs Hz at kmh km/h (a multiple of 18, so a whole number of m/s). Both heard frequencies are off
   ties at 1 place and below 1000 Hz. Not the parent's worked example (500 Hz, 30 m/s). */
practice({ id: 'q19b', parent: 'q19', kind: 'setting', title: 'The hauler’s horn',
 brief: 'A cargo hauler thunders along the track, and Mira wants to know how its horn will change as it passes the tower.',
 labels: ['heard approaching (Hz)', 'heard moving away (Hz)'], tolerance: 0.01 },
 [['speed (m/s)'], ['heard approaching (Hz)'], ['heard moving away (Hz)']], {
 canonical: { fs: 420, kmh: 90 },
 draw: R => tries(() => ({ fs: 10 * R.int(25, 85), kmh: 18 * R.int(2, 8) }),
  p => { const m = dop(p.fs, p.kmh / 3.6); return m.fa < 1000 && !edge(m.fa, 1) && !edge(m.fl, 1) && !(p.fs === 500 && p.kmh === 108) && !same(p, { fs: 420, kmh: 90 }); }, { fs: 420, kmh: 90 }),
 build: p => { const { fs, kmh } = p, vs = G.tidy(kmh / 3.6), { fa, fl } = dop(fs, vs); return {
  prompt: `A cargo hauler drives along the track at ${n(kmh)} km/h, sounding its horn at ${n(fs)} Hz. To change a speed in km/h into m/s, divide by 3.6. Mira stands still beside the track, and sound travels at 343 m/s. Enter the frequency she hears while the hauler comes towards her, then the frequency she hears after it has passed and is moving away, both in Hz to 1 decimal place.`,
  answer: [rd(fa, 1), rd(fl, 1)],
  hints: ['Change the speed to m/s first: divide the speed in km/h by 3.6.', 'For a moving source and a listener standing still, f_o = f_s × v ÷ (v − v_s) while the source comes towards the listener, and f_o = f_s × v ÷ (v + v_s) while it moves away.'],
  solution: `${n(kmh)} ÷ 3.6 = ${n(vs)} m/s. Coming towards her: f_o = ${n(fs)} × 343 ÷ (343 − ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V - vs)} ${eq(fa, 1)} Hz. Moving away: f_o = ${n(fs)} × 343 ÷ (343 + ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V + vs)} ${eq(fl, 1)} Hz.`,
  guidance: [
   { prompt: `The hauler drives at ${n(kmh)} km/h. Dividing by 3.6, what is its speed in m/s?`, answer: [vs], explanation: `${n(kmh)} ÷ 3.6 = ${n(vs)} m/s.` },
   { prompt: `While the hauler comes towards Mira the bottom of the formula is 343 − ${n(vs)} = ${n(V - vs)} m/s. What does she hear, f_s × 343 ÷ ${n(V - vs)}, in Hz to 1 decimal place?`, answer: [rd(fa, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V - vs)} ${eq(fa, 1)} Hz, higher than the horn’s own ${n(fs)} Hz.` },
   { prompt: `After it passes, the bottom is 343 + ${n(vs)} = ${n(V + vs)} m/s. What does she hear then, in Hz to 1 decimal place?`, answer: [rd(fl, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V + vs)} ${eq(fl, 1)} Hz, lower than the horn’s own note.` }
  ] }; }
});

/* q19c: two rovers with the same siren, both driving towards Mira, A at v1 and B at v2 (1 to 4 m/s apart, so the two notes are
   close enough to make swells); the swells she hears are |f1 − f2|, from 1 to 12 a second. The rounded beat frequency does not
   depend on rounding the two notes first. */
const m19c = ({ fs, v1, v2 }) => { const f1 = fs * V / (V - v1), f2 = fs * V / (V - v2); return { f1, f2, bt: Math.abs(f1 - f2) }; };
practice({ id: 'q19c', parent: 'q19', kind: 'applied', title: 'Two rovers, one throb',
 brief: 'Two rovers with identical sirens come along the track almost together, and Mira hears the sound pulse instead of settling on one note.',
 labels: ['heard from rover A (Hz)', 'heard from rover B (Hz)', 'swells per second (Hz)'], tolerance: 0.01 },
 [['heard from rover A (Hz)'], ['heard from rover B (Hz)'], ['swells per second (Hz)']], {
 canonical: { fs: 600, v1: 24, v2: 27 },
 draw: R => tries(() => { const v1 = R.int(10, 36); return { fs: 10 * R.int(30, 85), v1, v2: v1 + R.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }; },
  p => { const m = m19c(p); return m.f1 < 1000 && m.f2 < 1000 && !edge(m.f1, 1) && !edge(m.f2, 1) && !edge(m.bt, 1) && steady(Math.max(m.f1, m.f2), Math.min(m.f1, m.f2), 1) && m.bt >= 1 && m.bt <= 12 && !same(p, { fs: 600, v1: 24, v2: 27 }); },
  { fs: 600, v1: 24, v2: 27 }),
 build: p => { const { fs, v1, v2 } = p, { f1, f2, bt } = m19c(p), hi = Math.max(f1, f2), lo = Math.min(f1, f2); return {
  prompt: `Two rovers carry identical sirens sounding at ${n(fs)} Hz. Mira stands still beside the track. Rover A drives towards her at ${n(v1)} m/s and rover B also drives towards her, at ${n(v2)} m/s, and both sirens sound at once. Sound travels at 343 m/s. When two notes sound together, the sound swells and fades |f₁ − f₂| times a second. Enter the frequency Mira hears from rover A, then from rover B, then the number of swells each second she hears, each in Hz to 1 decimal place.`,
  answer: [rd(f1, 1), rd(f2, 1), rd(bt, 1)],
  hints: ['A source coming towards a still listener gives f_o = f_s × v ÷ (v − v_s). Work out each rover separately with its own speed.', 'The swells each second are the difference of the two heard frequencies, taken as positive.'],
  solution: `Rover A: f = ${n(fs)} × 343 ÷ (343 − ${n(v1)}) = ${n(fs)} × 343 ÷ ${n(V - v1)} ${eq(f1, 1)} Hz. Rover B: f = ${n(fs)} × 343 ÷ (343 − ${n(v2)}) = ${n(fs)} × 343 ÷ ${n(V - v2)} ${eq(f2, 1)} Hz. The swells each second are ${fx(hi, 1)} − ${fx(lo, 1)} = ${fx(bt, 1)} Hz.`,
  guidance: [
   { prompt: `Rover A comes towards Mira at ${n(v1)} m/s, so the bottom of the formula is 343 − ${n(v1)} = ${n(V - v1)} m/s. What does she hear from it, in Hz to 1 decimal place?`, answer: [rd(f1, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V - v1)} ${eq(f1, 1)} Hz.` },
   { prompt: `Rover B comes towards her at ${n(v2)} m/s, so the bottom is 343 − ${n(v2)} = ${n(V - v2)} m/s. What does she hear from it, in Hz to 1 decimal place?`, answer: [rd(f2, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V - v2)} ${eq(f2, 1)} Hz.` },
   { prompt: 'What is the number of swells each second, the difference of the two heard frequencies taken as positive, in Hz to 1 decimal place?', answer: [rd(bt, 1)], explanation: `${fx(hi, 1)} − ${fx(lo, 1)} = ${fx(bt, 1)} Hz.` }
  ] }; }
});

/* q19d (uses q16): the rover's siren is a pipe of length Lp whose n-th harmonic is the note; Mira, standing still, hears it
   coming and going. The pipe's note has at most one decimal; both heard notes are off ties at 1 place and below 1000 Hz. */
const m19d = ({ Lp, shut, h, vs }) => { const fs = G.tidy(h * V / ((shut ? 4 : 2) * Lp)), d = dop(fs, vs); return { k: shut ? 4 : 2, fs, fa: d.fa, fl: d.fl }; };
practice({ id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q16', title: 'A pipe on wheels',
 brief: 'The rover’s siren is really a short organ pipe, so its note has to be worked out before Mira can hear how it shifts.',
 labels: ['siren frequency (Hz)', 'heard approaching (Hz)', 'heard moving away (Hz)'], tolerance: 0.01 },
 [['siren frequency (Hz)'], ['heard approaching (Hz)'], ['heard moving away (Hz)']], {
 canonical: { Lp: 0.7, shut: true, h: 3, vs: 16 },
 draw: R => tries(() => { const pp = R.pick(PIPES), h = R.pick(hs(pp.shut)); return { Lp: pp.L, shut: pp.shut, h, vs: R.int(8, 40) }; },
  p => { const m = m19d(p); return m.fs < 800 && m.fa < 1000 && !edge(m.fa, 1) && !edge(m.fl, 1) && !same(p, { Lp: 0.7, shut: true, h: 3, vs: 16 }); },
  { Lp: 0.7, shut: true, h: 3, vs: 16 }),
 build: p => { const { Lp, shut, h, vs } = p, { k, fs, fa, fl } = m19d(p); return {
  prompt: `The siren on a rover is a pipe ${n(Lp)} m long, ${ends(shut)}, sounding its ${ord(h)} harmonic. ${rule(Lp, shut)}The rover drives along the track at ${n(vs)} m/s. Mira stands still beside the track, and sound travels at 343 m/s. Enter the frequency of the siren in Hz, then the frequency she hears while the rover comes towards her, then the frequency she hears after it has passed and is moving away, each in Hz to 1 decimal place (the siren’s own frequency comes out exact at 1 decimal place, so it needs no rounding).`,
  answer: [fs, rd(fa, 1), rd(fl, 1)],
  hints: [`The nth harmonic of this pipe is n × 343 ÷ (${k}L). That is the frequency of the siren itself, as heard on the rover.`, 'Then, for a source moving past a still listener, f_o = f_s × v ÷ (v − v_s) while it comes towards her and f_o = f_s × v ÷ (v + v_s) while it moves away.'],
  solution: `The ${ord(h)} harmonic is f_s = ${n(h)} × 343 ÷ (${k} × ${n(Lp)}) = ${n(fs)} Hz. Coming towards her: f_o = ${n(fs)} × 343 ÷ (343 − ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V - vs)} ${eq(fa, 1)} Hz. Moving away: f_o = ${n(fs)} × 343 ÷ (343 + ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V + vs)} ${eq(fl, 1)} Hz.`,
  guidance: [
   { prompt: `The ${ord(h)} harmonic of the pipe is ${n(h)} × 343 ÷ (${k} × ${n(Lp)}). What is the siren’s frequency, in Hz?`, answer: [fs], explanation: `${n(h)} × 343 ÷ ${n(G.tidy(k * Lp))} = ${n(fs)} Hz.` },
   { prompt: `While the rover comes towards Mira the bottom of the formula is 343 − ${n(vs)} = ${n(V - vs)} m/s. What does she hear, in Hz to 1 decimal place?`, answer: [rd(fa, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V - vs)} ${eq(fa, 1)} Hz.` },
   { prompt: `After it passes, the bottom is 343 + ${n(vs)} = ${n(V + vs)} m/s. What does she hear then, in Hz to 1 decimal place?`, answer: [rd(fl, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V + vs)} ${eq(fl, 1)} Hz.` }
  ] }; }
});

/* ---- q20 Doppler effect for a moving listener, and both moving [V1 17.7] ---- */

/* q20b: a beacon of fs Hz passed by a rover driving at vo m/s; heard going in and going out. Both off ties at 1 place and below
   1000 Hz. Not the parent's worked example (500 Hz, 10 m/s). */
const m20b = ({ fs, vo }) => ({ fi: fs * (V + vo) / V, fo: fs * (V - vo) / V });
practice({ id: 'q20b', parent: 'q20', kind: 'setting', title: 'Driving past the beacon',
 brief: 'A navigation beacon beside the track never moves, but the crew in a passing rover hear its note change as they drive by.',
 labels: ['heard going in (Hz)', 'heard going out (Hz)'], tolerance: 0.01 },
 [['top of the formula (m/s)'], ['heard going in (Hz)'], ['heard going out (Hz)']], {
 canonical: { fs: 620, vo: 14 },
 draw: R => tries(() => ({ fs: 10 * R.int(30, 90), vo: R.int(6, 30) }),
  p => { const m = m20b(p); return m.fi < 1000 && !edge(m.fi, 1) && !edge(m.fo, 1) && !(p.fs === 500 && p.vo === 10) && !same(p, { fs: 620, vo: 14 }); }, { fs: 620, vo: 14 }),
 build: p => { const { fs, vo } = p, { fi, fo } = m20b(p); return {
  prompt: `A navigation beacon beside the track sounds a steady ${n(fs)} Hz. A survey rover drives straight past it at ${n(vo)} m/s, and Mira, riding in the rover, hears the beacon on the way in and again on the way out. Sound travels at 343 m/s in the still air. Enter the frequency she hears while the rover is driving towards the beacon, then the frequency she hears after the rover has gone past and is driving away, both in Hz to 1 decimal place.`,
  answer: [rd(fi, 1), rd(fo, 1)],
  hints: ['The beacon is still and the listener moves, so f_o = f_s × (v ± v_o) ÷ v: use + while the listener moves towards the source and − while she moves away.', 'Going in, the waves pass her faster than 343 m/s and the note is higher than the beacon’s; going out they pass more slowly and it is lower. Check your two answers against that.'],
  solution: `Going in: f_o = ${n(fs)} × (343 + ${n(vo)}) ÷ 343 = ${n(fs)} × ${n(V + vo)} ÷ 343 ${eq(fi, 1)} Hz. Going out: f_o = ${n(fs)} × (343 − ${n(vo)}) ÷ 343 = ${n(fs)} × ${n(V - vo)} ÷ 343 ${eq(fo, 1)} Hz.`,
  guidance: [
   { prompt: `Going in, Mira moves towards the beacon at ${n(vo)} m/s. What is the top of the formula, 343 + ${n(vo)}, in m/s?`, answer: [V + vo], explanation: `343 + ${n(vo)} = ${n(V + vo)} m/s: the speed at which the waves pass her.` },
   { prompt: `What does she hear going in, ${n(fs)} × ${n(V + vo)} ÷ 343, in Hz to 1 decimal place?`, answer: [rd(fi, 1)], explanation: `${n(fs)} × ${n(V + vo)} ÷ 343 ${eq(fi, 1)} Hz, higher than the beacon’s ${n(fs)} Hz.` },
   { prompt: `Going out the top is 343 − ${n(vo)} = ${n(V - vo)} m/s. What does she hear, in Hz to 1 decimal place?`, answer: [rd(fo, 1)], explanation: `${n(fs)} × ${n(V - vo)} ÷ 343 ${eq(fo, 1)} Hz, lower than the beacon’s note.` }
  ] }; }
});

/* q20c: two rovers meet head-on on the track: the note Mira (speed u) hears from the siren rover (speed v) just before they pass,
   just after, and the drop. u and v differ; the drop is the same whether or not the two notes are rounded first. */
const m20c = ({ fs, u, v }) => { const f1 = fs * (V + u) / (V - v), f2 = fs * (V - u) / (V + v); return { f1, f2, drop: f1 - f2 }; };
practice({ id: 'q20c', parent: 'q20', kind: 'applied', title: 'Rovers passing on the straight',
 brief: 'Two rovers pass each other head-on, and Mira wants to know how far the siren’s note falls as they go by.',
 labels: ['heard just before (Hz)', 'heard just after (Hz)', 'drop in note (Hz)'], tolerance: 0.01 },
 [['heard just before (Hz)'], ['heard just after (Hz)'], ['drop in note (Hz)']], {
 canonical: { fs: 520, u: 18, v: 26 },
 draw: R => tries(() => ({ fs: 10 * R.int(25, 75), u: R.int(8, 35), v: R.int(8, 35) }),
  p => { const m = m20c(p); return p.u !== p.v && m.f1 < 1000 && !edge(m.f1, 1) && !edge(m.f2, 1) && !edge(m.drop, 1) && steady(m.f1, m.f2, 1) && !(p.fs === 500 && p.u === 10 && p.v === 20) && !same(p, { fs: 520, u: 18, v: 26 }); },
  { fs: 520, u: 18, v: 26 }),
 build: p => { const { fs, u, v } = p, { f1, f2, drop } = m20c(p); return {
  prompt: `Two rovers meet head-on on a long straight of the track. The first carries a siren sounding at ${n(fs)} Hz and drives at ${n(v)} m/s. Mira rides the second at ${n(u)} m/s. Both speeds are measured against the ground, and sound travels at 343 m/s in the still air. Enter the frequency Mira hears just before the rovers pass, then the frequency she hears just after they have passed and are moving apart, then the number of hertz the note drops by, each to 1 decimal place.`,
  answer: [rd(f1, 1), rd(f2, 1), rd(drop, 1)],
  hints: ['With both moving, f_o = f_s × (v ± v_o) ÷ (v ∓ v_s). Use the top signs (+ on top, − below) while they move towards each other and the bottom signs (− on top, + below) once they move apart.', 'The drop is the note before the pass minus the note after it.'],
  solution: `Before they pass, towards each other: f_o = ${n(fs)} × (343 + ${n(u)}) ÷ (343 − ${n(v)}) = ${n(fs)} × ${n(V + u)} ÷ ${n(V - v)} ${eq(f1, 1)} Hz. After they pass, moving apart: f_o = ${n(fs)} × (343 − ${n(u)}) ÷ (343 + ${n(v)}) = ${n(fs)} × ${n(V - u)} ÷ ${n(V + v)} ${eq(f2, 1)} Hz. The drop is ${fx(f1, 1)} − ${fx(f2, 1)} = ${fx(drop, 1)} Hz.`,
  guidance: [
   { prompt: `Towards each other: f_o = ${n(fs)} × (343 + ${n(u)}) ÷ (343 − ${n(v)}) = ${n(fs)} × ${n(V + u)} ÷ ${n(V - v)}. What is it, in Hz to 1 decimal place?`, answer: [rd(f1, 1)], explanation: `${n(fs)} × ${n(V + u)} ÷ ${n(V - v)} ${eq(f1, 1)} Hz.` },
   { prompt: `Moving apart: f_o = ${n(fs)} × (343 − ${n(u)}) ÷ (343 + ${n(v)}) = ${n(fs)} × ${n(V - u)} ÷ ${n(V + v)}. What is it, in Hz to 1 decimal place?`, answer: [rd(f2, 1)], explanation: `${n(fs)} × ${n(V - u)} ÷ ${n(V + v)} ${eq(f2, 1)} Hz.` },
   { prompt: 'What is the drop in the note, the first answer minus the second, in Hz to 1 decimal place?', answer: [rd(drop, 1)], explanation: `${fx(f1, 1)} − ${fx(f2, 1)} = ${fx(drop, 1)} Hz.` }
  ] }; }
});

/* q20d: both rovers drive the same way along the straight, the listener behind the siren rover (lis) or ahead of it. The
   chase note is fs(v + vo) ÷ (v + vs) behind and fs(v − vo) ÷ (v − vs) ahead; then the listener stops. vo and vs differ. */
const m20d = ({ fs, vo, vs, lis }) => { const top = lis ? V + vo : V - vo, bot = lis ? V + vs : V - vs; return { top, bot, f1: fs * top / bot, f2: fs * V / bot }; };
practice({ id: 'q20d', parent: 'q20', kind: 'challenge', title: 'One rover chasing another',
 brief: 'Two rovers race the same way down the straight, and Mira must work out how the siren sounds when neither is coming head-on.',
 labels: ['heard while driving (Hz)', 'heard after she stops (Hz)'], tolerance: 0.01 },
 [['top of the formula (m/s)'], ['heard while driving (Hz)'], ['heard after she stops (Hz)']], {
 canonical: { fs: 700, vo: 30, vs: 18, lis: true },
 draw: R => tries(() => ({ fs: 10 * R.int(40, 85), vo: R.int(6, 35), vs: R.int(6, 35), lis: R.bool() }),
  p => { const m = m20d(p); return p.vo !== p.vs && m.f1 < 1000 && !edge(m.f1, 1) && !edge(m.f2, 1) && !(p.fs === 500 && p.vo === 10) && !same(p, { fs: 700, vo: 30, vs: 18, lis: true }); },
  { fs: 700, vo: 30, vs: 18, lis: true }),
 build: p => { const { fs, vo, vs, lis } = p, { top, bot, f1, f2 } = m20d(p); return {
  prompt: `Two rovers drive the same way along a straight stretch of the track, one behind the other. The rover with the siren sounds ${n(fs)} Hz and drives at ${n(vs)} m/s. Mira’s rover drives at ${n(vo)} m/s in the same direction, ${lis ? 'behind the siren rover: she is following it, so the siren is in front of her and moving away from her, while she moves towards it' : 'in front of the siren rover: it is following her, so the siren is behind her and moving towards her, while she moves away from it'}. Both speeds are measured against the ground, and sound travels at 343 m/s in the still air. Enter the frequency Mira hears while both rovers are driving, then the frequency she hears if she stops her rover while the siren rover keeps its speed, both in Hz to 1 decimal place.`,
  answer: [rd(f1, 1), rd(f2, 1)],
  hints: ['In f_o = f_s × (v ± v_o) ÷ (v ∓ v_s), the top is v + v_o when the listener moves towards the source and v − v_o when she moves away. The bottom is v − v_s when the source moves towards the listener and v + v_s when it moves away.', 'Decide for each rover whether it is moving towards or away from the other one along the line between them. A listener who has stopped has v_o = 0.'],
  solution: `${lis ? 'Mira is behind the siren rover, so she moves towards it while it moves away from her' : 'Mira is ahead of the siren rover, so she moves away from it while it moves towards her'}. So f_o = ${n(fs)} × (343 ${lis ? '+' : '−'} ${n(vo)}) ÷ (343 ${lis ? '+' : '−'} ${n(vs)}) = ${n(fs)} × ${n(top)} ÷ ${n(bot)} ${eq(f1, 1)} Hz. When she stops, v_o = 0 and f_o = ${n(fs)} × 343 ÷ ${n(bot)} ${eq(f2, 1)} Hz.`,
  guidance: [
   { prompt: `Mira ${lis ? 'moves towards the siren rover' : 'moves away from the siren rover'} at ${n(vo)} m/s. What is the top of the formula, 343 ${lis ? '+' : '−'} ${n(vo)}, in m/s?`, answer: [top], explanation: `343 ${lis ? '+' : '−'} ${n(vo)} = ${n(top)} m/s.` },
   { prompt: `The siren rover ${lis ? 'moves away from' : 'moves towards'} Mira at ${n(vs)} m/s, so the bottom is 343 ${lis ? '+' : '−'} ${n(vs)} = ${n(bot)} m/s. What does she hear while both drive, ${n(fs)} × ${n(top)} ÷ ${n(bot)}, in Hz to 1 decimal place?`, answer: [rd(f1, 1)], explanation: `${n(fs)} × ${n(top)} ÷ ${n(bot)} ${eq(f1, 1)} Hz.` },
   { prompt: `Mira stops, so the top is just 343 m/s and the bottom is still ${n(bot)} m/s. What does she hear now, in Hz to 1 decimal place?`, answer: [rd(f2, 1)], explanation: `${n(fs)} × 343 ÷ ${n(bot)} ${eq(f2, 1)} Hz.` }
  ] }; }
});

})();
