/* Electricity and magnetism: fields practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p2.js. */
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
/* Rounding to 2 decimal places (half away from zero), and draws that sit on or next to a rounding tie. */
const r2 = x => (x < 0 ? -1 : 1) * Math.round(Math.abs(x) * 100 + 1e-9) / 100;
const tie = x => { const f = (Math.abs(x) * 100) % 1; return Math.abs(f - 0.5) < 2e-3; };
/* "= 0.5394" when the 4-decimal text is exact, "≈ 0.6992" when it is not. */
const eq = x => Math.abs(x - Math.round(x * 1e4) / 1e4) < 1e-9 ? '=' : '≈';
/* A number shown with exactly 2 decimals (0.70, −10.79). */
const f2 = x => r2(x).toFixed(2).replace('-', '−');
/* ", which is 0.70 N to 2 decimal places" only when rounding changes the value. */
const rnd = (x, u) => Math.abs(r2(x) - x) < 1e-9 ? '' : `, which is ${f2(x)} ${u} to 2 decimal places`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const pick = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p) && JSON.stringify(p) !== JSON.stringify(canon)) return p; } return { ...canon }; };
/* Angles kπ/6 in radians, as text (index 1–5), and a fraction of π, num·π/den, as text. */
const ang = k => ({ 1: 'π/6', 2: 'π/3', 3: 'π/2', 4: '2π/3', 5: '5π/6' })[k];
const piText = (num, den) => `${num === 1 ? '' : num}π/${den}`;
/* A sum written out: expr([5, −3, 4]) is "5 − 3 + 4". A signed term: sg(−4) is "− 4", sg(4) is "+ 4". */
const expr = xs => xs.map((x, i) => i === 0 ? n(x) : (x < 0 ? ' − ' : ' + ') + n(Math.abs(x))).join('');
const sg = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
const K = 'k = 8.99 × 10⁹ N·m²/C²', EPS = 'ε₀ = 8.85 × 10⁻¹² C²/(N·m²)';
/* Pairs (num, den) of angles num·π/den used for flat-surface fluxes: acute and obtuse, never π/2. */
const ANGS = [[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6]];
const cosOf = (num, den) => Math.cos(num * Math.PI / den);

/* ---- q06 Dipoles: dipole moment and torque in a uniform field [5.7] ---- */

/* Charges ±q nC on a vane d cm long in a field of E kN/C; a indexes the angle aπ/6 in ang(a) (1, 2, 4 or 5, never π/2).
   Largest torque pE at θ = π/2, then pE sin θ. Not the q06 draw (5 nC, 4 cm, 30 kN/C) or its example (3 nC, 5 cm, 20 kN/C). */
const c06b = { q: 6, d: 3, E: 25, a: 2 };
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The weather vane by the panels',
 brief: 'A charged weather vane at the edge of the panel field is twisted by the storm-test coil, and Mira wants to know how hard it can be turned.',
 labels: ['largest torque (μN·m)', 'torque at the given angle (μN·m)'], tolerance: 0.005,
 gl: [['dipole moment (nC·m)'], ['torque at the given angle (μN·m)']]
}, {
 canonical: c06b,
 draw: R => pick(() => ({ q: R.int(2, 9), d: R.int(2, 9), E: 5 * R.int(2, 16), a: R.pick([1, 2, 4, 5]) }),
  p => !tie(p.q * p.d / 100 * p.E * Math.sin(p.a * Math.PI / 6)) && !(p.q === 5 && p.d === 4 && p.E === 30) && !(p.q === 3 && p.d === 5 && p.E === 20), c06b),
 build: ({ q, d, E, a }) => { const p = q * d / 100, s = Math.sin(a * Math.PI / 6), tmax = p * E, tau = tmax * s; return {
  prompt: `A charged weather vane at the edge of the panel field has a charge of +${n(q)} nC at its tip and −${n(q)} nC at its tail, ${n(d)} cm apart (1 nC = 10⁻⁹ C, 1 cm = 0.01 m). A storm-test coil makes a uniform field of ${n(E)} kN/C around it (1 kN/C = 1000 N/C). First enter the largest torque the vane can feel in this field, which is the torque when it is turned side-on, at θ = π/2 radians, in micronewton-metres (μN·m, 10⁻⁶ N·m). Then enter the torque when the angle between the vane’s dipole moment and the field is θ = ${ang(a)} radians, in μN·m, rounded to 2 decimal places.`,
  answer: [r2(tmax), r2(tau)],
  hints: ['The torque on a dipole is τ = pE sin θ, with p = qd (d in metres). It is largest when sin θ is 1.', 'Work out p first in nC·m, changing centimetres to metres. A dipole moment in nC·m times a field in kN/C gives a torque in μN·m. Use the same p for both torques.'],
  solution: `p = qd = ${n(q)} nC × ${n(d / 100)} m = ${n(p)} nC·m. At θ = π/2, sin θ = 1, so the largest torque is pE = ${n(p)} × ${n(E)} = ${n(tmax)} μN·m. At θ = ${ang(a)}, τ = pE sin θ = ${n(tmax)} × sin(${ang(a)}) ${eq(tau)} ${n(tau)} μN·m${rnd(tau, 'μN·m')}.`,
  guidance: [
   { prompt: `What is the dipole moment p = qd, with q = ${n(q)} nC and d = ${n(d)} cm = ${n(d / 100)} m, in nC·m?`, answer: [p], explanation: `${n(q)} × ${n(d / 100)} = ${n(p)} nC·m.` },
   { prompt: `The torque is τ = pE sin θ with θ = ${ang(a)}. What is τ in μN·m, to 2 decimal places?`, answer: [r2(tau)], explanation: `${n(p)} × ${n(E)} = ${n(tmax)}, and ${n(tmax)} × sin(${ang(a)}) ${eq(tau)} ${n(tau)}, so τ is ${f2(tau)} μN·m.` }
  ] }; }
});

/* The torque tau (μN·m) is measured on charges ±q nC, d cm apart, at the angle aπ/6 (a = 1, 3 or 5, so sin θ is 0.5 or 1); the field
   is E = τ ÷ (p sin θ), a multiple of 5 kN/C in every draw. Not the q06 draw (5 nC, 4 cm, 30 kN/C) or its example (3 nC, 5 cm, 20 kN/C). */
const c06c = { q: 7, d: 6, tau: 8.4, a: 5 };
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Reading the field from the swing',
 brief: 'The sensor’s torque was logged during a test but the field setting was lost, and Mira needs the field and the load on each charge.',
 labels: ['dipole moment (nC·m)', 'field strength (kN/C)', 'force on one charge (μN)'], tolerance: 0.005,
 gl: [['dipole moment (nC·m)'], ['field strength (kN/C)'], ['force on one charge (μN)']]
}, {
 canonical: c06c,
 draw: R => pick(() => { const q = R.int(2, 9), d = R.int(2, 9), E = 5 * R.int(2, 16), a = R.pick([1, 3, 5]), s = a === 3 ? 1 : 0.5;
   return { q, d, a, tau: Math.round(q * d / 100 * E * s * 1e4) / 1e4 }; },
  p => { const s = p.a === 3 ? 1 : 0.5, E = Math.round(p.tau / (p.q * p.d / 100 * s)); return !(p.q === 5 && p.d === 4 && E === 30) && !(p.q === 3 && p.d === 5 && E === 20); }, c06c),
 build: ({ q, d, tau, a }) => { const p = q * d / 100, s = a === 3 ? 1 : 0.5, E = Math.round(tau / (p * s) * 1e6) / 1e6, F = Math.round(q * E * 1e6) / 1e6; return {
  prompt: `A dust sensor in the test bay holds +${n(q)} nC and −${n(q)} nC on the ends of a rod ${n(d)} cm long (1 nC = 10⁻⁹ C, 1 cm = 0.01 m). A test coil makes a uniform field around it. With the sensor’s dipole moment at an angle of θ = ${ang(a)} radians to the field, the torque on it is measured as ${n(tau)} μN·m (1 μN·m = 10⁻⁶ N·m). Enter the sensor’s dipole moment in nC·m. Then enter the strength of the field in kN/C (1 kN/C = 1000 N/C). Then enter the size of the force the field puts on one of the two charges, in μN.`,
  answer: [p, E, F],
  hints: ['The torque is τ = pE sin θ, so once p = qd is known (d in metres) the field is E = τ ÷ (p sin θ).', 'The force on one charge is qE. A charge in nC times a field in kN/C gives a force in μN.'],
  solution: `p = qd = ${n(q)} nC × ${n(d / 100)} m = ${n(p)} nC·m. Since τ = pE sin θ and sin(${ang(a)}) = ${n(s)}, E = τ ÷ (p sin θ) = ${n(tau)} ÷ (${n(p)} × ${n(s)}) = ${n(E)} kN/C. The force on one charge is qE = ${n(q)} nC × ${n(E)} kN/C = ${n(F)} μN.`,
  guidance: [
   { prompt: `What is the dipole moment p = qd, with q = ${n(q)} nC and d = ${n(d)} cm = ${n(d / 100)} m, in nC·m?`, answer: [p], explanation: `${n(q)} × ${n(d / 100)} = ${n(p)} nC·m.` },
   { prompt: `Turn τ = pE sin θ round to give E, with sin(${ang(a)}) = ${n(s)}. What is the field in kN/C?`, answer: [E], explanation: `E = ${n(tau)} ÷ (${n(p)} × ${n(s)}) = ${n(tau)} ÷ ${n(p * s)} = ${n(E)} kN/C.` },
   { prompt: `What is the size of the force on one of the charges, qE, in μN?`, answer: [F], explanation: `${n(q)} nC × ${n(E)} kN/C = ${n(q)} × 10⁻⁹ × ${n(E)} × 10³ N = ${n(F)} × 10⁻⁶ N = ${n(F)} μN.` }
  ] }; }
});

/* A point charge Q μC (the ion post) makes the field E = 8.99 Q ÷ r² kN/C at r m; the sensor (±q nC, d cm) turns at angle aπ/6
   (a = 1, 2, 4 or 5). The torque uses the unrounded field, and draws are kept where the rounded field would give the same torque. */
const c06d = { Q: 5, r: 4, q: 7, d: 6, a: 2 };
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q04', title: 'Sensor beside the ion post',
 brief: 'A dust sensor stands in the open beside a charged ion post, and Mira wants to know how hard the post’s field twists it.',
 labels: ['dipole moment (nC·m)', 'field at the sensor (kN/C)', 'torque (μN·m)'], tolerance: 0.005,
 gl: [['dipole moment (nC·m)'], ['field at the sensor (kN/C)'], ['torque (μN·m)']]
}, {
 canonical: c06d,
 draw: R => pick(() => ({ Q: R.int(1, 9), r: R.int(1, 5), q: R.int(2, 9), d: R.int(2, 9), a: R.pick([1, 2, 4, 5]) }),
  p => { const pm = p.q * p.d / 100, E = 8.99 * p.Q / (p.r * p.r), s = Math.sin(p.a * Math.PI / 6), t = pm * E * s;
   return t >= 0.05 && !tie(E) && !tie(t) && r2(pm * r2(E) * s) === r2(t) && !(p.q === 5 && p.d === 4) && !(p.q === 3 && p.d === 5); }, c06d),
 build: ({ Q, r, q, d, a }) => { const p = q * d / 100, E = 8.99 * Q / (r * r), s = Math.sin(a * Math.PI / 6), tau = p * E * s; return {
  prompt: `A charged ion post at the end of a panel row holds a point charge of +${n(Q)} μC (1 μC = 10⁻⁶ C). A dust sensor stands ${n(r)} m from the post. It has charges of +${n(q)} nC and −${n(q)} nC on the ends of a rod ${n(d)} cm long (1 nC = 10⁻⁹ C, 1 cm = 0.01 m). The sensor is so small that the post’s field is the same over all of it, and the angle between the sensor’s dipole moment and that field is θ = ${ang(a)} radians. Use ${K}. Enter the dipole moment in nC·m. Then enter the size of the post’s field at the sensor in kN/C (1 kN/C = 1000 N/C), rounded to 2 decimal places. Then enter the size of the torque on the sensor in μN·m, using the unrounded field and rounding to 2 decimal places.`,
  answer: [p, r2(E), r2(tau)],
  hints: ['The post is a point charge, so its field at distance r has size E = kQ ÷ r². With Q in μC and r in metres, that is 8.99 × Q ÷ r² in kN/C.', 'The torque on the sensor is τ = pE sin θ, with p = qd (d in metres). A dipole moment in nC·m times a field in kN/C gives a torque in μN·m.'],
  solution: `p = qd = ${n(q)} nC × ${n(d / 100)} m = ${n(p)} nC·m. The post’s field has size E = kQ ÷ r² = 8.99 × 10⁹ × ${n(Q)} × 10⁻⁶ ÷ ${n(r)}² N/C. Since 8.99 × 10⁹ × 10⁻⁶ N/C is 8.99 kN/C, E = 8.99 × ${n(Q)} ÷ ${n(r * r)} ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}. Then τ = pE sin θ, with p = ${n(p)} nC·m, the unrounded E and sin(${ang(a)}) ${eq(s)} ${n(s)}: τ ${eq(tau)} ${n(tau)} μN·m${rnd(tau, 'μN·m')}.`,
  guidance: [
   { prompt: `What is the dipole moment p = qd, with q = ${n(q)} nC and d = ${n(d)} cm = ${n(d / 100)} m, in nC·m?`, answer: [p], explanation: `${n(q)} × ${n(d / 100)} = ${n(p)} nC·m.` },
   { prompt: `What is the size of the post’s field at ${n(r)} m, 8.99 × Q ÷ r² with Q = ${n(Q)} μC, in kN/C to 2 decimal places?`, answer: [r2(E)], explanation: `8.99 × ${n(Q)} ÷ ${n(r * r)} ${eq(E)} ${n(E)} kN/C, so ${f2(E)} kN/C.` },
   { prompt: `The torque is τ = pE sin θ with θ = ${ang(a)}. Using the unrounded field, what is τ in μN·m, to 2 decimal places?`, answer: [r2(tau)], explanation: `${n(p)} × ${n(E)}${eq(E) === '≈' ? '…' : ''} × sin(${ang(a)}) ${eq(tau)} ${n(tau)}, so τ is ${f2(tau)} μN·m.` }
  ] }; }
});

/* ---- q07 Electric flux: field through a surface, the surface integral [6.1] ---- */

/* A flat w × h hatch in a uniform field E at angle num·π/den to its normal; then a w2 × h2 window facing a field (a + bx) N/C along
   its width (a and b multiples of 10, so the flux is a whole number). Not the q07 draws (400 N/C on 3 m², 600 N/C on 2 m²). */
const c07b = { E: 300, w: 2, h: 4, num: 1, den: 4, a: 60, b: 20, w2: 4, h2: 2 };
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The roof hatch and the dust window',
 brief: 'Charged dust is drifting past the dome’s roof hatch and a viewing window, and Mira wants the flux through each.',
 labels: ['flux, hatch (N·m²/C)', 'flux, window (N·m²/C)'], tolerance: 0.005,
 gl: [['area of the hatch (m²)'], ['flux, hatch (N·m²/C)'], ['flux, window (N·m²/C)']]
}, {
 canonical: c07b,
 draw: R => pick(() => { const [num, den] = R.pick(ANGS); return { E: 50 * R.int(2, 18), w: R.int(2, 5), h: R.int(2, 4), num, den, a: 10 * R.int(1, 12), b: 10 * R.int(1, 10), w2: R.int(2, 5), h2: R.int(2, 4) }; },
  p => { const A = p.w * p.h; return !tie(p.E * A * cosOf(p.num, p.den)) && !(p.E === 400 && A === 3) && !(p.E === 600 && A === 2); }, c07b),
 build: ({ E, w, h, num, den, a, b, w2, h2 }) => { const A = w * h, cs = cosOf(num, den), F1 = E * A * cs, F2 = h2 * (a * w2 + b * w2 * w2 / 2), at = piText(num, den); return {
  prompt: `A flat rectangular access hatch in the dome roof is ${n(w)} m by ${n(h)} m. The charged-dust field near it is uniform, ${n(E)} N/C, and the angle between the field and the hatch’s normal (the direction straight out of its face) is ${at} radians. Enter the flux through the hatch in N·m²/C, rounded to 2 decimal places and without commas (negative if the field passes in through the back). A viewing window, ${n(w2)} m wide and ${n(h2)} m tall, faces straight into a field along its normal whose strength rises across its width: at distance x metres from its left edge the field is (${n(a)} + ${n(b)}x) N/C. Enter the flux through the window in N·m²/C, without commas.`,
  answer: [r2(F1), F2],
  hints: ['For a uniform field and a flat surface the flux is Φ = EA cos θ, with θ measured from the normal. The area of a rectangle is its width times its height.', 'For the window, cut it into thin strips across its width. A strip of width dx has area (height) dx and flux E(x) × (height) dx, and the surface integral adds them: an ordinary integral of the field across the width, times the height.'],
  solution: `Hatch: its area is ${n(w)} × ${n(h)} = ${n(A)} m², so Φ = EA cos θ = ${n(E)} × ${n(A)} × cos(${at}) = ${n(E * A)} × cos(${at}) ${eq(F1)} ${n(F1)} N·m²/C${rnd(F1, 'N·m²/C')}. Window: a strip at x of width dx has area ${n(h2)} dx and flux (${n(a)} + ${n(b)}x) × ${n(h2)} dx, so Φ = ∫ ${n(h2)}(${n(a)} + ${n(b)}x) dx from 0 to ${n(w2)} = ${n(h2)} × (${n(a)} × ${n(w2)} + ${n(b)} × ${n(w2)}² ÷ 2) = ${n(F2)} N·m²/C.`,
  guidance: [
   { prompt: `What is the area of the hatch, ${n(w)} m by ${n(h)} m, in m²?`, answer: [A], explanation: `${n(w)} × ${n(h)} = ${n(A)} m².` },
   { prompt: `Multiply EA by cos(${at}) (use the unrounded cosine). What is the flux through the hatch, in N·m²/C to 2 decimal places?`, answer: [r2(F1)], explanation: `${n(E)} × ${n(A)} = ${n(E * A)}, and ${n(E * A)} × cos(${at}) ${eq(F1)} ${n(F1)} N·m²/C.` },
   { prompt: `For the window, add up the strips: what is ∫ ${n(h2)}(${n(a)} + ${n(b)}x) dx from x = 0 to x = ${n(w2)}, in N·m²/C?`, answer: [F2], explanation: `An antiderivative of ${n(h2)}(${n(a)} + ${n(b)}x) is ${n(h2 * a)}x + ${n(h2 * b / 2)}x², which at x = ${n(w2)} is ${n(h2 * a * w2)} + ${n(h2 * b / 2 * w2 * w2)} = ${n(F2)}.` }
  ] }; }
});

/* Two flat roof panels in one uniform field E: areas A1 and A2, with normals at n1π/d1 and n2π/d2 to the field; the net flux is the signed sum.
   Draws keep the sum of the two rounded fluxes equal to the rounded sum. Not the q07 draws (400 N/C, 3 m²; 600 N/C, 2 m²). */
const c07c = { E: 350, A1: 6, A2: 4, n1: 1, d1: 4, n2: 2, d2: 3 };
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The folded charging-bay roof',
 brief: 'The charging bay has a roof of two panels folded at a ridge, and Mira needs the total flux the roof catches from the charge cloud above.',
 labels: ['flux, left panel (N·m²/C)', 'flux, right panel (N·m²/C)', 'net flux, whole roof (N·m²/C)'], tolerance: 0.005,
 gl: [['flux, left panel (N·m²/C)'], ['flux, right panel (N·m²/C)'], ['net flux, whole roof (N·m²/C)']]
}, {
 canonical: c07c,
 draw: R => pick(() => { const [n1, d1] = R.pick(ANGS.slice(0, 3)), [n2, d2] = R.pick(ANGS.slice(2)); return { E: 50 * R.int(2, 18), A1: R.int(2, 12), A2: R.int(2, 12), n1, d1, n2, d2 }; },
  p => { const g1 = p.E * p.A1 * cosOf(p.n1, p.d1), g2 = p.E * p.A2 * cosOf(p.n2, p.d2); return !tie(g1) && !tie(g2) && !tie(g1 + g2) && Math.abs(r2(g1) + r2(g2) - r2(g1 + g2)) < 1e-9 && !(p.E === 400 && p.A1 === 3) && !(p.E === 600 && p.A1 === 2); }, c07c),
 build: ({ E, A1, A2, n1, d1, n2, d2 }) => { const g1 = E * A1 * cosOf(n1, d1), g2 = E * A2 * cosOf(n2, d2), tot = g1 + g2, t1 = piText(n1, d1), t2 = piText(n2, d2); return {
  prompt: `A folded shade roof over the charging bay is made of two flat panels that meet at a ridge. The charge cloud overhead makes a uniform field of ${n(E)} N/C over the whole roof. The left panel has area ${n(A1)} m², and the angle between the field and its normal (the direction straight out of its upper face) is ${t1} radians. The right panel has area ${n(A2)} m², and its normal is ${t2} radians from the field. Enter the flux through the left panel, then through the right panel, then the net flux through the whole roof (the sum of the two, signs included), each in N·m²/C rounded to 2 decimal places and without commas (a flux is negative if the field passes in through the back of the panel).`,
  answer: [r2(g1), r2(g2), r2(tot)],
  hints: ['Each panel has its own flux Φ = EA cos θ, with θ the angle between the field and that panel’s own normal.', 'The flux through the roof is the sum of the two panel fluxes, each with its own sign: when a normal is more than π/2 from the field, the field enters through that panel’s upper face and its flux is negative.'],
  solution: `Left panel: Φ = EA cos θ = ${n(E)} × ${n(A1)} × cos(${t1}) = ${n(E * A1)} × cos(${t1}) ${eq(g1)} ${n(g1)} N·m²/C${rnd(g1, 'N·m²/C')}. Right panel: Φ = ${n(E)} × ${n(A2)} × cos(${t2}) = ${n(E * A2)} × cos(${t2}) ${eq(g2)} ${n(g2)} N·m²/C${rnd(g2, 'N·m²/C')}. The net flux through the roof is the sum of the two unrounded fluxes: ${n(g1)} ${sg(g2)} ${eq(tot)} ${n(tot)} N·m²/C${rnd(tot, 'N·m²/C')}.`,
  guidance: [
   { prompt: `What is the flux through the left panel, EA cos θ with E = ${n(E)} N/C, A = ${n(A1)} m² and θ = ${t1}, in N·m²/C to 2 decimal places?`, answer: [r2(g1)], explanation: `${n(E)} × ${n(A1)} = ${n(E * A1)}, and ${n(E * A1)} × cos(${t1}) ${eq(g1)} ${n(g1)} N·m²/C.` },
   { prompt: `What is the flux through the right panel, with A = ${n(A2)} m² and θ = ${t2}, in N·m²/C to 2 decimal places?`, answer: [r2(g2)], explanation: `${n(E)} × ${n(A2)} = ${n(E * A2)}, and ${n(E * A2)} × cos(${t2}) ${eq(g2)} ${n(g2)} N·m²/C${cosOf(n2, d2) < 0 ? ', negative because the field enters through this panel’s upper face' : ''}.` },
   { prompt: `Add the two fluxes, signs included. What is the net flux through the whole roof, in N·m²/C to 2 decimal places?`, answer: [r2(tot)], explanation: `${n(g1)} ${sg(g2)} ${eq(tot)} ${n(tot)}, so the net flux is ${f2(tot)} N·m²/C.` }
  ] }; }
});

/* A point charge Q μC makes E = 8.99 Q ÷ r² kN/C at r m (q04); a w × h panel there has its normal at num·π/den to that field, so
   Φ = E w h cos θ in kN·m²/C. The flux uses the unrounded field; draws keep the rounded field giving the same flux. */
const c07d = { Q: 6, r: 3, w: 3, h: 2, num: 2, den: 3 };
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q04', title: 'The panel beside the charged post',
 brief: 'A test panel stands near a charged post in the dome yard, and Mira wants the flux through it worked out from the post’s own charge.',
 labels: ['field at the panel (kN/C)', 'flux through the panel (kN·m²/C)'], tolerance: 0.005,
 gl: [['field at the panel (kN/C)'], ['area of the panel (m²)'], ['flux through the panel (kN·m²/C)']]
}, {
 canonical: c07d,
 draw: R => pick(() => { const [num, den] = R.pick(ANGS); return { Q: R.int(1, 9), r: R.int(1, 5), w: R.int(2, 4), h: R.int(2, 5), num, den }; },
  p => { const E = 8.99 * p.Q / (p.r * p.r), A = p.w * p.h, F = E * A * cosOf(p.num, p.den); return Math.abs(F) >= 0.05 && !tie(E) && !tie(F) && r2(A * cosOf(p.num, p.den) * r2(E)) === r2(F); }, c07d),
 build: ({ Q, r, w, h, num, den }) => { const E = 8.99 * Q / (r * r), A = w * h, cs = cosOf(num, den), F = E * A * cs, at = piText(num, den); return {
  prompt: `A charged post in the dome yard holds a point charge of +${n(Q)} μC (1 μC = 10⁻⁶ C). A flat rectangular test panel, ${n(w)} m by ${n(h)} m, stands ${n(r)} m from the post. The panel is small next to that distance, so treat the post’s field as having the same size and direction over all of it; the angle between that field and the panel’s normal is ${at} radians. Use ${K}. Enter the size of the post’s field at the panel in kN/C (1 kN/C = 1000 N/C), rounded to 2 decimal places. Then enter the flux through the panel in kN·m²/C, using the unrounded field, rounding to 2 decimal places and without commas (negative if the field passes in through the back).`,
  answer: [r2(E), r2(F)],
  hints: ['The post is a point charge, so its field at distance r has size E = kQ ÷ r². With Q in μC and r in metres, that is 8.99 × Q ÷ r² in kN/C.', 'For a flat panel in a uniform field the flux is Φ = EA cos θ, with θ measured from the normal. A field in kN/C times an area in m² gives a flux in kN·m²/C.'],
  solution: `The post’s field has size E = kQ ÷ r² = 8.99 × 10⁹ × ${n(Q)} × 10⁻⁶ ÷ ${n(r)}² N/C. Since 8.99 × 10⁹ × 10⁻⁶ N/C is 8.99 kN/C, E = 8.99 × ${n(Q)} ÷ ${n(r * r)} ${eq(E)} ${n(E)} kN/C${rnd(E, 'kN/C')}. The panel’s area is ${n(w)} × ${n(h)} = ${n(A)} m², so with the unrounded field Φ = EA cos θ = E × ${n(A)} × cos(${at}) ${eq(F)} ${n(F)} kN·m²/C${rnd(F, 'kN·m²/C')}.`,
  guidance: [
   { prompt: `What is the size of the post’s field at ${n(r)} m, 8.99 × Q ÷ r² with Q = ${n(Q)} μC, in kN/C to 2 decimal places?`, answer: [r2(E)], explanation: `8.99 × ${n(Q)} ÷ ${n(r * r)} ${eq(E)} ${n(E)} kN/C, so ${f2(E)} kN/C.` },
   { prompt: `What is the area of the panel, ${n(w)} m by ${n(h)} m, in m²?`, answer: [A], explanation: `${n(w)} × ${n(h)} = ${n(A)} m².` },
   { prompt: `Multiply: Φ = EA cos θ with the unrounded field, A = ${n(A)} m² and θ = ${at}. What is the flux in kN·m²/C, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(E)}${eq(E) === '≈' ? '…' : ''} × ${n(A)} × cos(${at}) ${eq(F)} ${n(F)}, so the flux is ${f2(F)} kN·m²/C.` }
  ] }; }
});

/* ---- q08 Gauss's law: flux out of a closed surface and enclosed charge [6.2] ---- */

/* First surface: a known charge q1 nC and an unknown one inside, net flux 200m N·m²/C, so the enclosed charge is exactly 1.77m nC.
   Second surface: three charges inside (i1, i2, i3 nC, never summing to 0) and one (o nC) outside; flux to the nearest whole number.
   Not the q08 draw (4 nC and −1 nC, flux 1000) or its example (7 nC and −2 nC, flux 400). */
const c08b = { q1: 3, m: 7, i1: 5, i2: -3, i3: 4, o: 6 };
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The sealed crate and the battery locker',
 brief: 'Two sealed units in the storage bay each sit inside a test surface, and Mira wants the crate’s hidden charge and the locker’s flux.',
 labels: ['unknown charge (nC)', 'flux out of the locker surface (N·m²/C)'], tolerance: 0.005,
 gl: [['charge inside the crate surface (nC)'], ['unknown charge (nC)'], ['flux out of the locker surface (N·m²/C)']]
}, {
 canonical: c08b,
 draw: R => pick(() => ({ q1: R.nz(-9, 9), m: R.nz(-12, 12), i1: R.nz(-9, 9), i2: R.nz(-9, 9), i3: R.nz(-9, 9), o: R.nz(-9, 9) }),
  p => { const S = p.i1 + p.i2 + p.i3, F = S * 1000 / 8.85, f = Math.abs(F) % 1; return S !== 0 && Math.abs(f - 0.5) > 2e-3 && p.m !== 2 && p.m !== 5 && Math.abs(Math.round(177 * p.m) / 100 - p.q1) > 1e-9; }, c08b),
 build: ({ q1, m, i1, i2, i3, o }) => { const P = 200 * m, X = Math.round(177 * m) / 100, U = Math.round((X - q1) * 100) / 100, S = i1 + i2 + i3, F = S * 1000 / 8.85, Fr = Math.round(F); return {
  prompt: `Two closed test surfaces are checked in the storage bay (1 nC = 10⁻⁹ C). Use ${EPS}. The first wraps a sealed instrument crate that holds a charge of ${n(q1)} nC and one more charge whose size and sign are not known; the net electric flux out of this surface is ${n(P)} N·m²/C. Enter the unknown charge in nC, to 2 decimal places. The second surface wraps the battery locker, which holds charges of ${n(i1)} nC, ${n(i2)} nC and ${n(i3)} nC, while a charge of ${n(o)} nC stands just outside it. Enter the net electric flux out of the second surface in N·m²/C, rounded to the nearest whole number and without commas (negative if more flux goes in than out).`,
  answer: [U, Fr],
  hints: ['Run Gauss’s law backwards for the crate: the net charge enclosed is ε₀ times the net flux. That total is the known charge plus the unknown one.', 'For the locker, add only the charges inside the surface, with their signs, then divide by ε₀. A charge outside sends as much flux in as out, so it adds nothing.'],
  solution: `Crate: the enclosed charge is q_enc = ε₀Φ = 8.85 × 10⁻¹² × ${par(P)} = ${n(X)} × 10⁻⁹ C = ${n(X)} nC. The known charge is ${n(q1)} nC, so the unknown charge is ${n(X)} − ${par(q1)} = ${n(U)} nC. Locker: only the charges inside count, q_enc = ${expr([i1, i2, i3])} = ${n(S)} nC; the ${n(o)} nC outside adds no net flux. Φ = ${n(S)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)} N·m²/C, which is ${n(Fr)} to the nearest whole number.`,
  guidance: [
   { prompt: `Multiply the crate’s flux by ε₀: what is the total charge inside the crate’s surface, in nC?`, answer: [X], explanation: `8.85 × 10⁻¹² × ${par(P)} = ${n(X)} × 10⁻⁹ C, which is ${n(X)} nC.` },
   { prompt: `That total is the known ${n(q1)} nC plus the unknown charge. What is the unknown charge, in nC?`, answer: [U], explanation: `${n(X)} − ${par(q1)} = ${n(U)} nC.` },
   { prompt: `For the locker, add the charges inside and divide by ε₀. What is the net flux out, in N·m²/C to the nearest whole number?`, answer: [Fr], explanation: `${expr([i1, i2, i3])} = ${n(S)} nC, and ${n(S)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)}, which rounds to ${n(Fr)}.` }
  ] }; }
});

/* A closed surface reads flux 200m N·m²/C (enclosed charge exactly 1.77m nC); a charge of cm nC (signed) is then carried through the
   wall: into the surface when into = 1, out of it when into = 0 (a 1/0 flag, not a count). Not the q08 draws (flux 1000, flux 400). */
const c08c = { m: 6, cm: -4, into: 0 };
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Moving charge through the vault wall',
 brief: 'A crew is shifting charged units through the vault wall, and Mira wants the flux meter’s reading before and after.',
 labels: ['charge inside before (nC)', 'charge inside after (nC)', 'flux out after (N·m²/C)'], tolerance: 0.005,
 gl: [['charge inside before (nC)'], ['charge inside after (nC)'], ['flux out after (N·m²/C)']]
}, {
 canonical: c08c,
 draw: R => pick(() => ({ m: R.nz(-12, 12), cm: R.nz(-9, 9), into: R.int(0, 1) }),
  p => { const Y = Math.round(177 * p.m) / 100 + (p.into ? p.cm : -p.cm), F = Y * 1000 / 8.85, f = Math.abs(F) % 1; return Math.abs(Y) > 1e-9 && Math.abs(Math.round(F)) >= 1 && Math.abs(f - 0.5) > 2e-3 && p.m !== 2 && p.m !== 5; }, c08c),
 build: ({ m, cm, into }) => { const P = 200 * m, X = Math.round(177 * m) / 100, dq = into ? cm : -cm, Y = Math.round((X + dq) * 100) / 100, F = Y * 1000 / 8.85, Fr = Math.round(F); return {
  prompt: `The flux meter on a closed test surface around the vault’s storage bank reads a net outward flux of ${n(P)} N·m²/C (1 nC = 10⁻⁹ C). Use ${EPS}. A crew then carries a charge of ${n(cm)} nC ${into ? 'through the wall from outside the surface to inside it' : 'from inside the surface to outside it'}; nothing else changes. Enter the net charge inside the surface before the move, then the net charge inside it after the move, both in nC to 2 decimal places. Then enter the net flux out of the surface after the move in N·m²/C, rounded to the nearest whole number and without commas (negative if more flux goes in than out).`,
  answer: [X, Y, Fr],
  hints: ['Run Gauss’s law backwards for the reading: the net charge inside is ε₀ times the net flux.', 'A charge carried in adds to the net charge inside; a charge carried out takes its own sign away from it. Then divide the new net charge by ε₀ for the new flux.'],
  solution: `Before the move: q_enc = ε₀Φ = 8.85 × 10⁻¹² × ${par(P)} = ${n(X)} × 10⁻⁹ C = ${n(X)} nC. Carrying ${n(cm)} nC ${into ? 'in' : 'out'} changes the net charge inside by ${n(dq)} nC, so afterwards q_enc = ${n(X)} ${sg(dq)} = ${n(Y)} nC. Then Φ = ${n(Y)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)} N·m²/C, which is ${n(Fr)} to the nearest whole number.`,
  guidance: [
   { prompt: `Multiply the reading by ε₀: what is the net charge inside the surface before the move, in nC?`, answer: [X], explanation: `8.85 × 10⁻¹² × ${par(P)} = ${n(X)} × 10⁻⁹ C, which is ${n(X)} nC.` },
   { prompt: `The crew carries ${n(cm)} nC ${into ? 'in' : 'out'}. What is the net charge inside afterwards, in nC?`, answer: [Y], explanation: `The net charge inside changes by ${n(dq)} nC: ${n(X)} ${sg(dq)} = ${n(Y)} nC.` },
   { prompt: `Divide by ε₀: what is the net flux out of the surface after the move, in N·m²/C to the nearest whole number?`, answer: [Fr], explanation: `${n(Y)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ${eq(F)} ${n(F)}, which rounds to ${n(Fr)}.` }
  ] }; }
});

/* A sealed duct (a closed surface) with end faces of area A m²; the field runs along its axis: E1 N/C into it at the entry end,
   E2 N/C out of it at the exit end, none through the side walls (q07 flux, then Gauss's law). E1 and E2 differ. */
const c08d = { A: 8, E1: 240, E2: 310 };
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q07', title: 'Charge hidden in the duct',
 brief: 'A sealed cable duct has a field running through it that grows along its length, and Mira wants to know what charge it is hiding.',
 labels: ['net flux out (N·m²/C)', 'charge inside (nC)'], tolerance: 0.005,
 gl: [['flux through the entry end (N·m²/C)'], ['flux through the exit end (N·m²/C)'], ['charge inside (nC)']]
}, {
 canonical: c08d,
 draw: R => pick(() => ({ A: R.int(2, 12), E1: 10 * R.int(5, 60), E2: 10 * R.int(5, 60) }),
  p => { const net = (p.E2 - p.E1) * p.A, Q = net * 0.00885; return p.E1 !== p.E2 && !tie(Q) && Math.abs(Q) >= 0.05 && !(p.E1 === 400 && p.A === 3); }, c08d),
 build: ({ A, E1, E2 }) => { const F1 = -E1 * A, F2 = E2 * A, net = F1 + F2, Q = net * 0.00885; return {
  prompt: `A closed test surface is a short sealed cable duct with a flat end on each side, each end of area ${n(A)} m². The electric field points along the duct’s axis, so it runs parallel to the side walls and there is no flux through them. It points into the surface through the entry end, where its strength is ${n(E1)} N/C and the same all across the end. It points out of the surface through the exit end, where its strength is ${n(E2)} N/C, also the same all across the end. Use ${EPS}. Enter the net electric flux out of the whole surface in N·m²/C (negative if more goes in than out, without commas). Then enter the net charge inside the duct in nC (1 nC = 10⁻⁹ C), to 2 decimal places.`,
  answer: [net, r2(Q)],
  hints: ['Flux out of a closed surface counts the outward normal as positive: a field entering through an end gives a negative flux there, a field leaving gives a positive one. Each end’s flux is its field times its area, since the field is along the normal.', 'The side walls add nothing. Add the two end fluxes for the net flux, then use Gauss’s law backwards: the net charge inside is ε₀ times the net flux.'],
  solution: `At the entry end the field points against the outward normal, so Φ = −EA = −${n(E1)} × ${n(A)} = ${n(F1)} N·m²/C. At the exit end Φ = +EA = ${n(E2)} × ${n(A)} = ${n(F2)} N·m²/C. The side walls add nothing, so the net flux out is ${n(F1)} ${sg(F2)} = ${n(net)} N·m²/C. By Gauss’s law q_enc = ε₀Φ = 8.85 × 10⁻¹² × ${par(net)} × 10⁹ nC ${eq(Q)} ${n(Q)} nC${rnd(Q, 'nC')}.`,
  guidance: [
   { prompt: `What is the flux through the entry end, where the field points into the surface (strength ${n(E1)} N/C, area ${n(A)} m²), in N·m²/C? Give it its sign.`, answer: [F1], explanation: `The field points against the outward normal, so Φ = −${n(E1)} × ${n(A)} = ${n(F1)} N·m²/C.` },
   { prompt: `What is the flux through the exit end, where the field points out of the surface (strength ${n(E2)} N/C), in N·m²/C?`, answer: [F2], explanation: `The field points along the outward normal, so Φ = ${n(E2)} × ${n(A)} = ${n(F2)} N·m²/C.` },
   { prompt: `The net flux is ${n(net)} N·m²/C. Multiply by ε₀: what is the net charge inside the duct, in nC to 2 decimal places?`, answer: [r2(Q)], explanation: `8.85 × 10⁻¹² × ${par(net)} × 10⁹ ${eq(Q)} ${n(Q)} nC, so ${f2(Q)} nC.` }
  ] }; }
});

/* ---- q09 Gauss's law for a sphere: inside and outside a charged shell [6.3] ---- */

/* A thin shell of radius Rs m carrying Qs nC, with a point charge Qc nC at its centre; the radial field at r1 < Rs (only Qc inside) and
   at rr > Rs (both inside), outward positive. Not the q09 draw (shells of 20 nC and −50 nC) or its example (30 nC and 10 nC). */
const c09b = { Qc: 15, Rs: 3, Qs: -40, r1: 2, rr: 6 };
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The collector dome with a core',
 brief: 'A charged probe sits at the centre of a spherical dust-collector shell, and Mira wants the field inside the shell and out on the walkway.',
 labels: ['field inside the shell (N/C)', 'field outside the shell (N/C)'], tolerance: 0.005,
 gl: [['charge enclosed inside the shell (nC)'], ['field inside the shell (N/C)'], ['charge enclosed outside the shell (nC)'], ['field outside the shell (N/C)']]
}, {
 canonical: c09b,
 draw: R => pick(() => { const Rs = R.int(2, 4); return { Qc: R.nz(-60, 60), Rs, Qs: R.nz(-90, 90), r1: R.int(1, Rs - 1), rr: R.int(Rs + 1, Rs + 4) }; },
  p => { const s = p.Qc + p.Qs, E1 = 8.99 * p.Qc / (p.r1 * p.r1), E2 = 8.99 * s / (p.rr * p.rr); return s !== 0 && Math.abs(E2) >= 0.05 && !tie(E1) && !tie(E2) && !(p.Qc === 20 && p.Qs === -50) && !(p.Qc === 30 && p.Qs === 10); }, c09b),
 build: ({ Qc, Rs, Qs, r1, rr }) => { const s = Qc + Qs, E1 = 8.99 * Qc / (r1 * r1), E2 = 8.99 * s / (rr * rr); return {
  prompt: `A thin spherical dust-collector shell of radius ${n(Rs)} m carries ${n(Qs)} nC spread evenly over it (1 nC = 10⁻⁹ C). A small charged probe of ${n(Qc)} nC sits at its exact centre. Use ${K}. Enter the radial component of the electric field ${n(r1)} m from the centre, then ${n(rr)} m from the centre, both in N/C rounded to 2 decimal places: positive if the field points outwards, negative if inwards.`,
  answer: [r2(E1), r2(E2)],
  hints: ['Draw a Gaussian sphere through the point, with the same centre as the shell. By symmetry E = kq_enc ÷ r² along the radius, with only the charge inside the Gaussian sphere counted.', 'A thin shell adds nothing to the field at points inside it, because a Gaussian sphere there does not enclose the shell. At points outside it the shell’s charge counts like any other charge inside.'],
  solution: `At ${n(r1)} m the Gaussian sphere lies inside the shell (${n(Rs)} m), so it encloses only the probe, ${n(Qc)} nC: E = kq_enc ÷ r² = 8.99 × 10⁹ × ${par(Qc)} × 10⁻⁹ ÷ ${n(r1)}² ${eq(E1)} ${n(E1)} N/C${rnd(E1, 'N/C')}. At ${n(rr)} m it encloses the probe and the shell, ${n(Qc)} ${sg(Qs)} = ${n(s)} nC, so E = 8.99 × ${par(s)} ÷ ${n(rr * rr)} ${eq(E2)} ${n(E2)} N/C${rnd(E2, 'N/C')}.`,
  guidance: [
   { prompt: `A Gaussian sphere of radius ${n(r1)} m: how much charge does it enclose, in nC?`, answer: [Qc], explanation: `It lies inside the shell (${n(Rs)} m), so the shell is outside it and only the probe’s ${n(Qc)} nC is enclosed.` },
   { prompt: `What is the radial field at ${n(r1)} m, kq_enc ÷ r², in N/C to 2 decimal places?`, answer: [r2(E1)], explanation: `8.99 × ${par(Qc)} ÷ ${n(r1 * r1)} ${eq(E1)} ${n(E1)} N/C.` },
   { prompt: `A Gaussian sphere of radius ${n(rr)} m encloses the probe and the shell. What charge does it enclose, in nC?`, answer: [s], explanation: `${n(Qc)} ${sg(Qs)} = ${n(s)} nC.` },
   { prompt: `What is the radial field at ${n(rr)} m, in N/C to 2 decimal places?`, answer: [r2(E2)], explanation: `8.99 × ${par(s)} ÷ ${n(rr * rr)} ${eq(E2)} ${n(E2)} N/C.` }
  ] }; }
});

/* A shell of radius R m holds an unknown net charge Q = j·r1² nC (a whole number). A probe at r1 > R reads E1 = 8.99j N/C, so the
   charge is E1·r1² ÷ 8.99. Then the field at rr > r1, and again after a point charge qa nC is put at the centre. */
const c09c = { E1: -26.97, R: 2, r1: 3, rr: 5, qa: 20 };
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'Reading the shell from outside',
 brief: 'Nobody logged the charge on the ion-trap shell, but a probe outside it gives a reading, and Mira wants the charge and what a new core charge would do.',
 labels: ['charge on the shell (nC)', 'field at the second distance (N/C)', 'field after the core charge is added (N/C)'], tolerance: 0.005,
 gl: [['charge on the shell (nC)'], ['field at the second distance (N/C)'], ['field after the core charge is added (N/C)']]
}, {
 canonical: c09c,
 draw: R => pick(() => { const Rr = R.int(1, 3), r1 = R.int(Rr + 1, Rr + 3), rr = R.int(r1 + 1, r1 + 4); return { E1: Math.round(899 * R.nz(-6, 6)) / 100, R: Rr, r1, rr, qa: R.nz(-80, 80) }; },
  p => { const Q = Math.round(p.E1 * p.r1 * p.r1 / 8.99), E2 = 8.99 * Q / (p.rr * p.rr), En = 8.99 * (Q + p.qa) / (p.rr * p.rr); return Q + p.qa !== 0 && Math.abs(Q) < 400 && Math.abs(En) >= 0.05 && !tie(E2) && !tie(En) && !(p.R === 1 && p.r1 === 2 && p.rr === 4); }, c09c),
 build: ({ E1, R, r1, rr, qa }) => { const Q = Math.round(E1 * r1 * r1 / 8.99), E2 = 8.99 * Q / (rr * rr), T = Q + qa, En = 8.99 * T / (rr * rr); return {
  prompt: `A thin spherical shell of radius ${n(R)} m, part of the ion trap, carries a net charge spread evenly over it that nobody has logged (1 nC = 10⁻⁹ C). A probe ${n(r1)} m from its centre reads a radial field of ${n(E1)} N/C (negative means the field points inwards). Use ${K}. Enter the net charge on the shell in nC, a whole number. Then enter the radial field ${n(rr)} m from the centre, in N/C to 2 decimal places. Then a crew places a point charge of ${n(qa)} nC at the centre of the shell, inside it. Enter the new radial field ${n(rr)} m from the centre, in N/C to 2 decimal places.`,
  answer: [Q, r2(E2), r2(En)],
  hints: ['A Gaussian sphere through the probe, outside the shell, encloses all of the shell’s charge, so E = kq ÷ r². Turn that round to find the charge: q = E r² ÷ k, with the sign of the field.', 'The point charge at the centre lies inside every Gaussian sphere larger than the shell, so the charges inside add: the new q_enc is the shell’s charge plus the point charge.'],
  solution: `A Gaussian sphere through the probe encloses the whole shell, so E = kq ÷ r² and q = E r² ÷ k = ${par(E1)} × ${n(r1 * r1)} ÷ 8.99 = ${n(Q)} nC (since 8.99 × 10⁹ × 10⁻⁹ = 8.99). At ${n(rr)} m the field is 8.99 × ${par(Q)} ÷ ${n(rr * rr)} ${eq(E2)} ${n(E2)} N/C${rnd(E2, 'N/C')}. With the point charge added, q_enc = ${n(Q)} ${sg(qa)} = ${n(T)} nC, so E = 8.99 × ${par(T)} ÷ ${n(rr * rr)} ${eq(En)} ${n(En)} N/C${rnd(En, 'N/C')}.`,
  guidance: [
   { prompt: `Turn E = kq ÷ r² round: q = E r² ÷ k, with E = ${n(E1)} N/C and r = ${n(r1)} m. What is the shell’s charge, in nC?`, answer: [Q], explanation: `${par(E1)} × ${n(r1 * r1)} ÷ 8.99 = ${n(Q)} nC.` },
   { prompt: `What is the radial field ${n(rr)} m from the centre, 8.99 × q ÷ r², in N/C to 2 decimal places?`, answer: [r2(E2)], explanation: `8.99 × ${par(Q)} ÷ ${n(rr * rr)} ${eq(E2)} ${n(E2)} N/C.` },
   { prompt: `After the ${n(qa)} nC point charge is added at the centre, what is the radial field ${n(rr)} m from the centre, in N/C to 2 decimal places?`, answer: [r2(En)], explanation: `q_enc = ${n(Q)} ${sg(qa)} = ${n(T)} nC, and 8.99 × ${par(T)} ÷ ${n(rr * rr)} ${eq(En)} ${n(En)} N/C.` }
  ] }; }
});

/* Three thin concentric shells (radii R1 < R2 < R3 m, charges Q1, Q2, Q3 nC). The radial field at ra (between the 2nd and 3rd) and at rb
   (outside all three), and the radial force on a test charge of qt nC at rb, in nN (nC × N/C); the force uses the unrounded field. */
const c09d = { R1: 1, R2: 2, R3: 4, Q1: 30, Q2: -20, Q3: 45, ra: 3, rb: 6, qt: -3 };
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q04', title: 'Three shells and a test grain',
 brief: 'The Shield Dome has been given a third shell, and Mira wants the field in the new gap, the field outside, and the push on a test grain out there.',
 labels: ['field between the 2nd and 3rd shells (N/C)', 'field outside all three (N/C)', 'force on the test charge (nN)'], tolerance: 0.005,
 gl: [['field between the 2nd and 3rd shells (N/C)'], ['field outside all three (N/C)'], ['force on the test charge (nN)']]
}, {
 canonical: c09d,
 draw: R => pick(() => { const R1 = R.int(1, 2), R2 = R1 + R.int(1, 2), R3 = R2 + R.int(2, 3); return { R1, R2, R3, Q1: R.nz(-60, 60), Q2: R.nz(-60, 60), Q3: R.nz(-60, 60), ra: R.int(R2 + 1, R3 - 1), rb: R.int(R3 + 1, R3 + 4), qt: R.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]) }; },
  p => { const Ea = 8.99 * (p.Q1 + p.Q2) / (p.ra * p.ra), S = p.Q1 + p.Q2 + p.Q3, Eb = 8.99 * S / (p.rb * p.rb), F = p.qt * Eb; return p.Q1 + p.Q2 !== 0 && S !== 0 && Math.abs(Eb) >= 0.05 && !tie(Ea) && !tie(Eb) && !tie(F) && r2(p.qt * r2(Eb)) === r2(F); }, c09d),
 build: ({ R1, R2, R3, Q1, Q2, Q3, ra, rb, qt }) => { const s2 = Q1 + Q2, s3 = Q1 + Q2 + Q3, Ea = 8.99 * s2 / (ra * ra), Eb = 8.99 * s3 / (rb * rb), F = qt * Eb; return {
  prompt: `The Shield Dome now has three thin spherical shells with the same centre. The first has radius ${n(R1)} m and carries ${n(Q1)} nC, the second has radius ${n(R2)} m and carries ${n(Q2)} nC, and the third has radius ${n(R3)} m and carries ${n(Q3)} nC, each spread evenly (1 nC = 10⁻⁹ C). Use ${K}. Enter the radial component of the electric field ${n(ra)} m from the centre, then ${n(rb)} m from the centre, both in N/C rounded to 2 decimal places: positive if the field points outwards, negative if inwards. Then a test grain with charge ${n(qt)} nC is placed ${n(rb)} m from the centre. Enter the radial component of the force on it in nanonewtons (nN, 10⁻⁹ N), using the unrounded field and rounding to 2 decimal places: positive if the force points outwards.`,
  answer: [r2(Ea), r2(Eb), r2(F)],
  hints: ['For each point, take a Gaussian sphere through it with the same centre and add only the charges of the shells that lie inside that sphere: E = kq_enc ÷ r².', 'A charge Q placed in a field E feels F = QE. A charge in nC times a field in N/C gives a force in nN, and a negative charge is pushed against the field.'],
  solution: `At ${n(ra)} m the Gaussian sphere encloses the first two shells, ${n(Q1)} ${sg(Q2)} = ${n(s2)} nC, so E = 8.99 × ${par(s2)} ÷ ${n(ra * ra)} ${eq(Ea)} ${n(Ea)} N/C${rnd(Ea, 'N/C')}. At ${n(rb)} m it encloses all three, ${n(Q1)} ${sg(Q2)} ${sg(Q3)} = ${n(s3)} nC, so E = 8.99 × ${par(s3)} ÷ ${n(rb * rb)} ${eq(Eb)} ${n(Eb)} N/C${rnd(Eb, 'N/C')}. The force on the test grain is F = QE = ${par(qt)} nC × (the unrounded field) ${eq(F)} ${n(F)} nN${rnd(F, 'nN')}.`,
  guidance: [
   { prompt: `A Gaussian sphere of radius ${n(ra)} m encloses the first two shells. What is the radial field there, 8.99 × q_enc ÷ r², in N/C to 2 decimal places?`, answer: [r2(Ea)], explanation: `q_enc = ${n(Q1)} ${sg(Q2)} = ${n(s2)} nC, and 8.99 × ${par(s2)} ÷ ${n(ra * ra)} ${eq(Ea)} ${n(Ea)} N/C.` },
   { prompt: `A Gaussian sphere of radius ${n(rb)} m encloses all three shells. What is the radial field there, in N/C to 2 decimal places?`, answer: [r2(Eb)], explanation: `q_enc = ${n(Q1)} ${sg(Q2)} ${sg(Q3)} = ${n(s3)} nC, and 8.99 × ${par(s3)} ÷ ${n(rb * rb)} ${eq(Eb)} ${n(Eb)} N/C.` },
   { prompt: `Multiply the unrounded field at ${n(rb)} m by the test charge ${n(qt)} nC: F = QE. What is the radial force in nN, to 2 decimal places?`, answer: [r2(F)], explanation: `${par(qt)} × ${n(Eb)}${eq(Eb) === '≈' ? '…' : ''} ${eq(F)} ${n(F)}, so the force is ${f2(F)} nN.` }
  ] }; }
});

/* ---- q10 Gauss's law for a long line and a flat sheet [6.3] ---- */

/* A guy wire with λ nC/m, field at d cm: λ ÷ (2πε₀r) in kN/C (draws where 2k and 1 ÷ (2πε₀) agree to 2 decimals); then a sheet whose field
   is Es kN/C (one decimal) has σ = 2ε₀E = 17.7 Es nC/m², exact to 2 decimals. Not the q10 draw (40 nC/m at 20 cm; 120 nC/m²) or its example. */
const c10b = { lam: 25, d: 35, Es: 4.2 };
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The guy wire and the shutter',
 brief: 'A charged guy wire runs beside the dome and a charged shutter panel hangs near it, and Mira wants the wire’s field and the shutter’s charge.',
 labels: ['field of the wire (kN/C)', 'surface charge density of the shutter (nC/m²)'], tolerance: 0.005,
 gl: [['field of the wire (kN/C)'], ['surface charge density of the shutter (nC/m²)']]
}, {
 canonical: c10b,
 draw: R => pick(() => ({ lam: 5 * R.int(1, 30), d: 5 * R.int(1, 20), Es: R.int(5, 90) / 10 }),
  p => { const El = p.lam * 100 / (2 * Math.PI * 8.85 * p.d), E2 = 2 * 8.99 * p.lam / (10 * p.d); return El >= 0.1 && El < 99 && !tie(El) && Math.abs(r2(El) - r2(E2)) < 1e-9 && !(p.lam === 40 && p.d === 20) && !(p.lam === 30 && p.d === 50); }, c10b),
 build: ({ lam, d, Es }) => { const r = d / 100, den = 2 * Math.PI * 8.85e-12 * r, El = lam * 100 / (2 * Math.PI * 8.85 * d), sig = Math.round(177 * Math.round(Es * 10)) / 100; return {
  prompt: `A long straight guy wire beside the Shield Dome carries a fixed charge of λ = ${n(lam)} nC per metre along its length (1 nC = 10⁻⁹ C). Use ${EPS} and treat the wire as infinitely long. Enter the size of its electric field ${n(d)} cm from the wire, in kN/C (1 kN/C = 1000 N/C, 100 cm = 1 m) to 2 decimal places. A large flat shutter panel has an electric field of ${n(Es)} kN/C close to it, on either side; treat it as an infinite sheet with its charge spread evenly. Enter its surface charge density σ in nC/m², to 2 decimal places.`,
  answer: [r2(El), sig],
  hints: ['For the wire, a Gaussian cylinder gives E = λ ÷ (2πε₀r), with r in metres. Charge in nC per metre over ε₀ gives a field in units of 10³ N/C = kN/C once the powers of ten are collected.', 'For the sheet, E = σ ÷ (2ε₀). Turn it round: σ = 2ε₀E, with E in N/C (1 kN/C = 1000 N/C), and give the answer in nC/m² (1 C/m² = 10⁹ nC/m²).'],
  solution: `Wire: r = ${n(d)} cm = ${n(r)} m, so E = λ ÷ (2πε₀r) = ${n(lam)} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(r)}) ${eq(El * 1000)} ${n(El * 1000)} N/C, which is ${f2(El)} kN/C. (2πε₀r ≈ ${n(den * 1e12)} × 10⁻¹² C²/(N·m).) Shutter: σ = 2ε₀E = 1.77 × 10⁻¹¹ × ${n(Es * 1000)} N/C = ${n(sig)} × 10⁻⁹ C/m² = ${n(sig)} nC/m².`,
  guidance: [
   { prompt: `What is the wire’s field λ ÷ (2πε₀r) at r = ${n(r)} m, in kN/C to 2 decimal places?`, answer: [r2(El)], explanation: `2π × 8.85 × 10⁻¹² × ${n(r)} ≈ ${n(den * 1e12)} × 10⁻¹², and ${n(lam)} × 10⁻⁹ divided by that ${eq(El * 1000)} ${n(El * 1000)} N/C, so ${f2(El)} kN/C.` },
   { prompt: `Turn E = σ ÷ (2ε₀) round with E = ${n(Es * 1000)} N/C. What is σ in nC/m², to 2 decimal places?`, answer: [sig], explanation: `σ = 2ε₀E = 1.77 × 10⁻¹¹ × ${n(Es * 1000)} = ${n(sig)} × 10⁻⁹ C/m², which is ${n(sig)} nC/m².` }
  ] }; }
});

/* A long cable (λ nC/m, either sign) parallel to a large wall (σ nC/m², either sign), D m apart; x runs away from the wall. P is r m from the
   cable on the x-axis: on the far side from the wall when far = 1, between wall and cable when far = 0 (r < D then; far is a 1/0 flag).
   The net field is the sum; draws keep the sum of the two rounded fields equal to the rounded sum. */
const c10c = { lam: -50, sig: 60, D: 3.5, r: 1.5, far: 0 };
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Walking the line between wall and cable',
 brief: 'A crew must walk along the line between a charged wall panel and a charged cable, and Mira wants the field they will feel at one spot.',
 labels: ['wall’s field, x component (kN/C)', 'cable’s field, x component (kN/C)', 'net field, x component (kN/C)'], tolerance: 0.005,
 gl: [['wall’s field, x component (kN/C)'], ['cable’s field, x component (kN/C)'], ['net field, x component (kN/C)']]
}, {
 canonical: c10c,
 draw: R => pick(() => { const r = R.pick([0.5, 1, 1.5, 2]), far = R.int(0, 1); return { lam: R.pick([-1, 1]) * 5 * R.int(2, 24), sig: R.pick([-1, 1]) * 5 * R.int(2, 24), D: r + R.int(1, 3), r, far }; },
  p => { const Es = p.sig / 17.7, mag = 100 * Math.abs(p.lam) / (2 * Math.PI * 8.85 * p.r * 100), El = (p.lam > 0 ? 1 : -1) * (p.far ? 1 : -1) * mag, E2 = (p.lam > 0 ? 1 : -1) * (p.far ? 1 : -1) * 2 * 8.99 * Math.abs(p.lam) / (1000 * p.r), net = Es + El;
   return !tie(Es) && !tie(El) && !tie(net) && Math.abs(net) >= 0.05 && Math.abs(r2(El) - r2(E2)) < 1e-9 && Math.abs(r2(Es) + r2(El) - r2(net)) < 1e-9; }, c10c),
 build: ({ lam, sig, D, r, far }) => { const Es = sig / 17.7, mag = Math.abs(lam) * 100 / (2 * Math.PI * 8.85 * r * 100), dir = (lam > 0 ? 1 : -1) * (far ? 1 : -1), El = dir * mag, net = Es + El; return {
  prompt: `A long straight power cable carries ${n(lam)} nC per metre along its length and runs parallel to a large flat wall panel that carries ${n(sig)} nC/m² spread evenly over it (1 nC = 10⁻⁹ C; a negative number means negative charge). The cable is ${n(D)} m from the wall. Treat the cable as infinitely long and the wall as an infinite sheet, and use ${EPS}. Take the x-axis perpendicular to the wall, with x = 0 at the wall and positive x pointing away from it. The point P is on the x-axis, ${n(r)} m from the cable, ${far ? 'on the far side of the cable from the wall' : 'between the wall and the cable'}. The net field at P is the sum of the two fields (superposition). Enter the x component of the wall’s field at P, then the x component of the cable’s field at P, then the x component of the net field at P, each in kN/C (1 kN/C = 1000 N/C) rounded to 2 decimal places.`,
  answer: [r2(Es), r2(El), r2(net)],
  hints: ['A large sheet has the same field strength σ ÷ (2ε₀) everywhere near it, pointing away from a positive sheet and towards a negative one. A long line has strength λ ÷ (2πε₀r), pointing away from a positive line and towards a negative one.', 'Give each field a sign along x: positive when it points away from the wall. Then add the two components. Between the wall and the cable, away from the cable is towards the wall.'],
  solution: `Wall: E = σ ÷ (2ε₀) = ${n(Math.abs(sig))} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ${eq(Math.abs(Es) * 1000)} ${n(Math.abs(Es) * 1000)} N/C. The wall is ${sig > 0 ? 'positive, so its field points away from it, towards +x' : 'negative, so its field points towards it, towards −x'}: Eₓ ${eq(Es)} ${n(Es)} kN/C${rnd(Es, 'kN/C')}. Cable: E = |λ| ÷ (2πε₀r) = ${n(Math.abs(lam))} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(r)}) ${eq(mag * 1000)} ${n(mag * 1000)} N/C. The cable is ${lam > 0 ? 'positive, so its field points away from the cable' : 'negative, so its field points towards the cable'}, and P is ${far ? 'on the far side of the cable from the wall' : 'between the wall and the cable'}, so the field points towards ${dir > 0 ? '+x' : '−x'}: Eₓ ${eq(El)} ${n(El)} kN/C${rnd(El, 'kN/C')}. Net: ${n(Es)} ${sg(El)} ${eq(net)} ${n(net)} kN/C${rnd(net, 'kN/C')}.`,
  guidance: [
   { prompt: `What is the x component of the wall’s field, σ ÷ (2ε₀) with its sign, in kN/C to 2 decimal places?`, answer: [r2(Es)], explanation: `${n(Math.abs(sig))} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ${eq(Math.abs(Es) * 1000)} ${n(Math.abs(Es) * 1000)} N/C, pointing towards ${sig > 0 ? '+x' : '−x'}, so Eₓ is ${f2(Es)} kN/C.` },
   { prompt: `What is the x component of the cable’s field at P, λ ÷ (2πε₀r) with its sign, in kN/C to 2 decimal places?`, answer: [r2(El)], explanation: `${n(Math.abs(lam))} × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × ${n(r)}) ${eq(mag * 1000)} ${n(mag * 1000)} N/C, pointing towards ${dir > 0 ? '+x' : '−x'} at P, so Eₓ is ${f2(El)} kN/C.` },
   { prompt: `Add the two components. What is the x component of the net field at P, in kN/C to 2 decimal places?`, answer: [r2(net)], explanation: `${n(Es)} ${sg(El)} ${eq(net)} ${n(net)}, so the net field is ${f2(net)} kN/C along x.` }
  ] }; }
});

/* A cable (λ nC/m) and a wall (σ = 17.7j nC/m², so its field is exactly j kN/C), both positive. The distance where the two fields are equal in size
   is r = λ ÷ (πσ) (ε₀ cancels). There, beyond the cable from the wall, both point towards +x: net field 2j kN/C, and the force on a grain of qg nC. */
const c10d = { lam: 60, sig: 35.4, qg: -4 };
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q04', title: 'Where the cable matches the wall',
 brief: 'A charged cable and a charged wall panel push in the same direction beyond the cable, and Mira wants the spot where they are equally strong and the load on a dust grain there.',
 labels: ['distance from the cable (m)', 'net field there (kN/C)', 'force on the grain (μN)'], tolerance: 0.005,
 gl: [['distance from the cable (m)'], ['net field there (kN/C)'], ['force on the grain (μN)']]
}, {
 canonical: c10d,
 draw: R => pick(() => ({ lam: 5 * R.int(2, 30), sig: Math.round(177 * R.int(1, 8)) / 10, qg: R.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]) }),
  p => { const rs = p.lam / (Math.PI * p.sig); return rs >= 0.2 && rs <= 6 && !tie(rs) && !(p.lam === 40) && !(p.lam === 30 && p.sig === 50); }, c10d),
 build: ({ lam, sig, qg }) => { const j = Math.round(sig * 10 / 177), rs = lam / (Math.PI * sig), net = 2 * j, F = qg * net; return {
  prompt: `A long straight cable carries ${n(lam)} nC per metre and runs parallel to a large flat wall panel that carries ${n(sig)} nC/m², both positive charge (1 nC = 10⁻⁹ C). Treat the cable as infinitely long and the wall as an infinite sheet, and use ${EPS}. Take the x-axis perpendicular to the wall, positive pointing away from it, with the cable at a greater x than the wall. Enter the distance from the cable at which the cable’s field is exactly as strong as the wall’s field, in metres to 2 decimal places. At that distance, on the side of the cable away from the wall, both fields point towards +x. Enter the net field there in kN/C (1 kN/C = 1000 N/C), to 2 decimal places. Then a dust grain with charge ${n(qg)} nC sits there: enter the x component of the force on it in μN (1 μN = 10⁻⁶ N), to 2 decimal places.`,
  answer: [r2(rs), net, F],
  hints: ['Write the two field strengths, λ ÷ (2πε₀r) for the cable and σ ÷ (2ε₀) for the wall, set them equal and solve for r. The ε₀ cancels.', 'Both fields point the same way there, so the net field is the sum of their strengths. Then F = QE: a charge in nC times a field in kN/C gives a force in μN, and a negative charge is pushed against the field.'],
  solution: `Setting λ ÷ (2πε₀r) = σ ÷ (2ε₀) gives r = λ ÷ (πσ) = ${n(lam)} ÷ (π × ${n(sig)}) ${eq(rs)} ${n(rs)} m${rnd(rs, 'm')}. The wall’s field is σ ÷ (2ε₀) = ${n(sig)} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) = ${n(j * 1000)} N/C = ${n(j)} kN/C, and at that distance the cable’s field is just as strong, so the net field is ${n(j)} + ${n(j)} = ${n(net)} kN/C. The force on the grain is F = QE = ${par(qg)} nC × ${n(net)} kN/C = ${n(F)} μN.`,
  guidance: [
   { prompt: `Set λ ÷ (2πε₀r) equal to σ ÷ (2ε₀) and solve for r (the ε₀ cancels). What is r in metres, to 2 decimal places?`, answer: [r2(rs)], explanation: `r = λ ÷ (πσ) = ${n(lam)} ÷ (π × ${n(sig)}) ${eq(rs)} ${n(rs)} m, so ${f2(rs)} m.` },
   { prompt: `The wall’s field is σ ÷ (2ε₀) = ${n(sig)} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) N/C, and the cable’s field is the same size at that distance. What is the net field there, in kN/C?`, answer: [net], explanation: `The wall’s field is ${n(j * 1000)} N/C = ${n(j)} kN/C, the cable’s is the same, and they point the same way: ${n(j)} + ${n(j)} = ${n(net)} kN/C.` },
   { prompt: `Multiply by the grain’s charge: F = QE with Q = ${n(qg)} nC. What is the x component of the force in μN?`, answer: [F], explanation: `${par(qg)} × ${n(net)} = ${n(F)} μN.` }
  ] }; }
});

})();
